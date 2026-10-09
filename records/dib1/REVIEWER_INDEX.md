# DIB-1 reviewer index — TravelMudra (Naruto / Opus implementation)

Navigation evidence for DIB-1 reviewers. Verified on 2026-10-09 with Git commands against the paths below.
It is not proof of implementation correctness.

Location: private repository `internal/`, file `records/dib1/REVIEWER_INDEX.md`. It was moved here from the
product tree because it names internal identifiers. All paths below are relative to the product repository root
(section A); paths that start with `internal/` are in this private repository.

## A. Repository identity and snapshot

| Item | Value |
|---|---|
| Implementation owner | Naruto (Claude Opus 5.5 orchestrator; 333 of 340 commits carry `Co-Authored-By: Claude Opus 5.5`) |
| Product repository root | `/home/max-stravion/projects/Critical/MaxHyperVisaFullPortalImplementationOpus5.5` (public-bound; remote `travelmudra-fullportal-byopus5.5`) |
| Private records repository | `<root>/internal/` (nested, own `.git`, excluded from the product repository; remote `travelmudra-fullportal-byopus5.5-internal`) |
| Branch | `main` |
| SOURCE_BASE_SHA | `102e4c9328f9d4e764895b7f83bb7f16e1ea530d` (not frozen; Max designates the freeze in Stage 0) |
| HEAD commit | 2026-10-09T10:25:46+05:30, "Add an agent guide that a fresh clone can read first"; 340 commits since `969ca68` (2026-10-04) |
| Accepted build tag | `m6-final-assurance` → `7be21b1` (2026-10-08). Commits after it change only docs, `.gitignore`, `eslint.config.js` and `scripts/uat/` (no `src/`, `test/` or `migrations/` change: `git diff --stat 7be21b1..HEAD`) |
| Milestone tags | `m1-foundation`, `m2-access-catalogue-documents`, `m3-cases-intake-payments`, `m4-operations-delivery-views`, `m5-release-recovery-verification`, `m6-final-assurance` |
| Internal repository HEAD | `982e1052b291f8034c04b7c0c0fa219639847caf` (2026-10-09T10:13:20+05:30) |
| Working tree | Product: clean before this index (0 modified, 0 untracked). Internal: clean. Ignored: `node_modules/`, `internal/`, `.claude/`, local `CLAUDE.md`/`AGENTS.md` |
| Complete candidate snapshot | Yes for product source at HEAD. This index is versioned in the private repository, not in the product repository (see section I) |

## B. Authoritative specification

| Item | Value |
|---|---|
| Original build specification | `<root>/internal/records/BUILD_SPEC.md`, SHA-256 `4a6fd90657b0723f67fb13a58aa57b3377238fd361ee8f706867bb714d58ea89`, 109 lines, rules B01–B47. Added in internal commit `8b028d6` (2026-10-04); never modified since |
| Approved amendments (owner) | `internal/records/design/02-owner-decision-register.md` (decisions D-01..D-10 and OD-* items; SHA-256 `59cf788f…ddd2`). Summary: `internal/records/FINAL-REPORT.md` §4 |
| Engineering replacements (B47) | `internal/records/ENGINEERING_OVERRIDES.md` EO-01..EO-21 (last change `d891ae1`, 2026-10-07). Engineering decisions, not business-rule changes |
| Requirement traceability | `docs/verification/traceability.md` (399 test ids: 317 proven, 78 partial, 4 gaps, per the M6 record); enforced by `test/static/traceability.test.ts` |

Original requirements: `BUILD_SPEC.md` only. Implementation-generated design: everything in `internal/records/design/`
(00–18) and `docs/architecture.md`. Owner-delegated decisions were made by the orchestrator under Max's 2026-10-04
delegation and are recorded, not separately signed.

## C. Knowledge-file index

