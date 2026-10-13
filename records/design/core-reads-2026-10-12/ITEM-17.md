# ITEM-17 P-10 (b): `core.operation` names the command and the acceptance time

Kind 1 read. Wave 3, worker W12 (Opus, worktree `wave3-reads`). Commit: LANE_17 (cherry-picked from `107d47b`; parent
`7b3c7a6` on the worker branch). Orchestrator grant (13 Oct 2026, D-16 G1, G4): `src/contracts/queries.ts`,
`src/core-api/bindings/kernel.ts`, `test/system/case-rules.test.ts`, one line in
`docs/verification/read-model-register.md`.

## Read and change

The operation lookup answered `accepted` with the recorded result only. The accepted answer now carries `commandName`
(the recorded text, a pattern-checked string, not the command enum, so a retired name still reads) and `acceptedAt`.
After the kernel's `lookupOperation` re-authorizes the result, the binding reads that one `sys_operations` row by the
same actor key and operation key, in its own read-only transaction, without a lock; the kernel is unchanged (grant
conditions: lock none, no new index, never inside a command transaction, a replay test). Additive contract change;
register line.

## Tests

`test/system/case-rules.test.ts`: the accepted lookup of an operator's assistance entry names
`core.record_assistance_entry` with the recorded acceptance time, and a second lookup answers the same two values.
Failed first: `evidence/ITEM-17-fails-first.txt`.

## Review and dispositions

Codex `gpt-6.1-sol` high, read-only, one pass on `107d47b` (`reviews/ITEM-17-review.md`). Verdict: sound as written; no
findings. The reviewer confirmed that the pattern accepts every name the database CHECK allows (longest 78 characters)
and that only the caller's own operation is read.

## Checks

CHECKS_17
