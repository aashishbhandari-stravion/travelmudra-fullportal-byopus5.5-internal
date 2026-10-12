# Manual UAT findings — 12 October 2026 (pass 1)

Test plan: `2026-10-12-uat-pass1-test-plan.md` (use its step IDs, for example `E2E-4 4.8`, in the Plan ID
field). E2E-4 uses real passports: refer to people only as "User 01" to "User 11"; no names, numbers or
dates of birth here. Screenshots: Max's rule of 12 October 2026 for this machine only: keep them uncropped in
`~/.local/share/travelmudra-uat/evidence/2026-10-12-uat-pass1/screenshots/` (outside every repository, never committed); refer to them here by file name. Beta and production keep the strict rules. Add one finding block per finding. Keep one finding per block. Do not fix anything from this file; the architect
triages it.

## Header (once)

| Field | Value |
|---|---|
| Date | 12 October 2026 |
| Installation | `preview` (edge 4610, staff 4612) |
| Build | `m6-final-assurance` (7be21b1) |
| Accounts used | `syn-ta-1`, `syn-ta-2`, `syn-ta-3`, `syn-operator-1` to `-3`, `syn-superadmin-1`, `syn-superadmin-2` |
| Browser | Chrome on macOS, through the SSH tunnel over Tailscale |
| Pages visited | list every page, also the pages with no finding |

## Finding block (one per finding)

```
### UAT-01  <short title, max 10 words>
Role:      TA | Operator | SuperAdmin | Signed out
Page:      <URL path as shown in the browser>   Plan ID: <E2E-n step, e.g. E2E-2 2.13>
Steps:     1. ...  2. ...  3. ...
Expected:  <what you expected; add "UX §x.y" or "BS Bnn" only if you know it>
Actual:    <what the page showed or did; quote the exact text of any message>
Evidence:  <screenshot file name, or "none">
Severity:  P0 | P1 | P2
Class:     A | B | C | D
Repeat:    Yes (every time) | Sometimes | Once
Note:      <optional; what you would want instead, in one sentence>
```

### Severity (PRI-20260930-01)

