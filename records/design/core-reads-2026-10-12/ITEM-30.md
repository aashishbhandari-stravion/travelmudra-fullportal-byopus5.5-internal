# ITEM-30 P-17 (4) N, K2-P17-4: the travel agent's notice on an outcome correction (Point N only)

Kind 2, P1. Proposal `K2-P17-4-outcome-correction-notice.md` and its one review (`K2-P17-4-review.md`). Survey S30
(Sonnet, read-only; about 272k context; `ITEM-30-survey.md`). Worker W19 (Opus, worktree `wt/w19-notice`, branch
`outcome-correction-notice` from `03abf9a`; about 215k context). Commit: `bf2158d` (the worker commit, on the lane branch unchanged by fast-forward). Grant:
accepted Kind 2 proposal scope, Point N rows of proposal §12. Not held: Point N is releasable alone (proposal option H-C).

## Change

After an accepted outcome correction (`core.correct_from_evidence`, kind `outcome`), Core posts one notice to the owning
travel agent in the same transaction (`src/modules/core/commands/admin.ts`, after the dependents are evaluated):
`generic_case_update`, params `{ event: 'outcome_corrected', from, to }`, no acknowledgement, dedupe key
`outcome_corrected:<committed operation id>:<travel agent account id>`. The committed operation id (not the client
operation key) keeps two actors with the same client key apart (review R-01 of the proposal). A null operation id is
refused `internal`; it cannot occur for account actors and is not tested. No contract, vocabulary, migration, kernel or
Delivery change. A fields correction is unchanged.

Not built: Point H (the history line; waits for Max, Q-N3), the UI words (`EVENT_TEXT`; UI lane), notices for dependents
(Q-N5), any bulk correction (Q-N4). Until the UI lane adds the words, the travel agent reads the generic text of
`generic_case_update`.

## Tests

`test/delivery/outcome-correction-notice.test.ts` (new; real Core and real Delivery): N1 to N9 and N12 to N15 (N9: 12
refused attempts reach `conflict_retry_exhausted`; failure injection by a test-only trigger on `dlv_notices`, dropped in
`finally`; N13 `command.before_commit`; N8 `command.lose_ack`). `test/core/withdrawal-dependencies.test.ts`: N10 (A to B
to C; one correction notice and one price notice) and N11 (a relation that requires `refused`), with test-only heads.
`test/core/races-and-boundaries.test.ts`: one correction notice in either order of the race.
`test/ops-tooling/restore-reopen.test.ts`: B1 (a pre-release correction replays and backfills nothing), B2, B3 (a
projector replay or rebuild posts nothing). Failed first: 16 of 43 before the change; with the operation key in place of
the operation id, 13 fail, among them N3, N6, N8 (`evidence/ITEM-30-fails-first.txt`).

Worker deviations: (1) the Delivery-kit outcome helper is a fixture update, used only for cases without dependents (a
real outcome needs a filed act, which the Delivery kit cannot produce easily); (2) B2 records the correction after the
reopening; it does not simulate a correction lost by the restore; (3) the null-operation-id refusal is not tested.

## Review and dispositions

Codex `gpt-6.1-sol` high, read-only, one pass on `bf2158d` (`reviews/ITEM-30-review.md`). Verdict: sound with the fixes
above. The product change is sound on source inspection: the command's transaction, the committing operation id and the
owning travel agent in the key, params validate, acknowledgement false, null id refused; fields corrections, refusals,
dependent protection and existing price notices unchanged; positive assertions fail without the change.

- R-01, P1: the rollback proof leaves out dependents and prices (N12 and N13 have no dependents; N10 and N11 cover
  dependents only on success, through the Core kit's fake Delivery). Sent to the orchestrator (13 Oct 2026, under
  OD-X26) with the recommendation: fix now, tests only, fresh Opus worker, no re-review. **Orchestrator (14 Oct 2026, under OD-X26; PLAN D-23): fix now**,
  tests only, one follow-up commit by a fresh Opus worker (W21), no re-review; conditions: a dependent with an open
  increase, the real Delivery where practical, both failure points, every affected row, fact and operation compared, one
  resend succeeds, and the new tests fail first against a deliberately weakened rollback. Follow-up: `b21f3ff` (on the lane unchanged;
  W21, Opus, about 180k context; `test/delivery/outcome-correction-notice.test.ts`, `test/delivery/kit.ts`). N16 and N17,
  real Delivery: an issued application with a transit dependent linked through Core and an open increase proposed through
  Core (the upstream's outcome is a fixture row set before the link, with a comment); the correction fails the dependent
  and supersedes the increase, which posts a price notice. N16 (the notice insert refused by a test trigger, in two
  variants: `raise_exception`, and `drop_row`, which skips the row so the transaction stays usable; Delivery's
  `RETURNING notice_id` check at `notices.ts:103-108` then refuses) and N17 (`command.before_commit`) leave both
  applications, the dependency, the price rows, every `dlv_notices` row, every fact (`dlv.notice_posted` included) and
  `sys_operations` unchanged; a resend with the same key commits once with one correction notice and one price notice; a
  replay adds nothing. Weakened rollback (`evidence/ITEM-30-followup-mutations.txt`): (a) the handler swallows the post
  error: the `raise_exception` variant still rolls back (PostgreSQL aborts the transaction), so the worker added
  `drop_row`, under which N16 fails (the correction commits without its notice); (b) the fault fires after the commit: N17
  fails (`outcome_unknown`). Checks (worker): tsc, eslint clean; `test/static` 76 of 76, `test/core` 159 of 159,
  `test/delivery` 55 of 55.
- R-02, P2, parked: no test forces one serialization failure followed by success and checks that the notice names the
  committing attempt.

## Checks

Worker at `bf2158d`: tsc and eslint clean; `test/static` 76 of 76, `test/core` 159 of 159, `test/delivery` 53 of 53.
CHECKS_30
