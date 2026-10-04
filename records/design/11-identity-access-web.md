# TravelMudra design record 11 — Identity & Access and the shared web shell

Owner of this record: design phase (Identity & Access lane). Integration and every decision in it: orchestrator. Date: 2026-10-04. Status: **revision 2** (consolidated after the 2026-10-04 design review; ledger `internal/records/reviews/2026-10-04-design-review-ledger.md`). Contract record 01 revision 2 governs; Section 8 carries each request's disposition.
Authority, in order: `internal/records/BUILD_SPEC.md` (B01–B47); architecture brief revision 2 (`00-architecture-brief.md`); `ENGINEERING_OVERRIDES.md` (EO-01…EO-07); environment inventory 2026-10-04; foundation contract `01-foundation-contract.md` (binding; cited as "contract §n").
Scope: B08, B09, B10, B11, B07 (product-owner account), B29 (accounting grant), B33 (privileged elevation during audit outage), B37 (synthetic seed boundary), and the shared web shell: sessions, cookies, CSRF/origin/host checks, rate limiting and bot controls, sign-in, MFA, account lifecycle, grants, support view, full-audit access, operator suspension hand-off, and the complete route inventory.

This is an internal record. It cites rule IDs. Product source, tests, comments and commit messages MUST NOT copy rule IDs, internal paths or identifiers of this record (brief §0).

## 0. Inputs, conflicts and key decisions

### 0.1 Conflicts between inputs (named, with the resolution this record follows)

| ID | Inputs in conflict | Resolution in this record | Who decides |
|---|---|---|---|
| X-01 | Task text says integration tests run over "real persisted SQLite". Brief revision 2 and EO-01 replace SQLite with PostgreSQL 16. | All integration tests in Section 7 run over real persisted PostgreSQL 16 (per-file database cloned from the migrated template, contract §10.1). | Orchestrator (already decided in EO-01). |
| X-02 | Task text says "TOTP via node:crypto". Brief §1.1 lists `otpauth` 9.5.2 for staff TOTP. | **Decided in revision 2 (CCR-14 rejected; review finding COV-19):** TOTP generation and verification use the pinned runtime library `otpauth` 9.5.2 (brief §1.1), wrapped in `src/modules/identity/totp.ts` (constant-time comparison, step window ±1, replay guard `totp_last_step`). Reason: EO-02 records the product owner's direction to prefer mature libraries for security-sensitive code and names TOTP; the brief (revision 2) supersedes the earlier "node:crypto" task text. RFC 6238 SHA-1 test vectors are the independent oracle (T-U16). `qrcode` renders the enrolment SVG. No engineering override is needed. | Orchestrator (decided). |
| X-03 | Contract §1.1 defines an OTP as "32 random bytes, base64url". B08 requires "bounded attempts", and a TA types the code from an email. | OTP = 8 decimal digits from `crypto.randomInt`. Attempt bounds (5 per challenge, issuance limits) give a per-challenge guess probability of 5 × 10⁻⁸. Session, lease and enrolment tokens stay 32 bytes. CCR-01. | Orchestrator. |
| X-04 | Contract §12.1 route `/staff/enrol/:token` puts a bearer token in a URL. Contract §5.5 says "No URL is a bearer credential". | Enrolment code is typed or pasted into a `POST /staff/enrol` form. No token in any URL. CCR-02. | Orchestrator. |
| X-05 | Contract §10.7 `captcha.verify(tx, …)` is a platform facility that inserts into `iam_captcha_spent` (an Identity table). Contract §3.1/T-F01: sole writers. | Platform keeps only pure functions (`createChallenge`, `verifyPayload`). Identity exports the writer `consumeBotCheck(tx, …)`, used by Identity and Intake commands. CCR-03. | Orchestrator. |
| X-06 | Contract §2.21 assigns OTP mail to `mail.deliver` (Delivery). The OTP plaintext must reach the mail transport, but contract §3.1 forbids secrets/personal data in task payloads, and only Identity may write `iam_` rows. | New task kind `iam.send_mail` (owner Identity). The code is stored AES-256-GCM-encrypted on the owning `iam_` row until the task sends it, then wiped. CCR-04. | Orchestrator. |
| X-07 | Contract §2.22 fact list lacks facts for OTP issuance, failed sign-in attempts, the first email-change proof, enrolment and grant/elevation expiry. Contract §4.2 requires a fact for every accepted command. | Add the fact types and subject types in CCR-05. | Orchestrator. |

No conflict between the brief and BUILD_SPEC was found in this scope. C-06 (staff first factor = email OTP) is followed and justified in D-01.

### 0.2 Key engineering decisions (B47; reversible)

| ID | Decision | Justification |
|---|---|---|
| D-01 | Staff sign-in = email OTP (possession of the account mailbox) + TOTP (possession of the enrolled device), both submitted in one verification step. No password. (Contract C-06.) | B08 requires MFA. No password store means no password reset flow, no hash-parameter policy and no credential an administrator could see or choose (B11). The email OTP reuses the TA verifier (B34 "shared authentication capability"). Submitting both factors together removes the oracle that would tell an attacker which factor failed. Cost: staff sign-in depends on mail transport; with `mail.transport = 'none'` (production) no one can sign in. This is consistent with B37 (no provider selected) and is visible in health output. |
| D-02 | Every OTP is bound to: purpose, account (or decoy), contact (`HMAC(otp_pepper, email_normalized)`), and attempt (`HMAC(otp_pepper, pre-session nonce)` for sign-in; `HMAC(otp_pepper, session_id ‖ email_change_id)` for email change). | B08 "bound to account/contact and attempt". A code is useless from another browser, for another account or after the account email changed. |
| D-03 | Unknown, ineligible or wrong-role email at sign-in produces a decoy challenge: same transaction shape, same response bytes class, no mail. | B08 "Do not disclose account existence". Mail is sent by a task after commit, so response timing does not depend on mail. |
| D-04 | Bot and rate controls are ordered: IP limit → CAPTCHA → contact limit → global limit → command. | CAPTCHA before issuance (B08). A contact limit placed before the CAPTCHA would let an attacker without a solved CAPTCHA exhaust a victim's sign-in quota. |
| D-05 | A failed OTP/TOTP verification is an accepted command whose business result is `invalid`. It commits the attempt counter and a fact. | Attempt bounds MUST persist; a rejected command rolls back (contract §4.2), so a rejection cannot count an attempt. |
| D-06 | Email change proofs are sequential: the proposed address receives a code only after the current address is proven. | B09. A stolen session alone cannot make the system mail an arbitrary address. |
| D-07 | Suspension revokes sessions, open challenges, open email changes, open enrolments and all active grants of the account in one transaction. Restoration restores none of the grants. | B11 "Suspending an operator revokes access"; most restrictive reading; grants are re-created deliberately. |
| D-08 | Restoring a suspended SuperAdmin uses the two-SuperAdmin elevation flow (kind `restore_superadmin`). | Restoration returns SuperAdmin authority; B11 requires a second distinct SuperAdmin for creation/elevation. Recorded as OD-I2 because it can block recovery. |
| D-09 | Time-limited access (group read grants, support view) fails closed while clock health is `degraded` (contract §4.9). Sessions do not, so emergency containment stays reachable. | B10, B25 clock basis; B33 containment availability. |
| D-10 | The SuperAdmin support view renders the viewed account's own surface pages under actor kind `support_view`; all POST routes except "end support view" refuse; no bytes. | B10 "exact-result … without impersonation or target actions". Using the same handlers and the same `policy.scope` predicate makes the result exact by construction. |
| D-11 | Public pages read no database and no session. | B01 "Keep private case and live catalogue data out of public content"; no private state can leak into an indexable page; they keep serving during maintenance. |

## 1. Responsibilities and non-responsibilities

### 1.1 Identity & Access owns (sole writer of `iam_` tables, B34)

| Area | Content | Rules |
|---|---|---|
| Accounts | create, approve, decline, activate, suspend, restore; role elevation; the product-owner account as an ordinary `superadmin` (no flag) | B07, B08, B11 |
| Sign-in | TA email + OTP; staff email OTP + TOTP; enrolment; credential reset (re-enrolment) | B08, B11 |
| Sessions | creation, rotation, expiry, revocation, support-view flag | B08, B10 |
| TA email change | two proofs, atomic switch of sign-in address and document recipient | B09 |
| Grants | named group read grant; accounting grant | B10, B29 |
| Support view | start/end record, exact-result read mode | B10 |
| Bot and rate controls | ALTCHA spent registry, rate-limit store, the ordered control helpers used by every route | B08 |
| Access policy | `src/modules/identity/policy.ts`: the single `authorize`/`decide`/`scope` (contract §5) | B10 |
| Web shell | `src/web`: request pipeline, cookies, CSRF/origin/host checks, headers, maintenance page, route registry, support-view rendering, error pages, operation-lookup pages | B08, B10, B33, B38 |
| Route inventory | Section 4.4: every route of every surface with its action, resource and authorization rule | B10 |
| Synthetic identity seed | `tm seed synthetic` (test and local_test only) | B37 |
| Identity health | `/healthz` component `identity` (active SuperAdmin count class, mail transport label) | B38, B44 |

### 1.2 Identity & Access does NOT own

| Item | Owner | Interface used |
|---|---|---|
| Assignment, reassignment, duty transfer after operator suspension | Core (`core.assign`, `core.reassign`) | Identity shows duties via Core/Operations queries (CCR-09); the hand-off page posts to Core routes. |
| `pending_on_action` while an operator is suspended | Core (`assigned_operator_inactive`, contract §5.5) | Core reads `identity.getAccount`. |
| Gate exceptions, payment entries, ceilings | Core, Payment Records | routes only (Section 4.4). |
| Catalogue values, launch control | Catalogue, Operations | routes only. |
| Public page content, sitemap, structured data, SEO check | Catalogue/public-site design | Identity serves the routes through the shell; content is static repository content. |
| Audit search index, TA history projection | Derived Views | Identity owns the routes and the authorization; Views owns the projection. |
| Document email, notices, byte release checks | TA Delivery | Identity provides `getRecipient` (current email + `email_revision`). |
| Kernel: command runner, facts, tasks, admission, secrets, clock | Kernel/platform | contract §4, §10. |
| Mail transport and MIME building | platform (`src/platform/mail.ts`) | `iam.send_mail` task calls it outside any transaction. |
| Restore secret rotation | Kernel CLI | Identity rows carry `secret_generation`; Section 7 tests the Identity effects. |

Identity calls no other module's writer (contract §6.2). It reads Core (`relations.group`, `operatorDuties`) and Operations (`incidentsOwnedBy`) through their `api.ts` queries.

## 2. Tables owned (`iam_`)

Conventions of contract §3.1 apply: id `CHECK`s, `timestamptz` from the injected clock (no `DEFAULT now()`), closed-set `CHECK`s generated from `src/kernel/vocabulary/identity.ts`, `revision` on mutable rows, foreign keys `ON DELETE RESTRICT`. Columns marked "new" extend contract §3.3 (CCR-06).

### 2.1 `iam_accounts` (guard table)

| Column | Type | Null | Meaning |
|---|---|---|---|
| `account_id` | text | no | PK `acc_` |
| `role` | text | no | `ta`, `operator`, `superadmin` |
| `status` | text | no | `pending_approval`, `approved`, `active`, `suspended`, `declined` |
| `email_normalized` | text | no | Section 3.0.3 normalization; personal data |
| `email_display` | text | no | as entered (trimmed, NFC) |
| `email_revision` | bigint | no | new; +1 at every email switch; `getRecipient` returns it |
| `display_name` | text | no | 1–120 chars |
| `synthetic` | boolean | no | new; true only for seed fixtures (B37) |
| `created_by` | text | yes | FK account; NULL only when `synthetic` (engineering seed) |
| `created_reason` | text | no | 10–1000 chars |
| `created_at` | timestamptz | no | |
| `status_changed_at` | timestamptz | no | |
| `mfa_enrolled_at` | timestamptz | yes | staff only |
| `totp_secret_enc` | bytea | yes | AES-256-GCM(`totp_wrap_key`, 20-byte seed), AAD = `account_id ‖ totp_key_generation` |
| `totp_key_generation` | integer | yes | wrap-key generation |
| `totp_last_step` | bigint | yes | last accepted RFC 6238 step; replay guard |
| `totp_fail_count` | integer | no | new; default 0; TOTP failures in the current window |
| `totp_fail_window_start` | timestamptz | yes | new; window start (24 h) |
| `revision` | bigint | no | |

Constraints and indexes:
- `UNIQUE (email_normalized) WHERE status <> 'declined'` (`iam_accounts_email_uq`, guard → `conflict_duplicate` / `email_in_use`).
- `CHECK (role <> 'ta' OR (totp_secret_enc IS NULL AND mfa_enrolled_at IS NULL))`.
- `CHECK ((totp_secret_enc IS NULL) = (mfa_enrolled_at IS NULL))`; `CHECK ((totp_secret_enc IS NULL) = (totp_key_generation IS NULL))`.
- `CHECK (NOT synthetic OR email_normalized LIKE '%@synthetic.test')`; `CHECK (synthetic OR created_by IS NOT NULL)`.
- Trigger `tm_forbid_column_change(account_id, created_at, synthetic, created_by)`.
- Trigger `iam_role_change_guard`: `role` may change only from `operator` to `superadmin`.
- Index `(role, status)`.

### 2.2 `iam_sessions`

| Column | Type | Null | Meaning |
|---|---|---|---|
| `session_id` | text | no | PK `ses_` |
| `account_id` | text | no | FK |
| `token_hmac` | bytea | no | `HMAC-SHA-256(session_key, token)`; UNIQUE |
| `kind` | text | no | `ta`, `staff`, `enrolment` |
| `enrolment_id` | text | yes | FK `iam_enrolments`; set iff `kind='enrolment'` |
| `created_at` | timestamptz | no | |
| `last_seen_at` | timestamptz | no | touched at most every 60 s (Section 4.1 step 6) |
| `idle_expires_at` | timestamptz | no | |
| `absolute_expires_at` | timestamptz | no | |
| `mfa_verified_at` | timestamptz | yes | required for `staff` |
| `revoked_at` | timestamptz | yes | |
| `revoke_reason` | text | yes | `sign_out`, `sign_out_all`, `suspended`, `email_changed`, `credentials_reset`, `role_changed`, `superseded`, `enrolment_done` |
| `support_view_id` | text | yes | FK; open support view on this staff session |
| `secret_generation` | integer | no | must equal the current generation |
| `revision` | bigint | no | |

Constraints: `UNIQUE (token_hmac)`; `CHECK (kind <> 'staff' OR mfa_verified_at IS NOT NULL)`; `CHECK ((kind = 'enrolment') = (enrolment_id IS NOT NULL))`; `CHECK (support_view_id IS NULL OR kind = 'staff')`; `CHECK ((revoked_at IS NULL) = (revoke_reason IS NULL))`. Index `(account_id) WHERE revoked_at IS NULL`. No IP address or user-agent is stored.

### 2.3 `iam_otp_challenges`

| Column | Type | Null | Meaning |
|---|---|---|---|
| `otp_id` | text | no | PK `otp_` |
| `purpose` | text | no | `ta_sign_in`, `staff_sign_in`, `email_change_current`, `email_change_new` |
| `account_id` | text | yes | FK; NULL ⇔ decoy |
| `decoy` | boolean | no | `CHECK (decoy = (account_id IS NULL))` |
| `contact_hmac` | bytea | no | `HMAC(otp_pepper, "contact/v1" ‖ email_normalized)` |
| `attempt_binding_hmac` | bytea | no | D-02 |
| `verifier_hmac` | bytea | no | `HMAC(otp_pepper, "otp/v1" ‖ otp_id ‖ code)`; decoys store the HMAC of a random code nobody knows |
| `delivery_code_enc` | bytea | yes | new; AES-256-GCM(HKDF(`otp_pepper`, "otp-delivery/v1"), code), AAD = `otp_id`; NULL for decoys; wiped after the mail task and at expiry |
| `email_change_id` | text | yes | FK; set iff purpose starts `email_change_` |
| `issued_at` | timestamptz | no | |
| `expires_at` | timestamptz | no | `issued_at + otp.ttlMs` (10 min) |
| `attempts_used` | integer | no | |
| `max_attempts` | integer | no | `otp.maxAttempts` (5) |
| `state` | text | no | `issued`, `consumed`, `exhausted`, `expired`, `superseded` |
| `mail_state` | text | no | new; `none` (decoy), `queued`, `synthetic_accepted`, `accepted`, `failed`, `uncertain` |
| `mail_task_id` | text | yes | FK `sys_tasks` |
| `secret_generation` | integer | no | |
| `revision` | bigint | no | |

