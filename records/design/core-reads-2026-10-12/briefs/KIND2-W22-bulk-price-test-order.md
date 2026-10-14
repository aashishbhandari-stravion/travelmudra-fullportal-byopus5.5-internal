# Brief W22: make the bulk price scenarios independent of test order (tests only; one commit)

Role: test engineer. One review follow-up commit, tests only. No re-review.

- Worktree: `WT=/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/core-reads-2026-10-12/wt/w20-price-tests`
  (branch `price-after-publication-tests`, head `14f3fa7`, `node_modules` installed). Never push. Only writer.
- Start EVERY Bash command with `cd $WT &&`; absolute paths under `$WT` for Read, Edit and Write. First:
  `cd $WT && git branch --show-current && git log --oneline -1` (expect `price-after-publication-tests`, `14f3fa7`).
- Tests: `export TMPDIR=/tmp/claude-1000/w22; mkdir -p $TMPDIR`, then
  `node --test --test-global-setup=test/support/global-setup.ts <files> 2>&1 | grep -E "^ℹ (tests|pass|fail)|✖|AssertionError" | head -30`.
- Read: `git show 14f3fa7 -- test/intake/bulk-mapping.test.ts` and the review
  `/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/core-reads-2026-10-12/research/reviews/ITEM-31-b-review.md`.

## The commit

The finding: the `continue_on_head` scenario (near `test/intake/bulk-mapping.test.ts:468-471`) depends on the 4,000
price that the preceding `continue_current` scenario publishes; run alone it fails on its precondition. Fix: combine the
two scenarios into ONE explicitly sequential test inside the same appended block (the block that `14f3fa7` added at the
end of the file; change nothing above it), keeping every assertion and the comment about the open owner question. The test MUST set up every price publication
it relies on itself (orchestrator condition): it may not rely on a price published by any other test in the file.
Prove it: run the new test alone with `--test-name-pattern "<its name>"` (passes), and run the whole file (passes).
Record both runs in `/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/core-reads-2026-10-12/research/evidence/ITEM-31-b-followup.txt`.
Checks: `npx tsc -p tsconfig.json --noEmit`; `npx eslint test/intake/bulk-mapping.test.ts`; `test/static/*.test.ts` once.
`git status` MUST show only `test/intake/bulk-mapping.test.ts` before you commit.

Public-fit commit message (no `ITEM-`, `R-nn`, `P-nn`, `OD-`, `K2-`, `WP-`, `Q-n`, "seam"). Subject such as
"Run the bulk price scenarios as one sequential test". Body: why (the second scenario needs the first one's price), then
"Review follow-up of the price tests for applications created after a price change."; before the last line
`Ownership grant (orchestrator, 13 Oct 2026): tests only (test/intake/bulk-mapping.test.ts).`; last line
`Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`. Never bypass hooks.

Return (at most about 100 words): commit (id, subject); the single-test and whole-file results; checks; deviations.
Return before about 120k context.
