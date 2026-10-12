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
| Browser | |
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

## Summary table (fill at the end)

| ID | Title | Role | Page | Severity | Class |
|---|---|---|---|---|---|
| UAT-01 | | | | | |

Counts: P0 __ / P1 __ / P2 __. Class A __ / B __ / C __ / D __.
