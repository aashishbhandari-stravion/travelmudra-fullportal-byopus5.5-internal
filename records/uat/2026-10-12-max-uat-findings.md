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

## Summary table (fill at the end)

| ID | Title | Role | Page | Severity | Class |
|---|---|---|---|---|---|
| UAT-01 | Back from code page gives "form already used" error | Signed out | /sign-in | P2 | C |
| UAT-02 | Code page has no "use a different address" option | Signed out | /sign-in | P2 | C |
| UAT-03 | Synthetic mailbox sign-in is slow for human testers | All | sign-in pages | P1 | D |

Counts: P0 __ / P1 __ / P2 __. Class A __ / B __ / C __ / D __.
