# KIND2-S30 result: Point N (outcome correction notice) at head 3a81652

Read-only survey. Nothing ran: no build, no test, no database. Every statement is read from source at `3a81652`, not executed.
Paths are relative to the lane repo. The proposal's line numbers are stale (`bc9a353`); the numbers here are current.

## 1. The command today

- Handler `core.correct_from_evidence`: `src/modules/core/commands/admin.ts:97-98`; `handle` `:103`; outcome branch `:107-127`.
  Actor kinds `['account']` only (`:98`), so every run goes through `runCommand`.
- The proposal's "after `:69`" is now after `admin.ts:125` and before `:126`.
- Operation id: `tx.ctx.operationId` (`src/kernel/db.ts:199-200`; null only for task steps). Each attempt makes a new id
  (`src/kernel/command.ts:324`), puts it in the context (`:328`) and writes that same id to `sys_operations` (`:362`).
  The id seen in the handler is the committed id. Null-check precedent: `core/commands/groups.ts:170-171`,
  `payments/commands/service-status.ts:116-117` (`TmError('internal','unexpected')`).
- Delivery from Core: `deps.delivery.postNotice` (`CoreDeps.delivery` `core/deps.ts:30`; port `core/ports.ts:133-139`; wired by
  `coreDeliveryPort` `src/domain/module-ports.ts:387-389`, `domain/compose.ts:626`; then `delivery/facade.ts:19`, `delivery/notices.ts:80`).
  `admin.ts` already calls it at `:140` and `deps.delivery.deliveryEvidence` at `:111`.
- Lines where the call goes (`admin.ts:117-127`):
```
117  const n = await tx.exec(sql`UPDATE core_applications SET outcome = ${input.outcome}, outcome_at = ${tx.now}, revision = revision + 1
119    WHERE application_id = ${app.application_id} AND outcome = ${app.outcome}`);
120  if (n !== 1) throw new TmError('stale_revision', 'stale_revision');
121  await coreFacts.append(tx, { type: 'core.outcome_corrected', subject: { type: 'application', id: app.application_id }, scope: appScope(app),
123    before: { outcome: app.outcome }, after: { outcome: input.outcome }, evidence: input.evidence });
125  await evaluateDependents(deps, tx, app.application_id, 'outcome_corrected');
     // <-- new, between :125 and :126
126  return appResult(app);
```
- The call (proposal N1; not compiled; `app.outcome` is narrowed to issued|refused by the guards at `:109`):
```
const operationId = tx.ctx.operationId;
if (operationId === null) throw new TmError('internal', 'unexpected');
await deps.delivery.postNotice(tx, {
  recipientAccountId: app.ta_account_id, applicationId: app.application_id, kind: 'generic_case_update',
  params: { event: 'outcome_corrected', from: app.outcome, to: input.outcome }, ackRequired: false,
  dedupeKey: `outcome_corrected:${operationId}:${app.ta_account_id}`,
});
```

## 2. The notice

- Kind exists: `kernel/vocabulary/delivery.ts:44`; table check `migrations/0800_delivery.sql:215-216`.
- Params: `generic_case_update: zParams` (`delivery/notices.ts:61`). `zParams` (`:48`): key regex `^[a-z][A-Za-z0-9]{0,40}$`, at most 16 keys;
  value must match the code regex (`:35`, `^[a-z][a-z0-9_]{0,62}$`, `:42`). `{event:'outcome_corrected', from:'issued', to:'refused'}` passes.
  **No contract change.** Wire type is open JSON (`contracts/delivery.ts:90`, `zWireJson`).
- Dedupe: `dedupe_key text NOT NULL CHECK (1..200)` (`0800_delivery.sql:228`); `CONSTRAINT dlv_notices_dedupe_key UNIQUE` (`:230`). Global, one column.
  Insert is `ON CONFLICT (dedupe_key) DO NOTHING` (`notices.ts:98-103`); on a repeat it compares only recipient and kind (`:104-110`), not params or application.
  Key length 18 + 30 + 1 + 30 = 79 (ids are 30 chars, `notices.ts:34`); limit 200 (`:81`).
