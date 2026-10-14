# WP-20 design review: public entry, public pages and search readiness

Lane `ui-revamp-2026-10-12`. Author: Principal UX Engineer (Claude Opus subagent). Date: 12 October 2026.
Status: design before code, for the architect's decision (LD-12). Product base: lane repository at 102e4c9, with the
WP-01 decisions of `WP-01.md` §3 (tokens option C with Atkinson Hyperlegible, D-06; no cross-instance staff link,
D-13). This document writes no product code. Paths in `file:line` form are relative to the lane repository unless
they start with `REC/` (`internal/records/`).

Writing style: ASD-STE100 at about 75%. `MUST`, `MUST NOT`, `SHOULD` and `MAY` have their normative meaning.

## 0. Summary for the architect

- The public site is already search-ready in structure: server-rendered pages with no script, unique titles and
  descriptions, canonical URLs, robots and sitemap, production redirects, an address only when verified, and a
  15-assertion crawl check with a committed record (`src/web/public/site.ts`, `src/cli/seo/check.ts`,
  `docs/verification/seo-check.md`). WP-20 is a content, layout and conformance package, not a rebuild of the
  mechanism.
- Gaps against the target (§2): the home page shows an empty "Destinations" block instead of omitting it; the
  population and excluded visa types are missing; there is no sign-in block, and the page's primary action is
  "How it works", not "Sign in"; JSON-LD claims `TravelAgency` (a local-business type) and a `logo` without C01 or
  C02; public pages have no environment label and no "[TEST]" title prefix; and the 404 that edge actually serves
  is not the 404 that the crawl check verifies (finding F-01, P1).
- The design keeps every path, the no-script policy and the check. It adds typed content blocks to the content
  schema, so the content controls the block order of UI-PLAN §3.1 and the code controls the data-driven blocks
  (countries, sign-in, business details). It gives draft copy for every block (all draft under CR-09; the service
  description is owner input C02 and needs Max).
- Recommendations on the PM's questions: Q-01 input request to Max for the verified public contact, and plain
  account copy until then (P1); Q-02 the architect runs `tm seo check` at the integration commit and commits the
  record in an evidence-only commit, guarded by a new digest test (P1); Q-03 keep `/countries` with a factual
  statement (P2); Q-04 `Organization` and `WebSite` only until C02 (P2); Q-05 a fifth release blocker
  `public_copy_unapproved` (P2); Q-06 no staff link (decided in WP-01).
- No STOP item: nothing in WP-20 needs a change under `src/modules/`, `src/kernel/`, `src/contracts/`,
  `src/core-api/`, `src/platform/` or migrations. No P0 is open.

## 1. Scope and sources

| Item | Path | Route id | Target source |
|---|---|---|---|
| PUB-01 public entry | `/` | `public.home` | UI-PLAN §3.1 PUB-01, §5.1; UX §8.1; BS B01, B02; UAT-05 |
| Destinations | `/countries` | `public.countries` | UI-PLAN §3.1 ("Country list not approved: omit the list block"); BS B02 |
| Country detail | `/countries/:slug` | `public.country` | BS B01, B02 (only approved countries) |
| How it works | `/how-it-works` | `public.page.how_it_works` | UX §8.1 (process explanation) |
| About | `/about` | `public.page.about` | UX §8.1 (verified business details); UX §9 C02 |
| Search | `/search` | `public.search` | BS B01 ("public search covers only that static content") |
| Not found | any unknown public path | — | UI-PLAN §2.4 (public variant); WEB-20260926-01 |
| Robots, sitemap | `/robots.txt`, `/sitemap.xml` | `public.robots`, `public.sitemap` | BS B01; WEB-20260926-01 |
| Environment label, "[TEST]" | every public page | — | UI-PLAN §2.1 ("public pages included"); CMP-23; BS B37; WP-01 dependency D-WP20 |
| Crawl check and proof | `tm seo check`; V25 | — | BS B41; UX §12 V25; WEB-20260926-01 |

Inputs read: UX §8.1, §9 (C01, C02, C03, C13, C15, C16), §12 V25; BS B01, B02, B37, B41; UI-PLAN §2.1, §3.1 PUB-01,
§5.1, §9, §10, §11, §12.2 (WP-20 row), §14.3; triage §1 UAT-05 and Max's finding UAT-05; `WP-20-acceptance.md`
(WP20-A01 to A69, Q-01 to Q-06); `WP-01.md` §3; the code: `src/web/public/{site,content,routes,search}.ts`,
`content/public/{site,pages,countries}.json`, `src/cli/seo/{check,codes}.ts`, `src/cli/commands/seo.ts`,
`src/apps/edge/instance.ts:101-117`, `src/apps/shared/server.ts:119-125,363-375`, `src/platform/config.ts:196-200,422-426`,
`src/core-api/compose.ts:95-98`, `src/apps/staff/catalogue/public-site.ts`, `src/web/route-inventory.ts:46-55`,
`docs/operations.md` §8, `docs/verification/seo-check.md`, `test/unit/public-site.test.ts`,
`test/integration/seo-check.test.ts`.

## 2. Current state and gaps

