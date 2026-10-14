# ITEM-21 P-14 (1) as amended: the recorded basis of each gate per act on the staff case reads

Kind 1 read (PLAN §3; the orchestrator's overnight list names it with the Kind 2 items; it exposes recorded facts only).
Wave 3, worker W14 (Opus, worktree `wave3-gatebasis`, built on the ITEM-19 and ITEM-20 worker commits; about 206k
context). Commit: `bb772e6` (cherry-picked from `8c73b60`; parent `baa00e8` on the worker branch; integrate after
ITEM-19 and ITEM-20). Grants: prompt scope (`src/modules/core/controls.ts`, `staff-views.ts`, `src/contracts/core.ts`,
`src/core-api/bindings/core.ts`, `test/core/recorded-gate-basis.test.ts`); one register line (D-16 G4).

## Read and change

The control evaluator answers `passed` both for previously authorized work and for a prior commitment of the same
attempt; neither establishes a payment receipt. `recordedGateBasis` (`controls.ts`) reuses `gate1Facts`,
`exceptionFreshness` and `grantedException` and serves, on `core.ops_case` and `core.admin_case`, a nullable
`recordedGateBasis`: `asOf`, `activeAssignmentId`; `firstWork` (payment, first-work basis, work started, unused
exception); `acts[]` per offered act with `gate2` (payment, prior commitments of the same attempt, exception; null for a
provider handoff or packet release) and `readiness` (the readiness record, the assignment it was recorded under,
exception). No verdict field. The evaluator, `requireGate1AtWork` and `commands/gates.ts` are unchanged. The fee filter
of the act offers moved into a shared `offeredKinds` (same acts). The travel agent's read is unchanged. Register line.

Worker deviations:
1. The operator's copy carries no payment status (`servicePayment` null): the case read gives payment data to the
   SuperAdmin only today, and operators hold no `payment.read_application` relation. **Open question for Max (parked;
   a policy trade-off: who sees payment data):** should the assigned operator see the payment entry behind Gate 1 and
   Gate 2 (P-14 item 1 (a) asks for it on the operator case)? Until then the operator sees the other bases.
2. A used exception leaves `exception`; the record that used it names it (`firstWorkBasis.gateExceptionId`, each prior
   commitment's Gate 2 basis and exception id).
3. The Gate 2 prior-commitment rule is repeated in the helper (the evaluator stays untouched); the agreement test with
   `evaluateControls` catches drift.

## Tests

`test/core/recorded-gate-basis.test.ts` (new): per gate and act, each basis kind in turn (payment with its entry; a
granted exception, then expired; a prior commitment of the same attempt; the first-work basis after work started) is
served as recorded with `asOf`, and `evaluateControls` agrees in each state; the operator and the SuperAdmin get the
field, the travel agent's read has none. Failed first: `evidence/ITEM-21-fails-first.txt`.

## Review and dispositions

Codex `gpt-6.1-sol` high, read-only, one pass on `8c73b60` (`reviews/ITEM-21-review.md`). Verdict: sound with the fixes
above. Gate keys, exception selection and freshness inputs otherwise match; payment status stays SuperAdmin-only;
`offeredKinds` preserves the filter; the decision sites are unchanged.

- R-01, P1: a case whose Gate 2 does not apply (service mode, or the declaration's `gate2: not_applicable`) still showed
  payment, commitment and exception fields. **Orchestrator (13 Oct 2026, under OD-X26; PLAN D-19): fix now.** Review
  follow-up commit `fdd9f03` (cherry-picked from `f9c1da4`): the read mirrors the evaluator's applicability condition; `gate2` is null with the recorded
  reason; tested.
- R-02, P1: after a readiness exception is granted, the readiness record can go stale while `failure` stays null, which
  reads as "usable". **Orchestrator (D-19): fix now.** Same follow-up: the contract states that `failure` is the
  exception's own freshness only; the readiness entry carries the recorded readiness validity; stale and held tests.
- R-03, P2, parked: the copied prior-commitment rule is tested only for attempt 1 and the submission.
- R-04, P2, parked: the helper rereads the case's authorization history (cost grows with repeated attempts).

No re-review of the follow-up (lane rule).

## Checks

`npm run check` at `bb772e6`: typecheck and lint clean; 2623 of 2623. At `fdd9f03` (follow-up): 2624 of 2625; the one failure is the timing test `test/intake/dispatch-credits.test.ts:61` under load (alone 2 of 2; no intake change in the commit). Deployed on `lane-max` at `03abf9a` (release `rel_171VQHJEPZCMFK1XXTFDH195BK`).
