# WP-02 fixes notes: code review R-01 to R-03

Fixes of the three P1 findings of the independent WP-02 code review (lane `research/reviews/WP-02-code-review.md`).
Author: the fix engineer, 13 October 2026. Input for the architect's integration. Nothing is committed. Base: lane
commit 228816a plus the uncommitted travel-agent work of another engineer in the same tree (not touched). R-04 stays
parked.

## 1. Files

| File | Change |
|---|---|
| `src/apps/staff/catalogue/admin.ts` | `unsentBlock` and its value helpers (`UnsentValue`, `linesOf`, `choiceText`, `evidenceUnsentValues`, `editorUnsentValues`); the listing form keeps the submitted `listingState` and shows "Current listing" separately; unsent blocks for the declaration draft, new business values, owner approval and declaration preview; the bind refusal without its form; dropped approval choices are named. |
| `src/apps/staff/catalogue/baselines.ts` | Unsent blocks for the business values edit, the publication refused on the values page (`form: 'publish'`) and every closed state of the publication decision; the preview refusal without its form; `publicationUnsentValues`. |
| `src/apps/staff/catalogue/launch-decision.ts` | The hidden `planId` keeps the plan the reader sent; the comparison shows when that plan is not the current plan; the unsent block for every state without a form; `decisionUnsentValues`. |
| `src/apps/staff/catalogue/routes.ts` | `baselinePublishRerender`: a refused business values publication renders the preview the form named. |
| `src/apps/staff/identity.ts` | No cut of submitted input: account create, `typedProblem` (every account action), grant create, support view start. |
| `src/apps/staff/accounts/pages.ts` | `refusalBlock`: an action not offered now keeps the unsent reason, read only, with the submit unavailable and "Review current information". |
| Tests | `test/unit/web/catalogue-pages.test.ts`, `launch-pages.test.ts`, `accounts-pages.test.ts`, `test/unit/bff-catalogue.test.ts` (§5). |

No file under `src/modules/`, `src/workers/`, `src/kernel/`, `src/contracts/`, `src/core-api/`, `src/platform/`,
`src/web/` or migrations changed. No route path, form action or field name changed.

## 2. R-01: no hidden decision value is rebuilt from the current state

Rule applied: a refused form posts the decision the reader sent. The current state shows separately. Revision
fields (`_rev.*`) are concurrency tokens, not decision values; they stay current as before, and Core decides.

| Site | Before | After |
|---|---|---|
| Country listing (`admin.ts:259`) | Hidden `listingState` = opposite of the current listing. A stale "Unlist" became "List". | Hidden `listingState` = the submitted value; wording follows it; `#listing-current-<id>` shows the current listing. A first-time form still offers the opposite of the current listing. |
| Launch and expansion decision (`launch-decision.ts:376`) | Hidden `planId` = current plan after any refusal. A resubmission approved a plan the reader never reviewed. | Hidden `planId` = the submitted plan. The comparison ("A plan that is no longer current" beside "Version n") shows for a stale revision and whenever the sent plan is not current; Core refuses the old plan until the reader reviews. |
| Business values publication (`routes.ts:100`) | The refusal read the values' current preview and rendered its open form (hidden `previewId` of a preview the reader never reviewed). | The refusal renders the preview the form named, when it is a business values preview of these values; otherwise the values page with the refusal and the typed values (`form: 'publish'`). |