- **P0**: blocks the main path, loses or corrupts data, shows a false fact (wrong status, wrong money,
  another TA's data), or releases a file it must not.
- **P1**: a real defect or gap that Max decides to work or park.
- **P2**: a note. Cosmetic, wording, spacing, order.

### Class (the triage rule agreed on 10 October 2026)

- **A, backend / data / deployment**: wrong fact, wrong state after a command, missing receipt, failed
  download, error page, slow or hanging request, email or code not arriving. Survives the UI rewrite.
  Fixed now in its own task chat.
- **B, policy surprise**: the product does something you did not decide, or refuses something you
  decided. Becomes an owner decision, not a fix.
- **C, view**: layout, flow, labels, missing page element, wrong order, unclear message, too many
  clicks. Not fixed. Goes into the acceptance list for the rewrite.
- **D, question**: you do not know which class or whether it is a defect. The architect classifies.

If unsure between A and C, choose A. A wrong fact on screen is A until the data proves otherwise.

## Status (Max, 12 October 2026)

UAT pass 1 stopped after E2E-1 and the first part of E2E-2 and E2E-4. Max's decision: fix nothing now,
including UAT-12 (P0, parked by owner decision). All findings go into the work after the UI rewrite:
class C items become rewrite acceptance criteria; class A items are fixed after the rewrite lands; class
B and D items wait for Max's decision. Not executed: E2E-1 1.9 to 1.14 (in part), E2E-2 after 2.3,
E2E-3, E2E-4 A and C, E2E-5.

## Findings

Recorded by the architect from Max's report on 12 October 2026. Discussion only: nothing is fixed or
implemented until Max decides.

```
### UAT-01  Back from code page gives "form already used" error
Role:      Signed out
Page:      /sign-in#email   Plan ID: E2E-1 1.6
Steps:     1. On /sign-in, enter a wrong address (not a synthetic account). Send sign-in code.
           2. The code page opens. Press the browser Back button.
           3. Correct the address to syn-ta-1@synthetic.test. Send sign-in code again.
Expected:  The sign-in page accepts the corrected address and sends a new code.
Actual:    Error summary "There is a problem". Field error "Open the page again to start a new
           request." The address field stays filled and red. The page does not say that a reload
           fixes it.
Evidence:  UAT-01-signin-back-form-already-used.webp
Severity:  P2
Class:     C
Repeat:    Once
Note:      Architect analysis: the Back button restores the old form from the browser cache with
           its used operation key; the server refuses the reuse (conflict_operation_key). The
           refusal is correct and safe; the recovery text is not. Rewrite acceptance: Back, or
           the error itself, gives a fresh form (or a "Start again" link) without a manual reload.
```

```
### UAT-02  Code page has no "use a different address" option
Role:      Signed out
Page:      /sign-in (code step)   Plan ID: E2E-1 1.6
Steps:     1. On /sign-in, enter an address. Send sign-in code.
           2. On the code page, look for a way to change the address.
Expected:  A visible "Not your address? Use a different address" link next to the code field.
Actual:    No such link. The only way back is "request a new code" in the help line under the
           form ("No email after a few minutes? ... request a new code"), which reads as a resend,
           not as a change of address. The page also does not show which address the code went to.
Evidence:  none
Severity:  P2
Class:     C
Repeat:    Yes (every time)
Note:      Rewrite acceptance: the code step names the address (masked if needed) and offers
           "Use a different address".
```

```
### UAT-03  Synthetic mailbox sign-in is slow for human testers
Role:      TA | Operator | SuperAdmin
Page:      /sign-in, /staff/sign-in   Plan ID: E2E-1 1.6, 1.7, 1.8, 1.14
Steps:     1. Enter a synthetic address. 2. Switch to a terminal and run signin-codes.mjs.
           3. Copy the 8-digit code (and the 6-digit authenticator code for staff). 4. Enter them.
Expected:  Sign-in in a test installation takes seconds and needs no second tool.
Actual:    Each sign-in needs a terminal round trip. The friction is high while learning the setup.
Evidence:  none
Severity:  P1
Class:     D
Repeat:    Yes (every time)
Note:      Options for Max (real email, a fixed test code in configuration, or the current
           mailbox helper) are discussed in chat on 12 October 2026. Decision pending. Owner
           decision, not a fix.
```

```
### UAT-04  TA cannot start a single application outside a group
Role:      TA
Page:      /ta/groups, /ta/applications   Plan ID: E2E-2 2.1
Steps:     1. Sign in as a TA. 2. Look for "New application" outside a group.
Expected:  A TA can start one application directly.
Actual:    Only "Start a group" exists. Inside a group the TA can add one applicant by form or
           many by bulk import.
Evidence:  none
Severity:  P2
Class:     B
Repeat:    Yes (every time)
Note:      By design today: the group holds the country and the travel dates, and every
           application belongs to one group. Max's ruling: P2, decide later whether it is needed.
           Architect option: a "New application" entry that asks country and dates and creates a
           group of one behind the scenes (view change only, no domain change).
```

```
### UAT-05  Public pages need more useful content and a better layout
Role:      Signed out
Page:      / and the other public pages on :4610   Plan ID: E2E-1 1.1 to 1.3
Steps:     1. Open http://127.0.0.1:4610/ signed out. 2. Visit the 5 public pages.
Expected:  A welcome, what TravelMudra does, who it is for, and clear sign-in directions.
Actual:    The pages exist and work, but the content is thin and the layout is plain.
Evidence:  none
Severity:  P2
Class:     C
Repeat:    Yes (every time)
Note:      Max: can run in parallel with other work. Content and search readiness follow
           WEB-20260926-01 (unique title and description per page, structured data with locality).
```

```
### UAT-06  Bulk import form shows every field for every source type
Role:      TA
Page:      /ta/groups/<group>/intake/new   Plan ID: E2E-4 4.2
Steps:     1. Open a group. Start a bulk import. 2. Choose "A public Google Drive folder with a
           sheet listing the applicants".
Expected:  Only the inputs for the chosen source show, and each required input is marked required.
Actual:    "Public link", "Spreadsheet file" and "Sheet listing the applicants" all show for every
           choice, all marked "(optional)". The Services block shows for every choice.
Evidence:  UAT-06-UAT-07-bulk-form-all-fields.png
Severity:  P2
Class:     C
Repeat:    Yes (every time)
Note:      Architect check of the server (start-bulk.ts): each source type is validated on the
           server. Excel needs a file of the right type and size; Sheet and Folder types need a
           Google link of the right kind; a folder without a sheet needs at least one service; the
           companion sheet is read only for "folder with a sheet". So the backend is not loose; the
           form is. One server gap: an input that does not belong to the chosen type (for example a
           file with a Folder choice) is ignored without a message. The rewrite plan already has a
           per-choice source form (BULK-UPLOAD-UI-PLAN CMP-30). Rewrite acceptance: per-choice
           fields, required marks, and a refusal (not silence) for an input of the wrong type.
```

```
### UAT-07  Services are chosen per import, not fixed at group creation
Role:      TA
Page:      /ta/groups/new, /ta/groups/<group>/intake/new   Plan ID: E2E-3 3.1, E2E-4 4.2
Steps:     1. Start a group (country, label, travel dates). 2. Start a bulk import.
Expected:  (Max) The TA chooses the services when the group is created. A different service for the
           same people goes into a new group.
Actual:    The group has no services. Each import, and each single applicant, names its own
           services; a sheet may also name services per row.
Evidence:  screenshot from Max (chat, 12 October 2026)
Severity:  P1
Class:     B
Repeat:    Yes (every time)
Note:      Owner decision; changes the group model and the intake rules. Options and the
           architect's recommendation are in chat on 12 October 2026. Decision pending.
```

```
### UAT-08  Bulk import refused: "The verification did not pass"
Role:      TA (syn-ta-3)
Page:      /ta/groups/<group>/intake/new   Plan ID: E2E-4 4.13
Steps:     1. Open the bulk import form. 2. Choose "A public Google Drive folder with a sheet listing
           the applicants". Paste the folder link. 3. Take some minutes to fill the form. 4. Submit.
Expected:  The import starts, or the page says exactly what to do.
Actual:    "There is a problem. The verification did not pass. Try again." No import started.
Evidence:  screenshot from Max (chat, 12 October 2026); not stored here because it shows a Drive link
Severity:  P1
Class:     A
Repeat:    Once (so far)
Note:      Architect analysis (probable cause, not yet proven): the bot-check challenge is put into
           the page when the page loads and lives 5 minutes (`captcha.ttlMs`). It is also bound to
           the session. A form that stays open more than 5 minutes, or survives a new sign-in, fails
           on submit with a message that does not say why. The edge and core logs hold no line for
           the refusal. Sign-in pages have the same design, but those forms are short. Workaround:
           submit within 5 minutes of opening or reloading the page.
           Confirmed by Max: the retry within 5 minutes passed.
           OWNER DECISION (Max, 12 October 2026): no bot check on the bulk import form (the TA is
           already signed in). Keep the bot check, with its 5-minute challenge, on the sign-in pages.
           To be implemented later; nothing changed now.
```

```
### UAT-09  Single applicant form refuses the passport number
Role:      TA (syn-ta-3)
Page:      /ta/groups/<group>/intake/new, "One applicant"   Plan ID: E2E-2 2.3
Steps:     1. Open a group. Choose "One applicant". 2. Choose SYN Tourist e-visa. 3. Enter the
           passport number of a real passport (User nn) and issuing country IND. 4. Submit.
Expected:  The draft is created, or the message says which format is expected.
Actual:    "The passport number has the wrong format." The application is not created.
Evidence:  UAT-09-single-applicant-passport-format.webp (shows a real passport number)
Severity:  P1
Class:     D
Repeat:    Once (so far)
Note:      Architect check (fields.ts passportNumber): for issuing country IND the number MUST be
           one letter and 7 digits. The value entered has 2 letters and 6 digits. Max to compare
           the value with the passport. If the passport really shows that form, the rule is wrong
           (class A, P0 for Indian passports). In both cases the message SHOULD state the expected
           format (class C).
```

```
### UAT-10  Bulk import progress does not refresh and has no progress bar
Role:      TA (syn-ta-3)
Page:      /ta/intake/<attempt>   Plan ID: E2E-4 4.14
Steps:     1. Start a bulk import. 2. Stay on the import page.
Expected:  (Max) The page updates by itself (about every minute), has a refresh control, and shows
           a progress bar of what is being processed.
Actual:    Static page: "Fetching the source", "No rows yet", file "Being checked". It changes only
           on a manual browser reload.
Evidence:  UAT-10-bulk-progress-fetching.webp
Severity:  P2
Class:     C
Repeat:    Yes (every time)
Note:      Rewrite acceptance: auto-refresh while the import runs, a "Refresh" control with an
           "updated at" time, and a progress bar by stage (fetch, scan, read, rows, drafts).
```

```
### UAT-11  No overview of a TA's imports across groups
Role:      TA
Page:      /ta/groups/<group>/intake   Plan ID: E2E-4 4.19
Steps:     1. Start imports in two groups. 2. Look for one page that lists both.
Expected:  (Max asks) One place where a TA sees every running and finished import.
Actual:    Each group has its own "Intake" list. "Intake incidents" lists problems only. No page
           lists all imports of the TA. A TA may run at most 2 imports at the same time.
Evidence:  none
Severity:  P2
Class:     C
Repeat:    Yes (every time)
Note:      Rewrite acceptance option: an "Imports" page (or a home-page panel) across groups, with
           state, group and progress.
```

```
### UAT-12  Every Google Drive folder import fails: "The source could not be used"
Role:      TA (syn-ta-3)
Page:      /ta/intake/<attempt>   Plan ID: E2E-4 4.13 (blocks 4.13 to 4.18)
Steps:     1. Start a bulk import with a public Drive folder (with a sheet, or without).
           2. Wait about 1 minute. Reload.
Expected:  The folder entries are listed and the import continues.
Actual:    State "Not started". "The source could not be used. See the reference code. Nothing was
           created. Fix the source and start a new intake." Folder listing: Checked, 9 KB.
Evidence:  screenshot from Max (chat, 12 October 2026)
Severity:  P0
Class:     A
Repeat:    Yes (every time, by code analysis)
Note:      Architect root cause (verified on preview, 12 October 2026): the fetch is correct and the
           folder is public. The URL builder (src/modules/intake/domain/url.ts) fetches the
           embedded folder view (embeddedfolderview?id=...), whose page lists entries as
           "flip-entry" elements (88 found in the stored page). The parser (src/workers/listing.ts)
           reads only the full Drive page format (window['_DRIVE_ivd']), which the embedded view
           does not contain, so it refuses with listing_unreadable (edge log:
           parse.read_folder_listing refused). The tests use fake workers and a fixture of the
           other format, so they never caught the mismatch. Both folder variants (SRC-3, SRC-4) are
           blocked. Fix class, not case: the parser and the URL builder MUST agree on one format,
           with a test fixture captured from a real public folder page (synthetic content).
```

```
### UAT-13  Failed import says "See the reference code" but shows none
Role:      TA (syn-ta-3)
Page:      /ta/intake/<attempt>   Plan ID: E2E-4 4.13
Steps:     As UAT-12.
Expected:  The reference code (for example listing_unreadable) and its plain meaning are visible.
Actual:    The callout says "See the reference code". No code is on the page.
Evidence:  screenshot from Max (chat, 12 October 2026)
Severity:  P1
Class:     A
Repeat:    Yes (every time)
Note:      Without the code the TA cannot fix the source and support cannot triage the failure.
```

```
### UAT-14  Passport pages: exactly two pages, one file or two files
Role:      TA
Page:      /ta/groups/<group>/intake/new, TA-09 individual intake, bulk document rules   Plan ID: E2E-2 2.3, E2E-4 4.2
Steps:     1. Provide a passport for an applicant. 2. Read what the form and the requirement say
           about pages and files.
Expected:  (Max, 12 October 2026) A passport is exactly two pages: the front page and the back page.
           The TA MAY provide them as one file that holds both pages, or as two separate files, one
           for the front page and one for the back page. Anything else is incomplete or over-supplied.
Actual:    The current implementation is confusing and misleading about pages and files (Max's
           words). The product declares a per-requirement page maximum (`pdf_max_pages`) and no
           front/back structure.
Evidence:  none
Severity:  P1
Class:     B (rule stated by Max on 12 October 2026, therefore now a requirement) + C (the form text)
Repeat:    Yes (every time)
Note:      Requirement for the bulk refactor lane (document policy, completeness per applicant) and
           an acceptance addition for TA-09 and BU-P02/BU-P06 (the rewrite): the form states the
           two-page rule and the two accepted shapes. See the triage record §2 and §3.
```

## Observations without a finding

| Plan ID | Observation | Result |
|---|---|---|
| E2E-1 1.6 | `syn-ta-1` signed in with a correct code. | Pass |
| E2E-1 1.14 | The TA session ended after inactivity and asked for a new sign-in. Max estimated about 20 minutes; the configured TA idle limit is 30 minutes (`session.taIdleMs`). Note the clock time on the next timeout to confirm. | Pass (time to confirm) |
| E2E-1 1.1 | 5 public pages are reachable signed out on :4610. Content quality: UAT-05. | Pass |
| E2E-1 1.6 | Mini security check: a code issued to `syn-ta-1` was entered on the `syn-ta-3` code step. Refused with "The code is invalid or has expired. Request a new code." The message does not say whether the account exists. | Pass |
| E2E-1 1.6 | `syn-ta-3` signed in. | Pass |
| E2E-4 4.13 | Bulk import with a public Drive folder started after a retry within 5 minutes (UAT-08 workaround). Fetch ok, malware scan clean, then refused (UAT-12). | Fail (UAT-12) |

## Summary table (fill at the end)

| ID | Title | Role | Page | Severity | Class |
|---|---|---|---|---|---|
| UAT-01 | Back from code page gives "form already used" error | Signed out | /sign-in | P2 | C |
| UAT-02 | Code page has no "use a different address" option | Signed out | /sign-in | P2 | C |
| UAT-03 | Synthetic mailbox sign-in is slow for human testers | All | sign-in pages | P1 | D |
| UAT-04 | TA cannot start a single application outside a group | TA | /ta/groups | P2 | B |
| UAT-05 | Public pages need more useful content and a better layout | Signed out | / | P2 | C |
| UAT-06 | Bulk import form shows every field for every source type | TA | intake/new | P2 | C |
| UAT-07 | Services are chosen per import, not fixed at group creation | TA | groups/new, intake/new | P1 | B |
| UAT-08 | Bulk import refused: "The verification did not pass" | TA | intake/new | P1 | A |
| UAT-09 | Single applicant form refuses the passport number | TA | intake/new | P1 | D |
| UAT-10 | Bulk import progress does not refresh and has no progress bar | TA | /ta/intake/<attempt> | P2 | C |
| UAT-11 | No overview of a TA's imports across groups | TA | groups/<group>/intake | P2 | C |
| UAT-12 | Every Google Drive folder import fails | TA | /ta/intake/<attempt> | P0 | A |
| UAT-13 | Failed import says "See the reference code" but shows none | TA | /ta/intake/<attempt> | P1 | A |
| UAT-14 | Passport pages: exactly two pages, one file or two files | TA | intake/new, TA-09 | P1 | B+C |

Counts (12 October 2026, after Max's answers): P0 2 / P1 5 / P2 7. Class A 4 (UAT-08, 09, 12, 13) / B 3 (UAT-04, 07, 14) / C 6 / D 1 (UAT-03, now P2). Total 14. UAT-09 reclassified A, P0 (Max confirmed the 2-letter, 6-digit format from a production passport). UAT-14 added from Max's answers of 12 October 2026 (recorded the same day).
