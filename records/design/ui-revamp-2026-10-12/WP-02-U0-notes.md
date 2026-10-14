# WP-02 U0 notes: decision page and object panels

Unit U0 of WP-02. Author: the U0 engineer, 12 October 2026. Input for the architect's integration, the gallery
registration and the `DESIGN.md` update. U0 commits nothing; the architect integrates. Base: lane commit 42cb373.
Binding inputs: `WP-02-design.md` §1.6, §3.0, §3.10, §8.1 (U0 row); `WP-06-design.md` §1.6, §2.0, §2.7;
`WP-03-design.md` §1.6, §2.3, §2.7, §3.1, §3.2; `WP-02.md` §3 and §4.1 (B-02, B-03, B-06); `WP-06.md` §4.1 (D-02,
D-08); `WP-03.md` §4.1 (C-02); UI-PLAN §8.1 (CMP-01, CMP-03, CMP-25) and SA-09.

## 1. Files

| File | Change |
|---|---|
| `src/web/ui/decision.ts` (new) | `decisionPage` (CMP-25) and its option types. |
| `src/web/ui/panels.ts` (new) | `actionPanel` (CMP-01), `statusFacts` (CMP-03 subset) with fact constructors, `objectTabs`. |
| `src/web/ui/index.ts` | Exports of the two new modules. |
| `static/css/components.css` | One block before the back/forward-cache rule: `.decision*`, `.decision-effect*`, `.decision-stops*`, `.decision-approval*`, `.decision-review*`, `.action-panel*`, `.status-facts*`, `.object-tabs`. Tokens only; no raw colour. |
| `scripts/dev/gallery/decision.ts` (new) | `decisionGalleryPages()`: 10 signed-in pages (§5). Not registered; the architect adds it to `galleryPages()` in `scripts/dev/gallery-pages.ts`. |
| `test/unit/web/decision.test.ts` (new) | 25 tests. |
| `test/unit/web/panels.test.ts` (new) | 18 tests. |

## 2. APIs

```ts
decisionPage(o: DecisionPageOptions): SafeHtml          // the whole content of main
actionPanel(o: ActionPanelOptions | ActionPanelUnavailable): SafeHtml
statusFacts(o: StatusFactsOptions): SafeHtml
objectTabs(o: { label: string; tabs: readonly ObjectTab[]; current: string }): SafeHtml
knownFact(value, detail?) · notRecordedFact(text?) · unavailableFact(text?) · uncertainFact(text)
recordedFact<T>(value: T | null | undefined, render: (v: T) => Renderable, notRecorded?: string)
blockerText(type: BlockerType): string; BLOCKER_TYPES; DECISION_STATES
```

`DecisionPageOptions` is a frame plus one state, discriminated by `state`:

| Frame field | Content |
|---|---|
| `id?` | Prefix of every id; default `decision`. Ids: `-scope`, `-evidence`, `-effect`, `-hard-stops`, `-decide`, `-review`, `-actions`, `-form`, `-errors`, `-stale`, `-reason`, `-boundary`, `-approval-note`, `-no-exception`, `-closed`. |
| `receipt?` | The `operationReceipt` output. Rendered first, before the header. |
| `header` | `PageHeaderOptions` (breadcrumb, h1 "[decision]: [subject]", freshness). |
| `scope`, `evidence` | `{ title?, lead?, body }`. Headings default "Scope" and "Evidence". |
| `hardStops?` | `{ title?, lead?, items (non-empty) }`. Heading default "Hard stops (no exception exists for these)". Left out: no block. |
| `cancel` | `{ href, label? }`; label default "Cancel". A link (`buttonLink`), never a form. |

| `state` | Extra fields | Renders |
|---|---|---|
| `draft` | `effect`, `form`, `review`, `errors?`, `stale?` | Effect, hard stops, form: error summary, stale comparison, hidden fields, "Your decision" (fields, reason), review, submit and Cancel. |
| `second_approver_required` | as `draft` + `approver` (role noun, "SuperAdmin") | As `draft`; "Approvals" block first in "Your decision" (first: yours; second: "Not recorded. A different [approver] records it."); review line "It takes effect only after a different [approver] records the second approval." |
| `awaiting_second_approver` | as `draft` + `approver`, `firstApproval { by, at?, openUntil? }` | As `draft`; Approvals block (first: name and recorded time; second: yours; open until); review line "Yours is the second approval. The decision takes effect when it is recorded." |
| `awaiting_second_approver` + `viewerIsFirstApprover: true` | `approver`, `firstApproval`, `effect`, `submitLabel` | No form. Effect, hard stops, Approvals block with the note "You recorded the first approval. A different [approver] records the second, so this page has no form for you." The button is `unavailableButton` described by that note. |
| `unavailable` | `effect`, `boundary` (`boundaryNotice` options; `id` optional), `submitLabel`, `links?` | No form. Effect, hard stops, "Your decision" holds the boundary notice and the links; the button is `unavailableButton` (focusable, `aria-disabled`, `aria-describedby` = notice id); Cancel. No review. |
| `no_exception` | `control` (subject of a sentence), `detail?`, `links?` | No form, no button. Hard stops, then a blocked-tone block, h2 "No exception exists for this control", "[control] stops this action. No decision can pass it, so this page has no form." No effect, no review. |
| `closed` | `title`, `statement`, `links?` | No form, no button. Info-tone block with h2 `title`, the statement and the links. For "already decided", "not needed", "not open". With `receipt` it is the page after an accepted decision. |

