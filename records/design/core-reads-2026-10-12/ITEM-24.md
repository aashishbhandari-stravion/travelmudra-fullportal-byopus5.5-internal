# ITEM-24 P-18 (4): originals register read for operators

Kind 1 read. Wave 2, worker W4 (Opus, worktree `wave2-custody`; about 196k context for ITEM-15 and ITEM-24 together).
Commit: `f309b23` (cherry-picked from `b32f0b5`; parent `cdbf29b`). Review follow-up (tests only): `60fd311`
(cherry-picked from `86b403e`; worker W9, Sonnet, worktree `wave2-originals-r02`, about 105k; parent `96bcf5d`).
Orchestrator grant (wave 2, 13 Oct 2026): `src/contracts/operations-work.ts`, `src/core-api/bindings/operations-work.ts`,
`src/core-api/allowlists.ts`, `src/modules/operations/case-work/store.ts`, `src/modules/operations/case-work/facade.ts`,
`test/operations/originals-register.test.ts`, `docs/verification/read-model-register.md`.

## Read and change

An operator reached originals in custody one application at a time (the case-work read). A new query `ops.originals`
lists every original the reader may read through one of its linked applications, under the policy's application read
scope (assigned operator, group-read grantee, SuperAdmin), the most recent custody change first. A row carries the item
type, description, state, holder kind, location, parts, and the readable linked applications with the applicant's name
from the current applicant snapshot. The item key is never selected (a passport's key holds the passport number). At
most 500 rows, with a truncated flag. Served on the Ops and admin surfaces; staff allowlist only. Additive contract
change. Kind 1 record: a line in `docs/verification/read-model-register.md`.

Not in the register (open points for the package message): the holder reference, the custody time per movement and the
uncertainty flag of the case-work read.

## Tests

`test/operations/originals-register.test.ts`: assigned operator, another operator, group-read grantee, SuperAdmin; no
passport number or item key on any read; a custody change moves an original to the top; 501 originals give 500 rows and
the truncated flag; every view encodes. Failed first: `evidence/ITEM-24-fails-first.txt`.

Review follow-up (`60fd311`): one original shared between two applications with distinct applicants; after one
application moves to a second operator, each operator sees only the linked application it may read and the SuperAdmin
sees both. The staff service may make the query; edge and core may not. A travel agent, a support view of a travel agent
and a suspended operator are refused. Mutation checks (`evidence/ITEM-24-R02-mutations.txt`): removing the staff
allowlist entry fails the per-service test; removing the read scope on the linked applications fails the
partial-visibility test. Not covered: a deactivated actor (no kit helper) and a call through the Core API's HTTP path.

## Review and dispositions

Codex `gpt-6.1-sol` high, read-only, one pass on `f309b23` (`reviews/ITEM-24-review.md`). Verdict: sound with the fixes
above.

- R-01, P1: a receipt's free-text fields (description, part label, location) can carry a passport number, and the
  register copies them. **Max (13 Oct 2026, D-13): parked as P2**; the same exposure exists on `ops.case_work`.
- R-02, P1: the tests call the binding directly and give both shared applications to one operator. **Max (13 Oct 2026,
  D-13): fix now, tests only.** Fixed in `60fd311`; no re-review (lane rule).
- R-03, P2, parked: the cap test never checks exactly 500 rows (the fixtures leave 502 readable originals).

## Checks

`npm run check` at `f309b23` (detached checkout, while other checks ran): typecheck and lint clean; 2591 of 2592 tests
pass. The one failure is the known timing test `test/intake/source-structural.test.ts:51` (fails under load, passes
alone 2 of 2). `npm run check` at `60fd311` (detached checkout): typecheck and lint clean;
2611 of 2611 tests pass.

## Later finding (14 Oct 2026, at the Kind 2 integration check)

P2, parked unless the orchestrator assigns it: `test/operations/originals-register.test.ts:193` (R4, review follow-up
`60fd311`) failed once in a full `npm run check` at `a1cc0a9` (operator 2's register did not list the shared original)
and passes alone 6 of 6. Probable cause (source reading, not proven): R3 seeds 501 originals readable by operator 2, all
recorded at the same test-clock time; R4 does not advance the clock, so its shared original can tie on the register's
order key (`store.ts:230`, recorded time DESC, then original id) and fall below the 500-row cap. Likelihood: rare (a tie
among about 503 rows). Smallest fix: `kit.clock.advance(60_000)` at the start of R4, or give R4 operators that R3 does not
use. The register itself behaves as specified (cap, order, truncated flag).
