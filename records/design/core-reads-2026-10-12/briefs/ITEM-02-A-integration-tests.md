# Brief ITEM-02-A: integration tests for the `dependency_not_linked` blocker (Core kit)

Role: Principal Software Engineer (tests). One bounded task. Working tree:
`/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/core-reads-2026-10-12/repo`
(branch `core-reads-2026-10-12`). You are the only writer in the tree while you run. Do not commit. Do not push.

## What is already built (uncommitted in the tree; read `git diff` and `test/unit/dependency-links.test.ts`)

- Kernel reason code `dependency_not_linked` (`src/kernel/vocabulary/reasons.ts`).
- Wire blocker `ref` pattern widened to `^[a-zA-Z0-9_.]{1,60}$` (`src/contracts/errors.ts`).
- `src/modules/core/derived.ts`: `NOT_LINKED_ENFORCED` (record_readiness and the three `authorize_*`; NOT `release_packet`,
  which waits for an owner decision), `applicableUnlinkedRelations(decl, links)`, `notLinkedBlocksNextStep(...)`, and
  pending rule 19a in `pendingOnAction` (before rule 20): owner `assigned_operator` (the assigned operator), reason
  `dependency_not_linked`, next action `return_to_ta`, `sinceSeq` 0.
- `src/modules/core/controls.ts` validation stage (stage 10): one blocker
  `{control: 'dependency_prerequisite', kind: 'mandatory_validation', code: 'dependency_not_linked', exceptionEligible: false, ref: <relationshipCode>}`
  per applicable unlinked relation for `record_readiness`, and per relation that conditions the action for an `authorize_*`.

Design source (read only the rows named here): `../research/inputs/proposals/K2-P15-1-dependency-not-linked.md`
§1.4 (table), §1.6, §5, §12 (fixtures and tests I2 to I12, I14).

## Task

Create `test/core/dependency-not-linked.test.ts` with tests I2, I3, I4, I5, I6, I7, I8, I9, I10, I11, I12, I14 as §12
states them. Do NOT write I13 (`release_packet`; not built). Do NOT write I1, V1 to V3 or S1 (another brief).

Pointers:
- Kit: `test/core/kit.ts` (`startCoreKit`, `kit.group`, `kit.draft`, `kit.submitted`, `kit.recordReadiness` writes a valid
  readiness through fakes, `rejected`, `accepted`, `blockerCodes`). The seeded relation is `needs_tourist_evisa` on the
  TRANSIT offering (conditions `authorize_government_submission` only). Fixture model: `pair()` and `link` in
  `test/core/withdrawal-dependencies.test.ts:146-155`.
- Readiness through the real controls: the Core kit bypasses readiness controls, so for any test that needs a
  readiness REFUSAL call `evaluateControls` (`src/modules/core/controls.ts`) with action `record_readiness` in a read
  transaction (`kit.read`) and assert the blocker; see how other core tests call `evaluateControls` or the `can*`
  helpers (grep `evaluateControls` under `test/core/`).
- Acts: `core.authorize_external_act` through the kit's command set (grep `authorizeExternalAct` or `authorize` in
  `test/core/acts.test.ts` for the call shape, the Gate 2 exception and the readiness exception).
- `twoRelations` (I12): a test-only declaration with two relations, registered by test code (model:
  `test/core/catalogue-impact.test.ts` or the catalogue commands). MUST NOT change `catalogue/synthetic/catalogue.json`.
  If registering it costs more than about 30 minutes, write I12 as a `todo` test with the reason and continue.
- "Nothing written" (§12): no `sys_operations` row for the key, no new fact, no `sys_tasks` row, no `dlv_notices` row, no
  `pay_exposure_reservations` row, the gate exception still `granted`, no new `ops_readiness` row.

Run: `export TMPDIR=/tmp/claude-1000/cr2; mkdir -p $TMPDIR; node --test --test-global-setup=test/support/global-setup.ts test/core/dependency-not-linked.test.ts`.
Also run `test/core/withdrawal-dependencies.test.ts` and `test/core/acts.test.ts` once at the end (they MUST stay green),
and `npx eslint test/core/dependency-not-linked.test.ts`.

Rules: change only `test/core/dependency-not-linked.test.ts` (and a new fixture file under `test/core/` if needed). Never
edit product source. If a test shows a product defect (a test that should pass by the design fails), keep the test,
mark it with `{ todo: 'product: <one line>' }` and report it. Keep context small: read only the files named here and the
lines you need; no repository-wide scans. If your context approaches 200k tokens, stop and return a partial result
with what remains.

## Return (at most about 300 words)

Per test ID: pass, todo (with reason) or not written. Product defects found (scenario, file:line). The final run
counts of the three test files. Any assumption you made about the design.
