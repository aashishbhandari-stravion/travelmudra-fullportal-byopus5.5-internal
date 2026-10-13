# Brief ITEM-02-B: real readiness, view interval and system tests for `dependency_not_linked`

Role: Principal Software Engineer (tests). One bounded task. Working tree:
`/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/core-reads-2026-10-12/repo`
(branch `core-reads-2026-10-12`). You are the only writer in the product tree while you run. Do not commit. Do not push.
Do not edit anything under `internal/`.

## What is already built (uncommitted; read `git diff` for the four source files)

- Kernel reason code `dependency_not_linked` (`src/kernel/vocabulary/reasons.ts`).
- Wire blocker `ref` pattern `^[a-zA-Z0-9_.]{1,60}$` (`src/contracts/errors.ts`).
- `src/modules/core/derived.ts`: `NOT_LINKED_ENFORCED`, `applicableUnlinkedRelations`, `notLinkedBlocksNextStep`, pending
  rule 19a (owner `assigned_operator`, reason `dependency_not_linked`, next action `return_to_ta`, `sinceSeq` 0n).
- `src/modules/core/controls.ts` stage 10: blocker `{control: 'dependency_prerequisite', kind: 'mandatory_validation',
  code: 'dependency_not_linked', exceptionEligible: false, ref: <relationshipCode>}`.
- `test/core/dependency-not-linked.test.ts` (I2 to I12, I14; passing). Reuse its fixture style (the `transitUnlinked`
  setup, the "nothing written" ledger) by copying the few lines you need; do not import from it.

Design source (read only these lines): `../research/inputs/proposals/K2-P15-1-dependency-not-linked.md` lines 294-388
(§11 projection boundary table, §12 fixtures and the rows I1, V1, V2, V3, S1). The seeded relation is
`needs_tourist_evisa` on the TRANSIT offering; it conditions `authorize_government_submission` only.

## Task

Add these tests to the existing files (append a new `describe` block in each; do not change existing tests):

| ID | File | Test (from §12) |
|---|---|---|
| I1 | `test/operations/work-acts.test.ts` | `transitUnlinked` (submitted, paid, assigned, work started, no link; an upstream TOURIST application of the same applicant in the group, unlinked): the real `ops.record_readiness` is refused with category `control_blocked` and the blocker above with `ref: 'needs_tourist_evisa'`; nothing written (no `sys_operations` row for the key, no new fact, no `ops_readiness` row). |
| V1 | `test/views/case-dependents.test.ts` | Forward deployment: `preReleaseOpenInterval` (replace the application's `wait_intervals` rows with the open interval the previous release observed: `assigned_operator`, `readiness_missing`, start at the assignment fact). Observe one post-release fact of the application whose answer is rule 19a. The `readiness_missing` interval keeps its start and closes at that fact; a `dependency_not_linked` interval opens at that fact; no interval with the new reason starts earlier. `view_applications.pending` equals Core's answer. |
| V2 | same | Rebuild `wait_intervals` with the owners composed after V1's observation: the closed intervals of V1 are unchanged; the open interval starts at or after the V1 fact. |
| V3 | same | Rollback: after V1, observe a later fact through `oldRulePort` (a case-port double that answers the previous release's pending answer: `assigned_operator`, `readiness_missing`, `confirm_readiness` or whatever rule 20/21 gave before; read the existing projector tests for how the case port is passed) → the `dependency_not_linked` interval closes at that fact; earlier intervals unchanged. Rebuild `applications` through `oldRulePort` → the projected pending carries the old answer. |
| S1 | `test/system/case-rules.test.ts`, its "dependencies" block | The operator posts the readiness form of an unlinked transit through the staff BFF → a refusal (409) that names the blocker (`dependency_not_linked`), not a server error. Before the wire fix this was a 500 (the `ref` pattern rejected `_`); you need not prove that. |

Pointers: grep the target file for its own fixture helpers first (`describe(`, `before(`, the kit or harness it starts).
For the views tests find how existing tests in `case-dependents.test.ts` drive the projector and the rebuild, and how they
read `wait_intervals`. Do not scan the repository broadly.

Run (use a short TMPDIR):
`export TMPDIR=/tmp/claude-1000/cr3; mkdir -p $TMPDIR; node --test --test-global-setup=test/support/global-setup.ts <file>`
for each of the three files. They MUST be green as a whole (existing tests included). Then `npx eslint` on the three files.

## Rules

- Change only the three test files. Never edit product source. If a test shows a product defect (a test that should
  pass by the design fails), keep the test, mark it `{ todo: 'product: <one line>' }` and report it with file:line.
- If V3's `oldRulePort` cannot be built without product changes, write V3 as `todo` with the reason and continue.
- Keep context small: read only the files and lines you need. If your context approaches 100k tokens, stop and return a
  partial result naming what remains.

## Return (at most about 300 words)

Per test ID: pass, todo (with reason) or not written. Product defects found (scenario, file:line). The final pass/fail
counts of the three files. Any assumption you made about the design.