| Topic | Current (file:line) | Target | Gap |
|---|---|---|---|
| Rendering | Built once at start from static content; no database, no session, no script; `PUBLIC_CSP` with `script-src 'none'` (`site.ts:1-13,27-29`) | Crawlable server-rendered HTML (WEB) | None |
| Content model | Page = title, description, `h1`, lead, sections of heading + paragraphs (`content.ts:44-55`); the code appends the countries block and the business details after the sections (`site.ts:193-211`) | Block order of UI-PLAN §3.1 with data-driven blocks in place | No lists, no block kinds, no control of block order |
| Home blocks | Value statement, "Built for travel agents", "Clear progress", then "Destinations" with the empty state "No destination is open for applications yet" (`site.ts:187-195`; `pages.json:2-28`) | Value → what → who and excluded types → countries (omitted while none) → process → sign-in → business details | Countries block shown empty; no population or excluded types; no process; no sign-in block |
| Primary action | "How it works" as the primary button (`site.ts:208`) | "Sign in" (UI-PLAN §3.1 PUB-01 "Primary") | Wrong primary |
| Header | Wordmark + "Visa services for travel agents", nav Countries / How it works / About / Search, "Sign in" (`site.ts:166-171`) | Text wordmark, "Sign in"; no private search (UI-PLAN §2.1) | Label "Countries" names a list that does not exist; no environment label |
| Title | `<title>${d.title}</title>` (`site.ts:149`) | "[TEST] " prefix in test installations | Missing |
| JSON-LD | `Organization` + `TravelAgency` with `logo` = the favicon (`site.ts:122-135`) on `/` and `/about` | Verified facts only (UX §9 C01, C02) | Local-business type and a logo without owner input |
| Business details | Only on `/about`, only when verified (`site.ts:196-203`) | Block 8 of PUB-01 (home) too | Missing on home |
| Not found | `site.notFound()` exists (`site.ts:265-268`), but edge answers unknown public paths and unknown country slugs with the BFF status page (`routes.ts:12` returns `ctx.notFound()`; `server.ts:363-375` falls back to `sendNotFound`) | The page the check verifies | F-01: the crawl check proves a page that production does not serve |
| Search | Results, no match, too long, rate limit (`site.ts:231-263`); results have no count; body in `aria-live` on a static page | States of §12 | Count missing; live region useless without script |
| Indexability | `indexable` from config, default `env === 'production'` (`config.ts:424`); a test installation MAY set it true | Never indexed outside production (BS B37) | F-02 (P2) |
| Evidence | `docs/verification/seo-check.md` and `seo-report.json` at content `2026-10-05.1` | A record that matches the released content and renderer | Stale after WP-20 by construction |

## 3. PUB-01 page anatomy

### 3.1 Blocks in the order of UI-PLAN §3.1

"Content" means a field in `content/public/pages.json` or `site.json`; "code" means `src/web/public/site.ts`. A block
whose owner input is missing is **omitted**: no heading, no placeholder, no "coming soon".

| # | Block | Section id | Content source | Rendered by | Omitted when | Primary or secondary action |
|---|---|---|---|---|---|---|
| 0 | Environment label | — | — | code (WP-01 `environmentLabel`) | production | — |
| 1 | Public header | — | — | code: text wordmark "TravelMudra" (C01 not supplied), nav, "Sign in" | never | "Sign in" (header, secondary style) |
| 2 | Value statement | — (page header) | `pages.json` `/`: `h1`, `lead` | code | never | "Sign in" (primary), "How it works" (secondary) |
| 3 | What TravelMudra does | `what-travelmudra-does` | text block | code | never | — |
| 4 | Who TravelMudra serves, and what it does not handle | `who-travelmudra-serves` | text block with two lists | code | never | — |
| 5 | Destinations (static country and scope information) | `destinations` | `countries.json` | code (`countries` block) | `countries.json` is empty (today) | Country links |
| 6 | How it works (process) | `how-it-works` | text block with an ordered list | code | never | — |
| 7 | Sign in | `sign-in` | `sign_in` block paragraphs | code adds the "Sign in" button and, when the contact is verified, the contact line | never (validation requires it on `/`) | "Sign in" |
| 8 | Business details | `business-details` | `site.json` `locality`, `contact` | code (`business_details` block) | both are `unverified` (today) | — |
| 9 | Footer | — | — | code | never | Links; legal links only when `/privacy` and `/terms` exist |

Absent by rule (UX §8.1; UX §9; BS B01, B02, B42): candidate countries, flags or maps; an address, telephone,
email, map or opening hours while unverified; support hours or response times (C13); imagery and carousels (C15);
testimonials, client logos, approval rates, "guaranteed", "fast-track", timing promises; government-affiliation
wording or emblems; any traveller entry ("Apply now", "Track your visa", applicant sign-in); self-registration;
offering names, prices, estimates, launch states or counts; sender addresses (`login@`, `saarthi@`).

### 3.2 Layout (UAT-05: "content is thin and the layout is plain")

The treatment is typographic and works without imagery (UX §8.1). Tokens follow WP-01 option C: paper canvas, white
panels, ink text, teal only for the primary action and the current location, Atkinson Hyperlegible (D-06), headings
20 / 24 / 28 px (UI-PLAN §9; no larger display size, WP20-A26).

- Block 2: a band on paper with the `h1` (28 px), the lead at 20 px (`--text-lg`) within a 60ch measure, and two
  actions: "Sign in" (primary, teal) and "How it works" (secondary).
- Block 3: text at 16 px within `--measure`.
- Block 4: two labelled lists, "TravelMudra handles" and "TravelMudra does not handle", side by side from 768 px
  (two columns), stacked below. Each list has an `h3`. Status is text; no colour carries meaning.
- Block 6: an ordered list with large step numbers (CSS counters, ink), one step per line; not a card grid (UX §7.2
  "Avoid decorative metric-card grids").
- Block 7: a white panel with a thin border and 8 px radius holding the paragraphs and the primary "Sign in" button.
- Block 8: a definition list (Address, Email, Telephone) when present.
- Spacing: 32 px between blocks, 16–24 px inside panels. One column below 768 px with a 16 px gutter.
- Public-only styles go in a new `static/css/public.css` inside `@layer components`, imported by `static/css/app.css`
  after `components.css`. The layer order does not change (LD-01). Budget: at most 8 KB.

## 4. The other pages

