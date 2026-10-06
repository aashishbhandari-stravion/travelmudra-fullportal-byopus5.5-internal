# Milestone 4: gap inventory and lane plan (architect, 2026-10-06)

Status: plan. Inputs: a read-only gap inventory of main 819139e against records 13 and 15 (an evidence-gathering agent produced it; the architect reviewed it and spot-checked the task-queue item). Normative design stays in records 13 and 15 and the contract; this file only allocates work.

## 1. What exists

- Core (record 13 sections 2.1, 3.1–3.6, 3.8–3.9 X1/X4, 3.12–3.14, 3.19, 5) is done. Core reaches the missing owners through fail-closed ports in `src/modules/core/ports.ts` (OperationsPort, DeliveryPort, PENDING_* defaults), wired in `src/domain/compose.ts`. Core tests use fakes in `test/core/fakes.ts`.
- Vocabulary for ids, facts, task kinds, actions, reason codes, resource types and blob owners of operations and delivery already exists.
- Views: projector framework, health, rebuild, `tm views rebuild`, the measures framework and the audit pages exist. Only the `audit_index` projector exists.
- Timers 5.1–5.4 exist.

## 2. What is missing

Operations case work (record 13):
- Tables `ops_work_steps`, `ops_readiness`, `ops_act_evidence`, `ops_reconciliation_attempts`, `ops_artifacts`, `ops_incidents`, `ops_originals` (+ parts, links, movements), `ops_failure_classifications`, `ops_effort_samples`.
- 3.7 CMD-O1..O4 (start work, work steps, readiness); 3.9 X2/X3 (act evidence, reconciliation attempts); 3.10 P1 packet build request; 3.11 CMD-OC1 `ops.record_official_result` and the CMD-OC2 contract/binding/route; 3.15 AR1–AR4 (artifacts, association, review copy); 3.16 DS1–DS4 (wrong-recipient disclosure); 3.17 OR1–OR4 and custody state; 3.18 IN1, IN2, EF1; the task handler for `ops.attribute_country_defect` (the kernel enqueues it today; the task loop leases only kinds with handlers, so the rows wait in the queue until this handler exists).
- Operator surface 4.2: custody, artifacts, incidents, attempts, work steps and act evidence on the case page; incidents on `/ops/work`.

TA Delivery (record 15): the whole module `src/modules/delivery` (tables `dlv_*`, migration slot 0800): checkRelease and the byte-release routes (single, review, selection zip), notices (C04–C06 on all surfaces; consumers already call `postNotice` through ports), packet build task and release marking, handover, manual email, direct external, resend, harness commands, the `mail.deliver` task, delivery config limits, pages and the B46 boundary POSTs.

Views and measures: per-application projectors (`view_applications`, `view_assignment_queue`, `view_ta_history`, `view_financial_follow_up`, `view_measures_wait_intervals`), search pages, history pages, `/admin/monitors`, queue `monitoring`, measures M-01..M-08 capture and M-09.

Route inventory: about 43 reserved routes; delivery, views and some operations routes are not in the inventory; O27 uses action `operator.record_custody` where the design says `operator.record_handover`; some paths differ from the design.

## 3. Seams (shared files)

Migration numbering (0610–0690 operations, 0800 delivery, 0910 views CHECK widening, 1010 pending cross-module foreign keys; applied migrations are immutable), `src/domain/compose.ts` and `module-ports.ts`, core-api registry/allowlists/contracts index, `src/core-api/server.ts` byte-release continuation, shared contract and page files (`src/contracts/core.ts`, staff/TA case pages), the route inventory, kernel registries (guard constraints, schema sets, vocabulary), the identity policy (resolvers; an `original` resource or application path), config. Operations and Delivery are coupled both ways (checkRelease ↔ blocking incidents and artifact eligibility; DS2 → postNotice; P1 → requestPacketBuild; review copy gated by incidents).

## 4. Lane plan (at most three lanes)

1. **Stage A — interface freeze (one agent, Opus).** Module skeletons and frozen `api.ts` of operations case work and delivery, the ports in `core/ports.ts`, all migrations' table definitions per record (so FKs and guard constraints are settled once), vocabulary and policy additions, config keys, contract files (new files per module), route inventory reconciliation (add every missing design route as reserved, fix O27 and path mismatches), allowlist and registry slots, compose wiring with pending implementations. Gate green.
2. **Stage B — three lanes on the frozen interfaces:** Operations case work (Opus), TA Delivery (Opus; byte release is security-sensitive), Views projections and measures plus the list/search/history pages (Sonnet, high effort). Each lane owns its module files, its contract file, its binding file and its pages; shared registries are append-only.
3. **Stage C — integration (one agent):** merge, real composition (remove pending defaults), system tests on the three instances across operations → delivery, then the milestone review and the `m4-operations-delivery-views` tag.
