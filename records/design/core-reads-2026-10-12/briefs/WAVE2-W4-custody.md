# Brief W4 (wave 2): custody items ITEM-15 and ITEM-24

Role: Principal Software Engineer (implementation and tests). Two bounded items, one commit each: ITEM-15, then ITEM-24.

## Where you work

- Your worktree: `WT=/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/core-reads-2026-10-12/wt/w4-custody`
  (branch `wave2-custody`, at `7ad52b2`, `node_modules` installed). You are its only writer. Commit there. Never push.
- Start EVERY Bash command with `cd $WT &&` (write the path out). Use absolute paths under `$WT` for every Read, Edit
  and Write. Never touch the lane clone (`.../lanes/core-reads-2026-10-12/repo`) or another worktree. First command:
  `cd $WT && git branch --show-current && git log --oneline -1` (expect `wave2-custody` and `7ad52b2`; otherwise stop).
- Tests: `export TMPDIR=/tmp/claude-1000/w4; mkdir -p $TMPDIR`, then
  `node --test --test-global-setup=test/support/global-setup.ts <files> 2>&1 | grep -E "^ℹ (tests|pass|fail)|✖|AssertionError|expected|actual" | head -40`.
  ALWAYS filter test output. Do not run `npm run check`.
- Checks per item: `npx tsc -p tsconfig.json --noEmit`; `npx eslint <changed files>`; the targeted tests; at the end also
  `test/operations/*.test.ts` once, `test/unit/frozen-interfaces.test.ts` and `test/unit/bff-access-change.test.ts`.
- Read with `grep -n` and `sed -n 'a,bp'`. Never read a large file in full. The survey below is verified.

## Rules

As in `research/briefs/WAVE1-W1-identity.md` § Rules: failing test first, with the evidence file
`research/evidence/ITEM-nn-fails-first.txt`; public-fit; commit message with
`Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`; never bypass hooks.

Files you MAY edit (orchestrator grant, 13 Oct 2026):
- ITEM-15: `src/modules/operations/case-work/commands/originals.ts` (`recordReceipt` and `linkOriginal` only) and
  `test/operations/original-link-identity.test.ts`. Grant conditions: the count is read under the `'update'` lock inside
  the same transaction; existing data over 50 stays; the refusal is `control_blocked/limit_exceeded`.
- ITEM-24: `src/contracts/operations-work.ts`, `src/core-api/bindings/operations-work.ts`, `src/core-api/allowlists.ts`
  (one entry), `src/modules/operations/case-work/store.ts` and `facade.ts` (the read only), the new file
  `test/operations/originals-register.test.ts`, `docs/verification/read-model-register.md` (one line). Grant conditions:
  the read never returns `item_key` and a test asserts it; cap 500 rows with a `truncated` flag; visibility through
  `policy.scope(actor, 'application.read')`; additive contract change only.

Nothing else; stop and report if another file must change. Each commit body ends, before the Co-Authored-By line, with: `Ownership grant (orchestrator, 13 Oct 2026): <the granted files this commit changes>.`

## ITEM-15 (defect): refuse the 51st original of an application and the 51st link of an original

Survey: nothing caps originals per application or links per original. `zWireCaseWork` encodes at most 50 of each
(`src/contracts/operations-work.ts:204-206`, `originals.max(50)`, `linkedApplicationIds.max(50)`), so from the 51st,
every work read of a sharing application fails. The only link inserts are `recordReceipt.handle`
(`src/modules/operations/case-work/commands/originals.ts` about `:139`) and `linkOriginal.handle` (about `:185`).

Change (originals.ts only):
- `recordReceipt.handle`: after the duplicate check (about `:136`), refuse when
  `(await originalsOfApplication(tx, input.applicationId)).length >= 50`.
- `linkOriginal.handle`: after the passport identity check (about `:184`), refuse when the original already has 50 links
  (`linked`, loaded about `:171`) or the target application already holds 50 originals.
- Refusal: `throw new TmError('control_blocked', 'limit_exceeded')` (existing code, `src/kernel/vocabulary/reasons.ts:89`).
  Name the cap as one constant (50) beside the commands, with a comment that it equals the work read's bound.
- Concurrency: the share locks the target application `'share'` (about `:164`), so two parallel shares into one target
  can both pass the count. Lock it `'update'`, as the receipt does. The original's row lock (about `:166`) already
  serializes the per-original count. Check that no new lock-order inversion appears (receipt and share paths).
- A refusal writes nothing, so a retry evaluates the current count again. Existing data over 50 stays as it is (no
  migration).

Test (`test/operations/original-link-identity.test.ts`; helpers `assigned` about `:28`, `otherItemOf` (SQL seed) about
`:41`, `refusedShare` about `:73`, which returns `[category, code]` and checks that no operation record exists):
- 50 originals seeded by SQL on one application: the 51st `recordReceipt` and a share into that application are refused
  `control_blocked/limit_exceeded`; the counts are unchanged; no operation record.
- An original linked to 50 applications (seeded by SQL): a share to a 51st application is refused.
- At exactly 50, `encodeWire` of the `ops.case_work` view still succeeds.
- Today the receipt and the shares succeed (failing first).

## ITEM-24 (Kind 1): the originals register read for operators

Source: an operator must find which of the held originals (for example 120 passports) were in a lost courier parcel;
today originals are reachable only per application (`originalViews`, `src/modules/operations/case-work/facade.ts:50`,
through `ops.case_work`, `src/core-api/bindings/operations-work.ts:122`).

Change:
- A new query `ops.originals` in `OPERATIONS_WORK_QUERIES` (`src/contracts/operations-work.ts` about `:241`), modelled
  on `ops.incidents`; a binding in `operationsWorkQueryBindings` (`src/core-api/bindings/operations-work.ts` about `:227`)
  served the way `ops.incidents` is (same surfaces and action); one allowlist entry (`src/core-api/allowlists.ts` about
  `:101`).
- SQL: `ops_originals` joined to `ops_original_links` and `core_applications a`, limited by
  `policy.scope(actor, 'application.read', 'a')` (the assigned operator, a group-read grantee, the SuperAdmin). Put the
  reader beside `originalsOfApplication` in `src/modules/operations/case-work/store.ts` (about `:206`) and expose it
  through the facade.
- Row fields: originalId, itemType, description, state, holderKind, location, parts, and for each linked application
  its id and applicant name (snapshot join as in `src/modules/core/lists.ts:117`, or the existing helper the case read
  uses). NEVER return `item_key`: it holds the passport number. Order: the most recent custody change first. Cap 500
  rows with a `truncated` flag; state both in the contract comment.
- Kind 1 record: a dated comment above the computation in the style of `src/modules/core/staff-views.ts:185` (intent,
  source facts, consumers, date) and one line in `docs/verification/read-model-register.md` (same table format).

Test (new file `test/operations/originals-register.test.ts`; `startOpsKit`, `kit.caseWork`, and a wire call through
`operationsWorkQueryBindings(() => kit.caseWork)` with a staff `CallContext`, pattern
`test/operations/protection-mark-legacy.test.ts:354-360`): the assigned operator sees the originals of their
applications with the linked applicants; another operator sees none of them; the SuperAdmin sees all; no row carries the
passport number; the wire view encodes. Failing first: the query name is absent from the registry today.

## Return (at most about 300 words)

Commits (id, subject); the tests that failed first (names, evidence files); check results; every deviation and why;
open points. Context: under 100k per turn. If your context passes about 250k, commit what is green and return before
275k with what remains.
