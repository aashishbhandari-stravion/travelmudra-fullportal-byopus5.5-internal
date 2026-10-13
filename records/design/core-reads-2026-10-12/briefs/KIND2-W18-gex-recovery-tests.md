# Brief W18: recovery tests of the gate exception evidence migration (held branch; one commit, tests only)

Role: Principal Software Engineer. One review follow-up commit, tests only, on a held branch. No re-review.

## Where you work

- Worktree: `WT=/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/core-reads-2026-10-12/wt/w15-gex-evidence`
  (branch `held/gate-exception-evidence`, head `3265989`, `node_modules` installed). This branch is HELD: never move it
  onto another branch, never rebase it, never push. You are its only writer.
- Start EVERY Bash command with `cd $WT &&`. Use absolute paths under `$WT` for Read, Edit and Write. First command:
  `cd $WT && git branch --show-current && git log --oneline -2` (expect `held/gate-exception-evidence`, `3265989`, `3a81652`).
- Tests: `export TMPDIR=/tmp/claude-1000/w18; mkdir -p $TMPDIR`, then
  `node --test --test-global-setup=test/support/global-setup.ts <files> 2>&1 | grep -E "^ℹ (tests|pass|fail)|✖|AssertionError|expected|actual" | head -40`.
  Do not run `npm run check`. Checks before the commit: `npx tsc -p tsconfig.json --noEmit`; `npx eslint <changed files>`;
  the new tests; `test/static/*.test.ts` and `test/ops-tooling/*.test.ts` once each.
- Read first: `git show 3265989 --stat` and the migration `migrations/1190_core_gate_exception_evidence.sql`; the review
  `/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/core-reads-2026-10-12/research/reviews/ITEM-32-review.md`;
  the proposal section 13.2 (tests 24 and 25 and "Supported recovery"):
  `/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/ui-revamp-2026-10-12/output/proposals/P-11-gate-exception-evidence.md`
  (read that section only).
- Models to read before you write: `test/ops-tooling/rollback.test.ts`, `rollback-under-closure.test.ts`,
  `release-binding.test.ts`, `mark-filing-migration.test.ts` and their `kit.ts`; `src/platform/release-rollback.ts`;
  `src/platform/migrations.ts`. Reuse the kit's checkpoint, closure, release-registration and rollback helpers. Do not
  add a synthetic migration in place of 1190: the tests MUST apply the real migration 1190.

## The commit: two recovery tests (the finding: proposal tests 24 and 25 are missing)

Put both tests in one new file `test/ops-tooling/gate-exception-evidence-recovery.test.ts` (or in
`test/core/gate-exception-evidence-migration.test.ts` where a case needs no ops tooling).

1. Failure before admission reopens. Start on the schema head before 1190 with the prior release registered. Record
   accepted work before the closure (at least one gate exception grant of the earlier shape, so a legacy row exists).
   Close admission, take the checkpoint, apply 1190, then run the closed-cutover snapshot rollback. Prove: the schema
   head and the ledger are the prior ones (no 1190 row; the `evidence` column is absent); the prior release is the active
   one; every operation accepted before the closure is still present and unchanged (the legacy exception row and its
   operation record).
2. Failure after admission reopened. Apply 1190, activate the new release, reopen admission. Accept one grant with
   evidence. Prove: a code rollback to the prior release (its real manifest, which does not name the new schema head)
   is refused with `schema_incompatible`, and nothing changes; a repair release on the new schema (registered with the
   new head) activates, keeps the evidence-bearing grant (row and fact identical to before), and refuses a new grant
   without evidence with the field error. Also prove the statement of an earlier release (an insert that does not name
   `evidence`) still fails on the new schema.

Each assertion MUST fail if the behaviour it covers is removed. For at least these two, mutate, run, record the failing
output in `/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/core-reads-2026-10-12/research/evidence/ITEM-32-followup-mutations.txt`,
and restore the file exactly (`git checkout -- <file>`): (a) the rollback does not restore the checkpoint (mutate the
restore step in `src/platform/release-rollback.ts`; test 1 MUST fail); (b) the prior manifest names the new head in
`compatibleSchemaHeads` (test 2 MUST fail). A mutation that only changes the test's own expectation does not count. If a product mutation is not practical, record why and mutate the closest fixture instead.
`git status` MUST show only your test file(s) before you commit. No product code change. No change to `kit.ts` unless a
helper is missing; if you add one, keep it additive and name it in the commit body.

## Rules

- Files: `test/ops-tooling/` (new test file; `kit.ts` additive only if needed) and
  `test/core/gate-exception-evidence-migration.test.ts`. Nothing else.
- Public-fit commit message (no `ITEM-`, `R-nn`, `P-nn`, `OD-`, `K2-`, `WP-`, `Q-n`, "seam"). Subject such as
  "Test recovery before and after the gate exception evidence migration". Body: what each test proves; then
  "Review follow-up of the gate exception evidence requirement: the recovery tests of the release plan."; then, before
  the last line, `Ownership grant (orchestrator, 13 Oct 2026): review follow-up scope (<files>).`; last line
  `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Never bypass hooks.

## Return (at most about 200 words)

Commit (id, subject); what each test proves; the mutation results; check results; deviations. Return before about 250k
context; if you approach it, commit what passes and return a partial report.
