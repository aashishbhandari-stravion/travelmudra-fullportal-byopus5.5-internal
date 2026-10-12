# WP-06 acceptance checklist: Gate 1 and assignment

| Field | Value |
|---|---|
| Lane | `ui-revamp-2026-10-12` |
| Work package | WP-06 Gate 1 and assignment (UI-PLAN §12.1; lane PLAN §3) |
| Author | Principal Product Manager (Claude subagent), 12 October 2026 |
| Decision owner | Principal Technical Architect of the lane (LD-12) |
| Status | Draft. Step 1 of lane PLAN §3. Not run. Input to the UX design review and the independent review. |
| Product base | lane branch `ui-revamp-2026-10-12` at 9efb379; internal records at 30d029c |
| Installation | `lane-ui`: staff http://127.0.0.1:4652 (SuperAdmin pages under test; operator pages as set-up and observation, LD-02); edge http://127.0.0.1:4650 (proof set-up through the travel-agent pages) |
| Writing style | ASD-STE100 at about 75% (STY-20261003-01) |

## Corrections of 12 October 2026

The UX design (`WP-06-design.md`), the architect's decisions (`WP-06.md` §3) and the independent design review (lane
`research/reviews/WP-06-design-review.md`, R-01 to R-13, with amendments D-01 to D-13 in `WP-06.md` §4.1, which bind)
changed the rows below. No other row changed. Section 6 is kept as asked; `WP-06.md` §3 answers it. Where an
unchanged row names the earlier recipe (P1 to P6, §3 Parts A to J), §0.4 maps it to the design's recipe.

| Row | Finding or decision | Change |
|---|---|---|
| A02 | R-11; design §2.1 | Design's 16 groups in fixed order; "Nothing waiting now" section; `h1` "Decisions waiting". |
| A03 | R-11; design §2.1 | Groups 1 to 4 as the design partitions Core's lists; "in total" line; deltas of the new recipe (+3, +1). |
| A04 | R-11 | Primary action "Open [first group with work]"; link targets of the design. |
| A05, A06 | R-11; design §2.1 states | S2 copy of the design; every read unavailable renders the page with "Unavailable" groups, not S7. |
| A08 | R-13, D-13 (parked) | Caps 200 and 500; "in total"; partial partitions noted as a known limitation. |
| A13 | R-11; design §1.3, §2.2.1 | Work queues tabs; one Assignment page with two sections; `payment` filter; no separate "Submitted unassigned" view. |
| A18 | R-07, D-07; R-06, D-06 | "Approving help needs no payment" limited to unassigned requests; the D-06 gap notice shown. |
| A29 | R-11; design §2.2.1 | "Assign" on every waiting row plus the payment and exception links; "Reassign" for inactive-operator rows. |
| A31 | R-11; design §2.3 | Design anatomy; no reason field. |
| A37 | R-11; Q-W06-04; D-11 | Design preview anatomy and re-check text; per-row "Remove from the plan" stays (new GET preview). |
| A38 | R-01, D-01 | Counts-only receipt; per-application facts read afterwards as "Current"; partly met until P-10 a. |
| A40 | R-11; design §2.2.1 | Operator order = order ticked in the list; no reorder control; T unless a run holds two assignable applications. |
| A41 | R-12, D-12 | A missing plan application is the uniform not-found page, not a problem entry; `items_missing` added. |
| A52, A60 | R-04, D-04 | Duty lists labelled current and possibly incomplete; no "the duties above move" claim; partly met until P-10 d. |
| A64 | R-05, D-05 | SA-07a labels "Gate 1 for assignment"; no conclusion for first work or reassignment. |
| A65 | R-10, D-10; PM Q-11 | Evidence rows up to Core's limit; correction form built in WP-06. |
| A68 | R-10, D-10 | Six-row refusal moved to A150; refusal wording of the design. |
| A70 to A72 | R-12, D-12; PM Q-11 | Current-revision business checks; correction built in WP-06; new recipe (B). |
| A80 | R-03, D-03 | Design anatomy; the evidence reference part marked "Unmet — waits for a Kind 2 decision". |
| A81 | R-02, D-02 | Neutral receipt "Request recorded" with current facts. |
| A83 | R-05; PM Q-09 decision | "Already open" state; stale explanation and "revoke, then record" as two steps, on an unassigned application. |
| A89 | PM Q-05 decision; D-06 | Operator's route is the flag; `gate1_first_work` states of the design; approved help moved to A148. |
| A90 | R-12, D-12 | Gate 2 asserted independently with readiness and first work set up. |
| A95 | R-08, D-08 | Design anatomy; effect text by recorded gate (A151). |
| A103 | R-01, R-02; D-01, D-02 | Command named only when established; neutral receipt otherwise; governs every quoted receipt title. |
| A105 | R-12, D-12 | Business duplicate (fresh revision) separated from raw stale envelopes and from a refused envelope that Core may accept later. |
| A110 | Design §1.5; Q-W06-02; PM Q-11 | Carried forms of the design; WP-06 forms leave the old case page; correction no longer carried. |
| A114 | R-10, R-11 | No reorder or add-row controls; JavaScript-off selection. |
| §0.2 Personas, §0.4, §3 | R-11, D-11; Q-W06-10 | One recipe: the design's §6 (applications A to D, operators 1 to 3); extra steps for checklist rows use the same applications; mapping of the earlier names. |
| A147 (new, §2.2) | R-07, D-07 | In-place help approval on an assigned unpaid application refused for Gate 1 at the first work. |
| A148 (new, §2.6) | R-06, D-06 | The approved-help first-work gap shown on SA-09g and SA-02b; flag not possible. |
| A149 (new, §2.5) | R-09, D-09 | Date-only correction refused as Core answers. |
| A150 (new, §2.5) | R-10, D-10 | Evidence rows up to Core's limit; refusal above it. |
| A151 (new, §2.7) | R-08, D-08 | Revocation effect text per recorded gate. |

## Lessons applied from the WP-01 to WP-03 corrections

This is the first version. No row is corrected yet. The table says how this checklist applies what the reviews of
the earlier checklists found wrong.

| Lesson | Source | Where this checklist applies it |
|---|---|---|
| Identical replay, changed-content conflict, browser Back, rejected-form refresh, lost acknowledgement and a new key that meets the business check are separate cases | WP-01 A-02, A-03, A-06; WP-03 R-12 | §0.2 "Replay terms"; one "Nth time" item per command (A44, A45, A57, A74, A93, A100) and A105 |
| A refused command leaves no operation record; the refusal shows only on the re-rendered form | WP-01 A-08; WP-03 A130 | §0.2; A104; every refusal item says "nothing is recorded" |
| Receipts show no accepted time and name a result only when the operation returns the expected resource and summary | WP-01 A-04, P-02; WP-02 B-02; WP-03 C-03 | §0.2 "Receipts"; A103 |
| Freshness in the lag form for projections; "Read at" for authoritative reads | LD-08 | §0.2; A09, A14 |
| A page shows only facts a read model returns; a missing fact is "Unavailable" or the item is "partly met"; gaps are listed as deferred, not as failures | WP-02 B-06; WP-03 R-11, P-09 | §0.2 "Facts"; §5 "Deferred"; Q-02, Q-03, Q-06 to Q-08 |
| Proofs rerun with unique identifiers per run; checks compare with a recorded baseline (deltas), never totals | WP-02 B-13 | §0.4 run recipe; §3 Part A |
| Set-up writes through existing pages are allowed and are named as set-up; they are not the subject under test | WP-03 corrections (architect, 12 October 2026) | §3 Parts B and G ("Setup (existing … page)") |
| Optional reads never hide an access change | LD-14 (WP-03 R-02) | A07, A108 |
| Forms of later packages stay reachable on rebuilt pages | WP-03 Q-01, A106 | A110 |
| Copy states no configuration number that the page does not read | WP-01 Q-13 | A41, A87 (expiry from the read, never "24 hours") |

## 0. Inputs and conventions

### 0.1 Inputs

| Ref | Source | Identity | Sections used |
|---|---|---|---|
| UX | `TARGET_PRODUCT_UX_SPEC.md` (2026-10-05) | SHA-256 b45186887cdc37f6… | §2.2, §2.3, §3.1 steps 4 and 5, §3.2 (Approved assistance), §3.3, §6.1, §6.2, §6.3 (Assignment, Exception, Manual money record), §7.3 (SuperAdmin decision page, Mobile), §7.4, §8.3, §12 V06 V08 V15 |
| BS | `BUILD_SPEC.md` (r2) | SHA-256 4a6fd90657b0723f… | B10, B11, B18, B19, B20, B26, B27, B29, B33, B35 |
| PL | `../ui-plan-from-specs-2026-10-10/UI-PLAN.md` | SHA-256 75256bfd7e6d929a… | §A (AD-10, AD-13), §1, §2.1 to §2.3, §3.4 SA-01 SA-02 SA-03 SA-07 SA-09, §4.1 steps 5 to 7, §4.2 (Approved assistance A2, A3), §5.4, §6.4, §7 (K-STD, K-BATCH; SA rows), §8.1, §9, §10, §11, §12.1 WP-06 |
| CC | `COMMAND-COVERAGE.md` (this folder) | SHA-256 bb81dd73f9501114… | §3 (WP-06 rows: `core.assign`, `core.assign_selection`, `core.grant_gate_exception`, `core.revoke_gate_exception`, `pay.record_service_status`; and `core.reassign`, WP-12), §5.1, §6 (CC-04) |
| LP | `PLAN.md` (this folder) | SHA-256 33c0cb0ae964ada3…; internal 30d029c | §3, §4 (LD-02, LD-03, LD-07, LD-08, LD-11, LD-12, LD-14), §7 |
| W1 | `WP-01.md` §3, §4 | internal 30d029c | A-01, A-02, A-04, A-08, A-09, P-02; WP-01 design §2 (SuperAdmin rail: "Home" links to Monitors until SA-01 registers `/admin`) |
| W2 | `WP-02.md` §3, §4 | internal 30d029c | B-02, B-03, B-06, B-13; Q-W02-02 (WP-06 reuses CMP-25 for SA-09) |
| W3 | `WP-03.md` §3, §4 | internal 30d029c | C-02 = LD-14, C-03, C-07, Q-W03-08 (synthetic writes), PM Q-01 (carried forms) |
| RM | lane `research/route-map.md` | lane research | §2 rows D02 to D27, D100, D102; §3 queries `core.assignment_queue`, `core.assignment_plan`, `core.admin_queue`, `core.admin_case`, `pay.application_payments`, `views.monitors` |
| Code | lane repository | 9efb379 | `src/modules/core/commands/assignment.ts` (assign, assign selection, reassign, Gate 1 at work), `gates.ts` (grant, revoke), `controls.ts` (`assign` controls, exception freshness), `lists.ts` (assignment queue, admin queues), `derived.ts` (pending reasons); `src/modules/payments/commands/service-status.ts`, `queries.ts` (gate views); `src/contracts/core.ts`, `payments.ts`, `views-cases.ts` (monitors); `src/apps/staff/core/admin.ts`, `src/apps/staff/payments/routes.ts`, `src/apps/staff/attention.ts`; `src/platform/config.ts` (plan limit, round-robin limit, exception lifetime); `test/core/assignment-holds.test.ts`, `test/payments/service-entries.test.ts` |

### 0.2 Conventions

