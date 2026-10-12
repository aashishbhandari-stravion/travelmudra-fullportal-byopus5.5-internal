# WP-20 acceptance checklist: public pages and search readiness

| Field | Value |
|---|---|
| Lane | `ui-revamp-2026-10-12` |
| Work package | WP-20 (UI-PLAN §12.2; lane PLAN §3, with UAT-05 and WEB-20260926-01) |
| Author | Principal Product Manager (Claude subagent), 12 October 2026 |
| Decision owner | Principal Technical Architect of the lane (LD-12) |
| Status | Run on `lane-ui` at 9efb379 on 12 October 2026 by the Principal Product Manager. Results, evidence and findings: §6 and §7. The checklist text in §0 to §5 is unchanged from the draft (step 1 of lane PLAN §3). |
| Product base | lane branch `ui-revamp-2026-10-12` at 102e4c9 |
| Installation | `lane-ui`: edge http://127.0.0.1:4650 serves the public site. It is a test installation: every public answer carries noindex and `robots.txt` disallows everything. |
| Production-mode check | `tm seo check` (`src/cli/commands/seo.ts`, `src/cli/seo/check.ts`, assertions A01 to A15 in `src/cli/seo/codes.ts`). It builds the site from `content/public/` with the production public configuration (canonical host `https://b2b.travelmudra.co`, indexable, redirects on), serves it on an ephemeral loopback port with no database, crawls it from `/` and `sitemap.xml`, and renders each page in Chromium with script off and on. Procedure: `docs/operations.md` §8. Stored record: `docs/verification/seo-check.md` and `seo-report.json`. Test: `test/integration/seo-check.test.ts`. |
| Writing style | ASD-STE100 at about 75% (STY-20261003-01) |

## 0. Inputs and conventions

### 0.1 Inputs

| Ref | Source | Identity | Sections used |
|---|---|---|---|
| UX | `TARGET_PRODUCT_UX_SPEC.md` (2026-10-05) | SHA-256 b45186887cdc37f6… | §3.3, §7.1, §7.4, §7.5, §8.1, §8.3, §9 C01 C02 C13 C15 C16, §12 V24 V25 |
| BS | `BUILD_SPEC.md` (r2) | SHA-256 4a6fd90657b0723f… | B01, B02, B37, B41 (public crawl check sentence), B42 |
| PL | `../ui-plan-from-specs-2026-10-10/UI-PLAN.md` | internal 52adc40 | §2.1 (public header, environment label), §3.1 PUB-01, §5.1 PUB-01, §9, §10 AC-01 to AC-28, §11, §12.2 WP-20, §14.3 |
| TR | `../../uat/2026-10-12-uat-pass1-triage.md` | internal 52adc40 | §1 UAT-05, §3.1 |
| UF | `../../uat/2026-10-12-max-uat-findings.md` | internal 52adc40 | UAT-05 |
| WEB | Global policy WEB-20260926-01 | `~/.claude/CLAUDE.md` | Search-ready public websites |
| LP | `PLAN.md` (this folder) | working tree of 12 October 2026 | LD-02, LD-03, LD-09, LD-12 |
| Current content | `content/public/site.json` (contentVersion `2026-10-05.1`; locality and contact `unverified`), `pages.json` (`/`, `/countries`, `/how-it-works`, `/about`, `/search`), `countries.json` (empty) | lane 102e4c9 | What exists today; not the target |

### 0.2 Conventions

- **Personas.** Visitor (a travel agent who does not know TravelMudra, signed out). Signed-in TA (`syn-ta-1`).
  Crawler (fetches HTML with no script and no cookie). Keyboard-only user. Screen-reader user. Phone user (390 px).
  Max (owner review of UAT-05).
- **Where.** `L`: a person or the LD-11 harness shows it on `lane-ui` (test mode). `C`: the production-mode check
  `tm seo check` shows it; the item names the assertion. `T`: an automated test in the lane repository shows it.
  `L+C`: both are required, because `lane-ui` runs in test mode and cannot show production indexing behaviour.
- **Public pages in scope.** `/`, `/countries`, `/how-it-works`, `/about`, `/search`, the not-found page,
  `/robots.txt`, `/sitemap.xml`. `/countries/:slug` pages exist only for approved countries; today there are none.
- **Owner inputs not supplied** (do not invent): C02 verified locality and contact, C02/C03 approved country list,
  C13 support hours, C15 imagery, C16 font, C01 logo, the legal pages (`/privacy`, `/terms`). The page omits each
  block whose input is missing.
- **Copy.** Public text is draft copy until Max approves it (CR-09). A pass needs the stated facts and the stated
  absences, not exact words.
- **Viewports.** Wide 1440 × 900. Phone 390 × 844. Reflow checks add 320 px and 1280 px at 400% zoom.
- **Pass rule.** WP-20 passes when every `L` item passes on `lane-ui` at the integrated ref, every `C` item passes
  in a `tm seo check` run on the integrated tree, every `T` item has a named passing test, every axe item passes, and
  the V25 proof (section 3) passes. A failed item becomes a finding ranked P0, P1 or P2 with its scenario.

## 1. Scope

### 1.1 Pages and personas

| Page | Path | Personas | Notes |
|---|---|---|---|
| PUB-01 Public entry | `/` | Visitor, crawler, Max | Blocks of PL §3.1; UAT-05 |
| Destinations | `/countries` | Visitor, crawler | No approved country today (`countries.json` is empty) |
| Country detail | `/countries/:slug` | Visitor, crawler | None today; not found for every slug |
| How it works | `/how-it-works` | Visitor, crawler | |
| About | `/about` | Visitor, crawler | |
| Search | `/search`, `/search?q=…` | Visitor | Static content only; noindex, follow |
| Not found | any unknown public path | Visitor, crawler | 404, noindex |
| Robots | `/robots.txt` | Crawler | Test mode: disallow all. Production: A06 |
| Sitemap | `/sitemap.xml` | Crawler | A08 |

WP-20 has no command (PL §12.2). Page states S1 to S7 do not apply to the static pages (PL §3.1 PUB-01). The
public page states are: content block present, content block omitted (owner input missing), search with results,
search with no match, search with an empty query, search refused (query too long), search rate-limited, not found.
Command states C1 to C4 and the results ACC, REJ, UNR do not apply.

### 1.2 State coverage

| State | Items |
|---|---|
| Block present | WP20-A06 to A10, A12, A13, A20, A21 |
| Block omitted (input missing): countries, locality and contact, legal pages, imagery, logo | WP20-A11, A14, A19, A22, A24, A36 |
| Search: results, no match, empty, too long, rate-limited | WP20-A42, A43, A44, A45 |
| Not found | WP20-A23, A46 |
| Test mode versus production mode | WP20-A01 to A05 |

## 2. Acceptance checklist