| Page | Anatomy | Notes |
|---|---|---|
| `/countries` | Header → `h1` "Destinations" → lead → `countries` block. While the list is empty the block renders a statement instead of being omitted, because the list is the page's purpose (§10). When countries exist: an alphabetical list of links to `/countries/:slug`, each with its summary. | Indexable flag stays `true` (§10). Nav label "Destinations" (today "Countries", `site.ts:97`). JSON-LD: `BreadcrumbList` (Home › Destinations). |
| `/countries/:slug` | Exists only for an approved country. Breadcrumb → `h1` "[name] visa services for travel agents" → summary → "Travel purposes" (tourism and/or business) → "Prices, estimates and documents": "Sign in to see current prices, processing estimates and required documents." with "Sign in for travel agents" (`site.ts:213-223`, unchanged). | An unknown slug answers the public not-found page (F-01). No `Offer`, no price (A11). |
| `/how-it-works` | Header → `h1` "How it works" → sections (§5.3) → sign-in block (short). | JSON-LD: `BreadcrumbList`. |
| `/about` | Header → `h1` "About TravelMudra" → sections (§5.4) → business details block (omitted while unverified). | JSON-LD: `Organization` (§8). States no founding year, staff count, registration number, award or address that no owner input supplies (WP20-A21). |
| `/search` | §12. | `noindex, follow`; disallowed in production `robots.txt`. |
| Not found | Public header → `h1` "Page not found" → "This page does not exist on the TravelMudra public site." → links: Home, Destinations, How it works, About. Status 404, `noindex, nofollow`. The requested path is not echoed. | Served by edge for every unknown public path and unknown slug (F-01). |
| `/robots.txt`, `/sitemap.xml` | §9. | — |

## 5. Copy drafts

Every public sentence is draft under CR-09 until Max approves it (§17 Q-05). Rows marked **C02** are the "public
service description" that UX §9 C02 names as an owner input: the drafts state only facts of BS B01 to B04 and
B17, and Max validates them. Rows marked **code** are fixed text in `site.ts` (a code change); the rest is content
(`pages.json`), which a content change carries.

### 5.1 Home `/`

| Block | Field | Draft | Status |
|---|---|---|---|
| Title | `title` | "TravelMudra — visa services for travel agents" (45 characters) | Draft |
| Description | `description` | "TravelMudra works with travel agents on tourist and business visa applications for their travellers, and shows each step and who it waits on." (141) | Draft |
| 2 | `h1` | "Visa services for travel agents" | Draft |
| 2 | `lead` | "TravelMudra is a business-to-business visa service. Travel agents bring their travellers' visa applications to TravelMudra, and TravelMudra checks, prepares and tracks the work with them." | C02 |
| 2 | actions | "Sign in", "How it works" | code |
| 3 | heading | "What TravelMudra does" | Draft |
| 3 | paragraphs | "Each service states what TravelMudra does and what the travel agent does, which documents it needs, and how long processing is estimated to take." / "TravelMudra checks every document file before anyone relies on it. Each application shows where it stands, who it is waiting on (the travel agent, TravelMudra or an outside authority) and what happens next." / "Processing times are estimates, not guarantees. TravelMudra does not promise that a visa will be issued." | C02 |
| 4 | heading | "Who TravelMudra serves" | Draft |
| 4 | paragraph | "TravelMudra works with travel agents. Travellers do not have an account: their travel agent works with TravelMudra for them." | C02 |
| 4 | list "TravelMudra handles" | "Travellers who are Indian citizens, hold an ordinary passport and live in India" / "Tourist visas" / "Business visas" | C02 (BS B02) |
| 4 | list "TravelMudra does not handle" | "Student visas" / "Diplomatic visas" / "Work visas" | C02 (BS B02) |
| 5 | heading, intro | "Destinations" / "TravelMudra accepts applications for these destinations. Signed-in travel agents see the services, prices, estimates and documents for each." | code; block omitted today |
| 6 | heading | "How it works" | Draft |
| 6 | ordered list | 1 "Sign in with the account that TravelMudra set up for your agency." 2 "Choose a service for the destination." 3 "Create a group for the trip and add an application for each traveller, with the documents that the service lists." 4 "Submit each application. Its price is fixed when you submit it." 5 "A TravelMudra operator works on each application. Each application shows who it is waiting on and what happens next." 6 "When there is a result, you receive it from TravelMudra." | C02 (BS B03, B17, B19) |
| 6 | paragraph | "Processing times are estimates, not guarantees." | Draft |
| 7 | heading | "Sign in" | Draft |
| 7 | paragraphs | "Travel agents sign in with a one-time code that TravelMudra emails to their account address. No password is needed." / "TravelMudra sets up an account for each travel agency that it works with. Accounts cannot be requested through this website yet." | Draft; §11 |
| 7 | button, contact line | "Sign in"; when `contact` is verified: "To ask about an account, write to [email]." | code |
| 8 | heading, rows | "Business details"; "Address", "Email", "Telephone" from `site.json` | code; block omitted today |
| Footer | text | "TravelMudra · Visa services for travel agents. Travellers do not have an account; their travel agent works with TravelMudra." (existing, `site.ts:176`) | code |
| Footer | links | "About", "Destinations", "How it works", "Sign in for travel agents" (`rel="nofollow"`); "Privacy" and "Terms" only when those pages exist | code |

### 5.2 Destinations `/countries`

| Field | Draft | Status |
|---|---|---|
| `title` | "Destinations served for travel agents — TravelMudra" (51) | Draft (existing) |
| `description` | "The destinations for which TravelMudra accepts visa applications from travel agents. A destination is listed here only after TravelMudra approves it." (149) | Draft |
| `h1`, `lead` | "Destinations" / "TravelMudra lists a destination here only after it approves the destination for public listing." | Draft |
| Empty statement (code) | "No destination is listed yet. Signed-in travel agents see the services that are open for their account." | code |

### 5.3 How it works `/how-it-works`