| Path | Purpose | Authority / status | Revision |
|---|---|---|---|
| `docs/agent-guide.md` | Working rules, system mechanics, module map with tests and design records | Read first; tracked | HEAD `102e4c9` |
| `README.md` | Requirements, commands, install sequence, three instances | Tracked | HEAD |
| `docs/architecture.md` | Layers, write model, roles/secrets, admission, files, file ownership, topology | Tracked; implementation design | HEAD |
| `docs/operations.md` | Install, release/cutover, rollback, backup, restore, capacity, three instances, public site | Tracked; procedures | HEAD |
| `docs/playbooks/` | Database start order, `tm` refusal codes | Tracked | HEAD |
| `docs/extending/new-country.md`, `new-service.md` | Country adapter and service onboarding | Tracked | HEAD |
| `docs/verification/traceability.md`, `seo-check.md`, `seo-report.json` | Test-to-requirement map; search-readiness check | Tracked | HEAD |
| `DESIGN.md`, `PRODUCT.md` | Design system/tokens; product context | Tracked | HEAD |
| `scripts/uat/README.md`, `deploy/README.md` | Local installations (`uat.py`); systemd templates | Tracked | HEAD |
| `internal/records/REPOSITORY-MAP.md` | Repository split, boundary hooks, local-only items | Internal | `982e105` |
| `internal/records/design/00-architecture-brief.md`, `01-foundation-contract.md` | Architecture brief; foundation contract (§15 change requests, §18 owner decisions, §21 service API) | Internal; design authority | `982e105` |
| `internal/records/design/11`–`15-*.md` | Module designs: identity/web, catalogue/launch/public, core/operations, intake/documents/workers, payments/delivery/views/release | Internal | `982e105` |
| `internal/records/design/16`–`18-*.md` | M4 gap inventory, M5 plan, M6 plan | Internal | `982e105` |
| `internal/records/FINAL-REPORT.md` | Final report to owner: scope, assurance, decisions, open asks, P2 list (§6) | Internal; final | `982e105` |
| `internal/records/diary/2026-10-08-travelmudra-build-m1-to-m6-handover.md` | Build history M1–M6 | Internal | `982e105` |
| `internal/agent/project-instructions/` | Copies of the git-excluded `CLAUDE.md` = `AGENTS.md` | Internal | `982e105` |

## D. Source architecture map

Three instances, API only (mutual TLS): **core** (PostgreSQL, blobs, all business rules, background tasks),
**edge** (public site, TA portal, uploads, processing service), **staff** (Operations, SuperAdmin, Accounts).
edge and staff hold no business logic and no database credential.

| Directory | Responsibility |
|---|---|
| `src/kernel/` | Command runner, facts, tasks, ids, time, admission/releases, blobs; `vocabulary/` = closed enumerations |
| `src/modules/<m>/` | Domain modules `identity`, `catalogue`, `core`, `intake`, `documents`, `operations`, `payments`, `delivery`, `views`. Each exposes `api.ts`; owns one table prefix (`iam_`, `cat_`, `core_`, `intake_`, `doc_`, `ops_`, `pay_`, `dlv_`, `view_`; kernel `sys_`) |
| `src/contracts/` | Frozen service-API contracts and the closed error set (`errors.ts`) |
| `src/core-api/` | core's HTTP server, default-deny allowlists, per-module `bindings/` |
| `src/domain/` | Composition (`compose.ts` `composeDomain`), task loop (`task-loop.ts` `startTaskLoop`), admission |
| `src/apps/{edge,staff,shared}/` | Server-rendered pages and routes; `main.ts` per instance |
| `src/web/` | Shell, CSP, headers, route inventory, UI components (`ui/`) |
| `src/countries/` | Country adapter contract, registry, invocation; `synthetic/syn`, `synthetic/syx` packages |
| `src/workers/` | Sandboxed file workers (parse, PDF, image, OCR, MRZ, spreadsheet, fetch, SSRF guard) |
| `src/platform/` | Install, config, secrets, TLS, release/cutover/rollback, backup/restore, capacity, scanner, mail |
| `src/cli/` | `tm` CLI (`main.ts` `COMMANDS`; `commands/`; `seo/`) |
| `migrations/` | 26 SQL migrations `0001_kernel.sql` … `1050_kernel_instance_releases.sql` |
| `catalogue/synthetic/`, `content/public/` | Synthetic catalogue seed; public site content |
| `static/`, `deploy/systemd/`, `scripts/` | CSS/fonts/one script; unit templates; toolchain, dev gallery, `uat/uat.py` |
| `test/` | `kernel`, `identity`, `core`, `intake`, `operations`, `payments`, `delivery`, `views`, `countries`, `integration`, `system`, `ops-tooling`, `static`, `unit`, `ui`, `support` |

## E. Fast source-navigation guide

