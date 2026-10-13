PACKAGE READY: Core lane core-reads-2026-10-12, Kind 2 (ITEM-30 Point N; ITEM-31 part (b) tests), branch head a1cc0a9 (on 03abf9a, the wave 3 head), deployed on lane-max (uat.py deploy, release rel_47GT0E9AZCHS9T03RRCQS2W053; no migration; data and accounts kept). Internal records: internal d8456f4.

1. Commits (never pushed):
- bf2158d ITEM-30 (K2-P17-4, Point N): after an accepted outcome correction, Core posts one generic_case_update notice to the owning travel agent in the same transaction; params {event: 'outcome_corrected', from, to}; no acknowledgement; dedupe key outcome_corrected:<committed operation id>:<travel agent>. One product file (src/modules/core/commands/admin.ts). Tests N1 to N15, the race, B1 to B3.
- b21f3ff ITEM-30 review follow-up (D-23), tests only: N16 and N17 with the real Delivery; a correction that fails a dependent and supersedes its open increase rolls back as a whole when the notice insert is refused or the fault fires before the commit; a resend commits once.
- acd666e ITEM-31 (b), tests only: T-B1 (an individual draft created after a routine price publication quotes the new price; the old quote is refused; earlier submitted work keeps its price, no notice); T-B2 (a bulk attempt that spans a publication: continue_current keeps the attempt baseline, continue_on_head moves to the head), appended as one block at the end of test/intake/bulk-mapping.test.ts, with the comment that it pins today's B16 rule (Q3 open).
- a1cc0a9 ITEM-31 (b) review follow-up (D-23), tests only: the two bulk scenarios are one sequential test that publishes its own prices (passes alone and in the file).
bf2158d and b21f3ff keep their worker ids (fast-forward); acd666e and a1cc0a9 are cherry-picked from 14f3fa7 and 20b525b. A grep for internal identifiers over the four messages and diffs returns 0. No kernel change, no migration, no new reason code, no contract change.

2. Checks: npm run check on each commit in its own detached checkout, one at a time.
- bf2158d 2645/2645; b21f3ff 2647/2647; acd666e 2650/2650; a1cc0a9 2648/2649; typecheck and lint clean at each.
- The failure at a1cc0a9 is test/operations/originals-register.test.ts:193 (R4 of ITEM-24, from wave 2's 60fd311), a file a1cc0a9 does not touch; the file passes alone 6 of 6. Probable cause (source reading): R3 seeds 501 originals readable by operator 2 at one test-clock time; R4 does not advance the clock, so its shared original can tie on the register's order key (recorded time DESC, then id) and fall below the 500-row cap. P2, parked unless you assign it: rare; it can turn a main check red. Smallest fix: kit.clock.advance(60_000) at the start of R4 (one line, test only). Recorded in ITEM-24.md.
- Fails first: ITEM-30 16 of 43 before the change; the client key in place of the operation id fails 13 (N3, N6, N8). Weakened rollback: a swallowed notice error fails N16 (drop_row variant); a fault after the commit fails N17. ITEM-31 (b) pins current behaviour: mutations of submission.ts:144 and impact-recheck.ts:226 fail each case.

3. Codex reviews (gpt-6.1-sol high, one per item; no re-review):
- ITEM-30, sound with fixes: R-01 P1 (rollback proof without dependents and prices): fix now (D-23), done in b21f3ff. R-02 P2 parked (no forced single serialization failure followed by success).
- ITEM-31 (b), sound with fixes: R-01 P1 (bulk scenarios depend on test order): fix now (D-23), done in a1cc0a9.

4. Not built, open for Max: ITEM-30 Point H (history line; Q-N3), Q-N2, Q-N4 (residuals of the notice count), Q-N5; ITEM-31 part (a) (Q1 release reconciliation, Q2 scope authority, Q4 definition of recorded payment; money behaviour) and Q3 (B16 vs creation time).

5. UI-lane items: ITEM-30: EVENT_TEXT in src/apps/shared/delivery/pages.ts:189 for event outcome_corrected (proposal §0.5 words); until then the travel agent reads the generic text of generic_case_update. SA-09o Effect text ("TravelMudra posts no notice for this correction.") becomes "The travel agent gets a notice: the outcome was corrected from [current] to [target]." (proposal §13).

6. Worker sizes: S30 survey 272k, W19 215k, W21 180k, W20 181k, W22 59k.

7. Lane state: Kind 2 items done or held: ITEM-02, 03, 04, 33 (earlier), ITEM-05 held (29ee313), ITEM-32 held (6a39fd3), ITEM-30 N and ITEM-31 (b) here. Waiting for Max: ITEM-29 (wait), ITEM-05 Point D, ITEM-30 H, ITEM-31 (a).
