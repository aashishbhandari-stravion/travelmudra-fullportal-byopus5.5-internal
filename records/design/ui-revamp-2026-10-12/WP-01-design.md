# WP-01 design review: shell, sign-in, access states and command-result patterns

Lane `ui-revamp-2026-10-12`. Author: Principal UX Engineer (Claude Opus subagent). Date: 12 October 2026.
Status: design before code, for the architect's decision (LD-12) and the independent design review (LD-13).
Product base: lane repository at 102e4c9. This document writes no product code. Paths in `file:line` form are
relative to the lane repository unless they start with `REC/` (`internal/records/`).

Writing style: ASD-STE100 at about 75%. `MUST`, `MUST NOT`, `SHOULD` and `MAY` have their normative meaning.
"Current" means the code at 102e4c9. "Target" means the specification or the plan.

## 0. Summary for the architect

- **LD-09 recommendation: option C.** Adopt the UX §7.2 colours, type scale, radius and motion, one deep-ink rail
  for every role, and teal only for the primary action, the current location and the selection. Keep the
  self-hosted Atkinson Hyperlegible Next and Mono families (SIL OFL, already in the build) instead of system sans,
  as a recorded deviation from UI-PLAN §9 (§3.5). Every proposed text pair passes 4.5:1 and every non-text pair
  passes 3:1 in light and dark (§3.3, §3.4).
- **STOP items (§11.3).** STOP-01 (Kind 1): `core.operation` returns no command name and no accepted time, so
  CMP-08 and the operation status page cannot show them (acceptance WP01-A82 fails as written). STOP-02 (Kind 1,
  optional): projection read models carry no as-of time, so LD-08 "As of [time] IST" is not possible; the design
  uses "Behind by [n] s". STOP-03 (Kind 2, optional): the sign-in commands report one combined failure for a
  wrong, expired, used or exhausted code. No STOP item blocks the WP-01 main path.
- **PUB-02-S8, S9, S10 are designed without a Core change.** S8: the server re-renders a fresh form on
  `conflict_operation_key` and the script reloads a sign-in form that the browser restores from the back/forward
  cache (§4.4). S9: the code step reads the typed address from a sealed, short-lived, HttpOnly cookie (new; P1
  deviation D-02). S10: the server reports an expired challenge exactly like any other bot-check failure
  (`bot_check_failed`, `src/platform/captcha.ts:63-64,108`); the BFF reads the expiry from the posted proof to
  choose the text, and the re-rendered form already carries a new check (§4.5).
- **AD-12.** The `accounts` surface is not a context. The context selector MUST NOT list it. No synthetic account
  then holds two contexts, so no selector shows. Recommendation to Max: retire `/accounts` (P1, LD-02).
- **Top open questions:** Q-01 STOP-01 (P1); Q-03 the sealed address cookie (P1); Q-04 `/accounts` retirement
  (P1); Q-05 search text in the address of the existing search pages (P1); Q-06 attention counts computed in page
  code with mixed units (P1); Q-07 the `next` parameter for SH-R03 (P1).

## 1. Scope and sources

| Item | Scope in WP-01 | Target source | Current code |
|---|---|---|---|
| SH-01 app shell | Conformance of every region; rail per role; top bar; environment label and title prefix; context selector; breadcrumb and freshness line; announcement region; skip link; landmarks; phone menu | UI-PLAN §2.1, §2.2, §5.1; UX §7.1, §7.3; AD-10, AD-11, AD-12 | `src/web/ui/shell.ts`, `src/web/pages/signed-in.ts`, `src/web/pages/chrome.ts`, `static/css/layout.css` |
| SH-02 access and service state | Denied, access changed, signed out, not found, maintenance, capacity | UI-PLAN §2.4, §2.3 SH-R02 to SH-R05; UX §8.3; BS B10, B38, B39, B40 | `src/web/pages/status.ts`, `src/web/pages/layout.ts`, `src/apps/shared/server.ts:235-243` |
| PUB-02 sign-in | Travel agent email and code; staff email code and authenticator; staff authenticator enrolment; sign-in help; S8, S9, S10 | UI-PLAN §3.1, §5.1, §14.1; UX §7.5, §8.2; BS B08, B09; AD-05, AD-08 | `src/apps/shared/identity-routes.ts`, `src/apps/shared/pages/identity.ts:110-258` |
| OP-10 (sign-in and MFA part) | Account page facts, sessions, sign out, sign out everywhere, accounting-grant notice | UI-PLAN §3.3 OP-10, §5.3 OP-10, AD-12, §11.3 | `src/apps/shared/pages/identity.ts:263-341` |
| Sign out | Both BFFs | UI-PLAN §5.1 (Sign out row); BS B08 | `src/apps/shared/identity-routes.ts:70-85` |
| Check operation status | `/<ta|ops|admin>/operations/:operationKey` | UI-PLAN §1.1 UNR, §1.4 C4, §7 row "Check operation status", AD-04; BS B35 | `src/apps/shared/common-routes.ts:28-46`, `src/web/pages/operation.ts` |
| Command-result patterns | CMP-07, CMP-08, CMP-10, CMP-12, CMP-13, CMP-14, CMP-23, CMP-27 | UI-PLAN §1.1, §1.4, §8.1, §11.3; UX §3.3, §7.4 | `src/web/ui/forms.ts:53-60`, `src/web/ui/feedback.ts`, `src/apps/shared/core/shared.ts:363-388` |
| Tokens and type (LD-09 input) | Colours, type, radius, motion, focus, rail | UX §7.2; UI-PLAN §9; UX §9 C01, C16 | `static/css/tokens.css`, `DESIGN.md` |
| Proof | V23 | UX §12 V23; BS B33, B38 to B40 | — |

Inputs read: UX spec §2.3, §3.3, §7, §8.2, §8.3, §9 (C01, C13, C16), §10.1, §12 (V23); BUILD_SPEC B08, B09, B10,
B33, B35, B37 to B40; UI-PLAN A (AD-04, AD-08, AD-10, AD-11, AD-12), §1, §2, §3.1, §5.1, §6.1, §7 (K rules and the
WP-01 command rows), §8, §9, §10, §11, §12.1, §13.2, §14; DECISIONS-2026-10-10 §3; lane PLAN §4 (LD-01 to LD-13);
`research/route-map.md` §0, §1, §3.3, §3.4, §4, §5; the code files named in the prompt; and, for alignment only,
`REC/design/ui-revamp-2026-10-12/WP-01-acceptance.md` (the Product Manager's checklist, items WP01-A01 to A92 and its
questions Q-01 to Q-11). Section 11.4 lists where this design differs from that checklist.

## 2. SH-01 shell conformance

### 2.1 Region by region

| # | Region | Current behavior (file:line) | Target (source) | Exact change | Open |
|---|---|---|---|---|---|
| R1 | Environment label | `aside.env-banner` with "Test installation" or "Local test installation" and the detail "Synthetic data only. Mail goes to the synthetic mailbox." (`src/web/pages/chrome.ts:79-82`, `src/web/ui/shell.ts:257-260`). Signed-in pages only. `statusDocument` (sign-in, help, enrolment, status pages) has none (`src/web/pages/layout.ts:31-63`). The public site has none (`src/web/public/site.ts:142-178`). No title prefix (`shell.ts:228`, `layout.ts:39`, `site.ts:149`). | Text "Test environment. Synthetic data only." on every page, public included, never dismissible; title starts with "[TEST]" (UI-PLAN §2.1, CMP-23, AC-28; BS B37) | New helper `environmentLabel(env)` in `src/web/ui/shell.ts`. It renders `<p class="env-label">` as the first child of the page `<header>` (inside the banner landmark, so no extra landmark). Text: "**Test environment.** Synthetic data only." It renders for `test` and `local_test`, never for `production`. Every document builder MUST add the label and the title prefix "[TEST] ": `appShell`, `statusDocument` (new required parameter `environment`), and the public site document (WP-20 owns `site.ts`; dependency D-WP20 in §10). | None. The mailbox detail is dropped: it is not in the target text. |
| R2 | Support-view banner (CMP-22) | A callout inside `<main>`, before the page content (`chrome.ts:50-69`, placed by `shellChrome` at `chrome.ts:88`). | "Persistent; first in reading order after skip link" (UI-PLAN §8.1 CMP-22, SH-R09) | Move the banner into the `<header>`, after the environment label and before the top bar. Keep its "End support view" form (`action="/admin/support-view/end"`, `_csrf`, `_op`). | None. |
| R3 | Top bar: wordmark and context name | Brand "TravelMudra" plus the surface label, or the surface switch when there are two or more surfaces (`shell.ts:272-280`). Bar colour differs per surface (`tokens.css:285-329`). | Text-only wordmark until C01 (UX §9 C01); one shell for every role (UX §7.1) | Keep the text wordmark. Keep the context name beside it ("Travel agent", "Operations", "Administration"); the name replaces the per-surface colour as the "where am I" cue (not colour alone). | None. |
| R4 | Context selector | `surfaceSwitch` (`shell.ts:208-213`), fed by `surfaceLinks` (`signed-in.ts:44-49`) from `session.surfaces`. An operator with the accounting grant gets `['ops','accounts']`, a SuperAdmin `['admin','accounts']` (route-map §4.1), so both see a switch today. | Only the contexts the person actually holds; shown only with more than one; an accounting grant is not a context (UI-PLAN §2.1; AD-12) | `surfaceLinks` MUST drop `accounts`. Rename the visible label to "Context" (`aria-label="Your contexts"`). Keep the component: it shows for a fixture person with two contexts only. Effect today: no synthetic account sees a selector. | Q-04: retire `/accounts` (§2.3). |
| R5 | Scoped search | No top-bar search. TA rail item "Find an application" `/ta/search` (`shell.ts:75`). SuperAdmin search `/admin/search` exists but has no nav item. No operator search page. | Search in the top bar with a scope label; results only in scope; no out-of-scope counts (UI-PLAN §2.1; BS B10) | Top bar link, not an input: TA "Search your applications" → `/ta/search`; SuperAdmin "Search all applications" → `/admin/search`; operator: none (no page; hidden by `hasPage`). The existing search pages send the search text as `?q=` in a GET form (`src/apps/shared/views/ta.ts:66`), which SH-R06 forbids; a top-bar input would put the text into the address on every page. | Q-05 (P1): the owner of the search pages resolves SH-R06. |
| R6 | Notices | Rail item per role with the count of notices that wait for acknowledgement (`shell.ts:73,88,106`; route-map §4.3). | Notices in the top bar (UX §7.1; UI-PLAN §2.1); TA and operator rail also hold Notices (UI-PLAN §2.2); no read marker (LD-06) | Top-bar link "Notices" to `/<role>/notices`, with the same count. The count names its unit for screen readers: "[n] notices need your acknowledgement". | Q-14 (P2): duplicate entry for TA and operator. |
| R7 | Help | None. | Help opens a side panel; no support hours until C13 (UI-PLAN §2.1; UX §9 C13) | New `<details class="help-panel">` in the top bar, summary "Help". Content in §2.5. Without JavaScript the panel opens in the page flow below the top bar. With JavaScript it opens as a side panel; Escape and a focus move outside the panel close it and return focus to "Help" (AC-02: an overlay that stays open when focus leaves would hide the focused control). | Help text needs C06 and C13 approval (CR-09). |
| R8 | Individual account menu | Name, role detail and a "Sign out" button in the bar (`shell.ts:262-270`); "Your account" is a rail item (`shell.ts:76,90,121`); at 40rem and below the name is hidden (`layout.css:357-359`). | Account in the top-bar menu (UI-PLAN §2.2 rows "Account (top bar menu)") | New `<details class="account-menu">`. Summary: the person's name (CSS truncation at about 20ch; the full name stays in the DOM, so screen readers read all of it) and, visually hidden, "account menu". Panel: full name (wraps), role label, "Your account" link (`/account`), and the existing sign-out form (`action="/sign-out"`, `_csrf`, no `_op`: the route makes its key, `identity-routes.ts:73`). Remove "Your account" from every rail. | None. |
| R9 | Navigation rail | Light rail (`--nav-bg: var(--surface-sunken)`, `tokens.css:159`) under a coloured bar; one flat list per surface (`shell.ts:52-133`); items hidden when their page is not registered (`signed-in.ts:31-36`); `aria-current="page"` on an exact `current` match (`shell.ts:173`). | Deep ink rail, 224 to 240 px at wide width; only the role's destinations (§2.2); current location by weight and the teal indicator, not colour alone (UI-PLAN §2.1, §2.2) | Replace each surface's flat `nav` list by an ordered list of **destinations**. A destination has a label, an icon, candidate links in priority order (the first registered one is its link; none registered hides it) and member pages (the hrefs that mark it current). The rail shows destinations; `aria-current="page"` goes on the destination whose members include the page's `current` href. Rail width 14.5rem (232 px). Mapping in §2.2. | Q-12 (P2): transitional members. |
| R10 | Destination tabs (ADDED) | None: every page is a rail item today (23 for the SuperAdmin). | Not in the specification. Required because seven SuperAdmin destinations group 22 existing pages, and LD-02 keeps old pages working. | New `<nav class="local-nav" aria-label="[Destination] pages">` at the top of `<main>`, before the breadcrumb, when the current destination has two or more registered members. It lists the members with their counts; `aria-current="page"` on the current one. | ADDED component, D-08. |
| R11 | Phone and intermediate menu | Rail from 64rem; a wrapping strip from 40rem to 64rem; a `<details class="nav-menu">` at 40rem and below whose summary shows the sum of all counts (`shell.ts:189-201`, `layout.css:327-379`). | Rail at ≥ 1200 px; menu button at 768 to 1199 px; full-height menu on phones (AD-11; UI-PLAN §9) | Breakpoints 75rem and 48rem. Below 75rem the rail is behind the "Menu" `<details>`. Below 48rem the menu panel also holds Search, Notices and Help (the top bar keeps Menu, wordmark and the account menu). The open panel is in the page flow (it pushes the page down) and fills the viewport height when the list is long. It is not a fixed overlay: without JavaScript an overlay cannot keep focus inside it, and focus would move under the overlay (AC-02). The summary MUST NOT sum counts of different units (CR-07): it shows "needs attention" text when any destination has a count, and "count unavailable" when any count is unavailable. | D-11. |
| R12 | Breadcrumb and freshness line | Breadcrumbs inside `pageHeader` (`src/web/ui/page.ts:10-17,35-49`); no freshness line. | "Updated [time]" or "Freshness unavailable" on every list and workspace page (UI-PLAN §2.1; AD-10; LD-08) | `pageHeader` gets an option `freshness` that renders CMP-12 (§7.4) on the breadcrumb row, right-aligned on wide screens and below the breadcrumb on phones. Pages adopt it when their package rebuilds them. WP-01 pages use it: the account page ("Read at [time] IST") and the operation status page ("Checked at [time] IST"). | STOP-02 (P2) for "As of [time]". |
| R13 | Main region | One `<main id="main" tabindex="-1">` (`shell.ts:284-289`). Pages render one `h1` through `pageHeader`. | One `main`, one `h1` (UI-PLAN §2.1; AC-03) | No change. `signedInPage` SHOULD assert in tests that the rendered page has exactly one `h1`. | None. |
| R14 | Announcement region | `#toast-region` with `role="status"` and `aria-live="polite"` at the end of the body (`shell.ts:307`); used for copy confirmations (`static/js/enhance.js:28-44`). Flash messages render in `<main>` with `role="status"` or `role="alert"` at page load (`feedback.ts:77-85`). | Announces command results without moving focus (UI-PLAN §2.1; AC-09); exactly one polite region that says nothing at load (WP01-A18) | Keep the one region `#toast-region` (tests use it, `test/ui/gallery.test.ts:317`); add it to `statusDocument`. A result after a 303 (post, redirect, get) is a page load: its receipt is the first content of `<main>` and the document title starts with the receipt title (for example "[TEST] Group created · Groups · Travel agent · TravelMudra"); screen readers announce the title on load. The region announces only in-page changes (copy, upload, a refreshed region). Rebuilt pages MUST NOT give a server-rendered message `role="status"`. | None. |
| R15 | Skip link and landmarks | Skip link first (`shell.ts:302`), then the environment `aside`, `header`, `nav`, `main`, `footer`. | Landmarks, one `h1`, logical headings (AC-03, AC-17) | Order: skip link → `header` (environment label, support-view banner, top bar with the context selector) → `nav` rail (`aria-label="Main"`) → `main` → `footer`. No `aside` landmark for the label. | None. |
| R16 | Footer | "Signed-in pages are private to your account." (`shell.ts:291-296`). | — | No change. | None. |
| R17 | Page title | "[title] · [surface label] · TravelMudra" (`shell.ts:228`). | "[TEST]" prefix (R1); the receipt title first after a command (R14) | `appShell` builds "[TEST] " (test installations) + optional receipt title + page title + context + "TravelMudra". | None. |
| R18 | Sign-in and status document | `statusDocument`: brand, `public-main`, footer; no environment label, no announcement region (`layout.ts:31-63`). | Public pages use their own simpler header: text wordmark, "Sign in"; no rail; no private search (UI-PLAN §2.1 "Public header") | Add the environment label, the title prefix and `#toast-region`. A signed-in viewer keeps getting status pages inside their own shell (`status.ts:77-80`). | None. |

