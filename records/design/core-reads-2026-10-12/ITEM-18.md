# ITEM-18 P-10 (d): the reassignment preview lists every duty Core transfers

Kind 1 read. Wave 3, worker W11 (Opus, worktree `wave3-assign`). Commit: LANE_18 (cherry-picked from `504bbfb`; parent
`168973f` on the worker branch). Grants: orchestrator (13 Oct 2026, D-16 G2, G4)
`src/modules/operations/case-work/incidents.ts`, `facade.ts`, `types.ts`, `src/domain/module-ports.ts`,
`test/unit/frozen-interfaces.test.ts`, `test/operations/reassignment-preview.test.ts`, one register line; prompt scope
(`src/modules/core/commands/assignment.ts`, `ports.ts`, `staff-views.ts`, `src/contracts/core.ts`,
`src/core-api/bindings/core.ts`, `src/core-api/allowlists.ts`, `test/core/assignment-holds.test.ts`, `test/core/fakes.ts`).

## Read and change

A new SuperAdmin query `core.reassignment_preview { applicationId }` lists exactly what `core.reassign` transfers:
`holds[{ id, kind, effect: 'recorded' }]`, `authorizations[{ id, kind, state, effect: 'owner_moves' | 'recorded' }]`
(an exhausted act is recorded with its owner unchanged, D-16 C), `incidents[{ id, kind, state, ownerKind, effect:
'owner_moves' | 'reviewer_ends' }]`, with `revision`, `asOf`, `fromOperatorId` and `complete` (incidents bounded, limit
plus one). Grant condition met: Operations extracts ONE predicate (`transferredIncidents`) and one effect rule
(`transferEffect`) used by both the writer `transferApplicationDuties` and the new read `applicationDutiesToTransfer`.
Core shares `reassignmentRecords` between the command and the preview; the command's reconciliation-owner UPDATE now
reads `act_state = ANY(OPEN_EXTERNAL_ACT_STATES)`, which is the same set (`authorized`, `filing_unknown`; checked in
`src/kernel/vocabulary/external-acts.ts:15`). New additive port method through `module-ports.ts`; one frozen-interfaces
line; the Core test fake gained the method. Register line.

Worker note, P2: the `ops_incidents_reviewer` constraint makes the writer's SuperAdmin-keeps branch unreachable today, so
`reviewer_ends` never occurs; kept to mirror the writer.

## Tests

`test/core/assignment-holds.test.ts`: the preview's holds, acts and incidents equal `core_assignments.transferred` after
the reassignment (open-hold coverage in a second reassignment at the end of the test). `test/operations/
reassignment-preview.test.ts` (new): incidents in each predicate branch and outside it give the same set in the preview
and the transfer, with the real predicate. Failed first: `evidence/ITEM-18-fails-first.txt` (recorded again with the
final tests and the source stashed).

## Review and dispositions

Codex `gpt-6.1-sol` high, read-only, one pass on `504bbfb` (`reviews/ITEM-18-review.md`). Verdict: sound as written.
The reviewer confirmed: one new Operations read shares one predicate and one effect rule with the writer; the command
keeps its transaction reads, locks, lock order, transferred record and updated rows; holds are bounded to three by the
schema, acts to 200, incidents fetch 201. All findings P2, parked:

- R-01: an incident can change without an application revision bump, so equal revisions do not prove the duties are
  unchanged; document that the preview is informational (UI-lane note).
- R-02: the preview loads the whole authorization history before it filters and cuts to 200.
- R-03: the incident comparison sorts ids; the Core assertions cover only `authorized` acts, not `filing_unknown` or an
  exhausted act's unchanged owner.

## Checks

CHECKS_18
