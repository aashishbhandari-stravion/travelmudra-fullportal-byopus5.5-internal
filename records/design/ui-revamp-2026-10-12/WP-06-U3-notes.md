# WP-06 U3 notes: SA-03 assignment, the assignment plan and reassignment

Unit U3 of WP-06. Author: the U3 engineer, 13 October 2026. Input for the architect's integration and for unit U6. U3
commits nothing. Base: lane commit 101eff1. Binding inputs: `WP-06-design.md` §1.4, §2.0, §2.3 to §2.5, §2.8 to
§2.10, §3, §4; `WP-06.md` §3 and §4.1 to §4.8 (D-01, D-02, D-04, D-05; D-16 with `WP-12-design.md` §2.8 and §2.11);
`DESIGN.md` ("A refusal keeps what was sent", "No truncated input", "Receipts"); LD-14, LD-17.

## 1. Files

| File | Change |
|---|---|
| `src/apps/staff/assignment/pages.ts` (new) | SA-03a `assignPage`, SA-03c `reassignPage` (with `custodyBlock`), SA-03b `planPreviewPage`, `planProblemsPage`, `planRefusedPage`, `planResultPage`; receipt expectations; the closed custody word tables of WP-12 §2.11 (`partLines`, `itemLine`). |
| `src/apps/staff/assignment/routes.ts` (new) | `assignmentRoutes()`: three GET and four POST routes (section 2). `planInput` moved here with `sentPlan`; `inputRefusal` and `sendWhole` (LD-17). |
| `scripts/dev/gallery/assignment.ts` (new) | `assignmentGalleryPages()`: 20 pages; shared fixtures (`galleryAssignModel`, `galleryAssignedCase`, `galleryCaseWork`, `galleryIncident`, `GALLERY_ORIGINALS`, `galleryPlan`). Not registered. |
| `test/unit/web/assignment-pages.test.ts` (new) | 31 tests. |
| `test/unit/bff-assignment.test.ts` (new) | 15 tests (scripted Core over HTTP). |

No other file changed. No route is registered. The old copies in `src/apps/staff/core/admin.ts` stay for U6.

## 2. Routes (exported by `assignmentRoutes()`)

| Id | Method, path | Action | Command | Body limit |
|---|---|---|---|---|
| `admin.applications.assign_form` (new) | GET `/admin/applications/:applicationId/assign` | `assignment.assign` | — | — |
| `admin.applications.assign` | POST same path | `assignment.assign` | `core.assign` | 16 384 |
| `admin.applications.reassign_form` (new) | GET `/admin/applications/:applicationId/reassign` | `assignment.reassign` | — | — |
| `admin.applications.reassign` | POST same path | `assignment.reassign` | `core.reassign` | 16 384 |
| `admin.assignments.preview` | GET `/admin/assignments/selection/preview` | `assignment.assign` | — | — |
| `admin.assignments.selection` | POST `/admin/assignments/selection` | `assignment.assign` | `core.assign_selection` | 65 536 |
| `admin.assignments.round_robin` | POST `/admin/assignments/round-robin` | `assignment.assign` | `core.assign_selection` | 65 536 |

Body limits: the largest valid reason (1 000 UTF-16 units, at most 9 bytes each once form-encoded) plus the tokens fits
16 384 with room, so a longer reason reaches the handler and is refused at its field, kept whole. The largest valid
plan (200 rows, 50 operators) is about 25 KB.

Reads: SA-03a `core.admin_case`; opt. `ops.case_work` (open incidents); receipt `core.operation` (through
`readReceipt`) and, for a checked receipt only, opt. `pay.application_payments` (follow-ups open now). SA-03c
`core.admin_case`; opt. `ops.case_work` (incidents, originals). SA-03b preview `core.assignment_plan`; result
`core.operation` only; refusal opt. `core.assignment_plan` (current state beside the plan as sent).

## 3. Pages and states

