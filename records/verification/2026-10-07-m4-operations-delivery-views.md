# Verification record: milestone 4 (`m4-operations-delivery-views`, 2026-10-07)

## Result
- Tag `m4-operations-delivery-views` on main e85f23b (merge of the review fix branch; tree identical to the verified tip e58f7a5).
- Orchestrator gate on the integrated result: typecheck clean, lint clean, tests 1566 of 1566 pass, 0 skipped, 0 cancelled. Repository boundary check-range c863761..HEAD clean; internal identifier scan clean.
- Earlier integration gates on main: stage A b617fd0 (1437/1437), delivery + views c2c7212 (1510/1510), operations c863761 (1543/1543).

## Scope delivered
- Operations case work: work steps and readiness, Gate 1 at first work (contract D-02) recorded on the work and the act authorization, act evidence and reconciliation with exactly-once exposure, official results and artifacts with association and review copies, wrong-recipient disclosure and incidents (including the country-defect task), custody of originals, failure classification and effort samples; operator and SuperAdmin pages.
- TA delivery: one release check for every byte release, byte streams with slot limits and recorded results, bounded ZIP selections, notices on every surface, packets, handover, manual email, direct external delivery, resend (synthetic transport only), SuperAdmin single-file access with purpose and reason (D-04), and the completion and result-email boundaries as visible known limitations.
- Case projections and measures: applications, assignment queue, TA history, financial follow-up and wait intervals; search, history, SuperAdmin applications list, monitors and monitoring queue; measures M-02, M-03, M-04, M-07, M-08 and M-09 with currency tied to the projections they read. Primary case lists read the authoritative tables (EO-20).

## Independent review (run wf_6941faf5-f46; new orchestration direction)
- Five invariant commissions (release, money and work, disclosure, custody and completion, views) + Principal UX approver. All agents Opus 5.5, effort high.
- Code: 16 findings; 2 P0 (both confirmed by two independent validators: a result file recorded under an incident could attach to any candidate case; an ordinary withdrawal was allowed after an evidenced filing for most offerings), 9 P1, 5 P2. The fixers reproduced 9 of 9 P1 before fixing; 11 of 11 fixed; the fix verifier confirmed every fix and the revert-sensitivity of both P0 tests.
- UX: changes required with 8 P0 + 11 P1 (dead-end disclosure report, misleading "Staff member" attribution, a deletion notice that did not ask for deletion, broken breadcrumbs, unreachable history and selection pages, a misleading next step, misleading custody, a correction dead end), all fixed; recheck "approved" with 6 P2.
- Round 2 not needed. Telemetry and the comparison with milestone 3: `reviews/2026-10-06-m3-review-telemetry-and-orchestration-policy.md` section 8.

## Carried forward
P1, milestone 5: restore scope for case-work rows (readiness, act evidence, artifacts) in the restore boundary; `cutover verify` configuration digests; core-run procedures reading edge's and staff's configuration under per-instance OS users (both from milestone 3).

P2 (parked): DISCLOSURE-3 a second disclosure report on the same version is refused and later recipients cannot be added; CUSTODY-COMPLETION-4 a part returns to "held" from an unknown holder without an attestation; CUSTODY-COMPLETION-5 linking an original does not check the target declaration holds that item type; VIEWS-03/04 measure definitions at the edges (TA corrections after submission, repeats after not-filed); a stand-in incident reviewer keeps ownership when the suspended operator is restored without reassignment; a SuperAdmin disclosure incident without an application; the work-time Gate 1 basis is recorded as a fact only at start of work; a cut selection leaves its ZIP objects to garbage collection; wait-interval boundaries approximate under projector lag; a measure computed during a CLI-rebuild replay counts as healthy; D117 and O45 unserved; reviewer replacement upload through staff; originals refusals on the shell error page; delivery and views lane P2s listed in the runbook. UX P2s for the milestone 6 final pass: button widths, empty evidence tables, applicant name order, line lengths on monitors and measures, the docket owner when an incident is owned by the SuperAdmin queue, mixed owner signals on the TA result step, duplicate result-file labels, an aria-live read-back, incident tables without "what happened", notices without an application column.

## Process notes
- The operations lane failed after 15 minutes on a service overload (API 529); its partial work was snapshotted (hooks on) and the lane was relaunched on top of main with delivery and views already integrated, which let it switch delivery's operations port itself and test the operations and delivery flows end to end.
- Since the owner's backup push, isolated worktrees start from origin/main; every prompt now carries a start-point check (runbook).
- Two load-dependent test flakes fixed during integration (history projection wait; the browser's aborted view transition on a test page without the opt-in).
