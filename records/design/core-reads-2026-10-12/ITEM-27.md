# ITEM-27 P-13 (8): `dlv.selection` items carry their stored subject and version identifiers

Kind 1 read. Wave 1, worker W2 (Sonnet, worktree `wave1-delivery`). Commit: `144f18a` (cherry-picked from `fdc485b`;
parent `5af3128`). Inside prompt §4 by OD-X13 (the `dlv.selection` read); orchestrator grant (wave 1, 13 Oct 2026) names
the files, including the two literal lines of `test/unit/web/delivery-words.test.ts`.

## Read and change

The wire item had `itemNo, applicationId, subjectKind, result, reason, label` only; a page that needed the item's file had
to derive it from the name code. `selectionOne` already returns the stored `subject_id` and `document_version_id`. The
contract adds `subjectId` and `documentVersionId` (null for a packet) to `zWireSelection` items, and the binding maps
them. The module is unchanged. Kind 1 record: a dated comment above the mapping (intent, source facts, consumers,
13 October 2026) and a line in `docs/verification/read-model-register.md`. The UI does not use the fields yet.

## Tests

`test/delivery/selection.test.ts`, "each item carries its stored subject id and version id on the wire; a packet has no
version" (binding level, operator context). Failed first: `evidence/ITEM-27-fails-first.txt`.

## Review and dispositions

Codex `gpt-6.1-sol` high, read-only, one pass (lane `research/reviews/ITEM-27-review.md`). Verdict: sound as written; no
ranked findings. The reviewer noted that the requester supplied these identifiers when creating the selection, so the
read exposes nothing new to that requester.

## Checks

`npm run check` at `144f18a` (detached checkout, run at the same time as four other full checks, load average about 70): typecheck and lint clean; 2576 of 2579 tests pass. The failures are timing tests outside this change: `test/integration/document-ocr-cost.test.ts:69` and `test/system/release-binding.test.ts:74`, `:98` (`address_in_use`: a port collision between the parallel runs). Rerun alone on a quiet machine: 7 of 7 pass.
