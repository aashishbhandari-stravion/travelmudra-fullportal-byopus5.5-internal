# ITEM-05 design note: disclosure correction evidence, the parts that do not wait for Max

Worker W13, 13 October 2026. Source: proposal K2-P20-1 revision 2 (reviewed); owner decision OD-X8. Worktree
`wt/w13-disclosure`, branch `wave3-disclosure`, base `e0b978d`.

## 1. The split (one line of reason per point)

| Point | Built now? | Reason |
|---|---|---|
| R (the rule: R1 to R6, re-evaluation, no relabelling) | Yes | It reads existing rows through existing ports. No answer to Q-1 to Q-3 changes the replacement branch. The decision branch of R5 is one added condition when D lands. |
| D (the "no replacement owed" decision, column, migration, command, wire fields) | No | Q-2 decides its shape: option (c) adds a pending state and a second command, so the column and the command are not settled. |
| S (a SuperAdmin may record the decision) | No | Q-1. |
| G (refuse the decision when a replacement is owed) | No | Q-3. G is a check inside D's command. |
| Census of §0.5 (read-only query in the release record) | Yes | Owner-run read. It omits `correction_decision IS NULL`: the census runs during the cutover verification of the first release with the rule, before any decision can exist, so the result is the same. Brief scope; Q-4 stays Max's confirmation. |
| Release rule of §0.6 (release record) | Yes | An operator rule. It is stated without D's migration number: the first release with the rule MUST raise the schema head; no build without the rule may declare that head compatible. Brief scope; Q-5 stays Max's confirmation. |
| C17 (rollback test at the decision migration's head) | No | It needs D's migration. The kernel refusal it relies on is already tested (`test/ops-tooling/rollback.test.ts`). |

**Release constraint (finding, P1 if ignored).** R alone makes a disclosure incident without a file (a SuperAdmin's
disclosure on a case or without a case; a report of a version that is no result file) unresolvable: only the decision
meets its correction (R1). An application-scoped disclosure blocks every byte release of the application while open.
This is the proposal's rejected option C. R is therefore built and tested now but MUST NOT reach a release without D.
The orchestrator owns integration order; Max owns the release. This does not stop R from being built: R does not
depend on a Point D answer, only its release does.

## 2. Files and the change per file

| File | Change |
|---|---|
| `src/modules/operations/case-work/incidents.ts` | New `releasableReplacement(deps, tx, f)`: R2 target `f.application_id ?? f.uploaded_for_application_id`; R3 (i)+(ii) `eligibleArtifactRow(tx, T, f.artifact_type)`; (iii) `deps.documents.getVersionForRelease` with group = T's group (`deps.core.getApplicationScope`), `currency = 'current'`, `bytesState = 'canonical'`, `contentSafe`; (iv) `blockingIncidents(tx, { applicationId: T, documentVersionId })` empty. `missingEvidence(deps, tx, i, extra)`: `correction` met only when it returns a row (R5); no evidence entry counts. Header comment updated. |
| `src/modules/operations/case-work/commands/incidents.ts` | The resolve handler passes `d` to `missingEvidence`. |
| `src/core-api/bindings/operations-work.ts` | The incident detail passes `deps` to `missingEvidence` (the resolve offer). |
| `docs/operations.md` | Section 2 gains "The disclosure correction rule (release record)": the release rule and the census query. |
| `facade.ts`, `store.ts`, contracts, allowlists | No change: `incidentView` already takes `deps`; `eligibleArtifactRow` exists; no wire field changes for R. |

## 3. Tests (failing first)

New `test/operations/disclosure-correction.test.ts` (real PostgreSQL, operations kit):
- C1 reference only, as recorded evidence and as resolution evidence: refused `['correction']`.
- C2 replacement under review: missing. C3 verified automatically: met; resolve, close; F stays refused to the agent.
- C4 replacement without `replacesArtifactId`: met. C5 verified for another candidate: missing.
- C6 eligible replacement with unavailable bytes and its integrity incident, then that incident resolved: missing both.
- C6b application-scoped integrity incident on T: missing, then met after it resolves.
- C6c eligible artifact of another type: missing. C6d chains: met; missing. C6e eligible alternative before the
  report: met at once. C6f superseded alternative only: missing. C6g replacement later reported: met, then missing.
- C7 after completion: SuperAdmin report, replacement by the SuperAdmin under the incident, association incident, a
  named reviewer confirms: met; resolves and closes. Built: the completion rows are written as Core's completion
  writer leaves them, because `harness.core.check_completion` refuses in the fixture (`delivery_send_trigger_unselected`,
  a parked owner decision).
- C16 (read part only): the incident read serves `correction` missing and the resolve offer blocked, then OK.
- C14/C18 (commit 2): an open incident resting on a reference stays missing; a closed one keeps row and revision; the
  census from `docs/operations.md` labels them `correction_missing` and `follow_up_candidate`.

Changed: `artifacts-incidents.test.ts` (T-CO58/59: the deletion reference stays a negative proof; a verified
replacement before the resolution); `incident-authority.test.ts` (the operator's report: a reference stays negative, a
verified replacement meets it; the SuperAdmin's no-file disclosure: the reference stays negative and the incident stays
unresolved until the decision exists).

## 4. Hostile states of proposal §9 that apply

- Clock skew: the rule compares no times.
- Unreadable data: a failed Documents or Core read throws; the read or resolution fails; nothing counts as met.
- Replacement under review, rejected, blocked, noncurrent, of another type, for another candidate: not met (i, ii).
- Unavailable or disposed bytes, also after the integrity incident resolves: not met (iii).
- Application-scoped incident on T: not met while open; no deadlock once D exists (today a no-file containment has no
  route: the release constraint above).
- Replacement disclosed later: R becomes blocked in the second report; the first incident is unmet again.
- Chains and an earlier eligible alternative: decided by T's one eligible row, not by `replaced_by`.
- Concurrency: the rule is a read inside the SERIALIZABLE resolve; a concurrent block or replacement either commits
  first (the resolve sees it) or the resolve is retried by the kernel.
- Resolved and closed incidents: not re-evaluated (`missingEvidence` runs for open incidents only); close does not
  re-check. No relabelling, no backfill.
