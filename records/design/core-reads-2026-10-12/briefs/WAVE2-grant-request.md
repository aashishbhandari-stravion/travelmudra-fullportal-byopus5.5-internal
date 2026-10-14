GRANT REQUEST: Core lane core-reads-2026-10-12, wave 2 (ITEM-15, 24, 08, 09, 07, 14, 10, 25), base 7ad52b2. Read-only surveys are done and verified at file:line. Every item uses failing test first, one commit, one Codex review, a public-fit message, and the grant named in the commit body. No migration. No kernel change: every refusal reuses an existing reason code.

Workers (D-08): W4 custody (ITEM-15, 24; Sonnet), W5 payments (ITEM-08, 09; Opus, because ITEM-09 touches src/modules/core/controls.ts), W6 launch and catalogue (ITEM-07, 14; Sonnet). When a slot frees: W7 (ITEM-10; Opus), then W8 (ITEM-25; Opus) in the same worktree (they share derived.ts, facade.ts and bindings/core.ts).

Grants requested (files outside prompt §4):

1. ITEM-15 (P-18 (3), refuse the 51st original or link). src/modules/operations/case-work/commands/originals.ts (recordReceipt and linkOriginal only) and test/operations/original-link-identity.test.ts. The refusal is control_blocked/limit_exceeded (existing). The share takes the target application lock as 'update' instead of 'share', so two parallel shares cannot both pass the count. Data already over 50 stays as it is.

2. ITEM-24 (P-18 (4), originals register, Kind 1). Additive query ops.originals: src/contracts/operations-work.ts, src/core-api/bindings/operations-work.ts, src/core-api/allowlists.ts (one entry), src/modules/operations/case-work/store.ts and facade.ts (the read only), one new file test/operations/originals-register.test.ts, docs/verification/read-model-register.md. Visibility uses policy.scope(actor, 'application.read'): the assigned operator, a group-read grantee and the SuperAdmin. The read never returns item_key (it holds the passport number). The cap is 500 rows with a truncated flag. UX §5.2 is not in my inputs, so I follow P-18 (4).

3. ITEM-08 (P-10 (g), a correction of eventAt only). Confirm that §4's "src/modules/payments/service-status.ts" means src/modules/payments/commands/service-status.ts (no file exists at the §4 path). An omitted eventAt compares as null, the value the insert stores. So a correction that only clears the date is a change.

4. ITEM-09 (P-14 (2), gate2 for a SuperAdmin). src/modules/payments/queries.ts. The failing test comes first; if it passes, the item closes as not a defect. If it fails, the fix reads Gate 2 for a SuperAdmin through a read path in src/modules/core/controls.ts (owned). The authorize rule never gains superadmin, because the command shares that rule.

5. ITEM-07 (P-06 (1), (2)). (1) is inside §4 (src/modules/operations/commands/launch.ts and operations/launch/deps.ts). The UI form cannot post the offering revision: ops.launch_offering does not serve it. That needs:
   - an additive offeringRevision field in src/contracts/catalogue.ts (ops.launch_offering);
   - src/core-api/bindings/catalogue-admin.ts (serve it and bind _rev.offering);
   - test/integration/launch-control.test.ts.
   (2) is outside §4: src/modules/operations/launch/read-model.ts, where planFromForm derives the codes from the posted field names, not from the current head. Its test is a case in test/system/ (owned).
   The new approve field is optional in ApproveInput only, so operations/commands/seed.ts stays unchanged.
   UI item: the launch form posts _rev.offering.

6. ITEM-14 (WP-02 F-01). catalogue/domain.ts and commands/baselines.ts are inside §4. The test goes in test/integration/catalogue-commands.test.ts, where the catalogue harness lives. The fingerprint covers every open application (id, lifecycle, class inputs, price, payment, travel dates). Previews made before the deploy answer preview_stale once.

7. ITEM-10 (P-19 (4) a to d). (b) and (d) stay inside §4: src/modules/core/catalogue-writers.ts and derived.ts. They are separate commits that reuse impact_decision_not_allowed and the existing hold codes with record_existing_work_treatment.
   (a) and (c) need src/modules/catalogue/api.ts, impact.ts and commands/impact.ts, plus the frozen-interface record if the catalogue API is frozen:
   - (a) A new catalogue write port, called by Core on a decline. It returns the impact item to pending (the SuperAdmin queue) and refreshes the assessment. noteGoverningBehindHead is the precedent.
   - (c) approveTransition targets the assessment's reviewed head.
   Decision for you: P-19 5(b) (the apply path never rechecks that the target is still supported) is not in my plan row. I report it and do not build it unless you add it.

8. ITEM-25 (P-19 (3), Kind 1). The contract (src/contracts/core.ts, additive) and the Core read are inside §4. Confirm that §4's src/core-api/bindings/core.ts and allowlists.ts also cover new read wiring, not only the replay path. The TA case read gains the launch effect per existing-work action. A new SuperAdmin query lists the current impact items of an offering.
