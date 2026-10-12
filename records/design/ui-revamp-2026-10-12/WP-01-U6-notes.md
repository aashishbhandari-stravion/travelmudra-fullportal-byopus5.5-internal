# WP-01 U6: optional reads must not swallow access refusals (notes)

Lane `ui-revamp-2026-10-12`, base 7613606. Rank of the defect class: P0 (independent review).
Implementer: Claude (Opus 5.5) subagent. The architect integrates and commits.

## 1. Defect class

A page reads core more than once. Several page modules wrapped an optional read in a catch-all.
When access is withdrawn, the session ends or the application is reassigned between two reads of
one page, the second read is refused. The catch-all swallowed the refusal and the page rendered
the private facts of the first read. Revocation therefore did not take effect on the next read.

Rule after U6: an optional read degrades its block to "Unavailable" only for an availability
failure. Every other refusal MUST reach the shell (denied page, sign-in redirect, maintenance page).

## 2. Helper

`src/apps/shared/core/shared.ts`:

```ts
export const OPTIONAL_READ_UNAVAILABLE: ReadonlySet<ErrorCategory>;
export type OptionalView<V> = { readonly ok: true; readonly view: V } | { readonly ok: false; readonly reason: 'unavailable' };
export async function optionalView<N extends QueryName>(
  ctx: Pick<AppRequestContext<unknown>, 'view'>, name: N, params: QueryParams<N>,
): Promise<OptionalView<QueryView<N>>>;
```

- It returns `{ ok: false, reason: 'unavailable' }` only for a `TmError` whose category is in
  `OPTIONAL_READ_UNAVAILABLE`.
- It rethrows every other `TmError` unchanged (same instance, so the shell sees the exact category
  and code).
- It rethrows every exception that is not a `TmError` (a programming error).
- No existing helper changed behavior.

### 2.1 Category set (from `src/kernel/errors.ts`, 20 categories)

Degrade to "Unavailable" (9):

| Category | Reason |
|---|---|
| `unavailable_dependency` | Core or a dependency cannot answer (`core_unavailable`, `audit_degraded`). Retryable. |
| `capacity_limited` | Capacity limit. Retryable. |
| `rate_limited` | Rate limit. Retryable. |
| `conflict_retry_exhausted` | Serialization retries exhausted. Retryable contention, not a decision. |
| `stale_writer` | The core instance is no longer the writer (release switch). Retryable. |
| `unavailable_parked`, `unavailable_excluded`, `unavailable_known_limitation`, `unavailable_owner_decision` | Deliberate boundaries. The policy throws them for a capability that is unavailable by design. They say nothing about the reader's access; the product shows them as visible "unavailable" states. |

Rethrow (11):

| Category | Reason |
|---|---|
| `unauthenticated` | The session ended (sign-out, expiry, suspension). The shell sends the browser to sign in. |
| `not_found_or_forbidden` | Access withdrawn or application reassigned. The shell shows the denied page. |
| `maintenance` | Admission closed or release mismatch. The shell shows the maintenance page. Retryable, but it is an installation state, not a dependency outage. |
| `conflict_duplicate` | Carries `support_view_active`. The shell shows its page. |
| `stale_revision`, `conflict_operation_key`, `validation_failed`, `control_blocked`, `bot_check_failed`, `outcome_unknown` | Never an availability statement about a read. Reads do not normally produce them (`control_blocked` comes from commands only). If one appears, it is a defect or a decision, and it MUST NOT read as "Unavailable". |
| `internal` | A defect at core. Behavior change: before U6 the catch-alls showed it as an unavailable block. Now the shell's internal page shows it, so a defect is not hidden behind "Unavailable". |

The set is a closed `Set` and a unit test pins it, so a new category cannot join it silently.

## 3. Sites changed

