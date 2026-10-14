# Brief W5 (wave 2): payments items ITEM-08 and ITEM-09

Role: Principal Software Engineer (implementation and tests). Two bounded items, one commit each: ITEM-08, then ITEM-09.

## Where you work

- Your worktree: `WT=/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/core-reads-2026-10-12/wt/w5-payments`
  (branch `wave2-payments`, at `7ad52b2`, `node_modules` installed). You are its only writer. Commit there. Never push.
- Start EVERY Bash command with `cd $WT &&` (write the path out). Use absolute paths under `$WT` for every Read, Edit
  and Write. Never touch the lane clone (`.../lanes/core-reads-2026-10-12/repo`) or another worktree. First command:
  `cd $WT && git branch --show-current && git log --oneline -1` (expect `wave2-payments` and `7ad52b2`; otherwise stop).
- Tests: `export TMPDIR=/tmp/claude-1000/w5; mkdir -p $TMPDIR`, then
  `node --test --test-global-setup=test/support/global-setup.ts <files> 2>&1 | grep -E "^ℹ (tests|pass|fail)|✖|AssertionError|expected|actual" | head -40`.
  ALWAYS filter test output. Do not run `npm run check`.
- Checks per item: `npx tsc -p tsconfig.json --noEmit`; `npx eslint <changed files>`; the targeted tests; at the end also
  `test/payments/*.test.ts` and `test/core/*.test.ts` once.
- Read with `grep -n` and `sed -n 'a,bp'`. Never read a large file in full. The survey below is verified.

## Rules

As in `research/briefs/WAVE1-W1-identity.md` § Rules: failing test first, with the evidence file
`research/evidence/ITEM-nn-fails-first.txt`; public-fit; commit message with
`Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`; never bypass hooks.

Files you MAY edit (orchestrator grant, 13 Oct 2026):
- ITEM-08: `src/modules/payments/commands/service-status.ts` and `test/payments/*.test.ts`.
- ITEM-09: `src/modules/payments/queries.ts`, `src/modules/core/` (the new read only), `test/payments/*.test.ts`,
  `test/core/*.test.ts`. ONLY IF the failing test confirms the defect: `src/modules/payments/ports.ts` (one additive read
  method on `PaymentsCorePort`) and its adapter line in `src/domain/module-ports.ts`.

Nothing else; stop and report if another file must change. The kernel (`src/kernel/**`, including `ControlRequest` in
`src/kernel/vocabulary/shared.ts`) is off limits. Each commit body ends, before the Co-Authored-By line, with:
`Ownership grant (orchestrator, 13 Oct 2026): <the granted files this commit changes>.`

## ITEM-08 (defect): a payment correction that changes only the event date is accepted

Survey: `src/modules/payments/commands/service-status.ts:108`:
`if (current.status === input.status && current.amount_paise === amount && sameEvidence(...)) throw … correction_no_change`.
It never compares `eventAt` (`current.event_at`, a nullable Date). The insert (about `:122`) stores `input.eventAt ?? null`.

Change: add `(current.event_at?.getTime() ?? null) === (input.eventAt?.getTime() ?? null)` to that condition. Decision
(architect, confirmed by the orchestrator): an omitted `eventAt` compares as null, the value the insert stores, so a
correction that only clears the date is a change. Keep everything else: a date-only correction raises
`status_revision` as any correction does, and with work authorized it opens `payment_corrected_after_work` (about `:140`).
State both in the test or the commit body.

Test (`test/payments/service-entries.test.ts`, "enforces the entry-kind rules" about `:91`; helpers `record()`, `ok()`,
`refusal()`): record with `eventAt` A; a correction identical except `eventAt` B, with a reason, is accepted and stores B
(today `validation_failed/correction_no_change`); a correction with the same A is still refused; a correction that omits
the date of an entry that has one is accepted and stores null.

## ITEM-09 (suspected defect): Gate 2 on the payments page for a SuperAdmin

Survey (static reading): in `applicationPayments`, `view('authorize_government_submission', …)`
(`src/modules/payments/queries.ts:90-103`) calls `deps.core.evaluateControls` with the SuperAdmin as the actor.
`policyActionFor` (`src/modules/core/controls.ts:121-135`) maps the action to `operator.authorize_external_act`, whose
rule (`src/modules/identity/policy.ts:214`, `OPERATOR_ASG`) has no superadmin entry. `checkRelation`
(`controls.ts:215-226`) throws `not_found_or_forbidden`, and the catch (`queries.ts:98`) returns `'unknown'`. So Gate 2 is
always `unknown` for a SuperAdmin on TravelMudra-filed work. Gate 1 uses `assign`, which the SuperAdmin holds.

Step 1 (failing test first, new file `test/payments/gate2-superadmin.test.ts`): on a default (TravelMudra-filed)
application, `kit.read((tx) => kit.payments.api.pages.applicationPayments(tx, sa1, app))` with
`sa1 = (await kit.session(fx.sa1.accountId, 'superadmin')).actor` gives `gate2 !== 'unknown'` (find the payments kit
helpers in `test/payments/`). If it PASSES, stop: the item closes as not a defect, the test stays as coverage, commit the
test alone, and report.

Step 2 (only if it fails): a separate Core read for the gate states.
- In `src/modules/core/`: a read (for example `gateView(tx, actor, applicationId)`) that runs the same control stages as
  `evaluateControls` for the gate basis, except that stage 1 checks the actor's `application.read` relation through the
  single policy, not the act's relation. It returns only the gate view the payments page needs. It authorizes nothing.
  Reuse the evaluator's stages; do not copy them. `evaluateControls`, `ControlRequest` and every command path stay
  unchanged. The authorize rule NEVER gains `superadmin`.
- `PaymentsCorePort` (`src/modules/payments/ports.ts:17`) gains that one method; the adapter line goes beside the existing
  payments adapter in `src/domain/module-ports.ts` (about `:140`). `queries.ts` uses it for Gate 2 (and MAY use it for
  Gate 1 if that keeps one path; say which).
- Tests: the SuperAdmin page shows the real Gate 2 state (`blocked` before the commitment payment, `passed` or `excepted`
  after, as the fixtures allow); the assigned operator's page is unchanged; a SuperAdmin's
  `authorize_government_submission` command is still refused (grant condition); an actor without a read relation gets
  `not_found_or_forbidden` from the new read, not a gate state.

## Return (at most about 300 words)

Commits (id, subject); the tests that failed first (names, evidence files); check results; every deviation and why;
open points. Context: under 100k per turn. If your context passes about 250k, commit what is green and return before
275k with what remains.