### 2.2 Role rail: mapping of current items to UI-PLAN §2.2 destinations

A destination link is the first registered candidate. "Hidden" means that no candidate is registered at 102e4c9
(`ctx.hasPage`), so the destination does not show until its package registers the page. "Transitional" marks a member
that is not in UI-PLAN §2.2 and stays only until the named package rehomes it; a unit test MUST list the
transitional members, so that none stays by accident.

**Travel agent (edge).** Landing stays `/ta/applications` until TA-01 exists (WP-03 then sets `home` to `/ta`).

| Order | Destination (label) | Candidates | Members | State at WP-01 | Current item it replaces |
|---|---|---|---|---|---|
| 1 | Home | `/ta` | `/ta` | Hidden (TA-01, WP-03) | "Home" `/ta` (already hidden) |
| 2 | Services | `/ta/catalogue` | `/ta/catalogue` and its offering pages | Shown | "Countries and services" |
| 3 | Groups | `/ta/groups` | `/ta/groups`; transitional `/ta/intake-incidents` as the tab "Import issues" (until WP-04 rehomes it under BU-P09) | Shown | "Groups", "Intake incidents" |
| 4 | Applications | `/ta/applications` | `/ta/applications` | Shown | "Applications" |
| 5 | Notices | `/ta/notices` | `/ta/notices` | Shown | "Notices" |
| 6 | Payment history | `/ta/payments` | `/ta/payments` | Shown | "Payments" |
| top bar | Search your applications | `/ta/search` | — | Shown | "Find an application" |
| top bar | Account menu → Your account | `/account` | — | Shown | "Your account" |

**Operator (staff).** Landing stays `/ops/work`.

| Order | Destination | Candidates | Members | State at WP-01 | Current item it replaces |
|---|---|---|---|---|---|
| 1 | My work | `/ops/work` | `/ops/work`; transitional `/ops/grants` as the tab "Read grants" (until WP-07 shows read-grant groups as a labelled read-only section of Applications) | Shown | "Assigned work", "Read grants" |
| 2 | Applications | `/ops/applications` (none) | — | Hidden (OP-01 view "All assigned", WP-07) | — |
| 3 | Incidents and follow-up | `/ops/incidents` | `/ops/incidents` | Shown | "Incidents" |
| 4 | Originals | `/ops/originals` (none) | — | Hidden (OP-09, P1). When built, its visibility comes from a read-model fact of the operator's scope (declared physical route), never from page logic. | — |
| 5 | Notices and account | `/ops/notices` | `/ops/notices`, `/account` | Shown | "Notices" |
| transitional | Services | `/ops/catalogue` | `/ops/catalogue` and its offering pages | Shown until the architect decides (Q-12) | "Countries and services" |
| top bar | Account menu → Your account | `/account` | — | Shown | "Your account" |

**SuperAdmin (staff).** Landing stays `/admin/monitors` until SA-01 exists.

| Order | Destination | Candidates | Members (tabs) | State at WP-01 | Current items it replaces |
|---|---|---|---|---|---|
| 1 | Home | `/admin`, `/admin/monitors` | `/admin`, `/admin/monitors` | Shown, links to Monitors until SA-01 (WP-06) registers `/admin` | "Home" (hidden), "Monitors" |
| 2 | Work queues | `/admin/queues/assignment` | Assignment `/admin/queues/assignment`, Assistance `/admin/queues/assistance`, Flags `/admin/queues/flags`, Deferrals `/admin/queues/deferrals`, Documents `/admin/documents/queue`, Import issues `/admin/intake-incidents`, Imports `/admin/intake/attempts` | Shown | 7 items |
| 3 | Applications & groups | `/admin/applications` | `/admin/applications` | Shown | "Applications" |
| 4 | Offerings & launch | `/admin/catalogue` | Catalogue `/admin/catalogue`, Launch `/admin/launch`, Public site `/admin/public-site` | Shown | 3 items |
| 5 | Accounts & access | `/admin/accounts` | Accounts `/admin/accounts`, Elevations `/admin/elevations`, Grants `/admin/grants` | Shown | "User accounts", "Elevation requests", "Grants" |
| 6 | Money & exposure | `/admin/finance` | Finance `/admin/finance`, Payment follow-up `/admin/queues/financial-follow-up` | Shown | 2 items |
| 7 | Incidents & audit | `/admin/incidents` | Incidents `/admin/incidents`, Audit `/admin/audit`, Measures `/admin/measures`, Derived views `/admin/system/projections` | Shown | 4 items |
| top bar | Notices | `/admin/notices` | — | Shown (SA-10 "top bar menu") | "Notices" |
| top bar | Search all applications | `/admin/search` | — | Shown | (no item today) |
| top bar | Account menu → Your account | `/account` | — | Shown | "Your account" |

**Accounts surface.** No rail destination (AD-12; UI-PLAN §2.2 last line: no rail destination for a PARKED
capability). See §2.3.

**Counts.** A destination with one counted member shows that member's count. A destination with two or more
counted members shows a marker with the text "needs attention" (visually short, full text for screen readers);
the destination tabs show the per-member numbers. A summed number MUST NOT appear (CR-07). An unavailable count MUST
show the visible text "Unavailable" (D7; UI-PLAN §1.2), never a blank that reads as zero. Today the shell cannot tell
"zero" from "unavailable": `surfaceNav` drops both (`signed-in.ts:33-34`), and `nav-counts.ts` leaves an unreadable
count out. Change: the count map MUST carry `null` for a counted item whose count could not be read, and the shell
renders "Unavailable" for `null`. Owner of the counters: Q-06.

### 2.3 The `accounts` surface versus AD-12

Facts. Core gives a SuperAdmin the surfaces `['admin','accounts']` and an operator with the accounting grant
`['ops','accounts']` (route-map §4.1). `/accounts` (`accounts.home`, `src/apps/staff/identity.ts:574-578`) renders a
page of seven boundary callouts and no data (`identity.ts:524-539`). The account page says "Held: it opens Accounts
(finance)" (`src/apps/shared/pages/identity.ts:308`).

Recommendation.

1. WP-01 MUST remove `accounts` from the context selector and from the account page's "Work areas" row. Reason:
   AD-12 ("An accounting grant is not a context") and UI-PLAN §2.2 ("no Accounts dashboard").
