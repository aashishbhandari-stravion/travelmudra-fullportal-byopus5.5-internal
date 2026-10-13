# ITEM-08: a payment correction that changes only the event date was refused

Defect, payments. Wave 2, worker W5 (Opus, worktree `wave2-payments`; about 159k context for ITEM-08 and ITEM-09
together). Commit: `f1a2a2d` (cherry-picked from `263dce9`; parent `7ad52b2`). Orchestrator grant (wave 2, 13 Oct 2026):
`src/modules/payments/commands/service-status.ts` and `test/payments/*.test.ts`.

## Defect and change

The no-change rule of a service payment correction (`service-status.ts`) compared the status, the amount and the
evidence, but not the event date. A correction that only moved or cleared the date was refused with
`validation_failed/correction_no_change`. The rule now also compares
`(current.event_at?.getTime() ?? null) === (input.eventAt?.getTime() ?? null)`. Decision (architect, confirmed by the
orchestrator): an omitted date compares as the null value that the insert stores, so a correction that only clears the
date is a change. A date-only correction raises `status_revision` as any correction does, and after work is authorized
it opens `payment_corrected_after_work`.

## Tests

`test/payments/service-entries.test.ts`: the same date is refused; another date is accepted and stored; an omitted date
clears the stored date; a second omission is refused; a date-only correction after work opens
`payment_corrected_after_work`. Failed first: `evidence/ITEM-08-fails-first.txt`.

## Review and dispositions

Codex `gpt-6.1-sol` high, read-only, one pass (`reviews/ITEM-08-review.md`). Verdict: sound as written.

- R-01, P2, parked: the test uses whole-second timestamps with one offset; no equivalent-instant or 1 ms case.
  Coverage note.

## Checks

`npm run check` at `f1a2a2d` (detached checkout): typecheck and lint clean; 2582 of 2582 tests pass.
