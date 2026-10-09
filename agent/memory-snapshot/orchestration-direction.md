---
name: orchestration-direction
description: "Max's direction (2026-10-06) for UC/workflow orchestration in M4–M6 — keep the intelligence, cut redundant assurance loops; M6 stays heavy"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 2f6f1696-2924-4446-bd46-91bb768d9648
  modified: 2026-10-06T06:00:53.453Z
---

Max (2026-10-06), after the M3 review launch. Not optimizing for tokens or wall-clock (1–2 extra days acceptable); the goal is a structurally correct assurance process without redundant work.
1. Keep reasoning strength: Opus 5.5 / high effort for security, authorization, concurrency, money, architecture-heavy reasoning and P0 analysis.
2. Cut redundant loops. P0 → independent reproduction/validation. P1 → the fixer reproduces before fixing; no automatic extra reviewer. P2 → no stacked verification without a specific reason. Avoid reviewer→verifier→fixer→second-verifier chains that add no confidence.
3. Route by reasoning risk, not task type. Mechanical or evidence work may use cheaper models. Well-specified work may use lower effort. A test, port or merge touching a critical invariant still gets strong reasoning.
4. Agents run targeted/affected-subsystem tests; the full suite runs at the parent milestone gate unless the blast radius is genuinely uncertain.
5. Prefer narrow specialist commissions ("attempt to violate invariant X at boundary Y") over broad from-scratch subsystem reviews.
6. Exhaustive fan-out is not the default: direct parent execution for straightforward work, focused delegation where specialist reasoning helps, broad adversarial fan-out only for high-risk boundaries and the M6 pass.
7. M6 stays intentionally heavy: exhaustive independent review of the frozen candidate.
He writes "UC" instead of the keyword to avoid triggering orchestration turns. He wants UC to help improve how UC is used, not to switch it off.

**Why:** session limits hurt progress, but quality (the P0s found by independent review) matters more than cost.

**How to apply:** after the M3 review run (wf_b34b4aea-485) finishes, mine its telemetry and propose a concrete M4–M6 orchestration policy to Max. Required metrics (Max, 2026-10-06): tokens per confirmed/accepted defect; unique new defects per review agent (duplicates excluded); finding-verifier reversal rate; fix-check rejection rate split by P0/P1/P2; marginal defect/decision yield of each successive assurance layer; where meaningful, incremental assurance value vs incremental tokens per layer. Purpose: find where more orchestration stops materially improving engineering confidence. Optimize working-set size, fan-out and verification topology first, model/effort routing second. Never alter a commissioned run mid-flight. Related: [[efficiency-rules]], [[delegated-decisions]], [[data-privacy]].

Correction (Max, 2026-10-07): the standing authority says only that the orchestrator may merge into main "once that milestone's checks pass on the integrated result". It does NOT say every merge into main needs a full suite. I had over-read it and merged each stage into main with a full run. Rule from now on: integrate stages and fix waves on an integration branch with affected-subsystem tests; merge into main once per milestone, after that milestone's full checks.
