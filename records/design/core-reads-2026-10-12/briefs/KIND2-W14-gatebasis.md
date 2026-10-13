# Brief W14: ITEM-21 the recorded basis of each gate per act on the case reads

Role: Principal Software Engineer (implementation and tests). One item, one commit, failing test first.

## Where you work

- Your worktree: `WT=/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/core-reads-2026-10-12/wt/w14-gatebasis`
  (branch `wave3-gatebasis`, at `baa00e8`, `node_modules` installed). `baa00e8` holds two reviewed commits not yet on the
  lane branch: `ccf9659` (the Gate 1 facts helper `gate1Facts` in `src/modules/core/controls.ts`, served as
  `gate1Context` on the SuperAdmin case) and `baa00e8` (the first-work Gate 1 queue). Build on them. You are the only
  writer. Commit there. Never push.
- Start EVERY Bash command with `cd $WT &&` (write the path out). Use absolute paths under `$WT` for every Read, Edit
  and Write. Never touch the lane clone or another worktree. First command:
  `cd $WT && git branch --show-current && git log --oneline -1` (expect `wave3-gatebasis` and `baa00e8`; else stop).
- Tests: `export TMPDIR=/tmp/claude-1000/w14; mkdir -p $TMPDIR`, then
  `node --test --test-global-setup=test/support/global-setup.ts <files> 2>&1 | grep -E "^ℹ (tests|pass|fail)|✖|AssertionError|expected|actual" | head -40`.
  ALWAYS filter test output. Do not run `npm run check`.
- Checks: `npx tsc -p tsconfig.json --noEmit`; `npx eslint <changed files>`; the targeted tests; before the commit also
  `test/core/*.test.ts`, `test/system/core-pages.test.ts`, `test/payments/*.test.ts` and `test/unit/*.test.ts` once.
- Read with `grep -n` and `sed -n 'a,bp'`. Never read a large file in full.

## Source (binding)

`/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/ui-revamp-2026-10-12/output/proposals/P-14-wp07-gate-basis-and-gate2-read.md`,
item 1 and the amendment after the review (R-05). The plan's scope: "Recorded basis per gate and act (payment entry,
exception, prior commitment, recorded first-work basis) with the read time; never a computed `passed`." The control
evaluator answers `passed` both for previously authorized work and for a prior commitment of the same attempt
(`controls.ts` gate stages); neither establishes a payment receipt. Read the gate stages for Gate 1, Gate 2 and the
readiness gate after reassignment before you design.

## Change

- Extend the reviewed helper approach (do not copy it): one read per gate and act that the case offers on the operator
  case: Gate 1 for the first work (reuse `gate1Facts`), Gate 2 for each external act the case offers (government
  submission, government fee payment, provider handoff, as the evaluator keys Gate 2), and the readiness gate after a
  reassignment if the evaluator has one. Each returns the RECORDED basis only: (a) the payment recorded as received
  with its entry; (b) an exception: which one, its scope (gate and action), until when, used or not, and the existing
  freshness failure code; (c) a prior commitment of the same attempt (which record); (d) the recorded first-work basis
  after work started; plus `asOf`. No `passed`, `allowed`, `met` or `blocked` field.
- Serve it on the assigned operator's case read (`core.ops_case`) and the SuperAdmin's (`core.admin_case`), additive
  and nullable, with the same audience rules the cases use today. Do not serve exception evidence (a later item makes
  exception evidence SuperAdmin-only). The travel agent's read does not change.
- The decision sites (the evaluator's gate stages, `requireGate1AtWork`, `commands/gates.ts`) stay unchanged; a test
  compares the facts with `evaluateControls` in each state.
- One line in `docs/verification/read-model-register.md` (Kind 1 record).

## Rules

- Failing test first; save the filtered output to `.../core-reads-2026-10-12/research/evidence/ITEM-21-fails-first.txt`.
- Files you MAY edit (prompt scope): `src/modules/core/` (NOT `commands/groups.ts`, NOT `intake-writers.ts`),
  `src/contracts/core.ts` (additive only), `src/core-api/bindings/core.ts`, `test/core/*.test.ts`,
  `test/system/core-pages.test.ts`, and the register line (orchestrator grant, 13 Oct 2026). Nothing else; if Gate 2's
  facts need a Payments read that the Core payments port does not offer, stop and report (do not edit
  `src/modules/payments/`). No kernel change, no migration, no new reason code.
- Public-fit: no internal identifier (`OD-…`, `K2-…`, `P-nn`, `ITEM-…`, `WP-…`, `R-nn`, `STOP-…`, "seam") in code,
  comments, test names or commit messages. Commit message: imperative subject under 72 characters; body with the gap,
  the change and the tests; before the last line `Ownership grant (orchestrator, 13 Oct 2026): prompt scope (<files>).`
  (add the register line as `docs/verification/read-model-register.md (Kind 1 record)`); last line
  `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Never bypass hooks.

## Tests

`test/core/assignment-holds.test.ts` or a new `test/core/` file: per gate and act, each basis kind in turn (payment
received with its entry; a granted exception, then expired; a prior commitment of the same attempt; the first-work basis
after work started) is served as recorded with `asOf`, and `evaluateControls` agrees in each state. The operator and the
SuperAdmin get the field; the travel agent's read has none. The case encodes through the contract.

## Return (at most about 300 words)

Commit (id, subject); the test that failed first (evidence file); check results; every deviation and why; UI-lane notes
(new fields); open points. Context: if your context passes about 250k, commit what is green and return before 275k.
