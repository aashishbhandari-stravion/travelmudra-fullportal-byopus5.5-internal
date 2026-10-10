# Owner decisions and architect rules of 10 October 2026

Status: owner decisions recorded by the architect from the chat of 10 October 2026. Decision owner: Max.
Items marked "proposal" are the architect's and wait for Max's acceptance.

## 1. The 5 October owner and provider decisions apply to the Opus product

Max decided on 10 October 2026 that the owner decisions of 5 October 2026 (`sources/owner-decisions-2026-10-05.txt`,
OD) and the provider decisions of the same date (`sources/provider-decisions-2026-10-05.md`, PD) apply to the
Opus product. He asked the architect to confirm that the decisions are agnostic of either implementation.

### 1.1 Architect's check: which decisions are implementation-agnostic

| OD / PD section | Content | Verdict | Note |
|---|---|---|---|
| OD §2 Delivery initiation | Assigned operator starts a send with Send result; Core rechecks authorization, eligibility, recipient, version, availability; unassigned work waits in a queue; a privileged person may assign or take bounded ownership | Agnostic. Product policy only | "Operations Lead" is a phrase, not a role. UX §3.1 step 8 and §10.1 already map it: no fourth account role; SuperAdmin is the fallback authority |
| OD §3 Completion initiation | Operator requests completion; Core owns the invariant; no force-complete; no auto-complete; blockers reported | Agnostic | Consistent with BS B24. Silent on an unassigned case; see §2 OC-02 |
| OD §4 Uncertain email | Not success; no automatic resend; proven failure allows a deliberate resend; continuing ambiguity needs privileged authorization with reason and actor recorded; every resend rechecks | Agnostic | Consistent with BS B31. Privileged authorizer maps to SuperAdmin |
| OD §5 Login email and CAPTCHA | Real provider path, mailbox receipt proven, server-side CAPTCHA, fail closed | Agnostic engineering requirement | States outcomes, not components |
| OD §6 First country and service | One real country and one service variant first; catalogue presence is not launch; lifecycle DEFINED → VALIDATED → OPERATIONALLY_READY → APPROVED_FOR_LAUNCH → ACTIVE "where practical"; activation explicit | Agnostic | Consistent with BS B07, B32. The state machine is a Core matter; see §4 |
| PD owner decisions | Sender identities `login@` and `saarthi@`, Google Workspace with a generic transport boundary, Lightsail with static egress, Turnstile with server-side verification, Lane D held | Agnostic provider and deployment policy | No UI effect except that no sender address appears in the UI |
| OD §1 Scanner Route 1 and Route 2 | A temporary synthetic-test profile, then a dedicated processing trust boundary | Astra-project engineering plan | Not transferred. No conflict: Opus already runs document processing in its own instance. The production requirement (a separate trust boundary) stands on its own in BS |
| OD §7 Parallel lanes A to D, OD §8 Review strategy | Execution plan for the Astra build | Astra-project execution decisions | Not transferred. Not product policy |
| PD engineering implications 1 to 6 | Static IP, relay allowlist, TLS, propagation wait, two identities, private access | Runbook items for any production deployment | Agnostic. They become the production runbook of whichever product ships |

Conclusion: OD §§2 to 6 and the PD owner decisions name no page, route, table, component or Astra module. They
state product, provider and deployment policy and are agnostic of either implementation. OD §1, §7 and §8 are
execution decisions of the Astra project and do not transfer; nothing in them conflicts with Opus.

Verified: the architect read both files in full on 10 October 2026. The reading of "Operations Lead" as no
fourth role is the UX specification's, at §3.1 step 8 and §10.1.

### 1.2 Effect on BUILD_SPEC B46

B46 marks the send trigger, the completion trigger and uncertain-email handling as unselected. OD §§2 to 4 select
them. With Max's decision of 10 October, B46 is closed for the Opus product by owner decision. The BUILD_SPEC
text itself lives in the architecture repository and is not amended here. Proposal: Max records the B46
selection in the architecture repository when he next edits it, with a pointer to this file.

