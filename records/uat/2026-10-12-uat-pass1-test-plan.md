# UAT pass 1: end-to-end manual test plan and automation proposal

| Field | Value |
|---|---|
| Date | 12 October 2026 |
| Author | Claude (Opus 5.5), acting as Principal QA Engineer and Principal SDE |
| Product owner | Director of Product (reviewer of this plan) |
| Executor | Max |
| Installation | `preview` (edge `http://127.0.0.1:4610`, staff `http://127.0.0.1:4612`) |
| Build | tag `m6-final-assurance` (7be21b1) |
| Findings format | `internal/records/uat/2026-10-10-max-uat-findings-TEMPLATE.md` |
| Status | Accepted by Max on 12 October 2026 with two changes: real passports for bulk intake (A.6, Part B) and three TA accounts used as three agencies (A.2). Max executes Part D. The Director decides Part E. |

## Part A. How to use this plan

### A.1 Scope

The plan has five end-to-end sequences (E2E-1 to E2E-5). Together they visit about 90% of the pages and
about 80% of the user actions of the three surfaces: travel agent (TA), Operator and SuperAdmin (SA).
Part C gives the coverage map and the parts that are deliberately out of scope.

Each step has an **Action** and a **Check**. The Check says what to look at. Record every observation in
the findings file (one finding block per problem). Record a "pass" only in the header's "Pages visited"
list; do not write a block for a pass.

### A.2 Run order and time

The three seeded TA accounts act as three separate agencies:

| Account | Role in this plan |
|---|---|
| `syn-ta-1` | Agency 1: single application (E2E-2), group lifecycle (E2E-3) |
| `syn-ta-2` | Agency 2: bulk part 1, Excel file and Google Sheet in parallel (E2E-4 A) |
| `syn-ta-3` | Agency 3: blank state first (E2E-1), then bulk part 2, the two Drive folder forms in parallel (E2E-4 B) |

| Order | Sequence | Accounts | Time (estimate) |
|---|---|---|---|
| 1 | E2E-1 Sanity, sign-in and blank state | `syn-ta-3`, `syn-operator-3`, `syn-superadmin-1` | 45 min |
| 2 | E2E-2 One application, end to end | `syn-ta-1`, `syn-superadmin-1`, `syn-operator-1` | 90 min |
| 3 | E2E-3 Group lifecycle (5 groups) | `syn-ta-1` | 45 min |
| 4 | E2E-4 Bulk upload: A and B, four source types, real passports | `syn-ta-2`, `syn-ta-3`, `syn-superadmin-1` | 150 min |
| 5 | E2E-5 Staff operations, SuperAdmin governance, agency isolation | all roles, `syn-superadmin-2` | 120 min |

E2E-1 MUST run first: it needs `syn-ta-3` with no applications. E2E-5 uses the applications that E2E-2
and E2E-4 create.

### A.3 Rules for the executor

- Use Chrome or Firefox. Safari refuses the session cookies on plain `http://127.0.0.1`.
- Use one browser profile per role (or one normal window and private windows). The TA and staff sessions
  MUST NOT share a window, so that you can see each surface's own behaviour.
- Get sign-in codes only in your own terminal:
  `node ~/.local/share/travelmudra-preview/signin-codes.mjs <email>`.
- E2E-1 to E2E-3 use the synthetic samples. E2E-4 uses Max's real passport set (A.6).
- Quote the exact text of every error message. Note the URL path of every page with a finding.
- When a step is blocked, record the block as a finding, then continue with the next step that does not
  depend on it.
- Severity and class: as in the findings template (P0/P1/P2; class A/B/C/D).

### A.4 Observations made before the plan (12 October 2026)

I made these two observations while I checked the servers. They are not findings yet. Max confirms or
rejects them in E2E-1.

| ID | Observation | Where to confirm |
|---|---|---|
| PRE-1 | The public home page (`:4610/`) shows "No destination is open for applications yet", although the synthetic catalogue has two listed countries (Synthetica, Synthetica Beta) with nine launched services. The public listing can need a separate SA action (`/admin/public-site`). | E2E-1 step 1.2 and E2E-5 step 5.7 |
| PRE-2 | The staff root `http://127.0.0.1:4612/` answers 404. Only `http://127.0.0.1:4612/staff/sign-in` opens. A staff user who types the bare address sees an error page and no sign-in direction. | E2E-1 step 1.4 |

### A.5 The synthetic catalogue (what is onboarded now)

