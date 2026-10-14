---
name: ui-plan-from-specs
description: "Architect's spec-only UI plan (10 Oct 2026) in internal/records/design/ui-plan-from-specs-2026-10-10; Max's 10 Oct decisions (OD/PD apply to Opus, B46 closed, Goku review withdrawn, surface inventory authorized, UAT triage rule, Core Kind 1/Kind 2 gates)"
metadata:
  node_type: memory
  type: project
  originSessionId: d496a8a1-91b1-4335-956e-fb0f4ca7be71
  modified: 2026-10-10T20:30:00.000Z
---

On 10 October 2026 Max had the architect (this session, sole decision owner) plan the UI from the two Astra UX
specs plus BUILD_SPEC only, no code read. Committed in the private repo at
`internal/records/design/ui-plan-from-specs-2026-10-10/` (plan commit 43d3906; Goku prompt 9a488ae).

Decisions of 10 Oct 2026 (file `DECISIONS-2026-10-10.md` in that folder):
- The 5 Oct owner decisions OD §§2–6 and provider decisions PD apply to Opus (architect verified they are
  implementation-agnostic; OD §1, §7, §8 are Astra execution plans and do not transfer). B46 closed by owner
  decision. OC-01..07 resolved; OC-08 input; OC-09, OC-10, RF-07 still Max's.
- Goku review of the plan WITHDRAWN (prompt kept as record; do not launch).
- Debate outcome: plan ≈60% restatement / 40% design; compare product against SPECS not plan; do not salvage
  pages, keep shell; the 8 Oct independent review already scored UI alignment 64.3% main / 50% bulk at 7be21b1.
- Surface inventory DONE 10 Oct (`SURFACE-INVENTORY-2026-10-10.md`): 110 plan rows → 91 Exists / 13 Partial /
  6 Missing; no kernel need; Kind 1 candidates = intake per-state counts (P1), SA decision inbox, originals
  register; Kind 2 = Send result + Request completion (policy decided, build gated), rest rejected. Code has
  57 commands no plan row names (53 served) → rewrite must home them or Max hides. OC-09 and RF-07 CLOSED by
  Max 10 Oct on the inventory's evidence (DECISIONS §1.5, commit 89cb206); only OC-08 (input) and OC-10 remain.
- Bulk enhancement reference (10 Oct, `internal/records/design/bulk-enhancement-2026-10-10/`): Astra's bulk
  backend work (main be30e73; lanes 9689ce3, 455badd not integrated; B5 rerun never ran) read as REFERENCE only,
  per Max "not to be replicated as is"; prompt for Astra written there and ANSWERED 10 Oct evening (Astra private
  commit 88f21ef, `records/bulk-backend-handover-for-opus-2026-10-10.md`, read-only); answers mapped to the eight
  §6 questions in reference §10 (internal commit 0609810; six inputs ACKNOWLEDGED by Max, commit after 0609810). Key inputs: Max's sizing target = 100 applicants / 500
  docs per workload, several at once (his words, 6 Oct); TA 2 waited 441 s for its first document when admitted
  together with TA 1 (fairness number); ~2/3 of real docs need no OCR; no 429/503 ever observed; Drive can
  return a virus-scan HTML page instead of the PDF; same-TA two-group case never run on real data; B5 never ran;
  Astra-side items for Max: freeze be30e73 vs 455badd, durability promotion, archive expires 8 Nov 2026. Reference record §8 = Max's directions (orchestrator-based; fault tolerant with recovery as a
  module; B38 one-fetch is a measurement start, not a limit; per-TA cap must accept-and-queue, never refuse);
  §9 = architect's fault-tolerance thoughts (three failure classes; outcomes carry producing version; re-run by
  version; audit facts vs capacity telemetry). Internal commits 72436d2, 4d07813, 73eaa93, f0d3158, 0609810.
