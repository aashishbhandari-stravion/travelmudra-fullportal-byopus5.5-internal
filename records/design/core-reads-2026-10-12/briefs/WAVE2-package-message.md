PACKAGE READY: Core lane core-reads-2026-10-12, wave 2 (ITEM-08, 09, 15, 24, 14, 07, 10, 25), branch head 3a81652 (on 7ad52b2), deployed on lane-max (uat.py deploy, release rel_731PPC3AMZ8W3Y9CPVB310N113; no migration; data and accounts kept). Internal records: internal 66c3725.

1. Commits (one per item, one per group for ITEM-07 and ITEM-10, review follow-ups separate; cherry-picked from six worker worktrees; never pushed):
- f1a2a2d ITEM-08 a payment correction that changes only the event date is accepted (payments service-status.ts).
- 7eb943a ITEM-09 the SuperAdmin payments page shows the real Gate 1 and Gate 2 basis: Core gateView with the reader's application.read relation at stage 1 and the evaluator's stages 2 to 12 (no stage copied; evaluateControls and every command path unchanged).
- cdbf29b ITEM-15 the 51st original of an application and the 51st link of an original are refused control_blocked/limit_exceeded; the share's target lock is now update.
- f309b23 ITEM-24 new query ops.originals: the originals register for operators and the SuperAdmin, under the application read scope; never the item key; 500 rows with a truncated flag (Kind 1; register line).
- 60fd311 ITEM-24 review follow-up, tests only: partial link visibility after a reassignment, the per-service rule, refused actors; two mutations each fail a new test.
- 95eb5e0 ITEM-14 the publication staleness fingerprint covers every open application of the offering (id, lifecycle, acts, filed evidence, price, payment, travel dates). D-12: the one-aggregate-query condition is parked (Max).
- 894667b ITEM-07 (1) approve and expand compare an optional expectedOfferingRevision; ops.launch_offering serves offeringRevision (additive).
- 5779060 ITEM-07 (2) a replayed launch-plan form gives the identical command input (codes from the posted field names).
- 05d7b46 ITEM-10 (d) the pending answer asks launch control: a suspension hold names the SuperAdmin and record_existing_work_treatment; a withdrawal without continuation names the SuperAdmin and record_outcome (D-14, Max's words).
- da20fd7 ITEM-10 (b) a second transition approval after the travel agent declined is refused impact_decision_not_allowed.
- 10916cc ITEM-10 (a)+(c) a declined transition returns its impact item to pending (new additive catalogue port CatalogueApi.noteTransitionDeclined, frozen-interface record in the body); the approval targets the head the item's assessment reviewed and refuses impact_item_not_current otherwise.
- 6b9b87d ITEM-25 A the TA case read carries launchEffects per existing-work action (Kind 1; register line).
- 96bcf5d ITEM-25 B new SuperAdmin query cat.admin_offering_impact_items (Kind 1; register line). Its test was reordered at integration, because ITEM-10 (c) refuses an approval whose reviewed head is not current.
- 3a81652 ITEM-10 (d) review follow-up (D-15): every draft under a withdrawal is pending on the SuperAdmin to close it (offering_withdrawn, record_outcome); a withdrawal comes before a suspension; where the operational withdrawal would refuse the close, the answer is unresolved_known_limitation with the SuperAdmin as follow-up and next action none; the assisted-draft rule applies only while no outcome is recorded.
- 3a81652 replaces e0b978d (the first id of that follow-up, never sent): e0b978d made a value-import cycle (withdrawal.ts -> derived.ts -> writers.ts -> derived.ts) that test/static refuses; assessWithdrawal moved into derived.ts, behaviour unchanged. Lane rule since: test/static on every branch before integration.
Every commit body names its grant. A grep for internal identifiers over the fourteen messages and diffs returns 0. No kernel change, no migration, no new reason code.

2. Checks: npm run check on each commit in its own detached checkout, one at a time.
- f1a2a2d 2582/2582; 7eb943a 2587/2587; cdbf29b 2589/2589; f309b23 2591/2592; 95eb5e0 2595/2596; 894667b 2599/2599; 5779060 2601/2601; 05d7b46 2603/2603; da20fd7 2604/2604; 10916cc 2606/2606; 6b9b87d 2607/2607; 96bcf5d 2608/2608; 60fd311 2611/2611.
- The failures at f309b23 and 95eb5e0 are the known timing test test/intake/source-structural.test.ts:51 under load; alone 2 of 2.
- npm run check at the head 3a81652 (while three workers ran): typecheck and lint clean, 2613/2614; the failure is the same timing test, alone 2 of 2. test/static 76/76.
- Every test failed first; the evidence is in internal records/design/core-reads-2026-10-12/evidence/.

3. Codex reviews (gpt-6.1-sol high, one per item or group; no re-review):
- Sound as written: ITEM-08, 09, 15, 14, 07 (1) and (2), 10 (b), 25 A and B. Their findings are P2 coverage or cost notes, parked (point 5).
- ITEM-24, sound with fixes: R-01 P1 (free-text receipt fields can carry a passport number into the register): Max parked as P2 (D-13), same exposure as ops.case_work. R-02 P1 (tests): Max: fix now; done in 60fd311. R-03 P2 parked.
- ITEM-10 (d), sound with fixes: R-01, R-02, R-03 P1, Max decided D-15, done in 3a81652 (see point 1). R-04 P2 parked.
- ITEM-10 (a)+(c), sound with fixes: R-01 P1 (an item held in an earlier assessment and carried forward can never be approved once the head moved on; hold and continue-current stay possible): Max parked as P2 (D-15). R-02 P2 parked.
- ITEM-07 (1) R-01 P1 (the guard is complete only when the forms post _rev.offering): Max handed it to the UI lane (D-15, point 6).

4. Decisions and deviations:
- D-12 (Max): ITEM-14 closes with the current per-application read; the aggregate query is parked; revisit when publishing an offering with many open applications becomes slow (cap 20,000).
- D-13 (Max): ITEM-24 R-01 parked, R-02 fixed (tests only).
- D-14 (Max, verbatim): "Offering can be withdrawn by SA at any time, it stops any new group or application submission immediately, for existing ones either we let the operators complete it or SA to close them as part of cleanup. Software to not build any solution on its own." Applied with the existing operational withdrawal; no new code, command or automatic close.
- D-15 (Max): the four P1 dispositions in point 3.
- ITEM-14 commit message amended at integration to state the true cost of the fingerprint.

5. P2 notes for the register (not worked):
- ITEM-24: the register omits the holder reference, the custody time per movement and the uncertainty flag of the case-work read; the cap test never checks exactly 500.
- ITEM-09: gateView is open to any application.read holder (the page is SuperAdmin-only today); PaymentsCorePort.evaluateControls is now unused and its doc is stale; if Gate 2 throws, the page loses Gate 1 too.
- ITEM-10 (d) R-04: latestOfferingFactSeq has no offering-keyed index. Worker note: an approval whose target equals the application's tuple opens a no-op transition.
- ITEM-25 A: every open-case read adds five to seven sequential launch decisions (about 16 to 43 queries, unmeasured). B: accountNames reads accounts one at a time.
- catalogue/preview.ts header still says "submitted work" after ITEM-14.
- Coverage notes of ITEM-08, 09, 14, 15, 07, 10 (b), 25 as recorded in the item records.

6. UI-lane items:
- The launch and expansion forms MUST post _rev.offering (revisionInputs({ controls, offering: m.offeringRevision }) in src/apps/staff/catalogue/launch.ts); Max: required UI change (D-15).
- The launch-plan form's missing-measure path is now measures.<code>.
- New pending answers: owner superadmin with record_outcome under a withdrawal (reasons withdrawal_continuation_not_permitted and offering_withdrawn); the staff case link for that answer should open the operational withdrawal (D22). Owner unresolved_known_limitation with reason withdrawal_continuation_not_permitted, next action none, follow-up superadmin. The TA sentence for record_outcome names the operator; under a withdrawal it is the SuperAdmin.
- New wire fields: ops.originals (query), launchEffects on the TA case read (required; the fixture test/unit/web/travel-recheck.test.ts:127 omits it behind a cast), cat.admin_offering_impact_items (query), offeringRevision on ops.launch_offering.

7. Worker sizes (100k per-turn cap dropped by Max; partial return before 275k honoured, none breached): W5 payments 159k, W4 custody 196k, W6 launch 208k, W7 transitions 232k, W8 impact reads 250k, W9 tests 105k. At most three worktrees at once; integration by cherry-pick.

8. Next: wave 3 (ITEM-16 to 22, all reviewed; D-16, D-17, D-19) goes onto the lane branch after this package, by cherry-pick with a full check per commit; its package follows. Held branches ITEM-05 and ITEM-32: follow-up workers running; I message each frozen head. ITEM-30 (Point N only) survey running; ITEM-31 after it.
