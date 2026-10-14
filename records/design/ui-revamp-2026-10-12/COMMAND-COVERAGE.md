# Command coverage register (LD-07)

Lane: `ui-revamp-2026-10-12`. Owner: the Principal Technical Architect. Written 12 October 2026 by a read-only research worker. Status: draft for the architect. Writing style: ASD-STE100 at about 75%.

Purpose. Decision LD-07 says every served Core command gets a page in the rewrite, or goes to Max as a hide decision. This register lists all 144 commands and the page where each will live. The architect keeps it up to date per work package.

| Input | Identity |
|---|---|
| Product code | lane clone at commit 102e4c9 (`COMMANDS` in `src/contracts/commands.ts`) |
| Route map (RM) | `research/route-map.md`, SHA-256 1e822c601f90dda5…, §2 routes and §3.2 commands |
| Surface inventory | `SURFACE-INVENTORY-2026-10-10.md`, SHA-256 2f9c71a527c80071…, §3 (CMD-1 to CMD-72) and §5 (57 commands with no plan row) |
| UI plan | `UI-PLAN.md`, SHA-256 75256bfd7e6d929a…, §3 pages, §7 commands, §12 work packages, §14 additions |
| Bulk plan | `BULK-UPLOAD-UI-PLAN.md`, SHA-256 6c574a4eaf9e39c7…, §1 and §2 |
| Decisions | `DECISIONS-2026-10-10.md`, SHA-256 a2c935f72cd4f5e9…, §1.5 (OC-09, RF-07) |
| Lane plan | `PLAN.md`, SHA-256 87a105f07d5291c8…, §3 (work packages) and §4 (LD-04 to LD-07); working-tree copy, internal HEAD 52adc40 with uncommitted edits |

## 1. Count check

- Core defines **144** commands. I loaded `COMMANDS` from `src/contracts/commands.ts` at 102e4c9 and listed its keys: 144. RM §3.2 lists the same 144 names (the set difference is empty). This register has 144 rows, one per name, no duplicates, sorted by name. Every name matches the code.
- By kind: **138 served**, **2 deliberate boundary** (always refused), **4 parked boundary** (always refused). Total boundaries: 6, as inventory §0 says.
- By plan row: 87 commands are named by a plan command row (85 served and the 2 deliberate boundaries CMD-44 and CMD-48). 9 more are named in a note under a plan row (inventory §5 group A) and 2 under read model RM-A7 (`iam.start_support_view`, `iam.end_support_view`). 46 have no plan row (§5 groups B 12, C 9, D 10, E 11, F 4). 87 + 11 + 46 = 144. Inventory §5 counts 57 = 11 + 46.
- Every one of the 144 commands has at least one POST route today (RM §3.2 and §2 agree route by route). No command is without a route.
- Three byte releases (`dlv.retrieve_document`, `dlv.retrieve_selection`, `dlv.retrieve_for_review`) are not Core commands. They are outside the 144. Section 4 lists them so the rewrite does not lose the download duty.

## 2. How to read the register

- **Plan row.** `CMD-nn` is a row of inventory §3. `(§5 group A)` marks a command that the inventory names only in a note under that row. `none (§5 group X)` marks a command with no plan row.
- **Kind.** `served`, `deliberate boundary` (CMD-44, CMD-48: Core always answers the boundary) or `parked boundary` (inventory §5 group F). A boundary command is not a hide candidate. The page shows the boundary as Core answers (LD-04).
- **Current routes.** The POST route ids that send the command today (RM §2, §3.2).
- **Target page(s).** Plan page ids (UI-PLAN §3, BULK §1). For a command with a plan row, the pages are those of UI-PLAN §7. For a §5 command, the page is the most fitting plan page; the inventory's "likely home" guides the choice. A parenthesis names the part of the page. `NO PAGE` means no plan page fits.
- **Work package.** For a command with a plan row, the WP whose command list in UI-PLAN §12 names it. For a §5 command, or a row that no WP names, the WP that first builds the part of the target page that carries the command. This is a judgement of this register; the architect MAY move it. `unassigned` means the command has no page.
- **Pages that belong to no WP.** SA-10 is in no WP of UI-PLAN §12. TA-13 and SH-02 are in no §12 table; PLAN.md §3 puts TA-13 in WP-03 and SH-02 in WP-01. This register follows PLAN.md §3.

## 3. Register

