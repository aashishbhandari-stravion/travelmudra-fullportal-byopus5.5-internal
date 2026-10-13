# WP-02 follow-ups notes: F-02, F-09 and the Not proven items

Author: the WP-02 follow-up engineer, 13 October 2026. Input for the architect's integration. Nothing is committed.
Base: lane tree at 101eff1 with the uncommitted work of the WP-06, WP-07 and WP-03 engineers (not touched).
Inputs: `WP-02-acceptance.md` §6 and §7 (F-02, F-09; rows A07, A32, A35, A36, A39, A42, A45, A49, A50, A52, A57,
A80, A85, A100, A107, A108, A121).

## 1. Files

| File | Change |
|---|---|
| `src/apps/staff/catalogue/shared.ts` | `FormFieldRef` gains `paths`, `rule`, `part`; `rulesByCode`, `REASON_RULE`, `evidenceFieldRefs`; `refusalProblems` lists every field problem (no de-duplication by field), never a raw path; `refusalCallout(error, fields?)` reads field problems in words; `CODE_OWNERS` (engineering) on the refusal sentence; `serverJudgedForm`; `userText`; `offeringCrumbs` wraps the title. |
| `src/apps/staff/catalogue/admin.ts` | Field tables with rules: country, offering, declaration draft (`draftFields(mode)`), owner approval; codes that mark one field (`country_code_taken`, `slug_taken`, `offering_identity_taken`); country, offering, declaration and new-values forms are server-judged; no `pattern` on code, slug, service code; digest pattern has a `patternMessage`; `unsentBlock` takes the form's table; titles and names wrapped. |
| `src/apps/staff/catalogue/editor.ts` | `editorFieldRefs` maps every business value path (`servicePricePaise`, `values.*`, `documents.N.label`, `processingEstimate.*`, `processOverview.N.step`) to its field and rule; labels follow the visible labels; no price `pattern`. |
| `src/apps/staff/catalogue/baselines.ts` | Edit form server-judged; publication table with rules and evidence paths; unsent blocks pass their tables; titles wrapped. |
| `src/apps/staff/catalogue/launch.ts` | `launchProblems`: unknown path reads the general sentence; `_reason` uses `REASON_RULE`; titles wrapped. |
| `src/apps/staff/catalogue/launch-plan.ts`, `launch-decision.ts`, `impact.ts` | Titles wrapped (`userText`). |
| `src/apps/staff/accounts/pages.ts` | `accountProblems` takes `{ id, label }` per field: summary "[label]: [rule]", field message the rule, form order, unknown path = general sentence + reference code; rules for role, email, display name, reason; create form `novalidate`, inline check kept, reason `minlength="10"`; names wrapped in list, heading, action titles, facts, history, duties. |
| `static/css/components.css` | One separate block at the end of the file: `.user-text { overflow-wrap: anywhere; }` (no tokens needed). The file had no other uncommitted change when it was added. |
| Tests | §5. |

No change under `src/modules/`, `src/workers/`, `src/kernel/`, `src/contracts/`, `src/core-api/`, `src/platform/`,
`src/web/` or migrations. No route path, form action or field name changed. `identity.ts` needed no change (its
create handler passes `CREATE_FIELD_IDS`, whose shape changed).

## 2. F-02: the mapping

- One table per form from Core's field paths to the form's fields, in form order. A path resolves to a field by
  its name, by one of its `paths` (exact or as the start of a longer path, longest wins), or by the longest field
  name it starts with. `fields.` is stripped.
- Each field carries its rule in words per Core field code (`rule`); a field with several values names the part
  (`part`: the declaration item "Gates", "step 3").
- Summary item: "[visible label][, part]: [rule]", linked to the field. The field itself shows the rule; a field
  with several problems says how many and that each is listed at the top.
- A path the table does not know: "A value of this form was refused. Reference code: [code] ([field code])." Never
  the path. The same applies to the refusal callout (unsent blocks, carried forms) and to launch forms.
- The general headline ("Some fields are missing or not valid", "A declared value is not permitted…") is dropped
  when field problems carry it (`input_invalid`, `reason_required`, `item_value_not_permitted`).
- Browser text: the country, offering, declaration draft and both business values forms are server-judged
  (`novalidate`, no inline script check, no `pattern`; fields keep `required`). One answer lists every problem
  Core reports. The create-account form has `novalidate` and keeps the inline script check (page words only:
  required, e-mail shape, reason minimum 10) because Core's own answer for it is partial (§6 item 1).

## 3. F-09: wrapping

`.user-text` (`overflow-wrap: anywhere`) on every display name and typed title the WP-02 pages show: account list
cell, account `h1`, action titles, creator and requester facts, history actor and reason, duties `h1` and crumb;
offering and country titles in list cells, headings, crumbs and facts of the catalogue, launch and impact pages.
`anywhere` (not `break-word`) also lowers the min-content width, so table cells and flex headings shrink.

## 4. Not proven items