- `ack_required boolean NOT NULL` (`0800_delivery.sql:219`); `false` is valid (`:231`).
- Travel agent: `app.ta_account_id` (`core/store.ts:64`). Delivery checks it against `getApplicationScope` (`notices.ts:89-92`, `core/facade.ts:52-55`);
  a `ta` recipient other than the owner is refused (`notices.ts:95`).
- Each new row appends fact `dlv.notice_posted` (`notices.ts:112-116`). The `ta_history` projector already turns it into the line "notice_posted"
  (`views/case-projectors.ts:304-306`), so N alone adds that history line. UI text for the event is absent: `pages.ts:189` has no entry, so the
  list shows "The application was updated." (`apps/shared/delivery/pages.ts:185,215`).

## 3. Fixtures

- Replace Core's Delivery port in `test/delivery/kit.ts`? **No, not through the kit.** `startDeliveryKit(o)` takes only `{config}` (`:250`) and fixes
  `core: { operations: fakeOperations }` (`:265`) and `delivery: { operations: operationsStandIn }` (`:266`). `:265` replaces Core's Operations port; Core's
  Delivery port stays the real one. The seam exists below the kit: `ComposeOptions.core` (`domain/compose.ts:245`) is spread last (`:628`);
  `CoreModuleOptions.delivery` (`core/register.ts:32`, used `:87`).
- Smallest test-only seam (recommended, zero code change): a database trigger from `kit.q` (owner session, `kit.ts:273`) on `dlv_notices`,
  BEFORE INSERT, raising for `NEW.kind='generic_case_update' AND NEW.params->>'event'='outcome_corrected'`. Precedent: `test/intake/bulk-contention.test.ts:30-53`
  (per-file database, `serialization_failure` trigger on `intake_rows`). It fails inside the real `postNotice` INSERT. The test MUST drop the trigger afterwards.
  Alternative (about 8 lines in the kit): a `coreDelivery` option passed at `kit.ts:265`; the wrapper needs late binding to the real port
  (`coreDeliveryPort(() => delivery.api)`), because the Delivery module exists only after `startTestDomain` returns.
- Outcome helper: **none**. Delivery kit has none. Core kit has the parts, not one helper: `submitted` `test/core/kit.ts:500`, `ready` `:552`,
  `authorizeInput` `:559`, `addArtifact` `:570`, `call` `:599`; inline issued sequence `races-and-boundaries.test.ts:147-158`; file-local `evidence()`/`result()`
  `withdrawal-dependencies.test.ts:30-42`. Refused needs no artifact. For D=0 cases the cheap Delivery-kit helper is a fixture update of `core_applications`
  (`outcome`, `outcome_at` together, `revision+1`; check `0300_core.sql:87`); precedent `test/payments/kit.ts:531`, `test/intake/corrections.test.ts:77`.
  The real act/readiness/payment path in the Delivery kit is about 60 lines (the proposal says "one helper"; that is an underestimate).
- Faults: `command.before_commit`, `command.lose_ack` are in `kernel/faults.ts:12`, hit at `kernel/command.ts:367` and `:382`. Delivery kit exposes `kit.faults` (`kit.ts:396`);
  Core kit uses `kit.srv.server.faults`. Arm per test: `faults.arm('command.before_commit', {kind:'throw'}, {times:1, match:{command:'core.correct_from_evidence'}})`
  (precedent `test/core/acts.test.ts:56`, `payments/exposure.test.ts:131`); lost ack `{kind:'lose_ack'}` (`acts.test.ts:88`, `core/submission-price.test.ts:58`).
  A `throw` is a `TmError`, rejected at once with no retry (`command.ts:125`).

## 4. N9 (retries exhausted)

Practical. Mechanism: the same owner-session trigger raises SQLSTATE `40001` (`RAISE EXCEPTION ... USING ERRCODE='serialization_failure'`). `classify` reads
it as retry (`command.ts:129`; `kernel/retry.ts:9`). The runner reruns up to `command.maxAttempts` (12 in the Delivery kit, `kit.ts:260`; backoff capped at 20 ms,
`test/support/domain.ts:121`) and returns `conflict_retry_exhausted / serialization_retry_exhausted` (`command.ts:304-306`), `retryable` true. A sequence counter in the
trigger (not rolled back; as `bulk-contention.test.ts:30-53`) proves the attempt count equals `maxAttempts`. Assert zero `dlv_notices` and `dlv.notice_posted` for the
application, outcome and revision unchanged, no `sys_operations` row. Not executed. Do not use a fault `throw` with the exhausted shape: it ends after one attempt and
proves nothing about the runner.

