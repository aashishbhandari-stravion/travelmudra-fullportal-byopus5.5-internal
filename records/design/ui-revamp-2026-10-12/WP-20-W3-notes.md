# WP-20 W3 notes: crawl check tool `tm-seo-check/2` and its procedure

Lane `ui-revamp-2026-10-12`. Unit W3 of WP-20 (`WP-20-design.md` §14, §16). Author: Principal Software Engineer
(Claude Opus subagent). Date: 12 October 2026. Status: implemented, not committed; the architect integrates and
commits the evidence. Writing style: ASD-STE100 at about 75%.

## 1. Files

| File | Change |
|---|---|
| `src/cli/seo/codes.ts` | `SEO_TOOL_VERSION` `tm-seo-check/2`. A07 and A11 titles widened. `SEO_BLOCKERS` and `SeoBlocker` are re-exports of `PUBLIC_BLOCKERS` and `PublicBlocker` of `src/web/public/content.ts` (one list; finding F-05). |
| `src/cli/seo/digest.ts` (new) | `REPOSITORY_ROOT`, `CANONICAL_ORIGIN`, `MAX_PAGE_BYTES`, `CHECK_CONFIG` (now with `environment: 'production'`), `configSha256()`, `rendererFiles()`, `rendererSha256()`. The check and the unit test use the same functions. |
| `src/cli/seo/check.ts` | `siteServe` passes `environment: 'production'`. A11 adds the environment-label and "[TEST]" markers. A07 also fetches an unknown country slug and requires 404 for both unknown paths. Blockers come from `contentBlockers`. The report adds `rendererSha256`. `git rev-parse` runs in the repository root. The terminal summary prints the renderer and configuration digests. |
| `test/integration/seo-check.test.ts` | Expected blockers are five. New tests (section 4). Titles of T-C50 and T-C51 in `docs/verification/traceability.md` are unchanged. |
| `test/unit/seo-record.test.ts` (new) | The stale-record test (section 3). |
| `docs/operations.md` §8 | Rewritten: report fields, §8.2 who runs the check and the evidence commit (steps 1 to 4 of design §14), the stale-record test, §8.3 the fifth owner input (copy approval), §8.4 the route-inventory rule for a new public page, §8.5 test installations. |

No file of W1 or W2 was changed. The command file `src/cli/commands/seo.ts` was not changed; its `--strict` rule
already refuses on any open blocker.

## 2. Tool changes (`tm-seo-check/2`)

- A11, on every crawled page and also on `/search`, `/no-such-page-for-the-check` and
  `/countries/no-such-country-for-the-check`: a `<title>` or `og:title` that starts with `[TEST]` fails; an element
  with class `env-label` or the body text "Test environment." fails. The markers are those of the shell's
  `environmentLabel` and `titlePrefix`.
- A07: the two unknown paths MUST answer 404 with noindex (before, only noindex was checked, and only for one path).
- Blockers: `contentBlockers(content)`. With W1's `content.ts` they are five: `public_locality_unverified`,
  `public_contact_unverified`, `public_legal_pages_unsupplied`, `public_no_supported_country`,
  `public_copy_unapproved`.
- Report fields: `tool`, `contentVersion`, `contentSha256`, `rendererSha256` (new), `sourceCommit`, `configSha256`
  (the configuration now includes `environment`, so its value changed), `checkedAt`, `pages`, `assertions`,
  `blockers`, `passed`.

