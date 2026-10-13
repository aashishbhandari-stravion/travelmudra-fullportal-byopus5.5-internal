# WP-17 design review: group end, withdrawal, deferral, timing

Lane `ui-revamp-2026-10-12`. Author: Principal UX Engineer (Claude Opus subagent). Date: 13 October 2026.
Status: design before code, for the architect's decision (LD-12) and the independent design review (LD-13: WP-17 holds
commands that end work for good (a group closure, three withdrawal paths), change the price the travel agent pays, and
hold filing (a deferral); so a Codex design review applies).
Product base: lane repository at b2a6341 (WP-01, WP-20, WP-02, WP-03 integrated). WP-06 to WP-16 are designed and not
built; this design depends on their units named in §1.7 and amends five of them (§1.8). This document writes no product
code. Paths in `file:line` form are relative to the lane repository at b2a6341 unless they start with `REC/`
(`internal/records/`) or `RM` (lane `research/route-map.md`). Code is read as committed (`git show b2a6341:<path>`); the
working tree was not read.

Writing style: ASD-STE100 at about 75%. `MUST`, `MUST NOT`, `SHOULD` and `MAY` have their normative meaning.
"Current" means the code at b2a6341. "Target" means the specification or the plan. "Core decides" means the page shows
Core's answer and computes no permission or business fact (D4, D5).

## 0. Summary for the architect

- **Scope.** Thirteen register commands (COMMAND-COVERAGE §3, §5.1, §6 CC-02, CC-06, §6.1): on the travel agent's side
  `core.close_group` (TA-05), `core.edit_travel_dates` (TA-13b, built by WP-03), `core.request_withdrawal`,
  `core.decide_price_increase`, `core.apply_held_correction` (TA-07); on the operator's side `core.record_forecast`,
  `core.propose_deferral`, `core.end_deferral`, `core.record_applicant_withdrawal`, `core.recheck_travel_dates` (OP-02);
  on the SuperAdmin's side `core.decide_deferral`, `core.propose_price_increase`, `core.record_operational_withdrawal`
  (SA-09 kinds, CC-04) and `core.recheck_travel_dates` (SA-04a). Proof: V19, group-end part (WP-16 proved the financial
  part; WP-14 the disclosure part; WP-12 the originals).
- **Page model.** One host page per command use. Eight new task pages sit on GET routes beside their kept POST paths:
  TA-05c close the group, TA-07d price decision, TA-07w withdraw, TA-07c apply a held correction, OP-02f forecast, OP-02d
  propose a deferral, OP-02e end a deferral, OP-02w the applicant's withdrawal request. Five SA-09 kinds on WP-06's route:
  `deferral_approve`, `deferral_decline`, `deferral_extend`, `price_increase`, `operational_withdrawal`. The travel-date
  recheck stays an in-place, field-less form on OP-02 and SA-04a (D-W17-05). Every form keeps its action, its hidden
  inputs and its field names; the price decision becomes one form with a `decision` radio (D-W17-02, WP-13 precedent).
- **Group end (V19).** TA-05 states Core's closure rule and Core's facts and never computes "can close"; the closure is
  a task page that shows Core's refusal and its conditions. A withdrawn or cancelled unpaid, unworked application stays
  open until the day after the travel return date and then ends with the group (B25); TA-05 and TA-07 say so by Core's
  pending answer (`group_end_pending`). SA-04g shows each application's group-end answer and every reason in staff words;
  unknown filing, held originals, pending delivery and outstanding money read as reasons, never as a page rule.
- **Withdrawal.** Core records every request and assesses it; a refused assessment is an accepted command (WP-07 F-09).
  The receipts say "Withdrawal request recorded: refused, [reason]" or "Application withdrawn"; no page says "withdrawn"
  for a refused request. Under possible filing the operator and SuperAdmin pages show the boundary first and the
  request only under "Record the request only" (WP-07 §2.4.6).
- **Findings worked (§9.1).** Six LD-17 slices; a deferral decision whose refusal loses the form (shell error page);
  staff forms that lose typed values; refusals that render no message when the section's show condition changed; price
  entry in paise with no rupee view; the TA withdrawal and price forms inside disclosures with no effect text; the TA
  read cannot show the review date or the forecast reason; receipts from address flashes; 4096-byte bodies refuse valid
  reasons.
- **STOP items (§9.4).** No P0. No Kind 2 request. Kind 1 with a criterion exception, P1: forecast basis on the TA read;
  the held correction's values on the TA read. Defect P1: a deferral outlives its application (approve after an
  outcome; nothing ends it; no admin end route). Kind 1 P2: the TA deferral review date; travel-date impact preview;
  open counts and a `more` flag on the group read; deferral facts on the queue rows. Defects and notes P2: the
  price-increase contract cannot carry `correctionId`; a travel-date edit accepts past dates; an overtaken released
  correction cannot be cleared; a decided price change leaves its notice unacknowledged.
- **Top questions (§9.2).** Q-W17-01 TA-05c close task page. Q-W17-02 three deferral decision kinds. Q-W17-03 the price
  field stays in paise with a rupee view. Q-W17-05 a deferral decision after an outcome (warning, Core decides). Q-W17-06
  proof writes. Q-W17-09 body limits.

## 1. Scope, sources, pages, shell, commands

### 1.1 Sources read

| Source | Parts |
|---|---|
| UX spec `TARGET_PRODUCT_UX_SPEC.md` (SHA-256 b45186887cdc37f6…, as PLAN §1) | §2.1, §2.2 (exceptional deferral; next action; review point), §2.3, §3.1 (last paragraph: original estimate and forecast), §3.2 (group end; completed case with continuing duty; unknown external execution), §3.3, §4.1, §4.2, §4.3 (Corrections and pricing), §4.4 (original estimate threatened), §5.3 (unknown execution removes ordinary withdrawal), §5.4, §6.1, §6.2, §6.3 (Exception), §7.4, §8.3, §10.1 (withdrawal versus possible filing; completion versus follow-up), §12 V19 |
| `BUILD_SPEC.md` r2 | B06 (travel-date edit rechecks unfiled work), B14–B17, B18 (withdrawal waits for formal return), B21 (deferral), B23, B24 (withdrawal and cut-off), B25, B26, B29, B33, B35, B42 (group end is the only automatic ending) |
| `UI-PLAN.md` | §3.2 TA-05, TA-07, §3.3 OP-02, §3.4 SA-02, SA-04, SA-09, §4.2 (group end; completed case), §5.2 TA-04/TA-05, TA-07, §5.3 OP-02, §5.4 SA-02, SA-04, §7 (rows Edit group travel dates, Decide price increase, Acknowledge notice, Request withdrawal, Request deferral, Decide deferral), §8, §10, §11.3, §12.2 WP-17, §13.2 A-02, AD-06 |
| `DECISIONS-2026-10-10.md` | §3.1 (Kind 1 criterion), §3.2 (Kind 2 gate) |
| Lane records | `PLAN.md` §4 (LD-02, LD-03, LD-07, LD-08, LD-12 to LD-17), §7, §8 (S-06, S-08); `PROPOSALS.md` (P-02, P-10 b, P-17, P-19); `COMMAND-COVERAGE.md` §3, §5.1, §5.3, §6 (CC-02, CC-04, CC-06, CC-15), §6.1; `WP-03.md` §3, §6; `WP-03-design.md` §1.4, §1.5, §2.3, §2.4, §2.7, §3; `WP-03-U1-notes.md`; `WP-03-U3-notes.md`; `WP-06.md`, `WP-06-design.md` §1.5, §2.0, §2.2.4, §2.7; `WP-07.md` (F-01 to F-38), `WP-07-design.md` §1.4, §1.5, §2.0 to §2.4; `WP-09.md`, `WP-09-design.md` (TA-07p, unsent text block); `WP-11.md`, `WP-11-design.md` §1.2, §1.6, §2.0, §2.1, §2.8; `WP-13.md`, `WP-13-design.md` §1.6, §2.10, §2.11; `WP-16.md`, `WP-16-design.md` (structure; AM-W16-05; STOP-W16-06); `REPO/DESIGN.md` (rules for new screens) |
| Route map (RM) | §2 rows T07, T08, T34, T35, T48, T61, O23, O24, O42, O43, O60, D07, D22, D24, D30, D101, D128; §3.1 `core.ta_group`, `core.ops_case`, `core.ops_work`, `core.admin_queue`, `core.admin_group`; §3.2 rows of the 13 commands |
| Code (pages, routes) | `src/apps/edge/core/group-routes.ts`, `src/apps/edge/core/routes.ts:26-120`, `src/apps/shared/core/ta.ts:70-160, 485-813`, `src/apps/shared/core/ta-groups.ts`, `src/apps/shared/pages/groups.ts` (all), `src/apps/staff/core/ops.ts:40-70, 207-357, 396-505`, `src/apps/staff/core/admin.ts:40-80, 183-194, 209-430, 462-600`, `src/apps/staff/core/case.ts:60-110, 300-370`, `src/apps/shared/core/shared.ts:20-340, 366-396, 452-523, 633`, `src/web/route-inventory.ts` (rows above) |
| Code (contracts) | `src/contracts/core.ts:40-140, 160-175, 238-372, 405-440`; `src/kernel/vocabulary/core.ts` (`GROUP_*`, `PRICE_RECORD_*`, `FORECAST_BASES`, `WITHDRAWAL_STATES`, `DEFERRAL_STATES`) |
| Code (Core behaviour only) | `src/modules/core/commands/withdrawal.ts` (all), `groups.ts:55-200`, `submission.ts:205-340`, `drafts.ts:40-205`; `src/modules/core/writers.ts:142-182`; `src/modules/core/derived.ts:225-420`; `src/modules/core/store.ts:460-480`; `src/modules/core/tasks.ts:290-350`; `src/modules/core/travel-recheck.ts` (results) |
| Tests that pin behaviour | `test/core/completion-group-end.test.ts`, `test/core/groups-drafts.test.ts:50-98`, `test/core/submission-price.test.ts:77-260`, `test/core/withdrawal-dependencies.test.ts:45-103`, `test/core/travel-date-rules.test.ts` (names), `test/system/core-pages.test.ts:225-250, 338-400, 508`, `test/system/case-rules.test.ts:85-145, 335-345`, `test/unit/web/carried-forms-ta.test.ts` (all), §7.3 |

Three read-only research workers (13 October 2026, b2a6341) reported on the BFF handlers and host pages, on group
closure, group end, travel dates and held corrections, and on the deferral, price, forecast and withdrawal commands.
They confirmed the facts of §1.2, §1.5 and §9.1 and added: the staff `FormState` keeps no typed values (`ops.ts:68`,
`admin.ts:76`); a staff refusal callout renders only inside its form's show condition; an approved deferral also blocks
readiness; nothing ends a deferral on an outcome and no admin route ends one; a blank withdrawal reference fails at the
contract (field `evidence`); `core.ta_groups` carries Core's open count per group; `core.admin_group` lists closed
applications with `application_not_open`; a travel-date edit accepts past dates; an overtaken released correction pins
the pending answer.

### 1.2 What Core does (facts the pages rest on)

| Command (policy action; who) | Input (wire, `contracts/core.ts`) | Guards in Core's order | Effects | Result summary |
|---|---|---|---|---|
| `core.close_group` (`group.close`; the owning TA) | `groupId`; `_rev.group` → `expectedRevision` | Another TA: `not_found_or_forbidden`. Revision (`stale_revision`). `group_closed` (control_blocked). Then every closure blocker together, first code as the error code: `group_has_open_applications` (any application in `draft` or `submitted`), `group_intake_incidents_open`, `attempt_in_progress` (`groups.ts:114-147`). A withdrawn draft is still open (`groups-drafts.test.ts:79-81`) | `state = closed`, `closed_kind = ordinary`, actor, time; fact `core.group_closed`. No notice. No reopen command exists. A closed group refuses new drafts and date changes (`group_closed`) | `{groupId}` only (the same shape as `core.create_group`) |
| Group end (job `core.group_end_enqueue`, every 60 minutes by default, `config.ts:144-149`; task `core.group_end_sweep`, one per group and IST day; no person) | — | Runs only while the clock agrees with the database (`clockHealthy`) and only for an open group whose return date is before today (IST). Per open application, `groupEndEligibility` lists every reason (`derived.ts:247-266`): `application_not_open`, `group_end_pending` (today ≤ return date, IST), `service_payment_received`, `operator_work_authorized`, `filing_possibly_occurred` (any authorization exists, filed or not), `original_held`, `custody_evidence_missing`, `delivery_pending` (an email queued, sending or uncertain), `money_outstanding`, `protection_mark_active` | An eligible application gets `lifecycle = ended_with_group` (a completion record of kind `ended_with_group`, keeping any outcome such as `withdrawn`; fact `core.ended_with_group`); an open price increase is superseded with a TA `price_change` notice (`writers.ts:158-180`). Intake work blocks only the group closure, not the ending of applications. The group closes with `closed_kind = group_end` on the last page when nothing is open and no intake work remains; an open group past its return date is swept again every day. Pages of `sweepPageSize` (default 200); the Nth run repeats nothing; nothing is deleted (`tasks.ts:59-158`; `completion-group-end.test.ts:130-215`). In the product a paid or worked application never completes while completion is a deliberate boundary (LD-04), so its group never closes (Q-W17-11) | — |
| `core.edit_travel_dates` (`group.edit_travel_dates`; owning TA) | `groupId`, `travelStartDate`, `travelReturnDate` (`text(10)`); `_rev.group` | Locks the group, then every open application. Revision. `group_closed`. Return before start (field `travelReturnDate`). Both unchanged (`group_dates_invalid`, field `travelStartDate`, code `unchanged`). Unlike `core.create_group`, no check that the start is today or later, and no protection-mark stage (STOP-W17-12) | Group dates and `dates_revision` change; every open application's `material_revision` and revision +1 (readiness basis goes stale); task `core.travel_date_recheck` per dates revision; fact `core.group_travel_dates_edited` with `openApplications` | `{groupId, datesRevision}` |
| `core.recheck_travel_dates` (`travel_dates.request_recheck`; assigned operator or SuperAdmin) | `applicationId`; no revision | Lifecycle open (`application_not_open`). No recheck pending → `travel_date_recheck_not_pending` (control_blocked) | Runs the recheck against the dates now; result `rechecked`, `travel_rule_unknown` (stays pending; reruns by itself up to a bound) or `historical_or_held` (a possibly filed act: filed facts stay historical) | `{applicationId, result, retryAt}` |
| `core.request_withdrawal` (`application.request_withdrawal`; owning TA) | `applicationId`, `note` (≤ 2000, optional); `_rev.application` | Revision. `awaiting_formal_return` (assigned), `hold_assistance_in_progress`. Lifecycle open (`application_not_open`), no outcome (`outcome_already_recorded`), no active mark (`protection_mark_active`) | **Always recorded** (`core_withdrawals`) with an assessment (`withdrawal.ts:39-63`): refused `filing_possibly_occurred`; refused after evidenced filing (`withdrawal_cutoff_passed`); refused `withdrawal_cutoff_undeclared` (submitted, no supported cut-off; every preparation-only service); refused `declared_cutoff_passed`; else accepted. A draft is always accepted. TA notice `withdrawal_decision` (no acknowledgement). Accepted: outcome `withdrawn`; the lifecycle stays; open price increase superseded; dependents evaluated; operator notice. Nothing reverses it | `{applicationId, withdrawalId, result, code?}` |
| `core.record_applicant_withdrawal` (`operator.record_applicant_withdrawal`; the assigned operator only, not a SuperAdmin) | `applicationId`, `note` (≤ 2000), `evidenceRef` (≤ 120); `_rev.application` | A blank `evidenceRef` → `validation_failed/input_invalid`, field `evidence`, `too_small` (the binding makes the reference one `external_reference`, `bindings/core.ts:437-440`, so `withdrawal_evidence_missing` is not reachable through the API). Revision. Then the three eligibility guards above; no editor-state guard | As above, requester `applicant_via_operator`, evidence kept | as above |
| `core.record_operational_withdrawal` (`withdrawal.record_operational`; SuperAdmin) | `applicationId`, `evidenceRef`, `reason` (10–1000); `_rev.application` | As the applicant path (blank reference → field `evidence`), reason 10–1000 | As above, requester `superadmin_operational`, reason kept | as above |
| `core.propose_deferral` (`operator.propose_deferral`; assigned operator) | `applicationId`, `justification` (20–2000), `proposedReviewOn` (date); `_rev.application` | Revision. `application_not_submitted`. `outcome_already_recorded`. An act `authorized` or `filing_unknown` → `filing_possibly_occurred`. Review date after today (IST) → field `proposedReviewOn`, `not_after_today`. An open deferral (proposed or approved) → `conflict_duplicate/deferral_active` | Deferral `proposed`; application revision +1; fact. Pending owner SuperAdmin (`deferral_proposed`, `review_deferral`) | `{applicationId, deferralId}` |
| `core.decide_deferral` (`deferral.decide`; SuperAdmin) | `deferralId`, `decision` ∈ {`approve`, `decline`, `extend`}, `reviewOn` (optional date), `reason` (10–1000); **no revision** | Unknown deferral → `not_found_or_forbidden`. `approve`, `decline` need state `proposed`; `extend` needs `approved`; otherwise `stale_revision`. Review date (the given one, else the proposed one) after today → field `reviewOn`. **No check of the application's lifecycle or outcome** (STOP-W17-06) | Decline: `declined`, no notice, no application revision change. Approve or extend: `approved` with `review_on`; TA notice `deferral` (`params.reviewOn`, no acknowledgement); task `core.deferral_review_due` at 00:00 IST of the review date, which notifies the assigned operator and the approving SuperAdmin (not the TA); while approved, readiness, authorization and packet release are blocked `deferral_active` (`controls.ts:435-458`; the module comment names only the last two); pending owner the assigned operator (`deferral_active`) while no outcome exists. An outcome, a completion or a group end never ends a deferral | `{applicationId, deferralId}` (the decision is not in it) |
| `core.end_deferral` (`deferral.end`; policy: assigned operator or SuperAdmin; route: operator only) | `deferralId`, `note` (1–1000); no revision | Unknown → `not_found_or_forbidden`. State `approved` else `stale_revision`. No lifecycle or outcome guard | `ended`; TA notice `generic_case_update` event `deferral_ended` | `{applicationId, deferralId}` |
| `core.record_forecast` (`forecast.record`; assigned operator or SuperAdmin) | `applicationId`, `windowStart`, `windowEnd`, `basisCode` ∈ {`operator_judgement`, `authority_notice`, `external_delay`}, `note` (≤ 500); no revision | `application_not_submitted`; `outcome_already_recorded`; end before start, or start before the submission date → `forecast_window_invalid` (field `windowStart`) | A new current forecast (the earlier one stays, not current); the submission's original window never changes; task `core.timing_risk_check`: a TA notice `timing_risk` (acknowledgement required) once per window and dates revision when the forecast threatens travel; a notice when the expected window elapses without an outcome | `{applicationId, forecastId}` |
| `core.propose_price_increase` (`price.propose_increase`; SuperAdmin) | `applicationId`, `cause` (`text(40)`), `newPricePaise` (digits), `reason` (10–1000); `_rev.application`. The module also takes `correctionId` and `evidence`, which the contract does not carry | Revision. `application_not_submitted`. `outcome_already_recorded`. Cause `material_scope_change` needs an applied correction (`correctionId`, unreachable through the contract, STOP-W17-07). An open increase → `conflict_duplicate/price_increase_open`. Not higher than the price in effect → field `newPricePaise`, `not_higher` | Price record `increase_proposed`, state `open`; the price in effect does not change; TA notice `price_change` (acknowledgement required); fact with actor and reason. Pending: unassigned → the TA (`price_decision_pending`); assigned → the operator returns it first (`price_decision_awaits_return`). An open mistaken-price increase blocks nothing on the filing path | `{applicationId}` only |
| `core.decide_price_increase` (`application.decide_price_increase`; owning TA) | `applicationId`, `priceRecordId`, `decision` ∈ {`accept`, `decline`}; `_rev.application` | A record of another application → `not_found_or_forbidden`. Revision. `outcome_already_recorded`. `application_not_open`. `withdrawal_accepted`. Assigned or assisted → `awaiting_formal_return`. Record not `increase_proposed`/`open` → `stale_revision` | Accept: the price in effect becomes the proposed amount. Decline: the price in effect stays (a reduction recorded meanwhile stays in effect). Settles after every earlier record (`submission-price.test.ts:168-192`). No notice | `{applicationId, priceRecordId}` (the decision is not in it) |
| `core.apply_held_correction` (TA: `application.edit_draft`; the staff kinds have no route, STOP-W11-03) | `applicationId`, `correctionId` (path); `_rev.application` | Another application's correction → `not_found_or_forbidden`. Revision. State `released_for_reapply` else `stale_revision`. Kind of the correction must match the role (TA: the TA's own kinds). Controls of `correct_application`. Assigned → `awaiting_formal_return`; assisted → `hold_assistance_in_progress`. Values changed since → `stale_revision/held_correction_conflict`. Same-person evidence. Still held (a possible filing again) → `filing_possibly_occurred` | New information version; correction `reapplied`; identity documents decided again when an identity field changed | `{applicationId, correctionId}` |

