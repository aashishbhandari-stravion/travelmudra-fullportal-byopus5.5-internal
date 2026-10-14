# WP-02 U4 notes: Accounts & access (SA-06a to SA-06d)

Unit U4 of WP-02. Author: the U4 engineer, 13 October 2026. Input for the architect's integration, the gallery
registration and the `DESIGN.md` update. U4 commits nothing; the architect integrates. Base: lane commit e9e96e3.
Binding inputs: `WP-02-design.md` §1.2 to §1.6, §3.0, §3.14, §3.15, §4, §5, §6, §7.3, §8.1 (U4 row), §8.3;
`WP-02.md` §3 (Q-W02-03) and §4.1 (B-02, B-03, B-06, B-14). All copy is draft under the copy rules (CR-09).

## 1. Files

| File | Change |
|---|---|
| `src/apps/staff/accounts/pages.ts` (new) | Renderers `accountListPage`, `createAccountPage`, `accountPage`, `dutiesPage`; the account messages table (`accountMessage`, `accountProblems`, falling back to `messageOf`); receipt expectations (`accountReceiptExpectations`, `restoreReceiptCode`); `CARRIED_ACCOUNT_FORMS`, `CARRIED_DONE`, `REASON_LABEL`, `ACCOUNT_LIST_CAP`, `wantsDuties`, `elevationKindText`. |
| `src/apps/staff/identity.ts` | Account routes only: list, new, create, detail, duties and the five status actions use the new renderers, answer with `receiptLocation(...)`, keep the typed reason on a refusal, and read the duties through `optionalView`. The carried POST routes (`reset-credentials`, `elevation`, `accounting-grant`) keep their `?done=` redirects; their refusal shows the account page with the typed reason. The support-view start route calls the new `renderAccount` signature (behaviour unchanged except that the typed reason stays). Elevation, grant, support-view-end, operator-grant and Accounts-surface pages and routes are unchanged. The old account renderers moved out; `DONE` now holds only the elevation and grant codes. |
| `scripts/dev/gallery/accounts.ts` (new) | `accountsGalleryPages()`: 12 pages (§5). Not registered: the architect adds it to `galleryPages()` in `scripts/dev/gallery-pages.ts`. |
| `test/unit/web/accounts-pages.test.ts` (new) | 35 tests (§6). |
| `test/system/ported-pages.test.ts` | Line 85 only: the suspend redirect allows `&op=<key>` after `done=suspended`. |

No route path, form action, hidden input or field name changed. No change under `src/modules/`, `src/contracts/`,
`src/core-api/`, `src/kernel/`, `src/platform/`, `src/workers/` or migrations. No route inventory entry changes.

## 2. Pages

### 2.1 SA-06a User accounts `/admin/accounts`

- Header: h1 "User accounts" (the tab label; see D-U4-01), lead, primary action "Create an account", meta "Active
  SuperAdmins [n]" and "Open elevation requests [n]" (link), freshness "Read at [time] IST".
- With one or no active SuperAdmin: warning "Only one active SuperAdmin." / "No active SuperAdmin." with the two-person
  rule, and the boundary notice "Recovering access after the loss of every SuperAdmin is unavailable until the product
  owner selects a recovery policy. Owner: product owner." (ref `parked_first_admin`).
- Filters: GET `role`, `status` (enumerated); "Clear filters" link while a filter is set.
- Table: Name (link), Email, Role, Status (badge text), Authenticator, Data. Pending and approved rows carry the
  attention marker with text. No requester or second-approval column (B-06).
