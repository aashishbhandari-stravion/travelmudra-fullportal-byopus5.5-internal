# WP-06 U4 notes: SA-09 decision registry, the Gate 1 exception kinds and the revocation

Unit U4 of WP-06. Author: the U4 engineer, 13 October 2026. Input for the architect's integration, U6 wiring, the gallery
registration and later packages that add SA-09 kinds. U4 commits nothing; the architect integrates. Base: lane commit
101eff1. Binding inputs: `WP-06-design.md` §1.2, §1.4 (rows 5 and 6), §1.5, §2.0, §2.7, §2.8 to §2.10, §4, §5, §7.1 (U4 row);
`WP-06.md` §3 and §4.1 to §4.8 (D-02, D-03, D-05, D-06, D-08, D-10, D-15, D-23); `PLAN.md` LD-17; `WP-06-U0-notes.md` §4.

## 1. Files

| File | Change |
|---|---|
| `src/apps/staff/decisions/kinds.ts` (new) | Registry and frame: kind interface, `defineDecisionKind`, `decisionRegistry`, `decisionKindPage`, `showDecision`, `decisionRefusalPage`, `decisionProblems`, `decisionHref`. |
| `src/apps/staff/decisions/application.ts` (new) | Kinds `gate1_assignment`, `gate1_first_work`, `revoke_exception`; reusable gate exception helpers. |
| `src/apps/staff/decisions/routes.ts` (new) | `adminDecisionRoutes({ kinds, carriedGrant })`: GET `admin.decisions.application`, `admin.decisions.application_subject`; POST `admin.applications.grant_exception`, `admin.gate_exceptions.revoke` (copies of the `admin.ts` routes with the kind mapping, receipts, re-render, whole fields, 16 KiB body limit). |
| `scripts/dev/gallery/decisions.ts` (new) | `decisionsGalleryPages()` (11 pages) and fixtures shared with the tests. Not registered. |
| `test/unit/web/decision-kinds.test.ts` (new) | 29 tests. |
| `test/unit/bff-decisions.test.ts` (new) | 7 tests (HTTP, scripted Core). |

No other file changed. No route is registered; `admin.ts` is untouched.

## 2. Registry API (`kinds.ts`)

```ts
interface DecisionAddress { applicationId: `app_${string}`; kind: string; subjectId: string | null }
decisionHref(a): string                         // /admin/applications/<id>/decide/<kind>[/<subject>]
DECISION_PATH, DECISION_SUBJECT_PATH            // the two GET route patterns (for hasPage and the inventory)
interface DecisionView<M> { model: M; address; now: Date; hasPage(path) }   // what every renderer receives
interface DecisionKind<M> {
  kind; subject: string | null;                 // subject = id prefix ('gex'); null = application route
  exception?: { gate; action };                 // grant kinds: the pair the form posts (the grant route maps it)
  load(ctx, address): Promise<M | null>;         // required reads throw; optional reads via optionalView; null = 404
  title(v); breadcrumbs(v); current(v);         // h1 + document title; crumbs; rail member
  scope(v); evidence(v); hardStops(v); effect(v); review(v);
  state(v): { state: 'draft' } | closed | unavailable | no_exception   // first match of the state table
  cancel(v);
  form: { routeId; action(v); hidden(v); revisions(v); submitLabel; destructive?; reason: { label; hint; maxlength; minlength?; rows? };
          fields?(v, typed, problems); fieldId?(name); unsent?(typed) };
  receipts(v): Record<code, { expectation: ReceiptExpectation; facts(v, summary): { recorded; current } }>;
  problems(error, v): DecisionProblem[];        // the kind's closed sentence table; [] = frame fallback
  stale?(v, typed): StaleField[];               // CMP-14 rows; absent = stale_revision worded in problems
}
defineDecisionKind(k); decisionRegistry(kinds) → { get, applicationKinds, subjectKinds, forException(gate, action), exceptionPairs }
decisionKindPage(ctx, kind, address, model, { receipt?, refusal?, restorePath? }): SafeHtml   // whole page in the shell
showDecision(ctx, kind, address)                // GET: load, readReceipt over the kind's codes, page; null = 404
decisionRefusalPage(ctx, kind, address, error)  // POST re-render at the POST path with ctx.fields, restorePath = GET page
```

