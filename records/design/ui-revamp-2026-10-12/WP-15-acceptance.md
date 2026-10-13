# WP-15 acceptance checklist: Accounts, access and email change

| Field | Value |
|---|---|
| Lane | `ui-revamp-2026-10-12` |
| Work package | WP-15 Accounts, access and email change (UI-PLAN §12.2: SA-06 full, TA-12, OP-10; SA-10 by register CC-03; done when V21 and V22 pass; lane PLAN §3) |
| Author | Principal Product Manager (Claude subagent), 13 October 2026 |
| Decision owner | Principal Technical Architect of the lane (LD-12) |
| Status | Draft. Step 1 of lane PLAN §3, written before the design. Not run. Where the later design names a page, a path or a word differently, the design governs the name and this checklist keeps the observable result. |
| Product base | Lane branch `ui-revamp-2026-10-12` at 34e875b. Core is the same at e1f6ac9 and 34e875b (no change under `src/modules`, `src/contracts`, `src/core-api` or `src/kernel`). Pages read at 34e875b and in the lane working tree, which holds the uncommitted WP-02 code-review fix R-02 (the account and grant handlers no longer cut input; the edge address-change handlers still do). Internal records at 3b06d34 |
| Installation | `lane-ui`: staff http://127.0.0.1:4652 (SuperAdmin and operator pages under test; every support view); edge http://127.0.0.1:4650 (TA-12 under test; travel-agent set-up) |
| Writing style | ASD-STE100 at about 75% (STY-20261003-01) |

## Corrections

None yet. This is the first version. LD-13: WP-15 changes identity and access state (SuperAdmin elevation, second-factor
reset, read grants, support views, a travel agent's sign-in address), so the design and this set get one Codex review
before code. The alignment to the WP-15 design, to the architect's decisions (`WP-15.md` §3) and to that review will be
recorded here as a table of changed rows, as in `WP-14-acceptance.md`.

## Lessons applied from the WP-01 to WP-14 corrections

| Lesson | Source | Where this checklist applies it |
|---|---|---|
| Identical replay, changed-content conflict, browser Back, rejected-form refresh and lost acknowledgement are five separate cases; a business duplicate with a new key and a raw stale envelope are two more | WP-01 A-02, A-03, A-06; WP-03 R-12; WP-06 D-12 | §0.2 "Replay terms"; one "Nth time" item per command (A10, A23, A29, A38, A42, A51, A76); the matrix A95 |
| A refused command leaves no operation record; the refusal shows only on the re-rendered form | WP-01 A-08; WP06-A104 | §0.2; A94; every refusal item checks "nothing is recorded" by delta |
| A receipt names the command only when the operation's resource, returned id and summary (or a read by the returned id) establish it; otherwise a neutral "Request recorded" with facts labelled "Current"; no accepted time; a result never comes from the address | WP-01 A-04, P-02; WP-02 B-02; WP-06 D-02; WP-11 I-09; WP-14 K-07 | §0.2 "Receipts"; A92. The two grant commands return the same summary, so their receipts read the grant by its id (A34, A44) |
| An accepted command whose recorded result is not the requested effect never shows as a success | Class of WP-01 A-04 and A-07, new in this package | A22 (an approval recorded as `expired`), A70 (a wrong code is an accepted attempt), A72 (`invalid_address`), A73 (`ended: expired`) |
| No page, status read or receipt instructs anyone to perform an act; a historical receipt keeps the historical fact and shows current facts as "Current" | WP-07 F-01, F-33 (P0 class fix); WP-09 G-10; WP-11 I-02 | A93 |
| Another person's receipt address opens as the unchecked receipt with current authorized facts | WP-12 J-09 | A92 (SA2 opens SA1's receipt addresses) |
| Every rendered form action is a registered route; one host page per command use; carried forms leave the old pages and the carried-form test drops their rows | CC-12 to CC-18; WP-02 design §1.5, §8.2; WP06-A110 | A05, A90, A105 |
| A page MUST NOT block a command that Core accepts and MUST NOT offer one that Core refuses; where the refusing fact is not on the page's read, the form shows and Core's reason is re-rendered | WP-07 D-W07-16; WP-10 H-02, H-03; WP-12 J-04 | A08 (duties read unavailable), A17, A27, A49; §6 Q-01 asks what to do where Core accepts a command that has no effect |
| An outage of the evidence or control that a consequential record needs removes the form with a notice; optional information degrades; access refusals are a separate test | WP-07 F-04; WP-10 H-05; WP-11 I-05; WP-14 K-02 | A11, A32, A35, A50 (audit record behind, clock unhealthy); A104 |
| Optional reads never hide an access change | LD-14 | A59, A61, A65 (TA-12 MUST NOT read the address-change read in a support view), A84, A104 |
| No handler truncates, slices or drops a field or an indexed row; input over a limit is refused at the field with the values kept | LD-17; WP-02 code review R-02 | A77 (the edge address-change handlers cut input today), A103 |
| The refusal summary and the submitted values render independently of current eligibility; no refusal rebuilds a hidden decision value from a fresh read | WP-02 code review R-01, R-03 | A09, A21, A35, A41 |
| A page shows only facts that a read returns; each additional read is named; a missing fact is qualified or the item is "Partly met" | WP-02 B-06; WP-06 D-04; WP-14 K-14 | §0.1 "Facts no read returns"; §0.2 "Facts"; A04, A24 |
| Audit facts show only as fields recorded on that subject, with time and source | WP-11 I-10; BS B33; WP-14 K-14 | A04, A60 |
| A list at its read's cap says so; no total, "none" or "all" beyond the returned slice | WP-02 B-14; WP-08 E-10; WP-14 K-05 | A12, A30, A31, A79, A86 |
| A state is labelled for the fact it establishes; an item that Core still lists as open or active after its end time is labelled by its end time against the read time | WP-06 D-05; WP-14 K-11 | A02, A03, A13, A31, A64 |
| No duplicate guard is claimed where Core has none; existing records show before the form | WP-08 Q-W08-15; WP-09 G-03 | A26, A29 (a second reset is accepted) |
| On GET assert the blocker and the absence of the form; a command refusal of a removed form is tested with a saved envelope | WP-09 G-05 | A08, A17, A27, A49, A55 |
| A harness envelope that isolates a guard carries current revisions; a raw refused envelope is re-evaluated against its own revisions | WP-10 H-07; WP-11 I-11 | A95 (5a), (5b) |
| A secret value (sign-in code, address-change code, enrolment code, authenticator key) is never rendered back; safe values are kept | WP-01 A-12; WP01-A99 | A70, A76, A101 |
| Copy states no configuration value that the page does not read, and no package or record id | WP-01 Q-13; WP-07 F-22 | A06, A47, A66, A100 (today's "72 hours", "up to 30 minutes", "within 30 minutes") |
| A boundary of a parked policy names the product owner and no date | LD-04, LD-05; WP-08 Q-W08-03 | A27, A65, A99 |
| UI acceptance is separate from Core behaviour: a Core gap is recorded "Unmet" or "Partly met" with its owner, not as a WP-15 failure | WP-10 H-01; WP-12 J-01; WP-14 K-01 | §0.2 "Pass rule"; §6 |
| Proofs follow one ordered recipe with a run tag, fresh run-owned accounts and deltas; set-up writes are labelled | WP-02 B-13; WP-12 J-13; WP-14 K-13 | §0.4; §3 |
| Real refusal shapes from the code | WP-06 D-11; WP-10 H-07 | §0.5 |
| Conditions that `lane-ui` cannot show are proven by named tests | WP-01 P-W01; P-03 parked | §3 steps V21-T, V22-T, N-T |
| A support view shows no target-user action; admin pages answer the support-view page; the scoped reads render read-only | WP-02 §4.2 (U1 item 4); WP14-A89 (K-15) | A52 to A59 |
| Kind 1 notes record whether criterion point 2 is demonstrated | WP-09 G-11; WP-14 K-16 | §6 Q-06 |

## 0. Inputs and conventions

### 0.1 Inputs

| Ref | Source | Identity | Sections used |
|---|---|---|---|
| UX | `TARGET_PRODUCT_UX_SPEC.md` (2026-10-05) | SHA-256 b45186887cdc37f6… | §2.3 (Support view, History, read grant), §3.3, §4.2 (Account), §5.2 (Applications, Notices and account), §6.1 (identity/access job), §6.2 (Accounts & access), §6.3 (Account changes, Support view, Manual money record for the ceiling part), §7.4, §7.5, §8.2, §8.3 (Revoked access/session, Lost acknowledgement, Stale revision), §12 V21, V22, V24 |
| BS | `BUILD_SPEC.md` (r2) | SHA-256 4a6fd90657b0723f… | B08, B09, B10, B11, B12, B28 (ceiling part, referenced), B33, B35, B44 |
| PL | `../ui-plan-from-specs-2026-10-10/UI-PLAN.md` | SHA-256 75256bfd7e6d929a… | §1.1 to §1.4; §2.2; §2.3 (SH-R01 to SH-R05, SH-R08 to SH-R12); §3.2 TA-12; §3.3 OP-10; §3.4 SA-06, SA-09 (decision kinds), SA-10; §5.2 TA-12; §5.3 OP-10; §5.4 SA-06; §6.1 Notices, §6.2 Account, §6.4 Accounts and grants, Support view; §7 (K-STD, K-2P, K-OTP, K-BYTE; the identity rows); §8; §10; §11.1 to §11.3; §12.2 WP-15; §13.2 B-01, B-02 |
| DE | `../ui-plan-from-specs-2026-10-10/DECISIONS-2026-10-10.md` | SHA-256 a2c935f72cd4f5e9… | §3.1 (Kind 1 criterion), AD-05, AD-07, AD-12, AD-13 |
| CC | `COMMAND-COVERAGE.md` (this folder) | SHA-256 c4c53b06f7d2fc52… | §3 rows of the 11 WP-15 commands and `dlv.acknowledge_notice`; §5.1 WP-15; §5.3; §5.4 (operator and SuperAdmin notice pages); §6 CC-03, CC-11; §6.1 (`dlv.acknowledge_notice` staff routes stay with WP-15) |
| LP | `PLAN.md` (this folder) | SHA-256 e894486f73af0e59… | §3, §4 (LD-02, LD-03, LD-04, LD-06, LD-08, LD-11, LD-12, LD-13, LD-14, LD-17), §8 (S-08), §9 |
| PR | `PROPOSALS.md` (this folder) | SHA-256 0547640ae48459e7… | P-02 (receipt time), P-03 (no admission control on `lane-ui`), P-13 item 1 (the staff send preview cannot read the travel agent's current address) |
| W1 | `WP-01.md`; `WP-01-acceptance.md` | SHA-256 1246143f54f52fa7…; 18659ab8bc74e51a… | record §3 (Q-04 `/accounts`, Q-11, Q-13, PM Q-05 enrolment by the harness), §4 A-01, A-02, A-04, A-07, A-08, A-12; WP01-A09, A13, A21, A31, A55, A56, A58, A67, A70 to A72, A76, A99, A131; §4 "Not in WP-01" (TA-12, OP-10 notices and accounting section, SH-R09) |
| W2 | `WP-02.md`; `WP-02-design.md`; `WP-02-acceptance.md` | SHA-256 7fe4a07271c809fb…; e8eacaabf622cb83…; bfac75d7e75d34ef… | record §3 Q-W02-03, §4.1 B-02, B-06, B-14, §6.1 R-01 to R-03; design §1.2 (SA-06a to SA-06d), §1.3 (tabs Accounts, Elevation requests, Grants), §1.5 and §8.2 (carried WP-15 forms and their test), §3.14 receipts, §3.15, §4.1 to §4.5; acceptance WP02-A83, A84, A88 to A102, §3 Part G (V21 in WP-02) |
| W6 | `WP-06.md`; `WP-06-design.md`; `WP-06-acceptance.md` | SHA-256 adec73b3322fd726…; 327f580c1820bf40…; 7a1d82e48fde6e93… | D-02; design §2.1 SA-01 group 7 "Second approvals", the decision-kind table (elevation approve/decline: `/admin/elevations/:elevationId/decide/:kind`, WP-15); WP06-A02, A04, A103 |
| W7 | `WP-07.md`; `WP-07-design.md`; `WP-07-acceptance.md` | SHA-256 2e58a2765a680113…; 4c877b4be85dc5e7…; 647c7b1d6af0887c… | F-01, F-04, F-22, F-33; design D-W07-02 (`/ops/grants` answers 303 to the read-only section); WP07-A08, A35 (read-grant views), A83 to A89 (V21 ceiling part); Q-02 |
| W8 | `WP-08.md`; `WP-08-design.md`; `WP-08-acceptance.md` | SHA-256 7a0c15231350b09f…; 7a74a46cc1480906…; 4d6504be7f20ebe7… | Q-W08-02; design §1.2 (operator and SuperAdmin notices not rebuilt: WP-15), CC row of `dlv.acknowledge_notice`; WP08-A89 to A99 (TA-10 pattern), A111 (receipt) |
| W11 | `WP-11.md`; `WP-11-design.md` | SHA-256 edbea91a683da1c2…; c4be246b11d299eb… | SA-04g Group page (`core.admin_group`) |
| W13, W14 | `WP-13-acceptance.md`; `WP-14.md`; `WP-14-acceptance.md` | SHA-256 b9e206277b0482bd…; 60995cbab907636b…; 341d2c25c392b88d… | Format, conventions, lessons; WP14-A89 (support view and read grant on incident pages); SA-08a, SA-08s (audit) |
| Code | lane repository | 34e875b (Core identical at e1f6ac9) | `src/modules/identity/commands/{elevation,accounts,grants,support-view,email-change,shared}.ts`; `src/modules/identity/{policy,queries,sessions,writers}.ts`; `src/modules/identity/tasks/expiry-cleanup.ts`; `src/modules/delivery/commands/notices.ts`; `src/kernel/command.ts` (`privilegedElevation`, `reason_required`), `src/kernel/guard-constraints.ts`, `src/kernel/vocabulary/identity.ts`; `src/contracts/identity.ts`, `src/contracts/queries.ts` (`iam.account_page`); `src/core-api/bindings/identity-admin.ts`; `src/platform/config.ts` (identity defaults); `src/apps/staff/identity.ts`, `src/apps/staff/accounts/pages.ts`; `src/apps/edge/account.ts`; `src/apps/shared/{identity-routes,server}.ts`, `src/apps/shared/pages/identity.ts`, `src/apps/shared/delivery/routes.ts`, `src/apps/staff/delivery/routes.ts`; `src/web/pages/chrome.ts` (support-view banner); `src/web/route-inventory.ts`; `test/uat/signin-harness.ts` |

Verified facts of the code that the items rely on (read by the author at 34e875b; line references in the run record):

- **Elevation (`commands/elevation.ts`, `accounts.ts:53-60`).** Request: a SuperAdmin asks for an operator; the target
  MUST be an active operator with an authenticator at the revision the form showed (`stale_revision` otherwise); the
  target MUST hold no assigned application, owned reconciliation, open hold on an assigned application or owned
  incident (`elevation_target_has_duties`); the requester cannot name itself (`second_superadmin_required`); one open
  request per target (unique guard: `conflict_duplicate` / `elevation_open`, also for an expired request that the
  cleanup task has not closed yet). Approve: a second, distinct, active SuperAdmin, never the requester and never the
  target (`second_superadmin_required`); the requester MUST still be an active SuperAdmin
  (`elevation_requester_inactive`); the target MUST still be in the state of the kind (`stale_revision`); for an
  operator, the duties are checked again. Effects: `create_superadmin` pending SuperAdmin → "Approved" (activation is a
  separate WP-02 action); `elevate_operator` → role SuperAdmin, **every session of the target ends and every grant ends**
  (end reason `grantee_elevated`); `restore_superadmin` → "Active", with an enrolment code to the account's own address
  when it has no authenticator. An approval sent at or after the request's expiry is **accepted** with result `expired`:
  it records the expiry and approves nothing; this check comes before the second-SuperAdmin check. A request no longer
  `requested` answers `stale_revision`. Decline: not privileged (it works while the audit record is behind); sent by the
  requester it records `withdrawn`, by another SuperAdmin `declined`; it has no expiry check; a declined
  `create_superadmin` request also declines the pending account. With fewer than two active SuperAdmins no request can
  be approved: it stays open until it expires (no first-admin or all-admin-loss bypass).
- **Reset (`accounts.ts:259-291`).** SuperAdmin only; never the own account (`validation_failed` /
  `self_action_not_allowed`); a travel agent answers `unavailable_parked` / `parked_lost_mailbox_recovery` (boundary
  `parked`); a staff account MUST be active or suspended (`stale_revision` otherwise). It removes the authenticator,
  ends every session, revokes an open enrolment and supersedes live codes; an active account gets a new enrolment code
  at its own address; a suspended account enrols when it is restored. No duplicate guard: a second reset with a fresh
  revision is accepted and issues a new enrolment.
- **Grants (`commands/grants.ts`).** Group read: the grantee MUST be an active operator with an authenticator
  (`grantee_not_operator` at `granteeAccountId`; an unknown account answers `access_denied` from the policy); the group
  MUST exist (`access_denied`); the end is an instant with a time zone, after now and at most `groupReadMaxMs` ahead
  (`grant_duration_exceeded` at `validUntil`; not an instant: `input_invalid` at `validUntil`, code `custom`); the clock
  MUST be healthy (`unavailable_dependency` / `clock_degraded`); one active grant per operator and group
  (`conflict_duplicate` / `grant_exists` with `existing`); an active same-group grant whose end has passed is recorded
  `expired` first and the new grant is accepted; at most `groupReadMaxActive` unexpired active grants per operator
  (`control_blocked` / `grant_limit_reached`); purpose 10 to 500 characters. No revision. Accounting: the grantee MUST
  be an active operator (no authenticator condition); one active accounting grant (`grant_exists`); reason 10 to 500.
  Revoke: either kind, at the grant's revision, only an active grant (`stale_revision` otherwise); not privileged.
  Defaults (`platform/config.ts`): group read at most 14 days, at most 5 active per operator, read by the grants page.
- **Support view (`commands/support-view.ts`, `policy.ts`, `sessions.ts`, `apps/shared/server.ts:584-596`).** Start:
  SuperAdmin, staff session; the viewed account is a travel agent or an operator, never the own account or a SuperAdmin
  (`validation_failed` / `support_view_target_not_eligible`); healthy clock; one open support view per session
  (`conflict_duplicate` / `support_view_active`); reason 10 to 500; summary `started`, `supportViewId`, `viewedRole`;
  it ends at `supportViewMaxMs` (default 30 minutes; the banner reads the end time). **Core does not check the viewed
  account's status**: a support view of a suspended, pending or declined account starts, and every read in it is refused
  (§6 Q-01). In a support view: reads are only actions marked `sv`, evaluated as the viewed account, while that account
  is active and not a SuperAdmin; the clock MUST be healthy; the BFF answers every POST except "End support view" and
  sign-out with the uniform 404 before Core, and every `/admin` page or POST with the 409 page `support_view_active`; a
  command reaching Core is refused `access_denied`; no byte release has `sv`. An expired support view leaves the
  SuperAdmin's own session at the next request.
- **Read grant scope (`policy.ts` rules with `groupRead`).** The grantee reads `application.read`, `search.private`,
  `group.read`, `history.read_ta`, `document.read_metadata` and releases bytes (`document.retrieve_bytes`,
  `selection.retrieve`) of that group only. Never incidents, payments, notices or intake. Validity is checked at every
  use against the clock and fails closed while the clock is unhealthy.
- **Address change (`commands/email-change.ts`, `bindings/identity-admin.ts:73-94`).** Only the signed-in travel agent.
  Start: at the account revision; the address is normalized at the binding (`email_invalid` at `newEmail`);
  `email_unchanged`; `conflict_duplicate` / `email_change_open` (also an expired change the cleanup task has not closed:
  up to `expiryCleanupMs`, default 15 minutes); a rate limit per account; **no uniqueness check at start**; the code
  goes to the current address. Confirm: every proof MUST come from the session that started the change (`access_denied`
  otherwise); proof `current` needs state `started`, proof `new` needs `current_verified` (`stale_revision`); at or
  after expiry any confirm is **accepted** with result `invalid` and `ended: expired`; a code that is not live
  (superseded, expired, exhausted, other binding) answers `validation_failed` / `otp_invalid_or_expired` at `code`; a
  wrong code is **accepted** with result `invalid` (one attempt counted; `ended: attempts_exhausted` at the last
  attempt); the current proof issues the code to the new address only then; the new proof answers `stale_revision` when
  the account's address changed since the start, is **accepted** with `invalid_address` when another account holds the
  new address (the change ends; this is disclosed only to the person who proved that mailbox), and otherwise switches
  the sign-in address and the document address together, supersedes every live code and ends every session of the
  account. Cancel: from any session of the account, only an open change. No command sends a code again: a code that is
  no longer live leaves "cancel" and a new start.
- **Notice acknowledgement (`delivery/commands/notices.ts`).** Recipient only (`access_denied`); `validation_failed` /
  `ack_not_required`; `conflict_duplicate` / `already_acknowledged` (checked before the revision); `stale_revision`.
  Staff notices posted by Core on `lane-ui` today (`generic_case_update` events `assigned`, `reassigned_away`,
  `gate_exception_granted`, `submitted`, `superadmin_correction`, `deferral_review_due`, `withdrawn`,
  `assistance_approved`; `financial_follow_up`) need **no** acknowledgement. Only a disclosure deletion request to a
  staff account that received a file needs one (§6 Q-04).
- **Kernel (`kernel/command.ts:250-256, 349`).** The input schema runs first: a blank or short reason answers
  `validation_failed` / `input_invalid` at `reason` (code `custom`), so the kernel's `reason_required` is not reached by
  these commands; every `privilegedElevation` command (request, approve, reset, both grants, support
  view) answers `unavailable_dependency` / `audit_degraded` while the audit record is behind, before the policy. Decline,
  revoke, suspension and the address change are not privileged.
- **Reads the pages use.** `iam.admin_account` (account; creator; latest enrolment with purpose, state, mail state and
  expiry; open session count; the **active** grants, also one past its end that the cleanup task has not closed; the
  **open** elevation request of the account, also one past its expiry; history = facts on the account subject with actor
  name, recorded time and reason; active SuperAdmins; `auditOk`). `iam.operator_duties`. `iam.admin_elevations` (open:
  every `requested` request, no SQL limit, wire maximum 500, expired ones not yet closed included; decided: the newest
  50; `auditOk`). `iam.admin_grants` (active: every active grant, wire maximum 2000; ended: the newest 50; operators:
  active operators with an authenticator; `groupReadMaxMs`; `groupReadMaxActive`; `auditOk`). `iam.admin_accounts`
  (`openElevations` counts every `requested` request). `iam.email_change_page` (address and revision; the open change
  **with an end time after now** only: id, starting session, new address, state, end time, revision, the mail state of
  each code). `iam.account_page` (no address-change fact). `dlv.notices` (newest 200), `dlv.notice`. Optional
  `core.admin_group` (label, travel dates, state; no owning travel agent). `core.operation`.
- **Facts no read returns.** The decider of a request older than the newest 50 decided requests; a decided elevation on
  the account page; the time an operator became a SuperAdmin (no fact on the account subject); who opened a support
  view of an account and when (facts on the support-view subject: the audit pages of WP-14 only); who revoked a grant
  (the grant row holds no name); the open address change on `iam.account_page` and on every staff page; the owning
  travel agent of a group on `core.admin_group`.
- **Today's pages (replaced by WP-15).** SA-06c "Access and support" carries four forms (reset, elevation request,
  accounting grant, support view) with plain `?done=` confirmations (`accounts/pages.ts:581-600`); `/admin/elevations`
  carries the approve and decline forms with `?done=` results; `/admin/grants` carries the create form (typed group
  reference; a date field; the end of the chosen India Standard Time day) and every revoke form; the copy states
  configured numbers ("Requests expire after 72 hours", "for up to 30 minutes", "within 30 minutes of starting"); the
  edge address-change handlers cut `newEmail` to 320, `emailChangeId` to 64, `proof` to 16 and `code` to 32 characters
  (`edge/account.ts:134, 147, 175`); results come from the address (`?done=started`, `current_verified`, `cancelled`,
  `approved_elevation`, `grant_created`); `grantee_not_operator` mentions an authenticator also for the accounting
  grant; `elevation_open` has no sentence (UAT-13 fallback); the banner reads "Support view of [name]" with "End support
  view"; the operator and SuperAdmin notice pages keep the old renderer with `?done=acknowledged` (WP-08 design §1.2).

### 0.2 Conventions

- **Personas.** Travel agent: Y, `wp15-ta-[stamp]`, a fresh synthetic travel agent per run (created and activated by
  SA1 on SA-06 at set-up); `syn-ta-2` for isolation. Operators: `operator-1` (OP1: the assigned operator of D),
  `operator-2` (OP2: the grantee of the run's group read grant), and E, `wp15-op-[stamp]`, a fresh synthetic operator per
  run (created, approved, activated by SA1; enrolled by the harness), who receives the accounting grant, the reset and
  the elevation. SuperAdmins: `superadmin-1` (SA1: requester, set-up, support views) and `superadmin-2` (SA2: second
  approver, revoker, second tab). They stand for `syn-operator-1`, `-2` and `syn-superadmin-1`, `-2`. Keyboard-only
  user. Screen-reader user. Phone user (390 px wide). No step changes a seeded account (§0.2 "Data hygiene").
- **Where.** `L`: a person or the LD-11 harness shows it on `lane-ui`. `T`: an automated test in the lane repository
  shows it at the same commit; the run record names the test file and title. `L+T`: both are required. "Gallery" is
  the design's gallery state.
- **Sign-in codes (rule C).** As WP-01 §0.2. The LD-11 harness signs in and reads sign-in codes, address-change codes,
  enrolment codes and authenticator keys in memory only. Nobody prints, logs, screenshots or stores a code or a key.
  The run record names the step, never the value.
- **Copy.** Quoted text is draft copy (CR-09). Draft copy passes when the page states the same facts. The §11.3
  boundary form is mandatory for an unavailable action: "[Action] is unavailable until [policy or evidence] is
  [approved / recorded]. Owner: [owner or 'not yet named']." Core's reasons show in words; a code shows only as the
  UAT-13 fallback (A97). No page shows a package or record id (F-22). No page states a configured duration or count
  that its read does not return (WP-01 Q-13).
- **Account and access words (draft; the design governs the words, the facts stay).**
  Elevation kinds: `create_superadmin` "New SuperAdmin account"; `elevate_operator` "Operator to SuperAdmin";
  `restore_superadmin` "Restore a suspended SuperAdmin". Request states: `requested` "Waiting for a second SuperAdmin",
  and "Expired [time] IST. It can no longer be approved." when the read time is at or after its end; `approved`
  "Approved by [name]"; `declined` "Declined by [name]"; `withdrawn` "Withdrawn by the requester"; `expired` "Expired".
  Grant kinds: "Read access to a group", "Accounting grant". Grant states: active "Active until [time] IST" (group) or
  "Active, no end time" (accounting); active with an end at or before the read time "Ended [time] IST (time limit
  reached)"; end reasons `revoked` "Revoked [time] IST", `expired` "Ended at its time limit", `grantee_suspended` "Ended
  when the operator was suspended", `grantee_elevated` "Ended when the operator became a SuperAdmin". Authenticator:
  "Set up on [time] IST" / "Not set up"; enrolment: "[state] ([first set-up / reset]); mail [state]; expires [time] IST.
  The code is never shown here." Support view (SH-R09): banner "Read-only view for [name] ([role])", the reason, "Ends
  at [time] IST", control "Exit support view". Read grant (SH-R10): "Read-only access: [purpose], until [time] IST".
  Address change: steps "New address", "Code to your current address", "Code to your new address"; pending line "Your
  sign-in and document email remain [current address] until both addresses are verified."; mail states `queued` "Being
  sent", `synthetic_accepted` "Delivered to the synthetic mailbox", `accepted` "Handed to the mail service", `failed`
  "Could not be sent. Cancel and start again.", `uncertain` "Sending may have failed. If no email arrives, cancel and
  start again.", `none` "Not sent". Never: "impersonate", "sign in as", "log in as", "act as", "switch user",
  "Override", "Admin override", "reset password", "show code", "unlock", "recover account", "Mark as read".
- **Dates and times.** Every time carries "IST" (AD-10, CR-06).
- **Freshness (LD-08).** The identity reads, `dlv.notices` and `core.admin_group` are authoritative: "Read at [time]
  IST". SA-01 group 7 (observation) follows WP06-A09.
- **Facts.** A page shows only facts that a named read returns (B-06). A fact read after an operation is "Current". A
  count that cannot be read is "Unavailable", never "0". A list at its cap says so. A fact that only the audit record
  holds shows only on the audit pages (SA-08a, SA-08s) as a recorded field with its time and source.
- **Receipts.** CMP-08 as WP06-A103: the request reference links to the operation status page; "Recorded once. Sending
  the same form again does not repeat it."; no accepted time and no actor (P-02, S-08); nothing from the address; never
  an instruction to act; the polite region announces it. Another person who opens the receipt address gets the
  unchecked receipt with current authorized facts (J-09). Per command:

| Command | Named when | Title (draft) | Otherwise |
|---|---|---|---|
| `iam.request_elevation` | `result` `requested`, the returned `elevationId`, the resource is the page's account | "Elevation requested" | Neutral "Request recorded" |
| `iam.approve_elevation` | `result` `approved` and `elevationId` equal to the page's request (the resource `installation` names no subject) | "Elevation request approved" | `result` `expired`: "This request had expired. It is now recorded as expired. Nothing was approved." (never a success title); otherwise neutral |
| `iam.decline_elevation` | `result` `declined` or `withdrawn` and the page's `elevationId` | "Request declined" / "Request withdrawn" | Neutral |
| `iam.reset_credentials` | `result` `credentials_reset`, the resource is the page's account | "Second factor reset" | Neutral |
| `iam.create_group_read_grant` | `result` `created` with `grantId`, **and** a read by that id returns kind `group_read` | "Read access given" | Neutral (the accounting grant returns the same summary) |
| `iam.set_accounting_grant` | `result` `created` with `grantId`, and a read by that id returns kind `accounting` | "Accounting grant given" | Neutral |
| `iam.revoke_grant` | `result` `revoked`, the resource is the page's grant | "Grant revoked" | Neutral |
| `iam.start_support_view` | `result` `started` | No receipt: the banner of the viewed pages is the result (A48) | A lost acknowledgement opens the operation status page |
| `iam.start_email_change` | `result` `started` | "We are sending a code to your current address." (mail is a task after the commit, WP-01 Q-11) | Neutral |
| `iam.confirm_email_change` | `result` `current_verified` | "Your current address is confirmed. We are sending a code to [new address]." | `invalid`: no receipt, the code step with its field error (A70); `ended` `attempts_exhausted` or `expired`: the ended notice (A70, A73); `invalid_address`: A72; `completed`: the sign-in page "Sign in with your new email address." (WP01-A56) |
| `iam.cancel_email_change` | `result` `cancelled` | "The address change was cancelled. Your address did not change." | Neutral |
| `dlv.acknowledge_notice` (operator and SuperAdmin routes) | the resource is the page's notice | "Acknowledged" (WP08-A91) | Neutral |

- **Replay terms.** As WP-13 §0.2 (1 identical replay; 2 changed-content conflict; 3 Browser Back; 4 rejected-form
  refresh; 5 lost acknowledgement to `/<surface>/operations/<key>`); a business duplicate (a new key with the current
  page's facts) and a raw stale envelope (a new key with an older page's revision) belong to the matrix (A95).
- **Refused sends leave no record.** The status page of a refused key reads "Nothing is recorded for request [reference]
  so far". Every refusal item checks by delta: open elevation requests, the account revision, role and status, the
  enrolment row, grants (active and ended), support views (audit), the address and its open change, notice
  acknowledgements.
- **Paths (LD-03).** Kept: SA-06a `/admin/accounts`, SA-06c `/admin/accounts/:accountId`, SA-06d
  `/admin/accounts/:accountId/duties` (WP-02); SA-06e `/admin/elevations` (kept, rebuilt; tab "Elevation requests");
  SA-06g `/admin/grants` (kept, rebuilt; tab "Grants"); TA-12 `/account` on 4650 (WP-01 page, extended); TA-12e
  `/ta/account/email` (kept, rebuilt); OP-10 `/ops/notices` and `/account` on 4652, OP-10n `/ops/notices/:noticeId`;
  SA-10 `/admin/notices` and `/account`, SA-10n `/admin/notices/:noticeId`. Every POST path of §1.2 stays. New GET task
  pages get the paths that the design names; this checklist calls them: SA-06q "Request elevation" (beside POST
  `/admin/accounts/:accountId/elevation`), SA-06k "Reset the second factor" (beside POST `…/reset-credentials`), SA-06t
  "Give the accounting grant" (beside POST `…/accounting-grant`), SA-06v "Open a support view" (POST
  `/admin/support-view` stays), SA-06n "Give read access to a group" (POST `/admin/grants` stays), SA-06x "Revoke a
  grant" (beside POST `/admin/grants/:grantId/revoke`), and SA-09s "Decide an elevation request" at
  `/admin/elevations/:elevationId/decide/:kind`, `kind` ∈ {`approve`, `decline`} (WP-06 design §2 decision-kind table;
  POST `…/approve` and `…/decline` stay). The design MAY host the SA-06 task pages as SA-09 kinds (AD-13); the
  observable result stays. Pages of other packages: SA-01 (WP-06), SA-03a, SA-07a (WP-06), SA-04g (WP-11), OP-01,
  OP-02 (WP-07), TA-01, TA-05, TA-07, TA-08, TA-09, TA-13 (WP-03), TA-10 (WP-08), SA-08a, SA-08s (WP-14), PUB-02,
  SH-02, the enrolment pages and the shared `/account` page (WP-01).
- **Pass rule.** WP-15 passes when every `L` item passes on `lane-ui` at the integrated ref, every `T` item has a named
  passing test at that commit, every axe item passes, and the proofs of §3 pass, except the explicitly deferred items of
  §5. Recorded, not failed: A04 and A24 "Partly met" (the decider of an older request and the support-view history are
  not on the account page's read; §6 Q-06); A49 "Partly met" until §6 Q-01 is answered (Core starts a support view of an
  account that is not active); A73 part (3) "Unmet: waits for §6 Q-02" (Core counts an expired address change as open);
  A81 "Deferred" for the live part (test and gallery) unless §6 Q-04 finds a staff notice that needs an
  acknowledgement; a live step that needs a harness extension that does not exist (§0.4 first checks) is "Deferred:
  harness" and its named test carries the item, never a seeded account. An item that the architect marks "partly met"
  by a recorded decision passes with that note. A failed item becomes a finding ranked P0, P1 or P2 with its scenario
  (PRI-20260930-01).
- **Preconditions on `lane-ui`.** WP-01, WP-02, WP-03, WP-06, WP-07, WP-08, WP-11 and WP-14 are integrated (SA-06
  create, approve, activate, suspend and restore; TA pages create and submit; SA-07a records payments; SA-03a assigns;
  SA-01 group 7; OP-01 read-only section and OP-02 read-only mode; TA-10; SA-04g; SA-08a and SA-08s). The processing
  instance runs (mail tasks, the expiry cleanup task). Where a package is not integrated, the step runs on the existing
  page and the run record says so.
- **Data hygiene.** WP-15 writes only: Y (created, activated, its address changed once, a second change started and
  cancelled, suspended and restored once); Y's group G and application D (submitted, payment recorded, assigned to OP1);
  E (created, approved, activated, enrolled; the accounting grant given and revoked; the second factor reset and
  enrolled again; one elevation request approved; suspended; two restoration requests, one withdrawn and one declined);
  one group read grant of OP2 on G (revoked in the run); one download by OP2 of a file of D; SA1's support views (Y
  twice, OP2, OP1) with their ends. WP-15 MUST NOT change the status, role, address, authenticator or grants of a
  seeded account (OP2's grant is the run's own and ends in the run), elevate, reset or suspend a seeded account, change
  a seeded travel agent's address (the harness finds seeded accounts by address), give a grant on a group without the
  run's tag, or acknowledge a notice of another person. E ends as a suspended SuperAdmin with the run's tag; later runs
  exclude E, Y, G and D by the tag. Identifiers stay in the internal run record only.

