# WP-15 design review: accounts, access and email change

Lane `ui-revamp-2026-10-12`. Author: Principal UX Engineer (Claude Opus subagent). Date: 13 October 2026.
Status: design before code, for the architect's decision (LD-12) and the independent design review (LD-13: WP-15
holds commands that change access: SuperAdmin elevation, the second-factor reset, read grants, the support view and
the travel agent's sign-in address; so a Codex design review applies).
Product base: lane repository at 34e875b (WP-01 and WP-20 accepted; WP-02 U0 to U5 integrated at 228816a, with SA-06a
to SA-06d and the four carried WP-15 forms; WP-03 U0 and U6). WP-06 to WP-14 are designed and not yet built; this
design depends on their units named in §1.7 and amends four of them (§1.8). This document writes no product code.
Paths in `file:line` form are relative to the lane repository at 34e875b unless they start with `REC/`
(`internal/records/`) or `RM` (lane `research/route-map.md`). Code is read as committed (`git show 34e875b:<path>`);
the working tree was not read.

Writing style: ASD-STE100 at about 75%. `MUST`, `MUST NOT`, `SHOULD` and `MAY` have their normative meaning.
"Current" means the code at 34e875b. "Target" means the specification or the plan. "Core decides" means the page
shows Core's answer and computes no permission or business fact (D4, D5). No sign-in code, enrolment code,
authenticator key or TOTP value appears in this design, in a page, in a log or in a proof record.

## 0. Summary for the architect

- **Scope.** Eleven register commands (COMMAND-COVERAGE §3, §5.1): `iam.request_elevation`, `iam.approve_elevation`,
  `iam.decline_elevation`, `iam.reset_credentials`, `iam.set_accounting_grant`, `iam.create_group_read_grant`,
  `iam.revoke_grant`, `iam.start_support_view`, `iam.start_email_change`, `iam.confirm_email_change`,
  `iam.cancel_email_change`. CC-03 adds SA-10 and the operator and SuperAdmin routes of `dlv.acknowledge_notice`;
  sign-out (WP-01) is carried on `/account` unchanged. Pages: SA-06 full (the WP-02 account pages keep their paths;
  the access forms are rebuilt in place; elevation requests, the SA-09 elevation decision, grants), TA-12 (account and
  the two-proof email change), OP-10 and SA-10 (notices and account). Proofs V21 and V22.
- **Page model.** One host page per command (CC-12 to CC-18). The four carried forms stay on SA-06c and are rebuilt
  in place: WP-02 §1.5 binds the support-view start to SA-06c (seven system tests post it there), and the other three
  are short confirmations of the same account. The elevation approve and decline forms leave the list for the SA-09
  decision page SA-09s at `/admin/elevations/:elevationId/decide/:kind`, the path WP-06 §2.7.5 reserved for WP-15
  (Q-W02-03 ends). Group read grants get a task page SA-06n (`/admin/grants/new`) that shows the group from Core
  before the form; revocation gets SA-06x; both land on a new grant page SA-06h with a checked receipt. Every form
  keeps its action, its hidden inputs (`accountId`, `emailChangeId`, `proof`, `_rev.account`, `_rev.elevation`,
  `_rev.grant`, `_rev.email_change`, `_rev.notice`) and its field names; SA-06n moves `groupId` from a text input to
  a hidden input after the group is shown (D-W15-04).
- **V21.** A single SuperAdmin suspends at once, also a SuperAdmin and also while the audit record is behind
  (WP-02 built it; WP-15 proves it). SuperAdmin creation, operator elevation and restoration need a second, different
  SuperAdmin: the requester and the target never see an approve form, Core refuses a hand-made one
  (`second_superadmin_required`), approval waits while the audit record is not healthy. The ceiling part reuses
  WP-07's SA-07l, SA-07i and SA-09c unchanged. No admin page holds an address field for an existing account, no admin
  route changes an address, and a second-factor reset of a travel agent is refused as the parked lost-mailbox rule.
- **V22.** The support view keeps Core's model (a flag on the SuperAdmin's own session; reads evaluated as the viewed
  account; every command other than exit and sign-out refused before Core). WP-15 conforms the banner to SH-R09
  ("Read-only view for [individual]", "Exit support view"), adds the exit receipt, and proves on `lane-ui` that the
  viewed scope equals the person's own (row sets compared with the person's own session), that a revoked grant
  removes the group from an open support view and from the grantee's open pages at the next read, and that old links
  deny.
- **TA-12.** The email-change page gets checked receipts, the UX §4.4 pending sentence on both the account page and
  the change page, a combined truthful code-failure sentence (no "request a new code" where none exists), no lifetime
  numbers it cannot read, and LD-17 parsing (an oversized address is refused, never cut).
- **Findings worked (§9.1).** Elevation decisions in a list without evidence; typed reasons lost on refused elevation
  and grant forms; LD-17 truncations in seven handlers; a group read grant given to a typed reference with no group
  shown (privacy); unchecked `?done=` flashes; configuration numbers in copy; a non-conforming support-view banner;
  wrong staff copy on the account page and on staff notices; a notice that links an application its reader lost.
- **STOP items (§9.4).** No P0, no Kind 2. Defect notes (P2): an expired but not yet closed email change blocks a new
  start while the page hides it; the grants read has no row limit under a 2000-row contract; a support view of an
  operator omits the Accounts area the operator sees. Kind 1 notes (P2): one elevation read, `ended_by` on grant rows,
  applicant names for staff notices.
- **Top questions (§9.2).** Q-W15-01 host pages and paths, with Q-W15-13 (the four access actions in place on SA-06c,
  as here, or on four task pages, as the parallel acceptance checklist assumes); Q-W15-02 the two-step group confirmation on SA-06n;
  Q-W15-03 the SH-R09 banner words (touches the WP-01 shell and ten tests); Q-W15-04 fact mappings that withhold the
  approve form, with a parity test; Q-W15-05 proof writes; Q-W15-06 the harness extension for enrolment and emailed
  codes.

## 1. Scope, sources, pages, shell, commands

### 1.1 Sources read

| Source | Parts |
|---|---|
| UX spec `TARGET_PRODUCT_UX_SPEC.md` (SHA-256 b45186887cdc37f6…) | §2.3 (support view row, read grant rule), §3.3, §4.2 (Account, Notices), §4.4 (new email pending), §5.2 (Notices and account), §6.1 (identity/access job), §6.2 (Accounts & access), §6.3 (Account changes, Support view, Recovery boundary), §7.4, §8.2, §8.3, §12 V21, V22 |
| `BUILD_SPEC.md` r2 | B08, B09, B10, B11, B12, B28, B33, B35, B43, B44 |
| `UI-PLAN.md` | A (AD-05, AD-07, AD-12, AD-13), §2.2 (SH-R04, SH-R05, SH-R09, SH-R10, SH-R11), §3.2 TA-12, §3.3 OP-10, §3.4 SA-06, SA-09, SA-10, §5.2 TA-12, §5.3 OP-10, §5.4 SA-06, §6.1, §6.4 (Accounts and grants, Support view), §7 rows 1148–1200, §8, §10, §11, §12.2 WP-15, §13 (OC-06, OC-10, B-01, B-02) |
| Lane records | `PLAN.md` §4 (LD-02, LD-03, LD-06, LD-08, LD-11, LD-13, LD-14, LD-17), §7, §8, §9; `PROPOSALS.md`; `COMMAND-COVERAGE.md` §3, §5.1, §6 (CC-03, CC-12 to CC-18), §6.1; `WP-01.md` §3 (Q-03, Q-04, Q-11, Q-13), §4 (A-01, A-02, A-04, A-09, R-04), §6.1; `WP-01-design.md` §6 (account page), R2; `WP-01-acceptance.md` line 380 (SH-R09 to WP-15); `WP-02.md` §3 (Q-W02-03), §4 (B-02, B-03, B-06, B-14), §6, §6.1 (R-01 to R-03); `WP-02-design.md` §1.5, §4.3; `WP-02-U4-notes.md`; `WP-06-design.md` §2.1 group 7, §2.7.5; `WP-07.md` §3, §4 (F-01, F-33); `WP-07-design.md` §2.2, §2.10, §2.11, §2.12; `WP-08.md` §3; `WP-08-design.md` §1.2, §2.8 (TA-10, TA-10n, CMP-21); `WP-09.md` to `WP-14.md` §3–§4; `WP-14-design.md` (structure); `DESIGN.md` |
| Route map (RM) | §1 items 4, 7, 11; §2 rows S14, C02, C04–C06 (ta, ops, admin), A01, O06, D31, D52–D71, T38–T41; §3.2 rows of the eleven commands |
| Code (pages, routes) | `src/apps/staff/identity.ts` (all); `src/apps/staff/accounts/pages.ts` (all); `src/apps/shared/identity-routes.ts` (all); `src/apps/shared/pages/identity.ts:37-140, 520-600`; `src/apps/edge/account.ts` (all); `src/apps/staff/delivery/routes.ts:1-40, 165-215`; `src/apps/shared/delivery/routes.ts:1-160`; `src/apps/shared/delivery/pages.ts:60-90, 170-230, 620-700`; `src/apps/shared/core/shared.ts:375-530`; `src/apps/shared/common-routes.ts:30-110`; `src/apps/shared/server.ts:585-605, 750-775`; `src/web/pages/chrome.ts` (all); `src/web/ui/decision.ts:1-80`; `src/web/route-inventory.ts:120-123, 278-286, 451-471`; `src/apps/staff/instance.ts`; `test/unit/web/carried-forms-admin.test.ts` (all); `test/uat/signin-harness.ts:1-100` |
| Code (contracts, bindings) | `src/contracts/identity.ts` (all); `src/contracts/queries.ts:20-130`; `src/contracts/delivery.ts:87-93, 195-201`; `src/contracts/core.ts:404-420`; `src/core-api/bindings/identity-admin.ts` (all); `src/core-api/bindings/identity.ts:150-230`; `src/core-api/allowlists.ts:38-66, 90-92, 149-163` |
| Code (Core behaviour only) | `src/modules/identity/commands/{elevation,grants,support-view,email-change,accounts}.ts` (all); `…/commands/shared.ts:16-70`; `…/policy.ts:1-30, 60-170, 325-430, 540-700`; `…/sessions.ts:1-140`; `…/queries.ts:20-140`; `…/tasks/expiry-cleanup.ts`; `…/tasks/send-mail.ts:60-110`; `src/kernel/command.ts:340-356`; `src/kernel/guard-constraints.ts`; `src/kernel/vocabulary/{identity,reasons,delivery}.ts`; `migrations/0100_identity.sql:198, 277-279, 309`; `src/modules/delivery/notices.ts:20-80, 120-140`; `src/modules/core/commands/{assignment,holds,gates,admin}.ts` and `src/modules/core/tasks.ts` (notice recipients and events only) |
| Tests that pin the pages | §7.3 |

### 1.2 Accounts, access and email change as Core holds them (facts)

| Fact | Where Core holds it | What the pages must respect |
|---|---|---|
| Elevation kinds and two people | `create_superadmin` (opened by creating a SuperAdmin account), `elevate_operator` (`iam.request_elevation`), `restore_superadmin` (restoring a suspended SuperAdmin) (`commands/accounts.ts:53-60, 242-247`; `elevation.ts:37-64`). Approval needs a second, distinct, active SuperAdmin: never the requester, never the target (`elevation.ts:91`, refusal `control_blocked`/`second_superadmin_required`); the requester must still be an active SuperAdmin (`:93`, `elevation_requester_inactive`); one open request per target (`iam_elevations_open_uq`, `conflict_duplicate`/`elevation_open`). No first-admin or all-admin-loss path (`elevation.ts:1-6`) | The requester and the target never see an approve form; the page names a different SuperAdmin as the owner; Core decides |
| Elevation guards | Request: target active operator with an authenticator and no duties (assignments, reconciliation-owner acts, open holds on assigned applications, owned incidents) (`elevation.ts:54-60`, `elevation_target_has_duties`). Approve: state `requested` and the posted revision (`:21-26`, `stale_revision`); expired → recorded as `expired`, accepted, nothing else changes (`:86-90`); per kind the target state again (`:99-129`). Decline: the requester's decline is a withdrawal (`:157`); declining a creation request also declines the pending account (`:166-169`) | The decision page shows these facts before the form; refusals use §2.13 |
| Effects of approval | Create: target `approved` (activation is a separate step). Elevate: role `superadmin`, every session of the target revoked, every grant of the target ended `grantee_elevated` (`:113-116`). Restore: status `active`; an enrolment code is issued when no authenticator is set (`:121-125`) | Effect text per kind; no claim beyond these |
| Audit health | Commands with `privilegedElevation: true` are refused `unavailable_dependency`/`audit_degraded` before authorization while the audit projection is not healthy (`kernel/command.ts:349-351`): request and approve elevation, reset, accounting grant, group read grant, support-view start, restore, approve and activate. Containment stays available: suspend, decline elevation, revoke grant (`privilegedElevation: false`). A same-key replay resolves before this check (`:340-345`) | Privileged forms show an unavailable button with the reason while `auditOk` is false; containment forms stay |
| Reset of the second factor | Staff only; never the actor's own account (`validation_failed`/`self_action_not_allowed`); a travel agent is refused `unavailable_parked`/`parked_lost_mailbox_recovery` (`accounts.ts:272-275`); active or suspended; removes the authenticator, revokes every session, open enrolment and issued code; an active account gets a new enrolment code at its own address (`:277-290`). Summary `{result: 'credentials_reset'}` on resource `account` | No secret is shown or chosen; the page never offers a travel agent reset |
| Accounting grant | `iam.set_accounting_grant`: active operator (`grantee_not_operator`), one active per operator (`iam_grants_accounting_uq`, `grant_exists`); no revision; reason 10–500 (`grants.ts:88-116`). Summary `{result: 'created', grantId}` on resource `grant` (same shape as a group read grant) | Receipt selects the grant row by the returned id and checks its kind |
| Group read grant | Active operator with an authenticator; the group must exist (`notFound` otherwise); `validUntil` an instant after now and within `groupReadMaxMs`; one active per operator and group (`grant_exists` with `existing`); at most `groupReadMaxActive` active per operator (`grant_limit_reached`); refused `clock_degraded` while the clock is not healthy; purpose 10–500 (`grants.ts:30-86`). Read-only: metadata and released bytes of that one group; checked at every use (`policy.ts:577-582`); ends at revoke, at its time, at suspension (`grantee_suspended`) or elevation (`grantee_elevated`); the cleanup task records `expired` later (`tasks/expiry-cleanup.ts:58-66`) | A grant whose time passed gives no access although its row may still read `active`; the page says so |
| Revoke | `iam.revoke_grant`: either kind (authorized by kind, `grants.ts:128-131`); `_rev.grant` and state `active` (`stale_revision`); containment, available while the audit record is behind (`:126`). Summary `{result: 'revoked'}` on resource `grant` | Revoke stays available when other access actions are not |
| Support view | A flag on the SuperAdmin's own staff session; viewed account a travel agent or an operator, never oneself (`support_view_target_not_eligible`); no status check of the viewed account at start (`support-view.ts:32-41`); one per session (`support_view_active`); refused `clock_degraded`; reason 10–500; ends at exit, at `supportViewMaxMs`, at session revocation, or when the SuperAdmin is suspended (`vocabulary/identity.ts:81`; `accounts.ts:213-216`). Reads are evaluated as the viewed account with its current status, role, accounting grant and group read grants; a viewed account that is not active reads nothing (`policy.ts:620-626`). The BFF answers every POST except exit and sign-out with 404 and every `/admin` route with 409 `support_view_active` (`server.ts:589-602`). The viewed surfaces are `ta` or `ops` only, never `accounts` (`sessions.ts:111`) | The page shows no action of the viewed person; the banner is the confirmation of the start (it is read from the session); STOP-W15-03 for the Accounts area |
| Email change | Travel agent only, own active account (`email-change.ts:25-31`). Start: `_rev.account`; a new address different from the current one (`email_unchanged`); no uniqueness disclosure (`:69`); one open change per account (`iam_email_changes_open_uq`, `email_change_open`); a code to the current address. Confirm: only from the session that started it (otherwise `not_found_or_forbidden`, `:106`); state and `_rev.email_change` (`stale_revision`); expired → accepted `{result: 'invalid', ended: 'expired'}`; wrong code → accepted `{result: 'invalid', ended: null | 'attempts_exhausted'}`; a dead or used code → rejected `otp_invalid_or_expired`; current proof → `current_verified` and only then a code to the new address; new proof → address taken → accepted `{result: 'invalid_address'}`; else `completed`: address and document recipient switch together, every session ends (`:102-174`). Cancel: any session of the account, state open, `_rev.email_change` (`:188-194`). The page read hides an expired change (`queries.ts:128-136`); the cleanup task ends it later | The page never re-renders a code; the completion lands on sign-in (WP-01 notice); STOP-W15-01 |
| Who reads | `account.read_admin`, `account.*`, `grant.*`, `support_view.use`: SuperAdmin any (`policy.ts:107-121`); `self.read`: own, readable in a support view; `self.email_change_*`: travel agent own, not in a support view (`:103-105`); `notice.read`: recipient, readable in a support view; `notice.acknowledge`: recipient only (`:162-163`) | The travel agent account page reads the email change only outside a support view (§2.9) |
| Staff notices | Operators receive `generic_case_update` events `assigned`, `reassigned_away`, `assistance_approved`, `gate_exception_granted`, `superadmin_correction`, `problem_reported`, `handed_back`, `flag_responded`, `deferral_review_due` (assignment.ts, holds.ts, gates.ts, admin.ts, tasks.ts); SuperAdmins receive `deferral_review_due` (approver) and `financial_follow_up`; any recipient of a released file can receive `disclosure_correction` / `deletion_request` (WP-14 §1.2). `dlv.notices` returns at most 500, newest first | Staff words per event (§2.12.4); no read marker (LD-06) |
| Lists | `iam.admin_elevations`: every open request (contract ≤ 500) and the 50 most recent decided (`queries.ts:84-88`). `iam.admin_grants`: every active grant (no SQL limit; contract ≤ 2000) and the 50 most recent ended (`:94-98`), active operators with an authenticator (≤ 2000). `iam.admin_account.grants`: the account's active grants. `iam.own_grants`: 50 rows. No single-elevation and no single-grant read exist | Caps are stated; a page finds one record in its list read; STOP-W15-02, STOP-W15-05 |

