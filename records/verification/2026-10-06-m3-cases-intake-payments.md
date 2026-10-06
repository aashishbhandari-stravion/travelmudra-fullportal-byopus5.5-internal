# Verification record: milestone 3 (`m3-cases-intake-payments`, 2026-10-06)

## Result
- Tag `m3-cases-intake-payments` on main 4eb3d1a (merge of the review fix branch; tree identical to the verified tip 182e86b).
- Orchestrator gate on the integrated result: typecheck clean, lint clean, tests 1421 of 1421 pass, 0 skipped, 0 cancelled (320 s). Repository boundary check-range 819139e..HEAD clean; internal identifier scan clean. (The ref-name check flags local transient branch names containing "b34"; they were deleted after the merge and are never pushed.)

## Scope delivered
Core case model, intake and document association, payment records, derived views and audit, release and recovery tooling, on the three-instance architecture: core (database, blobs, domain, mutual-TLS JSON API with default-deny allowlists), edge (public site, TA surface, intake, processing service) and staff (Ops, SuperAdmin, Accounts). The single-process server is retired; every product page and form test runs on three processes.

## Independent review (run wf_b34b4aea-485)
- Six code lenses + Principal UX approver; verifiers per P1; three chained fixers; fix verifier; UX fixer; UX recheck. All agents Opus 5.5, effort high.
- Code: 0 P0; 20 P1 raised, 18 confirmed (2 downgraded to P2, 0 refuted, 1 duplicate pair); 17 unique P1 + 3 architect-carried items fixed; fix verifier: 21 of 21 fixed, revert-sensitivity spot-checked.
- UX: changes required with 5 P0 + 12 P1, all fixed; recheck "approved with conditions" with 1 new P1 (the docket said "Nothing is needed from you" beside "Also needed: Pay"), fixed by the orchestrator in 182e86b with a sensitivity-proven test; 5 P2 parked.
- Telemetry and the proposed orchestration policy: `reviews/2026-10-06-m3-review-telemetry-and-orchestration-policy.md`.

## Carried forward
P1 (architect ranking; delegated decisions):
- Milestone 4 stage A: CORE-07 impossible dates of birth (for example 1990-02-30) are accepted and rolled over; raised from P2 because identity data changes silently. FAIL-3 the operation lookup page tells the user "nothing was recorded, safe to submit again" whenever no operation row exists, also while the first request may still commit; raised from P2 because it invites a duplicate submission.
- Milestone 4: a three-instance test of an accepted external act and its single exposure reservation (needs operations case work).
- Milestone 5: `cutover verify` does not compare configuration digests with the active release's manifest; core-run procedures (backup create, release register, capacity record) read edge's and staff's configuration files, which fails once each instance runs as its own OS user.

P2 (parked): CORE-05 SuperAdmin field correction without declaration validation; CORE-06 withdrawn draft shows progress "Draft"; INTAKE-PAY-02 measures M-07/M-08 still pending; INTAKE-PAY-03 spreadsheet columns beyond 64 dropped silently; SEC-2 SuperAdmin intake oversight returns cell samples; FAIL-4 core's cached processing health ignores refusals during edge self-test; OPS-08 `tm start all` stops every instance when core exits 75; OPS-09/OPS-10 CLI wording and documentation drifts; EXT-TEST-04..08 (adapter mapping unused, dead exports, stale comments partly fixed, an always-true assertion, hard-coded classification labels); `tm tls init` temporary CA key left on crash; shared diagnostic file between the cutover probe and a supervised core; possible timing flake in test/views/measures.test.ts (3 failures in one loaded run, green alone and in the next full run); UX R-02..R-06; stage C1/C2 P2s (operator artifact upload route, shared upload rate-limit keys, intake forms not on the case page, generic upload error page, no database unit, edge public site up while admission is closed).

## Process notes
- Stage C2's first attempt ran in the internal repository (the orchestrator's shell had changed directory during the run); it made no change. Lesson recorded in the runbook.
- One verifier's safety-classifier check timed out; the orchestrator reviewed its tool calls (read-only, one probe test created and deleted in its own worktree).
- The product owner pushed main 819139e and tags m1/m2 to the private remote as a backup during the run.
