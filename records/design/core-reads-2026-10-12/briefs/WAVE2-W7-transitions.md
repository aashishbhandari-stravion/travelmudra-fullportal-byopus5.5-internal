# Brief W7 (wave 2): ITEM-10, offering-change transitions (P-19 (4) a to d)

Role: Principal Software Engineer (implementation and tests). One item with four sub-defects, three commits in this
order: (d), then (b), then (a) with (c).

## Where you work

- Your worktree: `WT=/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/core-reads-2026-10-12/wt/w7-transitions` (branch `wave2-transitions`, at `7eb943a`, `node_modules` installed). You are its only writer. Commit
  there. Never push.
- Start EVERY Bash command with `cd $WT &&` (write the path out). Use absolute paths under `$WT` for every Read, Edit
  and Write. Never touch the lane clone (`.../lanes/core-reads-2026-10-12/repo`) or another worktree. First command:
  `cd $WT && git branch --show-current && git log --oneline -1` (expect `wave2-transitions` and `7eb943a`; otherwise stop).
- Tests: `export TMPDIR=/tmp/claude-1000/w7; mkdir -p $TMPDIR`, then
  `node --test --test-global-setup=test/support/global-setup.ts <files> 2>&1 | grep -E "^ℹ (tests|pass|fail)|✖|AssertionError|expected|actual" | head -40`.
  ALWAYS filter test output. Do not run `npm run check`.
- Checks per commit: `npx tsc -p tsconfig.json --noEmit`; `npx eslint <changed files>`; the targeted tests; at the end
  also `test/core/*.test.ts`, `test/integration/catalogue-*.test.ts` and `test/unit/frozen-interfaces.test.ts` once.
- Read with `grep -n` and `sed -n 'a,bp'`. Never read a large file in full. The survey below is from a read-only agent;
  verify each line before you change it.

## Rules

As in `research/briefs/WAVE1-W1-identity.md` § Rules: failing test first, with the evidence files
`research/evidence/ITEM-10-d-fails-first.txt`, `ITEM-10-b-fails-first.txt`, `ITEM-10-ac-fails-first.txt`; public-fit;
commit message with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`; never bypass hooks.

Files you MAY edit (prompt scope and orchestrator grant, 13 Oct 2026):
- `src/modules/core/` (prompt scope; NOT the K2-S1 group files `src/modules/core/commands/groups.ts` and
  `src/modules/core/intake-writers.ts`), `test/core/*.test.ts`.
- For (a) and (c) only: `src/modules/catalogue/api.ts` (ONE additive write port; no signature change to an existing
  function), `src/modules/catalogue/impact.ts`, `src/modules/catalogue/commands/impact.ts`, the adapter line in
  `src/domain/module-ports.ts`, and the integration tests `test/integration/catalogue-*.test.ts` only if a catalogue
  test must follow.
Nothing else; stop and report if another file must change. No kernel change, no migration, no new reason code. Each
commit body ends, before the Co-Authored-By line, with: `Ownership grant (orchestrator, 13 Oct 2026): <the granted files
this commit changes>.` (prompt scope for files under `src/modules/core/`). The commit of (a) names the new catalogue port
in its body (the frozen-interface record).

NOT in scope (do not build; the orchestrator logged it for Max): the apply path (`src/modules/core/commands/admin.ts`
about `:174-178`) never rechecks that the target is still supported.

## (d) The pending answer respects the launch holds of existing work

Survey: `pendingOnAction` (`src/modules/core/derived.ts` about `:331`) never consults `deps.launch.launchDecision`, so an
application whose existing work is held (suspension or withdrawal treatment) is reported as the operator's next step.
Change: a rule before the operator-work rules (about rules 15 to 25) that maps a launch hold to the existing reason codes
`existing_work_hold`, `withdrawal_continuation_not_permitted` or `existing_work_treatment_missing`, next action
`record_existing_work_treatment` (existing), owner `superadmin`, `sinceSeq` from the fact that started the hold. Match
the control evaluator's own launch stage (find where it calls `launchDecision` in `src/modules/core/controls.ts`) so the
pending answer and the control agree, as the existing rules do.
Test (`test/core/launch.test.ts`, the `suspend` helper about `:30`; pending pattern
`test/core/assignment-holds.test.ts:45`, `kit.core.api.pendingOnAction`): a held application → owner superadmin, the
hold's code, `record_existing_work_treatment`; after the treatment is recorded → the operator rule again.

## (b) Approving again after a decline is refused

Survey: `openStructuralTransition` (`src/modules/core/catalogue-writers.ts` about `:123-124`) returns the existing
transition by `impact_item_id` without checking its state; `core_transitions_impact_item_key` is UNIQUE, so a second
approve after a decline "succeeds" and opens nothing. Change: refuse `control_blocked/impact_decision_not_allowed`
(existing) when the existing row is `declined`. Keep the idempotent return for an existing open transition (a retry).
Keep `decideItems` open after a decline (the SuperAdmin can still hold or continue).
Test (`test/core/`): approve, decline, approve again → refused with that code; nothing written; an approve retried while
the transition is open still returns the same transition.

## (a) A declined transition is counted and owned; (c) the transition targets the reviewed head

Survey (a): `core.decide_transition` decline (`src/modules/core/commands/admin.ts` about `:168-172`) sets the transition
to `declined` but leaves the `cat_impact_items` row at `treatment = 'transition'`. The assessment counts read only
`unknown`, `pending` and `hold` (`src/modules/catalogue/impact.ts` about `:125`, `src/modules/catalogue/read-models.ts`
about `:86`, `:203`), so the item is uncounted and has no owner. Change: on decline, Core calls ONE new catalogue write
port that returns the item to `pending` (the SuperAdmin queue owns it) and refreshes the assessment state; facts
`core.structural_transition_declined` and `cat.impact_item_decided` (existing). Precedent for a Core-to-catalogue write
port: `noteGoverningBehindHead` (`src/modules/catalogue/api.ts:74`, `:104`; adapter in `src/domain/module-ports.ts`;
Core caller `src/modules/core/intake-writers.ts:131`, which you must NOT edit). Add the port to the Core deps type in
`src/modules/core/deps.ts`.
Survey (c): `approveTransition` (`src/modules/catalogue/commands/impact.ts` about `:228`) takes `headOf(offering)` at
command time; the assessment is loaded at about `:236`. Change: target the assessment's reviewed head (its `after_*`
head). If the offering head moved past the assessment, refuse with an existing code (`stale_revision` or the impact code
the module already uses for a superseded assessment; say which).
Tests: (a) in `test/core/` with the real kit (the integration harness uses a Core fake, `test/support/catalogue.ts:243`):
decline → the item is `pending`, counted, and owned by the SuperAdmin queue; the assessment state refreshes. (c): a head
published after the assessment → approve targets the reviewed head or refuses, as you implement.

## Return (at most about 300 words)

Commits (id, subject); the tests that failed first (names, evidence files); check results; every deviation and why;
open points. Context: under 100k per turn. If your context passes about 250k, commit what is green and return before
275k with what remains.
