# Brief W11 (wave 3): ITEM-16 the batch assignment result per item, then ITEM-18 the reassignment preview

Role: Principal Software Engineer (implementation and tests). Two items, two commits in this order: ITEM-16, then
ITEM-18.

## Where you work

- Your worktree: `WT=/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/core-reads-2026-10-12/wt/w11-assign`
  (branch `wave3-assign`, at `e0b978d`, `node_modules` installed). You are its only writer. Commit there. Never push.
- Start EVERY Bash command with `cd $WT &&` (write the path out). Use absolute paths under `$WT` for every Read, Edit
  and Write. Never touch the lane clone (`.../lanes/core-reads-2026-10-12/repo`) or another worktree. First command:
  `cd $WT && git branch --show-current && git log --oneline -1` (expect `wave3-assign` and `e0b978d`; otherwise stop).
- Tests: `export TMPDIR=/tmp/claude-1000/w11; mkdir -p $TMPDIR`, then
  `node --test --test-global-setup=test/support/global-setup.ts <files> 2>&1 | grep -E "^ℹ (tests|pass|fail)|✖|AssertionError|expected|actual" | head -40`.
  ALWAYS filter test output. Do not run `npm run check` (the architect runs it per commit).
- Checks per commit: `npx tsc -p tsconfig.json --noEmit`; `npx eslint <changed files>`; the targeted tests; before each
  commit also `test/core/*.test.ts` and `test/unit/*.test.ts` once (ITEM-18 also `test/operations/*.test.ts`).
- Read with `grep -n` and `sed -n 'a,bp'`. Never read a large file in full. The survey is from a read-only agent; verify
  each line before you rely on it: `/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/core-reads-2026-10-12/research/briefs/WAVE3-survey-C-result.md`
  (ITEM-16 and ITEM-18).
- Source (read only the named items): `/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/ui-revamp-2026-10-12/output/proposals/P-10-wp06-core-requests.md`, items (a) and (d).

## Rules

- Failing test first. Run it before the change and save the filtered output to
  `/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/core-reads-2026-10-12/research/evidence/ITEM-16-fails-first.txt`
  and `ITEM-18-fails-first.txt` (first line: `# <test names> before the change, <date>`).
- Files you MAY edit:
  - Both items (prompt scope): `src/modules/core/` (NOT `src/modules/core/commands/groups.ts`, NOT
    `src/modules/core/intake-writers.ts`), `src/contracts/core.ts` (additive only; a new query entry counts as additive,
    orchestrator, 13 Oct 2026), `src/core-api/bindings/core.ts`, `src/core-api/allowlists.ts`, `test/core/*.test.ts`,
    `test/system/*.test.ts`, and one line per item in `docs/verification/read-model-register.md` (Kind 1 record;
    orchestrator grant, 13 Oct 2026).
  - ITEM-18 only (orchestrator grant, 13 Oct 2026): `src/modules/operations/case-work/incidents.ts`, `facade.ts`,
    `types.ts` (ONE new read function; see the condition below); `src/domain/module-ports.ts` (one additive
    `coreOperationsPort` mapping); `test/unit/frozen-interfaces.test.ts` (one added line for the new Operations
    function); `test/operations/` (the parity test with the real predicate).
  Nothing else; stop and report if another file must change. No kernel change, no migration, no new reason code, no
  signature change to any existing export.
