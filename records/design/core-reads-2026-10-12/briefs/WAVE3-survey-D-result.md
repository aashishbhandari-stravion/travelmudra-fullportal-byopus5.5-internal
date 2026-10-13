# Wave 3 survey D (ITEM-19, 20, 22, 23), head e0b978d, 13 Oct 2026 (Explore agent, Sonnet, read-only)

Cross-cutting: first-work Gate 1 is decided in three places: controls.ts:689-698 (gateStage), commands/assignment.ts:375-397
(requireGate1AtWork), commands/gates.ts:33-39 (grant eligibility). gateView (controls.ts:771-781) reads only action assign;
reassign uses the same key (controls.ts:689-691). The evaluator sets basis `passed` whenever workGate1Recorded (controls.ts:693),
even when the recorded basis was an exception: never reuse it as the answer. ITEM-19, 20, 21 share one helper (order 19, 20, 21).
Kit: kit.read, kit.clock, kit.core.deps(), the unpaid-assistance fixture.

## ITEM-19 (P-10 e): Gate 1 context for first operator work and reassignment (+ P-12 §11.4: id and failure code of an unusable exception)
- Today: pay.application_payments one gate1 enum (contracts/payments.ts:114, payments/queries.ts:92-107); core.admin_case
  (contracts/core.ts:417, bindings/core.ts:381) servicePayment status and gateExceptions (id, gate, action, state, expires_at).
  Neither gives the freshness failure, the recorded first-work basis or the work-started fact.
- Change: gate1Facts(deps, tx, app, 'assign'|'start_operator_work') in controls.ts after :742, recorded facts only: payment status,
  entryId, statusRevision (ports.ts:29); active assignment id; recorded first-work basis (kind, exception id, time); workStarted
  (ports.ts:75); the granted exception of that key with its exceptionFreshness failure code; asOf = tx.now. No allowed/passed.
  Nullable gate1Context, SuperAdmin only like assignOffer: staff-views.ts:93, :219; contracts/core.ts:359; bindings/core.ts:294.
  store.ts:220-229 add work_gate1_recorded_at (column exists, migration 1010:36). O(1) bounded reads.
- Tests: test/core/assignment-holds.test.ts:84-113 (unpaid assistance, assigned, first work refused :93).
- Ownership: INSIDE (controls.ts, staff-views.ts, store.ts, contracts/core.ts, bindings/core.ts, test/core; register line). On
  pay.application_payments instead: NEEDS GRANT (payments queries/ports/contracts/bindings, module-ports.ts:141). No UI fixture
  breaks (travel-recheck.test.ts:28 casts; strict encodes fed by the binding).
- Risks: P1 a "passed" label from the evaluator misleads (return the recorded basis kind); P1 the grant form needs the
  eligibility reasons of gates.ts:33-39 (return refusal codes as assignOffer does?); P2 exceptionFreshness checks the grantor
  live (asOf states it). No kernel/migration/reason code.

