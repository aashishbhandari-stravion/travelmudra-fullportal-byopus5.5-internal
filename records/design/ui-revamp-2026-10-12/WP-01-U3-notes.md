# WP-01 U3 notes: command-result components and the enhancement script

Unit U3 of WP-01. Author: the U3 engineer, 12 October 2026. Input for the architect's integration and `DESIGN.md`
update. Not committed by U3; the architect integrates. Binding inputs: `WP-01-design.md` §2.1 R7, R12, R14, §4.4,
§4.5, §7, §8, §10 (U3 row); `WP-01.md` §3 and amendments A-01, A-02, A-04 (they govern where they differ).

## 1. Files

| File | Change |
|---|---|
| `src/web/ui/results.ts` (new) | CMP-08 `operationReceipt`, `receiptDocumentTitle`; CMP-10 `boundaryNotice`, `unavailableButton`; CMP-12 `freshness`, `freshnessText`; CMP-13 `unresolvedBanner`, `operationStatusTitle`, `OPERATION_STATUS_STATES`; CMP-14 `staleComparison`. |
| `src/web/ui/forms.ts` | CMP-07: `FieldError.fieldId` optional (form-level item, plain text); `errorSummary(errors, {title?, id?})`. CMP-27 `otpField`. S10 `expiringCheck`. `TextFieldOptions` gains `autocapitalize`, `extraClasses`, `fieldClasses`. |
| `src/web/ui/page.ts` | `pageHeader({freshness})`: breadcrumb row `.page-header__context` with the CMP-12 line. Unchanged markup without `freshness`. |
| `src/web/ui/index.ts` | Exports `results.ts`. |
| `src/apps/shared/core/shared.ts` | New `receiptLocation`, `ReceiptSummary`, `ReceiptExpectation`, `ReceiptRead`, `readReceipt`. Existing helpers unchanged. |
| `static/css/components.css` | Styles of the new components; `html.page-hidden main` (A-01, A-02); `.button[aria-disabled='true']`; `.callout a:not(.button)` (see §5 F-02); U1's three items (§4). |
| `static/js/enhance.js` | A-01 access change, A-02 back/forward cache, panels (Escape, focus and pointer outside), S10 expiring check, a polite `announce()`. |
| `scripts/dev/gallery/results.ts` (new) | `resultsGalleryPages()` (3 gallery pages) and `resultsFixtures()` (script fixtures under `results-test/`). |
| `test/unit/web/results.test.ts` (new) | 57 tests. |
| `test/ui/results.test.ts` (new) | Gallery sweep of the 3 pages (light and dark at 1440, 390 and 320 px) and the script tests. |

`test/unit/web/components.test.ts` is unchanged: its existing `errorSummary` and `pageHeader` cases pass, and U2 was
editing that file at the same time, so the new cases live in `results.test.ts`.

## 2. Component APIs

```ts
errorSummary(errors: readonly FieldError[], o?: { title?: string; id?: string }): SafeHtml   // FieldError { fieldId?: string; message: string }
otpField({ id, name, label, digits /* 4..12 */, hint?, error?, patternMessage? }): SafeHtml  // no value option, by design
expiringCheck({ id, expiresInMs: number | null, reloadHref, body }): SafeHtml
operationReceipt({ state: ReceiptState, facts?, current?, items?, id?, headingLevel? }): SafeHtml
  // facts: from the recorded result summary; current: read after the operation, rendered "Current [label]"
  // ReceiptState = { status: 'accepted'; title; operationKey; statusHref | null } | { status: 'unchecked'; operationKey; statusHref | null }
receiptDocumentTitle(state): string | undefined          // pass to signedInPage({ receiptTitle })
boundaryNotice({ id, action, until, owner: string | null, route?, kind: BoundaryKind, reference?, headingLevel? }): SafeHtml
unavailableButton({ label, noticeId, size? }): SafeHtml  // aria-disabled, aria-describedby = notice id
freshness(f: FreshnessInput): SafeHtml; freshnessText(f): { state, lead, at }
  // FreshnessInput = { kind: 'read' | 'checked'; at } | { kind: 'projection'; at; asOf: { healthy; lagMs } | null }
unresolvedBanner({ state: OperationStatusState, operationKey, checkHref, resultHref?, homeHref?, facts?, current?, headingLevel?: 2 | 3 | 'none', id? }): SafeHtml
operationStatusTitle(state): string
staleComparison({ fields: { label; yours; current }[], changedBy?, changedAt?, reviewHref, id?, headingLevel? }): SafeHtml
pageHeader({ ..., freshness?: FreshnessInput })
receiptLocation(path, done, operationKey): string        // throws on a non-local path, an open code or a bad key
readReceipt(ctx: AppRequestContext<unknown>, expectations: Record<string, ReceiptExpectation>): Promise<ReceiptRead | null>
  // ReceiptExpectation = { title; resource: ResourceType; id: string | null; summary: (summary: ReceiptSummary) => boolean }
```

