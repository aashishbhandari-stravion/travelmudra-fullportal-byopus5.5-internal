# Brief W21: rollback proof of the outcome correction notice with dependents and prices (tests only; one commit)

Role: Principal Software Engineer. One review follow-up commit, tests only. No re-review.

## Where you work

- Worktree: `WT=/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/core-reads-2026-10-12/wt/w19-notice`
  (branch `outcome-correction-notice`, head `bf2158d`, `node_modules` installed). Never push. You are its only writer.
- Start EVERY Bash command with `cd $WT &&`. Use absolute paths under `$WT` for Read, Edit and Write. First command:
  `cd $WT && git branch --show-current && git log --oneline -2` (expect `outcome-correction-notice`, `bf2158d`, `03abf9a`).
- Tests: `export TMPDIR=/tmp/claude-1000/w21; mkdir -p $TMPDIR`, then
  `node --test --test-global-setup=test/support/global-setup.ts <files> 2>&1 | grep -E "^ℹ (tests|pass|fail)|✖|AssertionError|expected|actual" | head -40`.
  Do not run `npm run check`. Checks before the commit: `npx tsc -p tsconfig.json --noEmit`; `npx eslint <changed files>`;
  the changed test files; `test/static/*.test.ts`, `test/core/*.test.ts` and `test/delivery/*.test.ts` once each.
- Read first: `git show bf2158d` (the change and its tests: N10 and N11 in `test/core/withdrawal-dependencies.test.ts`,
  N12 and N13 in `test/delivery/outcome-correction-notice.test.ts`), and the review
  `/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/core-reads-2026-10-12/research/reviews/ITEM-30-review.md`
  (finding R-01 only; R-02 is parked, do not build it).

## The commit: the correction rolls back as a whole when it has dependents and prices

Build a case where one correction act: fails at least one dependent (`dependency_failed`) and ends a dependent's open
price increase (which posts a price notice), and then:
1. the correction notice's insert fails (the test-only trigger on `dlv_notices` that N12 uses, filtered to the
   correction notice), and
2. in a second run, the kernel fault point `command.before_commit` throws for this command (as N13).
In each run assert that NOTHING changed, comparing before and after: the corrected application (outcome, revision), the
dependents' outcomes and dependency states, the price records (the increase stays open), every `dlv_notices` row (no
correction notice, no price notice), the facts (`core.outcome_corrected`, the dependents' facts, the price facts, and
`dlv.notice_posted` where Delivery is real), and `sys_operations` (no row for the attempt). Then drop the fault and
resend the same correction with the same key: it is accepted once, with exactly one correction notice and one price
notice.

Use the real Delivery (`test/delivery/kit.ts`) if you can build the dependent with an open increase there (a fixture
update for the corrected application's outcome is acceptable, with a comment; the dependent's increase should be opened
through Core's API). If that is not practical, build it in the Core kit beside N10 in
`test/core/withdrawal-dependencies.test.ts` (its fake Delivery writes `dlv_notices` rows, so the trigger works; it
writes no `dlv.notice_posted` fact) and state in the commit body which facts are not covered and why.

Fail first against a deliberately weakened rollback (orchestrator condition). Make two temporary product mutations,
run the new tests after each, record the failing output, and restore each file exactly (`git checkout -- <file>`):
(a) in `src/modules/core/commands/admin.ts`, wrap the correction's `postNotice` call in a try/catch that swallows the
error: the notice-insert-failure run MUST fail (the correction, the dependents and the price change commit without the
notice); (b) in the kernel's command runner (`src/kernel/command.ts`, the `command.before_commit` fault point; see
`src/kernel/faults.ts`), make the fault fire only after the commit: the `before_commit` run MUST fail. Record both runs in
`/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/core-reads-2026-10-12/research/evidence/ITEM-30-followup-mutations.txt`.
`git status` MUST show only test files before you commit. No product code change.

## Rules

- Files: `test/delivery/outcome-correction-notice.test.ts`, `test/delivery/kit.ts` (additive helpers),
  `test/core/withdrawal-dependencies.test.ts`. Nothing else.
- Public-fit commit message (no `ITEM-`, `R-nn`, `P-nn`, `OD-`, `K2-`, `WP-`, `Q-n`, "seam"). Subject such as
  "Test that a failed correction notice leaves dependents and prices unchanged". Body: what the test proves; which
  Delivery it uses and any fact it cannot check. Then "Review follow-up of the outcome correction notice." Before the last
  line: `Ownership grant (orchestrator, 13 Oct 2026): review follow-up scope (<files>).`; last line
  `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Never bypass hooks.

## Return (at most about 150 words)

Commit (id, subject); what the test proves and in which kit; the mutation or sensitivity result; check results;
deviations. Return before about 220k context.