- State at end of 10 Oct: Max does manual UAT in the evening of 10 Oct; OC-08/OC-10 exec summary + "can these
  wait" recommendation requested; build stays PARKED. Next step Max named: an EXECUTION PLAN first, then run the
  UI rewrite and the bulk upload enhancement as parallel lanes (max 3 lanes, one writer per tree). Max believes
  the bulk requirement is already crisp from Astra's iterations; architect's honest view: the disciplines, failure
  modes, real-run numbers and acceptance template are stable, but 8 design questions (reference §6) and the Astra
  prompt answers are open, so a bulk requirements/acceptance document is the first execution-plan item.
- CHECK (Max, 10 Oct evening): BEFORE the bulk upload lane starts, nudge Max to sit with the Opus architect and
  close the open bulk questions (reference §6 + Astra prompt answers) in one discussion; output = bulk
  requirements/acceptance doc in the bulk-enhancement folder. Max said he does not override such nudges.
  Recorded in reference §6 preamble (internal commit after 73eaa93).
- OC-08 and OC-10 PARKED by Max 10 Oct evening with reasons (DECISIONS §1.6): OC-08 due at production
  readiness bundled with real business details; OC-10 default stands (SuperAdmin-created accounts), request
  route would be Kind 2. No open owner choice blocks the execution plan.
- Kernel off limits for the UI rewrite. Core Kind 1 (new projection of existing facts) allowed under a
  reviewer-enforced criterion with code comment + register; Kind 2 (new command/behavior) is a one-way door:
  written proposal, independent review, Max decides, default no, own lane.
- Max does manual UAT himself (template `internal/records/uat/2026-10-10-max-uat-findings-TEMPLATE.md`);
  findings are NOT fixed ad hoc: class A backend/data fixed now, B policy → owner decision, C view → rewrite
  acceptance list, D question. Implementation plan waits for UAT findings. Build authorization parked.

**Why:** Max wants a holistic rewrite from a complete plan, not circular salvage; Core must not be biased by UI.

**How to apply:** read DECISIONS-2026-10-10.md before any UI-rewrite planning; no implementation without
Max's named authorization. See [[lane-convention-nested]] for lanes.

- UAT pass 1 (12 Oct 2026, TA role only, build 7be21b1): 13 findings in internal records/uat/2026-10-12-max-uat-findings.md (becd276); triage record records/uat/2026-10-12-uat-pass1-triage.md (ddf1958): class C -> rewrite acceptance additions (plan gaps UAT-01/02/10/11), class A (UAT-12 P0 parked Drive listing format mismatch, UAT-13, UAT-08) -> post-rewrite, proposed owner = bulk refactor lane; owner decisions Q-1..Q-7 open. Max: fix nothing now. Next: questions to Max, then two prompts (Mega UI revamp; bulk refactor). Bulk prompt needs the §6 discussion first.

- 12 Oct 2026 late: Max answered Q-1..Q-7 (UAT-03/04 P2; services-per-group Kind 2 direction YES; bot check off bulk+correction forms; UAT-09 Indian passport 2 letters+6 digits valid -> A/P0; UAT-14 passport exactly 2 pages, 1 or 2 files). Links for public folder/sheet in ~/.local/share/travelmudra-uat/external-sources.local.json (never in files/chat). EXECUTION: internal records/design/execution-2026-10-12/ (README, SEAM-CONTRACT v1, UI-REVAMP-PROMPT, BULK-REFACTOR-PROMPT) commit 5197a69 (amended). Lanes created by hand: ui-revamp-2026-10-12 (lane-ui 4650/4652/4651/4653), bulk-refactor-2026-10-12 (lane-bulk 4660/4662/4661/4663), base 102e4c9. Bulk prompt phase 0 = the §6 sitting with Max inside the lane chat -> BULK-REQUIREMENTS-AND-ACCEPTANCE.md. Each lane: Opus 5.5 = Principal Technical Architect with PSE/PUX/PPM/independent reviewer subagents. Preview (4610/4612) was NOT in the UAT registry nor running on 12 Oct evening.