2. The OP-10 account page MUST show the grant as a fact with the B29 notice (§6).
3. `/accounts` stays registered in WP-01 (LD-02: a route is retired only with Max's decision). Proposal to Max
   (Q-04, P1): retire `accounts.home`. Its content is already on OP-10 (operator) and belongs to SA-07 (SuperAdmin,
   WP-06/WP-07). Until then a bookmarked `/accounts` still renders its page.
4. No change in Core: the session's `surfaces` list stays as Core returns it; the BFF only stops presenting
   `accounts` as a context. This is presentation, not a permission decision: the server still authorizes `/accounts`.

### 2.4 Top bar anatomy (wide, intermediate, phone)

```text
≥ 1200 px
[Test environment. Synthetic data only.                                                         ]
[TravelMudra  Travel agent | Search your applications |        Notices 2 | Help ▾ | SYN Agent ▾ ]
[rail: Services / Groups / Applications / Notices / Payment history] [main ...]

768–1199 px
[env label]
[Menu ▾ | TravelMudra  Travel agent | Search your applications | Notices 2 | Help ▾ | SYN Agent ▾]

< 768 px (and 1280 px at 400% zoom)
[env label, wraps]
[Menu ▾ | TravelMudra | SYN Agent ▾]
(Menu panel: Search your applications · Notices 2 · Help · rail destinations)
```

The top bar MUST NOT be sticky. A sticky bar can hide a focused control after scrolling (AC-02).

### 2.5 Help panel content (draft copy, CR-09; needs C06 and C13)

Travel agent:

> **Help**
> Applications lists your applications and what each one needs next. A group holds the applications of one trip.
> After you send a form, the page shows a request reference. If a page says "Checking the original result", select
> "Check status" on that page. Do not send the form again.
> [Help with signing in](/sign-in/help)
> *Notice:* Contacting TravelMudra support from this page is unavailable until the business owner approves support
> hours and an escalation path. Owner: business owner.

Staff (operator and SuperAdmin): the same request-reference paragraph, plus "If you lost your authenticator, a
SuperAdmin can reset it and send you a new enrolment code." and the same notice. The panel MUST NOT state support
hours, a response time, a telephone number or an escalation promise (UX §9 C13; UI-PLAN §2.1).

## 3. Design tokens and type (input to LD-09)

### 3.1 Current tokens compared with UX §7.2

Current values are OKLCH in `static/css/tokens.css`; hex values below are their sRGB conversions.

| Element | Current (`tokens.css` line) | UX §7.2 target | Gap |
|---|---|---|---|
| Canvas (paper) | `--canvas` n-25 ≈ #FBFAF7 (`:120`) | Paper #F5F4F0 | Small |
| Surface | white (`:121`) | White #FFFFFF | None |
| Text (ink) | `--text` ≈ #161D2A, blue-grey (`:130`) | Ink #172D35, teal-grey | Small hue shift |
| Muted text | ≈ #4F5662 (`:131`) | #52636B | Small |
| Primary action | blue ≈ #1F53AA (`:138`) | Teal #006B63 | Hue change on every button |
| Links | blue ≈ #1C50A7 (`:132`) | Not stated; teal is reserved for action, current location and selection | Decision §3.2 |
| Navigation | Coloured bar per surface: TA ink blue ≈ #172A4E, ops deep teal ≈ #033633, admin aubergine ≈ #3C1F39, accounts umber ≈ #3C2A18 (`:285-329`); light rail (`:159`) | Deep ink navigation with light text, one shell for all roles | Structural |
| Semantic | 10 tones: neutral, info (blue), success (green), warning (amber), danger (red), blocked (plum), unavailable (grey), attention (saffron), external (violet), delivery (teal) (`:165-216`) | Attention #8A4B08, blocking/error #B42318, external wait #5F48A8, neutral slate; no success hue in P0 (UI-PLAN §9) | Fewer hues |
| Typeface | Atkinson Hyperlegible Next and Mono, self-hosted (`:227-228`; `DESIGN.md:10`) | System sans; Source Sans 3 only after C16 | Decision §3.5 |
| Type scale | 13 / 14 / 16 / 18 / 22 / 28 / 36 / 46 px; h1 36 px (`:229-236`; `static/css/base.css:52-53`) | 16 body, 14 supporting, 12–13 meta, headings 20 / 24 / 28 | h1 36 → 28 |
| Line height | 1.55 body, 1.2 / 1.35 headings (`:237-239`) | ADDED in plan: 1.5 body, 1.25 headings | Small |
| Radius | 4 / 8 / 12 px (`:258-261`) | 8 px | Use 8 px for controls and panels |
| Motion | 120 / 200 / 320 ms (`:269-273`) | 150–200 ms | 120 → 150, 320 → 200 |
| Focus | 3 px ring + halo (`:148-149`; `DESIGN.md:27`) | ADDED: 2 px ink outline with 2 px white offset; paper outline on the rail | Change |

### 3.2 Proposed token set (option C)

Light theme. Values marked ADDED are not in UX §7.2.

| Token (existing name kept where possible) | Light | Use |
|---|---|---|
| `--canvas` | #F5F4F0 | Page background (paper) |
| `--surface` | #FFFFFF | Panels, forms, tables |
| `--surface-sunken` | #EDEBE5 (ADDED) | Wells, code blocks |
| `--surface-hover` | #EEF1F0 (ADDED) | Row hover |
| `--border` | #D6D3CB (ADDED) | Thin decorative boundaries (no contrast requirement) |
| `--control-border` | #6E7E85 (ADDED) | Input and button outlines (non-text 3:1) |
| `--text` | #172D35 | Ink |
| `--text-muted` | #52636B | Supporting text |
| `--link` | #172D35, always underlined (ADDED) | Links stay ink so teal stays rare; the underline (full-strength `currentColor`, 1 px; 2 px on hover) is the cue, as WCAG 1.4.1 requires because ink links have no contrast with ink text |
| `--action` / `--action-hover` / `--action-text` | #006B63 / #00534D / #FFFFFF | Primary button |
| `--danger-action` / hover / text | #B42318 / #8F1C13 / #FFFFFF | Destructive button |
| `--focus-ring` / `--focus-halo` | #172D35 / #FFFFFF | 2 px ring at 2 px offset; the halo fills the offset |
| `--selection-bg` / `--selection-text` / `--selection-marker` | #E6F0EF / #172D35 / #006B63 | Selected row (teal 10% tint) and its 3 px marker |
| Disabled (ADDED) | background #ECEEEE, text #52636B, border #6E7E85 dashed | Disabled control; its reason is visible text (AC-13) |
| `--rail` / `--rail-text` / `--rail-muted` | #172D35 / #FFFFFF / #B9C6CA | Rail for every role |
| `--rail-current` / `--rail-marker` / `--rail-focus` | #24434E / #5CC8BC (ADDED light teal) / #F5F4F0 | Current item: heavier weight, 4 px marker, `aria-current`. Teal #006B63 cannot be the marker on ink (2.24:1); the light teal keeps the hue at 7.14:1 |
| `--env-bg` / `--env-text` / `--env-border` | #F3EDE6 / #172D35 / #8A4B08 | Environment label strip |
| `--tone-attention-{text,bg,solid}` (also used by `warning`) | #8A4B08 / #F3EDE6 / #8A4B08 | The viewer must act; at risk |
| `--tone-danger-*` (also `blocked`) | #B42318 / #F8E9E8 / #B42318 | Blocking or error |
| `--tone-external-*` | #5F48A8 / #EFEDF6 / #5F48A8 | Waiting on an external party |
| `--tone-neutral-*` (also `info`, `delivery`, `unavailable` with a dashed border) | #475467 slate (ADDED value) / #EDEEF0 / #475467 | Facts, TravelMudra owns the next step, unavailable |
| `--tone-success-*` | text #172D35 ink / bg #EDEEF0 / icon #172D35 | "Issued", "Accepted": ink text and an icon, no green (UI-PLAN §9) |
| `--toast-bg` / `--toast-text` | #172D35 / #F5F4F0 | Transient confirmation |

The ten `--tone-*` names stay. Components keep their `data-tone` values; only the values change. This keeps
`src/web/ui/presentation.ts` and every page module unchanged.

Dark theme (all ADDED; UX §7.2 states light values only): canvas #0E171B, surface #15232A, sunken #0A1215, hover
#1C2E35, border #2C3E46, control border #7D9097, text #ECEAE4, muted #A9B6BC, link #ECEAE4 underlined, action
#4FBFB2 with text #0B1417 (hover #74D1C6), danger action #F08A7E with text #0B1417 (hover #F5A99F), focus ring
#ECEAE4 with halo #0E171B, selection bg #163B3A, marker #4FBFB2, disabled bg #1E2C32 with text #A9B6BC and border
#7D9097, rail #0A1215 with text #ECEAE4 and muted #A9B6BC, rail current #1C3038 with marker #4FBFB2, environment
strip #33261A with text #ECEAE4 and border #E2A65C, attention #EDB46E on #2E2419, error #F59E93 on #33201E,
external #C3B6F2 on #251F38, slate #B8C4CB on #1E2A30, toast #ECEAE4 with text #0E171B.

Type: `--text-xs` 0.8125rem (13), `--text-sm` 0.875rem (14), `--text-md` 1rem (16), `--text-lg` 1.25rem (20, h3),
`--text-xl` 1.5rem (24, h2), `--text-2xl` 1.75rem (28, h1). `--text-3xl` and `--text-4xl` stay for public pages
only (WP-20). Body line height 1.5; headings 1.25. Tabular numerals for money and count columns (unchanged).
Radius: `--radius-m` 0.5rem for controls and panels. Motion: `--dur-fast` 150 ms, `--dur-base` 200 ms,
`--dur-slow` 200 ms; reduced motion removes transitions (unchanged rule).

### 3.3 Contrast, light theme (WCAG 2.2 relative luminance; computed for this review)

| Foreground | Background | Ratio | Minimum | Result |
|---|---|---|---|---|
| Text #172D35 | Canvas #F5F4F0 | 13.04 | 4.5 | Pass |
| Text #172D35 | Surface #FFFFFF | 14.35 | 4.5 | Pass |
| Text #172D35 | Sunken #EDEBE5 | 12.04 | 4.5 | Pass |
| Text #172D35 | Hover #EEF1F0 | 12.63 | 4.5 | Pass |
| Muted #52636B | Canvas | 5.69 | 4.5 | Pass |
| Muted #52636B | Surface | 6.26 | 4.5 | Pass |
| Muted #52636B | Sunken | 5.25 | 4.5 | Pass |
| Muted #52636B | Hover | 5.51 | 4.5 | Pass |
| Link (ink) | Canvas / Surface | 13.04 / 14.35 | 4.5 | Pass |
| Action text #FFFFFF | Action #006B63 | 6.40 | 4.5 | Pass |
| Action text #FFFFFF | Action hover #00534D | 8.96 | 4.5 | Pass |
| Action #006B63 (button edge) | Surface / Canvas / Sunken | 6.40 / 5.81 / 5.37 | 3 | Pass |
| Danger text #FFFFFF | Danger #B42318 / hover #8F1C13 | 6.57 / 8.96 | 4.5 | Pass |
| Control border #6E7E85 | Surface / Canvas | 4.21 / 3.83 | 3 | Pass |
| Focus ring #172D35 | Halo #FFFFFF | 14.35 | 3 | Pass |
| Focus ring #172D35 | Canvas / Surface / Sunken / Selection | 13.04 / 14.35 / 12.04 / 12.35 | 3 | Pass |
| Selected text #172D35 | Selection #E6F0EF | 12.35 | 4.5 | Pass |
| Muted #52636B | Selection #E6F0EF | 5.39 | 4.5 | Pass |
| Selection marker #006B63 | Selection / Surface | 5.51 / 6.40 | 3 | Pass |
| Disabled text #52636B | Disabled bg #ECEEEE | 5.37 | 4.5 | Pass |
| Disabled border #6E7E85 | Surface | 4.21 | 3 | Pass |
| Rail text #FFFFFF | Rail #172D35 | 14.35 | 4.5 | Pass |
| Rail muted #B9C6CA | Rail | 8.20 | 4.5 | Pass |
| Rail text #FFFFFF | Rail current #24434E | 10.56 | 4.5 | Pass |
| Rail marker #5CC8BC | Rail / Rail current | 7.14 / 5.25 | 3 | Pass |
| Rail focus #F5F4F0 | Rail / Rail current | 13.04 / 9.60 | 3 | Pass |
| Env text #172D35 | Env bg #F3EDE6 | 12.35 | 4.5 | Pass |
| Env border #8A4B08 | Env bg | 5.85 | 3 | Pass |
| Attention #8A4B08 | Its tint #F3EDE6 / Surface / Canvas / Sunken / Selection | 5.85 / 6.79 / 6.17 / 5.70 / 5.85 | 4.5 | Pass |
| Error #B42318 | Its tint #F8E9E8 / Surface / Canvas / Sunken / Selection | 5.58 / 6.57 / 5.97 / 5.51 / 5.66 | 4.5 | Pass |
| External #5F48A8 | Its tint #EFEDF6 / Surface / Canvas / Sunken / Selection | 6.08 / 7.05 / 6.41 / 5.91 / 6.07 | 4.5 | Pass |
| Slate #475467 | Its tint #EDEEF0 / Surface / Canvas / Sunken / Selection | 6.62 / 7.69 / 6.98 / 6.45 / 6.62 | 4.5 | Pass |
| Text #172D35 | Each tint (attention, error, external, slate, teal) | 12.17 to 12.38 | 4.5 | Pass |
| Muted #52636B | Each tint | 5.31 to 5.40 | 4.5 | Pass |
| Toast text #F5F4F0 | Toast #172D35 | 13.04 | 4.5 | Pass |

Not a valid pair: focus ring on the teal fill (2.24:1). The ring never touches the fill: it is drawn at a 2 px
offset, and the white halo fills the offset, so the measured pair is ring against halo (14.35:1). The CSS MUST keep
`outline-offset: 2px` with the halo on every control, the rail included (rail: paper ring, rail-coloured halo).

Informative: teal used for link text would be 6.40:1 on white but only 2.24:1 against ink body text, so teal links
would also need an underline. Ink links with an underline are the simpler rule.

### 3.4 Contrast, dark theme

| Foreground | Background | Ratio | Minimum | Result |
|---|---|---|---|---|
| Text #ECEAE4 | Canvas #0E171B / Surface #15232A / Sunken #0A1215 / Hover #1C2E35 | 15.09 / 13.37 / 15.72 / 11.70 | 4.5 | Pass |
| Muted #A9B6BC | Canvas / Surface / Sunken / Hover | 8.73 / 7.74 / 9.10 / 6.77 | 4.5 | Pass |
| Action text #0B1417 | Action #4FBFB2 / hover #74D1C6 | 8.37 / 10.37 | 4.5 | Pass |
| Action #4FBFB2 | Surface / Canvas / Sunken | 7.22 / 8.15 / 8.49 | 3 | Pass |
| Danger text #0B1417 | Danger #F08A7E / hover #F5A99F | 7.67 / 9.82 | 4.5 | Pass |
| Control border #7D9097 | Surface / Canvas | 4.83 / 5.45 | 3 | Pass |
| Focus ring #ECEAE4 | Halo #0E171B / Surface / Sunken / Selection | 15.09 / 13.37 / 15.72 / 10.14 | 3 | Pass |
| Selected text #ECEAE4 | Selection #163B3A | 10.14 | 4.5 | Pass |
| Muted #A9B6BC | Selection | 5.87 | 4.5 | Pass |
| Selection marker #4FBFB2 | Selection / Surface | 5.48 / 7.22 | 3 | Pass |
| Disabled text #A9B6BC | Disabled bg #1E2C32 | 6.91 | 4.5 | Pass |
| Disabled border #7D9097 | Surface | 4.83 | 3 | Pass |
| Rail text #ECEAE4 | Rail #0A1215 / Rail current #1C3038 | 15.72 / 11.41 | 4.5 | Pass |
| Rail muted #A9B6BC | Rail | 9.10 | 4.5 | Pass |
| Rail marker #4FBFB2 | Rail / Rail current | 8.49 / 6.16 | 3 | Pass |
| Rail focus #ECEAE4 | Rail / Rail current | 15.72 / 11.41 | 3 | Pass |
| Env text #ECEAE4 | Env bg #33261A | 12.18 | 4.5 | Pass |
| Env border #E2A65C | Env bg | 6.87 | 3 | Pass |
| Attention #EDB46E | Tint #2E2419 / Surface / Canvas / Sunken / Selection | 8.21 / 8.70 / 9.81 / 10.23 / 6.60 | 4.5 | Pass |
| Error #F59E93 | Tint #33201E / Surface / Canvas / Sunken / Selection | 7.46 / 7.81 / 8.81 / 9.18 / 5.92 | 4.5 | Pass |
| External #C3B6F2 | Tint #251F38 / Surface / Canvas / Sunken / Selection | 8.48 / 8.65 / 9.76 / 10.17 / 6.56 | 4.5 | Pass |
| Slate #B8C4CB | Tint #1E2A30 / Surface / Canvas / Sunken / Selection | 8.25 / 9.03 / 10.20 / 10.62 / 6.86 | 4.5 | Pass |
| Text #ECEAE4 | Each tint | 10.14 to 13.11 | 4.5 | Pass |
| Muted #A9B6BC | Each tint | 5.87 to 7.59 | 4.5 | Pass |
| Toast text #0E171B | Toast #ECEAE4 | 15.09 | 4.5 | Pass |

The `@contrast` declarations at `tokens.css:12-96` MUST be extended with the new pairs (rail, environment label,
selection, disabled, tints against selection). The contrast test parses only `oklch(...)` values
(`test/unit/web/contrast.test.ts:126-127`). The token unit MUST either write the values above as OKLCH or add a
`#rrggbb` branch to `parseColour`. Recommendation: add the hex branch and keep the UX §7.2 hex values verbatim,
so that a reviewer can compare tokens with the specification without a conversion.

### 3.5 Options and recommendation

| Option | Content | For | Against |
|---|---|---|---|
| A | Keep the current tokens | No cost | Fails the comparison with UX §7.2 on every page: per-role shell hues against "common shell", blue action against teal, h1 36 px |
| B | Adopt UX §7.2 fully, including system sans (the architect's LD-09 default) | Literal match with UX §7.2 and UI-PLAN §9 | Drops a hyperlegible family that distinguishes 0/O, 1/l/I in codes, OTP digits, passport numbers and references; the family is already licensed (SIL OFL), self-hosted and accepted in the M6 build, so the reason for "system sans as the reliable initial choice" (no licence or third-party risk) is already met |
| **C (recommended)** | Option B for colour, rail, type scale, radius, motion and focus; keep Atkinson Hyperlegible Next and Mono, with the system sans stack as the fallback already in `--font-text` | Matches UX §7.2 in every visible structure; keeps legibility for the codes that WP-01 itself introduces (CMP-27) | A recorded deviation from UI-PLAN §9 "System sans" until Max records a C16 answer |

Recommendation: option C, recorded as deviation D-06 for Max's end review (LD-12). If Max prefers system sans, the
change is two token values (`--font-text`, `--font-mono`), the preload line `shell.ts:251`, `static/css/fonts.css`, and
the font assertions `test/ui/gallery.test.ts:239-266`.

Cost of option C.

| File | Change |
|---|---|
| `static/css/tokens.css` | New values; delete the four per-surface blocks (`:285-329`, `:422-448`); new rail, environment, selection and disabled tokens; new `@contrast` pairs |
| `static/css/base.css` | Heading sizes (`:52-67`), line heights, link underline (`:82-93`) |
| `static/css/layout.css` | Rail, top bar and breakpoints (owned by the shell unit, §10) |
| `test/unit/web/contrast.test.ts` | Hex parsing; surfaces loop still passes (all surfaces resolve to the same values) |
| `DESIGN.md` | Principles "Paper and ink", "Navigation", "Surface switch", the tone table and the shell row |

Visual effect on pages not yet rebuilt (LD-02): every primary button turns teal; links turn ink and stay underlined;
the coloured top bar becomes white with an ink rail; success badges lose green and read as ink with their icon;
"blocked" (plum) reads as error red; "info" (blue) and "delivery" (teal) read as slate; h1 shrinks from 36 to 28 px.
Labels and icons do not change, so no status loses its meaning (AC-06). Pages stay usable between packages.

## 4. PUB-02 sign-in: anatomy and states

### 4.1 Instances and the path choice (AD-08)

Facts. Travel agents sign in on edge (`/sign-in`, `/sign-in/verify`, `/sign-in/help`); staff on staff
(`/staff/sign-in`, `/staff/sign-in/verify`, `/staff/enrol`, `/staff/enrol/setup`, `/staff/enrol/confirm`)
(`src/apps/shared/identity-routes.ts:88-206`). Each instance knows only its own origin: the configuration has
`http.publicOrigin` and `http.allowedOrigins` for itself (`src/platform/config.ts:52-58`, a strict object), and the
instance files give edge and staff separate loopback ports (`src/platform/instances.ts:132-152`). No configuration
names the other instance, so neither page can link to the other today. A link would need a new configuration field
under `src/platform/` (off limits for this lane).

Recommendation (agrees with the PM's Q-04): no cross-instance link.

- Edge `/sign-in` shows the path choice as text: a heading line "Travel agent sign-in" and the sentence
  "TravelMudra staff sign in at the staff sign-in address that TravelMudra gave them." No staff host appears on a
  public page (in production the staff host is private).
- Staff `/staff/sign-in`: "Staff sign-in" and "Travel agents sign in at the travel agent sign-in page." No link.
- This changes AD-08's "path choice" from two links to two labelled paths. Deviation D-13 (P2). If Max later wants a
  link on the staff page only (staff host to public host), it needs a configuration field: a platform change routed
  outside the lane.

### 4.2 Travel-agent path: anatomy

Email step, `GET /sign-in` (`sign_in.ta.form`), rendered by `statusDocument` (public-style header: environment
label, text wordmark; no rail, no private search, no Notices).

1. `h1` "Sign in". Lead: "Travel agents sign in with a one-time code that we email to the account address. No
   password is needed."
2. Path line (§4.1).
3. Notice slot: signed out, session ended, address changed, resend (§4.6 rows P2 to P6), or the error summary.
4. Stepper "Step 1 of 2: Your address" (existing `stepper`).
5. Form `action="/sign-in"` with `_csrf`, `_op`, `email` (`type="email"`, `autocomplete="username"`,
   `inputmode="email"`, `maxlength="320"`), the bot check (`<altcha-widget name="altcha" auto="onsubmit"
   challenge="…">`, unchanged element and attribute, `identity.ts:122-133`), button "Send sign-in code". The form
   carries `data-reload-on-restore="/sign-in"` (§4.4).
6. Bot-check hint: "Your browser solves a short check before we send a code. It keeps automated requests out. No
   other company sees it. This check stays valid for [n] minutes after the page loads." [n] comes from the
   challenge's own expiry (`challenge.parameters.data.e`, `captcha.ts:91`) minus the render time, rounded down, and
   is omitted when the challenge does not parse. The page MUST NOT hard-code 5 minutes.
7. `<details>` "Lost access to your email?" → CMP-10 notice (§4.7).
8. `<details>` "Need an account?" → CMP-10 notice (§4.7).
9. Link "Help with signing in" (`/sign-in/help`).

Code step, `GET /sign-in/verify` (`sign_in.ta.verify_form`).

1. `h1` "Enter your code". Stepper "Step 2 of 2".
2. Address line (S9, §4.3): "If **[address]** can sign in, we sent a code to it." The address wraps anywhere
   (`overflow-wrap: anywhere`; 320 characters at 320 px MUST NOT scroll sideways).
3. Form `action="/sign-in/verify"` with `_csrf`, `_op`, the OTP field `code` (CMP-27), button "Sign in". The form
   carries `data-reload-on-restore="/sign-in/verify"`.
4. Two separate links under the form: "Use a different address" (`/sign-in?change=1`) and "Request a new code"
   (`/sign-in?resend=1`).
5. Hint: "The code works once, only in this browser, and expires after a short time. Only the newest code works. No
   email? Check your spam folder, then request a new code."

### 4.3 PUB-02-S9: where the code step gets the address

Facts. The request POST answers 303 to `/sign-in/verify` (`identity-routes.ts:40`). The redirect carries nothing.
Core keeps only a keyed digest of the address (`iam_otp_challenges.contact_hmac`, `migrations/0100_identity.sql:214`),
so no Core query can return the typed address. The address MUST NOT go into the URL (SH-R06; WP01-A40).

Design (deviation D-02, Q-03, P1):

- On an accepted request, the BFF sets a cookie `__Host-tm_signin_addr` (staff: `__Host-tm_staff_signin_addr`,
  next to the names in `src/apps/shared/surfaces.ts:41-44`): `Secure`, `HttpOnly`, `SameSite=Lax`, `Path=/`,
  `Max-Age=900`. Its value is the typed address sealed with AES-256-GCM. The key is derived from the BFF's existing
  CSRF key with a fixed label (the pattern of `captcha.ts:76-77`). The associated data is the pre-session nonce, so a
  cookie copied to another browser does not open.
- The code step opens the cookie. If it opens, the line names the address. If it is absent, expired or does not
  open, the line reads "If the address you entered can sign in, we sent a code to it."
- The cookie is cleared by a successful sign-in (next to the pre-session cookie, `server.ts:568-577`) and replaced
  by every new accepted request.
- `/sign-in?change=1` and `/sign-in?resend=1` prefill the email field from the cookie in a fresh form (new `_op`,
  new challenge). `?resend=1` adds the notice "Send a new code to this address. A new code replaces the previous
  one." Both run the bot check again before any code is issued (BS B08). The PM's Q-09 asks for prefill on "Use a
  different address"; this design prefills both, because a typo is the common case.
- No browser storage API holds the address (SH-R12; WP01-A41). The address is in the page body of the code step and
  of the prefilled form only, which carry `Cache-Control: no-store` (`server.ts:342-353`).

Copy deviation (P2, Q-11): mail is a task that runs after the commit (`src/modules/identity/commands/sign-in.ts:7`),
so "we sent" is not yet a fact when the page renders. Proposed text: "If [address] can sign in, we are sending a code
to it." The S9 text is binding, so the architect decides.

### 4.4 PUB-02-S8: form already used

Facts. The request command's content is the address only (`canonical: (i) => ({ email: i.email })`,
`sign-in.ts:140`). The same `_op` with the same address replays the accepted answer (303 to the code step, no new
code). The same `_op` with another address is refused with `conflict_operation_key`. The re-render today puts
"Open the page again to start a new request." (`src/web/ui/presentation.ts:594`) on the email field through the
fallback field id (`identity-routes.ts:37`), so the address field turns red (UAT-01). The first request also spent
the bot-check challenge (`src/modules/identity/botcheck.ts:19-28`), so the restored form is stale twice: its `_op`
is used and its challenge is spent. The script already knows that pages come back from the back/forward cache
(`static/js/enhance.js:757-768`). `Cache-Control: no-store` does not keep a page out of that cache in every browser.

Design: two layers. The server layer is authoritative and works without JavaScript; the script layer removes the
extra step.

1. **Server (MUST).** On `conflict_operation_key` at `sign_in.ta.request` and `sign_in.staff.request`, the handler
   re-renders a fresh form: new `_op`, new challenge, the typed address kept, status 409. The message is a form-level
   item of the error summary (CMP-07 form-level item, §7.1). It MUST NOT mark the email field invalid. Text: "This
   form was already used to request a code, so nothing new was sent. The form below is new. Check the address and
   send the code request again." The refusal stays a refusal (no command runs).
2. **Script (SHOULD).** A form with `data-reload-on-restore="[path]"` makes `enhance.js` call
   `location.replace([path])` on `pageshow` when `event.persisted` is true. `replace` issues a GET, so a restored
   409 or 422 page never re-posts. Used on: the email step, the code step, the enrolment code step and the
   enrolment setup page. Effect: Back from the code step shows a fresh email step at once (S8: "without a manual
   reload"). Back after a successful sign-in reloads the code step, which redirects a signed-in browser to `/home`
   (`identity-routes.ts:106`), so no working code form shows (WP01-A46).

Rejected alternatives: a header-only fix (no header keeps every browser from restoring the page); a client-made
`_op` (the challenge is spent anyway, and the server mints keys, `server.ts:583`).

S8 applies to the staff request form in the same way (PM Q-08).

### 4.5 PUB-02-S10: bot-check challenge expired

Facts. How the server reports an expired challenge today: `verifyPayload` throws `bot_check_failed` /
`bot_check_failed` with no field errors for every failure, expired or not: wrong purpose, wrong binding, expiry
(`data.e <= now`), a bad solution, or a parse error (`captcha.ts:63-64,99-121`). A second use is the same answer
(`botcheck.ts:28,39`). The HTTP status is 422 (`src/kernel/errors.ts` `HTTP_STATUS_BY_CATEGORY`). The sign-in page
shows "The verification did not complete. Complete it again and resubmit." (`identity.ts:45`). No log line names the
reason (UAT-08 triage §2). A distinct reason code would need a new entry in `src/kernel/vocabulary/reasons.ts`
(the kernel is off limits, DECISIONS §3), so the server side cannot say "expired".

Design (no Core change):

1. **Server re-render (MUST).** The re-render after a refused request already reads a new challenge
   (`identity-routes.ts:24-26,38`). The handler decodes the posted `altcha` proof (base64 JSON) with a tolerant
   parser and reads `challenge.parameters.data.e`. When the category is `bot_check_failed` and `e` is at or before
   the request time, the text is: "The check on this page expired before you sent the form. This page now has a new
   check. Send the code request again." plus the link "Reload the page" (`/sign-in` or `/staff/sign-in`, one
   action, as S10 requires). Otherwise: "The check did not pass. This page now has a new check. Send the code
   request again." The decoded value chooses text only. It grants nothing and is never trusted for a decision.
   Status stays 422. The message sits at the bot-check field (`id="altcha"`) and in the summary. The typed address
   stays.
2. **Empty proof (MUST, existing).** An empty `altcha` keeps the no-JavaScript text (`identity.ts:115`).
3. **Pre-emptive notice (SHOULD).** The page renders `data-check-expires-in="[ms]"` on the bot-check field (expiry
   minus render time). `enhance.js` starts a timer relative to page load (immune to a wrong client clock). At expiry
   it reveals a hidden notice in the field: "The check on this page has expired. Reload the page to get a new
   check." with the link "Reload the page". It does not block the submit: a submit still gets the server text of
   step 1.
4. **Diagnostics (SHOULD).** The BFF records a diagnostic event `bot_check_refused` with the route id and the closed
   value `expired` or `other` (allowlisted identifiers only, BS B33).

S10 applies to the staff request form too (PM Q-08).

### 4.6 Travel-agent path: states and copy

All copy is draft (CR-09) except the S9 line, the §11.3 template and the SH-02 maintenance sentence. "Form-level"
means a CMP-07 summary item that marks no field. Status codes follow `statusOf` (`identity.ts:101-108`).

| ID | State | Trigger (route; Core answer) | Result | Copy |
|---|---|---|---|---|
| P1 | Email step | GET `/sign-in` | 200 | §4.2 |
| P2 | Signed out | `?signed_out=1` | 200, notice | "You are signed out." |
| P3 | Signed out everywhere | `?signed_out=all` (new value) | 200, notice | "You are signed out everywhere. Every session of this account has ended." |
| P4 | Sign-out not confirmed | `?signed_out=unconfirmed` (new value) | 200, warning notice | "You are signed out in this browser. TravelMudra did not confirm that your other sessions ended. Sign in and choose "Sign out everywhere" again." |
| P5 | Session ended | `?session_ended=1` (new value, §5) | 200, notice | "Your session ended. Sign in again to continue." No reason is stated. |
| P6 | Signed out after email change | `?email_changed=1` (existing, `identity-routes.ts:96`) | 200, notice | "Sign in with your new email address." (UI-PLAN §3.1) |
| P7 | Address format | `validation_failed` / `email_invalid` | 422, field `email` | "Enter an email address in the form name@example.com." |
| P8 | Synthetic domain refused | `synthetic_email_refused` | 422, field `email` | "Addresses at the synthetic test domain cannot be used in this installation." |
| P9 | Check expired (S10) | `bot_check_failed`, proof expiry ≤ now | 422, field `altcha` | §4.5 step 1 |
| P10 | Check did not pass | `bot_check_failed`, other | 422, field `altcha` | §4.5 step 1 |
| P11 | JavaScript off | empty `altcha` | 422, field `altcha` | "This check needs JavaScript, which is off in this browser. Turn on JavaScript for this site, reload the page and send the form again." (existing facts) |
| P12 | Form already used (S8) | `conflict_operation_key` | 409, form-level | §4.4 |
| P13 | Too many requests | `rate_limited` / `rate_limited` | 429, form-level | "Too many code requests in a short time for this address or from this browser. You cannot request a code for now. Try again later." No minutes are named: the window is configuration the page cannot read. |
| P14 | Sign-in at its limit | `capacity_limited` / `rate_limited` (global budget) | 503, form-level | "Sign-in codes cannot be requested now because sign-in is at its limit. Nothing was sent. Try again later." |
| P15 | A required service unavailable | `unavailable_dependency` (`rate_limiter_unavailable`, `core_unavailable`) | 503, form-level CMP-10 | "Sending sign-in codes is unavailable until the sign-in service is back. Nothing was sent. Owner: TravelMudra operations. Try again later." Today this text lands on the email field (`identity-routes.ts:37`). |
| P16 | Request outcome unknown | `outcome_unknown` | 503, re-render with the **same** `_op` | "TravelMudra did not confirm your request. If a code arrives, you can use it. If no code arrives, send the request again with this form: if the first request was recorded, no second code is sent." Same `_op` and same address replay a recorded request (K-STD); a new challenge covers an unrecorded one. Today the answer is the generic error page (`server.ts:667-669`). |
| P17 | Maintenance | `maintenance` (GET or POST) | 503, SH-02 | §5. The request handler MUST send `maintenance` and `unauthenticated` to the shell error path, not re-render the form. |
| P18 | Code step (S9) | GET `/sign-in/verify` | 200 | §4.2, §4.3 |
| P19 | Code did not work | Accepted with `summary.result = 'invalid'` (wrong, expired on first try, decoy) or rejected `otp_invalid_or_expired` (no live challenge: used, exhausted, expired earlier, another browser) (`sign-in.ts:80,86,129,175-182`) | 422, field `code` | "This code did not work. It may be mistyped, expired, already used, replaced by a newer code, or from another browser. Check the newest email, or request a new code." + link "Request a new code". Core does not tell these cases apart (STOP-03, P2). The text covers expired, used and exhausted truthfully and discloses nothing about the account. |
| P20 | Code format | `validation_failed` / `input_invalid` | 422, field `code` | "Enter the 8-digit code from the email." (existing, `identity-routes.ts:52-56`) |
| P21 | Too many tries | `rate_limited` at verify (`otpVerifyIp`, `otpVerifyBinding`) | 429, form-level | "Too many code tries in a short time. Request a new code later." |
| P22 | Sign-in outcome unknown | `outcome_unknown` | 503, re-render with the **same** `_op` | "TravelMudra did not confirm your sign-in. Enter the code again to check. If the sign-in was already recorded, it cannot open in this browser and you need a new code." Same `_op` and code: a recorded sign-in replays to P23; an unrecorded one runs. |
| P23 | Sign-in not completed | Replayed `signed_in` (`identity-routes.ts:61-64`) | 409 page | Existing: "Sign-in could not be completed in this browser" + "Request a new code". |
| P24 | Signed in | Accepted `signed_in` with `issued` | 303 `/home` (or `next`, §5) | — |
| P25 | Resend | GET `/sign-in?resend=1` | 200, prefilled | §4.3 |

### 4.7 Boundary notices on PUB-02 (UI-PLAN §11.3 template)

| Disclosure | Notice text |
|---|---|
| "Lost access to your email?" (TA) | "Signing in without access to your current email address is unavailable until the product owner approves a recovery rule. TravelMudra staff cannot change your address for you. Owner: product owner." (BS B09, B44; UI-PLAN B-02) |
| "Need an account?" (TA) | "Requesting an account here is unavailable until the product owner selects account eligibility rules. TravelMudra creates travel agent accounts. Owner: product owner." (BS B08, B44; AD-05; UI-PLAN B-01) |
| "Lost your authenticator or work email?" (staff) | "A SuperAdmin can reset your authenticator and send you a new enrolment code. Changing a staff sign-in address is not available in this build; it is a recorded limitation. Owner: product owner." (`identity.ts:335`, reference `staff_email_change_unavailable`) |

The help page (`/sign-in/help`, `identity.ts:200-212`) keeps its sections. Its numbers "10 minutes" and "After 5
wrong tries" (`identity.ts:162,204`) are configuration values (`otp.ttlMs`, `src/platform/config.ts:134-135`; the
attempt limit) that the BFF cannot read. Recommendation (Q-13, P2): remove the numbers, or pin them with a unit test
against the configuration defaults.

### 4.8 Staff path

Same anatomy as §4.2 on the staff instance, with these differences.

- Email step: `h1` "Staff sign-in"; lead "TravelMudra staff sign in with a code sent to their work address and a code
  from their authenticator app." Link "Set up your authenticator" (`/staff/enrol`) stays (`identity.ts:161`).
- Code step: two fields in one form, `code` (CMP-27, "Code from the email", 8 digits) and `totp` (CMP-27,
  "Code from your authenticator app", 6 digits, "A new code appears every 30 seconds."). Line: "If [address] can sign
  in as TravelMudra staff, we sent a code to it. Enter it with the current code from your authenticator app."
- Failure: Core answers `invalid` for a wrong mailed code, a wrong authenticator code, a decoy, an expired challenge
  and a locked second factor (`sign-in.ts:205-232`). Text: "These codes did not work. Check the newest email code and
  the current code in your authenticator app. Repeated wrong authenticator codes can stop sign-in for a while. If
  sign-in keeps failing, ask a SuperAdmin." The page MUST NOT name which code failed: Core does not say, and naming
  it would reveal that the mailed code was right.
- A reused authenticator step is refused `stale_revision` / `totp_invalid` (`sign-in.ts:237-239`): "This
  authenticator code was already used. Wait for the next code and try again." (field `totp`, 409).
- S8, S9, S10, P2 to P5, P13 to P17, P21 to P24 apply. Signed in → `/home` → the first surface's landing
  (`identity-routes.ts:215-216`).

### 4.9 Staff authenticator enrolment

| ID | State | Trigger | Result | Copy and behavior |
|---|---|---|---|---|
| E1 | Enrolment code step | GET `/staff/enrol` | 200 | Existing anatomy (`identity.ts:214-226`). Field `enrolmentCode` (`autocomplete="off"`, mono, full width). `data-reload-on-restore="/staff/enrol"`. |
| E2 | Code invalid, used or expired | `enrolment_invalid_or_expired` (and `input_invalid` mapped to it, `identity-routes.ts:155`) | 422, field | Existing: "The enrolment code is invalid, already used or expired. Ask a SuperAdmin to send a new one." |
| E3 | Opened in another request | Replayed, or no `issued` (`identity-routes.ts:159-161`) | 409 page | Existing "Set-up not completed in this browser". |
| E4 | Open outcome unknown | `outcome_unknown` | 503, re-render with the same `_op` | "TravelMudra did not confirm that the enrolment code was opened. Enter the code again to check. If it was already opened, ask a SuperAdmin to send a new one." Today: generic error page. |
| E5 | Setup | GET `/staff/enrol/setup` with an open set-up | 200 | Existing QR, grouped key with copy, `_rev.enrolment` hidden field (`identity.ts:238`), field `totp` (CMP-27), "[n] tries left". `data-reload-on-restore="/staff/enrol/setup"`: after completion, Back reloads, and the server redirects (the set-up session is gone), so the key does not show again from the cache. |
| E6 | No open set-up | `setup === null` | 303 `/staff/enrol` | Existing. |
| E7 | Wrong authenticator code | Accepted, not enrolled, not exhausted | 422, setup again | "The authenticator code was not accepted. Check that the app shows the TravelMudra entry, wait for the next code and try again." The hint shows the current tries left. |
| E8 | Stale revision | `stale_revision` (the set-up changed: a counted attempt in another tab, or a new enrolment code) | **409**, setup again with the current revision and key | "This set-up changed since you opened the page, for example in another tab. Check that your authenticator app holds the key shown below, then enter its current code." Today the handler maps `stale_revision` to `totp_invalid` and answers 422 (`identity-routes.ts:197-201`), which says the code was wrong when it may have been right. |
| E9 | Tries exhausted | `summary.exhausted === true` | 422 page | Existing "Set-up stopped". |
| E10 | Set-up ended | Set-up gone after the POST | 409 page | Existing "Set-up ended". |
| E11 | Enrolled | `summary.result === 'enrolled'` | 303 `/staff/sign-in?enrolled=1` | Existing notice: "Your authenticator is set up. Sign in with your mailed code and an authenticator code." |
| E12 | Confirm outcome unknown | `outcome_unknown` | 503 page | "TravelMudra did not confirm your set-up. Try to sign in with your mailed code and an authenticator code. If sign-in does not work, open the set-up page again; if it has ended, ask a SuperAdmin for a new enrolment code." Links: "Staff sign-in", "Set-up page". |

### 4.10 CMP-27 on PUB-02

One input per code, never split boxes. Paste and autofill work: no script intercepts `paste` or `input`, and the
field has `autocomplete="one-time-code"`. Spaces and hyphens are accepted: the pattern allows them and Core strips
them (`src/core-api/bindings/identity.ts:37-38,111,120,141`). The page MUST NOT submit by itself when the eighth
digit arrives (predictable behavior). Full specification in §7.8.

## 5. SH-02 access and service state

SH-02 is not one route. It is the set of full-page answers below. Each keeps the environment label, the title
prefix and one `h1`. A signed-in viewer gets them inside their shell (`status.ts:77-80`); others get
`statusDocument`. No variant shows an object name, an id echo, a group, a country or a count (SH-R02).

| Variant | Trigger today | Page today (file:line) | Status | Target copy (`h1` · body · action) | Change |
|---|---|---|---|---|---|
| Denied | `not_found_or_forbidden` from Core (any code); a route-parameter parse failure; a session without the route's surface (`server.ts:505-509,518-523`) | `notFoundPage` (`status.ts:100-105`): "Page not found" / "The page does not exist or you do not have access to it." | 404 | "You do not have access to this page" · "If you followed a link, it may be wrong, or your access may have changed. Nothing about the page is shown." · "Go to your home" (signed in) or "Sign in" (signed out) | Copy only. |
| Not found | Unknown path; malformed id (`server.ts:363-375`, `:505-509`) | Same page | 404 | Byte for byte the same page as Denied (SH-R02; WP01-A74; `test/system/web-shell.test.ts:111`) | None beyond the copy. |
| Access changed | Core answers reassignment, revocation and suspension of a grant with the same `access_denied` | Same page | 404 | Same as Denied. The sentence "your access may have changed" covers SH-R04. | Deviation D-04 (P2, Q-15): a distinct "Your access changed" page would need Core to say why, and that would tell a requester that the object exists. |
| Session ended | `unauthenticated` (`server.ts:238`) or no session on a private surface (`server.ts:517,525`) | 303 to sign-in without a message | 303 | 303 to the sign-in page of this instance with `?session_ended=1` **when the request carried a session cookie**; plain 303 otherwise. The sign-in page shows P5. | `server.ts` (session unit) |
| Signed out | POST `/sign-out` | 303 `?signed_out=1` (`identity-routes.ts:79-82`) | 303 | P2, P3 or P4 by the command's answer: accepted `this` → `signed_out=1`; accepted `all` → `signed_out=all`; rejected or unknown with `all` → `signed_out=unconfirmed`; rejected or unknown with `this` → `signed_out=1` (the cookie is cleared, which is the fact the page states). Today the answer is ignored (`identity-routes.ts:81`). | Q-02 finding F-01 (P1, worked in WP-01) |
| Maintenance or restore | `maintenance` / `installation_closed` (closed admission; a restore that ends closed) | `maintenancePage` (`status.ts:108-118`): "Paused for maintenance"; "TravelMudra is paused for planned maintenance. Work you already submitted is kept; nothing is lost." | 503, `Retry-After` | "TravelMudra is closed for maintenance" · "You cannot sign in or make changes while it is closed. No reopening time is published here." · no action, no restore, no reopen, no resend control (UX §8.3; BS B39, B40) | Copy. "Planned" and "nothing is lost" are not known facts: after an interval-loss restore (BS B40) accepted work from the lost interval is gone. Finding F-02 (P1, worked in WP-01). |
| Capacity | `capacity_limited` (`capacity_*`), the request limiter (`src/apps/shared/app.ts:128-129`) | `errorPage` with "The service is busy. Nothing was saved; try again shortly." (`status.ts:37-41`) | 503 | "TravelMudra is busy" · "This request was not run, so nothing was saved. Try again later." · "Try again" (a link to the same GET address; for a POST, the page offers "Go back to the form" through the browser) | Copy: no "shortly" (no invented wait, BS B38). |
| Too many requests | `rate_limited` | `errorPage` | 429 | "Too many requests" · "Too many requests in a short time. Try again later." | Copy. |
| Restarting | `stale_writer` / `writer_epoch_stale` (`server.ts:328-332`) | `errorPage` "The service is restarting. Try again in a moment." | 503 | Same facts; "Try again later." | Copy. |
| Core unreachable | `unavailable_dependency` / `core_unavailable` | `errorPage` "TravelMudra cannot be reached right now. Nothing was sent, so nothing changed. Try again in a few minutes." | 503 | Same facts (true: the client refuses before delivery, route-map §1.8) | None. |
| Request refused | `csrf_invalid`, `origin_invalid`, `host_invalid` | `refusalPage` (`status.ts:121-125`) | 403 / 421 | Same facts. On the `sign_in` surface the action is "Open the sign-in page again" (`/sign-in` or `/staff/sign-in`), not "Go to the home page" (`status.ts:61-63`) | P2 (Q-16). |
| Request unreadable | `too_large`, `input_invalid`, `invalid_id` | `badRequestPage` (`status.ts:128-133`) | 400 / 413 / 415 | No change | None. |
| Outcome unknown (surfaces without an operation page) | `outcome_unknown` / `commit_unacknowledged` on `sign_in`, `self`, `accounts` (`server.ts:667-669`) | `errorPage` "We could not confirm the result" / "Submit the same form again. It is safe…" (`presentation.ts:608-612`) | 503 | "TravelMudra did not confirm the result" · "Do not start the task again from a new form. Go back to the form you sent and send it again: TravelMudra recognises the same request and does not repeat it." | Copy. Sign-in and enrolment use their own re-renders (P16, P22, E4, E12). |
| Internal error | `internal` | `errorPage` "Something went wrong on our side" (`presentation.ts:613`) | 500 | "The request was not completed" · "An internal error stopped this request. Nothing was confirmed. Try again. If it happens again, note the reference code." | Copy: CR-01 forbids "Something went wrong". |
| Support view active | `conflict_duplicate` / `support_view_active` (`server.ts:519-521`) | `errorPage` | 409 | No change | None. |

PM Q-06: a signed-out request for `/<surface>/operations/:key` already answers 303 to sign-in, because the route's
surface is private and the gate runs before the handler (`server.ts:516-517`). The `notFound` at
`common-routes.ts:37` is unreachable for a signed-out browser. The return to the page after sign-in needs `next`
(below).

SH-R03 return after sign-in (deviation D-03, Q-07, P1). The 303 to sign-in MAY carry `next=[path]` for a GET
request on a private surface. The sign-in pages carry it to the code step as a hidden field `next` (a new field; no
existing field changes). After an accepted sign-in the BFF answers 303 to `next` only when it is a local path
(`isLocalPath`, `server.ts:159-161`) that matches a registered GET route of this instance; otherwise to `/home`. The
target page then authorizes as usual, so an out-of-scope link shows Denied (SH-R03). The path holds only opaque ids
(SH-R06). Acceptance WP01-A53 and A87 need this.

Public pages during maintenance (PM Q-10): the static public pages are built without Core and stay served; the
sign-in pages read Core and show Maintenance. This is the current behavior and the design keeps it.

## 6. OP-10, sign-in and MFA part

Route `self.account`, GET `/account` on both instances, read model `iam.account_page`
(`src/contracts/queries.ts:105-121`); page `accountPage` (`identity.ts:291-341`). TA-12 is the same route; its
address section stays as it is until WP-15.

| Block (reading order) | Content | Source field | Change from today |
|---|---|---|---|
| Header | `h1` "Your account"; freshness "Read at [time] IST" (CMP-12, instance read time, LD-08) | — | Add freshness |
| Who you are | Name, Email address, Role, Status (badge with text), Account reference (copy) | `displayName`, `emailDisplay`, `role`, `status`, `accountId` | Remove "Work areas" (`identity.ts:301-307`): contexts are not listed (AD-12) |
| Authenticator (staff only) | "Set up on [time] IST" or "Not set up"; "To replace your authenticator, ask a SuperAdmin. A SuperAdmin can reset it and send you a new enrolment code." | `mfaEnrolledAt` | Text only. The contract has no "unavailable" value for this field (a null means "Not set up"); if the query fails, the page is the Core-unreachable page. WP01-A70's "status unavailable" fixture cannot occur. |
| Accounting grant (operator, only when held) | Fact: "You hold the accounting grant." CMP-10: "Accounting actions are not yet defined. Owner: product owner." (UI-PLAN §11.3 example; BS B29, B43) | `accountingGrant` | Replaces "Held: it opens Accounts (finance)" (`identity.ts:308`). No link to `/accounts`. When not held, the row is absent. |
| Sessions | Table: Signed in, Last active, Kind, Ends at the latest; "(this browser)" marker. No address or device details. | `sessions[]` | Unchanged facts; the table stacks at narrow width (existing `dataTable`). |
| Sign out | Form `action="/sign-out"` (no `scope` field = this browser), button "Sign out" | — | New on this page (today only in the bar) |
| Sign out everywhere | Existing `confirmDisclosure` with hidden `scope=all` (`identity.ts:322-328`); results P3 or P4 | — | Result copy only (§5 "Signed out") |
| Sign-in address | TA: unchanged (WP-15). Staff: the known-limitation notice (`identity.ts:335`) in the CMP-10 form | — | Copy form only |
| Support view | `readOnly`: lead "Read-only in a support view."; no sign-out and no sign-out-everywhere controls for the viewed account (existing) | `readOnly` | None |

The page MUST NOT show a read marker or "Mark as read" (LD-06). The notices list stays at `/<role>/notices`.

## 7. Command-result patterns

Every component below goes into `src/web/ui/` (new file `results.ts` unless stated), renders escaped `SafeHtml`,
renders "Unavailable" instead of a zero or an invented value (D7), and has a gallery page per state.

### 7.1 CMP-07 Error summary

- Replaces and extends `errorSummary` (`src/web/ui/forms.ts:53-60`).
- Anatomy: `h2` "There is a problem" (or "There are [n] problems"); a list of items in field order. A field item is
  a link to the field id. A form-level item (new) is plain text and marks no field (S8, P13 to P16, P21, P22).
- States: hidden (no item); shown.
- Behavior: after a failed submission the summary receives focus (`tabindex="-1"`, `autofocus`, and the script's
  `ready()` at `enhance.js:751-755`); each link moves focus to its field; entered values stay (the re-render passes
  them back); the field shows the same message inline with `aria-invalid="true"` (`forms.ts:77-92`). Messages come
  from closed tables only; no message states whether an account exists (BS B08).
- Markup:

```html
<div class="error-summary" role="alert" aria-labelledby="[id]-title" tabindex="-1" data-error-summary autofocus>
  <h2 class="error-summary__title" id="[id]-title">There is a problem</h2>
  <ul class="error-summary__list">
    <li><a href="#email">Enter an email address in the form name@example.com.</a></li>
    <li>This form was already used to request a code, so nothing new was sent. …</li>
  </ul>
</div>
```

- Change: `FieldError.fieldId` becomes optional; the summary id becomes a parameter (default `error-summary`), so
  that two forms on one page do not share an id.

### 7.2 CMP-08 Operation receipt

Facts. A success today is a 303 to `[page]?done=[code]`; the page maps the code to a one-line flash from a closed
list (`src/apps/shared/core/shared.ts:363-368`; 24 call sites, 54 `?done=` locations, route-map §5.2). The flash has
no command identity, no time and no resulting facts. At POST time the BFF holds `outcome.operationId`,
`outcome.replayed` and `outcome.result {resource, summary}` (`src/contracts/commands.ts:50-58`) and the operation key
(`ctx.operationKey`, `server.ts` post context). `core.operation {operationKey}` answers `accepted {result: {resource,
summary}}`, re-authorized under the viewer's current access (`queries.ts:115-130`;
`src/core-api/bindings/kernel.ts:26-45`). It returns no command name and no accepted time, although the operation
record holds both (`sys_operations.command_name`, `accepted_at`, `migrations/0001_kernel.sql:212,217`): the kernel's
lookup selects the command name but returns only the replayed outcome (`src/kernel/command.ts:194-221,406-424`).