### 1.3 Effect on the open owner choices of UI-PLAN §13.1

| OC | Disposition | Residual |
|---|---|---|
| OC-01 Send trigger | Decided: explicit Send result by the assigned operator (OD §2) | None |
| OC-02 Completion trigger | Decided: explicit Request completion by the assigned operator; Core owns the invariant (OD §3) | Unassigned case: OD §3 is silent. Interim accepted recommendation: assign an operator first (SA-03). No SuperAdmin completion request |
| OC-03 Uncertain email | Decided (OD §4). Privileged authorizer is SuperAdmin | None |
| OC-04 Fallback delivery ownership | Decided: SuperAdmin may assign or take bounded delivery ownership (OD §2) | Bounded ownership confers delivery only, per UX §10.1 |
| OC-05 No SuperAdmin completion or force-complete | Decided (OD §3) | None |
| OC-06 Identities and providers | Decided (PD, OD §5) | No UI effect |
| OC-07 Readiness stage labels | Decided: the five OD §6 labels | Whether Core carries the state machine is an inventory question (§4) |
| OC-08 First country and owner | Still an input from Max | Fixtures stay synthetic |
| OC-09 Preparation-only packet release under B46 | Closed by Max on 10 October 2026 (§1.5). The code serves `core.release_packet` as a command of the assigned operator; download is a recorded byte release. No owner choice remains | The `B46 BOUNDARY` marker on Release packet (CMD-40) and on download (CMD-18) is wrong and is corrected in the rewrite pass |
| OC-10 TA onboarding route | Open. Max decides with BS B08, B11, B44 in front of him | Plan keeps SuperAdmin-created accounts |
| RF-07 SuperAdmin `external_outcome_unresolved` | Closed by Max on 10 October 2026 (§1.5). The code serves `core.authorize_unresolved_completion`; it records an authorization that names a future owner and does not complete the case. The plan's reading stands | The reviewer's B46 concern does not apply. The disagreement stays recorded in REVIEW-FINDINGS as history |

The markers `B46 BOUNDARY` and `OWNER CHOICE PENDING (Astra-only source)` in UI-PLAN.md and
BULK-UPLOAD-UI-PLAN.md are now resolved as above except for OC-10. The plan text is not rewritten; this file
governs where it differs.

### 1.4 Applicability note of 7 October (architecture README)

The note says the OD and PD are "Astra only" and must not be applied to Opus by inference. Max's decision
replaces inference. Proposal for the architecture repository README, applied by Max or by a chat in that
repository: "On 10 October 2026 the decision owner confirmed that OD §§2 to 6 and the PD owner decisions are
implementation-agnostic product policy and apply to the Opus product. OD §1, §7 and §8 remain Astra execution
decisions." This repository does not edit that file.

### 1.5 Closure of OC-09 and RF-07 (added 10 October 2026, later the same day)

Max confirmed the closure of OC-09 and RF-07 on 10 October 2026 on the evidence of
`SURFACE-INVENTORY-2026-10-10.md` §6 (product commit 102e4c9):

- OC-09. `core.release_packet` is a served Core command of the assigned operator (`src/core-api/bindings/core.ts`,
  line 492 at 102e4c9). The packet download is a recorded byte release. Preparation-only release is therefore
  not an unselected B46 trigger; it is implemented product behavior. The plan's conservative treatment ends.
  The rewrite shows Release packet and Record packet handover as available actions under their existing
  preconditions.
- RF-07. `core.authorize_unresolved_completion` is a served Core command (`src/contracts/core.ts`, line 134
  at 102e4c9). It records the SuperAdmin's authorization of an `external_outcome_unresolved` completion
  and names the future owner. It does not complete the case. The plan's reading (authorization only; the
  completion itself follows the Core invariant of OD §3) stands. REVIEW-FINDINGS RF-07 keeps its text as the
  record of the disagreement; no P1 remains open.

Of the plan's open owner choices, OC-08 (an input) and OC-10 remain with Max.

## 2. Scope of work