- At 200 rows (Core's `ACCOUNT_LIST_LIMIT`, B-14): info callout "This list may be incomplete. It shows at most 200
  accounts. Use the filters to narrow it." No total anywhere. A unit test pins `ACCOUNT_LIST_CAP = ACCOUNT_LIST_LIMIT`.
- Empty: "No accounts yet." (no filter); "No accounts match these filters." with "Clear filters" (filter set).

### 2.2 SA-06b Create an account `/admin/accounts/new`

- Breadcrumb "User accounts"; h1; lead "The account starts as waiting for approval. It cannot sign in until it is
  approved and activated."; freshness.
- Boundary notice: "Checking a travel agent’s eligibility or fraud risk is unavailable until the product owner selects
  the criteria. Owner: product owner." (ref `unselected_account_eligibility`), then "Approval records your judgement
  and your reason."
- Form (unchanged action and names): error summary; Role (placeholder, no default); Email address; Display name;
  "Reason for creating the account"; a visible section "What happens next" (not collapsible) before "Create account"
  and the "Cancel" link.
- No audit state before sending (B-06). Refusal: every typed value stays; `email_in_use` on the email field with the
  link "Open the account that uses this address" when Core returns `existing`; `audit_degraded` as a form-level item
  "The audit record is behind, so creating an account is unavailable now. Suspension and declines still work."
  (status 503, as `ported-pages.test.ts` expects); `restorePath` `/admin/accounts/new`.

### 2.3 SA-06c Account `/admin/accounts/:accountId`

Order: receipt (first in `main`), header (breadcrumb, h1 name, status badge, Role, Reference with copy, "Duties and
hand-off" for an operator, freshness), refusal block or stale comparison (only after a refused POST), status facts
"Account" (`statusFacts`), "Next action" (`actionPanel`), "Account status", "Access and support", "Sign-in
address", "Grants" (read only), "History".

| Status | Next action (owner: step) | Status actions offered |
|---|---|---|
| Pending, not SuperAdmin | SuperAdmin: "Approve or decline this account." | Approve, Decline |
| Pending, SuperAdmin, open creation request | "A second, different SuperAdmin": decide the creation request on the elevation requests page, with requester, request time and expiry; link "Open elevation requests"; blocker "Another person owns this step" when the reader is the requester or the account | Decline only. No approve control (Q-W02-03) |
| Pending, SuperAdmin, no open request | SuperAdmin: no open request is recorded; decline if not needed | Decline |
| Approved | SuperAdmin: "Activate the account when it should be able to sign in." | Activate, Suspend |
| Active | "No owner": "No action is waiting." | Suspend |
| Suspended, not SuperAdmin | SuperAdmin: restore or leave suspended | Restore |
| Suspended, SuperAdmin | SuperAdmin: request restoration; a second SuperAdmin decides | Request restoration |
| Suspended, SuperAdmin, open restoration request | Second SuperAdmin: decide it on the elevation requests page (link) | None (see D-U4-03) |
| Declined | "No owner": "No action. A declined account stays declined. Its address can be used for a new account." | None |

- Each action is a `confirmDisclosure` with a purpose-named reason ("Reason for approving", …) and `_rev.account`.
  Ordinary actions first, containment (decline, suspend) last.
- Audit record behind: approve, activate and restore (and the carried access actions) show as disabled buttons with
  "Unavailable while the audit record is behind." (`aria-describedby`); decline and suspend stay available; a note says so.
- Suspend: consequences per role and for oneself ("You are signed out at once."). Operator: the duties summary from
  `iam.operator_duties` (counts with units, "Nothing moves automatically", link "Open duties and hand-off"); when the
  read answers unavailable: "Duties: unavailable now … Open duties and hand-off before you suspend." The suspend form
  stays. Last active SuperAdmin: warning, the recovery boundary notice and the unchecked, required checkbox
  `acknowledgeLastSuperAdmin=yes`.
- "Access and support" carries the four forms of the later package (§1.5 of the design) with their current markup,
  ids, rules and `?done=` flash: request elevation, accounting grant, support view (hidden `accountId`), reset second
  factor. An open operator-elevation request shows here as before.
- "Sign-in address": travel agent: "Only the travel agent can change this address, with codes sent to the current and
  the new address. Staff cannot change it." plus "Signing in without access to the current email address is
  unavailable until the product owner approves a recovery rule. Owner: product owner." Staff: "Changing a staff
  sign-in address is unavailable until the product owner approves a rule for it. Owner: product owner." No control
  changes an address.

### 2.4 SA-06d Duties `/admin/accounts/:accountId/duties`

h1 "Duties of [name]", status badge, breadcrumbs, freshness; suspended-operator notice; "Assigned applications ([n])"
(links to `/admin/applications/:id` when registered, else identifiers with copy); "Acts where this operator owns
reconciliation ([n])"; "Open holds on assigned applications: [n] open holds"; "Owned incidents ([n])" (links to
`/admin/incidents/:id` when registered). Empty list: "None." A non-operator account: Core's uniform 404.

## 3. How the amendments are met

| Amendment | Met by |
|---|---|
| Q-W02-03 | No approve control for a SuperAdmin (pending or restoration); the next action names "A second, different SuperAdmin" and links `/admin/elevations`; the creation receipt's next step says the same. |
| B-02 | `accountReceiptExpectations(accountId)`: resource `account`, id from the address, and per code the command's own fields (`created`: `result` and `accountId`; `suspended`: `result` and boolean `lastSuperAdmin`; `restore_requested`: `result = elevation_requested` and an `elevationId`; others: `result`). `readReceipt` reads the operation; anything else is the neutral unchecked receipt. Facts read after the operation are "Current …"; the restoration receipt names a request only when its id equals the returned `elevationId`. Carried forms keep their `?done=` flash (residual, LD-02). A WP-02 code without `op` shows nothing. |
| B-03 | Neutral wording: unchecked receipt from the component; duties "unavailable now"; `core_unavailable` on a form reads "TravelMudra cannot be reached now. Your entries are kept. Try again later." No "Nothing changed" claim. Unknown outcome: 303 to `/admin/operations/<key>` (existing `respond`). |
| B-06 | No `auditOk` on the create form, no requester or second-approval details on the list, and the stale comparison shows "Status: Not in your form" beside the current "[status] since [time] IST", and the unsent reason beside "Not recorded". No earlier status is stated. |
| B-14 | `ACCOUNT_LIST_CAP = 200`, pinned to Core's limit by a unit test; "may be incomplete", no total. |

## 4. Decisions of this unit

| Id | Choice | Reason |
|---|---|---|
| D-U4-01 | h1 "User accounts", not "Accounts". | The destination tab is "User accounts" (`SURFACE_CONFIG`, pinned by `flows.test.ts:90`) and `DESIGN.md` keeps "Accounts" for the finance surface. One name per tab, as the architect decided for "Services" (`WP-02.md` §4.2). |
| D-U4-02 | Account facts use `statusFacts` ("Account", visible title), not `summaryList`. | One labelled fact per row with explicit "Not recorded" ("None issued" enrolment, "Creator not recorded" for a real account without a creator, instead of the old unconditional "by the synthetic seed"). |
| D-U4-03 | A suspended SuperAdmin with an open restoration request gets no second "Request restoration" form; the next action links the open request. | The page shows only actions that apply; a second request duplicates the open one. Core still decides. |
| D-U4-04 | The duties are read only while suspension is offered for an operator (active or approved). | The read serves the suspension review; other states do not need it. |
| D-U4-05 | A refused action re-opens its own confirmation with an error summary inside the form (first item of the form fields), the typed reason and, for suspend, the checkbox state. A refusal of an action not offered on the page (hand-made POST) shows one refusal callout under the header. A stale revision shows the comparison under the header, and the action's form too when it still applies. | `DESIGN.md` error-summary rule; the script's inline validation looks for the summary inside the form (U0 D-U0-01). |
| D-U4-06 | Refusals use `HTTP_STATUS_BY_CATEGORY`; `not_found_or_forbidden` gives the uniform 404 (also for create); `unauthenticated` and `maintenance` reach the shell. | One status table; access refusals never show the form again. |
| D-U4-07 | The create receipt's next step and the activation effect wording use the current role. | The role of a pending or approved account does not change; the receipt labels them "Current" or states the command's known effect. |

## 5. Gallery

`accountsGalleryPages()` (admin shell): `accounts-list.html` (one active SuperAdmin, every status, long name and
address), `accounts-list-no-match.html`, `accounts-new.html`, `accounts-new-refused.html` (address in use, typed values),
`account-ta-created.html` (accepted receipt), `account-superadmin-pending.html`, `account-operator-suspend.html`
(refused suspension, duties), `account-operator-duties-unavailable.html`, `account-last-superadmin.html`,
`account-stale.html`, `account-audit-behind.html` (unchecked receipt, disabled privileged actions),
`account-duties.html`. Synthetic data only.

## 6. Checks

| Check | Result |
|---|---|
| `npm run typecheck` | Clean (whole project) on the final run. Earlier runs showed errors in `src/apps/staff/catalogue/admin.ts` and `launch.ts` from other units' in-progress work; they were gone at the final run. |
| `npx eslint` on the five changed files | Clean. |
| `node --test test/unit/web/accounts-pages.test.ts test/unit/bff.test.ts` | 50 of 50 pass (35 new, 15 existing). |
| Scratch browser sweep of the 12 gallery pages (the checks of `test/ui/gallery.test.ts`: 1440 and 390 px, light and dark, axe WCAG 2.2 A/AA and best practice; 360 and 320 px overflow) | No overflow, no CSP violation, no script error, no axe violation of any impact. |
| `npm run test:ui` | 949 of 949 pass (the account gallery is not registered yet, so the sweep does not open its pages). |
| System tests (`TMPDIR=/tmp/w2u4`, concurrency 1): `ported-pages`, `flows` | 14 of 15 pass. The one failure is the catalogue pin `ported-pages.test.ts:300` (declaration `#publish` link), which the catalogue unit's in-progress change moves (design §8.3); not caused by U4. Every account test passes, including the audit-behind test (create refused 503 with the form-level text; suspension accepted; restore unavailable). |
| System tests: `refusals`, `browser`, `case-views`, `case-work`, `core-pages`, `intake-pages`, `payments-views`, `lifecycle`, `web-shell`, `no-monolith` | 91 of 91 pass (every support-view caller that posts from the account page included). |

## 7. Items for the architect

- Register `accountsGalleryPages()` in `scripts/dev/gallery-pages.ts`.
- CSS (not added; `components.css` is not this unit's file): `.account-email { overflow-wrap: anywhere; }` for the list
  and facts. An address without a hyphen or dot break can widen the desktop table; the sweep found no overflow with
  the synthetic addresses.
- `DESIGN.md`: SA-06 receipt codes and the carried-form rule for the account page.
- No route inventory change is needed.

## 8. Findings

| Id | Rank | Finding | Scenario | Disposition |
|---|---|---|---|---|
| F-U4-01 | P2 | The duties read refuses `not_found_or_forbidden` if the operator became a SuperAdmin between the two reads of one page request. | An operator's elevation is approved in the same second as a SuperAdmin opens the account page; that request shows the uniform 404, the next request shows the page. | Parked: the rule that an access refusal reaches the shell governs; the window is one request. |
| F-U4-02 | P2 | Carried forms keep an unchecked `?done=` flash (reset, elevation request, accounting grant, support view end). | A replayed old address shows "Accounting grant set." without a check. | Parked per B-02 residual; the later package rebuilds them. |
| F-U4-03 | P2 | The design's "Created … by the synthetic seed" applied to every account without a creator. | A real account created by a harness or migration would read "by the synthetic seed". | Worked in D-U4-02: "Creator not recorded" unless the account is synthetic. |
