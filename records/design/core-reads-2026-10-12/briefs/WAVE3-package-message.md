PACKAGE READY: Core lane core-reads-2026-10-12, wave 3 (ITEM-19, 20, 21, 16, 18, 22, 17; ITEM-23 handed over to the UI lane), branch head 03abf9a (on 3a81652), deployed on lane-max (uat.py deploy, release rel_171VQHJEPZCMFK1XXTFDH195BK; no migration; data and accounts kept). Internal records: internal 30bf040.

1. Commits (one per item, review follow-up separate; cherry-picked from four worker worktrees in this order; never pushed):
- 3897d04 ITEM-19: the SuperAdmin's core.admin_case serves gate1Context { assign, startOperatorWork }: the recorded facts Gate 1 reads (payment status with entry and revision, active assignment, recorded first-work basis, work step, granted exception with the existing freshness failure code, asOf). No verdict; the three Gate 1 decision sites are unchanged (a test compares the evaluator).
- 6b97250 ITEM-20: core.admin_queue kind first_work_gate1 (display only): open assigned work with no recorded first-work basis, no payment and no usable exception; rows carry firstWorkGate1 and the payment field. Every kind now answers asOf and truncated (D-16 D-c). The P-12 §11.1 pending substitution is not built (open point for Max).
- bb772e6 ITEM-21: core.ops_case and core.admin_case serve recordedGateBasis: per offered act the Gate 2 basis (payment, prior commitments of the same attempt, exception) and the readiness record, plus the first-work basis, with asOf. No computed passed. The operator's copy carries no payment status (open for Max, point 4).
- fdd9f03 ITEM-21 review follow-up (D-19): gate2 is null with the recorded reason where Gate 2 does not apply; the contract states that an exception's failure is its own freshness only, and the readiness entry carries the recorded readiness validity.
- 5ff0553 ITEM-16: new SuperAdmin query core.assignment_batch { operationKey }: each item's result with assignment, application and operator ids, re-authorized through lookupOperation; at most 200. The command summary is unchanged (its 4096-byte cap; D-16 D-d).
- da8d14b ITEM-18: new SuperAdmin query core.reassignment_preview { applicationId }: the holds, acts and incidents core.reassign transfers, from ONE shared Operations predicate and effect rule used by the writer and the read (G2); one frozen-interfaces line for the additive port method.
- 1793248 ITEM-22: staff case acts carry future_owner_id, exhausted_by, exhausted_reason, exhausted_at (null unless reconciliation_exhausted), and activeMarkCount; core.ta_application unchanged (D-16 D-a).
- 03abf9a ITEM-17: the accepted core.operation lookup names commandName and acceptedAt (one read-only sys_operations row after the kernel's re-authorization; no lock; kernel unchanged; G1).
Integration conflicts: the read-model register (all lines kept), src/contracts/core.ts (both queries kept), the assignment-holds test imports and the staff-views imports (both sides kept). Every commit body names its grant. A grep for internal identifiers over the eight messages and diffs returns 0. No kernel change, no migration, no new reason code. Additive contract changes only.

2. Checks: npm run check on each commit in its own detached checkout, one at a time (three workers ran at the same time).
- 3897d04 2616/2616; 6b97250 2618/2618; bb772e6 2623/2623; fdd9f03 2624/2625; 5ff0553 2625/2626; da8d14b 2626/2627; 1793248 2629/2629; 03abf9a 2630/2630; typecheck and lint clean at each.
- The three failures are intake timing tests under load: test/intake/dispatch-credits.test.ts:61 at fdd9f03, test/intake/source-structural.test.ts:51 at 5ff0553 and da8d14b. Wave 3 changes no intake file; both tests pass alone 2 of 2 at each of the three commits.
- At the head before the checks: tsc, eslint and test/static 76/76 clean.
- Every test failed first; the evidence is in internal records/design/core-reads-2026-10-12/evidence/.

3. Codex reviews (gpt-6.1-sol high, one per item; no re-review):
- Sound as written: ITEM-16, 17, 18, 19, 20. Their findings are P2 coverage or cost notes, parked (point 5).
- ITEM-21, sound with fixes: R-01 P1 (Gate 2 facts shown where Gate 2 does not apply) and R-02 P1 (an exception reads usable while the readiness record is stale): you decided fix now (D-19); done in fdd9f03. R-03, R-04 P2 parked.
- ITEM-22, sound with fixes: R-01 P1 (an unassigned group-read grantee also receives exhausted_reason through core.ops_case): you parked it as P2 (D-17). R-02, R-03 P2 parked.

4. Open for Max (parked under OD-X26; not built):
- ITEM-21: should the assigned operator see the payment entry behind Gate 1 and Gate 2 (P-14 item 1 (a) asks for it; operators hold no payment.read_application relation today)?
- ITEM-20: the P-12 §11.1 pending-answer substitution (D-16 D-c; after-lanes A4).

5. P2 notes for the register (not worked):
- ITEM-16: the summary passes 4096 bytes at 61 assigned items; the default batch maximum is 50 (trigger: assignmentBatchMax above 50). Tests use one operator and do not read after an assignment ends.
- ITEM-18: equal revisions do not prove the duties are unchanged (an incident can change without a revision bump); the preview loads the whole authorization history before cutting to 200; reviewer_ends is unreachable today (kept to mirror the writer).
- ITEM-19: no case of an exception-backed basis while unpaid or after a reassignment; no support-view audience test.
- ITEM-20: paid but unstarted work fills the 200-candidate scan oldest first and can hide unpaid work (truncated shows it).
- ITEM-21: the copied prior-commitment rule is tested for attempt 1 only; the helper rereads the authorization history.
- ITEM-22: only exhausted_at is masked by state; tests do not separate the two times or the oldest and newest mark.

6. UI-lane items:
- New wire fields: core.admin_case gate1Context; core.admin_queue kind first_work_gate1 with firstWorkGate1, and required asOf and truncated on every kind; recordedGateBasis on core.ops_case and core.admin_case; acts[] future_owner_id, exhausted_by, exhausted_reason, exhausted_at and activeMarkCount on both staff case reads; core.assignment_batch and core.reassignment_preview (queries); commandName and acceptedAt on the accepted core.operation answer.
- ITEM-20: the kind unions in src/apps/staff/attention.ts:13 and src/apps/staff/core/admin.ts:183; the navigation count reads rows.length and undercounts when truncated (adding this kind to the count runs its per-candidate reads on every staff page).
- ITEM-18: present the preview as informational; the command re-checks at its own time.
- ITEM-23: core.apply_held_correction on the staff allowlist, with its staff route, one commit in the UI lane (D-16 D-b).

7. Worker sizes: W10 gate1 225k (ITEM-19, 20), W11 assign 239k (ITEM-16, 18), W12 reads 162k (ITEM-22, 17), W14 gate basis 206k (ITEM-21); W16 wrote the ITEM-21 follow-up. None above 275k.

8. Next: the Kind 2 package (ITEM-30 Point N bf2158d + b21f3ff; ITEM-31 (b) tests acd666e + a1cc0a9, stacked on 03abf9a) follows when its per-commit checks finish. Held branches already sent: ITEM-05 29ee313, ITEM-32 6a39fd3.
