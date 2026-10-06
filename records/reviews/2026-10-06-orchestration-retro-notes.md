# Orchestration observations for a later retro (2026-10-06)

Status: raw observations, recorded during the milestone 3 review run. Not yet analysed. The full post-run analysis (metrics requested by the product owner: tokens per accepted defect, unique defects per reviewer, verifier reversal rate, fix-check rejection by priority, marginal yield per assurance layer) follows when run wf_b34b4aea-485 ends.

## Run configuration (milestone 3 review, wf_b34b4aea-485)
- Topology: 6 code lenses + 1 Principal UX approver; 2 verifiers per P0 and 1 per P1; chained fixers of at most 8 items; 1 fix verifier; 1 UX fixer; 1 conditional round 2; 1 UX recheck.
- Concurrency: a limiter in the script holds at most 3 agents at a time. Workers may not start sub-agents.
- Models and effort: every agent call sets effort high and no model override. The transcripts of the first 8 agents show model claude-opus-5-5 and effort high on every response (verified, not assumed).

## Observations so far
1. Yield. Code lenses: 0 P0; 20 P1 raised; verifiers confirmed 18 as P1, downgraded 2 to P2, refuted 0. UX approver: changes_required with 5 P0, 12 P1, 1 P2 (workflow dead ends and misleading money/status communication).
2. The P1 verifier layer reversed no finding so far (0 of 20). Early signal that a separate verifier per P1 adds little confidence.
3. Token profile of one reviewer (CORE, 63 API requests): about 276k tokens written to cache, about 11.7M read from cache (about 186k per request), about 8k output tokens (output may exclude part of the thinking). The working set carried from turn to turn dominates the volume.
4. Fixers run the full suite at least once each, sometimes twice (fix-2: one red run, then green). Repeated full regressions are a measurable cost.
5. Fix-2 found and fixed a pre-existing intermittent bulk-admission race. Long chains do surface latent flakiness.
6. No 5-hour limit was hit during this run (earlier runs with 5–6 concurrent heavy agents hit it within an hour). Contributing factors, not separated: the 3-agent limiter, the no-sub-agents rule, and a 5-hour window boundary during the run.
7. Plan usage at 13:49 IST: 5-hour window 3% (it had just reset); weekly all models 51% about 26 hours into the week (resets 12 Oct about 17:30 IST); weekly Fable 6%; extra usage off. The weekly allowance, not the 5-hour window, is the binding constraint at this pace. The product owner can add quota to reset the weekly limit.

## Other data points from the same day
- Stage C (2 sequential agents, Opus, high): about 1.17M sub-agent tokens.
- Cloud and privacy research (3 agents for two documentation questions): about 220k tokens. One agent or a direct answer would have been enough.
- Milestone 4 gap inventory (1 Sonnet Explore agent, read-only): about 360k tokens, 115 tool calls, about 10 minutes. Useful and reused in the milestone 4 plan.
- Process incident: stage C2 first started in the internal repository because the orchestrator's shell had changed directory during the run; a workflow resume then replayed that completed no-op agent until its prompt was edited.

## Decision recorded (architect, delegated by the product owner)
- The concurrency cap is a tunable experiment, not a fixed rule, while the no-sub-agents rule holds. Milestone 4: write-capable lanes stay at 3 (integration conflicts, not tokens, limit them); read-only review and verification agents may run up to 5 at a time. Measure 5-hour window use per run to compare against this run.
- Accepted by the product owner on 2026-10-06.
