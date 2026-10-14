# ITEM-06 P-04: a replayed sign-in code request refused a mixed-case address

Defect. Wave 1, worker W1 (Sonnet, worktree `wave1-identity`; about 100k context). Commit: `b3519e9` (cherry-picked from
`510718a`; parent `5f5e26b`). Inside prompt §4 (`src/core-api/bindings/identity.ts`, replay path; `test/system/`).

## Defect and change

`src/core-api/server.ts:419-422` runs a binding's `controls` (where the sign-in address is normalized) only for an
operation that is not recorded. A replay with the operation key passed the raw address from `toInput` to `runCommand`,
whose input parse (`zNormalizedEmail`) refused a mixed-case address with `validation_failed/input_invalid`. The
bindings of `iam.request_ta_otp` and `iam.request_staff_otp` now cut the address to 320 characters and normalize it in
`toInput` (`requestEmail`), without throwing: an invalid address stays as typed, and the first call's controls refuse
it after the rate limiter and the bot pre-check, as before. The content hash uses the address only, so a normalized
replay equals the recorded content.

## Tests

`test/system/three-instances.test.ts`: "replays a sign-in code request whose address differs from the recorded one only
in letter case": the mixed-case address sent twice with one key is replayed; the lower-case address with the same key
is replayed; another address with the same key is `conflict_operation_key`. Failed first (`rejected` on the second
send): `evidence/ITEM-06-fails-first.txt`. Worker deviation: the first send accepts `outcome_unknown` as well as
`accepted`, because the one-shot lost-acknowledgement fault of that block can fall on it when the case runs alone.
`three-instances` 15/15; identity, routes, signed-in, BFF and refusal suites 103/103 (worker).

## Review and dispositions

Codex `gpt-6.1-sol` high, read-only, one pass (lane `research/reviews/ITEM-06-review.md`). Verdict: sound as written.
The reviewer confirmed that a different normalized address still gives `conflict_operation_key`, that the first-call
refusal order (IP limiter, bot pre-check, address check, contact limiters) is unchanged, and that an address over 320
characters still fails the wire contract before the controls.

- R-01, P2, parked: the regression covers the staff request only and does not assert a replay after expiry or the
  unchanged code, task and limiter counts. Coverage note.

## Checks

`npm run check` at `b3519e9` (detached checkout): typecheck and lint clean; 2568 of 2568 tests pass.