Reads (all authoritative):

| Read | Facts WP-17 uses | Limits |
|---|---|---|
| `core.ta_group` | `group` (label, country, dates, `state`, `closed_kind`, `revision`); `applications[]` (list entries with lifecycle, outcome, pending); `closure` (`openIncidents`, `activeAttempts`) | 200 applications (newest first), no `more` flag, no open-application count (STOP-W17-03) |
| `core.ta_groups` | per group row `open_count` (applications in `draft` or `submitted`: exactly Core's closure condition) and `total_count` (`lists.ts:25-34`) | 200 groups (ordered by state, start date); a group beyond the cap has no row |
| `core.ta_application` | `prices[]` (`price_record_id`, `seq_no`, `kind`, `cause`, `state`, `amount_paise`, `effective_price_paise`, `previous_price_paise`); `currentPricePaise`; `submission.quoted_price_paise`; `timing` (`estimate`, `forecast`: windows only, no basis); `withdrawal` (latest `state`, `reason_code`); `withdrawalPreview` (`result`, `code`: Core's assessment now); `released[]` (`correction_id`, `fields` names only; only the TA's own kinds); `pending`; `editor_state` | No deferral object (only the pending reason); no forecast basis (STOP-W17-09); no held values (STOP-W17-04) |
| `core.ops_case` / `core.admin_case` | `deferral` (`deferral_id`, `state`, `justification`, `proposed_review_on`, `review_on`); `timing`; `price` (`effectivePricePaise`, `openIncrease`); `travelRecheck` (`answer`, `codes`, `retryAt`); `acts`; `viewerAssigned`; `pending` | No proposer, approver or decision reason of the deferral; no price records list on staff reads |
| `core.ops_work` | `reviewsDue[]` (`applicationId`, `applicantName`, `reviewOn`) | 200 |
| `core.admin_queue {deferrals}` | list entries of applications with a proposed or approved deferral | 200; no deferral fact on a row (STOP-W17-10) |
| `core.admin_group` | `group`, `today`, `clockHealthy`, `items[]` (`applicationId`, `applicantName`, `eligible`, `reasons[]`) for every application of the group; a completed or ended one carries `application_not_open` | 500 (by id); no lifecycle on the item |

### 1.3 Page list

"Kept" = existing path (LD-03). "New" = new GET route and inventory entry; route ids of new routes are proposals.
"opt." = read through `optionalView` (LD-14).

| ID | Page | Path | Status | Reads |
|---|---|---|---|---|
| TA-05 | Group (WP-03 page) | `/ta/groups/:groupId` | Amended: "Closing the group" holds the rule, Core's facts and the link to TA-05c; group-end row words | `core.ta_group`; opt. `dlv.delivery_facts` (as WP-03) |
| TA-05c | Close the group | `/ta/groups/:groupId/close` (GET beside POST T08) | **New** (`ta.groups.close_form`, action `group.close`, edge only) | `core.ta_group`; opt. `core.ta_groups` (this group's `open_count`, `total_count`) |
| TA-13b | Change the travel dates (WP-03 page) | `/ta/groups/:groupId/travel-dates` | Amended: effect text; `min` on the dates | `core.ta_group` |
| TA-07 | Application (WP-03 page) | `/ta/applications/:applicationId` | Amended: status rows, action panel rows, "Price and timing", "Waiting for your decision", aside "Withdraw this application"; the carried forms leave | as WP-03 |
| TA-07d | Decide on the price change | `/ta/applications/:applicationId/price-decision` (GET beside POST T35) | **New** (`ta.applications.price_form`, action `application.read`; edge, and staff in a support view, as WP-03 TA-08 and WP-13 TA-07t) | `core.ta_application` |
| TA-07w | Withdraw this application | `/ta/applications/:applicationId/withdraw` (GET beside POST T34) | **New** (`ta.applications.withdraw_form`, `application.read`; edge and support view) | `core.ta_application` |
| TA-07c | Apply a held correction | `/ta/applications/:applicationId/corrections/:correctionId/reapply` (GET beside POST T48) | **New** (`ta.applications.reapply_form`, `application.read`; edge and support view) | `core.ta_application` |
| OP-02 | Application workspace (WP-07 page) | `/ops/applications/:applicationId?tab=work` | Amended (AM-W17-02): Work tab sections "Travel-date recheck" (in-place form), "Timing", "Deferral", "Ending the case" become facts and links | as WP-07 |
| OP-02f | Record a forecast | `/ops/applications/:applicationId/forecast` (GET beside POST O42) | **New** (`ops.applications.forecast_form`, action `forecast.record`) | `core.ops_case` |
| OP-02d | Propose a deferral | `/ops/applications/:applicationId/deferral` (GET beside POST O24) | **New** (`ops.applications.deferral_form`, `operator.propose_deferral`) | `core.ops_case` |
| OP-02e | End the deferral | `/ops/applications/:applicationId/deferrals/:deferralId/end` (GET beside POST O43) | **New** (`ops.applications.end_deferral_form`, `deferral.end`) | `core.ops_case` |
| OP-02w | Record the applicant's withdrawal request | `/ops/applications/:applicationId/applicant-withdrawal` (GET beside POST O23) | **New** (`ops.applications.applicant_withdrawal_form`, `operator.record_applicant_withdrawal`) | `core.ops_case`; opt. `ops.case_work` (act states, as WP-07) |
| SA-09d | Decide the proposed deferral; extend the deferral | `/admin/applications/:applicationId/decide/deferral_approve`, `…/deferral_decline`, `…/deferral_extend` | Kinds added to WP-06 route `admin.decisions.application` (subjectless, D-W17-03) | `core.admin_case` |
| SA-09p | Propose a price increase | `…/decide/price_increase` | Kind added | `core.admin_case`; opt. `pay.application_payments` (service payment row) |
| SA-09w | Record an operational withdrawal request | `…/decide/operational_withdrawal` | Kind added | `core.admin_case`; opt. `ops.case_work` |
| SA-04a | Application (WP-11 page) | `/admin/applications/:applicationId` | Amended (AM-W17-03): Overview sections "Deferral", "Travel-date recheck" (in-place admin form), "Ending the case"; Decisions list rows; action panel rows 6, 8 | as WP-11 |
| SA-02d | Deferrals (WP-06 page) | `/admin/queues/deferrals` | Amended (AM-W17-01): row action targets | `core.admin_queue {deferrals}` |
| SA-04g | Group (WP-11 phase 2 page; today D30) | `/admin/groups/:groupId` | Amended (AM-W17-03 d): group-end words and states | `core.admin_group` |

Each new GET route validates its ids with zod (`zWireId('grp' | 'app' | 'cor' | 'dfr')`); a parse failure is the uniform
404. TA-07c answers the uniform 404 when `correctionId` is not in `released[]` (the TA read holds no other correction);
OP-02e answers it when the path `deferralId` differs from `deferral.deferral_id`. The SA-09 route already validates
`kind` against a closed enumeration; WP-17 adds five values. No new query value exists (SH-R06).

### 1.4 Shell placement (WP-01 §2.2)

| Page | Rail destination (`current`) | Breadcrumb |
|---|---|---|
| TA-05, TA-05c, TA-13b | TA: Groups `/ta/groups` | "Groups › [group]" / "… › Close the group" / "… › Change the travel dates" |
| TA-07, TA-07d, TA-07w, TA-07c | TA: Applications (as TA-07, WP-03 origin rules, `listReturnOf`) | By origin "… › [applicant] › Price change" / "› Withdraw" / "› Held correction" |
| OP-02, OP-02f, OP-02d, OP-02e, OP-02w | Operator: My work (as WP-07 OP-03) | "My work › [applicant] › Record a forecast" (and so on) |
| SA-09d, SA-09p, SA-09w | SuperAdmin: Applications & groups (WP-11 convention) | "Applications & groups › Applications › [applicant] › [decision]" |
| SA-02d | SuperAdmin: Work queues (WP-06) | as WP-06 |
| SA-04g | Applications & groups (WP-11) | "Applications & groups › Applications › [group label]" |

Navigation counts do not change. The SuperAdmin count of `/admin/queues/deferrals` stays Core's row count (WP-06).
WP-07 F-07 keeps an approved deferral in "Waiting" until its review is due; WP-17 changes no OP-01 view rule.

### 1.5 The WP-17 commands and their pages

Field names are the current ones. `_csrf` and `_op` are on every form. "Rev" is the `_rev.<aggregate>` hidden field.

| # | Command | Route id (POST path) | Host page | Fields | Rev | Handler change |
|---|---|---|---|---|---|---|
| 1 | `core.close_group` | `ta.groups.close` (`/ta/groups/:groupId/close`) | **TA-05c** (moved from the TA-05 confirm disclosure) | — | `group` | Refusal re-renders TA-05c at the POST address (`restorePath` = TA-05c, the same path); success `receiptLocation('/ta/groups/<id>', 'closed', key)` (was `?done=closed`) |
| 2 | `core.edit_travel_dates` | `ta.groups.travel_dates` | TA-13b (WP-03; unchanged) | `travelStartDate`, `travelReturnDate` | `group` | None (WP-03) |
| 3 | `core.request_withdrawal` | `ta.applications.withdraw` (`/ta/applications/:id/withdraw`) | **TA-07w** (moved from the TA-07 aside) | `note` | `application` | Moved to `src/apps/edge/core/timing-routes.ts`; refusal re-renders TA-07w with `note`; success `receiptLocation('/ta/applications/<id>/withdraw', 'withdrawal', key)` |
| 4 | `core.decide_price_increase` | `ta.applications.price_decision` (`…/price-decision`) | **TA-07d** (moved from "Price and timing") | hidden `priceRecordId`; `decision` (radio `accept`/`decline`, none preselected; was two forms with hidden `decision`, D-W17-02) | `application` | Moved; no `slice` (LD-17); refusal re-renders TA-07d with the choice kept; success `receiptLocation('/ta/applications/<id>/price-decision', 'price', key)` |
| 5 | `core.apply_held_correction` | `ta.applications.reapply_correction` (`…/corrections/:correctionId/reapply`) | **TA-07c** (moved from "Waiting for your decision") | — | `application` | Moved; refusal re-renders TA-07c; success `receiptLocation('/ta/applications/<id>/corrections/<cor>/reapply', 'reapplied', key)` |
| 6 | `core.record_forecast` | `ops.applications.forecast` (`/ops/applications/:id/forecast`) | **OP-02f** (moved from the Work tab disclosure) | `windowStart`, `windowEnd`, `basisCode` (radio, none preselected), `note` | — (Core takes none) | Moved to `src/apps/staff/work/timing-routes.ts`; no `slice` on `basisCode`; refusal re-renders OP-02f with every value; success `receiptLocation('/ops/applications/<id>/forecast', 'forecast', key)` |
| 7 | `core.propose_deferral` | `ops.applications.propose_deferral` (`…/deferral`) | **OP-02d** | `justification`, `proposedReviewOn` | `application` | Moved; refusal re-renders OP-02d with both values; success `receiptLocation('/ops/applications/<id>/deferral', 'deferral', key)` |
| 8 | `core.end_deferral` | `ops.applications.end_deferral` (`…/deferrals/:deferralId/end`) | **OP-02e** | `note` | — (Core checks the state) | Moved; refusal re-renders OP-02e; success `receiptLocation('/ops/applications/<id>/deferrals/<dfr>/end', 'deferral_ended', key)` |
| 9 | `core.record_applicant_withdrawal` | `ops.applications.applicant_withdrawal` (`…/applicant-withdrawal`) | **OP-02w** | `evidenceRef`, `note` | `application` | Moved; refusal re-renders OP-02w with both values; success `receiptLocation('/ops/applications/<id>/applicant-withdrawal', 'withdrawal', key)` |
| 10 | `core.recheck_travel_dates` (operator) | `ops.applications.travel_recheck` (`…/travel-recheck`) | OP-02 Work, section "Travel-date recheck" (in place) | — | — | Moved with the other OP-02 POSTs (WP-07 U2 file); refusal re-renders OP-02 Work with the refusal **outside** the section's show condition (F-W17-04); success `receiptLocation('/ops/applications/<id>?tab=work', 'recheck', key)` (the two codes `travel_rechecked`, `travel_unknown` become one code; the receipt words come from `summary.result`) |
| 11 | `core.recheck_travel_dates` (SuperAdmin) | `admin.applications.travel_recheck` | SA-04a Overview, "Travel-date recheck" (in place) | — | — | As #10 on SA-04a (`oversightAgain`, WP-11 U1 export) |
| 12 | `core.decide_deferral` | `admin.deferrals.decide` (`/admin/deferrals/:deferralId/decision`) | **SA-09d** kinds `deferral_approve`, `deferral_decline` (state `proposed`), `deferral_extend` (state `approved`) | hidden `decision` (fixed per kind), hidden `applicationId` (BFF only, D-W06-05 pattern), `reviewOn` (approve, extend; prefilled), `reason` | — (Core checks the state) | Moved to `src/apps/staff/decisions/routes.ts`; `resolve` names the application from the hidden id; the kind comes from the posted `decision` (`approve` → `deferral_approve`, …; another value → the uniform answer of today); refusal re-renders the kind with every value (today `ctx.respond`: the shell error page, F-W17-02); success `receiptLocation('/admin/applications/<id>/decide/<kind>', 'deferral', key)` |
| 13 | `core.propose_price_increase` | `admin.applications.price_increase` (`…/price-increases`) | **SA-09p** | hidden `cause` = `mistaken_price`; `newPricePaise` (Q-W17-03); `reason` | `application` | Moved; no `slice`; refusal re-renders SA-09p with both values; success `receiptLocation('/admin/applications/<id>/decide/price_increase', 'price', key)` |
| 14 | `core.record_operational_withdrawal` | `admin.applications.operational_withdrawal` | **SA-09w** | `evidenceRef`, `reason` | `application` | Moved; refusal re-renders SA-09w with both values; success `receiptLocation('/admin/applications/<id>/decide/operational_withdrawal', 'withdrawal', key)` |

Each command use has exactly one host page, so a refusal always re-renders the page it came from. The recheck has two
routes, one per surface, so each surface has one host. Every UNR answer goes to the operation page
(`/ta/operations/<key>`, `/ops/operations/<key>`, `/admin/operations/<key>`); no page offers a new submission of the same
intent while it is unresolved. UI-PLAN §12.2 also names "Acknowledge notice" for WP-17: it moved to WP-08 (TA-10n) and
WP-15 (OP-10, SA-10) (COMMAND-COVERAGE §6.1). "Request deferral" is `core.propose_deferral`.

### 1.6 Forms that leave pages, and carried forms

| Form | Leaves | Link that replaces it |
|---|---|---|
| Close the group (`groups.ts:396-400`) | TA-05 "Closing the group" | "Close the group" → TA-05c (open group, not a support view) |
| Accept, Decline the new price (`ta.ts:577-590`) | TA-07 "Price and timing" | "Decide on the price change" → TA-07d; action panel row (§2.4) |
| Apply the held correction (`ta.ts:638-651`) | TA-07 "Waiting for your decision" | "Apply the held correction" → TA-07c per released correction |
| Withdraw the application (`ta.ts:688-715`) | TA-07 aside | "Withdraw this application" → TA-07w; the "ask for a return" disclosure becomes WP-09's link to TA-07p `?purpose=withdraw` and moves to TA-07w (AM-W17-04) |
| Record a forecast; Propose a deferral; End the deferral; Record an applicant withdrawal request (`ops.ts:271-304`) | Old operator case page / OP-02 Work (WP-07 carried) | Links to OP-02f, OP-02d, OP-02e, OP-02w in the Work sections (AM-W17-02) |
| Decide on the deferral; Propose a price increase; Record an operational withdrawal (`admin.ts:286-316`) | Old SuperAdmin case page / SA-04a (WP-11 carried) | Links to SA-09d, SA-09p, SA-09w (AM-W17-03) |

Carried on WP-17 pages: none. After WP-17 no WP-17 form remains carried on any page. The carried-form tests drop their
WP-17 entries: `carried-forms-ta.test.ts` (`core.close_group`, `core.request_withdrawal`, `core.decide_price_increase`,
`core.apply_held_correction`; WP-09 already changes the report-problem count 2 → 1 with the withdraw link),
`carried-forms-wp06.test.ts` (`core.decide_deferral`), `carried-forms-wp07.test.ts` (four forecast/deferral/withdrawal
entries; the recheck stays as OP-02's own form), `carried-forms-wp11.test.ts` or `oversight-host-pages.test.ts` (WP-11's
four carried entries; the admin recheck stays as SA-04a's own form).

### 1.7 Shared components and dependencies

Reused, no new variant: WP-01 CMP-07 (`errorSummary`), CMP-08 (`operationReceipt`, `receiptLocation`, `readReceipt`,
`receiptDocumentTitle`), CMP-10 (`boundaryNotice`), CMP-12 (`freshness`), CMP-13 (operation status page), CMP-14
(`staleComparison`). WP-02 U0: CMP-25 `decisionPage`, CMP-01 `actionPanel`, `statusFacts`. WP-03 U0: CMP-11 `identityBand`
and the TA-07 frame (`listReturnOf`, `policyNotice`). WP-06 U0/U4: `admin-context.ts`, the SA-09 registry and routes.
WP-07 U0/U2: `src/apps/staff/work/reading.ts`, `frame.ts` (protected-state banner), the OP-02 Work tab. WP-09 U2: the
unsent text block. WP-11 U1: `oversightAgain`, the SA-04a frame. WP-13: `changed-terms.ts` (the TA decision page pattern,
TA-07t). Existing: `choiceGroup`, `textField`, `textareaField`, `summaryList`, `dataTable`, `identifier`, `timeAt`, `day`,
`money`, `callout`.

New modules (no new `src/web/ui/` component): `src/apps/shared/pages/timing-words.ts` (closed word tables of §2.11, both
audiences); `src/apps/shared/pages/group-close.ts` (TA-05c); `src/apps/shared/pages/application-decisions.ts` (TA-07d,
TA-07w, TA-07c); `src/apps/edge/core/timing-routes.ts`; `src/apps/staff/work/timing.ts` and `timing-routes.ts` (OP-02f,
OP-02d, OP-02e, OP-02w); `src/apps/staff/decisions/timing.ts` (SA-09d, SA-09p, SA-09w).

Dependency: WP-17 builds after WP-06 (U0, U2, U4), WP-07 (U0, U2), WP-09 (U1, U2), WP-11 (U1; phase 2 U7 for SA-04g, or
today's page) and WP-13 (TA-07t, `changed-terms.ts`) are integrated (PLAN §3 order). WP-17 MUST NOT build a second
decision frame, banner, word table for an existing set, or unsent text block.

### 1.8 Amendments to designed packages

Each binds the build of the named package if it is not built yet; otherwise the WP-17 unit named in §7.1 applies it.

| ID | Package, place | Rank | Amendment |
|---|---|---|---|
| AM-W17-01 | WP-06 §2.2.4 SA-02d; §2.1 SA-01 group 6; §2.7.5 kind table; §1.5 carried row | P1 | (a) Kind table: `deferral` (subject `dfr`) is replaced by three subjectless kinds `deferral_approve`, `deferral_decline`, `deferral_extend`; `price_increase`, `operational_withdrawal` stay. (b) SA-02d rows: column "Deferral" from the row's pending reason only ("Proposed: to decide" for `deferral_proposed`; "Approved: waits for its review" for `deferral_active`; any other code: Core's sentence, for example an application with an outcome); action "Decide" → SA-09d `deferral_approve` for `deferral_proposed`; "Open" → SA-04a `#deferral` otherwise (the row carries no deferral state, STOP-W17-10). Lead adds "A deferral holds filing and packet release only. It is not a refusal and not a completion." (c) SA-01 group 6 item links follow (b). (d) The carried `core.decide_deferral` row of §1.5 and its test entry go |
| AM-W17-02 | WP-07 §1.5 carried rows; §2.3 item 4 (banner); §2.4.1 item 6; §2.4.2 rows "Travel dates" and "Holds and open decisions"; §2.4.5 "Review point"; §2.4.6 | P1 | (a) Work tab item 6 becomes four sections of §2.7 of this design: "Travel-date recheck" (in-place form, refusal outside its show condition), "Timing" (facts; link OP-02f), "Deferral" (facts; links OP-02d or OP-02e), "Ending the case" (WP-07 §2.4.6 boundary; link OP-02w). (b) Banner item for an approved deferral: "Deferred: filing and packet release wait until [review date] IST." (`info`); for a proposed deferral: "Deferral proposed: a SuperAdmin decides." (`info`). (c) Checklist route "Go to the recheck" → `#travel-recheck`; the deferral row "Not met: deferred until [date]" with route OP-02e. (d) The carried-form test entries go |
| AM-W17-03 | WP-11 §1.6 carried rows; §2.1.2 item 5; §2.1.3 rows 6 and 8; §2.1.4 last row; §2.8 SA-04g | P1 | (a) Overview sections of §2.8 of this design replace the carried ones. (b) Action panel row 6: action "Decide the deferral" → SA-09d `deferral_approve` (secondary "Decline" → `deferral_decline`). Row 8: "Run the recheck" → `#travel-recheck`. (c) Decisions list rows: "Decide the proposed deferral" (deferral `proposed`) → SA-09d; "Extend the deferral" (`approved`) → `deferral_extend`; "Propose a price increase" (submitted, no outcome, `price.openIncrease = null`) → SA-09p; "Record an operational withdrawal request" (open, no outcome) → SA-09w. (d) SA-04g: §2.9 of this design (words, states, links) |
| AM-W17-04 | WP-09 §2.2 item 6 (TA-07 withdraw section), §1.6 row "Ask for a return to withdraw" | P2 | The link "Ask your operator for a return" → TA-07p `?purpose=withdraw` sits on TA-07w (assigned state), not on TA-07; TA-07's aside shows "Withdraw this application" → TA-07w in every open state with no outcome |
| AM-W17-05 | WP-08 TA-10 `noticeText` and TA-10n links (notice kinds of WP-17) | P2 | Kinds and words of §2.11 T7: `withdrawal_decision` (by `params.result`), `deferral` ("Filing waits until [reviewOn]"), `price_change` (by `params.cause`: proposed, superseded), `timing_risk` (by `params.condition`), `generic_case_update` events `deferral_ended`, `deferral_review_due`, `withdrawn`; each links to its page (TA-07d for an open increase, TA-07w for a withdrawal decision, TA-07 `#price` otherwise). Acknowledgement unchanged (WP-08) |

## 2. Page specifications

### 2.0 Rules common to every WP-17 page

- **Freshness (LD-08).** Every WP-17 read is authoritative. Pages show CMP-12 "Read at [time] IST". No projection, no
  lag line, no page age threshold. No page shows how long a deferral or a price change has waited.
- **Page states.** S1: pages render complete on the server. S6, S7: SH-02 pages (uniform 404 without object facts;
  neutral "TravelMudra is unavailable now"; "Nothing was sent, so nothing changed" only after a proven refusal). Each
  page lists its own S2 to S5 states.
- **Optional reads (LD-14).** Only through `optionalView`. An availability failure shows "Unavailable" in place of the
  facts of that read. Every other refusal reaches the shell. When a decision page needs an optional read to show a state
  and the read is unavailable, the form shows and Core decides, with the line "[What] cannot be read now. TravelMudra
  checks it when you record the decision." (WP-09 Q-W09-07 rule).
- **Command results.** ACC: 303 to the receipt location of §1.5; CMP-08 first in `main`; its title first in the document
  title. A receipt names a result only when `core.operation` returns the expected resource and the summary test of
  §2.13; otherwise it is neutral ("Request recorded", WP-06 D-02; S-08 pending). Recorded facts come only from the
  operation summary and from records selected by the ids it returns; every later read is labelled "Current". REJ: the
  task page re-rendered at the POST address with `restorePath` = the GET page (the same path for every WP-17 task page),
  the category's status, CMP-07 focused, every typed value and choice kept (LD-17), sentences from §2.14. When the
  refusal shows that the form no longer applies, the page shows the state that now applies and the WP-09 unsent text
  block with the typed text. C5: CMP-14 (§2.15). UNR: 303 to the operation page.
- **Access refusals.** `unauthenticated`, `not_found_or_forbidden`, `maintenance`, `support_view_active` and every access
  category reach the shell: typed values are lost and the page says nothing about the object (B10). Every other refusal
  re-renders.
- **K rules.** All fourteen uses: K-STD. A form carries one `_op` from page load; a browser resend reuses it; a re-render
  after a refusal issues a new `_op` (a refused command records nothing, B35). Core has no business duplicate guard for
  a forecast (a new key records a second forecast) and records a second withdrawal request only after a refused one
  (an accepted one ends the application): §4.1.
- **Core decides.** A page removes its form only for a state that Core's guard decides from facts the page reads (each
  state table names the guard). Every other case shows the form and Core decides. No page computes "can close", "can
  withdraw", "is late" or "is due".
- **No input truncation (LD-17).** Every handler reads every field whole. Input over a contract limit is sent unchanged
  and Core's contract refuses it at the field; the page keeps the values. Body limits are sized for the largest valid
  form, encoded (Q-W17-09).
- **Time and money.** Every date reads "[d Month yyyy]" with "(IST)" once per block; times carry "IST". Money is `money`
  with Indian grouping; every amount is a Core field; no page computes a difference, a total or an amount due (WP-16
  Q-W16-01). An estimate reads "an estimate, not a guarantee"; a forecast reads "a forecast, not a guarantee".
- **Copy.** UI-PLAN §11. Synthetic data shows "Synthetic" (CR-08). Forbidden on WP-17 pages: "Cancel" as the name of a
  withdrawal, "Undo", "Reopen", "Delete", "Expired" or "Late" for a date that passed, "Overdue" (except Core's
  "review due"), "Approved" for a price, "Refund", "Something went wrong", "Override", "Force close". "Ended with the
  group" is never called an outcome, a success or a completion of processing. All copy is draft (CR-09).
- **Support view.** TA-05c, TA-07d, TA-07w and TA-07c render in a support view with their facts and no form ("Read-only
  view: the travel agent takes this step."). Staff pages are not reachable in a support view (`/admin`) or show no form
  (`inSupportView`).
- **Read grants.** A read-grant reader on OP-02 sees the facts and no link to a WP-17 task page; a direct GET of an
  OP-02 task page shows the frame and "Only the assigned operator takes this step. You can read this application." with
  no form (`viewerAssigned = false`, WP-07 §2.0).
- **Mobile (< 768 px).** One column. Task pages put scope, facts and effect before the fields; the primary action is at
  the end of the form, never in a fixed bar (UX §7.3). Tables become labelled cards.

### 2.1 TA-05 Group: "Closing the group" and the group-end words (amended)

WP-03 §2.3 stays the specification with these changes.

1. Section "Closing the group" (`id="close"`): `h2`; the rule text (WP-03 `CLOSE_RULE`, kept); Core's two facts (WP-03
   U1-D5, kept); then, for an open group outside a support view, the link "Close the group" → TA-05c (a button-styled
   link, `secondary`, never the primary action of the page). The confirm disclosure and its `#close-errors` summary
   leave TA-05 (the refusal shows on TA-05c).
2. A line under the facts when any listed row has pending reason `group_end_pending`: "[n] of the applications listed
   wait for the travel return date. TravelMudra ends each of them with the group on the day after [return date] (IST),
   when it is unpaid and has no TravelMudra work. Until then the group cannot close." (count of listed rows by Core's
   pending reason; at the 200-row cap the line reads "At least [n] …"). No line when none.
3. Application rows (TA-06 row reading): the lifecycle `ended_with_group` reads "Ended with the group (not an outcome)";
   pending `group_end_pending` reads owner "TravelMudra" and "Ends with the group after the travel return date". The
   "Next" cell never reads "Nothing to do" for such a row.
4. Closed group (`state = closed`): `closed_kind = group_end` reads "Closed after the travel return date. Applications
   that were still open and eligible ended with the group. Nothing was deleted."; `ordinary` reads "You closed this
   group. Its history is kept." (the actor is the owning TA by Core's policy).
5. Receipt `closed` on TA-05 (§2.13).

| State (added) | Copy |
|---|---|
| Group closed, support view | The closed sentence; no link |
| Group open, support view | Rule and facts; no link |
| 200 rows listed | WP-03's line "This list shows at most 200 applications." plus "Closing the group checks every application, also those not listed." |

### 2.2 TA-05c Close the group `/ta/groups/:groupId/close`

Purpose: close a group that has no open work, with Core's conditions in view (BS B25; CC-02; Q-W17-01). Full-screen task
page.

1. Header: breadcrumb "Groups › [group]"; `h1` "Close [group label]"; freshness.
2. `h2` "What closing means": "A closed group takes no new applications, no imports and no change of travel dates.
   Nothing is deleted: every application, file and record stays readable. A closed group cannot be opened again."
3. `h2` "What TravelMudra checks when you close it": the rule as a list: "Every application in the group is completed or
   has ended." · "No import of this group is still running." · "No import issue of this group is open." Then Core's facts
   now: "Imports still running: [activeAttempts] imports" and "Open import issues: [openIncidents] issues" (units; zero
   reads "None"); and "Applications still open: [open_count] of [total_count] applications" from this group's row of
   `core.ta_groups` (Core's counts; opt.). When that row is absent (a TA with more than 200 groups) or the read is
   unavailable, the count of the listed rows by Core lifecycle: "[o] of the [n] listed applications are still open" (at
   the 200-row cap "At least [o] …"). These are facts of the page's reads, not a verdict: "TravelMudra checks again when
   you close the group."
4. When a listed row has pending `group_end_pending`: the line of §2.1 item 2.
5. Form (action the path; hidden `_rev.group`): review line (visible) "When you close it, the group is closed with your
   name and the time. You cannot undo this." Button "Close the group" (`destructive` variant; the page is the
   confirmation, DESIGN "destructive actions confirm"); "Cancel" → TA-05.

| State (first match) | Condition (`core.ta_group`) | Copy and controls |
|---|---|---|
| Closed | `state = closed` | Item 1 and the closed sentence of §2.1 item 4. Link "Back to the group". No form |
| Support view | session support view | Items 1–4; "Read-only view: the travel agent takes this step." No form |
| Open | otherwise | Items 1–5. The form shows also when the facts suggest a refusal (Core decides, Q-W03-09) |
| C2 `control_blocked` with blockers | Core refused | CMP-07 "The group was not closed" with one item per blocker code (§2.14); focus on the summary; the facts re-read; the form stays (a later retry may succeed) |
| C2 `group_closed` | closed meanwhile (another tab) | The Closed state with "This group was closed meanwhile." |
| C5 `stale_revision` | dates changed or an application was added | CMP-14 rows: Travel dates (when they differ), Applications listed ([n] then / [n] now; the page carries the count it showed as a hidden BFF-only value, D-W17-08); "Review current information" re-renders the page |
| C3 | accepted | 303 to TA-05 with receipt `closed` |

### 2.3 TA-13b Change the travel dates (amended)

WP-03 §2.4 stays the specification. Changes:

1. Effect text (`#dates-consequence`) gains two sentences: "Changing the return date also moves the day on which unpaid
   applications with no TravelMudra work end with the group (the day after the return date, IST)." and "A forecast or
   a notice about timing may follow when a new date is at risk."
2. Date fields get `min` = Core's `today` only when the read carries it (`core.ta_group` does not; `core.ta_groups`
   does): no `min` is added from the device clock (the WP-03 U1 page has none; this design adds none). Recorded P2.
