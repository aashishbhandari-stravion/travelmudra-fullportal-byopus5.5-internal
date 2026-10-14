# WP-01 U4 notes: sign-in, enrolment, sign-out and the account page

Unit U4 of WP-01. Author: the U4 engineer, 12 October 2026. Input for the architect's integration and `DESIGN.md`
update. Not committed by U4; the architect integrates. Binding inputs: `WP-01-design.md` §4, §5 (sign-in and session
rows), §6, §8, §10 (U4 row), §11 (F-01, F-03, F-06; D-02, D-03, D-12, D-13); `WP-01.md` §3 and amendments A-02 (part),
A-03, A-05, A-06, A-07, A-09. The amendments govern where they differ from the design.

## 1. Files

| File | Change |
|---|---|
| `src/apps/shared/signin-address.ts` (new) | Sealed address cookie (`createAddressSeal`, `normalizedAddress`, `SIGN_IN_ADDRESS_MAX_AGE_MS`, `MAX_SEALED_CHARS`); the per-request accessor (`SignInAddressCookie`, `bindSignInAddress`, `signInAddressOf`); the return path (`returnPath`, `isReturnPathShape`). |
| `src/apps/shared/surfaces.ts` | `APP_COOKIES[app].signInAddress`: `__Host-tm_signin_addr` (edge), `__Host-tm_staff_signin_addr` (staff). `app.ts` already passes `APP_COOKIES[app]`, so no `app.ts` change. |
| `src/apps/shared/server.ts` | `cookieNames.signInAddress` (optional); the address accessor bound to each request context; the cookie cleared by `setSessionCookie(token)`; `signInLocation` (`session_ended=1` when a session cookie was sent, `next` for a GET page of a signed-in surface) used by the gate and by `sendError` for `unauthenticated`; maintenance always `maintenancePage(page(...))` (no signed-in env); `respond` sends `maintenance` to the error path (never a re-render); `Clear-Site-Data: "cache"` on every answer of `sign_in.sign_out`; `PageEnv.signInHref` and `PageEnv.reloadable` filled (U5's new optional fields, see §4 D-U4-7). |
| `src/apps/shared/identity-routes.ts` | Rewritten handlers: email step GET (notices, prefill, `next`), request POST (A-03, A-06, S8, S10, P13 to P17), verify GET/POST (S9 line, P19 to P24, A-07), sign-out (F-01), enrolment open (E2 to E4), confirm (E7 to E12, F-06). Route ids, paths, actions and commands unchanged. |
| `src/apps/shared/pages/identity.ts` | Rewritten sign-in and enrolment pages with `otpField`, `expiringCheck`, form-level `errorSummary` items and `boundaryNotice`; closed copy table `SIGN_IN_TEXT`; `signInNotice`; new `signInUnknownPage` (A-07), `setupUnknownPage` (E12), `setupPageWith` (sync set-up page with a ready QR image; `setupPage` wraps it); account page per design §6. Exports used by other modules (`messageOf`, `problemsOf`, `shape`, `statusOf`, `ROLE_LABEL`, `STATUS`, `statusPresentation`, `homeSurfaceOf`, `MESSAGES` behaviour) unchanged. |
| `scripts/dev/gallery/sign-in.ts` (new) | `signInGalleryPages()`: 10 pages (see §5). |
| `test/unit/signin-address.test.ts` (new) | 13 tests: seal/open, expiry, tamper (version, IV, ciphertext, tag, cut, extended), wrong nonce, wrong key, oversize, malformed; normalization; unbound context; return path accepted, hostile shapes, unknown/POST-only/public/sign-in/other-instance paths; through a BFF with a scripted core that records keys like core: A-06, A-03, cookie attributes, cookie in another browser, outcome unknown drops it, sign-in clears it. |
| `test/unit/web/sign-in-pages.test.ts` (new) | 26 tests: rendered pages (email step TA and staff, used form, expired check, notices, code step, staff code step, unknown sign-in, enrolment E8, account page) and through a BFF with a scripted core (S8, S10, P13 to P15, P8, P16, P17, P19, P21, A-07, P23, `session_ended` + `next` round trip, hostile `next`, sign-out answers + `Clear-Site-Data`, maintenance after a resolved session, session-read outage, CSRF refusal link, staff combined failure, reused TOTP, E8, E7, E12, E4). |
| `test/unit/bff.test.ts` | One assertion: the `unauthenticated` redirect is now `/sign-in?session_ended=1&next=%2Fta%2Foperations%2F…`. |
| `test/system/sign-in.test.ts` | Identical-answer test normalizes the named address and asserts the S9 line; `:80` text "This check needs JavaScript"; new describe "the sign-in steps at edge" (4 tests, real core): S8 Back conflict → fresh 409 form → works; A-06 replay keeps B, other browser sees no address, A-03 mixed-case replay; S10 expired proof; F-01 "Sign out everywhere" → `signed_out=all` + `Clear-Site-Data`, other browser → `session_ended=1&next=…` → sign-in returns to the page. |
| `test/system/flows.test.ts` | Account-page assertions (no "Work areas", grant fact and notice, no `/accounts` link, no grant section without the grant) and the two signed-out redirects now with `next=%2Faccount`. |

## 2. Amendments and findings: how each is met and tested

| Item | Implementation | Test |
|---|---|---|
| A-02 (U4 part) | `sendResult` sets `clear-site-data: "cache"` for route `sign_in.sign_out`, on every result kind. | Unit: 5 sign-out answers each carry the header. System: "Sign out everywhere" carries it. |
| A-03 | `normalizedAddress` (trim, lower-case, ≤ 320) in `requestCode` for TA and staff. The cookie stores the same normalized value. | Unit (scripted core records keys): mixed case with spaces replays (303, not 409); core received the lower-cased value. System: real core, mixed-case identical retry → 303. |
| A-05 | Envelope `version(1) ‖ IV(12, random per seal) ‖ AES-256-GCM(JSON {a, e}) ‖ tag(16)`, base64url. AAD = `tm-signin-address-v1|v1|<pre-session nonce>`. Key = HMAC-SHA-256(CSRF key, `tm-signin-address-v1`). Open refuses: non-string, > `MAX_SEALED_CHARS` (1831), non-base64url, short, wrong version, bad tag/AAD/key, bad JSON or shape, `e ≤ now`, `e − now > 15 min`. Cookie: HttpOnly, Secure, SameSite=Lax, Path=/, Max-Age=900, cleared by `setSessionCookie(token)`. | Unit: expiry (at, after, clock behind), tamper of 7 byte positions + cut + extended + version byte, other nonce, other key, oversize and malformed, IV differs per seal, attributes on the Set-Cookie line, copied cookie does not open in another browser (unit and system), sign-in clears it. |
| A-06 | `address.remember(email)` only when `outcome.status === 'accepted' && !outcome.replayed`. | Unit and system: request A, request B, replay A (303, no Set-Cookie for the address) → code step names B. |
| A-07 | Verify `outcome_unknown` (TA and staff) → `signInUnknownPage`, 503: "The sign-in result is not known. Request a new code and sign in again." + "Request a new code" (`/sign-in?resend=1[&next]`). No verify form. | Unit: TA and staff, no `form[action=…/verify]`, link present. |
| A-09(a) | `sendError`: maintenance → `maintenancePage(page(surface, method))`, never `pageFor`; `respond`: `maintenance` → error path; sign-in handlers send maintenance to `ctx.fail` (P17). U5's `maintenancePage` also forces the status document. | Unit: signed-in GET whose page read answers maintenance → 503, no rail, no account menu, no sign-out form, no display name. Request POST maintenance → 503 page without a form. |
| A-09(b) | Session read failure leaves `SESSIONS` null, so `errorPage(pageFor)` is the status document; U5's `errorPage` routes `core_unavailable` to `unavailablePage` (wording "TravelMudra is unavailable now … Do not send a request again until it is back"). | Unit: session read `core_unavailable` with a session cookie → 503, no shell, no name, `core_unavailable` reference; a POST is not sent on (503). |
| F-01 | Sign-out reports core's answer: `this` → `signed_out=1`; `all` accepted → `all`; `all` rejected or unknown → `unconfirmed`; the cookie is cleared either way. | Unit: 5 combinations. System: real `all` → `signed_out=all`, notice text. |
| F-03 | Only address problems mark `#email`; bot check marks `#altcha`; every other refusal is a form-level item. | Unit: rate limit, capacity, two unavailable codes → no `aria-invalid`; email and synthetic → `#email`. System: S8 → no `aria-invalid`. |
| F-06 / E8 | Confirm `stale_revision` → set-up page again with current key and revision, 409, form-level "This set-up changed…". | Unit (render and through BFF). |
| D-02 | As A-05. | As A-05. |
| D-03 | `next` = request path of a GET on ta/ops/admin/accounts/self (not `/home`), shape-checked by the server; carried as query on the sign-in pages and as hidden field `next`; checked again against the inventory GET pages of a signed-in surface served by this app (`returnPath`); after sign-in 303 to it, else `/home`. A signed-in browser opening `/sign-in?next=…` goes to `next`. | Unit: hostile list (absolute, `//host`, backslashes, `%2F`, query, fragment, dot and empty segments, whitespace, scheme), unknown, POST-only, public, sign-in, other-instance, non-string, overlong; round trip through the BFF; hostile `next` in query and in the posted form → `/home`. System: real round trip lands on `/ta/applications`. |
| D-12 | One combined text per path (TA field `code`; staff form-level). | Unit and system. |
| D-13 | Path line text only; no link to the other instance. | Unit: no `a[href*="staff"]` on edge, no `/sign-in` link on staff. |
| Q-13 | No lifetime or attempt numbers on the sign-in, code, help and enrolment pages (also "72 hours" of the enrolment code, `identity.enrolmentTtlMs`). The bot check's own remaining minutes come from the challenge. "[n] tries left" on the set-up stays (read from core). | Unit: regex over the email and code steps. |
| Q-16 | Server fills `PageEnv.signInHref`; U5's `refusalPage` labels the link "Open the sign-in page again" on the sign-in surface. | Unit: CSRF-refused sign-in POST → 403 with `main a[href="/sign-in"]`. |

## 3. Copy (closed table `SIGN_IN_TEXT` in `pages/identity.ts`)

Design §4.6 rows P2 to P25, §4.8 and §4.9 E2 to E12 are used as written, with these exact differences: P11 "This check needs
JavaScript…"; S9 line "we are sending a code" (Q-11); the verify capacity/unavailable texts mirror P14/P15 for
checking ("Sign-in codes cannot be checked now…", "Checking sign-in codes is unavailable…"); a used verify form:
"This form was already used, so nothing new was checked. The form below is new. Enter the code again."; enrolment
used form and enrolment limit have their own sentences. Account-grant notice: "Work under the accounting grant is
unavailable until the product owner defines the accounting actions. Owner: product owner." Staff address notice:
"Changing a staff sign-in address is unavailable until the product owner approves a rule for it. Owner: product
owner." with reference `staff_email_change_unavailable`.

## 4. Deviations (ranked)

| ID | Rank | Deviation | Reason |
|---|---|---|---|
| D-U4-1 | P2 | The address accessor reaches handlers through `bindSignInAddress`/`signInAddressOf` (a WeakMap keyed by the request context) instead of a field of `AppRequestContext`. | `src/apps/shared/routes.ts` is not in my file list. Optional cleanup: add `readonly signInAddress: SignInAddressCookie` to `AppRequestContext` and set it in `server.ts` (two lines), then drop the WeakMap. |
| D-U4-2 | P2 | `next` carries a path only: no query string, no fragment. A list's filter or a `?done=` code is not restored. | SH-R06 (search text must not travel in the address) and a smaller hostile-input surface. |
| D-U4-3 | P2 | P22 (same `_op` re-render) is replaced by A-07's page. E4 (enrolment opening unknown) keeps the design's same-`_op` re-render. | A-07 names sign-in verification only. An opening replay delivers no session and shows E3, so retrying the same opening is safe and truthful. |
| D-U4-4 | P2 | Staff combined code failure is a form-level item; neither field is marked. | Marking `#code` would tell that the mailed code was the wrong one; core does not say. |
| D-U4-5 | P2 | The S10 diagnostic event `bot_check_refused` (design SHOULD) is not emitted. | Handlers have no diagnostics access; needs a `routes.ts`/`server.ts` seam. |
| D-U4-6 | P2 | The address on the code step renders as `<strong class="id sign-in-address">` (mono face) so it wraps anywhere. | CSS is not in my file list. Proposal: `.sign-in-address { font-family: inherit; overflow-wrap: anywhere; }` in `components.css`, then drop `id`. Also unstyled hooks: `.sign-in-path`, `.sign-in-line`, `.sign-in-actions`. |
| D-U4-7 | P2 | `server.ts` fills U5's new optional `PageEnv.signInHref` (my Q-16 item) and `PageEnv.reloadable` (U5's "Try again"). | Only U4 edits `server.ts`; without it U5's link falls back to `/home`. Remove `reloadable` if U5 does not land it. |
| D-U4-8 | P2 | An unknown request outcome (P16) also deletes the address cookie. | Found while doing A-06: otherwise an older address could stay named while the newest code went to another address. |
| D-U4-9 | P2 | The help page's two boundary callouts use the same `boundaryNotice` text as the sign-in page. | A25 checks both pages for the §11.3 form. |
| D-U4-10 | P2 | No `next` is added for `/home`. | It already lands there. |

