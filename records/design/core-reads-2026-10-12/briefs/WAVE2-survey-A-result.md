# Wave 2 survey, group A (custody and payments), head 7ad52b2, 13 Oct 2026 (Explore agent, Sonnet, about 65k)

## ITEM-15 (P-18 (3)): the 51st original or link is refused
- No cap per application or per original; `zWireCaseWork` has `originals.max(50)` and `linkedApplicationIds.max(50)`
  (src/contracts/operations-work.ts:204-206). Link inserts: originals.ts:139 (receipt), :185 (share).
- recordReceipt.handle: after the duplicate check (~:136), refuse when `originalsOfApplication(tx, app).length >= 50`.
  linkOriginal.handle: after the passport check (~:184), refuse when `linked.length >= 50` (loaded :171) or the target
  holds 50 originals. Concurrency: the target lock at :164 is `'share'`; two parallel shares can both pass the count;
  change to `'update'` (receipt already uses update; the original's row lock :166 serializes the per-original count).
- Reason: existing `limit_exceeded` (reasons.ts:89), `control_blocked`. A new code needs a kernel grant.
- Tests: test/operations/original-link-identity.test.ts (helpers `assigned` :28, `otherItemOf` ~:41, `refusedShare` :73).
- Ownership: originals.ts and test/operations NEED GRANT.
- Risk: existing data over 50 stays unreadable (no migration); refuse at count 50.

## ITEM-24 (P-18 (4)): originals register read (Kind 1)
- No register exists; originals only per application (`originalViews`, facade.ts:50, from `ops.case_work`).
- New query (proposal `ops.originals`) in OPERATIONS_WORK_QUERIES (contracts/operations-work.ts:241), binding in
  operationsWorkQueryBindings (bindings/operations-work.ts:227) with surfaceRead(['ops'], 'self.read'), allowlist entry
  (allowlists.ts:101). SQL ops_originals + ops_original_links + core_applications scoped by
  `policy.scope(actor,'application.read','a')`. Fields: originalId, itemType, description, state, holderKind, location,
  parts, linked applications (id, applicant name). Bound 500 with a truncated flag. Never return item_key (passport
  number). Group-read grantees see the group's originals: confirm intended.
- Ownership: bindings/operations-work.ts, contracts/operations-work.ts, allowlists.ts (beyond the replay path),
  test/operations: NEED GRANT. UX §5.2 not found in the lane tree.

## ITEM-08 (P-10 (g)): a correction that changes only eventAt
- src/modules/payments/commands/service-status.ts:108: `if (status same && amount same && sameEvidence(...)) throw
  correction_no_change`; eventAt not compared. Add `(current.event_at?.getTime() ?? null) === (input.eventAt?.getTime() ?? null)`.
- Test: test/payments/service-entries.test.ts "enforces the entry-kind rules" (~:91), helpers record/ok/refusal.
- Ownership: §4 names `src/modules/payments/service-status.ts`, which does not exist; real file is
  `src/modules/payments/commands/service-status.ts` (confirm with the orchestrator). test/payments owned.
- Risks: an omitted eventAt on an otherwise identical correction would now clear the date (decide keep vs clear); a
  date-only correction still raises status_revision (stales gate exceptions); with work it opens
  payment_corrected_after_work (~:140).

## ITEM-09 (P-14 (2)): gate2 for a SuperAdmin
- queries.ts:90-103 `view('authorize_government_submission',…)` runs evaluateControls with the SuperAdmin actor;
  policyActionFor → operator.authorize_external_act; rule OPERATOR_ASG (policy.ts:214) has no superadmin; checkRelation
  (controls.ts:239) throws not_found_or_forbidden; the catch at queries.ts:98 returns 'unknown'. Gate 1 uses assign
  (SA-allowed). Static reading: gate2 always 'unknown' for a SuperAdmin on travelmudra_filed work.
- Fix: a read path outside the operator relation; never add superadmin to the rule (the command shares it).
- Test: new test in test/payments: kit.payments.api.pages.applicationPayments(tx, sa1, app) on a default app; assert
  gate2 !== 'unknown'.
- Ownership: queries.ts NEEDS GRANT; core controls.ts owned; test/payments owned.

Sharing: ITEM-15 + ITEM-24 (operations custody, one worker); ITEM-08 + ITEM-09 (payments, one worker).
