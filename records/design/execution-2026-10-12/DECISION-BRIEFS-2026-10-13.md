# Decision briefs for Max, 13 October 2026

Written by the orchestrator from the proposals on disk (UI lane `output/proposals/`, read only) and the seam log
(`SEAM-CONTRACT.md` §5). One brief per decision, in priority order. Each brief states what the decision is, what
exists today, what the options cost, and the orchestrator's recommendation. A "yes" to a brief is recorded in the
owner decision register (`design/02-owner-decision-register.md` §A.3) before any lane acts on it.

## 1. Confirm the Core batch and choose its installation

The Core task (`CORE-TASK-PROMPT.md`) is a third lane. Its lane clone `core-reads-2026-10-12` exists and is not
launched. The batch holds every Core change the UI lane could not build itself: eight defects (sign-in replay
normalization, launch on an unreviewed head, past dates accepted on a travel-date edit, a payment correction refused
when only its time changes, incident rows showing the stored owner, capped incident lists, a declined transition with no
owner, the support-view session gap), nine Kind 1 read models (batch assignment results, command identity on
operations, reassignment preview, Gate 1 context, the recorded gate basis, mark flags, the originals register, offering
impact items, the SuperAdmin delivery email), two wiring repairs, and the six Kind 2 changes you decided on 13 October
(dependency blocker, possibly-filed guard, correction notice, custody guard slice, price fixed by payment, disclosure
correction evidence) plus the P-11 evidence list.

Nothing in it is being worked until you confirm. Two items are additions you have not yet accepted: P-13 (8) stored
identifiers on delivery selection and P-13 (9) email attempts newest first. Recommendation: confirm the batch with both
additions, and repoint `lane-max` (ports 4620 and 4622) to the Core lane instead of a fourth installation. The
installation keeps its data; only the code changes. A fourth installation costs about 1.4 GB and a new port set.

## 2. Hand test WP-01 and WP-20 on lane-ui, then integration

WP-01 is the shell: navigation, command pattern, refusal rendering, session and sign-in states. WP-20 is the public
entry: the public pages with the search-ready requirements (titles, descriptions, canonical URLs, sitemap, structured
data) and the crawl evidence. Both are accepted by the lane with a Codex review and run on `lane-ui` at 0e38a04, which
also carries WP-02, WP-03, WP-06 and WP-07 parts. The integration range is the lane branch through 42cb373 (WP-01 and
WP-20 only, earlier than the WP-02 and WP-03 commits).

After your go, the orchestrator runs the boundary check and a dry-run merge on main, then the merge, and in the same
window merges the bulk range through 3854c88 (seam v2 passport parts). The UI lane then merges main and can build
TA-09 and the upload page, which are blocked today (S-16). Nothing is pushed; you push.

What to test by hand: sign in as each role on 4650 and 4652, the three added sign-in states (UAT-01, UAT-02,
UAT-08), navigation on a phone-width window, one refused form and its message, the public pages and their titles.
Recommendation: test for about 30 minutes, then give the go. A finding goes to the UI lane as a UAT item, not a
blocker, unless it breaks sign-in.

## 3. Possibly-filed guard: Part 2 placement and two money questions

Today a `possibly_filed` protection mark (set after a restore that may have lost a filing record) resolves on any
reference, so a second government filing can follow. OD-X5 chose direction A: the mark resolves only after the lost
facts are recorded again with evidence. The reviewed proposal (SHA 4c64c3c2…, two P0 found and fixed in review) splits
the work. Part 1 (about 4 to 5 days): the filing determination at resolution and the handling of legacy resolutions.
Part 2 (about 5 to 6 days): a record of each restore's filing uncertainty, with a reconstructed authorization row in a
`filing_unknown` state and an evidenced re-entry fact.

Q-A1: build both now (the lane's view: Part 1 alone leaves filed, unknown and orphaned-authorization cases held
indefinitely) or Part 1 now and Part 2 right after the run (the orchestrator's view: Part 1 closes the irreversible
harm; the held cases are visible and no production restore exists yet). Q-A2: money facts of a reconstructed
fee-bearing act stay outside Payment Records in the synthetic build, and a money re-entry item is required before any
real-data reopening. Q-A3: the same determination later for `possibly_paid`. Recommendation: Part 1 now, Part 2 after
the run; yes to Q-A2 both halves; yes to Q-A3 as a later item.

## 4. Custody corrections: the guard slice now and six design points