### 0.3 Synthetic data used by WP-15

| Item | Value | Use |
|---|---|---|
| Travel agent | Y, display name "WP15 travel agent [stamp]", address `wp15-ta-[stamp]@synthetic.test`, new address `wp15-ta-[stamp]-b@synthetic.test` | The address change (V21-10, V21-11); the support views of V22 |
| Operator | E, display name "WP15 operator [stamp]", address `wp15-op-[stamp]@synthetic.test` | Accounting grant, reset, elevation, emergency suspension, restoration requests (V21-1 to V21-9a) |
| Group | G, `wp15-[stamp]` in Synthetica on "SYN Tourist e-visa"; travel start today + 30 days, return today + 40 days | The read grant; the support-view scope |
| Application | D, applicant "SYNACCESS, MIRA"; submitted by Y; "Payment received" `SYN-W15-[stamp]-PAY`; assigned to OP1 | OP1's duty (V21-4); OP1's "assigned" notice (N-1); the grant read and download (V22-7); the support views |
| Passport, photograph | `td3Lines` of a `SyntheticPassport`, document code P, issuing state and nationality IND, expiry at least six months after the return date, number "S" + seven digits new to the run; `passportTextPdf` or `passportImage`; `plainPng` at least 350 × 350 px | Intake of D |
| Read grant | OP2 on G; purpose "WP15 [stamp] check the documents of a synthetic support case"; last day of access: today + 1 | V22-6 to V22-10 |
| Reasons | "WP15 [stamp] …", at least 10 characters | Every decision |
| Fixtures (tests and gallery) | Requests of each kind and state, one past its end not yet closed, one whose requester is suspended, one whose target gained a duty; an installation with one active SuperAdmin; 50 decided requests; grants past their end, ended by suspension and by elevation; an operator at the grant limit; the audit record behind; the clock unhealthy; a support view at its end time; a support view of a suspended account; address changes expired, exhausted, in the cleanup window, started in another session, whose new address belongs to another account; a staff notice that needs an acknowledgement (a disclosure deletion request to a staff recipient); 200 staff notices; a lost acknowledgement per command | T items and the gallery |

### 0.4 Run recipe (rerunnable)

- Run tag `wp15-[yyyymmddhhmm]`. First checks: (1) the harness can create (through SA-06), activate and sign in a fresh
  travel agent, and read the address-change codes of its current and new address in memory; (2) the harness can enrol
  a fresh staff account (enrolment code from the synthetic mailbox and key from the page, in memory; WP-01 PM Q-05),
  enrol it again after a reset, and sign it in; (3) OP1, OP2, SA1, SA2 and `syn-ta-2` sign in; (4) OP2 has an
  authenticator and fewer active group read grants than the grants page's maximum; (5) "SYN Tourist e-visa" admits Y
  (TA-03); (6) SA1's session holds no support view. When check (1) or (2) fails, the dependent live steps are "Deferred:
  harness" and run as tests; the address change never runs on a seeded account (§6 Q-09).
- Baseline (step P-0, before the set-up): SA-06a "Active SuperAdmins" and "Open elevation requests"; SA-01 group 7
  lines of SA1 and SA2; SA-06e open and decided rows; SA-06g active rows of OP2 and the ended rows; OP-10 notices of OP1
  (count, "Needs your acknowledgement"); SA-10 notices of SA1; OP-01 read-only section of OP2. Every later count check
  is a delta from it.
- Setup (labelled "Setup", through integrated pages): Setup 0: SA1 creates and activates Y (SA-06b, SA-06c; WP-02); the
  harness signs Y in. Setup 1: Y creates G (TA-13) and D (TA-09) and submits D (TA-08). Setup 2: SA1 records "Payment
  received" for D (SA-07a) and assigns D to OP1 (SA-03a). Setup 3: SA1 creates E as an operator, approves and activates
  it (WP-02); the harness enrols E.