## 5. Gallery (`scripts/dev/gallery/sign-in.ts`)

Pages: `sign-in.html` (session ended, return path), `sign-in-used.html` (S8), `sign-in-check.html` (S10),
`sign-in-unconfirmed.html` (P4), `sign-in-code.html` (320-character address, P19), `sign-in-unknown.html` (A-07),
`staff-sign-in.html` (resend), `staff-sign-in-code.html` (combined failure), `staff-enrol-setup.html` (E8, one-pixel
PNG placeholder instead of a QR), `account-operator.html` (grant fact and notice). Register `signInGalleryPages()` in
`galleryPages()`. A scratch sweep (not committed) of the 10 pages at 1440, 390 and 320 px in light and dark: no
horizontal overflow, no CSP violation before axe, no serious or critical axe violation (WCAG 2.0/2.1/2.2 A/AA tags).

## 6. Findings for the architect (ranked)

| ID | Rank | Finding | Scenario | Proposal |
|---|---|---|---|---|
| F-U4-1 | P1 | `test/system/payments-views.test.ts:360` expects `/sign-in` for a suspended travel agent's next page. | With `session_ended` and `next` the answer is `/sign-in?session_ended=1&next=%2Fta%2Fpayments`; the test fails. Not my file; not run. | One-line change of the expected location. |
| F-U4-2 | P2 | P-04 still matters for a Unicode domain. | A travel agent types `syn@bücher.example`; core's controls convert the domain to ASCII on the first run but skip on a replay, so an identical retry conflicts (S8 text) instead of replaying. | Serve P-04 (normalize in the binding's `toInput`). |
| F-U4-3 | P2 | An enrolment session (no surfaces) that posts the staff sign-in or verify form is sent to `/home`, which answers 404. | Existing behaviour, unchanged. | Park. |
| F-U4-4 | — | Not mine, seen in checks: `test/ui/gallery.test.ts` has a syntax error at :397 (an edit in progress) so `npm run test:ui` fails that file and `tsc` reports TS1128 there; `test/unit/web/packet-handover.test.ts` "when they cannot be read, none" fails with U6's `optionalView` in progress. | — | Owners. |

## 7. Checks run (12 October 2026, shared working tree with U5, U6 and others in progress)

- `npm run typecheck`: no error in U4 files; the only errors are in `test/ui/gallery.test.ts` (F-U4-4).
- `npx eslint` on all 11 changed or new files: clean.
- `node --test test/unit/web/sign-in-pages.test.ts test/unit/signin-address.test.ts test/unit/bff.test.ts`: 53 of 53 pass.
- `TMPDIR=/tmp/u4s node --test --test-concurrency=1 --test-global-setup=test/support/global-setup.ts test/system/sign-in.test.ts`: 9 of 9 pass; `test/system/flows.test.ts`: 5 of 5 pass.
- `npm run test:ui`: 368 of 370 pass; the 2 failures are F-U4-4 (not U4 files). Run before the last added unit test (session-read outage), which passes on its own.
- Not run: the other system test files (F-U4-1 predicts one failure).
