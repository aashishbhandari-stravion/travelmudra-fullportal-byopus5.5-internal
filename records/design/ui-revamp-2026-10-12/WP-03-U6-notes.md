# WP-03 U6: the shell route kind "seal" (notes)

Lane `ui-revamp-2026-10-12`, base 42cb373. Governing text: `WP-03.md` §3 Q-W03-01 (orchestrator's conditions) and
§4.1 amendment C-06; design `WP-03-design.md` §6.3, §6.5, §6.6. Implementer: Claude (Opus 5.5) subagent. The
architect integrates and commits. Nothing is committed.

## 1. Scope

This unit adds the seal route kind and its token envelope. It does not add the inventory entry `ta.search.seal`
and does not change the search page (`src/apps/shared/views/ta.ts`). The tests use test routes
(`ta.seal_probe.*`, `/ta/seal-probe`).

## 2. API

### 2.1 Route model (`src/web/routes.ts`)

- `SealSpec = { target: string; field: string }`. `target` is the route id of the answer page. `field` is the one
  sealed form field (`^[a-z][a-z0-9_]{0,31}$`, so never `_csrf`, `_op` or `_rev.*`).
- `SealRouteDef = { id, method: 'POST', path, surface, action, body: 'form', seal }`. It has no handler, no command,
  no `params`, no `resolve`, no limits. The text bound (200), the lifetime (30 minutes) and the body limit (4096 bytes)
  are constants of `src/web/seal.ts`, not route fields.
- `AnyRouteDef = GetRouteDef | PostRouteDef | SealRouteDef` (closed union).
- `isSealRoute(def)` (type guard) and `routeCommand(def)` (the command, or null for a GET or seal route).
- `RouteInventoryEntry.seal`: the target route id of a seal route, else null. `command` is null for a seal route.
- `defineRoute` refusals: `seal_route_invalid` (any key outside the closed shape, a handler, a command, `params`,
  `resolve`, a limit, `body` other than `form`, a path parameter, a surface that is not `ta`, `ops`, `admin` or
  `accounts`, a bad field or target id, a GET with `seal`). A POST with neither a command nor a seal still answers
  `post_route_without_command`. A seal route with the public marker answers `public_marker_outside_public_route`.
- `createRouteRegistry` refuses `seal_target_invalid` when the target is not a registered GET route of the same
  surface whose path has no parameter.

### 2.2 BFF route types (`src/apps/shared/routes.ts`)

`AppSealRouteDef = SealRouteDef`; `AnyAppRouteDef` includes it. `defineRoute` checks it with the web rules.

### 2.3 Token envelope (`src/web/seal.ts`)

- Format: base64url of version byte `1`, a random 96-bit IV per seal, AES-256-GCM ciphertext of the JSON
  `{q, exp}`, 128-bit tag.
- Associated data: the JSON array `["tm-search-v1", 1, <session id>, <target route id>]`.
- Key: HMAC-SHA-256 of the label `tm-search-v1` under the BFF's existing `csrf_key` secret (the pattern of
  `signin-address.ts`, which is unchanged). No new secret and no new configuration key.
- Open refuses: wrong version, altered byte, another session, another target route, another key or label, a value
  longer than `MAX_SEAL_TOKEN_CHARS` (1724) or not base64url, a plaintext of another shape, an expired `exp`, and an
  `exp` more than one lifetime ahead.
- Exports: `createSealer`, `sealText` (trim, NFC, at most 200 UTF-16 code units), `createSealRateBound`,
  `bindSealOpener` (server only), `openSealToken(ctx, token)` (page code), constants `SEAL_KEY_LABEL`,
  `SEAL_TOKEN_PARAM = 'r'`, `SEAL_MAX_CHARS = 200`, `SEAL_TTL_MS = 30 min`, `SEAL_BODY_LIMIT_BYTES = 4096`,
  `SEAL_RATE_LIMIT = 30` per `SEAL_RATE_WINDOW_MS = 60 s`, `SEAL_RATE_MAX_SESSIONS = 10 000`.
- The longest token plus `/ta/search?r=` stays under the server's 2000-character location bound (test).

## 3. Server dispatch (`src/apps/shared/server.ts`)

Order for a seal route. Every check before sealing is the one every POST passes.

| Step | Check | Answer on refusal |
|---|---|---|
| onRequest | Host allowlist | 421 |
| onRequest | Origin/Referer | 403 `origin_invalid` |
| body parse | route body limit 4096 bytes (instance limit does not apply) | 413 `too_large` |
| handleRoute | session (core `iam.session`) | 303 sign-in (`session_ended=1` when a cookie was sent) |
| handleRoute | surface of the session | 404 |
| handleRoute | support view | 404, as every other POST of a support view |
| sealAnswer | `application/x-www-form-urlencoded` | 415 |
| sealAnswer | every field once and a text (a repeated field refused) | 400 `input_invalid` |
| sealAnswer | CSRF token bound to the session and the seal route id | 403 `csrf_invalid` |
| sealAnswer | exactly `_csrf` and the field (no `_op`, no `_rev.*`, nothing else) | 400 |
| sealAnswer | per-session rate bound (in this BFF process) | 429 `rate_limited`, `Retry-After` |
| sealAnswer | text after trim and NFC at most 200 | 400 |
| success | empty text | 303 to the target path, no token |
| success | text | 303 to `<target path>?r=<token>` |

