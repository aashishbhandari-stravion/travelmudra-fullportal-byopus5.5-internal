# TravelMudra design record 14 — Intake, Document Processing and restricted file workers

Owner: design phase (module design under the orchestrator). Date: 2026-10-04. Status: **revision 2** (consolidated after the 2026-10-04 design review; ledger `internal/records/reviews/2026-10-04-design-review-ledger.md`). Contract record 01 revision 2 governs; Section 8 carries each request's disposition; review fixes are marked "rev 2" with the finding id. The "until CCR-nn lands" interims of this record no longer apply to accepted requests.
Authority, in order: `internal/records/BUILD_SPEC.md` (B01–B47); architecture brief revision 2 (`design/00-architecture-brief.md`); `ENGINEERING_OVERRIDES.md` (EO-01…EO-07); environment inventory 2026-10-04; foundation contract `design/01-foundation-contract.md` (binding; cited as "contract §n").
Scope: Intake (B14, B16), Document Processing (B12 storage side, B15, document side of B13 inputs), restricted file workers (B36, B38 worker limits). This is an internal record. Product source, tests and commit messages MUST NOT copy rule IDs, record IDs (`I-xx`, `CCR-xx`, `T-xx`) or internal paths (brief §0).

## 0. Reading notes

### 0.1 Conventions used here

- `MUST`, `MUST NOT`, `SHOULD`, `MAY` are normative (contract §0.1).
- "Settled" (document version) means `processing_state ∈ {processed, manual_resolution_required, extraction_failed, safety_rejected, excluded_unrelated}` or `processing_state = safety_retry_wait AND check_exhausted = true`. Intake waits only on settled states.
- "Content-safe" means: size and format passed, clamd returned clean, and the sandboxed structural check passed. Only a content-safe version can become `canonical` and positively associated (CCR-02).
- "Active attempt states" = `{received, preflight, awaiting_answer, processing, paused_mapping_fault, paused_actor_revoked}`. Terminal = `{preflight_failed, fully_processed, abandoned}`.
- "Chain" = a root attempt plus every correction attempt that names it in `root_attempt_id`.
- Levels in the test plan: **U** unit (pure functions), **I** integration over a real persisted PostgreSQL 16 database (per-file database cloned from the migrated template, contract §10.1), **M** multi-process (real `tm-server` task runner, real `bwrap` workers, real `clamd`, separate client connections or processes).

### 0.2 Places where inputs conflict or are silent (named, not silently resolved)

| ID | Place | Treatment here |
|---|---|---|
| N-01 | The task text says tests run "over real persisted SQLite". Brief revision 2 and EO-01 replaced SQLite with PostgreSQL 16. | This record follows the brief: integration tests use real PostgreSQL. No SQLite path exists. |
| N-02 | Contract §6.9 `checkRelease` allows bytes of a version whose processing state is `safety_passed`. At `safety_passed` only clamd has run; the structural check (PDF active content, image decode) has not. A PDF with JavaScript passes clamd. | Releasing such bytes would release unchecked active content. CCR-02 replaces the condition with "content-safe and canonical". Until the contract is revised, Documents MUST NOT move a version to `canonical` before the structural check passes, so the existing `canonical` condition in `checkRelease` already blocks release. |
| N-03 | B14 names "a public folder" without a provider. The brief (§9) speaks of "public export/listing forms" and names only Google Sheet. | This build supports Google Drive public folders only. Other folder providers are a visible `validation_failed` / `folder_provider_unsupported` at start. Recorded as OD-I2. |
| N-04 | B12 requires positive application/type association before every byte send. Manual extraction resolution happens before association is positive. | No byte preview exists for a non-positive version. The person resolves from their own copy (the TA supplied the file). The page states this boundary. Not escalated: the rule is explicit. |
| N-05 | Contract §7.7 moves bytes to `canonical` only from `processed`. A version in `manual_resolution_required` or `extraction_failed` can be content-safe and later positive. | CCR-02: publish to canonical after the structural pass, independent of the extraction result. |
| N-06 | `prlimit --nproc` counts processes per real user id on many kernels; the service user also runs PostgreSQL and clamd. `prlimit --as` can stop V8 from reserving virtual memory. | **Resolved in rev 2 (BND-01), verified on this host 2026-10-04:** `prlimit --as=768MiB node` aborts at start; `prlimit --nproc=16` makes `bwrap` fail with EAGAIN. Contract 01 §10.3 rev 2 makes the user cgroup scope (`systemd-run --user --scope -p MemoryMax -p TasksMax`) the primary limit mechanism, removes `--as` and `--nproc` from the Node worker, keeps `prlimit --as` for spawned native tools, and sets the sandbox `LD_LIBRARY_PATH`/`TESSDATA_PREFIX` to the bound toolchain paths. The installed bubblewrap 0.9.0 supports `--size` (the earlier statement "needs ≥ 0.10" was wrong). CCR-13 accepted with this edit. |
| N-07 | The fetch worker shares the host network namespace (`--share-net`). Without root, no per-process egress firewall is available. | SSRF protection is in code: DNS classification, pinned connection addresses, connect-time socket check (`request-filtering-agent`), per-hop redirect checks. Database and clamd sockets are filesystem sockets that the fetch sandbox does not bind, so they are unreachable. Residual risk: abstract Unix sockets of the host remain reachable in a shared network namespace; no TravelMudra component listens on one. Recorded here; not a spec conflict. |

## 1. Responsibilities

### 1.1 This record owns

| Area | Responsibility | Rules |
|---|---|---|
| Intake attempts | Create attempts for an existing one-country group from an individual form, a public Google Sheet, an uploaded Excel/CSV file, or a public folder with or without a consolidated sheet. Hold one catalogue snapshot (one applicable baseline per offering) per attempt. | B14, B16, B06 |
| Preflight | Fetch, quarantine, check and read batch prerequisites before any application mutation. Unsafe or unreadable prerequisites end the attempt as `preflight_failed`. | B14, B36 |
| Mapping | Detect header rows, map irregular columns to canonical intake fields and declared requirement types, map service labels to offerings, detect date order, decide the row pattern. Ask the TA only about consequential ambiguity. Detect systematic mapping faults and pause affected rows. | B14 |
| Rows | Store rows, compute per-row proposals, call Core acceptance once per row in one transaction, record per-row and per-service results, keep accepted rows when other rows fail. | B14, B16, B03 |
| Corrections and retries | Correction attempts linked to the root; explicit matching; only changed or failed matched scope is touched; omitted rows untouched; new applicants routed to separate intake; Nth identical retry resolves to recorded effects. | B16, B35 |
| Intake incidents | Open, own and dispose incidents for ambiguous applicant, document, group, service, duplicate, identity conflict and mapping fault. No disposition cancels an application. | B16, B25 |
| Document versions | Register immutable, group-scoped private versions with integrity evidence (SHA-256, size) separate from association. | B12, B03 |
| Safety | Format, size, malware scan (clamd, fail closed) before any content read; sandboxed structural checks. | B15, B36 |
| Extraction | Local extraction only: `pdftotext`, `pdftoppm` + Tesseract, sharp + Tesseract, MRZ parsing with check digits; confidence thresholds route to manual resolution. | B15, EO-04 |
| Classification and association | Applicant-document classification, association proposals and decisions, identity matching against the applicant snapshot, offering format narrowing, documents about another person. | B15, contract C-03 |
| Requirement evidence | Per-application, per-declared-requirement status (mandatory/optional, validity, conflicts), and the evidence fingerprint used by readiness. | B15, B18, B19 |
| Disposal | Decide safe disposal of rejected and unrelated bytes; never of evidence that is referenced or canonical. | B15, B36, B42 |
| Worker job contracts | Request/response schemas of every fetch and parse job (`tm-worker/1`), extraction contract `extract/1`, SSRF rules of the fetch job, limits per job. | B36, B38, B39 |

### 1.2 Explicit non-responsibilities (other owners)

| Concern | Owner | Interface used here |
|---|---|---|
| Creating applications, drafts, applicant snapshots, duplicate-scope guard, identity-field correction rule, submission | Core | `core.acceptIntakeProposal(s)`, `core.applyIntakeCorrection` (CCR-06), `core.noteEvidenceChanged`, `core.evaluateControls` |
| Offering declarations (requirement types, mandatory flags, formats, size, validity checks), baselines, bindings, impact | Catalogue | `catalogue.snapshotForIntake`, `getDeclaration`, `currentGoverning`, `noteGoverningBehindHead` (called by Core; rev 2: record 14 CCR-08 `attachLateApplication` rejected in its favour) |
| Launch admission per action | Operations (`launchDecision`) through Core's evaluator | `evaluateControls({action:'start_intake'|'create_draft'})` |
| Official result artifacts, artifact association and eligibility (B13), operational incidents (`bytes_integrity`, `country_defect`), failure classification | Operations | `operations.openIncident` |
| Byte release, retrieval routes, bulk selection, document email | TA Delivery | `delivery.checkRelease` calls `documents.getVersionForRelease` |
| Sessions, CSRF, CAPTCHA verification, rate-limit store | Identity & platform | `identity.consumeBotCheck` (rev 2, record 11 CCR-03; sole writer of `iam_captcha_spent`), `identity.rateLimit.consume` (CCR-10) |
| Blob files, moves, staging cleanup, work-directory sweep, task leasing | Kernel/platform | `BlobStore`, `blob.*` tasks, `WorkerRunner`, `Scanner` |
| Projections, measures (B32 row-level intake yield) | Derived Views | Facts `intake.row_result_recorded` (Section 3.6) |
| Payment status creation for new applications | Payment Records, called by Core | none directly |

Intake never submits, assigns, files, records payment, sends notices or emails, or changes lifecycle/outcome (B14, B17, B21). Document Processing never decides official-result association (B13, C-03), never releases bytes, and never uses hosted OCR/LLM or any third-party processor (B15, B42).

## 2. Tables owned

All tables follow contract §3.1 conventions: ids are `text` with the prefix CHECK, FKs `ON DELETE RESTRICT`, times from the injected clock, no `DEFAULT now()`, closed-set CHECKs, `revision bigint NOT NULL DEFAULT 1` on mutable aggregates, immutable identity columns protected by `tm_forbid_column_change`. Columns marked **PD** hold personal data: they never enter task payloads, operation summaries, diagnostics or file names (contract §3.1). Additive columns beyond the contract's key-column lists are module detail; new closed-set values and states are requested in Section 8.

### 2.1 Module-local closed sets (`src/modules/intake/vocabulary.ts`, `src/modules/documents/vocabulary.ts`)

```ts
// intake (additions requested in CCR-11 where they extend contract sets)
export const INTAKE_SOURCE_ROLES = ['sheet','folder_listing','document'] as const;
export const INTAKE_SOURCE_FILE_STATES = ['pending','quarantined','checked','rejected','unreadable','excluded_unrelated','not_fetched_unreferenced'] as const;
export const FETCH_URL_KINDS = ['google_sheet_export','google_sheet_published','google_drive_file','google_doc_export','google_drive_folder','direct_https','upload'] as const;
export const ROW_SERVICE_OUTCOMES = ['created','matched_existing','resolved_prior_effect','refused','incident','omitted_existing_untouched','corrected','correction_refused'] as const;
export const CORRECTION_CLASSES = ['unchanged','changed','failed_retry','new_applicant','unmatched'] as const;
export const MATCH_BASES = ['applicant_key','locator_confirmed'] as const;
export const QUESTION_KINDS = ['select_tab','select_sheet_file','header_row','column_mapping','service_label','date_order','row_pattern_mixed','systematic_fault','correction_match_confirm'] as const;
export const APPLICANT_KEY_SOURCES = ['form','sheet','mrz','manual_resolution'] as const;
export const DATE_ORDERS = ['dmy','mdy','ymd'] as const;
// documents
export const DOC_PURPOSES = ['evidence','intake_source','official_result'] as const;
export const CLASSIFICATION_BASES = ['none','ta_upload_field','column_mapping','mrz_detected','filename_proposal','ta_confirmed','operator_confirmed','artifact_upload'] as const;
export const CLASSIFICATION_STATES = ['unclassified','proposed','confirmed'] as const;
export const EXTRACTION_PLANS = ['none','mrz','mrz_probe','artifact_tokens'] as const;
export const SAFETY_STAGES = ['scan','structural'] as const;
export const VALIDITY_CHECK_KINDS = ['passport_valid_through_return_plus_months','passport_document_code_in','passport_issuing_state_in','image_min_pixels','image_aspect_ratio','pdf_max_pages','country_adapter_check'] as const;
```

### 2.2 `intake_attempts`

| Column | Type | Null | Meaning |
|---|---|---|---|
| `attempt_id` | text | no | PK `ina_` |
| `group_id` | text | no | FK `core_groups`; immutable |
| `ta_account_id` | text | no | FK; copied from the group; immutable |
| `country_id` | text | no | FK `cat_countries`; copied from the group; immutable |
| `source_kind` | text | no | contract `INTAKE_SOURCE_KINDS` |
| `base_source_kind` | text | no | for `correction_upload`: the root's kind; otherwise equals `source_kind` |
| `source_locator` | text | yes | **PD**. Supplied URL or sanitized upload display name (≤ 200 chars) |
| `source_locator_digest` | bytea | yes | SHA-256 over the canonical source identity: provider + resource id for Google sources, file SHA-256 for uploads. NULL for `individual_form` |
| `companion_sheet_locator` | text | yes | **PD**. Separately supplied sheet for a folder source |
| `state` | text | no | contract `INTAKE_ATTEMPT_STATES` |
| `state_code` | text | yes | reason code of the last state change (closed set) |
| `root_attempt_id` | text | no | FK self; equals `attempt_id` for a root |
| `corrects_attempt_id` | text | yes | FK self; the attempt this correction follows |
| `chain_no` | integer | no | 1 for the root; +1 per correction |
| `generation` | integer | no | starts 1; +1 on every pause, resume or re-plan; task dedupe keys carry it |
| `active_slot` | smallint | yes | per-TA concurrency slot `1…intake.concurrentAttemptsPerTa`; NULL for individual forms and terminal attempts |
| `has_rows` | boolean | no | true once rows are stored |
| `named_offering_ids` | jsonb | no | offering ids the TA named at start (individual form; folder without sheet); `[]` otherwise |
| `catalogue_snapshot` | jsonb | no | `{ [offeringId]: { declarationId, baselineId, bindingId, launchEffectAtStart } }` from `catalogue.snapshotForIntake` (contract §9.3) |
| `release_id` | text | no | FK `sys_releases` |
| `worker_contract` | text | no | `tm-worker/1` |
| `extractor_contract` | text | no | `extract/1` |
| `field_dictionary` | text | no | `intake-fields/1` (Section 3.2.3) |
| `row_pattern` | text | no | contract `ROW_PATTERNS`; default `undetermined` |
| `selected_tab` | text | yes | **PD** (tab names are user text) |
| `header_row_no` | integer | yes | 1-based row number of the header |
| `date_order` | text | yes | `DATE_ORDERS` |
| `mapping_plan` | jsonb | no | `{ columns: [{ index, headerDigest, field|requirementType|null, basis: 'exact'|'answered'|'ignored', consequential }], serviceLabels: [{ labelDigest, offeringId|null, basis }] }` |
| `fault_counters` | jsonb | no | per mapping element `{ processed, failed, code }` (Section 3.2.6) |
| `rows_total`, `rows_terminal`, `rows_accepted`, `rows_incident`, `rows_failed` | integer | no | counters maintained under the attempt row lock |
| `files_total` | integer | no | |
| `files_bytes` | bigint | no | aggregate fetched/uploaded bytes |
| `captcha_verified` | boolean | no | true for bulk starts (B08) |
| `created_by` | text | no | FK account (the TA) |
| `created_at` | timestamptz | no | |
| `terminal_at` | timestamptz | yes | |
| `revision` | bigint | no | |

Guards:
- `CHECK ((attempt_id = root_attempt_id) = (corrects_attempt_id IS NULL))`; `CHECK (source_kind <> 'correction_upload' OR corrects_attempt_id IS NOT NULL)`.
- `intake_attempts_chain_active_uq`: `UNIQUE (root_attempt_id) WHERE state IN (active states)` — one active attempt per chain (competing corrections).
- `intake_attempts_ta_slot_uq`: `UNIQUE (ta_account_id, active_slot) WHERE active_slot IS NOT NULL` — per-TA bulk concurrency cap without relying on predicate locks.
- `intake_attempts_source_rows_uq`: `UNIQUE (group_id, source_locator_digest) WHERE corrects_attempt_id IS NULL AND has_rows AND source_locator_digest IS NOT NULL` — one root per source and group once rows exist (same source again ⇒ correction).
- Immutable columns: `group_id`, `ta_account_id`, `country_id`, `root_attempt_id`, `corrects_attempt_id`, `source_kind`, `catalogue_snapshot`, `release_id`.
- Indexes: `(group_id, state)`, `(ta_account_id, created_at)`.

### 2.3 `intake_source_files`

| Column | Type | Null | Meaning |
|---|---|---|---|
| `source_file_id` | text | no | PK `isf_` |
| `attempt_id` | text | no | FK |
| `root_attempt_id` | text | no | FK |
| `role` | text | no | `INTAKE_SOURCE_ROLES` |
| `locator` | text | no | **PD**. URL, folder path or file name |
| `locator_digest` | bytea | no | SHA-256 of the normalized locator |
| `fetch_url_kind` | text | no | `FETCH_URL_KINDS` |
| `parent_source_file_id` | text | yes | FK self (folder listing) |
| `state` | text | no | `INTAKE_SOURCE_FILE_STATES` |
| `failure_code` | text | yes | closed reason code (Section 8, CCR-11) |
| `blob_id` | text | yes | FK `sys_blobs` |
| `document_version_id` | text | yes | FK `doc_versions` |
| `size_bytes` | bigint | yes | |
| `sha256` | bytea | yes | integrity evidence copy for result display |
| `fetch_attempts` | integer | no | |
| `created_at` | timestamptz | no | |
| `revision` | bigint | no | |

Guards: `UNIQUE (blob_id)`; `intake_source_files_locator_uq UNIQUE (attempt_id, role, locator_digest)` (a link used in two rows of one attempt is fetched once; concurrent fetch records converge on one row).

### 2.4 `intake_rows`

| Column | Type | Null | Meaning |
|---|---|---|---|
| `row_id` | text | no | PK `inr_` |
| `attempt_id` | text | no | FK |
| `source_locator` | text | no | **PD** for folder paths. `<tab>!R<n>`, `folder:<path>`, `flat:<file ordinal>` or `form` |
| `locator_digest` | bytea | no | |
| `row_no` | integer | no | source order |
| `state` | text | no | contract `INTAKE_ROW_STATES` + `routed_to_new_intake` (CCR-11) |
| `state_code` | text | yes | closed reason code |
| `wait_reason` | text | yes | `files_settling`, `identity_from_document`, `question_open`, `paused`, NULL |
| `raw_cells` | jsonb | no | **PD**. Bounded cell array as returned by the parse worker |
| `raw_digest` | bytea | no | SHA-256 of canonical `raw_cells` |
| `mapped` | jsonb | yes | **PD**. Normalized canonical fields after mapping |
| `mapped_digest` | bytea | yes | SHA-256 of canonical `mapped` |
| `applicant_key` | text | yes | **PD**. Contract §1.1 format |
| `applicant_key_source` | text | yes | `APPLICANT_KEY_SOURCES` |
| `service_offering_ids` | jsonb | no | offering ids requested by the row |
| `matched_original_row_id` | text | yes | FK self; correction match target |
| `match_basis` | text | yes | `MATCH_BASES` |
| `correction_class` | text | yes | `CORRECTION_CLASSES` |
| `result` | jsonb | no | closed codes and ids only; default `{}` |
| `generation` | integer | no | attempt generation that last processed the row |
| `created_at` | timestamptz | no | |
| `revision` | bigint | no | |