| Page | States |
|---|---|
| SA-03a | `draft` (form); `assigned` (closed: "Already assigned to [name]", links Reassign, Gate 1 exception for first operator work when unpaid, the case page); `closed`; `blocked_gate1` (boundary, routes: record the payment, decide a Gate 1 exception; for a lapsed exception: step 1 revoke, step 2 decide a new one); `blocked_other` (two groups; "A Gate 1 exception does not pass these."); `no_operator` (boundary, route Accounts & access). No form unless Core's `assignOffer` allows and an operator is listed. |
| SA-03b preview | Problems (form-level items, no table, "Change the selection"; no read for an absent mode, more than 200 items or more than 50 operators); draft (scope, plan table with "Remove [applicant] from the plan" per row, effect, review with the re-check, form posting every row); none assignable (boundary, no form). An `item` or `operator` value that is not a reference answers the uniform not-found page. |
| SA-03b refused | Error summary (closed sentences); "Your plan as sent" read only beside "Current: assignable now" (re-read; "Unavailable" or "Not read"); confirm shown unavailable with its reason; "Review current information" (a new preview of the sent plan); "Change the selection". No form. |
| SA-03b result | Accepted: "Assignment plan confirmed", Assigned [n], Not assigned [n], "Open the assignment queue". Unchecked: reference, "Check status", back to the queue. No form in either. |
| SA-03c | `draft`; `not_assigned` (closed, link SA-03a); `closed`; `no_operator` (boundary). Evidence: open duties labelled Current and possibly incomplete (holds, acts authorized or filing uncertain, incidents of the current operator not closed); the D-16 custody block; "Stays as it is"; readiness; Gate 1 (unpaid: a fresh exception for assignment, link; a granted exception: Core decides at confirm). |

Refusals: a form state re-renders with the error summary, the field problem and every typed value; a stale revision
shows CMP-14 with the form read now. Where the page offers no form now, the refusal and the unsent values show read
only, with the submit unavailable and "Review current information" (a stale revision shows CMP-14 there).

## 4. Receipt codes

| Code | Host | Expectation | Title | Facts |
|---|---|---|---|---|
| `assigned` | SA-03a | `application`, path id; summary `applicationId` = path id and `assignmentId` a string | "Request recorded" (D-02) | Assignment reference; Current operator, Current service payment (Gate 1), Current payment follow-ups |
| `reassigned` | SA-03c | as `assigned` | "Request recorded" (D-02) | Assignment reference; Current operator, readiness, open holds, custody of each original (D-16) |
| `plan` | SA-03b | `queue`, no id; `assigned` ≥ 1 and `refused` ≥ 0, one `item<i>` code per counted item, as many `assigned` codes as counted, no further item | "Assignment plan confirmed" | Assigned [n], Not assigned [n] (D-01) |

`core.assign` and `core.reassign` answer the same resource and summary, so neither receipt names its command.

## 5. Decisions within the unit

- **Result address (D-01).** The confirm answers 303 to `/admin/assignments/selection/preview?done=plan&op=<key>`. The
  address carries no items or mode: the result reads nothing from the address and no plan. "Plan the unassigned
  applications again" is not built (it would bind summary positions to address ids). The queue shows what waits now.
- **Assign refusal "already assigned".** The sentence is "Another request assigned this application first: [current
  operator]. Yours was not recorded." The read cannot tell whether another SuperAdmin or another tab of the same one
  assigned it (design §2.10 says "Another SuperAdmin").
- **Plan refusals keep the plan as sent.** Every refusal of a confirmation shows the plan read only and no form. The
  hidden rows are never rebuilt from the re-read (DESIGN.md). The `conflict_operation_key` sentence is adapted: "This
  request assigned nothing. Your plan is shown below as you sent it: preview it again, then confirm."
- **Revisions on a re-rendered single form.** SA-03a and SA-03c carry the fresh `_rev.application` after a refusal,
  as the WP-02 decision pages do; a stale revision shows the comparison above the form. The operator choice and the
  reason are the decision values and stay as typed.
- **SA-03a incidents.** The line counts the application's incidents that are open, with a reviewer or waiting for
  evidence, labelled current and possibly incomplete, and states Core's rule: incidents a stand-in reviewer holds move
  to the operator; incidents a SuperAdmin owns stay. Design §2.3 item 5 said "Open incidents … move to the operator",
  which Core does not do for a first assignment (`transferApplicationDuties` with no previous operator).
- **D-05.** No SA-03 page shows `pay.application_payments.gate1`. The SA-03a evidence is Core's `assignOffer` (the
  assignment's Gate 1). First work and reassignment get rule sentences only, never a conclusion. The design's receipt
  fact "Gate 1 for the operator's first work" is not built (R-05).
