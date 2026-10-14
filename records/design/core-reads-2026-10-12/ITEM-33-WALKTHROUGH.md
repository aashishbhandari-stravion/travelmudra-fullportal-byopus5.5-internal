# ITEM-33 walk-through for Max: an applicant whose passport carries one name

## What changed

A real passport can carry a surname only, or given names only. Before this change Core refused such an applicant: both
names were required. Now Core keeps the applicant when at least one name and the date of birth are present. The missing
name is stored as empty. A spreadsheet row with neither name, or with no date of birth, is refused with the new code
`applicant_identity_missing` instead of a format code. The operator's case read carries a hint, `oneNameApplicant`, so
that a person checks that the passport really carries one name and that no reading went wrong.

## What you can try on `lane-max` after the package deploy

The browser forms still mark both name fields as required (review finding R-01, a UI-lane file). Until the UI lane
changes them, the one-name case is shown through the spreadsheet upload, which has no such field rule.

1. Sign in as `syn-ta-1@synthetic.test` at `http://127.0.0.1:4620/sign-in` (through the SSH tunnel).
2. In a group, upload a spreadsheet with the template the page offers, with three rows (synthetic values):
   - row A: surname empty, given names `ASHA`, a date of birth, a passport number;
   - row B: surname `SYNONLY`, given names empty, a date of birth, another passport number;
   - row C: both names empty, a date of birth, a third passport number, and no passport document.
3. Expected: rows A and B create drafts. Row C is refused. Its service line shows "See the reference code" with
   `applicant_identity_missing` until the UI text lands (the sentence is in the package message for the orchestrator).
4. Open a draft of row A or B as SuperAdmin or the assigned operator at `http://127.0.0.1:4622/staff/sign-in`. The
   applicant name shows the one name. On the staff pages that join names themselves, a stray comma can still appear
   (review finding R-04, parked to the UI lane). The `oneNameApplicant` hint is in the case read; the staff page does not
   show it yet (UI-lane item).

## Where the evidence is

Tests: `ITEM-33.md` §4. `npm run check` on `b26d2a5`: 2562 of 2562 pass.