Guards: `UNIQUE (attempt_id, source_locator)`; index `(attempt_id, state)`; index `(attempt_id, applicant_key)`.

### 2.5 `intake_row_files`

| Column | Type | Null | Meaning |
|---|---|---|---|
| `row_id` | text | no | FK; PK part |
| `source_file_id` | text | no | FK; PK part |
| `requirement_type` | text | yes | declared requirement type from the column mapping or folder classification; NULL = unknown |

PK `(row_id, source_file_id)`.

### 2.6 `intake_row_services`

| Column | Type | Null | Meaning |
|---|---|---|---|
| `row_id` | text | no | PK part |
| `offering_id` | text | no | PK part; FK |
| `outcome` | text | no | `ROW_SERVICE_OUTCOMES` |
| `code` | text | yes | closed reason code (for `refused`, `incident`, `correction_refused`) |
| `application_id` | text | yes | FK `core_applications` when created, matched or corrected |
| `recorded_at` | timestamptz | no | |

### 2.7 `intake_row_effects` (Nth-retry guard; contract §3.6)

| Column | Type | Null | Meaning |
|---|---|---|---|
| `root_attempt_id` | text | no | PK part |
| `source_locator` | text | no | PK part; locator of the **original** row in the chain (correction rows use their match target's locator) |
| `offering_id` | text | no | PK part |
| `application_id` | text | no | FK |
| `effect` | text | no | `created`, `matched_existing` |
| `first_row_id` | text | no | FK `intake_rows` |
| `last_row_id` | text | no | FK; the latest row that resolved to this effect |
| `applicant_key` | text | no | **PD** |
| `applied_snapshot_version_no` | integer | yes | Core snapshot version created or last corrected by this chain; NULL for `matched_existing` |
| `created_at` | timestamptz | no | |
| `revision` | bigint | no | |

### 2.8 `intake_questions`

| Column | Type | Null | Meaning |
|---|---|---|---|
| `question_id` | text | no | PK `inq_` |
| `attempt_id` | text | no | FK |
| `kind` | text | no | `QUESTION_KINDS` |
| `subject_key` | text | no | stable discriminator (for example `column:7`, `label:<digest>`) |
| `payload` | jsonb | no | **PD** (sample cells shown to the owning TA only). Options are closed: `{ options: [{ code, ref }], samples: [...≤5], consequence: fieldCodes[] }` |
| `state` | text | no | `open`, `answered`, `withdrawn` |
| `answer` | jsonb | yes | one option code + its ref |
| `answered_by` | text | yes | FK account |
| `answered_at` | timestamptz | yes | |
| `generation` | integer | no | attempt generation when opened |
| `revision` | bigint | no | |

Guard: `UNIQUE (attempt_id, kind, subject_key) WHERE state = 'open'`.

### 2.9 `intake_incidents`

| Column | Type | Null | Meaning |
|---|---|---|---|
| `incident_id` | text | no | PK `ini_` |
| `attempt_id` | text | no | FK; attempt that opened it |
| `root_attempt_id` | text | no | FK |
| `group_id` | text | no | FK; scope (group closure check) |
| `ta_account_id` | text | no | FK; scope |
| `row_id` | text | yes | FK |
| `offering_id` | text | yes | FK |
| `kind` | text | no | contract `INTAKE_INCIDENT_KINDS` |
| `state` | text | no | contract `INTAKE_INCIDENT_STATES` |
| `owner_kind` | text | no | `ta`, `superadmin` |
| `owner_account_id` | text | yes | the TA for `ta`; NULL for the SuperAdmin queue |
| `related_application_ids` | jsonb | no | ids only |
| `related_version_ids` | jsonb | no | ids only |
| `details` | jsonb | no | closed codes; candidate row ids; never names or numbers |
| `dedupe_key` | text | no | `<kind>:<root>:<row locator digest hex>:<offering|->:<version|->` |
| `opened_at` | timestamptz | no | |
| `disposed_by` | text | yes | FK account |
| `disposed_by_attempt_id` | text | yes | FK (correction that resolved it) |
| `disposition_reason` | text | yes | required for SuperAdmin dismissal (≥ 10 chars) |
| `disposed_at` | timestamptz | yes | |
| `revision` | bigint | no | |

Guards: `UNIQUE (dedupe_key)`; index `(group_id) WHERE state = 'open'`; `CHECK (state = 'open' OR disposed_at IS NOT NULL)`; `CHECK (state <> 'dismissed_by_superadmin' OR length(disposition_reason) >= 10)`.

### 2.10 `doc_versions`

| Column | Type | Null | Meaning |
|---|---|---|---|
| `version_id` | text | no | PK `dov_` |
| `group_id` | text | no | FK; scope; immutable |
| `ta_account_id` | text | no | FK; scope; immutable |
| `purpose` | text | no | `DOC_PURPOSES` (CCR-01); immutable |
| `source` | text | no | contract `DOC_SOURCES` |
| `uploaded_by` | text | yes | FK account; NULL when fetched by an intake task |
| `intake_attempt_id` | text | yes | FK |
| `intake_source_file_id` | text | yes | FK |
| `blob_id` | text | no | FK `sys_blobs`; immutable |
| `sha256` | bytea | no | integrity evidence; immutable |
| `size_bytes` | bigint | no | immutable |
| `declared_media_type` | text | yes | from upload part or HTTP header; never trusted |
| `detected_media_type` | text | yes | magic-number result |
| `display_name` | text | yes | **PD**. Sanitized (NFC, no control chars, ≤ 120 chars); nulled at disposal |
| `page_count` | integer | yes | PDF |
| `image_width`, `image_height` | integer | yes | image |
| `declared_requirement_type` | text | yes | hint from upload field or column mapping |
| `extraction_plan` | text | no | `EXTRACTION_PLANS` |
| `processing_state` | text | no | contract `DOC_PROCESSING_STATES` |
| `check_exhausted` | boolean | no | safety or parse task ended terminally without a verdict |
| `content_safe` | boolean | no | structural check passed (CCR-02) |
| `bytes_state` | text | no | contract `DOC_BYTES_STATES` |
| `currency` | text | no | contract `DOC_CURRENCY` |
| `replaces_version_id` | text | yes | FK self |
| `classified_type` | text | yes | declared requirement type code, `passport`, `unrelated`, or NULL |
| `classification_basis` | text | no | `CLASSIFICATION_BASES` |
| `classification_state` | text | no | `CLASSIFICATION_STATES` |
| `current_extraction_verdict_id` | text | yes | FK |
| `failure_code` | text | yes | closed code of the last worker/scanner failure (scoped failure retention, B36) |
| `exclusion_reason` | text | yes | `unrelated_not_referenced`, `classified_unrelated_by_ta`, `classified_unrelated_by_operator` |
| `blocked_incident_id` | text | yes | FK `ops_incidents` |
| `created_at` | timestamptz | no | |
| `revision` | bigint | no | |

Guards: `UNIQUE (blob_id)`; immutable trigger on `group_id`, `ta_account_id`, `purpose`, `blob_id`, `sha256`, `size_bytes`; `CHECK (content_safe = false OR processing_state IN ('extracting','processed','manual_resolution_required','extraction_failed','excluded_unrelated'))`; `CHECK (bytes_state <> 'canonical' OR content_safe)`; `CHECK (purpose <> 'intake_source' OR classified_type IS NULL)`. There is **no** index or uniqueness on `sha256`: equal content in two scopes or two versions grants nothing (B12, T-D14). Index `(group_id, processing_state)`, `(intake_attempt_id)`.

### 2.11 `doc_safety_verdicts`

| Column | Type | Null | Meaning |
|---|---|---|---|
| `verdict_id` | text | no | PK `dsv_` |
| `version_id` | text | no | FK |
| `attempt_no` | integer | no | increases across both stages for one version |
| `stage` | text | no | `SAFETY_STAGES` |
| `verdict` | text | no | contract `SAFETY_VERDICTS` |
| `checks` | jsonb | no | `{ sizeOk, detected, declaredMismatch, clamd: 'ok'|'found'|'unavailable', qpdf: 'ok'|'warnings'|'errors', encrypted, activeContent: [keys], decodeOk, pixels, zipEntries, zipRatio }` — no signature names beyond a closed code, no content |
| `scanner_db_version` | text | yes | clamd `VERSION` string (non-personal) |
| `worker_exit` | jsonb | yes | `{ exitCode, signal, limitName, durationMs }` |
| `decided_at` | timestamptz | no | |

Guard: `UNIQUE (version_id, attempt_no)`. Append-only by writer convention.

### 2.12 `doc_extraction_verdicts`

| Column | Type | Null | Meaning |
|---|---|---|---|
| `verdict_id` | text | no | PK `dxv_` |
| `version_id` | text | no | FK |
| `extractor_contract` | text | no | `extract/1` |
| `method` | text | no | `pdf_text`, `pdf_ocr`, `image_ocr`, `manual`, `none` |
| `status` | text | no | contract `EXTRACTION_STATUSES` |
| `status_code` | text | yes | `mrz_not_found`, `mrz_check_digit_failed`, `mrz_low_confidence`, `extraction_tool_failed`, … |
| `fields` | jsonb | no | **PD**. MRZ field set (Section 5.6) or `{ passportNumberCandidates, tokens }` for official results; `{}` otherwise. Full page text is never stored. |
| `confidences` | jsonb | no | integer 0–100 per MRZ line and mean |
| `check_digits` | jsonb | no | per field boolean |
| `autocorrections` | integer | no | count |
| `resolution_kind` | text | no | `automatic`, `manual_ta`, `manual_operator` |
| `resolved_by` | text | yes | FK account |
| `attestation` | boolean | no | manual resolver confirmed reading the document |
| `supersedes_verdict_id` | text | yes | FK self |
| `is_current` | boolean | no | |
| `decided_at` | timestamptz | no | |

Guard: `UNIQUE (version_id) WHERE is_current` (contract §3.7). A new current verdict clears the previous flag in the same transaction.

### 2.13 `doc_associations`

| Column | Type | Null | Meaning |
|---|---|---|---|
| `association_id` | text | no | PK `das_` |
| `version_id` | text | no | FK |
| `application_id` | text | no | FK |
| `requirement_type` | text | no | declared by the application's governing declaration |
| `identity_role` | boolean | no | true when the requirement is the applicant identity document |
| `subject` | text | no | `applicant`, `other_person` (from the declaration) |
| `status` | text | no | contract `ASSOCIATION_STATUSES` |
| `status_code` | text | yes | closed code (`strong_identifier_conflict`, `name_mismatch`, `format_not_accepted_by_offering`, `extraction_manual_resolution_required`, `classification_unconfirmed`, `replaced`, …) |
| `basis` | text | no | contract basis set |
| `proposed_by_row_id` | text | yes | FK `intake_rows` |
| `replaces_association_id` | text | yes | FK self |
| `decided_by` | text | yes | FK account; NULL for automatic |
| `decided_at` | timestamptz | yes | |
| `checks` | jsonb | no | `{ keyMatch, nameMatch, dobMatch, formatOk, sizeOk, identityProvenance }` — booleans and codes only |
| `evidence` | jsonb | no | `EvidenceRef[]` (extraction verdict id, safety verdict ids) |
| `created_at` | timestamptz | no | |
| `revision` | bigint | no | |

Guards: `UNIQUE (version_id, application_id, requirement_type) WHERE status IN ('proposed','positive')` (contract); `doc_associations_identity_uq UNIQUE (application_id) WHERE identity_role AND status = 'positive'`; the writer refuses an application whose group differs from the version's group and any version whose `purpose <> 'evidence'`.

Validity results are **not stored**: they are a pure function of the current extraction verdict, the governing declaration and the group's travel dates, recomputed on every read (Section 3.4.6). The association fact records the result seen at decision time.

## 3. Commands, acceptance steps and algorithms

### 3.0 Rules common to every command and task record step here

| Topic | Rule |
|---|---|
| Runner | Every command runs through `runCommand` (contract §4.2). Every task record step runs in one SERIALIZABLE transaction (contract §4.6). No handler performs a network call, worker call, file move or mail send. |
| Lock order | `sys_installation` (share) → actor `iam_accounts` (share) → `cat_offerings` (ascending id, share) → `ops_offering_controls` (share) → `core_groups` → `core_applications` (ascending id) → `pay_application_state` → `doc_versions` (ascending id) → `sys_blobs` → `intake_attempts` → `intake_rows` → other intake rows. Intake rows are locked **after** Core rows, so a row transaction reads the attempt first without a lock and re-checks it under lock at the end (Section 3.6.1 step 7). A Documents record step that will change associations first reads the version's associations without a lock, then locks the affected applications through `core.lockApplication(tx, id, 'update')` in ascending id, then the version row; this keeps the global order. Residual deadlocks are retried by the runner (40P01). |
| Uploads | Upload routes stream file parts into staging blobs **before** `runCommand` (contract §4.12): session, CSRF, origin, rate limit and storage admission are checked first; `_csrf` and `_op` MUST arrive before the first file part, otherwise the request is refused with 400 and no blob intent is created. `@fastify/multipart` limits per route: individual form `fileSize` = 5 MiB + 1 byte (overflow ⇒ `validation_failed`/`document_too_large`), `files` ≤ 12, `fields` ≤ 60, `fieldSize` ≤ 4 KiB; Excel/CSV upload `fileSize` = `upload.spreadsheetMaxBytes` + 1, `files` = 1. |
| Content hash | Upload commands define `canonical(input)` with each file as `{ field, sha256, sizeBytes, declaredType }` and **without** blob ids. Same key + same files replays; the second request's staged blobs stay unreferenced and are removed by staging cleanup. Same key + different file ⇒ `conflict_operation_key`. |
| Revisions | Every form carries `_rev` for each aggregate shown (attempt, question, version, association). Stale ⇒ `stale_revision`. |
| Facts | Every acceptance appends at least one fact (contract T-F07). Facts carry ids and closed codes; personal data appears only in `before`/`after` where the field changed. |
| Authorization | Every command calls `policy.authorize` for every touched resource (contract §5). Intake objects resolve through `relations.intakeAttempt` and `relations.intakeIncident` (CCR-10). A foreign or missing object ⇒ `not_found_or_forbidden`. |
| Tasks on behalf of a TA | Intake tasks carry `onBehalfOf = ta_account_id`, `onBehalfAction = 'intake.read'` on `{type:'intake_attempt'}`; prepare re-checks account `active` and ownership (B10, B35). Document tasks are system tasks without `onBehalfOf`; they create no application effect. |

### 3.1 End-to-end flows

| Source | Steps (task names; "→" is an enqueue in the same commit) |
|---|---|
| Individual form | Route stages files → `intake.start_individual` commits attempt (`processing`), one row, source files, document versions (`doc.scan` each), Core drafts (one per service) with `proposed` associations → `doc.scan` → `doc.parse` → association decisions → settled listener → `intake.process_rows` (finalize) → `fully_processed`. |
| Public Google Sheet | `intake.start_bulk` (`received`) → `intake.fetch_source` (xlsx export) → version `intake_source` → `doc.scan` → `doc.parse` (`inspect_spreadsheet`) → settled listener → `intake.preflight` → `intake.parse_sheet` (store rows, plan, questions or `processing`) → per row `intake.fetch_row_files` and/or `intake.process_rows` → per-row acceptance → finalize. |
| Uploaded Excel/CSV | Route stages the file → `intake.start_bulk` registers the source version (`preflight`) → same as above from `doc.scan`. |
| Public folder with consolidated sheet | `intake.fetch_source` (folder listing) → scan → `intake.preflight` → `intake.parse_sheet` (listing; sheet candidates ⇒ `select_sheet_file` question unless the TA supplied the sheet) → `intake.fetch_source` (sheet) → scan/inspect → `intake.parse_sheet` (rows) → as Google Sheet, with filename columns resolved against listing entries. |
| Public folder without sheet | Listing as above → rows = applicant subfolders (or passport files in a flat folder) → `intake.fetch_row_files` per row → passport MRZ probe → `intake.process_rows` once identity is known; services = `named_offering_ids`. |
| Correction | `intake.correction_upload` (`received`/`preflight`) → same preflight and parse → `intake.parse_sheet` computes the correction plan (Section 3.2.8) → `correction_match_confirm` question when needed → per matched row `intake.process_rows` in correction mode. |

### 3.2 Intake algorithms (pure where marked; used by task record steps)

#### 3.2.1 Source URL classification (pure, `classifySourceUrl`)

| Input form (after WHATWG URL parse; `https:` only; no userinfo; default port) | Kind | Fetch URL |
|---|---|---|
| `docs.google.com/spreadsheets/d/<id>/…` (optional `gid`) | `google_sheet_export` | `https://docs.google.com/spreadsheets/d/<id>/export?format=xlsx` |
| `docs.google.com/spreadsheets/d/e/<pubId>/pub…` | `google_sheet_published` | `https://docs.google.com/spreadsheets/d/e/<pubId>/pub?output=xlsx` |
| `drive.google.com/drive/folders/<id>`, `drive.google.com/drive/u/<n>/folders/<id>` | `google_drive_folder` | `https://drive.google.com/embeddedfolderview?id=<id>` |
| `drive.google.com/file/d/<id>/…`, `drive.google.com/open?id=<id>`, `drive.google.com/uc?id=<id>` | `google_drive_file` | `https://drive.usercontent.google.com/download?id=<id>&export=download` |
| `docs.google.com/document/d/<id>/…` | `google_doc_export` | `https://docs.google.com/document/d/<id>/export?format=pdf` |
| any other `https://` URL (row links only) | `direct_https` | unchanged |

Ids MUST match `^[A-Za-z0-9_-]{10,200}$`. A bulk source URL of another form ⇒ `validation_failed` / `source_url_unsupported`; a folder URL of another provider ⇒ `validation_failed` / `folder_provider_unsupported` (N-03). These provider endpoints can change; a change surfaces as a visible fetch or listing failure, never as a guessed result. `source_locator_digest` = SHA-256 of `"<kind>:<id>"` for Google sources, of the file bytes for uploads.

#### 3.2.2 Header detection (pure)

1. Consider the first `intake.headerScanRows` (20) non-empty rows of the selected tab.
2. Score each row: number of cells whose normalized text (NFKC, lower case, diacritics removed, punctuation and whitespace removed) equals a synonym in `intake-fields/1` or a declared requirement-type label of an offering in the snapshot.
3. The header is the first row with score ≥ 3 that includes at least one identity field (`passport_number`, `surname`, `given_names`, `full_name`) or a document column.
4. No row qualifies, or two rows tie with score ≥ 3 ⇒ question `header_row` (options: candidate row numbers, `no_header`). `no_header` ⇒ `preflight_failed` / `header_not_found` (a headerless sheet cannot be mapped without guessing).
5. Rows above the header are ignored. Blank rows are skipped and never become intake rows. Merged header cells repeat their text over the merged span.

#### 3.2.3 Canonical intake fields (`intake-fields/1`)

| Field | Consequential | Normalization / validation |
|---|---|---|
| `passport_number` | yes | upper case; remove spaces, `-`, `.`; for issuing state `IND`: `^[A-Z][0-9]{7}$` (synthetic fixtures use the same shape) |
| `passport_issuing_country` | yes | ISO alpha-3 or a closed name table → alpha-3; absent ⇒ the key waits for the issuing state of the row's passport MRZ; no default country is assumed |
| `surname`, `given_names` | yes | NFC; letters, space, `'`, `-`; ≤ 60 chars each |
| `full_name` | yes | used only when surname/given names are absent; never split by guessing; stored as `full_name`; surname/given names stay missing unless the passport MRZ supplies them |
| `date_of_birth`, `passport_expiry_date` | yes | Excel serial (honouring the workbook `date1904` flag) or text in the attempt `date_order`; must be a real calendar date |
| `nationality` | yes | alpha-3 |
| `sex` | no | `M`, `F`, `X` |
| `resident_in_india` | yes | closed truthy/falsy sets (`yes/y/true/1/✓` vs `no/n/false/0`); other values ⇒ missing |
| `services` (one column with a list) / one column per service | yes | separators `, ; / | + &` and the word `and`; per-service columns use the closed truthy set |
| `destination_country` | yes | compared with the group's country; mismatch ⇒ `ambiguous_group` incident |
| document columns (one per declared requirement type) | yes | cell hyperlink target (`cell.l.Target`) or cell text when it is an `https://` URL; in folder mode, an exact file name |
| `applicant_phone`, `applicant_email`, `notes` | no | stored in `mapped`; no question when ambiguous; unmapped ⇒ listed as ignored |

Any column not mapped is listed on the attempt page as "ignored" with its header text. Columns that describe application status, filing state or payments are ignored like any other unmapped column: intake never imports in-flight state (B02, B42).

#### 3.2.4 Column mapping (pure)

| Match | Treatment |
|---|---|
| Exact synonym (normalized) to one field | mapped, basis `exact` |
| Two columns map exactly to the same consequential field | question `column_mapping` (options: each column, `not_present`) |
| No exact match; fuzzy candidates (token Jaccard ≥ 0.6, or Levenshtein ≤ 2 for headers ≥ 6 chars) for a consequential field | question `column_mapping` |
| Fuzzy or no match for a non-consequential field | ignored; no question |
| Requirement-type columns: a header equal to two requirement types' labels across the snapshot offerings | question `column_mapping` |

#### 3.2.5 Service label mapping and date order (pure)

- Each distinct service label (normalized) maps to an offering of the group's country in the attempt snapshot when it equals the offering's service code, title, or a declared label synonym. A label that matches no offering, or more than one offering (for example two service modes with the same title), opens one question `service_label` per label (options: the country's offerings with title and mode, `not_a_service`). The answer applies to every row using that label. `not_a_service` ⇒ that label is dropped; a row left with no service gets `failed` / `service_missing`.
- Date order: if every date value in the mapped date columns parses under exactly one order, use it. If values parse under more than one order and no value disambiguates (all day and month parts ≤ 12), open question `date_order`. Values that parse under no order fail only their row (`date_invalid`).

#### 3.2.6 Systematic mapping fault (deterministic)

A mapping element `E` is a column→field mapping, a label→offering mapping or the date order. For each `E` the attempt keeps `processed(E)` and `failed(E, code)`. `E` is **systematic** when `processed(E) ≥ intake.systematicFaultMinRows` (3) **and** `failed(E, code) ≥ 3` **and** `failed(E, code) / processed(E) ≥ intake.systematicFaultShare` (0.5) for one code.

| When | Signal codes counted | Result |
|---|---|---|
| Plan dry run over all rows (before any acceptance) | `passport_number_invalid`, `date_invalid`, `country_code_invalid`, `service_label_unmapped` | question `systematic_fault` (state `awaiting_answer`); no row is accepted |
| During row processing | `mrz_not_found` on a column mapped to the passport requirement; `strong_identifier_conflict` between the passport column and MRZ; `population_out_of_scope` on the nationality column | attempt → `paused_mapping_fault` in the same row transaction; `generation` + 1; open incident `mapping_fault` and question `systematic_fault`; all `pending` rows stay `pending` (`wait_reason = paused`); accepted rows, their drafts and their incidents stay |

Answers to `systematic_fault`: `remap` (with a column ref) ⇒ re-plan; `confirm_values_as_is` ⇒ resume, rows fail individually with their own codes; `abandon` ⇒ abandon pending rows.

#### 3.2.7 Row pattern (pure)

Group rows by `applicant_key` (rows without a key are evaluated alone).

| Observation | Pattern |
|---|---|
| No key appears in more than one row | `one_row_per_applicant` (rows may list several services) |
| Some keys repeat; every row of the batch lists exactly one service; for each repeated key the identity fields are equal after normalization | `multiple_rows_per_applicant` |
| Some keys repeat and at least one row of the batch lists more than one service | `mixed_refused` |
| A key repeats with different identity fields | not a pattern question: those rows get `identity_conflict` incidents (Section 3.2.9); the pattern is evaluated over the other rows |

`mixed_refused` ⇒ state `awaiting_answer`, question `row_pattern_mixed` with options `will_correct_source` and `abandon` only. No row is accepted. The system does not choose a pattern for the TA (B14 "mixed patterns are not guessed through").

In `multiple_rows_per_applicant`, the documents of all rows of one applicant are proposed to every application of that applicant created by the same attempt whose offering declares the requirement type. This equals the one-row pattern; it is within one group and propagates no later correction (B03).

#### 3.2.8 Correction plan (pure over stored rows of the chain)

For each row `c` of a correction attempt:

| Step | Rule |
|---|---|
| 1 Match by key | If `c.applicant_key` equals the key of exactly one latest row of the chain ⇒ match, basis `applicant_key`. Equal to more than one ⇒ `unmatched` + incident `ambiguous_applicant`. |
| 2 Match by locator | Else, if the chain row with the same `source_locator` had no key (failed or `ambiguous_applicant`), propose a locator match; all locator matches of the attempt are listed in one question `correction_match_confirm` (options `confirm`, `reject`). Rejected ⇒ `unmatched`. |
| 3 New applicant | A key that no chain row carries ⇒ `routed_to_new_intake`: no effect; the result tells the TA to use a separate intake. |
| 4 Classify | Matched and `raw_digest` equal to the target's latest digest and the target result was not a failure ⇒ `unchanged` ⇒ row `untouched_by_correction`, effects resolved, nothing written to Core. Matched and the target failed with an eligible code (Section 3.2.10) ⇒ `failed_retry`. Matched and digest differs ⇒ `changed`. |
| 5 Omitted rows | Chain rows not matched by any correction row get no new row and keep their prior effects (reported as "untouched" on the correction page by query, not by writes). |

#### 3.2.9 Row proposal (deterministic; per row)

| Step | Rule | Failure ⇒ |
|---|---|---|
| a | Identity fields validated (Section 3.2.3) | row `failed` / field code |
| b | Applicant key: from form or sheet (`passport_number` + `passport_issuing_country`); else from the row's passport-role document MRZ when its extraction is `extracted` (all check digits valid) or manually resolved | no key and no passport document ⇒ incident `ambiguous_applicant` (`applicant_key_missing`); passport document still settling ⇒ wait (`identity_from_document`); passport extraction `low_confidence`/`failed` ⇒ incident `ambiguous_applicant` (`identity_requires_manual_resolution`); passport fetch failed ⇒ `failed` (`identity_source_unavailable`, eligible) |
| c | Both sheet key and MRZ key present and different | incident `identity_conflict` (`strong_identifier_conflict`); no draft |
| d | The same key in another row of this attempt with different identity fields | incident `identity_conflict` for each such row (`identity_conflict_in_batch`) |
| e | The same (key, offering) in more than one row of this attempt with different `mapped_digest` | incident `possible_duplicate` (`duplicate_in_batch`) for that service on each such row; identical digests resolve to one effect |
| f | `destination_country` present and ≠ group country | incident `ambiguous_group` |
| g | Service list empty after mapping | `failed` / `service_missing` |
| h | A row with no identity field, no service and no document (for example a totals row) | `excluded` / `not_an_applicant_row` |

The snapshot data sent to Core comes from the row values present at acceptance. Fields filled from MRZ carry provenance `mrz` in Core's snapshot evidence. Intake never edits a draft after acceptance except through an explicit correction attempt.

#### 3.2.10 Eligible failures for retry

Eligible (a correction or identical retry re-runs them): `source_fetch_failed`, `fetch_timeout`, `http_status`, `scanner_unavailable` (exhausted), `worker_timeout`, `worker_failed`, `identity_source_unavailable`, `capacity_storage`, `aggregate_limit`, launch refusals (`offering_not_launched`, `offering_suspended`, `offering_out_of_launch_scope`) and `stale_target_revision` after the TA re-confirms by uploading again. Not eligible without changed content: `rejected_*` safety verdicts, `identity_conflict`, `population_out_of_scope`, `date_invalid`, `passport_number_invalid`. An ineligible row with unchanged content stays `untouched_by_correction` with its prior result; with changed content it is `changed`.

### 3.3 Intake commands

#### C-I1 `intake.start_individual`

| Item | Specification |
|---|---|
| Actor / action | `account`, role `ta`; action `intake.start` on `{type:'group', id}`; then `application.create_draft` semantics through Core |
| Route | `POST /ta/groups/:groupId/intake/individual` (multipart) |
| Input | `groupId`; `expectedGroupRevision`; identity fields (Section 3.2.3); `offeringIds[]` (1–8, distinct); files `[{ field: requirementType, blobId, sha256, sizeBytes, declaredType, displayName }]` (≤ 12) |
| Checks (order) | 1 admission/epoch (runner). 2 actor active, role ta, session valid. 3 group exists, owned (`not_found_or_forbidden`), `open` (`control_blocked`/`group_closed`), revision. 4 for each offering (ascending): offering belongs to the group's country (`validation_failed`/`offering_not_in_country`); `requireControls({action:'create_draft', offeringId, groupId, taAccountId})` (launch, binding, population — CCR-07). 5 identity validation; key required (`validation_failed`/`applicant_key_missing`). 6 each file field is a requirement type declared by at least one requested offering (`requirement_not_declared`); each blob is `staged`, unreferenced and intended for this TA (`blob_not_referenceable`). 7 storage admission (`capacity_limited`/`capacity_storage`). 8 duplicate scope: if any (group, offering, key) has an open application ⇒ `conflict_duplicate`/`duplicate_open_scope` listing the existing readable refs; nothing is created (interactive form is all-or-nothing). |
| Writes | `intake_attempts` (kind `individual_form`, state `processing`, no slot); one `intake_rows` (`form`, state `accepted`); `intake_source_files` + `documents.registerVersion` per file (purpose `evidence`, source `ta_form_upload`, `declared_requirement_type` = field, plan `mrz` for the identity-role type else `none`); `core.acceptIntakeProposals` (CCR-06) with the attempt snapshot ⇒ drafts + `proposed` associations; `intake_row_services`; `intake_row_effects` |
| Facts | `intake.attempt_created`, `intake.row_result_recorded`; Documents and Core facts from their writers |
| Tasks | `doc.scan` per version (by `registerVersion`); `blob.promote_to_quarantine` per blob |
| Errors | `not_found_or_forbidden`, `validation_failed`, `control_blocked`, `conflict_duplicate`, `stale_revision`, `capacity_limited`, `rate_limited` (route), `maintenance` |
| Idempotency / concurrency | Same key + same content ⇒ replay (attempt id, application ids) re-authorized. Same key + different file or field ⇒ `conflict_operation_key`. Lost ack ⇒ `outcome_unknown`; resubmit same key. Concurrent form for the same scope (other key) ⇒ open-scope index; the loser gets `conflict_duplicate`. Concurrent launch suspension ⇒ `ops_offering_controls` share vs update; the later committer re-evaluates. |

#### C-I2 `intake.start_bulk`

| Item | Specification |
|---|---|
| Actor / action | TA; action `intake.start` on the group |
| Route | `POST /ta/groups/:groupId/intake/bulk` (urlencoded for URL sources; multipart for Excel/CSV) |
| Input | `groupId`, `expectedGroupRevision`, `sourceKind ∈ {public_google_sheet, excel_upload, public_folder, public_folder_with_sheet}`, `sourceUrl?`, `companionSheetUrl?`, `upload?` `{blobId, sha256, sizeBytes, declaredType, displayName}`, `namedOfferingIds[]` (required for folder without sheet, else empty), `altchaPayload` |
| Checks (order) | 1–3 as C-I1. 4 CAPTCHA `identity.consumeBotCheck(tx, { payload: altchaPayload, purpose: 'bulk_intake', binding: HMAC(session id ‖ group id) })` (`bot_check_failed`) (B08; rev 2, record 11 CCR-03: Intake never writes an `iam_` table). 5 at least one offering of the group's country evaluates `allow` for `start_intake` (`control_blocked`/`offering_not_launched`); each named offering MUST be `allow`. 6 URL classification (Section 3.2.1) or upload format by extension/declared type ∈ {xlsx, csv} (`source_format_unsupported`); upload size ≤ `upload.spreadsheetMaxBytes`. 7 per-TA slot: take the lowest free slot `1…concurrentAttemptsPerTa` (`capacity_limited`/`capacity_queue`). 8 storage admission. 9 same source: a root with `has_rows` and equal `source_locator_digest` exists in the group ⇒ `conflict_duplicate`/`source_already_ingested` with a link to that chain's correction page. |
| Writes | `intake_attempts` (state `received` for URL sources; `preflight` for uploads, which register the source version at once: `documents.registerVersion` purpose `intake_source`, source `intake_bulk_upload`); `catalogue_snapshot` = `catalogue.snapshotForIntake(countryId, releaseId)` plus each offering's launch effect at start; `intake_source_files` for the source |
| Facts | `intake.attempt_created` (after: kind, snapshot ids, slot, named offerings) |
| Tasks | URL sources: `intake.fetch_source` (`intake.fetch_source:<attempt>:g1:source`). Upload: `doc.scan` via `registerVersion` |
| Errors | as C-I1 plus `bot_check_failed`, `conflict_duplicate` (`source_already_ingested`) |
| Idempotency / concurrency | Kernel replay. Two concurrent starts by one TA compete for the slot index; a third concurrent start ⇒ `capacity_limited`. Two concurrent roots for the same source: both may commit (no rows yet). The `parse_sheet` phase-A record step checks for another root with `has_rows` before setting its own flag; if one exists it sets `preflight_failed`/`source_already_ingested`. If both check concurrently, `intake_attempts_source_rows_uq` raises 23505 for one, its record rolls back, the task retries and the retry takes the `preflight_failed` path. Either way no application mutation happens. |

#### C-I3 `intake.answer_question`

| Item | Specification |
|---|---|
| Actor / action | TA owner; action `intake.answer_question` on the attempt |
| Route | `POST /ta/intake/:attemptId/questions/:questionId/answer` |
| Input | `attemptId`, `questionId`, `expectedAttemptRevision`, `expectedQuestionRevision`, `optionCode`, `optionRef?` |
| Checks | 1 actor. 2 attempt owned. 3 attempt state ∈ {`awaiting_answer`, `paused_mapping_fault`} (`control_blocked`/`attempt_not_awaiting_answer`). 4 question `open` and of the attempt's current generation. 5 revisions. 6 option is one of the stored options (`validation_failed`/`answer_not_offered`). |
| Writes | question `answered`; `mapping_plan` / `selected_tab` / `header_row_no` / `date_order` updated per kind; `generation` + 1. If no open question remains: `row_pattern_mixed` + `abandon` ⇒ attempt `abandoned` (as C-I5); `row_pattern_mixed` + `will_correct_source` ⇒ attempt stays `awaiting_answer` with code `awaiting_correction_upload`; `systematic_fault` + `abandon` ⇒ pending rows abandoned; otherwise state `preflight` (re-plan). |
| Facts | `intake.question_answered` (before/after of the plan element) |
| Tasks | `intake.parse_sheet` (`…:<attempt>:g<new>:plan`) for re-plan (no worker call when rows are stored) |
| Errors | `not_found_or_forbidden`, `stale_revision`, `control_blocked`, `validation_failed` |
| Idempotency / concurrency | Replay by key. Two tabs answering differently ⇒ the second gets `stale_revision`. Answer vs abandon ⇒ attempt revision decides. Tasks of the old generation skip in prepare. |

#### C-I4 `intake.correction_upload`

| Item | Specification |
|---|---|
| Actor / action | TA owner; action `intake.correction_upload` on the chain's latest attempt |
| Route | `POST /ta/intake/:attemptId/correction` (urlencoded for "re-fetch the same URL source"; multipart for Excel/CSV) |
| Input | `attemptId` (latest of chain), `expectedAttemptRevision`, `refetch: boolean` (URL sources) or `upload`, `altchaPayload` |
| Checks | 1–2 actor, ownership. 3 the target is the latest attempt of its chain (`stale_revision`/`not_latest_attempt`). 4 target state: terminal, `awaiting_answer` or `paused_mapping_fault`; `received`/`preflight`/`processing` ⇒ `control_blocked`/`attempt_in_progress`; `paused_actor_revoked` ⇒ resume first. 5 the root's `base_source_kind` is not `individual_form` (individual drafts are corrected on the application) (`correction_not_applicable`). 6 CAPTCHA, slot, storage, `start_intake` admission as C-I2. 7 upload format as C-I2. |
| Writes | If the target is `awaiting_answer`/`paused_mapping_fault`: target → `abandoned` (code `superseded_by_correction`); its `pending` rows → `superseded_by_correction`; its open questions → `withdrawn`; its open incidents stay open (the correction may resolve them). New attempt: kind `correction_upload`, `base_source_kind` = root's, `root_attempt_id`, `corrects_attempt_id` = target, `chain_no` + 1, new catalogue snapshot (one applicable baseline per attempt, B16). |
| Facts | `intake.attempt_created` (after: `correctsAttemptId`, `rootAttemptId`); `intake.attempt_abandoned` for a superseded target |
| Tasks | `intake.fetch_source` (re-fetch) or `doc.scan` (upload) |
| Errors | as C-I2 plus `attempt_in_progress`, `correction_not_applicable` |
| Idempotency / concurrency | Two concurrent corrections on one chain ⇒ `intake_attempts_chain_active_uq`: one commits, the other `conflict_duplicate`/`attempt_in_progress`. Kernel replay for the same key. |

#### C-I5 `intake.abandon`

| Item | Specification |
|---|---|
| Actor / action | TA owner; action `intake.abandon` |
| Route | `POST /ta/intake/:attemptId/abandon` |
| Input | `attemptId`, `expectedAttemptRevision`, `scope: 'attempt' | 'rows'`, `rowIds[]` (for `rows`; each row `pending`, `failed` or `incident_open`) |
| Checks | actor; ownership; revision; scope `attempt` requires an active state; scope `rows` requires rows of this attempt |
| Writes | `attempt`: state `abandoned`, `active_slot` NULL, `pending` rows → `failed` with code `abandoned_by_ta`; open incidents of the attempt's rows → `resolved_by_ta_abandonment`. `rows`: the listed rows → `failed`/`abandoned_by_ta` (if pending) and their open incidents → `resolved_by_ta_abandonment`; the attempt completes if no row is left pending. Accepted rows, drafts, associations and `intake_row_effects` are never changed (B16). |
| Facts | `intake.attempt_abandoned` or `intake.row_result_recorded` per row; `intake.incident_disposed` per incident |
| Tasks | none; pending tasks skip on generation/state |
| Errors | `not_found_or_forbidden`, `stale_revision`, `control_blocked`/`attempt_terminal` |
| Idempotency / concurrency | Replay by key. Abandon vs a row transaction in flight: the row transaction re-checks the attempt under lock at its end and rolls back if the attempt is no longer active (Section 3.6.1 step 7); a row committed first stays accepted. |

#### C-I6 `intake.resume`

| Item | Specification |
|---|---|
| Actor / action | TA owner; action `intake.start` (CCR-10 maps resume to it) |
| Route | `POST /ta/intake/:attemptId/resume` |
| Input | `attemptId`, `expectedAttemptRevision` |
| Checks | actor active (restored); ownership; state `paused_actor_revoked`; group `open`; slot available |
| Writes | state → `processing` (or `preflight` if no rows yet); `generation` + 1; slot re-taken |
| Facts | `intake.attempt_resumed` (CCR-11) |
| Tasks | re-enqueue the incomplete step for the new generation: `intake.fetch_source`, `intake.preflight`, `intake.parse_sheet`, or per pending row `intake.fetch_row_files`/`intake.process_rows` |
| Errors | `not_found_or_forbidden`, `stale_revision`, `control_blocked` |
| Idempotency / concurrency | Dedupe keys carry the generation, so resumed tasks never collide with cancelled ones; rows already accepted resolve through `intake_row_effects`. |

#### C-I7 `intake.dispose_incident` (SuperAdmin dismissal)

| Item | Specification |
|---|---|
| Actor / action | SuperAdmin; action `intake.incident_dispose`; reason required (≥ 10 chars) |
| Route | `POST /admin/intake/incidents/:incidentId/dismiss` |
| Input | `incidentId`, `expectedRevision`, `_reason` |
| Checks | actor active SuperAdmin with MFA; incident `open`; revision |
| Writes | state `dismissed_by_superadmin`, `disposed_by`, `disposition_reason`, `disposed_at`. Nothing else. Related applications are not touched: no withdrawal, no outcome, no lifecycle change (B16). |
| Facts | `intake.incident_disposed` (reason) |
| Errors | `not_found_or_forbidden`, `stale_revision`, `control_blocked`/`incident_not_open` |
| Idempotency / concurrency | Dismissal vs a correction that resolves the same incident: conditional `WHERE state='open' AND revision=$r`; one wins; the other gets `stale_revision` (dismissal) or leaves the incident disposed and records the row result without re-disposing (correction). |

TA disposition of an incident is not a separate command: correction (C-I4 → `resolved_by_correction`) or abandonment (C-I5 → `resolved_by_ta_abandonment`).

### 3.4 Document Processing

#### 3.4.1 Safety order (`doc.scan` then `doc.parse`)

| # | Check | Where | Reject verdict | Content read? |
|---|---|---|---|---|
| 1 | Size: evidence ≤ min(5 MiB, `upload.documentMaxBytes`); intake source sheet ≤ `upload.spreadsheetMaxBytes`; folder listing ≤ 2 MiB | `doc.scan` effect (stat) | `rejected_size` | no |
| 2 | Format by magic number (`file-type`, first ≤ 4100 bytes): evidence ∈ {PDF, JPEG, PNG}; sheet ∈ {xlsx (OOXML zip)}; CSV and HTML listing: strict UTF-8 decode of the first 64 KiB with no NUL byte. A declared type that differs from the detected allowed type is recorded (`declaredMismatch`), not fatal; the detected type governs serving | `doc.scan` effect | `rejected_format` | header bytes only (format verification) |
| 3 | Malware: clamd INSTREAM of the whole file; `FOUND` ⇒ reject; socket error, timeout or any other reply ⇒ `scanner_unavailable` (fail closed) | `doc.scan` effect | `rejected_malware` / `scanner_unavailable` | bytes streamed to clamd only |
| 4 | Structural (sandboxed parse worker): PDF `inspect_pdf` (qpdf check; encryption; active-content keys); image `decode_image` (full decode, `limitInputPixels` 40 MP); xlsx `inspect_spreadsheet` (zip central directory: entries ≤ 2000, uncompressed ≤ 100 MiB, ratio ≤ 100, no encrypted entries; SheetJS open) | `doc.parse` effect | `rejected_active_content` / `rejected_decode` | yes, inside the sandbox only |
| 5 | Extraction per `extraction_plan` (Section 5.6) | `doc.parse` effect | — (status only) | yes, sandbox only |

Steps 1–3 complete before any parse job exists for the version: `doc.parse` is enqueued only by the `doc.scan` record step after `passed` (B15 "verify format, size and malware before reading content").

#### 3.4.2 Association decision (deterministic; `evaluateAssociation`)

Evaluated when an association is proposed, when its version settles, when the current extraction verdict changes, and when Core reports an identity change (CCR-12). Order:

| # | Condition | Status / code |
|---|---|---|
| 1 | version `purpose = 'evidence'`, `currency = 'current'`, not excluded/rejected, same group as the application | else `rejected` / `version_not_eligible` |
| 2 | version settled | else stays `proposed` / `processing_pending` |
| 3 | `content_safe` | else `rejected` / `document_unsafe` |
| 4 | detected format and size accepted by the requirement's declared `formats`/`maxBytes` (offering narrowing) | else `rejected` / `format_not_accepted_by_offering` or `size_not_accepted_by_offering` |
| 5 | classification confirmed: basis ∈ {`ta_upload_field`, `column_mapping`, `ta_confirmed`, `operator_confirmed`} for the requirement type, or `mrz_detected` for the identity role | else `proposed` / `classification_unconfirmed` |
| 6 | identity role (requirement subject `applicant`, identity flag): extraction `extracted` or manual. Passport number + issuing state equal the applicant key | else `conflict` / `strong_identifier_conflict` |
| 7 | identity role: surname and given names equal the snapshot as token multisets after normalization (upper case, diacritics removed, `-` and `'` removed, MRZ `<` as separator); date of birth equal when the snapshot has one | else `conflict` / `name_mismatch` or `dob_mismatch` |
| 8 | identity role with extraction `low_confidence` or `failed` | `proposed` / `extraction_manual_resolution_required` |
| 9 | requirement subject `other_person`: the version's MRZ key, if any, MUST differ from the applicant key | else `conflict` / `other_person_document_is_applicant` |
| 10 | otherwise | `positive` |

Each status change calls `core.noteEvidenceChanged(applicationId, 'association_changed')` in the same transaction. A conflict on an identity-role association also lets the Intake listener open `identity_conflict` for the row that proposed it. Name matching is deterministic equality after normalization; no similarity score ever produces `positive` (B15).

#### 3.4.3 Documents about another person

- A requirement with `subject: 'other_person'` exists only if the offering's declaration declares it. Without it, a document whose MRZ key differs from the applicant key is never associated automatically: in intake it becomes incident `ambiguous_document` (`other_person_document_not_declared`).
- An `other_person` association never has `identity_role = true` and its extraction never feeds the applicant key, the snapshot or name matching (B15).

#### 3.4.4 Passport-based identity

- The passport (identity-role requirement) is the primary identity reference. The applicant key is `<issuing state>:<passport number>` (contract §1.1).
- Strong-identifier conflict (different passport number or issuing state between two sources) and same-name ambiguity (one name, several candidate applicants or rows) stay unresolved: they produce `conflict` associations or intake incidents. No component merges applicants by name, by similarity or by probability. Manual extraction resolution is refused while the version's extraction status is `conflict` (Section C-D3): only corrected evidence (a new version, a corrected row or a Core identity correction with same-person evidence) clears it (B15, B20).

#### 3.4.5 Requirement evidence (`requirementEvidence`, computed on read)

For each requirement `r` declared by the application's governing declaration (`documents.requirements[]`, contract 01 §9.2 rev 2), consider associations to `(application, r.type)` whose version is `current` and not excluded:

| Precedence (first match) | Status |
|---|---|
| a positive association whose version is `canonical`, content-safe, identity checks pass on the current snapshot, and every declared validity check is `valid` | `satisfied` |
| any association `conflict` | `conflict` |
| positive, a validity check `invalid` | `validity_failed` |
| positive, a validity check `unknown` | `validity_unknown` |
| version `blocked` | `blocked` |
| positive but bytes `unavailable`, or extraction `failed` on the identity role | `unreadable` |
| association `proposed` with `processing_pending` | `safety_pending` |
| association `proposed` with `classification_unconfirmed` or `extraction_manual_resolution_required` | `unclassified` |
| no association, but a group version classified as `r.type` exists | `unassociated` |
| otherwise | `missing` |

`mandatory` is copied from the declaration. Core's evaluator (stage 10) blocks on mandatory requirements that are not `satisfied` and on any identity-role or `identity_conflict` regardless of the mandatory flag. An optional requirement never satisfies another type; its `conflict`, `validity_*` and `unreadable` statuses are returned and shown but block nothing (B15 "its conflicts remain visible").

#### 3.4.6 Validity checks (computed on read; capability `documents.validity/1`)

| Kind | Params | Inputs | `valid` when | `unknown` when |
|---|---|---|---|---|
| `passport_valid_through_return_plus_months` | `months` | MRZ expiry; group `travel_return_date` | expiry ≥ `addMonths(travel_return_date, months)` (Asia/Kolkata calendar) | no expiry extracted |
| `passport_document_code_in` | `codes` (e.g. `["P"]`) | MRZ document code | code ∈ codes | no MRZ |
| `passport_issuing_state_in` | `states` | MRZ issuing state | state ∈ states | no MRZ |
| `image_min_pixels` | `width`, `height` | decoded dimensions | both ≥ | not an image |
| `image_aspect_ratio` | `ratio`, `tolerance` | decoded dimensions | within tolerance | not an image |
| `pdf_max_pages` | `pages` | page count | ≤ | not a PDF |
| `country_adapter_check` | `adapterId`, `version`, `params` | adapter input: closed field set | adapter returns `valid` | adapter returns `unknown`, throws, or exceeds its 200 ms limit (code `country_adapter_error`) |

A declaration that names a kind outside this list is not supported by the release's capability set, so its binding is `incompatible` (contract §9.4) and the offering cannot be launched; no default check is inferred. A group travel-date edit changes validity on the next read; the readiness fingerprint already includes travel dates (contract §7.3). A country adapter error is contained: the result is `unknown` with code `country_adapter_error`, and no other country's evaluation is affected (B36). Rev 2 (REC-07): `requirementEvidence` runs inside read-only transactions and inside commands that may be refused, so it never writes. It adds an `AttributionRecord { kind: 'country_defect', countryId, adapterId, version, code }` to `tx.attributions` (contract 01 §4.13); the kernel flushes it after the transaction ends — committed or rolled back — by enqueuing `ops.attribute_country_defect` (dedupe `country_defect:<adapterId>:<version>:<code>`), whose record step calls `operations.openIncident({ kind: 'country_defect', countryId, dedupeKey })`. A refused submit or readiness command and a page render therefore still produce the owned incident. An adapter is an in-process, versioned function with bounded input; runaway work inside it is the accepted B36 owner decision.

### 3.5 Documents commands

All Documents commands require `purpose = 'evidence'` and a version in the actor's scope. Each command that changes an association calls `core.noteEvidenceChanged` and Core's controls for `correct_application` on the application (contract §8.3), so the assigned-editor rules apply: the TA acts on an application only when it is unassigned or returned; the assigned operator acts only in `assistance_in_progress` (contract §2.9, §5.3).

#### C-D1 `doc.upload_for_application`

| Item | Specification |
|---|---|
| Actor / action | TA owner, or assigned operator in `assistance_in_progress`; action `document.upload` on the application |
| Route | `POST /ta/applications/:applicationId/documents`, `POST /ops/applications/:applicationId/documents` (multipart, one file) |
| Input | `applicationId`, `expectedApplicationRevision`, `requirementType`, file `{blobId, sha256, sizeBytes, declaredType, displayName}` |
| Checks | actor; policy; `requireControls({action:'correct_application'})` (protection mark, lifecycle open, editor rules, filing uncertainty); requirement declared by the governing declaration (`requirement_not_declared`); blob staged and unreferenced; storage admission; per-TA upload rate limit |
| Writes | `documents.registerVersion` (source `ta_form_upload` or `operator_assistance_upload`; hint; plan); association `proposed` (basis `manual_ta`/`manual_operator`) |
| Facts | `doc.version_registered`, `doc.association_recorded` |
| Tasks | `doc.scan`, `blob.promote_to_quarantine` |
| Errors | `not_found_or_forbidden`, `control_blocked`, `validation_failed`, `stale_revision`, `capacity_limited`, `rate_limited` |
| Idempotency / concurrency | Kernel replay; same key + other file ⇒ `conflict_operation_key`. Upload vs assignment commit: the editor-state check runs under the application lock; an upload after assignment commit is refused (`awaiting_formal_return`). |

#### C-D2 `doc.replace_version`

| Item | Specification |
|---|---|
| Actor / action | as C-D1; action `document.upload` |
| Route | `POST …/documents/:versionId/replace` |
| Input | as C-D1 plus `replacesVersionId`, `expectedAssociationRevision` |
| Checks | as C-D1; the old version has a `positive` or `proposed` association to this application for this requirement; revision |
| Writes | new version (`replaces_version_id`), new association `proposed` with `replaces_association_id`. When the new association becomes `positive` (same transaction as that decision): the old association → `revoked` (`replaced`); the old version's `currency` → `replaced` only if it has no other `positive`/`proposed` association. If the new association becomes `rejected` or `conflict`, the old association stays unchanged and the page shows "replacement not accepted". |
| Facts | `doc.version_registered`; later `doc.association_recorded`, `doc.association_revoked`, `doc.version_replaced` |
| Idempotency / concurrency | Two replacements of the same association: the second's decision step finds the old association no longer current ⇒ the second new association is decided on its own, and the old one is revoked once (conditional update). |

#### C-D3 `doc.resolve_extraction`

| Item | Specification |
|---|---|
| Actor / action | TA owner of the version's group (application optional, CCR-10), or assigned operator in assistance; action `document.resolve_extraction` |
| Route | `POST /ta/documents/:versionId/resolve-extraction`, `POST /ops/applications/:applicationId/documents/:versionId/resolve-extraction` |
| Input | `versionId`, `expectedVersionRevision`, MRZ field set (Section 5.6), `attestation: true` |
| Checks | actor; policy; editor rules for each application with an association to the version; version settled and content-safe; current extraction status ∈ {`low_confidence`, `failed`} — `conflict` ⇒ `control_blocked`/`identity_conflict_unresolved`; `extracted` ⇒ `control_blocked`/`extraction_already_verified`; field validation; every field whose OCR check digit was valid MUST equal the OCR value (`manual_contradicts_check_digit`); `attestation = true` |
| Writes | new current extraction verdict (`method 'manual'`, `resolution_kind`, `resolved_by`, `attestation`, `supersedes_verdict_id`); old verdict `is_current = false`; re-evaluation of every association of the version |
| Facts | `doc.extraction_verdict_recorded` (before/after of changed fields) |
| Tasks | none |
| Idempotency / concurrency | Two concurrent resolutions: version revision ⇒ one `stale_revision`. The partial unique index guarantees one current verdict. |

#### C-D4 `doc.confirm_classification`

| Item | Specification |
|---|---|
| Actor / action | TA owner of the group, or assigned operator in assistance; action `document.resolve_extraction` |
| Route | `POST /ta/documents/:versionId/classification` |
| Input | `versionId`, `expectedVersionRevision`, `type` (a requirement type declared by an offering of the group's open applications, or `unrelated`) |
| Checks | version evidence, not excluded; `unrelated` refused while any association is `positive` (`version_associated`) |
| Writes | `classified_type`, basis `ta_confirmed`/`operator_confirmed`, state `confirmed`; re-evaluation of associations. `unrelated`: processing `excluded_unrelated`, `exclusion_reason`, open associations → `rejected`, `display_name` → NULL, `BlobStore.dispose` (CCR-03) ⇒ bytes `disposed` |
| Facts | `doc.classification_recorded`; `doc.unrelated_excluded`; `doc.bytes_disposed` |

#### C-D5 `doc.associate` / `doc.revoke_association`

| Item | Specification |
|---|---|
| Actor / action | TA owner, or assigned operator in assistance; action `document.associate` |
| Route | `POST /ta/applications/:applicationId/documents/:versionId/associate`, `…/revoke` |
| Input | `applicationId`, `versionId`, `requirementType`, `expectedApplicationRevision`, `expectedAssociationRevision` (revoke) |
| Checks | same group (the writer refuses another group with `not_found_or_forbidden`, never `validation_failed`, so a foreign id leaks nothing); requirement declared; controls `correct_application`; for associate: no open association for the same triple (partial unique index ⇒ `conflict_duplicate`) |
| Writes | associate: `proposed` (basis `manual_ta`/`manual_operator`) then immediate evaluation. Revoke: `revoked`. |
| Facts | `doc.association_recorded` / `doc.association_revoked` |

#### C-D6 `doc.requeue_check`

| Item | Specification |
|---|---|
| Actor / action | SuperAdmin; action `document.requeue_check` (CCR-10); reason required |
| Route | `POST /admin/documents/:versionId/requeue` |
| Input | `versionId`, `expectedVersionRevision`, `stage: 'scan' | 'parse'` |
| Checks | `check_exhausted = true` or `processing_state = extraction_failed` with a worker failure code |
| Writes | `check_exhausted = false`; state back to `quarantined` (scan) or `safety_passed` (parse) |
| Tasks | `doc.scan` / `doc.parse` with dedupe discriminator `r<n>` (n = requeue count) |
| Facts | `doc.check_requeued` (CCR-11) |

### 3.6 Task record steps (acceptances)

Each row below is one SERIALIZABLE record transaction (contract §4.6). "Prepare" re-checks run in the preceding prepare transaction and again implicitly through conditional updates here.

| Step | Writes | Facts | Enqueues |
|---|---|---|---|
| `intake.fetch_source` record | `BlobStore.reference` of the staged output; `documents.registerVersion` (purpose `intake_source`, source `intake_bulk_fetch`); `intake_source_files` (`quarantined`); attempt `received` → `preflight` | `doc.version_registered` (the attempt state change is visible on the attempt row; the preflight verdict fact follows in `intake.preflight`) | `doc.scan` (by registerVersion) |
| `intake.fetch_source` terminal failure | attempt → `preflight_failed` with the fetch code; slot released | `intake.preflight_failed` | none |
| `intake.preflight` record | verifies source verdicts (safety `passed`, structural `passed`; for a folder listing the structural stage is the strict UTF-8 check of the scan step), size and kind; on pass state stays `preflight`; on fail → `preflight_failed` (`source_unsafe`, `source_unreadable`, `source_format_unsupported`, `source_too_large`); folder listing: entries ≤ `intake.folderMaxEntries`, depth ≤ 2 | `intake.preflight_passed` / `intake.preflight_failed` | `intake.parse_sheet` |
| `intake.parse_sheet` record, phase A (store) | rows stored (`raw_cells`, `raw_digest`, `row_no`, `source_locator`, state `pending`), `has_rows = true` (may raise `source_already_ingested`), counters; or listing entries stored as `intake_source_files` (`pending`/`not_fetched_unreferenced`) | `intake.rows_planned` (counts only) | — |
| `intake.parse_sheet` record, phase B (plan) | header, mapping, labels, date order, row pattern, dry-run fault check; questions opened ⇒ `awaiting_answer`; else `mapped`, `applicant_key`, `service_offering_ids` per row, state `processing` | `intake.question_opened` per question; `intake.rows_planned` (plan digest, pattern) | per row: `intake.fetch_row_files` (rows with links/files) and `intake.process_rows` (rows whose key is known and that have no file to settle first) |
| `intake.fetch_row_files` record | per fetched file: reference blob, `documents.registerVersion` (purpose `evidence`, source `intake_bulk_fetch`, `declared_requirement_type` from the column, plan `mrz` for identity role, `mrz_probe` in folder mode); per failed file: `intake_source_files.state = 'unreadable'` + code; `files_bytes` += size; aggregate over `intake.maxAggregateBytes` ⇒ remaining files `unreadable`/`aggregate_limit` | `doc.version_registered` per file | `doc.scan` per file |
| `intake.process_rows` record (row mode) | Section 3.6.1 | `intake.row_result_recorded`, `intake.incident_opened`, Core/Documents facts | none, or the finalize task |
| `intake.process_rows` record (finalize) | when every row is terminal and every source file is settled or failed: state `fully_processed`, `terminal_at`, slot NULL | `intake.attempt_fully_processed` (counts by result code) | none |
| `doc.scan` record | `doc_safety_verdicts` (stage `scan`); version `safety_passed` or `safety_rejected` (+ `BlobStore.dispose`, bytes `disposed`, `display_name` NULL) ; `scanner_unavailable` ⇒ `safety_retry_wait` and task failure (retryable) | `doc.safety_verdict_recorded`; `doc.bytes_disposed` | `doc.parse` on pass |
| `doc.parse` record | stage `structural` verdict; on pass `content_safe = true` and `BlobStore.requestMove(canonical)`; extraction verdict (current); classification by MRZ (`mrz_detected`) when plan is `mrz_probe` and a valid MRZ was found; association evaluation of all `proposed` associations of the version; state → `processed` / `manual_resolution_required` / `extraction_failed` / `safety_rejected`; rev 2 (BND-13): notify every registered settled listener in the same transaction, including for `purpose = 'official_result'` versions (Operations' `evaluateArtifactAssociation`, which fails closed with an owned incident) | `doc.safety_verdict_recorded`, `doc.extraction_verdict_recorded`, `doc.classification_recorded`, `doc.association_recorded` | `blob.publish_canonical` (by requestMove) |
| `blob.publish_canonical` owner hook (CCR-03) | bytes `canonical` after size + SHA-256 verification; failure ⇒ `markBytesUnavailable('integrity_failed')` and `operations.openIncident('bytes_integrity')` | `doc.bytes_available` or `doc.bytes_unavailable` | — |
| `blob.*` move terminal failure hook (rev 2, REC-17, `onMoveFailedTerminal`) | `markBytesUnavailable('missing')`: bytes `unavailable`, owned `bytes_integrity` incident (owner: assigned operator, else SuperAdmin queue), version settled so that dependent intake waits finish; listeners notified | `doc.bytes_unavailable` | — |
| settled listener (CCR-05, inside the Documents transaction) | `intake_source_files.state` (`checked`/`rejected`); for a source role: enqueue `intake.preflight`; for a row file: if every file of the row is settled, enqueue `intake.process_rows` for that row; identity-role conflict ⇒ `intake.incident_opened` (`identity_conflict`) linked to the application | `intake.incident_opened` | `intake.preflight` / `intake.process_rows` |

#### 3.6.1 Row acceptance transaction (`intake.process_rows`, row mode)

| # | Action |
|---|---|
| 1 | Read the attempt and the row without locks. Skip (`obsolete`) if the attempt is not `processing`, the generation differs, or the row is not `pending`. |
| 2 | Compute the row proposal (Section 3.2.9) from `mapped`, row files and the current extraction verdicts. A wait condition ⇒ record `wait_reason` only (no result) and finish; the settled listener re-enqueues the row. |
| 3 | For each offering of the row in ascending id: if `intake_row_effects(root, original locator, offering)` exists ⇒ outcome `resolved_prior_effect` (Nth retry; no Core call). |
| 4 | For the remaining offerings, one call `core.acceptIntakeProposals(tx, { attemptId, rowId, groupId, applicantKey, applicant, proposals: [{ offeringId, governing: snapshot[offeringId], documents }] })` (CCR-06). Core locks offering heads ascending, offering controls, group (share), evaluates `create_draft` controls per offering, inserts under the open-scope index, creates `proposed` associations through `documents.associateFromProposal`, and returns per offering `created` / `matched_existing` / `refused(code)`. |
| 5 | `created` ⇒ `intake_row_effects` insert (`effect 'created'`, `applied_snapshot_version_no`). `matched_existing` from another chain or a form ⇒ `intake_row_effects` insert (`matched_existing`) and incident `possible_duplicate` (owner TA) with `details.dataDiffers` = (row `mapped_digest` ≠ Core snapshot digest); the existing application is not touched and no document is associated to it. `refused` ⇒ `intake_row_services.outcome = 'refused'` with the code. |
| 6 | Correction mode (`correction_class ∈ {changed, failed_retry}` with an existing effect): `core.applyIntakeCorrection(tx, { applicationId, expectedSnapshotVersionNo: effect.applied_snapshot_version_no, changes, documentReplacements, attemptId, rowId })` (CCR-06). All changes of the row for that application apply together or none: Core refuses with `stale_target_revision` (snapshot changed since), `correction_target_not_draft` (not a draft or editor does not permit), or `identity_change_requires_evidence` (identity fields, B19). A refused correction ⇒ outcome `correction_refused`; identity refusals also open `identity_conflict`. New files of a changed row MUST all be settled and content-safe before step 6 runs; any rejected new file ⇒ the whole row correction is refused (`correction_file_rejected`). A service present in the original row but absent in the correction ⇒ `omitted_existing_untouched`. |
| 7 | Lock the attempt row `FOR UPDATE` with `WHERE state='processing' AND generation=$g` (zero rows ⇒ roll back the whole transaction, including Core writes; the row stays `pending`). Update counters and fault counters; if a systematic fault is reached (Section 3.2.6) set `paused_mapping_fault` in this same transaction after recording this row's result. |
| 8 | Lock the row `FOR UPDATE WHERE state='pending'`; write `state` (`accepted` if ≥ 1 service is `created`/`matched_existing`/`resolved_prior_effect`/`corrected`; `incident_open` if the row has an incident and no effect; else `failed`), `result`, `generation`. Open incidents of earlier chain rows that this row resolves ⇒ `resolved_by_correction` with `disposed_by_attempt_id`. |
| 9 | Append `intake.row_result_recorded` with `after: { state, services: [{ offeringId, outcome, code, applicationId }], resolvedPriorEffect: boolean, correctionClass }`. If every row is terminal, enqueue the finalize task. |

### 3.7 Facts appended (subset of contract §2.22 plus CCR-11)

| Fact | Subject | Key `after` content |
|---|---|---|
| `intake.attempt_created` | intake_attempt | kind, root/corrects ids, snapshot ids, slot, named offering ids |
| `intake.preflight_passed` / `intake.preflight_failed` | intake_attempt | code |
| `intake.rows_planned` (CCR-11) | intake_attempt | row count, pattern, plan digest, ignored column count |
| `intake.question_opened` / `intake.question_answered` | intake_question | kind, option codes (no sample values) |
| `intake.row_result_recorded` | intake_row | Section 3.6.1 step 9; Derived Views counts row-level yield from these facts and deduplicates on `resolvedPriorEffect` (B32) |
| `intake.attempt_paused` / `intake.attempt_resumed` (CCR-11) / `intake.attempt_abandoned` / `intake.attempt_fully_processed` | intake_attempt | code, generation, counters |
| `intake.incident_opened` / `intake.incident_disposed` | intake_incident | kind, owner kind, related ids, disposition |
| `doc.version_registered` | document_version | purpose, source, size, detected type (later), sha256 hex, scope |
| `doc.safety_verdict_recorded` | document_version | stage, verdict, closed check codes |
| `doc.extraction_verdict_recorded` | document_version | status, method, contract; changed MRZ fields in before/after |
| `doc.classification_recorded` | document_version | type, basis, state |
| `doc.association_recorded` / `doc.association_revoked` | association | status, code, validity results at decision time |
| `doc.version_replaced` / `doc.version_blocked` / `doc.bytes_unavailable` / `doc.unrelated_excluded` | document_version | cause codes |
| `doc.bytes_available` / `doc.bytes_disposed` / `doc.check_requeued` (CCR-11) | document_version | blob id, verified sha256 hex |

### 3.8 Exported interface (`src/modules/intake/api.ts`, `src/modules/documents/api.ts`)

Intake (replaces contract §6.5 per CCR-09/10):

```ts
export interface IntakeApi {
  groupClosureBlockers(tx: ReadTx, groupId: GroupId): Promise<{ readonly openIncidents: number; readonly activeAttempts: number }>;   // Core close_group / group end
  openIncidentsInGroup(tx: ReadTx, groupId: GroupId): Promise<number>;                                   // kept for contract compatibility
  attemptSummary(tx: ReadTx, id: IntakeAttemptId): Promise<IntakeAttemptSummary | undefined>;
  onDocumentSettled(tx: WriteTx, e: { readonly versionId: DocumentVersionId; readonly intakeAttemptId: IntakeAttemptId; readonly sourceFileId: Id<'isf'>; readonly settled: DocProcessingState; readonly identityConflict: { readonly applicationId: ApplicationId } | null }): Promise<void>;   // registered as a Documents listener in compose.ts
  relations: Pick<PolicyRelations, 'intakeAttempt' | 'intakeIncident'>;
}
```

Documents (contract §6.6 plus CCR-01/02/05/12):

```ts
export interface DocumentsApi {
  registerVersion(tx: WriteTx, req: { readonly blobId: BlobId; readonly groupId: GroupId; readonly taAccountId: AccountId; readonly purpose: DocPurpose; readonly source: DocSource;
    readonly declaredMediaType: string | null; readonly displayName: string | null; readonly sizeBytes: number; readonly sha256: Buffer;
    readonly declaredRequirementType?: string; readonly extractionPlan: ExtractionPlan; readonly replacesVersionId?: DocumentVersionId;
    readonly intakeAttemptId?: IntakeAttemptId; readonly intakeSourceFileId?: Id<'isf'>; readonly uploadedBy?: AccountId }): Promise<DocumentVersionId>;
  associateFromProposal(tx: WriteTx, req: { readonly versionId: DocumentVersionId; readonly applicationId: ApplicationId; readonly requirementType: string; readonly proposedByRowId: IntakeRowId }): Promise<AssociationId>;
  reevaluateForApplication(tx: WriteTx, applicationId: ApplicationId): Promise<void>;           // Core calls after any applicant-identity snapshot change
  requirementEvidence(tx: ReadTx, applicationId: ApplicationId, requirements: readonly DeclaredRequirement[]): Promise<readonly RequirementEvidence[]>;   // Section 3.4.5
  evidenceFingerprint(tx: ReadTx, applicationId: ApplicationId): Promise<Buffer>;
  getVersionForRelease(tx: ReadTx, versionId: DocumentVersionId, lock?: Lock): Promise<{ readonly groupId: GroupId; readonly purpose: DocPurpose; readonly currency: DocCurrency; readonly bytesState: DocBytesState; readonly contentSafe: boolean; readonly blobId: BlobId; readonly sha256: Buffer; readonly sizeBytes: number; readonly mediaType: string } | undefined>;
  extractionProposal(tx: ReadTx, versionId: DocumentVersionId): Promise<ExtractionProposal | undefined>;
  artifactExtraction(tx: ReadTx, versionId: DocumentVersionId): Promise<{ readonly status: 'extracted' | 'failed' | 'not_applicable'; readonly passportNumberCandidates: readonly string[]; readonly nameTokens: readonly string[]; readonly mrz?: MrzResult } | undefined>;   // rev 2 (BND-13): inputs of Operations' assoc/1 (record 13 §3.15)
  registerSettledListener(fn: DocumentSettledListener): void;   // rev 2 (CCR-05 accepted): compose-time; Intake and Operations register
  blockVersion(tx: WriteTx, versionId: DocumentVersionId, incidentId: IncidentId): Promise<void>;
  markBytesUnavailable(tx: WriteTx, versionId: DocumentVersionId, cause: 'missing' | 'integrity_failed'): Promise<void>;
  relations: Pick<PolicyRelations, 'documentVersion' | 'association'>;
}
```

`blockVersion` sets `currency = 'blocked'`, `blocked_incident_id`, revokes nothing silently (associations keep their status; requirement evidence reports `blocked`) and calls `core.noteEvidenceChanged`. `markBytesUnavailable` sets `bytes_state = 'unavailable'`, opens `bytes_integrity` through Operations (owner: assigned operator, else SuperAdmin) and calls `core.noteEvidenceChanged`; requirement evidence reports `unreadable`. Neither ever substitutes another version (B12).

## 4. Queries, pages and routes

All pages are server-rendered, `noindex`, `Cache-Control: no-store` (contract §12.4). Every route declares its `Action` and resource resolver (T-F02). Lists apply `policy.scope` with the predicate below, computed on authoritative intake/document tables, never on projections (contract §5.4). A foreign or missing id renders the single 404 page. Support view (SV) renders the viewed TA's read result with no forms. No route returns document bytes: bytes go only through TA Delivery's POST retrieval routes and its release check (B12).

### 4.1 Scope predicates (`policy.scope`)

| List action | TA | Operator | SuperAdmin | SV |
|---|---|---|---|---|
| `intake.read` (attempts, rows, questions, source files, incidents) | `x.ta_account_id = $actor` | `FALSE` | `TRUE` | viewed TA's predicate |
| `document.read_metadata` (versions in a group) | `v.ta_account_id = $actor` | versions with an association to an application where `a.assigned_operator_id = $actor` or an active `group_read` grant on `v.group_id` | `TRUE` | viewed account's predicate |

### 4.2 TA surface

| Method, path | Action | Shows | Visible unavailable states (reason code) |
|---|---|---|---|
| `GET /ta/groups/:groupId/intake` | `intake.read` (group owner) | attempts of the group (state, kind, counters, created), open incident count, chain links; start panel | `group_closed`; `offering_not_launched` (no offering of the country admits `start_intake`); `capacity_queue` (all slots busy); `capacity_storage`; static boundary lines: private sources EXCLUDED, imports of historical/in-flight cases EXCLUDED, hosted OCR/AI EXCLUDED, folder providers other than Google Drive unsupported |
| `GET /ta/groups/:groupId/intake/new/individual` | `intake.start` | form: identity fields; offerings of the country with cost/estimate/required documents from the snapshot; one upload field per declared requirement type | per offering: `offering_not_launched`, `offering_out_of_launch_scope`, `offering_suspended`, `offering_withdrawn`, `binding_incompatible`, `declaration_item_unresolved` (option disabled with the message) |
| `GET /ta/groups/:groupId/intake/new/bulk` | `intake.start` | form: source kind, URL or file, optional companion sheet, services (folder without sheet); ALTCHA widget (`script-src 'self'` on this page only) | as above; `folder_provider_unsupported` hint |
| `POST /ta/groups/:groupId/intake/individual` | C-I1 | 303 → attempt page or the 409 form with `duplicate_open_scope` links | — |
| `POST /ta/groups/:groupId/intake/bulk` | C-I2 | 303 → attempt page | — |
| `GET /ta/intake/:attemptId` | `intake.read` | state + reason message; banner "Fully processed means all checks ran. It does not mean the data is correct, submitted or ready for filing" (B16); counters; open questions with answer forms; rows (paged 100) with per-service outcome code and links to readable applications; source files (state, code, display name, size); ignored columns; snapshot (offering title, baseline version label); chain (previous/next attempts) | Correct: `attempt_in_progress`, `correction_not_applicable`; Resume: only in `paused_actor_revoked`; Abandon: `attempt_terminal` |
| `GET /ta/intake/:attemptId/rows/:rowId` | `intake.read` | mapped values, applicant key source, files and their document states, per-service results, correction match and class, incidents | — |
| `POST /ta/intake/:attemptId/questions/:questionId/answer` | C-I3 | — | — |
| `POST /ta/intake/:attemptId/correction`, `/abandon`, `/resume` | C-I4, C-I5, C-I6 | — | — |
| `GET /ta/intake/incidents`, `GET /ta/intake/incidents/:incidentId` | `intake.read` | open and disposed incidents (kind, owner, related applications and versions, options: correct the source or abandon the row) | "SuperAdmin dismissal does not cancel any application" note |
| `GET /ta/applications/:applicationId/documents` | `document.read_metadata` | requirement evidence (Section 3.4.5): type, mandatory/optional, status, validity results with codes, conflicts (also for optional), associated versions with safety/extraction states; actions | Upload/replace/associate disabled with `awaiting_formal_return`, `hold_*`, `filing_possibly_occurred`, `application_not_open`; byte retrieval offered only for `positive` associations; otherwise "Preview unavailable until the document is accepted for this application" (B12) |
| `GET /ta/groups/:groupId/documents` | `document.read_metadata` | group versions without a positive association: processing state, classification proposal, extraction status, failure code | — |
| `GET /ta/documents/:versionId` | `document.read_metadata` | metadata, safety verdict codes, extraction proposal fields (owner TA only), manual resolution form, classification form | resolution: `identity_conflict_unresolved`, `extraction_already_verified`; scanner wait: `scanner_unavailable` ("waiting for the malware scanner; the file stays quarantined") |
| `POST /ta/applications/:applicationId/documents[...]`, `POST /ta/documents/:versionId/{resolve-extraction,classification}` | C-D1…C-D5 | — | — |

### 4.3 Operator surface

| Method, path | Action | Shows |
|---|---|---|
| `GET /ops/applications/:applicationId/documents` | `document.read_metadata` (asg or grant) | as the TA page, read-only unless `assistance_in_progress` |
| `GET /ops/applications/:applicationId/documents/:versionId` | same | metadata and extraction proposal (asg only; grantee sees metadata without extracted fields) |
| `POST /ops/applications/:applicationId/documents[...]` | C-D1…C-D5 (asg in assistance) | — |

Operators have no intake pages: intake is TA-owned (contract §5.3).

### 4.4 SuperAdmin surface

| Method, path | Action | Shows |
|---|---|---|
| `GET /admin/intake/attempts` | `queue.read` | search by TA, group, state, kind; counts only |
| `GET /admin/intake/attempts/:attemptId` | `intake.read` (SuperAdmin) | the TA attempt page read-only |
| `GET /admin/intake/incidents` | `queue.read` | open intake incidents (all owners), age, kind, related ids |
| `POST /admin/intake/incidents/:incidentId/dismiss` | C-I7 | — |
| `GET /admin/documents/queue` | `tasks.read_failures` | versions with `check_exhausted`, `scanner_unavailable` or worker-failure codes: ids, TA, group, code, age; no display names, no extracted data |
| `POST /admin/documents/:versionId/requeue` | C-D6 | — |

### 4.5 Read queries (module-internal, all scoped)

`listAttempts(tx, actor, groupId?, page)`, `attemptDetail(tx, actor, attemptId)`, `rowsPage(tx, actor, attemptId, page)`, `listIntakeIncidents(tx, actor, filter)`, `documentsForApplication(tx, actor, applicationId)`, `groupDocuments(tx, actor, groupId)`, `versionDetail(tx, actor, versionId)`. Each first calls `policy.authorize` on the parent resource and then applies the list predicate.

## 5. Internal tasks, workers and timers

### 5.1 Task definitions

| Kind | Dedupe key | On behalf | Effect class | Max attempts / lease | Prepare re-checks (skip ⇒ reason) | Effect | Terminal failure owner and visible state | `onRevoked` |
|---|---|---|---|---|---|---|---|---|
| `intake.fetch_source` | `intake.fetch_source:<attempt>:g<gen>:<role>` | TA | idempotent (public GET) | 3 / 90 s | attempt active, generation, state ∈ {received, preflight}; group open; storage admission (defer) | fetch worker `fetch_public` → staged blob | TA: attempt `preflight_failed` + fetch code | attempt `paused_actor_revoked` |
| `intake.preflight` | `intake.preflight:<attempt>:g<gen>` | TA | none | 3 / 30 s | attempt `preflight`; source versions settled (else defer) | none | TA: `preflight_failed`/`internal_retry_exhausted` | paused |
| `intake.parse_sheet` | `intake.parse_sheet:<attempt>:g<gen>:<phase>` | TA | idempotent (sandboxed read) | 3 / 150 s | attempt `preflight`/`awaiting_answer`→re-plan; generation; storage admission (defer) | parse worker `read_spreadsheet` / `read_folder_listing` (phase A only) | TA: `preflight_failed`/`source_unreadable` | paused |
| `intake.fetch_row_files` | `intake.fetch_row_files:<row>:g<gen>` | TA | idempotent | 3 / 600 s (heartbeat) | attempt `processing`; generation; row `pending`; storage admission (defer) | fetch worker per unfetched link, sequential | TA: affected files `unreadable`/code; row continues (draft with missing requirement) | paused |
| `intake.process_rows` | `intake.process_rows:<row>:g<gen>` and `…:<attempt>:final:g<gen>` | TA | none (DB only) | 5 / 30 s | attempt `processing`; generation; row `pending` | none | TA: row `failed`/`internal_retry_exhausted` (eligible) | paused |
| `doc.scan` | `doc.scan:<version>[:r<n>]` | — | idempotent (clamd read-only) | 5 / 60 s, backoff 30 s → 15 min | version current, `quarantined`/`safety_retry_wait`, bytes in quarantine (else defer while `pending_move_to` **and** the move task is not terminal; rev 2, REC-17: a terminal move has already marked the version `unavailable`, so prepare skips as `obsolete`, never defers forever) | stat, magic sniff, clamd | SuperAdmin documents queue: `safety_retry_wait`, `check_exhausted`, `scanner_unavailable` | — |
| `doc.parse` | `doc.parse:<version>[:r<n>]` | — | idempotent (sandboxed) | 3 / 180 s | version current, `safety_passed`; storage admission (defer) | parse worker jobs per plan (Section 5.6) | SuperAdmin queue: `extraction_failed` (structural not passed ⇒ stays not content-safe) with `worker_timeout`/`worker_failed` | — |

Rules:
- Every record step uses conditional updates on the subject state and generation, so a stale runner, a duplicate lease or an Nth retry changes nothing twice (contract §4.6, B35).
- A row file fetched by a previous generation is not fetched again: `intake_source_files_locator_uq` makes the record converge, and the fetch effect is skipped when the source file already has a version.
- "Defer" (storage admission, unsettled dependency) reschedules the task without consuming an attempt (CCR-04, accepted in contract revision 2; this also resolves review finding REC-22). A defer is allowed only while the waited-for event can still happen (contract 01 §4.6).
- Internal tasks never submit, assign, file, pay or notify (B14, B35).

### 5.2 Worker sandbox profiles (`WorkerRunner`, contract §10.3)

| Property | Fetch worker | Parse worker |
|---|---|---|
| Network | `--share-net`; outbound HTTPS only through the fetch job's checks (Section 5.4) | none (`--unshare-all`); `connect()` fails |
| Filesystem | read-only: Node prefix, `node_modules`, `src`, `/usr`, `/etc/resolv.conf`, CA bundle; read-write: `/work` (`<dataDir>/work/<task id>/`), `/tmp` tmpfs | read-only: Node prefix, `node_modules`, `src`, `/usr`, toolchain dir (`/opt/tm-toolchain`), tessdata; input files at `/in/<name>` (read-only binds of quarantine blobs); read-write `/work`, `/tmp` |
| Not bound (unreachable) | data dir except `/work`, secrets dir, PostgreSQL socket dir, clamd socket, repository `.git`, home | same |
| Environment | cleared; `NODE_OPTIONS` unset; no proxy variables | cleared except `LD_LIBRARY_PATH`, `TESSDATA_PREFIX`, `OMP_THREAD_LIMIT=1` |
| Process | `--die-with-parent --new-session --unshare-pid`; runner spawns detached; timeout ⇒ `SIGKILL` to the process group; PID-namespace init dies ⇒ every descendant dies | same |
| Limits (start values, B38; rev 2, BND-01: contract 01 §10.3) | wall 60 s per URL job; CPU 30 s; cgroup `MemoryMax` 256 MiB; `TasksMax` 32; file size 32 MiB; tmp 64 MiB; no `prlimit --as`/`--nproc` | per job (Section 5.3); cgroup `MemoryMax` 768 MiB; `TasksMax` 64; native tools `prlimit --as` 512 MiB; file size 64 MiB; tmp 256 MiB; `sharp.concurrency(1)`, `VIPS_CONCURRENCY=1` |
| Concurrency | 1 | 1 |

Self-test at server start and in T-W06–T-W09 (rev 2, BND-01; contract 01 §10.3): the real launch line runs a no-op job of each kind inside its `systemd-run --user --scope`; an allocation probe beyond `MemoryMax` is killed; a fork probe stops at `TasksMax`; `tesseract`, `qpdf`, `pdftoppm` resolve their libraries inside the sandbox with `LD_LIBRARY_PATH=/opt/tm-toolchain/root/usr/lib/x86_64-linux-gnu`; `bwrap --size` is enforced. A failed self-test marks worker health `down` and stops worker admission; it never runs a job without limits. (Task-level handling of a worker or scanner outage, rather than per-item attempts, is the recorded P1 item REC-14.)

### 5.3 Worker contract `tm-worker/1`

Envelope (contract §10.3): request `{ contract, kind, job, inputs[{name, bindPath}], params, limits }` on stdin; exactly one JSON response on stdout ≤ 1 MiB; large results are files in `/work/out/` listed in `outputs` with size and SHA-256, verified by the runner. Schemas live in `src/workers/contract.ts` (zod) and are shared by runner and worker. Any change to a job name, a param, a result field or a code is a contract bump to `tm-worker/2`, recorded in the release manifest and checked by `--contract` during cutover verification (B39). Response `error.code` ∈ the closed list below; anything else ⇒ `worker_failed`.

| Job | Kind | Params | Result / outputs | Wall limit |
|---|---|---|---|---|
| `fetch_public` | fetch | `{ url, expect: 'file'|'html_listing', maxBytes }` | `{ status, hops, finalHost, contentTypeHeader (≤ 100 chars), sizeBytes, sha256 }`; output `body` | 60 s |
| `inspect_pdf` | parse | `{ maxPagesForCount }` | `{ qpdf: 'ok'|'warnings'|'errors', encrypted, pageCount, activeContent: ActiveKey[] }` | 30 s |
| `extract_pdf_text` | parse | `{ maxPages: 20, maxChars: 200000, mode: 'mrz'|'tokens' }` | `{ hasText, textChars, mrz?: MrzResult, tokens?: string[] (≤ 2000) }` — never full text | 30 s |
| `ocr_pdf` | parse | `{ pages: 1..3, dpi: 300, mode: 'mrz_probe'|'mrz'|'tokens' }` | `{ pagesOcred, meanConfidence, mrz?, tokens? }` | 120 s |
| `decode_image` | parse | `{ maxPixels: 40000000 }` | `{ format, width, height, orientation, channels, hasAlpha }` | 20 s |
| `ocr_image` | parse | `{ mode, maxPixels }` | as `ocr_pdf` | 60 s |
| `inspect_spreadsheet` | parse | `{ maxEntries: 2000, maxUncompressed: 104857600, maxRatio: 100 }` | `{ kind: 'xlsx'|'csv', entries, uncompressedBytes, sheets: [{ nameDigest, rows, cols }], date1904 }` | 30 s |
| `read_spreadsheet` | parse | `{ sheetIndex?, maxRows, maxCols, maxCellChars, headerScanRows }` | `{ sheetNames, rowCount, truncatedRows, overlongCells }`; output `rows.json` ≤ 16 MiB: `[{ rowNo, cells: [{ t, v, link? }] }]` | 60 s |
| `read_folder_listing` | parse | `{ maxEntries: 600 }` | output `entries.json`: `[{ name, id, kind: 'file'|'folder'|'google_doc'|'google_sheet' }]` | 10 s |

Closed error codes: `url_invalid`, `scheme_not_https`, `credentials_in_url`, `port_not_allowed`, `host_not_public`, `dns_failed`, `connect_blocked_private`, `tls_failed`, `redirect_limit`, `redirect_not_allowed`, `http_status`, `too_large`, `fetch_timeout`, `unexpected_encoding`, `not_a_file`, `pdf_unreadable`, `pdf_encrypted`, `image_unreadable`, `pixel_limit`, `zip_limit`, `spreadsheet_unreadable`, `listing_unreadable`, `ocr_failed`, `limit_exceeded`.

### 5.4 Fetch job: SSRF and retrieval rules (B36)

| # | Rule |
|---|---|
| 1 | Parse with WHATWG `URL`. Scheme MUST be `https:`. Userinfo present ⇒ `credentials_in_url`. Port MUST be empty or 443. Host MUST be a DNS name (IP literals, including decimal, octal, hex and IPv6 forms, ⇒ `host_not_public`), MUST NOT be single-label, `localhost`, or end in `.local`, `.internal`, `.localhost`, `.home.arpa`. IDN converted to ASCII before checks. |
| 2 | Resolve A and AAAA. Every address MUST classify as public unicast with `ipaddr.js` **and** fall outside the explicit deny list: 0.0.0.0/8, 10/8, 100.64/10, 127/8, 169.254/16 (incl. 169.254.169.254), 172.16/12, 192.0.0/24, 192.0.2/24, 192.88.99/24, 192.168/16, 198.18/15, 198.51.100/24, 203.0.113/24, 224/4, 240/4, 255.255.255.255; ::/128, ::1, ::ffff:0:0/96 (checked on the embedded IPv4), 64:ff9b::/96 and 64:ff9b:1::/48 (embedded IPv4), 100::/64, 2001::/32, 2001:db8::/32, 2002::/16 (embedded IPv4), fc00::/7, fe80::/10, ff00::/8. One non-public address ⇒ reject the host (`host_not_public`). |
| 3 | Connect only to the validated addresses: the request's `lookup` returns the pinned list (no second resolution, so DNS rebinding cannot switch the target). `request-filtering-agent` re-checks the actual socket remote address at connect time (`connect_blocked_private`). TLS verification on, SNI and `Host` = original host name. |
| 4 | Request: `GET`; headers only `User-Agent: TravelMudraFetch/1`, `Accept: */*`, `Accept-Encoding: identity`. No cookies, no `Authorization`, no `Referer`, no proxy. `Set-Cookie` responses are ignored. |
| 5 | Redirects (301, 302, 303, 307, 308) are followed manually up to 5 hops; each `Location` is resolved and passes rules 1–4 again; `https` → `http` ⇒ `redirect_not_allowed`. No header is carried across hops. |
| 6 | Response: status 200 only (`http_status`). `Content-Length` > `maxBytes` ⇒ abort; stream counter aborts at `maxBytes + 1` (`too_large`); connect timeout 10 s, idle timeout 15 s, total ≤ job wall. `Content-Encoding` other than identity ⇒ `unexpected_encoding`. For `expect: 'file'`, an HTML body (by `Content-Type` or by sniff) ⇒ `not_a_file` (typical for sign-in pages of private links). |
| 7 | Output only to `/work/out/body`; the runner moves it to a staging blob after verifying size and SHA-256; quarantine follows through `registerVersion`. |
| 8 | Test environment only: `fetch.testAllowHosts` and `fetch.testResolver` let fixtures resolve names to loopback; configuration validation refuses both outside `TM_ENV=test`. |

The fetch worker contacts only hosts derived from TA-supplied links and the fixed Google export/listing hosts. No other outbound call exists in the document pipeline (no hosted OCR/LLM, no telemetry; B15, B42).

### 5.5 Spreadsheet reading (parse worker only)

- SheetJS CE 0.20.3 (CDN tarball, EO-02): `XLSX.read(buf, { type: 'buffer', dense: true, cellFormula: false, cellHTML: false, cellNF: false, cellStyles: false, bookVBA: false, sheetRows: headerScanRows + maxRows + 1 })`. Formulas are never evaluated: only cached values are read. External links, data connections and embedded objects are ignored and never fetched.
- `inspect_spreadsheet` parses the zip central directory in-house before SheetJS and refuses encrypted entries, more than 2000 entries, more than 100 MiB uncompressed or any entry ratio above 100 (`zip_limit`).
- CSV: `codepage: 65001`; BOM stripped; non-UTF-8 ⇒ `spreadsheet_unreadable`.
- Limits (configuration): `intake.maxRows` 1000 data rows (more ⇒ `preflight_failed`/`too_many_rows`), `intake.maxColumns` 64, `intake.maxCellChars` 2048 (longer cell ⇒ that row `failed`/`cell_too_long`), `intake.maxSheets` 20.
- Dates: raw serials are returned; the server converts with the `date1904` flag. Hyperlinks: `cell.l.Target` is returned as `link`.

### 5.6 Extraction pipeline and `extract/1`

| Plan | Steps |
|---|---|
| `none` | structural only; extraction status `not_applicable` |
| `mrz` (identity role) | PDF: `extract_pdf_text` (mode `mrz`); no MRZ found ⇒ `ocr_pdf` pages 1–3. Image: `ocr_image`. OCR flow: sharp rotate (EXIF), greyscale, normalize → Tesseract `--psm 6 -l eng` TSV; find two consecutive lines of 44 characters over `[A-Z0-9<]` after mapping `«`→`<` and removing spaces; crop their bounding box + 8 % margin; re-OCR with `tessedit_char_whitelist=ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<`; parse with `mrz` (`autocorrect: true`) |
| `mrz_probe` (folder files) | page 1 only; on a valid TD3 MRZ continue as `mrz` and propose classification `passport` (basis `mrz_detected`) |
| `artifact_tokens` (official results, for Operations) | `extract_pdf_text` mode `tokens`, else OCR pages 1–3; returns passport-number candidates (`^[A-Z][0-9]{7}$`), normalized upper-case **name tokens** (same normalization as Section 3.4.2 step 7; ≤ 2000) and, when two MRZ lines are found, the parsed `MrzResult`. Status `extracted` when at least one passport-number candidate exists; otherwise `failed` (`mrz_not_found`/`extraction_tool_failed`). Rev 2 (BND-13): this is exactly the input of Operations' `assoc/1` (record 13 §3.15), which matches name and passport number (B13) |

`MrzResult = { format: 'TD3'|'TD1'|'TD2'|null, valid, fields: { documentCode, issuingState, surname, givenNames, documentNumber, nationality, birthDate, sex, expirationDate, personalNumber }, checks: { documentNumber, birthDate, expirationDate, personalNumber, composite }, autocorrections, autocorrectedCovered, meanConfidence, source: 'pdf_text'|'ocr' }`. Dates are resolved to `YYYY-MM-DD`: expiry → 20YY; birth → 19YY if YY > current two-digit year, else 20YY. Confidences are integers 0–100 (canonical JSON refuses floats).

| `extract/1` status | Condition |
|---|---|
| `extracted` | TD3; all check digits valid (document number, birth date, expiry, composite); autocorrections ≤ `extract.maxAutocorrections` (2) and every corrected character lies in a check-digit-protected field (`autocorrectedCovered`); `meanConfidence` ≥ `extract.mrzMinMeanConfidence` (80) for OCR (text PDFs count as 100) |
| `low_confidence` | check digits valid but a confidence or autocorrection threshold fails |
| `conflict` | MRZ found but a check digit fails after autocorrection; or the scanned pages contain two valid MRZ blocks with different document numbers. (A conflict between the MRZ and the sheet, the form or the snapshot is an association conflict, Section 3.4.2.) |
| `failed` | no MRZ found on the scanned pages, or the OCR tool failed (`mrz_not_found`, `extraction_tool_failed`) |
| `not_applicable` | plan `none` |

Names have no MRZ check digit: they are always compared by deterministic equality (Section 3.4.2) and never auto-written into an existing snapshot. Changing any threshold or tool version is a new extractor contract (`extract/2`); existing verdicts keep their recorded contract (B06 exact identities).

### 5.7 Malware scanning

`doc.scan` streams the quarantined file to clamd over the private socket (contract §10.4). `stream: OK` ⇒ clean; `<sig> FOUND` ⇒ `rejected_malware` (the signature is mapped to the code `malware_found`; the signature name is stored only inside `checks.clamdSignatureClass` as a closed class `eicar_test`/`other`); any other answer, socket error or 30 s timeout ⇒ `scanner_unavailable`, fail closed: bytes stay in quarantine, nothing reads content, the task retries with backoff, and exhaustion lands in the SuperAdmin documents queue. A scanner signature update never re-opens a settled verdict automatically.

### 5.8 Temporary-space admission (B36, B38)

| Point | Check | At the limit |
|---|---|---|
| Upload routes and `intake.start_*` | `statfs(dataDir).free ≥ storage.minFreeBytes + request bytes` and `Σ size(sys_blobs in staging/quarantine, state intent/staged/referenced, not canonical) ≤ storage.maxStagingBytes` | refuse with `capacity_limited`/`capacity_storage`; nothing staged |
| Before each worker job | `free ≥ minFreeBytes + tmpBytes + job maxBytes` | task defers (CCR-04); accepted rows and owners stay; attempt page shows "waiting for storage capacity" |
| Per attempt | `files_bytes ≤ intake.maxAggregateBytes` (512 MiB) | further files `unreadable`/`aggregate_limit` (eligible for retry) |

Admission stops before exhaustion; it never deletes accepted content to make room.

### 5.9 Cleanup rules

| Content | Rule |
|---|---|
| Staged blob without a committed owner reference | removed by `blob.cleanup_staging` only after `staging_lease_expires_at` (uploads 6 h, worker outputs 6 h) and only through the conditional claim (contract §4.12 rule 2); a record step that loses the race fails with `blob_not_referenceable` and retries its idempotent effect |
| Quarantine bytes of `safety_rejected` and `excluded_unrelated` versions; canonical bytes of a version a person classified `unrelated` that was never positively associated | disposed through `BlobStore.dispose` (CCR-03) in the deciding transaction; metadata rows, verdicts and minimal reason stay; `display_name` → NULL |
| Quarantine bytes of content-safe versions | moved to `canonical`; never disposed automatically |
| Canonical bytes; referenced quarantine bytes of unsettled versions; intake source sheets and listings | never removed automatically (B42; retention is OD-I1) |
| Worker work directories | the runner removes `/work` after each job in a `finally`; `blob.cleanup_work_dirs` removes directories whose task is not `leased` and that are older than 1 h |
| Failed jobs | the scoped failure code stays on the version or source file; the input bytes stay in quarantine for retry; stderr is discarded except its length |

### 5.10 Timers

This record owns no periodic timer. Progress is event-driven: commit-time enqueues, the settled listener and kernel lease recovery. Periodic kernel jobs used: `cleanup_enqueue` (10 min; staging, work directories, disposal claims), `lease_recovery` (15 s), `clock_check` (60 s). Date-based validity is computed on read; when clock health is `degraded`, `requirementEvidence` returns `validity_unknown` for checks that compare with the current date (none in `documents.validity/1`; travel-date checks use stored dates).

## 6. Deliberate boundaries in this scope

| Boundary | Spec | How it is visible and unavailable | What MUST NOT exist |
|---|---|---|---|
| Universal private-source intake — EXCLUDED | B14, B42 | A link that needs sign-in returns HTML or 401/403 ⇒ file `unreadable` / `link_not_public_or_not_file` with the message "Only publicly accessible links are supported; private sources are not supported". The start pages state it. | No OAuth, no Google API key, no credential field, no cookie forwarding |
| Historical/in-flight imports and other-tool integration (e.g. Tally) — EXCLUDED | B02, B42 | Start pages state "only new cases". Status/filing/payment columns are listed as ignored columns. | No import source kind; intake creates only drafts |
| Hosted OCR/LLM and third-party customer-data sharing — EXCLUDED | B15, B42 | Document pages state "processed locally on TravelMudra's server". | No outbound call from the parse worker (no network namespace); no extraction provider seam |
| Automatic application/document deletion — EXCLUDED | B42 | No delete action on any version page. Disposal is limited to rejected and unrelated bytes (Section 5.9). | No retention-expiry task |
| Cross-group data reuse — EXCLUDED | B03, B42 | Associating a version to another group's application returns the 404 page. | No hash-based dedupe across scopes; no verdict copy by hash |
| Applicant portal / applicant upload link — EXCLUDED | B01, B42 | Not offered. | No unauthenticated upload route |
| Bulk submits, assigns or files — not allowed | B14, B17 | The attempt page states "Bulk intake creates drafts only; you submit each application yourself". | No call to Core submission, assignment, authorization or notice writers from Intake |
| Mixed row patterns — not guessed | B14 | Question `row_pattern_mixed` with only "upload a corrected source" or "abandon". | No automatic pattern choice |
| Strong-identifier conflict and same-name ambiguity — unresolved | B15 | `conflict` associations and `identity_conflict`/`ambiguous_*` incidents with messages; manual resolution refused with `identity_conflict_unresolved`. | No name-only or similarity-based merge or match |
| In-process country adapter runaway — OWNER_DECISION (accepted risk) | B36, B45 | Adapter errors become `validity_unknown` / `country_adapter_error` with a `country_defect` incident. | No adapter sandbox, broker or per-country scheduler |
| Exact bulk UX refinements — PARKED | B45 | Functional pages only; no claim of a refined bulk UX. | — |
| Folder providers other than Google Drive — engineering limit pending OD-I2 | B14 | `validation_failed` / `folder_provider_unsupported` at start with the supported provider named. | No guessed scraping of other providers |
| Retention of intake source files and unassociated versions — OD-I1 | B15, B42, B33 | Sources are kept quarantined, never released, included in backups; the attempt page states "source file retained". | No automatic expiry; no disposal outside Section 5.9 |
| Byte preview of non-positive versions | B12 | "Preview unavailable until the document is accepted for this application". | No preview route outside TA Delivery's release check |
| Real-provider readiness of ClamAV signatures and OCR accuracy | B37, B41 | Local tests use real clamd and Tesseract with synthetic fixtures; no claim about production accuracy. | No claim that local OCR results are identity decisions |

## 7. Test plan

Fixtures are synthetic only (brief §0): IND-format synthetic passport numbers, `SYN` names, synthetic MRZ images rendered with sharp, synthetic PDFs from `pdf-lib`, EICAR, a PDF with `/JavaScript` and `/Launch`, a zip-bomb xlsx, an encrypted PDF, a 41 MP PNG, a local HTTPS fixture server with a test CA (loopback, allowed only through `fetch.testAllowHosts` in `TM_ENV=test`) that records every request, and a fixture resolver (`fetch.testResolver`). "Asserts persisted" lists rows/facts/files that MUST exist; "Forbidden" lists effects that MUST NOT exist (checked by counting rows, files on disk, spawned processes or recorded connections).

### 7.1 Intake admission and preflight

| # | Test | Rules | Level | Asserts persisted | Forbidden effects |
|---|---|---|---|---|---|
| T-I01 | `start_bulk` when no offering of the country is launched for the TA | B07, B14 | I | none | no `intake_attempts`, no `sys_tasks`, no fact, no `sys_operations` row |
| T-I02 | `start_bulk` on another TA's group, a closed group, and by a suspended TA session | B10, B14 | I | none | 404 for foreign group (same page as missing); no attempt; no staged blob referenced |
| T-I03 | Missing, invalid, expired and reused ALTCHA payload | B08 | I | `iam_captcha_spent` row for the first use only | no attempt; second use rejected `bot_check_failed` |
| T-I04 | Third concurrent bulk start by one TA (three connections) | B38, B35 | M | exactly two active attempts with slots 1 and 2 | third has no row; no orphan task |
| T-I05 | Storage below `minFreeBytes` (configured high in test) at start and during an active attempt | B36, B38 | M | start refused `capacity_storage`; active attempt tasks stay `pending` with unchanged `attempts`; rows resume after the limit is lowered | no blob intent created while limited; no row lost or failed by the wait |
| T-I06 | Sheet link returns a sign-in HTML page | B14, B42 | M | attempt `preflight_failed`/`link_not_public_or_not_file`; `intake.preflight_failed` fact | zero `core_applications`, zero `doc_associations`, zero `intake_rows` |
| T-I07 | Uploaded xlsx is EICAR | B14, B15, B36 | M | safety verdict `rejected_malware`; version `safety_rejected`; bytes `disposed` | blob file absent from disk; no `doc.parse` task; parse worker spawn count 0; no rows |
| T-I08 | Zip-bomb xlsx, encrypted xlsx, `.xlsm`, `.xls` | B36 | M | structural `rejected_decode` / `rejected_format`; `preflight_failed` | no `read_spreadsheet` job run; no rows |
| T-I09 | Sheet with 1001 data rows; sheet with no recognizable header | B14, B38 | M | `preflight_failed` with `too_many_rows` / `header_not_found` after the `header_row` answer `no_header` | no rows marked accepted; no applications |
| T-I10 | Same Google Sheet started twice as a root in one group (sequential and concurrent) | B35 | M | sequential: second refused `source_already_ingested`; concurrent: one root has rows, the other `preflight_failed`/`source_already_ingested` | never two roots with `has_rows` for one source and group |

### 7.2 Mapping, patterns and questions

| # | Test | Rules | Level | Asserts persisted | Forbidden effects |
|---|---|---|---|---|---|
| T-I11 | Irregular headers: title rows, synonyms ("PP No", "D.O.B"), merged header, blank rows, totals row, extra tabs answered | B14 | U + I | correct `mapped` per row; totals row `excluded`/`not_an_applicant_row`; one `select_tab` question | no question for non-consequential columns |
| T-I12 | Two columns both match `passport_number` | B14 | I | `column_mapping` question; state `awaiting_answer` | zero applications before the answer |
| T-I13 | Answer with stale attempt revision; two concurrent answers | B35 | I | first answer recorded; generation +1 | second answer leaves no change (`stale_revision`); no duplicate re-plan task |
| T-I14 | All dates ≤ 12/12 | B14 | U + I | `date_order` question; after answer `dmy`, dates parse | no date guessed before the answer |
| T-I15 | Unknown service label and a label matching two offerings | B14 | I | one `service_label` question per label; answer applies to all rows with the label | no draft for those rows before the answer |
| T-I16 | One row listing three services | B14, B03 | I | three drafts; three `intake_row_effects`; three `intake_row_services` `created`; each draft governing ids = attempt snapshot | no shared snapshot row between drafts |
| T-I17 | Multiple rows per applicant used consistently; passport only on one row | B14 | I | one draft per (applicant, service); passport `proposed`/`positive` association on each of that applicant's drafts whose offering declares it | no association to another applicant's draft |
| T-I18 | Mixed pattern batch | B14 | I | `row_pattern = mixed_refused`; question with exactly two options | zero applications; no `intake_row_effects` |
| T-I19 | Repeated key with different date of birth | B14, B15, B16 | I | `identity_conflict` incident per affected row; other rows accepted | no draft for that key |
| T-I20 | Row without passport identity and no passport document; an existing application with the same name in the group | B15, B16 | I | `ambiguous_applicant` incident | no association or row effect pointing at the same-name application |
| T-I21 | Systematic plan fault: passport column holds phone numbers in 40 of 40 rows | B14 | I | `systematic_fault` question in the plan; state `awaiting_answer` | zero applications |
| T-I22 | Systematic processing fault: passport column links to photos; 3 of the first 4 processed rows `mrz_not_found` | B14 | M | attempt `paused_mapping_fault`, generation +1, `mapping_fault` incident; rows accepted before the pause stay with their drafts | no row accepted after the pause commit; old-generation tasks end `skip`; after `remap` no duplicate application |

### 7.3 Row acceptance, independence, retries and concurrency

| # | Test | Rules | Level | Asserts persisted | Forbidden effects |
|---|---|---|---|---|---|
| T-I23 | Row with identity and service but broken links | B14, B16 | M | draft created; requirement evidence `missing`; source files `unreadable` with codes; row `accepted` | no placeholder document version |
| T-I24 | One row's passport is EICAR; nine rows clean | B14, B16 | M | nine rows accepted with positive passports; the EICAR row's draft has `missing` passport; disposed bytes | the failure does not change any other row's state or counters wrongly |
| T-I25 | After `fully_processed`: inspect all Core tables | B14, B17 | I | lifecycle `draft` for every created application | zero `core_submissions`, `core_assignments`, `core_action_authorizations`, `dlv_notices`, `dlv_email_sends` for these applications |
| T-I26 | Nth retry of `process_rows`: fault `task.after_effect`/`task.lease_expire`, then run the task 5 times; plus kill the server process after the record commit | B16, B35 | M | one application per scope; one `intake_row_effects` row; exactly one `intake.row_result_recorded` with `resolvedPriorEffect=false` | no second application; no second association; measures count the row once |
| T-I27 | Concurrent: `process_rows` for scope X vs TA form `intake.start_individual` for scope X (two connections, many iterations) | B35, B03 | M | exactly one open application for X; the other side `conflict_duplicate` (form) or `matched_existing` + `possible_duplicate` (row) | never two open applications for X |
| T-I28 | Different root (edited Excel) hits an existing open scope | B16, B03 | I | `matched_existing` + `possible_duplicate` incident with `dataDiffers` | existing application's revision, snapshot version and associations unchanged (before/after compare) |
| T-I29 | `start_bulk` with fault `command.lose_ack`; resubmit same key; then same key with a different file | B35 | M | one attempt; replay returns it; second staged blob removed after the lease | no second attempt; `conflict_operation_key` writes nothing |
| T-I30 | Launch suspension committed between two rows; concurrent suspension vs row acceptance | B07, B35 | M | rows before keep drafts; later rows' service `refused`/`offering_suspended` | no draft created after the suspension commit |
| T-I31 | Baseline published while an attempt is processing | B06, B16 | I | late drafts carry the attempt snapshot's baseline and get an impact item `unknown` (CCR-08) | no draft silently on the new baseline; no draft outside impact review |
| T-I32 | TA suspended mid-attempt; restored; `intake.resume` | B10, B35 | M | tasks `cancelled_revoked`; attempt `paused_actor_revoked`; after resume the remaining rows accepted | no row accepted between the suspension commit and resume; no duplicate application after resume |
| T-I33 | Group closure attempted with an open intake incident and with an active attempt | B25 | I | `core.close_group` refused; succeeds after disposal and attempt end | group never `closed` with an open incident or active attempt |

### 7.4 Corrections and incidents

| # | Test | Rules | Level | Asserts persisted | Forbidden effects |
|---|---|---|---|---|---|
| T-I34 | Correction with one changed row, one failed row fixed, one omitted row, one new applicant | B16 | M | changed row `corrected` (new snapshot version); failed row `accepted`; new applicant `routed_to_new_intake`; incident of the failed row `resolved_by_correction` | omitted row's application revision unchanged; no application for the new applicant |
| T-I35 | Changed row whose replacement passport is EICAR | B16 | M | row `correction_refused`/`correction_file_rejected` | application snapshot version unchanged; old association still `positive`; old version `current` |
| T-I36 | TA edited the draft after intake; correction changes the same draft | B16, B19 | I | `correction_refused`/`stale_target_revision` | no field overwritten |
| T-I37 | Correction targets an application already submitted | B16, B19 | I | `correction_refused`/`correction_target_not_draft` | no snapshot change; no readiness change |
| T-I38 | Correction changes surname for the same passport number | B19, B15 | I | `correction_refused`/`identity_change_requires_evidence` + `identity_conflict` incident | no identity field changed by intake |
| T-I39 | The same correction file uploaded three times | B16, B35 | M | all matched rows `untouched_by_correction` or `resolved_prior_effect`; failed eligible rows retried once each | zero new applications; zero new associations for unchanged rows |
| T-I40 | Two concurrent correction uploads on one chain | B35 | M | one correction attempt | other `conflict_duplicate`/`attempt_in_progress`; no second active attempt |
| T-I41 | Locator-based match needs confirmation; `reject` | B16 | I | `correction_match_confirm` question; rejected rows `unmatched` | no change to the original rows' applications |
| T-I42 | TA abandons an incident row; SuperAdmin dismisses another (with reason) | B16, B11 | I | incidents `resolved_by_ta_abandonment` / `dismissed_by_superadmin` with actor and reason facts | related existing applications: same lifecycle, outcome NULL, no `core_withdrawals` row |
| T-I43 | Dismissal without reason; by a TA | B11 | I | none | refused; incident stays `open` |

### 7.5 Documents

| # | Test | Rules | Level | Asserts persisted | Forbidden effects |
|---|---|---|---|---|---|
| T-D01 | Upload 5 MiB + 1 byte; GIF; PNG declared as PDF | B15 | I | `rejected_size` (route-level `document_too_large` for forms); `rejected_format` for GIF; PNG accepted with `declaredMismatch` | no clamd call for the oversize/GIF cases; no parse task |
| T-D02 | EICAR inside a PDF | B15, B36 | M | `rejected_malware`; bytes disposed | no `doc.parse` task row; parse worker not spawned (spawn counter) |
| T-D03 | clamd stopped during scan; restarted | B15, B36 | M | `scanner_unavailable` verdict; `safety_retry_wait`; later `passed` | no parse and no canonical move before `passed`; nothing marked passed while clamd was down |
| T-D04 | clamd down for all attempts; SuperAdmin requeue | B15, B36 | M | `check_exhausted`; queue row; requeue creates `doc.scan:<v>:r1` | no automatic pass; no TA-visible "accepted" |
| T-D05 | PDFs with `/JavaScript`, `/Launch`, `/EmbeddedFile`, `/XFA`, encryption | B36 | M | structural `rejected_active_content` / `rejected_decode`; bytes disposed | never `canonical`; never releasable |
| T-D06 | Corrupt JPEG; 41 MP PNG | B36 | M | `rejected_decode` / `pixel_limit` | no canonical bytes |
| T-D07 | Offering narrows photo to JPEG ≤ 1 MiB; PNG photo uploaded | B15 | I | association `rejected`/`format_not_accepted_by_offering`; requirement `missing` | no `positive` association |
| T-D08 | Synthetic passport text PDF; image with one O/0 confusion; broken check digit; low contrast image | B15 | M | `extracted` (pdf_text); `extracted` with 1 autocorrection; `conflict`; `low_confidence` → `manual_resolution_required` | no auto-positive association for `conflict`/`low_confidence` |
| T-D09 | Name order swapped vs MRZ; different surname | B15 | I | swapped ⇒ `positive` (token multiset); different ⇒ `conflict`/`name_mismatch`; submit blocked `identity_conflict_unresolved` | snapshot never changed by Documents |
| T-D10 | Sheet passport number ≠ MRZ number; then TA tries manual resolution | B15, B20 | I | `identity_conflict` incident; resolution refused `identity_conflict_unresolved` | no positive association; conflict cleared only after a replaced version |
| T-D11 | Flat folder: two applicants named `SYN SAME`; file `SYN SAME bank.pdf` | B15 | M | `ambiguous_document` incident | no association to either applicant |
| T-D12 | Guardian passport in a child's subfolder: offering with and without an `other_person` requirement | B15 | M | with: association to the guardian requirement only (`identity_role=false`); without: `ambiguous_document` | applicant key, snapshot and identity association never derived from the guardian passport |
| T-D13 | Optional bank statement present, mandatory photo missing; optional document with a non-identity conflict | B15 | I | requirement evidence: photo `missing` (mandatory), optional `conflict` visible | submit blocked only by the mandatory photo; optional never satisfies photo |
| T-D14 | Passport expiry 3 months after return; declaration requires 6; travel dates edited earlier | B15, B06 | I | `validity_failed`, then `satisfied` after the edit, on read; readiness fingerprint changes | no stored stale validity |
| T-D15 | Identical bytes uploaded in group A (positive) and group B | B12, B03, B42 | I | group B version starts `quarantined`, own scan verdict, no association | no verdict copied by hash; associating B's TA to A's application ⇒ 404; TA B cannot list or retrieve A's version |
| T-D16 | Canonical file corrupted after publication; retrieval attempted | B12 | M | `bytes_unavailable`, `doc.bytes_unavailable` fact, `bytes_integrity` ops incident; requirement `unreadable` | zero bytes sent; no substitute version |
| T-D17 | Crash at `blob.after_rename_before_record` during canonical publication | B12, B36 | M | repaired; exactly one `doc.bytes_available` fact; `bytes_state='canonical'` | no duplicate blob; no lost file |
| T-D18 | Unreferenced folder files (sheet mode); TA classifies a file `unrelated` | B15 | M | unreferenced entries `not_fetched_unreferenced`; classified file `excluded_unrelated`, `display_name` NULL, `doc.bytes_disposed` | unreferenced files never fetched (fixture records no request); disposed bytes absent from disk |
| T-D19 | Two concurrent manual resolutions of one version | B35 | I | one new current verdict; old `is_current=false` | two current verdicts impossible; loser `stale_revision` |
| T-D20 | Replace a positive passport with a valid one, then with an invalid one | B12, B19 | I | first: old association `revoked`, old version `replaced`, `core.noteEvidenceChanged` (material revision +1); second: old stays `positive` | no window with zero positive passport caused by a failed replacement |
| T-D21 | Delivery release check for `proposed`, `conflict`, `intake_source` and `safety_passed`-not-content-safe versions | B12 | I | `dlv_releases` rows `denied` with codes | zero bytes streamed |
| T-D22 | Country adapter validity check throws; another adapter loops past 200 ms; rev 2 (REC-07): the throw happens (a) inside a submit that is refused and (b) during a read-only page render | B36 | I | `validity_unknown`/`country_adapter_error`; exactly one `country_defect` incident attributed to that country in both (a) and (b), via `ops.attribute_country_defect` | other countries' requirement evidence unchanged; no process exit in the throw case |
| T-D23 | Upload on an assigned, not returned application by the TA; by the assigned operator outside `assistance_in_progress` | B18, B10 | I | TA refused `control_blocked`/`awaiting_formal_return`; operator refused `not_found_or_forbidden` (no `document.upload` relation) | no version referenced; staged blob cleaned after its lease |

### 7.6 Workers, cleanup and diagnostics

| # | Test | Rules | Level | Asserts persisted | Forbidden effects |
|---|---|---|---|---|---|
| T-W01 | URLs: `127.0.0.1`, `[::1]`, `10.0.0.1`, `169.254.169.254`, `[::ffff:127.0.0.1]`, `0x7f000001`, `2130706433`, ULA, CGNAT, `http:`, `user:pass@`, port 8443, single-label host, a name resolving to public + private | B36 | M | file `unreadable` with the exact closed code | fixture listeners on loopback/private receive zero connections |
| T-W02 | Redirect chains: public → private; 6 hops; https → http; → userinfo URL | B36 | M | `redirect_not_allowed` / `redirect_limit` / `host_not_public` / `credentials_in_url` | no connection to the private target |
| T-W03 | DNS rebinding: resolver returns public then loopback | B36 | M | fetch uses the pinned address only | zero connections to loopback; a forced socket to a private address is refused at connect (`connect_blocked_private`) |
| T-W04 | Header hygiene across a redirect that sets a cookie | B36 | M | fixture records only the allowed headers | no `Cookie`, `Authorization`, `Referer` sent on any hop |
| T-W05 | Oversize by `Content-Length`; chunked oversize; slow drip; `Content-Encoding: gzip` | B36, B38 | M | `too_large`, `fetch_timeout`, `unexpected_encoding` | no staged blob larger than `maxBytes`; work dir removed |
| T-W06 | Parse sandbox escape probes: TCP connect to 127.0.0.1:5432 and an external address; read the secrets dir, data dir and clamd socket path; inspect env | B36 | M | job reports failures as designed | no connection succeeds; no secret path visible; env contains only the allowed variables |
| T-W07 | Hanging job (fault `worker.timeout`) and a job that forks children | B36 | M | `worker_timeout`; version `failure_code`; task `failed_retryable` | no surviving process from the job (checked in `/proc`); work dir removed |
| T-W08 | Job allocating beyond the address-space/memory limit | B36, B38 | M | `worker_failed`/`limit_exceeded` | `tm-server` heap and liveness unaffected; other tasks continue |
| T-W09 | Job writing beyond `tmpBytes`; fork probe beyond `TasksMax`; self-test with a deliberately unsupported limit; rev 2 (BND-01): the real launch line on this host (`systemd-run --user --scope … bwrap … node`) starts Node, and `tesseract --version` succeeds inside the parse sandbox | B36, B38 | M | killed with `limit_exceeded`; failed self-test sets worker health `down` | no job runs while the self-test fails; no `prlimit --as`/`--nproc` on the Node worker |
| T-W17 | Rev 2 (REC-17): staged file deleted before `blob.promote_to_quarantine`; the move task reaches `failed_terminal` | B12, B35 | M | version bytes `unavailable`, owned `bytes_integrity` incident, row wait ended | `doc.scan` deferring forever; a version without owner |
| T-W18 | Rev 2 (BND-13): an official-result PDF that yields no passport candidate; one that matches exactly one filed application by passport number and all name tokens | B13 | M | first ⇒ `artifact_association` incident with owner; second ⇒ artifact verified by `assoc/1` | artifact `pending_review` with no incident |
| T-W10 | Oversize stdout; malformed JSON; response with `tm-worker/2` | B36, B39 | M | `worker_failed` | nothing recorded as success |
| T-W11 | `--contract` prints `tm-worker/1`; a manifest with another value fails release verification | B39 | M | verification result `workerContractMatches=false` | admission not opened |
| T-W12 | Cleanup vs reference race on a staged worker output; disposal never touches canonical or referenced unsettled quarantine bytes; work-dir sweep skips leased tasks | B36, B40 | M | exactly one of reference/cleanup wins | no canonical or referenced quarantine file removed; no work dir of a leased task removed |
| T-W13 | 50 queued fetch and parse jobs | B38 | M | observed max concurrency 1 fetch + 1 parse | never two parse workers at once |
| T-W14 | SheetJS: formula cell, external link, 70 columns, 5000-char cell, `sheetRows` cap | B36 | M | cached values only; `overlongCells` counted; row `cell_too_long` | no external fetch; no row beyond the cap read |
| T-W15 | Diagnostics during a full intake with personal data, URLs and OTP-like strings | B33 | M | diag events with ids and codes | no URL, file name, name, passport-like value or extracted text in any log line |
| T-W16 | Whole pipeline network audit | B15, B42 | M | fetch fixture records only TA-supplied hosts | parse worker makes zero connections; `tm-server` makes no outbound HTTP during document processing |

### 7.7 B41 coverage in this scope

| B41 item | Tests |
|---|---|
| Real persisted Nth retries | T-I26, T-I39, T-D17 |
| Changed-content conflict | T-I29 (same key, other file) |
| Lost acknowledgements | T-I29 |
| Concurrent duplicate cases | T-I10, T-I27, T-I40, T-D19 |
| Launch/suspension admission | T-I01, T-I30 |
| Wrong-scope and revoked access | T-I02, T-I32, T-D15, T-D21, T-D23 |
| Staged-file failure | T-I29, T-W12, T-D17 |
| Workers/redirects | T-W01–T-W11, T-W13, T-W14 |
| Local country errors | T-D22 |
| Demonstrate forbidden effects and recoverable residue | every row's "Forbidden effects" column; T-W07/T-W12 residue checks |

## 8. Contract change requests

Each request names the exact change to `01-foundation-contract.md` and its reason. None changes a business rule.

| ID | Contract place | Proposed change | Reason | Disposition (rev 2) |
|---|---|---|---|---|
| CCR-01 | §3.7 `doc_versions`; §2.15 | Add `purpose ∈ {evidence, intake_source, official_result}` (immutable) with per-purpose formats: evidence PDF/JPEG/PNG ≤ 5 MiB; intake_source xlsx/csv ≤ `upload.spreadsheetMaxBytes` or UTF-8 HTML listing ≤ 2 MiB. `associateFromProposal` and manual association refuse `purpose <> 'evidence'`. Add `DOC_PURPOSES` to §2.15. | B34 gives safety verdicts to Document Processing. Routing the intake source sheet through the same scan and structural check keeps one safety owner (B14 preflight, B36) without letting a sheet become evidence. | Accepted (01 §2.15, §3.7) |
| CCR-02 | §6.9 `checkRelease`; §7.7; §6.6 `getVersionForRelease` | Replace "processing `processed` or `safety_passed`" with "`purpose = 'evidence'` (or an official-result artifact), `content_safe = true`, `bytes_state = 'canonical'`, `currency = 'current'`". In §7.7 move the canonical publication from "`processed` → canonical" to "structural pass → canonical", independent of extraction. `getVersionForRelease` returns `purpose` and `contentSafe`. | N-02: `safety_passed` means only clamd ran; active PDF content is found by the structural check. N-05: a content-safe version awaiting manual extraction must still become canonical to be positively associated and released later. | Accepted (01 §2.15, §6.9, §7.7) |
| CCR-03 | §4.12 BlobStore; §2.21 blob tasks | Add `dispose(tx, id, owner)` (conditional on owner match; sets `state='removing'`; enqueues `blob.cleanup_staging` with discriminator `dispose`). Extend rule 5: a canonical blob MAY be disposed only when its owner version is `excluded_unrelated` by an attributed person's decision and never had a `positive` association (so it was never releasable). Add owner hooks registered per `owner_ref_type` in `compose.ts`: `onMoved(tx, id, area)` and `onIntegrityFailed(tx, id)`, called inside the `blob.*` record transaction. | §4.12 rule 5 allows disposal of rejected/unrelated quarantine bytes but gives no API for a referenced blob. Documents needs a committed `doc.bytes_available` fact in the same transaction that records the canonical area (B12 "accepted availability requires durable, integrity-checked bytes"). | Accepted with edit: adds `onMoveFailedTerminal` (01 §4.6, §4.12; REC-17) |
| CCR-04 | §4.6 `TaskPrepared` | Add `{ kind: 'defer'; notBefore: Date; code: ReasonCode }`: state back to `pending`, `attempts = attempts − 1`, lease cleared, no failure fact. | Storage admission and settlement waits are not failures; consuming bounded attempts would turn a capacity wait into a terminal failure (B38 "retain accepted work and owner"). | Accepted with edit: a defer whose cause cannot end is forbidden (01 §4.6; REC-17) |
| CCR-05 | §6.6, §6.5 | Documents exposes `registerSettledListener(fn)`; `compose.ts` registers `intake.onDocumentSettled`. Documents calls it inside the record transaction whenever a version with `intake_attempt_id` settles or an identity-role association becomes `conflict`. | Avoids an import cycle (T-F03) and avoids polling; Intake reacts in the same commit. | Accepted; also used by Operations for official results (01 §6.5, §6.6) |
| CCR-06 | §6.4 Core writers | (a) Replace the single-offering `acceptIntakeProposal` with `acceptIntakeProposals(tx, { attemptId, rowId, groupId, applicantKey, applicantKeySource, applicant, proposals: [{ offeringId, governing, documents[] }] })`, which locks all offering heads in ascending id before the group (contract lock order) and returns per offering `created(applicationId, snapshotVersionNo)` / `matched_existing(applicationId)` / `refused(code)`. On `matched_existing` Core MUST NOT change the existing application and MUST NOT associate documents. `core.create_draft` MUST use the same internal acceptance function (B14 "same Core acceptance"). (b) Add `applyIntakeCorrection(tx, { applicationId, expectedSnapshotVersionNo, changes, documentReplacements, attemptId, rowId })` returning `applied(snapshotVersionNo)` or `refused('stale_target_revision' | 'correction_target_not_draft' | 'identity_change_requires_evidence')`; all-or-nothing. (c) Add query `applicantIdentity(tx, applicationId)` → current snapshot identity fields and version no. | Several services per row; a revision that only applicant-data edits change (document processing bumps `revision` and `material_revision`, which would make every correction stale); identity-field changes keep Core's B19 evidence rule. | Accepted; `core.create_draft` has no TA route (01 §6.4) |
| CCR-07 | §8.3 stage 10 for `create_draft` | `population_out_of_scope` blocks `create_draft` only on positive evidence (nationality ≠ IND, issuing state ≠ IND, MRZ document code not ordinary, residence declared outside India). Unknown values create the draft and appear as the submit-time blocker `population_declaration_missing`. | B14 allows drafts with missing requirements when applicant/group/service are unambiguous; refusing unknown values would block that. No population default is inferred either way. | Accepted (01 §8.2, §8.3; COV-06) |
| CCR-08 | §6.3 Catalogue writers | Add `attachLateApplication(tx, { applicationId, governing })`: when an intake draft is created on a snapshot baseline that is no longer the offering head, add an impact item (`applicability 'unknown'`) to every assessment opened after that baseline. Core calls it from `acceptIntakeProposals` when the snapshot id ≠ locked head. | B16 "one applicable baseline" per attempt and B06 "no universal latest lookup" mean drafts keep the attempt baseline; without this hook a draft created after a publication's enumeration escapes impact review. | **Rejected**: record 12 `noteGoverningBehindHead` gives liveness and the fail-closed impact derivation gives safety (01 §15.2) |
| CCR-09 | §6.5 IntakeApi; §7.1 group closure row | Add `groupClosureBlockers(tx, groupId) → { openIncidents, activeAttempts }`; `core.close_group` and the group-end sweep require both zero. | An active attempt can still create drafts; closing its group would race (B25). | Accepted (01 §6.5, §7.1) |
| CCR-10 | §5.1, §5.2 | (a) `PolicyRelations.intakeIncident(tx, id) → { taAccountId, groupId }`. (b) `ResourceRef` `document_version` with `applicationId: ApplicationId | null`; `null` resolves through the version's group to the owning TA (group-level resolution, classification, association). (c) New action `document.requeue_check` (SuperAdmin). (d) `intake.resume` authorizes with `intake.start`. (e) Identity exposes `rateLimit.consume(name, key)` for intake/upload limits (library store stays Identity-owned). | Resource types and actions used by Section 4 routes that the closed lists lack. | Accepted (01 §5.1, §5.2, §6.2) |
| CCR-11 | §2.16, §2.21, §2.22, §8.4, §10.3, §10.9 | Closed-set additions: `INTAKE_ROW_STATES += 'routed_to_new_intake'`; §7.6 transitions `received → processing` (individual form) and `awaiting_answer|paused_mapping_fault → abandoned` (`superseded_by_correction`); `PARSE_JOBS += 'inspect_spreadsheet'`; `FETCH_JOBS = ['fetch_public']`; facts `intake.rows_planned`, `intake.attempt_resumed`, `doc.bytes_available`, `doc.bytes_disposed`, `doc.check_requeued`; reason codes listed below; configuration keys listed below. | Used by this design; closed sets change only by contract revision. | Accepted (01 §2.16, §2.22, §7.6, §8.4, §10.9) |
| CCR-12 | §6.6, §6.4 | Core MUST call `documents.reevaluateForApplication` in every transaction that changes applicant identity fields; `requirementEvidence` recomputes identity match and validity on read (Section 3.4.5–3.4.6). | Prevents a stale `positive` passport after a name correction, and a stale validity after a travel-date edit (B06, B15, B19). | Accepted (01 §6.6, §6.11) |
| CCR-13 | §10.3 WorkerRunner | Add the start-up self-test and fallbacks of Section 5.2 (address-space limit vs V8 reservation; per-UID `RLIMIT_NPROC`; `bwrap --size` availability; cgroup scope via `systemd-run --user --scope` as fallback; work-directory watchdog). | N-06: the fixed launch line may not enforce the stated limits on this host; B36 requires real limits. | Accepted with edit: cgroup scope is the primary limit mechanism (01 §10.3; BND-01) |
| CCR-14 | §3.6 `intake_source_files` states | Add `excluded_unrelated`, `not_fetched_unreferenced`; add `UNIQUE (attempt_id, role, locator_digest)`. | Unreferenced folder entries are recorded without fetching (minimal data, B15). | Accepted (01 §3.6) |

Reason codes requested (CCR-11): `source_url_unsupported`, `folder_provider_unsupported`, `source_format_unsupported`, `source_too_large`, `source_unsafe`, `source_unreadable`, `source_fetch_failed`, `source_already_ingested`, `link_not_public_or_not_file`, `header_not_found`, `too_many_rows`, `too_many_files`, `aggregate_limit`, `cell_too_long`, `row_pattern_mixed`, `awaiting_correction_upload`, `systematic_mapping_fault`, `applicant_key_missing`, `identity_requires_manual_resolution`, `identity_source_unavailable`, `identity_conflict_in_batch`, `strong_identifier_conflict`, `name_mismatch`, `dob_mismatch`, `duplicate_in_batch`, `possible_duplicate_existing`, `service_missing`, `service_label_unmapped`, `group_mismatch`, `not_an_applicant_row`, `date_invalid`, `passport_number_invalid`, `country_code_invalid`, `offering_not_in_country`, `requirement_not_declared`, `new_applicant_separate_intake`, `correction_target_not_draft`, `correction_not_applicable`, `correction_file_rejected`, `stale_target_revision`, `identity_change_requires_evidence`, `attempt_in_progress`, `attempt_terminal`, `attempt_not_awaiting_answer`, `answer_not_offered`, `not_latest_attempt`, `abandoned_by_ta`, `superseded_by_correction`, `incident_not_open`, `processing_pending`, `document_unsafe`, `document_too_large`, `format_not_accepted_by_offering`, `size_not_accepted_by_offering`, `classification_unconfirmed`, `extraction_manual_resolution_required`, `extraction_already_verified`, `manual_contradicts_check_digit`, `other_person_document_not_declared`, `other_person_document_is_applicant`, `version_not_eligible`, `version_associated`, `mrz_not_found`, `mrz_check_digit_failed`, `mrz_low_confidence`, `extraction_tool_failed`, `malware_found`, `pixel_limit`, `zip_limit`, `country_adapter_error`, `population_declaration_missing`, `internal_retry_exhausted`, plus the fetch error codes of Section 5.3.

Configuration keys requested (CCR-11; defaults): `intake.maxColumns` 64, `intake.maxCellChars` 2048, `intake.maxSheets` 20, `intake.headerScanRows` 20, `intake.folderMaxEntries` 600, `intake.folderMaxDepth` 2, `intake.startsPerTaPerHour` 10, `intake.systematicFaultMinRows` 3, `intake.systematicFaultShare` 0.5 (stored as per-mille integer 500), `upload.documentsPerTaPerHour` 200, `fetch.maxRedirects` 5, `fetch.connectTimeoutMs` 10 000, `fetch.idleTimeoutMs` 15 000, `fetch.listingMaxBytes` 2 MiB, `extract.mrzMinMeanConfidence` 80, `extract.maxAutocorrections` 2, `extract.ocrMaxPages` 3, `extract.ocrDpi` 300, `extract.pdfTextMaxPages` 20, `validity.adapterTimeoutMs` 200, `fetch.testAllowHosts` / `fetch.testResolver` (test only).

## 9. Owner-decision candidates and recorded interpretations

### 9.1 Genuine owner-decision candidates (B47)

**OD-I1 — Retention of intake source files, unassociated document versions and stored row data.**
- Spec text: B15 "Unrelated files are excluded with minimal reason and safe temporary disposal." B42 EXCLUDES "automatic application/artifact deletion or six-month expiry". B16 "Each intake attempt has … historical row/file results." B33 "Preserve original entries".
- Why unknowable: source sheets, folder listings, stored row cells and versions that are neither unrelated nor associated hold personal data of applicants. The spec gives a disposal rule only for unrelated files and excludes automatic deletion of application documents and artifacts. It does not say how long non-application intake material is kept. This is a privacy duty, not an engineering choice.
- Safe interim: keep them quarantined or canonical as today, never released (no positive association; `intake_source` purpose is never releasable), included in backups with the same access restrictions, listed on the attempt page as "retained". No automatic expiry.
- Independent work: all of this design; a later rule adds one disposal task without schema change.

**OD-I2 — Public folder providers.**
- Spec text: B14 "a public folder with/without consolidated Sheet/Excel".
- Why unknowable: the spec names no provider; each provider has its own public listing form. Choosing which providers count as "a public folder" sets product scope.
- Safe interim: Google Drive public folders (consistent with "public Google Sheet"); other providers are visibly refused with `folder_provider_unsupported`. Individual public file links of any `https` host remain accepted in sheets.
- Independent work: all; adding a provider adds one listing parser and one URL classifier entry.

### 9.2 Recorded interpretations (not escalated; promote to an owner decision if the owner disagrees)

| ID | Topic | Interpretation | Basis |
|---|---|---|---|
| I-I1 | "A correction is all-or-nothing" | The unit is one matched row's change to one application (fields and document replacements together). Independent rows of the same correction upload are processed independently. | B16 sentence scope; B14 "preserve accepted independent rows when another fails" |
| I-I2 | "Explicitly matched" | A correction row matches by equal applicant key to exactly one chain row; a locator-based match needs the TA's confirmation. No name matching. | B16, B15 |
| I-I3 | "Nth identical retry" | Covers operation-key replay, task re-runs and re-uploading or re-fetching the same source as a correction of the same chain. Accepted effects resolve through `intake_row_effects`; eligible failures re-run (Section 3.2.10). | B16, B35 |
| I-I4 | "Correctly classified" for non-identity documents | The TA's explicit statement (upload field, column mapping or classification confirmation) counts as classification; the identity document additionally needs a valid MRZ or manual resolution. The operator's readiness judgement remains the human check. | B15, B18 |
| I-I5 | Duplicate from another source | A row whose scope is already open from a form or another chain yields `matched_existing` plus a TA-owned `possible_duplicate` incident; nothing is written to the existing application. | B16 "duplicate stays an owned incident" |
| I-I6 | Bulk correction of non-draft applications | Refused (`correction_target_not_draft`); submitted or assigned work is corrected through Core's application routes under B18/B19. | B14 "never submits, assigns or files", B19 |
| I-I7 | Identity-field changes in a bulk correction | Routed to an `identity_conflict` incident; Core's same-person evidence rule decides on the application page. | B19, B15 |
| I-I8 | Documents across one applicant's applications in one attempt | Proposed to each of that applicant's applications from the same attempt whose offering declares the type; later changes do not propagate. | B03 (within one group), B14 row semantics |
| I-I9 | Interactive individual form with an existing open scope | Whole form refused with `conflict_duplicate` and links; no partial creation. | B35, B03 |
| I-I10 | Name equality | Deterministic token-multiset equality after normalization; no similarity score. | B15 "never name-only/probabilistic merge" |
| I-I11 | Destination or trip dates in a row differing from the group | A stated destination country ≠ group country ⇒ `ambiguous_group` incident; row travel dates are not application facts and are listed as an ignored column. | B03: one country per group; a country change needs a new group |
