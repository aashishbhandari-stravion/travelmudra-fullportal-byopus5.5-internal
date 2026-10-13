# ITEM-07: launch approval against an unreviewed head; a replayed launch plan conflicted

Two defects, launch control. Wave 2, worker W6 (Sonnet, worktree `wave2-launch`). Commits: (1) `894667b`
(cherry-picked from `f5281cf`; parent `95eb5e0`); (2) `5779060` (cherry-picked from `d8f8636`; parent `894667b`).
Orchestrator grant (wave 2, 13 Oct 2026): (1) `src/modules/operations/commands/launch.ts`,
`src/modules/operations/launch/deps.ts`, `src/contracts/catalogue.ts` (additive `offeringRevision` on
`ops.launch_offering`), `src/core-api/bindings/catalogue-admin.ts`, `test/integration/launch-control.test.ts`;
(2) `src/modules/operations/launch/read-model.ts`, `src/core-api/bindings/catalogue-admin.ts`, a test in `test/system/`.

## (1) Approval and scope expansion check the reviewed offering revision

SuperAdmin 1 reviews the launch at head D1; SuperAdmin 2 publishes D2; SuperAdmin 1 confirms and launches D2 unreviewed,
because approve and expand compared only the controls revision. `LaunchOffering` gains `revision`; `ApproveInput` and
the expand input gain an OPTIONAL `expectedOfferingRevision` (contract changes are additive only, and the current form
does not post it). When present, it is compared with the offering read under `lockOffering` and a mismatch refuses
`stale_revision`. When absent, behaviour is unchanged; the seed path is unchanged. `ops.launch_offering` serves
`offeringRevision`; the approve and expand bindings bind `_rev.offering` when the form carries it.

UI item (package message): the launch and expansion forms MUST post `_rev.offering`
(`revisionInputs({ controls, offering: m.offeringRevision })` in `src/apps/staff/catalogue/launch.ts`); the guard is
complete only then.

## (2) A replayed launch-plan form yields the identical command input

The binding built the command input with the current head's measure codes before the operation lookup, so a replay
after a head change gave a different input and `conflict_operation_key` instead of the accepted result. `planFromForm`
now derives the measure and monitor codes from the posted field names; the record-plan binding no longer loads the
launch model. A first call still flags missing measures; the missing path is now `measures.<code>` (UI item).

## Tests

(1) `test/integration/launch-control.test.ts`: after a new head, approving and widening at the earlier offering revision
give `stale_revision` and change nothing; the current revision launches and widens; no revision behaves as before.
Failed first: `evidence/ITEM-07-1-fails-first.txt`. (2) `test/system/launch-plan-replay.test.ts` (new): after the head
requires one more measure, the identical form with the same key returns the accepted result with `replayed: true` and
records no second plan; another form with the same key conflicts. Failed first: `evidence/ITEM-07-2-fails-first.txt`.

## Review and dispositions

Codex `gpt-6.1-sol` high, read-only, one pass per commit (`reviews/ITEM-07-1-review.md`, `reviews/ITEM-07-2-review.md`).
Both verdicts: sound as written.

- (1) R-01, P1: the remaining UI dependency above (both launch forms post only `_rev.controls`). Max decided (13 Oct 2026, D-15): hand
  it to the UI lane. Listed in the wave 2 package message.
- (1) R-02, P2, parked: tests call the domain commands directly; no same-key replay after a publication or binding test.
- (2) R-01, P2, parked: the "lists the missing measure" test checks only `complete: false`, not the path or its
  rendering; no monitor or malformed-code cases.
- (2) Reviewer note: schema validation now precedes resource authorization in the record-plan path, so malformed input
  can return `validation_failed` before `not_found_or_forbidden`. Recorded; no action.

## Checks

`npm run check` at `894667b` (1, detached checkout): typecheck and lint clean; 2599 of 2599 tests pass. At `5779060`
(2): 2601 of 2601 tests pass.