3. No list of affected applications (STOP-W17-02; WP-03 D-W03-07).

### 2.4 TA-07 Application (amended)

WP-03 §2.7 and §3 stay the specification with these changes.

1. **Status facts.** "Price" row (submitted only): "Quoted at submission ₹[quote]" and "Price in effect ₹[current]" stay
   in "Price and timing" (WP-03); the status row "Price change" shows only while an increase is open: "A new price waits
   for your decision" (link TA-07d) or, when assigned, "A new price waits for your decision after your operator returns
   the application". "Withdrawal" row (WP-03 U3, only when `withdrawal ≠ null`): `accepted` → "Withdrawn. No further
   filing happens."; `refused` → "Your withdrawal request was refused: [TA sentence of `reason_code`]" (§2.11 T1).
   "Deferral" row (only when the pending reason is `deferral_proposed` or `deferral_active`): "The operator proposed to
   wait before filing. TravelMudra decides." / "Filing waits until the review date in your notice." (STOP-W17-01).
   "Group end" row (only when the pending reason is `group_end_pending`): "This application ends with the group after
   the travel return date: unpaid, with no TravelMudra work." Lifecycle `ended_with_group`: "Ended with the group (not
   an outcome)".
2. **Action panel rows** (WP-03 §3.2 item 6 becomes three explicit rows, same priority place):
   - `nextActionCode = decide_price_increase` (owner TA): step "Decide on the new price: accept it or keep the price you
     were quoted."; action "Decide on the price change" → TA-07d.
   - `reasonCode = price_decision_awaits_return`: owner "Your operator"; step "A new price waits for your decision. Your
     operator returns the application to you first."; no action (Core: `awaiting_formal_return`); secondary "Report a
     problem" stays WP-09's.
   - Formally returned with an open increase: Core's pending answer names the correction first
     (`correct_after_return`, `derived.ts:299`) although the TA may decide the price now; the WP-03 row 4 stays and its
     "Also needed" item reads "Decide on the new price" with the link to TA-07d (WP-03 U3 already lists it).
   - `nextActionCode = reapply_correction`, owner TA: step "Apply the correction you made while a filing was uncertain:
     the filing did not happen."; action "Apply the held correction" → TA-07c (the first entry of `released`).
   - `reasonCode = group_end_pending` (owner `system`): owner "TravelMudra"; step "Nothing is needed from you. This
     application ends with the group on the day after [return date] (IST)."; no action.
   - `reasonCode ∈ {deferral_proposed, deferral_active}`: owner "TravelMudra" / "Your operator"; Core's TA sentence; no
     action.
