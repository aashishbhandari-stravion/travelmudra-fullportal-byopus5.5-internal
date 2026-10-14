# Brief W12 (wave 3): ITEM-22 the exhausted act and the active mark count, then ITEM-17 the operation's command and time

Role: Principal Software Engineer (implementation and tests). Two items, two commits in this order: ITEM-22, then
ITEM-17.

## Where you work

- Your worktree: `WT=/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/core-reads-2026-10-12/wt/w12-reads`
  (branch `wave3-reads`, at `e0b978d`, `node_modules` installed). You are its only writer. Commit there. Never push.
- Start EVERY Bash command with `cd $WT &&` (write the path out). Use absolute paths under `$WT` for every Read, Edit
  and Write. Never touch the lane clone (`.../lanes/core-reads-2026-10-12/repo`) or another worktree. First command:
  `cd $WT && git branch --show-current && git log --oneline -1` (expect `wave3-reads` and `e0b978d`; otherwise stop).
- Tests: `export TMPDIR=/tmp/claude-1000/w12; mkdir -p $TMPDIR`, then
  `node --test --test-global-setup=test/support/global-setup.ts <files> 2>&1 | grep -E "^ℹ (tests|pass|fail)|✖|AssertionError|expected|actual" | head -40`.
  ALWAYS filter test output. Do not run `npm run check` (the architect runs it per commit).
- Checks per commit: `npx tsc -p tsconfig.json --noEmit`; `npx eslint <changed files>`; the targeted tests; before each
  commit also `test/core/*.test.ts`, `test/system/core-pages.test.ts` and `test/unit/*.test.ts` once.
- Read with `grep -n` and `sed -n 'a,bp'`. Never read a large file in full. Surveys from read-only agents; verify each
  line before you rely on it: `/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/core-reads-2026-10-12/research/briefs/WAVE3-survey-D-result.md`
  (ITEM-22) and `WAVE3-survey-C-result.md` (ITEM-17), same folder.
- Sources (read only the named items), folder
  `/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/ui-revamp-2026-10-12/output/proposals/`:
  `P-17-wp11-reconciliation-marks-corrections.md` item (2); `P-10-wp06-core-requests.md` item (b) and
  `P-02-operation-command-and-time.md`.

## Rules

- Failing test first. Run it before the change and save the filtered output to
  `/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/core-reads-2026-10-12/research/evidence/ITEM-22-fails-first.txt`
  and `ITEM-17-fails-first.txt` (first line: `# <test names> before the change, <date>`).
- Files you MAY edit:
  - ITEM-22: `src/modules/core/` (prompt scope; NOT `src/modules/core/commands/groups.ts`, NOT
    `src/modules/core/intake-writers.ts`), `src/contracts/core.ts` (additive only), `src/core-api/bindings/core.ts`,
    `test/core/*.test.ts`, `test/system/core-pages.test.ts`, and (orchestrator grant, 13 Oct 2026)
    `test/operations/protection-mark-filing.test.ts`.
  - ITEM-17 (orchestrator grant, 13 Oct 2026): `src/contracts/queries.ts`, `src/core-api/bindings/kernel.ts`,
    `test/system/case-rules.test.ts`.
  - Each item: one line in `docs/verification/read-model-register.md` (Kind 1 record; orchestrator grant).
  Nothing else; stop and report if another file must change. No kernel change (`src/kernel/` is off limits), no
  migration, no new reason code, no signature change to any existing export.
- Public-fit: no internal identifier (`OD-…`, `K2-…`, `P-nn`, `ITEM-…`, `WP-…`, `R-nn`, "seam") in code, comments, test
  names or commit messages. Commit message: imperative subject under 72 characters; a body that says the gap, the change
  and the tests; before the last line: `Ownership grant (orchestrator, 13 Oct 2026): <the files this commit changes>`
  (write "prompt scope" for the files under `src/modules/core/`, `src/contracts/core.ts` and the core binding); last line
  `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Never bypass hooks.
- Match the surrounding code style and comment density.

## ITEM-22: the exhausted act's future owner, decider, reason and time; the count of active marks

Gap: the staff case read serves a protection mark's flags, restore id and recorded time (already built), but not the
number of active marks, and its `acts[]` omit the exhausted act's future owner, who exhausted it, why and when, although
the Core row loads them (`store.ts` about `:314-320`).

Change:
- Four nullable fields on each staff case act: future owner id, exhausted by, exhausted reason, exhausted at (from the
  state change time; verify that the exhausted state is terminal in `writers.ts` about `:232-235`, and say so in a
  comment). Add the exhausted-by account to the names the read resolves (`namesOf` in `staff-views.ts`). Use the field
  naming style of the surrounding act fields.
- A top-level active mark count on the staff case (one bounded count; verify the index). Do NOT put it inside `mark`:
  a test deep-equals `mark`.
- Orchestrator decision D-a (13 Oct 2026): the exhausted reason is served on `core.ops_case` and `core.admin_case`
  (staff); `core.ta_application` excludes it, and a test asserts that.
Tests: `test/operations/protection-mark-filing.test.ts`, describe "the staff case read" (`staffCase` helper about
`:508-514` encodes against the contract; the exhausted act is built about `:269-285`): the four fields with their values
and the decider's name; the count with zero, one and two active marks (if the data model allows two; otherwise state
why); the travel agent's case read carries no exhausted reason (as `test/system/core-pages.test.ts` about `:555`
asserts with `doesNotMatch`).

## ITEM-17: `core.operation` names the command and the acceptance time

Gap: the operation lookup answers `accepted` without the command's name or the time it was accepted, so a status page
cannot say what was done or when.

Change (orchestrator grant G1, conditions binding):
- Two additive fields on the `accepted` branch of `core.operation` (`src/contracts/queries.ts` about `:123-130`):
  `commandName` as a string (not the command enum: a retired name must not fail the encode) and `acceptedAt` (wire
  date).
- In `src/core-api/bindings/kernel.ts` (about `:26-45`), after the kernel's `lookupOperation` returns accepted: one
  read-only row from `sys_operations` by `actor_key` and `operation_key`, the same key pair the kernel uses (precedent:
  `src/platform/capacity.ts` about `:104`). Lock mode none, no new index, and the read never runs inside a command
  transaction. The kernel stays unchanged.
Tests (`test/system/case-rules.test.ts` about `:250-270`; `atCore()` already calls `core.operation` for a
`core.record_assistance_entry` key): the accepted answer names `core.record_assistance_entry` and its `acceptedAt`
equals the recorded acceptance time; a replayed lookup returns the same two values as the first (grant condition).

## Return (at most about 300 words)

Commits (id, subject); the tests that failed first (names, evidence files); check results; every deviation and why; the
UI-lane notes (new fields); open points. Context: if your context passes about 250k, commit what is green and return
before 275k with what remains.
