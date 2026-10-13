# ITEM-20 P-12 option C as narrowed: the SuperAdmin queue `first_work_gate1` (display only)

Kind 1 read. Wave 3, worker W10 (Opus, worktree `wave3-gate1`). Commit: `6b97250` (cherry-picked from `baa00e8`; parent
`ccf9659` on the worker branch). Grants: prompt scope (`src/modules/core/lists.ts`, `src/contracts/core.ts`,
`src/core-api/bindings/core.ts`, `test/core/assignment-holds.test.ts`, `test/system/core-pages.test.ts`); one register
line (D-16 G4).

## Read and change

`core.admin_queue` gains the kind `first_work_gate1`: candidates from Core's tables (open applications, draft or
submitted with no outcome, an active assignment, no recorded first-work basis, no work step), oldest assignment first, at
most 200 scanned; a candidate is listed when the ITEM-19 helper shows no payment received and no usable exception for
first work. Rows carry `firstWorkGate1 { assignmentId, assignedAt, gateExceptionId, failure }` and the existing payment
field, not a verdict. Every kind now answers `asOf` and `truncated` (D-16 D-c; for the existing kinds one more row than
the limit is read). `queueOf` takes a `limit` (default 200). The P-12 §11.1 pending-answer substitution is not built
(D-16 D-c; open point for Max).

## Tests

`test/core/assignment-holds.test.ts`, "the first-work Gate 1 queue": unpaid assigned work is listed; after payment, a
usable exception or the first work it is not; an expired exception lists it again; a draft without assignment is never
listed; a limit gives the cut and `truncated`. `test/system/core-pages.test.ts`: the travel agent and the operator are
refused (a travel agent through the staff service is `unauthenticated`); `asOf` is served. Failed first:
`evidence/ITEM-20-fails-first.txt` (regenerated with the final test text against unchanged source).

## Review and dispositions

Codex `gpt-6.1-sol` high, read-only, one pass on `baa00e8` (`reviews/ITEM-20-review.md`). Verdict: sound as written.
Membership matches the Gate 1 stage and `requireGate1AtWork`; every kind computes `truncated` from the extra candidate;
the current SuperAdmin navigation calls only the three existing kinds, so this commit adds no scan there.

- R-01, P2, parked: no case of work started without a recorded basis, nor of truncation when scanned candidates are
  filtered out; the "every kind" test exercises two kinds.

Open point (worker; the review found no defect, parked P2): paid but unstarted work fills the 200-candidate scan oldest first and can
hide unpaid work; `truncated` shows that the scan stopped. UI-lane notes: the kind unions in `apps/staff/attention.ts:13`
and `apps/staff/core/admin.ts:183`; the navigation count reads `rows.length` (undercounts when `truncated`; adding this
kind to it runs the per-candidate reads on every staff page).

## Checks

`npm run check` at `6b97250`: typecheck and lint clean; 2618 of 2618. Deployed on `lane-max` at `03abf9a` (release `rel_171VQHJEPZCMFK1XXTFDH195BK`).