- Order (§3): P-0, Setup, Part V21 (V21-1 to V21-11e), Part V22 (V22-0 to V22-12), Part N (N-1 to N-4), the test steps
  (V21-T, V22-T, N-T), Part X. Every harness send uses the fields of a freshly loaded page unless the step says "raw". A
  raw envelope is built from a page loaded earlier in the run and named in the run record.
- Two browsers are used where a step says so (SA1 and SA2; OP2's tab kept open; Y's second browser).

### 0.5 Refusal shapes in the code at 34e875b (category / code)

Every WP-15 command also answers `validation_failed` / `input_invalid` on its schema (field `reason` or `purpose` code
`custom` for a text under its minimum or over its maximum after trimming, or with a control character; field
`expectedRevision` code `too_small` when the `_rev` value is missing; a wire field over its limit, code `too_big`; a
blank reason is refused here too, because the input schema runs before the kernel's `reason_required`),
`not_found_or_forbidden` / `access_denied` for a caller without the policy action or an unknown subject, and
`conflict_operation_key` / `operation_key_reused` for a reused key with other content. The privileged commands answer
`unavailable_dependency` / `audit_degraded` while the audit record is behind, before the policy.

| Command | Refusals the items assert (in Core's order) |
|---|---|
| `iam.request_elevation` | `audit_degraded`; `access_denied` (unknown account; not a SuperAdmin); `control_blocked` / `second_superadmin_required` (own account); `stale_revision` / `stale_revision` (revision changed; the target is not an active operator with an authenticator); `control_blocked` / `elevation_target_has_duties`; `conflict_duplicate` / `elevation_open` (guard; an open request of the target, also one past its end not yet closed) |
| `iam.approve_elevation` | `audit_degraded`; `access_denied` (unknown request; not a SuperAdmin); `stale_revision` (the request is not `requested`, or another revision); **accepted** with `result` `expired` at or after the end time; `control_blocked` / `second_superadmin_required` (requester or target); `control_blocked` / `elevation_requester_inactive`; `stale_revision` (the target is no longer in the state of the kind); `control_blocked` / `elevation_target_has_duties` (operator kind) |
| `iam.decline_elevation` | Not privileged. `access_denied`; `stale_revision` (not `requested`, or another revision). Accepted `withdrawn` (requester) or `declined`; no expiry check; a `create_superadmin` decline also declines the pending account |
| `iam.reset_credentials` | `audit_degraded`; `access_denied`; `validation_failed` / `self_action_not_allowed`; `stale_revision` (revision; status not active or suspended); `unavailable_parked` / `parked_lost_mailbox_recovery` (a travel agent; boundary `parked`) |
| `iam.create_group_read_grant` | `audit_degraded`; `access_denied` (unknown grantee account, from the policy; not a SuperAdmin); `validation_failed` / `grantee_not_operator` at `granteeAccountId`; `access_denied` (unknown group: the page shows it at the group field); `validation_failed` / `grant_duration_exceeded` at `validUntil`; `input_invalid` at `validUntil` (code `custom`, not an instant with a time zone); `unavailable_dependency` / `clock_degraded`; `conflict_duplicate` / `grant_exists` (with `existing`); `control_blocked` / `grant_limit_reached`. No revision |
| `iam.set_accounting_grant` | `audit_degraded`; `access_denied`; `validation_failed` / `grantee_not_operator` at `granteeAccountId` (not an active operator); `conflict_duplicate` / `grant_exists`. No revision |
| `iam.revoke_grant` | Not privileged. `access_denied` (unknown grant); `stale_revision` (not active: revoked, closed at its time limit, ended by a suspension or an elevation; or another revision) |
| `iam.start_support_view` | `audit_degraded`; `access_denied` (unknown account; not a staff session); `validation_failed` / `support_view_target_not_eligible` (own account; a SuperAdmin); `unavailable_dependency` / `clock_degraded`; `conflict_duplicate` / `support_view_active`. Not checked: the viewed account's status |
| `iam.start_email_change` | `validation_failed` / `email_invalid` at `newEmail` (binding); `rate_limited` / `rate_limited`; `access_denied` (not a travel agent; account not active); `stale_revision`; `validation_failed` / `email_unchanged` at `newEmail`; `conflict_duplicate` / `email_change_open` |
| `iam.confirm_email_change` | `unauthenticated` / `session_expired` (no session); `rate_limited` (per network address and per session); `input_invalid` at `code` (`invalid_format`: not 8 digits after spaces and hyphens are removed) or `proof` (`invalid_value`); `access_denied` (another session; unknown change); `stale_revision` (wrong state for the proof; other revision; the address changed since the start); `validation_failed` / `otp_invalid_or_expired` at `code`. **Accepted, not a success:** `invalid` (wrong code; `ended` `attempts_exhausted` at the last attempt), `invalid` with `ended` `expired`, `invalid_address` |
| `iam.cancel_email_change` | `access_denied`; `stale_revision` (not open; other revision) |
| `dlv.acknowledge_notice` (`ops.notices.acknowledge`, `admin.notices.acknowledge`) | `access_denied` (not the recipient; unknown); `validation_failed` / `ack_not_required`; `conflict_duplicate` / `already_acknowledged`; `stale_revision` |
| BFF answers (no Core call) | In a support view: every POST except "End support view" and sign-out → uniform 404; every `/admin` page or POST → 409 page `support_view_active`. A route parameter that does not parse → uniform 404. No route exists for a staff change of a travel agent's address: a hand-made POST to `/admin/accounts/:accountId/email` → uniform 404 |

## 1. Scope

### 1.1 Pages

| Page | Host and path | Part in WP-15 |
|---|---|---|
| SA-06c Account (WP-02 page) | 4652 `/admin/accounts/:accountId` | Section "Access and support" rebuilt as facts and links (the four carried forms leave); the open request block; the grants section; history scope |
| SA-06q Request elevation | 4652, new GET named by the design; POST `/admin/accounts/:accountId/elevation` | Host of `iam.request_elevation` |
| SA-06e Elevation requests | 4652 `/admin/elevations` (kept, rebuilt) | Open and decided requests; links to SA-09s; no form |
| SA-09s Decide an elevation request | 4652 `/admin/elevations/:elevationId/decide/:kind`, `kind` ∈ {`approve`, `decline`}; POST `…/approve`, `…/decline` | Host of `iam.approve_elevation` and `iam.decline_elevation` (the requester's decline is a withdrawal) |
| SA-06k Reset the second factor | 4652, new GET; POST `/admin/accounts/:accountId/reset-credentials` | Host of `iam.reset_credentials` |
| SA-06g Grants | 4652 `/admin/grants` (kept, rebuilt) | Active and ended grants; links to SA-06n and SA-06x; no form |
| SA-06n Give read access to a group | 4652, new GET; POST `/admin/grants` | Host of `iam.create_group_read_grant` |
| SA-06x Revoke a grant | 4652, new GET; POST `/admin/grants/:grantId/revoke` | Host of `iam.revoke_grant` (both kinds) |
| SA-06t Give the accounting grant | 4652, new GET; POST `/admin/accounts/:accountId/accounting-grant` | Host of `iam.set_accounting_grant` |
| SA-06v Open a support view | 4652, new GET; POST `/admin/support-view` | Host of `iam.start_support_view` |
| Support-view mode (SH-R09) | 4652, every travel-agent or operator page served in a support view; the banner of SH-01 | Banner words, scope, no action, exit; the access changes of V22 |
| TA-12 Your account (WP-01 page) | 4650 `/account` | Identity, sessions, the address section, the pending line, the lost-mailbox boundary |
| TA-12e Change your sign-in address | 4650 `/ta/account/email` (kept, rebuilt); POST `/ta/account/email`, `…/confirm`, `…/cancel` | Hosts of `iam.start_email_change`, `iam.confirm_email_change`, `iam.cancel_email_change` |
| OP-10 Notices and account (operator) | 4652 `/ops/notices`, `/ops/notices/:noticeId` (OP-10n), `/account` | Notices list and notice (rebuilt); host of `dlv.acknowledge_notice` on the operator route; the account part of WP-01 observed |
| SA-10 Notices and account (SuperAdmin) | 4652 `/admin/notices`, `/admin/notices/:noticeId` (SA-10n), `/account` | As OP-10 for SuperAdmins (CC-03); host of `dlv.acknowledge_notice` on the admin route |
| SA-06a, SA-06d (WP-02); SA-01 (WP-06); SA-04g (WP-11); OP-01, OP-02 (WP-07); SA-08a, SA-08s (WP-14); PUB-02, SH-02, enrolment pages (WP-01) | 4652 / 4650 | Links to the WP-15 pages; observation of the consequences |

Reads: `iam.admin_account`, `iam.operator_duties`, `iam.admin_accounts`, `iam.admin_elevations`, `iam.admin_grants`,
`iam.email_change_page`, `iam.account_page`, `dlv.notices`, `dlv.notice`; optional `core.admin_group`; `core.operation`.

### 1.2 Command coverage (CC §5.1: 11 WP-15 commands; CC-03)

UI-PLAN §12.2 names "Request/Approve elevation, Reset credentials, Grant/Revoke read access, email change commands".
The register adds `iam.decline_elevation` (SA-06 MUST offer decline), `iam.set_accounting_grant`,
`iam.start_support_view` and `iam.cancel_email_change`, and CC-03 adds the operator and SuperAdmin routes of
`dlv.acknowledge_notice`. WP-02 carried four of these forms on SA-06c and left the elevation and grant pages unchanged
(WP-02 design §1.5); WP-15 gives each command one host page and removes the carried entries.

| # | Command | Route id (POST path) | Host page | Items |
|---|---|---|---|---|
| 1 | `iam.request_elevation` | `admin.accounts.elevation` (`/admin/accounts/:accountId/elevation`) | SA-06q | A06 to A11 |
| 2 | `iam.approve_elevation` | `admin.elevations.approve` (`/admin/elevations/:elevationId/approve`) | SA-09s `approve` | A15 to A18, A21 to A24 |
| 3 | `iam.decline_elevation` | `admin.elevations.decline` (`/admin/elevations/:elevationId/decline`) | SA-09s `decline` (the requester's view reads "Withdraw your request") | A19 to A21, A23, A24 |
| 4 | `iam.reset_credentials` | `admin.accounts.reset_credentials` (`…/reset-credentials`) | SA-06k | A25 to A29 |
| 5 | `iam.create_group_read_grant` | `admin.grants.create` (`/admin/grants`) | SA-06n | A33 to A38 |
| 6 | `iam.revoke_grant` | `admin.grants.revoke` (`/admin/grants/:grantId/revoke`) | SA-06x | A39 to A42, A46 |
| 7 | `iam.set_accounting_grant` | `admin.accounts.accounting_grant` (`…/accounting-grant`) | SA-06t | A43 to A45 |
| 8 | `iam.start_support_view` | `admin.support_view.start` (`/admin/support-view`) | SA-06v | A47 to A51 |
| 9 | `iam.start_email_change` | `ta.account.email.start` (`/ta/account/email`) | TA-12e step 1 | A66 to A68 |
| 10 | `iam.confirm_email_change` | `ta.account.email.confirm` (`/ta/account/email/confirm`) | TA-12e steps 2 and 3 | A69 to A73, A75, A76 |
| 11 | `iam.cancel_email_change` | `ta.account.email.cancel` (`/ta/account/email/cancel`) | TA-12e (steps 2 and 3; the other-browser state) | A74, A75 |
| CC-03 | `dlv.acknowledge_notice` | `ops.notices.acknowledge`, `admin.notices.acknowledge` (`/<surface>/notices/:noticeId/acknowledge`) | OP-10n; SA-10n | A80, A81 |
| ref | `iam.end_support_view` (WP-01) | `admin.support_view.end` | SH-01 banner | A52, A58 |
| ref | `iam.sign_out` (WP-01) | `sign_in.sign_out` | `/account` (TA-12, OP-10, SA-10) | A65, A83 |

All of them also: A91 to A105. Commands outside WP-15 that the proof touches only as set-up or observation:
`iam.create_account`, `iam.approve_account`, `iam.activate_account`, `iam.suspend_account`, `iam.restore_account`
(WP-02); `iam.staff_enrol`, `iam.open_enrolment`, `iam.request_ta_otp`, `iam.verify_ta_otp`, `iam.request_staff_otp`,
`iam.staff_sign_in` (WP-01, through the harness); `core.create_group`, `intake.start_individual`, `core.edit_draft`,
`core.submit` (WP-03); `pay.record_service_status`, `core.assign` (WP-06); `dlv.retrieve_document` (a byte release,
V22-7 and V22-10). The ceiling commands of V21 (`pay.lower_ceiling`, ceiling increase request and approval) are WP-07's
(WP07-A83 to A89).

### 1.3 State coverage

S1 (loading) does not apply: every WP-15 page is server-rendered. S5 applies only to SA-01 (observation).

| Page | Page states | C1 validation | C2 rejected | C3 accepted | C4 unresolved | C5 stale |
|---|---|---|---|---|---|---|
| SA-06c section | Per role and status; open request (also past its end); grants (also past their end); history A01 to A04 | — | — | — | — | — |
| SA-06q | Form A06; duties, no authenticator, open request, not an operator, own account (no form) A08; audit behind A11 | A09 | A08, A09 | A07 | A94 | A09 |
| SA-06e | Open; past its end; decided; cap; one active SuperAdmin A12, A13 | — | — | — | — | — |
| SA-09s | Second SuperAdmin A15; requester A17; target A18; decided, past its end, audit behind A21, A22 | A21 | A17, A21 | A16, A19, A20, A22 | A94 | A21, A23 |
| SA-06k | Staff active or suspended A25; travel agent, own account A27 | A28 | A27, A28 | A26 | A94 | A28 |
| SA-06g | Active; past its end; ended; cap; audit behind A30 to A32 | — | — | — | — | — |
| SA-06n | Group context; chooser; at the limit; audit behind; clock unhealthy A33, A35, A37 | A35 | A35, A36, A37 | A34 | A94 | — (no revision) |
| SA-06x | Active A39; ended (no form) A41 | A41 | A41 | A40 | A94 | A41 |
| SA-06t | Operator without the grant A43; holds it; not an operator A45 | A45 | A45 | A44 | A94 | — (no revision) |
| SA-06v | Eligible A47; not eligible, not active, support view open A49, A50 | A50 | A49, A50 | A48 | A94 | — |
| Support-view mode | Banner; travel agent and operator scope; access change; end; expiry A52 to A59 | — | A56, A57 | — | — | — |
| TA-12, TA-12e | No change; step 2; step 3; other browser; ended; in a support view A65 to A75 | A68, A70 | A68, A70, A72, A73 | A67, A69, A71, A74 | A94 | A76 |
| OP-10, OP-10n, SA-10, SA-10n | Views, cap, S2, S3, S7; acknowledgement needed, not needed, done A79 to A86 | — | A80, A81 | A81 | A94 | A81 |

### 1.4 Specification scenarios

| Scenario | What WP-15 shows | Items |
|---|---|---|
| V21 clause 1: "One SA can suspend in emergency/lower exposure" | One SuperAdmin suspends E (now a SuperAdmin) without a second approval (WP-02 command, observed); decline, revoke and suspension stay available while the audit record is behind; the ceiling decrease is WP-07's | A11, A32, A41; §3 V21-8, V21-T1; WP02-A94, A102; WP07-A83 |
| V21 clause 2: "distinct second SA is required for ordinary SA elevation/ceiling increase" | SA1 requests E's elevation; SA1 and E cannot approve; SA2 approves; restoration of a suspended SuperAdmin is a request that the requester withdraws and a second SuperAdmin declines; an approval after the end records the expiry only; with one active SuperAdmin no request can be approved; privileged elevation waits for the audit record. The ceiling increase is WP-07's | A06 to A24; §3 V21-5 to V21-9a, V21-T1 to V21-T3; WP02-A88, A98; WP07-A87 to A89 |
| V21 clause 3: "TA email has no admin override" | No staff page or route changes a travel agent's address, also in a support view; only Y changes it, with a code at the current address and then at the new address; the switch ends every session and moves sign-in and documents together | A65 to A78; §3 V21-10, V21-11 to V21-11e; WP02-A101; WP01-A56 |
| V22 clause 1: "Support view matches selected user's current read scope" | SA1 sees exactly Y's, OP2's and OP1's current reads, never SA1's own scope (a `syn-ta-2` application is not found); a read grant shows in OP2's support view while it is active and disappears with its revocation; a suspended viewed account reads nothing | A47 to A54, A59; §3 V22-1 to V22-4, V22-8, V22-11, V22-12 |
| V22 clause 2: "offers no impersonation/action" | No form, task link, download or acknowledge control in a support view; a hand-made POST is not found and records nothing; admin pages answer the support-view page; the exit stays reachable | A52, A55 to A58; §3 V22-2 to V22-5, V22-11 |
| V22 clause 3: "revoked old links/background results deny metadata/bytes" | After the revocation OP2's open page, its old links and its old download form deny; a same-key byte release is checked again and denied; background requests and operation-status reads after an access change show no earlier facts | A59, A61 to A64; §3 V22-9, V22-10, V22-T2 |
| UX §2.3 Support view and read grant rows | Support view = the selected user's scope, read-only, never impersonation; a read grant adds no case action | A33, A43, A53 to A56, A61; WP07-A08, A35 |
| UX §6.3 Account changes | Each action names the individual and its consequences; credential recovery resets and nobody sees or chooses a secret; no first-admin, all-admin-loss or lost-mailbox bypass | A06, A15, A25 to A29, A99; WP02-A89 |
| UX §6.3 Support view | Banner "Read-only view for [individual]", current scope, clear exit; full audit is a separate SuperAdmin page | A52, A58, A60 |
| UX §4.2 Account; §5.2 Notices and account; AD-07 (SA-10); CC-03 | TA-12 and the two-proof change; operator and SuperAdmin notices with acknowledgement facts and no read marker (LD-06); the accounting grant never turns OP-10 into an Accounts product | A65 to A87; A44, A46 |
| UX §8.3 Revoked access/session, Lost acknowledgement, Stale revision | Restricted content removed; old links deny; the original operation is reconciled; changed facts shown before a new decision | A21, A41, A59, A61 to A63, A71, A94 |
| BS B09, B10, B11, B12, B33, B35, B44 | As the rows above; B33: privileged elevation waits for the audit record, emergency containment remains; B35: one result per key; B44: parked recovery policies shown as boundaries | A11, A27, A32, A50, A62, A65, A95 |
| UX §12 V24 (keyboard and phone) | The WP-15 task pages, the support-view banner and TA-12e by keyboard and at 390 px | A106 to A117 |

## 2. Acceptance checklist

WP-02 items stay WP-02's and are not repeated: the account list and its "Open elevation requests" count (WP02-A83), the
create form (A84 to A90), the status actions and their receipts (A91 to A100), no staff address control (A101), the
emergency suspension while the audit record is behind (A102). WP-01 items stay WP-01's: the account page's identity,
sessions and sign-out parts (WP01-A70, A71, A72), "Sign out everywhere" (A55, A71), the landing after an address change
(A56), no code or password control (A58), the enrolment pages (A67). WP-07 owns the grantee's read-only views (WP07-A08,
A35) and the ceiling part of V21 (WP07-A83 to A89). WP-15 items extend them where the WP-15 states change what those
pages show.

### 2.1 SA-06c Account: section "Access and support"

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP15-A01 | SuperAdmin (SA1); test | SA-06c of E, OP1, Y, SA2 and of SA1's own account (§3 V21-1, V21-3a, V21-4); test: every role × status × authenticator × open request × accounting grant | Read the section "Access and support" on each page. | The section holds facts and links only; no form. Links by facts: an active operator with an authenticator and no open request: "Request elevation to SuperAdmin" (SA-06q); an active operator without the accounting grant: "Give the accounting grant" (SA-06t); an operator who holds it: the grant fact and "Revoke" (SA-06x); a staff account other than the reader's, active or suspended: "Reset the second factor" (SA-06k); an active travel agent or operator other than the reader, outside a support view: "Open a support view" (SA-06v). A travel agent: no reset link; the §11.3 boundary "Signing in without access to the current email address is unavailable until the product owner approves a recovery rule. Owner: product owner." A SuperAdmin: no elevation, accounting or support-view link. The reader's own account: no reset, elevation or support-view link. An operator with duties (OP1): "Request elevation" is replaced by the reason (A08). Every link opens its page. The section says "Each action needs a reason and is recorded." | L+T | PL SA-06; UX §6.3; CC-12 to CC-18; `accounts/pages.ts:581-600` |
| WP15-A02 | SuperAdmin (SA1) | SA-06c of E with an open request (§3 V21-5); test: a request past its end | Read the request block. | "Open elevation request: [kind words], requested by [name] on [time] IST. Expires [time] IST." with "Decide" (SA-09s) for a SuperAdmin other than the requester and the target, "Withdraw your request" (SA-09s `decline`) for the requester, and "Elevation requests" (SA-06e). No approve form on SA-06c. Test: when the read time is at or after the end: "Expired [time] IST. It can no longer be approved." with no "Decide" link. | L+T | `iam.admin_account.openElevation`; WP-02 design §4.3 |
| WP15-A03 | SuperAdmin (SA1); test | SA-06c "Grants" of E holding the accounting grant (§3 V21-1) and of OP2 holding the read grant (V22-6); test: a grant past its end, 200 grants | Read the section. | One row per active grant from the read: kind words; group (reference linking SA-04g) or "—"; purpose; from, until (or "No end time"); granted by and on. A grant whose end is at or before the read time reads "Ended [time] IST (time limit reached)" and is never called active. Each active row links "Revoke" (SA-06x). "All grants: Grants" links SA-06g. With 200 rows: "This list may be incomplete." and no total. | L+T | `iam.admin_account.grants` (max 200); B-14 |
| WP15-A04 | SuperAdmin (SA1); test | SA-06c "History" of E after V21-3, V21-7, V21-8, and of Y after V21-11c | Read the history. | Rows come only from facts on the account subject, each with title words, actor ("[name] (role)", "TravelMudra (automatically)"), "Recorded [time] IST" and the reason: E's "Second factor reset" (SA1), "Suspended" (SA1); Y's "Sign-in address changed" (actor Y; no addresses in the row). No row is built for facts on other subjects: the elevation decision, the grants and the support views show as links ("Decided requests: Elevation requests"; "Grants"; "Support views: Audit") and the role line reads "Role: SuperAdmin" (current). "Who approved" an older request than the newest 50 decided is "Partly met" (§6 Q-06). | L+T | B-06; WP-11 I-10; `historyOf` (facts on the account subject) |
| WP15-A05 | Test (`accounts-pages.test.ts`, carried-form test of WP-02 §8.2) | SA-06c for every role and status | Run the tests. | The carried-form list no longer holds `iam.reset_credentials`, `iam.request_elevation`, `iam.set_accounting_grant` and `iam.start_support_view`. SA-06c renders no form whose action is a WP-15 POST path. Every link of the section targets a registered GET route. The seven system tests that posted `/admin/support-view` from `/admin/accounts/:id` now load SA-06v first (WP-02 design §8.3). | T | CC-12 to CC-18; WP-02 design §1.5, §8.2 |

### 2.2 Request elevation: SA-06q (`iam.request_elevation`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP15-A06 | SuperAdmin (SA1) | SA-06q of E (§3 V21-5) | Read the page from the top. | Frame: breadcrumb "Accounts & access › Accounts › [E] › Request elevation"; `h1` "Request elevation to SuperAdmin: [E]". Scope: name, role "Operator", status "Active", authenticator "Set up on [time] IST", "Read at [time] IST". What Core checks: "[E] holds no assigned application, reconciliation duty, open hold or incident." with the duty counts from `iam.operator_duties` (or "Duties: cannot be read now. TravelMudra checks them again when the request is decided."). Effect: "A request opens. A second, different SuperAdmin decides it before it ends. On approval [E] becomes a SuperAdmin: every session of [E] ends and every grant of [E] ends; [E] signs in again." Hard stop: "You cannot approve your own request." Reason (required). Review before the button "Request elevation"; "Cancel" → SA-06c. No configured lifetime ("72 hours") on the page: the end time shows after the request from the read. | L | PL SA-06; UX §6.3; BS B11; WP-01 Q-13 |
| WP15-A07 | SuperAdmin (SA1, SA2) | SA-06q of E (§3 V21-5) | Give the reason "WP15 [stamp] elevation of a synthetic operator for the access proof"; send. Read SA-06c, SA-06e and SA-01 as SA1 and as SA2. | 303 to SA-06c of E; receipt "Elevation requested" (§0.2); Current: the open request block (A02) with "Expires [time] IST". SA-06e lists it under "Waiting for a decision". SA-01 group 7: "SuperAdmin elevation requests" +1 for both; for SA1 "1 of them requested by you: a different SuperAdmin decides those."; SA-06a "Open elevation requests" +1 (deltas from P-0). | L | `iam.request_elevation`; WP-06 design §2.1 group 7; WP06-A04 |
| WP15-A08 | SuperAdmin (SA1); harness; test | SA-06q states (§3 V21-4); tests | Live: open SA-06q of OP1 (holds D). Harness: post the request for OP1 with OP1's current revision. Test: an operator without an authenticator; an operator with an open request; a travel agent; a SuperAdmin; the reader's own account; a suspended operator; the duties read unavailable. | OP1: no form; "[OP1] holds duties: [n] assigned applications, …. Hand them over before an elevation. Open duties and hand-off." (link SA-06d). Harness post: refused `elevation_target_has_duties` ("This operator still holds assigned work or incidents. Hand them over first."), nothing recorded (open requests delta 0). Tests: no authenticator: no form, "[name] has no authenticator set up yet."; open request: no form, link to it; travel agent, SuperAdmin, own account, suspended: the page states that elevation applies only to an active operator other than you, no form. Duties read unavailable: the form shows with the sentence of A06 (Core checks again). | L+T | §0.5; WP-09 G-05; WP-07 D-W07-16 |
| WP15-A09 | SuperAdmin; harness; test | SA-06q refusals | (1) Live (§3 V21-5, before the request): send with an empty reason, then with "short". (2) Test: E changed by another SuperAdmin after the page loaded (revision); `elevation_open` (a second SuperAdmin requested meanwhile, new key); own account (raw); unknown account (raw). | (1) C1 "Give a reason of at least 10 characters." at the reason; the typed text kept; nothing sent. (2) Stale: CMP-14 "Changed since your review" with E's current status and role ("[status] since [time] IST"), the reason kept, no earlier fact claimed; `elevation_open`: "This operator already has an open elevation request." with the link to it; own account: `second_superadmin_required` sentence; unknown: the uniform 404. Nothing recorded. | L (1) + T | §0.5; CMP-14; WP-02 R-01, R-03 |
| WP15-A10 | SuperAdmin (SA1); harness | The Nth time on SA-06q (§3 V21-5a) | Replay terms 1 to 5 after the accepted request. | (1) Same 303 and receipt; one request. (2) Refused as a used form, values kept. (3) Back reloads SA-06q: no form, "[E] already has an open elevation request" with the link. (4) A refused send leaves no record; the corrected send is recorded once. (5) As A94. A business duplicate (new key) answers `elevation_open` (A09). | L+T | BS B35; PL §7 K-2P |
| WP15-A11 | Test | SA-06c, SA-06q while the audit record is behind (`auditOk` false) | Render; send the request. | The "Request elevation" link stays with the visible reason "Unavailable while the audit record is behind. Suspension, declines and revocations still work." (`aria-describedby`); SA-06q shows no form and the same reason. A hand-made send: refused `audit_degraded` with that sentence; nothing recorded. | T | BS B33; UX §12 V21; kernel `privilegedElevation` |

### 2.3 Elevation requests: SA-06e

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP15-A12 | SuperAdmin (SA1, SA2) | SA-06e (§3 V21-5, V21-7, V21-9, V21-9a) | Open the tab "Elevation requests". Read both sections at each step. | `h1` "Elevation requests"; lead "Creating, elevating or restoring a SuperAdmin needs a request by one SuperAdmin and a decision by a second, different one." (no configured lifetime); "Read at [time] IST". "Waiting for a decision": one block per open request: kind words, target (link SA-06c) and role, requested by and when, request reason, "Expires [time] IST"; action link "Decide" (SA-09s `approve` and `decline`) for a reader who is neither requester nor target; "You requested this. A second, different SuperAdmin decides it." and "Withdraw your request" for the requester. "Decided": newest first, state words of §0.2 with the decider, the time and the decision reason; at 50 rows "The newest 50 decided requests are shown." No form on SA-06e. S2 for an empty section: "No request waits for a decision." | L | `iam.admin_elevations`; B-14; WP-01 Q-13 |
| WP15-A13 | Test | SA-06e, SA-06a, SA-01 group 7 with a request past its end that the cleanup task has not closed; an installation with one active SuperAdmin | Render. | The row reads "Expired [time] IST. It can no longer be approved." and offers no "Decide" approve link (a decline link MAY remain; Core accepts it). The count lines say what they count ("open or past their end, not yet closed") or exclude such rows when the page has the list; no line claims they can be approved. With one active SuperAdmin: "No second active SuperAdmin exists, so this request cannot be approved. It ends at [time] IST." and the §11.3 boundary for all-admin-loss recovery (owner: product owner). | T | §0.1 reads; BS B11, B44; WP02-A89 |
| WP15-A14 | SuperAdmin (SA1) | SA-01 group 7; SA-06a meta; SA-06c of E (§3 V21-5, V21-7) | Follow each link to the requests. | Each link opens SA-06e (or the request's SA-09s for a single request). The counts move by +1 after V21-5 and back to the P-0 values after V21-7, V21-9 and V21-9a (each decided in the run). | L | WP06-A04; WP02-A83 |

### 2.4 Decide an elevation request: SA-09s (`iam.approve_elevation`, `iam.decline_elevation`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP15-A15 | SuperAdmin (SA2) | SA-09s `approve` of E's request (§3 V21-7) | Read the page from the top. | CMP-25 frame. `h1` "Approve an elevation: [E]". Scope: kind "Operator to SuperAdmin", target (role, status now, authenticator), requested by [SA1] on [time] IST, the request reason, "Expires [time] IST". Evidence: the target's duties now (or "cannot be read now"). Effect by kind: operator: "[E] becomes a SuperAdmin. Every session of [E] ends; [E] signs in again. Every grant of [E] ends and is not restored."; new SuperAdmin: "The account becomes Approved. A SuperAdmin activates it; an enrolment code then goes to its own address."; restoration: "The account becomes Active. [If it has no authenticator: an enrolment code goes to its own address.]" Hard stops: "TravelMudra checks again that you are not the requester or the target, that the requester is still an active SuperAdmin and that the target is unchanged." Reason (required). Review before "Approve the elevation"; "Cancel" → SA-06e. | L | PL SA-09 (SA elevation second approval), §7 K-2P; UX §6.3; BS B11 |
| WP15-A16 | SuperAdmin (SA2); E; harness | SA-09s `approve` (§3 V21-7) | Give the reason "WP15 [stamp] second approval of the synthetic operator"; send. E reloads its open page. The harness signs E in. | 303 to SA-06e or SA-06c of E with the receipt "Elevation request approved" (`result` `approved`); Current (read after): E's role "SuperAdmin", status "Active"; SA-06e: "Approved by [SA2]" with the time and reason. E's open page → the staff sign-in page (session ended, WP01-A76 pattern). E signs in and sees the SuperAdmin rail (WP01-A07). E's grants: none active (none held at this step). SA-01 group 7 back to its P-0 value. | L | `iam.approve_elevation`; BS B11 |
| WP15-A17 | SuperAdmin (SA1, the requester); harness | SA-09s `approve` of E's request (§3 V21-6) | Open the approve page. Harness: send the approval as SA1 with the current revision. | No approve form. "You requested this elevation. A second, different SuperAdmin decides it." with "Withdraw your request" (SA-09s `decline`). Harness: refused `second_superadmin_required` ("A second, different SuperAdmin must decide this. The requester and the target cannot approve it."); nothing recorded (request revision unchanged). | L | §0.5; PL §7 K-2P; UX §12 V21 |
| WP15-A18 | E (operator); harness; test | SA-06e and SA-09s as the target (§3 V21-6a); test: the pending target of a new SuperAdmin request | E opens `/admin/elevations` and the SA-09s address. Harness posts the approval as E. | E: SH-02 denied without the request's facts (an operator has no SuperAdmin page); the post: uniform 404; nothing recorded. Test: a pending SuperAdmin account cannot sign in, so it cannot decide; a raw approval in the target's name answers `second_superadmin_required`. | L+T | BS B10, B11 |
| WP15-A19 | SuperAdmin (SA2) | SA-09s `decline` of the second restoration request of E (§3 V21-9a) | Read; give a reason; send. | The page states the effect by kind: restoration: "[E] stays suspended."; operator: "[E] stays an operator."; new SuperAdmin: "The new account [name] is declined too. Its address becomes free for a new account." Button "Decline the request". Receipt "Request declined"; Current: E "Suspended"; SA-06e "Declined by [SA2]". Decline works while the audit record is behind (A21). | L | `iam.decline_elevation`; `elevation.ts:140-171` |
| WP15-A20 | SuperAdmin (SA1, the requester) | SA-09s `decline` of the first restoration request of E (§3 V21-9) | Read; give a reason; send. | The requester's view reads "Withdraw your request" with "The request ends. Nothing changes on [E]'s account."; button "Withdraw the request". Receipt "Request withdrawn" (`result` `withdrawn`); SA-06e "Withdrawn by the requester". | L | `elevation.ts:156-161` |
| WP15-A21 | SuperAdmin (SA1, SA2, two tabs); test | SA-09s races and Core rechecks (§3 V21-7a); tests | Live: SA2 loads `approve` in tab 1 and `decline` in tab 2; tab 1 approves; tab 2 sends. Tests: the requester was suspended after the request; the operator target gained an assigned application; a restoration target was restored another way; the audit record behind (approve and decline); one active SuperAdmin. | Tab 2: CMP-14 "Decided since your review: Approved by [SA2] at [time] IST" (`stale_revision`), the typed reason kept as an unsent value, no second decision. Tests: `elevation_requester_inactive` "The SuperAdmin who asked for this is no longer active, so it cannot be approved. Decline it, and ask again if it is still needed."; `elevation_target_has_duties` with the link to SA-06d; `stale_revision` with the target's current status; audit behind: the approve page shows no form with the reason of A11, the decline page works and is accepted; one active SuperAdmin: A13. Nothing recorded for a refusal. | L (tab 2) + T | §0.5; CMP-14; BS B11, B33 |
| WP15-A22 | Test | SA-09s at and after the request's end | (1) Render `approve` when the read time is past the end. (2) Send an approval loaded before the end and sent after it. | (1) No approve form: "This request ended at [time] IST. It can no longer be approved." (2) Core accepts and records the expiry (`result` `expired`): the receipt reads "This request had expired. It is now recorded as expired. Nothing was approved."; it never shows "approved"; SA-06e lists it as "Expired". | T | `elevation.ts:86-90` |
| WP15-A23 | SuperAdmin (SA2); harness | The Nth time on SA-09s (§3 V21-7a, V21-9) | Replay terms 1 to 5 on the approval and the withdrawal. | (1) Same 303 and receipt; one decision. (2) Refused as a used form, values kept. (3) Back reloads SA-09s: the decision shows ("Approved by [SA2] at [time] IST"), no form. (4) A refused send leaves no record. (5) As A94. A new key on a decided request answers CMP-14 (`stale_revision`). | L+T | BS B35 |
| WP15-A24 | SuperAdmin (SA1, SA2); test | WP-02 receipts and pages that open a request (create a SuperAdmin, restore a SuperAdmin) | Live (§3 V21-9): SA1 restores E; read the receipt and SA-06c. Test: a new SuperAdmin account approved on SA-09s; a restoration of a SuperAdmin without an authenticator. | The WP-02 receipts and SA-06c link to SA-09s of the request (no old elevation page remains). WP02-A88 and A98 complete on SA-09s. Restoration without an authenticator: the effect line and the receipt say that an enrolment code goes to the account's own address and that nobody sees it. "Who approved" is shown on SA-06e (newest 50) and in the audit; SA-06c shows it only while the request is open ("Partly met" for older decisions, §6 Q-06). | L+T | WP-02 Q-W02-03, §3 Part E; WP02-A88, A98 |

### 2.5 Reset the second factor: SA-06k (`iam.reset_credentials`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP15-A25 | SuperAdmin (SA1) | SA-06k of E (§3 V21-3) | Read the page. | `h1` "Reset the second factor: [E]". Scope: role, status, "Authenticator: Set up on [time] IST", the latest enrolment (state, purpose, mail state, expiry) when one exists, "Read at". Effect: "The authenticator of [E] is removed. Every session of [E] ends, an open enrolment stops working and every live sign-in code stops working. A new enrolment code goes to [E]'s own address; you never see it." (suspended: "The enrolment code is sent when the account is restored."). "Nobody can see or choose an authenticator key." Reason (required). Destructive button "Reset the second factor"; "Cancel". | L | UX §6.3; BS B08, B11; PL SA-06 |
| WP15-A26 | SuperAdmin (SA1); E; harness | SA-06k of E (§3 V21-3) | Give a reason; send. E reloads its open page. Read SA-06c of E. The harness enrols E again. | Receipt "Second factor reset"; Current on SA-06c: "Authenticator: Not set up"; "Enrolment: issued (reset); mail [state]; expires [time] IST. The code is never shown here."; open sessions 0. E's page → staff sign-in. The harness enrols E with the new code (WP01-A67) and signs E in. No page shows a code, a key or a QR image to SA1. | L | `iam.reset_credentials`; BS B11 |
| WP15-A27 | SuperAdmin (SA1); harness | SA-06c of Y and of SA1 (§3 V21-3a) | Look for a reset link. Harness: post the reset for Y; post the reset for SA1's own account. | Y: no reset link; the boundary of A01. The post: refused `parked_lost_mailbox_recovery`, shown as "A travel agent has no stored credential: sign-in uses the current address. Recovery without access to that address is unavailable until the product owner approves a recovery rule. Owner: product owner." (§11.3); nothing recorded. Own account: no link; the post: "You cannot reset your own second factor. Ask another SuperAdmin." (`self_action_not_allowed`); nothing recorded. | L | §0.5; BS B09, B44; PL §13.2 B-02 |
| WP15-A28 | SuperAdmin; test | SA-06k refusals | (1) Live (§3 V21-3, before the send): send with a blank reason. (2) Test: a stale revision; a pending, approved or declined staff account (raw); the audit record behind. | (1) C1 at the reason, nothing sent. (2) Stale: CMP-14 with the current status and authenticator; pending/approved/declined: "A second factor can be reset only on an active or suspended staff account." (`stale_revision` answered with the current status); audit behind: no form on SA-06k with the reason of A11 and `audit_degraded` for a raw send. Values kept; nothing recorded. | L (1) + T | §0.5 |
| WP15-A29 | SuperAdmin; harness; test | The Nth time on SA-06k (§3 V21-3b) | Replay terms 1 to 5. Test: a second reset with a new key and the current revision. | (1) Same receipt; one reset; one enrolment. (3) Back reloads SA-06k with the current facts: "An enrolment code was sent on [time] IST. A new reset replaces it." (2), (4), (5) as the terms. The second reset is accepted (Core has no duplicate guard); the page claims none and showed the existing enrolment before the button. | L+T | WP-08 Q-W08-15; BS B35 |

### 2.6 Grants: SA-06g

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP15-A30 | SuperAdmin (SA1) | SA-06g (§3 V22-6, V22-9) | Open the tab "Grants". Read it. | `h1` "Grants"; lead "Read access lets one operator read one group's applications, their history and their documents, and download the documents, for a named purpose until a set time, with no action. At most [n] days and at most [m] active grants per operator." (n and m from the read); "Read at". Primary link "Give read access to a group" (SA-06n). "Active": rows with kind words, operator (link SA-06c), group (link SA-04g), purpose, from, until, granted by and on, "Revoke" (SA-06x). "Ended": newest first with the end words of §0.2 and the end time; at 50 rows "The newest 50 ended grants are shown." No form on SA-06g. Accounting grants: "Given on the operator's account page." | L | `iam.admin_grants`; PL SA-06; SH-R10 |
| WP15-A31 | Test | SA-06g with a grant past its end not yet closed; grants ended by suspension and by elevation; 50 ended | Render. | The row past its end reads "Ended [time] IST (time limit reached)", is not called active, and its revoke link, if offered, says "Access already ended." End reasons in words (never `grantee_elevated`). The ended list states its cap. | T | §0.1 reads; WP-14 K-11 class |
| WP15-A32 | Test | SA-06g, SA-06n, SA-06t while the audit record is behind | Render; send a create and a revoke. | "Giving read access or an accounting grant is unavailable while the audit record is behind. Revoking stays available." The create links show the reason; a raw create answers `audit_degraded`; a revoke is accepted. | T | BS B33 (containment stays available); `revoke_grant` not privileged |

### 2.7 Give read access to a group: SA-06n (`iam.create_group_read_grant`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP15-A33 | SuperAdmin (SA1) | SA-06n for G, opened from SA-04g of G or as the design routes it (§3 V22-6; §6 Q-05) | Read the page. | `h1` "Give read access to a group". Group: the label, travel dates and state of G from `core.admin_group`, "Read at" (the group comes from the address context, never a reference typed without the group's facts shown before the button). Operator: a radio or select of active operators with an authenticator, none preselected. "Named purpose" (required, 10 to 500 characters). "Last day of access" (date): "Access ends at the end of this day, India Standard Time, at most [n] days from now." (n from the read). Effect: "[operator] can read this group's applications, their history and their documents, and download the documents, until [time] IST. It allows no action, no other group and no other travel agent. It does not open incidents, payments, notices or intake." Review before "Give read access"; "Cancel". | L | UX §2.3; BS B10; SH-R10; PL SA-06 |
| WP15-A34 | SuperAdmin (SA1); OP2 | SA-06n (§3 V22-6) | Choose OP2; purpose "WP15 [stamp] check the documents of a synthetic support case"; last day today + 1; send. OP2 opens OP-01. | 303 to SA-06g (or the grant's row); receipt "Read access given" only after the read by the returned grant id shows kind `group_read` (else neutral); Current: "Active until [end of today + 1, 23:59 IST]". OP2's OP-01 "Read-only access" section lists G with "Read-only access: [purpose], until [time] IST" (WP07-A08). | L | `iam.create_group_read_grant`; §0.2 "Receipts" |
| WP15-A35 | SuperAdmin; harness; test | SA-06n refusals | (1) Live (§3 V22-6, before the send): send with no operator and an empty purpose. (2) Harness (raw): a last day beyond the maximum; yesterday. (3) Tests: a travel agent or an operator without an authenticator as grantee (raw); an unknown group (raw); a value that is not a date; the clock unhealthy; the audit record behind; a forged grantee id. | (1) C1 at each field; nothing sent. (2) "Choose a last day from today to [last allowed day]." at the date (`grant_duration_exceeded`); values kept. (3) `grantee_not_operator` "Choose an active operator who has set up an authenticator." at the operator; unknown group: "No group has this reference." at the group (never at the operator); not a date: at the date; clock: form-level "Time-limited access cannot be given now because the server clock is not trusted. Nothing was recorded."; audit: A32; forged grantee: the uniform 404. Nothing recorded (grant deltas 0). | L (1), (2) + T | §0.5; LD-17 |
| WP15-A36 | SuperAdmin (SA1); harness; test | `grant_exists` (§3 V22-6a); test: the earlier grant is past its end, not yet closed | Harness: after A34, send a new key with the same operator and group. Test: the same with the earlier grant past its end. | Live: "[OP2] already has read access to this group until [time] IST." with a link to the grant (from `existing`); nothing new recorded. Test: accepted; the earlier grant shows "Ended (time limit reached)", the new one "Active until …". | L+T | §0.5; `grants.ts:57-70` |
| WP15-A37 | Test | SA-06n for an operator at the grant limit | Render; send. | The operator choice shows "[name] holds [k] of [m] active grants" from the read; at the limit the refusal "[name] already holds the maximum number of active read grants. Revoke one first." (`grant_limit_reached`); nothing recorded. | T | `grants.ts:71-74` |
| WP15-A38 | SuperAdmin (SA1); harness | The Nth time on SA-06n (§3 V22-6a) | Replay terms 1 to 5. | (1) Same 303 and receipt; one grant. (2) Refused as a used form, values kept. (3) Back reloads SA-06n with a fresh form and the existing grant of OP2 on G listed before the button. (4), (5) as the terms. A new key answers `grant_exists` (A36). | L+T | BS B35 |

### 2.8 Revoke a grant: SA-06x (`iam.revoke_grant`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP15-A39 | SuperAdmin (SA1, SA2) | SA-06x of E's accounting grant (§3 V21-2) and of OP2's read grant (V22-9) | Read the page. | `h1` "Revoke a grant: [operator]". Facts: kind, group (link) or "Accounting", purpose, from, until, granted by and on. Effect, read grant: "Access ends at [operator]'s next page, download or task run. Pages already open and old links stop working. A revoked grant is not restored: give a new one if needed."; accounting: "[operator] loses the Accounts page. No case access changes." Reason (required). Destructive button "Revoke the grant"; "Cancel". | L | UX §6.3; BS B10; SH-R04 |
| WP15-A40 | SuperAdmin (SA1, SA2) | SA-06x (§3 V21-2, V22-9) | Give a reason; send. | Receipt "Grant revoked"; Current: "Revoked [time] IST"; SA-06g moves the row to "Ended". The consequences are A46 and A61 to A62. | L | `iam.revoke_grant` |
| WP15-A41 | SuperAdmin (SA2, two tabs); test | SA-06x ended states and races | Live (§3 V22-9): SA2 loads SA-06x of OP2's grant in two tabs; tab 1 revokes; tab 2 sends after. Tests: a grant closed at its time limit; ended by suspension; ended by elevation; the audit record behind; a blank reason. | Tab 2: CMP-14 "Revoked since your review at [time] IST", no second record. Reload: no form, "This grant ended on [time] IST ([end words])." Audit behind: accepted (containment). Blank reason: C1. Nothing recorded for a refusal. | L+T | §0.5; CMP-14; BS B33 |
| WP15-A42 | SuperAdmin; harness | The Nth time on SA-06x (§3 V21-2) | Replay terms 1 to 5. | (1) Same receipt; one revocation. (3) Back shows "This grant ended …", no form. (2), (4), (5) as the terms. A new key answers CMP-14. | L+T | BS B35 |

### 2.9 Give the accounting grant: SA-06t (`iam.set_accounting_grant`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP15-A43 | SuperAdmin (SA1) | SA-06t of E (§3 V21-1) | Read the page. | `h1` "Give the accounting grant: [E]". Effect: "[E] can open the Accounts page. Every Accounts action is unavailable in this release: Accounting actions are not yet defined. Owner: product owner. The grant gives no case access, adds no work area and changes none of [E]'s work." Reason (required). Button "Give the accounting grant"; "Cancel". | L | AD-12; BS B29, B43; PL §11.3 |
| WP15-A44 | SuperAdmin (SA1); E | SA-06t (§3 V21-1) | Give a reason; send. E reloads its account page and opens `/accounts`. | Receipt "Accounting grant given" only after the read by the returned grant id shows kind `accounting` (else neutral); Current: SA-06c grants row "Accounting grant, no end time". E's `/account` shows "You hold the accounting grant." with the B29 boundary (WP01-A72); no context selector entry for it; `/accounts` shows the boundary page; E's rail and work are unchanged. | L | `iam.set_accounting_grant`; WP-01 Q-04; AD-12 |
| WP15-A45 | SuperAdmin; harness; test | SA-06t refusals | Live (§3 V21-1a): harness sends a new key after A44. Tests: a travel agent, a SuperAdmin or a suspended operator (raw); an operator without an authenticator; the audit record behind. | Live: "[E] already holds the accounting grant." (`grant_exists`), nothing recorded. Tests: `grantee_not_operator` with the sentence "Only an active operator can hold the accounting grant." (no authenticator condition); an operator without an authenticator is accepted (Core has no such rule) and the page offers the link; audit: A32. | L+T | §0.5; `grants.ts:100-115` |
| WP15-A46 | E; test | E's pages after the revocation (§3 V21-2) | E reloads `/account`; opens `/accounts`. | No accounting section; `/accounts` → SH-02 denied; E's notices and rail unchanged. Test: an operator whose page loaded before the revocation sees SH-02 on the next load, never the earlier page (LD-14). | L+T | BS B10; LD-14 |

### 2.10 Open a support view: SA-06v (`iam.start_support_view`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP15-A47 | SuperAdmin (SA1) | SA-06v of Y (§3 V22-1) | Read the page. | `h1` "Open a read-only view for [Y]". Scope: "You see exactly what [Y] ([role]) can read now. You cannot act as [Y], change anything or download documents. SuperAdmin pages stay closed until you exit." Reason (required, 10 to 500 characters). Effect: "Your reason, the start and the end are recorded. The view ends when you exit or at the end time shown on the banner." (no configured duration). Button "Open the read-only view"; "Cancel". | L | UX §6.3; BS B10; SH-R09; WP-01 Q-13 |
| WP15-A48 | SuperAdmin (SA1) | SA-06v of Y (§3 V22-1) | Give the reason "WP15 [stamp] support check of a synthetic travel agent"; send. | 303 to Y's account page served on 4652 with the banner (A52); the page is read-only ("Read-only in a support view."), no sign-out of Y, no "Change your address" link. No receipt page: the banner is the result. | L | `iam.start_support_view`; WP01-A58, A70 |
| WP15-A49 | SuperAdmin (SA1); harness; test | SA-06v states (§3 V22-0) | Live: open SA-06v of SA2 and of SA1 (addresses); harness posts a start for SA2. Tests: a suspended, pending or declined account; a travel agent with no applications. | SA2, SA1: no form, "A read-only view is possible only for a travel agent or an operator other than you."; the post: `support_view_target_not_eligible`, nothing recorded. Not active (§6 Q-01): no form, "[name] is [status]: the account can read nothing now, so a read-only view would show no page." "Partly met" until Q-01 is answered (Core starts such a view). Travel agent with no applications: the form shows. | L+T | §0.5; WP-09 G-05 |
| WP15-A50 | SuperAdmin (SA1, second tab); test | SA-06v refusals | Live (§3 V22-1a): SA1 loads SA-06v of OP1 in tab 2 before V22-1; after V22-1 sends tab 2. Tests: blank reason; the clock unhealthy; the audit record behind. | Tab 2: the 409 support-view page "A read-only view is open in this session. Exit it from the banner, then open SuperAdmin pages again." with the exit control; nothing recorded. Blank reason: C1. Clock: "A read-only view cannot start now because the server clock is not trusted. Nothing was started." Audit: no form, reason of A11. | L+T | §0.5; BFF 409 page |
| WP15-A51 | SuperAdmin (SA1); harness | The Nth time on SA-06v | Replay terms 1 to 5 after V22-1 (from SA1's session). | (1) Identical replay: the BFF answers the 409 page (the session is in a support view) or the original landing; never a second support view (audit: one start). (3) Back to SA-06v shows the 409 page, not the form. (2), (4), (5) as the terms. | L+T | BS B35 |

### 2.11 Inside a support view (SH-R09; V22)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP15-A52 | SuperAdmin (SA1); screen-reader user | Every page in the support views of Y, OP2 and OP1 (§3 V22-2, V22-8, V22-11), also SH-02 and not-found pages | Read the banner on each page. | The banner shows on every page, before the main content, in text: "Read-only view for [name] ([role])", the reason, "Ends at [time] IST", and the control "Exit support view". It cannot be dismissed. The screen reader reads it in order. A not-found or denied page inside the support view keeps the banner and its exit (the SuperAdmin is never left without a way out). | L | SH-R09; UX §6.3; WP-01 (banner command) |
| WP15-A53 | SuperAdmin (SA1) | Support view of Y: TA-01, TA-05 of G, TA-07 of D, TA-10, Y's `/account`; a `syn-ta-2` application address (§3 V22-2, V22-3) | Read each page; open the `syn-ta-2` address on 4652. | Each page shows Y's current facts only (G, D, Y's notices, Y's new address after V21-11). The `syn-ta-2` address shows SH-02 denied with no name, reference echo, group or country, although SA1 can read it outside the view. | L | UX §2.3; BS B10; V22 clause 1 |
| WP15-A54 | SuperAdmin (SA1) | Support views of OP2 (holding the read grant) and of OP1 (§3 V22-8, V22-11) | Read OP-01, OP-02 of D and OP-10. | OP2: OP-01 shows the "Read-only access" section with G (WP07-A08) and OP2's assigned views; OP-02 of D shows the read-only banner of the grant. OP1: "My work" lists D; OP-02 of D shows OP1's facts. Neither view shows incidents, payments or notices beyond the operator's own reads. | L | UX §2.3 ("assigned scope plus exact read grants") |
| WP15-A55 | SuperAdmin (SA1); test | Every page of the three support views; test: every route marked `sv` in the route inventory | Look for controls. | No form, button or task link that leads to a form (submit, help, correction, acknowledge, start work, readiness, any operator action), no download or selection control, no sign-out of the viewed person, no "Change your address", no context selector entry for the viewed person. `/ta/account/email` (not readable in a support view) → not found. Test: every `sv` page renders without a form in support-view mode. | L+T | SH-R09; UX §6.3; WP07-A35 |
| WP15-A56 | Harness; SuperAdmin (SA1) | Hand-made POSTs in the support views (§3 V22-4, V22-11) | Post: a help request on D, a correction, the acknowledgement of one of Y's notices, a download of a file of D, "Start work" on D (OP1's view), an address-change start for Y. | Each answers the uniform 404 before Core; nothing recorded (deltas of D, Y's notices, releases, Y's address and open change, OP1's work). | L | `server.ts:596`; BS B10 |
| WP15-A57 | SuperAdmin (SA1) | `/admin`, `/admin/accounts`, SA-06v in a support view (§3 V22-3) | Open them. | The 409 page of A50 with the exit control; no SuperAdmin facts shown. | L | `server.ts:590-593` |
| WP15-A58 | SuperAdmin (SA1) | Exit (§3 V22-5) | Select "Exit support view". Reload the last viewed address (a TA path on 4652). Press Back twice. | 303 to SA-06c of Y with "Read-only view ended" (receipt of the WP-01 command, checked against the operation). The old address → not found (SA1 has no travel-agent pages). Back shows nothing of Y's pages: each restored page reloads (WP01-A131). | L | `iam.end_support_view`; SH-R09 ("Exit support view"); WP-01 A-02 |
| WP15-A59 | SuperAdmin (SA1, SA2); test | Access changes during a support view (§3 V22-10, V22-12); tests | Live: (1) SA2 revokes OP2's grant while SA1 views OP2 on OP-02 of D; SA1 reloads. (2) SA2 suspends Y while SA1 views Y; SA1 opens TA-07 of D and Y's `/account`. Tests: the view reaches its end time; the clock becomes unhealthy; an HTTP test with access refused between two reads of one page. | (1) SH-02 denied, no earlier facts of D. (2) Every viewed page answers not found (a suspended account reads nothing); the banner and exit stay (A52). End time: the next request shows SA1's own pages with "The read-only view ended at [time] IST."; no viewed content. Clock: the viewed pages deny. LD-14: the shell, never earlier facts. | L (1), (2) + T | BS B10; LD-14; SH-R04 |
| WP15-A60 | SuperAdmin (SA1, outside a support view); test | SA-08a, SA-08s (WP-14 pages) after V22-5 | Search the audit for the support views of the run (by Y or by the support-view subject, as SA-08a allows). | The start shows the viewed account, its role and the reason as recorded fields with the recorded time; the end shows its end reason (`ended`, `expired`, `superadmin_suspended`, `session_revoked`) in words. No fact per page view exists and none is claimed. SA-06c claims no support-view history (A04). Where SA-08a cannot filter these subjects, the item is shown by test and recorded "Partly met" for the live part. | L+T | UX §6.3 ("Full audit is a separate SA-only destination"); BS B33 |

### 2.12 Revoked access: old links, bytes and background results (V22)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP15-A61 | Operator (OP2) | OP2's tab of OP-02 of D, opened in V22-7 and kept open (§3 V22-10) | After the revocation, reload; follow a link of D (history, documents); open OP-01. | SH-02 denied ("Your access changed" category, SH-R04) with no applicant, group or document fact; OP-01's read-only section no longer lists G and never shows "0" for it; no earlier facts stay (LD-14). | L | BS B10; SH-R04; WP07-A08 |
| WP15-A62 | Operator (OP2); harness | Bytes after the revocation (§3 V22-10) | Send the download form of V22-7 again from the open tab (same key); send a new download of the same file; open the selection address if one was made. | Same key: the release is checked again (K-BYTE) and denied: no byte, the access answer (never the earlier download). New key: denied. Selection: denied. No byte is sent and no new successful retrieval is recorded (a denied release check MAY be recorded with its reason). | L | PL §7 K-BYTE; BS B12 |
| WP15-A63 | Test | Background results after an access change | (1) A page read under a grant with a background request answered 404 or a sign-in redirect. (2) The operation status address of an earlier command on an application the reader lost. (3) A page restored from the back/forward cache after the revocation. | (1) The page conceals and reloads to the access answer (WP-01 A-01); no earlier content stays. (2) No fact of the application; "Nothing is recorded for request [reference] so far" or the shell (WP-01 A-08). (3) The page reloads from the server before anything shows (WP01-A131). | T | SH-R05; WP-01 A-01, A-02, A-08 |
| WP15-A64 | Test | A grant at its end time before the cleanup task runs; the clock unhealthy | Read D as the grantee; read SA-06g. | Reads deny from the end time (the policy checks the time at each use); SA-06g shows "Ended [time] IST (time limit reached)" (A31); with the clock unhealthy every grant read denies and SA-06n refuses (A35). | T | BS B10; `policy.ts` (`groupRead`, clock) |

### 2.13 TA-12 Your account and the two-proof address change

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP15-A65 | Travel agent (Y) | TA-12 `/account` on 4650 (§3 V21-11, before and during the change) | Open "Your account" from the account menu. Read it before the change and while a change is open. | WP-01 parts (name, address, role, status, reference, sessions, sign out, sign out everywhere: WP01-A55). Section "Sign-in address": "Your sign-in address is also where TravelMudra sends your documents. Only you can change it, with a code at your current address and then one at the new address." with "Change your address" (TA-12e). While a change is open: "Your sign-in and document email remain [current address] until both addresses are verified." with a link to finish or cancel it (from `iam.email_change_page`). The §11.3 boundary: "Recovery without access to your current email is not available. Owner: product owner." In a support view TA-12 does not read the address-change read and shows none of these controls (A55). | L | PL TA-12, §5.2 TA-12, §11.3; BS B09, B44; LD-14 |
| WP15-A66 | Travel agent (Y) | TA-12e step 1 (§3 V21-11) | Read the page. | `h1` "Change your sign-in address"; steps (§0.2) with step 1 current; "Current address: [address]"; field "New email address" (`type="email"`, `autocomplete="email"`); "What happens next": "We first send a code to your current address. After you enter it, we send a code to the new address. When you enter that code, your sign-in address and the address for your documents change together, and every session of your account ends, this one too. TravelMudra staff cannot change your address." No configured duration ("within 30 minutes"): the end time shows after the start. Button "Send a code to my current address". | L | PL TA-12; UX §4.2; WP-01 Q-13 |
| WP15-A67 | Travel agent (Y) | TA-12e (§3 V21-11) | Enter `wp15-ta-[stamp]-b@synthetic.test`; send. | 303 to TA-12e with the receipt "We are sending a code to your current address." (`result` `started`); step 2: "Enter the code we sent to [current address]."; mail state in words (§0.2); "This change ends at [time] IST." (from the read); the pending line; "Cancel the address change". The harness receives a code at the current address. | L | `iam.start_email_change`; BS B09 |
| WP15-A68 | Travel agent (Y); test | TA-12e step 1 refusals (§3 V21-11d) | Live: enter the current address; enter "abc". Tests: an open change started in another browser; the start rate limit; a revision changed by a suspension and restoration; a 321-character value. | Current address: "This is already your sign-in address." (`email_unchanged`); "abc": "Enter an email address in the form name@example.com." (`email_invalid`); the typed value kept; nothing recorded. Open change: "An address change is already in progress." with "Cancel it" (A75); rate: "Too many attempts in a short time. Wait a few minutes before you try again."; stale: CMP-14 with the current address; 321 characters: refused at the field, value kept, never cut (A77). | L+T | §0.5; CMP-07 |
| WP15-A69 | Travel agent (Y); harness | TA-12e step 2 (§3 V21-11) | The harness enters the code from the current mailbox; send. | Receipt "Your current address is confirmed. We are sending a code to [new address]." (`result` `current_verified`); step 3: "Enter the code we sent to [new address]."; its mail state; the end time; the pending line; cancel. The code field is empty. | L | `iam.confirm_email_change`; BS B09 |
| WP15-A70 | Travel agent (Y); test | Wrong and dead codes (§3 V21-11a); tests | Live: at step 3 enter one wrong 8-digit code; then the right one (A71). Tests: wrong codes until the attempts end; a code that is no longer live; "12 34-5678" (spaces and hyphens); 7 digits. | Wrong code: the step re-renders with "This code did not work. Check the newest email to [address] and try again." at the code field; the field is empty (A101); no receipt and no "confirmed" (Core accepted the attempt as `invalid`). Last attempt: "Too many wrong codes. The address change ended. Your address did not change. Start again if you still want to change it." No longer live: "This code no longer works. Cancel the change and start again: a new start sends new codes." (no "send again" control: no command exists). Spaces and hyphens are accepted; 7 digits: "Enter the 8-digit code from the email." | L+T | §0.5; WP01-A99; UX §8.2 |
| WP15-A71 | Travel agent (Y), two browsers; harness | Completion (§3 V21-11c) | The harness enters the new-address code. Then in Y's second browser (signed in before the change) open any page. The harness requests a sign-in code for the old address, then signs Y in with the new address. Read TA-12. SA1 reads SA-06c of Y. | Browser 1 lands on the sign-in page with "Sign in with your new email address." (WP01-A56); browser 2 on the generic "Your session ended. Sign in again to continue."; Back shows no private page. The old address gets the neutral answer and no code (WP01-A31). Y signs in with the new address; TA-12 shows it. SA-06c of Y shows the new address and the history row of A04. | L | BS B09; SH-R11; UX §4.2 |
| WP15-A72 | Test | The new address belongs to another account | Prove both mailboxes of a change whose new address is held by another account. | Step 3 answer: "This address cannot be used. The address change ended and your address did not change. Start again with another address." The page never says this before the new mailbox was proven (start and step 2 say nothing about the address). No mail goes to a seeded mailbox on `lane-ui` for this case: it is a test only. | T | `email-change.ts:151-157`; BS B08 (no existence disclosure) |
| WP15-A73 | Test | Expiry and the cleanup window | (1) Send a code at or after the end time. (2) Read TA-12e after the end time. (3) Start a new change after the end time and before the cleanup task closed the old one. | (1) "The address change ended at [time] IST before both codes were entered. Your address did not change." (accepted `invalid`, `ended` `expired`; no success). (2) The step-1 form (the read hides an ended change). (3) Core refuses `email_change_open`: the page MUST NOT say "finish or cancel it" (nothing is shown to cancel); it says "An earlier address change has ended and is still being closed. Try again in a few minutes." "Unmet: waits for §6 Q-02" for a Core fix; the words above pass the UI part. | T | §0.1; `expiry-cleanup.ts`; LD-17 class of truthful refusals |
| WP15-A74 | Travel agent (Y); test | Cancel (§3 V21-11d, V21-11e) | After signing in with the new address, start a second change (to `wp15-ta-[stamp]-c@synthetic.test`) in browser 1; cancel it at step 2 from browser 2. Test: cancel an ended change (raw). | Receipt "The address change was cancelled. Your address did not change."; TA-12e shows step 1; the code to the current address stops working. The cancel from browser 2 is accepted (any session of the account may cancel). Ended change: CMP-14 with "No address change is open." | L+T | `iam.cancel_email_change` |
| WP15-A75 | Travel agent (Y), two browsers; harness; test | A change started in browser 1, read in browser 2 (§3 V21-11e) | Browser 2 opens TA-12e. Harness: send a code from browser 2 (raw, with browser 1's change id). | Browser 2: "This change was started in another browser. Finish it there, or cancel it here and start again." with cancel only; no code field. The raw send: the shell's not-found answer; nothing recorded (attempts unchanged). | L+T | `email-change.ts:105-106` |
| WP15-A76 | Travel agent (Y); harness; test | The Nth time on TA-12e (§3 V21-11b) | (1) Replay the start; replay the wrong-code send. (2) Same key, changed content. (3) Back after the step-2 proof. (4) Raw: the step-2 form again with a new key. (5) Lost acknowledgement (test). (6) Replay the completing send after completion. | (1) The same answer; one change, one code; the wrong-code replay counts no second attempt. (2) Used form; the address kept, never the code. (3) TA-12e shows step 3; no step-2 form. (4) CMP-14 "Your current address is already confirmed. Enter the code sent to [new address]." (`stale_revision`). (5) "Checking the original result" with "Check status"; no new code is sent (WP-01 A-07). (6) The sign-in page (the session ended); nothing new. | L+T | BS B35; PL §7 K-OTP; WP-01 A-07 |
| WP15-A77 | Test (`bff.test.ts` or the design's file) | Edge handlers of the three address-change routes | Send each field one character over its limit; a code with surrounding spaces; an `emailChangeId` of 65 characters. | Every field reaches Core whole (no `.slice`): over-limit values are refused at their field with safe values kept and the code never kept; no handler sends Core less than the travel agent typed (LD-17; today `edge/account.ts:134, 147, 175` cut them). | T | LD-17; WP-02 R-02 |
| WP15-A78 | SuperAdmin (SA1); harness | No staff change of a travel agent's address (§3 V21-10, V22-4) | Read SA-06c of Y. Harness: POST `/admin/accounts/<Y>/email` as SA1; in the support view of Y, POST `/ta/account/email`. | SA-06c: no address control; the note "Only the travel agent can change this address. Staff cannot change it." (WP02-A101). Both posts: uniform 404; Y's address and open change unchanged (delta). No staff page offers to "reset", "verify" or "replace" a travel agent's address. | L | BS B09, B11; UX §12 V21 |

### 2.14 OP-10 and SA-10 Notices and account (CC-03)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP15-A79 | Operator (OP1) | OP-10 `/ops/notices` (§3 N-1) | Open the rail item "Notices and account". Set the view "Needs your acknowledgement", reload, Back, clear. | `h1` "Notices"; lead "Notices about your work. A notice that needs your acknowledgement says so."; "Read at"; views "All" and "Needs your acknowledgement" in the address (SH-R06); count line "[n] notices"; rows: kind and event in words, application (applicant and reference, linking OP-02 when OP1 can read it), posted time IST, acknowledgement fact ("Needs your acknowledgement", "Acknowledged [time] IST", "No acknowledgement needed"). D's "assigned" notice is new (delta +1). No "read"/"unread" marker (LD-06). At the cap: "This list shows the newest 200 notices. Older notices may exist." A link "Your account" (`/account`). | L | PL OP-10; UX §5.2; LD-06; WP08-A89 |
| WP15-A80 | Operator (OP1); harness | OP-10n of D's "assigned" notice (§3 N-1) | Open it. Harness: post the acknowledgement. | Breadcrumb "Notices › [kind words]"; the text by kind and event ("You are now the assigned operator of [applicant]'s application."), the application link, posted time; "No acknowledgement needed."; no form. The post: "This notice needs no acknowledgement. Nothing was recorded." (`ack_not_required`) on the re-rendered notice; nothing recorded. | L | §0.5; LD-06 |
| WP15-A81 | Test; gallery | OP-10n and SA-10n of a notice that needs an acknowledgement (fixture: a disclosure deletion request to a staff recipient) | Read; acknowledge; replay; two tabs; post as another account. | The text in E-20 words (WP-14), "Acknowledge" with a review sentence of what it records ("that you have read this request; it does not record that you deleted anything"); receipt "Acknowledged"; Current "Acknowledged [time] IST" on the notice and the list. Second tab: "Already acknowledged on [time] IST. Nothing new was recorded." (`already_acknowledged`); stale: CMP-14; another account: uniform 404; replay: the same receipt. Live part "Deferred" (§6 Q-04). | T + gallery | §0.5; WP08-A90, A91; CC-03 |
| WP15-A82 | SuperAdmin (SA1) | SA-10 `/admin/notices` and SA-10n (§3 N-3) | Open Notices from the top bar. Open one notice if any. | As A79 and A80 for SuperAdmin notices (for example payment follow-up: "A payment follow-up for [applicant] is open. Open it."), with breadcrumb "Notices"; the rail marks no destination (top-bar page). An empty list: S2 "No notices yet." | L | AD-07; PL SA-10; CC-03 |
| WP15-A83 | Operator (OP1), SuperAdmin (SA1), E | `/account` as OP1, SA1 and E (§3 N-2, N-3, V21-1) | Read the page. | WP-01 parts (WP01-A70, A71): name, role, authenticator, sessions, sign out, sign out everywhere. Staff address: "Changing a staff sign-in address is unavailable. Owner: product owner." SA1: no accounting section. E while holding the grant: A44. No "Mark as read", no credential, no key. | L | PL OP-10, SA-10; WP01-A70 to A72 |
| WP15-A84 | Operator (OP2); test | OP1's notice address; a notice of an application reassigned away (fixture) | OP2 opens the address of D's notice. Test: OP1 opens a notice of an application reassigned to another operator. | OP2: SH-02 denied, no notice facts. Test: the notice stays readable to its recipient; its application link leads to SH-02 with no earlier facts (LD-14); the notice text holds no fact beyond what Core posted. | L+T | BS B10; LD-14 |
| WP15-A85 | Test (`notices` word test) | Every staff notice kind and event | Render each. | Words for `generic_case_update` events `assigned`, `reassigned_away`, `gate_exception_granted`, `submitted`, `superadmin_correction`, `deferral_review_due`, `withdrawn`, `assistance_approved`; `financial_follow_up`; `disclosure_correction` (both variants); an unknown event: the kind words and "Reference code: [code]". No text claims an email was sent. | T | `NOTICE_KINDS`; UAT-13 |
| WP15-A86 | Test | OP-10 and SA-10 states | The list read unavailable; an access refusal between reads; 200 notices; a filter that matches none. | S7 with "Try again", never an empty list or "0"; the shell for an access refusal (LD-14); the cap line and a qualified count; S3 "No notice needs your acknowledgement." with "Clear the filter". | T | WP08-A95, A96; D7 |
| WP15-A87 | Operator (OP1), SuperAdmin (SA1) | Rail and top bar | Read the current item on OP-10, OP-10n, SA-10, SA-10n and `/account`. | Operator: rail item "Notices and account" current on OP-10, OP-10n and `/account` (WP01-A06); SuperAdmin: top-bar Notices and the account menu "Your account"; the Notices entry counts only notices that need an acknowledgement (WP01-A13, A21). | L | PL §2.2; WP01-A06, A13 |

### 2.15 Pages of other packages

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP15-A88 | SuperAdmin (SA1); test | SA-04g of G; SA-06a; SA-06c; SA-01 group 7 | Follow the WP-15 links. Test: every link to a WP-15 page targets a registered GET route. | SA-04g "Give an operator read access to this group" → SA-06n with G (if the design routes it so, §6 Q-05); SA-06a "Open elevation requests" → SA-06e; SA-06c links of A01; SA-01 group 7 → SA-06e. Back returns to the origin. | L+T | SH-R06; WP02-A83; WP06-A04 |
| WP15-A89 | Operator (OP2) | OP-01, OP-02 of D under the grant (§3 V22-7) | Read the pages. | WP07-A08 and A35 hold: "Read-only access: [purpose], until [time] IST"; no action panel action; the grant's purpose and end equal SA-06g's row. | L | SH-R10; WP07-A08, A35 |
| WP15-A90 | SuperAdmin (SA1); test (`incident-host-pages.test.ts` pattern for SA-06) | The old elevation and grant pages; WP-02 pages that linked them | Open `/admin/elevations` and `/admin/grants`; look for forms. Run the host-page test. | No approve, decline, create or revoke form remains on SA-06e or SA-06g; each form is on its host page of §1.2 only. WP02-A88 and A98 now run on SA-09s (A24). | L+T | CC-12 to CC-18; WP-02 Q-W02-03 |

### 2.16 Command results, access and shell on WP-15 pages

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP15-A91 | SuperAdmin; operator; travel agent | Every WP-15 page | Read the shell. | Environment label; "[TEST]" title prefix; rail current item ("Accounts & access" with tabs Accounts, Elevation requests, Grants for SA-06 pages and SA-09s; "Notices and account" for OP-10; none for TA-12, opened from the account menu); breadcrumb; one `h1`; "Read at [time] IST". | L | PL §2.1, §2.2; WP-02 design §1.3 |
| WP15-A92 | SuperAdmin (SA1, SA2); travel agent (Y); harness; test | Every accepted WP-15 command; edited receipt addresses (§3 V22-10a) | Read each receipt. SA2 opens SA1's receipt addresses. Test: a reset key at an elevation receipt address; a group-read key at an accounting receipt address; another account's key; a refused key. | The titles of §0.2, each only when its condition holds; an edited address shows the neutral "Request recorded" (never "Accounting grant given" for a read grant); SA2 on SA1's address: the unchecked receipt with current authorized facts; another account's key: "Request reference [key]. The receipt cannot be checked now."; a refused key: "Nothing is recorded for request [reference] so far". No accepted time, no actor, nothing from the address. | L+T | §0.2; WP-01 A-04; J-09 |
| WP15-A93 | SuperAdmin (SA1); test | Receipt addresses of V21-5, V21-1 and V22-6 opened after V21-7, V21-2 and V22-9 | Open each. | Each keeps what was recorded ("Elevation requested"); later facts are "Current" ("Current: Approved by [SA2]", "Current: Revoked [time] IST"). No receipt tells anyone to act. | L+T | WP-07 F-01, F-33; WP-11 I-02 |
| WP15-A94 | Test | Lost acknowledgement per WP-15 command; a refused send | Inject the fault. | 303 to `/<surface>/operations/<key>`; "Checking the original result", "Check status"; no new send of the same intent; the status page gives the host page; a refused key "Nothing is recorded …". For the address-change code and the support-view start, no new code and no second view. | T | BS B35; WP-01 A-07 |
| WP15-A95 | Test | Replay matrix per command | (1) Identical replay. (2) Changed content. (3) Business duplicate. (4) Raw stale envelope. (5a) Raw resend after facts changed. (5b) Corrected submission. | (1) The original result. (2) `conflict_operation_key`. (3) Request: `elevation_open`; approve, decline: `stale_revision`; reset: a second reset (no guard); group grant, accounting grant: `grant_exists`; revoke: `stale_revision`; support view: `support_view_active` (or the BFF 409); start address change: `email_change_open`; confirm: `stale_revision`; cancel: `stale_revision`; acknowledge: `already_acknowledged`. (4) Request, approve, decline, reset, revoke, address change, acknowledge: CMP-14; the two grants and the support view: the business check decides. (5a) Core decides on its facts. (5b) Accepted once. | T | BS B35; WP-10 H-07 |
| WP15-A96 | Harness | The Nth time on the live steps | Replay terms 1 to 5 on V21-5, V21-7, V21-9, V21-11, V22-6, V22-9 (summary of A10, A23, A38, A42, A76). | As the items; one record per intent (deltas). | L | BS B35 |
| WP15-A97 | Test (`identity` word test) | Text map of every reason code WP-15 pages show | Unit test against Core's vocabulary. | Each code of §0.5 has its sentence: `second_superadmin_required`, `elevation_target_has_duties`, `elevation_requester_inactive`, `elevation_open` (missing today), `self_action_not_allowed`, `parked_lost_mailbox_recovery`, `grantee_not_operator` (two sentences: read grant, accounting grant), `grant_duration_exceeded`, `grant_limit_reached`, `grant_exists`, `clock_degraded`, `support_view_target_not_eligible`, `support_view_active`, `audit_degraded`, `email_invalid`, `email_unchanged`, `email_change_open`, `otp_invalid_or_expired`, `rate_limited`, `reason_required`, `ack_not_required`, `already_acknowledged`, `stale_revision`, `operation_key_reused`; every result word (`requested`, `approved`, `expired`, `declined`, `withdrawn`, `credentials_reset`, `created`, `revoked`, `started`, `current_verified`, `invalid`, `invalid_address`, `completed`, `cancelled`); an unknown code shows the category text and "Reference code: [code]". | T | UAT-13; §0.5 |
| WP15-A98 | SuperAdmin; travel agent | Every refusal reachable on `lane-ui` in §3 | Read each message. | CMP-07 at the field when Core names one; the owner or route where one exists; no code alone, "Something went wrong" or "Invalid data". A field refusal re-renders the task page with values kept, never the shell. | L | CMP-07; UX §7.4 |
| WP15-A99 | Travel agent (Y); operator (OP1, OP2, E); SuperAdmin (SA1) | Every WP-15 page; Y's pages; OP pages | Look for controls of other roles and forbidden controls. | Y: no staff page or control. Operators: no SuperAdmin page; no grant, elevation or support-view control; a read grant adds no action. SuperAdmin: no control that changes a travel agent's address, shows or chooses a credential, resends a code, signs in as another person or "acts as" them (WP02-A101, WP01-A58); no first-admin, all-admin-loss or lost-mailbox bypass (boundaries). | L | BS B08 to B11, B44; UX §6.1 |
| WP15-A100 | SuperAdmin; operator; travel agent | Every WP-15 page | Read all visible text. | No "impersonate", "sign in as", "act as", "switch user", "Override", "reset password", "show code", "unlock", "Mark as read"; no configured number the page does not read ("72 hours", "30 minutes", "14 days" except from the grants read); IST on every time; "Synthetic" where the data is synthetic; no package or lane record id. | L | PL §11.1; WP-01 Q-13; F-22 |
| WP15-A101 | SuperAdmin; travel agent; test | Task pages; TA-12e | Inspect browser storage after each step; read the headers; re-render each code step after a refusal. | No reason, purpose, address, code, key or grant fact in browser storage; `no-store` on every page; no code, enrolment code or key is ever rendered back (fields empty after any re-render); the new address is kept after a refusal. | L+T | SH-R12; WP-01 A-12 |
| WP15-A102 | `syn-ta-2`; OP2; E (operator) | Isolation (§3 X-1) | `syn-ta-2` opens TA-12e of its own and Y's notice address; OP2 opens SA-06 and SA-09s addresses; E (operator) opens SA-06g. Harness posts a revoke of OP2's grant as OP2. | Uniform 404 or SH-02; no fact of another account; the posts: 404; nothing recorded. | L | BS B10 |
| WP15-A103 | Test (`bff-*.test.ts`) | Every WP-15 staff handler | Each field one over Core's limit; an empty optional field; the largest valid form. | Every field reaches Core whole (no slice or cut); over-limit input is refused at the field with the values kept; the largest valid form fits the body limit (a real HTTP test). The group reference is trimmed of surrounding spaces only. | T | LD-17; WP-02 R-02 |
| WP15-A104 | Test (HTTP) | Every WP-15 page with an optional read (`iam.operator_duties`, `core.admin_group`, the receipt reads, `iam.email_change_page` on TA-12) | Let each optional read answer an availability failure, then an access, session, maintenance or support-view refusal. | Availability: the block reads "cannot be read now" and the forms follow A08 (Core checks again). Access refusals: the shell, never the earlier facts (LD-14). TA-12 in a support view does not call `iam.email_change_page`. | T | LD-14 |
| WP15-A105 | Test (host-page test); SuperAdmin | Every WP-15 page; SA-06c, SA-06e, SA-06g | Run the test; collect form actions on `lane-ui`. | Each WP-15 POST path appears as a form action on exactly its host page of §1.2 (SA-06q, SA-09s, SA-06k, SA-06n, SA-06x, SA-06t, SA-06v, TA-12e, OP-10n, SA-10n); the banner's exit and the account page's sign-out are the WP-01 forms. Every rendered form action is a registered POST route of its instance. | L+T | CC-12 to CC-18; WP06-A110 |

### 2.17 Accessibility (AC-01 to AC-28 that apply)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP15-A106 | Keyboard-only SuperAdmin and travel agent | V21-5, V21-7, V22-1, V22-6, V21-11 at 1440 px; V21-11 and V22-1 at 390 px | Use the keyboard only. | Every task page, the decision pages, the grant chooser and date, the support-view start and exit, the address-change steps and cancel: Tab, Shift+Tab, Enter, Space, Escape only. | L | AC-01, AC-12; UX §12 V24 |
| WP15-A107 | Keyboard-only user | Every WP-15 page at 1440 and 390 px and at 400% zoom | Tab through. | Focus visible (3:1) and never hidden by the support-view banner or another bar. | L | AC-02 |
| WP15-A108 | Phone user | SA-06e, SA-06g, SA-09s, SA-06v, TA-12, TA-12e, OP-10, the support-view banner | 320 px; 1280 px at 400%. | One column; tables become labelled rows; scope and effect before the fields; the primary action at the end, never in a fixed bar; the banner wraps and keeps its exit reachable; TA-12e steps as full-screen pages (PL TA-12 Mobile). | L | AC-04, AC-21 |
| WP15-A109 | Any | Every WP-15 form | Inspect. | The operator choice of SA-06n as a `fieldset` with `legend` (or a labelled select), none preselected; labels, hints and "required" stated; the date field labelled with its rule. | L | AC-05, AC-15 |
| WP15-A110 | Any | States (requests, grants, acknowledgement, address-change steps) | Greyscale. | Text for every state; no colour-only state. | L | AC-06 |
| WP15-A111 | Any | Every WP-15 form | Send with an error. | Focus to the error summary; links to fields; safe values kept; secret fields empty. | L | AC-08 |
| WP15-A112 | Screen-reader user | Receipts; the banner; the code steps | Read with a screen reader. | Receipts polite without moving focus; the banner in reading order before main; the code field `autocomplete="one-time-code"`, `inputmode="numeric"`, paste allowed (UX §7.5 accessible authentication). | L | AC-09; UX §7.5 |
| WP15-A113 | Screen-reader user | Each unavailable action (A08, A11, A13, A17, A27, A49, A32) | Focus. | The reason is exposed (`aria-describedby` or reading order); role-forbidden actions are not shown. | L | AC-13 |
| WP15-A114 | Phone user | Every WP-15 page at 390 px | Measure. | Controls at least 24 × 24 px; primary actions and "Exit support view" at least 44 × 44 px; each link names its account or grant (WCAG 2.4.6). | L+T | AC-10 |
| WP15-A115 | — | Every WP-15 page | Contrast. | Text 4.5:1; non-text and focus 3:1; the banner's text on its background 4.5:1. | L+T | AC-11 |
| WP15-A116 | Any | Long names and reasons; reduced motion | A 400-character display name; a 1000-character reason; a 254-character address. | Wraps; no horizontal page scroll; the address wraps anywhere; no transition with reduced motion. | L | AC-14, AC-20 |
| WP15-A117 | SuperAdmin and travel agent (observation) | After V21-7, V22-5, V21-11 | Ask SA2 "Could SA1 have approved this alone?", "What happens to E's sessions?"; ask SA1 "During the read-only view, could you change anything for Y?"; ask Y "Until when do documents go to your old address?". | The run record reports answers and sample size; a wrong answer is a finding. No pass target. | L | AC-24, AC-26 |

### 2.18 axe checks (WCAG 2.2 A/AA)

Rule for every row: run axe (`@axe-core/playwright` 4.13.0, tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`,
`wcag22aa`) at 1440 × 900 and at 390 × 844. Expected: no violation of impact "serious" or "critical" at either width.
Record the counts of minor and moderate violations. Synthetic data only. "Gallery" rows run on the design's gallery
state.

| ID | Persona | Page (state) | Where | Source |
|---|---|---|---|---|
| WP15-A118 | SuperAdmin | SA-06c of E, "Access and support" with links (V21-1) | L | UX §7.5; AC-01 to AC-28 |
| WP15-A119 | SuperAdmin | SA-06t of E (V21-1) | L | same |
| WP15-A120 | SuperAdmin | SA-06c of E with the accounting-grant receipt (V21-1) | L | same |
| WP15-A121 | SuperAdmin | SA-06x of E's accounting grant (V21-2) | L | same |
| WP15-A122 | SuperAdmin | SA-06k of E with the C1 error (V21-3) | L | same |
| WP15-A123 | SuperAdmin | SA-06c of E after the reset, enrolment row (V21-3) | L | same |
| WP15-A124 | SuperAdmin | SA-06c of Y with the travel-agent boundaries (V21-3a) | L | same |
| WP15-A125 | SuperAdmin | SA-06q of OP1, not offered (V21-4) | L | same |
| WP15-A126 | SuperAdmin | SA-06q of E with the C1 error (V21-5) | L | same |
| WP15-A127 | SuperAdmin | SA-06e with the open request (V21-5) | L | same |
| WP15-A128 | SuperAdmin | SA-09s `approve` as the requester, no form (V21-6) | L | same |
| WP15-A129 | SuperAdmin | SA-09s `approve` as SA2 (V21-7) | L | same |
| WP15-A130 | SuperAdmin | SA-09s `decline` with CMP-14 (V21-7a) | L | same |
| WP15-A131 | SuperAdmin | SA-09s `decline` as the requester ("Withdraw your request") (V21-9) | L | same |
| WP15-A132 | Travel agent | TA-12 with the pending line (V21-11) | L | same |
| WP15-A133 | Travel agent | TA-12e step 1 with the error summary (V21-11d) | L | same |
| WP15-A134 | Travel agent | TA-12e step 3 with the wrong-code error (V21-11a) | L | same |
| WP15-A135 | Travel agent | Sign-in page with "Sign in with your new email address." (V21-11c) | L | same |
| WP15-A136 | Travel agent | TA-12e in the other-browser state (V21-11e) | L | same |
| WP15-A137 | SuperAdmin | SA-06v of Y (V22-1) | L | same |
| WP15-A138 | SuperAdmin | Support view of Y: TA-07 of D with the banner (V22-2) | L | same |
| WP15-A139 | SuperAdmin | The 409 support-view page (V22-3) | L | same |
| WP15-A140 | SuperAdmin | SA-06n for G with the C1 error (V22-6) | L | same |
| WP15-A141 | SuperAdmin | SA-06g with OP2's active grant (V22-6) | L | same |
| WP15-A142 | SuperAdmin | SA-06x of OP2's grant (V22-9) | L | same |
| WP15-A143 | Operator | SH-02 after the revocation, and the support-view not-found page with the banner (V22-10, V22-12) | L | same |
| WP15-A144 | Operator | OP-10 with the "assigned" notice (N-1) | L | same |
| WP15-A145 | Operator | OP-10n with the `ack_not_required` refusal (N-1) | L | same |
| WP15-A146 | SuperAdmin | SA-10 notices list (N-3) | L | same |
| WP15-A147 | SuperAdmin; operator; travel agent | Gallery: SA-09s of an expired request; SA-06n at the grant limit and with the clock refusal; OP-10n with an acknowledgement receipt; TA-12e ended states | L (gallery) | same |
| WP15-A148 | SuperAdmin; travel agent | Operation status page of a WP-15 command: accepted and "Nothing is recorded" | L | same |

## 3. Proof scenarios V21 and V22

V21 (UX §12): "One SA can suspend in emergency/lower exposure; distinct second SA is required for ordinary SA
elevation/ceiling increase. TA email has no admin override." Authority B09, B11, B28. WP-02 proves the account parts
(WP-02 §3 Part G: A88, A94, A98, A101, A102); WP-07 proves the ceiling parts (WP07-A83 to A89; WP-07 §3 V09-3, V09-4,
V09-9); WP-15 proves the elevation, the reset, the grants as containment, and the address change.

V22 (UX §12): "Support view matches selected user's current read scope and offers no impersonation/action; revoked old
links/background results deny metadata/bytes." Authority B10 to B12. WP-15 proves all three clauses. `lane-ui` cannot
put the audit record behind, make the clock unhealthy or wait for an end time (P-03 parked): those steps are tests.

One ordered recipe: the steps run in the order of the table. Lettered steps (V21-1a, …) add checks on the same data and
within the writes of §0.2. "Setup" steps use pages of earlier packages; "Observe" marks items other packages own.

| Step | Actor, page | Action | Observable result | Items | Where |
|---|---|---|---|---|---|
| P-0 | SA1, SA2: SA-06a, SA-01, SA-06e, SA-06g; OP1: OP-10; SA1: SA-10; OP2: OP-01 | Read the counts and lists. | The run record holds the baselines of §0.4. | — | L |
| Setup 0 | SA1 (SA-06b, SA-06c) | Create and activate Y; the harness signs Y in. | Y signs in; TA-12 shows Y's address. | — | L |
| Setup 1 | Y (TA-13, TA-09, TA-08) | Create G; create D; submit D. | One submitted application. | — | L |
| Setup 2 | SA1 (SA-07a, SA-03a) | Record "Payment received" for D; assign D to OP1. | D assigned; OP1 holds a duty and gets the "assigned" notice. | — | L |
| Setup 3 | SA1 (SA-06b, SA-06c); harness | Create E as an operator; approve; activate; the harness enrols E and signs E in. | E active with an authenticator, no duty. | — | L |
| V21-1 | SA1: SA-06c of E, SA-06t; E: `/account`, `/accounts` | Read the section; give the accounting grant with a reason. E reads. | Links of A01; the receipt after the read by id; E's account page shows the grant and the B29 boundary; `/accounts` shows the boundary page. | A01, A03, A43, A44, A83, A118 to A120 | L |
| V21-1a | Harness | Replay; a new key. | Same receipt; `grant_exists`; one grant. | A45 | L |
| V21-2 | SA1: SA-06x of E's accounting grant; E; harness | Revoke with a reason. Harness: replay terms 1 to 3 on the revocation. E reloads; opens `/accounts`. | "Grant revoked"; same receipt on replay, one revocation; Back shows "This grant ended …"; E: no section; `/accounts` → SH-02. | A39, A40, A42, A46, A121 | L |
| V21-3 | SA1: SA-06k of E (send empty first); E; harness | C1; then reset with a reason. E reloads. Read SA-06c of E. The harness enrols E again. | C1; "Second factor reset"; "Not set up"; enrolment row without the code; E → sign-in; E enrols and signs in. | A25, A26, A28 (1), A04, A122, A123 | L |
| V21-3a | SA1: SA-06c of Y and own SA-06c; harness | Look for reset; post the reset for Y and for SA1. | No link; `parked_lost_mailbox_recovery` with the boundary; `self_action_not_allowed`; nothing recorded. | A01, A27, A124 | L |
| V21-3b | Harness; SA1 | Replay terms 1 to 3 on the reset of V21-3. | Same receipt; one reset and one enrolment; Back to SA-06k shows the current enrolment before the form. | A29 | L |
| V21-4 | SA1: SA-06c and SA-06q of OP1; harness | Read; post the request for OP1. | Duties shown, no form; `elevation_target_has_duties`; open requests delta 0. | A08, A125 | L |
| V21-5 | SA1: SA-06q of E (send empty first), SA-06c, SA-06e, SA-01, SA-06a; SA2: SA-01 | C1; then request with a reason. Read the pages. | C1; "Elevation requested"; open request on SA-06c and SA-06e; SA-01 group 7 +1 ("1 of them requested by you" for SA1); SA-06a +1. | A06, A07, A09 (1), A02, A12, A14, A126, A127 | L |
| V21-5a | Harness; SA1 | Replay terms 1 to 4 on the request. | As A10; one request. | A10, A96 | L |
| V21-6 | SA1: SA-09s `approve` of E's request; harness | Read; post the approval as SA1. | No form, the requester's sentence; `second_superadmin_required`; nothing recorded. | A17, A128 | L |
| V21-6a | E (operator): SA-06e, SA-09s; harness | Open the addresses; post the approval as E. | SH-02; 404; nothing recorded. | A18 | L |
| V21-7 | SA2: SA-09s `approve` (tab 1) and `decline` (tab 2, loaded now and kept for V21-7a); E; harness | Read; approve in tab 1 with a reason. E reloads; the harness signs E in. Read SA-06c of E and SA-06e. | "Elevation request approved"; E's role SuperAdmin; E → sign-in, then the SuperAdmin rail; SA-06e "Approved by [SA2]"; counts back to P-0. | A15, A16, A12, A14, A04, A129 | L |
| V21-7a | SA2, tab 2; harness | Send the `decline` of tab 2 (loaded in V21-7). Replay terms 1 to 3 on the approval. | CMP-14 "Decided since your review"; same receipt; Back shows the decision. | A21 (live), A23, A130 | L |
| V21-8 | SA1: SA-06c of E (WP-02 suspend) | Suspend E with a reason (one SuperAdmin; E is not the last). | Accepted without a second SuperAdmin; E's session ends (Observe WP02-A94, A102). | V21 clause 1 | L |
| V21-9 | SA1: SA-06c of E (WP-02 restore), SA-09s `decline` | Restore E (a request opens); withdraw it with a reason. | The WP-02 receipt links SA-09s; the requester's view "Withdraw your request"; "Request withdrawn"; E stays suspended. | A20, A24, A131 | L |
| V21-9a | SA1 (restore); SA2: SA-09s `decline` | Restore E again; SA2 declines with a reason. | "Request declined"; E "Suspended"; SA-06e "Declined by [SA2]". | A19 | L |
| V21-10 | SA1: SA-06c of Y; harness | Read; post `/admin/accounts/<Y>/email`. | No control; the note; 404; Y's address unchanged. | A78 | L |
| V21-11 | Y (browser 1 and browser 2 signed in): TA-12, TA-12e; harness | Read TA-12. Start the change to `wp15-ta-[stamp]-b@synthetic.test`; the harness enters the current-address code. Read TA-12 and TA-12e. | Receipts of A67 and A69; the pending line on TA-12 and TA-12e; step 3 asks for the code sent to the new address. | A65 to A67, A69, A132 | L |
| V21-11a | Y: TA-12e step 3; harness | Enter one wrong 8-digit code. | The code error; the field empty; no receipt; the change stays open. | A70 (live part), A134 | L |
| V21-11b | Y; harness | At step 3: Back; the raw step-2 form with a new key; replay of the step-2 send (same key). | Step 3 shows; CMP-14 "already confirmed"; the same answer, nothing new recorded. | A76 | L |
| V21-11c | Y (browser 1 and browser 2); harness; SA1: SA-06c of Y | The harness enters the new-address code. Open a page in browser 2. Request a sign-in code for the old address. The harness signs Y in with the new address in browser 1. Read TA-12; SA1 reads SA-06c of Y. | Browser 1 → "Sign in with your new email address."; browser 2 → "Your session ended."; old address: the neutral answer, no code; TA-12 shows the new address; SA-06c of Y shows it and the history row. | A71, A04, A135 | L |
| V21-11d | Y: TA-12e (browser 1, signed in with the new address) | Enter the current address; enter "abc"; then start a change to `wp15-ta-[stamp]-c@synthetic.test`. | `email_unchanged`; `email_invalid` (values kept; nothing recorded); then "We are sending a code to your current address." | A68 (live part), A67, A133 | L |
| V21-11e | Y, browser 2 (the harness signs it in again with the new address); harness | Open TA-12e in browser 2; the harness sends a code from browser 2 (raw, with the change id of browser 1); cancel the change in browser 2. | "This change was started in another browser" with cancel only; the raw send: not found, nothing recorded; "The address change was cancelled. Your address did not change." | A74, A75, A136 | L |
| V21-T1 | Test | The audit record behind (fixture, as WP02-A90, A102). | Request, approve, reset, both grants and the support view: no form with the reason, `audit_degraded` for a raw send; decline, revoke and suspension accepted. | A11, A21, A28, A32, A41, A45, A50 | T |
| V21-T2 | Test | Requests past their end; one active SuperAdmin; 50 decided. | A13, A22. | A13, A22 | T |
| V21-T3 | Test | Requester suspended; target gained a duty; target changed; the other two kinds; the pending target. | A18, A21, A24. | A18, A21, A24 | T |
| V21-T4 | Test | Address-change edge cases: attempts ended, expiry, cleanup window, address in use, rate limit, dead code, LD-17. | A68, A70, A72, A73, A76, A77. | A68, A70, A72, A73, A76, A77 | T |
| V21-T5 | Test | A second reset; a suspended reset; the grant limit; `grant_exists` after an end; accounting refusals. | A29, A36, A37, A45. | A29, A36, A37, A45 | T |
| V22-0 | SA1: SA-06v addresses of SA2 and of SA1; harness | Open both; post a start for SA2. | No form, the eligibility sentence; `support_view_target_not_eligible`; nothing recorded. | A49 | L |
| V22-1 | SA1: SA-06v of Y (tab 1); SA-06v of OP1 (tab 2, loaded now and kept for V22-1a) | Read; open the view of Y in tab 1 with a reason. | Anatomy of A47; landing on Y's account page with the banner. | A47, A48, A52, A137 | L |
| V22-1a | SA1, tab 2 (loaded in V22-1) | Send tab 2. | The 409 support-view page; nothing recorded. | A50, A51 | L |
| V22-2 | SA1 in the view of Y | Read TA-01, TA-05 of G, TA-07 of D, TA-10, `/account`; open `/ta/account/email`. | Y's current facts (the new address); no control; the address-change page not found. | A53, A55, A65, A138 | L |
| V22-3 | SA1 in the view of Y | Open a `syn-ta-2` application address; open `/admin` and `/admin/accounts`. | SH-02 with no facts; the 409 page with the exit. | A53, A57, A139 | L |
| V22-4 | Harness in the view of Y | The hand-made POSTs of A56 (and the address-change start of A78). | 404 each; nothing recorded. | A56, A78 | L |
| V22-5 | SA1 | Exit; reload the old address; Back twice. Read SA-08a for the view (outside it). | "Read-only view ended" on SA-06c of Y; not found; no viewed content; the audit rows. | A58, A60 | L |
| V22-6 | SA1: SA-04g of G → SA-06n (send empty first), SA-06g | C1; then give OP2 read access (purpose, today + 1). | C1; "Read access given"; SA-06g active row. | A33, A34, A35 (1), A30, A88, A90, A140, A141 | L |
| V22-6a | Harness | Raw date beyond the maximum; yesterday; a new key for OP2 and G; replay terms 1 to 3. | `grant_duration_exceeded` at the date; `grant_exists` with the link; one grant. | A35 (2), A36, A38 | L |
| V22-7 | OP2: OP-01, OP-02 of D; harness when no page offers the download (§6 Q-07) | Read; download one file of D; keep the tab open. | Read-only banner (WP07-A35); one release with bytes. | A89, A54 | L |
| V22-8 | SA1: SA-06v of OP2 | Open the view; read OP-01 and OP-02 of D; keep the tab. | OP2's scope with G read-only; no download control. | A54, A55 | L |
| V22-9 | SA2: SA-06x of OP2's grant in tab 1 and tab 2 (SA1 stays in the view of OP2) | Tab 1 revokes with a reason; tab 2 sends after. | "Grant revoked"; tab 2: CMP-14, no second record. | A39, A40, A41, A142 | L |
| V22-10 | OP2's open tab; SA1's view tab | OP2 reloads D, follows links, resends the old download (same key), a new download; reads OP-01. SA1 reloads D in the view of OP2; exits. | SH-02 everywhere; no byte; OP-01 without G; the support view also denies D. | A59 (1), A61, A62, A143 | L |
| V22-10a | SA1 (outside a view); SA2 | Open the receipt addresses of V21-1, V21-5 and V22-6 as SA1 and then as SA2. | Each keeps what was recorded; later facts are "Current" (revoked, approved); SA2 gets the unchecked receipt with current authorized facts; no instruction to act. | A92, A93 | L |
| V22-11 | SA1: view of OP1; harness | Open the view; read My work, OP-02 of D, OP-10; post "Start work" on D; exit. | OP1's scope; no forms; the post 404, nothing recorded; OP-10 read-only. | A54, A55, A56 | L |
| V22-12 | SA1: view of Y; SA2: SA-06c of Y (WP-02 suspend and restore) | SA1 opens the view of Y. SA2 suspends Y. SA1 opens TA-07 of D and Y's `/account`, then exits. SA2 restores Y (cleanup). | Not found on each viewed page, the banner and exit stay; exit works; Y restored. | A59 (2), A52, A143 | L |
| V22-T1 | Test | The view at its end time; the clock unhealthy; a non-active viewed account; LD-14 between reads; every `sv` page without a form. | A49, A55, A59. | A49, A55, A59 | T |
| V22-T2 | Test | Background requests and operation-status reads after an access change; back/forward cache; a grant at its end time; the clock unhealthy. | A63, A64. | A63, A64 | T |
| V22-T3 | Test | The audit record of a support view when SA-08a cannot filter it. | A60. | A60 | T |
| N-1 | OP1: OP-10, OP-10n; harness | Read the list, the views, the "assigned" notice; post its acknowledgement. | +1 notice, no read marker; "No acknowledgement needed"; `ack_not_required`, nothing recorded. | A79, A80, A87, A144, A145 | L |
| N-2 | OP1: `/account` | Read. | WP-01 parts; staff address boundary. | A83 | L |
| N-3 | SA1: SA-10, SA-10n, `/account` | Read. | As A82, A83. | A82, A83, A87, A146 | L |
| N-4 | OP2 | Open the address of D's notice of OP1. | SH-02. | A84 | L |
| N-T | Test; gallery | A notice that needs an acknowledgement; words; states. | A81, A85, A86. | A81, A85, A86 | T + gallery |
| X-1 | `syn-ta-2`; OP2; E; harness | The isolation reads and posts of A102. | Not found or SH-02; nothing recorded. | A102 | L |
| X-2 | Test | The test parts of the items not named above: A01, A03 to A05, A08, A09, A10, A23, A29, A31, A38, A42, A51, A76, A84, A88, A90 to A95, A97, A101, A103 to A105, A114, A115. | As the items. | as listed | T |
| X-3 | axe | Every page and state visited above. | No serious or critical violation at 1440 px and 390 px. | A118 to A146, A148 | L |
| X-4 | axe (gallery) | A147. | As X-3. | A147 | L |
| X-5 | Keyboard-only, screen-reader and phone users; SA1, SA2, Y | During V21-5, V21-7, V21-11, V22-1, V22-6: the accessibility checks, the shell, copy and refusal text, the role-control check, browser storage and headers, the form actions of SA-06c, SA-06e and SA-06g, the observation questions. | As the items. | A91, A98 to A101, A105 to A117 | L |

Proof split. V21 passes when P-0, Setup and V21-1 to V21-11e pass on `lane-ui` at the integrated WP-15 commit and
V21-T1 to V21-T5 pass as named tests; the ceiling clauses pass by WP-07 (WP07-A83 to A89) and the suspension clause is
observed in V21-8 (WP02-A94, A102). V22 passes when V22-0 to V22-12 pass on `lane-ui` and V22-T1 to V22-T3 pass as named
tests. Part N and N-T belong to the package pass (CC-03). Part X belongs to both. Recorded, not failed: A04, A24 "Partly
met" (§6 Q-06); A49 "Partly met" (§6 Q-01); A73 part (3) "Unmet: waits for §6 Q-02"; A81 live part "Deferred" (§6 Q-04);
any "Deferred: harness" step (§0.4). The run record names the `lane-ui` ref, the run tag, the accounts and group used,
each test, the identifiers (internal record only) and every delta.

## 4. Scenario parts outside these proofs (traceability)

| Scenario part | Where it is proven |
|---|---|
| V21: one SuperAdmin lowers a ceiling; a distinct second SuperAdmin approves an increase | WP-07 (WP07-A83 to A89; WP-07 §3 V09-3, V09-4, V09-9) |
| V21: one SuperAdmin suspends in an emergency, also while the audit record is behind | WP-02 (WP02-A94, A102); observed in V21-8 |
| V21: a new or restored SuperAdmin needs a second SuperAdmin; no staff address control | WP-02 (WP02-A88, A98, A101); the decision page is WP-15's (A24) |
| Sign in, sign out, sign out everywhere, enrolment, the account page's identity and sessions | WP-01 (WP01-A55, A56, A58, A67, A70 to A72, A131) |
| The landing after an address change and the second browser's session-ended page | WP-01 (WP01-A56); live here in V21-11c |
| The grantee's read-only views (OP-01 section, OP-02 banner) | WP-07 (WP07-A08, A35); observed here (A89) |
| Incident pages in a support view; no incident read under a grant | WP-14 (WP14-A89) |
| TA-10 and the travel agent's acknowledgement | WP-08 (WP08-A89 to A99) |
| Audit pages (SA-08a, SA-08s) | WP-14; WP-15 checks only the support-view rows (A60) |
| First-admin and all-admin-loss recovery boundary on SA-06a | WP-02 (WP02-A89); A13 adds the request page's line |

## 5. Out of scope and boundaries

These MUST NOT appear on any WP-15 page:

- A control that changes a travel agent's address from a staff page, a support view or a SuperAdmin route; a staff
  sign-in address change (BS B09, B11).
- A control that shows, chooses, resends or sets a sign-in code, an enrolment code, an authenticator key or a password
  (BS B08, B11).
- "Sign in as", "impersonate", "act as", "switch user", or any target-user action in a support view (BS B10; UX §2.3).
- One SuperAdmin completing an elevation, a new SuperAdmin or a SuperAdmin restoration; a first-admin, all-admin-loss or
  lost-mailbox bypass (BS B11, B44).
- A read grant that adds an action, covers more than one group or another travel agent, or opens incidents, payments,
  notices or intake (BS B10; UX §2.3).
- An Accounts work area, context or action opened by the accounting grant (AD-12; BS B29).
- A form outside its host page of §1.2; a form whose action has no registered route.
- A success title for an accepted command whose result is not the requested effect (`expired`, `invalid`,
  `invalid_address`).
- A configured duration or count that the page does not read; a "read"/"unread" marker (LD-06).
- Earlier facts after an access change (LD-14); a truncated field (LD-17).
- A code, reason, address or grant fact in browser storage, a URL, a title or diagnostics (SH-R06, SH-R12; BS B33).

Recorded as pending, not as failures (§0.2 "Pass rule"):

- A04, A24: the decider of an older request and the support-view history on the account page: "Partly met" (§6 Q-06).
- A49: a support view of an account that is not active: "Partly met" until §6 Q-01 is answered.
- A73 part (3): the start refused during the cleanup window: "Unmet: waits for §6 Q-02".

Deferred in WP-15 (the run record lists each as "Deferred"):

- A81 live part: a staff notice that needs an acknowledgement does not exist on `lane-ui` (§6 Q-04); test and gallery.
- The audit record behind, the clock unhealthy, end times, the cleanup window, lost acknowledgements: tests (P-03
  parked).
- Live steps that need a harness extension that does not exist (§0.4; §6 Q-09): tests.

Not in WP-15: the ceiling decisions (WP-07); account creation and status actions (WP-02); sign-in, enrolment, sign-out
and the account page's sign-in parts (WP-01); the grantee's read-only views (WP-07); the travel agent's notices (WP-08);
the audit pages (WP-14); `/accounts` retirement (WP-16, WP-01 Q-04); lost-mailbox recovery, first-admin and
all-admin-loss recovery, TA eligibility (parked policies, product owner).

## 6. Questions for the architect (ranked)

Rows are in rank order; the IDs are stable references used in the items.

| ID | Rank | Question | Concrete scenario | PM recommendation |
|---|---|---|---|---|
| Q-01 | P1 | Core starts a support view of a suspended, pending or declined account (no status check in `iam.start_support_view`), and every read in it is refused (the policy needs an active viewed account). The lane rule says a page MUST NOT block a command that Core accepts. | SA1 investigates a complaint about a suspended travel agent, opens a read-only view, and every page says "not found". SA1 concludes that the travel agent has no applications and tells the customer so. Likelihood: medium (suspended accounts are the ones investigated); harm: medium (a wrong conclusion; no data leak). | SA-06v shows no form for an account that is not active and says why (A49), as a recorded exception to the lane rule; send a Core note to the orchestrator (start should refuse a viewed account that is not active). A49 "Partly met" until decided. |
| Q-05 | P1 | How does a SuperAdmin choose the group of a read grant? Today the grants page takes a typed group reference and shows no group fact before the button; `iam.admin_grants` returns no groups. | SA1 types a reference with one wrong character that belongs to another travel agent's group. OP2 reads that travel agent's applications and downloads their passports for up to 14 days. Likelihood: low to medium; harm: high (cross-travel-agent disclosure, BS B10). | Start the grant from SA-04g of the group (the group in the address context, as Q-W14-03 did for incidents); SA-06n shows the group's label, dates and state from `core.admin_group` before the button. A typed reference only with a check step that shows the same facts. The owning travel agent's name is not on `core.admin_group`; showing it would need a read change (Kind 1, criterion point 2 to be shown). |
| Q-09 | P1 | The LD-11 harness signs in only seeded accounts and reads only sign-in codes. WP-15 needs a fresh travel agent (an address change MUST NOT run on a seeded account) and a fresh operator (enrolment, reset, re-enrolment, elevation, sign-in as a SuperAdmin). | Without an extension, V21-3, V21-5 to V21-9a and V21-11 run only as tests, and V21 clauses 2 and 3 are not shown on `lane-ui`. Likelihood: certain without a decision; harm: medium (an access proof that Max cannot repeat by hand). | Extend `test/uat/signin-harness.ts` (lane test code, same rules: nothing printed or stored) to sign in run-created synthetic accounts, enrol a staff account from its mailbox and page in memory, and read address-change codes by address. Fallback: "Deferred: harness" and the named tests. |
| Q-02 | P2 | An address change past its end time is hidden by the read (`expires_at > now`) but still counted by the start (`email_change_open`) until the cleanup task closes it (up to 15 minutes). The travel agent cannot cancel what the page does not show. | Y starts a change, leaves, returns 35 minutes later and starts again: "An address change is already in progress. Finish or cancel it first." with nothing to cancel. Likelihood: medium for anyone who returns within the window; harm: low (wait). | The page uses the truthful words of A73 part (3). Core note to the orchestrator: the start should treat a change past its end as ended (as the confirm does). A73 part (3) "Unmet" until then. |
| Q-03 | P2 | `iam.admin_accounts.openElevations` (SA-06a) and the open list of `iam.admin_elevations` (SA-06e, SA-01 group 7) count every request still `requested`, also one past its end that the cleanup task has not closed (up to 15 minutes). | SA-06a shows "Open elevation requests: 1" while the only request ended; SA2 opens SA-06e and finds nothing it can approve. Likelihood: medium (an unanswered request); harm: low. | Pages that hold the list label such rows by their end time against the read time and leave them out of "can be decided" counts (A13); SA-06a, which has only the count, labels it "open or ended, not yet closed" or takes the count from the list read. Core note: the count could exclude ended requests. |
| Q-04 | P2 | No staff notice on `lane-ui` needs an acknowledgement, except a disclosure deletion request to a staff account that received a file (WP-14). The live acknowledgement on OP-10n and SA-10n cannot run on the run's own data. | The acceptance run cannot show the operator or SuperAdmin acknowledgement; CC-03 passes on tests only. Likelihood: certain; harm: low (the TA route proves the same command live, WP08-A91). | Test and gallery for A81; if a WP-14 run left a staff deletion request, use it read-only and acknowledge it only when it belongs to the run's own staff account. |
| Q-06 | P2 | The account page cannot show who decided an older elevation request (only the newest 50 decided are read), when an operator became a SuperAdmin (no fact on the account subject), or the support views of an account. | SA2 asks on SA-06c of E "who made E a SuperAdmin?" six months later; SA-06c shows the role only. Likelihood: low; harm: low (the audit answers it). | "Partly met" with links to SA-06e and the audit (A04, A24). Kind 1 note: criterion point 2 (a decision that needs the fact on this page) is not demonstrated, so no proposal is raised. |
| Q-07 | P2 | A read grant allows document bytes (`document.retrieve_bytes`, `selection.retrieve` with `groupRead`); WP07-A35 says the read-only OP-02 shows no form. Is a download offered to a grantee? | OP2 needs a passport copy for the support case and finds no download, or the page offers one that WP-07 forbids. Likelihood: high for every grant; harm: low. | Offer the download (a byte release, not a case action) with the read-only label on the documents view, as the grant's purpose says ("read … and download"); WP-07 owner confirms. V22-7 uses the harness until then. |
| Q-08 | P2 | `iam.admin_elevations.open` and `iam.admin_grants.active` have no SQL limit, but the wire allows at most 500 and 2000 rows: above it the read fails and the page shows S7. | Not reachable on `lane-ui`; a production installation with 2001 active grants loses the grants page. Likelihood: very low; harm: medium. | Core defect note to the orchestrator (limit and say so, as other reads do). No WP-15 page change. |
| Q-10 | P2 | Each run leaves one more suspended SuperAdmin (E) and one travel agent (Y) on `lane-ui`. | After 20 runs, SA-06a lists 20 suspended `wp15-op-*` SuperAdmins. Likelihood: certain per run; harm: low (synthetic, tagged). | Accept with the tag; the run record lists them. |
| Q-11 | P2 | `grantee_not_operator` has one sentence that mentions an authenticator, but the accounting grant has no authenticator rule. | SA1 gives the accounting grant to an active operator without an authenticator: accepted; to a travel agent (raw): "Choose an active operator who has set up an authenticator." Likelihood: low; harm: low (confusing words). | Two sentences by command (A45, A97). |

## 7. Sign-off

| Field | Value |
|---|---|
| Verified on (date, IST) | |
| Installation and ref (`uat.py status lane-ui` output: commit or tag) | |
| Lane commit of the tests named for `T` items | |
| Run tag, accounts and group used (Y, E, G, D; internal record reference) | |
| Harness extensions present (first checks 1 and 2) | |
| Baselines (P-0) and the deltas observed | |
| Browsers and versions | |
| Assistive technology used | |
| V21 result (steps; tests; WP-02 and WP-07 references) | |
| V22 result (steps; tests) | |
| Deferred items (reference each) | |
| Partly met and Unmet items (decision reference) | |
| Open findings (ID, rank, scenario) | |
| Signed by (role and name) | |

Result per item (Pass, Fail, Blocked, Partly met, Unmet, Deferred or Not run; evidence reference; note):

| ID | Result | Evidence | Note |
|---|---|---|---|
| WP15-A01 | | | |
| WP15-A02 | | | |
| WP15-A03 | | | |
| WP15-A04 | | | |
| WP15-A05 | | | |
| WP15-A06 | | | |
| WP15-A07 | | | |
| WP15-A08 | | | |
| WP15-A09 | | | |
| WP15-A10 | | | |
| WP15-A11 | | | |
| WP15-A12 | | | |
| WP15-A13 | | | |
| WP15-A14 | | | |
| WP15-A15 | | | |
| WP15-A16 | | | |
| WP15-A17 | | | |
| WP15-A18 | | | |
| WP15-A19 | | | |
| WP15-A20 | | | |
| WP15-A21 | | | |
| WP15-A22 | | | |
| WP15-A23 | | | |
| WP15-A24 | | | |
| WP15-A25 | | | |
| WP15-A26 | | | |
| WP15-A27 | | | |
| WP15-A28 | | | |
| WP15-A29 | | | |
| WP15-A30 | | | |
| WP15-A31 | | | |
| WP15-A32 | | | |
| WP15-A33 | | | |
| WP15-A34 | | | |
| WP15-A35 | | | |
| WP15-A36 | | | |
| WP15-A37 | | | |
| WP15-A38 | | | |
| WP15-A39 | | | |
| WP15-A40 | | | |
| WP15-A41 | | | |
| WP15-A42 | | | |
| WP15-A43 | | | |
| WP15-A44 | | | |
| WP15-A45 | | | |
| WP15-A46 | | | |
| WP15-A47 | | | |
| WP15-A48 | | | |
| WP15-A49 | | | |
| WP15-A50 | | | |
| WP15-A51 | | | |
| WP15-A52 | | | |
| WP15-A53 | | | |
| WP15-A54 | | | |
| WP15-A55 | | | |
| WP15-A56 | | | |
| WP15-A57 | | | |
| WP15-A58 | | | |
| WP15-A59 | | | |
| WP15-A60 | | | |
| WP15-A61 | | | |
| WP15-A62 | | | |
| WP15-A63 | | | |
| WP15-A64 | | | |
| WP15-A65 | | | |
| WP15-A66 | | | |
| WP15-A67 | | | |
| WP15-A68 | | | |
| WP15-A69 | | | |
| WP15-A70 | | | |
| WP15-A71 | | | |
| WP15-A72 | | | |
| WP15-A73 | | | |
| WP15-A74 | | | |
| WP15-A75 | | | |
| WP15-A76 | | | |
| WP15-A77 | | | |
| WP15-A78 | | | |
| WP15-A79 | | | |
| WP15-A80 | | | |
| WP15-A81 | | | |
| WP15-A82 | | | |
| WP15-A83 | | | |
| WP15-A84 | | | |
| WP15-A85 | | | |
| WP15-A86 | | | |
| WP15-A87 | | | |
| WP15-A88 | | | |
| WP15-A89 | | | |
| WP15-A90 | | | |
| WP15-A91 | | | |
| WP15-A92 | | | |
| WP15-A93 | | | |
| WP15-A94 | | | |
| WP15-A95 | | | |
| WP15-A96 | | | |
| WP15-A97 | | | |
| WP15-A98 | | | |
| WP15-A99 | | | |
| WP15-A100 | | | |
| WP15-A101 | | | |
| WP15-A102 | | | |
| WP15-A103 | | | |
| WP15-A104 | | | |
| WP15-A105 | | | |
| WP15-A106 | | | |
| WP15-A107 | | | |
| WP15-A108 | | | |
| WP15-A109 | | | |
| WP15-A110 | | | |
| WP15-A111 | | | |
| WP15-A112 | | | |
| WP15-A113 | | | |
| WP15-A114 | | | |
| WP15-A115 | | | |
| WP15-A116 | | | |
| WP15-A117 | | | |
| WP15-A118 | | | |
| WP15-A119 | | | |
| WP15-A120 | | | |
| WP15-A121 | | | |
| WP15-A122 | | | |
| WP15-A123 | | | |
| WP15-A124 | | | |
| WP15-A125 | | | |
| WP15-A126 | | | |
| WP15-A127 | | | |
| WP15-A128 | | | |
| WP15-A129 | | | |
| WP15-A130 | | | |
| WP15-A131 | | | |
| WP15-A132 | | | |
| WP15-A133 | | | |
| WP15-A134 | | | |
| WP15-A135 | | | |
| WP15-A136 | | | |
| WP15-A137 | | | |
| WP15-A138 | | | |
| WP15-A139 | | | |
| WP15-A140 | | | |
| WP15-A141 | | | |
| WP15-A142 | | | |
| WP15-A143 | | | |
| WP15-A144 | | | |
| WP15-A145 | | | |
| WP15-A146 | | | |
| WP15-A147 | | | |
| WP15-A148 | | | |
| V21 proof | | | |
| V22 proof | | | |