| Country | Service code | Title | Mode | Price (INR) |
|---|---|---|---|---|
| Synthetica (SYN) | `syn_tourist_evisa` | SYN Tourist e-visa | TravelMudra files | 3,500 |
| SYN | `syn_business_paper` | SYN Business visa (paper) | TravelMudra files | 5,200 |
| SYN | `syn_evisa_fee_with_submission` | SYN e-visa, fee paid with submission | TravelMudra files | 3,600 |
| SYN | `syn_paper_return` | SYN Paper visa with original return | TravelMudra files | 5,400 |
| SYN | `syn_tourist_prep` | SYN Tourist visa preparation | Preparation only | 1,800 |
| SYN | `syn_tourist_provider` | SYN Tourist visa via provider | Third party files | 4,100 |
| SYN | `syn_tourist_provider_unapproved` | SYN Provider visa (route not approved) | Third party files | 4,100 |
| SYN | `syn_transit_dependent` | SYN Transit e-visa (needs tourist e-visa) | TravelMudra files | 3,000 |
| Synthetica Beta (SYX) | `syx_tourist_evisa` | SYX Tourist e-visa | TravelMudra files | 3,300 |

All services need a passport and a photo. `syn_tourist_prep` also needs a travel itinerary. Processing
estimate: 5 to 12 calendar days. This is the seed data; the TA catalogue page is the truth.

### A.6 Real personal data in E2E-4 (Max's decision, 12 October 2026)

Max decided to use real passports for bulk intake: a Google Drive set of 88 documents from 11 people and
an Excel workbook that references these documents. This changes how the run is recorded:

- **Findings MUST NOT contain personal data.** Refer to people as "User 01" to "User 11" (the workbook's
  row order). Do not type a name, passport number or date of birth into a finding. Crop or blur passport
  data in every screenshot before you save it.
- **The `preview` installation now holds personal data** (document files, extracted passport fields,
  synthetic mailbox copies). Do not share the SSH tunnel or screen-share the installation outside the test
  team. The installation stays on loopback; nothing leaves this machine except the fetch from Max's own
  Google Drive.
- **Agents MUST NOT open, read or copy the real documents or their extracted values.** An agent that
  triages a finding works from the finding text and from logs, which carry allowlisted fields only.
