# WP-01 U5 notes: access and service state pages, operation status page

Unit U5 of WP-01. Author: the U5 engineer, 12 October 2026. Input for the architect's integration and the
`DESIGN.md` update. U5 commits nothing; the architect integrates. Binding inputs: `WP-01-design.md` §2.1 R12 and
R14, §5, §7.5, §8, §10 (U5 row), §11 (F-02, F-04, F-05, Q-16); `WP-01.md` §3 and §4.1. Amendments A-08 and A-09
govern where they differ from the design.

## 1. Files

| File | Change |
|---|---|
| `src/web/pages/status.ts` | Rewritten. One page anatomy (h1 through `pageHeader`, then a tone block without a heading: sentences, reference code, links). New `unavailablePage(env)`. `maintenancePage` and `unavailablePage` always render the status document. `PageEnv` gains `signInHref?` and `reloadable?`. Closed `CODE_TEXT` table replaces `CODE_MESSAGES`. |
| `src/web/pages/operation.ts` | Rewritten on U3's `unresolvedBanner` (`headingLevel: 'none'`) under `pageHeader({ title: operationStatusTitle(state), freshness: checked })`. New outcome `unavailable`. New options `checkedAt`, `resultLabel`. |
| `src/apps/shared/common-routes.ts` | `resultHrefOf(surface, resource, hasPage)`, `resultLabelOf(resource)`, `OperationSurface`. The route catches a failed status read (closed category set) and answers "Status unavailable" in the page. |
| `src/web/ui/presentation.ts` | `ERRORS` table only (§4). |
| `scripts/dev/gallery/status.ts` (new) | `statusGalleryPages()` (9 signed-in pages) and `statusDocumentPages()` (5 status documents). |
| `test/unit/web/status-pages.test.ts` (new) | 21 tests: page copy, byte identity, closed documents, every category, refusals, operation states, the result map, and the route in front of a scripted core. |
| `test/system/web-shell.test.ts` | No-access copy and links; operation page copy; A-08 identity of a foreign and an unused key. |
| `test/system/lifecycle.test.ts` | V23-5 maintenance assertions; busy copy. |
| `test/system/capacity-pages.test.ts` | Service page assertions; no "Try again" for a posted form. |

## 2. Page states and copy

One h1 per page. Every page carries the environment label and "[TEST]" (through `statusDocument` or the shell).

| State | Function | Status | h1 | Body | Links |
|---|---|---|---|---|---|
| No access (denied, not found, access changed, malformed id, unknown path) | `notFoundPage`; `errorPage` for `not_found_or_forbidden` | 404 | You do not have access to this page | Your access may have changed. If you followed a link, the link may be wrong. Nothing about the page is shown here. | Signed in: "Go to your home" (surface home). Signed out: "Sign in" (`signInHref`, else `/home`). |
| Maintenance (`installation_closed`, `release_mismatch`) | `maintenancePage`; `errorPage` for `maintenance` | 503 | TravelMudra is closed for maintenance | You cannot sign in or make changes while it is closed. No reopening time is published here. | None. |
| Core unreachable | `unavailablePage`; `errorPage` for `unavailable_dependency/core_unavailable` | 503 | TravelMudra is unavailable now | TravelMudra cannot be reached right now. Nothing was sent, so nothing changed. Do not send a request again until it is back. Try again in a few minutes. Reference code: core_unavailable. | "Try again" only for a page read. |
| Busy (`capacity_limited`) | `errorPage` | 503 | TravelMudra is busy | `capacity_connections`, `capacity_streams`: "TravelMudra is answering as many requests as it can. This request was not run, so nothing was saved. Try again later." Other codes: "not completed", statement timeout, storage, queue variants; all end "Try again later." Reference code. | "Try again" for a page read; else home (signed in) or none. |
| Restarting (`stale_writer`) | `errorPage` | 503 | TravelMudra is restarting | This request was not completed, so nothing was saved. Try again later. Reference code. | As busy. |
| Too many requests (`rate_limited`) | `errorPage` | 429 | Too many requests | Too many requests in a short time. Try again later. Reference code. | Home (signed in) or none. |
| Not confirmed (`outcome_unknown`, surfaces without an operation page) | `errorPage` | 503 | TravelMudra did not confirm the result | Do not start the task again from a new form. Go back to the form you sent and send it again: TravelMudra recognises the same request and does not repeat it. Reference code. | Home (signed in) or none. |
| Not completed (`internal`) | `errorPage` | 500 | The request was not completed | An internal error stopped this request. Nothing was confirmed. Try again. If it happens again, note the reference code. Reference code. | Home (signed in) or none. |
| Refused (`csrf_invalid`, `origin_invalid`, `host_invalid`) | `refusalPage` | 403 / 421 | Request not accepted | The code's sentence. Nothing was saved. Reference code. | Signed in: home. Signed out on the `sign_in` surface: "Open the sign-in page again" (Q-16). Signed out elsewhere: "Sign in". `host_invalid`: none. |
| Unreadable (`too_large`, `input_invalid`, `invalid_id`) | `badRequestPage` | 400 / 413 / 415 | Request too large / Request not readable | Unchanged facts. Reference code. | Home or "Sign in". |
| Signed out (P2 to P4), session ended (P5) | U4's sign-in page notices | — | — | U4 owns the copy (design §4.6). U5 has no page for them. | — |