| Item | New test (file: title) | Note |
|---|---|---|
| A07 | `test/unit/bff-services.test.ts`: "a failed catalogue read: the unavailable answer with its category and "Try again", never an empty list, a zero or the "none available" state"; "a failed read of one service: the same answer, never a service shown as available or not available" | Partial part skipped: `cat.selectable_offerings` has no partial state (one row is read whole or the read fails; `src/modules/catalogue/display.ts` `selectionOf`). |
| A32 | `test/core/new-work-refusals.test.ts`: "refuses intake start and draft creation for a withdrawn offering; nothing is written"; "refuses new work when the head binding is no longer registered (binding missing)…"; "…does not supply the head binding (binding incompatible)…"; "…head business values do not describe the declared documents…"; control "still creates a draft…" | States set by direct row edits (no command produces them); the guard is Core's. |
| A36 | `test/core/unlisted-country-work.test.ts`: "does not offer a country a SuperAdmin just created unlisted, and refuses a group there; a listed one is offered (control)" | Public page part: static by construction (`src/web/public/routes.ts` reads no database); covered by `test/unit/public-site.test.ts`. No new test. |
| A39 | same file: "refuses a new group there; the existing group and its application stay unchanged, open and readable by the travel agent" | |
| A49 | `test/integration/catalogue-refusal-cases.test.ts`: "refuses an owner approval with a synthetic label or other evidence than the owner's approval; nothing is recorded"; "refuses an owner approval without any evidence; nothing is recorded". Page: `catalogue-pages.test.ts` "owner approval of a real offering: the evidence rule in words…" | Real (non-synthetic) offering. |
| A50 | same file: "refuses the structure approval of a draft whose items need a capability the active release lacks; nothing is recorded" (+ control). Page: "a refusal owned by engineering names the owner…" | |
| A52 | same file: "refuses to bind a declaration that is still a draft; no binding is written" (`declaration_unsupported`); "refuses to bind a supported structure the active release cannot supply…" (`binding_unavailable_in_release`). Page: same owner test | Owner text for `declaration_unsupported`: "engineering (a release), or the product owner (an approval of a draft)". |
| A80 | `test/integration/launch-refusal-cases.test.ts`: "is refused offering_not_launched for a named and for an all-TA audience; nothing is written" | |
| A100 | `test/identity/account-hand-made-requests.test.ts`: three "refuses … as stale; nothing changes" tests. Page: `accounts-pages.test.ts` "a hand-made activation of a pending account and restoration of an active one: Core's stale revision shows the current status beside the unsent reason; no form for the action" | |
| A108 | `test/unit/bff-services.test.ts`: "every code that stops selecting a service … has its own sentence"; "every fixed boundary of one service and the fee statement have their own sentence"; todo "every boundary that an unsupported or unresolved item of a service can show has its own sentence" | Fails today (todo): 9 boundary codes fall back to "This is not available at the moment." (§6 item 4). Add-applicants step skipped: WP-03 file. |

F-02 and F-09 tests: `catalogue-pages.test.ts` describe "Refusals in words" (7) and "Long user text wraps" (1);
`accounts-pages.test.ts` describe "the create form: refusals in words" (3), "a create refused with several field
problems…", "long names wrap" (1, also asserts the CSS rule); `bff-catalogue.test.ts` "a refused country lists
every problem Core reports…". Changed expectations: two account tests now expect the label prefix in the summary.

## 5. Checks (13 October 2026)

- `npm run typecheck`: pass. `npx eslint` on every changed and new file: pass.
- Unit and BFF of the touched files (catalogue, accounts, launch, services, carried forms, status pages,
  bff-catalogue, bff-services): 188 tests, 187 pass, 1 todo.
- `node --test "test/static/**/*.test.ts"`: 74 pass.
- System `new-service`, `ported-pages`, `flows` (TMPDIR=/tmp/w2fu): 17 pass.
- New Core tests (5 files): 18 pass.
- Full unit suite: 1524 tests, 1 fail: `seo-record.test.ts` "names the current renderer digest…". Cause: the
  `components.css` addition changes the renderer digest. The crawl record must be recorded again at integration
  (as after the earlier style sheet changes).

## 6. Findings and proposals (ranked)

1. P2. The create-account binding normalizes the address before Core checks the other fields
   (`src/core-api/bindings/identity-admin.ts:95`, `src/modules/identity/email.ts`). Scenario: without the page
   script, "abc" and a 5-character reason get only the address problem; the reason comes in the next answer.
   With the script both show at once. Proposal: report the address problem together with the command's input check.
2. P2. Business values: the price maximum and the zero-price confirmation are checked only after the values parse,
   and "up to" before "from" only when the rest is valid (`src/modules/catalogue/commands/baselines.ts:50-52`,
   `src/modules/catalogue/baseline.ts` refine). Scenario: an empty label and an unconfirmed zero price need two
   answers. Proposal: collect them in one refusal.
3. P2. A declaration for another service mode answers with that mode's item problems before the mode mismatch
   (`src/modules/catalogue/commands/declarations.ts:56-69`). Scenario: a SuperAdmin pastes a preparation-only body
   and reads several item problems, not "the service mode does not match". Proposal: check the mode first.
4. P2. Nine boundary codes have no travel-agent sentence on TA-03 (`owner_policy_pending`, `engineering_pending`,
   `parked_prep_only_cutoff`, `parked_provider_route`, `parked_cancellation`, `parked_preparation_post_handover`,
   `declaration_item_unresolved`, `population_out_of_scope`, `owner_approval_required`;
   `src/apps/shared/pages/services.ts` `TA_REASONS`). Scenario: a service with a parked cancellation shows "This is
   not available at the moment." Owner of the file: travel-agent pages.
5. P2. Form kit: `form()` has no `noValidate` option and `textareaField` no `minlength`; pages add them to the kit's
   markup (`serverJudgedForm`, `noBrowserValidation`, `withReasonMinimum`). Proposal for the components owner
   (`src/web/ui/forms.ts`); the helpers then go.
6. P2 (from the Core test work). Intake start names a published, launched offering whose head binding or values
   are unusable `catalogue_not_published` (`src/modules/intake/commands/start-individual.ts:72`;
   `src/modules/catalogue/queries.ts:57-63`), the same class as F-04; `snapshotOf`'s result is unused there
   (`src/modules/intake/commands/common.ts:57`, `start-individual.ts:65`).
7. DESIGN.md proposal: a form whose values Core judges uses `novalidate` and no inline check, and lists every
   problem Core reports; `.user-text` for typed names and titles.
