# WP-07 U6 notes: SA-07 finance and exposure ceiling, SA-09c ceiling increase decision

Unit U6 of WP-07. Author: the U6 engineer, 13 October 2026. Input for the architect's integration and for unit U7
(wiring). U6 commits nothing; the architect integrates. Base: lane commit bc9a353 with the uncommitted WP-06 and WP-07
files of other units. Binding inputs: `WP-07-design.md` §2.0, §2.10, §2.11, §2.12, §2.13, §3.1, §4.1, §4.3, §4.5, §7.1
(U6 row), §7.3 (`payments-views.test.ts` row); `WP-07.md` §3 and §4 (F-08, F-37 apply here); `WP-16-design.md` §1.8
(AM-W16-02), §2.9; `WP-07-acceptance.md` §2.5 (A79 to A97, A166) and §2.7; `WP-06-U4-notes.md`; `PLAN.md` LD-14, LD-17;
the unit brief (money rule: no computed difference, no "due").

## 1. Files

| File | Change |
|---|---|
| `src/apps/staff/payments/finance-pages.ts` (new) | SA-07h `financeIndexPage`, SA-07t `taExposurePage`; paths and route ids (`FINANCE_PATHS`, `FINANCE_ROUTE_IDS`); shared pieces for the task pages (ceiling now, exposure facts, open request, change state words, ceiling history table, the money boundary notices); SA-07t receipt expectations `taFinanceReceipts`. |
| `src/apps/staff/payments/ceiling-pages.ts` (new) | SA-07l and SA-07i `ceilingFormPage`, SA-09c `changeDecisionPage`, `changeDecisionReceipts`; a local decision frame on `decisionPage` (§3, D-U6-01). |
| `src/apps/staff/payments/finance-routes.ts` (new) | `financeRoutes()`: 5 GET and 4 POST routes (§2); `ceilingInput` (form read whole); `finish` (answer with the audit re-render); body limit 16,384. |
| `test/unit/web/ceiling-pages.test.ts` (new) | 26 tests. |
| `test/unit/bff-finance.test.ts` (new) | 12 tests (HTTP against a scripted Core). |
| `scripts/dev/gallery/finance.ts` (new) | `financeGalleryPages()` (20 pages) and fixtures shared with both tests. Not registered. |

No other file changed. `admin.ts` and `routes.ts` are untouched; their old copies stay until U7 removes them (§6).

## 2. Routes (`financeRoutes()`)

| Route id | Method, path | Action | Command | Resolve | Body limit |
|---|---|---|---|---|---|
| `admin.finance.index` (kept id) | GET `/admin/finance` | `financial_exception.read` | — | queue `financial_follow_up` | — |
| `admin.finance.ta` (kept id) | GET `/admin/finance/tas/:taAccountId` | `exposure.read` | — | `ta_finance` | — |
| `admin.finance.lower_form` (**new**) | GET `/admin/finance/tas/:taAccountId/ceiling/lower` | `ceiling.lower` | — | `ta_finance` | — |
| `admin.finance.lower` (kept id) | POST same path | `ceiling.lower` | `pay.lower_ceiling` | `ta_finance` | 16,384 |
| `admin.finance.increase_form` (**new**) | GET `/admin/finance/tas/:taAccountId/ceiling/increase-request` | `ceiling.increase_request` | — | `ta_finance` | — |
| `admin.finance.increase_request` (kept id) | POST same path | `ceiling.increase_request` | `pay.request_ceiling_increase` | `ta_finance` | 16,384 |
| `admin.finance.change_decision` (**new**) | GET `/admin/finance/ceiling-changes/:changeId/decide/:kind`, `kind` ∈ {`approve_increase`, `decline_increase`} | `exposure.read` | — | none (as the POSTs) | — |
| `admin.finance.increase_approve` (kept id) | POST `/admin/finance/ceiling-changes/:changeId/approve` | `ceiling.increase_approve` | `pay.approve_ceiling_increase` | none | 16,384 |
| `admin.finance.increase_decline` (kept id) | POST `/admin/finance/ceiling-changes/:changeId/decline` | `ceiling.increase_decline` | `pay.decline_ceiling_increase` | none | 16,384 |