- No refactoring and no code implementation is authorized. Work is strategy, research and review only.
- The Goku independent review of the plan is withdrawn (Max, 10 October). `GOKU-REVIEW-PROMPT.md` stays in
  the folder as a record and MUST NOT be launched.
- Authorized on 10 October: the surface inventory (§4). It reads product code. It changes no product file.
- The implementation plan for the UI rewrite waits for Max's manual UAT findings (template:
  `internal/records/uat/2026-10-10-max-uat-findings-TEMPLATE.md`).
- Authorization of the build is parked.

## 3. Kernel and Core rules for the UI rewrite

Decided by Max on 10 October 2026, with the architect's refinement accepted.

- The kernel is off limits for the UI rewrite. No UI need justifies a kernel change.
- A Core change is one of two kinds. Each kind has its own gate.

### 3.1 Kind 1: a new projection of facts Core already holds (allowed under a criterion)

A new read model is acceptable when all of the following hold. Reviewers check each point; a projection
that fails one is a P1 finding. (Architect's proposal of the criterion; the rule that a criterion exists and is
reviewer-enforced is Max's decision.)

1. Every field derives from facts Core already records. The projection creates no new fact and infers none.
2. It removes at least one of: a client-side join of two reads, a client-side computation of a status or a
   permission (UI-PLAN D4, D5), or a sequence of round trips on a P0 page. The reason is stated.
3. It carries an as-of time and the same scope guard as its source reads. It grants no permission.
4. It is named by its subject, not by a page, and is reusable by a bulk or composite operation.
5. A code comment above the implementation states: intent (latency, consistency or de-duplication), source
   facts, consumers, and the date.
6. It is listed in a read-model register (one line per projection: name, source facts, consumers, date) so
   that reviewers see the count. Proposal: when a release adds more than three projections, the release
   carries a one-paragraph consolidation note that says why none of the existing projections could serve.

### 3.2 Kind 2: a new command or new behavior (one-way door)

Core commands dictate lifecycle, notifications and document handling. The UI has no vote. Each proposal goes
through the following gate before any code exists.

1. A written proposal: the fact or state the command creates; the BUILD_SPEC rule that permits it; the K rule
   for its idempotency; what the Nth retry does; what a failure leaves behind; the effect on lifecycle,
   notifications and document handling.
2. The justification is system efficiency or product policy. "The UI is easier this way" is not a
   justification and is recorded as a rejection reason.
3. An independent review by a different model family, ranked P0/P1/P2, before Max reads the proposal.
4. Max decides with the proposal and the review in front of him. The decision is recorded in
   `design/02-owner-decision-register.md`. The default answer is no.
5. The change is built in its own lane with its own owner, never inside a UI lane.

## 4. The surface inventory (authorized)

Purpose: tell Max which demands of the plan the product's API already serves, which need a Kind 1 projection,
and which would need a Kind 2 command, so that he judges each Core item on system merit before any plan is
written.

Method: list every read model (UI-PLAN §6, BULK-UPLOAD-UI-PLAN §3) and every command (UI-PLAN §7,
BULK-UPLOAD-UI-PLAN §2) against the Core, edge and staff routes read from the code. For each row: Exists /
Partial / Missing, and the bucket: View only / Kind 1 projection / Kind 2 command / Kernel or owner policy.

Prior evidence: the independent review of 8 October 2026 scored UI alignment with the UX specification at
64.3% (main) and 50.0% (bulk) at product commit 7be21b1. That review scored page behavior. The inventory
scores the API surface under the pages and does not repeat the page score.

Output: `SURFACE-INVENTORY-2026-10-10.md` in this folder.

## 5. Max's manual UAT

Max tests every page on the preview on 10 October 2026 and reports in one document. Findings are not worked
as immediate fixes; the UI is rewritten from a complete plan. Triage rule: class A (backend, data,
deployment) is fixed now in its own task chat; class B (policy surprise) becomes an owner decision; class C
(view) goes into the acceptance list of the rewrite; class D (question) is classified by the architect.
Severity follows PRI-20260930-01.
