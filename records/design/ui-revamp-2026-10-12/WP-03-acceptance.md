# WP-03 acceptance checklist: groups, individual intake, submit

| Field | Value |
|---|---|
| Lane | `ui-revamp-2026-10-12` |
| Work package | WP-03 Groups, individual intake, submit (UI-PLAN §12.1; lane PLAN §3) |
| Author | Principal Product Manager (Claude subagent), 12 October 2026 |
| Decision owner | Principal Technical Architect of the lane (LD-12) |
| Status | Draft. Step 1 of lane PLAN §3. Not run. Input to the UX design review and the independent review. |
| Product base | lane branch `ui-revamp-2026-10-12` at 102e4c9; internal records at 694e007 |
| Installation | `lane-ui`: edge http://127.0.0.1:4650 (travel-agent pages); staff http://127.0.0.1:4652 (proof set-up through the existing SuperAdmin and operator pages only, LD-02) |
| Writing style | ASD-STE100 at about 75% (STY-20261003-01) |

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

### 1.2 Command coverage (CC §5.1: 11 WP-03 commands, plus one)

| # | Command | Route id today | Page | Items |
|---|---|---|---|---|
| 1 | `core.create_group` | `ta.groups.create` | TA-13 create | A09 to A17 |
| 2 | `intake.start_individual` | `ta.intake.start_individual` | TA-09 create | A40 to A58 |
| 3 | `core.edit_draft` | `ta.applications.edit` | TA-09 sections | A61, A62, A63, A72, A73, A75, A76 |
| 4 | `core.correct_identity` | `ta.applications.correct_identity` | TA-09 applicant facts | A63, A64, A65 |
| 5 | `doc.upload_for_application` | `ta.documents.upload` | TA-09 documents; TA-07 evidence rows | A66, A67, A68 |
| 6 | `doc.replace_version` | `ta.documents.replace` | TA-09 documents; TA-07 evidence rows | A69, A76 |
| 7 | `doc.associate` | `ta.documents.associate` | TA-09 documents | A70 |
| 8 | `doc.resolve_extraction` | `ta.documents.resolve_extraction` | Document detail (CC-05) | A78, A80, A82 |
| 9 | `doc.confirm_classification` | `ta.documents.classification` | Document detail (CC-05) | A79 |
| 10 | `core.request_assistance` | `ta.applications.request_assistance` | TA-07, TA-08, TA-09 | A99, A100, A101, A126 |
| 11 | `core.submit` | `ta.applications.submit` | TA-08 | A112 to A125 |
| + | `core.edit_travel_dates` (CC row says WP-17; Q-08) | `ta.groups.travel_dates` | TA-13 edit | A18 to A22 |

All of them also: A129 (receipt), A130 (unresolved, by test), A131 (same operation key, by test), A132 and A133
(refusal text).

Commands outside WP-03 that the proofs touch only as set-up through the existing staff pages (LD-02):
`pay.record_service_status` and `core.assign` (WP-06), `core.record_forecast` and `cat.publish_baseline` with a
continuation for drafts (WP-17 and WP-02). Commands that the rebuilt TA-07 and TA-05 MUST keep reachable, unchanged,
until their packages (Q-01): `core.report_problem`, `core.hand_back` (WP-09), `core.request_withdrawal`,
`core.decide_price_increase`, `core.apply_held_correction`, `core.close_group` (WP-17), `core.decide_transition`
(WP-13), `core.link_dependency`, `core.unlink_dependency` (WP-10), the result download (WP-08).

### 1.3 State coverage

S1 (loading) does not apply: every WP-03 page is server-rendered. If the design adds a region that refreshes later
(for example evidence rows while checks run), S1 and the background-refusal rule A-01 apply, and the design names
the item. S5 applies only where a page reads a projection (`views.*`); the `core.*` lists are authoritative reads.

