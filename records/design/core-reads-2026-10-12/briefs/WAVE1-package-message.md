PACKAGE READY: Core lane core-reads-2026-10-12, wave 1 (ITEM-06, 13, 11, 12, 28, 27, 26), branch head 7ad52b2 (on 5f5e26b), deployed on lane-max (uat.py deploy, release rel_18DYBZTC43TKH1929G6R9837FC; no migration; data and accounts kept). Internal records: internal 7520178.

1. Commits (one per item, cherry-picked from three worker worktrees; never pushed):
- b3519e9 ITEM-06 a replayed sign-in code request normalizes the address as the first call does (src/core-api/bindings/identity.ts).
- 8387ecc ITEM-13 the support view of an operator with the accounting grant shows the Accounts surface, read only (sessions.ts, policy.ts accounts.surface_read sv; your grant for the docs/operations.md sentence).
- c9268b0 ITEM-11 incident rows name the current duty holder; a null owner is ownerKind superadmin (your grant: incidents.ts, facade.ts, types.ts, bindings/operations-work.ts).
- 06193af ITEM-12 the incident read serves the report command's bounds: INCIDENT_AFFECTED_MAX 100, INCIDENT_NOTICES_MAX 101, INCIDENT_EVIDENCE_CODES_MAX 102, each with a contract comment (your grant condition).
- 5af3128 ITEM-28 the delivery page lists the newest 100 sends first; an uncertain send outside the window still sets the boundary.
- 144f18a ITEM-27 dlv.selection items carry subjectId and documentVersionId (Kind 1; register line; the two granted literal lines of delivery-words.test.ts).
- 7ad52b2 ITEM-26 dlv.delivery_page carries taAccountEmail on the SuperAdmin surface only (Kind 1; register line).
Every commit body names its grant. A grep for internal identifiers over the seven messages and diffs returns 0. No kernel change, no migration, no new reason code.

2. Checks: npm run check ran on each commit in its own detached checkout.
- b3519e9: 2568 of 2568.
- The other six ran alongside up to six other full checks (load average about 70). Under that load, one to three timing tests failed per commit (8387ecc 2568 of 2569; c9268b0 2571 of 2573; 06193af 2575 of 2577; 5af3128 2577 of 2578; 144f18a 2576 of 2579; 7ad52b2 2579 of 2581). Typecheck and lint were clean on every commit.
- Each commit's failed files passed when rerun alone: test/intake/source-structural.test.ts:51, test/integration/document-ocr-cost.test.ts:69, test/kernel/facts.test.ts:140, and test/system/release-binding.test.ts:74 and :98 (address_in_use, a port collision between the parallel runs).
- A quiet npm run check at the head 7ad52b2: 2581 of 2581.
- Every test failed first; the evidence is in internal records/design/core-reads-2026-10-12/evidence/.

3. Codex reviews (gpt-6.1-sol high, one per item):
- ITEM-06, 13, 26: sound as written; one P2 coverage note each, parked.
- ITEM-27: sound as written; no findings.
- ITEM-11: sound as written; R-01 P2 (UI lane, point 6); R-02 P2 coverage, parked.
- ITEM-12: sound with fixes. R-01 P1: 500 open incidents at the maximum checklist encode to about 4.29 MB, over the staff client's 4 MiB answer cap. R-02 P1 (existed before): incident evidence has no total limit and the read shows the first 100. R-03, R-04 P2 parked (existed before: association 51 candidates against a cut of 20; a notice keeps 50 release references, the deletion notice shows ten).
- ITEM-28: sound with fixes. R-01 P1: the wrong-recipient report form (src/apps/staff/operations/case-work.ts:272) takes its email choices from the 100-send page window, so an old file's email can fall outside it. R-02 P2 parked (resend order under a clock rollback; the command still refuses a second resend).
Max parked the three P1 findings as P2 on 13 Oct 2026 (PLAN D-11). The proposed fixes are in ITEM-12.md and ITEM-28.md.

4. Deviations:
- D-09 (yours): ITEM-26 serves the normalized address.
- D-10 (new): ITEM-26's taAccountEmail is nullable().optional() on the wire, not required. A required field breaks two page literals outside the grant: test/unit/web/delivery-words.test.ts:39 and test/unit/web/packet-handover.test.ts:126. Core always sends the field. To make it required: grant those two lines and I drop .optional().
- Worker test choices: the ITEM-06 test accepts outcome_unknown on the first send (that block's one-shot lost-acknowledgement fault can fall on it when the case runs alone). The ITEM-13 test uses op2 and op3 with explicit grants, because the existing support-view test suspends op1.

5. P2 notes for the register (not worked):
- delivery readEmailsOf still reads the earliest 100 sends for the evidence summary and Core; completion evidence is blind past 100.
- operations viewerIsReviewer and monitorCounts still read the stored holders (same stale-holder class as ITEM-11).
- commands/incidents.ts:178 releaseRefs.slice(0, 50) unchanged (ITEM-12 R-04).
- Test timing: source-structural.test.ts:51 also fails 1 run in 5 alone at b3519e9 under load. I will run the per-commit checks of later waves at most two at a time.

6. UI-lane items (no sentence changes):
- The delivery page's email list is now newest first. src/apps/shared/delivery/pages.ts renders it in array order, so the page shows newest first with no UI change. Tell the UI lane in case its design assumed the earlier order.
- New wire fields the UI does not use yet: dlv.delivery_page taAccountEmail (SuperAdmin only, may be null), dlv.selection items subjectId and documentVersionId.
- An incident whose duty holder ended now reads ownerKind superadmin with a null owner; the staff labels already show that as the SuperAdmin queue.
- ITEM-11 R-01: after a stand-in reviewer's operator returns, the badge of the assigned state still says "With a reviewer" (src/apps/staff/operations/labels.ts:31); make the reviewer wording follow the reviewer duty.

7. Worker sizes (cap 100k per turn, partial return before 275k): wave 1 survey 126k; wave 2 surveys 134k and 183k; W1 (identity) about 100k, W3 (incidents) 153k, W2 (delivery, three items) 181k. All under 275k. Three worktrees ran at once; integration was by cherry-pick.

8. Next: wave 2 per D-08: custody (ITEM-15, 24), catalogue and launch (ITEM-07, 10, 14, 25), payments (ITEM-08, 09). The surveys are done; the grant request follows in a separate message.