- Public-fit: no internal identifier (`OD-…`, `K2-…`, `P-nn`, `ITEM-…`, `WP-…`, `R-nn`, "seam") in code, comments, test
  names or commit messages. Commit message: imperative subject under 72 characters; a body that says the gap, the change
  and the tests; before the last line: `Ownership grant (orchestrator, 13 Oct 2026): <the files this commit changes>`
  (write "prompt scope" for the files under `src/modules/core/`, `src/contracts/core.ts`, the core binding and
  allowlist); last line `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Never bypass hooks.
- Match the surrounding code style and comment density.

## ITEM-16: the batch assignment result per item with the application id and the operator id

Gap: `core.assign_selection` answers flat summary keys `item{i}` (result) and `assignment{i}`; a receipt cannot name the
application and the operator of each item. Adding the ids to the summary is not possible: the kernel caps a summary at
4096 bytes (`src/kernel/command.ts` about `:99`, `:360`; it fails `internal` after the writes, so the batch rolls back),
and the survey measured 4225 bytes at 26 assigned items.

Change (orchestrator decision D-d, 13 Oct 2026; conditions are binding):
- A new query `core.assignment_batch` with input `{ operationKey }`. It re-authorizes through the kernel's
  `lookupOperation`, used unchanged, so only the actor key that ran the batch reads it; another actor (and an operation
  that is not an assignment batch) is answered as not found, as the module answers a missing resource.
- Rows per item, in item order: item number, the recorded result (assigned, or the refusal code), and for an assigned
  item its assignment id, application id and operator id (from `core_assignments`, by the recorded assignment ids or
  `batch_operation_id`; verify which is exact). A refused item has no recorded application id in Core: serve null and
  say so in the contract comment. At most 200 rows; state the cap in the contract comment.
- The existing summary shape of `core.assign_selection` stays exactly as it is.
- SuperAdmin staff surface, as the assignment pages are; staff allowlist only.
Tests (`test/core/assignment-holds.test.ts` about `:140-170`, "assigns a rendered selection or round-robin plan"): a
batch with assigned items and one refused item (a stale revision): the read gives each assigned item's application id,
operator id and assignment id, and the refused item's code with null ids; a replay of the command gives the same read;
another SuperAdmin is refused. Optional, only if cheap: the item count at which the current summary passes 4096 bytes
(for the record; the overflow above about 60 items is parked, no code change).

## ITEM-18: the reassignment preview lists every duty Core transfers

Gap: the reassignment page cannot state the duties a reassignment transfers; the existing reads are per operator, open
only, or capped with another predicate.

Change:
- A new query `core.reassignment_preview` with input `{ applicationId }`, authorized as the reassignment is
  (`assignment.reassign` on the application; SuperAdmin staff surface; staff allowlist).
- It lists exactly what `core.reassign` (`src/modules/core/commands/assignment.ts` about `:231-278`) transfers, each duty
  with its kind, id and effect as the command applies it: open holds (recorded); possibly filed acts (the
  reconciliation owner moves for the states the command updates; an exhausted act is listed as recorded with its owner
  unchanged, as the command records it); incidents (owner moves or reviewer ends, per the Operations writer). Plus the
  application revision and the read time `asOf`: the preview can be stale, the page compares them.
- Incidents (grant condition, binding): ONE new read function in `src/modules/operations/case-work/incidents.ts` that
  shares ONE predicate with `transferApplicationDuties` (about `:288-312`). Extract the predicate once and use it in
  both; a copied predicate is a review finding. Bound it (read limit plus one, with a `complete` flag). Expose it through
  the Operations facade, one additive `coreOperationsPort` mapping in `src/domain/module-ports.ts`, and the Core
  `OperationsPort` (`src/modules/core/ports.ts` about `:95`, `PENDING_OPERATIONS` about `:109`); update the Core test
  fake in `test/core/` if the kit needs it.
- Only ids, kinds, states and effects; no notes or free text.
Tests: `test/core/assignment-holds.test.ts` about `:204-228` (it reads `core_assignments.transferred` about `:234-236`):
the preview's holds, acts and incidents equal what `transferred` records after the reassignment. The parity test with
the real Operations predicate in `test/operations/`: incidents in each predicate branch (owned by the from-operator,
reviewer kind, a reviewer account set) and ones outside it (another application, a closed state) give the same set in
the preview and in the transfer.

## Return (at most about 300 words)

Commits (id, subject); the tests that failed first (names, evidence files); check results; every deviation and why; the
UI-lane notes (new queries and fields); open points. Context: if your context passes about 250k, commit what is green
and return before 275k with what remains.
