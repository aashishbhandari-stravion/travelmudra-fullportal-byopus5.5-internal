# WP-07 U5 notes: SA-09 Gate 2 kind and the four readiness exception kinds

Unit U5 of WP-07. Author: the U5 engineer, 13 October 2026. Input for the architect's integration, unit U7 (wiring) and
the gallery registration. U5 commits nothing; the architect integrates. Base: lane commit bc9a353 with the uncommitted
WP-06 U4 files (`decisions/kinds.ts`, `application.ts`, `routes.ts`) and the uncommitted WP-07 U0 file `work/reading.ts`.
Binding inputs: `WP-07-design.md` §2.0, §2.9.1 to §2.9.3, §2.11 to §2.13, §3.1, §3.2, §3.4, §4, §7.1 (U5 row, as changed by
`WP-07.md` §6 "U5 and U6 file plan"); `WP-07.md` §3 (Q-W07-04) and §4 (F-05, F-06, F-20, F-33 apply here);
`WP-07-acceptance.md` A98 to A109, A156 to A158, A167 to A170, A172, V09-11, V10-6a; `WP-06-U4-notes.md` §2 (the
"how later packages add kinds" pattern); `PLAN.md` LD-14, LD-17.

## 1. Files

| File | Change |
|---|---|
| `src/apps/staff/decisions/gates.ts` (new) | Kinds `gate2_commitment`, `readiness_submission`, `readiness_fee_payment`, `readiness_provider_handoff`, `readiness_packet_release` via `defineDecisionKind`; the list `gateDecisionKinds`; `gateDecisionLinks(case)` for the application's page. |
| `scripts/dev/gallery/decision-gates.ts` (new) | `decisionGatesGalleryPages()` (15 pages) and fixtures shared with the tests. Not registered. |
| `test/unit/web/decision-kinds-gates.test.ts` (new) | 24 tests. |
| `test/unit/bff-decisions-gates.test.ts` (new) | 5 tests (HTTP, scripted Core, the U4 routes with the Gate 1 kinds plus these kinds). |

No other file changed. No route is added: the U4 GET route `admin.decisions.application` serves the five kinds, and the U4
grant route `admin.applications.grant_exception` maps each posted (gate, action) pair to its kind
(`registry.forException`). `kinds.ts`, `routes.ts`, `application.ts`, `core/admin.ts`, `instance.ts` and
`gallery-pages.ts` are untouched.

## 2. API (`gates.ts`)

```ts
GATE2_COMMITMENT_KIND, READINESS_SUBMISSION_KIND, READINESS_FEE_PAYMENT_KIND, READINESS_PROVIDER_HANDOFF_KIND, READINESS_PACKET_RELEASE_KIND
interface GateDecisionModel { case: WireStaffCase; payments: OptionalView<pay.application_payments> | null; work: OptionalView<ops.case_work> }
gate2CommitmentKind, readinessSubmissionKind, readinessFeePaymentKind, readinessProviderHandoffKind, readinessPacketReleaseKind
gateDecisionKinds                     // the five, for the `kinds` list of adminDecisionRoutes
READINESS_SPECS                       // per kind: action, act words, the service mode that has the act, "allows" words
gateDecisionLinks(c): DecisionLink[]  // "Gate 2 decision" (open, TravelMudra-filed); "Readiness exception for the [act]" (open, validity previous_operator, act of the mode)
gate2Problems(error, case), readinessProblems(spec, error, case)   // the closed refusal tables
ACT_HARD_STOPS                        // the hard-stop sentence of the five kinds
```

Reused from U4 `application.ts`: `exceptionGrantForm` (hidden pair fixed by the kind, `_rev.application`, reason field
"Reason for the exception", maxlength 1000), `gateExceptionTable`, `latestPaymentEntry`, `grantProblems` (fallback rows),
`GRANTED`, `REVOKE_EXCEPTION_KIND`. From `core/admin-context.ts`: applicant, names, facts, crumbs, exception words. From
`work/reading.ts` (U0): `actName`, `actStateWords` (F-33 words: "Authorized; execution not yet evidenced"). From
`core/case.ts`: `MODE_LABELS`.

## 3. Kinds and states

