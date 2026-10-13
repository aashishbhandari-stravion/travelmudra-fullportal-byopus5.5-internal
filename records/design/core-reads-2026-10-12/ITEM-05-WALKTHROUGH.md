# ITEM-05 walk-through for Max: the disclosure correction rule on `lane-max`

What changed (built now): a wrong-recipient disclosure incident counts its correction as done only when a replacement
result file exists that the travel agent can actually receive. A recorded reference (for example "the agent confirmed
deletion") no longer counts. What waits for you (Q-1 to Q-3): the "no replacement owed" decision. Until it is built, a
disclosure incident that names no file cannot be resolved (part C below).

## Before you start

- The orchestrator deploys the branch commit to `lane-max` with `uat.py deploy` (data and accounts stay).
- Tunnel: `ssh -N -L 4620:127.0.0.1:4620 -L 4622:127.0.0.1:4622 max-stravion@100.95.27.21`.
  Edge `http://127.0.0.1:4620/sign-in` (travel agent), staff `http://127.0.0.1:4622/staff/sign-in`.
- Accounts: `syn-ta-1@synthetic.test`, `syn-operator-1@synthetic.test`, `syn-superadmin-1@synthetic.test`.
- You need one case of `syn-ta-1`, assigned to `syn-operator-1`, with an official result recorded and its result file
  verified (the agent's delivery page offers the file). Note its application id (`app_…`).
- You need a second result PDF for the same applicant. A PDF that states the applicant's surname, given names and
  passport number is verified without a person; one that does not goes to review.

## A. A reference no longer meets the correction (the defect)

| # | Who, where | Do | Expect (the facts to look for) |
|---|---|---|---|
| A1 | Operator, `/ops/applications/<app>` | Report a wrong-recipient disclosure of the result file: a note and an external reference such as `SYN-SENT-MAIL-1`. | The incident page opens. The file is blocked: the agent's delivery page no longer offers it. |
| A2 | Operator, `/ops/incidents/<inc>` | Record evidence: external reference `SYN-TA-CONFIRMED-DELETION`. | The correction row stays not done. The resolve action is not offered as possible (blocked: evidence insufficient). Before this change the row turned done here. |
| A3 | Operator, same page | Post the notice to the owning travel agent (information variant). | Only the correction row remains open. A resolve attempt is refused and names the correction. |

## B. A replacement the agent can receive meets it

| # | Who, where | Do | Expect |
|---|---|---|---|
| B1 | Operator, `/ops/applications/<app>` | "Record a replacement result file": choose the blocked file in "Replaces" (it carries the incident), upload a PDF that does not match the applicant. | The new file is under review. The disclosure's correction row stays not done. |
| B2 | Operator, the association incident of the new file | Confirm the association for this case (all three fields checked). | The disclosure incident's correction row is now done. |
| B3 | Operator, `/ops/incidents/<inc>` | Resolve, then close. | Both accepted. |
| B4 | Agent, `http://127.0.0.1:4620`, the case's delivery page | Look at the files. | The replacement is offered; the reported file is not. |

Variant B1': upload a matching PDF instead. It is verified without a person, and the correction row is done at once.

## C. A disclosure without a file (waits for the decision, Q-1 to Q-3)

Do this only on a throwaway case. The incident blocks every file release of that case while it is open, and with this
build alone it cannot be resolved.

| # | Who, where | Do | Expect |
|---|---|---|---|
| C1 | SuperAdmin, `/admin/incidents` | Open a wrong-recipient disclosure incident on the throwaway case, with an external reference. | Required: the correction and the owning agent's notice. |
| C2 | SuperAdmin, `/admin/incidents/<inc>` | Record a reference, post the notice, try to resolve. | Refused: the correction stays missing. This is the interim state. The "no replacement owed" decision (not built) is the route that will close it. |

## Not in this walk-through

- After completion (the SuperAdmin replaces the file under the incident; a named reviewer confirms): proven by an
  automated test. The staff pages have no incident-scoped replacement form for a completed case yet (UI lane).
- The page words still say "or evidence that none is owed" in the correction row and its next-step text. They become
  wrong with this change; the UI lane owns them.
- The release census and release rule are in `docs/operations.md`, section 2, "Release record: the disclosure
  correction rule". They are run at a release cutover, not on `lane-max`.
