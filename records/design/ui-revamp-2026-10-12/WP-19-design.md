# WP-19 design review: delivery uncertainty and delivery ownership

Lane `ui-revamp-2026-10-12`. Author: Principal UX Engineer (Claude Opus subagent). Date: 13 October 2026.
Status: design before code, for the architect's decision (LD-12). WP-19 holds no command (register §5.1, §6.1), so
under LD-13 it is a read-only package: the code review before integration is the Codex review; a design review by
Codex is the architect's choice (§9.2 Q-W19-06).
Product base: lane repository at b2a6341. Code is read as committed (`git show b2a6341:<path>`); the working tree
(WP-06 U0 in progress) was not read. WP-06, WP-08, WP-11 and WP-14 are designed and not built at b2a6341; this design
depends on their units named in §1.6 and amends them (§1.7). This document writes no product code. Paths in
`file:line` form are relative to the lane repository at b2a6341 unless they start with `REC/` (`internal/records/`)
or `RM` (lane `research/route-map.md`).

Writing style: ASD-STE100 at about 75%. `MUST`, `MUST NOT`, `SHOULD` and `MAY` have their normative meaning.
"Current" means the code at b2a6341. "Target" means the specification or the plan. "Core decides" means the page
shows Core's answer and computes no permission or business fact (D4, D5).

## 0. Summary for the architect

- **Split with WP-08.** WP-08 already designs OP-06 (send preview, uncertain panel, failed-send resend, manual email
  record), TA-07r and TA-07d (separate delivery facts, the uncertain sentence, no resend request control) and the
  LD-04 wording table (WP-08 design §2.3, §2.5, §2.6, §2.10; E-01 to E-24). Both former WP-19 commands are built
  there. WP-19 keeps: the SuperAdmin view of delivery and closure ownership (new SA-02f), the OD §4 and OD §2 boundary
  statements that WP-08 leaves out or words wrongly, and five small amendments where the WP-08, WP-06, WP-11 and
  WP-14 designs show an uncertainty fact wrongly (§1.7).
- **One new page.** SA-02f "Delivery and closure" at `/admin/queues/delivery` (new GET, new Work queues member). It
  reads `views.admin_applications` twice: applications with a recorded outcome whose next step Core names for a
  SuperAdmin (section A: no active owner, "Reassign" or "Assign an operator"), and those whose next step Core names
  as a step not available in this release (section B: uncertain email, Send result, Request completion), each with
  Core's follow-up owner. No form, no command, no receipt.
- **What Core serves (facts).** An email send that is `uncertain` is terminal: no command leaves that state
  (`src/kernel/vocabulary/delivery.ts:30`; only `mail.deliver` and a restore set it). `dlv.manual_resend` refuses an
  uncertain send with the known-limitation boundary `uncertain_email_handling_unselected` and resends a `failed` send
  once (`src/modules/delivery/commands/email.ts:88-101`). Nothing records proven success or proven failure of an
  uncertain send, nothing records a SuperAdmin authorization of a resend, and no policy action or command gives a
  SuperAdmin bounded delivery ownership (`src/modules/identity/policy.ts:150-259`).
- **"Continuing ambiguity requires attributed SA authorization": no served command.** STOP-W19-01 (Kind 2). Two
  more Kind 2 items: STOP-W19-02 (record the investigation result) and STOP-W19-03 (bounded delivery ownership). All
  three are P2 now: production sends no email (no transport; the send is the Kind 2 CMD-44), so no uncertain send can
  exist there. Recommendation: bundle them into the CMD-44 Kind 2 proposal, because OD §2 and §4 describe one send
  feature (Q-W19-05). The pages show each boundary as Core reports it (§2.4); no wording says the owner still has to
  choose.
- **Findings (§9.1).** P1: SA-02 has no delivery and closure view (UI-PLAN SA-02, UX §6.2); the WP-08 row for the
  uncertain-send resend names "Owner: SuperAdmin" for a step that does not exist; the uncertain panel does not say
  which OD §4 routes exist. P2: follow-up owner shown for another duty; boundary counts that include uncertain emails
  under "result send"; an all-time uncertain count read as current; "No email sent" on TA-07 when an uncertain email
  holds a replaced version; a resend offered beside an uncertain send without a duplicate warning.
- **Proofs (§6).** V15 runs on `lane-ui` to its boundary (suspension of syn-operator-3 and reassignment, Q-W19-02).
  V16 runs to its boundary by test: `lane-ui` holds no email send, because no route queues one (WP-08 §6.1). On
  `lane-ui`, V16 shows the absence of every SuperAdmin send, resend or authorization control and the boundary
  statements.

## 1. Scope, sources, facts, pages, shell, split

### 1.1 Sources read

| Source | Parts |
|---|---|
| UX spec `TARGET_PRODUCT_UX_SPEC.md` (SHA-256 b45186887cdc37f6…) | §2.2, §2.3, §3.1 steps 8–9, §3.3, §5.3 (Send result, Uncertain email), §6.1–§6.3, §8.3, §10.1, §12 V15, V16 |
| OD `sources/owner-decisions-2026-10-05.txt` (SHA-256 1ea7aec26854d433…) | §2, §3, §4 |
| `BUILD_SPEC.md` r2 | B18, B19, B31, B33, B35, B46 |
| `UI-PLAN.md` | §3.2 TA-07, §3.3 OP-06, §3.4 SA-02, §5.3 OP-06 table, §5.4 SA-02, §7 rows 1176–1178, §12.2 WP-19, §13.1 OC-01 to OC-05 |
| `DECISIONS-2026-10-10.md` | §1.3 (OC-03, OC-04 decided), §3.1, §3.2 |
| `SURFACE-INVENTORY-2026-10-10.md` | RM-O6, RM-A2, RM-A10, CMD-44 to CMD-48, §5 group C note on `dlv.manual_resend` |
| Lane records | `PLAN.md` §4 (LD-04, LD-08, LD-13, LD-14, LD-17), §7, §8, §9; `COMMAND-COVERAGE.md` §3, §5.1, §6.1; `WP-06.md` §3–§4 (D-02, D-04); `WP-06-design.md` §1.2, §1.3, §2.0–§2.2, §6.4, §7.1; `WP-06-acceptance.md` A17, A61, A109; `WP-07.md` §3–§4 (F-01, F-33); `WP-08.md` §3–§4 (E-01 to E-24); `WP-08-design.md` §1.2–§1.6, §2.0, §2.3–§2.6, §2.10–§2.14, §4, §6, §7.1, §9.4; `WP-08-acceptance.md` A43, A48, A70, Q-01, Q-04, Q-09; `WP-10.md`, `WP-10-design.md` §2.10 (SA-02e); `WP-11-design.md` §2.8 (SA-04d); `WP-14.md`, `WP-14-design.md` §2.12 (Monitors); `WP-16-design.md` (structure); `PROPOSALS.md`; `DESIGN.md` |
| Code (pages and routes) | `src/apps/shared/delivery/pages.ts`, `src/apps/staff/delivery/routes.ts`, `src/apps/staff/views/cases.ts`, `src/apps/staff/attention.ts`, `src/web/ui/shell.ts:152-180` |
| Code (Core behaviour, read only) | `src/contracts/{delivery,views-cases,core}.ts`, `src/modules/delivery/{pages,evidence,restore}.ts`, `src/modules/delivery/commands/email.ts`, `src/modules/delivery/tasks/mail-deliver.ts`, `src/modules/core/{derived,model}.ts`, `src/modules/views/{case-queries,case-projectors}.ts`, `src/modules/identity/{policy.ts,commands/accounts.ts}`, `src/platform/mail.ts` |