Renderer digest definition (design §14 "SHA-256 over `src/web/public/*.ts` and the CSS and font files the pages
load"): every `.ts` file under `src/web/public/` (recursive), every `static/css/*.css`, every `static/fonts/*.woff2`,
each sorted per source, each hashed as `path\0length\0bytes`. Decisions inside the design:

- The digest takes the whole `static/css/` and `static/fonts/` directories, as §14 step 3 lists them, and does not
  parse the `@import` closure of `app.css`. Today both sets are equal (`app.css` imports every stylesheet, with
  W1's `public.css`). Less code, no parser to keep correct.
- `static/favicon.svg` is not in the digest (design names CSS and fonts only).
- A change under `src/cli/seo/` is covered by the tool version (`SEO_TOOL_VERSION`, with the rule in its comment and
  in operations §8.1) and by `configSha256`, not by a digest.

## 3. The stale-record test

`test/unit/seo-record.test.ts` reads `docs/verification/seo-report.json` and `seo-check.md` and asserts:

1. `tool` equals `SEO_TOOL_VERSION`.
2. `contentVersion` and `contentSha256` equal the values of `loadPublicContent(content/public)`.
3. `rendererSha256` equals `rendererSha256()`; `configSha256` equals `configSha256()`.
4. `passed` is true, every assertion A01 to A15 is ok, and `sourceCommit` is 40 hex characters.
5. `seo-check.md` contains the report's `tool`, `sourceCommit`, `contentVersion`, `contentSha256` and
   `rendererSha256` strings. The architect MUST write the renderer digest into `seo-check.md`.

Each failure message names the field, the recorded and the current value, and the regeneration commands.

State now (expected): 2 of 6 pass, 4 fail against the committed record (`tm-seo-check/1`, content `2026-10-05.1`,
no `rendererSha256`). Proof that it passes after regeneration: in a scratch copy of HEAD with the W3 files, the
regenerated record made 5 of 6 pass; the sixth failed only because the scratch copy has no git repository
(`sourceCommit` `unknown`), which is the intended refusal.

## 4. Tests and results

Commands, run in the lane working tree with W1's and W2's in-progress files present:

| Check | Result |
|---|---|
| `TMPDIR=/tmp/w3s node --test --test-global-setup=test/support/global-setup.ts test/integration/seo-check.test.ts` | 23 tests, 23 pass |
| `node --test test/unit/seo-record.test.ts` | 6 tests, 2 pass, 4 fail (stale record, expected until the evidence commit) |
| `npx eslint src/cli/seo test/integration/seo-check.test.ts test/unit/seo-record.test.ts` | clean |
| `npm run typecheck` | no error in W3 files; 1 error in `test/system/refusals.test.ts:54` (finding W3-F3) |
| `node --test test/static/*.test.ts` | 74 tests, 74 pass (traceability and refusal playbook included) |

New integration tests: `--strict` through `seoCheckCommand` exits 1 with exactly the five blockers while the report
passes; negative fixtures for an environment label, a "[TEST]" title, a "[TEST]" title on the not-found page (A11),
and an unknown country page that answers 200 (A07); the production output has no A11 or A07 problem; the real
test-installation output of `buildPublicSite` (`environment: 'test'`) fails A11 on its label and title; content with
all five owner inputs supplied (synthetic verified locality and contact, `/privacy`, `/terms`, one fictional
country, copy approval) has no blocker and passes every non-browser assertion; a copy approval of another content
version leaves only `public_copy_unapproved`.

Digests of the current in-progress tree (informative only; W1 and W2 can still change them): content `2026-10-12.1`
`7c2aa22d44a0c41f88fced4323e1f95367618aff2584fe24c7c41e7a11abfe3e`; renderer
`a9eb8b61ad211dff1b9760e57c499b6f685de7bcf8580d95b538ff568813d456`; configuration
`0dc745b1712d2ea9223da7a431ebaa9bee63a07324ff80c78a95cead6a7372ea`.

## 5. Commands for the architect at integration

In a clean working tree of the WP-20 integration commit, with `TM_CONFIG` unset and no `tm.config.json` in the
repository root (the default content directory is then `content/public`):

```bash
node src/cli/main.ts seo check --report docs/verification/seo-report.json   # exit 0, A01 to A15 pass
node src/cli/main.ts seo check --strict                                     # exit 1, the five blockers
# Update docs/verification/seo-check.md from the report: tool tm-seo-check/2, command, sourceCommit (40 hex),
# contentVersion, contentSha256, configSha256, rendererSha256, checkedAt, crawled pages, A01 to A15, the five
# blockers with what closes each (add public_copy_unapproved), the --strict exit 1.
node --test test/unit/seo-record.test.ts                                    # 6 of 6 pass
# Evidence-only commit of exactly docs/verification/seo-report.json and docs/verification/seo-check.md.
```

## 6. Findings

| ID | Rank | Finding | Concrete scenario | Proposal |
|---|---|---|---|---|
| W3-F1 | P2 | The renderer digest does not cover the shared helpers that public pages also use (`src/web/html.ts`, `src/web/ui/page.ts`, `actions.ts`, `feedback.ts`, `shell.ts`). | A later WP of this lane changes `section()` in `src/web/ui/page.ts`. The public HTML changes, the stale-record test still passes, and the record describes other HTML. Likelihood: medium during the UI revamp. | Documented rule in `docs/operations.md` §8.2 (rerun for such a change). Options for the architect: add the import closure of `src/web/public/` within `src/web/` to the digest (more false staleness, because `shell.ts` changes often), or a digest of the rendered production output. |
| W3-F2 | P2 | `docs/playbooks/refusal-codes.md:262-264` lists four release blockers; `public_copy_unapproved` is missing. Outside W3's files. | An operator reads the playbook and does not know the fifth blocker. | Add `public_copy_unapproved` to that sentence at integration. |
| W3-F3 | P1 | `test/system/refusals.test.ts:54` calls `buildPublicSite` without the new required `environment` option: `npm run typecheck` fails. Outside W3's files (W1's option). | The integration gate `npm run check` fails at typecheck. | W1 or the architect adds `environment: 'local_test'` (or the test's environment) there. |
| W3-F4 | P2 | `docs/verification/traceability.md` row T-C51 does not name the new tests. Outside W3's files. | A reviewer does not find the proof of the environment-label assertion in the traceability map. | Optional: add the new titles to T-C51 at integration. The existing titles are unchanged, so the traceability test passes. |
