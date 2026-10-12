# WP-20 W1 and W2 notes: schema, renderer and content

Lane `ui-revamp-2026-10-12`. Units W1 (schema and renderer) and W2 (content). Author: Principal Software Engineer
(Claude subagent). Date: 12 October 2026. Base: lane branch at 7613606, working tree (not committed; the architect
integrates). Inputs: `WP-20-design.md`, `WP-20.md` §3 (the architect's decisions govern), `WP-20-acceptance.md`.

Writing style: ASD-STE100 at about 75%.

## 1. Files

| File | Change |
|---|---|
| `src/web/public/content.ts` | Typed blocks (`text`, `countries`, `sign_in`, `business_details`); `copyApproval`; new whole-site rules; fifth blocker; `sectionId`, `copyApproved` |
| `src/web/public/site.ts` | Rewritten renderer: blocks by kind, `environment` option, label and "[TEST]", indexing invariant, header, footer, JSON-LD rules, search states, not-found page; static pages rendered once at start-up |
| `src/web/public/search.ts` | `SearchAnswer` kind `empty` renamed `no_terms`; comment |
| `src/web/public/routes.ts` | Unknown or malformed slug answers `site.fallback(...) ?? site.notFound()`; new `publicNotFoundFallback(site)` |
| `src/apps/edge/instance.ts` | `environment: config.env`; `publicFallback: publicNotFoundFallback(site)` |
| `static/css/public.css` (new, 5.4 KB) | Public layout in `@layer components` |
| `static/css/app.css` | One line: `@import url('public.css');` after `components.css` |
| `static/favicon.svg` | Recoloured to ink `#172D35` on paper `#F5F4F0` (neutral interim mark; never a `logo`) |
| `content/public/site.json` | `contentVersion` `2026-10-12.1`; `copyApproval` `unapproved`; locality and contact stay `unverified` |
| `content/public/pages.json` | Design §5 copy in the block schema; `updatedOn` `2026-10-12` on every page |
| `scripts/dev/gallery/public.ts` (new) | `publicGalleryPages(): Promise<GalleryPage[]>`, 11 pages |
| `test/unit/public-site.test.ts` | 26 tests |
| `test/unit/public-content.test.ts` (new) | 4 tests |
| `test/unit/bff.test.ts` | The public-site options case passes `environment: 'test'` |

`content/public/countries.json` is unchanged (`[]`).

## 2. Block model

- A page is `sections: Section[]` in reading order. `Section` is a union on `kind`. Every block MAY have an `id`
  (slug, at most 40 characters); the default is `section-<n>`.
- `text`: `heading`, `paragraphs` (0 to 12), `lists` (0 to 3; each `heading?`, `ordered`, 1 to 12 `items`). It MUST
  have a paragraph or a list (`section_empty`). The renderer shows paragraphs, then lists. Two or more lists sit side
  by side from 48rem. An ordered list renders as the numbered process steps.
- `countries`: `heading`, `whenEmpty` (`omit` or `statement`). With no approved country: nothing, or the statement
  "No destination is listed yet. Signed-in travel agents see the services that are open for their account." With
  countries: an alphabetical list. `/countries` shows each name with its summary; other pages show names in columns.
- `sign_in`: `heading`, 1 to 4 `paragraphs`. The renderer adds the primary "Sign in" button and, only when
  `site.json` `contact` is verified, "To ask about an account, write to [email]."
- `business_details`: `heading`. The renderer shows a definition list (Address, Email, Telephone) of the verified
  facts. With nothing verified the block renders nothing.
- Blocks are `<section id>` with an `h2` and no accessible name (DV-04). List headings are `h3`.
- New refusal codes of `validateContent`: `duplicate_section_id` (ids `main` and `q` are reserved), `duplicate_block`,
  `home_sign_in_missing`, `countries_block_missing`, `country_title_too_long` (above 70 characters). `listsCountries`
  is removed. A section in the old shape fails `pages_invalid`.

## 3. Architect's decisions (WP-20.md §3) and how they are met

| Decision | Implementation | Proof |
|---|---|---|
| F-01 not-found page | The country route answers `answer ?? fallback ?? notFound` as a `public` result. Edge's `publicFallback` answers `fallback ?? notFound` for every unmatched GET on the public surface, except `/assets/` paths. The slug parameter accepts any segment, so a malformed slug also reaches the public page. | `public-site.test.ts` › public routes at edge (3 tests) |
| F-02 indexing | `indexing = o.indexable && o.environment === 'production'`. It drives page robots, `robots.txt` and the sitemap headers. | › outside production every answer is noindex and robots.txt disallows everything (covers `indexable: true` in `test` and `local_test`) |
| F-03, F-04 | The home `countries` block has `whenEmpty: 'omit'`. JSON-LD: `/` has `Organization` {name, url} and `WebSite`; `/about` has `Organization`; other content pages and country pages have `BreadcrumbList`; search and not found have none. No `logo`, `TravelAgency`, `areaServed`, `geo`, `openingHours`, `Offer`, `SearchAction`. With a verified locality: `["Organization","TravelAgency"]` with a `PostalAddress` of exactly the five fields. | › home shows the blocks…; › carry Organization and WebSite only…; › carry no address in structured data… |
| Typed blocks, omission | §2 | › home shows the blocks in content order…; `public-content.test.ts` › the home page holds its blocks in reading order |
| Environment label, "[TEST]" | WP-01 `environmentLabel(env)` is the first child of `<header class="shell-header">`. `titlePrefix(env)` is applied to `<title>` and `og:title`. Production output has neither. | › a test installation shows the environment label… (every page, search and not found; `test` and `local_test`) |
| Q-01 account route | The `sign_in` block copy states that TravelMudra sets up accounts and that they cannot be requested on the site. The contact line appears only with a verified contact. No form, no registration link. | › home shows the blocks…; › carry no address… (contact line with the fixture) |
| Q-03 `/countries` | The page keeps a `countries` block with `whenEmpty: 'statement'` (validation requires it). It stays indexable and in the sitemap. | › /countries states that no destination is listed… |
| Q-05 copy approval | `copyApproval` is `{status: 'unapproved'}` or `{status: 'approved', approvedOn, contentVersion}`. `public_copy_unapproved` closes only when the approval names the current `contentVersion`. | › closes the copy blocker only for the approved content version |
| Favicon | Recoloured to ink. It is never used as a `logo`. | — |
| DV-03 | Headings stay at 28/24/20 px. The lead is 20 px. `--text-3xl` and `--text-4xl` were already absent from `tokens.css` at 7613606. | — |

## 4. Interface for W3 (check tool)

- `PublicSiteOptions.environment: TmEnv` is REQUIRED. The check passes `'production'`.
- `PUBLIC_BLOCKERS` order: `public_locality_unverified`, `public_contact_unverified`, `public_legal_pages_unsupplied`,
  `public_no_supported_country`, `public_copy_unapproved`. `contentBlockers(content)` is the one source.
  `copyApproved(site)` is exported.
- Environment label: element `p.env-label`, text "Test environment. Synthetic data only.". The title prefix "[TEST] "
  is on `<title>` and on `og:title`.
- Not-found page: status 404; header `x-robots-tag: noindex, nofollow`; meta robots `noindex,nofollow`; no canonical
  link and no `og:url`; the requested path is not echoed; links to `/`, `/countries`, `/how-it-works`, `/about`.
- `site.answer()` still returns `null` for an unknown path. The check's own `siteServe` decides its fallback.
- Search text: "Search terms are too long. Use at most 100 characters." (A15 still matches). The first indexable
  page after `/` is `/countries`; its `h1` "Destinations" finds `/countries`.
- Renderer digest: `static/css/public.css` is new. `src/cli/seo/digest.ts` covers it through `static/css/*.css`. The
  public pages also load `static/favicon.svg`, which the digest does not cover (P2 note for W3: a favicon change does not
  make the record stale).
- Scratch run (working tree, not evidence): `tm-seo-check/2`, A01 to A15 pass, crawled `/`, `/countries`,
  `/how-it-works`, `/about`, five blockers, content SHA-256 `7c2aa22d…`.

## 5. Deviations and choices not fixed by the design

| ID | Choice | Reason |
|---|---|---|
| W1-D1 | `/assets/` paths are excluded from the public not-found fallback | Asset failures also go through the server's error handler, which answers the BFF page. The exclusion keeps one answer for every asset miss. Without it, the answer depends on which handler fails. |
| W1-D2 | The not-found page has no canonical link and no `og:url` | A 404 page should not claim a canonical URL. |
| W1-D3 | The country page breadcrumb is a text line (`p.public-crumbs`), not a `nav` | WP20-A51: one navigation landmark. JSON-LD keeps the breadcrumb. |
| W1-D4 | The home secondary action "How it works" links to `/how-it-works` | It is a crawlable page with more detail than block 6. |
| W1-D5 | The header "Sign in" is a full-size button (44 px), not `button--small` | AC-10 / WP20-A56. |
| W1-D6 | `Organization` carries `email` and `telephone` when the contact is verified, also while the locality is not | These are verified facts. The design §8 table does not cover that state. |
| W1-D7 | Static pages are rendered once at start-up | A content problem shows at start, not on the first request. |
| W2-D1 | Block 6 has its paragraph before the list: "A travel agent works with TravelMudra on each application in these steps. Processing times are estimates, not guarantees." | The schema renders paragraphs, then lists. |
| W2-D2 | `/how-it-works` sign-in block (design: "short"): "Travel agents sign in with the account that TravelMudra set up for their agency. Accounts cannot be requested through this website yet." | Draft copy, CR-09. |
| W2-D3 | `/countries` block heading "Listed destinations"; `/about` "Who TravelMudra serves" has the two lists only | The design gives no text for these. |

All copy is draft until Max approves it (`copyApproval`).

## 6. Items for the architect

1. Gallery registration: `publicGalleryPages()` is asynchronous; `renderGallery` must await it. Remove the
   `publicPage()` demo. After that, `PUBLIC_NAV` in `src/web/ui/shell.ts` has no consumer and still says "Countries"
   (P2: dead code).
2. `test/ui/gallery.test.ts` › "canonical URL, unique title and description, structured data, indexable" fails once
   the public pages are registered. It asserts no robots meta, exactly one `Organization` JSON-LD block and unique
   titles. The real test-installation output is noindex (F-02), the home page has `Organization` and `WebSite`, and two
   gallery home pages share a title. Proposal: for public gallery pages, assert noindex, the "[TEST]" title and the
   label instead. Search readiness is proved by `public-site.test.ts` and `tm seo check`.
3. Scratch sweep of the 11 public gallery pages (the gallery's own axe tags, plus `best-practice`, under `PUBLIC_CSP`;
   1440 and 390 px, light and dark; overflow at 360 and 320 px): 73 of 73 pass. No serious, critical, moderate or minor
   axe violation.
4. `test/system/refusals.test.ts:54` needs `environment: 'test'` (the only typecheck error from W1).
5. `test/system/web-shell.test.ts` pins the old not-found behaviour (F-01 changes it on purpose); its other tests pass.
   (a) Line 86, case "edge: not found": the answer now carries `PUBLIC_CSP` and meta robots `noindex,nofollow`.
   (b) Line 244: asset 404 bodies are compared with `/no/such/page`, which is now the public page. Use an asset miss
   (for example `/assets/0000000000000000/css/app.css`) as the reference.
6. The optional part D system test (`test/system/public-crawl.test.ts`) is not written: it is outside the W1 files.
   Traceability row T-C52 stays "partial". Test titles cited by `docs/verification/traceability.md` (T-C08, T-C52,
   T-C53) are kept.
7. The SuperAdmin public-site page shows `public_copy_unapproved` as its code until SA-05 adds its sentence.
8. Input requests to Max: the verified public contact (C02, Q-01) and the copy approval for `2026-10-12.1`.
9. Failures from other units seen during the checks (not fixed): typecheck `src/apps/shared/identity-routes.ts:171`;
   `npm run test:ui` › `test/unit/web/packet-handover.test.ts` › "when they cannot be read, none: each row reads as
   core's answer".
