# ITEM-02 walk-through for Max: an unlinked related application now blocks the operator

Commit ids in this record are those before the reword of 13 Oct 2026; the map old → new is in `PLAN.md` §7.

What changed: when a service declares that it needs another application (the synthetic "SYN Transit e-visa (needs
tourist e-visa)" declares `needs_tourist_evisa`), and the travel agent never links that application, the operator
can no longer confirm readiness or authorize the government submission. Before this change both were accepted. The
operator's work list names the operator as owner with the step "return to the travel agent".

Where: `lane-max` after the package deploy (edge `http://127.0.0.1:4620/sign-in`, staff
`http://127.0.0.1:4622/staff/sign-in`, through the SSH tunnel). Synthetic accounts only. Sign-in codes: run
`~/.local/share/travelmudra-uat/lane-max/signin-codes.mjs <email>` in your own terminal.

UI wording: the UI lane writes the final sentences later (proposal §14). Until then a page MAY show the reason code
`dependency_not_linked` or a generic refusal sentence instead of "This application needs its related application
linked first. Nothing was recorded." The code is what to look for.

## Steps

| # | Who | Do | Expect |
|---|---|---|---|
| 1 | `syn-ta-1` | Create a group with dates from tomorrow. Add one applicant to "SYN Tourist e-visa" and the same applicant to "SYN Transit e-visa (needs tourist e-visa)". Do not link them. Submit both. | Both submit. The transit pages show "Not linked" as a warning only; submission is allowed (unchanged). |
| 2 | `syn-superadmin-1` | Record payment for the transit application if the queue asks for it, then assign it to `syn-operator-1`. | Accepted (unchanged). |
| 3 | `syn-operator-1` | Open the transit application. Look at the work list and the case page. | The pending answer is: owner the assigned operator, reason `dependency_not_linked`, next step "return to the travel agent". Before this change it said readiness was missing. |
| 4 | `syn-operator-1` | Start work, then look for the readiness form. | The page offers no readiness form: Core refuses readiness, and the page hides an action Core refuses. A form posted from a page opened earlier is refused with HTTP 409 and the generic sentence "A requirement of this item is not met." (no server error; the specific sentence is the UI lane's). Core's refusal names `dependency_not_linked` with `ref` `needs_tourist_evisa` (test S1). Nothing is recorded: no readiness row, no `ops.readiness_recorded` fact. |
| 5 | `syn-operator-1` | Return the application to the travel agent with a note ("Please link the tourist e-visa"). | Accepted. Fact `core.formal_return`. The pending answer moves to the travel agent, `hold_returned_to_ta`. |
| 6 | `syn-ta-1` | Open the transit application, link the tourist e-visa application of the same applicant, and hand the application back. | Accepted. Facts `core.dependency_linked` and `core.handed_back`. |
| 7 | `syn-operator-1` | Open the transit application again. | The answer is now the dependency wait: `dependency_outcome_unmet`, `await_dependency` (rule 20, unchanged). Readiness is still not offered, now because of `dependency_outcome_unmet`: the tourist e-visa is not issued yet. |
| 8 (optional) | operator and SuperAdmin | Take the tourist e-visa application to an issued outcome with its e-visa grant file. Then confirm readiness on the transit application and authorize its government submission. | Both accepted once the upstream is issued with its artifact (unchanged behaviour of a linked relation). |

## What does not change

- The fee payment act of the transit service is not refused by this blocker; the relation conditions only the
  government submission.
- No exception clears the blocker: a readiness-gate or Gate 2 exception still passes its own gate, and the
  authorization is still refused while the relation is unlinked; the exception stays unused.
- A relation that conditions the packet release (preparation-only services) blocks readiness and the release in the
  same way (your approval of Q1, 13 October 2026). No synthetic service declares such a relation, so this walk-through
  cannot show it on `lane-max`; test I13 shows it with a test-only declaration.

## Facts to look for (staff audit or the case history)

| Step | Present | Absent |
|---|---|---|
| 4 | none | `ops.readiness_recorded`, `core.external_act_authorized` |
| 5 | `core.formal_return` | |
| 6 | `core.dependency_linked`, `core.handed_back` | |
| 8 | `ops.readiness_recorded`, `core.external_act_authorized` | |