Frame rules (all kinds): fixed CMP-25 order; review a visible section, never in `<details>`; receipt first in `main`; with
a form, refusal = error summary plus every typed value (`reason` and the kind's fields); without a form (state no longer
`draft`), refusal callout first plus "Your unsent values" read only (WP-02 R-03 class); `conflict_operation_key` and
reason field errors are worded by the frame; an unworded code shows the category title plus "Reference code: [code]";
a stale revision on a formless page says "This application changed … Nothing was recorded"; a re-rendered form has a new
`_op`; `_rev.*` come from the read, the kind's hidden decision values from the kind (never from a fresh read; the grant
kind is selected by the posted pair, so the values equal the posted ones). Registry validation: unique names
(`^[a-z][a-z0-9_]{0,59}$`), subject prefix three letters, a grant kind has no subject, one kind per (gate, action), pair
within the kernel vocabulary. A test pins the registry pairs to a subset of Core's `SCOPE` (`gates.ts`), parsed from source.

**How later packages add kinds without editing `kinds.ts` or `routes.ts`.** Each package writes its kinds in its own file
(`defineDecisionKind`), adds them to the `kinds` list that the staff instance passes to `adminDecisionRoutes` (one line in
`instance.ts`), and writes its POST routes in its own route module: success `receiptLocation(decisionHref(address), code,
ctx.operationKey)`, refusal `answer(..., (error) => decisionRefusalPage(ctx, kind, address, error))`. A Gate 2 or readiness
kind (WP-07) declares `exception: { gate, action }` and a receipt code `granted`; the grant route then maps its pair
without change. The planned edits of `kinds.ts`/`routes.ts` in the WP-07, WP-09, WP-11 and WP-17 designs (§7.1 rows) are
replaced by this pattern. WP-13's launch kinds live on SA-05j (catalogue route), not on this application-bound registry.

## 3. Kinds and states