| Kind | Reads | States (first match) | Form |
|---|---|---|---|
| `gate2_commitment` | `core.admin_case`; opt. `pay.application_payments`, `ops.case_work` | Not open (lifecycle) → Not filed by TravelMudra (mode ≠ `travelmudra_filed`, `unknown` included) → protection mark (unavailable, CMP-10) → Not needed (`servicePayment = payment_received`) → Commitment made (an act with state ≠ `not_filed_evidenced`; the latest one named) → Already open (granted Gate 2 row; link "Revoke" to SA-09r) → draft | hidden `gate`=`gate2_government_commitment`, `action`=`first_government_commitment`, `_rev.application`; `reason`; "Record Gate 2 exception"; Cancel → SA-07a (else the case page) |
| `readiness_submission`, `readiness_fee_payment` (TravelMudra-filed), `readiness_provider_handoff` (third-party), `readiness_packet_release` (preparation-only) | `core.admin_case`; opt. `ops.case_work` | Not open → protection mark → Not an act of this service ("This service has no [act]."; skipped for mode `unknown`) → Not needed (`valid`) → Not eligible (`missing`, `stale_basis`, `held`: "… Now: [not recorded / out of date / held by an open hold]. The assigned operator records readiness.") → Already open (this act's granted row; "Revoke") → draft | hidden `gate`=`readiness_gate`, `action`=the act, `_rev.application`; `reason`; "Record readiness exception"; Cancel → the case page |

Header: Gate 2 h1 "Gate 2 exception for the first government commitment: [applicant]", crumbs "Money & exposure › Finance ›
[applicant → SA-07a]", rail `/admin/finance`. Readiness h1 "Readiness exception for the [act]: [applicant]", crumbs
"Work queues › Assignment › [applicant]", rail `/admin/queues/assignment`. Scope: design lead sentence plus application,
service, group, travel agent, Kind, Operator. Evidence: Gate 2 — service payment, latest entry, payment-missing follow-ups
open (count with unit, "None", "Unavailable"), readiness and "Readiness recorded: By [name] at [time] IST", acts table
(act, state, authorized at), exception table with "A Gate 1 exception does not pass Gate 2."; readiness — readiness,
recorded by/at, operator now, open holds (kind, opened, by; no note), acts, exceptions. Effect and review: design §2.9.1
items 4 and 7; §2.9.2 with D-U5-06/07 below. Hard stops: `ACT_HARD_STOPS` (design §2.9.1 item 5) on all five.

Receipts (`granted`, neutral "Request recorded", design §2.11 interim): expectation = resource `application`, id = path
id, summary `gateExceptionId` is a `gex_` reference **that selects, in this page's own read, an exception with the kind's
gate and action** (D-U5-03). Recorded: exception reference, Gate, For, Expires (immutable row fields); Gate 2 adds
"Exposure ceiling: Not passed. This exception does not pass the exposure ceiling." (A100). Current: state of the
exception; Gate 2 "service payment"; readiness "readiness". No accepted time (P-10 b pending).

Refusals (closed tables): Gate 2 — `control_blocked/gate_not_blocking` "The service payment was recorded meanwhile: Gate 2
does not block. No exception was recorded."; `control_blocked/gate_exception_not_eligible` → the not-filed or the
commitment sentence from the current read; `conflict_duplicate/gate_exception_not_eligible` "A Gate 2 exception is
already open. No second one was recorded."; readiness — "Readiness is current now. No exception was recorded."; the
not-eligible sentence with the current validity; "A readiness exception for the [act] is already open. No second one was
recorded."; both fall back to U4 `grantProblems` (mark, not open, `validation_failed`), then to the frame (used form,
reason field, unknown code with reference). Stale (CMP-14, `_rev.application`): rows D-U5-05; reason kept in its field;
the form shown again names the revision just read and a new `_op`. The hidden pair always comes from the kind (tested
with a refused form that sent another pair).

## 4. Decisions taken in U5

