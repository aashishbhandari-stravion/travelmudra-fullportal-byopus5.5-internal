# ITEM-11 P-20 (2): incident rows named the stored owner and reviewer, not the current duty holder

Defect, operations case work. Wave 1, worker W3 (Sonnet, worktree `wave1-incidents`; about 153k context, over the 100k
cap). Commit: `c9268b0` (cherry-picked from `35df76c`; parent `8387ecc`). Outside prompt §4: orchestrator grant (wave 1,
13 Oct 2026) for `incidents.ts`, `facade.ts`, `types.ts` (doc comment), `bindings/operations-work.ts` and the two test
files.

## Defect and change

`incidentView` served the stored `owner_account_id` and `reviewer_account_id`. `incidentDutyHolders` already computed the
current holders, but only the policy relations and `incidentsOwnedBy` used it. After an assignment ended, a stand-in
duty ended or a named owner was deactivated, the row still named the earlier account while the policy refused it.
Now `incidentView` overlays the `incidentDutyHolders` result on every incident that is not closed. No duty owner gives
`ownerKind: 'superadmin'` with a null owner account (the staff labels read that as the SuperAdmin queue). A closed
incident keeps its stored holders (history). A per-read memo keyed by application (`CaseOperatorMemo`) reads each case's
operator once for the lists of up to 500 rows. `viewerIsReviewer` and `monitorCounts` are unchanged (logged P2 note).

## Tests

`test/operations/incident-duty-end.test.ts`, "the incident rows name the owner and reviewer whose duty is current":
after the assignment ends, an open and a resolved incident belong to the SuperAdmin queue on the incident read, the case
read, the SuperAdmin list and the `ops.incident` wire binding; a closed incident keeps its owner; an incident without a
case and a stand-in reviewer follow the duty; a named owner stays while active and not once suspended. Three of four
cases failed first: `evidence/ITEM-11-fails-first.txt`.

## Review and dispositions

Codex `gpt-6.1-sol` high, read-only, one pass (lane `research/reviews/ITEM-11-review.md`). Verdict: sound as written.
The reviewer confirmed that every read reaches the projection, that the memo is per read and per transaction snapshot,
and that 500 rows on distinct applications cost about 1,000 sequential queries at most (latency not measured).

- R-01, P2, parked, UI lane: after a stand-in reviewer's operator returns, the owner is the SuperAdmin queue, but the
  `assigned` state badge still reads "With a reviewer" (`src/apps/staff/operations/labels.ts:31`). Presentation note.
- R-02, P2, parked: no assertion on `ops.incidents` or on the memo's query count. Coverage note.

## Checks

`npm run check` at `c9268b0` (detached checkout, run at the same time as four other full checks, load average about 70): typecheck and lint clean; 2571 of 2573 tests pass. The failures are timing tests outside this change: `test/intake/source-structural.test.ts:51` and `test/integration/document-ocr-cost.test.ts:69`. Rerun alone on a quiet machine: 6 of 6 pass.
