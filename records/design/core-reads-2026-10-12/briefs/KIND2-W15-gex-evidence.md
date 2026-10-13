# Brief W15 (Kind 2): ITEM-32 a required evidence list on every gate exception grant (built and held)

Role: Principal Software Engineer (implementation and tests) for one Kind 2 item built from its reviewed proposal and
its one review (no re-review). One commit, failing tests first. The commit is HELD: it is not integrated on the lane
branch; the UI lane merges it together with its two grant forms later (owner decision, 13 Oct 2026).

## Where you work

- Your worktree: `WT=/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/core-reads-2026-10-12/wt/w15-gex-evidence`
  (branch `held/gate-exception-evidence`, at `e0b978d`, `node_modules` installed). You are its only writer. Commit there.
  Never push. Never create or move another branch.
- Start EVERY Bash command with `cd $WT &&` (write the path out). Use absolute paths under `$WT` for every Read, Edit
  and Write. Never touch the lane clone or another worktree. First command:
  `cd $WT && git branch --show-current && git log --oneline -1` (expect `held/gate-exception-evidence` and `e0b978d`).
- Tests: `export TMPDIR=/tmp/claude-1000/w15; mkdir -p $TMPDIR`, then
  `node --test --test-global-setup=test/support/global-setup.ts <files> 2>&1 | grep -E "^ℹ (tests|pass|fail)|✖|AssertionError|expected|actual" | head -40`.
  ALWAYS filter test output. Do not run `npm run check`.
- Checks: `npx tsc -p tsconfig.json --noEmit` (it MUST be clean; if a UI-lane file fails to type-check because of the
  required field, report the file and line, do not edit it); `npx eslint <changed files>`; the targeted tests; then
  `test/core/*.test.ts`, `test/payments/*.test.ts`, `test/system/*.test.ts` and `test/unit/*.test.ts` (including
  `test/unit/web/`) once, to list exactly what fails without the UI lane's forms.
- Read with `grep -n` and `sed -n 'a,bp'`. Never read a large file in full.

## Sources (binding)

- Proposal: `/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/ui-revamp-2026-10-12/output/proposals/P-11-gate-exception-evidence.md`:
  §3 (the change), §3.5 (exceptions granted before), §5 (hostile states), §7 (files), §8 (integration order), §9
  (tests), and §13 (the amendments after the review: §13.1 legacy replay across the release boundary, §13.2 migration,
  recovery release and admission, §13.3 who reads the evidence, §13.4 attestation-only evidence, §13.5 recommendation).
- Its one review: `.../lanes/ui-revamp-2026-10-12/research/reviews/P-11-12-review.md` (the P-11 findings; the four review
  fixes are conditions of the owner decision).
- Owner decision (13 Oct 2026): option O1, a required list of one to five evidence references on every gate exception
  grant; an attestation alone is accepted as evidence; the four review fixes are conditions.

## Change

As the proposal §3 and §13 say: the command input gains the required evidence list (1 to 5; kinds `external_reference`
and `attestation`); the handler enforces it; parsing still accepts the old shape so committed operations replay
(§13.1); the row and the fact carry the evidence; only SuperAdmins read it, on `core.admin_case` (§13.3); exceptions
granted before the change read as the proposal's legacy form (§3.5).

Migration (orchestrator condition): the proposal's `1060` is taken on main. Use the next free number above the head:
`migrations/1190_core_gate_exception_evidence.sql` (the head's highest is `1180`). Additive column per §13.2 (NOT NULL
without a default, with the legacy rows handled as §13.2 says), check, trigger re-created as the proposal says. No kernel
change (the proposal's §7 says none is needed: the fact evidence column, `zEvidenceInputs`, `EVIDENCE_KINDS`,
`FACT_TYPES`, `REASON_CODES` and `tm_forbid_column_change` exist). If the `document_version` kind (OC-1 port wiring) is
not needed under the decision (attestation accepted), do not build it; say so.

## Rules

- Failing tests first; save the filtered output to `.../core-reads-2026-10-12/research/evidence/ITEM-32-fails-first.txt`.
- Files you MAY edit: proposal §7's Core files (`src/modules/core/commands/gates.ts`, `store.ts`, `staff-views.ts`),
  `src/contracts/core.ts`, `src/core-api/bindings/core.ts`, the new migration file, and the Core-side test call sites
  and new tests in `test/core/`, `test/payments/`, `test/system/` (prompt scope). NOT the UI lane's files: `src/apps/`,
  `src/web/`, `test/unit/web/` and any test that posts the HTML grant form: list those instead (file:line and the
  failing assertion). Stop and report if any other file must change.
- Public-fit: no internal identifier (`OD-…`, `K2-…`, `P-nn`, `ITEM-…`, `WP-…`, `R-nn`, `OC-…`, `SA-…`, "seam") in code,
  comments, test names, the migration or the commit message. The commit body says why it is held, in plain words: "Held
  until the grant forms that send the evidence land in the same integration; this commit and the forms are checked
  together." Before the last line: `Ownership grant (orchestrator, 13 Oct 2026): accepted Kind 2 proposal scope
  (<files>).`; last line `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Never bypass hooks.
- Walk-through for Max (Kind 2): `.../core-reads-2026-10-12/research/designs/ITEM-32-WALKTHROUGH.md`: the steps on
  `lane-max` once the UI lane's forms are integrated (a grant with an external reference; one with an attestation only;
  a grant without evidence refused; the SuperAdmin case shows the evidence; the operator's case does not), and the facts
  to look for.

## Return (at most about 300 words)

Commit (id, subject); the tests that failed first (evidence file); check results; THE EXACT LIST of tests and lines that
fail without the UI lane's forms (file:line, assertion); every deviation and why; open points. Context: if your context
passes about 250k, commit what is green and return before 275k with what remains.
