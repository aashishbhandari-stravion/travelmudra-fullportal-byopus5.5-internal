# Brief W6 (wave 2): launch and catalogue items ITEM-07 and ITEM-14

Role: Principal Software Engineer (implementation and tests). Two items: ITEM-14 (one commit), then ITEM-07 (one commit
per finding: (1), then (2)).

## Where you work

- Your worktree: `WT=/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/core-reads-2026-10-12/wt/w6-launch`
  (branch `wave2-launch`, at `7ad52b2`, `node_modules` installed). You are its only writer. Commit there. Never push.
- Start EVERY Bash command with `cd $WT &&` (write the path out). Use absolute paths under `$WT` for every Read, Edit
  and Write. Never touch the lane clone (`.../lanes/core-reads-2026-10-12/repo`) or another worktree. First command:
  `cd $WT && git branch --show-current && git log --oneline -1` (expect `wave2-launch` and `7ad52b2`; otherwise stop).
- Tests: `export TMPDIR=/tmp/claude-1000/w6; mkdir -p $TMPDIR`, then
  `node --test --test-global-setup=test/support/global-setup.ts <files> 2>&1 | grep -E "^ℹ (tests|pass|fail)|✖|AssertionError|expected|actual" | head -40`.
  ALWAYS filter test output. Do not run `npm run check`.
- Checks per commit: `npx tsc -p tsconfig.json --noEmit`; `npx eslint <changed files>`; the targeted tests; at the end
  also `test/integration/catalogue-*.test.ts`, `test/integration/launch-control.test.ts` and
  `test/system/new-service.test.ts` once.
- Read with `grep -n` and `sed -n 'a,bp'`. Never read a large file in full. The survey below is verified.

## Rules

As in `research/briefs/WAVE1-W1-identity.md` § Rules: failing test first, with the evidence file
`research/evidence/ITEM-nn-fails-first.txt` (ITEM-07: `ITEM-07-1-fails-first.txt`, `ITEM-07-2-fails-first.txt`);
public-fit; commit message with `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`; never bypass hooks.

Files you MAY edit (prompt scope and orchestrator grant, 13 Oct 2026):
- ITEM-14: `src/modules/catalogue/domain.ts`, `src/modules/catalogue/commands/baselines.ts`,
  `src/modules/catalogue/commands/declarations.ts` (only if it must follow the shared function), and
  `test/integration/catalogue-commands.test.ts`. Grant condition: the fingerprint over open applications is ONE
  aggregate query, never per-application loads; state its cost (one query, rows read) in the commit body.
- ITEM-07 (1): `src/modules/operations/commands/launch.ts`, `src/modules/operations/launch/deps.ts`,
  `src/contracts/catalogue.ts` (additive `offeringRevision` on `ops.launch_offering` only),
  `src/core-api/bindings/catalogue-admin.ts`, `test/integration/launch-control.test.ts`.
- ITEM-07 (2): `src/modules/operations/launch/read-model.ts`, `src/core-api/bindings/catalogue-admin.ts`, and a test in
  `test/system/`.

Nothing else; stop and report if another file must change (in particular `src/domain/module-ports.ts`,
`src/modules/operations/commands/seed.ts`, any UI file, the kernel). Each commit body ends, before the Co-Authored-By
line, with: `Ownership grant (orchestrator, 13 Oct 2026): <the granted files this commit changes>.`

## ITEM-14 (defect): the values-publication staleness check sees changes to existing work

Observed: a values publication from a preview made before a new TA draft was accepted records 1 affected draft while 2
existed. Survey: `scopeFingerprint` (`src/modules/catalogue/domain.ts:283-288`) keeps only `lifecycle === 'submitted'`
and hashes id, price and payment. Drafts, act and filing state, class inputs and travel dates are never compared, so a
draft accepted after the preview leaves the fingerprint unchanged. `publishBaseline` compares `values_sha256`,
`offering_revision`, `declaration_id` and the fingerprint (`src/modules/catalogue/commands/baselines.ts:151-161`) and
records `affected_scope` from `preview.affected_count` (about `:190`). `declarations.ts:337` uses the same function.