| Id | Decision | Reason |
|---|---|---|
| D-U5-01 | Every kind reads `ops.case_work` as an optional read (design §2.9.1 names only `core.admin_case` and the payment record). | "Readiness (state, by, at)" and "recorded by [name] at [time]" exist only in the case work; `core.admin_case` carries the validity alone. Same read and policy (`application.read`) as the route; U4's first-work kind reads it already. |
| D-U5-02 | The recorder's name comes from `core.admin_case.names`; absent → "An account". A case-work row whose id differs from the case's current `readinessId`, or a failed read, reads "Unavailable". | No guess; Core's names list does not carry the readiness recorder (P2 below). |
| D-U5-03 | Own receipt builder; the summary test selects the returned exception from the page's read and requires the kind's gate and action. | U4's `exceptionGrantReceipt` accepts any `gex_` id and always adds "service payment". A readiness receipt must not name the payment (WP-06 D-08 class); an edited `done`/`op` with another kind's operation now gives the unchecked receipt. A revocation of the same exception still matches; the neutral title keeps that truthful. |
| D-U5-04 | Gate 2 does not use `pay.application_payments.gate2`. With `servicePayment` null the form shows; Core decides. | Q-03: that value likely always reads "unknown"; F-05: no gate state is read as money. |
| D-U5-05 | Stale rows: Gate 2 — Service payment, Operator, External acts, Readiness; readiness — Readiness, Operator, External acts. | Design §2.12 lists payment, acts, readiness for both. Operator added: both exception bases include the assignment. Service payment dropped from readiness: a readiness decision does not rest on the payment (D-08 class). |
| D-U5-06 | Readiness "allows" words: "request authorization of the [act]" for the three acts, "release the packet" for the packet release (design: "request the [act]"); review lines per act (design has none). | F-33 class: the operator requests an authorization, never "the act"; a packet is released, not authorized. |
| D-U5-07 | Readiness "It ends" adds "When you are no longer an active SuperAdmin."; readiness hard stops use the Gate 2 sentence; readiness evidence adds the exception table. | Core's freshness rule (grantor inactive) applies to every gate; the design gives no readiness hard-stop text; the table shows earlier readiness exceptions (history, revocation route). |
| D-U5-08 | Mode `unknown`: Gate 2 shows "Not filed by TravelMudra" ("of a kind this page cannot read"); readiness kinds skip "Not an act" and show the form. | Core refuses Gate 2 for any mode but TravelMudra-filed; Core does not check the mode for a readiness exception, so the page cannot tell and Core decides. |
| D-U5-09 | "Commitment made" names the latest act not evidenced as not filed, with a plain-text IST time. | Core's eligibility rule; the same sentence is the refusal of `gate_exception_not_eligible`, and the error summary takes plain text. |
| D-U5-10 | Closed-state titles "Not open", "Not filed by TravelMudra", "Not needed", "Commitment made", "Already open", "Not an act of this service", "Not eligible". | Same titles as the WP-06 kinds where the state is the same. |

## 5. Deviations from the design and the checklist