Parameters: `zWireId('acc')`, `zWireId('cec')`, the kind enumeration; a parse failure is the uniform 404. The decision GET
reads `pay.ceiling_change`, then `pay.ta_finance`; a change that is absent from the read or is a lowering answers 404.

Posted field names are unchanged (system tests post them): `newCeiling` (rupees), `reason`, hidden `basis` (sent as
`expectedCeilingBasis`), hidden `_rev.change`. The old 4,096-byte limit is replaced by 16,384 (a 1,000-character reason
in a three-byte script percent-encodes to about 9 KB; tested).

**Inventory rows for U7** (`src/web/route-inventory.ts`, numbers to be assigned):

```ts
r('D1??', 'GET', '/admin/finance/tas/:taAccountId/ceiling/lower', 'admin', 'ceiling.lower', ['superadmin'], { id: 'admin.finance.lower_form' }),
r('D1??', 'GET', '/admin/finance/tas/:taAccountId/ceiling/increase-request', 'admin', 'ceiling.increase_request', ['superadmin'], { id: 'admin.finance.increase_form' }),
r('D1??', 'GET', '/admin/finance/ceiling-changes/:changeId/decide/:kind', 'admin', 'exposure.read', ['superadmin'], { id: 'admin.finance.change_decision' }),
```