## 5. Tests N1 to N15, race extension, B1 to B3

Home for all of N1 to N9, N12 to N15, B1, B3: new `test/delivery/outcome-correction-notice.test.ts` (real Core + real Delivery; actors `kit.actor(fx.sa1/sa2...)`,
`kit.app(fx.ta1.accountId)`, `kit.run(def, actor, input, key)`, `kit.faults`, `kit.q`, `kit.count`). Common need: the D=0 outcome fixture helper (section 3).
- N1, N2: outcome helper; read `out.operationId`; assert row, params, key, one `dlv.notice_posted`. No blocker.
- N3, N4, N5: key reuse; no blocker (`command.ts:340-344`; `admin.ts:110`).
- N6: two apps of `fx.ta1`, `fx.sa1` and `fx.sa2`, one key. No blocker.
- N7: `Promise.all` of two SuperAdmins on one app; precedent `races-and-boundaries.test.ts:163`. No blocker.
- N8, N13: `kit.faults` as section 3. No blocker.
- N9: section 4. N12: trigger with a non-retryable `ERRCODE` (becomes `internal/unexpected`, `command.ts:141`); resend after dropping the trigger.
- N10, N11: **blocked at this head for the transitive and `refused` parts.** The seed has exactly one relation: `needs_tourist_evisa`, TRANSIT needs TOURIST, outcome
  `issued` (`catalogue/synthetic/catalogue.json:1883-1886`). So D is 0 or 1 (a dependent needs `same_applicant`, same group, one open application per key, `drafts.ts:232`;
  `0300_core.sql:95`). With the seed: A to B (B with an open price increase), Issued to Refused, total 2 = 1 + P: possible. Chain B to C and "dependency requires `refused`"
  need a test-only head declaration through the catalogue commands: copy `publishHead` (`test/core/dependency-not-linked.test.ts:418-447`, file-local; its comment says a
  published head governs every later application of that offering). Put the copy in a file whose database holds no other TRANSIT tests. Core-kit option: `withdrawal-dependencies.test.ts`
  fixtures (`pair`, `link`, `depState`, `:140-158`) with the fake Delivery (`test/core/fakes.ts:115-126`: writes `tst_notices` and a `dlv_notices` row, no `dlv.notice_posted`, no param
  or recipient check).
- N14: refusals at `admin.ts:108-116`. Closed and no-outcome: fixture update. Retrieval: `kit.retrieve` (real evidence). Accepted email: `test/delivery/email-notices.test.ts` machinery or a fixture
  `dlv_email_sends` row. Dependent already failed: `withdrawal-dependencies.test.ts:239` already tests the refusal; add a notice count there.
- N15: `fields` kind, assigned operator needed (`kit.assign`, `kit.ts:444`); assert only the staff notice (`admin.ts:139-143`).
- Race extension: `races-and-boundaries.test.ts`, after `:165` inside the loop (`:138-177`): one `tst_notices` row `generic_case_update` / `params->>'event'='outcome_corrected'` for `upstream`,
  whichever order won. Needs no new helper.
- Dependency extension: `withdrawal-dependencies.test.ts`: after `:235` one correction notice on `upstream` (`from issued to refused`), none on `dependent`; after `:239` still one.
- B1: does not need a restore. Replay runs no handler (`command.ts:340-344`, `replay` `:204`). Fixture: run a correction, delete its notice row with the owner session (unchecked: `tm_app` has no DELETE grant, `0800_delivery.sql:281`, but the owner session is not guarded;
  `0800_delivery.sql:238-240` is UPDATE only), resend the key, expect replay and zero rows. B2 is N1 on a fixture-reset outcome. B3: `src/modules/views` has no `postNotice` or `dlv_notices` reference (grep empty);
  test = `rebuildViews(kit.db.owner, config, PROJECTOR_NAMES, {clock})` (`test/ops-tooling/restore-reopen.test.ts:212`) then compare notice counts (unverified on the Delivery kit). The proposal's home
  `restore-reopen.test.ts` (533 lines, `startOpsKit`) is allowed by §12 but costs more and adds nothing for B1 to B3.
