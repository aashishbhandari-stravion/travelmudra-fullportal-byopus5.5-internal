# Wave 2 survey, group B (catalogue and launch), head 7ad52b2, 13 Oct 2026 (Explore agent, Sonnet, about 100k)

## ITEM-07 (P-06 (1), (2))
- (1) approve and expand check only the controls revision: launch.ts:180 and :259 `sameRevision(input.expectedControlsRevision, controls.revision)`; `requireLaunchableHead` (readiness.ts:~78) takes the current head. Change: `expectedOfferingRevision` in ApproveInput/zApprove (launch.ts:~176, :~238), compared in approveLaunch and expand (:258) under `lockOffering` (:75); `revision: bigint` on LaunchOffering (deps.ts; catalogue OfferingSummary has it); bind `rev.number(r,'offering')` at catalogue-admin.ts:305, :309. Make the field optional in ApproveInput only (seed.ts:73 calls approveLaunch). Reuse `stale_revision`.
- (2) replay: server.ts:417 runs binding.toInput before the operation lookup; `ops.record_launch_plan` (catalogue-admin.ts:300-303) builds `planFromForm(f, {measures: m.requirements...})` from the current head, so a replay after a head change differs and is `operation_key_reused` (command.ts:343). Change: derive measure and monitor codes from the posted field names (`m.<code>.*`, `mon.<code>.*`) in planFromForm (read-model.ts:63).
- Conflict: `ops.launch_offering` (catalogue-admin.ts:143-148; contract catalogue.ts:288) exposes neither the offering revision nor the head ids; the form cannot post `_rev.offering` without an additive contract field.
- Tests: test/integration/launch-control.test.ts (approveInput :47, replay :281; offeringRevision test/support/catalogue.ts:509); (2) a system test like new-service.test.ts:128 (cl.submit).
- Ownership: launch.ts owned (launch guards, (1)); deps.ts probably owned; read-model.ts, catalogue-admin.ts, contracts/catalogue.ts, test/integration NEED GRANT.

## ITEM-10 (P-19 (4))
- (a) decline (core/commands/admin.ts:168-172) leaves cat_impact_items at treatment 'transition'; counts read only unknown/pending/hold (catalogue/impact.ts:~125, read-models.ts:86/:203); derived impact affected_pending (domain.ts:~150): uncounted, unowned. Fix: on decline return the item to pending (SuperAdmin queue) and refresh the assessment, through a new catalogue write port called by Core (precedent noteGoverningBehindHead). Facts core.structural_transition_declined, cat.impact_item_decided.
- (b) openStructuralTransition (core/catalogue-writers.ts:123-124) returns the existing transition by impact_item_id regardless of state (UNIQUE key); a second approve after a decline "succeeds" and opens nothing. Fix: refuse control_blocked/impact_decision_not_allowed when the existing row is declined.
- (c) approveTransition (catalogue/commands/impact.ts:228) uses headOf(offering) at command time; readAssessment loaded at :236. Fix: use the assessment's after_* head. Separately the apply path (admin.ts:174-178) never rechecks the target (P-19 5(b), suspected, not in the plan row).
- (d) pendingOnAction (derived.ts:331) never calls deps.launch.launchDecision. Add a rule before the operator rules 15-25 mapping a hold to existing_work_hold / withdrawal_continuation_not_permitted / existing_work_treatment_missing, next action record_existing_work_treatment, owner superadmin (codes and action exist).
- Commits: (b) and (d) Core-only, separate; (a)+(c) one catalogue+Core commit after a grant. Tests in test/core/ (launch.test.ts, suspend helper :30; pendingOnAction pattern assignment-holds.test.ts:45); the integration harness uses a Core fake.
- Ownership: core/commands/admin.ts, catalogue-writers.ts, derived.ts, facade.ts owned; catalogue/commands/impact.ts, catalogue/impact.ts, catalogue/api.ts NEED GRANT. Keep decideItems open after a decline.

## ITEM-25 (P-19 (3), Kind 1)
- Launch effect: extend taCase() (bindings/core.ts:164); additive field (e.g. launchEffects) in zWireTaCase (contracts/core.ts:234-284); fill from deps.launch.launchDecision per EXISTING_WORK_ACTIONS with admittedLaunchId (mirrors effectsOf, catalogue-admin.ts:116-133).
- Impact items: new offering-wide SuperAdmin read (cat_impact_items is_current, cat_impact_assessments, core_transitions, core_applicant_snapshots, iam_accounts) in modules/core/lists.ts or a new Core file, contract entry and binding in core.ts. Only TA-visible effect and reason codes on the TA read. Allowlist/action wiring not checked.
- Ownership: contract and Core read owned; bindings/core.ts and allowlists.ts listed in §4 "for the replay path" (confirm read wiring).

## ITEM-14 (WP-02 F-01)
- scopeFingerprint (catalogue/domain.ts:283-288) filters lifecycle 'submitted' and hashes id, price, payment only; a draft accepted after the preview leaves it unchanged; publishBaseline compares values_sha256, offering_revision, declaration_id and the fingerprint (baselines.ts:151-161); affected_scope from preview.affected_count (:190); declarations.ts:337 uses the same function.
- Change: hash every open application over id, lifecycle, class inputs (act states, filedEvidenced), price, payment, travel dates. Old previews report preview_stale (acceptable).
- Tests: test/integration/catalogue-commands.test.ts:~160-181 (h.insertApp) or catalogue-concurrency; failing first: preview, insert a second draft, publish, expect preview_stale. test/integration NEEDS GRANT (alternative test/core/ with the real kit).
- Ownership: domain.ts, baselines.ts owned (§4 catalogue ITEM-14).

Shared files: ITEM-10 (a, b, d) and ITEM-25 share core/derived.ts, facade.ts, bindings/core.ts. ITEM-07 and launch bindings share catalogue-admin.ts. ITEM-14 isolated.