Change: the fingerprint covers every open application of the offering (every lifecycle that the impact preview counts;
read the preview's own selection and use the same set), over id, lifecycle, class inputs (act states, filed evidence),
price, payment and travel dates, read in ONE aggregate query. One function serves both publication paths. A preview
made before the deploy answers `preview_stale` once; that is accepted.

Test (`test/integration/catalogue-commands.test.ts` about `:160-181`, baseline preview then publish, `h.insertApp`):
preview; insert a second draft; publish → `preview_stale` (today it publishes and records 1 affected). Also: a change to
an existing application's travel dates or act state after the preview → `preview_stale`; no change → publishes.

## ITEM-07 (1) (defect): launch and scope expansion check the reviewed offering revision

Scenario: SuperAdmin 1 reviews the launch of offering O at head D1. SuperAdmin 2 publishes head D2 (offering revision
increments). SuperAdmin 1 confirms and launches D2 unreviewed, because approve and expand compare only the controls
revision: `src/modules/operations/commands/launch.ts:180` and `:259`
`sameRevision(input.expectedControlsRevision, controls.revision)`; `requireLaunchableHead`
(`src/modules/operations/launch/readiness.ts` about `:78`) takes the current head.

Change:
- `LaunchOffering` (`src/modules/operations/launch/deps.ts:15`) gains `readonly revision: bigint`. The catalogue api
  implements `LaunchCatalogue` directly and its offering summary already carries the revision; confirm that no adapter
  line must change (if one must, stop and report).
- `ApproveInput` and `zApprove` (`launch.ts` about `:176`, `:238`) gain `expectedOfferingRevision`, OPTIONAL (contract
  changes are additive only, and the current launch form does not post it yet; `src/modules/operations/commands/seed.ts:73`
  stays unchanged). When present, `approveLaunch` and the expand handler (about `:258`) compare it with the offering read
  under `lockOffering` (`:75`) and refuse `stale_revision` (existing). When absent, today's behaviour stays. Report the
  UI item: the launch and expansion forms post `_rev.offering`; the guard is complete only then.
- `ops.launch_offering` (`src/contracts/catalogue.ts` about `:288`; binding `src/core-api/bindings/catalogue-admin.ts`
  about `:143-148`) serves `offeringRevision` (additive). The approve and expand bindings (about `:305`, `:309`) bind
  `_rev.offering` when the form carries it, next to `_rev.controls`; a form without it still parses.

Test (`test/integration/launch-control.test.ts`; `approveInput` helper about `:47`; `offeringRevision` from
`test/support/catalogue.ts:509`): publish a head after the review, then approve with the earlier offering revision →
`stale_revision` (today it launches); the same for scope expansion; the current revision → launches; no revision →
launches as today.

## ITEM-07 (2) (defect): a replayed launch-plan form yields the identical command input after a head change

Scenario: a SuperAdmin saves a launch plan; the acknowledgement is lost; the head changes its required measures; the
identical form is replayed with the same operation key. `src/core-api/server.ts:417` runs `binding.toInput` before the
operation lookup; `ops.record_launch_plan` (`catalogue-admin.ts:300-303`) builds the input with
`planFromForm(f, { measures: m.requirements … })` from the CURRENT head's codes, so the input differs and the kernel
refuses `conflict_operation_key` (`src/kernel/command.ts:343`) instead of returning the accepted result.

Change: `planFromForm` (`src/modules/operations/launch/read-model.ts:63`) derives the measure and monitor codes from
the posted field names (`m.<code>.*`, `mon.<code>.*`), not from the current head; `planMissing` still flags the head's
missing codes on a first call. The replay must give the identical input as the first call.

Test (`test/system/`, pattern `test/system/new-service.test.ts:128`, `cl.submit`): save a plan, change the head's
required measures, replay the identical form with the same key → the accepted result with `replayed: true` (today
`conflict_operation_key`); a different form with the same key → `conflict_operation_key`.

## Return (at most about 300 words)

Commits (id, subject); the tests that failed first (names, evidence files); check results; every deviation and why;
open points (including the UI item: the launch form posts `_rev.offering`). Context: under 100k per turn. If your
context passes about 250k, commit what is green and return before 275k with what remains.