## ITEM-20 (P-12 option C as narrowed): SuperAdmin queue first_work_gate1
- Ask: core.admin_queue kind first_work_gate1: open applications with an active assignment, no recorded first-work basis, no
  payment received or fresh exception; amendment adds required asOf and truncated. The §11.1 pending substitution (derived.ts:427,
  :494) is NOT in the register row: recommend leaving it out (changes the TA's next-action text and five tests).
- Today: contracts/core.ts:434-436 (kind enum of three, output {rows}), bindings/core.ts:415-418, lists.ts:103-112 queueOf (else
  branch returns deferrals for any other kind), LIMIT 200 then entriesFor runs pendingOnAction per row. Views projector
  (views/case-projectors.ts:218) is outside the lane and lags.
- Change: branch in queueOf; SQL prefilter on Core tables only (active assignment, outcome null, lifecycle draft/submitted,
  work_gate1_basis_kind IS NULL, by assignment start); per candidate the ITEM-19 helper + workGate1Recorded; scan bound; truncated
  when the bound is hit. Wire: enum value + required asOf (zWireDate) and truncated on the output for every kind.
- Tests: test/core/assignment-holds.test.ts calling queueOf(kit.core.deps(), tx, sa1, ...) as dependency-not-linked.test.ts:236;
  TA/operator refusals and asOf in test/system/core-pages.test.ts:531-545.
- Ownership: INSIDE (lists.ts, controls.ts, contracts/core.ts, bindings/core.ts, test/core, test/system). NEEDS GRANT only for a
  bulk payment-status port if the scan bound proves too small. UI touchpoints: apps/staff/attention.ts:13 (counts rows.length;
  undercounts when truncated), apps/staff/core/admin.ts:183,463 (kind union); nav-counts fixtures not parsed.
- Risks: P1 queue membership is a computed verdict (rows carry recorded facts; label "no recorded Gate 1 basis for first work",
  not "blocked"); P1 paid-but-unstarted cases crowd the cap oldest first; P1 the SuperAdmin nav count would call it on every
  staff page; P2 stale row; grantor deactivated after granting still lists. No kernel/migration/reason code.

## ITEM-22 (P-17 (2)): mark flags (STOP-W11-01); exhausted act's future owner, decider, reason, time (STOP-W11-02)
- Today: flags, restore_id, recorded_at already served (6ad592e; contracts/core.ts:344-348, bindings/core.ts:284-288,
  staff-views.ts:188-193). Missing: count of active marks; acts[] omits future_owner_id, exhausted_by, exhausted_reason,
  state_changed_at (contracts/core.ts:326-329, bindings/core.ts:268-271) though AuthorizationRow loads them (store.ts:314-320).
  namesOf names future_owner_id, not exhausted_by.
- Change: four nullable acts[] fields future_owner_id, exhausted_by, exhausted_reason, exhausted_at (from state_changed_at;
  exhausted is terminal, writers.ts:232-235); exhausted_by in namesOf; countActiveMarks after store.ts:522 (partial index
  migration 0300:569); top-level activeMarkCount (zWireInt), NOT inside mark (protection-mark-filing.test.ts:546-549 deep-equals mark).
- Tests: test/operations/protection-mark-filing.test.ts "the staff case read" (staffCase :508-514; F7 :269-285 builds the
  exhausted act).
- Ownership: INSIDE contracts/core.ts, bindings/core.ts, staff-views.ts, store.ts. NEEDS GRANT test/operations/ (fallback: new
  test/core file copying the helper). Consumers apps/staff/core/{case,admin,ops}.ts; no fixture breaks.
- Risks: P1 exhausted_reason (<= 1000 chars, SuperAdmin-written) also reaches the assigned operator through core.ops_case (shared
  staff case type); WP-11 wants it (OP-04b), orchestrator to confirm; assert core.ta_application stays clean
  (core-pages.test.ts:555). P2 exhausted_at correct while exhausted stays terminal; P2 count live.

## ITEM-23 (P-17 (3)): core.apply_held_correction on the staff allowlist
- Command commands/drafts.ts:155-190 (role-matched kind :170); contract contracts/core.ts:92; binding bindings/core.ts:477;
  allowlist edge only (allowlists.ts:43); pending rule derived.ts (SuperAdmin or assigned operator); TA route
  src/web/route-inventory.ts:132 (T48).
- Change: add to ALLOWLISTS.staff.commands (allowlists.ts:77). No contract/binding change.
- BLOCKER for a green check: test/unit/bff.test.ts:309-315 fails with the entry alone (every allowlisted command with an
  inventory route needs a route served by that BFF; T48 is edge only); a staff inventory row without a handler fails :268-273.
  Needs the UI lane's staff route in the same integration, or a grant for route-inventory.ts / bff.test.ts.
- Risks: P1 sequencing; P2 widens what a compromised staff BFF can call (still staff session, matching role, state
  released_for_reapply).

Model suggestions: ITEM-19 Opus, ITEM-20 Opus, ITEM-22 Sonnet, ITEM-23 Sonnet (orchestrator settles sequencing).
