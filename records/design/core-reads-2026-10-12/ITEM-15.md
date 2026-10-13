# ITEM-15: no limit on originals per application and links per original

Defect, operations custody. Wave 2, worker W4 (Opus, worktree `wave2-custody`; about 196k context for ITEM-15 and
ITEM-24 together). Commit: `cdbf29b` (cherry-picked from `0e130d1`; parent `7eb943a`). Orchestrator grant (wave 2,
13 Oct 2026): `src/modules/operations/case-work/commands/originals.ts` and the custody tests.

## Defect and change

The case-work read caps originals at 50 per application and linked applications at 50 per original, but the commands
admitted more, so a 51st row made the read fail to encode. The receipt now refuses when the application already holds 50
originals; the share refuses when the original already has 50 links or the target already holds 50 originals. Refusal:
`control_blocked/limit_exceeded` (existing code). The target application lock in the share changed from `share` to
`update`, so two shares into one target serialize. A refusal writes nothing. Rows above the limit from before the
change stay as they are.

## Tests

`test/operations/original-link-identity.test.ts`: with 50 originals on an application, the 51st receipt and a share
into it are refused, write nothing and leave no operation record; an original linked to 50 applications is not shared
with a 51st; the case-work read at exactly 50 still encodes. Failed first: `evidence/ITEM-15-fails-first.txt`.

## Review and dispositions

Codex `gpt-6.1-sol` high, read-only, one pass (`reviews/ITEM-15-review.md`). Verdict: sound as written. No new
deadlock cycle; refusal rolls back the receipt insert.

- R-01, P2, parked: the tests seed 50 rows through SQL and never admit the 50th through a command; an off-by-one at 49
  would pass. Coverage note.
- R-02, P2, parked: no concurrency test; the tests would pass with the lock reverted to `share`. Coverage note.

## Checks

`npm run check` at `cdbf29b` (detached checkout): typecheck and lint clean; 2589 of 2589 tests pass.