| File (line after change) | Before | After |
|---|---|---|
| `src/apps/shared/ta-documents.ts:65` `applicationContext` (TA document version page, also read in a support view) | `try { ctx.view('core.ta_application') } catch { return null }` | `optionalView`; unavailable ⇒ version shown on its own; refusals ⇒ shell. Doc comment updated. |
| `src/apps/shared/delivery/routes.ts:49,54` `deliveryCaseContext` (delivery page of ta, ops and admin) | catch-all around `core.ta_application` / `core.ops_case` / `core.admin_case` ⇒ `undefined` | `optionalView` per surface; unavailable ⇒ `undefined` (page without the case context). |
| `src/apps/staff/views/routes.ts:18` `offeringTitles` (measures page) | catch-all around `cat.admin_index` ⇒ `{}` | `optionalView`; unavailable ⇒ `{}` (cohorts show references). |
| `src/apps/staff/core/ops.ts:365` `caseAgain.deliveryOf` (operator case page) | catch-all around `dlv.delivery_page` ⇒ `null` | `optionalView`; unavailable ⇒ `null` (Documents table links to the delivery page). |
| `src/apps/staff/core/case.ts:136` `packetHandoversOf` (ops work list, ops and admin case pages, staff attention count) | catch-all around `dlv.packet_handovers` ⇒ empty map | `optionalView`; unavailable ⇒ empty map. |
| `src/apps/staff/operations/incidents.ts:260` `namesFor` (ops and admin incident page) | catch-all around the case read ⇒ unnamed | See 3.1. |
| `src/apps/shared/core/ta.ts:772` `listFacts` (TA applications list, group page, TA attention count) | catch-all around `dlv.delivery_facts` ⇒ empty map | `optionalView`; unavailable ⇒ empty map. |
| `src/apps/shared/core/ta.ts:790` `passportReading` (TA case page) | catch-all around `doc.version_page` ⇒ `null` | `optionalView`; unavailable ⇒ `null`. |
| `src/apps/shared/core/ta.ts:807` `deliveryOf` (TA case page) | catch-all around `dlv.delivery_facts` ⇒ `null` | `optionalView`; unavailable ⇒ `null`. |
| `src/apps/staff/payments/routes.ts:109` `changeAnswer` (POST approve/decline ceiling change, refused) | `.then(v => v.taAccountId, () => null)` | `optionalView`; unavailable ⇒ the command's own refusal answer; a refusal of the lookup ⇒ shell. |

No catch-all around a core read exists in `src/apps/shared/delivery/pages.ts`,
`src/apps/staff/views/pages.ts` or `src/apps/staff/identity.ts` (checked with grep and by reading
the matches). They are unchanged.

### 3.1 Incident page: a viewer who may read the incident but not the case

`incident.read` lets an operator read an incident without `application.read` on its case: the
named owner of an open official-fact follow-up who is no longer the assigned operator, and a
stand-in reviewer. For that viewer `core.ops_case` answers `not_found_or_forbidden` in the steady
state. A plain rethrow would deny that owner their own incident page (a regression on the main
path).

Core already says whether the viewer may read the case: `ops.incident` sets
`incident.application` only when the policy allows `application.read` for the viewer
(`applicationOf` in the incident binding), and null otherwise. `namesFor` now reads the case only
when `incident.application !== null`. When it reads, every non-availability refusal goes to the
shell. When the viewer may not read the case, the case is not read and the names stay unnamed (the
rendering before U6).

### 3.2 Other sites checked and kept

- TA document version page and TA delivery page: a TA owns the group, its versions and its
  applications (`document.read_metadata` and `application.read` are both `ta: own`), and
  applications are never deleted. A refusal of the second read therefore means a change of access.
- `dlv.packet_handovers` and `dlv.delivery_facts` leave out unreadable applications instead of
  refusing, so a refusal is a session or access refusal of the reader.
- Every optional query is on the BFF allowlist of every surface that reads it (support view
  included), so no optional read is refused for a missing allowlist entry.

## 4. Catch-alls found in files owned by others (not changed)

| File | Site | Note |
|---|---|---|
| `src/apps/shared/nav-counts.ts:84-91` | `try { count(ctx) } catch { null }` | Counts run before the page reads. A refused count shows "Unavailable" in the navigation; the page's own read then meets the same refusal. No first-read fact is rendered. P2: a session refusal during counts reads as "Unavailable" for that one count. |
| `src/apps/shared/core/shared.ts:459-469` `readReceipt` (existing helper, kept as told) | `not_found_or_forbidden` ⇒ no receipt; any refusal other than session or maintenance ⇒ unchecked receipt | By design a receipt key in an address can name another reader's operation, so `not_found_or_forbidden` cannot mean "access withdrawn" here. It also degrades `internal` and `conflict_duplicate` (`support_view_active`) to the unchecked receipt. P2 for the owner of the helper. |
| `src/apps/shared/common-routes.ts:119-124` (in-progress work by another engineer) | narrow catch with a `READ_UNAVAILABLE` set | Already narrow; consider one shared set with `OPTIONAL_READ_UNAVAILABLE` at integration. |
| `src/apps/shared/release-check.ts`, `src/apps/shared/core-client.ts`, `src/apps/shared/boot.ts`, `src/apps/edge/processing.ts`, `src/apps/*/main.ts`, `src/apps/shared/uploads.ts:121` | transport, start-up, processing, multipart limit | Not core reads of a page. Out of the class. |

