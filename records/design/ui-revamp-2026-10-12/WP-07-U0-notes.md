# WP-07 U0 notes: operator components and the operator reading

Unit U0 of WP-07. Author: the U0 engineer, 13 October 2026. Input for the architect's integration, the gallery
registration, the `DESIGN.md` update and the page units U1 to U6. U0 commits nothing; the architect integrates. Base:
lane commit 101eff1. Binding inputs: `WP-07-design.md` §1.6, §2.0 to §2.8, §5, §7.1 (U0 row); `WP-07.md` §3 and
§4.1 to §4.12 (F-01 to F-39; the amendments govern where they differ from the design).

## 1. Files

| File | Change |
|---|---|
| `src/web/ui/readiness.ts` (new) | CMP-15 `readinessChecklist`. |
| `src/web/ui/money-panel.ts` (new) | CMP-16 `moneyPanel`. |
| `src/web/ui/saved-views.ts` (new) | CMP-20 `savedViewTabs`, `savedViewCountText`. |
| `src/web/ui/bands.ts` | CMP-11 staff meta (`staff` option, `maskedPassport`). Without `staff` the band renders byte for byte as before (test). |
| `src/web/ui/index.ts` | Three `export *` lines appended. |
| `static/css/components.css` | One marked block (about 220 lines) inserted before the back/forward-cache rule, inside the first `@layer components`. Tokens only; no existing rule changed. |
| `src/apps/staff/work/reading.ts` (new) | Closed tables and pure functions of the operator's reading (§3). |
| `scripts/dev/gallery/operator.ts` (new) | 2 gallery pages, `operatorGalleryPages()`; exports the fixtures `galleryOpsCase`, `galleryCaseWork`, `galleryAct`. Not registered. |
| `test/unit/web/operator-components.test.ts` (new) | 21 tests. |
| `test/unit/web/operator-reading.test.ts` (new) | 52 tests. |

The design's U0 row also names `src/apps/staff/work/frame.ts`. The U0 brief did not assign it, so U0 did not build
it. `reading.ts` supplies the frame's words (`protectedStateItems`, `externalActsLines`, `originalsLines`) for U2.

## 2. Component APIs

```ts
// CMP-15 (src/web/ui/readiness.ts)
READINESS_GROUPS = ['mandatory','prerequisites','gates','cutoffs','holds','other']   // fixed order; readinessGroupTitle(key)
type ReadinessStatus = { kind: 'met' | 'not_met' | 'no_blocker_now' | 'checked_at_request' | 'applicability_unknown'
  | 'no_exception_exists' | 'not_applicable_yet' | 'unavailable' } | { kind: 'allowed_by_exception'; scope: string };
readinessStatusText(s)   // "Met", "Not met", "Action allowed by exception ([scope])", …
interface ReadinessRow { label; status; evidence?; lines?; owner?; route?: { label; href }; reference? }
readinessChecklist({ title, lead?, id? = 'readiness-checklist', headingLevel? = 2, groups: { key, title?, rows, notes? }[] })
// CMP-16 (src/web/ui/money-panel.ts)
type MoneyFactValue = { state: 'amount'; paise: bigint; prefix?; detail? } | { state: 'text'; text }
  | { state: 'not_recorded'; text? } | { state: 'unavailable'; text? } | { state: 'payment_unknown' };
moneyPanel({ facts: { label; value }[], title? = 'Money', id? = 'money-panel', headingLevel? = 3, note? })
// CMP-20 (src/web/ui/saved-views.ts); counts reuse WP-06 QueueCount
savedViewTabs({ label, views: { key; label; href; count: QueueCount; unit? }[], current, id? = 'saved-views' })
savedViewCountText(count, unit?)   // "3 applications", "None" (known zero), "Unavailable", "12 applications shown"
// CMP-11 staff meta (src/web/ui/bands.ts)
identityBand({ …, staff?: { passportNumber?; kind?; travelAgent?: { name; suspended? }; operator?: { state: 'you' }
  | { state: 'named'; name } | { state: 'none' }; synthetic? } })
maskedPassport(n)   // last two characters; null below three characters (never the whole number)
```

- CMP-15: `h2` title (or `h3`), one `h3` (or `h4`) per group that has rows, in the fixed order; a group given twice
  shows once. A row reads "[status]: [evidence]", then its lines, "Owner: [owner]", one route, "Reference code:
  [code]". Status word with icon and `data-tone`: Not met `blocked`, exception `warning`, Met `success` (ink with
  check), the rest `neutral`. A status outside the set reads "Unavailable". No summary, count, "Ready" or percentage.
- CMP-16: `dl` rows; amounts through `money(…, 'neutral')`; a negative amount reads "Unavailable"; no "due", "owed",
  total or sum. `data-money-state` = known, not_recorded, unavailable, uncertain.
- CMP-20: `nav` of links (GET), `aria-current="page"` on the current view, count line under each name
  (`data-count-state`). No form, input or button.
