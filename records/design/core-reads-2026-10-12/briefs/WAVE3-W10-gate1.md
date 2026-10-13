# Brief W10 (wave 3): ITEM-19 Gate 1 context, then ITEM-20 the first-work Gate 1 queue

Role: Principal Software Engineer (implementation and tests). Two items, two commits in this order: ITEM-19, then
ITEM-20 (it reuses the ITEM-19 helper).

## Where you work

- Your worktree: `WT=/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/core-reads-2026-10-12/wt/w10-gate1`
  (branch `wave3-gate1`, at `e0b978d`, `node_modules` installed). You are its only writer. Commit there. Never push.
- Start EVERY Bash command with `cd $WT &&` (write the path out). Use absolute paths under `$WT` for every Read, Edit
  and Write. Never touch the lane clone (`.../lanes/core-reads-2026-10-12/repo`) or another worktree. First command:
  `cd $WT && git branch --show-current && git log --oneline -1` (expect `wave3-gate1` and `e0b978d`; otherwise stop).
- Tests: `export TMPDIR=/tmp/claude-1000/w10; mkdir -p $TMPDIR`, then
  `node --test --test-global-setup=test/support/global-setup.ts <files> 2>&1 | grep -E "^ℹ (tests|pass|fail)|✖|AssertionError|expected|actual" | head -40`.
  ALWAYS filter test output. Do not run `npm run check` (the architect runs it per commit).
- Checks per commit: `npx tsc -p tsconfig.json --noEmit`; `npx eslint <changed files>`; the targeted tests; before each
  commit also `test/core/*.test.ts`, `test/system/core-pages.test.ts` and `test/unit/*.test.ts` once.
- Read with `grep -n` and `sed -n 'a,bp'`. Never read a large file in full. The survey is from a read-only agent; verify
  each line before you rely on it: `/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/core-reads-2026-10-12/research/briefs/WAVE3-survey-D-result.md`
  (sections "Cross-cutting", ITEM-19, ITEM-20).
- Sources (read only the named sections), folder
  `/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/ui-revamp-2026-10-12/output/proposals/`:
  `P-10-wp06-core-requests.md` item (e); `P-12-assistance-first-work-exception-route.md` §11 (option C as narrowed, and
  the §11.4 amendment); review `.../lanes/ui-revamp-2026-10-12/research/reviews/P-11-12-review.md`, the parts on option C.
  The register row for ITEM-20 (binding): "a SuperAdmin queue `first_work_gate1` derived from recorded facts (display
  only; shares the helper of (e))". The P-12 §11.1 pending-answer substitution in `derived.ts` is NOT in the row: do not
  build it.

## Rules

- Failing test first. Run it before the change and save the filtered output to
  `/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/core-reads-2026-10-12/research/evidence/ITEM-19-fails-first.txt`
  and `ITEM-20-fails-first.txt` (first line: `# <test names> before the change, <date>`).
- Files you MAY edit (prompt scope): `src/modules/core/` (NOT `src/modules/core/commands/groups.ts`, NOT
  `src/modules/core/intake-writers.ts`), `src/contracts/core.ts` (additive only), `src/core-api/bindings/core.ts`,
  `test/core/*.test.ts`, `test/system/core-pages.test.ts`, and one line per item in
  `docs/verification/read-model-register.md` (Kind 1 record; orchestrator grant, 13 Oct 2026). Nothing else; stop and
  report if another file must change. No kernel change, no migration, no new reason code.
- The lane rule for these reads (binding): return RECORDED facts, never a computed verdict such as `passed`, `allowed`
  or `blocked`. The control evaluator answers basis `passed` whenever a first-work Gate 1 basis is recorded, even when
  that basis was an exception (`controls.ts` about `:693`): do not reuse that answer.
- Do NOT change the three Gate 1 decision sites (`controls.ts` gate stage about `:689-698`,
  `commands/assignment.ts` `requireGate1AtWork` about `:375-397`, `commands/gates.ts` eligibility about `:33-39`). The
  helper only reads. A test compares the helper's facts with what `evaluateControls` decides in the same states.