Operation status page (`/<ta|ops|admin>/operations/:operationKey`), inside the viewer's shell:

| Core answer | Status | h1 (also the document title) | Banner body (U3 component) | Links | Freshness |
|---|---|---|---|---|---|
| `in_progress` | 200 | Checking the original result | Request [reference] is still being processed. It may still be recorded. Do not send it again. | "Check status" (same address) | Checked at [time] IST |
| `no_record_yet` (also another person's key, A-08) | 200 | Checking the original result | Nothing is recorded for request [reference] so far. It may still be recorded. Check its status again before you do anything else. | "Check status" | Checked at |
| `not_recorded` | 200 | Request not recorded | Nothing was recorded for request [reference], and it can no longer be recorded. You can start the task again. | "Go to your home" | Checked at |
| `accepted` | 200 | Request recorded | Request [reference] was recorded once. Nothing more is needed for this request. Fact "Recorded result: [kind]". | "Open the result" when `resultHrefOf` finds a registered page | Checked at |
| Read failed (A-09(b)) | the category's status (503; 429 for `rate_limited`; 500 for `internal`) | Status unavailable | TravelMudra cannot check request [reference] now. Do not send the request again. Check its status later. | "Check status" | None (§5 D-U5-2) |
| Read refused (`not_found_or_forbidden`) | 404 | The no-access page | — | — | — |
| `unauthenticated`, `maintenance` | 303, 503 | Server answer (sign-in, maintenance page) | — | — | — |

The old sentence "Submitting the same form again, with this same reference, never repeats a request." is gone (F-04). No
state contains "submit" or invites the reader to send the form again.

## 3. Amendment duties

- **A-08.** Core keys operations by actor, so another person's key and an unused key both answer `no_record_yet`.
  The page renders that answer as is (200, "Nothing is recorded for request [reference] so far"). A refused command
  leaves no record, so `not_recorded` shows no reasons. Tests: `web-shell.test.ts` compares the status text of
  syn-ta-2 reading syn-ta-1's key with syn-ta-2 reading an unused key (identical after the reference is replaced) and
  asserts no group label, "Open the result" or id of syn-ta-1; the refused group's status page shows "Request not
  recorded" and no reason words; the unit test proves the route answers 200 for `no_record_yet`.
- **A-09(a).** `maintenancePage(env)` ignores `env.signedIn` and always renders the status document: no rail, account
  menu, support-view banner, form or control. This holds whatever `PageEnv` the server passes. Tests: unit (same bytes
  for signed-in and signed-out viewers, both codes) and `lifecycle.test.ts` (signed-in TA and SuperAdmin pages and both
  sign-in pages: copy, label, "[TEST]" title, no `nav`/`form`/account menu/banner, no control, no account name or group
  name, no "planned", "lost", "restore", "reopen", "resend", "Paused").
- **A-09(b).** Two parts. (1) The operation route catches a failed `core.operation` read in the closed set
  `unavailable_dependency`, `capacity_limited`, `stale_writer`, `conflict_retry_exhausted`, `rate_limited`,
  `outcome_unknown`, `internal` and renders "Status unavailable" with that category's HTTP status. Refused,
  unauthenticated and maintenance answers keep the server's page. Tests: unit route test with a scripted core, every
  category of the set, plus the categories outside it. (2) `unavailablePage(env)` is the uniform page for a core outage
  before the session read; `errorPage` sends `core_unavailable` to it, so the page is the same for every reader.
- **F-02.** No "planned", no "nothing is lost", no reopening time. **F-05.** No "Something went wrong" anywhere in the
  `ERRORS` table or the status pages; a unit test checks every category with known and unknown codes, signed in and
  out. **Q-16.** See the refused row of §2. **R12.** "Checked at [time] IST" on the status page. **R14.** The live
  region stays silent; the operation page leads with its h1 and the banner.

## 4. Content functions and wording agreed with U4

U4's in-progress `server.ts` already builds `PageEnv` with `signInHref: signInPathFor(surface)` and
`reloadable: method === 'GET' || method === 'HEAD'`, and sends maintenance through `page(...)` (no shell). That
matches the interface below.

```ts
interface PageEnv {
  surface; assetBase; environment; signedIn?;
  signInHref?: string;   // this instance's sign-in page; default '/home' (redirects a signed-out browser to it)
  reloadable?: boolean;  // true for GET/HEAD: busy, restarting and unavailable pages offer "Try again" (href="")
}
notFoundPage(env)                 // denied = not found = access changed, byte for byte
maintenancePage(env)              // always the status document; 503 + Retry-After by the caller
unavailablePage(env)              // core outage before the session read; always the status document; 503
errorPage(env, { category, code }) // routes not_found_or_forbidden, maintenance, core_unavailable to the three above
refusalPage(env, code); badRequestPage(env, code)
```

The wording of the uniform outage page is "TravelMudra is unavailable now" with "Do not send a request again until
it is back" (A-09(b)). U4 MAY call `unavailablePage` directly at the boundary or MAY keep calling `errorPage`; both give
the same bytes.

## 5. Deviations and decisions (ranked)

| ID | Rank | Item | Reason |
|---|---|---|---|
| D-U5-1 | P2 | The status page shows one recorded fact, "Recorded result: [kind]", from the closed result map. It shows no `summary` fields. | A per-command closed formatter needs the command name (STOP-01, P-02). Unknown summary keys MUST NOT show. |
| D-U5-2 | P2 | "Status unavailable" shows no freshness line. | A read that failed checked nothing; "Checked at" next to "cannot check" would contradict itself. |
| D-U5-3 | P2 | "Status unavailable" also covers `rate_limited` (429) and `internal` (500), with their own status codes. | On this page the generic pages would say "Try again", which reads as "send the form again" (F-04 class). The status codes stay 1:1 (`test/unit/bff.test.ts` maps every category on this route). |
| D-U5-4 | P2 | The no-access page shows no reference code. | One page for every case; a code would vary or add nothing. |
| D-U5-5 | P2 | "Try again" is `<a href="">`, offered only when `reloadable`. | The address is not written into the page (no echo); a posted form is never sent again from a status page. |
| D-U5-6 | P2 | A signed-out service page (busy, restarting, internal, not confirmed) without a page read has no link. | A browser whose session core could not read may be signed in; asking it to sign in is wrong. The brand link stays. |
| D-U5-7 | P2 | `resultHrefOf` takes `hasPage` as a third parameter and also maps the SuperAdmin intake attempt page. The operator group page (`/ops/groups/:groupId`) is in the inventory without a route, so no link appears on ops. | The design's signature had no way to check registration. |
| D-U5-8 | P2 | The `ERRORS` titles also change the re-rendered forms of other pages that use `errorPresentation` (for example "TravelMudra is busy" for "At capacity"). | One table; the new titles state facts only. |

## 6. Items for the architect (ranked)

| ID | Rank | Item | Scenario | Proposal |
|---|---|---|---|---|
| F-U5-1 | P1 (must change at integration) | Three system tests outside U5 pin the old operation wording: `test/system/interrupted-work.test.ts:62` and `test/system/case-rules.test.ts:201` ("Your request was accepted"), `test/system/refusals.test.ts:260-261` and `test/system/case-rules.test.ts:218` ("No record of this request yet"). | The integrated suite fails 3 files on wording only. | Replace with `/Request recorded/` and `/Nothing is recorded for request [0-9A-HJKMNP-TV-Z]{26} so far/`. U6 reported the `refusals` case too. |
| F-U5-2 | P1 | The request limiter page in `src/apps/shared/app.ts:128-129` (U2's file) passes no `reloadable`, so the busy page there never offers "Try again" (WP01-A79). | A TA reloads during a burst; the page offers no "Try again" on the most common capacity path. | One line: pass `reloadable: req.method === 'GET' \|\| req.method === 'HEAD'` (and `signInHref` if wanted) to `errorPage` in the limiter callback. |
| F-U5-3 | P2 | In the shared working tree, `web-shell.test.ts` fails 2 tests ("edge: not found" CSP; asset traversal body equals the `/no/such/page` body) because the in-progress public-site work answers unknown public paths at edge with the public site's own 404. | — | Owner of the public site decides which page answers an unknown public path at edge; then lines 86 and 242 follow. HEAD plus U5 only: 19 of 19 pass. |
| F-U5-4 | P2 | `scripts/dev/gallery-pages.ts:439` demo flash: "We could not confirm the result." / "Submit the same form again; it will not be repeated." | The gallery teaches the F-04 wording. | Reword or drop at the `DESIGN.md` pass. |
| F-U5-5 | P2 | The `BOUNDARY.maintenance` presentation in `presentation.ts` still reads "Paused for maintenance" / "Changes are paused. Try again after maintenance ends." No page uses it now. | A later page uses the boundary kind and brings back "Paused". | Reword to "Closed for maintenance" or remove the kind, at integration. |
| F-U5-6 | — | Gallery registration. | — | Add `statusGalleryPages()` to `galleryPages()`. Do NOT add `statusDocumentPages()` there: they have no rail (the rail test fails) and are noindex (the search-ready test would treat a `public` page as indexable). Sweep them with U4's sign-in documents in a status-document sweep. |
| F-U5-7 | — | `DESIGN.md`. | — | Status page anatomy (h1, tone block without heading, reference code, at most two links); the copy table of §2; "Try again" rule (D-U5-5); the `.status-answer` class (styled by `.callout`, no new CSS). |

## 7. Checks run (12 October 2026)

- `npm run typecheck`: no error in U5 files. The shared tree has 7 errors in `src/web/public/site.ts` (another unit's
  in-progress work). A clean copy of HEAD with only the U5 files: 0 errors.
- `npx eslint` on the 9 U5 files: clean.
- `node --test test/unit/web/status-pages.test.ts`: 21 of 21 pass.
- System tests (`web-shell`, `lifecycle`, `capacity-pages`, concurrency 1): HEAD plus U5 only: 19 of 19 pass. Shared
  working tree: 17 of 19; the 2 failures are F-U5-3.
- Ad hoc browser sweep (scratch script, not committed) of the 14 gallery pages at 1440, 390 and 320 px, light and dark:
  no serious or critical axe violation, no horizontal overflow, no CSP violation, no script error.
- `npm run test:ui` (shared working tree): 473 of 474 pass. The 1 failure is `test/unit/web/packet-handover.test.ts`
  "when they cannot be read, none" (U6's in-progress `optionalView` in `src/apps/shared/core/shared.ts`), not U5.
