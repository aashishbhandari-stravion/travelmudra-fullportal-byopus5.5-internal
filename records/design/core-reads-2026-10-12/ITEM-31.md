# ITEM-31 P-21 (2), K2-P21-2 option A: a recorded payment fixes the application's price

Kind 2, P1. Proposal `K2-P21-2-price-fixed-by-payment.md` and its one review (`K2-P21-2-review.md`).

## Split (architect, 13 Oct 2026, under OD-X26)

| Part | Built | Reason |
|---|---|---|
| (a) refusal of `core.propose_price_increase` on a paid application; an open increase ends in the payment entry's transaction; `accept` refused | No | Money behaviour (parked for Max under OD-X26). Depends on Q1 (release reconciliation RD-1 or RD-2: a kernel `releases.ts` verification field, a platform cutover hook and a CLI step, beyond additive vocabulary), Q2 (SC-1 scope authority: `derived.ts`, `controls.ts`) and Q4 (the definition of "recorded payment"). Ownership spreads beyond Core and Payments (proposal §10). |
| (b) applications added after a catalogue price change are quoted at the price current at their creation | Tests only (no code change, proposal §12) | T-B1 (`test/core/submission-price.test.ts`, inside the lane). T-B2 (`test/intake/bulk-mapping.test.ts` beside `:143`) pins B16's current behaviour; Q3 stays open; grant asked of the orchestrator (13 Oct 2026). |

Commit: `acd666e` (cherry-picked from `14f3fa7`; worker W20, Sonnet, about 181k context, branch `price-after-publication-tests`
from `03abf9a`). Grant: **orchestrator (13 Oct 2026, under
OD-X26; PLAN D-22)**: tests only, `test/intake/bulk-mapping.test.ts` (new cases appended as one self-contained block at the
end of the file, so the bulk lane's merge stays trivial) with T-B1 in `test/core/submission-price.test.ts`; the T-B2 test
says in a comment that it pins today's B16 rule. Part (a) stays parked for Max.

## Open for Max (parked under OD-X26; do not build)

- Q1: release disposition RD-1 (automatic reconciliation in the release verification) vs. RD-2 (count and fail; an
  engineer reconciles by hand).
- Q2: scope authority on a paid application (SC-1 recommended: the payment ends the price part; the scope stop stays).
- Q3: B16 attempt baseline vs. OD-X9 creation time for a bulk attempt that spans a publication.
- Q4: "recorded payment" = the current status `payment_received` (recommended).

## Tests, review, checks

`14f3fa7`, tests only (`test/core/submission-price.test.ts` +54/-2 including the import block;
`test/intake/bulk-mapping.test.ts` +146, appended after the last line as one block).

- T-B1: after a routine publication of 3,500 to 4,000 INR (drafts `continue_on_head`, submitted `continue_current`), a
  later draft governs on the new head and submits at 4,000; a submission posting 3,500 is refused `stale_revision` /
  `price_changed` and writes nothing; the earlier submitted application keeps 3,500, with no increase, reduction or
  notice.
- T-B2: holding a row's passport fetch (`kit.workers.hold`) holds row processing across a publication (the proposal's
  unverified kit point, confirmed). `continue_current`: the draft keeps the attempt's 3,500 and posting 4,000 is
  refused; `continue_on_head`: the recheck moves the draft to the head and it quotes the head price. A comment says the
  test pins today's one-baseline-per-attempt rule and changes with Max's answer to Q3.
- Pins existing behaviour, so no fail-first run: mutations instead (`evidence/ITEM-31-b-mutations.txt`): the price check at
  `submission.ts:144` disabled fails T-B1; `impact-recheck.ts:226` with `continue_on_head` inert fails that case, and
  with `continue_current` moved to the head fails the other.
- Worker deviation: the two bulk scenarios run in sequence on the one offering priced 3,500, so the second publishes
  4,000 to 4,500 and quotes 4,500. Both blocks change the tourist head price and are last in their files.
- Checks (worker): tsc, eslint clean; the two files 28 of 28; `test/static` 76 of 76.

Review: Codex `gpt-6.1-sol` high, read-only, one pass on `14f3fa7` (`reviews/ITEM-31-b-review.md`). Verdict: sound with
the fixes above (real intake, publication and submission paths; the Q3 comment is accurate).
- R-01, P1: the two bulk scenarios depend on test order (`bulk-mapping.test.ts:468-471`; the `continue_on_head` case
  expects the 4,000 price the previous case publishes; it fails when run alone). Sent to the orchestrator (under
  OD-X26) with the recommendation: fix now, one sequential test, fresh Sonnet worker. **Orchestrator (14 Oct 2026, under OD-X26; PLAN D-23): fix now**,
  one follow-up commit inside the appended block only, a fresh Sonnet worker (W22), no re-review; the test sets up every
  price publication it relies on and passes when selected alone; the Q3 comment stays. Follow-up: `a1cc0a9` (cherry-picked from `20b525b`; W22, Sonnet): one sequential test that publishes its own 4,000 and 4,500
  prices from the seed 3,500; alone 1 of 1, whole file 17 of 17; tsc, eslint, `test/static` 76 of 76
  (`evidence/ITEM-31-b-followup.txt`).
 Lane checks: CHECKS_31