`src/apps/shared/server.ts`, `app.ts`, `identity-routes.ts`, `pages/identity.ts`, `ta-intake.ts`,
`pages/intake.ts` and `edge/intake/routes.ts` contain no catch-all around a core read.

## 5. Tests

- `test/unit/optional-read.test.ts` (6 tests): the view is returned; every category in
  `ERROR_CATEGORIES` is either degraded (exactly the 9) or rethrown as the same instance;
  explicit session, access, maintenance, `release_mismatch`, `support_view_active`,
  `stale_revision` and `internal` refusals are rethrown; outage, `audit_degraded`, capacity,
  serialization and stale-writer refusals degrade; a non-`TmError` exception is rethrown; the set is
  pinned.
- `test/unit/bff-access-change.test.ts` (8 tests): edge and staff BFFs (each with its own sign-in
  and self routes) in front of a scripted core whose views are decoded under their contracts.
  - TA applications list (`core.ta_applications` then `dlv.delivery_facts`): control (second read
    unavailable ⇒ 200 with the facts); `not_found_or_forbidden` ⇒ 404 without any first-read fact;
    `unauthenticated` ⇒ 303 to `/sign-in`; `maintenance` ⇒ 503 without the facts.
  - Operator incident page (`ops.incident` then `core.ops_case`): control (case unavailable ⇒ 200
    with the note); viewer core does not let read the case ⇒ case not read, 200; reassignment
    (`not_found_or_forbidden`) ⇒ 404 without the facts; suspension (`unauthenticated`) ⇒ 303 to
    `/staff/sign-in` without the facts.
  - Fails without the fix: with the original `ta.ts` and `incidents.ts`, 6 of 8 fail (the two
    controls pass). With the fix, 8 of 8 pass.

## 6. Check results (12 October 2026, shared lane tree with two other engineers' work in progress)

- `npm run typecheck`: no error in any U6 file. Errors exist only in files of the parallel work
  (first `src/web/public/site.ts`, later `test/unit/bff.test.ts`, `test/unit/public-site.test.ts`,
  `test/system/refusals.test.ts`: `PublicSiteOptions.environment` missing).
- `npx eslint --max-warnings=0` on the 9 changed source files and the 2 new tests: clean.
- `node --test test/unit/optional-read.test.ts test/unit/bff-access-change.test.ts test/unit/bff.test.ts`:
  28 tests, 27 pass, 1 fail. The failure is `bff.test.ts` "maps every core error category to its
  page, 1:1": it expects the sign-in redirect `/sign-in` exactly, and the in-progress `server.ts`
  (sign-in work) now adds `?session_ended=1&next=...`. Not caused by U6. The U6 test compares the
  path of the redirect only, so it holds before and after that change.
- System tests (`TMPDIR=/tmp/u6s`, concurrency 1): `core-pages`, `payments-views`, `case-work`,
  `refusals`, `delivery`, `ta-documents-originals`, `case-views`, `document-decisions`,
  `case-measures-currency`: 73 tests, 68 pass, 5 fail. All 5 come from the parallel work, not U6:
  - 4 expect the exact sign-in location `/sign-in` and get `?session_ended=1` / `?next=...`
    (`payments-views` "signs a suspended travel agent out of the payments page";
    `refusals` "is sent to that BFF's own sign-in page...", "is no session at the other BFF...",
    "has no session on any route of its BFF").
  - 1 expects the old operation lookup wording "No record of this request yet"
    (`refusals` "cannot read another travel agent's document, ... or operation"); the operation
    page and route are in the status-page work.
  - Every case-work, incident, delivery, measures, payments, TA documents and support-view test
    passed.