### 1.3 Page list

"Kept" = existing path (LD-03). "New" = new GET route and inventory entry; route ids of new routes are proposals.
"opt." = read through `optionalView` (LD-14).

| ID | Page | Path | Status | Reads |
|---|---|---|---|---|
| SA-06a, SA-06b, SA-06d | User accounts, Create an account, Duties | `/admin/accounts`, `/admin/accounts/new`, `/admin/accounts/:accountId/duties` | WP-02, unchanged | as WP-02 |
| SA-06c | Account | `/admin/accounts/:accountId` | WP-02 page; WP-15 rebuilds "Access and support" and "Grants", the WP-15 receipts and two links (§2.1) | `iam.admin_account`; opt. `iam.operator_duties` (WP-02 rule `wantsDuties`) |
| SA-06e | Elevation requests | `/admin/elevations` | Kept, rebuilt (`admin.elevations.list`); approve and decline forms leave | `iam.admin_elevations` |
| SA-09s | Elevation decision | `/admin/elevations/:elevationId/decide/:kind`, `kind` ∈ `approve`, `decline` | **New** (`admin.elevations.decide`, action `account.read_admin`) | `iam.admin_elevations` (required); opt. `iam.admin_account` of the target; opt. `iam.admin_account` of the requester (approve kind only); opt. `iam.operator_duties` of the target (`elevate_operator` only) |
| SA-06g | Grants | `/admin/grants?kind=&page=` | Kept, rebuilt (`admin.grants.list`); create and revoke forms leave | `iam.admin_grants` |
| SA-06h | Grant | `/admin/grants/:grantId` | **New** (`admin.grants.detail`, action `account.read_admin`); hosts the grant receipts | `iam.admin_grants` |
| SA-06n | Give read access to a group | `/admin/grants/new?group=&grantee=`; form → POST `/admin/grants` (D67) | **New** (`admin.grants.new`, action `account.read_admin`) | `iam.admin_grants` (operators, limits, audit); `core.admin_group` (required for the form, only when `group` is in the address) |
| SA-06x | Revoke a grant | `/admin/grants/:grantId/revoke` (GET beside POST D69) | **New** (`admin.grants.revoke_form`, action `account.read_admin`) | `iam.admin_grants` |
| SH-R09 | Support-view banner | every page of a support view | WP-01 shell; words conformed (AM-W15-01) | session |
| TA-12a, OP-10a, SA-10a | Your account | `/account` (edge and staff) | WP-01 page; WP-15 completes the address section, the pending line and staff copy (§2.9) | `iam.account_page`; opt. `iam.email_change_page` (travel agent on edge, outside a support view) |
| TA-12e | Change your email address | `/ta/account/email` (edge) | Kept, rebuilt (`ta.account.email`) | `iam.email_change_page`; `core.operation` (receipt) |
| OP-10n, SA-10n | Notices | `/ops/notices?view=`, `/admin/notices?view=` | Kept, rebuilt (`ops.notices`, `admin.notices`) | `dlv.notices` |
| OP-10i, SA-10i | Notice | `/ops/notices/:noticeId`, `/admin/notices/:noticeId` | Kept, rebuilt (`ops.notices.one`, `admin.notices.one`); host of acknowledge | `dlv.notice`; `core.operation` (receipt) |

Each new GET route validates its ids (`zWireId('elv')`, `zWireId('grt')`; `group` and `grantee` query values with
`zWireId('grp')` and `zWireId('acc')`); a parse failure of a path id is the uniform 404; an unknown `kind` is the
uniform 404; a malformed query value is ignored (SH-R06), except SA-06n step 1, which shows a field error (§2.6). The
static path `/admin/grants/new` takes precedence over `/admin/grants/:grantId` (Fastify's router; `zWireId('grt')`
also refuses `new`); a route test asserts it. `resolve` returns `{ type: 'installation' }` for every new GET (the
reads authorize at Core).

### 1.4 Shell placement (WP-01 §2.2)

| Page | Rail destination (`current`) | Breadcrumb |
|---|---|---|
| SA-06c | SuperAdmin: Accounts & access, member "User accounts" `/admin/accounts` (WP-02) | "User accounts › [name]" |
| SA-06e, SA-09s | member "Elevation requests" `/admin/elevations` (label was "Elevations", AM-W15-01) | "Elevation requests" / "Elevation requests › [kind words]: [target]" |
| SA-06g, SA-06h, SA-06n, SA-06x | member "Grants" `/admin/grants` | "Grants" / "Grants › [grant words]: [operator]" / "Grants › Give read access" / "Grants › [grant words]: [operator] › Revoke" |
| TA-12a, TA-12e | Travel agent: account menu (no rail destination; `current` `/account`) | TA-12e: "Your account" |
| OP-10n, OP-10i, OP-10a | Operator: Notices and account, members "Notices" `/ops/notices` and "Your account" `/account` | OP-10i: "Notices" |
| SA-10n, SA-10i, SA-10a | SuperAdmin: top-bar "Notices" (`signed-in.test.ts:84`) and the account menu | SA-10i: "Notices" |

The navigation counts do not change: `/ops/notices` and `/admin/notices` keep `noticesToAcknowledge`
(`attention.ts:28, 39`). No count is added for elevation requests (SA-01 group 7, WP-06, states it).

### 1.5 The WP-15 commands and their pages

Field names are the current ones. `_csrf` and `_op` are on every form. "Rev" is the `_rev.<aggregate>` hidden field.

| # | Command | Route id (POST path) | Host page | Fields | Rev | Handler change |
|---|---|---|---|---|---|---|
| 1 | `iam.request_elevation` | `admin.accounts.elevation` (`/admin/accounts/:accountId/elevation`) | **SA-06c** "Access and support" (rebuilt in place) | `reason` | `account` | §2.16 parsing; success `receiptLocation('/admin/accounts/<id>', 'elevation_requested', key)` (today `?done=elevation_requested`, `identity.ts:460`); refusal re-renders SA-06c with the form open (as today) |
| 2 | `iam.approve_elevation` | `admin.elevations.approve` (`/admin/elevations/:elevationId/approve`) | **SA-09s** `approve` (moved from the list, `identity.ts:198-210`) | `reason` | `elevation` | success `receiptLocation('/admin/elevations/<id>/decide/approve', 'approved' or 'expired', key)` by `summary.result` (today `?done=approved_elevation`, `:483`); refusal re-renders SA-09s (today the list, `:480-481`) |
| 3 | `iam.decline_elevation` | `admin.elevations.decline` (`…/decline`) | **SA-09s** `decline` (moved, `:211-219`) | `reason` | `elevation` | success code `declined` or `withdrawn` by `summary.result`; refusal re-renders SA-09s |
| 4 | `iam.reset_credentials` | `admin.accounts.reset_credentials` (`…/reset-credentials`) | **SA-06c** | `reason` | `account` | success code `credentials_reset` with `op` (today plain, `:455`) |
| 5 | `iam.set_accounting_grant` | `admin.accounts.accounting_grant` (`…/accounting-grant`) | **SA-06c** | `reason` | `account` (posted; Core takes none) | success `receiptLocation('/admin/grants/<summary grantId>', 'accounting_granted', key)` when the resource is a `grant` with an id matching `^grt_` (Core always answers so), else 303 to SA-06c without a receipt; refusal re-renders SA-06c |
| 6 | `iam.create_group_read_grant` | `admin.grants.create` (`/admin/grants`) | **SA-06n** (moved from SA-06g, `identity.ts:257-264`) | `granteeAccountId` (select), `groupId` (hidden, D-W15-04), `purpose`, `validUntil` (date) | — | §2.16; success `receiptLocation('/admin/grants/<id>', 'granted', key)` (today `/admin/grants?done=grant_created`, `:516`); refusal re-renders SA-06n at the POST address with `restorePath` = SA-06n with `group` and `grantee`; `not_found_or_forbidden` → shell (today rewritten as a field error, `:513`) |
| 7 | `iam.revoke_grant` | `admin.grants.revoke` (`/admin/grants/:grantId/revoke`) | **SA-06x** (moved from SA-06g, `:265-275`) | `reason` | `grant` | success `receiptLocation('/admin/grants/<id>', 'revoked', key)`; refusal re-renders SA-06x |
| 8 | `iam.start_support_view` | `admin.support_view.start` (`/admin/support-view`) | **SA-06c** (stays; WP-02 §1.5) | `accountId` (hidden), `reason` | — | §2.16 (`accountId` read whole); success 303 `/account` (unchanged, D-W15-12); refusal re-renders SA-06c (as today) |
| 9 | `iam.start_email_change` | `ta.account.email.start` (`/ta/account/email`) | **TA-12e** | `newEmail` | `account` | §2.16; success `receiptLocation('/ta/account/email', 'started', key)` (today `?done=started`) |
| 10 | `iam.confirm_email_change` | `ta.account.email.confirm` (`…/confirm`) | **TA-12e** | `emailChangeId` (hidden), `proof` (hidden), `code` | `email_change` | §2.16; `current_verified` → receipt `current_verified`; `completed` → cookie cleared, 303 `/sign-in?email_changed=1` (unchanged); other accepted results re-render TA-12e (§2.10) |
| 11 | `iam.cancel_email_change` | `ta.account.email.cancel` (`…/cancel`) | **TA-12e** | `emailChangeId` (hidden) | `email_change` | success receipt `cancelled` |
| 12 | `dlv.acknowledge_notice` (operator, SuperAdmin; CC-03) | `ops.notices.acknowledge`, `admin.notices.acknowledge` (`/{ops,admin}/notices/:noticeId/acknowledge`) | **OP-10i**, **SA-10i** | — | `notice` | success `receiptLocation('/<s>/notices/<id>', 'acknowledged', key)` (today `?done=acknowledged`, `shared/delivery/routes.ts:125`); refusal re-renders the notice page |
| — | `iam.end_support_view` (WP-01) | `admin.support_view.end` | SH-01 banner (unchanged host) | — | — | success `receiptLocation('/admin/accounts/<viewed>', 'support_view_ended', key)` (today plain, `identity.ts:550`); `stale_revision` → 303 `/admin/accounts` (unchanged) |
| — | `iam.sign_out` (WP-01) | `sign_in.sign_out` | `/account` and the account menu | `scope` | — | Unchanged |

Done codes: `elevation_requested`, `credentials_reset`, `support_view_ended` (SA-06c); `approved`, `expired`,
`declined`, `withdrawn` (SA-09s); `granted`, `accounting_granted`, `revoked` (SA-06h); `started`, `current_verified`,
`cancelled` (TA-12e); `acknowledged` (OP-10i, SA-10i). Each command has exactly one host page per surface, so a
refusal always re-renders the page it came from. A WP-15 code without `op` shows nothing (WP-02 rule).

### 1.6 Forms that leave pages, and carried forms

| Form | Leaves | Link that replaces it |
|---|---|---|
| Approve, decline, withdraw an elevation request (`identity.ts:188-224`) | SA-06e list | Row links "Decide" and "Decline" (another SuperAdmin) or "Withdraw your request" (the requester) → SA-09s; SA-06c next action links the same (AM-W15-06) |
| Create a group read grant (`identity.ts:257-264`) | SA-06g | Primary button link "Give read access to a group" → SA-06n; SA-06c "Give read access to a group" → SA-06n `?grantee=`; SA-04g "Give an operator read access to this group" → SA-06n `?group=` (AM-W15-02) |
| Revoke a grant (`identity.ts:265-275`) | SA-06g | Row link "Revoke" → SA-06x; SA-06c grants table and SA-06h link the same |
| Acknowledge a staff notice (`shared/delivery/pages.ts:687-690`) | Stays on the notice page (rebuilt) | — |

Carried forms rebuilt in place, not moved: reset, elevation request, accounting grant and support-view start on SA-06c.
`CARRIED_ACCOUNT_FORMS` and `CARRIED_DONE` (`accounts/pages.ts:449-462`) are removed; the carried-form test keeps its
WP-13 entries only. After WP-15 no WP-15 form is carried on any page.

### 1.7 Shared components and dependencies

Reused, no new variant: WP-01 CMP-07 (`errorSummary`), CMP-08 (`operationReceipt`, `receiptLocation`,
`readReceipt`, `receiptDocumentTitle`), CMP-10 (`boundaryNotice`, `unavailableButton`), CMP-12 (`freshness`), CMP-13
(operation status page), CMP-14 (`staleComparison`). WP-02 U0: CMP-25 `decisionPage`, CMP-01 `actionPanel`,
`statusFacts`; WP-02 U4: `actionBlock`, `accountProblems`, the account messages table. WP-07: the SA-09c pattern
(states first-match, fact mappings with a parity test). WP-08 U4: CMP-21 `noticeItem`, the TA-10n notice page body and
`disclosureBody` (with AM-W14-02). WP-09 U2: the unsent text block. Existing: `confirmDisclosure`, `selectField`,
`textField`, `textareaField`, `dataTable`, `identifier`, `timeAt`, `stepper`, `form`.

New staff modules (no new `src/web/ui/` component): `src/apps/staff/accounts/words.ts` (closed word tables of
§2.12.1 to §2.12.3 and the staff sentences of §2.13), `src/apps/staff/accounts/elevations.ts`,
`src/apps/staff/accounts/grants.ts`, `src/apps/staff/notices/pages.ts` (with the staff event words of §2.12.4).

Dependency: WP-15 builds after WP-07 (OP-01a read-only section; `/ops/grants` → 303; the SA-09c pattern), WP-08 (TA-10
renderers, CMP-21), WP-11 phase 2 (SA-04g, for AM-W15-02 only) and WP-14 (AM-W14-02 words) are integrated (PLAN §3
order). WP-15 MUST NOT build a second decision page, receipt mechanism or notice renderer. If WP-08 is not integrated
when WP-15 starts, U5 waits; the other units do not depend on it.

### 1.8 Amendments to designed packages

Each binds the build of the named package if it is not built yet; otherwise the WP-15 unit named in §7.1 applies it.