- **After UAT**, Max decides how to remove the real data: delete the uploaded applications' data, or remove
  and recreate `preview` (`uat.py cleanup preview` needs Max's explicit instruction). Restrict or remove
  the Drive link sharing when the run ends.
- The automated suite (Part E) uses synthetic data only. Real data never enters a repository.

## Part B. Test data

### B.1 Synthetic samples (E2E-1 to E2E-3)

`~/.local/share/travelmudra-preview/samples/`: `passport-asha-syntest.jpg`, `passport-ravi-syntest.jpg`
(both with valid machine-readable lines), `passport-asha-syntest-scan.pdf`, `photo-placeholder.jpg`,
`supporting-document.pdf`.

### B.2 Max's real set (E2E-4)

| ID | Item | Prepared by Max |
|---|---|---|
| DS-1 | Google Drive folder: 88 documents of 11 people | Yes |
| DS-2 | Excel workbook: one row per person, cells that link to the DS-1 documents | Yes |

The import reads a document cell as a document when the cell holds an `https://` Drive link (a typed URL
or a cell hyperlink). In a Drive folder with a sheet, a document cell MAY instead hold the exact file name
of a file in that folder.

### B.3 Derived sources for the four bulk types

The 11 people are split so that each import has its own people. A planned overlap (B.4) tests duplicate
detection on purpose.

| ID | Source type | Content | Used in |
|---|---|---|---|
| SRC-1 | Excel file | DS-2 rows for Users 01 to 06 (save as a copy; keep the links) | E2E-4 A, group G-B |
| SRC-2 | Public Google Sheet | DS-2 rows for Users 07 to 11 (File → Import the copy into Google Sheets) | E2E-4 A, group G-C |
| SRC-3 | Drive folder with a sheet | A subfolder with the documents of Users 01 to 06, plus a Google Sheet inside it that lists them | E2E-4 B, group G-F |
| SRC-4 | Drive folder without a sheet | A subfolder with the documents of Users 07 to 11 only, no sheet | E2E-4 B, group G-G |

Checks on DS-2 before you start (each one avoids a false finding):

1. **Services.** The services column MUST name the synthetic services (for example `syn_tourist_evisa`,
   or the title "SYN Tourist e-visa"). A real service name triggers a mapping question; that is a good test
   on one row, but not on all rows. Put one unknown label (for example "Tourist visa") on one row on purpose.
2. **Destination.** If DS-2 has a destination column, it MUST say `SYN`. Another country fails the row.
3. **Sharing.** Each Drive folder and the Sheet MUST be "Anyone with the link can view". The product fetches
   only public links.
4. **Sizes.** One import accepts at most 1,000 rows, 500 files and 512 MiB in total. 88 files fit.

### B.4 Planned negative and duplicate cases

| ID | Case | How |
|---|---|---|
| NEG-1 | Row with no service | In SRC-1, empty the services cell of User 03 |
| NEG-2 | Duplicate person in one import | In SRC-1, copy User 01's row to the end |
| NEG-3 | Same person in another agency | SRC-3 (agency 3) holds Users 01 to 06, who are also in SRC-1 (agency 2). Record what the product does. |
| NEG-4 | Private sheet | A copy of SRC-2 with sharing "Restricted" |
| NEG-5 | Non-Google link | `https://example.com/list.xlsx` |
| NEG-6 | Unrelated file in a folder | Add `supporting-document.pdf` (synthetic) to SRC-4 |

## Part C. Coverage map

| Area | Pages and actions | Sequence |
|---|---|---|
| Public site | Home, countries, country page, how it works, search, sign-in help, robots and sitemap | E2E-1 |
| Identity | TA sign-in (email code), staff sign-in (email code and authenticator), sign-out, re-sign-in, wrong code, cross-surface refusal, email change (two proofs), isolation between agencies | E2E-1, E2E-5 |
| TA home and lists | Home, services list, service detail, groups, applications, notices, payments, search, intake incidents (blank and filled) | E2E-1 to E2E-4 |
| Groups | Create, validate dates, edit travel dates, group documents, close, closed-group behaviour | E2E-2, E2E-3 |
| Individual intake | Add one applicant, documents, extraction review, classification, association, edit, submit, price acceptance | E2E-2 |
| Bulk intake | Excel/CSV, Google Sheet, Drive folder with sheet, Drive folder only; questions, progress, results, row detail, correction upload, drafts, review and submit, intake incidents, parallel limit | E2E-4 |
| Application after submit | Status, history, notices, return to TA and resubmit, withdraw, dependencies, report a problem, request assistance, delivery and download | E2E-2, E2E-5 |
| Operator | Work list, application workspace, start work, work steps, readiness, external act with evidence, reconciliation, official result, artifact, packet build, delivery, document email, history, handovers, originals, incidents, notices, selections, grants | E2E-2, E2E-5 |
| SuperAdmin | Assignment queue (selection and round robin), reassign, assistance, flags, deferrals, gate exceptions, applications and groups oversight, intake oversight, documents queue, catalogue (offering, preview, publish, impact), launch control, public site, accounts, grants, elevations, support view, finance (read and parked actions), incidents, notices, monitors, measures, audit, search, projections | E2E-3 to E2E-5 |
| Accounts (finance) surface | `/accounts` via the SA surface switch | E2E-5 |

**Out of scope for pass 1:** `tm` command-line procedures (install, backup, restore, cutover), the
maintenance page while admission is closed, real email delivery, and the actions parked for owner
decisions (who starts result delivery, custody return policy for real declarations, parked finance
actions). For parked actions, the check is only that the page shows a clear "unavailable" state.

## Part D. The sequences

### E2E-1 Sanity, sign-in and blank state

Goal: prove that each role can find its entry, sign in and out, and see a sensible empty account.
Accounts: `syn-ta-3` (TA), `syn-operator-3` (Operator), `syn-superadmin-1` (SA). If an account is not
empty, record which pages show data and continue; E2E-1 is about first impressions.

| Step | Action | Check |
|---|---|---|
| 1.1 | Open `http://127.0.0.1:4610/` signed out. | A welcome or value statement is visible above the fold. The page says what TravelMudra does and who it is for. A "Sign in" link is visible without scrolling. |
| 1.2 | Read the "Destinations" block. Open "Countries". Open each country page. | PRE-1: does the page say no destination is open? Compare with the TA catalogue in step 1.10. Each country page has a unique title. |
| 1.3 | Open "How it works", "About" and the public search. Search for `Synthetica`. Open `/robots.txt` and `/sitemap.xml`. | Content is useful and specific. Search returns the country or a clear "no result" message. Robots and sitemap exist. |
| 1.4 | Open `http://127.0.0.1:4612/`. Then open `http://127.0.0.1:4612/staff/sign-in`. | PRE-2: what does the bare staff address show? The staff sign-in page has a welcome line and the two-step explanation (mailed code and authenticator code). |
| 1.5 | Confirm the two portals: TA at `:4610`, staff at `:4612`. Open `:4610/staff/sign-in` and `:4612/sign-in`. | Each portal answers only for its own audience. Record what each wrong address shows (404, redirect or a direction to the right portal). |
| 1.6 | On `:4610/sign-in`, enter `syn-ta-3@synthetic.test`. Get the code in your terminal. Enter a wrong code once, then the right code. | Bot check runs by itself. The wrong code gives a clear message and does not lock you out after one try. The right code opens the TA home. |
| 1.7 | On `:4612/staff/sign-in`, sign in as `syn-operator-3`. Use the mailed code and the authenticator code. | The Operator lands on the work list or home with only Operator destinations in the navigation. |
| 1.8 | In another browser profile, sign in as `syn-superadmin-1`. | The SA lands on the decision inbox or home. The header has a surface switch (SuperAdmin, Accounts). |
| 1.9 | **TA blank state.** Visit each TA page: home, services (`/ta/catalogue`), groups, applications, notices, payments, search, intake incidents. | Each empty page says what the page is for and what to do first (for example "Start a group"). No page shows an error, a raw code, an empty table without words, or another TA's data. |
| 1.10 | **Countries onboarded.** On `/ta/catalogue`, list the countries and services that the TA can see. Open two service pages: `syn_tourist_evisa` and `syn_tourist_provider_unapproved`. | Compare with section A.5. Each service page shows price, processing estimate, required documents and who files. The unapproved provider route shows a clear limitation. |
| 1.11 | **Operator blank state.** Visit work list, incidents, notices, selections, grants. | Empty pages explain themselves. Grants show which countries or services this Operator may work on. |
| 1.12 | **SA blank state.** Visit decision inbox or home, each queue (assignment, assistance, deferrals, flags, financial follow-up, monitoring), applications, intake attempts, intake incidents, documents queue, incidents, notices, monitors, measures, audit, search. | Empty queues say "nothing waiting" in words. Monitors and measures show "not enough data" rather than zero or an error. |
| 1.13 | Cross-surface access: as TA, type `:4610/ops/work` and `:4610/admin/catalogue`. As Operator, type `:4612/admin/catalogue`. | Each gives a refusal or a not-found page. No admin data is visible. |
| 1.14 | **Sign out and sign in again**, once per role. After sign-out, press the browser Back button. | Sign-out returns to a signed-out page. Back does not show account data. Re-sign-in works with a new code. |

### E2E-2 One application, end to end (single intake)

Goal: one application goes from draft to result, and every role sees it at the right moment.
Accounts: `syn-ta-1`, `syn-superadmin-1`, `syn-operator-1`.

| Step | Action | Check |
|---|---|---|
| 2.1 | TA: Groups → "Start a new group". Try to save with return date before start date. Then try with no country. | Each refusal names the field and the problem. Entered values stay in the form. |
| 2.2 | Create group **G-A**: country Synthetica, name `SYNTEST G-A single`, travel 16 Nov 2026 to 23 Nov 2026. | The group page shows country, dates, "India time" note and an empty applicants area with "Add applicants". |
| 2.3 | Add applicants → "Add one applicant". Enter the Asha data from the sample passport. Choose service `syn_tourist_evisa`. | The form explains each field. The draft application opens. |
| 2.4 | Upload `passport-asha-syntest.jpg` as passport and `photo-placeholder.jpg` as photo. Wait for the checks. | Each file shows its stage (scan, check, extraction) in words. The passport's machine-readable data is extracted. Any difference between typed and extracted data is shown with a choice to resolve. |
| 2.5 | Open the document page. Try "Replace" with `passport-asha-syntest-scan.pdf`. | Old and new versions are both visible; the current one is marked. |
| 2.6 | Edit the application: change one answer, then change it back. | The edit is saved. History shows both changes. |
| 2.7 | Open "Review and submit". Read the check-answers page. Submit. | The page shows price (INR 3,500), the processing estimate and the statements to confirm. After submit: a receipt with a reference. Status changes to submitted. The page says who acts next. |
| 2.8 | TA: open applications list, notices and the application history. | The list shows the new status. A notice exists if the product sends one on submit. History has one line per event, with time and actor. |
| 2.9 | SA: open the assignment queue. Open "Preview" for a selection. Assign the application to `syn-operator-1`. | The application appears in the queue. The preview says what will happen before you confirm. After assignment, the queue no longer lists it. |
| 2.10 | Operator `syn-operator-1`: open the work list. Open the application. "Start work". Record two work steps. | The application is on the work list. The workspace shows applicant, documents, service, travel dates and next action. Work steps appear in history. |
| 2.11 | Operator: open each document. Use "Retrieve" on the passport. | The file opens or downloads. Retrieval is recorded in history. |
| 2.12 | Operator: record readiness. Then withdraw it and record it again. | Readiness states (current, withdrawn) are visible with time and reason. |
| 2.13 | Operator: record the external act (filing) with evidence: upload `supporting-document.pdf` as evidence. | The act moves from "authorized" to "filed" with evidence. If a filing state is unknown, a reconciliation action is offered. |
| 2.14 | Operator: record the official result (upload `supporting-document.pdf` as the result file). Record an artifact. Build the packet. | Result and artifact are linked to the application. Packet goes from "building" to "built". |
| 2.15 | Operator: open "Delivery". Note what is available and what is marked unavailable. | Parked owner decision: the trigger to start result delivery may be unavailable. The page MUST say so in words. Record the exact wording (class B if the behaviour surprises you). |
| 2.16 | TA: open the application. Open notices. If a packet is released, download it. | The TA sees status and what happens next. A released download says "Sent in full", never "Received". |
| 2.17 | Operator: record an effort sample. Open "History" and "Handovers". | Both pages list the events of steps 2.10 to 2.16 in order. |
| 2.18 | SA: open the application in oversight (`/admin/applications/<id>`) and the audit page for it. | SA sees the same facts as Operator, plus assignment and audit details. |

### E2E-3 Group lifecycle (five groups)

Goal: groups behave correctly from creation to closure, across both countries.
Account: `syn-ta-1`. All groups of the run:

| Group | Agency | Country | Name | Travel dates | Purpose |
|---|---|---|---|---|---|
| G-A | `syn-ta-1` | SYN | `SYNTEST G-A single` | 16 to 23 Nov 2026 | E2E-2 |
| G-D | `syn-ta-1` | SYX | `SYNTEST G-D second country` | 20 to 27 Nov 2026 | E2E-3, second country |
| G-E | `syn-ta-1` | SYN | `SYNTEST G-E close me` | 25 Oct to 1 Nov 2026 | E2E-3, date edit and closure |
| G-H | `syn-ta-1` | SYN | `SYNTEST G-H services mix` | 7 to 14 Jan 2027 | E2E-3, one applicant per service mode |
| G-B | `syn-ta-2` | SYN | `UAT G-B excel` | 1 to 10 Dec 2026 | E2E-4 A, SRC-1 |
| G-C | `syn-ta-2` | SYN | `UAT G-C google sheet` | 5 to 12 Dec 2026 | E2E-4 A, SRC-2 |
| G-F | `syn-ta-3` | SYN | `UAT G-F folder with sheet` | 10 to 17 Dec 2026 | E2E-4 B, SRC-3 |
| G-G | `syn-ta-3` | SYN | `UAT G-G folder only` | 12 to 19 Dec 2026 | E2E-4 B, SRC-4 |

Travel dates MUST lie before the passport expiry dates of the real set. Check this before E2E-4.

| Step | Action | Check |
|---|---|---|
| 3.1 | Create G-D, G-E and G-H. | The groups list shows each with country, dates and counts. Order and labels are clear. |
| 3.1a | In G-H, add one synthetic applicant for each of `syn_tourist_prep`, `syn_tourist_provider`, `syn_evisa_fee_with_submission` and `syn_paper_return`. Submit each. | Each service page and check-answers page states who files, the price and the extra requirement (itinerary for the preparation service; original return for the paper visa). |
| 3.2 | In G-D, add one applicant (Ravi sample) with `syx_tourist_evisa`. Try to choose a SYN service. | Only SYX services are offered in a SYX group. |
| 3.3 | In G-E, add one applicant with `syn_tourist_evisa`. Note the warning, if any, about travel in 13 days against a 12-day maximum estimate. | The product warns or allows. Record which. |
| 3.4 | In G-E, edit travel dates to 15 to 20 Oct 2026 (3 days from now). Then back to 25 Oct to 1 Nov. | A travel-date recheck runs. The application shows the effect of the date change in words. |
| 3.5 | In G-E, add a second applicant with `syn_transit_dependent` only. Then link it to the first applicant's tourist e-visa (Dependencies). Unlink it. | The dependent service explains what it needs. Link and unlink are both recorded. |
| 3.6 | In G-E, add an applicant with `syn_tourist_provider_unapproved`. Try to submit. | The submit is refused or blocked with a reason the TA understands. |
| 3.7 | Open G-E's "Documents" page (`/ta/groups/<id>/documents`). | Shows every document of the group and which application it belongs to. |
| 3.8 | Close G-E. Read the confirmation text before you confirm. | The confirmation says what happens to the open applications. After closure: the group is "closed", its open drafts end with the group, and "Add applicants" is gone. |
| 3.9 | Try to reach `/ta/groups/<G-E id>/intake/new` by URL. | Refused with a clear reason. |
| 3.10 | Groups list: check that G-E shows as closed and the others as open. | States are correct. |

### E2E-4 Bulk upload: two agencies, four source types, real passports

Goal: each bulk source type reads the shared documents from Google Drive, processes them (scan, checks,
passport extraction) and produces draft applications that the TA reviews, completes and submits. In each
part, two imports run at the same time. Test data: Part B.2 to B.4. Handling rules: A.6.

The product offers four bulk sources: an Excel or CSV file, a public Google Sheet, a public Google Drive
folder with a sheet, and a public Google Drive folder without a sheet. The three variations (Excel, Sheet,
Folder) map to these; the folder has two forms, and the plan tests both.

#### E2E-4 A: agency 2 (`syn-ta-2`), Excel file and Google Sheet in parallel

| Step | Action | Check |
|---|---|---|
| 4.1 | Create G-B and G-C (table in E2E-3). | Both groups open, dates and country correct. |
| 4.2 | **Window 1, G-B:** Add applicants → "Import a list" → "An Excel or CSV file from this computer" → SRC-1. Read source. | The product shows what it understood: worksheet, header row, row count (7 data rows with NEG-2), mapped columns, document columns. Unused columns say "Not used". |
| 4.3 | **Window 2, G-C (at the same time):** Add applicants → "A public Google Sheet" → SRC-2 link. Read source. | "Fetching the source" is shown, then the same summary as 4.2. |
| 4.4 | Both windows: answer the questions (service label mapping, date order, worksheet or header row if asked). | Each question names its scope and its consequence. Only consequential questions are asked. |
| 4.5 | Both windows: start the import. Leave the page and return through the group page. | Progress shows real stages (fetching documents, checking, creating drafts) and survives leaving the page. Both imports progress at the same time. |
| 4.6 | **Parallel limit.** While both run, create a third group for `syn-ta-2` and try to start a third import (any source). | Expected: refused, because one TA may run at most 2 imports at once. The message says why and when to try again. |
| 4.7 | **Shared documents.** In G-B results, open each person's documents. | Every Drive link in SRC-1 is accounted for: fetched and checked, or not fetched with a reason (not public, not found, unsupported type). Passport data is extracted. A document that the product could not read says so in words. |
| 4.8 | G-B results: open "Needs you", "Drafts" and all rows. | Users 01, 02, 04, 05, 06: drafts. User 03 (NEG-1): failed "service missing" with a fix action. Duplicate of User 01 (NEG-2): flagged. Every row and every file is accounted for in the counts. |
| 4.9 | Fix User 03 with "Upload a correction" (SRC-1 with the service filled in). | A change preview shows what the correction changes. After apply, the row becomes a draft. The first attempt stays in history. |
| 4.10 | G-C results: as 4.7 and 4.8 for Users 07 to 11. | As 4.7 and 4.8. |
| 4.11 | **Draft review (G-B).** Choose "Review applications". Open each draft in turn. Compare the extracted fields with the workbook values. Resolve any extraction difference. Add anything missing. Submit three drafts. | Each draft shows imported data, documents with their classification (passport, photo, other) and the missing items. Differences between sheet and passport are shown with a choice. After a submit, the next draft opens. |
| 4.12 | Leave the other drafts as drafts. Check the applications list and the group counts. | Drafts and submitted applications are counted correctly in both places. |

#### E2E-4 B: agency 3 (`syn-ta-3`), the two Drive folder forms in parallel

| Step | Action | Check |
|---|---|---|
| 4.13 | Create G-F and G-G. | As 4.1. |
| 4.14 | **Window 1, G-F:** "A public Google Drive folder with a sheet listing the applicants" → SRC-3 folder link; choose the sheet. **Window 2, G-G (at the same time):** "A public Google Drive folder of passports, without a sheet" → SRC-4 link; name the service at start (`syn_tourist_evisa`). | G-F: the sheet is read and the document cells are matched to the folder files. G-G: the folder listing is read; the product counts files before it creates anything. |
| 4.15 | Answer questions; start both imports. | As 4.4 and 4.5. |
| 4.16 | G-G results. | One applicant per person, built from the passport files alone. Several files of one person are grouped, or a question asks. `supporting-document.pdf` (NEG-6) is excluded as unrelated, or asked about. |
| 4.17 | G-F results. NEG-3: Users 01 to 06 also exist in agency 2. | Record what the product does with a person who already has an application at another agency. Agency 3 MUST NOT see agency 2's applications or data. |
| 4.18 | Review and submit two drafts in G-G, as 4.11. | As 4.11. |

#### E2E-4 C: negative sources and oversight

| Step | Action | Check |
|---|---|---|
| 4.19 | As `syn-ta-2`: NEG-4 private sheet, then NEG-5 non-Google link, then a CSV with no header row. | Each is refused with a reason that a TA can act on (for example "make the sheet public"). Nothing is created. |
| 4.20 | As `syn-ta-2`: open `/ta/intake-incidents`. Open one incident and dispose of it (abandon the row). | The incident page explains the problem. The disposal is recorded. |
| 4.21 | SA: open intake attempts (`/admin/intake/attempts`), one attempt per agency, intake incidents and the documents queue (`/admin/documents/queue`). | SA sees each attempt with agency, source type, state and counts. Files whose checks could not finish are in the documents queue with a requeue action. |

### E2E-5 Staff operations, SuperAdmin governance and agency isolation

Goal: exercise the staff decisions and controls on the applications from E2E-2 and E2E-4, and prove that
the three agencies cannot see each other.
Accounts: all; `syn-superadmin-2` for second approvals; `syn-operator-2` for reassignment.

| Step | Action | Check |
|---|---|---|
| 5.1 | SA: assignment queue. Assign one submitted G-B application by selection to `syn-operator-1`. Assign the other by round robin. | Both assignments show the chosen Operator. Round robin explains its choice. |
| 5.2 | SA: reassign one application from `syn-operator-1` to `syn-operator-2`. | The old Operator no longer sees it; the new one does. History records both. |
| 5.3 | Operator: return one application to the TA with a reason (missing document). | TA sees "returned" with the reason and the action needed. TA fixes it and resubmits. The Operator sees it again. |
| 5.4 | TA: on another application, use "Report a problem" and "Request assistance". SA: decide the assistance request (approve), then answer the flag. | Each request appears in the right SA queue. Decisions return to the TA as notices. |
| 5.5 | Operator: flag an application to SA. SA: respond to the flag. SA: grant a gate exception on an application, then revoke it. | The flag and the gate exception appear with state and reason. Revocation is recorded. |
| 5.6 | TA: withdraw one submitted application. | The withdrawal confirmation states the consequence. The state changes; the Operator sees it. |
| 5.7 | SA: catalogue. Open `syn_tourist_evisa`. Change one displayed note, preview it and publish it. Open the impact page. Open `/admin/public-site`. | Preview shows the change before publish. Impact lists affected applications. Public site status explains PRE-1. |
| 5.8 | SA: launch control. Suspend `syx_tourist_evisa`. As TA, open the catalogue and G-D. Lift the suspension. | TA sees the suspension in words; new applications for it are blocked; existing ones show the effect. After lifting, the service is available again. |
| 5.9 | SA: accounts and access. Open the TA account `syn-ta-2`. Open a support view for it (with a reason). End the support view. Open grants and elevations. | Support view is read-only and time-limited; start, end and reason are recorded. Any action that needs a second SA asks for approval; approve it as `syn-superadmin-2` in a private window. |
| 5.10 | SA: finance (`/admin/finance`), one TA's finance page, the financial follow-up queue. Use the surface switch to open Accounts (`/accounts`). | Read pages show amounts in INR. Parked finance actions show a clear "unavailable" state. |
| 5.11 | Operator: open incidents. SA: open incidents, assign a reviewer, add evidence, send a notice, resolve and close one incident (if any exists; else record "none to test"). | States move open → assigned → resolved → closed with evidence. |
| 5.12 | Operator: originals register on a `syn_paper_return` application: record receipt, a movement and a return. | Custody states change and are recorded. The return policy item for real declarations shows as unavailable (parked). |
| 5.13 | Operator: send a document email and a manual email; resend one. TA: notices. | Mail goes only to the synthetic mailbox. The send state is visible. |
| 5.14 | SA: monitors, measures, audit for one application, staff search for a passport number, system projections. TA: search for the same applicant. | Each search finds only what the role may see. Monitors and measures now show data from the run. |
| 5.15 | TA `syn-ta-2`: start an email change (two proofs). Cancel it. | Both proofs are explained. Cancel returns to the old state. |
| 5.16 | **Agency isolation.** As `syn-ta-1`, copy the URL of one G-B application (from `syn-ta-2`) and of one G-F document (from `syn-ta-3`). Open both. Search for a User 01 detail in TA search as `syn-ta-1`. | Each URL gives "not found". Search finds nothing from another agency. No count, name or file of another agency appears anywhere. |

## Part E. Proposal: UI-based end-to-end integration test automation (Principal SDE)

### E.1 Goal

Turn the five manual sequences into an automated end-to-end suite that drives a real browser against a
real three-instance installation. The suite runs on demand on this machine. The Director can watch any
run live from a Mac, or replay it afterwards step by step.

### E.2 Tool choice

- **Playwright** (`@playwright/test` 1.63.0) and **axe-core** (`@axe-core/playwright` 4.13.0) are already
  in the repository's `devDependencies`. No new dependency is needed.
- Playwright drives Chromium and Firefox, records traces (DOM snapshots, network, console per step),
  screenshots and video, and has a UI mode for live watching.
- No cloud service (no hosted browser grid, no hosted dashboard). Everything stays on this machine, in line
  with the data-privacy rule.

### E.3 Environment (Max, 12 October 2026)

- No new lane. The suite runs against its own installation `e2e`, created with `uat.py up` on ports edge
  4630, staff 4632, core 4631, processing 4633 (the free block `uat.py suggest-ports` gave on 12 October).
- The suite MUST NOT run against `preview` (manual run and real passport data) or `lane-max`.
- `e2e` is removed with `uat.py cleanup e2e --confirm e2e` when the automation campaign ends; its
  configuration file is deleted after the cleanup. Between runs, `uat.py stop e2e` frees the memory.
- Each run uses unique names (`E2E-<run id>` in group names and surnames), so runs do not need a clean
  database.
- Chromium, the headless shell and ffmpeg (video) are already installed on the server
  (`~/.cache/ms-playwright`). Firefox is not; phase 4 installs it.

### E.4 Design

| Part | Design |
|---|---|
| Location | `test/e2e/` in the product repository (public-fit: synthetic data only). Config `playwright.config.ts`. Script `npm run test:e2e`. Not part of `npm run check`. |
| Sign-in helper | A fixture that reads the installation's synthetic mailbox and computes the authenticator code in the test process, exactly as `signin-codes.mjs` does. Codes are never printed or logged. Each role signs in once per run; the session is saved as Playwright storage state and reused. |
| Page objects | One per area: `PublicSite`, `TaGroups`, `TaIntake`, `TaApplication`, `OpsWorkspace`, `SaQueues`, `SaCatalogue`, `SaAccess`. Selectors by role and accessible name, so the tests also check accessibility labels. |
| Specs | `e2e-1-sanity.spec.ts` to `e2e-5-governance.spec.ts`, one per manual sequence. Steps use `test.step()` with the plan's step IDs (for example `2.13`), so a report line maps to this plan. |
| Waiting | Server-rendered pages: wait for the page state in words (for example "Draft created"), never fixed sleeps. Background work (scan, extraction, import) is polled with a bounded wait and a clear timeout message. |
| Accessibility | An axe check on every page that a spec visits. Violations are reported, not failing, in phase 1. |
| Bulk sources | Excel and CSV run fully local. Google Sheet and Drive sources need real public Google links: the fetch worker accepts only public internet addresses (SSRF rule), so a local stub cannot stand in. These tests carry the tag `@external` and run only on request. |
| Evidence | Per run: HTML report, trace per test, video and screenshot on failure, a JUnit file. Stored outside the repository under `~/workDirectory/...` and kept or deleted per the evidence rules. |

### E.5 Watching runs from the MacBook

The tests run headless on the Delhi server. Nothing is installed on the MacBook: Chrome on the Mac opens
web pages that the server serves on 127.0.0.1, through the same kind of SSH tunnel that Max already uses
for `preview`.

| Method | On the server | On the MacBook | What you see |
|---|---|---|---|
| 1. Live: Playwright UI mode | `npx playwright test --ui --ui-host=127.0.0.1 --ui-port=4640` | `ssh -N -L 4640:127.0.0.1:4640 <server>`, then Chrome at `http://127.0.0.1:4640` | The test list; each step appears as it runs, with a page snapshot, network and console. Start or rerun one test with a click. |
| 2. After the run: HTML report | `npx playwright show-report --host 127.0.0.1 --port 4641` | `ssh -N -L 4641:127.0.0.1:4641 <server>`, then Chrome at `http://127.0.0.1:4641` | Pass and fail per step, screenshots, a video of each test, and the step-by-step trace viewer. |
| 3. To see the app yourself during a run | nothing extra | add `-L 4630:127.0.0.1:4630 -L 4632:127.0.0.1:4632` to the tunnel | The `e2e` installation in your own browser. |

Recommendation: method 2 by default (run, then review the report); method 1 when a test fails and you want
to watch it. A virtual-display setup (VNC) is not needed and is dropped.

### E.6 Phases

| Phase | Content | Exit criterion |
|---|---|---|
| 0 | Config pointed at `lane-max`; sign-in fixture; one smoke test (public home, TA sign-in, staff sign-in) | Smoke test passes 3 runs in a row |
| 1 | E2E-1 and E2E-2 | Both pass on Chromium; traces readable in UI mode over the tunnel |
| 2 | E2E-3 and E2E-4 local sources (Excel, CSV, negative sources) | Pass; bulk waits bounded |
| 3 | E2E-5 | Pass; second-SA approval handled with two browser contexts |
| 4 | `@external` Google sources; Firefox; axe violations made failing | Pass on request |
| Optional | A test-data pack: workbook, CSV and six more synthetic passports with valid machine-readable lines | Files in the installation's samples folder |

The work owns `test/e2e/` and `playwright.config.ts` only. A change to `uat.py` is a proposal to the
orchestrator.

### E.7 Risks

| Risk | Likelihood scenario | Mitigation |
|---|---|---|
| Bot check slows sign-in | The browser puzzle takes seconds per sign-in; 15 sign-ins per run add minutes. | Sign in once per role per run; reuse storage state. |
| Flaky waits on background work | A scan or import takes longer under load and a fixed wait fails. | Bounded polling on page text; generous timeouts only for import steps. |
| Google sources change or are deleted | Someone edits the public test sheet and `@external` tests fail. | Fixtures owned by one account, read-only for others; tests check counts, not exact layouts. |
| Suite pollutes manual data | A run points at `preview` by mistake. | The config refuses any base URL whose ports are not the `lane-max` ports (4620, 4622). |

### E.8 Decisions (Max, 12 October 2026)

| ID | Question | Decision |
|---|---|---|
| E-1 | Installation for the suite | Approved: a third installation `e2e` (ports 4630 to 4633), removed when the campaign ends. No new lane. |
| E-2 | Where the suite lives | Approved: public repository, `test/e2e/`, synthetic data only. |
| E-3 | Public Google test data | Max creates the Google Sheets and Drive folders for the suite; they stay public throughout. Conditions: (a) they hold synthetic data only and are separate from the real-passport folders of the manual run; (b) their links stay out of the public repository and are read from a local, untracked file or environment variable. |
| E-4 | Watching runs | Through Chrome on the MacBook and an SSH tunnel; no remote desktop. Default: HTML report after the run; UI mode when debugging (E.5). |
| E-5 | When to build | Proposed, to be confirmed by Max: the build starts after the manual UAT. Phase 0 (harness, sign-in fixture, smoke test) does not depend on the page design and can start then. The sequence specs (phases 1 to 4) are written against the rewritten UI, page by page as each rewritten page is accepted, and serve as its acceptance tests. Specs written against the current UI would be rewritten with it. |