- Public-fit: no internal identifier (`OD-…`, `K2-…`, `P-nn`, `ITEM-…`, `WP-…`, `R-nn`, "seam") in code, comments, test
  names or commit messages. Commit message: imperative subject under 72 characters; a body that says the gap, the change
  and the tests; before the last line: `Ownership grant (orchestrator, 13 Oct 2026): prompt scope (<files>).` (add
  `docs/verification/read-model-register.md (Kind 1 record)` when you change it); last line
  `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Never bypass hooks (`--no-verify` is forbidden).
- Match the surrounding code style and comment density.

## ITEM-19: Gate 1 context for first operator work and for a new assignment

Gap: the SuperAdmin cannot see why Gate 1 holds an operator's first work. `core.admin_case` serves the service payment
status and the gate exceptions only; nothing says which basis is recorded for first work, whether work started, or why
an exception cannot be used (expired, used, grantor no longer active).

Change (architect decision, inside the prompt scope):
- One read helper in Core (for example `gate1Facts(deps, tx, app, action)` beside the gate stage in `controls.ts`) for
  the two Gate 1 keys the evaluator uses: `assign` (a new assignment and a reassignment; verify that `reassign` uses the
  same key) and `start_operator_work`. It returns recorded facts only: the service payment status with its entry id and
  status revision (payments port); the active assignment id; the recorded first-work basis (kind, exception id, recorded
  time) or null; whether work started (operations port); the exception granted for that key, if any, with its id,
  state, expiry and the freshness failure code that the existing freshness check gives (null when usable); and the read
  time `asOf`. All reads bounded (one assignment, at most one exception per key).
- Serve it as a nullable field on the SuperAdmin's staff case (`core.admin_case`), next to `assignOffer`, SuperAdmin
  only, as `assignOffer` is. Null when the application is not open. Additive contract change.
- If the grant eligibility rule in `commands/gates.ts` is a function the read can call without copying it, you MAY add
  the codes it gives now (as `assignOffer` gives its refusal codes); otherwise leave it out and say so in the return.
Tests (`test/core/assignment-holds.test.ts`, the unpaid-assistance fixture about `:84-113`; `kit.clock` for expiry):
unpaid and assigned → no basis, payment not received, no exception; an exception granted → its id and no failure code;
the exception expired → the failure code; paid → the payment entry; after the first work → the recorded basis and work
started. In each state, `evaluateControls` for `start_operator_work` agrees with the facts (blocked exactly when no
payment, no usable exception and no recorded basis). The staff case encodes through the contract; a travel agent's and an
operator's case reads do not carry the field.

## ITEM-20: the SuperAdmin queue `first_work_gate1` (display only)

Gap: the SuperAdmin has no list of assigned work whose first operator work Gate 1 holds.

Change:
- A new kind `first_work_gate1` for `core.admin_queue` (`src/contracts/core.ts` about `:434`; binding about
  `bindings/core.ts:415`; `queueOf` in `src/modules/core/lists.ts` about `:103`). Verify how `queueOf` selects its branch
  (the survey says any other kind falls into the deferrals branch); make the kinds explicit.
- Candidates from Core's own tables only: open applications (draft or submitted, no outcome) with an active assignment
  and no recorded first-work Gate 1 basis, oldest assignment first, at most 200 (read 201). For each candidate, the
  ITEM-19 helper: a row when there is no payment received and no usable exception for first work. Each row carries the
  facts (payment status, exception id and failure code), not a verdict word; describe it as "no recorded Gate 1 basis
  for first work".
- Output for every kind gains `asOf` (read time) and `truncated` (true when more candidates than the bound exist; for the
  existing kinds, read one more row than the limit). Additive within a matched release (confirmed by the orchestrator,
  13 Oct 2026).
Tests: `test/core/assignment-holds.test.ts` calling the queue as `test/core/dependency-not-linked.test.ts` about `:236`
does: unpaid assigned work is listed; after payment, or a usable exception, or the first work, it is not; an expired
exception lists it again; a draft without assignment is never listed; 201 candidates give 200 and `truncated` (seed them as the existing cap tests do, or give the read function a limit parameter as `offeringImpactItems` does). In
`test/system/core-pages.test.ts` (about `:531-545`): the travel agent and the operator are refused; `asOf` is served.

## Return (at most about 300 words)

Commits (id, subject); the tests that failed first (names, evidence files); check results; every deviation and why; the
UI-lane notes (new fields and kinds; the nav count reads `rows.length`, so it undercounts when `truncated`); open points.
Context: if your context passes about 250k, commit what is green and return before 275k with what remains.
