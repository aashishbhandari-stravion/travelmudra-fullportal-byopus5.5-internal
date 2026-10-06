# Milestone 5: gap summary and lane plan (architect, 2026-10-07)

Status: plan. Input: a read-only inventory of main e85f23b (a Sonnet evidence agent; the architect reviewed it). Normative design stays in record 15 sections 3.4–3.7 and 7.4–7.7, contract sections 13, 16.7 and 17, and spec B37–B41.

## Gaps
1. Carried P1a: restore scope has no Operations or Delivery candidate sources (readiness current, act evidence, eligible artifacts, built packets, email sends), and no restore-boundary hook (an email send never becomes uncertain at the restore boundary, T-15-79).
2. Carried P1b: `cutover verify` compares no configuration digest (core's or the per-instance ones in the manifest).
3. Carried P1c: core-run procedures read edge's and staff's private configuration files; under per-instance OS users they fail.
4. No database-cluster unit; tm-core has no ordering on the database.
5. Capacity record: projector lag not measured, command latency not measured, no job duration/RSS or stream throughput, limits table incomplete (delivery, views, diag).
6. Tests: T-15-64 hashes the wrong ids; T-15-67 lacks OTP/enrolment tokens; T-15-78/T-F41 lack lists and audit search after restore; T-F49 lacks the restore-with-new-secrets case; T-15-72 has no single limits test; no test carries a T-F id and no traceability exists from contract section 13/16.7 ids to tests.
7. SEO: `tm seo check` works and reports the four owner-input blockers; no stored run record; not referenced in the operations guide.
8. Playbooks missing: public content release with the owner-input checklist, database start order and per-instance users, refusal-code responses.

## Lanes (writers: 3)
- **Recovery (Opus high):** gaps 1, and the restore parts of 6 (T-15-67, T-15-68 mark effects, T-15-78/T-F41, T-F49). Owns src/platform/restore*.ts, src/cli/commands/restore*.ts, the restore-candidate sources inside operations and delivery, the restore wiring in src/domain (restoreOwnerPorts, boundary hooks), test/ops-tooling restore and backup files.
- **Release and installation (Opus high):** gaps 2, 3, 4, 5 and the remaining parts of 6 (T-15-64, T-15-72). Decision for gap 3: `tm install` writes a non-secret instance descriptor per instance (service name, ports, configuration digest, the non-secret settings core procedures need) into an installation directory readable by core's user; core procedures read descriptors, never another instance's private files; tests simulate unreadable private files. Owns src/platform/{release*,installation-config,instances,install,supervise,capacity}.ts, the matching CLI commands, deploy/systemd, the release/cutover/install/capacity tests.
- **Verification and playbooks (Opus high):** gaps 7 and 8, and the traceability of 6: a public-fit traceability document (contract test id → test file and title) plus a static test that every listed title exists; missing invariant tests in new test files only (never renaming titles in files the other lanes edit); a stored `tm seo check` report and its procedure in the operations guide; the three playbooks. Owns docs/verification/, docs/playbooks/, new test files, test/static traceability.
- docs/operations.md: each lane edits only its own sections (append-only elsewhere).

Then a focused review: invariant commissions on recovery scope and boundary, release/cutover integrity and per-instance isolation, capacity bounds, and the traceability's truthfulness. No UX approver (no new screens).