3. **"Price and timing"** (`id="price"`): rows stay (WP-03); the "Proposed new price" row reads "₹[amount] (price
   correction)" (`mistaken_price`) or "(change of scope)" (`material_scope_change`), with the link "Decide on the price
   change" → TA-07d when the TA may decide (not assigned); a superseded or decided record shows as a history line
   "Price change of [date not in read]": no line (the record has no time on the TA read); the table "Price records"
   (`details`, oldest first by `seq_no`): kind words, cause words, state words, amount, "Price in effect after it"
   (`effective_price_paise`) — every row a Core record, no arithmetic. "Current forecast" row adds, when not null, "A
   forecast is TravelMudra's current expectation. Your original estimated window stays as it was." The forecast reason
   is not shown (STOP-W17-09).
4. **"Waiting for your decision"** (`id="decisions"`, `#pending-work` kept): one line per `released` entry: "A held
   correction of [field words] can be applied now." with the link "Apply the held correction" → TA-07c. The transition
   line is WP-13's.
5. **Aside "Other actions".** "Withdraw this application" → TA-07w, shown when the application is open (`draft` or
   `submitted`) and has no outcome, outside a support view, whatever `withdrawalPreview` says (TA-07w explains).
6. Receipt codes `withdrawal`, `price`, `reapplied` leave TA-07's flash table (`ta.ts:147-148`); their receipts are on
   the task pages.

### 2.5 TA-07d Decide on the price change `/ta/applications/:applicationId/price-decision`

Purpose: the travel agent gives or refuses renewed authority for a higher price (B17; UX §4.3 "Corrections and pricing":
prior price, proposed price, reason, the actual authority choice).

1. Breadcrumb by origin; freshness; receipt (`price`).
2. `h1` "Price change: [applicant]"; meta: Application [reference], Service, Group.
3. `h2` "The change" (from the open record, the first `prices[]` row with `kind = increase_proposed`, `state = open`):
   "Price you were quoted at submission: ₹[quoted_price_paise]" · "Price in effect now: ₹[currentPricePaise]" ·
   "Proposed new price: ₹[amount_paise]" · "Why: [cause words]" (T3: "TravelMudra corrects a mistake in the published
   price." / "The scope of the application changed."). The SuperAdmin's reason is not on the TA read (it is a staff
   fact); the page says nothing more about it.
4. `h2` "Your choice", `fieldset` legend "Your decision", radio `decision`, none preselected:
   - "Accept the new price" (`accept`), hint "The price in effect becomes ₹[amount]. A payment you already made does not
     change; TravelMudra records payments separately."
   - "Keep the price you were quoted" (`decline`), hint by cause: `mistaken_price` "The price in effect stays
     ₹[currentPricePaise]. TravelMudra honours the price it communicated."; `material_scope_change` "The price in effect
     stays ₹[currentPricePaise]. The change of scope then waits; TravelMudra tells you what happens next." (Core:
     `renewed_authority_declined` pending; no promise beyond Core's sentence).
   Hidden `priceRecordId`, `_rev.application`.
5. Review (visible): "When you record your decision, TravelMudra records your choice with your name and the time. It
   cannot be changed later." (Core: a decided record is final.)
6. `h2` "What this page cannot do": "Refunds and payment adjustments are not decided here. Owner: TravelMudra."
   (UI-PLAN TA-07 unavailable row; WP-16 boundary row 4 TA variant).
7. Button "Record my decision"; "Cancel" → TA-07 `#price`.

| State (first match) | Condition (`core.ta_application`) | Copy and controls |
|---|---|---|
| Withdrawn or outcome | `outcome ≠ null` | "This application has the outcome [outcome words]. No price change waits for a decision. The price in effect stays ₹[current]." (an open record was superseded, `writers.ts:158-180`). No form |
| Nothing waits | no open increase | "No price change waits for your decision." Price records table (§2.4 item 3). Link "Back to the application". (Also the state after the receipt) |
| Support view | support view | Items 2–3; "Read-only view: the travel agent decides here." No form |
| With the operator | `editor_state ∈ {assigned, assistance_in_progress}` | Items 2–3; "This application is with your operator. They return it to you so you can decide." No form (Core: `awaiting_formal_return`) |
| Open | otherwise | Items 1–7 |
| C2 `outcome_already_recorded`, `withdrawal_accepted`, `application_not_open` | ended meanwhile | The Withdrawn state; "Your decision was not recorded." |
| C2 `awaiting_formal_return` | assigned meanwhile | The With-the-operator state; "Your decision was not recorded." |
| C2 field `decision` | none chosen (BFF, before the command) | "Choose whether to accept the new price or keep the quoted price." at the radio group |
| C5 `stale_revision` | another tab decided, or the application changed | CMP-14: "Price change" (your choice / current state of that record: open, accepted, declined, superseded); "Price in effect" (current). When the record is decided: no form and "This price change was decided meanwhile: [state words]." |
| C3 | accepted | Receipt; then the Nothing-waits state |

### 2.6 TA-07w Withdraw this application `/ta/applications/:applicationId/withdraw`

Purpose: request the withdrawal of one application, with Core's assessment before the request (B24; B18; B23; UX §10.1
"withdrawal versus possible filing").

1. Breadcrumb; freshness; receipt (`withdrawal`).
2. `h1` "Withdraw [applicant]"; meta: Application [reference], Service, Group, Stage.
3. `h2` "What withdrawing means": "TravelMudra records your request and checks it against this service's withdrawal
   rule. If it is accepted: no further filing happens; history, documents, originals and money records are kept; it
   cannot be reversed." For a submitted application: "A payment you made is not refunded by a withdrawal. Refunds are
   not decided here. Owner: TravelMudra." For an unpaid application with no TravelMudra work: "It stays in the group
   until the day after the travel return date, then ends with the group." (B25; Core keeps it open, `group_end_pending`.)
4. `h2` "TravelMudra's check now" (from `withdrawalPreview`): `accepted` → "If you request it now, TravelMudra accepts
   it."; `refused` → "If you request it now, TravelMudra refuses it: [TA sentence of `code`, T1]." The line "TravelMudra
   checks again when you send the request."
5. Form (preview `accepted` only, Q-W17-04): "Note for TravelMudra (optional)" (`note`, textarea, 3 rows, maxlength
   2000, hint "For example why the applicant withdraws. TravelMudra keeps it with the request."); hidden
   `_rev.application`. Review (visible): "When you send it, TravelMudra records the request and its check with your name
   and the time." Button "Withdraw the application" (`destructive`); "Cancel" → TA-07.

| State (first match) | Condition (`core.ta_application`) | Copy and controls |
|---|---|---|
| Withdrawn | `outcome = withdrawn` | "This application is withdrawn. No further filing happens. A withdrawal cannot be reversed." No form |
| Other outcome or closed | `outcome ≠ null` or lifecycle not open | "This application has the outcome [words] / is [stage words]. It cannot be withdrawn now." No form |
| Support view | support view | Items 2–4; "Read-only view: the travel agent takes this step." No form |
| With the operator | `editor_state = assigned` | Items 2–3; "This application is with your operator. To withdraw it, ask your operator to return it to you first." Link "Ask your operator for a return" → TA-07p `?purpose=withdraw` (WP-09). No form (Core: `awaiting_formal_return`) |
| Help in progress | `editor_state = assistance_in_progress` | Items 2–3; "An operator is entering information with your approval. You can withdraw the application when they return it to you." No form |
| Refused now | `withdrawalPreview.result = refused` | Items 2–4 with the refusal sentence and its owner line (T1: `filing_possibly_occurred` → "Owner: your operator, who checks whether the filing happened."; cut-off codes → "Owner: TravelMudra."). No form (Q-W17-04) |
| Preview unavailable | `withdrawalPreview = null` with an open application | Items 2–3 and the form; the line "TravelMudra checks the request when you send it." |
| Earlier request refused | `withdrawal.state = refused` | Above the form or state: "Your earlier request was refused: [sentence]." |
| Open | otherwise | Items 1–5 |
| C2 `awaiting_formal_return`, `hold_assistance_in_progress` | changed meanwhile | The matching state; the unsent text block with the note |
| C2 `outcome_already_recorded` | ended meanwhile | The Withdrawn or Other-outcome state; unsent text block |
| C2 `protection_mark_active` | a restore mark holds it | "Withdrawing is unavailable while TravelMudra checks this application after a system restore. Owner: TravelMudra." Unsent text block |
| C5 `stale_revision` | the application changed | CMP-14: Stage, Editing, TravelMudra's check now (current); the note kept in its field |
| C3 | accepted | Receipt (§2.13): accepted → "Application withdrawn"; refused → "Withdrawal request recorded: refused" with the reason |

### 2.7 TA-07c Apply a held correction `/ta/applications/:applicationId/corrections/:correctionId/reapply`

Purpose: apply again a correction that Core held while a filing was uncertain and released by evidence of non-filing
(B23 "hold proposed corrections separately"; B19).

1. Breadcrumb; freshness; receipt (`reapplied`).
2. `h1` "Apply a held correction: [applicant]".
3. `h2` "What happened": "You made a correction while TravelMudra could not tell whether a government filing had
   happened, so TravelMudra held it. Evidence now shows the filing did not happen, so the correction can be applied."
4. `h2` "What it changes": "Details: [field words, T6]." The values are not on this page (STOP-W17-04): "The values are
   the ones you entered when you made the correction. Your application's History shows them." (link to the TA history
   page when registered).
5. `h2` "Effect": "The details change to the corrected values. Checks of this application run again. If a changed
   detail is an identity detail, TravelMudra checks the identity documents again. Submission or the next step waits
   until the correction is applied." (Core: `held_correction_released` blocks the next act, `filing-uncertainty-holds.test.ts:143`.)
6. Form: hidden `_rev.application`; review (visible) "When you apply it, TravelMudra records it with your name and the
   time."; button "Apply the correction"; "Cancel" → TA-07.

| State (first match) | Condition | Copy and controls |
|---|---|---|
| Not released | path id not in `released` | Uniform 404 (§1.3) |
| Support view | support view | Items 2–5; read-only line. No form |
| With the operator | `editor_state ∈ {assigned, assistance_in_progress}` | Items 2–5; "This application is with your operator. They return it to you so you can apply the correction." No form (Core: `awaiting_formal_return`) |
| Open | otherwise | Items 1–6 |
| C2 `held_correction_conflict` | the details changed since the correction was made | "The details this correction changes were changed in another way since. TravelMudra did not apply it, and it cannot be applied any more. Check the application and correct it again if needed." Link "Change the application" (TA-09t) when `correct.allowed`. No form. Core keeps such a correction released and its pending answer keeps naming it (no discard exists, STOP-W17-13), so TA-07's action panel row for `reapply_correction` would point here again: the page states "This correction stays listed. It no longer stops the next step of your application." only when Core's `submit` or the pending answer no longer carries `held_correction_released`; otherwise "Clearing it is not available in this release. Owner: TravelMudra." |
| C2 `filing_possibly_occurred` | a filing became possible again | "A filing may have happened again, so the correction stays held. Nothing changed." No form |
| C2 identity evidence codes | same-person evidence fails | Core's TA sentence; link to the documents page (TA-09f) |
| C5 `stale_revision` | applied in another tab, or the application changed | "This correction was applied, or the application changed, since you opened the page." Current state; link TA-07 |
| C3 | accepted | Receipt; then 404 for this correction (it left `released`) — the receipt host is the same path, so the GET with `done` and `op` renders the receipt with the current facts and no form (D-W17-09) |

### 2.8 OP-02 Work tab sections and the operator task pages

#### 2.8.1 OP-02 Work tab, item 6 (amended WP-07 §2.4.1)

1. **"Travel-date recheck"** (`id="travel-recheck"`, shown when `travelRecheck ≠ null`): facts as today (`case.ts:323-347`:
   "not run yet" or "the rules could not answer: [codes as sentences]"; "Runs again by itself at [retryAt] IST" when
   set); "Readiness, the packet release and external acts wait until the recheck passes."; the form (in place, assigned
   operator, no fields): button "Run the recheck now". Its refusal and its receipt render at the top of the Work tab,
   never inside a section that may no longer render (F-W17-04).
2. **"Timing"** (`id="timing"`): "Original estimated window: [start] to [end] (IST), an estimate, not a guarantee";
   "Current forecast: [start] to [end] (IST), a forecast" or "No later forecast"; link "Record a forecast" → OP-02f
   (assigned, submitted, no outcome). The basis and the recorder are not on the read (STOP-W17-09).
3. **"Deferral"** (`id="deferral"`): state words (T2) and facts: proposed review date, approved review date,
   justification; links "Propose a deferral" → OP-02d (assigned, submitted, no outcome, no proposed or approved
   deferral); "End the deferral" → OP-02e (approved, **also after an outcome**: Core's end has no outcome guard, and an
   outcome never ends a deferral; today the end form hides after an outcome, `ops.ts:285`, which leaves an approved
   deferral nobody can end, STOP-W17-06). With an outcome and an approved deferral the section adds "This application
   has the outcome [words]. The deferral holds nothing now; end it so it leaves the deferral queue." The read sends no
   declined or ended deferral (`openDeferral` reads only proposed and approved), so after one the section reads "No
   deferral is open." and the propose link shows.
4. **"Ending the case"** (`id="ending"`): WP-07 §2.4.6 stays: under possible filing the boundary first and the link
   "Record the applicant's request only" → OP-02w; otherwise "Record the applicant's withdrawal request" → OP-02w. The
   cancellation control stays WP-08's.

#### 2.8.2 OP-02f Record a forecast `/ops/applications/:applicationId/forecast`

1. Frame (WP-07 OP-03 frame: identity band, banner); `h1` "Record a forecast: [applicant]".
2. `h2` "Now": original estimated window; current forecast; travel dates of the group (from `core.ops_case.group`).
3. `h2` "Effect": "The forecast is recorded beside the original estimated window, which never changes. The earlier
   forecast stays in the history. TravelMudra tells the travel agent when the forecast puts the travel dates at risk,
   and asks them to acknowledge it." (Core: `timing_risk` notice.)
4. Fields: "Expected from" (`windowStart`, date), "Expected by" (`windowEnd`, date), hint "The forecast starts on or
   after the submission date [date] (IST)." (from the case read when present; else no date); "What the forecast rests
   on" (`basisCode`, radio, none preselected: "Your judgement" `operator_judgement`, "A notice from the authority"
   `authority_notice`, "An external delay" `external_delay`); "Note (optional)" (`note`, maxlength 500).
5. Review (visible): "When you record it, the travel agent sees the new forecast as a forecast, not a guarantee."
   Button "Record the forecast"; "Cancel" → OP-02 `#timing`.

States: not assigned (read-grant reader) → WP-07 line, no form; `lifecycle ≠ submitted` or `outcome ≠ null` → "A
forecast applies only to a submitted application with no outcome." (Core guard), no form; C2
`forecast_window_invalid` at `windowStart` (§2.14); C2 `application_not_submitted`/`outcome_already_recorded` → state
and unsent values; C3 → receipt on this page and the current forecast.

#### 2.8.3 OP-02d Propose a deferral `/ops/applications/:applicationId/deferral`

1. Frame; `h1` "Propose a deferral: [applicant]".
2. `h2` "What a deferral does": "An approved deferral holds readiness, filing authorization and the packet release
   until you end it. Reconciliation, results and delivery go on. It is not a refusal and not a completion. A SuperAdmin
   decides; the travel agent is told the review date when it is approved. On the review date you and the approving
   SuperAdmin are reminded; nothing ends by itself." (Core: `controls.ts:435-458`; `tasks.ts:296-330`.)
3. Facts: Stage; External acts (none / states); Current forecast; latest deferral (state words) when one exists.
4. Fields: "Why the application should wait" (`justification`, textarea, 4 rows, maxlength 2000, hint "At least 20
   characters. The SuperAdmin reads it; the travel agent does not."); "Proposed review date" (`proposedReviewOn`, date,
   hint "A date after today (IST). On that date you are reminded to review the deferral.").
5. Review (visible); button "Propose the deferral"; "Cancel" → OP-02 `#deferral`.

