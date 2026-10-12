# Manual UAT findings — 12 October 2026 (pass 1)

Test plan: `2026-10-12-uat-pass1-test-plan.md` (use its step IDs, for example `E2E-4 4.8`, in the Plan ID
field). E2E-4 uses real passports: refer to people only as "User 01" to "User 11"; no names, numbers or
dates of birth here; crop or blur screenshots (plan A.6). Add one finding block per finding. Keep one finding per block. Do not fix anything from this file; the architect
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
Evidence:  screenshot from Max (chat, 12 October 2026); personal address not recorded
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
Evidence:  screenshot from Max (chat, 12 October 2026); not stored here because it shows a Drive link
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

## Observations without a finding

| Plan ID | Observation | Result |
|---|---|---|
| E2E-1 1.6 | `syn-ta-1` signed in with a correct code. | Pass |
| E2E-1 1.14 | The TA session ended after inactivity and asked for a new sign-in. Max estimated about 20 minutes; the configured TA idle limit is 30 minutes (`session.taIdleMs`). Note the clock time on the next timeout to confirm. | Pass (time to confirm) |
| E2E-1 1.1 | 5 public pages are reachable signed out on :4610. Content quality: UAT-05. | Pass |
| E2E-1 1.6 | Mini security check: a code issued to `syn-ta-1` was entered on the `syn-ta-3` code step. Refused with "The code is invalid or has expired. Request a new code." The message does not say whether the account exists. | Pass |
| E2E-1 1.6 | `syn-ta-3` signed in. | Pass |

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

Counts: P0 __ / P1 __ / P2 __. Class A __ / B __ / C __ / D __.