| Capability | Start here |
|---|---|
| Frontend and routing | `src/apps/edge/main.ts`, `src/apps/staff/main.ts`, `src/apps/shared/routes.ts`, `src/web/route-inventory.ts` |
| Backend / service API | `src/core-api/server.ts`, `src/core-api/allowlists.ts`, `src/core-api/bindings/*.ts`, `src/contracts/index.ts` |
| Command write model | `src/kernel/command.ts` (`runCommand`, `runContinuation`, `runReadOnly`) |
| Application lifecycle | `src/modules/core/` (`model.ts`, `controls.ts`, `corrections.ts`, `travel-recheck.ts`, `commands/`) |
| Intake (individual, bulk) | `src/modules/intake/` (`rows.ts`, `planning.ts`, `domain/`), `src/apps/shared/ta-intake.ts` |
| Country-specific logic | `src/countries/contract.ts`, `registry.ts`, `invoke.ts`; `src/modules/catalogue/capabilities.ts`; `docs/extending/new-country.md` |
| Provider / integration adapters | Country adapters above; mail port `src/platform/mail.ts` (synthetic only); scanner `src/platform/clamd.ts`; fetch `src/workers/fetch.ts`, `ssrf.ts` |
| Authentication and authorization | `src/modules/identity/` (`policy.ts`, `sessions.ts`, `totp.ts`, `botcheck.ts`), `src/apps/shared/identity-routes.ts`, `src/kernel/policy-port.ts` |
| Payments | `src/modules/payments/`, `src/apps/staff/payments/`, `src/apps/shared/ta-payments.ts` |
| Documents | `src/modules/documents/` (`safety.ts`, `extraction.ts`, `associations.ts`), `src/apps/edge/processing.ts`, `src/workers/` |
| Operations, delivery | `src/modules/operations/case-work/`; `src/modules/delivery/release.ts`, `retrieval.ts`, `packets.ts` |
| Catalogue and launch control | `src/modules/catalogue/` (`baseline.ts`, `impact.ts`, `preview.ts`), `src/modules/operations/launch/` |
| Persistence and migrations | `migrations/`, `src/kernel/db.ts`, `src/platform/migrations.ts`, `src/cli/commands/migrate.ts` |
| Background processing | `src/kernel/tasks.ts`, `task-queue.ts`, `src/domain/task-loop.ts`, module `tasks/` directories |
| Deployment and configuration | `src/platform/install.ts`, `config.ts`, `release-cutover.ts`, `release-rollback.ts`, `backup.ts`, `restore.ts`; `scripts/uat/uat.py` |
| Observability | `src/kernel/diag.ts`, `src/platform/diag-file.ts`, `src/web/health.ts`, `src/modules/views/health.ts`, `tm status` |
| Testing infrastructure | `test/support/global-setup.ts`, `test-cluster.ts`, `product.ts`, `stand-ins.ts` |

Search traps: `node_modules/` is ignored but large. `internal/` is a separate repository; search it separately.
`.claude/worktrees/` is ignored and empty at this snapshot. Line references in older internal records point at
earlier commits; re-check them at the frozen SHA.

## F. Build, run and test commands

From `package.json` (not executed for this index):

```bash
npm ci
npm run typecheck          # tsc -p tsconfig.json
npm run lint               # eslint --max-warnings=0 .
npm test                   # all tests; throwaway PostgreSQL cluster per run
npm run test:unit
npm run test:integration
npm run test:system        # three instances as separate processes
npm run test:ui
npm run check              # typecheck + lint + test
npm run tm -- <command>    # tm CLI
```

Install sequence: `README.md` "Commands"; `docs/operations.md` §1–2. Local installations: `scripts/uat/uat.py`
only (`scripts/uat/README.md`). Requirements: Node 24.19 (`.nvmrc`), PostgreSQL 16, ClamAV, Tesseract, qpdf, age,
`bwrap`, `prlimit`, user systemd.

Environment-variable names: `TM_CONFIG`, `TM_INSTANCES_DIR`, `TM_DATA_DIR`, `TM_SECRETS_DIR`, `TM_CA_DIR`,
`TM_TOOLCHAIN_DIR`, `TM_CLAMAV_DB_DIR`, `TM_TEST_CLAMD_SOCKET`, `TM_RELEASE_ID`, `TM_APP_ROOT`, `TM_NODE`,
`TM_SERVICE_CONFIG`, `TM_CORE_API_BIND`, `TM_DB`, `TM_ENV`, `TM_ENVS`, `TM_FAULTS`, `TM_CONTROLLED`,
`TM_TYPE_PARSERS`, `TM_UAT_HOME`, `TMPDIR` (test cluster root, at most 40 characters).

