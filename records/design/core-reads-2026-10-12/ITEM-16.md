# ITEM-16 P-10 (a): the batch assignment result per item with the application id and the operator id

Kind 1 read. Wave 3, worker W11 (Opus, worktree `wave3-assign`; about 239k context for ITEM-16 and ITEM-18 together).
Commit: `5ff0553` (cherry-picked from `168973f`; parent e0b978d on the worker branch). Grants: prompt scope
(`src/modules/core/staff-views.ts`, `src/contracts/core.ts`, `src/core-api/bindings/core.ts`,
`src/core-api/allowlists.ts`, `test/core/assignment-holds.test.ts`); one register line (D-16 G4); D-16 D-d. Integration: conflicts in the register (both lines kept), `src/contracts/core.ts` (`core.assignment_batch` placed before the ITEM-20 `core.admin_queue`) and the test imports (the ITEM-19 imports kept; a superset).

## Read and change

`core.assign_selection` answers flat summary keys (`item{i}`, `assignment{i}`); the ids cannot be added there, because
the kernel caps a command summary at 4096 bytes and the batch then fails `internal` after its writes (measured: 4225
bytes at 26 assigned items with the ids). Decision D-d (orchestrator): a new SuperAdmin query `core.assignment_batch
{ operationKey }` gives `items[{ item, result, assignmentId, applicationId, operatorId }]`, at most 200. It re-authorizes
through the kernel's `lookupOperation` (unchanged), so only the actor key that ran the batch reads it; another actor, a
key that is not an assignment batch and an unknown key read as not found. A refused item has no recorded application id
in Core and reads null (contract comment). The summary shape is unchanged. Admin surface, staff allowlist. Register line.

Parked P2 (D-16 D-d): the current summary passes 4096 bytes at 61 assigned items (measured by the worker); the default
batch maximum is 50. Trigger: `assignmentBatchMax` configured above 50.

## Tests

`test/core/assignment-holds.test.ts`: a batch with assigned items and a refused item; the read gives each assigned
item's ids and the refused item's code with null ids; a replay gives the same read; another SuperAdmin is refused.
Failed first: `evidence/ITEM-16-fails-first.txt`.

## Review and dispositions

Codex `gpt-6.1-sol` high, read-only, one pass on `168973f` (`reviews/ITEM-16-review.md`). Verdict: sound as written.
Each item resolves through its recorded assignment id and the batch operation id; the lookup scopes by actor key and
rejects support views; work is bounded by the 200-item command maximum and the 200-row cap.

- R-01, P2, parked: both successful items in the test have one operator, and the read is not checked after an
  assignment ends or moves.

## Checks

`npm run check` at `5ff0553`: typecheck and lint clean; 2625 of 2626; the one failure is the timing test `test/intake/source-structural.test.ts:51` under load (alone 2 of 2; no intake change in the commit). Deployed on `lane-max` at `03abf9a` (release `rel_171VQHJEPZCMFK1XXTFDH195BK`).