| Page | Page states | C1 validation | C2 rejected | C3 accepted | C4 unresolved | C5 stale |
|---|---|---|---|---|---|---|
| TA-01 | S2 A04; "nothing needs action" A05; S3 not applicable (no filter); S4 A06; S6 not applicable (own scope); S7 A06 | — | — | — | — | — |
| TA-13 create | — | A11, A12 | A14 (used form), A15 | A13 | A16 | — |
| TA-13 edit | Closed group A20 | A20 | A20 | A19 | A22 | A21 |
| TA-04 | S2 A25; S3 A24; S4 A26, A27; S5 A23 (if a projection is used); S6 A29; S7 A26 | — | — | — | — | — |
| TA-05 | S2 A37; S4 A39; S6 A38; S7 A39; closed A36; offering unavailable A35 | — | — | — | — | — |
| TA-09 create | Offering not selectable A41, A54 | A45, A48, A49 | A52, A53, A54, A55 | A50, A51 | A57 | A58 |
| TA-09 sections | Read-only (assigned) A75 | A62, A64 | A63, A65, A68, A75 | A61, A64, A67, A69, A70 | A73 | A72 |
| Document detail | S6 A81; support view A83 | A78 | A78, A79, A82 | A78, A79 | A130 | A80 |
| TA-06 | S2 A90; S3 A85; S4 A91; S5 A89; S6 A88; S7 A91 | — | — | — | — | — |
| TA-07 | S4 A108; S6 A107; S7 A108; assigned read-only A103 | — | A100, A104 | A99 | A101 | A101 |
| TA-08 | S4 A116; S6 A107; offering unavailable A125 | A115 | A116, A117, A123, A125 | A118 | A124 | A120, A121, A122 |

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
| WP03-A10 | TA (`syn-ta-1`) | TA-03 of "SYN Tourist e-visa" → "Start an application" | Choose "Create a new group" (or the equivalent). Create the group. | TA-13 opens with Synthetica already chosen. "Cancel" returns to TA-03. After creation, the TA arrives at the add-one-applicant step of the new group with "SYN Tourist e-visa" preselected. No draft exists until the TA sends that step. | L | W2 Q-W02-10; WP02-A20; PL §4.1 steps 2 to 4 |
| WP03-A11 | TA | TA-13 create | Send the empty form. | C1: the error summary receives focus. Each field states its rule in words: choose a country; the name has 1 to 120 characters; the start date is today or later (India date); the return date is on or after the start date. Nothing is created. | L | CMP-07; AC-08; `core.create_group` input rules |
| WP03-A12 | TA | TA-13 create | Enter country Synthetica, name "WP03 [run] dates", start date yesterday (India date), return date the day before the start. Send. Then fix the start date only. Send. | First send: C1 on the start date ("must be today or later") and the entered values stay. Second send: C1 on the return date ("must be on or after the start date"); the name and the corrected start date stay. Nothing is created. | L | `core.create_group` (`group_dates_invalid`); AC-08; W1 A-12 |
| WP03-A13 | TA (`syn-ta-1`) | TA-13 create | Enter Synthetica, "WP03 [run] G1", start = run date + 30 days, return = start + 7 days. Review. Use one "Change" link. Create. | The review shows country, name and both dates; "Change" returns to the field with the values kept. C3: the receipt (CMP-08) names the group, its country and travel dates, with the request reference link. TA-05 of the new group opens (or the receipt links to it). TA-04 lists the group. | L | PL §4.1 step 3, §7 (Create group: K-STD); CMP-05, CMP-08 |
| WP03-A14 | TA (`syn-ta-1`) | TA-13 create, the Nth time | (1) Double-click "Create group". (2) After the receipt, press Back and send the same form unchanged. (3) Press Back, change the name, send. | (1) and (2): one group exists; the page shows the same receipt. (3): the used form is refused as already used; the page offers a fresh form in one action ("Start again" or a fresh form rendered by itself) with the typed values; the message does not read as a fault of the typed values (UAT-01 pattern). No second group exists until the TA sends the fresh form. | L+T | PL §7 K-STD; BS B35; PL §14.1 PUB-02-S8 (pattern); UF UAT-01 |
| WP03-A15 | TA (`syn-ta-1`), SuperAdmin | TA-13 create with a country that becomes not listed | Open TA-13 and choose Synthetica Gamma while it is listed (WP-02 D8 to D15), or use a fixture. Before sending, `superadmin-1` sets the country to "Not listed". Send. | C2: the country field says that this country is not open for new groups; the other values stay; nothing is created. | L (per WP-02 proof) or T | `core.create_group` (`country_not_listed`); BS B07; WP02-A39 |
| WP03-A16 | TA | TA-13 create with a lost acknowledgement (fixture) | Inject the fault. | C4 (CMP-13): "Checking the original result" and "Check status". The page offers no second "Create group" for the same intent. "Check status" shows the group when it was created. | T | PL §1.1 UNR, §4.1 step 3 ("no second group"); BS B35 |
| WP03-A17 | TA | TA-13 create at the India date boundary (clock fixture) | At 00:30 IST (19:00 UTC of the previous day), send a start date equal to the India date, then a start date equal to the previous India date. | The first is accepted. The second is refused (C1). The page shows dates only, never a UTC date. | T | BS B25 (declared date basis); `core.create_group` (Asia/Kolkata) |
| WP03-A18 | TA (`syn-ta-1`) | TA-05 of G1 → "Edit travel dates" → TA-13 edit mode | Open the page. Read it. Select "Cancel". | The page shows the current dates and fields for the new dates. The country shows as a fact and cannot change; the page says that another country needs a new group. The page says that the open applications of the group are checked again against the new dates and that filed facts stay as they were. If no impact preview exists (Q-08), the page shows no list and no count of affected applications. "Cancel" returns to TA-05. | L | PL §3.2 TA-13 (edit mode), §5.2 (Edit travel dates); BS B03, B06 |
| WP03-A19 | TA (`syn-ta-1`) | TA-13 edit | Move the return date one day later. Save. | C3: the receipt names the old and the new dates and says that open applications are checked again. TA-05 shows the new dates. TA-07 of an application in the group shows the new travel dates. | L | `core.edit_travel_dates`; BS B06; PL §5.2 |
| WP03-A20 | TA | TA-13 edit | Save the same dates. Save a return date before the start date. Open the edit address of a closed group (fixture). | Same dates: C1 "The dates are unchanged." Return before start: C1 on the return date. Closed group: no "Edit travel dates" on TA-05; the edit address shows "The group is closed. Its travel dates cannot change." with the route to its history, and no form. | L (first two) + T (closed) | `core.edit_travel_dates` (`group_dates_invalid`, `group_closed`); PL §5.2 (Unavailable: group closed) |
| WP03-A21 | TA (`syn-ta-1`), two tabs | TA-13 edit of G1 | Open the edit page in tab 1 and tab 2. In tab 2 save new dates. In tab 1 save other dates. | Tab 1: C5 "Changed since your review" (CMP-14) with the current dates and the unsent dates side by side, and "Review current information". Nothing is overwritten. | L | CMP-14; UX §3.3; `core.edit_travel_dates` (revision) |
| WP03-A22 | TA | TA-13 edit, the Nth time and a lost acknowledgement (fixtures) | Resend the same form (same key). Inject a lost acknowledgement. | Same key: the same receipt; one change in the group history. Lost acknowledgement: C4 with "Check status"; no second save offered. | T | PL §7 K-STD; BS B35 |