Checked and not a rebuilt decision value: the preview page's `previewId` and `baselineId` (the page's own preview),
the support view `accountId` (the page's own account), the new-values `declarationId` (the target the reader chose;
when that target is gone, R-03 applies), the launch acknowledgements (Core requires the current list; "nothing
ticked" after a mismatch is designed).

Behaviour change pinned by an older test: `launch-pages.test.ts` "a stale revision ..." asserted the current plan in
the hidden field. It now asserts the plan the reader sent.

## 3. R-02: no cut of submitted input

Removed: `identity.ts:162` (`typedProblem` reason, every account action), `:405` (account create: role, email,
display name, reason), `:508` (grant create: grantee, group, purpose, date), `:535` (support view account reference).
Each field reaches Core whole and renders back whole. The group reference keeps `.trim()` of surrounding white space
(no length cut; a pasted reference with a trailing space stays usable).

Catalogue sweep (`src/apps/staff/catalogue/*.ts`): no cut of submitted input found. Remaining `.slice`/`split` calls
cut display text or field names only (`sentenceCase`, step lists, the digest prefix, code and field-name parsing,
the reference count in `audienceWords`, the stale-row comparison).

Proof: a 330-character address (a valid address, spaces to character 320, a suffix) is forwarded exactly; the wire
contract and `normalizeEmail` refuse it, while the old cut at 320 normalized to the valid address.

## 4. R-03: refusal and submitted values independent of the current eligibility

`unsentBlock` (`admin.ts:136`) renders the refusal, every submitted value read only ("Your unsent values"), the
submit shown unavailable with its reason, and "Review current information". It reads only the refusal and the
submitted values.

| Page | When the form no longer applies | Block id |
|---|---|---|
| Offering: declaration draft | Another draft opened, or the offering is retired | `declaration-unsent` (replaces `declaration-kept`; now also the reason and the refusal) |
| Offering: new business values | Another draft opened, retired, or the target declaration is gone | `new-baseline-unsent` |
| Declaration: owner approval | Supported with nothing waiting, or a planning record | `approval-unsent`; with the form shown, `#approval-items-unsent` names a structure choice or items no longer offered |
| Declaration: binding | Binding registered meanwhile | refusal callout in `#bindings` (the form has no values) |
| Declaration: preview | Became the head, or no longer publishable here | `preview-unsent` in `#publication` |
| Business values: edit | Published or superseded meanwhile | `edit-unsent` |
| Business values: preview | Not editable or not of the head | refusal callout |
| Business values: publication named no preview | Hand-made or missing preview | `publish-unsent` |
| Publication decision | Out of date, no longer current, already published | `publish-unsent` in the decision's leading slot |
| Launch decision | Unavailable, withdrawn, launched, expansion not open | `decision-unsent` in the leading slot; a first launch by another SuperAdmin is stated once (no duplicate refusal) |
| Account page | Action not offered in the current status | `#unsent` after `#refusal` |

## 5. Tests

Added (13):

- catalogue-pages: "a refused listing re-renders with the submitted listing decision in its hidden field, never one rebuilt from the current listing"; "baseline creation refused because another draft opened: ..."; "a refused approval, binding or preview whose form the current state no longer offers keeps the refusal and every typed value"; "a refused edit after another SuperAdmin published the values: ..."; "a publication that named no preview of these values: ..."; "a stale publication preview keeps the continuation choices, the price correction, the evidence and the reason with the refusal; no form".
- launch-pages: "a refused decision keeps the plan the reader sent in its hidden field, never one rebuilt from the current plan; ...".
- accounts-pages: "a refusal of an action the page does not offer now keeps the whole unsent reason, ..."; "an oversized address is sent to Core whole and refused there, never cut into a valid address; ..."; "a refused action keeps the whole reason, however long; a support view refusal forwards the account reference whole".
- bff-catalogue (real BFF, scripted Core): "a refused listing is shown again with the listing decision the reader sent, ..."; "a refused business values publication shows the decision page of the preview the form named, ..."; "an oversized address reaches Core whole, ...".

Changed (3): the declaration-draft test (now asserts the refusal, the reason and the unavailable submit); the launch
test with `typed: {}` (now non-empty audience, accounts, acknowledgement, evidence and reason, also for the
launched-first and suspended-expansion states); the launch stale-revision test (the sent plan, §2).

## 6. Checks

| Check | Result |
|---|---|
| `npm run typecheck` | Clean (whole tree, including the other engineer's files at the time of the run). |
| `npx eslint` on the 6 source and 4 test files | Clean. |
| `node --test` catalogue-pages, launch-pages, accounts-pages, bff-catalogue, carried-forms-admin, bff | 144 pass, 0 fail (131 before). |
| System: ported-pages, new-service, flows (`--test-concurrency=1`, global setup) | 17 pass, 0 fail. |

## 7. Open items (ranked)

| Item | Rank | Likelihood | Proposal |
|---|---|---|---|
| `unsentBlock` lives in `admin.ts` because `catalogue/shared.ts` and `src/web/ui/` were outside this write set; `baselines.ts` and `launch-decision.ts` import it from `admin.ts`; `accounts/pages.ts` has its own small copy. | P2 | Certain; no user effect. | Move it to `src/web/ui/results.ts` as a design-system component (next to `staleComparison`), with its own style; the account page then uses it too. |
| The elevation requests page and the grant revoke form do not render a typed reason back after a refusal (carried forms of a later package). | P2 | Moderate: a too-short reason on approve, decline or revoke; the reader types it again. No wrong action. | Fix when that package rebuilds the pages. |
| The unsent block of a decision page sits in the leading slot before the h1 (the decision component has no notice slot; parked D-U3-03). | P2 | Certain on those refusals; heading order only. | A notice slot in `decisionPage` when the next decision kind needs it. |
| `DESIGN.md` names neither rule of this fix. | P2 | — | Add under "One host page per command": "A refused form posts the decision the reader sent, never one rebuilt from the current state; the current state shows separately. A refused form that the current state no longer offers keeps the refusal and every submitted value, read only, with the submit unavailable and 'Review current information'." |