### 2.1 Test-mode protection and environment label (`lane-ui`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP20-A01 | Visitor | `/`, `/countries`, `/how-it-works`, `/about`, `/search`, an unknown path | Open each page on 4650. | The text "Test environment. Synthetic data only." is visible on every public page and cannot be dismissed. | L | PL §2.1 ("public pages included"); UX §7.1; BS B37; AC-28 |
| WP20-A02 | Visitor | Same pages | Read the browser tab title. | The title starts with "[TEST] ". The rest equals the page's own title. | L | PL §2.1 (ADDED) |
| WP20-A03 | Crawler | Same pages, `robots.txt`, `sitemap.xml` | Fetch each address with `curl -sI` and `curl -s`. | Every HTML answer carries noindex (an `X-Robots-Tag` header or a robots meta element with `noindex`). | L | `src/web/public/site.ts` header; BS B37 |
| WP20-A04 | Crawler | `/robots.txt` on 4650 | Fetch it. | It disallows every path for every user agent. | L | `src/web/public/site.ts` header; BS B37 |
| WP20-A05 | — | Production-mode output | Run `tm seo check` on the integrated tree. | No environment label, no "[TEST]" prefix and no synthetic marker appear (A11). Indexable pages carry no noindex (A07). | C | CMP-23; A07; A11 |

### 2.2 PUB-01 and the content pages (UAT-05, BS B01, B02, UX §8.1)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP20-A06 | Visitor | `/` | Read the page from top to bottom. List the blocks in order. | The order is: public header (text wordmark, "Sign in") → value statement → what the service does → who it serves and the excluded visa types → static country and scope information (omitted while no country is approved, A11) → process explanation → sign-in entry → verified business and contact details (omitted while unverified, A14) → footer. | L | PL §3.1 PUB-01; UX §8.1; TR §1 UAT-05 |
| WP20-A07 | Visitor | `/` | Read the `h1` and the first paragraph. | They say that TravelMudra is a business-to-business visa service that works with travel agents. | L | PL §3.1; UX §8.1; UF UAT-05 ("what TravelMudra does") |
| WP20-A08 | Visitor | `/` | Read "what the service does". | It says that travel agents bring their travellers' applications, and that TravelMudra checks, prepares and tracks the work and shows each step and who it waits on. It makes no claim outside BS B01 to B04. | L | BS B01; UX §8.1 |
| WP20-A09 | Visitor | `/` | Read "who it serves". | It says: Indian ordinary-passport holders resident in India, through their travel agent, for tourism or business visas. It says that student, diplomatic and work visas are not served. | L | BS B02; UX §8.1 ("distinguish tourism/business eligibility from excluded visa types") |
| WP20-A10 | Visitor | `/`, `/how-it-works`, `/about` | Look for a traveller entry. | The pages say that TravelMudra works through travel agents and that travellers do not sign in. No "Apply now", "Track your visa", applicant portal link or one-time applicant link appears. | L | BS B01, B42; UX §8.1 ("No … applicant portal CTA") |
| WP20-A11 | Visitor, crawler | Every public page, its JSON-LD, `sitemap.xml`, search results | Search each page source for country names. | Apart from "India" in the population statement, no country name appears. No "coming soon" list, no flag and no map of destinations appears. | L+C | BS B02 ("Candidate countries are planning inputs"); UX §8.1; PL §3.1 ("Country list not approved: omit the list block") |
| WP20-A12 | Visitor | `/`, `/how-it-works` | Read the process explanation. | It describes the work in the travel agent's terms: choose a service, create a group, add applications, submit each application, an assigned TravelMudra operator works the case, the result goes to the travel agent. It states no processing time, no SLA, no approval rate and no promise of approval. It shows no price. | L | BS B01, B17; UX §8.1; CR-03 |
| WP20-A13 | Visitor | Every public page | Find the sign-in entry. Select it. | The header holds "Sign in" on every public page. The home page has a sign-in section that says who can sign in: travel agents whose account TravelMudra set up. "Sign in" opens 4650 `/sign-in`. No self-registration form or "Create account" link appears. | L | PL §3.1 PUB-01, §2.1 (public header); AD-05; OC-10; UF UAT-05 ("clear sign-in directions") |
| WP20-A14 | Visitor, crawler | Every public page and its JSON-LD | Look for business and contact details. | While `site.json` marks locality and contact as unverified, no street address, locality as a business address, postal code, map, telephone number, email address, WhatsApp link, support hours or sender address (for example a `login@` or `saarthi@` address) appears. | L+C (A10) | UX §9 C02, C13; OC-06; PL §3.1 ("Verified locality missing: omit") |
| WP20-A15 | Visitor | Every public page and `/search` | Before the run, note the synthetic offering names, service names and prices that `syn-ta-1` sees on the TA catalogue pages. Search each public page and `/search` for them. | No offering name, service variant, price ("₹"), estimate, launch state or count appears. | L+C (A11) | BS B01 ("Keep … live catalogue data out of public content"); UX §8.1; V25 |
| WP20-A16 | Visitor | Every public page and `/search` | As `syn-ta-1`, create a group and a draft application with a distinctive synthetic marker (for example the applicant name "Pubcheck Zqxv"). Sign out. Search each public page and `/search?q=Pubcheck` for the marker, the group name and the application reference. | Nothing matches. No page holds the marker, an application or group reference, a synthetic account address or a link under `/ta/`, `/ops/` or `/admin/`. | L | BS B01, B10; V25 |
| WP20-A17 | Signed-in TA | `/`, `/about` | Sign in as `syn-ta-1`. Open `/` and `/about` in the same browser. Compare with the signed-out pages. | The pages are the same as for a signed-out visitor. They show no name, no count and no account facts. | L | BS B01; `src/web/public/site.ts` header ("reads no … session") |
| WP20-A18 | Visitor | Every public page | Read all text. | No testimonial, client logo, approval rate, "guaranteed", "fast-track", "within [n] days" or government-affiliation wording or emblem appears. | L | UX §8.1; CR-03 |
| WP20-A19 | Visitor | Every public page | Inspect images and fonts. | No photograph, illustration or carousel appears (C15 not supplied). The wordmark is text (C01 not supplied). Fonts follow the LD-09 decision; no font loads from another host (C16 not supplied). | L | UX §8.1, §9 C01, C15, C16; LP LD-09 |
| WP20-A20 | Visitor | `/how-it-works` | Read the page. | It matches the home page's process explanation and keeps the same absences (A12, A18). | L | BS B01; UX §8.1 |
| WP20-A21 | Visitor | `/about` | Read the page. | It describes the business-to-business service. It states no founding year, staff count, registration number, address, award or other fact that no owner input supplies. | L | UX §9 C02 ("Do not fabricate") |
| WP20-A22 | Visitor | `/countries` | Read the page. | It names no country. It says that destinations are published when they are approved, or the page is withheld from navigation and the sitemap (Q-03). | L+C | BS B02; PL §3.1 |
| WP20-A23 | Visitor, crawler | `/countries/france`, `/countries/x` | Open each. | Each answers the not-found page with status 404 and noindex, while no country is approved. | L+C (A07) | BS B02; PL §3.1 |
| WP20-A24 | Visitor | Footer of every public page | Read the footer. | It links to the public pages. It holds no link to `/privacy` or `/terms` and no placeholder legal text until Max supplies those pages. | L | `docs/verification/seo-check.md` (blocker `public_legal_pages_unsupplied`) |
| WP20-A25 | Visitor, crawler | `/` | Follow the visible links. | Every indexable page is reachable from `/` by a visible link. The current page is marked with `aria-current="page"` and not by colour alone. | L+C (A01) | WEB; AC-06 |
| WP20-A26 | Phone user | Every public page at 1440 and 390 px | Compare the layouts. Measure body text. | At 390 px the layout is one column. The header shows the wordmark and "Sign in" at every width without a menu. Body text is 16 px; headings use the 20, 24 and 28 px scale (PL §9, as LD-09 settles it). | L | PL §3.1 PUB-01 (Mobile), §9 |
| WP20-A27 | Max | `/` and the four other public pages on `lane-ui` | Open the pages. Judge content and layout against UAT-05 ("a welcome, what TravelMudra does, who it is for, and clear sign-in directions"). | Max records "UAT-05 resolved" or names what is still missing. A missing owner input (A11, A14, A24) is recorded as an input request, not a defect. | L (Max) | UF UAT-05; TR §1 |

