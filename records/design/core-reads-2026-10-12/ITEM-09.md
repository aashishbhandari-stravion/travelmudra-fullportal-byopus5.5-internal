# ITEM-09: Gate 2 on the payments page was always unknown for a SuperAdmin

Suspected defect, confirmed by the failing test; payments and Core. Wave 2, worker W5 (Opus, worktree `wave2-payments`).
Commit: `7eb943a` (cherry-picked from `3ae88e6`; parent `f1a2a2d`). Orchestrator grant (wave 2, 13 Oct 2026):
`src/modules/payments/queries.ts`, the new read in `src/modules/core/`, and, because the failing test confirmed the
defect, one additive method on `PaymentsCorePort` (`src/modules/payments/ports.ts`) with its adapter line in
`src/domain/module-ports.ts`; tests in `test/payments/`.

## Defect and change

`applicationPayments` read Gate 2 through `evaluateControls` with the action `authorize_government_submission` and the
SuperAdmin as the actor. Stage 1 checks the act's relation `operator.authorize_external_act`, which only the assigned
operator holds, so the evaluator refused the SuperAdmin and the page caught the refusal as `unknown`, on every
TravelMudra-filed application.

Core gains `gateView(deps, tx, actor, applicationId)`. Its stage 1 checks the reader's `application.read` relation
through the single policy (`requireRelation`, extracted from `checkRelation`). Stages 2 to 12 are the evaluator's own
(`evaluateFromStage2`, extracted from `evaluate`); no stage is copied. Gate 1 comes from the `assign` stages and Gate 2
from the `authorize_government_submission` stages; the read returns each gate's basis and whether it blocks, and
authorizes nothing. `evaluateControls`, `ControlRequest`, every command path and the authorize rule are unchanged; the
rule does not gain `superadmin`. The payments page reads both gates through the new port method (one path).

## Tests

`test/payments/gate2-superadmin.test.ts` (new): the SuperAdmin page shows Gate 2 blocked before the payment, passed after
it and excepted with a granted exception, as the assigned operator's evaluation states it; Gate 1 reads as before; the
SuperAdmin's evaluation and `authorize_external_act` command are still refused and write nothing; an actor without a
read relation gets `not_found_or_forbidden`. Failed first: `evidence/ITEM-09-fails-first.txt`.

## Review and dispositions

Codex `gpt-6.1-sol` high, read-only, one pass (`reviews/ITEM-09-review.md`). Verdict: sound as written. The reviewer
confirmed the extraction is byte-for-byte for stage 2 and the helpers of stages 3 to 12.

- R-01, P2, parked: if a Gate 2 read throws, `gateView` rejects after computing Gate 1, so the page shows both gates
  unknown (before, Gate 1 survived). Resilience note.
- R-02, P2, parked: the positive access test covers only the SuperAdmin; other `application.read` holders are untested.
- Architect P2 notes: `PaymentsCorePort.evaluateControls` is now unused and its doc comment is stale; `gateView` is open
  to any actor with `application.read` (gate bases and exception ids only).

## Checks

`npm run check` at `7eb943a` (detached checkout): typecheck and lint clean; 2587 of 2587 tests pass.
