# WP-01 U2 notes: app shell conformance (SH-01)

Unit U2 of WP-01. Author: the U2 engineer, 12 October 2026. Input for the architect's integration and `DESIGN.md`
update. Not committed by U2; the architect integrates. Amendment duty: A-02 (`data-reload-on-restore`).

## 1. Files changed

| File | Change |
|---|---|
| `src/web/ui/shell.ts` | Rewritten. `SURFACE_CONFIG` holds per role an ordered list of destinations (label, icon, candidate links, member pages, transitional marks), the top-bar search and notices paths; `nav` is gone (public header links are `PUBLIC_NAV`). New exports: `AttentionCount`, `DestinationConfig`, `DestinationMember`, `RailDestination`, `RailMember`, `ContextLink` (replaces `SurfaceLink`), `HelpOptions`, `destinationState`, `environmentLabel`, `titlePrefix`. `appShell` options: `destinations`, `search`, `notices`, `help`, `contexts` (replaces `surfaces`), `supportView`, `environment: TmEnv` (replaces the label object), `receiptTitle`, `restorePath`. |
| `src/web/pages/signed-in.ts` | `surfaceDestinations` (replaces `surfaceNav`), `contextLinks` (replaces `surfaceLinks`; drops `accounts`), `signedInPage` gains `receiptTitle` and `restorePath`. |
| `src/web/pages/chrome.ts` | Support-view banner is header markup (no callout heading); `environmentBanner` removed; `ShellChrome` carries `supportView` and `environment`; account link `/account` when registered; `navCounts` values `number \| null`. |
| `src/web/pages/layout.ts` | `statusDocument`: required `environment`, optional `restorePath`; environment label, "[TEST] " prefix, `#toast-region`, `data-reload-on-restore`. |
| `src/web/pages/status.ts` | `PageEnv.environment` (required), passed to `statusDocument`; `homeLink` reads the landing page's label from the destinations (one line, because `SurfaceConfig.nav` no longer exists). |
| `src/apps/shared/pages/identity.ts` | Call site only: `environment: ctx.environment`. |
| `src/apps/shared/server.ts` | `PageEnv.environment` in `page()` and `pageFor()`; one type line: `counts` is `Record<string, number \| null>`. |
| `src/apps/shared/app.ts` | Capacity page environment. |
| `src/apps/shared/routes.ts` | One type line, not in my file list: `AppRequestContext.navCounts` is `Record<string, number \| null>`. Without it `server.ts` cannot hold the `null` that the design requires for an unreadable count. No behaviour change. |
| `src/apps/shared/nav-counts.ts` | An unreadable count is `null` (not kept, so the next page asks again). |
| `static/css/layout.css` | Shell rewritten (see §3). Public site, footer, work layout unchanged. |
| `scripts/dev/gallery-pages.ts` | Shell demos render through the real `signedInPage` with a synthetic session: TA (`index`, `ta`, `confirm`), operator with an unreadable count (`ops`), SuperAdmin with the Work queues marker and tabs (`admin`), accounts surface without rail (`accounts`), new `support.html` (support view at staff), new `contexts.html` (two contexts, long name). Gallery environment is `test`. |
| Tests | New `test/unit/web/shell.test.ts` (shell cases moved out of `components.test.ts`, plus new ones); `test/unit/web/signed-in.test.ts` rewritten; `test/unit/web/components.test.ts` (shell cases and the `appShell` escape case removed, moved to `shell.test.ts`); `test/unit/nav-counts.test.ts`; `test/ui/gallery.test.ts` (nav, menu, rail, context, help/account, support-view cases; one selector and one attribute line in the back/forward cache test, see §5); `test/system/flows.test.ts`, `browser.test.ts`, `case-work.test.ts` (shell assertions only). |

Class names: `.shell-bar` and `.shell-nav` are kept (base.css view-transition rules still apply). `.shell-bar` is now a
`div` inside `header.shell-header`; the public site (`site.ts`) still uses `header.shell-bar` and keeps working.
Removed classes: `.env-banner*`, `.account*`, `.shell-button`, `.surface-switch*`. New: `.shell-header`, `.env-label`,
`.support-banner*`, `.context-switch*`, `.shell-tools`, `.shell-tool*`, `.help-panel*`, `.account-menu*`,
`.disclosure-chevron`, `.local-nav*`, `.nav-flag*`, `.nav-menu__panel`, `.nav-menu__tools`, `.nav-menu__flag*`,
`.nav-count--unavailable`, `.shell-frame--no-rail`.

## 2. Design regions to code