Last recorded outcomes (no CI exists; evidence is the orchestrator's local gate records in `internal/records/verification/`):

| Date | Commit | Result | Evidence |
|---|---|---|---|
| 2026-10-08 | `de77bfd` (tree = `7be21b1`) | typecheck and lint clean; 1846/1846 tests pass, 0 skipped, run three times | `2026-10-08-m6-final-assurance.md` |
| 2026-10-07 | `ba53149` (tree = `6360420`) | 1698/1698 | `2026-10-07-m5-release-recovery-verification.md` |
| 2026-10-04 … 07 | M1–M4 tags | 599, 981, 1421, 1566 pass | `2026-10-0[4-7]-m[1-4]-*.md` |

No test run is recorded at `102e4c9`. The changes since `7be21b1` touch no `src/`, `test/` or `migrations/` file.

## G. Previous review evidence

| Artifact | Reviewer | Scope / SHA | Date, status | Verified findings |
|---|---|---|---|---|
| `internal/records/reviews/2026-10-04-design-review-ledger.md` | Five independent lenses (coverage, money/state, security, recovery, boundary) under the Opus orchestrator | Design records 01, 11–15 at internal `4ea8ef6` | 2026-10-04, dispositioned | Findings table in the ledger; P1 items to `02-owner-decision-register.md` |
| `internal/records/verification/2026-10-0*-m[1-6]-*.md` (6 files) | Per-milestone multi-lens review, adversarial validators, independent fix check (Opus workers) | Each milestone tag | 2026-10-04 … 08, accepted | Findings, dispositions and parked P2 items in each record |
| `internal/records/reviews/2026-10-07-m6-findings.json` | M6 spec-coverage lenses | Candidate `6360420` vs B-rules | 2026-10-07; 34 findings (2 P0, 19 P1, 13 P2) | `findings[]` with file, line, rule refs; outcomes in the M6 record |
| `internal/records/reviews/2026-10-08-m6-ux-groups.json` | M6 UX review | M6 integration branch | 2026-10-08 | UX finding groups |
| `internal/records/reviews/2026-10-06-m3-review-telemetry-…md`, `…orchestration-retro-notes.md` | Orchestrator | Process telemetry, not code | 2026-10-06/07 | Not code findings |
| `internal/records/diary/2026-10-08-independent-architecture-and-ui-review.md` | Independent Codex session (Sol reviewers, Luna mapper) | Product `7be21b1`, then `7a29a3f`; internal `486f382` | 2026-10-08, complete | PDFs and evidence outside Git: `~/.codex/visualizations/2026/10/08/01a1197e-…/review-pdfs/` (manifest SHA-256 `2146713b…3f97`) |

Sign-off: `internal/records/FINAL-REPORT.md` (orchestrator, 2026-10-08, status final). Owner acceptance is recorded
only as the project instruction "tag `m6-final-assurance` is the accepted build" and Max's push of `main` and tags.

## H. Known gaps and scope boundaries

Documented (from `BUILD_SPEC.md`, `FINAL-REPORT.md` §5–6 and the M6 record):

- Scope: local test installation only; not production-ready. No country or service launched by default; only synthetic
  countries `syn`/`syx`. Mail is synthetic only. Student, diplomatic and work visas, historical imports and Tally are EXCLUDED (B02).
- Parked owner decisions, shown as visible "unavailable" states: who starts result delivery and the completion check;
  custody return policy for real declarations; finance items (bank-verified collection, reservation release, fee
  exclusion, write-off, refund).
- Public-release blockers: verified business location, contact details, privacy and terms pages, public country list.
- Production phase: real mail, reverse proxy, dedicated OS users per instance, public hostname, production host sizing.
- Parked P2 list: `FINAL-REPORT.md` §6 (withdrawal leaves application editable, IPv6 deny-list gap, rollback stops all
  instances, staging overshoot, capacity failures consume task attempts, wording polish).
- Traceability: 78 partial and 4 gap test ids (`T-C40`, `T-C44`, `T-14-I31`, `T-W13`) in `docs/verification/traceability.md`.
- Open P1 questions from the independent review: continuation uncertainty (Domain B), release version-history
  weakness for adapter capability digests (Domain C), and whether a declaration may select another country's adapter
  (synthetic `syn` → `syx.core`). The review also lists Send Result, completion request and uncertain-email behaviour
  as P1 adoption choices against the Astra UX baseline, not defects.

Newly suspected gaps: none raised; this task performed no review.

## I. Git tracking integrity

- Source, configuration, tests, migrations and public docs: tracked (895 files); product working tree clean.
- Specification, design, reviews, verification and final report: tracked in the private `internal/` repository; clean.
- EXTERNAL / NOT VERSIONED: the independent review PDFs and evidence under `~/.codex/visualizations/…` (hash-pinned in
  the diary only); `internal/agent/logs/` (ignored; conclusions are in the verification records); UAT state under
  `~/.local/share/travelmudra-*` (runtime state).
- IGNORED by design: `CLAUDE.md`/`AGENTS.md` (copies in `internal/agent/project-instructions/`), `.claude/`, `node_modules/`.
- This index: TRACKED in the private repository at `internal/records/dib1/REVIEWER_INDEX.md`. It names internal
  identifiers that the repository boundary forbids in the public-bound repository (`internal/agent/repo-boundary.json`),
  so the product repository holds no copy.
- Reviewer access: sections B, C, G and H depend on the private `internal/` repository.

Classification: **READY** for DIB-1 orientation on this machine. The index is versioned in the private repository. A reviewer who cannot
read `internal/` or `~/.codex/` sees only the public half of the evidence.

## J. Reviewer reading protocol

Read this index first. Use its references to navigate directly to the evidence required for the current DIB-1
question. Open original documentation or source files selectively, not by default. Validate claims at the frozen Git
SHA. Do not perform redundant repository-wide scans or re-run prior reviews. This index is navigation evidence, not
proof of implementation correctness.