| State (first match) | Condition (`core.ops_case`) | Copy and controls |
|---|---|---|
| Not assigned | `viewerAssigned = false` | WP-07 read-only line; no form |
| Not open for a deferral | `lifecycle ≠ submitted` or `outcome ≠ null` | "A deferral applies only to a submitted application with no outcome." No form |
| Possible filing | an act `authorized` or `filing_unknown` | CMP-10 "Proposing a deferral is unavailable while a filing may have happened. Owner: you (reconcile the act). [Link to the act page]" No form (Core: `filing_possibly_occurred`) |
| Open deferral | `deferral.state ∈ {proposed, approved}` | "A deferral is already [proposed / approved until [date]]." Link OP-02e when approved. No form (Core: `deferral_active`) |
| Open | otherwise | Items 1–5 |
| C2 field `proposedReviewOn` `not_after_today` | — | "Choose a date after today (IST)." |
| C2 `deferral_active`, `filing_possibly_occurred`, `outcome_already_recorded`, `application_not_submitted` | changed meanwhile | The matching state; unsent text block (justification and date) |
| C5 `stale_revision` | the application changed | CMP-14: Stage, External acts, Deferral (current); values kept |
| C3 | accepted | Receipt "Deferral proposed"; Current "Deferral: proposed; a SuperAdmin decides" |

#### 2.8.4 OP-02e End the deferral `/ops/applications/:applicationId/deferrals/:deferralId/end`

1. Frame; `h1` "End the deferral: [applicant]".
2. Facts: "Approved; review on [review_on] (IST)"; justification; "Review date reached" when today ≥ review date (the
   page reads Core's `reviewsDue` only through OP-01; here it compares nothing: the line shows only when `core.ops_work`
   lists this application, opt.; otherwise no line).
3. `h2` "Effect": "Readiness, filing authorization and the packet release no longer wait for this deferral. Every other
   check still applies. The travel agent is told that the deferral ended." With an outcome: "The application has the
   outcome [words]; ending the deferral removes it from the deferral queue and changes nothing else."
4. Field "Why it ends now" (`note`, textarea, 3 rows, maxlength 1000, required); review; button "End the deferral";
   "Cancel" → OP-02 `#deferral`.

States: not assigned → no form; no open deferral, or the path id differs → uniform 404 (§1.3); `deferral.state =
proposed` → "This deferral is proposed and waits for a SuperAdmin. It cannot be ended; the SuperAdmin approves or
declines it." No form (Core: `stale_revision`); C2 `stale_revision` (ended or declined meanwhile) → "This deferral was
[state words] since you opened the page. Nothing was recorded." and the unsent text block; C2 field `note` (`too_small`)
→ "Give a reason."; C3 → receipt "Deferral ended" (neutral, §2.13) with the current state.

#### 2.8.5 OP-02w Record the applicant's withdrawal request `/ops/applications/:applicationId/applicant-withdrawal`

1. Frame; `h1` "Record the applicant's withdrawal request: [applicant]".
2. Protected state first (WP-07 §2.4.6): when an act is `authorized`, `filing_unknown` or `reconciliation_exhausted`,
   CMP-10 "Ordinary withdrawal is unavailable: a filing may have happened. Owner: you (reconcile the act). [Link]" and
   the line "TravelMudra records the request and refuses it as a withdrawal while a filing may have happened."; the
   `h1` reads "Record the applicant's request only".
3. `h2` "What happens": "TravelMudra records the applicant's request with your evidence and checks it against this
   service's withdrawal rule, accepted or refused. If it is accepted: no further filing happens; history, originals,
   money records and open duties stay; it cannot be reversed. The travel agent is told the result."