| Field | Draft | Status |
|---|---|---|
| `title` | "How TravelMudra works with travel agents" (40) | Draft (existing) |
| `description` | "How a travel agent works with TravelMudra on a visa application, from the first application to the result, with each step and wait shown." (137) | Draft |
| `h1` | "How it works" | Draft |
| "Before you start" | "TravelMudra sets up an account for each travel agency that it works with. You sign in with a one-time code that TravelMudra emails to your account address." | C02 |
| "Start an application" | "Choose a service for the destination. Create a group for the trip, then add an application for each traveller." | C02 |
| "Provide the documents" | "Each service lists the documents it needs, with the accepted formats and size limits. TravelMudra checks every file before anyone relies on it, and you see what is missing or needs correction." | C02 |
| "Submit each application" | "You submit each application yourself. Its price is fixed when you submit it." | C02 (BS B17) |
| "Follow the work" | "Each application shows who it is waiting on and why: you, TravelMudra or an outside authority. Processing times are estimates, not guarantees." | C02 |
| "Receive the result" | "When there is a result, you receive it from TravelMudra, with the documents that belong to the application." | C02 |

### 5.4 About `/about`

| Field | Draft | Status |
|---|---|---|
| `title` | "About TravelMudra, the visa service for travel agents" (53) | Draft (existing) |
| `description` | "About TravelMudra: a business-to-business visa service that works only with travel agents and records each application from start to result." (140) | Draft |
| `h1` | "About TravelMudra" | Draft |
| "What TravelMudra does" | "TravelMudra provides visa services to travel agents. It does not offer accounts to travellers: their travel agent represents them." | C02 |
| "How TravelMudra works" | "Work is recorded step by step. Decisions that affect an application are made by named people and recorded with a reason. Travel agents see the state of each application they own." | C02 (BS B33) |
| "Who TravelMudra serves" | The two lists of §5.1 block 4 | C02 |
| Business details | §5.1 block 8 | code; omitted today |

### 5.5 Search, not found (code)

Search: §12. Not found: §4. `contentVersion` becomes `2026-10-12.1` with the WP-20 content (WP20-A49).

## 6. Content schema and content changes

### 6.1 `src/web/public/content.ts`

Section becomes a discriminated union on `kind`. Every section has an optional `id` (a slug; default
`section-[n]`), so that anchors are stable (PUB-01 "Secondary: section anchors").

```ts
const zId = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(40);
const zList = z.strictObject({ heading: zText(3, 80).optional(), ordered: z.boolean(), items: z.array(zText(3, 300)).min(1).max(12) });
const zSection = z.discriminatedUnion('kind', [
  z.strictObject({ kind: z.literal('text'), id: zId.optional(), heading: zText(3, 120),
    paragraphs: z.array(zText(10, 1200)).max(12), lists: z.array(zList).max(3).optional() })
    .refine((s) => s.paragraphs.length > 0 || (s.lists?.length ?? 0) > 0, 'section_empty'),
  z.strictObject({ kind: z.literal('countries'), id: zId.optional(), heading: zText(3, 120), whenEmpty: z.enum(['omit', 'statement']) }),
  z.strictObject({ kind: z.literal('sign_in'), id: zId.optional(), heading: zText(3, 120), paragraphs: z.array(zText(10, 600)).min(1).max(4) }),
  z.strictObject({ kind: z.literal('business_details'), id: zId.optional(), heading: zText(3, 120) }),
]);
```

`zPage.sections` uses `zSection`; `listsCountries` is removed (the `countries` block replaces it).

`zSite` gains (if Q-05 is adopted):

```ts
copyApproval: z.discriminatedUnion('status', [
  z.strictObject({ status: z.literal('unapproved') }),
  z.strictObject({ status: z.literal('approved'), approvedOn: zDate, contentVersion: z.string() }),
]),
```

The approval is valid only when `copyApproval.contentVersion` equals `contentVersion`, so a later copy edit reopens the
blocker.

New `validateContent` rules (each failure refuses the build with a closed code):

| Rule | Code |
|---|---|
| Section ids are unique within a page | `duplicate_section_id` |
| At most one `countries`, one `sign_in` and one `business_details` block per page | `duplicate_block` |
| `/` has a `sign_in` block (PUB-01 primary action) | `home_sign_in_missing` |
| `/countries` has a `countries` block with `whenEmpty: 'statement'` | `countries_block_missing` |
| Every country title (`countryTitle`) is at most 70 characters (the check's A03 bound) | `country_title_too_long` |

`contentBlockers` becomes the one source of blockers for the site, the check and Core's status page (today
`src/cli/seo/check.ts` recomputes them separately, a drift risk). With Q-05 it adds `public_copy_unapproved`. Core's
contract carries blockers as free text (`src/contracts/catalogue.ts:281-283`), and `src/core-api/compose.ts:95-98`
imports `contentBlockers`, so no file outside the allowed directories changes. The SuperAdmin page shows an unknown
blocker as its code (`src/apps/staff/catalogue/public-site.ts`, `BLOCKER_TEXT[b] ?? b`); its sentence is a later
SA-05 change.

Compatibility: Core and edge load the same content directory with the same code, in the same release. A content
file in the old shape fails the new schema and both refuse to start. Old and new content MUST NOT be mixed: the
content and the schema change in one commit.

### 6.2 JSON changes

- `site.json`: `contentVersion` `2026-10-12.1`; locality and contact stay `unverified`; `copyApproval`
  `unapproved` (Q-05).
- `pages.json`: the copy of §5 with `kind` on every section; `updatedOn` `2026-10-12` on every changed page (it
  feeds the sitemap `lastmod`).
- `countries.json`: unchanged (`[]`). No candidate country is added (BS B02).

