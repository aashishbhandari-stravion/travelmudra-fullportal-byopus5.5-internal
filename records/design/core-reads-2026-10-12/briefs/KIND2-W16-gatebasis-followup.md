# Brief W16: review follow-up of the recorded gate basis read (one commit)

Role: Principal Software Engineer. One review follow-up commit on top of `8c73b60`. Failing tests first.

## Where you work

- Worktree: `WT=/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/core-reads-2026-10-12/wt/w14-gatebasis`
  (branch `wave3-gatebasis`, head `8c73b60`, `node_modules` installed). You are its only writer. Never push.
- Start EVERY Bash command with `cd $WT &&`. Absolute paths under `$WT` for Read, Edit, Write. First command:
  `cd $WT && git branch --show-current && git log --oneline -1` (expect `wave3-gatebasis` and `8c73b60`; else stop).
- Tests: `export TMPDIR=/tmp/claude-1000/w16; mkdir -p $TMPDIR`, then
  `node --test --test-global-setup=test/support/global-setup.ts <files> 2>&1 | grep -E "^ℹ (tests|pass|fail)|✖|AssertionError|expected|actual" | head -40`.
  Do not run `npm run check`. Checks: `npx tsc -p tsconfig.json --noEmit`; `npx eslint <changed files>`;
  `test/core/recorded-gate-basis.test.ts`; then `test/core/*.test.ts`, `test/system/core-pages.test.ts`,
  `test/unit/*.test.ts` once.
- Read `git show 8c73b60` first (the change under review), then the findings below. Read with `grep -n`/`sed -n`.

## Findings to fix (owner disposition: fix now)

- R-01: "An unpaid government case whose declaration sets Gate 2 to `not_applicable` still receives payment, commitment
  and exception fields suggesting a payment gate applies. The evaluator skips that gate (`controls.ts` about `:705`)."
  Fix: the read mirrors the evaluator's applicability condition exactly (the service mode is not `travelmudra_filed`, or
  the governing declaration's `controls.gates.gate2` is `not_applicable`): then `gate2` is null and the act entry states
  the recorded reason (service mode or declaration), as an additive field. Use the same inputs the evaluator uses (the
  governing declaration, the offering's service mode); do not change the evaluator. Test: an unpaid case under each
  condition the fixtures can build (if the declaration validation refuses `not_applicable` for a government act, say so
  and test the service-mode case plus a unit-level probe of the helper with such a declaration).
- R-02: "After a readiness exception is granted following reassignment, document evidence can change without replacing
  the readiness record. The projection still returns `failure: null`; the evaluator sees `stale_basis` and never
  considers the exception." Fix: the contract comment states that `failure` is the exception's own freshness only; the
  readiness entry also carries the readiness validity that the case read already serves for `case.readiness` (the same
  recorded value, not a new verdict). Test: stale and held readiness after a granted readiness exception: `failure` stays
  as the freshness check gives it, the readiness validity reads `stale_basis` / `held`, and `evaluateControls` refuses.

## Rules

- Failing tests first; save to `.../core-reads-2026-10-12/research/evidence/ITEM-21-followup-fails-first.txt`.
- Files: `src/modules/core/controls.ts`, `src/modules/core/staff-views.ts`, `src/contracts/core.ts` (additive),
  `src/core-api/bindings/core.ts`, `test/core/recorded-gate-basis.test.ts`. Nothing else; no kernel change, no migration,
  no new reason code. The decision sites stay unchanged.
- Public-fit commit message (no `ITEM-`, `R-nn`, `P-nn`, `OD-`, `K2-`, `WP-`, "seam"): subject such as "Mark an
  inapplicable Gate 2 and readiness validity in the gate basis read"; body: the two gaps, the changes, the tests, the line
  "Review follow-up of the recorded gate basis read."; before the last line `Ownership grant (orchestrator, 13 Oct 2026):
  prompt scope (<files>).`; last line `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Never bypass hooks.

## Return (at most about 200 words)

Commit (id, subject); the tests that failed first; check results; deviations. Return before about 275k context.
