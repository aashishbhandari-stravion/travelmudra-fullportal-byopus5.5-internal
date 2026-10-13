# WP-03 acceptance checklist: groups, individual intake, submit

| Field | Value |
|---|---|
| Lane | `ui-revamp-2026-10-12` |
| Work package | WP-03 Groups, individual intake, submit (UI-PLAN §12.1; lane PLAN §3) |
| Author | Principal Product Manager (Claude subagent), 12 October 2026 |
| Decision owner | Principal Technical Architect of the lane (LD-12) |
| Status | Run on `lane-ui` at 0e38a04 on 13 October 2026 (section 7). 180 items: 133 Pass, 15 Fail, 31 Not proven, 1 Deferred; V05 and V02 Pass. Findings in section 8 (no P0; P1: F-01, F-02, F-03). Corrections of 13 October 2026 below. |
| Product base | lane branch `ui-revamp-2026-10-12` at 102e4c9; internal records at 694e007 |
| Installation | `lane-ui`: edge http://127.0.0.1:4650 (travel-agent pages); staff http://127.0.0.1:4652 (proof set-up through the existing SuperAdmin and operator pages only, LD-02) |
| Writing style | ASD-STE100 at about 75% (STY-20261003-01) |

## Corrections of 13 October 2026

The accepted decisions after the code review changed the rows below (`WP-03.md` §6.1, findings R-01 to R-06, and §6.2;
`WP-03-fixes-notes.md` §2 to §6b; lane commits dc313f6 and 0e38a04). They bind the run of section 7. No other row
changed. Where an unchanged row names an older receipt title or a precheck rule, this table governs.

| Row | Change | Source |
|---|---|---|
| Every form row; A48, A62, A63, A64, A65, A132 | Input is sent whole. A value that the command's contract does not take is refused before any command, at its field, with every value kept. No handler cuts or drops a value. A multipart text field over the field limit is refused whole ("Request too large"), never cut. Open: the shared intake handler still cuts the TA-09c applicant text fields and the bulk service list (S-14, `WP-03.md` §6.1 R-01, P-22 item 3). | R-01; `WP-03.md` §6.2; fixes notes §2; 0e38a04 |
| A77 to A80, A82, A83 (document detail) | The resolve and classification forms show only while every application the version is in force for allows changes. Otherwise the page shows no form and the reason; a refused decision whose form is no longer offered stays on the page read only. | R-02; fixes notes §3 |
| A13, A61, A64, A67, A69, A76, A78, A79, A129 | Where the operation summary cannot tell commands apart (group created; details saved; identity corrected; file received, replaced or linked; details resolved; type confirmed), the receipt title is the neutral "Request recorded" with the facts as "Current". The titles "Group created", "Application details saved", "Identity details corrected", "File received" and C-09's "Replacement file received" are superseded. Distinct titles stay: "Travel dates changed", "Drafts created", "Help requested", "Application submitted", "Handed back". | R-03; fixes notes §4 |
| A06, A108 (navigation count) | A delivery read that is unavailable makes the rail count "Unavailable", never a number. | R-04; fixes notes §5 |
| A83, A110, A112 (support view); design §2.0 "Support view" | A support view shows no action control at all, not even a disabled one. The owner and the step stay. | R-05; fixes notes §6 |
| A114, A115, A120, A122; design §5.4 "Checkbox after a refusal" | Every statement is unchecked after every refusal (C1, C2 and C5). | R-06; fixes notes §6 |
| A42, A48 | Surname, given names and date of birth are required on TA-09c (Core keeps no draft without them). "At least one name part is required" is withdrawn; the earlier optional-names deviation (U5) is reversed. Each empty required detail is named at its field. | `WP-03.md` §6.2; fixes notes §6b |
| A180 (new, §2.2) | TA-13b with a travel date before today's India date: the page shows a review with the exact dates and an unchecked acknowledgement; nothing is sent until the acknowledgement equals exactly those dates; the acknowledgement never reaches Core. Recorded as **Partly met** by decision: Core itself still accepts past dates on `core.edit_travel_dates` until the Core fix. | `WP-03.md` §6.2 (O-01); fixes notes §6a; WP-17 review R-01 |

Section numbering: this run records the result per item in section 7 ("Sign-off", the table per item) and the
findings in section 8. Section 6 keeps the questions of the draft.

## Corrections of 12 October 2026

The independent design review (lane `research/reviews/WP-03-design-review.md`, findings R-01 to R-14) and the
architect's decisions and amendments (`WP-03.md` §3 and §4.1, C-01 to C-14; `PLAN.md` LD-14) changed the rows below.
No other row changed. The questions of section 6 are answered in `WP-03.md` §3; section 6 is kept as asked.

| Row | Finding or decision | Change |
|---|---|---|
| A13 | R-11; design §2.4; C-03 | No review step and no "Change" links; the receipt on TA-05 names the group only when the operation returns it. |
| A14 | R-12; Q-W03-17; WP-01 A-02 | Raw identical replay, used-form conflict, browser Back (fresh form; a second group is accepted) and rejected-form refresh are separate cases. |
| A19 | R-11; D-W03-07 | The receipt shows the dates now and the recheck sentence; no earlier dates and no affected list. |
| A24 | R-11; D-W03-07, P-09 | State filter only; the country filter is deferred. |
| A32 | R-11; D-W03-06; Q-W03-09 | Sections, not tabs; the carried close form shows while the group is open. |
| A49 | R-10; C-10 | Edge refusals for format and size; an offering-narrowed format is tested by the processing verdict on the row, with the draft kept. |
| A57 | R-12 | Raw replay, used-form conflict, Back with the duplicate-scope check, rejected-form refresh and lost acknowledgement are separate cases. |
| A59 | R-11; C-11 (design §1.6) | Closed task-state set of design §1.6; sections of design §4.2; "Not checked here" for a submitted case. |
| A60 | R-11; P-09 | Context band facts; the service mode is deferred; price and estimate are not on this section. |
| A61 | R-11; D-W03-14; C-03 | TA-09d fields (passport type, residence, nationality, declared fields); one "Save"; the receipt is checked. |
| A64 | R-04; C-04 | Evidence never prechecked; the receipt shows the values now; identical replay and changed-content conflict tested. |
| A69 | R-01, R-09; C-01, C-09 | `_rev.association`; "Replacement file received" with pending checks; the earlier file stays until Core switches; stale, failed and shared-version cases. |
| A76 | R-09; C-09 | Receipt wording; the readiness re-check sentence. |
| A85 | R-11; D-W03-08, P-09 | View, progress and group filters; country, service and sort deferred. |
| A86 | R-11 | Filters return through the link state; no stored row position. |
| A95 | R-11; P-09 | Status rows of the design; service mode and country deferred. |
| A108 | R-05; C-05; LD-14 | Availability failures only; TA-08 follows A116; access refusals follow A179. |
| A112 | R-08, R-11; C-08; P-09 | Design anatomy; "who files" and mode deferred; draft wording marked in test installations; production needs approved text. |
| A116 | R-05; C-05 | No submission form while the evidence read is unavailable. |
| A123 | R-12 | Raw replay, browser Back, new key (command check) and rejected-form refresh are separate cases. |
| A124 | R-12 | Submission hidden only on the operation page; Core's check prevents a second submission. |
| A129 | R-03; C-03 | Expected resource id and command-specific summary; edited receipt addresses claim nothing. |
| A130 | R-12; WP-01 A-08 | A refused command leaves no record; the status page never shows a refusal or a stale comparison. |
| A131 | R-12; C-04; Q-W03-17 | Four cases separated; "Create group" has no business key. |
| A159 | D-W03-06 | TA-05 sections at 390 px, not a tab select. |
| §1.2 | Q-W03-06; C-01; C-06; Q-W03-08 | `core.hand_back` added; the replacement revision; the seal route noted; carried forms listed; set-up writes as tests. |
| §4 Part A | R-14 | V02 saves passport type "ordinary", residence, nationality and Travel purpose per application before submission (new step A3). |
| §4 Part H (V07 coverage) | R-13 | Coverage extended with A173 to A178. |
| §5 | R-11, R-13; C-05, C-08, C-09; LD-14 | Hand back moved into WP-03; deferred items listed (D-W03-06 to D-W03-09, D-W03-13, D-W03-14, P-09, DEP-1, DEP-2). |
| A173 to A176 (new, §2.10) | R-13; Q-W03-06 | Returned-draft submit; returned-submitted hand back: review and receipt, stale revision, identical replay; quote, window and operator unchanged. |
| A177, A178 (new, §2.6) | R-13 | Assignment or approved help arriving during an edit: forms removed, permitted unsent text kept in the page. |
| A179 (new, §2.11) | R-02; C-02 = LD-14 | An optional read refused for access renders the access page, not earlier facts. |
| A10 | Q-W03-16; P-09 | "Start an application" opens `/ta/groups`; no country or service preselected; preselection deferred. |
| A23 | D-W03-07; P-09 | Only the design's columns (country, dates, state, "[open] open of [total] applications"); counts by progress, import issues and next action deferred. |
| A33 | D-W03-06 | TA-05 "Applications" section, not a tab; breadcrumb "Groups › [group]". |
| A105, A120 | Q-W03-08 | Tests on fixtures, not staff-page writes on `lane-ui`. |
| §3 parts C, G, H and I | Q-W03-08 | Payment, assignment, forecast and new-price parts run as tests; the result rule changed accordingly. |
| §1.3 | R-13; LD-14 | A173 to A179 added to the state table. |
| V02 part D; A75, A103, A104 | Architect, 12 Oct 2026: setup writes allowed (assignment through the existing staff pages is setup, not the subject under test; WP-06 and WP-07 rebuild those pages) | Stay `L` on `lane-ui`; written as "Setup (existing staff pages): SuperAdmin records payment and assigns syn-operator-1". |

## 0. Inputs and conventions

### 0.1 Inputs

| Ref | Source | Identity | Sections used |
|---|---|---|---|
| UX | `TARGET_PRODUCT_UX_SPEC.md` (2026-10-05) | SHA-256 b45186887cdc37f6… | §2.1, §2.2, §2.3, §3.1 steps 1 to 5, §3.2 (Approved assistance, TA reports a problem, Withdrawn/suspended offering, Group end), §3.3, §4.1, §4.2, §4.3, §4.4, §7.3 (TA Home, Mobile), §7.4, §7.5, §8.2, §8.3, §9 C05 C07, §12 V02 V05 V07 V24 |
| BS | `BUILD_SPEC.md` (r2) | SHA-256 4a6fd90657b0723f… | B03, B06, B07, B10, B14, B15, B16, B17, B18, B19, B20, B21, B25, B33, B35 |
| PL | `../ui-plan-from-specs-2026-10-10/UI-PLAN.md` | SHA-256 75256bfd7e6d929a… | §A (AD-04, AD-06, AD-07, AD-10), §1, §2.1, §2.2, §2.3 (SH-R01 to SH-R12), §3.2 TA-01 TA-04 to TA-09 TA-13, §4.1 steps 2 to 5, §4.2 (Approved assistance, Group end), §5.2, §6.1, §6.2, §7 (K-STD and TA rows), §8.1, §10, §11, §14.2 |
| TR | `../../uat/2026-10-12-uat-pass1-triage.md` | SHA-256 792f98d552ad6af6… | §3.1 Q-7 (UAT-09 class A, P0), UAT-14 |
| UF | `../../uat/2026-10-12-max-uat-findings.md` | SHA-256 46169427ed80f21e… | TA entries: UAT-04, UAT-07, UAT-08, UAT-09, UAT-11, UAT-13, UAT-14 (bulk-only entries UAT-06, UAT-10, UAT-12 are WP-04) |
| CC | `COMMAND-COVERAGE.md` (this folder) | SHA-256 bb81dd73f9501114…; internal aa0e8a7 | §3 (11 WP-03 rows), §5.1, §5.4, §6 (CC-02, CC-05) |
| LP | `PLAN.md` (this folder) | internal 694e007 | §4 (LD-02, LD-03, LD-06, LD-07, LD-08, LD-11, LD-12), §7, §8 (S-01) |
| W1 | `WP-01.md` §3 and §4.1 (this folder) | internal 694e007 | Receipt without accepted time (P-02, A-04), lag-form freshness (LD-08), typed input kept on refusal (A-12), background refusal (A-01), back/forward restore (A-02), unresolved verification (A-07) |
| W2 | `WP-02.md` §3 (this folder) | internal 694e007 | Q-W02-10 ("Start an application" → TA-13 with the country), TA-03 reason texts, PM Q-02, Q-W02-04 (synthetic writes) |
| SC | `../execution-2026-10-12/SEAM-CONTRACT.md` | version 1 | §1 (shared route handlers), §2, §3.4 (code shown when its text is missing) |
| Code | lane repository | 102e4c9 | `src/modules/core/commands/groups.ts`, `submission.ts`, `drafts.ts`, `assignment.ts` (request help); `src/modules/intake/commands/start-individual.ts`, `domain/fields.ts`; `src/contracts/core.ts` (TA read models), `documents.ts`; `src/apps/edge/intake/routes.ts`; `src/apps/shared/core/ta.ts`; `src/apps/shared/views/ta.ts`; `catalogue/synthetic/catalogue.json`; lane `research/route-map.md` |

### 0.2 Conventions

- **Personas.** TA: `syn-ta-1` (main flows), `syn-ta-2` (isolation), `syn-ta-3` (blank state, if it still holds no
  group on `lane-ui`). SuperAdmin: `superadmin-1` stands for `syn-superadmin-1`. Operator: `syn-operator-1`.
  Keyboard-only user. Screen-reader user. Phone user (390 px wide). TA participants: people, not the harness (A151).
- **Where.** `L`: a person or the LD-11 harness shows it on `lane-ui`. `T`: an automated test in the lane repository
  shows it at the same commit; the run record names the test. `L+T`: both are required.
- **Sign-in codes (rule C).** As WP-01 §0.2. The LD-11 harness signs in. Nobody prints, logs, screenshots or stores a
  code or an authenticator key.
- **Copy.** Quoted text is draft copy (CR-09). Draft copy passes when the page states the same facts. The §11.3
  boundary sentence form is mandatory for an unavailable action: "[Action] is unavailable until [policy or evidence]
  is [approved / recorded]. Owner: [owner or 'not yet named']."
- **Prices.** The price shown is the value in rupees without paise ("₹3,500" for 350000 paise).
- **Dates and times.** Travel dates and estimate dates are calendar dates on the India basis (Asia/Kolkata); the page
  says so once per form or block ("India dates"). Every time carries "IST" (AD-10, CR-06).
- **Freshness.** LD-08 as amended: an authoritative read (`core.*`, `doc.*`, `intake.*` queries) shows "Read at [time]
  IST"; a projection (`views.*`, for example search) shows "Up to date when read at [time] IST", "Behind by [n] s when
  read at [time] IST" or "Freshness unavailable".
- **Viewports.** Wide 1440 × 900. Phone 390 × 844. Reflow checks add 320 px and 1280 px at 400% zoom.
- **Paths.** Existing paths and form actions stay (LD-03): TA-04 `/ta/groups`, TA-05 `/ta/groups/:groupId`, TA-06
  `/ta/applications` and `/ta/search`, TA-07 `/ta/applications/:applicationId`, document detail
  `/ta/documents/:versionId` (CC-05). New pages get new paths: TA-01 `/ta` (inventory T01), TA-08, TA-09 and TA-13 as
  the design names them (Q-07). An item names the page; the run record names the path used.
- **Pass rule.** WP-03 passes when every `L` item passes on `lane-ui` at the integrated ref, every `T` item has a
  named passing test at that commit, every axe item passes, and the V05 and V02 proofs (sections 3 and 4) pass. A
  failed item becomes a finding ranked P0, P1 or P2 with its scenario (PRI-20260930-01). An item that the architect
  marks "partly met" by a recorded decision (for example A118, P-02) passes with that note.
- **Preconditions on `lane-ui`.** WP-01 and WP-02 are integrated. The installation holds the synthetic seed of WP-02
  §0.3. The WP-02 V01 proof ran at least once, so the run-tagged proof offering "SYQ Tourist e-visa (WP-02 proof)" and
  the Synthetica Gamma group of step D11 exist (needed only for V05 Part H; otherwise Part H runs by test, Q-10). The
  harness holds the synthetic sample documents of §0.4 (Q-09). `superadmin-1` and `syn-operator-1` are active.
- **Data hygiene.** WP-03 MUST NOT change seeded offering values, launches or listings. It creates its own groups
  named "WP03 [run] …" and synthetic applicants only. It MUST NOT use Max's real passport set (test plan B.2) or any
  real person's data. The run record keeps identifiers (groups, applications, document versions, operation
  references) in the internal record only.

### 0.3 Synthetic offerings used by WP-03 (from the code at 102e4c9)

Every TravelMudra-filed seeded offering declares the same intake facts unless the table says otherwise
(`catalogue/synthetic/catalogue.json`):

| Fact | Declared value | Where it shows in WP-03 |
|---|---|---|
| Required documents | Passport: required, PDF/JPEG/PNG, 5 MB, identity document. Photograph: required, JPEG/PNG, 2 MB | TA-09 form and sections; TA-08 evidence |
| Validity checks | Passport valid at least 6 months after the travel return date; synthetic series check (passport number starts with S or P). Photograph at least 350 × 350 pixels | Evidence results (A71) |
| Declared form field | Travel purpose: required; one option ("tourism", or "business" for the paper business visa) | TA-09 applicant facts (A61) |
| Authority confirmation | One item, code `ta_confirms_details`, required, text version `syn-1`; no approved text exists (Q-04) | TA-08 (A114) |
| Submit checks | Mandatory documents present; identity evidence present | TA-08 (A116) |
| Travel-date rule | Submit 3 to 90 days before the travel start date (preparation-only: 5 days or more; provider: 4 to 60 days) | TA-08 (A117) |
| Estimate | 5 to 12 calendar days | TA-07, TA-08 (A97, A112) |
| Population | Indian ordinary-passport holders resident in India | TA-09 refusal (A53) |

| # (WP-02 §0.3) | Offering | Price | Use in WP-03 |
|---|---|---|---|
| 1 | SYN Tourist e-visa | ₹3,500 | V05 main case; V02 service A |
| 3 | SYN e-visa, fee paid with submission | ₹3,600 | V02 service B (a different price makes independence visible) |
| 5 | SYN Tourist visa preparation | ₹1,800 | Optional document display (Travel itinerary, optional) |
| 7 | SYN Provider visa (route not approved) | ₹4,100 | Not launched: never offered; refused when forced (A54) |
| 9 | SYX Tourist e-visa (Synthetica Beta) | ₹3,300 | Country check (A55) |
| — | SYQ Tourist e-visa (WP-02 proof), run-tagged | ₹3,450 after WP-02 D13 | V05 Part H only (price change), per Q-10 |

### 0.4 Synthetic sample documents (Q-09)

The harness holds, outside every repository: two synthetic passports with valid machine-readable lines (test plan
B.1 names `passport-asha-syntest.jpg` and `passport-ravi-syntest.jpg`, and the scan `passport-asha-syntest-scan.pdf`),
a front-page file and a back-page file of one synthetic passport (for TA-09-R1), `photo-placeholder.jpg` (at least
350 × 350 pixels), one photograph below 350 × 350 pixels, one PDF of 6 MB, and one GIF image. Every passport number
in a sample starts with S or P and is valid through the travel return date plus 6 months for the travel dates of
sections 3 and 4.

## 1. Scope

### 1.1 Pages

| Page | Host and path | Part in WP-03 |
|---|---|---|
| TA-01 Home | 4650 `/ta` (new; becomes the TA landing page; rail "Home") | Whole page |
| TA-13 Group setup | 4650, new path per design (create mode; edit mode) | Create group; edit travel dates (Q-08) |
| TA-04 Groups list | 4650 `/ta/groups` (rail "Groups") | Whole page |
| TA-05 Group detail | 4650 `/ta/groups/:groupId` | Context band, closure facts, Applications tab. The Imports and Intake issues tabs keep their existing content until WP-04 (LD-02). "Close the group" stays as it is until WP-17 (CC-02, Q-01). |
| TA-09 Individual intake | 4650, new path per design (Q-07); task list sections on the draft | Create draft; task list; sections; documents; TA-09-R1 and TA-09-R2 |
| Document detail view | 4650 `/ta/documents/:versionId` (existing path, CC-05) | Checks, extraction, resolve extraction, confirm classification |
| TA-06 Applications list | 4650 `/ta/applications`, `/ta/search` (rail "Applications") | Whole page, with search that keeps search text out of the address (SH-R06) |
| TA-07 Application workspace | 4650 `/ta/applications/:applicationId` | Header, status facts, action panel for draft and submit, help request, timing, evidence rows, the read-only notice for an assigned case. Other panels stay as they are until their packages (Q-01). |
| TA-08 Review and submit | 4650, new path per design; form action `/ta/applications/:applicationId/submit` stays | Whole page |

Read models: TA attention (page rule over `core.ta_applications` and delivery facts today), Group list
(`core.ta_groups`), Group detail (`core.ta_group`), Application list (`core.ta_applications`, `views.ta_applications`,
`views.search`), Application case TA scope (`core.ta_application`, `doc.application_evidence`), Draft intake
(`intake.start_page`, `core.ta_application`), document version (`doc.version_page`, `doc.group_versions`).

### 1.2 Command coverage (CC §5.1: 11 WP-03 commands, plus two)