The seal path calls no core query other than the session lookup and no core command, sets no cookie, writes no
fact and no audit entry. The diagnostic line names the route id, never the URL (unchanged), so the token is not
logged. Every GET page context is bound to an opener for its own session and route id.

## 4. What the search page unit MUST do

1. Add the inventory entry: POST `/ta/search`, id `ta.search.seal`, surface `ta`, action `search.private`, no
   command, and the seal target. `RouteSpec` has no `seal` field yet (`src/web/route-inventory.ts` was outside this
   unit). Proposal: add `seal?: string` (the target route id) to `RouteSpec` and to the `r()` extras, and compare it
   in `assertRoutesInInventory` (with `RegisteredRoute.seal`) and in `checkAppRoutes`. The inventory rule test
   (`postRuleViolations` in `test/unit/web/routes.test.ts`) already reads `seal` as the target id and checks that
   it names a GET entry of the same surface without path parameters.
2. Register the route at edge only (a POST of surface `ta` belongs to edge in `appsOfRoute`):
   `defineRoute<AppSealRouteDef>({ id: 'ta.search.seal', method: 'POST', path: '/ta/search', surface: 'ta',
   action: 'search.private', body: 'form', seal: { target: 'ta.search', field: 'q' } })`.
3. Render the form: POST `/ta/search`, hidden `_csrf` = `ctx.csrfToken('ta.search.seal')`, input `q`
   (`maxlength="200"`). No `_op` field.
4. Read the token: `const s = openSealToken(ctx, ctx.query[SEAL_TOKEN_PARAM])`. `s.kind === 'none'`: no search
   yet. `'expired'`: "This search has expired. Search again." with status 200. `'open'`: `s.text` is the search
   text for `views.search`; show it only in the page body.
5. Paging and result links carry `r` (opaque) and `after`; never `q`.
6. Support view: show no form (design §6.5); the POST answers 404 there.
7. Update `test/system/case-views.test.ts` from `?q=` GETs to the POST (design §6.6), and check
   `test/system/refusals.test.ts` expectations for the new POST route.

## 5. Files outside the unit's list (type changes forced by the closed union)

- `src/apps/shared/app.ts` (`checkAppRoutes`): uses `routeCommand(r)`; a seal route outside the inventory is never
  a harness route. Without this change the union does not compile.
- `test/unit/bff.test.ts` (allowlist test): skips seal routes when it checks each POST's command (one line).

## 6. Findings (ranked)

| Id | Rank | Finding | Scenario | Disposition |
|---|---|---|---|---|
| U6-F1 | P1 | The static inventory cannot record a seal target. | The search page unit registers `ta.search.seal`; `assertRoutesInInventory` compares only the command (null), so a changed target is not caught against the inventory. The registry still refuses an invalid target at startup. | Proposal in §4 item 1 for the inventory owner. |
| U6-F2 | P2 | `docs/verification/traceability.md` row T-S23 says "every POST maps to exactly one command". | A reader of the record misses the seal exception. The traced test title is unchanged (renaming it fails the traceability test). | Update the row and the title together when `ta.search.seal` is added. |
| U6-F3 | P2 | The rate bound is per BFF process and in memory. | A restart resets the windows; a second edge process would double the bound. One edge process exists per installation. | Parked. |

## 7. Tests and checks

- `test/unit/web/seal.test.ts` (new, 11 tests): round trip, IV per seal, no text in the token, expiry and
  far-future expiry, other session, other target, other key and label, any changed byte, cut short, version 0 and 2,
  oversize, malformed values and plaintexts, the bound and the longest token, `sealText`, the rate bound and its
  cap, `openSealToken` bound and unbound.
- `test/unit/bff-seal.test.ts` (new, 11 tests): 303 with `r=` and no text or `q=` in the address and no cookie;
  core asked for the session only; the token opens only for the same session on the same page; empty text; missing,
  made-up, other-session and other-form CSRF 403; missing and foreign Origin 403; wrong Host 421; no session 303
  sign-in; ended session `session_ended=1`; session of another surface 404; support view 404 like a command POST
  and no command; two `q` 400; two `_csrf` 400; no `q`, `_op`, `_rev.*` or another field 400; over 200 400; at 200
  303; JSON and text 415; body over 4096 413 (instance limit 1 MiB); 30 seals then 429 with `Retry-After`, other
  session still 303; across the whole file core received only `iam.session`; `checkAppRoutes` refuses a seal route
  outside the inventory in a harness installation.
- `test/unit/web/routes.test.ts`: 10 to 15 tests. New: seal route accepted and listed; POST without command or
  seal refused; closed shape; target rules; the inventory POST rule on synthetic entries. The inventory assertion
  now uses `postRuleViolations`.
- Results: `npm run typecheck` clean; `npx eslint` clean on the changed files;
  `node --test test/unit/web/seal.test.ts test/unit/bff-seal.test.ts test/unit/bff.test.ts test/unit/web/routes.test.ts`
  52 of 52; `node --test "test/static/**/*.test.ts"` 74 of 74; `test/unit/**` 758 of 759. The one failure is
  `test/unit/seo-record.test.ts` (renderer digest): another engineer's change to `static/css/components.css`, not
  this unit. Not run: system and browser tests.
