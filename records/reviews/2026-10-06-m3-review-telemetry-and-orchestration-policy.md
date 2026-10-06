# Milestone 3 review: telemetry analysis and the proposed M4–M6 orchestration policy (2026-10-06)

Status: analysis (measured) and proposal (for the product owner). Source: run wf_b34b4aea-485 (33 agents), its journal and the per-request usage in each agent transcript, deduplicated by request id. Plan-limit readings come from the app's usage card.

## 1. Measurement notes
- Every agent ran on claude-opus-5-5 at effort high (each response's recorded model and effort; 33 of 33 agents).
- "Processed" = input + cache write + cache read + output tokens. "Fresh" = input + cache write + output. Cache reads are 97% of processed volume. How the plan limits weight each category is not documented to us; section 6 gives an empirical calibration instead.
- Output tokens may exclude part of the thinking; treat them as a lower bound.
- The harness's own "subagent_tokens" figure (5.62M) uses a definition we cannot see; it is not used below.

## 2. Cost by layer

| Layer | Agents | Requests | Cache read | Cache write | Output | Share of processed |
|---|---|---|---|---|---|---|
| Review (6 code lenses + UX approver) | 7 | 735 | 134.6M | 2.38M | 77k | 35% |
| Verify (1 per P1; no code P0 occurred) | 20 | 257 | 15.8M | 1.06M | 25k | 4% |
| Code fixes (3 chained fixers, ≤8 items each) | 3 | 574 | 147.3M | 3.88M | 60k | 39% |
| Fix verify | 1 | 51 | 7.7M | 0.20M | 5k | 2% |
| UX fixes | 1 | 183 | 68.9M | 2.33M | 13k | 18% |
| Round 2 (conditional; not triggered) | 0 | 0 | 0 | 0 | 0 | 0% |
| UX recheck | 1 | 43 | 4.2M | 0.24M | 8k | 1% |
| **Total** | **33** | **1,843** | **378.4M** | **10.09M** | **188k** | 388.7M processed |

Working set per request (cache read ÷ requests): reviewers 150–200k, verifiers about 60k, fixers 210–300k (fix-3: about 300k), UX fixer about 376k. Cost grows with requests × working set, so long, broad agents dominate.

## 3. Yield

Code findings raised: 34 (20 P1, 14 P2). After verification: 18 P1 confirmed, 2 downgraded to P2, 0 refuted. One confirmed pair is a duplicate (CORE-04 and INTAKE-PAY-01: the same unconsumed Gate 1 exception). Accepted and fixed: 17 unique code P1 + 3 architect-carried items. UX: 5 P0 + 12 P1 accepted and fixed; the recheck found 1 more P1 (fixed by the orchestrator) and 5 P2.

| Reviewer | Processed | Unique accepted P0/P1 (duplicates excluded) | Processed per accepted defect |
|---|---|---|---|
| UX approver | 28.4M | 17 (5 P0, 12 P1) | 1.7M |
| OPS (release and recovery) | 14.6M | 7 | 2.1M |
| CORE (case rules) | 12.0M | 4 | 3.0M |
| EXT-TEST (extension, tests) | 19.2M | 3 | 6.4M |
| FAIL (concurrency, failure) | 19.2M | 2 | 9.6M |
| SEC (security, boundary) | 24.1M | 1 | 24.1M |
| INTAKE-PAY (intake, payments, views) | 19.5M | 0 (its P1 duplicated CORE-04; 2 P2) | — |

Whole run: 38 accepted defects (17 code P1, 3 carried, 17 UX, 1 recheck P1), about 10.2M processed (about 270k fresh) per accepted defect.

## 4. Requested rates
- Finding-verifier reversal rate: 0 of 20 refuted (0%); 2 of 20 priority changes (10%, both P1→P2: CORE-05 SuperAdmin field correction without declaration validation, OPS-08 `tm start all` exit handling). No P0 code finding existed, so the two-verifier P0 path was not exercised.
- Fix-check rejection rate: P0 0 of 0 (none), P1 0 of 21 (0%), P2 not checked. The fix verifier added 3 new P2 observations; one matters for production (core-run procedures now read edge's and staff's configuration files, which breaks with per-instance OS users) and is carried to milestone 5 as P1.
- UX recheck: confirmed all 5 P0 fixed; 1 new P1 residue (decision changed) and 5 P2.

## 5. Marginal value of each assurance layer
| Layer | Incremental processed | Decisions changed | Judgement |
|---|---|---|---|
| Review | 137.0M | 38 defects found | Core value; yield per lens varies 14× |
| P1 verifier | 16.9M (12% of review) | 2 downgrades, 0 refutations | Low marginal value for P1 |
| Fix verifier | 8.0M | 0 rejections; 1 production-relevant observation | Cheap independent gate; keep, narrowed |
| Round 2 | 0 (conditional) | — | Conditional layers cost nothing when unused; keep |
| UX recheck | 4.4M | 1 P1 found, P0 fixes confirmed | Highest yield per token after the reviews; keep |

Where additional orchestration stopped improving confidence in this run: the independent P1 verifier (no refutations); stacked full-suite runs inside fixers (about 5 full runs across 3 fixers, plus the fix verifier, plus the parent gate); broad lenses whose territory earlier reviews had already covered (SEC: the phase-1 boundary review had found and fixed the boundary P0) or that overlapped another lens (INTAKE-PAY with CORE on the assistance entry).

## 6. Plan-limit calibration (empirical)
Between 13:49 and 15:53 IST (346 Opus requests: 106.9M cache read, 4.08M cache write, 29k output) the 5-hour window rose from 3% to 30% and the weekly all-models figure from 51% to 54%. Rough calibration: one point of the 5-hour window ≈ 4M processed Opus tokens; one weekly point ≈ 35–40M (the weekly figure is rounded to whole percent). With 5 concurrent heavy read-only agents, the 5-hour window, not the weekly one, would become the binding limit within about 2–3 hours.

## 7. Proposed M4–M6 orchestration policy (for the product owner)
Topology and working set first:
1. Commission by invariant and boundary, not by subsystem: "attempt to violate invariant X at boundary Y" with an explicit file list. Target working set under about 150k per request; split a commission when it would exceed that.
2. Fixers: chunks of at most 4 findings from one subsystem (not 8 mixed); one fixer per chunk; chunks of different subsystems may run in parallel in separate lanes (write cap 3).
3. Lenses for M4: operations case work invariants, delivery byte release and disclosure (security), money/exposure on external acts, concurrency on the new tasks, plus the Principal UX approver. No broad SEC/FAIL re-review of milestone 3 territory.

Verification topology:
4. P0: two independent validators (refute, reproduce) stay. P1: no separate verifier; the fixer reproduces first and may reject with evidence; the fix verifier checks that rejection. P2: parked, no verification.
5. Keep the single fix verifier (P0 fixes all checked with revert-sensitivity; P1 fixes sampled plus a "what did these fixes break" lens). Keep conditional round 2 (P0 only). Keep the UX recheck.

Regression cost:
6. Agents run targeted and affected-subsystem tests; one full suite only when the blast radius is uncertain (migrations, kernel, compose, contracts). The parent runs the full gate once per integration.

Model and effort routing (second-order; cache-read volume dominates either way):
7. Opus high: reviewers, P0 validators, fixers touching invariants, money, authorization, concurrency, migrations. Sonnet high: UI copy and presentation fixes, evidence inventories, mechanical merges without invariant changes. Haiku: none planned in the product lanes.

Concurrency:
8. Writers 3; read-only reviewers and validators 5 (accepted 2026-10-06). Record the 5-hour window use per run against section 6.

M6:
9. Unchanged by this policy: exhaustive independent review of the frozen candidate, broad adversarial fan-out, full-system assurance.

## 8. Milestone 4 review under the new direction (run wf_6941faf5-f46, 2026-10-07)
Configuration: 5 invariant commissions with file lists + Principal UX approver (read-only, up to 5 at a time); two validators per P0 only; no P1 verifier (the fixer reproduces first); subsystem fix chain of at most 4 findings; one fix verifier (P0 revert-sensitivity, P1 rejections, half of P1 sampled, regression lens, targeted tests); UX fixer; conditional round 2; UX recheck. All 17 agents claude-opus-5-5, effort high (every response).

| Measure | M3 review | M4 review |
|---|---|---|
| Agents | 33 | 17 |
| Requests | 1,843 | 1,231 |
| Processed tokens | 388.7M | 246.4M |
| Fresh tokens (input + cache write + output) | 10.28M | 5.04M |
| Wall clock | 5.7 h | 3.7 h |
| Accepted defects (code + UX) | 38 (17 code P1 + 3 carried, 17 UX, 1 recheck) | 30 (2 P0 + 9 P1 code, 8 P0 + 11 P1 UX) |
| Processed per accepted defect | 10.2M | 8.2M |
| Fresh per accepted defect | 270k | 168k |
| Code P0 found | 0 | 2 (both confirmed by both validators) |
| Code review: processed per accepted code defect | 6.4M (broad lenses) | 4.3M (invariant commissions) |
| Reviewer working set per request | 150–200k | 135–161k |
| Fixer working set per request / processed per fixed item | 210–300k / 7.2M | 113–182k / 4.7M |
| Verification layer cost | 4% (20 P1 verifiers, 0 refuted) | 2% (4 P0 validators, 0 refuted) |
| P1 handling | separate verifier | fixer reproduced 9 of 9 before fixing; 0 rejected |
| Fix-check rejections | 0 of 21 | 0 of 11 (P0 revert-sensitivity confirmed) |
| UX fixer share / working set | 18% / 376k | 39% / 360k (261 requests, 80 min) |
| UX recheck | 1 new P1 | approved; 6 P2 |
| Round 2 | not triggered | not triggered |

Findings:
1. Invariant commissions found two code P0s (a result file recorded under an incident could attach to any candidate case; an ordinary withdrawal was allowed after an evidenced filing for most offerings) that the broad lenses of milestone 3 would likely have needed far more tokens to reach. Narrow commissions improved yield per token by about a third.
2. Dropping the P1 verifier lost nothing measurable: every P1 reproduced in the fixer's own first step.
3. The UX fixer is now the dominant cost (39%): one agent carries about 360k tokens per request across 19 screens, inflated by screenshots kept in context. Next change: split UX fixes into screen groups of at most 5 findings, keep screenshots out of the working context (write them to disk, inspect selectively), and let the independent recheck carry the full visual pass.
4. Fixer working sets fell to 113–182k per request with subsystem chunks of at most 4.
