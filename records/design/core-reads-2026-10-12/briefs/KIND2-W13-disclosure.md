# Brief W13 (Kind 2): ITEM-05 disclosure correction evidence, the parts that do not wait for Max

Role: Principal Software Engineer (design, implementation and tests) for one Kind 2 item built from its reviewed
proposal. One commit per coherent part (at most three), failing test first.

## Where you work

- Your worktree: `WT=/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/core-reads-2026-10-12/wt/w13-disclosure`
  (branch `wave3-disclosure`, at `e0b978d`, `node_modules` installed). You are its only writer. Commit there. Never push.
- Start EVERY Bash command with `cd $WT &&` (write the path out). Use absolute paths under `$WT` for every Read, Edit
  and Write. Never touch the lane clone (`.../lanes/core-reads-2026-10-12/repo`) or another worktree. First command:
  `cd $WT && git branch --show-current && git log --oneline -1` (expect `wave3-disclosure` and `e0b978d`; else stop).
- Tests: `export TMPDIR=/tmp/claude-1000/w13; mkdir -p $TMPDIR`, then
  `node --test --test-global-setup=test/support/global-setup.ts <files> 2>&1 | grep -E "^ℹ (tests|pass|fail)|✖|AssertionError|expected|actual" | head -40`.
  ALWAYS filter test output. Do not run `npm run check` (the architect runs it per commit).
- Checks per commit: `npx tsc -p tsconfig.json --noEmit`; `npx eslint <changed files>`; the targeted tests; before each
  commit also `test/operations/*.test.ts`, `test/core/*.test.ts` and `test/unit/*.test.ts` once.
- Read with `grep -n` and `sed -n 'a,bp'`. Never read a large file in full.

## Sources (read first; read only what you need)

- The reviewed proposal: `/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/ui-revamp-2026-10-12/output/proposals/K2-P20-1-disclosure-correction-evidence.md`
  (§"Finding on the decided direction", §0 design, §1 to §11, §12 ownership, §16 questions, §18 review dispositions).
  Its review: `.../lanes/ui-revamp-2026-10-12/research/reviews/` (the K2-P20-1 review file, if present).
- The owner decision (register OD-X8, 13 Oct 2026): fix before launch; "The correction is met only by an eligible
  replacement of the incident's file or by a recorded 'no replacement owed' decision with business evidence."
- `docs/agent-guide.md` (working rules, module map, test recipes) in your worktree.

## Scope: what to build and what waits

- WAITS FOR MAX (do NOT build): proposal §16 Q-1 (Point S: may a SuperAdmin record the decision), Q-2 (the authority
  rule of Point D), Q-3 (Point G: refuse "no replacement owed" when a replacement is owed). Everything of Point D (the
  "no replacement owed" decision command, its column and migration), Point S and Point G depends on these answers.
- BUILD: the parts that do not depend on Q-1 to Q-3. As the plan records: Point R (the releasable replacement rule:
  §0.2, R1 to R6, re-evaluation without relabelling, §0.5), the §0.5 census as a read-only query in the release record
  (Q-4), and the §0.6 release rule in the release record (Q-5). Read the proposal and decide exactly which points are
  independent; write that split, with one line of reason per point, at the top of your design note before you code. If
  you find that Point R itself cannot be built without a Point D decision, build nothing, write the note and return.
- Design note (required, before code): `/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/core-reads-2026-10-12/research/designs/ITEM-05-design.md`
  (at most about 80 lines): the independent parts, the files, the change per file, the tests, what waits, the hostile
  states of proposal §9 that apply and how the change handles them.
- Walk-through for Max (required for a Kind 2 item): `.../core-reads-2026-10-12/research/designs/ITEM-05-WALKTHROUGH.md`:
  the steps Max performs on `lane-max` (edge 4620, staff 4622) with the synthetic accounts (`syn-ta-1`, `syn-operator-1`,
  `syn-superadmin-1` @synthetic.test), the expected results and the facts to look for. Note any step that needs a part
  that waits for Max.

## Rules

- Failing test first; save the filtered output to `.../core-reads-2026-10-12/research/evidence/ITEM-05-<part>-fails-first.txt`
  (first line: `# <test names> before the change, <date>`).
- Files you MAY edit: the files in proposal §12 for the parts you build (Operations case work `incidents.ts`,
  `commands/incidents.ts`, `facade.ts`, `store.ts`; `src/contracts/operations-work.ts`; `src/core-api/bindings/
  operations-work.ts`; `src/core-api/allowlists.ts`; the release record section of `docs/operations.md`), and the tests
  of proposal §11 (`test/operations/`, `test/core/`, `test/system/` as named there). The migration of proposal §12 belongs
  to Point D: do not add it unless a part you build needs it, and then stop and report instead. No kernel change, no new
  reason code unless the proposal names it as authorized (then say which), no policy change, no other module, no HTML
  (`src/apps/`, `src/web/` are the UI lane's). Stop and report if another file must change.
- Public-fit: no internal identifier (`OD-…`, `K2-…`, `P-nn`, `ITEM-…`, `WP-…`, `R-nn`, `Q-n`, "seam") in code,
  comments, test names or commit messages. Commit message: imperative subject under 72 characters; a body that says the
  gap, the change and the tests; before the last line: `Ownership grant (orchestrator, 13 Oct 2026): accepted Kind 2
  proposal scope (<files>).`; last line `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Never bypass hooks.
- Match the surrounding code style and comment density.

## Return (at most about 300 words)

Commits (id, subject); the independent parts built and what waits (with the question each waits for); the tests that
failed first (evidence files); check results; every deviation and why; UI-lane notes; open points. Context: if your
context passes about 250k, commit what is green and return before 275k with what remains.