Use on a rebuilt page: the POST answers `ctx.respond(outcome, { location: () => receiptLocation(page, 'group_created',
ctx.operationKey) })`; the GET builds its expectations for this request (kind, the resource id from its own address,
and a summary test of the command's fields), calls `readReceipt(ctx, expectations)`, renders
`operationReceipt({ state, facts, current })` as the first content of `<main>` (recorded facts from `result.summary`;
facts the page reads now go in `current`), and passes `receiptDocumentTitle(state)` as `signedInPage({ receiptTitle })`.

## 3. Amendment duties

- **A-01 (P0 class fix).** One function, `accessChanged(region)`, handles every background request. A poll answer
  that is 401, 403, 404, any redirect (`redirect: 'manual'`, so the sign-in page is never fetched), or a body whose
  first element is not the region (same id, same element type) stops every poller of the page at once (registry of
  active pollers; in-flight requests aborted; late answers ignored), empties the region, adds `page-hidden` to
  `<html>` (CSS hides `<main>`), and calls `location.replace` with the page's own address. The upload request: a 401,
  403 or 404 stops every poller first; the server's page replaces `<main>` when it has one, otherwise the page loads
  itself again. Server errors (5xx, 409, 429) and network errors still back off and keep the region (not an access
  signal). Tests (`test/ui/results.test.ts`): poll 404, poll redirected to sign-in, poll answering another page, and
  an upload refused with 404 and no page. Each asserts the region's restricted content is gone, both pollers of the
  page stopped, `<main>` hidden, no poll request while the reload is held, and the reload of the same address (the
  answer then shows Denied or the sign-in page).
- **A-02 (P0).** `pagehide` with `persisted` adds `page-hidden`. `pageshow` with `persisted` on a document whose
  `<html>` carries `data-reload-on-restore` stops the pollers and calls `location.replace`; any other restored page
  removes the class and clears the busy state as before. Tests: a real back/forward restore in full Chromium (see §5
  F-03): an unmarked page is restored as it was (proves the cache works), a marked page is requested again from the
  server and shows the new document, a marked page with a path value loads that path; plus a synthetic event test of
  the hide and show.
- **A-04, as extended by the architect after two later reviews.** Each `done` code has a `ReceiptExpectation`:
  resource kind, expected resource id (from the page's own address; `null` for a kind without an id, which then must
  carry none) and a predicate over `result.summary`. `readReceipt` returns `accepted` only when `core.operation`
  answers `accepted` and all three hold (a predicate that throws does not hold). Any other answer (`in_progress`,
  `no_record_yet`, `not_recorded`, another kind, another id of the same kind, a summary without the command's fields)
  and any failed read give `unchecked`: "Request reference [key]. The receipt cannot be checked now.", no heading, no
  acceptance word, no success tone. Facts read after the operation go in `current` and render "Current [label]"
  (`data-fact="current"`); `facts` are from the recorded summary only. Unit tests cover each answer, kind, id and
  summary mismatches, a throwing predicate, a kind without an id, three failure kinds, and the current-fact label.

## 4. U1 note items (architect's message)

Done in `components.css`: `.stepper__link` keeps the link underline (`text-decoration: none` removed); `.input` and
the file drop zone use the 2 px ring at a 2 px offset with the `--focus-halo` shadow; `.data-table` uses
`--text-sm`. The aria-disabled button uses U1's `--disabled-*` tokens.

## 5. Deviations and findings (ranked)

| ID | Rank | Item | Reason |
|---|---|---|---|
| D-U3-1 | P2 | Focus or a pointer press outside the help panel or account menu closes it but does **not** move focus back to the summary. Escape closes and returns focus (as R7, WP01-A12, A20 ask). | Moving focus back after a Tab or a click outside would undo the reader's own focus move and add a Tab stop; the acceptance items require the return only for Escape. Escape also closes `details.nav-menu` (A20). |
| D-U3-2 | P2 | "Check status" is a link to the same address (button style), not a GET form. | A GET form without fields submits to `[address]?`, so the address would change (WP01-A85). The link is the same GET without JavaScript. |
| D-U3-3 | P2 | The access-change and restore reloads use the address without its fragment. | `location.replace(location.href)` with a `#fragment` is a same-document scroll, not a reload, so the old DOM would stay. |
| D-U3-4 | P2 | `data-reload-on-restore` MAY carry a same-origin path; the restore then loads that path. | A page re-rendered at a POST-only address (enrolment confirm) has no GET at its own address (design §4.4 had a path value). U2's `restorePath` uses it. |
| D-U3-5 | P2 | A receipt read refused with `not_found_or_forbidden` shows no receipt; other non-accepted answers show the unchecked text. | Design §7.2 and SH-R05 (access changed); A-04's "otherwise" targets claims of acceptance, and showing nothing claims nothing. `unauthenticated` and `maintenance` are thrown to the page's normal error path. |
| D-U3-6 | P2 | CMP-27 "filled" (WP01-A91) is a browser state, not static gallery markup. | `otpField` has no value option, so a code is never rendered back. "Expired" and "locked" share the combined refusal text (STOP-03), shown as the refused state. |
| D-U3-7 | P2 | `unresolvedBanner` renders all five status rows, not only the first two. | U5 hosts it on the status page; `headingLevel: 'none'` drops the heading under the page's h1. |
| D-U3-8 | — | CMP-23 is not in U3. | U2 owns `environmentLabel`. |
| F-01 | P1 | A final poll fragment of `documentItem` and `pendingPanel` has no `data-poll-region` (their final state drops the poll attributes). The old script refused it as foreign (a "Reload" notice in the gallery's document list); under A-01 it would be an access change and the page would reload every cycle (U2-F2). Fixed in the script: the expected region is the first element with the same id and type; only a fragment that polls on must carry `data-poll-region`. Test: "a final fragment without poll attributes … updated in place, no reload". | Scenario: a travel agent's document finishes its check; without the fix the page reloads in a loop. |
| F-02 | P2 | `.callout a { color: inherit }` overrode button links inside callouts (axe colour-contrast on "Check status" and "Open the result"). Fixed: `.callout a:not(.button)`. | The existing operation page has the same pattern ("Check again"). |
| F-03 | P2 | The back/forward tests launch `channel: 'chromium'` (full Chromium, installed as `chromium-1243`) without Playwright's `--disable-back-forward-cache`. The default headless shell reports `BackForwardCacheDisabledForDelegate`. | A machine with only the headless shell fails these four tests; `npx playwright install chromium` provides it. |
| F-04 | P1 (architect) | `test/ui/gallery.test.ts` (not U3's file) pins the old poll behaviour: "a redirected response (expired session) stops polling with a reload message" and "a fragment for another region is refused" now fail by design (A-01). Proposed replacement: each test counts document requests for its page and asserts a second load within 6 s and `#status h1` count 0; the full assertions are in `test/ui/results.test.ts`. | Contradicts A-01; must change at integration. |

## 6. For the architect

- Register `resultsGalleryPages()` in `galleryPages()` of `scripts/dev/gallery-pages.ts`. Do **not** register
  `resultsFixtures()` as gallery pages: they navigate by themselves.
- Apply F-04 to `test/ui/gallery.test.ts`.
- `DESIGN.md`: the poll rule (last bullet of "Rules for new screens") changes to the A-01 wording; add the new
  components (§2), the freshness wording, `data-reload-on-restore`, the `page-hidden` class and the panel behaviour.
- U4: `otpField` for `code` and `totp` (no value after a refusal), `expiringCheck` around the bot check
  (`expiresInMs` = challenge expiry minus render time, null when it does not parse), `errorSummary` form-level items
  for P12 to P16, P21, P22, `boundaryNotice` for §4.7.
- U5: `unresolvedBanner` with `headingLevel: 'none'` under `pageHeader({ title: operationStatusTitle(state),
  freshness: { kind: 'checked', at: ctx.now } })`.

## 7. Checks run (12 October 2026, working tree with U1 and U2 in progress)

- `npm run typecheck`: 0 errors.
- `npx eslint` on every U3 file (`components.css` is outside the lint configuration): clean.
- `node --test test/unit/web/results.test.ts test/unit/web/components.test.ts`: 133 of 133 pass (after the receipt
  expectation change; 130 before it).
- `node --test --test-concurrency=1 test/ui/results.test.ts`: 42 of 42 pass (run again after the receipt change).
- `npm run test:ui` (first run, before the F-01 fix): 404 of 407; the 3 failures were the two F-04 tests and "the
  gallery poll demo reaches its final state" (F-01). After the F-01 fix, `test/ui/gallery.test.ts` with
  `test/ui/results.test.ts`: 127 of 129; the 2 failures are the F-04 tests only.
