# Brief S30: read-only survey for the outcome correction notice (Point N only)

Role: survey engineer. READ-ONLY on source. You write exactly one file: the result file named below. No commit, no
branch, no worktree, no change to any other file. Do not run `npm run check` or the database tests.

## Inputs

- Repository (read only): `R=/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/core-reads-2026-10-12/repo`
  at head `3a81652` (branch `core-reads-2026-10-12`). Read files at that head (`git -C $R show 3a81652:<path>` or the
  working tree, which is clean at that head).
- Proposal: `/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/core-reads-2026-10-12/research/inputs/proposals/K2-P17-4-outcome-correction-notice.md`
  (sections 0.1 to 0.5, 3, 4, 5, 9, 11, 12, 17). Its line numbers are from an older head (`bc9a353`); many have moved.
- Its one review: `.../research/inputs/reviews/K2-P17-4-review.md` (all findings were accepted into the proposal).

## Scope

Point N only: one travel agent notice per accepted outcome correction act, keyed on the committed operation id and the
travel agent, null operation id refused. Point H (history line, kernel vocabulary, views projector, migration, register
line, views and release tests) is OUT: it waits for Max (Q-N3). Do not survey H beyond one line saying which §11 tests
belong to H.

## Questions to answer (file:line at `3a81652` for every claim)

1. The correction command today: where the outcome correction is handled (`src/modules/core/commands/admin.ts` per the
   proposal), where the committed operation id is available inside the transaction, where `postNotice` (or the Delivery
   port's notice call) is reachable from Core, and the exact call the proposal puts "after `:69`". Quote the 10 to 20
   lines where the call goes.
2. The notice: the `generic_case_update` kind, its params schema (does `{event, from, to}` validate today, or does it need
   a contract change?), the dedupe key column and uniqueness rule in Delivery, `ack_required`, and the travel agent
   resolution (owning travel agent of the application).
3. The fixtures: does `test/delivery/kit.ts` let a test replace Core's Delivery port (proposal §17 says unverified; the
   kit replaces the Operations port near `:265`)? If not, name the smallest test-only seam. Is there an existing helper
   that brings an application to an issued or refused outcome (`test/core/races-and-boundaries.test.ts` near `:150`)?
   Where are `command.before_commit` and `command.lose_ack` (`src/kernel/faults.ts`) and how does a test enable them?
4. N9 (serialization retries exhausted): how a test forces `conflict_retry_exhausted` for this command in the composed
   product (proposal §17 says unverified). Give the mechanism or say it is not practical and why.
5. For each test N1 to N15, the race extension (`races-and-boundaries`, `withdrawal-dependencies`) and B1 to B3: the
   file it goes in, the helpers it needs, and anything that blocks it at this head.
6. Ownership: list every file the Point N change and its tests touch. Mark each INSIDE (proposal §12 Core and test
   rows for N) or OUTSIDE (needs a grant). The UI lane's words (`EVENT_TEXT` and the delivery words test) are OUTSIDE
   and are not built.
7. Does any existing test assert "no travel agent notice" after a correction (it will break)? Search `test/` for the
   correction command and for notice counts after it.
8. Hostile states (proposal §9) that apply to N only, each with one line: the Nth retry, what a failure leaves behind,
   concurrency. Flag any new risk the proposal missed, ranked P0/P1/P2 with a concrete scenario.

## Result

Write `/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/core-reads-2026-10-12/research/briefs/KIND2-S30-survey-result.md`:
at most about 150 lines, terse, file:line everywhere, one section per question. Then return at most 10 lines: the result
path, any blocker, and any P0 or P1 risk. Return before about 200k context.
