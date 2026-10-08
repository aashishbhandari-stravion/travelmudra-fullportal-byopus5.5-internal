# Verification record: milestone 6 (`m6-final-assurance`, 2026-10-08)

## Result
- Tag `m6-final-assurance` on main 7be21b1: one `--no-ff` merge of `m6-ux-final` (de77bfd) into main 6360420. The merged tree is identical to the verified tip (`git diff de77bfd 7be21b1` is empty).
- Final checks on de77bfd: typecheck clean, lint clean, tests 1846 of 1846, 0 skipped, three times (the final UX fixer's run, then two orchestrator runs in parallel under load). The integration tip before the last UX fixes (546920e) passed 1821 of 1821 twice.
- Repository boundary: check-range 6360420..7be21b1 clean; internal identifier scan of the tree and of the commit messages clean; branch and tag names clean after the cleanup. The whole-history check found only the known false positive (the curve name in an early commit).
- Traceability (`docs/verification/traceability.md`, 399 identifiers): 317 proven, 78 partial with the missing assertion stated, 4 recorded gaps. `test/static/traceability.test.ts` passes.

## Scope
Milestone 6 is the final assurance pass over the frozen candidate 6360420 (milestone 5): an exhaustive independent review, fixes, a test-stability pass, a second review round, a UX pass with a recheck, a final end-to-end walk of the operations guide, and final checks.

## Independent review (stages 1 and 2)
- Eight commissions: four specification lenses (SPEC1..SPEC4), security, flows, maintainability, extension. 34 findings after deduplication, ranked after validation: 4 P0 (SPEC4-01, SPEC3-01, and two raised from P1: SPEC2-03, SEC-01), 17 P1, 13 P2. Findings with scenarios: `reviews/2026-10-07-m6-findings.json`.
- P0 summary:
  - SPEC2-03: document evidence changed while a filing may have occurred (fields and identity were held, documents were not).
  - SPEC4-01: a download was recorded as received when the browser had received nothing or only part of it.
  - SPEC3-01: a correction held during a possibly filed fee act stayed held after the act was evidenced as filed.
  - SEC-01: incident access through the owner or reviewer relation outlived reassignment.
- Every P0 was independently validated and reproduced. Every P1 was reproduced by its fixer before the fix.
- A power outage interrupted the review run after all reviews and validations. The findings were rebuilt from the workflow journal. No finding was lost.

## Fixes (stage 3 and round 2)
- All 4 P0 and 17 P1 fixed on fix branches, integrated in three waves with affected-subsystem tests (m6-fix-int-1..3).
- Test-stability pass: eight intermittent failures investigated to the root. Three were product defects and are fixed: a connection between instances without an error listener could end the process on a reset; the cutover checkpoint did not wait for a runtime statement in flight; a backup tool's output could be lost when its consumer attached late.
- The fix verifier sampled 13 fixes and confirmed them. It found one residual P1 (delivery pages still said "Received"), fixed in round 2 together with two more items: travel-date rechecks that a failed country check left unknown now run again (also by staff), and evidence notes with no space after a full stop are accepted while addresses are still refused.

## UX pass and recheck
- UX approver: changes required. 5 P0: UX-1 recheck docket; UX-2 packet handover deadlock; UX-3 deletion notice missing from the travel agent's attention; UX-4 another applicant's file shown (privacy); UX-5 Accounts surface unreachable. Also 8 P1 and 5 P2. axe found 0 violations on about 250 pages.
- Fixes in four screen groups of at most five findings each (operations, travel agent A, travel agent B, navigation). An integrator fixed three merge breakages and two follow-up P1s: the draft docket while a recheck is pending, and core refusing to reclassify a document version accepted for an application.
- UX recheck at 546920e: approved with conditions. All 15 items fixed. New P1 R-1 (the staff docket told the operator to record a packet handover that the product refuses until the travel agent's download is sent in full) and P1 R-2 (the file field overflowed at 375 px and below). Both are fixed on m6-ux-final (de77bfd, 590e761) with tests. 72 pages at 1280 and 390 px, 11 in dark mode: every page 200, axe 0 violations, no CSP or script error.

## Final end-to-end walk (546920e)
Sections 1 to 8 of the operations guide and the playbooks on a throwaway installation: install, database, migrations, scanner, first registration and cutover, start, health, opening, seeding, travel-agent and operator sign-in, a second release with an edge configuration change, close, code rollback with the configuration restored, backup, restore with reopening while the source ran, capacity and the public-site check. All worked as documented. No P0 or P1.

## Parked (P2, not worked)
- Review: SPEC2-04 (dependency link runs no control evaluation); SPEC4-03 (completion check accepts any result notice of the application); SPEC3-04 (a dependency on an upstream that ended with its group stays unmet); SEC-02 (the fetch worker's IPv6 deny list lacks the IPv4-compatible block ::/96); FLOW-04 (an application stays editable after an accepted withdrawal); MAINT-03..07 (duplicated state literals, unused exports, an outdated layer table, unchecked cross-module reads, a 370-line composition function); EXT-04..06 (extension procedure and test registration details).
- UX: UX-14..18 (wording, raw codes and name order on some travel-agent, admin and operations pages; line length; an aria-live gap on money read-backs). Recheck: R-3 (a recheck that failed for good reads as "not run yet"), R-4 (support view disables a read-only notice link), R-5 (applicant name order on the SuperAdmin applications list), R-6 (line length and table padding at 390 px).
- Walk: `tm start all` exits 78 and stops every instance during a rollback across a configuration change (restart by hand); rollback option 1 has no documented source for the earlier configuration files; `tm install describe` suggests an unneeded release registration after the configuration is put back; no documented tester procedure for sign-in codes, and a restored installation has no mail transport, so nobody can sign in there after reopening; scanner signatures live in a per-user data directory that the guide does not name.

## Process notes
- Merge rule applied: stages and waves were integrated on integration branches with affected-subsystem tests; main received one merge for the milestone, after the full checks.
- The workflow tool was unreachable for part of the night; single agents carried the work and inherited effort `xhigh` (above the preferred `high`).
- The power outage reset `/tmp`; the shared agent context now lives in `internal/agent/context/m6-context.md`. Lesson: editing or moving an early `agent()` call before a resume reruns every later call.
- Cleanup: all worktrees and branches removed; only main remains. The one unmerged work-in-progress snapshot (21b2233, superseded by m6-stability-2) is archived as a verified git bundle outside the repositories: `~/.local/share/travelmudra-archive/m6-stability-wip-21b2233.bundle`, SHA-256 e71807079d36f29b5fd17cab17f14ca2eca44c44839bbd878169e69fd35383fd.
- Local preview: installed from the tag with the product's own procedure (see `FINAL-REPORT.md` section 9).