OD-X7 accepted the custody change as P0 before production and left placement to size. The reviewed proposal (SHA
5621f76f…) is large: 13.75 to 15.5 days for the full change. Q10 asks to build the guard-only slice now (about 1.75
days: a passport-identity guard that refuses sharing an original across applications of different applicants) and the
corrections right after the run. The slice closes the entry path of the most likely error.

The six design points: Q1 a void of a record whose part is in custody needs one named basis (carrier shows no delivery,
travel agent confirms not sent, or a verified duplicate); a real item on the wrong application moves, carrying its
links; a later receipt of a voided item opens a review incident. Q3 read "record each original once" as one open record
per item and group, closed records kept as history. Q4 no notices on a correction. Q5 a second, distinct SuperAdmin
approves a void of a record with a part in custody, about 2.75 extra days, no reusable mechanism. Q7 a removed part is
recorded only while the record and every linked application are open under one operator; otherwise a release and a new
receipt. Q8 the service-type boundary follows the held item, not the current declaration.

Recommendation: yes to all seven. Q5 is the one real cost; it protects the only decision that clears a completion hold.

## 5. Dependency enforcement: extend to the packet release, confirm a boundary

OD-X4 chose direction A: a Core blocker `dependency_not_linked` on readiness and authorization while a declared
relation (for example a transit e-visa that needs an issued tourist visa) has no live link to its upstream. Today the
dependency is declared but nothing stops the dependent from being filed. The reviewed proposal (SHA 63f539a5…) is
placed in the Core task; the wire pattern repair (Q2) is decided.

Q1: extend the same blocker to `release_packet` when the declaration conditions the release on the relation. The
register names readiness and authorization only, so the Core task MUST NOT build this part without your yes. The
lane's case: BS B22 lets a declared relation condition any declared action, Core already enforces linked relations on
the release, and a release happens once. Cost: one more control point and the invariant I13 (a release is refused
while the link is missing). Q3: confirm that the parked boundary B44 stays: a dependent whose upstream result exists
only outside TravelMudra cannot proceed, because an evidence-only upstream is not declarable.

Recommendation: approve Q1 and confirm Q3 as parked, with a note to revisit B44 before the first real dependent
offering launches.

## 6. Price fixed by payment: release disposition, scope authority, bulk baseline

OD-X9 fixed the policy: a recorded payment fixes the price; increases on paid applications are refused; new
applications take the current price. The reviewed proposal (SHA 50a0fcf1…, 5.5 days) is placed. Three questions.

Q1, release disposition. Open increases on already-paid applications in existing data must be ended once. The lane
recommends RD-1: `tm cutover verify` runs a reconciliation command on every release and restore. The orchestrator
recommends the safe smallest form: count such records on the old release before cutover (as you did today for the
passport counts), keep the verification count as a backstop that fails loudly, and make the automatic reconciliation a
production-readiness item. Reason: every installation is synthetic, and a failing step inside a cutover with admission
closed is the wrong first failure mode.

Q2, scope authority after payment. SC-1 (lane and orchestrator): the payment ends the price part of an open material
scope change, but the renewed-authority stop stays until the TA renews authority. SC-2 lifts the stop, which conflicts
with B17. Q3: keep B16, a bulk attempt quotes its captured baseline price, no intake repricing.

Recommendation: Q1 safe smallest form, Q2 SC-1, Q3 keep B16.

## 7. Outcome-correction notice: three residuals

OD-X6 accepted a notice to the travel agent when a SuperAdmin corrects an outcome (for example Issued to Refused). The
reviewed proposal (SHA 93e7186f…, 3.25 to 4.25 days) adds point N (one notice per correction act) and point H (one
history line on the application). Three residuals need your acceptance.

Q-N2: one correction act can give the TA 1 + P notices, where P is the number of dependents whose open price increase
the act ends; those P notices exist today for every outcome. The bound depends on the size of the act, not a fixed cap;
aggregation waits for NOTE-01 (your notice classification note). Q-N3: keep the history line. It needs your exception
to Kind 1 criterion point 2 (it adds a fact), and it changes the schema head, so rollback of that release is by
migration, not by code alone; the alternative ships N first and H later. Q-N4: K separate evidenced decisions on K
applications produce K notices; a bulk correction has no command and no caller may emulate it by looping; it waits for
its own proposal.

Recommendation: accept Q-N2, keep the history line in the same release (Q-N3), accept Q-N4. Together with brief 3 this
closes the P-17 set.
