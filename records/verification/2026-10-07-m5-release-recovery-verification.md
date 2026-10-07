# Verification record: milestone 5 (`m5-release-recovery-verification`, 2026-10-07)

## Result
- Tag `m5-release-recovery-verification` on main 6360420 (merge of m5-fix-6b; tree identical to the verified tip ba53149).
- Orchestrator gate on the final branch: typecheck clean, lint clean, tests 1698 of 1698, 0 skipped. Repository boundary check-range 8fc143b..HEAD clean; internal identifier scan clean.
- Final independent end-to-end walk of the operations guide (m5-fix-6b): 22 of 23 steps worked as documented, including a second release from its own directory with an edge configuration change, a restore sharing the release directory while the source kept running, a dedicated-user simulation, capacity record and public-site check. The one step that did not (a code rollback to a release with another edge configuration) and two further items are P2 documentation/CLI items carried to milestone 6.

## Scope delivered
Release, cutover and rollback bound to the verified release on every instance (contract 21.7–21.9: per-release directories, per-installation verification stamps, start checks of artifact, configuration and runtime on core, edge and staff, the release identity on the service API, opening only when edge and staff run the active release, migration only to the target release, the epoch increment at opening, verification cleared by rollback and restore); backup and restore with interval-loss obligations carried across restores, proven positions only by equality, scope redeclarations that keep earlier candidates, restore-boundary effects for operations and delivery; bounded capacity with truthful health and request deadlines; per-instance descriptors and installation-file ownership for dedicated runtime users; a database unit; a traceability document for every invariant and design test id; operating playbooks and a refusal-code playbook; a stored public-site check report (four owner-input blockers expected).

## Independent review (single agents while the workflow tool was unreachable, then workflows)
- Five commissions (restore, release, capacity, traceability truth, end to end). Code: 5 P0 (1 restore, 4 release with one root cause), all independently validated and reproduced; about 17 P1; P2 parked or folded into documentation fixes.
- Fix chain: m5-fix-1 … m5-fix-6b; every P1 reproduced before its fix; independent fix verifier confirmed 19 of 20 and reopened one (an interrupted rollback could be verified and opened), fixed in round 2 with three P1s from the end-to-end walk (contract 21.9).
- Closing test gaps found one real defect: a Gate 2 exception could be granted while a post-restore protection mark was active (fixed).
- Effort deviation: while the workflow tool was unreachable, single agents inherited the session effort `xhigh` (above the preferred `high`); recorded.

## Carried forward to milestone 6
P2: code rollback to a release recorded with another edge/staff configuration (guide must say to restore that configuration and describe first; verify prints no next step); a tm command whose output pipe closes crashes with an EPIPE stack trace holding absolute paths; `tm admission close` and its kinds are not documented; descriptor digests shorten home paths (dirs must stay outside home directories); installation id from core's data directory (a moved directory needs a new verification); `tm start` starts core when the stamp appears, before verification finishes (opening still refuses); 16 + 7 traceability rows partial with recorded reasons; capacity P2s (staging overshoot by concurrent intents, budgets spent by capacity-refused uploads, capacity failures consume task attempts, two capacity observations that do not measure what they name, memory budget undercounts autovacuum/hash memory, unbounded PostgreSQL server log, queue bound refuses continuations); release P2s (descriptor files.config digest, tm-postgres unit with a hand-started cluster, core unit start-limit budget); restore P2s (resumed restore CA check, resumed restore cancelled-task count).

## Process notes
- The desktop app was unreachable for several hours overnight: workflow and app-connected tools refused (hook timeout); the review ran through single agents; one end-to-end agent hung (probably waiting on an approval prompt the app could not show) and was stopped; its processes were cleaned.
- Five load-dependent test failures were fixed at their root during the milestone (retro notes).
- The owner reset the weekly usage limit on 2026-10-07.