### 2.3 Search readiness (WEB-20260926-01; BS B01, B41)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP20-A28 | Crawler | `/`, `/countries`, `/how-it-works`, `/about` | Fetch the raw HTML with `curl -s` (no script). Compare with the page in a browser. | The raw HTML holds the whole content: the `h1`, every block and every link. The page holds no `<script>` element. Raw HTML equals the rendered page. | L+C (A02) | WEB ("crawlable server- or pre-rendered HTML"); BS B01 |
| WP20-A29 | Crawler | Same pages | List each page's `<title>` and `<meta name="description">`. | Each indexable page has one title and one description. No two pages share a title or a description. Lengths are within the check's bounds. | L+C (A03) | WEB; BS B01 |
| WP20-A30 | Crawler | Same pages | Read `<link rel="canonical">`. | Each is an absolute `https://b2b.travelmudra.co/…` URL in lower case, with no trailing slash (except `/`), no query and no `index.html`. It equals the page's `<loc>` in the production sitemap. | L+C (A04) | WEB ("canonical and clean URLs"); BS B01 |
| WP20-A31 | Crawler | Production mode | Request `/about/`, `/About`, `/index.html` and `/about` on another host. | Each answers 301 to the canonical URL. | C (A05) | WEB; BS B01 |
| WP20-A32 | Crawler | Production `robots.txt` | Read it. | It disallows `/ta/`, `/ops/`, `/admin/`, `/accounts/`, `/account`, `/sign-in`, `/staff/` and `/search`. It allows the sitemap URLs. It names `Sitemap: https://b2b.travelmudra.co/sitemap.xml`. | C (A06) | WEB; BS B01 |
| WP20-A33 | Crawler | Production mode | Read the robots signals of each page. | Indexable pages carry no noindex. `/search` and the not-found page carry noindex. | C (A07) | WEB |
| WP20-A34 | Crawler | `/sitemap.xml` (lane and production) | Read it. | It is valid XML with no duplicate. It lists exactly `/`, `/countries`, `/how-it-works` and `/about` on `https://b2b.travelmudra.co` (plus one page per approved country once a list exists). It lists no `/search`, `/sign-in`, `/staff/` or private path. | L+C (A08) | WEB ("sitemap and robots") |
| WP20-A35 | Crawler | JSON-LD of each indexable page | Parse each `application/ld+json` block. | Each parses, uses the `https://schema.org` context and the types the check expects. The organisation name is "TravelMudra" and its URL is the canonical origin. | L+C (A09) | WEB ("structured data") |
| WP20-A36 | Crawler | Same JSON-LD | Look for location and contact properties. | While locality is unverified, no `address`, `PostalAddress`, `geo`, `telephone`, `email` or `openingHours` appears (Q-04 for other properties). | L+C (A10) | WEB ("business locality … only when verified"); UX §9 C02 |
| WP20-A37 | — | Fixture content with a synthetic verified locality and contact (test only; never the committed content) | Build the site from the fixture. Then mark the locality unverified. | With the verified fixture, JSON-LD holds a `PostalAddress` with exactly the supplied fields, and the page shows the contact block. Marked unverified, both disappear. | T | WEB ("structured data carrying the business locality"); BS B01 ("verified business locality") |
| WP20-A38 | Crawler | Production output | Run the check. | No live or private data, price, identifier, private link or synthetic marker appears. | C (A11) | BS B01; V25 |
| WP20-A39 | Visitor | Every public page | Open the browser's network panel. Load each page. | Every request goes to the same origin. No font, script, image, analytics or map loads from another host. | L+C (A12) | BS B01; UX §8.1 |
| WP20-A40 | Crawler | Every public page | Read the response headers. | The content security policy has `script-src 'none'` and `connect-src 'none'`. No `Set-Cookie` header appears. | L+C (A13) | `src/web/public/site.ts` (`PUBLIC_CSP`) |
| WP20-A41 | Crawler | Every public page | Inspect the document. | `lang="en-IN"`, a charset declaration, a viewport meta element, one `h1`, alt text on every image, and a page weight within the check's limit (200 KB). | L+C (A14) | WEB; AC-03 |
| WP20-A42 | Visitor | `/search?q=visa` | Search for "visa". Then search for `<b>x</b>`. Then search with a query longer than the limit. | Results list static public pages only, each with a title and a link, and the result count in text. The markup query shows as text, not markup. The long query is refused with a message that says why. | L+C (A15) | BS B01 ("public search covers only that static content") |
| WP20-A43 | Visitor | `/search?q=zzqxv` | Search for a term with no match. | The page says that no public page matches the term and offers links to the main pages. | L | BS B01; UX §8.3 (empty versus no match) |
| WP20-A44 | Visitor | `/search` | Open the page with no query. | The page shows the search form. It shows no result list and no result count. | L | UX §8.3; D7 |
| WP20-A45 | Visitor | `/search` | Search more often than the configured limit per minute (the tester's own address is throttled for about a minute). | The page says that there were too many searches and to try again shortly. It does not show "no results". | L | `src/web/public/site.ts` (`searchPerMinute`); UX §8.3 (capacity limit) |
| WP20-A46 | Visitor, crawler | `/no-such-page` | Open it. | Status 404, noindex, the public header, the environment label (test mode) and a link to the home page. The page does not echo the requested path. | L+C (A07) | WEB; PL §2.4 |
| WP20-A47 | — | Integrated tree | Run `tm seo check --report docs/verification/seo-report.json` on a clean working tree of the WP-20 integration commit. Read the report and `docs/verification/seo-check.md`. | Exit 0. All 15 assertions pass. The crawled pages are exactly the indexable pages. The report's `contentSha256` equals the SHA-256 over the three content files at the integration commit. No file under `content/public/` or `src/web/public/` changed after the report's `sourceCommit`. `seo-check.md` records tool, command, source commit, content version and digest, configuration digest, time, pages, result and blockers. The WP-20 record cites it by repository and commit. | C | WEB ("a crawl/SEO check in the verification record"); BS B41 ("Record the public-page crawl/SEO check before first release"); `docs/operations.md` §8 |
| WP20-A48 | — | Integrated tree | Run `tm seo check --strict`. | Exit 1. The open release blockers are exactly `public_locality_unverified`, `public_contact_unverified`, `public_legal_pages_unsupplied` and `public_no_supported_country`. No other blocker appears. The site stays out of search indexes until Max closes them. | C | `docs/operations.md` §8; PL §5.1 ("until supplied the page MUST NOT publish") |
| WP20-A49 | — | `content/public/site.json` | Read `contentVersion`. | It changed from `2026-10-05.1` to a new value with the WP-20 content, so the report identifies the new content. | C | `docs/operations.md` §8 (report fields) |

### 2.4 Accessibility (AC items that apply) and V24

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP20-A50 | Keyboard-only user | Every public page at 1440 and 390 px | Press Tab from the top. Use the skip link. Tab to "Sign in" and to every link. | The first focusable element is "Skip to main content" and it works. Focus order follows reading order. Every link is reachable. Nothing needs hover. Focus is visible (at least 3:1) and nothing covers it. | L | AC-01, AC-02, AC-12 |
| WP20-A51 | Screen-reader user | Every public page | List landmarks and headings. | One `banner`, one labelled `navigation`, one `main`, one `contentinfo`, one `h1`. Each block has an `h2`. No heading level is skipped. | L+C (A14) | AC-03 |
| WP20-A52 | Phone user | Every public page | View at 320 px, and at 1280 px with 400% zoom. | No two-dimensional page scrolling. All text and links stay reachable. | L | AC-04 |
| WP20-A53 | Any | `/search` | Inspect the search field. | It has a visible label. | L | AC-05 |
| WP20-A54 | Any | Every public page | View in greyscale. | The environment label, the current navigation item and the search messages are clear in text. Nothing relies on colour alone. | L | AC-06 |
| WP20-A55 | Screen-reader user | `/search?q=visa` | Submit a search. | The result count and the query are stated in text near the top of the results (the page reloads; no script). Focus starts at the page top, as on any page load. | L | AC-09, AC-16 (static form) |
| WP20-A56 | Phone user | Every public page at 390 px | Measure links and buttons. | Every target is at least 24 × 24 CSS px. "Sign in" and the search button are at least 44 × 44 CSS px. | L+T | AC-10 |
| WP20-A57 | — | Every public page | Measure text and non-text contrast, including the environment label and focus. | Normal text at least 4.5:1. Focus and non-text indicators at least 3:1. | L+T | AC-11 |
| WP20-A58 | Any | Every public page | Turn on "reduce motion". Navigate and focus. | No transition or animation plays. | L | AC-14 |
| WP20-A59 | Screen-reader user | Every public page | Read from the top. | The environment label is read as text (test mode). | L | AC-28 |
| WP20-A60 | Screen-reader user | Every public page | List the links. | Each link text names its destination. No "click here" or bare "read more". | L | UX §7.5 (WCAG 2.2 AA target) |
| WP20-A61 | Visitor participants (people) | `/` on a phone at 390 px | Ask each participant: what does TravelMudra do, who is it for, how does a travel agent sign in. Observe. | Record answers, task success, hesitation and the sample size. No target is invented. A participant who cannot find how to sign in is a finding. | L | UX §12 V24; UF UAT-05 |

### 2.5 axe checks (WCAG 2.2 A/AA)

Rule for every row: run axe (`@axe-core/playwright` 4.13.0, tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`,
`wcag22aa`) on `lane-ui` at 1440 × 900 and at 390 × 844. Expected: no violation of impact "serious" or "critical" at
either width. Record the counts of minor and moderate violations.

| ID | Persona | Page (state) | Where | Source |
|---|---|---|---|---|
| WP20-A62 | Visitor | `/` | L | UX §7.5; AC-01 to AC-28 |
| WP20-A63 | Visitor | `/countries` (no country approved) | L | same |
| WP20-A64 | Visitor | `/how-it-works` | L | same |
| WP20-A65 | Visitor | `/about` | L | same |
| WP20-A66 | Visitor | `/search` (empty query) | L | same |
| WP20-A67 | Visitor | `/search?q=visa` (results) | L | same |
| WP20-A68 | Visitor | `/search?q=zzqxv` (no match) and the long-query refusal | L | same |
| WP20-A69 | Visitor | Not-found page (`/no-such-page`, `/countries/x`) | L | same |

## 3. Proof scenario V25 and the recorded crawl check

V25 (UX §12): "Public crawl exposes only approved static content and verified locality; private case/live catalogue
content is absent." Sources: BS B01, B02, B41; UX §8.1; WEB-20260926-01.

### Part A. Production-mode crawl (C; no installation, no database)

| Step | Action | Observable result |
|---|---|---|
| A1 | In a clean working tree of the WP-20 integration commit, run `tm seo check --report <scratch>/seo-report.json`. | Exit 0. Assertions A01 to A15 pass. The crawled pages are exactly `/`, `/countries`, `/how-it-works`, `/about` on `https://b2b.travelmudra.co`. |
| A2 | Read the report's blockers. | Exactly the four owner-input blockers of WP20-A48. |
| A3 | Compare `contentSha256` and `configSha256` with the committed `docs/verification/seo-report.json`. | They are equal. The committed `seo-check.md` names the same source commit and digest (WP20-A47). |
| A4 | Run `tm seo check --strict`. | Exit 1 with the four blockers. Indexing stays blocked. |

### Part B. Crawl of `lane-ui` with real synthetic data (L)

This part shows what Part A cannot: the public pages on a running installation whose database holds synthetic
cases and a launched synthetic catalogue.

| Step | Action | Observable result |
|---|---|---|
| B1 | As `syn-ta-1`, note the synthetic offering names and prices on the TA catalogue pages. Create a group and a draft application with the marker "Pubcheck Zqxv". Note the group and application references in the internal run record only. Sign out. | — |
| B2 | With no cookie and no script, fetch `/` on 4650. Follow every same-origin link. Fetch every `<loc>` of `sitemap.xml` with its path on 4650. Record the list of addresses. | The list holds only the public pages of section 1.1. Every address answers 200 HTML or the not-found page. |
| B3 | Search each fetched page for the marker, the group and application references, the synthetic account addresses, each noted offering name, "₹", and any link under `/ta/`, `/ops/`, `/admin/`. | No match on any page. |
| B4 | Search each fetched page for country names. | Only "India" in the population statement (WP20-A11). |
| B5 | Request `/search?q=Pubcheck`, `/search?q=` plus each offering name, and `/search?q=syn-ta-1`. | "No public page matches" for each. |
| B6 | Request `/search?q=visa`. | Only static public pages. |
| B7 | Read the headers and markup of each fetched page and `robots.txt`. | noindex on every page; `robots.txt` disallows all; the environment label on every page (WP20-A01 to A04). |
| B8 | Read each page and its JSON-LD for address and contact facts. | None, because locality and contact are unverified (WP20-A14, A36). |
| B9 | Sign in as `syn-ta-1` and repeat B3 on `/` and `/about`. | Same result; the public pages read no session (WP20-A17). |

### Part C. Verified-locality path (T)

| Step | Action | Observable result |
|---|---|---|
| C1 | Build the site from a fixture content directory with a synthetic verified locality and contact (WP20-A37). | JSON-LD carries the `PostalAddress` with exactly the fixture fields. The page shows the contact block. The check's A10 passes. |
| C2 | Mark the fixture locality unverified. | The address and the contact block disappear. A10 passes. |

### Part D. Record

The WP-20 record names the `lane-ui` ref, the commit of the `tm seo check` run, the committed
`docs/verification/seo-check.md` (repository and commit), the test of Part C, and the results of Parts A to C. V25
passes when every step shows its result.

## 4. Out of scope and boundaries

These MUST NOT appear on any public page, in its JSON-LD, in `sitemap.xml` or in public search results:

- Support hours, response times, escalation contacts or any promise of service level (UX §9 C13; CR-03).
- A candidate or planned country, a "coming soon" country list, a flag or a destination map (BS B02; UX §8.1).
- An invented or unverified address, locality, map, telephone number or email address (UX §9 C02; WEB).
- A sender address of the authentication or application mail (OC-06).
- An applicant portal, an applicant sign-in, a one-time applicant link or an "Apply now" for travellers (BS B01, B42;
  UX §8.1).
- Self-registration, an account-request form, or an implied eligibility rule (AD-05; OC-10; BS B08, B44).
- Account-existence disclosure; public pages hold no form that touches accounts (BS B08).
- Live catalogue data: offering names, prices, estimates, launch states, counts (BS B01).
- Private case data: applicant names, references, groups, documents, links to private pages (BS B01, B10).
- Approval rates, testimonials, client logos, government-affiliation wording or emblems, stock photography
  (UX §8.1).
- Placeholder legal pages or invented legal text (`/privacy`, `/terms` stay unsupplied until Max supplies them).
- A script, a cookie or a third-party request on a public page (A12, A13).

Not in WP-20: the sign-in pages `/sign-in`, `/sign-in/verify`, `/sign-in/help` and the staff path (WP-01); the
SuperAdmin public-site status page `/admin/public-site`; releasing the site for indexing, DNS, the production host
and TLS (owner decisions; BS B37, B47); a brand font (C16), imagery (C15) and a logo (C01), which are WP-21 or owner
inputs.

## 5. Questions for the architect (ranked)

| ID | Rank | Question | Concrete scenario | PM recommendation |
|---|---|---|---|---|
| Q-01 | P1 | A new travel agent has no route to get an account. The account request route is a boundary (PL §3.1: "show contact details only"), and the contact is unverified, so the page shows nothing. UAT-05 asks for "clear sign-in directions". | A travel agent finds the site, has no account, and finds no way to contact TravelMudra. The lead is lost. Likelihood: every new visitor once the site is public. | Send Max an input request for the verified public contact (C02). Until then the sign-in section says that TravelMudra sets up accounts for travel agents, and shows no contact. |
| Q-02 | P1 | Who runs `tm seo check --report` and commits `docs/verification/seo-report.json` and `seo-check.md`, and at which commit? The PM writes no tracked file. | A late style or copy fix after the report changes `src/web/public/` or `content/public/`. The committed report then describes other content and is not evidence (`docs/operations.md` §8). Likelihood: medium, because review rounds change the renderer. | The software engineer runs it as the last step of the WP-20 implementation. The architect reruns it at the integration commit if any public file changed, and commits the record with the integration. |
| Q-03 | P2 | While no country is approved, does `/countries` stay (indexable, "no destination published yet") or leave navigation and the sitemap? | Once indexed, a "Destinations" page with no destination reads as "no service" and as thin content. The strict check blocks indexing while `public_no_supported_country` is open, so the risk starts only at release. | Keep the page with a short statement and no names. Revisit when C02/C03 arrives. |
| Q-04 | P2 | Before locality is verified, may JSON-LD carry `areaServed` (India) or a `TravelAgency`/`LocalBusiness` type with no address? | A local-business type with no address produces search-console warnings, or implies a locality that no owner verified. Likelihood: medium if the engineer follows generic local-SEO guidance. | Organization and WebSite types only until C02. Add the local type and the address in the same reviewed content change that supplies the verified locality. |
| Q-05 | P2 | Who approves the public copy (CR-09) before the site is released for indexing? | Draft copy goes live with a sentence that Max would not sign, for example about the work done for travellers. Likelihood: low, because the strict check blocks release until owner inputs arrive. | Max approves the copy in the same review that supplies C02. Record the approval in the release record. |
| Q-06 | P2 | The public header holds "Sign in" for travel agents only. Is a staff link wanted? | Cross-reference: WP-01 Q-04 (staff host is private). | Follow the WP-01 decision; no staff link on the public host. |

## 6. Sign-off

| Field | Value |
|---|---|
| Verified on (date, IST) | 12 October 2026. Crawl re-run before the run's pause; browser and HTTP probes 21:16 to 21:25 IST. |
| Installation and ref (`uat.py status lane-ui` output: commit or tag) | `lane-ui`: ref 9efb379, release `rel_5XXWGB0XZ525PNEXCKVXGHFVV3`, verified yes, all five units active, edge and staff health ok. Edge 4650 serves the public site. |
| Commit of the `tm seo check` run and of the committed `docs/verification/seo-check.md` | Committed record: `docs/verification/seo-report.json` and `seo-check.md` in lane commit 9efb379 (report `sourceCommit` 5280b9c; 5280b9c..9efb379 changes only those two files). Read-only re-run at 9efb379 on a clean tree, without `--report`: content, renderer and configuration digests equal the committed report (E8). |
| Lane commit of the tests named for `T` items | 9efb379. Re-run in this acceptance run: `test/unit/public-site.test.ts`, `test/unit/public-content.test.ts`, `test/unit/seo-record.test.ts` (36/36 pass). Cited as green at 9efb379, not re-run here: `test/integration/seo-check.test.ts` (23/23), `test/ui/gallery.test.ts`, `test/system/web-shell.test.ts`. |
| Browsers and versions | Headless Chromium 153.0.8010.12 (Playwright 1.63.0), `@axe-core/playwright` 4.13.0, Node 24.19.0, `curl`-equivalent raw fetch (no script, no cookie). |
| Assistive technology used | No screen reader. Keyboard by Playwright key events; landmarks and names from the Chromium accessibility tree (`ariaSnapshot`, E7). A screen-reader pass by a person was not made. |
| V25 result (parts A, B, C) | Pass. A: pass (E8, committed record). B: pass, with one variant at B1 (see the V25 row). C: pass by test. |
| UAT-05 result from Max (WP20-A27) | For Max to judge. PM observations are in the WP20-A27 row. |
| Open findings (ID, rank, scenario) | F-01, P2 (§7). No P0 or P1. |
| Signed by (role and name) | Principal Product Manager of lane `ui-revamp-2026-10-12` (Claude subagent), for the lane architect (LD-12). |

### 6.1 Evidence of the run

The probe scripts and their outputs are lane research material, outside both repositories, in `proofs/wp20/`
of the lane research folder. Each output is cited by SHA-256. The scripts send GET requests only, except the sign-in
of `syn-ta-3` through `test/uat/signin-harness.ts` (no code is printed, logged or stored). No case, group or other
data was created on `lane-ui`.

| Ref | File | SHA-256 | What it holds |
|---|---|---|---|
| E1 | `probe-public.json` | `da75aad3db9db55abee0aef26511e71924fc32c18a99d53574c74c6557fbbbe4` | Raw HTTP answers of 18 addresses; text scans (country names, contact, live data, private links, claims); Chromium at 1440 and 390 px on 12 public addresses (label, title, blocks, headings, landmarks, navigation, fonts, requests, axe); keyboard order and focus; script off versus on; reflow at 320 px and at 1280 px with 400% zoom; reduced motion |
| E2 | `probe-extra.json` | `0ca0fa8f271560a97fd369640de7f0f61844656bf3a1343d06a02a3b02ecbce6` | Text sizes, list columns, target sizes, footer links, axe pass ids, requests before and after axe |
| E3 | `probe-signedin.json` | `07d8ac220d78dfa7327da0efe801f016690157dc4b2f3c724bbcad2ac5d9534e` | V25 B2 crawl; the catalogue markers `syn-ta-3` sees (8 offering names, 4 prices); marker scan; public searches for the markers; the same public answers with the signed-in session |
| E4 | `probe-identity.json` | `22b2e4743ac6dc8c47a0eae47dc2a723b12f21412cec823fd6bb7834e957662c` | `lane-ui` answers for `/`, `/countries`, `/how-it-works`, `/about`, `/search`, `robots.txt`, `sitemap.xml`, `/no-such-page`, `/countries/synthetica` are byte-identical to the renderer's output built in process from the committed `content/public/` (test mode) |
| E5 | `probe-ratelimit.json` | `f837b16fb4caabafdbf60085ecb38437bf7e39274661e2c5e8f6d65cfffce7c6` | Public search limit: 429 at the 49th search in the minute (earlier probe searches used the rest), message text |
| E6 | `probe-final.json` | `ca5992b8b31de7b7ac50816bf9baf962eb64754493dc7a1511634cc212bbb5e8` | JSON-LD of each page on `lane-ui`; not-found page echo check; no-match links; all link texts; the production `robots.txt` rendered in process |
| E7 | `probe-aria.json` | `0e8a7085e46f96cb8abd3108271da310da020cc3ce37bac66fd500893cd2010e` | Chromium accessibility tree of `/` and `/search?q=visa` |
| E8 | `seo-check-rerun.txt`, `seo-check-strict-rerun.txt` | `4670112eecac137ad0dd187d8882eb288e66648ecedbcd95273a7031a0ced286`, `2da3c9f4c2c7c93c3aa3c7313c8d8569a851c98ae0bf12d1f4a4073b80cb83b5` | `node src/cli/main.ts seo check` (exit 0) and `--strict` (exit 1) at 9efb379: A01 to A15 pass, 4 pages, five blockers, digests |
| R | `docs/verification/seo-report.json`, `seo-check.md` | lane commit 9efb379 | Committed production-mode crawl record (`tm-seo-check/2`) |
| S | `shots/` | (screenshots, not hashed) | Full-page screenshots at 1440, 390, 320 px and 400% zoom; greyscale views |

axe summary (WP20-A62 to A69, tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`): 24 runs (12 addresses × 2
widths: `/`, `/countries`, `/how-it-works`, `/about`, `/search`, `/search?q=visa`, `/search?q=zzqxv`, the long-query
refusal, `/no-such-page`, `/countries/x`, `/countries/france`, `/countries/synthetica`). Violations: 0 critical,
0 serious, 0 moderate, 0 minor. Incomplete: 0. `color-contrast` and `target-size` are among the passing rules on every
page (E2). Observation: axe's style-sheet preload requests `/fonts.css`, `/reset.css` and similar paths on the same
origin after the analysis starts; the page itself makes no such request (E2). It is a tool artefact, not a page request.

Result per item (Pass, Fail, Deferred with the decision, Not proven, or "for Max to judge"; evidence reference; note):

| ID | Result | Evidence | Note |
|---|---|---|---|
| WP20-A01 | Pass | E1 | "Test environment. Synthetic data only." is visible on all 12 public addresses at 1440 and 390 px, including search states and not-found pages. The label holds no button or link; it is not `aria-hidden`. |
| WP20-A02 | Pass | E1 | Every title is "[TEST] " plus the page's own title from `pages.json` (not-found: "[TEST] Page not found — TravelMudra"). |
| WP20-A03 | Pass | E1 | Every HTML answer has `X-Robots-Tag: noindex, nofollow` and `<meta name="robots" content="noindex,nofollow">`. `robots.txt` and `sitemap.xml` also carry the header. |
| WP20-A04 | Pass | E1 | `robots.txt` on 4650 is `User-agent: *` / `Disallow: /`. |
| WP20-A05 | Pass | E8, R, T | A07 and A11 pass in the re-run and in the record. Test: "the production output itself carries no environment label and no "[TEST]" title" (`seo-check.test.ts`). |
| WP20-A06 | Pass | E1, S | Order on `/`: header (text wordmark, navigation, "Sign in") → h1 and lead → What TravelMudra does → Who TravelMudra serves (with "does not handle") → How it works → Sign in → footer. Destinations and business details are omitted (decisions F-03 and content schema in WP-20.md §3). |
| WP20-A07 | Pass | E1 | h1 "Visa services for travel agents"; lead "TravelMudra is a business-to-business visa service. Travel agents bring their travellers' visa applications to TravelMudra …". |
| WP20-A08 | Pass | E1 | States that travel agents bring applications, that TravelMudra checks, prepares and tracks the work, and that each application shows where it stands and who it waits on. No claim outside B01 to B04 found. |
| WP20-A09 | Pass | E1 | Handles: Indian citizens with an ordinary passport who live in India; tourist and business visas. Does not handle: student, diplomatic and work visas. "Through their travel agent" is stated in the block's first paragraph. |
| WP20-A10 | Pass | E1, E6 | Home and footer: "Travellers do not have an account; their travel agent works with TravelMudra." About: "It does not offer accounts to travellers." No "Apply now", "Track your visa", applicant portal or applicant link (claims scan). |
| WP20-A11 | Pass | E1, E3, E8 | Scan against every ISO 3166 region name plus "Synthetica", "Dubai", "Schengen", "UAE", "UK", "USA": only "India" in the population statement on `/` and `/about`. Sitemap, JSON-LD and search results hold no country. No flag, map or "coming soon". Crawl A11 pass. |
| WP20-A12 | Fail (P2, F-01) | E1 | `/` passes: the six steps include "A TravelMudra operator works on each application"; no processing time, SLA, approval rate, promise or price. `/how-it-works` keeps every absence but does not state that a TravelMudra operator works on the application ("Follow the work" names only who the application waits on). |
| WP20-A13 | Pass | E1, E2 | "Sign in" is in the header of all 12 addresses (102 × 44 px). The home sign-in block says TravelMudra sets up an account for each travel agency and that accounts cannot be requested on the site. Links go to `/sign-in` on 4650 (answers 200). No registration or "Create account". |
| WP20-A14 | Pass | E1, E6, E8 | No email address, `mailto:`, `tel:`, WhatsApp link, telephone pattern, postal code, street words, map, support hours or sender address on any page or in JSON-LD. Crawl A10 pass. |
| WP20-A15 | Pass | E1, E3, E8 | Markers: the 8 offering names and 4 prices that `syn-ta-3` sees on `/ta/catalogue`, all synthetic service codes and the catalogue baseline prices, "₹", "SYN", "Synthetica". No match on any public page or in `sitemap.xml`. Public searches for each offering name answer "No public page matches". Crawl A11 pass. |
| WP20-A16 | Pass | E3, E4 | Variant: no marker case was created (the run was read-only beside another agent on `lane-ui`). Proof used instead: every public answer is byte-identical to the renderer's output from the committed content files (E4), so no case, group, account or catalogue data can reach a public page. No link under `/ta/`, `/ops/`, `/admin/`, `/accounts/`, `/staff/`; no `@synthetic.test` address; `/search?q=Pubcheck`, `?q=syn-ta-1`, `?q=syn-ta-3` answer no match. `syn-ta-3` has no groups, so no case reference was available to search; whether other accounts held cases during the run was not checked. |
| WP20-A17 | Pass | E3 | Signed in as `syn-ta-3` (lands on `/ta/applications`): `/`, `/about`, `/countries`, `/how-it-works`, `/search`, `/search?q=visa`, `sitemap.xml`, `robots.txt`, `/no-such-page` are byte-identical to the signed-out answers; no `Set-Cookie`. Rendered text of `/` and `/about` identical. `syn-ta-3` was used instead of `syn-ta-1` on instruction. |
| WP20-A18 | Pass | E1 | No testimonial, client logo, approval rate, percentage, "fast-track", "within n days", government, embassy, "official" or emblem. "Guarantee" appears only as "estimates, not guarantees". |
| WP20-A19 | Pass | E1, E2 | No `img`, `picture`, `video`, `canvas`, `iframe` or background image. One SVG: the `aria-hidden` info icon of the test environment label. Text wordmark. One font, Atkinson Hyperlegible Next, self-hosted under `/assets/` (LD-09). No third-party request. |
| WP20-A20 | Fail (P2, F-01) | E1 | Same absences as `/` (A12, A18). It does not match the home process on one fact: the TravelMudra operator step is missing. |
| WP20-A21 | Pass | E1 | No founding year, staff count, registration number, address, award or other unsupplied fact. |
| WP20-A22 | Pass | E1 | Names no country. Lead: "TravelMudra lists a destination here only after it approves the destination for public listing." Block: "No destination is listed yet." The page stays in navigation and the sitemap (decision PM Q-03, WP-20.md §3). |
| WP20-A23 | Pass | E1, E8 | `/countries/france`, `/countries/x` and `/countries/synthetica` (a slug of the launched synthetic catalogue) answer the public not-found page, 404, noindex. Crawl A07 pass. |
| WP20-A24 | Pass | E2 | Footer: About, Destinations, How it works, "Sign in for travel agents". No `/privacy`, `/terms` or placeholder legal text. |
| WP20-A25 | Pass | E1, E8 | `/` links to `/countries`, `/how-it-works`, `/about` in the visible navigation. The current item has `aria-current="page"`, a 3 px underline bar, weight 650 and a tint. On `/` no item is current, because the navigation has no Home item. Crawl A01 pass. |
| WP20-A26 | Pass | E1, E2, S | 390 px: one column (blocks and lists stacked at x = 16). Wordmark and "Sign in" visible at both widths with no menu button; the navigation wraps to two rows. Body text 16 px; lead 20 px; h1 28, h2 24, h3 20 px. |
| WP20-A27 | For Max to judge | E1, S | PM observations for Max: `/` now gives a welcome and value statement, what TravelMudra does, who it serves (and does not), the six process steps, and a sign-in section with two "Sign in" entries plus the header link. Still missing because owner inputs are not supplied (input requests, not defects): a verified public contact, so a travel agent without an account has no way to reach TravelMudra (PM Q-01, C02); the approved destination list; legal pages; logo and imagery; copy approval (blocker `public_copy_unapproved`). |
| WP20-A28 | Pass | E1, E8 | Raw HTML holds the h1, every block and every link; script off and on give identical text and links, equal to the raw links. No executable script; the only `<script>` elements are `application/ld+json` data blocks that A35 requires (CSP `script-src 'none'`). Crawl A02 pass. |
| WP20-A29 | Pass | E1, E8 | One title and one description per indexable page, all different. Crawl A03 pass. |
| WP20-A30 | Pass | E1, E8 | Canonicals `https://b2b.travelmudra.co/`, `/countries`, `/how-it-works`, `/about` equal the sitemap `<loc>` values. Crawl A04 pass. |
| WP20-A31 | Pass | E8 | Crawl A05 pass. On `lane-ui` (test mode) `/about/`, `/About` and `/index.html` answer the not-found page, as designed (redirects only in production). |
| WP20-A32 | Pass | E8, E6 | Crawl A06 pass. Production `robots.txt` rendered in process: `Allow: /`, disallows exactly `/ta/`, `/ops/`, `/admin/`, `/accounts/`, `/account`, `/sign-in`, `/staff/`, `/search`, names `Sitemap: https://b2b.travelmudra.co/sitemap.xml`. |
| WP20-A33 | Pass | E8 | Crawl A07 pass. |
| WP20-A34 | Pass | E1, E8 | `lane-ui` sitemap: valid XML, exactly `/`, `/countries`, `/how-it-works`, `/about` on `https://b2b.travelmudra.co`, no duplicate, no search or private path. Crawl A08 pass. |
| WP20-A35 | Pass | E6, E8 | `/`: Organization and WebSite; `/about`: Organization; `/countries`, `/how-it-works`: BreadcrumbList. Each parses, `https://schema.org` context, name "TravelMudra", URL `https://b2b.travelmudra.co/` (decision F-04). Crawl A09 pass. |
| WP20-A36 | Pass | E6, E8 | No `address`, `PostalAddress`, `geo`, `telephone`, `email` or `openingHours`. Crawl A10 pass. |
| WP20-A37 | Pass | T | `public-site.test.ts`: "carry no address in structured data while the locality is unverified, and the verified address otherwise" (re-run, pass). Also `seo-check.test.ts`: "content with every owner input supplied has no blocker and passes every assertion the crawl runs". |
| WP20-A38 | Pass | E8, R | Crawl A11 pass in the re-run and the record. |
| WP20-A39 | Pass | E1, E2, E8 | Every page request is to 127.0.0.1:4650 (HTML, nine style sheets, one font). No third-party request. Crawl A12 pass. See the axe preload observation above. |
| WP20-A40 | Pass | E1, E3, E8 | CSP has `script-src 'none'` and `connect-src 'none'` on every public answer; no `Set-Cookie`, signed out or signed in. Crawl A13 pass. |
| WP20-A41 | Pass | E1, E8 | `lang="en-IN"`, `charset="utf-8"`, viewport meta, one h1, no images. HTML 2.9 to 6.2 KB; with style sheets and font about 149 KB transferred. Crawl A14 pass. |
| WP20-A42 | Pass | E1, E8 | `q=visa`: "4 public pages match “visa”." with links to `/`, `/about`, `/countries`, `/how-it-works`, each with title and description. `q=<b>x</b>`: shown as text in the no-match sentence, not as markup. 101 characters: "Search terms are too long. Use at most 100 characters." Crawl A15 pass. |
| WP20-A43 | Pass | E6 | "No public page matches “zzqxv”." then "Try other words, or open one of these pages:" with links to Home, Destinations, How it works, About. |
| WP20-A44 | Pass | E1 | `/search` shows the labelled form only: no result list, no count. |
| WP20-A45 | Pass | E5 | After the limit: status 429, "Too many searches from this connection in a short time. Wait a minute, then search again." No result list and no "No public page matches". The empty form still answers 200. |
| WP20-A46 | Pass | E1, E6 | 404, noindex, public header, environment label, link to `/`; the requested path is not echoed. |
| WP20-A47 | Deferred (decision PM Q-02) | R, E8 | Every check on the record passes: exit 0, A01 to A15, crawled pages exactly the four indexable pages, `contentSha256` `7c2aa22d…` and renderer and configuration digests equal the tree at 9efb379, no file under `content/public/` or `src/web/public/` changed after `sourceCommit` 5280b9c, `seo-check.md` holds every required field, and `seo-record.test.ts` passes. Open: WP-20.md §5 does not yet cite the record by repository and commit ("filled at integration"). The architect closes it at the WP-20 integration commit. |
| WP20-A48 | Pass | E8 | `--strict` exits 1 with five blockers: the four of this item plus `public_copy_unapproved` (decision PM Q-05, WP-20.md §3). No other blocker. |
| WP20-A49 | Pass | E1, R | `contentVersion` is `2026-10-12.1` (was `2026-10-05.1`). |
| WP20-A50 | Pass | E1 | 12 addresses × 2 widths: first Tab reaches "Skip to main content"; Enter moves focus to `main`; Tab order equals DOM reading order and reaches every link and control; no hover-only control. Focus ring 2 px solid ink, contrast 12.0 to 14.4 : 1 with the adjacent background; no focused element covered. |
| WP20-A51 | Pass | E1, E7, E8 | Each page: one banner, one navigation labelled "Site", one main, one contentinfo, one h1; each block has an h2; no skipped level (h1 → h2 → h3). The search page adds a `search` landmark for its form. Crawl A14 pass. |
| WP20-A52 | Pass | E1, S | 320 px and 1280 px at 400% zoom (320 × 256 CSS px): `scrollWidth` equals the viewport on 10 addresses; no text, link or control outside the viewport. |
| WP20-A53 | Pass | E1, E7 | Visible label "Search the public pages", tied to the search field. |
| WP20-A54 | Pass | S, E1 | Greyscale views: the environment label is text with a bold lead; the current navigation item has a bar and heavier weight; search messages are sentences. |
| WP20-A55 | Pass | E1, E7 | The count sentence ("4 public pages match “visa”.") is the first element after the form; focus is on the document at load (no focus move). |
| WP20-A56 | Pass | E2, T | 390 px: no target under 24 × 24 px. "Sign in" (header and home) 102 × 44 px; search button 358 × 44 px. axe `target-size` passes. T: `gallery.test.ts` "… no serious axe violation" covers the public gallery pages. |
| WP20-A57 | Pass | E1, E2, T | axe `color-contrast` passes on every page at both widths. Focus ring contrast at least 12 : 1. T: `gallery.test.ts` axe runs in light and dark at 1440 and 390 px. |
| WP20-A58 | Pass | E1 | With reduced motion: largest transition 0.00001 s, no animation, before and during focus and hover. |
| WP20-A59 | Pass | E7 | The label is a paragraph in the banner ("Test environment. Synthetic data only."); its icon is `aria-hidden`. |
| WP20-A60 | Pass | E6, E7 | Link names: "Skip to main content", "TravelMudra Visa services for travel agents", Destinations, How it works, About, Search, "Sign in", "Sign in for travel agents", Home, and the page titles in search results. No "click here" or "read more". |
| WP20-A61 | Not proven | — | Not run: it needs human participants on a phone. No agent substitute. |
| WP20-A62 | Pass | E1 | `/`: 0 violations at 1440 and 390 px. |
| WP20-A63 | Pass | E1 | `/countries`: 0 violations at both widths. |
| WP20-A64 | Pass | E1 | `/how-it-works`: 0 violations at both widths. |
| WP20-A65 | Pass | E1 | `/about`: 0 violations at both widths. |
| WP20-A66 | Pass | E1 | `/search` (empty): 0 violations at both widths. |
| WP20-A67 | Pass | E1 | `/search?q=visa`: 0 violations at both widths. |
| WP20-A68 | Pass | E1 | `/search?q=zzqxv` and the long-query refusal: 0 violations at both widths. |
| WP20-A69 | Pass | E1 | `/no-such-page`, `/countries/x` (and `/countries/france`, `/countries/synthetica`): 0 violations at both widths. |
| V25 proof | Pass | E3, E4, E8, R, T | A1: exit 0, A01 to A15, exactly the four pages (re-run without `--report` on instruction; digests read from the run summary). A2: five blockers (decision Q-05). A3: content, renderer and configuration digests equal the committed report. A4: `--strict` exit 1. B1 variant: no marker case created; catalogue markers taken from `syn-ta-3`; the byte-identity proof (E4) replaces the marker case. B2: crawl reached `/`, `/countries`, `/how-it-works`, `/about`, `/search` (all 200 HTML); `/sign-in` is linked with `rel="nofollow"` and was not followed. B3 to B9: as A15, A16, A11, A42, A01 to A04, A14, A36, A17. C: `public-site.test.ts` verified-address test (A37). |

## 7. Findings of the acceptance run

| ID | Rank | Items | Finding | Scenario and likelihood | Proposed action |
|---|---|---|---|---|---|
| F-01 | P2 | WP20-A12 (`/how-it-works` part), WP20-A20 | `/how-it-works` does not state that a TravelMudra operator works on each application. Step 5 on `/` states it ("A TravelMudra operator works on each application."). The "Follow the work" block on `/how-it-works` names only who the application waits on. | A travel agent opens "How it works" from the home page or from search, reads only that page, and does not learn that a TravelMudra operator handles each application. Likelihood: every reader of that page; impact low, because `/` states the fact and the copy is draft until Max approves it (`public_copy_unapproved` keeps the site out of indexes). | Park as a note (P2). Add one sentence to the "Follow the work" block of `content/public/pages.json` in the copy-approval change, then re-run `tm seo check --report` (the content digest changes). |
