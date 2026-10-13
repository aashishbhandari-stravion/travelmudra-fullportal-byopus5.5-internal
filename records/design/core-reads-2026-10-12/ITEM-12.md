# ITEM-12 P-20 (3): the incident read was smaller than the report command's bounds

Defect, contract. Wave 1, worker W3 (Sonnet, worktree `wave1-incidents`). Commit: `06193af` (cherry-picked from
`4013706`; parent `c9268b0`). Orchestrator grant (wave 1, 13 Oct 2026) for `src/contracts/operations-work.ts`,
`bindings/operations-work.ts` and the test file; condition met: one named constant per bound, each equal to the
command's bound, with a contract comment.

## Defect and change

`report_wrong_recipient` accepts 50 release ids and 50 email-send ids (up to 100 records and 100 recipients) and stores
up to 102 required evidence codes and 101 notices. The read cut required and missing evidence to 20 and notices to 100,
and capped the affected lists at 50 without a cut, so `encodeWire` threw and the incident page failed above 50. The
contract now names `INCIDENT_AFFECTED_MAX` (100), `INCIDENT_NOTICES_MAX` (101) and `INCIDENT_EVIDENCE_CODES_MAX` (102);
the schema and the binding's cuts use them. Shapes are unchanged. The command's own `releaseRefs.slice(0, 50)` in a
notice is unchanged (reported; see R-04).

## Tests

`test/operations/artifacts-incidents.test.ts`, "the incident read at the bounds of the report command": an incident row
written with 102 required codes, 101 notices and 100 releases, email sends and recipients is served whole by
`ops.incident`, and the incident page and the SuperAdmin list encode on the wire. Three of four cases failed first
(the affected-lists equality passed because the binding did not cut them; the wire case failed on them):
`evidence/ITEM-12-fails-first.txt`.

## Review and dispositions

Codex `gpt-6.1-sol` high, read-only, one pass (lane `research/reviews/ITEM-12-review.md`). Verdict: sound with fixes.
The reviewer confirmed each new bound is exact (release key uniqueness and the unique email/version pair).

- R-01, P1, **parked as P2 by Max (13 Oct 2026)**: 500 open incidents that all hold the maximum checklist encode to
  about 4.29 MB (reviewer's measurement), over the staff client's 4 MiB answer cap
  (`src/apps/shared/core-client.ts:40`), so the SuperAdmin queue would fail. This change raised the worst case: such
  rows failed to encode before. Proposed fix if revisited: list the newest 400 open incidents.
- R-02, P1, existed before this lane, **parked as P2 by Max (13 Oct 2026)**: incident evidence has no total limit
  (`commands/incidents.ts:215`) and the read shows the first 100 entries. The resolve check runs over all evidence, so
  only the display is affected. Revisit if an incident passes 50 entries.
- R-03, P2, parked, existed before: association can store 50 candidates plus the incident's own application (51); the
  read cuts to 20.
- R-04, P2, parked, existed before: a notice keeps the first 50 release references (`commands/incidents.ts:178`) and the
  deletion notice shows ten (`src/apps/shared/delivery/pages.ts:652`).

## Checks

`npm run check` at `06193af` (detached checkout, run at the same time as four other full checks, load average about 70): typecheck and lint clean; 2575 of 2577 tests pass. The failures are timing tests outside this change: `test/integration/document-ocr-cost.test.ts:69` and `test/kernel/facts.test.ts:140` (the fact tail timed out). Rerun alone on a quiet machine: 10 of 10 pass.
