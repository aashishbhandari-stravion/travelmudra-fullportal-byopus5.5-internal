# Wave 3 survey C (ITEM-16, 17, 18), head e0b978d, 13 Oct 2026 (Explore agent, Sonnet, read-only)

## ITEM-16 (P-10 a): per-item application id and operator id in the batch result
- core.assign_selection (src/modules/core/commands/assignment.ts:147-228) answers flat summary keys item{i}, assignment{i},
  assigned, refused (built :195, :201, :204 refused; :215-222 assigned). Contract src/contracts/core.ts:122-127 (input only;
  result is the open zWireSummary, src/contracts/commands.ts:36). Binding src/core-api/bindings/core.ts:504-507. No app reads
  the keys (src/apps/staff/core/admin.ts:527-538 redirects to ?done=plan).
- Summary cap 4096 B (src/kernel/command.ts:99, :360 throws internal/unexpected AFTER the writes -> whole batch rolls back;
  sys_operations CHECK in migrations/0001_kernel.sql). Measured all-assigned: current 3407 B at 50; with application{i} and
  operator{i}: 4062 B at 25, 4225 B at 26, 8137 B at 50. Default batch max 50 (src/platform/config.ts:245); config allows 200;
  the current format already overflows above about 60 items (latent; config-dependent).
- Options: (a) new bounded read core.assignment_batch {operationKey}: operation id and re-authorization via kernel
  lookupOperation (unchanged); rows from core_assignments WHERE batch_operation_id = operationId (column exists, FK
  migrations/0300_core.sql:589), LIMIT 201. (b) lower batch max to about 24 (config, outside lane). (c) raise the cap (kernel +
  migration: stop). Recommend (a). Refused items have no recorded application id anywhere: the answer says so, or Core writes
  application{i} for refused items only (about 89 B each; overflow at about 46 refused).
- Insertion (a): contracts/core.ts near :423-433; bindings/core.ts after :414; allowlists.ts:94; read beside assignmentPlan
  in src/modules/core/staff-views.ts:307.
- Tests: test/core/assignment-holds.test.ts:140-170 ("assigns a rendered selection or round-robin plan"); replay assertion
  (:162); a test with more than 25 assigned items.
- Ownership: all INSIDE (assignment.ts, contracts/core.ts [a new query: confirm "additive"], bindings/core.ts, allowlists.ts,
  staff-views.ts, store.ts, test/core); docs/verification/read-model-register.md (edited by wave 1-2 Kind 1 items; confirm).
  No UI-lane test names core.assign_selection.
- Risks: P0 flat-summary design overflows at >= 26 items (batch fails internal); P1 refused-item rows cannot be bound to an
  application id; P1 re-authorize on every call; P2 bound at 200. No kernel/migration/reason code except (c).

## ITEM-17 (P-10 b / P-02): commandName and acceptedAt on core.operation
- Contract src/contracts/queries.ts:123-130 (not contracts/core.ts). Binding src/core-api/bindings/kernel.ts:26-45 calls kernel
  lookupOperation (src/kernel/command.ts:406); findOperation (:194-198) selects command_name not accepted_at; replay()
  (:204-217) returns neither. sys_operations has both (migrations/0001_kernel.sql:212,217), append-only, tm_app SELECT.
- Smallest change without kernel edit: after lookupOperation returns accepted (kernel.ts:~38), runReadOnly SELECT
  command_name, accepted_at FROM sys_operations WHERE actor_key = actorKeyOf(actor) AND operation_key = params.operationKey
  (one bounded row). src/platform/capacity.ts:104 already reads sys_operations outside the kernel. Add both fields to the
  accepted strictObject (queries.ts:128): commandName as a regex string (not the enum: a retired or harness. name would fail
  encodeWire -> 500), acceptedAt zWireDate.
- Tests: test/system/case-rules.test.ts:260-270 (atCore() calls core.operation for a core.record_assistance_entry key, :253).
- Ownership: src/contracts/queries.ts NEEDS GRANT; src/core-api/bindings/kernel.ts NEEDS GRANT; test/system INSIDE. UI tests
  use mocks (test/unit/web/results.test.ts, status-pages.test.ts); src/web/pages/operation.ts:35 decoupled.
- Risks: P1 enum encode failure (use string); P1 binding reads a kernel-owned table (orchestrator to accept); P2 two reads in
  separate transactions (append-only row, fine); P2 acceptedAt is the original acceptance (transaction) time on replay.

## ITEM-18 (P-10 d): reassignment preview of every transferred duty
- core.reassign (assignment.ts:231-278) transfers: open holds (recorded in transferred.holds, not mutated, :246, :249);
  possibly-filed acts (transferred.authorizations :247; the UPDATE of reconciliation_owner_id :262-264 covers only authorized
  and filing_unknown); incidents via transferApplicationDuties (src/modules/operations/case-work/incidents.ts:288-312;
  predicate: application_id, states open/assigned/awaiting_evidence/resolved, and (owner_kind='assigned_operator' AND owner =
  from) OR owner_kind='reviewer' OR reviewer_account_id IS NOT NULL; no LIMIT). Existing reads (iam.operator_duties,
  incidentsOwnedBy, incidentsOfApplication capped 100 with another predicate) are incomplete.
- Smallest change: new query core.reassignment_preview {applicationId} (contract after core.admin_case contracts/core.ts:417;
  binding after bindings/core.ts:385 with surfaceRead(c,'admin','assignment.reassign',app(id),...); allowlist :94); Core read
  in staff-views.ts using openHolds (store.ts:294), authorizationsOf (store.ts:322); per duty kind, id, effect (owner moves,
  reviewer ends, record only) and app.revision. Incidents need a read-only twin sharing ONE predicate with the writer in
  Operations plus a new OperationsPort method (src/modules/core/ports.ts:95, PENDING_OPERATIONS :109); bounded LIMIT n+1 with
  a complete flag.
- Tests: test/core/assignment-holds.test.ts:204-228 (reads core_assignments.transferred :234-236); preview ids equal
  transferred.{holds,authorizations,incidents}. The Core fake (test/core/fakes.ts:103) uses another predicate (owner = from
  only): real parity needs a test/system or test/operations test.
- Ownership: INSIDE contracts/core.ts, bindings/core.ts, allowlists.ts, modules/core/{staff-views,ports,store}.ts, test/core,
  test/system. NEEDS GRANT src/modules/operations/case-work/{incidents,facade,types}.ts; src/domain/module-ports.ts:371-383
  (coreOperationsPort mapping); test/unit/frozen-interfaces.test.ts:34 (pins the Operations function list); test/operations/.
- Risks: P0 a copied predicate drifts and the page claims "every duty" falsely (share one predicate); P1 stale preview (holds
  and incidents change without a revision bump: show read time and revision); P1 reconciliation_exhausted acts are in
  transferred.authorizations but their owner does not change (preview must say so, or orchestrator decides if a Core defect);
  P1 unbounded incidents (bound + complete flag); P2 privacy (ids, kind, state only).

Model suggestions: ITEM-16 Opus (summary cap and refused-item design); ITEM-17 Sonnet; ITEM-18 Opus (two modules, shared
predicate).
