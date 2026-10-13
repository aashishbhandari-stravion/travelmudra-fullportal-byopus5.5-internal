# Brief ITEM-02-D: the link and the real readiness command at once (review finding R-01)

Role: Principal Software Engineer (tests). One bounded task. Working tree:
`/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/core-reads-2026-10-12/repo`.
You are the only writer in the product tree. Do not commit. Do not push. Change only `test/operations/work-acts.test.ts`.
Public-fit rule: no internal identifier (`OD-…`, `K2-…`, `P-nn`, `ITEM-…`, `WP-…`, `R-01`) in code, comments or test names.

## Context

The blocker `dependency_not_linked` (commits `100227f`, `88a1174`) refuses `ops.record_readiness` while a declared relation
has no live link. `test/operations/work-acts.test.ts` already holds test I1 (a `describe` block near the end that makes a
TRANSIT application through the Operations kit: it adds a `transit` entry to `OFFERINGS` with `Object.assign`). Reuse its
setup. The independent review found that the existing race test reads a readiness evaluation, not the real command.

## Task

Add one test to the I1 `describe` block: an application in `returned_to_ta` (operator's formal return of the unlinked
TRANSIT application). Run the travel agent's `core.link_dependency` (link to an upstream TOURIST application of the same
applicant in the same group; find how the Operations kit or `test/core/dependency-not-linked.test.ts` links) and the
operator's real `ops.record_readiness` at the same time (`Promise.all`), with different operation keys. Repeat the pair
in both start orders (or run the pair several times).

Assert: the link is accepted; the readiness command is refused in every run (while returned to the travel agent the
editor hold refuses it; after a hand back the upstream is not met, so it stays refused); the refused command wrote
nothing (no `sys_operations` row for its key, no `ops_readiness` row, no `ops.readiness_recorded` fact, no `sys_tasks`
row). Name the refusal codes you observe in the test's assertions.

Run (short TMPDIR): `export TMPDIR=/tmp/claude-1000/cr7; mkdir -p $TMPDIR; node --test --test-global-setup=test/support/global-setup.ts test/operations/work-acts.test.ts`.
The file MUST be green as a whole. `npx eslint` on it.

If your context approaches 80k tokens, stop and return what you have.

## Return (at most about 150 words)

Pass or fail; the refusal codes observed; the file's pass/fail counts; assumptions.
