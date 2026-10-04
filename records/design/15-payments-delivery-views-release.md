# Design record 15 — Payment Records, TA Delivery, Derived Views, release/backup/restore/capacity/local install

Owner: design phase (module design). Date: 2026-10-04. Status: **revision 2** (consolidated after the 2026-10-04 design review; ledger `internal/records/reviews/2026-10-04-design-review-ledger.md`). Contract record 01 revision 2 governs; Section 8 carries each request's disposition; review fixes are marked "rev 2" with the finding id. The "interim" column of Section 8 no longer applies to accepted requests.
Authority, in order: `internal/records/BUILD_SPEC.md` (SHA-256 `4a6fd906…ea89`); architecture brief revision 2 (`design/00-architecture-brief.md`); `ENGINEERING_OVERRIDES.md`; environment inventory 2026-10-04; foundation contract (`design/01-foundation-contract.md`, binding). Where this record needs something the contract lacks or states differently, Section 8 proposes a numbered contract change. Until the orchestrator accepts a change request, the implementer MUST follow the contract text and the "interim" column of that request.

Scope: Payment Records (B26–B29, B43), TA Delivery (B12 send checks, B24 delivery evidence, B31, B46), Derived Views and measures (B21 progress, B32, B33), release and cutover (B39), backup and restore (B40), bounded capacity (B38), local test installation (B37). Verification items of B41 that fall in this scope are in Section 7.

This is an internal record. Product source, tests, comments and commit messages MUST NOT copy rule IDs, record IDs (`OD-15-…`, `CCR-15-…`, `I-15-…`) or internal paths (brief §0).

## 0. Conflicts and stale inputs named

| # | Source text | Conflict | Treatment in this record |
|---|---|---|---|
| X-1 | Computed task text: "integration over real persisted SQLite" | Brief revision 2 and EO-01 replaced SQLite with PostgreSQL 16. | Integration level means real persisted PostgreSQL 16 (per-test-file database cloned from the migrated template, contract §10.1). |
| X-2 | Brief §4: Payment Records owns "Gate 2 decisions" | B34 gives control acceptance to Core. Contract C-01 already resolved it. | Core owns `core_gate_exceptions` (Gate 1 and Gate 2). Payment Records owns the payment status that the gates read and the financial exception that a consumed exception opens. |
| X-3 | Contract §3.9 invariant "`reserved_paise` = Σ amount of reservations in state `reserved`" and §2.19 "`converted_to_paid`" | When the actual paid fee is lower than the reserved amount, conversion would silently release the unused remainder. B28 says unused-reservation release is PARKED and exposure decreases only on Accounts-verified allocated bank receipt. | CCR-15-01: track `converted_paise`; the unused remainder stays counted. |
| X-4 | B37 "keep data, secrets and runtime identities separate from other applications" vs brief §0 "Everything runs as the current user" (no sudo) | Other applications on this host (inventory: ports 4318, 4187, 8787) may run as the same OS user. File modes 0600/0700 do not separate processes of one uid. | Database roles, cluster, sockets, directories and secrets are separate. OS-level identity separation is not achieved. OD-15-03. |
| X-5 | Contract §7.11 lists only document email and completion check as B46 harness-only | A `result_available` web notice for a TravelMudra-held result is "web notification evidence" that holds completion (B24). Posting it automatically would supply a provisional delivery trigger (B46). | `result_available` notices are posted only by the harness command `dlv.post_result_notice` (CCR-15-07, OD-15-02). Other notice kinds are posted by their owning commands. |

## 1. Responsibilities and non-responsibilities

### 1.1 Payment Records (`src/modules/payments`, tables `pay_`)

| Responsibility | Rule |
|---|---|
| Manual per-application service payment entries (`record`, additive `correction`) with actor, time and evidence | B26, B11 |
| Current service payment status per application, as the single input Gate 1 and Gate 2 read (`servicePayment`) | B26, B27 |
| Government fee records for `travelmudra_filed` work: expected fee, TM-paid amount, TA liability, TA receipt/allocation, outstanding recovery, separate from service charge and fixed price | B27 |
| TA rupee ceiling (default ₹0), lowering by one SuperAdmin, increase by a second distinct SuperAdmin | B28, B11 |
| Atomic exposure reservation once per logical effect, inside Core's action-authorization transaction | B28, B35 |
| Financial exceptions (`Payment_Missing_Override`) and their accountable SuperAdmin, nudge notice and closure | B26, B29 |
| Visible unavailable states: reservation release, fee-exclusion record, paid case at default ₹0, Accounts actions, write-off | B28, B29, B43 |

Non-responsibilities:

| Not owned | Owner |
|---|---|
| Gate evaluation, gate exceptions (grant, freshness, consumption), assignment, action authorization, external-act state | Core (contract C-01, §8) |
| Price quotation, price reductions and increases, submission | Core (B17) |
| Act evidence (receipt, timeout) and reconciliation attempts | Operations, calling Core, which calls Payment Records writers |
| Accounting grant on an operator account | Identity (`iam.set_accounting_grant`) |
| Bank receipt verification, allocation, recovery, manual adjustment, write-off | Accounts — PARKED or unselected (B29, B43); no command exists |
| Gateway, refund portal, TA-wide credit | EXCLUDED (B26, B42) |

### 1.2 TA Delivery (`src/modules/delivery`, tables `dlv_`)