### 2.3 TA-04 Groups list

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP03-A23 | TA (`syn-ta-1`) | 4650 `/ta/groups` (rail "Groups") | Open the page. Read the rows. | Primary action "Create group". Each row: group name (link to TA-05), country, travel dates, open or closed state in words ("Closed" or "Ended after the travel return date"), application counts with the unit "applications", counts by common progress (per Q-05), unresolved intake issue count with the unit "issues" (or "Unavailable"), next action. Freshness per the read kind. | L | PL §3.2 TA-04, §6.2 (Group list); BS B03, B25; CR-07 |
| WP03-A24 | TA (`syn-ta-1`) | TA-04 | Filter by country "Synthetica Beta" and by "Closed". Reload. Press Back. Select "Clear filters". | Filters are enumerated values in the address (SH-R06). Reload keeps them. Back restores the previous view. No match: S3 with "Clear filters". The polite region announces the count with its unit ("0 groups match" is allowed only for a real no-match result); focus stays on the control. | L | PL TA-04, §2.3 SH-R06; AC-16 |
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
| WP03-A32 | TA (`syn-ta-1`) | TA-05 tabs | Select each tab: Applications, Imports, Intake issues. Reload. Press Back. | The selected tab is in the address and survives reload and Back. Applications lists the group's applications with the TA-06 row facts. Imports and Intake issues show the existing per-group content until WP-04 (LD-02); a failed row without an application stays reachable through Intake issues. Each tab works with the keyboard. | L | PL TA-05, §2.3 SH-R06; BU §3.2 |
| WP03-A33 | TA (`syn-ta-1`) | TA-05 → TA-07 | Open an application from the Applications tab. Use the breadcrumb. Open it again and press Back. | The breadcrumb reads "Groups / [group] / [applicant]". The breadcrumb and Back return to TA-05 with the Applications tab selected, not to TA-06. | L | PL §2.3 SH-R07; UX §4.2 |
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
| WP03-A49 | TA | TA-09 create | Give the photograph as a PDF. Then give a 6 MB passport PDF. Then a GIF. Send each time. | Each is refused (C1) next to its input, with the requirement's own rule and the allowed replacement ("The photograph must be a JPEG or PNG file up to 2 MB"; "up to 5 MB"). The form is all-or-nothing: nothing is created. Typed values stay. | L | BS B15; `uploads.ts` (`document_format_unsupported`, `document_too_large`); PL §5.2 (Upload: REJ format or size with allowed replacement) |
| WP03-A50 | TA (`syn-ta-1`) | TA-09 create (V05 step B1) | Sample "Asha": typed facts that match the sample; service "SYN Tourist e-visa"; passport file only. Send. | C3: the receipt names the applicant, the service, the application reference and the state "Draft", with the request reference link. The TA reaches the draft's task list in one step. The passport row shows "Being checked" until the checks finish. No quote is fixed and nothing is submitted (V05). | L | PL §4.1 step 4, §5.2 (Create draft: Draft ID; task list); BS B17 |
| WP03-A51 | TA (`syn-ta-1`) | TA-09 create (V02 step A2) | Sample "Ravi"; services "SYN Tourist e-visa" and "SYN e-visa, fee paid with submission"; passport and photograph. Send. | C3: the receipt lists two applications, each with its own reference, service and price ("₹3,500", "₹3,600"), each with a link to its own task list. Unit: "2 applications created". | L | UX §12 V02; BS B03 |
| WP03-A52 | TA (`syn-ta-1`) | TA-09 create in G2 (V02 step F1) | Send the same passport number and issuing country with "SYN Tourist e-visa" again, plus a second service that is new for this applicant. | C2: "This applicant already has an open application for this service in this group." with a link to it. The page says that nothing was created, also not for the other service (all-or-nothing). Typed values stay. | L | BS B03, B35 (duplicate scope); `start-individual.ts` (`duplicate_open_scope`); PL §5.2 (Create draft REJ) |
| WP03-A53 | TA | TA-09 create | Enter "Resident in India: No" with otherwise valid facts. Send. | C2 with the population reason in words (the service is for Indian ordinary-passport holders resident in India). Nothing is created. | L | BS B02, B07; core intake writers (population scope on positive evidence) |
| WP03-A54 | Harness as `syn-ta-1` | TA-09 create | Send the form with the service reference of "SYN Provider visa (route not approved)". | Refused with the offering reason (WP-02 TA text). Typed values stay. No draft, application, intake attempt or issue is created; the counts of TA-04 and TA-06 are unchanged. | L+T | WP02-A30 (regression on the rebuilt page); BS B07 |
| WP03-A55 | Harness as `syn-ta-1` | TA-09 create in a Synthetica group | Send the form with the reference of "SYX Tourist e-visa". | C1 or C2: "This service is not offered in this group's country." Nothing is created. | L | `start-individual.ts` (`offering_not_in_country`); BS B03 |
| WP03-A56 | TA (`syn-ta-1`) | TA-09 create | Open the form. Wait 6 minutes. Fill it and send. | The form is accepted (or refused only for a field reason). No bot check exists on this form; no "The verification did not pass" message appears. | L | UF UAT-08 (derived); TR §4 (bot check only on sign-in pages) |
| WP03-A57 | TA (`syn-ta-1`) | TA-09 create, the Nth time; a lost acknowledgement (fixture) | (1) Double-click "Create draft". (2) Press Back after the receipt and send the same form. (3) Change one fact and send the used form. (4) Inject a lost acknowledgement. | (1) and (2): one attempt and the same drafts; the same receipt. (3): refused as a used form with a fresh form offered in one action; no second draft set; a new key also meets the duplicate-scope check (A52). (4): C4 "Checking the original result" and "Check status"; no new send offered. | L+T | PL §7 K-STD; BS B35 ("a new key cannot evade business duplicate checks") |
| WP03-A58 | TA (`syn-ta-1`), two tabs | TA-09 create of G1 | Open TA-09 in tab 1 and fill it. In tab 2 change the travel dates of G1 (A19). Send tab 1. | C5: the page says the group changed since the form opened and shows the current group facts. Typed values stay (files must be chosen again, A48). Nothing is created until the TA sends again. | L | `start-individual.ts` (`expectedGroupRevision`); CMP-14; UX §3.3 |

