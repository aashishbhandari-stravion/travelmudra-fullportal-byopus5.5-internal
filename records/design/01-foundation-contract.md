# TravelMudra foundation contract (design record 01)

Owner: orchestrator (design phase artefact). Date: 2026-10-04. Status: **revision 8** (Section 22: same-person evidence rule, 2026-10-06). Revision 7 (Section 21: three instances, API calls only, 2026-10-05). Revision 6 (Section 20: production topology, 2026-10-05). Revision 5 (Section 19: foundation review amendments, 2026-10-04). Revision 4 (Section 18: delegated owner decisions applied, 2026-10-04). Revision 3 (Section 16 added by the architect, 2026-10-04: country and service extension architecture). Revision 2 was consolidated after the independent five-lens design review of 2026-10-04 (ledger `internal/records/reviews/2026-10-04-design-review-ledger.md`); ready for the foundation re-review (B41). Owner decisions and material engineering choices: `internal/records/design/02-owner-decision-register.md`.
Authority, in order: `internal/records/BUILD_SPEC.md` (SHA-256 `4a6fd90657b0723f67fb13a58aa57b3377238fd361ee8f706867bb714d58ea89`); architecture brief revision 2 `internal/records/design/00-architecture-brief.md` (SHA-256 `08276a37822cd6144d7ce26a608ae089b5240d9f79f818e4745a0d78eaad7044`); `internal/records/ENGINEERING_OVERRIDES.md` (SHA-256 `52a32720de53366532f4cb564ce7037de3bad72f1d1027bec23f4d32263a44d1`); environment inventory 2026-10-04.

This record settles the B41 foundation items: shared identifiers, fact ownership, state and control meanings, guard and atomic boundaries, operation and history shape, version bindings, owner interfaces and facility seams. Every later module design and implementation MUST follow it. A module design MAY add detail. A module design MUST NOT contradict this record without an orchestrator revision of this record.

Revision 2 (2026-10-04) integrates every contract change request (CCR) of module records 11–15 with an explicit accept or reject decision (Section 15.2), and fixes the P0 review findings in place (Section 15.1). Where a module record and this record differ, this record governs. Where this record says "detail: record NN §X", that module section is the normative detail and MUST NOT contradict this record.

This is an internal record. It cites spec rule IDs. Product source, tests, comments and commit messages MUST NOT copy rule IDs, internal paths or this record's identifiers (brief §0).

## 0. Conventions

### 0.1 Normative terms

`MUST`, `MUST NOT`, `SHOULD`, `MAY` have the meanings in the working agreement. "Writer" means the one module that may change a table. "Guard" means a database mechanism (unique index, partial unique index, conditional update, revision check or row lock) that makes a competing mutator fail safely. "Command" means one consequential acceptance run through `runCommand`. "Unavailable" means a visible state with a closed reason code; it never means "not implemented silently".

### 0.2 Code locations fixed by this record

| Path | Content |
|---|---|
| `src/kernel/ids.ts` | id prefixes, branded id types, generator, parser |
| `src/kernel/vocabulary/*.ts` | every closed set in Section 2 (one file per group), each with its zod schema |
| `src/kernel/db.ts`, `src/kernel/command.ts`, `src/kernel/facts.ts`, `src/kernel/tasks.ts`, `src/kernel/installation.ts`, `src/kernel/errors.ts`, `src/kernel/time.ts`, `src/kernel/diag.ts`, `src/kernel/faults.ts`, `src/kernel/blobs.ts` | kernel API (Section 4) |
| `src/modules/<module>/api.ts` | the only file other modules import from a module: exported writers and queries (Section 6) |
| `src/modules/<module>/commands/*.ts` | command definitions owned by the module |
| `src/modules/<module>/tasks/*.ts` | task definitions owned by the module |
| `src/modules/identity/policy.ts` | the single access policy (Section 5) |
| `src/modules/core/controls.ts` | the single control evaluator (Section 8) |
| `src/server/compose.ts` | composition root: wires policy relations, task registry, command registry |
| `migrations/NNNN_<name>.sql` | schema migrations, applied by `tm migrate` as `tm_owner` |

A module MUST NOT import another module's internal files. A static test enforces this (T-F03).

### 0.3 Clarifications of the architecture brief

The brief is followed. The items below refine it. None changes a business rule. C-01 to C-03 resolve places where the brief's module table reads differently from B34; this record follows B34.

| ID | Brief text | This record | Reason |
|---|---|---|---|
| C-01 | §4: Payment Records owns "Gate 2 decisions" | Core owns every gate exception, including the Gate 2 decision (`core_gate_exceptions`). Payment Records owns the payment status that Gate 2 reads and the financial exception that a Gate 2 decision opens. | B34 gives Core "control acceptance" and "action authorization". B20 treats all gate exceptions as one control kind. One guard table keeps scope, freshness and consumption uniform. |
| C-02 | §4: Operations owns "external-act records" and "problem-report handling" | Core owns the external-act state (B23 states) on `core_action_authorizations` and the assigned-editor hold state (problem report, return, flag). Operations owns the operator's evidence documents, reconciliation attempts and readiness judgements. | The act state and the holds are the guards for action authorization (B18, B23, B35). B34 gives action authorization to Core. Operations calls Core writers in the same transaction. |
| C-03 | §4: Document Processing owns "classification/association verdicts" | Document Processing owns applicant-document association verdicts. Operations owns official-artifact association and eligibility (B13, B34 "artifact eligibility"). | B13 and B34 separate official artifacts from applicant evidence. |
| C-04 | §5: "Ordering uses the fact-log sequence" | Sequence order is allocation order, not commit order. Projection tailing MUST use the transaction-id watermark in Section 4.5. | Concurrent SERIALIZABLE commits can commit a lower sequence later. A seq-only tail can skip facts. |
| C-05 | §3: "Each consequential command runs in one SERIALIZABLE transaction" | Task lease, heartbeat and staging-intent steps use short READ COMMITTED transactions. They accept no business fact. Every business acceptance, including a task's record step, uses SERIALIZABLE. | `FOR UPDATE SKIP LOCKED` leasing is not a business acceptance and behaves predictably under READ COMMITTED. |
| C-06 | §6 and §7: staff sign-in factors not stated | Staff (operator, SuperAdmin) sign-in = email OTP (first factor) + TOTP (second factor). No passwords. | B08 requires MFA. Reusing the OTP verifier avoids a password store and reset flow. Reversible. |
| C-07 | §5: error categories "e.g." | The closed set in Section 2.20 replaces the example list. | Implementers need one set. |
| C-08 | §2.1: worker limits through `prlimit` (`--as`, `--nproc`) | Worker memory and task limits use a user cgroup scope (`systemd-run --user --scope -p MemoryMax -p TasksMax`). `prlimit --as` applies only to spawned native tools, never to a Node worker. Section 10.3. | Verified on this host 2026-10-04: `prlimit --as=768MiB node` aborts at start (V8 code-range reservation) and `prlimit --nproc` counts every thread of the uid, so `bwrap` fails with EAGAIN. Material engineering replacement: register 02 §B. |
| C-09 | §8: Delivery transport "mail.deliver" also for identity mail | Identity mail (OTP, enrolment) uses task kind `iam.send_mail` owned by Identity; `mail.deliver` is Delivery-only (document email). | Sole writers: the OTP plaintext is kept encrypted on an `iam_` row until the Identity task sends it (record 11 X-06). |
| C-10 | §1.1: `otpauth` for staff TOTP | Kept as a runtime dependency (record 11 CCR-14 rejected). | EO-02 records the product owner's direction to prefer mature libraries for security-sensitive code, naming TOTP. |

## 1. Identifier scheme

### 1.1 Format

- Every entity id is `<prefix>_<body>`. `<prefix>` is exactly three lowercase ASCII letters from Table 1.2. `<body>` is 26 Crockford base32 characters (alphabet `0123456789ABCDEFGHJKMNPQRSTVWXYZ`, uppercase only) that encode 128 random bits from `crypto.randomBytes(16)`, left-padded; the first character is therefore `0`–`7`.
- Regex: `^[a-z]{3}_[0-7][0-9A-HJKMNP-TV-Z]{25}$`. Per type: the prefix is fixed.
- Ids carry no time, no sequence and no meaning. Code MUST NOT sort by id for business order. Business order uses the fact log (Section 4.5).
- Ids MUST NOT be derived from content hashes, emails, passport numbers or any personal data.
- Ids are not secrets and grant nothing. Possession of an id MUST NOT authorize anything (B12, B10).
- The database stores ids as `text` with a per-column `CHECK (col ~ '^<prefix>_[0-7][0-9A-HJKMNP-TV-Z]{25}$')`. Migration 0001 creates helper function `tm_is_id(prefix text, v text) RETURNS boolean IMMUTABLE` used by these checks.

Non-entity keys:

| Key | Format | Note |
|---|---|---|
| Operation key | 26 Crockford base32 chars, no prefix | generated server-side into each rendered form (Section 12.3); clients MAY generate their own for CLI/harness |
| Fact sequence | `bigint` identity | allocation order only (C-04) |
| Fact transaction id | `xid8` | commit-visibility watermark |
| Session token, lease token, enrolment token | 32 random bytes, base64url | never stored in plain text; stored as HMAC-SHA-256 with a secret key (Section 10.10) |
| OTP (rev 2, record 11 CCR-01) | 8 decimal digits from `crypto.randomInt` | stored only as `HMAC(otp_pepper, otp_id ‖ code)` and, until mailed by `iam.send_mail`, AES-256-GCM-encrypted on its `iam_` row; wiped after the send attempt; bounded attempts (B08) |
| Applicant key | `<ISSUING_COUNTRY_ALPHA3>:<PASSPORT_NUMBER_NORMALIZED>` | group-scoped duplicate key (Section 3.6); it is personal data and MUST NOT appear in diagnostics |
| Logical effect key (rev 2) | `govfee:<application id>:<attempt ordinal>` | exposure reservation key (B28). The attempt ordinal is `core_action_authorizations.attempt_ordinal`: the fee-carrying act of one government attempt has exactly one ordinal; a fresh authorization of the same act after `not_filed_evidenced` keeps it; in this build every application has at most one government attempt, so the ordinal is `1` (a repeat act after `filed_evidenced` is `parked_repeat_external_act`, record 13 OD-C4). The key never uses `government_attempt_no` (a count of evidenced submissions). Section 7.4. |
| Durable dedupe keys (rev 2) | plain owner-table values | A uniqueness key that MUST survive a restore (B40 new secrets) MUST NOT be an HMAC or any value derived from a rotating secret. Example: `ops_originals.item_key` stores the applicant key itself (a PD column of an owner table), not an HMAC. |
| Dedupe key (task) | `<kind>:<subject id>[:<discriminator>]` | one task per logical effect |
| Migration id | `NNNN_<snake_name>` | file name stem |
| Local date | `YYYY-MM-DD` | business calendar date in `Asia/Kolkata` |

### 1.2 Prefix table

| Prefix | Entity | Owner (writer) | Table |
|---|---|---|---|
| `opr` | operation record | Kernel | `sys_operations` |
| `fct` | fact | Kernel (append API used by all owners) | `sys_facts` |
| `tsk` | internal task | Kernel | `sys_tasks` |
| `rel` | release | Kernel (CLI) | `sys_releases` |
| `blb` | blob | Kernel | `sys_blobs` |
| `prc` | process registration | Kernel | `sys_processes` |
| `ckp` | cutover checkpoint | Kernel (CLI) | `sys_checkpoints` |
| `rst` | restore record | Kernel (CLI) | `sys_restores` |
| `sml` | synthetic mail message | Kernel (platform mail) | `sys_synthetic_mail` |
| `acc` | account | Identity | `iam_accounts` |
| `ses` | session | Identity | `iam_sessions` |
| `otp` | OTP challenge | Identity | `iam_otp_challenges` |
| `emc` | email change | Identity | `iam_email_changes` |
| `grt` | grant | Identity | `iam_grants` |
| `elv` | SuperAdmin elevation request | Identity | `iam_elevations` |
| `enr` | staff enrolment token | Identity | `iam_enrolments` |
| `spv` | support-view record | Identity | `iam_support_views` |
| `cty` | country | Catalogue | `cat_countries` |
| `off` | offering (stable service identity) | Catalogue | `cat_offerings` |
| `sdv` | structural declaration version | Catalogue | `cat_declarations` |
| `bbv` | business baseline version | Catalogue | `cat_baselines` |
| `bnd` | behaviour binding | Catalogue | `cat_bindings` |
| `pub` | publication | Catalogue | `cat_publications` |
| `prv` | publication preview | Catalogue | `cat_previews` |
| `opa` | outside-product owner approval record | Catalogue | `cat_owner_approvals` |
| `ima` | impact assessment | Catalogue | `cat_impact_assessments` |
| `imi` | impact item | Catalogue | `cat_impact_items` |
| `grp` | group | Core | `core_groups` |
| `app` | application | Core | `core_applications` |
| `aps` | applicant snapshot version | Core | `core_applicant_snapshots` |
| `sub` | submission | Core | `core_submissions` |
| `pri` | price record | Core | `core_price_records` |
| `ast` | assistance request | Core | `core_assistance_requests` |
| `asg` | assignment | Core | `core_assignments` |
| `gex` | gate exception | Core | `core_gate_exceptions` |
| `aut` | action authorization (external act) | Core | `core_action_authorizations` |
| `prb` | problem report | Core | `core_holds` |
| `ret` | formal return | Core | `core_holds` |
| `flg` | flag to SuperAdmin | Core | `core_holds` |
| `cor` | correction | Core | `core_corrections` |
| `wdr` | withdrawal request | Core | `core_withdrawals` |
| `dep` | dependency link | Core | `core_dependencies` |
| `dfr` | deferral | Core | `core_deferrals` |
| `stt` | structural transition | Core | `core_transitions` |
| `pmk` | protection mark | Core | `core_protection_marks` |
| `cmp` | completion record | Core | `core_completions` |
| `fcs` | forecast (rev 2, record 13 CCR-01) | Core | `core_forecasts` |
| `prl` | packet release acceptance (rev 2, record 13 CCR-02) | Core | `core_packet_releases` |
| `ina` | intake attempt | Intake | `intake_attempts` |
| `isf` | intake source file | Intake | `intake_source_files` |
| `inr` | intake row | Intake | `intake_rows` |
| `inq` | mapping question | Intake | `intake_questions` |
| `ini` | intake incident | Intake | `intake_incidents` |
| `dov` | document version | Document Processing | `doc_versions` |
| `dsv` | safety verdict | Document Processing | `doc_safety_verdicts` |
| `dxv` | extraction verdict | Document Processing | `doc_extraction_verdicts` |
| `das` | document association verdict | Document Processing | `doc_associations` |
| `lch` | launch decision | Operations | `ops_launch_decisions` |
| `sus` | suspension | Operations | `ops_suspensions` |
| `owd` | offering withdrawal | Operations | `ops_offering_withdrawals` |
| `ewt` | existing-work treatment | Operations | `ops_existing_work_treatments` |
| `rdy` | readiness judgement | Operations | `ops_readiness` |
| `inc` | operational incident | Operations | `ops_incidents` |
| `org` | physical original item | Operations | `ops_originals` |
| `omv` | original movement | Operations | `ops_original_movements` |
| `art` | official artifact | Operations | `ops_artifacts` |
| `xev` | external-act evidence | Operations | `ops_act_evidence` |
| `rca` | reconciliation attempt | Operations | `ops_reconciliation_attempts` |
| `fcl` | failure classification | Operations | `ops_failure_classifications` |
| `wki` | local work step | Operations | `ops_work_steps` |
| `lpl` | launch plan (rev 2, record 12 CCR-03) | Operations | `ops_launch_plans` |
| `efs` | effort sample (rev 2, record 15 CCR-15-15) | Operations | `ops_effort_samples` |
| `bks` | backup set (rev 2, record 15 CCR-15-08) | Kernel (CLI) | `sys_backup_sets` |
| `pay` | service payment entry | Payment Records | `pay_service_entries` |
| `gfe` | government fee record | Payment Records | `pay_government_fees` |
| `cec` | ceiling change | Payment Records | `pay_ceiling_changes` |
| `exr` | exposure reservation | Payment Records | `pay_exposure_reservations` |
| `fex` | financial exception | Payment Records | `pay_financial_exceptions` |
| `rls` | byte release | TA Delivery | `dlv_releases` |
| `sel` | bulk selection | TA Delivery | `dlv_selections` |
| `eml` | document email send | TA Delivery | `dlv_email_sends` |
| `ntc` | web notice | TA Delivery | `dlv_notices` |
| `hnd` | handover record | TA Delivery | `dlv_handovers` |
| `pkt` | packet | TA Delivery | `dlv_packets` |

### 1.3 Branded TypeScript types

```ts
// src/kernel/ids.ts — erasable syntax only
declare const idBrand: unique symbol;

export const ID_PREFIXES = [
  'opr','fct','tsk','rel','blb','prc','ckp','rst','sml','bks',
  'acc','ses','otp','emc','grt','elv','enr','spv',
  'cty','off','sdv','bbv','bnd','pub','prv','opa','ima','imi',
  'grp','app','aps','sub','pri','ast','asg','gex','aut','prb','ret','flg','cor','wdr','dep','dfr','stt','pmk','cmp','fcs','prl',
  'ina','isf','inr','inq','ini',
  'dov','dsv','dxv','das',
  'lch','lpl','sus','owd','ewt','rdy','inc','org','omv','art','xev','rca','fcl','wki','efs',
  'pay','gfe','cec','exr','fex',
  'rls','sel','eml','ntc','hnd','pkt',
] as const;
export type IdPrefix = typeof ID_PREFIXES[number];
export type Id<P extends IdPrefix> = `${P}_${string}` & { readonly [idBrand]: P };

export type OperationId = Id<'opr'>;   export type FactId = Id<'fct'>;     export type TaskId = Id<'tsk'>;
export type ReleaseId = Id<'rel'>;     export type BlobId = Id<'blb'>;     export type ProcessId = Id<'prc'>;
export type AccountId = Id<'acc'>;     export type SessionId = Id<'ses'>;  export type GrantId = Id<'grt'>;
export type CountryId = Id<'cty'>;     export type OfferingId = Id<'off'>; export type DeclarationVersionId = Id<'sdv'>;
export type BaselineVersionId = Id<'bbv'>; export type BindingId = Id<'bnd'>; export type ImpactAssessmentId = Id<'ima'>;
export type GroupId = Id<'grp'>;       export type ApplicationId = Id<'app'>; export type AssignmentId = Id<'asg'>;
export type GateExceptionId = Id<'gex'>; export type AuthorizationId = Id<'aut'>; export type HoldId = Id<'prb'> | Id<'ret'> | Id<'flg'>;
export type IntakeAttemptId = Id<'ina'>; export type IntakeRowId = Id<'inr'>; export type IntakeIncidentId = Id<'ini'>;
export type DocumentVersionId = Id<'dov'>; export type AssociationId = Id<'das'>;
export type ReadinessId = Id<'rdy'>;   export type IncidentId = Id<'inc'>; export type ArtifactId = Id<'art'>; export type OriginalId = Id<'org'>;
export type PaymentEntryId = Id<'pay'>; export type ReservationId = Id<'exr'>; export type FinancialExceptionId = Id<'fex'>;
export type ReleaseRecordId = Id<'rls'>; export type EmailSendId = Id<'eml'>; export type NoticeId = Id<'ntc'>; export type PacketId = Id<'pkt'>;
// (one alias per prefix; the list above is normative for names used in Section 6)

export type OperationKey = string & { readonly [idBrand]: 'operation_key' };
export type ApplicantKey = string & { readonly [idBrand]: 'applicant_key' };
export type LogicalEffectKey = `govfee:${ApplicationId}:${number}` & { readonly [idBrand]: 'logical_effect_key' };   // number = attempt ordinal (Section 1.1)
export function logicalEffectKey(app: ApplicationId, attemptOrdinal: number): LogicalEffectKey;   // pure; the only constructor
export type Paise = bigint & { readonly [idBrand]: 'paise' };          // money, never number
export type LocalDate = string & { readonly [idBrand]: 'local_date' };  // 'YYYY-MM-DD', Asia/Kolkata

export function newId<P extends IdPrefix>(prefix: P, rnd: RandomSource): Id<P>;
export function parseId<P extends IdPrefix>(prefix: P, raw: unknown): Id<P>;   // throws TmError('validation_failed','invalid_id')
export function isId<P extends IdPrefix>(prefix: P, raw: unknown): raw is Id<P>;
export function zId<P extends IdPrefix>(prefix: P): z.ZodType<Id<P>>;
```

Rules:
- Every exported function that takes an id MUST take the branded type, not `string`.
- Route parameters and form fields MUST pass through `parseId`/`zId` before use. A malformed id returns `not_found_or_forbidden` (not `validation_failed`) on object routes, so malformed and foreign ids look the same.
- `pg` type parsers (Section 10.1) return ids as `string`; row schemas brand them with `zId`.

## 2. Closed sets

All closed sets live in `src/kernel/vocabulary/`. Each set is an `as const` array, a derived union type and a zod enum. Database columns that hold a closed-set value MUST carry a `CHECK (col IN (...))` generated from the same array by the migration author (T-F05 compares them). Adding a value is a reviewed change to this record.

Pattern:

```ts
export const ROLES = ['ta', 'operator', 'superadmin'] as const;
export type Role = typeof ROLES[number];
export const zRole = z.enum(ROLES);
```

### 2.1 Modules

```ts
export const MODULES = ['kernel','identity','catalogue','core','intake','documents','operations','payments','delivery','views'] as const;
```

| Value | Table prefix | Dir |
|---|---|---|
| `kernel` | `sys_` | `src/kernel` |
| `identity` | `iam_` | `src/modules/identity` |
| `catalogue` | `cat_` | `src/modules/catalogue` |
| `core` | `core_` | `src/modules/core` |
| `intake` | `intake_` | `src/modules/intake` |
| `documents` | `doc_` | `src/modules/documents` |
| `operations` | `ops_` | `src/modules/operations` |
| `payments` | `pay_` | `src/modules/payments` |
| `delivery` | `dlv_` | `src/modules/delivery` |
| `views` | `view_` | `src/modules/views` |

### 2.2 Roles and grants (B08, B10, B11, B29)

```ts
export const ROLES = ['ta','operator','superadmin'] as const;
export const GRANT_KINDS = ['group_read','accounting'] as const;
export const RELATIONS = ['self','owner_ta','assigned_operator','incident_owner','incident_reviewer','group_read_grantee','accounting_grantee','superadmin'] as const;
```

| Value | Meaning |
|---|---|
| `ta` | One TravelAgent person. Owns groups and applications. Sees only its own work. |
| `operator` | One TravelMudra operator person. Acts only on applications currently assigned to it. |
| `superadmin` | One TMSuperAdmin person. Administers accounts, assignment, gates, catalogue, launch, payment entries. Cannot judge readiness or file. The product owner's account is an ordinary `superadmin` account with identical permissions (B07); no flag grants more. |
| `group_read` | Rare, named, purpose- and time-limited, revocable, read-only grant for one group to one operator account. No action, no cross-TA access. |
| `accounting` | Additional grant on an `operator` account for the Accounts surface. Grants no case access and no payment mutation (B29). All Accounts actions are PARKED in this build. |

An account holds exactly one role. A role never changes, except operator→superadmin elevation through the two-SuperAdmin flow (B11). `accounting` MAY be held only by an `operator`. `group_read` MAY be held only by an `operator`.

### 2.3 Account statuses (B08, B11)

```ts
export const ACCOUNT_STATUSES = ['pending_approval','approved','active','suspended','declined'] as const;
```

| Value | Meaning |
|---|---|
| `pending_approval` | Created by a SuperAdmin with reason; awaiting approval. For a SuperAdmin account, awaiting a second distinct active SuperAdmin. Cannot sign in. |
| `approved` | Approval recorded. Awaiting activation. Cannot sign in. |
| `active` | Can sign in. Staff additionally need a completed TOTP enrolment before any non-enrolment action. |
| `suspended` | All sessions revoked in the suspending transaction; cannot sign in; all access denied. Applications of a suspended TA are preserved. |
| `declined` | Approval declined. Terminal. Frees the email for reuse. |

No self-registration exists. TA eligibility/fraud policy is unselected (B08, B44): approval is the SuperAdmin's recorded judgement with reason; the system encodes no eligibility criteria.

### 2.4 Application lifecycle and completion kinds (B21, B25)

```ts
export const LIFECYCLE_STATES = ['draft','submitted','completed','ended_with_group'] as const;
export const OPEN_LIFECYCLE_STATES = ['draft','submitted'] as const;
export const COMPLETION_KINDS = ['completed','ended_with_group'] as const;   // = closed lifecycle states
```

| Value | Open | Meaning |
|---|---|---|
| `draft` | yes | Created by form or intake. Not formally submitted. No price fixed. |
| `submitted` | yes | Formally submitted by the TA (B17). Price fixed, estimated window started. Assignment, operator work, external acts and outcome happen in this state. |
| `completed` | no | Normal processing ended under B24 closure evidence. Never means success by itself. |
| `ended_with_group` | no | B25 date-triggered closure of an eligible open application after the group's travel return date. Not an outcome. Not success. Not deletion. |

### 2.5 Outcomes (B21)

```ts
export const OUTCOMES = ['issued','refused','withdrawn','cancelled','dependency_failed','prepared_and_handed_over','external_outcome_unresolved'] as const;
```

| Value | Meaning | Applicable modes |
|---|---|---|
| `issued` | Official positive result evidenced. | travelmudra_filed, third_party_filed |
| `refused` | Official refusal evidenced. | travelmudra_filed, third_party_filed |
| `withdrawn` | Withdrawal accepted by Core under B24. | all |
| `cancelled` | Cancellation under a cancellation path that the governing declaration declares. Generic erroneous-case cancellation is PARKED (B44); with no declared path the action is unavailable. | only where declared |
| `dependency_failed` | Incompatible final upstream outcome for a confirmed-unfiled dependent (B22). | all with declared dependencies |
| `prepared_and_handed_over` | Validated packet handed through the TA (B04). Claims no government result. | preparation_only |
| `external_outcome_unresolved` | SuperAdmin-authorized administrative outcome after exhausted reconciliation (B23). Never grants safe refiling. | travelmudra_filed, third_party_filed |

`outcome` is `NULL` until recorded. An outcome is set once. Section 7.1 gives the only correction path.

### 2.6 Common TA progress meanings (B21)

```ts
export const PROGRESS_MEANINGS = ['draft','ta_action_needed','with_travelmudra','external_wait','delivery_closure_pending','completed'] as const;
```

| Value | Meaning | Derivation (first match wins; Section 6.4 `deriveProgress`) |
|---|---|---|
| `completed` | Processing ended. The UI shows the completion kind and outcome beside it. | lifecycle ∈ {completed, ended_with_group} |
| `ta_action_needed` | The TA must act. | `pending_on_action.owner_kind = 'ta'` |
| `draft` | Not yet submitted. | lifecycle = draft |
| `delivery_closure_pending` | Outcome recorded; delivery, physical return or completion evidence outstanding. | outcome IS NOT NULL |
| `external_wait` | Waiting on government, provider or another external party. | `pending_on_action.owner_kind = 'external_party'` |
| `with_travelmudra` | TravelMudra (operator or SuperAdmin) owns the next step. | otherwise |

Progress is derived, never stored as authority. Views MAY store a projected copy.

### 2.7 Pending-on-action owner kinds (B21, B22, B46)

```ts
export const PENDING_OWNER_KINDS = ['ta','assigned_operator','superadmin','external_party','accounts','system','unresolved_known_limitation','none'] as const;
```

| Value | Meaning |
|---|---|
| `ta` | The owning TA must act (correction after return, price decision, acknowledgement, intake answer). |
| `assigned_operator` | The current assigned operator owns the next action. |
| `superadmin` | SuperAdmin queue owns it (unassigned submitted case, assistance decision, flag, exception, unassigned wait under B22). |
| `external_party` | Government, provider or courier owns the next fact; an internal owner still exists for follow-up and is named in `follow_up_owner`. |
| `accounts` | Financial follow-up responsibility (B29). Accounts actions are PARKED; the accountable SuperAdmin is named in `follow_up_owner`. |
| `system` | A bounded internal task owns the next step. Task failure converts the owner to the task's declared failure owner. |
| `unresolved_known_limitation` | B46: the trigger and owner of a pending Core completion check or delivery send is unresolved. Shown truthfully. |
| `none` | Nothing pending (closed application). |

Shape (stored by the projection, computed by Core):

```ts
export interface PendingOnAction {
  readonly ownerKind: PendingOwnerKind;
  readonly ownerAccountId: AccountId | null;     // set for assigned_operator; null for queues
  readonly followUpOwner: { kind: PendingOwnerKind; accountId: AccountId | null } | null;
  readonly reasonCode: ReasonCode;               // Section 8.4
  readonly nextActionCode: NextActionCode;       // Section 2.8
  readonly sinceSeq: bigint;                     // fact sequence that created the wait
}
```

### 2.8 Next-action codes

```ts
export const NEXT_ACTIONS = [
  'complete_draft','answer_intake_question','correct_after_return','hand_back_after_return','decide_price_increase','acknowledge_notice',
  'decide_assistance','assign_operator','respond_to_flag','grant_or_refuse_gate_exception','review_catalogue_impact','record_existing_work_treatment',
  'start_operator_work','resolve_problem_report','record_readiness','reconfirm_readiness','authorize_external_act','perform_external_act',
  'record_external_evidence','reconcile_filing','await_external_result','record_outcome','await_dependency','supply_dependency_evidence',
  'release_packet','record_custody_receipt','return_original','resolve_incident','record_delivery','completion_check_pending',
  'review_deferral','financial_follow_up','none',
  'return_to_ta','decide_transition','reapply_correction',   // rev 2 (record 13 CCR-17)
] as const;
```

### 2.9 Assigned-editor sub-state (B18)

```ts
export const EDITOR_STATES = ['unassigned','assigned','returned_to_ta','assistance_in_progress'] as const;
export const HOLD_KINDS = ['problem_reported','flagged_to_superadmin','returned_to_ta'] as const;
export const EDITOR_SUBSTATES = ['assigned','returned_to_ta','problem_reported','flagged_to_superadmin','assistance_in_progress'] as const; // display meaning
```

| Display sub-state | Stored as | Meaning | TA may | Operator may | Filing / packet release |
|---|---|---|---|---|---|
| `assigned` | editor_state=assigned, no open hold | Operator owns the case. | read, report problem | ordinary work, return, flag | allowed after readiness |
| `returned_to_ta` | editor_state=returned_to_ta (+ open `ret` hold) | Formal return for correction. Same operator retained. | read, correct, withdraw, decide price, hand back | read | blocked |
| `problem_reported` | open `prb` hold | TA reported a problem; changes no data. | read | deal with it, then reconfirm readiness | blocked |
| `flagged_to_superadmin` | open `flg` hold | Operator flagged to SuperAdmin. | read, report problem | read, add notes | blocked |
| `assistance_in_progress` | editor_state=assistance_in_progress | Approved assistance; operator enters information (sole exception). | read, report problem | enter information, formal return | blocked |

Display precedence when several apply: `returned_to_ta` > `flagged_to_superadmin` > `problem_reported` > `assistance_in_progress` > `assigned`. Every hold open or close increments `core_applications.hold_revision`; readiness recorded before that revision is stale (Section 7.3).

### 2.10 Readiness judgement states (B18, B19)

```ts
export const READINESS_STATES = ['current','superseded','withdrawn'] as const;
export const READINESS_VALIDITY = ['valid','missing','stale_basis','held','previous_operator'] as const; // derived
```

| Value | Meaning |
|---|---|
| `current` | Latest judgement recorded by an operator for the application. At most one per application. |
| `superseded` | Replaced by a newer judgement. |
| `withdrawn` | The recording operator withdrew it. |
| derived `valid` | `current`, basis fingerprint equals the live basis, recorded by the current assignment, no open hold. |
| derived `stale_basis` | Basis changed (correction, document, travel date, governing version, impact, dependency evidence, hold revision, external act returned to readiness). |
| derived `held` | An open hold exists. |
| derived `previous_operator` | Basis matches but the judgement belongs to an ended assignment. Only this case is exception-eligible under the readiness gate. |

### 2.11 Control kinds, gates and controlled actions (B20, B26, B27, B19, B28)

```ts
export const CONTROL_KINDS = ['shared_tenet','mandatory_validation','gate','evidenced_cutoff'] as const;
export const GATES = ['gate1_service_payment','gate2_government_commitment','readiness_gate'] as const;
export const EXCEPTION_ELIGIBLE_GATES = ['gate1_service_payment','gate2_government_commitment','readiness_gate'] as const;
export const CONTROLLED_ACTIONS = [
  'select_offering','start_intake','create_draft','submit','request_assistance','assign','reassign','start_operator_work','assistance_entry',
  'record_readiness','authorize_government_submission','authorize_government_fee_payment','authorize_provider_handoff',
  'release_packet','record_outcome','request_withdrawal','release_bytes','send_document_email','complete','end_with_group',
  'correct_application','edit_travel_dates',
] as const;
```

| Control kind | Meaning | Exception |
|---|---|---|
| `shared_tenet` | Cannot be overridden by anyone. Changes only through its own owning command. | never |
| `mandatory_validation` | Safety, identity, artifact, custody, dependency evidence. Passes only on corrected evidence. | never |
| `gate` | Named action gate. | only the gates in `EXCEPTION_ELIGIBLE_GATES`, by a SuperAdmin, per application + gate + action |
| `evidenced_cutoff` | A fixed point after which an action is no longer available, proven by evidence (for example evidenced government-portal submission for withdrawal). | never; not a gate |

Gate table:

| Gate | Guards (controlled action) | Passes when | Exception action key | Notes |
|---|---|---|---|---|
| `gate1_service_payment` | `assign` (initial assignment, assistance assignment) and `reassign` (rev 2, record 13 CCR-04), and through the assignment basis every operator-work action | current service payment status = `payment_received` | `assign` (for both) | B26, B18. Assignment is not payment. Consumed at the assignment. Whether Gate 1 MUST also be re-evaluated when operator work starts after a later correction to unpaid is owner decision OD-R2-02 (register 02); interim = this row. |
| `gate2_government_commitment` | every `authorize_government_fee_payment` / `authorize_government_submission` of a `travelmudra_filed` application while no government commitment of the current attempt may have happened (rev 2, MON-03) | current service payment status = `payment_received` at that authorization | `first_government_commitment` | B27. Gate 1 never satisfies Gate 2. Not applicable to other modes (reason `service_mode_not_applicable`). "A commitment may have happened" = some act of the attempt is `authorized`, `filing_unknown`, `filed_evidenced` or `reconciliation_exhausted`; only then does a later act of the same attempt record `gate2_basis = 'same_attempt'`. If every earlier act of the attempt is `not_filed_evidenced`, the next authorization evaluates Gate 2 again (current `payment_received` or a fresh Gate 2 exception). |
| `readiness_gate` | `authorize_government_submission`, `authorize_government_fee_payment`, `authorize_provider_handoff`, `release_packet` | readiness validity = `valid` | same action name | B18, B19. Exception allowed only when validity = `previous_operator` (reassignment reconfirmation). It never passes `missing`, `stale_basis` or `held`. |

No other gate exists and no other control is exception-eligible. Launch admission, the exposure ceiling, assigned-editor holds, uncertainty protection and cut-offs are not gates.

Shared tenets (named controls used by the evaluator): `object_access`, `individual_actor`, `installation_admission`, `launch_admission` (B07), `binding_supported` (B05), `filing_uncertainty_protection` (B23), `assigned_editor_hold` (B18), `exposure_ceiling` (B28, "non-overridable stop"), `withdrawal_stop` (B24), `offering_withdrawal` (B07), `protection_mark` (B40), `group_open` (B25).

Mandatory validations: `document_safety`, `mandatory_documents`, `identity_evidence`, `population_scope` (B02: Indian ordinary passport, resident in India as declared), `dependency_prerequisite` (B22), `artifact_association` (B13), `custody_evidence` (B30), `bytes_integrity` (B12), `catalogue_impact_resolved` (B06), `travel_date_recheck` (B06).

Evidenced cut-offs: `withdrawal_cutoff` (B24), plus any cut-off the governing declaration declares.

### 2.12 External-act states and kinds (B23)

```ts
export const EXTERNAL_ACT_KINDS = ['government_submission','government_fee_payment','provider_handoff'] as const;
export const EXTERNAL_ACT_STATES = ['authorized','filed_evidenced','not_filed_evidenced','filing_unknown','reconciliation_exhausted'] as const;
export const OPEN_EXTERNAL_ACT_STATES = ['authorized','filing_unknown'] as const;
```

| Value | Meaning | Protected as possibly filed |
|---|---|---|
| `authorized` | Core accepted actor, scope, governing evidence, authorization, protection and reconciliation owner. Permission, not execution evidence. The act may have happened at any time after commit. | yes |
| `filed_evidenced` | Evidence of filing/payment/handoff (for example a government receipt). Known receipt is filing even if progress stalls. | n/a (filed) |
| `not_filed_evidenced` | Positive evidence that the act did not occur. The application returns through current rules and readiness before a fresh authorization. | no |
| `filing_unknown` | An attempt may have reached the authority; outcome not known (timeout, ambiguous portal response). | yes |
| `reconciliation_exhausted` | SuperAdmin authorized administrative `external_outcome_unresolved` completion with attempts, reason, TA notice and future owner. Never grants safe refiling. A later official fact appends owned follow-up. | yes, permanently |

`provider_handoff` is not filing (B04). For `provider_handoff`, `filed_evidenced` means "handoff evidenced".

### 2.13 Service modes and custody paths (B04)

```ts
export const SERVICE_MODES = ['travelmudra_filed','preparation_only','third_party_filed'] as const;
export const CUSTODY_PATHS = ['electronic','physical'] as const;
```

| Value | Meaning |
|---|---|
| `travelmudra_filed` | Only the assigned operator files manually. Gate 2 and TM-funded government fee (B27, B28) apply. |
| `preparation_only` | Ends with a validated packet handed through the TA. Holds no originals. Claims no government result. |
| `third_party_filed` | A declared provider files. Handoff is not filing. The operator keeps declared follow-up, delivery and closure duties. Provider handoff with customer data requires an approved provider data-sharing route; none exists, so `authorize_provider_handoff` is unavailable with `provider_route_unapproved` (B15, B42, B44). Rev 2 (record 12 CCR-10): in `test` and `local_test` only, a synthetic offering MAY declare `provider: { routeRef: 'synthetic:…' }`, which requires capability `provider.synthetic`; `tm release register` refuses a manifest that carries `provider.synthetic` unless `env ∈ {test, local_test}`, and configuration refuses synthetic offerings in `production`. |
| `electronic` / `physical` | Declared evidence and custody paths. An offering declares one or both. `physical` requires B30 custody records; preparation-only MUST NOT declare `physical` originals. |

### 2.14 Launch control (B07)

```ts
export const LAUNCH_STATES = ['not_launched','launched'] as const;
export const SUSPENSION_STATES = ['none','active'] as const;
export const OFFERING_WITHDRAWAL_STATES = ['none','effective'] as const;
export const EXISTING_WORK_TREATMENTS = ['continue','hold','missing'] as const;
export const LAUNCH_EFFECTS = ['allow','hold','refuse'] as const;   // restrictiveness order: allow < hold < refuse
export const CATALOGUE_AVAILABILITY = ['unpublished','published','retired'] as const;
```

| Value | Meaning |
|---|---|
| `not_launched` | No current scoped approval. Refuse selection and all new intake including drafts. Truthful display MAY continue. |
| `launched` | Current scoped approval recorded by an attributed SuperAdmin with reason, evidence and scoped readiness. Scope = audience (`all_active_tas` or named TA accounts) — see OD-03. |
| suspension `active` | New selection/intake refused. Existing commitments survive. If its existing-work treatment is `missing`, unfiled preparation, packet release and filing are held. Lifting restores only the previously approved scope. |
| withdrawal `effective` | Stops new selection, intake and submission. Submitted unfiled work continues only if the withdrawal record expressly permits continuation; otherwise held. Payment cannot force it. |
| `allow` / `hold` / `refuse` | Per-action effect. The evaluator takes the most restrictive applicable effect (B07). |
| catalogue `published` | Catalogue availability. Separate from launch; never implies launch. |

Per-action launch effect table (Operations `launchDecision`; reconciliation, original return, incident work and valid delivery are always `allow` under launch control and keep their own checks):

| Action | not_launched / out of scope | suspension active, treatment continue | suspension active, treatment hold or missing | withdrawal effective, continuation permitted | withdrawal effective, not permitted |
|---|---|---|---|---|---|
| `select_offering`, `start_intake`, `create_draft` | refuse | refuse | refuse | refuse | refuse |
| `submit` | refuse | allow | hold | refuse | refuse |
| `request_assistance`, `assign`, `start_operator_work`, `assistance_entry`, `record_readiness` (existing work) | allow if previously admitted | allow | hold | allow | hold |
| `authorize_*`, `release_packet` | allow if previously admitted | allow | hold | allow | hold |
| `record_outcome`, `release_bytes`, `send_document_email`, `complete`, reconciliation, act evidence, custody commands, incidents, `reassign` (rev 2, record 13 CCR-04/CCR-19) | allow | allow | allow | allow | allow |

"Previously admitted" means the application was created while the offering was launched for that TA. `not_launched` never refuses work on such an application except for the new-work rows. The withdrawal columns apply to submitted applications; for a draft under an effective withdrawal, `request_assistance`, `assign`, `start_operator_work`, `assistance_entry` and `submit` are `refuse`. Actions not listed (withdrawal requests, corrections, holds) are not launch-controlled.

### 2.15 Document and evidence verdicts (B12, B13, B15)

```ts
export const DOC_SOURCES = ['ta_form_upload','operator_assistance_upload','intake_bulk_fetch','intake_bulk_upload','operator_artifact_upload'] as const;
export const DOC_PROCESSING_STATES = ['quarantined','safety_checking','safety_retry_wait','safety_rejected','safety_passed','extracting','processed','manual_resolution_required','extraction_failed','excluded_unrelated'] as const;
export const DOC_BYTES_STATES = ['staged','quarantine','canonical','unavailable','disposed'] as const;
export const DOC_CURRENCY = ['current','replaced','blocked'] as const;
export const SAFETY_VERDICTS = ['passed','rejected_format','rejected_size','rejected_malware','rejected_active_content','rejected_decode','scanner_unavailable'] as const;
export const EXTRACTION_STATUSES = ['extracted','low_confidence','conflict','failed','not_applicable'] as const;
export const ASSOCIATION_STATUSES = ['proposed','positive','conflict','ambiguous','rejected','revoked'] as const;
export const VALIDITY_VERDICTS = ['valid','invalid','unknown'] as const;
export const DOCUMENT_TYPES_FOUNDATION = ['passport','photo','supporting','other_person_supporting','official_result','packet','unrelated'] as const; // offerings refine with declared type codes
export const DOC_PURPOSES = ['evidence','intake_source','official_result'] as const;   // rev 2, record 14 CCR-01; immutable per version
```

Rev 2 (record 14 CCR-01/CCR-02): `doc_versions.purpose` is immutable. Only `evidence` versions receive Documents associations (`doc_associations`); `official_result` versions are associated only through Operations (`ops_artifacts`, B13, C-03); `intake_source` versions are never releasable. `doc_versions.content_safe` becomes true only when the structural check (qpdf active content, full image decode) passes; bytes move to `canonical` only when `content_safe` (CHECK), independent of the extraction result. `safety_passed` alone (clamd only) never permits a release.

| Set | Meaning |
|---|---|
| `scanner_unavailable` | clamd unreachable or timed out. Fail closed: bytes stay quarantined, owner = Documents queue, retry bounded. Not a pass. |
| `rejected_*` | Terminal for that version. Bytes disposed safely (`disposed`); metadata and minimal reason retained. |
| `excluded_unrelated` | Not relevant to any application. Minimal reason kept; bytes disposed (B15). |
| `low_confidence` / `conflict` | Extraction proposal not usable automatically; manual resolution required. Strong-identifier conflicts and same-name ambiguity stay unresolved (B15). |
| association `positive` | Version accepted as evidence of `requirement_type` for one application. Only `positive` counts for readiness and release. |
| `blocked` | Disclosure or integrity incident blocked the version (B13). No bytes released. |
| `replaced` | A newer version replaced it. Earlier eligibility ends (B13). |
| bytes `unavailable` | Missing or unreadable bytes. An owner and next action exist (B12). |

### 2.16 Intake attempt and row states (B14, B16)

```ts
export const INTAKE_SOURCE_KINDS = ['individual_form','public_google_sheet','excel_upload','public_folder','public_folder_with_sheet','correction_upload'] as const;
export const INTAKE_ATTEMPT_STATES = ['received','preflight','preflight_failed','awaiting_answer','processing','paused_mapping_fault','paused_actor_revoked','fully_processed','abandoned'] as const;
export const INTAKE_ROW_STATES = ['pending','processing','accepted','matched_existing','incident_open','failed','excluded','untouched_by_correction','superseded_by_correction','routed_to_new_intake'] as const;   // rev 2, record 14 CCR-11
export const ROW_PATTERNS = ['undetermined','one_row_per_applicant','multiple_rows_per_applicant','mixed_refused'] as const;
```

| Value | Meaning |
|---|---|
| `preflight_failed` | Unsafe or unreadable batch prerequisite. No application mutation happened. Terminal for the attempt. |
| `awaiting_answer` | A consequential mapping ambiguity awaits the TA. No row acceptance happens for affected rows. |
| `paused_mapping_fault` | A systematic mapping fault paused all affected rows. |
| `paused_actor_revoked` | The originating TA lost access mid-flight; tasks stopped; accepted rows stay. |
| `fully_processed` | All checks ran. Not correctness, not submission, not filing readiness (B16). |
| row `accepted` | Row created one or more drafts. |
| row `matched_existing` | Row resolved to an existing open application under the duplicate guard; no overwrite. |
| row `incident_open` | Ambiguous applicant/document/group/service/duplicate; an intake incident owns it. |
| row `untouched_by_correction` | Correction attempt left the row unchanged (omitted rows stay untouched). |

### 2.17 Incidents (B13, B16, B32, B36)

```ts
export const INTAKE_INCIDENT_KINDS = ['ambiguous_applicant','ambiguous_document','ambiguous_group','ambiguous_service','possible_duplicate','identity_conflict','mapping_fault'] as const;
export const INTAKE_INCIDENT_STATES = ['open','resolved_by_correction','resolved_by_ta_abandonment','dismissed_by_superadmin'] as const;
export const OPS_INCIDENT_KINDS = ['artifact_association','artifact_missing_or_wrong','wrong_recipient_disclosure','bytes_integrity','operational_failure','country_defect','custody_discrepancy','official_fact_follow_up','post_filing_correction'] as const;   // rev 2, record 13 CCR-11
export const OPS_INCIDENT_STATES = ['open','assigned','awaiting_evidence','resolved','closed'] as const;
export const FAILURE_SCOPES = ['local','shared','unresolved'] as const;
```

Disposition of an intake incident never cancels an existing application (B16). An Operations incident in `resolved` needs resolution evidence; `wrong_recipient_disclosure` needs correction and notice evidence even after completion (B13).

### 2.18 Delivery (B12, B24, B31, B46)

```ts
export const DELIVERY_CHANNELS = ['document_email','web_notice','web_retrieval','bulk_selection','packet_handover','physical_handover','manual_operator_email','direct_external_delivery','staff_review'] as const;   // rev 2: staff_review (SEC-02)
export const RELEASE_CHANNELS = ['web_retrieval','bulk_selection','document_email','staff_review'] as const;   // channels that call checkRelease
export const PACKET_STATES = ['building','built','released','superseded','build_failed'] as const;   // rev 2, record 15 CCR-15-06
export const EMAIL_SEND_STATES = ['queued','denied_at_check','sending','accepted','synthetic_accepted','failed','uncertain'] as const;
export const RELEASE_RESULTS = ['streamed','stream_failed','unavailable','denied'] as const;
export const SELECTION_ITEM_RESULTS = ['included','unavailable','failed'] as const;
export const NOTICE_KINDS = ['result_available','timing_risk','price_change','deferral','return_for_correction','disclosure_correction','external_outcome_unresolved','withdrawal_decision','assistance_decision','generic_case_update','financial_follow_up'] as const;   // rev 2: financial_follow_up (record 15 CCR-15-04; staff recipient only)
```

| Value | Meaning |
|---|---|
| `accepted` | A real transport accepted the message. No real transport is selected; production configuration has none. |
| `synthetic_accepted` | The synthetic transport stored the message. Labelled synthetic; never claims real delivery (B37). |
| `failed` | Definite failure before acceptance. A deliberate manual resend MAY follow and is newly attributed. |
| `uncertain` | Outcome unknown (crash after `sending`, ambiguous transport response). No automatic resend (B31). Handling/ownership is unresolved (B46). |
| `manual_operator_email` | Attributed record of an email the operator sent outside the system. Not system-verified (B24). |
| `direct_external_delivery` | Record of an authority's direct delivery: known provenance, recipient, version; truthful absence of a TravelMudra-held result. |
| `staff_review` (rev 2) | Byte release of an official-result artifact to the incident owner, the named reviewer or the uploading assigned operator while the artifact is `pending_review` or `conflict`, for the B13 secondary review only. Section 6.9. Never a delivery to the TA; never completion evidence. |
| `result_available` notice (rev 2) | Part of the B46 delivery-send boundary: posted only by the harness command `dlv.post_result_notice` (record 15 CCR-15-07); `postNotice` refuses that kind from every other caller. |

### 2.19 Payment, fee, exposure and financial follow-up (B26–B29, B43)

```ts
export const SERVICE_PAYMENT_STATUSES = ['unrecorded','payment_received','not_received'] as const;
export const SERVICE_ENTRY_KINDS = ['record','correction'] as const;
export const GOV_FEE_STATES = ['reserved','tm_paid','payment_unknown','recovered_partially','recovered'] as const;
export const RESERVATION_STATES = ['reserved','converted_to_paid'] as const;   // release is PARKED: no 'released' value
export const CEILING_CHANGE_KINDS = ['lower','increase'] as const;
export const CEILING_CHANGE_STATES = ['effective','increase_requested','increase_declined'] as const;
export const FIN_EXCEPTION_KINDS = ['work_under_gate1_exception','commitment_under_gate2_exception','payment_corrected_after_work','worked_then_corrected_to_unpaid'] as const;
export const FIN_EXCEPTION_STATES = ['open','closed_collected'] as const;      // write-off is unselected: no state
```

| Value | Meaning |
|---|---|
| `unrecorded` | No SuperAdmin entry. Not `payment_received`. |
| `payment_received` | Latest effective SuperAdmin entry says received, with evidence. |
| `not_received` | Latest effective entry says not received (including a correction). |
| `reserved` | Exposure counted before a TM-funded government-fee commitment. Never released in this build (B28 PARKED). |
| `converted_to_paid` | The operator recorded the TM fee payment; the paid amount is counted as TM-paid-unrecovered (`converted_paise > 0`). Rev 2 (record 15 CCR-15-01): the unused remainder `GREATEST(amount_paise − converted_paise, 0)` stays counted in `reserved_paise`; conversion never releases exposure. |
| `recovered*` | Requires Accounts-verified allocated bank receipt. The Accounts mutation path is PARKED; no command reaches these states in this build. |
| financial exception `open` | Listable across applications as `Payment_Missing_Override` (B29). Survives completion. |
| `closed_collected` | A later `payment_received` entry for that application is recorded. |

### 2.20 Error categories (C-07)

```ts
export const ERROR_CATEGORIES = [
  'unauthenticated','not_found_or_forbidden','validation_failed','stale_revision','conflict_operation_key','conflict_duplicate',
  'conflict_retry_exhausted','control_blocked','unavailable_parked','unavailable_excluded','unavailable_known_limitation',
  'unavailable_owner_decision','unavailable_dependency','maintenance','stale_writer','rate_limited','capacity_limited',
  'bot_check_failed','outcome_unknown','internal',
] as const;
```

| Category | HTTP | Retryable | Meaning |
|---|---|---|---|
| `unauthenticated` | 303 to sign-in (pages) / 401 | no | No valid session. |
| `not_found_or_forbidden` | 404 | no | Object absent or outside scope. Indistinguishable by design (B10). |
| `validation_failed` | 422 | after correction | Input invalid. Field errors carry codes, never echoed personal data. |
| `stale_revision` | 409 | after reload | Expected revision differs. No latest-write-wins (B19). |
| `conflict_operation_key` | 409 | no | Same key, different content (B35). |
| `conflict_duplicate` | 409 | no | Business duplicate guard (for example open duplicate scope). Carries the existing resource ref when the actor may read it. |
| `conflict_retry_exhausted` | 503 + Retry-After | yes | 40001/40P01 retries exhausted with the same operation identity. |
| `control_blocked` | 409 | after state change | One or more control blockers (Section 8.4). |
| `unavailable_parked` / `_excluded` / `_known_limitation` / `_owner_decision` | 409 | no | Deliberate boundary; carries the boundary reference code. |
| `unavailable_dependency` | 503 | yes | Scanner, worker, mail transport or database facility unavailable; fail closed. |
| `maintenance` | 503 | yes | Admission closed. |
| `stale_writer` | 503 | yes | Process epoch is stale; the process refuses and exits. |
| `rate_limited` | 429 | yes | Rate limit. |
| `capacity_limited` | 503 | yes | Finite limit reached (B38). Accepted work and owners retained. |
| `bot_check_failed` | 422 | yes | CAPTCHA missing, invalid, expired or reused. |
| `outcome_unknown` | 503 | yes, same key | Commit acknowledgement lost; resubmit the same operation key to reconcile (B35). |
| `internal` | 500 | unknown | Defect. Diagnostics hold only allowlisted fields. |

### 2.21 Internal task kinds

```ts
export const TASK_KINDS = [
  'blob.promote_to_quarantine','blob.publish_canonical','blob.cleanup_staging','blob.cleanup_work_dirs',
  'doc.scan','doc.parse',
  'intake.fetch_source','intake.preflight','intake.parse_sheet','intake.fetch_row_files','intake.process_rows',
  'mail.deliver',
  'delivery.build_packet',
  'core.group_end_sweep','core.travel_date_recheck','core.timing_risk_check','core.deferral_review_due',
  'catalogue.impact_recheck',
  'ops.attribute_country_defect',
  'iam.expiry_cleanup','iam.send_mail',
] as const;
export const TASK_EFFECT_CLASSES = ['none','idempotent','non_repeatable'] as const;
export const TASK_STATES = ['pending','leased','succeeded','failed_retryable','failed_terminal','cancelled_obsolete','cancelled_revoked','effect_uncertain'] as const;
```

| Kind | Owner | Effect class | On behalf of | Max attempts | Failure owner |
|---|---|---|---|---|---|
| `blob.promote_to_quarantine` | kernel | idempotent (rename) | system | 5 | owner hook `onMoveFailedTerminal` by `owner_ref_type` (rev 2, REC-17): for a document version ⇒ `documents.markBytesUnavailable('missing')`, which opens an owned `bytes_integrity` incident and settles the version |
| `blob.publish_canonical` | kernel | idempotent (rename + verify) | system | 5 | same hook; verification mismatch ⇒ `onIntegrityFailed` |
| `blob.cleanup_staging` | kernel | idempotent | system | 3 | system health |
| `blob.cleanup_work_dirs` | kernel | idempotent | system | 3 | system health |
| `doc.scan` | documents | idempotent (clamd read-only) | system | 5 | Documents queue (`scanner_unavailable`) |
| `doc.parse` | documents | idempotent (sandboxed worker) | system | 3 | Documents queue → manual resolution |
| `intake.fetch_source` | intake | idempotent (public GET) | origin TA | 3 | TA (attempt failure) |
| `intake.preflight` | intake | none | origin TA | 3 | TA |
| `intake.parse_sheet` | intake | idempotent | origin TA | 3 | TA |
| `intake.fetch_row_files` | intake | idempotent | origin TA | 3 | TA (row failure) |
| `intake.process_rows` | intake | none (DB only) | origin TA | 5 | TA / intake incident |
| `mail.deliver` | delivery (document email only; rev 2, record 15 CCR-15-16) | non_repeatable | origin account or system | 1 effect, record retries 5 | delivery record shows `uncertain`/`failed` |
| `iam.send_mail` | identity (rev 2, record 11 CCR-04): OTP, email-change and enrolment mail | non_repeatable | the account | 1 effect, record retries 5 | the person requests a new code; visible `mail_state`; code wiped in every case |
| `delivery.build_packet` | delivery | idempotent (writes new staging blob) | assigned operator | 3 | assigned operator |
| `core.group_end_sweep` | core | none | system | 5 | SuperAdmin queue |
| `core.travel_date_recheck` | core | none | system | 5 | assigned operator / SuperAdmin |
| `core.timing_risk_check` | core | none | system | 5 | assigned operator / SuperAdmin |
| `catalogue.impact_recheck` | catalogue | none | system | 5 | accountable SuperAdmin |
| `core.deferral_review_due` | core (rev 2, record 13 CCR-06; was `ops.deferral_review_due`) | none | system | 5 | SuperAdmin |
| `ops.attribute_country_defect` | operations (rev 2, REC-07) | none | system | 5 | SuperAdmin queue; record step calls `operations.openIncident(country_defect)` idempotently by dedupe key; enqueued only by the kernel attribution sink (Section 4.2 step 8) |
| `iam.expiry_cleanup` | identity | none | system | 3 | system health |

Tasks MUST NOT perform a government action or a payment (B35). No task kind exists for the B46 delivery-send trigger or completion-check trigger.

### 2.22 Fact types

A fact type is `<module short>.<event>`. The prefix fixes the owner module; `appendFact` refuses a fact type whose prefix is not the caller's module (type-level and runtime, Section 4.5). The lists are normative; a module design MAY add a fact type only through a revision of this record.

```ts
export const FACT_TYPES = [
  // kernel (actor: engineering CLI or system)
  'sys.admission_closed','sys.admission_opened','sys.release_registered','sys.release_activated','sys.migration_applied',
  'sys.cutover_checkpoint','sys.restore_completed','sys.task_failed_terminal','sys.task_cancelled','sys.task_effect_uncertain',
  'sys.blob_integrity_failed','sys.blob_missing','sys.capacity_recorded',
  // rev 2 (record 15 CCR-15-08; SEC-05)
  'sys.backup_recorded','sys.restore_scope_declared','sys.rollback_performed','sys.release_verified','sys.projection_rebuilt','sys.checkpoint_disposed',
  // identity
  'iam.account_created','iam.account_approved','iam.account_declined','iam.account_activated','iam.account_suspended','iam.account_restored',
  'iam.credentials_reset','iam.mfa_enrolled','iam.elevation_requested','iam.elevation_approved','iam.elevation_declined',
  'iam.session_started','iam.session_revoked','iam.email_change_started','iam.email_change_completed','iam.email_change_abandoned',
  'iam.grant_created','iam.grant_revoked','iam.support_view_started','iam.support_view_ended',
  // rev 2 (record 11 CCR-05)
  'iam.otp_issued','iam.otp_attempt_failed','iam.email_change_current_verified','iam.enrolment_issued','iam.enrolment_opened',
  'iam.enrolment_attempt_failed','iam.enrolment_expired','iam.grant_expired','iam.elevation_expired','iam.elevation_withdrawn',
  // catalogue
  'cat.country_created','cat.offering_created','cat.declaration_registered','cat.declaration_status_changed','cat.owner_approval_recorded',
  'cat.binding_registered','cat.binding_status_changed','cat.baseline_drafted','cat.preview_recorded','cat.baseline_published',
  'cat.impact_assessment_opened','cat.impact_item_recorded','cat.impact_item_decided','cat.release_impact_submitted',
  // rev 2 (record 12 CCR-03)
  'cat.country_listing_changed','cat.offering_retired','cat.declaration_published','cat.impact_reviewer_assigned','cat.impact_assessment_reviewed',
  'cat.impact_recheck_requested','cat.release_catalogue_registered',
  // core
  'core.group_created','core.group_context_edited','core.group_travel_dates_edited','core.group_closed',
  'core.draft_created','core.draft_edited','core.applicant_identity_corrected','core.correction_accepted','core.superadmin_evidence_correction',
  'core.submitted','core.price_quoted','core.price_reduced','core.price_increase_proposed','core.price_increase_accepted','core.price_increase_declined',
  'core.assistance_requested','core.assistance_approved','core.assistance_declined',
  'core.operator_assigned','core.operator_reassigned','core.assignment_ended',
  'core.gate_exception_granted','core.gate_exception_consumed','core.gate_exception_revoked',
  'core.problem_reported','core.problem_resolved','core.formal_return','core.handed_back','core.flagged_to_superadmin','core.flag_resolved',
  'core.assistance_entry_recorded','core.withdrawal_requested','core.withdrawal_accepted','core.withdrawal_refused',
  'core.external_act_authorized','core.external_act_state_changed','core.unresolved_completion_authorized',
  'core.outcome_recorded','core.outcome_corrected','core.completion_checked','core.completed','core.ended_with_group',
  'core.dependency_linked','core.dependency_state_changed','core.deferral_proposed','core.deferral_approved','core.deferral_declined','core.deferral_ended',
  'core.structural_transition_applied','core.continuation_recorded','core.protection_mark_recorded','core.protection_mark_resolved','core.timing_risk_recorded',
  // rev 2 (record 12 CCR-03; record 13 CCR-08)
  'core.structural_transition_proposed','core.structural_transition_declined',
  'core.forecast_recorded','core.packet_released','core.correction_held','core.correction_hold_resolved','core.flag_responded','core.dependency_unlinked',
  'core.travel_dates_rechecked','core.deferral_review_due',
  // intake
  'intake.attempt_created','intake.preflight_passed','intake.preflight_failed','intake.question_opened','intake.question_answered',
  'intake.row_result_recorded','intake.attempt_fully_processed','intake.attempt_paused','intake.attempt_abandoned',
  'intake.incident_opened','intake.incident_disposed',
  'intake.rows_planned','intake.attempt_resumed',                                                       // rev 2 (record 14 CCR-11)
  // documents
  'doc.version_registered','doc.safety_verdict_recorded','doc.extraction_verdict_recorded','doc.classification_recorded',
  'doc.association_recorded','doc.association_revoked','doc.version_replaced','doc.version_blocked','doc.bytes_unavailable','doc.unrelated_excluded',
  'doc.bytes_available','doc.bytes_disposed','doc.check_requeued',                                     // rev 2 (record 14 CCR-11)
  // operations
  'ops.launch_approved','ops.launch_scope_expanded','ops.offering_suspended','ops.suspension_lifted','ops.offering_withdrawn',
  'ops.existing_work_treatment_recorded','ops.operator_work_started','ops.readiness_recorded','ops.readiness_withdrawn',
  'ops.act_evidence_recorded','ops.reconciliation_attempt_recorded','ops.incident_opened','ops.incident_assigned','ops.incident_evidence_recorded',
  'ops.incident_resolved','ops.incident_closed','ops.original_received','ops.original_moved','ops.original_returned',
  'ops.artifact_recorded','ops.artifact_association_confirmed','ops.artifact_eligibility_changed','ops.failure_classified','ops.work_step_recorded',
  'ops.launch_plan_recorded','ops.original_linked','ops.effort_sample_recorded',                        // rev 2 (record 12 CCR-03; 13 CCR-08; 15 CCR-15-15)
  // payments
  'pay.service_payment_recorded','pay.service_payment_corrected','pay.government_fee_recorded','pay.exposure_reserved','pay.exposure_converted_paid',
  'pay.ceiling_lowered','pay.ceiling_increase_requested','pay.ceiling_increase_approved','pay.ceiling_increase_declined',
  'pay.financial_exception_opened','pay.financial_exception_closed',
  'pay.fee_payment_state_changed','pay.financial_exception_owner_changed',                              // rev 2 (record 15 CCR-15-02, -03)
  // delivery
  'dlv.release_checked','dlv.release_result_recorded','dlv.selection_recorded','dlv.email_queued','dlv.email_result_recorded',
  'dlv.notice_posted','dlv.notice_acknowledged','dlv.handover_recorded','dlv.manual_email_recorded','dlv.direct_external_recorded',
  'dlv.packet_built',
  'dlv.packet_requested','dlv.packet_state_changed',                                                    // rev 2 (record 15 CCR-15-06; release acceptance is core.packet_released)
] as const;
export type FactType = typeof FACT_TYPES[number];
export type FactTypeOf<M extends 'sys'|'iam'|'cat'|'core'|'intake'|'doc'|'ops'|'pay'|'dlv'> = Extract<FactType, `${M}.${string}`>;
```

Views write no facts.

### 2.23 Subject types and evidence kinds

```ts
export const SUBJECT_TYPES = [
  'installation','release','task','blob','account','session','grant','email_change','elevation','support_view',
  'country','offering','declaration','baseline','binding','publication','impact_assessment','impact_item',
  'group','application','assignment','gate_exception','authorization','hold','correction','withdrawal','dependency','deferral','transition','protection_mark',
  'intake_attempt','intake_row','intake_question','intake_incident',
  'document_version','association',
  'launch','suspension','offering_withdrawal','readiness','incident','original','artifact','work_step',
  'service_payment','government_fee','ceiling','reservation','financial_exception',
  'byte_release','selection','email_send','notice','handover','packet',
  // rev 2
  'otp_challenge','enrolment','forecast','packet_release','launch_plan','effort_sample','backup_set','checkpoint','restore',
] as const;
export const EVIDENCE_KINDS = ['document_version','artifact','fact','external_reference','attestation','owner_approval','release_manifest','synthetic_label'] as const;
export interface EvidenceRef { readonly kind: EvidenceKind; readonly id: string; readonly note?: string /* ≤ 200 chars, no personal data */ }
```

`external_reference` stores an opaque reference that an operator copied from an external system (for example a government receipt number). It is business evidence, visible under case access, excluded from diagnostics. `attestation` records a person's statement with actor and time; it never stands in for unavailable required evidence (B20, B33).

### 2.24 Actor kinds

```ts
export const ACTOR_KINDS = ['anonymous','account','support_view','system_task','engineering','harness'] as const;   // rev 2: harness (record 13 CCR-07)
```

| Value | Meaning | May write |
|---|---|---|
| `anonymous` | Unauthenticated request (public pages, sign-in). | only sign-in commands (OTP issue/verify, staff sign-in, enrolment) |
| `account` | Signed-in person with current role and status. | commands allowed by policy |
| `support_view` | A SuperAdmin viewing exactly what a selected account can read (B10). | nothing; read actions only; no bytes |
| `system_task` | An internal task. Carries `onBehalfOf` when it acts for a person. | its owner's writers; re-checked per run |
| `engineering` | `tm` CLI as `tm_owner` with an attributed `--actor` label. | installation state, releases, migrations, checkpoints, backup sets, restore records, protection marks (B40); rev 2 (record 12 CCR-01): catalogue release registration through `cat.register_release_catalogue`, `cat.submit_release_impact` and `cat.bind_declaration` only, run as maintenance commands while admission is closed with `closure_kind ∈ {initial, cutover}` (Section 4.2). Never other business facts. |
| `harness` (rev 2) | Labelled test harness (`tm harness …`, test code) with a required label. Registered only when `env ∈ {test, local_test}`; configuration refuses it in `production`. | the B46 harness commands (`core.check_completion`, `dlv.queue_document_email`, `dlv.post_result_notice`) and the synthetic seed `tm seed synthetic` (record 11 CCR-13, record 15 CCR-15-14, accepted with this actor kind instead of `engineering`). Facts carry `actor_kind = 'harness'`, `engineering_label` = the label and `command_name` prefixed `harness.`. |

## 3. Table ownership and schema

### 3.1 Database roles, grants and conventions

| Role | Login | Owns | Privileges |
|---|---|---|---|
| `tm_owner` | yes (CLI only) | database, schema `public`, all tables, functions, triggers | DDL, migrations, `pg_dump` export, admission/cutover/restore writes, protection marks |
| `tm_app` | yes (server) | nothing | `SELECT, INSERT, UPDATE` on module tables; `DELETE` only on `iam_rate_limits`, `iam_captcha_spent`, and expired rows of `iam_otp_challenges`, `iam_enrolments`, succeeded `sys_tasks` older than retention, and `view_` tables (projector upserts); `INSERT, SELECT` only on `sys_facts`, `sys_operations`, `pay_service_entries`, and (rev 2, record 12 CCR-13) `cat_publications`, `cat_owner_approvals`, `cat_previews`, plus `dlv_handovers`, `ops_act_evidence`, `ops_reconciliation_attempts`, `ops_original_movements` (append-only trigger `TM001` on each); `SELECT` only on `sys_installation`, `sys_releases`, `sys_migrations`, `sys_checkpoints`, `sys_restores`, `sys_backup_sets`; no DDL; no `TRUNCATE`; `USAGE` on identity sequences |

Conventions (every table):
- Ids are `text` with the per-prefix `CHECK` (Section 1.1). Foreign keys are declared for every id column that references a table in the same database, `ON DELETE RESTRICT`, `ON UPDATE RESTRICT`.
- Times are `timestamptz`. The application supplies every recorded time from the injected `Clock` as a parameter. Columns MUST NOT use `DEFAULT now()` (tests use a fake clock; one clock source per command attempt). Business calendar dates are `date` in `Asia/Kolkata`.
- Money is `bigint` paise with `CHECK (col >= 0)` unless a signed adjustment is explicitly declared.
- Every mutable aggregate row has `revision bigint NOT NULL DEFAULT 1`. A writer changes it only with `UPDATE … SET revision = revision + 1 … WHERE id = $id AND revision = $expected`; zero affected rows ⇒ `stale_revision` (Section 4.3).
- Closed-set columns carry `CHECK (col IN (…))` generated from Section 2.
- Immutable identity columns (for example `core_applications.group_id`, `ta_account_id`, `offering_id`, `applicant_key` outside the correction writer) are protected by a `BEFORE UPDATE` trigger `tm_forbid_column_change(<cols>)`. An application's group, TA and offering never change (B03, B06: service/country switch uses fresh intake).
- Personal data (names, dates of birth, passport numbers, emails, source URLs, extracted fields) lives only in owner tables named in this section and in `sys_facts.before/after`. It never enters `sys_tasks.payload`, `sys_operations.result_summary`, diagnostics, or file names.

### 3.2 Kernel tables (full)

#### `sys_installation` — singleton admission, writer epoch, active release

| Column | Type | Null | Meaning |
|---|---|---|---|
| `id` | `smallint` | no | PK; `CHECK (id = 1)` |
| `admission` | `text` | no | `open` / `closed` |
| `closure_kind` | `text` | yes | `initial`, `maintenance`, `cutover`, `emergency`, `restore_clean`, `restore_interval_loss`; `NULL` iff `admission = 'open'` (CHECK) |
| `closure_reason` | `text` | yes | short attributed reason |
| `writer_epoch` | `bigint` | no | increments on every close and every cutover; fences old writers |
| `active_release_id` | `text` | yes | FK `sys_releases`; the only release allowed to write |
| `last_checkpoint_id` | `text` | yes | FK `sys_checkpoints` |
| `last_restore_id` | `text` | yes | FK `sys_restores` |
| `reopen_approval_ref` | `text` | yes | required evidence reference to open after `restore_interval_loss` (B40) |
| `changed_at` | `timestamptz` | no | last change |
| `revision` | `bigint` | no | revision |

A new installation starts `closed`, `closure_kind = 'initial'`. Only `tm_owner` writes it.

#### `sys_processes` — writer process registrations

| Column | Type | Null | Meaning |
|---|---|---|---|
| `process_id` | `text` | no | PK `prc_` |
| `release_id` | `text` | no | FK; release the process runs |
| `writer_epoch` | `bigint` | no | epoch adopted at start |
| `os_pid` | `integer` | no | diagnostics only |
| `started_at` | `timestamptz` | no | |
| `last_heartbeat_at` | `timestamptz` | no | every 10 s |
| `stopped_at` | `timestamptz` | yes | |
| `stop_reason` | `text` | yes | `normal`, `stale_writer`, `fatal`, `maintenance` |

#### `sys_releases`

| Column | Type | Null | Meaning |
|---|---|---|---|
| `release_id` | `text` | no | PK `rel_` |
| `manifest` | `jsonb` | no | full release manifest (Section 9.4) |
| `manifest_sha256` | `bytea` | no | UNIQUE; SHA-256 of canonical manifest JSON |
| `source_commit` | `text` | no | 40 hex chars |
| `artifact_sha256` | `bytea` | no | digest of the installed artifact tree |
| `lockfile_sha256` | `bytea` | no | `package-lock.json` digest |
| `config_sha256` | `bytea` | no | canonical nonsecret configuration digest |
| `schema_head` | `text` | no | last migration id the release requires |
| `worker_contract` | `text` | no | for example `tm-worker/1` |
| `capability_set` | `jsonb` | no | supported declaration schema versions and capability ids/versions |
| `registered_at` | `timestamptz` | no | |
| `verified_at` | `timestamptz` | yes | compatibility verified while closed |
| `activated_at` | `timestamptz` | yes | became `active_release_id` |

#### `sys_migrations` — migration ledger

| Column | Type | Null | Meaning |
|---|---|---|---|
| `migration_id` | `text` | no | PK, file stem `NNNN_name` |
| `checksum_sha256` | `bytea` | no | SHA-256 of file bytes; a changed applied file is refused |
| `applied_at` | `timestamptz` | no | |
| `applied_by` | `text` | no | database role (`tm_owner`) |
| `duration_ms` | `integer` | no | |

#### `sys_checkpoints` — cutover checkpoints (B39)

| Column | Type | Null | Meaning |
|---|---|---|---|
| `checkpoint_id` | `text` | no | PK `ckp_` |
| `created_at` | `timestamptz` | no | |
| `writer_epoch` | `bigint` | no | epoch at capture (admission closed) |
| `last_fact_seq` | `bigint` | no | highest committed `sys_facts.seq` |
| `last_op_seq` | `bigint` | no | highest committed `sys_operations.op_seq` |
| `closed_fact_seq` | `bigint` | no | seq of the `sys.admission_closed` fact this checkpoint follows |
| `export_sha256` | `bytea` | no | digest of the consistent export (plaintext stream digest, computed while streaming) |
| `encrypted_sha256` | `bytea` | no | rev 2 (SEC-05): digest of the `age`-encrypted checkpoint file; no plaintext dump exists at rest |
| `release_id_before` | `text` | no | FK |
| `state` | `text` | no | `capturing`, `captured`, `used_for_rollback`, `superseded`, `disposed` (rev 2: `tm cutover cleanup` disposes a `superseded` or `used_for_rollback` checkpoint once admission has reopened and a later `complete` backup set exists; the newest `captured` checkpoint of an open cutover is never disposed) |

#### `sys_restores` (B40)

| Column | Type | Null | Meaning |
|---|---|---|---|
| `restore_id` | `text` | no | PK `rst_` |
| `backup_set_sha256` | `bytea` | no | manifest digest of the recovery set |
| `restored_at` | `timestamptz` | no | |
| `interval_loss` | `boolean` | no | true ⇒ installation stays `restore_interval_loss` closed |
| `gaps` | `jsonb` | no | explicit gaps recorded in the set |
| `secret_generation` | `integer` | no | new secrets generation number |
| `state` | `text` | no | `closed_pending_owner`, `reopened` |
| `declared_scope` | `jsonb` | yes | rev 2 (record 15 CCR-15-08, REC-05): application ids marked for protection, each with its inclusion basis |
| `scope_state` | `text` | no | `unknown`, `declared`; `openAdmission` for `restore_interval_loss` requires `declared` |
| `scope_basis` | `jsonb` | yes | completeness basis: the conservative candidate rule version, the restored-state query digest, every evidence source consulted, and a per-id reason for each exclusion. Without it `scope_state` stays `unknown` (B40) |

#### `sys_backup_sets` (rev 2, record 15 CCR-15-08) — recovery-set register (B40)

| Column | Type | Null | Meaning |
|---|---|---|---|
| `backup_set_id` | `text` | no | PK `bks_` |
| `created_at`, `finished_at` | `timestamptz` | no / yes | |
| `state` | `text` | no | `capturing`, `complete`, `incomplete`, `abandoned` |
| `snapshot_name` | `text` | yes | exported snapshot used by `pg_dump --snapshot` and the blob inventory read (REC-02) |
| `last_fact_seq`, `last_op_seq`, `max_fact_tx_id` | `bigint` / `bigint` / `xid8` | no | read in the snapshot transaction |
| `writer_epoch` | `bigint` | no | |
| `manifest_sha256` | `bytea` | yes | encrypted manifest digest |
| `gaps` | `jsonb` | no | explicit capture gaps (codes, blob ids) |
| `custody` | `text` | no | `same_host` in this build |
| `revision` | `bigint` | no | |

Only a `complete` set replaces `LAST_GOOD` (B40).

#### `sys_operations` — operation records (idempotency, B35)

| Column | Type | Null | Meaning |
|---|---|---|---|
| `operation_id` | `text` | no | PK `opr_` |
| `op_seq` | `bigint` | no | `GENERATED ALWAYS AS IDENTITY`, UNIQUE; allocation order |
| `actor_key` | `text` | no | `acc_…`, `tsk_…`, `eng:<label>`, or `pre:<pre-session hmac hex>` for anonymous sign-in forms |
| `operation_key` | `text` | no | client/form key |
| `command_name` | `text` | no | closed command registry name |
| `content_hash` | `bytea` | no | 32 bytes; Section 4.4 |
| `actor_account_id` | `text` | yes | FK `iam_accounts` |
| `session_id` | `text` | yes | FK `iam_sessions` |
| `task_id` | `text` | yes | FK `sys_tasks` |
| `accepted_at` | `timestamptz` | no | |
| `result_resource_type` | `text` | no | subject type used for re-authorization on replay |
| `result_resource_id` | `text` | no | |
| `result_summary` | `jsonb` | no | ids, revisions, closed codes only; ≤ 4 KB |
| `first_fact_seq` | `bigint` | yes | first fact appended by the command |
| `release_id` | `text` | no | FK |
| `writer_epoch` | `bigint` | no | |

Constraints: `UNIQUE (actor_key, operation_key)`. Append-only trigger (UPDATE/DELETE/TRUNCATE raise `TM001`). Only accepted commands write a row; a rejected command leaves no row.

#### `sys_facts` — append-only fact log (B33)

| Column | Type | Null | Meaning |
|---|---|---|---|
| `seq` | `bigint` | no | PK, `GENERATED ALWAYS AS IDENTITY` |
| `fact_id` | `text` | no | UNIQUE `fct_` |
| `tx_id` | `xid8` | no | `DEFAULT pg_current_xact_id()`; projection watermark (C-04) |
| `recorded_at` | `timestamptz` | no | command attempt time from `Clock` |
| `event_at` | `timestamptz` | yes | claimed real-world time, if different |
| `actor_kind` | `text` | no | Section 2.24 (never `support_view`; `harness` only when the database was created with `env ∈ {test, local_test}`, enforced by the writer and T-F05) |
| `actor_account_id` | `text` | yes | FK; set for `account` |
| `actor_role` | `text` | yes | role at acceptance |
| `task_id` | `text` | yes | set for `system_task` |
| `on_behalf_of` | `text` | yes | account a task acted for |
| `engineering_label` | `text` | yes | set for `engineering` |
| `command_name` | `text` | yes | |
| `operation_id` | `text` | yes | FK `sys_operations` (deferred: operation row is inserted last in the same transaction) |
| `owner_module` | `text` | no | Section 2.1 |
| `fact_type` | `text` | no | Section 2.22; `CHECK (split_part(fact_type,'.',1) = <module short for owner_module>)` |
| `subject_type` | `text` | no | Section 2.23 |
| `subject_id` | `text` | no | |
| `ta_account_id` | `text` | yes | scope: owning TA |
| `group_id` | `text` | yes | scope |
| `application_id` | `text` | yes | scope |
| `offering_id` | `text` | yes | scope |
| `before` | `jsonb` | yes | before-image of changed fields; absent fact ⇒ `NULL`, never invented |
| `after` | `jsonb` | yes | after-image |
| `reason` | `text` | yes | required where the command declares `reasonRequired` |
| `evidence` | `jsonb` | no | `EvidenceRef[]`, default `[]` |
| `retrospective` | `boolean` | no | true for marked reconstruction (B33) |
| `reconstruction_note` | `text` | yes | `CHECK (NOT retrospective OR reconstruction_note IS NOT NULL)` |
| `release_id` | `text` | no | FK; software release that accepted the fact |
| `fact_schema` | `smallint` | no | `1` |

Indexes: `(application_id, seq)`, `(subject_type, subject_id, seq)`, `(ta_account_id, seq)`, `(fact_type, seq)`, `(tx_id, seq)`.
Triggers: `sys_facts_append_only` `BEFORE UPDATE OR DELETE` row trigger and `BEFORE TRUNCATE` statement trigger raise `TM001` for every role. Privileges: `tm_app` `INSERT, SELECT` only.
The FK from `sys_facts.operation_id` to `sys_operations` is `DEFERRABLE INITIALLY DEFERRED`.

#### `sys_tasks` — durable internal tasks (outbox)

| Column | Type | Null | Meaning |
|---|---|---|---|
| `task_id` | `text` | no | PK `tsk_` |
| `kind` | `text` | no | Section 2.21 |
| `owner_module` | `text` | no | |
| `dedupe_key` | `text` | no | one task per logical effect |
| `state` | `text` | no | Section 2.21 `TASK_STATES` |
| `effect_class` | `text` | no | `none`, `idempotent`, `non_repeatable` |
| `subject_type` | `text` | no | |
| `subject_id` | `text` | no | |
| `ta_account_id` | `text` | yes | scope |
| `group_id` | `text` | yes | scope |
| `application_id` | `text` | yes | scope |
| `on_behalf_of` | `text` | yes | FK account; permission re-checked on each run |
| `payload` | `jsonb` | no | ids and closed codes only; ≤ 16 KB; no personal data |
| `attempts` | `integer` | no | leases granted so far |
| `max_attempts` | `integer` | no | bound |
| `not_before` | `timestamptz` | no | earliest next lease |
| `lease_token_hmac` | `bytea` | yes | HMAC-SHA-256(job-credential key, token) |
| `lease_expires_at` | `timestamptz` | yes | |
| `leased_by` | `text` | yes | FK `sys_processes` |
| `effect_started_at` | `timestamptz` | yes | committed marker for `non_repeatable` effects |
| `last_error_category` | `text` | yes | Section 2.20 |
| `last_error_code` | `text` | yes | closed reason code |
| `created_at` | `timestamptz` | no | |
| `created_by_operation_id` | `text` | yes | FK `sys_operations` (deferred) |
| `finished_at` | `timestamptz` | yes | |
| `result` | `jsonb` | yes | ids and codes only |
| `revision` | `bigint` | no | |

Constraints: `UNIQUE (kind, dedupe_key)`; `CHECK (state <> 'leased' OR (lease_token_hmac IS NOT NULL AND lease_expires_at IS NOT NULL))`. Indexes: `(not_before) WHERE state IN ('pending','failed_retryable')`, `(lease_expires_at) WHERE state = 'leased'`, `(application_id) WHERE application_id IS NOT NULL`.

#### `sys_blobs` — blob registry (private bytes)

| Column | Type | Null | Meaning |
|---|---|---|---|
| `blob_id` | `text` | no | PK `blb_`; also the file name |
| `area` | `text` | no | `staging`, `quarantine`, `canonical` (physical directory) |
| `state` | `text` | no | `intent`, `staged`, `referenced`, `removing`, `removed`, `missing`, `integrity_failed` |
| `size_bytes` | `bigint` | yes | set when written |
| `sha256` | `bytea` | yes | set when written; integrity evidence |
| `detected_media_type` | `text` | yes | magic-number result |
| `owner_module` | `text` | yes | set with the owner reference |
| `owner_ref_type` | `text` | yes | for example `document_version`, `intake_source_file`, `packet`, `synthetic_mail` |
| `owner_ref_id` | `text` | yes | |
| `ta_account_id` | `text` | yes | isolation scope |
| `staging_lease_expires_at` | `timestamptz` | no | cleanup MAY claim an unreferenced blob only after this time |
| `pending_move_to` | `text` | yes | target area while a move task is pending |
| `created_at` | `timestamptz` | no | |
| `written_at` | `timestamptz` | yes | |
| `referenced_at` | `timestamptz` | yes | |
| `verified_at` | `timestamptz` | yes | last full SHA-256 verification |
| `removed_at` | `timestamptz` | yes | |
| `revision` | `bigint` | no | |

Constraints: `UNIQUE (owner_ref_type, owner_ref_id) WHERE owner_ref_id IS NOT NULL`; `CHECK (state <> 'referenced' OR owner_ref_id IS NOT NULL)`; `CHECK (area <> 'canonical' OR state IN ('referenced','missing','integrity_failed'))`.

#### `sys_synthetic_mail` (test and local-test environments only)

| Column | Type | Null | Meaning |
|---|---|---|---|
| `message_id` | `text` | no | PK `sml_` |
| `created_at` | `timestamptz` | no | |
| `recipient` | `text` | no | synthetic address (`@synthetic.test`) |
| `purpose` | `text` | no | `ta_sign_in_otp`, `staff_sign_in_otp`, `email_change_current_otp`, `email_change_new_otp`, `staff_enrolment`, `document_email` |
| `blob_id` | `text` | no | FK; `.eml` bytes (contains OTPs; mode 0600; never served) |
| `result` | `text` | no | `synthetic_accepted`, `failed`, `uncertain` |
| `email_send_id` | `text` | yes | FK `dlv_email_sends` |

Configuration refuses this transport in `production`.

### 3.3 Identity & Access tables (`iam_`)

| Table | PK | Key columns | Guard / state | Notes |
|---|---|---|---|---|
| `iam_accounts` | `account_id` | `role`, `status`, `email_normalized`, `email_display`, `display_name`, `mfa_enrolled_at`, `totp_secret_enc bytea`, `totp_key_generation int`, `totp_last_step bigint`, `created_by`, `revision` | `UNIQUE (email_normalized) WHERE status <> 'declined'`; `CHECK (role <> 'ta' OR totp_secret_enc IS NULL)`; status transitions only by Identity commands with revision | `totp_last_step` blocks TOTP replay |
| `iam_sessions` | `session_id` | `account_id`, `token_hmac`, `kind` (`ta`, `staff`, `enrolment`), `created_at`, `last_seen_at`, `idle_expires_at`, `absolute_expires_at`, `revoked_at`, `revoke_reason`, `mfa_verified_at`, `secret_generation`, `support_view_id` | `UNIQUE (token_hmac)`; index `(account_id) WHERE revoked_at IS NULL` | suspension, email change, credential reset and restore revoke |
| `iam_otp_challenges` | `otp_id` | `purpose`, `account_id` (NULL for decoy), `contact_hmac`, `attempt_binding_hmac`, `verifier_hmac`, `email_change_id`, `issued_at`, `expires_at`, `attempts_used`, `max_attempts`, `state`, `secret_generation`, `revision` | `UNIQUE (purpose, contact_hmac, attempt_binding_hmac) WHERE state = 'issued'`; verification is a conditional update `WHERE state='issued' AND attempts_used < max_attempts AND expires_at > $now` | states `issued`, `consumed`, `exhausted`, `expired`, `superseded` |
| `iam_email_changes` | `email_change_id` | `account_id`, `old_email_normalized`, `new_email_normalized`, `current_otp_id`, `new_otp_id`, `current_verified_at`, `new_verified_at`, `state`, `expires_at`, `revision` | `UNIQUE (account_id) WHERE state IN ('started','current_verified','new_verified')` | switch is one transaction (Section 11) |
| `iam_grants` | `grant_id` | `kind`, `grantee_account_id`, `group_id`, `purpose`, `valid_from`, `valid_until`, `granted_by`, `revoked_by`, `revoked_at`, `state`, `revision` | `UNIQUE (grantee_account_id) WHERE kind='accounting' AND state='active'`; `CHECK (kind <> 'group_read' OR (group_id IS NOT NULL AND valid_until IS NOT NULL))` | validity is evaluated against `now` at every use |
| `iam_elevations` | `elevation_id` | `target_account_id`, `kind` (`create_superadmin`, `elevate_operator`), `requested_by`, `approved_by`, `state`, `revision` | `UNIQUE (target_account_id) WHERE state='requested'`; `CHECK (approved_by IS NULL OR approved_by <> requested_by)` | approver MUST be a distinct active SuperAdmin at approval |
| `iam_enrolments` | `enrolment_id` | `account_id`, `token_hmac`, `purpose` (`activation`, `credential_reset`), `issued_by`, `expires_at`, `consumed_at`, `state`, `secret_generation` | `UNIQUE (token_hmac)`; conditional consume | staff TOTP enrolment |
| `iam_support_views` | `support_view_id` | `superadmin_id`, `viewed_account_id`, `reason`, `started_at`, `ended_at` | one open per SuperAdmin session | read-only mode record |
| `iam_captcha_spent` | `challenge_hmac` | `expires_at` | PK = single use; written only by `identity.consumeBotCheck` (rev 2, record 11 CCR-03) | ALTCHA replay guard |
| `iam_rate_limits` | `key` | `points integer`, `expire bigint` | library schema (`rate-limiter-flexible` PostgreSQL store, `tableCreated: true`) | created by migration only |

Rev 2 (record 11 CCR-06/CCR-07, accepted): the Identity columns, states and guards of record 11 §2 are normative detail of this section, including `iam_accounts.email_revision`, the OTP guard `UNIQUE (purpose, attempt_binding_hmac) WHERE state = 'issued'`, the `iam_email_changes` open-state index without `new_verified`, `iam_grants_group_read_uq`, `iam_enrolments_open_uq`, and the `mail_state`/`delivery_code_enc` columns used by `iam.send_mail`. Every named guard is registered in `GUARD_CONSTRAINTS`.

### 3.4 Catalogue tables (`cat_`)

| Table | PK | Key columns | Guard / state | Notes |
|---|---|---|---|---|
| `cat_countries` | `country_id` | `code`, `name`, `public_slug`, `listing_state` (`listed`, `unlisted`), `revision` | `UNIQUE (code)`, `UNIQUE (public_slug)` | synthetic country `SYN` for tests |
| `cat_offerings` | `offering_id` | `country_id`, `service_code`, `service_mode`, `title`, `availability`, `head_declaration_id`, `head_baseline_id`, `head_binding_id`, `publication_seq bigint`, `revision` | `UNIQUE (country_id, service_code, service_mode)`; head row is the guard row: readers `FOR SHARE`, publication `FOR UPDATE` | stable service identity used in duplicate scope |
| `cat_declarations` | `declaration_id` | `offering_id`, `version_no`, `decl_schema`, `body jsonb`, `body_sha256`, `status` (`draft`, `supported`, `unsupported`, `retired`), `support_basis` (`engineering_release`, `owner_approval`), `release_id`, `owner_approval_id` | `UNIQUE (offering_id, version_no)`; `CHECK` basis ⇒ matching ref not null | B05 |
| `cat_baselines` | `baseline_id` | `offering_id`, `declaration_id`, `version_no`, `values jsonb`, `values_sha256`, `status` (`draft`, `previewed`, `published`, `superseded`), `effective_from`, `preview_id`, `publication_id` | `UNIQUE (offering_id, version_no)`; `UNIQUE (offering_id) WHERE status='published'` | business values only (B05) |
| `cat_bindings` | `binding_id` | `offering_id`, `declaration_id`, `capability_id`, `capability_version`, `requires jsonb`, `release_id NOT NULL`, `registration_state` (`registered`, `retired`) (rev 2, record 12 CCR-05) | `UNIQUE (declaration_id, capability_id, capability_version)` | support is derived by `bindingStatus` against the active release's `capability_set` at each use; no stored support status (Section 9) |
| `cat_previews` | `preview_id` | `baseline_id`, `computed_at`, `summary jsonb`, `affected_count`, `computed_by` | — | price/impact preview before publication (B06) |
| `cat_publications` | `publication_id` | `offering_id`, `kind`, `before jsonb`, `after jsonb`, `reason`, `actor_id`, `recorded_at`, `publication_at`, `effective_condition`, `affected_scope jsonb`, `accountable_reviewer_id`, `impact_assessment_id` | append-only by writer convention | B06 record |
| `cat_owner_approvals` | `owner_approval_id` | `offering_id`, `declaration_id`, `declaration_body_sha256`, `scope jsonb` (`{ offeringId, versionNo, itemKeys[] }`), `scope_sha256`, `evidence jsonb`, `recorded_by`, `recorded_at` | rev 2: `UNIQUE (declaration_id, scope_sha256)` (several approvals per version MAY exist; insert-only) | outside-product approval recorded by a SuperAdmin for the exact version and scope (B05). An owner-gated declaration item (Section 9.2) is approved when any row for that declaration lists the item key |
| `cat_impact_assessments` | `impact_assessment_id` | `offering_id`, `cause` (`baseline_publication`, `declaration_change`, `binding_change`, `release`), `state` (`open`, `reviewed`), `accountable_superadmin_id`, `opened_at`, `revision` | — | B06 |
| `cat_impact_items` | `impact_item_id` | `impact_assessment_id`, `application_id`, `applicability` (`unknown`, `unaffected`, `affected`), `treatment` (`pending`, `continue`, `transition`, `hold`), `decided_by`, `decided_at`, `revision` | `UNIQUE (impact_assessment_id, application_id)`; index `(application_id) WHERE applicability <> 'unaffected' AND treatment IN ('pending','hold')` | unknown applicability prevents filing readiness |

Rev 2 (record 12 CCR-14, accepted): the Catalogue and launch-control column sets and guards of record 12 §2.9 are normative detail: assessment states `rechecking`, `review_required`, `reviewed`, `superseded`; item columns `is_current`, `valid_through_assessment_no`, `from_*`, `classification_code`, `continuation_kind`, `transition_id`, `hold_owner_id`; offering `latest_assessment_no`, `is_synthetic`; one open baseline draft per offering; tables `cat_release_registrations`, `ops_launch_plans` (`lpl_`), `ops_launch_audience`; launch-decision columns `plan_id`, `acknowledged_unavailable`, `baseline_id`, `release_id`, `supersedes_launch_id`; suspension revision and lift fields; `ops_existing_work_treatments.cause_kind` (`suspension`, `withdrawal`).

### 3.5 Core tables (`core_`)

#### `core_applications` (central guard table)

| Column | Type | Null | Meaning |
|---|---|---|---|
| `application_id` | `text` | no | PK `app_` |
| `group_id` | `text` | no | FK; immutable |
| `ta_account_id` | `text` | no | FK; copied from group; immutable |
| `offering_id` | `text` | no | FK; service identity; immutable |
| `applicant_key` | `text` | no | Section 1.1; changes only through the identity-correction writer |
| `lifecycle` | `text` | no | Section 2.4 |
| `outcome` | `text` | yes | Section 2.5 |
| `outcome_at` | `timestamptz` | yes | |
| `completion_id` | `text` | yes | FK `core_completions`; `CHECK ((lifecycle IN ('completed','ended_with_group')) = (completion_id IS NOT NULL))` |
| `editor_state` | `text` | no | Section 2.9 |
| `hold_revision` | `bigint` | no | increments on every hold open/close |
| `material_revision` | `bigint` | no | increments on every change of application information, applicant snapshot, document association, travel dates, governing identities |
| `governing_declaration_id` | `text` | no | FK |
| `governing_baseline_id` | `text` | no | FK |
| `governing_binding_id` | `text` | no | FK |
| `admitted_launch_id` | `text` | no | FK `ops_launch_decisions`; launch under which created |
| `submission_id` | `text` | yes | FK |
| `active_assignment_id` | `text` | yes | FK |
| `assigned_operator_id` | `text` | yes | FK; `CHECK ((active_assignment_id IS NULL) = (assigned_operator_id IS NULL))` |
| `operator_work_ever_authorized` | `boolean` | no | true from the first accepted assignment; never reset (B25) |
| `government_attempt_no` | `integer` | no | number of evidenced government submissions (a measure and display value). Rev 2: it no longer drives logical effect keys; Section 1.1 |
| `dates_checked_revision`, `later_attempt_of`, `withdrawal_id` | | | rev 2 (record 13 CCR-20): detail in record 13 §2.1 |
| `created_via` | `text` | no | `form`, `intake` |
| `intake_row_id` | `text` | yes | FK |
| `created_at` | `timestamptz` | no | |
| `revision` | `bigint` | no | |

Guards:
- `CREATE UNIQUE INDEX core_applications_open_scope_uq ON core_applications (group_id, offering_id, applicant_key) WHERE lifecycle IN ('draft','submitted');` — open duplicate scope applicant + group + service (B03, B35), including the empty-scope race: two concurrent first inserts for the same scope collide on this index; the loser gets `23505` or `40001` and its retry resolves to `conflict_duplicate` / `matched_existing`.
- Rev 2 (MON-04): `applicant_key` is written only by the Core writer `setApplicantKey` (Section 6.4). It applies the open-scope guard **and** the later-attempt and no-refiling rule (Section 7.1, `create_draft` row) for every write: draft creation (form and intake), identity correction (TA, assistance entry, SuperAdmin evidence correction) and intake correction. A key change into a scope that holds a closed application is refused with `later_attempt_declaration_required` unless the command carries the same explicit fresh-intake declaration and authority as draft creation; it is always refused with `reconciliation_exhausted_no_refiling` when any application of that scope has a `reconciliation_exhausted` act. Index `(group_id, offering_id, applicant_key) WHERE lifecycle IN ('completed','ended_with_group')` serves this check.
- Immutable-column trigger on `group_id`, `ta_account_id`, `offering_id`, `created_via`, `intake_row_id`.
- Index `(ta_account_id)`, `(assigned_operator_id) WHERE assigned_operator_id IS NOT NULL`, `(group_id)`.

#### Other Core tables

| Table | PK | Key columns | Guard / state |
|---|---|---|---|
| `core_groups` | `group_id` | `ta_account_id`, `country_id`, `label`, `travel_start_date date`, `travel_return_date date`, `state` (`open`, `closed`), `closed_kind` (`ordinary`, `group_end`), `closed_at`, `revision` | `CHECK (travel_return_date >= travel_start_date)`; immutable `ta_account_id`, `country_id`; new application `FOR SHARE` on group row; closure `FOR UPDATE` |
| `core_applicant_snapshots` | `snapshot_id` | `application_id`, `version_no`, `data jsonb`, `evidence jsonb`, `created_by`, `created_at`, `is_current` | `UNIQUE (application_id, version_no)`; `UNIQUE (application_id) WHERE is_current` |
| `core_submissions` | `submission_id` | `application_id`, `submitted_by`, `submitted_at`, `confirmation_present boolean`, `confirmation_text_version`, `quoted_price_paise`, `price_baseline_id`, `estimate jsonb`, governing ids | `UNIQUE (application_id)` (one formal submission) |
| `core_price_records` | `price_record_id` | `application_id`, `seq_no` (rev 2), `kind` (`quoted`, `reduction_auto`, `increase_proposed`), `cause` (`initial`, `baseline_reduction`, `mistaken_price`, `material_scope_change`), `amount_paise`, `effective_price_paise`, `previous_price_paise`, `baseline_id`, `state` (`effective`, `open`, `accepted`, `declined`), `decided_by`, `recorded_at`, `revision` | `UNIQUE (application_id) WHERE kind='increase_proposed' AND state='open'`; `UNIQUE (application_id, seq_no)`; `UNIQUE (application_id, baseline_id) WHERE kind='reduction_auto'` |
| `core_forecasts` (rev 2, record 13 CCR-01) | `forecast_id` (`fcs_`) | `application_id`, `seq_no`, `window_start`, `window_end`, `basis_code`, `note`, `recorded_by`, `recorded_at`, `is_current` | `UNIQUE (application_id) WHERE is_current`; the original estimated window in `core_submissions` never changes (B17) |
| `core_assistance_requests` | `assistance_id` | `application_id`, `requested_by`, `state` (`requested`, `approved`, `declined`, `fulfilled`), `decided_by`, `reason`, `revision` | `UNIQUE (application_id) WHERE state IN ('requested','approved')` |
| `core_assignments` | `assignment_id` | `application_id`, `operator_account_id`, `kind` (`initial`, `assistance`, `reassignment`), `state` (`active`, `ended`), `assigned_by`, `reason`, `gate1_basis_kind` (`payment_received`, `gate_exception`), `gate1_basis_ref`, `started_at`, `ended_at`, `ended_reason` | `UNIQUE (application_id) WHERE state='active'` — one open assignment per application |
| `core_gate_exceptions` | `gate_exception_id` | `application_id`, `gate`, `action`, `reason`, `granted_by`, `granted_at`, `expires_at`, `basis jsonb`, `state` (`granted`, `consumed`, `expired`, `revoked`), `consumed_by_operation_id`, `consumed_at`, `revision` | `UNIQUE (application_id, gate, action) WHERE state='granted'`; consumption is conditional update `WHERE state='granted'` |
| `core_holds` | `hold_id` (`prb_`/`ret_`/`flg_`) | `application_id`, `kind`, `opened_by`, `opened_at`, `note`, `state` (`open`, `resolved`), `resolved_by`, `resolved_at`, `resolution_note` | `UNIQUE (application_id, kind) WHERE state='open'` |
| `core_corrections` | `correction_id` | `application_id`, `kind` (`draft_identity`, `draft_other`, `submitted_unassigned`, `after_return`, `assistance_entry`, `superadmin_evidence`), `before jsonb`, `after jsonb`, `evidence jsonb`, `actor_id`, `expected_revision`, `accepted_at` | all-or-nothing in the correction transaction (B16, B19) |
| `core_withdrawals` | `withdrawal_id` | `application_id`, `requester_kind` (`ta`, `applicant_via_operator`, `superadmin_operational`), `requested_by`, `evidence`, `state` (`accepted`, `refused`), `reason_code`, `decided_at` | `UNIQUE (application_id) WHERE state='accepted'` |
| `core_action_authorizations` | `authorization_id` | `application_id`, `act_kind`, `act_state`, `attempt_ordinal` (rev 2), `carries_fee boolean` (rev 2: this act is the declaration's fee-carrying act, Section 7.4), `logical_effect_key` (set iff `carries_fee`), `government_attempt_no` (value at authorization; informational), `authorized_by`, `assignment_id`, `readiness_id`, `gate1_basis`, `gate2_basis` (`payment_received`, gex id, `not_applicable`, `same_attempt`), `readiness_basis` (`valid`, gex id), governing ids, `evidence_set_sha256`, `reservation_id`, `fee_amount_paise`, `reconciliation_owner_id`, `authorized_at`, `state_changed_at`, `revision` | `UNIQUE (application_id, act_kind) WHERE act_state IN ('authorized','filing_unknown')` — no second open act; `CHECK (carries_fee = (logical_effect_key IS NOT NULL))`; `CHECK (carries_fee = (reservation_id IS NOT NULL))`; `reconciliation_owner_id` follows reassignment; detail record 13 §2.1 |
| `core_packet_releases` (rev 2, record 13 CCR-02) | `packet_release_id` (`prl_`) | `application_id`, `packet_id`, `packet_sha256`, `assignment_id`, `readiness_id`, `readiness_basis`, governing ids, `evidence_fingerprint`, `released_by`, `released_at` | `UNIQUE (application_id)`; the only record of the readiness-gated packet-release acceptance (B04, B18, B34); Delivery's `dlv_packets.state = 'released'` is set by `delivery.markPacketReleased` in the same transaction |
| `core_dependencies` | `dependency_id` | `dependent_application_id`, `upstream_application_id` (NOT NULL; rev 2, BND-05: no `external_evidence` upstream kind), `relationship_code`, `required_outcome`, `required_artifact_type`, `conditioned_actions`, `state` (`waiting`, `met`, `unmet_missing_evidence`, `failed_incompatible`, `unlinked`), `met_artifact_version_id`, `revision` | `UNIQUE (dependent_application_id, relationship_code) WHERE state <> 'unlinked'`; `CHECK (dependent_application_id <> upstream_application_id)`; rev 2 (COV-08 interim): the writer requires the upstream in the **same group** as the dependent (one TA, one country, B03); cross-group dependencies are owner decision OD-R2-06 |
| `core_deferrals` | `deferral_id` | `application_id`, `state` (`proposed`, `approved`, `declined`, `ended`), `justification`, `proposed_by`, `approved_by`, `review_on date`, `notice_id`, `revision` | `UNIQUE (application_id) WHERE state IN ('proposed','approved')` |
| `core_transitions` | `transition_id` | `application_id`, `from_declaration_id`, `from_binding_id`, `to_declaration_id`, `to_binding_id`, `compatibility_evidence`, `approved_by`, `ta_authority_required`, `ta_authority_at`, `state` (`awaiting_ta_authority`, `applied`, `declined`), `revision` | `UNIQUE (application_id) WHERE state='awaiting_ta_authority'` |
| `core_protection_marks` | `mark_id` | `application_id`, `restore_id`, `possibly_filed`, `possibly_paid`, `possibly_released`, `recorded_by_label`, `state` (`active`, `resolved`), `resolved_by`, `evidence`, `revision` | `UNIQUE (application_id, restore_id)` — retry creates nothing new (B41) |
| `core_completions` | `completion_id` | `application_id`, `kind` (`completed`, `ended_with_group`), `evidence jsonb`, `actor`, `completed_at` | `UNIQUE (application_id)` |

### 3.6 Intake tables (`intake_`)

| Table | PK | Key columns | Guard / state |
|---|---|---|---|
| `intake_attempts` | `attempt_id` | `group_id`, `ta_account_id`, `source_kind`, `source_locator text` (public URL or upload name; personal data class), `state`, `corrects_attempt_id`, `root_attempt_id`, `catalogue_snapshot jsonb`, `release_id`, `worker_contract`, `row_pattern`, `created_by`, `created_at`, `revision` | correction attempt MUST reference `root_attempt_id`; one attempt accepted per operation key |
| `intake_source_files` | `source_file_id` | `attempt_id`, `blob_id`, `role` (`sheet`, `document`, `folder_listing`), `state` (`pending`, `quarantined`, `checked`, `rejected`, `unreadable`, `excluded_unrelated`, `not_fetched_unreferenced`), `locator_digest`, `document_version_id` | `UNIQUE (blob_id)`; `UNIQUE (attempt_id, role, locator_digest)` (rev 2, record 14 CCR-14) |
| `intake_rows` | `row_id` | `attempt_id`, `source_locator`, `state`, `mapped jsonb`, `applicant_key`, `result jsonb`, `supersedes_row_id`, `revision` | `UNIQUE (attempt_id, source_locator)` |
| `intake_row_effects` | (`root_attempt_id`, `source_locator`, `offering_id`) | `application_id`, `effect` (`created`, `matched_existing`), `first_row_id` | PK makes the Nth identical retry resolve to the same application (B16) |
| `intake_questions` | `question_id` | `attempt_id`, `kind`, `payload jsonb`, `state` (`open`, `answered`, `withdrawn`), `answer jsonb`, `answered_by`, `revision` | answers carry expected attempt revision |
| `intake_incidents` | `incident_id` | `attempt_id`, `row_id`, `kind`, `state`, `owner_kind` (`ta`, `superadmin`), `related_application_ids jsonb`, `disposed_by`, `disposition_reason`, `disposed_at`, `revision` | disposition never cancels an application |

Rev 2 (record 14 CCR-06/CCR-11/CCR-14, accepted): the Intake columns and auxiliary tables of record 14 §2 (`intake_row_files`, `intake_row_services`, attempt `generation`, `slot`, `has_rows`, `source_locator_digest`) are normative detail.

### 3.7 Document Processing tables (`doc_`)

| Table | PK | Key columns | Guard / state |
|---|---|---|---|
| `doc_versions` | `version_id` | `group_id` (scope), `ta_account_id`, `purpose` (rev 2; immutable), `source`, `uploaded_by`, `blob_id`, `sha256`, `size_bytes`, `declared_media_type`, `detected_media_type`, `processing_state`, `content_safe` (rev 2), `check_exhausted`, `bytes_state`, `currency`, `replaces_version_id`, `classified_type`, `intake_attempt_id`, `revision` | `UNIQUE (blob_id)`; a version never changes group (immutable trigger); content hash equality grants nothing across scopes; `CHECK (bytes_state <> 'canonical' OR content_safe)`; detail record 14 §2.10 |
| `doc_safety_verdicts` | `verdict_id` | `version_id`, `attempt_no`, `verdict`, `checks jsonb`, `scanner_db_version`, `decided_at` | `UNIQUE (version_id, attempt_no)` |
| `doc_extraction_verdicts` | `verdict_id` | `version_id`, `extractor_contract`, `status`, `fields jsonb`, `confidences jsonb`, `decided_at`, `resolved_by`, `is_current boolean` | `UNIQUE (version_id) WHERE is_current`; a manual resolution inserts a new current verdict and clears the old flag in one transaction (no clock ordering) |
| `doc_associations` | `association_id` | `version_id`, `application_id`, `requirement_type`, `identity_role`, `subject`, `status`, `basis` (`automatic`, `manual_ta`, `manual_operator`, `intake_proposal`), `decided_by`, `evidence`, `revision` | `UNIQUE (version_id, application_id, requirement_type) WHERE status IN ('proposed','positive')`; `UNIQUE (application_id) WHERE identity_role AND status = 'positive'`; writer refuses an application outside the version's group and (rev 2) any version whose `purpose <> 'evidence'`. Official-result artifacts are associated only in `ops_artifacts` (C-03) |

### 3.8 Operations tables (`ops_`)

| Table | PK | Key columns | Guard / state |
|---|---|---|---|
| `ops_offering_controls` | `offering_id` | `launch_state`, `current_launch_id`, `suspension_state`, `current_suspension_id`, `withdrawal_state`, `current_withdrawal_id`, `revision` | guard row: admission readers `FOR SHARE`; launch/suspend/lift/withdraw `FOR UPDATE` |
| `ops_launch_decisions` | `launch_id` | `offering_id`, `kind` (`launch`, `scope_expansion`), `audience jsonb`, `declaration_id`, `binding_id`, `readiness_evidence jsonb`, `reason`, `approved_by`, `approved_at`, `state` (`current`, `superseded`) | `UNIQUE (offering_id) WHERE state='current'` |
| `ops_suspensions` | `suspension_id` | `offering_id`, `reason`, `evidence`, `suspended_by`, `suspended_at`, `existing_work_treatment`, `state` (`active`, `lifted`), `lifted_by`, `lifted_at`, `restores_launch_id` | `UNIQUE (offering_id) WHERE state='active'` |
| `ops_offering_withdrawals` | `withdrawal_id` | `offering_id`, `effective_at`, `permits_unfiled_continuation boolean`, `reason`, `withdrawn_by` | `UNIQUE (offering_id)` |
| `ops_existing_work_treatments` | `treatment_id` | `offering_id`, `cause_ref` (suspension, withdrawal or impact assessment id), `treatment`, `recorded_by`, `recorded_at`, `is_current boolean` | `UNIQUE (cause_ref) WHERE is_current`; a new treatment supersedes the current one in one transaction under the cause row's revision |
| `ops_readiness` | `readiness_id` | `application_id`, `assignment_id`, `operator_account_id`, `basis_fingerprint bytea`, `basis jsonb`, `state`, `recorded_at` | `UNIQUE (application_id) WHERE state='current'` |
| `ops_incidents` | `incident_id` | `kind`, `state`, `dedupe_key` (rev 2: `UNIQUE NOT NULL`), `application_id`, `document_version_id`, `artifact_id`, `country_id`, `owner_kind` (`assigned_operator`, `superadmin`, `reviewer`), `owner_account_id`, `reviewer_account_id`, `candidate_application_ids jsonb`, `affected jsonb`, `required_evidence text[]`, `notice_ids jsonb`, `opened_by`, `opened_at`, `resolution_evidence jsonb`, `revision` | resolve requires every `required_evidence` code; detail record 13 §2.2 (record 13 CCR-11) |
| `ops_artifacts` | `artifact_id` | `uploaded_for_application_id` (rev 2; immutable), `application_id` (associated application; NULL until verified), `document_version_id` (`UNIQUE`), `artifact_type`, `association_status` (`verified`, `pending_review`, `conflict`, `rejected`), `association_metadata jsonb`, `eligibility` (`eligible`, `withheld_pending_review`, `withheld_wrong`, `blocked`, `noncurrent`) (rev 2, record 13 CCR-12; `withheld_missing` is a derived application-level status of `artifactEligibility`), `replaced_by`, `incident_id`, `revision` | `UNIQUE (application_id, artifact_type) WHERE eligibility='eligible'`; release check reads `FOR SHARE`, block writes `FOR UPDATE` |
| `ops_originals` | `original_id` | `group_id`, `ta_account_id`, `item_key` (rev 2, REC-20/SEC-09: for a passport the **plain applicant key**, a PD column of this owner table; never an HMAC or any value derived from a rotating secret), `description`, `holder_kind`, `location`, `uncertainty`, `state` (derived aggregate of parts), `revision` | `UNIQUE (group_id, item_key)`: item recorded once, also after a restore with new secrets; `GUARD_CONSTRAINTS` maps its violation to a code only (the key value never enters diagnostics) |
| `ops_original_parts` (rev 2, record 13 CCR-15) | (`original_id`, `part_no`) | `label`, `state` (`expected`, `received`, `held`, `in_transit`, `returned`, `unknown`), `holder_kind`, `holder_ref`, `location`, `revision` | item-level receipt and partial movement (B30) |
| `ops_original_links` | (`original_id`, `application_id`) | — | link grants no cross-application view |
| `ops_original_movements` | `movement_id` | `original_id`, `kind` (`receipt`, `partial_movement`, `holder_update`, `return`), `parts int[]`, `recipient jsonb`, `possession_attested`, `evidence`, `actor_id`, `recorded_at` | rev 2 (record 13 CCR-15): `return` is available only when every linked application's governing declaration declares an owner-approved `originals.returnPolicy` (and, with more than one linked application, a shared-item rule); otherwise `unavailable_parked` / `parked_custody_route_policy` (B30) |
| `ops_act_evidence` | `evidence_id` | `authorization_id`, `evidence_kind`, `evidence jsonb`, `recorded_by`, `recorded_at` | — |
| `ops_reconciliation_attempts` | `attempt_id` | `authorization_id`, `method`, `result`, `recorded_by`, `recorded_at` | — |
| `ops_failure_classifications` | `classification_id` | `subject_type`, `subject_id`, `scope` (`local`, `shared`, `unresolved`), `country_id`, `evidence`, `recorded_by` | unknown/shared hosting does not establish `shared` (B34) |
| `ops_work_steps` | `step_id` | `application_id`, `assignment_id`, `step_code`, `state`, `recorded_by`, `recorded_at` | local progress mapping per declaration; `UNIQUE (assignment_id) WHERE step_code = '_work_started'` |
| `ops_effort_samples` (rev 2, record 15 CCR-15-15, COV-10) | `sample_id` (`efs_`) | `application_id`, `party` (`operator`, `ta`, `partner`), `step_code` (declared `progressMapping` code or `_whole_case`), `minutes` (int ≥ 0) or `missing_reason` (closed code), `sampling_basis` (`every_case`, `sampled`), `source` (`self_report`, `staff_observation`, `partner_statement`), `recorded_by`, `recorded_at` | `CHECK ((minutes IS NULL) <> (missing_reason IS NULL))`; append-only; feeds measure M-06 with sample sizes and missing shares (B32) |

### 3.9 Payment Records tables (`pay_`)

| Table | PK | Key columns | Guard / state |
|---|---|---|---|
| `pay_application_state` | `application_id` | `ta_account_id`, `current_status`, `current_entry_id`, `status_revision bigint`, `revision` | guard row; Gate 1/Gate 2 readers `FOR SHARE`; entries `FOR UPDATE` |
| `pay_service_entries` | `entry_id` | `application_id`, `kind`, `status`, `amount_paise`, `evidence`, `corrects_entry_id`, `recorded_by`, `recorded_at` | append-only trigger; corrections additive |
| `pay_ta_exposure` | `ta_account_id` | `ceiling_paise` (default 0), `ceiling_source` (`default`, `set`), `reserved_paise`, `tm_paid_unrecovered_paise`, `revision` | guard row `FOR UPDATE` for every reservation and ceiling change; `CHECK` all ≥ 0 |
| `pay_ceiling_changes` | `change_id` | `ta_account_id`, `kind`, `old_paise`, `new_paise`, `requested_by`, `approved_by`, `reason`, `state`, `effective_at` | `CHECK (kind <> 'increase' OR state <> 'effective' OR approved_by <> requested_by)`; `UNIQUE (ta_account_id) WHERE state='increase_requested'` |
| `pay_exposure_reservations` | `reservation_id` | `ta_account_id`, `application_id`, `logical_effect_key` (Section 1.1, attempt ordinal), `amount_paise`, `converted_paise` (rev 2, record 15 CCR-15-01), `state`, `first_authorization_id`, `authorization_id`, `created_at`, `revision` | `UNIQUE (logical_effect_key)` — one reservation per logical effect (B28) |
| `pay_government_fees` | `fee_id` | `application_id`, `ta_account_id`, `logical_effect_key`, `fee_amount_paise`, `ta_liability_paise`, `tm_paid_paise`, `ta_received_allocated_paise`, `state`, `authorization_id`, `revision` | `UNIQUE (logical_effect_key)` |
| `pay_financial_exceptions` | `exception_id` | `application_id`, `ta_account_id`, `kind`, `cause_ref`, `state`, `accountable_superadmin_id`, `opened_at`, `closed_by_entry_id`, `revision` | `UNIQUE (application_id, kind, cause_ref)` |

Invariant (T-F22, rev 2 per record 15 CCR-15-01): for every TA, `pay_ta_exposure.reserved_paise = Σ GREATEST(amount_paise − converted_paise, 0)` over all of that TA's reservations (any state) and `tm_paid_unrecovered_paise = Σ (tm_paid − ta_received_allocated)` over that TA's fee records. Detail of all `pay_` tables: record 15 §2.1.

### 3.10 TA Delivery tables (`dlv_`)

| Table | PK | Key columns | Guard / state |
|---|---|---|---|
| `dlv_releases` | `byte_release_id` | `channel` (`RELEASE_CHANNELS`), `recipient_account_id`, `requested_by_account_id`, `application_id`, `ta_account_id`, `subject_kind` (`document_version`, `artifact`, `packet`), `subject_id`, `document_version_id`, `artifact_id`, `packet_id`, `selection_id`, `selection_item_no`, `email_send_id`, `incident_id` (staff_review only), `check_result` (`allowed`, `denied`), `deny_reason`, `checked_at`, bytes metadata, `result`, `bytes_sent`, `finished_at`, `software_release_id`, `operation_id` (rev 2, record 15 CCR-15-13) | result set once: `UPDATE … WHERE result IS NULL` |
| `dlv_selections` | `selection_id` | `requested_by`, `created_at`, `item_count` | — |
| `dlv_selection_items` | (`selection_id`, `item_no`) | `application_id`, `document_version_id`, `result`, `reason` | per-item truth (B12) |
| `dlv_email_sends` | `email_send_id` | `application_id`, `recipient_account_id`, `recipient_email_snapshot`, `document_version_ids jsonb`, `state`, `attributed_by`, `resend_of`, `queued_at`, `sending_at`, `result_at`, `transport_label` | `UNIQUE (resend_of) WHERE resend_of IS NOT NULL`; `sending` marker committed before transport |
| `dlv_notices` | `notice_id` | `recipient_account_id`, `application_id`, `kind`, `params jsonb`, `ack_required`, `posted_at`, `read_at`, `acknowledged_at`, `dedupe_key` | `UNIQUE (dedupe_key)` |
| `dlv_handovers` | `handover_id` | `application_id`, `kind` (`packet`, `physical`, `manual_operator_email`, `direct_external`), `recipient`, `evidence`, `recorded_by`, `recorded_at`, `system_verified boolean` | `system_verified = false` for manual and direct records |
| `dlv_packets` | `packet_id` | `application_id`, `blob_id`, `built_from jsonb`, `evidence_fingerprint`, `state` (`PACKET_STATES`), `sha256`, `packet_release_id` (rev 2: FK `core_packet_releases`, set by `markPacketReleased`), `failure_code`, `revision` | `UNIQUE (application_id) WHERE state IN ('building','built','released')`; `released` only through `delivery.markPacketReleased` called by Core's `core.release_packet` (rev 2, COV-03) |

### 3.11 Derived Views tables (`view_`)

| Table | PK | Content |
|---|---|---|
| `view_projector_state` | `projector` | `last_tx_id xid8`, `last_seq bigint`, `healthy boolean`, `lag_ms`, `updated_at` |
| `view_applications` | `application_id` | `ta_account_id`, `group_id`, `assigned_operator_id`, `offering_id`, `lifecycle`, `outcome`, `progress`, `pending jsonb`, `search tsvector`, `as_of_seq` |
| `view_assignment_queue` | `application_id` | queue reason, since, offering, TA |
| `view_audit_index` | `seq` | denormalized fact search index (SuperAdmin only) |
| `view_ta_history` | (`application_id`, `seq`) | TA-facing history lines (redacted per TA scope) |
| `view_financial_follow_up` | `exception_id` | `Payment_Missing_Override` listing |
| `view_measures_*` | per measure | B32 measures with sample sizes and missing shares |

Views MUST NOT be read by any guard or control evaluation (B33, B35). A view row is rebuildable from business truth.

## 4. Kernel API

All signatures are normative names and shapes. Implementations MAY add private helpers. All functions are `async` unless marked pure.

### 4.1 Database access types (`src/kernel/db.ts`)

```ts
import type { z } from 'zod';

declare const txKind: unique symbol;

export type SqlValue = string | number | bigint | boolean | Date | Buffer | null | readonly string[] | JsonValue;
export interface Sql { readonly text: string; readonly values: readonly SqlValue[] }
export interface SqlFragment { readonly sql: Sql }                        // composable predicate (policy scope)
export function sql(strings: TemplateStringsArray, ...values: readonly (SqlValue | SqlFragment)[]): Sql;   // pure; values always parameterized
export function frag(strings: TemplateStringsArray, ...values: readonly (SqlValue | SqlFragment)[]): SqlFragment;

export interface ReadTx {
  readonly [txKind]: 'read' | 'write';
  readonly now: Date;                                               // one instant per transaction attempt
  rows<T>(q: Sql, row: z.ZodType<T>): Promise<readonly T[]>;
  maybeOne<T>(q: Sql, row: z.ZodType<T>): Promise<T | undefined>;
  one<T>(q: Sql, row: z.ZodType<T>): Promise<T>;                    // 0 or >1 rows ⇒ TmError('internal','expected_one_row')
}
export interface WriteTx extends ReadTx {
  readonly [txKind]: 'write';
  readonly ctx: CommandContext;
  exec(q: Sql): Promise<number>;                                     // affected row count
}
export interface CommandContext {
  readonly operationId: OperationId | null;      // null for task steps
  readonly operationKey: OperationKey | null;
  readonly commandName: CommandName | TaskStepName;
  readonly ownerModule: ModuleName;
  readonly actor: Actor;
  readonly releaseId: ReleaseId;
  readonly writerEpoch: bigint;
  readonly attempt: number;                      // 1-based serialization-retry attempt
  readonly reason: string | null;                // command-level reason, if any
}

export type Actor =
  | { readonly kind: 'anonymous'; readonly preSessionKey: string }
  | { readonly kind: 'account'; readonly accountId: AccountId; readonly role: Role; readonly sessionId: SessionId }
  | { readonly kind: 'support_view'; readonly superAdminId: AccountId; readonly sessionId: SessionId; readonly viewedAccountId: AccountId; readonly supportViewId: Id<'spv'> }
  | { readonly kind: 'system_task'; readonly taskId: TaskId; readonly taskKind: TaskKind; readonly onBehalfOf: AccountId | null }
  | { readonly kind: 'engineering'; readonly label: string };

export type Lock = 'none' | 'share' | 'update';
export const GUARD_TABLES = ['sys_installation','iam_accounts','cat_offerings','ops_offering_controls','core_groups','core_applications','pay_application_state','pay_ta_exposure','ops_artifacts','doc_versions'] as const;
export function lockRow(tx: WriteTx, table: GuardTable, id: string, mode: 'share' | 'update'): Promise<boolean>;  // false ⇒ row absent
export function requireAffected(n: number, expected: 1, onZero: { category: 'stale_revision' | 'conflict_duplicate' | 'control_blocked'; code: ReasonCode }): void; // pure; throws

export interface AppPool { readonly role: 'tm_app' }        // wraps pg.Pool; only kernel opens transactions
export interface OwnerPool { readonly role: 'tm_owner' }    // CLI only
export function createAppPool(cfg: DbConfig, secrets: Secrets): AppPool;
export function createOwnerPool(cfg: DbConfig, secrets: Secrets): OwnerPool;
```

Rules:
- Only `src/kernel` opens transactions. Module code receives `ReadTx`/`WriteTx`.
- Read-only transactions cannot take row locks. A query called with `lock` other than `'none'` MUST receive a `WriteTx`; implementations assert this at runtime and fail with `internal` / `unexpected`.
- A `ReadTx` MUST NOT be passed where a `WriteTx` is required (type brand). Queries take `ReadTx`; writers take `WriteTx`.
- Lock order inside one transaction: `sys_installation` (share) → actor `iam_accounts` (share) → `cat_offerings` → `ops_offering_controls` → `core_groups` → `core_applications` (ascending id) → `pay_application_state` → `pay_ta_exposure` → other rows. Deadlocks that still occur are retried (Section 4.2).
- Writers MUST use conditional updates (`… WHERE id = $id AND revision = $expected` or `… AND state = $from`) and `requireAffected`. Writers MUST NOT read-then-write without a lock or condition.

### 4.2 Command runner (`src/kernel/command.ts`)

```ts
export interface CommandDef<I, R extends CommandResult> {
  readonly name: CommandName;                          // closed registry; `<module>.<verb>`
  readonly owner: ModuleName;
  readonly input: z.ZodType<I>;                        // parses raw form/CLI input into normalized I
  readonly actorKinds: readonly ActorKind[];
  readonly reasonRequired: boolean;
  readonly privilegedElevation: boolean;               // refused while audit projection is degraded (B33)
  readonly maintenanceAllowed?: true;                  // rev 2: only for actor kind 'engineering'; runs while admission is closed with closure_kind ∈ {initial, cutover} (catalogue release registration, B39 "verify … while closed"); refused in every other admission state
  readonly canonical?: (input: I) => JsonValue;        // default: the normalized input
  authorize(tx: WriteTx, input: I): Promise<void>;     // MUST call policy.authorize for every touched resource
  handle(tx: WriteTx, input: I): Promise<R>;           // owner writes, facts, tasks; NO external side effect
}
export interface CommandResult { readonly resource: ResourceRef; readonly summary: ResultSummary }
export type ResultSummary = Readonly<Record<string, string | number | boolean | null>>;   // ids, revisions, closed codes; ≤ 4 KB

export type CommandOutcome<R> =
  | { readonly status: 'accepted'; readonly replayed: false; readonly operationId: OperationId; readonly result: R }
  | { readonly status: 'accepted'; readonly replayed: true;  readonly operationId: OperationId; readonly result: { readonly resource: ResourceRef; readonly summary: ResultSummary } }
  | { readonly status: 'rejected'; readonly error: TmErrorShape }
  | { readonly status: 'outcome_unknown'; readonly operationKey: OperationKey };

export interface CommandEnv {
  readonly pool: AppPool; readonly clock: Clock; readonly ids: IdSource; readonly process: ProcessIdentity;
  readonly policy: Policy; readonly faults: Faults; readonly diag: Diag; readonly config: KernelConfig;
}
export function runCommand<I, R extends CommandResult>(
  def: CommandDef<I, R>, env: CommandEnv, actor: Actor, operationKey: OperationKey, rawInput: unknown,
): Promise<CommandOutcome<R>>;
export function lookupOperation(env: CommandEnv, actor: Actor, operationKey: OperationKey): Promise<CommandOutcome<never> | { readonly status: 'not_recorded' }>;
```

`runCommand` algorithm (normative order):

| Step | Action | Failure result |
|---|---|---|
| 1 | Parse `rawInput` with `def.input`. | `validation_failed` (no transaction) |
| 2 | Require `actor.kind ∈ def.actorKinds`. `support_view` is never allowed for a command. | `not_found_or_forbidden` |
| 3 | `contentHash = SHA-256(canonicalJson({ v: 1, command: def.name, actorKey, input: canonical(input) }))` (Section 4.4). | — |
| 4 | Attempt loop `attempt = 1 … config.command.maxAttempts` (default 5). | — |
| 4a | Take a dedicated pooled client. `BEGIN ISOLATION LEVEL SERIALIZABLE, READ WRITE`. `SET LOCAL statement_timeout = config.command.statementTimeoutMs` (5000), `lock_timeout = 2000`, `idle_in_transaction_session_timeout = 10000`. `now = clock.now()`; `operationId = ids.next('opr')`. | pool exhausted ⇒ `capacity_limited` |
| 4b | `assertWriter(tx, env.process)` (Section 4.7); for a `maintenanceAllowed` command with an engineering actor, `assertMaintenanceWriter(tx, env.process)` instead. | `maintenance` or `stale_writer` |
| 4c | `SELECT … FROM sys_operations WHERE actor_key = $k AND operation_key = $op`. Found + same hash ⇒ rollback, go to replay (step 6). Found + different hash ⇒ `conflict_operation_key`. | — |
| 4d | Actor re-check with row locks: account `active`, role unchanged, session not revoked and not expired, staff MFA verified (account actors); lease held (task actors). Rev 2 (record 11 CCR-11): an `enrolment` session is accepted only for `iam.staff_enrol` and `iam.sign_out`. | `unauthenticated` / `not_found_or_forbidden` |
| 4e | If `def.privilegedElevation`, require the audit projector healthy. | `unavailable_dependency` / `audit_degraded` |
| 4f | `def.authorize(tx, input)`; `def.handle(tx, input)`. | the thrown `TmError` |
| 4g | Insert the `sys_operations` row (resource, summary, first fact seq). | — |
| 4h | `COMMIT`. | see below |
| 5 | On error: `ROLLBACK`. SQLSTATE `40001`/`40P01`/`55P03` (rev 2, record 15 CCR-15-10) ⇒ back off (`min(500, 10·2^attempt)` ms ± 50 % jitter) and retry with the same `operationKey`, `contentHash` and input (new `operationId`, new `now`). `23505` on `sys_operations_actor_key_operation_key_key` ⇒ retry (the next attempt finds the record). `23505`/`23P01` on a constraint in `GUARD_CONSTRAINTS` ⇒ **rev 2 (MON-05):** retry the attempt loop once more with the same key; that attempt's step 4c finds a committed operation of the same key and replays it (a concurrent duplicate of one operation, B35); only if step 4c finds no record, or the violation repeats, map to the registered category and code (default `conflict_duplicate`; record 11 CCR-18 lets an entry name another category, for example `validation_failed` / `email_change_address_unavailable`). `57014` ⇒ `capacity_limited` / `capacity_statement_timeout` (no retry); `53300` ⇒ `capacity_limited` / `capacity_connections`; `53200` ⇒ `capacity_limited` / `capacity_predicate_locks` (retryable). Any other `23xxx` ⇒ `internal`. Attempts exhausted ⇒ `conflict_retry_exhausted`. | — |
| 6 | Replay: new `REPEATABLE READ READ ONLY` transaction; actor re-check; `policy.authorize(tx, actor, readActionFor(resource.type), resource)`; return the recorded summary with `replayed: true`. | denied ⇒ `not_found_or_forbidden` |
| 7 | `COMMIT` raised a connection-level error (no SQLSTATE) ⇒ return `outcome_unknown`. The runner MUST NOT re-run the handler in-process. | — |
| 8 | Rev 2 (REC-07): after the transaction ends (commit **or** rollback), flush the attribution sink (Section 4.13): each attribution record collected in memory during any attempt is written by `enqueueTask('ops.attribute_country_defect', dedupe = <adapterId>:<version>:<code>)` in its own short SERIALIZABLE transaction. Read-only transactions use the same sink. A failure of this flush is logged (`diag`) and never changes the command result. | — |

Normative consequences:
- A handler MUST NOT send mail, call a worker, touch the filesystem, open a network connection or start a timer. External effects are tasks enqueued in the same transaction (outbox). A static test (T-F04) refuses imports of `src/platform/{mail,workers,scanner,blobs-fs}` from `commands/` files.
- A rejected command leaves no operation record, no fact and no task.
- An accepted command MUST append at least one fact. The runner checks `first_fact_seq` before step 4g and fails with `internal` / `no_fact_appended` otherwise (T-F07).
- Ids generated in a failed attempt are discarded; retries generate new ids. Only the operation key and content hash are stable.
- `GUARD_CONSTRAINTS` is a registry `{ constraintName → { category?: ErrorCategory; code: ReasonCode } }` maintained beside migrations (T-F05 checks every partial unique index named in Section 11 is registered).
- Rev 2 (record 15 CCR-15-05): `runContinuation(env, def, parent: { operationId, actor }, input)` runs one SERIALIZABLE transaction with `assertWriter` and bounded retry, attributed to the parent operation's actor and operation id, with **no** actor-permission precondition. A `ContinuationDef` lists the only writers it may call: `delivery.checkRelease` (which re-checks authorization itself and records a denial), `delivery.recordReleaseResult`, `delivery.recordSelectionItemResult`, `documents.markBytesUnavailable`, `operations.openIncident('bytes_integrity')`. It appends ≥ 1 fact (T-F07) and grants nothing. Admission closed ⇒ the continuation fails and the result stays `NULL` (`unrecorded`), never success.

### 4.3 Revisions

- Every command that changes a mutable aggregate on behalf of a form MUST take `expectedRevision` for each aggregate the user saw, and MUST fail with `stale_revision` when it differs.
- Internal writers called with a lock already held MAY use `state`-conditional updates instead of the user's revision, but MUST still increment `revision`.
- A revision never decreases. A revision is not a clock.

### 4.4 Operation identity and content hash

| Case | Result |
|---|---|
| Same actor key, same operation key, same content hash, record exists | Recorded result, re-authorized under the actor's current read access (B35). No handler run. |
| Same actor key, same operation key, different content hash | `conflict_operation_key`. Nothing written. |
| Same operation key from a different actor | Different `actor_key` ⇒ independent operation (no cross-actor interference). |
| Different operation key, same business effect | Handler runs; business guards (Section 11) decide. A new key MUST NOT bypass duplicate checks (B35). |
| Lost acknowledgement (`outcome_unknown`) | Client resubmits the same key. The unique index `(actor_key, operation_key)` makes concurrent or repeated executions safe: at most one commits; others replay. Rev 2 (MON-05): when a concurrent same-key execution reaches an insert guard first, the runner's extra attempt (Section 4.2 step 5) turns the guard violation into the replay of the committed operation; T-F12 asserts both responses are `accepted`, one `replayed: true`. |
| Lookup only (`GET …/operations/:key`) | `lookupOperation`: record ⇒ replay result (re-authorized); no record ⇒ `not_recorded` ("not accepted; resubmitting is safe"). |

Canonical JSON (`src/kernel/canonical.ts`, pure): UTF-8, NFC-normalized strings, object keys sorted by code point, no insignificant whitespace, `bigint` and `Paise` as decimal strings, `Date` as ISO-8601 UTC with milliseconds, `undefined` keys omitted, arrays order-preserving, numbers MUST be safe integers (floats refused). `actorKey` = `accountId` | `taskId` | `eng:<label>` | `pre:<hex HMAC of pre-session nonce>`.

Task steps use the lease token, not operation keys. Facts written by a task carry `task_id`; the task's `created_by_operation_id` links back to the original operation (original identity, B35).

### 4.5 Fact log API (`src/kernel/facts.ts`)

```ts
export type ModuleShort = 'sys' | 'iam' | 'cat' | 'core' | 'intake' | 'doc' | 'ops' | 'pay' | 'dlv';
export interface FactScope { readonly taAccountId?: AccountId; readonly groupId?: GroupId; readonly applicationId?: ApplicationId; readonly offeringId?: OfferingId }
export interface FactInput<M extends ModuleShort> {
  readonly type: FactTypeOf<M>;
  readonly subject: { readonly type: SubjectType; readonly id: string };
  readonly scope: FactScope;
  readonly before?: JsonObject | null;              // changed fields only
  readonly after?: JsonObject | null;
  readonly reason?: string;                         // ≤ 1000 chars; required when the command declares reasonRequired
  readonly evidence?: readonly EvidenceRef[];
  readonly eventAt?: Date;
  readonly retrospective?: { readonly note: string };
}
export interface FactAppender<M extends ModuleShort> {
  append(tx: WriteTx, fact: FactInput<M>): Promise<{ readonly seq: bigint; readonly factId: FactId }>;
}
export function factAppender<M extends ModuleShort>(module: M): FactAppender<M>;   // one per module, created at module load

export interface FactRecord {
  readonly seq: bigint; readonly factId: FactId; readonly txId: bigint;
  readonly recordedAt: Date; readonly eventAt: Date | null;
  readonly actor:
    | { readonly kind: 'account'; readonly accountId: AccountId; readonly role: Role }
    | { readonly kind: 'system_task'; readonly taskId: TaskId; readonly onBehalfOf: AccountId | null }
    | { readonly kind: 'engineering'; readonly label: string }
    | { readonly kind: 'anonymous' };
  readonly commandName: string | null; readonly operationId: OperationId | null;
  readonly ownerModule: ModuleName; readonly type: FactType;
  readonly subject: { readonly type: SubjectType; readonly id: string };
  readonly scope: Required<{ [K in keyof FactScope]: FactScope[K] | null }>;
  readonly before: JsonObject | null; readonly after: JsonObject | null;
  readonly reason: string | null; readonly evidence: readonly EvidenceRef[];
  readonly retrospective: boolean; readonly reconstructionNote: string | null;
  readonly releaseId: ReleaseId;
}
export function factsForSubject(tx: ReadTx, subject: { type: SubjectType; id: string }, page: { afterSeq?: bigint; limit: number }): Promise<readonly FactRecord[]>;   // caller authorizes first
export function tailFacts(tx: ReadTx, cursor: { readonly txId: bigint; readonly seq: bigint }, limit: number): Promise<{ readonly facts: readonly FactRecord[]; readonly next: { txId: bigint; seq: bigint } }>;
```

Rules:
- `append` fills actor, command, operation id, task id, owner module, recorded time and release id from `tx.ctx`. Callers cannot set them.
- `append` refuses (`internal`, `fact_owner_mismatch`) a type whose prefix differs from the appender's module, and refuses any actor of kind `support_view`.
- Every consequential acceptance appends at least one fact in the same transaction (B33). A command that changes state without a fact fails T-F07.
- `before`/`after` hold only the changed fields of the subject. Absent facts stay absent; reconstruction sets `retrospective` and `reconstructionNote` (B33).
- `tailFacts` returns only facts with `tx_id < pg_snapshot_xmin(pg_current_snapshot())`, ordered by `(tx_id, seq)`, after the cursor. This is the only safe tail (C-04). Projectors MUST use it.

### 4.6 Internal task API (`src/kernel/tasks.ts`)

```ts
export interface TaskSpec<K extends TaskKind> {
  readonly kind: K;
  readonly dedupeKey: string;                       // `<kind>:<subject id>[:<discriminator>]`
  readonly subject: { readonly type: SubjectType; readonly id: string };
  readonly scope: FactScope;
  readonly payload: TaskPayload<K>;                 // per-kind zod schema; ids and codes only
  readonly onBehalfOf?: AccountId;
  readonly notBefore?: Date;
}
export function enqueueTask<K extends TaskKind>(tx: WriteTx, spec: TaskSpec<K>): Promise<{ readonly taskId: TaskId; readonly created: boolean }>;
  // INSERT … ON CONFLICT (kind, dedupe_key) DO NOTHING; returns the existing id when present

export interface LeasedTask<K extends TaskKind> {
  readonly taskId: TaskId; readonly kind: K; readonly attempt: number;
  readonly leaseToken: string;                      // plaintext in memory only; DB stores HMAC
  readonly leaseExpiresAt: Date;
  readonly subject: { readonly type: SubjectType; readonly id: string };
  readonly scope: FactScope; readonly payload: TaskPayload<K>;
  readonly onBehalfOf: AccountId | null;
  readonly effectStartedAt: Date | null;
  readonly createdByOperationId: OperationId | null;
}
export type TaskPrepared<P> =
  | { readonly kind: 'proceed'; readonly prepared: P }
  | { readonly kind: 'skip'; readonly reason: 'obsolete' | 'revoked' | 'already_done' }
  | { readonly kind: 'defer'; readonly notBefore: Date; readonly code: ReasonCode };   // rev 2 (record 14 CCR-04)
  // defer: state back to 'pending', attempts = attempts − 1, lease cleared, no failure fact. Allowed only for a wait that a
  // committed later event will end (storage admission, unsettled input). A defer whose cause can no longer end (for example the
  // blob move task of the input is failed_terminal) MUST NOT be returned: prepare fails visibly instead (REC-17).

export interface TaskDef<K extends TaskKind, P, E> {
  readonly kind: K;
  readonly owner: ModuleName;
  readonly effectClass: TaskEffectClass;            // none | idempotent | non_repeatable
  readonly maxAttempts: number;
  readonly leaseMs: number;
  readonly backoff: { readonly baseMs: number; readonly maxMs: number };
  readonly onBehalfAction: Action | null;           // re-checked through policy for onBehalfOf on every prepare
  prepare(tx: WriteTx, task: LeasedTask<K>): Promise<TaskPrepared<P>>;
  effect(env: EffectEnv, task: LeasedTask<K>, prepared: P): Promise<E>;   // outside any transaction
  record(tx: WriteTx, task: LeasedTask<K>, result: E): Promise<void>;
  recordUncertain(tx: WriteTx, task: LeasedTask<K>): Promise<void>;     // non_repeatable only: earlier effect may have happened
  onTerminalFailure(tx: WriteTx, task: LeasedTask<K>, err: TmErrorShape): Promise<void>;  // owner records visible failure + owner
  onRevoked(tx: WriteTx, task: LeasedTask<K>): Promise<void>;           // owner records paused/blocked state
}
// rev 2 (record 14 CCR-03, REC-17): blob move tasks call owner hooks registered per owner_ref_type in compose.ts, inside the move's record
// or fail transaction: onMoved(tx, blobId, area), onIntegrityFailed(tx, blobId), onMoveFailedTerminal(tx, blobId).

export function leaseTasks(env: KernelEnv, req: { readonly kinds: readonly TaskKind[]; readonly max: number }): Promise<readonly LeasedTask<TaskKind>[]>;
export function heartbeatTask(env: KernelEnv, lease: LeasedTask<TaskKind>): Promise<'extended' | 'lease_lost'>;
export function runLeasedTask<K extends TaskKind>(env: KernelEnv, def: TaskDef<K, unknown, unknown>, lease: LeasedTask<K>): Promise<'succeeded' | 'retry_scheduled' | 'failed_terminal' | 'skipped' | 'effect_uncertain' | 'lease_lost'>;
export function recoverExpiredLeases(env: KernelEnv): Promise<number>;
export function runTaskNow(env: KernelEnv, taskId: TaskId): Promise<string>;   // test harness and labelled local harness only
```

Task protocol (normative):

| Step | Transaction | Rule |
|---|---|---|
| Lease | READ COMMITTED (C-05) | Requires admission `open` and current epoch (`assertWriter` under `FOR SHARE`, rev 2). `SELECT … WHERE state IN ('pending','failed_retryable') AND not_before <= $now AND kind = ANY($kinds) AND attempts < max_attempts ORDER BY not_before, task_id FOR UPDATE SKIP LOCKED LIMIT $max`; set `state='leased'`, `attempts = attempts + 1`, `lease_token_hmac`, `lease_expires_at`, `leased_by`. Per-kind concurrency caps from configuration. |
| Prepare | SERIALIZABLE | Verify lease (`state='leased' AND lease_token_hmac = $h`, `FOR UPDATE`). `assertWriter`. Re-check subject state (obsolete ⇒ `cancelled_obsolete`). If `onBehalfOf`: re-check account `active` and `policy.authorize(onBehalfActor, onBehalfAction, subject)`; denied ⇒ `cancelled_revoked`, `onRevoked`, fact `sys.task_cancelled` (B10, B35). If `non_repeatable` and `effect_started_at IS NOT NULL` ⇒ `recordUncertain`, state `effect_uncertain`, fact `sys.task_effect_uncertain`; never repeat. Else for `non_repeatable` set `effect_started_at = now`. Commit. |
| Effect | none | Heartbeat every `leaseMs / 3`. Facility timeouts apply. No database writes. |
| Record | SERIALIZABLE | `assertWriter` (rev 2, REC-02: a record after closure fails closed). Verify lease (conditional). `def.record` through owner writers. Set `state='succeeded'`, `finished_at`, `result`. Commit atomically with the owner effect. Lease lost ⇒ rollback and discard (idempotent effects are safe to redo; `non_repeatable` becomes uncertain on the next lease). |
| Fail | SERIALIZABLE | `assertWriter`. Verify lease. Retryable and `attempts < maxAttempts` ⇒ `failed_retryable`, `not_before = now + backoff`. Otherwise `failed_terminal`, `onTerminalFailure`, fact `sys.task_failed_terminal`. |
| Recover | READ COMMITTED for the scan, SERIALIZABLE per exhausted task | Rev 2 (REC-04). Every 15 s, with `assertWriter`: `state='leased' AND lease_expires_at < $now`. If `attempts < max_attempts` ⇒ `failed_retryable`, lease cleared, `not_before = now + backoff(attempts)` (the same exponential backoff as Fail), `last_error_code = 'lease_expired'`, and the dying lease's `leased_by` process is kept in `result.lease_lost_by`. If `attempts >= max_attempts` ⇒ `failed_terminal` with `last_error_code = 'lease_expired_exhausted'`; `onTerminalFailure` runs in a fresh transaction; fact `sys.task_failed_terminal`. A task whose lease expires on every run (for example a country adapter that kills the process) therefore reaches a visible terminal state with its failure owner after `max_attempts` runs; country-origin task kinds attribute the failure to the country (`ops.attribute_country_defect`). |
| Heartbeat | READ COMMITTED | `assertWriter` (rev 2); extends `lease_expires_at` only while the token matches. |

Lease tokens: 32 random bytes; stored as HMAC-SHA-256 with the job-credential key. After restore with a new key (B40), every old lease token is unusable.

### 4.7 Admission, maintenance and writer-epoch fencing (`src/kernel/installation.ts`)

```ts
export const CLOSURE_KINDS = ['initial','maintenance','cutover','emergency','restore_clean','restore_interval_loss'] as const;
export interface InstallationState {
  readonly admission: 'open' | 'closed'; readonly closureKind: ClosureKind | null;
  readonly writerEpoch: bigint; readonly activeReleaseId: ReleaseId | null; readonly revision: bigint;
}
export interface ProcessIdentity { readonly processId: ProcessId; readonly releaseId: ReleaseId; readonly writerEpoch: bigint }

export function assertWriter(tx: ReadTx, proc: ProcessIdentity): Promise<InstallationState>;
  // SELECT … FROM sys_installation WHERE id = 1 FOR SHARE
  // closed ⇒ TmError('maintenance'); epoch or release mismatch ⇒ TmError('stale_writer') and proc shutdown signal
export function assertMaintenanceWriter(tx: ReadTx, proc: ProcessIdentity): Promise<InstallationState>;
  // rev 2: same row lock; requires admission 'closed' with closure_kind ∈ {initial, cutover} and release = active_release_id;
  // used only by maintenanceAllowed commands of the engineering actor (catalogue release registration during cutover verify)
export function registerProcess(pool: AppPool, releaseId: ReleaseId, clock: Clock, ids: IdSource): Promise<ProcessIdentity>;
  // refuses unless active_release_id = releaseId; adopts current writer_epoch (also while closed)
export function watchInstallation(pool: AppPool, proc: ProcessIdentity, onStale: () => void): Cancel;
  // LISTEN tm_installation + poll every 2 s; epoch/release change ⇒ onStale: stop accepting, abort in-flight, exit code 75
// tm_owner only (CLI):
export function closeAdmission(owner: OwnerPool, req: { readonly kind: ClosureKind; readonly reason: string; readonly actorLabel: string }): Promise<{ readonly writerEpoch: bigint }>;
export function waitForDrain(owner: OwnerPool, timeoutMs: number): Promise<{ readonly drained: boolean; readonly remainingAppBackends: number }>;
export function openAdmission(owner: OwnerPool, req: { readonly reason: string; readonly actorLabel: string; readonly reopenApprovalRef?: string }): Promise<void>;
export function checkpoint(owner: OwnerPool, actorLabel: string): Promise<Id<'ckp'>>;   // requires admission closed; records last_fact_seq, last_op_seq, closed_fact_seq, export digest
export function snapshotRollbackAllowed(owner: OwnerPool, checkpointId: Id<'ckp'>): Promise<{ readonly allowed: boolean; readonly code: 'ok' | 'admission_opened_since_checkpoint' | 'work_accepted_since_checkpoint' | 'history_unknown' }>;
  // allowed only if admission stayed closed since closed_fact_seq (no sys.admission_opened after it), no sys_operations.op_seq > last_op_seq,
  // no sys_facts.seq > last_fact_seq except kernel facts of the cutover itself, and the fact sequence since the checkpoint is readable; otherwise refuse (B39, B41)
```

Rules:
- `closeAdmission` runs `UPDATE sys_installation SET admission='closed', closure_kind=$k, writer_epoch = writer_epoch + 1, …`. The update waits for every in-flight command's `FOR SHARE` lock, so it is also the drain barrier. It then sends `NOTIFY tm_installation`, terminates remaining `tm_app` backends after `waitForDrain`, and appends `sys.admission_closed`.
- After close, the running process sees a new epoch and exits; a restarted process adopts the new epoch but serves only the maintenance page until admission is `open`. Commands, task leases and byte releases all call `assertWriter`, so none proceeds while closed (B39). Maintenance survives restart because it is stored state.
- Rev 2 (REC-02): **every** kernel write path calls `assertWriter` under `FOR SHARE` before its first write: command attempts, continuations, task lease, prepare, heartbeat, record and fail steps, lease recovery, blob intent/stage/move record steps and the attribution flush. A task record or blob move that tries to commit after closure therefore fails closed, and the `closeAdmission` update waits for it like for a command.
- `openAdmission` refuses unless: the active release is `verified_at IS NOT NULL`; the migration ledger head equals the release's `schema_head`; for `restore_interval_loss`, `reopenApprovalRef` is present, `sys_restores.scope_state = 'declared'` with a recorded completeness basis, and every protection mark that the declared scope names is recorded (B40; rev 2, REC-05). It appends `sys.admission_opened`.
- Known residual (recorded P1, register 02 §C): closure uses an `UPDATE` that waits for `FOR SHARE` holders; under sustained load new share lockers can delay it (REC-09), and in-flight task effects are aborted rather than drained (REC-08).
- An old binary (release ≠ `active_release_id`) cannot register and cannot write (B39).
- Emergency containment (B33): `closeAdmission(kind='emergency')` and account suspension remain available while the audit projection is degraded.

### 4.8 Errors (`src/kernel/errors.ts`)

```ts
export interface ControlBlocker { readonly control: ControlName; readonly kind: ControlKind; readonly code: ReasonCode; readonly exceptionEligible: boolean; readonly gate?: Gate; readonly ref?: string }   // rev 2 (record 12 CCR-12): ref = declaration item key or boundary detail, ^[a-zA-Z.]{1,60}$
export type BoundaryRef = 'parked' | 'excluded' | 'known_limitation' | 'owner_decision';
export interface TmErrorShape {
  readonly category: ErrorCategory; readonly code: ReasonCode; readonly retryable: boolean;
  readonly blockers: readonly ControlBlocker[]; readonly boundary: BoundaryRef | null;
  readonly fieldErrors: readonly { readonly field: string; readonly code: string }[];
  readonly existing: ResourceRef | null;              // conflict_duplicate only, and only when readable by the actor
}
export class TmError extends Error {
  readonly category: ErrorCategory;
  readonly code: ReasonCode;
  readonly retryable: boolean;
  readonly blockers: readonly ControlBlocker[];
  readonly boundary: BoundaryRef | null;
  readonly fieldErrors: readonly { readonly field: string; readonly code: string }[];
  readonly existing: ResourceRef | null;
  constructor(category: ErrorCategory, code: ReasonCode, opts?: Partial<Omit<TmErrorShape, 'category' | 'code'>>) {
    super(code);                                      // message is the code only: never personal data
    this.category = category; this.code = code;
    this.retryable = opts?.retryable ?? RETRYABLE_BY_DEFAULT[category];
    this.blockers = opts?.blockers ?? []; this.boundary = opts?.boundary ?? null;
    this.fieldErrors = opts?.fieldErrors ?? []; this.existing = opts?.existing ?? null;
  }
}
export function toErrorShape(e: unknown): TmErrorShape;   // unknown ⇒ category 'internal', code 'unexpected'; never copies e.message
```

### 4.9 Clock, timer, ids (`src/kernel/time.ts`, `src/kernel/ids.ts`)

```ts
export interface Clock { now(): Date }
export const systemClock: Clock;
export class FakeClock implements Clock {               // test only; erasable class (no parameter properties)
  private current: Date;
  constructor(start: Date) { this.current = start; }
  now(): Date { return new Date(this.current.getTime()); }
  set(d: Date): void { this.current = d; }
  advance(ms: number): void { this.current = new Date(this.current.getTime() + ms); }
}
export interface BusinessCalendar {
  readonly zone: 'Asia/Kolkata';
  dateOf(instant: Date): LocalDate;                       // pure; Intl-based
  compare(a: LocalDate, b: LocalDate): -1 | 0 | 1;
  addDays(d: LocalDate, n: number): LocalDate;
}
export const PERIODIC_JOBS = ['task_loop','lease_recovery','heartbeat','installation_watch','projector','group_end_enqueue','cleanup_enqueue','expiry_cleanup_enqueue','deferral_review_enqueue','timing_risk_enqueue','clock_check'] as const;   // rev 2: timing_risk_enqueue (record 13 CCR-18)
export interface Scheduler {
  every(job: PeriodicJob, intervalMs: number, run: () => Promise<void>): Cancel;   // no overlap per job
  after(ms: number, run: () => Promise<void>): Cancel;
}
export interface RandomSource { bytes(n: number): Buffer }
export interface IdSource {
  next<P extends IdPrefix>(prefix: P): Id<P>;
  token(): string;                                        // 32 random bytes, base64url
  operationKey(): OperationKey;
}
export function checkClockAgainstDatabase(pool: AppPool, clock: Clock, maxSkewMs: number): Promise<{ readonly skewMs: number; readonly ok: boolean }>;
export interface ClockHealth { ok(): boolean }   // rev 2 (record 11 CCR-19): set by clock_check; read by the policy (group-read grants and support views fail closed while degraded)
```

Clock rules:
- No correctness invariant depends on clock order. Fact order is `(tx_id, seq)`; operation order is `op_seq`.
- Every expiry comparison uses `tx.now` against a time recorded from the same `Clock`. A backward jump extends a lease or OTP by at most the jump; attempt counters still bound OTPs. A forward jump expires early (fail closed).
- The `clock_check` job compares the app clock with PostgreSQL `clock_timestamp()` every 60 s. Skew above `clock.maxSkewMs` (120 000) marks clock health `degraded` and refuses date-triggered work (`core.group_end_sweep`, cleanup) until it recovers (B25 "declared, tested clock/date basis").
- Business dates use `Asia/Kolkata`. Group end requires `calendar.dateOf(now) > travel_return_date` (strictly after).

### 4.10 Diagnostics (`src/kernel/diag.ts`)

```ts
export const DIAG_EVENTS = ['startup','shutdown','http_request','command_accepted','command_rejected','command_retry','command_outcome_unknown',
  'task_leased','task_succeeded','task_failed','task_lease_lost','task_effect_uncertain','worker_exit','scanner_result',
  'blob_integrity_failed','admission_changed','stale_writer_exit','capacity_limit','projection_lag','clock_skew','fault_injected'] as const;
export const DIAG_FIELDS = ['reqId','routeId','method','status','durationMs','category','code','command','operationId','taskId','taskKind',
  'attempt','module','subjectType','subjectId','count','bytes','limitName','workerKind','exitCode','signal','releaseId','writerEpoch',
  'processId','sqlState','constraint','skewMs','lagMs','errorClass','stackHash'] as const;
export interface Diag { event(level: 'debug' | 'info' | 'warn' | 'error', name: DiagEvent, fields: DiagFields): void }
export type DiagFields = Partial<Record<DiagField, string | number | bigint | boolean>>;
export function createDiag(cfg: DiagConfig): Diag;    // pino with a strict serializer
```

Rules (B33):
- The serializer drops every field not in `DIAG_FIELDS`. String values are accepted only if they match the field's validator: ids via `isId`, `routeId` from the route registry, `code`/`category`/`command`/`taskKind` from closed sets, `sqlState` `^[0-9A-Z]{5}$`, `constraint` from `GUARD_CONSTRAINTS` keys, `errorClass` `^[A-Za-z]{1,40}$`, `stackHash` hex. Anything else becomes `"[dropped]"` and increments a dropped-field counter.
- Diagnostics MUST NOT contain URLs, query strings, request bodies, header values, emails, OTPs, tokens, names, passport numbers, extracted text, file names, SQL text or library error messages. Library errors are logged as `errorClass` + `sqlState`/`constraint` + `stackHash` only.
- Fastify's built-in request logging is disabled. An `onResponse` hook emits `http_request` with `routeId`, never the raw URL.
- Health and administration output (`/healthz`, `tm status`) use the same allowlist.

### 4.11 Fault injection (`src/kernel/faults.ts`, test environment only)

```ts
export const FAULT_POINTS = [
  'command.after_handle','command.before_commit','command.lose_ack',
  'task.after_prepare','task.after_effect','task.before_record','task.lease_expire',
  'blob.after_intent','blob.after_write','blob.after_rename_before_record',
  'mail.after_sending_marker','mail.transport_uncertain','mail.transport_failed',
  'worker.timeout','worker.oversize_output','worker.crash','scanner.unavailable','scanner.timeout',
  'release.after_check_before_stream','release.mid_stream','bytes.corrupt_on_read',
  'cutover.after_close','cutover.after_checkpoint','cutover.after_migrate','cutover.before_open',
  'restore.mid_bytes','restore.before_record','projector.stall','clock.skew',
  'backup.mid_bytes','backup.before_last_good','selection.between_items','projector.before_commit',   // rev 2 (record 15 CCR-15-09)
] as const;
export type FaultBehaviour =
  | { readonly kind: 'throw'; readonly error?: TmErrorShape }
  | { readonly kind: 'crash' }                       // process.exit(137) at the point
  | { readonly kind: 'delay'; readonly ms: number }
  | { readonly kind: 'hang' }
  | { readonly kind: 'lose_ack' };                   // commit succeeds, caller sees a connection error
export interface Faults { hit(point: FaultPoint, match?: Readonly<Record<string, string>>): Promise<void> }
export interface FaultControl {
  arm(point: FaultPoint, behaviour: FaultBehaviour, opts?: { readonly times?: number; readonly match?: Readonly<Record<string, string>> }): void;
  disarmAll(): void;
}
export function createFaults(env: TmEnv): { readonly faults: Faults; readonly control: FaultControl | null };
```

- `TM_ENV=test` ⇒ `control` is non-null. Any other environment ⇒ `faults.hit` is a no-op and `control` is `null`.
- Cross-process faults (workers, CLI) read `TM_FAULTS` (JSON). Configuration validation refuses `TM_FAULTS` unless `TM_ENV=test` and exits non-zero.
- Every fault point is reached in at least one foundation test (T-F30).

### 4.12 Blob store API (`src/kernel/blobs.ts`)

```ts
export const BLOB_OWNER_REF_TYPES = ['document_version','intake_source_file','packet','synthetic_mail','selection_zip'] as const;
export interface BlobStore {
  createIntent(pool: AppPool, req: { readonly scope: { readonly taAccountId?: AccountId }; readonly leaseMs: number }): Promise<BlobId>;   // own committed txn; state 'intent'
  writeStaged(pool: AppPool, id: BlobId, src: NodeJS.ReadableStream, limits: { readonly maxBytes: number }): Promise<{ readonly sizeBytes: number; readonly sha256: Buffer; readonly detectedMediaType: string | null }>;
    // writes staging/<aa>/<id>.part, fsync, rename to <id>, fsync dir, then own txn: state 'intent'→'staged' with size/hash
  reference(tx: WriteTx, id: BlobId, owner: { readonly module: ModuleName; readonly refType: BlobOwnerRefType; readonly refId: string }): Promise<void>;
    // UPDATE … SET state='referenced', owner_* WHERE blob_id=$1 AND state='staged' AND owner_ref_id IS NULL ⇒ 0 rows: TmError('unavailable_dependency','blob_not_referenceable')
  requestMove(tx: WriteTx, id: BlobId, to: 'quarantine' | 'canonical'): Promise<void>;   // sets pending_move_to; enqueues blob task
  dispose(tx: WriteTx, id: BlobId, owner: { readonly refType: BlobOwnerRefType; readonly refId: string }): Promise<void>;
    // rev 2 (record 14 CCR-03): conditional on the owner match; state 'removing'; enqueues blob.cleanup_staging with discriminator 'dispose'
  readVerified(id: BlobId, expect: { readonly sha256: Buffer; readonly sizeBytes: number }, maxBytes: number): Promise<Buffer>;
    // full read + SHA-256 compare; missing/mismatch ⇒ TmError('unavailable_dependency','bytes_unavailable') and integrity task enqueue by caller
  verifyThenStream(id: BlobId, expect: { readonly sha256: Buffer; readonly sizeBytes: number }): Promise<NodeJS.ReadableStream>;   // hash pass, then stream (immutable file)
  workerBindPath(id: BlobId): string;      // used only by WorkerRunner for read-only binds
}
```

Lifecycle and cleanup rules (B12, B36, B40):
1. Intent row commits before any byte is written. A file without a row can only come from restore or manual damage; cleanup reports it and removes it only after `cleanup.orphanGraceMs`.
2. `reference` and cleanup compete on one row with conditional updates. Cleanup claims only `state IN ('intent','staged') AND owner_ref_id IS NULL AND staging_lease_expires_at < $now` and sets `removing` in a committed transaction before unlinking. Exactly one wins. Clock skew affects only liveness, never safety.
3. Moves (staging → quarantine → canonical) are rename-within-filesystem tasks: rename, fsync directory, then record `area`. A crash between rename and record is repaired idempotently by checking both locations.
4. Bytes are served only from `area='canonical'` blobs in state `referenced`, after verification of size and SHA-256.
5. Cleanup MUST NOT remove a referenced blob, a canonical blob or a still-referenced quarantine blob. Automatic deletion of application documents or artifacts is EXCLUDED (B42). Disposal applies only to unreferenced staging, rejected (`safety_rejected`) and `excluded_unrelated` quarantine bytes; their metadata rows stay.
6. Temporary-space admission: before `createIntent` and before each worker job, the store checks free space of the data filesystem against `storage.minFreeBytes` and `storage.maxStagingBytes`; below the limit it returns `capacity_limited` and admits no new temporary work (B36, B38).
7. Rev 2 (record 14 CCR-03): a canonical blob MAY be disposed only when its owner version is `excluded_unrelated` by an attributed person's decision and never had a `positive` association (it was never releasable). Metadata rows stay.
8. Rev 2 (record 15 CCR-15-11): `createIntent` and `writeStaged` check admission `open` and the current epoch in their own transactions and refuse with `maintenance` (B39 "closes … byte/work claims").
9. Rev 2 (REC-17): a terminal failure of `blob.promote_to_quarantine` or `blob.publish_canonical` calls the owner hook `onMoveFailedTerminal`; for a document version it calls `documents.markBytesUnavailable('missing')` in the same transaction, which settles the version as unavailable with an owned `bytes_integrity` incident (B12 "missing/unreadable bytes remain unavailable with an owner"). No dependent task defers on that blob again.

### 4.13 Attribution sink (`src/kernel/attribution.ts`, rev 2, REC-07)

```ts
export interface AttributionRecord { readonly kind: 'country_defect'; readonly countryId: CountryId; readonly adapterId: string; readonly version: string; readonly code: ReasonCode; readonly subject?: { readonly type: SubjectType; readonly id: string } }
export interface Attributions { add(r: AttributionRecord): void }   // available on ReadTx and WriteTx as tx.attributions; in-memory only
```

- Evaluation never writes an attribution. A country adapter error inside `requirementEvidence`, `evaluateTravelDateRules` or any `can*` helper adds an `AttributionRecord` and returns `unknown` with code `country_adapter_error`.
- The kernel flushes the records after the transaction ends, whether it committed or rolled back and whether it was read-only (Section 4.2 step 8): one short SERIALIZABLE transaction per distinct dedupe key enqueues `ops.attribute_country_defect`. Its record step calls `operations.openIncident({ kind: 'country_defect', countryId, dedupeKey })`, which is idempotent.
- Therefore a refused command or a read-only page render still produces the owned `country_defect` incident (B36 "attribute a country-origin defect to that country"), and no read path writes business state.

## 5. Access policy contract (B08, B10, B11, B29)

### 5.1 Signature

```ts
// src/modules/identity/policy.ts
export type ResourceRef =
  | { readonly type: 'public' } | { readonly type: 'installation' } | { readonly type: 'self' }
  | { readonly type: 'account'; readonly id: AccountId } | { readonly type: 'grant'; readonly id: GrantId }
  | { readonly type: 'offering'; readonly id: OfferingId } | { readonly type: 'catalogue_admin' }
  | { readonly type: 'group'; readonly id: GroupId } | { readonly type: 'application'; readonly id: ApplicationId }
  | { readonly type: 'document_version'; readonly id: DocumentVersionId; readonly applicationId: ApplicationId | null }   // rev 2 (record 14 CCR-10b): null resolves through the version's group to the owning TA
  | { readonly type: 'artifact'; readonly id: ArtifactId } | { readonly type: 'packet'; readonly id: PacketId }
  | { readonly type: 'intake_attempt'; readonly id: IntakeAttemptId } | { readonly type: 'intake_incident'; readonly id: IntakeIncidentId }
  | { readonly type: 'review_artifact'; readonly artifactId: ArtifactId; readonly incidentId: IncidentId | null }   // rev 2 (SEC-02): staff_review channel only
  | { readonly type: 'incident'; readonly id: IncidentId } | { readonly type: 'notice'; readonly id: NoticeId }
  | { readonly type: 'ta_finance'; readonly taAccountId: AccountId } | { readonly type: 'financial_exception'; readonly id: FinancialExceptionId }
  | { readonly type: 'queue'; readonly name: 'assignment' | 'incidents' | 'financial_follow_up' | 'tasks' }
  | { readonly type: 'audit' } | { readonly type: 'measures' } | { readonly type: 'accounts_surface' };

export type PolicyDecision =
  | { readonly allowed: true; readonly basis: Relation }
  | { readonly allowed: false; readonly category: 'unauthenticated' | 'not_found_or_forbidden' | 'unavailable_parked' };

export interface Policy {
  decide(tx: ReadTx, actor: Actor, action: Action, resource: ResourceRef): Promise<PolicyDecision>;
  authorize(tx: ReadTx, actor: Actor, action: Action, resource: ResourceRef): Promise<Relation>;   // throws TmError on deny
  scope(actor: Actor, list: ListAction, alias: string): SqlFragment;                                // WHERE predicate for lists/search
}
export interface PolicyRelations {                       // implemented in each module's api.ts; wired in src/server/compose.ts
  application(tx: ReadTx, id: ApplicationId): Promise<{ taAccountId: AccountId; groupId: GroupId; assignedOperatorId: AccountId | null } | undefined>;
  group(tx: ReadTx, id: GroupId): Promise<{ taAccountId: AccountId } | undefined>;
  documentVersion(tx: ReadTx, id: DocumentVersionId): Promise<{ groupId: GroupId; taAccountId: AccountId } | undefined>;
  association(tx: ReadTx, versionId: DocumentVersionId, applicationId: ApplicationId): Promise<'positive' | 'other' | 'none'>;
    // rev 2 (SEC-01): Documents relation; answers only for purpose = 'evidence' versions; 'none' for every other purpose
  artifactAssociation(tx: ReadTx, versionId: DocumentVersionId, applicationId: ApplicationId): Promise<'verified' | 'pending_review' | 'conflict' | 'other' | 'none'>;
    // rev 2 (SEC-01): Operations relation over ops_artifacts (document_version_id = version AND application_id = this application)
  intakeIncident(tx: ReadTx, id: IntakeIncidentId): Promise<{ taAccountId: AccountId; groupId: GroupId } | undefined>;   // rev 2 (record 14 CCR-10a)
  intakeAttempt(tx: ReadTx, id: IntakeAttemptId): Promise<{ taAccountId: AccountId; groupId: GroupId } | undefined>;
  incident(tx: ReadTx, id: IncidentId): Promise<{ ownerAccountId: AccountId | null; reviewerAccountId: AccountId | null; applicationId: ApplicationId | null; candidateApplicationIds: readonly ApplicationId[] } | undefined>;
  notice(tx: ReadTx, id: NoticeId): Promise<{ recipientAccountId: AccountId } | undefined>;
  groupReadGrant(tx: ReadTx, grantee: AccountId, groupId: GroupId, now: Date): Promise<GrantId | undefined>;
  accountingGrant(tx: ReadTx, accountId: AccountId, now: Date): Promise<boolean>;
}
export function createPolicy(relations: PolicyRelations, clockHealth: ClockHealth): Policy;   // rev 2 (record 11 CCR-19)
```

Rules:
- `authorize` is the single entry for every route, command, query, list, search, direct link, support view, task result, operation-result lookup and byte release (B10).
- The actor's account is re-read in the same transaction (`active`, role, session valid, staff MFA verified). Any failure ⇒ `unauthenticated` for page/session problems, otherwise `not_found_or_forbidden`.
- A resource outside scope and a missing resource give the same `not_found_or_forbidden` (same status, same page, same timing class).
- PARKED/EXCLUDED actions resolve to `unavailable_parked`/`unavailable_excluded` only for actors who could otherwise see the surface; others get `not_found_or_forbidden`.

### 5.2 Closed action list

```ts
export const ACTIONS = [
  // public and sign-in
  'public.read','auth.ta_otp_request','auth.ta_otp_verify','auth.staff_sign_in','auth.staff_enrol','auth.sign_out',
  // self
  'self.read','self.email_change_start','self.email_change_confirm',
  // identity administration
  'account.read_admin','account.create','account.approve','account.decline','account.activate','account.suspend','account.restore',
  'account.reset_credentials','account.elevation_request','account.elevation_approve',
  'grant.group_read_create','grant.group_read_revoke','grant.accounting_set','grant.accounting_revoke','support_view.use',
  // catalogue and launch
  'catalogue.read_selectable','catalogue.read_admin','catalogue.edit_baseline','catalogue.preview','catalogue.publish',
  'catalogue.record_owner_approval','catalogue.decide_impact','catalogue.approve_transition',
  'catalogue.manage_identity','catalogue.draft_declaration','catalogue.bind','catalogue.assign_impact_reviewer','catalogue.request_recheck',   // rev 2 (record 12 CCR-04)
  'catalogue.register_release',                                                                                                             // rev 2: engineering actor only
  'launch.approve','launch.expand_scope','launch.suspend','launch.lift','launch.withdraw','launch.record_treatment','launch.record_plan',
  // groups and applications (TA)
  'group.create','group.read','group.edit_travel_dates','group.close',
  'application.read','application.create_draft','application.edit_draft','application.correct_identity','application.request_assistance',
  'application.submit','application.report_problem','application.hand_back','application.request_withdrawal','application.decide_price_increase',
  'application.decide_transition','application.link_dependency','notice.read','notice.acknowledge','history.read_ta',
  // documents and bytes
  'document.upload','document.read_metadata','document.resolve_extraction','document.associate','document.retrieve_bytes','selection.retrieve',
  'document.requeue_check','document.retrieve_for_review',                                                                                   // rev 2 (record 14 CCR-10c; SEC-02)
  // intake
  'intake.start','intake.read','intake.answer_question','intake.correction_upload','intake.abandon','intake.incident_dispose',
  // SuperAdmin case administration
  'queue.read','assistance.decide','assignment.assign','assignment.reassign','gate_exception.grant','gate_exception.revoke',
  'application.correct_from_evidence','withdrawal.record_operational','outcome.authorize_unresolved','deferral.decide','flag.respond',
  'protection_mark.resolve','incident.assign_reviewer',
  'price.propose_increase','failure.classify','effort.record_observation',                                                                  // rev 2 (record 13 CCR-10; 15 CCR-15-15)
  // assigned operator or SuperAdmin (rev 2, record 13 CCR-10)
  'forecast.record','deferral.end','incident.open','incident.report_disclosure',
  // assigned operator
  'operator.start_work','operator.assistance_entry','operator.formal_return','operator.flag','operator.resolve_hold',
  'operator.record_readiness','operator.withdraw_readiness','operator.authorize_external_act','operator.record_act_evidence',
  'operator.record_reconciliation','operator.record_outcome','operator.record_applicant_withdrawal','operator.propose_deferral',
  'operator.build_packet','operator.release_packet','operator.record_custody','operator.record_artifact','operator.record_manual_email',
  'operator.record_direct_external','operator.manual_resend','incident.read','incident.work','incident.resolve',
  'operator.record_work_step','operator.record_handover','operator.record_effort_sample',                                                     // rev 2 (record 13 CCR-10; 15 CCR-15-15/-17)
  // money
  'payment.record_service_status','payment.read_application','ceiling.lower','ceiling.increase_request','ceiling.increase_approve',
  'financial_exception.read','accounts.surface_read','accounts.receipt_verify','accounts.adjust','accounts.write_off','exposure.release',
  'financial_exception.reassign_owner','exposure.read','ceiling.increase_decline',                                                           // rev 2 (record 15 CCR-15-03, -17)
  // delivery boundary (B46)
  'delivery.send_document_email','completion.check',
  // oversight
  'audit.read_full','measures.read','search.private','tasks.read_failures',
] as const;
export type Action = typeof ACTIONS[number];
export const LIST_ACTIONS = ['application.read','group.read','document.read_metadata','intake.read','incident.read','notice.read','queue.read','search.private','financial_exception.read','audit.read_full'] as const;
```

### 5.3 Rule table

Legend: `Y` allowed; `own` resource owned by the actor (TA owner, notice recipient, self); `asg` actor is the current assigned operator of the application; `rev` actor is the incident owner or named reviewer; `grant` active unexpired `group_read` grant on the application's group; `—` denied (`not_found_or_forbidden`); `P` visible unavailable (`unavailable_parked` / `_excluded` / `_known_limitation`). The product-owner account is a SuperAdmin and uses the SuperAdmin column (B07). Support view (SV) allows only rows marked `R`: the result equals what the viewed account could read now, and it never releases bytes or runs commands.

| Action (group) | TA | Operator | Accounting grant (on operator) | Group read grant (on operator) | SuperAdmin | SV | Extra condition |
|---|---|---|---|---|---|---|---|
| `public.read` | Y | Y | Y | Y | Y | R | none |
| `auth.ta_otp_request`, `auth.ta_otp_verify` | anonymous | — | — | — | — | — | CAPTCHA before issuance; rate limits at issuance and verification (B08) |
| `auth.staff_sign_in`, `auth.staff_enrol` | — | anonymous | — | — | anonymous | — | email OTP + TOTP; enrolment token |
| `self.read`, `auth.sign_out` | own | own | own | own | own | R | — |
| `self.email_change_*` | own | — | — | — | — | — | TA only; SuperAdmin cannot overwrite (B09) |
| `account.*` admin, `grant.*`, `support_view.use` | — | — | — | — | Y | — | reason required; `elevation_approve` requires a distinct active SuperAdmin; `account.suspend` unilateral (B11) |
| `catalogue.read_selectable` | Y | Y | — | — | Y | R | TA (rev 2, record 12 CCR-09): published, `launch_state = 'launched'` and the TA in the current audience; suspended or withdrawn offerings stay visible to their audience with the unavailable state; others read-only |
| `catalogue.*` other, `launch.*` | — | — | — | — | Y | — | reason + evidence; cannot alter controls/security/retries (B05) |
| `catalogue.register_release` | — | — | — | — | — | — | actor kind `engineering` only (maintenance command, Section 4.2); every account actor ⇒ `not_found_or_forbidden` |
| `group.create` | Y | — | — | — | — | — | country listed in the catalogue; drafts still need launch admission |
| `group.read` | own | asg (context only) | — | grant | Y | R | operator sees only the group header of its assigned applications |
| `group.edit_travel_dates`, `group.close` | own | — | — | — | — | — | Section 7.1 effects |
| `application.read`, `document.read_metadata`, `history.read_ta` | own | asg | — | grant | Y | R | `history.read_ta` is TA-facing projection; full audit is SuperAdmin-only (B10) |
| `application.create_draft`, `intake.*` (TA) | own | — | — | — | — | — | launch admission (Section 8) |
| `application.edit_draft`, `application.correct_identity`, `document.upload`, `document.resolve_extraction`, `document.associate` | own when editor permits | asg when `assistance_in_progress` | — | — | — | — | TA blocked while assigned and not returned (B18) |
| `application.request_assistance`, `submit`, `hand_back`, `request_withdrawal`, `decide_price_increase`, `decide_transition`, `link_dependency` | own when editor permits | — | — | — | — | — | waits for formal return on an assigned case (B18) |
| `application.report_problem` | own | — | — | — | — | — | assigned and not returned only |
| `document.retrieve_bytes`, `selection.retrieve` | own (release check) | asg | — | grant | Y | — (never) | B12 release check on every send. SuperAdmin byte access is owner decision OD-R2-04 (register 02); interim = this row, every release recorded |
| `document.retrieve_for_review` (rev 2, SEC-02) | — | rev, or asg of `uploaded_for_application_id` | — | — | — | — (never) | channel `staff_review` only; artifact `pending_review`/`conflict`; Section 6.9 |
| `document.requeue_check` | — | — | — | — | Y | — | reason required (record 14 C-D6) |
| `notice.read`, `notice.acknowledge` | own | own | own | own | own | R (read) | recipient only |
| `queue.read`, `assistance.decide`, `assignment.*`, `gate_exception.*`, `application.correct_from_evidence`, `withdrawal.record_operational`, `outcome.authorize_unresolved`, `deferral.decide`, `flag.respond`, `protection_mark.resolve`, `incident.assign_reviewer` | — | — | — | — | Y | queue: — | reason required; never readiness or filing (B18) |
| `operator.*` | — | asg | — | — | — | — | current assignment; editor state rules; controls (Section 8) |
| `forecast.record`, `deferral.end`, `incident.open`, `incident.report_disclosure` (rev 2) | — | asg | — | — | Y | — | `incident.open`: asg only for application-scoped kinds (record 13 CMD-IN1) |
| `price.propose_increase`, `failure.classify`, `effort.record_observation` (rev 2) | — | — | — | — | Y | — | reason required; `failure.classify` is SuperAdmin-only (record 13 CMD-IN2) |
| `incident.read`, `incident.work`, `incident.resolve` | own (notice view only) | asg or rev | — | — | Y | R (read) | reviewer sees the artifact (through `document.retrieve_for_review`) and minimal candidate identifiers only (B13) |
| `intake.incident_dispose` | own (correction/abandon) | — | — | — | Y (reasoned dismissal) | — | never cancels an application (B16) |
| `payment.record_service_status` | — | — | — | — | Y | — | evidence required (B26) |
| `payment.read_application` | own | — | — | — | Y | R | operator sees gate pass/blocked only via `application.read` |
| `ceiling.lower`, `ceiling.increase_request` | — | — | — | — | Y | — | B28 |
| `ceiling.increase_approve` | — | — | — | — | Y, distinct from requester | — | B28 |
| `financial_exception.read` | — | — | — | — | Y | — | `Payment_Missing_Override` list (B29) |
| `financial_exception.reassign_owner`, `exposure.read`, `ceiling.increase_decline` (rev 2) | — | — | — | — | Y | — | record 15 C-P5, C-P6 |
| `accounts.surface_read` | — | — | Y | — | Y | — | shows PARKED boundary only |
| `accounts.receipt_verify`, `accounts.adjust`, `exposure.release` | — | — | P | — | P | — | PARKED (B28, B29, B43) |
| `accounts.write_off` | — | — | P | — | P | — | unselected (B29, B43) |
| `delivery.send_document_email`, `completion.check` | — | P | — | — | P | — | KNOWN_LIMITATION (B46); labelled test harness only (Section 7.10) |
| `operator.manual_resend` | — | asg | — | — | — | — | only from `failed`; from `uncertain` ⇒ P (B46) |
| `audit.read_full`, `measures.read`, `tasks.read_failures` | — | — | — | — | Y | — | B10, B32 |
| `search.private` | own scope | asg scope | — | grant scope | Y | R | same predicate as lists |

### 5.4 Lists, search and projections

- Every list and search query MUST include `policy.scope(actor, listAction, alias)` in its `WHERE` clause. The predicate is built from authoritative tables, not from projection columns:

| Actor | Application predicate (alias `a` over `core_applications`) |
|---|---|
| TA | `a.ta_account_id = $actor` |
| Operator | `a.assigned_operator_id = $actor OR EXISTS (SELECT 1 FROM iam_grants g WHERE g.kind = 'group_read' AND g.state = 'active' AND g.grantee_account_id = $actor AND g.group_id = a.group_id AND g.valid_from <= $now AND g.valid_until > $now)` |
| SuperAdmin | `TRUE` |
| Support view | the viewed account's predicate, evaluated with the viewed account's current status (a suspended account ⇒ `FALSE`) |

- A list over a `view_` table MUST join to `core_applications a` and apply the predicate. A projection column MAY narrow results; it MUST NOT widen them (B33).
- Search over private data uses `view_applications.search` joined to the predicate. Public search covers only static public content (B01).
- Counts, totals and "no results" pages are computed after the predicate.

### 5.5 Revocation, suspension and reassignment take effect everywhere

| Event (one transaction) | Effect on sessions | Effect on links and pages | Effect on tasks | Effect on operation-result lookups |
|---|---|---|---|---|
| Account suspended | all sessions of the account revoked | every request re-reads status ⇒ denied | `onBehalfOf` tasks cancel as `cancelled_revoked` at next prepare | replay re-authorizes ⇒ `not_found_or_forbidden` |
| TA email change completed (B09) | all sessions revoked | new sign-in at the new address required | none | — |
| Credential reset | all sessions revoked; TOTP cleared | enrolment token required | — | — |
| Group read grant revoked or expired | — | next request ⇒ denied | — | denied |
| Reassignment | old operator's session survives; relation `asg` ends | old operator denied on that application immediately | tasks on behalf of the old operator re-check and cancel | old operator denied |
| Operator suspended | as suspension; assignments stay `active` but the operator is inactive ⇒ `pending_on_action` = `superadmin` (`assigned_operator_inactive`) until audited reassignment (B11) | — | — | — |
| Restore (B40) | all sessions, OTPs, enrolment tokens and lease tokens unusable (new secrets) | — | leases unusable | — |

No URL is a bearer credential. Download and selection routes are `POST` with session + CSRF and run the release check per file (Section 12).

## 6. Inter-module interfaces

Each module exports exactly one object type from `src/modules/<module>/api.ts`. Queries take `ReadTx`; writers take `WriteTx` and run inside the caller's transaction (cross-owner atomicity). A writer validates its own invariants and appends its own facts; the caller never writes another owner's table. Commands of a module are listed only where another module or the harness depends on their names.

### 6.1 Shared value types (`src/kernel/vocabulary/shared.ts`)

```ts
export interface GoverningIds { readonly declarationId: DeclarationVersionId; readonly baselineId: BaselineVersionId; readonly bindingId: BindingId }
export interface ApplicationScope { readonly applicationId: ApplicationId; readonly groupId: GroupId; readonly taAccountId: AccountId; readonly offeringId: OfferingId; readonly assignedOperatorId: AccountId | null }
export interface ApplicationControlState extends ApplicationScope {
  readonly lifecycle: LifecycleState; readonly outcome: Outcome | null; readonly editorState: EditorState;
  readonly openHolds: readonly HoldKind[]; readonly holdRevision: bigint; readonly materialRevision: bigint; readonly revision: bigint;
  readonly governing: GoverningIds; readonly serviceMode: ServiceMode; readonly submitted: boolean;
  readonly activeAssignmentId: AssignmentId | null; readonly operatorWorkEverAuthorized: boolean;
  readonly openActs: readonly { readonly authorizationId: AuthorizationId; readonly kind: ExternalActKind; readonly state: ExternalActState }[];
  readonly withdrawalAccepted: boolean; readonly activeProtectionMark: boolean; readonly governmentAttemptNo: number;
}
export interface ControlRequest {
  readonly action: ControlledAction; readonly actor: Actor;
  readonly applicationId?: ApplicationId; readonly offeringId?: OfferingId; readonly taAccountId?: AccountId; readonly groupId?: GroupId;
  readonly externalActKind?: ExternalActKind; readonly feeAmountPaise?: Paise;
}
export interface ControlResult {
  readonly allowed: boolean;
  readonly blockers: readonly ControlBlocker[];          // ordered as Section 8.2
  readonly gateBasis: Readonly<Partial<Record<Gate, { readonly kind: 'passed' } | { readonly kind: 'exception'; readonly id: GateExceptionId } | { readonly kind: 'not_applicable' }>>>;
  readonly launchEffect: LaunchEffect;
}
```

### 6.2 Identity & Access (`identity`)

```ts
export interface IdentityApi {
  getAccount(tx: ReadTx, id: AccountId, lock?: Lock): Promise<{ readonly id: AccountId; readonly role: Role; readonly status: AccountStatus; readonly mfaEnrolled: boolean; readonly revision: bigint } | undefined>;
  getRecipient(tx: ReadTx, taAccountId: AccountId, lock?: Lock): Promise<{ readonly status: AccountStatus; readonly currentEmail: string; readonly emailRevision: bigint }>;   // B31 recipient = owning TA's current email
  listAssignableOperators(tx: ReadTx): Promise<readonly { readonly id: AccountId; readonly displayName: string }[]>;   // active, MFA-enrolled operators ordered by id
  countActiveSuperAdmins(tx: ReadTx): Promise<number>;
  resolveSession(tx: ReadTx, tokenHmac: Buffer): Promise<{ readonly sessionId: SessionId; readonly accountId: AccountId; readonly role: Role; readonly mfaVerified: boolean; readonly supportViewId: Id<'spv'> | null } | undefined>;
  readonly relations: Pick<PolicyRelations, 'groupReadGrant' | 'accountingGrant'>;
  readonly policy: Policy;
  // rev 2 (record 11 CCR-03, record 14 CCR-10e)
  consumeBotCheck(tx: WriteTx, req: { readonly payload: string; readonly purpose: 'ta_otp' | 'bulk_intake' | 'correction_upload'; readonly binding: Buffer }): Promise<void>;   // sole writer of iam_captcha_spent; throws bot_check_failed
  rateLimit: { consume(name: RateLimiterName, key: string): Promise<void> };   // library store stays Identity-owned; throws rate_limited
}
// Commands (owned): iam.request_ta_otp, iam.verify_ta_otp, iam.staff_sign_in, iam.staff_enrol, iam.sign_out,
// iam.start_email_change, iam.confirm_email_change, iam.create_account, iam.approve_account, iam.decline_account,
// iam.activate_account, iam.suspend_account, iam.restore_account, iam.reset_credentials, iam.request_elevation,
// iam.approve_elevation, iam.create_group_read_grant, iam.revoke_grant, iam.set_accounting_grant, iam.start_support_view, iam.end_support_view
// rev 2 (record 11 CCR-10): iam.request_staff_otp, iam.open_enrolment, iam.cancel_email_change, iam.decline_elevation,
// harness.iam.seed_synthetic (actor kind harness, test/local_test only). Task: iam.send_mail, iam.expiry_cleanup.
```

Identity calls no other module's writer. Operator suspension does not end assignments; Core shows the duty as SuperAdmin-owned until audited reassignment (B11).

### 6.3 Catalogue (`catalogue`)

```ts
export interface CatalogueApi {
  getOffering(tx: ReadTx, id: OfferingId, lock?: Lock): Promise<{ readonly id: OfferingId; readonly countryId: CountryId; readonly serviceMode: ServiceMode; readonly availability: CatalogueAvailability; readonly head: GoverningIds | null; readonly publicationSeq: bigint } | undefined>;
  currentGoverning(tx: ReadTx, offeringId: OfferingId, releaseId: ReleaseId, lock?: Lock): Promise<{ readonly ok: true; readonly ids: GoverningIds } | { readonly ok: false; readonly code: 'catalogue_not_published' | 'declaration_unsupported' | 'declaration_incomplete' | 'binding_missing' | 'binding_incompatible' }>;
  getDeclaration(tx: ReadTx, id: DeclarationVersionId): Promise<StructuralDeclaration>;      // parsed decl/1 (Section 9.2)
  getBaseline(tx: ReadTx, id: BaselineVersionId): Promise<BaselineValues>;
  bindingStatus(tx: ReadTx, id: BindingId, releaseId: ReleaseId): Promise<'supported' | 'incompatible' | 'missing'>;
  impactFor(tx: ReadTx, applicationId: ApplicationId, lock?: Lock): Promise<{ readonly state: 'none' | 'unknown' | 'affected_pending' | 'affected_hold' | 'continue' | 'transition_pending'; readonly itemIds: readonly Id<'imi'>[] }>;
  snapshotForIntake(tx: ReadTx, countryId: CountryId, releaseId: ReleaseId): Promise<Readonly<Record<OfferingId, GoverningIds>>>;
  listPublicCatalogue(tx: ReadTx): Promise<readonly PublicOfferingSummary[]>;   // for authenticated discovery; public site uses static content
  // rev 2 (record 12 CCR-06); currentGoverning's failure union adds 'baseline_incompatible' | 'synthetic_not_permitted'
  declarationSupportFor(tx: ReadTx, governing: GoverningIds, action: ControlledAction, releaseId: ReleaseId): Promise<readonly ControlBlocker[]>;   // blockers carry ref = item key (Section 9.2)
  itemStatuses(tx: ReadTx, declarationId: DeclarationVersionId, releaseId: ReleaseId): Promise<readonly DeclItemStatus[]>;
  selectableOfferings(tx: ReadTx, actor: Actor, countryId?: CountryId): Promise<readonly SelectableOffering[]>;
  offeringDisplay(tx: ReadTx, governing: GoverningIds): Promise<OfferingDisplay>;
  evaluateTravelDateRules(decl: StructuralDeclaration, input: TravelDateInput): TravelDateResult;   // pure; submit-window timing only (Section 9.2 eligibility.travelDateRules)
  noteGoverningBehindHead(tx: WriteTx, applicationId: ApplicationId): Promise<void>;   // called by Core when it creates an application on a non-head tuple (record 14 CCR-08 rejected in favour of this)
}
// Commands: cat.create_country, cat.set_country_listing, cat.create_offering, cat.draft_declaration, cat.record_owner_approval, cat.bind_declaration,
// cat.edit_baseline, cat.preview_baseline, cat.publish_baseline, cat.preview_declaration, cat.publish_declaration, cat.assign_impact_reviewer,
// cat.decide_impact_items, cat.approve_transition, cat.request_impact_recheck, cat.retire_offering (SuperAdmin);
// cat.register_release_catalogue, cat.submit_release_impact (engineering maintenance commands, run during cutover verify while closed, Section 4.2)
// Task: catalogue.impact_recheck — record step calls core.applyBaselinePriceReduction, core.recordContinuation, core.proposePriceIncrease (B06, B17)
```

### 6.4 Core (`core`)

```ts
export interface CoreApi {
  // queries
  lockApplication(tx: WriteTx, id: ApplicationId, mode: 'share' | 'update'): Promise<ApplicationControlState>;   // throws not_found_or_forbidden if absent
  getApplicationScope(tx: ReadTx, id: ApplicationId): Promise<ApplicationScope | undefined>;
  getControlState(tx: ReadTx, id: ApplicationId): Promise<ApplicationControlState>;
  evaluateControls(tx: ReadTx, req: ControlRequest): Promise<ControlResult>;                                     // Section 8
  readinessBasis(tx: ReadTx, id: ApplicationId): Promise<{ readonly fingerprint: Buffer; readonly basis: JsonObject; readonly assignmentId: AssignmentId | null }>;
  pendingOnAction(tx: ReadTx, id: ApplicationId): Promise<PendingOnAction>;
  deriveProgress(input: { readonly lifecycle: LifecycleState; readonly outcome: Outcome | null; readonly pending: PendingOnAction }): ProgressMeaning;   // pure
  groupEndEligibility(tx: ReadTx, id: ApplicationId, today: LocalDate): Promise<{ readonly eligible: boolean; readonly reasons: readonly ReasonCode[] }>;
  openApplicationsInGroup(tx: ReadTx, groupId: GroupId): Promise<readonly ApplicationId[]>;
  dependencyState(tx: ReadTx, id: ApplicationId): Promise<readonly { readonly dependencyId: Id<'dep'>; readonly state: string; readonly upstream: ApplicationId }[]>;
  relations: Pick<PolicyRelations, 'application' | 'group'>;
  // rev 2 queries (record 11 CCR-09; record 12 CCR-07; record 13 CCR-13; record 14 CCR-06c)
  operatorDuties(tx: ReadTx, accountId: AccountId): Promise<{ readonly activeAssignments: readonly ApplicationId[]; readonly reconciliationOwnerActs: readonly AuthorizationId[]; readonly openHoldsOnAssigned: number }>;
  openApplicationsForOffering(tx: ReadTx, offeringId: OfferingId, afterId: ApplicationId | null, limit: number): Promise<readonly OpenApplicationImpactView[]>;   // ids, governing tuple, lifecycle, act states, filed flags, effective price, payment status
  applicantIdentity(tx: ReadTx, id: ApplicationId): Promise<{ readonly identity: ApplicantIdentity; readonly snapshotVersionNo: number }>;
  completionEvidence(tx: ReadTx, id: ApplicationId): Promise<readonly CompletionPrerequisiteStatus[]>;   // record 13 §2.3.4, E1–E7
  currentPrice(tx: ReadTx, id: ApplicationId): Promise<{ readonly effectivePricePaise: Paise; readonly openIncrease: Id<'pri'> | null }>;
  estimateAndForecast(tx: ReadTx, id: ApplicationId): Promise<EstimateAndForecast>;
  feeCarryingAct(decl: StructuralDeclaration): 'government_fee_payment' | 'government_submission' | 'none' | 'unresolved';   // pure; Section 7.4

  // writers for other owners (same transaction)
  acceptIntakeProposals(tx: WriteTx, p: {                                    // rev 2 (record 14 CCR-06a; replaces acceptIntakeProposal)
    readonly attemptId: IntakeAttemptId; readonly rowId: IntakeRowId; readonly groupId: GroupId;
    readonly applicantKey: ApplicantKey; readonly applicantKeySource: 'mrz' | 'row' | 'form'; readonly applicant: ApplicantData;
    readonly proposals: readonly { readonly offeringId: OfferingId; readonly governing: GoverningIds; readonly documents: readonly { readonly versionId: DocumentVersionId; readonly requirementType: string }[] }[];
  }): Promise<readonly ({ readonly offeringId: OfferingId; readonly kind: 'created'; readonly applicationId: ApplicationId; readonly snapshotVersionNo: number } | { readonly offeringId: OfferingId; readonly kind: 'matched_existing'; readonly applicationId: ApplicationId } | { readonly offeringId: OfferingId; readonly kind: 'refused'; readonly code: ReasonCode })[]>;
    // locks offering heads ascending, then controls, then the group (share); on matched_existing Core MUST NOT change the existing application and
    // MUST NOT associate documents to it; when a proposal's governing tuple ≠ the locked head, calls catalogue.noteGoverningBehindHead.
    // The individual form (intake.start_individual) uses this same writer; there is no separate TA route that creates a draft (B14).
  applyIntakeCorrection(tx: WriteTx, req: { readonly applicationId: ApplicationId; readonly expectedSnapshotVersionNo: number; readonly changes: JsonObject; readonly documentReplacements: readonly { readonly requirementType: string; readonly versionId: DocumentVersionId }[]; readonly attemptId: IntakeAttemptId; readonly rowId: IntakeRowId }): Promise<{ readonly kind: 'applied'; readonly snapshotVersionNo: number } | { readonly kind: 'refused'; readonly code: 'stale_target_revision' | 'correction_target_not_draft' | 'identity_change_requires_evidence' }>;   // all-or-nothing (B16)
  noteEvidenceChanged(tx: WriteTx, id: ApplicationId, cause: 'association_changed' | 'version_blocked' | 'version_replaced' | 'bytes_unavailable' | 'extraction_resolved'): Promise<void>;   // bumps revision + material_revision
  noteUpstreamArtifactChanged(tx: WriteTx, upstreamId: ApplicationId): Promise<void>;   // rev 2 (record 13 CCR-13): re-runs dependency evaluation for dependents
  recordExternalActEvidence(tx: WriteTx, req: { readonly authorizationId: AuthorizationId; readonly to: 'filed_evidenced' | 'not_filed_evidenced' | 'filing_unknown'; readonly evidenceId: Id<'xev'>; readonly feePaidPaise?: Paise }): Promise<ExternalActState>;
    // rev 2 (MON-01): for the fee-carrying act (carries_fee) it calls payments.recordTmFeePaid (feePaidPaise REQUIRED, > 0) on filed_evidenced,
    // payments.recordFeePaymentUnknown on filing_unknown, payments.recordFeeNotPaid on not_filed_evidenced — whatever the act kind.
  recordOutcomeFromEvidence(tx: WriteTx, req: { readonly applicationId: ApplicationId; readonly outcome: 'issued' | 'refused' | 'prepared_and_handed_over'; readonly evidence: readonly EvidenceRef[] }): Promise<void>;
  applyBaselinePriceReduction(tx: WriteTx, req: { readonly applicationId: ApplicationId; readonly baselineId: BaselineVersionId; readonly newPricePaise: Paise }): Promise<'reduced' | 'not_applicable_paid' | 'not_lower'>;
  recordContinuation(tx: WriteTx, req: { readonly applicationId: ApplicationId; readonly impactItemId: Id<'imi'>; readonly from: GoverningIds; readonly to: GoverningIds }): Promise<'recorded' | 'already_recorded'>;
    // rev 2 (record 12 CCR-07, COV-09): conditional on governing = from; application open; no act authorized/filing_unknown/reconciliation_exhausted;
    // bumps material_revision; fact core.continuation_recorded. Invariant: the quoted price and every core_price_records row are unchanged (B17).
  openStructuralTransition(tx: WriteTx, req: { readonly applicationId: ApplicationId; readonly impactItemId: Id<'imi'>; readonly from: GoverningIds; readonly to: GoverningIds; readonly compatibilityEvidence: readonly EvidenceRef[]; readonly approvedBy: AccountId; readonly taAuthorityRequired: boolean }): Promise<Id<'stt'>>;
    // applies now (fact core.structural_transition_applied) or awaits TA authority (core.structural_transition_proposed + TA notice);
    // conditions as recordContinuation; the quoted price is unchanged (only reduction_auto and an accepted increase change the effective price).
  proposePriceIncrease(tx: WriteTx, req: { readonly applicationId: ApplicationId; readonly baselineId: BaselineVersionId; readonly newPricePaise: Paise; readonly cause: 'mistaken_price' }): Promise<'proposed' | 'already_open' | 'not_higher' | 'not_applicable'>;   // writer form of CMD-S2 for the impact recheck
  setApplicantKey(tx: WriteTx, req: { readonly applicationId: ApplicationId | null; readonly groupId: GroupId; readonly offeringId: OfferingId; readonly newKey: ApplicantKey; readonly laterAttemptOf?: ApplicationId; readonly freshIntakeConfirmed?: boolean }): Promise<void>;
    // rev 2 (MON-04): Core-internal writer (listed for completeness; other modules MUST NOT call it) used by every path that sets or changes applicant_key; Section 3.5 guard rule
  recordProtectionMark(tx: WriteTx, req: { readonly applicationId: ApplicationId; readonly restoreId: Id<'rst'>; readonly possiblyFiled: boolean; readonly possiblyPaid: boolean; readonly possiblyReleased: boolean }): Promise<'recorded' | 'already_recorded'>;   // engineering CLI only
}
// Commands (names used by others/harness): core.create_group, core.edit_travel_dates, core.close_group, core.edit_draft,
// core.correct_identity, core.request_assistance, core.decide_assistance, core.submit, core.report_problem, core.formal_return, core.hand_back,
// core.flag, core.respond_flag, core.resolve_hold, core.assign, core.reassign, core.grant_gate_exception, core.revoke_gate_exception,
// core.authorize_external_act, core.request_withdrawal, core.record_applicant_withdrawal, core.record_operational_withdrawal,
// core.authorize_unresolved_completion, core.record_outcome, core.correct_from_evidence, core.propose_deferral, core.decide_deferral,
// core.decide_price_increase, core.decide_transition, harness.core.check_completion (harness only), core.resolve_protection_mark;
// rev 2 (record 13 CCR-21): core.assign_selection, core.record_assistance_entry, core.propose_price_increase, core.record_forecast,
// core.link_dependency, core.unlink_dependency, core.apply_held_correction, core.end_deferral, core.release_packet.
// Rev 2 (record 14 CCR-06, BND-11): core.create_draft is NOT a TA route; it is the internal acceptance function used by acceptIntakeProposals.
// Tasks: core.group_end_sweep, core.travel_date_recheck, core.timing_risk_check, core.deferral_review_due
```

### 6.5 Intake (`intake`)

```ts
export interface IntakeApi {
  groupClosureBlockers(tx: ReadTx, groupId: GroupId): Promise<{ readonly openIncidents: number; readonly activeAttempts: number }>;   // rev 2 (record 14 CCR-09): core.close_group and the group-end sweep require both zero
  openIncidentsInGroup(tx: ReadTx, groupId: GroupId): Promise<number>;                         // kept for compatibility
  attemptSummary(tx: ReadTx, id: IntakeAttemptId): Promise<IntakeAttemptSummary | undefined>;
  onDocumentSettled(tx: WriteTx, e: DocumentSettledEvent): Promise<void>;                      // rev 2 (record 14 CCR-05): registered as a Documents listener in compose.ts
  relations: Pick<PolicyRelations, 'intakeAttempt' | 'intakeIncident'>;
}
// Commands: intake.start_individual, intake.start_bulk, intake.answer_question, intake.correction_upload, intake.abandon, intake.resume, intake.dispose_incident
// Tasks: intake.fetch_source → intake.preflight → intake.parse_sheet → intake.fetch_row_files → intake.process_rows
// intake.process_rows record step: per row, in one transaction: core.acceptIntakeProposals (which calls documents.associateFromProposal and
// payments.ensureApplicationState) or core.applyIntakeCorrection, intake row result. Bot checks: identity.consumeBotCheck (record 11 CCR-03).
```

### 6.6 Document Processing (`documents`)

```ts
export interface DocumentsApi {
  registerVersion(tx: WriteTx, req: {
    readonly blobId: BlobId; readonly groupId: GroupId; readonly taAccountId: AccountId; readonly source: DocSource;
    readonly declaredMediaType: string; readonly sizeBytes: number; readonly sha256: Buffer;
    readonly replacesVersionId?: DocumentVersionId; readonly intakeAttemptId?: IntakeAttemptId;
  }): Promise<DocumentVersionId>;                                   // references blob, requests quarantine move, enqueues doc.scan
  requirementEvidence(tx: ReadTx, applicationId: ApplicationId, requirements: readonly DeclaredRequirement[]): Promise<readonly {
    readonly requirementType: string; readonly mandatory: boolean;
    readonly status: 'satisfied' | 'missing' | 'unreadable' | 'unclassified' | 'unassociated' | 'safety_pending' | 'validity_failed' | 'validity_unknown' | 'blocked' | 'conflict';
    readonly versionId: DocumentVersionId | null;
  }[]>;
  evidenceFingerprint(tx: ReadTx, applicationId: ApplicationId): Promise<Buffer>;   // SHA-256 over sorted (requirement, version, association revision, verdict ids)
  getVersionForRelease(tx: ReadTx, versionId: DocumentVersionId, lock?: Lock): Promise<{ readonly groupId: GroupId; readonly purpose: DocPurpose; readonly currency: DocCurrency; readonly bytesState: DocBytesState; readonly contentSafe: boolean; readonly processingState: DocProcessingState; readonly blobId: BlobId; readonly sha256: Buffer; readonly sizeBytes: number; readonly mediaType: string } | undefined>;   // rev 2: purpose, contentSafe (record 14 CCR-02)
  extractionProposal(tx: ReadTx, versionId: DocumentVersionId): Promise<ExtractionProposal | undefined>;
  artifactExtraction(tx: ReadTx, versionId: DocumentVersionId): Promise<ArtifactExtraction | undefined>;   // rev 2 (BND-13): { status, passportNumberCandidates, nameTokens, mrz? } for official results
  relations: Pick<PolicyRelations, 'documentVersion' | 'association'>;
  // writers for other owners
  registerSettledListener(fn: DocumentSettledListener): void;   // rev 2 (record 14 CCR-05): compose-time; listeners run inside the Documents record transaction
  associateFromProposal(tx: WriteTx, req: { readonly versionId: DocumentVersionId; readonly applicationId: ApplicationId; readonly requirementType: string; readonly proposedByRowId: IntakeRowId }): Promise<AssociationId>;   // called by Core within acceptIntakeProposals; refuses another group and any purpose ≠ 'evidence'
  reevaluateForApplication(tx: WriteTx, applicationId: ApplicationId): Promise<void>;   // rev 2 (record 14 CCR-12): Core MUST call it in every transaction that changes applicant identity fields
  blockVersion(tx: WriteTx, versionId: DocumentVersionId, incidentId: IncidentId): Promise<void>;   // called by Operations (disclosure)
  markBytesUnavailable(tx: WriteTx, versionId: DocumentVersionId, cause: 'missing' | 'integrity_failed'): Promise<void>;   // called by Delivery after a failed verified read, and by the blob onMoveFailedTerminal hook
}
// Commands: doc.upload_for_application, doc.resolve_extraction, doc.confirm_classification, doc.associate, doc.revoke_association, doc.replace_version, doc.requeue_check
// Tasks: doc.scan (size, magic type, clamd) → doc.parse (sandboxed structural check + extraction) ; every association change calls core.noteEvidenceChanged.
// Rev 2 (BND-13): the doc.parse record step notifies the settled listeners for every version, including purpose 'official_result';
// Operations registers operations.evaluateArtifactAssociation as such a listener (no import cycle, T-F03).
```

### 6.7 Operations (`operations`)

```ts
export interface OperationsApi {
  launchDecision(tx: ReadTx, req: { readonly offeringId: OfferingId; readonly action: ControlledAction; readonly taAccountId: AccountId; readonly admittedLaunchId: Id<'lch'> | null }, lock?: Lock): Promise<{ readonly effect: LaunchEffect; readonly codes: readonly ReasonCode[]; readonly currentLaunchId: Id<'lch'> | null }>;
  currentReadiness(tx: ReadTx, applicationId: ApplicationId, lock?: Lock): Promise<{ readonly id: ReadinessId; readonly assignmentId: AssignmentId; readonly fingerprint: Buffer } | undefined>;
  artifactEligibility(tx: ReadTx, req: { readonly applicationId: ApplicationId; readonly documentVersionId: DocumentVersionId }, lock?: Lock): Promise<{ readonly status: 'eligible' | 'not_artifact' | 'withheld_missing' | 'withheld_wrong' | 'blocked' | 'noncurrent' | 'pending_review'; readonly artifactId: ArtifactId | null }>;
  blockingIncidents(tx: ReadTx, req: { readonly applicationId?: ApplicationId; readonly documentVersionId?: DocumentVersionId }): Promise<readonly { readonly id: IncidentId; readonly kind: OpsIncidentKind }[]>;
  custodyState(tx: ReadTx, applicationId: ApplicationId): Promise<{ readonly heldOriginals: number; readonly uncertain: number; readonly returnAvailable: boolean }>;
  relations: Pick<PolicyRelations, 'incident' | 'artifactAssociation'>;
  // rev 2 queries (record 11 CCR-09; record 12 CCR-08)
  incidentsOwnedBy(tx: ReadTx, accountId: AccountId): Promise<readonly IncidentId[]>;
  launchSummary(tx: ReadTx, offeringId: OfferingId): Promise<LaunchSummary>;
  // writers for other owners
  openIncident(tx: WriteTx, spec: { readonly kind: OpsIncidentKind; readonly applicationId?: ApplicationId; readonly documentVersionId?: DocumentVersionId; readonly artifactId?: ArtifactId; readonly countryId?: CountryId; readonly ownerKind: 'assigned_operator' | 'superadmin'; readonly dedupeKey: string }): Promise<IncidentId>;   // idempotent by dedupeKey (unique column)
  ensureOfferingControls(tx: WriteTx, offeringId: OfferingId): Promise<void>;   // rev 2 (record 12 CCR-08): insert-if-absent of the guard row; called by Catalogue
  transferApplicationDuties(tx: WriteTx, req: { readonly applicationId: ApplicationId; readonly fromOperator: AccountId; readonly toOperator: AccountId }): Promise<readonly IncidentId[]>;   // rev 2 (record 13 CCR-13)
  evaluateArtifactAssociation(tx: WriteTx, e: DocumentSettledEvent): Promise<void>;   // rev 2 (record 13 CCR-13, BND-13): Documents settled listener for purpose 'official_result'; fail closed: when the rule cannot run or does not verify, an owned artifact_association incident opens
}
// Commands: ops.record_launch_plan, ops.approve_launch, ops.expand_launch_scope, ops.suspend_offering, ops.lift_suspension, ops.withdraw_offering,
// ops.record_existing_work_treatment, ops.start_work, ops.record_work_step, ops.record_readiness, ops.withdraw_readiness, ops.request_packet_build
// (calls delivery.requestPacketBuild), ops.record_act_evidence (calls core.recordExternalActEvidence), ops.record_reconciliation_attempt,
// ops.record_official_result (registers artifact; calls core.recordOutcomeFromEvidence), ops.record_artifact, ops.confirm_artifact_association,
// ops.reject_artifact_association, ops.report_wrong_recipient (calls documents.blockVersion), ops.post_disclosure_notice, ops.assign_incident_reviewer,
// ops.open_incident, ops.record_incident_evidence, ops.resolve_incident, ops.close_incident, ops.record_original_receipt, ops.link_original,
// ops.record_original_movement, ops.record_original_return (unavailable unless an owner-approved return policy is declared),
// ops.classify_failure (SuperAdmin), ops.record_effort_sample (rev 2, COV-10). Task: ops.attribute_country_defect.
```

### 6.8 Payment Records (`payments`)

```ts
export interface PaymentsApi {
  servicePayment(tx: ReadTx, applicationId: ApplicationId, lock?: Lock): Promise<{ readonly status: ServicePaymentStatus; readonly entryId: PaymentEntryId | null; readonly statusRevision: bigint }>;
  exposure(tx: ReadTx, taAccountId: AccountId, lock?: Lock): Promise<{ readonly ceilingPaise: Paise; readonly reservedPaise: Paise; readonly tmPaidUnrecoveredPaise: Paise; readonly revision: bigint }>;
  outstandingMoney(tx: ReadTx, applicationId: ApplicationId): Promise<{ readonly outstanding: boolean; readonly codes: readonly ('open_financial_exception' | 'exposure_reserved' | 'tm_paid_unrecovered' | 'fee_payment_unknown')[] }>;
  openFinancialExceptions(tx: ReadTx, applicationId: ApplicationId): Promise<readonly { readonly id: FinancialExceptionId; readonly kind: FinExceptionKind }[]>;
  // writers for other owners
  ensureApplicationState(tx: WriteTx, applicationId: ApplicationId, taAccountId: AccountId): Promise<void>;   // Core, at draft creation
  reserveExposure(tx: WriteTx, req: { readonly taAccountId: AccountId; readonly applicationId: ApplicationId; readonly logicalEffectKey: LogicalEffectKey; readonly amountPaise: Paise; readonly authorizationId: AuthorizationId; readonly servicePaymentStatus: ServicePaymentStatus }): Promise<{ readonly reservationId: ReservationId; readonly reused: boolean }>;
    // locks pay_ta_exposure FOR UPDATE; throws TmError('control_blocked', 'exposure_ceiling_breach' | 'exposure_parked_paid_case_default_ceiling') — Section 8.6
  recordTmFeePaid(tx: WriteTx, req: { readonly logicalEffectKey: LogicalEffectKey; readonly amountPaise: Paise; readonly authorizationId: AuthorizationId; readonly evidenceId: Id<'xev'>; readonly eventAt?: Date }): Promise<void>;   // reservation converted (converted_paise), fee tm_paid, TA liability = paid amount (B27)
  recordFeePaymentUnknown(tx: WriteTx, req: { readonly logicalEffectKey: LogicalEffectKey; readonly authorizationId: AuthorizationId }): Promise<void>;
  recordFeeNotPaid(tx: WriteTx, req: { readonly logicalEffectKey: LogicalEffectKey; readonly authorizationId: AuthorizationId; readonly evidenceId: Id<'xev'> }): Promise<void>;   // rev 2 (record 15 CCR-15-02): fee reserved|payment_unknown → reserved; reservation unchanged and reusable
  feeSummary(tx: ReadTx, applicationId: ApplicationId): Promise<FeeSummary>;
  openFinancialException(tx: WriteTx, req: { readonly applicationId: ApplicationId; readonly kind: FinExceptionKind; readonly causeRef: string; readonly accountableSuperAdminId: AccountId }): Promise<FinancialExceptionId>;   // idempotent by (application, kind, cause)
    // rev 2 (BND-08): accountable SuperAdmin = the grantor of the consumed gate exception (work_under_gate1_exception, commitment_under_gate2_exception)
    // or the recording SuperAdmin of the entry (payment_corrected_after_work, worked_then_corrected_to_unpaid)
}
// Commands: pay.record_service_status (opens payment_corrected_after_work / worked_then_corrected_to_unpaid; closes open exceptions on payment_received),
// pay.lower_ceiling, pay.request_ceiling_increase, pay.approve_ceiling_increase, pay.decline_ceiling_increase, pay.reassign_follow_up_owner (rev 2, record 15 CCR-15-03)
```

### 6.9 TA Delivery (`delivery`)

```ts
export interface DeliveryApi {
  checkRelease(tx: WriteTx, req: {
    readonly actor: Actor; readonly recipientAccountId: AccountId; readonly applicationId: ApplicationId;
    readonly subject: { readonly kind: 'document_version' | 'artifact' | 'packet'; readonly id: string };
    readonly channel: ReleaseChannelName; readonly selectionId?: Id<'sel'>; readonly emailSendId?: EmailSendId; readonly incidentId?: IncidentId;   // ReleaseChannelName = RELEASE_CHANNELS[number]
  }): Promise<{ readonly releaseId: ReleaseRecordId; readonly allowed: boolean; readonly denyCode: ReasonCode | null; readonly bytes: { readonly blobId: BlobId; readonly sha256: Buffer; readonly sizeBytes: number; readonly mediaType: string } | null }>;
  recordReleaseResult(tx: WriteTx, releaseId: ReleaseRecordId, result: ReleaseResult, bytesSent: number): Promise<void>;   // set once
  recordSelectionItemResult(tx: WriteTx, req: { readonly selectionId: Id<'sel'>; readonly itemNo: number; readonly result: SelectionItemResult; readonly code: ReasonCode | null; readonly releaseId: ReleaseRecordId | null }): Promise<void>;   // set once
  postNotice(tx: WriteTx, req: { readonly recipientAccountId: AccountId; readonly applicationId?: ApplicationId; readonly kind: NoticeKind; readonly params: JsonObject; readonly ackRequired: boolean; readonly dedupeKey: string }): Promise<NoticeId>;   // idempotent by dedupeKey; 'result_available' only from harness commands
  deliveryEvidence(tx: ReadTx, applicationId: ApplicationId): Promise<{ readonly emails: readonly { readonly id: EmailSendId; readonly state: EmailSendState; readonly versionIds: readonly DocumentVersionId[] }[]; readonly notices: readonly { readonly id: NoticeId; readonly kind: NoticeKind }[]; readonly handovers: readonly { readonly kind: string; readonly systemVerified: boolean }[]; readonly retrievals: number }>;
  // rev 2 (record 13 CCR-13, COV-03): packet writers called by Operations and Core
  requestPacketBuild(tx: WriteTx, req: { readonly applicationId: ApplicationId; readonly versionIds: readonly DocumentVersionId[]; readonly requestedBy: AccountId; readonly supersedePacketId?: PacketId }): Promise<PacketId>;   // dlv_packets 'building' + task delivery.build_packet (on behalf of the operator)
  markPacketReleased(tx: WriteTx, req: { readonly packetId: PacketId; readonly packetReleaseId: Id<'prl'> }): Promise<void>;   // only caller: core.release_packet; conditional built → released; fact dlv.packet_state_changed
  relations: Pick<PolicyRelations, 'notice'>;
}
// Commands: dlv.retrieve_document (stream), dlv.retrieve_selection (zip stream), dlv.retrieve_for_review (stream, staff_review; rev 2 SEC-02),
// dlv.record_handover, dlv.record_manual_email, dlv.record_direct_external, dlv.manual_resend (from failed only), dlv.acknowledge_notice;
// harness only (B46): harness.dlv.queue_document_email, harness.dlv.post_result_notice. Task: delivery.build_packet, mail.deliver.
// Rev 2 (COV-03): packet build is requested by ops.request_packet_build and packet release is accepted only by core.release_packet;
// dlv.build_packet and dlv.release_packet do not exist.
```

`checkRelease` order (B12; rev 2 per SEC-01, SEC-02, record 14 CCR-02, record 15 CCR-15-13). The first failing step decides `deny_reason`; every call records one `dlv_releases` row and one `dlv.release_checked` fact:

| # | Check | Deny code |
|---|---|---|
| 1 | `assertWriter` (admission open, current epoch) | transaction refused (`maintenance`), no row |
| 2 | Recipient account `active`. Channels `web_retrieval`/`bulk_selection` by a TA and `document_email`: recipient = the application's owning TA. Channel `staff_review`: recipient = the requester, who is the incident owner, the named reviewer, or the assigned operator of the artifact's `uploaded_for_application_id` | `recipient_inactive`, `recipient_not_owning_ta`, `review_channel_not_applicable` |
| 3 | Current policy relation of the requester: `document.retrieve_bytes` (`document.retrieve_for_review` for `staff_review`) | `recipient_access_revoked` (reachable in continuations; a command's `authorize` refuses first with `not_found_or_forbidden`) |
| 4 | No active protection mark on the application (I-14) | `protection_mark_active` |
| 5 | Version: exists, same group as the application, `currency = 'current'`, `content_safe = true`, `bytes_state = 'canonical'` (never `safety_passed` alone) | `version_replaced`, `version_blocked`, `bytes_unavailable`, `version_not_processed` |
| 6a | Subject `document_version`: version `purpose = 'evidence'` and a **positive Documents association** of that exact version to this application and requirement type | `version_not_eligible`, `association_not_positive` |
| 6b | Subject `artifact` (version `purpose = 'official_result'`): an `ops_artifacts` row with `document_version_id` = this version **and** `application_id` = this application **and** `association_status = 'verified'` (Operations relation `artifactAssociation`), then `artifactEligibility = 'eligible'`. Channel `staff_review` instead: the artifact's `association_status ∈ {pending_review, conflict}`, eligibility not `blocked`/`noncurrent`, and the application is the artifact's `uploaded_for_application_id` or one of the incident's candidates; the reviewer's purpose is recorded in `incident_id` | `association_not_positive`, `artifact_not_eligible`, `review_channel_not_applicable` |
| 6c | Subject `packet`: state `released` with a `core_packet_releases` row; blob canonical; every constituent version still current, canonical and positively associated | `packet_not_released`, `packet_superseded`, `packet_constituent_unavailable` |
| 7 | `operations.blockingIncidents({ applicationId, documentVersionId })` empty (for `staff_review` an open `artifact_association` incident is not blocking; `wrong_recipient_disclosure` and `bytes_integrity` are) | `incident_block` |
| 8 | Allowed: record blob id, SHA-256, size and media type of exactly this subject | — |

No step substitutes another version or artifact. A denial never changes an outcome. A version of purpose `official_result` is never released as a `document_version` subject; an `evidence` version is never released as an `artifact` subject; an artifact version requested against any application other than its verified application is denied. A `staff_review` release is never TA delivery evidence and never completion evidence. A change after the check and before the end of that file's send is the accepted interval (B12 OWNER_DECISION); no send lock.

### 6.10 Derived Views (`views`)

```ts
export interface ViewsApi {
  runProjector(env: KernelEnv, name: ProjectorName, batch: number): Promise<{ readonly processed: number; readonly lagMs: number }>;   // tailFacts only
  rebuild(owner: OwnerPool, name: ProjectorName): Promise<void>;          // truncate + replay from business truth (CLI)
  health(tx: ReadTx): Promise<Readonly<Record<ProjectorName, { readonly healthy: boolean; readonly lagMs: number }>>>;
  // read queries (all take policy.scope): listApplications, assignmentQueue, auditSearch, taHistory, financialFollowUp, measures
}
```

### 6.11 Cross-owner atomic calls (one transaction each)

| Command (owner) | Calls inside the same transaction | Rule |
|---|---|---|
| `core.authorize_external_act` (Core) | `operations.launchDecision`, `operations.currentReadiness`, `documents.requirementEvidence`, `catalogue.currentGoverning`, `catalogue.impactFor`, `catalogue.declarationSupportFor`, `payments.servicePayment` (share), `payments.reserveExposure` (only for the fee-carrying act, Section 7.4), `payments.openFinancialException` (Gate 2 exception), consume `core_gate_exceptions` | B23, B27, B28: authorization and reservation commit together or not at all |
| `core.release_packet` (Core; rev 2, COV-03) | controls (`release_packet`, readiness gate), consume a readiness exception, `core_packet_releases`, `delivery.markPacketReleased` | B04, B18, B19, B34: Core accepts the release; Delivery records the packet state |
| `ops.request_packet_build` (Operations; rev 2) | `documents.requirementEvidence`, `delivery.requestPacketBuild` | B04 |
| `core.assign` / `core.reassign` (Core) | `identity.getAccount` (operator active), `payments.servicePayment` (share), consume Gate 1 exception, `payments.openFinancialException` (`work_under_gate1_exception`), `delivery.postNotice` | B18, B19, B26 |
| `ops.record_act_evidence`, `ops.record_reconciliation_attempt` (Operations) | `core.recordExternalActEvidence` → for the fee-carrying act: `payments.recordTmFeePaid` / `recordFeePaymentUnknown` / `recordFeeNotPaid` (rev 2, MON-01, record 15 CCR-15-02) | B23, B27 |
| `ops.record_official_result` (Operations) | `documents.registerVersion` (artifact bytes), Operations artifact row, `core.recordOutcomeFromEvidence` | B13, B21: only Core records the outcome |
| `dlv.record_handover` packet (Delivery) | `core.recordOutcomeFromEvidence('prepared_and_handed_over')` when the governing declaration's `outcomeEvidence.handover` is declared and satisfied; Core requires a `core_packet_releases` row | B04 |
| `intake.process_rows` record, `intake.start_individual` (Intake) | `core.acceptIntakeProposals` → `documents.associateFromProposal`, `payments.ensureApplicationState`, `catalogue.noteGoverningBehindHead`; correction rows `core.applyIntakeCorrection` | B14, B16 |
| `doc.associate`, `doc.replace_version` (Documents) | `core.noteEvidenceChanged` | B19 readiness invalidation |
| Every Core command that changes applicant identity fields (rev 2, record 14 CCR-12) | `documents.reevaluateForApplication` | B15, B19 |
| `doc.parse` record (Documents; rev 2, BND-13) | settled listeners: `intake.onDocumentSettled`; `operations.evaluateArtifactAssociation` for `official_result` | B13, B14 |
| `catalogue.impact_recheck` record (Catalogue; rev 2) | `core.recordContinuation`, `core.openStructuralTransition` (via C14), `core.proposePriceIncrease` | B06, B17 |
| `ops.report_wrong_recipient` (Operations) | `documents.blockVersion`, Operations artifact `blocked`, `delivery.postNotice` (correction notice to affected TA) | B13 |
| `dlv.retrieve_document` (Delivery) | `identity.getRecipient`, `core.getApplicationScope`, `documents.getVersionForRelease` (share), `operations.artifactEligibility` (share), `operations.blockingIncidents` | B12 |
| `harness.core.check_completion` (Core, harness) | `delivery.deliveryEvidence`, `operations.custodyState`, `operations.blockingIncidents`, `payments.servicePayment`, `documents` artifact state | B24, B25, B46 |
| `core.group_end_sweep` record (Core) | `payments.outstandingMoney`, `operations.custodyState`, `delivery.deliveryEvidence`, `intake.groupClosureBlockers` | B25 |
| `catalogue.impact_recheck` record (Catalogue) | `core.applyBaselinePriceReduction` → `payments.servicePayment`, `delivery.postNotice` | B06, B17 |
| `pay.record_service_status` (Payments) | `core.getControlState` (operator work started?), own financial exception writes | B26, B29 |

## 7. State machines

Every transition below is one command (or one task record step) in one SERIALIZABLE transaction, appends the named fact, and uses the named guard. A transition not listed is forbidden. "Controls(x)" means `core.evaluateControls` with controlled action `x` returns `allowed` (Section 8).

### 7.1 Group and application lifecycle (B03, B17, B21, B24, B25)

| From | To | Command (actor) | Guard and conditions |
|---|---|---|---|
| — | group `open` | `core.create_group` (TA) | country `listed`; travel start and return dates present (`return >= start`); drafts in the group still need launch admission |
| group `open` | `open` (dates changed) | `core.edit_travel_dates` (TA owner) | group revision; effects: `material_revision` +1 on every open application; readiness of assigned unfiled applications becomes `stale_basis` (filing/packet paused until reconfirmed); filed facts unchanged; enqueue `core.travel_date_recheck`; timing notices (B06, B17) |
| group `open` | `closed` (`ordinary`) | `core.close_group` (TA owner) or `core.group_end_sweep` | every application closed (`completed`/`ended_with_group`); `intake.groupClosureBlockers` = (0 open incidents, 0 active attempts) (rev 2, record 14 CCR-09); group row `FOR UPDATE` |
| — | `draft` | `core.acceptIntakeProposals` (individual form through `intake.start_individual`, and bulk rows; rev 2) | Controls(`create_draft`); group `open` (`FOR SHARE`); applicant key valid; `setApplicantKey`: open-scope unique index, and for a same-service later attempt the prior application of this scope is `completed` (not merely closed), the attempt carries an explicit fresh-intake declaration and authority, and no application of the scope has a `reconciliation_exhausted` act (B03, B23). Bulk intake never declares a later attempt (it opens an intake incident) |
| `draft` | `draft` | `core.edit_draft`, `core.correct_identity` | editor permits; revision; identity fields need same-person evidence (B19) |
| `draft` | `submitted` | `core.submit` (TA owner) | Controls(`submit`); editor state ∈ {`unassigned`, `returned_to_ta`}; an assigned case that is not returned refuses with `awaiting_formal_return`; confirmation presence or absence recorded truthfully; price from the governing baseline recorded as `quoted`; estimated window starts (B17) |
| `draft`/`submitted` | outcome `withdrawn` | `core.request_withdrawal` (TA), `core.record_applicant_withdrawal` (asg), `core.record_operational_withdrawal` (SuperAdmin) | Controls(`request_withdrawal`): no open external act (`filing_possibly_occurred`), evidenced cut-off not passed, TA requests only when unassigned or returned (B18, B23, B24); accepted ⇒ `core_withdrawals.accepted` unique; lifecycle unchanged. Rev 2 (BND-03): for a **submitted** application whose governing declaration has no supported `controls.withdrawalCutoff` (every real preparation-only offering: `parked_prep_only_cutoff`, B44), the request is refused with `withdrawal_cutoff_undeclared` (category `unavailable_parked` when it is the only blocker); packet release is **not** a cut-off. A draft (I-C1) is not assessed against a cut-off |
| `submitted` | outcome `issued`/`refused` | `ops.record_official_result` → `core.recordOutcomeFromEvidence` | `filed_evidenced` act for travelmudra_filed, or provider evidence for third_party_filed; outcome `NULL`; application revision |
| `submitted` | outcome `prepared_and_handed_over` | `dlv.record_handover` (packet) → Core | preparation_only; a `core_packet_releases` row (rev 2, COV-03); the governing declaration's `outcomeEvidence.handover` declared and satisfied |
| open | outcome `dependency_failed` | in the same transaction that records or **corrects** (rev 2, MON-06) the upstream's final outcome (Core evaluates each declared dependent under lock, ascending id) | B22: upstream final outcome incompatible with the declared requirement; dependent confirmed unfiled (rev 2, record 13 CCR-05: every `government_submission` and `provider_handoff` act is absent or `not_filed_evidenced`, and no act of any kind is `authorized`, `filing_unknown` or `reconciliation_exhausted`). A filed or filing-unknown dependent instead gets dependency state `failed_incompatible`, keeps protection and reconciliation, and its owner is the assigned operator or, if unassigned, SuperAdmin; a correction that turns a `met` dependency into `failed_incompatible` for a filed dependent opens an owned `official_fact_follow_up` incident. `external_outcome_unresolved` is not a final upstream outcome |
| `submitted` | outcome `cancelled` | `core.record_outcome` (asg) | only where the governing declaration declares a cancellation path with evidence; else `unavailable_parked` (`cancellation_undeclared`) |
| `submitted` | outcome `external_outcome_unresolved` | `core.authorize_unresolved_completion` (SuperAdmin) | act `filing_unknown`; ≥ 1 recorded reconciliation attempt; reason; TA notice posted; future owner named; act → `reconciliation_exhausted` (B23) |
| outcome X | outcome X' | `core.correct_from_evidence` (SuperAdmin) | only before completion and before any delivery release depending on the outcome; evidence + reason; fact `core.outcome_corrected` preserves the original; rev 2 (MON-06): the same transaction re-evaluates every dependency of the corrected application from its stored state, including `met` (row above); otherwise an owned incident (B18, B19) |
| open | `completed` | `harness.core.check_completion` (harness only; B46) | outcome present; declared outcome/delivery/completion evidence present; no held original (B24, B30); no artifact block or failed validation; no open `filing_unknown`; rev 2 (MON-09): **not** when payment status ≠ `payment_received` and `operator_work_ever_authorized = false` (B25: such an application stays open until its group's return date and ends only through the sweep; blocker `group_end_pending`); `UNIQUE core_completions(application_id)` |
| open | `ended_with_group` | `core.group_end_sweep` record step | `calendar.dateOf(now) > travel_return_date`; clock health ok; payment status ≠ `payment_received`; `operator_work_ever_authorized = false`; no external act ever authorized; no held/uncertain original; no pending delivery; `payments.outstandingMoney = false`; no active protection mark; history retained (B25). Rev 2 (REC-13): the sweep pages with an `afterApplicationId` cursor (record 13 §5.1) |

Rules:
- Outcome and lifecycle are independent columns. Only Core writes them (B21).
- An application with outcome `withdrawn`, `cancelled` or `dependency_failed` and no operator work stays open until completion evidence or the B25 sweep (B25).
- A closed application never reopens. A later same-service attempt is a new application with fresh intake (B03).

### 7.2 Assigned-editor sub-state (B18, B19)

| From | To | Command (actor) | Guard |
|---|---|---|---|
| `unassigned` | `assigned` | `core.assign` (SuperAdmin) | lifecycle `submitted`; Controls(`assign`) incl. Gate 1; operator active + MFA; unique active assignment |
| `unassigned` | `assistance_in_progress` | `core.assign` with approved assistance (SuperAdmin) | approved `core_assistance_requests`; Controls(`assign`) incl. Gate 1 (B18) |
| `assistance_in_progress` | `returned_to_ta` | `core.formal_return` (asg) | opens `ret` hold |
| `assigned` | `returned_to_ta` | `core.formal_return` (asg) | opens `ret` hold; same operator retained |
| `returned_to_ta` | `assigned` | `core.hand_back` (TA owner) or `core.submit` (draft after assistance) | closes `ret` hold; hold_revision +1 ⇒ readiness must be reconfirmed |
| `assigned`/`assistance_in_progress` | + `problem_reported` | `core.report_problem` (TA owner) | not returned; changes no application data; opens `prb` hold |
| + `problem_reported` | − | `core.resolve_hold` (asg) | resolution note; closes hold; hold_revision +1 ⇒ reconfirmation required |
| `assigned` | + `flagged_to_superadmin` | `core.flag` (asg) | opens `flg` hold |
| + `flagged_to_superadmin` | − | `core.respond_flag` (SuperAdmin), then `core.resolve_hold` (asg) | SuperAdmin response recorded first; only the assigned operator closes the hold; reconfirmation required |
| any assigned | any assigned (new operator) | `core.reassign` (SuperAdmin) | Controls(`reassign`) (rev 2: launch stage not applied, record 13 CCR-04); reason; old assignment `ended`; Gate 1 evaluated again; unresolved duties transfer (holds, open acts' `reconciliation_owner_id`, incidents owned by the old operator through `operations.transferApplicationDuties`); originals do not move (B19) |
| any assigned | `unassigned` | completion / group end only | assignment `ended` with `ended_reason` |

TA permissions per state are in Section 2.9. Ordinary operator action never edits application information; only `assistance_in_progress` permits `operator.assistance_entry` (B18).

### 7.3 Readiness (B18, B19, B06)

| From | To | Command (actor) | Guard |
|---|---|---|---|
| none / `current` | `current` (new), old → `superseded` | `ops.record_readiness` (asg) | Controls(`record_readiness`): lifecycle `submitted`, editor `assigned`, no open hold, mandatory validations pass, impact resolved; stores `core.readinessBasis` fingerprint and `assignment_id`; unique current |
| `current` | `withdrawn` | `ops.withdraw_readiness` (recording operator) | — |

Validity is derived at use (no cross-owner invalidation writes):

| Derived validity | Condition |
|---|---|
| `missing` | no `current` judgement |
| `held` | any open hold |
| `stale_basis` | stored fingerprint ≠ live `core.readinessBasis` |
| `previous_operator` | fingerprint equal, `assignment_id` ≠ current assignment |
| `valid` | otherwise |

Fingerprint inputs (SHA-256 over canonical JSON): `material_revision`, `hold_revision`, `documents.evidenceFingerprint`, governing ids, catalogue impact state and item ids, dependency states and evidence ids, travel dates, latest act state per kind (a `not_filed_evidenced` act changes the basis, B23), active protection mark flag; rev 2 (record 13 CCR-14): group `dates_revision` and the application's `dates_checked_revision`, the count of held or released corrections, any open `material_scope_change` price record id, and for `preparation_only` the current built packet id and `sha256`. SuperAdmin correction and every TA correction change `material_revision` (B19). A SuperAdmin cannot record readiness (B18).

### 7.4 External act (B23, B27, B28)

| From | To | Command (actor) | Guard |
|---|---|---|---|
| — | `authorized` | `core.authorize_external_act` (asg) | Controls(`authorize_government_submission` / `authorize_government_fee_payment` / `authorize_provider_handoff`); partial unique open act per (application, kind); exposure reservation in the same commit for the fee-carrying act; reconciliation owner = asg |
| `authorized` | `filed_evidenced` | `ops.record_act_evidence` → Core | evidence (receipt); fee-carrying act: `payments.recordTmFeePaid` with the exact paid amount (required); `government_attempt_no` +1 on government submission |
| `authorized` | `not_filed_evidenced` | same | positive non-execution evidence; fee-carrying act: `payments.recordFeeNotPaid`; readiness basis changes; a fresh authorization goes through Controls again (including Gate 2, Section 2.11) and reuses the unconverted reservation of the same logical effect |
| `authorized` | `filing_unknown` | same | attempt evidence (timeout, ambiguous response); fee-carrying act ⇒ `recordFeePaymentUnknown` |

Rev 2 — fee-carrying act (MON-01, COV-02). `core.feeCarryingAct(decl)` is pure and is the only source of the rule:

| Governing `financialConditions.governmentFee` (Section 9.2) | Fee-carrying act | Effect |
|---|---|---|
| `{ payer: 'travelmudra', timing: 'separate_act' }` | `government_fee_payment` | the fee act reserves exposure (`feeAmountPaise` required) and records the fee; the submission act carries no fee |
| `{ payer: 'travelmudra', timing: 'with_submission' }` | `government_submission` | the submission act reserves exposure (`feeAmountPaise` required) and records the fee; a `government_fee_payment` authorization is refused with `fee_act_not_declared` |
| `'no_government_fee'` | none | no reservation, no fee record; a `government_fee_payment` authorization is refused with `fee_act_not_declared` |
| `'not_handled_by_travelmudra'` (other modes, owner-approved) | none | as above; such offerings have no government acts anyway |
| unresolved or missing | — | every government authorization is blocked with `declaration_item_unresolved` |

The authorization stores `carries_fee`, `attempt_ordinal` and (iff it carries the fee) `logical_effect_key = govfee:<application>:<attempt ordinal>` and `reservation_id`. Act-evidence writers call the Payments fee writers for the act with `carries_fee = true`, whatever its kind. Gate 2 applies to every government act of `travelmudra_filed` under the rule of Section 2.11; it is independent of which act carries the fee.
| `filing_unknown` | `filed_evidenced` / `not_filed_evidenced` | same | reconciliation evidence |
| `filing_unknown` | `reconciliation_exhausted` | `core.authorize_unresolved_completion` (SuperAdmin) | Section 7.1 row; never grants refiling |

While any act of an application is `authorized`, `filing_unknown` or `reconciliation_exhausted`: no new authorization of the same kind, no ordinary withdrawal, corrections and catalogue impacts are recorded but held separately (not applied to filing), no repeat payment (B23). Timeout, payment, handoff, courier receipt, reassignment and elapsed time never change act state.

### 7.5 Launch control (B07)

| From | To | Command (SuperAdmin) | Guard |
|---|---|---|---|
| `not_launched` | `launched` | `ops.approve_launch` | catalogue `published`; `catalogue.currentGoverning` ok (supported declaration + binding); readiness evidence (B32 measure set, support/escalation, capacity, fallback) attached; reason; `ops_offering_controls` `FOR UPDATE` |
| `launched` | `launched` (wider audience) | `ops.expand_launch_scope` | same evidence for the added scope |
| suspension `none` | `active` | `ops.suspend_offering` | reason, evidence; treatment `continue`/`hold`/`missing` (default `missing` ⇒ hold of unfiled preparation, packet release, filing) |
| suspension `active` | `active` (treatment) | `ops.record_existing_work_treatment` | compatible treatment recorded |
| suspension `active` | `none` | `ops.lift_suspension` | restores exactly `restores_launch_id` scope; no widening |
| withdrawal `none` | `effective` | `ops.withdraw_offering` | reason; `permits_unfiled_continuation` explicit; terminal; no re-launch command exists in this build |

Per-action effect: Section 2.14. Conflict rule: compute the effect of each applicable control and take the most restrictive (`refuse` > `hold` > `allow`) per action. A structural change to a launched, unsuspended offering applies to new cases at deployment without a new launch approval (B06).

### 7.6 Intake attempt and row (B14, B16)

| From | To | Trigger | Guard |
|---|---|---|---|
| — | `received` | `intake.start_*` (TA) | Controls(`start_intake`) for each offering named; bot/rate controls before expensive intake (B08); group open and owned; catalogue snapshot recorded |
| `received` | `preflight` | task `intake.fetch_source` / upload referenced | SSRF-safe fetch; size and count limits |
| `preflight` | `preflight_failed` | task `intake.preflight` | unsafe or unreadable prerequisite; no application mutation |
| `preflight` | `awaiting_answer` | `intake.parse_sheet` | consequential mapping ambiguity; question opened |
| `awaiting_answer` | `processing` | `intake.answer_question` (TA) | attempt revision |
| `preflight` | `processing` | `intake.parse_sheet` | row pattern determined (`mixed_refused` ⇒ `awaiting_answer`) |
| `processing` | `paused_mapping_fault` | `intake.process_rows` | systematic fault: all affected rows pause; accepted rows stay |
| `processing` | `paused_actor_revoked` | task prepare | origin TA lost access |
| `processing` | `fully_processed` | `intake.process_rows` | every row has a result |
| non-terminal | `abandoned` | `intake.abandon` (TA) | accepted rows and applications stay |
| `received` | `processing` | `intake.start_individual` (rev 2, record 14 CCR-11) | individual form: one row, accepted in the starting transaction |
| `awaiting_answer` / `paused_mapping_fault` | `abandoned` (`superseded_by_correction`) | `intake.correction_upload` (rev 2) | the correction attempt supersedes the paused root |

Row: `pending` → `processing` → one of `accepted` (drafts created; `intake_row_effects` rows), `matched_existing` (open-scope guard hit; no overwrite), `incident_open`, `failed` (unreadable; retryable via correction), `excluded` (unrelated). A correction attempt (`corrects_attempt_id`) touches only explicitly matched changed or failed rows; omitted rows become `untouched_by_correction` in the correction's results and keep their prior effect; new applicants go to separate intake. A correction row change is all-or-nothing with the target application's current revision, evidence, before/after and actor (B16). An Nth identical retry resolves through `intake_row_effects` and the open-scope index to the same applications.

### 7.7 Document version (B12, B15, B36)

| From | To | Trigger | Guard |
|---|---|---|---|
| — | `quarantined` | `documents.registerVersion` | blob referenced (conditional); move to quarantine requested |
| `quarantined` | `safety_checking` | `doc.scan` prepare | — |
| `safety_checking` | `safety_rejected` | `doc.scan` record | size > limit, magic type not allowed or ≠ declared, clamd FOUND ⇒ bytes `disposed` |
| `safety_checking` | `safety_retry_wait` | `doc.scan` fail | clamd unavailable/timeout (fail closed) |
| `safety_checking` | `safety_passed` | `doc.scan` record | clamd OK; enqueue `doc.parse` |
| `safety_passed` | `extracting` → `processed` / `manual_resolution_required` / `extraction_failed` / `safety_rejected` | `doc.parse` | sandboxed structural check (qpdf active content, sharp full decode) then extraction; low confidence/conflict ⇒ manual |
| structural pass (`content_safe = true`; rev 2, record 14 CCR-02) | bytes `canonical` | `blob.publish_canonical` | integrity verified after move; independent of the extraction result (`processed`, `manual_resolution_required` or `extraction_failed`) |
| `manual_resolution_required` | `processed` | `doc.resolve_extraction` (TA on draft/returned, asg in assistance) | new current extraction verdict; strong-identifier conflicts stay incidents |
| any | `excluded_unrelated` | classification | no association; bytes disposed |
| currency `current` | `replaced` | `doc.replace_version` | earlier eligibility ends; `core.noteEvidenceChanged` |
| currency `current` | `blocked` | `documents.blockVersion` | disclosure/integrity incident |
| bytes any | `unavailable` | `documents.markBytesUnavailable` | owner and next action recorded; incident `bytes_integrity` |

### 7.8 Delivery attempt (B12, B31, B46)

Document email:

| From | To | Trigger | Guard |
|---|---|---|---|
| — | `queued` | `harness.dlv.queue_document_email` (harness only, B46) or `dlv.manual_resend` (asg, from `failed`) | `UNIQUE (resend_of)`; recipient snapshot = owning TA current email |
| `queued` | `denied_at_check` | `mail.deliver` prepare | `checkRelease` per attached version denies. Rev 2 (record 11 CCR-12 rejected): the recipient snapshot is refreshed at prepare to the owning TA's **current** account email (record 15 I-15-05; B31 "current account email"; a completed two-proof change, B09, already proved the new address); there is no `recipient_changed` denial |
| `queued` | `sending` | `mail.deliver` prepare | release checks recorded; `effect_started_at` committed |
| `sending` | `accepted` / `synthetic_accepted` / `failed` / `uncertain` | `mail.deliver` record | transport result |
| `sending` | `uncertain` | lease lost / crash ⇒ `recordUncertain` | never resent automatically |

Web retrieval and bulk selection: `checkRelease` (row `allowed`/`denied`) → stream → `recordReleaseResult` (`streamed`, `stream_failed`, `unavailable`). Bulk selection records one item result per file (`included`, `unavailable`, `failed`) and never substitutes another artifact (B12). A change after the check and before the end of that file's send is the accepted interval (B12 OWNER_DECISION); no send lock.

### 7.9 Incidents (B13, B16)

Operations incident: `open` → `assigned` (owner set: assigned operator by default; SuperAdmin assigns a reviewer without filing authority when none is assigned) → `awaiting_evidence` ⇄ `assigned` → `resolved` (resolution evidence required; `wrong_recipient_disclosure` requires correction evidence and notice evidence) → `closed`. Closure is independent of application completion; a completed application MAY keep an open incident (B25). An open operational incident alone does not hold completion; an artifact block or failed validation does (B24).

Intake incident: `open` → `resolved_by_correction` (correction attempt) | `resolved_by_ta_abandonment` (TA abandons the source row) | `dismissed_by_superadmin` (reasoned). No disposition cancels an existing application (B16).

### 7.10 Financial exception (B26, B29)

| From | To | Trigger | Guard |
|---|---|---|---|
| — | `open` (`work_under_gate1_exception`) | `core.assign` consuming a Gate 1 exception while payment ≠ `payment_received` | unique (application, kind, gex id) |
| — | `open` (`commitment_under_gate2_exception`) | `core.authorize_external_act` consuming a Gate 2 exception | unique |
| — | `open` (`payment_corrected_after_work` / `worked_then_corrected_to_unpaid`) | `pay.record_service_status` correction after `operator_work_ever_authorized` | unique (application, kind, entry id) |
| `open` | `closed_collected` | `pay.record_service_status` = `payment_received` | evidence; fact references the entry |
| `open` | write-off | — | unselected (B29): no command; visible `unavailable_owner_decision` |

An open exception survives completion; it never moves the completion event or fabricates payment/override history (B29). The accountable SuperAdmin sees a persistent staff notice while it is open (the "nudge"); Accounts actions stay PARKED.

### 7.11 B46 boundary (delivery send and completion check)

- No product route, task or event starts a document email send, a `result_available` notice or a completion check. `harness.dlv.queue_document_email`, `harness.dlv.post_result_notice` and `harness.core.check_completion` exist as commands registered only in the test environment and in the labelled local test harness (`tm harness …`), run by actor kind `harness` (rev 2, record 13 CCR-07), each fact marked with `command_name` prefixed `harness.`.
- Every application whose remaining duty is one of these shows `pending_on_action.ownerKind = 'unresolved_known_limitation'` with reason `delivery_send_trigger_unselected` or `completion_check_trigger_unselected`.
- `uncertain` email results show `uncertain_email_handling_unselected`. `operator.manual_resend` is available only from `failed`.

## 8. Control evaluation (B20, B07, B18, B19, B22, B23, B24, B26–B28)

### 8.1 Function

```ts
// src/modules/core/controls.ts — the single evaluator; every consequential command calls it inside its own transaction
export function evaluateControls(tx: ReadTx, req: ControlRequest): Promise<ControlResult>;
export function requireControls(tx: WriteTx, req: ControlRequest): Promise<ControlResult>;   // throws TmError('control_blocked', firstCode, { blockers }) unless allowed
export const canSelectOffering = (tx: ReadTx, actor: Actor, offeringId: OfferingId) => evaluateControls(tx, { action: 'select_offering', actor, offeringId });
export const canSubmit = (tx: ReadTx, actor: Actor, applicationId: ApplicationId) => evaluateControls(tx, { action: 'submit', actor, applicationId });
export const canAssign = (tx: ReadTx, actor: Actor, applicationId: ApplicationId) => evaluateControls(tx, { action: 'assign', actor, applicationId });
export const canStartOperatorWork = (tx: ReadTx, actor: Actor, applicationId: ApplicationId) => evaluateControls(tx, { action: 'start_operator_work', actor, applicationId });
export const canAuthorizeFiling = (tx: ReadTx, actor: Actor, applicationId: ApplicationId, kind: ExternalActKind, feeAmountPaise?: Paise) =>
  evaluateControls(tx, { action: kind === 'government_submission' ? 'authorize_government_submission' : kind === 'government_fee_payment' ? 'authorize_government_fee_payment' : 'authorize_provider_handoff', actor, applicationId, externalActKind: kind, ...(feeAmountPaise === undefined ? {} : { feeAmountPaise }) });
export const canReleasePacket = (tx: ReadTx, actor: Actor, applicationId: ApplicationId) => evaluateControls(tx, { action: 'release_packet', actor, applicationId });
```

- Pages call the `can*` helpers in a read transaction only to render availability and reasons. The command MUST call `requireControls` again inside its SERIALIZABLE transaction with the guard rows locked (Section 11). A page result never authorizes.
- Inputs read: actor state (Identity), application control state (Core, locked by the command), launch decision (Operations), governing ids and binding status (Catalogue), impact state (Catalogue), requirement evidence (Documents), readiness (Operations), payment status (Payments, `FOR SHARE`), exposure (Payments, `FOR UPDATE` only inside `reserveExposure`), gate exceptions (Core), dependencies (Core), artifacts, custody and incidents (Operations), delivery evidence (Delivery).
- Projections are never inputs (B35).

### 8.2 Ordered stages

The evaluator runs the stages in order. Stages 1–2 stop evaluation on failure (no information leak). Stages 3–13 all run and collect every blocker, so the UI shows all reasons at once. `allowed = blockers.length === 0`.

| # | Stage | Control kind | Blocker codes |
|---|---|---|---|
| 1 | Actor and relation for the action (policy relation re-check) | shared_tenet | `not_found_or_forbidden` (thrown, not a blocker), `assigned_operator_inactive` |
| 2 | Installation admission | shared_tenet | `installation_closed` |
| 3 | Protection mark (B40) | shared_tenet | `protection_mark_active` |
| 4 | Launch control per action (B07) | shared_tenet | `offering_not_launched`, `offering_out_of_launch_scope`, `offering_suspended`, `existing_work_treatment_missing`, `existing_work_hold`, `offering_withdrawn`, `withdrawal_continuation_not_permitted`, `catalogue_not_published` |
| 5 | Declaration and binding support (B05, B39) | shared_tenet | `declaration_unsupported`, `declaration_incomplete`, `declaration_item_unresolved`, `owner_approval_required` (rev 2), `binding_missing`, `binding_incompatible`, `transition_pending` |
| 6 | Lifecycle, mode and applicability | shared_tenet | `group_closed`, `application_not_open`, `application_not_draft`, `application_not_submitted`, `outcome_already_recorded`, `withdrawal_accepted`, `service_mode_not_applicable`, `fee_act_not_declared` (rev 2), `provider_route_unapproved`, `cancellation_undeclared`, `assistance_not_approved`, `already_assigned`, `operator_not_assignable`, `deferral_active`, `operator_work_not_started`, `parked_repeat_external_act` (rev 2, record 13 CCR-09) |
| 7 | Assigned-editor rules (B18) | shared_tenet | `awaiting_formal_return`, `hold_problem_reported`, `hold_returned_to_ta`, `hold_flagged_to_superadmin`, `hold_assistance_in_progress` |
| 8 | External uncertainty protection (B23) | shared_tenet | `filing_possibly_occurred`, `act_already_open`, `reconciliation_exhausted_no_refiling`, `fee_payment_unknown`, `correction_historical_after_filing` (rev 2) |
| 9 | Evidenced cut-offs (B24) | evidenced_cutoff | `withdrawal_cutoff_passed`, `withdrawal_cutoff_undeclared`, `declared_cutoff_passed` |
| 10 | Mandatory validations (B15, B22, B13, B30, B12, B02) | mandatory_validation | `mandatory_document_missing`, `document_unreadable`, `document_unclassified`, `document_unassociated`, `document_safety_pending`, `document_validity_failed`, `document_validity_unknown`, `document_blocked`, `identity_conflict_unresolved`, `population_out_of_scope`, `population_declaration_missing` (rev 2), `dependency_outcome_unmet`, `dependency_evidence_missing`, `artifact_not_eligible`, `custody_evidence_missing`, `bytes_unavailable`, `renewed_authority_pending`, `renewed_authority_declined`, `packet_not_built`, `packet_stale` (rev 2) |
| 11 | Catalogue impact and date rechecks (B06) | mandatory_validation | `catalogue_impact_unknown`, `catalogue_impact_hold`, `travel_date_recheck_pending` |
| 12 | Gates (B26, B27, B18, B19) | gate | `gate1_payment_not_received`, `gate2_payment_not_received`, `readiness_missing`, `readiness_stale`, `readiness_held`, `readiness_previous_operator` (only this readiness code is exception-eligible) |
| 13 | TA-wide exposure (B28) | shared_tenet | `exposure_ceiling_breach`, `exposure_parked_paid_case_default_ceiling` |

### 8.3 Stage applicability per controlled action

`●` stage applies; `—` not applicable. Stage 1–2 apply to all.

| Action | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `select_offering`, `start_intake`, `create_draft` | — | ● refuse rows | ● (current head) | ● group open | — | — | — | population: `population_out_of_scope` **only on positive out-of-scope evidence** (nationality ≠ IND, issuing state ≠ IND, document code not ordinary, declared residence outside India); unknown values create the draft (rev 2, record 14 CCR-07, B14) | — | — | — |
| `submit` | ● | ● | ● | ● draft | ● | — | — | ● declared submit-time validations (`decl/1 controls.submitChecks`; undeclared ⇒ `declaration_item_unresolved`); rev 2: any missing population value ⇒ `population_declaration_missing` (no default inferred) | ● (with `cat_offerings` locked `FOR SHARE`, record 12 CCR-16) | — | — |
| `request_assistance` | ● | ● | ● | ● open | ● | — | — | — | — | — | — |
| `assign` | ● | ● | ● | ● submitted or approved assistance; operator active | — | — | — | — | — | Gate 1 | — |
| `reassign` (rev 2, record 13 CCR-04) | ● | — | — | ● open; operator active | — | — | — | — | — | Gate 1 | — |
| `start_operator_work`, `assistance_entry`, `record_readiness` | ● | ● | ● | ● | ● (assistance_entry requires `assistance_in_progress`) | — | — | record_readiness: ● | record_readiness: ● (offering locked `FOR SHARE`) | assignment basis (Gate 1 passed or excepted at assignment; OD-R2-02) | — |
| `authorize_government_submission`, `authorize_government_fee_payment` | ● | ● | ● | ● submitted, mode travelmudra_filed; fee act only when it is the declared fee-carrying act (`fee_act_not_declared`) | ● | ● | — | ● | ● (offering locked `FOR SHARE`) | Gate 2 (Section 2.11 rule: evaluated unless a commitment of the current attempt may have happened) + readiness gate | ● for the fee-carrying act |
| `authorize_provider_handoff` | ● | ● | ● | ● third_party_filed + approved provider route | ● | ● | — | ● | ● | readiness gate | — |
| `release_packet` | ● | ● | ● | ● preparation_only | ● | — | — | ● | ● | readiness gate | — |
| `record_outcome` | — | — | — | ● | — | `dependency_failed` only: ● | — | outcome evidence | — | — | — |
| `request_withdrawal` | ● | — | — | ● | TA only: ● | ● | ● | — | — | — | — |
| `release_bytes`, `send_document_email` | ● | — | — | — | — | — | — | artifact/bytes/association | — | — | — |
| `complete`, `end_with_group` | — | — | — | ● | — | ● | — | artifact, custody | — | — | — |
| `correct_application`, `edit_travel_dates` | ● | — | — | ● | ● | ● (correction held separately while filing unknown) | — | identity evidence | — | — | — |

### 8.4 Reason codes

```ts
export const REASON_CODES = [
  // stages 1–13 (Section 8.2)
  'assigned_operator_inactive','installation_closed','protection_mark_active',
  'offering_not_launched','offering_out_of_launch_scope','offering_suspended','existing_work_treatment_missing','existing_work_hold',
  'offering_withdrawn','withdrawal_continuation_not_permitted','catalogue_not_published',
  'declaration_unsupported','declaration_incomplete','declaration_item_unresolved','binding_missing','binding_incompatible','transition_pending',
  'group_closed','application_not_open','application_not_draft','application_not_submitted','outcome_already_recorded','withdrawal_accepted',
  'service_mode_not_applicable','provider_route_unapproved','cancellation_undeclared','assistance_not_approved','already_assigned','operator_not_assignable',
  'awaiting_formal_return','hold_problem_reported','hold_returned_to_ta','hold_flagged_to_superadmin','hold_assistance_in_progress',
  'filing_possibly_occurred','act_already_open','reconciliation_exhausted_no_refiling','fee_payment_unknown',
  'withdrawal_cutoff_passed','withdrawal_cutoff_undeclared','declared_cutoff_passed',
  'mandatory_document_missing','document_unreadable','document_unclassified','document_unassociated','document_safety_pending',
  'document_validity_failed','document_validity_unknown','document_blocked','identity_conflict_unresolved','population_out_of_scope',
  'dependency_outcome_unmet','dependency_evidence_missing','artifact_not_eligible','custody_evidence_missing','bytes_unavailable',
  'catalogue_impact_unknown','catalogue_impact_hold','travel_date_recheck_pending',
  'gate1_payment_not_received','gate2_payment_not_received','readiness_missing','readiness_stale','readiness_held','readiness_previous_operator',
  'exposure_ceiling_breach','exposure_parked_paid_case_default_ceiling',
  // gate exception handling
  'gate_not_blocking','gate_exception_not_eligible','gate_exception_stale','gate_exception_consumed','gate_exception_expired','gate_exception_grantor_inactive',
  // deliberate boundaries (category unavailable_*)
  'parked_reservation_release','parked_fee_exclusion_record','parked_accounts_actions','parked_custody_route_policy','parked_first_admin',
  'parked_lost_mailbox_recovery','parked_provider_route','parked_cancellation','unselected_write_off','unselected_refund',
  'excluded_payment_gateway','excluded_applicant_portal','excluded_automated_filing','delivery_send_trigger_unselected',
  'completion_check_trigger_unselected','uncertain_email_handling_unselected','real_mail_transport_unselected',
  // generic
  'invalid_id','expected_one_row','no_fact_appended','stale_revision','duplicate_open_scope','duplicate_operation','blob_not_referenceable','audit_degraded',
  'scanner_unavailable','worker_timeout','worker_failed','capacity_storage','capacity_queue','capacity_connections','rate_limited',
  'bot_check_failed','otp_invalid_or_expired','session_expired','fact_owner_mismatch','fault_injection_disabled','unexpected',
  // rev 2 — identity (record 11 CCR-17)
  'email_invalid','email_in_use','email_unchanged','email_change_open','email_change_address_unavailable','synthetic_email_refused',
  'enrolment_invalid_or_expired','totp_invalid','second_superadmin_required','self_action_not_allowed','elevation_requester_inactive',
  'elevation_target_has_duties','elevation_expired','last_superadmin_ack_required','grantee_not_operator','grant_duration_exceeded',
  'grant_limit_reached','grant_exists','support_view_active','support_view_target_not_eligible','clock_degraded','csrf_invalid','origin_invalid',
  'host_invalid','unselected_account_eligibility','staff_email_change_unavailable','synthetic_seed_refused','synthetic_accounts_present',
  // rev 2 — catalogue and launch (record 12 CCR-02)
  'listing_unchanged','binding_already_registered','country_code_taken','slug_taken','offering_identity_taken','offering_retired',
  'declaration_version_conflict','declaration_not_draft','declaration_draft_open','owner_approval_scope_mismatch','item_unsupported_needs_release',
  'binding_unavailable_in_release','baseline_field_not_business_value','baseline_incompatible','baseline_not_editable','baseline_draft_exists',
  'baseline_already_published','preview_missing','preview_stale','continuation_policy_missing','mistaken_price_evidence_missing',
  'impact_item_not_current','impact_decision_not_allowed','continuation_unsupported','transition_evidence_missing','statement_narrows_scope',
  'release_not_active','release_catalogue_already_registered','nothing_to_recheck','retire_requires_not_launched','accountable_superadmin_inactive',
  'synthetic_not_permitted','unselected_price_fee_formula','unselected_other_mode_fee','parked_prep_only_cutoff','travel_rule_too_late_to_submit',
  'travel_rule_too_early_to_submit','travel_rule_unknown','launch_plan_incomplete','launch_plan_not_current','launch_already_current',
  'launch_audience_not_wider','launch_audience_invalid','launch_acknowledgement_mismatch','launch_item_not_supported','suspension_active',
  'suspension_not_active','offering_already_withdrawn','withdrawal_permission_required','withdrawal_treatment_widening_unavailable',
  'treatment_unchanged',
  // rev 2 — core and operations (record 13 CCR-09)
  'act_evidence_insufficient','act_state_transition_invalid','act_authorized','artifact_cross_group','artifact_type_already_eligible',
  'assignment_batch_too_large','assistance_approved','assistance_request_open','assistance_requested','authorization_basis_changed',
  'awaiting_assignment','awaiting_external_result','clock_unhealthy','completion_evidence_missing','compliance_notice_unselected',
  'correction_historical_after_filing','country_not_listed','custody_path_not_declared','deferral_active','deferral_proposed',
  'delivery_evidence_missing','dependency_cycle','dependency_undeclared','draft_incomplete','failure_scope_evidence_missing','filing_not_evidenced',
  'flag_already_responded','flag_response_missing','forecast_window_invalid','group_dates_invalid','group_end_pending','group_has_open_applications',
  'group_intake_incidents_open','held_correction_conflict','held_correction_released','hold_not_applicable','hold_not_operator_closable',
  'identity_field_requires_correction','identity_same_person_evidence_insufficient','incident_evidence_insufficient',
  'later_attempt_declaration_required','offering_country_mismatch','operator_work_not_started','original_already_recorded','original_held',
  'outcome_correction_not_allowed','outcome_missing','packet_not_built','packet_released','packet_stale','parked_preparation_dependency_evidence',
  'parked_preparation_post_handover','parked_repeat_external_act','preparation_only_holds_no_originals','price_changed',
  'price_decision_awaits_return','price_decision_pending','price_increase_open','problem_report_open','readiness_basis_changed','ready',
  'reconciliation_attempt_missing','renewed_authority_declined','renewed_authority_pending','round_robin_plan_mismatch','step_undeclared',
  'ta_confirmation_absent','withdrawal_evidence_missing','work_already_started',
  // rev 2 — intake and documents (record 14 CCR-11)
  'source_url_unsupported','folder_provider_unsupported','source_format_unsupported','source_too_large','source_unsafe','source_unreadable',
  'source_fetch_failed','source_already_ingested','link_not_public_or_not_file','header_not_found','too_many_rows','too_many_files','aggregate_limit',
  'cell_too_long','row_pattern_mixed','awaiting_correction_upload','systematic_mapping_fault','applicant_key_missing',
  'identity_requires_manual_resolution','identity_source_unavailable','identity_conflict_in_batch','strong_identifier_conflict','name_mismatch',
  'dob_mismatch','duplicate_in_batch','possible_duplicate_existing','service_missing','service_label_unmapped','group_mismatch',
  'not_an_applicant_row','date_invalid','passport_number_invalid','country_code_invalid','offering_not_in_country','requirement_not_declared',
  'new_applicant_separate_intake','correction_target_not_draft','correction_not_applicable','correction_file_rejected','stale_target_revision',
  'identity_change_requires_evidence','attempt_in_progress','attempt_terminal','attempt_not_awaiting_answer','answer_not_offered',
  'not_latest_attempt','abandoned_by_ta','superseded_by_correction','incident_not_open','processing_pending','document_unsafe','document_too_large',
  'format_not_accepted_by_offering','size_not_accepted_by_offering','classification_unconfirmed','extraction_manual_resolution_required',
  'extraction_already_verified','manual_contradicts_check_digit','other_person_document_not_declared','other_person_document_is_applicant',
  'version_not_eligible','version_associated','mrz_not_found','mrz_check_digit_failed','mrz_low_confidence','extraction_tool_failed','malware_found',
  'pixel_limit','zip_limit','country_adapter_error','population_declaration_missing','internal_retry_exhausted','url_invalid','scheme_not_https',
  'credentials_in_url','port_not_allowed','host_not_public','dns_failed','connect_blocked_private','tls_failed','redirect_limit',
  'redirect_not_allowed','http_status','too_large','fetch_timeout','unexpected_encoding','not_a_file','pdf_unreadable','pdf_encrypted',
  'image_unreadable','spreadsheet_unreadable','listing_unreadable','ocr_failed','limit_exceeded',
  // rev 2 — payments and delivery (record 15 CCR-15-03, -12)
  'payment_entry_kind_invalid','correction_target_not_current','correction_no_change','correction_fork','ceiling_not_lower','ceiling_not_higher',
  'ceiling_increase_already_requested','ceiling_request_not_open','self_approval_forbidden','requester_inactive','ceiling_changed_since_request',
  'fee_already_paid_for_effect','fee_state_changed','follow_up_owner_not_eligible','follow_up_owner_inactive','recipient_inactive',
  'recipient_not_owning_ta','recipient_access_revoked','version_replaced','version_blocked','version_not_processed','association_not_positive',
  'packet_not_released','packet_superseded','packet_constituent_unavailable','packet_exists','packet_handed_over','packet_not_ready',
  'handover_exists','handover_evidence_missing','incident_block','ack_not_required','already_acknowledged','resend_source_not_failed','resend_exists',
  'selection_too_large','selection_aborted','capacity_streams','capacity_statement_timeout','stream_failed','assignment_changed','evidence_changed',
  // rev 2 — review fixes (revision 2)
  'fee_act_not_declared','owner_approval_required','parked_dependency_external_evidence','lease_expired_exhausted','restore_boundary',
  'blob_move_failed','review_channel_not_applicable','capacity_predicate_locks','item_value_not_permitted',
] as const;
// CLI-only codes (record 15 CCR-15-12) live in a separate closed set in src/cli: release_tree_dirty, schema_incompatible,
// restore_target_not_empty, reopen_approval_missing, backup_requires_closed_writers, closed_for_other_reason,
// restore_scope_incomplete, restore_prerequisite_missing, checkpoint_in_use.
export type ReasonCode = typeof REASON_CODES[number];
```

Module designs MAY append module-specific codes through a revision of this list. Every code has one user-facing message per surface in `src/web/messages.ts`; messages never include personal data.

### 8.5 Gate exceptions

| Property | Rule |
|---|---|
| Who | One active SuperAdmin, individually attributed, reason required (≥ 10 characters), audited fact `core.gate_exception_granted` (B11, B20). |
| Scope | Exactly one application, one gate, one action key: Gate 1 → `assign` (also used by `reassign`); Gate 2 → `first_government_commitment`; readiness gate → `authorize_government_submission` \| `authorize_government_fee_payment` \| `authorize_provider_handoff` \| `release_packet`. |
| Eligibility at grant | The gate currently blocks (`gate_not_blocking` otherwise). Gate 2 only for `travelmudra_filed`, and (rev 2, MON-03) only while no government commitment of the current attempt may have happened (every earlier act of the attempt absent or `not_filed_evidenced`) — the same predicate the evaluator uses. Readiness gate only when validity = `previous_operator` (`gate_exception_not_eligible` for `missing`, `stale_basis`, `held`). Application open. No other control decides eligibility. |
| Freshness | The exception stores `basis`: Gate 1 — payment `status_revision`, `active_assignment_id` (NULL or the assignment being replaced); Gate 2 — payment `status_revision`, `active_assignment_id`, `attempt_ordinal` (rev 2; not `government_attempt_no`) and the act states of the attempt; readiness — readiness id, fingerprint, `active_assignment_id`. At consumption every stored value MUST equal the live value, `now < expires_at` (`gates.exceptionTtlMs`, default 24 h) and the grantor MUST still be an active SuperAdmin. Otherwise `gate_exception_stale` / `_expired` / `_grantor_inactive`. |
| Consumption | Inside the guarded action's transaction: `UPDATE core_gate_exceptions SET state='consumed', consumed_by_operation_id=$op, consumed_at=$now WHERE gate_exception_id=$id AND state='granted'` + `requireAffected`. One use. A rolled-back action leaves it `granted`. |
| Revocation | `core.revoke_gate_exception` (SuperAdmin) sets `revoked` while `granted`. |
| Consequence | Consuming a Gate 1 or Gate 2 exception while payment ≠ `payment_received` opens a financial exception in the same transaction (B26, B29). |
| Non-effects (B20) | It records no payment and changes no payment status. It asserts no TA confirmation, prerequisite, readiness or external fact. It forces no execution: the operator still decides to act. It clears no validation and no hold. It does not extend to a later gate (Gate 1 never satisfies Gate 2), another action, another application or a second use. It never affects the exposure ceiling, launch control, uncertainty protection or any shared tenet. Unavailable required evidence still cannot pass. |

### 8.6 TA-wide exposure check (B28, B43)

Inside `payments.reserveExposure`, after `pay_ta_exposure` is locked `FOR UPDATE`:

0. Rev 2 (COV-02): the key MUST equal `logicalEffectKey(applicationId, attemptOrdinal)` of the calling authorization; any other key ⇒ `internal` / `unexpected` (a defect, never a business refusal). Fee state `payment_unknown` ⇒ `control_blocked` / `fee_payment_unknown`; fee state `tm_paid` ⇒ `control_blocked` / `fee_already_paid_for_effect`.
1. `existing` = reservation with this `logical_effect_key`, if any (any state).
2. `counted` = `reserved_paise + tm_paid_unrecovered_paise − remainder(existing)`, where `remainder = GREATEST(amount_paise − converted_paise, 0)` (rev 2, record 15 CCR-15-01).
3. If `ceiling_source = 'default'` and `ceiling_paise = 0` and service payment = `payment_received` ⇒ `control_blocked` / `exposure_parked_paid_case_default_ceiling` (PARKED; boundary `parked`).
4. Else if `counted + amount > ceiling_paise` ⇒ `control_blocked` / `exposure_ceiling_breach`. Non-overridable, including after a Gate 2 exception.
5. Else: no `existing` ⇒ insert reservation; `existing` with smaller amount ⇒ raise it to `amount`; `existing` with greater or equal amount ⇒ keep it (no partial release). Update the aggregate. Append `pay.exposure_reserved`.

`pay_ta_exposure.ceiling_source` (`default`, `set`) distinguishes the default ₹0 from a ceiling a SuperAdmin set. No payment record excludes a fee from counted exposure (PARKED). No reservation is ever released (PARKED). Exposure decreases only through an Accounts-verified allocated bank receipt, whose path is PARKED; therefore exposure never decreases in this build. Lowering a ceiling below incurred exposure stops new spend and erases nothing.

## 9. Version bindings (B05, B06, B39)

### 9.1 Identities

| Identity | Id | Who creates | Meaning |
|---|---|---|---|
| Structural declaration version | `sdv_` | release registration (`tm release register`, engineering actor) or SuperAdmin with outside-product owner approval record (B05) | What the offering is and how it behaves: schema `decl/1`. Immutable once `supported`. |
| Business baseline version | `bbv_` | SuperAdmin (`cat.edit_baseline` → `cat.preview_baseline` → `cat.publish_baseline`) | Effective business values within the declaration's value schema: price, processing estimate, document wording, process overview. Cannot change controls, security, retries or behaviour (B05). |
| Behaviour binding | `bnd_` | release registration | Links one declaration version to one released capability id + version. `supported` only when the active release's `capability_set` contains that capability version. |
| Release manifest | `rel_` | `tm release register` | Exact source commit, lockfile digest, artifact digest, nonsecret configuration digest, schema head, supported declaration schemas, capability versions, worker contract, toolchain manifest digest (B39). |

### 9.2 Structural declaration `decl/1` (rev 2: normative schema; COV-01, BND-02)

Revision 2 makes this section the **only** definition of `decl/1`. Record 12 §2.1–§2.2 implements the Catalogue parser and item-status function exactly as stated here; records 13, 14 and 15 read only the keys listed here. One shared zod module `src/kernel/vocabulary/decl.ts` is the only parser (`parseDecl`), used by Catalogue at registration and by every reader through `catalogue.getDeclaration`. Objects are strict (unknown keys refused). A static test (T-F36) asserts that every `decl.<path>` read in `src/modules` is a key of `DECL_ITEM_KEYS` or a field inside one.

General rules:
- Every item key holds a declared value or `{ "unresolved": UnresolvedReason }`. A missing key is `incomplete`. The parser never fills a default (B05).
- Class **L** (`launch_required`): launch and every new-case action need the item `supported`. Class **A** (`action_scoped`): only the dependent actions need it; an unsupported A item leaves those actions visibly unavailable and MUST be acknowledged item by item at launch (record 12 L2, interim of OD-12-02).
- **G** (owner-gated, rev 2, BND-04 / COV-11): the item settles a policy that the spec leaves PARKED or unselected. A non-unresolved value is `supported` only when a `cat_owner_approvals` row for this exact declaration version lists the item key in `scope.itemKeys` (B05 outside-product approval recorded by a SuperAdmin). An engineering release alone never settles it. Synthetic offerings in `test`/`local_test` use synthetic approval rows (evidence kind `synthetic_label`) recorded by the harness seed, so the same code path is exercised; configuration refuses synthetic offerings in `production`.
- **Shape rule** (rev 2, COV-12, B05): `DECL_ACTORS`, `AUTHORITY_KINDS`, `EXTERNAL_ACT_KINDS` and the gate applicability values are closed sets of this record. A declaration cannot express a new actor or authority shape. Extending these sets is a change of the shared business contract and requires a recorded product-owner decision before the contract revision.

```ts
// src/kernel/vocabulary/decl.ts (closed sets; zod schemas follow the table below)
export const UNRESOLVED_REASONS = ['owner_policy_pending','engineering_pending','parked_prep_only_cutoff','parked_custody_route_policy',
  'parked_provider_route','parked_cancellation','parked_preparation_post_handover','unselected_price_fee_formula','unselected_other_mode_fee'] as const;
export const DECL_ITEM_KEYS = ['serviceMode','custodyPaths','promise','eligibility.population','eligibility.travelDateRules','actorsActions',
  'authority','controls.gates','controls.submitChecks','controls.withdrawalCutoff','controls.otherCutoffs','documents.requirements',
  'documents.formFields','dependencies','progressMapping','financialConditions.servicePrice','financialConditions.governmentFee',
  'financialConditions.priceFeeRelation','originals.custody','originals.returnPolicy','outcomeEvidence.outcomes','outcomeEvidence.artifactTypes',
  'outcomeEvidence.handover','deliveryEvidence','completionEvidence','cancellation','provider','operatingReadiness'] as const;
export const OWNER_GATED_ITEM_KEYS = ['controls.withdrawalCutoff','controls.otherCutoffs','financialConditions.governmentFee',
  'originals.returnPolicy','cancellation','provider'] as const;   // gating conditions per key in the table
export const DECL_ACTORS = ['assigned_operator','ta','superadmin'] as const;
export const AUTHORITY_KINDS = ['government','provider'] as const;
export const SUBMIT_CHECKS = ['mandatory_documents_present','identity_evidence_present','population_confirmed','travel_dates_valid'] as const;
export const VALIDITY_CHECK_KINDS = ['passport_valid_through_return_plus_months','passport_document_code_in','passport_issuing_state_in',
  'image_min_pixels','image_aspect_ratio','pdf_max_pages','country_adapter_check'] as const;   // Documents capability documents.validity/1 (record 14 §3.4.6)
export const WITHDRAWAL_CUTOFF_KINDS = ['evidenced_government_portal_submission','evidenced_provider_handoff','evidenced_work_step'] as const;
export const DELIVERY_EVIDENCE_KINDS = ['tm_held_electronic','direct_external','packet','none'] as const;
export const COMPLETION_EVIDENCE_CODES = ['ta_outcome_notice_posted'] as const;   // extended only by contract revision
export const HANDOVER_EVIDENCE = ['ta_retrieval_of_released_packet','recorded_physical_handover_to_ta'] as const;
```

| Item key | Value (declared form) | Complete when | Class | Mode and gate rules | Readers |
|---|---|---|---|---|---|
| `serviceMode` | one of `SERVICE_MODES` | equals `cat_offerings.service_mode` | L | — | all |
| `custodyPaths` | `{ electronic: boolean, physical: boolean }` | at least one true | L | `preparation_only` ⇒ `physical` original custody not declared | Catalogue, Operations |
| `promise` | `{ deliverable: 'government_outcome' \| 'validated_packet' \| 'provider_outcome', claimsGovernmentResult: boolean, summary ≤ 500 }` | all fields | L | `preparation_only` ⇒ `validated_packet`, `false` (B04); `third_party_filed` ⇒ `provider_outcome` | Catalogue |
| `eligibility.population` | `{ nationality: 'IND', passportType: 'ordinary', residence: 'IND', purposes: ('tourism' \| 'business')[] ≥ 1 }` | all fields | L | any other value ⇒ `unsupported` / `population_out_of_scope` (B02) | Catalogue, Core (stage 10) |
| `eligibility.travelDateRules` | `{ minDaysBeforeTravelStartToSubmit: int ≥ 0, maxDaysBeforeTravelStartToSubmit: int ≥ 1 \| null }` | both present (`null` = declared "no maximum") | L | submit-window and timing only; passport validity is a document validity check (`documents.requirements[].validityChecks`), not a travel-date rule (rev 2) | Catalogue `evaluateTravelDateRules`, Core (submit check `travel_dates_valid`, timing) |
| `actorsActions` | `{ localSteps: { code, actor: DECL_ACTORS }[] ≥ 1, externalActs: EXTERNAL_ACT_KINDS[] }` | step codes unique | L | `travelmudra_filed` ⇒ `government_submission` (+ `government_fee_payment` iff fee timing `separate_act`); `preparation_only` ⇒ `[]`; `third_party_filed` ⇒ `['provider_handoff']` | Catalogue, Core, Operations |
| `authority` | `{ externalAuthority: { kind: AUTHORITY_KINDS, label ≤ 120 }, confirmationItems: { code: /^[a-z][a-z0-9_]{1,39}$/, required: boolean, textVersion: string ≤ 40 }[] ≥ 1, applicantConsentStatement: boolean }` | ≥ 1 item with `required = true`; codes unique | L | `preparation_only` ⇒ `externalAuthority` names the authority the TA files with | Core CMD-S1 (B17) |
| `controls.gates` | `{ gate2: 'applicable' \| 'not_applicable', readiness: 'required' }` | both | L | `travelmudra_filed` ⇒ `applicable` (B27); other modes ⇒ `not_applicable` | Core evaluator |
| `controls.submitChecks` | `SUBMIT_CHECKS[]` (empty is declared) | present | L | — | Core stage 10 at `submit` |
| `controls.withdrawalCutoff` | `{ kind: WITHDRAWAL_CUTOFF_KINDS, evidenceKind?: string }` | present | A | **fixed, not gated**: `travelmudra_filed` with `custodyPaths = { electronic: true, physical: false }` ⇒ MUST be `evidenced_government_portal_submission` (B24). **G** for every other offering ("each other offering must declare its own evidenced cut-off", B24); real `preparation_only` offerings hold `{ unresolved: 'parked_prep_only_cutoff' }` (B44). Packet release is never a cut-off | Core withdrawal assessment (stage 9) |
| `controls.otherCutoffs` | `{ code, evidenceKind, appliesTo: ControlledAction }[]` (empty is declared) | present | L | non-empty ⇒ **G** | Core stage 9 |
| `documents.requirements` | `{ type: /^[a-z][a-z0-9_]{1,39}$/, mandatory, subject: 'applicant' \| 'other_person', identityRole: boolean, formats: ('pdf' \| 'jpeg' \| 'png')[] ≥ 1, maxBytes ≤ 5 242 880, validityChecks: { kind: VALIDITY_CHECK_KINDS, params }[] }[]` | exactly one requirement with `identityRole = true`, `type = 'passport'`, `subject = 'applicant'`, `mandatory = true` (B15 passport primary); types unique; an `other_person` requirement is never `identityRole` | L | capability `docs.standard` and `docs.check.<kind>` per check kind | Documents (`requirementEvidence`), Core stage 10, Catalogue display |
| `documents.formFields` | `{ key: /^[a-z][a-zA-Z0-9]{1,39}$/, kind: 'text' \| 'date' \| 'country_code' \| 'enum', required: boolean, maxLength?: int ≤ 500, options?: string[] }[]` (empty is declared) | keys unique; `enum` ⇒ options | L | values are personal data in snapshots only | Core CMD-D2, intake mapping |
| `dependencies` | `{ relations: { relationshipCode, upstreamServiceCode, applicantRelation: 'same_applicant', requiredOutcome: Outcome, requiredArtifactType: string \| null, conditionedActions: ControlledAction[] ≥ 1 }[] }` (empty is declared) | codes unique | L | capability `deps.declared` when non-empty. The upstream is an application of the **same group** whose offering has `service_code = upstreamServiceCode` (interim of OD-R2-06; B03). No external or evidence-only upstream exists: a relationship that would need dependent-government-result evidence from outside the product is not declarable (`parked_dependency_external_evidence`, B44). A `preparation_only` upstream never satisfies a required government result (B22) | Core CMD-D5, §3.11.3 |
| `progressMapping` | `{ steps: { code, meaning: ProgressMeaning }[] }` | every `actorsActions.localSteps` code mapped exactly once | L | — | Operations CMD-O2, Views |
| `financialConditions.servicePrice` | `{ basis: 'fixed_quoted_at_submission' }` | present | L | B17 | Core |
| `financialConditions.governmentFee` | `{ payer: 'travelmudra', timing: 'separate_act' \| 'with_submission' }` \| `'no_government_fee'` \| `'not_handled_by_travelmudra'` | present | L | `travelmudra_filed` ⇒ `{ payer: 'travelmudra', … }` or `'no_government_fee'` (B27; engineering-declarable); other modes ⇒ **G**: any non-unresolved value needs an owner approval listing this key, else the item MUST be `{ unresolved: 'unselected_other_mode_fee' }` (B27, B29, B43) | Core `feeCarryingAct` (Section 7.4), Catalogue display |
| `financialConditions.priceFeeRelation` | `{ unresolved: 'unselected_price_fee_formula' }` when TravelMudra pays a fee; `'not_applicable'` otherwise | present | A | no executable dependent action in this build; shown as a boundary (B29, B43) | Catalogue display |
| `originals.custody` | `{ held: false }` \| `{ held: true, itemTypes: string[] ≥ 1 }` | present | L | `held = true` requires `custodyPaths.physical` and capability `custody.physical`; `preparation_only` ⇒ `held = false` (B04, B30) | Operations CMD-OR1–OR3, Core E4 |
| `originals.returnPolicy` | `'not_applicable'` (not held) \| `{ recipientEvidenceKinds: EvidenceKind[] ≥ 1, sharedItemReturn: 'single_application_only' \| 'all_linked_applications' }` | present | A | **G** (B30 PARKED recipient evidence and shared-item return); real physical offerings hold `{ unresolved: 'parked_custody_route_policy' }` (merges record 13 CCR-15 `returnRecipientEvidence`/`sharedItemReturn` into this one key) | Operations CMD-OR4 |
| `outcomeEvidence.outcomes` | `{ outcome: Outcome, evidenceKinds: EvidenceKind[] ≥ 1 }[] ≥ 1` | every outcome applicable to the mode (Section 2.5) | L | `preparation_only` ⇒ only `prepared_and_handed_over`, `withdrawn`, `dependency_failed`, and `cancelled` if a cancellation path is approved | Core, Operations CMD-OC1 |
| `outcomeEvidence.artifactTypes` | `string[]` (types of official-result artifacts; empty is declared) | present | L | `preparation_only` ⇒ `[]` | Operations CMD-OC1/AR1, Core E3 |
| `outcomeEvidence.handover` | `'not_applicable'` \| `{ evidence: HANDOVER_EVIDENCE }` | present | L | `preparation_only` ⇒ `{ evidence }` (engineering-declarable: B04 defines the end state; B44 parks only post-handover policy); other modes ⇒ `'not_applicable'` | Delivery C-D6, Core `recordOutcomeFromEvidence` |
| `deliveryEvidence` | `{ [outcome]: DELIVERY_EVIDENCE_KINDS }` for every outcome of `outcomeEvidence.outcomes` | every listed outcome mapped | L | `tm_held_electronic` requires `custodyPaths.electronic` and ≥ 1 artifact type; `packet` only for `preparation_only` | Core E3/E5 |
| `completionEvidence` | `{ [outcome]: COMPLETION_EVIDENCE_CODES[] }` for every outcome (empty array is declared) | every listed outcome mapped | L | — | Core E6 |
| `cancellation` | `'undeclared'` \| `{ path: { code, evidenceKinds: EvidenceKind[] ≥ 1 } }` | present | A | a declared path is **G** (B21 "do not invent cancellation eligibility", B44) | Core CMD-OC2 |
| `provider` | `'none'` \| `{ routeRef, ownerApprovalRef }` \| `{ unresolved: 'parked_provider_route' }` | present | L for `third_party_filed`; otherwise MUST be `'none'` | a route is **G**; capability `provider.synthetic` for synthetic routes in `test`/`local_test` only | Core CMD-X1 |
| `operatingReadiness` | `{ requiredMeasures: MEASURE_CODES[] ≥ 1, requiredMonitors: MONITOR_CODES[] ≥ 1 }` | present | L | capability `measures.core`; `preparation_only` ⇒ includes `packet_handover_duration`, no government-result measures (B32). Effort measures need `ops.record_effort_sample` data (COV-10) | Operations launch plan, Views |

Item status (pure `itemStatus(key, body, offering, releaseCaps, ownerApprovals)`; first match):

| Order | Condition | Status | Blocker code (with `ref` = key) |
|---|---|---|---|
| 1 | value is `{ unresolved: r }` | `unresolved` | `declaration_item_unresolved` (detail `r`; category `unavailable_parked` / `_owner_decision` per reason) |
| 2 | key absent, or "complete when" fails | `incomplete` | `declaration_incomplete` |
| 3 | value outside the approved population (B02) | `unsupported` | `population_out_of_scope` |
| 4 | G condition applies and no owner approval of this declaration lists the key | `unsupported` | `owner_approval_required` (evaluated at use) |
| 5 | a required capability `id@version` is absent from the active release `capability_set` | `unsupported` | `declaration_unsupported` |
| 6 | otherwise | `supported` | — |

A body that violates a mode rule or a type rule is refused at registration with `validation_failed` / `item_value_not_permitted`.

Dependent actions (control stage in brackets). The application's governing declaration is evaluated, never the head, except for new-case actions. `catalogue.declarationSupportFor` returns these blockers.

| Controlled action | Items that MUST be `supported` | Failing code (stage) |
|---|---|---|
| `select_offering`, `start_intake`, `create_draft` (head declaration) | every L item | item code (5) |
| `submit` | every L item of the governing declaration | item code (5) |
| `request_assistance`, `assign`, `reassign`, `start_operator_work`, `assistance_entry` | `serviceMode`, `actorsActions`, `progressMapping` | item code (5) |
| `record_readiness` | `documents.requirements`, `eligibility.*`, `dependencies`, `controls.gates`, `controls.otherCutoffs` | item code (5) |
| `authorize_government_submission`, `authorize_government_fee_payment` | `authority`, `actorsActions`, `controls.gates`, `financialConditions.governmentFee`, `outcomeEvidence.outcomes` | item code (5); `fee_act_not_declared` (6) |
| `authorize_provider_handoff` | `provider`, `authority`, `actorsActions` | `provider_route_unapproved` (6) when `provider` is not supported |
| `release_packet` | `outcomeEvidence.handover`, `deliveryEvidence` | item code (5) |
| `record_outcome` (`issued`/`refused` through CMD-OC1) | `outcomeEvidence.outcomes`, `outcomeEvidence.artifactTypes` | item code (5) |
| `record_outcome` (`cancelled`) | `cancellation` with a supported path | `cancellation_undeclared` (6) |
| `request_withdrawal` (submitted applications) | `controls.withdrawalCutoff` | `withdrawal_cutoff_undeclared` (9) |
| `complete` | `completionEvidence`, `deliveryEvidence`, `originals.custody` | item code (Core completion evidence) |
| original return (Operations) | `originals.returnPolicy` | `parked_custody_route_policy` |
| dependency link (Core CMD-D5) | `dependencies` | `dependency_undeclared` |

Business baseline `bv/1` (record 12 §2.3) is unchanged: prices, processing estimate `{ minDays, maxDays, dayBasis: 'calendar' }`, document wording, process overview. It cannot change controls, security, retries or behaviour (B05).

### 9.3 Snapshots per accepted event (no universal latest lookup, B06)

| Accepted event | Snapshotted identities |
|---|---|
| Intake attempt created | per offering in the group's country: `sdv`, `bbv`, `bnd`; `release_id`; worker contract (`intake_attempts.catalogue_snapshot`) |
| Draft created | `governing_declaration_id`, `governing_baseline_id`, `governing_binding_id`, `admitted_launch_id` |
| Submission | governing ids, `price_baseline_id`, quoted price, estimate, confirmation text version |
| Readiness judgement | fingerprint over governing ids, impact state, evidence fingerprint |
| Action authorization | governing ids, readiness id or exception id, evidence set digest, gate bases, reservation id, release id |
| Outcome, completion, release, email | evidence refs, exact document version ids, artifact id, recipient email snapshot, release id |
| Every fact | `release_id` |

The governing ids of an application change only by (a) explicit supported continuation recorded on an impact item (`continue`), or (b) a SuperAdmin-approved per-application structural transition with engineering compatibility evidence and renewed TA authority where required (`core_transitions`). Otherwise the item stays an owned hold (B06). A release never silently migrates a case. A service or country switch uses fresh intake.

### 9.4 Compatibility check

```ts
export function checkReleaseCompatibility(owner: OwnerPool, manifest: ReleaseManifest): Promise<{
  readonly ok: boolean;
  readonly schemaHeadMatches: boolean;
  readonly workerContractMatches: boolean;          // worker binary answers `--contract` with the manifest value
  readonly artifactDigestMatches: boolean;
  readonly unsupportedBindings: readonly { readonly bindingId: BindingId; readonly launchedOffering: boolean; readonly openApplications: number }[];
}>;
```

- Run while admission is closed (B39). `ok` requires schema head, worker contract and artifact digest to match. Unsupported bindings do not block opening; they make every dependent action blocked with `binding_incompatible` and create a release impact assessment through `cat.submit_release_impact` for the accountable SuperAdmin (B06). An incompatible old binary cannot register (Section 4.7).
- Rev 2 (COV-13 item 9): `cat.register_release_catalogue` and `cat.submit_release_impact` run as engineering maintenance commands inside cutover step 6 (`verify`), after `activate` and **before** admission opens, so no window exists in which the new release serves cases without its catalogue registration and impact assessments.
- Rev 2 (record 12 CCR-11): `capability_set` entries are `{ id, version, sourceDigest }`; `tm release register` refuses a manifest whose capability keeps the version of the previous active release with a different `sourceDigest`. The manifest gains sections `catalogue` and `catalogueImpact` (`rimp/1`, record 12 §3.3).
- A structural change to a launched, unsuspended offering applies to new cases at deployment without a second launch approval (B06).

## 10. Facility seams (`src/platform`)

### 10.1 Database

- `pg` 8.23.1 `Pool` per role. `tm_app` pool `max = 12`, `idleTimeoutMillis = 30000`, `connectionTimeoutMillis = 2000`; one dedicated client per transaction. Connection over the Unix socket directory (mode 0700), SCRAM password from the secrets directory.
- Type parsers set once at startup: `int8` (OID 20) → `BigInt`; `numeric` refused (no numeric columns); `date` (1082) → raw string (`LocalDate`); `timestamptz` → `Date`; `jsonb` → parsed then zod-validated by the row schema; `xid8` → `BigInt`.
- Cluster settings (dedicated cluster, ≈ 8 GB host): `listen_addresses = ''`, `unix_socket_permissions = 0700`, `password_encryption = scram-sha-256`, `max_connections = 40`, `shared_buffers = 1GB`, `effective_cache_size = 3GB`, `work_mem = 8MB`, `maintenance_work_mem = 128MB`, `jit = off`, `default_transaction_isolation = 'read committed'` (the kernel sets SERIALIZABLE explicitly), `max_pred_locks_per_transaction = 128`, `idle_in_transaction_session_timeout = 30s`, `log_min_messages = warning`, `log_line_prefix` without statement text, `log_statement = none`.
- Migrations: `tm migrate` as `tm_owner`; `pg_advisory_lock(<constant>)`; for each file in order: applied ⇒ checksum must match (else refuse and exit non-zero); new ⇒ `BEGIN; <file>; INSERT INTO sys_migrations …; COMMIT`. Refuses while admission is `open`, except on a database with `closure_kind='initial'` and no business rows (fresh install, test template). Migration 0001 creates roles' grants, `tm_is_id`, the append-only and immutable-column trigger functions, and kernel tables.
- Tests: `--test-global-setup` starts one PostgreSQL cluster per test run in a temporary directory (socket only), creates roles, migrates database `tm_template`, then each test file runs `CREATE DATABASE tm_t_<random> TEMPLATE tm_template` and drops it at the end. Concurrency tests open several `tm_app` clients against the same file database.

### 10.2 Blob store

Layout under `<dataDir>/blobs/{staging,quarantine,canonical}/<first 2 chars of body>/<blob_id>`; directories 0700, files 0600, owned by the service user; outside every served path; names are random ids, never content hashes or user file names. Writes: `<id>.part` → `fsync` → `rename` → `fsync(dir)`. API and cleanup rules: Section 4.12. Worker temp area: `<dataDir>/work/<task_id>/` removed after each job and swept by `blob.cleanup_work_dirs` (per-attempt directories and `.part` cleanup are parked P2 notes REC-21, REC-23).

### 10.3 WorkerRunner (`src/platform/workers.ts`, workers in `src/workers`)

```ts
export const WORKER_CONTRACT = 'tm-worker/1';
export const WORKER_KINDS = ['fetch','parse'] as const;
export const PARSE_JOBS = ['inspect_pdf','extract_pdf_text','ocr_pdf','ocr_image','decode_image','read_spreadsheet','read_folder_listing'] as const;
export interface WorkerRequest { readonly contract: typeof WORKER_CONTRACT; readonly kind: WorkerKind; readonly job: string; readonly inputs: readonly { readonly name: string; readonly bindPath: string }[]; readonly params: JsonObject; readonly limits: WorkerLimits }
export interface WorkerResponse { readonly contract: typeof WORKER_CONTRACT; readonly ok: boolean; readonly result?: JsonObject; readonly outputs?: readonly { readonly name: string; readonly sizeBytes: number; readonly sha256: string }[]; readonly error?: { readonly code: ReasonCode } }
export interface WorkerLimits { readonly wallMs: number; readonly cpuSeconds: number; readonly addressSpaceBytes: number; readonly fileSizeBytes: number; readonly maxProcesses: number; readonly maxOpenFiles: number; readonly stdoutBytes: number; readonly tmpBytes: number }
export interface WorkerRunner { run(req: WorkerRequest, taskId: TaskId): Promise<WorkerResponse> }   // throws TmError('unavailable_dependency', 'worker_timeout' | 'worker_failed')
```

- Launch (rev 2, BND-01, C-08; verified on this host 2026-10-04: `systemd-run --user --scope -p MemoryMax=768M -p TasksMax=64 bwrap … node` succeeds, user lingering is enabled): `systemd-run --user --scope --quiet --collect -p MemoryMax=<memoryBytes> -p MemorySwapMax=0 -p TasksMax=<maxTasks> -p CPUQuota=<cpuQuota> -- prlimit --cpu=<cpu> --fsize=<fs> --nofile=<nf> -- bwrap --die-with-parent --new-session --unshare-all [--share-net: fetch only] --clearenv --setenv <sandbox env> --ro-bind <node prefix> /opt/node --ro-bind <repo>/node_modules /app/node_modules --ro-bind <repo>/src /app/src --ro-bind <repo>/package.json /app/package.json --ro-bind <toolchain dir>/root /opt/tm-toolchain/root --ro-bind /usr /usr --symlink usr/lib /lib --symlink usr/lib64 /lib64 [--ro-bind /etc/resolv.conf and CA bundle: fetch only] --proc /proc --dev /dev --size <tmpBytes> --tmpfs /tmp --bind <work dir> /work --ro-bind <input file> /in/<name> --chdir /work -- /opt/node/bin/node /app/src/workers/<kind>.ts`. **No** `prlimit --as` and **no** `--nproc` on the Node worker: `--as` below about 2 GiB stops V8 from reserving its code range, and `RLIMIT_NPROC` counts every thread of the real uid, so `bwrap` fails with EAGAIN. Memory and task bounds come from the cgroup scope. `bwrap --size` is supported by the installed bubblewrap 0.9.0. Exact bind list is fixed in the WorkerRunner design and verified by T-F29 **on this host with the real launch line** before milestone 1 closes.
- Native tools spawned inside the parse worker (`tesseract`, `qpdf`, `pdftoppm`, `pdftotext`) run under their own `prlimit --as=<toolAddressSpaceBytes> --cpu=<s>` (default 512 MiB, 60 s) because they are not V8 processes. `sharp` runs with `sharp.concurrency(1)` and `VIPS_CONCURRENCY=1` so that libvips thread stacks stay inside the scope memory limit.
- Sandbox environment (cleared, then set explicitly; host paths never leak): `LD_LIBRARY_PATH=/opt/tm-toolchain/root/usr/lib/x86_64-linux-gnu`, `TESSDATA_PREFIX=/opt/tm-toolchain/root/usr/share/tesseract-ocr/5/tessdata`, `OMP_THREAD_LIMIT=1`, `VIPS_CONCURRENCY=1`, `PATH=/opt/tm-toolchain/root/usr/bin:/usr/bin`. The fetch worker gets no toolchain variables.
- Start-up self-test (record 14 CCR-13, accepted with this launch line): the runner launches a no-op job of each kind with the configured limits and checks that Node starts, that the memory limit is enforced (an allocation probe beyond `memoryBytes` is killed), that the parse worker cannot connect outward, and that the toolchain binaries resolve inside the sandbox (`ldd`-equivalent probe). A failed self-test marks worker health `down` with a closed code and admits no worker job; it never runs a job without limits. If `systemd-run --user` is unavailable on a host, worker health is `down` (`worker_cgroup_unavailable`); there is no silent fallback to unenforced limits.
- Protocol: request JSON on stdin; exactly one JSON document on stdout ≤ `stdoutBytes` (1 MB); stderr capped at 64 KB and discarded except its length; exit 0 with `ok` JSON ⇒ success; anything else ⇒ `worker_failed`. Wall-clock timeout ⇒ `SIGKILL` to the process group and `systemctl --user kill` of the scope ⇒ `worker_timeout`. Outputs are files in `/work/out/`; the runner moves them into staging blobs after verifying size and SHA-256 against the response.
- Parse worker: no network namespace, so no database, clamd or outbound access. Fetch worker: network allowed; read-only runtime binds; one output directory; SSRF rules of brief §9 (`https:` only, DNS resolve + `ipaddr.js` classification, `request-filtering-agent` at connect time, manual redirects ≤ 5 with re-check per hop, no cookies or credentials, byte and time caps). Test environment MAY allow a loopback fixture host through `fetch.testAllowHosts`; configuration refuses it outside `TM_ENV=test`.
- Contract version check: `node src/workers/<kind>.ts --contract` prints `tm-worker/1`; release verification compares it (B39).
- Default limits (one fetch worker, one parse worker; B38; rev 2): parse `wallMs 120000`, `cpuSeconds 90`, `memoryBytes 768 MiB` (cgroup), `maxTasks 64` (cgroup), `toolAddressSpaceBytes 512 MiB`, `fileSizeBytes 64 MiB`, `tmpBytes 256 MiB`, `maxOpenFiles 256`; fetch `wallMs 60000`, `cpuSeconds 30`, `memoryBytes 256 MiB`, `maxTasks 32`, `fileSizeBytes 32 MiB`. `WorkerLimits` replaces `addressSpaceBytes`/`maxProcesses` by `memoryBytes`/`maxTasks`/`toolAddressSpaceBytes`.

### 10.4 Malware scanner (`src/platform/scanner.ts`)

```ts
export interface Scanner { scan(file: { readonly path: string; readonly sizeBytes: number }): Promise<{ readonly verdict: 'clean' } | { readonly verdict: 'infected'; readonly signature: string } > }   // throws TmError('unavailable_dependency','scanner_unavailable')
```

`clamd` INSTREAM over the private Unix socket (mode 0600): `zINSTREAM\0`, 64 KiB chunks with 4-byte big-endian lengths, zero-length terminator; response `stream: OK` or `stream: <sig> FOUND`; anything else, a socket error, or a timeout (`scanner.timeoutMs` 30 000) ⇒ `scanner_unavailable` (fail closed; file stays quarantined; task retries with backoff; owner = Documents queue). `StreamMaxLength` in clamd config ≥ largest admitted file (`32M`). Signature names are not personal data but are logged only as `code`. `freshclam` runs from `tm scanner update`.

### 10.5 Extraction toolchain (parse worker only)

| Job | Tools | Output |
|---|---|---|
| `inspect_pdf` | `qpdf --check`; `qpdf --json` object scan rejecting `/JavaScript`, `/JS`, `/Launch`, `/EmbeddedFile(s)`, `/RichMedia`, `/XFA`, `/OpenAction` with action, `/AA` | `{ ok, pageCount, activeContent: string[] }` |
| `extract_pdf_text` | `pdftotext -layout -l <maxPages>` | text (bounded 200 KB) + MRZ candidates |
| `ocr_pdf` | `pdftoppm -r 300 -png -f 1 -l <maxPages>` → `tesseract … --psm 6 -l eng` | text + confidences |
| `decode_image`, `ocr_image` | `sharp` (`limitInputPixels` 40 MP, full decode, rotate, greyscale) → `tesseract` | dimensions, text, confidences |
| MRZ | `mrz` parse with autocorrect and check digits | fields + validity; proposals only |
| `read_spreadsheet` | SheetJS CE 0.20.3 (`dense`, no formulas evaluated, `sheetRows` cap) | rows (≤ `intake.maxRows`, ≤ `intake.maxCellsPerRow`) |

Results are proposals with confidence. Low confidence or any conflict ⇒ manual resolution. No hosted OCR/LLM (B15).

### 10.6 Mail transport (`src/platform/mail.ts`)

```ts
export interface MailTransport { readonly label: 'synthetic' | 'none'; send(msg: BuiltMessage): Promise<{ readonly result: 'synthetic_accepted' | 'accepted' | 'failed' | 'uncertain'; readonly messageRef: string | null }> }
export function buildMessage(spec: MailSpec): Promise<BuiltMessage>;   // nodemailer MailComposer → raw MIME buffer
```

Only `synthetic` exists: it stores the `.eml` as a blob (`sys_synthetic_mail`) and returns `synthetic_accepted`; recipients `fail+…@synthetic.test` ⇒ `failed`, `uncertain+…@synthetic.test` ⇒ `uncertain`. `production` configuration has `mail.transport = 'none'`: sending is `unavailable_owner_decision` / `real_mail_transport_unselected` (B31, B37). Rev 2 (C-09): OTP, email-change and staff enrolment mail go through Identity's `iam.send_mail` task; harness document email goes through Delivery's `mail.deliver` task. Every surface that shows `synthetic_accepted` labels it "Synthetic test transport: no real email was sent" (parked P2 note SEC-12 asks to verify this on every page).

### 10.7 CAPTCHA (`src/platform/captcha.ts`)

```ts
export interface Captcha {   // rev 2 (record 11 CCR-03): pure, no database
  createChallenge(now: Date, req: { readonly purpose: 'ta_otp' | 'bulk_intake' | 'correction_upload'; readonly binding: Buffer }): Promise<AltchaChallenge>;   // altcha-lib; HMAC key from secrets; expires = now + captcha.ttlMs
  verifyPayload(payload: string, req: { readonly purpose: string; readonly binding: Buffer }, now: Date): Promise<{ readonly challengeHmac: Buffer; readonly expiresAt: Date }>;   // throws bot_check_failed
}
// Single use is enforced only by identity.consumeBotCheck (INSERT iam_captcha_spent), the sole writer of that table.
```

Placed before TA OTP issuance and before expensive authenticated bulk intake (B08). The widget is served from our origin (`/assets/altcha/…`) and only the TA sign-in and bulk-intake pages allow `script-src 'self'`. A passed check grants nothing else (B08).

### 10.8 Clock and timer

`systemClock`, `FakeClock`, `BusinessCalendar('Asia/Kolkata')`, `Scheduler` (Section 4.9). Periodic intervals (configurable): task loop 250 ms idle backoff to 2 s, lease recovery 15 s, heartbeat 10 s, installation watch 2 s, projector 1 s, clock check 60 s, group-end enqueue daily at 02:00 Asia/Kolkata plus on startup, cleanup enqueue 10 min, expiry cleanup 15 min, deferral review daily.

### 10.9 Configuration (nonsecret; `tm.config.json`, zod-validated, digest in the release manifest)

| Key | Default (≈ 8 GB host) | Note |
|---|---|---|
| `env` | `local_test` | `test`, `local_test`, `production`; synthetic seed, synthetic mail and harness commands refused in `production` |
| `http.bind` | `127.0.0.1:4610` | non-loopback only when set explicitly with TLS |
| `http.publicOrigin` / `http.allowedOrigins` | `http://127.0.0.1:4610` | origin check (Section 12) |
| `http.bodyLimitBytes` | 65 536 (forms) | per-route overrides below |
| `upload.documentMaxBytes` | 5 242 880 | B15; offering MAY narrow |
| `upload.spreadsheetMaxBytes` | 10 485 760 | |
| `intake.maxRows` / `maxFilesPerAttempt` / `maxAggregateBytes` | 1 000 / 500 / 512 MiB | per attempt |
| `intake.concurrentAttemptsPerTa` | 2 | |
| `db.appPoolMax` | 12 | |
| `command.maxAttempts` / `statementTimeoutMs` / `lockTimeoutMs` | 5 / 5 000 / 2 000 | |
| `tasks.concurrency` | `{ fetch: 1, parse: 1, scan: 2, mail: 2, other: 4 }` | B38 start values |
| `tasks.maxPending` | 5 000 | above ⇒ `capacity_limited` / `capacity_queue` |
| `workers.*` | Section 10.3 | |
| `scanner.socketPath` / `timeoutMs` | `<dataDir>/run/clamd.sock` / 30 000 | |
| `storage.minFreeBytes` / `maxStagingBytes` | 5 GiB / 2 GiB | B36 |
| `session.taIdleMs` / `taAbsoluteMs` | 30 min / 12 h | |
| `session.staffIdleMs` / `staffAbsoluteMs` | 15 min / 8 h | |
| `otp.ttlMs` / `maxAttempts` / `issuePerContactPer15m` / `issuePerIpPer15m` | 10 min / 5 / 3 / 20 | B08 |
| `gates.exceptionTtlMs` | 24 h | Section 8.5 |
| `clock.maxSkewMs` | 120 000 | |
| `retention.succeededTasksDays` | 30 | technical rows only |
| `diag.level` / `diag.maxFileBytes` | `info` / 50 MiB × 5 | rotated |
| `toolchain.dir` | `$TM_TOOLCHAIN_DIR` | |
| `faults` | absent | only `TM_ENV=test` |
| module keys (rev 2) | see records 11 §CCR-15, 12 §CCR-15, 14 §CCR-11, 15 §3.6.1 | accepted as listed there (HTTP hosts/limits, enrolment, elevation and grant TTLs, captcha cost/TTL, limiter budgets; `catalogue.priceMaxPaise`, `recheckBatchSize`, `countryRuleTimeoutMs`, `public.*`; intake/fetch/extract/validity keys; delivery stream and selection limits, `backup.minFreeBytes`, `views.*`); every key is part of the configuration digest |

Process budgets: `tm-server` `--max-old-space-size=512`; PostgreSQL ≤ 1 GB shared buffers; clamd ≈ 1.0 GB; parse worker ≤ 768 MiB; fetch worker ≤ 256 MiB; ≥ 1.5 GB left for host/database administration headroom (B38).

### 10.10 Secrets loader (`src/platform/secrets.ts`)

```ts
export interface Secret { readonly name: SecretName; reveal(): Buffer; toString(): '[secret]'; toJSON(): '[secret]' }
export const SECRET_NAMES = ['db_app_password','db_owner_password','session_key','otp_pepper','csrf_key','altcha_hmac_key','job_credential_key','totp_wrap_key','tls_key','tls_cert','backup_age_identity'] as const;
export function loadSecrets(dir: string, needed: readonly SecretName[]): Promise<Secrets>;   // dir mode 0700, files 0600, owner = process uid; else refuse to start
```

The server loads all except `db_owner_password` and `backup_age_identity`. HMAC uses: session tokens (`session_key`), OTP verifiers and contact hashes (`otp_pepper`), CSRF tokens (`csrf_key`), ALTCHA (`altcha_hmac_key`), lease and enrolment tokens (`job_credential_key`). TOTP seeds are encrypted with AES-256-GCM under `totp_wrap_key`. Every secret-derived row stores `secret_generation`; a restore installs new secrets and old tokens fail verification (B40; see OD-04 for TOTP).

### 10.11 Toolchain resolution

`resolveTool(name)` (rev 2, BND-01; verified layout of the user-space prefix 2026-10-04) searches, in order, `${toolchain.dir}/root/usr/lib/postgresql/16/bin`, `${toolchain.dir}/root/usr/bin`, `${toolchain.dir}/root/usr/sbin` (clamd), then `PATH`, else `TmError('unavailable_dependency','worker_failed')`. Host-side spawned tools (clamd, freshclam, PostgreSQL, age) receive `LD_LIBRARY_PATH=${toolchain.dir}/root/usr/lib/x86_64-linux-gnu`, `TESSDATA_PREFIX`, `CVD_CERTS_DIR` derived from `toolchain.dir`; tools inside the parse sandbox receive only the sandbox paths of Section 10.3. `tm release register` records each resolved path, version output and the toolchain manifest SHA-256.

## 11. Atomic and guard boundaries (B35 and others)

Each row is one SERIALIZABLE transaction. "Lock" lists the guard rows locked before the decision. The guard column names the mechanism that makes a competing mutator fail safely even if serialization detection is weaker than expected (SERIALIZABLE is defence in depth).

| Acceptance | Command / step | Lock | Guard | Competing mutator outcome |
|---|---|---|---|---|
| Draft creation incl. empty duplicate scope | `core.acceptIntakeProposals` (form through `intake.start_individual`, and bulk rows; internal `core.create_draft`) | offering heads ascending, offering controls (share), group (share) | `core_applications_open_scope_uq`; later-attempt rule in `setApplicantKey` | second insert ⇒ `conflict_duplicate` (form) or `matched_existing` (intake) |
| Intake row effect (Nth retry) | `intake.process_rows` record | attempt row | `intake_row_effects` PK; open-scope index | retry resolves to the same applications; no stale overwrite |
| Offering admission vs launch change | any `create_draft`/`submit`/`start_intake` vs `ops.suspend_offering`/`withdraw` | `ops_offering_controls` share vs update | row lock + revision | whichever commits first decides; the other re-evaluates on retry |
| Catalogue publication vs filing readiness | `cat.publish_baseline` vs `core.authorize_external_act`/`ops.record_readiness` | `cat_offerings` head update vs share; impact items | head revision; impact item `unknown` blocks | authorization waits or sees new impact ⇒ blocked |
| Submission and price | `core.submit` | application update | `core_submissions UNIQUE(application_id)`; revision | one submission; one quoted price |
| Assignment | `core.assign`/`core.reassign` | application update, `pay_application_state` share | `core_assignments_active_uq`; gate exception conditional consume | one active assignment; one consumption |
| Payment entry vs Gate 1/Gate 2 | `pay.record_service_status` vs assignment/authorization | `pay_application_state` update vs share | `status_revision`; exception basis | gate uses the committed status; exception basis goes stale |
| Gate exception consumption | guarded action | exception row | `WHERE state='granted'` + `UNIQUE … WHERE state='granted'` | single use |
| External act authorization + exposure | `core.authorize_external_act` | application update, `pay_application_state` share, `pay_ta_exposure` update | open-act partial unique; `pay_exposure_reservations UNIQUE(logical_effect_key)`; aggregate row | no double act; exposure compared and reserved atomically per TA across all groups |
| External act evidence | `ops.record_act_evidence` → Core | application update, authorization row | `WHERE act_state = $from` | stale evidence ⇒ `stale_revision` |
| Ceiling change vs reservation | `pay.lower_ceiling`/`approve_ceiling_increase` vs reservation | `pay_ta_exposure` update | revision; distinct approver CHECK | serialized per TA |
| Withdrawal vs authorization | `core.request_withdrawal` vs `core.authorize_external_act` | application update | `core_withdrawals UNIQUE … accepted`; open-act check under the same lock | only one wins; the other is blocked on retry |
| Hold open/close vs authorization/packet release | `core.report_problem`/`formal_return`/`flag` vs authorize/release | application update | `hold_revision`; `UNIQUE(application, kind) WHERE open` | authorization after a hold commit is blocked |
| Readiness record | `ops.record_readiness` | application share | `UNIQUE(application) WHERE current`; fingerprint | stale basis rejected at use |
| Correction | `core.edit_draft`/`correct_identity`/`correct_from_evidence`/`record_assistance_entry`, `core.applyIntakeCorrection` | application update | expected revision; `setApplicantKey` on applicant-key change: open-scope index **and** the later-attempt / no-refiling rule (rev 2, MON-04) | `stale_revision`; `conflict_duplicate`; `later_attempt_declaration_required`; `reconciliation_exhausted_no_refiling`; no latest-write-wins (B19) |
| Packet release (rev 2, COV-03) | `core.release_packet` | application update, packet row | `core_packet_releases UNIQUE(application_id)`; Delivery conditional `built → released`; readiness exception single use | one release acceptance; Delivery never releases on its own |
| Fee-carrying act (rev 2, MON-01) | `core.authorize_external_act` | as authorization | `feeCarryingAct(decl)`; `carries_fee` CHECKs; `pay_exposure_reservations UNIQUE(logical_effect_key)` with the attempt-ordinal key | exactly one reservation per logical fee effect; a non-fee-carrying fee act is refused |
| Same operation key on an insert guard (rev 2, MON-05) | any insert-guarded command | guard index | runner extra attempt finds the committed operation | the second execution replays (`replayed: true`) |
| Dependency vs upstream outcome | `core.record_outcome` (upstream) vs dependent authorization | both application rows (ascending id) | revisions | dependent sees the committed upstream outcome |
| Artifact eligibility vs release | `ops.report_wrong_recipient`/`replace` vs `dlv.retrieve_*` | `ops_artifacts`/`doc_versions` update vs share | conditional state | check before commit decides; later change is the accepted interval (B12) |
| Completion | `core.check_completion` | application update | `core_completions UNIQUE(application_id)`; lifecycle conditional | one completion |
| Group end | `core.group_end_sweep` record (per application) | group update, application update | lifecycle conditional; eligibility re-evaluated under lock | concurrent new work makes the application ineligible |
| Group closure vs new draft | `core.close_group` vs `core.create_draft` | group update vs share | group state conditional | no draft in a closed group |
| Blob reference vs cleanup | owner registration vs `blob.cleanup_staging` | blob row | conditional state updates | exactly one wins |
| Task lease / record | kernel | task row | lease token HMAC + state | stale runner's record rejected |
| Email send marker | `mail.deliver` prepare | task row, email send row | `effect_started_at`; `UNIQUE(resend_of)` | no automatic resend |
| OTP verification | `iam.verify_ta_otp`/`staff_sign_in` | challenge row | conditional `state='issued' AND attempts_used < max AND expires_at > now` | single use, bounded attempts |
| Email change switch | `iam.confirm_email_change` | account update, change row | both proofs present; email partial unique | switch email + revoke sessions together (B09) |
| SuperAdmin elevation / ceiling increase | `iam.approve_elevation`, `pay.approve_ceiling_increase` | target row | distinct-approver CHECK + active SuperAdmin re-check | no self-approval |
| Account suspension | `iam.suspend_account` | account update | status conditional | sessions revoked in the same commit |
| Admission close / cutover | `closeAdmission` | `sys_installation` update (waits for share locks) | epoch increment | in-flight commands finish or fail; none starts |
| Protection mark | `tm restore mark` → `core.recordProtectionMark` | application update | `UNIQUE(application_id, restore_id)` | retry creates nothing (B41) |
| Restore scope (rev 2, REC-05) | `tm restore scope` | `sys_restores` row | conservative candidate set computed from restored state + evidence sources; every exclusion needs a per-id reason; `scope_state` | an incomplete scope keeps `scope_state = 'unknown'`; `openAdmission` refuses |
| Restore boundary for tasks (rev 2, REC-06) | `tm restore` step 6 | `sys_tasks` rows | every non-terminal `non_repeatable` task ⇒ `cancelled_obsolete` with `restore_boundary` | no automatic resend after reopening (B40) |

## 12. Web conventions (`src/web`)

### 12.1 Routes

| Surface | Prefix | Auth | Examples |
|---|---|---|---|
| Public | `/`, `/countries/:slug`, `/about`, `/search`, `/robots.txt`, `/sitemap.xml` | none | static, crawlable, indexable; canonical HTTPS URLs; unique title/description (B01) |
| Sign-in | `/sign-in`, `/sign-in/verify`, `/staff/sign-in`, `GET`/`POST /staff/enrol`, `GET /staff/enrol/setup`, `POST /staff/enrol/confirm` (rev 2, record 11 CCR-02: no token in any URL), `/sign-out` | anonymous / session | CAPTCHA on TA OTP request |
| TA | `/ta/...` | TA session | `GET /ta/groups`, `GET /ta/applications/:applicationId`, `POST /ta/applications/:applicationId/submit` |
| Operator | `/ops/...` | operator session + MFA | `GET /ops/work`, `POST /ops/applications/:applicationId/readiness` |
| SuperAdmin | `/admin/...` | SuperAdmin session + MFA | `GET /admin/queues/assignment`, `POST /admin/applications/:applicationId/assign` |
| Accounts | `/accounts/...` | operator + accounting grant, or SuperAdmin | PARKED boundary page only |
| Operation lookup | `/{ta,ops,admin}/operations/:operationKey` | session | lost-acknowledgement lookup (Section 4.4) |
| Health | `/healthz` (loopback only) | none | allowlisted categories: entry, command, database, byte, worker, cleanup, backup, projection, clock (B38) |

Naming: `GET /<surface>/<collection>`, `GET /<surface>/<collection>/:id`, `POST /<surface>/<collection>` (create), `POST /<surface>/<collection>/:id/<verb>` (one command per route, kebab-case verb). Each route has a `routeId` (`ta.application.submit`) used in diagnostics. There is no generic table-mutation route (B08). Every route declares its `Action` and resource resolver; a route without a policy call fails T-F02.

Route registry (rev 2, COV-14/BND-11 partial): record 11 §4.4 is the single path inventory. The action and command of each route MUST be the ones of Sections 5.2 and 6 of this record. Rows corrected in revision 2: individual application entry is only `POST /ta/groups/:groupId/intake/individual` → `intake.start_individual` (no direct `core.create_draft` route, B14); `/ops/applications/:id/packet/build` → `ops.request_packet_build`; `/ops/applications/:id/packet/release` → `core.release_packet`; `/ops/applications/:id/wrong-recipient` → `incident.report_disclosure` / `ops.report_wrong_recipient`; `/admin/failures` → `failure.classify` / `ops.classify_failure` (SuperAdmin only; no operator route). Remaining path-name differences between records 11–15 are the recorded P1 item COV-14/BND-11 (register 02 §C); until resolved, implementation lanes use the record 11 path and the action named here.

### 12.2 State-changing requests

- Method `POST` only. Body `application/x-www-form-urlencoded` or `multipart/form-data` (uploads), with per-route size limits.
- Hidden fields: `_op` (operation key generated at render), `_csrf`, `_rev` (expected revision, one per aggregate shown), `_reason` where required.
- CSRF: synchronizer token = HMAC-SHA-256(`csrf_key`, session id ‖ route form id); anonymous forms bind to a pre-session cookie `__Host-tm_pre` (random, signed `nonce ‖ issuedAt`, 30 min; rev 2, record 11 CCR-08). Mismatch ⇒ 403 page, no command.
- Origin: `Origin` MUST equal a configured origin; if absent, `Referer` origin MUST match; if both absent ⇒ refuse.
- Response: `303 See Other` to the resource page or `/…/operations/:op`. Errors re-render the form with closed-code messages and the same `_op`; a changed form gets a new `_op`.

### 12.3 Session cookie

`__Host-tm_sess` (HTTPS, or loopback HTTP in local test), `HttpOnly`, `Secure`, `SameSite=Lax`, `Path=/`, no `Domain`. Value: 32-byte random token; database stores only `HMAC(session_key, token)`. Sign-in rotates the token. Idle and absolute expiry per configuration. Staff sessions require `mfa_verified_at`. Support-view mode is a flag on the SuperAdmin session with a visible banner; it never changes the cookie identity.

### 12.4 Rendering and headers

- Server-rendered HTML through an auto-escaping tagged template (`html\`…\``); raw insertion only via `trustedHtml()` for static assets reviewed in code.
- Headers on all pages: CSP `default-src 'none'; img-src 'self'; style-src 'self'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'; script-src 'self'` (rev 2: EO-08 progressive enhancement; no inline script, no `eval`; the ALTCHA widget uses its CSP-compatible build with same-origin worker and stylesheet, parked P2 note BND-19); `Referrer-Policy: no-referrer`; `X-Content-Type-Options: nosniff`; HSTS on HTTPS.
- Authenticated pages: `Cache-Control: no-store`, `<meta name="robots" content="noindex,nofollow">` and `X-Robots-Tag: noindex, nofollow`. `robots.txt` disallows `/ta/`, `/ops/`, `/admin/`, `/accounts/`, `/sign-in`, `/staff/`.
- Error pages render the category and code message; never stack traces, SQL, library messages or echoed personal data. `not_found_or_forbidden` uses one 404 page for all object routes.

### 12.5 Byte responses

- Only through `POST` routes (`/ta/applications/:id/documents/:versionId/retrieve`, `/ta/selections`, and rev 2 `/ops/incidents/:incidentId/artifacts/:artifactId/review-copy` for the `staff_review` channel), session + CSRF + `_op`, the release check of Section 6.9 for each file, then streaming.
- Headers: `Content-Type` = verified media type; `Content-Disposition: attachment; filename="<safe generated name>"` (never the uploaded name); `Cache-Control: no-store`; `Content-Security-Policy: sandbox; default-src 'none'`; `X-Content-Type-Options: nosniff`; no `Range` support.
- Bulk selection ZIP (`yazl`): every item checked and verified individually; per-item result recorded; unavailable items are listed in a `results.txt` entry with closed codes; nothing substituted.
- A mid-stream failure destroys the connection and records `stream_failed`; it never claims success.

## 13. Foundation invariant tests (milestone 1 MUST pass before substantial consumers, B41)

All tests run against a real PostgreSQL 16 database (per-file template clone), real `bwrap` workers and real `clamd` where named. "Prove" means assert persisted rows, facts and absence of forbidden effects, not only responses.

| ID | Test | Proves |
|---|---|---|
| T-F01 | Static: every SQL `INSERT/UPDATE/DELETE` in `src/modules/<m>` targets only `<m>`'s prefix; kernel tables only through kernel API | sole writers (B34) |
| T-F02 | Static: every route and query registers an `Action` and calls `policy.authorize`/`scope` | single policy (B10) |
| T-F03 | Static: modules import other modules only via `api.ts`; no import cycles at load | owner interfaces |
| T-F04 | Static: `commands/` files import no effect facility (mail, workers, scanner, fs blobs, net) | no side effect in transactions |
| T-F05 | Every closed set equals its database CHECK list; every guard constraint is in `GUARD_CONSTRAINTS` | closed sets, guard registry |
| T-F06 | `tm_app` cannot UPDATE/DELETE/TRUNCATE `sys_facts`, `sys_operations`, `pay_service_entries`; `tm_owner` UPDATE also raises `TM001`; `tm_app` cannot run DDL | append-only history, distinct migration authority |
| T-F07 | Harness command that changes state without a fact is rejected by the runner check | history with every acceptance |
| T-F08 | Same key + same content replays recorded result; handler not re-run (counter); facts not duplicated | operation identity |
| T-F09 | Same key + different content ⇒ `conflict_operation_key`; nothing written | changed-content conflict |
| T-F10 | Replay after the actor lost access ⇒ `not_found_or_forbidden` | re-authorized result lookup |
| T-F11 | Fault `command.lose_ack`: client sees `outcome_unknown`; resubmit with same key ⇒ replay; exactly one effect | lost acknowledgement |
| T-F12 | Two concurrent clients run the same key; exactly one operation row and one effect; rev 2 (MON-05): for an insert-guarded command (`core.acceptIntakeProposals` via the form, `core.grant_gate_exception`, `core.request_assistance`, `core.flag`) both responses are `accepted`, one with `replayed: true`, never `conflict_duplicate` | concurrent same key (B35) |
| T-F13 | N concurrent creators of the same (group, offering, applicant key) with different keys on an empty group ⇒ exactly one application; others `conflict_duplicate`/`matched_existing` | empty-scope race (B35) |
| T-F14 | Forced 40001 on attempts 1–2 ⇒ success on 3 with the same operation key; exhaustion ⇒ `conflict_retry_exhausted` and no rows | bounded whole-command retry |
| T-F15 | Stale `_rev` ⇒ `stale_revision`; no write | no latest-write-wins |
| T-F16 | Concurrent assignment of one application by two SuperAdmins ⇒ one active assignment | assignment guard |
| T-F17 | Gate exception consumed by two concurrent actions ⇒ one succeeds; Gate 1 exception does not satisfy Gate 2; stale basis refused | exception scope/freshness/consumption |
| T-F18 | Concurrent reservations for one TA across two groups never exceed the ceiling; retry of one authorization reuses one reservation; breach blocks after a Gate 2 exception; rev 2: the key is `govfee:<app>:<attempt ordinal>` for both fee timings, and a fee act authorized after the evidenced submission of the same attempt reuses the same key | TA-wide exposure (B28) |
| T-F19 | Authorization + reservation: fault after reservation write before commit ⇒ neither persists | atomic cross-owner commit |
| T-F20 | `tailFacts` never skips a fact when a lower `seq` commits after a higher one (two interleaved transactions) | projection watermark (C-04) |
| T-F21 | Facts carry actor, command, operation, subject, before/after, reason, evidence, release; support-view actor cannot append | audit shape (B33) |
| T-F22 | Exposure aggregate equals the sum of reservation/fee rows after randomized concurrent operations (rev 2 formula with `converted_paise`; a payment below the reservation never lowers counted exposure) | money invariant |
| T-F23 | Task at-least-once: crash after effect before record ⇒ idempotent task re-runs once with one owner effect; `non_repeatable` task ⇒ `effect_uncertain`, no second send | task semantics, no automatic resend |
| T-F24 | Task on behalf of a TA suspended mid-flight ⇒ `cancelled_revoked`; no business write | revoked work inherits nothing |
| T-F25 | Expired lease reclaimed; the old runner's record is rejected by token HMAC | lease fencing |
| T-F26 | `closeAdmission` waits for an in-flight command, increments epoch; old process refuses next command and exits; restart stays in maintenance; old release cannot register | admission, fencing, maintenance survives restart (B39) |
| T-F27 | Blob: reference vs cleanup race ⇒ exactly one wins; cleanup never removes referenced or canonical bytes; crash after rename repaired | staged-file safety (B36) |
| T-F28 | Byte read with corrupted/missing file ⇒ no bytes sent, `bytes_unavailable`, owned incident | integrity before availability (B12) |
| T-F29 | Worker, **on this host with the real rev 2 launch line** (BND-01): Node starts inside the cgroup scope; an allocation beyond `memoryBytes` is killed; a fork bomb stops at `maxTasks`; `tesseract` and `qpdf` resolve their libraries inside the sandbox; parse worker has no network (connect fails), timeout kills the process group and the scope, oversize stdout rejected, contract check works; clamd unavailable ⇒ `scanner_unavailable` fail closed; EICAR ⇒ rejected | facility seams (B36, B38) |
| T-F30 | Every fault point is reachable; `TM_FAULTS` refused outside test; fault control null in `local_test` | test-only faults |
| T-F31 | Diagnostics: a request carrying an email, passport-like string, URL with query and OTP produces log output containing none of them | allowlisted diagnostics (B33) |
| T-F32 | Policy: wrong-TA, unassigned operator, expired/revoked grant, suspended account and support view each get `not_found_or_forbidden` on read, list, search, direct link, operation lookup and byte route; lists apply the same predicate | object access (B10) |
| T-F33 | Clock: backward/forward fake-clock jumps do not reorder facts; OTP attempts still bounded; skew > limit stops group-end sweep | clock basis (B25) |
| T-F34 | Control evaluator returns all blockers in stage order for a synthetic application in a matrix of states; projections are not read (instrumented) | single control function |
| T-F35 | Secrets: wrong directory mode refuses start; `Secret` never serializes; rotating `job_credential_key`/`session_key` invalidates old leases/sessions | secret handling, restore precondition |
| T-F36 | Rev 2 (COV-01): static — every `decl.<path>` read in `src/modules` is a `DECL_ITEM_KEYS` key or a field inside one; every synthetic declaration parses with `parseDecl`; every item key appears in the dependent-action table or is display-only | one declaration schema (B05) |
| T-F37 | Rev 2 (BND-08): compose-time — every cross-module function a consumer imports exists in the owner's `api.ts` with the signature of Section 6 (type-level test plus a runtime registry check) | owner interfaces (B34, B41) |
| T-F38 | Rev 2 (REC-04): a task whose effect kills the process on every lease reaches `failed_terminal` / `lease_expired_exhausted` after `max_attempts` runs, with backoff between runs and its failure owner; other task kinds keep running | bounded retry, failure visibility (B35, B36) |
| T-F39 | Rev 2 (REC-07): a country adapter that throws during (a) a refused command and (b) a read-only page render still yields exactly one owned `country_defect` incident for that country (dedupe), and no read transaction writes | country attribution (B36) |
| T-F40 | Rev 2 (REC-01, REC-02): a backup taken while a promote/publish move is pending restores the exact bytes; a task record racing `closeAdmission` is either in both the dump and the blob inventory or in neither (snapshot export); `last_fact_seq` matches the dump | consistent recovery set (B40) |
| T-F41 | Rev 2 (REC-03): restore into a new cluster → reopen → a new command's fact appears in lists and the audit search; restored facts are searchable; `max(sys_facts.tx_id)` of the source is below the restored cluster's next `xid8` | projection after restore (B33, B40) |
| T-F42 | Rev 2 (REC-05, REC-06): interval-loss restore with an incomplete scope keeps `scope_state = 'unknown'` and `openAdmission` refuses; after a complete scope and reopening, zero transport calls happen for tasks restored as `pending`/`failed_retryable` (`cancelled_obsolete` / `restore_boundary`) | closed lossy restore, no blind repeat (B40) |
| T-F43 | Rev 2 (MON-01, MON-02): fee timing `separate_act` and `with_submission`: reserve, file, `ta_liability_paise` = paid amount, `filing_unknown` ⇒ `payment_unknown`, `not_filed_evidenced` ⇒ fee back to `reserved`; a `government_fee_payment` act on a `with_submission` or `no_government_fee` declaration is refused (`fee_act_not_declared`); not-filed → re-authorization leaves exactly one reservation row | fee and exposure correctness (B27, B28) |
| T-F44 | Rev 2 (MON-03): fee act `not_filed_evidenced`, payment corrected to `not_received`, then a submission authorization is blocked with `gate2_payment_not_received` (no `same_attempt` basis); a Gate 2 exception is grantable in that state | Gate 2 before the actual first commitment (B27) |
| T-F45 | Rev 2 (MON-04): an identity correction (TA, assistance entry, SuperAdmin) that re-keys an application into a scope holding a closed application is refused (`later_attempt_declaration_required`); into a scope with a `reconciliation_exhausted` act it is always refused | no blind repeat filing (B03, B23) |
| T-F46 | Rev 2 (SEC-01, SEC-02): an eligible artifact is released to its verified application on web retrieval, bulk selection and document email; the same artifact version requested against any other application of the group is denied; a `pending_review` artifact is denied on every TA channel and released only on `staff_review` to the incident owner or reviewer; after `blockVersion` the review copy is denied; another operator or a TA gets `not_found_or_forbidden` | exact artifact release (B12, B13) |
| T-F47 | Rev 2 (BND-04, COV-11, COV-12, BND-05): a release-registered (engineering) declaration with a non-unresolved owner-gated value is `unsupported` / `owner_approval_required` until a SuperAdmin records an owner approval listing that key; a declaration naming an actor or authority kind outside the closed sets is refused at registration; a dependency on an external upstream is refused | engineering cannot settle parked policy (B05, B43, B44) |
| T-F48 | Rev 2 (COV-13 item 9): an engineering `maintenanceAllowed` command runs while admission is closed for `cutover`; the same command is refused while open or closed for `maintenance`/`emergency`/restore; every account command is refused while closed | release registration while closed (B39) |
| T-F49 | Rev 2 (REC-20): after a restore with new secrets, re-recording the same physical original in the same group returns `original_already_recorded` | durable once-only guard (B30, B40) |
| T-F50 | Rev 2 (SEC-05, REC-18 part): after `tm backup create`, `tm cutover checkpoint` and a crash in the middle of each, no plaintext dump or blob copy exists under the install, checkpoint or backup directories | encrypted recovery sets (B40) |

## 14. Owner-decision register and recorded interpretations

### 14.1 Genuine owner-decision candidates (B47)

None blocks the foundation milestone. Each has a safe interim behaviour that the foundation implements. Revision 2: the consolidated register of all owner decisions (OD-01..04 below, the module candidates and the new OD-R2-01..08 from the design review) is `internal/records/design/02-owner-decision-register.md`; that register governs where it differs from this list.

**OD-01 — Meaning of `payment_received` before price fixation (assistance on drafts).**
- Spec text: B26 "Before assignment/operator work, including approved assistance, require current `payment_received` or a fresh application-specific Gate 1 exception." B17 "Formal TA submission fixes that application's one-time quoted price". B29 "Write-off authority/evidence, refunds, assistance charging, price-versus-government-fee formula and other-mode fee policies remain unselected."
- Why unknowable: assistance can be approved for a draft, which has no fixed price, and assistance charging is unselected. The spec does not say what amount or obligation `payment_received` attests before submission.
- Safe interim: `payment_received` is the SuperAdmin's manual attestation with evidence; the system computes and validates no amount for drafts. A SuperAdmin either records that status with evidence or grants a Gate 1 exception, which opens a financial exception. No charge is inferred.
- Independent work: everything except a business rule for assistance pricing.

**OD-02 — Does an attributed manual operator email satisfy the email part of completion evidence?**
- Spec text: B24 "For a TravelMudra-held electronic result, document-carrying email to the owning TA plus web notification evidence hold completion; a TA download does not. A manual operator email requires attributed record and is not claimed system-verified." B46 "uncertain-email handling/ownership are deliberately unresolved until the product owner's UAT decision".
- Why unknowable: B24 records manual email but does not say whether it counts for completion; B46 reserves the related delivery/completion interaction for UAT.
- Safe interim: the completion check counts only system-recorded `accepted`/`synthetic_accepted` sends; an application whose only email evidence is manual shows `completion_check_trigger_unselected` pending. Proposed to fold into the B46 UAT decision.
- Independent work: all delivery evidence recording, release checks and notices.

**OD-03 — Dimension of launch "scope" (B07).**
- Spec text: B07 "One individually attributed SuperAdmin role approves and records offering launch/scope expansion, suspension and lifting with actor, reason, evidence and scoped readiness. … Lifting restores only previously approved scope."
- Why unknowable: the spec does not define what a scope partitions (TA audience, applicant segment, route variant).
- Safe interim: scope = offering × audience (`all_active_tas` or a named TA list). Expansion only widens the audience. This infers no launch: every launch still needs an attributed SuperAdmin approval with evidence.
- Independent work: all; a different dimension changes only `ops_launch_decisions.audience` and `launchDecision`.

**OD-04 — Staff TOTP enrolments across a restore.**
- Spec text: B40 "Restore into isolated namespace, closed ingress/byte/outbound/internal work, new secrets and unusable old sessions/OTP/job credentials." B41 "For restore, prove new secrets, unusable old credentials". B08/B11/B44: first-admin and all-admin-loss recovery are unselected.
- Why a contradiction risk: if "old credentials" includes staff MFA enrolments, every SuperAdmin loses MFA at restore, which is total admin loss, a recovery path the spec leaves unselected; the installation could then never reopen.
- Safe interim: restore installs new secrets for all keys; sessions, OTPs, enrolment tokens and lease tokens become unusable; TOTP seeds are re-wrapped from the old `totp_wrap_key` (held in key custody) to the new key, so staff MFA enrolments survive. A compromise-driven restore that must reset MFA remains blocked by the unselected all-admin-loss policy.
- Independent work: all; affects only `tm restore`.

### 14.2 Recorded interpretations (not escalated; promote to an owner decision if the owner disagrees)

| ID | Topic | Interpretation | Basis |
|---|---|---|---|
| I-01 | B25 "outstanding money" | Means open financial exceptions, reserved or TM-paid-unrecovered fees and unknown fee payments. The unpaid quoted price of an application with no operator work is not "outstanding money"; otherwise the rule that targets "an unpaid application" could never apply. | B25 text structure |
| I-02 | Gate 1 at reassignment | Reassignment is an assignment and re-evaluates Gate 1; an unpaid case needs a fresh exception for the new assignment. Until then the duty is SuperAdmin-owned. | B26 "before assignment" |
| I-03 | Readiness-gate exception scope | Only for validity `previous_operator` after reassignment; never for missing, stale or held readiness. | B19, B18, B20 |
| I-04 | Group travel-date edits on assigned applications | Allowed as a group fact; assigned unfiled applications become `stale_basis` (filing and packet paused until reconfirmation); filed facts stay historical. | B06 is specific; B18 governs application information |
| I-05 | Third-party provider handoff | Requires an approved provider data-sharing route in the declaration with outside-product owner approval; none exists, so the action is unavailable. | B04, B15, B42, B44 |
| I-06 | Group read grant content | Read-only metadata and document bytes of that group's applications, through the release check; grantee must be an operator. | B10 |
| I-07 | Incident reviewer view | Reviewer sees the artifact (rev 2: through the recorded `staff_review` byte channel only, Section 6.9) and minimal candidate identifiers listed on the incident; no case action, no filing authority, no Gate 1. | B13 |
| I-08 | Applicant identity key | Draft creation requires passport number + issuing country (applicant key). Rows without them become intake incidents; no name-based matching. Rev 2: a possible duplicate person with a different passport number (MON-10) is a recorded P1 item, not detected in this build. | B03, B15 |
| I-09 | TA account | One TA account is one person and one TravelAgent work scope; exposure ceilings are per TA account. Rev 2: **escalated** as owner decision OD-R2-01 (business-wide ceiling); this row is the interim. | B08, B03, B28 |
| I-10 | Travel dates required | Group creation requires travel start and return dates; B25 needs the return date. | B25, B06 |
| I-11 | Outcome correction | Set once; SuperAdmin evidence correction only before completion and before dependent delivery; otherwise an owned incident. | B18, B19 |
| I-12 | Suspension and submission | Submitting an existing draft during suspension follows the recorded existing-work treatment (`continue` ⇒ allow, `hold`/`missing` ⇒ hold); withdrawal always refuses submission. | B07 |
| I-13 | Accounts nudge | A persistent staff notice to the accountable SuperAdmin while a financial exception is open; no cadence, no email. | B29 |
| I-14 | Protection mark resolution | A SuperAdmin resolves a mark through `core.resolve_protection_mark` with evidence after reopening; the mark blocks authorization, packet release, byte release and gate decisions for that application until then. | B40 |
| I-15 (rev 2) | Preparation-only handover evidence | `outcomeEvidence.handover` (TA retrieval of the released packet, or a recorded physical handover to the TA) is structure that an engineering release MAY declare (B04 defines the end state; B05). B24's "a TA download does not" applies to TravelMudra-held electronic **results**, not to a preparation packet; B44 parks only post-handover policy and the cut-off. Part (d) of review finding BND-04 is rejected on this basis. | B04, B05, B24, B44 |
| I-16 (rev 2) | Unresolved withdrawal cut-off | A submitted application whose governing declaration has no supported withdrawal cut-off cannot be withdrawn by the ordinary path (`withdrawal_cutoff_undeclared`); the former record 13 I-C2 ("available before packet release") is withdrawn because it made packet release an undeclared cut-off. | B24, B44 |
| I-17 (rev 2) | Gate 2 "whichever first" | "First commitment" means the first act that may have committed the government fee or submission; an act with positive non-execution evidence did not commit, so the next act is evaluated again. | B27, B23 |

### 14.3 Deliberate boundaries implemented as visible unavailable states

PARKED: reservation release and fee-exclusion record and the paid case at the default ₹0 ceiling (B28); Accounts dashboard actions and Payment Records mutation path for Accounts (B29); custody route policy incl. recipient evidence for returns (B30); first-admin and all-admin-loss recovery, lost-mailbox recovery, TA eligibility/fraud policy, generic cancellation, provider routes, country-specific unknown-filing recovery (B44). Unselected: write-off, refunds, assistance charging, price-versus-fee formula, other-mode fee policy (B29, B43). KNOWN_LIMITATION: delivery send trigger, completion-check trigger/owner, uncertain-email handling (B46). EXCLUDED: applicant portal, payment gateway, automated filing/payment, autonomous assignment, imports/integrations, automatic deletion, third-party data sharing (B42). Each surfaces with the reason codes in Section 8.4; none is replaced by an inferred default.

## 15. Revision 2 — review fixes and change-request dispositions (2026-10-04)

### 15.1 P0 fixes applied in this record (class of failure removed)

Priorities follow the review ledger. "Upgraded" means a P1 that is a demonstrable spec violation and was treated as P0.

| Finding | Class of failure removed | Where |
|---|---|---|
| COV-01, BND-02 | Two incompatible `decl/1` schemas; readers depended on keys the parser never produced | Section 9.2 (one normative schema, one parser module, T-F36); record 12 §2.1–2.2 aligned |
| COV-02, MON-02 | Three definitions of the exposure logical effect key | Section 1.1 (attempt ordinal), §1.3 constructor, §3.5, §8.6 step 0, §8.5 basis; record 15 Algorithm R |
| COV-03 (BND-10) | Two owners of packet build and release | §3.5 `core_packet_releases`, §3.10, §6.4, §6.9, §6.11, §11, §12.1; record 15 C-D4/C-D5 removed |
| MON-01 | The fee-carrying act was undefined for `with_submission`; a non-fee act could be authorized as a fee act | §7.4 `feeCarryingAct`, §3.5 `carries_fee`, §6.4, §6.11, §8.3, §11, T-F43 |
| MON-03 | Gate 2 was skipped after a not-filed first act | §2.11 Gate 2 row, §8.3, §8.5, I-17, T-F44 |
| MON-04 | Re-keying an application into a closed scope bypassed the later-attempt and no-refiling bar | §3.5 `setApplicantKey`, §6.4, §7.1, §11, T-F45 |
| SEC-01 | Artifact release could never pass (wrong association owner) or would pass without per-application association | §2.15, §3.7, §5.1 relations, §6.9 order (steps 5–6c), T-F46 |
| REC-01 | Referenced staging blobs were not captured in backups | record 15 §3.5.1 (inventory by owner reference in any area); T-F40 |
| REC-02 | Backup without drain or snapshot; kernel record steps unfenced after closure | §4.6 (`assertWriter` on every step), §4.7, §3.2 `sys_backup_sets.snapshot_name`; record 15 §3.5.1; T-F40 |
| REC-03 | `xid8` watermark broke after `pg_restore` into a new cluster | record 15 §3.5.2 (xid epoch advance + projector rebuild); T-F41 |
| REC-04 | Lease recovery retried poison tasks without bound | §4.6 Lease and Recover rows; T-F38 |
| REC-05 (BND-18) | Interval-loss scope declared by inclusion only | §3.2 `sys_restores.scope_basis`, §4.7 `openAdmission`, §11; record 15 §3.5.3; T-F42 |
| REC-06 | Restored non-repeatable tasks could resend after reopening | §11; record 15 §3.5.2 step 6; T-F42 |
| REC-07 | Country-defect attribution rolled back with refused commands and wrote in read transactions | §2.21 `ops.attribute_country_defect`, §4.2 step 8, §4.13; record 14 §3.4.6; T-F39 |
| BND-01 | Worker launch line could not run on the recorded host | C-08, §10.3, §10.11, T-F29; register 02 §B |
| BND-03 (COV-07) | Invented preparation-only withdrawal cut-off (I-C2) | §7.1 withdrawal row, I-16; record 13 §3.12, §9.2 |
| COV-06 (upgraded) | Draft creation refused unknown population values (B14) | §8.3 `create_draft` row (record 14 CCR-07) |
| COV-11, BND-04, COV-12 (upgraded) | Engineering releases could settle parked/unselected policy or a new actor/authority shape | §9.2 G items and shape rule, `cat_owner_approvals`, T-F47 (BND-04 part (d) rejected, I-15) |
| BND-05 (upgraded) | Invented external-evidence dependency kind | §3.5 `core_dependencies`, §9.2 `dependencies` |
| MON-05 (upgraded) | Concurrent same-key execution answered `conflict_duplicate` instead of replay | §4.2 step 5, §4.4, §11, T-F12 |
| MON-06 (upgraded) | Outcome correction left dependent states stale | §7.1 rows `dependency_failed` and outcome correction; record 13 §3.11.3 |
| MON-09 (upgraded) | Harness completion could close an unpaid, unworked application before group end | §7.1 `completed` row; record 13 §2.3.4 E7 |
| REC-13 (upgraded) | Group-end sweep re-selected the same 200 rows forever | §7.1; record 13 §5.1 cursor |
| REC-17 (upgraded) | A terminally failed blob move left a version without owner | §2.21, §4.6 hooks, §4.12 rule 9; record 14 §5.1 |
| REC-20, SEC-09 (upgraded) | A durable once-only key depended on a rotating secret | §1.1 durable dedupe keys, §3.8 `ops_originals.item_key`, T-F49 |
| SEC-02 (upgraded) | No authorized byte path for the B13 secondary review | §2.18 `staff_review`, §5.2–5.3 `document.retrieve_for_review`, §6.9, §12.5, T-F46 |
| SEC-05 (upgraded), REC-18 (encryption part) | Plaintext dumps and blob copies at rest | §3.2 `sys_checkpoints.encrypted_sha256`, `disposed`; record 15 §3.4.2, §3.5.1; T-F50 |

### 15.2 Change-request dispositions

Accepted requests are integrated in the sections named; their detail stays in the module record. Rejected requests MUST NOT be implemented.

| Request | Disposition | Integrated in / reason |
|---|---|---|
| 11 CCR-01 OTP 8 digits | Accepted | §1.1 |
| 11 CCR-02 enrolment routes without token in URL | Accepted | §12.1 |
| 11 CCR-03 pure CAPTCHA + `identity.consumeBotCheck` | Accepted | §3.3, §6.2, §10.7; record 14 C-I2 aligned |
| 11 CCR-04 `iam.send_mail` | Accepted | §2.21, §10.6, C-09; record 15 §1.2 aligned |
| 11 CCR-05 identity facts and subject types | Accepted | §2.22, §2.23 |
| 11 CCR-06 identity columns | Accepted | §3.3 (detail record 11 §2) |
| 11 CCR-07 identity guards | Accepted | §3.3 |
| 11 CCR-08 pre-session 30 min | Accepted | §12.2 |
| 11 CCR-09 `operatorDuties`, `incidentsOwnedBy` | Accepted | §6.4, §6.7; record 13 §3.20 defines them |
| 11 CCR-10 identity commands | Accepted with edit | §6.2; the seed is `harness.iam.seed_synthetic` (actor kind `harness`) |
| 11 CCR-11 enrolment session scope, session touch | Accepted | §4.2 step 4d; session touch is a C-05 technical step |
| 11 CCR-12 deny document email on recipient change | **Rejected** | B31 requires the owning TA's *current* email; after a completed two-proof change (B09) the refreshed snapshot (record 15 I-15-05) is correct, and a denial would leave a send neither failed nor resendable. §7.8 |
| 11 CCR-13 engineering writes seed facts | Accepted with edit | actor kind `harness`, not `engineering` (§2.24) |
| 11 CCR-14 `otpauth` to devDependencies | **Rejected** | EO-02 records the product owner's direction to prefer mature libraries for security-sensitive code, naming TOTP; brief §1.1 pins `otpauth` as runtime. RFC 6238 vectors remain the test oracle. C-10 |
| 11 CCR-15 configuration keys | Accepted | §10.9 |
| 11 CCR-16 staff self-service email change | **Not accepted in this build** | optional scope extension the spec does not define; the visible state `staff_email_change_unavailable` stays (code kept in §8.4) |
| 11 CCR-17 identity reason codes | Accepted except `recipient_changed` | §8.4 |
| 11 CCR-18 guard registry category | Accepted | §4.2 |
| 11 CCR-19 clock health to policy | Accepted | §4.9, §5.1 |
| 12 CCR-01 engineering catalogue release commands | Accepted with edit | §2.24; run as maintenance commands during cutover verify (§4.2, §9.4) |
| 12 CCR-02 catalogue reason codes | Accepted except `travel_rule_passport_validity` | §8.4; passport validity is a Documents check (§9.2) |
| 12 CCR-03 facts, `lpl` prefix | Accepted | §1.2, §2.22, §2.23 |
| 12 CCR-04 catalogue actions | Accepted | §5.2, §5.3 |
| 12 CCR-05 derived binding support | Accepted | §3.4 |
| 12 CCR-06 `CatalogueApi` additions | Accepted | §6.3 |
| 12 CCR-07 Core writers for continuation, transition, price increase | Accepted with edit | §6.4 (price invariant stated; COV-09) |
| 12 CCR-08 `ensureOfferingControls` | Accepted | §6.7 |
| 12 CCR-09 `catalogue.read_selectable` | Accepted | §5.3 |
| 12 CCR-10 synthetic provider route | Accepted | §2.13 |
| 12 CCR-11 capability `sourceDigest`, manifest sections | Accepted | §9.4 |
| 12 CCR-12 `ControlBlocker.ref` | Accepted | §4.8 |
| 12 CCR-13 append-only catalogue records | Accepted | §3.1 |
| 12 CCR-14 catalogue and launch column sets | Accepted | §3.4 |
| 12 CCR-15 catalogue configuration keys | Accepted | §10.9 |
| 12 CCR-16 stage 11 under `cat_offerings FOR SHARE` | Accepted | §8.3 |
| 13 CCR-01 forecasts | Accepted | §1.2, §3.5 |
| 13 CCR-02 `core_packet_releases`, `core.release_packet` | Accepted | §3.5, §6.4, §6.9 (COV-03) |
| 13 CCR-03 attempt ordinal | Accepted with edit | §1.1, §2.11 (`same_attempt` only when a commitment may have happened, MON-03) |
| 13 CCR-04 controlled action `reassign` | Accepted | §2.11, §2.14, §8.3 |
| 13 CCR-05 confirmed-unfiled definition | Accepted | §7.1 |
| 13 CCR-06 `core.deferral_review_due` | Accepted | §2.21 |
| 13 CCR-07 actor kind `harness` | Accepted | §2.24, §7.11 (also resolves BND-14) |
| 13 CCR-08 Core facts | Accepted | §2.22 |
| 13 CCR-09 Core reason codes and stage placement | Accepted | §8.2, §8.4 |
| 13 CCR-10 Core and Operations actions | Accepted | §5.2, §5.3 |
| 13 CCR-11 `post_filing_correction`, incident columns | Accepted | §2.17, §3.8 |
| 13 CCR-12 artifact columns and states | Accepted | §3.8 |
| 13 CCR-13 cross-owner interfaces | Accepted with edit | §6.4, §6.7, §6.9; artifact association is triggered through the Documents settled listener (§6.6) instead of a direct call, and fails closed (BND-13) |
| 13 CCR-14 readiness fingerprint inputs | Accepted | §7.3 |
| 13 CCR-15 original parts and return keys | Accepted with edit | §3.8; one owner-gated key `originals.returnPolicy` (§9.2) replaces `returnRecipientEvidence`/`sharedItemReturn` |
| 13 CCR-16 `decl/1` keys read by Core | Accepted with edit | §9.2 normative schema; no `'external'` upstream (BND-05); `progressMapping.steps[].code`; fee timing inside `governmentFee` |
| 13 CCR-17 next-action codes | Accepted | §2.8 (add `return_to_ta`, `decide_transition`, `reapply_correction`) |
| 13 CCR-18 `timing_risk_enqueue` | Accepted | §4.9 |
| 13 CCR-19 launch table continuing duties | Accepted | §2.14 |
| 13 CCR-20 table detail values | Accepted | §3.5 (detail record 13 §2) |
| 13 CCR-21 Core and Operations commands | Accepted | §6.4, §6.7 |
| 14 CCR-01 document purpose | Accepted | §2.15, §3.7 |
| 14 CCR-02 content-safe release, canonical after structural pass | Accepted | §2.15, §6.9, §7.7 (also resolves SEC-06) |
| 14 CCR-03 `dispose`, blob owner hooks | Accepted with edit | §4.6, §4.12; adds `onMoveFailedTerminal` (REC-17) |
| 14 CCR-04 task `defer` | Accepted with edit | §4.6; a defer whose cause cannot end is forbidden (REC-17); also resolves REC-22 |
| 14 CCR-05 settled listener | Accepted | §6.5, §6.6; also used by Operations for artifacts |
| 14 CCR-06 `acceptIntakeProposals`, `applyIntakeCorrection`, `applicantIdentity` | Accepted | §6.4; `core.create_draft` is internal only (B14) |
| 14 CCR-07 population blocks only on positive evidence | Accepted | §8.2, §8.3 (COV-06) |
| 14 CCR-08 `catalogue.attachLateApplication` | **Rejected** | record 12's `noteGoverningBehindHead` (§6.3) gives the same liveness, and safety already comes from the fail-closed impact derivation (record 12 §2.5 step 3: an application on a non-head tuple without a current item is `unknown`) |
| 14 CCR-09 `groupClosureBlockers` | Accepted | §6.5, §7.1; record 13 CMD-G3 and §5.1 aligned |
| 14 CCR-10 policy relations and actions | Accepted | §5.1, §5.2, §6.2 |
| 14 CCR-11 intake and documents closed sets | Accepted | §2.16, §2.22, §7.6, §8.4, §10.9 |
| 14 CCR-12 `reevaluateForApplication` | Accepted | §6.6, §6.11; record 13 corrections call it |
| 14 CCR-13 worker self-test | Accepted with edit | §10.3 (cgroup scope as the primary mechanism, BND-01) |
| 14 CCR-14 intake source file states | Accepted | §3.6 |
| 15 CCR-15-01 `converted_paise` | Accepted | §2.19, §3.9, §8.6 |
| 15 CCR-15-02 `recordFeeNotPaid` | Accepted | §6.8, §6.11, §7.4 (BND-09 part 2) |
| 15 CCR-15-03 follow-up owner reassignment | Accepted | §5.2, §6.8 |
| 15 CCR-15-04 notice kind `financial_follow_up` | Accepted | §2.18 |
| 15 CCR-15-05 `runContinuation` | Accepted | §4.2 |
| 15 CCR-15-06 packet states and facts | Accepted with edit | §2.18, §2.22; release acceptance fact is `core.packet_released`; Delivery appends `dlv.packet_state_changed` |
| 15 CCR-15-07 harness-only `result_available` | Accepted | §2.18, §7.11 |
| 15 CCR-15-08 `sys_backup_sets`, restore scope | Accepted with edit | §3.2 (`scope_basis` completeness, REC-05), §4.7 |
| 15 CCR-15-09 fault points | Accepted | §4.11 |
| 15 CCR-15-10 SQLSTATE mapping | Accepted | §4.2 step 5 |
| 15 CCR-15-11 blob admission check | Accepted | §4.12 rule 8 |
| 15 CCR-15-12 payment and delivery reason codes | Accepted | §8.4 |
| 15 CCR-15-13 release-check order, `dlv_releases` columns, `consumeGateException` | Accepted with edit | §3.10, §6.9; `consumeGateException` is **not** added: Core owns packet release (COV-03) |
| 15 CCR-15-14 engineering seed | Accepted with edit | actor kind `harness` (§2.24) |
| 15 CCR-15-15 effort capture | Accepted | §1.2, §3.8 `ops_effort_samples`, §5.2 (COV-10) |
| 15 CCR-15-16 `mail.deliver` owner | Accepted | §2.21 |
| 15 CCR-15-17 actions | Accepted | §5.2, §5.3 |

### 15.3 Resolution of the conflicting pairs named in review finding COV-13

| # | Conflict | Decision |
|---|---|---|
| 1 | Identity mail task (11 CCR-04 vs 15 §1.2) | `iam.send_mail` for identity mail; `mail.deliver` is Delivery-only |
| 2 | Recipient change between queue and send (11 CCR-12 vs 15 I-15-05) | refresh to the current email at prepare (11 CCR-12 rejected) |
| 3 | Harness actor model (13 CCR-07 vs 11 CCR-13 / 15 CCR-15-14) | actor kind `harness`, test and local_test only |
| 4 | Release condition (14 CCR-02 vs 15 §3.2.0 step 5) | `content_safe` + canonical; `safety_passed` never releases |
| 5 | CAPTCHA writer (11 CCR-03 vs 14 C-I2) | `identity.consumeBotCheck` only |
| 6 | Intake acceptance writer (14 CCR-06 vs 13 §3.20) | plural `acceptIntakeProposals` + `applyIntakeCorrection` |
| 7 | Late application hook (14 CCR-08 vs 12) | `catalogue.noteGoverningBehindHead` |
| 8 | Active intake attempts and group closure (14 CCR-09 vs 13 CMD-G3) | `groupClosureBlockers`; both counts MUST be zero |
| 9 | Release catalogue registration while closed (15 §3.4.2 vs 12 E1) | maintenance commands during cutover verify, before open |

## 16. Country and service extension architecture (revision 3, architect, 2026-10-04)

Authority: product owner direction of 2026-10-04 (brief §12): the system MUST stay easy to maintain and extend in production, where extension means onboarding new countries and new services in existing countries. This section is normative and binds every module. It adds no business rule.

### 16.1 Extension kinds and their only path

| Extension | Path | Code change | Release | Owner decision |
|---|---|---|---|---|
| New service in an existing country, on existing service modes, document types and check kinds | Catalogue data: `decl/1` declaration (Section 9.2) + `bv/1` baseline + binding to capabilities already in the active release + launch plan + scoped launch approval (B05, B07) | none | none | only for owner-gated (G) items, as Section 9.2 states |
| New document requirement type | Declaration data: `documents.requirements[].type` is a declared code (`^[a-z][a-z0-9_]{1,39}$`); wording lives in the baseline | none | none | none |
| New country with no country-specific behaviour | Catalogue data (`cat_countries`, offerings, declarations) + static public content file + verified public facts | none | none | launch requirements of B02 |
| New country-specific behaviour (document validity rule, intake column mapping, official-artifact recognition, travel-date rule) | One country adapter package `src/countries/<iso3 lower>/` (16.2), registered once (16.3), passing the conformance kit (16.4); declarations reference it by `{ adapterId, version }` | adapter package only | yes: the release capability set carries the adapter capability | none, unless the behaviour settles a PARKED/unselected policy (then G) |
| New shared check kind usable by every country | Documents capability `documents.validity/<n>`: add the kind to `VALIDITY_CHECK_KINDS` with its evaluator in Documents, once | Documents module | yes | none |
| New service mode, actor, authority shape, gate, outcome or external-act kind | not an extension: change of the shared business contract (B05 shape rule, Section 9.2) | contract revision | yes | **required** before the contract revision |

Real countries: none is created by engineering in this build. Candidate countries are planning inputs (B02). The deliverable is the extension mechanism, two synthetic reference adapters and the onboarding playbooks (16.6).

### 16.2 Country adapter contract (`src/countries/contract.ts`)

```ts
export const ADAPTER_API = 'tm-country-adapter/1' as const;
export const ADAPTER_FUNCTIONS = ['checkValidity','evaluateTravelDateRules','proposeIntakeMapping','recognizeArtifact'] as const;
export interface CountryAdapterManifest {
  readonly api: typeof ADAPTER_API;
  readonly adapterId: string;                 // ^[a-z]{3}\.[a-z][a-z0-9_]{1,30}$  e.g. 'syn.core'
  readonly country: string;                   // ISO 3166-1 alpha-3, uppercase; synthetic codes allowed only for synthetic adapters
  readonly version: string;                   // semver; the capability version
  readonly synthetic: boolean;                // true ⇒ registered only when env ∈ {test, local_test}
  readonly functions: readonly AdapterFunction[];
  readonly checks: readonly { readonly code: string; readonly paramsSchema: JsonSchemaLite }[];  // codes usable in country_adapter_check params
  readonly sourceDigest: string;              // filled by `tm release register` (Section 9.4 CCR-11 rule)
}
export interface CountryAdapter {
  readonly manifest: CountryAdapterManifest;
  checkValidity?(input: AdapterValidityInput): AdapterValidityResult;                 // pure, synchronous
  evaluateTravelDateRules?(input: AdapterTravelInput): AdapterTravelResult;           // pure, synchronous
  proposeIntakeMapping?(input: AdapterMappingInput): AdapterMappingResult;            // pure, synchronous
  recognizeArtifact?(input: AdapterArtifactInput): AdapterArtifactResult;             // pure, synchronous
}
// Inputs are closed field sets built by the calling owner (no ids of other TAs, no raw files, no URLs):
//   AdapterValidityInput { checkCode, params, documentType, mrz?: { documentCode, issuingState, expiry, birthDate }, image?: { width, height }, pdf?: { pages }, travel: { start, return } }
//   AdapterMappingInput  { headers: string[] ≤ intake.maxColumns, sampleShapes: ('empty'|'date'|'number'|'text'|'url')[][] ≤ 5 rows }   // shapes only, never cell values
//   AdapterArtifactInput { artifactType, textSha256, fields: { name?, passportNumber?, documentNumber?, issueDate?, expiryDate? } }      // fields extracted by the parse worker
// Results use closed codes only and echo no input string:
//   AdapterValidityResult { verdict: 'valid'|'invalid'|'unknown', code: AdapterCode }
//   AdapterMappingResult  { columns: { header index → field key | 'ignore' | 'ask' }, code }
//   AdapterArtifactResult { proposal: 'matches'|'no_match'|'unknown', code }
```

Rules (MUST):
1. Purity: an adapter module imports only `src/countries/contract.ts`, `zod`, and files inside its own package. A static test (T-F51) refuses imports of `node:*` I/O modules (`fs`, `net`, `http`, `https`, `child_process`, `worker_threads`, `dgram`, `dns`, `tls`), `src/kernel/*` (except `vocabulary/` types), `src/platform/*`, `src/modules/*` and `src/web/*`, and refuses `Date.now`, `Math.random`, `process.*` and `globalThis` access. Adapters never write state, never reach the network and never read files.
2. Proposals only: every result is a proposal the owning writer accepts or rejects (B34, B36). An adapter never decides access, payment, readiness, outcome or launch.
3. Fail closed: missing input ⇒ `unknown`, never `valid`. An exception, an invalid result shape or a call longer than `countries.callBudgetMs` (default 200 ms, measured with `performance.now()` around the synchronous call) ⇒ the caller treats the result as `unknown` / `country_adapter_error` and adds an `AttributionRecord` (Section 4.13). In-process runaway work that never returns is the accepted residual risk (B36 OWNER_DECISION): no sandbox, broker, worker thread or per-country scheduler is built.
4. Containment: the caller invokes adapters only through `src/countries/invoke.ts` (`invokeAdapter(adapterId, version, fn, input, attributions)`), which applies rule 3, validates the input and result with zod, and never lets one country's failure change another country's result, list or queue (B36).
5. Versioning: a declaration references `{ adapterId, version }`; the binding is `supported` only when the active release `capability_set` contains `country.<adapterId>@<version>` with the registered `sourceDigest` (Section 9.4). A new adapter version is a new capability; existing applications keep their governing binding (B06); changes reach existing cases only through Section 9.3 continuation or transition.
6. Data minimisation: inputs carry only the fields the function needs; personal data never leaves the calling owner except the extracted fields an artifact recognizer needs, and results echo none of it.

### 16.3 Registry (`src/countries/registry.ts`)

- The only file that imports adapter packages. It exports `ADAPTERS: readonly CountryAdapter[]` and `adapterCapabilities(env)` (synthetic adapters only when `env ∈ {test, local_test}`).
- `src/server/compose.ts` and `tm release register` read the registry; no other file imports `src/countries/<pkg>/` (T-F51).
- Duplicate `adapterId@version`, a manifest that fails its zod schema, or a synthetic adapter in `production` configuration refuses startup and release registration.

### 16.4 Conformance kit (`test/countries/conformance.ts`)

A reusable suite. A test enumerates `ADAPTERS` and runs the kit for every adapter, so registering an adapter automatically subjects it to the kit (T-F52):
- manifest valid; `adapterId`, `country`, `version` formats; `functions` match implemented methods; check codes unique;
- purity (static import and global-access scan of the package);
- determinism: the same input gives the same result 100 times;
- totality: 500 seeded generated well-formed inputs per function never throw and always return a schema-valid result;
- fail closed: each input with one required field removed returns `unknown`, never `valid`;
- no echo: no result contains any input string longer than 3 characters;
- time: p99 of the generated calls ≤ 50 ms (a quarter of the call budget);
- the adapter's own fixture cases (`src/countries/<pkg>/fixtures.ts`) with expected verdicts.

### 16.5 Reference adapters

- `src/countries/synthetic/syn/` (`syn.core`, country `SYN`, synthetic): `checkValidity` with one check code (`syn_passport_series`), `proposeIntakeMapping`, `recognizeArtifact` for artifact type `evisa_grant`. It demonstrates every adapter function used by records 12 and 14.
- `src/countries/synthetic/syx/` (`syx.core`, country `SYX`, synthetic): minimal adapter with a test-only fault hook (throws or exceeds the budget when `TM_ENV=test` arms it) for the country-containment tests (record 12 T-C48, record 14 T-D22, T-F39).
- Both are labelled synthetic in their manifests and on every page that shows them.

### 16.6 No special-casing in shared code, and onboarding playbooks

- Static test T-F53: outside `src/countries/`, test fixtures and `catalogue/synthetic/`, source files contain no ISO 3166 country code literal (alpha-2 or alpha-3, from an embedded list) except `IND` in the population-scope vocabulary, and no offering service code literal. Behaviour varies only through declarations, bindings, registries and adapters.
- Public site: a country page is one static content file `content/public/countries/<slug>.json` validated by a zod schema; adding it needs verified public facts only (B01). The SEO check covers it automatically.
- Public playbooks (concise, public-fit, milestone 5): `docs/extending/new-service.md` (catalogue-only path, owner-gated items, launch plan and measures, impact review) and `docs/extending/new-country.md` (adapter package, registry, conformance kit, capability and release, declarations, public content, launch).

### 16.7 Foundation tests added by this section

| ID | Test | Proves |
|---|---|---|
| T-F51 | Static: adapter purity (imports and globals) and registry-only imports of adapter packages | 16.2 rule 1, 16.3 |
| T-F52 | Conformance kit runs for every registered adapter (both synthetic adapters pass) | 16.4 |
| T-F53 | Static: no country code or service code literals in shared code | 16.6 |
| T-F54 | `invokeAdapter`: throw, invalid result and over-budget call each yield `unknown` / `country_adapter_error` plus one attribution; a second country's evaluation in the same transaction is unaffected | 16.2 rules 3–4, B36 |
| T-F55 | A declaration that references an unregistered adapter or an unregistered version is `unsupported` (`declaration_unsupported`); registering the adapter in a new release makes it `supported` | 16.2 rule 5, 9.4 |

## 17. Milestone allocation of the invariant tests (revision 3, architect)

Section 13 lists every invariant test. Milestone 1 cannot prove module-level invariants before the modules exist, so each test is proven in the milestone that delivers its subject, and the final verification reruns all of them on the integrated system.

| Milestone | Tests | How |
|---|---|---|
| 1 Foundation | T-F01–T-F15, T-F20, T-F21, T-F23–T-F31, T-F33, T-F35, T-F38, T-F51, T-F52, T-F53, T-F54 | through a test-only fixture module (`test/fixtures/kernel-fixture/`, table prefix `tst_`, migrations only in the test template) that exercises the command runner, guards (including an empty-scope partial unique index), tasks, blobs, fencing, workers, faults, diagnostics and the adapter contract; static tests run over the real source tree; T-F32 policy matrix runs for the skeleton actions available in milestone 1 |
| 2 Identity, Catalogue, Documents/workers | T-F32 (full), T-F36, T-F47, T-F55 | real modules |
| 3 Core, Intake, Payments | T-F13 (real scope), T-F16, T-F17, T-F18, T-F19, T-F22, T-F34, T-F43, T-F44, T-F45 | real modules |
| 4 Operations, Delivery, Views | T-F39, T-F46, T-F49 | real modules |
| 5 Release, backup, restore | T-F40, T-F41, T-F42, T-F48, T-F50 | real CLI against PostgreSQL 16.15 |
| Final | all of Section 13 and 16.7 | integrated system |

## 18. Delegated owner decisions applied (revision 4, architect, 2026-10-04)

Authority: on 2026-10-04 the product owner accepted the architect's recommendations for every open owner decision and recorded P1 item, and delegated all further decisions during this run to the architect ("go with your recommendations, i wont interrupt or take any decisions during the run"). Each decision below is reversible; register 02 keeps the alternatives. Where this section differs from earlier sections or module records, this section governs.

### 18.1 Owner decisions

| ID | Decision | Normative change |
|---|---|---|
| D-01 (OD-R2-01) | The exposure ceiling applies per TA **person account**. No agency entity is introduced. | none (I-09 stands). Re-keying `pay_ta_exposure` by a business id stays the documented path if an agency model is approved later. |
| D-02 (OD-R2-02) | Gate 1 is re-evaluated at the **first start of operator work on each assignment**, not only at assignment. | Gate table (2.11): `gate1_service_payment` guards `assign`, `reassign`, and the first `start_operator_work` or `assistance_entry` on an active assignment (and in-place assistance approval on an assigned case) when no work step has started on that assignment. Passes on current `payment_received`, or a fresh Gate 1 exception with action key `start_operator_work`. The result is recorded on the work step. Later steps on the same assignment use that basis; a later correction to unpaid still opens `worked_then_corrected_to_unpaid` (record 15 C-P1). Record 13 test T-CO69 asserts the stricter rule. |
| D-03 (OD-R2-03, OD-15-01) | A `payment_received` entry requires at least one evidence reference of kind `external_reference` or `document_version`; an `attestation` may only accompany it. A financial exception closed by a later SuperAdmin `payment_received` entry is shown as closed by a service entry, never as "collected". | `FIN_EXCEPTION_STATES = ['open','closed_by_service_entry']` (replaces `closed_collected`; bank-verified collection remains PARKED). `pay.record_service_status` refuses `payment_received` without qualifying evidence (`validation_failed` / `payment_evidence_required`). |
| D-04 (OD-R2-04) | SuperAdmin byte access is minimised. | New action `document.retrieve_bytes_admin` (SuperAdmin only) replaces SuperAdmin `Y` on `document.retrieve_bytes`. It requires `_reason` and a closed purpose code `ADMIN_BYTE_PURPOSES = ['evidence_correction','payment_evidence','disclosure_incident']`, is single-file only (no SuperAdmin bulk selection), records the purpose on `dlv_releases` and in fact `dlv.release_checked`, and is refused while the audit projection is degraded (`privilegedElevation = true`). |
| D-05 (OD-R2-05) | A **non-synthetic** offering whose declaration holds originals (`originals.custody.held = true`) cannot launch while `originals.returnPolicy` is unresolved. | `ops.approve_launch` refuses with `unavailable_parked` / `parked_custody_route_policy` for such offerings. Synthetic offerings keep the partial-return proof. |
| D-06 (OD-R2-06) | Dependencies link applications of the **same group only**. | none (interim stands). |
| D-07 (OD-R2-07) | Offering withdrawal is terminal. | The withdrawal command requires an explicit acknowledgement field (`acknowledge_irreversible = true`); the admin page states that withdrawal is irreversible in this build. |
| D-08 (OD-15-03) | OS-level runtime-identity separation is a production setup step (dedicated system user, needs root once). | Documented in `docs/operations.md` (milestone 5); the local test installation keeps separate cluster, roles, sockets, directories, secrets and port under the current user. |
| D-09 (OD-R2-08) | Separation-of-duties awareness: no product change in this build. | Listed in the final report. |
| D-10 (register 02 Part A.2) | Every carried-forward decision keeps its recorded safe interim as the decision for this build. | none. |

### 18.2 P1 dispositions

| Item | Disposition | Milestone |
|---|---|---|
| REC-09 admission close can wait without bound | **Work.** Admission gate becomes a PostgreSQL advisory lock: every kernel write transaction takes `pg_advisory_xact_lock_shared(ADMISSION_GATE)` before `assertWriter`; `closeAdmission` takes `pg_advisory_xact_lock(ADMISSION_GATE)` (exclusive), whose queued request blocks newer shared requests, then updates `sys_installation`. Waiting writers fail by `lock_timeout` and retry into `maintenance`. A probe first demonstrates the starvation of the row-lock design and the fairness of the advisory gate. | 1 |
| REC-11 kernel traffic shares the app pool | **Work.** Separate kernel pool (`db.kernelPoolMax` = 3) for lease, heartbeat, recovery and `LISTEN`; a task whose heartbeat reports `lease_lost` kills its worker process group. | 1 |
| REC-12 predicate-lock promotion in large SERIALIZABLE batches | **Work.** Probe on PostgreSQL 16.15; set `max_pred_locks_per_transaction` and `catalogue.recheckBatchSize` from the measurement; keep 53200 retryable. | 1 (probe), 2 (tuning) |
| COV-14 / BND-11 route names | **Work.** Record 11 §4.4 is the single path authority; module lanes align to it; T-F02 checks every registered route against it. | 2–4 |
| MON-10 mistyped or renewed passport | **Work.** On draft creation and applicant-key change, a candidate check (same group, same normalized full name and date of birth, different applicant key, open application) opens an owned `possible_duplicate` intake incident. Never a merge, never a block of the existing application (B15, B16). | 3 |
| SEC-04 staff OTP limiter lock-out | **Work.** Attacker-bound limiter key (IP + pre-session) plus a larger per-contact ceiling, and ALTCHA on the staff sign-in page. | 2 |
| REC-14 scanner/worker outage consumes attempts | **Work.** `prepare` returns `defer` while facility health is `down`; bulk requeue command for the Documents queue. | 2 |
| REC-15 process supervision | **Work.** `systemd --user` units with restart limits for `tm-server` and clamd, generated by `tm install`. | 5 |
| REC-16 poison fact halts a projector | **Work.** Per-fact gap recording and a `degraded` projector state; other facts continue. | 4 |
| REC-18 backup disk exhaustion | **Work.** Free-space reserve check with size estimate, retention count, separate target directory option. | 5 |
| COV-15, MON-11, REC-08, REC-10, REC-19 | **Parked** as recorded notes (reconstruction input, price-order edge, two-phase closure, monotonic clock floor, off-host key custody). | — |

## 19. Foundation review amendments (revision 5, architect, 2026-10-04)

The independent four-lens foundation review (41 findings; 18 confirmed P0/P1 after adversarial verification; all fixed with sensitivity-proven tests) and the web-shell lane changed these contract points. Code on `main` is authoritative for the details; this list is normative.

| Area | Amendment |
|---|---|
| Admission (4.7) | `closeAdmission` never weakens a restore closure kind; reopening after an interval-loss restore checks the pending restore record, not only the stored kind; a successful reopen marks the restore `reopened`. Drain counts every non-idle runtime backend as busy; transactions that outlive the drain wait are terminated. `tm_owner` holds `pg_read_all_stats` and `pg_signal_backend`. The admission gate is the advisory lock of §18.2 plus the row share lock (both required under SERIALIZABLE). |
| Tasks (4.6) | A `non_repeatable` task whose effect started ends `effect_uncertain` on every failure path (effect error, record failure, exhausted lease recovery); a deliberate "nothing sent" refusal must happen in prepare. Each task kind declares its principal (`system`, `person`, `person_or_system`); person kinds require an on-behalf check. A task actor carries the HMAC of its lease token and is accepted only while that lease is held. |
| Command runner (4.2) | `auditHealth` is required on the command environment; missing or throwing ⇒ degraded ⇒ privileged elevation refused. A lost database session before COMMIT returns retryable `database_connection_lost`; at COMMIT it stays `outcome_unknown`. |
| Database access (4.1) | Module and web code may import only the statement and lock helpers; `queryAppPool` takes only a `sql` statement; pools are created only in composition roots. |
| Scanner (10.4) | clamd runs with `AlertEncrypted`, `AlertExceedsMax`, `MaxFiles`, `MaxRecursion`; size limits derive from `ARCHIVE_LIMITS`. Encrypted PDFs are rejected as infected (`Heuristics.Encrypted.PDF`). |
| Workers (10.3) | Output files are read without following links, must be single-link regular files in a real `out/` directory, and are copied with hashing into a private directory. |
| Web (12) | One `PRODUCT_CSP` (`src/web/csp.ts`) adds `connect-src 'self'` and `img-src 'self' data:`. `Referrer-Policy: same-origin` (Chromium sends `Origin: null` on same-origin form posts under `no-referrer`, which would refuse every real form). Routes carry a `routeId` and a literal closed-list action or an explicit public marker allowed only for public, sign-in, health, asset and not-found routes; the single-policy static scanner enforces it. `<${x}` interpolation is refused. |
| Countries (16) | Each registry entry lists its adapter version's files; the source digest covers only those, so several versions or adapters per country coexist. |
| Configuration | Empty `TM_DATA_DIR`/`TM_SECRETS_DIR` count as unset; a data directory inside the repository is refused (`data_dir_location`). |
| Closed sets (18.1) | `FIN_EXCEPTION_STATES = ['open','closed_by_service_entry']`; action `document.retrieve_bytes_admin`; `ADMIN_BYTE_PURPOSES`; reason codes `payment_evidence_required`, `database_connection_lost`, `data_dir_location`. |

Parked P2 notes from the review: migration numbering out of order across installations (MAINT-02), worker work directory keyed only by task id (MAINT-04), two configuration models (MAINT-05), CLI ignores extra arguments (MAINT-07), and the refuted/downgraded items CONF-07, FAIL-01, SEC-01.

## 20. Production topology (revision 6, product owner input 2026-10-05; architect design)

The spec leaves production topology unselected until the product owner's acceptance (B37). On 2026-10-05 the product owner required, at minimum, the TA surface and bulk upload to run separately from the Ops + SuperAdmin web application and from a central database, and asked the architect to choose the optimal design. Decision:

| Server | Roles | Network | Data access |
|---|---|---|---|
| A edge/intake | public site, TA surface, sign-in, individual + bulk intake, fetch/parse workers, clamd; task kinds intake.*, doc.*, blob moves for intake/doc owners | internet (HTTPS) | DB over TLS as role `tm_app_edge` (least privilege: no writes on pay_service_entries, cat_*, ops_launch*, iam_elevations, ceiling tables); object storage read/write for its owners |
| B staff | Ops, SuperAdmin, Accounts surfaces; task kinds core.*, catalogue.*, iam.*, mail.deliver, delivery.*, views projectors | private network / VPN only | DB over TLS as `tm_app_staff`; object storage read/write |
| C data | PostgreSQL 16 + S3-compatible object storage (Garage or SeaweedFS) | private only | — |

Rules: all servers run the same active release (one release; DB-based admission gate and writer-epoch fencing already span hosts); each process declares `http.surfaces` and `tasks.kinds` in configuration and refuses others; cookies are host-only per origin; untrusted file processing runs only on A; a fourth processing server is a configuration change. The local test installation keeps all roles on one host (filesystem blob store); a split-mode test runs edge + staff processes against one database. Implementation: a topology lane in milestone 4 (surface/task routing, TLS + per-server DB roles with grant tests, S3-compatible BlobStore adapter with worker input materialization, split-mode integration test, docs/operations.md topology section). Core and business rules are shared by all servers; the UI is a thin layer over commands and policy-scoped queries.

## 21. Service architecture: three instances, API calls only (revision 7, product owner 2026-10-05; architect design)

Product owner direction (2026-10-05): "For the testing, we will use single machine but 3 separate instances. Let them talk over api calls only, dont build and test them as monolith." This section supersedes the shared-database layout of Section 20 (server roles stay; data access changes).

### 21.1 Instances
| Instance | Owns | Talks to | Exposure |
|---|---|---|---|
| **core** (central) | PostgreSQL, the blob store, the kernel, every module's domain logic (commands, queries, policy, tasks, projections), the synthetic mailbox | edge processing API (worker jobs) | private only; mutual TLS |
| **edge** (TA + bulk upload) | public site, sign-in, TA surface, individual and bulk upload intake front end, the **processing service** (fetch worker, clamd scan, parse/OCR sandbox) | core API | internet (HTTPS) for browsers; processing API private with mutual TLS |
| **staff** (Ops + SuperAdmin + Accounts) | Ops, SuperAdmin and Accounts surfaces | core API | private network only (HTTPS) |
No instance except core holds database credentials, blob-store paths or domain module code. edge and staff are backends-for-frontends: they render HTML with the design system and call core.

### 21.2 Protocol
- HTTPS JSON over mutual TLS with a local CA (generated by `tm install`; each instance has its own key and certificate; production uses the same mechanism). No shared secrets in URLs.
- Core API: `POST /v1/commands/<commandName>` (body: operation key, expected revisions, input) → command outcome; `POST /v1/queries/<queryName>` (body: params) → view model; `POST /v1/uploads` (streamed bytes → staged blob reference); `POST /v1/bytes/<releaseRoute>` (release-checked streamed bytes); `GET /v1/health`. Edge processing API: `POST /v1/jobs/<workerJob>` (core sends inputs; edge returns the worker result and output bytes).
- One shared contracts package (`src/contracts/`: zod schemas and TypeScript types only, no implementation) defines every command input, query view model and job message; core validates, clients are typed from it. JSON encoding of bigint (money, sequences) and dates is fixed and tested.
- Per-service allowlists enforced by core: edge may call only public, sign-in, TA and intake commands/queries; staff only staff ones; core may call only edge's processing jobs. A request outside the allowlist is refused even with a valid user session.
- User identity: the BFF forwards the user's session token (cookie stays at the BFF origin, HttpOnly) and the pre-session key for anonymous forms; core's identity module resolves the actor on every call (no trust in BFF-asserted roles). The BFF forwards the client IP for rate limits (trusted only from an authenticated service).
- CSRF, Origin/Host checks, operation-key generation and security headers stay at the BFF; operation identity, policy, guards and transactions stay at core. Errors map 1:1 from core error categories to BFF pages.
- Bytes: uploads stream browser → BFF (size/type pre-checks) → core (staging); core tasks send bytes to edge processing and record verdicts; downloads stream core (release check) → BFF → browser. No instance shares a filesystem path with another.

### 21.3 Testing (no monolith tests of the product)
- System and end-to-end tests start THREE processes on one machine (distinct ports, data directories, secrets and certificates) plus the PostgreSQL cluster and clamd, and drive them only through HTTP/browser. Browser tests target edge and staff.
- Module-internal tests of domain logic inside core remain (they test the core service's internals, not the product as a monolith).
- Static tests: `src/apps/edge` and `src/apps/staff` import no `src/kernel` database/command/task code, no `src/modules/*` and no `src/platform` storage or database code; core serves no HTML.
- The single-process server path is removed once every page is ported.

### 21.4 Plan
A dedicated service-split milestone runs before the milestone-3 review: contracts package, core API server, typed client, mutual TLS, per-service allowlists, edge and staff BFF apps on the existing web shell and design system, the edge processing service with core task dispatch, porting of every existing page, the three-instance harness and system tests, `tm install` for three instances. Milestone 3's in-flight domain work is reused unchanged; its pages are ported in the same milestone. Milestone 4 builds natively on this architecture.

## 22. Architect review decision: same-person evidence for identity corrections (2026-10-06)

Found by the architect while reviewing the milestone-3 integration diff (P0, B19/B15/B03). The interim rule of record 13 CMD-D3 step 5 (OD-C1) counted any two unchanged identity fields as continuity; nationality and issuing country are population constants (IND/IND for every applicant in scope, B02), so any Indian passport satisfied it, and a second "old values" document was accepted without tying it to the new-values document. With mismatch-coded conflicts counted as identity association, a travel agent could swap the applicant through a correction. Replacement rule (applies to draft TA, assistance-entry and SuperAdmin evidence corrections): (1) each changed identity field's new value appears on a qualifying evidence version; (2) at least two DISTINGUISHING fields (surname, given names, date of birth, passport number) are unchanged by the correction and one single evidence version showing the new values also shows those unchanged values equal to the current snapshot; (3) no standalone old-values branch. Three or more changed distinguishing fields ⇒ refused (fresh intake). Name typo, renewed passport and married-name-with-new-passport stay possible.

### 21.5 Phase 1 outcome and architect acceptances (2026-10-06)
- Phase 1 delivered on branch worktree-wf_b74a5c37-afd-4 (f0bcbcf): contracts, core API with mutual TLS and default-deny allowlists, edge and staff BFFs serving every milestone 1–2 route, edge processing service, three-process harness and system tests (1070 tests).
- Accepted security behaviour beyond the original text: a session is usable only through the BFF that issued it (TA sessions via edge, staff sessions via staff); per-BFF cookie names; staff serves TA read-only GET pages only inside a support view (support-view-only queries enforced at core).
- Boundary review P0 (core used a BFF-forwarded route header to steer support-view actor resolution) fixed: core resolves the actor itself. Its sensitivity revert could not be executed (session safety classifier refused the temporary revert); the test asserts the opposite of the old behaviour.
- Boundary review P1 (same OS user for all instances; local CA key in the same tree): phase 2 MUST give each instance a secrets directory with only what it needs (no database credentials or blob paths on edge/staff) and move the CA private key out of the instance tree after issuance; separate OS users per instance remain a production setup step (D-08).

### 21.6 Phase 2 stage B outcome and architect decisions (2026-10-06)
- Stage B ported the milestone 3 pages to edge and staff in three module lanes (core, intake, payments and views). Each lane passed its full suite. Stage C1 merges them.
- Decision: staff MUST accept document uploads from operator sessions only for `operator_assistance_upload` and `operator_artifact_upload`, and only on a case assigned to that operator. Core staging MUST re-check the purpose and the policy decision for the operator on that application. Bytes MUST go to core staging; processing MUST be dispatched to the edge processing service. All other purposes, roles and the edge route MUST be refused. Rationale: the operator duties (B18, B23) need these uploads, and staff never parses untrusted bytes itself.
- Decision: no separate SuperAdmin "assign" command for intake incidents. SuperAdmin resolves an intake incident directly with the existing incident commands. Parked as P2; revisit if the incident volume needs a queue owner.
- Decision: product system tests MUST create drafts, evidence and payment entries through the real edge and staff pages. A fixture shortcut remains acceptable only inside core-internal module tests.

### 21.7 Release binding of running processes (architect decision, 2026-10-07)
Context: the milestone 5 review confirmed four P0 findings with one root cause: nothing binds a running process (core, edge, staff, edge's workers) to the verified release. The release rule requires verification of the actual artifact, configuration, schema and worker compatibility while closed, then a deliberate opening; old writers MUST NOT reconnect; section 20 requires one active release on every instance.

Decisions:
1. Verification currency. A snapshot rollback and a restore boundary MUST clear `verified_at` of every release in the same transaction. Opening admission after either MUST require a passing verification of the installed release. A restored installation whose installed tree is not the restored active release's artifact MUST refuse to verify, with guidance to install that release's source.
2. Writer epoch at opening. `openAdmission` MUST increment the writer epoch, so every process registered while closed exits 75 and restarts on the verified files.
3. Per-release directories. Each release runs from its own directory (a clean checkout of its source, read-only by convention). The manifest records the directory. Activation writes `release.env` for core, edge and staff with `TM_RELEASE_ID`, `TM_APP_ROOT` and `TM_NODE`. The unit templates MUST take the entry point and the Node binary from `release.env`, not from install-time values. Verification computes the artifact digest of that directory, runs the Node binary the units name, and writes a verification stamp `<appRoot>/.tm-verified` (release id, artifact digest, Node version).
4. Start-time checks. At start, core, edge and staff MUST check that (a) their `TM_APP_ROOT` holds a verification stamp for their `TM_RELEASE_ID` whose artifact digest equals the active manifest's, and (b) their own resolved configuration digest equals the manifest's digest for that instance. Core reads the manifest from the database; edge and staff read the active release and their expected digests from core over the service API. A mismatch MUST exit 78 with a closed code.
5. Release identity on the service API. Edge and staff send `x-tm-release` on every request to core; core answers a request from another release with the maintenance refusal (`release_mismatch`). Edge's processing service reports its release in its health; core MUST NOT send a processing job to a processing service of another release. Core records the release last declared by each instance.
6. Opening requires every instance on the active release. `tm admission open` MUST refuse with `instance_release_unconfirmed` (naming the instance) unless edge and staff have declared the active release since the activation.
7. Migration to the target only. The cutover migrate step MUST apply only the target manifest's migrations, up to its schema head, and refuse before any DDL unless the applied ledger and the pending files equal the manifest's migration checksums. Verification MUST compare the applied ledger checksums too.

Consequences: the operations guide documents per-release directories, restarting edge and staff on the new release before opening, and the new refusal codes. The local test installation may keep one directory per release under the repository's parent; production installs each release read-only.

### 21.8 Release procedures while closed for a restore (architect decision, 2026-10-07; amends T-F48)
A restored installation's configuration never equals the restored release's manifest (paths, ports, recipient differ), so it MUST register, activate and verify a release for its own configuration before opening. Therefore, while admission is closed for a restore (`restore_clean`, `restore_interval_loss`), the maintenance writer MUST accept exactly the release procedures (release registration with its catalogue registration, activation, verification) and MUST refuse every other maintenance or business write with the closure's code. T-F48 is amended accordingly: its test asserts both the accepted release procedures and the refusal of any other maintenance command while closed for a restore.

### 21.9 Release binding amendments after the end-to-end walk (architect decision, 2026-10-07)
The end-to-end walk of the operations guide on the fixed branch found three P1 defects in 21.7/21.8 and the fix verifier one more. Amendments:
1. Configuration digests MUST NOT depend on the directory of the code that computes them. A default derived from the running code directory (for example `public.contentDir`) is digested in a release-relative form, so a descriptor written from one release directory matches the same configuration run from another.
2. The verification stamp is per installation: `<appRoot>/.tm-verified/<installation id>.json`. Two installations that share a release directory MUST NOT overwrite or invalidate each other's stamp. A start check reads only its own installation's stamp.
3. The release procedures (release catalogue registration, activation, verification, code rollback) are accepted under every closure kind (initial, cutover, maintenance, emergency, restore). Every other maintenance command keeps its closure rules (21.8). An emergency code rollback can therefore be verified and opened.
4. Verification and opening MUST refuse while any checkpoint is `capturing` or a snapshot-rollback intent record exists; the interrupted rollback is completed by its rerun first.
5. `tm migrate` while closed for a restore MUST refuse with the closure's code (21.8 applies to owner-role DDL too).