- D-U5-05, D-U5-06, D-U5-07 above (design wording or rows).
- The checklist words differ from the design in A99 (h1 "Gate 2 decision: [applicant]"; evidence "Gate 1 for assignment"
  as a separate fact, "Gate 2 now: [Core's state]", the travel agent's counted exposure and ceiling with a link to SA-07t),
  A101 ("Gate 2 is met: the service payment is received. No decision is needed."; "Gate 2 does not apply to this
  service."; "The first government commitment … has happened …"), A102 ("A Gate 2 decision for this application is open
  …"; stale sentence with "Revoke it, then record a new one"). The design governs (checklist header rule). The facts A99
  adds are not built: the design does not list them, and the exposure read is U6's.

## 6. What the wiring unit (U7) must do

| Item | Change |
|---|---|
| `instance.ts` | `adminDecisionRoutes({ kinds: [...GATE1_DECISION_KINDS, ...gateDecisionKinds], carriedGrant })`. No new route id, no inventory row (the U4 rows cover the five kinds). |
| `core/admin.ts` case page | Remove the generic "Grant a gate exception" disclosure (gate and action selects, `GATE_ACTIONS`), and point the assignment callout's "Grant a gate exception" button (`#gate-exceptions`) to SA-09 `gate1_assignment`. Add the links of `gateDecisionLinks(v)` ("Gate 2 decision", "Readiness exception for the [act]") to the "Gate exceptions" section, and per granted row a "Revoke" link to SA-09r (WP-06 U6 item). `carriedGrant` stays the case page's refusal answer: after wiring, every pair of Core's table has a kind, so only a hand-made pair outside the table reaches it. |
| SA-07a (`applicationPaymentsPage`) | "Decide Gate 2" link → `decisionHref({ applicationId, kind: 'gate2_commitment', subjectId: null })` (A98; U6/U7 per `WP-07.md` §6). |
| Gallery | Register `decisionGatesGalleryPages()` in `scripts/dev/gallery-pages.ts`. |
| Carried-form test | `carried-forms-wp07.test.ts`: the old case page holds no form with action `/admin/applications/<id>/gate-exceptions`; WP-06's carried-form entry for the generic grant form goes. |
| U4 tests | `decision-kinds.test.ts:82` message "Gate 2 keeps its generic form until its kind exists" and `bff-decisions.test.ts` "keeps the generic form's answer for a pair no kind records" use a Gate 2 pair with the Gate 1 kinds only; they stay green, but after wiring the realistic unmapped pair is one outside Core's table (for example `gate1_service_payment`/`first_government_commitment`). Optional. |
| System tests | No system test posts a Gate 2 or readiness pair today (only Gate 1 pairs, WP-06 U6 moves those). Optional new system check: GET SA-09 `gate2_commitment` from the case page link and grant. |

## 7. Open items

| Item | Rank | Scenario | Proposal |
|---|---|---|---|
| Checklist rows A99, A101, A102 worded differently from the design | P1 (Product Manager alignment, Max) | The acceptance run reads h1 "Gate 2 decision: …" and "Gate 2 is met: …" and records a fail, although the page follows the design. | Align the rows to the design words at the WP-07 acceptance alignment (as for U3's A39, A42, A44). |
| No freshness of an open Gate 2 or readiness exception on the SuperAdmin's read | P2 | A Gate 2 exception goes stale (payment entry or assignment changed); `core.admin_case` lists it as `granted`, so SA-09 shows "Already open … only while it is fresh" with "Revoke" but cannot name Core's stale reason (A102 stale part, T). The Gate 1 page has `assignOffer` for this; Gate 2 and readiness have no SuperAdmin evaluation. | Park, or a Core read of `exceptionFreshness` per granted row (Kind 1 extension). |
| Readiness recorder not named | P2 | After a reassignment the previous operator holds no hold or act, so `names` lacks them; the page reads "By An account at [time] IST". | Park, or add the readiness recorder to `staffCaseView`'s names list (Core, one id). |
| Gate 2 or readiness exception recorded before an assignment | P2 | A SuperAdmin records Gate 2 on an unassigned application; the next assignment makes it lapse (basis includes the assignment). The effect says so and the review says no operator is notified; the page offers the form. | Park (design has no such state; Core accepts the grant). |
| Readiness fee-payment exception while the submission's filing is unknown | P2 | A SuperAdmin records `readiness_fee_payment`; the operator pages hide the fee act while the submission is `filing_unknown` (Q-W07-07), so the exception expires unused. Nothing unsafe happens. | Park; or add a state on this kind when Max wants the decision page to say so. |
| Not needed / not eligible states hide "Revoke" of an open exception | P2 | Readiness became current after a readiness exception was granted; the page shows "Not needed" and no "Revoke" link; the exception row is in the evidence table and revocable from the case page. | Park, or add the revoke link to those states (design change). |
| Static tree test fails on another unit's file | — (not U5) | `test/static/tree.test.ts` reports `route_without_id`/`route_without_action` at `src/apps/staff/payments/finance-routes.ts:128, 136, 154, 180, 187, 201` (U6, in progress at the time of the run). | U6 / architect. |

No P0.

## 8. Checks run

- `npx tsc -p tsconfig.json --noEmit`: pass (whole tree at the time of the run).
- `npx eslint --max-warnings=0` on the four new files: pass.
- `node --test test/unit/web/decision-kinds-gates.test.ts test/unit/web/decision-kinds.test.ts test/unit/bff-decisions.test.ts
  test/unit/bff-decisions-gates.test.ts`: 65 tests, 65 pass (24 + 29 + 7 + 5).
- `node --test "test/static/**/*.test.ts"`: 74 tests, 73 pass; the one failure is in U6's `finance-routes.ts` (§7). No
  import cycle.
- `decisionGatesGalleryPages()` imported with node and rendered: 15 pages. Not opened in a browser; no axe pass (A172
  stays open); no CSS change, only existing components.
- Not run: system tests (nothing is wired).
