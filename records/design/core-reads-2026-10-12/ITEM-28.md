# ITEM-28 P-13 (9): the delivery page listed the earliest 100 email sends

Defect, delivery read. Wave 1, worker W2 (Sonnet, worktree `wave1-delivery`; about 181k context for three items, over
the 100k cap). Commit: `5af3128` (cherry-picked from `7dff0b2`; parent `06193af`). Inside prompt §4 by OD-X13 (delivery
email-attempt read); orchestrator grant (wave 1, 13 Oct 2026) names the files.

## Defect and change

`readEmailsOf` (`src/modules/delivery/store.ts`) orders `queued_at, email_send_id LIMIT 100`, so on an application with
more than 100 sends the page hid the newest, including a failed send to resend. The page now uses a new page-only reader
`readRecentEmailsOf`, ordered `queued_at DESC, email_send_id DESC`, with the cap `PAGE_EMAIL_LIMIT` (100). `readEmailsOf`
is unchanged for the evidence summary and Core (logged P2 note: the evidence summary still reads only the earliest 100).
The page's `unavailable` flag no longer depends on the listed sends: `hasUncertainEmail` (an `EXISTS` over all sends)
sets it. The `zWireDeliveryPage.emails` comment states the order and the cap.

## Tests

`test/delivery/email-notices.test.ts`, "the page lists the newest 100 sends first; an uncertain send older than that
window still sets the boundary; the resend offers stay correct" (108 sends). Failed first:
`evidence/ITEM-28-fails-first.txt`.

## Review and dispositions

Codex `gpt-6.1-sol` high, read-only, one pass (lane `research/reviews/ITEM-28-review.md`). Verdict: sound with fixes.

- R-01, P1, **parked as P2 by Max (13 Oct 2026)**: the operator's wrong-recipient report form takes its email choices
  from the page window (`src/apps/staff/operations/case-work.ts:272`). With more than 100 sends, an old file's email can
  fall outside the newest 100; the form then says no email is recorded, and the report needs other evidence. Before
  this change the same happened to the newest emails, the more likely case. Proposed fix if revisited: a per-version
  email read in Core and the UI form switched to it. Revisit if an application passes 50 sends.
- R-02, P2, parked: a resend is not guaranteed to sort after its original (injected wall clock, random id tie-break), so
  a failed original can stay in the window while its resend falls out and the page offers another resend. The command's
  duplicate check still refuses a second resend.

## Checks

`npm run check` at `5af3128` (detached checkout, run at the same time as four other full checks, load average about 70): typecheck and lint clean; 2577 of 2578 tests pass. The failures are timing tests outside this change: `test/integration/document-ocr-cost.test.ts:69`. Rerun alone on a quiet machine: 4 of 4 pass.