- CMP-11: staff order Passport, Service, Kind, Group, Travel agent, Operator, Data ("Synthetic" badge, neutral). The
  passport cue shows "Passport ending 47"; the `dt` holds a visually hidden " number", so a screen reader reads
  "Passport number ending 47" (no `aria-label` on a generic element).

## 3. The operator reading (`src/apps/staff/work/reading.ts`)

Closed tables: `ACT_STATE_WORDS` (state × shape, F-01, F-24, WP-11 §2.9); `OPERATOR_SENTENCES` (`ready` staff
variant, WP-13 §2.13.5 launch and impact sentences, `act_already_open` with the "authorized" spelling) and the shape
sentences of `awaiting_external_result` and `filing_possibly_occurred` (F-21); `STEP_WORDS` (no step says
"perform", F-33); `OWNER_LABELS` and the amended labels (`DEFERRAL_WAIT_LABEL`, `DEPENDENCY_WAIT_LABEL`,
`PARKED_RETURN_LABEL`, `OTHER_OPERATOR_LABEL`); `TIER1_REASON_MARKERS` and the tier-2 markers; `CHECKLIST_CODES`
(code → group, status, owner, route, structural row); `PANEL_BLOCKERS` (blocker type + the design's words);
`OWN_STEP_TARGETS`; `LATER_PAGES` (page of a later package and its WP-07 tab until served).

Pure functions:

| Function | Use |
|---|---|
| `workRows(work, { incidents, reader, handovers })`, `viewOf`, `ownerLabelOf`, `alertOf`, `byAlert`, `viewRows`, `workViewOf` | OP-01 and OP-01a rows: one view per application, owner label, tier and markers, step, blocker (unknown reason keeps its code) |
| `workNeedingAttention(work, incidents, reader, handovers)` | The navigation count = the rows of "Action now" (same signature as the `ops.ts` function it replaces) |
| `continuingDuties(work, incidents, reader)` | OP-01 Continuing duties (null when incidents are unread) |
| `checklistReading({ case, work, evidence?, requirementLabel?, documentHref?, bases?, hrefs? })`, `gateRows`, `readinessGateRow`, `checklistBlockers`, `checklistPlace`, `dependencyStateWords`, `requirementSentence`, `relationWords`, `exceptionLines` | CMP-15 groups for OP-02 Work and OP-04a; `bases` is the P-10 (e) switch adapter |
| `actionPanelReading({ case, work, handover?, today? })` | CMP-01 rows (`row`, owner, step, blocker type + words, action, secondary, notice in `boundaryNotice` form, lines, review point) |
| `protectedStateItems(case, viewer)`, `externalActsLines`, `originalsLines`, `authorizedStateText`, `authorizedStep` | Frame banner (F-24, F-26, F-33, F-39 b) and status facts (F-19, F-29) |
| `operatorMoneyFacts(case, work)`, `MONEY_NOTE` | CMP-16 facts (F-05: no gate becomes a money fact) |
| `offeredActs`, `nextActOffer`, `feeActHidden`, `FEE_ACT_HIDDEN`, `checklistTitle`, `anyPossiblyFiled`, `isOpenAct` | F-02, the checklist subject, §2.4.6 |
| `operatorHref(appId, target, { from?, served? })`, `operatorRoute` | Every place keeps `from=applications`; later pages fall back to their tab until the inventory serves them |

View precedence (F-07, F-16, F-30, F-36): review due, open problem report, owned custody incident → Action now;
`deferral_active` (not due), dependency wait, Core-reported offering hold → Waiting; `parked_custody_route_policy` →
Delivery and closure; own step → Action now; `hold_returned_to_ta` → Returned; delivery progress or
`packet_released` → Delivery and closure; else Waiting. Only Action now is counted.

Action-panel rows: 1, 2 (F-33), 3a/3b (F-13), 4 (F-36 transition step), 5 (Gate 1 flag; known gap during approved
help), 6/6a/6b (F-17), 7 (Gate 2 → secondary "Flag to SuperAdmin"), 8/8a/8b, 9, 10a (F-16), 10h, 10p/10r (F-31),
10d, 10c, 10, 11.

## 4. Decisions made in U0 (deviations for the record)

| ID | Decision | Reason |
|---|---|---|
| D-U0-01 | A due deferral review in Action now reads owner "You must act", not "No current action; next review [date]". | Design §2.1 text predates F-07; an Action-now row never says "no current action". |
| D-U0-02 | Panel row 10d for an approved deferral: before the review "No current action until the deferral review on [date]" (owner `DEFERRAL_WAIT_LABEL`); when due "Review the deferral: its review date is reached". The page passes `today` (IST date). | Design row 10 would offer "Review the deferral" before it is due, against F-07. |
| D-U0-03 | Rows added to the closed table: 10h (offering hold Core reports), 10c (`reapply_correction`: no staff page, line), 10p/10r (F-31); row 1 reads "Reconcile whether the provider handoff happened" for a handoff. | F-36, F-27, F-31, F-06 class. |
| D-U0-04 | The separate fee act is hidden while the submission is `filing_unknown` **or `reconciliation_exhausted`**. | Both mean the filing is unknown. Max's decision names "filing unknown"; the architect confirms or narrows. |
| D-U0-05 | "Mandatory validations" lists mandatory requirements only. | An optional document does not block; "Not met" for it would mislead. |
| D-U0-06 | Gate 1 interim: "Met: work started on this assignment; the gate was checked then". | The status word stays in the closed set; the design's "Met when work started…" joined the words. |
| D-U0-07 | A Gate 2 basis `not_applicable` (after the switch) omits the row. | "Not applicable for this service" is not in the closed status set. |
| D-U0-08 | List rows (no acts on the read) use neutral sentences for `awaiting_external_result` and `filing_possibly_occurred`. | F-21: a list cannot tell a handoff from a filing. |
| D-U0-09 | Banner words for problem report, return and flag: "Problem reported by the travel agent on [time].", "Returned to the travel agent on [time].", "Flagged to a SuperAdmin on [time]. [The SuperAdmin responded on [time].]". | The design names the items, not their words. Draft copy (CR-09). |
| D-U0-10 | `held_correction_released` on the operator checklist: owner SuperAdmin, line "Applying a released correction again is not available on staff pages in this release. …", no link. | F-27 routes to SA-04a, which an operator cannot open; no package id on a page (F-22). |
| D-U0-11 | The dependency state `unlinked` reads "Applicability unknown: Unrecognised state" with its code. | WP-10 §2.11.3 "other" row. |
| D-U0-12 | "A Gate 1 exception never passes Gate 2." shows only for a TravelMudra-filed service. | Gate 2 does not apply to the other modes. |
| D-U0-13 | "Synthetic" is a meta item "Data: Synthetic" (neutral badge). | A `dl` needs a term. |

## 5. Items for the page units and the architect

1. **Navigation count (U7).** `reading.ts` exports the amended `workNeedingAttention` with the old signature. U7
   switches `src/apps/staff/attention.ts` to it and removes the copies in `src/apps/staff/core/ops.ts`. The count
   drops a deferral before its review, dependency waits and the parked return (F-07, F-16, F-30): the design's line
   "`nav-counts.test.ts` (rule unchanged)" no longer holds; check that test at integration.
2. **`actionPanel` gap (WP-02 `panels.ts`), P2.** It shows only the four fixed blocker texts and takes a `Date` review
   point. WP-07 rows carry their own words (`PanelReading.blocker.text`, `lines`) and a date-only review point.
   Proposal: an optional `blockerText` and a date review point; until then U2 renders the words in `notice` (the
   gallery does).
3. **F-33 in the shared labels, P2 (latent).** `nextActionLabel('perform_external_act')` reads "Perform the authorised
   external act" (`presentation.ts`). Core's pending answer never returns that code today (`derived.ts` uses
   `record_external_evidence`). `reading.ts` overrides it on operator pages. The architect's one-value change for
   `authorize_external_act` can take this value too.