Answers. Accepted: 303 to `receiptLocation(host, code, key)`: `lowered` and `requested` on SA-07t; `approved` on SA-09c
`approve_increase`; `declined` on SA-09c `decline_increase` (D-W07-08). Refused: the host page again at the POST address
under the category's status, `restorePath` = the GET page, every typed value, a new `_op`. `unavailable_dependency`
with code `audit_degraded` on the approval re-renders SA-09c with status 503 (D-W07-12); every other
`unavailable_dependency`, `unauthenticated`, `not_found_or_forbidden` and `maintenance` refusal is the shell's. Outcome
unknown: 303 to `/admin/operations/<key>` (the shell's `respond`).

Input (LD-17): every field read whole. The BFF refuses before any command, values kept: `newCeiling` empty or not an
amount (`paiseFromRupees`; text is never passed through or cut); `reason` shorter than 10 or longer than 1,000
characters after trimming (empty is allowed only for the approval's optional reason, which is then not sent); input the
command contract does not take (`contractRefusal`, imported from `decisions/routes.ts`, for example a forged `basis` over
64 characters). The reason is sent as typed; Core trims it.

## 3. Pages and states

All pages: rail `current` = `/admin/finance`; "Read at [time] IST"; no `.badge`, no attention flag, no "Within" or "Over
the ceiling", no computed amount (tested on every page). Every amount is a Core field through `money()` (neutral).

| Page | Content, in order | States |
|---|---|---|
| SA-07h `/admin/finance` | h1 "Finance", lead; `#requests` (count "[n] requests"; rows: travel agent link, requested ceiling "from ₹[old] when requested", requested by and time, reason, action: "Decide" → SA-09c approve, or for the viewer's request "You requested this; a different SuperAdmin decides." + "Withdraw your request" → SA-09c decline); `#tas` (travel agent link, ceiling with "Default"/"Set", counted exposure, unused reservations, paid by TravelMudra not recovered; cap line at 200); `#follow-up` ("Payment follow-up: [o] items open; [m] items yours." with links to SA-07f and `?state=mine`); `#gate2` (design text, links "Flags from operators", "Search all applications"); `#decrease` (boundary row 5) | S2 requests: "No ceiling increase waits for a decision."; S2 travel agents: "No travel agent has an application or a ceiling yet."; S7: required read |
| SA-07t `/admin/finance/tas/:id` | receipt (`lowered`, `requested`); header (crumbs "Money & exposure › Finance", h1 "Exposure ceiling: [travel agent]", lead, reference); status facts (Ceiling with "Default ₹0" or "Set by a SuperAdmin on [time] IST"; Counted exposure; Of which unused reservations (still counted); Of which paid by TravelMudra, not recovered; "Counted exposure is above / not above the ceiling."); the rule line; default-ceiling notice (only at the default); `#increase-request` panel (amounts, requester, reason; requester line; audit line when not healthy; links by reader); `#change-ceiling` ("Lower the ceiling" link or "The default ceiling is ₹0: it cannot be lowered."; "Request an increase" link or "An increase request already waits; it is decided first."); `#reservations` + release notice; `#fees` + exclusion notice; `#changes` (history; "Current ceiling" mark; "Withdrawn by the requester"); `#decrease` | No exposure record: Ceiling ₹0 "Default ₹0", Counted exposure "No exposure is recorded for this travel agent."; empty tables say what is empty; support view: no change links |
| SA-07l `…/ceiling/lower` | CMP-25 frame `lower-*`: scope; evidence (exposure facts, open request); effect (design words); fields "New, lower ceiling" (₹, decimal, hint with the ceiling now), "Reason for lowering", hidden `basis`; review; "Lower the ceiling"; Cancel → SA-07t | draft; closed "The ceiling is the default ₹0. It cannot be lowered." (links: request page, back); support view (closed) |
| SA-07i `…/ceiling/increase-request` | frame `increase-*`, design words; "Requested ceiling", "Reason for the increase"; "Request the increase" | draft; closed "An increase to ₹[n] waits since [time] IST, requested by [name]." (links by reader); support view |
| SA-09c `approve_increase` | frame `approve-*`: scope "from ₹[old] (the ceiling when requested) to ₹[new]. Requested by [name] at [time] IST."; evidence (request reason, exposure now, reservations count, last 5 history rows, "All ceiling changes"); effect; hard stops; "Reason for approving (optional)", hidden `_rev.change`; review; "Approve the increase to ₹[new]" | first match: support view; decided ("This request was approved by [name] at [time] IST." / "withdrawn by the requester" / "declined by [name]"); own request (closed, design sentence, "Withdraw your request"); audit not healthy (unavailable, CMP-10, owner TravelMudra); requester not active (closed, "Decline the request"); ceiling changed (`old_paise ≠` ceiling now; closed, both amounts); draft |
| SA-09c `decline_increase` | same scope and evidence; no hard stops; effect "The request closes. A new request can follow." / "The ceiling stays ₹[ceiling now]." (F-08); "Reason for declining" or "Reason for withdrawing" (required); destructive button "Decline the increase" / "Withdraw the request"; h1 "Decline the ceiling increase: …" / "Withdraw your increase request: …" | support view; decided; draft |

Refusal display (frame rules, as WP-06 U4): with a form, the error summary at the top of the form, each problem at its
field, typed values back in the fields, the stale comparison above the fields; without a form (the re-read state offers
none), `#[prefix]-refusal` first in `main` then "Your unsent values" read only. Closed sentence table:
`conflict_operation_key` (used form); `ceiling_not_lower` / `ceiling_not_higher` at `newCeiling` with the ceiling now;
`ceiling_increase_already_requested` ("Another SuperAdmin requested an increase first …", or "You already requested …"
when the waiting request is the reader's); `self_approval_forbidden`, `requester_inactive`,
`ceiling_changed_since_request` (design sentences, amounts from the re-read); `ceiling_request_not_open` ("Another
SuperAdmin decided this request first …", or "You already decided …"); `audit_degraded` ("… Nothing was approved.");
field codes for `newCeiling`/`newCeilingPaise` and `reason`; any other code: category title, Core's sentence when known,
"Reference code: [code]". Stale (§2.12): lower and request compare the ceiling of the posted `basis` (from the history
row, or "Default ₹0") with the ceiling now; approve and decline compare the request state. The basis and `_rev.change`
of a re-rendered form come from the re-read (D-U6-04).

Receipts (§2.11): resource `ta_finance`, id null; the summary test selects the change by the returned id **in this
page's read**, of this travel agent and of the code's kind (`lowered`: kind lower and `ceilingPaise` = its new amount;
`requested`: kind increase, `state = increase_requested`; `approved`: path change, `approved_by ≠ null`, amount equal;
`declined`: path change, `state = increase_declined`, `declined_by ≠ null`). Titles "Ceiling lowered", "Increase
requested", "Ceiling increase approved", "Increase declined" / "Increase request withdrawn" (by the row). Recorded facts
come from the summary and the selected row; later reads are "Current …" (ceiling; counted exposure; state of the
request). No accepted time. A mismatch gives the unchecked receipt.

## 4. Decisions

| ID | Decision | Reason |
|---|---|---|
| D-U6-01 | SA-09c, SA-07l and SA-07i are composed on `decisionPage` in `ceiling-pages.ts` with the frame rules of `kinds.ts` (receipt first, refusal re-render, unsent block, new `_op`, revisions from the read), not on the SA-09 registry. | The registry address is application-bound (`DecisionAddress.applicationId: app_…`; `decisionHref` builds `/admin/applications/…`, which `decisionKindPage` also uses for the stale review link). A change-bound decision does not fit without editing `kinds.ts`, which is not this unit's file. |
| D-U6-02 | The approval page uses the `draft` state, not `awaiting_second_approver`. | The request is not a first approval; the frame's approval block would read "First approval: [requester]". The scope names the requester and time instead, as the design lists. |
| D-U6-03 | The decision page answers 404 for a change that is a lowering. | Only an increase request is decided; a lowering's "decided" text would be wrong. |
| D-U6-04 | A re-rendered ceiling form carries the `basis` of the re-read, like `_rev.*`. | The basis is Core's stale guard, not a decision value the reader chose; the comparison shows the one the reader's form was made against. Same rule as the WP-06 frame. |
| D-U6-05 | Own request, inactive requester and ceiling changed are `closed` states with the design sentences; only the audit state is a CMP-10 boundary. | `boundaryNotice` renders "[action] is unavailable until [policy]"; a two-person rule and a stale request are facts, not a pending policy. |
| D-U6-06 | The fee and reservation tables of SA-07t use the WP-16 §2.14 staff words, neutral amounts and "Not known yet" in the paid, liability and outstanding cells of a `payment_unknown` fee. | Design says "as today"; today's table shows "due" directions and success badges, which the brief and the WP-16 money rule forbid. Same rendering as the rebuilt SA-07a. |
| D-U6-07 | History state words "Lowered; took effect", "Approved; took effect", "Waiting for a different SuperAdmin", "Declined", "Withdrawn by the requester"; the current ceiling's change is marked "Current ceiling". | Core keeps `state = effective` on a superseded change; "In effect" would be false for it. |
| D-U6-08 | SA-07t keeps the audit sentence ("The audit record is not healthy, so increases cannot be approved now. Lowering a ceiling stays available.") in the open-request panel. | A fact of the read that the system test pins (§7.3: "audit text kept"); the approval itself is on SA-09c. |
| D-U6-09 | SA-07h follow-up section reads "Payment follow-up: [o] items open; [m] items yours." with links to the list and `?state=mine`. | AM-W16-02 (b) binds WP-07's build (WP-16 §1.8). |
| D-U6-10 | The routes reuse `contractRefusal` from `decisions/routes.ts` instead of adding a sixth copy of `inputRefusal`. | One implementation; U7 moves it to the shared helper with the other copies. |

## 5. Deviations from the design (with reasons)

| ID | Design | Built | Reason | Rank |
|---|---|---|---|---|
| DV-U6-01 | §2.10.2 item 3: "Ceiling minus counted exposure: [₹]" or "Counted exposure is [₹] above the ceiling" (Q-W07-11); acceptance A81 "Headroom", V09-14 "₹2,000 above" | Both Core amounts and the sentence "Counted exposure is above the ceiling." / "… is not above the ceiling." No computed amount. | The unit brief: "never compute a 'due' or a difference". | P1 (§7) |
| DV-U6-02 | Default-ceiling notice: "… is unavailable while the ceiling is the default ₹0: that reservation rule is not decided. … Setting a ceiling … makes fee commitments possible within it." | "Committing a government fee for a paid application of this travel agent is unavailable until the product owner decides the reservation rule for a paid application at the default ₹0 ceiling. Setting a ceiling (two SuperAdmins for an increase) makes fee commitments possible within it." Owner product owner; route "Request a higher ceiling (a second SuperAdmin approves it)." → SA-07i. | `boundaryNotice` fixes the sentence form "[action] is unavailable until [policy]." Facts unchanged. | P2 |
| DV-U6-03 | WP-16 §2.9 row 5: "Verifying a bank receipt, allocating it, recording a recovery and adjusting a balance are unavailable until …" | "… recording a recovery or adjusting a balance is unavailable until …" | Same component sentence form ("is"); "or" keeps it grammatical. | P2 |
| DV-U6-04 | SA-09c own request as CMP-10 | `closed` state with the same sentence and the "Withdraw your request" link (D-U6-05). | Template does not fit. | P2 |
| DV-U6-05 | SA-09c audit state CMP-10 with "Owner: TravelMudra" | Boundary kind `known_limitation`, reference `audit_degraded`; its label reads "Known limitation". | No boundary kind exists for a temporary dependency state (`presentation.ts`, not this unit's file). | P2 (§7) |
| DV-U6-06 | §2.10.2 item 5 links "Decide" and "Decline" | For the requester only "Withdraw your request"; others "Decide" and "Decline". | The requester's approval page has no form; linking it adds nothing. | — |
| DV-U6-07 | §2.10.3 effect of lowering (one paragraph) | Split into "What this decision changes" and "What stays unchanged" (frame groups); the request's "A lowering meanwhile makes this request unapprovable." sits under "Before a decision". | The frame requires both groups. Words unchanged. | — |
| DV-U6-08 | Field hints | "In rupees, for example 50,000. The ceiling now is ₹[n]." added under the amount. | States the unit and the current value beside the field (no computation). | — |

## 6. What the wiring unit (U7) must change

1. `src/apps/staff/instance.ts`: register `financeRoutes()` (`./payments/finance-routes.ts`).
2. `src/apps/staff/payments/routes.ts`: remove from `paymentAdminRoutes()` the six routes with the same ids
   (`admin.finance.index`, `admin.finance.ta`, `admin.finance.lower`, `admin.finance.increase_request`,
   `admin.finance.increase_approve`, `admin.finance.increase_decline`) and the helpers they alone use (`renderTa`,
   `changeAnswer`, `paiseField`, `withDone`; `field` stays while the reassign route uses it until WP-16 U3). Duplicate ids
   or method-path pairs would refuse at start.
3. `src/apps/staff/payments/admin.ts`: remove `taFinancePage`, `financeIndexPage`, `CeilingFormState`,
   `reservationTable`, `changeTable`, `ceilingRupeesField`, `reasonText`, the ceiling entries of `DONE`, and `feeTable`
   and `person` if nothing else uses them (grep found no other user). Leave `applicationPaymentsPage` (WP-06).
4. `applicationPaymentsPage` (SA-07a): the Gate 2 decision link to `/admin/applications/:id/decide/gate2_commitment` (§1.2
   row "(WP-06)"; U5's page) when Gate 2 is blocked or unavailable for TravelMudra-filed work, per WP07-A98.
5. `src/apps/staff/home/inbox.ts:375` (SA-01 group 7 "Second approvals"): link `/admin/finance#requests` (the section id
   on SA-07h is `requests`).
6. `src/web/route-inventory.ts`: the three GET rows of §2.
7. `scripts/dev/gallery-pages.ts`: register `financeGalleryPages()` (`./gallery/finance.ts`).
8. System test pins (§7.3):
   - `test/system/payments-views.test.ts:195-263`: read "Default ₹0" from the SA-07t facts (the notice also names the
     default); "The default ceiling is ₹0: it cannot be lowered."; post the increase from GET SA-07i
     (`${taPath}/ceiling/increase-request`), location `${taPath}?done=requested&op=<key>`; the requester reads SA-09c
     approve: "Approving is unavailable for you: you requested this increase." and no approve form; approve from GET
     SA-09c `/admin/finance/ceiling-changes/<id>/decide/approve_increase`, location `<that page>?done=approved&op=<key>`
     (the old flash "The increase is in effect" is gone; read the receipt "Ceiling increase approved" or the ceiling);
     lower from GET SA-07l; the not-lower refusal reads "The new ceiling must be lower than the current ceiling
     (₹50,000.00)." (422); the audit test loads the approval form from SA-09c while healthy, keeps the 503, and finds no
     approve form on SA-09c afterwards (SA-07t has no forms at all; the audit sentence stays on SA-07t); after the
     lowering, post the approval with the form loaded before it (SA-09c shows no form once the ceiling changed): 409 with
     "The ceiling changed after this request was made" on SA-09c; decline from GET SA-09c `decline_increase`.
   - `test/system/case-work.test.ts:434-439`: request from GET SA-07i; approve from GET SA-09c.
9. Consolidate `contractRefusal` with the other `inputRefusal` copies into one shared helper (WP-07 §6 item).
10. When WP-16 builds `src/apps/shared/pages/money-words.ts`, move this unit's closed tables there (`BOUNDARY_WORDS`,
    `FEE_WORDS`, `RESERVATION_WORDS`, `changeStateWords`); `admin.ts` holds a second copy of the fee words today.

## 7. Open items (ranked)

| Rank | Item | Concrete scenario | Proposal |
|---|---|---|---|
| P1 | Computed difference on SA-07t (DV-U6-01): design §2.10.2 item 3, Q-W07-11 (accepted P2), acceptance A81 and V09-14 expect an amount; the unit brief forbids a difference. | The V09-14 live check reads SA-07t for "Counted exposure is ₹2,000 above the ceiling" and fails; or, with the amount added, a reader takes "Ceiling minus counted exposure: ₹46,000" as room that a paid case at ₹0 or a parked case would still refuse. | Architect decides. Built: no amount, the comparison in words. Adding the design's line is one fact row in `exposureFacts` (`finance-pages.ts`). The PM aligns A81 and V09-14 either way. |
| P1 | Acceptance rows A81, A83, A85, A87, A89 (4), A90, A93, A94 carry words that differ from the design and from F-37 (for example A93 "Lowering counted exposure is unavailable until the Accounts verification of bank receipts is decided"; A87 "Approve a ceiling increase: …"; A90 effect "The ceiling stays ₹[current]"; A89 (4) "Owner: SuperAdmin"). | A live run of A93 searches for its sentence and records a failure although the page carries the bound WP-16 row 5 words. | The design and amendments govern names and words (checklist header rule); the PM aligns these rows at the WP-07 acceptance alignment. |
| P2 | Audit boundary label (DV-U6-05). | A SuperAdmin reads "Known limitation" above the audit sentence and assumes approvals are permanently unavailable, not until the audit record recovers. | Add a boundary kind for a temporary dependency state in `presentation.ts` (WP-01 file), or accept. |
| P2 | Component sentence form (DV-U6-02, DV-U6-03). | A reviewer compares the notices word by word with WP-16 §2.9 and flags "or … is" and "until … at the default ₹0 ceiling". | Accept (facts, owner and route are the table's), or give `boundaryNotice` a plural/condition variant (WP-01 file). |
| P2 | The approval page compares only the requested-from amount with the ceiling now; Core also compares the basis change. | Another SuperAdmin lowers the ceiling and a third raises it back to the same amount: the page shows the approval form; Core refuses `ceiling_changed_since_request`; the page shows the sentence with both amounts equal. Nothing is recorded. | Accept, or add the request's basis change id to `zWireCeilingChange` (Kind 1, `src/contracts/`; not this unit). |
| P2 | `pay.finance_index.requests` has a contract maximum of 1,000 and Core's query has no limit. | More than 1,000 travel agents each have an open increase request: the wire answer fails its schema and SA-07h answers the shell's error page. | Defect note for the payments module (a limit with a `more` flag); improbable at current scale. |
| P2 | Textarea `maxlength` counts a line break once; the browser sends CRLF (WP-06 U4 class). | A reason typed to exactly 1,000 characters with line breaks reaches Core over 1,000 and is refused at its field, values kept. | Park, or normalise CRLF in the form parser (shell). |
| P2 | Not this unit: `npx tsc` reports three errors in `test/unit/web/delivery-components.test.ts` (another engineer's uncommitted file; reason-code literal types). | The lane's typecheck fails at integration until that file is fixed. | The owner of that file fixes it; not touched here. |

## 8. Checks run

- `npx tsc -p tsconfig.json`: no error in this unit's files; 3 errors in `test/unit/web/delivery-components.test.ts` (not
  this unit's file, written concurrently by another engineer).
- `npx eslint --max-warnings=0` on the six files: pass.
- `node --test test/unit/web/ceiling-pages.test.ts test/unit/bff-finance.test.ts test/unit/web/service-payment-page.test.ts`:
  64 tests, 64 pass (26 + 12 + 26).
- `node --test "test/static/**/*.test.ts"`: 74 tests, 74 pass (the route scanner needs literal route ids and actions:
  the declarations carry them; a unit test pins them to `FINANCE_ROUTE_IDS`).
- `financeGalleryPages()` rendered once: 20 pages, each with one h1 and no internal reference.
- Not run: the system tests (routes not registered), a browser or axe pass of the gallery pages.