| # | Command | Route id today | Page | Items |
|---|---|---|---|---|
| 1 | `core.create_group` | `ta.groups.create` | TA-13a create | A09 to A17 |
| 2 | `intake.start_individual` | `ta.intake.start_individual` | TA-09c create | A40 to A58 |
| 3 | `core.edit_draft` | `ta.applications.edit` | TA-09d Application details | A61, A62, A63, A72, A73, A75, A76, A177, A178 |
| 4 | `core.correct_identity` | `ta.applications.correct_identity` | TA-09i Identity details | A63, A64, A65, A177 |
| 5 | `doc.upload_for_application` | `ta.documents.upload` | TA-09f Documents | A66, A67, A68, A177 |
| 6 | `doc.replace_version` | `ta.documents.replace` | TA-09f Documents (the form carries `_rev.association`, C-01) | A69, A76 |
| 7 | `doc.associate` | `ta.documents.associate` | TA-09u Use a file already in this group | A70 |
| 8 | `doc.resolve_extraction` | `ta.documents.resolve_extraction` | Document detail (CC-05) | A78, A80, A82 |
| 9 | `doc.confirm_classification` | `ta.documents.classification` | Document detail (CC-05) | A79 |
| 10 | `core.request_assistance` | `ta.applications.request_assistance` | TA-07h Ask TravelMudra for help (linked from TA-07, TA-08, TA-09t) | A99, A100, A101, A126 |
| 11 | `core.submit` | `ta.applications.submit` | TA-08 | A112 to A125, A173 |
| + | `core.edit_travel_dates` (built in WP-03, design §1.4; CC row to be moved from WP-17) | `ta.groups.travel_dates` | TA-13b | A18 to A22 |
| + | `core.hand_back` (moved from WP-09 to WP-03, Q-W03-06) | `ta.applications.hand_back` | TA-08 returned mode | A174, A175, A176 |

All of them also: A129 (receipt checked against the operation, C-03), A130 (unresolved, by test), A131 (same
operation key, by test), A132 and A133 (refusal text). Every page that reads an optional block: A179 (LD-14).

The TA search uses the shell route kind "seal" (C-06): a POST that sends no Core command. It is not a command of this
table; A87 covers it.

Commands outside WP-03 that the proofs touch only as set-up: `pay.record_service_status` and `core.assign` (WP-06),
`core.record_forecast` (WP-17), `cat.publish_baseline` with a continuation for drafts (WP-02), and the operator's
formal return and the help decision (WP-07, WP-09). Per Q-W03-08 the payment, forecast and new-price parts run as
tests; staff-page writes on `lane-ui` need the architect's approval. Forms of later packages that the rebuilt TA-05
and TA-07 carry unchanged (design §1.5; carried-form test, design §9.2; A106): `core.close_group` (WP-17),
`core.report_problem` (WP-09), `core.request_withdrawal`, `core.decide_price_increase`, `core.apply_held_correction`
(WP-17), `core.decide_transition` (WP-13), `core.link_dependency`, `core.unlink_dependency` (WP-10), the result and
delivery section (WP-08), originals (WP-12) and the payment summary (WP-16).

### 1.3 State coverage

S1 (loading) does not apply: every WP-03 page is server-rendered. If the design adds a region that refreshes later
(for example evidence rows while checks run), S1 and the background-refusal rule A-01 apply, and the design names
the item. S5 applies only where a page reads a projection (`views.*`); the `core.*` lists are authoritative reads.

| Page | Page states | C1 validation | C2 rejected | C3 accepted | C4 unresolved | C5 stale |
|---|---|---|---|---|---|---|
| TA-01 | S2 A04; "nothing needs action" A05; S3 not applicable (no filter); S4 A06; S6 A179 (access lost mid-page); S7 A06 | — | — | — | — | — |
| TA-13 create | — | A11, A12 | A14 (used form), A15 | A13 | A16 | — |
| TA-13 edit | Closed group A20 | A20 | A20 | A19 | A22 | A21 |
| TA-04 | S2 A25; S3 A24; S4 A26, A27; S5 A23 (if a projection is used); S6 A29; S7 A26 | — | — | — | — | — |
| TA-05 | S2 A37; S4 A39; S6 A38, A179; S7 A39; closed A36; offering unavailable A35 | — | — | — | — | — |
| TA-09 create | Offering not selectable A41, A54 | A45, A48, A49 | A52, A53, A54, A55 | A50, A51 | A57 | A58 |
| TA-09 sections | Read-only (assigned) A75; assignment or approved help arriving mid-edit A177, A178 | A62, A64 | A63, A65, A68, A75, A177, A178 | A61, A64, A67, A69, A70 | A73 | A72 |
| Document detail | S6 A81, A179; support view A83 | A78 | A78, A79, A82 | A78, A79 | A130 | A80 |
| TA-06 | S2 A90; S3 A85; S4 A91; S5 A89; S6 A88, A179; S7 A91 | — | — | — | — | — |
| TA-07 | S4 A108; S6 A107, A179; S7 A108; assigned read-only A103 | — | A100, A104 | A99 | A101 | A101 |
| TA-08 | S4 A116; S6 A107, A179; offering unavailable A125; returned draft A173; returned submitted case (hand back) A174 | A115 | A116, A117, A123, A125 | A118, A173, A174 | A124, A176 | A120, A121, A122, A175 |

### 1.4 Max's UAT findings on WP-03 pages (TA role)

| Finding | What Max saw | WP-03 items | Note |
|---|---|---|---|
| UAT-09 | "The passport number has the wrong format." for a valid two-letter, six-digit Indian number | A45, A46, A47 | The rule fix is class A, P0, in the bulk lane (TR §3.1 Q-7). WP-03 owns the message (TA-09-R2). |
| UAT-14 | Pages and files of a passport are confusing | A43, A44 | TA-09-R1; the two-file shape depends on Q-02. |
| UAT-08 | "The verification did not pass" after a form stayed open | A56 | The individual form has no bot check; WP-03 proves that a long-open TA-09 form works. |
| UAT-13 | "See the reference code" with no code | A132, A133 | Every WP-03 refusal shows words, or the code itself when its text is missing (SC §3.4). |
| UAT-04 | No "New application" outside a group | A04, A25, A90 | Product decision (P2, Max decides later). WP-03 explains the group-first sequence; it builds no group-free entry. |
| UAT-07 | Services are not fixed at group creation | Out of scope (section 5) | Kind 2 change in the bulk lane. TA-13 builds no service choice until it lands (WP-02 Q-10). |
| UAT-11 | No overview of imports across groups | Out of scope (section 5) | WP-04 after P-01. |
| UAT-01 (pattern) | Back to a used form gives an unclear refusal | A14, A57, A123 | Same pattern on WP-03 forms: a replay gives the original result; a changed used form offers a fresh form in one action. |

## 2. Acceptance checklist

### 2.1 TA-01 Home

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP03-A01 | TA (`syn-ta-1`) | 4650 sign-in, then TA-01 `/ta` | Sign in. Read where you land. Read the rail. | The TA lands on Home, not on Applications. The rail shows "Home" first, marked as the current item. One `h1` names the page. The freshness line shows the read kind of LD-08. | L | PL §2.2, §3.2 TA-01; WP-01 design §2.2 ("WP-03 then sets home to /ta") |
| WP03-A02 | TA (`syn-ta-1`) | TA-01 | Read the page from the top. | Blocks in this order: "Needs your action" list; upcoming travel-risk notices; recent result and closure notices; a "Browse services" shortcut. Each action item names the applicant and the application reference, the action in words (for example "Add the photograph"), and the reason. A recorded date shows only when a read model supplies it (Q-05); no date is invented. Each item opens its own application or task. | L | PL §3.2 TA-01, §5.2; UX §4.2, §7.3 (TA Home) |
| WP03-A03 | TA (`syn-ta-1`) | TA-01 and TA-06 | After V05 step B1 (a draft with no photograph), compare Home with the "needs your action" filter of TA-06. | The same applications show in both places, for the same reasons. The number shown names its unit ("2 applications need your action"). | L | PL §5.2 TA-01; LD (attention rule kept, WP-01 Q-06) |
| WP03-A04 | TA (`syn-ta-3` if it holds no group; otherwise fixture) | TA-01 empty | Open Home. | S2 teaches the sequence: choose a service, create a group, add applicants. It says that every application belongs to a group that holds one country and the travel dates (UAT-04). It links to Services and to "Create group". It shows no country, no number and no "0". | L (or T) | PL §3.2 TA-01 (S2); UX §7.3; UF UAT-04 |
| WP03-A05 | TA (`syn-ta-1`) | TA-01 when applications exist but none needs the TA's action (fixture or after all are submitted) | Open Home. | The list area says "Nothing needs your action now." or the same facts. It does not show the S2 teaching text. Notices still show. | L+T | PL §1.3 (S2 is "nothing exists"); D7 |
| WP03-A06 | TA | TA-01 when the applications read fails, and when the notices read fails (fixtures) | Render the page. | Applications read failure: S7 with the error category and "Try again"; never "Nothing needs your action". Notices read failure: the action list shows; the notices block shows "Unavailable". No count shows "0" for an unreadable value. | T | PL §1.3 S4, S7; D7; UX §8.3 |
| WP03-A07 | Phone user, TA | TA-01 at 390 px | View the page. | Action items are cards: identity first (applicant, reference), then the action. The first item is reachable without horizontal page scroll. | L | PL §3.2 TA-01 (Mobile); AC-04, AC-21 |
| WP03-A08 | TA | TA-01 | Read all visible text. | No SLA, deadline, support hours, approval promise or "Pay now". Counts name their unit. | L | CR-02, CR-03, CR-07; UX §9 C13 |

### 2.2 TA-13 Group setup (create group; edit travel dates)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP03-A09 | TA (`syn-ta-1`) | TA-04 → "Create group" → TA-13 create mode | Open the page. Read it. Select "Cancel". | A full task page. Fields in this order: country, group name, travel start date, travel return date, then a review. The country choice lists only listed countries (Synthetica, Synthetica Beta; Synthetica Gamma only while it is listed). The page says that a group holds one country and its travel dates, that dates are India dates, and that applicants are added after the group exists. "Cancel" returns to TA-04 and creates nothing. | L | PL §3.2 TA-13, AD-07; BS B03; UX §4.2 (Groups) |
| WP03-A10 | TA (`syn-ta-1`) | TA-03 of "SYN Tourist e-visa" → "Start an application" | Select "Start an application". Select "Create a group". Create the group. Open "Add one applicant" on its TA-05. | "Start an application" opens the Groups list `/ta/groups` with the line that the TA chooses or creates a group for the service's country (Q-W03-16): the display carries no country id, so TA-13a opens with no country chosen; "Cancel" returns to TA-04. The country preselection is deferred (P-09). After creation, TA-05 opens; "Add one applicant" opens TA-09c with no service preselected. No draft exists until the TA sends TA-09c. | L | W2 Q-W02-10; Q-W03-16; P-09; WP02-A20; PL §4.1 steps 2 to 4 |
| WP03-A11 | TA | TA-13 create | Send the empty form. | C1: the error summary receives focus. Each field states its rule in words: choose a country; the name has 1 to 120 characters; the start date is today or later (India date); the return date is on or after the start date. Nothing is created. | L | CMP-07; AC-08; `core.create_group` input rules |
| WP03-A12 | TA | TA-13 create | Enter country Synthetica, name "WP03 [run] dates", start date yesterday (India date), return date the day before the start. Send. Then fix the start date only. Send. | First send: C1 on the start date ("must be today or later") and the entered values stay. Second send: C1 on the return date ("must be on or after the start date"); the name and the corrected start date stay. Nothing is created. | L | `core.create_group` (`group_dates_invalid`); AC-08; W1 A-12 |
| WP03-A13 | TA (`syn-ta-1`) | TA-13a Create a group (`/ta/groups/new`) | Enter Synthetica, "WP03 [run] G1", start = run date + 30 days, return = start + 7 days. Read the text before the button. Select "Create group". | Before the button the page says that creating a group creates no application and sends nothing to TravelMudra. There is no separate review step and no "Change" link: the form is the review. C3: TA-05 of the new group opens with the receipt "Group created": group (link), country, travel dates and "Next: add the applicants.", with the request reference link. The receipt names the group only when the operation's result is this group (C-03). TA-04 lists the group. | L | PL §4.1 step 3, §7 (Create group: K-STD); design §2.4, §2.14; C-03; review R-11 |
| WP03-A14 | TA (`syn-ta-1`); harness | TA-13a, the Nth time | (1) Double-click "Create group". (2) Harness: send the accepted request again with the same `_op` and the same fields (raw identical envelope). (3) Harness: send the same `_op` with a changed name. (4) After the receipt, press the browser Back button, then send the form that the page now shows. (5) Send the empty form (C1), correct it, send. | (1) and (2): one group; the same receipt (K-STD replay). (3): refused as a used form (`conflict_operation_key`); TA-13a re-renders with a new form key, the typed values kept and the text "This form was already used with different content. Your values are kept: check them and create the group."; no group is created. (4): Back reloads TA-13a (WP-01 A-02) with a fresh form and a new key; sending it creates a second group. This is accepted behaviour: a group has no business key (Q-W03-17); TA-04 shows both groups with their dates, and the empty one can be closed. (5): the refused send leaves no operation record; the re-rendered form carries a new key; the corrected send creates one group. | L+T | PL §7 K-STD; BS B35; design §7.1; W1 A-02; Q-W03-17; review R-12 |
| WP03-A15 | TA (`syn-ta-1`), SuperAdmin | TA-13 create with a country that becomes not listed | Open TA-13 and choose Synthetica Gamma while it is listed (WP-02 D8 to D15), or use a fixture. Before sending, `superadmin-1` sets the country to "Not listed". Send. | C2: the country field says that this country is not open for new groups; the other values stay; nothing is created. | L (per WP-02 proof) or T | `core.create_group` (`country_not_listed`); BS B07; WP02-A39 |
| WP03-A16 | TA | TA-13 create with a lost acknowledgement (fixture) | Inject the fault. | C4 (CMP-13): "Checking the original result" and "Check status". The page offers no second "Create group" for the same intent. "Check status" shows the group when it was created. | T | PL §1.1 UNR, §4.1 step 3 ("no second group"); BS B35 |
| WP03-A17 | TA | TA-13 create at the India date boundary (clock fixture) | At 00:30 IST (19:00 UTC of the previous day), send a start date equal to the India date, then a start date equal to the previous India date. | The first is accepted. The second is refused (C1). The page shows dates only, never a UTC date. | T | BS B25 (declared date basis); `core.create_group` (Asia/Kolkata) |
| WP03-A18 | TA (`syn-ta-1`) | TA-05 of G1 → "Edit travel dates" → TA-13 edit mode | Open the page. Read it. Select "Cancel". | The page shows the current dates and fields for the new dates. The country shows as a fact and cannot change; the page says that another country needs a new group. The page says that the open applications of the group are checked again against the new dates and that filed facts stay as they were. If no impact preview exists (Q-08), the page shows no list and no count of affected applications. "Cancel" returns to TA-05. | L | PL §3.2 TA-13 (edit mode), §5.2 (Edit travel dates); BS B03, B06 |
| WP03-A19 | TA (`syn-ta-1`) | TA-13b Change travel dates (`/ta/groups/:groupId/travel-dates`) | Move the return date one day later. Read the text before the button. Select "Save travel dates". | Before saving, the page says that TravelMudra checks the group's unfiled applications against the new dates, that filed work does not change, and that an application may wait for that check before it can be submitted. C3: TA-05 shows the receipt "Travel dates changed" with the travel dates now and the recheck sentence. The receipt does not state the earlier dates (no result fact carries them) and lists no affected applications (no preview read model exists; deferred, D-W03-07). TA-05's header and the context band of TA-09t and TA-08 show the new dates. An application that waits for the recheck says so (TA-07 state "Draft waiting for a travel-date recheck"). | L | `core.edit_travel_dates`; BS B06; design §2.3, §2.4, §3.1; D-W03-07; review R-11 |
| WP03-A20 | TA | TA-13 edit | Save the same dates. Save a return date before the start date. Open the edit address of a closed group (fixture). | Same dates: C1 "The dates are unchanged." Return before start: C1 on the return date. Closed group: no "Edit travel dates" on TA-05; the edit address shows "The group is closed. Its travel dates cannot change." with the route to its history, and no form. | L (first two) + T (closed) | `core.edit_travel_dates` (`group_dates_invalid`, `group_closed`); PL §5.2 (Unavailable: group closed) |
| WP03-A21 | TA (`syn-ta-1`), two tabs | TA-13 edit of G1 | Open the edit page in tab 1 and tab 2. In tab 2 save new dates. In tab 1 save other dates. | Tab 1: C5 "Changed since your review" (CMP-14) with the current dates and the unsent dates side by side, and "Review current information". Nothing is overwritten. | L | CMP-14; UX §3.3; `core.edit_travel_dates` (revision) |
| WP03-A22 | TA | TA-13 edit, the Nth time and a lost acknowledgement (fixtures) | Resend the same form (same key). Inject a lost acknowledgement. | Same key: the same receipt; one change in the group history. Lost acknowledgement: C4 with "Check status"; no second save offered. | T | PL §7 K-STD; BS B35 |
| WP03-A180 | TA (`syn-ta-1`) | TA-13b of an open group without applications (new, correction of 13 October) | Enter a start date before today (India date). Send. Read the page. Tick the acknowledgement and send. Change one date and send. | The page shows "Check these travel dates: they are before today" with the exact dates and an unchecked acknowledgement of exactly those dates; nothing is sent and the group keeps its dates. With the matching acknowledgement the dates are sent; the acknowledgement is not. Changed dates ask again. Partly met by decision: Core still accepts past dates until the Core fix. | L+T | `WP-03.md` §6.2 (O-01); fixes notes §6a |

### 2.3 TA-04 Groups list

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP03-A23 | TA (`syn-ta-1`) | 4650 `/ta/groups` (rail "Groups") | Open the page. Read the rows. | Primary action "Create a group". Each row: group name (link to TA-05) with the country name below it; travel dates ("[start] to [return]"); state in words ("Open", "Closed" or "Closed after the travel return date"); applications "[open] open of [total] applications", from Core. The line "This list shows at most 200 groups." shows only when 200 rows return. Freshness "Read at [time] IST". Counts by common progress, open import issues per group and the next action per group are not shown (deferred, D-W03-07, P-09). | L | PL §3.2 TA-04, §6.2 (Group list); BS B03, B25; CR-07; design §2.2; D-W03-07 |
| WP03-A24 | TA (`syn-ta-1`) | TA-04 filter | Choose "Show: Closed". Select "Apply". Reload. Press Back. Select "Clear filters". Put an unknown value for `state` into the address. | The filter is the enumerated value `state` (all, open, closed) in the address (SH-R06). Reload keeps it; Back restores the previous view. The first text of the list region is "[n] groups shown" (AC-16). No match: S3 "No group matches this filter." with "Clear filters" and "[n] groups are in other states.". An unknown value turns the filter off. The country filter does not exist in WP-03 (deferred, D-W03-07, P-09). | L | PL TA-04, §2.3 SH-R06; AC-16; design §2.2; D-W03-07; review R-11 |
| WP03-A25 | TA (`syn-ta-3` if it holds no group; otherwise fixture) | TA-04 empty | Open the page. | S2: "No groups yet." It explains that a group holds one country and the travel dates, and that every application belongs to a group (UAT-04). First task "Create group". No zero counts. | L (or T) | PL §1.3 S2; UF UAT-04 |
| WP03-A26 | TA | TA-04 when the list read fails and when one count cannot be read (fixtures) | Render the page. | List read failure: S7 with "Try again", never S2. Unreadable count: "Unavailable", never "0". | T | PL TA-04 ("Unknown counts show Unavailable"); D7 |
| WP03-A27 | TA | TA-04 and TA-06 when the read returns its row limit (200 rows, fixture) | Render the pages. | The page says that it shows the first 200 and how to narrow the list. A count derived from a read that hit its limit shows "Unavailable" (or "200 or more"), never a number presented as the total. | T | D7; CR-07; Q-05 |
| WP03-A28 | Phone user, TA | TA-04 at 390 px | View the list. Use the filters. | Rows become group cards: name and country first, then dates, counts and next action. The filters are reachable. No horizontal page scroll. | L | PL TA-04 (Mobile); AC-04 |
| WP03-A29 | TA (`syn-ta-2`) | TA-04 | Open the list after `syn-ta-1` created G1. | No `syn-ta-1` group appears. No count or hint refers to other groups. | L | BS B10; PL §2.3 SH-R01 |

