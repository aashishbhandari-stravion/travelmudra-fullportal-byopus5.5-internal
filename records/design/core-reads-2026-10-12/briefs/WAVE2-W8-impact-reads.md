# Brief W8 (wave 2): ITEM-25, offering-change reads (P-19 (3), Kind 1)

Role: Principal Software Engineer (implementation and tests). One item, two reads, one commit per read: first the launch
effect on the TA case read (part A), then the impact-items register (part B).

## Where you work

- Your worktree: `WT=/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/core-reads-2026-10-12/wt/w8-impact` (branch `wave2-impact`, at `f309b23`, `node_modules` installed). You are its only writer. Commit
  there. Never push.
- Start EVERY Bash command with `cd $WT &&` (write the path out). Use absolute paths under `$WT` for every Read, Edit
  and Write. Never touch the lane clone (`.../lanes/core-reads-2026-10-12/repo`) or another worktree. First command:
  `cd $WT && git branch --show-current && git log --oneline -1` (expect `wave2-impact` and `f309b23`; otherwise stop).
- Tests: `export TMPDIR=/tmp/claude-1000/w8; mkdir -p $TMPDIR`, then
  `node --test --test-global-setup=test/support/global-setup.ts <files> 2>&1 | grep -E "^ℹ (tests|pass|fail)|✖|AssertionError|expected|actual" | head -40`.
  ALWAYS filter test output. Do not run `npm run check`.
- Checks per commit: `npx tsc -p tsconfig.json --noEmit`; `npx eslint <changed files>`; the targeted tests; at the end
  also `test/core/*.test.ts`, `test/unit/bff-access-change.test.ts`, `test/unit/frozen-interfaces.test.ts` and
  `test/unit/web/*.test.ts` once (typed page literals of `WireTaCase` live there; if one breaks, make the new field
  optional rather than editing a UI test, and report it).
- Read with `grep -n` and `sed -n 'a,bp'`. Never read a large file in full. The survey lines below are from a read-only
  agent; verify each before you change it.

## Rules

As in `research/briefs/WAVE1-W1-identity.md` § Rules: failing test first, with the evidence files
`research/evidence/ITEM-25-A-fails-first.txt` and `ITEM-25-B-fails-first.txt`; public-fit; commit message with
`Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`; never bypass hooks.

Kind 1 record for each read: a dated comment above the computation in the style of
`src/modules/core/staff-views.ts:185` (intent, source facts, consumers, date) and one line in
`docs/verification/read-model-register.md` (same table format). Contract changes are additive only.

One writer per table (`docs/agent-guide.md:92`): Core MUST NOT read `cat_` tables; it calls the catalogue `api.ts`.

Files you MAY edit:
- Part A (prompt scope, orchestrator confirmation 13 Oct 2026): `src/modules/core/` (NOT the K2-S1 group files
  `commands/groups.ts`, `intake-writers.ts`), `src/contracts/core.ts` (additive), `src/core-api/bindings/core.ts`,
  `test/core/*.test.ts`, `docs/verification/read-model-register.md`.
- Part B (orchestrator grant, 13 Oct 2026): one read function in `src/modules/catalogue/read-models.ts` exposed through
  `src/modules/catalogue/api.ts` (no signature change to an existing catalogue function); one additive SuperAdmin query
  in `src/contracts/catalogue.ts` with the cap stated in its comment; its binding in
  `src/core-api/bindings/catalogue-admin.ts`; one entry in `src/core-api/allowlists.ts`; a Core read by impact item ids
  in `src/modules/core/` (prompt scope); the test with the real kit in `test/system/` or `test/core/`;
  `docs/verification/read-model-register.md`. Conditions: the query is SuperAdmin-scoped in policy, with a test that an
  operator and a TA are refused; the commit body names this grant. If the Core api or the catalogue api type that the
  binding uses needs an adapter line in `src/domain/module-ports.ts`, stop and report.
Nothing else; stop and report if another file must change. No kernel change, no migration, no new reason code. Each
commit body ends, before the Co-Authored-By line, with: `Ownership grant (orchestrator, 13 Oct 2026): <the granted files
this commit changes>.` (or "prompt scope" for part A files under the prompt).

## Part A: the launch-control effect per existing action on the TA case read

Today the TA case read gives the travel agent no launch effect; pages derive TA texts from blockers. Survey: `taCase()`
(`src/core-api/bindings/core.ts` about `:164`), contract `zWireTaCase` (`src/contracts/core.ts` about `:234-284`).
The staff launch page already computes effects per action from launch state with `launchEffect` (`effectsOf`,
`src/core-api/bindings/catalogue-admin.ts:116-133`, actions `EFFECT_ACTIONS`). Core already reaches launch control
through `deps.launch.launchDecision` (`src/modules/core/deps.ts:25`; uses at `src/modules/core/controls.ts:277`, `:313`).

Change: an additive field on `zWireTaCase` (for example `launchEffects: { action, effect, codes }[]`) for the existing-work
actions that apply to this application (its lifecycle), computed through `deps.launch.launchDecision` with the
application's `admitted_launch_id` and lifecycle, exactly as the control evaluator calls it, so the read and the control
agree. Serve only the effect and reason codes (TA-visible; no SuperAdmin treatment detail). A support view reads the same
field (read only). Put the computation in a Core function beside the other TA case derivations; the binding maps it.

Test (`test/core/`, the `suspend` helper in `test/core/launch.test.ts` about `:30`): a launched offering → `allow` for
each action; a suspension with a hold treatment → the hold effect and code for the held actions; the same answer as
`evaluateControls` gives for that action's launch stage. Failing first: the field is absent.

## Part B: the current impact items of an offering across assessments (SuperAdmin)

Today items are reached per assessment only (`loadAssessment`, `src/modules/catalogue/read-models.ts` about `:214`).
Source facts: `cat_impact_items` (`is_current`, one per application), `cat_impact_assessments`, Core `core_transitions`
(by `impact_item_id`), the applicant snapshot, the travel agent account.

Change: a catalogue read of the offering's current items across assessments (item id,
application id, assessment number, treatment, decision facts) through the catalogue `api.ts`; a Core read of the
transition state by impact item ids and the applicant names (owned); the travel agent's name through the identity api,
as the existing catalogue-admin bindings do; one additive SuperAdmin query and its binding; one allowlist entry. Bound
the rows (500, with `truncated`), state the order.

Test (`test/system/` or `test/core/` with the real kit): two assessments of one offering with items in different
treatments and one approved transition → the read lists the current items with the transition state; a TA and an
operator are refused. Failing first: the query is absent.

## Return (at most about 300 words)

Commits (id, subject); the tests that failed first (names, evidence files); check results; every deviation and why;
open points. Context: under 100k per turn. If your context passes about 250k, commit what is green and return before
275k with what remains.