| Region | Code |
|---|---|
| R1 environment label, R17 title | `environmentLabel(env)` renders `<p class="env-label">` as the first child of `header.shell-header` for `test` and `local_test`; `titlePrefix(env)` gives "[TEST] ". Used by `appShell` and `statusDocument`. Production: neither. `receiptTitle` puts a receipt title first. |
| R2 support-view banner | `supportViewBanner` (chrome.ts) → `appShell({ supportView })` → `header > .shell-header__support` after the label, before the top bar. End form unchanged (`action`, `_csrf`, `_op`). |
| R3 wordmark and context name | `a.brand` with `.brand__surface` (hidden when the context selector shows). Below 75rem the context name sits under the wordmark. |
| R4 context selector | `contextLinks` drops `accounts`; `nav.context-switch[aria-label="Your contexts"]` with visible "Context"; only with two or more. |
| R5 search | Top-bar link from `SURFACE_CONFIG.<role>.search` when registered: TA "Search your applications" `/ta/search`, SuperAdmin "Search all applications" `/admin/search`, operator none. |
| R6 Notices | Top-bar link with the count and the hidden unit "notices need your acknowledgement". |
| R7 Help | `details.help-panel` with the §2.5 draft copy (TA and staff variants); "Help with signing in" only where `/sign-in/help` is registered (edge). No hours, phone, response time. No JS: in flow. With JS (`html.js`): positioned under the top bar's right edge with the overlay shadow; U3's script closes it. |
| R8 account menu | `details.account-menu`: summary name (CSS truncation, 20ch; 12ch below 75rem; whole name in the DOM), hidden "account menu"; panel with full name, role detail, "Your account" (`aria-current` on `/account`), sign-out form `action="/sign-out"` with `_csrf` only. Same overlay rule as Help with JS. "Your account" left every rail. |
| R9 rail | `surfaceDestinations` → `RailDestination[]`; `nav.shell-nav[aria-label="Main"]`; `aria-current="page"` on the destination whose link or member equals `current`; width `--nav-width` (14.5rem); ink `--rail*` tokens; current = heavier weight + 4 px `--rail-marker` bar. |
| R10 destination tabs | `nav.local-nav[aria-label="<Destination> pages"]`, first child of `main`, when the current destination has ≥ 2 registered members; per-page numbers. Tabs wrap; no sideways scroll. |
| R11 menu | `details.nav-menu` in the rail nav, shown below 75rem; panel in flow (`position: static`); below 48rem the panel also holds Search, Notices and Help (`.nav-menu__tools`) and the top bar hides them. Summary: "Menu", current destination, "Needs attention" and/or "Count unavailable" in words; never a number. |
| R13 main / one h1 | Unchanged; tests assert one `h1`. |
| R14 announcement region | One `#toast-region` in `appShell` and now in `statusDocument`. |
| R15 landmarks | skip link → `header` (label, banner, top bar) → `nav` rail → `main` → `footer`; no `aside`. |
| R16 footer | Unchanged. |
| R18 status document | Label, prefix, `#toast-region`, `data-reload-on-restore`. |
| A-02 | `data-reload-on-restore` on `<html>` of every signed-in document (`appShell`, non-public) and every `statusDocument`. Boolean by default; `restorePath` sets a same-origin path (U3's script already accepts a path value). |
| Counts (§2.2) | `nav-counts` gives `null` for an unreadable count. `destinationState`: one counted page → its number (`null` → "Unavailable"; `0` → nothing); several counted pages → a dot marker with hidden "needs attention" when any is > 0, else "Unavailable" when any is `null`, else nothing. Never a sum. |
| Hostile states (§8) | Unreadable count → "Unavailable"; long name → truncated summary, whole name in DOM and panel (gallery `contexts.html`, tested); long email/IDs → `overflow-wrap: anywhere` in the account panel and support banner; 320 px → no overflow (gallery test); no JavaScript → all menus are `<details>` (gallery test); top bar not sticky; rail list not sticky. |

## 3. Deviations from the design

| # | Deviation | Reason |
|---|---|---|
| U2-D1 | The "Menu" toggle is a row directly under the top bar (inside the rail `nav`), not inside the top bar row as the §2.4 sketch draws it. | A native `<details>` cannot put its summary in the bar and its panel full width below it without `display: contents` on `<details>` (not reliable across browsers). The row keeps the panel in flow, works without JavaScript and keeps landmark order R15. |
| U2-D2 | Operator destinations "Applications" (`/ops/applications`) and "Originals" (`/ops/originals`) are not in `SURFACE_CONFIG`. | Neither path is in the route inventory, and the test "every rail path is an inventory GET path" would fail. The package that registers each page adds its destination. |
| U2-D3 | Tab label for `/admin/accounts` is "User accounts" (design: "Accounts"). | `DESIGN.md`: "Accounts" alone names the finance surface. Other tab labels follow the design. |
| U2-D4 | The ops "Services" destination is marked transitional as a whole (and its member). | Design §2.2 lists the destination as transitional (Q-12 stays open until WP-07). |
| U2-D5 | Help and account panels: without JavaScript they open in flow under their summary (they widen the bar row); with JavaScript they open under the top bar's right edge (positioned, overlay shadow), not as a full-height side panel. | A full-height fixed panel would cover the Help summary, the only visible way to close it by pointer. U3's script closes both on Escape, focus-out and pointer-down outside. |
| U2-D6 | Rail focus tokens (`--focus-ring: var(--rail-focus); --focus-halo: var(--rail)`) are set on the rail controls (links, menu toggle, menu tools), not on the whole rail subtree. | The Help panel inside the phone menu is a light card; a subtree override would put the paper ring on white. Keyboard users still see the paper ring on every rail control (U1 note N-1 satisfied). |
| U2-D7 | `src/apps/shared/routes.ts` changed (one type line). | Needed for `null` counts (see §1). |
| U2-D8 | `status.ts` changed in two places beyond the call site: the `PageEnv.environment` field and `homeLink`'s label lookup. | `PageEnv` is declared in `status.ts`; `homeLink` read the removed `SurfaceConfig.nav`. The "Go to …" labels are unchanged except the accounts surface ("Go to Accounts home", was "Go to Home"). |

## 4. Contracts for other units

- **U3 (script).** `<html data-reload-on-restore>` (boolean) or `data-reload-on-restore="/same-origin/path"` on every
  signed-in and status document. Panels: `details.help-panel`, `details.account-menu` (close on Escape with focus to
  the summary, on focus-out, on pointer-down outside), `details.nav-menu` (Escape). Your current `enhance.js`
  already matches these selectors.
- **U3 (`receiptDocumentTitle`).** Pass its value as `signedInPage({ receiptTitle })`; the shell puts it after "[TEST] ".
- **U4/U5.** `statusDocument` requires `environment`; `restorePath` for a page re-rendered at a POST-only address
  (for example `/staff/enrol/confirm` → `/staff/enrol/setup`). `PageEnv.environment` is required.
- **U1 / architect (base.css).** No rename of `.shell-bar` or `.shell-nav`; no base.css change needed.
- **WP-20 (`site.ts`).** Use `environmentLabel(env)` as the first child of the header and `titlePrefix(env)` in the
  title; `.shell-bar` styles still serve `header.shell-bar`.

## 5. Findings and items for the architect (ranked)

| # | Rank | Finding | Scenario | Proposal |
|---|---|---|---|---|
| U2-F1 | P0 (integration) | Four system tests outside my file list assert "Support view of …" inside `main`; the banner is now in the header. | `npm run test:system` fails at `test/system/core-pages.test.ts:521`, `payments-views.test.ts:340`, `intake-pages.test.ts:267`, `refusals.test.ts:302`. | Change each assertion's text source from `main` to `header` (for example `res.$('header .support-banner').text()`); one line each. Not edited by U2 (outside the file list). |
| U2-F2 | P1 (U3) | `test/ui/gallery.test.ts` polling tests fail with U3's in-progress `enhance.js`: "a redirected response … stops polling with a reload message", "a fragment for another region is refused", "the gallery poll demo reaches its final state"; the gallery `index.html` reloads itself every poll cycle, which also broke one axe run (desktop light, `index.html`, "Execution context was destroyed"). | The A-01 access-change rule navigates where the old tests expect a stop notice; the gallery's final poll fragment is treated as a foreign region. | U3 updates those tests and the gallery fragment. Not caused by the shell. |
| U2-F3 | P2 | The `/accounts` page (kept until retirement, Q-04) has no rail and no context selector; the way back is the account menu → "Your account" (rail of the home context) or the browser. | A SuperAdmin opening a bookmarked `/accounts` sees a page with no rail. | Accept until `/accounts` is retired; or make the brand on that page lead to `/home`. |
| U2-F4 | P2 | TA and operator see Notices twice (rail and top bar) with the same count (design Q-14). | — | As designed. |
| U2-F5 | P2 | The back/forward cache test in the gallery now removes `data-reload-on-restore` before it dispatches `pageshow`, to keep testing the unmarked path; marked pages reload (U3's `results.test.ts` covers that). | — | Architect to confirm the split of the two tests. |

## 6. Checks run (12 October 2026)

- `npm run typecheck`: clean. `npx eslint` on every changed TypeScript file: clean.
- `node --test test/unit/web/signed-in.test.ts test/unit/web/shell.test.ts test/unit/nav-counts.test.ts test/unit/web/components.test.ts`: 113 tests, 113 pass.
- `npm run test:ui`: 406 tests, 401 pass, 5 fail. All five are U2-F2 (U3's polling change): three polling tests, their suite, and the desktop-light axe run of `index.html`, which the poll demo's self-reload interrupts. Every shell, nav, menu, context, help, account and support-view test passes, and every gallery page passes axe, overflow and CSP at 1440, 390, 360 and 320 px in light and dark (except that one interrupted run).
- System tests `flows`, `browser`, `case-work` (`TMPDIR=/tmp/u2s`): 20 tests, 20 pass.
- Not run: the other system test files (U2-F1 predicts four failures).
