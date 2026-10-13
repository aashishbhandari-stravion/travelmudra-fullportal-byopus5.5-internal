# Brief W17: review follow-up of the disclosure correction rule (held branch; two commits)

Role: Principal Software Engineer. Two review follow-up commits on the held branch. No re-review.

## Where you work

- Worktree: `WT=/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/core-reads-2026-10-12/wt/w13-disclosure`
  (branch `held/disclosure-correction`, head `2bcc751`, `node_modules` installed). This branch is HELD: never move it onto
  another branch, never push. You are its only writer.
- Start EVERY Bash command with `cd $WT &&`. Absolute paths under `$WT` for Read, Edit, Write. First command:
  `cd $WT && git branch --show-current && git log --oneline -3` (expect `held/disclosure-correction`, `2bcc751`, `b6f7833`).
- Tests: `export TMPDIR=/tmp/claude-1000/w17; mkdir -p $TMPDIR`, then
  `node --test --test-global-setup=test/support/global-setup.ts <files> 2>&1 | grep -E "^ℹ (tests|pass|fail)|✖|AssertionError|expected|actual" | head -40`.
  Do not run `npm run check`. Checks before each commit: `npx tsc -p tsconfig.json --noEmit`; `npx eslint <changed files>`;
  the targeted tests; `test/static/*.test.ts`, `test/operations/*.test.ts` once.
- Read `git show b6f7833` and `git show 2bcc751` first (the change under review), and the review:
  `/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/core-reads-2026-10-12/research/reviews/ITEM-05-review.md`.

## Commit 1 (docs only): the release rule names its dependency (finding R-01)

The release record in `docs/operations.md` (the section commit `2bcc751` added) MUST state: this rule (only a replacement
the travel agent can receive meets a disclosure's correction) ships only together with the recorded "no replacement owed"
decision and with the new schema head that decision adds; released alone, a disclosure incident that names no file can
never be resolved (an uploaded replacement cannot meet it). Keep the existing text accurate. Commit subject such as
"State that the disclosure correction rule ships with the no-replacement decision".

## Commit 2 (tests only): concurrency, retry and eligibility guards (finding R-02)

In `test/operations/disclosure-correction.test.ts` (or a new file in `test/operations/`), deterministic database tests:
- both orders of a resolve and a concurrent invalidation of the replacement (the replacement becomes ineligible before
  the resolve commits; and after it): the resolve is refused in the first, and in the second the resolved history stays
  unchanged;
- a retried resolve (same operation key) after a lost response, and a replay after the replacement became ineligible:
  exactly one resolution fact and one operation record, and the replay returns the original result;
- the independent eligibility guards, each alone making the replacement not receivable: another version group, not
  current, content safety not passed (use the guards `releasableReplacement` checks; read the code for their names).
Each new assertion MUST fail if the guard or rule it covers is removed: for each guard, remove it, run, record the
failing output in `.../core-reads-2026-10-12/research/evidence/ITEM-05-followup-mutations.txt`, and restore the file
exactly (`git checkout -- <file>`; `git status` shows only the test file before you commit). No product code change.

## Rules

- Files: commit 1 `docs/operations.md` only; commit 2 test files under `test/operations/` only.
- Public-fit commit messages (no `ITEM-`, `R-nn`, `P-nn`, `OD-`, `K2-`, `WP-`, `Q-n`, "seam"); body ends with
  "Review follow-up of the disclosure correction rule." then, before the last line, `Ownership grant (orchestrator, 13 Oct
  2026): accepted Kind 2 proposal scope (<files>).`; last line `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
  Never bypass hooks.

## Return (at most about 200 words)

Commits (id, subject); the mutation results; check results; deviations. Return before about 250k context.