4. Fields: "Reference of the applicant's request" (`evidenceRef`, maxlength 120, required, hint "For example the
   reference of the letter or message from the applicant."); "Note (optional)" (`note`, maxlength 2000).
5. Review (visible); button "Record the request" (`destructive` when not protected; `secondary` under protection);
   "Cancel" → OP-02 `#ending`.

States: not assigned (also a SuperAdmin: Core's policy names only the assigned operator) → no form; outcome or not open
→ state sentence, no form (Core guard); C2 field `evidence` (`too_small`, a blank reference) mapped to `evidenceRef`
("Enter the reference of the applicant's own request: a letter, a message or a form."); C2 `outcome_already_recorded` →
state and unsent values; C2 `protection_mark_active` → CMP-10 with owner SuperAdmin; C5 → CMP-14 (Stage, External acts)
with values kept; C3 → receipt by `result` (§2.13).

### 2.9 SA-04a sections and SA-04g (amended WP-11)

1. **SA-04a Overview "Deferral"** (`id="deferral"`, when `deferral ≠ null`): state words; proposed review date;
   approved review date; justification; links by state: `proposed` → "Decide the deferral" (SA-09d `deferral_approve`)
   and "Decline" (`deferral_decline`); `approved` → "Extend the deferral" (`deferral_extend`); the line for an approved
   deferral "The assigned operator ends it." When `outcome ≠ null` and the deferral is open: the line "This application
   has the outcome [words]. A deferral holds nothing now." (STOP-W17-06).
2. **SA-04a "Travel-date recheck"** (`id="travel-recheck"`, when `travelRecheck ≠ null`): as §2.8.1 item 1, with the
   admin form (SuperAdmin; also while no operator is assigned); refusal and receipt at the top of the Overview tab.
3. **SA-04a "Ending the case"**: WP-11's boundary pattern; link "Record an operational withdrawal request" (or "Record
   the operational request only" under possible filing) → SA-09w. The unresolved-outcome link stays WP-11's.
4. **SA-04a Application & documents "Price and timing"**: facts as WP-11 (price in effect, open increase "Waiting for
   the travel agent's decision" or "Waiting: the operator returns the application first"); link "Propose a price
   increase" → SA-09p (submitted, no outcome, no open increase).
5. **SA-04g Group** (`/admin/groups/:groupId`; WP-11 phase 2, or today's `groupPage`, `admin.ts:388-408`): header facts
   (travel dates, state words of §2.1 item 4, reference, "Today (IST)", clock check as today); lead "After the travel
   return date, TravelMudra ends each open application that is unpaid, has no TravelMudra work and no open duty. It
   never ends one with an external act, a held original, a pending email or outstanding money. Nothing is deleted.";
   table "Group end status" (500 rows; a line at the cap "This list shows 500 applications. More may exist."): Applicant
   (link SA-04a); "Ends with the group" ("Yes, after [return date]" when `eligible`; "No"); "Why not" (one line per
   reason code in the closed staff words of T5, never Core's generic sentence; `money_outstanding` reads AM-W16-05's
   sentence); a completed or ended application is listed with the one reason `application_not_open` ("No longer open:
   completed or ended"; the read carries no lifecycle, so the page does not say which). The clock line when
   `clockHealthy = false`: "The clock disagrees with the database: TravelMudra ends nothing until it agrees." (today's
   text, kept).

### 2.10 SA-09 decision kinds of WP-17

Every kind renders through CMP-25 `decisionPage` (Scope → Evidence → Effect → Hard stops → Your decision → Review →
buttons) on WP-06's route; the registry entries name the reads, states, form, receipt and stale rows below.

#### 2.10.1 SA-09d `deferral_approve`, `deferral_decline`, `deferral_extend`

Reads: `core.admin_case` (`deferral`, `acts`, `outcome`, `lifecycle`, `timing`, `pending`).

1. `h1` "Decide the proposed deferral: [applicant]" (approve, decline: one heading, two kinds; the kind names the button)
   / "Extend the deferral: [applicant]".
2. Scope: "Application [reference] · Service · Travel agent · Operator. Deferral [reference], proposed by the assigned
   operator." (The proposer's name is not on the read.)
3. Evidence: Justification (the operator's text, verbatim); Proposed review date; approved review date (extend);
   Stage; Outcome ("Outcome not recorded"); External acts; Current forecast.
4. Effect:
   - Approve: "This allows: the application waits; readiness, filing authorization and the packet release are held
     until the operator ends the deferral. On the review date the operator and you are reminded; nothing ends by itself.
     The travel agent is told the review date. It does not: refuse, complete or withdraw the application; stop
     reconciliation, results or delivery; change the price or the original estimated window."
   - Decline: "The deferral does not start. Work goes on as before. The travel agent is not told (Core posts no notice
     for a decline)."
   - Extend: "The review date moves to the date you choose. The travel agent is told the new date. The hold goes on."
5. Hard stops: "A deferral passes no gate, cut-off or validation. It cannot hold an act already authorized or filed."
6. Your decision: approve and extend: "Review date" (`reviewOn`, date, prefilled with the proposed date / the current
   review date, hint "A date after today (IST)."); all three: "Reason for your decision" (`reason`, textarea, 3 rows,
   maxlength 1000, hint "At least 10 characters. Recorded with the decision and shown in the audit history."). Hidden
   `decision` (`approve` / `decline` / `extend`), `applicationId` (BFF only).
7. Review (visible): "When you record it: [approve: the deferral starts and holds filing until it ends, the travel agent
   is told the review date / decline: the deferral does not start / extend: the review date becomes the date you chose];
   your name, the reason and the time are recorded."
8. Buttons "Approve the deferral" / "Decline the deferral" / "Extend the deferral" (primary); "Cancel" → SA-04a
   `#deferral`.

| State (first match) | Condition | Copy and controls |
|---|---|---|
| No deferral | `deferral = null` | "No deferral is proposed or approved for this application." Link SA-04a. No form |
| Wrong state for the kind | approve/decline with `state ≠ proposed`; extend with `state ≠ approved` | "This deferral is [state words]." Links to the kind that applies (extend for approved). No form (Core: `stale_revision`) |
| Outcome recorded | `outcome ≠ null` | Warning above the fields (not a block, Q-W17-05): "This application has the outcome [words]. A deferral holds nothing now, but approving it still tells the travel agent a review date. Decline it unless you need the record." The form shows; Core decides |
| Open | otherwise | Items 1–8 |
| C2 field `reviewOn` `not_after_today` | — | "Choose a review date after today (IST)." |
| C2 field `reason` | — | "Give a reason of at least 10 characters (up to 1,000)." |
| C2 `stale_revision` | decided, ended or extended meanwhile (another SuperAdmin or the operator) | Not CMP-14 (Core checks the state, not a revision): "This deferral was [state words] since you opened the page. Your decision was not recorded." The state that applies now; unsent text block with the reason and date |
| C3 | accepted | Receipt (§2.13); then the Wrong-state state of the kind |

#### 2.10.2 SA-09p `price_increase`

Reads: `core.admin_case` (`price`, `lifecycle`, `outcome`, `editor_state`, `assigned` facts); opt. `pay.application_payments`
(service payment).

1. `h1` "Propose a price increase: [applicant]".
2. Scope: "Application [reference] · Service · Travel agent. Cause: a mistake in the published price." (The form posts
   `cause = mistaken_price`; the change-of-scope cause is not reachable, STOP-W17-07.)
3. Evidence: Price in effect ₹[effectivePricePaise] ("[n] paise"); open increase (none / the record reference); Service
   payment (WP-06 words, opt.); Editing ("With the operator" when assigned).
4. Effect: "The travel agent decides: accept the new price, or keep the price communicated to them. Until they decide,
   the price in effect stays ₹[current]. If they keep it, TravelMudra honours it. While an operator holds the
   application, the decision waits until the operator returns it. An open increase blocks no filing. If the application
   gets an outcome first (a withdrawal, a result), the increase lapses and the price stays." (Core: B17;
   `submission-price.test.ts:110-210`.)
5. Hard stops: "Only one increase can be open. A proposal cannot be withdrawn by a SuperAdmin: only the travel agent's
   decision or an outcome ends it. A payment already made is not adjusted; refunds are not decided (owner: product
   owner)."
6. Your decision: "New price in paise" (`newPricePaise`, `inputmode numeric`, required; hint "₹1 = 100 paise. The price in
   effect is ₹[current], which is [current] paise. Enter the full new price, not the difference." (Q-W17-03)); "Reason
   for the increase" (`reason`, 10–1000). Hidden `cause` = `mistaken_price`, `_rev.application`.
7. Review (visible): "When you record it: the travel agent is asked to accept or keep the communicated price; your name,
   the reason and the time are recorded; the travel agent sees the new price in rupees."
8. Button "Propose the new price"; "Cancel" → SA-04a.

| State (first match) | Condition | Copy and controls |
|---|---|---|
| Not submitted | `lifecycle ≠ submitted` | "A price increase applies only to a submitted application. A draft is priced when the travel agent submits it." No form |
| Outcome | `outcome ≠ null` | "This application has the outcome [words]. Its price no longer changes." No form |
| Open increase | `price.openIncrease ≠ null` | "A price increase is already open: the travel agent decides." No form (Core: `price_increase_open`) |
| Open | otherwise | Items 1–8 |
| C2 field `newPricePaise` `not_higher` | — | "The new price must be higher than the price in effect (₹[current], [current] paise)." |
| C2 field `newPricePaise` format | not digits (contract) | "Enter the price in paise as digits only, for example 400000 for ₹4,000." |
| C2 `price_increase_open`, `outcome_already_recorded`, `application_not_submitted` | changed meanwhile | The matching state; unsent text block |
| C5 `stale_revision` | — | CMP-14: Price in effect (current); Editing; values kept |
| C3 | accepted | Receipt; then the Open-increase state |

#### 2.10.3 SA-09w `operational_withdrawal`

Reads: `core.admin_case`; opt. `ops.case_work`.

1. `h1` "Record an operational withdrawal request: [applicant]" (under possible filing: "Record the operational request
   only").
2. Scope; Evidence: Stage; Outcome; External acts (states, WP-11 words); Service payment; Originals (when any).
3. Protected state first (as §2.8.5 item 2, owner the assigned operator).
4. Effect: "TravelMudra records the request with your evidence and reason, and checks it against this service's
   withdrawal rule. Accepted: no further filing happens; history, originals, money records and open duties (payment
   follow-up, incidents) stay; it cannot be reversed; the travel agent and the operator are told. Refused: nothing about
   the application changes; the travel agent is told the refusal."
5. Hard stops: "A withdrawal never overrides a possible filing or a passed cut-off. It records no refund."
6. Fields: "Evidence reference" (`evidenceRef`, maxlength 120, required, hint "The reference of the operational reason:
   a record, a decision or a message."); "Reason" (`reason`, 10–1000).
7. Review (visible); button "Record the request"; "Cancel" → SA-04a.

States: outcome or not open → state sentence, no form; C2 field `evidence` (`too_small`) at `evidenceRef` ("Enter the
reference of the operational reason."); C2
`protection_mark_active` → CMP-10 "… until a SuperAdmin resolves the protection mark. [Link SA-09m]"; C2 changed
meanwhile → state and unsent values; C5 → CMP-14; C3 → receipt by `result`.

### 2.11 Closed word tables (`timing-words.ts`)

An unknown value shows "Unrecognised: [code]" (UAT-13 fallback) and never a success word.

| Table | Value | Staff words | TA words |
|---|---|---|---|
| T1 withdrawal result / code | `accepted` | "Accepted: outcome Withdrawn" | "Withdrawn. No further filing happens." |
| | `refused` + `filing_possibly_occurred` | "Refused: a filing may have happened" | "Refused: a filing may have happened, so the application stays protected until your operator checks it." |
| | `withdrawal_cutoff_passed` | "Refused: filed with evidence" | "Refused: the application was already filed with the authority." |
| | `withdrawal_cutoff_undeclared` | "Refused: the service declares no withdrawal cut-off" | "Refused: this service cannot be withdrawn after submission." |
| | `declared_cutoff_passed` | "Refused: the declared cut-off has passed" | "Refused: the service's withdrawal deadline has passed." |
| T2 deferral state | `proposed`, `approved`, `declined`, `ended` | "Proposed: a SuperAdmin decides"; "Approved: holds filing until [review_on]"; "Declined"; "Ended" | not shown (TA read has none) |
| T3 price record | kinds `quoted`, `reduction_auto`, `increase_proposed`; causes `initial`, `baseline_reduction`, `mistaken_price`, `material_scope_change`; states `effective`, `open`, `accepted`, `declined`, `superseded` | "Quoted at submission"; "Automatic reduction"; "Increase proposed"; causes "At submission", "Lower published price", "Price correction", "Change of scope"; states "In effect", "Waiting for the travel agent", "Accepted", "Kept the communicated price", "Lapsed (the application ended)" | "Quoted when you submitted"; "Lower price applied"; "New price proposed"; causes as staff; states "In effect", "Waits for your decision", "You accepted it", "You kept the quoted price", "Lapsed: the application ended" |
| T4 forecast basis | `operator_judgement`, `authority_notice`, `external_delay` | "Operator's judgement", "Notice from the authority", "External delay" | (not on the TA read, STOP-W17-09) |
| T5 group-end reason | `group_end_pending` | "The travel return date has not passed yet" | — |
| | `application_not_open` | "Completed or ended" | — |
| | `service_payment_received` | "The service payment is recorded as received" | — |
| | `operator_work_authorized` | "TravelMudra work was authorized on it" | — |
| | `filing_possibly_occurred` | "An external act was authorized for it (filed, not filed or unknown)" | — |
| | `original_held` | "A physical original is held" | — |
| | `custody_evidence_missing` | "An original's holder is uncertain" | — |
| | `delivery_pending` | "A result email is queued, sending or uncertain" | — |
| | `money_outstanding` | AM-W16-05: "Money is outstanding on this application (an open payment follow-up item, an unused reservation, a government fee paid by TravelMudra and not recovered, or a fee payment whose result is unknown)." | — |
| | `protection_mark_active` | "A protection mark from a system restore holds it" | — |
| T6 correction field | `field.<key>` and identity keys | the declaration's labels (WP-03 `humanize` today) | same |
| T7 TA notice kinds | `withdrawal_decision`, `deferral`, `price_change`, `timing_risk`, `generic_case_update` (`deferral_ended`, `deferral_review_due`, `withdrawn`) | — | "Your withdrawal request was [accepted / refused: reason]."; "Filing of [applicant] waits until [reviewOn] (IST)."; "A new price waits for your decision." / "The price change lapsed: the application ended."; "The current forecast may affect your travel dates." / "The expected window passed without a result."; "The deferral ended."; staff only; "The application was withdrawn." |
| T8 recheck result | `rechecked`, `travel_rule_unknown`, `historical_or_held` | "Rechecked against the current dates"; "The rules still cannot answer: the recheck stays pending"; "Not rechecked: a filing may have happened, so the filed facts stay as they were" | — |
| T9 group closed kind | `ordinary`, `group_end` | "Closed by the travel agent"; "Closed after the travel return date" | "You closed this group"; "Closed after the travel return date" |

### 2.12 Input parsing in the handlers (LD-17)

Every field is read whole. A BFF refusal keeps every value and sends no command.

| Field | Rule | BFF refusal (field) |
|---|---|---|
| `decision` (TA-07d) | sent as posted when non-empty (today `slice(0, 20)`, `routes.ts:91`); empty → refused | "Choose whether to accept the new price or keep the quoted price." |
| `priceRecordId` (TA-07d) | sent whole (today `slice(0, 40)`) | form-level (a forged value) |
| `note` (withdraw, applicant withdrawal) | whole; Core's contract refuses > 2000 at the field | — |
| `basisCode` (OP-02f) | whole (today `slice(0, 40)`, `ops.ts:472`); empty → refused | "Choose what the forecast rests on." |
| `windowStart`, `windowEnd`, `proposedReviewOn`, `reviewOn` | whole; empty → refused (`reviewOn` empty → left out, Core uses the proposed date, as today) (today `reviewOn.slice(0, 10)`, `admin.ts:578`) | "Enter the date." |
| `decision` (SA-09d, hidden) | whole (today `slice(0, 20)`, `admin.ts:577`); a value outside the three → form-level | form-level |
| `newPricePaise` | whole (today `slice(0, 24)`, `admin.ts:587`: a 25-digit value becomes another price); empty → refused | "Enter the new price in paise." |
| `cause` (hidden) | whole (today `slice(0, 40)`) | form-level |
| `justification`, `reason`, `evidenceRef` | whole | — |

Body limits (Q-W17-09): every reason or note form gets a body limit that admits the largest valid input in a script of
up to 3 bytes a character after URL encoding (9 bytes a character), plus the control fields: 4096 → 16 384 for SA-09d,
SA-09p, SA-09w; 8192 → 24 576 for OP-02d, OP-02w; TA-07w keeps 16 384 → 24 576. A real HTTP test per form posts the
maximum in Devanagari (WP-16 PM Q-14 class).

### 2.13 Receipt facts per command (CMP-08)

| Done | Host | Expected resource | Summary test | Establishes by | Title | Recorded facts | Current facts |
|---|---|---|---|---|---|---|---|
| `closed` | TA-05 | `group`, path id | keys exactly {`groupId`}, `groupId` = path | cannot be told from `core.create_group` | neutral "Request recorded" | Group reference | "Current: Group closed ([T9 words])" or "Current: Group open" |
| `withdrawal` | TA-07w, OP-02w, SA-09w | `application`, path id | `withdrawalId` matches `^wdr_`; `result` ∈ {`accepted`, `refused`}; `code` absent or a code | `withdrawalId` is unique to the three withdrawal commands; the host names the requester | "Application withdrawn" (`accepted`) / "Withdrawal request recorded: refused" (`refused`) | Request reference; result; reason (T1 by audience) | Outcome; Stage; "Current: payment follow-up and incidents stay" (staff) |
| `price` (TA) | TA-07d | `application`, path id | `priceRecordId` matches `^pri_` and equals the form's record | the `prices[]` row with that id is `accepted` or `declined` (a decided record is final) | "Price decision recorded" | "You accepted ₹[amount]" / "You kept the quoted price ₹[effective]" (from that row) | Price in effect |
| `price` (SuperAdmin) | SA-09p | `application`, path id | keys exactly {`applicationId`} | cannot be told from other commands with that summary | neutral | Reference | "Current: price increase open, waiting for the travel agent" (from `price.openIncrease`) |
| `reapplied` | TA-07c | `application`, path id | `correctionId` equals the path id; no `stage` key | the path id and the summary | "Held correction applied" | Correction reference; details changed (T6) | Next action (Current) |
| `forecast` | OP-02f | `application`, path id | `forecastId` matches `^fcs_` | unique key | "Forecast recorded" | Reference | "Current forecast: [window]" (it may be a later one); original window unchanged |
| `deferral` (proposed) | OP-02d | `application`, path id | `deferralId` matches `^dfr_` | the summary shape is shared with decide and end | neutral | Deferral reference | Deferral state (T2) |
| `deferral` (decided) | SA-09d | `application`, path id | `deferralId` equals the decided deferral | shared shape; the decision is not in the summary (Q-W13-08 class) | neutral "Decision recorded" | Deferral reference | Deferral state and review date (T2) |
| `deferral_ended` | OP-02e | `application`, path id | `deferralId` equals the path id | shared shape | neutral | Deferral reference | Deferral state |
| `recheck` | OP-02, SA-04a | `application`, path id | `result` ∈ T8; `retryAt` null or an ISO time | the keys `result` and `retryAt` with T8 values | "Travel-date recheck run" | Result (T8); "Runs again by itself at [retryAt] IST" | Travel dates of the group; Recheck pending (yes/no) |

No receipt shows an accepted time or a command name (P-02, P-10 b; S-08). The carried flashes go (`groups.ts:272`,
`ta.ts:147-148`, `ops.ts:49-50`, `admin.ts:49-52`, `case.ts:306-309`): no receipt fact comes from the address.

### 2.14 Refusal sentences (closed tables)

TA audience (`sentence(code, 'ta')` stays for codes not listed):

| Form | Category / code | Sentence | Where |
|---|---|---|---|
| TA-05c | `control_blocked` blockers `group_has_open_applications`, `group_intake_incidents_open`, `attempt_in_progress` | WP-03's group text for the first ("Some applications of this group are still open. Each must be completed or have ended before the group closes.") and "Import issues of this group are still open." / "An import of this group is still running." | one summary item each |
| TA-07d | `awaiting_formal_return` | "This application is with your operator. Your decision was not recorded." | form-level |
| TA-07d | `outcome_already_recorded`, `withdrawal_accepted` | "This application ended meanwhile. The price stays ₹[current]. Your decision was not recorded." | form-level |
| TA-07w | `awaiting_formal_return` | "This application went to your operator meanwhile. Ask for a return to withdraw it." | form-level |
| TA-07c | `held_correction_conflict` | §2.7 state | form-level |
| all TA | `conflict_operation_key` | "This form was already used with different content. Your values are kept: check them and send again." | form-level |

Staff audience:

| Form | Category / code | Sentence | Where |
|---|---|---|---|
| OP-02f | `forecast_window_invalid` (`windowStart`) | "The forecast must start on or after the submission date ([date]) and end on or after its start." | `windowStart` |
| OP-02d | `deferral_active` | "A deferral is already proposed or approved for this application." + state | form-level |
| OP-02d, OP-02w, SA-09w | `filing_possibly_occurred` | "A filing may have happened meanwhile: [act] is [state words]." + protected state | form-level |
| OP-02e, SA-09d | `stale_revision` | §2.8.4, §2.10.1 states | form-level |
| OP-02w, SA-09w | `validation_failed/input_invalid`, field `evidence` (`too_small`) | §2.8.5, §2.10.3 (Core's field `evidence` maps to the form's `evidenceRef`) | `evidenceRef` |
| SA-09p | `price_increase_open`, field `not_higher` | §2.10.2 | as listed |
| OP-02, SA-04a recheck | `travel_date_recheck_not_pending` | "No recheck is pending now: the current travel dates are already checked." | top of the tab |
| all | `conflict_operation_key` | as TA, staff wording | form-level |
| all | unknown code | category text + "Reference code: [code]" | form-level |

### 2.15 Stale revision (CMP-14) per form

| Form | Guard | Rows (your unsent value / current value) |
|---|---|---|
| TA-05c | `_rev.group` | Travel dates; Applications listed (count then / now) |
| TA-07d | `_rev.application` | Price change (your choice / record state now); Price in effect |
| TA-07w | `_rev.application` | Stage; Editing; TravelMudra's check now; the note in its field |
| TA-07c | `_rev.application` | Not CMP-14: the §2.7 state |
| OP-02d | `_rev.application` | Stage; External acts; Deferral; values in their fields |
| OP-02w, SA-09w | `_rev.application` | Stage; External acts; Outcome; values in their fields |
| SA-09p | `_rev.application` | Price in effect; open increase; Editing; values kept |
| SA-09d, OP-02e, OP-02f, recheck | none (Core checks the state or takes no revision) | Not CMP-14 |

"Who changed it and when" rows are absent (no read carries them), never "unknown".

## 3. Interim and switch for the pending Core facts

| Fact | Interim (now) | Switch |
|---|---|---|
| Command identity (P-10 b, S-08) | Neutral receipts for `closed`, SuperAdmin `price`, the three deferral codes | Titles "Group closed", "Price increase proposed", "Deferral proposed / approved / declined / extended / ended" |
| TA deferral review date (STOP-W17-01) | Status row without the date; the notice carries it | "Filing waits until [date] (IST)" on TA-07 |
| Forecast basis to the TA (STOP-W17-09) | Dates only | "Why: [T4 TA words]" beside the current forecast (UX §4.4) |
| Held correction values (STOP-W17-04) | Field names; History link | "[Field]: [held value]" per field on TA-07c |
| Open applications on the group read (STOP-W17-03) | Count of listed rows by lifecycle, "at least" at the cap | Core's count |
| Deferral facts on queue rows (STOP-W17-10) | Pending reason words; SA-04a link | State and review date per row |

## 4. Hostile-state analysis (prompt rule 8)

"Today" states whether the code at b2a6341 already behaves as required. "Residue" is what a failure leaves.

### 4.1 The Nth identical decision and its variants

| Form | Variant | Required behaviour | Residue | Today |
|---|---|---|---|---|
| Close | Same `_op` | Replay: the same 303 and receipt | None | Yes (flash) |
| Close | New `_op` after the close | `group_closed` → TA-05c Closed state | None | Partly (TA-05 summary) |
| Withdraw (TA) | Same `_op` | Replay; one request, one notice | None | Yes |
| Withdraw (TA) | New `_op` after an accepted request | `outcome_already_recorded` → Withdrawn state | None | Partly |
| Withdraw (TA, operator, SuperAdmin) | New `_op` after a **refused** request | Core records a second refused request and a second notice; the page shows "Your earlier request was refused" before the form, and the form shows only when Core's preview accepts (Q-W17-04), so a second identical refused request needs a hand-made post on the TA side; the staff pages state "Each request is recorded, also a refused one." | One more request record and TA notice per post | No |
| Price decision | Same `_op` | Replay | None | Yes |
| Price decision | Second tab, the other choice | `stale_revision` → the record's state now; "This price change was decided meanwhile: [state]" | None | Partly (flash) |
| Price proposal | New `_op` while one is open | `price_increase_open` → Open-increase state | None | Partly |
| Forecast | New `_op`, same values | **Core records a second forecast** (no business duplicate key); the earlier one stays in history; the timing notice is deduplicated per window and dates revision | One more forecast record | No (accepted, P2 Q-W17-08) |
| Propose deferral | New `_op` | `deferral_active` → Open-deferral state | None | Partly |
| Decide deferral | Second tab or a second SuperAdmin | First wins; the second gets `stale_revision` → state now, unsent text block | None | No (shell error page) |
| Extend | Same date twice, new `_op` | Core accepts both; the review task is deduplicated per date; a second TA `deferral` notice is deduplicated per date | None | Partly |
| End deferral | Second tab | `stale_revision` → Ended state | None | Partly |
| Apply held correction | New `_op` after applied | `stale_revision` → state; link TA-07 | None | Partly |
| Recheck | Repeated | First answer; after it passes, `travel_date_recheck_not_pending` → sentence at the top of the tab | None | Partly (refusal hidden with the section, F-W17-04) |

### 4.2 What a failure leaves on the page

| Failure | Page after it | Kept | Lost (stated) |
|---|---|---|---|
| Refused form (C1, C2, C5) | The task page at the POST address, CMP-07 focused | Every typed value and choice | — |
| The form no longer applies | The state that applies; unsent text block | The typed text, read only | The form |
| Access lost (TA suspended, reassignment, revoked grant, SuperAdmin suspended) | Sign-in or the uniform 404 | — | Typed values (B10) |
| Core unreachable before a command | SH-02 "TravelMudra is unavailable now" | — | The form |
| Answer lost | Operation page (CMP-13); "Check status" | — | No new submission offered |
| Maintenance | Status document (503) | — | The form; nothing replayed |
| Body over the limit | Today the 413 page (`server.ts:426-427`) | — | Everything: prevented by Q-W17-09 sizing |

### 4.3 The named hostile states

| Situation | Required behaviour | Today |
|---|---|---|
| **Nth identical decision** | §4.1: one effect per accepted command; a stale tab learns the state now; the forecast duplicate is Core's and is stated (Q-W17-08) | Partly |
| **A deferral decided after it ended** | `decide_deferral` needs `proposed` (approve, decline) or `approved` (extend): an ended deferral → `stale_revision`; SA-09d shows "This deferral is ended. Your decision was not recorded." with the unsent reason; the GET of an approve kind for an ended deferral shows the Wrong-state state with no form. Ending a deferral that a SuperAdmin extended meanwhile: OP-02e's `end` needs `approved` and succeeds (extend keeps `approved`); the receipt shows the current state (Ended) | No (shell error page; reason lost) |
| **A deferral decided after the application got an outcome** | Core accepts approve and extend (no outcome check, STOP-W17-06) and posts the TA a review-date notice; SA-09d shows the warning of §2.10.1 and Core decides; SA-04a states "A deferral holds nothing now"; the pending answer ignores it (`a.outcome === null` check, `derived.ts:362-364`) | No |
| **A price increase decided after the travel agent withdrew** | The accepted withdrawal supersedes the open increase and notifies the TA (`writers.ts:158-180`); TA-07d's GET shows the Withdrawn state; a stale TA-07d form posted → `outcome_already_recorded` (`case-rules.test.ts:136-142`) → "This application ended meanwhile. The price stays ₹[current]."; SA-09p for a withdrawn application shows the Outcome state; the price records table shows "Lapsed: the application ended" | Partly (409 with a generic sentence) |
| **Travel dates changed while a recheck runs** | The edit locks the group and every open application; the recheck task and the staff recheck lock the group (share) then the application, so one waits; each date change enqueues its own recheck (`dates_revision` dedupe); a staff recheck posted from a page that showed the old dates runs against the dates now, and its receipt shows "Current travel dates [..]" (no claim about the old dates); OP-02's banner shows "Travel dates changed: recheck pending" again until the new recheck answers | Partly (flash without dates) |
| **Group closed while an application is mid-filing** | Not possible: Core refuses `group_has_open_applications` while any application is `draft` or `submitted`, and a mid-filing application is `submitted`; the group-end path never ends an application with any authorization (`filing_possibly_occurred`) or a pending email; TA-05c shows Core's refusal with each condition; SA-04g lists the reasons. A TA who closes an empty group while an intake creates a draft: the close locks the group; the intake refuses `group_closed` (B25) | Yes (Core); words new |
| **Withdrawal requested while filing is possible** | TA: the application is assigned in every filing state, so Core refuses `awaiting_formal_return`; TA-07w shows the With-the-operator state and the return link (WP-09). After a formal return with an act still possible: preview `refused` `filing_possibly_occurred`; no form; owner "your operator". Operator and SuperAdmin: the boundary first, then "Record the request only"; Core records the request with a refused assessment and the receipt reads "Withdrawal request recorded: refused, a filing may have happened" — never "withdrawn" (WP-07 F-09). An accepted withdrawal racing an authorization: Core lets only one commit win (`withdrawal-dependencies.test.ts:80-102`); OP-04a then shows `withdrawal_accepted` | Partly (TA preview yes; staff copy "An accepted withdrawal stops filing" before the fact) |
| **Access revoked mid-page** | TA suspended or group of another TA: the next request goes to sign-in or the uniform 404; nothing written. Operator reassigned: `core.ops_case` refuses → uniform 404; a form posted from the old page → `not_found_or_forbidden` → shell; no earlier facts stay (LD-14). Support view ended in another tab: the TA pages answer the shell. A SuperAdmin suspended between SA-09 load and submit: sign-in | Yes |
| **200 applications in a group** | TA-05 lists 200 rows (newest first) with the cap line; TA-05c takes Core's open and total counts from `core.ta_groups` (opt.), and says "at least" only when that row is absent (STOP-W17-03); the close refusal names the condition, not a count; the group-end sweep pages by `sweepPageSize` (default 200) with bounded continuations (`completion-group-end.test.ts:158-188`); SA-04g lists up to 500 with its cap line; a travel-date change locks every open application in one command (a large group makes one longer command, no page change) | Partly (no "at least") |
| **A withdrawn unpaid draft keeps the group open** | TA withdraws the only draft and then tries to close: Core refuses `group_has_open_applications`; TA-05 already shows the row "Ends with the group after the travel return date" and the §2.1 item 2 line; TA-05c's refusal adds nothing new. On the day after the return date the sweep ends it and closes the group (`closed_kind = group_end`) | No (the row reads Core's generic sentence) |
| **A price proposal with a typing error** | "4000000" (₹40,000) for ₹4,000: Core accepts (higher); the TA sees ₹40,000 and can keep the quoted price; staff cannot withdraw the proposal (no command; STOP-W17-05 note); SA-09p's hint and review reduce the risk; the receipt shows the proposed amount in rupees | No (paise only, no rupee view) |
| **Deferral review date reached** | Core posts the operator a notice; OP-01 lists the row in Action now (WP-07 F-07); OP-02e shows the facts; ending or extending is a person's decision; no page says "overdue" | Yes (notice) |
| **Recheck pending and the dates are changed back** | A new dates revision; a new recheck; no page infers that the old dates are valid again | Yes |
| **A deferral outlives its application** | The operator proposes; the applicant's withdrawal is accepted; the deferral stays `proposed` in SA-02d (the queue has no lifecycle filter, `lists.ts:109`). SA-02d's row reads Core's sentence for the application (not "Proposed: to decide"); SA-09d shows the outcome warning; a decline closes it with no notice. An approved deferral after an outcome: OP-02 keeps "End the deferral" (§2.8.1 item 3). After completion the operator is unassigned and no staff route ends it (SuperAdmin policy exists, no route): STOP-W17-06 | No (approve allowed; end form hidden after an outcome) |
| **A travel-date edit while staff forms are open** | The edit raises every open application's revision: an open SA-09p, OP-02d, OP-02w, SA-09w or TA-07d/TA-07w form gets `stale_revision` → CMP-14 with "The group's travel dates changed" when the group dates differ; values kept | Partly |
| **A group with a paid or worked application** | It never closes while completion is the deliberate boundary (LD-04); TA-05c's refusal names the open applications; Q-W17-11 | Yes (Core); words new |
| **A released correction overtaken by a later edit** | TA-07c answers `held_correction_conflict`; the correction stays released; §2.7 state; STOP-W17-13 | No |

### 4.4 Device and environment

JavaScript off: every page works (plain forms; radios; dates as native inputs with the text fallback `YYYY-MM-DD`).
320 px and 400 % zoom: one column, no two-dimensional scroll (AC-04). Keyboard: fields and radios in reading order; the
error summary takes focus after a refusal (AC-08).

## 5. Accessibility notes specific to WP-17

- One `h1` per page; frame and task parts `h2` (AC-03).
- Radio groups (`decision`, `basisCode`) are `fieldset` with a `legend`; none preselected; after a refusal the chosen
  value is kept (AC-15). A hidden fixed `decision` (SA-09d) is not an input the reader sees; the button names the
  decision.
- State words (withdrawal, deferral, price record, group end) are text with an icon, never colour only (AC-06). Amounts
  use tabular figures with the currency in text; paise counts read "[n] paise".
- Dates use `<time datetime>` with the IST note; a date field's hint names IST.
- Destructive buttons (close, withdraw, record the request) carry the `destructive` variant and the visible effect text
  before them; no confirm dialog (the page is the confirmation).
- The unsent text block is a `<blockquote>` with a visible heading; not a live region.
- Receipts are announced politely without moving focus (AC-09).

## 6. Proof V19, group-end part, on `lane-ui`

### 6.1 What `lane-ui` holds (facts and inference)

- Installation `lane-ui` (edge http://127.0.0.1:4650, staff http://127.0.0.1:4652; config
  `~/.local/share/travelmudra-uat/configs/lane-ui.json`, source = this lane's clone). At the WP-17 proof it holds the
  integrated WP-02, WP-03 and WP-06 to WP-16 pages (package order; inference). Synthetic data only.
- Accounts: syn-ta-1; syn-operator-1 (OP1); syn-superadmin-1 (SA1), syn-superadmin-2 (SA2). Sign-in through the LD-11
  harness; codes never printed. Screenshots allowed. axe at 1440 px and 390 px. Seeded data is not changed.
- A group's travel dates must start today or later (Core), so the date-triggered end cannot happen live within the
  proof: it runs as tests with the test clock (`completion-group-end.test.ts`). Completion runs only through the
  labelled harness (LD-04). Held originals need a physical-route offering and the WP-12 flows; a queued email needs the
  WP-08 boundary: both run as tests.

### 6.2 Setup (synthetic writes, labelled as setup; Q-W17-06)

Run tag `wp17-[yyyymmddhhmm]`. syn-ta-1 creates group `wp17-[stamp]` in Synthetica (travel +30/+40 days) and an empty
group `wp17e-[stamp]`; in the first group three applications on "SYN Tourist e-visa" (₹3,500) with unique synthetic
passports: D ("Syndraft, Mira", stays a draft), U ("Synunpaid, Ravi", submitted, unpaid, unassigned), W ("Synwork, Asha",
submitted; SA1 records "Payment received" with `SYN-UTR-[stamp]`, assigns OP1; OP1 starts work, records readiness and
requests authorization of the government submission, then records the execution as uncertain). D is withdrawn by
syn-ta-1 in step V19G-3.

### 6.3 Steps and observable results

| Step | Actor, page | Action | Observable result | Where |
|---|---|---|---|---|
| V19G-1 | syn-ta-1, TA-05 of the first group | Read | "Closing the group": the rule; Core's two facts with units; link "Close the group"; no confirm form on TA-05; no "can close" verdict | L |
| V19G-2 | syn-ta-1, TA-05c | Close | 409; "The group was not closed"; "Some applications of this group are still open…"; the facts re-read; the form stays; group still open | L |
| V19G-3 | syn-ta-1, TA-07w of D | Read; withdraw with a note | Before the form: "If you request it now, TravelMudra accepts it."; the group-end sentence; receipt "Application withdrawn"; D's TA-07: Withdrawal row "Withdrawn…"; Group end row "This application ends with the group after the travel return date…"; action panel owner TravelMudra, no action | L |
| V19G-4 | syn-ta-1, TA-05 | Read | D's row "Ends with the group after the travel return date"; the line "1 of the applications listed wait for the travel return date…" | L |
| V19G-5 | syn-ta-1, TA-05c | Close again | 409 with the same condition (a withdrawn draft is still open); nothing changed | L |
| V19G-6 | SA1, SA-04g of the first group | Read | Table: D "No" — "The travel return date has not passed yet"; U "No" — the return date only; W "No" — return date, "The service payment is recorded as received", "TravelMudra work was authorized on it", "An external act was authorized for it…"; no generic sentence; the lead names the four exclusions; clock line healthy | L |
| V19G-7 | syn-ta-1, TA-05c of the empty group | Close | Receipt on TA-05 (neutral) with "Current: Group closed (You closed this group)"; TA-05 shows no close link and the closed sentence; TA-13b shows "The group is closed. Its travel dates cannot change." | L |
| V19G-8 | syn-ta-1, TA-07w of W | Read | With-the-operator state; link "Ask your operator for a return" → TA-07p `?purpose=withdraw`; no form | L |
| V19G-9 | OP1, OP-02w of W | Read; record "Record the request only" with `SYN-LETTER-[stamp]` | Boundary first; `h1` "Record the applicant's request only"; receipt "Withdrawal request recorded: refused" with "Refused: a filing may have happened"; W has no outcome; syn-ta-1's notices list the refusal | L |
| V19G-10 | Harness | Resend V19G-9's POST (same `_op`) | Same 303 and receipt; one request record | L |
| V19G-11 | Test (existing Core) | `completion-group-end.test.ts` "ends nothing on the return date…", "ends only eligible applications page by page…" (paid, worked with an authorization, held original, queued email, open follow-up excluded), "never ends an application whose group still has intake work open…", and "keeps an unpaid application without TravelMudra work open until its group ends" | Unchanged; pass | T |
| V19G-12 | Test (new system test) | A group with D (withdrawn draft) and U; the test clock passes the return date; the sweep runs | TA-05 rows "Ended with the group (not an outcome)"; the group "Closed after the travel return date…"; SA-04g lists both rows with "No longer open: completed or ended" and the closed state; TA-07 of D "Ended with the group (not an outcome)" and no price decision; an open increase on U was superseded and TA-07d shows "Lapsed: the application ended" | T |
| V19G-13 | Test | Approve a proposed deferral after an accepted operational withdrawal | Core accepts (STOP-W17-06 pinned as today's behaviour); SA-09d showed the warning; SA-04a "A deferral holds nothing now" | T |
| V19G-14 | Test | Decide a deferral after it ended | 409 `stale_revision`; SA-09d Wrong-state state with the unsent reason | T |
| V19G-15 | Test | Price decision posted after the withdrawal | 409; TA-07d "This application ended meanwhile. The price stays ₹3,500." | T |
| V-A | axe | TA-05, TA-05c, TA-13b, TA-07, TA-07d, TA-07w, TA-07c, OP-02 (Work), OP-02f, OP-02d, OP-02e, OP-02w, SA-09d (3), SA-09p, SA-09w, SA-04a, SA-04g, SA-02d | No violation at 1440 px and 390 px | L |

V19 (group-end part) passes when V19G-1 to -10 and V-A pass on `lane-ui` and V19G-11 to -15 pass as tests. With WP-16's
financial part, WP-14's disclosure part and WP-12's originals part, V19 is done. Boundaries stated, not crossed:
completion (LD-04), refunds, write-off.

## 7. Implementation breakdown

### 7.1 Work units (disjoint files)

Phase A: U0. Phase B: U1 to U5 in parallel. Phase C: U6. The architect registers gallery modules in
`scripts/dev/gallery-pages.ts` and edits `DESIGN.md` once at the end (one rule: "Group end and withdrawal: a page
states Core's assessment before the request and never calls a refused request a withdrawal; 'Ended with the group' is
not an outcome").

| Unit | Files (change or add) | Tests (add or update) | Gallery |
|---|---|---|---|
| **U0 Words** | New `src/apps/shared/pages/timing-words.ts` (T1 to T9; both audiences; `withdrawalWords`, `deferralWords`, `priceRecordWords`, `groupEndReasonWords`, `recheckWords`) | New `test/unit/web/timing-words.test.ts` (every value of `WITHDRAWAL_STATES`, the five withdrawal codes, `DEFERRAL_STATES`, `PRICE_RECORD_*`, `FORECAST_BASES`, `GROUP_CLOSED_KINDS`, the ten group-end codes and the three recheck results has words; unknown → "Unrecognised"; no forbidden word of §2.0; TA words hold no "exception", "gate", "SuperAdmin") | — |
| **U1 TA group pages** | New `src/apps/shared/pages/group-close.ts` (TA-05c); `src/apps/shared/pages/groups.ts` (TA-05 section, rows, closed words; TA-13b effect text); `src/apps/shared/core/ta-groups.ts` (GET `ta.groups.close_form`; loader `closeAgain`); `src/apps/edge/core/group-routes.ts` (close: receipt location, re-render TA-05c, `restorePath`) | New `test/unit/web/group-close.test.ts` (states in order; no verdict; "at least" at 200; refusal items per blocker; stale rows; support view without form); update `test/unit/web/groups-pages.test.ts:167-179, 248, 525-536` (close link instead of form; refusal on TA-05c) | extend `scripts/dev/gallery/groups.ts` |
| **U2 TA application pages** | New `src/apps/shared/pages/application-decisions.ts` (TA-07d, TA-07w, TA-07c); new `src/apps/edge/core/timing-routes.ts` (GET `ta.applications.price_form`, `.withdraw_form`, `.reapply_form`; POST withdraw, price_decision, reapply_correction moved from `src/apps/edge/core/routes.ts`, whole fields, receipts, re-render); `src/apps/edge/core/routes.ts` (the three routes removed); `src/apps/shared/core/ta.ts` (TA-07 status rows, action panel rows, sections, aside link, flash codes removed; support-view routes for the three GETs) | New `test/unit/web/application-decisions.test.ts` (TA-07d: radio none preselected, hidden `priceRecordId` equals the open record, cause hints, states; TA-07w: preview sentence before the form, no form when refused or assigned, return link, group-end sentence; TA-07c: field words, no values, states); update `test/unit/web/application-workspace.test.ts:388-413` (links instead of forms), `test/unit/web/carried-forms-ta.test.ts` (four entries out; report-problem count per WP-09) | `scripts/dev/gallery/application-decisions.ts` |
| **U3 Operator pages** | New `src/apps/staff/work/timing.ts` (OP-02f, OP-02d, OP-02e, OP-02w); new `src/apps/staff/work/timing-routes.ts` (GETs; POST forecast, propose_deferral, end_deferral, applicant_withdrawal moved from `src/apps/staff/core/ops.ts`, whole fields, typed values kept, receipts); `src/apps/staff/core/ops.ts` (the four routes and their sections removed); WP-07's `src/apps/staff/work/workspace.ts` and `workspace-routes.ts` (Work sections of §2.8.1; recheck refusal and receipt at the top; recheck receipt code) | New `test/unit/web/operator-timing.test.ts` (each page's states in order; boundary first under possible filing; read-grant reader without form; basis radio none preselected); update `test/unit/web/travel-recheck.test.ts` (refusal visible after the section disappears; receipt words by `result`) | `scripts/dev/gallery/operator-timing.ts` |
| **U4 SA-09 kinds** | New `src/apps/staff/decisions/timing.ts` (five renderers); `src/apps/staff/decisions/kinds.ts` (five entries); `src/apps/staff/decisions/routes.ts` (kind enumeration; POST `admin.deferrals.decide`, `admin.applications.price_increase`, `admin.applications.operational_withdrawal` moved from `src/apps/staff/core/admin.ts`, whole fields, `decision` → kind, re-render with values, receipts, body limits) | Extend `test/unit/web/decision-kinds.test.ts` (section order; review not in `<details>`; hidden `decision` per kind; outcome warning keeps the form; wrong-state states) ; new `test/unit/web/timing-decisions.test.ts` (paise hint with the current price; not-higher sentence; withdrawal receipt by result) | extend `scripts/dev/gallery/decisions.ts` |
| **U5 SuperAdmin lists and group** | WP-11's `src/apps/staff/oversight/workspace.ts` (§2.9 items 1–4; action panel rows; Decisions list rows); WP-06's `src/apps/staff/queues/pages.ts` (SA-02d, AM-W17-01 b) and `src/apps/staff/home/inbox.ts` (group 6 links); SA-04g: WP-11's `src/apps/staff/oversight/group.ts` when phase 2 is built, else `groupPage` in `src/apps/staff/core/admin.ts` (one function, coordinated with U4 by the architect: U4 edits only the route block of `admin.ts`) | Update `test/unit/web/oversight-workspace.test.ts`, `test/unit/web/work-queues.test.ts`, `test/unit/web/decision-inbox.test.ts`; new `test/unit/web/group-end-status.test.ts` (every reason code in T5 words; cap line; clock line; completed applications line) | extend `scripts/dev/gallery/oversight.ts` |
| **U6 Wiring and system tests** | `src/web/route-inventory.ts` (eight GET rows; no POST change); `src/apps/edge/instance.ts`, `src/apps/staff/instance.ts` (new modules; TA support-view GETs); `src/apps/shared/common-routes.ts` (`resultHrefOf`: no new kind) | `test/unit/web/routes.test.ts`, `test/unit/bff.test.ts`; new `test/unit/bff-timing-forms.test.ts` (each §2.12 refusal keeps values and sends no command; a 25-digit price is refused at the field, never cut; maximum Devanagari reason under each body limit; same `_op` resend answers the same 303; `stale_revision` on SA-09d shows the state and the unsent reason, not the shell page; `not_found_or_forbidden` → shell); new `test/unit/web/timing-host-pages.test.ts` (§7.2); new `test/system/group-end-view.test.ts` (V19G-12 to -15); the system tests of §7.3; carried-form tests of WP-06, WP-07, WP-11 (entries out) | — |

U0 owns `timing-words.ts`; U1 the group files; U2 the application decision files, `edge/core/routes.ts` and `ta.ts`; U3
the operator timing files, `staff/core/ops.ts` and the WP-07 workspace files; U4 the decision files and the route block
of `staff/core/admin.ts`; U5 the oversight, queue, inbox and group files (and `groupPage` in `admin.ts` only when phase 2
is not built, by the architect's assignment); U6 the wiring files. No two units edit one region of one file. Test file
names carry no package or proof identifier.

### 7.2 Host-page test

`test/unit/web/timing-host-pages.test.ts` renders TA-05 (open; closed; 200 rows), TA-05c, TA-13b, TA-07 (each state of
§2.4), TA-07d, TA-07w, TA-07c, OP-02 Work (each section state), OP-02f, OP-02d, OP-02e, OP-02w, SA-09d (3), SA-09p,
SA-09w, SA-04a and SA-04g, and asserts: (a) the only form posting to each of the fourteen POST paths of §1.5 is on its
host page; (b) no TA page holds a form posting to `/withdraw`, `/price-decision` or `/reapply` outside its task page;
(c) no page renders "withdrawn" for a refused request; (d) no TA page names "deferral" with a date it did not read; (e) no
rendered amount is a sum or difference of fixture amounts; (f) every carried-form test lists no WP-17 command.

### 7.3 Existing tests that pin current behaviour and MUST change

| Test | Pin | Change |
|---|---|---|
| `test/unit/web/carried-forms-ta.test.ts:158-171, 203-237` | Close, withdraw, price (two forms), reapply on TA-05/TA-07 with plain `?done=` | Entries out; the price `decision` assertion moves to the TA-07d test (one radio group) |
| `test/unit/web/groups-pages.test.ts:167-179, 248, 525-536` | Close form on TA-05; close refusal on TA-05 (`#close-errors`) | Link to TA-05c; refusal tests move to `group-close.test.ts` |
| `test/unit/web/application-workspace.test.ts:388-413` | Carried forms on TA-07 | Links to the task pages |
| `test/unit/web/travel-recheck.test.ts:28, 98, 144` | Ops form action and docket target `#travel-recheck` | Kept (in place); add the refusal-outside-section case |
| `test/system/core-pages.test.ts:225-250` | `#close-group` disclosure on TA-05; busy close 409 with `#close-errors` on TA-05 | GET TA-05c; 409 on TA-05c; allow `&op=` |
| `test/system/core-pages.test.ts:338-361` | Forecast and deferral posted from the ops case page; `?done=deferral` on the admin case; end form on the ops page | GET OP-02f, OP-02d, SA-09d `deferral_approve`, OP-02e; locations with `&op=` |
| `test/system/core-pages.test.ts:363-387` | Price proposal from the admin case; `#price-accept` on TA-07; `?done=price` | GET SA-09p; GET TA-07d with `decision=accept`; location TA-07d `?done=price&op=` |
| `test/system/core-pages.test.ts:389-399, 508` | `#withdraw-confirm` on TA-07; withdraw route inventory pin | GET TA-07w; inventory pin unchanged |
| `test/system/case-rules.test.ts:99, 120-142, 341` | Withdraw and price decision posted from TA-07 | Post from TA-07w, TA-07d; the late decision's 409 shows on TA-07d |
| `test/system/web-shell.test.ts:26, 313` | Delayed `core.close_group` posted from TA-05 | Post from TA-05c (same path) |
| `test/unit/web/carried-forms-wp06.test.ts`, `-wp07`, WP-11 host test | WP-17 carried entries | Entries out |
| `test/unit/web/routes.test.ts` | Inventory rows | Eight new GET rows |

Stay valid: `test/core/*` (Core), `test/unit/nav-counts.test.ts` (deferral count source unchanged),
`test/integration/identity-correction-replay.test.ts`.

## 8. Register updates (`COMMAND-COVERAGE.md`)

Proposed edits for the architect (this design does not edit the register):

| Command | Row now | Proposed row |
|---|---|---|
| `core.close_group` | TA-05 (CC-02); WP-17 | TA-05c `/ta/groups/:id/close` (GET beside T08); receipt on TA-05; WP-17 |
| `core.edit_travel_dates` | TA-13 (edit mode); TA-05; WP-17 | TA-13b (built in WP-03); WP-17 amends the effect text |
| `core.request_withdrawal` | TA-07; WP-17 | TA-07w (GET beside T34); WP-17 |
| `core.decide_price_increase` | TA-07; WP-17 | TA-07d (GET beside T35; one form, `decision` radio); WP-17 |
| `core.apply_held_correction` | TA-07 (pending-work panel); WP-17 | TA-07c (GET beside T48); staff use: no route (STOP-W11-03, P-17 item 3); WP-17 |
| `core.record_forecast` | OP-02; WP-17 | OP-02f (GET beside O42); WP-17 |
| `core.propose_deferral` | OP-02; WP-17 | OP-02d (GET beside O24); WP-17 |
| `core.end_deferral` | OP-02; WP-17 | OP-02e (GET beside O43); WP-17 |
| `core.record_applicant_withdrawal` | OP-02; WP-17 | OP-02w (GET beside O23); WP-17 |
| `core.recheck_travel_dates` | OP-02; SA-04; WP-17 | OP-02 Work and SA-04a Overview, in place (one host per surface); WP-17 |
| `core.decide_deferral` | SA-02; SA-09; WP-17 | SA-09d kinds `deferral_approve`, `deferral_decline`, `deferral_extend`; SA-02d and SA-04a link; WP-17 |
| `core.propose_price_increase` | SA-04 (decision on SA-09); WP-17 | SA-09p kind `price_increase`; WP-17 |
| `core.record_operational_withdrawal` | SA-04 (decision on SA-09); WP-17 | SA-09w kind `operational_withdrawal`; WP-17 |

Proposed §6 disposition CC-21: "The WP-17 forms leave TA-05, TA-07, OP-02 and SA-04a for task pages beside their kept
POST paths (TA-05c, TA-07d, TA-07w, TA-07c, OP-02f, OP-02d, OP-02e, OP-02w) and five SA-09 kinds; the travel-date recheck
stays in place on OP-02 and SA-04a (no fields). One host page per command use." §5.1 counts unchanged (WP-17: 13).

## 9. Findings, open questions, deviations and STOP items

Ranks follow PRI-20260930-01. P0 blocks the main path or risks irreversible harm; P1 goes to the architect under LD-12,
then to Max's end review; P2 is parked.

### 9.1 Findings worked in this design

| ID | Rank | Finding (current code) | Scenario | Design |
|---|---|---|---|---|
| F-W17-01 | P1 | LD-17: `newPricePaise.slice(0, 24)` (`admin.ts:587`), `reviewOn.slice(0, 10)`, `decision.slice(0, 20)` (`admin.ts:577-578`), `cause.slice(0, 40)`, TA `priceRecordId`/`decision` slices (`routes.ts:91`), `basisCode.slice(0, 40)` (`ops.ts:472`) | A pasted 25-digit value becomes a different 24-digit price that Core accepts and the travel agent is asked to approve | §2.12 |
| F-W17-02 | P1 | The deferral decision answers every refusal with the shell error page (`admin.ts:580`, `ctx.respond` without re-render); the case page's deferral callout is unreachable | Two SuperAdmins decide the same deferral; the second loses a 600-character reason and sees a generic error page with no deferral facts | SA-09d re-render, states and unsent text block (§2.10.1) |
| F-W17-03 | P1 | Staff forms keep no typed values after a refusal (`ops.ts:68`, `admin.ts:76`) | An operator writes a 1,500-character justification with a review date of today; Core refuses the date; the page shows an empty form | Every task page keeps every value (§2.0) |
| F-W17-04 | P1 | A staff refusal renders only inside its form's show condition (`ops.ts:271, 285, 291, 297`; `case.ts:327`; `admin.ts:299, 309`) | The recheck passes in the background; the operator presses "Run the recheck now" from the old page; Core refuses `travel_date_recheck_not_pending`; the section no longer renders, so the page shows 409 with no message | Refusals at the top of the tab or on the task page (§2.8.1) |
| F-W17-05 | P1 | The price is entered in paise with no rupee view (`admin.ts:303`) | A SuperAdmin types 400000000 meaning ₹4,00,000 paise-wise, or 4000000 for ₹4,000: the TA is asked to accept ₹40,000; staff cannot withdraw the proposal | SA-09p hint with the current price in both units; review in rupees (Q-W17-03) |
| F-W17-06 | P1 | The TA withdrawal and price decisions sit in disclosures with one sentence; the withdrawal's group-end consequence and the refund boundary are not stated (`ta.ts:577-590, 700-715`) | A TA withdraws an unpaid draft to close the group and finds the group still open; or withdraws a paid application expecting a refund | TA-07w, TA-07d (§2.5, §2.6) |
| F-W17-07 | P1 | Operator copy states "An accepted withdrawal stops filing" before the request while a filing may have happened (`ops.ts:301`; WP-07 F-W07-04) | The operator believes the request stops a filing that may already have happened | Boundary first (WP-07 §2.4.6, kept on OP-02w) |
| F-W17-08 | P1 | Receipts from address flashes (`groups.ts:272`, `ta.ts:147-148`, `ops.ts:49-50`, `admin.ts:49-52`) | A copied address with `?done=withdrawal` shows "Your withdrawal request was recorded." for an application with no request | CMP-08 (§2.13) |
| F-W17-09 | P1 | Body limits of 4096 (SA forms) and 8192 (OP forms) refuse valid reasons and notes in Devanagari with the 413 page, losing the text | A SuperAdmin writes a 900-character Hindi reason; the 413 page shows no form | Q-W17-09 sizing and HTTP tests |
| F-W17-10 | P2 | TA-05 rows of withdrawn drafts read Core's generic group-end sentence; nothing explains why the group cannot close | §4.3 "A withdrawn unpaid draft keeps the group open" | §2.1 items 2, 3 |
| F-W17-11 | P2 | SA-04g reasons are Core's generic sentences (`blockerSentences`), and `filing_possibly_occurred` reads as "a filing may have occurred" for a filed act too | A SuperAdmin reads "filing may have occurred" for an application filed with evidence | T5 words |
| F-W17-12 | P2 | The deferral queue shows only the general pending reason; no state or date (`admin.ts:183-194`) | — | AM-W17-01; STOP-W17-10 |
| F-W17-13 | P2 | The admin price form shows whenever the application is submitted with no outcome, also with an open increase (`admin.ts:299`) | The SuperAdmin fills the form and gets `price_increase_open` | SA-09p Open-increase state |
| F-W17-14 | P2 | No `restorePath` on refusals rendered at POST paths of TA-07 and the staff case pages | Back/forward restore loads a path with no GET page | Task pages share the path (§2.0) |

### 9.2 Open questions for the architect

| ID | Rank | Question | Concrete scenario | Recommendation |
|---|---|---|---|---|
| Q-W17-01 | P1 | Close the group on its own task page TA-05c (GET beside the POST), instead of WP-03's in-place confirmation on TA-05? | A TA presses "Close the group" in the disclosure, gets a refusal at the bottom of a long page, and does not see the rule or the facts next to it; a closure cannot be undone | Yes: one host page with the rule, Core's facts, the effect and the refusal together (one host page per command; DESIGN "destructive actions confirm") |
| Q-W17-02 | P1 | Three subjectless SA-09 kinds with a hidden fixed `decision` (`deferral_approve`, `deferral_decline`, `deferral_extend`) instead of WP-06's one subject kind `deferral` with a radio | Approve and decline have different effects (a TA notice, a hold) that must be stated before the button; extend applies to another state | Yes (WP-09 Q-W09-03 precedent); Core keeps one open deferral per application, so the application route finds it; the posted path carries the deferral id |
| Q-W17-03 | P1 | The price field stays `newPricePaise` in paise (field names kept), with the price in effect shown in rupees and paise and the review stating the rupee value after the 303 | F-W17-05 | Keep paise (hard constraint); a rupee field (`newPrice`, BFF conversion) would need the architect's exception to the field-name rule; record it for Max's end review |
| Q-W17-04 | P2 | TA-07w offers no form when Core's preview refuses (Core would record a refused request and notify only the TA) | A TA reads "Refused: this service cannot be withdrawn after submission" and wants a record of the request | Keep no form; the preview is Core's answer and a refused request changes nothing; the TA can ask TravelMudra for help (TA-07h) |
| Q-W17-05 | P1 | SA-09d for an application with an outcome: a warning and the form (Core accepts), not a block | A proposed deferral stays open after the TA withdrew; a SuperAdmin approves it from the queue; the TA gets a review-date notice for a withdrawn application | Warning, Core decides; STOP-W17-06 to the Core task as a defect note (decline or refuse after an outcome) |
| Q-W17-06 | P1 | Proof writes on `lane-ui` (§6.2): two groups, three applications, one payment, one assignment, one authorization and an uncertain execution, two withdrawal requests, one close | A rerun meets earlier rows; the run tag identifies them | Approve; synthetic only |
| Q-W17-07 | P2 | The operator group page `/ops/groups/:groupId` (inventory O05, no route id) is in no package | LD-02 needs every route rebuilt or retired at handover | Route to the advisor (LD-16) with the WP-07 A01 options; recommend retire (OP-02 shows the group facts the operator needs) |
| Q-W17-08 | P2 | Accept that a forecast posted twice with new keys records two forecasts (Core has no duplicate key) | An operator double-submits from two tabs | Accept; the receipt names the current forecast; a Core guard would be a behaviour proposal (not raised) |
| Q-W17-09 | P1 | Body limits sized for the largest valid input encoded (§2.12) | F-W17-09 | Yes (WP-16 PM Q-14 class; LD-17 sweep) |
| Q-W17-10 | P2 | The recheck's two done codes become one code `recheck` with words from `summary.result` | A copied address with `travel_unknown` shows a false fact | Yes |
| Q-W17-11 | P2 | TA-05 and TA-05c say nothing about completion being unavailable, although a group with a submitted application cannot close until Core records completion (LD-04 boundary) | A TA whose last application was issued and delivered presses "Close the group" again and again | Add on TA-05c, when the open count includes submitted applications: "Submitted applications complete when TravelMudra records completion. Until then the group stays open; nothing is needed from you." (no owner promise beyond the WP-08 boundary words) |

### 9.3 Deviation register

| ID | Deviation | Protocol effect |
|---|---|---|
| D-W17-01 | Eight new GET task pages beside kept POST paths; five SA-09 kinds | New routes and inventory entries; actions and fields unchanged |
| D-W17-02 | The price decision becomes one form with a `decision` radio (none preselected) instead of two forms with a hidden `decision` | Same field names and values |
| D-W17-03 | The deferral decision: three kinds with a hidden fixed `decision`; hidden BFF-only `applicationId` | Same field names; one hidden field read only by the BFF |
| D-W17-04 | Success locations carry `&op=`; the carried flashes go; the recheck codes become `recheck` | Locations change |
| D-W17-05 | The travel-date recheck stays in place on OP-02 and SA-04a (no task page) | None |
| D-W17-06 | Refusals of the deferral decision re-render SA-09d (today the shell error page) | Display |
| D-W17-07 | Body limits raised (§2.12) | Handler configuration |
| D-W17-08 | TA-05c carries the count of listed open applications as a hidden BFF-only value for its stale comparison | One hidden field read only by the BFF |
| D-W17-09 | TA-07c renders its receipt at its own path after the correction left `released` (no 404 while `done` and `op` are present and the receipt checks) | Route behaviour of one GET |
| D-W17-10 | The forecast `basisCode` becomes a radio group (was a select) | Same field name and values |

### 9.4 STOP items

| ID | Kind (DECISIONS §3) | What | Why the UI needs it | Criterion check | Without it |
|---|---|---|---|---|---|
| STOP-W17-01 | Kind 1 (P2) | On `core.ta_application`: the deferral's state and `review_on` | UX §2.2 "TA notice and review point"; TA-07 shows the review date | 1. Facts exist (`core_deferrals`). 2. Removes a client join with the notices read. 3, 4 hold | Status row without a date; the notice carries it |
| STOP-W17-02 | Kind 1 with a criterion exception (P2) | A travel-date change preview: the open applications Core would recheck and the rules that apply | UI-PLAN TA-13 "affected-work recheck" before saving | 1. Facts exist. 2. Fails (a new computation, no join removed) | No list (WP-03 D-W03-07) |
| STOP-W17-03 | Kind 1 (P2) | On `core.ta_group`: `open_count`, `total_count` (as `core.ta_groups` rows carry) and a `more` flag at 200 | TA-05 and TA-05c closure facts | 1. Facts exist. 2. Removes a client join with `core.ta_groups` and a count over a capped list | Join with `core.ta_groups` (opt.); "at least" when the row is absent |
| STOP-W17-04 | Kind 1 with a criterion exception (P1) | On `core.ta_application.released[]`: the held values per field (the TA's own values) | B16/B19 before and after; the TA must apply a correction it cannot read, and the next act waits for it | 1. Facts exist (`core_corrections.after`). 2. Unproven (no join removed); needs Max's exception, as P-05, P-13, P-18 item 2 | Field names and the History link |
| STOP-W17-05 | Kind 2 note (P2, not requested) | A SuperAdmin withdrawal of a mistaken open price proposal | §4.3 typing error | Default no | The TA keeps the quoted price |
| STOP-W17-06 | Defect note (P1) | (a) `core.decide_deferral` approves or extends a deferral of an application with an outcome and posts the TA a review-date notice; (b) an outcome, a completion or a group end never ends an open deferral; (c) `core.end_deferral` is allowed to a SuperAdmin by policy but has no staff admin route, and completion unassigns the operator, so an approved deferral of a completed application can never be ended and stays in the deferral queue and its monitor count | A withdrawn application approved as deferred; a queue row nobody can clear (plausible: a deferral and a withdrawal on one case) | — | SA-09d warning; OP-02 keeps "End the deferral" after an outcome; failing test first in the Core task; an admin end route (SA-09 kind `deferral_end`) is a surface addition the architect MAY take into the Core batch |
| STOP-W17-07 | API surface note (P2) | `core.propose_price_increase`'s contract has no `correctionId` or `evidence`, so cause `material_scope_change` (which requires an applied correction) cannot be proposed; the TA's change-of-scope words are unreachable | B17 "changed scope needs renewed authority" | — | Mistaken-price cause only (hidden) |
| STOP-W17-08 | Carried (P1, P-17 item 3) | Staff re-application of a released held correction (STOP-W11-03) | — | — | WP-11's interim |
| STOP-W17-09 | Kind 1 with a criterion exception (P1) | `basisCode` (and the recorder for staff) on `timing.forecast` of the TA and staff case reads | UX §4.4 "show original estimate, current forecast, reason" | 1. Facts exist (`core_forecasts.basis_code`). 2. Unproven; Max's exception | Dates only |
| STOP-W17-10 | Kind 1 (P2) | Deferral state and review date on `core.admin_queue {deferrals}` rows | SA-02d "Deferred review" view (UI-PLAN SA-02) | 1. Facts exist. 2. Removes a per-row round trip | Pending reason words |
| STOP-W17-11 | Kind 1 (P2; WP-16 STOP-W16-06) | Which money is outstanding on the group-end items | V19 | as WP-16 | AM-W16-05 sentence |
| STOP-W17-12 | Defect note (P2) | `core.edit_travel_dates` accepts a start date in the past (`core.create_group` refuses it) and runs no protection-mark stage although `STAGES.edit_travel_dates` names one (`controls.ts:118`, no caller) | A TA moves a trip's dates into the past by mistake; every open application goes stale and is rechecked against past dates | — | No page rule (Core decides); failing test first in the Core task |
| STOP-W17-13 | Defect note (P2) | A released correction overtaken by a later edit cannot be applied (`held_correction_conflict`) and cannot be discarded; Core's pending answer keeps naming it (`derived.ts:317-325`) and the TA read keeps listing it | The TA sees "Apply the held correction" forever; the real next step is hidden | — | TA-07c conflict state (§2.7) |
| STOP-W17-14 | Note (P2) | The acknowledgement-required `price_change` notice stays "Needs your acknowledgement" after the TA decided the price (the decision does not resolve it) | TA-10 keeps asking for an acknowledgement of a decided price change | — | TA-10 links the notice to TA-07d, which shows the decided state (AM-W17-05) |

No STOP item blocks the WP-17 main path. No P0 item is open in this design. No Kind 2 change is requested. STOP-W17-04
and STOP-W17-09 join the criterion-exception requests already with the orchestrator (P-05, P-13, P-18 item 2, P-19 item
1) when the architect sends them; STOP-W17-06 goes to the Core task as a defect with a failing test first (P1); the P2
items are parked as notes (STOP-W17-07, -12, -13, -14 to the Core task as notes).