`DecisionForm`: `action`, `csrfToken`, `operationKey`, `hidden?` (record of name → value, for `_rev.*`, `planId`,
`gate`, `action`, `applicationId`), `fields?` (the kind's own fields, `SafeHtml`), `reason?` (`DecisionReason`:
`label` names its purpose, `name` default `reason`, `value`, `error`, `hint`, `optional`, `rows` default 3,
`maxlength`), `submitLabel` (the decision verb), `destructive?`. `DecisionEffect`: `changes` and `unchanged` (both
non-empty, compile-time), optional labels (defaults "What this decision changes", "What stays unchanged"), `more`
groups ("It ends", "Follow-up"), `detail`. `DecisionReview`: `title?` (default "Review your decision"), `lead?`,
`items` (non-empty).

`ActionPanelOptions`: `owner`, `step`, `blocker?` (`evidence` | `decision` | `other_owner` | `policy`, shown as "Blocked:
Evidence or details can fix it / A decision can resolve it / Another person owns this step / Policy unavailable"),
`notice?` (a `boundaryNotice`), `alsoNeeded?`, `action?` (the one action), `secondary?`, `reviewPoint? { label, at }`
(shown only when given and readable), `id?` (default `next-action`), `headingLevel?`. `ActionPanelUnavailable`:
`{ status: 'unavailable' }` renders "The owner and the next step cannot be read now." and no control.

`StatusFact`: `{ label, value: StatusFactValue }`; the value is `known` (value, detail), `not_recorded` (text, default
"Not recorded"), `unavailable` (text, default "Unavailable") or `uncertain` (text, shown as "Uncertain: [text]").
A `known` fact with an empty value renders "Not recorded", never blank. `statusFacts` renders a `section` with a
visually hidden h2 "Status" (or a visible title) and one `dl` cell per fact, each with `data-fact-state`. No badge,
no percentage.

`objectTabs`: `nav.object-tabs` with the shell's `local-nav__list` and `local-nav__link` markup; the current view has
`aria-current="page"`; fewer than two views render nothing.

## 3. Decisions of this unit (material choices)

| Id | Choice | Reason |
|---|---|---|
| D-U0-01 | The error summary is the first child of the form (after the hard stops), not the first element of main. It keeps `autofocus`, so the page opens at it. | `DESIGN.md`: "at the top of the form". The script's inline validation looks for `[data-error-summary]` inside the form and prepends its own when absent; a summary outside the form would give two summaries. |
| D-U0-02 | The stale comparison sits inside the form, above "Your decision"; the fields, the review and the button stay. | Design §1.6 "CMP-14 above the fields"; WP-02 §3.10 C5 "typed values kept". Which `_rev` the page posts after a stale refusal is the page's choice. |
| D-U0-03 | The review is a plain `section` with its own h2 before the action bar. No `<details>`, no checkbox, one submit button. | Lane instruction (no extra confirmation box, no two-step post). The UI-PLAN SA-09 sketch shows "[Review decision] → consequence review → [Record …]" as two steps; the lane instruction governs. |
| D-U0-04 | `no_exception` and `closed` render no effect and no review; `unavailable` and the own-request state keep the effect. | No decision can be made in the first two; in the last two the effect tells the reader what the decision would do. |
| D-U0-05 | The reader's own two-person request is a variant of `awaiting_second_approver` (`viewerIsFirstApprover: true`). The page compares the record's requester with the reader's account; Core still refuses (`second_superadmin_required`). | WP-06 §2.1 row 7 ("presentation of the record, not a permission"); WP-02 acceptance A88 (no usable approve control for the requester). |
| D-U0-06 | `objectTabs` uses `nav.object-tabs`, not `nav.local-nav`. | Tests and the system flows select the destination tabs by `main > nav.local-nav` and `main nav.local-nav a` (`shell.test.ts`, `signed-in.test.ts`, `flows.test.ts`, `gallery.test.ts`). The list and link classes are shared, so the look is the same. |
| D-U0-07 | The review heading defaults to "Review your decision" (design: "Review"). Pages MAY pass `review.title`. | A bare "Review" does not say what is reviewed. Draft copy (CR-09). |
| D-U0-08 | The component adds two fixed review lines only for two-person decisions (effective after the second approval). Every other sentence is the caller's. | One rule for every two-person kind (ceiling increase, elevation). |

## 4. Notes for the engineers of the pages

- **One decision page per kind.** Build the scope, evidence, effect and hard-stop content from the read model only
  (B-06). D-08: the effect text comes from the recorded gate and action of the subject, not from the route kind.
- **Receipts (B-02, D-02).** Build the `ReceiptExpectation` per done code, call `readReceipt`, pass
  `operationReceipt(...)` as `receipt` and `receiptDocumentTitle(state)` as `receiptTitle`. A receipt whose check
  fails is the neutral unchecked receipt; do not word it in the page. After an accepted decision the page usually
  shows a `closed` state ("already open", "already launched") with the receipt.
- **Refusal (C1/C2).** Re-render with `errors` (field order; form-level items without a field id), the field values
  and `reason.value` the reader typed, `reason.error` or field errors, a new `_op`, and `restorePath` on
  `signedInPage` when the page is shown at its POST path. The reason textarea id is `[id]-reason`, so a field error
  links to `#decision-reason` by default.
- **Outage (B-03).** A read that answers unavailable through `optionalView` becomes `unavailableFact()` in
  `statusFacts`, `{ status: 'unavailable' }` in `actionPanel`, or "Unavailable" text in a scope or evidence row.
  Never "nothing changed" unless a refusal is proven. No component catches errors.
- **Blocker types.** WP-03 §3.1 table: evidence → `evidence`; offering or policy codes → `policy` with a
  `boundaryNotice` in `notice`; an operator holding the step → `other_owner`; a SuperAdmin decision → `decision`.
  Use `ownerLabel(owner, audience)` for `owner` so the TA reads "You" and staff never read "you" for the TA.
- **Disabled actions.** A policy boundary: `unavailableButton({ label, noticeId })` with the notice in `notice`. A
  support view: `button({ type: 'button', disabled: { id, reason: 'Read only in a support view' } })`.
- **Status facts.** Pass every fact the page shows as its own row; use `recordedFact(value, render, 'Outcome not
  recorded')` for nullable values instead of `?? 0`. A count that Core returns as 0 is a known fact.
- **Object tabs.** Give the `nav` a label that differs from the shell's tabs ("Views of this offering").
- **Mobile.** Decision pages are full-screen task pages: scope and effect come before the fields by construction;
  the action bar is at the end of the form, never fixed.

## 5. Gallery

`decisionGalleryPages()` (admin shell unless stated): `decision-launch.html` (draft), `decision-refused.html`
(field and form-level problems, typed reason kept), `decision-stale.html` (comparison, typed values kept),
`decision-first-approval.html`, `decision-second-approval.html`, `decision-own-request.html`,
`decision-unavailable.html`, `decision-no-exception.html`, `decision-closed.html` (with an accepted receipt),
`panels.html` (TA shell: status facts in every state, object tabs, eight action panels). Synthetic data only.

## 6. Checks

| Check | Result |
|---|---|
| `node --test test/unit/web/decision.test.ts test/unit/web/panels.test.ts` | 43 of 43 pass. |
| `npx eslint` on the seven changed files | Clean. |
| `npm run typecheck` | Clean (whole project) on the final run. An earlier run showed `SealRouteDef` errors in `src/apps/shared/app.ts`, `server.ts` and two tests from another unit's uncommitted work in this working tree; they were gone at the final run. |
| Scratch browser sweep of the 10 gallery pages (the checks of `test/ui/gallery.test.ts`: 1440 and 390 px in light and dark with axe WCAG 2.2 A/AA and best practice, overflow, CSP; 360 and 320 px overflow) | No overflow, no CSP violation, no script error, no serious or critical axe violation. One moderate `landmark-unique` on `panels.html` (eight "Next action" regions on one gallery page; a real page has one). |
| `npm run test:ui` | 736 of 736 pass (U1's in-progress files included; the gallery module is not registered yet, so the sweep does not open its pages). |

## 7. Findings

| Id | Rank | Finding | Scenario | Disposition |
|---|---|---|---|---|
| F-U0-01 | P2 | `panels.html` repeats the region name "Next action" eight times (axe `landmark-unique`, moderate). | Only the gallery page; product pages render one panel. | Parked. |
| F-U0-02 | P2 | The UI-PLAN SA-09 sketch shows a two-step review; the lane instruction forbids it. | A later reader of UI-PLAN builds a second step. | Recorded as D-U0-03; the architect MAY note it in `DESIGN.md`. |