| Command | Plan row | Kind | Current routes | Target page(s) | WP | Note |
|---|---|---|---|---|---|---|
| `cat.approve_transition` | none (§5 group E) | served | `admin.catalogue.transition` | SA-05t | WP-13 | Core refuses an item outside the application; route path sits under /admin/applications |
| `cat.assign_impact_reviewer` | none (§5 group E) | served | `admin.catalogue.impact_reviewer` | SA-05m (impact review page) | WP-13 | Reviewer for an impact assessment |
| `cat.bind_declaration` | none (§5 group E) | served | `admin.catalogue.bind` | SA-05 (definition and binding) | WP-02 | Binds a declaration to an offering |
| `cat.create_country` | none (§5 group E) | served | `admin.catalogue.country_create` | SA-05 (offering list, country level) | WP-02 | Listing a country approves no route |
| `cat.create_offering` | none (§5 group E) | served | `admin.catalogue.offering_create` | SA-05 (offering list) | WP-02 | Starts the offering lifecycle |
| `cat.decide_impact_items` | none (§5 group E) | served | `admin.catalogue.impact_decision` | SA-05n (one page per item) | WP-13 | Decides items of an impact assessment |
| `cat.draft_declaration` | none (§5 group E) | served | `admin.catalogue.declaration_draft` | SA-05 (definition and binding) | WP-02 | Declaration draft of an offering |
| `cat.edit_baseline` | CMD-60 | served | `admin.catalogue.baseline_create`, `admin.catalogue.baseline_edit` | SA-05 (effective business values) | WP-02 | Two routes: new baseline and edit of an open one |
| `cat.preview_baseline` | CMD-60 | served | `admin.catalogue.baseline_preview` | SA-05 (publication impact preview) | WP-02 | Preview before publish |
| `cat.preview_declaration` | CMD-60 | served | `admin.catalogue.declaration_preview` | SA-05 (publication impact preview) | WP-02 | Preview before publish |
| `cat.publish_baseline` | CMD-60 | served | `admin.catalogue.baseline_publish` | SA-05; SA-09 | WP-02 | Publish business values |
| `cat.publish_declaration` | CMD-60 | served | `admin.catalogue.declaration_publish` | SA-05; SA-09 | WP-02 | Publish business values |
| `cat.record_owner_approval` | CMD-61 | served | `admin.catalogue.owner_approval` | SA-05 | WP-02 | Structural approval from outside the product |
| `cat.request_impact_recheck` | none (§5 group E) | served | `admin.catalogue.recheck` | SA-05b (offering page) | WP-13 | Reruns the impact assessment of an offering |
| `cat.retire_declaration_draft` | none (§5 group E) | served | `admin.catalogue.declaration_retire` | SA-05c (declaration page) | WP-13 | Retires an unbound draft |
| `cat.retire_offering` | none (§5 group E) | served | `admin.catalogue.retire` | SA-05x `/admin/catalogue/offerings/:id/retire` | WP-13 | Ends the offering lifecycle |
| `cat.set_country_listing` | none (§5 group E) | served | `admin.catalogue.country_listing` | SA-05 (offering list, country level) | WP-02 | Listing gates group creation on TA-13 |
| `core.apply_held_correction` | none (§5 group B) | served | `ta.applications.reapply_correction` | TA-07 (pending-work panel) | WP-17 | Correction held while a filing was unknown; released by non-filing evidence |
| `core.assign` | CMD-56 | served | `admin.applications.assign` | SA-03 | WP-06 | Single assignment; Gate 1 must be met or excepted |
| `core.assign_selection` | CMD-56 | served | `admin.assignments.round_robin`, `admin.assignments.selection` | SA-03 | WP-06 | K-BATCH; two routes (selection, round robin); confirm carries the previewed plan |
| `core.authorize_external_act` | CMD-36 | served | `ops.applications.authorize_act` | OP-04 | WP-07 | K-EXT; confirmIrreversible is a real field |
| `core.authorize_unresolved_completion` | CMD-59 | served | `admin.applications.unresolved_completion` | SA-09u kind `unresolved_outcome`; linked from SA-04a and SA-01 group 12; records the outcome and closes reconciliation; does not complete the case | WP-11 | Records authorization and future owner; does not complete the case |
| `core.check_completion` | CMD-48 | deliberate boundary | `admin.delivery.completion_check` | OP-07 | WP-08 | Boundary shown as Core answers (LD-04); route is on the admin surface; no form posts it today |
| `core.close_group` | none (§5 group B) | served | `ta.groups.close` | TA-05 (CC-02) | WP-17 | Posted today from the group page; TA-05 would be WP-03 |
| `core.correct_from_evidence` | CMD-58 | served | `admin.applications.correct_from_evidence` | SA-09o kind `correct_outcome`; SA-09e kind `correct_fields` (identity, residence, the served `fields` shape); linked from SA-04a | WP-11 | Two shapes (outcome, fields); no WP command list names it |
| `core.correct_identity` | none (§5 group B) | served | `ta.applications.correct_identity` | TA-09; TA-07 (returned case) | WP-03 | Needs same-person evidence; the page posts only changed fields |
| `core.create_group` | CMD-6 | served | `ta.groups.create` | TA-13; TA-04; BU-P01 | WP-03 | Form moves to the TA-13 task page; country must be listed |
| `core.decide_assistance` | CMD-52 | served | `admin.applications.assistance_decision` | SA-09h kinds `assistance_approve`, `assistance_decline`; listed on SA-01, SA-02b | WP-09 | Approve or decline a help request; reason required |
| `core.decide_deferral` | CMD-54 | served | `admin.deferrals.decide` | SA-02; SA-09 | WP-17 | Review date optional |
| `core.decide_price_increase` | CMD-14 | served | `ta.applications.price_decision` | TA-07 | WP-17 | Travel agent accepts or declines a proposed price |
| `core.decide_transition` | none (§5 group B) | served | `ta.applications.transition_decision` | TA-07t `/ta/applications/:id/changed-terms` (accept and decline) | WP-13 | Travel agent decides on changed terms after an offering change |
| `core.edit_draft` | CMD-9 | served | `ta.applications.edit` | TA-09 | WP-03 | A section is a subset of fields |
| `core.edit_travel_dates` | CMD-7 | served | `ta.groups.travel_dates` | TA-13 (edit mode); TA-05 | WP-17 | TA-13 itself is built in WP-03; the recheck preview lands in WP-17 |
| `core.end_deferral` | none (§5 group C) | served | `ops.applications.end_deferral` | OP-02 | WP-17 | Operator ends a deferral with a note |
| `core.flag` | CMD-34 | served | `ops.applications.flag` | OP-03 | WP-07 | Blocks filing and packet release until answered |
| `core.formal_return` | CMD-32, CMD-33 | served | `ops.applications.return` | OP-03; OP-02 ("Return for TA review") | WP-07 | One command for CMD-32 and CMD-33; WP-07 builds OP-03r with both labels ("Return to TA", "Return for TA review"); WP-09 designs the ending path on OP-02 and the assistance effect text |
| `core.grant_gate_exception` | CMD-72 | served | `admin.applications.grant_exception` | SA-09 | WP-06 | Gate 1 first; the Gate 2 decision uses the same page in WP-07 |
| `core.hand_back` | none (§5 group B) | served | `ta.applications.hand_back` | TA-08 (returned submitted case) | WP-03 | Returns a returned submitted case to the operator; no WP names this panel |
| `core.link_dependency` | none (§5 group B) | served | `ta.applications.link_dependency` | TA-07l `/ta/applications/:id/dependencies`; TA-07 and TA-09 link to it | WP-10 | WP-10 by title only; TA-07 is not in its page list |
| `core.propose_deferral` | CMD-35 | served | `ops.applications.propose_deferral` | OP-02 | WP-17 | Justification and proposed review date |
| `core.propose_price_increase` | none (§5 group D) | served | `admin.applications.price_increase` | SA-04 (decision on SA-09) | WP-17 | SuperAdmin proposes; the travel agent decides (core.decide_price_increase) |
| `core.reassign` | CMD-57 | served | `admin.applications.reassign` | SA-03c | WP-06 | Reason required; preview then receipt |
| `core.recheck_travel_dates` | none (§5 group C) | served | `admin.applications.travel_recheck`, `ops.applications.travel_recheck` | OP-02; SA-04 | WP-17 | Same command from ops and admin routes |
| `core.record_applicant_withdrawal` | CMD-17 | served | `ops.applications.applicant_withdrawal` | OP-02 | WP-17 | Operator records the applicant request; evidence reference required |
| `core.record_assistance_entry` | CMD-31 | served | `ops.applications.assistance_entry` | OP-02a `/ops/applications/:id/assistance-entry` | WP-09 | Identity changes need same-person evidence |
| `core.record_forecast` | none (§5 group C) | served | `ops.applications.forecast` | OP-02 | WP-17 | Current forecast stays separate from the original estimate |
| `core.record_operational_withdrawal` | CMD-17 | served | `admin.applications.operational_withdrawal` | SA-04 (decision on SA-09) | WP-17 | Evidence reference and reason required |
| `core.record_outcome` | CMD-42 | served | `ops.case_work.cancelled` | OP-05 | WP-08 | Cancelled-outcome path (route ops.case_work.cancelled) |
| `core.release_packet` | CMD-40 | served | `ops.applications.release_packet` | OP-04r `/ops/applications/:id/packet/release` (K-STD; the download is K-BYTE) | WP-10 | Available action (LD-05, OC-09); K-BYTE |
| `core.report_problem` | CMD-13 | served | `ta.applications.report_problem` | TA-07p `/ta/applications/:id/report-problem`; bulk pages link to it and never post it (S-W09-01) | WP-09 | Creates a hold; allowed while assigned, not returned |
| `core.request_assistance` | CMD-12 | served | `ta.applications.request_assistance` | TA-07; TA-08; TA-09; BU-P06 | WP-03 | Separate from submit |
| `core.request_withdrawal` | CMD-17 | served | `ta.applications.withdraw` | TA-07 | WP-17 | Travel agent request |
| `core.resolve_hold` | none (§5 group C) | served | `ops.applications.resolve_hold` | OP-02r `/ops/applications/:id/holds/:holdId/resolve` | WP-09 | Resolves a problem-report or an answered flag hold; Core refuses a return hold (the travel agent hands it back or submits) |
| `core.resolve_protection_mark` | none (§5 group D) | served | `admin.protection_marks.resolve` | SA-09m kind `protection_mark` (CC-04; no subject); linked from SA-04a and SA-01 group 15 | WP-11 | Mark must belong to the named application; plan has no protection-mark queue |
| `core.respond_flag` | none (§5 group D) | served | `admin.applications.respond_flag` | SA-09f kind `flag_response` (CC-04); listed on SA-01, SA-02c | WP-09 | Plan SA-02 views and SA-09 decision kinds omit flags |
| `core.revoke_gate_exception` | CMD-72 (§5 group A) | served | `admin.gate_exceptions.revoke` | SA-09 | WP-06 | SA-09 MUST offer revoke |
| `core.submit` | CMD-11 | served | `ta.applications.submit` | TA-08; BU-P10 | WP-03 | Carries the confirmations and quoted price shown; WP-04 builds BU-P10 |
| `core.unlink_dependency` | none (§5 group B) | served | `ta.applications.unlink_dependency` | TA-07l `/ta/applications/:id/dependencies`; TA-07 and TA-09 link to it | WP-10 | WP-10 by title only; TA-07 is not in its page list |
| `dlv.acknowledge_notice` | CMD-15 | served | `admin.notices.acknowledge`, `ops.notices.acknowledge`, `ta.notices.acknowledge` | TA-10; TA-07; OP-10 (operator notices); SA-10 (SuperAdmin notices) | WP-08 | Three routes; recipient only; TA-10 is built in WP-08; SA-10 is in no WP |
| `dlv.manual_resend` | none (§5 group C) | served | `ops.delivery.resend` | OP-06 | WP-08 | From a failed send only; an uncertain send refuses it |
| `dlv.queue_document_email` | CMD-44 | deliberate boundary | `ops.delivery.document_email` | OP-06 | WP-08 | Boundary shown as Core answers (LD-04); no form posts it today |
| `dlv.record_direct_external` | CMD-41, CMD-45 | served | `ops.delivery.direct_external` | OP-06e `/ops/applications/:id/direct-external` (a delivery evidence kind of an outcome, not a provider handoff) | WP-10 | Delivery made by an external party; claims no TravelMudra-held result |
| `dlv.record_handover` | CMD-40, CMD-45 | served | `ops.delivery.handover` | OP-06h `/ops/applications/:id/handovers` (packet and physical) | WP-10 | Packet handover names the released packet |
| `dlv.record_manual_email` | CMD-46 | served | `ops.delivery.manual_email` | OP-06 | WP-08 | Attributed record; never system-verified |
| `doc.associate` | none (§5 group B) | served | `ops.documents.associate`, `ta.documents.associate` | TA-09 (required-document slot); TA-07; BU-P06; OP-02 (ops route) | WP-03 | Links an existing group version to a requirement; two routes (ta, ops) |
| `doc.confirm_classification` | none (§5 group B) | served | `ta.documents.classification` | TA-09 (evidence results); TA-07 (document rows) | WP-03 | Posted today from the document-version page, which the plan lacks |
| `doc.replace_version` | CMD-10 | served | `ta.documents.replace` | TA-09; TA-07; BU-P06 ("Replace document") | WP-03 | Multipart; WP-04 builds the BU-P06 control |
| `doc.requeue_bulk` | none (§5 group D) | served | `admin.documents.requeue_bulk` | SA-08b `/admin/documents/requeue` | WP-14 | Bulk requeue of failed checks; posted today from /admin/documents/queue |
| `doc.requeue_check` | none (§5 group D) | served | `admin.documents.requeue` | SA-08c `/admin/documents/:dov/requeue` | WP-14 | Requeue of one failed check; posted today from /admin/documents/queue |
| `doc.resolve_extraction` | none (§5 group B) | served | `ta.documents.resolve_extraction` | TA-09 (evidence results); TA-07; BU-P06 | WP-03 | Travel agent types the MRZ fields and attests; host page missing in plan |
| `doc.upload_for_application` | CMD-10 | served | `ops.documents.upload`, `ta.documents.upload` | TA-09; BU-P06; OP-02a (assistance upload, ops route, built in WP-09; OP-02 if the seam overlap is not confirmed) | WP-03 | Multipart; two routes (ta, ops) |
| `iam.activate_account` | CMD-65 | served | `admin.accounts.activate` | SA-06 | WP-02 | Account status change; reason required |
| `iam.approve_account` | CMD-64, CMD-65 | served | `admin.accounts.approve` | SA-06 | WP-02 | Second person for a SuperAdmin account (K-2P) |
| `iam.approve_elevation` | CMD-66 | served | `admin.elevations.approve` | SA-06 (elevations); SA-09 (second approval) | WP-15 | Two-person (K-2P); refused while audit is unhealthy |
| `iam.cancel_email_change` | CMD-19 (§5 group A) | served | `ta.account.email.cancel` | TA-12 | WP-15 | Cancel step; plan text has two verify steps only |
| `iam.confirm_email_change` | CMD-19 | served | `ta.account.email.confirm` | TA-12 | WP-15 | One call per mailbox proof; completion ends all sessions |
| `iam.create_account` | CMD-64 | served | `admin.accounts.create` | SA-06 | WP-02 | New SuperAdmin account needs a second SuperAdmin (K-2P) |
| `iam.create_group_read_grant` | CMD-68 | served | `admin.grants.create` | SA-06 | WP-15 | Group-scoped read grant; chosen date becomes an instant |
| `iam.decline_account` | CMD-65 | served | `admin.accounts.decline` | SA-06 | WP-02 | Account status change; reason required |
| `iam.decline_elevation` | CMD-66 (§5 group A) | served | `admin.elevations.decline` | SA-06 (elevations); SA-09 | WP-15 | Two-person (K-2P); SA-06 MUST offer decline |
| `iam.end_support_view` | none (§5 group A; read model RM-A7) | served | `admin.support_view.end` | SH-01 (support-view banner, SH-R09); SA-06 | WP-01 | Banner form on every support-view page; one of two POSTs a support view may send |
| `iam.open_enrolment` | CMD-4 | served | `sign_in.enrol.open` | PUB-02 (staff path) | WP-01 | Takes the enrolment code from a SuperAdmin |
| `iam.request_elevation` | CMD-66 | served | `admin.accounts.elevation` | SA-06 | WP-15 | Two-person (K-2P) |
| `iam.request_staff_otp` | CMD-3 | served | `sign_in.staff.request` | PUB-02 (staff path) | WP-01 | Bot check; K-OTP |
| `iam.request_ta_otp` | CMD-1 | served | `sign_in.ta.request` | PUB-02 | WP-01 | Bot check (ALTCHA); states PUB-02-S8 to S10 |
| `iam.reset_credentials` | CMD-67 | served | `admin.accounts.reset_credentials` | SA-06 | WP-15 | Reason required; no secret shown |
| `iam.restore_account` | CMD-65 | served | `admin.accounts.restore` | SA-06 | WP-02 | Account status change; reason required |
| `iam.revoke_grant` | CMD-68 | served | `admin.grants.revoke` | SA-06 | WP-15 | Reason required |
| `iam.set_accounting_grant` | none (§5 group D) | served | `admin.accounts.accounting_grant` | SA-06 | WP-15 | Accounting grant for an operator; OP-10 shows the B29 boundary to the holder |
| `iam.sign_out` | CMD-5 | served | `sign_in.sign_out` | SH-01 (account menu); TA-12, OP-10, SA-10 ("sign out everywhere") | WP-01 | Both BFFs; server-made key; scope this or all; SA-10 is in no WP |
| `iam.staff_enrol` | CMD-4 | served | `sign_in.enrol.confirm` | PUB-02 (staff path) | WP-01 | Enrolment revision travels in _rev.enrolment |
| `iam.staff_sign_in` | CMD-3 | served | `sign_in.staff.verify` | PUB-02 (staff path) | WP-01 | Emailed code and authenticator code in one form |
| `iam.start_email_change` | CMD-19 | served | `ta.account.email.start` | TA-12 | WP-15 | Travel agent only; staff accounts have no email change |
| `iam.start_support_view` | none (§5 group A; read model RM-A7) | served | `admin.support_view.start` | SA-06 | WP-15 | Opens read-only TA and operator pages on the staff origin; reason required |
| `iam.suspend_account` | CMD-65 | served | `admin.accounts.suspend` | SA-06 | WP-02 | Operator duties listed; last-SuperAdmin acknowledgement field |
| `iam.verify_ta_otp` | CMD-2 | served | `sign_in.ta.verify` | PUB-02 | WP-01 | Session issued once, never on a replay |
| `intake.abandon` | none (§5 group B) | served | `ta.intake.abandon` | BU-P06; BU-P08; BU-P05 (rows scope) | WP-18 | Scope attempt conflicts with BU-P04 "No Cancel import"; Max decides that scope |
| `intake.answer_question` | CMD-22, CMD-23 | served | `ta.intake.answer` | BU-P03; BU-P06 | WP-04 | Last blocking answer starts the import (CMD-24) |
| `intake.correction_upload` | CMD-27 | served | `ta.intake.correction` | BU-P07 | WP-05 | Multipart; bot check; opens a new attempt in the chain |
| `intake.dispose_incident` | CMD-26, CMD-53 | served | `admin.intake.incident_dismiss`, `ta.intake.incident_dispose` | BU-P06 (travel agent abandons the row); SA-02 and SA-09 (SuperAdmin dismisses) | WP-18 | Two routes (ta, admin); SuperAdmin reason required |
| `intake.resume` | none (§5 group B) | served | `ta.intake.resume` | BU-P04 (paused banner) | WP-04 | Resumes only an intake paused by revoked access |
| `intake.start_bulk` | CMD-20, CMD-21 | served | `ta.intake.start_bulk` | BU-P02 | WP-04 | Multipart; bot check; source limits |
| `intake.start_individual` | CMD-8 | served | `ta.intake.start_individual` | TA-09 (entry from BU-P01) | WP-03 | Multipart; one command creates the application(s) |
| `ops.approve_launch` | CMD-63 | served | `admin.launch.approve` | SA-05; SA-09 | WP-02 | Launch scope for an offering |
| `ops.assign_incident_reviewer` | CMD-55 | served | `admin.incidents.reviewer` | SA-08v `/admin/incidents/:id/reviewer` | WP-14 | Reviewer gets no filing authority |
| `ops.classify_failure` | none (§5 group D) | served | `admin.failures.classify` | SA-08f `/admin/failures/incident/:id/classify` (incident subjects only on a page) | WP-14 | Posted today from the admin incident page; local, shared or unresolved |
| `ops.close_incident` | CMD-49 | served | `admin.incidents.close`, `ops.incidents.close` | OP-08i, SA-08i (on the incident page; ends every duty; no reopen) | WP-14 | Two routes (ops, admin); follows resolve |
| `ops.confirm_artifact_association` | CMD-43 | served | `ops.incidents.confirm_association` | OP-05 | WP-08 | Reviewer attests each compared field |
| `ops.expand_launch_scope` | none (§5 group D) | served | `admin.launch.expand` | SA-05 (launch and admission) | WP-02 | The "expand" half of the plan row "Launch / expand" |
| `ops.lift_suspension` | CMD-63 | served | `admin.launch.lift` | SA-05j kind `lift` | WP-13 | Restores the approved scope only |
| `ops.link_original` | CMD-51 (§5 group A) | served | `ops.custody.link` | OP-09l `/ops/applications/:id/originals/:org/share` (same operator only; no unlink) | WP-12 | Links an original to another application |
| `ops.open_incident` | CMD-47 | served | `admin.incidents.open`, `ops.incidents.open` | OP-08o `/ops/applications/:id/incidents/new`; SA-08o `/admin/incidents/new` (`artifact_association` not offered) | WP-14 | Two routes (ops, admin); other incident kinds are WP-14 |
| `ops.post_disclosure_notice` | CMD-49 | served | `admin.incidents.notice`, `ops.incidents.notice` | OP-08n, SA-08n `…/incidents/:id/notices` (one per account; variant by Core's role of the account) | WP-14 | Two routes (ops, admin) |
| `ops.record_act_evidence` | CMD-37, CMD-38, CMD-41 | served | `ops.case_work.act_evidence` | OP-04 | WP-07 | K-EXT; filing_unknown is the uncertain path |
| `ops.record_artifact` | CMD-10 | served | `ops.case_work.artifact` | OP-05 | WP-08 | Multipart; can replace an artifact for an incident |
| `ops.record_effort_sample` | none (§5 group C) | served | `ops.case_work.effort` | OP-02 | WP-07 | Operator effort; the SuperAdmin observation route D117 is unregistered |
| `ops.record_existing_work_treatment` | CMD-62 | served | `admin.launch.treatment` | SA-05j kinds `suspension_treatment`, `withdrawal_treatment` | WP-13 | K-STD |
| `ops.record_incident_evidence` | CMD-49 | served | `admin.incidents.evidence`, `ops.incidents.evidence` | OP-08e, SA-08e `…/incidents/:id/evidence` | WP-14 | Two routes (ops, admin) |
| `ops.record_launch_plan` | none (§5 group D) | served | `admin.launch.plan` | SA-05 (launch and admission) | WP-02 | Precedes launch |
| `ops.record_official_result` | CMD-42 | served | `ops.case_work.official_result` | OP-05 | WP-08 | Multipart; optional artifact |
| `ops.record_original_movement` | CMD-51 | served | `ops.custody.movement` | OP-09m `/ops/applications/:id/originals/:org/movement` | WP-12 | Holder "unknown" needs the uncertainty statement |
| `ops.record_original_receipt` | CMD-51 | served | `ops.custody.receipt` | OP-09n `/ops/applications/:id/originals/new` | WP-12 | Possession attested; evidence |
| `ops.record_original_return` | CMD-51 | served | `ops.custody.return` | OP-09t `/ops/applications/:id/originals/:org/return` (only under an owner-approved return policy; partial stays partial) | WP-12 | Only under an owner-approved return policy |
| `ops.record_readiness` | CMD-30 | served | `ops.case_work.readiness` | OP-02 | WP-07 | Binds to the basis digest the page showed |
| `ops.record_reconciliation_attempt` | CMD-39 | served | `ops.case_work.reconciliation` | OP-04 | WP-07 | The conclude field records the act evidence in the same command |
| `ops.record_work_step` | none (§5 group C) | served | `ops.case_work.work_step` | OP-02 (readiness checklist) | WP-07 | Work steps exist as facts; no plan command records them |
| `ops.reject_artifact_association` | CMD-43 (§5 group A) | served | `ops.incidents.reject_association` | OP-05 | WP-08 | OP-05 MUST offer reject |
| `ops.report_wrong_recipient` | CMD-50 (§5 group A) | served | `ops.incidents.disclosure` | OP-08w `/ops/applications/:id/disclosure` (blocks the file for good; one per file; SuperAdmin route missing, WP-14 STOP-W14-02) | WP-14 | Replaces the dropped Block-version row (CMD-50) |
| `ops.request_packet_build` | CMD-40 (§5 group A) | served | `ops.case_work.packet_build` | OP-04p `/ops/applications/:id/packet` (build and rebuild with `supersedePacketId`) | WP-10 | Builds or rebuilds a packet; release is core.release_packet |
| `ops.resolve_incident` | CMD-49 (§5 group A) | served | `admin.incidents.resolve`, `ops.incidents.resolve` | OP-08r, SA-08r `…/incidents/:id/resolve` | WP-14 | Two routes (ops, admin); resolve with evidence, then close |
| `ops.start_work` | none (§5 group C) | served | `ops.case_work.start_work` | OP-02 | WP-07 | Assigned operator starts work on the case |
| `ops.suspend_offering` | CMD-63 | served | `admin.launch.suspend` | SA-05j kind `suspend` | WP-13 | Existing-work treatment prompt follows |
| `ops.withdraw_offering` | CMD-63 | served | `admin.launch.withdraw` | SA-05j kind `withdraw` | WP-13 | Irreversible; acknowledgement required |
| `ops.withdraw_readiness` | none (§5 group C) | served | `ops.case_work.withdraw_readiness` | OP-02 | WP-07 | Withdraws a recorded readiness |
| `pay.approve_ceiling_increase` | CMD-71 | served | `admin.finance.increase_approve` | SA-07; SA-09 | WP-07 | Two-person (K-2P); refused while audit is unhealthy |
| `pay.decline_ceiling_increase` | CMD-71 (§5 group A) | served | `admin.finance.increase_decline` | SA-07; SA-09 | WP-07 | Two-person (K-2P); reason required |
| `pay.exclude_fee` | none (§5 group F) | parked boundary | `admin.payments.fee_exclusion` | SA-07 (per-application money facts) | WP-16 | Boundary shown as Core answers; no form posts it today |
| `pay.lower_ceiling` | CMD-71 | served | `admin.finance.lower` | SA-07 | WP-07 | Page carries the ceiling basis it displayed |
| `pay.reassign_follow_up_owner` | none (§5 group D) | served | `admin.follow_up.reassign` | SA-07 (follow-up list and item) | WP-16 | Names an accountable SuperAdmin; reason required |
| `pay.record_refund` | none (§5 group F) | parked boundary | `admin.payments.refund` | SA-07 (per-application money facts) | WP-16 | Boundary shown as Core answers; no form posts it today |
| `pay.record_service_status` | CMD-69 | served | `admin.payments.record` | SA-07 | WP-06 | Same command corrects an entry (WP-16) |
| `pay.release_reservation` | none (§5 group F) | parked boundary | `admin.finance.reservation_release` | SA-07 (TA exposure: reservations) | WP-16 | Boundary shown as Core answers; no form posts it today |
| `pay.request_ceiling_increase` | CMD-71 | served | `admin.finance.increase_request` | SA-07 | WP-07 | Two-person (K-2P) |
| `pay.write_off` | none (§5 group F) | parked boundary | `admin.follow_up.write_off` | SA-07 (follow-up item) | WP-16 | Boundary shown as Core answers; no form posts it today |

## 4. Byte releases (outside the 144)

A byte release is not a Core command. A BFF asks Core to stream bytes. The route map lists these routes in the "Command posted" column of §2, so I list them here.

| Byte release | Current routes | Plan row | Target page(s) | WP | Note |
|---|---|---|---|---|---|
| `dlv.retrieve_document` | `ta.delivery.retrieve`, `ta.delivery.packet_retrieve`, `ops.delivery.retrieve`, `ops.delivery.packet_retrieve`, `admin.delivery.retrieve`, `admin.delivery.packet_retrieve` | CMD-18 (travel agent) | TA-07 ("Download result"); OP-02 (Application and documents; packets); SA-04 | WP-08 for TA-07; OP-02 and SA-04 by their WPs | Built as an available action (LD-05, OC-09). The plan names the travel agent only. The operator and SuperAdmin routes have no plan row. A SuperAdmin also passes purpose and reason. |
| `dlv.retrieve_selection` | `ta.selections.create`, `ops.selections.create` | none | TA-07; OP-02; the page "Download of several files" (`ta.selections.one`, `ops.selections.one`) has NO PAGE | WP-08 for TA-07 | The selection page has no plan page. Needs a page or a hide decision. |
| `dlv.retrieve_for_review` | `ops.incidents.review_copy` | none | OP-05 (artifact review); OP-08 | WP-08 | Reviewer copy of an artifact in an association incident. |

## 5. Summary

### 5.1 Commands per work package

| WP | Commands | Which |
|---|---|---|
| WP-01 | 8 | `iam.end_support_view`, `iam.open_enrolment`, `iam.request_staff_otp`, `iam.request_ta_otp`, `iam.sign_out`, `iam.staff_enrol`, `iam.staff_sign_in`, `iam.verify_ta_otp` |
| WP-02 | 20 | `cat.bind_declaration`, `cat.create_country`, `cat.create_offering`, `cat.draft_declaration`, `cat.edit_baseline`, `cat.preview_baseline`, `cat.preview_declaration`, `cat.publish_baseline`, `cat.publish_declaration`, `cat.record_owner_approval`, `cat.set_country_listing`, `iam.activate_account`, `iam.approve_account`, `iam.create_account`, `iam.decline_account`, `iam.restore_account`, `iam.suspend_account`, `ops.approve_launch`, `ops.expand_launch_scope`, `ops.record_launch_plan` |
| WP-03 | 12 | `core.correct_identity`, `core.create_group`, `core.edit_draft`, `core.hand_back`, `core.request_assistance`, `core.submit`, `doc.associate`, `doc.confirm_classification`, `doc.replace_version`, `doc.resolve_extraction`, `doc.upload_for_application`, `intake.start_individual` |
| WP-04 | 3 | `intake.answer_question`, `intake.resume`, `intake.start_bulk` |
| WP-05 | 1 | `intake.correction_upload` |
| WP-06 | 6 | `core.assign`, `core.assign_selection`, `core.grant_gate_exception`, `core.reassign`, `core.revoke_gate_exception`, `pay.record_service_status` |
| WP-07 | 14 | `core.authorize_external_act`, `core.flag`, `core.formal_return`, `ops.record_act_evidence`, `ops.record_effort_sample`, `ops.record_readiness`, `ops.record_reconciliation_attempt`, `ops.record_work_step`, `ops.start_work`, `ops.withdraw_readiness`, `pay.approve_ceiling_increase`, `pay.decline_ceiling_increase`, `pay.lower_ceiling`, `pay.request_ceiling_increase` |
| WP-08 | 10 | `core.check_completion`, `core.record_outcome`, `dlv.acknowledge_notice`, `dlv.manual_resend`, `dlv.queue_document_email`, `dlv.record_manual_email`, `ops.confirm_artifact_association`, `ops.record_artifact`, `ops.record_official_result`, `ops.reject_artifact_association` |
| WP-09 | 5 | `core.decide_assistance`, `core.record_assistance_entry`, `core.report_problem`, `core.resolve_hold`, `core.respond_flag` |
| WP-10 | 6 | `core.link_dependency`, `core.release_packet`, `core.unlink_dependency`, `dlv.record_direct_external`, `dlv.record_handover`, `ops.request_packet_build` |
| WP-11 | 3 | `core.authorize_unresolved_completion`, `core.correct_from_evidence`, `core.resolve_protection_mark` |
| WP-12 | 4 | `ops.link_original`, `ops.record_original_movement`, `ops.record_original_receipt`, `ops.record_original_return` |
| WP-13 | 11 | `cat.approve_transition`, `cat.assign_impact_reviewer`, `cat.decide_impact_items`, `cat.request_impact_recheck`, `cat.retire_declaration_draft`, `cat.retire_offering`, `core.decide_transition`, `ops.lift_suspension`, `ops.record_existing_work_treatment`, `ops.suspend_offering`, `ops.withdraw_offering` |
| WP-14 | 10 | `doc.requeue_bulk`, `doc.requeue_check`, `ops.assign_incident_reviewer`, `ops.classify_failure`, `ops.close_incident`, `ops.open_incident`, `ops.post_disclosure_notice`, `ops.record_incident_evidence`, `ops.report_wrong_recipient`, `ops.resolve_incident` |
| WP-15 | 11 | `iam.approve_elevation`, `iam.cancel_email_change`, `iam.confirm_email_change`, `iam.create_group_read_grant`, `iam.decline_elevation`, `iam.request_elevation`, `iam.reset_credentials`, `iam.revoke_grant`, `iam.set_accounting_grant`, `iam.start_email_change`, `iam.start_support_view` |
| WP-16 | 5 | `pay.exclude_fee`, `pay.reassign_follow_up_owner`, `pay.record_refund`, `pay.release_reservation`, `pay.write_off` |
| WP-17 | 13 | `core.apply_held_correction`, `core.close_group`, `core.decide_deferral`, `core.decide_price_increase`, `core.edit_travel_dates`, `core.end_deferral`, `core.propose_deferral`, `core.propose_price_increase`, `core.recheck_travel_dates`, `core.record_applicant_withdrawal`, `core.record_forecast`, `core.record_operational_withdrawal`, `core.request_withdrawal` |
| WP-18 | 2 | `intake.abandon`, `intake.dispose_incident` |
| WP-19 | 0 | — (keeps the delivery-ownership and uncertainty views of V15 and V16; its two commands moved to WP-08) |
| unassigned | 0 | — |
| **Total** | **144** | |

Observations. WP-02 carries 20 commands because the whole catalogue lifecycle (country, offering, declaration, baseline, bind, publish, launch) must work before an offering is admitted; UI-PLAN §12.1 names 5 for it. WP-17 carries 13 (timing, deferral, withdrawal, price decisions, notices). WP-05 carries 1 and WP-18 carries 2. WP-20 and WP-21 carry none.

### 5.2 NO PAGE or unassigned (to the architect)

| Command | Why | Proposal |
|---|---|---|
| `doc.requeue_check`, `doc.requeue_bulk` | Today they run from `/admin/documents/queue`. The plan has no page for the documents processing queue. SA-08 shows read-only degradation and has no work queue. | Add a page (an SA-08 section or a queue view), or Max decides to hide both. |
| `core.close_group` | The only fit is TA-05. Plan AD-06 and A-02 say no role has a Close-group command. Core serves it, and the group page has a "Close the group" confirmation today (route `ta.groups.close`). | Max decides: build it on TA-05 as a closure action, or hide it. |

Pages in no work package. SA-10 (Notices and account for the SuperAdmin) belongs to no WP of UI-PLAN §12. It carries two commands: `dlv.acknowledge_notice` (route `admin.notices.acknowledge`) and `iam.sign_out` (the "sign out everywhere" form). Put SA-10 in a WP (WP-15 is the nearest) or retire the page. TA-13 and SH-02 are in no §12 table; PLAN.md §3 assigns them (WP-03, WP-01).

Byte release page with no plan page (outside the 144): the "Download of several files" page for `dlv.retrieve_selection`.

### 5.3 Plan text that conflicts with or does not cover a served command

A page exists for each of these commands in the register. The plan text still conflicts with the command or omits it. The architect decides, or Max decides a hide.

| Command | Conflict or gap |
|---|---|
| `intake.abandon` | Scope `attempt` stops the whole intake (today: "Stop this intake"). BU-P04 says "No Cancel import". Scope `rows` fits BU-P06 and BU-P08. Max decides the attempt scope. |
| `pay.release_reservation`, `pay.exclude_fee`, `pay.write_off`, `pay.record_refund` | SA-07 says refund and write-off controls MUST NOT appear. Inventory §5 group F says SA-07 shows the boundary. This register assumes a boundary notice with no form. `accounts.home` lists the same boundaries and has no plan page. See 5.5. |
| `core.check_completion` | Only an admin route posts it. OC-05 says the contract adds no SuperAdmin completion control. The plan puts the boundary on OP-07 (operator). See 5.5. |
| `core.respond_flag`, `core.propose_price_increase`, `core.resolve_protection_mark` | SA-09 decision kinds and SA-02 views do not list them. `core.revoke_gate_exception` is also absent from the kind list; the inventory (CMD-72 note) requires it. Add all four to SA-09. |
| `doc.resolve_extraction`, `doc.confirm_classification` | They post today from the document-version page (`ta.documents.version`). The plan has no such page. The register puts them in the evidence sections of TA-09, TA-07 and BU-P06. |
| `cat.*` (17) and the 7 launch commands | SA-05 is one plan page. Today the lifecycle spans more than 20 routes under `/admin/catalogue/**` and `/admin/launch`. The sub-page structure is open. |
| `core.correct_from_evidence` | No WP command list in UI-PLAN §12 names "Record exceptional correction" (CMD-58). The register uses WP-11, the first WP that builds SA-04. |
| `core.hand_back`, `core.apply_held_correction`, `core.decide_transition`, `core.link_dependency`, `core.unlink_dependency` | They are TA-07 panels (returned case, held correction, changed terms, dependency). No WP names those panels. The register uses WP-09, WP-17, WP-13, WP-10 and WP-10. |
| `dlv.acknowledge_notice` | The plan names TA-07 and TA-10. The code also posts it from the operator and SuperAdmin notice pages (OP-10, SA-10). |

### 5.4 Commands whose target page differs from the page that posts them today

The table groups commands by the page that hosts their form today. All other commands stay on the plan page that matches their current page. For example, the other operator case commands (`ops.start_work`, `ops.record_readiness` and the rest of the OP-02 set) stay on OP-02. A command that the plan records on SA-09 keeps its list page too (SA-02, SA-05, SA-06 or SA-07); only the decision form moves to SA-09. "No plan page" means the plan has no page for the host.

| Posted today from | Commands | Target page(s) |
|---|---|---|
| Travel agent application page (`ta.applications.detail`) | `core.submit` | TA-08 and BU-P10 (review and submit page) |
| Same page | `core.edit_draft`, `core.correct_identity` | TA-09 (task list); TA-07 for a returned case |
| Groups list (`ta.groups.list`) | `core.create_group` | TA-13 (task page), also TA-04 and BU-P01 |
| Group page (`ta.groups.detail`) | `core.edit_travel_dates` | TA-13 (edit mode), also TA-05 |
| Same page | `core.close_group` | none (NO PAGE) |
| Add-applicants page (`ta.intake.new`) | `intake.start_individual`; `intake.start_bulk` | TA-09; BU-P02 |
| Intake attempt page (`ta.intake.attempt`) | `intake.answer_question`; `intake.correction_upload`; `intake.abandon`; `intake.resume` | BU-P03 and BU-P06; BU-P07; BU-P06, BU-P08 and BU-P05; BU-P04. One page becomes five. |
| Intake incident page (`ta.intake.incident`) | `intake.dispose_incident` (travel agent) | BU-P06 |
| Document-version page (`ta.documents.version`, no plan page) | `doc.resolve_extraction`, `doc.confirm_classification` | TA-09, TA-07 and BU-P06 sections |
| Documents queue (`admin.documents.queue`, no plan page) | `doc.requeue_check`, `doc.requeue_bulk` | none (NO PAGE) |
| Operator case page (`ops.applications.detail`) | `core.formal_return`, `core.flag` | OP-03 |
| Same page | `core.authorize_external_act`, `ops.record_act_evidence`, `ops.record_reconciliation_attempt`, `ops.request_packet_build`, `core.release_packet` | OP-04 |
| Same page | `ops.record_official_result`, `core.record_outcome`, `ops.record_artifact` | OP-05 |
| Same page | `ops.record_original_receipt`, `ops.record_original_movement`, `ops.record_original_return`, `ops.link_original` | OP-09 |
| Admin case page (`admin.applications.detail`) | `core.assign`, `core.reassign` | SA-03 |
| Same page | `core.grant_gate_exception`, `core.revoke_gate_exception`, `core.decide_assistance`, `core.respond_flag`, `core.decide_deferral` | SA-09 (lists on SA-02) |
| Same page | `core.propose_price_increase`, `core.record_operational_withdrawal`, `core.authorize_unresolved_completion`, `core.correct_from_evidence`, `core.resolve_protection_mark` | SA-09 (decision form); SA-04 lists and links |
| Admin delivery page (`admin.delivery`) | `core.check_completion` | OP-07 (operator page; the surface changes) |
| Operator and SuperAdmin notice pages (`ops.notices.one`, `admin.notices.one`) | `dlv.acknowledge_notice` | OP-10 and SA-10 (SA-10 is in no WP) |
| Route `admin.catalogue.transition` (path under `/admin/applications/:applicationId`) | `cat.approve_transition` | SA-05 impact assessment sub-page |
| Banner on every page | `iam.end_support_view` | SH-01 banner (no move) |

### 5.5 The six deliberate-boundary POST routes

These routes send a command only to be refused with an `unavailable_*` category. Nothing runs. I searched the page code for the route ids, the path constants and the form actions: no form posts any of the six routes. The pages show the action as unavailable with a coded reason. The rewrite MUST keep a boundary notice on the page below. Whether the POST route itself stays is a separate decision (a hand-made POST still reaches it).

| Route id | Command | Kind | Page that shows it today | Page that MUST show it | Source |
|---|---|---|---|---|---|
| `ops.delivery.document_email` | `dlv.queue_document_email` | deliberate boundary | `ops.delivery`, boundary section ("Send the result by email", disabled) | OP-06 | LD-04; CMD-44. Wording MUST NOT say the owner still has to choose the trigger (OD §2, §3). |
| `admin.delivery.completion_check` | `core.check_completion` | deliberate boundary | `ops.delivery` and `admin.delivery`, boundary section ("Run the completion check"); callout on the operator case page | OP-07 (operator). If the admin delivery view stays, SA-04's Delivery view shows the same read-only state. | LD-04; CMD-48. OC-05: no SuperAdmin completion control, yet only an admin route posts it. |
| `admin.finance.reservation_release` | `pay.release_reservation` | parked boundary | `admin.finance.ta`, section "Reservations"; also the accounts surface page (`accounts.home`) | SA-07 (TA exposure: reservations, "exposure decrease") | B-03, B-04; inventory §5 group F. `accounts.home` has no plan page (B29: no Accounts dashboard). |
| `admin.payments.fee_exclusion` | `pay.exclude_fee` | parked boundary | `admin.payments.application`, section "Not available in this release" | SA-07 (per-application money facts); OP-04 for the individual B28 case | B-03; CMD-70 note. |
| `admin.payments.refund` | `pay.record_refund` | parked boundary | `admin.payments.application`, same section; also `accounts.home` | SA-07 (per-application money facts) | B-04. SA-07: no refund control. Notice only. |
| `admin.follow_up.write_off` | `pay.write_off` | parked boundary | `admin.follow_up.item`, section "Not available in this release"; also `accounts.home` | SA-07 (follow-up item) | B-04. SA-07: no write-off control. Notice only. |

### 5.6 Limits of this register

- It covers POST commands. Read pages with no plan page of their own (for example the document-version and group-documents pages, the selection download page, `accounts.home`, the operator catalogue pages and the public-site status page) need a route-level register. I did not check every read page.
- The WP column for a §5 command is a judgement (section 2). The "Posted today from" grouping in 5.4 follows the form action and re-render reads in RM §2 and a spot check of page code; I did not open every page.
- Policy modules (who may run each command) were not read. The register does not state roles beyond the command comments.


## 6. Architect dispositions (12 October 2026)

The architect decides the items of §5.2 and §5.3 under LD-12. Each disposition becomes a design input of its
package. A disposition that hides a served command would be Max's decision; none of the items below hides one.

| ID | Item | Disposition | Why | Package |
|---|---|---|---|---|
| CC-01 | `doc.requeue_check`, `doc.requeue_bulk` | Home: a SuperAdmin view "Document checks that could not finish" under Incidents & audit (SA-08). The path `/admin/documents/queue` stays (LD-03). | The agent guide §3 names this queue; it is degradation work, which SA-08 owns (UX §6.2 Incidents & audit: diagnostic and reporting degradation). Hiding a served command is not the architect's call. | WP-14 |
| CC-02 | `core.close_group` | Home: TA-05 Group detail, "Close the group", with the closure facts that Core reports (`closure`) beside it. Core decides; a refusal names the missing condition. | The target specification states the closure conditions and no actor (BS B25); it does not forbid this command. Plan AD-06 and A-02 predate the inventory and are reference, not target. Core serves the command with its own guards. | WP-17 |
| CC-03 | SA-10 Notices and account (SuperAdmin), carrying `dlv.acknowledge_notice` (admin route) and sign-out | Assigned to WP-15 with TA-12 and OP-10. | Same page family; P1 in the plan. Sign-out itself is in WP-01 (shell). | WP-15 |
| CC-04 | SA-09 decision kinds | Add four kinds: flag response (`core.respond_flag`, WP-09), price-increase proposal (`core.propose_price_increase`, WP-17), protection-mark resolution (`core.resolve_protection_mark`, WP-11), gate-exception revocation (`core.revoke_gate_exception`, WP-06). | AD-13 makes SA-09 the one decision surface; served decisions belong there. | WP-06, WP-09, WP-11, WP-17 |
| CC-05 | `doc.resolve_extraction`, `doc.confirm_classification` | Home: the document detail view reached from the evidence rows of TA-07 and TA-09 (the existing document-version path stays). | Evidence rows (CMP-02) need a detail with the resolution action; the plan names the rows, not the detail. | WP-03 |
| CC-06 | TA-07 panels for `core.hand_back`, `core.apply_held_correction`, `core.decide_transition`, `core.link_dependency`, `core.unlink_dependency` | Accepted as the register assigns them: WP-09, WP-17, WP-13, WP-10, WP-10. | Each is a served travel-agent action on the application workspace. | as listed |
| CC-07 | `core.check_completion` (deliberate boundary, admin route today) | OP-07 shows the completion boundary (LD-04). No SuperAdmin page shows a completion control. The admin route stays registered with no form. | OD §3 and OC-05: no SuperAdmin completion request and no force-complete. | WP-08 |
| CC-08 | `pay.release_reservation`, `pay.exclude_fee`, `pay.write_off`, `pay.record_refund` | SA-07 shows each as a policy boundary notice (reason, owner, route) with no form control. The boundary routes stay registered. | UI-PLAN SA-07: these controls MUST NOT appear; D5 requires the reason, owner and route of an unavailable action. A notice satisfies both. | WP-16 |
| CC-09 | `intake.abandon` with scope `attempt` | Decided at the WP-18 design review, after reading the command's effect. Allowed only if it stops unresolved work and keeps every accepted draft, and the label does not read as "Cancel import". Otherwise only the `rows` scope is offered and the attempt scope goes to Max. | BU §5.2 forbids a Cancel import that implies rollback; it does not forbid stopping unresolved work. | WP-18 |
| CC-10 | `dlv.retrieve_selection` ("Download of several files") | Home: the result and delivery section of TA-07. | The download belongs to the application workspace (UX §4.2 Account and §4.1 "retrieve eligible bytes"). | WP-08 |
| CC-11 | `accounts.home` (`/accounts`) and the accounting grant | Decided in the WP-01 design (AD-12: an accounting grant is not a context). | Shell question. | WP-01 |

| CC-12 | WP-06 commands on the old SuperAdmin case page | The WP-06 commands leave `admin.applications.detail`: the page keeps the facts and links to SA-03a, SA-03c, SA-09g and SA-09r. Each command has one host page for each use. | One decision page per kind; a second form for the same decision would carry different wording. | WP-06 |
| CC-13 | WP-08 commands on the operator case page and the incident page | The WP-08 commands leave those pages; the pages keep the facts and link to OP-05 and OP-05r. `ops.open_incident` has no OP-05 control (Core refuses result-file incident kinds for operators) and goes to WP-14. | One host page per command. | WP-08, WP-14 |
| CC-14 | WP-10 commands on the operator case page, OP-06 and TA-07 | The WP-10 commands leave those pages; each has one host page (TA-07l hosts link and unlink; OP-04p, OP-04r, OP-06h, OP-06e). UI-PLAN's "Record provider handoff" is WP-07's act command for `provider_handoff`; "Record provider filing evidence" has no Core command (WP-10 STOP-W10-02, to Max in P-15). | One host page per command. | WP-10 |
| CC-15 | WP-11 commands on the old SuperAdmin case page | The WP-11 commands leave it; SA-04a is rebuilt on the kept path (OP-02 layout without operator actions) and keeps facts and links; one host page per command use (SA-09u, SA-09o, SA-09e, SA-09m); the carried WP-17 forms stay on SA-04a until WP-17. Note: `core.apply_held_correction` has no staff route (edge allowlist only; WP-11 STOP-W11-03). | One host page per command use. | WP-11 |
| CC-16 | WP-12 commands on the operator case page | The WP-12 commands leave OP-02 "Delivery & originals"; each has one host page (OP-09n, OP-09m, OP-09t, OP-09l) under the application's Originals page OP-09. The rail destination "Originals" stays hidden until Core serves an originals register read (WP-12 STOP-W12-01). | One host page per command. | WP-12 |
| CC-17 | WP-14 commands on the incident pages, the case page, OP-02 "Delivery & originals" and the documents queue rows | Each command has one host page per surface; close stays on the incident page. The SuperAdmin incident page has no association decision form (S-09). | One host page per command. | WP-14 |
| CC-18 | WP-13 commands on the launch page, the offering page, the impact assessment page and TA-07 | Launch-control commands become SA-05j decision kinds; retirement gets SA-05x; impact item decisions SA-05n; transitions SA-05t; the travel agent's changed terms TA-07t (accept and decline); recheck (SA-05b), draft discard (SA-05c) and reviewer (SA-05m) stay in place. | One host page per command. | WP-13 |
| CC-19 | WP-16 money pages | The correction leaves the SA-07a disclosure for SA-07c; the owner change leaves the
| CC-20 | WP-15 account and access forms on SA-06c and the elevation list | The four access actions (request elevation, reset the second factor, accounting grant, start a support view) get task pages; SA-06c holds facts and links; elevation decisions on SA-09s (`approve`, `decline`); grants on SA-06n (give, the group shown first) and SA-06x (revoke) with receipts on the grant page; operator and SuperAdmin notice acknowledgement on OP-10 and SA-10 (CC-03). | One host page per command. | WP-15 |
| CC-21 | WP-17 forms on TA-05, TA-07, OP-02 and SA-04a | The WP-17 forms leave TA-05, TA-07, OP-02 and SA-04a for task pages beside their kept POST paths (TA-05c, TA-07d, TA-07w, TA-07c, OP-02f, OP-02d, OP-02e, OP-02w) and five SA-09 kinds; the travel-date recheck stays in place on OP-02 and SA-04a (no fields). One host page per command use. | One host page per command use. | WP-17 |
item page for SA-07r. The four money boundaries are notices with reason, owner and route on the page of their object
and never a control, also not a disabled button; their POST routes stay and answer SA-07b. `accounts.home` is retired
per Q-W16-04 after its notices are rehomed. | One host page per command. | WP-16 |

After these dispositions no served command is without a page.

### 6.1 Package moves decided in the package reviews (applied to §3 and §5.1 on 13 October 2026)

| Command | From | To | Decision |
|---|---|---|---|
| `core.hand_back` | WP-09 | WP-03 (TA-08) | WP-03 Q-W03-06 |
| `core.reassign` | WP-12 | WP-06 (SA-03c) | WP-06 Q-W06-01 |
| `core.flag`, `ops.record_reconciliation_attempt` | WP-09, WP-11 | WP-07 | WP-07 Q-W07-02, Q-W07-03 |
| `dlv.manual_resend`, `dlv.record_manual_email` | WP-19 | WP-08 (OP-06) | WP-08 Q-W08-01 |
| `dlv.acknowledge_notice` | WP-17 | WP-08 (TA-10); the operator and SuperAdmin notice routes stay with WP-15 (CC-03) | WP-08 Q-W08-02 |
| `ops.open_incident` | WP-08 | WP-14 | CC-13 |
| `core.close_group` | unassigned | WP-17 (TA-05; WP-03 carries the existing form) | CC-02 |
| `doc.requeue_check`, `doc.requeue_bulk` | unassigned | WP-14 (SA-08) | CC-01 |
