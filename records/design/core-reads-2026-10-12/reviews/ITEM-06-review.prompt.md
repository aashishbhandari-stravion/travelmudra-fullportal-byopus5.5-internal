You are the independent reviewer (different model family) of one committed change in the TravelMudra product.

Commit: b3519e9 in the current repository (branch core-reads-2026-10-12; parent 5f5e26b). Read it with `git show b3519e9` and surrounding code with `git show b3519e9:<path>`.

Change (defect fix): a replay of a sign-in code request (`iam.request_ta_otp`, `iam.request_staff_otp`) skipped the binding controls that normalize the email address (`src/core-api/server.ts` runs `controls` only for an operation that is not recorded), so a mixed-case address replayed with its operation key reached `runCommand` raw and was refused `validation_failed/input_invalid`. The bindings' `toInput` (`src/core-api/bindings/identity.ts`) now cuts the address to 320 characters and normalizes it with `normalizeEmail` without throwing (an invalid address stays as typed and the first call's controls refuse it, after the rate limiter and the bot pre-check, as before).

One-time review; read-only; do not modify files; do not ask questions back.

Judge: (1) Does every replay of a recorded request now equal the recorded content, and does a different address with the same key still conflict? (2) Does the change keep the order of the rate limiter, the bot pre-check and the controls on a first call, and their refusal codes for an invalid, empty or over-long address? (3) Can normalization in `toInput` change what is rate-limited, logged, hashed or stored for a first call? (4) Hostile but valid states: Unicode or whitespace in the address, the 320-character cut before normalization, a lost acknowledgement, a replay after the code expired. (5) Are the tests sufficient and do they fail without the change?

Output: ranked findings R-01… (P0/P1/P2; file:line; a concrete scenario with likelihood; the smallest fix), then a verdict ("sound as written", "sound with the fixes above", or "not sound") with one paragraph. Concise, no preamble, at most about 400 words.