### 1.2 Delivery uncertainty and ownership as Core holds them (facts)

| # | Fact | Source |
|---|---|---|
| K1 | Email send states: `queued`, `denied_at_check`, `sending`, `accepted`, `synthetic_accepted`, `failed`, `uncertain`. No command moves a send out of `uncertain`. `mail.deliver` sets it on an ambiguous transport result or a lost acknowledgement; a restore sets it with `result_code = 'restore_boundary'`. | `src/kernel/vocabulary/delivery.ts:30`; `src/modules/delivery/tasks/mail-deliver.ts:214-228`; `src/modules/delivery/restore.ts:73` |
| K2 | `dlv.manual_resend`: assigned operator only; an `uncertain` source → `unavailable_known_limitation` / `uncertain_email_handling_unselected`; not `failed` → `resend_source_not_failed`; stale → `stale_revision`; no transport → `unavailable_owner_decision` / `real_mail_transport_unselected`; second resend → `resend_exists`. The new send rechecks recipient and files at prepare time. | `src/modules/delivery/commands/email.ts:73-105`; `src/modules/identity/policy.ts:226` |
| K3 | `dlv.delivery_page` on the operator surface: `resendOffer` is allowed for an unresent `failed` send, blocked `resend_exists` for a resent one, blocked `uncertain_email_handling_unselected` for an `uncertain` one; null on the TA and SuperAdmin surfaces. `unavailable` holds the uncertain code on staff surfaces when any send is uncertain. | `src/modules/delivery/pages.ts:164-168, 201-202` |
| K4 | Completion prerequisite `delivery` (result held electronically): code `uncertain_email_handling_unselected` only when every email of the application is `uncertain`; otherwise `delivery_send_trigger_unselected`. | `src/modules/core/derived.ts:201-223` |
| K5 | Pending answer after an outcome: artifact, custody and group-end blockers come first; then the delivery code with owner kind `unresolved_known_limitation`, next action `record_delivery` and follow-up owner `assigned_operator` (or `superadmin` when no operator is assigned); then the completion code. An inactive assigned operator comes before all of these: owner `superadmin`, reason `assigned_operator_inactive`, next `assign_operator`. | `src/modules/core/derived.ts:293-297, 405-423` |
| K6 | Progress `delivery_closure_pending` = an open application with an outcome whose pending owner is not the travel agent. | `src/modules/core/model.ts:157-163` |
| K7 | `views.admin_applications` filters `progress` and `pendingOwner` (AND); 200 rows a read with a cursor; `asOf` with health and lag. The projector re-reads an operator's applications on suspension, restore and activation, and an application on each delivery fact. | `src/contracts/views-cases.ts:84-92`; `src/modules/views/case-queries.ts:156-160`; `src/modules/views/case-projectors.ts:52-77` |
| K8 | `views.monitors.pendingBoundary.deliverySendTrigger` counts applications whose pending reason is `delivery_send_trigger_unselected` **or** `uncertain_email_handling_unselected`. `externalUncertainty.uncertainEmails` counts every `uncertain` send ever recorded (null while not composed). No read counts or lists `failed` sends across applications. | `src/modules/views/case-queries.ts:272-285, 324`; `src/modules/delivery/evidence.ts:36-45` |
| K9 | No policy action, command or query gives a SuperAdmin delivery ownership, records an investigation result of an email, or records an authorization of a resend. A SuperAdmin's delivery page has `offers = null`. | `src/modules/identity/policy.ts:150-259`; `src/contracts/delivery.ts` (`DELIVERY_COMMANDS`, `offers`) |
| K10 | In production no email is sent: the send is a deliberate boundary (CMD-44) and the harness that queues sends refuses production. Synthetic transport results: `fail+…` → `failed`, `uncertain+…` → `uncertain`, else `synthetic_accepted`. | `src/modules/delivery/commands/email.ts:112-116`; `src/platform/mail.ts:111-116` |

### 1.3 Split with WP-08 (what is covered, what remains)