Guards: `UNIQUE (purpose, attempt_binding_hmac) WHERE state = 'issued'` (`iam_otp_issued_binding_uq`; replaces the contract index, CCR-07). Verification is the conditional update in Section 3.2. Index `(account_id, purpose) WHERE state = 'issued'`; index `(expires_at) WHERE state = 'issued'`. `tm_app` DELETE only for rows whose `expires_at < now − 7 days` (contract §3.1).

### 2.4 `iam_email_changes`

| Column | Type | Null | Meaning |
|---|---|---|---|
| `email_change_id` | text | no | PK `emc_` |
| `account_id` | text | no | FK; TA only |
| `started_session_id` | text | no | new; FK; every confirmation MUST come from this session |
| `old_email_normalized` | text | no | snapshot at start |
| `old_email_revision` | bigint | no | new; account `email_revision` at start |
| `new_email_normalized` | text | no | |
| `new_email_display` | text | no | |
| `current_otp_id` | text | yes | FK |
| `new_otp_id` | text | yes | FK; NULL until the current proof succeeds (D-06) |
| `current_verified_at` | timestamptz | yes | |
| `new_verified_at` | timestamptz | yes | set in the switch transaction |
| `state` | text | no | `started`, `current_verified`, `completed`, `abandoned`, `expired` |
| `end_reason` | text | yes | `cancelled`, `attempts_exhausted`, `expired`, `account_suspended`, `address_unavailable`, `session_revoked` |
| `created_at`, `expires_at`, `finished_at` | timestamptz | no/no/yes | `expires_at = created_at + 30 min` |
| `revision` | bigint | no | |

Guard: `UNIQUE (account_id) WHERE state IN ('started','current_verified')` (`iam_email_changes_open_uq` → `conflict_duplicate` / `email_change_open`). The contract's `new_verified` value is not used: the second proof and the switch are one transaction (CCR-07).

### 2.5 `iam_grants`

| Column | Type | Null | Meaning |
|---|---|---|---|
| `grant_id` | text | no | PK `grt_` |
| `kind` | text | no | `group_read`, `accounting` |
| `grantee_account_id` | text | no | FK; MUST be an operator at creation |
| `group_id` | text | yes | FK `core_groups`; `group_read` only |
| `group_ta_account_id` | text | yes | new; snapshot of the group's TA for display and audit scope |
| `purpose` | text | no | 10–500 chars; named purpose (B10) |
| `valid_from` | timestamptz | no | |
| `valid_until` | timestamptz | yes | required for `group_read`; NULL for `accounting` |
| `granted_by` | text | no | FK SuperAdmin |
| `granted_at` | timestamptz | no | |
| `state` | text | no | `active`, `revoked`, `expired` (`expired` new) |
| `ended_by` | text | yes | FK; NULL for expiry by task |
| `ended_at` | timestamptz | yes | |
| `end_reason` | text | yes | `revoked`, `expired`, `grantee_suspended`, `grantee_elevated` |
| `revision` | bigint | no | |

Constraints: `CHECK (kind <> 'group_read' OR (group_id IS NOT NULL AND valid_until IS NOT NULL AND valid_until > valid_from))`; `CHECK (kind <> 'accounting' OR (group_id IS NULL AND valid_until IS NULL))`; `UNIQUE (grantee_account_id) WHERE kind = 'accounting' AND state = 'active'` (`iam_grants_accounting_uq`); new `UNIQUE (grantee_account_id, group_id) WHERE kind = 'group_read' AND state = 'active'` (`iam_grants_group_read_uq`). Index `(group_id) WHERE state = 'active'`. Validity at use = `state = 'active' AND valid_from <= now AND (valid_until IS NULL OR valid_until > now) AND clock healthy (group_read only)`.

### 2.6 `iam_elevations`

| Column | Type | Null | Meaning |
|---|---|---|---|
| `elevation_id` | text | no | PK `elv_` |
| `target_account_id` | text | no | FK |
| `kind` | text | no | `create_superadmin`, `elevate_operator`, `restore_superadmin` (new) |
| `requested_by` | text | no | FK SuperAdmin |
| `requested_at` | timestamptz | no | |
| `reason` | text | no | 10–1000 chars |
| `expires_at` | timestamptz | no | new; `requested_at + elevation.ttlMs` (72 h) |
| `decided_by` | text | yes | FK |
| `decided_at` | timestamptz | yes | |
| `decision_reason` | text | yes | |
| `state` | text | no | `requested`, `approved`, `declined`, `withdrawn`, `expired` |
| `revision` | bigint | no | |

Constraints: `UNIQUE (target_account_id) WHERE state = 'requested'` (`iam_elevations_open_uq`); `CHECK (state <> 'approved' OR (decided_by IS NOT NULL AND decided_by <> requested_by AND decided_by <> target_account_id))`; `CHECK (requested_by <> target_account_id)`.

### 2.7 `iam_enrolments`

| Column | Type | Null | Meaning |
|---|---|---|---|
| `enrolment_id` | text | no | PK `enr_` |
| `account_id` | text | no | FK staff |
| `token_hmac` | bytea | no | `HMAC(job_credential_key, "enrol/v1" ‖ code)`; UNIQUE |
| `delivery_code_enc` | bytea | yes | new; encrypted code until mailed; wiped after |
| `purpose` | text | no | `activation`, `credential_reset` |
| `issued_by` | text | yes | FK SuperAdmin; NULL for the synthetic seed |
| `issued_at`, `expires_at` | timestamptz | no | `enrolment.ttlMs` = 72 h |
| `opened_at` | timestamptz | yes | new; code accepted, enrolment session created |
| `pending_totp_secret_enc` | bytea | yes | new; seed generated at open; shown only to the enrolling person |
| `pending_key_generation` | integer | yes | new |
| `attempts_used`, `max_attempts` | integer | no | new; TOTP confirmation attempts (5) |
| `state` | text | no | `issued`, `opened`, `consumed`, `expired`, `revoked`, `exhausted` |
| `consumed_at` | timestamptz | yes | |
| `mail_state`, `mail_task_id` | text | no/yes | as in 2.3 |
| `secret_generation` | integer | no | |
| `revision` | bigint | no | |

Guards: `UNIQUE (token_hmac)`; new `UNIQUE (account_id) WHERE state IN ('issued','opened')` (`iam_enrolments_open_uq`). Open and confirm are conditional updates on `state`.

### 2.8 `iam_support_views`

| Column | Type | Null | Meaning |
|---|---|---|---|
| `support_view_id` | text | no | PK `spv_` |
| `superadmin_id` | text | no | FK |
| `session_id` | text | no | new; FK staff session |
| `viewed_account_id` | text | no | FK; role `ta` or `operator` |
| `reason` | text | no | 10–500 chars |
| `started_at`, `expires_at` | timestamptz | no | `supportView.maxMs` = 30 min |
| `ended_at` | timestamptz | yes | |
| `end_reason` | text | yes | `ended`, `expired`, `session_revoked`, `superadmin_suspended` |
| `revision` | bigint | no | |

Guard: `UNIQUE (session_id) WHERE ended_at IS NULL`. `CHECK (superadmin_id <> viewed_account_id)`.

### 2.9 `iam_captcha_spent` and `iam_rate_limits`

| Table | Columns | Guard / notes |
|---|---|---|
| `iam_captcha_spent` | `challenge_hmac bytea` PK (`HMAC(altcha_hmac_key, "spent/v1" ‖ challenge signature)`), `purpose text` (`ta_otp`, `bulk_intake`, `correction_upload`), `spent_at`, `expires_at` | single use: `INSERT … ON CONFLICT DO NOTHING RETURNING` → zero rows ⇒ `bot_check_failed`. `tm_app` DELETE where `expires_at < now`. |
| `iam_rate_limits` | `key varchar(255)` PK, `points integer`, `expire bigint` | `rate-limiter-flexible` PostgreSQL store, `tableCreated: true`, `clearExpiredByTimeout: false` (cleanup task deletes). Keys are `<limiter>:<hex(HMAC(otp_pepper, "rl/v1" ‖ limiter ‖ value))[0:32]>`; never a raw email or IP. |

### 2.10 Vocabulary file

`src/kernel/vocabulary/identity.ts` holds every closed set above (`SESSION_KINDS`, `SESSION_REVOKE_REASONS`, `OTP_PURPOSES`, `OTP_STATES`, `MAIL_STATES`, `EMAIL_CHANGE_STATES`, `GRANT_STATES`, `GRANT_END_REASONS`, `ELEVATION_KINDS`, `ELEVATION_STATES`, `ENROLMENT_PURPOSES`, `ENROLMENT_STATES`, `SUPPORT_VIEW_END_REASONS`, `BOT_CHECK_PURPOSES`, `RATE_LIMITERS`), with zod schemas; T-F05 compares them with the migration `CHECK` lists.

## 3. Commands

### 3.0 Common mechanics

#### 3.0.1 Kernel steps (not repeated per command)

Every command runs through `runCommand` (contract §4.2): parse input → actor kind allowed → content hash → SERIALIZABLE attempt loop → `assertWriter` (admission open, epoch current) → operation-key lookup (same key + same content ⇒ replay re-authorized; different content ⇒ `conflict_operation_key`) → actor re-check (account `active`, role unchanged, session valid, staff MFA verified) → audit-health check if `privilegedElevation` → `authorize` → `handle` → operation record → commit. 40001/40P01 retry the whole command with the same key (max 5). A commit acknowledgement loss returns `outcome_unknown`. "Checks" below list only the module checks inside `authorize`/`handle`, in order.

Lock order in Identity handlers: `sys_installation` (share, kernel) → actor `iam_accounts` (share, kernel) → target `iam_accounts` rows `FOR UPDATE` in ascending `account_id` → the command's own `iam_` rows. A self-targeting command (email switch, sign-out) upgrades the actor row to `FOR UPDATE`; a resulting deadlock is retried as 40P01.

Reason fields: 10–1000 characters, NFC, no control characters; stored in the fact `reason` column. Reasons are business evidence, excluded from diagnostics.

#### 3.0.2 `privilegedElevation` classification (B33)

| Class | Commands | While the audit projection is degraded |
|---|---|---|
| Privileged elevation (`privilegedElevation: true`) | `iam.create_account`, `iam.approve_account`, `iam.activate_account`, `iam.restore_account`, `iam.reset_credentials`, `iam.request_elevation`, `iam.approve_elevation`, `iam.create_group_read_grant`, `iam.set_accounting_grant`, `iam.start_support_view` | refused: `unavailable_dependency` / `audit_degraded`; nothing written |
| Containment and self-service (`privilegedElevation: false`) | `iam.suspend_account`, `iam.revoke_grant`, `iam.decline_account`, `iam.decline_elevation`, `iam.end_support_view`, `iam.sign_out`, all sign-in and enrolment commands, email change commands | available |

`iam.start_support_view` is classed as elevation because it is a privileged read mode whose start must be reviewable; it grants no wider scope than the SuperAdmin already holds. Staff sign-in stays available so that a SuperAdmin can reach containment actions (B33).

#### 3.0.3 Email normalization and validation

`normalizeEmail(raw)`: trim; NFC; reject control characters and whitespace; split at the last `@`; local part 1–64 chars from `[A-Za-z0-9.!#$%&'*+/=?^_\`{|}~-]`, lowercased; domain via `node:url` `domainToASCII`, lowercased, at least one dot, labels 1–63 chars; total ≤ 254. No provider-specific folding (no dot removal, no `+` stripping). In `production`, `@synthetic.test` is refused (`validation_failed` / `synthetic_email_refused`). Field errors carry codes only; the value is never echoed in logs.

#### 3.0.4 Cryptographic primitives (`src/modules/identity/crypto.ts`)

| Item | Construction |
|---|---|
| OTP code | `crypto.randomInt(0, 10**8)` zero-padded to 8 digits (CCR-01) |
| OTP verifier | `HMAC-SHA-256(otp_pepper, "otp/v1" ‖ otp_id ‖ code)`; compare with `timingSafeEqual` |
| Contact / binding HMAC | `HMAC-SHA-256(otp_pepper, "contact/v1" ‖ email_normalized)`; `HMAC-SHA-256(otp_pepper, "bind/v1" ‖ value)` |
| Delivery encryption | AES-256-GCM, key `HKDF-SHA-256(otp_pepper, salt = "tm", info = "otp-delivery/v1")` (enrolment: `job_credential_key`, `"enrol-delivery/v1"`), random 12-byte IV, AAD = owning row id |
| Session token | 32 random bytes base64url; DB stores `HMAC(session_key, token)` |
| Enrolment code | 32 random bytes base64url (43 chars, pasted); DB stores `HMAC(job_credential_key, "enrol/v1" ‖ code)` |
| TOTP | RFC 6238: HMAC-SHA-1, 30 s step, 6 digits, 20-byte seed from `crypto.randomBytes`; accept steps `t−1, t, t+1` only if `step > totp_last_step`; seed wrapped AES-256-GCM under `totp_wrap_key` |
| Decoy work | the decoy path computes the same HMACs and inserts the same row shape |

All secret-derived rows store `secret_generation`. After a restore with new secrets every session, OTP, enrolment code and pre-session is unusable (B40). TOTP seeds are re-wrapped by `tm restore` (contract OD-04).

#### 3.0.5 Pre-session (anonymous attempt identity)

Cookie `__Host-tm_pre`: `base64url(nonce16 ‖ issuedAtSeconds8) "." base64url(HMAC(session_key, "pre/v1" ‖ payload)[0:16])`; `HttpOnly; Secure; SameSite=Lax; Path=/`; valid 30 min from `issuedAt` (CCR-08; contract said 10 min, which is shorter than OTP validity plus typing time). GET of a sign-in page issues a new pre-session when it is absent, invalid or older than 15 min. Anonymous `actor_key` = `pre:` + hex(`HMAC(session_key, "prekey/v1" ‖ nonce)`)[0:32]. Successful sign-in clears it.

### 3.1 `iam.request_ta_otp`

| Item | Specification |
|---|---|
| Actor / authorization | `anonymous` with a valid pre-session; action `auth.ta_otp_request`; resource `public`. A request with a valid session cookie is redirected to `/home` before the command. |
| Input | `{ email: string ≤ 320, altcha: string ≤ 4096 }` |
| Route-level controls (before the command, Section 4.1, in this order) | origin/host/CSRF; limiter `otp_issue_ip` (20 / 15 min per IPv4 address or IPv6 /64); `captcha.verifyPayload` (pure: signature, expiry 5 min, `data.p = 'ta_otp'`, `data.b` = pre-session binding) plus a non-locking read that the challenge is not in `iam_captcha_spent` ⇒ else `bot_check_failed`; email normalization ⇒ else `validation_failed` / `email_invalid` (format only); limiter `otp_issue_contact` (3 / 15 min per contact HMAC); limiter `otp_issue_global` (600 / 15 min). |
| Checks in the transaction | 1. `identity.consumeBotCheck(tx, { payload: altcha, purpose: 'ta_otp', binding })`: re-verifies the payload and spends it (single use) ⇒ else `bot_check_failed`. A concurrent reuse can consume one extra contact-limiter point before it fails here; the bound stays 3 codes per contact. 2. Look up account by `email_normalized` `FOR SHARE`. Eligible = role `ta` AND status `active`. 3. Supersede: `UPDATE iam_otp_challenges SET state='superseded', delivery_code_enc=NULL, revision=revision+1 WHERE purpose='ta_sign_in' AND attempt_binding_hmac=$b AND state='issued'`. |
| Writes | One `iam_otp_challenges` row: eligible ⇒ `account_id`, encrypted code, `mail_state='queued'`; not eligible ⇒ decoy (`account_id NULL`, random verifier, no code, `mail_state='none'`). |
| Facts | `iam.otp_issued` (subject `otp_challenge`; scope `taAccountId` only when eligible; `after: { purpose, decoy }`; no email, no code). |
| Tasks | Eligible only: `iam.send_mail` dedupe `iam.send_mail:<otp_id>`, payload `{ kind: 'otp', otpId }`, `onBehalfOf` = account. |
| Result | `{ resource: public, summary: { result: 'issued' } }` for both paths. Response: 303 to `/sign-in/verify`. |
| Errors | `bot_check_failed` (422), `validation_failed` (422), `rate_limited` (429), `capacity_limited` (503, global limiter), `maintenance`. All rendered on the same page template; no message differs by account existence. |
| Idempotency / concurrency | Same key + same content ⇒ replay (`issued`), no second mail (task dedupe). Same key + different email ⇒ `conflict_operation_key`. Nth request with new keys ⇒ each supersedes the previous challenge of this pre-session; contact limiter bounds mail. Two concurrent requests of one pre-session: one inserts; the other hits `iam_otp_issued_binding_uq` or 40001, retries, supersedes and inserts; final state has one `issued` row. Lost acknowledgement ⇒ user resubmits; either replay or a new superseding challenge; never two valid codes for one pre-session. Account suspended concurrently: suspension supersedes open challenges (3.13), so the code is unusable either way. |

### 3.2 `iam.verify_ta_otp`