| Kind | Route | Reads | States (first match) | Form |
|---|---|---|---|---|
| `gate1_assignment` | application | `core.admin_case`; opt. `pay.application_payments` | Not open (lifecycle) → Not needed (`payment_received`) → protection mark (unavailable, CMP-10, Owner SuperAdmin) → Already open (with Core's stale/expired/grantor-inactive sentence and "Revoke it, then record a new one") → Not submitted (draft without approved help) → draft | hidden `gate`=`gate1_service_payment`, `action`=`assign`, `_rev.application`; `reason` (max 1000) |
| `gate1_first_work` | application | as above; opt. `ops.case_work` | Not open → Not needed → mark → Already open → No operator assigned (link to `gate1_assignment`) → Work started → draft (case work unavailable: form, Core decides) | as above with `action`=`start_operator_work` |
| `revoke_exception` | subject `gex` | `core.admin_case` (row by id; absent → 404) | Not open (used / expired / revoked) → draft | hidden `applicationId` (BFF only); `reason`; destructive button |

Copy per design §2.7.2 to §2.7.4 with the amendments: D-03 reason only (no evidence field; the form's `fields` slot and the
grant input are the S-07 seam); D-05 no Gate 1 conclusion for first work ("Core checks Gate 1 when the operator's first work
… starts"); D-06 known-gap callout on `gate1_first_work` (Effect detail); D-08 revocation effect from the recorded gate and
action (`revocationEffect`: Gate 1 → payment or a new Gate 1 exception; readiness → the new operator's judgement or its own
permitted readiness exception, no payment wording; Gate 2 → payment or its own Gate 2 decision, "A Gate 1 exception never
passes Gate 2"); "This exception does not pass Gate 2." in Effect and in the grant receipt.

## 4. Routes, receipts, refusals

| Route | Answer |
|---|---|
| GET `admin.decisions.application` `/admin/applications/:applicationId/decide/:kind` (`application.read`, resolve application) | `kind` ∈ registry kinds without subject; else 404 |
| GET `admin.decisions.application_subject` `…/decide/:kind/:subjectId` | `kind` ∈ subject kinds and `subjectId` has that kind's prefix; else 404; subject not in the application → 404 |
| POST `admin.applications.grant_exception` (D19 path) | Pair → kind: accepted 303 `…/decide/<kind>?done=granted&op=<key>`; refused → that kind re-rendered. Pair without kind (Gate 2, readiness from the carried form): accepted 303 `/admin/applications/<id>?done=granted`; refused → `carriedGrant(ctx, error)` |
| POST `admin.gate_exceptions.revoke` (D20 path) | Accepted 303 `…/decide/revoke_exception/<gex>?done=revoked&op=<key>` (id from the result resource); refused → SA-09r re-rendered when `applicationId` is an app id whose case holds the exception; otherwise today's answer (shell error page) |

Receipt codes: `granted` (grant kinds) and `revoked` (revocation), both **neutral** "Request recorded" (D-02: same result
shape). Expectation: resource `application` = address id; `granted`: `gateExceptionId` is a `gex_` reference; `revoked`:
`gateExceptionId` = path subject. Recorded facts: exception reference; gate, for, expiry of the row the returned id selects
(immutable); "Gate 2: Not passed. This exception does not pass Gate 2." for a Gate 1 row. Current: state of the exception;
service payment (grant). No accepted time.

Refusal table (grant, `grantProblems(error, 'Gate 1')`): `control_blocked/gate_not_blocking`, `conflict_duplicate/
gate_exception_not_eligible` ("already open … No second one was recorded"), `validation_failed/gate_exception_not_eligible`,
`protection_mark_active`, `application_not_open`; stale → CMP-14 rows Operator, Service payment, Gate exceptions open ("As it
was when you opened this page" / current), reason kept in its field. Revocation: `stale_revision` → "This exception is no longer
open: …". LD-17: every field whole; `contractRefusal` refuses input the command contract does not take (for example a reason
over 1000 characters) at its field before any command, values kept. Body limit 16 KiB on both POSTs (a 1000-character
reason in a three-byte script percent-encodes to about 9 KB; the old 4096 answered 413 and lost the text).

## 5. Items for U6 and the architect

| Item | Rank | Scenario | Proposal |
|---|---|---|---|
| Wiring | — | Routes not registered. | `instance.ts`: `adminDecisionRoutes({ kinds: [...GATE1_DECISION_KINDS], carriedGrant })`; `carriedGrant = (ctx, error) => caseAgain(ctx, { form: 'grant', error })` exported from `admin.ts` (today's answer for the carried Gate 2 and readiness form). |
| Old copies | — | Duplicate route ids if both register. | Remove `admin.applications.grant_exception` and `admin.gate_exceptions.revoke` from `admin.ts`; narrow the generic grant form to Gate 2 and readiness values; case page links: `decisionHref` for `gate1_assignment`, `gate1_first_work`, and `revoke_exception/<gex>` per granted row. |
| Inventory | — | New GET ids absent from `route-inventory.ts`. | Add D-rows `admin.decisions.application` and `admin.decisions.application_subject` (GET, `application.read`, superadmin); D19 and D20 stay. |
| System tests | — | `core-pages.test.ts:281`, `case-rules.test.ts:162, 206, 283`, `document-decisions.test.ts:217` read the grant form from the case page; the revoke location changes. | GET SA-09g by action; expect `…/decide/<kind>?done=granted&op=`; revoke `…/decide/revoke_exception/<gex>?done=revoked&op=`. |
| Gallery | — | `decisionsGalleryPages()` not registered. | Register in `scripts/dev/gallery-pages.ts`. Not rendered in a browser by U4 (no CSS change; only existing components). |
| Duplicate helper | P2 | `contractRefusal` (routes.ts) repeats the WP-03 fix engineer's uncommitted `inputRefusal`/`sendWhole` in `edge/core/prepare-forms.ts`; two copies of one LD-17 rule can drift. | Move one copy to `src/apps/shared/core/shared.ts` at integration; both callers import it. |
| Line breaks count twice | P2 | A browser sends a textarea line break as CRLF; `maxlength` counts it once. A reason typed to the 1000-character field limit with line breaks reaches the BFF over 1000 and is refused at the field ("longer than 1000 characters"), values kept. Applies to every textarea at Core's limit. | Park, or normalise CRLF to LF in the form parser (shell; architect's file). |
| Protection mark boundary kind | P2 | CMP-10 has no boundary kind for a hold; the page uses `known_limitation` with reference `protection_mark_active`, so the label reads "Known limitation". | Park, or add a boundary kind for holds in `presentation.ts` (WP-01 file). |
| "No exception" kinds | P2 | Acceptance A91 asks for SA-09 addresses of controls without an exception; no product kind exists for them (the hard stops section names them on every grant page). The frame's `no_exception` state is tested with a test kind. | Keep (A91 T part met by the frame test; L part by the hard stops section), or add fixture kinds if the PM wants addresses. |
| Exception list cap | P2 | `core.admin_case.gateExceptions` is capped at 50 rows by the contract; a 51st exception's revocation page would read as not found. | Park (one application accumulates few exceptions). |
| A90 (2) wording | P2 | A hand-made post of `gate1_service_payment` with a Gate 2 action has no kind, so it takes the carried answer (the case page with "This gate cannot be excepted for this action now."), not SA-09g. | Accept (design §1.4 row 5: a pair without a kind keeps today's answer). |

## 6. Checks run

- `npm run typecheck`: pass (whole tree at the time of the run).
- `npx eslint --max-warnings=0` on the six files: pass.
- `node --test test/unit/web/decision-kinds.test.ts test/unit/bff-decisions.test.ts`: 36 tests, 36 pass (29 + 7).
- `node --test "test/static/**/*.test.ts"`: 74 tests, 74 pass (route declarations, no import cycle).
- Not run: the system tests (routes not registered), a browser or axe pass of the gallery pages.