| ID | Package, place | Rank | Amendment |
|---|---|---|---|
| AM-W15-01 | WP-01 shell: `src/web/pages/chrome.ts:52-79`; `src/web/pages/status.ts:108`; `src/web/ui/shell.ts:176` | P1 | SH-R09 banner: title "Read-only view for [name]"; text "You see what this [travel agent / operator] account can read now. You cannot act as them, change anything or download documents."; "Reason: [reason]"; "Ends at [time] IST."; "Account [reference]"; button "Exit support view" (form action, route id and hidden fields unchanged). The 409 page for `support_view_active` reads: "A read-only view is open in this browser session. Nothing you sent from this page was recorded. Exit the view with “Exit support view” in its banner, then open SuperAdmin pages again." The SuperAdmin member label "Elevations" becomes "Elevation requests" (one name for the tab and its `h1`, WP-02 D-U4-01). Applied by U6 |
| AM-W15-02 | WP-11 §2 SA-04g group page (phase 2) | P2 | Secondary link "Give an operator read access to this group" → `/admin/grants/new?group=<groupId>` |
| AM-W15-03 | WP-08 U4 `src/apps/shared/pages/notices.ts` (`noticeItem`, the notice page) | P2 | The renderers take the surface (`ta`, `ops`, `admin`) and a notice-words function, so OP-10 and SA-10 reuse them with the staff words of §2.12.4; the application link is optional per row (none for `reassigned_away`); the delivery link shows only for `result_available` and `disclosure_correction`. No second renderer |
| AM-W15-04 | WP-06 §2.1 SA-01 group 7 | P2 | Unchanged counts; the link target stays `/admin/elevations`. Line "[k] of them requested by you: a different SuperAdmin decides those" stays (no change; recorded for completeness) |
| AM-W15-05 | WP-07 §2.2 OP-01a | P2 | None to the page. The proof V22-6 reads its read-only section in a support view; WP-07 MUST keep the line "Read-only access: [purpose], until [time] IST" and the `#read-only` anchor |
| AM-W15-06 | WP-02 SA-06c (built): `accounts/pages.ts:645-684, 770-776` | P1 | Next action for a pending SuperAdmin and for a suspended SuperAdmin with an open restoration: action link "Decide the request" → SA-09s `approve` (another SuperAdmin) or "Withdraw your request" → SA-09s `decline` (the requester); the "Open elevation request" callout for `elevate_operator` links the same. Applied by U1 |

## 2. Page specifications

### 2.0 Rules common to every WP-15 page

- **Freshness (LD-08).** Every WP-15 read is authoritative: CMP-12 "Read at [time] IST". No page applies its own age
  threshold.
- **Page states.** S1: pages are rendered complete by the server. S6 and S7: the SH-02 pages of WP-01 (uniform 404
  without object facts; Core unreachable: "TravelMudra is unavailable now"; maintenance: the status document, A-09).
  Each page lists its own S2 to S5 states.
- **Optional reads (LD-14).** Only through `optionalView`. An availability failure renders the block's own
  "[…] cannot be read now." and never a zero, "None" or a success word. Every other refusal reaches the shell. A
  decision or task page whose form depends on a read (SA-06n needs `core.admin_group`) keeps its frame and shows
  CMP-10 "This step cannot be prepared now: [what] cannot be read. Try again later. Owner: TravelMudra." with no form.
  An optional read that only adds evidence (SA-09s target, requester and duties) degrades to a note; the form stays,
  because Core checks the same facts at the command.
- **Command results.** ACC: 303 to the receipt location of §1.5; CMP-08 first in `main`, its title first in the
  document title. A receipt names a result only when `core.operation` returns the expected resource and the summary
  test of §2.14; otherwise it is the unchecked receipt of WP-01 A-04. Recorded facts come only from the operation
  summary and from records selected by the ids it returns; every later read is labelled "Current". REJ: the host page
  re-rendered at the POST address with `restorePath` = the GET page, the category's status, CMP-07 focused, every
  typed value kept (LD-17) except a code, sentences from §2.13. C5: CMP-14 (§2.15). UNR: 303 to
  `/<surface>/operations/<key>`; no new submission of the same intent is offered.
- **Access refusals.** `unauthenticated`, `not_found_or_forbidden` and `maintenance` answers reach the shell: the
  typed values are lost and the page says nothing about the object (B10). `unavailable_dependency` with the codes
  `audit_degraded` and `clock_degraded` re-renders the form with §2.13 (as WP-02 SA-06b and WP-07 D-W07-12); every
  other `unavailable_dependency` reaches the shell. Every other refusal re-renders.
- **K rules.** Approve elevation: K-2P (the second person is the approver). All other routes: K-STD. A form carries
  one `_op` from page load; a browser resend reuses it; a re-render after a refusal issues a new `_op` on every form
  of the page. Confirm email change: K-OTP (a code is never re-rendered; a resend of the same `_op` replays Core's
  recorded answer).
- **Core decides.** A page shows a form only when the facts of its read allow the command (as WP-02 `statusActions`
  and WP-07 SA-09c); the fact mappings that withhold a form are listed per page and each has a parity test with
  Core's own check (§7.2). A hand-made POST still reaches Core, which decides.
- **Names.** A page names an account only from a Core read that returns the name for this reader (account rows,
  elevation rows, grant rows) or "You" for the reader. Raw references appear only as copyable `identifier`s beside a
  name or as the fallback "Account [reference]".
- **Privacy and credentials.** No page shows, chooses, resends or describes a sign-in code, an enrolment code, an
  authenticator key or a TOTP value; no page lets a staff member act as another person. An email address shows only
  on the person's own pages and on SuperAdmin account pages (as today). Support views show the viewed person's own
  pages only.
- **Support view.** `/admin` pages are not reachable in a support view (409, AM-W15-01 words). The account page and
  the travel agent's pages render no form in a support view except the banner's exit and the account menu's sign-out
  (DESIGN.md "Support view").
- **No admin override.** No admin page offers an address field for an existing account, a credential, a sign-in
  code, "Sign in as", "Impersonate" or "Override". A test asserts it (§7.2 (c)).
- **Copy.** UI-PLAN §11. Every time carries "IST". Counts name their unit. No lifetime, attempt or duration number
  that the page does not read (WP-01 Q-13): "72 hours" and "30 minutes" go. The code length stays: it is part of
  Core's input contract (`zOtpCode`, 8 digits), not a setting. Synthetic data shows "Synthetic" (CR-08). Forbidden
  on WP-15 pages: "Override", "Impersonate", "Sign in as", "Log in as", "Recover", "Reset password", "Something went
  wrong", "Nothing changed" before a proven refusal (WP-02 B-03). All copy is draft (CR-09).
- **Mobile (< 768 px).** One column; tables stack into labelled rows. Decision and task pages put scope and effect
  before the fields; the primary action is at the end of the form, never in a fixed bar (UX §7.3).

### 2.1 SA-06c Account: "Access and support" and "Grants" (rebuilt in place)

WP-02 §4.3 and `WP-02-U4-notes.md` §2.3 hold the page; this section changes only the parts below. The action blocks
keep WP-02's `actionBlock` pattern: `confirmDisclosure` with a purpose-named reason ("Reason for …"), `_rev.account`,
the error summary inside the form, the typed reason kept, privileged actions shown as an unavailable button with
"Unavailable while the audit record is behind." while `auditOk` is false.

1. **Receipt** (§2.14): `elevation_requested`, `credentials_reset`, `support_view_ended` join WP-02's codes.
2. **Next action** (AM-W15-06): pending SuperAdmin, and suspended SuperAdmin with an open restoration request — owner
   "A second, different SuperAdmin"; action "Decide the request" (→ SA-09s `approve`) for another
   SuperAdmin; for the requester "Withdraw your request" (→ SA-09s `decline`) with blocker "Another person
   owns this step".
3. **Section "Access and support"** (`id="access"`), lead "Each action needs a reason and is recorded with your name."
   Actions in this order, each only when its row applies:

| Key | Applies when (facts of `iam.admin_account`) | Title | Body | Consequences (list) | Extra | Privileged |
|---|---|---|---|---|---|---|
| `elevate` | role operator, status active, authenticator set up, `openElevation` null, and the duties read is not ok or reports no duty | "Request that [name] becomes a SuperAdmin" | "A second, different SuperAdmin decides the request. You cannot approve it yourself." | "A request opens. Nothing changes for [name] until a different SuperAdmin approves it." · "On approval [name] becomes a SuperAdmin at once: every session of [name] ends, and every grant of [name] ends and is not restored." · "The request expires if nobody decides it in time; its end time shows once it is open." | Duties line: "Duties now: none." (read ok, all zero) or "Duties cannot be read now. TravelMudra refuses the request if [name] still holds any duty." | Yes |
| `elevate` withheld | as above, but the duties read is ok and reports a duty | — | CMP-10 in place of the action: "Requesting elevation is unavailable while [name] holds duties: [a] assigned applications, [r] acts where [name] owns reconciliation, [h] open holds, [i] owned incidents. Hand them over first. Owner: SuperAdmin." Link "Open duties and hand-off" | — | — | — |
| `accounting` | role operator, status active, no active accounting grant in `grants` | "Give [name] the accounting grant" | "The grant opens the Accounts area for [name]. Every Accounts action is unavailable in this release; the grant gives no access to applications." | "[name] sees the Accounts area from their next page." · "It stays until a SuperAdmin revokes it on Grants." · "A support view of [name] does not show the Accounts area." (STOP-W15-03) | — | Yes |
| `support` | role travel agent or operator, status active, not the reader | "Open a read-only view for [name]" | "You read exactly what [name] can read now, with a banner on every page. You cannot act as [name]: no form, no download, no change." | "The view ends when you exit it, at the end time its banner shows, or when either account is suspended." · "While it is open, SuperAdmin pages in this browser session show only the way out." · "The start, the end and your reason are recorded." | hidden `accountId` | Yes |
| `reset` | role operator or SuperAdmin, not the reader, status active or suspended | "Reset [name]'s second factor" | "For a lost or compromised authenticator. Nobody sees or chooses a credential, you included." | "The authenticator is removed and every session of [name] ends at once." · Active: "An enrolment code is sent to [name]'s own address. [name] sets up a new authenticator with it." Suspended: "An enrolment code is sent when the account is restored." · "Open sign-in codes and an open set-up stop working." | — | Yes |

   A suspended SuperAdmin and a pending or declined account show no access action; the section description then reads
   "No access or support action applies to this account now." A travel agent never has `reset`: the "Sign-in address"
   section states the lost-mailbox boundary (WP-02). The "Open elevation request" callout for `elevate_operator`
   (WP-02) stays, with "Requested by [name] on [time] IST. Expires [time] IST." (or "Expired at [time] IST: it closes
   by itself.") and the AM-W15-06 links.
4. **Section "Grants"** (`id="grants"`), lead "Grants of this account. Each one is read-only access or the accounting
   grant; none adds an action on applications." Table: Grant (§2.12.2 words; for a group read grant the group
   reference as `identifier`), Purpose, Valid until ("[time] IST"; "Until revoked" for accounting; "Its time passed at
   [time] IST: no access now"), Granted ("[name], [time] IST"), Action ("Open" → SA-06h; "Revoke" → SA-06x). Below:
   "Give read access to a group" → SA-06n `?grantee=<id>` (operator, active, authenticator set up). Empty: "No active
   grant."
5. **Removed:** the `?done=` flashes of `CARRIED_DONE`; the "Open grants" empty-state button (replaced by item 4).

| State | Copy |
|---|---|
| C3 `elevation_requested` | Receipt "Elevation requested" (§2.14) |
| C3 `credentials_reset` | Receipt "Second factor reset" |
| C3 `support_view_ended` | Receipt "Read-only view ended" |
| C2 each access action | §2.13; the action's own confirmation re-opens with the typed reason (WP-02 D-U4-05) |
| C2 hand-made reset of a travel agent | Refusal callout under the header (the action is not on the page): §2.13 `parked_lost_mailbox_recovery` |
| C5 | §2.15 |
| Audit behind | WP-02's note, extended: "Approving, activating, restoring, the elevation request, the accounting grant, the read-only view and the second-factor reset are unavailable until it catches up. Declining, suspending and revoking stay available." |

### 2.2 SA-06e Elevation requests `/admin/elevations`

Purpose: see every SuperAdmin request and reach its decision page (UX §6.2 "second-SA approvals").

1. Header: `h1` "Elevation requests"; lead "Creating a SuperAdmin, making an operator a SuperAdmin and restoring a
   suspended SuperAdmin each need a request by one SuperAdmin and approval by a second, different one."; freshness.
2. Audit line when `auditOk` is false: callout warning "The audit record is behind. Approving is unavailable until it
   catches up. Declining and withdrawing stay available."
3. Section "Waiting for a decision" (`id="open"`), count "[n] requests". Table (caption "Requests waiting for a
   decision"): Request (§2.12.1 kind words); Account (target name → SA-06c); Requested by ("You" or name); Requested
   ([time] IST); Ends ("[time] IST", or "Expired at [time] IST: it closes by itself"); Action — reader is the
   requester: "Withdraw your request" (→ SA-09s `decline`) and the line "A different SuperAdmin decides.";
   otherwise "Decide" (→ SA-09s `approve`) and "Decline" (→ SA-09s `decline`); expired: no link.
   No reason column (the reason shows whole on SA-09s).
4. Section "Decided" (`id="decided"`): Request; Account; Requested by; Decision (§2.12.1 state words with the
   decider's name); When. Cap line at 50 rows: "This list shows the 50 most recent decided requests."

| State | Copy |
|---|---|
| S2 open empty | "No request waits for a decision." |
| S2 decided empty | "No request has been decided yet." |

### 2.3 SA-09s Elevation decision `/admin/elevations/:elevationId/decide/:kind`

The SA-09 kind "SA elevation second approval" (AD-13; WP-06 §2.7.5). CMP-25 `decisionPage`. Reads `iam.admin_elevations`
(the request is the `open` or `decided` row with this id), then the optional reads of §1.3.

Approve (`approve`):

1. Header: breadcrumb "Elevation requests"; `h1` by kind: "Approve a new SuperAdmin account: [target]" /
   "Approve: [target] becomes a SuperAdmin" / "Approve the restoration of [target] as a SuperAdmin"; freshness.
2. Receipt (§2.14).
3. Scope: "One request: [kind words] for [target] (account [reference]). Requested by [requester] on [time] IST.
   Ends [time] IST."
4. Evidence: "Reason given by [requester]: [reason, whole]". Target now (opt. `iam.admin_account` of the target):
   role, status since, authenticator ("Set up", "Not set up"); `elevate_operator`: duties now (opt.
   `iam.operator_duties`: "[a] assigned applications, [r] acts where the operator owns reconciliation, [h] open
   holds, [i] owned incidents" or "none"). Requester now (opt. `iam.admin_account` of the requester): "Active
   SuperAdmin" or status words. "Active SuperAdmins now: [n]" (`activeSuperAdmins` of the target read). Each read that
   fails reads "[…] cannot be read now. TravelMudra checks it when you approve."
5. Effect, changes: create — "[target]'s account becomes Approved. A SuperAdmin then activates it; [target] receives
   an enrolment code at their own address."; elevate — "[target] becomes a SuperAdmin at once." · "Every session of
   [target] ends; [target] signs in again with their authenticator." · "Every grant of [target] ends and is not
   restored."; restore — "[target] becomes an active SuperAdmin at once." · "Grants are not restored." · (target
   without an authenticator) "An enrolment code is sent to [target]'s own address." Unchanged: "No other account
   changes." · "The requester's name and reason stay recorded beside yours."
6. Hard stops: "Two different SuperAdmins: the requester and the account itself never approve." · "Approving waits
   while the audit record is not healthy." · CMP-10 "Creating or recovering a SuperAdmin without a second active
   SuperAdmin is unavailable until the product owner selects a recovery policy. Owner: product owner." (ref
   `parked_first_admin`).
7. Your decision: "Reason for approving" `reason` (required; hint "10 to 1,000 characters. It is kept in the audit
   record."); hidden `_rev.elevation`.
8. Review (visible section): "When you approve: [first effect sentence]. Your name, your reason and the time are
   recorded with the requester's."
9. Buttons: "Approve" with the kind's verb ("Approve the new SuperAdmin account", "Approve: make [target] a
   SuperAdmin", "Approve the restoration") (primary); "Cancel" → SA-06e.

Decline (`decline`): `h1` "Decline the request: [kind words] for [target]" or, for the requester, "Withdraw
your request: [kind words] for [target]"; scope and evidence as approve (without the requester-now row); effect
"The request closes as declined [withdrawn]. Nothing else changes for [target]." and, for `create_superadmin` with
the target pending, "[target]'s account becomes Declined. Its address is free for a new account."; unchanged "A new
request is needed to try again."; no hard stops block; field "Reason for declining" / "Reason for withdrawing"
(`reason`, required); review "When you decline [withdraw]: the request closes now. Your name, your reason and the time
are recorded."; button "Decline the request" / "Withdraw the request" (destructive). Available while the audit record
is behind.

States (first match; the decision component's states in brackets):

| # | State | Condition | Copy (no form unless stated) |
|---|---|---|---|
| 1 | Not listed (closed) | no `open` or `decided` row has this id | "No open request has this reference. Decided requests are listed for the 50 most recent only." Link "Elevation requests". Status 200 (STOP-W15-02) |
| 2 | Decided (closed) | the row is in `decided` | "This request was [approved by [name] / declined by [name] / withdrawn by the requester] on [time] IST" or "This request expired at [time] IST." and "Reason recorded: [decision_reason]" when present. Link "Elevation requests" |
| 3 | Expired, not yet closed (closed) | open row, `expires_at` ≤ now | "This request expired at [time] IST. TravelMudra records it as expired by itself; nothing changes for [target]. A new request is needed." (D-W15-06) |
| 4 | Awaiting a second approver (approve kind) | reader = requester or reader = target | "You requested this. A different SuperAdmin approves it." (target: "This request is about your own account. A different SuperAdmin approves it.") Link "Withdraw your request" (requester). With `activeSuperAdmins` ≤ 1 from the target read: add "No other active SuperAdmin exists now, so nobody can approve it before it ends." |
| 5 | Unavailable (approve kind) | `auditOk` false | CMP-10 "Approving is unavailable until the audit record is healthy again. Declining stays available. Owner: TravelMudra." Link "Decline the request" |
| 6 | Requester no longer active (approve kind) | requester read ok and the requester is not an active SuperAdmin | "[requester] is no longer an active SuperAdmin, so this request cannot be approved. Decline it; a new request is needed." Link "Decline the request" |
| 7 | Target holds duties (`elevate_operator`, approve kind) | duties read ok and any count > 0 | "[target] holds duties now: [counts]. Approving is refused until they are handed over." Links "Open duties and hand-off", "Decline the request" |
| 8 | Target changed (approve kind) | target read ok and the target no longer fits the kind (create: not pending SuperAdmin; elevate: not an active operator; restore: not a suspended SuperAdmin) | "[target]'s account changed after the request: now [role, status]. This request cannot be approved. Decline it." Link |
| 9 | Draft | otherwise | The form |
| — | C3 | after acceptance | Receipt (§2.14); the page then shows state 2 |
| — | C2 | refused | §2.13 sentence with the re-read state; the typed reason stays in the WP-09 unsent text block when the form no longer applies, in the field when it does |
| — | C5 | `stale_revision` | §2.15 |

### 2.4 SA-06g Grants `/admin/grants`

Purpose: see every active grant and reach its revoke page; start a new group read grant (UX §6.2 "exact read
grants").

1. Header: `h1` "Grants"; lead "A group read grant lets one operator read one group's applications and released
   documents for a stated purpose, until a set day. It allows no action. The accounting grant opens the Accounts area
   for an operator; every Accounts action is unavailable in this release."; primary action "Give read access to a
   group" → SA-06n, shown as `unavailableButton` with "Unavailable while the audit record is behind." when `auditOk`
   is false (words pinned by `ported-pages.test.ts:378`); freshness.
2. Rule line from the read: "An operator holds at most [groupReadMaxActive] active group read grants. A group read
   grant lasts at most [floor(groupReadMaxMs / 1 day)] days."
3. Filter (GET, enumerated): "Kind" (`kind` = `group_read` "Group read", `accounting` "Accounting"), "Apply", "Clear
   the filter". Unknown values are ignored.
4. Section "Active" (`id="active"`), count "[n] active grants" ("2000 or more" at the contract cap). Table (caption
   "Active grants"): Grant (§2.12.2; group reference `identifier`); Operator (name → SA-06c); Purpose (whole text,
   wraps); Valid until (as §2.1 item 4); Granted ("[name], [time] IST"); Action ("Open" → SA-06h, "Revoke" → SA-06x,
   no "Revoke" when the time passed). Display paging 50 rows (`page`), over the one read (Q-W15-11).
5. Section "Ended" (`id="ended"`): Grant; Operator; Ended ([time] IST); How (§2.12.3). Cap line at 50 rows: "This list
   shows the 50 most recently ended grants."

| State | Copy |
|---|---|
| S2 no active grant | "No active grant." |
| S3 filter, no row | "No active grant of this kind." + "Clear the filter" |
| S2 ended empty | "No grant has ended yet." |

### 2.5 SA-06h Grant `/admin/grants/:grantId`

Purpose: one grant with its facts and receipts (host of `granted`, `accounting_granted`, `revoked`).

1. Header: breadcrumb "Grants"; `h1` "[Group read grant / Accounting grant]: [operator]"; meta Reference (`identifier`,
   copy); freshness.
2. Receipt (§2.14).
3. Status facts ("Grant", visible title): Kind; Operator (→ SA-06c); Group (reference; → SA-04g when registered) for a
   group read grant; Purpose; Valid from; Valid until; Granted by ([name], [time] IST); State (§2.12.2: "Active";
   "Active in the record, but its time passed at [time] IST: it gives no access now"; "Revoked on [time] IST";
   "Expired on [time] IST"; "Ended on [time] IST: [§2.12.3 words]").
4. Action panel (CMP-01): active and time not passed — owner "SuperAdmin", step "Revoke it when the access is no
   longer needed.", action "Revoke" → SA-06x; otherwise owner "No owner", step "A grant that ended is not restored.
   Give a new one if access is needed again.", action for a group read grant "Give read access to a group" → SA-06n
   `?group=<group>&grantee=<operator>`.
5. Line (group read only): "The operator sees this access as “Read-only access: [purpose], until [time] IST” on their
   Applications page."

| State | Copy |
|---|---|
| Not listed | "No active grant has this reference. Ended grants are listed for the 50 most recent only." Link "Grants". Status 200 |

### 2.6 SA-06n Give read access to a group `/admin/grants/new`

Purpose: give one operator read access to exactly one group, for a named purpose and a bounded time (UI-PLAN SA-06
"Exact group scope, purpose, duration"; B10). CMP-25 frame.

Step 1 (no valid `group` in the address):

1. Header: breadcrumb "Grants"; `h1` "Give read access to a group"; lead "Read access lets one operator read one
   group's applications and released documents. It allows no action."; freshness.
2. Section "Which group" with a GET form (action `/admin/grants/new`, no CSRF, no `_op`): "Group reference" (`group`,
   mono, `spellcheck=false`; hint "Copy it from the group's page under Applications & groups. Give access only to the
   one group the purpose needs."); hidden `grantee` when present; button "Show the group". A value that is not a group
   reference re-renders step 1 with the field error "This is not a group reference. It starts with grp_." and no Core
   read (SH-R06: the address holds only opaque ids).

Step 2 (`group` present and well formed): reads `core.admin_group` (required). A not-found answer reaches the shell
(LD-14); an availability failure shows the §2.0 "cannot be prepared now" notice with no form.

1. Header as step 1.
2. Scope: "Read access to one group: [label] (reference [id]). Travel [start] to [return]. [n] applications." Links
   "Open the group" (SA-04g, when registered) and "Choose another group" (step 1, keeps `grantee`).
3. Evidence: the operator rule line of §2.4 item 2.
4. Effect, changes: "The operator you choose can read this group's applications and released documents until the end
   of the day you choose (India time)." · "The access is checked at every page and download; it ends at once when you
   revoke it, at its end, or when the operator is suspended or becomes a SuperAdmin." Unchanged: "The operator gets no
   action on these applications." · "No other group of this travel agent becomes readable."
5. Fields: "Operator" `granteeAccountId` (select of the read's `operators`, placeholder "Choose an operator", no
   default; preselected only when `grantee` names one of them); "Named purpose" `purpose` (textarea; hint "Why the
   operator needs to read this group. 10 to 500 characters. Recorded."); "Last day of access" `validUntil` (date;
   `min` today, `max` today + maxDays − 1; default the end of tomorrow, as today, the shortest useful span; hint
   "Access ends at the end of this day, India Standard Time, at most [maxDays] days from now."); hidden `groupId`.
6. Review: "When you give it: [operator] can read [label] until the end of the day you chose. Your name, the purpose
   and the time are recorded."
7. Buttons "Give read access" (primary); "Cancel" → SA-06g.

| State (first match) | Copy |
|---|---|
| Audit behind | CMP-10 "Giving read access is unavailable until the audit record is healthy again. Revoking stays available. Owner: TravelMudra." No form |
| No operator | "No active operator with an authenticator exists. Read access can only be given to one." No form |
| C3 `granted` | 303 to SA-06h |
| C2 | §2.13; every typed value kept, `groupId` kept |

### 2.7 SA-06x Revoke a grant `/admin/grants/:grantId/revoke`

CMP-25 frame. Reads `iam.admin_grants`; the grant is the `active` row with this id.

1. Header: breadcrumb "Grants › [grant words]: [operator]"; `h1` "Revoke the [group read grant / accounting grant] of
   [operator]".
2. Scope: "This one grant: [kind words][ for group [reference]], held by [operator]. Purpose: [purpose]. Valid until
   [time] IST / until revoked."
3. Effect, changes: "Access ends at once: at the operator's next page, download or task run." · group read: "[operator]
   can no longer read group [reference]." · accounting: "[operator] no longer sees the Accounts area." Unchanged: "Other
   grants of [operator] stay." · "A revoked grant is not restored; give a new one if access is needed again."
4. Fields: "Reason for revoking" `reason` (required, 10–1,000); hidden `_rev.grant`.
5. Review: "When you revoke it: access ends now. Your name, your reason and the time are recorded."
6. Buttons "Revoke the grant" (destructive); "Cancel" → SA-06h. Available while the audit record is behind.

| State (first match) | Copy |
|---|---|
| Not active | the grant is in `ended` or in no list: "This grant already ended: [state words]." or "No active grant has this reference." Link SA-06h / SA-06g. No form |
| Time passed | active row with `valid_until` ≤ now: "Its time passed at [time] IST, so it gives no access now. TravelMudra records it as expired by itself." No form |
| C3 `revoked` | 303 to SA-06h |
| C2, C5 | §2.13, §2.15; the typed reason kept |

### 2.8 Support view (SH-R09): start, banner, landing, exit

- **Start** on SA-06c (§2.1 `support`). Success: 303 `/account` (unchanged). No receipt: the banner is read from the
  session on every page and states who, why and until when (D-W15-12). A refusal re-renders SA-06c.
- **Banner** (AM-W15-01): in the header after the environment label, before the top bar (WP-01 R2). Text of AM-W15-01;
  the role word from `viewedRole`; "Ends at [time] IST." from `expiresAt` (read, so it may be shown). Button "Exit
  support view" (`action="/admin/support-view/end"`, unchanged). The banner is also on the shell's error pages of a
  support view (existing).
- **Landing** `/account` in a support view: the viewed account's page, read-only (§2.9 row "Support view").
- **What a support view shows.** Exactly the viewed person's pages on the staff origin (TA pages for a travel agent;
  operator pages, the operator's read-only section included, for an operator), evaluated by Core as that person now.
  Every form except exit and sign-out is absent (DESIGN.md); a hand-made POST answers 404 before Core; an `/admin`
  page answers 409 with the AM-W15-01 copy and the banner.
- **Exit**: 303 to SA-06c of the viewed account with the receipt `support_view_ended` (§2.14). An exit whose view
  already ended (`stale_revision`) answers 303 `/admin/accounts` (unchanged).

### 2.9 Your account `/account` (TA-12a, OP-10a, SA-10a)

WP-01 §6 holds the page (`shared/pages/identity.ts:532-600`). WP-15 changes:

| Block | Travel agent (edge) | Operator, SuperAdmin (staff) | Support view (staff, read-only) |
|---|---|---|---|
| Header | `h1` "Your account"; lead "Who you are signed in as, your sessions and your sign-in address."; freshness | same | lead "Read-only view of [name]'s account, as they see it." |
| Who you are, Authenticator, Accounting grant, Sessions, Sign out, Sign out everywhere | WP-01, unchanged | WP-01, unchanged | WP-01: no sign-out forms for the viewed account |
| Sign-in address | Fact "Current address: [address]". Pending line when the opt. `iam.email_change_page` read shows an open change: callout info "Your sign-in and document email remain [current address] until both addresses are verified." with "Continue the change" → TA-12e. Read unavailable: "Whether an address change is open cannot be read now." Link "Change your email address" → TA-12e (registered, not read-only). CMP-10 "Changing your address without access to your current mailbox is unavailable until the product owner approves a recovery rule. Owner: product owner." (ref `parked_lost_mailbox_recovery`). "TravelMudra staff cannot change your address." | The WP-01 known-limitation notice only; the sentence "Ask a SuperAdmin if your work address changes." is removed (F-W15-08) | Travel agent: the fact and the boundary only; no link; `iam.email_change_page` is never read in a support view (its action is not readable there: an access refusal would reach the shell, LD-14) |

The page MUST NOT show a read marker or "Mark as read" (LD-06). The opt. read happens only when the actor is a
travel agent account (not a support view) and `/ta/account/email` is registered (edge).

### 2.10 TA-12e Change your email address `/ta/account/email`

Purpose: change the sign-in and document address with two proofs (UX §4.2 Account, §4.4; B09).

1. Header: breadcrumb "Your account"; `h1` "Change your email address"; lead "Your sign-in address and the address
   that receives your documents change together, only after you prove both mailboxes."; freshness.
2. Receipt (§2.14): `started`, `current_verified`, `cancelled`.
3. Pending line (open change): callout info "Your sign-in and document email remain [current address] until both
   addresses are verified." (UX §4.4, exact).
4. Status facts: "Current address" [address]; open change: "New address" [new], "Ends" [time] IST.
5. Steps (`stepper`, states in text): "New address" · "Code from your current address" · "Code from your new address".
6. Form, first match:

| State | Condition | Content |
|---|---|---|
| a | no open change | Form "Start an address change" (action `/ta/account/email`): "New email address" `newEmail` (`type=email`, `autocomplete=email`, hint "We first send a code to your current address. Only after you enter it do we send a code to the new address."); hidden `_rev.account`; button "Send a code to my current address" |
| b | open change from another session (`started_session_id` ≠ this session) | Callout info "This address change was started in another browser, or before you signed in again. Finish it there. You can also cancel it here and start again." No confirm form |
| c | `started`, this session | Line "We are sending an 8-digit code to your current address, [current]. Mail: [§2.12.5 words]."; form (action `/ta/account/email/confirm`): "Code sent to your current address" `code` (`inputmode=numeric`, `autocomplete=one-time-code`, mono, hint "8 digits. Spaces are ignored."); hidden `emailChangeId`, `proof=current`, `_rev.email_change`; button "Confirm and send a code to my new address" |
| d | `current_verified`, this session | Line "We are sending an 8-digit code to your new address, [new]. Mail: [words]."; review "When you confirm: your sign-in and document address become [new]. Every session of your account ends, this one too. You sign in again with [new]."; field "Code sent to your new address"; hidden `proof=new`; button "Confirm and change my address" |

7. Cancel form (open change, any session; action `/ta/account/email/cancel`): hidden `emailChangeId`,
   `_rev.email_change`; review "Cancelling keeps [current] as your address."; button "Cancel the address change"
   (quiet).
8. Section "What happens next": "The change finishes only after both codes are confirmed, before it ends (the time
   shows once it starts)." · "When it finishes, every session of your account ends, this one too. Sign in again with
   the new address." · "TravelMudra staff cannot change your address for you." (no "30 minutes", F-W15-06).
9. CMP-10 lost-mailbox boundary (as §2.9).

Results of `iam.confirm_email_change` (accepted answers that are not a success re-render TA-12e at the POST address,
status 422, with the error summary; the code field is empty):

| Result | Copy |
|---|---|
| `current_verified` | 303 receipt "Current address confirmed" |
| `completed` | Cookie cleared; 303 `/sign-in?email_changed=1` (WP-01: "Sign in with your new email address.") |
| `invalid`, `ended` null; or refusal `otp_invalid_or_expired` | Field `code`: "This code did not work. Enter the newest code we sent to [the address of this step]. If no code works, cancel the change and start again." (combined: Core does not say which case; F-W15-09) |
| `invalid`, `ended = expired` | Callout failure "The address change ended: it expired before both codes were confirmed. Your address did not change. Start again if you still want to change it." (the start form shows below) |
| `invalid`, `ended = attempts_exhausted` | "The address change ended after too many wrong codes. Your address did not change. Start again if you still want to change it." |
| `invalid_address` | "The new address cannot be used. The change ended and your address did not change. Start again with another address." |

| State | Copy |
|---|---|
| C2 start | §2.13; the typed address kept |
| C5 | §2.15 (no code kept) |
| UNR | 303 `/ta/operations/<key>`; for a confirm that completed, the next request finds the session ended and goes to sign-in (WP-01) |
| Support view | Not reachable (edge only; staff answers 404, `ported-pages.test.ts:196`) |

### 2.11 OP-10 and SA-10 notices: OP-10n, SA-10n `/{ops,admin}/notices` and OP-10i, SA-10i `/{ops,admin}/notices/:noticeId`

Built with WP-08's TA-10 and TA-10n renderers (AM-W15-03) and the staff words of §2.12.4.

List anatomy: `h1` "Notices"; lead "Notices from TravelMudra about your work. Opening a notice changes nothing. A notice
that needs a decision from you asks for your acknowledgement."; freshness; count line "Needs your acknowledgement: [n]
notices"; view filter `view` = `needs_ack` / all (no read filter, LD-06); `noticeItem` rows (notice text → the notice
page; "Application [reference]" as `identifier`, linked to OP-02 `/ops/applications/:id` or SA-04a
`/admin/applications/:id` when registered, no link for `reassigned_away`; posted time; acknowledgement words); cap line
at 500 rows "This list shows the newest 500 notices."

Notice page anatomy: breadcrumb "Notices"; `h1` the notice text; receipt `acknowledged`; body — `disclosure_correction`:
WP-08's `disclosureBody` with AM-W14-02; `reassigned_away`: "Application [reference] was reassigned to another
operator. You no longer work on it, so it does not open for you."; `deferral_review_due`: "The deferral of this
application is due for review on [date]."; other events: the event sentence; facts: Posted [time] IST; Application
(link as the list); Delivery (link only for `result_available` and `disclosure_correction`); Acknowledgement (three
WP-08 texts); form (`ackRequired` and not acknowledged, outside a support view): hidden `_rev.notice`; review
"Acknowledging records that you read this notice[ and deleted the file]. It changes nothing else."; button
"Acknowledge" or, for a deletion request, "I deleted it: acknowledge".

| State | Copy |
|---|---|
| S2 | "No notices yet. Notices about your work appear here." |
| S3 (`needs_ack`, none) | "No notice needs your acknowledgement." + "Show all notices" |
| C3 | Receipt "Notice acknowledged"; Current acknowledgement |
| C2 `ack_not_required` / `already_acknowledged` | WP-08 sentences |
| C5 | §2.15 |

### 2.12 Closed word tables (`accounts/words.ts`, `notices/pages.ts`)

#### 2.12.1 Elevations

| Value | Words |
|---|---|
| kind `create_superadmin` | "New SuperAdmin account" |
| kind `elevate_operator` | "Operator to SuperAdmin" |
| kind `restore_superadmin` | "Restore a suspended SuperAdmin" |
| state `requested` | "Waiting for a second SuperAdmin" |
| state `approved` | "Approved by [name]" |
| state `declined` | "Declined by [name]" |
| state `withdrawn` | "Withdrawn by the requester" |
| state `expired` | "Expired" |
| unknown | "[code]" with "Reference code" |

#### 2.12.2 Grants

| Value | Words |
|---|---|
| kind `group_read` | "Group read" (title "Group read grant") |
| kind `accounting` | "Accounting" (title "Accounting grant") |
| state `active`, time not passed | "Active" |
| state `active`, `valid_until` ≤ now | "Active in the record, but its time passed at [time] IST: no access now" |
| state `revoked` | "Revoked on [time] IST" |
| state `expired` | "Expired on [time] IST" |

#### 2.12.3 Grant end reasons

| Value | Words |
|---|---|
| `revoked` | "Revoked by a SuperAdmin" |
| `expired` | "Its time passed" |
| `grantee_suspended` | "Ended: the operator was suspended" |
| `grantee_elevated` | "Ended: the operator became a SuperAdmin" |
| unknown | "Ended ([code])" |

#### 2.12.4 Staff notice words (kind, or `generic_case_update` event)

| Value | Text | Application link |
|---|---|---|
| `assigned` | "An application was assigned to you" | yes |
| `reassigned_away` | "An application was reassigned to another operator" | no |
| `assistance_approved` | "A SuperAdmin approved help on an application" | yes |
| `gate_exception_granted` | "A SuperAdmin recorded a gate exception on an application" (+ " for [gate words]" when `gate` is known: Gate 1 service payment, Gate 2 government fee, readiness) | yes |
| `superadmin_correction` | "A SuperAdmin corrected an application from evidence" | yes |
| `problem_reported` | "The travel agent reported a problem on an application" | yes |
| `handed_back` | "The travel agent handed an application back to you" | yes |
| `flag_responded` | "A SuperAdmin answered your flag" | yes |
| `problem_resolved`, `deferral_ended`, `withdrawn`, `submitted`, `transition_pending`, `packet_available` | as today's `EVENT_TEXT` (`delivery/pages.ts:189-195`) | yes |
| `deferral_review_due` | "A deferral is due for review on [date]" | yes |
| kind `financial_follow_up` | "A payment follow-up needs your attention" (link to the follow-up item when its page is registered) | — |
| kind `disclosure_correction` | WP-08 variant texts | yes |
| unknown event or kind | "A notice about your work" | yes |

#### 2.12.5 Mail state words (TA-12e)

| Value | Words |
|---|---|
| `queued`, `none`, null | "Being sent" |
| `accepted` | "Handed to the mail service. This does not show that it reached your inbox." |
| `synthetic_accepted` | "Stored in the test mailbox. No real email was sent." |
| `failed` | "Could not be sent. Cancel the change and start again." |
| `uncertain` | "Sending may have failed. If no email arrives, cancel the change and start again." |

### 2.13 Refusal sentences (closed table)

Category plus code selects the sentence; `fieldErrors` select by field. Existing `MESSAGES` (`pages/identity.ts:53-85`)
and `ACCOUNT_MESSAGES` (`accounts/pages.ts:87-96`) stay unless listed. "Nothing was …" appears only after a refusal
(a refusal is proven: Core did not record the command).

| Form | Category / code (field) | Sentence | Where |
|---|---|---|---|
| request elevation | `control_blocked` / `elevation_target_has_duties` | "[name] still holds duties. Hand them over first, then request again. Nothing was requested." + "Open duties and hand-off" | form-level |
| request elevation | `conflict_duplicate` / `elevation_open` | "An elevation request for [name] is already open. Nothing new was requested." + link to its SA-09s from the re-read | form-level |
| request elevation, approve | `control_blocked` / `second_superadmin_required` | request: "You cannot request this for your own account." approve: "You requested this, or it is about your own account. A second, different SuperAdmin approves it. Nothing was approved." | form-level |
| approve | `control_blocked` / `elevation_requester_inactive` | "The SuperAdmin who requested this is no longer active, so it cannot be approved. Decline it; a new request is needed. Nothing was approved." | form-level |
| approve | `control_blocked` / `elevation_target_has_duties` | "[target] holds duties now. Approving is refused until they are handed over. Nothing was approved." | form-level |
| every privileged form | `unavailable_dependency` / `audit_degraded` | "The audit record is behind, so this is unavailable now. Nothing was recorded. Declining, suspending and revoking still work." | form-level |
| grant create, support view | `unavailable_dependency` / `clock_degraded` | "The server clock disagrees with the database, so time-limited access cannot start now. Nothing was recorded. Try again later. Owner: TravelMudra." | form-level |
| reset | `validation_failed` / `self_action_not_allowed` | "You cannot reset your own second factor. Ask another SuperAdmin." | form-level |
| reset (hand-made, travel agent) | `unavailable_parked` / `parked_lost_mailbox_recovery` | "A travel agent has no second factor: sign-in uses their own address. Signing in without that mailbox is unavailable until the product owner approves a recovery rule. Owner: product owner. Nothing changed." | refusal callout |
| grant create | `validation_failed` / `grantee_not_operator` (`granteeAccountId`) | "Choose an active operator who has set up an authenticator." | `granteeAccountId` |
| accounting | `validation_failed` / `grantee_not_operator` | "Only an active operator can hold the accounting grant. Nothing was given." (the accounting grant has no authenticator rule) | form-level |
| accounting | `conflict_duplicate` / `grant_exists` | "[name] already holds the accounting grant. Nothing new was given." + link SA-06h (re-read) | form-level |
| grant create | `conflict_duplicate` / `grant_exists` (`existing`) | "This operator already holds read access to this group. Nothing new was given." + "Open the grant" (SA-06h of `existing`) | form-level |
| grant create | `control_blocked` / `grant_limit_reached` | "This operator already holds the most active read grants allowed ([max]). Revoke one first, or choose another operator." | `granteeAccountId` |
| grant create | `validation_failed` / `grant_duration_exceeded`, `date_invalid` (`validUntil`) | "Choose a last day from today up to [maxDays] days from now." / "Enter the last day as a date." | `validUntil` |
| support view | `validation_failed` / `support_view_target_not_eligible` | "Only travel agent and operator accounts can be viewed, and not your own." | form-level |
| support view | `conflict_duplicate` / `support_view_active` | "A read-only view is already open in this session. Exit it first." | form-level |
| every reason or purpose field | `validation_failed` (`reason`, `purpose`: any code) | "Give a reason of 10 to 1,000 characters." (support view, accounting, purpose: "10 to 500 characters") | the field |
| revoke | `stale_revision` | CMP-14 (§2.15) | — |
| TA start | `validation_failed` / `email_invalid` (`newEmail`) | "Enter an email address in the form name@example.com." | `newEmail` |
| TA start | `validation_failed` / `email_unchanged` | "The new address is the same as your current address." | `newEmail` |
| TA start | `validation_failed` / `synthetic_email_refused` | existing sentence | `newEmail` |
| TA start | `conflict_duplicate` / `email_change_open` | "An address change is already open. Finish or cancel it first. If it ended by its time, TravelMudra closes it soon; then start again." (STOP-W15-01) | form-level |
| TA start, confirm | `rate_limited` | start: "Too many address changes were started in a short time. Try again later." confirm: "Too many codes were tried in a short time. Wait, then try again." | form-level |
| TA cancel | `stale_revision` | "This address change already ended: it finished, was cancelled or ended by its time." (the re-read shows the state) | form-level |
| notice acknowledge | WP-08 codes | WP-08 sentences | form-level |
| every form | `conflict_operation_key` | "This form was already used with different content. Your values are kept: check them and send again." (TA-12e confirm: "… Enter the code again.") | form-level |
| every form | `not_found_or_forbidden`, `unauthenticated`, `maintenance`, other `unavailable_dependency` | Shell (§2.0) | — |
| every form | unknown code | Category text + "Reference code: [code]" | form-level |

### 2.14 Receipt facts per command (CMP-08)

"Establishes by" says how the page knows which command produced the record before P-10 (b). No receipt shows an
accepted time or a command name (P-02, P-10 b pending; S-08).

| Done | Host | Expected resource | Summary test | Establishes by | Title | Recorded facts | Current facts |
|---|---|---|---|---|---|---|---|
| `elevation_requested` | SA-06c | `account`, path id | `result = requested`, `elevationId` matches `^elv_` | only `iam.request_elevation` answers `requested` | Elevation requested | "Request [reference]" | When `openElevation.elevation_id` equals the returned id: "Waiting for a second, different SuperAdmin. Ends [time] IST." with the AM-W15-06 link; else "This request is no longer open." |
| `credentials_reset` | SA-06c | `account`, path id | `result = credentials_reset` | unique | Second factor reset | "Every session of the account ended and its authenticator was removed." | Authenticator; Enrolment (state, §2.12.5-style mail words, ends); Open sessions |
| `support_view_ended` | SA-06c | `self`, no id | `result = ended` | the only `self` result `ended` on the SuperAdmin surface | Read-only view ended | — | — |
| `approved` | SA-09s | `installation`, no id | `result = approved`, `elevationId` = path id | unique | Request approved | From the `decided` row with that id: kind words, target, requested by, approved by | Target (opt. read): role, status |
| `expired` | SA-09s | as above | `result = expired`, `elevationId` = path id | unique | Request recorded as expired | "Nothing changed for [target]." | — |
| `declined` | SA-09s | as above | `result = declined`, id = path | unique | Request declined | decided row | create: target status (Declined) |
| `withdrawn` | SA-09s | as above | `result = withdrawn`, id = path | unique | Request withdrawn | decided row | — |
| `granted` | SA-06h | `grant`, path id | `result = created`, `grantId` = path id, and the page's row with that id has kind `group_read` | the summary is shared with the accounting grant; the kind tells them apart | Read access given | Operator, group, purpose, valid until (the row) | State |
| `accounting_granted` | SA-06h | `grant`, path id | as above with kind `accounting` | as above | Accounting grant given | Operator | State |
| `revoked` | SA-06h | `grant`, path id | `result = revoked` | unique | Grant revoked | "Access ended at once." | State |
| `started` | TA-12e | `self`, no id | `result = started`, `emailChangeId` matches `^emc_` | the travel agent surface has no other `started` | Address change started | — | When the open change has that id: the current-step mail words and "Ends [time] IST"; else "This change is no longer open." |
| `current_verified` | TA-12e | as above | `result = current_verified`, `emailChangeId` matches | unique | Current address confirmed | — | as above (new-address step) |
| `cancelled` | TA-12e | as above | `result = cancelled`, `emailChangeId` matches | unique | Address change cancelled | "Your address did not change." | Current address |
| `acknowledged` | OP-10i, SA-10i | `notice`, path id | `noticeId` = path id | WP-08 | Notice acknowledged | — | Acknowledgement |

The SA-06h summary test MUST look the grant up in the page's own read (active and ended) and fail when it is absent
(WP-07 §2.11 rule for list-selected records). The receipt facts never come from the address alone: every `?done=`
flash of today (`identity.ts:91-105`, `accounts/pages.ts:449-454`, `edge/account.ts:124-126`) goes.

### 2.15 Stale revision (CMP-14) per form

| Form | Guard | Rows (yours / current) |
|---|---|---|
| Request elevation, reset (SA-06c) | `_rev.account` | Status (not in your form / current); Open elevation request; Authenticator. The typed reason stays when the form still applies |
| Accounting grant, support view (SA-06c) | none at Core | Not CMP-14 |
| Approve, decline (SA-09s) | `_rev.elevation` | Request state (you saw "Waiting for a second SuperAdmin" / now §2.12.1 words with name and time); the typed reason stays in the unsent text block |
| Revoke (SA-06x) | `_rev.grant` | Grant state (you saw "Active" / now §2.12.2); the typed reason stays |
| Grant create (SA-06n) | none | Not CMP-14 |
| TA start | `_rev.account` | "Your account changed after you opened this page." The typed address stays |
| TA confirm, cancel | `_rev.email_change` | Step (you saw "[step]" / now "[step]" or "Ended"). No code is kept |
| Acknowledge (OP-10i, SA-10i) | `_rev.notice` | Acknowledgement (you saw "Needs your acknowledgement" / now "Acknowledged [time] IST") |

"Who changed it and when" rows are absent unless the read carries them (SA-09s decided rows do), never "unknown".

### 2.16 Input parsing in the handlers (LD-17)

Every field is read whole. Input over a limit is refused at its field with every value kept; the command is not sent.
The lower bounds stay with Core (one source) and map to §2.13.

| Field | Rule | BFF refusal (field) |
|---|---|---|
| `reason` (request, approve, decline, reset, revoke) | over 1,000 characters after trim → refused | "Shorten the reason to 1,000 characters or fewer." |
| `reason` (accounting, support view), `purpose` | over 500 after trim → refused | "Shorten it to 500 characters or fewer." |
| `accountId` (support view) | `zWireId('acc')`, whole | uniform 404 (as today `identity.ts:537`; never a cut id) |
| `granteeAccountId` | `zWireId('acc')`, whole | "Choose an operator." |
| `groupId` | trim; `zWireId('grp')`, whole | form-level "Choose the group again." (a forged hidden value) |
| `validUntil` | `^\d{4}-\d{2}-\d{2}$`, whole; the BFF forms the instant at the end of that IST day (as today `identity.ts:249-251`) | "Enter the last day as a date." |
| `newEmail` | over 320 characters → refused; otherwise sent as typed (Core normalizes) | "Enter an address of up to 320 characters." |
| `code` | over 32 characters → refused; never echoed | "Enter the 8-digit code." |
| `emailChangeId` | `zWireId('emc')` | form-level "This form no longer fits the page. Open the page again." (no command) |
| `proof` | `current` or `new` | as above |
| `group`, `grantee` (SA-06n query) | `zWireId` | step 1 field error / ignored |

Current code that this replaces: `typedProblem` slices the reason to 4,000 (`identity.ts:162`); the grant handler
slices four fields (`:506-509`); the support-view handler slices the account id to 64 (`:534`); the TA handlers slice
`newEmail` to 320 (`account.ts:134`), the confirm fields to 64, 16 and 32 (`:147`) and the cancel id to 64 (`:175`).

## 3. Interim and switch for the pending Core facts

| Fact | Interim (now) | Switch |
|---|---|---|
| Command identity and accepted time (P-02, P-10 b, S-08) | Titles from unique summary keys (§2.14); no time | Command name and accepted time in every receipt |
| One elevation read (STOP-W15-02) | SA-09s finds the request in the open list or the 50 most recent decided; older ones read "not listed" | The decision page shows any request's decision |
| Grant row `ended_by` (STOP-W15-06) | "Revoked on [time] IST" without a name; the audit history names it | "Revoked by [name] on [time] IST" |
| Applicant names on staff notices (STOP-W15-07) | "Application [reference]" | Applicant and service |
| Expired email change still open (STOP-W15-01) | §2.13 `email_change_open` sentence | Core ends an expired change at start; the sentence's second half goes |
| Accounts area in an operator support view (STOP-W15-03) | The SA-06c consequence line says it is not shown | The support view shows it |

## 4. Hostile-state analysis (prompt rule 8)

"Today" states whether the code at 34e875b already behaves as required. "Residue" is what a failure leaves.

### 4.1 The Nth identical submission and its variants

| Form | Variant | Required behaviour | Residue | Today |
|---|---|---|---|---|
| Any | Same `_op` (double click, browser resend) | K-STD replay: the same 303 and receipt; one effect. A replay resolves before the audit check, so it works while the audit record is behind | None | Yes (receipt new) |
| Approve elevation | Second approval by the same SuperAdmin from a stale tab (new `_op`, old `_rev.elevation`) | `stale_revision` → CMP-14 "Approved by [you] on [time] IST" with the reason in the unsent block; one approval | None | Partly (list page, reason lost) |
| Approve elevation | Two SuperAdmins approve at once | One wins; the other gets `stale_revision` → "Another SuperAdmin decided this request first: [words]." | None | Partly |
| Approve elevation | Decline in one tab, approve in another | The second gets `stale_revision`; the request stays declined | None | Partly |
| Approve elevation | The requester approves their own request (hand-made POST; the page has no form and no token for it, so the POST fails CSRF; with a valid token from a test client Core refuses `second_superadmin_required`) | No change; §2.13 | None | Yes (Core) |
| Request elevation | Second request, new `_op` (two tabs) | `conflict_duplicate`/`elevation_open` → §2.13 with the link to the open one | None | Partly (generic) |
| Reset | Second reset from a stale tab | `_rev.account` changed with the first reset → CMP-14; from a fresh page a second reset is a new, legitimate reset (new enrolment code; the first code stops working) and the effect text says so | One more enrolment code | Partly |
| Accounting grant | Second give, new `_op` | `grant_exists` → §2.13 with the grant link | None | Partly |
| Grant create | Second create for the same operator and group | `grant_exists` with `existing` → link to SA-06h | None | Partly (generic) |
| Revoke | Second revoke | `stale_revision` → "This grant already ended: Revoked on [time] IST." | None | Partly (reason lost) |
| Support view start | Second start from another tab while the first is open | The BFF answers 409 with the AM-W15-01 copy (the session is already in a support view; Core is not called); a same-`_op` resend also meets the 409 page | None | Yes (copy new) |
| TA start | Second start, new `_op` | `email_change_open` → §2.13 | None | Partly |
| TA confirm | Same code twice from two tabs | Second: `_rev.email_change` changed → CMP-14; after completion the session has ended → sign-in | None | Partly |
| TA cancel | Cancel twice | `stale_revision` → §2.13 | None | Partly (message on the code field) |
| Acknowledge | Twice | `already_acknowledged` or CMP-14 | None | Partly |

### 4.2 What a failure leaves on the page

| Failure | Page after it | Kept | Lost (stated) |
|---|---|---|---|
| Refused form (C1, C2, C5) | Same host page at the POST address, CMP-07 focused | Every typed value and choice, never a code | — |
| A form that no longer applies (request decided, grant ended, change ended) | The new state; the WP-09 unsent text block with the typed reason | Typed text, read only | The form |
| Access lost (suspended, session revoked by a reset, an elevation or an email change; support view ended) | Shell SH-02 or sign-in (LD-14) | — | Typed values (B10) |
| Core unreachable before a command | SH-02 "TravelMudra is unavailable now" | — | The form |
| Answer lost | Operation page (CMP-13); "Check status" reads the same key | — | No new submission offered |
| Maintenance | The status document, 503 (A-09) | — | The form; nothing replayed after reopening |

### 4.3 The named hostile states

| Situation | Required behaviour | Today |
|---|---|---|
| **Nth identical elevation decision** | §4.1 rows: one decision; the later reader sees the decision, its name and time; never a second form | Partly |
| **The same SuperAdmin approving their own request** | No approve form for the requester (state 4) or the target; "Withdraw your request" instead; Core refuses a hand-made POST; an expired own request is recorded as expired, not approved (Core's order, `elevation.ts:86-91`) | Yes (text only) |
| **Only one active SuperAdmin** | SA-09s state 4 adds "nobody can approve it before it ends"; SA-06a shows the WP-02 warning and the recovery boundary; no bypass control anywhere | Partly |
| **Email change confirmed from a stale link or another browser** | Another browser: no confirm form (state b); a hand-made confirm → Core `not_found_or_forbidden` → shell 404, nothing recorded. A stale tab of the same session: CMP-14 with the current step. A code from an earlier, cancelled change → "This code did not work…" (attempt counted). An old receipt address after the change ended → the receipt's current facts say "This change is no longer open." After completion, any old page → sign-in | Partly |
| **Grant revoked while the reader has the page open** | Grantee operator on a group application: the next read → uniform 404 (LD-14); a poll region conceals and reloads (A-01); a download → refused, no bytes. A SuperAdmin on SA-06x while another revokes: `stale_revision` → "already ended". A support view of the grantee: the next read → 404 with the banner; `/ops/applications` drops the group | Yes (Core); words new |
| **Support view started twice** | §4.1 row; the 409 page states that nothing from that page was recorded | Partly (copy) |
| **Credentials reset during an open session** | The target's next request goes to sign-in (sessions revoked); the target cannot complete a staff sign-in until it enrols with the new code (WP-01 pages); a target in the middle of a SA-09s or SA-06x submission loses the typed reason (B10). The resetting SuperAdmin cannot reset their own factor (no control; Core refuses) | Yes |
| **Access revoked mid-page** | A SuperAdmin suspended mid-decision: next POST `unauthenticated` → sign-in; their open support views end (`superadmin_suspended`); an operator elevated mid-page: next request → sign-in, then the SuperAdmin surface; a travel agent suspended mid-change: the change is abandoned and the next request → sign-in | Yes |
| **Viewed account suspended during a support view** | Next read → uniform 404 with the banner (Core reads nothing for a non-active viewed account); "Exit support view" works | Yes |
| **Support view reaches its end time** | The session resolves to the SuperAdmin's own session; a viewed page → uniform 404 without banner (no TA or operator surface). P2: the 404 page cannot say why (uniform by design) | Yes |
| **SuperAdmin page posted from another tab while a support view is open** | 409 with the AM-W15-01 copy "Nothing you sent from this page was recorded" (true: the BFF refused before Core) | Partly (copy) |
| **Expired but not closed requests and changes** | SA-09s state 3 (no form); SA-06c shows the open request with "Expired at…"; TA-12e start refused `email_change_open` with the STOP-W15-01 sentence | Partly |
| **Group reference of another travel agent** | SA-06n shows the group's label, dates and size before the form; the hidden `groupId` is the shown group; a typed reference never reaches the command without being shown | No (typed field, F-W15-04) |
| **Grant whose time passed but still `active`** | Lists and SA-06h say it gives no access; no revoke form | No |

### 4.4 Access and accounts changing mid-task

| Change | Effect on WP-15 pages |
|---|---|
| Elevation approved for an operator holding a read grant | The grant ends `grantee_elevated`; SA-06h reads "Ended: the operator became a SuperAdmin" |
| Operator suspended | Grants end `grantee_suspended`; open elevation request of the operator declined by Core (`accounts.ts:222`); SA-09s → state 2 |
| Requester suspended while a request is open | SA-09s approve → state 6 (when the requester read works) or Core's refusal |
| Target operator assigned work after the request | SA-09s state 7 or Core's `elevation_target_has_duties` |
| TA email change completed | The TA's other browsers → sign-in with the generic session-ended notice (WP-01, `sign-in-states.test.ts`); SA-06c shows the new address and the history line |

### 4.5 Counts, caps and long lists (200 grants)

| Situation | Required behaviour |
|---|---|
| 200 active grants | SA-06g: pages of 50 (`page` in the address), kind filter in the address, count "[n] active grants"; one Core read per page view; 200 rows are 4 pages, never 200 forms on one page (today 200 revoke disclosures) |
| 2000 active grants (contract cap) | "2000 or more"; the 2001st makes the read fail for every SuperAdmin (STOP-W15-05, P2) |
| 50 ended grants, 50 decided requests | Cap lines |
| One operator's grants | Bounded by `groupReadMaxActive` plus one accounting grant: SA-06c table is short |
| 500 notices | Cap line (WP-08 rule) |
| 2000 operators in the SA-06n select | A native select with type-ahead; the `grantee` context preselects |
| A long purpose or reason (500 or 1,000 characters) | Shown whole, wrapping; never cut on a page |

### 4.6 Device and environment

JavaScript off: every page works (plain forms; filters and SA-06n step 1 are GET forms; disclosures are `details`).
320 px and 400 % zoom: one column, no two-dimensional scroll (AC-04). Keyboard: radios, selects, buttons and links in
reading order; the error summary takes focus after a refusal (AC-08). The TA-12e code field uses
`autocomplete=one-time-code`; a password manager or a mail app may fill it; the page never stores it.

## 5. Accessibility notes specific to WP-15

- One `h1` per page; decision and task parts are `h2` (AC-03).
- The banner's title is text, not colour; its button names its effect ("Exit support view") and is reachable in the
  header before the rail (WP-01 R15 order).
- Several actions on SA-06c: each disclosure summary and button names its effect and the person ("Reset [name]'s
  second factor"), so controls are distinguishable out of context (WCAG 2.4.6).
- Status words (elevation, grant, acknowledgement, mail state) are text with an icon, never colour only (AC-06).
- The code field has a visible label naming the mailbox ("Code sent to your current address"); errors never repeat
  the code.
- Receipts are announced politely without moving focus (AC-09).

## 6. Proofs V21 and V22 on `lane-ui`

### 6.1 What `lane-ui` holds (facts and inference)

- Installation `lane-ui` (edge http://127.0.0.1:4650, staff http://127.0.0.1:4652; config
  `~/.local/share/travelmudra-uat/configs/lane-ui.json`, source = this lane's clone). At the WP-15 proof it holds the
  integrated WP-01 to WP-14 pages (package order; inference). Synthetic data only.
- Accounts: syn-superadmin-1 (SA1), syn-superadmin-2 (SA2), syn-ta-1 with groups and applications from earlier
  proofs (inference). Sign-in through the LD-11 harness; codes and keys never printed, logged, screenshotted or stored.
  Screenshots of pages are allowed (no page shows a code). axe at 1440 px and 390 px.
- The audit projection cannot be made unhealthy on `lane-ui`, and the support-view expiry cannot be advanced
  (P-03 parked): those steps are tests.
- A fresh staff account must set up an authenticator before an elevation request or a group read grant can name it.
  The harness signs in seeded staff with the seed's keys; a fresh account needs the U7 harness extension (`enrol`,
  which keeps the key in process memory only for that run) and, for the email change, `enterMailedCode` (types the
  newest code from the synthetic mailbox into the page and never returns it). Without U7 (Q-W15-06) the steps marked
  "L (U7)" run as tests.

### 6.2 Setup (synthetic writes, labelled as setup; Q-W15-05)

Run tag `wp15-[yyyymmddhhmm]`. As SA1 on SA-06b and SA-06c: operator OPe `wp15-ope-[stamp]@synthetic.test` and
operator OPg `wp15-opg-[stamp]@synthetic.test` (create, approve, activate; U7 enrols both); travel agent TAx
`wp15-ta-[stamp]@synthetic.test` (create, approve, activate). G1 = a group of syn-ta-1 with at least one application
and, if an earlier package released one, a result file. Seeded accounts are not changed; the support views of syn-ta-1
record only their start and end facts.

### 6.3 V21

V21 (UX §12): "One SA can suspend in emergency/lower exposure; distinct second SA is required for ordinary SA
elevation/ceiling increase. TA email has no admin override" (B09, B11, B28).

| Step | Actor, page | Action | Observable result | Where |
|---|---|---|---|---|
| V21-1 | SA1, SA-06c of OPe | Read "Access and support"; open "Request that … becomes a SuperAdmin"; reason; send | Duties line "Duties now: none."; effect text; receipt "Elevation requested" with "Waiting for a second, different SuperAdmin. Ends [time] IST."; no approve control on SA-06c | L (U7) |
| V21-2 | SA1, SA-06e; SA-09s approve | Read; open the request | Row shows "Withdraw your request" and "A different SuperAdmin decides."; SA-09s state 4, no form, no submit button | L (U7) |
| V21-3 | Test | SA1's session sends `iam.approve_elevation` for its own request with a valid key | `control_blocked`/`second_superadmin_required`; the request stays `requested`; the target's role unchanged | T |
| V21-4 | SA2, SA-06e → SA-09s approve | Read the decision page; reason; approve | Scope, evidence (reason, OPe active operator, authenticator set up, duties none, requester active), effect, hard stops, review visible before the button; receipt "Request approved"; Current: OPe SuperAdmin | L (U7) |
| V21-5 | OPe (harness session opened before V21-4) | Reload a page; sign in again | Next request → sign-in (sessions ended); after sign-in the SuperAdmin home | L (U7) |
| V21-6 | SA2, harness | Resend V21-4 with the same `_op`; post again with a new `_op` and the old `_rev.elevation` | Same 303 and receipt; then 409 CMP-14 "Approved by [SA2] on [time] IST", reason in the unsent block; one `iam.elevation_approved` in OPe's history | L (U7) |
| V21-7 | SA1, SA-06c of OPe (now SuperAdmin) | Suspend with a reason, alone | Receipt "Account suspended"; no second SuperAdmin asked; OPe's next request → sign-in; OPe's sign-in gets the neutral answer | L (U7) |
| V21-8 | SA1, SA-06c of OPe; SA2, SA-09s decline | Request restoration; SA2 declines with a reason | Receipt "Restoration requested"; SA1 sees "Withdraw your request" only; SA2's receipt "Request declined"; OPe stays suspended | L (U7) |
| V21-9 | SA1, SA-06b; SA-06c of the new account; SA2, SA-09s | Create SuperAdmin `wp15-sa-[stamp]`; read; SA2 declines | SA-06c: no approve control, next action "A second, different SuperAdmin" with "Withdraw your request" for SA1; SA2's SA-09s decline effect names the account becoming Declined; receipt; account Declined | L |
| V21-10 | Test (pattern "core restarted with its audit projector failing", `ported-pages.test.ts:351-382`) | Request elevation; approve; decline; suspend; revoke a grant; give a grant | Request and approve refused `audit_degraded`, re-rendered with "Nothing was recorded", reason kept; SA-09s state 5; decline, suspend and revoke accepted; SA-06g primary action unavailable with the pinned words | T |
| V21-11 | SA1, SA2 on WP-07 pages (re-run of WP-07 V09 steps with its fresh-travel-agent recipe) | SA1 lowers a ceiling alone (SA-07l); SA1 requests an increase (SA-07i); SA1 opens SA-09c; SA2 approves | Lowering accepted with one SuperAdmin; SA-09c shows SA1 no approve form; SA2's approval accepted. No WP-15 page involved | L |
| V21-12 | SA1, SA-06c of TAx; harness | Read "Sign-in address" and "Access and support"; collect every form on SA-06a/b/c/d, SA-06e/g/h/n/v, SA-09s; POST `/admin/accounts/<TAx>/email`; GET and POST `/ta/account/email` on staff | No address control and no reset for a travel agent; the only form with an `email` field is SA-06b's create form; the POST answers 404 (no route); staff `/ta/account/email` answers 404; nothing recorded | L |
| V21-13 | Test | A SuperAdmin session sends `iam.reset_credentials` and `iam.start_email_change` for TAx | Reset refused `unavailable_parked`/`parked_lost_mailbox_recovery`; start refused (not a travel agent actor); TAx unchanged | T |
| V21-14 | TAx on edge, TA-12a, TA-12e; harness | Read `/account`; start a change to `wp15-ta-[stamp]-new@synthetic.test`; enter the current-address code (U7); enter the new-address code (U7) | Receipt "Address change started"; pending line "Your sign-in and document email remain [old] until both addresses are verified." on TA-12e and `/account`; receipt "Current address confirmed"; then the sign-in page "Sign in with your new email address."; the new address signs in; `/account` shows it | L (U7) |
| V21-15 | SA1, SA-06c of TAx | Read | The new address; history "Email change completed" by TAx; no admin step in the history | L (U7) |
| V21-A | axe | SA-06c (operator, travel agent, pending SuperAdmin), SA-06e, SA-09s (draft, awaiting, unavailable by test fixture, decided, decline), TA-12a, TA-12e (states a, c, d, b), OP-10a, SA-10a | No violation at 1440 px and 390 px | L |

### 6.4 V22

V22 (UX §12): "Support view matches selected user's current read scope and offers no impersonation/action; revoked
old links/background results deny metadata/bytes" (B10–B12).

| Step | Actor, page | Action | Observable result | Where |
|---|---|---|---|---|
| V22-0 | SA2, SA-06n → SA-06h | Step 1 with G1's reference; step 2 shows G1; choose OPg, purpose, last day tomorrow; give | Step 2 shows G1's label, dates and application count before the form; receipt "Read access given" on SA-06h | L (U7) |
| V22-1 | SA1, SA-06c of syn-ta-1 | Open the read-only view with a reason | 303 `/account`; banner "Read-only view for SYN Travel Agent One", reason, "Ends at [time] IST.", "Exit support view"; the account page read-only, no sign-out forms | L |
| V22-2 | SA1 (support view) and syn-ta-1 (harness on edge) | Both read `/ta/groups`, `/ta/applications`, one application page, its delivery page, `/ta/notices`, `/ta/payments` | The sets of group ids and application ids are equal on both origins; every staff page has the banner; the only forms are exit and sign-out; no download control | L |
| V22-3 | Harness in the support view | POST a travel agent route (group create) and a download | 404 for both; no bytes | L |
| V22-4 | Test (`refusals.test.ts:284-321`) | Every staff route in a support view | Admin routes 409 with the exit form; other POSTs 404; SuperAdmin operation count unchanged ("nothing ran") | T |
| V22-5 | SA1, second tab | Open `/admin/accounts`; post SA-06c's start form from a tab opened earlier | 409 page with the AM-W15-01 copy and the banner; no second view | L |
| V22-6 | SA1 | Exit; then open an old travel agent page address on staff | SA-06c of syn-ta-1 with receipt "Read-only view ended"; the old address answers the uniform 404 without travel agent facts | L |
| V22-7 | SA1, SA-06c of OPg | Open the read-only view; read `/ops/applications` and one G1 application | The "Read-only access: [purpose], until [time] IST" line and G1's applications; the application page has no form | L (U7) |
| V22-8 | SA2, SA-06h → SA-06x; then SA1 (still in OPg's view) | Revoke OPg's grant with a reason; SA1 reloads the G1 application and `/ops/applications` | Receipt "Grant revoked"; SA1's reload → uniform 404 with the banner; `/ops/applications` no longer lists G1 | L (U7) |
| V22-9 | OPg (harness, own session, page opened before V22-8) | Reload the G1 application page; post its download form if a released file was offered | 404; the download refused with no bytes | L (U7) or T when G1 has no released file |
| V22-10 | Test | Background results after revocation: a poll region of a granted page answers 404; an old receipt address of the grantee | Conceal and reload (WP-01 A-01, `test/ui/results.test.ts`); `readReceipt` reaches the shell (R-04) | T |
| V22-11 | SA1, SA-06c of TAx (after V21-15); SA2 | SA1 opens TAx's read-only view; SA2 suspends TAx; SA1 reloads | Uniform 404 with the banner; "Exit support view" works | L |
| V22-12 | Test | Support view at its end time (clock); a SuperAdmin suspended during a view | Pages answer as the SuperAdmin's own session (404 on viewed paths); the view's end reason `expired` / `superadmin_suspended` | T |
| V22-13 | Test | Facts of a support view | Start and end facts name the SuperAdmin as actor with the reason; no fact names the viewed account as actor | T |
| V22-A | axe | Banner pages (TA home, application, `/ops/applications` in a view), the 409 page, SA-06g, SA-06h, SA-06n (steps 1 and 2), SA-06x, OP-10n, OP-10i, SA-10n, SA-10i | No violation at 1440 px and 390 px | L |

### 6.5 Proof split

V21 passes when V21-1, -2, -4 to -9, -11, -12, -14, -15 pass on `lane-ui` and V21-3, -10, -13 pass as tests. V22
passes when V22-0 to -3, -5 to -9 and -11 pass on `lane-ui` and V22-4, -10, -12, -13 pass as tests. Without U7, the
"L (U7)" steps run as tests and the record says so. Boundaries stated, not crossed: first-admin and all-admin-loss
recovery, lost-mailbox recovery, staff address change, travel agent eligibility (B-01, B-02; BS B44). OP-10 and SA-10
(CC-03) are acceptance items of the PM checklist, not part of V21 or V22: an assignment notice on OP-10n links OP-02;
`reassigned_away` has no link; acknowledgement on OP-10i and SA-10i gives a receipt.

## 7. Implementation breakdown

### 7.1 Work units (disjoint files)

Phase A: U0. Phase B: U1 to U5 in parallel (U5 after WP-08 is integrated). Phase C: U6 (wiring, shell, removal), then
U7 (proof harness, separable). The architect registers gallery modules in `scripts/dev/gallery-pages.ts` and edits
`DESIGN.md` once at the end (banner words; elevation decisions on SA-09s; grants and their receipts; "no admin
override" test).

| Unit | Files (change or add) | Tests (add or update) | Gallery |
|---|---|---|---|
| **U0 Identity words** | New `src/apps/staff/accounts/words.ts` (§2.12.1 to §2.12.3; staff sentences of §2.13; receipt titles) | New `test/unit/web/identity-words.test.ts` (every value of `ELEVATION_KINDS`, `ELEVATION_STATES`, `GRANT_KINDS`, `GRANT_STATES`, `GRANT_END_REASONS` and every identity reason code of §2.13 has words; unknown values fall back with the code; no word contains "Override", "Impersonate", "Sign in as") | — |
| **U1 Account access (SA-06c in place)** | `src/apps/staff/accounts/pages.ts` (access actions of §2.1, duties gating, receipts, AM-W15-06 links, grants section; `CARRIED_ACCOUNT_FORMS`, `CARRIED_DONE` removed); `src/apps/staff/identity.ts` (account and support-view handlers: §2.16, receipt locations of §1.5 rows 1, 4, 5, 8 and the exit; `audit_degraded` and `clock_degraded` re-render; then removal of the elevation and grant pages, routes and `DONE`, which U2 and U3 replace) | Update `test/unit/web/accounts-pages.test.ts` (`:112`, `:218`, `:292`, `:330`: links and receipts); update `test/unit/web/carried-forms-admin.test.ts` (the four account entries leave; WP-13 entries stay); new `test/unit/bff-account-access.test.ts` (each §2.16 refusal keeps the values and sends no command; a 1,001-character reason refused, never cut; a malformed support-view id answers 404; receipt locations; the parked reset refusal re-renders with the boundary sentence; same `_op` → same 303) | extend `scripts/dev/gallery/accounts.ts` |
| **U2 Elevations** | New `src/apps/staff/accounts/elevations.ts` (SA-06e, SA-09s renderers); new `src/apps/staff/accounts/elevation-routes.ts` (GET `admin.elevations.list` moved; new GET `admin.elevations.decide`; POST `admin.elevations.approve` and `.decline` moved with ids, paths, actions and commands unchanged; receipts; re-render SA-09s) | New `test/unit/web/elevation-pages.test.ts` (states first match; no approve form for the requester or the target; audit, requester-inactive, duties and target-changed states; expired request without a form; decided words; no "72 hours"; parity test §7.2 (e)); new `test/unit/bff-elevations.test.ts` (refusal re-renders SA-09s with the reason kept; stale → CMP-14; `not_found_or_forbidden` → shell; unknown `kind` → 404; receipt code by `summary.result`) | `scripts/dev/gallery/elevations.ts` |
| **U3 Grants** | New `src/apps/staff/accounts/grants.ts` (SA-06g, SA-06h, SA-06n, SA-06x renderers); new `src/apps/staff/accounts/grant-routes.ts` (GET `admin.grants.list` moved; new GETs `admin.grants.detail`, `admin.grants.new`, `admin.grants.revoke_form`; POST `admin.grants.create` and `admin.grants.revoke` moved with ids, paths, actions and commands unchanged; §2.16; receipts) | New `test/unit/web/grant-pages.test.ts` (paging 50; kind filter; time-passed words; the two SA-06n steps; the form only with the group read; hidden `groupId` equals the shown group; no revoke form for an ended or time-passed grant; kind check of the receipt); new `test/unit/bff-grants.test.ts` (refusals keep values; `grant_exists` links the existing grant; `not_found_or_forbidden` → shell; a malformed hidden `groupId` sends no command; `validUntil` sent as the end of the IST day) | `scripts/dev/gallery/grants.ts` |
| **U4 Account page and email change** | `src/apps/shared/pages/identity.ts` (`accountPage` only: §2.9); `src/apps/shared/identity-routes.ts` (`self.account` handler only: the opt. email-change read rule); `src/apps/edge/account.ts` (TA-12e: §2.10, §2.16, receipts) | New `test/unit/web/email-change-pages.test.ts` (states a to d; pending sentence exact; mail words; no lifetime number; no code re-rendered after any refusal; the combined code sentence); new `test/unit/bff-email-change.test.ts` (321-character address refused, never cut; 33-character code refused; malformed hidden fields send no command; result mapping of §2.10; `not_found_or_forbidden` → shell); update `test/unit/web/sign-in-pages.test.ts` (account page cases: address section by role; no email-change read in a support view) | `scripts/dev/gallery/account.ts` |
| **U5 Staff notices** | New `src/apps/staff/notices/pages.ts` (OP-10n, OP-10i, SA-10n, SA-10i over WP-08's renderers with §2.12.4 words); new `src/apps/staff/notices/routes.ts` (GET `ops.notices`, `ops.notices.one`, `admin.notices`, `admin.notices.one`; POST `ops.notices.acknowledge`, `admin.notices.acknowledge` moved with ids, paths and commands unchanged; receipts) | New `test/unit/web/staff-notices.test.ts` (every event of §2.12.4 has words; no link for `reassigned_away`; delivery link only for result and disclosure notices; no read marker; acknowledge form only when required and outside a support view; the deletion-request label) | `scripts/dev/gallery/staff-notices.ts` |
| **U6 Wiring, shell, removal** | `src/apps/staff/instance.ts` (register U2, U3, U5 routes); `src/web/route-inventory.ts` (four new GET rows; POST rows unchanged); `src/apps/staff/delivery/routes.ts` (notice routes removed); `src/apps/shared/delivery/routes.ts` (`noticeReadRoutes` and `acknowledge` removed when no consumer remains); `src/apps/shared/delivery/pages.ts` (old notice renderers removed when no consumer remains; LD-02); `src/web/pages/chrome.ts`, `src/web/pages/status.ts`, `src/web/ui/shell.ts` (AM-W15-01); `src/apps/shared/common-routes.ts` (`resultHrefOf`: `grant` → `/admin/grants/:grantId`, label "Grant") | `test/unit/web/routes.test.ts` (new GET rows; `/admin/grants/new` before `:grantId`); new `test/unit/web/identity-host-pages.test.ts` (§7.2); `test/unit/web/status-pages.test.ts:328` (the `grant` row); the tests of §7.3 | — |
| **U7 Proof harness (separable)** | `test/uat/signin-harness.ts` (`enrol(browser, inst, email)`: reads the enrolment mail and the set-up page in memory, keeps the key only in process memory for the run; `signIn` accepts run-created synthetic accounts: a travel agent by its mailbox, a staff account by the key `enrol` kept; `enterMailedCode(page, inst, email, fieldSelector, after)`: types the newest code sent to that address into the page; none returns, prints, logs or screenshots a code or key) | New `test/unit/signin-harness-rules.test.ts` (the module's exports return no string that matches a code or key pattern in a fixture run; the source calls no logger) | — |

U0 owns `words.ts`; U1 `accounts/pages.ts` and `identity.ts`; U2 the two elevation files; U3 the two grant files; U4
the three identity page files; U5 the two notice files; U6 the wiring and the files of other packages; U7 the harness.
No two units edit one file. Test file names carry no package or proof identifier.

### 7.2 Host-page and route test

`test/unit/web/identity-host-pages.test.ts` renders SA-06c (operator, travel agent, pending SuperAdmin, suspended
SuperAdmin with a restoration request, audit behind), SA-06e, SA-09s (both kinds, every state), SA-06g, SA-06h,
SA-06n (both steps), SA-06x, `/account` (three roles and a support view), TA-12e (states a to d), OP-10n, OP-10i,
SA-10n, SA-10i, and asserts:

- (a) each WP-15 POST path appears as a form action only on its host page of §1.5;
- (b) every form action rendered by these renderers matches a registered POST route of its instance (method and path
  pattern), with the CSRF token of that route;
- (c) no SuperAdmin renderer renders a form with a field named `email` or `newEmail` except SA-06b's create form, and no
  rendered text contains "Sign in as", "Impersonate" or "Override" (V21 "no admin override");
- (d) with `session.supportView` set, `/account` and every WP-15 page reachable in a support view render no form other
  than the banner's exit and the account menu's sign-out (V22 "no action");
- (e) parity: the SA-09s fact mappings (states 4, 6, 7, 8) and the SA-06c `elevate` gating agree with Core's checks in
  `elevation.ts:51-60, 91-129` over a fixture table (requester, target, status, role, duties); a change to Core's
  conditions fails the test.

The system steps V21-12 and V22-2 repeat (b), (c) and (d) on `lane-ui`.

### 7.3 Existing tests that pin current behaviour and MUST change

| Test | Pin | Change |
|---|---|---|
| `test/unit/web/carried-forms-admin.test.ts:5-11, 55-61, 72-75, 170-176, 184, 200-203` | Four account carried forms with plain `?done=` | Account entries removed; the WP-13 entries stay |
| `test/unit/web/accounts-pages.test.ts:112, 218, 292, 330` | Links to `/admin/elevations`; support-view form in `#access`; the carried flash | AM-W15-06 links; the rebuilt `support` action; receipts |
| `test/system/browser.test.ts:209-234` | Support-view details summary; banner "Support view of …"; `waitForURL …?done=support_view_ended` | Disclosure summary words; banner "Read-only view for …"; URL with `&op=` |
| `test/system/case-work.test.ts:283`, `test/system/core-pages.test.ts:521`, `test/system/intake-pages.test.ts:267`, `test/system/payments-views.test.ts:340`, `test/system/refusals.test.ts:304` | Banner text "Support view of" | "Read-only view for" (action paths unchanged) |
| `test/ui/gallery.test.ts:778-779`, `test/unit/web/services-pages.test.ts:268`, `test/unit/web/signed-in.test.ts:213-218`, `test/unit/web/shell.test.ts:115` | Banner text | New words; the end form selector unchanged |
| `test/system/ported-pages.test.ts:106-110, 378` | `/admin/elevations`, `/admin/grants` read 200; the audit words on `/admin/grants` | Unchanged paths; the words come from SA-06g's unavailable primary action |
| `test/system/ported-pages.test.ts:176-188` | TA locations `?done=started`, `?done=cancelled`; "Code sent to your current address" | Locations allow `&op=`; the field label stays |
| `test/system/delivery.test.ts:196-203, 272-273` | Staff notice words; the notice links the delivery page | Words stay ("An application was assigned to you"); the assignment notice links the application only (delivery link removed for this kind) |
| `test/system/flows.test.ts:179-190`, `test/system/sign-in-states.test.ts:169-180` | Email-change flow | Unchanged (actions and fields unchanged); re-run |
| `test/unit/web/status-pages.test.ts:327-330` | `resultHrefOf` rows | Adds the `grant` row |
| `test/unit/web/signed-in.test.ts` | Admin rail members (no test pins the label text today) | Add a pin for "Elevation requests" |
| `test/unit/web/routes.test.ts` | Inventory rows | Four new GET rows |
| `test/unit/bff.test.ts` | Identity route handlers (if any case posts the moved routes) | Imports from the new route modules |

Stay valid: Core tests (`test/identity/accounts.test.ts`, `test/identity/tasks.test.ts`), `test/unit/nav-counts.test.ts`,
`test/unit/signin-address.test.ts`, `test/system/refusals.test.ts` support-view logic (`:284-360`, words only change).

## 8. Register updates (`COMMAND-COVERAGE.md`)

Proposed edits for the architect (this design does not edit the register):

| Command | Row now | Proposed row |
|---|---|---|
| `iam.request_elevation` | SA-06; WP-15 | SA-06c "Access and support" (form → D62); note "Operator with an authenticator and no duties; receipt on SA-06c" |
| `iam.approve_elevation` | SA-06 (elevations); SA-09 (second approval) | SA-09s `/admin/elevations/:id/decide/approve` (→ D64); listed on SA-06e; note "K-2P; no form for the requester or the target; refused while the audit record is not healthy" |
| `iam.decline_elevation` | SA-06; SA-09 | SA-09s `decline` (→ D65); note "The requester's decline is a withdrawal" |
| `iam.reset_credentials` | SA-06 | SA-06c (→ D61); note "Staff only; a travel agent is refused as the parked lost-mailbox rule" |
| `iam.set_accounting_grant` | SA-06 | SA-06c (→ D68); note "Receipt on SA-06h; OP-10a shows the B29 boundary to the holder" |
| `iam.create_group_read_grant` | SA-06 | SA-06n `/admin/grants/new` (→ D67); note "The group is shown from Core before the form; receipt on SA-06h" |
| `iam.revoke_grant` | SA-06 | SA-06x `/admin/grants/:id/revoke` (→ D69); note "Both kinds; containment" |
| `iam.start_support_view` | SA-06 | SA-06c (→ D70; stays, WP-02 §1.5); note "Banner SH-R09; no receipt (the banner states it)" |
| `iam.start_email_change`, `iam.confirm_email_change`, `iam.cancel_email_change` | TA-12 | TA-12e `/ta/account/email` (→ T39, T40, T41); note "Two proofs; completion ends every session" |
| `dlv.acknowledge_notice` | …; OP-10; SA-10 | add: "`ops.notices.acknowledge` on OP-10i and `admin.notices.acknowledge` on SA-10i (WP-15, CC-03)" |
| `iam.end_support_view` | SH-01 banner | add: "Receipt `support_view_ended` on SA-06c (WP-15)" |
| `iam.sign_out` | SH-01; TA-12, OP-10, SA-10 | add: "SA-10 is built in WP-15 (`/account`); the forms are WP-01's" |

Proposed §6 disposition CC-20 (CC-19 is WP-16's): "The WP-15 access forms are rebuilt in place on SA-06c (the support-view start stays
there, WP-02 §1.5); elevation decisions leave the list for SA-09s; group read grants are given on SA-06n and revoked on
SA-06x, with receipts on SA-06h; the operator and SuperAdmin notice pages are rebuilt with WP-08's renderers." §5.1
counts unchanged (WP-15: 11).

## 9. Findings, open questions, deviations and STOP items

Ranks follow PRI-20260930-01. P0 blocks the main path or risks irreversible harm; P1 goes to the architect under
LD-12, then to Max's end review; P2 is parked.

### 9.1 Findings worked in this design

| ID | Rank | Finding (current code) | Scenario | Design |
|---|---|---|---|---|
| F-W15-01 | P1 | Elevation approve and decline are disclosures in a list (`identity.ts:188-241`), with no evidence of the target's current state (Q-W02-03; AD-13) | Two operators wait for elevation; a SuperAdmin opens the wrong disclosure and approves the operator who still holds an incident; Core refuses after the reason is typed, or a later request for the right person is approved without seeing their duties | SA-09s with scope, evidence, effect, hard stops and review |
| F-W15-02 | P1 | Refused elevation and grant forms lose the typed reason (`reasonField` has no value, `identity.ts:107-112, 209, 218, 273`) | A SuperAdmin revokes a grant during an incident; a stale revision refuses it; the containment reason is gone and must be typed again under pressure | Re-render with the reason kept (LD-17, §4.2) |
| F-W15-03 | P1 | LD-17 truncations in seven places (§2.16 last paragraph) | A travel agent pastes a 330-character string whose first 320 characters form another valid address; the page shows that address as the new one and the change proceeds toward it after the current proof | Read whole; refuse over the limit at the field |
| F-W15-04 | P1 | A group read grant takes a typed group reference and shows no group (`identity.ts:261`) | A SuperAdmin pastes a reference of another travel agent's group; the operator reads another travel agent's applicants and released documents for up to the maximum span (B10 exact scope; a disclosure cannot be undone) | SA-06n step 2 shows the group from `core.admin_group`; `groupId` hidden (Q-W15-02) |
| F-W15-05 | P1 | Unchecked `?done=` flashes on SA-06c, SA-06e, SA-06g and TA-12e (`identity.ts:91-105`; `accounts/pages.ts:449-454`; `edge/account.ts:124-126`; WP-02 F-U4-02) | A replayed old address shows "Grant revoked. It stopped working at once." while the grant is active, and the SuperAdmin closes the incident on that basis | Receipts checked against the operation (§2.14) |
| F-W15-06 | P2 | Copy states configuration values the page does not read: "72 hours" (`identity.ts:205, 237`; `accounts/pages.ts:589`), "up to 30 minutes" (`:595`), "within 30 minutes" (`edge/account.ts:91`) | The installation shortens the support-view span; the SuperAdmin plans a 30-minute review and is cut off | Ends shown from the read after start; no number before |
| F-W15-07 | P1 | The banner says "Support view of [name]" and "End support view" (`chrome.ts:56-74`), not SH-R09 | Reviewers check SH-R09 word for word and fail every page; users see two names for one mode | AM-W15-01 |
| F-W15-08 | P2 | The staff account page says "Ask a SuperAdmin if your work address changes." (`pages/identity.ts:587`) while no control changes a staff address | An operator asks; the SuperAdmin has no tool; time is lost | Sentence removed; the boundary notice stays |
| F-W15-09 | P1 | A wrong email-change code reads "The code is invalid or has expired. Request a new code." (`edge/account.ts:151, 169`; `MESSAGES` `:58`) on a page with no "request a new code" | The travel agent searches for a resend control, gives up, and the change expires | Combined sentence with the real route (cancel and start again) |
| F-W15-10 | P2 | The UX §4.4 pending sentence is missing on the account page and the change page | A travel agent believes documents already go to the new address and misses a result email at the old one | §2.9, §2.10 item 3 |
| F-W15-11 | P2 | The elevation request is offered while the operator holds duties (`accounts/pages.ts:588-590`); Core refuses after submit | The SuperAdmin types a reason, sends, and learns about the duties afterwards | Duties gating with a parity test |
| F-W15-12 | P2 | An expired request offers "Record as expired" (`identity.ts:204-207`) | A SuperAdmin presses it expecting an approval | No form; Core closes it (D-W15-06) |
| F-W15-13 | P2 | Staff notices use travel agent words; `problem_reported`, `handed_back`, `flag_responded` read "The application was updated."; `reassigned_away` links an application its reader lost (`delivery/pages.ts:174-195, 672-673`) | An operator misses that the travel agent handed a case back; another opens the link and gets "no access" | §2.12.4; no link for `reassigned_away` |
| F-W15-14 | P2 | Every staff notice links the delivery page (`delivery/pages.ts:673`) | An assignment notice leads to the delivery page of a case not yet worked | Delivery link only for result and disclosure notices |
| F-W15-15 | P2 | A refused grant create rewrites `not_found_or_forbidden` as a field error on `groupId` (`identity.ts:513`) | An access change during the request reads as a mistyped reference | Shell (LD-14); with F-W15-04 a not-found group is never on the form |
| F-W15-16 | P2 | A grant whose time passed shows as active with an end in the past (`identity.ts:276-280`) | A SuperAdmin revokes it needlessly, or believes the operator still has access | §2.12.2 words; no revoke form |
| F-W15-17 | P2 | The grants page renders every active grant with its own revoke disclosure on one page | 200 grants give 200 forms; a phone user scrolls through all of them | Paging 50; revoke on SA-06x |

### 9.2 Open questions for the architect

| ID | Rank | Question | Concrete scenario | Recommendation |
|---|---|---|---|---|
| Q-W15-01 | P1 | Host pages and paths of §1.3 and §1.5: the four access forms rebuilt in place on SA-06c; elevation decisions on SA-09s at the WP-06 reserved path; grants on SA-06n and SA-06x with receipts on SA-06h | Two forms for one command carry different words; a refusal re-renders a page without the reader's form | Yes |
| Q-W15-13 | P1 | The four access actions on SA-06c: (A, this design) rebuilt in place as `confirmDisclosure` actions, like WP-02's status actions on the same page; or (B, the parallel `WP-15-acceptance.md` §1) four task pages (its SA-06q request elevation, SA-06k reset, SA-06t accounting grant, SA-06v support view) with SA-06c holding facts and links | A: a 1,000-character reason refused on SA-06c re-opens the action's own disclosure with the reason (WP-02 D-U4-05); nine posts in seven system test files keep sending `/admin/support-view` from `/admin/accounts/:id` (WP-02 §1.5 says the form MUST stay there). B: a refused reset re-renders a smaller page with its own effect block; those nine posts change their GET source and the WP-02 rule is amended | A (one pattern for every action of one account; WP-02 §1.5 binding; the disclosure already shows the consequences before the button). If B is chosen, U1 builds the four pages with the CMP-25 frame, the IDs of the checklist, the same fields and §2.13 to §2.16, and §7.3 adds the nine GET sources |
| Q-W15-02 | P1 | SA-06n shows the group from `core.admin_group` before the form; `groupId` becomes hidden (F-W15-04; D-W15-04) | A pasted wrong reference gives an operator another travel agent's documents | Yes |
| Q-W15-03 | P1 | Conform the banner to SH-R09 (AM-W15-01); ten tests change their expected text | Each later review fails the SH-R09 check | Yes |
| Q-W15-04 | P1 | SA-09s withholds the approve form in states 4, 6, 7, 8 from read facts, with the parity test §7.2 (e) (as WP-07 SA-09c) | A form that Core will refuse invites a typed reason that is then lost | Yes |
| Q-W15-05 | P1 | Proof writes on `lane-ui` (§6.2): two fresh operators (one elevated, then suspended: a suspended SuperAdmin stays per run), one declined SuperAdmin account, one travel agent whose address changes, one grant given and revoked, support views of syn-ta-1 | A rerun meets earlier rows; the run tag identifies them | Approve; synthetic only |
| Q-W15-06 | P1 | Harness extension U7 (`enrol`, `enterMailedCode`) under the LD-11 conditions | Without it the elevation, grant and email-change steps cannot run on `lane-ui` | Approve; otherwise those steps run as tests and the record says so |
| Q-W15-07 | P2 | An expired open request shows no form (D-W15-06) | A SuperAdmin records "expired" by mistake while meaning to approve | Yes |
| Q-W15-08 | P2 | The accounting grant receipt lands on SA-06h, not SA-06c | Same summary as a group read grant; only the grant page can check the kind | Yes |
| Q-W15-09 | P2 | Staff notices show "Application [reference]" until a read serves names (STOP-W15-07) | An operator with 40 notices cannot tell them apart by name | Yes; revisit with evidence |
| Q-W15-10 | P2 | The travel agent account page makes a second read (`iam.email_change_page`) for the pending line, never in a support view | One more read per account page view | Yes |
| Q-W15-11 | P2 | Display paging of 50 over the one grants read | 200 grants in one table on a phone | Yes |
| Q-W15-12 | P2 | Rail member "Elevations" → "Elevation requests" | Two names for one tab | Yes |

### 9.3 Deviation register

| ID | Deviation | Protocol effect |
|---|---|---|
| D-W15-01 | New GET pages SA-09s, SA-06h, SA-06n, SA-06x (§1.3) | New routes and inventory entries; actions and fields unchanged |
| D-W15-02 | Approve and decline leave SA-06e; create and revoke leave SA-06g | Host pages change; system tests that read the lists keep their paths |
| D-W15-03 | Success locations with `done` and `op` replace the `?done=` flashes; elevation decisions answer on SA-09s; grant creation (both kinds) and revocation answer on SA-06h; the exit gains `op` | Locations change |
| D-W15-04 | SA-06n: step 1 is a GET form with `group`; `groupId` is hidden after the group is shown; `granteeAccountId` is preselected only from `grantee` in the address | Field names unchanged; `groupId` input type changes |
| D-W15-05 | SA-09s withholds the approve form in four fact states (Q-W15-04) | None (Core decides at the command) |
| D-W15-06 | An expired open request shows no decision form | None |
| D-W15-07 | Banner words, button label "Exit support view", the 409 copy, the member label (AM-W15-01) | Shell values; form action unchanged |
| D-W15-08 | TA-12e: combined code sentence; no lifetime numbers; the UX §4.4 pending sentence; the lost-mailbox boundary as CMP-10 | Copy only |
| D-W15-09 | Staff notices: staff event words; no application link for `reassigned_away`; the delivery link only for result and disclosure notices | Links change |
| D-W15-10 | `resultHrefOf` adds `grant` → SA-06h | Status page link |
| D-W15-11 | No receipt for the support-view start: the banner, read from the session, states who, why and until when | None (location `/account` unchanged) |
| D-W15-12 | Support-view start stays on SA-06c although every other new WP-15 task has its own page (WP-02 §1.5) | None |

### 9.4 STOP items

| ID | Kind (DECISIONS §3) | What | Why the UI needs it | Criterion check | Without it |
|---|---|---|---|---|---|
| STOP-W15-01 | Defect note (P2) | `iam.start_email_change` refuses `email_change_open` for a change past its end that the cleanup task has not closed yet, while `iam.email_change_page` hides it (`email-change.ts:70-73`; `queries.ts:133`) | TA-12e offers a start that Core refuses | Same facts; Core could end an expired change at start, as confirm does (`:109-112`) | §2.13 sentence |
| STOP-W15-02 | Kind 1 (P2) | One elevation read by id (`iam.admin_elevation`) | SA-09s for a request older than the 50 most recent decided | Facts exist | "Not listed" state |
| STOP-W15-03 | Defect note (P2) | A support view of an operator who holds the accounting grant gets the `ops` surface only (`sessions.ts:111`), so the Accounts area the operator sees is absent (V22 "current read scope") | V22 completeness | Same scope rule as the policy (`policy.ts:573-574`) | Consequence line on SA-06c; the Accounts area holds only boundaries in this release |
| STOP-W15-04 | Note (P2) | `iam.start_support_view` accepts a viewed account in any status (`support-view.ts:35-38`); every read then refuses | A hand-made start for a suspended account opens a view that shows nothing | — | SA-06c offers it for active accounts only |
| STOP-W15-05 | Defect note (P2) | `listGrants` reads every active grant with no row limit under a 2000-row contract, and `listElevations` every open request under a 500-row contract (`queries.ts:85, 95`; `contracts/identity.ts:145, 150`) | The 2001st active grant (or 501st open request) makes the read fail for every SuperAdmin | Serve the accepted bound with a count | "2000 or more" line; grants are rare by design |
| STOP-W15-06 | Kind 1 (P2) | `ended_by` name on grant rows | "Revoked by [name]" on SA-06h and SA-06g | Facts exist (`iam_grants.ended_by`) | Time only; audit history |
| STOP-W15-07 | Kind 1 (P2) | Applicant names for the reader's notice applications (staff) | OP-10n and SA-10n rows | Facts exist | "Application [reference]" |
| — | Boundary (existing) | First-admin and all-admin-loss recovery; lost-mailbox recovery; staff address change; travel agent eligibility (B-01, B-02; BS B44) | — | Product owner | CMP-10, owner product owner |

No STOP item blocks the WP-15 main path. No P0 item is open in this design. No Kind 2 change is requested. The defect
notes go to the orchestrator for the Core batch as P2 notes; the Kind 1 items are parked.