| Responsibility | Rule |
|---|---|
| Release check before every file send: web retrieval, every bulk-selection item, every document-email attachment, packet retrieval | B12 |
| Byte release records: recipient, exact version, check result, actual result | B12, B31 |
| Bulk selections with per-item `included` / `unavailable` / `failed` results | B12 |
| Document email records (state machine, recipient snapshot = owning TA's current account email) and the `mail.deliver` task for document email | B31, B09 |
| Web notices (posting writer for all modules, acknowledgement command) | B31, B17 |
| Packet build task and bytes (`delivery.build_packet`, writer `requestPacketBuild`), packet state including `released` set only by `markPacketReleased` when Core accepts the release (rev 2, COV-03), and packet/physical handover records | B04, B31 |
| Attributed manual operator email records and direct external delivery records | B24, B31 |
| Deliberate manual resend from `failed` only, newly attributed, rechecked | B31 |
| B46 boundary: no product trigger for document email, `result_available` notice or completion check; truthful pending states | B46 |

Non-responsibilities: artifact association and eligibility (Operations, B13); document version currency, association and bytes state (Documents); wrong-recipient incident handling and version blocking (Operations, Documents); completion acceptance (Core; `harness.core.check_completion` is harness-only); OTP mail content and sending (Identity; rev 2, record 11 CCR-04: Identity uses its own task kind `iam.send_mail`; `mail.deliver` is Delivery-only, document email); packet **release acceptance** (Core `core.release_packet`, rev 2, COV-03) and packet **build request** (Operations `ops.request_packet_build`).

### 1.3 Derived Views (`src/modules/views`, tables `view_`)

Responsibilities: projections for lists, queues, progress, TA history, audit search, financial follow-up and B32 measures; projector watermark, lag, health and rebuild; list and search pages over projections with the authoritative access predicate. Views write no facts and are never an input to a guard or control (B33, B35).

Non-responsibilities: progress derivation logic (`core.deriveProgress`, `core.pendingOnAction`); measure business targets, owners, support hours and escalation (Operations launch readiness evidence, B32); any permission decision (policy).

### 1.4 Release, backup, restore, capacity, local install (`src/cli`, kernel `sys_` tables)

Responsibilities: the `tm` CLI procedures for release manifest, cutover, rollback, backup, restore, protection marks, capacity record and installation; health categories; finite limits configuration. The kernel owns the tables (`sys_releases`, `sys_checkpoints`, `sys_restores`, `sys_installation`); this record specifies their procedures. Engineering actors never write business facts except protection marks through Core (B40) and the catalogue release registration maintenance commands during cutover verify (record 12 E1/E2, contract 01 §2.24 rev 2). The synthetic seed runs as actor kind `harness` in non-production environments only (CCR-15-14 accepted with edit).

Non-responsibilities: production deployment, DNS, provider, topology and numeric RPO/RTO (B37: not selected); reopening decisions after interval-loss restore (product owner, B40); re-entry of lost business facts (SuperAdmin through product commands after reopening, B40).

## 2. Tables owned

Conventions of contract §3.1 apply to every table: id `CHECK` per prefix, `ON DELETE/UPDATE RESTRICT` foreign keys, `timestamptz` from the injected clock (no `DEFAULT now()`), money `bigint` paise `CHECK (≥ 0)`, `revision` on every mutable aggregate, closed-set `CHECK` generated from `src/kernel/vocabulary`. Personal data columns are marked **PD**.

### 2.1 Payment Records

#### `pay_application_state` — guard row per application

| Column | Type | Null | Meaning |
|---|---|---|---|
| `application_id` | text | no | PK; FK `core_applications`; immutable |
| `ta_account_id` | text | no | FK `iam_accounts`; immutable (copied from the application) |
| `current_status` | text | no | `unrecorded` \| `payment_received` \| `not_received` |
| `current_entry_id` | text | yes | FK `pay_service_entries`; the latest entry |
| `status_revision` | bigint | no | `0` at creation; `+1` on every entry (record or correction); Gate 1/Gate 2 exception basis |
| `entry_count` | integer | no | number of entries; equals the highest `entry_no` |
| `created_at` | timestamptz | no | |
| `revision` | bigint | no | |

Constraints: `CHECK ((current_status = 'unrecorded') = (current_entry_id IS NULL))`; `CHECK (status_revision = entry_count)`; immutable-column trigger on `application_id`, `ta_account_id`. Created by `ensureApplicationState` in Core's draft-creation transaction (`INSERT … ON CONFLICT DO NOTHING`). Lock: Gate readers `FOR SHARE`; entry writer `FOR UPDATE` (lock order: after `core_applications`, contract §4.1).

#### `pay_service_entries` — append-only manual entries (B26)

| Column | Type | Null | Meaning |
|---|---|---|---|
| `entry_id` | text | no | PK `pay_` |
| `application_id` | text | no | FK |
| `ta_account_id` | text | no | FK |
| `entry_no` | integer | no | 1…n per application |
| `kind` | text | no | `record` \| `correction` |
| `status` | text | no | `payment_received` \| `not_received` |
| `previous_status` | text | no | status before this entry (`unrecorded` for entry 1) |
| `amount_paise` | bigint | yes | amount stated by the evidence; informational; never compared with the quoted price (formula unselected, B29) |
| `corrects_entry_id` | text | yes | FK self; required iff `kind = 'correction'` |
| `evidence` | jsonb | no | `EvidenceRef[]`, at least one of kind `external_reference` or `attestation`. Whether an attestation-only `payment_received` entry is sufficient evidence (B26) is owner decision OD-R2-03 (review findings COV-05, BND-06); this row is the interim |
| `reason` | text | yes | required for `correction` |
| `event_at` | timestamptz | yes | when the payment happened according to the evidence |
| `work_authorized_at_entry` | boolean | no | snapshot of `core_applications.operator_work_ever_authorized` read under lock |
| `recorded_by` | text | no | FK `iam_accounts` (SuperAdmin) |
| `recorded_at` | timestamptz | no | |
| `operation_id` | text | no | FK `sys_operations` (deferred) |

Constraints: `UNIQUE (application_id, entry_no)`; `UNIQUE (corrects_entry_id) WHERE corrects_entry_id IS NOT NULL` (no correction fork); `CHECK ((kind = 'correction') = (corrects_entry_id IS NOT NULL))`; `CHECK (kind <> 'correction' OR reason IS NOT NULL)`; `CHECK (jsonb_array_length(evidence) >= 1)`; `CHECK (amount_paise IS NULL OR amount_paise >= 0)`. Append-only trigger (`TM001` on UPDATE/DELETE/TRUNCATE); `tm_app` has `INSERT, SELECT` only (contract §3.1).

Entry-kind rule (engineering decomposition): `record` is allowed only as entry 1 or for `not_received → payment_received` (payment arrived). Every other entry (received → not received, same status with changed amount or evidence) MUST be a `correction` of the current entry.

#### `pay_ta_exposure` — TA-wide guard row (B28)

| Column | Type | Null | Meaning |
|---|---|---|---|
| `ta_account_id` | text | no | PK; FK |
| `ceiling_paise` | bigint | no | default `0` |
| `ceiling_source` | text | no | `default` \| `set` |
| `current_ceiling_change_id` | text | yes | FK `pay_ceiling_changes`; `NULL` iff `ceiling_source = 'default'` |
| `reserved_paise` | bigint | no | Σ unused reservation remainder (CCR-15-01) |
| `tm_paid_unrecovered_paise` | bigint | no | Σ (`tm_paid_paise` − `ta_received_allocated_paise`) over fee records |
| `created_at` | timestamptz | no | |
| `revision` | bigint | no | |

Constraints: all money `≥ 0`; `CHECK ((ceiling_source = 'default') = (current_ceiling_change_id IS NULL))`; `CHECK (ceiling_source = 'set' OR ceiling_paise = 0)`. Created with the first `pay_application_state` of the TA, or by a ceiling command (`INSERT … ON CONFLICT DO NOTHING`). Lock `FOR UPDATE` in every reservation, conversion and ceiling change.

#### `pay_ceiling_changes`

| Column | Type | Null | Meaning |
|---|---|---|---|
| `change_id` | text | no | PK `cec_` |
| `ta_account_id` | text | no | FK |
| `kind` | text | no | `lower` \| `increase` |
| `old_paise` | bigint | no | ceiling at request (lower: at effect) |
| `new_paise` | bigint | no | requested ceiling |
| `basis_change_id` | text | yes | `current_ceiling_change_id` at request time (`NULL` = default) |
| `reason` | text | no | ≥ 10 characters |
| `requested_by` | text | no | FK SuperAdmin |
| `requested_at` | timestamptz | no | |
| `approved_by` | text | yes | FK SuperAdmin (increase only) |
| `declined_by` | text | yes | FK SuperAdmin |
| `decision_reason` | text | yes | |
| `decided_at` | timestamptz | yes | |
| `state` | text | no | `effective` \| `increase_requested` \| `increase_declined` |
| `effective_at` | timestamptz | yes | set iff `state = 'effective'` |
| `revision` | bigint | no | |

Constraints: `CHECK (kind <> 'lower' OR (new_paise < old_paise AND state = 'effective' AND approved_by IS NULL))`; `CHECK (kind <> 'increase' OR new_paise > old_paise)`; `CHECK (kind <> 'increase' OR state <> 'effective' OR (approved_by IS NOT NULL AND approved_by <> requested_by))`; `CHECK ((state = 'effective') = (effective_at IS NOT NULL))`; `UNIQUE (ta_account_id) WHERE state = 'increase_requested'`.

#### `pay_exposure_reservations`

| Column | Type | Null | Meaning |
|---|---|---|---|
| `reservation_id` | text | no | PK `exr_` |
| `ta_account_id` | text | no | FK |
| `application_id` | text | no | FK |
| `logical_effect_key` | text | no | `govfee:<application id>:<attempt ordinal>` (rev 2, COV-02/MON-02; contract 01 §1.1) |
| `amount_paise` | bigint | no | reserved amount; `> 0`; only raised, never lowered |
| `converted_paise` | bigint | no | amount recorded as TM-paid against this reservation; default `0` (CCR-15-01) |
| `state` | text | no | `reserved` \| `converted_to_paid` |
| `first_authorization_id` | text | no | FK `core_action_authorizations` |
| `authorization_id` | text | no | latest authorization that reused it |
| `created_at` | timestamptz | no | |
| `updated_at` | timestamptz | no | |
| `revision` | bigint | no | |

Constraints: `UNIQUE (logical_effect_key)` (guard: one reservation per logical effect); `CHECK ((state = 'converted_to_paid') = (converted_paise > 0))`. Unused remainder = `GREATEST(amount_paise − converted_paise, 0)`; it stays counted (release PARKED).

#### `pay_government_fees`

| Column | Type | Null | Meaning |
|---|---|---|---|
| `fee_id` | text | no | PK `gfe_` |
| `application_id` | text | no | FK |
| `ta_account_id` | text | no | FK |
| `logical_effect_key` | text | no | UNIQUE |
| `reservation_id` | text | no | FK; UNIQUE |
| `attempt_ordinal` | integer | no | rev 2: the authorization's attempt ordinal (replaces `government_attempt_no`) |
| `fee_amount_paise` | bigint | no | expected government fee at authorization |
| `tm_paid_paise` | bigint | no | default `0`; exact amount TM paid (from act evidence) |
| `ta_liability_paise` | bigint | no | default `0`; equals `tm_paid_paise` once paid: the exact government amount the TA owes, independent of outcome or delay |
| `ta_received_allocated_paise` | bigint | no | default `0`; changes only through the Accounts-verified allocated bank receipt path, which is PARKED |
| `outstanding_recovery_paise` | bigint | no | `GENERATED ALWAYS AS (ta_liability_paise − ta_received_allocated_paise) STORED` |
| `state` | text | no | `reserved` \| `tm_paid` \| `payment_unknown` \| `recovered_partially` \| `recovered` |
| `paid_exceeds_reservation` | boolean | no | true when `tm_paid_paise > amount_paise` of the reservation (I-15-04) |
| `authorization_id` | text | no | latest authorization |
| `paid_evidence_id` | text | yes | FK `ops_act_evidence` |
| `paid_event_at` | timestamptz | yes | |
| `created_at` | timestamptz | no | |
| `revision` | bigint | no | |

Constraints: `CHECK (ta_received_allocated_paise <= ta_liability_paise)`; `CHECK (state NOT IN ('recovered_partially','recovered'))` in this build (no path reaches them; the check makes an accidental write fail loudly; removing it needs the PARKED Accounts decision). Service charge and quoted price never appear in this table (B27).

#### `pay_financial_exceptions` — `Payment_Missing_Override` (B29)

| Column | Type | Null | Meaning |
|---|---|---|---|
| `exception_id` | text | no | PK `fex_` |
| `application_id` | text | no | FK |
| `ta_account_id` | text | no | FK |
| `kind` | text | no | `work_under_gate1_exception` \| `commitment_under_gate2_exception` \| `payment_corrected_after_work` \| `worked_then_corrected_to_unpaid` |
| `cause_ref` | text | no | gate exception id (`gex_`) or payment entry id (`pay_`) |
| `cause_entry_no` | integer | yes | entry number for entry-caused exceptions; closure needs a later entry |
| `state` | text | no | `open` \| `closed_collected` |
| `accountable_superadmin_id` | text | no | FK; the SuperAdmin nudged |
| `opened_at` | timestamptz | no | |
| `opened_by_operation_id` | text | no | FK `sys_operations` |
| `nudge_notice_id` | text | yes | FK `dlv_notices` |
| `closed_by_entry_id` | text | yes | FK `pay_service_entries` |
| `closed_at` | timestamptz | yes | |
| `revision` | bigint | no | |

Constraints: `UNIQUE (application_id, kind, cause_ref)`; `CHECK ((state = 'closed_collected') = (closed_by_entry_id IS NOT NULL))`. Index `(accountable_superadmin_id) WHERE state = 'open'`; index `(ta_account_id, opened_at) WHERE state = 'open'`.

Invariant T-F22 (as revised by CCR-15-01), checked by T-15-26: for every TA, `reserved_paise = Σ GREATEST(amount_paise − converted_paise, 0)` and `tm_paid_unrecovered_paise = Σ (tm_paid_paise − ta_received_allocated_paise)`.

### 2.2 TA Delivery

#### `dlv_releases` — one row per file-send check (B12)

| Column | Type | Null | Meaning |
|---|---|---|---|
| `byte_release_id` | text | no | PK `rls_` |
| `channel` | text | no | `web_retrieval` \| `bulk_selection` \| `document_email` |
| `recipient_account_id` | text | no | FK; for email the owning TA |
| `requested_by_account_id` | text | yes | FK; the actor (NULL for task-driven email checks) |
| `application_id` | text | no | FK |
| `ta_account_id` | text | no | FK; owning TA (scope) |
| `subject_kind` | text | no | `document_version` \| `artifact` \| `packet` |
| `subject_id` | text | no | `dov_`, `art_` or `pkt_` |
| `document_version_id` | text | yes | exact version (NULL for packet) |
| `artifact_id` | text | yes | |
| `packet_id` | text | yes | |
| `selection_id` / `selection_item_no` | text / integer | yes | bulk item |
| `email_send_id` | text | yes | |
| `check_result` | text | no | `allowed` \| `denied` |
| `deny_reason` | text | yes | reason code; required iff denied |
| `checked_at` | timestamptz | no | |
| `blob_id`, `sha256`, `size_bytes`, `media_type` | text / bytea / bigint / text | yes | exact bytes approved by the check; NULL when denied |
| `result` | text | yes | `streamed` \| `stream_failed` \| `unavailable` \| `denied`; NULL = unrecorded |
| `bytes_sent` | bigint | yes | |
| `finished_at` | timestamptz | yes | |
| `software_release_id` | text | no | FK `sys_releases` |
| `operation_id` | text | no | FK; the parent operation (command or task-created operation) |

Constraints: `CHECK ((check_result = 'denied') = (deny_reason IS NOT NULL))`; `CHECK (check_result <> 'denied' OR result = 'denied')`; `UNIQUE (selection_id, selection_item_no) WHERE selection_id IS NOT NULL`; `UNIQUE (email_send_id, document_version_id) WHERE email_send_id IS NOT NULL`. Result is written once: `UPDATE … WHERE byte_release_id = $1 AND result IS NULL`. Indexes `(application_id, checked_at)`, `(recipient_account_id, checked_at)`.

#### `dlv_selections`, `dlv_selection_items`

| Table | Columns |
|---|---|
| `dlv_selections` | `selection_id` PK `sel_`; `requested_by` FK; `recipient_account_id` FK (= requester); `created_at`; `item_count` (1…`delivery.maxSelectionItems`); `outcome` NULL \| `complete` \| `aborted` (archive end written or not); `zip_bytes_sent` bigint NULL; `finished_at` NULL; `operation_id` FK |
| `dlv_selection_items` | PK (`selection_id`, `item_no`); `application_id`; `subject_kind`; `subject_id`; `document_version_id` NULL; `result` NULL \| `included` \| `unavailable` \| `failed`; `reason` NULL (reason code); `byte_release_id` NULL FK |

`result` is NULL until that item's send finishes; NULL after the selection ended is shown as `unrecorded` (never `included`). Result written once (`WHERE result IS NULL`).

#### `dlv_email_sends`

| Column | Type | Null | Meaning |
|---|---|---|---|
| `email_send_id` | text | no | PK `eml_` |
| `application_id` | text | no | FK |
| `ta_account_id` | text | no | owning TA |
| `recipient_account_id` | text | no | = owning TA account |
| `recipient_email_snapshot` | text | no | **PD**; owning TA's current account email; refreshed at the prepare check |
| `document_version_ids` | jsonb | no | exact versions (1…`delivery.maxEmailAttachments`) |
| `state` | text | no | `EMAIL_SEND_STATES` |
| `origin` | text | no | `harness` \| `manual_resend` |
| `attributed_by` | text | yes | FK operator account for `manual_resend`; NULL for harness (fact carries the harness label) |
| `resend_of` | text | yes | FK self |
| `task_id` | text | yes | FK `sys_tasks` |
| `queued_at` | timestamptz | no | |
| `sending_at` | timestamptz | yes | |
| `result_at` | timestamptz | yes | |
| `result_code` | text | yes | reason code for `failed` / `denied_at_check` |
| `transport_label` | text | yes | `synthetic` (only wired transport) |
| `revision` | bigint | no | |

Constraints: `UNIQUE (resend_of) WHERE resend_of IS NOT NULL`; `CHECK (origin <> 'manual_resend' OR (attributed_by IS NOT NULL AND resend_of IS NOT NULL))`; state changes by conditional update on `state`.

#### `dlv_notices`

| Column | Type | Null | Meaning |
|---|---|---|---|
| `notice_id` | text | no | PK `ntc_` |
| `recipient_account_id` | text | no | FK (TA or staff) |
| `application_id` | text | yes | FK |
| `kind` | text | no | `NOTICE_KINDS` (+ `financial_follow_up`, CCR-15-04) |
| `params` | jsonb | no | ids and closed codes only; no personal data |
| `ack_required` | boolean | no | |
| `posted_at` | timestamptz | no | |
| `posted_by_command` | text | no | command or task step name |
| `read_at` | timestamptz | yes | unused in this build (no write on GET); stays NULL |
| `acknowledged_at` | timestamptz | yes | |
| `acknowledged_operation_id` | text | yes | |
| `dedupe_key` | text | no | UNIQUE |
| `revision` | bigint | no | |

#### `dlv_handovers` (immutable records)

| Column | Type | Null | Meaning |
|---|---|---|---|
| `handover_id` | text | no | PK `hnd_` |
| `application_id` | text | no | FK |
| `ta_account_id` | text | no | |
| `kind` | text | no | `packet` \| `physical` \| `manual_operator_email` \| `direct_external` |
| `packet_id` | text | yes | required iff `kind = 'packet'` |
| `document_version_ids` | jsonb | no | versions concerned (may be empty for `direct_external`) |
| `recipient_kind` | text | no | `owning_ta_account` \| `owning_ta_current_email` \| `ta_representative_in_person` \| `external_authority_direct` |
| `recipient_detail` | text | yes | **PD**; email for manual email (must equal owning TA's current email); name for in-person |
| `external_reference` | text | yes | provenance reference for direct external delivery |
| `tm_held_result` | boolean | no | false for `direct_external` without a TravelMudra-held result (truthful absence) |
| `evidence` | jsonb | no | `EvidenceRef[]` (≥ 1) |
| `release_checks` | jsonb | yes | for manual email: per-version check outcome at record time (informational) |
| `event_at` | timestamptz | yes | |
| `recorded_by` | text | no | FK operator |
| `recorded_at` | timestamptz | no | |
| `system_verified` | boolean | no | `false` for `manual_operator_email`, `direct_external`, `physical`; `true` only for `packet` handovers evidenced by a system release record |
| `operation_id` | text | no | |

Constraints: `UNIQUE (packet_id) WHERE kind = 'packet'`; `CHECK ((kind = 'packet') = (packet_id IS NOT NULL))`. Append-only by writer convention and trigger.

#### `dlv_packets`

| Column | Type | Null | Meaning |
|---|---|---|---|
| `packet_id` | text | no | PK `pkt_` |
| `application_id` | text | no | FK |
| `ta_account_id` | text | no | |
| `state` | text | no | `building` \| `built` \| `released` \| `superseded` \| `build_failed` (CCR-15-06) |
| `built_from` | jsonb | no | `[{requirementType, versionId, sha256}]` captured at build request |
| `evidence_fingerprint` | bytea | no | `documents.evidenceFingerprint` at build request |
| `material_revision_at_build` | bigint | no | |
| `blob_id` | text | yes | FK `sys_blobs`; set when built |
| `sha256`, `size_bytes` | bytea / bigint | yes | |
| `requested_by` | text | no | operator |
| `requested_at` | timestamptz | no | |
| `built_at` | timestamptz | yes | |
| `released_by` | text | yes | |
| `released_at` | timestamptz | yes | |
| `release_basis` | jsonb | yes | control result (readiness id or readiness exception id, governing ids) |
| `failure_code` | text | yes | |
| `task_id` | text | yes | |
| `revision` | bigint | no | |

Constraints: `UNIQUE (application_id) WHERE state IN ('building','built','released')`; `CHECK (state NOT IN ('built','released') OR blob_id IS NOT NULL)`.

### 2.3 Derived Views

`tm_app` has `SELECT, INSERT, UPDATE, DELETE` on `view_` tables (projector upserts). `tm_owner` truncates them for rebuild. No view table has a foreign key into a business table (rebuild order independence); every row carries `as_of_seq`.

| Table | PK | Columns |
|---|---|---|
| `view_projector_state` | `projector` | `last_tx_id xid8`, `last_seq bigint`, `state` (`running`, `rebuilding`, `stalled`, `failed`), `healthy boolean`, `lag_ms bigint`, `last_error_code text`, `rebuild_started_at`, `updated_at` |
| `view_applications` | `application_id` | `ta_account_id`, `group_id`, `country_id`, `offering_id`, `service_mode`, `assigned_operator_id`, `lifecycle`, `outcome`, `progress`, `pending jsonb` (`PendingOnAction`), `payment_status`, `open_financial_exceptions int`, `travel_start_date`, `travel_return_date`, `display_name text` **PD**, `search tsvector` **PD**, `submitted_at`, `updated_seq`, `as_of_seq` |
| `view_assignment_queue` | `application_id` | `reason_code`, `since_seq`, `since_at`, `offering_id`, `ta_account_id`, `gate1_state` (`passed`, `blocked`, `exception_granted`), `as_of_seq` |
| `view_audit_index` | `seq` | `fact_type`, `subject_type`, `subject_id`, `actor_kind`, `actor_account_id`, `task_id`, `engineering_label`, `command_name`, `ta_account_id`, `group_id`, `application_id`, `offering_id`, `recorded_at`, `retrospective` (no `before`/`after`/`reason` copies) |
| `view_ta_history` | (`application_id`, `seq`) | `ta_account_id`, `line_code` (closed set, Section 4.3), `params jsonb` (ids, codes, amounts, dates), `recorded_at` |
| `view_financial_follow_up` | `exception_id` | `application_id`, `ta_account_id`, `kind`, `state`, `accountable_superadmin_id`, `opened_at`, `closed_at`, `application_closed boolean`, `as_of_seq` |
| `view_measures_wait_intervals` | (`application_id`, `start_seq`) | `owner_kind`, `reason_code`, `tm_controlled boolean`, `start_at`, `end_seq`, `end_at`, `offering_id`, `service_mode`, `cohort_key` |
| `view_measures_results` | (`measure_code`, `cohort_key`, `dimension_key`) | `n`, `n_with_value`, `n_missing`, `missing_share_bp integer` (basis points; no `numeric` columns, contract §10.1), `value_json jsonb` (NULL when `n_with_value = 0`), `status` (`ok`, `insufficient_sample`, `not_captured`, `stale`), `computed_at`, `as_of_seq` |

Views MUST NOT be read by `evaluateControls`, any writer or any guard (contract §3.11; instrumented in T-F34 and T-15-49).

## 3. Commands, writers and procedures

Every command runs through `runCommand` (contract §4.2): parse → actor kind → content hash → SERIALIZABLE attempt loop (admission and epoch, operation-key lookup, actor re-check, `authorize`, `handle`, operation row, commit) with bounded whole-command retry on `40001`/`40P01`. The rows below list only what this module adds. "Lock" order follows contract §4.1. Every accepted command appends at least one fact. A rejected command leaves no operation row, no fact and no task.

Common idempotency behaviour (applies to every command unless a row says otherwise):

| Case | Behaviour |
|---|---|
| Nth retry, same key, same content | Replay of the recorded summary, re-authorized under current read access. Handler does not run. No new fact. |
| Same key, different content | `conflict_operation_key`. Nothing written. |
| Lost acknowledgement | Client sees `outcome_unknown`; resubmitting the same key replays or (if nothing committed) runs once. Lookup `GET /{surface}/operations/:key`. |
| New key, same business effect | Handler runs; the business guard named in the command row decides (typically `stale_revision` or `conflict_duplicate`). |
| Serialization failure | Whole command retried with the same key and content (new `now`, new ids); exhaustion ⇒ `conflict_retry_exhausted` (503, retryable). |

### 3.1 Payment Records

#### 3.1.0 Gate inputs supplied to Core (B26, B27)

| Gate | Core reads | Payment Records guarantees |
|---|---|---|
| Gate 1 (`assign`, incl. assistance and reassignment) | `payments.servicePayment(tx, app, 'share')` → `{ status, entryId, statusRevision }` | Status is the latest entry's status; `unrecorded` and `not_received` both fail Gate 1. Assignment never writes a payment row (assignment is not payment, B26). |
| Gate 1 exception basis | `statusRevision` stored in the exception basis | Every entry increments `status_revision`, so any entry after a grant makes the exception stale (fresh decision required). |
| Gate 2 (first of fee payment / government submission per government attempt, `travelmudra_filed` only) | same call, inside `core.authorize_external_act` | Same status source as Gate 1; Gate 1 passing or its exception is never read as Gate 2 (B27). |
| Gate 2 exception basis | `statusRevision`, `attempt_ordinal` and the act states of the attempt (rev 2) | A new entry or a changed act state makes the exception stale. |
| Consumed Gate 1 / Gate 2 exception while status ≠ `payment_received` | Core calls `payments.openFinancialException` in the same transaction | Kinds `work_under_gate1_exception` / `commitment_under_gate2_exception`; accountable SuperAdmin = grantor of the exception. |
| Other service modes | Core marks Gate 2 `not_applicable` (`service_mode_not_applicable`) | No fee record, no reservation, no inferred payer rule (B27). |

#### C-P1 `pay.record_service_status` (B26, B11, B29)

| Item | Specification |
|---|---|
| Actor / action | `account`, role `superadmin`, MFA; action `payment.record_service_status` on `{type:'application', id}`. Others ⇒ `not_found_or_forbidden`. |
| Route | `POST /admin/applications/:applicationId/payments/entries` |
| Input | `{ applicationId, kind: 'record'\|'correction', status: 'payment_received'\|'not_received', correctsEntryId?: pay_…, amountPaise?: decimal string ≥ 0, evidence: EvidenceRef[1..5] (kinds external_reference\|attestation), eventAt?: ISO instant, reason?: string 10..1000, expectedStatusRevision: bigint }` |
| Checks (order) | 1 runner admission/epoch, key lookup, actor active SuperAdmin with MFA. 2 `authorize`. 3 `core.lockApplication(tx, id, 'share')` (any lifecycle: payment facts may arrive after completion, B29). 4 Lock `pay_application_state` `FOR UPDATE`. 5 `expectedStatusRevision = status_revision` else `stale_revision`. 6 Kind rules: entry 1 MUST be `record`; `record` after entry 1 only for `not_received → payment_received`, else `validation_failed`/`payment_entry_kind_invalid`; `correction` requires `correctsEntryId = current_entry_id` else `validation_failed`/`correction_target_not_current`; a correction that changes no status, amount or evidence ⇒ `validation_failed`/`correction_no_change`. 7 Evidence: ≥ 1 ref, notes ≤ 200 chars, no URL-like or email-like strings in notes; `reason` required for correction. |
| Writes | Insert `pay_service_entries` (`entry_no = entry_count + 1`, `previous_status`, `work_authorized_at_entry` from the locked application). Update `pay_application_state` (`current_status`, `current_entry_id`, `status_revision + 1`, `entry_count + 1`, `revision + 1`). Financial exception effects below. |
| Financial exception effects | Let `W = work_authorized_at_entry`. (a) `kind = correction` ∧ W ∧ `previous_status = payment_received` ∧ new status `not_received` ⇒ open `worked_then_corrected_to_unpaid` (cause = new entry id). (b) Any other `correction` ∧ W ⇒ open `payment_corrected_after_work` (cause = new entry id). (c) New status `payment_received` ⇒ close every open exception of the application whose cause is a gate exception, or whose `cause_entry_no < entry_no` (`closed_collected`, `closed_by_entry_id`). The exception opened in (b) by this same entry stays open (I-15-01, OD-15-01). Accountable SuperAdmin for (a)/(b) = the recording SuperAdmin. Each opened exception posts one nudge notice (`delivery.postNotice`, dedupe `finexc:<exceptionId>`). |
| Facts | `pay.service_payment_recorded` (kind `record`) or `pay.service_payment_corrected` (kind `correction`): subject `service_payment`/entry id; scope TA, group, application, offering; `before {status, entryId, statusRevision}`; `after {status, entryId, statusRevision, amountPaise}`; `reason`; `evidence`; `eventAt`. Plus `pay.financial_exception_opened` / `pay.financial_exception_closed` per exception and `dlv.notice_posted` per nudge. |
| Tasks | none |
| Errors | `not_found_or_forbidden`, `validation_failed` (`payment_entry_kind_invalid`, `correction_target_not_current`, `correction_no_change`, field codes), `stale_revision`, `conflict_duplicate` (`correction_fork`, from `UNIQUE (corrects_entry_id)`), `conflict_operation_key`, `conflict_retry_exhausted`, `maintenance`, `outcome_unknown`. |
| Concurrency | Two SuperAdmins with the same `expectedStatusRevision`: the second sees a changed revision under `FOR UPDATE` ⇒ `stale_revision`. Entry vs `core.assign`: both lock `core_applications` first (share here, update there) and `pay_application_state` second (update here, share there); whichever commits first decides. If assignment commits first, the entry sees `W = true` and opens the exception; if the entry commits first, Gate 1 evaluates the new status. Entry vs gate-exception grant: the grant's stored `statusRevision` goes stale; consumption refuses (`gate_exception_stale`). A new key with the same content after success fails `stale_revision` (the business duplicate guard). |
| Not done | Never changes assignment, gate history, external-act state, completion or price. Never writes `ta_received_allocated_paise` (government fee recovery is a separate receivable, B28). |

#### C-P2 `pay.lower_ceiling` (B28)

| Item | Specification |
|---|---|
| Actor / action | SuperAdmin; `ceiling.lower` on `{type:'ta_finance', taAccountId}`. Unilateral (one SuperAdmin). Not a privileged elevation: allowed while the audit projection is degraded (containment, B33). |
| Route | `POST /admin/tas/:taAccountId/ceiling/lower` |
| Input | `{ taAccountId, newCeilingPaise ≥ 0, reason 10..1000, expectedCeilingBasis: cec_… \| 'default' }` |
| Checks | 1 runner. 2 `authorize`; target account role `ta` (any status; a suspended TA keeps its exposure). 3 Ensure and lock `pay_ta_exposure` `FOR UPDATE`. 4 `expectedCeilingBasis` = `current_ceiling_change_id` (or `default`) else `stale_revision`. 5 `newCeilingPaise < ceiling_paise` else `validation_failed`/`ceiling_not_lower`. |
| Writes | Insert `pay_ceiling_changes` (`lower`, `effective`, `old_paise`, `new_paise`, `effective_at = now`). Update `pay_ta_exposure` (`ceiling_paise`, `ceiling_source = 'set'`, `current_ceiling_change_id`). |
| Facts | `pay.ceiling_lowered` (subject `ceiling`/change id; scope TA; before/after ceiling; after also `countedPaise` at effect; reason; identity of actor). |
| Effect on existing exposure | None. Reservations and paid amounts stay counted. If counted exposure exceeds the new ceiling, every new reservation fails `exposure_ceiling_breach` (B28 "stops new spend without erasing it"). An open increase request becomes stale (`ceiling_changed_since_request` at approval). |
| Errors | as C-P1 class; `validation_failed`/`ceiling_not_lower`. |
| Concurrency | Serialized with reservations and other ceiling commands on the `pay_ta_exposure` row lock. |

#### C-P3 `pay.request_ceiling_increase` (B28, B11)

| Item | Specification |
|---|---|
| Actor / action | SuperAdmin; `ceiling.increase_request` on `ta_finance`. |
| Route | `POST /admin/tas/:taAccountId/ceiling/increase-requests` |
| Input | `{ taAccountId, newCeilingPaise, reason 10..1000, expectedCeilingBasis }` |
| Checks | 1–4 as C-P2. 5 `newCeilingPaise > ceiling_paise` else `ceiling_not_higher`. 6 No open request (partial unique) else `conflict_duplicate`/`ceiling_increase_already_requested`. |
| Writes | Insert `pay_ceiling_changes` (`increase`, `increase_requested`, `basis_change_id`). Ceiling unchanged. |
| Facts | `pay.ceiling_increase_requested`. |

#### C-P4 `pay.approve_ceiling_increase` (B28, B11)

| Item | Specification |
|---|---|
| Actor / action | SuperAdmin distinct from the requester; `ceiling.increase_approve`. `privilegedElevation = true`: refused with `unavailable_dependency`/`audit_degraded` while the audit projection is unhealthy (B33; reversible engineering choice). |
| Route | `POST /admin/ceiling-changes/:changeId/approve` |
| Input | `{ changeId, expectedChangeRevision, reason? }` |
| Checks | 1 runner (approver active, MFA). 2 `authorize`. 3 Lock `pay_ta_exposure` `FOR UPDATE`, then the change row. 4 `state = 'increase_requested'` else `conflict_duplicate`/`ceiling_request_not_open`. 5 `actor ≠ requested_by` else `control_blocked`/`self_approval_forbidden`. 6 Requester account still `active` SuperAdmin else `control_blocked`/`requester_inactive`. 7 `basis_change_id = current_ceiling_change_id` (NULL = default) else `control_blocked`/`ceiling_changed_since_request`. 8 Revision. |
| Writes | Change row → `effective`, `approved_by`, `decided_at`, `effective_at = now`. Exposure → `ceiling_paise = new_paise`, `ceiling_source = 'set'`, `current_ceiling_change_id`. Database `CHECK` repeats the distinct-approver rule. |
| Facts | `pay.ceiling_increase_approved` with requester and approver identities, old/new values, both reasons, effective time. |
| Concurrency | Two approvers: conditional update `WHERE state = 'increase_requested'`; one wins, the other `ceiling_request_not_open`. Approval vs lowering: lock order serializes; the loser sees a changed basis. |

#### C-P5 `pay.decline_ceiling_increase`

SuperAdmin (any active, including the requester, which is a withdrawal); action `ceiling.increase_decline` (CCR-15-17; interim `ceiling.increase_request`); route `POST /admin/ceiling-changes/:changeId/decline`; input `{ changeId, expectedChangeRevision, reason }`; conditional `increase_requested → increase_declined`; fact `pay.ceiling_increase_declined`. Ceiling unchanged.

#### C-P6 `pay.reassign_follow_up_owner` (B29, B32; CCR-15-03)

| Item | Specification |
|---|---|
| Actor / action | SuperAdmin; `financial_exception.reassign_owner` (new action). |
| Route | `POST /admin/financial-follow-up/:exceptionId/reassign-owner` |
| Input | `{ exceptionId, accountableSuperAdminId, reason, expectedRevision }` |
| Checks | exception `open`; target account active SuperAdmin with MFA (else `control_blocked`/`follow_up_owner_not_eligible`); revision. |
| Writes / facts | `accountable_superadmin_id` changed; new nudge notice (dedupe `finexc:<id>:<revision>`); fact `pay.financial_exception_owner_changed` (before/after owner, reason). |
| Interim | This is an engineering gap, not an owner decision. Until CCR-15-03 is accepted the route does not exist; the follow-up list flags `follow_up_owner_inactive` and the monitor counts the exception as an unowned wait (B32). |

#### 3.1.7 Deliberate boundary routes (no command runs; Section 6)

| Route (POST) | Action | Result for SuperAdmin / accounting grantee | Others |
|---|---|---|---|
| `/admin/tas/:taAccountId/reservations/:reservationId/release` | `exposure.release` | `unavailable_parked` / `parked_reservation_release` | `not_found_or_forbidden` |
| `/admin/applications/:applicationId/fees/:feeId/exclude` | `exposure.release` | `unavailable_parked` / `parked_fee_exclusion_record` | same |
| `/accounts/receipts/verify`, `/accounts/allocations`, `/accounts/adjustments`, `/accounts/recoveries` | `accounts.receipt_verify`, `accounts.adjust` | `unavailable_parked` / `parked_accounts_actions` | same |
| `/admin/financial-follow-up/:exceptionId/write-off`, `/accounts/write-offs` | `accounts.write_off` | `unavailable_owner_decision` / `unselected_write_off` | same |
| `/admin/applications/:applicationId/refunds` | — (no action) | `unavailable_owner_decision` / `unselected_refund` | same |

These routes check session, CSRF and origin, call `policy.decide`, and render the boundary page. They create no operation record and no fact (T-15-22).

#### 3.1.8 Writers and queries for other owners (`payments/api.ts`)

| Function | Caller and transaction | Behaviour |
|---|---|---|
| `ensureApplicationState(tx, app, ta)` | Core draft creation (form and intake) | `INSERT pay_application_state … ON CONFLICT DO NOTHING`; `INSERT pay_ta_exposure … ON CONFLICT DO NOTHING` (ceiling 0, `default`). No fact (Core's draft fact covers the acceptance). Idempotent on Nth intake retry. |
| `servicePayment(tx, app, lock)` | Core gates, pages | Reads `pay_application_state`; `share` lock only with a `WriteTx`. |
| `reserveExposure(tx, req)` | Core `core.authorize_external_act` for the **fee-carrying act** (rev 2, MON-01): `government_fee_payment` when the governing declaration declares `governmentFee = { payer: 'travelmudra', timing: 'separate_act' }`, `government_submission` when `timing: 'with_submission'` (contract 01 §7.4) | Algorithm R below. |
| `recordTmFeePaid(tx, req)` | Core `recordExternalActEvidence` (fee-carrying act → `filed_evidenced`, any act kind) | Algorithm F below. |
| `recordFeePaymentUnknown(tx, req)` | Core (fee-carrying act → `filing_unknown`) | Fee `reserved → payment_unknown`; reservation unchanged (still counted); fact `pay.fee_payment_state_changed` (CCR-15-02, accepted). |
| `recordFeeNotPaid(tx, req)` (CCR-15-02, accepted) | Core (fee-carrying act → `not_filed_evidenced`) | Fee `reserved\|payment_unknown → reserved`; reservation unchanged and reusable by a fresh authorization of the same logical effect. Fact `pay.fee_payment_state_changed`. |
| `openFinancialException(tx, req)` | Core (gate exception consumption), C-P1 | `INSERT … ON CONFLICT (application_id, kind, cause_ref) DO NOTHING RETURNING`; when created: fact `pay.financial_exception_opened`, nudge notice; returns the existing id otherwise. |
| `exposure(tx, ta, lock)`, `outstandingMoney(tx, app)`, `openFinancialExceptions(tx, app)`, `feeSummary(tx, app)` | Core group end, completion, pages | Read-only. `outstandingMoney` codes per contract I-01. |

Algorithm R — `reserveExposure` (extends contract §8.6; Core already holds `core_applications` `FOR UPDATE` and `pay_application_state` `FOR SHARE`):

1. Validate `amountPaise > 0`, key = `logicalEffectKey(applicationId, attemptOrdinal)` where `attemptOrdinal` is the ordinal stored on the calling authorization (rev 2, COV-02/MON-02; 1 in this build). A mismatch is a defect (`internal`), never a business refusal. A fee act authorized after the evidenced submission of the same attempt therefore reuses the same key, and one logical fee has one reservation (B28).
2. Ensure and lock `pay_ta_exposure` `FOR UPDATE`.
3. Read reservation and fee record by `logical_effect_key` `FOR UPDATE`.
4. Fee state `payment_unknown` ⇒ `control_blocked`/`fee_payment_unknown` (no blind repeat payment, B23). Fee state `tm_paid` ⇒ `control_blocked`/`fee_already_paid_for_effect` (a paid effect is never re-authorized).
5. `remainder = existing ? GREATEST(amount − converted, 0) : 0`; `counted = reserved_paise + tm_paid_unrecovered_paise − remainder`.
6. `ceiling_source = 'default'` ∧ `ceiling_paise = 0` ∧ `servicePaymentStatus = 'payment_received'` ⇒ `control_blocked`/`exposure_parked_paid_case_default_ceiling`, boundary `parked`.
7. `counted + max(amountPaise, existing.amount ?? 0) > ceiling_paise` ⇒ `control_blocked`/`exposure_ceiling_breach`. Non-overridable: no exception kind, flag or role passes it (B28, B20).
8. No existing ⇒ insert reservation (`reserved`) and fee record (`reserved`, `fee_amount_paise = amountPaise`); fact `pay.exposure_reserved` and `pay.government_fee_recorded`. Existing with smaller amount ⇒ raise `amount_paise`; existing with greater or equal amount ⇒ keep (no partial release). Update `authorization_id`, fee `fee_amount_paise`, `authorization_id`. Fact `pay.exposure_reserved` (after: `reused`, amount, counted, ceiling).
9. Recompute `reserved_paise` by delta; assert the per-TA invariant in debug/test builds.

Because Core calls R inside the authorization transaction, a rollback of either leaves neither (B28 "commit together or not at all", T-F19).

Algorithm F — `recordTmFeePaid(tx, { key, amountPaise, authorizationId, evidenceId, eventAt })`:

1. Lock `pay_ta_exposure` `FOR UPDATE`; reservation and fee `FOR UPDATE`.
2. Fee state ∈ {`reserved`, `payment_unknown`} else `stale_revision`/`fee_state_changed`.
3. `oldRemainder = GREATEST(amount − converted, 0)`; set `converted_paise = amountPaise` (one payment per logical effect), state `converted_to_paid`; `newRemainder = GREATEST(amount − amountPaise, 0)`.
4. Fee: `tm_paid_paise = amountPaise`, `ta_liability_paise = amountPaise`, state `tm_paid`, `paid_exceeds_reservation = amountPaise > amount`, evidence link.
5. Aggregate: `reserved_paise += newRemainder − oldRemainder`; `tm_paid_unrecovered_paise += amountPaise`. Counted exposure never decreases (it stays equal when paid ≤ reserved, and grows when paid > reserved).
6. Fact `pay.exposure_converted_paid` (after: paid, liability, remainder, `paidExceedsReservation`).

There is no writer that lowers `reserved_paise`, `tm_paid_unrecovered_paise` or `amount_paise`, or that writes `ta_received_allocated_paise`. A static test (T-15-21) asserts that no SQL in the module decrements these columns.

### 3.2 TA Delivery

#### 3.2.0 Release check `checkRelease` (B12; contract 01 §6.9 revision 2)

Runs inside a write transaction (command or continuation). It records exactly one `dlv_releases` row and one `dlv.release_checked` fact for every call, allowed or denied. The normative order is contract 01 §6.9 (rev 2; SEC-01, SEC-02, SEC-06, record 14 CCR-02, CCR-15-13). Summary:

| # | Check | Deny code |
|---|---|---|
| 1 | Admission open and writer epoch current (`assertWriter`) | (transaction refused: `maintenance`; no row) |
| 2 | Recipient account `active`; `document_email` and TA channels: the application's owning TA; `staff_review`: the incident owner, the named reviewer or the assigned operator of the artifact's `uploaded_for_application_id` | `recipient_inactive`, `recipient_not_owning_ta`, `review_channel_not_applicable` |
| 3 | Current policy relation of the requester for `document.retrieve_bytes` (`document.retrieve_for_review` on `staff_review`) | `recipient_access_revoked` (only reachable in continuations; a command's `authorize` refuses first with `not_found_or_forbidden`) |
| 4 | No active protection mark on the application (I-14) | `protection_mark_active` |
| 5 | Version exists, same group as the application, `currency = current`, `content_safe = true`, `bytes_state = canonical`; `safety_passed` alone never passes (rev 2, SEC-06) | `version_replaced`, `version_blocked`, `bytes_unavailable`, `version_not_processed` |
| 6a | Subject `document_version`: `purpose = 'evidence'` and a positive **Documents** association of that exact version to this application and type | `version_not_eligible`, `association_not_positive` |
| 6b | Subject `artifact` (`purpose = 'official_result'`): an **Operations** `ops_artifacts` row with this `document_version_id`, `application_id` = this application and `association_status = 'verified'`, then `artifactEligibility = eligible` (rev 2, SEC-01). Channel `staff_review`: artifact `pending_review`/`conflict`, not `blocked`/`noncurrent`, application = `uploaded_for_application_id` or an incident candidate (rev 2, SEC-02) | `association_not_positive`, `artifact_not_eligible`, `review_channel_not_applicable` |
| 6c | Subject `packet`: state `released` with a `core_packet_releases` row (rev 2, COV-03); blob canonical; every constituent version still `current`, canonical and positively associated | `packet_not_released`, `packet_superseded`, `packet_constituent_unavailable` |
| 7 | `operations.blockingIncidents({ applicationId, documentVersionId })` empty (`staff_review`: an open `artifact_association` incident does not block) | `incident_block` |
| 8 | Allowed: record blob id, SHA-256, size and media type of exactly this subject | — |

No step substitutes another version or artifact (B12). A denial never changes an outcome. A change committed after the check and before the end of that file's send is the accepted interval (B12 OWNER_DECISION, B45): there is no send lock, no streaming recheck and no recall promise.

#### 3.2.1 Evidence continuation (CCR-15-05)

Result recording after streaming, and per-item checks inside a bulk selection, run as an evidence continuation: one SERIALIZABLE transaction with `assertWriter`, attributed to the parent operation's actor and operation id, with no actor-permission precondition. A continuation MAY only call: `checkRelease` (which re-checks authorization itself and records a denial), `recordReleaseResult`, `recordSelectionItemResult`, `documents.markBytesUnavailable`, `operations.openIncident(kind 'bytes_integrity')`. It grants nothing and changes no permission. Admission closed ⇒ the continuation fails and the result stays NULL, shown as `unrecorded` (never success). Interim until CCR-15-05: continuations run as `runCommand` with the requester as actor and a server-generated operation key; if the requester lost access, the result stays NULL.

#### C-D1 `dlv.retrieve_document` (B12, B31, B10)

| Item | Specification |
|---|---|
| Actor / action | `account`: TA (owner), operator (assigned, or active group-read grantee), SuperAdmin; action `document.retrieve_bytes` on `document_version` / `artifact` / `packet` resource with `applicationId`. `support_view` never (contract §5.3). |
| Routes | `POST /ta/applications/:applicationId/documents/:versionId/retrieve`, `POST /ta/applications/:applicationId/packets/:packetId/retrieve`, and the same paths under `/ops/` and `/admin/` (the `/admin/` byte routes are the interim of owner decision OD-R2-04, review finding SEC-03). |
| Input | `{ applicationId, subject: { kind: 'document_version'\|'artifact'\|'packet', id } }`; `_op`, `_csrf`. |
| Pre-command | Acquire a stream slot (`delivery.maxConcurrentStreams` global, `delivery.maxStreamsPerAccount`). None free ⇒ `capacity_limited`/`capacity_streams` (503, `Retry-After`), no command, no row. |
| Checks | 1 runner. 2 `authorize` (unauthorized or foreign ⇒ `not_found_or_forbidden`, nothing recorded). 3 `checkRelease` (Section 3.2.0). |
| Writes | One `dlv_releases` row (`channel = web_retrieval`). |
| Facts | `dlv.release_checked` (subject `byte_release`; after: subject, version id, check result, deny code). |
| After commit | Allowed ⇒ `verifyThenStream(blob, sha256, size)`. Verification failure ⇒ continuation: result `unavailable`, `documents.markBytesUnavailable`, `operations.openIncident('bytes_integrity', dedupe 'bytes:<versionId>')`; response 409 unavailable page; no byte sent. Stream completed ⇒ continuation: result `streamed`, `bytes_sent`; fact `dlv.release_result_recorded`. Client abort or mid-stream error ⇒ connection destroyed; continuation: `stream_failed`. Process crash ⇒ NULL (`unrecorded`). Denied ⇒ 409 page with the deny code message; the command is still accepted (the denial is recorded evidence). |
| Replay | Same key ⇒ recorded summary only. The route MUST NOT stream on replay; the page states the recorded result and offers a new retrieval with a new `_op` (a new check). This prevents a byte send without a fresh check. |
| Errors | `not_found_or_forbidden`, `capacity_limited`, `maintenance`, `conflict_operation_key`, `conflict_retry_exhausted`, `outcome_unknown`; denial is an accepted outcome rendered as `control_blocked` page (HTTP 409). |
| Concurrency | The check takes `FOR SHARE` on `doc_versions` and `ops_artifacts`; block/replace writers take `FOR UPDATE`; the first commit decides. Revocation of the requester after the check is inside the accepted interval for that file. |

#### C-D1b `dlv.retrieve_for_review` (rev 2, SEC-02; B13 secondary review)

| Item | Specification |
|---|---|
| Actor / action | operator who is the incident owner or the named reviewer of an open `artifact_association` incident, or the assigned operator of the artifact's `uploaded_for_application_id`; action `document.retrieve_for_review` on `{ type: 'review_artifact', artifactId, incidentId }`. TA, other operators, SuperAdmin and support view ⇒ `not_found_or_forbidden`. |
| Route | `POST /ops/incidents/:incidentId/artifacts/:artifactId/review-copy` |
| Checks | runner; `authorize`; `checkRelease(channel 'staff_review', incidentId)` (Section 3.2.0 rows 2, 3, 5, 6b, 7). |
| Writes / facts | One `dlv_releases` row (`channel = staff_review`, `incident_id`); `dlv.release_checked`; result through the evidence continuation as C-D1. |
| Rules | Available only while the artifact is `pending_review` or `conflict`; a `blocked` or `noncurrent` artifact or a disclosure/integrity incident denies. Never counted as TA delivery or completion evidence; never shown on TA pages. Replay never re-streams. |

#### C-D2 `dlv.retrieve_selection` (B12)

| Item | Specification |
|---|---|
| Actor / action | as C-D1; action `selection.retrieve` plus `document.retrieve_bytes` per item resource. |
| Routes | `POST /ta/selections`, `POST /ops/selections`, `POST /admin/selections` |
| Input | `{ items: [{ applicationId, subjectKind, subjectId }] }`, 1…`delivery.maxSelectionItems` (50), no duplicate item. |
| Checks | 1 runner. 2 `authorize` every item; any unauthorized item ⇒ whole request `not_found_or_forbidden`, nothing recorded (no disclosure of which item failed). 3 Stream slot. |
| Writes / facts | `dlv_selections` + `dlv_selection_items` (result NULL); fact `dlv.selection_recorded` (item count, subject ids). |
| After commit | ZIP stream (`yazl`). For each item in order: continuation `checkRelease(channel bulk_selection)`; denied ⇒ item `unavailable` + reason; allowed ⇒ `verifyThenStream` into the entry; verification failure ⇒ item `unavailable`/`bytes_unavailable` (+ bytes-integrity incident); entry fully written to the socket ⇒ continuation: item `included`, release `streamed`. Mid-stream failure ⇒ current item `failed` (`stream_failed`), remaining items `failed`/`selection_aborted`, selection `outcome = aborted`. Final entry `results.txt` lists `item_no`, result and closed code only (no names). Selection `outcome = complete` after the archive end is written. |
| Per-item interval | Each item is checked immediately before its own bytes. The accepted interval is per file (B12). Revocation committed before an item's check denies that item and every later item (`recipient_access_revoked`). |
| Replay | Same key ⇒ recorded selection summary and per-item results; never re-streams. |

#### C-D3 `dlv.acknowledge_notice` (B31, B17)

Actor: the notice recipient (any role); action `notice.acknowledge`; route `POST /{ta,ops,admin}/notices/:noticeId/acknowledge`; input `{ noticeId, expectedRevision }`. Checks: recipient = actor (else `not_found_or_forbidden`); `ack_required` (else `validation_failed`/`ack_not_required`); conditional update `WHERE acknowledged_at IS NULL` (else `conflict_duplicate`/`already_acknowledged`). Writes `acknowledged_at`, `acknowledged_operation_id`. Fact `dlv.notice_acknowledged`. Acknowledgement is a distinct fact from posting and from any retrieval (B31). Reading a notice writes nothing.

#### C-D4 Packet build writer `requestPacketBuild` (rev 2, COV-03, BND-10; replaces the command `dlv.build_packet`)

The build is requested by the Operations command `ops.request_packet_build` (record 13 CMD-P1, route `POST /ops/applications/:applicationId/packet/build`, action `operator.build_packet`), which calls this Delivery writer in its transaction. There is no `dlv.build_packet` command.

| Item | Specification |
|---|---|
| Caller | `ops.request_packet_build` only, inside its transaction (application locked by Operations/Core rules: lifecycle `submitted`, outcome NULL, mode `preparation_only`, every mandatory requirement `satisfied`) |
| Input | `{ applicationId, versionIds, requestedBy, supersedePacketId? }` |
| Checks | Existing packet in `building\|built\|released` ⇒ `conflict_duplicate`/`packet_exists` unless `supersedePacketId` names it and it has no handover record and no `core_packet_releases` row (`packet_handed_over` / `packet_released` otherwise). |
| Writes | Superseded packet → `superseded`. New packet `building` with `built_from` (requirement type, version id, SHA-256 of each satisfied requirement), `evidence_fingerprint`, `material_revision_at_build`. Enqueue `delivery.build_packet` (dedupe `delivery.build_packet:<packetId>`, `onBehalfOf` = operator, `onBehalfAction = operator.build_packet`). |
| Facts | `dlv.packet_requested`; `dlv.packet_state_changed` for the superseded packet. |

Task `delivery.build_packet`: see Section 5.

#### C-D5 Packet release writer `markPacketReleased` (rev 2, COV-03, BND-10; replaces the command `dlv.release_packet`)

Release is a readiness-gated **Core** acceptance (B04, B18, B19, B34): `core.release_packet` (record 13 CMD-P2, route `POST /ops/applications/:applicationId/packet/release`, action `operator.release_packet`) evaluates `release_packet` controls, consumes a readiness-gate exception when used, writes `core_packet_releases` and calls this Delivery writer in the same transaction. There is no `dlv.release_packet` command and Core exposes no `consumeGateException` writer to Delivery.

| Item | Specification |
|---|---|
| Caller | `core.release_packet` only |
| Input | `{ packetId, packetReleaseId }` |
| Checks | Packet `built`, blob area `canonical` (else `packet_not_ready`); packet `evidence_fingerprint` = live `documents.evidenceFingerprint` and `material_revision_at_build` = live `material_revision` (else `control_blocked`/`packet_stale`). Conditional update `WHERE state = 'built'`. |
| Writes | Packet → `released`, `released_by`, `released_at`, `packet_release_id`, `release_basis` (copy of the Core basis ids). |
| Facts | `dlv.packet_state_changed` (the acceptance fact is Core's `core.packet_released`). |
| Not done | No automatic notice and no automatic send. The TA retrieves the packet through C-D1 (release check per send). |

#### C-D6 `dlv.record_handover` (B04, B24, B31)

| Item | Specification |
|---|---|
| Actor / action | assigned operator; `operator.record_handover` (CCR-15-17; interim `operator.release_packet`). |
| Route | `POST /ops/applications/:applicationId/handovers` |
| Input | `{ applicationId, kind: 'packet'\|'physical', packetId?, documentVersionIds?, recipientKind: 'owning_ta_account'\|'ta_representative_in_person', recipientDetail?, evidence: EvidenceRef[1..5], eventAt? }` |
| Checks | 1 runner. 2 `authorize`. 3 Lock application `FOR UPDATE`. 4 `kind = packet`: packet `released` with a `core_packet_releases` row (`packet_not_released`); the governing declaration's `outcomeEvidence.handover` is supported (contract 01 §9.2; else `control_blocked`/`declaration_item_unresolved`); declared evidence `ta_retrieval_of_released_packet` requires a `dlv_releases` row with `result = streamed` for this packet to the owning TA (`handover_evidence_missing`); declared `recorded_physical_handover_to_ta` requires an evidence ref. 5 `kind = physical`: evidence ref required; no originals (Operations owns originals, B30). 6 One packet handover per packet (`conflict_duplicate`/`handover_exists`). |
| Writes | `dlv_handovers` row (`system_verified = true` only for a packet handover evidenced by a streamed release record). When `outcomeEvidence.handover` is satisfied and the outcome is NULL: `core.recordOutcomeFromEvidence('prepared_and_handed_over', evidence: handover id)` in the same transaction (contract §6.11); Core requires the `core_packet_releases` row (rev 2, COV-03). The handover evidence standard is engineering-declarable structure (contract 01 I-15; review finding BND-04 part (d) rejected). |
| Facts | `dlv.handover_recorded` (+ Core outcome facts). |

#### C-D7 `dlv.record_manual_email` (B24, B31)

| Item | Specification |
|---|---|
| Actor / action | assigned operator; `operator.record_manual_email`. |
| Route | `POST /ops/applications/:applicationId/manual-emails` |
| Input | `{ applicationId, recipientEmail, documentVersionIds[1..10], evidence[1..5], eventAt }` |
| Checks | `authorize`; normalized `recipientEmail` = `identity.getRecipient(ownerTa).currentEmail` (else `validation_failed`/`recipient_not_owning_ta`; the page directs a wrong-address send to the wrong-recipient incident flow in Operations); each version belongs to the application's group. |
| Writes | `dlv_handovers` (`manual_operator_email`, `system_verified = false`, `release_checks` = per-version result of the Section 3.2.0 checks 4–9 at record time, informational only). |
| Facts | `dlv.manual_email_recorded`. |
| Effect on completion | None in this build: the completion check counts only system-recorded `accepted`/`synthetic_accepted` sends (contract OD-02 interim). The page states "attributed record; not system-verified". |

#### C-D8 `dlv.record_direct_external` (B24, B31)

Assigned operator; `operator.record_direct_external`; route `POST /ops/applications/:applicationId/direct-external`; input `{ applicationId, externalReference, recipientDetail?, evidence[1..5], eventAt? }`. Writes `dlv_handovers` (`direct_external`, `recipient_kind = external_authority_direct`, `tm_held_result = false`, `system_verified = false`, empty version list). Fact `dlv.direct_external_recorded`. No bytes are released and no TravelMudra-held download is claimed.

#### C-D9 `dlv.manual_resend` (B31, B46)

| Item | Specification |
|---|---|
| Actor / action | assigned operator of the email's application; `operator.manual_resend`. |
| Route | `POST /ops/email-sends/:emailSendId/resend` |
| Input | `{ emailSendId, expectedRevision, reason 10..1000 }` |
| Checks | 1 runner. 2 `authorize`. 3 Source state `failed`. Source `uncertain` ⇒ `unavailable_known_limitation`/`uncertain_email_handling_unselected` (B46). Any other source state ⇒ `validation_failed`/`resend_source_not_failed`. 4 Mail transport configured (`none` ⇒ `unavailable_owner_decision`/`real_mail_transport_unselected`). 5 `UNIQUE (resend_of)` (second resend of the same failed send ⇒ `conflict_duplicate`/`resend_exists`). |
| Writes | New `dlv_email_sends` (`queued`, `origin = manual_resend`, `attributed_by`, `resend_of`, same version ids). Enqueue `mail.deliver` (dedupe `mail.deliver:<newEmailSendId>`). |
| Facts | `dlv.email_queued` (after: `resendOf`, `attributedBy`, reason). |
| Recheck | The new send runs the full release check at prepare time; it is never treated as a continuation of the failed send (B31). |

#### C-D10 Harness-only commands (B46; contract §7.11)

| Command | Actor | Effect | Refusal |
|---|---|---|---|
| `harness.dlv.queue_document_email` | actor kind `harness` (rev 2, record 13 CCR-07) with label `<name>` via `tm harness deliver-email`; test code | Insert `dlv_email_sends` (`queued`, `origin = harness`, recipient snapshot = owning TA's current email); enqueue `mail.deliver`; fact `dlv.email_queued` with `command_name = 'harness.dlv.queue_document_email'` | Refused when `env = production` (`unavailable_known_limitation`/`delivery_send_trigger_unselected`) |
| `harness.dlv.post_result_notice` (CCR-15-07, accepted) | same | `postNotice(kind 'result_available', dedupe 'result_available:<applicationId>:<artifactId\|outcome>')`; fact `command_name = 'harness.dlv.post_result_notice'` | same |

Product surfaces never call these. Operator and SuperAdmin routes `POST /ops/applications/:applicationId/document-email` and `POST /admin/applications/:applicationId/completion-check` exist only to render `unavailable_known_limitation` with `delivery_send_trigger_unselected` / `completion_check_trigger_unselected`.

#### 3.2.11 Writers for other owners (`delivery/api.ts`)

| Function | Behaviour |
|---|---|
| `checkRelease(tx, req)` | Section 3.2.0. |
| `recordReleaseResult(tx, id, result, bytesSent)` | `UPDATE … WHERE result IS NULL`; zero rows ⇒ no-op return `already_recorded` (set once). Fact `dlv.release_result_recorded`. |
| `postNotice(tx, req)` | `INSERT … ON CONFLICT (dedupe_key) DO NOTHING RETURNING`; on insert fact `dlv.notice_posted`; params MUST pass a zod schema per kind that admits only ids, closed codes, dates and paise. Recipient MUST be an account; for TA-facing kinds it MUST be the application's owning TA. Kind `result_available` is refused unless the caller is a harness command (CCR-15-07). |
| `deliveryEvidence(tx, app)` | As contract §6.9, plus `releases: { streamedToOwningTa: number; latestUnrecorded: number }` and `handovers[].systemVerified`. Used by Core's harness completion check and group-end sweep. `staff_review` releases are excluded. |
| `recordSelectionItemResult(tx, req)` | Set once (`WHERE result IS NULL`); continuation-only (CCR-15-05, accepted). |
| `requestPacketBuild(tx, req)` (rev 2) | C-D4. |
| `markPacketReleased(tx, req)` (rev 2) | C-D5; only caller `core.release_packet`. |

### 3.3 Derived Views (no commands)

Views own no command. Projectors and rebuild are kernel-hosted jobs (Section 5). The `tm views rebuild <projector>` CLI procedure:

| Step | Rule |
|---|---|
| 1 | Runs as `tm_owner`; takes `pg_advisory_lock(hash('views:'\|\|projector))` so the in-process projector pauses. |
| 2 | Sets `view_projector_state.state = 'rebuilding'`, `healthy = false` (lists show the rebuilding banner; privileged elevation stays refused while the audit projector rebuilds). |
| 3 | `TRUNCATE` the projector's tables; resets the cursor to `(0, 0)`. |
| 4 | Replays from business truth: per-application projectors iterate authoritative rows (`core_applications`, `pay_financial_exceptions`, …) and compute current values; history projectors (`audit_index`, `ta_history`, `wait_intervals`) replay `tailFacts` from the start. |
| 5 | Sets `state = 'running'`; appends kernel fact `sys.projection_rebuilt` (CCR-15-08; engineering actor). |
| Crash | Re-run starts again from step 2. Business state is never touched. |

### 3.4 Release and cutover procedures (B39)

All procedures are `tm` CLI subcommands run by an attributed engineering actor (`--actor <label>`) as `tm_owner`. They write only kernel tables and kernel facts. Each step is re-runnable: it derives progress from stored state (`sys_installation`, `sys_releases`, `sys_checkpoints`, `sys_migrations`) and never from process memory.

#### 3.4.1 Release manifest (`tm release register`)

| Field | Content | Check at register |
|---|---|---|
| `sourceCommit` | 40-hex commit of the built tree | working tree clean (`git status --porcelain` empty) else refuse `release_tree_dirty` |
| `lockfileSha256` | SHA-256 of `package-lock.json` | `npm ci --ignore-scripts=false` result recorded; lockfile integrity verified |
| `artifactSha256` | SHA-256 over sorted `(relative path, mode, SHA-256)` of the installed tree (`src/`, `node_modules/`, `migrations/`, `package.json`, `package-lock.json`, `.nvmrc`) | recomputed at verify |
| `configSha256` | canonical JSON digest of the nonsecret `tm.config.json` | config passes zod; contains no secret values (secret-name scan) |
| `schemaHead` | last migration id required; `migrationChecksums[]` | every file checksum listed |
| `compatibleSchemaHeads[]` | schema heads this binary can run against (for code rollback) | each listed head exists in the migration list |
| `declarationSchemas[]`, `capabilitySet[]` | supported `decl/N` schemas and capability id/version pairs (binding source) | non-empty |
| `workerContract` | `tm-worker/1` | `node src/workers/<kind>.ts --contract` output equals |
| `toolchain` | toolchain manifest SHA-256, resolved tool paths and version strings (PostgreSQL, ClamAV engine, Tesseract, qpdf, poppler, age, bwrap) | every tool resolves |
| `runtime` | Node version, PostgreSQL server major | match `.nvmrc` / cluster |
| `createdAt`, `createdBy` | engineering label | — |

Secrets, secret names' values, personal data and absolute home paths MUST NOT appear in the manifest (T-15-57). Register inserts `sys_releases` (unique `manifest_sha256`) and appends `sys.release_registered`. Re-registering the same manifest is a no-op returning the existing `release_id`.

#### 3.4.2 Cutover (`tm cutover <step>`; `tm cutover run` executes steps 1–6 and stops before open)

| # | Step | Preconditions | Writes / facts | Crash and re-run |
|---|---|---|---|---|
| 1 | `close --reason` | target release registered | `closeAdmission(kind 'cutover')`: `admission = closed`, `writer_epoch + 1`; waits for in-flight command `FOR SHARE` locks; `NOTIFY`; fact `sys.admission_closed`. Effects: commands, task leases, byte releases (`assertWriter`) and new blob intents (CCR-15-11) refuse with `maintenance`; the running server sees the new epoch, aborts in-flight streams (results stay `unrecorded`), and exits 75. | Already closed with kind `cutover` ⇒ no-op. Closed with another kind ⇒ refuse `closed_for_other_reason` (no silent reclassification). |
| 2 | `drain` | closed | `waitForDrain(timeout)`; terminates remaining `tm_app` backends; waits until every `sys_processes` row of the old release has `stopped_at` or a heartbeat older than 3 × interval. | Idempotent. |
| 3 | `checkpoint` | closed, drained | Insert `sys_checkpoints` (`state 'capturing'`); rev 2 (SEC-05): `pg_dump -Fc` streamed through a hashing tee into `age -r <recipient>` to `<install>/checkpoints/<ckp>.dump.age` (mode 0600) — no plaintext dump touches disk; record `export_sha256` (plaintext stream) and `encrypted_sha256`; update to `captured` with `last_fact_seq`, `last_op_seq`, `closed_fact_seq`; fact `sys.cutover_checkpoint`. A prior `captured` checkpoint of the same closure becomes `superseded`. | Re-run makes a new checkpoint; a `capturing` row left by a crash is marked `superseded` and its partial ciphertext file is deleted. |
| 4 | `migrate` | closed; checkpoint `captured` for the current closure | `tm migrate` as `tm_owner` (distinct authority: `tm_app` has no DDL, T-F06); checksum ledger; facts `sys.migration_applied`. Migrations MUST NOT rewrite ids, `core_*` case identities, `ops_launch_decisions`, `ops_suspensions` or `sys_tasks` identities (T-15-64). | Ledger makes it idempotent; a changed applied file is refused. |
| 5 | `activate` | ledger head = target `schemaHead` | `active_release_id = target`; fact `sys.release_activated`. The old binary can no longer register (contract §4.7). | Idempotent. |
| 6 | `verify` | active = target | `checkReleaseCompatibility`: schema head, worker contract (spawns each worker with `--contract` through `WorkerRunner`, including the rev 2 worker self-test), artifact digest recomputed from the installed tree, bindings. Rev 2 (COV-13 item 9): runs `cat.register_release_catalogue` (record 12 E1) and, when needed, `cat.submit_release_impact` (E2) as engineering **maintenance commands** while still closed (contract 01 §4.2 `maintenanceAllowed`, `assertMaintenanceWriter`); unsupported bindings create release impact assessments, not a block. Starts the target server once in maintenance mode to prove it registers, adopts the epoch and serves only the maintenance page; stops it. Sets `verified_at`; fact `sys.release_verified` (CCR-15-08). | Re-runnable (E1/E2 replay by operation key); any mismatch leaves `verified_at` NULL and admission closed. |
| 8 | `tm cutover cleanup` (rev 2, SEC-05) | admission open since the cutover and a later `complete` backup set exists | deletes the ciphertext file of every `superseded` or `used_for_rollback` checkpoint; row `state = 'disposed'`; fact `sys.checkpoint_disposed`. Never disposes the newest `captured` checkpoint of an open cutover. | Idempotent. |
| 7 | `tm admission open --reason` | separate deliberate invocation | `openAdmission` (contract §4.7 checks); fact `sys.admission_opened`. | Never run by `tm cutover run`. |

Maintenance survives restart because admission is stored state; a restarted server adopts the new epoch but serves only the maintenance page and leases no task while closed (T-15-58). Original job and case identities and business approval/suspension state are preserved because cutover writes no business table. After opening, no external action or delivery is replayed: `mail.deliver` tasks whose `effect_started_at` is set become `effect_uncertain` on their next lease; no task kind performs a government action or payment (contract §2.21).

#### 3.4.3 Rollback

| Kind | Command | Allowed when | Refused when | Effect |
|---|---|---|---|---|
| Code rollback (current data kept) | `tm rollback code --to <releaseId>` | admission closed; target release registered; current ledger head = target `schemaHead` or ∈ target `compatibleSchemaHeads` | head incompatible ⇒ `schema_incompatible`: the old binary stays unavailable pending a compatible repair release (B39) | steps 5–6 with the old release; open is a separate deliberate step; fact `sys.rollback_performed` (`kind 'code'`) |
| Snapshot rollback (closed-cutover exception) | `tm rollback snapshot --checkpoint <ckp>` | `snapshotRollbackAllowed(ckp).allowed` — admission stayed closed since `closed_fact_seq`, no `sys_operations.op_seq > last_op_seq`, no non-cutover fact after `last_fact_seq`, the fact range since the checkpoint is readable, and the dump file exists with matching `export_sha256` | `admission_opened_since_checkpoint`, `work_accepted_since_checkpoint`, `history_unknown` (unreadable facts, missing or mismatching dump, current database unreachable, checkpoint row absent) | drop and recreate the database through the cluster bootstrap role, decrypt the checkpoint with the custody identity and stream it into `pg_restore` (rev 2, SEC-05; no plaintext file), reset every projector cursor and rebuild the projections before reopening (REC-03 class), mark the checkpoint `used_for_rollback`, keep admission closed, fact `sys.rollback_performed` (`kind 'snapshot'`, after: digest of the post-checkpoint kernel facts that the rollback removed — parked P2 note REC-25); refusal directs to the restore boundary (Section 3.5) |

A refusal is final for that checkpoint: there is no `--force` flag (T-15-61).

### 3.5 Backup and restore procedures (B40)

#### 3.5.1 Backup set (`tm backup create`)

Rev 2 (REC-01, REC-02, SEC-05, REC-18 encryption part): the set is captured from one exported database snapshot after a drain, the blob inventory is selected by owner reference in any area, and every artifact is stream-encrypted so no plaintext copy exists at rest.

| Step | Rule |
|---|---|
| 1 Admission and drain | Requires admission `closed` (the operator runs `tm admission close --kind maintenance --reason backup` first; refuses while open: `backup_requires_closed_writers`). Then runs the cutover drain (`waitForDrain`; every `sys_processes` row of the active release stopped or with a heartbeat older than 3 × interval; no `tm_app` backend). Because every kernel write path calls `assertWriter` (contract 01 §4.7 rev 2), no task record, blob move or continuation can commit after the closure. |
| 2 Free space | Estimates the set size from `pg_database_size` plus `Σ size_bytes` of the inventory query, and checks `backup.minFreeBytes` (≥ estimate × 1.2) on the backup filesystem; else `capacity_storage`, nothing written. |
| 3 Snapshot | One `REPEATABLE READ READ ONLY` transaction as `tm_owner` runs `pg_export_snapshot()` and, in that snapshot, reads `last_fact_seq`, `last_op_seq`, `max(sys_facts.tx_id)`, `writer_epoch` and the blob inventory (step 5). The transaction stays open until step 5 ends. Insert `sys_backup_sets` (`state 'capturing'`, `snapshot_name`, the seqs) in a separate transaction. |
| 4 Database | `pg_dump -Fc --snapshot=<snapshot_name>` as `tm_owner`, streamed through a SHA-256 tee into `age -r <recipient>` → `db.dump.age`. The dump and the inventory therefore describe exactly the same committed state. |
| 5 Blobs | Inventory (rev 2, REC-01) = every `sys_blobs` row with `owner_ref_id IS NOT NULL` and `state ∈ {referenced, missing, integrity_failed}` **in any area**, including `staging` rows whose move is pending. Physical location: the recorded area, else `pending_move_to` (contract 01 §4.12 rule 3). For each `referenced` blob: read, verify SHA-256 and size against the row, stream through `age` to `blobs/<recorded area>/<blob_id>.age`. Rows already `missing`/`integrity_failed` are listed as pre-existing gaps (damaged state preserved). A referenced row whose file is absent in every location, or whose digest mismatches now, is a capture gap ⇒ status `incomplete`. Unreferenced staging blobs (`intent`, `staged`, no owner) and `removed` blobs are excluded: no business fact depends on their bytes. |
| 6 Prerequisites | `prerequisites.json` (encrypted): schema head + migration checksums, active release manifest and digest, `configSha256` + nonsecret config copy, PostgreSQL major, toolchain digest, secret **names** and `secret_generation` (never values), age recipient fingerprint, TOTP wrap-key generation and its custody fingerprint (contract OD-04; key custody P1 item REC-19). |
| 7 Manifest | `manifest.json.age`: set id, times, seqs, `max_fact_tx_id`, `db.dump` digests, blob inventory (`blob_id`, area, owner ref type, size, SHA-256, `captured\|gap`), explicit gaps with codes, prerequisites digest, status. |
| 8 Encryption | Every file above is written only as `age` ciphertext (streamed in steps 4–7); the plaintext outer file `SET.json` holds only set id, status, created time and the SHA-256 of each encrypted file (no personal data, no blob owner ids). Directory mode 0700, files 0600. |
| 9 Last good set | Only a set with status `complete` whose encrypted digests re-verify replaces `<backupDir>/LAST_GOOD` (write temp pointer, `fsync`, `rename`, `fsync` dir). An `incomplete` set is kept for diagnosis (ciphertext only) and never replaces the pointer. No backup is deleted automatically; the last good set is never deleted by `tm`. |
| 10 Finish | Close the snapshot transaction. Update `sys_backup_sets` (`complete` / `incomplete`, digests); fact `sys.backup_recorded`. Admission stays closed; the operator reopens deliberately. |
| Crash | A `capturing` row and a partial directory of ciphertext remain; `LAST_GOOD` is unchanged; re-run creates a new set and marks the old row `abandoned`. No plaintext residue exists (T-F50). |

Key custody: the age identity (`backup_age_identity`) lives in the secrets directory; the server never loads it (contract §10.10); backup creation needs only the recipient. A set and its identity on the same host prove local restore practice only; the set records `custody: 'same_host'` and the restore output says so. Off-host custody is a production choice not selected (B37).

#### 3.5.2 Restore (`tm restore --set <id> --into <namespaceDir>`)

| Step | Rule |
|---|---|
| 1 Isolation | Target namespace = new install root (new data dir, new PostgreSQL cluster and socket dir, new blob dir, new secrets dir, new config with `http.bind` loopback and `mail.transport = 'none'`). Refuses a target that contains an existing installation (`restore_target_not_empty`). The source installation is never modified (damaged state preserved). |
| 2 Verify | Decrypt with the identity; verify every encrypted and plaintext digest; check prerequisites (PostgreSQL major, a release whose `schemaHead` or `compatibleSchemaHeads` matches, toolchain resolvable). Failure ⇒ refuse with the missing prerequisite code; nothing created. |
| 3 Secrets | Generate a full new secret set (all `SECRET_NAMES` except `backup_age_identity`, which stays in custody); `secret_generation + 1`; TOTP seeds re-wrapped from the old to the new wrap key (contract OD-04 interim). |
| 4 Database | Init cluster, create roles with new passwords, decrypt and stream the dump into `pg_restore` as `tm_owner`. The export was captured closed, so the restored `sys_installation` starts `closed`. Immediately set `closure_kind = restore_clean \| restore_interval_loss`, `writer_epoch + 1`, `last_restore_id`. Rev 2 (REC-03): stop the restored cluster and advance its transaction-id epoch with `pg_resetwal -e <E>` (as the cluster owner, user-space; cluster stopped), where `E = (manifest.max_fact_tx_id >> 32) + 1`, so that every new `xid8` exceeds every restored `sys_facts.tx_id`; restart; then reset every projector cursor and rebuild all projections (`tm views rebuild --all`) before any reopening. A restore that cannot advance the epoch refuses to finish (`restore_prerequisite_missing`). |
| 5 Bytes | Copy each captured blob into the area its restored `sys_blobs` row records (`quarantine` stays `quarantine`, `canonical` stays `canonical`, a referenced `staging` blob with a pending move stays in `staging` and its move task runs after reopening) with mode 0600; verify SHA-256; no document processing state, safety verdict, association or currency changes. Backup inclusion grants no clearance and no publication. |
| 6 Credentials and tasks | Old sessions, OTP challenges, enrolment tokens and task lease tokens fail verification under the new keys; no row is rewritten to fabricate revocation. Leased tasks are recovered as `failed_retryable` only after reopening. Rev 2 (REC-06): every restored task with effect class `non_repeatable` that is not terminal (`pending`, `failed_retryable`, `leased`) becomes `cancelled_obsolete` with `last_error_code = 'restore_boundary'` and fact `sys.task_cancelled`; its document email send becomes `uncertain` with `result_code = 'restore_boundary'` (the source may have sent it during the lost interval; B46 uncertain handling applies, no automatic resend, B40); `iam.send_mail` challenges are void anyway (new secrets). Each affected application is a scope candidate (Section 3.5.3) and is listed in the procedure presentation as a residual item. |
| 7 Record | Insert `sys_restores` (`interval_loss`, `gaps`, `secret_generation`, `state 'closed_pending_owner'`, `scope_state`, CCR-15-08); fact `sys.restore_completed`. |
| Interval loss | `interval_loss = true` unless the operator supplies `--source-last-fact-seq N` read from the still-readable source database and `N = set.last_fact_seq`. Unknown ⇒ loss. |
| Crash | Re-run with the same target resumes: steps check what exists (cluster, roles, restored schema, blob digests) and repeat only missing parts. Admission is closed from step 4 onward and the export itself is closed, so no server start can admit work; no task is leased and no worker is spawned while closed (T-15-69). |

#### 3.5.3 Scope declaration and protection marks (interval-loss restore only)

| Command | Rule |
|---|---|
| `tm restore scope --restore <rst> [--exclude <file with per-id reasons>] --basis <evidence ref>` | Rev 2 (REC-05, BND-18): the scope is computed **conservatively from the restored state**, then widened by surviving evidence; it is never built by inclusion alone. Candidate set (rule `scope/1`) = every application that is open in the restored database and could have reached authorization, fee payment, packet release, byte release or document email during the lost interval: (a) submitted with an active assignment; (b) any act `authorized` or `filing_unknown`, or readiness `current`; (c) a packet `built` or `released`; (d) an eligible artifact or a positively associated canonical version (possible byte release); (e) a restored task cancelled at the restore boundary (step 6); (f) every application id named in the allowlisted evidence sources (diagnostics with operation and subject ids, synthetic mailbox records, operator-supplied external records). An application leaves the set only with a recorded per-id reason that cites positive evidence (for example the source database proves no fact after the backup for it). Stores `declared_scope` (ids with inclusion basis), `scope_basis` (rule version, restored-state query digest, every evidence source consulted, exclusions with reasons) and `scope_state = 'declared'`; fact `sys.restore_scope_declared` (CCR-15-08). If any evidence source is unreadable or a candidate lacks a decision, `scope_state` stays `unknown` and the whole installation stays closed (B40). The candidate rule is presented to the product owner in the reopening procedure (Section 3.5.4). |
| `tm restore mark --restore <rst> --application <app> --possibly-filed --possibly-paid --possibly-released --actor <label>` | Calls `core.recordProtectionMark` (contract §6.4) as the engineering actor in one SERIALIZABLE transaction. `UNIQUE (application_id, restore_id)`: a retry returns `already_recorded` and writes nothing new. It creates no external-act attempt, no authorization, no payment entry, no exposure release, no document clearance and no notice (B40, B41). |
| What a mark does not repair | Lost contact changes, grants, revocations and artifact blocks. The procedure presentation lists them as residual risk for the product owner. |

#### 3.5.4 Reopening and procedure presentation

| Item | Rule |
|---|---|
| Who decides | The product owner only. `tm admission open --reopen-approval-ref <ref>` records the reference; `openAdmission` refuses for `restore_interval_loss` unless the reference is present, `scope_state = 'declared'` with a recorded `scope_basis`, and a mark exists for every declared application (contract 01 §4.7 rev 2). |
| No partial states | There is no reconciliation-only state, staged reopening or scoped technical hold (B40). The installation is either closed or open. |
| Presentation | `tm restore present-procedure --restore <rst>` prints (and writes into the restore namespace, mode 0600) the production reopening procedure for the product owner's approval: set identity and custody, gaps, interval-loss basis, declared scope and its evidence, marks recorded, residual risks (lost contacts, grants, revocations, blocks, notices, uncertain sends), credential reset effects, the SuperAdmin re-entry rule (existing commands, supplied evidence, accepted role authority), and the explicit statement that engineering re-enters no other business fact. It never opens admission. Before real-data use this procedure MUST be approved by the product owner (B40); a procedure that needs a product change awaits separate approval. |

### 3.6 Capacity (B38)

#### 3.6.1 Finite limits (configuration; values are starting points for the ≈ 8 GB host)

| Resource | Limit key | Default | At the limit |
|---|---|---|---|
| HTTP concurrent requests | `http.maxConcurrentRequests` | 64 | 503 `capacity_limited`/`capacity_connections`, `Retry-After: 5` |
| HTTP connections / keep-alive | `http.maxConnections`, `http.keepAliveMs` | 256 / 5 000 | new connections refused by the server |
| Request body | `http.bodyLimitBytes` + per-route | contract §10.9 | 413 `validation_failed` |
| Database pool | `db.appPoolMax` | 12 | acquire timeout 2 s ⇒ `capacity_limited`/`capacity_connections` |
| Lock wait / statement | `command.lockTimeoutMs`, `statementTimeoutMs` | 2 000 / 5 000 | CCR-15-10 mapping |
| Task queue | `tasks.maxPending` | 5 000 | enqueue refuses ⇒ the whole command fails `capacity_limited`/`capacity_queue`; no partial acceptance |
| Workers | `tasks.concurrency.fetch/parse` | 1 / 1 | tasks wait (`pending`); raised only after a measured capacity record |
| Byte streams | `delivery.maxConcurrentStreams`, `maxStreamsPerAccount` | 8 / 2 | `capacity_limited`/`capacity_streams` |
| Bulk selection | `delivery.maxSelectionItems`, `maxSelectionBytes` | 50 / 256 MiB | `validation_failed`/`selection_too_large` |
| Email attachments | `delivery.maxEmailAttachments`, `maxEmailBytes` | 10 / 20 MiB | `validation_failed` |
| Temporary storage | `storage.minFreeBytes`, `maxStagingBytes` | 5 GiB / 2 GiB | `capacity_limited`/`capacity_storage` (contract §4.12) |
| Diagnostics | `diag.maxFileBytes` × files | 50 MiB × 5 | rotation; dropped-line counter |
| Backups | `backup.minFreeBytes` | 2 × last set size, min 10 GiB | backup refused |
| Projector batch | `views.batchSize`, `views.maxLagMs` | 500 / 60 000 | unhealthy above max lag |

Rules: a limit refusal happens before any business write, or rolls back the whole command. Accepted work and its owner are retained (tasks stay `pending` with owner). Required business evidence is protected: storage admission refuses new temporary work before canonical storage is endangered (B36). Host and database administration headroom ≥ 1.5 GB RAM and `max_connections` (40) − pool (12) − CLI reserve (4) are kept (contract §10.9).

#### 3.6.2 Measured capacity record (`tm capacity record`)

Runs a synthetic load profile against a closed-to-real-data local installation (synthetic seed only): command throughput and p95 latency at pool saturation, one fetch + one parse worker job durations and peak RSS, clamd scan time per 5 MB file, streaming throughput with `maxConcurrentStreams`, projector lag under load, backup duration and size. Appends `sys.capacity_recorded` (after: limits in force, observations, host CPU/RAM, release id). Raising worker concurrency requires a newer record showing safety and responsiveness (B38). Country count is never a capacity target.

#### 3.6.3 Separated health (`GET /healthz`, loopback only)

| Category | Probe | `degraded` / `down` reasons |
|---|---|---|
| `entry` | admission state, server accepting, concurrent-request headroom | `maintenance`, `capacity_connections` |
| `command` | rolling share of `conflict_retry_exhausted`/`internal` in last 5 min; pool wait | `retry_exhaustion`, `pool_saturated` |
| `database` | `SELECT 1` latency over the Unix socket; replication none | `db_unreachable`, `db_slow` |
| `byte` | blob filesystem free space, recent `blob_integrity_failed`, stream slots | `capacity_storage`, `integrity_failures`, `capacity_streams` |
| `worker` | last fetch/parse job outcome, bwrap/prlimit resolvable, clamd ping | `worker_failed`, `scanner_unavailable` |
| `cleanup` | age of last successful `blob.cleanup_staging` / work-dir sweep | `cleanup_stale` |
| `backup` | age and status of `LAST_GOOD` | `no_good_set`, `backup_stale` |
| `projection` | each projector `healthy`, `lag_ms` | `projection_lag`, `projection_rebuilding` |
| `clock` | contract §4.9 skew | `clock_skew` |

Each category reports independently; one failing category never marks another down. Output uses only allowlisted codes and counts (B33).

### 3.7 Local test installation (B37)

| Item | Rule |
|---|---|
| Layout | `<installRoot>/data/{pg,blobs,work,mail,diag,checkpoints,run}`, `<installRoot>/releases/<releaseId>/`, `<installRoot>/backups/`; secrets in `<secretsDir>` outside the repository and outside `data/` (mode 0700, files 0600, owner = process uid; else refuse to start, contract §10.10). |
| Separation | Dedicated PostgreSQL cluster (socket only, own roles), dedicated clamd socket, own ports (default `127.0.0.1:4610`, assigned after the listener inventory), own directories and secrets. OS user is the current user (no sudo): OS-level separation from other applications of this uid is not achieved (X-4, OD-15-03). |
| Secrets hygiene | Secrets never in source, build output, release manifest, diagnostics or `SET.json`; release registration scans config and manifest for secret values (T-15-57). |
| Access path | Default loopback. Remote testers only through the product owner's authorized private path by explicit `http.bind` to that address with HTTPS (`tm tls init` generates a local CA and server certificate with the configured host names into the secrets directory). Configuration refuses a non-loopback bind without TLS. No public tunnel, no DNS. Sessions are `__Host-` cookies, `Secure`, revocable (Identity). |
| Synthetic seed | `tm seed synthetic` (CCR-15-14) only in `test`/`local_test`: synthetic accounts (`@synthetic.test`, names prefixed `SYN`), country Synthetica, synthetic offerings. Refused in `production` and refused when any non-synthetic account exists. It grants no first-admin or all-admin-loss path (B11, B44) and its facts carry actor kind `harness` and `command_name` `harness.iam.seed_synthetic` (rev 2). |
| Synthetic outcomes | Synthetic mail results, ALTCHA in local test and harness commands are labelled synthetic; they prove no real delivery, CAPTCHA adequacy, payment or government action (B37). |
| Not selected | Production deployment, DNS, provider, topology, paid resources, numeric availability/RPO/RTO (B37, B47). |

## 4. Queries, pages and routes

All pages are server-rendered, `Cache-Control: no-store`, `noindex` (contract §12.4). Every page calls `policy.authorize` for its resource; every list applies `policy.scope` over authoritative tables (contract §5.4). Money renders from `bigint` paise as `₹ 1,234.50` with no floating point. Each page that reads a projection shows "as of" (fact sequence and time) and the projector's health banner when unhealthy.

### 4.1 Payment Records

| Method, path | Role / action | Shows | Visible unavailable states |
|---|---|---|---|
| `GET /admin/applications/:applicationId/payments` | SuperAdmin; `payment.read_application` | Current service status, full entry chain (entry no, kind, status, amount stated, evidence refs, reason, recorded by/at, event time, `corrects` link); Gate 1 state (`passed` / `blocked` / exception `granted`/`consumed`, read from Core); Gate 2 state per government attempt (`not_applicable` for other modes); open and closed financial exceptions; government fee records (expected fee, TM paid, TA liability, received/allocated, outstanding recovery, state, `paid_exceeds_reservation`) shown separately from the quoted price and service status; entry form with `_rev = status_revision`; link to Core's gate-exception form. | Refund (`unselected_refund`); fee exclusion (`parked_fee_exclusion_record`); recovery/allocation (`parked_accounts_actions`). Each as a disabled control with its message. |
| `GET /admin/tas/:taAccountId/exposure` | SuperAdmin; `exposure.read` (CCR-15-17; interim `ceiling.lower`) on `ta_finance` | Ceiling, source (`default` ₹0 / set), counted exposure = reserved remainder + TM-paid-unrecovered, headroom (may be negative), reservations (key, application, amount, converted, unused remainder, state), fee records across all groups, ceiling-change history (requester, approver, old/new, reasons, effective time), open increase request with approve/decline forms (approve disabled for the requester with `self_approval_forbidden`) | Reservation release (`parked_reservation_release`); Accounts-verified receipt as the only decrease path (`parked_accounts_actions`); "paid case at default ₹0" banner when `ceiling_source = default` (`exposure_parked_paid_case_default_ceiling`) |
| `GET /admin/financial-follow-up` | SuperAdmin; `financial_exception.read` | `Payment_Missing_Override` list across all TAs and applications from the authoritative table (not the projection): kind, application, TA, accountable SuperAdmin and whether active, opened at, age, cause link, application lifecycle (completion does not remove an item), state filter (default `open`) | Write-off (`unselected_write_off`), Accounts actions (`parked_accounts_actions`); `follow_up_owner_inactive` flag |
| `GET /admin/financial-follow-up/:exceptionId` | same | Detail with cause chain (gate exception or entry), closure entry, nudge notice | same |
| SuperAdmin home panel | SuperAdmin | "Financial follow-up you are accountable for": count and list of open exceptions where `accountable_superadmin_id = me` (authoritative query). This panel and the nudge notice are the B29 nudge (contract I-13); no email, no cadence. | — |
| `GET /accounts` | operator with active accounting grant, or SuperAdmin; `accounts.surface_read` | Boundary page only: Accounts owns receipt verification/allocation, recovery and manual adjustments; dashboard data and actions are PARKED; no financial data, no application data, no TA data | All Accounts actions (`parked_accounts_actions`), write-off (`unselected_write_off`) |
| `GET /ta/payments` | TA; `payment.read_application` (list, own) | Per application: service payment status and status date; government-fee liabilities (TM paid on the TA's behalf, liability, allocated receipts, outstanding recovery) as a receivable separate from the quoted price | Online payment (`excluded_payment_gateway`); refund (`unselected_refund`) |
| `GET /ta/applications/:applicationId/payments` | TA owner | Same for one application; entry history shows status and date only (no SuperAdmin identity, evidence notes or reasons) | same |
| Operator application page (Core) | assigned operator | Gate 1 basis (`passed` / `exception`) and Gate 2 state only; no amounts, no entries (contract §5.3) | — |

The TA does not see its ceiling or counted exposure (I-15-03).

### 4.2 TA Delivery

| Method, path | Role / action | Shows | Visible unavailable states |
|---|---|---|---|
| `GET /ta/applications/:applicationId/delivery` | TA owner; `application.read` | Documents and official results with availability per version (retrieval form or deny reason computed by a read-only dry run of checks 2–9 without recording), packet state and retrieval form, document emails (state, versions, recipient = "your account email", times; `uncertain` shown as "delivery result uncertain"), notices, handover records (kind, `system_verified` label: "attributed record, not system-verified"), the TA's own retrieval records (version, time, result; `unrecorded` shown as "result not recorded") | Pending delivery send: `delivery_send_trigger_unselected`; pending completion: `completion_check_trigger_unselected` (B46) |
| `GET /ops/applications/:applicationId/delivery` | assigned operator | As above plus all retrieval records of the application (staff identities), forms: build packet, release packet (with Core control blockers), record handover, record manual email, record direct external delivery, resend per `failed` send | Resend on `uncertain` (`uncertain_email_handling_unselected`); "Send document email" and "Run completion check" disabled (`delivery_send_trigger_unselected`, `completion_check_trigger_unselected`) |
| `GET /admin/applications/:applicationId/delivery` | SuperAdmin | Full delivery evidence, read-only (SuperAdmin does not resend or hand over) | same B46 states |
| `GET /{ta,ops,admin}/notices`, `GET /…/notices/:noticeId` | recipient; `notice.read` | Own notices, kind message, ack state, ack form when `ack_required`; reading writes nothing | — |
| `GET /{ta,ops,admin}/selections/:selectionId` | requester; `selection.retrieve` | Per-item results (`included`/`unavailable`/`failed`/`unrecorded`) with closed-code messages, archive outcome | — |
| `POST` routes | Section 3.2 | — | — |

Wrong-recipient protection: every delivery route resolves the application through `policy.authorize`; TA routes require `owner_ta`; email recipient is never an input (always the owning TA's current account email); notices are readable only by their recipient. Group contact, applicant and arbitrary addresses never appear as recipient options (B31).

### 4.3 Derived Views

| Method, path | Role / action | Source | Shows |
|---|---|---|---|
| `GET /ta/applications` | TA; `application.read` list | `view_applications` ⋈ `core_applications` with the TA predicate | Applicant display name, group, offering, progress meaning (B21 six meanings), pending owner/next action (TA-relevant), outcome and completion kind beside `completed`, payment status; filters by group/progress; keyset pagination on `updated_seq` |
| `GET /ta/search?q=` | TA; `search.private` | `view_applications.search` ⋈ predicate | Same columns; query string never logged (contract §4.10) |
| `GET /ta/applications/:applicationId/history` | TA owner; `history.read_ta` | `view_ta_history` | TA-facing lines (Section 4.3.1); no staff identities, internal notes, gate or financial exception details |
| `GET /ops/work` | operator; `application.read` list | projection ⋈ operator predicate (assigned or active grant) | Assigned applications with pending next action; grant-scoped rows labelled read-only |
| `GET /admin/applications`, `GET /admin/search` | SuperAdmin | projection | All applications; filters (TA, offering, mode, progress, pending owner, open financial exception) |
| `GET /admin/queues/assignment` | SuperAdmin; `queue.read` | `view_assignment_queue` ⋈ `core_applications` (`lifecycle = submitted ∧ assigned_operator_id IS NULL`, or approved assistance) | Queue reason, since, Gate 1 state; the assign action is Core's form and re-evaluates controls (the queue grants nothing) |
| `GET /admin/audit` | SuperAdmin; `audit.read_full` | `view_audit_index` | Search by fact type, subject, actor, application, TA, time range; results link to fact detail |
| `GET /admin/audit/facts/:seq` | SuperAdmin; `audit.read_full` | `sys_facts` (authoritative) | Full fact incl. before/after, reason, evidence, release, retrospective note |
| `GET /admin/measures` | SuperAdmin; `measures.read` | `view_measures_results` + Operations launch readiness evidence | Section 4.3.2 measures per offering × service-mode cohort with n, missing share, status, targets from launch evidence or "target not set", first-live-baseline review date (first live case + 30 days) |
| `GET /admin/monitors` | SuperAdmin; `measures.read` | authoritative queries (counts only) + projector health | Unpaid overrides (open financial exceptions by age), unowned waits (pending owner inactive or queue-owned beyond threshold, `follow_up_owner_inactive`), travel-date risk, external uncertainty (`filing_unknown` acts, `payment_unknown` fees, `uncertain` emails), custody/artifact incidents open, reporting gaps (unhealthy projectors, measures with missing share > 0, `not_captured` measures), `paid_exceeds_reservation` fees |
| `GET /admin/system/projections` | SuperAdmin; `tasks.read_failures` | `view_projector_state` | Per projector state, lag, last error code, cursor |

Degradation (B33): when a projector is unhealthy, its list pages render from the last projected rows with a banner "list may be out of date (as of seq N)". Commands and controls never read views, so case processing continues while all owner evidence and controls work. While the `audit_index` projector is unhealthy, `privilegedElevation` commands are refused (`audit_degraded`); emergency containment (suspension, emergency close, ceiling lowering) stays available.

A projection never widens access: rows are joined to the authoritative predicate, and detail links re-authorize (T-15-49).

#### 4.3.1 TA history line allowlist (`view_ta_history.line_code`)

| Fact type | Line code | Params (no personal data beyond the TA's own application identifiers) |
|---|---|---|
| `core.draft_created`, `core.submitted`, `core.price_quoted`, `core.price_reduced`, `core.price_increase_*` | `draft_created`, `submitted`, `price_quoted`, `price_reduced`, `price_increase_*` | amounts, dates |
| `core.assistance_requested/approved/declined`, `core.operator_assigned`, `core.operator_reassigned` | `assistance_*`, `travelmudra_assigned` | no operator identity |
| `core.formal_return`, `core.handed_back`, `core.problem_reported`, `core.problem_resolved` | same names | — |
| `core.withdrawal_*`, `core.outcome_recorded`, `core.completed`, `core.ended_with_group`, `core.unresolved_completion_authorized` | same names | outcome code |
| `pay.service_payment_recorded`, `pay.service_payment_corrected` | `payment_status_changed` | new status only |
| `pay.exposure_converted_paid` | `government_fee_paid_on_your_behalf` | amount, liability |
| `dlv.notice_posted` (TA recipient), `dlv.email_result_recorded`, `dlv.release_result_recorded` (TA's own), `dlv.handover_recorded`, `dlv.direct_external_recorded` | same names | result codes |

Every other fact type is excluded (gate exceptions, financial exceptions, readiness, flags to SuperAdmin, incidents, ceilings, staff retrievals, audit).

#### 4.3.2 Measures (B32)

Common rules: cohort key = `offering_id × service_mode × local month of submission (Asia/Kolkata)`; first-live-case facts only (no imports exist, B02); every result row carries `n`, `n_with_value`, `n_missing`, `missing_share_bp`, `status`; `value_json` is NULL when `n_with_value = 0` (never 0 for unknown); `insufficient_sample` when `n < views.minSample` (default 5) and values are still shown with the label; sources are de-duplicated by subject identity (an application, an intake row effect `(root_attempt, locator, offering)`, an authorization) so Nth retries and replayed facts never count twice.

| Code | Measure | Numerator / value | Denominator / n | Event boundaries | Missing / unknown treatment |
|---|---|---|---|---|---|
| M-01 | Stage durations | duration per progress meaning and per declared local step | applications that entered the stage | entry/exit = fact that changed the projected value (`view_measures_wait_intervals`) | open intervals are censored and counted in `n_missing`, not given a duration |
| M-02 | Waits by reason and owner | total and median wait per `(owner_kind, reason_code)`, split TM-controlled (`assigned_operator`, `superadmin`, `system`, `accounts`) vs calendar/other (`ta`, `external_party`) | applications with ≥ 1 interval | as M-01 | `unresolved_known_limitation` waits reported as their own row, never merged |
| M-03 | Post-submission corrections | corrections of kinds `submitted_unassigned`, `after_return`, `superadmin_evidence` | submitted applications | `core.correction_accepted`, `core.superadmin_evidence_correction` | — |
| M-04 | Repeat external acts | applications with > 1 authorization of one act kind, or any act after `not_filed_evidenced` | applications with ≥ 1 authorization | `core.external_act_authorized` | acts in `filing_unknown` shown as a separate count |
| M-05 | Wrong-association quality | `artifact_association`, `artifact_missing_or_wrong`, `wrong_recipient_disclosure` incidents | official artifacts recorded | `ops.incident_opened` | — |
| M-06 | Operator/TA/partner effort | — | — | — | No capture source exists in the foundation: `status = not_captured`, `missing_share_bp = 10000`, value NULL (CCR-15-15) |
| M-07 | Row-level intake yield | row effects by result (`accepted`, `matched_existing`, `incident_open`, `failed`, `excluded`) | rows in root attempts | `intake.row_result_recorded`, de-duplicated by row effect key | rows still `pending`/`processing` counted as missing |
| M-08 | Per-TA fee exposure | count, value and oldest age of reserved remainders and of TM-paid-unrecovered amounts | TAs with any fee record | `pay.exposure_reserved`, `pay.exposure_converted_paid` | `payment_unknown` fees shown separately |
| M-09 | Outcome distribution | outcomes per cohort | applications with an outcome or closed | `core.outcome_recorded`, completion facts | `external_outcome_unresolved` and open applications are their own categories, never refusal; preparation-only reports only `prepared_and_handed_over`, `withdrawn`, `cancelled`, `dependency_failed` |

Per-launch business definitions (applicability, owner, numerator/denominator choice, event boundaries, timezone, waits/pauses, dimensions/exclusions/missing treatment, provisional numeric target, support hours, escalation, staffing, peak capacity, availability/response/recovery targets, fallback) are launch readiness evidence owned by Operations (`ops.approve_launch`, B07, B32). The measures page displays them next to the computed values and shows "not set" where absent. The former 5× ambition is not displayed as a target.

## 5. Internal tasks and timers

| Task / job | Owner | Effect class | On behalf of | Attempts | Prepare re-check | Effect | Record | Failure / revoked |
|---|---|---|---|---|---|---|---|---|
| `mail.deliver` (purpose `document_email`) | delivery | `non_repeatable` | none (recipient check inside) | 1 effect; record retries 5 | lock email send; state `queued` else skip `already_done`; if `effect_started_at` set ⇒ `recordUncertain`: state `uncertain`, release rows stay `unrecorded`, fact `dlv.email_result_recorded`; run `checkRelease(channel document_email)` per version with recipient = owning TA's **current** email (snapshot refreshed; before/after in the fact); any denial ⇒ state `denied_at_check` (`result_code` = first deny code), task `succeeded`, no effect; else state `sending`, `sending_at`; kernel sets `effect_started_at` | `readVerified` each version (failure ⇒ no transport call, result `failed`/`bytes_unavailable`); build MIME (nodemailer) with exactly those bytes; `transport.send` | state ← `synthetic_accepted`/`accepted`/`failed`/`uncertain`; release rows `streamed` for accepted results, `stream_failed` for `failed`, NULL for `uncertain`; on `bytes_unavailable` also `markBytesUnavailable` + incident; fact `dlv.email_result_recorded` | terminal failure before effect ⇒ state `failed` (visible, resend possible); crash after `sending` ⇒ `uncertain` on next lease; never resent automatically (B31, T-F23) |
| `delivery.build_packet` | delivery | `idempotent` (writes a new staging blob) | assigned operator | 3 | packet `building` else skip; operator still assigned (`operator.build_packet`) else `cancelled_revoked` ⇒ `onRevoked`: packet `build_failed`/`assignment_changed`; live evidence fingerprint = stored else packet `build_failed`/`evidence_changed` | `createIntent` (TA scope), `readVerified` each constituent, `yazl` ZIP with `manifest.json` (requirement types, version ids, SHA-256), `writeStaged` | `reference(blob → packet)`, `requestMove(canonical)`, packet `built`, fact `dlv.packet_state_changed` | terminal ⇒ `build_failed` with code; the unreferenced staging blob is cleaned by `blob.cleanup_staging` |
| Projector job (one per projector: `applications`, `assignment_queue`, `audit_index`, `ta_history`, `financial_follow_up`, `wait_intervals`) | views | n/a (periodic job `projector`, 1 s) | — | — | `pg_try_advisory_xact_lock(projector)`; skip when held (rebuild) | `tailFacts(cursor, batch)` (watermark `tx_id < snapshot xmin`, contract C-04) | upsert affected rows in one REPEATABLE READ transaction with the cursor update; per-application projectors recompute from authoritative queries (`core.pendingOnAction`, `core.deriveProgress`, `payments.servicePayment`) | error ⇒ `state = failed`, `last_error_code`, cursor unchanged (the batch is retried next run; upserts are idempotent); lag recomputed each run |
| Measures recompute | views | periodic (`views.measuresIntervalMs` 300 000) | — | — | — | recompute every cohort from authoritative tables and wait intervals | replace `view_measures_results` rows in one transaction with `as_of_seq` | failure leaves previous rows with `status = stale` |

Timers not created (deliberate): no timer sends a document email, posts a `result_available` notice or runs a completion check (B46); no timer resends an uncertain or failed email (B31); no timer re-sends nudges (contract I-13); no timer releases reservations (B28); no product timer runs backups (manual CLI; backup health shows age).

Permission re-check: every task prepare re-checks `onBehalfOf` through policy (contract §4.6); `mail.deliver` re-checks recipient eligibility through `checkRelease`. Revocation, reassignment or suspension committed before prepare stops the effect.

## 6. Deliberate boundaries in scope

| Boundary | Spec | Kind | Where visible | Category / code | What the system does NOT do |
|---|---|---|---|---|---|
| Fee-exclusion record from counted exposure | B28, B43 | PARKED | exposure and payments pages (disabled control); POST route | `unavailable_parked` / `parked_fee_exclusion_record` | infer exclusion from payment status, completion or write-off |
| Ordinary paid case at default ₹0 ceiling | B28, B43 | PARKED | authorization blocker on Core's form; exposure page banner | `control_blocked` with boundary `parked` / `exposure_parked_paid_case_default_ceiling` | treat it as a breach or allow it; block Gate 1 preparation |
| Unused-reservation release and its authority | B28, B43 | PARKED | reservation rows (unused remainder), disabled release control | `unavailable_parked` / `parked_reservation_release` | release on timeout, outcome, completion, not-paid evidence or conversion below the reserved amount |
| Exposure decrease (Accounts-verified allocated bank receipt) | B28, B29 | PARKED (Accounts mutation path) | exposure page; Accounts page | `unavailable_parked` / `parked_accounts_actions` | decrease exposure by any other event |
| Accounts dashboard data/actions and Payment Records mutation path | B29, B43 | PARKED | `/accounts` boundary page | `unavailable_parked` / `parked_accounts_actions` | grant case access or payment mutation through the accounting grant |
| Write-off authority/evidence | B29, B43 | unselected | follow-up list and detail | `unavailable_owner_decision` / `unselected_write_off` | close a financial exception except by a later `payment_received` entry |
| Refunds, assistance charging, price-versus-fee formula, other-mode fee policies | B29, B43 | unselected | payments pages | `unavailable_owner_decision` / `unselected_refund`; formula: no control exists, entry `amount_paise` is informational | compare paid amounts with price; compute assistance charges; fund other-mode fees |
| Payment gateway, refund portal, TA-wide credit | B26, B42 | EXCLUDED | TA payments page | `unavailable_excluded` / `excluded_payment_gateway` | — |
| Delivery send trigger (document email, `result_available` notice) | B46 | KNOWN_LIMITATION | delivery pages; pending owner `unresolved_known_limitation` | `unavailable_known_limitation` / `delivery_send_trigger_unselected` | start a send from outcome, artifact, packet or completion events |
| Completion-check trigger and owner (incl. unassigned) | B46 | KNOWN_LIMITATION | delivery and application pages | `unavailable_known_limitation` / `completion_check_trigger_unselected` | run `core.check_completion` outside the harness |
| Uncertain-email handling and ownership | B46 | KNOWN_LIMITATION | email row; resend control disabled | `unavailable_known_limitation` / `uncertain_email_handling_unselected` | resend automatically or manually from `uncertain`; assign a hidden owner |
| Per-file send interval | B12, B45 | OWNER_DECISION (accepted) | delivery help text | — | send lock, streaming recheck, recall promise |
| Retrieval-record ordering refinements | B45 | PARKED refinement | — | — | guarantee result ordering beyond set-once rows |
| Real mail transport | B31, B37 | not selected | resend/harness refusals in production config | `unavailable_owner_decision` / `real_mail_transport_unselected` | select a provider |
| Production deployment, topology, RPO/RTO, off-host custody | B37 | not selected | install docs, restore output | — | claim production readiness from local tests (B41) |
| Reopening after interval-loss restore | B40 | product-owner decision | `tm admission open` refusal; procedure presentation | CLI code `reopen_approval_missing` | reconciliation-only state, staged reopening, scoped hold |

## 7. Test plan

Levels: **U** unit (pure functions, no database); **I** integration over a real persisted PostgreSQL 16 database (per-test-file clone of the migrated template, contract §10.1), real blob store, real `bwrap` workers and real `clamd` where named; **MP** multi-process (separate OS processes: `tm-server`, `tm` CLI, test driver; real crashes via fault `crash` or `SIGKILL`). Concurrency tests use several `tm_app` clients with real concurrent SERIALIZABLE transactions and repeat each race ≥ 50 times with randomized start delays. Every test asserts persisted rows, facts, tasks, files and the absence of forbidden effects, not only responses (B41). Synthetic data only.

### 7.1 Payment Records

| # | Test | Rules | Level | Persisted effects asserted | Forbidden effects asserted |
|---|---|---|---|---|---|
| T-15-01 | First `record` entry `payment_received` with evidence | B26, B33 | I | entry 1, state `payment_received`, `status_revision = 1`, fact `pay.service_payment_recorded` with actor, evidence, before/after | `tm_app` UPDATE/DELETE on `pay_service_entries` raises `TM001`; no financial exception |
| T-15-02 | Additive correction to `not_received`; second correction of entry 1 | B26, B35 | I | entry 1 unchanged byte-for-byte; entry 2 `corrects_entry_id = entry 1`; current = entry 2 | fork attempt ⇒ `conflict_duplicate`, no entry 3, no fact |
| T-15-03 | Entry-kind rules (`record` for received→not received; correction of a non-current entry; no-change correction) | B26 | U + I | — | each refused with its code; no row, no fact, no operation row |
| T-15-04 | Nth retry same key; same key different content | B35 | I | one entry, one fact after 5 retries; replay summary equal | `conflict_operation_key` writes nothing |
| T-15-05 | Lost acknowledgement (`command.lose_ack`) then resubmit | B35 | I | `outcome_unknown` first; resubmit replays; exactly one entry | no duplicate fact |
| T-15-06 | Two SuperAdmins record concurrently with the same expected revision | B35, B19 | I (concurrent) | exactly one entry per race | loser `stale_revision`; never two entries with the same `entry_no` |
| T-15-07 | Correction `payment_received → not_received` racing `core.assign` on the same application | B26, B35, B41 | I (concurrent) | per race exactly one order: either the correction commits first and the assignment is refused `gate1_payment_not_received`, or the assignment commits first (basis = the then-current entry) and the correction opens `worked_then_corrected_to_unpaid` with cause = the new entry | never an assignment whose basis entry was already superseded at its commit; never a committed post-work correction without its financial exception |
| T-15-08 | Corrections after work open the right kind; before work open none; nudge notice posted once | B26, B29 | I | kind per Section 3.1 C-P1 rule; accountable = recorder; one `dlv_notices` row (dedupe) to that SuperAdmin | no exception for pre-work corrections; replay posts no second notice |
| T-15-09 | Gate 1 exception assignment ⇒ `work_under_gate1_exception`; later `payment_received` closes it; application then completes | B26, B29 | I | `closed_collected`, `closed_by_entry_id`; completion row unchanged by closure; open exception survives completion when no payment arrives | closure does not alter `core_completions`, gate history or assignment rows |
| T-15-10 | Gate 1 versus Gate 2 | B27, B20, B41 | I | Gate 1 passed at assignment, later correction to `not_received`; `authorize_government_submission` blocked `gate2_payment_not_received`; Gate 2 exception for the attempt allows it and opens `commitment_under_gate2_exception`; an entry after the grant makes it `gate_exception_stale` | Gate 1 exception or Gate 1 pass never satisfies Gate 2; stale exception stays `granted` (not consumed) |
| T-15-11 | Other modes: preparation-only and third-party | B27 | I | Gate 2 shown `not_applicable` | no `pay_government_fees`, no reservation, no Gate 2 blocker |
| T-15-12 | Default ₹0 ceiling: unpaid fee authorization; paid fee authorization; Gate 1 assignment | B28, B43 | I | breach blocker for unpaid; parked blocker for paid (boundary `parked`); assignment at ₹0 succeeds | no reservation, fee record or authorization row on either refusal |
| T-15-13 | Concurrent fee authorizations of one TA across two groups (ceiling 10 000, fees 6 000 each) | B28, B35, B41 | I (concurrent) | exactly one reservation and one authorization per race; aggregate = Σ rows | never counted exposure > ceiling at any commit |
| T-15-14 | Fault `command.before_commit` after reservation write | B28, B35 | I | — | no reservation, fee record, authorization or fact persists |
| T-15-15 | Fee act `not_filed_evidenced`, fresh authorization of the same effect (same, smaller, larger amount) | B28, B23 | I | same `reservation_id` reused; larger amount raises after a fresh ceiling comparison; smaller keeps the larger amount | no second reservation for the key; no decrease of `reserved_paise` |
| T-15-16 | Breach after a granted Gate 2 exception | B28, B20 | I | blocker `exposure_ceiling_breach` | gate exception stays `granted` (rolled back consumption); no financial exception opened |
| T-15-17 | Lower ceiling below incurred exposure | B28 | I | change `effective`; existing reservations and paid amounts unchanged | next reservation refused; no reservation or fee row modified |
| T-15-18 | Ceiling increase: self-approval, distinct approval, two concurrent approvers, requester suspended, ceiling changed since request, audit projector unhealthy | B28, B11, B33 | I (concurrent for approvers) | one effective change with both identities, old/new, reasons, effective time | self-approval refused by command and by database CHECK (direct SQL insert test); no second effective change; refusals write nothing |
| T-15-19 | Fee paid equal, lower and higher than reserved | B27, B28 | I | `tm_paid`, `ta_liability = tm_paid`, outstanding recovery; counted exposure unchanged (lower/equal) or increased (higher); `paid_exceeds_reservation` flag and monitor entry | counted exposure never decreases; liability unaffected by later outcome `refused` |
| T-15-20 | Fee payment unknown, then not-paid evidence, then fresh authorization | B23, B27 | I | `payment_unknown` blocks re-authorization (`fee_payment_unknown`); not-paid returns fee to `reserved`; reservation reused | no repeat authorization while unknown; no reservation release |
| T-15-21 | No exposure decrease path: completion, group end, payment status change, timeout (clock advance), write-off route, release route | B28 | I + static | exposure aggregate identical before/after each event | static scan: no SQL in `src/modules/payments` decrements `reserved_paise`, `tm_paid_unrecovered_paise`, `amount_paise` or writes `ta_received_allocated_paise` |
| T-15-22 | Parked and unselected routes (release, fee exclusion, Accounts actions, write-off, refund) | B28, B29, B43 | I | boundary page with code for SuperAdmin and accounting grantee | no operation row, no fact, no task; TA and plain operator get `not_found_or_forbidden` |
| T-15-23 | Accounting grant boundary | B29, B10 | I | `/accounts` renders boundary only | grantee denied on `/admin/applications/:id/payments`, `/admin/financial-follow-up`, `/ta/*`, application reads, document retrieval and every payment POST; page contains no amounts or ids (HTML assertion with cheerio) |
| T-15-24 | `Payment_Missing_Override` list across kinds, TAs and completed applications | B29 | I | four kinds listed with ages and accountable owner; completed application still listed | list does not depend on projection health (stall projector: list unchanged) |
| T-15-25 | Accountable SuperAdmin suspended; reassignment of follow-up owner | B29, B32 | I | flag `follow_up_owner_inactive`; after reassignment new owner, new nudge, fact | no exception state change on reassignment |
| T-15-26 | Randomized concurrent reservations, conversions, unknown/not-paid transitions and ceiling changes | B28, T-F22 | I (concurrent) | invariant (CCR-15-01 form) holds after every run | no negative aggregates; no counted decrease |
| T-15-27 | TA payments pages | B01, B10 | I | TA sees own status and fee liabilities | another TA's application ⇒ 404; no SuperAdmin identity, evidence notes, ceiling or reasons in HTML |
| T-15-28 | Group end with open financial exception, reserved fee, TM-paid-unrecovered fee | B25, B28 | I | `payments.outstandingMoney` codes; application stays open | no `ended_with_group` completion for those applications |

### 7.2 TA Delivery

| # | Test | Rules | Level | Persisted effects asserted | Forbidden effects asserted |
|---|---|---|---|---|---|
| T-15-29 | Allowed single retrieval | B12, B31 | I | release row `allowed`, `streamed`, `bytes_sent = size`; response bytes SHA-256 = version SHA-256; facts checked + result | no other release rows |
| T-15-30 | Denial matrix: replaced, blocked, non-positive association, other application's version, artifact withheld/noncurrent, bytes missing, corrupted bytes, blocking incident, protection mark, recipient suspended, admission closed | B12, B13, B10, B40 | I | denied row with the exact code for authorized requesters; corrupted ⇒ `unavailable` + `bytes_integrity` incident + version bytes `unavailable` | zero response bytes; no substitute version; outcome unchanged; unauthorized requester leaves no row |
| T-15-31 | Wrong-recipient sweep: TA B against TA A's application on every route (single, packet, selection, notice read/ack, delivery page, payments page, history, list, search, operation lookup by B's key, measures) | B31, B10, B41 | I | — | every route `not_found_or_forbidden` (same status and page); no `dlv_releases` row with B as recipient and `allowed`; no bytes; email recipient for A's application is always A's current account email even when the group contact differs |
| T-15-32 | Accepted send interval: block the version at `release.after_check_before_stream`, and mid-stream | B12, B45, B41 | I | first retrieval `allowed` + `streamed`; next retrieval denied `version_blocked` | no send lock taken (blocker commits without waiting); no streaming recheck aborts the first send |
| T-15-33 | Mid-stream failure (`release.mid_stream`, client abort) | B12, B31 | I | result `stream_failed` | never `streamed` |
| T-15-34 | Server crash during a stream | B31, B33 | MP | result NULL; page shows "result not recorded" | never `streamed`; no automatic retry |
| T-15-35 | Retrieval replay with the same key | B35, B12 | I | replay summary | zero bytes streamed on replay; no new release row |
| T-15-36 | Selection with eligible, replaced and corrupted items; TA suspended between items (`selection.between_items`) | B12, B10 | I | per-item `included`/`unavailable`/`failed` rows; `results.txt` codes; later items `recipient_access_revoked` | ZIP contains only included entries; no substituted artifact; no bytes after the revocation check |
| T-15-37 | Harness document email to owning TA; email changed (B09) between queue and prepare | B31, B09 | I | `synthetic_accepted`; synthetic `.eml` attachments equal exact version bytes; recipient = new current email; fact before/after of the snapshot | no send to the old address after the switch; no send to group contact |
| T-15-38 | Transport `failed` then manual resend; block a version before the resend's prepare; second resend of the same failed send | B31 | I | resend newly attributed (`attributed_by`, reason); resend `denied_at_check` | no attachment of the blocked version; second resend `conflict_duplicate` |
| T-15-39 | Crash after `sending` marker (`mail.after_sending_marker`) | B31, B46, B35 | MP | state `uncertain`, task `effect_uncertain` | synthetic mailbox has ≤ 1 message; no second transport call; resend from `uncertain` refused (`uncertain_email_handling_unselected`) |
| T-15-40 | B46 boundary | B46 | I | pending owner `unresolved_known_limitation` with both codes | no product route, task or fact triggers email, `result_available` notice or completion; harness commands refused with `env = production` config |
| T-15-41 | Notices: dedupe, recipient-only ack, double ack, ack on non-ack notice, GET read | B31 | I | one notice per dedupe key; one ack fact | GET writes nothing (row revision unchanged); second ack `already_acknowledged` |
| T-15-42 | Preparation-only packet: build, stale (evidence change), release with readiness gate, TA retrieval, handover → outcome, duplicate handover, constituent blocked after release | B04, B12, B18, B21 | I | packet states; `prepared_and_handed_over` via Core once; handover `system_verified` per evidence | stale release refused; duplicate handover refused; packet retrieval denied after constituent block; no government outcome claimed |
| T-15-43 | Manual operator email record | B24, B31 | I | handover `manual_operator_email`, `system_verified = false`, release-check snapshot | recipient ≠ owning TA current email refused; harness completion check does not count it |
| T-15-44 | Direct external delivery record | B24, B31 | I | `tm_held_result = false` | no release row, no bytes |
| T-15-45 | Physical handover record | B31 | I | `physical`, `system_verified = false` | no original custody change |
| T-15-46 | Delivery evidence per shape (electronic TravelMudra-filed, physical route, preparation-only) | B41, B24 | I | `deliveryEvidence` returns the expected evidence set per shape | download alone never appears as completion evidence |
| T-15-47 | Packet build task after reassignment of the operator | B10, B35 | I | task `cancelled_revoked`; packet `build_failed`/`assignment_changed` | no blob referenced to the packet |

### 7.3 Derived Views and measures

| # | Test | Rules | Level | Persisted effects asserted | Forbidden effects asserted |
|---|---|---|---|---|---|
| T-15-48 | Interleaved commits (lower seq commits later) | B33, C-04 | I (concurrent) | every fact projected exactly once; final rows equal a rebuild | no skipped fact |
| T-15-49 | Tampered projection (operator id set to an attacker, TA id swapped) | B33, B10, B35 | I | — | attacker list and search exclude the row; detail 404; controls unaffected (instrumented: no `view_` read during `evaluateControls`) |
| T-15-50 | Projector stall (`projector.stall`) | B33 | I | banner with as-of seq; assignment, payment entry and fee authorization still accepted | `pay.approve_ceiling_increase` and SuperAdmin elevation refused `audit_degraded`; suspension and ceiling lowering allowed |
| T-15-51 | Rebuild equals incremental; rebuild during concurrent commands | B33 | MP | row-set hash equal after convergence; fact `sys.projection_rebuilt` | no business table changed (row hashes) |
| T-15-52 | Progress derivation matrix | B21 | U | each lifecycle/outcome/pending combination maps to the contract meaning | progress never read by Core (instrumented) |
| T-15-53 | Measures: unresolved outcome, open intervals, missing effort, Nth intake retry, small sample | B32 | I | unresolved separate category; censored counted missing; M-06 computed from `ops_effort_samples` with sample size and missing share (rev 2, CCR-15-15 accepted; `not_captured` only when no sample exists); row effects counted once; `insufficient_sample` label | no zero substituted for unknown; no refusal count from `external_outcome_unresolved` |
| T-15-54 | TA history redaction | B10, B33 | I | allowlisted lines only | no staff ids, gate/financial exception, readiness, flag or incident lines; another TA ⇒ 404 |
| T-15-55 | Audit search scope and content | B10, B33 | I | SuperAdmin search returns index rows; detail shows before/after | TA/operator 404; `view_audit_index` has no before/after/reason columns |
| T-15-56 | Monitors | B32 | I | counts for unpaid overrides, unowned waits, external uncertainty, reporting gaps match seeded state | — |

### 7.4 Release, cutover and rollback

| # | Test | Rules | Level | Persisted effects asserted | Forbidden effects asserted |
|---|---|---|---|---|---|
| T-15-57 | Manifest content and hygiene | B39, B37 | I | every field present; digests recompute | dirty tree refused; manifest, config digest input and `SET.json` contain no secret value, email or `/home/` path |
| T-15-58 | Full cutover with an in-flight command and a running old server | B39 | MP | close waits for the command; old server exits 75; migrations by `tm_owner`; verify sets `verified_at`; restart before open serves maintenance; open only by explicit command | `tm_app` DDL refused; old binary cannot register or write; no task leased, byte released or worker spawned while closed |
| T-15-59 | Crash at `cutover.after_close`, `after_checkpoint`, `after_migrate`, `before_open`, and rerun | B39, B41 | MP | rerun resumes; admission stays closed throughout | no `sys.admission_opened` without the explicit command |
| T-15-60 | Snapshot rollback on a still-closed cutover | B39 | MP | database equals the checkpoint; ids and launch/suspension rows preserved; checkpoint `used_for_rollback` | — |
| T-15-61 | Snapshot rollback refusals: admission opened since checkpoint; one command accepted after; dump missing; dump digest mismatch; fact range unreadable | B39, B41 | MP | refusal codes; database unchanged | no restore of the dump; no `--force` path |
| T-15-62 | Code rollback compatible vs incompatible schema | B39 | MP | compatible: active release switched, data kept | incompatible: refused; old binary still cannot register |
| T-15-63 | No external replay after cutover | B39, B31 | MP | `mail.deliver` with `effect_started_at` becomes `effect_uncertain` after open | no second transport call; no government/payment task exists |
| T-15-64 | Migration preservation | B39 | I | hashes of `core_applications` ids, `ops_launch_decisions`, `ops_suspensions`, `sys_tasks` ids equal before/after | — |

### 7.5 Backup and restore

| # | Test | Rules | Level | Persisted effects asserted | Forbidden effects asserted |
|---|---|---|---|---|---|
| T-15-65 | Backup set contents | B40 | MP | admission closed during capture; `db.dump`; every referenced canonical and still-referenced quarantine blob with digest; pre-existing missing blob listed as gap; prerequisites; status `complete`; `LAST_GOOD` updated | backup refused while open; encrypted files contain no synthetic names or emails in plaintext; unreferenced staging/disposed bytes absent |
| T-15-66 | Incomplete capture (`backup.mid_bytes`, digest mismatch) | B40 | MP | set `incomplete` kept | `LAST_GOOD` unchanged |
| T-15-67 | Clean restore into an isolated namespace | B40, B41 | MP | new cluster, dirs and secrets (every secret differs); exact canonical and quarantine bytes in the same areas; quarantined document still `quarantined`/`safety_*`; admission closed `restore_clean` | old session cookie, OTP, enrolment token and lease token unusable; source installation files unchanged (hash) |
| T-15-68 | Interval-loss restore: open without approval ref; with unknown scope; declared scope with missing marks; mark retry; mark effects after reopen | B40, B41 | MP | refusals; one mark per application; after reopen, authorization, packet release and byte release blocked `protection_mark_active` | mark retry creates no new mark, attempt, authorization, payment entry, exposure change, clearance or notice |
| T-15-69 | Maintenance through restore interruption (`restore.mid_bytes` crash; server started in the namespace) | B40, B41 | MP | rerun completes idempotently; server serves maintenance | no task leased, no worker process spawned (process table check), no byte released |
| T-15-70 | No fabrication on restore | B40, B33 | MP | missing blob stays `missing`; gaps recorded | no fact with `retrospective = false` created for lost-interval events |
| T-15-71 | Procedure presentation | B40 | I | procedure file lists required sections | admission unchanged |

### 7.6 Capacity and local install

| # | Test | Rules | Level | Persisted effects asserted | Forbidden effects asserted |
|---|---|---|---|---|---|
| T-15-72 | Limits: pool exhaustion, `tasks.maxPending`, stream slots, `storage.minFreeBytes` | B38 | I | 503 with `Retry-After` and code; previously accepted tasks still `pending` with owner | no partial business write on refusal |
| T-15-73 | Health separation | B38, B33 | I | scanner down ⇒ only `worker` degraded; projector stall ⇒ only `projection`; output allowlisted | non-loopback request to `/healthz` refused |
| T-15-74 | Capacity record | B38 | MP | fact `sys.capacity_recorded` with limits and observations | — |
| T-15-75 | Install separation and access | B37 | I | secrets dir outside data/repo with modes; config refuses non-loopback bind without TLS | seed refused in production and with a non-synthetic account; seed creates no first-admin bypass path |
| T-15-76 | Rev 2 (REC-01): backup while a `blob.promote_to_quarantine` and a `blob.publish_canonical` move are pending; restore | B40, B12 | MP | inventory lists the staging and quarantine rows; restored bytes equal; the move tasks complete after reopening | a `complete` set missing a referenced blob |
| T-15-77 | Rev 2 (REC-02): close admission while a `doc.parse` record is in flight; backup | B40, B39 | MP | the record either committed before closure and is in both dump and inventory, or failed `maintenance` and is in neither; `last_fact_seq` equals the dump | a row/area mismatch between dump and blob files |
| T-15-78 | Rev 2 (REC-03): source cluster at a high xid; restore into a new cluster; reopen; run a command | B40, B33 | MP | new fact projected in lists and audit search; restored facts searchable; projector cursors rebuilt | a fact absent from projections |
| T-15-79 | Rev 2 (REC-05, REC-06, BND-18): interval-loss restore with an application that has a readiness `current` and no surviving evidence; with a pending manual-resend `mail.deliver` task | B40, B23 | MP | both applications in the computed candidate set; task `cancelled_obsolete`/`restore_boundary`; email send `uncertain`; zero transport calls after reopening | reopening with a candidate neither marked nor excluded with a reason |
| T-15-80 | Rev 2 (SEC-01, SEC-02): artifact release matrix — verified artifact to its application on retrieval, selection and email; same artifact against a sibling application ⇒ `association_not_positive`; `pending_review` artifact ⇒ denied on TA channels, allowed on `staff_review` to the reviewer only, denied after `blockVersion` | B12, B13 | I | release rows per channel with `incident_id` for review | bytes to any other recipient |
| T-15-81 | Rev 2 (MON-01): fee timing `with_submission` end to end through Payments (reserve on the submission, convert on filing evidence, unknown, not paid, fresh authorization) | B27, B28 | I | one reservation, fee states, liability | second reservation; fee act authorization |

### 7.7 B41 items in this scope

| B41 item | Tests |
|---|---|
| Real persisted Nth retries, changed-content conflict, lost acknowledgements | T-15-04, T-15-05, T-15-35 |
| Concurrent payment and exposure cases | T-15-06, T-15-07, T-15-13, T-15-18, T-15-26 |
| Gate 1 versus Gate 2 | T-15-10, T-15-12 |
| Wrong-recipient access through each delivery and view route | T-15-31, T-15-49, T-15-54, T-15-55 |
| Wrong-scope and revoked access (delivery, views) | T-15-30, T-15-36, T-15-47 |
| Electronic, physical and preparation-only shapes (delivery evidence) | T-15-42, T-15-45, T-15-46 |
| Exact artifact release and accepted send interval | T-15-29, T-15-30, T-15-32 |
| Release interruption | T-15-58, T-15-59 |
| Refusal of the closed-cutover exception when admission opened or history unknown | T-15-61 |
| Closed lossy restore: new secrets, unusable old credentials, exact canonical/quarantine bytes, maintenance through interruption with no worker bypass, protection-mark retry creates no new attempt or clearance | T-15-67, T-15-68, T-15-69 |
| Actual forbidden effects and recoverable residue | every row's last column; residue: T-15-34, T-15-39, T-15-59, T-15-66, T-15-69 |

## 8. Contract change requests

Each request names the contract section, the exact change, the reason and the interim behaviour until the orchestrator accepts or rejects it.

| # | Contract section | Proposed change | Reason | Interim | Disposition (rev 2) |
|---|---|---|---|---|---|
| CCR-15-01 | §3.9 `pay_exposure_reservations`; §3.9 invariant; §8.6 step 2; T-F22 | Add `converted_paise bigint NOT NULL DEFAULT 0 CHECK (converted_paise >= 0)`. Redefine `reserved_paise = Σ GREATEST(amount_paise − converted_paise, 0)` over all reservations of the TA (any state). §8.6 step 2: `counted = reserved_paise + tm_paid_unrecovered_paise − remainder(existing)`. `converted_to_paid` means `converted_paise > 0`; the unused remainder stays counted. | With the current text, a TM fee paid below the reserved amount drops the unused remainder from counted exposure: an implicit unused-reservation release (PARKED, B28) and an exposure decrease without an Accounts-verified receipt (B28). | Blocking for milestone 3: without it Algorithm F cannot be both invariant-true and B28-true. | Accepted (01 §2.19, §3.9, §8.6) |
| CCR-15-02 | §6.8 `PaymentsApi`; §2.22 fact types; §7.4 | Add writer `recordFeeNotPaid(tx, { logicalEffectKey, authorizationId, evidenceId })` (fee `reserved\|payment_unknown → reserved`, reservation untouched); Core's `recordExternalActEvidence` calls it when a fee-payment act becomes `not_filed_evidenced`. Add fact type `pay.fee_payment_state_changed` for `→ payment_unknown` and `→ reserved`. | Contract §7.4 allows `not_filed_evidenced` and reuse of the reservation, but no writer moves the fee record out of `payment_unknown`; the `fee_payment_unknown` blocker would then stop the fresh authorization forever. | Blocking for the fee-act evidence path; until accepted, `recordFeePaymentUnknown` uses `pay.government_fee_recorded` with before/after state. | Accepted (01 §6.8, §7.4) |
| CCR-15-03 | §5.2 actions; §2.22; §6.8 commands | Add action `financial_exception.reassign_owner` (SuperAdmin), command `pay.reassign_follow_up_owner`, fact `pay.financial_exception_owner_changed`, reason code `follow_up_owner_not_eligible`, `follow_up_owner_inactive`. | B29 requires nudging the accountable SuperAdmin while follow-up is open; a suspended or departed SuperAdmin leaves the follow-up unowned (B32 "unowned waits"). | Route absent; list and monitor flag `follow_up_owner_inactive`. | Accepted (01 §5.2, §6.8) |
| CCR-15-04 | §2.18 `NOTICE_KINDS` | Add `financial_follow_up` (staff recipient only). | The nudge notice (contract I-13) needs a kind; `generic_case_update` would hide it among TA case updates. | Use `generic_case_update` with `params.code = 'financial_follow_up'`, recipient SuperAdmin. | Accepted (01 §2.18) |
| CCR-15-05 | §4.2 kernel API (new) | Add `runContinuation(env, def, parent: { operationId, actor }, input)`: SERIALIZABLE, `assertWriter`, bounded retry, no actor-permission precondition, facts carry the parent operation id and actor with `command_name` = continuation name; `ContinuationDef` lists allowed evidence writers (`checkRelease`, `recordReleaseResult`, `recordSelectionItemResult`, `markBytesUnavailable`, `openIncident('bytes_integrity')`). T-F07 applies (≥ 1 fact). | The true result of a send that started under a valid check MUST be recorded even if the requester's access is revoked during the send; per-item selection checks MUST record denials caused by revocation (B12, B31). `runCommand` refuses before the handler when the actor lost access, so the evidence would be lost. | Use `runCommand` with the requester and a server-generated key; when refused, the result stays NULL (`unrecorded`). | Accepted (01 §4.2) |
| CCR-15-06 | §2.18 / §3.10 `dlv_packets.state`; §2.22 | Add packet state `build_failed` (excluded from the partial unique index) and fact types `dlv.packet_requested`, `dlv.packet_released`, `dlv.packet_state_changed`. | A build can fail terminally (evidence changed, reassignment, bytes unavailable); without a state the failure is invisible or blocks a rebuild. Release is a consequential act that needs its own fact. | `dlv.packet_built` with `after.state`; failed build marked `superseded` with `failure_code`. | Accepted with edit: release fact is `core.packet_released`; Delivery appends `dlv.packet_state_changed` (01 §2.22) |
| CCR-15-07 | §7.11; §6.9 commands | Add harness-only `dlv.post_result_notice`; state that a `result_available` notice is part of the B46 delivery-send boundary and that `postNotice` refuses that kind from non-harness callers. | B24 counts web notification as completion evidence; posting it automatically on outcome or artifact recording would supply the provisional delivery trigger that B46 forbids (X-5, OD-15-02). | `result_available` notices are not posted by product code. | Accepted (01 §2.18, §7.11) |
| CCR-15-08 | §1.2 prefix table; §3.2 kernel tables; §2.22 fact types; §4.7 `openAdmission` | Add table `sys_backup_sets` (`bks_` prefix: `backup_set_id`, `created_at`, `state` `capturing\|complete\|incomplete\|abandoned`, `last_fact_seq`, `last_op_seq`, `writer_epoch`, `manifest_sha256`, `gaps jsonb`, `custody`, `finished_at`). Add `sys_restores.declared_scope jsonb`, `scope_state` (`unknown`, `declared`). Add fact types `sys.backup_recorded`, `sys.restore_scope_declared`, `sys.rollback_performed`, `sys.release_verified`, `sys.projection_rebuilt`. `openAdmission` for `restore_interval_loss` additionally requires `scope_state = 'declared'`. | Backup health (B38) and last-good protection (B40) need a durable record; "unknown affected identity/scope keeps the whole installation closed" (B40) needs a stored scope state that `openAdmission` can check. | Backup state only in `SET.json`/`LAST_GOOD`; restore scope checked by the CLI before calling `openAdmission`. | Accepted with edit: `scope_basis` completeness required (01 §3.2, §4.7; REC-05) |
| CCR-15-09 | §4.11 `FAULT_POINTS` | Add `backup.mid_bytes`, `backup.before_last_good`, `selection.between_items`, `projector.before_commit`. | T-15-36, T-15-51, T-15-65, T-15-66 need deterministic interruption points. | Tests use `delay` faults on existing points where possible. | Accepted (01 §4.11) |
| CCR-15-10 | §4.2 step 5 | SQLSTATE `55P03` (lock_not_available) is retried like `40001` within the bounded attempts, exhaustion ⇒ `conflict_retry_exhausted`; `57014` (statement timeout) ⇒ `capacity_limited`/`capacity_statement_timeout` without retry; `53300` (too many connections) ⇒ `capacity_limited`/`capacity_connections`. | `lock_timeout = 2000` is set by the runner but its error is unmapped (would become `internal`); B38 requires truthful retryable status at limits. | Implementation maps them as proposed (no business effect). | Accepted (01 §4.2) |
| CCR-15-11 | §4.12 `createIntent` / `writeStaged` | Both call an admission check (`sys_installation.admission = 'open'` and current epoch) in their own transactions and refuse with `maintenance`. | B39 "closes admission and byte/work claims": uploads must not stage new bytes during cutover, backup or restore. | Route handlers check admission before calling the blob store. | Accepted (01 §4.12) |
| CCR-15-12 | §8.4 `REASON_CODES` | Add: `payment_entry_kind_invalid`, `correction_target_not_current`, `correction_no_change`, `correction_fork`, `ceiling_not_lower`, `ceiling_not_higher`, `ceiling_increase_already_requested`, `ceiling_request_not_open`, `self_approval_forbidden`, `requester_inactive`, `ceiling_changed_since_request`, `fee_already_paid_for_effect`, `fee_state_changed`, `follow_up_owner_not_eligible`, `follow_up_owner_inactive`, `recipient_inactive`, `recipient_not_owning_ta`, `recipient_access_revoked`, `version_replaced`, `version_blocked`, `version_not_processed`, `association_not_positive`, `packet_not_released`, `packet_superseded`, `packet_constituent_unavailable`, `packet_exists`, `packet_handed_over`, `packet_not_ready`, `packet_stale`, `handover_exists`, `handover_evidence_missing`, `incident_block`, `ack_not_required`, `already_acknowledged`, `resend_source_not_failed`, `resend_exists`, `selection_too_large`, `selection_aborted`, `capacity_streams`, `capacity_statement_timeout`, `stream_failed`, `assignment_changed`, `evidence_changed`. CLI-only codes (`release_tree_dirty`, `schema_incompatible`, `restore_target_not_empty`, `reopen_approval_missing`, `backup_requires_closed_writers`, `closed_for_other_reason`) live in a separate closed set in `src/cli`. | One closed set per contract §8.4. | — (required before implementation of these commands) | Accepted (01 §8.4) |
| CCR-15-13 | §6.9 `checkRelease` order; §6.4 Core writers | Insert "no active protection mark (I-14)" before the subject checks; state that TA-channel and email recipients MUST be the owning TA; add `artifact_id`, `packet_id`, `channel`, `ta_account_id`, `requested_by_account_id`, `selection_item_no`, bytes metadata and `operation_id` columns to `dlv_releases` (detail). Name Core's writer `consumeGateException(tx, { gateExceptionId, action })` for use by non-Core guarded actions (`release_packet` in Delivery). | I-14 says the mark blocks byte release, but §6.9 omits it; `release_packet` is a readiness-gated action executed by Delivery, which cannot write `core_gate_exceptions`. | Delivery calls `core.requireControls`; readiness exceptions for `release_packet` are unavailable until Core exposes the writer. | Accepted with edit: no `consumeGateException`; Core owns packet release (01 §3.10, §6.9; COV-03) |
| CCR-15-14 | §2.24 actor kinds | Allow the `engineering` actor to call Identity and Catalogue writers only through `tm seed synthetic` in `test`/`local_test`, facts with `command_name = 'harness.seed_synthetic'`. | B37 permits a synthetic identity fixture seed; §2.24 forbids engineering business facts. | Seed through the test harness only (no local-test seed). | Accepted with edit: actor kind `harness` (01 §2.24) |
| CCR-15-15 | §2.22 / Operations commands | Add an Operations command `ops.record_effort_sample` (operator/TA/observable partner effort, sampling basis) and fact type, or record that effort capture is out of scope. | B32 requires operator/TA and observable partner effort with sampling/missing shares; no capture source exists. | M-06 reported `not_captured` with 100 % missing share. | Accepted (01 §1.2, §3.8, §5.2; COV-10) |
| CCR-15-16 | §2.21 `TASK_KINDS` table | State that `mail.deliver` for `document_email` is owned by Delivery and that `delivery.build_packet` acts on behalf of the assigned operator with `onBehalfAction = operator.build_packet`. | Clarifies permission re-check owner. | As stated. | Accepted (01 §2.21) |
| CCR-15-17 | §5.2 / §5.3 | Add actions `exposure.read` (SuperAdmin), `ceiling.increase_decline` (any SuperAdmin), `operator.record_handover` (assigned operator); `exposure.release` covers both parked routes (release and fee exclusion) with distinct codes. | The rule table has no read action for `ta_finance`, no decline action and no handover action. | `exposure.read` → `ceiling.lower`; decline → `ceiling.increase_request`; handover → `operator.release_packet`. | Accepted (01 §5.2, §5.3) |

## 9. Owner-decision candidates and recorded interpretations

### 9.1 Genuine owner-decision candidates (B47)

None blocks this module's build. Each has a safe interim that the design implements.

**OD-15-01 — What closes a `Payment_Missing_Override` follow-up.**
- Spec text: B29 "It survives service completion until collection or authorized write-off"; B26 "SuperAdmin records manual per-application service payment status"; B29 "Accounts … owns bank-receipt verification/allocation, recovery"; B28 "Exposure decreases only on Accounts-verified allocated bank receipt" (government fees).
- Why unknowable: the spec does not say whether "collection" of a service payment is proven by a SuperAdmin `payment_received` entry or requires Accounts verification (PARKED). For `payment_corrected_after_work` where the correction itself says `payment_received`, the cause and the "collection" are the same entry.
- Safe interim: contract §7.10 rule — a later `payment_received` entry closes open exceptions; the entry that opens an exception never closes it (I-15-01). Government-fee recovery stays separate and never decreases in this build.
- Independent work: all.

**OD-15-02 — Is the `result_available` web notice part of the B46 delivery-send event?** Fold into the B46 UAT decision.
- Spec text: B24 "document-carrying email to the owning TA plus web notification evidence hold completion"; B46 "The event that starts delivery send … deliberately unresolved … Do not supply provisional triggers".
- Safe interim: harness-only posting (X-5, CCR-15-07); outcome display and progress remain truthful without the notice.

**OD-15-03 — OS-level runtime identity separation (B37).**
- Spec text: B37 "keep data, secrets and runtime identities separate from other applications".
- Why a decision: a dedicated OS account needs a host administration change (root). Phase rules forbid agents from using sudo or changing host configuration; the product owner has offered a time-limited sudo window. Whether to create a dedicated system user (and who performs it) is an authority question, not an engineering default.
- Safe interim: separate database cluster and roles, sockets, directories, secrets and ports under the current uid; recorded as a known gap in the capacity/installation record. Other processes of the same uid can read TravelMudra files.

### 9.2 Recorded interpretations (engineering; promote to an owner decision if the owner disagrees)

| ID | Topic | Interpretation | Basis |
|---|---|---|---|
| I-15-01 | Exception opened by a correction to `payment_received` | It stays open until a later `payment_received` entry. | B26, B29, contract §7.10 |
| I-15-02 | Entry kinds | `record` = first entry or arrival of payment; every other change is a `correction` of the current entry. | B26 "additive corrections" |
| I-15-03 | TA visibility of ceiling and counted exposure | Not shown to the TA; liabilities and outstanding recovery are shown. | B28 (internal control); B01 payment history |
| I-15-04 | TM paid more than reserved | Recorded truthfully; counted exposure grows; `paid_exceeds_reservation` flag and monitor; new commitments stop while counted exceeds the ceiling. The safe operating procedure is to evidence `not_filed`, then re-authorize the higher amount through the ceiling check. | B28, B23, B33 |
| I-15-05 | Email recipient snapshot | Refreshed to the owning TA's current email at the prepare check; a later switch is inside the accepted interval. | B09, B12, B31 |
| I-15-06 | Retrieval replay | A replayed retrieval key never streams bytes; a new retrieval needs a new check. | B12, B35 |
| I-15-07 | Document email with several versions | Any denied attachment denies the whole email (`denied_at_check`); per-version check rows record each result. | B12 "do not substitute" |
| I-15-08 | Ceiling increase approval during audit degradation | Treated as a non-emergency privileged elevation and refused; lowering stays available. | B33 |
| I-15-09 | Manual operator email | Recipient MUST equal the owning TA's current email; record is not system-verified and does not satisfy the completion check (contract OD-02 interim). | B24, B31 |
| I-15-10 | Interval loss | Unknown loss is loss: `interval_loss = true` unless the source sequence is proven equal. | B40 |
| I-15-11 | Backup admission | Backups run only with writers closed by an explicit operator close; reopening is deliberate. | B40 "closes writers" |
| I-15-12 | Packet notices | Packet release posts no automatic notice; the TA sees the packet on the delivery page. | B46 (no provisional trigger) |