| Need (spec) | WP-08 covers (design and amendments) | Remains for WP-19 |
|---|---|---|
| OP-06 uncertain email: "Email delivery is uncertain. No automatic resend will occur.", attempt times, follow-up owner, no resend form (UX §5.3; V16) | §2.3 state "Uncertain email", §2.10 row 3, A43 | Show the follow-up owner only when Core's pending reason is the uncertain code (F-W19-04); state the three OD §4 routes and which exist (F-W19-03); provider correlation stays absent (STOP-W08-05) |
| Proven failure permits a deliberate resend (B31; OD §4) | §1.4 row 8 (`dlv.manual_resend`, K-EXT), §2.3 item 4d, §2.12 `resend`, §4.1 | Duplicate warning when another send is uncertain (F-W19-08) |
| Continuing ambiguity: attributed SuperAdmin authorization with fresh checks (OD §4; V16) | §2.10 row 4 boundary ("Owner: SuperAdmin") | Correct the owner and the sentence (F-W19-02); STOP-W19-01 |
| Proven success or proven failure recorded after investigation (OD §4) | Not covered | Boundary statement (§2.4 row W2); STOP-W19-02 |
| TA-07: email uncertain, no resend request (UX §4.4; V16) | §2.5 state "Email uncertain", A70 | Email fact when the uncertain send holds a replaced version (F-W19-07) |
| Unassigned delivery owned through SuperAdmin assignment (V15; OD §2) | A48 (no SuperAdmin send control; route "Assign an operator") | A SuperAdmin view that lists the duties (SA-02f, F-W19-01) |
| Explicit bounded delivery ownership (OD §2, OC-04) | Q-09 (no command; SA-03 route) | Boundary statement on SA-02f (§2.4 row W3); STOP-W19-03 |
| No SuperAdmin filing, readiness or completion-request privilege (V15) | A48; CC-07 (no completion control) | Sweep test over SA-02f and the amended SuperAdmin pages (§7.2) |
| SA-01 and Monitors counts | WP-06 groups 12 and 13; WP-14 item 4 | Words and links (F-W19-05, F-W19-06) |

### 1.4 Page list

| ID | Page | Path | Status | Reads ("opt." = through `optionalView`, LD-14) |
|---|---|---|---|---|
| SA-02f | Delivery and closure | `/admin/queues/delivery` | **New** (`admin.queues.delivery`, action `application.read`, resolve `{ type: 'self' }` as `admin.applications.list`; the implementer checks the resource set as WP-06 Q-W06-11) | opt. `views.admin_applications {progress: 'delivery_closure_pending', pendingOwner: 'superadmin'}` (read A); opt. `views.admin_applications {progress: 'delivery_closure_pending', pendingOwner: 'unresolved_known_limitation'}` (read B) |
| OP-06 | Result delivery | `/ops/applications/:id/delivery` | WP-08 page; amended (§1.7) | unchanged |
| TA-07r, TA-07d | Result and delivery; Delivery | WP-08 paths | WP-08 pages; amended (§1.7) | unchanged |
| SA-04d | Delivery (SuperAdmin) | `/admin/applications/:id/delivery` | WP-11 phase 2 page; amended (§1.7) | unchanged |
| SA-01, SA-08m | Decision inbox; Monitors | `/admin`, `/admin/monitors` | WP-06, WP-14 pages; amended (§1.7) | unchanged |

SA-02f takes no query parameter. It has no paging of its own: at a read's cap it links to the SuperAdmin application
list with the same filter, which pages by cursor (`/admin/applications?progress=delivery_closure_pending&owner=…`,
existing parameters, `src/apps/staff/views/cases.ts:119`).

### 1.5 Shell placement

| Rail destination | Member | Pages | Breadcrumb |
|---|---|---|---|
| Work queues | "Delivery and closure" `/admin/queues/delivery`, after "Deferrals" | SA-02f | "Work queues › Delivery and closure" |

The member is one entry in `SURFACE_CONFIG.admin` Work queues members (`src/web/ui/shell.ts:157-167`; WP-01 file,
one value; the architect applies it). No navigation count (Q-W19-04): its owner-gap rows are already counted under
Assignment (`src/apps/staff/attention.ts`), and the boundary rows are not SuperAdmin work.

### 1.6 Dependencies and shared components

Reused, no new variant: WP-06 U0 CMP-06 `queueTable` (`src/web/ui/queues.ts`); WP-01 CMP-10 `boundaryNotice`,
CMP-12 freshness (lag form, LD-08); `section`, `emptyState`, `identifier`. WP-08 U0 closed word tables
(`src/apps/shared/delivery/words.ts`): §2.10 rows 1–3 and the follow-up owner words. WP-19 builds after WP-06 U0 and
U2, WP-08 U0 and U2, WP-11 U7 (SA-04d) and WP-14 U5 (Monitors) are integrated. If one is not, its amendment binds
that package's build instead (§1.7) and WP-19 does not edit its files.

### 1.7 Amendments to designed packages (for the architect to number)