- **D-16.** The custody word tables of WP-12 §2.11 are implemented in `pages.ts` (holder words, part lines grouped by
  their words, the item line from the parts). A part with holder `unknown` reads "Holder uncertain" whatever its state.
  The item-level `holderKind` and `location` are never read.
- **LD-17.** Every field goes whole to `sendWhole`, which refuses input the command's contract does not take at its
  field before any command. A plan is read by index (`item.N`, `rev.N`, `plan.N`, `operator.N`, numeric order, gaps
  allowed, nothing capped); a row that lacks one of its three fields is refused before any command. The preview
  address is read whole.
- **SA-03c Cancel** goes to the assignment queue (the page does not track its origin).

## 6. Items for U6

| Item | Detail |
|---|---|
| Register | `assignmentRoutes()` in `src/apps/staff/instance.ts`. |
| Remove from `src/apps/staff/core/admin.ts` | `previewPage`, `planRequest`, `planInput`, `planAgain`, `PROBLEM_TEXT`, the routes `admin.assignments.preview`, `admin.applications.assign`, `admin.applications.reassign`, `admin.assignments.selection`, `admin.assignments.round_robin`, and the `assigned`, `reassigned`, `plan` entries of `DONE`. The case page's assign form and reassign disclosure become links to SA-03a and SA-03c. |
| Route inventory | New GET rows `admin.applications.assign_form` and `admin.applications.reassign_form` (section 2). The four POST rows and D100 are unchanged. |
| `resultHrefOf` | `queue` `assignment` → `/admin/queues/assignment` for the operation page, if absent. |
| System tests (design §7.3) | Assign and reassign forms read from SA-03a and SA-03c. Locations: `…/assign?done=assigned&op=<key>`, `…/reassign?done=reassigned&op=<key>`, `/admin/assignments/selection/preview?done=plan&op=<key>`. Plan copy: "Will be assigned" becomes "Yes" under "Assignable now"; the button reads "Confirm the plan for [n] applications". Receipt titles are "Request recorded" and "Assignment plan confirmed". |
| Carried-form test | The old case page holds no form posting to `…/assign` or `…/reassign`. |

## 7. Items for the architect

| Item | Rank | Scenario | Proposal |
|---|---|---|---|
| Gallery registration | — | `assignmentGalleryPages()` is not in `scripts/dev/gallery-pages.ts`. The gallery's request treats the SA-03 and SA-09 pages as served. | Register it. |
| `DESIGN.md` | — | No new component. | Optional line under "Receipts": commands that answer the same result shape (assignment and reassignment) get the neutral receipt; a batch receipt shows counts only. |
| `inputRefusal` / `sendWhole` duplicated | P2 | The same ten lines exist in `src/apps/edge/core/prepare-forms.ts` (WP-03 file, edited by another engineer now). A later change to one copy misses the other. | Move one copy to `src/apps/shared/core/` at integration; both callers import it. |
| Custody words in two places later | P2 | WP-12 U0 builds the same §2.11 tables; two tables drift. | WP-12 U0 takes `partLines`, `itemLine` and the holder words over (or imports them); SA-03c then imports them. |
| Acceptance alignment | P2 | A35, A46, A47, A53 quote command-specific receipt titles; A103 (D-02) governs them: "Request recorded". A38 per-application result lines stay Partly met (D-01). A31 "Synthetic" stays Partly met (no source fact). A46 "assigned under a Gate 1 exception" receipt text is not built: the receipt cannot establish the exception's use; the follow-up count shows as a current fact. | The Product Manager records these against the rows. |

## 8. Checks run

- `npm run typecheck`: pass (whole tree, after the other units' files settled).
- `npx eslint --max-warnings=0` on the five U3 files: pass.
- `node --test test/unit/web/assignment-pages.test.ts test/unit/bff-assignment.test.ts`: 46 tests, 46 pass.
- `node --test "test/static/**/*.test.ts"`: 74 tests, 74 pass.
- Gallery pages rendered as text and read once. Not run: browser rendering, axe and screenshots (no server in this
  unit; the architect's gallery sweep covers them).