### 2.4 TA-05 Group detail

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP03-A30 | TA (`syn-ta-1`) | 4650 `/ta/groups/:groupId` of G1 | Open the page. | Context band (CMP-24): group name (`h1`), country, travel dates, state. Breadcrumb "Groups / [group name]". Freshness line. Primary "Add applicants". Secondary "Edit travel dates" (open group only). | L | PL §3.2 TA-05; CMP-24 |
| WP03-A31 | TA (`syn-ta-1`) | TA-05 of G1 after V05 Part B | Read the closure facts. | The state "Open" and each condition that stops ordinary closure show as facts with units, as Core reports them: for example "1 application is not completed", "0 intake issues are open" only when the read model reports 0, "1 import is still running". "Ended with the group: [n] applications" shows only when such applications exist. No text says the group is ready to close or will close by a date. | L | PL AD-06, §4.2 (Group end), §5.2; BS B25; CC-02 |
| WP03-A32 | TA (`syn-ta-1`) | TA-05 of G1, sections | Read the sections after the action panel. | Sections in this order: "Applications" (rows as TA-06, without the group column); "Imports" ("Imports still running: [n] imports" from Core, with the link to the group's existing imports page); "Import issues" ("Open import issues of this group: [n] issues" from Core, with the link to the existing import-issues page, where a failed row without an application stays reachable); "Closing the group" (the B25 rule as text, the same Core facts, and the carried "Close the group" form, shown whenever the group is open; Core refuses with the condition, Q-W03-09). WP-03 has no tabs (deferred, D-W03-06): BU-P09 and the issue view replace the two middle sections in WP-04. | L | PL TA-05; design §2.3; D-W03-06; Q-W03-09; CC-02; review R-11 |
| WP03-A33 | TA (`syn-ta-1`) | TA-05 → TA-07 | Open an application from the "Applications" section of TA-05. Use the breadcrumb. Open it again and press the browser Back button. | The breadcrumb reads "Groups › [group]" before the applicant's `h1` (the link carries `from=group`). The breadcrumb and Back return to TA-05 at the same address, with its "Applications" section, not to TA-06. TA-05 has sections, not tabs (D-W03-06). | L | PL §2.3 SH-R07; UX §4.2; design §2.3, §2.7; D-W03-06; W1 A-02 |
| WP03-A34 | TA | TA-05 | Look for group-level actions. | No "Submit all", no group submission, no shared price, consent or outcome control. | L | UX §2.1, §4.2; PL TA-05; §11.1 |
| WP03-A35 | TA | TA-05 "Add applicants" when no offering of the group's country is selectable (WP-02 proof offering suspended per WP-02 Q-04, or fixture) | Select "Add applicants". | A CMP-10 notice states the offering reason, owner and route, as on TA-03. No usable start control. | L (per WP-02 Q-04) or T | PL §5.2 (Add applicants: Unavailable); BS B07 |
| WP03-A36 | TA | TA-05 of a closed group (fixture) | Open the page. | The page says that the group is closed, with its kind in words. It is read-only: no "Add applicants", no "Edit travel dates". Its applications and history stay reachable. | T | PL TA-05 ("Closed group: read-only with history"); BS B25 |
| WP03-A37 | TA (`syn-ta-1`) | TA-05 of G1 right after A13 | Read the Applications tab. | S2: "No applications in this group yet." with "Add applicants". No zero counts are shown as facts. | L | PL §1.3 S2 |
| WP03-A38 | TA (`syn-ta-2`) | TA-05 address of G1 | Open the address. Change one character of the group reference. Open it. | Both answers equal WP01-A73 and A74: "You do not have access to this page." with no group name, country or dates. | L | PL §2.3 SH-R02; BS B10 |
| WP03-A39 | TA | TA-05 when the group read fails and when the closure facts cannot be read (fixtures) | Render the page. | Read failure: S7 with "Try again". Closure facts unreadable: "Unavailable"; no closure state is claimed. | T | PL §1.3 S4, S7; D7 |

### 2.5 TA-09 Individual intake: create the draft

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP03-A40 | TA (`syn-ta-1`) | TA-05 of G1 → "Add applicants" | Read the choice. Choose "Add one applicant". Open "View requirements". | The choice offers "Add one applicant" (TA-09) and "Add applicants in bulk" (existing page until WP-04). TA-09 shows the context band (group, country, travel dates). "View requirements" opens a panel with the declared documents, formats and size limits of the chosen services; Escape closes it and returns focus. | L | PL §3.2 TA-09, CMP-24; Q-07 |
| WP03-A41 | TA (`syn-ta-1`) | TA-09 service choice in a Synthetica group | Read the choice. | It lists only offerings of the group's country that this TA can select, each with its price. "SYN Provider visa (route not approved)" is absent. The TA can choose more than one service; the page says that each service becomes its own application. A visible offering that cannot be selected shows its reason and cannot be chosen. | L | BS B03, B07; WP02-A29; UX §2.1 |
| WP03-A42 | TA | TA-09 applicant facts | Read the fields. | Each field has a visible label: passport number, issuing country, surname, given names, date of birth, nationality, sex, resident in India. Passport number and issuing country are marked required; the page says that at least one name part is required. The page says that the passport number and issuing country identify the applicant and that nothing is matched by name. The issuing-country hint gives an example ("IND for India"). | L | BS B15 (passport primary reference); `intake.start_individual` input rules; AC-05 |
| WP03-A43 | TA | TA-09 passport input; the passport row of the documents section (A66); the passport upload and replace controls on TA-07 | Read the text beside each passport input. | TA-09-R1: the text states the rule: a passport is exactly two pages, the front page and the back page; the TA gives one file that holds both pages, or two files, one for each page. The same rule text shows at each passport input. Formats and size limit come from the declaration: PDF, JPEG or PNG, up to 5 MB. | L | PL §14.2 TA-09-R1; UF UAT-14; TR §3.1 |
| WP03-A44 | TA (`syn-ta-1`) | TA-09 and the passport row | (a) Give one file that holds both pages. (b) In a second applicant, give the front-page file and the back-page file. (c) Read the completeness text after the checks. | The form offers only the shapes that the integrated command accepts (Q-02); it never states a shape that the send then refuses. Each accepted shape becomes the passport evidence of the applicant. Completeness text shows only what the read model reports (for example "The back page is missing"), never a page count that the read model does not supply. If the integrated version accepts one file only, the run record marks this item "partly met" per Q-02. | L+T | PL §14.2 TA-09-R1 ("the page shows what the read model reports"); BU-UI-PLAN §7.2; Q-02 |
| WP03-A45 | TA (`syn-ta-1`) | TA-09 create | Enter issuing country IND and the passport number "P12345" (synthetic). Send. | TA-09-R2: C1 on the passport number. The message states the expected format for passports of that country, as Core's rule states it (for IND after the UAT-09 fix: one letter and seven digits, or two letters and six digits). The entered values stay. Nothing is created. | L | PL §14.2 TA-09-R2; TR §3.1 Q-7; UF UAT-09 |
| WP03-A46 | TA | TA-09 create with a fixture that changes Core's passport rule | Run the test that replaces the rule (for example one shape only) and sends a refused number. | The message follows the rule that Core applied. The page code holds no passport format of its own. A refusal code without text shows the code itself (SC §3.4). | T | PL §14.2 TA-09-R2 ("MUST NOT state a format of its own"); Q-03 |
| WP03-A47 | TA (`syn-ta-1`) | TA-09 create | Enter issuing country IND and a synthetic two-letter, six-digit number that starts with P (for example "PA123456"), with the other facts of sample "Ravi". Send. | After the bulk lane's UAT-09 fix is integrated: accepted. Before it: refused with the A45 message, which states the rule that Core applies at that commit; the run record notes the commit. | L | TR §3.1 Q-7 (UAT-09 class A, P0); UF UAT-09 |
| WP03-A48 | TA | TA-09 create | Enter issuing country "India", then "XX". Enter a surname with digits. Enter a date of birth "31/02/1990". Choose two document files. Send each time. | C1 for each field, in words (three-letter code, for example IND; letters, spaces, apostrophes and hyphens only; a real calendar date). Typed values stay. The page says which files must be chosen again (a browser does not keep a chosen file). | L | `intake.start_individual` (`country_code_invalid`, `name_invalid`, `date_invalid`); AC-08; W1 A-12 |
| WP03-A49 | TA (`syn-ta-1`) | TA-09c create | (1) Give a GIF as the passport. Send. (2) Give a passport PDF larger than the form's file limit. Send. (3) Give a valid PDF as the photograph (the offering accepts JPEG or PNG only), with otherwise valid facts. Send. Open the new draft's documents (TA-09f) after the checks. | (1) and (2): refused before any command runs. The field error says that the file is not a PDF, JPEG or PNG, or that it is larger than the document accepts (the size from the requirement, never a fixed "5 MB"). Typed values stay; the summary says "Choose the files again."; nothing is created. (3): there is no whole-form refusal for a format that only the offering narrows (C-10). The draft is created. The photograph row then shows Core's processing verdict in words with the requirement's rule (JPEG or PNG, up to 2 MB) and "Replace this file". The draft and its other documents stay. | L+T | BS B15; design §4.6, §4.9; C-10; review R-10 |
| WP03-A50 | TA (`syn-ta-1`) | TA-09 create (V05 step B1) | Sample "Asha": typed facts that match the sample; service "SYN Tourist e-visa"; passport file only. Send. | C3: the receipt names the applicant, the service, the application reference and the state "Draft", with the request reference link. The TA reaches the draft's task list in one step. The passport row shows "Being checked" until the checks finish. No quote is fixed and nothing is submitted (V05). | L | PL §4.1 step 4, §5.2 (Create draft: Draft ID; task list); BS B17 |
| WP03-A51 | TA (`syn-ta-1`) | TA-09 create (V02 step A2) | Sample "Ravi"; services "SYN Tourist e-visa" and "SYN e-visa, fee paid with submission"; passport and photograph. Send. | C3: the receipt lists two applications, each with its own reference, service and price ("₹3,500", "₹3,600"), each with a link to its own task list. Unit: "2 applications created". | L | UX §12 V02; BS B03 |
| WP03-A52 | TA (`syn-ta-1`) | TA-09 create in G2 (V02 step F1) | Send the same passport number and issuing country with "SYN Tourist e-visa" again, plus a second service that is new for this applicant. | C2: "This applicant already has an open application for this service in this group." with a link to it. The page says that nothing was created, also not for the other service (all-or-nothing). Typed values stay. | L | BS B03, B35 (duplicate scope); `start-individual.ts` (`duplicate_open_scope`); PL §5.2 (Create draft REJ) |
| WP03-A53 | TA | TA-09 create | Enter "Resident in India: No" with otherwise valid facts. Send. | C2 with the population reason in words (the service is for Indian ordinary-passport holders resident in India). Nothing is created. | L | BS B02, B07; core intake writers (population scope on positive evidence) |
| WP03-A54 | Harness as `syn-ta-1` | TA-09 create | Send the form with the service reference of "SYN Provider visa (route not approved)". | Refused with the offering reason (WP-02 TA text). Typed values stay. No draft, application, intake attempt or issue is created; the counts of TA-04 and TA-06 are unchanged. | L+T | WP02-A30 (regression on the rebuilt page); BS B07 |
| WP03-A55 | Harness as `syn-ta-1` | TA-09 create in a Synthetica group | Send the form with the reference of "SYX Tourist e-visa". | C1 or C2: "This service is not offered in this group's country." Nothing is created. | L | `start-individual.ts` (`offering_not_in_country`); BS B03 |
| WP03-A56 | TA (`syn-ta-1`) | TA-09 create | Open the form. Wait 6 minutes. Fill it and send. | The form is accepted (or refused only for a field reason). No bot check exists on this form; no "The verification did not pass" message appears. | L | UF UAT-08 (derived); TR §4 (bot check only on sign-in pages) |
| WP03-A57 | TA (`syn-ta-1`); harness | TA-09c create, the Nth time | (1) Double-click "Create drafts". (2) Harness: send the accepted multipart request again with the same `_op`, fields and file bytes. (3) Harness: send the same `_op` with one changed fact. (4) After the result page, press the browser Back button and send the form that the page now shows, with the same applicant and service. (5) Send a form that Core refuses (C1), correct it, send. (6) Inject a lost acknowledgement (fixture). | (1) and (2): one attempt and the same drafts; the same result page (the operation's content uses the files' SHA-256 and size, never the staging id). (3): refused as a used form; TA-09c re-renders with a new key, the typed values kept and "Choose the files again."; nothing is created. (4): Back reloads TA-09c (WP-01 A-02) with a fresh form; the new send meets the command's own duplicate check: C2 "This applicant already has an open application for [service] in this group. Nothing was created." with the link (A52). (5): the refused send leaves no operation record; the corrected send creates the drafts once. (6): C4 on the operation page: "Checking the original result" and "Check status"; no new send is offered there. | L+T | PL §7 K-STD; BS B35 ("a new key cannot evade business duplicate checks"); design §7.1; W1 A-02; review R-12 |
| WP03-A58 | TA (`syn-ta-1`), two tabs | TA-09 create of G1 | Open TA-09 in tab 1 and fill it. In tab 2 change the travel dates of G1 (A19). Send tab 1. | C5: the page says the group changed since the form opened and shows the current group facts. Typed values stay (files must be chosen again, A48). Nothing is created until the TA sends again. | L | `start-individual.ts` (`expectedGroupRevision`); CMP-14; UX §3.3 |

### 2.6 TA-09 task list and sections

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP03-A59 | TA (`syn-ta-1`) | TA-09t task list (`/ta/applications/:applicationId/prepare`) of the V05 draft; the task list of a submitted unassigned application | Read each list. | Sections: Group and service; Identity details; Application details; Documents; Document checks; Check and submit. Each link is followed by its state in words, from the closed set of design §1.6 only: "No open item", "Needs your input", "Needs evidence", "Being checked", "Cannot change", "Cannot start yet", "Not checked here", "Unavailable". "Check and submit" reads "Cannot start yet: [n] items above stop submission" while Core blocks submission. No percentage, no count of completed sections, no "Ready", "Complete" or "Completed". For the submitted case the states read "Not checked here" (Core evaluates submission only for a draft). A blocker that no section owns shows under "Other items that stop submission" with Core's sentence. | L | PL §3.2 TA-09, CMP-04; UX §4.3, §7.4; design §1.6, §4.2; C-11; review R-11 |
| WP03-A60 | TA | TA-09t, the context band and the section "Group and service" | Read them. | The context band shows group, country, travel dates (IST), service and "View requirements". The section state is "Cannot change"; the text says that another service needs its own application and another country needs another group. With a travel-rule blocker the state is "Needs your input" with "Change the travel dates" (TA-13b). Country and travel dates come from the group read; when it fails they read "Unavailable". The service mode is not shown (not in the TA case read model; deferred, P-09). The price and the estimate show on TA-07 and TA-08, not here. | L | BS B03; design §1.6 (CMP-24), §4.2 row 1; P-09; review R-11 |
| WP03-A61 | TA (`syn-ta-1`) | TA-09d Application details (`/ta/applications/:applicationId/edit`) | Read the fields. Choose passport type "ordinary", country of residence IND, Travel purpose "Tourism", and nationality IND when none is recorded. Select "Save". | The page shows passport type, country of residence, nationality (only while none is recorded) and the declared form fields, each with a visible label; a required declared field shows "(required)". Each section has one "Save"; there is no "Save and continue" or "Save and exit" (D-W03-14). C3: TA-09t opens with the receipt "Application details saved" and the details section's values now, named only when the operation's result is this application (C-03). The section state changes per Core's facts. | L | `core.edit_draft`; design §1.4 row 4, §2.11, §2.14; D-W03-14; C-03; review R-11 |
| WP03-A62 | TA | Applicant facts section | Read the declared fields. Send an option that the declaration does not list (harness). | The section lists exactly the declared form fields (Travel purpose, required, one option). The hand-made value is refused (C1) in words; nothing changes. | L+T | `core.edit_draft` (`validateFormFields`); BS B05 |
| WP03-A63 | TA (`syn-ta-1`) | Applicant facts section | Change the surname in the ordinary save (harness if the form does not offer it). | Refused: identity details change only with same-person evidence. The page offers "Correct identity details" with the reason. Nothing changes. | L | `core.edit_draft` (`identity_field_requires_correction`); BS B19 |
| WP03-A64 | TA (`syn-ta-1`); harness | TA-09i Identity details (`/ta/applications/:applicationId/correct-identity`) | Read the evidence choice. Send with no evidence chosen. Send with no field changed. Choose the application's passport as evidence, change the given names to match the passport, write "What was wrong", send. Harness: send the accepted request again (same key, same fields); then the same key with another value. | The evidence is a list of this application's identity documents; none is prechecked; each links to its document. No evidence: C1 "Choose the identity document that shows the corrected details." (or the same facts). No change: "Nothing changed. The saved details are shown." as information, not as an error. Accepted: TA-09t opens with the receipt "Identity details corrected", the identity values now and "The documents you chose are recorded as the evidence."; the history shows the correction. Identical replay: the original result (the input is mapped from the posted values, C-04). Same key with changed content: refused as a conflict. When the application has no identity document, no form shows; the page says to upload the passport first. | L+T | `core.correct_identity`; BS B19; design §4.5, §2.14; C-04; review R-04 |
| WP03-A65 | TA | "Correct identity details" | Change the passport number to a value that the passport document does not show. | C2 with the reason in words (the evidence does not show the new value). Nothing changes. The page names the route: replace the document, or keep the value. | L+T | `core.correct_identity` (`requireSamePersonEvidence`); BS B15, B19 |
| WP03-A66 | TA (`syn-ta-1`) | Required documents section | Read it. | One row per declared requirement: label, required or optional, formats, size limit, current version and status (CMP-02) in words. Actions per row: "Upload" (missing), "Replace" (present), "Use a file already in this group" (associate). The passport row shows the TA-09-R1 text (A43). | L | PL §3.2 TA-09, §5.2; CMP-02, CMP-28 |
| WP03-A67 | TA (`syn-ta-1`) | Required documents, photograph missing (V05 step E1) | Upload `photo-placeholder.jpg`. Reload after the checks finish. | C3: the receipt names the new version. The row shows "Being checked", then the verdict after reload. No row shows "Accepted" before its checks finish. | L | `doc.upload_for_application`; PL §5.2 (Upload: version recorded; processing then verdict) |
| WP03-A68 | TA | Required documents | Upload a GIF, a 6 MB PDF and a PDF for the photograph. Upload the safety-check fixture file (test). | Format and size: C1 next to the input with the requirement's own formats and limit and the allowed replacement. Safety failure: "This file was not accepted because it failed the safety check." No bytes or preview of the file show. | L (format, size) + T (safety) | BS B15; PL §5.2 (Upload REJ) |
| WP03-A69 | TA (`syn-ta-1`) | TA-09f, passport row with an accepted file; DOC | Replace the passport file with another synthetic passport PDF. Read the receipt and the row. After the checks, open the earlier version on DOC. Fixtures: a replacement sent from a page opened before another change of the same association; a replacement file that fails the checks; a version shared by the two applications of one applicant (V02). | The replacement form carries the revision of the exact association it replaces (C-01). C3: the receipt says "Replacement file received", names the document type and shows the pending checks and the association state for this application (C-09); it does not say that the file was replaced. The earlier file stays associated until Core switches to the new one; then the row shows the new file and DOC of the earlier version shows "Replaced by a newer file". Stale association revision: CMP-14 with the current state; nothing changes. Failed replacement: the earlier file stays the current evidence and the row says why the new file was not accepted. Shared version: each application shows its own association state. | L (first part) + T (stale, failed, shared) | `doc.replace_version`; C-01, C-09; review R-01, R-09; design §4.6, §4.7 |
| WP03-A70 | TA (`syn-ta-1`) | Required documents of V02 application B; harness | Select "Use a file already in this group" for a requirement that has no association. Then send the association of a version of G3 (another group) by hand. | The chooser lists only versions of this group, by type and version. Choosing one: C3; the row shows the version and its status. The hand-made request with another group's version is refused like an unknown object; nothing is associated and nothing about G3 is disclosed. | L+T | `doc.associate`; BS B03 (no cross-group document reuse), B10 |
| WP03-A71 | TA | Evidence results section | Reach on `lane-ui`: processing, accepted, missing, a conflict (typed passport number differs by one character from the sample's machine-readable line, in a fresh applicant), a validity failure (photograph below 350 × 350 pixels). Render the other states by fixture: unsafe or quarantined, unreadable, unavailable, replaced, unclassified, unassociated, validity unknown. | Each state shows in words with the version, the reason and the next action or owner. The conflict says that the typed passport number differs from the passport document and offers both routes: correct the identity details, or replace the document. No state shows as zero, blank or "Ready". | L (five states) + T (all) | CMP-02; UX §7.4; BS B15, B16; `REQUIREMENT_EVIDENCE_STATUSES` |
| WP03-A72 | TA (`syn-ta-1`), two tabs | Applicant facts section | Open the section in tab 1 and tab 2. Save in tab 2. Save a different value in tab 1. | Tab 1: C5 "Changed since your review" (CMP-14): a table of field, your unsent value, current value; "Review current information". Nothing is overwritten. | L | CMP-14 (first consumer: WP-03, WP-01 design §7.6); UX §3.3 |
| WP03-A73 | TA | Save section, the Nth time; a lost acknowledgement (fixtures) | Resend the same form (same key). Inject a lost acknowledgement. | Same key: the same accepted scope; one change in history. Lost acknowledgement: C4 with "Check status"; no second save offered. | T | PL §7 K-STD; BS B35 |
| WP03-A74 | Phone user, TA | TA-09 at 390 px | Open the task list. Open a section. Save. | The task list comes first. Each section is a full-screen page. "Save and continue" is at the end of the section, not in a fixed bar that hides errors. No horizontal page scroll. | L | PL TA-09 (Mobile); UX §7.3 (Mobile) |
| WP03-A75 | TA (`syn-ta-1`) | TA-09 sections of the submitted V05 application. Setup (existing staff pages): SuperAdmin records payment and assigns syn-operator-1; harness | Open a section by its address. Send a save by hand. | The section shows no edit control. It shows the TA-07 read-only notice (A103). The hand-made save is refused with the same notice text. Nothing changes. | L+T | BS B18; `core.edit_draft` (`awaiting_formal_return`); PL §5.2 (Save section: Unavailable) |
| WP03-A76 | TA (`syn-ta-1`) | TA-09f of the V05 application after submission and before assignment (V05 step F1) | Read the page. Replace the photograph. | The page says that a change now makes the readiness checks run again. C3: the receipt "Replacement file received" with the pending checks (C-09). TA-07 shows the quote and the original estimate unchanged. | L | BS B19 ("submitted unassigned correction invalidates affected readiness"); UX §2.3; design §3.1; C-09 |
| WP03-A177 | TA (`syn-ta-1`), SuperAdmin | TA-09d, TA-09i and TA-09f of a submitted unassigned application (fixture, or set-up through the existing SuperAdmin page per Q-W03-08) | Open TA-09d and type a change. Before saving, `superadmin-1` assigns an operator. Select "Save". Repeat on TA-09i and on TA-09f with a file chosen. | Core refuses (`awaiting_formal_return`). The re-rendered page shows no form. It shows the assigned notice of A103 with "Report a problem", and lists "Your unsent changes" as read-only text, so that the TA can copy them into a report. The unsent values exist only in this page, never in browser storage (SH-R12). Files are not kept. Nothing changed on the application. | T (L per Q-W03-08) | BS B18; PL §2.3 SH-R12; design §7.4; review R-13 |
| WP03-A178 | TA (`syn-ta-1`) | TA-09d of a draft while approved help starts (fixture) | Type a change. Before saving, the help moves to "in progress". Select "Save". | Core refuses (`hold_assistance_in_progress`). The page shows no form, the text "An operator is entering information with your approval. You can change the application again when they return it to you.", and "Your unsent changes" as read-only text. Nothing changed. | T | BS B18; design §3.1, §7.4; review R-13 |

### 2.7 Document detail view (CC-05)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP03-A77 | TA (`syn-ta-1`) | Evidence row on TA-07 or TA-09 → 4650 `/ta/documents/:versionId` | Open the passport version. Use the breadcrumb. | The page names the document type, the version number and the applications it is linked to (from associations only). It shows the safety-check results in words with times in IST, and the extraction status in words (read, low confidence, conflict, failed, not applicable). Extracted fields show only when the read model allows. The breadcrumb returns to the evidence row the TA came from. | L | CC-05; CMP-02, CMP-19; BS B15 |
| WP03-A78 | TA | Document detail of a passport with low confidence or failed extraction (fixture or a synthetic low-quality scan) | Open "Confirm the passport details". Send a value that contradicts a check digit. Send correct values with the attestation and a reason. Send again. | The form labels each machine-readable field. Contradiction: C1 "The details you typed do not match the check digits on the passport." Accepted: C3; status "Confirmed by you". Second send: C2 "These details are already confirmed." | L (if reachable) + T | `doc.resolve_extraction` (`manual_contradicts_check_digit`, `extraction_already_verified`) |
| WP03-A79 | TA | Document detail of an unclassified version (fixture) | Choose its type and give a reason. Repeat for an excluded or already associated version. | The type choice lists only the document types that this group's applications declare. C3: the version moves to its requirement row. Excluded or associated: C2 with the reason in words. | T | `doc.confirm_classification` (`version_excluded`, `version_associated`); CC-05 |
| WP03-A80 | TA, two tabs | Document detail, resolve extraction | Resolve in tab 2, then in tab 1 from the older page. | Tab 1: C5 or C2 with the current state; nothing is overwritten. | T | UX §3.3; BS B35 |
| WP03-A81 | TA (`syn-ta-2`) | Document detail address of a `syn-ta-1` version | Open it. | SH-02 identical to not found (WP01-A73, A74): no type, name, group or application. | L | PL §2.3 SH-R02; BS B10 |
| WP03-A82 | TA | Document detail while the checks have not finished (fixture) | Try to resolve. | C2 "The checks of this file have not finished." The page offers no resolution form until they finish. | T | `doc.*` (`processing_pending`) |
| WP03-A83 | SuperAdmin in a support view of `syn-ta-1` (fixture) | Document detail | Render the page. | The same facts, read-only. No form. | T | PL §2.3 SH-R09; BS B10 |

### 2.8 TA-06 Applications list and search

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP03-A84 | TA (`syn-ta-1`) | 4650 `/ta/applications` (rail "Applications") | Open the page. | Columns: applicant, application reference, group, country and service, common progress (glossary label), outcome ("Outcome not recorded" when absent), next owner and action in words, travel date. Each row opens TA-07. Freshness per the read kind. | L | PL §3.2 TA-06, §5.2, §11.2; UX §4.2; BS B21 |
| WP03-A85 | TA (`syn-ta-1`) | TA-06 filters | Filter by View "Needs your action", by Progress and by Group. Select "Apply". Reload. Press Back. Select "Clear filters". Put an unknown progress value into the address. | The filters are the enumerated values `view` and `progress` and the opaque group id `group` in the address (SH-R06). Reload keeps them; Back restores the previous view. The result line "[n] applications shown" comes first (AC-16); focus stays. No match: S3 "No application matches these filters." with "Clear filters" and "[n] applications exist without these filters.". An unknown value turns that filter off. When the groups read fails, the Group filter is not offered. Country and service filters and sort do not exist in WP-03 (deferred, D-W03-08, P-09). | L | PL TA-06, §2.3 SH-R06; AC-16; design §2.6; D-W03-08; review R-11 |
| WP03-A86 | TA (`syn-ta-1`) | TA-06 → TA-07 | With filters set, open an application. Use the breadcrumb, then "Back to the list". Open it again and press the browser Back button. | Each row link carries the list state (`from=applications` and the filters that are set). The breadcrumb and "Back to the list" return to TA-06 with the same filters. Browser Back reloads TA-06 at the same address (WP-01 A-02), so the same filters show. No page stores the return position: a restored scroll or row position is not required in WP-03. | L | PL §2.3 SH-R07; design §2.6, §2.7; W1 A-02; review R-11 |
| WP03-A87 | TA (`syn-ta-1`) | TA-06 search ("Search your applications") | Search for the V05 applicant's surname. Read the address bar. Open a result. Press Back. Reload. Bookmark the result page. | Results show with their count and unit. The search text never appears in the address, in the browser history entry, in a bookmark or in the address that a result link sends as its referrer. Back returns to the list as Q-06 decides; the browser never asks to resend form data. | L | PL §2.3 SH-R06 (no search text in the address); BS B33; W1 Q-05 |
| WP03-A88 | TA (`syn-ta-2`) | TA-06 search | Search for a `syn-ta-1` applicant surname, a `syn-ta-1` application reference, and a random string. | The three answers are identical "No application matches." No count, hint or "hidden results" text. | L | BS B10; WP01-A10 |
| WP03-A89 | TA | TA-06 search while the search projection lags or is unavailable (fixtures) | Search. | Lag: the lag form of LD-08; results stay in scope. Unavailable: "Search is unavailable now." with "Try again", never "No application matches". | T | LD-08; UX §8.3 (Stale projection); D7 |
| WP03-A90 | TA (`syn-ta-3` if it holds no application; otherwise fixture) | TA-06 empty | Open the page. | S2: "No applications yet. Applications start in a group." with "Go to your groups" or "Create group" (UAT-04). | L (or T) | PL §1.3 S2; UF UAT-04 |
| WP03-A91 | TA | TA-06 when the list read fails, when a row fact is unreadable, and at the row limit (fixtures) | Render the page. | Read failure: S7. Unreadable fact: "Unavailable" in that cell. Row limit: as A27. | T | PL §1.3 S4, S7; D7 |
| WP03-A92 | Phone user, TA | TA-06 at 390 px | View the list. Use a filter. | Cards: applicant and reference, then next action, then progress and outcome. No horizontal page scroll. | L | PL TA-06 (Mobile); AC-21 |
| WP03-A93 | TA | TA-06 | Look for multi-select or bulk actions. | No "Submit all", no selection that submits, assigns or pays. | L | UX §4.2; PL §5.2 TA-06 |
| WP03-A94 | TA (`syn-ta-1`) | TA-06 after V02 step A2 | Find applicant "Ravi". | Two rows, one per service, each with its own reference, progress and next action. | L | UX §12 V02; BS B03 |

### 2.9 TA-07 Application workspace (submit path, help request, read-only notice)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP03-A95 | TA (`syn-ta-1`) | 4650 `/ta/applications/:applicationId` of the V05 draft | Read the header and the status facts. | Identity band: `h1` with the applicant's name and the application reference (with copy); meta: group (link) and service. Service mode and country are not shown (not in the TA case read model; deferred, P-09). Status facts as separate labelled rows: Progress "Draft"; Outcome "Outcome not recorded"; Next ("[owner] — [reason]"); Stage; Editing ("You can change it"); Service payment ("Not recorded"); Help request ("Not requested"); Problem report and return ("None"); Withdrawal only when one exists. No combined badge, no percentage. Freshness "Read at [time] IST". | L | PL §1.2 D4, CMP-03, CMP-11; UX §2.2; design §2.7; P-09; review R-11 |
| WP03-A96 | TA (`syn-ta-1`) | TA-07 action panel of the V05 draft without a photograph | Read the panel. Add the photograph (A67) and reload. | Before: "Your action: complete the draft", with each missing item in words as a blocker that evidence can fix, each linked to its TA-09 section; primary "Continue draft". After the facts allow submission: primary "Review and submit". The page shows Submit as available only when the read model says so (`submit.allowed`); a fixture that says not allowed shows its reasons and no usable control. | L+T | CMP-01; PL §6 ("A read model never grants permission"), §5.2 TA-07 |
| WP03-A97 | TA | TA-07 timing block of a draft | Read it. | "If you submit today: ₹3,500, fixed when you submit; estimated processing window [date] to [date], an estimate, not a guarantee." No deadline, no approval promise. | L | BS B17; PL §13.2 B-10; CR-03 |
| WP03-A98 | TA | TA-07 documents | Read the evidence rows. Open one. | One CMP-02 row per document with version and status in words; each opens the document detail (A77). | L | CMP-02; CC-05 |
| WP03-A99 | TA (`syn-ta-1`) | TA-07 of the V05 draft → "Request help" (V05 step B2) | Read the form. Write a note. Send. Reload. | The form has a labelled optional note (up to 2000 characters) and says that help is separate from submission and that a SuperAdmin decides. C3: "Help requested. A SuperAdmin decides whether TravelMudra helps." with the request reference. Afterwards the page shows "Help requested: waiting for a SuperAdmin decision" in place of the action. The application stays a draft; "Review and submit" is still the way to submit. No "Submit for TA". | L | `core.request_assistance`; PL §4.2 A1, §5.2; UX §3.2 (Approved assistance); BS B17, B18 |
| WP03-A100 | TA (`syn-ta-1`); harness | TA-07 of the V05 draft after A99 | Look for "Request help". Send a second request by hand. | No second request control. The hand-made request: C2 "A help request is already open for this application." with its status. Nothing new is recorded. | L+T | `core.request_assistance` (`assistance_request_open`); PL §5.2 (Request help: Unavailable) |
| WP03-A101 | TA | Request help, the Nth time, from an older page, and with a lost acknowledgement (fixtures) | Resend the same form. Send the form from a page opened before the draft changed in another tab. Inject a lost acknowledgement. | Same key: the same receipt; one request. Older page: C5 with the current facts; nothing is recorded. Lost acknowledgement: C4 with "Check status"; no second request offered. | T | PL §7 K-STD; BS B35; `core.request_assistance` (revision) |
| WP03-A102 | TA (`syn-ta-1`) | TA-07 of the V05 application after submission (V05 step E4) | Read the page. | Progress "With TravelMudra". Outcome "Outcome not recorded". Next owner and action as Core reports them, in words (for example "TravelMudra: assign an operator"). Timing as separate rows: quote "₹3,500, fixed at submission"; original estimate "[date] to [date]"; current forecast "Not recorded". Service payment as its own row. | L | PL §4.1 step 5, TA-07; UX §3.1 (estimate and forecast separate); BS B17, B21 |
| WP03-A103 | TA (`syn-ta-1`) | TA-07 of the submitted V05 application. Setup (existing staff pages): SuperAdmin records payment and assigns syn-operator-1 | Read the page. Look for edit, upload, replace, "Continue draft" and "Review and submit". | The page shows "This application is with your operator. Report the problem so it can be returned for correction." with the owner ("Your operator", or the operator's name per Q-05) and the route "Report a problem" (the existing form, Q-01). No edit, upload, replace, "Continue draft" or submit control shows. | L | UX §2.3, §4.4; PL §3.2 TA-07 (assigned and not returned), §5.2; BS B18; UX §12 V07 |
| WP03-A104 | Harness as `syn-ta-1` | TA-07 of the submitted V05 application. Setup (existing staff pages): SuperAdmin records payment and assigns syn-operator-1 | Send a draft edit, a document upload and a submission by hand. | Each is refused with the notice text of A103. Nothing changes. | L+T | BS B18; `awaiting_formal_return` |
| WP03-A105 | TA | TA-07 of a submitted, assigned application after the operator records a forecast (test fixture, V05 part G) | Render TA-07 before and after the forecast. | The original estimate is unchanged. "Current forecast: [date] to [date]" shows as a separate row, labelled as a forecast. The quote is unchanged. | T | BS B17 ("show later forecast separately"); UX §12 V05; Q-W03-08 |
| WP03-A106 | TA (`syn-ta-1`) | Rebuilt TA-07 and TA-05 | For each command that the current pages post for a later package (Q-01 list in §1.2), open an application or group where Core offers it. | Each action is still reachable and works as before the rebuild. A unit test lists these transitional panels, so that none stays by accident. | L+T | LD-02; LD-07; Q-01 |
| WP03-A107 | TA (`syn-ta-2`) | TA-07 and TA-08 addresses of a `syn-ta-1` application | Open them. | SH-02 identical to not found (WP01-A73, A74). | L | PL §2.3 SH-R02; BS B10 |
| WP03-A108 | TA | TA-07 when the case read fails, when the evidence read is unavailable, and when the delivery facts are unavailable (fixtures; availability failures only) | Render the page. | Case read failure: S7. Evidence unavailable: the Documents section says "Documents are unavailable now."; the rest renders; TA-08 then follows A116 (no submission form). Delivery facts unavailable: the status row "Delivery: unavailable now", the action panel shows Core's pending answer, and a note says that notices and downloads could not be read now. An access, authentication, maintenance or support-view refusal of an optional read is not an availability failure: it follows A179 (LD-14). | T | PL §1.3 S4, S7; design §2.7; C-05; LD-14 |
| WP03-A109 | Phone user, TA | TA-07 at 390 px | View the page. | Order: identity, action panel and blockers, status facts, sections, history. No horizontal page scroll. | L | PL TA-07 (Mobile); UX §7.3 |
| WP03-A110 | SuperAdmin in a support view of `syn-ta-1` (fixture) | TA-07 | Render the page. | The same facts, read-only. No "Request help", no submit, no "Continue draft". | T | PL §2.3 SH-R09; BS B10 |
| WP03-A111 | TA (`syn-ta-1`) | TA-07 → history of the V05 application | Open the history. | Lines for draft created, help requested and submitted, each with event time and recorded time labelled in IST. No staff identity or internal detail. | L | CMP-09; CR-06; `views.ta_history` |

### 2.10 TA-08 Review and submit

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP03-A112 | TA (`syn-ta-1`); test | TA-07 → "Check and submit" → TA-08 (`/ta/applications/:applicationId/submit`) (V05 step E2); production-mode fixture | Read the page from the top. Render the production-mode fixture. | `h1` "Check and submit: [applicant]". Sections in order: "Applicant and service" (name, date of birth, passport number, issuing country, nationality, passport type, country of residence, the declared fields; service; group with travel dates from the group read, "Unavailable" when it fails), with "Change identity details" and "Change application details"; "Documents" (rows read only, "Change documents", and "What stops submission" while Core blocks it); "Price and estimate" ("₹3,500. It is fixed for this application when you submit."; the original estimated window "if you submit today", an estimate, not a guarantee, that starts at submission whether or not payment is recorded; "Filed with: [authority label]"); "Payment" (payment is due after submission and is recorded by hand; paying online is not available); "Your confirmation" (each statement's text, never prechecked; in a test installation a draft text is marked "Draft wording"); the consequence text before the button; "Submit this application"; secondary "Ask TravelMudra for help instead" and "Back to the application". Service mode and "who files" are not shown (deferred, P-09). Production mode: a statement entry that exists but is not approved shows the boundary notice and no submission form (C-08). | L+T | PL §3.2 TA-08, §5.2; UX §4.3; BS B17; design §5.2, §5.4; C-08; P-09; review R-08, R-11 |
| WP03-A113 | TA | TA-08 | Use each "Change" link. Return to TA-08. | Each link names its section and returns to the TA-09 section; values stay; the TA comes back to TA-08. | L | CMP-05; UX §7.5 (check answers) |
| WP03-A114 | TA | TA-08 confirmation | Read the confirmation. Reload. | The declared confirmation shows its statement text in words per Q-04 (draft copy, marked as draft until C05 approval); never the code or a humanized code ("Ta confirms details"). The checkbox is never prechecked, also after reload and after any refusal. | L | UX §4.3, §9 C05; PL TA-08 ("wording C05"); CR-09; Q-04 |
| WP03-A115 | TA | TA-08 | Submit without the confirmation. | C1: the error summary receives focus and links to the checkbox ("Confirm the statement to submit this application."). Nothing is submitted. | L | `core.submit` (`ta_confirmation_absent`); AC-08 |
| WP03-A116 | TA (`syn-ta-1`) | TA-08 of a draft without a photograph; fixtures | Open TA-08. Render a fixture whose declaration does not declare "mandatory documents present", and a fixture whose evidence read is unavailable. | Blocked: each unmet item shows with a link to its section ("Photograph: missing."); the statements and the button are replaced by CMP-10 "Submitting this application is unavailable until the items above are resolved." and a visible disabled button described by that notice; "Ask TravelMudra for help instead" stays separate. The fixture without that declared check shows no "all documents complete" gate. Evidence read unavailable: the answers stay visible; no submission form shows; a boundary notice says that the documents cannot be shown now, so submission waits until they can (C-05). | L+T | PL §5.2 TA-08 ("MUST NOT add a universal all-documents gate"); UX §4.3; BS B17, B20; design §5.2; C-05; review R-05 |
| WP03-A117 | TA (`syn-ta-1`) | TA-08 in a group whose travel starts in 120 days, and in a group whose travel starts tomorrow | Open TA-08 of a complete draft in each. | Each shows that submission is not possible yet or no longer possible, with the declared window in words (3 to 90 days before the travel start date) and what the TA can do. No usable Submit. No deadline is invented. | L | BS B20 (fixed evidenced cut-off is not a gate); declaration `travelDateRules`; CR-03 |
| WP03-A118 | TA (`syn-ta-1`) | TA-08 (V05 step E3) | Confirm. Select "Submit this application". | C3: "Application submitted. Operator assignment is pending." (or the next owner Core reports), with the application reference, the quote "₹3,500", the original estimate dates, the next owner and the request reference link. A submission time shows only when a read model supplies it; otherwise this item is partly met (P-02). The polite region announces the result. | L | PL §4.1 step 5, TA-08 (receipt); UX §8.2; W1 (P-02) |
| WP03-A119 | TA (`syn-ta-1`) | TA-07 after A118 | Read the timing and payment rows. | The quote is fixed at ₹3,500. The original estimate starts at the submission date. Service payment shows "Not recorded" separately; the estimate does not wait for payment. | L | BS B17 ("independently of payment"); UX §3.1 |
| WP03-A120 | TA, SuperAdmin (test) | TA-08 of a draft (test installation, V05 part H) | Open TA-08 at the current price. Publish a higher price with a continuation that moves drafts to the new values. Send the open TA-08 form. | C5: "The price changed since you reviewed it: it was [old price] and is now [new price]." with "Review current information". Nothing is submitted. The confirmation must be given again. | T | `core.submit` (`price_changed`); BS B17; UX §3.3; Q-W03-08 |
| WP03-A121 | TA | TA-08 opened at 23:58 IST and sent at 00:02 IST (clock fixture) | Send. | C5 with the new estimate dates; nothing is submitted; the TA reviews and submits again. | T | `core.submit` (estimate window from the India date) |
| WP03-A122 | TA | TA-08 after the declaration changes its confirmation text version (fixture) | Send the older form. | C5: the page shows the new statement; nothing is submitted; the TA confirms the new statement. | T | `core.submit` (text version check) |
| WP03-A123 | TA (`syn-ta-1`); harness | TA-08, the Nth time | (1) Double-click "Submit this application". (2) Harness: send the accepted request again with the same `_op` and fields. (3) After the receipt, press the browser Back button. (4) Harness: send a submission with a new key. (5) Submit without the statement (C1); then tick it and submit. | (1) and (2): one submission; the same receipt; the history shows one submission line. (3): Back reloads TA-08 (WP-01 A-02); it shows "This application was submitted." with "Open the application" and no form. (4): refused by the command's own check (the application is no longer a draft): no second submission and no second quote; the refusal leaves no operation record. (5): the refused send leaves no record; the re-rendered form carries a new key; the second send submits once. | L+T | PL §7 K-STD; BS B35; design §5.3, §7.1; W1 A-02; review R-12 |
| WP03-A124 | TA | TA-08 with a lost acknowledgement (fixture) | Inject the fault. Read the operation page. Open TA-08 again before the original resolves. | The operation page shows "Checking the original result" and "Check status", and no submit control. TA-08 itself keeps no state about the lost answer: while the application is still a draft it shows the form with a new key. If the first submission committed, a second send is refused by the command's own check; if it did not, the second send becomes the only submission (B35). Two submissions never exist. | T | PL §4.1 step 5 (UNR); design §5.3, §7.1; review R-12 |
| WP03-A125 | TA (`syn-ta-1`), SuperAdmin | TA-08 while the offering is suspended (WP-02 proof offering through the existing launch page per WP-02 Q-04, or fixture) | Open TA-08. Send an older form by hand. | A CMP-10 notice: submitting is unavailable while TravelMudra has paused new applications for this service, with the owner and the route. No submit control. The hand-made send is refused with the same reason. | L (per WP-02 Q-04) or T | BS B07; PL §4.2 (Withdrawn or suspended offering); UX §3.2 |
| WP03-A126 | TA (`syn-ta-1`) | TA-08 → "Request help" | Request help from TA-08 on a draft with no open request (V02 application B). | The same command and receipt as A99. Nothing is submitted. The TA stays able to submit later. | L | PL §5.2 TA-08 (Request help); UX §3.1 step 3 ("Help is a separate action") |
| WP03-A127 | Phone user, TA | TA-08 at 390 px | View the page. Submit with an error. | Sections are stacked. The confirmation and the primary action are at the end of the page, not in a fixed bar. The error summary and the checkbox are visible when focused. | L | PL TA-08 (Mobile); AC-02 |
| WP03-A128 | TA | TA-08 and its receipt | Read all visible text. | The button reads "Submit this application". No "Submit for TA", "Submit all", "Pay now", approval promise, deadline or SLA. The estimate is called an estimate. | L | UX §4.3; §11.1; CR-03 |
| WP03-A173 | TA (`syn-ta-1`) | TA-07 and TA-08 of a draft returned to the TA after approved help (fixture, or set-up through the existing SuperAdmin and operator pages per Q-W03-08) | Open TA-07, then TA-08. Tick the statement. Submit. | TA-07: Editing "Returned to you for review"; action "Check and submit". TA-08 shows "An operator entered information with your approval. Check every answer." before the sections, and the normal statements, never prechecked. C3: the receipt "Application submitted" with the quote and the original estimated window; Next names the assigned operator (on submission Core gives the case back to that operator). Nothing was submitted before the TA's own submission. | T (L per Q-W03-08) | UX §3.2 (Approved assistance), §12 V07; PL §4.2 A6; design §3.1, §5.6; review R-13 |
| WP03-A174 | TA (`syn-ta-1`) | TA-07 and TA-08 returned mode of a submitted case that the operator formally returned (fixture, or set-up through the existing operator page per Q-W03-08) | Open TA-07. Correct the asked item on TA-09. Open TA-08. Select "Hand the application back". | TA-07: the operator's note first; Editing "Returned to you for correction"; action "Correct the application". TA-08 returned mode: "What your operator asked: [note]" first; the check-answers sections; "Quoted at submission: ₹3,500 (unchanged)" and "Original estimated window: [dates] (unchanged)"; no statement checkboxes; no "Submit this application"; primary "Hand the application back" (the existing hand-back form, moved, Q-W03-06). C3 on TA-07: "Handed back to your operator": quote unchanged, original estimated window unchanged, Next "Your operator checks the application again". The assigned operator is the same person as before the return. | T (L per Q-W03-08) | UX §2.3, §3.2; BS B17, B18; design §5.6; Q-W03-06; D-W03-11; review R-13 |
| WP03-A175 | TA (`syn-ta-1`), two tabs | TA-08 returned mode | Open TA-08 in tab 1. In tab 2 change a detail on TA-09d. Hand back from tab 1. | C5 "Changed since your review" with the current facts; nothing is handed back. After "Review current information" the hand back succeeds once; quote, window and operator are unchanged. | T | `core.hand_back` (revision); UX §3.3; review R-13 |
| WP03-A176 | TA; harness | TA-08 returned mode, the Nth time | Send the accepted hand-back request again with the same key and fields. Press the browser Back button after the receipt. Inject a lost acknowledgement. | Same key: the same receipt; one hand back; quote, window and operator unchanged. Back reloads TA-08 (WP-01 A-02): the case is with the operator, so the page shows the assigned notice and no form. Lost acknowledgement: C4 on the operation page; no new hand back is offered there. | T | PL §7 K-STD; BS B35; W1 A-02; review R-13 |

### 2.11 Command results, access and shell on WP-03 pages

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP03-A129 | TA; harness | Every accepted WP-03 command reachable on `lane-ui`; edited receipt addresses | Read each receipt. Open a receipt address with the done code of one command and the operation key of another command (for example `done=submitted` with a help request key), and one with the key of another application's operation. | CMP-08 as WP01-A82: the request reference links to the operation status page; resulting facts; "Recorded once. Sending the same form again does not repeat it."; no accepted time (P-02); times carry IST. The receipt names a result only when the operation returns the expected resource id of this page and the command-specific summary (for example the submission id for "submitted", the help request id for "assistance"). Document facts are selected by the returned version and association ids. Facts read later are labelled "Current" (C-03). Edited addresses: "Request reference [key]. The receipt cannot be checked now." and no acceptance claim. The polite region announces the result. | L+T | PL §1.1 ACC; W1 (P-02, A-04); C-03; WP-02 B-02; review R-03 |
| WP03-A130 | TA | Each command of §1.2 with a lost acknowledgement (fixture); a command that Core refused | Inject the fault. Open the operation status page. Select "Check status" after the original resolves. Open the status page of a refused send's key. | C4 (CMP-13): "Checking the original result" and "Check status"; that page offers no new submission of the same intent. "Check status" reads the same operation and shows its accepted result. A refused command leaves no operation record: its status page says "Nothing is recorded for request [reference] so far" (WP-01 A-08) and claims neither acceptance nor refusal. A refusal, and any stale comparison, shows only on the re-rendered form. | T | PL §1.1 UNR, §1.4 C4; BS B35; W1 A-08; review R-12 |
| WP03-A131 | TA; harness | Each command of §1.2 | (1) After acceptance, send a raw identical envelope (same key, same content). (2) Same key, different content. (3) A new key for an intent that Core already holds. (4) A raw resend of a refused envelope. | (1): the original result (identity correction included, C-04). (2): refused as a conflict; no second record. (3): the command's own business check decides: duplicate scope for "Create drafts"; "not a draft" for submit; "help request already open" for help. "Create group" has no business key, so a new key creates another group (accepted, Q-W03-17). (4): no record exists, so Core evaluates the envelope again and refuses it again. Browser Back is not a replay: it reloads the page with a fresh form (WP-01 A-02; A14, A57, A123). | T | PL §7 K-STD; BS B35; C-04; Q-W03-17; review R-12 |
| WP03-A132 | TA | Every refusal reachable on `lane-ui` in A09 to A128 | Read each message. | CMP-07 with the reason in words, the owner or route where one exists. A message is never a code alone; where the text is missing, the code itself shows with a plain sentence (UAT-13). No "Something went wrong", "Invalid data" or forbidden label. | L | PL §1.1 REJ, §11.1; CR-01; SC §3.4; UF UAT-13 |
| WP03-A133 | TA | Every reason code that TA-01, TA-04 to TA-09, TA-13 and the document detail can show | Check the text map against the reason vocabulary and the intake text catalogue (S-01). | Every code has travel-agent text, or falls back to showing the code. No known code falls back to "This is not available at the moment." | T | CR-01; LP §8 S-01; SC §3.4 |
| WP03-A134 | TA (`syn-ta-1`), SuperAdmin | TA-09 with unsent input; any WP-03 page | (1) While TA-09 holds typed values, `superadmin-1` suspends `syn-ta-1`; the TA sends the form; the SuperAdmin restores the account. (2) Sign out from TA-07; press Back. | (1) The TA lands on sign-in; no restricted content shows; nothing is created. (2) Back shows the sign-in page, never TA-07 content (A-02). Any region that refreshes later follows A-01. | L | PL §2.3 SH-R04, SH-R11; W1 A-01, A-02; BS B10 |
| WP03-A135 | TA | Every WP-03 page | Read the shell. | Environment label; "[TEST]" title prefix; rail current item: "Home" (TA-01), "Groups" (TA-04, TA-05, TA-13), "Applications" (TA-06 to TA-09, document detail); breadcrumb; one `h1`; freshness line where the page shows derived data. | L | PL §2.1, §2.2; WP01-A01, A08, A16 |
| WP03-A136 | TA | TA-09, TA-07, document detail | Inspect `localStorage`, `sessionStorage` and IndexedDB after using the pages. Read the cache headers. | No identity document, extracted personal data or typed passport number is kept in browser storage. Signed-in pages send `no-store`. | L+T | PL §2.3 SH-R12; UX §3.3 |
| WP03-A137 | TA | Every WP-03 page | Read all visible text. | No forbidden label of §11.1 ("Approved" or "Done" as an overall status, "Ready" as a universal state, "Submit for TA", "Submit all", "Merge people", "Mark verified", "Pay now"). Times carry IST. Counts name their unit. Synthetic offerings carry the synthetic label. | L | PL §11.1; CR-06, CR-07, CR-08 |
| WP03-A138 | TA | TA-09, TA-08, TA-07 | Compare names and identity facts. | Applicants are identified by passport number and issuing country. No page merges, suggests or links people by name. | L | BS B15 ("never name-only/probabilistic merge"); §11.1 ("Merge people") |
| WP03-A179 | TA (`syn-ta-1`), SuperAdmin | TA-01, TA-05, TA-06, TA-07, TA-08 and DOC (HTTP tests with access revoked between the page's first read and an optional read) | Let the first read succeed. Let an optional read (delivery facts, evidence, group, notices, import issues) answer an access refusal, an authentication refusal, maintenance or a support-view refusal. | The page renders the access page (SH-02, sign-in or maintenance), never the facts read earlier. Only an availability failure degrades a block to "Unavailable". No page code catches every error around a read. | T | LD-14 (C-02); PL §2.3 SH-R04; BS B10; review R-02 |

### 2.12 Accessibility (AC-01 to AC-28 that apply) and V24

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP03-A139 | Keyboard-only TA | V05 steps A1 to E4 at 1440 px; A1, B1 and E3 at 390 px | Use the keyboard only. | Every step works with Tab, Shift+Tab, Enter, Space and Escape: create group, choose services, choose files, save sections, request help, use "Change" links, confirm and submit. No action needs a mouse, hover or drag-and-drop. | L | AC-01, AC-12; UX §12 V24 |
| WP03-A140 | Keyboard-only user | Every WP-03 page at 1440 and 390 px and at 400% zoom | Tab through the page. | Focus is visible (at least 3:1) and never hidden by the top bar, the rail or a sticky area. | L | AC-02 |
| WP03-A141 | Phone user | TA-01, TA-04, TA-05, TA-06, TA-07, TA-08, TA-09, TA-13, document detail | View at 320 px, and at 1280 px with 400% zoom. | No two-dimensional page scrolling. Wide tables scroll only inside a labelled region, or become cards. Identity, reason, owner and next action come before secondary data. | L | AC-04, AC-21; UX §7.3 |
| WP03-A142 | Any | Every WP-03 form | Inspect each input. | Each input has a visible label. Each file input has a "Choose file" button and states formats and size limit. The confirmation checkbox is labelled with its statement. The service choices and the evidence chooser options are labelled. | L | AC-05, AC-15; CMP-28 |
| WP03-A143 | Any | Progress, evidence, task-list and group states | View in greyscale. | Each state has text (and an icon where the plan shows one). No state is shown by colour alone. | L | AC-06 |
| WP03-A144 | Any | Every WP-03 form | Submit each form with an error. | Focus moves to the error summary. Each summary link moves focus to its field. Entered values stay; the page says which files must be chosen again. | L | AC-08; CMP-07 |
| WP03-A145 | Screen-reader user | TA-09 task list, evidence rows, receipts, "View requirements" panel | Read with VoiceOver or NVDA. | Each task link is followed by its state. Each evidence row label includes the document type and the state. Receipts are announced politely. The panel is announced with its title; Escape closes it and returns focus. | L | AC-09; CMP-02, CMP-04; UX §7.5 |
| WP03-A146 | Screen-reader user | Each unavailable action: submit blocked (A116, A117), assigned read-only (A103), closed group (A36), offering unavailable (A35, A125) | Focus the control or the notice. | The reason is exposed (`aria-describedby`, or the notice in reading order). A role-forbidden action is not shown at all. | L (T for fixtures) | AC-13; CMP-10; PL §2.3 SH-R08 |
| WP03-A147 | Phone user | Every WP-03 page at 390 px | Measure each control. | Every control is at least 24 × 24 CSS px. Primary actions ("Create group", "Create draft", "Save and continue", "Submit this application") are at least 44 × 44 CSS px. | L+T | AC-10 |
| WP03-A148 | — | Every WP-03 page | Measure contrast of text, focus, status labels and notices. | Normal text at least 4.5:1. Non-text indicators and focus at least 3:1. | L+T | AC-11 |
| WP03-A149 | Any | Long names; reduced motion | Use an applicant with 60-character surname and given names, a 120-character group name and a long file name (fixture or synthetic run data). Turn on "reduce motion" and open the "View requirements" panel. | Names wrap without hiding identity. A truncated text has a full form that keyboard and touch reach. No transition plays. | L | AC-14, AC-20 |
| WP03-A150 | Screen-reader user | TA-04, TA-06 and the documents table | Inspect the tables. | Header cells exist. A table that scrolls is a labelled region. | L | AC-15; AC-04 |
| WP03-A151 | TA participants (people) | TA-07 on a phone at 390 px, for a draft, a submitted and an assigned application | Ask each participant: who acts next, and what must happen next? | Record task success, errors, hesitation and the sample size. No target is invented. A participant who names the wrong owner or action is a finding. | L | UX §12 V24; AC-24; AC-26 |

### 2.13 axe checks (WCAG 2.2 A/AA)

Rule for every row: run axe (`@axe-core/playwright` 4.13.0, tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`,
`wcag22aa`) at 1440 × 900 and at 390 × 844. Expected: no violation of impact "serious" or "critical" at either width.
Record the counts of minor and moderate violations. The harness MUST NOT take a screenshot of a page that shows a
real person's data; WP-03 uses synthetic samples only.

| ID | Persona | Page (state) | Where | Source |
|---|---|---|---|---|
| WP03-A152 | TA | TA-01 with "Needs your action" items (A02) | L | UX §7.5; AC-01 to AC-28 |
| WP03-A153 | TA | TA-01 empty (A04) | L (or T) | same |
| WP03-A154 | TA | TA-13 create with the error summary (A11) | L | same |
| WP03-A155 | TA | TA-13 create review and receipt (A13) | L | same |
| WP03-A156 | TA | TA-13 edit with the stale comparison (A21) | L | same |
| WP03-A157 | TA | TA-04 with filters and the S3 state (A24) | L | same |
| WP03-A158 | TA | TA-05 Applications tab with closure facts (A30, A31) | L | same |
| WP03-A159 | TA | TA-05 at 390 px with its sections stacked (A32) | L | same; D-W03-06 |
| WP03-A160 | TA | TA-09 create, fresh, with "View requirements" open (A40, A43) | L | same; §14.2 |
| WP03-A161 | TA | TA-09 create with the passport-number refusal (A45) | L | same; §14.2 |
| WP03-A162 | TA | TA-09 receipt with two applications (A51) | L | same |
| WP03-A163 | TA | TA-09 task list (A59) | L | same |
| WP03-A164 | TA | TA-09 documents section with an evidence conflict (A71) | L | same |
| WP03-A165 | TA | TA-09 section with the stale comparison (A72) | L | same |
| WP03-A166 | TA | Document detail with the resolve form (A77, A78) | L (or T) | same |
| WP03-A167 | TA | TA-06 with filters (A85) | L | same |
| WP03-A168 | TA | TA-06 search results (A87) | L | same |
| WP03-A169 | TA | TA-07 draft with help requested (A99) | L | same |
| WP03-A170 | TA | TA-07 assigned, read-only notice (A103) | L | same |
| WP03-A171 | TA | TA-08 with the error summary (A115) and blocked controls (A116) | L | same |
| WP03-A172 | TA | TA-08 receipt (A118) and the price-changed comparison (A120) | L (A120 per Q-10) | same |

## 3. Proof scenario V05

V05 (UX §12): "Explicit per-application submission/authority fixes quote and original estimate; help/import/payment
never substitutes; changed forecast stays separate." Authority B17. Sources: UX §3.1 steps 3 and 4, §4.3; BS B17,
B18, B26; PL §4.1 steps 4 and 5, §4.2 A1 to A6, TA-07, TA-08. Data: §0.3 and §0.4. The run tag `<run>` is in every
group name.

### Part A. Baseline (L)

| Step | Action | Observable result |
|---|---|---|
| A1 | `syn-ta-1` creates "WP03 [run] G1" in Synthetica, start = run date + 30 days, return = start + 7 days (A13). | Receipt; TA-05 S2 (A37). |
| A2 | Record the counts of groups and applications of `syn-ta-1` (TA-04, TA-06). | The run record holds them. |

### Part B. Intake and help create no submission (L)

| Step | Action | Observable result |
|---|---|---|
| B1 | TA-09: sample "Asha", "SYN Tourist e-visa", passport file only (A50). | One draft. TA-07: "Draft", "Outcome not recorded", "If you submit today: ₹3,500" (A95, A97). No quote is fixed. Home and TA-06 list it as needing action (A03). |
| B2 | Request help with a note (A99). Try a second request (A100). | Receipt "Help requested". The application stays a draft. TA-08 still asks for the confirmation. No submission exists. |
| B3 | Read TA-07 history (A111). | "Draft created" and "Help requested". No "Submitted" line. |

### Part C. Payment creates no submission (T, Q-W03-08)

| Step | Action | Observable result |
|---|---|---|
| C1 | Run the named test that records a service payment for a draft (or that Core refuses it), then reads the TA case. | Either way the application stays a draft: no quote fixed, no submission, no original estimate start. When the record is accepted, TA-07 shows the payment fact as its own row. |

### Part D. Import creates no submission (T)

| Step | Action | Observable result |
|---|---|---|
| D1 | Run the named tests that a bulk import and an individual intake create drafts only (for example `test/intake/individual.test.ts` and the bulk-rows tests). | No intake path records a submission, a quote or a confirmation. |

### Part E. Explicit submission fixes quote and estimate (L)

| Step | Action | Observable result |
|---|---|---|
| E1 | Add the photograph (A67); choose Travel purpose "Tourism" (A61). | Evidence rows reach their verdicts. TA-07 offers "Review and submit" (A96). |
| E2 | Open TA-08 (A112). Submit without the confirmation (A115). | C1. Nothing submitted. |
| E3 | Confirm and submit (A118). Double-click and Back-resend (A123). | One submission. Receipt with ₹3,500, the original estimate = submission date + 5 to + 12 days, the next owner. |
| E4 | Read TA-07 (A102, A119). | Quote fixed; original estimate shown; current forecast "Not recorded"; payment separate. |

### Part F. A correction before assignment keeps the quote (L)

| Step | Action | Observable result |
|---|---|---|
| F1 | Replace the photograph (A76). | Correction recorded. Quote and original estimate unchanged. |

### Part G. Assignment and forecast (T, Q-W03-08)

| Step | Action | Observable result |
|---|---|---|
| G1 | Test fixture: a service payment is recorded for the submitted application and an operator is assigned. | The assignment succeeds (Gate 1 met). |
| G2 | Render TA-07 and a TA-09 section of the assigned application; send an edit by hand (A103, A75, A104). | Read-only notice with "Report a problem". The hand-made edit is refused. |
| G3 | The assigned operator records a forecast that ends after the original estimate; render TA-07 (A105). | Original estimate unchanged; current forecast shows separately; quote unchanged. |

### Part H. A price change after review never changes an authorized quote (T, Q-W03-08)

| Step | Action | Observable result |
|---|---|---|
| H1 | Test installation: submit application P1 at the current price; open TA-08 of draft P2 of the same offering. | P1 receipt shows the current price. |
| H2 | Publish a higher price with a continuation that moves drafts to the new values. | The publication lists 1 affected draft. |
| H3 | Send the open TA-08 of P2 (A120). | C5 "The price changed since you reviewed it". Nothing submitted. |
| H4 | Review and submit P2. Read TA-07 of P1. | P2 quote is the new price. P1 keeps its quote (an increase needs renewed TA authority, B17). |
| H5 | Run the test that an unpaid price reduction applies automatically and a paid one does not (B17). | Both pass. The page shows the reduced price as a new price record with the earlier quote kept in history. |

No seeded or WP-02 proof offering changes on `lane-ui` for this part.

### Part I. Result

V05 passes when parts A, B, E and F show their results on `lane-ui` at the integrated WP-03 commit and the named
tests of parts C, D, G and H pass at the same commit (Q-W03-08: no staff-page writes on `lane-ui` for V05). The run
record names each test, the `lane-ui` ref, the run tag and the identifiers.

## 4. Proof scenario V02

V02 (UX §12): "One row yields two services; two independent applications retain separate quote/authority/owner/outcome
and no cross-group reuse." Authority B03, B14. WP-03 proves V02 through the individual form (one applicant, two
services). The bulk row variant belongs to WP-04 (BU-01 and the bulk proofs).

### Part A. One applicant, two services, two applications (L)

| Step | Action | Observable result |
|---|---|---|
| A1 | `syn-ta-1` creates "WP03 [run] G2" in Synthetica (dates as V05 A1). | Receipt. |
| A2 | TA-09c: the synthetic applicant "Ravi" (harness-generated passport), services "SYN Tourist e-visa" and "SYN e-visa, fee paid with submission", nationality IND, passport and photograph (A51). | Two drafts A (₹3,500) and B (₹3,600). TA-06 shows two rows (A94). |
| A3 | For each of A and B, on TA-09d: passport type "ordinary", country of residence IND, nationality IND when none is recorded, Travel purpose "Tourism"; "Save" (A61). | Each receipt "Application details saved" names its own application; saving A changes nothing on B. Afterwards TA-08 of each shows no blocker for the population declaration or the declared field; only evidence blockers can remain. |

### Part B. Separate facts (L)

| Step | Action | Observable result |
|---|---|---|
| B1 | Open TA-07 of A and of B. | Each has its own reference, service, price, task list, evidence rows and history. The passport given on the form shows on both as each application's own association. |
| B2 | Replace the photograph of A only (A69). | B's photograph row is unchanged. |

### Part C. Separate authority and quote (L)

| Step | Action | Observable result |
|---|---|---|
| C1 | Submit A with its confirmation (A118). | A: submitted, quote ₹3,500. B: still a draft; no quote fixed; its TA-08 asks for its own confirmation; B's history has no submission line. |
| C2 | Request help on B from TA-08 (A126). | B: help requested. A: unchanged. |

### Part D. Separate owner (L)

| Step | Action | Observable result |
|---|---|---|
| D1 | Setup (existing staff pages): SuperAdmin records payment and assigns syn-operator-1 (application A only). | A: read-only notice (A103). B: still editable by the TA; next owner the TA (or the SuperAdmin help decision). |

### Part E. Separate outcome (T)

| Step | Action | Observable result |
|---|---|---|
| E1 | Run the named test that records an outcome on one application of a two-service intake. | The other application's outcome stays "Outcome not recorded"; its lifecycle and next action do not change. |

### Part F. Duplicate scope and no cross-group reuse (L)

| Step | Action | Observable result |
|---|---|---|
| F1 | TA-09 in G2: "Ravi" again with "SYN Tourist e-visa" (A52). | Refused as a duplicate with a link to A. Nothing created. |
| F2 | `syn-ta-1` creates "WP03 [run] G3" in Synthetica. TA-09 in G3: "Ravi", "SYN Tourist e-visa", no files. | Accepted as an independent application C. C has its own quote (none yet), status and history. |
| F3 | On C, open "Use a file already in this group" for the passport (A70). The harness sends the association of A's passport version by hand. | The chooser lists no version of G2. The hand-made request is refused; nothing about G2 is disclosed. C's passport row stays "Missing" until a file is uploaded to C. |
| F4 | `syn-ta-2` searches for "Ravi" and opens the addresses of A, B and C (A88, A107). | No result; SH-02 identical to not found. |

### Part G. Result

V02 passes when parts A, B, C, D and F show their results on `lane-ui` at the integrated WP-03 commit and the test of
part E passes. The run record names the test, the ref, the run tag and the identifiers.

### Part H. V07 and V24 in WP-03 (traceability)

| Scenario part | Items |
|---|---|
| V07: an assigned TA can only report; no edit, upload or submission, also when the assignment arrives during an edit | A103, A104, A75, A177 |
| V07: approved help that starts during an edit removes the forms and keeps the unsent text | A178 |
| V07: approved assistance ends in the TA's own review and submission | A173 |
| V07: a formal return lets the TA correct; the hand back keeps the quote, the window and the same operator | A174, A175, A176 |
| V07: the operator reconfirms readiness after the return | Not in WP-03 (WP-07, WP-09) |
| V24: keyboard and phone workflows; error locations; next owner and action | A139, A141, A144, A151 |

## 5. Out of scope and boundaries

These MUST NOT appear on any WP-03 page:

- A group-level "Submit all", a submission without the TA's own confirmation, a prechecked confirmation, or a
  confirmation that shows a code or a humanized code in place of its statement (UX §4.3; BS B17; Q-W03-02).
- In production, a submission form for a statement whose text is not approved (C-08); in a test installation, draft
  statement text without the "Draft wording" mark.
- A submission form while the evidence read is unavailable (C-05).
- A "Submit for TA" label, or help, payment or import that changes an application to submitted (BS B17, B18).
- An "all documents complete" gate that the declaration does not declare (UX §4.3; PL §5.2 TA-08).
- A receipt that claims a file is replaced before Core switches the association (C-09), or a receipt that names a
  result the operation does not return (C-03).
- A deadline, SLA, approval promise, "Pay now", support hours or a computed date that the read models do not state
  (UX §4.4, §9 C13; BS B17).
- A passport number format stated by the page itself, or a passport file shape that the command refuses (§14.2).
- Search text, personal data or a typed passport number in the page address (SH-R06).
- A document of another group offered or accepted for an application (BS B03), or a merge of people by name (BS B15).
- An edit, upload or submission control on an assigned application that is not formally returned (BS B18).
- A "Ready to close" or closure promise on TA-05, or a closure state computed by the page (AD-06; BS B25).
- Earlier private facts on a page after an optional read was refused for access (LD-14).
- A count shown as "0" when it is unknown, or a list that hides its row limit (D7).

Deferred in WP-03 (recorded decisions; each item says where it lands):

- TA-05 Imports and Import issues as tabs: sections with Core counts and links until WP-04 (D-W03-06).
- TA-04 counts by common progress, import issues per group, next action per group and the country filter; the TA-13b
  impact preview of affected applications (D-W03-07; P-09 for the facts).
- TA-06 service and country filters and sort (D-W03-08; P-09).
- TA-01 recorded date per action item (D-W03-09).
- TA-07 and TA-08 service mode, country on TA-07, "who files", the assigned operator's name, and the submission time
  on the receipt (P-09 facts; P-02 for the time; "your operator" until a name fact exists).
- TA-03 "Start an application" with the country chosen: stays `/ta/groups` until P-09 serves the country id
  (Q-W03-16).
- Polling of document checks: "Check again" only (D-W03-13). "Save and continue" and "Save and exit": one "Save"
  per section (D-W03-14). A stored return position on TA-06.
- TA-09-R1 two-file passport shape and the statuses "incomplete" and "over_supplied": seam v2 passport parts (DEP-2,
  P-08); until then the one-file shape and the rule text only (A44 partly met).
- TA-09-R2 two-shape Indian passport rule in Core: bulk commit 4496ee9 on main (DEP-1, P-08); until then a valid
  two-letter number is still refused by Core (UAT-09 stays open in the bulk lane).
- The TA history page rebuild (WP-08, Q-W03-15).

Not in WP-03 (later packages or other lanes):

- Bulk pages BU-P01 to BU-P10, the bulk bot check (UAT-08), per-source fields (UAT-06), self-refresh of an import
  (UAT-10), the imports overview across groups (UAT-11, P-01), the Drive folder fault (UAT-12) and the bulk "See the
  reference code" fault (UAT-13): WP-04, WP-05, WP-18 and the bulk lane.
- Services chosen at group creation (UAT-07): a Kind 2 change in the bulk lane; TA-13 builds no service choice now.
- A "New application" entry outside a group (UAT-04): Max ruled P2, decide later.
- Report a problem, the operator's formal return and the help decision (WP-07, WP-09); price decision, withdrawal,
  forecast recording, the travel-date recheck, held corrections and "Close the group" (WP-17); dependencies (WP-10);
  changed terms (WP-13); outcome, delivery and result download (WP-08); TA-10, TA-11, TA-12. Each of these stays
  reachable as it is today (carried forms, §1.2, A106).
- Payment, assignment and forecast pages (WP-06, WP-17): used here only as proof set-up, as tests per Q-W03-08.

## 6. Questions for the architect (ranked)

| ID | Rank | Question | Concrete scenario | PM recommendation |
|---|---|---|---|---|
| Q-01 | P1 | When WP-03 rebuilds TA-07 and TA-05, what happens to the commands that the current pages post for later packages? Today the application page posts report a problem, hand back, withdrawal, price decision, transition decision, dependency link and unlink, reapply correction and the result download; the group page posts "Close the group". CC assigns them to WP-08, WP-09, WP-10, WP-13 and WP-17. | WP-03 integrates a TA-07 without the "Report a problem" form. On `lane-ui` an assigned TA sees the read-only notice that names "Report a problem" and finds no such action; Max's manual tests of a price decision or a withdrawal fail until WP-17. Likelihood: certain if the rebuild drops the panels. | Keep each existing panel as a transitional section of the rebuilt page, unchanged, with a unit test that lists the transitional panels (as WP-01 Q-12 did for the rail). Each later package replaces its panel. A106 checks this. |
| Q-02 | P1 | TA-09-R1 says the TA MAY give two files, one per page. `intake.start_individual` accepts one file per requirement type (duplicate field names are refused), and `doc.upload_for_application` takes one file per requirement. The shape is owned by the bulk lane (UAT-14 document policy) and the route handlers are orchestrator-owned (SC §1). | The page says "two files, one for each page"; the TA chooses two files; the send is refused as invalid input, or the second file replaces the first. The TA concludes that the rule text is false. Likelihood: certain until the bulk lane's change is integrated. | WP-03 integrates against the seam version that serves the two-file passport. Until then the form states the rule, offers one passport input that says "one file with both pages", and records TA-09-R1 as "partly met"; the architect sends a seam request (rank P1) naming the field shape the UI needs. |
| Q-03 | P1 | Where does TA-09-R2 get the expected format? The refusal carries only `passport_number_invalid`; the rule lives in `src/modules/intake/domain/fields.ts` (bulk lane), and the page MUST NOT state its own format. | The UI hard-codes "one letter and seven digits"; the bulk lane fixes the rule (UAT-09) to accept two letters and six digits; the page now tells the TA a wrong format. Likelihood: high, because the fix is planned. | Seam request: the refusal (and the start-page read) carries a closed format code per issuing country (for example `ind_letter1_digit7`, `ind_letter2_digit6`); the UI words each code; A46 tests that the message follows the rule. Until served, the message says the number does not match the format accepted for that country, and A45 is "partly met". |
| Q-04 | P1 | TA-08 MUST show the actual authority confirmation (UX §4.3, C05). Core holds only the item code and text version (`ta_confirms_details`, `syn-1`); today the page shows "Ta confirms details". No approved text exists (UX §9 C05: "Use marked draft copy"). | A TA submits after ticking "Ta confirms details". The recorded confirmation proves nothing about what the TA agreed to. Or the UI writes its own legal wording that nobody approved. Likelihood: certain without a decision. | Keep a copy table keyed by (code, text version) with draft text marked as draft (CR-09) and a release blocker for unapproved confirmation copy (as WP-20 does for public copy). An unknown (code, version) pair blocks submission with a boundary notice ("Submitting is unavailable until the confirmation text for this service is approved. Owner: product owner."), never a fallback to the code. Ask Max for C05 text. |
| Q-05 | P2 | Several plan facts have no read-model field: TA-04 counts by common progress and intake issues per group; TA-06 country and travel date per row (group facts) and the country and service filters; TA-01 recorded date per action item; the operator's name on TA-07 (only an account id); the submission time on the TA case; the 200-row limit of `core.ta_applications`. | TA-04 shows "2 applications" with no progress split, or the page computes counts from a list that stopped at 200 rows and shows a false total. TA-07 shows an account id as the owner. Likelihood: medium. | Join authoritative reads where the fact exists (group country and dates from `core.ta_groups`; counts from `core.ta_applications`; issues from `intake.incidents`). Show "Unavailable" when a read hits its limit (A27). Say "Your operator" until a name fact exists. Show no recorded date on TA-01 until one exists. List the gaps as one Kind 1 request only if Max wants names or dates. |
| Q-06 | P2 | How does TA-06 search keep the text out of the address (SH-R06) and still support Back and reload? Today `/ta/search?q=` carries the text. | The TA searches, opens a result, presses Back and gets a "resend form data" prompt, or the text sits in the history and in shared screenshots. Likelihood: high without a decision. | Option 1: a POST search that renders results with `no-store`; Back returns to the list without results. Option 2: an opaque, session-bound search reference in the address that expires with the session. PM prefers option 2 (Back and reload work; the text never leaves the server). Either way A87 applies. |
| Q-07 | P2 | Where does TA-09 live, and who changes the route handlers? The individual form today shares `/ta/groups/:groupId/intake/new` with the bulk form, and `src/apps/edge/intake/routes.ts` and `src/apps/shared/ta-intake.ts` are orchestrator-owned (SC §1). | WP-03 edits the shared handler and conflicts with the bulk lane's command-shape change. Likelihood: medium. | TA-09 create gets a new path (the unregistered inventory entry T09 `/ta/groups/:groupId/applications/new`) that posts to the existing `ta.intake.start_individual` action; "Add applicants" offers both entries; the bulk form stays on its page until WP-04. Send the handler change to the orchestrator as a proposal. |
| Q-08 | P2 | `core.edit_travel_dates` is a WP-17 row in CC, but TA-13 edit mode is in WP-03 scope. Core has no impact preview query. | TA-05 shows "Edit travel dates" and the link opens an old form, or nothing. Likelihood: certain without a decision. | Build the edit form and command in WP-03 (A18 to A22) with the receipt Core supports; keep the affected-work preview in WP-17 (a Kind 1 request if needed). Move the CC row to WP-03. |
| Q-09 | P2 | The proofs need synthetic sample documents on the harness: passports with valid machine-readable lines (series S or P; valid 6 months after return; both IND number shapes), a front-page and back-page pair, photographs above and below 350 × 350 pixels. The test-plan samples were in the preview's samples folder, which I did not find on this machine. | The harness uploads an image without a readable machine-readable zone; every applicant ends in "conflict" or "unreadable"; V05 cannot reach "Review and submit". Likelihood: high. | The orchestrator (or the harness under `test/uat/`) generates the samples from synthetic data under C07 rules and keeps them outside the repository, or commits only synthetic fixtures. Never real passports. |
| Q-10 | P2 | V05 part H needs an offering whose price changes without touching seeded data. | A proof run raises the price of "SYN Tourist e-visa"; later tests and Max's manual checks show ₹3,600. Likelihood: low, but harmful. | Use the run-tagged WP-02 proof offering in the WP-02 D11 group (the group stays open after the country is unlisted). Raise the price only (an unpaid reduction applies automatically). If the WP-02 proof did not run on `lane-ui`, part H runs by named test. |

## 7. Sign-off

| Field | Value |
|---|---|
| Verified on (date, IST) | 13 October 2026, 11:15 to 12:40 IST |
| Installation and ref (`uat.py status lane-ui` output: commit or tag) | `lane-ui`: ref 0e38a04, release rel_3JEW9KWV588AXDY15QGPRD2ZCR (unchanged before and after the run; data and accounts kept) |
| Lane commit of the tests named for `T` items | 0e38a04, run in a clean copy (`git archive 0e38a04`; node_modules unchanged). Unit 388 (387 pass, 1 todo); unit/web 965 (964 pass, 1 todo); system 110 pass; database (core, intake, documents, integration) 192 pass; UI gallery and status 1310 pass. All 337 cited tests pass. Logs and the item map: `research/proofs/wp03/tests/` |
| Seam contract version and bulk-lane commit integrated (Q-02, Q-03, UAT-09 fix) | Not integrated at 0e38a04: passport number rule 4496ee9 (DEP-1) and passport parts (DEP-2). S-14 (shared intake handler cuts) open |
| Run tag and identifiers (internal record reference) | Tag r1013k. Groups, drafts, versions and operation keys: lane `research/proofs/wp03/state.json`; the writes are listed in section 8.2 |
| Browsers and versions | Chromium 153.0.8010.12 headless (Playwright 1.63.0) at 1440 x 900, 390 x 844 and 320 px; one page with reduced motion |
| Assistive technology used | None. axe-core 4.13.0 (@axe-core/playwright 4.13.0, tags wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa); keyboard-only driving; DOM checks for labels, focus, targets, reflow and storage |
| V05 result (parts A to I; where shown) | Pass: A, B, E, F live on `lane-ui`; C, D, G, H by named tests at 0e38a04 (C and H assert the outcome indirectly, see the V05 row) |
| V02 result (parts A to G; where shown) | Pass: A, B, C, D (set-up through the existing staff pages), F live; E by named tests |
| TA participants for A151 (number; results) | 0; not run |
| Open findings (ID, rank, scenario) | F-01, F-02, F-03 P1; F-04 to F-15 P2; no P0. See section 8 |
| Signed by (role and name) | Principal Product Manager (Claude Opus subagent), 13 October 2026 |

Result per item (Pass, Fail, Not proven, Deferred; evidence reference; note). Evidence: lane folder
`research/proofs/wp03/` (manifest `manifest.sha256`, 196 files, SHA-256 0692f620928ea6d6a4021d22cb992575863e7b9ad95eca19a14c2f4b90e45969). A script name
(for example `s3b-v05-submit`) means that step's run on `lane-ui` at 0e38a04, with its log, `results.jsonl`,
`axe.jsonl`, `facts.jsonl`, the DOM dumps in `dom/` and the screenshots in `shots/`. A test reference names the file
and the test title at 0e38a04 (`tests/map.jsonl`). Totals for the 180 items: 133 Pass, 15 Fail, 31 Not proven, 1 Deferred. "Not proven" names what no
live check and no test shows. The only Deferred item names its seam item.

| ID | Result | Evidence | Note |
|---|---|---|---|
| WP03-A01 | Pass | s1-groups; s1b-fix | Sign-in lands on `/ta`; `/home` answers `/ta`. Rail (main navigation) starts with "Home", marked current. One h1 "Home". "Read at … IST". |
| WP03-A02 | Pass | s1-groups; dom/s1-a01-home | Order: "Needs your action" list, then shortcuts "Browse services" and "Create a group"; travel-risk and recent blocks hidden while empty (design §2.1). Each item: applicant, service, reference, reason in words, one action link to its application or task list. No recorded date shown. |
| WP03-A03 | Pass | s5b-lists | Home: "15 applications need your action", 15 items; TA-06 `view=needs_action`: "15 applications shown", the same 15; rail "Applications 15 need attention". |
| WP03-A04 | Pass | s6-isolation (syn-ta-3); ta-home.test.ts "teaches the sequence …" | "Start here" with the three steps, "Every application belongs to a group. A group holds one country and one set of travel dates.", links "Browse services" and "Create a group"; no country, number or "0". |
| WP03-A05 | Not proven | ta-home.test.ts "says 'Nothing needs your action now.' when applications exist and none needs it, and still shows the notices" (pass) | T part passes. L part not run: no travel agent on `lane-ui` holds applications of which none needs action. |
| WP03-A06 | Pass | ta-home.test.ts "fails the page when the list cannot be read …", "render each on its own when a block cannot be read", "degrades each optional block on its own for an availability failure only"; status-pages.test.ts (pass) | By test (S7 by composition with the shell status page). |
| WP03-A07 | Pass | s5b-lists; shots/s5b-a07-home-390.png | 390 px: items are cards, name first, then service and reference, then the action; first item within the width; no page scroll. |
| WP03-A08 | Pass | s1-groups | No forbidden promise on TA-01; the count names its unit. |
| WP03-A09 | Pass | s1-groups | TA-04 "Create a group" opens `/ta/groups/new`; fields in order Country, Group name, Travel start date, Travel return date; countries Synthetica and Synthetica Beta only; one-country, India-time and applicants-after texts; "Cancel" returns to TA-04, nothing created. No review step (correction A13). |
| WP03-A10 | Pass | s1-groups; s2a-intake-refusals (A40, A41) | TA-03 "Start an application" opens `/ta/groups`; TA-13a has no country chosen; "Add one applicant" opens TA-09c with no service checked. |
| WP03-A11 | Pass | s1-groups; s1b-fix | With the page script: summary focused, 4 field messages. Server (hand-made empty post): HTTP 422, "Choose a country.", "Enter a name for the group, at most 120 characters.", start and return date messages; nothing created. |
| WP03-A12 | Fail | s1-groups; s1b-fix; F-03 | Server: HTTP 422 "The travel start date must be today or later, as an India date.", then "The travel return date must be on the travel start date or later."; values kept; nothing created. With the page script the first send stops in the browser with the browser's own text "Value must be 13/10/2026 or later." at both date fields. |
| WP03-A13 | Pass | s1-groups; dom/s1-a13-receipt; axe A155 | Keyboard create. Consequence line before the button; no review step. Receipt (neutral title per correction 13 Oct): "Request recorded", reference link, "Recorded: Once …", current group name, country, travel dates, state. Receipt first in `main` and in the title. TA-04 lists G1. |
| WP03-A14 | Pass | s1-groups; s1b-fix; system/web-shell.test.ts "a valid form runs its one command once …" | (1) double click: one POST, one group. (2) raw identical replay: the same receipt address. (3) same key, changed name: HTTP 409 "This form was already used with different content. Your values are kept …", new key, value kept. (4) Back: TA-13a with a new key (Chromium restores typed values in one case); the send created a second group (accepted, Q-W03-17). (5) refused send: new key; its status page "Nothing was recorded …"; corrected send created one group. |
| WP03-A15 | Pass | core/unlisted-country-work.test.ts "refuses a new group there …"; groups-pages.test.ts "a country that is no longer listed, a used form and an unknown code" (pass) | By test (no country is unlisted on `lane-ui`: seeded data stays). |
| WP03-A16 | Pass | system/interrupted-work.test.ts "reports an unknown outcome, never a refusal …"; system/web-shell.test.ts "says a request is still being processed …" (pass) | By test. |
| WP03-A17 | Not proven | core/groups-drafts.test.ts "creates a group of a listed country on the Asia/Kolkata basis …"; unit/time.test.ts (pass) | No create at 00:30 IST with a clock fixture; no test that the page never shows a UTC date. |
| WP03-A18 | Pass | s2c-dates | Dates now, country as a fact ("another country needs another group"), recheck and filed-work sentences; no affected list or count; "Cancel" returns to TA-05. |
| WP03-A19 | Pass | s2c-dates; dom/s2c-a19-receipt | Consequence text before the button. Receipt "Travel dates changed" with the recheck sentence and "Current travel dates"; no earlier dates, no affected list. TA-05 header shows the new date. No draft of group D showed the recheck wait after two changes (nothing to state). |
| WP03-A20 | Pass | s2c-dates; groups-pages.test.ts "a closed group: no form, the reason and the way back" (pass) | Same dates: "The dates are unchanged. Change at least one date, or cancel." Return before start: at the return field. Closed group by test. |
| WP03-A21 | Pass | s2c-dates; axe A156; F-14 | Tab 1: HTTP 409 "Changed since your review … Nothing you entered was saved", table field / your unsent value / current value, "Review current information"; nothing overwritten. The unsent value shows as "2026-11-22" beside "21 Nov 2026" (F-14). |
| WP03-A22 | Not proven | groups-pages.test.ts "the identical acknowledged request sent again is the same request …" (pass) | No test replays `core.edit_travel_dates` with one history change; no lost-acknowledgement test on the dates form. |
| WP03-A23 | Pass | s1-groups | Columns Group (country below), Travel dates, State, Applications; an empty group reads "No applications yet"; no 200-row line; "Read at … IST". |
| WP03-A24 | Pass | s1-groups; axe A157 | `?state=closed`: "No group matches this filter. 6 groups are in other states. Clear filters"; reload keeps it; Back restores; Clear resets; unknown value turns the filter off; no country filter. |
| WP03-A25 | Pass | s6-isolation (syn-ta-3) | "No groups yet", "A group is one trip: one country and one set of travel dates … Each applicant of the trip gets their own application in it.", "Create a group"; no zero count. |
| WP03-A26 | Not proven | none | No test renders TA-04 with a failed `core.ta_groups` read or an unreadable count. |
| WP03-A27 | Fail | applications-list.test.ts "says that it shows at most 200 applications …"; groups-pages.test.ts "the at-most-200 line shows only when Core returns its row limit" (pass); F-15 | TA-06 passes. TA-04 says "This list shows at most 200 groups." without how to narrow the list. |
| WP03-A28 | Pass | s1-groups; shots/s1-a28-ta04-390.png | Cards at 390 px, filter reachable, no page scroll at 390 and 320 px. |
| WP03-A29 | Pass | s6-isolation | syn-ta-2 sees its own group only; no syn-ta-1 group, count or hint. |
| WP03-A30 | Pass | s1-groups | h1 group name; breadcrumb "Groups"; country, travel dates "(IST)", "Group Open"; freshness; actions "Add one applicant" (design §2.3 name), "Import a list", "Change travel dates", "Group documents". |
| WP03-A31 | Pass | s1-groups; s10-final | Closure facts as Core reports them ("Imports still running 0 imports", "Open import issues 1 issue" after the run's intakes); no readiness or date claim. "1 application is not completed" is not a read-model fact (WP-03.md §6, U1). |
| WP03-A32 | Pass | s1-groups | Sections Applications, Imports, Import issues, Closing the group (rule text, Core facts, carried close form); no tabs. |
| WP03-A33 | Pass | s5b-lists | Row link carries `from=group`; breadcrumb "Groups › WP03 r1013k G1"; breadcrumb and Back return to TA-05. |
| WP03-A34 | Pass | s1-groups | No group-level submit, price, consent or outcome control. |
| WP03-A35 | Not proven | individual-intake.test.ts "shows no form when no service can be chosen, when the group is closed, or in a support view" (pass) | Not run live (no seeded offering may be suspended). The test does not assert the offering's own reason or the route. |
| WP03-A36 | Not proven | groups-pages.test.ts "a closed group is read only: no close form, no task link, its closed kind in words" (pass) | No test asserts that the applications of a closed group stay reachable. |
| WP03-A37 | Pass | s1b-fix | "No applications yet. Add the applicants of this trip …" with "Add one applicant"; no zero fact. |
| WP03-A38 | Pass | s6-isolation | syn-ta-2 on the G1 address and on an address with one changed character: the same HTTP 404 page, no group facts. |
| WP03-A39 | Not proven | none | No test renders TA-05 with a failed `core.ta_group` read or unreadable closure facts. |
| WP03-A40 | Pass | s2a-intake-refusals; axe A160 | TA-05 offers "Add one applicant" and "Import a list" (bulk, existing page). TA-09c context band: group, country, travel dates (IST). "View requirements" opens by Enter with documents, formats and sizes; Escape closes it and focus returns to its summary. |
| WP03-A41 | Fail | s2a-intake-refusals; F-06 | Only Synthetica offerings; provider route and SYX absent; several can be chosen; "each service becomes its own draft". No price beside any service (parked U5 P2). |
| WP03-A42 | Pass | s2a-intake-refusals | Every field has a visible label; passport number, issuing country, surname, given names and date of birth required (correction 13 Oct); "Nothing is matched by name"; hint "IND for India". |
| WP03-A43 | Pass | s2a-intake-refusals; s3a-v05-prepare (A66) | Rule text beside the TA-09c passport input, the TA-09f passport row and in "View requirements": "A passport has two pages to send: the front page … and the back page. Send one file that holds the front page and the back page." Formats and size from the declaration. TA-07 carries no upload or replace control now (moved to TA-09f). |
| WP03-A44 | Pass | s2b-v05-intake; prepare-pages.test.ts "the replacement form names the revision …"; individual-intake.test.ts "states the two pages of a passport beside its one input …" (pass) | Partly met by recorded decision (WP-03.md §3 Q-W03-04, P-08, DEP-2): one-file shape only; every passport sent as one file became the applicant's evidence. |
| WP03-A45 | Pass | s2a-intake-refusals; axe A161 | HTTP 422; summary focused; at the field "Enter the passport number as one letter and seven digits (A1234567) or two letters and six digits (AB123456)."; value kept; nothing created. Partly met by decision (P-07 d wording; DEP-1 open). |
| WP03-A46 | Deferred | individual-intake.test.ts "states the passport number shapes …"; prepare-pages.test.ts "drift guard …" (pass); todo test (P-08) | Seam item DEP-1 / P-08: the page states Max's two-shape wording; the test that Core accepts every stated example is a todo until the bulk rule is on main. |
| WP03-A47 | Pass | s2a-intake-refusals | "PA123456" (IND) refused with the A45 message at lane commit 0e38a04 (UAT-09 fix 4496ee9 not integrated, DEP-1). |
| WP03-A48 | Fail | s2a-intake-refusals; s2a3-intake; F-04 | "XX" refused "Enter the issuing country as its three-letter code …"; surname with a digit refused in words; date of birth 1990-02-31 (hand-made) refused; typed values kept; "Choose the files again". "India" was not refused: `maxlength="3"` cut it to "Ind", read as IND, and a draft (Kiran) was created. |
| WP03-A49 | Pass | s2a-intake-refusals; s2a3-intake; s2a4-intake | (1)(2) script: field errors "… is not PDF, JPEG or PNG." and "… is larger than 5 MB." (the requirement's size); server (hand-made): HTTP 422 "The file is not a PDF, JPEG or PNG." and "A file is larger than its document accepts …", "Choose the files again", nothing created. (3) script refuses a PDF photo at the field; without the script the draft is created and the photo row reads "Not valid for this application: a photo must be JPEG or PNG, up to 2 MB" with a replacement input. |
| WP03-A50 | Pass | s2b-v05-intake; dom/s2b-asha-int1 | INT-1 "Applicant added: ASHA SYNTHREE", receipt "Drafts created" with reference link, service, "Draft created", application reference, "Prepare this application"; passport "Being checked for safety", then "Accepted". No quote, nothing submitted. |
| WP03-A51 | Fail | s4a-v02; axe A162; F-06 | Receipt "Drafts created … 2 applications", two rows with own references and "Prepare this application" links. No price on the result (parked U5 P2). |
| WP03-A52 | Pass | s4c-v02 | HTTP 409 "This applicant already has an open application for one of the chosen services in this group. Nothing was created for any service." with the link to A; values kept; no second application. |
| WP03-A53 | Fail | s2a3-intake; s2a4-intake; F-05 | "Lives in India: No" was accepted: draft created (Uma). Its pages state no population reason. |
| WP03-A54 | Fail | s2a-intake-refusals; F-07 | Refused (HTTP 409), values kept, no draft; reason "This service has no published details at the moment." (WP-02 F-04, parked). |
| WP03-A55 | Pass | s2a-intake-refusals | HTTP 422 "A chosen service is not a service of Synthetica. Choose services of this group's country."; values kept; nothing created. |
| WP03-A56 | Pass | s2b-v05-intake | Form opened 367 s before sending: accepted (Mira); no verification message. |
| WP03-A57 | Pass | s2a3-intake; s2b-v05-intake; s2c-dates; intake/individual.test.ts "replays the same operation …" (pass) | (1) one POST, one draft. (2) raw identical multipart replay: the same INT-1 address. (3) same key, changed given names: HTTP 409 used-form text, new key, values kept, "Choose the files again". (4) Back: fresh key; send meets the duplicate check with the link. (5) refused C1 then corrected: one draft; refused key "Nothing was recorded …". (6) by test. |
| WP03-A58 | Pass | s2c-dates | HTTP 409 "This group changed since you opened the form. Nothing was created." with "Choose the files again"; values kept; context band shows current facts; next send created Dina's draft. |
| WP03-A59 | Pass | s3a-v05-prepare; s10-final; axe A163 | Draft: six sections, closed state set, "Cannot start yet: 3 items stop submission", no percentage, Ready or Complete. Submitted unassigned case: "Not checked here". |
| WP03-A60 | Pass | s3a-v05-prepare; dom/s3a-a59-ta09t | Context band "About this application": group, country, travel dates (IST), service, "View requirements". "Group and service: Cannot change" with both sentences. No price or estimate here. |
| WP03-A61 | Pass | s3a-v05-prepare | Labels Passport type, Country of residence, Travel purpose; one "Save". Receipt "Request recorded" (neutral, correction 13 Oct) with "Change: Applied to the application" and the current values; section state "No open item". |
| WP03-A62 | Pass | s3a-v05-prepare | Exactly the declared field (Travel purpose, one option). Hand-made "business": HTTP 422 "Your details were not saved …"; value unchanged. |
| WP03-A63 | Pass | s3a-v05-prepare | Hand-made surname: HTTP 422; hand-made nationality GBR: HTTP 422 with a link to the identity correction; nothing changed. |
| WP03-A64 | Fail | s5a-identity-far; F-11 | Evidence none prechecked with a link; no evidence: "Choose the identity document that shows the corrected details."; no change: "Nothing changed."; accepted: TA-09t receipt "Request recorded" with the identity values now; identical replay: same receipt; same key, other content: HTTP 409. The history shows no correction line. |
| WP03-A65 | Pass | s5a-identity-far | HTTP 409 "The documents you chose do not show that this is the same person …" and the route "If the passport is wrong, replace it in Documents."; nothing changed. |
| WP03-A66 | Pass | s3a-v05-prepare | One row per requirement: document, status in words, formats and size, file, whose step, action ("Upload", "Replace this file", "Use a file already in this group …"); passport row with the rule text. |
| WP03-A67 | Pass | s3a-v05-prepare | Receipt "Request recorded", document "Photo", "Being checked for safety"; after the checks "Accepted"; no row "Accepted" before. |
| WP03-A68 | Not proven | s3a-v05-prepare; document-detail.test.ts "a running check is TravelMudra's; a refused file names its reason …" (pass) | L part passes (GIF, 6 MB PDF and PDF photo refused at the field and, by hand, HTTP 422). Safety part: no test asserts the row sentence and the absence of a preview. |
| WP03-A69 | Pass | s3b-v05-submit; s3c-replaced; s4a-v02 (V02 B2); prepare-pages.test.ts; bff-documents.test.ts (pass) | Form carries `_rev.association`; receipt neutral with the pending checks and "Current file in use … Another file". The earlier file stayed in use; the replacement passport (JPEG sample) failed as "Does not match the applicant" and the earlier one stays accepted; photo replacements switched and DOC reads "Replaced by a newer file". Shared version: B kept its photo. Stale by test. |
| WP03-A70 | Pass | s4b-v02 | Chooser in a labelled region lists G3 files only; choosing D's passport for C: receipt, row "Accepted". Hand-made association of a G2 version: HTTP 404 uniform page, nothing disclosed. |
| WP03-A71 | Pass | s2b-v05-intake; s2a4-intake; ta-components.test.ts "each status in its own words …" (pass); axe A164 | Live: being checked, accepted, missing, conflict ("Does not match the applicant", "Compare and correct the identity details" and a new upload), validity failure (200 px photo, PDF photo). Other states by test. |
| WP03-A72 | Pass | s3a-v05-prepare; axe A165 | HTTP 409 comparison Passport type official / ordinary; saved value kept. |
| WP03-A73 | Not proven | bff-documents.test.ts; integration/identity-correction-replay.test.ts (pass) | No test of a details-section resend, its lost acknowledgement or one history change. |
| WP03-A74 | Pass | s7a-sweep; shots/s7a-a74-ta09d-390.png | TA-09t and TA-09d at 390 px: one column, one "Save" at the end of the form (D-W03-14), not fixed; no page scroll. |
| WP03-A75 | Pass | s4b-v02; prepare-pages.test.ts "an assigned application: no form on any section page …" (pass) | TA-09d, TA-09i, TA-09f of assigned A: no form, the A103 notice; hand-made save refused (A104). |
| WP03-A76 | Pass | s3b-v05-submit | TA-09f after submission: "A change now makes the readiness checks run again."; photo replaced, neutral receipt; quote ₹3,500 and original window unchanged. |
| WP03-A77 | Pass | s3b-v05-submit; axe A166 | DOC "Passport of SYNTHREE, ASHA": safety check, details read, what it is, for this application, version, stored file, times in IST; breadcrumb Applications › applicant › Documents. |
| WP03-A78 | Not proven | s2b-v05-intake (Nila); document-detail.test.ts (pass, partly) | Not reachable live: the low-contrast sample was read and accepted. Tests do not assert a label per field or the C2 text of a second send. |
| WP03-A79 | Not proven | integration/documents-commands.test.ts (pass, partly) | No test asserts the type list, the row move or the C2 page text. |
| WP03-A80 | Not proven | integration/documents-commands.test.ts (pass, partly) | Stale comparison tested for classification only. |
| WP03-A81 | Pass | s6-isolation | syn-ta-2: the same 404 page as an unknown version. |
| WP03-A82 | Not proven | integration/documents-commands.test.ts "waits for the checks to finish …" (pass) | No-form-while-checking and the C2 text not asserted. |
| WP03-A83 | Pass | document-detail.test.ts "a support view reads the same facts with no form and no step to take"; system/browser.test.ts (pass) | By test (correction 13 Oct: no action control). |
| WP03-A84 | Pass | s5b-lists | Columns Applicant (reference below), Next, Progress, Outcome, Group (country), Service, Travel; "Outcome not recorded"; freshness. |
| WP03-A85 | Pass | s5b-lists; axe A167 | `view`, `progress`, `group` in the address; "7 applications shown"; reload, Back, Clear; S3 "No application matches these filters. 17 applications exist without these filters."; unknown value ignored; no country or service filter, no sort. |
| WP03-A86 | Fail | s5b-lists; F-12 | Row link carries `from=applications` and the filters; breadcrumb and Back return to TA-06 with them. TA-07 has no "Back to the list" link. |
| WP03-A87 | Pass | s5b-lists; axe A168 | Seal search: results at `/ta/search?r=…`; no address in the history, result link or referrer holds the text; Back and reload show the results (GET, no resend). |
| WP03-A88 | Pass | s6-isolation | Three identical "No application matches …" answers for syn-ta-2. |
| WP03-A89 | Pass | applications-list.test.ts "shows the lag of the projection …", "says that search is unavailable …" (pass) | By test. Live results show "Up to date when read at …". |
| WP03-A90 | Pass | s6-isolation (syn-ta-3) | "No applications yet. Applications start in a group: open a group and add its applicants." with "Go to your groups". |
| WP03-A91 | Pass | applications-list.test.ts "degrades the delivery facts and the groups on their own, and fails the page when the list cannot be read" (pass) | By test. |
| WP03-A92 | Pass | s5b-lists; shots/s5b-a92-ta06-390.png | Cards at 390 px; filters visible; no page scroll. |
| WP03-A93 | Pass | s5b-lists | No checkbox or bulk control on TA-06. |
| WP03-A94 | Pass | s4a-v02 | Two rows for Ravi, each with its own reference, progress and next action. |
| WP03-A95 | Pass | s3b-v05-submit | h1 name and reference with copy; group and service; separate rows Progress, Outcome "Outcome not recorded", Next, Stage "Draft", Editing "You can change it", Service payment "Not recorded", Help request, "Problem report and return None"; no badge or percentage; freshness. |
| WP03-A96 | Pass | s3a-v05-prepare; application-workspace.test.ts (pass) | Before the photo: "A required document is missing", "Continue the application". After: "Check the answers and submit this application." with "Check and submit". Not-allowed fixture by test. |
| WP03-A97 | Fail | s3b-v05-submit; F-08 | "₹3,500.00 if you submit today, fixed when you submit"; window "18 Oct 2026 to 25 Oct 2026, an estimate, not a guarantee". The price shows paise (convention §0.2: "₹3,500"). |
| WP03-A98 | Pass | s3b-v05-submit | One row per document with status in words and "View the document". |
| WP03-A99 | Pass | s3a-v05-prepare; axe A169 | Optional labelled note (2000); separation and decision texts; receipt "Help requested" with reference, "Nothing was submitted. Asking for help is not a submission."; after reload "Help request Requested: TravelMudra decides"; still a draft. |
| WP03-A100 | Pass | s3a-v05-prepare; s3b-v05-submit | No help control on TA-07, no form on TA-07h; hand-made request: HTTP 409 "A help request is already open. TravelMudra decides on it." |
| WP03-A101 | Not proven | core/races-and-boundaries.test.ts; application-workspace.test.ts (pass, partly) | Stale and lost-acknowledgement cases of the help request only generic. |
| WP03-A102 | Pass | s3b-v05-submit | Progress "With TravelMudra"; outcome not recorded; next as Core reports it; quoted ₹3,500 at submission, original window, "No later forecast", payment row separate. |
| WP03-A103 | Pass | s4b-v02; axe A170 | Assigned A: "This application is with your operator. Report the problem so it can be returned for correction.", owner "Your operator", carried "Report a problem" form; no edit, upload, replace, continue or submit control. |
| WP03-A104 | Not proven | s4b-v02; s4c-v02; s6-isolation; dom/s6-a104-submit-answer.html | Edit by hand: HTTP 409 with the notice. Upload by hand: HTTP 409 "Photo: The operator owns the application …" and the notice. Submission by hand refused (409 or 422) but not with the notice: no page exposes the assigned case's revision, so a valid envelope could not be built; no test asserts that page. |
| WP03-A105 | Pass | application-workspace.test.ts "price and timing …"; core/submission-price.test.ts "records a forecast beside the original window …" (pass) | By test (Q-W03-08). |
| WP03-A106 | Pass | carried-forms-ta.test.ts (pass); s10-final | Carried forms live: close (TA-05), withdraw (draft TA-07), report a problem (assigned TA-07). |
| WP03-A107 | Pass | s6-isolation | TA-07 and TA-08 of syn-ta-1 applications and an unknown address: identical 404. |
| WP03-A108 | Pass | application-workspace.test.ts "delivery facts that cannot be read …", "documents that cannot be read now …"; review-submit.test.ts; bff.test.ts (pass) | By test; case-read failure by the shell mapping. |
| WP03-A109 | Pass | s5b-lists | 390 px order: identity, Next action, Status, sections; no page scroll. |
| WP03-A110 | Pass | application-workspace.test.ts "renders no form … not even a disabled one"; review-submit.test.ts (pass) | By test (correction 13 Oct). |
| WP03-A111 | Pass | s3b-v05-submit | History: "Application started", "Help requested from TravelMudra", "Submitted to TravelMudra", "Price fixed", each with IST time. |
| WP03-A112 | Pass | s3b-v05-submit; review-submit.test.ts "a production installation: draft wording offers no submission …" (pass) | h1 "Check and submit: SYNTHREE, ASHA"; sections in order; change links; price, window "if you submit today … whether or not you have paid", "Filed with"; payment text; statement with "Draft wording"; consequence before "Submit this application"; "Back to the application". "Ask TravelMudra for help instead" absent while a help request is open (shown on B, A126). |
| WP03-A113 | Fail | s3b-v05-submit; F-09 | Each "Change …" link names its section and opens it; the section page offers only "Back to the task list"; a save returns to TA-09t, not TA-08. |
| WP03-A114 | Pass | s3b-v05-submit | Statement in words, "Draft wording", never prechecked, unchecked after reload. |
| WP03-A115 | Pass | s3b-v05-submit; axe A171 | HTTP 422; summary focused "Confirm the statement to submit this application." linked to the checkbox; still a draft. |
| WP03-A116 | Pass | s3a-v05-prepare; review-submit.test.ts (pass); axe A171 | Blockers with links; notice "Submitting this application is unavailable until the items above are resolved."; no form, no statements; button `aria-disabled` described by the notice; help link separate. Evidence-unavailable by test. |
| WP03-A117 | Fail | s5a-identity-far; F-10 | Both blocked without a form: "Travel starts too far ahead to submit this service yet. Submit closer to the travel date." and "Travel starts too soon …". The declared window (3 to 90 days) is not stated. |
| WP03-A118 | Pass | s3b-v05-submit; axe A172 | Receipt "Application submitted": reference, submission id, "Time: Recorded in the application's History" (partly met, P-02), quote ₹3,500, original window, next step. First in `main` and in the title. |
| WP03-A119 | Pass | s3b-v05-submit | Quoted at submission ₹3,500; original window from the submission date; service payment "Not recorded" separate. |
| WP03-A120 | Not proven | review-submit.test.ts "a stale revision …"; core/submission-price.test.ts (pass, partly) | End-to-end publish-then-send not asserted. |
| WP03-A121 | Not proven | core/submission-price.test.ts (pass, partly) | No midnight IST clock fixture. |
| WP03-A122 | Not proven | core/submission-price.test.ts; review-submit.test.ts (pass, partly) | No TA-08 re-render after a statement version change. |
| WP03-A123 | Pass | s3b-v05-submit; s4a-v02 | (1) double click: one POST. (2) raw identical replay: the same receipt address. (3) Back: "This application was submitted." with "Open the application", no form. (4) new key: HTTP 409, its status page "Nothing was recorded …". (5) after the refused A115 send the next send submitted once; history one submission line. |
| WP03-A124 | Not proven | core/submission-price.test.ts; status-pages.test.ts (pass, partly) | The submit route's answer after an unknown outcome not asserted. |
| WP03-A125 | Not proven | review-submit.test.ts "blocked by a service rule …"; application-workspace.test.ts (pass, partly) | Not run live; refused hand-made send and the route in the notice not asserted. |
| WP03-A126 | Pass | s4a-v02 | From B's TA-08 "Ask TravelMudra for help instead": receipt "Help requested … Nothing was submitted."; B still a draft with its submission form; A unchanged. |
| WP03-A127 | Pass | s7a-sweep; shots/s7a-a127-ta08-390.png | 390 px: sections stacked; statement and button at the end, not fixed; summary focused; its link moves focus to the checkbox in view. |
| WP03-A128 | Pass | s3b-v05-submit | "Submit this application"; no forbidden label; estimates called estimates. |
| WP03-A129 | Pass | s1-groups … s5a-identity-far; results.test.ts; application-workspace.test.ts (pass) | Every receipt: reference link, "Recorded: Once …", no accepted time, current facts labelled "Current". Edited addresses (submitted with the help key, assistance with the submission key, another application's key): "The receipt cannot be checked now." The receipt is announced by being first in `main` and in the title; no live region at load (WP01-A18 design). |
| WP03-A130 | Not proven | system/interrupted-work.test.ts; status-pages.test.ts; system/web-shell.test.ts (pass, partly) | Lost acknowledgement tested for create group, create drafts and submit only. A refused key reads "Nothing was recorded for request [ref], and it can no longer be recorded." (live). |
| WP03-A131 | Not proven | system/web-shell.test.ts; intake/individual.test.ts (pass, partly) | Partly generic; live cases A14, A57, A123 pass. |
| WP03-A132 | Pass | all scripts; F-04 | Every refusal reached through the pages names its reason in words. Only hand-made sends got generic texts ("Check this value.", "This is longer than accepted. Shorten it."). |
| WP03-A133 | Not proven | bff-services.test.ts; review-submit.test.ts (pass, partly) | No test checks the text map against the full reason vocabulary. |
| WP03-A134 | Pass | s8-suspend; s9-signout | (1) fresh synthetic TA (seeded accounts unchanged) suspended while TA-09c held values: the send landed on sign-in, no restricted content, nothing created; restored, the group holds no application. (2) sign out from TA-07, Back: sign-in page. |
| WP03-A135 | Pass | s7a-sweep | 21 page states: environment label, "[TEST]" title, one h1, breadcrumb, freshness, rail current item. TA-06s marks the top-bar "Search your applications" (design §1.3) and shows freshness with results. |
| WP03-A136 | Pass | s7a-sweep; s9-signout; system/web-shell.test.ts (pass) | `Cache-Control: no-store` on all 21 pages; localStorage, sessionStorage and IndexedDB empty after TA-09c, TA-09i, TA-07 and DOC. |
| WP03-A137 | Pass | s7a-sweep | No forbidden label; every time carries IST; counts name their unit. |
| WP03-A138 | Pass | s2b-v05-intake; s4b-v02 | Identity by passport number and issuing country; nine applicants with the same surname never merged or suggested; Ravi's G3 applications stay separate. |
| WP03-A139 | Pass | s1-groups (A13); s7b-keyboard-long | Keyboard only: create group, services and fields on TA-09c, create drafts, help request, details save, "Change application details", statement and submission. Choosing a file opens the native dialog (not drivable by the harness). |
| WP03-A140 | Pass | s7a-sweep | Focus walk on 21 page states: every focus visible, none hidden under a fixed or sticky bar. |
| WP03-A141 | Pass | s7a-sweep | No two-dimensional scroll at 320 px on 21 page states (long unbroken names: A149). |
| WP03-A142 | Pass | s7a-sweep | No unlabelled control. |
| WP03-A143 | Pass | s7a-sweep | States read as text (task list, evidence rows, status rows). The sweep flagged empty wrappers and hidden upload progress elements only. |
| WP03-A144 | Pass | s7a-sweep | TA-13a (script), TA-09c (server) and TA-08 (server, 390 px): summary focused; its link moves focus to the field; values kept; "Choose the files again". |
| WP03-A145 | Not proven | none | No screen reader was available to the run (DOM order and labels checked in A135, A142, A143). |
| WP03-A146 | Pass | s3a-v05-prepare; s5a-identity-far; s4b-v02; individual-intake.test.ts (pass) | Blocked and travel-blocked submit buttons `aria-describedby` the notice; assigned notice in reading order with no forbidden control; offering-unavailable choices by test. |
| WP03-A147 | Fail | s7a-sweep; F-13 | Named primary actions at least 44 px; small links pass axe target-size (spacing). TA-01 item action ("Continue the application", the page's primary action) is 36 px high. |
| WP03-A148 | Pass | axe.jsonl (color-contrast); contrast.test.ts (pass) | No contrast violation. |
| WP03-A149 | Fail | s7b-keyboard-long; s7c-long-diag; F-02 | A 120-character group name and 60-character names: TA-05 h1 and the breadcrumb item on TA-07, TA-09t, TA-08, TA-09f do not wrap: page scroll at 390 px (882 and 1723 px wide). Reduced motion: transitions 1e-05 s. |
| WP03-A150 | Pass | s7a-sweep | Every table has header cells; no table scrolls outside a labelled region. |
| WP03-A151 | Not proven | none | No TA participant was available to the run. |
| WP03-A152 | Pass | axe.jsonl | TA-01 with items: 0 violations at 1440 and 390 px (serious, critical, moderate and minor all 0). |
| WP03-A153 | Pass | axe.jsonl | TA-01 empty (syn-ta-3): 0 violations at 1440 and 390 px (serious, critical, moderate and minor all 0). |
| WP03-A154 | Pass | axe.jsonl | TA-13a error summary: 0 violations at 1440 and 390 px (serious, critical, moderate and minor all 0). |
| WP03-A155 | Pass | axe.jsonl | TA-13a form and TA-05 receipt: 0 violations at 1440 and 390 px (serious, critical, moderate and minor all 0). |
| WP03-A156 | Pass | axe.jsonl | TA-13b stale comparison: 0 violations at 1440 and 390 px (serious, critical, moderate and minor all 0). |
| WP03-A157 | Pass | axe.jsonl | TA-04 S3: 0 violations at 1440 and 390 px (serious, critical, moderate and minor all 0). |
| WP03-A158 | Pass | axe.jsonl | TA-05 sections: 0 violations at 1440 and 390 px (serious, critical, moderate and minor all 0). |
| WP03-A159 | Pass | axe.jsonl | TA-05 at 390 px: 0 violations at 1440 and 390 px (serious, critical, moderate and minor all 0). |
| WP03-A160 | Pass | axe.jsonl | TA-09c with requirements open: 0 violations at 1440 and 390 px (serious, critical, moderate and minor all 0). |
| WP03-A161 | Pass | axe.jsonl | TA-09c passport refusal: 0 violations at 1440 and 390 px (serious, critical, moderate and minor all 0). |
| WP03-A162 | Pass | axe.jsonl | INT-1 receipts (one and two applications): 0 violations at 1440 and 390 px (serious, critical, moderate and minor all 0). |
| WP03-A163 | Pass | axe.jsonl | TA-09t: 0 violations at 1440 and 390 px (serious, critical, moderate and minor all 0). |
| WP03-A164 | Pass | axe.jsonl | TA-09f conflict and validity failure: 0 violations at 1440 and 390 px (serious, critical, moderate and minor all 0). |
| WP03-A165 | Pass | axe.jsonl | TA-09d stale comparison: 0 violations at 1440 and 390 px (serious, critical, moderate and minor all 0). |
| WP03-A166 | Pass | axe.jsonl | DOC (no resolve form reachable): 0 violations at 1440 and 390 px (serious, critical, moderate and minor all 0). |
| WP03-A167 | Pass | axe.jsonl | TA-06 filters: 0 violations at 1440 and 390 px (serious, critical, moderate and minor all 0). |
| WP03-A168 | Pass | axe.jsonl | TA-06 search results: 0 violations at 1440 and 390 px (serious, critical, moderate and minor all 0). |
| WP03-A169 | Pass | axe.jsonl | TA-07 help requested: 0 violations at 1440 and 390 px (serious, critical, moderate and minor all 0). |
| WP03-A170 | Pass | axe.jsonl | TA-07 assigned: 0 violations at 1440 and 390 px (serious, critical, moderate and minor all 0). |
| WP03-A171 | Pass | axe.jsonl | TA-08 blocked and error summary: 0 violations at 1440 and 390 px (serious, critical, moderate and minor all 0). |
| WP03-A172 | Pass | axe.jsonl | TA-07 submission receipt (A120 state by test): 0 violations at 1440 and 390 px (serious, critical, moderate and minor all 0). |
| WP03-A173 | Not proven | application-workspace.test.ts; review-submit.test.ts (pass, partly) | Receipt Next naming the operator not asserted; not run live (Q-W03-08). |
| WP03-A174 | Not proven | application-workspace.test.ts; review-submit.test.ts (pass, partly) | Rendered hand-back receipt and unchanged quote and window at Core not asserted. |
| WP03-A175 | Not proven | review-submit.test.ts (pass, partly) | Core refusal of a stale hand back not asserted. |
| WP03-A176 | Not proven | review-submit.test.ts (pass, partly) | Hand-back replay and lost acknowledgement only generic. |
| WP03-A177 | Pass | s4b-v02; prepare-pages.test.ts; bff-documents.test.ts (pass) | Live (setup through the staff pages): TA-09d, TA-09i and TA-09f opened before the assignment: each send HTTP 409, no form, the assigned notice with "Report a problem", "Your unsent changes" read only (TA-09d, TA-09i); "Choose the file again" (TA-09f); nothing changed; browser storage empty. |
| WP03-A178 | Not proven | prepare-pages.test.ts "approved help in progress …" (pass, partly) | `hold_assistance_in_progress` refusal and its unsent-changes block not asserted; not run live. |
| WP03-A179 | Not proven | bff-access-change.test.ts; ta-home.test.ts (pass, partly) | TA-08 and DOC with an access-refused optional read not asserted. |
| WP03-A180 | Fail | s1-groups; s1b-fix; s1c-dates; edge server log; F-01 | Every send of TA-13b with a date before today (three date pairs and a browser click) answers HTTP 500 "An internal error stopped this request … Reference code: unexpected"; the review never shows. Nothing reaches Core. Future dates save normally. The unit tests pass (they call the handler without the server). |
| V05 proof | Pass | parts A, B, E, F live (s1-groups, s2b, s3a, s3b); C: core/assignment-holds.test.ts, core/submission-price.test.ts "… needs no payment"; D: intake/individual.test.ts, core/groups-drafts.test.ts "creates drafts only …"; G: system/core-pages.test.ts, application-workspace.test.ts; H: core/submission-price.test.ts, core/catalogue-impact.test.ts, integration/catalogue-impact.test.ts (pass) | A: G1 and baseline. B: one draft, help requested, no submission line. E: C1, then one submission with ₹3,500 and the window 18 to 25 Oct 2026. F: photo replaced, quote and window unchanged. C and H are covered by tests that assert the outcome indirectly (no TA-07 render of a paid draft; no P2 submission at the new price). |
| V02 proof | Pass | parts A, B, C, D, F live (s4a-v02, s4b-v02, s4c-v02, s6-isolation); E: core/withdrawal-dependencies.test.ts, core/groups-drafts.test.ts (pass) | Two applications with own prices (₹3,500 / ₹3,600), details, documents and history; A's photo replaced, B unchanged; A submitted, B still a draft with its own statement; help on B; A paid and assigned (setup), B editable; duplicate refused; G3 independent; no cross-group reuse; syn-ta-2 sees nothing. E rests on a sibling created separately. |

## 8. Findings of the acceptance run

Ranked under PRI-20260930-01. Each finding names its items, what the run showed on `lane-ui` at 0e38a04, and a
concrete scenario with its likelihood. Evidence: lane `research/proofs/wp03/` (manifest SHA-256
0692f620928ea6d6a4021d22cb992575863e7b9ad95eca19a14c2f4b90e45969).

**P0:** none.

**P1:**

- **F-01 (A180).** Every travel-date change with a date before today answers HTTP 500 "An internal error stopped this
  request … Reference code: unexpected". The review with the acknowledgement never shows, so a group whose trip has
  started cannot change its return date at all. Nothing reaches Core.
- **F-02 (A149).** A long group name without spaces does not wrap in the TA-05 `h1` and in the breadcrumb of the
  application pages: the page scrolls sideways at 390 and 320 px (WCAG 1.4.10, the class of WP-02 F-09).
- **F-03 (A12).** With the page script, a travel date before today on TA-13a stops in the browser with Chromium's text
  "Value must be 13/10/2026 or later.", not the page's rule (the class of WP-02 F-02, WCAG 3.3.1 and 3.3.3).

| ID | Rank | Items | Observation on `lane-ui` at 0e38a04 | Scenario and likelihood | Proposed direction |
|---|---|---|---|---|---|
| F-01 | P1 | A180 (correction of 13 October: travel dates before today) | Four sends to TA-13b with a start date before today (2026-10-11 to 2026-10-18, 2026-10-08 to 2026-10-11, 2026-10-12 to 2026-10-16, and one browser click) answer HTTP 500 `unexpected` (edge log, route `ta.groups.travel_dates`). A future date saves normally (HTTP 303, receipt). Cause at 0e38a04: `src/apps/edge/core/group-routes.ts:56` answers the review with `ctx.page(...)` and no status; `src/apps/shared/server.ts:465` throws `internal`/`unexpected` for every POST page answer with a status below 400. The unit tests of the review pass because they call the handler with a scripted context and never pass `sendResult`. | A travel agent's trip started on 11 October; on 13 October the client extends the stay. TA-13b shows the dates with the start date before today; every save gives "An internal error … Try again". The travel agent cannot change the return date and asks support. A typo of a past date gives the same error instead of the review. Likelihood: certain for every group whose start date has passed. No data harm: nothing is sent. | Answer the review with a refusal status (422, as the other re-rendered forms). Fix the class: a BFF test that sends each POST route's re-render path through the server, or a static check that a POST handler's page answer always carries a status of 400 or more. |
| F-02 | P1 | A149 (A141) | A group name of 120 characters with a 110-character run without spaces: TA-05 `h1` 1707 px wide; the breadcrumb item on TA-07, TA-09t, TA-08 and TA-09f 848 px wide; page width 882 to 1723 px at 390 px; also at 320 px. TA-04 and TA-06 wrap. Names of 60 characters do not overflow by themselves. | A travel agent names a group "SharmaFamilyDubaiDecember2026" (28 characters, no space) or pastes a booking reference; on a phone at 320 px the group page and every application page of the group scroll sideways. Likelihood: low to medium; certain for such a name. | `overflow-wrap: anywhere` on the page header title and the breadcrumb items in the shared components; design §7.7 (breadcrumb items truncated visually at about 30 characters with the full text in the DOM). |
| F-03 | P1 | A12 (A11) | TA-13a with the page script: a start date of yesterday stops in the browser; both date fields show "Value must be 13/10/2026 or later." (Chromium's text, date in the browser's own format). The server's message "The travel start date must be today or later, as an India date." shows only without the script. Empty fields use the page's own words ("Enter travel start date"). | A travel agent types yesterday's date; the message does not say "India date" and uses the browser's date format. Likelihood: high for date typos. WP-02 F-02 (the same class) was re-ranked P1 by the architect and fixed on the SuperAdmin pages only. | A page-owned message for `rangeUnderflow` (and the other constraint kinds) in the inline check: the field label and the rule in words. |
| F-04 | P2 | A48, A132 | `maxlength="3"` on issuing country and nationality cuts typed or pasted text silently: "India" became "Ind", Core read IND and created a draft (Kiran). "Indonesia" would become IND and "Austria" AUS. Hand-made sends get generic texts: a longer code "This is longer than accepted. Shorten it."; a date "1990-02-31" "Check this value." | A travel agent pastes "Austria" from a client sheet; the draft records AUS (Australia) with no message. Likelihood: low (the population is Indian passports; the hint says IND). | Remove `maxlength` from the code fields (the server refuses with the three-letter rule), or check the length in the page's own words; name the rule in the server's length and date messages. |
| F-05 | P2 | A53 | "Lives in India: No" is accepted on TA-09c: a draft is created (Uma). TA-07 and TA-09t then say only "Nationality, passport type or country of residence is not given yet."; no population reason. | A travel agent adds a client who lives in Dubai, fills the details and documents, and learns only at submission that the service does not apply. Likelihood: medium; wasted work, no wrong submission. | Core intake: refuse `population_out_of_scope` at creation when "Lives in India" is "No", or show the population blocker on the draft. Owner: intake module (orchestrator decision). |
| F-06 | P2 | A41, A51 | No price beside each service on TA-09c and no price on the INT-1 result (parked U5 P2 "no price on the start and attempt reads"). | A travel agent chooses two services without seeing ₹3,500 and ₹3,600 on the page. Likelihood: certain; low impact (TA-03 and TA-07 show the price). | P-09 fact on the start and attempt reads. |
| F-07 | P2 | A54 | The unapproved provider route, sent by hand, is refused "This service has no published details at the moment." (WP-02 F-04, parked). | As WP-02 F-04. | As WP-02 F-04. |
| F-08 | P2 | A97, A102, A112, A118 | TA-07, TA-08, the receipts and the history show "₹3,500.00"; TA-03 shows "₹3,500" (convention §0.2). | A travel agent compares the service page and Check and submit and sees two formats. Certain; cosmetic. | One price format (no paise when zero) in the shared `money` helper. |
| F-09 | P2 | A113 | "Change identity details", "Change application details" and "Change documents" on TA-08 open their sections; each section offers only "Back to the task list", and a save returns to TA-09t. | A travel agent corrects a detail during the final check and must find "Check and submit" again. Certain; one extra step. | A return link to TA-08 on the section pages when opened from TA-08 (design CMP-05). |
| F-10 | P2 | A117 | Travel-rule blockers read "Travel starts too far ahead to submit this service yet. Submit closer to the travel date." and "Travel starts too soon to submit this service. Change the travel dates or choose another service."; the declared window (3 to 90 days before the travel start date) is not stated. | A travel agent with travel in 120 days cannot tell when submission opens and asks support. Likelihood: high for early planning. | Show the declared window from `travelDateRules` with the blocker. |
| F-11 | P2 | A64 | After an accepted identity correction (Mira, passport number), the TA history shows only "Application started": no correction line. | Support or the travel agent cannot see when the passport number changed and why. Certain for every correction. | For WP-08 (history rebuild, Q-W03-15): show identity corrections with the reason. |
| F-12 | P2 | A86 | TA-07 has no "Back to the list" link; the breadcrumb returns to TA-06 with the filters. | A travel agent looks for "Back to the list" at the end of a long page. Low. | Add the link or correct the checklist row. |
| F-13 | P2 | A147 | TA-01 item action links ("Continue the application", the page's primary action, design §2.1) are 36 px high at 390 px. Named primary buttons are at least 44 px. | A phone user misses the small action on Home. Low. | Primary size for the first item's action, or a button-sized link. |
| F-14 | P2 | A21 | TA-13b stale comparison shows the unsent dates as "2026-11-22" beside "21 Nov 2026". | A travel agent compares two date formats in the comparison. Low. | Format the unsent dates as dates. |
| F-15 | P2 | A27 | TA-04 at the row limit says "This list shows at most 200 groups." without how to narrow the list. | A travel agent with more than 200 groups does not learn that the state filter narrows the list. Low. | Add the narrowing hint. |

Not proven (no live check and no test shows the item, or a part of it): A05 (L part), A17, A22, A26, A35, A36, A39,
A68 (safety part), A73, A78, A79, A80, A82, A101, A104 (submission part), A120, A121, A122, A124, A125, A130, A131,
A133, A145 (no screen reader), A151 (no participants), A173, A174, A175, A176, A178, A179. Deferred: A46 (DEP-1, P-08).

Observations (not ranked here):

- Open P1 carried from the code review: the shared intake handler `src/apps/edge/intake/routes.ts` still cuts the
  TA-09c applicant text fields and the bulk service list at 0e38a04 (S-14, P-22 item 3). Core's own limits are smaller
  than these cuts, so no cut value was accepted in this run.
- A replacement passport given as a JPEG image (synthetic sample) was read as "Does not match the applicant"; the
  earlier passport stayed in use, as C-09 requires. The text-layer PDF samples were read correctly.
- No draft of group D showed "Draft waiting for a travel-date recheck" after two date changes; the waiting state was
  not observed (A19 passes on its receipt and header facts).
- A hand-made submission of an assigned application cannot carry the current revision (no page exposes it), so the
  submission part of A104 stays Not proven.
- The receipt is announced by its place (first in `main`) and the title; there is no live region at load (WP01-A18).
  A118 and A129 pass on that design.
- G1 shows "Open import issues: 1 issue" after the run's intakes (A31); the issue was not opened in this run.

### 8.1 Run method

One long-lived harness process held each signed-in session in memory (never on disk) and ran the steps in order, so
that each persona signed in once (the code budget is three per 15 minutes). The harness read sign-in codes through the
installation's `signin-codes.mjs` exports only; no code, enrolment code, authenticator key or TOTP value is in any
evidence file (scan of 195 files: 0 matches). Synthetic sample documents were generated in memory from
`test/fixtures/documents/samples.ts` at 0e38a04 (text-layer passport PDFs, one passport image, PNG photographs of
600 x 600 and 200 x 200 px, a GIF, a 6 MB PDF, a plain PDF). No real document was used. Tests ran in a clean copy of
0e38a04; the working tree was not touched.

### 8.2 Proof record for `WP-03.md` §7 (synthetic writes)

| Item | Record |
|---|---|
| Acceptance run | 13 October 2026, 11:15 to 12:40 IST, on `lane-ui` at 0e38a04 (release rel_3JEW9KWV588AXDY15QGPRD2ZCR) by the Principal Product Manager. 180 items (A180 added by the corrections of 13 October): 133 Pass, 15 Fail, 31 Not proven, 1 Deferred (A46, DEP-1). V05 Pass, V02 Pass. Results: `WP-03-acceptance.md` §7; findings §8 (F-01 to F-03 P1, F-04 to F-15 P2, no P0). Evidence manifest SHA-256 0692f620928ea6d6a4021d22cb992575863e7b9ad95eca19a14c2f4b90e45969 (196 files; held by the lane); no code or key in the evidence (scanned). |
| axe | axe-core 4.13.0: 21 rows (A152 to A172) on live pages at 1440 and 390 px: 0 violations of any impact |
| Tests | Clean copy of 0e38a04: 337 cited tests pass (unit 387 + 1 todo, unit/web 964 + 1 todo, system 110, database 192, UI 1310); map in `research/proofs/wp03/tests/map.jsonl` |
| Accounts | One new synthetic travel agent `wp03-ta-r1013k@synthetic.test` (created, approved and activated by syn-superadmin-1; suspended and restored once for A134). No seeded account changed (no address change, no status change). |
| Groups of syn-ta-1 | "WP03 r1013k G1" (V05), "WP03 r1013k D" (double click; dates changed twice: return 19 → 20 → 21 Nov 2026), "WP03 r1013k soon" (start tomorrow), "WP03 r1013k back" (sent after browser Back), "WP03 r1013k far" (start in 120 days), "WP03 r1013k past" (empty; return date changed once to 20 Nov 2026; every past-date send failed with HTTP 500, nothing stored), "WP03 r1013k G2" (V02), "WP03 r1013k G3" (V02 part F), and one group with a 120-character name "WP03 r1013k L Longgroupname…" (A149). Group of wp03-ta-r1013k: "WP03 r1013k K" (empty). |
| Applications (drafts) | G1: Asha (V05), Mira (typed passport number one digit off; small photograph), Nila (low-contrast passport image), Kiran (created by the A48 "India" send), Tara (A57 part 5), Uma ("Lives in India: No"), Vani (PDF as the photograph, hand-made send), Lata (keyboard path). D: Dina. far: Farah. soon: Sonu. G2: Ravi A (SYN Tourist e-visa) and Ravi B (SYN e-visa, fee paid with submission). G3: Ravi C (SYN Tourist e-visa, no files) and Ravi D (fee paid with submission). L group: one applicant with 60-character names. All SYN Tourist e-visa unless named. Passport numbers P3101301 to P3101315 (synthetic). Identifiers: lane `research/proofs/wp03/state.json`. |
| Commands on applications | Submitted (3): Asha, Ravi A, Kiran. Help requested (3): Asha, Ravi B, Lata. Details saved: Asha, Ravi A, Ravi B, Farah, Sonu, Kiran. Identity corrected: Mira (passport number P3101302 → P3101312, with her passport as evidence). Documents: Asha photo uploaded, passport replaced (the replacement read as a mismatch; the earlier passport stays in use), photo replaced after submission; Ravi A photo replaced; Ravi C linked to Ravi D's passport (same group). |
| Set-up through the existing staff pages (architect approval, V02 part D) | syn-superadmin-1 recorded the service payment of Ravi A as received (₹3,500, synthetic reference) and assigned Ravi A to syn-operator-1. |
| Refused or replayed sends | Refused sends record nothing (status pages checked); replays returned the original results. |
| Seeded data | Unchanged: no seeded offering, launch, listing, country or account was changed. The WP-01 and WP-02 drafts of syn-ta-1 were read only. |