### 2.6 TA-09 task list and sections

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP03-A59 | TA (`syn-ta-1`) | TA-09 task list of the V05 draft | Read the list. | Sections: group and service; applicant facts; required documents; evidence results; review. Each link is followed by its state in words, from facts: "Not started", "In progress", "Needs evidence", "Cannot start yet: [reason]", "Completed". No percentage and no overall "Ready". "Review" leads to TA-08. | L | PL §3.2 TA-09, CMP-04; UX §4.3, §7.5 |
| WP03-A60 | TA | Group and service section | Read it. | Group, country, travel dates, service, mode, the price that a submission today fixes ("₹3,500, fixed when you submit") and the estimate. The service cannot change here; the page says that another service needs a new application. | L | BS B03, B17; PL §5.2 |
| WP03-A61 | TA (`syn-ta-1`) | Applicant facts section | Choose Travel purpose "Tourism". Select "Save and continue". Then select "Save and exit" on the next section. | C3: the receipt names only the accepted scope ("Travel purpose saved"). The section state changes per facts. "Save and exit" returns to TA-07 with nothing lost. | L | `core.edit_draft`; PL §5.2 (Save section: accepted scope listed) |
| WP03-A62 | TA | Applicant facts section | Read the declared fields. Send an option that the declaration does not list (harness). | The section lists exactly the declared form fields (Travel purpose, required, one option). The hand-made value is refused (C1) in words; nothing changes. | L+T | `core.edit_draft` (`validateFormFields`); BS B05 |
| WP03-A63 | TA (`syn-ta-1`) | Applicant facts section | Change the surname in the ordinary save (harness if the form does not offer it). | Refused: identity details change only with same-person evidence. The page offers "Correct identity details" with the reason. Nothing changes. | L | `core.edit_draft` (`identity_field_requires_correction`); BS B19 |
| WP03-A64 | TA (`syn-ta-1`) | "Correct identity details" | Send with no evidence chosen. Send with no change. Choose the application's passport as evidence, change the given names to match the passport, write an explanation, send. | No evidence: C1 "Choose the identity document that shows the corrected details." No change: C1 "Nothing changed." Accepted: C3 receipt names each changed field with before and after values and the evidence version. The history shows the correction. | L | `core.correct_identity`; BS B19; PL §5.2 (Change identity field) |
| WP03-A65 | TA | "Correct identity details" | Change the passport number to a value that the passport document does not show. | C2 with the reason in words (the evidence does not show the new value). Nothing changes. The page names the route: replace the document, or keep the value. | L+T | `core.correct_identity` (`requireSamePersonEvidence`); BS B15, B19 |
| WP03-A66 | TA (`syn-ta-1`) | Required documents section | Read it. | One row per declared requirement: label, required or optional, formats, size limit, current version and status (CMP-02) in words. Actions per row: "Upload" (missing), "Replace" (present), "Use a file already in this group" (associate). The passport row shows the TA-09-R1 text (A43). | L | PL §3.2 TA-09, §5.2; CMP-02, CMP-28 |
| WP03-A67 | TA (`syn-ta-1`) | Required documents, photograph missing (V05 step E1) | Upload `photo-placeholder.jpg`. Reload after the checks finish. | C3: the receipt names the new version. The row shows "Being checked", then the verdict after reload. No row shows "Accepted" before its checks finish. | L | `doc.upload_for_application`; PL §5.2 (Upload: version recorded; processing then verdict) |
| WP03-A68 | TA | Required documents | Upload a GIF, a 6 MB PDF and a PDF for the photograph. Upload the safety-check fixture file (test). | Format and size: C1 next to the input with the requirement's own formats and limit and the allowed replacement. Safety failure: "This file was not accepted because it failed the safety check." No bytes or preview of the file show. | L (format, size) + T (safety) | BS B15; PL §5.2 (Upload REJ) |
| WP03-A69 | TA (`syn-ta-1`) | Required documents, passport present | Replace the passport JPEG with `passport-asha-syntest-scan.pdf`. | C3: a new version is current. The old version shows "Replaced" and visibly loses eligibility. Both versions show with their numbers. | L | `doc.replace_version`; PL §5.2 (Replace document); UX §2.1 (Document version) |
| WP03-A70 | TA (`syn-ta-1`) | Required documents of V02 application B; harness | Select "Use a file already in this group" for a requirement that has no association. Then send the association of a version of G3 (another group) by hand. | The chooser lists only versions of this group, by type and version. Choosing one: C3; the row shows the version and its status. The hand-made request with another group's version is refused like an unknown object; nothing is associated and nothing about G3 is disclosed. | L+T | `doc.associate`; BS B03 (no cross-group document reuse), B10 |
| WP03-A71 | TA | Evidence results section | Reach on `lane-ui`: processing, accepted, missing, a conflict (typed passport number differs by one character from the sample's machine-readable line, in a fresh applicant), a validity failure (photograph below 350 × 350 pixels). Render the other states by fixture: unsafe or quarantined, unreadable, unavailable, replaced, unclassified, unassociated, validity unknown. | Each state shows in words with the version, the reason and the next action or owner. The conflict says that the typed passport number differs from the passport document and offers both routes: correct the identity details, or replace the document. No state shows as zero, blank or "Ready". | L (five states) + T (all) | CMP-02; UX §7.4; BS B15, B16; `REQUIREMENT_EVIDENCE_STATUSES` |
| WP03-A72 | TA (`syn-ta-1`), two tabs | Applicant facts section | Open the section in tab 1 and tab 2. Save in tab 2. Save a different value in tab 1. | Tab 1: C5 "Changed since your review" (CMP-14): a table of field, your unsent value, current value; "Review current information". Nothing is overwritten. | L | CMP-14 (first consumer: WP-03, WP-01 design §7.6); UX §3.3 |
| WP03-A73 | TA | Save section, the Nth time; a lost acknowledgement (fixtures) | Resend the same form (same key). Inject a lost acknowledgement. | Same key: the same accepted scope; one change in history. Lost acknowledgement: C4 with "Check status"; no second save offered. | T | PL §7 K-STD; BS B35 |
| WP03-A74 | Phone user, TA | TA-09 at 390 px | Open the task list. Open a section. Save. | The task list comes first. Each section is a full-screen page. "Save and continue" is at the end of the section, not in a fixed bar that hides errors. No horizontal page scroll. | L | PL TA-09 (Mobile); UX §7.3 (Mobile) |
| WP03-A75 | TA (`syn-ta-1`) | TA-09 sections of the V05 application after assignment (V05 step G2); harness | Open a section by its address. Send a save by hand. | The section shows no edit control. It shows the TA-07 read-only notice (A103). The hand-made save is refused with the same notice text. Nothing changes. | L+T | BS B18; `core.edit_draft` (`awaiting_formal_return`); PL §5.2 (Save section: Unavailable) |
| WP03-A76 | TA (`syn-ta-1`) | TA-09 of the V05 application after submission and before assignment (V05 step F1) | Replace the photograph. | C3: the receipt says that the correction is recorded and that TravelMudra checks the application again. TA-07 shows the quote and the original estimate unchanged. | L | BS B19 ("submitted unassigned correction invalidates affected readiness"); UX §2.3 |

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
| WP03-A85 | TA (`syn-ta-1`) | TA-06 filters | Filter by "Needs your action", by country, by service and by progress. Reload. Press Back. Clear. | Filters are enumerated values in the address. Reload keeps them; Back restores the previous view. The polite region announces the count with its unit; focus stays. No match: S3 with "Clear filters", and the page says when applications exist in other views. | L | PL TA-06, §2.3 SH-R06; AC-16; BU §6.2 |
| WP03-A86 | TA (`syn-ta-1`) | TA-06 → TA-07 | With a filter and on a later page (if paged), open an application. Press Back. Open it again and use the breadcrumb. | Both return to TA-06 with the same filter, page and position near the opened row. | L | PL §5.2 TA-06 ("preserve filter and return position"), SH-R07 |
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
| WP03-A95 | TA (`syn-ta-1`) | 4650 `/ta/applications/:applicationId` of the V05 draft | Read the header. | Identity band: `h1` with applicant and application reference; group, country, service, mode. Status facts as separate labelled rows: common progress "Draft", outcome "Outcome not recorded", next owner and action, lifecycle, service payment. No combined badge, no percentage. Freshness line. | L | PL §1.2 D4, §3.2 TA-07, CMP-03, CMP-11; UX §2.2 |
| WP03-A96 | TA (`syn-ta-1`) | TA-07 action panel of the V05 draft without a photograph | Read the panel. Add the photograph (A67) and reload. | Before: "Your action: complete the draft", with each missing item in words as a blocker that evidence can fix, each linked to its TA-09 section; primary "Continue draft". After the facts allow submission: primary "Review and submit". The page shows Submit as available only when the read model says so (`submit.allowed`); a fixture that says not allowed shows its reasons and no usable control. | L+T | CMP-01; PL §6 ("A read model never grants permission"), §5.2 TA-07 |
| WP03-A97 | TA | TA-07 timing block of a draft | Read it. | "If you submit today: ₹3,500, fixed when you submit; estimated processing window [date] to [date], an estimate, not a guarantee." No deadline, no approval promise. | L | BS B17; PL §13.2 B-10; CR-03 |
| WP03-A98 | TA | TA-07 documents | Read the evidence rows. Open one. | One CMP-02 row per document with version and status in words; each opens the document detail (A77). | L | CMP-02; CC-05 |
| WP03-A99 | TA (`syn-ta-1`) | TA-07 of the V05 draft → "Request help" (V05 step B2) | Read the form. Write a note. Send. Reload. | The form has a labelled optional note (up to 2000 characters) and says that help is separate from submission and that a SuperAdmin decides. C3: "Help requested. A SuperAdmin decides whether TravelMudra helps." with the request reference. Afterwards the page shows "Help requested: waiting for a SuperAdmin decision" in place of the action. The application stays a draft; "Review and submit" is still the way to submit. No "Submit for TA". | L | `core.request_assistance`; PL §4.2 A1, §5.2; UX §3.2 (Approved assistance); BS B17, B18 |
| WP03-A100 | TA (`syn-ta-1`); harness | TA-07 of the V05 draft after A99 | Look for "Request help". Send a second request by hand. | No second request control. The hand-made request: C2 "A help request is already open for this application." with its status. Nothing new is recorded. | L+T | `core.request_assistance` (`assistance_request_open`); PL §5.2 (Request help: Unavailable) |
| WP03-A101 | TA | Request help, the Nth time, from an older page, and with a lost acknowledgement (fixtures) | Resend the same form. Send the form from a page opened before the draft changed in another tab. Inject a lost acknowledgement. | Same key: the same receipt; one request. Older page: C5 with the current facts; nothing is recorded. Lost acknowledgement: C4 with "Check status"; no second request offered. | T | PL §7 K-STD; BS B35; `core.request_assistance` (revision) |
| WP03-A102 | TA (`syn-ta-1`) | TA-07 of the V05 application after submission (V05 step E4) | Read the page. | Progress "With TravelMudra". Outcome "Outcome not recorded". Next owner and action as Core reports them, in words (for example "TravelMudra: assign an operator"). Timing as separate rows: quote "₹3,500, fixed at submission"; original estimate "[date] to [date]"; current forecast "Not recorded". Service payment as its own row. | L | PL §4.1 step 5, TA-07; UX §3.1 (estimate and forecast separate); BS B17, B21 |
| WP03-A103 | TA (`syn-ta-1`) | TA-07 of the V05 application after assignment (V05 step G2) | Read the page. Look for edit, upload, replace, "Continue draft" and "Review and submit". | The page shows "This application is with your operator. Report the problem so it can be returned for correction." with the owner ("Your operator", or the operator's name per Q-05) and the route "Report a problem" (the existing form, Q-01). No edit, upload, replace, "Continue draft" or submit control shows. | L | UX §2.3, §4.4; PL §3.2 TA-07 (assigned and not returned), §5.2; BS B18; UX §12 V07 |
| WP03-A104 | Harness as `syn-ta-1` | TA-07 of the assigned V05 application | Send a draft edit, a document upload and a submission by hand. | Each is refused with the notice text of A103. Nothing changes. | L+T | BS B18; `awaiting_formal_return` |
| WP03-A105 | TA (`syn-ta-1`), operator | TA-07 of the V05 application after the operator records a forecast (V05 step G3) | Read the timing block. | The original estimate is unchanged. "Current forecast: [date] to [date]" shows as a separate row, labelled as a forecast. The quote is unchanged. | L | BS B17 ("show later forecast separately"); UX §12 V05 |
| WP03-A106 | TA (`syn-ta-1`) | Rebuilt TA-07 and TA-05 | For each command that the current pages post for a later package (Q-01 list in §1.2), open an application or group where Core offers it. | Each action is still reachable and works as before the rebuild. A unit test lists these transitional panels, so that none stays by accident. | L+T | LD-02; LD-07; Q-01 |
| WP03-A107 | TA (`syn-ta-2`) | TA-07 and TA-08 addresses of a `syn-ta-1` application | Open them. | SH-02 identical to not found (WP01-A73, A74). | L | PL §2.3 SH-R02; BS B10 |
| WP03-A108 | TA | TA-07 when the case read fails, when the evidence read fails, and when the delivery facts fail (fixtures) | Render the page. | Case read failure: S7. Evidence read failure: the rows show "Unavailable" and no submit availability is claimed. Delivery facts failure: that block shows "Unavailable"; the rest renders. | T | PL §1.3 S4, S7; route-map §5 item 11 |
| WP03-A109 | Phone user, TA | TA-07 at 390 px | View the page. | Order: identity, action panel and blockers, status facts, sections, history. No horizontal page scroll. | L | PL TA-07 (Mobile); UX §7.3 |
| WP03-A110 | SuperAdmin in a support view of `syn-ta-1` (fixture) | TA-07 | Render the page. | The same facts, read-only. No "Request help", no submit, no "Continue draft". | T | PL §2.3 SH-R09; BS B10 |
| WP03-A111 | TA (`syn-ta-1`) | TA-07 → history of the V05 application | Open the history. | Lines for draft created, help requested and submitted, each with event time and recorded time labelled in IST. No staff identity or internal detail. | L | CMP-09; CR-06; `views.ta_history` |

### 2.10 TA-08 Review and submit

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP03-A112 | TA (`syn-ta-1`) | TA-07 → "Review and submit" → TA-08 (V05 step E2) | Read the page from the top. | Sections in order: applicant and service identity; governing offer summary (service, mode, who files, country); evidence per declared control (accepted, missing, conflict) with each document; quoted price "₹3,500"; the original estimate that submission starts ("[date] to [date]; an estimate, not a guarantee; it starts when you submit, whether or not payment is recorded"); payment facts as recorded; the authority and consent confirmation; "Submit this application". | L | PL §3.2 TA-08, §5.2; UX §4.3 (Submission review); BS B17 |
| WP03-A113 | TA | TA-08 | Use each "Change" link. Return to TA-08. | Each link names its section and returns to the TA-09 section; values stay; the TA comes back to TA-08. | L | CMP-05; UX §7.5 (check answers) |
| WP03-A114 | TA | TA-08 confirmation | Read the confirmation. Reload. | The declared confirmation shows its statement text in words per Q-04 (draft copy, marked as draft until C05 approval); never the code or a humanized code ("Ta confirms details"). The checkbox is never prechecked, also after reload and after any refusal. | L | UX §4.3, §9 C05; PL TA-08 ("wording C05"); CR-09; Q-04 |
| WP03-A115 | TA | TA-08 | Submit without the confirmation. | C1: the error summary receives focus and links to the checkbox ("Confirm the statement to submit this application."). Nothing is submitted. | L | `core.submit` (`ta_confirmation_absent`); AC-08 |
| WP03-A116 | TA (`syn-ta-1`) | TA-08 of a draft without a photograph; fixtures | Open TA-08. Render a fixture whose declaration does not declare "mandatory documents present", and one whose evidence read fails. | Each unmet declared control shows with a link to its section ("Photograph: missing. Add it."). No usable Submit. "Request help" stays as a separate action. The fixture without that declared check shows no "all documents complete" gate. Evidence read failure: "Unavailable" and no submission offered. | L+T | PL §5.2 TA-08 ("MUST NOT add a universal all-documents gate"); UX §4.3; BS B17, B20 |
| WP03-A117 | TA (`syn-ta-1`) | TA-08 in a group whose travel starts in 120 days, and in a group whose travel starts tomorrow | Open TA-08 of a complete draft in each. | Each shows that submission is not possible yet or no longer possible, with the declared window in words (3 to 90 days before the travel start date) and what the TA can do. No usable Submit. No deadline is invented. | L | BS B20 (fixed evidenced cut-off is not a gate); declaration `travelDateRules`; CR-03 |
| WP03-A118 | TA (`syn-ta-1`) | TA-08 (V05 step E3) | Confirm. Select "Submit this application". | C3: "Application submitted. Operator assignment is pending." (or the next owner Core reports), with the application reference, the quote "₹3,500", the original estimate dates, the next owner and the request reference link. A submission time shows only when a read model supplies it; otherwise this item is partly met (P-02). The polite region announces the result. | L | PL §4.1 step 5, TA-08 (receipt); UX §8.2; W1 (P-02) |
| WP03-A119 | TA (`syn-ta-1`) | TA-07 after A118 | Read the timing and payment rows. | The quote is fixed at ₹3,500. The original estimate starts at the submission date. Service payment shows "Not recorded" separately; the estimate does not wait for payment. | L | BS B17 ("independently of payment"); UX §3.1 |
| WP03-A120 | TA (`syn-ta-1`), SuperAdmin | TA-08 of a draft of the WP-02 proof offering (V05 Part H, Q-10) | Open TA-08 at ₹3,450. `superadmin-1` publishes ₹3,600 with a continuation that moves drafts to the new values. Send the open TA-08 form. | C5: "The price changed since you reviewed it: it was ₹3,450 and is now ₹3,600." with "Review current information". Nothing is submitted. The confirmation must be given again. | L (per Q-10) + T | `core.submit` (`price_changed`); BS B17; UX §3.3 |
| WP03-A121 | TA | TA-08 opened at 23:58 IST and sent at 00:02 IST (clock fixture) | Send. | C5 with the new estimate dates; nothing is submitted; the TA reviews and submits again. | T | `core.submit` (estimate window from the India date) |
| WP03-A122 | TA | TA-08 after the declaration changes its confirmation text version (fixture) | Send the older form. | C5: the page shows the new statement; nothing is submitted; the TA confirms the new statement. | T | `core.submit` (text version check) |
| WP03-A123 | TA (`syn-ta-1`) | TA-08, the Nth time | (1) Double-click "Submit this application". (2) Press Back after the receipt and send the same form. (3) Open a fresh TA-08 address of the submitted application, or send a new key by hand. | (1) and (2): one submission; the same receipt. (3): no submit form; a hand-made new key is refused (C2) "This application is already submitted." with a link to it. | L+T | PL §7 K-STD; BS B35 |
| WP03-A124 | TA | TA-08 with a lost acknowledgement (fixture) | Inject the fault. | C4: "Checking the submission" with "Check status". "Submit this application" is hidden until the original operation is reconciled. | T | PL §4.1 step 5 (UNR), §5.2 TA-08 |
| WP03-A125 | TA (`syn-ta-1`), SuperAdmin | TA-08 while the offering is suspended (WP-02 proof offering through the existing launch page per WP-02 Q-04, or fixture) | Open TA-08. Send an older form by hand. | A CMP-10 notice: submitting is unavailable while TravelMudra has paused new applications for this service, with the owner and the route. No submit control. The hand-made send is refused with the same reason. | L (per WP-02 Q-04) or T | BS B07; PL §4.2 (Withdrawn or suspended offering); UX §3.2 |
| WP03-A126 | TA (`syn-ta-1`) | TA-08 → "Request help" | Request help from TA-08 on a draft with no open request (V02 application B). | The same command and receipt as A99. Nothing is submitted. The TA stays able to submit later. | L | PL §5.2 TA-08 (Request help); UX §3.1 step 3 ("Help is a separate action") |
| WP03-A127 | Phone user, TA | TA-08 at 390 px | View the page. Submit with an error. | Sections are stacked. The confirmation and the primary action are at the end of the page, not in a fixed bar. The error summary and the checkbox are visible when focused. | L | PL TA-08 (Mobile); AC-02 |
| WP03-A128 | TA | TA-08 and its receipt | Read all visible text. | The button reads "Submit this application". No "Submit for TA", "Submit all", "Pay now", approval promise, deadline or SLA. The estimate is called an estimate. | L | UX §4.3; §11.1; CR-03 |

### 2.11 Command results, access and shell on WP-03 pages

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP03-A129 | TA | Every accepted WP-03 command reachable on `lane-ui` | Read the receipt. | CMP-08 as WP01-A82: the request reference links to the operation status page; resulting facts; "Recorded once. Sending the same form again does not repeat it." (or the same facts); no accepted time until P-02; any time shown carries IST. The polite region announces the result; focus does not move unexpectedly. | L | PL §1.1 ACC; W1 (P-02, A-04); AC-09 |
| WP03-A130 | TA | Each of the 12 commands of §1.2 with a lost acknowledgement (fixture) | Inject the fault. | C4 (CMP-13): "Checking the original result" and "Check status". No new submission of the same intent is offered. "Check status" reads the same operation and shows the final result (for a stale revision: C5 then). | T | PL §1.1 UNR, §1.4 C4; BS B35 |
| WP03-A131 | TA | Each of the 12 commands | Send the same operation key with the same content, then with different content (harness). Send a new key for an intent that Core already holds (duplicate scope, submitted application). | Same content: the original result. Different content: refused as a conflict. New key: the business duplicate check still refuses. No second record. | T | PL §7 K-STD; BS B35 |
| WP03-A132 | TA | Every refusal reachable on `lane-ui` in A09 to A128 | Read each message. | CMP-07 with the reason in words, the owner or route where one exists. A message is never a code alone; where the text is missing, the code itself shows with a plain sentence (UAT-13). No "Something went wrong", "Invalid data" or forbidden label. | L | PL §1.1 REJ, §11.1; CR-01; SC §3.4; UF UAT-13 |
| WP03-A133 | TA | Every reason code that TA-01, TA-04 to TA-09, TA-13 and the document detail can show | Check the text map against the reason vocabulary and the intake text catalogue (S-01). | Every code has travel-agent text, or falls back to showing the code. No known code falls back to "This is not available at the moment." | T | CR-01; LP §8 S-01; SC §3.4 |
| WP03-A134 | TA (`syn-ta-1`), SuperAdmin | TA-09 with unsent input; any WP-03 page | (1) While TA-09 holds typed values, `superadmin-1` suspends `syn-ta-1`; the TA sends the form; the SuperAdmin restores the account. (2) Sign out from TA-07; press Back. | (1) The TA lands on sign-in; no restricted content shows; nothing is created. (2) Back shows the sign-in page, never TA-07 content (A-02). Any region that refreshes later follows A-01. | L | PL §2.3 SH-R04, SH-R11; W1 A-01, A-02; BS B10 |
| WP03-A135 | TA | Every WP-03 page | Read the shell. | Environment label; "[TEST]" title prefix; rail current item: "Home" (TA-01), "Groups" (TA-04, TA-05, TA-13), "Applications" (TA-06 to TA-09, document detail); breadcrumb; one `h1`; freshness line where the page shows derived data. | L | PL §2.1, §2.2; WP01-A01, A08, A16 |
| WP03-A136 | TA | TA-09, TA-07, document detail | Inspect `localStorage`, `sessionStorage` and IndexedDB after using the pages. Read the cache headers. | No identity document, extracted personal data or typed passport number is kept in browser storage. Signed-in pages send `no-store`. | L+T | PL §2.3 SH-R12; UX §3.3 |
| WP03-A137 | TA | Every WP-03 page | Read all visible text. | No forbidden label of §11.1 ("Approved" or "Done" as an overall status, "Ready" as a universal state, "Submit for TA", "Submit all", "Merge people", "Mark verified", "Pay now"). Times carry IST. Counts name their unit. Synthetic offerings carry the synthetic label. | L | PL §11.1; CR-06, CR-07, CR-08 |
| WP03-A138 | TA | TA-09, TA-08, TA-07 | Compare names and identity facts. | Applicants are identified by passport number and issuing country. No page merges, suggests or links people by name. | L | BS B15 ("never name-only/probabilistic merge"); §11.1 ("Merge people") |

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
| WP03-A159 | TA | TA-05 at 390 px with the tab select (A32) | L | same |
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

### Part C. Payment creates no submission (L; set-up through the existing SuperAdmin page, LD-02)

| Step | Action | Observable result |
|---|---|---|
| C1 | `superadmin-1` records a service payment for the B1 draft through the existing payments page of the application. | Whether Core accepts or refuses the record, the application stays a draft: no quote fixed, no submission, no original estimate start. If accepted, TA-07 shows the payment fact as its own row; if refused, the run record keeps the reason. |

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

### Part G. Assignment and forecast (L; set-up through the existing SuperAdmin and operator pages, LD-02)

| Step | Action | Observable result |
|---|---|---|
| G1 | `superadmin-1` records the service payment if C1 did not, and assigns the application to `syn-operator-1`. | The assignment succeeds (Gate 1 met). |
| G2 | `syn-ta-1` opens TA-07 and a TA-09 section (A103, A75). The harness sends an edit by hand (A104). | Read-only notice with "Report a problem". The hand-made edit is refused. |
| G3 | `syn-operator-1` records a forecast that ends after the original estimate (existing operator page). `syn-ta-1` reads TA-07 (A105). | Original estimate unchanged; current forecast shows separately; quote unchanged. |

### Part H. A price change after review never changes an authorized quote (L per Q-10; otherwise T)

| Step | Action | Observable result |
|---|---|---|
| H1 | `syn-ta-1` adds two applicants of the WP-02 proof offering in the WP-02 D11 group through TA-09; submits application P1 at ₹3,450; opens TA-08 of draft P2 and leaves it open. | P1 receipt shows ₹3,450. |
| H2 | `superadmin-1` publishes the price ₹3,600 for the proof offering with a continuation that moves drafts to the new values (existing WP-02 page). | Publication receipt lists 1 affected draft. |
| H3 | `syn-ta-1` sends the open TA-08 of P2 (A120). | C5 "The price changed since you reviewed it". Nothing submitted. |
| H4 | `syn-ta-1` reviews and submits P2. Reads TA-07 of P1. | P2 quote ₹3,600. P1 quote stays ₹3,450 (an increase needs renewed TA authority, B17). |
| H5 | Run the test that an unpaid price reduction applies automatically and a paid one does not (B17). | Both pass. The page shows the reduced price as a new price record with the earlier quote kept in history. |

### Part I. Result

V05 passes when parts A, B, E, F and G show their results on `lane-ui` at the integrated WP-03 commit, part C shows
its result (either outcome), part D's tests pass, and part H passes on `lane-ui` or by named test as Q-10 decides. The
run record names each test, the `lane-ui` ref, the run tag and the identifiers.

## 4. Proof scenario V02

V02 (UX §12): "One row yields two services; two independent applications retain separate quote/authority/owner/outcome
and no cross-group reuse." Authority B03, B14. WP-03 proves V02 through the individual form (one applicant, two
services). The bulk row variant belongs to WP-04 (BU-01 and the bulk proofs).

### Part A. One applicant, two services, two applications (L)

| Step | Action | Observable result |
|---|---|---|
| A1 | `syn-ta-1` creates "WP03 [run] G2" in Synthetica (dates as V05 A1). | Receipt. |
| A2 | TA-09: sample "Ravi", services "SYN Tourist e-visa" and "SYN e-visa, fee paid with submission", passport and photograph, Travel purpose "Tourism" in each application afterwards (A51, A61). | Two drafts A (₹3,500) and B (₹3,600). TA-06 shows two rows (A94). |

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

### Part D. Separate owner (L; set-up through the existing SuperAdmin page, LD-02)

| Step | Action | Observable result |
|---|---|---|
| D1 | `superadmin-1` records payment for A and assigns A to `syn-operator-1`. | A: read-only notice (A103). B: still editable by the TA; next owner the TA (or the SuperAdmin help decision). |

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
| V07: an assigned TA can only report; no edit, upload or submission | A103, A104, A75 (formal return and reconfirmation are WP-09) |
| V24: keyboard and phone workflows; error locations; next owner and action | A139, A141, A144, A151 |

## 5. Out of scope and boundaries

These MUST NOT appear on any WP-03 page:

- A group-level "Submit all", a submission without the TA's own confirmation, a prechecked confirmation, or a
  confirmation that shows a code or a humanized code in place of its statement (UX §4.3; BS B17; Q-04).
- A "Submit for TA" label, or help, payment or import that changes an application to submitted (BS B17, B18).
- An "all documents complete" gate that the declaration does not declare (UX §4.3; PL §5.2 TA-08).
- A deadline, SLA, approval promise, "Pay now", support hours or a computed date that the read models do not state
  (UX §4.4, §9 C13; BS B17).
- A passport number format stated by the page itself, or a passport file shape that the command refuses (§14.2).
- Search text, personal data or a typed passport number in the page address (SH-R06).
- A document of another group offered or accepted for an application (BS B03), or a merge of people by name (BS B15).
- An edit, upload or submission control on an assigned application that is not formally returned (BS B18).
- A "Ready to close" or closure promise on TA-05, or a closure state computed by the page (AD-06; BS B25).
- A count shown as "0" when it is unknown, or a list that hides its row limit (D7).

Not in WP-03 (later packages or other lanes):

- Bulk pages BU-P01 to BU-P10, the content of the Imports and Intake issues tabs of TA-05, the bulk bot check (UAT-08),
  per-source fields (UAT-06), self-refresh of an import (UAT-10), the imports overview across groups (UAT-11, P-01),
  the Drive folder fault (UAT-12) and the bulk "See the reference code" fault (UAT-13): WP-04, WP-05, WP-18 and the
  bulk lane.
- Services chosen at group creation (UAT-07): a Kind 2 change in the bulk lane; TA-13 builds no service choice now.
- A "New application" entry outside a group (UAT-04): Max ruled P2, decide later.
- Report a problem, formal return, hand back and the help decision (WP-09); price decision, withdrawal, forecast
  recording, the travel-date impact preview and recheck, held corrections and "Close the group" (WP-17); dependencies
  (WP-10); changed terms (WP-13); outcome, delivery and result download (WP-08); TA-10, TA-11, TA-12 (WP-08, P1).
  Each of these stays reachable as it is today (Q-01).
- Submission of a returned case and its receipt with the original quote and the confirmation time (PL §4.2 R3; WP-09).
- Payment, assignment and forecast pages (WP-06, WP-17): used here only as proof set-up through the existing pages.

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
| Verified on (date, IST) | |
| Installation and ref (`uat.py status lane-ui` output: commit or tag) | |
| Lane commit of the tests named for `T` items | |
| Seam contract version and bulk-lane commit integrated (Q-02, Q-03, UAT-09 fix) | |
| Run tag and identifiers (internal record reference) | |
| Browsers and versions | |
| Assistive technology used | |
| V05 result (parts A to I; where shown) | |
| V02 result (parts A to G; where shown) | |
| TA participants for A151 (number; results) | |
| Open findings (ID, rank, scenario) | |
| Signed by (role and name) | |

Result per item (Pass, Fail, Blocked, Partly met or Not run; evidence reference; note):

| ID | Result | Evidence | Note |
|---|---|---|---|
| WP03-A01 | | | |
| WP03-A02 | | | |
| WP03-A03 | | | |
| WP03-A04 | | | |
| WP03-A05 | | | |
| WP03-A06 | | | |
| WP03-A07 | | | |
| WP03-A08 | | | |
| WP03-A09 | | | |
| WP03-A10 | | | |
| WP03-A11 | | | |
| WP03-A12 | | | |
| WP03-A13 | | | |
| WP03-A14 | | | |
| WP03-A15 | | | |
| WP03-A16 | | | |
| WP03-A17 | | | |
| WP03-A18 | | | |
| WP03-A19 | | | |
| WP03-A20 | | | |
| WP03-A21 | | | |
| WP03-A22 | | | |
| WP03-A23 | | | |
| WP03-A24 | | | |
| WP03-A25 | | | |
| WP03-A26 | | | |
| WP03-A27 | | | |
| WP03-A28 | | | |
| WP03-A29 | | | |
| WP03-A30 | | | |
| WP03-A31 | | | |
| WP03-A32 | | | |
| WP03-A33 | | | |
| WP03-A34 | | | |
| WP03-A35 | | | |
| WP03-A36 | | | |
| WP03-A37 | | | |
| WP03-A38 | | | |
| WP03-A39 | | | |
| WP03-A40 | | | |
| WP03-A41 | | | |
| WP03-A42 | | | |
| WP03-A43 | | | |
| WP03-A44 | | | |
| WP03-A45 | | | |
| WP03-A46 | | | |
| WP03-A47 | | | |
| WP03-A48 | | | |
| WP03-A49 | | | |
| WP03-A50 | | | |
| WP03-A51 | | | |
| WP03-A52 | | | |
| WP03-A53 | | | |
| WP03-A54 | | | |
| WP03-A55 | | | |
| WP03-A56 | | | |
| WP03-A57 | | | |
| WP03-A58 | | | |
| WP03-A59 | | | |
| WP03-A60 | | | |
| WP03-A61 | | | |
| WP03-A62 | | | |
| WP03-A63 | | | |
| WP03-A64 | | | |
| WP03-A65 | | | |
| WP03-A66 | | | |
| WP03-A67 | | | |
| WP03-A68 | | | |
| WP03-A69 | | | |
| WP03-A70 | | | |
| WP03-A71 | | | |
| WP03-A72 | | | |
| WP03-A73 | | | |
| WP03-A74 | | | |
| WP03-A75 | | | |
| WP03-A76 | | | |
| WP03-A77 | | | |
| WP03-A78 | | | |
| WP03-A79 | | | |
| WP03-A80 | | | |
| WP03-A81 | | | |
| WP03-A82 | | | |
| WP03-A83 | | | |
| WP03-A84 | | | |
| WP03-A85 | | | |
| WP03-A86 | | | |
| WP03-A87 | | | |
| WP03-A88 | | | |
| WP03-A89 | | | |
| WP03-A90 | | | |
| WP03-A91 | | | |
| WP03-A92 | | | |
| WP03-A93 | | | |
| WP03-A94 | | | |
| WP03-A95 | | | |
| WP03-A96 | | | |
| WP03-A97 | | | |
| WP03-A98 | | | |
| WP03-A99 | | | |
| WP03-A100 | | | |
| WP03-A101 | | | |
| WP03-A102 | | | |
| WP03-A103 | | | |
| WP03-A104 | | | |
| WP03-A105 | | | |
| WP03-A106 | | | |
| WP03-A107 | | | |
| WP03-A108 | | | |
| WP03-A109 | | | |
| WP03-A110 | | | |
| WP03-A111 | | | |
| WP03-A112 | | | |
| WP03-A113 | | | |
| WP03-A114 | | | |
| WP03-A115 | | | |
| WP03-A116 | | | |
| WP03-A117 | | | |
| WP03-A118 | | | |
| WP03-A119 | | | |
| WP03-A120 | | | |
| WP03-A121 | | | |
| WP03-A122 | | | |
| WP03-A123 | | | |
| WP03-A124 | | | |
| WP03-A125 | | | |
| WP03-A126 | | | |
| WP03-A127 | | | |
| WP03-A128 | | | |
| WP03-A129 | | | |
| WP03-A130 | | | |
| WP03-A131 | | | |
| WP03-A132 | | | |
| WP03-A133 | | | |
| WP03-A134 | | | |
| WP03-A135 | | | |
| WP03-A136 | | | |
| WP03-A137 | | | |
| WP03-A138 | | | |
| WP03-A139 | | | |
| WP03-A140 | | | |
| WP03-A141 | | | |
| WP03-A142 | | | |
| WP03-A143 | | | |
| WP03-A144 | | | |
| WP03-A145 | | | |
| WP03-A146 | | | |
| WP03-A147 | | | |
| WP03-A148 | | | |
| WP03-A149 | | | |
| WP03-A150 | | | |
| WP03-A151 | | | |
| WP03-A152 | | | |
| WP03-A153 | | | |
| WP03-A154 | | | |
| WP03-A155 | | | |
| WP03-A156 | | | |
| WP03-A157 | | | |
| WP03-A158 | | | |
| WP03-A159 | | | |
| WP03-A160 | | | |
| WP03-A161 | | | |
| WP03-A162 | | | |
| WP03-A163 | | | |
| WP03-A164 | | | |
| WP03-A165 | | | |
| WP03-A166 | | | |
| WP03-A167 | | | |
| WP03-A168 | | | |
| WP03-A169 | | | |
| WP03-A170 | | | |
| WP03-A171 | | | |
| WP03-A172 | | | |
| V05 proof | | | |
| V02 proof | | | |