4. **Shared sentences.** `CORE_MESSAGES.ready`, the WP-13 launch sentences and `act_already_open` ("authorised") stay
   in `shared.ts`; operator pages must use `operatorSentence`, never `sentence`, for reasons.
5. **F-36 list and count: Unmet (L-08).** The mapping applies when Core's pending answer reports a launch-hold code;
   Core does not report one today, so the rows stay where Core's owner puts them.
6. **F-35.** Continuing duties membership only; the state and owner words come from WP-14 `incidents/words.ts`.
7. **Later pages.** OP-02r, OP-04p, OP-04r, OP-06h, OP-05, OP-09, OP-02e resolve to their WP-07 tab until the route
   inventory registers their GET route (`operatorHref`, `served` option for tests).
8. **Gallery.** Register `operatorGalleryPages()` (`scripts/dev/gallery/operator.ts`) in
   `scripts/dev/gallery-pages.ts`. The states page shows ten "Next action" panels, so axe reports one moderate
   `landmark-unique`; the sweep fails only on serious or critical.
9. **`DESIGN.md`.** Add CMP-15, CMP-16, CMP-20 and the staff meta to the Components table.

## 6. Checks run

| Check | Result |
|---|---|
| `npm run typecheck` | Clean for U0 files. Earlier runs showed transient errors in other engineers' new files only. |
| `npx eslint` on the U0 files and tests | Clean. |
| `node --test test/unit/web/operator-components.test.ts` | 21 pass. |
| `node --test test/unit/web/operator-reading.test.ts` | 52 pass. |
| `node --test "test/unit/web/**/*.test.ts"` | 1108 pass, 0 fail, 1 todo (existing, `individual-intake.test.ts`). |
| `node --test "test/static/**/*.test.ts"` | 74 pass. |
| Local render of the 2 gallery pages (scratch script, product CSP, Playwright + axe) | Light and dark at 1440, 390, 360 and 320 px: no horizontal overflow, no CSP violation, no script error, no serious or critical axe violation. |

Not run: the full `npm run test:ui` browser sweep (the U0 gallery pages are not registered yet, so it would not cover
them; the local render above applies the same checks to them).