| Item | Specification |
|---|---|
| Actor / authorization | `anonymous` with valid pre-session; `auth.ta_otp_verify`; resource `public`. |
| Input | `{ code: /^[0-9]{8}$/ }` (spaces and hyphens stripped before parsing) |
| Route-level controls | origin/host/CSRF; limiters `otp_verify_ip` (30 / 15 min) and `otp_verify_binding` (10 / 15 min per pre-session). |
| Checks | 1. Select the challenge `WHERE purpose='ta_sign_in' AND attempt_binding_hmac=$b AND state='issued' FOR UPDATE`. None ⇒ reject `validation_failed` / `otp_invalid_or_expired` (nothing to count; nothing written). 2. `secret_generation` current; else treat as invalid. 3. If `tx.now >= expires_at` ⇒ set `state='expired'`, wipe code, fact `iam.otp_attempt_failed {cause:'expired'}`, result `invalid`. 4. Compute verifier (also for decoys). 5. Mismatch, or decoy, or account no longer `active` TA, or `contact_hmac` ≠ HMAC of the account's current email ⇒ `attempts_used+1`; if `attempts_used = max_attempts` ⇒ `state='exhausted'`; fact `iam.otp_attempt_failed`; result `invalid`. 6. Match ⇒ conditional `UPDATE … SET state='consumed' WHERE otp_id=$id AND state='issued' AND attempts_used < max_attempts AND expires_at > $now` + `requireAffected`. |
| Writes on success | consume challenge; insert `iam_sessions` (`kind='ta'`, idle 30 min, absolute 12 h); if the account has ≥ `session.maxActivePerAccount` (10) open sessions, revoke the oldest with `superseded`. |
| Facts | success: `iam.session_started` (subject session, scope `taAccountId`); failure: `iam.otp_attempt_failed` (`after: { attemptsUsed, cause }`; cause ∈ `mismatch`, `expired`, `decoy_or_ineligible` — visible only in the SuperAdmin audit). |
| Result | `{ result: 'signed_in' \| 'invalid' }`. On `signed_in` the route sets `__Host-tm_sess` to the plaintext token held only in memory, clears the pre-session, and 303s to `/home`. On `invalid` it renders 422 "The code is invalid or has expired. Request a new code." |
| Idempotency / concurrency | Same key + same code ⇒ replay; no attempt counted twice. Replay of `signed_in` cannot re-deliver the token (only its HMAC exists): page "Sign-in could not be completed in this browser. Request a new code." The undelivered session is unusable and expires at idle timeout. Concurrent correct submissions ⇒ the conditional update admits exactly one; the other retries after 40001 and finds no `issued` row ⇒ `otp_invalid_or_expired`. Clock moved backward ⇒ expiry extends by at most the jump; `attempts_used` still bounds guesses (contract §4.9). |

### 3.3 `iam.request_staff_otp` (new command name, CCR-10)

Same as 3.1 with: action `auth.staff_sign_in`; purpose `staff_sign_in`; no CAPTCHA (staff pages keep `script-src 'none'`); limiters `otp_issue_ip`, `otp_issue_contact`, `otp_issue_global`; eligible = role ∈ {`operator`, `superadmin`} AND status `active` AND `mfa_enrolled_at IS NOT NULL`. An active staff account without MFA receives a decoy; the page links to `/staff/enrol`. Mail purpose `staff_sign_in_otp`.

### 3.4 `iam.staff_sign_in`

| Item | Specification |
|---|---|
| Actor / authorization | `anonymous` with valid pre-session; `auth.staff_sign_in`. |
| Input | `{ code: 8 digits, totp: /^[0-9]{6}$/ }` |
| Route-level controls | as 3.2. |
| Checks | 1–3 as 3.2 with purpose `staff_sign_in`. 4. Lock account `FOR UPDATE` (only when not decoy). 5. Evaluate OTP. 6. If the TOTP window is exhausted (`totp_fail_count ≥ 10` and `now < totp_fail_window_start + 24 h`) ⇒ result `invalid`, cause `totp_locked` (the check runs only after a correct OTP, so it discloses nothing to a non-holder of the mailbox). 7. Evaluate TOTP: decrypt seed, test steps `t−1…t+1` with `step > totp_last_step`. 8. Both correct ⇒ success; else failure. |
| Writes | Failure: challenge `attempts_used+1` (exhaust at 5); if OTP correct and TOTP wrong: `totp_fail_count+1` (window reset when expired). Success: consume challenge (conditional, as 3.2); `UPDATE iam_accounts SET totp_last_step=$step, totp_fail_count=0 WHERE account_id=$a AND (totp_last_step IS NULL OR totp_last_step < $step)` + `requireAffected` (TOTP replay guard under concurrency); session `kind='staff'`, `mfa_verified_at=now`, idle 15 min, absolute 8 h. |
| Facts | `iam.session_started` or `iam.otp_attempt_failed` (`after: { factor: 'otp' \| 'totp' \| 'both', attemptsUsed }`). |
| Errors / idempotency / concurrency | As 3.2. A TOTP code accepted once cannot be accepted again (step guard), including by a concurrent request with the same code. |

### 3.5 `iam.open_enrolment` (new command name, CCR-10)

| Item | Specification |
|---|---|
| Actor / authorization | `anonymous` with valid pre-session; `auth.staff_enrol`. |
| Input | `{ enrolmentCode: base64url 43 chars }` |
| Route-level controls | origin/host/CSRF; limiter `enrol_open_ip` (10 / 15 min). |
| Checks | 1. Lookup by `token_hmac` `FOR UPDATE`; none, wrong generation, `state ∉ {issued}` or `now ≥ expires_at` ⇒ reject `validation_failed` / `enrolment_invalid_or_expired`. 2. Account `active`, role ∈ {operator, superadmin}; else same rejection. |
| Writes | Enrolment `state='opened'`, `opened_at`, `pending_totp_secret_enc` (new random seed), `pending_key_generation`; session `kind='enrolment'`, absolute 15 min, idle 15 min, `mfa_verified_at NULL`. |
| Facts | `iam.enrolment_opened` (CCR-05). |
| Result | 303 `/staff/enrol/setup`. The setup page (enrolment session only) shows the `otpauth://` QR SVG and the base32 seed once per page load; `Cache-Control: no-store`. |
| Idempotency / concurrency | Same key replay ⇒ `opened` summary; the token is not re-delivered (as 3.2). Concurrent opens ⇒ conditional `state='issued'` admits one. The SuperAdmin who issued the enrolment never receives the code or seed (B11). |

### 3.6 `iam.staff_enrol`

| Item | Specification |
|---|---|
| Actor / authorization | `account` actor holding an `enrolment` session; `auth.staff_enrol`; resource `self`. The kernel actor re-check accepts an enrolment session only for this command and `iam.sign_out` (CCR-11). |
| Input | `{ totp: 6 digits }`, `_rev` = enrolment revision |
| Checks | 1. Enrolment `FOR UPDATE`, `state='opened'`, not expired, `attempts_used < max_attempts`, belongs to the session. 2. Account `FOR UPDATE`, `active`, staff. 3. Verify TOTP against the pending seed (steps `t−1…t+1`). |
| Writes | Failure: `attempts_used+1` (state `exhausted` at 5; session revoked `enrolment_done`); result `invalid`. Success: account `totp_secret_enc`, `totp_key_generation`, `mfa_enrolled_at`, `totp_last_step`, `totp_fail_count=0`, revision+1; enrolment `consumed`, pending seed wiped; enrolment session revoked (`enrolment_done`). |
| Facts | `iam.mfa_enrolled` (subject account; `after: { mfaEnrolled: true, purpose }`) or `iam.enrolment_attempt_failed`. |
| Result | Success ⇒ 303 `/staff/sign-in` with "Enrolment complete. Sign in." The person signs in through the full two-factor path (proves the enrolled device works). |
| Idempotency / concurrency | Replay safe. Concurrent confirms ⇒ conditional `state='opened'` admits one. Credential reset or suspension during enrolment revokes the enrolment (`revoked`) and the session ⇒ next request `unauthenticated`. |

### 3.7 `iam.sign_out`

| Item | Specification |
|---|---|
| Actor / authorization | any `account` actor (any session kind); `auth.sign_out`; resource `self`. Also allowed for a SuperAdmin in support view (ends the support view first, same transaction). |
| Input | `{ scope: 'this' \| 'all' }` |
| Writes | `this`: revoke the current session (`sign_out`); `all`: revoke every open session of the account (`sign_out_all`). Open support view on a revoked session ⇒ ended (`session_revoked`). |
| Facts | `iam.session_revoked` per session (`after: { reason }`); `iam.support_view_ended` when applicable. |
| Idempotency / concurrency | Replay ⇒ same summary. A concurrent request on the revoked session fails its kernel actor re-check ⇒ `unauthenticated`. The route clears the cookie even when the command fails with `unauthenticated`. |

### 3.8 `iam.start_email_change` (B09)

| Item | Specification |
|---|---|
| Actor / authorization | `account`, role `ta`, `kind='ta'` session; `self.email_change_start`; resource `self`. SuperAdmin, operator and support view ⇒ `not_found_or_forbidden` (B09 "SuperAdmin cannot overwrite"). |
| Input | `{ newEmail: string }`, `_rev` = account revision |
| Route-level controls | limiter `email_change_start_account` (3 / hour). |
| Checks | 1. Account `FOR UPDATE`, revision = `_rev`. 2. Normalize; `new = current` ⇒ `validation_failed` / `email_unchanged`. 3. Open change exists ⇒ `conflict_duplicate` / `email_change_open` (existing resource ref = own change). 4. No uniqueness check here (non-disclosure; see 3.9 step 6). |
| Writes | `iam_email_changes` (`started`, `started_session_id`, snapshots, `expires_at = now + 30 min`); OTP challenge purpose `email_change_current`, `contact_hmac` of the current email, binding `HMAC("bind/v1" ‖ session_id ‖ email_change_id)`, encrypted code. Sign-in address and recipient unchanged. |
| Facts | `iam.email_change_started` (`after: { newEmail }`), `iam.otp_issued`. |
| Tasks | `iam.send_mail` (`kind: 'otp'`, purpose mail `email_change_current_otp`, recipient = current address). |
| Idempotency / concurrency | Replay ⇒ same change id; one mail. Two concurrent starts ⇒ `iam_email_changes_open_uq` admits one; other `conflict_duplicate`. |

### 3.9 `iam.confirm_email_change` (B09)

| Item | Specification |
|---|---|
| Actor / authorization | TA, `self.email_change_confirm`, resource `self`; the session MUST equal `started_session_id` (else `not_found_or_forbidden`). |
| Input | `{ emailChangeId, proof: 'current' \| 'new', code: 8 digits }`, `_rev` = change revision |
| Checks (both proofs) | 1. Change `FOR UPDATE`; state `started` for `current`, `current_verified` for `new`; else `stale_revision`. 2. `now < expires_at` else state `expired` (+ fact `iam.email_change_abandoned {expired}`), result `invalid`. 3. Challenge for the proof `FOR UPDATE`, `state='issued'`, not expired, attempts left. 4. Verifier compare. Failure ⇒ attempts+1; on exhaustion the challenge is `exhausted` and the change `abandoned` (`attempts_exhausted`) with fact; result `invalid`. |
| Success `current` | Challenge consumed; change `current_verified`, `current_verified_at`; new OTP purpose `email_change_new`, contact = new address, same binding; task `iam.send_mail` to the new address. Facts `iam.email_change_current_verified`, `iam.otp_issued`. |
| Success `new` | 5. Account `FOR UPDATE`; `status='active'`; `email_revision = old_email_revision` (else change `abandoned`, `stale_revision`). 6. New address in use by another non-declined account ⇒ change `abandoned` (`address_unavailable`), result `invalid_address` shown as "This address cannot be used" (disclosed only to the person who just proved control of that mailbox). 7. Switch in one transaction: `email_normalized`, `email_display`, `email_revision+1`, `revision+1`; change `completed`, `new_verified_at`; revoke all sessions of the account (`email_changed`), including the current one; supersede every `issued` challenge of the account. |
| Facts (switch) | `iam.email_change_completed` (`before: { email: old }`, `after: { email: new, emailRevision }`), `iam.session_revoked` per session. |
| Result | `completed` ⇒ cookie cleared, 303 `/sign-in` with "Your address changed. Sign in with the new address." |
| Effects on others | Document recipient = `identity.getRecipient` (current email + `email_revision`), so sign-in and recipient switch together. Delivery MUST re-read the recipient at send time and deny a queued send whose snapshot revision differs (CCR-12). |
| Idempotency / concurrency | Replay safe. Uniqueness race with another account taking the address ⇒ `iam_accounts_email_uq` → 23505 → guard maps to `email_change_address_unavailable`; nothing switches. Suspension concurrently ⇒ either suspension first (change `abandoned` by 3.13, confirm denied) or switch first (then suspension revokes the new state). |

### 3.10 `iam.cancel_email_change` (new, CCR-10)

TA owner, same session or any TA session of the account; input `{ emailChangeId }`, `_rev`. Open change ⇒ `abandoned` (`cancelled`), its issued challenges `superseded`, codes wiped. Fact `iam.email_change_abandoned`. Replay safe.

### 3.11 `iam.create_account` (B11)

| Item | Specification |
|---|---|
| Actor / authorization | SuperAdmin; `account.create`; resource `account` (new); reason required; `privilegedElevation`. |
| Input | `{ role, email, displayName, reason }` |
| Checks | 1. Normalize email; `production` refuses `@synthetic.test`. 2. `role='superadmin'` ⇒ `countActiveSuperAdmins(tx) ≥ 2` is NOT required at creation; approval needs a distinct second SuperAdmin (3.17). 3. Email unique (guard). |
| Writes | Account `pending_approval`, `created_by` = actor. For `superadmin`: also `iam_elevations` (`create_superadmin`, `requested`, `expires_at`). |
| Facts | `iam.account_created` (`after: { role, email, displayName, status }`); for SuperAdmin also `iam.elevation_requested`. |
| Errors | `conflict_duplicate` / `email_in_use` (SuperAdmin may see existence; it is their own admin scope), `validation_failed`, `unavailable_dependency` / `audit_degraded`. |
| Idempotency / concurrency | Replay ⇒ same account id. Two SuperAdmins create the same email concurrently ⇒ unique index admits one. A new key cannot bypass the email guard. |

Approval page states: "No account-eligibility or fraud criteria are configured (`unselected_account_eligibility`). Approval records your judgement and reason." (B08, B44).

### 3.12 `iam.approve_account`, `iam.decline_account`, `iam.activate_account`

| Command | Action / class | From → To | Checks | Writes / facts / tasks |
|---|---|---|---|---|
| `iam.approve_account` | `account.approve`; elevation | `pending_approval → approved` | target `FOR UPDATE`, revision; target role ≠ `superadmin` (SuperAdmin approval is `iam.approve_elevation`: `second_superadmin_required`) | status, `status_changed_at`; `iam.account_approved` |
| `iam.decline_account` | `account.decline`; containment | `pending_approval → declined` | revision; for SuperAdmin target the open elevation becomes `declined` too | status; `iam.account_declined` (+ `iam.elevation_declined`); email freed (partial index) |
| `iam.activate_account` | `account.activate`; elevation | `approved → active` | revision; staff: open enrolment absent (guard) | status; staff: `iam_enrolments` (`activation`, encrypted code), task `iam.send_mail {kind:'enrolment'}`; facts `iam.account_activated`, `iam.enrolment_issued` |

All need reason. Same actor MAY create, approve and activate a TA or operator (B11 names no second approver for these). Concurrent approve vs decline ⇒ revision admits one; the other `stale_revision`. Replay safe. The activating SuperAdmin never sees the enrolment code: the page shows "Enrolment code sent to the account's address" and the mail state only.

### 3.13 `iam.suspend_account` (B11; emergency containment)

| Item | Specification |
|---|---|
| Actor / authorization | SuperAdmin; `account.suspend`; unilateral; reason required; NOT `privilegedElevation` (available during audit outage, B33). |
| Input | `{ accountId, reason, acknowledgeLastSuperAdmin?: boolean }`, `_rev` |
| Checks | 1. Target `FOR UPDATE`, revision; status ∈ {`active`, `approved`, `pending_approval`} else `stale_revision`. 2. If target is an active SuperAdmin and `countActiveSuperAdmins = 1` (target is the last, including self-suspension) ⇒ requires `acknowledgeLastSuperAdmin = true`, else `validation_failed` / `last_superadmin_ack_required`. The form shows: "After this, no active SuperAdmin exists. Recovery is unavailable (`parked_first_admin`)." (OD-I1). |
| Writes (one transaction, D-07) | status `suspended`; revoke all sessions (`suspended`); supersede issued OTP challenges; open email change ⇒ `abandoned` (`account_suspended`); open enrolment ⇒ `revoked`; active grants of the target ⇒ `revoked` (`grantee_suspended`); open support views of the target (as SuperAdmin) ⇒ ended (`superadmin_suspended`); open elevation with target = this account ⇒ `declined`. |
| Facts | `iam.account_suspended` (`before/after: status`), `iam.session_revoked`×n, `iam.grant_revoked`×n, `iam.email_change_abandoned`, `iam.support_view_ended`, `iam.elevation_declined` as applicable. |
| Not done here | Assignments stay `active`; Core shows the duty as SuperAdmin-owned (`assigned_operator_inactive`) until audited reassignment through `core.reassign` (B11). TA applications are preserved; intake tasks on behalf of the TA cancel at their next prepare (`cancelled_revoked`). |
| Idempotency / concurrency | Replay safe. Two SuperAdmins suspend each other concurrently: lock order (actor share, target update) deadlocks; 40P01 retry; the first commit wins; the second actor fails the kernel actor re-check (`unauthenticated`); exactly one suspension. Any command of the target that took its account share lock first commits before the suspension; every later command is denied. |

