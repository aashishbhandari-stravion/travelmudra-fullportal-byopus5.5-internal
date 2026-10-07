# Milestone 6: plan (architect, 2026-10-07)

Status: plan. Milestone 6 is the final assurance milestone: an exhaustive independent review of the frozen candidate, fixes, the bounded final UI/UX pass, the final verification and the report to the product owner. The product owner asked that milestone 6 stay intentionally heavy (orchestration direction, 2026-10-06). The weekly usage limit was reset on 2026-10-07.

## Stage 0 — freeze (orchestrator)
Merge milestone 5 and tag `m5-release-recovery-verification`. The candidate for review is that tag. Remove the stale review worktrees.

## Stage 1 — test stability (1 writer, Opus high; in parallel with stage 2)
Run the full suite several times under parallel load and remove timing assumptions in tests: wait on the condition that matters, deterministic races, ports below the ephemeral range. Product code changes only when a real defect shows. Retro note: five load-dependent test failures surfaced at the parent gate in milestones 4 and 5.

## Stage 2 — exhaustive independent review (read-only, up to 5 at a time, Opus high)
Commissions (narrow, with file lists; each reproduces its findings):
1. Spec sweep, rules 1–10 (surfaces, population, work unit, service shapes, offerings, publication, launch control, identity, email change, object access).
2. Spec sweep, rules 11–20 (privileged authority, private bytes, artifacts, intake, document evidence, attempts, submission and price, assigned editor, assignment protection, control kinds).
3. Spec sweep, rules 21–30 (outcomes, dependencies, external acts, withdrawal and closure, group end, Gate 1, government fees and Gate 2, exposure, accounts boundary, originals).
4. Spec sweep, rules 31–47 (delivery truth, measures, audit, sole writers, atomicity, content and country failure, local installation, capacity, release, backup and restore, verification, excluded, parked and known-limitation scope, owner-decision boundaries visible as unavailable).
5. Adversarial security across the whole product: the policy matrix on every route, the three-instance boundary and release binding, uploads and byte release, sessions and CSRF, the fetch worker, secrets and personal data in logs, diagnostics and the public site.
6. Cross-module concurrency and failure: end-to-end flows across intake → core → payments → operations → delivery under races and crashes.
7. Extension: onboard a synthetic third country and a new service on existing shapes by following docs/extending only.
8. Maintainability: dead code, duplicated rules, module boundaries, contract drift between docs and code.
Validation: every P0 by two independent validators; every P1 by one validator (milestone 6 is heavy by design). P2 parked unless cheap and documentation-only.

## Stage 3 — fixes (writers 3)
Subsystem chunks of at most 4 findings; P1 reproduced first; tests proven sensitive; parallel writers on separate subsystems, merged by the orchestrator; one independent fix verifier.

## Stage 4 — bounded final UI/UX pass (the three design skills)
Principal UX approver across every surface (public site, TA, operations, SuperAdmin, accounts), including the parked UX P2s of milestones 3 and 4. UX fixers by screen group (at most 5 findings each; screenshots kept on disk, inspected selectively). Independent UX recheck. Material improvements only; no open-ended polishing.

## Stage 5 — final verification (orchestrator)
Full suite three times; repository boundary check over the whole history; traceability with every row proven or a recorded gap; an end-to-end walk of the operations guide; the public-site check report; a capacity record; a final verification record.

## Stage 6 — report to the product owner
Delivered scope; ENGINEERING_OVERRIDES (EO-01..); delegated decisions and their alternatives; owner inputs still missing; production-readiness hand-off (real mail transport, Cloudflare or a reverse proxy in front of edge, per-instance OS users, public hostname and search readiness with the owner's inputs); parked findings; process notes (the `--no-verify` slip in milestone 2, the P-256 history false positive, the overnight host outage and the effort deviation, the hung end-to-end agent); orchestration retro with telemetry.
