# Brief W20: price of applications added after a catalogue price change (tests only; one commit)

Role: test engineer. One tests-only commit. No product code change.

## Where you work

- Worktree: `WT=/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/core-reads-2026-10-12/wt/w20-price-tests`
  (branch `price-after-publication-tests`, base `03abf9a`, `node_modules` installed). Never push. You are its only writer.
- Start EVERY Bash command with `cd $WT &&`. Use absolute paths under `$WT` for Read, Edit and Write. First command:
  `cd $WT && git branch --show-current && git log --oneline -1` (expect `price-after-publication-tests`, `03abf9a`).
- Tests: `export TMPDIR=/tmp/claude-1000/w20; mkdir -p $TMPDIR`, then
  `node --test --test-global-setup=test/support/global-setup.ts <files> 2>&1 | grep -E "^ℹ (tests|pass|fail)|✖|AssertionError|expected|actual" | head -40`.
  Do not run `npm run check`. Checks before the commit: `npx tsc -p tsconfig.json --noEmit`; `npx eslint <changed files>`;
  the two test files; `test/static/*.test.ts` once.
- Read first: the proposal, section 12 and the §9 rows T-B1 and T-B2 (lines 456-457), and §18 lines 657-666:
  `/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/core-reads-2026-10-12/research/inputs/proposals/K2-P21-2-price-fixed-by-payment.md`.
  Only those parts; the rest of the proposal is NOT built.

## The commit: two tests that pin today's pricing of applications created after a price change

1. T-B1, in `test/core/submission-price.test.ts`: a routine higher price is published (for example 3,500 to 4,000 INR;
   drafts policy `continue_on_head`, submitted work `continue_current`). A draft created afterwards in the same group
   governs on the new head and quotes 4,000; a submission that posts 3,500 is refused `stale_revision` /
   `price_changed`; an application submitted before the change keeps its quoted 3,500, with no increase proposed and no
   notice.
2. T-B2, in `test/intake/bulk-mapping.test.ts`: append ONE self-contained `describe` block at the END of the file (do
   not edit the existing tests or `:143`; a parallel lane merges this file). A bulk attempt starts on baseline 3,500;
   a routine publication of 4,000 happens while its rows are still to be processed (proposal §18 says the kit's ability
   to hold row processing across a publication is unverified: confirm it; if it is not possible, report it and do not
   build T-B2). With drafts policy `continue_current` the drafts keep the attempt baseline and quote 3,500 at
   submission; with `continue_on_head` the recheck moves them to the head and they quote 4,000. Put this comment above
   the block: the test pins today's rule that each intake attempt has one applicable baseline; an open owner question
   asks whether such drafts should instead take the price current at their creation, and this test changes with that
   answer.

Use only synthetic data. If a test does not pass against today's code, do NOT change product code: stop, and report the
observed behaviour with file:line (that would be a finding).

Mutation checks (these tests pin existing behaviour, so they cannot fail first): for each test, mutate the product rule
it covers once (T-B1: the submission price check, for example the comparison in `src/modules/core/commands/submission.ts`
near `:142`; T-B2: the draft policy handling in the recheck, `src/modules/catalogue/impact-recheck.ts` near `:202-232`),
run, record the failing output in
`/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/core-reads-2026-10-12/research/evidence/ITEM-31-b-mutations.txt`,
and restore the file exactly (`git checkout -- <file>`). A mutation of the test's own expectation does not count.
`git status` MUST show only the two test files before you commit.

## Rules

- Files: `test/core/submission-price.test.ts`, `test/intake/bulk-mapping.test.ts` (append only). Nothing else; if a
  helper is missing, write it inside the test file.
- Public-fit commit message (no `ITEM-`, `R-nn`, `P-nn`, `OD-`, `K2-`, `WP-`, `Q-n`, "seam"). Subject such as
  "Test the price of applications created after a price change". Body: what each test proves; that the bulk test pins
  today's one-baseline-per-attempt rule. Before the last line: `Ownership grant (orchestrator, 13 Oct 2026): tests only
  (test/core/submission-price.test.ts, test/intake/bulk-mapping.test.ts).`; last line
  `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`. Never bypass hooks.

## Return (at most about 150 words)

Commit (id, subject); what each test proves; mutation results; check results; deviations. Return before about 200k
context.