Design without a Core change.

1. A rebuilt page redirects an accepted command to `[page]?done=[code]&op=[operationKey]` through a new helper
   `receiptLocation(path, done, operationKey)` in `shared.ts`. The key is an opaque identity; AD-04 allows it in the
   address. Old pages keep `?done=` until rebuilt (LD-02); the helper is opt-in, so no existing redirect changes.
2. The page validates `op` with the operation-key pattern (`common-routes.ts:13`) and `done` against its closed
   list. Then it reads `core.operation {operationKey: op}` inside a guard: a failed read MUST NOT break the page.
3. Rendering by answer:
   - `accepted`: the receipt with title (from the `done` list), "Request reference [key]" as a link to
     `/<surface>/operations/[key]` with a copy button, "Recorded once. Sending the same form again does not repeat
     it.", and the resulting facts. Resulting facts come from the page's own read model (the page already reads the
     resource) and from `summary` through a per-command closed formatter; unknown summary keys are not shown.
   - Read refused (`not_found_or_forbidden`): no receipt (the viewer's access changed; SH-R05).
   - Read unavailable (Core or capacity): "Your request was accepted. Its receipt is unavailable now." plus the
     reference link. The `done` code alone grants nothing; a hand-typed `done` can only mislead its own typist.
   - `in_progress`, `no_record_yet` or `not_recorded` (only reachable with a hand-made URL): no receipt.
4. Accepted time: **not shown** until STOP-01 is served. Where the page's read model carries the event time of the
   resulting fact (for example a creation time), the receipt shows it with its own label ("Created [time] IST"),
   never as "Accepted at".
5. The document title starts with the receipt title (§2.1 R14). The live region stays silent at load.

States: accepted; partially accepted per item (a list of items, each with its own result line; for bulk commands
later); rejected → CMP-07 on the re-rendered form, never a receipt; unresolved → CMP-13.

```html
<section class="receipt" aria-labelledby="receipt-title">
  <h2 id="receipt-title">Group created</h2>
  <dl class="receipt__facts">
    <div><dt>Request reference</dt><dd><a href="/ta/operations/01J…"><code class="id">01J…</code></a> [Copy]</dd></div>
    <div><dt>Recorded</dt><dd>Once. Sending the same form again does not repeat it.</dd></div>
    <div><dt>Group</dt><dd><a href="/ta/groups/grp_…">SYN Spring trip</a></dd></div>
  </dl>
</section>
```

Replaces: `doneFlash` for rebuilt pages. `flash` stays for non-command notices (signed out, enrolled).

### 7.3 CMP-10 Policy boundary notice

- Extends `callout({kind: 'unavailable', boundary})` (`src/web/ui/feedback.ts:43-64`) with a fixed sentence form.
- Anatomy: short label (from `boundaryPresentation`, for example "Not available yet"); the §11.3 sentence "[Action]
  is unavailable until [specific policy or evidence] is [approved / recorded]."; "Owner: [owner or 'not yet named']";
  an optional route link; for staff only, the reference code.
- States: policy pending; evidence pending; owner unknown ("Owner: not yet named").
- Association: the notice has an id; an affected visible control references it with `aria-describedby` and, when
  it is shown unavailable, `aria-disabled="true"` (AC-13). A role-forbidden action is not rendered (SH-R08).
- API: `boundaryNotice({id, action, until, owner, route?, kind, reference?, headingLevel?})`.

```html
<div class="callout" data-tone="unavailable" id="bn-lost-email" role="note">
  <p class="callout__boundary">Not available yet</p>
  <p>Signing in without access to your current email address is unavailable until the product owner approves a recovery rule.</p>
  <p class="callout__owner">Owner: product owner</p>
</div>
```

### 7.4 CMP-12 Freshness indicator

Inputs and text (LD-08; AD-10; UI-PLAN §1.3 S5).

| Input | Text |
|---|---|
| Authoritative read | "Read at [time] IST" (`ctx.now`, the instance read time) |
| Operation status read | "Checked at [time] IST" |
| Projection, `asOf.healthy` and `lagMs === 0` | "Up to date when read at [time] IST" |
| Projection, `healthy` and `lagMs > 0` | "Behind by [n] s when read at [time] IST" ([n] = `lagMs`/1000, rounded up) |
| Projection, `healthy === false` or `lagMs === null` | "Freshness unavailable" |

The projection read models carry `{asOfSeq, healthy, lagMs}` and no time (`src/contracts/views-cases.ts:31`), so
"As of [time] IST" is not possible without STOP-02. The page MUST NOT compute an as-of time from the lag. The page
MUST NOT apply its own age threshold (AD-10). Text, not an icon only.

```html
<p class="freshness" data-freshness="lag"><span class="visually-hidden">Data freshness: </span>Behind by 42 s when read at <time datetime="2026-10-12T10:00:00.000Z">12 Oct 2026, 3:30 pm IST</time></p>
```

New component; no helper exists today. It goes on the breadcrumb row through `pageHeader({freshness})` (§2.1 R12).

### 7.5 CMP-13 Unresolved command banner and the operation status page

Facts. Route `/<ta|ops|admin>/operations/:operationKey` (`common-routes.ts:28-46`), reached by the 303 that
`respond` sends for `outcome_unknown` on those surfaces (`server.ts:667-668`). It reads `core.operation` and renders
four outcomes (`src/web/pages/operation.ts:42-81`) with a "Check again" link. `resultHref` is always null
(`common-routes.ts:40`). A key that the viewer cannot read answers the uniform 404 (`kernel.ts:42-44`). A refused
command writes nothing (`sign-in.ts:11`; B35), so this page can never show a rejection with reasons: a rejection is
shown on the re-rendered form at POST time (C2).

Target (UI-PLAN §1.1 UNR, §1.4 C4, CMP-13): "Checking the original result", "Check status", no new submission of
the same intent, no external repeat.

| Outcome | `h1` and banner title | Body | Actions |
|---|---|---|---|
| `in_progress` | "Checking the original result" | "Request [reference] is still being processed. It may still be recorded. Do not send it again." | "Check status" |
| `no_record_yet` | "Checking the original result" | "Nothing is recorded for request [reference] so far. It may still be recorded. Check its status again before you do anything else." | "Check status" |
| `not_recorded` | "Request not recorded" | "Nothing was recorded for request [reference], and it can no longer be recorded. You can start the task again." | "Go to your home" |
| `accepted` | "Request recorded" | "Request [reference] was recorded once. Nothing more is needed for this request." Resulting facts as in CMP-08. | "Open the result" when a page exists for `result.resource` (new closed map `resultHrefOf(surface, resource)` using `href()` and `hasPage`: application, group, document version, incident, notice, account) |
| Read unavailable (new) | "Status unavailable" | "TravelMudra cannot check request [reference] now. Do not send the request again. Check its status later." | "Check status" (status 503) |
| Read refused | — | Uniform 404 (Denied) | — |

"Check status" is a GET form to the same address (`<form method="get" action="[self]"><button>Check status</button>`),
so it works without JavaScript, never changes the address (WP01-A85), and never posts. The freshness line reads
"Checked at [time] IST". The existing copy "Submitting the same form again, with this same reference, never repeats a
request." (`operation.ts:68`) MUST go: it invites a resubmission from a form that may carry a new key. The command
name cannot be shown until STOP-01.

The CMP-13 component (`unresolvedBanner`) is the banner of the first two rows; later packages embed it where a page
holds an unresolved item (bulk, BU-14).

### 7.6 CMP-14 Stale revision comparison

- New component `staleComparison({fields: [{label, yours, current}], changedBy?, changedAt?})`.
- Anatomy: title "Changed since your review"; a table (header row Field / Your unsent value / Current value);
  stacked label-value rows at narrow width (the existing `dataTable` behavior); "Review current information" as the
  primary action. Who changed it and when show only when the read model carries those facts; otherwise the rows are
  absent (not "unknown").
- Data: the refusal `stale_revision` carries no changed facts (`TmErrorShape`: category, code, blockers, field
  errors, existing). The page re-reads the current values and shows them beside the user's unsent input.
- WP-01 use: none with a value table. The enrolment set-up is the only revision in WP-01, and its "value" is a
  secret key, so E8 uses a message, not a comparison. First consumer: WP-03 (Save draft section).

### 7.7 CMP-23 Environment label

Specified in §2.1 R1. Markup:

```html
<header class="page-header-region">
  <p class="env-label"><svg class="icon" aria-hidden="true">…</svg><strong>Test environment.</strong> Synthetic data only.</p>
  …
</header>
<title>[TEST] Sign in · TravelMudra</title>
```

States: test (rendered); production (absent). Replaces `environmentBanner` (`chrome.ts:79-82`) and the `aside`
markup (`shell.ts:257-260`).

### 7.8 CMP-27 OTP code field

- New helper `otpField({id, name, label, digits, hint, error?})` in `forms.ts`, built on `textField`.
- Attributes: `type="text"`, `inputmode="numeric"`, `autocomplete="one-time-code"`, `autocapitalize="off"`,
  `spellcheck="false"`, `pattern="[0-9 \-]{[d],[d+4]}"`, `maxlength=[d+4]`, `required`, monospaced class with wider
  letter spacing, `aria-describedby` hint and error, `data-pattern-message="Enter the [d]-digit code from …"`.
- States: empty; filled; refused (P19, the combined "did not work" text: expired and locked are not distinguishable,
  STOP-03); format error (P20).
- Rules: one input; no split boxes; no script on paste or input; no submit on the last digit; the value is never
  echoed back after a refusal.

```html
<div class="field field--otp">
  <label class="field__label" for="code">Sign-in code from the email</label>
  <p class="field__hint" id="code-hint">8 digits. You can paste it. Spaces are ignored.</p>
  <p class="field__error" id="code-error" data-field-error hidden></p>
  <input class="input input--otp input--mono" id="code" name="code" type="text" inputmode="numeric"
    autocomplete="one-time-code" autocapitalize="off" spellcheck="false" pattern="[0-9 \-]{8,12}" maxlength="12"
    required aria-describedby="code-hint code-error" data-pattern-message="Enter the 8-digit code from the email.">
</div>
```

Replaces the `textField` calls at `identity.ts:174-182,239-242`.

## 8. Hostile-state analysis (prompt rule 8)

"Today" says whether the current code already gives the required behavior.

| Page | Hostile state | Required behavior | Today |
|---|---|---|---|
| Email step (TA, staff) | Nth identical submission, same `_op`, same address | Replay: 303 to the code step; no second code (K-OTP; `sign-in.ts:140`) | Yes |
| Email step | Same `_op`, another address (Back, UAT-01) | 409 fresh form, form-level text, address kept, field not red (§4.4) | No (red field, stale form) |
| Email step | New `_op`, same address, repeated | A new code replaces the old one; at the per-address limit P13 (429) | Yes (copy changes) |
| Email step | Challenge older than its lifetime | P9 text, fresh challenge, address kept (§4.5) | No (generic text) |
| Email step | Form restored from the back/forward cache | Script reloads a fresh form (§4.4) | No |
| Email step | Request reached Core, answer lost | P16: same `_op`, new challenge, no false claim | No (generic error page) |
| Email step | Sign-in budget or limiter store down | P14 / P15 form-level; nothing sent | Partly (text on the email field) |
| Email step | Two tabs request codes for two addresses | The newest code wins; the code step's address follows the newest request; the old tab's code fails with P19, whose text names "replaced by a newer code" | Partly |
| Code step | Nth identical submission after success | Signed-in browser: 303 `/home`; cookie lost: P23 (409); no second session | Yes |
| Code step | Wrong code N times | Each counts once (accepted `invalid`); after the limit, no live challenge (P19); the page discloses nothing | Yes (copy changes) |
| Code step | Code typed in another browser | P19 (binding to the pre-session) | Yes (copy changes) |
| Code step | Answer lost | P22 | No |
| Code step | Back after success | Script reload → 303 `/home` (WP01-A46) | No |
| Enrolment set-up | Stale `_rev.enrolment` (two tabs; new enrolment code) | E8: 409, current key and revision, honest text | No (says the code was wrong, 422) |
| Enrolment set-up | Back after completion shows the key from the cache | Script reload → redirect; without JavaScript the browser decides (Chrome evicts a no-store page from its cache when the cookies change, and completion clears the set-up session cookie) | No; Q-17 (P2) |
| Account page | Sign out everywhere while Core refuses or loses the answer | P4: "did not confirm that your other sessions ended" | No (says "You are signed out." either way; F-01, P1) |
| Account page | Session revoked elsewhere, then the page is reloaded | 303 sign-in with P5 | Partly (no message) |
| Any signed-in page | Access revoked mid-task | Next read or command: Denied (404) with no object facts; old operation links deny (SH-R04, SH-R05; `kernel.ts:42-44`) | Yes |
| Any signed-in page | Count unreadable | Visible "Unavailable" on the item, never blank or zero | No (blank) |
| Any signed-in page | Count cached for 20 s (`src/apps/shared/nav-counts.ts:24`) | A count is an attention hint; the destination page shows the authoritative list with its freshness | Yes (P2 note) |
| Operation status | Nth "Check status" | GET only; same key; no new command | Yes |
| Operation status | Core unreachable | "Status unavailable" in the page, 503, "Check status"; no "Accepted", no invitation to resubmit | No (generic error page) |
| Operation status | Key of another person | Uniform 404 | Yes |
| Receipt | Bookmarked receipt reopened later | Shows the reference and the facts; without STOP-01 it cannot show when it was accepted, so it says "Recorded once", never "just now" | New |
| All | Long display name (200 characters, `queries.ts:44`) | Account menu summary truncates visually with the full name in the DOM and in the open menu; the account page wraps | Partly (name hidden at ≤ 40rem, `layout.css:357-359`) |
| All | Long email address (320 characters) | Wraps anywhere on the code step, the account page and the account menu; no sideways scroll | Partly |
| All | 320 px width and 1280 px at 400% zoom | Phone layout (§2.4); no two-dimensional scroll except labelled table regions (AC-04); QR image 240 px fits; the key wraps in groups of four | Partly (breakpoints differ) |
| All | JavaScript off | Every page works. Sign-in cannot send a code: the bot check needs JavaScript (P11) and there is no bypass (BS B08). Menus, Help and the account menu are `<details>`. Summary focus by `autofocus`. S8 and S10 by the server layer. | Yes for the base; the new parts are designed for it |
| All | Clock skew between the BFF and Core | S10 text choice may fall back to P10; the timer uses relative time; no decision depends on the BFF clock | New |
| Sign-in | Maintenance starts between the form and the submit | P17: Maintenance page (503), no form | No (form re-render with an error on the email field) |

## 9. V23 proof scenario

V23: "Projection outage reports uncertainty without fabricated zero/success; authoritative commands continue only
when required current evidence/controls work. Maintenance/restore remains closed." (UX §12; BS B33, B38 to B40.)

Facts that limit the proof on `lane-ui`: `scripts/uat/uat.py` has no admission, fault or projection control (its
commands are `check`, `up`, `deploy`, `status`, `stop`, `start`, `cleanup`, `adopt`, `ports`, `suggest-ports`,
`uat.py:540-833`); lane prompts forbid `tm` steps by hand. Core-side behavior is already proven:
`test/views/audit-health.test.ts:46-142` (elevation refused while the audit projection fails or lags; containment
continues; recovery) and `test/system/lifecycle.test.ts:88` (closed admission: every page that reaches Core is the
maintenance page until the opening).

| Part | Claim | Where | How |
|---|---|---|---|
| V23-1 | No fabricated zero in the shell | `lane-ui` and test | `lane-ui`: on every page of each role, no `.nav-count` reads "0". Test (shell unit): a count map with `null` renders "Unavailable"; `0` renders nothing; an absent uncounted item renders nothing. |
| V23-2 | Projection uncertainty is stated | Test | Unit tests of CMP-12 for the five inputs of §7.4. A BFF test with a scripted Core that answers a `views.*` query with `{healthy: false, lagMs: null}` shows "Freshness unavailable" and keeps the page's command forms (the server decides). WP-01 has no projection-backed page of its own; the system-level proof on a real list moves to the first package that rebuilds one (WP-03 TA-06 or WP-09), and the WP-01 record says so. |
| V23-3 | Commands continue only when their controls work | Existing test | `test/views/audit-health.test.ts` (Core). No WP-01 change. |
| V23-4 | Unresolved command is reconciled, not repeated | Test | System test with fault injection on the command acknowledgement (the pattern of `test/system/web-shell.test.ts:268-282`): the 303 to the operation page; "Checking the original result"; "Check status" reads the same key; no second effect in the database. |
| V23-5 | Maintenance is closed, with no case data | `lane-ui` if admission can be closed; test always | Test: extend `lifecycle.test.ts:88` to assert the new copy, the environment label, no rail, no account name, no application or group text, no form except none, and status 503 on a signed-in page and a sign-in page. `lane-ui`: only if the orchestrator closes and opens admission (`tm admission close/open` is an installation step the lane may not run) or adds a `uat.py` subcommand; proposal P-W01 to the orchestrator (PM Q-01). |
| V23-6 | Restore stays closed | Test | `lifecycle.test.ts` (restore ends closed) plus the copy assertion; no lane step. |

Recommendation for PM Q-01 (P0 in the PM's ranking): accept the split above in the WP-01 record. `L` items: V23-1 and,
with the orchestrator, V23-5. `T` items: V23-2 to V23-6.

## 10. Implementation breakdown

Work units own disjoint files. Phase A runs U1, U2 and U3 in parallel. Phase B runs U4 and U5 in parallel after
phase A is integrated. Gallery pages of U3, U4 and U5 go into new modules under `scripts/dev/gallery/`; the architect
adds their registration lines to `scripts/dev/gallery-pages.ts` at integration. `DESIGN.md` is edited once, at the
end, by the architect from each unit's notes.

| Unit | Files (change or add) | Tests added or updated |
|---|---|---|
| **U1 Tokens and base** (LD-09) | `static/css/tokens.css`; `static/css/base.css`; `static/css/fonts.css` only if Max chooses system sans | `test/unit/web/contrast.test.ts` (hex parsing, new pairs); gallery axe and contrast runs (existing) |
| **U2 Shell** (SH-01) | `src/web/ui/shell.ts` (destinations, top bar, help panel, account menu, context selector, environment label, title prefix); `src/web/pages/signed-in.ts` (destinations, current destination, tabs, `accounts` filter, `null` counts); `src/web/pages/chrome.ts` (support-view banner in the header; environment label); `src/web/pages/layout.ts` (`statusDocument`: environment label, title prefix, announcement region; new required parameter `environment`) and the one-line call-site updates in `src/web/pages/status.ts:79` and `src/apps/shared/pages/identity.ts:112`; `src/apps/shared/server.ts` (`PageEnv.environment` at `server.ts:192`) and `src/apps/shared/app.ts:128-129` (capacity page environment); `src/apps/shared/nav-counts.ts` (`null` for an unreadable count); `static/css/layout.css`; `scripts/dev/gallery-pages.ts` (shell demos) | `test/unit/web/signed-in.test.ts` (rewrite of the nav, banner and switch cases `:43-97`); `test/unit/web/components.test.ts` (shell cases `:145-218` move to a new `test/unit/web/shell.test.ts`); `test/unit/nav-counts.test.ts:281-295` (selectors; "Unavailable"); `test/ui/gallery.test.ts:574-632` (nav and menu tests; no summed count); `test/system/flows.test.ts:44,51,82`; `test/system/browser.test.ts:91,182-192`; `test/system/case-work.test.ts:60`; new: transitional-member list test, environment label and "[TEST]" on all three document builders, production render without them |
| **U3 Result components** | New `src/web/ui/results.ts` (CMP-08 `operationReceipt`, CMP-10 `boundaryNotice`, CMP-12 `freshness`, CMP-13 `unresolvedBanner`, CMP-14 `staleComparison`); `src/web/ui/forms.ts` (CMP-07 form-level items and id parameter; CMP-27 `otpField`); `src/web/ui/page.ts` (`pageHeader({freshness})`); `src/web/ui/index.ts`; `static/css/components.css`; `static/js/enhance.js` (`data-reload-on-restore`, `data-check-expires-in`, Escape and focus-out closing of the help panel and the account menu); `src/apps/shared/core/shared.ts` (`receiptLocation`, receipt read guard); new `scripts/dev/gallery/results.ts` | New `test/unit/web/results.test.ts` (every state of CMP-07, 08, 10, 12, 13, 14, 23 markup, 27); new `test/ui/results.test.ts` (back/forward restore reloads a marked form; the bot-check timer reveals its notice; Escape closes Help) |
| **U4 Identity pages** (PUB-02, OP-10, sign out) | `src/apps/shared/identity-routes.ts`; `src/apps/shared/pages/identity.ts` (except the line U2 changes); new `src/apps/shared/signin-address.ts` (sealed cookie); `src/apps/shared/surfaces.ts` (cookie names); `src/apps/shared/server.ts` (`session_ended`, `next`, the cookie accessor) — after U2; new `scripts/dev/gallery/sign-in.ts` | `test/system/sign-in.test.ts` (update `:80` text; new cases: S8 Back conflict gives a fresh 409 form with the address kept; S9 line with and without the cookie; S10 with a clock past the challenge expiry; P15, P16, P22; sign-out answers P3 and P4); `test/system/flows.test.ts:145,193-198` stay valid (`enrolled=1`, `signed_out=1` kept); new `test/unit/web/sign-in-pages.test.ts` (copy, no account disclosure, staff path, enrolment E8) |
| **U5 Status and operation pages** (SH-02, CMP-13 host) | `src/web/pages/status.ts`; `src/web/pages/operation.ts`; `src/apps/shared/common-routes.ts` (`resultHrefOf`, read-unavailable state); `src/web/ui/presentation.ts` (the error table at `:589-614` only); new `scripts/dev/gallery/status.ts` | `test/system/web-shell.test.ts:244-282` (new operation copy; "Status unavailable" case); `test/system/lifecycle.test.ts:61,78` (maintenance copy; V23-5 assertions); `test/system/capacity-pages.test.ts` (copy); new `test/unit/web/status-pages.test.ts` (Denied equals Not found byte for byte; no echo) |

Existing tests that pin behavior this design changes:

- `test/unit/web/signed-in.test.ts:43-97`: nav hrefs, `aside.env-banner` with the label "Installation", the switch
  label "Your work areas", per-item counts and the menu total "3", the `home` values, "User accounts".
- `test/unit/web/components.test.ts:145,197-218`: `data-surface` per surface (the attribute stays), nav menu
  counts, the switch and `.brand__surface`.
- `test/unit/nav-counts.test.ts:281-295`: count selectors and "a count that could not be read is left out".
- `test/ui/gallery.test.ts:239-266` (font, only with system sans), `:584-632` (counts in view, surface switch, menu).
- `test/system/browser.test.ts:91,182-192`; `test/system/flows.test.ts:44,51,82`; `test/system/case-work.test.ts:60`.
- `test/system/web-shell.test.ts:251-282`: "Your request was accepted", "No record of this request yet", "Check
  this page again in a minute before you submit anything again", "Do not submit the form again", "still being
  processed".
- `test/system/lifecycle.test.ts:61,78`: "Paused for maintenance".
- `test/system/sign-in.test.ts:80`: "This verification needs JavaScript" (keep the sentence or update it).
- `test/system/intake-pages.test.ts:106` ("verification did not pass") is the intake page, not WP-01; no change.

Form protocol kept: every `action` path; `_csrf`, `_op`, `_rev.enrolment`; `altcha-widget[challenge]` and the field
`altcha`; the fields `email`, `code`, `totp`, `enrolmentCode`, `scope`. Additions: the hidden field `next` (D-03); the
query values `signed_out=all|unconfirmed`, `session_ended=1`, `change=1`, `resend=1`, `next`, and later `op`; the cookie
of D-02; the data attributes `data-reload-on-restore`, `data-check-expires-in`.

Dependencies:

- D-WP20: the public site document (`src/web/public/site.ts`) needs the environment label and "[TEST]" title prefix
  (UI-PLAN §2.1 "public pages included"). WP-20 owns that file. `PublicSiteOptions` gets an `environment` value from
  the edge instance (`src/apps/edge/instance.ts:103`); the SEO check CLI (`src/cli/seo/check.ts:89`) passes
  `production`.
- The LD-11 harness types into `#email`, `#code` and `#totp`; the ids do not change.
- U2 changes the `statusDocument` signature; U4 and U5 start after U2 is integrated.

## 11. Open questions, deviations, findings and STOP items

Ranks follow PRI-20260930-01: P0 blocks the main path or risks irreversible harm; P1 goes to Max (here: to the
architect under LD-12, then to Max's end review); P2 is parked.

### 11.1 Findings worked in this design (no decision needed)

| ID | Rank | Finding | Scenario | Design |
|---|---|---|---|---|
| F-01 | P1 | Sign out everywhere ignores the command's answer (`identity-routes.ts:81`) | A TA who lost a phone selects "Sign out everywhere" while Core is at a capacity limit. The page says "You are signed out." The lost phone keeps its session until it expires, and the TA believes it is closed. | P3 / P4 by the answer (§5) |
| F-02 | P1 | The maintenance page claims "planned" and "nothing is lost" (`status.ts:115`) | After an interval-loss restore (BS B40), a TA reads "nothing is lost" and does not re-check a submission that the restore removed. | §5 maintenance copy |
| F-03 | P1 | Sign-in refusals that are not about the address mark the email field (`identity-routes.ts:37`) | UAT-01: a reused form shows the address in red; the TA retypes a correct address. | Form-level items (§7.1) |
| F-04 | P1 | The operation page invites a resubmission (`operation.ts:68`) | A TA reads "Submitting the same form again … never repeats a request", opens the form page again (new key) and creates a second group. | §7.5 copy |
| F-05 | P2 | "Something went wrong on our side" (`presentation.ts:613`) breaks CR-01 | — | §5 copy |
| F-06 | P2 | Enrolment stale revision reads as a wrong code (`identity-routes.ts:200`) | A staff member with two tabs is told the correct code was wrong and retries until the set-up stops. | E8 |
| F-07 | P2 | The menu summary adds counts of different units (`shell.ts:191`) | An operator reads "5" and cannot tell 5 of what. | §2.2 Counts |

### 11.2 Open questions and deviations for the architect

| ID | Rank | Question or deviation | Concrete scenario | Recommendation |
|---|---|---|---|---|
| Q-01 | P1 | STOP-01: receipt and status page without command name and accepted time | A TA creates a group; the receipt shows the reference and the group, but not when it was accepted. Reopened from a bookmark a week later, it does not show its age. WP01-A82 ("command name, accepted time") fails. | Route STOP-01 (§11.3). Until served, accept the receipt of §7.2 and record WP01-A82 as partly met. |
| Q-02 | P1 | D-06: keep Atkinson Hyperlegible instead of system sans (LD-09 option C) | Max compares the product with UX §7.2 and finds a non-system family without a C16 record. | Option C; one-line revert path (§3.5). |
| Q-03 | P1 | D-02: sealed address cookie for S9 | Without it, the code step cannot name the address and S9 fails. With it, the typed address stays in an encrypted, HttpOnly cookie for up to 15 minutes on a shared computer, and the prefilled form shows it to the next person at that computer within that time. | Adopt; 15-minute lifetime; cleared on sign-in. |
| Q-04 | P1 | Retire `/accounts` (AD-12; LD-02 needs Max) | After WP-01 an operator with the grant opens a bookmarked `/accounts` and sees an "Accounts" area that AD-12 says is not a context. | Retire with Max's decision; keep until then. |
| Q-05 | P1 | Search text in the address: `/ta/search?q=` and `/admin/search?q=` (passport numbers, names) against SH-R06 / RF-12 | A TA searches by passport number on a shared office computer; the number stays in the browser history and address autocomplete. | WP-01 links to the search pages and adds no input. The package that rebuilds the search pages resolves SH-R06 (for example a POST that answers 303 with an opaque, session-bound search token). A POST route needs one command today (`src/web/routes.ts:274`), so this is a route-model question. |
| Q-06 | P1 | Attention counts are computed in page code (`needingAction`, `workNeedingAttention`; route-map §5.1a) and mix units | An operator's "My work" count adds cases, incidents and packet handovers; the rule can diverge from Core's own view, and the number names no unit (D4, CR-07). | WP-01 shows the counts with the D7 rules of §2.2. A Kind 1 projection "attention by destination" with units is a later proposal; not a WP-01 STOP. |
| Q-07 | P1 | D-03: `next` for SH-R03 (new hidden field and query value) | An operator opens an application link from a notice while signed out and lands on My work after sign-in. WP01-A53 and A87 fail without it. | Adopt in U4 with the checks of §5. |
| Q-08 | P2 | D-13: no cross-instance link on the path choice (AD-08) | A staff member opens the travel-agent page and is told to use the staff address, without a link. | Adopt (PM Q-04 agrees); a staff→edge link would need a platform configuration field. |
| Q-09 | P2 | STOP-03: one combined text for a wrong, expired, used or exhausted code | A TA enters a correct but expired code and reads a list of possible causes instead of "expired". | Accept the combined text (PM Q-07 agrees). |
| Q-10 | P2 | STOP-02: no projection as-of time; LD-08 "As of [time] IST" | A list shows "Behind by 40 s when read at 3:30 pm IST" instead of "As of 3:29 pm IST". | Amend LD-08 to the lag form. |
| Q-11 | P2 | S9 copy "we sent" while mail is a task after commit | The mail provider is down; the page says "we sent a code". | "we are sending a code" if the architect amends S9. |
| Q-12 | P2 | Transitional members: TA "Import issues" under Groups, operator "Read grants" under My work, operator "Services" rail item | An operator looks for read-grant groups under Applications (§2.2) and finds them under My work until WP-07. | Adopt; the unit test lists them; decide operator "Services" (keep or retire). |
| Q-13 | P2 | OTP lifetime and attempt numbers hard-coded in copy (`identity.ts:162,184,204`) | An installation sets `otp.ttlMs` to 15 minutes; the help page still says 10. | Remove the numbers or pin them with a test. |
| Q-14 | P2 | Notices in both the top bar and the rail (TA, operator) | A screen-reader user hears the same count twice per page. | Accept (UX §7.1 and UI-PLAN §2.2 both name it). |
| Q-15 | P2 | D-04: "Access changed" merged into Denied | WP01-A75 expects the words "Your access changed"; the page says "your access may have changed". | Accept: a distinct answer would disclose existence. |
| Q-16 | P2 | CSRF refusal on sign-in links to the public home (`status.ts:61-63`) | A TA whose form expired after 30 minutes (`src/web/security.ts:31`) is sent to the public home, not back to sign-in. | Link to the sign-in page on the `sign_in` surface. |
| Q-17 | P2 | Enrolment key page restorable from the back/forward cache without JavaScript | On a shared computer, Back after enrolment could show the key in a browser that keeps no-store pages and ignores the cookie change. | Script reload (E5); accept the residual. |
| Q-18 | P2 | `Retry-After` values are fixed constants (30 s, `status.ts:24`; 5 s, `app.ts:128`) | A client waits 30 s although the limit lasts 15 minutes. Users do not see the header. | Park. |
| P-W01 | P2 | Proposal to the orchestrator: a `uat.py` admission subcommand (or an orchestrator step) for V23-5 on `lane-ui` | The PM cannot show maintenance on `lane-ui`. | Send to the orchestrator; `uat.py` changes are made on main. |

Deviation register (summary): D-02 sealed cookie (Q-03); D-03 `next` (Q-07); D-04 merged access-changed (Q-15);
D-06 font (Q-02); D-07 top-bar search as a link (Q-05); D-08 destination tabs (ADDED, §2.1 R10); D-09 lag form of
freshness (Q-10); D-10 Help in the page flow without JavaScript, side panel with it (§2.1 R7); D-11 phone menu in the
page flow, not an overlay (§2.1 R11); D-12 combined OTP failure text (Q-09); D-13 no cross-instance link (Q-08).

### 11.3 STOP items

| ID | Kind (DECISIONS §3) | What | Why the UI needs it | Criterion check (Kind 1) | Without it |
|---|---|---|---|---|---|
| STOP-01 | Kind 1 (projection of existing facts) on `core.operation` | Add `commandName` (closed enum of command names) and `acceptedAt` to the `accepted` branch of the answer (`src/contracts/queries.ts:123-130`; binding `src/core-api/bindings/kernel.ts:26-45`). Both exist in `sys_operations` (`migrations/0001_kernel.sql:212,217`). | CMP-08 ("accepted command identity/time", UX §7.4) and the operation status page (WP01-A82) | 1. Both fields are recorded facts; nothing is inferred. 2. Without them the BFF would name the command from its own redirect parameters (a client-side derivation of a fact) and could not show the time at all. 3. Same re-authorization as today (`lookupOperation`); current at load. 4. Named by subject (`core.operation`), reusable by bulk (BU-14). 5 and 6: code comment and register line at implementation. | Receipt without accepted time; status page without command name (§7.2, §7.5). Implementation note: the kernel's lookup selects `command_name` but not `accepted_at` and returns neither (`src/kernel/command.ts:194-221`). If the binding can read the row itself after the kernel's re-authorization, no kernel change is needed; if only a kernel change works, DECISIONS §3 rejects it and the "without" column becomes final. |
| STOP-02 | Kind 1 | Add an as-of time to `zWireAsOf` (`src/contracts/views-cases.ts:31`) | LD-08 "As of [time] IST" | 1. The projector knows the time of the last fact it applied. 2. Removes a client-side computation of a time from the lag. 3, 4: as the existing field. | "Behind by [n] s when read at [time] IST" (§7.4). Recommended: amend LD-08 instead. |
| STOP-03 | Kind 2 (command behavior) | Distinct closed results for an expired, used or exhausted sign-in code in `iam.verify_ta_otp` and `iam.staff_sign_in` | UI-PLAN §3.1 lists "code expired", "used" and "attempts exhausted" as separate states | — (Kind 2: written proposal, independent review, Max decides; default no) | Combined text P19 (§4.6). Recommended: do not raise; the combined text is truthful and discloses nothing. |

No STOP item blocks the WP-01 main path. No P0 item is open in this design.

### 11.4 Alignment with the PM's acceptance checklist

| Item | Design position |
|---|---|
| WP01-A21 | Met: visible "Unavailable" for an unreadable count (§2.2; agrees with PM Q-03). |
| WP01-A22 | The signed-out landing is PUB-02 (`/sign-in?signed_out=1`), which UI-PLAN §3.1 lists under Public. The static public home cannot show a per-visitor notice. Proposed reading of "public entry": PUB-02. |
| WP01-A26 | Met by §4.1 (no staff link). |
| WP01-A53, A87 | Need D-03 (Q-07). |
| WP01-A70 | The "authenticator status unavailable" fixture cannot occur: the field is a nullable date. The item SHOULD test "Not set up" and a failed read instead. |
| WP01-A72 | Conflict: AD-12 requires the accounting-grant notice on OP-10, and the current text ("it opens Accounts (finance)") becomes false when WP-01 removes the context. WP-01 changes that row (§6). |
| WP01-A75 | Denied copy covers it with "your access may have changed" (D-04). |
| WP01-A82 | Partly met until STOP-01: no command name, no accepted time. |
| WP01-A83 | Cannot be met: a rejected command leaves no operation record, so the status page has no rejection reasons. Rejections show on the re-rendered form (C2). The item SHOULD move to the form. |
| WP01-A88 | Met by the "Status unavailable" row of §7.5. |
| PM Q-01 | §9 split. |
| PM Q-05 | Agree: Max enrols by hand once; the harness runs axe on the set-up page with screenshots off; tests cover the refusals. |
| PM Q-06 | Already a 303 to sign-in (§5); the return needs D-03. |
| PM Q-08 | S8 and S10 apply to staff; S9 applies too (§4.8). |
| PM Q-09 | Prefill on both "Use a different address" and "Request a new code" (§4.3). |
| PM Q-10 | Agree (§5). |