- **Personas.** SuperAdmin: `superadmin-1`, `superadmin-2` stand for `syn-superadmin-1`, `syn-superadmin-2`; every
  two-SuperAdmin step uses these two. Operator: `operator-1`, `operator-2`, `operator-3` stand for
  `syn-operator-1` to `syn-operator-3` (the design's recipe, §0.4; `operator-3` only receives assignments). TA:
  `syn-ta-1` (proof set-up), `syn-ta-2` (isolation only). Keyboard-only user. Screen-reader user. Phone user (390 px
  wide). No step suspends a seeded account (WP-02 data hygiene); an inactive operator or SuperAdmin is a test
  fixture.
- **Where.** `L`: a person or the LD-11 harness shows it on `lane-ui`. `T`: an automated test in the lane repository
  shows it at the same commit; the run record names the test. `L+T`: both are required.
- **Sign-in codes (rule C).** As WP-01 §0.2. The LD-11 harness signs in. Nobody prints, logs, screenshots or stores a
  code or an authenticator key.
- **Copy.** Quoted text is draft copy (CR-09). Draft copy passes when the page states the same facts. The §11.3
  boundary sentence form is mandatory for an unavailable action: "[Action] is unavailable until [policy or evidence]
  is [approved / recorded]. Owner: [owner or 'not yet named']."
- **Money.** Amounts show in rupees without paise ("₹3,500" for 350000 paise). The SuperAdmin types rupees.
- **Dates and times.** Every time carries "IST" (AD-10, CR-06). The payment event date is an India date.
- **Freshness (LD-08).** An authoritative read (`core.*`, `pay.*`) shows "Read at [time] IST". A projection shows
  "Up to date when read at [time] IST", "Behind by [n] s when read at [time] IST" or "Freshness unavailable". No
  page applies a client-side age threshold.
- **Facts.** A page shows only facts that its read model returns (WP-02 B-06). A fact read after an operation is
  labelled "Current" (B-02, C-03). A count that a read cannot give shows "Unavailable", never "0" (D7). A list that
  returns its row limit says so and claims no total.
- **Gate 1 words.** Service payment fact: "Received", "Not received", "Not recorded" (no entry yet). Gate 1 state, as
  the control evaluator reports it (`pay.application_payments.gate1`): "Met (payment received)", "Not met",
  "Exception recorded for [action]", "Not applicable", "Unknown". Core's queue reasons: "Waiting for the service
  payment or a Gate 1 exception" (`gate1_payment_not_received`), "Waiting for an operator" (`awaiting_assignment`),
  "Help approved: waiting for an operator" (`assistance_approved`), "The assigned operator is not active: reassign"
  (`assigned_operator_inactive`).
- **Receipts.** CMP-08 as WP01-A82 and WP03-A129: the request reference links to the operation status page; the
  resulting facts; "Recorded once. Sending the same form again does not repeat it."; no accepted time (P-02). A
  receipt names a result only when `core.operation` returns the expected resource and the command-specific summary
  (C-03). The polite region announces it.
- **Replay terms** (used by every "Nth time" item):
  1. *Double send*: a double-click on the final button.
  2. *Identical replay*: the harness sends the accepted request again with the same `_op` and the same fields (raw
     envelope). Expected: the original result, nothing new recorded.
  3. *Changed-content conflict*: the harness sends the same `_op` with one changed field. Expected: refused as a used
     form (`conflict_operation_key`); the page re-renders with a new form key, the typed values kept and "This form
     was already used with different content. Your values are kept: check them and send again."; nothing recorded.
  4. *Browser Back*: after the receipt the person presses Back. Back reloads the page (WP-01 A-02) with a fresh form
     and current facts. A send from that page is a new request; the command's own business check decides it.
  5. *Rejected-form refresh*: a send that Core refuses leaves no operation record; the re-rendered form carries a new
     key; the corrected send is recorded once.
  6. *Lost acknowledgement* (fixture): C4 (CMP-13) "Checking the original result" and "Check status"; no new send of
     the same intent is offered there.
- **Paths (LD-03).** Existing paths and form actions stay. New pages get new paths that the design names. Pages:
  SA-01 Home `/admin` (inventory D01, registered now); SA-02 views `/admin/queues/assignment`,
  `/admin/queues/assistance`, `/admin/queues/flags`, `/admin/queues/deferrals`, `/admin/intake-incidents`
  (existing); SA-03a single assignment (new path; action `/admin/applications/:id/assign` stays); SA-03b plan
  `/admin/assignments/selection/preview` (existing; actions `/admin/assignments/selection` and
  `/admin/assignments/round-robin` stay); SA-03c reassignment (new path; action `/admin/applications/:id/reassign`
  stays); SA-07a payment record of one application `/admin/applications/:id/payments` (existing); SA-09a Gate 1
  exception decision (new path; action `/admin/applications/:id/gate-exceptions` stays); SA-09b revocation decision
  (new path; action `/admin/gate-exceptions/:id/revoke` stays). The admin case page `/admin/applications/:id`
  keeps its read part (SA-04, later package) and links to SA-03 and SA-09. An item names the page; the run record
  names the path used.
- **Pass rule.** WP-06 passes when every `L` item passes on `lane-ui` at the integrated ref, every `T` item has a
  named passing test at that commit, every axe item passes, and the V06 proof (section 3) passes, except the
  explicitly deferred items of §5. The run record lists each deferred item as "Deferred" with its reference, not as
  "Fail". An item that the architect marks "partly met" by a recorded decision passes with that note. A failed item
  becomes a finding ranked P0, P1 or P2 with its scenario (PRI-20260930-01).
- **Preconditions on `lane-ui`.** WP-01, WP-02 and WP-03 are integrated (the TA pages create, edit and submit
  applications; the TA-07 read-only notice exists). The installation holds the synthetic seed of WP-02 §0.3.
  `superadmin-1`, `superadmin-2`, `operator-1` and `operator-2` are active and enrolled. The harness holds the
  synthetic sample documents of WP-03 §0.4 (generated from `test/fixtures/documents/samples.ts`, WP-03 Q-09).
- **Data hygiene.** WP-06 MUST NOT change seeded offerings, launches, listings or accounts. It creates its own group
  and applications per run (§0.4) through the TA pages, synthetic payment references and reasons that carry the run
  tag. It uses no real bank reference, no real person's data and no real passport. The run record keeps identifiers
  (applications, entries, exceptions, assignments, operation references) in the internal record only.

### 0.3 Synthetic data used by WP-06

| Item | Value | Use |
|---|---|---|
| Offering | "SYN Tourist e-visa" (`syn_tourist_evisa`), ₹3,500, TravelMudra files, TravelMudra pays the government fee | Every proof application. Gate 2 applies to it (B27). |
| Offering | "SYN Tourist visa preparation" (`syn_tourist_prep`), ₹1,800, preparation only | Gate 2 "Not applicable" (A90, by test) |
| Offering | "SYN Paper visa with original return" (`syn_paper_return`) | Custody holder in the reassignment preview (A61, by test) |
| Operators | `operator-1`, `operator-2` | Assignment, round robin, reassignment |
| Payment evidence | External reference `WP06-<run>-PAY-<n>`; attestation note "WP06 <run> synthetic attestation" | SA-07 entries |

### 0.4 Run recipe (rerunnable; the design's §6 recipe)

- Set-up through the rebuilt TA pages (WP-03), the harness signed in as `syn-ta-1`: create the group
  `wp06-v06-[yyyymmddhhmm]` in Synthetica, travel start today + 30 days, return today + 40 days; add applicants A, B,
  C and D ("SYN Tourist e-visa"; synthetic passports and photographs generated in memory as WP-03 design §8.1;
  application details saved so that submission is possible); submit A, B and C on TA-08; request help on D (TA-07)
  and leave D a draft. The timestamp makes every run unique. Seeded data is not changed.
- Operators: `operator-1`, `operator-2`, `operator-3` (the design's recipe). SuperAdmins: `superadmin-1`,
  `superadmin-2`.
- Payment references: `SYN-V06-[stamp]-[application letter]`. Reasons carry the stamp and have at least the length
  that Core requires.
- Checks compare with the baseline of §3 step V06-0 (deltas). Data of earlier runs stays and is excluded by its
  stamp.
- Mapping for rows that this correction did not change (they name the earlier recipe):
  - P1 → C on the exception path (A46, A75, A86); P1 → A for the refused assignment and the stale exception (A15,
    A16, A22, A32, A69, A76, A88, A98).
  - P2 → B (A16, A51, A53 to A59, A62, A66, A56), except the single assignment of A30, A35, A36 and A44, which is A
    at V06-16.
  - P3 → D (A17, A47, A77).
  - P4 and P5 → A: A67 at V06-4a; A96 and A99 at V06-14 (3), where the revoked exception is the stale one and the
    checks are the revocation and the refused assignment after it; A73 and A92 at V06-16. The earlier B correction
    step (H1) is V06-5a.
  - P6 → B and C in the plan (A22, A45).
  - `WP06-<run>-PAY-<n>` → `SYN-V06-[stamp]-[letter]`; "WP06 <run>" labels → the stamp.
  - Earlier §3 steps: Part A → V06-0; Part B → set-up; Part C → V06-1, V06-2; D1 → V06-3, V06-4; D2 → V06-5; D3 →
    V06-16; D4 → V06-7, V06-8; D5 → V06-8 (Current facts); E1 → V06-6 (C) and V06-14 (1) (A); E2 → V06-14 (2); E3 →
    V06-14 (3); E4 → V06-8; F1 to F3 → V06-11, V06-12; F4 → V06-13; G1, G2 → V06-15; G3 → V06-15; G4, G5 → V06-15a;
    H0 → V06-14 and V06-16; H1 → V06-5a; H2 → fixture (A40); H3 → V06-17; H4 → V06-17a; H5 → V06-17b; Part I →
    V06-6, V06-10, V06-18; Part J → the proof split.

## 1. Scope

### 1.1 Pages

| Page | Host and path | Part in WP-06 |
|---|---|---|
| SA-01 Decision inbox (Home) | 4652 `/admin` (new registration; becomes the SuperAdmin landing; rail "Home") | Whole page. `/admin/monitors` stays reachable until SA-08 (WP-14) takes its content (LD-02). |
| SA-02 Work queues | 4652 existing queue paths (rail "Work queues") | Views: Submitted unassigned (Gate 1 fact per row), Assignment and reassignment, Help requests, Flags from operators, Deferrals, Intake issues (the existing page until WP-18). Batch selection. The decision forms of help (WP-09), flags (WP-09), deferrals (WP-17) and intake issues (WP-18) stay where they are and are linked. |
| SA-03 Assignment and reassignment decision | 4652 SA-03a, SA-03b, SA-03c | Single assignment; selection and round-robin plan with per-application results; reassignment preview and receipt (Q-01) |
| SA-07 Money & exposure (one application) | 4652 `/admin/applications/:id/payments` | Service payment record (Gate 1) and its correction (Q-11); Gate 1 and Gate 2 shown as separate facts; payment-missing follow-ups of the application. The finance overview, exposure, ceiling (WP-07) and the follow-up list (WP-16) stay as they are. |
| SA-09 Generic decision page | 4652 SA-09a, SA-09b | Gate 1 exception (actions: assignment; start of operator work) and its revocation. Other decision kinds: Q-04. |
| Admin case page (SA-04 read part) | 4652 `/admin/applications/:id` | Only: its assign, reassign and gate-exception forms move to SA-03 and SA-09 and the page links to them; every other form stays (A110). |

Read models: Decision inbox (composed from `core.assignment_queue`, `core.admin_queue`, `views.monitors`,
`pay.finance_index` and the other reads the design names; Q-07), SuperAdmin work queue (`core.assignment_queue`,
`core.admin_queue`, `intake.admin_incidents`), Assignment candidate (`core.assignment_plan`, `core.admin_case`),
Money and exposure for one application (`pay.application_payments`), Gate decision context (`core.admin_case`,
`pay.application_payments`).

### 1.2 Command coverage (CC §5.1: 5 WP-06 commands, plus one)

| # | Command | Route id today | Page | Items |
|---|---|---|---|---|
| 1 | `pay.record_service_status` (record and correction) | `admin.payments.record` | SA-07a | A63 to A79 |
| 2 | `core.assign` | `admin.applications.assign` | SA-03a | A31 to A36, A44, A46, A47 |
| 3 | `core.assign_selection` (selection and round robin) | `admin.assignments.selection`, `admin.assignments.round_robin` | SA-03b | A37 to A43, A45, A50 |
| 4 | `core.grant_gate_exception` (Gate 1) | `admin.applications.grant_exception` | SA-09a | A80 to A94 |
| 5 | `core.revoke_gate_exception` | `admin.gate_exceptions.revoke` | SA-09b | A95 to A101 |
| + | `core.reassign` (CC row WP-12; in WP-06 per the brief, Q-01) | `admin.applications.reassign` | SA-03c | A51 to A62 |

All of them also: A103 (receipt checked against the operation), A104 (no record for a refusal; lost
acknowledgement), A105 (replay matrix), A106 and A107 (refusal text). Every page that reads an optional block: A108
(LD-14).

Commands outside WP-06 that the proof touches only as set-up or observation: `intake.start_individual`,
`core.edit_draft`, `core.submit`, `core.request_assistance` (WP-03 TA pages); `core.decide_assistance` (existing
decision form, WP-09); `ops.start_work` (existing operator page, WP-07; Q-10). Gate 2 decisions and
`ops`/`core` external-act commands (WP-07) appear only in tests (§3 Part I).

### 1.3 State coverage

S1 (loading) does not apply: every WP-06 page is server-rendered. S5 applies only where a page reads a projection.

| Page | Page states | C1 validation | C2 rejected | C3 accepted | C4 unresolved | C5 stale |
|---|---|---|---|---|---|---|
| SA-01 | S2 A05; S3 not applicable; S4 A06; S5 A09; S6 A07, A108; S7 A06; row limit A08 | — | — | — | — | — |
| SA-02 | S2 A24; S3 A13 (unknown view value); S4 A16; S6 A27, A108; S7 A25; row limit A25 | — | — | — | — | — |
| SA-03a single | Gate 1 unavailable A32; operator not assignable A33 | A44 (5) | A32, A33, A34 | A35, A46, A47 | A44 (6) | A36 |
| SA-03b plan | Plan problems A41; ineligible items A37 | A41 | A39, A42 | A38, A40 | A45 (6) | A43 |
| SA-03c reassignment | Not assigned A55; inactive operator A61 | A55 | A54, A55, A56 | A53, A56 | A57 (6) | A58 |
| SA-07a | No entry yet A63; boundaries A78 | A67, A68 | A68, A70 | A66, A69, A71, A72, A75, A77 | A74 (6) | A73 |
| SA-09a Gate 1 | Not blocking A82; duplicate or unusable A83; not open A85; non-overridable A91 | A84 | A82, A83, A85, A87, A88 | A81, A86, A89 | A93 (6) | A92 |
| SA-09b revoke | Not open A97 | A95 | A97 | A96, A98 | A100 (6) | A101 |

### 1.4 Specification scenarios

| Scenario | What WP-06 shows | Items |
|---|---|---|
| V06: an unpaid submitted case is visible in the assignment queue | Row with the payment fact and Core's reason; counts on SA-01 | A03, A14, A15, §3 Part C |
| V06: assignment requires Gate 1 or a fresh exception | Boundary and refusal without Gate 1; exception fresh, single use, revocable, stale after a payment change | A32, A38, A82, A86 to A88, A96, §3 Parts D and E |
| V06: help requires Gate 1 before operator work | Help approval before payment; assignment for help needs Gate 1 | A18, A47, §3 Part G |
| V06: operator work requires Gate 1 or a fresh exception | Gate 1 again at the first operator work on an unpaid assignment | A89, §3 Part F |
| V06: Gate 2 stays separate | Separate Gate 2 fact; a Gate 1 exception never passes Gate 2 | A64, A90, §3 Part I |
| V08: exception versus missing evidence versus non-overridable control; the exception asserts no missing fact | SA-09 effect and hard stops; receipts; SA-07 and TA-07 keep the missing payment | A80, A81, A91, A109 |
| V15: ownerless work is owned through SuperAdmin assignment; no SuperAdmin filing, readiness or completion control | Inactive-operator row and reassignment; no such control on SA pages | A17, A61, A109 |
| V15: explicit bounded delivery ownership | Not in WP-06 (fallback delivery ownership is OWNER CHOICE PENDING) | §5 |

## 2. Acceptance checklist

### 2.1 SA-01 Decision inbox (Home)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP06-A01 | SuperAdmin (`superadmin-1`) | 4652 sign-in, then SA-01 `/admin` | Sign in. Read where you land. Read the rail. Open `/admin/monitors`. | The SuperAdmin lands on Home `/admin`, not on Monitors. The rail shows "Home" first, marked as the current item. One `h1` names the page ("Decisions waiting"). The Monitors page still opens at its own address (LD-02). | L | PL §2.2, §3.4 SA-01; WP01-A64; WP-01 design §2 |
| WP06-A02 | SuperAdmin (`superadmin-1`) | SA-01 `/admin` | Read the page from the top. | `h1` "Decisions waiting"; the lead says that the counts come from the records now and that counts of different things are never added together; freshness "Read at [time] IST". Then the primary action (A04). Then the groups that have work or an unavailable count, each an `h2` section with a count and its unit, up to five item lines and one link, in this fixed order: (1) Applications whose operator is not active; (2) Submitted applications waiting for an operator; (3) Approved help waiting for an operator; (4) Help requests to decide; (5) Flags from operators; (6) Deferrals; (7) Second approvals; (8) Offering impact decisions; (9) Import issues; (10) Incidents; (11) Payment follow-up; (12) Uncertain external results; (13) Result send and completion waiting; (14) Travel dates; (15) Protection marks after a restore; (16) Reporting gaps. Last, the section "Nothing waiting now" with one line "[Group title]: none" per group whose count is a known zero. No metric-card grid, chart or percentage. Group 13 says that sending the result and requesting completion are the operator's steps and are not available in this release; it never says that an owner still has to choose the trigger (LD-04). | L | Design §2.1; PL §3.4 SA-01; UX §6.2; LD-04 |
| WP06-A03 | SuperAdmin (`superadmin-1`) | SA-01 groups 1 to 4; SA-02a and SA-02b | After the set-up of §3 (step V06-1), compare SA-01 with the queues. | Group 1 counts the SA-02a rows of the section "Operator no longer active". Group 2 counts the SA-02a rows of "Waiting for an operator" that are submitted applications, and splits them by Core's payment fact: "Service payment received: [a] applications", "Service payment not received or not recorded: [b] applications". Group 3 counts the approved-help rows. Group 4 counts the SA-02b rows. Each number equals the rows of the same read on the queue page. Groups 1 and 2 add "[n] in total" from the monitors read when it succeeds; the page states both numbers and adds neither. After the set-up, group 2 and its "not received or not recorded" line are the V06-0 baseline plus 3 (A, B, C), and group 4 is the baseline plus 1 (D). | L | Design §2.1 (groups 1 to 4, caps); UX §3.1 step 4, §12 V06; BS B18 |
| WP06-A04 | SuperAdmin | SA-01 | Select the primary action. Go back. Select the link of each group that has work. | The primary action reads "Open [title of the first group with work]" and opens that group's first item, or its queue when the group lists no items. With no group with work and no group unavailable, there is no primary action. Each group link opens its target: SA-02a (groups 1 to 3; group 1 at the section "Operator no longer active"), SA-02b, SA-02c, SA-02d, or the existing page of a later package (finance, elevations, catalogue impact, import issues, incidents, follow-up list, the applications list with its filter). Back returns to SA-01. | L | Design §2.1; PL §3.4 SA-01 |
| WP06-A05 | SuperAdmin | SA-01 when no decision waits (fixture) | Render the page. | The line "Nothing waits for a SuperAdmin now." above the section "Nothing waiting now", which lists every group as "[Group title]: none". No primary action. No "All done". A group whose read failed is never listed as "none" (A06). | T | Design §2.1 (S2); PL §1.3 S2; D7 |
| WP06-A06 | SuperAdmin | SA-01 when one read is unavailable, when one monitors field is null, and when every read is unavailable (fixtures; availability failures only) | Render the page. | One read unavailable: that group shows "Unavailable" as its count, "This count cannot be read now." and its link, in its place in the fixed order; the other groups are unaffected. A monitors field that is null: "Unavailable" on that line only. Every read unavailable: each group shows "Unavailable", there is no primary action, and the page still renders (a landing page, not the S7 page). No group shows "0" or "none" for an unreadable value. | T | Design §2.1 (states); PL §1.3 S4; D7; UX §8.3 |
| WP06-A07 | SuperAdmin | SA-01 with access refused between the first read and a later read (HTTP test) | Let one read answer an access, authentication, maintenance or support-view refusal. | The page renders the access page (SH-02, sign-in or maintenance), never the counts read before (LD-14). | T | LD-14; PL §2.3 SH-R04 |
| WP06-A08 | SuperAdmin | SA-01 when a list read returns its maximum (fixtures: assignment queue and admin queues at 200; import issues and incidents at 500) | Render the page. | The group count reads "[maximum] or more [unit]", never the maximum presented as a total. Groups 1 and 2 also show "[n] in total" from the monitors read when it succeeds. The partition lines of a capped list (for example group 2's payment lines) are not yet marked as partial: D-13 (review R-13, P2) is parked; the run record notes it as a known limitation, not as a failure. | T | Design §2.1 (caps); D7; CR-07; `WP-06.md` D-13 |
| WP06-A09 | SuperAdmin | SA-01 | Read the freshness of each group. | A group read from Core shows "Read at [time] IST". A group read from a projection shows the lag form ("Up to date when read at [time] IST", "Behind by [n] s when read at [time] IST") or "Freshness unavailable". No group shows an as-of time computed by the page. | L+T | LD-08; PL §6.4 (Decision inbox read model) |
| WP06-A10 | SuperAdmin | SA-01 | Read all visible text. | No SLA, deadline, "overdue" or age that a read does not return. The age of the oldest payment-missing follow-up shows because the read returns it ("Oldest opened [date time] IST"). No "Ready", "Override" or "Approved" as an overall state. Every count names its unit. | L | CR-02, CR-03, CR-07; PL §11.1; Q-07 |
| WP06-A11 | Phone user, SuperAdmin | SA-01 at 390 px | View the page. | Groups are stacked lists: heading, count and link first. No horizontal page scroll. The first group is reachable without scrolling past decoration. | L | PL SA-01 (Mobile); AC-04, AC-21 |
| WP06-A12 | SuperAdmin | SA-01 and the rail | Use the rail item "Work queues". Use the browser Back button. | "Work queues" opens SA-02 with its default view (A13). Back returns to SA-01 at the same address. | L | PL §2.2; W1 A-02 |

### 2.2 SA-02 Work queues

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP06-A13 | SuperAdmin (`superadmin-1`) | SA-02 (rail "Work queues") | Read the tabs. Open each. On SA-02a set the filter "Service payment: Not recorded", select "Apply", reload, press Back, select "Clear the filter". Put an unknown filter value into the address. | The Work queues tabs: "Assignment" (SA-02a `/admin/queues/assignment`), "Assistance" (SA-02b), "Flags" (SA-02c), "Deferrals" (SA-02d), and the existing pages Documents, Import issues and Imports (not rebuilt in WP-06). SA-02a: `h1` "Assignment"; the lead; the rule notice "Assignment needs Gate 1: the service payment recorded as received, or a Gate 1 exception for that application. Assignment is not a payment and moves no original. Approving help does not pass Gate 1."; the section "Waiting for an operator" (submitted applications and approved help) and the section "Operator no longer active". The filter is the enumerated value `payment` in the address (SH-R06): reload keeps it, Back restores the previous view, a filter change announces the result count (AC-16). No match: S3 "No application matches this filter." with "Clear the filter". An unknown value is ignored. | L | Design §1.3, §2.2.1; PL §2.3 SH-R06; AC-16 |
| WP06-A14 | SuperAdmin (`superadmin-1`) | SA-02 "Submitted unassigned" | Read the rows after §3 Part B. | One row per submitted application without an operator. Each row: applicant (surname, given names), application reference (link to the case page), group, service, price ("₹3,500, fixed at submission"), "Service payment: [Received / Not received / Not recorded]", Core's reason in words, and the next action. Freshness "Read at [time] IST". The row shows no TA name, no waiting time and no incident flag unless the read returns them (deferred, Q-08). | L | PL §3.4 SA-02 ("Gate 1 fact per row"), §6.4; UX §6.2; BS B18, B26 |
| WP06-A15 | SuperAdmin (`superadmin-1`) | SA-02 "Submitted unassigned" | Find P1 (submitted, no payment entry). | P1 is listed. It is not hidden or moved to another place because it is unpaid. Its row reads "Service payment: Not recorded" and "Waiting for the service payment or a Gate 1 exception". | L | UX §3.1 step 4, §12 V06; BS B18 |
| WP06-A16 | SuperAdmin | SA-02 rows in each payment state: Received (P2 after A66), Not received (P1 after §3 E2), Not recorded; and a row whose payment fact the read cannot give (fixture) | Read the Gate 1 fact of each row. | Received: "Service payment: Received" and "Waiting for an operator". Not received: "Service payment: Not received" and the Gate 1 reason. Not recorded: as A15. Unreadable fact: "Unavailable" in that cell, never "Not recorded". A row shows "Gate 1 exception recorded" only when a read returns that fact (Q-06); otherwise the plan of A37 shows the eligibility. | L+T | PL SA-02; D7; Q-06 |
| WP06-A17 | SuperAdmin | SA-02 "Assignment and reassignment" | Read the rows after §3 step G2. Render a row whose assigned operator is suspended (fixture). | The view lists every application that Core says waits on a SuperAdmin to assign or reassign: submitted unassigned rows (as A14), drafts with approved help ("Draft. Help approved: an operator is needed for the approved help."), and assigned applications whose operator is not active ("The assigned operator's account is not active. Reassign the application."). The action of the last kind is "Reassign" (SA-03c), never "Assign". | L (help row) + T (inactive operator) | PL SA-02 (Assignment and reassignment); UX §6.1 ("keep each obligation owned"), §12 V15; BS B11, B19 |
| WP06-A18 | SuperAdmin (`superadmin-1`) | SA-02b Help requests `/admin/queues/assistance` | After the set-up (D asked for help), read D's row. Select "Decide". | `h1` "Help requests". The lead says that approving help does not assign an operator and does not pass Gate 1, and that assignment and the operator's first work still need the service payment recorded or a Gate 1 exception. Columns: Application; Status of the application; Service payment (Gate 1); Action "Decide" → the carried WP-09 form on the case page (`#assistance`). The view shows the known gap of D-06 (A148). No text says that approving help never needs a payment: an approval on an application without an operator needs none (§3 V06-15), but an approval on an assigned application can be refused for Gate 1 at the first work (D-07, A147). After the decision, D leaves this view. S2: "No help request waits for a decision." | L | Design §2.2.2; `WP-06.md` D-06, D-07; UX §3.2 (Approved assistance); BS B18, B26 |
| WP06-A19 | SuperAdmin | SA-02 "Flags from operators" | Read the view (fixture if `lane-ui` holds no open flag). | Each row names the application and "Flag from the operator". The link opens the existing response form (WP-09). No response form is on SA-02. | T (L if a flag exists) | PL SA-02; CC `core.respond_flag` (WP-09) |
| WP06-A20 | SuperAdmin | SA-02 "Deferrals" | Read the view (fixture if `lane-ui` holds no deferral). | Each row names the application and the deferral state in words ("Proposed by the operator" or "Approved, review on [date]"). The link opens the existing decision form (WP-17). | T (L if a deferral exists) | PL SA-02 (Deferred review); CC `core.decide_deferral` (WP-17) |
| WP06-A21 | SuperAdmin | SA-02 "Intake issues" | Open the view. Use Back. | The existing intake-issues list opens (WP-18 rebuilds it); its dismissal form works as before. Back returns to SA-02 at the same view. | L | PL SA-02 (Intake issues); LD-02 |
| WP06-A22 | SuperAdmin (`superadmin-1`) | SA-02 "Submitted unassigned", selection | Select P1 and P6 (§3 D4). Read the selection bar. Go to another page of the list (if one exists). Select "Assign selected". | Each checkbox is labelled "Select [applicant], [reference]". The bar reads "Selected on this page: 2 applications". Selection is per page; no control selects rows that are not shown. "Assign selected" opens SA-03b with exactly the two selected applications. | L | PL CMP-26, SA-02 (Mobile: per page); UX §3.3 (bulk selection) |
| WP06-A23 | SuperAdmin | SA-02 | Look for group-level or automatic assignment. | No control assigns a whole group, assigns without a selection, or sets an automatic rule. Round robin exists only as an explicit SuperAdmin choice on a selection (A40). | L | BS B19 ("no autonomous or group assignment"); PL SA-03 |
| WP06-A24 | SuperAdmin | SA-02, each view with no item (fixture, or a view that is empty on `lane-ui`) | Open the view. | S2 per view, for example "No submitted application waits for an operator." or "No help request is open." The text names the view. No "0" is shown as a count of an unreadable list. | L (or T) | PL §1.3 S2 |
| WP06-A25 | SuperAdmin | SA-02 when a view's read fails, and when it returns its row limit (fixtures) | Render the page. | Read failure: S7 with "Try again", never S2. Row limit: "This list shows the first 200 applications." with the way to narrow it; the result line says "200 or more applications shown"; no total. | T | PL §1.3 S7; D7 |
| WP06-A26 | Phone user, SuperAdmin | SA-02 at 390 px | View the Submitted unassigned view. Select one row. | Rows are cards: applicant and reference first, then the payment fact and Core's reason, then the action. The selection checkbox and the bar stay usable; the bar never covers a focused control. No horizontal page scroll. | L | PL SA-02 (Mobile); AC-02, AC-04 |
| WP06-A27 | Operator (`operator-1`) signed in on 4652 | SA-02 and SA-01 addresses | Open `/admin` and `/admin/queues/assignment`. | SH-02: the same answer as for an address that does not exist. No count, row or application name shows. | L | PL §2.3 SH-R02; BS B10 |
| WP06-A28 | SuperAdmin | SA-02 → case page → back | Open an application from "Submitted unassigned". Use the breadcrumb. Open it again and press Back. | The breadcrumb reads "Work queues › Submitted unassigned" before the applicant's `h1`. The breadcrumb and Back return to the same view at the same address. | L | PL §2.3 SH-R06, SH-R07; W1 A-02 |
| WP06-A29 | SuperAdmin | SA-02a row actions | After §3 V06-5 and V06-15, read the actions of A (not recorded), B (received), D (approved help, not recorded), and of a row in "Operator no longer active" (fixture). | Every row in "Waiting for an operator" has "Assign" → SA-03a. A row whose payment is not recorded as received also has the links "Record the payment" → SA-07a and "Gate 1 exception" → SA-09g (`gate1_assignment`); links, not forms. For A and D, SA-03a then shows the Gate 1 notice and no form (A32). A row in "Operator no longer active" has "Reassign" → SA-03c and no selection checkbox. The actions follow the read's facts; Core decides again at send. | L (A, B, D) + T (inactive operator) | Design §2.2.1 items 5 and 7; PL SA-03; PL §6 |
| WP06-A30 | SuperAdmin | SA-02 after an assignment | Assign P2 (A35). Return to the view. | P2 is no longer in "Submitted unassigned" or "Assignment and reassignment". The result line counts one application fewer than before (delta). | L | BS B18; PL §4.1 step 7 |
| WP06-A147 | SuperAdmin; test (L when a run sets it up) | Carried help decision (WP-09) on an assigned, unpaid application whose operator has not started work and that has no first-work exception (fixture) | The travel agent's help request is open. Approve it. Then record a Gate 1 exception for the operator's first work (SA-09g `gate1_first_work`) and approve again. | The first approval is refused for Gate 1 at the first work, in words, with the routes "Record the payment" and "Gate 1 exception for first operator work"; nothing is recorded; the request stays open. After the exception, the approval is accepted and the exception reads "Used". No page states that approving help never needs a payment (A18). | T | `WP-06.md` D-07 (review R-07); `assignment.ts` (`decideAssistance` → `requireGate1AtWork`); BS B18, B26 |

### 2.3 SA-03 Assignment (single, selection, round robin)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP06-A31 | SuperAdmin (`superadmin-1`) | SA-03a `/admin/applications/:id/assign` of an assignable application (A after its payment, §3 V06-16) | Read the page. Select "Cancel". | Full-screen task page. `h1` "Assign an operator: [applicant]"; meta: application reference, service, group, travel agent, "Synthetic"; freshness. Status facts: Progress; Operator ("None"); Service payment (Gate 1); Help request; Next. `h2` "Can this application be assigned now": "Yes. TravelMudra checks again when you assign." `h2` "Duties the operator takes on" (one accountable operator; open incidents of the application, or "Unavailable"; "Assignment moves no original"). `h2` "Your decision": the "Operator" select (Core's assignable operators, none preselected). There is no reason field. The review text is visible before the button: the chosen operator becomes the operator at once and is notified; the travel agent can no longer change the application and can report a problem; assignment records no payment and moves no original. Buttons "Assign" and "Cancel" (→ SA-02a; nothing is recorded). | L | Design §2.3; PL §3.4 SA-03; UX §6.3; BS B18, B19 |
| WP06-A32 | SuperAdmin (`superadmin-1`); harness | SA-03a of P1 (unpaid, no exception) | Open the page. Then the harness sends the assignment by hand. | The page shows CMP-10: "Assigning this application is unavailable until the service payment is recorded as received or a Gate 1 exception is recorded. Owner: SuperAdmin." with links to SA-07a and SA-09a. No usable assign control. The hand-made send is refused with the same text (Gate 1 not met); no assignment exists; the status page of its key says "Nothing is recorded for request [reference] so far". | L+T | PL SA-03 (Unavailable → SA-07 or SA-09), §11.3; BS B18, B26; UX §12 V06 |
| WP06-A33 | SuperAdmin; harness | SA-03a | Read the operator choice. Harness: send the assignment with the account id of `syn-ta-1`, then of a suspended operator and of an operator without sign-in set up (fixtures). | The choice lists only active operators with sign-in set up, by name. Each hand-made send is refused: "This person cannot be assigned: only an active operator with sign-in set up can be assigned." Nothing is recorded. | L (TA id) + T | `core.assign` (`operator_not_assignable`); BS B11 |
| WP06-A34 | SuperAdmin; harness | SA-03a | Harness: send an assignment for an assigned application, for a draft without approved help and for a completed application (fixture). | Assigned: "This application already has an operator. Reassign it instead." with the link to SA-03c. Draft without approved help: "A draft can be assigned only for approved help." Completed or withdrawn: "The application is not open." Nothing is recorded. | L (first) + T | `controls.ts` `assign` (`already_assigned`, `assistance_not_approved`, `application_not_open`) |
| WP06-A35 | SuperAdmin (`superadmin-1`) | SA-03a of P2 (payment received, A66) | Choose `operator-1`. Select "Assign to [operator]". | C3: receipt "Operator assigned": application (link), "Assigned to [operator-1's name]", request reference link, "Recorded once…". The receipt names the result only when the operation returns this application and an assignment id (C-03). Afterwards: TA-07 of P2 shows the assigned notice (WP03-A103); `operator-1`'s work list (existing OP-01) lists P2 (Current). | L | PL §4.1 step 7; BS B18, B19; C-03 |
| WP06-A36 | SuperAdmin, two tabs (`superadmin-2` in tab 1, `superadmin-1` in tab 2) | SA-03a of P2 (paid; §3 D3) | Tab 1: open SA-03a of P2 and choose `operator-1`. Tab 2: assign P2 (A35). Send tab 1. | Tab 1: C5 "Changed since your review" (CMP-14) with the current facts beside the unsent choice and "Review current information". Nothing is assigned until the SuperAdmin sends again. | L | CMP-14; UX §3.3; `core.assign` (`expectedRevision`) |
| WP06-A37 | SuperAdmin (`superadmin-1`) | SA-02a → SA-03b preview (§3 V06-7: A, B, C; one operator `operator-1`) | Select A, B and C. Choose "One operator for every selected application" and tick `operator-1`. Select "Preview the plan". Read it. Use "Remove [applicant] from the plan" on one row, then go back. | `h1` "Assignment plan: one operator". Scope: "3 applications selected on the queue page.", the operators, "Each application gets its own operator and its own result. Nothing is assigned as a group." Evidence: the plan table (Order; Application; Operator; Assignable now: "Yes" or "Not now: [Core's sentences]" with the routes of a Gate 1 blocker) and the line "Assignable now: 2 of 3 applications." A not assignable application stays in the table with its reason. Effect, and the visible review text: at confirm TravelMudra checks every application again; an application that is assignable then is assigned, also one that was not assignable at the preview; one that is not stays unassigned and the result says so. Button "Confirm the plan for 3 applications"; link "Change the selection" (SA-02a with the selection kept). Each row has "Remove [applicant] from the plan": it opens the preview again without that application (a new GET preview; nothing is posted or assigned). | L | Design §2.4.1; `WP-06.md` §3 (Q-W06-04), D-11 (selection removal per row stays); PL SA-03 ("Secondary: remove an application from the selection") |
| WP06-A38 | SuperAdmin (`superadmin-1`) | SA-03b, confirm the plan of A37 (§3 V06-8) | Select "Confirm the plan for 3 applications". | The result page `h1` "Assignment plan: result" with the receipt: "Assigned: 2 applications", "Not assigned: 1 application" (from the operation's summary), the request reference and a link to the current assignment queue. It shows no per-application names or results taken from the address (D-01). Which application got which operator is read afterwards, labelled "Current": SA-02a no longer lists B and C; SA-03a of B and of C reads "Already assigned to [operator-1]"; A stays in SA-02a. No confirm form shows in result mode. Per-application result lines are partly met until Core returns the application per item (P-10 a). | L | `WP-06.md` D-01, P-10 a; review R-01; design §2.4.2 as amended; PL §7 K-BATCH |
| WP06-A39 | SuperAdmin; harness | SA-03b with a plan of only ineligible applications (P1 alone, unpaid) | Confirm the plan (the harness sends it if the page offers no button). | Refused as a whole: the error summary lists each application with its reason; nothing is assigned; the refused send leaves no operation record (status page as A32). | L+T | `core.assign_selection` (no passing item → refused); W1 A-08 |
| WP06-A40 | SuperAdmin | SA-03b round robin (fixture with two or more assignable applications; on `lane-ui` only when a run holds two assignable unassigned applications) | Select the applications. Choose "Round robin over several operators" and tick `operator-1` and `operator-2`. Preview. Confirm. | The hint says that application 1 goes to the first operator ticked, application 2 to the second, and so on, in the order of the list. The plan shows the exact alternation in that order; there is no separate control to reorder the operators. At confirm each application is assigned as previewed when Core still allows it; the result shows the counts (A38). Afterwards each application's operator reads as previewed (Current). | T (L when a run allows) | Design §2.2.1 item 6, §2.4; BS B19; `core.assign_selection` (`round_robin`) |
| WP06-A41 | SuperAdmin | SA-03b plan problems and refusals | (1) Preview without a mode (edited address). (2) Round robin with one operator. (3) "One operator" with two operators (edited address). (4) A preview with no application. (5) A plan above Core's batch maximum (fixture). (6) A plan whose address names an application that does not exist or that the reader cannot read. | (1) The form-level item "Choose how to assign: one operator for every application, or a round robin." with "Change the selection"; no plan read. (2) to (5): Core's problems as form-level items in words ("Round robin needs at least two operators.", "One operator for every application needs exactly one operator.", "Choose at least one application.", "Too many applications for one plan. Choose fewer."), no plan table, "Change the selection". (6) The uniform not-found page (SH-02): the plan read refuses it; it is not a problem entry. The page states no limit number. | L ((1) to (4)) + T ((5), (6)) | Design §2.4.1, §3.4; `WP-06.md` D-12 (review R-12); `core.assignment_plan` (`PLAN_PROBLEMS`); WP-01 Q-13 |
| WP06-A42 | Harness as `superadmin-1` | SA-03b | Send a round-robin confirmation whose operator order differs from the previewed plan. | Refused: "The plan changed after it was shown. Show the plan again." Nothing is assigned. | L+T | `core.assign_selection` (`round_robin_plan_mismatch`) |
| WP06-A43 | SuperAdmin, two tabs | SA-03b plan of two paid unassigned applications (fixture; or two extra paid applications of the run recipe) | Show the plan in tab 1. In tab 2, `superadmin-2` assigns one of them on SA-03a. Confirm tab 1. | The changed application: "Not assigned: it changed after the plan was shown (it already has an operator)." The other application is assigned as previewed. No application is assigned to an operator that the plan did not show. | T (L with extra applications) | `core.assign_selection` (per-item `stale_revision`); BS B35; PL §7 K-BATCH |
| WP06-A44 | SuperAdmin; harness | SA-03a, the Nth time | Replay terms 1 to 6 (§0.2) on the A35 assignment. For term 4, after Back send the form that the page now shows. For term 5, send with no operator chosen, then choose one and send. | (1), (2): one assignment; the same receipt. (3): refused as a used form; values kept; nothing recorded. (4): Back reloads SA-03a; it shows "Assigned to [operator]" with the route "Reassign" and no assign form; a hand-made send with a new key is refused "already has an operator" and leaves no record. (5): C1 "Choose an operator."; the corrected send assigns once. (6): C4 on the operation page; no new assign is offered there. | L+T | PL §7 K-STD; BS B35; W1 A-02, A-08 |
| WP06-A45 | SuperAdmin; harness | SA-03b, the Nth time | Replay terms 1 to 6 on the A38 confirmation. For term 4, after Back show the plan again and confirm. | (1), (2): the same per-application results; no second assignment. (3): refused as a used form; nothing recorded. (4): the plan read now shows P6 "Not now: it already has an operator"; confirming P1 and P6 again is refused as a whole (A39) and leaves no record. (6): C4; no new confirm is offered there. | L+T | PL §7 K-BATCH; BS B35 |
| WP06-A46 | SuperAdmin (`superadmin-1`) | SA-03a of P1 with a fresh Gate 1 exception for assignment (§3 E4) | Assign P1 to `operator-1`. Read the receipt. | C3: "Assigned to [operator-1] under a Gate 1 exception. The service payment is still [Not received]. A payment-missing follow-up is open, owned by [the accountable SuperAdmin that the payment read names: the one who recorded the exception]. Operator work on this application needs Gate 1 again: the service payment, or a separate exception for the start of operator work." (Q-05). SA-07a of P1 lists the open follow-up (Current). | L | BS B26 ("retain an owned financial exception"), B29; `assignment.ts` (`work_under_gate1_exception`); Q-05 |
| WP06-A47 | SuperAdmin (`superadmin-1`) | SA-03a of P3 (draft, help approved, payment received; §3 G5) | Assign P3 to `operator-2`. | C3: "Assigned for approved help to [operator-2]. The application stays a draft. The operator enters information only within the approved help and then returns it to the travel agent for review and submission." No submission exists; TA-07 of P3 still shows "Draft". | L | UX §3.2 (Approved assistance); BS B18; PL §4.2 A3, A6 |
| WP06-A48 | Phone user, SuperAdmin | SA-03a, SA-03b, SA-03c at 390 px | Open each page. Send one with an error. | Full-screen task pages. The applications and their eligibility come before the operator choice; the consequence text and the final button are at the end, not in a fixed bar. The error summary and the fields are visible when focused. No horizontal page scroll. | L | PL SA-03 (Mobile); UX §7.3 (Mobile); AC-02 |
| WP06-A49 | SuperAdmin | SA-01 and SA-02 after A35, A38 and A40 | Compare the counts with the baseline. | The unassigned counts fall by the number of applications assigned (delta). Assigned applications appear nowhere in "Submitted unassigned". | L | PL §4.1 step 7 ("What the other roles see next") |
| WP06-A50 | SuperAdmin; test | SA-03b confirm form | Inspect the confirmation the page sends (test). | The confirmation carries exactly the previewed plan: the applications in the shown order, each with the revision the plan showed, the operators in the chosen order and the per-application operator. No field is computed after the preview. | T | `core.assign_selection` ("confirm carries the previewed plan", CC); PL §7 K-BATCH |

### 2.4 SA-03 Reassignment

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP06-A51 | SuperAdmin (`superadmin-1`) | Case page of P2 (assigned, A35) → "Reassign"; SA-02 inactive-operator row (A17); SA-06d operator duties page (WP-02) | Open the reassignment from each entry. | Each entry opens SA-03c for that application. The duties page links each assigned application to its SA-03c. | L (first) + T (others) | PL SA-03; WP02-A96; BS B11 |
| WP06-A52 | SuperAdmin (`superadmin-1`) | SA-03c `/admin/applications/:id/reassign` of B (assigned to `operator-1`; §3 V06-17) | Read the page. Choose `operator-2`. Write a reason. | `h1` "Reassign: [applicant]". Status facts: Progress, Operator now, Service payment (Gate 1), Readiness in words. Scope: "This application only." Evidence "What moves and what stays": open holds; acts whose filing is authorized or unknown; incidents of this application owned by the current operator. Each list (or "None", or "Unavailable") is labelled as current and possibly incomplete: TravelMudra moves every unresolved duty of the application, also duties that the list does not show (D-04). No text says that exactly the listed duties move. "Stays as it is": originals with their holder, or "No original is recorded for this application"; external acts and their evidence. Readiness: the new operator records readiness again before any filing or packet release, unless a SuperAdmin grants a readiness exception. Gate 1: reassignment needs Gate 1 like an assignment; when the payment is not recorded as received, a fresh Gate 1 exception for assignment is needed (link SA-09g); the form stays and Core decides. "New operator" select (without the current operator) and "Reason for reassigning" (required). Visible review before "Reassign"; "Cancel". A complete duties preview is partly met until Core serves one (P-10 d). | L | Design §2.5 as amended by `WP-06.md` D-04; P-10 d; review R-04; PL SA-03; UX §6.3; BS B19 |
| WP06-A53 | SuperAdmin (`superadmin-1`) | SA-03c of P2 | Select "Reassign to [operator-2]". | C3: "Reassigned": previous operator, new operator (the operation returns this application and a new assignment id), request reference. Facts read afterwards are labelled "Current": the operator, the readiness state, the moved duties. Originals and their holder are unchanged. | L | BS B19; PL §7 Reassign operator; C-03 |
| WP06-A54 | SuperAdmin; harness | SA-03c of P2 | Harness: send the reassignment to the current operator; to `syn-ta-1`'s account id. | Each is refused: "Choose an operator other than the current one." / "This person cannot be assigned…". Nothing is recorded. | L+T | `core.reassign` (`operator_not_assignable`) |
| WP06-A55 | SuperAdmin; harness | SA-03c | Send with no reason. Send with a reason shorter than Core accepts. Harness: send a reassignment for P1 before it is assigned. | No reason: C1 "Give a reason." Short reason: C1 with Core's rule in words. Not assigned: "This application has no operator now. Assign it instead." with the link to SA-03a. Nothing is recorded. | L+T | `core.reassign` (`zReason`, `assignment_changed`); AC-08 |
| WP06-A56 | SuperAdmin (`superadmin-1`) | SA-03c of P2 after its payment was corrected to "Not received" (§3 H4, H5) | Reassign P2 to `operator-1`. Then record a Gate 1 exception for assignment (SA-09a) and reassign again. | First: refused for Gate 1 (as A32, with the SA-07a and SA-09a links); nothing changes. Second: C3 as A53; the exception is shown as used for this reassignment; a payment-missing follow-up is open. | L | `controls.ts` (`reassign` evaluates Gate 1 for `assign`); BS B26 |
| WP06-A57 | SuperAdmin; harness | SA-03c, the Nth time | Replay terms 1 to 6 on the A53 reassignment. For term 4, send the form that the reloaded page shows with the same new operator. | (1), (2): one reassignment; the same receipt. (3): refused as a used form; nothing recorded. (4): the reloaded page shows the new operator as current; the send is refused "Choose an operator other than the current one" and leaves no record. (6): C4; no new reassignment is offered there. | L+T | PL §7 K-STD; BS B35; W1 A-02 |
| WP06-A58 | SuperAdmin, two tabs | SA-03c of P2 | Open SA-03c in tab 1 and tab 2. Reassign in tab 2. Send tab 1. | Tab 1: C5 "Changed since your review" with the current operator. Nothing is overwritten. | L | CMP-14; BS B19 ("no latest-write-wins") |
| WP06-A59 | Operators (`operator-1`, `operator-2`) | Existing operator pages after A53 | `operator-1` opens P2's address. `operator-2` opens the work list. | `operator-1`: SH-02, the same as for an unknown address; no applicant name. `operator-2`: P2 is listed. | L | BS B10 ("reassignment takes effect on old links"), B19 |
| WP06-A60 | SuperAdmin; test | SA-03c with fixture cases: (a) a readiness record of the current operator, an open hold, a filing-unknown act and an incident owned by the current operator; (b) an incident owned by a stand-in reviewer, and a resolved incident that still needs closure | Render the preview. Reassign. Render the case. | (a) The preview lists the four facts under the "current, possibly incomplete" label. After the reassignment: readiness reads "Recorded by the previous operator: the new operator records it again"; the act's reconciliation owner is the new operator; the hold and the incident belong to the new operator. (b) The preview may not list these incidents; the page never states that its lists are complete; after the reassignment the duties that Core moved show as current facts. | T | `WP-06.md` D-04 (review R-04); BS B19; `test/core/assignment-holds.test.ts` ("reassigns: duties move…") |
| WP06-A61 | SuperAdmin; test | SA-02 and SA-03c with a fixture: the assigned operator is suspended; the application holds an original ("SYN Paper visa with original return") | Open the inactive-operator row. Reassign. | The row reads as A17. The review names the original's current holder as unchanged. After the reassignment the row leaves the view; the original's holder is the same as before. | T | UX §6.1, §12 V15, V18; BS B11, B19, B30 |
| WP06-A62 | TA (`syn-ta-1`) | TA-07 of P2 after A53 | Read the page. | The assigned notice of WP03-A103 is unchanged ("your operator"). The TA gets no action because of the reassignment. | L | UX §2.3; BS B18 |

### 2.5 SA-07 Service payment record (Gate 1) and correction

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP06-A63 | SuperAdmin (`superadmin-1`) | SA-02 row "Record the service payment" → SA-07a of P2 (no entry) | Read the page. | Header: application (applicant, reference), travel agent name, service, lifecycle in words, price ("₹3,500, fixed at submission", or "Not fixed: the application is a draft"). Money facts (CMP-16) as labelled rows: "Service payment: Not recorded"; "Gate 1: Not met"; "Gate 2: [state]" (A64); entries ("No entry yet"); payment-missing follow-ups ("None"). Then the "Record service payment" form. Freshness "Read at [time] IST". | L | PL §3.4 SA-07, §5.4 SA-07; UX §6.3 (Manual money record); BS B26 |
| WP06-A64 | SuperAdmin | SA-07a of C after §3 V06-6 and after V06-8; a preparation-only application (fixture) | Read the gate rows each time. | The rows are labelled "Gate 1 for assignment" and "Gate 2", with the states that Core's evaluator reports (D-05). C after V06-6: "Gate 1 for assignment: Passed by exception". C after V06-8 (exception used, payment not recorded): "Gate 1 for assignment: Blocked". The page draws no conclusion about Gate 1 for the operator's first work or for a reassignment. Gate 2 is its own row with the line "Gate 2 is separate: a Gate 1 exception never passes it."; the Gate 1 exception never shows on the Gate 2 row. Preparation only: "Gate 2: Not applicable". A gate state that Core cannot give: "Unavailable". Every other row of this checklist that names "Gate 1" on SA-07a reads it as "Gate 1 for assignment". | L (C) + T | `WP-06.md` D-05 (review R-05), P-10 e; design §2.6; BS B27 |
| WP06-A65 | SuperAdmin | SA-07a of A (no entry) and of B (entry recorded) | Read the forms. | "Record a payment entry" shows only when the application has no entry or its current status is "Not received" (Core refuses other cases). Fields with visible labels: status ("Payment received" / "Not received"; hidden when only one applies); amount in rupees (optional); event date (India date, optional); evidence rows up to Core's limit, each with kind ("Payment reference", "Document of this travel agent", "Attestation"), value and note (D-10, A150). The review line before the button says that the entry is added and never changed, and what "Payment received" and "Not received" do to Gate 1, to open follow-ups and to an open Gate 1 exception. Button "Record payment entry" or "Record payment received". On B, "Correct the current entry" (built in WP-06, `WP-06.md` §3 PM Q-11): the entry it corrects, the values to change, the reason (required). No gateway, "Pay now", refund or write-off control. | L | Design §1.4 row 7, §2.6 item 5; `WP-06.md` §3 (PM Q-11), D-10; PL SA-07; BS B26, B29 |
| WP06-A66 | SuperAdmin (`superadmin-1`) | SA-07a of P2 | Status "Received", amount 3500, evidence "Payment reference" `WP06-<run>-PAY-2`, event date today. Send. | C3: receipt "Service payment recorded: Received", entry 1, for this application (the operation returns this application, the entry id and the status). Gate 1 now reads "Met (payment received)" (Current). The entry shows: number, "Record", "Received", ₹3,500, the reference, the event date, recorded by [superadmin-1] and the recorded time in IST. SA-02 shows "Service payment: Received" for P2; TA-07 shows the payment fact. | L | PL §4.1 step 6; BS B26; C-03 |
| WP06-A67 | SuperAdmin | SA-07a of P4 | Status "Received" with only an attestation note. Send. | C1: "A received payment needs a payment reference or a payment document. An attestation can only go with one of them." The typed values stay. Nothing is recorded. | L | `service-status.ts` (`payment_evidence_required`); BS B26 |
| WP06-A68 | SuperAdmin; harness | SA-07a of A (§3 V06-4a) | Send: a document id of a `syn-ta-2` document version; an evidence kind outside the list (harness); an event date tomorrow; the amount "35OO". | Each send is refused on its field, in words, and the values stay: a document of another travel agent reads as not found for this travel agent (nothing about it is disclosed); a kind outside the list: "This kind of evidence is not accepted."; a future date: "The event date cannot be in the future."; an amount that is not a number: the amount rule in words. Nothing is recorded. More evidence rows than Core's limit: A150. | L+T | Design §2.6 (C2); `service-status.ts` (`kind_not_allowed`, `invalid_id`, `in_future`, `payment_evidence_not_found`); BS B10; AC-08 |
| WP06-A69 | SuperAdmin (`superadmin-1`) | SA-07a of P1 (§3 E2) | Status "Not received", evidence "Attestation note" "WP06 <run> synthetic attestation". Send. | C3: "Service payment recorded: Not received", entry 1. Gate 1 reads "Not met". SA-02 shows "Service payment: Not received". | L | BS B26; `zServiceEntryStatus` |
| WP06-A70 | SuperAdmin; harness | SA-07a of B after §3 V06-5a (entry 2 corrects entry 1) | (1) Harness: send another "Record" for B with the current status revision (fresh form). (2) Correct B with the same status, amount and evidence. (3) Harness: send, with the current status revision, a correction of entry 1 (no longer current). | (1) Form-level: "The payment is already recorded as received. A change is a correction of the current entry." (2) "The correction changes nothing." (3) "Only the current entry can be corrected." with the current entry shown. Nothing is recorded. Each case uses the current revision, so that Core's business check answers and not the stale check (A105). A "Record" with "Payment received" after "Not received" is allowed (§3 V06-16). | L+T | Design §2.6 (C2); `service-status.ts` (`payment_entry_kind_invalid`, `correction_no_change`, `correction_target_not_current`); `WP-06.md` D-12 |
| WP06-A71 | SuperAdmin (`superadmin-1`) | SA-07a of B after its "Payment received" entry and before the plan (§3 V06-5a) | Select "Correct the current entry". Change the amount to 3400. Write a reason. Send. | The correction form names the entry it corrects and requires a reason. Accepted: the receipt follows A103 (the returned entry's own kind establishes "Correction recorded"), "Entry 2 corrects entry 1". Entry 1 stays visible, marked as corrected. No entry is edited or deleted. "Follow-up opened: no" (no operator work yet). | L | `WP-06.md` §3 (PM Q-11); design §2.8 (`corrected`); BS B26, B33; UX §6.3 |
| WP06-A72 | SuperAdmin (`superadmin-1`) | SA-07a of B after the plan assigned it (§3 V06-17a) | Correct "Payment received" to "Not received" with a reason. | Accepted: "Follow-up opened: yes" from the operation's summary; the follow-up section lists the payment-missing follow-up (work authorized, then corrected to not received), owned by `superadmin-1`. The assignment stays; nothing is undone. "Gate 1 for assignment: Blocked" (Current). SA-01 group 11 "follow-up items open" is one more than the value read just before (delta). | L | BS B26, B29; design §2.8 (`corrected`); `service-status.ts` (`worked_then_corrected_to_unpaid`) |
| WP06-A73 | SuperAdmin, two SuperAdmins | SA-07a of P5 (§3 H0) | `superadmin-1` opens the form and chooses "Not received". `superadmin-2` records "Received". `superadmin-1` sends. | Tab 1: C5 "Changed since your review" with the current status and current entry beside the unsent values; "Review current information". Nothing is recorded from tab 1. | L | CMP-14; `service-status.ts` (`expectedStatusRevision`) |
| WP06-A74 | SuperAdmin; harness | SA-07a, the Nth time | Replay terms 1 to 6 on the A66 entry. For term 4, send the reloaded form with the same values. For term 5, use A67, then add a reference and send. | (1), (2): one entry; the same receipt. (3): same key with status "Not received": refused as a used form; values kept; nothing recorded. (4): the reloaded page shows entry 1; the new send is refused by the entry rule of A70 (1) and leaves no record. (5): one entry. (6): C4; no new send is offered there. | L+T | PL §7 K-STD; BS B35; W1 A-02, A-08 |
| WP06-A75 | SuperAdmin (`superadmin-1`) | SA-07a of P1 after "Received" (§3 F4) | Read the follow-ups. | The follow-ups that the Gate 1 exceptions opened read "Closed by a service entry ([entry number])", never "Collected", "Paid" or "Settled". The receipt says how many follow-ups closed. | L | BS B29; `FIN_EXCEPTION_STATES` (`closed_by_service_entry`) |
| WP06-A76 | SuperAdmin | SA-07a and SA-09a of P1 after §3 E2 | Read the Gate 1 row and the exception. | Gate 1 reads "Not met". The recorded exception shows that it does not pass Gate 1 now (A83). No page says that the exception still allows assignment. | L | `controls.ts` (`exceptionFreshness`: `gate_exception_stale`); BS B26 ("fresh") |
| WP06-A77 | SuperAdmin | SA-07a of P3 (draft; §3 G4) | Record "Received" with a reference. Read TA-07 of P3. | Accepted as A66. The application stays a draft: no submission, no quote fixed, no original estimate start. | L | BS B17, B26; UX §12 V05 |
| WP06-A78 | SuperAdmin | SA-07a; rail "Money & exposure" | Read the page for refund, write-off, fee exclusion and reservation release. Use the rail item. | Each shows only as the existing boundary notice with owner "product owner"; no control. The rail item opens the existing finance overview until WP-07 and WP-16; the follow-up list stays on its page and is linked. No "Accounts dashboard". | L | PL SA-07 (Boundaries), §11.3; BS B29, B43; CC §5.5 |
| WP06-A79 | Phone user, SuperAdmin | SA-07a at 390 px | View the page. Record with an error. | Money facts first, then entries as cards, then the form; evidence rows stacked with their labels. The error summary is visible when focused. No horizontal page scroll. | L | PL SA-07 (Mobile: per-application cards) |
| WP06-A149 | SuperAdmin (`superadmin-1`) | SA-07a of B after §3 V06-5a | Correct the current entry, changing only the event date (status, amount and evidence unchanged). Send. | Refused as Core answers it: "The correction changes nothing." (Core does not compare the event date). The typed values stay; nothing is recorded. The page does not change the evidence to force acceptance and does not claim that the date was corrected. The gap stays open until P-10 g is served. | L | `WP-06.md` D-09 (review R-09), P-10 g; `service-status.ts` (`correction_no_change`) |
| WP06-A150 | SuperAdmin; harness | SA-07a of D before its payment (§3 V06-15a) | Fill every evidence row that the form offers (Core's limit) with an attestation, and record "Not received". Read the entry. Harness: post one evidence row more than Core's limit. | The form offers rows up to Core's limit and no more. Every filled row reaches Core and shows in the entry; no row is silently dropped. The post with one row too many is refused with a field error on the evidence (the rule in words); nothing is recorded; the values stay. | L+T | `WP-06.md` D-10 (review R-10); `zPaymentEvidence` (one to five items) |

### 2.6 SA-09 Gate 1 exception decision

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP06-A80 | SuperAdmin (`superadmin-1`) | SA-09g `/admin/applications/:id/decide/gate1_assignment` for C (§3 V06-6); reached from SA-02a, SA-03a and the case page | Read the page. Select "Cancel". | CMP-25 frame in this order. `h1` "Gate 1 exception for assignment: [applicant]". Scope: application reference, service, travel agent; "Gate: Gate 1, service payment. Action: assignment of an operator to this application (also a reassignment), once." Evidence: service payment status and the latest entry (or "No entry yet"); help request state; operator; Core's evaluation of assignment now; the table of this application's gate exceptions (Gate, For, State, Expires [time] IST). Effect: what it allows (one assignment or reassignment while Gate 1 blocks it); what it does not do (record a payment; confirm the travel agent's authority or the application's details; assert readiness; pass Gate 2; allow the operator's first work); when it ends (used, revoked, expired, payment record or assignment changed, grantor no longer active); the follow-up that opens when it is used while the payment is not recorded. Hard stops: mandatory validations, fixed cut-offs and the exposure ceiling have no exception; other blockers of the assignment are listed. "Reason for the exception" (required). Visible review; buttons "Record Gate 1 exception for assignment" and "Cancel" (→ SA-03a; nothing is recorded). A supporting evidence reference that the SuperAdmin names for the decision (UX §6.3, PL §7) does not exist in the command: the run record marks that part "Unmet — waits for a Kind 2 decision" (D-03, P-10 c), not "Fail". | L | Design §2.7.1, §2.7.2; `WP-06.md` D-03 (review R-03); UX §6.3, §7.3; BS B20, B26 |
| WP06-A81 | SuperAdmin (`superadmin-1`) | SA-09g of C (§3 V06-6) | Write a reason. Review. Record. | The receipt follows A103. A grant and a revocation return the same result shape, so the receipt reads "Request recorded" with the request reference (D-02) and the current state labelled "Current": the exception row of the returned id (Gate 1, for assignment, "Open until [time] IST"), "Service payment: Not recorded", and the line "This exception does not pass Gate 2." The receipt never says "paid", "payment received" or "approved". The page then shows the "Already open" state (A83). TA-07 of C still reads "Service payment: Not recorded" (the exception asserts no missing fact). | L | `WP-06.md` D-02 (review R-02); design §2.8 (`granted`); BS B20; UX §12 V08 |
| WP06-A82 | SuperAdmin; harness | SA-09a of P2 (payment received); SA-09a "Start of operator work" for P1 before assignment | Open each page. Harness: send each grant by hand. | P2: "Gate 1 is met: the service payment is received. No exception is needed." and no form. P1 start of work before assignment: "Gate 1 is not blocking this action now: the application has no operator yet." and no form. Each hand-made send is refused with the same words (`gate_not_blocking`); nothing is recorded. | L+T | `gates.ts` (`eligibility`: `gate_not_blocking`); BS B20 ("only while the gate actually blocks") |
| WP06-A83 | SuperAdmin; harness | SA-09g `gate1_assignment` for A when an exception for assignment is recorded and unused: (a) usable (§3 V06-14 step 1); (b) after "Not received" was recorded for A (V06-14 step 2) | Open the page each time. Harness: send a new grant each time with the current revision. | (a) "A Gate 1 exception for assignment is open until [time] IST. TravelMudra uses it only while it is fresh." with the links "Assign an operator" and "Revoke"; no form. (b) The same state, Core's sentence that the exception was recorded on facts that changed, and "Revoke it, then record a new one if it is still needed." (two explicit steps, `WP-06.md` §3 PM Q-09). Each hand-made grant is refused: "A Gate 1 exception for this action is already open. No second one was recorded." Nothing is recorded. Core gives no assignment evaluation for an assigned application, so the stale explanation of (b) is tested only on an unassigned application (review R-05). | L | Design §2.7.2 ("Already open"), §2.10; `WP-06.md` §3 (PM Q-09), D-05; `gates.ts` (`conflict_duplicate`) |
| WP06-A84 | SuperAdmin | SA-09a | Send with no reason. Send a reason shorter than Core accepts. | C1: the error summary receives focus; "Give a reason." / Core's rule in words. Nothing is recorded. The other choices stay. | L | `core.grant_gate_exception` (`zReason`); AC-08 |
| WP06-A85 | SuperAdmin; test | SA-09a of a completed or withdrawn application, and of an application with an active post-restore protection mark (fixtures) | Render the page. Send by hand. | Completed or withdrawn: "An exception applies only to an open application." and no form. Protection mark: "A SuperAdmin must resolve the protection mark of this application first." with the route, and no form. Each hand-made send is refused with the same words. | T | `gates.ts` (`application_not_open`, `protection_mark_active`) |
| WP06-A86 | SuperAdmin | SA-09a and the case page of P1 after §3 E4 | Read the exception. | The exception reads "Used" (state `consumed`). The time and the act it was used for show only when a read returns them (Q-09). It allows nothing more. A later reassignment of an unpaid application needs a new exception (A56). | L | `assignment.ts` (`consumeException`: single use) |
| WP06-A87 | SuperAdmin; test | SA-09a and SA-03a of an application whose recorded exception is past its expiry (clock fixture) | Render SA-09a. Assign by hand. | SA-09a shows "Expired at [date time] IST" from the expiry the read returns, with the route of A83 (b). The assignment is refused: "The Gate 1 exception expired at [time] IST. Record the service payment, or revoke the exception and record a new one." The page states no lifetime of its own ("24 hours" never appears). | T | `controls.ts` (`gate_exception_expired`); `config.ts` (lifetime); WP-01 Q-13; Q-09 |
| WP06-A88 | SuperAdmin | SA-03a of P1 after §3 E2 (payment recorded "Not received" after the grant); a fixture whose granting SuperAdmin is no longer active | Assign P1. Assign the fixture by hand. | P1: refused: "The Gate 1 exception was recorded on a payment status that has changed since. It no longer passes Gate 1." with the A83 (b) route. Fixture: refused: "The SuperAdmin who recorded the exception is no longer active." Nothing is recorded. | L (P1) + T | `controls.ts` (`gate_exception_stale`, `gate_exception_grantor_inactive`); BS B26 ("fresh") |
| WP06-A89 | SuperAdmin, operator (`operator-1`) | Existing operator case page of C after §3 V06-8; SA-09g `gate1_first_work` for C | `operator-1` tries the first work (V06-11). `superadmin-1` opens SA-09g `gate1_first_work` and records the exception (V06-12). `operator-1` starts work. Fixtures: the same page with no assignment, and with work started. | The first work is refused for Gate 1, or "Start work" shows as unavailable with the Gate 1 reason; nothing is recorded. The operator's route to a SuperAdmin is a flag (`core.flag`, existing page); a flagged application shows in SA-02c and in SA-01 group 5 (`WP-06.md` §3 PM Q-05; L when the run flags, else T). SA-09g `gate1_first_work`: `h1` "Gate 1 exception for the operator's first work: [applicant]"; scope "the first work of the assigned operator on the current assignment, once"; the effect adds that it does not allow a new assignment and that a reassignment makes it lapse. The receipt follows A103. Afterwards the first work is accepted. Fixtures: no assignment → "No operator is assigned yet. Decide the exception for assignment instead." and no form; work started → "The operator's work on this assignment has started. Gate 1 is not checked again for it." and no form. Approved help: A148. | L+T | Design §2.7.3, §6.3 V06-11 and V06-12; `WP-06.md` §3 (PM Q-05), D-06; BS B18, B26; `assignment.ts` (`requireGate1AtWork`) |
| WP06-A90 | SuperAdmin; harness; test | SA-09g; Core's evaluation of a Gate 2 action | (1) Look for a Gate 2 choice on SA-09g. (2) Harness: post the grant with gate "Gate 1" and the Gate 2 action. (3) Test with every prerequisite of the government act set up: an unpaid TravelMudra-filed application assigned under a Gate 1 exception, the operator's first work started on a first-work exception, readiness recorded by the assigned operator; evaluate the authorization of the government fee payment and of the submission. | (1) SA-09g carries the gate and the action as hidden fields of its own kind; there is no Gate 2 choice. (2) Refused: "This gate cannot be excepted for this action." Nothing is recorded. (3) Core's evaluation holds the Gate 2 blocker, and no blocker that the set-up should have removed; the used Gate 1 exceptions are not used again; Gate 1 never counts for Gate 2. The test asserts the Gate 2 blocker itself, not only that the act is refused. | L ((1), (2)) + T ((3)) | `WP-06.md` D-12 (review R-12); design §2.10, §6.3 V06-18; BS B27; `gates.ts` (`SCOPE`) |
| WP06-A91 | SuperAdmin; test | SA-09 for a control that has no exception (mandatory validation, fixed cut-off, exposure ceiling; fixture addresses) | Render the page. | "No exception exists for this control." with the evidence owner and the route to correct the evidence; no form. No page has one "Override" or "Admin override" control for every blocker. | L (absence) + T | PL SA-09 ("Non-overridable controls … no form"); UX §6.3; BS B20; UX §12 V08 |
| WP06-A92 | SuperAdmin, two SuperAdmins | SA-09a of P5 before its payment (§3 H0) | `superadmin-1` opens SA-09a and writes a reason. `superadmin-2` records "Received" on SA-07a. `superadmin-1` sends. | Refused with the current facts: "Gate 1 is met now: the service payment was recorded as received." (or C5 "Changed since your review" when the application revision changed). Nothing is recorded. | L | `gates.ts` (`gate_not_blocking`, `expectedRevision`); UX §3.3 |
| WP06-A93 | SuperAdmin; harness | SA-09a, the Nth time | Replay terms 1 to 6 on the E1 grant. For term 4, send the reloaded page's form if one shows. | (1), (2): one exception; the same receipt. (3): same key with another reason: refused as a used form; values kept; nothing recorded. (4): the reloaded page shows the recorded exception with "Revoke" and no form (A83 a); a hand-made new key is refused as a duplicate and leaves no record. (5): A84 then a valid reason: one exception. (6): C4; no new grant is offered there. | L+T | PL §7 K-STD; BS B35; W1 A-02 |
| WP06-A94 | Phone user, SuperAdmin | SA-09a at 390 px | Open the page. Review. | Full-screen page. Scope, evidence, effect and hard stops come before the reason field; the consequence review and the final button are at the end. No horizontal page scroll. | L | PL SA-09 (Mobile: "scope and effect before fields"); UX §7.3 |
| WP06-A148 | SuperAdmin, operator; test | Fixture: an unpaid draft with approved help, assigned under a Gate 1 exception for assignment, operator work not started; SA-09g `gate1_first_work` of it and SA-02b | The operator tries the first approved-help entry. The operator tries to flag a SuperAdmin. Read SA-09g `gate1_first_work` and SA-02b. Record the first-work exception; the operator enters again. | The first entry is refused for Gate 1. The flag is refused (Core accepts a flag only on an assigned case in ordinary work), so the application shows in no Flags row. SA-09g `gate1_first_work` and SA-02b show the known gap: an operator who works on approved help cannot raise a Gate 1 stop to a SuperAdmin from the product; after approved help is assigned on an unpaid application, the SuperAdmin checks Gate 1 for the first work on SA-09g. After the exception the entry is accepted. The gap stays open until P-10 f is served. | L (notice text) + T | `WP-06.md` D-06 (review R-06), P-10 f; design §2.2.2, §2.7.3 |

### 2.7 SA-09 Revocation of a Gate 1 exception

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP06-A95 | SuperAdmin (`superadmin-2`) | SA-09r `/admin/applications/:id/decide/revoke_exception/:gex` of A's exception (§3 V06-14) | Read the page. Send with no reason. | `h1` "Revoke a gate exception: [applicant]". Scope: "Exception [reference] · Gate 1 · for assignment". Evidence: state, "Expires [time] IST", service payment now, operator now; "Who granted it and why: in the audit history" (the read holds no grantor, time or reason). Effect for a Gate 1 exception: "After you revoke it, assignment needs the service payment recorded, or a new exception. Nothing else changes: an assignment already made stays, and no payment record changes." (the effect text follows the recorded gate: A151). "Reason for revoking" (required). Visible review; buttons "Revoke the exception" and "Cancel". No reason: C1; nothing is recorded. An exception id that is not this application's: the uniform not-found page. | L | Design §2.7.4; `WP-06.md` D-08; CC `core.revoke_gate_exception` |
| WP06-A96 | SuperAdmin (`superadmin-1`) | SA-09b of a usable exception for P5 (§3 H0) | Revoke with a reason. Then assign P5 by hand (harness) before its payment. | C3: "Gate 1 exception revoked", with the request reference; the exception reads "Revoked" (Current); the revoker and the time show only when a read returns them (Q-09). The assignment is refused for Gate 1 (as A32). | L | BS B20, B26; `gates.ts` (`revoke`) |
| WP06-A97 | SuperAdmin; harness | SA-09b of a used exception (A86), and of a revoked exception | Open each page. Harness: revoke each by hand. | No form. The page shows the state ("Used" / "Revoked"). Each hand-made revocation is refused: "This exception is no longer open: [state]." Nothing is recorded. | L+T | `gates.ts` (`stale_revision` when not `granted`) |
| WP06-A98 | SuperAdmin (`superadmin-1`) | SA-09b of P1's unusable exception (§3 E3) | Revoke it with a reason. Open SA-09a for P1. | C3 as A96. SA-09a now shows the form for a new exception (the A83 (b) state is gone). | L | Q-09 |
| WP06-A99 | SuperAdmin (`superadmin-2`) | SA-09b of P4's exception that `superadmin-1` recorded (§3 H0) | Revoke it. | Core decides who may revoke (every active SuperAdmin at 9efb379). When accepted, the receipt names this exception and the page shows "Revoked". The recording and the revoking SuperAdmin show on the page only when a read returns them (Q-09); the audit keeps both actors (BS B33). | L | BS B11, B33 (actor recorded) |
| WP06-A100 | SuperAdmin; harness | SA-09b, the Nth time | Replay terms 1 to 6 on the A96 revocation. | (1), (2): one revocation; the same receipt. (3): same key with another reason: refused as a used form; nothing recorded. (4): the reloaded page shows "Revoked …" and no form; a hand-made new key is refused as A97 and leaves no record. (6): C4; no new revocation is offered there. | L+T | PL §7 K-STD; BS B35 |
| WP06-A101 | SuperAdmin; test | SA-09b and SA-03a at the same moment (two SuperAdmins, test) | One SuperAdmin revokes an unused exception while the other assigns with it. | Exactly one wins: either the assignment is accepted and the exception is used (the revocation is refused as A97), or the revocation is accepted and the assignment is refused for Gate 1. Never both. | T | BS B35 ("guard all competing mutators"); `assignment.ts` (`consumeException`) |
| WP06-A151 | SuperAdmin; test | SA-09r for exceptions of each recorded gate: Gate 1 for assignment (§3 V06-14); Gate 1 for the first work (fixture); the readiness gate and Gate 2 (fixtures, recorded through the carried form) | Read the effect text of each. | The effect text follows the recorded gate and action. Gate 1 (assignment or first work): "[action] needs the service payment recorded, or a new exception." Readiness gate: the action needs the new operator's readiness judgment, or its own permitted readiness exception; the text never names the service payment. Gate 2: the government commitment needs the current service payment or its own Gate 2 decision; a Gate 1 exception never passes it. Each effect says that nothing else changes. | L (Gate 1) + T | `WP-06.md` D-08 (review R-08); design §2.7.4 |

### 2.8 Command results, access and shell on WP-06 pages

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP06-A102 | SuperAdmin | Every WP-06 page | Read the shell. | Environment label; "[TEST]" title prefix; rail current item: "Home" (SA-01), "Work queues" (SA-02, SA-03 and SA-09 opened from a queue), "Money & exposure" (SA-07a opened from the rail); breadcrumb; one `h1`; freshness line where the page shows read facts. | L | PL §2.1, §2.2; WP01-A07 |
| WP06-A103 | SuperAdmin; harness | Every accepted WP-06 command; edited receipt addresses | Read each receipt. Open edited receipt addresses: a grant operation with `done=revoked`; an assignment with `done=reassigned`; a payment record with `done=corrected`; the key of another application's operation. | A receipt names the command only when the operation's resource, the returned id and the summary establish it (design §2.8 as amended). Where they cannot, the receipt reads "Request recorded" with the request reference and shows the current state labelled "Current" (D-02). This applies to a grant and a revocation (same result shape), to an assignment and a reassignment (same shape), and to a payment record and a correction unless the returned entry's own kind establishes it. Where another row of this checklist quotes a receipt title (A35, A53, A66, A71, A96), this rule governs. The plan receipt shows counts only (D-01, A38). An edited address never shows the wrong command's title; the key of another application's operation: "Request reference [key]. The receipt cannot be checked now." No accepted time (P-02, re-raised as P-10 b). | L+T | `WP-06.md` D-01, D-02, P-10 a and b; review R-01, R-02; W1 A-04; W2 B-02; W3 C-03 |
| WP06-A104 | SuperAdmin | Each command of §1.2 with a lost acknowledgement (fixture); a command that Core refused | Inject the fault. Open the operation status page. Select "Check status" after the original resolves. Open the status page of a refused send's key. | C4 (CMP-13): "Checking the original result" and "Check status"; no new send of the same intent is offered there. "Check status" reads the same operation and shows its accepted result. A refused send leaves no operation record: its status page says "Nothing is recorded for request [reference] so far" and claims neither acceptance nor refusal. A refusal, and any stale comparison, shows only on the re-rendered form. | T | PL §1.1 UNR; BS B35; W1 A-08 |
| WP06-A105 | SuperAdmin; harness | Each command of §1.2 | (1) Identical replay after acceptance (same key, same content). (2) Same key, different content. (3) Business duplicate: a new key and the current revision (read from a fresh page) for an intent that Core already holds. (4) Raw stale envelope: a new key with the revision of an older page. (5) Raw resend of a refused envelope after the facts changed (for example a refused unpaid assignment sent again after the payment was recorded). | (1) The original result. (2) Refused as a conflict; nothing recorded. (3) The command's own check answers: assign "Another SuperAdmin assigned this application first: [operator]."; plan: each already assigned item is not assigned, or the whole plan is refused; reassign to the current operator: refused, operator not assignable; grant: "already open"; revoke: "no longer open"; payment record: "already recorded as received"; correction: "only the current entry" or "changes nothing". (4) `stale_revision`: CMP-14 with the current facts (for a plan, per item "Changed since your preview"); this is not the business duplicate check. (5) The refused key has no record, so Core evaluates the envelope again: it can be accepted when the facts now allow it (an assignment after the payment was recorded, when the application's revision did not change), or refused again. A duplicate test uses (3), never (4) or (5). Browser Back is not a replay: it reloads the page with current facts (A44, A45, A57, A74, A93, A100). | T | `WP-06.md` D-12 (review R-12); PL §7 K-STD, K-BATCH; BS B35; design §3.3, §4.1 |
| WP06-A106 | SuperAdmin | Every refusal reachable on `lane-ui` in A13 to A101 | Read each message. | CMP-07 with the reason in words and the owner or route where one exists. A message is never a code alone; where a text is missing, the code itself shows with a plain sentence (SC §3.4, UAT-13 pattern). No "Something went wrong" or "Invalid data". | L | PL §1.1 REJ, §11.1; CR-01; SC §3.4 |
| WP06-A107 | — | Text map of every reason code that SA-01, SA-02, SA-03, SA-07 and SA-09 can show | Check the map against the reason vocabulary. | Each code has SuperAdmin text or falls back to the code: `gate1_payment_not_received`, `gate_exception_expired`, `gate_exception_stale`, `gate_exception_grantor_inactive`, `gate_exception_consumed`, `gate_not_blocking`, `gate_exception_not_eligible`, `already_assigned`, `assistance_not_approved`, `application_not_submitted`, `application_not_open`, `operator_not_assignable`, `assignment_changed`, `round_robin_plan_mismatch`, `assignment_batch_too_large`, `protection_mark_active`, `payment_evidence_required`, `payment_evidence_not_found`, `payment_entry_kind_invalid`, `correction_target_not_current`, `correction_no_change`, `stale_revision`, `withdrawal_accepted`, `outcome_already_recorded`, `conflict_operation_key`. No known code falls back to "This is not available at the moment." | T | CR-01; SC §3.4 |
| WP06-A108 | SuperAdmin | SA-01, SA-02, SA-03, SA-07a, SA-09 (HTTP tests with access revoked between the page's first read and an optional read) | Let an optional read answer an access, authentication, maintenance or support-view refusal. | The page renders the access page (SH-02, sign-in or maintenance), never the facts read earlier. Only an availability failure degrades a block to "Unavailable". No page code catches every error around a read. | T | LD-14 (C-02); PL §2.3 SH-R04 |
| WP06-A109 | SuperAdmin | SA-01, SA-02, SA-03, SA-07a, SA-09 | Look for operator and completion controls. | No "Confirm readiness", "Authorize filing", "File", "Release packet", "Send result", "Request completion", "Force complete" or "Override" control. Assignment and Gate 1 receipts never say that the application is ready, filed or approved. | L | BS B18 ("A SuperAdmin cannot make that judgment or file"); UX §2.3, §12 V08, V15; PL §11.1 |
| WP06-A110 | SuperAdmin | Rebuilt pages and the old SuperAdmin case page | For each carried form, open an application where Core offers it: on SA-07a the "Not available in this release" notices (refund, fee exclusion); on the old case page the Gate 2 and readiness-gate exception form, the help decision and the flag response (WP-09), the deferral decision (WP-17), and the other forms the page has today. Check that the WP-06 forms have left the old case page. | Each carried form keeps its markup, fields, action and success redirect, and works as before. The old case page's gate-exception form offers only the Gate 2 and readiness-gate values. The Gate 1 values, the assign and reassign forms and the revoke cells have left it; links replace them ("Assign an operator" or "Reassign", "Gate 1 exception for assignment", "Gate 1 exception for first operator work", "Revoke" per open exception). A unit test lists the carried forms by action path. The payment correction is not carried: WP-06 builds it (A65, A71). | L+T | Design §1.5, §7.2; `WP-06.md` §3 (Q-W06-02, PM Q-04, PM Q-11); LD-02; LD-07 |
| WP06-A111 | SuperAdmin | Every WP-06 page | Read all visible text. | No forbidden label of §11.1 ("Override", "Admin override", "Approved" or "Done" as an overall status, "Ready" as a universal state, "Pay now", "Force complete"). No "Collected" or "Settled" for a closed follow-up. Times carry IST. Counts name their unit. Synthetic offerings carry the synthetic label. | L | PL §11.1; CR-03, CR-06, CR-07, CR-08 |
| WP06-A112 | Operator (`operator-1`); SuperAdmin in a support view (test) | SA-03a, SA-07a, SA-09a addresses; their form actions | Operator: open the addresses; harness sends a payment entry and a grant with the operator's session. Support view: render the pages and post a form. | Operator: SH-02 identical to not found; each send is refused; nothing is recorded. Support view: the support-view refusal ("End the support view to use SuperAdmin pages") and no form; a post is refused. | L (operator) + T (support view) | BS B10, B11; PL §2.3 SH-R02, SH-R09; RM §1 (support view on `/admin`) |
| WP06-A113 | SuperAdmin | SA-03, SA-07a, SA-09 | Inspect `localStorage`, `sessionStorage` and IndexedDB after using the pages. Read the cache headers. | No applicant data, payment reference or reason is kept in browser storage. Signed-in pages send `no-store`. | L+T | PL §2.3 SH-R12 |

### 2.9 Accessibility (AC-01 to AC-28 that apply)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP06-A114 | Keyboard-only SuperAdmin | §3 V06-5 to V06-17 at 1440 px; V06-6 and V06-7 at 390 px | Use the keyboard only. | Every step works with Tab, Shift+Tab, Enter, Space and Escape: change the tab, set the filter, tick rows, choose the mode and the operators, preview, remove a row from the plan, confirm, choose an operator, fill the evidence rows, review and record a decision, revoke. Without JavaScript the selection still works (the selection line names the next page). No action needs a mouse, hover or drag-and-drop. | L | Design §4.7, §5; AC-01, AC-12 |
| WP06-A115 | Keyboard-only user | Every WP-06 page at 1440 and 390 px and at 400% zoom | Tab through the page. | Focus is visible (at least 3:1) and never hidden by the top bar, the rail or the selection bar. | L | AC-02 |
| WP06-A116 | Phone user | SA-01, SA-02, SA-03, SA-07a, SA-09 | View at 320 px, and at 1280 px with 400% zoom. | No two-dimensional page scrolling. Wide tables scroll only inside a labelled region, or become cards. Application identity, reason, owner and next action come before secondary data. | L | AC-04, AC-21 |
| WP06-A117 | Any | Every WP-06 form | Inspect each input. | Each input has a visible label. Each selection checkbox is labelled with the applicant and the reference. Each evidence row's kind and value are labelled with the row number. The operator choice and the round-robin order controls are labelled. The reason fields state that they are required. | L | AC-05, AC-15 |
| WP06-A118 | Any | Gate 1 and Gate 2 rows, per-item plan results, exception states | View in greyscale. | Each state has text (and an icon where the plan shows one). No state is shown by colour alone. | L | AC-06 |
| WP06-A119 | Any | Every WP-06 form | Send each form with an error. | Focus moves to the error summary. Each summary link moves focus to its field or, for a plan, to the application's row. Entered values stay. | L | AC-08; CMP-07 |
| WP06-A120 | Screen-reader user | Receipts, selection bar, view changes, plan results | Read with VoiceOver or NVDA. | Receipts are announced politely without moving focus. A selection change announces "Selected on this page: [n] applications". A view change announces "[n] applications shown" without moving focus. | L | AC-09, AC-16 |
| WP06-A121 | Screen-reader user | Each unavailable action: assign without Gate 1 (A32), grant when not blocking (A82), revoke when not open (A97), plan with a problem (A41) | Focus the control or the notice. | The reason is exposed (`aria-describedby`, or the notice in reading order). A role-forbidden action is not shown at all. | L | AC-13; CMP-10; PL §2.3 SH-R08 |
| WP06-A122 | Phone user | Every WP-06 page at 390 px | Measure each control. | Every control is at least 24 × 24 CSS px. Primary actions ("Assign to …", "Assign [n] applications", "Reassign to …", "Record service payment", "Record Gate 1 exception for …", "Revoke Gate 1 exception") are at least 44 × 44 CSS px. | L+T | AC-10 |
| WP06-A123 | — | Every WP-06 page | Measure contrast of text, focus, status labels and notices. | Normal text at least 4.5:1. Non-text indicators and focus at least 3:1. | L+T | AC-11 |
| WP06-A124 | Any | Long names; reduced motion | Use an applicant with 60-character surname and given names, a 120-character group name and a long operator name (fixture or run data). Turn on "reduce motion". Open the consequence review. | Names wrap without hiding identity. A truncated text has a full form that keyboard and touch reach. No transition plays. | L | AC-14, AC-20 |
| WP06-A125 | Screen-reader user | SA-02 views, SA-03b plan, SA-07a entries | Inspect the tables. | Header cells exist. A table that scrolls is a labelled region. | L | AC-15; AC-04 |

### 2.10 axe checks (WCAG 2.2 A/AA)

Rule for every row: run axe (`@axe-core/playwright` 4.13.0, tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`,
`wcag22aa`) at 1440 × 900 and at 390 × 844. Expected: no violation of impact "serious" or "critical" at either width.
Record the counts of minor and moderate violations. The harness takes no screenshot of a page that shows a real
person's data; WP-06 uses synthetic data only.

| ID | Persona | Page (state) | Where | Source |
|---|---|---|---|---|
| WP06-A126 | SuperAdmin | SA-01 with decision groups (A02) | L | UX §7.5; AC-01 to AC-28 |
| WP06-A127 | SuperAdmin | SA-01 with one group "Unavailable" (A06) | T (fixture page) | same |
| WP06-A128 | SuperAdmin | SA-02 Submitted unassigned with two rows selected (A14, A22) | L | same |
| WP06-A129 | SuperAdmin | SA-02 Assignment and reassignment with a help row (A17) | L | same |
| WP06-A130 | SuperAdmin | SA-02 Help requests (A18) | L | same |
| WP06-A131 | SuperAdmin | SA-02 empty view (A24) | L (or T) | same |
| WP06-A132 | SuperAdmin | SA-03a with the Gate 1 boundary (A32) | L | same |
| WP06-A133 | SuperAdmin | SA-03b plan with an ineligible application (A37) | L | same |
| WP06-A134 | SuperAdmin | SA-03b per-application receipt (A38) | L | same |
| WP06-A135 | SuperAdmin | SA-03b round-robin plan (A40) | L | same |
| WP06-A136 | SuperAdmin | SA-03a stale comparison (A36) | L | same |
| WP06-A137 | SuperAdmin | SA-03c reassignment review (A52) | L | same |
| WP06-A138 | SuperAdmin | SA-03c receipt (A53) | L | same |
| WP06-A139 | SuperAdmin | SA-07a with entries, a correction and an open follow-up (A71, A72) | L | same |
| WP06-A140 | SuperAdmin | SA-07a form with the error summary (A67) | L | same |
| WP06-A141 | SuperAdmin | SA-07a stale comparison (A73) | L | same |
| WP06-A142 | SuperAdmin | SA-09a decision with the consequence review open (A80) | L | same |
| WP06-A143 | SuperAdmin | SA-09a receipt (A81) | L | same |
| WP06-A144 | SuperAdmin | SA-09a without a form: not blocking (A82) and unusable exception (A83 b) | L | same |
| WP06-A145 | SuperAdmin | SA-09b revocation decision (A95) | L | same |
| WP06-A146 | SuperAdmin | Operation status page of a WP-06 command, accepted and "Nothing is recorded" (A104) | L | same |

## 3. Proof scenario V06

V06 (UX §12): "Unpaid submitted case is visible in assignment queue, but assignment/help/operator work requires Gate 1
or fresh exception. Gate 2 remains separate." Authority B18, B26, B27. One recipe: the design's §6 (§0.4). Steps
V06-1 to V06-20 are the design's; steps with a letter (V06-4a, …) add checks that this checklist needs, on the same
applications and operators. Operator writes (first work) and the help decision run through the existing pages as
set-up (Q-W06-10).

| Step | Actor, page | Action | Observable result | Items | Where |
|---|---|---|---|---|---|
| V06-0 | `superadmin-1`, SA-01, SA-02a, SA-02b | Before the set-up, read the counts. | The run record holds group 2 (and its payment lines), group 4 and group 11 of SA-01 and the row counts of SA-02a and SA-02b. | A03 | L |
| Set-up | Harness as `syn-ta-1`, TA pages | §0.4 | A, B and C submitted ("Service payment: Not recorded" on TA-07); D a draft with an open help request. | — | L |
| V06-1 | `superadmin-1`, sign-in | Sign in. | Lands on `/admin`. Group 2 = baseline + 3, "not received or not recorded" + 3; group 4 = baseline + 1. | A01, A03 | L |
| V06-2 | SA-02a | Read. | A, B, C in "Waiting for an operator" with "Service payment (Gate 1): Not recorded"; applicant links to the case page. | A14 to A16 | L |
| V06-3 | SA-03a for A | Open. | The Gate 1 notice with the two routes; no form; "Assign" shown unavailable with its reason. | A32 | L |
| V06-4 | Test | Hand-made `core.assign` for an unpaid application without an exception. | Refused for Gate 1; no assignment; no operation record. | A32 | T |
| V06-4a | SA-07a for A | Send the refused evidence cases. | Each refused on its field; nothing recorded. | A67, A68 | L |
| V06-5 | SA-07a for B | Record "Payment received" with `SYN-V06-[stamp]-B`. | Receipt per A103; Current "Gate 1 for assignment: Passed"; Gate 2 on its own row. | A63, A65, A66 | L |
| V06-5a | SA-07a for B | Correct the amount with a reason. Then the refusals of A70 and the date-only correction. | "Entry 2 corrects entry 1"; each refusal as Core answers; nothing more recorded. | A70, A71, A149 | L |
| V06-6 | SA-09g `gate1_assignment` for C | Read; write a reason; record. | Scope, evidence, effect and hard stops before the reason; receipt "Request recorded" with the open exception (Current) and "This exception does not pass Gate 2."; SA-07a of C "Gate 1 for assignment: Passed by exception". | A64, A80, A81 | L |
| V06-7 | SA-02a → SA-03b | Select A, B, C; "One operator…"; tick `operator-1`; preview; try "Remove … from the plan" and go back. | "Assignable now: 2 of 3"; A "Not now: …" with routes; the re-check text. | A22, A37 | L |
| V06-8 | SA-03b | Confirm. | Receipt "Assigned: 2", "Not assigned: 1"; Current: B and C with `operator-1`; A still waiting; C's exception "Used". | A38, A86 | L |
| V06-9 | Harness | Send the confirm again (same `_op`, same fields). | The same result address and counts; one assignment each (SA-03a of B and C). | A45 | L |
| V06-10 | SA-07a for C | Read. | "Service payment: Not recorded"; "Gate 1 for assignment: Blocked"; one payment-missing follow-up owned by `superadmin-1`; Gate 2 on its own row. | A64 | L |
| V06-11 | `operator-1`, existing operator page of C | Try the first work. | Refused for Gate 1 (or "Start work" unavailable with the reason); nothing recorded. | A89 | L |
| V06-12 | `superadmin-1`, SA-09g `gate1_first_work` for C | Record. Then `operator-1` starts work. | Receipt per A103; the first work is accepted. | A89 | L |
| V06-13 | SA-07a for C | Record "Payment received". | The receipt states Core's number of follow-ups closed by this entry; they read "Closed by a service entry". | A75 | L |
| V06-14 | SA-09g and SA-09r for A; SA-07a for A | (1) `superadmin-1` records an exception for assignment. (2) Record "Not received" for A with an attestation; open SA-03a and SA-09g for A; the harness posts a new grant. (3) `superadmin-2` revokes the exception with a reason. | (1) "Already open" (a). (2) SA-03a: the stale sentence; SA-09g: state (b); the new grant refused as already open. (3) Revocation accepted; the receipt follows A103; SA-03a shows the Gate 1 notice again; SA-09g shows the form again. | A69, A83, A88, A95, A96, A98, A99, A151 | L |
| V06-15 | Old case page of D (carried WP-09 form) | Approve D's help request. | Accepted while D's payment is "Not recorded" (D has no operator). SA-02a lists D under "Waiting for an operator" as approved help, "Not recorded"; SA-03a for D shows the Gate 1 notice. | A17, A18, A29 | L |
| V06-15a | SA-07a and SA-03a for D | Record "Not received" with every evidence row; the harness posts one row too many; record "Payment received"; assign D to `operator-2`. | All rows in the entry; the extra row refused; D stays a draft after the payment; D assigned for approved help. | A47, A77, A150 | L |
| V06-16 | `superadmin-1` and `superadmin-2`, SA-07a, SA-09g and SA-03a for A | `superadmin-1` opens SA-07a of A (choose "Not received") and SA-09g of A (write a reason). `superadmin-2` records "Payment received" for A. `superadmin-1` sends both. Then both open SA-03a for A; `superadmin-1` assigns `operator-2`; `superadmin-2` assigns `operator-3`. | The payment form: C5. The grant: refused, Gate 1 does not block now. `superadmin-2` sees CMP-14 "Operator: yours `operator-3` / current `operator-2`"; one assignment. | A30, A31, A35, A36, A44, A73, A92 | L |
| V06-17 | SA-03c for B | Reassign to `operator-2` with a reason. | The preview with current, possibly incomplete duty lists, originals unchanged, readiness to record again; receipt per A103; `operator-1` gets SH-02 on B's address. | A52, A53, A58, A59, A62 | L |
| V06-17a | SA-07a for B | Correct "Payment received" to "Not received" with a reason. | "Follow-up opened: yes"; the assignment stays. | A72 | L |
| V06-17b | SA-03c and SA-09g for B | Reassign B to `operator-3`. Record a Gate 1 exception for assignment. Reassign again. | First refused for Gate 1; then accepted; the exception "Used"; a follow-up open. | A56 | L |
| V06-18 | Test | Gate 2 with every prerequisite set up (A90 (3)). | The Gate 2 blocker is present; the Gate 1 exceptions are not used again. | A90 | T |
| V06-19 | Test | A plan row paid between preview and confirm; an operator suspended between preview and confirm. | As design §4.4: the paid row is assigned at confirm; rows to the suspended operator are not assigned (selection mode: the whole plan refused). | A43 | T |
| V06-20 | axe | Every WP-06 page visited. | No serious or critical violation at 1440 px and 390 px. | A126 to A146 | L |

Proof split: V06 passes when V06-0 to V06-3, V06-4a to V06-17b and V06-20 pass on `lane-ui` at the integrated
WP-06 commit, and V06-4, V06-18 and V06-19 pass as named tests at the same commit. The run record names the
`lane-ui` ref, the stamp, each test, the identifiers (internal record only) and every delta.

## 4. Scenario parts outside the V06 proof (traceability)

| Scenario part | Where it is proven |
|---|---|
| V08: the operator's readiness checklist separates ordinary readiness, an allowed exception, missing evidence and a non-overridable cut-off or ceiling | WP-07 (OP-02, OP-04). WP-06 proves the SuperAdmin side: A80, A81, A91, A109. |
| V08: Gate 2 decisions and the exposure ceiling | WP-07 (SA-07 Gate 2 route and ceiling, SA-09 Gate 2) |
| V15: explicit bounded delivery ownership when no operator is assigned | Not in WP-06: fallback delivery ownership is OWNER CHOICE PENDING (PL SA-02); WP-08 and WP-19 show the boundary |
| V15: ownerless work is owned through SuperAdmin assignment; no SuperAdmin filing, readiness or completion-request control | WP-06: A17, A61, A109 |
| V07: the reassigned operator reconfirms readiness | WP-06 shows the flag (A52, A60); the reconfirmation itself is WP-07 |
| V18: reassignment does not move custody | WP-06: A61 (test); the originals register is WP-12 |

## 5. Out of scope and boundaries

These MUST NOT appear on any WP-06 page:

- An assignment, reassignment, help work or operator work without a received service payment or a fresh Gate 1
  exception for that application and action (BS B18, B26).
- One "Override" or "Admin override" control for every blocker; an exception form for a mandatory validation, a
  fixed cut-off or the exposure ceiling (BS B20; UX §6.3).
- A Gate 1 exception that claims a payment, the travel agent's authority, readiness or Gate 2; a receipt that says
  "paid", "approved" or "ready" for an exception (BS B20, B27).
- A group assignment, an automatic assignment rule, or a selection that includes rows the SuperAdmin did not see
  (BS B19; UX §3.3).
- An edited or deleted payment entry; a gateway, "Pay now", refund, write-off or fee-formula control; "Collected",
  "Paid" or "Settled" for a closed follow-up (BS B26, B29, B43).
- A SuperAdmin filing, readiness, packet release, send or completion-request control (BS B18; UX §2.3).
- A Gate 1 state, eligibility or permission computed by the page instead of read from Core; a plan item assigned to
  an operator that the plan did not show (PL §6; BS B35).
- A count shown as "0" when it is unknown, a list that hides its row limit, an age or deadline that no read returns
  (D7; CR-03).
- Earlier facts on a page after an optional read was refused for access (LD-14).
- A receipt that names a result the operation does not return, or an accepted time (C-03; P-02).
- An exception lifetime, plan limit or round-robin limit stated by the page itself (WP-01 Q-13).

Deferred in WP-06 (each item says where it lands; the run record lists them as "Deferred"):

- Per-row Gate 1 exception state on SA-02 (Q-06): the row shows the payment fact and Core's reason; the plan shows
  eligibility.
- SA-02 row facts that no authoritative read returns: travel agent name, waiting time ("since"), incident flags
  (Q-08).
- SA-01 groups without a read and the ages of items other than the oldest payment-missing follow-up (Q-07).
- SA-02 views "Dependency waits" and "Delivery and closure ownership" (PL SA-02): WP-10 and WP-19; fallback delivery
  ownership is OWNER CHOICE PENDING.
- Reassignment preview facts that no read returns (Q-02): A52 is partly met until served.
- Naming of refused applications in a batch receipt from the operation alone (Q-03): A38 is partly met until served,
  per the architect's decision.
- The reason why a recorded exception does not pass Gate 1 now (expired, stale, grantor inactive) on SA-09a (Q-09).
- The accepted time in receipts (P-02).
- Decision forms of other SA-09 kinds: help (WP-09), flag response (WP-09), deferral (WP-17), intake issue dismissal
  (WP-18), Gate 2 (WP-07), readiness gate after reassignment (Q-04); each stays reachable as it is (A110).

Not in WP-06 (later packages):

- SA-04 oversight rebuild (search, full history, correction from evidence, unresolved completion): WP-11 and later;
  the case page keeps its read part and carried forms.
- SA-07 finance overview, exposure, ceiling and Gate 2 route (WP-07); follow-up list, owner reassignment, government
  fee facts, parked money actions (WP-16).
- OP-01 to OP-04 (WP-07): the operator's "Start work" is used only as set-up and observation (Q-10).
- SA-08 incidents and audit; the Monitors content (WP-14).

## 6. Questions for the architect (ranked)

| ID | Rank | Question | Concrete scenario | PM recommendation |
|---|---|---|---|---|
| Q-01 | P1 | Is `core.reassign` in WP-06? CC §3 and UI-PLAN §12.2 put it in WP-12 ("SA-03 (reassignment preview)"); the brief puts the reassignment preview into WP-06's SA-03. | WP-06 integrates SA-03 without reassignment. An operator is suspended (WP02-A96 says each duty needs audited reassignment through SA-03); the SA-02 row says "Reassign" and the rebuilt case page has no reassign form, or the old form stays beside the new page with different words. Likelihood: high once an operator is suspended. | Build reassignment in WP-06 on SA-03c (one page family, same operator choice and receipt rules) and move the CC row to WP-06. WP-12 adds the custody facts of the originals register to the review. A51 to A62 assume this. |
| Q-02 | P1 | Core has no reassignment preview read. The duties that move (open holds, possibly-filed acts, incidents owned by the previous operator or by a stand-in reviewer) are computed inside `core.reassign`; the result returns only the new assignment id; the custody holder needs the originals read. | The page lists duties from its own reads and misses an incident that a stand-in reviewer owned; the SuperAdmin reassigns believing nothing else moves, and the new operator finds an incident they did not expect. Or the page shows nothing and A52 fails. Likelihood: medium. | Kind 1 request: `core.reassignment_preview` (current operator, the duties Core would move by its own rule, readiness effect, custody holders), and the moved duties in the reassignment result summary. Until served: the review shows the facts the reads return, labelled "Current", plus "Core moves every unresolved duty of this application to the new operator"; A52 and A53 are partly met. |
| Q-03 | P1 | The batch result of `core.assign_selection` keys each item by its position (`item0`, `assignment0`), not by application. C-03 forbids a receipt that names a result the operation does not return. | After a round robin of 20 applications, the receipt page shows "Not assigned: Gate 1" against the wrong applicant because it maps positions from an edited address; the SuperAdmin records a payment for the wrong application. Likelihood: low, harm high. | Kind 1 request: the summary carries the application id per item. Until served: the receipt address carries the opaque application ids in the posted order; the page shows per-application lines only when the count of ids equals the operation's item count and each assigned line's assignment id matches the application's current read; otherwise it shows the counts only ("[n] assigned, [m] not assigned") with "Open the queue". A38 is partly met until served. |
| Q-04 | P1 | Which SA-09 kinds does WP-06 build? Core's one grant command covers Gate 1 (assignment; start of operator work), Gate 2 (WP-07) and the readiness gate after reassignment (no package named). Today one generic form on the case page posts any gate and action. | WP-06 rebuilds SA-09 for Gate 1 only and removes the generic form: a readiness-gate exception after a reassignment cannot be recorded until a later package. Or WP-06 keeps a free gate select: the "one override for every blocker" pattern that UX §6.3 forbids. Likelihood: high, because WP-06 touches that form. | One SA-09 kind per (gate, action) pair. WP-06 builds the two Gate 1 pairs. The existing generic form stays on the case page as a carried form for Gate 2 and the readiness gate, labelled per gate, until WP-07 (Gate 2) and the reassignment package (readiness gate); A110 lists it. |
| Q-05 | P1 | For an unpaid application Core checks Gate 1 twice: at the assignment and again at the first operator work on that assignment; each needs its own single-use exception. The UI-PLAN sketch shows one decision "assignment and operator work". After an assignment under an exception, Core's pending answer names the operator ("start operator work"), not the SuperAdmin. | The SuperAdmin records one exception and assigns. The operator's "Start work" is refused for Gate 1; the case waits on the operator in every queue, but only a SuperAdmin can unblock it; nobody sees the stop. Likelihood: high for every unpaid exception case. | SA-09 offers the two actions as separate decisions (A80). The assignment receipt and SA-07a say that operator work needs Gate 1 again (A46). Raise a Kind 1 request for a pending reason (owner SuperAdmin) while the first work on an assignment is blocked by Gate 1, so that SA-01 and SA-02 can list it. |
| Q-06 | P2 | `core.assignment_queue` returns the payment status per row but not whether a fresh Gate 1 exception exists. The projection `view_assignment_queue` holds a Gate 1 state (`passed`, `blocked`, `exception_granted`) but no query reads it. | The SuperAdmin records an exception and returns to SA-02; the row still says "Waiting for the service payment or a Gate 1 exception"; the SuperAdmin tries to record a second exception (refused as a duplicate). Likelihood: medium. | Interim: the row shows the payment fact and Core's reason; the plan (`core.assignment_plan`, authoritative) shows eligibility. Later: a query over the projection (with the lag form) or the Gate 1 state in the Core list entry (Kind 1, P2). |
| Q-07 | P2 | No Decision inbox read model exists. SA-01 must compose its groups from `core.assignment_queue`, `core.admin_queue`, `views.monitors`, `pay.finance_index` and others. "Permitted exceptions requested" has no Core concept (exceptions are recorded, not requested); "oldest item age" exists only for payment-missing follow-ups. | SA-01 shows a group "Exceptions requested: 0" that no read supports, or computes ages from list order. Likelihood: medium. | Compose SA-01 from existing reads; show a group only when a read gives it; list the missing groups and ages as deferred; send a Kind 1 request only if Max wants ages on SA-01. |
| Q-08 | P2 | SA-02 rows lack facts that the plan lists: travel agent name, age ("waiting since"), incident flags. The authoritative list entry has none of them. | A SuperAdmin cannot tell which travel agent an unpaid case belongs to without opening it, and cannot order work by waiting time. Likelihood: certain; harm low. | Show the facts the read returns; link the case page; list the gaps in the WP-06 record as one Kind 1 request (P2), as P-09 did for the travel-agent lists. |
| Q-09 | P1 | A recorded exception that has expired or gone stale keeps the state "granted" (no sweep changes it), and a new grant for the same gate and action is refused as a duplicate while it exists. No read says why the recorded exception does not pass Gate 1 now. The case read returns only id, gate, action, state and expiry: not the recording SuperAdmin, the reason, the time it was used or revoked, or who revoked it. | After the payment entry of §3 E2, the SuperAdmin tries to record a fresh exception and gets "already recorded"; SA-09a still lists an exception that does not work; the SuperAdmin cannot see that a revocation is needed. Likelihood: high after any payment entry or expiry. | SA-09a shows the recorded exception with its expiry and, when Gate 1 reads "Not met" while it is recorded, the route "Revoke it, then record a new exception" (A83 b, A98). Proposal to the orchestrator: Core either answers the freshness reason in the decision context read (Kind 1), or treats an unusable exception as no duplicate (a Core guard change, routed as a proposal). The same Kind 1 request adds the recording SuperAdmin, reason, used and revoked actor and time to the read; until then A86, A95, A96 and A99 show the state only. |
| Q-10 | P2 | V06 needs the operator's "Start work" (OP-02, WP-07) and the help decision (WP-09). Both run on existing pages. Are these L observations acceptable in WP-06, or must they be tests? | The proof stops at Part F because the existing operator page changes during WP-07 work. Likelihood: low. | Treat both as set-up and observation through the existing pages (as WP-03 did for assignment), plus the named test of A89; re-run Part F after WP-07 integrates. |
| Q-11 | P2 | Payment correction is WP-16 in UI-PLAN §12.2; the brief and CC ("same command corrects an entry") put it on SA-07a now. | WP-06 builds "Record" only; a wrong entry recorded during the proof cannot be corrected on the rebuilt page. Likelihood: medium. | Build record and correction together on SA-07a in WP-06 (one command, one form); WP-16 builds the rest of SA-07. Update the CC note. |

## 7. Sign-off

| Field | Value |
|---|---|
| Verified on (date, IST) | |
| Installation and ref (`uat.py status lane-ui` output: commit or tag) | |
| Lane commit of the tests named for `T` items | |
| Run tag and identifiers (internal record reference) | |
| Baseline values of §3 Part A and the deltas observed | |
| Browsers and versions | |
| Assistive technology used | |
| V06 result (parts A to J; where shown) | |
| Deferred items (reference each) | |
| Open findings (ID, rank, scenario) | |
| Signed by (role and name) | |

Result per item (Pass, Fail, Blocked, Partly met, Deferred or Not run; evidence reference; note):

| ID | Result | Evidence | Note |
|---|---|---|---|
| WP06-A01 | | | |
| WP06-A02 | | | |
| WP06-A03 | | | |
| WP06-A04 | | | |
| WP06-A05 | | | |
| WP06-A06 | | | |
| WP06-A07 | | | |
| WP06-A08 | | | |
| WP06-A09 | | | |
| WP06-A10 | | | |
| WP06-A11 | | | |
| WP06-A12 | | | |
| WP06-A13 | | | |
| WP06-A14 | | | |
| WP06-A15 | | | |
| WP06-A16 | | | |
| WP06-A17 | | | |
| WP06-A18 | | | |
| WP06-A19 | | | |
| WP06-A20 | | | |
| WP06-A21 | | | |
| WP06-A22 | | | |
| WP06-A23 | | | |
| WP06-A24 | | | |
| WP06-A25 | | | |
| WP06-A26 | | | |
| WP06-A27 | | | |
| WP06-A28 | | | |
| WP06-A29 | | | |
| WP06-A30 | | | |
| WP06-A31 | | | |
| WP06-A32 | | | |
| WP06-A33 | | | |
| WP06-A34 | | | |
| WP06-A35 | | | |
| WP06-A36 | | | |
| WP06-A37 | | | |
| WP06-A38 | | | |
| WP06-A39 | | | |
| WP06-A40 | | | |
| WP06-A41 | | | |
| WP06-A42 | | | |
| WP06-A43 | | | |
| WP06-A44 | | | |
| WP06-A45 | | | |
| WP06-A46 | | | |
| WP06-A47 | | | |
| WP06-A48 | | | |
| WP06-A49 | | | |
| WP06-A50 | | | |
| WP06-A51 | | | |
| WP06-A52 | | | |
| WP06-A53 | | | |
| WP06-A54 | | | |
| WP06-A55 | | | |
| WP06-A56 | | | |
| WP06-A57 | | | |
| WP06-A58 | | | |
| WP06-A59 | | | |
| WP06-A60 | | | |
| WP06-A61 | | | |
| WP06-A62 | | | |
| WP06-A63 | | | |
| WP06-A64 | | | |
| WP06-A65 | | | |
| WP06-A66 | | | |
| WP06-A67 | | | |
| WP06-A68 | | | |
| WP06-A69 | | | |
| WP06-A70 | | | |
| WP06-A71 | | | |
| WP06-A72 | | | |
| WP06-A73 | | | |
| WP06-A74 | | | |
| WP06-A75 | | | |
| WP06-A76 | | | |
| WP06-A77 | | | |
| WP06-A78 | | | |
| WP06-A79 | | | |
| WP06-A80 | | | |
| WP06-A81 | | | |
| WP06-A82 | | | |
| WP06-A83 | | | |
| WP06-A84 | | | |
| WP06-A85 | | | |
| WP06-A86 | | | |
| WP06-A87 | | | |
| WP06-A88 | | | |
| WP06-A89 | | | |
| WP06-A90 | | | |
| WP06-A91 | | | |
| WP06-A92 | | | |
| WP06-A93 | | | |
| WP06-A94 | | | |
| WP06-A95 | | | |
| WP06-A96 | | | |
| WP06-A97 | | | |
| WP06-A98 | | | |
| WP06-A99 | | | |
| WP06-A100 | | | |
| WP06-A101 | | | |
| WP06-A102 | | | |
| WP06-A103 | | | |
| WP06-A104 | | | |
| WP06-A105 | | | |
| WP06-A106 | | | |
| WP06-A107 | | | |
| WP06-A108 | | | |
| WP06-A109 | | | |
| WP06-A110 | | | |
| WP06-A111 | | | |
| WP06-A112 | | | |
| WP06-A113 | | | |
| WP06-A114 | | | |
| WP06-A115 | | | |
| WP06-A116 | | | |
| WP06-A117 | | | |
| WP06-A118 | | | |
| WP06-A119 | | | |
| WP06-A120 | | | |
| WP06-A121 | | | |
| WP06-A122 | | | |
| WP06-A123 | | | |
| WP06-A124 | | | |
| WP06-A125 | | | |
| WP06-A126 | | | |
| WP06-A127 | | | |
| WP06-A128 | | | |
| WP06-A129 | | | |
| WP06-A130 | | | |
| WP06-A131 | | | |
| WP06-A132 | | | |
| WP06-A133 | | | |
| WP06-A134 | | | |
| WP06-A135 | | | |
| WP06-A136 | | | |
| WP06-A137 | | | |
| WP06-A138 | | | |
| WP06-A139 | | | |
| WP06-A140 | | | |
| WP06-A141 | | | |
| WP06-A142 | | | |
| WP06-A143 | | | |
| WP06-A144 | | | |
| WP06-A145 | | | |
| WP06-A146 | | | |
| WP06-A147 | | | |
| WP06-A148 | | | |
| WP06-A149 | | | |
| WP06-A150 | | | |
| WP06-A151 | | | |
| V06 proof | | | |
