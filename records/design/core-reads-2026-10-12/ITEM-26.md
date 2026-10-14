# ITEM-26 P-13 (1): the owning travel agent's current account email on the SuperAdmin delivery page

Kind 1 read, exception OD-X12. Wave 1, worker W2 (Sonnet, worktree `wave1-delivery`). Commit: `7ad52b2` (cherry-picked
from `aef35ad`; parent `144f18a`). Inside prompt §4 (delivery read models for P-13 (1)); orchestrator grant (wave 1,
13 Oct 2026) names the files.

## Read and change

`deliveryPage` and `zWireDeliveryPage` carried no owning-TA address. On the `admin` surface only, the page reads the
owner from `d.core.getApplicationScope` and the address from `d.identity.getRecipient` (the port the email send already
uses). `getRecipient` refuses `not_found_or_forbidden` for an owner that is not a TA; the page catches that and serves
null; any other failure propagates. The wire page gains `taAccountEmail`, null on the `ops` and `ta` surfaces and in a
support view. Nothing is written; the address goes in no log and no fact. Kind 1 record: a dated comment above the
computation and a line in `docs/verification/read-model-register.md`. The UI does not render the field yet.

Deviations:

- D-09 (orchestrator, 13 Oct 2026): the page serves the normalized (lower-case) address that `getRecipient` returns,
  not the display form P-13 (1) names. No identity change. Max may ask for the display form later.
- D-10 (this item): `taAccountEmail` is `nullable().optional()` on the wire, not required. A required field breaks two
  page literals outside the grant (`test/unit/web/delivery-words.test.ts:39`, `test/unit/web/packet-handover.test.ts:126`).
  Core always sends the field. To make it required: grant those two lines and drop `.optional()`.

## Tests

`test/delivery/email-notices.test.ts`: "the SuperAdmin page shows the current address, also after it changes; the
operator page, the travel agent page and a support view show none" and "an owner that is not a travel agent gives no
address; any other failure of the lookup is not hidden" (binding level). Both failed first:
`evidence/ITEM-26-fails-first.txt`.

## Review and dispositions

Codex `gpt-6.1-sol` high, read-only, one pass (lane `research/reviews/ITEM-26-review.md`). Verdict: sound as written.

- R-01, P2, parked: the non-TA owner case replaces `getRecipient` with a stub; a test with a real non-TA owner would
  catch a future port change. Coverage note.

## Checks

`npm run check` at `7ad52b2` (detached checkout, run at the same time as four other full checks, load average about 70): typecheck and lint clean; 2579 of 2581 tests pass. The failures are timing tests outside this change: `test/intake/source-structural.test.ts:51` and `test/integration/document-ocr-cost.test.ts:69`. Rerun alone on a quiet machine: 6 of 6 pass. Quiet `npm run check` at `7ad52b2` (the wave 1 head): 2581 of 2581.