A new content page (for example `/privacy`) needs a route-inventory entry in the same change
(`src/web/route-inventory.ts:54-55`, comment "each page path is listed here"); without it edge refuses to start
(`checkAppRoutes`). `test/unit/bff.test.ts:228-240` catches it before a deploy. `docs/operations.md` §8 MUST say so in
the owner-input checklist.

## 7. Environment label, "[TEST]" and indexability (D-WP20)

- `PublicSiteOptions` gains a required `environment: TmEnv`. Edge passes `config.env`
  (`src/apps/edge/instance.ts:103-106`). `tm seo check` passes `'production'` (`src/cli/seo/check.ts:89`). Tests pass
  their own value.
- In `test` and `local_test` the public document renders WP-01's `environmentLabel(env)` as the first child of
  `<header>` ("**Test environment.** Synthetic data only.", visible, not dismissible, read as text) and prefixes the
  title with "[TEST] ". It uses the WP-01 helper and its `.env-label` style; it MUST NOT copy the text.
- In `production` neither appears. The check's A11 SHOULD add two markers: the text "Test environment." and a title
  that starts with "[TEST]" (tool version `tm-seo-check/2`, §14).
- Invariant (finding F-02, P2): `buildPublicSite` treats a page as indexable only when `indexable === true` and
  `environment === 'production'`. Scenario: a test installation with `public.indexable: true` in its configuration
  (`config.ts:424` allows it) would publish `Allow: /` and pages without noindex while it shows the test label. The
  platform has no refusal for that configuration, and `src/platform/` is outside the lane, so the renderer enforces it.
- Canonical URLs use the configured `public.canonicalOrigin` (default `https://b2b.travelmudra.co`) in every
  installation. A test installation is never indexed (`Disallow: /` and noindex), so a canonical URL on the
  production host does no harm and keeps test pages equal to production pages.

## 8. Structured data rules

| Page | Before C02 (locality unverified) | After C02 (verified locality; contact verified or not) |
|---|---|---|
| `/` | `Organization` {`name` "TravelMudra", `url` canonical `/`}; `WebSite` {`name`, `url`} | `["Organization", "TravelAgency"]` with `address` `PostalAddress` holding exactly the supplied fields; `email` and `telephone` only when the contact is verified; `WebSite` |
| `/about` | `Organization` | The same `Organization` as `/` |
| `/countries`, `/how-it-works` | `BreadcrumbList` | `BreadcrumbList` |
| `/countries/:slug` | `BreadcrumbList` (Home › Destinations › [name]) | same |
| `/search`, not found | none | none |

Never, in any state: `logo` (until C01 supplies an approved logo; today it points at the favicon, `site.ts:127`),
`image` (C15), `areaServed`, `geo`, `openingHours` (C13), `sameAs`, `Offer`, `price`, `aggregateRating`, `review`,
`SearchAction` (search is noindex and disallowed). `TravelAgency` is a local-business type: it enters with the verified
address in the same reviewed content change, never before (PM Q-04). The A10 negative fixture
(`test/integration/seo-check.test.ts:51`) replaces `"name":"TravelMudra"` on `/`; the `Organization` object MUST keep
that property spelling.

## 9. Robots, sitemap, canonical and redirects per installation type

| Item | `production` | `test`, `local_test` | `tm seo check` |
|---|---|---|---|
| Page robots | Indexable pages: none; `/search`: `noindex, follow`; not found: `noindex, nofollow` | Every answer `noindex, nofollow` (header and meta) | As production |
| `robots.txt` | `User-agent: *`, `Allow: /`, one `Disallow` per private prefix and `/search` (`site.ts:36`), `Sitemap: https://b2b.travelmudra.co/sitemap.xml` | `User-agent: *` / `Disallow: /` | As production |
| `sitemap.xml` | Every indexable content page and every approved country, `lastmod` = `updatedOn` | Same body (production URLs); never fetched by a crawler because of `Disallow: /` | As production |
| Canonical | `https://b2b.travelmudra.co` + clean path | Same | Same |
| Redirects | 301 to the canonical URL for a trailing slash, upper case, `/index.html`, `.html`, and another `Host` (`site.ts:292-345`, `fallback`) | None (an unknown form is 404) | As production |
| Environment label, "[TEST]" | Absent | Present | Absent (asserted) |

## 10. `/countries` while the approved list is empty

Options: (a) keep the page, indexable, with a factual statement and no names; (b) keep it but noindex and out of the
sitemap and nav until a country exists; (c) remove it.

