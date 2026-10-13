# Brief W19: the travel agent's notice on an outcome correction (Point N only; one commit)

Role: Principal Software Engineer. Kind 2, built from the accepted proposal and its one review. One commit. Failing
tests first. No re-review of your work by you; the architect runs one independent review afterwards.

## Where you work

- Worktree: `WT=/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/core-reads-2026-10-12/wt/w19-notice`
  (branch `outcome-correction-notice`, base `03abf9a`, `node_modules` installed). Never push. You are its only writer.
- Start EVERY Bash command with `cd $WT &&`. Use absolute paths under `$WT` for Read, Edit and Write. First command:
  `cd $WT && git branch --show-current && git log --oneline -1` (expect `outcome-correction-notice`, `03abf9a`).
- Tests: `export TMPDIR=/tmp/claude-1000/w19; mkdir -p $TMPDIR`, then
  `node --test --test-global-setup=test/support/global-setup.ts <files> 2>&1 | grep -E "^ℹ (tests|pass|fail)|✖|AssertionError|expected|actual" | head -40`.
  Do not run `npm run check`. Checks before the commit: `npx tsc -p tsconfig.json --noEmit`; `npx eslint <changed files>`;
  the new and changed test files; `test/static/*.test.ts`, `test/core/*.test.ts` and `test/delivery/*.test.ts` once each.
- Read first, in this order:
  1. The survey (file:line at this code, verified): `/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/core-reads-2026-10-12/research/briefs/KIND2-S30-survey-result.md`.
  2. The proposal, sections 0.1 to 0.5, 3, 4, 5, 9 and 11 only:
     `/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/core-reads-2026-10-12/research/inputs/proposals/K2-P17-4-outcome-correction-notice.md`.
     Its line numbers are old; use the survey's.

## Scope

IN: Point N. After an accepted outcome correction (`core.correct_from_evidence`, kind outcome), Core posts exactly one
notice to the owning travel agent in the same transaction: kind `generic_case_update`, params
`{ event: 'outcome_corrected', from, to }`, `ackRequired: false`, dedupe key
`outcome_corrected:<committed operation id>:<travel agent account id>`. A null operation id is refused with
`TmError('internal', 'unexpected')` (precedent in the survey §1). The call goes between `admin.ts:125` and `:126` as the
survey §1 shows; update the file's header comment.

OUT (do not build): Point H (history line, kernel vocabulary, views projector, migration, register line, views and
release tests; waits for Max, Q-N3); the UI words (`EVENT_TEXT`, the delivery words test; UI lane); any notice for
dependents (Q-N5); any bulk correction; `docs/verification/traceability.md`; the seed catalogue.

## Tests (failing first; record the failing run before the product change)

Put the integration tests in `test/delivery/outcome-correction-notice.test.ts` (new), with the real Core and the real
Delivery of `test/delivery/kit.ts`. Cover the proposal §11 rows N1 to N8 and N10 to N15, and N9 if practical:
- Outcome helper: bring an application to issued or refused through Core's API where practical (as
  `test/core/races-and-boundaries.test.ts` near `:150` does); a fixture update of `core_applications` is acceptable only
  for a case with no dependents, with a one-line comment. Add the helper to `test/delivery/kit.ts`.
- Failure injection (N12, N9): the kit cannot replace Core's Delivery port. Use an owner-session database trigger on
  `dlv_notices`, as `test/intake/bulk-contention.test.ts:30-53` does: for N12 raise an error on the correction notice's
  insert; for N9 raise `serialization_failure` on every attempt to reach `conflict_retry_exhausted`. Drop the trigger in
  `finally`. If N9 is not practical, record why in the report and skip it.
- N13 uses the kernel fault point `command.before_commit`; N8 uses `command.lose_ack` (survey §3).
- N10 and N11 need a dependency relation the seed lacks for the transitive and `refused` cases: declare a test-only head
  as `test/core/dependency-not-linked.test.ts:418-447` does (`publishHead`). Put them in the new delivery test if the
  kit allows publishing a head; otherwise extend `test/core/withdrawal-dependencies.test.ts` with the Core kit and
  assert the notice rows there (the Core kit's fake Delivery checks no params, so keep N1 and N2 in the Delivery kit).
- Race extension: `test/core/races-and-boundaries.test.ts` (the correction-versus-dependent-authorization race keeps its
  assertions and adds: one correction notice in either order).
- Boundaries B1 to B3 (proposal §11) in `test/ops-tooling/restore-reopen.test.ts`: a pre-release correction operation
  (operation and fact, no notice) resent with its key replays and backfills nothing; an interval-loss restore that lost
  a correction, recorded again after reopening, gives one notice; a projector replay or rebuild over corrections posts
  no notice.
- The null-operation-id refusal is not reachable (account actors only): do not test it; say so in the commit body.
Every assertion MUST fail without the product change, or under a mutation of the dedupe key (for N3, N6, N8): record
both in `/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/core-reads-2026-10-12/research/evidence/ITEM-30-fails-first.txt`
(the failing run before the change, and the key mutation run; restore exactly).

## Rules

- Files you MAY change: `src/modules/core/commands/admin.ts`; `test/delivery/kit.ts`;
  `test/delivery/outcome-correction-notice.test.ts` (new); `test/core/races-and-boundaries.test.ts`;
  `test/core/withdrawal-dependencies.test.ts`; `test/ops-tooling/restore-reopen.test.ts`. Nothing else. If you need
  another file, stop and report the file and the reason.
- No contract, vocabulary, migration, kernel or Delivery module change (the survey shows `{event, from, to}` validates
  today).
- One commit. Public-fit message (no `ITEM-`, `R-nn`, `P-nn`, `OD-`, `K2-`, `WP-`, `Q-n`, "seam"). Subject such as
  "Tell the travel agent when an outcome is corrected". Body: the behaviour, the dedupe key and why it uses the committed
  operation id, what the tests prove, what is not built (the history line; the UI words). Before the last line:
  `Ownership grant (orchestrator, 13 Oct 2026): accepted Kind 2 proposal scope (<files>).`; last line
  `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Never bypass hooks.

## Context limit and return

Return before about 250k context. At about 220k: if everything passes, commit; if not, do NOT commit; leave the work in
the tree and return a partial report (what passes, what remains, the next step). Final report at most about 200 words:
commit (id, subject); tests by row (N1 to N15, race, B1 to B3: done, skipped with reason); fails-first and mutation
results; check results; deviations.