### 3.14 `iam.restore_account`

| Item | Specification |
|---|---|
| Actor / authorization | SuperAdmin; `account.restore`; reason; `privilegedElevation`. |
| Checks | Target `FOR UPDATE`, `suspended`, revision. |
| TA / operator target | status `active`. Staff without MFA (credentials were reset) ⇒ issue enrolment (`credential_reset`) + mail task. Grants are not restored. Facts `iam.account_restored` (+ `iam.enrolment_issued`). |
| SuperAdmin target | No status change. Insert `iam_elevations` (`restore_superadmin`, `requested`). Fact `iam.elevation_requested`. Restoration happens at approval by a distinct SuperAdmin (3.19; D-08, OD-I2). |
| Concurrency | Concurrent restore requests ⇒ `iam_elevations_open_uq` / revision admits one. |

### 3.15 `iam.reset_credentials` (credential recovery, B11)

| Item | Specification |
|---|---|
| Actor / authorization | SuperAdmin; `account.reset_credentials`; reason; `privilegedElevation`; target ≠ actor (`self_action_not_allowed`: a SuperAdmin who can sign in does not need a reset). |
| Checks | Target staff (TA ⇒ `unavailable_parked` / `parked_lost_mailbox_recovery` with page text "A TA has no stored credential. Sign-in uses the current address. Lost-mailbox recovery is unavailable."). Status ∈ {`active`, `suspended`}. |
| Writes | Clear `totp_secret_enc`, `totp_key_generation`, `mfa_enrolled_at`, `totp_last_step`, `totp_fail_*`; revoke all sessions (`credentials_reset`); revoke open enrolment; supersede issued challenges. If `active`: issue enrolment (`credential_reset`) + mail task. If `suspended`: enrolment is issued at restoration (3.14). |
| Facts | `iam.credentials_reset` (`after: { mfaEnrolled: false }`), `iam.session_revoked`×n, `iam.enrolment_issued`. |
| Admin visibility | The SuperAdmin sees only "Enrolment code sent; mail state = …". Neither the code nor any TOTP seed appears in any page, fact, task payload or log (B11). The admin cannot choose the code or the seed. |

### 3.16 `iam.request_elevation`

Actor SuperAdmin A; `account.elevation_request`; reason; `privilegedElevation`. Input `{ targetAccountId, kind: 'elevate_operator' }` (`create_superadmin` comes from 3.11, `restore_superadmin` from 3.14). Checks: target `FOR UPDATE`, role `operator`, status `active`, MFA enrolled; `operatorDuties(target)` (Core) all zero and `incidentsOwnedBy(target)` (Operations) zero, else `control_blocked` / `elevation_target_has_duties` with counts (a SuperAdmin cannot judge readiness or file, B18). Writes elevation `requested`, `expires_at`. Fact `iam.elevation_requested`. Concurrency: open-elevation unique index.

### 3.17 `iam.approve_elevation` (second distinct SuperAdmin, B11)

| Item | Specification |
|---|---|
| Actor / authorization | SuperAdmin B; `account.elevation_approve`; reason; `privilegedElevation`. |
| Checks | 1. Elevation `FOR UPDATE`, `requested`, revision, `now < expires_at` (else `expired` + fact `iam.elevation_expired`, `control_blocked` / `elevation_expired`). 2. B ≠ `requested_by` and B ≠ target ⇒ else `control_blocked` / `second_superadmin_required` (also enforced by `CHECK`). 3. Requester A `FOR SHARE`: still `active` SuperAdmin ⇒ else `elevation_requester_inactive`. 4. Target `FOR UPDATE` in the expected state: `create_superadmin` ⇒ `pending_approval`; `elevate_operator` ⇒ `active` operator, duties still zero (re-checked); `restore_superadmin` ⇒ `suspended`. |
| Writes | `create_superadmin`: target `approved` (activation follows, 3.12). `elevate_operator`: role `superadmin`, revoke all target sessions (`role_changed`), revoke its accounting and group read grants (`grantee_elevated`). `restore_superadmin`: target `active`; no MFA ⇒ enrolment issued. Elevation `approved`, `decided_by`, `decided_at`. |
| Facts | `iam.elevation_approved` (`before/after` of role or status), plus `iam.account_approved` / `iam.account_restored` / `iam.session_revoked` / `iam.grant_revoked` as applicable. |
| Idempotency / concurrency | Two approvers concurrently ⇒ conditional `state='requested'` admits one. Requester suspended concurrently ⇒ step 3 share lock serializes; the approval fails if the suspension committed first. No path exists for an installation with fewer than two active SuperAdmins: the request stays `requested` until it expires (no bypass, B11, B44). |

### 3.18 `iam.decline_elevation` (new, CCR-10)

Any SuperAdmin (the requester ⇒ `withdrawn`; another ⇒ `declined`); reason; containment class. Elevation `requested` ⇒ `declined`/`withdrawn`; for `create_superadmin` the target account ⇒ `declined`. Facts `iam.elevation_declined` (+ `iam.account_declined`).

### 3.19 `iam.create_group_read_grant` (B10)

| Item | Specification |
|---|---|
| Actor / authorization | SuperAdmin; `grant.group_read_create`; reason (= purpose); `privilegedElevation`. |
| Input | `{ granteeAccountId, groupId, purpose (10–500), validUntil (ISO instant) }` |
| Checks | 1. Grantee `FOR UPDATE`: role `operator`, `active`, MFA enrolled ⇒ else `validation_failed` / `grantee_not_operator`. 2. Group exists (`core.relations.group`) ⇒ else `not_found_or_forbidden`. 3. `validUntil > now` and `validUntil − now ≤ grants.groupReadMaxMs` (14 days) ⇒ else `grant_duration_exceeded`. 4. Active grants of the grantee < `grants.groupReadMaxActive` (5) ⇒ else `control_blocked` / `grant_limit_reached` ("rare", B10). 5. Clock health ok ⇒ else `unavailable_dependency` / `clock_degraded`. 6. An `active` row for the same grantee and group whose `valid_until ≤ now` is first set `expired` (fact `iam.grant_expired`); an unexpired one ⇒ `conflict_duplicate` / `grant_exists`. |
| Writes / facts | Grant `active`, `group_ta_account_id` snapshot; fact `iam.grant_created` (scope `groupId`, `taAccountId`). |
| Effect | Read-only access to that group's header, its applications' metadata and document bytes through the release check (contract I-06). No command, no other group, no cross-TA access (B10). |

### 3.20 `iam.revoke_grant`

SuperAdmin; `grant.group_read_revoke` or `grant.accounting_revoke`; reason; containment class. Grant `FOR UPDATE`, `state='active'`, revision ⇒ `revoked`. Fact `iam.grant_revoked`. Effect is immediate on the next request, download check, task prepare and operation-result lookup (contract §5.5).

### 3.21 `iam.set_accounting_grant` (B29)

SuperAdmin; `grant.accounting_set`; reason; `privilegedElevation`. Grantee `FOR UPDATE`, role `operator`, `active`. Unique active accounting grant (guard `iam_grants_accounting_uq` ⇒ `conflict_duplicate` / `grant_exists`). Writes grant (`accounting`, no expiry). Fact `iam.grant_created`. Effect: the grantee may open `/accounts`, which shows only PARKED boundaries; no case access, no payment mutation (B29, B43).

### 3.22 `iam.start_support_view` and `iam.end_support_view` (B10)

| Item | Specification |
|---|---|
| Start | SuperAdmin (`kind='staff'` session, no open support view); `support_view.use`; reason; `privilegedElevation`. Input `{ viewedAccountId, reason }`. Checks: target role ∈ {`ta`, `operator`} (else `support_view_target_not_eligible`; SuperAdmin scope is already total); target ≠ actor; clock healthy. Writes `iam_support_views` (`expires_at = now + 30 min`), session `support_view_id`. Fact `iam.support_view_started` (scope `taAccountId` when TA). 303 to the viewed surface home (`/ta` or `/ops`). |
| End | Same SuperAdmin session; `support_view.use`; containment class. Writes `ended_at`, `end_reason='ended'`, session `support_view_id = NULL`. Fact `iam.support_view_ended`. Also ended by sign-out, suspension and the expiry task. |
| Read mode | Section 4.2.3. No fact is appended per page view: the view is never wider than the SuperAdmin's own read scope; start/end with reason are the audit. |

### 3.23 `iam.seed_synthetic` (B37; engineering CLI `tm seed synthetic --actor <label>`)

| Item | Specification |
|---|---|
| Actor | rev 2 (record 11 CCR-13 accepted with edit): actor kind `harness` (contract 01 §2.24) with label from `--actor`; command name `harness.iam.seed_synthetic`; registered only when `env ∈ {test, local_test}`; `production` refuses at startup and the CLI exits non-zero (`synthetic_seed_refused`). |
| Checks | 1. Zero accounts with `synthetic = false` exist (a real installation can never be seeded). 2. Zero accounts exist with the fixture emails. |
| Writes | Fixed fixture set: 2 SuperAdmins, 3 operators, 3 TAs; emails `syn-<role>-<n>@synthetic.test`; names prefixed `SYN`; `synthetic = true`; status `active`; staff get `activation` enrolments delivered to the synthetic mailbox. No TOTP seeds are generated by the seed; enrolment uses the product path. |
| Facts | `iam.account_created`, `iam.account_activated`, `iam.enrolment_issued`, actor kind `harness`, reason "synthetic local-test identity fixture". |
| Boundary | Grants no product first-admin or all-admin-loss exception (B37, B44): `production` server startup refuses when any `synthetic = true` account exists (`synthetic_accounts_present`), and `iam.create_account` refuses `@synthetic.test` in `production`. |
| Idempotency | Re-run ⇒ check 2 refuses; nothing written. |

CCR-13 (accepted with edit in contract revision 2) lets the `harness` actor kind — not the engineering actor — write these Identity facts in test/local_test only.

## 4. Queries, pages and routes

### 4.1 Request pipeline (web shell, `src/web/shell.ts`)

Every request passes these steps in order. A step failure ends the request; no command runs.

| # | Step | Rule | Failure |
|---|---|---|---|
| 1 | Route match | Route registry (`src/web/routes.ts`) built from Section 4.4; each route declares `routeId`, method, surface, `Action`, resource resolver, body limit, bot/rate controls, `supportViewReadable`. Unknown path ⇒ the one 404 page. | 404 |
| 2 | Host check | `Host` MUST be in `http.allowedHosts` (new config, CCR-15; default `127.0.0.1:4610`, `localhost:4610`). Defends against DNS rebinding of the loopback server. | 421 plain page |
| 3 | Admission | Public static routes, `/assets/*`, `/healthz` always serve. All other routes serve the maintenance page (503, `maintenance`) while `sys_installation.admission = 'closed'` (cached ≤ 2 s from `watchInstallation`; commands re-check in their transaction). | 503 |
| 4 | Security headers | Contract §12.4 via `@fastify/helmet`; `script-src 'self'` only on routes flagged `altcha`; `Cache-Control: no-store` and `noindex` on every non-public route. | — |
| 5 | Session resolve | Read `__Host-tm_sess`; `HMAC(session_key, token)`; one read transaction joins session + account. Valid ⇔ not revoked, `now < idle_expires_at`, `now < absolute_expires_at`, `secret_generation` current, account `active`, staff ⇒ `mfa_verified_at` set and account MFA enrolled, `kind` matches the surface (enrolment session ⇒ enrolment routes and sign-out only). Builds `Actor` (`account` or `support_view`). | `unauthenticated`: pages 303 to the right sign-in page; POST 401 page |
| 6 | Session touch | If valid and `last_seen_at < now − 60 s`: separate READ COMMITTED transaction `UPDATE iam_sessions SET last_seen_at=$now, idle_expires_at=$now+idle WHERE session_id=$id AND revoked_at IS NULL` (technical, no fact; CCR-11). | ignored |
| 7 | Surface gate | Surface prefix ⇒ required actor: `/ta` TA; `/ops` operator; `/accounts` operator with accounting grant or SuperAdmin; `/admin` SuperAdmin not in support view; support view ⇒ only `GET` on the viewed account's surface and `POST /admin/support-view/end`, `POST /sign-out`. Mismatch ⇒ the 404 page (no surface disclosure). | 404 |
| 8 | Unsafe-method checks (POST only) | `Origin` equals a configured origin, else `Referer` origin equals one, else refuse; CSRF synchronizer token `HMAC(csrf_key, session_id ‖ routeFormId)` (anonymous: pre-session nonce) compared in constant time; `_op` present and well-formed. Multipart: `_csrf`, `_op` and `altcha` fields MUST precede every file part; a file part before a validated CSRF token aborts the stream before any byte is staged. | 403 page, no command, no staged bytes |
| 9 | Bot and rate controls | In the order declared by the route (Section 4.1.1). Limiters consumed only after earlier steps pass. | `rate_limited` 429, `capacity_limited` 503 |
| 10 | Body parse | Per-route limit; `@fastify/formbody` / `@fastify/multipart` with `limits.files`, `limits.fileSize`, `limits.fields`, `limits.parts`; uploads stream into `blobs.createIntent` + `writeStaged` only after steps 8–9. | 413 / 422 |
| 11 | Handler | GET: `REPEATABLE READ READ ONLY` transaction; `policy.authorize(actor, action, resource)`; query through `policy.scope`; render. POST: `runCommand`; 303 to the result page or `/…/operations/:op`; errors re-render the form with the same `_op`. | category page |
| 12 | Response log | `http_request` diag event with `routeId`, status, duration, category/code only (contract §4.10). | — |

#### 4.1.1 Bot and rate controls (B08)

| Limiter / control | Key | Budget (config) | Routes | Position |
|---|---|---|---|---|
| `otp_issue_ip` | IPv4 / IPv6 /64 | 20 / 15 min | S02, S07 | before CAPTCHA |
| ALTCHA `ta_otp` | challenge, purpose, pre-session binding | single use, 5 min | S02 | pure verification + spent-read at the route (before the contact limiter); spend in the command (`consumeBotCheck`), before issuance |
| `otp_issue_contact` | contact HMAC | 3 / 15 min | S02, S07 | after CAPTCHA (S02) |
| `otp_issue_global` | constant | 600 / 15 min | S02, S07 | after contact |
| `otp_verify_ip` | IP | 30 / 15 min | S04, S09, E-confirm | before command |
| `otp_verify_binding` | pre-session / session | 10 / 15 min | S04, S09, T-email confirm | before command |
| Challenge attempts | challenge row | 5 | S04, S09, T-email confirm | in command |
| TOTP failures | account columns | 10 / 24 h | S09 | in command, after a correct OTP |
| `enrol_open_ip` | IP | 10 / 15 min | S11 | before command |
| Enrolment attempts | enrolment row | 5 | S13 | in command |
| `email_change_start_account` | account | 3 / hour | T-email start | before command |
| `session_post` | session | 120 / min | every authenticated POST | before body parse |
| ALTCHA `bulk_intake` / `correction_upload` | challenge, purpose, session binding | single use | bulk intake start, correction upload | route checks payload signature before streaming; the Intake command calls `consumeBotCheck` |
| `intake_start_ta` | TA account | 10 / hour bulk; 60 / hour individual | intake routes | before body parse |
| `upload_ta_count`, `upload_ta_bytes` | TA account | 200 files / hour; 200 MiB / hour | document upload routes | before streaming; bytes debited by declared `Content-Length`, re-checked on actual size |

Order rule (D-04): a limiter keyed on a victim attribute (contact, account) is consumed only after the attacker-bound controls (IP, CAPTCHA, session) pass. A limiter store failure fails closed for sign-in, enrolment, intake and upload routes (`unavailable_dependency`). Public routes use no limiter and no database (D-11); connection caps (`http.maxConnections` 256, `requestTimeout` 30 s, uploads 120 s) bound them (B38).