| ID | Rank | Package, place | Amendment |
|---|---|---|---|
| AM-W19-01 | P1 | WP-08 §2.10 row 4 | Replace with §2.4 row W1. The owner of the missing step is "product owner", as for rows 1 and 2 (WP-08 §3 decision on Q-W08-03). "Owner: SuperAdmin" MUST NOT appear: no SuperAdmin control exists (F-W19-02). |
| AM-W19-02 | P1 | WP-08 §2.3, state "Uncertain email" (OP-06), and the same panel in SA-04d read mode (WP-11 §2.8) | The uncertain panel holds, in order: the verbatim sentence "Email delivery is uncertain. No automatic resend will occur."; the attempt facts (§2.10 row 3); the line "Follow-up: [owner]" by rule AM-W19-03; then the closed list "What this release offers for this email" with rows W1 and W2 of §2.4 and the line "A manual email record or a handover record does not change this email's result." No form and no disabled button for W1 or W2. SA-04d uses the SuperAdmin words of §2.4. |
| AM-W19-03 | P2 | WP-08 §2.10 row 3 "Follow-up: [follow-up owner from the pending answer]" | Show the follow-up owner only when Core's pending `reasonCode` is `uncertain_email_handling_unselected`. Otherwise: "The application's next step is another one: [Core's pending sentence]." Never a follow-up owner of another duty (F-W19-04). |
| AM-W19-04 | P2 | WP-08 §2.3 item 4d, resend review | When another send of the same application is `uncertain`, the review adds: "Another email of this application has an uncertain result (listed above). If it arrived, the travel agent receives these files twice." The resend stays available as Core offers it (F-W19-08). |
| AM-W19-05 | P2 | WP-08 §2.11 "Email with the result" (TA-07r) | When `emails[]` is not empty and no row holds a version of a current result file, the fact reads "No email with the current result file. Earlier emails are listed under Delivery." with a link to TA-07d `#emails`, never "No email sent" (F-W19-07). |
| AM-W19-06 | P2 | WP-06 §2.1 SA-01 groups 12 and 13 | Group 12 line: "Document emails whose result stayed uncertain, recorded in total: [n]" (the count is of sends, all time, K8), link → SA-02f `#uncertain`. Group 13 lines: "Waiting on a result send or on an uncertain email: [n] applications"; "Waiting on a completion request: [m] applications"; link → SA-02f `#boundary` (F-W19-05, F-W19-06). |
| AM-W19-07 | P2 | WP-14 §2.12 SA-08m items 3 and 4 | Same words as AM-W19-06 for the uncertain-email count and the boundary count; "Where to act" for both → SA-02f. |

No amendment changes a command, a field name, a form action or a receipt.

## 2. Page specifications

### 2.0 Rules common to WP-19

- **No command.** WP-19 adds no form, no POST route and no receipt. LD-17 has no handler to check. Every page
  change is rendering.
- **Freshness (LD-08).** SA-02f reads a projection: each section shows the lag form of its read's `asOf` ("Up to date
  when read at [time] IST", "Behind by [n] s when read at [time] IST", "Freshness unavailable"). No age threshold.
- **Page states.** S1: server-rendered, no skeleton. S6, S7: the SH-02 pages of WP-01. An access, authentication,
  maintenance or support-view refusal of either read reaches the shell (LD-14). An availability failure of one read
  makes only its section "Unavailable".
- **Unknown is never zero.** A section whose read failed shows "This part cannot be read now." and no count. The
  page never says "Nothing waits" unless both reads succeeded and both returned no row.
- **Core decides.** Section membership is Core's pending answer (owner kind and reason code) as projected. The page
  computes no owner, no state of an email and no eligibility. Row actions are links; the target page re-reads
  Core and Core decides there.
- **No SuperAdmin operator privilege (V15).** No WP-19 page and no amended SuperAdmin page shows "Send result",
  "Resend", "Authorize a resend", "Take delivery ownership", "Record a manual email", "Record a handover",
  "Request completion", "Run the completion check", "Confirm readiness", "File" or "Force complete", enabled or
  disabled.
- **No instruction to act outside the product (F-33).** No copy tells anyone to resend, to ask the travel agent
  whether an email arrived, or to contact a mail provider.
- **Copy.** UI-PLAN §11. Every time carries "IST". Counts name their unit ("applications", "emails"). Forbidden:
  "Delivered" or "Received" for an email, "not decided", "undecided", "unselected", "no trigger", "Owner not yet
  decided", "investigating" (no investigation record exists). All copy is draft (CR-09).
- **Mobile (< 768 px).** One column; rows as labelled cards (applicant, why, owner, action).

### 2.1 SA-02f Delivery and closure `/admin/queues/delivery`

Purpose: show every application whose result is recorded and whose next step has no active operator or waits on a
step that is not available in this release, with the owner Core names (UI-PLAN SA-02 "Delivery and closure
ownership"; UX §3.1 step 8, §6.1 "Keep each obligation owned"; OD §2; V15, V16).

Anatomy (reading order):

1. Header: breadcrumb "Work queues"; `h1` "Delivery and closure"; lead "Applications whose result is recorded and
   whose next step waits on a SuperAdmin, or on a step that is not available in this release. Read from the
   application list, which can be behind." Secondary link "Every application with a recorded result" →
   `/admin/applications?progress=delivery_closure_pending`.
2. `h2` "Waiting on a SuperAdmin" (`id="superadmin"`), read A.
   - Lead: "Core names a SuperAdmin for the next step of these applications. When no active operator holds an
     application, assign or reassign one: the operator then owns the delivery."
   - CMP-10 notice (§2.4 row W3), once, above the table.
   - Line: "A SuperAdmin never sends the result, files, confirms readiness or requests completion."
   - Count line "[n] applications" (or the cap line, item 5); freshness of read A.
   - `queueTable` columns: Application (applicant → `/admin/applications/<id>`, reference `identifier`); Service;
     Outcome (outcome words, WP-08 §2.11); Why it waits (Core's sentence of `pending.reasonCode`); Action (closed
     table §2.2).
   - Empty (read succeeded, no row): "No application with a recorded result waits on a SuperAdmin."
3. `h2` "Waiting on a step not available in this release" (`id="boundary"`), read B.
   - Lead: "Core reports these applications as waiting on an uncertain email, on Send result or on Request
     completion. The assigned operator keeps each application; Core names the follow-up owner."
   - Count line for read B and freshness; then three `h3` parts that partition read B's rows by
     `pending.reasonCode`, each with "[k] applications in this list":
     a. `h3` "Email result uncertain" (`id="uncertain"`): the sentence "Email delivery is uncertain. No automatic
        resend will occur."; the closed list of §2.4 rows W1 and W2 (SuperAdmin words); the line "An application
        with an uncertain email and an earlier step (for example a result file under review) is listed by that
        step, not here. Core lists an application here when every email of it is uncertain." (K4, K5).
     b. `h3` "Waiting on Send result" (`id="send"`): WP-08 §2.10 row 1 sentence form (staff).
     c. `h3` "Waiting on Request completion" (`id="completion"`): WP-08 §2.10 row 2 sentence form (staff).
     d. A row with any other reason code (defensive): `h3` "Other steps" with Core's sentence and "Reference code:
        [code]".
   - Columns in each part: Application; Service; Outcome; Follow-up owner (§2.3); Action ("Delivery record" →
     SA-04d; plus "Assign an operator" → SA-03a when the follow-up owner kind is `superadmin`).
   - Empty part: the part is left out; when all of read B is empty: "No application with a recorded result waits on
     a step that is not available in this release."
4. Both reads succeeded and empty: one line above the sections: "Nothing with a recorded result waits on a
   SuperAdmin or on a step that is not available in this release." No "All done".
5. Cap (D7): a read that returns 200 rows or a non-null `next` shows "This list shows the first 200 applications it
   read. More may wait." with "All of them in Applications" → `/admin/applications?progress=delivery_closure_pending&owner=superadmin`
   (read A) or `…&owner=unresolved_known_limitation` (read B). Part counts of read B then read "[k] in the first
   200".

| State | Copy and controls |
|---|---|
| S2 | Item 4 |
| S4 one read unavailable | That section: "This part cannot be read now." No count, no empty text; the other section unaffected |
| S5 projection behind | Lag line per section; rows as projected; each action page re-reads Core |
| Access refusal of either read | The shell's page (LD-14), never the other section |
| Mobile | Section A before section B; rows as cards |

### 2.2 Section A actions (closed table, by `pending.reasonCode`)

| Reason code (Core) | Action link | Target |
|---|---|---|
| `assigned_operator_inactive` | "Reassign" | SA-03c `/admin/applications/<id>/reassign` |
| `artifact_not_eligible`, `original_held`, `parked_custody_route_policy` with owner kind `superadmin` (no operator) | "Assign an operator" | SA-03a `/admin/applications/<id>/assign` |
| `hold_flagged_to_superadmin` | "Respond to the flag" | SA-02c target (WP-06 §2.2.3) |
| `protection_mark_active` | "Open the protection mark" | the WP-11 SA-09 page for the mark, or SA-04a until it exists |
| any other code | "Open the application" | SA-04a, with "Reference code: [code]" in the Why column |

The links never post. SA-03a and SA-03c re-read Core and show Core's offer; Core refuses an assignment that its rules
do not allow (WP-06 §2.3, §2.5).

### 2.3 Follow-up owner words (`pending.followUpOwner`)

| Value | Staff words |
|---|---|
| kind `assigned_operator` | "The assigned operator" (the name is on the application page) |
| kind `superadmin` | "A SuperAdmin: no operator is assigned" |
| other kind | the owner label of WP-08 §2.10 row 6 / the existing `ownerPresentation` |
| `null` | "Not named by Core" |

The list read carries no names (`zWireProjectedApplication`), so the page shows the role; it never guesses a name.

### 2.4 Boundary statements of WP-19 (closed table; extends WP-08 §2.10)

Each row is a CMP-10 notice or a list item. "Owner" is the owner of the missing step's arrival, as the architect
decided for WP-08 rows 1 and 2. No row says that anyone still has to choose a rule, a trigger or an owner.

| # | Missing step (Core's answer) | Staff and SuperAdmin text | Travel agent text |
|---|---|---|---|
| W1 | Resend of an uncertain email (`dlv.manual_resend` → `uncertain_email_handling_unselected`, known limitation; `resendOffer` blocked) | "Resending an email whose result is uncertain is unavailable until it is added to the product. Owner: product owner." Then: "The rule is decided: a SuperAdmin authorizes such a resend with a reason, and TravelMudra checks the recipient, each file and its version again before it sends." | — (no control; WP-08 §2.10 row 3 sentence only) |
| W2 | Recording what an investigation of an uncertain email found (no command, K9) | "Recording whether an uncertain email arrived or failed is unavailable until it is added to the product. Owner: product owner. The email stays uncertain." | — |
| W3 | Bounded delivery ownership by a SuperAdmin (no command, K9; OD §2) | "Taking delivery ownership yourself is unavailable until it is added to the product. Owner: product owner." Route: "Assign or reassign an operator: the operator then owns the delivery." | — |
| W4 | A failed send (Core state `failed`) | Not a boundary. OP-06 offers the resend form when `resendOffer` allows it (WP-08 §2.3 item 4d). SA-04d and SA-02f show no form: "Only the assigned operator resends a failed email." | WP-08 §2.11 "Failed: it was not sent" |

A hand-made POST that reaches a W1 refusal (an operator's resend of an uncertain send) re-renders OP-06 with the W1
notice and the category status Core answers; nothing is recorded (WP-08 §2.0 REJ rule).

## 3. Interim and switch for the pending Core items

| Item | Interim (this design) | Switch when served |
|---|---|---|
| STOP-W19-01 SuperAdmin authorization of a resend | W1 notice on OP-06, SA-04d, SA-02f `#uncertain` | A decision page SA-09 kind `authorize_resend` (WP-06 §2.7.4 registry) with reason, the send facts and the fresh-check statement; OP-06 then shows the authorized resend; W1 is removed |
| STOP-W19-02 investigation result | W2 notice | A record form on OP-06 for the assigned operator (or the owner Core names) with evidence; the uncertain panel then shows the recorded result |
| STOP-W19-03 bounded delivery ownership | W3 notice; route SA-03a / SA-03c | An SA-09 kind on SA-02f rows; the page states its bounds (delivery only, same release checks, no filing, readiness or completion request) |
| STOP-W19-04 email sends by state | SA-02f by Core's pending reason; SA-04d per application | SA-02f part "Failed emails not resent" and exact uncertain rows |
| STOP-W08-05 provider correlation | Attempt times only; a restore-marked send reads like any other uncertain send | The panel adds "Message reference" and "Marked uncertain by a restore" |

## 4. Hostile-state analysis

### 4.1 The Nth identical submission

WP-19 has no form. The only POST paths the WP-19 states touch are WP-08's (`ops.delivery.resend`) and are analysed in
WP-08 §4.1. Two additions: a resend from a second tab after the first resend became `uncertain` → `resend_exists`
(Core refuses before the state of the new send matters); a resend of the new uncertain send → W1.

### 4.2 What a failure leaves on the page

| Failure | Page | Residue |
|---|---|---|
| Read A or B unavailable | That section "This part cannot be read now."; the other section and the shell stay | None (GET) |
| Both reads unavailable | Both sections unavailable; no "Nothing waits" line; the page renders | None |
| Access refusal | The shell's page | None |
| Hand-made W1 POST (operator) | OP-06 re-render with W1, values kept (`reason`) | None: Core records nothing |
| SuperAdmin session posts an `/ops/...` delivery path | The uniform not found of the `/ops` surface | None |

### 4.3 The named hostile states

| State | Required behaviour | Today |
|---|---|---|
| Operator suspended after the outcome (K5 rule 3, projector K7) | SA-02f section A row "The assigned operator's account is not active", "Reassign"; the same application in SA-02a "Operator no longer active"; OP-06 for the suspended operator: shell sign-in (sessions revoked) | No view |
| Operator restored before the SuperAdmin acts | Row leaves section A after the projection catches up; while behind, SA-03c shows the current assignment and Core decides | — |
| Projection behind (clock and lag) | Lag line; no client-side age rule; no claim of currency | — |
| One `failed` and one `uncertain` send | Core's delivery code is the send code (K4): the application is under "Waiting on Send result", not "Email result uncertain"; OP-06 shows both rows, the resend form on the failed row with the AM-W19-04 line, the panel on the uncertain row | Partly |
| Uncertain send of a version that a replacement made non-current | OP-06 lists the row with its file count; TA-07r fact by AM-W19-05; Core's delivery code still counts every email (K4) | False "No email sent" risk |
| Uncertain send marked by a restore (`restore_boundary`, K1) | Same panel as any uncertain send; no cause claimed (STOP-W08-05) | Same |
| Uncertain email and an earlier blocker (artifact under review) | The application is in neither part of section B; SA-02f `#uncertain` states this; SA-01 group 12 counts the send | — |
| Resent failed send that also fails | The new row is `failed` with its own resend form (one per failed send, K2) | Yes |
| Resend in an installation without a transport | Core refuses `real_mail_transport_unselected` (owner decision); WP-08 §2.10 row 5; the typed reason stays. Not reachable in production (no failed send exists there, K10) | Yes |
| No operator and an outcome (follow-up owner `superadmin`) | Section B row with "A SuperAdmin: no operator is assigned" and "Assign an operator"; reachable only by a test fixture at b2a6341 (only the completion harness clears the operator) | — |
| Pending owner `ta` after an outcome | Not `delivery_closure_pending` (K6), so not listed; the lead names the filter, so the page claims nothing about it | — |
| Read A or B at 200 rows | Cap line and link; part counts qualified "in the first 200" | — |
| SuperAdmin loses the session or is suspended | Next request reaches sign-in; nothing held | Yes |
| Support view active | `/admin` answers 409 `support_view_active` (WP-06 §2.0) | Yes |

### 4.4 Device and environment

GET-only pages work without JavaScript. Counts and states are text, never colour only. At 390 px each row is a card.

## 5. Accessibility notes

- One `h1`; sections `h2`; the three parts of section B `h3`; landmarks from the shell.
- Each table has a caption naming its section and part ("Applications waiting on Send result").
- Action links name the application ("Reassign [applicant]") through visually hidden text.
- The CMP-10 notices use the WP-01 boundary component (role `note`, text label "Not available in this release").
- axe at 1440 px and 390 px with zero violations (§6).

## 6. Proofs V15 and V16 on `lane-ui` (to their boundary)

### 6.1 What `lane-ui` holds (facts and inference)

- Installation `lane-ui` (edge 4650, staff 4652; config `~/.local/share/travelmudra-uat/configs/lane-ui.json`, source
  this lane's clone, ref `ui-revamp-2026-10-12`). At the WP-19 proof it holds WP-06, WP-08, WP-11 and WP-14 pages.
- Synthetic seed: Synthetica, "SYN Tourist e-visa"; accounts syn-ta-1 to -3, syn-operator-1 to -3, syn-superadmin-1
  and -2.
- Fact (K10; WP-08 §6.1): no HTTP route queues an email or completes a case, so `lane-ui` holds no email send.
  `uncertain`, `failed` and resend states are proven by tests.
- Inference: the installation's harness setting is not in its UAT configuration. The labelled CLI `tm harness
  deliver-email` (`src/cli/commands/harness.ts`) would only produce `synthetic_accepted` for the seeded addresses
  (`src/platform/mail.ts:111-116`). WP-19 does not use it (Q-W19-03).
- Sign-in through the LD-11 harness; codes never printed. Synthetic data only.

### 6.2 Setup (synthetic writes, labelled as setup; Q-W19-02)

Through the rebuilt pages, as in WP-08 §6.2: group `wp19-[yyyymmddhhmm]` in Synthetica; applicant F; submit; record
service payment; assign F to syn-operator-3; start work, readiness, authorization, filed evidence; record outcome
"Issued" with a generated synthetic result PDF (WP-08 test fixture generator). Seeded data is not changed, except
the reversible suspension and restore of syn-operator-3 in V15-3 and V15-7.

### 6.3 V15: unassigned delivery is owned through SuperAdmin assignment; no SuperAdmin operator privilege

| Step | Actor, page | Action | Observable result | Where |
|---|---|---|---|---|
| V15-1 | syn-superadmin-1, SA-02f | Read after setup | F under "Waiting on Send result", follow-up owner "The assigned operator"; the WP-08 row 1 sentence; lag line | L |
| V15-2 | syn-superadmin-1, SA-02f, SA-04a, SA-04d of F | Look for controls | None of the controls of §2.0 "No SuperAdmin operator privilege"; the W3 notice on SA-02f | L |
| V15-3 | syn-superadmin-1, SA-06 (WP-15) | Suspend syn-operator-3 with a reason | Receipt as WP-15 | L |
| V15-4 | syn-superadmin-1, SA-02f | Read (repeat until the lag line reads up to date) | F under "Waiting on a SuperAdmin": "The assigned operator's account is not active", action "Reassign"; SA-02a "Operator no longer active" lists F | L |
| V15-5 | syn-superadmin-1, SA-03c | Reassign F to syn-operator-2 with a reason | Receipt "reassigned" (WP-06, D-16); SA-02f: F back under "Waiting on Send result", owner "The assigned operator" | L |
| V15-6 | syn-operator-2, OP-06 of F | Read | Send boundary (WP-08 row 1); "Record an email you sent yourself" form offered by Core; no SuperAdmin wording | L |
| V15-7 | syn-superadmin-1, SA-06 | Restore syn-operator-3 (teardown) | Account active again; F stays with syn-operator-2 | L |
| V15-8 | Test | SuperAdmin session POSTs `/ops/applications/<F>/manual-emails` and `/ops/email-sends/<eml>/resend`; harness posts `core.check_completion` as a SuperAdmin | Uniform not found or the boundary; nothing recorded (counts delta 0) | T |
| V15-9 | Test | Row fixtures: follow-up owner `superadmin`; `null`; unknown reason code; read A unavailable; read B at 200 | §2.1 to §2.3 texts; "Assign an operator" link; "Not named by Core"; "This part cannot be read now."; cap line | T |
| V15-10 | axe | SA-02f | No violation at 1440 px and 390 px | L |

### 6.4 V16: ambiguous email is not success; no automatic resend; proven failure permits a deliberate resend; continuing ambiguity at its boundary

| Step | Actor, page | Action | Observable result | Where |
|---|---|---|---|---|
| V16-1 | syn-superadmin-1, SA-02f `#boundary` | Read | No "Email result uncertain" part (no uncertain send exists); no "Nothing waits" claim unless both reads are empty; W1 and W2 texts appear in the part only when it has rows (test V16-6) | L |
| V16-2 | syn-operator-2, OP-06 of F; syn-ta-1, TA-07 of F | Read | "Nothing was sent or recorded for this application yet."; no resend form; TA: "Email with the result: No email sent" | L |
| V16-3 | Test | OP-06 with an `uncertain` send (fixture) | AM-W19-02 panel in order; verbatim sentence; attempt times; W1, W2; no resend form or disabled button; follow-up owner only with the uncertain pending code (AM-W19-03) | T |
| V16-4 | Test | Operator posts a resend of the uncertain send | Core: known limitation `uncertain_email_handling_unselected`; OP-06 re-render with W1; reason kept; email count delta 0; no task queued | T |
| V16-5 | Test | `failed` send: resend; same `_op` again; second tab | Receipt "Resend queued" (never "Sent" or "Delivered"); replay answers the same receipt; second tab `resend_exists`; the new send's state as Core reports it | T |
| V16-6 | Test | One `failed` and one `uncertain` send | Resend offered on the failed row with the AM-W19-04 line; SA-02f lists the application under "Waiting on Send result" (K4) | T |
| V16-7 | Test | TA-07r and TA-07d with `uncertain`; with `uncertain` on a replaced version | WP-08 §2.10 row 3 travel agent sentence; no resend request control; AM-W19-05 text, never "No email sent" | T |
| V16-8 | Test | SA-04d with an `uncertain` and a `failed` send | Panel with SuperAdmin words; W4 line; no form | T |
| V16-9 | Test | SA-01 group 12 and 13, Monitors | AM-W19-06 and -07 words; null → "Unavailable" | T |
| V16-10 | Test | Forbidden-phrase sweep over SA-02f, the uncertain panel, W1 to W4 | No "Delivered", "Received", "not decided", "undecided", "unselected", "investigating", "Owner: SuperAdmin" | T |

V16 boundary statement for the record: proven failure → deliberate resend is served and proven (V16-5).
Continuing ambiguity → SuperAdmin authorization is not served; the page shows W1 as Core reports it (V16-3, V16-4).
Proven success or failure after investigation is not served; the page shows W2.

## 7. Implementation breakdown

### 7.1 Work units (disjoint files)

Phase A: U1 after WP-06 U0 and U2 and WP-08 U0 are integrated. Phase B: U2 after the WP-08, WP-11 phase 2, WP-06 U1
and WP-14 U5 integrations (any part whose package is not integrated binds that package's build instead). Phase C:
U3. The architect registers the gallery module, applies the shell member value and edits `DESIGN.md` once.

| Unit | Files (change or add) | Tests (add or update) | Gallery |
|---|---|---|---|
| **U1 SA-02f** | New `src/apps/staff/queues/delivery.ts` (route `admin.queues.delivery`, the two opt. reads, section builders, §2.2 and §2.3 tables); W1 to W4 rows added to `src/apps/shared/delivery/words.ts` (WP-08 U0 file, after its integration) | New `test/unit/web/delivery-closure-queue.test.ts` (sections by owner kind and reason code; part counts; cap line and link; one read unavailable → only that section; no "Nothing waits" with an unavailable read; follow-up owner words incl. null; "Assign an operator" only for kind `superadmin`; no form element on the page; forbidden phrases) | `scripts/dev/gallery/delivery-closure.ts` |
| **U2 Amendments** | `src/apps/staff/delivery/send-page.ts` (AM-W19-02 to -04), `src/apps/shared/delivery/ta-pages.ts` (AM-W19-05), the SA-04d renderer of WP-11 U7 (AM-W19-02 SuperAdmin words), `src/apps/staff/home/inbox.ts` (AM-W19-06), `src/apps/staff/views/monitors.ts` (AM-W19-07) | Update `test/unit/web/send-page.test.ts`, `ta-delivery.test.ts`, `decision-inbox.test.ts`, `reporting-pages.test.ts` with the amended states | — |
| **U3 Wiring and sweep** | `src/apps/staff/instance.ts` (register U1's route), `src/web/route-inventory.ts` (one GET entry), the one-value shell member | `test/unit/web/routes.test.ts` (inventory count and id); new `test/unit/web/superadmin-delivery-controls.test.ts` (§7.2); BFF test: SuperAdmin POST to the operator delivery paths → not found, nothing recorded | — |

Test file names carry no package identifier.

### 7.2 SuperAdmin control sweep

`test/unit/web/superadmin-delivery-controls.test.ts` renders SA-02f, SA-04a, SA-04d and SA-01 with fixtures that
hold an uncertain send, a failed send, an inactive operator and every boundary code, and asserts: no `form` whose
action is a delivery, completion or operator path; no button or link labelled with a control of §2.0 "No SuperAdmin
operator privilege"; W1 and W3 texts present where §2 places them.

### 7.3 Existing tests that pin current behaviour

None of WP-19's own: SA-02f is new. The amendments change tests that WP-08, WP-06, WP-11 and WP-14 add; the current
`test/system/delivery.test.ts` texts of the three boundary codes are already changed by WP-08 U5.

## 8. Register updates (`COMMAND-COVERAGE.md`)

No command row changes. §5.1 stays "WP-19 0". Proposed note under §6.1: "WP-19 builds SA-02f (read only:
`views.admin_applications`) and the boundary statements W1 to W3; the SuperAdmin resend authorization, the
investigation record and bounded delivery ownership have no served command (STOP-W19-01 to -03)."

## 9. Findings, open questions, deviations and STOP items

Ranks follow PRI-20260930-01. P0 blocks the main path or risks irreversible harm; P1 goes to the architect under
LD-12, then to Max's end review; P2 is parked.

### 9.1 Findings worked in this design

| ID | Rank | Finding | Scenario (likelihood) | Design |
|---|---|---|---|---|
| F-W19-01 | P1 | SA-02 has no "Delivery and closure ownership" view (UI-PLAN SA-02; UX §6.2); WP-06 §2.2.5 defers it here. A SuperAdmin sees boundary waits only as counts | An operator is suspended after recording an outcome; the SuperAdmin sees "Operator no longer active" on Assignment but no list of results waiting on delivery or of uncertain emails, and cannot tell which duty waits (high once Send result exists; medium now) | SA-02f |
| F-W19-02 | P1 | WP-08 §2.10 row 4 reads "Owner: SuperAdmin" for a resend authorization that has no command | A SuperAdmin reads the owner line, looks for the control on SA-04d, finds none, and the operator waits (medium once uncertain sends exist) | AM-W19-01, W1 |
| F-W19-03 | P1 | The uncertain panel does not say that the investigation result cannot be recorded; an operator may use a manual email record as a proof of arrival | The operator records a manual email for the uncertain send and believes the duty is closed; completion does not count it (medium) | AM-W19-02, W2 |
| F-W19-04 | P2 | WP-08 row 3 shows the follow-up owner of the pending answer even when that answer is about another duty (K5 order) | An artifact incident is open; the panel names the incident's owner as the email's follow-up (low) | AM-W19-03 |
| F-W19-05 | P2 | SA-01 group 13 and Monitors item 4 say "wait on a result send" for a count that includes uncertain emails (K8) | A SuperAdmin reads 3 sends waiting; one is an uncertain email that needs other handling (low) | AM-W19-06, -07 |
| F-W19-06 | P2 | SA-01 group 12 shows an all-time count of uncertain sends as if open (K1, K8) | A completed application's uncertain send keeps the count at 1 forever (low) | AM-W19-06 |
| F-W19-07 | P2 | TA-07r "Email with the result" says "No email sent" when the only emails hold a replaced version | The travel agent reads "No email sent" while an uncertain email of the earlier file may have arrived (low) | AM-W19-05 |
| F-W19-08 | P2 | OP-06 offers a resend of a failed send with no hint that another send is uncertain | The travel agent receives the files twice (low) | AM-W19-04 |
| F-W19-09 | P2 | Today `DLV_MESSAGES.uncertain_email_handling_unselected` says "how to handle that is not decided yet" (`src/apps/shared/delivery/pages.ts:124`) | — | Already fixed by WP-08 F-W08-01 (U0, U5); WP-19 adds no second text |

### 9.2 Open questions for the architect

| ID | Rank | Question | Concrete scenario | Recommendation |
|---|---|---|---|---|
| Q-W19-01 | P1 | SA-02f as a new Work queues member at `/admin/queues/delivery`, or a saved view on SA-04l | A SuperAdmin looks under Work queues for the delivery duties UI-PLAN names there and finds only a filter elsewhere | New member (UI-PLAN SA-02 view; one GET route; LD-03 new path) |
| Q-W19-02 | P1 | V15 proof writes on `lane-ui`: suspend syn-operator-3 while it holds F, reassign F, restore syn-operator-3 | Without the suspension the owner-gap row is proven only by a fixture; with it, a failed teardown leaves syn-operator-3 suspended for later proofs | Approve with conditions: run tag; restore in the same run; the PM checks syn-operator-3 is active at the end; fallback T if restore needs a second SuperAdmin step that fails |
| Q-W19-03 | P2 | Use `tm harness deliver-email` on `lane-ui` for a visible email row | Only `synthetic_accepted` is reachable with the seeded addresses; `failed` or `uncertain` needs a new `fail+`/`uncertain+` travel agent account | No: email states by test (V16-3 to -9) |
| Q-W19-04 | P2 | A navigation count on the new member | The Assignment count already counts inactive-operator rows; a second count double-counts them | No count |
| Q-W19-05 | P2 | Bundle STOP-W19-01 to -03 into the CMD-44 (Send result) Kind 2 proposal | Built separately, a resend authorization would exist before any production send can be uncertain, and the bounded ownership would own a send that does not exist | Yes: one proposal note to the orchestrator (next free P number) |
| Q-W19-06 | P2 | Codex design review for WP-19 | WP-19 has no command; LD-13 asks a design review only for packages that change money, access, filing or delivery state | Code review only |

### 9.3 Deviation register

| ID | Deviation | Protocol effect |
|---|---|---|
| D-W19-01 | New GET SA-02f `/admin/queues/delivery` and one Work queues member | New route and inventory entry; no form |
| D-W19-02 | WP-19 carries no command (register §6.1) and proves V16 to its boundary by test for every email state | None |
| D-W19-03 | SA-02f rows name the follow-up owner by role, not by name (the list read has no names) | None |

### 9.4 STOP items

| ID | Kind (DECISIONS §3) | What | Why the UI needs it | Criterion check | Without it |
|---|---|---|---|---|---|
| STOP-W19-01 | Kind 2, P2 | A SuperAdmin command that authorizes the resend of an `uncertain` send, with actor and reason recorded, then queues a new attributed send with the full checks (OD §4; UX §5.3; V16) | "Continuing ambiguity requires attributed SA authorization and full fresh send checks" | Kind 2 gate: new behaviour; the UI has no vote. Inventory §5 group C note already names it | W1 on OP-06, SA-04d and SA-02f; Core refuses the resend (K2) |
| STOP-W19-02 | Kind 2, P2 | A command that records the investigation result of an `uncertain` send (proven success or proven failure, with evidence) | OD §4 "Proven success → record successful delivery; proven failure → … resend"; today `uncertain` is terminal (K1) | Kind 2: a new state transition and fact | W2; the send stays uncertain; only task-recorded `failed` sends can be resent |
| STOP-W19-03 | Kind 2, P2 | Bounded SuperAdmin delivery ownership of an unassigned delivery duty (OD §2; DECISIONS OC-04; UX §2.3, §10.1) | V15 "explicit bounded delivery ownership" | Kind 2: a new policy action and command; inventory §4 item 2 lists it | W3; route SA-03a / SA-03c (served) |
| STOP-W19-04 | Kind 1, P2 | Email sends by state across applications for a SuperAdmin (`failed` without resend, `uncertain`), with as-of | SA-02f cannot list failed sends or uncertain sends hidden behind an earlier blocker (K4, K8) | 1: facts exist (`dlv_email_sends`). 2: removes one delivery-page read per application (client-side join of up to 200 reads). 3: SuperAdmin scope, as-of. 4: subject "email sends" | SA-02f by Core's pending reason; SA-04d per application |
| (STOP-W08-05) | Kind 1, P2 | Provider correlation and `result_code` (for example `restore_boundary`) on `dlv.delivery_page.emails` | UX §5.3 "safe provider/message correlation" | As WP-08 | Attempt times only |

Rank reason for STOP-W19-01 to -03: in production no email is sent (K10), so no uncertain send and no unassigned
send duty can arise before CMD-44 is built. Revisit trigger: the CMD-44 proposal is taken up (Q-W19-05).

No STOP item blocks the WP-19 main path. No P0 item is open in this design.