- H only (not surveyed): the §11 Views tests (`case-projections`, `rebuild`), Release tests (`ops-tooling/rollback.test.ts`), and the history-line half of the System test (`system/case-views.test.ts`).

## 6. Ownership

INSIDE (§12 rows for N):
- `src/modules/core/commands/admin.ts` (one call; the header comment `:3-5` is in the same file).
- `test/delivery/kit.ts` (outcome helper; optional `coreDelivery` option; a dependency helper if N10/N11 move there).
- `test/delivery/outcome-correction-notice.test.ts` (new).
- `test/core/races-and-boundaries.test.ts`, `test/core/withdrawal-dependencies.test.ts` (extensions above).
- `test/ops-tooling/restore-reopen.test.ts` (B1 to B3, only if the architect keeps that home).
OUTSIDE (needs a grant or the UI lane): `src/apps/shared/delivery/pages.ts` (`EVENT_TEXT` `:189`), `test/unit/web/delivery-words.test.ts` (UI lane; not built).
Also OUTSIDE because §12 omits them: a new Core-kit test file for N10/N11 (if chosen), `test/core/kit.ts`, `test/core/fakes.ts`, `catalogue/synthetic/catalogue.json`
(do not change the seed), `docs/verification/traceability.md:148` (the T-CO40 row stays true; a new T-row would need a grant).
Not touched: `delivery/notices.ts`, vocabulary, migrations, contracts.

## 7. Existing tests that break

None found. Outcome correction runs only at `withdrawal-dependencies.test.ts:235,239`, `filing-uncertainty-holds.test.ts:257`, `races-and-boundaries.test.ts:163`;
field correction at `acts.test.ts:219`, `filing-uncertainty-holds.test.ts:133-181`, and the route at `system/case-rules.test.ts:384-433` (409 refusals, kind `fields`).
Every `tst_notices` count in `test/core` is filtered by kind or `params->>'kind'` (`withdrawal-dependencies.test.ts:53,121`, `dependency-not-linked.test.ts:566`, `acts.test.ts:277,351`).
`core/derived.ts:260,282` read only `result_available` notices. No `test/views` or `test/system` file reads a correction. "posts no notice" has no match in `src`, `test`, `docs`, `scripts`.

## 8. Hostile states for N, and new risks

- Nth retry: replay runs no handler, 0 new notices (`command.ts:340-344`). Serialization retry: failed attempts roll back; the key uses the attempt that commits (`:324`, `:362`).
  Lost ack: `outcome_unknown`, then replay, 1 total. Exhausted: nothing commits (`:304-306`).
- Failure: one SERIALIZABLE transaction holds outcome, fact, dependents, notice row, `dlv.notice_posted` and the operation record. A `postNotice` refusal (`notices.ts:81-108`) or a fault before commit
  rolls back all of it; recovery is a resend with the same key.
- Concurrency: row lock plus conditional UPDATE (`admin.ts:104,119`) leaves one winner, the loser `stale_revision`. Two actors with one key are two operations (`0001_kernel.sql:226`), two keys.
- New risks (none P0, none P1):
  - P2: the null-operation-id refusal cannot be reached (account actors only; id set at `command.ts:324`). Do not test it; record "not exercised".
  - P2: Core-kit tests use `fakeDelivery`, which checks no params, recipient or kind and writes no fact. A wrong param or recipient passes there and fails only in the Delivery kit.
    Scenario: a typo in `params` passes N10 and fails N1. Keep N1/N2 in the Delivery kit.
  - P2: a trigger left on `dlv_notices` after N9/N12 breaks every later test in the file. Scenario: N7 runs after N9 and is rejected. Drop in `finally`.
  - P2: sequencing. Without the UI lane's `EVENT_TEXT` the travel agent reads "The application was updated." for the new notice. Known (§10 of the proposal), no harm; Max decides release order.
  - P2: the extra notice insert adds rows under SERIALIZABLE; T-CO40 asserts "never retries exhausted" (`:164`) with 12 attempts (`kit.ts:260`). Low likelihood; the existing loop would show it.