A passed bot check or verified contact grants nothing else (B08): `consumeBotCheck` returns `void` and the policy never reads bot-check or rate-limit state.

#### 4.1.2 Cookies

| Cookie | Attributes | Content | Lifetime |
|---|---|---|---|
| `__Host-tm_sess` | `HttpOnly; Secure; SameSite=Lax; Path=/` | 32-byte token | session row expiry; rotated at every sign-in |
| `__Host-tm_pre` | same | pre-session (3.0.5) | 30 min |

No other cookie exists. `Secure` works over loopback HTTP in Chromium and Firefox (localhost is a secure context); remote testers use HTTPS (B37).

### 4.2 Access policy implementation (`src/modules/identity/policy.ts`)

#### 4.2.1 Decision algorithm (`decide`)

1. Actor `anonymous`: allow only `public.read` and `auth.*`; else `unauthenticated`.
2. Actor `account`: re-read session and account in `tx` (no cache across transactions); invalid ⇒ `unauthenticated`. Role from the account row, never from the cookie.
3. Actor `support_view`: re-read the SuperAdmin's session/account (active, staff session, support view open, `now < expires_at`, clock healthy); then evaluate the action as the viewed account with the viewed account's current status. Allowed only if the rule marks the action `R` and the action is not a byte release or command. Viewed account not `active` ⇒ every object denied and every list predicate `FALSE`.
4. Look up `RULES[action]` (a total `Record<Action, Rule>` checked by the type system and T-I39): allowed roles, required relation, accounting/group-read grant use, boundary (`parked`, `excluded`, `known_limitation`, `owner_decision`).
5. Boundary actions: actors who could see the surface get `unavailable_*`; others `not_found_or_forbidden` (contract §5.1).
6. Resolve the relation through `PolicyRelations` (owners' `api.ts` queries on authoritative tables): `own`, `asg`, `grant`, `rev`, `recipient`, `self`, `superadmin`.
7. Missing object and out-of-scope object ⇒ identical `not_found_or_forbidden`.

The policy evaluates relations only. State conditions (editor state, launch, gates, holds) belong to `core.evaluateControls` (contract §8). Routes and commands call both.

#### 4.2.2 List predicates (`scope`)

Exactly contract §5.4. Operator group-read predicate adds `AND $clockHealthy`. Support view uses the viewed account's predicate. Lists over `view_` tables join `core_applications` and apply the predicate.

#### 4.2.3 Support-view rendering (D-10)

- The SuperAdmin navigates `/ta/...` or `/ops/...` of the viewed account. Handlers receive `actor.kind = 'support_view'`; `policy` evaluates as the viewed account. The same handler and the same `scope()` produce the page, so the result equals the viewed account's own result now (B10 "exact-result").
- A fixed banner shows: viewed account id and display name, reason, remaining time, and an "End support view" form. Action buttons are not rendered; every POST except end/sign-out is refused at step 7 (404), and `runCommand` step 2 refuses `support_view` actors as a second barrier. Byte routes are POST and therefore refused (no bytes, contract §5.3 SV column).
- `/admin/*` pages return a page "End the support view to use SuperAdmin pages" (409, `support_view_active`).

### 4.3 Identity queries and pages

| Path | Role / action | Shows | Unavailable states shown |
|---|---|---|---|
| `GET /account` | any signed-in, `self.read`, SV R | role, display name, email, open sessions (created, last seen, kind; no IP), sign-out-all form; staff: MFA enrolled date | TA: "Lost access to your mailbox: recovery unavailable (`parked_lost_mailbox_recovery`)"; staff: "Email change is not available in this build (`staff_email_change_unavailable`)" until CCR-16 |
| `GET /ta/account/email` | TA, `self.email_change_start` | open change state, step forms (current code, new code), cancel, expiry time | lost-mailbox PARKED text; "TravelMudra staff cannot change your address" (B09) |
| `GET /admin/accounts` | SuperAdmin, `account.read_admin` | list with role, status, MFA state, `synthetic` label, filters; count class of active SuperAdmins; open elevations | panel when active SuperAdmins ≤ 1: "Creating, elevating or restoring a SuperAdmin needs a second distinct active SuperAdmin. Recovery from loss of all SuperAdmins is unavailable (`parked_first_admin`)." |
| `GET /admin/accounts/new` | SuperAdmin, `account.create` | form; role list | `unselected_account_eligibility` note |
| `GET /admin/accounts/:accountId` | SuperAdmin | status, timestamps, MFA state, enrolment state (`issued`/`opened`/`expired`, mail state — never the code), active session count, grants, open elevation, available actions each with enabled state or reason code, account fact history (from `sys_facts` by subject, authoritative) | TA: "Change email: unavailable — only the TA can change it (B09)"; TA: credential reset `parked_lost_mailbox_recovery`; audit degraded ⇒ elevation actions disabled `audit_degraded` |
| `GET /admin/accounts/:accountId/duties` | SuperAdmin, `account.read_admin` + `queue.read` | operator hand-off: active assignments, acts where reconciliation owner, open holds, owned incidents (Core/Operations queries, CCR-09); per-row and by-selection reassign forms posting to Core routes D16 and D17 | "Duties stay with this suspended operator until reassigned; the SuperAdmin queue owns them (`assigned_operator_inactive`)" |
| `GET /admin/elevations` | SuperAdmin | open/decided elevations; approve form disabled for the requester and the target with `second_superadmin_required` | expiry time |
| `GET /admin/grants` | SuperAdmin | active, expired, revoked grants; create form (group read), accounting grant form | max duration, active limit |
| `GET /ops/grants` | operator | own active group read grants with purpose and expiry | expired grants listed as expired |
| `GET /accounts` | accounting grantee or SuperAdmin, `accounts.surface_read` | boundary page: bank-receipt verification, allocation, recovery, manual adjustment, dashboard data and Payment Records mutation path — each "Unavailable (`parked_accounts_actions`)"; write-off "Unavailable (`unselected_write_off`)"; refunds `unselected_refund`; exposure release `parked_reservation_release` | all are boundaries (B29, B43) |
| `GET /admin/audit` | SuperAdmin, `audit.read_full` | full audit search over `view_audit_index` (Views), filters: subject type/id, actor, fact type, time range; projection lag | projection degraded ⇒ "Audit search is behind by N s; per-subject history below is read from the authoritative log. Privileged elevation is unavailable (`audit_degraded`)." |
| `GET /admin/audit/:subjectType/:subjectId` | SuperAdmin, `audit.read_full` | complete fact history for one subject from `sys_facts` via `factsForSubject` (authoritative; available during projection outage), with before/after, reason, evidence, actor, release, retrospective marks | none |
| `GET /{ta,ops,admin}/operations/:operationKey` | signed-in, own actor key | `lookupOperation`: recorded result re-authorized, or "Not accepted. Resubmitting is safe." | — |

Queries (Identity `api.ts`, all `ReadTx`): `getAccount`, `getRecipient`, `listAssignableOperators` (active, MFA-enrolled operators, ascending id), `countActiveSuperAdmins`, `resolveSession`, `listAccounts(filter, page)`, `accountDetail(id)`, `listElevations`, `listGrants`, `ownSessions(accountId)`, `openEmailChange(accountId)`, `supportViewState(sessionId)`, `identityHealth()` (`activeSuperAdmins: 'none' | 'one' | 'two_or_more'`, `mailTransport`).

### 4.4 Complete route inventory

Legend. Who: `ANON` anonymous with pre-session; `ANY` any signed-in actor; `TA-own` TA owning the resource; `OP-asg` current assigned operator; `OP-grant` operator with a valid group read grant on the resource's group; `OP-rev` incident owner or named reviewer; `ACC` operator with accounting grant; `SA` SuperAdmin (not in support view); `SV` readable in support view. Every POST carries `_op`, `_csrf`; forms that change an aggregate carry `_rev`; `R` = reason required. "Handler" names the owning command/query; owning modules define semantics, Identity defines path and authorization. Controls (`core.evaluateControls`) are additionally applied by the command. A route path change requested by another module design is a change request to this record.

#### 4.4.1 Public (no session read, no database)

| # | Method | Path | Action / resource | Who | Handler / notes |
|---|---|---|---|---|---|
| P01 | GET | `/` | `public.read` / public | anyone | static home; canonical, title/description, structured data (public-site design) |
| P02 | GET | `/countries` | same | anyone | static supported-country list |
| P03 | GET | `/countries/:slug` | same | anyone | static; unknown slug ⇒ 404 |
| P04 | GET | `/about` | same | anyone | static |
| P05 | GET | `/search` | same | anyone | static index only (B01) |
| P06 | GET | `/robots.txt` | same | anyone | disallows `/ta/`, `/ops/`, `/admin/`, `/accounts/`, `/sign-in`, `/staff/`, `/account` |
| P07 | GET | `/sitemap.xml` | same | anyone | public pages only |
| P08 | GET | `/assets/*` | same | anyone | CSS, ALTCHA widget, icons; immutable cache headers |
| P09 | GET | `/healthz` | `public.read` / installation | loopback peers only | allowlisted categories incl. `identity` |

#### 4.4.2 Sign-in and enrolment

| # | Method | Path | Action | Who | Handler | Controls |
|---|---|---|---|---|---|---|
| S01 | GET | `/sign-in` | `auth.ta_otp_request` | ANON | form + ALTCHA challenge (`data.p='ta_otp'`, `data.b`=pre binding) | `script-src 'self'` |
| S02 | POST | `/sign-in` | `auth.ta_otp_request` | ANON | `iam.request_ta_otp` | IP → ALTCHA → contact → global |
| S03 | GET | `/sign-in/verify` | `auth.ta_otp_verify` | ANON | code form | — |
| S04 | POST | `/sign-in/verify` | `auth.ta_otp_verify` | ANON | `iam.verify_ta_otp` | IP, binding, attempts |
| S05 | GET | `/sign-in/help` | `public.read` | anyone | static: codes, expiry, lost mailbox `parked_lost_mailbox_recovery`, no self-registration (`unselected_account_eligibility`) | — |
| S06 | GET | `/staff/sign-in` | `auth.staff_sign_in` | ANON | email form; link to `/staff/enrol` | — |
| S07 | POST | `/staff/sign-in` | `auth.staff_sign_in` | ANON | `iam.request_staff_otp` | IP → contact → global |
| S08 | GET | `/staff/sign-in/verify` | `auth.staff_sign_in` | ANON | OTP + TOTP form | — |
| S09 | POST | `/staff/sign-in/verify` | `auth.staff_sign_in` | ANON | `iam.staff_sign_in` | IP, binding, attempts, TOTP window |
| S10 | GET | `/staff/enrol` | `auth.staff_enrol` | ANON | enrolment-code form | — |
| S11 | POST | `/staff/enrol` | `auth.staff_enrol` | ANON | `iam.open_enrolment` | IP |
| S12 | GET | `/staff/enrol/setup` | `auth.staff_enrol` / self | enrolment session | QR SVG + seed + TOTP form | no-store |
| S13 | POST | `/staff/enrol/confirm` | `auth.staff_enrol` / self | enrolment session | `iam.staff_enrol` | attempts |
| S14 | POST | `/sign-out` | `auth.sign_out` / self | ANY (incl. enrolment, support view) | `iam.sign_out` | — |

#### 4.4.3 Common signed-in

| # | Method | Path | Action / resource | Who | Handler |
|---|---|---|---|---|---|
| C01 | GET | `/home` | `self.read` | ANY | 303 to `/ta`, `/ops` or `/admin` |
| C02 | GET | `/account` | `self.read` / self | ANY, SV | Section 4.3 |
| C03 | GET | `/ta/operations/:operationKey`, `/ops/operations/:operationKey`, `/admin/operations/:operationKey` | read action of the recorded resource | own actor key | `lookupOperation` (re-authorized) |
| C04 | GET | `/ta/notices`, `/ops/notices`, `/admin/notices` | `notice.read` (list) | recipient, SV | Delivery query |
| C05 | GET | `/{surface}/notices/:noticeId` | `notice.read` / notice | recipient, SV | Delivery; marks nothing on GET |
| C06 | POST | `/{surface}/notices/:noticeId/acknowledge` | `notice.acknowledge` / notice | recipient | `dlv.acknowledge_notice` |

#### 4.4.4 TA surface (`/ta`, role `ta`)

| # | Method | Path | Action / resource | Who | Handler | Notes |
|---|---|---|---|---|---|---|
| T01 | GET | `/ta` | `application.read` (list) | TA, SV | Views list + notices | home: action needed, progress |
| T02 | GET | `/ta/catalogue` | `catalogue.read_selectable` | TA, SV | Catalogue + `canSelectOffering` | each offering: cost, estimate, documents, process; not-selectable ones show reason codes (launch, binding) (B01, B07) |
| T03 | GET | `/ta/catalogue/:offeringId` | same / offering | TA, SV | Catalogue | truthful display may continue when not launched |
| T04 | GET | `/ta/groups` | `group.read` (list) | TA-own, SV | Core query | |
| T05 | POST | `/ta/groups` | `group.create` | TA | `core.create_group` | |
| T06 | GET | `/ta/groups/:groupId` | `group.read` / group | TA-own, SV | Core | |
| T07 | POST | `/ta/groups/:groupId/travel-dates` | `group.edit_travel_dates` / group | TA-own | `core.edit_travel_dates` | `_rev` |
| T08 | POST | `/ta/groups/:groupId/close` | `group.close` / group | TA-own | `core.close_group` | `_rev` |
| T09 | GET | `/ta/groups/:groupId/applications/new` | `application.create_draft` / group | TA-own | individual form | |
| T10 | POST | `/ta/groups/:groupId/intake/individual` | `intake.start` / group | TA-own | `intake.start_individual` | `intake_start_ta`, upload limiters, multipart order |
| T11 | GET | `/ta/groups/:groupId/intake/new` | `intake.start` / group | TA-own | bulk form + ALTCHA (`bulk_intake`) | `script-src 'self'` |
| T12 | POST | `/ta/groups/:groupId/intake` | `intake.start` / group | TA-own | `intake.start_bulk` | ALTCHA, `intake_start_ta`, upload limiters (B08 "before expensive authenticated intake") |
| T13 | GET | `/ta/intake/:attemptId` | `intake.read` / intake_attempt | TA-own, SV | Intake | |
| T14 | POST | `/ta/intake/:attemptId/questions/:questionId/answer` | `intake.answer_question` | TA-own | `intake.answer_question` | `_rev` |
| T15 | POST | `/ta/intake/:attemptId/correction` | `intake.correction_upload` | TA-own | `intake.correction_upload` | ALTCHA (`correction_upload`), limiters |
| T16 | POST | `/ta/intake/:attemptId/abandon` | `intake.abandon` | TA-own | `intake.abandon` | |
| T17 | POST | `/ta/intake-incidents/:incidentId/dispose` | `intake.incident_dispose` / intake_incident | TA-own | `intake.dispose_incident` (correction/abandon only) | |
| T18 | GET | `/ta/applications` | `application.read` (list), `search.private` | TA-own, SV | Views + predicate | |
| T19 | GET | `/ta/applications/:applicationId` | `application.read` | TA-own, SV | Core/Views | assigned-editor sub-state and allowed actions with reasons |
| T20 | GET | `/ta/applications/:applicationId/history` | `history.read_ta` | TA-own, SV | Views `taHistory` | not the full audit (B10) |
| T21 | POST | `/ta/applications/:applicationId/edit` | `application.edit_draft` | TA-own | `core.edit_draft` | editor permits (controls) |
| T22 | POST | `/ta/applications/:applicationId/correct-identity` | `application.correct_identity` | TA-own | `core.correct_identity` | same-person evidence |
| T23 | POST | `/ta/applications/:applicationId/documents` | `document.upload` | TA-own | `doc.upload_for_application` | upload limiters, multipart order |
| T24 | POST | `/ta/applications/:applicationId/documents/:versionId/replace` | `document.upload` / document_version | TA-own | `doc.replace_version` | |
| T25 | POST | `/ta/applications/:applicationId/documents/:versionId/resolve-extraction` | `document.resolve_extraction` | TA-own | `doc.resolve_extraction` | |
| T26 | POST | `/ta/applications/:applicationId/documents/:versionId/confirm-classification` | `document.associate` | TA-own | `doc.confirm_classification` | |
| T27 | POST | `/ta/applications/:applicationId/documents/:versionId/associate` | `document.associate` | TA-own | `doc.associate` | |
| T28 | POST | `/ta/applications/:applicationId/documents/:versionId/retrieve` | `document.retrieve_bytes` | TA-own | `dlv.retrieve_document` | release check per file; never in SV |
| T29 | POST | `/ta/selections` | `selection.retrieve` | TA-own (every item) | `dlv.retrieve_selection` | per-item checks |
| T30 | POST | `/ta/applications/:applicationId/request-assistance` | `application.request_assistance` | TA-own | `core.request_assistance` | |
| T31 | POST | `/ta/applications/:applicationId/submit` | `application.submit` | TA-own | `core.submit` | confirmation fields |
| T32 | POST | `/ta/applications/:applicationId/report-problem` | `application.report_problem` | TA-own | `core.report_problem` | assigned and not returned |
| T33 | POST | `/ta/applications/:applicationId/hand-back` | `application.hand_back` | TA-own | `core.hand_back` | |
| T34 | POST | `/ta/applications/:applicationId/withdraw` | `application.request_withdrawal` | TA-own | `core.request_withdrawal` | |
| T35 | POST | `/ta/applications/:applicationId/price-decision` | `application.decide_price_increase` | TA-own | `core.decide_price_increase` | |
| T36 | POST | `/ta/applications/:applicationId/transition-decision` | `application.decide_transition` | TA-own | `core.decide_transition` | |
| T37 | GET | `/ta/payments` | `payment.read_application` (list) | TA-own, SV | Payments query | account/payment history (B01); no payment action exists (gateway EXCLUDED, B42) |
| T38 | GET | `/ta/account/email` | `self.email_change_start` / self | TA | 4.3 | |
| T39 | POST | `/ta/account/email` | `self.email_change_start` | TA | `iam.start_email_change` | `email_change_start_account` |
| T40 | POST | `/ta/account/email/confirm` | `self.email_change_confirm` | TA (starting session) | `iam.confirm_email_change` | `otp_verify_ip`, `otp_verify_binding` |
| T41 | POST | `/ta/account/email/cancel` | `self.email_change_confirm` | TA | `iam.cancel_email_change` | |

No applicant route exists (applicant portal EXCLUDED, B42); a request for any other path is the 404 page.

#### 4.4.5 Operator surface (`/ops`, role `operator`)

Every application route resolves the application and requires `OP-asg` unless marked `OP-grant` (read-only). A grantee sees a read-only banner with grant purpose and expiry; no action form is rendered.

| # | Method | Path | Action | Who | Handler |
|---|---|---|---|---|---|
| O01 | GET | `/ops` | `application.read` (list) | operator, SV | assigned work + notices |
| O02 | GET | `/ops/work` | `application.read` (list), `search.private` | OP-asg ∪ OP-grant scope, SV | Views + predicate |
| O03 | GET | `/ops/applications/:applicationId` | `application.read` | OP-asg, OP-grant, SV | Core/Views |
| O04 | GET | `/ops/applications/:applicationId/history` | `history.read_ta` | OP-asg, OP-grant, SV | Views |
| O05 | GET | `/ops/groups/:groupId` | `group.read` | OP-asg (header only), OP-grant, SV | Core |
| O06 | GET | `/ops/grants` | `self.read` | operator, SV | 4.3 |
| O07 | POST | `/ops/applications/:applicationId/start-work` | `operator.start_work` | OP-asg | `ops.start_work` |
| O08 | POST | `/ops/applications/:applicationId/assistance-entry` | `operator.assistance_entry` | OP-asg | Core assistance-entry command (`core.edit_draft` with assistance basis; name per Core design) |
| O09 | POST | `/ops/applications/:applicationId/documents` | `document.upload` | OP-asg (assistance) | `doc.upload_for_application` |
| O10 | POST | `/ops/applications/:applicationId/documents/:versionId/resolve-extraction` | `document.resolve_extraction` | OP-asg (assistance) | `doc.resolve_extraction` |
| O11 | POST | `/ops/applications/:applicationId/documents/:versionId/associate` | `document.associate` | OP-asg (assistance) | `doc.associate` |
| O12 | POST | `/ops/applications/:applicationId/documents/:versionId/retrieve` | `document.retrieve_bytes` | OP-asg, OP-grant | `dlv.retrieve_document` (staff reader) |
| O13 | POST | `/ops/applications/:applicationId/return` | `operator.formal_return` | OP-asg | `core.formal_return` |
| O14 | POST | `/ops/applications/:applicationId/flag` | `operator.flag` | OP-asg | `core.flag` |
| O15 | POST | `/ops/applications/:applicationId/holds/:holdId/resolve` | `operator.resolve_hold` | OP-asg | `core.resolve_hold` |
| O16 | POST | `/ops/applications/:applicationId/readiness` | `operator.record_readiness` | OP-asg | `ops.record_readiness` |
| O17 | POST | `/ops/applications/:applicationId/readiness/withdraw` | `operator.withdraw_readiness` | OP-asg | `ops.withdraw_readiness` |
| O18 | POST | `/ops/applications/:applicationId/acts` | `operator.authorize_external_act` | OP-asg | `core.authorize_external_act` |
| O19 | POST | `/ops/applications/:applicationId/acts/:authorizationId/evidence` | `operator.record_act_evidence` | OP-asg | `ops.record_act_evidence` |
| O20 | POST | `/ops/applications/:applicationId/acts/:authorizationId/reconciliation` | `operator.record_reconciliation` | OP-asg | `ops.record_reconciliation_attempt` |
| O21 | POST | `/ops/applications/:applicationId/official-result` | `operator.record_artifact` | OP-asg | `ops.record_official_result` |
| O22 | POST | `/ops/applications/:applicationId/outcome` | `operator.record_outcome` | OP-asg | `core.record_outcome` (declared cancellation only; else `parked_cancellation`) |
| O23 | POST | `/ops/applications/:applicationId/applicant-withdrawal` | `operator.record_applicant_withdrawal` | OP-asg | `core.record_applicant_withdrawal` |
| O24 | POST | `/ops/applications/:applicationId/deferral` | `operator.propose_deferral` | OP-asg | `core.propose_deferral` |
| O25 | POST | `/ops/applications/:applicationId/packet/build` | `operator.build_packet` | OP-asg | `ops.request_packet_build` (rev 2, COV-03: Operations command calling `delivery.requestPacketBuild`) |
| O26 | POST | `/ops/applications/:applicationId/packet/release` | `operator.release_packet` | OP-asg | `core.release_packet` (rev 2, COV-03: Core acceptance calling `delivery.markPacketReleased`) |
| O27 | POST | `/ops/applications/:applicationId/handover` | `operator.record_custody` | OP-asg | `dlv.record_handover` |
| O28 | POST | `/ops/applications/:applicationId/manual-email` | `operator.record_manual_email` | OP-asg | `dlv.record_manual_email` |
| O29 | POST | `/ops/applications/:applicationId/direct-external` | `operator.record_direct_external` | OP-asg | `dlv.record_direct_external` |
| O30 | POST | `/ops/applications/:applicationId/emails/:emailSendId/resend` | `operator.manual_resend` | OP-asg | `dlv.manual_resend` (from `failed` only; `uncertain` ⇒ `uncertain_email_handling_unselected`) |
| O31 | POST | `/ops/applications/:applicationId/originals` | `operator.record_custody` | OP-asg | `ops.record_original_receipt` |
| O32 | POST | `/ops/originals/:originalId/movements` | `operator.record_custody` | OP-asg of a linked application | `ops.record_original_movement` |
| O33 | POST | `/ops/originals/:originalId/return` | `operator.record_custody` | OP-asg of a linked application | `ops.record_original_return`: always `unavailable_parked` / `parked_custody_route_policy` (B30) |
| O34 | POST | `/ops/applications/:applicationId/wrong-recipient` | `incident.report_disclosure` (rev 2, record 13 CCR-10) | OP-asg | `ops.report_wrong_recipient` |
| O35 | GET | `/ops/incidents` | `incident.read` (list) | OP-asg, OP-rev, SV | Operations |
| O36 | GET | `/ops/incidents/:incidentId` | `incident.read` | OP-asg, OP-rev, SV | reviewer sees artifact + minimal candidate identifiers only |
| O37 | POST | `/ops/incidents/:incidentId/evidence` | `incident.work` | OP-asg, OP-rev | `ops.record_incident_evidence` |
| O38 | POST | `/ops/incidents/:incidentId/resolve` | `incident.resolve` | OP-asg, OP-rev | `ops.resolve_incident` |
| O39 | POST | `/ops/artifacts/:artifactId/confirm-association` | `incident.work` | OP-asg, OP-rev | `ops.confirm_artifact_association` |
| O40 | — | (removed in rev 2) | — | — | Failure classification is SuperAdmin-only (record 13 CMD-IN2, action `failure.classify`; review findings COV-14, SEC-13): route `POST /admin/failures/:subjectType/:subjectId/classify`. Operators open incidents with `incident.open` (record 13 CMD-IN1) |

Document-email send and completion check have no route (`delivery_send_trigger_unselected`, `completion_check_trigger_unselected`, B46); the application page shows the pending state with those codes.

#### 4.4.6 Accounts surface (`/accounts`)

| # | Method | Path | Action | Who | Handler |
|---|---|---|---|---|---|
| A01 | GET | `/accounts` | `accounts.surface_read` | ACC, SA, SV (ACC target) | boundary page (4.3) |

No POST route exists. `accounts.receipt_verify`, `accounts.adjust`, `exposure.release` and `accounts.write_off` are shown as unavailable controls with codes; no route is registered (no generic or speculative mutation route, B08).

#### 4.4.7 SuperAdmin surface (`/admin`, role `superadmin`, not in support view)

| # | Method | Path | Action | Handler | Notes |
|---|---|---|---|---|---|
| D01 | GET | `/admin` | `queue.read` | Views summaries | nudges for open financial exceptions (B29), audit health, identity health |
| D02 | GET | `/admin/queues/assignment` | `queue.read` | Views | |
| D03 | GET | `/admin/queues/assistance` | `queue.read` | Views | |
| D04 | GET | `/admin/queues/flags` | `queue.read` | Views | |
| D05 | GET | `/admin/queues/incidents` | `queue.read` | Views | |
| D06 | GET | `/admin/queues/impact` | `queue.read` | Catalogue/Views | |
| D07 | GET | `/admin/queues/deferrals` | `queue.read` | Views | |
| D08 | GET | `/admin/queues/protection-marks` | `queue.read` | Core | |
| D09 | GET | `/admin/queues/tasks` | `tasks.read_failures` | kernel query | ids, kinds, codes only |
| D10 | GET | `/admin/queues/financial-follow-up` | `financial_exception.read` | Views (`Payment_Missing_Override`) | write-off `unselected_write_off` |
| D11 | GET | `/admin/applications` | `application.read`, `search.private` | Views | |
| D12 | GET | `/admin/applications/:applicationId` | `application.read` | Core/Views | |
| D13 | POST | `/admin/applications/:applicationId/documents/:versionId/retrieve` | `document.retrieve_bytes` | `dlv.retrieve_document` | release check; interim of owner decision OD-R2-04 (SuperAdmin byte access, review finding SEC-03) |
| D14 | POST | `/admin/applications/:applicationId/assistance-decision` | `assistance.decide` | `core.decide_assistance` | R |
| D15 | POST | `/admin/applications/:applicationId/assign` | `assignment.assign` | `core.assign` | R; Gate 1 |
| D16 | POST | `/admin/applications/:applicationId/reassign` | `assignment.reassign` | `core.reassign` | R; audited hand-off |
| D17 | POST | `/admin/assignments/selection` | `assignment.assign` (each application) | `core.assign` per application | R; independent results per application |
| D18 | POST | `/admin/assignments/round-robin` | `assignment.assign` (each) | `core.assign` per application, SuperAdmin-initiated | R; no autonomous assignment (B19, B42) |
| D19 | POST | `/admin/applications/:applicationId/gate-exceptions` | `gate_exception.grant` | `core.grant_gate_exception` | R |
| D20 | POST | `/admin/gate-exceptions/:gateExceptionId/revoke` | `gate_exception.revoke` | `core.revoke_gate_exception` | R |
| D21 | POST | `/admin/applications/:applicationId/correct-from-evidence` | `application.correct_from_evidence` | `core.correct_from_evidence` | R, evidence |
| D22 | POST | `/admin/applications/:applicationId/operational-withdrawal` | `withdrawal.record_operational` | `core.record_operational_withdrawal` | R, evidence |
| D23 | POST | `/admin/applications/:applicationId/unresolved-completion` | `outcome.authorize_unresolved` | `core.authorize_unresolved_completion` | R |
| D24 | POST | `/admin/deferrals/:deferralId/decision` | `deferral.decide` | `core.decide_deferral` | R |
| D25 | POST | `/admin/applications/:applicationId/flags/:holdId/respond` | `flag.respond` | `core.respond_flag` | R |
| D26 | POST | `/admin/protection-marks/:markId/resolve` | `protection_mark.resolve` | `core.resolve_protection_mark` | R, evidence |
| D27 | POST | `/admin/applications/:applicationId/payments` | `payment.record_service_status` | `pay.record_service_status` | R, evidence |
| D28 | POST | `/admin/incidents/:incidentId/assign-reviewer` | `incident.assign_reviewer` | `ops.assign_incident_reviewer` | R |
| D29 | POST | `/admin/intake-incidents/:incidentId/dismiss` | `intake.incident_dispose` | `intake.dispose_incident` (reasoned dismissal) | R |
| D30 | GET | `/admin/groups/:groupId` | `group.read` | Core | |
| D31 | GET | `/admin/accounts/:accountId/duties` | `account.read_admin` | 4.3 | hand-off page |
| D32 | GET | `/admin/catalogue` | `catalogue.read_admin` | Catalogue | |
| D33 | GET | `/admin/catalogue/offerings/:offeringId` | `catalogue.read_admin` | Catalogue + Operations | |
| D34 | POST | `/admin/catalogue/offerings/:offeringId/baselines` | `catalogue.edit_baseline` | `cat.edit_baseline` | R |
| D35 | POST | `/admin/catalogue/baselines/:baselineId/preview` | `catalogue.preview` | `cat.preview_baseline` | |
| D36 | POST | `/admin/catalogue/baselines/:baselineId/publish` | `catalogue.publish` | `cat.publish_baseline` | R |
| D37 | POST | `/admin/catalogue/declarations/:declarationId/owner-approval` | `catalogue.record_owner_approval` | `cat.record_owner_approval` | R, evidence |
| D38 | GET | `/admin/catalogue/impact/:assessmentId` | `catalogue.read_admin` | Catalogue | |
| D39 | POST | `/admin/catalogue/impact-items/:itemId/decision` | `catalogue.decide_impact` | `cat.decide_impact_item` | R |
| D40 | POST | `/admin/applications/:applicationId/transition` | `catalogue.approve_transition` | `cat.approve_transition` | R, evidence |
| D41 | POST | `/admin/catalogue/offerings/:offeringId/launch` | `launch.approve` | `ops.approve_launch` | R, evidence |
| D42 | POST | `/admin/catalogue/offerings/:offeringId/launch-scope` | `launch.expand_scope` | `ops.expand_launch_scope` | R, evidence |
| D43 | POST | `/admin/catalogue/offerings/:offeringId/suspend` | `launch.suspend` | `ops.suspend_offering` | R |
| D44 | POST | `/admin/catalogue/offerings/:offeringId/lift-suspension` | `launch.lift` | `ops.lift_suspension` | R |
| D45 | POST | `/admin/catalogue/offerings/:offeringId/withdraw` | `launch.withdraw` | `ops.withdraw_offering` | R |
| D46 | POST | `/admin/catalogue/offerings/:offeringId/existing-work-treatment` | `launch.record_treatment` | `ops.record_existing_work_treatment` | R |
| D47 | GET | `/admin/finance/tas/:taAccountId` | `payment.read_application` / ta_finance | Payments | ceiling, reserved, TM-paid-unrecovered; reservation release `parked_reservation_release` |
| D48 | POST | `/admin/finance/tas/:taAccountId/ceiling/lower` | `ceiling.lower` | `pay.lower_ceiling` | R |
| D49 | POST | `/admin/finance/tas/:taAccountId/ceiling/increase-request` | `ceiling.increase_request` | `pay.request_ceiling_increase` | R |
| D50 | POST | `/admin/finance/ceiling-changes/:changeId/approve` | `ceiling.increase_approve` | `pay.approve_ceiling_increase` | R; distinct SuperAdmin |
| D51 | POST | `/admin/finance/ceiling-changes/:changeId/decline` | `ceiling.increase_approve` | `pay.decline_ceiling_increase` | R |
| D52 | GET | `/admin/accounts` | `account.read_admin` | 4.3 | |
| D53 | GET | `/admin/accounts/new` | `account.create` | 4.3 | |
| D54 | POST | `/admin/accounts` | `account.create` | `iam.create_account` | R |
| D55 | GET | `/admin/accounts/:accountId` | `account.read_admin` | 4.3 | |
| D56 | POST | `/admin/accounts/:accountId/approve` | `account.approve` | `iam.approve_account` | R |
| D57 | POST | `/admin/accounts/:accountId/decline` | `account.decline` | `iam.decline_account` | R |
| D58 | POST | `/admin/accounts/:accountId/activate` | `account.activate` | `iam.activate_account` | R |
| D59 | POST | `/admin/accounts/:accountId/suspend` | `account.suspend` | `iam.suspend_account` | R; last-SuperAdmin acknowledgement |
| D60 | POST | `/admin/accounts/:accountId/restore` | `account.restore` | `iam.restore_account` | R |
| D61 | POST | `/admin/accounts/:accountId/reset-credentials` | `account.reset_credentials` | `iam.reset_credentials` | R |
| D62 | POST | `/admin/accounts/:accountId/elevation` | `account.elevation_request` | `iam.request_elevation` | R |
| D63 | GET | `/admin/elevations` | `account.read_admin` | 4.3 | |
| D64 | POST | `/admin/elevations/:elevationId/approve` | `account.elevation_approve` | `iam.approve_elevation` | R; distinct SuperAdmin |
| D65 | POST | `/admin/elevations/:elevationId/decline` | `account.elevation_approve` | `iam.decline_elevation` | R |
| D66 | GET | `/admin/grants` | `account.read_admin` | 4.3 | |
| D67 | POST | `/admin/grants` | `grant.group_read_create` | `iam.create_group_read_grant` | R |
| D68 | POST | `/admin/accounts/:accountId/accounting-grant` | `grant.accounting_set` | `iam.set_accounting_grant` | R |
| D69 | POST | `/admin/grants/:grantId/revoke` | `grant.group_read_revoke` / `grant.accounting_revoke` by kind | `iam.revoke_grant` | R |
| D70 | POST | `/admin/support-view` | `support_view.use` | `iam.start_support_view` | R |
| D71 | POST | `/admin/support-view/end` | `support_view.use` | `iam.end_support_view` | allowed in support view |
| D72 | GET | `/admin/audit` | `audit.read_full` | Views audit search | |
| D73 | GET | `/admin/audit/:subjectType/:subjectId` | `audit.read_full` | `factsForSubject` | authoritative |
| D74 | GET | `/admin/measures` | `measures.read` | Views measures | sample sizes, missing shares (B32) |

No SuperAdmin route changes a TA email (B09), shows or sets a credential (B11), creates a first SuperAdmin, or bypasses the second SuperAdmin (B11, B44). Static test T-I23 asserts these absences against the registry.

## 5. Internal tasks and timers

| Task / job | Owner | Effect class | Trigger | Prepare re-checks (each run) | Effect | Record | Retry / failure |
|---|---|---|---|---|---|---|---|
| `iam.send_mail` (new, CCR-04) | identity | `non_repeatable` | enqueued by 3.1, 3.3, 3.8, 3.9, 3.12, 3.14, 3.15, 3.17, 3.23; dedupe `iam.send_mail:<otp_id\|enrolment_id>` | lease; `assertWriter`; subject row exists and `state='issued'` (OTP) or `issued` (enrolment) and not expired ⇒ else `cancelled_obsolete`, wipe code; `onBehalfOf` account `active` (and for email change: change open, session not revoked) ⇒ else `cancelled_revoked`; `effect_started_at` set ⇒ `recordUncertain` | decrypt code in memory; `buildMessage` (plain text: code, expiry, "did not request? ignore"; no links carrying tokens); `transport.send` | `mail_state` = result; `delivery_code_enc = NULL` | effect at most once; record retries 5; `uncertain` ⇒ no resend, the person requests a new code; transport `none` ⇒ `failed` / `real_mail_transport_unselected`; code always wiped |
| `iam.expiry_cleanup` | identity | `none` | periodic job `expiry_cleanup_enqueue` every 15 min; dedupe `iam.expiry_cleanup:<window start>` | lease; admission | — | in batches of 500, each a SERIALIZABLE step: OTP `issued` past expiry ⇒ `expired`, code wiped (no fact); enrolments past expiry ⇒ `expired` (+ `iam.enrolment_expired` fact, CCR-05); email changes past expiry ⇒ `expired` (+ `iam.email_change_abandoned`); elevations past expiry ⇒ `expired` (+ `iam.elevation_expired`); group read grants past `valid_until` ⇒ `expired` (+ `iam.grant_expired`); support views past expiry ⇒ ended `expired` (+ `iam.support_view_ended`), session flag cleared; delete `iam_captcha_spent` and `iam_rate_limits` rows past expiry; delete OTP/enrolment rows expired > 7 days | conditional updates make retries idempotent; max 3; failure owner = system health |

Rules:
- Expiry is decided at use from stored times, never by this task. The task only records the visible state and removes technical rows. A delayed or failed cleanup cannot extend access.
- Tasks re-check permission and state at every prepare (contract §4.6). After a restore with new keys, `delivery_code_enc` cannot be decrypted: the task records `failed` and wipes the field; old codes are unusable (B40).
- Under clock-health `degraded` the cleanup still runs (fail-closed direction): grants and support views already deny at use (D-09).
- No Identity task performs a government action or a payment.

## 6. Deliberate boundaries in this scope

| Boundary | Spec | Kind | How it is visible | How it is unavailable |
|---|---|---|---|---|
| First-admin bootstrap | B08, B11, B44 | PARKED (unselected) | `/healthz` and `tm status` `identity.activeSuperAdmins = none` with `parked_first_admin`; admin accounts panel when ≤ 1 active SuperAdmin; staff sign-in help text | No bootstrap route, CLI or configuration in `production`. The synthetic seed refuses in `production` and refuses on any installation with a non-synthetic account. |
| Loss-of-all-admin recovery | B08, B11, B44 | PARKED | last-SuperAdmin suspension warning (3.13); accounts panel | No recovery command. Elevation/restore needs two distinct active SuperAdmins. |
| TA lost-mailbox recovery | B09, B44 | PARKED | `/sign-in/help`, `/account`, `/ta/account/email`, admin account page: `parked_lost_mailbox_recovery` | No admin email overwrite; `iam.reset_credentials` for a TA returns `unavailable_parked`. |
| TA account eligibility and fraud policy | B08, B44 | unselected | account create/approve forms: `unselected_account_eligibility`; `/sign-in/help`: "Accounts are created by TravelMudra" | No self-registration route; the system encodes no criteria; approval is a reasoned judgement. |
| Accounts dashboard data/actions, Payment Records mutation path for Accounts | B29, B43 | PARKED | `/accounts` boundary page | No route; policy returns `unavailable_parked` for those actions to ACC/SA. |
| Write-off, refunds | B29, B43 | unselected | `/accounts`, financial follow-up queue | No route; `unselected_write_off`, `unselected_refund`. |
| Real mail transport | B31, B37 | not selected | health `mailTransport = none` in `production`; `iam.send_mail` records `real_mail_transport_unselected` | Sign-in mail is not sent; sign-in pages stay non-disclosing. |
| CAPTCHA adequacy in production | B37 | known limit of local proof | verification report states "self-hosted proof-of-work; adequacy against production bots unproven" | — (mechanism active) |
| Delivery send / completion check trigger | B46 | KNOWN_LIMITATION | application pages show pending codes | No route (4.4.5 note). |
| Applicant portal, payment gateway | B42 | EXCLUDED | no route; public pages state TA-only service (public-site content) | 404 for any such path. |
| Staff email change | not in spec | not provided in this build | `/account` text `staff_email_change_unavailable` | No route until CCR-16 is accepted. |

## 7. Test plan

Levels: **U** unit (pure, no database); **I** integration over a real persisted PostgreSQL 16 database (per-file template clone, contract §10.1; X-01) through `runCommand` and the real Fastify app via `inject`; **M** multi-process or multi-client concurrency (several `tm_app` clients or several server processes on one database); **E** browser end-to-end (Playwright Chromium over HTTP on loopback). "Persisted" = rows asserted by SQL after the call. "Forbidden" = effects asserted absent (rows, facts, tasks, synthetic mail, log content, bytes).

| # | Test | Rules | Level | Persisted effects asserted | Forbidden effects asserted |
|---|---|---|---|---|---|
| T-I01 | TA OTP issuance happy path with a solved ALTCHA | B08, B41 | I | one `issued` challenge with `account_id`, `verifier_hmac`, encrypted code; `iam.otp_issued` fact; one `iam.send_mail` task; after running it: one `sys_synthetic_mail` row, `mail_state='synthetic_accepted'`, `delivery_code_enc IS NULL` | plaintext code in any table, fact, task payload, operation summary or pino output |
| T-I02 | Decoy for unknown, suspended, pending, approved, declined and staff emails | B08 | I + E | decoy challenge row; `iam.otp_issued {decoy:true}` | `iam.send_mail` task; `sys_synthetic_mail` row; any difference in status code, page body (after removing per-request tokens) or Set-Cookie set versus T-I01 |
| T-I03 | CAPTCHA placement: missing, malformed, expired, replayed, wrong purpose (`bulk_intake`), wrong pre-session binding | B08, B41 | I | `otp_issue_ip` consumed; replay leaves one `iam_captcha_spent` row | challenge row, fact, task; `otp_issue_contact` consumption (victim quota untouched) |
| T-I04 | Concurrent reuse of one solved ALTCHA by 5 clients | B08 | M | exactly one `iam_captcha_spent` row and one challenge | second challenge row |
| T-I05 | Issuance limits: 4th request per contact in 15 min; 21st per IP; global limit | B08, B41 | I | first 3 challenges only | 4th challenge row, task or mail; message differing between existing and unknown contact |
| T-I06 | OTP expiry with fake clock at `expires_at` and `expires_at − 1 ms` | B08, B41 | I | at expiry: state `expired`, `iam.otp_attempt_failed {expired}`; 1 ms before: session row | session at or after expiry |
| T-I07 | Single use: correct code submitted twice with two operation keys | B08, B41 | I | one `consumed` challenge, one session, one `iam.session_started` | second session |
| T-I08 | 10 concurrent correct verifications from one pre-session | B08, B35 | M | exactly one session; challenge `consumed` | two sessions; lost attempt counts |
| T-I09 | Attempt limit: 5 wrong codes then the correct code | B08, B41 | I | `attempts_used=5`, state `exhausted`, 5 failure facts | session after the correct 6th submission |
| T-I10 | Attempt binding: correct code from another pre-session; contact binding: account email changed after issuance | B08 | I | failure fact (binding case: rejection, no row change) | session |
| T-I11 | Superseding: second request in the same pre-session invalidates the first code | B08 | I | first `superseded` with code wiped; second `issued` | session from the first code |
| T-I12 | Operation identity on verify: same key + same code replays; same key + different code ⇒ `conflict_operation_key`; fault `command.lose_ack` on a successful sign-in, then resubmit | B35, B08 | I | replay: no attempt increment; lost ack: exactly one session row (orphan) and the "not completed in this browser" page | second session; attempt increment on replay or conflict; orphan session usable by any cookie |
| T-I13 | Non-disclosure in diagnostics: sign-in with email, wrong and right OTP, TOTP, ALTCHA payload | B08, B33 | I | pino output captured | email, OTP, TOTP, payload, cookie values, URL query in output (contract T-F31 pattern) |
| T-I14 | Staff sign-in requires both factors | B08, B11, B41 | I | wrong TOTP + right OTP: attempt +1, `totp_fail_count +1`, failure fact; both right: staff session with `mfa_verified_at`, `totp_last_step` set | session with only one factor; session for a non-enrolled staff (decoy) |
| T-I15 | TOTP replay and window lock: same TOTP code reused within its step (sequential and 2 concurrent); 10 TOTP failures in 24 h then valid codes | B08 | I + M | one session; `totp_last_step` monotonic; lock until window end (fake clock) | second session from one TOTP step; session during lock |
| T-U16 | TOTP wrapper (`otpauth` runtime, rev 2) against RFC 6238 SHA-1 vectors and an independent `node:crypto` HOTP oracle in the test suite for 10 000 random seeds/times | B08 | U | — | any mismatch |
| T-I17 | Staff enrolment: activation issues enrolment; code from synthetic mailbox; open; confirm; then full sign-in | B08, B11 | I + E | enrolment `consumed`, seed stored encrypted, `iam.mfa_enrolled`, enrolment session revoked | enrolment code or seed in any SuperAdmin page response, fact, task payload, operation summary or log (scan all) |
| T-I18 | Enrolment code: single use, expiry, 5 confirmation attempts, concurrent opens | B11 | I + M | states `consumed`/`expired`/`exhausted`; one enrolment session | second enrolment session; enrolment from an exhausted row |
| T-I19 | Credential reset of an active operator | B11 | I | TOTP columns NULL, all sessions revoked (`credentials_reset`), new enrolment; old TOTP fails sign-in | admin-visible code; reset of self; reset of a TA (`unavailable_parked`, no rows) |
| T-I20 | Session scope matrix: TA, operator, SuperAdmin, accounting grantee, enrolment session on every route of 4.4 | B10, B41 | I | — | any allowed request outside the inventory's Who column (404/redirect expected); enrolment session reaching a non-enrolment route |
| T-I21 | Session expiry and generation: idle, absolute, `secret_generation` mismatch, rotated `session_key` | B08, B40, B41 | I | `unauthenticated` responses | command rows written by expired sessions |
| T-I22 | CSRF, origin, host, method: missing/wrong `_csrf`, foreign `Origin`, absent `Origin` and `Referer`, foreign `Host`, state change via GET | B08, B41 | I | — | `sys_operations`, fact or task rows; staged blobs for multipart |
| T-S23 | Static route registry: every POST maps to exactly one command; no generic mutation route; no SuperAdmin route for TA email, credential display, first-admin bootstrap or single-SuperAdmin elevation; every route declares Action + resolver | B08, B09, B11, B10 | U (static) | — | any listed absent route present |
| T-I24 | Two-proof TA email change happy path | B09, B41 | I + E | current proof ⇒ `current_verified`, new-address mail only after it; switch ⇒ new email, `email_revision+1`, all sessions revoked, `iam.email_change_completed` with before/after; `getRecipient` returns new address; old address sign-in ⇒ decoy; new address sign-in ⇒ session | recipient or sign-in change before the second proof; any mail to the new address before the current proof |
| T-I25 | Email change failure modes: expiry; 5 wrong codes; confirm from another session; cancel; new address taken by another account (decided after proof) | B09 | I | change `expired`/`abandoned` with reason and fact | account email change; session revocation; disclosure of the other account before the new-address proof |
| T-I26 | Concurrent email change starts; concurrent switch versus another account's creation of the same address | B09, B35 | M | one open change; at most one account holds the address | two accounts with one address; partial switch |
| T-I27 | SuperAdmin cannot overwrite a TA email: policy for `self.email_change_*` with SuperAdmin, operator and support-view actors; support view POST to T39 | B09, B10, B41 | I | — | change rows; facts |
| T-I28 | Account lifecycle with reasons: create → approve → activate → suspend → restore (TA and operator); decline frees the email; stale `_rev` | B11 | I | statuses, facts with before/after and reason; enrolment for staff | transition without reason; latest-write-wins on stale revision |
| T-I29 | SuperAdmin creation needs a second distinct SuperAdmin: requester approves (refused); target approves (impossible); suspended requester; suspended approver; expired request; two concurrent approvals; installation with one active SuperAdmin | B11, B41 | I + M | single `approved` decision; `expired` state | approval by requester (also blocked by `CHECK` when forced by SQL as `tm_app`); any path to an active SuperAdmin with one approver |
| T-I30 | Elevate operator: refused with an active assignment or owned incident; accepted without duties | B11, B18 | I | role change, sessions revoked (`role_changed`), grants revoked (`grantee_elevated`) | elevated account keeping an assignment or accounting grant |
| T-I31 | Restore a suspended SuperAdmin uses the elevation flow | B11 | I | `restore_superadmin` elevation; status restored only at distinct approval | restore by one SuperAdmin |
| T-I32 | Emergency suspension during audit outage (fault `projector.stall`): suspend, revoke grant, decline, end support view succeed; every `privilegedElevation` command returns `audit_degraded` | B33, B11 | I | suspension facts; sessions revoked | rows or facts from refused elevation commands |
| T-I33 | Last SuperAdmin suspension (self and other): without acknowledgement refused; with acknowledgement accepted and `parked_first_admin` shown | B11, B44 | I | suspension; health `activeSuperAdmins = none` | suspension without acknowledgement |
| T-I34 | Suspension takes effect everywhere: page, command, operation lookup, byte route, `onBehalfOf` intake task; concurrent command racing the suspension | B10, B11, B35, B41 | I + M | every open session revoked; task `cancelled_revoked`; commands committed before the suspension remain | command, byte release or task business write after the suspension commit |
| T-I35 | Two SuperAdmins suspend each other concurrently | B11, B35 | M | exactly one `suspended` | both suspended; both failing without a retry |
| T-I36 | TA suspension preserves work | B11 | I | groups, applications, intake attempts unchanged (attempts `paused_actor_revoked` per Intake) | application state changes; deletion |
| T-I37 | Operator suspension and audited hand-off | B11, B19 | I | assignments stay `active`; Core pending shows `assigned_operator_inactive`; duties page lists them; `core.reassign` transfers them with reason | operator access to any application; automatic reassignment |
| T-I38 | Group read grant: grantee reads that group's applications and bytes; every operator POST route on those applications denied; other group, other TA denied; expiry at `valid_until` (fake clock); revocation; clock degraded; duration and count limits | B10, B41 | I | `dlv_releases` rows for allowed reads; grant states and facts | any command row by the grantee; cross-group or cross-TA reads; reads after expiry, revocation or under degraded clock |
| T-I39 | Policy completeness: `RULES` covers every `Action`; route-registry-driven allow/deny matrix for actors TA-own, other TA, OP-asg, other operator, OP-grant, ACC, SA, SV, suspended, anonymous on every route (generated) | B10, B41 | I | — | any decision differing from 4.4 |
| T-I40 | Accounting grant: `/accounts` shows only PARKED boundaries; grantee gets no application, payment-entry or ceiling route; grant only for operators; unique active grant | B29, B43 | I | grant rows and facts | case reads; payment mutation; `/accounts` POST routes |
| T-I41 | Support view exact result: for a TA and an operator target, every GET list, count, search, detail and history page in support view equals the target's own-session render (normalized); POSTs and byte routes refused; no facts by actor `support_view`; suspended target ⇒ empty; expiry; admin pages blocked | B10, B41 | I | start/end facts | difference from the target's render; any command row, fact or `dlv_releases` row in support view |
| T-I42 | Full audit is SuperAdmin-only; per-subject history available while the projector is stalled | B10, B33 | I | — | TA, operator, ACC or SV access to D72/D73 |
| T-I43 | Bot/request controls before expensive authenticated intake: bulk intake and correction upload without/with a reused ALTCHA; upload rate limits; multipart with the file part before `_csrf` | B08, B36, B38 | I | — | `sys_blobs` intent rows, staged files, intake attempt rows, fetch tasks |
| T-I44 | Restore effects on Identity (with the kernel restore harness): new `session_key`, `otp_pepper`, `job_credential_key` | B40, B41 | I | old sessions `unauthenticated`; old OTP codes and enrolment codes rejected; TOTP sign-in works after re-wrap (contract OD-04) | any old credential accepted |
| T-I45 | Clock behaviour: backward jump does not give extra OTP attempts; forward jump expires early; skew above limit ⇒ group-read grants and support views denied, sessions continue | B08, B10, B25 | I | — | extra successful guesses; grant access under degraded clock |
| T-I46 | Maintenance: admission closed ⇒ sign-in and private routes 503 maintenance; public pages still served; no OTP issued | B39 | I | — | challenge rows, tasks while closed |
| T-I47 | Public pages read no database and no session (instrumented pool and cookie parser) and contain no private data from seeded fixtures | B01, B10 | I | — | any query; any seeded name/email in output |
| T-I48 | `iam.send_mail` task semantics: challenge superseded before run ⇒ `cancelled_obsolete`, no mail; account suspended ⇒ `cancelled_revoked`; fault `task.after_effect` crash ⇒ `effect_uncertain`, no second mail; transport `none` ⇒ `failed` | B31, B35, B37 | I | task states; `mail_state`; code wiped in every case | second `sys_synthetic_mail` row; plaintext code after the task ends |
| T-I49 | Synthetic seed boundary: seed in `test`; refuse in `production`; refuse when a non-synthetic account exists; `production` start refuses with a synthetic account present; `@synthetic.test` refused by `iam.create_account` in `production` | B37, B44 | I | seeded rows labelled `synthetic`, facts by `engineering` | any seed write in refused cases |
| T-I50 | Expiry cleanup idempotency: run twice concurrently and after a crash | B35 | M | one expiry fact per object | duplicate facts; access extended by cleanup delay |
| T-E51 | Browser flow: TA sign-in with ALTCHA, OTP from synthetic mailbox, submit page, sign-out; CSP blocks inline script; `noindex` and `no-store` present on private pages | B08, B01 | E | session rows | console CSP violations from our pages; private page indexable headers |

B41 items in this scope and their tests: email/OTP expiry (T-I06), single use (T-I07, T-I08), attempt limits (T-I09, T-I15, T-I18); CAPTCHA/bot placement (T-I03, T-I04, T-I43); session scope (T-I20, T-I21, T-I39); two-proof email change (T-I24–T-I26); session revocation (T-I24, T-I34, T-I19); no admin bypass (T-S23, T-I27, T-I29, T-I33, T-I49); wrong-scope and revoked access (T-I34, T-I38, T-I39, T-I41); restore credentials (T-I44).

## 8. Contract change requests

Each request names the contract section, the exact change and the reason.

1. **CCR-01 (§1.1 non-entity keys).** Change the OTP row to: "OTP | 8 decimal digits from `crypto.randomInt` | stored only as `HMAC(otp_pepper, otp_id ‖ code)` and, until mailed, AES-256-GCM-encrypted on its row". Reason: X-03; a typed code with bounded attempts satisfies B08. **Disposition (rev 2): Accepted (01 §1.1).**
2. **CCR-02 (§12.1).** Replace `/staff/enrol/:token` with `GET /staff/enrol`, `POST /staff/enrol`, `GET /staff/enrol/setup`, `POST /staff/enrol/confirm`. Reason: X-04; no bearer URL. **Disposition (rev 2): Accepted (01 §12.1).**
3. **CCR-03 (§10.7).** `Captcha` becomes `{ createChallenge(now, { purpose, binding }): Promise<AltchaChallenge>; verifyPayload(payload, { purpose, binding }, now): Promise<{ challengeHmac: Buffer; expiresAt: Date }> }` (pure, no database). Add to `IdentityApi`: `consumeBotCheck(tx: WriteTx, req: { readonly payload: string; readonly purpose: 'ta_otp' | 'bulk_intake' | 'correction_upload'; readonly binding: Buffer }): Promise<void>` (throws `bot_check_failed`). Intake commands call it. Reason: X-05; sole writer of `iam_captcha_spent`. **Disposition (rev 2): Accepted (01 §3.3, §6.2, §10.7); record 14 C-I2 aligned.**
4. **CCR-04 (§2.21).** Add task kind `iam.send_mail` (owner identity, `non_repeatable`, 1 effect / record retries 5, on behalf of the account, failure owner: the person re-requests; visible `mail_state`). Remove "also used by identity for OTP mail" from `mail.deliver`. Add `sys_synthetic_mail.purpose` value set unchanged (already lists OTP and enrolment purposes). Reason: X-06. **Disposition (rev 2): Accepted (01 §2.21, §10.6); record 15 §1.2 aligned.**
5. **CCR-05 (§2.22, §2.23).** Add fact types `iam.otp_issued`, `iam.otp_attempt_failed`, `iam.email_change_current_verified`, `iam.enrolment_issued`, `iam.enrolment_opened`, `iam.enrolment_attempt_failed`, `iam.enrolment_expired`, `iam.grant_expired`, `iam.elevation_expired`, `iam.elevation_withdrawn`. Add subject types `otp_challenge`, `enrolment`. Reason: X-07; contract §4.2 requires a fact per accepted command; expiry must be visible. **Disposition (rev 2): Accepted (01 §2.22, §2.23).**
6. **CCR-06 (§3.3).** Extend Identity columns as in Section 2: `iam_accounts.email_revision`, `synthetic`, `created_reason`, `status_changed_at`, `totp_fail_count`, `totp_fail_window_start`; `iam_sessions.enrolment_id`; `iam_otp_challenges.decoy`, `delivery_code_enc`, `mail_state`, `mail_task_id`; `iam_email_changes.started_session_id`, `old_email_revision`, `new_email_display`, `end_reason`; `iam_grants.group_ta_account_id`, state `expired`, `end_reason`; `iam_elevations.kind` value `restore_superadmin`, `expires_at`, states `withdrawn`, `expired`; `iam_enrolments.delivery_code_enc`, `opened_at`, `pending_totp_secret_enc`, `pending_key_generation`, `attempts_used`, `max_attempts`, states `opened`, `exhausted`, `mail_state`, `mail_task_id`; `iam_support_views.session_id`, `expires_at`, `end_reason`. Reason: needed by Sections 3 and 5. **Disposition (rev 2): Accepted (01 §3.3).**
7. **CCR-07 (§3.3 guards).** Replace `iam_otp_challenges` unique index with `UNIQUE (purpose, attempt_binding_hmac) WHERE state = 'issued'`; drop `new_verified` from the `iam_email_changes` open-state index; add `iam_grants_group_read_uq`, `iam_enrolments_open_uq`. Register all in `GUARD_CONSTRAINTS`. Reason: one live code per attempt; the second email proof and the switch are one transaction. **Disposition (rev 2): Accepted (01 §3.3).**
8. **CCR-08 (§12.2).** Pre-session cookie lifetime 30 min (not 10), signed `nonce ‖ issuedAt`. Reason: 10 min is shorter than OTP validity plus typing time after page load. **Disposition (rev 2): Accepted (01 §12.2).**
9. **CCR-09 (§6.4, §6.7).** Add queries `CoreApi.operatorDuties(tx, accountId): Promise<{ activeAssignments: readonly ApplicationId[]; reconciliationOwnerActs: readonly AuthorizationId[]; openHoldsOnAssigned: number }>` and `OperationsApi.incidentsOwnedBy(tx, accountId): Promise<readonly IncidentId[]>`. Reason: elevation precondition (3.16) and the operator hand-off page (B11, B19). **Disposition (rev 2): Accepted (01 §6.4, §6.7); defined in record 13 §3.20.**
10. **CCR-10 (§6.2 command list).** Add `iam.request_staff_otp`, `iam.open_enrolment`, `iam.cancel_email_change`, `iam.decline_elevation`, `iam.seed_synthetic` (engineering, test/local_test only). Reason: Sections 3.3, 3.5, 3.10, 3.18, 3.23. **Disposition (rev 2): Accepted with edit: the seed command is `harness.iam.seed_synthetic` run by actor kind `harness` (01 §6.2).**
11. **CCR-11 (§4.2 step 4d, C-05).** (a) The actor re-check accepts an `enrolment` session only for `iam.staff_enrol` and `iam.sign_out`; staff MFA verification is otherwise required. (b) Add "session touch" (`last_seen_at`/`idle_expires_at`, at most every 60 s) to the READ COMMITTED technical steps of C-05; it accepts no business fact. Reason: Section 4.1 steps 5–6. **Disposition (rev 2): Accepted (01 §4.2 step 4d).**
12. **CCR-12 (§6.9, §7.8).** `mail.deliver` prepare for a document email MUST compare the send's recipient snapshot with `identity.getRecipient(tx, ta).emailRevision`; a difference ⇒ `denied_at_check` with code `recipient_changed`. Add reason code `recipient_changed`. Reason: B09 "switch both together" and B31 "current account email". **Disposition (rev 2): **Rejected**: B31 requires the current account email; the snapshot is refreshed at prepare (record 15 I-15-05; 01 §7.8). Code `recipient_changed` not added.**
13. **CCR-13 (§2.24).** Engineering actor MAY write `iam.account_created`, `iam.account_activated`, `iam.enrolment_issued` only through `iam.seed_synthetic` in `test`/`local_test`. Reason: B37 synthetic fixture; no product first-admin path. **Disposition (rev 2): Accepted with edit: actor kind `harness`, not `engineering` (01 §2.24).**
14. **CCR-14 (brief §1.1; orchestrator rule R5).** Move `otpauth` from runtime dependencies to devDependencies (test oracle). Reason: X-02. **Disposition (rev 2): **Rejected**: EO-02 records the owner direction to prefer mature libraries for TOTP; `otpauth` stays a runtime dependency (01 C-10); X-02 updated.**
15. **CCR-15 (§10.9).** Add configuration keys: `http.allowedHosts`, `http.trustProxy` (default false), `http.maxConnections` (256), `http.requestTimeoutMs` (30 000; uploads 120 000), `session.maxActivePerAccount` (10), `enrolment.ttlMs` (72 h), `enrolment.maxAttempts` (5), `elevation.ttlMs` (72 h), `emailChange.ttlMs` (30 min), `supportView.maxMs` (30 min), `grants.groupReadMaxMs` (14 days), `grants.groupReadMaxActive` (5), `captcha.ttlMs` (5 min), `captcha.cost`, and the limiter budgets of Section 4.1.1. Reason: Sections 3–4. **Disposition (rev 2): Accepted (01 §10.9).**
16. **CCR-16 (§5.3 `self.email_change_*`).** Optional: allow operators and SuperAdmins the same self-service two-proof email change, initiated only by the signed-in staff member with a valid MFA session. Until accepted, staff email change is not provided (`staff_email_change_unavailable`). Reason: the spec defines only the TA flow; staff mailboxes may change; reuse keeps one implementation (B34). **Disposition (rev 2): **Not accepted in this build**: optional scope; `staff_email_change_unavailable` stays visible (01 §15.2).**
17. **CCR-17 (§8.4 reason codes).** Add: `email_invalid`, `email_in_use`, `email_unchanged`, `email_change_open`, `email_change_address_unavailable`, `synthetic_email_refused`, `enrolment_invalid_or_expired`, `totp_invalid`, `second_superadmin_required`, `self_action_not_allowed`, `elevation_requester_inactive`, `elevation_target_has_duties`, `elevation_expired`, `last_superadmin_ack_required`, `grantee_not_operator`, `grant_duration_exceeded`, `grant_limit_reached`, `grant_exists`, `support_view_active`, `support_view_target_not_eligible`, `clock_degraded`, `csrf_invalid`, `origin_invalid`, `host_invalid`, `unselected_account_eligibility`, `staff_email_change_unavailable`, `synthetic_seed_refused`, `synthetic_accounts_present`, `recipient_changed`. Reason: closed error vocabulary for Sections 3–6. **Disposition (rev 2): Accepted except `recipient_changed` (01 §8.4).**
18. **CCR-18 (§4.2 step 5 / `GUARD_CONSTRAINTS`).** Allow a guard registry entry to name its error category, not only a reason code (for example `iam_accounts_email_uq` during an email switch ⇒ `validation_failed` / `email_change_address_unavailable`). Reason: some unique violations are not duplicates of a business object. **Disposition (rev 2): Accepted (01 §4.2).**
19. **CCR-19 (§5.1 `PolicyRelations` / kernel clock).** Expose clock health to the policy (`ClockHealth.ok(): boolean`, set by the `clock_check` job) so that group-read grants and support views fail closed under skew (D-09). **Disposition (rev 2): Accepted (01 §4.9, §5.1).**

## 9. Owner-decision candidates (genuine, B47)

None blocks the Identity milestone. Each has a safe interim behaviour implemented above.

**OD-I1 — Suspension of the last active SuperAdmin.**
- Spec text: B11 "emergency suspension may be unilateral"; B11 "No initial-admin or total-admin-loss bypass is inferred"; B08 "first-admin/loss-of-all-admin policy remain unselected".
- Why it is an owner decision: containment (suspend a compromised last SuperAdmin, or self-suspend) and availability (no recovery path once no SuperAdmin is active) conflict. Engineering cannot choose between a security duty and an unrecoverable installation.
- Safe interim: suspension is allowed (containment wins) only with an explicit acknowledgement; the form and health output show `parked_first_admin`. No recovery path is built.
- Independent work: everything else.

**OD-I2 — Restoration of a suspended SuperAdmin.**
- Spec text: B11 "Creating/elevating a SuperAdmin normally requires a second distinct existing SuperAdmin"; restoration is listed among ordinary account actions ("records approval, activation, suspension, restoration").
- Why it is an owner decision: restoring returns SuperAdmin authority (elevation-like) but the spec names only creation/elevation for the two-person rule. Requiring two SuperAdmins is safer but can block restoration when only one SuperAdmin remains active.
- Safe interim: two distinct active SuperAdmins (requester and approver, both different from the target) via `restore_superadmin` (D-08).
- Independent work: everything else.

Recorded interpretations (not escalated; promote if the owner disagrees):

| ID | Topic | Interpretation | Basis |
|---|---|---|---|
| I-I1 | Product-owner account | An ordinary `superadmin` account created through the same two-SuperAdmin flow; no flag, no extra permission. Until the first-admin policy is decided, no production SuperAdmin exists. | B07, B44 |
| I-I2 | Single-actor TA/operator lifecycle | One SuperAdmin MAY create, approve and activate a TA or operator; only SuperAdmin creation/elevation needs a second SuperAdmin. | B11 |
| I-I3 | Credential reset of a SuperAdmin | One other SuperAdmin with reason; the code goes only to the target's address. | B11 |
| I-I4 | Group read grant limits | Max 14 days, max 5 active per grantee, configurable; "rare" and "duration limited" need finite values. A privacy-relevant default the owner may change. | B10 |
| I-I5 | Grants after suspension | Revoked at suspension; not restored. | B11 |
| I-I6 | Support-view targets | TA and operator accounts only; no per-page audit fact. | B10 |