Recommendation: (a) (agrees with the PM's Q-03). Reasons: the path stays (LD-03); the statement answers the
visitor's real question truthfully; the site cannot be released for indexing while `public_no_supported_country` is
open (`tm seo check --strict` refuses), so the thin-content risk never reaches a search index; and (b) would make the
navigation and the sitemap depend on data, which the check would then have to cover in two shapes. The home page
omits block 5 entirely while the list is empty (UI-PLAN §3.1).

## 11. How a new travel agent gets an account

Facts: no self-registration (AD-05); a SuperAdmin creates and activates TA accounts; eligibility and fraud policy are
PARKED (UI-PLAN B-01; BS B08, B44); UI-PLAN §3.1 PUB-01 says "Account request route: BOUNDARY; show contact details
only"; the contact is unverified, so no contact is shown.

Design: the sign-in block states the facts ("TravelMudra sets up an account for each travel agency that it works
with. Accounts cannot be requested through this website yet."). It has no form, no "Create account" link and no
implied eligibility rule. When `site.json` `contact` becomes verified, the code adds "To ask about an account, write to
[email]." without a copy change. The public page does not use the internal "Owner: product owner" form of the §11.3
notice; the sign-in page's "Need an account?" notice (WP-01 §4.7) states the same facts in that form. A verified
public contact is an owner input (C02): input request to Max (Q-01, P1).

## 12. Search page states

| State | Trigger | Status | Content |
|---|---|---|---|
| Empty | No `q`, or `q` blank | 200 | Form only. No count, no list (D7). |
| Nothing to search | `q` not blank but without a letter or digit (`tokens()` empty, `search.ts:28-30`) | 200 | Form, "Enter a word to search for." |
| Results | One or more matches | 200 | Form, then "[n] public page[s] match “[q]”." in text, then `ol.search-results` with title links and descriptions (at most 20, `MAX_RESULTS`). |
| No match | No document holds every term | 200 | Form, "No public page matches “[q]”.", "Try other words, or open one of these pages:" with links to Home, Destinations, How it works, About. |
| Too long | `q` longer than 100 characters | 200 | Form, "Search terms are too long. Use at most 100 characters." (the check's A15 reads this sentence) |
| Too many searches | More than `searchPerMinute` per client address per 60 s (`site.ts:119`) | 429 | Form, "Too many searches from this connection in a short time. Wait a minute, then search again." Not "no results". |

Rules: the query is escaped (A15) and never logged (`search.ts:2-4`); the index holds only static content, so no
private or live data can match. The result container MUST NOT carry `aria-live` (`site.ts:260`): there is no script,
and a live region in a freshly loaded page announces nothing reliably; the count sentence is the first text after the
form. The form keeps its visible label "Search the public pages" and a 44 px "Search" button. The query is in the
address (`GET /search?q=`); this is acceptable for static public content that is noindex and disallowed in
`robots.txt` (P2 note, Q-09). Signed-in TA search is a different page (`/ta/search`, WP-01 Q-05).

## 13. Responsive and accessibility rules

- Header at every width: environment label (test), wordmark and "Sign in" on the first row; the nav (Destinations,
  How it works, About, Search) on the same row from 768 px and wrapped below it on phones. No menu button (WP20-A26).
  Current item: `aria-current="page"` plus weight and the teal underline, not colour alone.
- One column below 768 px, 16 px gutter; no two-dimensional scroll at 320 px or at 1280 px with 400% zoom (AC-04).
  Long words and long country names wrap (`overflow-wrap: anywhere` on headings and list items).
- Landmarks: one `banner` (with the environment label inside it), one `navigation` labelled "Site", one `main`, one
  `contentinfo`. Blocks are `<section id>` elements with an `h2` and no accessible name, so that they do not become
  extra region landmarks (the shared `section()` helper adds `aria-labelledby`; the public renderer MUST NOT use it for
  blocks). One `h1`; no skipped level (block 4 uses `h3` for its two lists).
- Skip link first; it targets `main`. Focus: WP-01 ring (2 px ink, 2 px white offset), never covered (the header is
  not sticky).
- Targets: every link at least 24 × 24 px; "Sign in" and "Search" at least 44 × 44 px (AC-10).
- Link text names its destination: "Sign in for travel agents" in the footer; no "click here" or bare "read more".
- Contrast: WP-01 §3.3 and §3.4 pairs apply; public pages add none.
- Reduced motion removes transitions (existing rule).
- No script: public pages are identical with and without JavaScript; `PUBLIC_CSP` forbids script (`site.ts:27-29`).
- Page weight: at most 200 KB per page in the check (A14), counting HTML, CSS and fonts. Estimate after WP-01: HTML
  about 10 KB, CSS about 100 KB, the Atkinson Latin font 34 KB, so about 145 KB. `public.css` MUST stay under 8 KB.

## 14. V25 proof and the crawl check

V25 (UX §12): "Public crawl exposes only approved static content and verified locality; private case/live catalogue
content is absent." The PM's Parts A to D (`WP-20-acceptance.md` §3) are adopted with these decisions.

**Who runs `tm seo check`, at which commit, which files are committed (PM Q-02).**

1. The WP-20 engineer runs `tm seo check` during implementation (scratch report, not committed) until it passes.
2. The architect integrates WP-20. Then, in the lane repository with a clean working tree at the integration
   commit, the architect runs `tm seo check --report docs/verification/seo-report.json` and `tm seo check --strict`.
   The architect updates `docs/verification/seo-check.md` (tool version, command, source commit, content version and
   digest, configuration digest, renderer digest, time, crawled pages, assertion results, the open blockers and the
   `--strict` exit 1 with them) and commits **only** those two files in one evidence commit. The report's
   `sourceCommit` is the integration commit (the evidence commit's parent).
3. Any later change to `content/public/`, `src/web/public/`, `src/cli/seo/`, `static/css/` or `static/fonts/` makes
   the record stale. A new unit test `test/unit/seo-record.test.ts` MUST compare the committed report's
   `contentSha256` and `contentVersion` with the repository content, and (with the tool change below) its
   `rendererSha256` with a digest over the public renderer files, so that stale evidence fails the test suite before
   integration to main.
4. When Max integrates the lane into main and the content and renderer digests are unchanged, the record stays
   valid (`docs/operations.md` §8 identifies evidence by content digest). Otherwise the architect reruns on main.

**Tool changes (`tm-seo-check/2`).** `siteServe` passes `environment: 'production'`; A11 adds the environment-label
markers; the blockers come from `contentBlockers`; the report adds `rendererSha256` (SHA-256 over
`src/web/public/*.ts` and the CSS and font files the pages load, in a fixed order); A07 also fetches an unknown
country slug. `docs/operations.md` §8 states steps 1 to 4.

**Parts.**

| Part | Where | Who | Content |
|---|---|---|---|
| A production-mode crawl | `tm seo check` | Architect (step 2) | Exit 0; A01 to A15 pass; crawled pages exactly `/`, `/countries`, `/how-it-works`, `/about`; `--strict` exit 1 with exactly the open blockers (four, or five with Q-05) |
| B crawl of `lane-ui` with real synthetic data | `lane-ui` | PM with the LD-11 harness | WP20-A15, A16 and Part B of the checklist: a marker application ("Pubcheck Zqxv") created through the existing TA pages; a cookie-less, script-less crawl from `/` and the sitemap; no marker, reference, synthetic address, offering name, price or private link on any page or in `/search` |
| C verified-locality path | Test | Engineer | Fixture content with a synthetic verified locality and contact: `TravelAgency` + `PostalAddress` with exactly the fixture fields, and block 8 on `/` and `/about`; unverified again: both disappear |
| D automated V25 (new, SHOULD) | Test | Engineer | `test/system/public-crawl.test.ts`: a system installation with a seeded synthetic case and launched synthetic catalogue; crawl edge's public pages; assert the absence of the case marker, offering names, "₹" and private links, and that the 404 edge serves equals `site.notFound()` |

## 15. Hostile states

| State | Required behavior | Today |
|---|---|---|
| Content file missing, empty (0 bytes), not JSON | Closed refusal (`content_file_missing`, `content_not_json`); edge and Core do not start (`instance.ts:102`, `compose.ts:95`); `tm seo check` refuses `content_invalid` | Yes |
| Content fails the schema (unknown field, a price field, a too-long title, an old-shape section) | Closed refusal (`site_invalid`, `pages_invalid`, `countries_invalid`); the repository-content unit test fails first | Yes (schema changes, §6) |
| Duplicate title or description | Build refused (`duplicate_title`, `duplicate_description`); the check reports A03 | Yes |
| `pages.json` is `[]` | `required_page_missing` | Yes |
| New content page without a route-inventory entry | Edge refuses to start; `bff.test.ts` catches it | Yes; documented by §6.2 |
| Long content at the schema limits (12 sections of 12 paragraphs of 1,200 characters) | The page can exceed 200 KB; A14 fails in the check; the content change is refused at review | Yes (by the check) |
| Long country name | The country title can exceed 70 characters; new rule `country_title_too_long` refuses the build instead of failing A03 later | No (new rule) |
| 300 approved countries | Home block 5 and `/countries` list them in columns; page weight stays inside 200 KB (about 18 KB of links) | Layout new |
| Text that looks like HTML in content | Escaped by the `html` template; JSON-LD escapes `</script` (`test/unit/public-site.test.ts:108`) | Yes |
| JavaScript off or on | Identical pages; `script-src 'none'` | Yes |
| Signed-in visitor | Same pages; the public routes read no session (`server.ts:304-309` resolves sessions only for private, sign-in and self surfaces) | Yes |
| Core down or in maintenance | Public pages are still served (no Core read); "Sign in" leads to the maintenance page (WP-01 §5) | Yes |
| Request limit reached | Edge's 503 page with `Retry-After` (`app.ts:128-129`); a crawler retries later | Yes (BFF page, not public; P2) |
| Unknown public path, unknown slug | Public not-found page, 404, noindex, no echo | No (F-01) |
| Test installation configured `indexable: true` | Still noindex and `Disallow: /` (F-02) | No |
| Copy edited after Max's approval | `public_copy_unapproved` reopens (Q-05) | New |
| Renderer or CSS changed after the evidence run | `seo-record.test.ts` fails (§14 step 3) | No (new test) |

## 16. Implementation breakdown

WP-20 implementation starts after WP-01 units U1 (tokens) and U2 (shell, which exports `environmentLabel` and owns the
`.env-label` style) are integrated. Units own disjoint files.

| Unit | Files | Tests added or updated |
|---|---|---|
| **W1 Schema and renderer** | `src/web/public/content.ts`; `src/web/public/site.ts` (blocks by kind, environment label and title prefix, indexability invariant, header and footer labels, JSON-LD rules, search states, not-found copy, no `aria-live`); `src/web/public/search.ts` (index text and sign-in paragraphs and list items); `src/web/public/routes.ts` (unknown slug answers `site.notFound()` as a public result); `src/apps/edge/instance.ts` (`environment`; `publicFallback` answers `site.fallback(...) ?? site.notFound()` for a GET on the public surface); new `static/css/public.css`; `static/css/app.css` (one import line) | `test/unit/public-site.test.ts` (update: the old content shape in its fixtures, the JSON-LD types, the new blocks; new: environment label and "[TEST]" in `test`, absent in `production`; indexability invariant; block omission while unverified or empty; search states; unknown slug equals not found); `test/unit/bff.test.ts:230` (the `environment` option); `test/system/web-shell.test.ts:111-127` stays valid (the anonymous 404 has no sign-out form and no `nav.shell-nav`); new gallery module `scripts/dev/gallery/public.ts` rendering real `buildPublicSite` output for the axe runs (the architect registers it and removes the stale `publicPage()` demo in `scripts/dev/gallery-pages.ts`) |
| **W2 Content** | `content/public/site.json`, `content/public/pages.json` (the copy of §5 in the W1 schema); `content/public/countries.json` unchanged | New `test/unit/public-content.test.ts`: the repository content loads; `/` has blocks in the §3.1 order; no country name except "India"; no email, telephone, "₹", "guarantee", "fast-track" or "Apply now" in the content files |
| **W3 Check tool and procedure** | `src/cli/seo/check.ts`, `src/cli/seo/codes.ts` (§14 tool changes); `docs/operations.md` §8 (who runs the check, the evidence commit, the stale-record test, the inventory rule for new pages) | `test/integration/seo-check.test.ts` (update the expected blockers; new negative fixtures: an environment label in production output fails A11; a "[TEST]" title fails A11); new `test/unit/seo-record.test.ts` (§14 step 3) |
| **Evidence (architect)** | `docs/verification/seo-report.json`, `docs/verification/seo-check.md` | — |

Order: W1 and W3 in parallel (W3 reads W1's option name `environment` from this design); W2 after W1's schema
compiles (W2 MAY draft the JSON against §6.1 in parallel); evidence last. Optional D-part system test (§14) belongs to
W1.

Existing tests that pin behavior this design changes: `test/unit/public-site.test.ts:94-106` (an `Organization` inside
an `@type` array; the address case), `:118-127` (country page text stays), the content fixtures that clone the old
section shape; `test/integration/seo-check.test.ts:38` (exactly four blockers; five with Q-05);
`test/unit/bff.test.ts:230` (options without `environment`); `docs/verification/seo-check.md` (content `2026-10-05.1`).

## 17. Open questions, findings and deviations

### 17.1 Findings worked in this design

| ID | Rank | Finding | Concrete scenario | Design |
|---|---|---|---|---|
| F-01 | P1 | The not-found page that edge serves for unknown public paths and unknown slugs is the BFF status page (`routes.ts:12`, `server.ts:363-375`), not the `site.notFound()` page that `tm seo check` verifies (`check.ts:109`) | The committed record says A07 and A13 passed for the not-found page, but production serves a different page that loads `enhance.js` under the product policy and has no public navigation. The evidence does not describe the product. | Edge serves `site.notFound()` (§16 W1); the D-part test compares them |
| F-02 | P2 | A test installation MAY be configured indexable | An installation reachable through a misconfigured proxy is indexed with "[TEST]" titles. | Renderer invariant (§7) |
| F-03 | P1 | The home page shows an empty "Destinations" block | UAT-05: the first content after the welcome reads as "no service available". UI-PLAN §3.1 says omit. | Block 5 omitted (§3.1) |
| F-04 | P2 | JSON-LD claims `TravelAgency` and a `logo` without C01 or C02 | Search tools report a local business without an address and show the favicon as the brand logo. | §8 |
| F-05 | P2 | The check recomputes the blockers apart from `contentBlockers` (`check.ts` end of `runSeoCheck`) | A new blocker appears on the SuperAdmin page but not in the release record. | §6.1, §14 |

### 17.2 The PM's questions

| ID | Rank | Recommendation |
|---|---|---|
| Q-01 new travel agent has no route to an account | P1 | Send Max an input request for the verified public contact (C02). Until then the sign-in block states the facts of §11 and shows no contact; the code shows the contact line as soon as `site.json` carries a verified contact. Scenario: once the site is public, an agency with no account finds no way to reach TravelMudra and the lead is lost. |
| Q-02 who runs and commits the crawl record | P1 | §14 steps 1 to 4: the architect at the integration commit, an evidence-only commit of the two files, and a test that fails on a stale record. |
| Q-03 `/countries` while empty | P2 | Keep, indexable, with the factual statement (§10). |
| Q-04 JSON-LD before locality | P2 | `Organization` and `WebSite` only; `TravelAgency` and the address arrive together in the C02 content change; no `logo`, `areaServed` or `geo` (§8). |
| Q-05 who approves the public copy | P2 | Max approves the copy before the first indexable release, in the same review as C02. Make it mechanical: a fifth blocker `public_copy_unapproved`, closed by `copyApproval` in `site.json` with the date and the content version it approves (§6.1). Scenario: draft copy with a sentence Max would not sign goes live with the first indexable release. |
| Q-06 staff link on the public header | P2 | No staff link (WP-01 D-13). |

### 17.3 Other open questions

| ID | Rank | Question | Concrete scenario | Recommendation |
|---|---|---|---|---|
| Q-07 | P2 | The favicon is an invented mark in the old blue (`static/favicon.svg`, `#1f2c57`) | Max sees an unapproved brand mark in the browser tab and in shared links. | Keep a neutral interim favicon recoloured to ink `#172D35`; list it under C01; never use it as a `logo` (§8). |
| Q-08 | P2 | Public copy addresses the travel agent as "you" in process steps and in the third person elsewhere | A reviewer finds the voice mixed. | Second person for instructions to travel agents; third person for statements about TravelMudra and travellers (as drafted). Max decides at copy approval. |
| Q-09 | P2 | Public search sends the query in the address | A visitor types a passport number into public search; it stays in the browser history. | Accept: static content only, noindex, disallowed, never logged. Revisit only if evidence shows personal data typed there. |
| Q-10 | P2 | The 503 at the request limit is the BFF page, not a public page | A crawler sees a page with a script reference during an overload. | Accept (temporary status, `Retry-After`). |

### 17.4 Deviations

- DV-01: the countries block on `/countries` renders a statement while empty, while the home page omits it (§10).
- DV-02: the public sign-in block states the account facts in plain public copy instead of the §11.3 template with
  "Owner: product owner" (§11).
- DV-03: no type sizes above 28 px on public pages, although UX §8.1 asks for a typographic treatment; the treatment
  comes from the 20 px lead, spacing and measure (§3.2). WP-01's `--text-3xl` and `--text-4xl` have no consumer and
  SHOULD be deleted with WP-20 (LD-02).
- DV-04: block sections are not named regions (§13).

### 17.5 Alignment with the PM's checklist

| Item | Position |
|---|---|
| WP20-A06, A11, A14, A22, A24 | Met by §3.1 and §10. |
| WP20-A13 | Met; the sign-in block states who can sign in, and no registration appears. |
| WP20-A26 | Met with headings at 20 / 24 / 28 px (DV-03). |
| WP20-A35, A36, A37 | Met by §8; the A37 fixture also checks block 8 on `/`. |
| WP20-A42 | The long query answers 200 with the refusal text (the check's A15 expects 200); "refused with a message" is met in text, not in status. |
| WP20-A46 | Met only after F-01. |
| WP20-A47, A48 | Met by §14; A48 counts five blockers if Q-05 is adopted. |
| WP20-A49 | Met (`2026-10-12.1`). |
| WP20-A55 | Met: the count sentence is the first text after the form; no live region (§12). |
