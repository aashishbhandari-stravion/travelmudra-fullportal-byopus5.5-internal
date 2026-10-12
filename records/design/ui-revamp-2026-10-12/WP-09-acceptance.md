# WP-09 acceptance checklist: Assistance and report a problem

| Field | Value |
|---|---|
| Lane | `ui-revamp-2026-10-12` |
| Work package | WP-09 Assistance and report a problem (UI-PLAN §12.2; lane PLAN §3) |
| Author | Principal Product Manager (Claude subagent), 13 October 2026 |
| Decision owner | Principal Technical Architect of the lane (LD-12) |
| Status | Draft. Step 1 of lane PLAN §3, written before the design. Not run. Where the later design names a path or a word differently, the design governs the name and this checklist keeps the observable result. |
| Product base | lane branch `ui-revamp-2026-10-12` at e9e96e3; internal records at a659b1a |
| Installation | `lane-ui`: edge http://127.0.0.1:4650 (travel-agent pages under test); staff http://127.0.0.1:4652 (operator and SuperAdmin pages under test, set-up through WP-06 and WP-07 pages) |
| Writing style | ASD-STE100 at about 75% (STY-20261003-01) |

## Corrections

None yet. This is the first version. The alignment to `WP-09-design.md`, to the architect's decisions (`WP-09.md` §3)
and to the independent review will be recorded here as a table of changed rows, as in `WP-07-acceptance.md` and
`WP-08-acceptance.md`.

## Lessons applied from the WP-01 to WP-08 corrections

| Lesson | Source | Where this checklist applies it |
|---|---|---|
| Identical replay, changed-content conflict, browser Back, rejected-form refresh and lost acknowledgement are five separate cases; a business duplicate with a new key and a raw stale envelope are two more | WP-01 A-02, A-03, A-06; WP-03 R-12; WP-06 D-12 | §0.2 "Replay terms"; one "Nth time" item per command (A11, A36, A47, A61, A73); the matrix A80 |
| A refused command leaves no operation record; the refusal shows only on the re-rendered form | WP-01 A-08; WP06-A104 | §0.2; A79; every refusal item says "nothing is recorded" and checks it by delta |
| A receipt names the command only when the operation's resource, returned id and summary (or a read by the returned id) establish it; otherwise a neutral "Request recorded" with facts labelled "Current"; no accepted time | WP-01 A-04, P-02; WP-06 D-02; WP-03 C-03 | §0.2 "Receipts"; A77 (per-command rule); A58 (flag resolution is neutral) |
| No receipt or status read tells anyone to act; a historical receipt shows current facts | WP-07 F-01 (P0 class fix) | A31, A78 |
| No payment fact is drawn from a passed gate or a used exception | WP-07 F-05 | A32, A43 |
| Freshness: "Read at [time] IST" for an authoritative read; the lag form for a projection | LD-08 | §0.2; A23 (history) |
| A page shows only facts that a read returns; a missing fact is "Unavailable" or the item is "partly met"; gaps are deferred, not failures | WP-02 B-06; WP-03 R-11; WP-06 D-04, D-05 | §0.2 "Facts"; §5 "Deferred"; A09, A16, A20; Q-05 |
| A known gap is shown on the page, not designed around | WP-06 D-03, D-06 | A27, A41, A42 |
| A state is labelled for the action it was evaluated for | WP-06 D-05; WP-08 lesson | A28 (Gate 1 for the first operator work, not for assignment) |
| A request that Core refuses is shown as Core answers it; the page does not change the input to force acceptance | WP-06 D-09 | A32, A44 |
| Form rows within Core's limits only; every filled row reaches Core; never a silent truncation | WP-06 D-10; WP-08 E-04 | A44 (5); Q-02 |
| Identity values map from the posted form, the same for the same input, so that a replay is the same content | WP-03 C-04 | A47; Q-02 |
| A page MUST NOT block a command that Core accepts, and MUST NOT offer one that Core refuses | WP-07 D-W07-16; WP-03 F-W03-11 | A06, A07; Q-03, Q-04 |
| Proofs rerun with a run tag and a fresh synthetic travel agent; checks compare with a recorded baseline (deltas) | WP-02 B-13; WP-07 PM Q-07 | §0.4; §3 step P-0 |
| Set-up writes through existing pages are allowed and are labelled "Setup"; they are not the subject under test | WP-03; WP-06 Q-W06-10 | §0.4; §3 |
| Real refusal shapes from the code; a business refusal is asserted from the current page's facts | WP-06 D-11, D-12; WP-07 F-09 to F-12 | §0.5; every harness step sends from a freshly read page |
| Optional reads never hide an access change | LD-14 | A83 |
| Forms of later packages stay reachable on rebuilt pages; every rendered form action is a registered route | WP-03 Q-01; WP06-A110; WP-08 Q-11, S-09 | A38, A75, A88 |
| Copy states no configuration number that the page does not read | WP-01 Q-13 | A02, A85 |
| Bans are scoped by fact ("Help approved" is a help-request state, never an application status) | WP-08 E-12 | A16, A85 |

## 0. Inputs and conventions

### 0.1 Inputs

| Ref | Source | Identity | Sections used |
|---|---|---|---|
| UX | `TARGET_PRODUCT_UX_SPEC.md` (2026-10-05) | SHA-256 b45186887cdc37f6… | §2.3, §3.1 step 5, §3.2 (Approved assistance; TA reports a problem), §3.3, §4.1, §4.3 (Corrections and pricing), §4.4, §5.1, §5.3 (Assistance; Readiness checklist), §5.4, §6.1, §6.3 (Exception), §7.4, §7.5, §8.3, §12 V07 |
| BU | `BULK_UPLOAD_PRODUCT_UX_SPEC.md` (2026-10-05) | SHA-256 c2686f12552be10f… | §8.2; §9 BU-21, BU-22 |
| BS | `BUILD_SPEC.md` (r2) | SHA-256 4a6fd90657b0723f… | B14 to B20, B26, B33, B35 |
| PL | `../ui-plan-from-specs-2026-10-10/UI-PLAN.md` | SHA-256 75256bfd7e6d929a… | §3.2 TA-07, §3.3 OP-02 OP-03, §3.4 SA-01 SA-02 SA-09, §4.2 (A1 to A6, R1 to R4), §5.2, §5.3, §5.4, §6, §7 (rows Request help, Report a problem, Save assistance entry, Return for TA review, Flag to SuperAdmin, Decide help request), §8, §10, §11, §12.2 WP-09 |
| BP | `../ui-plan-from-specs-2026-10-10/BULK-UPLOAD-UI-PLAN.md` | SHA-256 6c574a4eaf9e39c7… | §4.10 item 5; rows BU-P06, BU-P07; BU-21, BU-22 |
| CC | `COMMAND-COVERAGE.md` (this folder, updated 13 October 2026) | SHA-256 f05e3acc61a3db37… | §3 rows of the five WP-09 commands; §5.1 WP-09; §5.3 (`core.respond_flag`); §5.4; §6 CC-04, CC-06, CC-12; §6.1 (moves of `core.hand_back`, `core.flag`) |
| LP | `PLAN.md` (this folder) | SHA-256 5458225f2b55d7ad…; internal a659b1a | §3, §4 (LD-02, LD-03, LD-07, LD-08, LD-11, LD-12, LD-14), §7 (#23, #25), §8 (S-07, S-08), §9 |
| PR | `PROPOSALS.md`; lane `output/proposals/P-12-assistance-first-work-exception-route.md`; `P-10-wp06-core-requests.md` | SHA-256 ac642225928c3aea…; f71b5888b314d185…; 79f82537bc71f4b2… | P-10 (b, e, f); P-12 (Max: option C narrowed, §11.1 to §11.6) |
| W3 | `WP-03.md`; `WP-03-design.md` | SHA-256 e2d4422bfef6dd24…; d4d40cb1d18a7bc2… | §3 Q-W03-06; §4.1 C-04, C-13; design §2.7, §2.9 (TA-07h), §3.1 to §3.4, F-W03-11 |
| W6 | `WP-06.md`; `WP-06-design.md`; `WP-06-acceptance.md` | SHA-256 a967bc071def9e25…; 327f580c1820bf40…; 7a1d82e48fde6e93… | §3 PM Q-05; §4.1 D-02, D-06, D-07, D-10, D-12; design §2.1, §2.2.2, §2.2.3, §2.7.1 to §2.7.5; WP06-A18, A47, A89, A147, A148 |
| W7 | `WP-07.md`; `WP-07-design.md`; `WP-07-acceptance.md` | SHA-256 42006017a81558df…; 4c877b4be85dc5e7…; 647c7b1d6af0887c… | §3 Q-W07-03, Q-W07-09; §4.1 F-01, F-05; design §2.4 (action panel), §2.5.1, §2.6; WP07-A03, A31, A37, A44, A48 |
| W8 | `WP-08-acceptance.md` | SHA-256 4d6504be7f20ebe7… | Format, corrections, lessons, §0.2; A89 to A91 (TA-10), A101 (history) |
| Code | lane repository | e9e96e3 | `src/modules/core/commands/holds.ts`, `assignment.ts`, `drafts.ts`, `submission.ts`, `common.ts`, `gates.ts`; `src/modules/core/corrections.ts`, `controls.ts`, `derived.ts`, `staff-views.ts`, `lists.ts`; `src/modules/identity/policy.ts`; `src/contracts/core.ts`; `src/core-api/bindings/core.ts`; `src/modules/views/case-projectors.ts`; `src/apps/shared/core/ta.ts`, `shared.ts`; `src/web/ui/presentation.ts`; `src/apps/staff/core/ops.ts`, `admin.ts`, `case.ts`; `src/web/route-inventory.ts`; the tests named per item; `test/fixtures/documents/samples.ts` |

Verified facts of the code at e9e96e3 that the items rely on (read by the author; the design review checks the rest):

- `core.report_problem` (travel agent, own application): `note` 1 to 2000 characters; no expected revision ("valid
  against any revision"). It is accepted when the lifecycle is draft or submitted, the editor state is `assigned` or
  `assistance_in_progress`, no return is open and no problem report is open. It does not check the outcome. It opens
  a `prb_` hold, moves the hold revision (so the readiness basis changes), changes no application data and notifies
  the assigned operator. Result: the application and `holdId`.
- `core.decide_assistance` (SuperAdmin): `assistanceId`, `expectedRevision`, `decision` approve or decline, `reason`
  (10 to 1000). A request that is not the open one, a changed revision or a request that is no longer `requested` is
  refused `stale_revision` (Core has no separate duplicate code). An approval on an application without an operator
  checks no gate and only moves the revision. An approval on an application with an operator ("in place") runs Gate 1
  for the first operator work (`requireGate1AtWork`): it passes on a recorded basis, a received payment or a fresh
  first-work exception, which it consumes (opening a payment follow-up owned by the grantor); otherwise it is
  refused `control_blocked` / `gate1_payment_not_received`. An in-place approval also closes an open return (resolution
  `assistance_approved`) and sets the editor state to `assistance_in_progress`. The travel agent is notified
  (`assistance_decision`). Result: the application and `assistanceId`.
- `core.record_assistance_entry` (assigned operator): `expectedRevision`, `fields`, `declaredCountry`,
  `passportType`, `identityChanges`, `evidenceVersionIds` (0 to 4), `explanation` (1 to 1000). Controls: editor
  state `assistance_in_progress` (else `hold_returned_to_ta` or `assistance_not_approved`), open application, no
  outcome, an active assignment; then Gate 1 for the first operator work as above. An identity change needs one
  evidence version of the application that shows every new value and two unchanged distinguishing fields
  (`identity_same_person_evidence_insufficient`). No change: `correction_no_change`. The change is applied, or held
  while a filing may have happened. Result: the application, `correctionId` and `stage` (`applied` or `held`).
- `core.resolve_hold` (assigned operator only): `holdId` (`prb_`, `ret_` or `flg_`), `resolutionNote` 1 to 2000.
  A hold of another application: `not_found_or_forbidden`. A hold that is not open: `stale_revision`. A return:
  `hold_not_operator_closable` (the travel agent closes a return by the hand back or by submitting a returned
  draft). A flag without an answer: `flag_response_missing`. It moves the hold revision and, for a problem report,
  notifies the travel agent. Result: the application and `holdId`.
- `core.respond_flag` (SuperAdmin): `holdId` (`flg_`), `responseNote` 1 to 2000, `reason` 10 to 1000. A hold of
  another application: `not_found_or_forbidden`. An answered or closed flag: `flag_already_responded`. The hold
  stays open; the answer moves the application revision but not the hold revision. The operator is notified.
  Result: the application and `holdId`.
- Pending answer (`derived.ts` `pendingOnAction`): an unanswered flag is owner SuperAdmin, `respond_to_flag`
  (rule 9); an answered flag is owner the assigned operator, reason `hold_flagged_to_superadmin`, next action
  `resolve_problem_report` (rule 10); an open problem report is owner the operator, `resolve_problem_report`
  (rule 11); a requested help is owner SuperAdmin, `decide_assistance`; approved help without an operator is owner
  SuperAdmin, `assistance_approved` / `assign_operator`; a draft with help in progress is owner the operator,
  `hold_assistance_in_progress` / `start_operator_work` (rule 13), also when Gate 1 for the first work blocks the
  operator (the gap of P-12).
- `core.flag` accepts only editor state `assigned`: no flag is possible while approved help is in progress (WP-06
  D-06). `core.formal_return` accepts `assigned` and `assistance_in_progress`; on approved help it marks the request
  `fulfilled` and sets the editor state `returned_to_ta`. Submitting a returned draft closes the return, marks the help
  `fulfilled` and keeps the operator.
- Reads: the travel agent's case read returns open holds with a note only for a return (a problem report's text and
  a flag's text are not returned), `assist.state`, the `assistance` evaluation (request help) and no evaluation for
  "Report a problem". The staff case read returns every hold with its note, `response_note` and `responded_at` (not
  who answered), the latest help request (`assistance_id`, `state`, `request_note`; no request time, no decision
  reason), gate exceptions, the identity evidence choices and the declared form fields. `core.admin_queue
  {assistance | flags}` returns list rows (pending answer, payment, assigned operator id), not hold or request facts.
- The travel agent's history (`views.ta_history`, a projection) has lines for help requested, approved and declined,
  assignment, formal return, hand back, problem reported and problem resolved; no flag line and no assistance-entry
  line.
- Today's pages: the report form is shown by a page rule (`ta.ts:548-549`) that also hides it after an outcome; the
  assistance entry form computes identity changes as a difference from the current identity and keeps at most four
  ticked documents silently (`case.ts` `identityChangesOf`, `slice(0, 4)`); the help decision and the flag response are
  forms on the old SuperAdmin case page.

### 0.2 Conventions

- **Personas.** Travel agent: Y, `wp09-ta-[stamp]`, a fresh synthetic travel agent per run (created and activated on
  SA-06 at set-up); `syn-ta-2` for isolation only. Operators: `operator-1` (OP1: P, F, H), `operator-2` (OP2: K;
  isolation on P), `operator-3` (holds a group read grant of the run's group; read-only checks). SuperAdmins:
  `superadmin-1` (SA1) and `superadmin-2` (SA2). They stand for `syn-operator-1` to `-3` and `syn-superadmin-1`,
  `-2`. Keyboard-only user. Screen-reader user. Phone user (390 px wide). No step suspends a seeded account.
- **Where.** `L`: a person or the LD-11 harness shows it on `lane-ui`. `T`: an automated test in the lane repository
  shows it at the same commit; the run record names the test. `L+T`: both are required. A test that the item says
  WP-09 adds is named in the run record with its file and title.
- **Sign-in codes (rule C).** As WP-01 §0.2. The LD-11 harness signs in. Nobody prints, logs, screenshots or stores a
  code or an authenticator key.
- **Copy.** Quoted text is draft copy (CR-09). Draft copy passes when the page states the same facts. The §11.3
  boundary form is mandatory for an unavailable action: "[Action] is unavailable until [policy or evidence] is
  [approved / recorded]. Owner: [owner or 'not yet named']." Core's reasons show in words; a code shows only as the
  UAT-13 fallback (A82).
- **Help and hold words.** Help request (TA and staff): "Not requested", "Requested: TravelMudra decides",
  "Declined: you can ask again", "Approved: TravelMudra assigns an operator", "An operator is entering information
  with your approval" (help in progress), "Returned to you for review", "Help completed" (Core's `fulfilled`).
  Holds: "Problem report: Open since [time] IST" / "None open"; "Flag: waiting for a SuperAdmin's answer", "Flag:
  answered [time] IST", "Flag: resolved". An exception row reads "Action allowed by exception: Gate 1, for the first
  operator work, once" and then "used", never "Payment received". "Help approved" is a state of the help request,
  never of the application.
- **Dates and times.** Every time carries "IST" (AD-10, CR-06).
- **Freshness (LD-08).** An authoritative read (`core.*`, `ops.*`, `pay.*`) shows "Read at [time] IST". A projection
  (`views.*`) shows "Up to date when read at [time] IST", "Behind by [n] s when read at [time] IST" or "Freshness
  unavailable". No page applies a client-side age threshold.
- **Facts.** A page shows only facts that a read returns (WP-02 B-06). A fact read after an operation is labelled
  "Current". A count that a read cannot give shows "Unavailable", never "0" (D7). A list that returns its row limit
  says so and claims no total.
- **Receipts.** CMP-08 as WP06-A103: the request reference links to the operation status page; the resulting facts;
  "Recorded once. Sending the same form again does not repeat it."; no accepted time (P-02). A receipt names the
  command only when the operation's resource, the returned id and the summary establish it on that surface, or when
  a read by the returned id establishes it (A77). Otherwise it reads "Request recorded" with the current facts labelled
  "Current" (WP-06 D-02). A receipt states what was recorded and Core's current next step; it never repeats an
  instruction from the past (F-01 class). The polite region announces it.
- **Replay terms** (used by every "Nth time" item; the five terms of the lane):
  1. *Identical replay*: the harness sends the accepted request again with the same `_op` and the same fields (raw
     envelope); a double-click on the final button is the same case. Expected: the original result, nothing new.
  2. *Changed-content conflict*: the same `_op` with one changed field. Expected: refused as a used form
     (`conflict_operation_key`); the page re-renders with a new form key, the typed values kept and "This form was
     already used with different content. Your values are kept: check them and send again."; nothing recorded.
  3. *Browser Back*: after the receipt the person presses Back. Back reloads the page (WP-01 A-02) with a fresh form
     and current facts. A send from that page is a new request; the command's own business check decides it.
  4. *Rejected-form refresh*: a send that Core refuses leaves no operation record; the re-rendered form carries a new
     key; the corrected send is recorded once.
  5. *Lost acknowledgement* (fixture): C4 (CMP-13) "Checking the original result" and "Check status"; no new send of
     the same intent is offered there.
  Two more cases belong to the replay matrix (A80), never to a term: a *business duplicate* (a new key with the
  current page's facts) and a *raw stale envelope* (a new key with an older page's revision).
- **Refused sends leave no record.** A refused command leaves no operation record: the status page of its key reads
  "Nothing is recorded for request [reference] so far", and the refusal shows only on the re-rendered form. Every
  refusal item says "nothing is recorded" and checks it by delta where a list, a count or a fact could change.
- **Paths (LD-03).** Existing paths and form actions stay. New pages get the paths that the design names. Pages:
  TA-07 `/ta/applications/:applicationId` (the report form in the action panel or on a task page that the design
  names; action `/ta/applications/:applicationId/report-problem` stays); TA-07h `…/request-assistance` (WP-03);
  TA-08 `…/submit` (WP-03); TA-09t `…/prepare` and its sections (WP-03); TA-07x `…/history`; TA-10 `/ta/notices`
  (WP-08). OP-01 `/ops/work`; OP-02 `/ops/applications/:applicationId` (`?tab=`), with the approved-assistance task
  (action `…/assistance-entry` stays) and the hold resolution (in OP-02 or on a task page that the design names;
  action `…/holds/:holdId/resolve` stays); OP-03r `…/return` and OP-03f `…/flag` (WP-07). SA-01 `/admin`; SA-02a
  `/admin/queues/assignment`, SA-02b `/admin/queues/assistance`, SA-02c `/admin/queues/flags`; SA-09 help decision
  `/admin/applications/:applicationId/decide/assistance/:assistanceId` (action `…/assistance-decision` stays); SA-09
  flag response `/admin/applications/:applicationId/decide/flag_response/:holdId` (action `…/flags/:holdId/respond`
  stays); SA-09g `…/decide/gate1_assignment` and `…/decide/gate1_first_work`, SA-03a `…/assign`, SA-07a `…/payments`
  (WP-06); SA-06b `/admin/accounts/new` (WP-02). The SA-09 subject routes follow WP-06 design §2.7.5. An item names
  the page; the run record names the path used.
- **Pass rule.** WP-09 passes when every `L` item passes on `lane-ui` at the integrated ref, every `T` item has a
  named passing test at that commit, every axe item passes, and the proofs of §3 pass to their boundary, except the
  explicitly deferred items of §5. The run record lists each deferred item as "Deferred" with its reference (for the
  P-12 and P-10 e items: "Deferred until the Core batch"), not as "Fail". An item that the architect marks "partly
  met" by a recorded decision passes with that note. A failed item becomes a finding ranked P0, P1 or P2 with its
  scenario (PRI-20260930-01).
- **Preconditions on `lane-ui`.** WP-01, WP-02, WP-03, WP-06 and WP-07 are integrated (TA pages create, edit, submit,
  ask for help and hand back; SA-06 creates accounts; SA-07a records payments; SA-03a assigns; SA-09g records Gate 1
  exceptions; OP-02 starts work and records readiness; OP-03r returns, including "Return for TA review"; OP-03f
  flags). WP-08 is integrated for TA-10 and the TA history page; without it A23 and A24 run on the existing pages
  and say so. The harness can create, activate and sign in a new synthetic travel agent, and "SYN Tourist e-visa"
  admits it (checked first, §0.4).
- **Data hygiene.** WP-09 MUST NOT change seeded offerings, launches, listings or accounts and MUST NOT change any
  exposure ceiling. Each run creates its own travel agent Y, group and applications, with notes, reasons and
  references that carry the run tag. Synthetic documents only, generated in memory from
  `test/fixtures/documents/samples.ts`; passport numbers are new in every run. The run record keeps identifiers
  (travel agent, applications, holds, help requests, corrections, exceptions, operation references) in the internal
  record only.

### 0.3 Synthetic data used by WP-09

| Item | Value | Use |
|---|---|---|
| Travel agent | Y, `wp09-ta-[stamp]`, a fresh synthetic travel agent per run (SA-06), synthetic email address | Every application of the run |
| Group | `wp09-[stamp]` in Synthetica; travel start today + 30 days, return today + 40 days | P, F, H, K |
| Offering | "SYN Tourist e-visa" (`syn_tourist_evisa`), ₹3,500, TravelMudra files | P, F, H, K |
| Passports | `td3Lines` of a `SyntheticPassport` with surname `SYNWPNINE`, document code P, issuing state and nationality IND, expiry at least six months after the return date, number "S" + seven digits new to the run; rendered with `passportImage` (JPEG) or `passportTextPdf`. Given names: P "PREM", F "FARAH", K "KIRAN", H "HEMA DEVI" | Intake of P, F, H, K |
| Photographs | `plainPng` at least 350 × 350 px | Intake |
| H's typed identity | Given names typed "HEMA" on TA-09c while the passport shows "HEMA DEVI" (the form of `mismatchedDraft` in `test/system/case-rules.test.ts`); the passport row shows Core's conflict state | The approved-help identity correction |
| Payments | "Payment received" for P and F, evidence reference `SYN-V09-[stamp]-[letter]`; H and K stay unpaid | Gate 1 paths |
| Notes and reasons | "WP09 [stamp] …", at least the length Core requires | Every note, answer and reason field |

### 0.4 Run recipe (rerunnable)

- Run tag `wp09-[yyyymmddhhmm]`. First check: the harness can sign in Y, and "SYN Tourist e-visa" admits Y. Fallback
  when it does not: `syn-ta-1` with a run-tagged group (no other change to `syn-ta-1`), recorded in the run record.
- Baseline (step P-0, before the set-up): SA-01 groups 3, 4, 5 (both lines) and 11; SA-02a approved-help rows;
  SA-02b and SA-02c row counts; the OP-01 view counts of OP1 and OP2. Every later count check is a delta from it.
- Setup (labelled "Setup", driven by the harness through integrated pages): SA1 creates and activates Y. Y creates the
  group and the drafts P, F, K and H on TA-09c (H with the typed given names of §0.3) and submits P, F and K on TA-08.
  SA1 records "Payment received" for P and F (SA-07a) and assigns P and F to OP1 (SA-03a). OP1 starts work and
  confirms readiness on P and F (OP-02, WP-07). Y asks for help on K (TA-07h); SA1 records the Gate 1 exception for
  assignment of K (SA-09g) and assigns K to OP2 while K's help request is still open. SA1 grants `operator-3` read
  access to the group (existing grant page).
- Gate exceptions expire after Core's lifetime (the page never states it): the run reaches V07-D4 within it, or
  records the exceptions again as set-up.
- Order (§3): P-0, Setup, Part A (P), Part B (F), Part C (H), Part D (K), Part E (isolation, tests, axe). Data of
  earlier runs stays and is excluded by its tag.

### 0.5 Refusal shapes in the code at e9e96e3 (category / code)

| Command | Refusals the items assert |
|---|---|
| `core.report_problem` | `control_blocked` / `application_not_open`; `control_blocked` / `hold_not_applicable` (no operator holds it, or a return is open); `conflict_duplicate` / `problem_report_open`; `validation_failed` on `note`; `not_found_or_forbidden` / `access_denied` |
| `core.decide_assistance` | `stale_revision` / `stale_revision` (not the open request; changed revision; already decided); `control_blocked` / `application_not_open`; `control_blocked` / `gate1_payment_not_received` with a blocker (`gate1_service_payment`, `exceptionEligible: true`) for an in-place approval; `control_blocked` / `gate_exception_consumed` (a race on the exception); `validation_failed` on `decision` or `reason`; `not_found_or_forbidden` |
| `core.record_assistance_entry` | `stale_revision`; `control_blocked` with `hold_returned_to_ta`, `assistance_not_approved`, `application_not_open`, `outcome_already_recorded`, `assignment_changed`, offering codes, `gate1_payment_not_received`, `identity_same_person_evidence_insufficient`, `population_out_of_scope`, `correction_historical_after_filing`, `filing_possibly_occurred`; `validation_failed` with `correction_no_change`, field codes (`not_declared`, `not_an_option`, `too_long`, `date_invalid`, `country_code_invalid`), `explanation`, `evidenceVersionIds` over the limit; `not_found_or_forbidden` |
| `core.resolve_hold` | `not_found_or_forbidden` / `access_denied`; `stale_revision` (the hold is not open); `control_blocked` / `hold_not_operator_closable`; `control_blocked` / `flag_response_missing`; `validation_failed` on `resolutionNote` |
| `core.respond_flag` | `not_found_or_forbidden` / `access_denied`; `control_blocked` / `flag_already_responded`; `validation_failed` on `responseNote` or `reason` |

## 1. Scope

### 1.1 Pages

| Page | Host and path | Part in WP-09 |
|---|---|---|
| TA-07 Application workspace | 4650 `/ta/applications/:applicationId` | "Report a problem" (rebuilt from the carried form), the problem-report state, the help-request states, the states of approved help in progress and returned for review, the TA texts for an operator's flag |
| TA-08, TA-09 sections, TA-07h, TA-10, TA-07x | 4650 (WP-03, WP-08 pages) | Observation and set-up only: the submission or hand back after help, the assigned-case refusals (BU-22), the help request (BU-21), notices and history lines |
| SA-02b Help requests | 4652 `/admin/queues/assistance` | Rows link to the SA-09 help decision; the operator fact per row |
| SA-09 help decision | 4652 new subject path | Approve or decline a help request, unassigned and in place |
| OP-02 Application workspace | 4652 `/ops/applications/:applicationId` | The approved-assistance task and entry form; the problem-report and flag states; the hold resolution |
| OP-03r Return | 4652 (WP-07) | Observation: "Return for TA review" ends approved help |
| SA-02c Flags from operators, SA-01 groups 3 to 5 | 4652 `/admin/queues/flags`, `/admin` | Rows and counts link to the SA-09 flag response |
| SA-09 flag response | 4652 new subject path | Answer an operator's flag |
| Old SuperAdmin case page; old operator case page; today's TA application page | 4652, 4650 | Only: the WP-09 forms leave them; links replace them; every other carried form stays |

Read models: TA application case (`core.ta_application`), Operator case (`core.ops_case`, `ops.case_work`,
`doc.application_evidence`), SuperAdmin case and decision context (`core.admin_case`, `pay.application_payments`
optional), SuperAdmin work queues (`core.admin_queue {assistance | flags}`, `core.assignment_queue`), Assigned work
queue (`core.ops_work`), TA history (`views.ta_history`, projection), Notices (`dlv.notices`).

### 1.2 Command coverage (CC §5.1: 5 WP-09 commands)

| # | Command | Route id today | Page | Items |
|---|---|---|---|---|
| 1 | `core.decide_assistance` | `admin.applications.assistance_decision` | SA-09 help decision (SA-09 kind; SA-02b queue) | A25 to A38 |
| 2 | `core.record_assistance_entry` | `ops.applications.assistance_entry` | OP-02 approved-assistance task (identity changes need same-person evidence) | A39 to A52 |
| 3 | `core.report_problem` | `ta.applications.report_problem` | TA-07 (assigned and not formally returned; creates a hold) | A01 to A15 |
| 4 | `core.resolve_hold` | `ops.applications.resolve_hold` | OP-02 / OP-03 (problem-report or flag hold; a return hold is refused) | A53 to A65 |
| 5 | `core.respond_flag` | `admin.applications.respond_flag` | SA-09 flag-response kind; SA-01; SA-02c | A66 to A75 |

All of them also: A76 (shell), A77 (receipt checked against the operation), A78 (no instruction to act), A79 (no
record for a refusal; lost acknowledgement), A80 (replay matrix), A81 and A82 (refusal text), A83 (LD-14), A84 to
A89 (role controls, labels, read grant and support view, storage, carried forms, isolation).

Commands outside WP-09 that the proofs touch only as set-up or observation: `intake.start_individual`,
`core.edit_draft`, `core.correct_identity`, `core.submit`, `core.request_assistance` (TA-07h) and `core.hand_back`
(TA-08 returned mode) of WP-03; `pay.record_service_status`, `core.assign`, `core.grant_gate_exception` for Gate 1 of
WP-06; `ops.start_work`, `ops.record_readiness`, `core.flag` and `core.formal_return` (including "Return for TA
review", WP07-A48) of WP-07; `iam.create_account`, `iam.activate_account` of WP-02; `iam.create_group_read_grant`.

### 1.3 State coverage

S1 (loading) does not apply: every WP-09 page is server-rendered. S5 applies only to the TA history (projection).

| Page | Page states | C1 validation | C2 rejected | C3 accepted | C4 unresolved | C5 stale |
|---|---|---|---|---|---|---|
| TA-07 report | Assigned A01; reported A04; resolved A09; returned A10; help in progress A07, A19; flag open or answered A13; support view A86 | A05 (5) | A05 (1) to (4), (6) | A03 | A11 (5) | A12 (current state, no revision) |
| TA-07 help states | Requested, declined, approved, in progress, returned for review, completed A16 to A22 | — | A19 | — (WP-03) | — | — |
| SA-02b, SA-01 groups 3, 4 | Rows A25; empty (S2) A25; cap A25; S4 count A26 | — | — | — | — | — |
| SA-09 help decision | Unassigned A27; in place A28; decided A34; not open A34; S4 optional reads A28 | A29 | A32, A34 | A30, A31, A32 | A36 (5) | A35 |
| OP-02 approved assistance | Task A39; Gate 1 gap A41; deferred owner A42; held A45; returned A50; read grant A86 | A44 (3), (4) | A41, A44 | A43 | A47 (5) | A46 |
| OP-02 holds and resolve | Report open A53; flag waiting A56; flag answered A57; return A59; readiness A63 | A60 (1) | A56, A59, A60 | A55, A58 | A61 (5) | A60 (2), A62 |
| SA-02c, SA-01 group 5 | Rows A66; S2 A66; current step not the flag A66 | — | — | — | — | — |
| SA-09 flag response | Waiting A68; answered A71; resolved A72 | A69 | A71, A72 | A70 | A73 (5) | — (no revision; A73) |

### 1.4 Specification scenarios

| Scenario | What WP-09 shows | Items |
|---|---|---|
| V07: assigned TA can report only | TA-07 offers only "Report a problem"; TA-09 sections refuse; the report changes no data | A01, A03, A04, A14; §3 Part A |
| V07: formal return enables permitted correction; same operator reconfirms readiness | The return answers the report; the TA corrects and hands back; the same operator confirms readiness again (WP-07 pages, observed) | A10, A62, A63; §3 V07-A7, V07-A8 |
| V07: approved assistance ends in TA review/submission | Help decision, bounded operator entry, "Return for TA review", the TA's own submission or hand back | A21, A22, A27 to A32, A39 to A50; §3 Parts C, D |
| BU-21: help on a draft uses the existing help decision path; no invented submission, assignment or payment bypass | TA-07h → SA-02b → SA-09 → SA-03a with Gate 1 → OP-02 → TA-08 | §3 Part C (to its boundary) |
| BU-22: correcting an assigned, not returned case | Report path names the operator and the formal return; TA-09 sections refuse | A01, A05, A14; §3 V07-A1 (to its boundary) |
| V06 (help requires Gate 1 before operator work) | In-place approval and the first entry run Gate 1 for the first operator work | A28, A32, A41, A43, A49 |
| V15 (no SuperAdmin readiness, filing or entry control) | SuperAdmin pages hold decisions and answers only | A37, A74, A84 |
| V24 (keyboard and phone) | The WP-09 tasks by keyboard and at 390 px | A15, A52, A65, A90 to A101 |

## 2. Acceptance checklist

### 2.1 TA-07 Report a problem (`core.report_problem`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP09-A01 | TA (Y) | TA-07 of P after its assignment (§3 V07-A1) | Read the page. Look for "Change the application", upload, "Check and submit" and "Ask TravelMudra for help". | Status row Editing "With your operator". Action panel: owner "Your operator"; step "This application is with your operator. Report the problem so it can be returned for correction."; blocker type "Another person owns this step"; one action "Report a problem". No change link, no upload, no TA-08 link; TA-07h, if opened, shows the same sentence and no form. Freshness "Read at [time] IST". | L | UX §2.3, §4.3, §4.4; BS B18; PL §3.2 TA-07; WP-03 design §3.1; `controls.ts` `editorStage` (`awaiting_formal_return`) |
| WP09-A02 | TA (Y) | TA-07 report form of P | Select "Report a problem". Read the form. Select "Cancel". | Before the field: "Your operator owns the application while it is assigned. A report changes no application data, no document and no price. Your operator deals with it and may return the application to you for correction. Filing and packet release wait until your operator deals with it." One field "What is the problem?" (required; its length limit is Core's). Button "Send the report". "Cancel" returns to TA-07; nothing is recorded. | L | UX §3.2 (TA reports a problem), §4.3; BS B18; PL §4.2 R1; `holds.ts` `reportProblem` (`zNote(2000)`) |
| WP09-A03 | TA (Y) | TA-07 report form of P (§3 V07-A2) | Type the problem. Send. | C3 receipt "Problem reported" (named: on the TA surface only this command returns a hold id with the problem-report prefix). Request reference linked to the operation status page; "Recorded once. Sending the same form again does not repeat it."; no accepted time. Current: "Problem report: Open since [time] IST"; "Next: your operator deals with your report and may return the application to you." The receipt shows no report text as if read back from Core (the TA read returns none, Q-05). The polite region announces it; focus does not move. | L | CMP-08; WP-06 D-02; P-02; `holds.ts` (`holdId` `prb_…`); `core.ta_application` `openHolds` |
| WP09-A04 | TA (Y); test | TA-07 of P after A03 | Read the page. Compare with the reading before the report (run record). | Status row "Problem report: Open since [time] IST". Stage, Editing, the applicant's facts, the document rows, the quoted price and the original estimated window are unchanged (delta none). No second report control. Action panel: owner "Your operator", "Your operator deals with your report and may return the application to you."; no action. | L+T | BS B18 ("The product report changes no application data"); `test/core/assignment-holds.test.ts` "records a problem report against any revision; it changes no application data and blocks filing" |
| WP09-A05 | TA (Y); harness; test | TA-07 report | (1) Harness: a second report on P while the first is open (new key, current page). (2) Harness: a report on P while it is returned (§3 V07-A7). (3) Harness: a report on H while it is a draft with no operator, and on K before its assignment (fixture, or a later run step). (4) Test: a report on a completed application. (5) Send an empty field. (6) `syn-ta-2` posts a report on P. | (1) "You already reported a problem on this application. Your operator deals with it." (`conflict_duplicate` / `problem_report_open`). (2) "The application was returned to you for correction. Correct it and hand it back instead." (`hold_not_applicable`). (3) "No operator holds this application. You can change it yourself." with the change route that Core's evaluation offers (`hold_not_applicable`). (4) "The application is not open." (`application_not_open`). (5) C1 on the field. (6) The uniform not-found page. Nothing is recorded in each case: each key's status page reads "Nothing is recorded for request [reference] so far"; TA-07's report row and the OP-01 counts are unchanged (delta). | L ((1), (2), (3) H, (5), (6)) + T | `holds.ts` `reportProblem` (`requireOpen`, editor and hold guard, duplicate); WP-01 A-08 |
| WP09-A06 | Test | TA-07 offer of "Report a problem" | Unit test over Core's facts: each combination of lifecycle, editor state, open return, open problem report and outcome; for each fixture, run the page's mapping and `core.report_problem`. | The page offers the report exactly where Core accepts it: lifecycle draft or submitted; editor state `assigned` or `assistance_in_progress`; no open return; no open problem report; also after an outcome while the application is still submitted (Core does not check the outcome; today's page hides it, Q-04). Where Core refuses, the page shows the state's own text and no control. The mapping is a closed table of Core facts; Core decides at send. | T | WP-03 design F-W03-11; PL §6; `holds.ts` (guard of `reportProblem`); `ta.ts:548-549`; Q-04 |
| WP09-A07 | TA (Y); operator; test | TA-07 and OP-02 of an application with approved help in progress (fixture; in the run on H when the architect accepts Q-03) | Read TA-07. Report a problem. OP1 reads OP-02. OP1 returns it for review, choosing "This return answers the travel agent's problem report". | Core accepts a report while help is in progress. When the architect accepts Q-03: TA-07 offers "Report a problem" in that state; the report is accepted as A03; OP-02 shows it inside the approved-assistance task; it does not stop the operator's entry; the return for review can answer it, and then it reads resolved. Until the decision: no report control in that state (WP-03 design §3.1), and the run record names the decision. | L+T | UX §2.3 ("Assigned and not formally returned: read and report a problem"); BS B18; `holds.ts:68`; `controls.ts` `editorStage`; Q-03 |
| WP09-A08 | Test | TA-07 "Withdraw" section of an assigned application (carried WP-17 section) | Open "Ask for a return to withdraw". Send. | The request uses the same command: the receipt and the states of A03 and A04, with the prefilled message as the report text. The withdrawal stays with WP-17 ("Withdrawal waits for a return"). | T | `ta.ts:579-585`; BS B18 ("separate withdrawal … wait for formal return"); LD-02 |
| WP09-A09 | TA (Y) | TA-07, TA-10 and TA-07x of P after OP1 resolved the report (§3 V07-A5) | Read TA-07. Open TA-10 and the notice. Open the history. | TA-07: "Problem report: None open"; the action panel is the assigned state of A01 again. TA-10: a notice that your operator resolved the problem report, linked to P, with no acknowledgement and no read marker. History: a line "Problem resolved" with "Recorded [time] IST" and the lag freshness. The operator's resolution note is not shown: no TA read returns it (partly met, Q-05). | L | LD-06; LD-08; `holds.ts` `resolveHold` (TA notice); `case-projectors.ts` (`problem_resolved`); Q-05 |
| WP09-A10 | TA (Y) | TA-07 of P after OP1 returned it answering the second report (§3 V07-A7) | Read the page. | Editing "Returned to you for correction"; the operator's note verbatim first; "Problem report: None open" (the return resolved it); action "Correct the application" → TA-09t, then TA-08 returned mode "Hand the application back" (WP-03). The same operator stays your operator. | L | UX §12 V07; BS B18; PL §4.2 R2, R3; `holds.ts` `formalReturn` (`resolveProblemHoldId`) |
| WP09-A11 | TA (Y); harness | TA-07 report, the Nth time | Replay terms 1 to 5 (§0.2) on A03. Term 2 changes the text. Term 3: press Back after the receipt; harness: a new-key send. Term 4: the empty send of A05 (5), then corrected. | (1) One report; the same receipt and hold id; one TA-07 row, one OP-02 notice, one operator notice. (2) Refused as a used form; the text kept; nothing recorded. (3) Back reloads TA-07 with the open report and no form; the new-key send is refused with A05 (1) and leaves no record. (4) Recorded once. (5) C4; no new report is offered there. The report carries no revision: no stale case exists; the business check answers. | L+T | PL §7 K-STD; BS B35; W1 A-02, A-08; `holds.ts` ("valid against any revision") |
| WP09-A12 | TA (Y), two tabs; operator (OP1) | TA-07 report form of P (§3 V07-A7) | Tab 1: open the report form and type. Meanwhile the second report (tab 2) is sent and OP1 returns P answering it. Send tab 1. | Refused with the current state in words ("The application was returned to you for correction…", `hold_not_applicable`); the typed text stays; TA-07 shows the return. Nothing is recorded. | L | UX §3.3; BS B19; `holds.ts` |
| WP09-A13 | TA (Y); test | TA-07 of F while OP1's flag waits and after SA2's answer (§3 V07-B1, V07-B5) | Read the action panel and the status rows. | While the flag waits: "TravelMudra is reviewing a question from your operator. Nothing is needed from you." After the answer: "Your operator continues after TravelMudra's answer. Nothing is needed from you." Never "the reported problem" or "your report": the TA reported nothing (Core's answer after the flag's answer is reason `hold_flagged_to_superadmin` with next action `resolve_problem_report`, Q-01). Neither the flag's note nor the answer is shown (the TA read returns neither). No flag line in the history. | L+T | `derived.ts` rules 9, 10; `presentation.ts:278-285` (TA texts keyed by next action only); Q-01 |
| WP09-A14 | TA (Y); harness | TA-09t and the sections TA-09d, TA-09i, TA-09f of P while assigned and not returned (BU-22; §3 V07-A1) | Open each. Harness: post an edit, an identity correction and an upload. | Each page shows CMP-10 "This application is with your operator. Report the problem so it can be returned for correction." with a link to the report form, and no form. Each hand-made post is refused with the same sentence (`awaiting_formal_return`); nothing is recorded. The report path names your operator as owner and the formal return as the way back. | L | BU §8.2, §9 BU-22; BS B18; `drafts.ts` `taEditorPermits`; `controls.ts` `editorStage`; WP03-A177 |
| WP09-A15 | Phone user, TA | TA-07 of P at 390 px | Open the report form. Send it empty, then with text. | Identity band → action panel ("Report a problem") → status rows → sections. The form is full width; the error summary is visible when focused; the button is at the end, not in a fixed bar. No horizontal page scroll. | L | UX §7.3 (Mobile); PL TA-07 (Mobile); AC-04, AC-21 |

### 2.2 TA-07 and TA-08: help states and the end of approved help

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP09-A16 | TA (Y) | TA-07 of H through §3 Part C and of K through Part D | Read the status row "Help request" and the action panel at each step. | One labelled row from Core's facts (`assist.state`, `editor_state`) with the words of §0.2. No decline reason, approver or decision time (the TA read returns none; Q-05). "Help approved" never appears as the application's status, and no row says "Submitted" before the TA's own submission. | L | UX §3.2 (Approved assistance); BU §8.2 ("Show approved, declined or awaiting decision truthfully"); `core.ta_application` (`assist`, `editor_state`); `ASSISTANCE_STATES` |
| WP09-A17 | TA (Y) | TA-07, TA-07h and TA-10 of H after the decline (§3 V07-C3) | Read TA-07. Open TA-07h. Open TA-10. | TA-07: "Help request: Declined: you can ask again"; the draft is unchanged (delta none); "Ask TravelMudra for help" is offered again (Core's `assistance` evaluation allows it). TA-07h offers the form. TA-10: a notice of the decision, with no acknowledgement and no read marker. | L | BS B17, B18; `assignment.ts` `decideAssistance` (notice `assistance_decision`); LD-06 |
| WP09-A18 | TA (Y) | TA-07 of H after the approval, before an assignment (§3 V07-C5) | Read the page. | "Help request: Approved: TravelMudra assigns an operator. Nothing is needed from you now." (Core's answer: owner SuperAdmin, `assistance_approved`, `assign_operator`). H stays a draft; no submission; no price change. Editing as Core reports it ("You can change it": Core lets the TA change an unassigned draft until help starts); "Check and submit" stays offered when Core's evaluation allows it. | L | BS B17, B18; `derived.ts` rule 12; `controls.ts` (`taSide` blocks only `assigned`, `assistance_in_progress`) |
| WP09-A19 | TA (Y); harness | TA-07 and TA-09d of H while approved help is in progress (§3 V07-C6) | Read TA-07. Open TA-09d. Harness: post an edit and a submission. | TA-07: Editing "An operator is entering information with your approval"; owner your operator; blocker type "Another person owns this step"; no change link, no TA-08 link, no TA-07h form. TA-09d: "An operator is entering information with your approval. You can change the application again when they return it to you." and no form. Both posts are refused with that sentence (`hold_assistance_in_progress`); nothing is recorded. | L | UX §3.2; BS B18; WP-03 design §3.1; `drafts.ts` `taEditorPermits`; `controls.ts` `editorStage` |
| WP09-A20 | TA (Y) | TA-07 of H after OP1's "Return for TA review" (§3 V07-C11) | Read the page. | Editing "Returned to you for review" (not "for correction"); the operator's note verbatim first; action panel: owner You, "Review what the operator entered, then submit." → TA-08; the text "An operator entered information with your approval. Check every answer before you submit." No text says that the operator submitted, confirmed or authorized anything for the TA; no "Submit for TA". The fields that the operator changed are not marked: no TA read returns them (partly met, Q-05); TA-08 shows every current answer. | L | UX §3.2, §4.3, §5.3; PL §4.2 A5, A6; WP-03 design §3.1; Q-05 |
| WP09-A21 | TA (Y); operator (OP1) | TA-08 of H, then TA-07 and OP1's OP-01 (§3 V07-C12) | Review the answers (the corrected given names). Tick the confirmations. Submit. | TA-08 shows the operator's entries as current answers; no confirmation is ticked by the page. C3 receipt "Submitted" (WP-03): the quoted price fixed now (help changed no price), the original estimated window starting now. TA-07: Stage "Submitted"; Editing "With your operator"; the same operator who helped; Help request "Help completed". OP1's OP-01 lists H as Core places it (start of work). The history shows "Submitted" once, after "Returned to you". | L | UX §3.2, §12 V07; BS B17, B18 ("followed by formal return for TA review/submission"); `submission.ts` (returned draft: return closed, editor `assigned`, help `fulfilled`); `test/core/assignment-holds.test.ts` "runs request, decline, approve, … formal return and the travel agent's own submission" |
| WP09-A22 | TA (Y) | TA-07 and TA-08 returned mode of K after OP2's "Return for TA review" (§3 V07-D6) | Read TA-07. Hand the application back on TA-08. | TA-07: "Returned to you for review" with the note; action → TA-08 returned mode (WP-03): "Quoted at submission: [₹] (unchanged)", "Original estimated window: … (unchanged)", "Hand the application back". After the hand back: Editing "With your operator"; the operator is OP2, unchanged; Help request "Help completed". | L | BS B18; WP-03 Q-W03-06; `holds.ts` `formalReturn` (help `fulfilled`), `handBack` |
| WP09-A23 | TA (Y) | TA-07x of H, K and P after §3 | Read each history. | Lines in order, each with "Recorded [time] IST": H "Help requested", "Help declined", "Help requested", "Help approved", "Assigned to an operator", "Returned to you", "Submitted"; P "Problem reported", "Problem resolved", "Problem reported", "Returned to you", "Problem resolved", "Handed back"; K as its steps. No flag line, no operator entry details. Freshness in the lag form. | L | LD-08; WP-08 Q-10; `case-projectors.ts` (`PLAIN_CORE_LINES`) |
| WP09-A24 | TA (Y) | TA-10 after §3 | Read the list. Open one notice. | One notice per help decision (H two, K one), per return (P, H, K) and per resolved problem report (P), each linked to its application; none needs acknowledgement; no "Unread", "New" or "Mark as read". Counts are the deltas from Y's P-0 reading. | L | LD-06; WP08-A89 to A91; `assignment.ts`, `holds.ts` (notices) |

### 2.3 SA-02b and the SA-09 help decision (`core.decide_assistance`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP09-A25 | SuperAdmin (SA1) | SA-02b after §3 V07-C1 and V07-D1 | Read the page. Select "Decide" on H's row. | `h1` "Help requests"; the lead of WP06-A18 (approving help does not assign an operator and does not pass Gate 1; assignment and the operator's first work still need the service payment recorded or a Gate 1 exception), with no sentence that approving help never needs a payment (D-07). Rows of `core.admin_queue {assistance}`: Application (applicant, reference); Stage ("Draft" / "Submitted"); Service payment (Gate 1); Operator ("No operator" / "Assigned", from the row's assignment fact; an assigned row adds "Approval starts help at once; Gate 1 for the first operator work applies"). "Decide" → the SA-09 help decision of that request, not the old case page. Freshness "Read at [time] IST". A cap line only when the read returns its row limit. S2: "No help request waits for a decision." Rows = baseline + 2 after V07-C1 (K and H). | L | UX §6.2; PL §3.4 SA-02; WP-06 design §2.2.2; `WP-06.md` D-06, D-07; `lists.ts` (`queueOf`) |
| WP09-A26 | SuperAdmin (SA1) | SA-01 groups 3 and 4 during §3 Part C | Read after V07-C1, V07-C2, V07-C3, V07-C4 and V07-C6. | Group 4 "Help requests to decide" equals the SA-02b rows (after C1 baseline + 2; after C2 + 1; after C3 + 2; after C4 + 1). Group 3 "Approved help waiting for an operator" equals SA-02a's approved-help rows (after C4 + 1; after C6 baseline). Item lines open the SA-09 help decision (group 4) or SA-03a (group 3). No two counts are added. | L | WP06-A02, A03; WP-06 design §2.1 |
| WP09-A27 | SuperAdmin (SA1) | SA-09 help decision of H's first request (no operator; §3 V07-C2) | Read the page. Select "Cancel". | CMP-25 order. `h1` "Help request: [applicant]". Scope: application reference, service, group, travel agent; Stage "Draft"; Operator "None". Evidence: the travel agent's note verbatim (or "No note"); service payment (Gate 1) as recorded; open holds; the gate exceptions of the application. Effect of "Approve": "An operator may then enter the application information with the travel agent's approval. Approving does not assign an operator, does not pass Gate 1, does not submit the application and does not change the price. Next: an operator is assigned (SA-03a), which needs the service payment recorded or a Gate 1 exception for assignment; the operator's first entry needs Gate 1 again." Effect of "Decline": "The application stays as it is. The travel agent is told and can ask again." The D-06 known-gap line (A41). Your decision: "Approve" and "Decline" (none preselected); "Reason" (required). Visible review. Primary button with the design's verb; "Cancel" (→ SA-02b; nothing is recorded). Freshness "Read at [time] IST". | L | UX §6.3, §7.3; PL §3.4 SA-09 ("approve or decline help"); WP-06 design §2.7.1, §2.7.5; `WP-06.md` D-06, D-07 |
| WP09-A28 | SuperAdmin (SA2); test | SA-09 help decision of K (assigned to OP2, work not started, unpaid; §3 V07-D2) | Read the page. | As A27, with Operator "[OP2]" and the in-place effect: "Approving starts the help at once: [OP2] can enter information. TravelMudra checks Gate 1 for the operator's first work on this assignment when you approve." Evidence adds: "Operator's work on this assignment: Not started" (`ops.case_work`; "Unavailable" when that optional read fails for availability), the gate exceptions table (no first-work exception), service payment "Not recorded". Links (not forms): "Record the payment" (SA-07a), "Gate 1 exception for the first operator work" (SA-09g `gate1_first_work`). The approve choice stays: the page predicts no refusal (Core decides; a Gate 1 context for this action is Deferred until the Core batch, P-10 e). Where a return is open (test fixture), the effect adds: "Approving ends the return: the operator enters the information instead of the travel agent." | L (K) + T (return) | `WP-06.md` D-05, D-07; `assignment.ts` `decideAssistance` (`inPlace`, `requireGate1AtWork`, return resolution `assistance_approved`); P-10 e |
| WP09-A29 | SuperAdmin (SA1) | SA-09 help decision of H (§3 V07-C2) | Send with no choice and no reason. Then with a choice and no reason. | C1 error summary, focused; each link moves to its field ("Choose approve or decline." / "Give the reason."); the values and the choice stay; nothing recorded. | L | AC-08; CMP-07; `zReason`; `decision` enum |
| WP09-A30 | SuperAdmin (SA1) | SA-09 help decision of H (§3 V07-C2) | Choose "Decline", give the reason, send. | C3 receipt "Help declined" (named only because a read by the returned request id shows that request declined; otherwise "Request recorded"); Current: "Help request: Declined"; "Application: unchanged (Draft)". SA-02b H row gone (delta − 1); SA-01 group 4 − 1. TA side: A17. | L | WP-06 D-02; `assignment.ts` (`assistanceId` in the summary); `core.admin_case` `assistance` (latest request) |
| WP09-A31 | SuperAdmin (SA1) | SA-09 help decision of H's second request (§3 V07-C4) | Approve with a reason. | C3 receipt "Help approved" (read by id: approved); Current: "Help request: Approved. Next: an operator is needed" (Core's answer `assistance_approved`, owner SuperAdmin) with the link "Assign an operator" (SA-03a). The receipt states what was recorded and Core's current next step labelled "Current"; a later replay shows the facts of that time, not this step (A78). SA-02a lists H as approved help (delta + 1); SA-01 group 3 + 1, group 4 − 1. | L | BS B18; WP-06 design §2.2.1; `WP-07.md` F-01; `derived.ts` rule 12 |
| WP09-A32 | SuperAdmin (SA2) | SA-09 help decision of K (§3 V07-D2, V07-D4) | Approve with a reason. Then (set-up V07-D3) record the Gate 1 exception for the first operator work on SA-09g. Open the help decision again; approve. | First send: refused, in words: "Approving help on this application starts the operator's work, and Gate 1 is not met for it: the service payment is not recorded as received and no fresh Gate 1 exception for the first operator work exists. Owner: SuperAdmin." with the two routes of A28; the choice and reason stay; nothing recorded; the request stays "Requested" (SA-02b row stays). Second send (new key, reloaded page): C3 receipt "Help approved"; Current: Editing "An operator is entering information with the travel agent's approval"; the exception row "Gate 1, for the first operator work: Action allowed by exception, used", never "Payment received"; the payment follow-up that the used exception opened (SA-01 group 11 + 1, accountable SuperAdmin SA2; group 11 reads a projection, so the delta is read when its freshness line reads up to date). | L | `WP-06.md` D-07 (review R-07); WP06-A147 (T there; L here); `assignment.ts` (`requireGate1AtWork`, `consumeException`, `openFinancialException`); `WP-07.md` F-05 |
| WP09-A33 | Test | SA-09 help decision on a formally returned application (fixture: submitted, returned to the TA, help requested by the TA, work started on the assignment) | Approve. Read TA-07 and OP-02. | Accepted (Gate 1 for the first work rests on the recorded basis). The return closes (Core's resolution `assistance_approved`): TA-07 Editing changes from "Returned to you for correction" to "An operator is entering information with your approval"; OP-02 shows the approved-assistance task. The decision page stated this before the button (A28). | T | `assignment.ts` `decideAssistance`; BS B18 |
| WP09-A34 | SuperAdmin (SA1); test | SA-09 help decision | (1) Open the page of H's first request after the decline (§3 V07-C4). (2) Open it with a request id of another application. (3) Test: the application is completed or withdrawn while a request is open. | (1) "This help request was declined. There is nothing to decide." (or "approved", "completed"), with a link to the newer open request when one exists; no form. (2) The uniform not-found page. (3) "The application is not open." (`application_not_open`); no form; a hand-made send is refused with the same words; nothing recorded. | L ((1), (2)) + T | `assignment.ts` (`stale_revision` for a request that is not the open one; `application_not_open`); WP-06 design §2.7.1 |
| WP09-A35 | SuperAdmin (SA1), two tabs; TA (Y); test | SA-09 help decision of H's second request (§3 V07-C3a) | Tab 1: open the decision. Y changes a declared field of H on TA-09d. Send tab 1 ("Approve"). Then decide from the refreshed page. Test: two SuperAdmins decide the same request at once. | Tab 1: C5 (CMP-14) "Changed since you opened this page" with the changed facts beside the unsent choice and reason, which stay; nothing recorded. The refreshed page decides once. Test: one decision wins; the other send gets C5 that says "Already decided: [state]" from the re-read, not a generic error. | L+T | UX §3.3; BS B19, B35; `requireRevision`; `assignment.ts` (`state = 'requested'` guard) |
| WP09-A36 | SuperAdmin; harness | SA-09 help decision, the Nth time | Replay terms 1 to 5 on A31. Term 2 changes "Approve" to "Decline". Term 3: Back after the receipt; harness: a new-key send with the current revision. Term 4: A29, then corrected. | (1) One decision; the same receipt; one notice to the TA. (2) Refused as a used form; the request stays approved; nothing recorded. (3) Back reloads SA-09 with "already decided" and no form (A34); the new-key send is refused: Core answers `stale_revision` for a decided request (no separate duplicate code) and the page says "Already decided: Approved" from the re-read (Q-08). (4) Recorded once. (5) C4; no new decision is offered there. A raw stale envelope (new key, older revision) → C5 with the changed facts. The refused in-place approval of A32 resent after the exception is accepted once. | L+T | PL §7 K-STD; BS B35; W1 A-02, A-08; WP-06 D-12; `assignment.ts` |
| WP09-A37 | SuperAdmin | SA-09 help decision, SA-02b, the SuperAdmin case page | Look for controls. | No assistance-entry form, no "Submit for TA", no "Confirm readiness", no "Return for TA review" on any SuperAdmin page. SA-09 receipts never say "submitted", "ready" or "approved" about the application; "Help approved" names the help request only. | L | BS B18 ("A SuperAdmin cannot make that judgment or file"); UX §2.3; PL §11.1 |
| WP09-A38 | SuperAdmin; test | Old SuperAdmin case page of H while its request is open; SA-02b; SA-01 | Open the pages. | The carried help-decision form has left the old case page; a link "Decide on the help request" → SA-09 replaces it. SA-02b "Decide" and SA-01 group 4 items open SA-09. A unit test lists the forms that left and the carried forms that stay (for example the WP-17 deferral decision). | L+T | LD-02; LD-07; CC-04; CC-12; WP06-A110; `admin.ts` (section `assistance`) |

### 2.4 OP-02 approved-assistance task (`core.record_assistance_entry`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP09-A39 | Operator (OP1) | OP-02 of H after its assignment for help (§3 V07-C6) | Read the page from the top. | Above the tabs, a labelled task "Approved assistance": "The travel agent asked for help and a SuperAdmin approved it. You may enter the application information listed below. When you finish, return it for the travel agent's review: they check every answer and submit it themselves (or hand it back). Help never confirms, submits or pays for them." The travel agent's request note verbatim. The editable scope: the service's declared fields, country of residence, passport type, identity details (with same-person evidence), documents. Action panel from Core's answer (owner you; "Enter the information within the approved help"); secondary "Return for TA review" (OP-03r). No "Submit for TA". OP-01: H in "Action now" (delta + 1). | L | UX §5.3 (Assistance); PL §3.3 OP-02, §4.2 A4, A5; BS B18; `derived.ts` rule 13 |
| WP09-A40 | Operator (OP1) | OP-02 approved-assistance form of H | Read every input. | One input per declared field of the governing declaration, labelled, with the current value (choices from the declared options); "Country of residence"; "Passport type"; identity: surname, given names, date of birth, passport number, issuing country, nationality (current values); "Identity documents that show the change" (one checkbox per identity document of this application, named by type); "Where the information came from" (required). The rule in words before the identity inputs: "A change to an identity detail needs a document of this application that shows the new value and enough unchanged details to show it is the same person." Button "Record the information". | L | BS B19; `drafts.ts` (`zEntry`); `corrections.ts` `requireSamePersonEvidence`; `core.ops_case` (`formFields`, `identityEvidence`) |
| WP09-A41 | Operator (OP1) | OP-02 and OP-03f of H before the first-work exception (unpaid; §3 V07-C7) | Correct the given names with the passport ticked and an explanation. Send. Open OP-03f. Harness: post a flag. | Refused, in words: "Your first entry on this assignment needs Gate 1: the service payment recorded as received, or a SuperAdmin's Gate 1 exception for the first operator work. Owner: SuperAdmin." and the D-06 known gap: "A flag is not available while approved help is in progress. Ask a SuperAdmin directly: no in-product request exists for this state yet." The typed values and the ticked document stay; nothing is recorded (snapshot and correction counts unchanged). OP-03f shows the same gap and no form; the hand-made flag is refused (`hold_not_applicable`) and records nothing. Before the send OP-02 shows no Gate 1 prediction for this entry (the operator read returns no payment or gate context: Deferred until the Core batch, P-10 e). | L | `WP-06.md` D-06; WP06-A148; `drafts.ts` (`requireGate1AtWork` → `gate1_payment_not_received`); `holds.ts` `flag` (`editor_state = assigned` only); WP-07 design §2.6.2; P-12 |
| WP09-A42 | Operator (OP1); SuperAdmin; TA; test | OP-01, OP-02, TA-07, SA-01, SA-02 and SA-09g of H while Gate 1 for its first work blocks (§3 V07-C7) | Read the pages. | Today (recorded, not a fail): Core's answer names the assigned operator (`hold_assistance_in_progress`, `start_operator_work`) and no SuperAdmin queue lists H. **Deferred until the Core batch** (P-12 option C as narrowed, with P-10 e): Core substitutes owner SuperAdmin, reason `gate1_payment_not_received`, next action `grant_or_refuse_gate_exception` and the operator as follow-up; then OP-02 names the SuperAdmin ("SuperAdmin decision needed: Gate 1 for your first work") with you as follow-up; OP-01 places H in "Waiting"; TA-07 reads "TravelMudra is reviewing the application. Nothing is needed from you."; SA-01 and SA-02 list H from the queue kind `first_work_gate1` with its read time and truncation flag; SA-09g shows an unusable first-work exception's id and failure with "Revoke, then grant again". | T (when served); Deferred | PROPOSALS P-12 (Max: option C narrowed); P-12 §11.1 to §11.4; PLAN §7 #25, §8 S-08 |
| WP09-A43 | Operator (OP1) | OP-02 of H after the first-work exception (§3 V07-C9) | Correct the given names to the passport's value; tick the passport; give the explanation; send. | C3 receipt "Information recorded" (named: on the operator surface only this command returns a correction id with a stage; stage "applied"). Current: the identity facts as read now (given names corrected); "Gate 1, for the first operator work: Action allowed by exception, used", never "Payment received". The passport row shows Core's state truthfully ("Processing" until Documents decides again, then "Accepted"). Stage stays "Draft". | L | `drafts.ts` (`correctionId`, `stage`); `corrections.ts` (`reevaluateForApplication`); `test/system/case-rules.test.ts` "lets the assigned operator correct identity details in an assistance entry, only with the application's passport showing them"; `WP-07.md` F-05 |
| WP09-A44 | Operator; harness; test | OP-02 approved-assistance form of H (§3 V07-C9, V07-C10) | (1) Change the given names with no document ticked. (2) Change the surname and the given names with the passport ticked (the passport does not show the new surname). (3) Send no change. (4) Send an empty explanation. (5) Harness: tick more identity documents than Core's limit (fixture with five identity documents). (6) Harness: a declared field value outside its options. (7) Test: a nationality outside the served population. (8) Harness: an entry on P (ordinary work) and on H after the return for review. (9) OP2 posts an entry on H. | (1), (2) "The identity documents do not show that this is the same person. Choose a document of this application that shows the new details." (`identity_same_person_evidence_insufficient`). (3) "Nothing changed." (`correction_no_change`). (4) C1 on the explanation. (5) A field error on the documents that states Core's limit; the ticks stay; never silently dropped (today's form keeps four silently, Q-02). (6) A field error on that field (`not_an_option`). (7) `population_out_of_scope` in words. (8) P: "You can enter application information only within approved help. Return the application to the travel agent for a change." (`assistance_not_approved`); H: "The application is with the travel agent for review." (`hold_returned_to_ta`). (9) The access page (SH-02). The typed values stay in each re-rendered form; nothing is recorded. | L ((1) to (4), (8), (9)) + T ((5) to (7)) | `drafts.ts`; `corrections.ts`; `controls.ts` `editorStage`; `model.ts` `validateFormFields`; `case.ts` `identityChangesOf`; WP-06 D-10; WP-08 E-04 |
| WP09-A45 | Test | Approved-assistance entry on a submitted application whose act is authorized or whose filing is unknown (fixture) | Record an entry. | The receipt from stage "held": "Information held: a filing may have happened. The change waits until the act is reconciled; the protected facts do not change." No text claims that the change applied. Where Core refuses (`filing_possibly_occurred`, `correction_historical_after_filing`), the refusal in words. | T | BS B23; `corrections.ts` (`correctionStage`, `applyCorrection`) |
| WP09-A46 | Operator (OP1), two tabs | OP-02 approved-assistance form of H (§3 V07-C9b) | Tab 1: open the form and change a declared field. Tab 2: record another entry. Send tab 1. | C5 "Changed since you opened this page" with the changed facts beside the unsent values; the typed values stay; nothing overwritten; the send from the refreshed form is recorded once. | L | UX §3.3; BS B19 ("No latest-write-wins"); `requireRevision` |
| WP09-A47 | Operator (OP1); harness | Approved-assistance entry, the Nth time | Replay terms 1 to 5 on A43. Term 2 changes one field. Term 3: Back after the receipt; send the reloaded form unchanged. Term 4: the refusal of A41, then the same values after the exception. | (1) The original receipt and correction id; one correction; one snapshot. The identity values reach Core as posted, the same for the same input, never as a difference from the identity read at send time; so a replay after acceptance is the same content (WP-03 C-04 class; today's form computes the difference, Q-02). (2) Refused as a used form; values kept; nothing recorded. (3) The reloaded form shows the current values; its send is refused "Nothing changed." (`correction_no_change`, the business answer) and records nothing. (4) Recorded once. (5) C4; no new entry is offered there. | L+T | PL §7 K-STD; BS B35; WP-03 C-04; `case.ts` `identityChangesOf`; Q-02 |
| WP09-A48 | Operator (OP1); test | OP-02 of H: documents inside the approved-assistance task | Add a synthetic photograph (carried WP-03 operator upload). After the return for review, look again. | The upload is reachable inside the task while help is in progress, with its own result; after the return for review the control is gone, and a hand-made upload is refused. | L (optional in the run) + T | CC (`doc.upload_for_application`, "OP-02 (assistance upload, ops route)"); `ops.ts` (`canUpload`); `test/system/core-pages.test.ts` "lets the assigned operator add a document during approved assistance…" |
| WP09-A49 | Test | Approved-assistance entry after a reassignment | Reassign an unpaid help application whose first entry used a first-work exception. The previous operator sends an entry; the new operator sends an entry. | Previous operator: the access page (SH-02). New operator: refused for Gate 1 at the first work of the new assignment (the earlier basis does not carry over), with the words of A41. | T | BS B19, B26; `test/core/assignment-holds.test.ts` "consumes a start exception once at the first assistance entry … a new assignment needs Gate 1 again"; P-12 §2 |
| WP09-A50 | Operator (OP1, OP2) | OP-03r of H and of K in approved help (WP-07 page; §3 V07-C10, V07-D5) | Open "Return for TA review". Send with a note that names what you entered. | The page and the button read "Return for TA review", never "Submit for TA" (WP07-A48); the effect "The travel agent reviews what you entered and submits; help never confirms or submits for them." After the receipt (WP-07): OP-02 has no approved-assistance task; the status reads returned to the travel agent for review; OP-01 moves the application to "Returned to TA" (delta). A hand-made entry is refused (A44 (8)). | L | UX §5.3; PL §4.2 A5; BS B18; WP07-A48; `holds.ts` `formalReturn` |
| WP09-A51 | Operator (OP1) | OP-02 of P (ordinary assigned work) | Look for editable application fields in every tab. | No editable application field anywhere; the route for a change is "Return to TA". | L | UX §5.3 ("Ordinary work shows no editable application fields"); BS B18; WP07-A32 |
| WP09-A52 | Phone user, operator | OP-02 approved-assistance task at 390 px | Send the form with an error; correct; send. | Stacked: identity → action panel and the task label → the form; each input labelled; the error summary visible when focused; the button at the end, not in a fixed bar. No horizontal page scroll. | L | UX §7.3; AC-04, AC-21 |

### 2.5 OP-02 holds: problem report and flag resolution (`core.resolve_hold`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP09-A53 | Operator (OP1) | OP-01 and OP-02 of P after Y's report (§3 V07-A3) | Read OP-01. Open P. | OP-01: P in "Action now" marked "Problem reported" (deltas by the WP07-A03 mapping). OP-02: above the tabs, "The travel agent reported a problem on [date time] IST: '[note verbatim]'. Filing authorization and packet release wait until you deal with it and confirm readiness again." Readiness "On hold: problem report". No authorization request offered. Routes: "Resolve the report" and "Return to TA" (OP-03r, with "This return answers the travel agent's problem report"). | L | UX §3.2; BS B18; PL §4.2 R1; WP07-A31; `derived.ts` (rule 11, `readinessView` `held`) |
| WP09-A54 | Operator (OP1) | Resolve the report of P | Open "Resolve the report". Read. Select "Cancel". | Scope: the application; "This report only." Evidence: the report text verbatim and its time. Effect: "Resolving closes the report. It changes no application data. The travel agent is told that you resolved it. The report changed the readiness basis: confirm readiness again before any filing authorization or packet release." The choice to return instead (link to OP-03r). Field "How you dealt with it" (required). Visible review; "Resolve the report"; "Cancel" (nothing is recorded). | L | UX §5.3; BS B18; `holds.ts` `resolveHold`; `derived.ts` (`holdRevision` in the readiness basis) |
| WP09-A55 | Operator (OP1) | Resolve the report of P (§3 V07-A4) | Write how you dealt with it. Send. | C3 receipt "Problem report resolved" (named: on the operator surface a problem-report hold id comes only from this command). Current: "Problem report: none open"; "Readiness: Out of date: confirm readiness again"; next "Confirm readiness". OP-01: P leaves the problem severity (delta). TA side: A09. | L | WP-06 D-02; `holds.ts`; `derived.ts` `readinessView` (`stale_basis`) |
| WP09-A56 | Operator (OP1); harness | OP-02 of F while the flag waits (§3 V07-B2) | Read. Harness: post a resolution of the flag. | A notice: "You flagged this application to a SuperAdmin on [time] IST: '[note]'. Waiting for the answer. Filing authorization and packet release wait until you resolve the flag after the answer and confirm readiness again." No resolve form. The hand-made post: "A flag can be resolved only after a SuperAdmin answered it." (`flag_response_missing`); nothing recorded. OP-01: F in "Waiting", "SuperAdmin decision needed" (delta). | L | BS B18; `holds.ts` `resolveHold`; `derived.ts` rule 9; WP07-A03 |
| WP09-A57 | Operator (OP1); test | OP-02 of F after SA2's answer (§3 V07-B5) | Read the notice and the action panel. Run the unit test of the panel mapping. | The SuperAdmin's answer verbatim with "Answered [time] IST". Action panel: owner you, "Read the SuperAdmin's answer and resolve the flag", action "Resolve the flag". It never says "the travel agent's problem report" and never offers "Return to TA" as the primary action (Core's answer: reason `hold_flagged_to_superadmin`, next action `resolve_problem_report`; Q-01). OP-01 moves F to "Action now" (delta). The unit test maps every (reason, next action) pair that Core returns for holds and help to one text and one action, for the operator and for the TA. | L+T | `derived.ts` rule 10; WP-07 design §2.4 (action panel row 3); `presentation.ts`; Q-01 |
| WP09-A58 | Operator (OP1) | Resolve the flag of F (§3 V07-B6) | Write how you resolved it. Send. | The effect before the field as A54 (readiness again). C3 receipt: a flag resolution and the flag itself return the same shape (application and a flag hold id), so the receipt names "Flag resolved" only where a read establishes it, else "Request recorded" (Q-07); Current: "Flag: resolved"; "Readiness: Out of date: confirm readiness again". SA-02c: F's row gone; SA-01 group 5 back to baseline. | L | WP-06 D-02; `holds.ts` (`flag` and `resolveHold` both return `holdId` `flg_…`); Q-07 |
| WP09-A59 | Operator (OP1); harness | OP-02 of P while returned (§3 V07-A7) | Look for a resolve control on the return. Harness: post a resolution of the return hold. | No resolve control for a return: "The travel agent closes a return by handing the application back (or by submitting a returned draft)." The hand-made post: "A return is closed by the travel agent, not by you." (`hold_not_operator_closable`); nothing recorded. | L | `holds.ts` `resolveHold`; `test/core/assignment-holds.test.ts` "returns formally, keeps the operator, …" |
| WP09-A60 | Operator; SuperAdmin; harness; test | Resolve | (1) Send an empty note. (2) Harness: resolve P's resolved report again with a new key. (3) Test: a hold id of another application. (4) OP2, `operator-3` (read grant) and SA1 post a resolution on P. | (1) C1. (2) C5 from the re-read: "This report was already resolved." (Core answers `stale_revision` for a hold that is not open; Q-08). (3) The access page (`access_denied`). (4) The access page for each. Nothing is recorded in each case. | L ((1), (2), (4)) + T | `holds.ts` `resolveHold`; `policy.ts` (`operator.resolve_hold`: assigned operator); `test/core/assignment-holds.test.ts` "flags to the SuperAdmin: the response never closes the hold; only the operator resolves it after a response" |
| WP09-A61 | Operator (OP1); harness | Resolve, the Nth time | Replay terms 1 to 5 on A55. Term 2 changes the note. Term 3: Back; a new-key send. Term 4: A60 (1), then corrected. | (1) The same receipt; one resolution; one TA notice. (2) Refused as a used form; nothing recorded. (3) Back reloads OP-02 with no open report and no form; the new-key send answers as A60 (2). (4) Recorded once. (5) C4. The hold's own state is the guard; the command carries no revision. | L+T | PL §7 K-STD; BS B35 |
| WP09-A62 | Operator (OP1), two tabs | Resolve the second report of P (§3 V07-A7) | Tab 1: open the resolve form. Tab 2: return P answering the report (OP-03r). Send tab 1. | C5 from the re-read: "This report was already resolved by your return." The note stays; nothing recorded. | L | UX §3.3; `holds.ts` |
| WP09-A63 | Operator (OP1) | OP-02 readiness row of P and F through §3 | Read the row at each step. | Core's validity in words: "Recorded by you" before; "On hold: problem report" (P) or "On hold: flag" (F) while a hold is open; still "On hold" after the SuperAdmin's answer (an answer does not change the readiness basis); "Out of date: confirm readiness again" after the resolution or the hand back; "Recorded by you" after the reconfirmation (set-up). | L | BS B18, B19; `derived.ts` (`readinessView`, `readinessBasis`); `holds.ts` (`respondFlag` moves the revision only) |
| WP09-A64 | Test | OP-02 of an application with approved help in progress and an open problem report (fixture; Q-03) | Read. Record an entry. Return for review answering the report. | The report shows inside the approved-assistance task; the entry is accepted (a report does not stop entry); the return answers it; the report then reads resolved. | T | `holds.ts`; `controls.ts` `editorStage` |
| WP09-A65 | Phone user, operator | Resolve page at 390 px | Send empty; then with a note. | Scope and effect before the field; error summary visible; the button at the end. No horizontal page scroll. | L | AC-04, AC-21 |

### 2.6 SA-02c, SA-01 group 5 and the SA-09 flag response (`core.respond_flag`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP09-A66 | SuperAdmin (SA2) | SA-02c after V07-B1, V07-B3 and V07-B6 | Read the page. Select "Answer" on F. | `h1` "Flags from operators"; lead as WP-06 design §2.2.3. Rows of `core.admin_queue {flags}`: Application; "Waiting for": "Your answer" where Core's next action is `respond_to_flag`; "The operator, after your answer" where Core's answer is the answered flag (reason `hold_flagged_to_superadmin`, owner the operator); otherwise "Flag open. Current step: [Core's answer in words]", with no claim about the answer (Q-06). "Answer" → SA-09 flag response (the page shows "already answered" itself). Freshness "Read at". A cap line only at Core's limit. S2: "No flag is open." Rows: after B1 baseline + 1; after B6 baseline. | L | WP-06 design §2.2.3; `lists.ts` (`flags`: open holds); `derived.ts` rules 9, 10; Q-06 |
| WP09-A67 | SuperAdmin (SA2) | SA-01 group 5 during §3 Part B | Read after B1, B3 and B6. | "[n] flags open" and "Waiting for your answer: [r] flags" (rows with next action `respond_to_flag`): after B1 + 1 and + 1; after B3 + 1 and baseline; after B6 baseline and baseline. Item lines open the SA-09 flag response. | L | WP06-A02; WP-06 design §2.1 group 5 |
| WP09-A68 | SuperAdmin (SA2) | SA-09 flag response of F (§3 V07-B3) | Read the page. Select "Cancel". | CMP-25 order. `h1` "Answer a flag: [applicant]". Scope: application reference, service, travel agent; the operator who flagged (by name where the read names the account) and "Opened [time] IST". Evidence: "What the operator asks:" the note verbatim; open holds; readiness; links (not forms) to separate decisions: "Gate 1 exception for the first operator work" (SA-09g), "Gate 2 decision" (SA-09 `gate2_commitment`), "Service payment" (SA-07a). Effect: "Your answer is recorded for the operator. It decides nothing else: it records no payment, grants no exception, asserts no readiness and closes no hold. The flag stays open until the operator resolves it; filing authorization and packet release wait until then and until the operator confirms readiness again." Your decision: "Answer to the operator" (required) and "Reason for the record" (required), two labelled fields; the page copies neither into the other (Q-09). Visible review; "Send the answer"; "Cancel" (→ SA-02c; nothing recorded). | L | UX §6.3; PL §3.4 SA-09; CC-04; WP-06 design §2.7.5; `holds.ts` `respondFlag` |
| WP09-A69 | SuperAdmin (SA2) | SA-09 flag response of F | Send with both fields empty; then with an answer and no reason. | C1 error summary; links to the fields; values kept; nothing recorded. | L | AC-08; `zNote`, `zReason` |
| WP09-A70 | SuperAdmin (SA2) | SA-09 flag response of F (§3 V07-B3) | Answer and give the reason. Send. | C3 receipt "Answer recorded" (named: on the SuperAdmin surface only this command returns a flag hold id); Current: "Flag: answered [time] IST. The operator resolves it."; SA-02c row "The operator, after your answer"; SA-01 group 5 "Waiting for your answer" − 1. No text says approved, granted, paid or ready. Operator side: A57. | L | WP-06 D-02; `holds.ts` `respondFlag` (staff notice) |
| WP09-A71 | SuperAdmin (SA1); harness | SA-09 flag response of F after the answer (§3 V07-B4) | Open the page. Harness: another answer with a new key. | "This flag was answered on [time] IST: '[answer]'. The operator resolves it." No form. The hand-made send: "The flag was already answered." (`flag_already_responded`); nothing recorded. | L | `holds.ts` `respondFlag` |
| WP09-A72 | SuperAdmin; test | SA-09 flag response | (1) Open it for F after the operator resolved the flag. (2) A flag id of another application. (3) Test: two SuperAdmins answer at once. | (1) "The operator resolved this flag." No form. (2) The uniform not-found page. (3) One answer recorded; the other `flag_already_responded`. | L ((1), (2)) + T | `holds.ts` (`access_denied`; guard `responded_at IS NULL`) |
| WP09-A73 | SuperAdmin; harness | SA-09 flag response, the Nth time | Replay terms 1 to 5 on A70. | (1) The same receipt; one answer; one operator notice. (2) Refused as a used form; the answer unchanged. (3) Back reloads "already answered" (A71); a new key: `flag_already_responded`. (4) A69, then corrected: once. (5) C4. The command carries no revision: no stale case; the business check answers. | L+T | PL §7 K-STD; BS B35 |
| WP09-A74 | SuperAdmin | SA-09 flag response page and receipt | Read all text. | The answer is not a decision: no "Approved", "Exception granted", "Payment recorded", "Ready" or "Override". A SuperAdmin who grants Gate 1 or Gate 2 uses those decision pages (links). | L | UX §6.3 ("Never use one 'Admin override'"); BS B20 |
| WP09-A75 | SuperAdmin; test | Old SuperAdmin case page of F while the flag waits; SA-02c; SA-01 | Open the pages. | The carried flag-response form has left the old case page; a link "Answer the flag" → SA-09 replaces it; SA-02c and SA-01 open SA-09. A unit test lists it. | L+T | LD-02; CC-04; CC-12; `admin.ts` `respondForm` |

### 2.7 Command results, access and shell on WP-09 pages

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP09-A76 | TA; operator; SuperAdmin | Every WP-09 page | Read the shell. | Environment label; "[TEST]" title prefix; rail current item: "Applications" on TA pages; "My work" (or "Applications" when opened from there) on OP-02 and the resolve page; "Work queues" on SA-02b, SA-02c and the SA-09 pages opened from them; breadcrumb; one `h1`; a freshness line where the page shows read facts. | L | PL §2.1, §2.2; WP01-A07 |
| WP09-A77 | TA; operator; SuperAdmin; harness | Every accepted WP-09 command; edited receipt addresses | Read each receipt. Open edited addresses: on OP-02, a resolve `done` code with the key of OP1's flag; on SA-09, a help `done` code with the key of a flag answer; on TA-07, a report `done` code with a help-request key; the key of another application's operation. | Naming rules (surface by surface): TA report (`prb_` hold id) → "Problem reported". SuperAdmin help decision (request id; a read by that id shows approved or declined) → "Help approved" / "Help declined", else "Request recorded". SuperAdmin flag answer (`flg_` hold id) → "Answer recorded". Operator entry (correction id with a stage) → "Information recorded" / "Information held". Operator resolution of a report (`prb_`) → "Problem report resolved"; of a flag (`flg_`, the same shape as OP1's flag) → named only when a read establishes it, else "Request recorded" with Current facts. An edited address never shows another command's title; another application's key: "Request reference [key]. The receipt cannot be checked now." No accepted time (P-02). | L+T | WP-06 D-01, D-02; W1 A-04; W3 C-03; Q-07 |
| WP09-A78 | TA; SuperAdmin; operator | Receipt addresses of A03, A31 and A43, opened again after later steps (§3 V07-A5, V07-C12) | Open each address again. | Each receipt shows what was recorded and the facts that are current now, labelled "Current" (no open report; Submitted; returned for review). No receipt or status read tells anyone to act from an older state ("Assign an operator" no longer shows on A31's receipt once H is assigned). | L+T | `WP-07.md` F-01 (class fix) |
| WP09-A79 | TA; operator; SuperAdmin | Each command of §1.2 with a lost acknowledgement (fixture); a refused send | Inject the fault. Open the operation status page. Select "Check status" after the original resolves. Open the status page of a refused send's key. | C4 (CMP-13) "Checking the original result" and "Check status"; no new send of the same intent is offered there. "Check status" reads the same operation and shows its accepted result. A refused send leaves no operation record: "Nothing is recorded for request [reference] so far". A refusal, and any stale comparison, shows only on the re-rendered form. | T | PL §1.1 UNR; BS B35; W1 A-08; WP06-A104 |
| WP09-A80 | Harness | Each command of §1.2 | (1) Identical replay after acceptance. (2) Same key, changed content. (3) Business duplicate: a new key with the current page's facts for an intent Core already holds. (4) Raw stale envelope: a new key with an older page's revision. (5) Raw resend of a refused envelope after the facts changed. | (1) The original result; no second hold, decision, correction, answer or notice. (2) Refused as a conflict; nothing recorded. (3) The command's own check answers: report `problem_report_open`; decision `stale_revision`, shown as "Already decided" from the re-read; entry `correction_no_change`; resolution `stale_revision`, shown as "Already resolved"; answer `flag_already_responded`. (4) Decision and entry: `stale_revision`, CMP-14 with the current facts; report, resolution and answer carry no revision, so their stale case is the business check. (5) The refused key has no record, so Core evaluates again: a report refused on a returned case is accepted after the hand back; the in-place approval and the first entry are accepted after the first-work exception; a flag resolution is accepted after the answer. A duplicate test uses (3), never (4) or (5). Browser Back is not a replay. | T | WP-06 D-12; PL §7 K-STD; BS B35 |
| WP09-A81 | TA; operator; SuperAdmin | Every refusal reachable on `lane-ui` in §2.1 to §2.6 | Read each message. | CMP-07 with the reason in words and the owner or route where one exists. Never a code alone, except the UAT-13 fallback. No "Something went wrong", "Invalid data" or "A requirement of this item is not met." | L | PL §1.1 REJ, §11.1; CR-01 |
| WP09-A82 | — | Text map of every reason code that the WP-09 pages can show | Check the map against Core's vocabulary (unit test). | Each code has text in the role's words (TA "you", staff wording): `problem_report_open`, `hold_not_applicable`, `application_not_open`, `awaiting_formal_return`, `hold_assistance_in_progress`, `assistance_not_approved`, `assistance_request_open`, `hold_returned_to_ta`, `gate1_payment_not_received`, `gate_exception_consumed`, `outcome_already_recorded`, `assignment_changed`, `identity_same_person_evidence_insufficient`, `correction_no_change`, `population_out_of_scope`, `correction_historical_after_filing`, `filing_possibly_occurred`, `hold_not_operator_closable`, `flag_response_missing`, `flag_already_responded`, `stale_revision`, `conflict_operation_key`, the offering codes of stages 4 to 6, and the field codes `not_declared`, `not_an_option`, `too_long`, `date_invalid`, `country_code_invalid`. The pending reasons `assistance_requested`, `assistance_approved`, `hold_assistance_in_progress`, `hold_problem_reported`, `hold_flagged_to_superadmin` read per (reason, next action), not per next action alone (A13, A57). `access_denied` renders SH-02, never a text. | T | CR-01; SC §3.4 (UAT-13); `src/apps/shared/core/shared.ts`; `presentation.ts` |
| WP09-A83 | TA; operator; SuperAdmin | TA-07, OP-02, the resolve page, SA-02b, SA-02c and both SA-09 kinds (HTTP tests with access revoked between the page's first read and an optional read; a reassignment between two reads of OP-02) | Let an optional read answer an access, authentication, maintenance or support-view refusal. | The page renders the access page (SH-02, sign-in or maintenance), never the facts read earlier. Only an availability failure degrades a block to "Unavailable" (for example "Operator's work on this assignment: Unavailable" on A28). No page code catches every error around a read. After a reassignment, the previous operator's next read or command gives SH-02, also on the entry and resolve forms. | T | LD-14; PL §2.3 SH-R04; BS B10 |
| WP09-A84 | TA; operator; SuperAdmin | Every WP-09 page | Look for controls of the other roles. | TA pages: no resolve, answer or help-decision control. Operator pages: no help decision, no flag answer, no Gate 1 decision, no "Submit for TA". SuperAdmin pages: no assistance entry, no hold resolution, no report, no readiness, no filing. | L | BS B18; UX §2.3, §12 V15; PL §11.1 |
| WP09-A85 | TA; operator; SuperAdmin | Every WP-09 page | Read all visible text. | No forbidden label of §11.1 ("Submit for TA", "Override", "Admin override", "Approved" or "Done" as an overall status, "Ready" as a universal state, "Force complete"); no "Unread" or "Mark as read". "Help approved" names only a help request. Times carry IST; counts name their unit; synthetic data carries the synthetic label. No page states a configuration number it does not read (exception lifetime, row limits). | L | PL §11.1; CR-03, CR-06, CR-07, CR-08; WP-01 Q-13; WP-08 E-12 |
| WP09-A86 | Operator (`operator-3`); SuperAdmin in a support view of Y (test) | OP-02 of P with the group read grant; TA-07 of P in the support view | Read the pages. Harness: post a resolution and an entry as `operator-3`; post a report and a help request in the support view (test). | Read grant: the banner "Read-only access: [purpose], until [date time] IST"; no task, form or action; each post refused as not found. Support view: "Read-only view for [individual]"; no report or help control; each post refused with the support-view refusal. Nothing is recorded. | L (grant) + T (support view) | UX §2.3 ("A read grant cannot add case actions"); BS B10; PL SH-R09, SH-R10 |
| WP09-A87 | TA; operator; SuperAdmin | TA-07, OP-02, both SA-09 kinds | Inspect `localStorage`, `sessionStorage` and IndexedDB after use. Read the response headers. | No report text, help note, answer, identity value or document id is kept in browser storage. Signed-in pages send `no-store`. | L+T | PL §2.3 SH-R12 |
| WP09-A88 | — | Rebuilt pages and the old pages they replace | Open each page where Core offers a carried form of another package (for example the WP-17 deferral decision, withdrawal and price forms; the WP-10 and WP-12 forms on the operator case page). Check that the WP-09 forms left the old pages. Run the route test. | Each carried form keeps its markup, fields, action and success redirect and works as before. The report, help-decision, flag-answer, entry and resolve forms are on their rebuilt pages only; links replace them on the old pages. A unit test lists the carried forms by action path, and every rendered form action is a registered route. | L+T | LD-02; LD-07; WP-03 Q-01; WP06-A110; WP-08 Q-11 |
| WP09-A89 | `syn-ta-2`; operator (OP2) | TA-07 of P; OP-02 of P and its resolve path; SA-09 pages with ids of another application | Open each. | `syn-ta-2`: the uniform not-found page. OP2 (not assigned to P): SH-02 on OP-02 and on the resolve path. SA-09 with a foreign id: the uniform not-found page. No fact of P shows. | L | BS B10; UX §2.3 |

### 2.8 Accessibility (AC-01 to AC-28 that apply)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP09-A90 | Keyboard-only TA, operator and SuperAdmin | §3 steps V07-A2, A4, B3, B6, C2, C4, C9, C12, D4 at 1440 px; V07-A2 and V07-C9 at 390 px | Use the keyboard only. | Every step works with Tab, Shift+Tab, Enter, Space and Escape: report, decide (radios), tick identity documents, record the entry, resolve, answer, return for review, submit after help. No action needs a mouse, hover or drag-and-drop. | L | AC-01, AC-12 |
| WP09-A91 | Keyboard-only user | Every WP-09 page at 1440 and 390 px and at 400% zoom | Tab through the page. | Focus is visible (at least 3:1) and never hidden by the top bar, the rail or a bottom action area. | L | AC-02 |
| WP09-A92 | Phone user | TA-07, OP-02, the resolve page, SA-02b, SA-02c, both SA-09 kinds | View at 320 px, and at 1280 px with 400% zoom. | No two-dimensional page scrolling. Queue tables and the identity-evidence list scroll only inside a labelled region, or become cards. Identity, state, owner and next action come before secondary data. | L | AC-04, AC-21 |
| WP09-A93 | Any | Every WP-09 form | Inspect each input. | Each input has a visible label; the decision radios sit in a fieldset with the legend "Your decision"; each identity-document checkbox names the document type; the note, answer, reason and explanation fields say that they are required. | L | AC-05, AC-15 |
| WP09-A94 | Any | Help-request states, hold states, readiness rows, queue "Waiting for" cells | View in greyscale. | Each state has text. No state is shown by colour alone. | L | AC-06 |
| WP09-A95 | Any | Every WP-09 form | Send each form with an error. | Focus moves to the error summary; each link moves focus to its field; entered values stay; no radio is chosen by the page after an error; ticked documents stay ticked. | L | AC-08; CMP-07 |
| WP09-A96 | Screen-reader user | Receipts; the problem-report and flag notices; the approved-assistance task label | Read with VoiceOver or NVDA. | Receipts are announced politely without moving focus. The problem-report notice, the flag notice and the task label are read before the tabs. | L | AC-09, AC-16 |
| WP09-A97 | Screen-reader user | Each unavailable action: report on a returned case (A05 (2)), the first entry under Gate 1 (A41), the flag during help (A41), resolve before the answer (A56), a decided request (A34), an answered flag (A71) | Focus the control or the notice. | The reason is exposed (`aria-describedby`, or the notice in reading order). A role-forbidden action is not shown at all. | L | AC-13; CMP-10; PL §2.3 SH-R08 |
| WP09-A98 | Phone user | Every WP-09 page at 390 px | Measure each control. | Every control is at least 24 × 24 CSS px. Primary actions ("Report a problem", "Send the report", the help decision's primary button, "Record the information", "Return for TA review", "Resolve the report", "Resolve the flag", "Send the answer") are at least 44 × 44 CSS px. Checkbox and radio labels are part of their targets. | L+T | AC-10 |
| WP09-A99 | — | Every WP-09 page | Measure contrast of text, focus, state text and notices. | Normal text at least 4.5:1. Non-text indicators and focus at least 3:1. | L+T | AC-11 |
| WP09-A100 | Any | Long names and long texts; reduced motion | Use a 60-character surname and given names, a report, a help note and an answer of Core's maximum length (fixture or run data), and a long operator name. Turn on "reduce motion". | Names and texts wrap without hiding identity; a truncated text has a full form that keyboard and touch reach. No transition plays. | L | AC-14, AC-20 |
| WP09-A101 | TA and operator (observation) | TA-07 of H after the return for review; OP-02 of F after the answer | Ask the TA "Who submits this application now?" and the operator "What did the SuperAdmin's answer change?". | The run record reports the answers and the sample size; confusion of help with submission, or of an answer with a decision, is a finding. No pass target (observation only). | L | AC-24, AC-26; UX §12 (usability) |

### 2.9 axe checks (WCAG 2.2 A/AA)

Rule for every row: run axe (`@axe-core/playwright` 4.13.0, tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`,
`wcag22aa`) at 1440 × 900 and at 390 × 844. Expected: no violation of impact "serious" or "critical" at either width.
Record the counts of minor and moderate violations. The harness takes no screenshot of a page that shows a real
person's data; WP-09 uses synthetic data only.

| ID | Persona | Page (state) | Where | Source |
|---|---|---|---|---|
| WP09-A102 | TA | TA-07 of P, assigned, with "Report a problem" (A01) | L | UX §7.5; AC-01 to AC-28 |
| WP09-A103 | TA | TA-07 report form with the error summary (A05 (5)) | L | same |
| WP09-A104 | TA | TA-07 with the receipt and the open report (A03, A04) | L | same |
| WP09-A105 | TA | TA-09d of P with the assigned notice (A14) | L | same |
| WP09-A106 | TA | TA-07 of H: help requested, then declined (A16, A17) | L | same |
| WP09-A107 | TA | TA-07 of H: approved help in progress (A19) | L | same |
| WP09-A108 | TA | TA-07 of H: returned for review (A20) | L | same |
| WP09-A109 | SuperAdmin | SA-02b with rows (A25) | L | same |
| WP09-A110 | SuperAdmin | SA-09 help decision, no operator, with the review (A27) | L | same |
| WP09-A111 | SuperAdmin | SA-09 help decision with the error summary (A29) | L | same |
| WP09-A112 | SuperAdmin | SA-09 help decision in place with the Gate 1 refusal (A32) | L | same |
| WP09-A113 | SuperAdmin | SA-09 help decision "already decided" (A34) | L | same |
| WP09-A114 | Operator | OP-02 approved-assistance task and form (A39, A40) | L | same |
| WP09-A115 | Operator | OP-02 with the Gate 1 refusal and the known gap (A41) | L | same |
| WP09-A116 | Operator | OP-02 entry with the error summary (A44) | L | same |
| WP09-A117 | Operator | OP-02 with the problem-report notice (A53) | L | same |
| WP09-A118 | Operator | Resolve page with the error summary (A54, A60 (1)) | L | same |
| WP09-A119 | Operator | OP-02 with the flag waiting, then answered (A56, A57) | L | same |
| WP09-A120 | SuperAdmin | SA-02c with rows (A66) | L | same |
| WP09-A121 | SuperAdmin | SA-09 flag response with the review (A68) | L | same |
| WP09-A122 | SuperAdmin | SA-09 flag response "already answered" (A71) | L | same |
| WP09-A123 | TA; operator; SuperAdmin | Operation status page of a WP-09 command, accepted and "Nothing is recorded" (A79) | L | same |

## 3. Proof scenarios V07, BU-21 and BU-22 (to their boundary)

V07 (UX §12): "Assigned TA can report only; formal return enables permitted correction; same operator reconfirms
readiness. Approved assistance ends in TA review/submission." Authority B18 to B20. BU-21 (bulk spec): "Request help
before an application exists, then on a draft: first remains owned intake work; second uses the existing help
decision path; no invented submission or assignment/payment bypass." BU-22: "TA tries to correct an assigned,
not-returned case: report-a-problem path identifies operator and formal return; bulk correction does not circumvent
edit ownership." Authority BU §8.2; B16 to B18.

One ordered recipe (§0.4) serves the three proofs. "Setup" steps use pages of earlier packages; they are not the
subject under test. SA1 = `superadmin-1`, SA2 = `superadmin-2`, OP1 = `operator-1`, OP2 = `operator-2`.

| Step | Actor, page | Action | Observable result | Items | Where |
|---|---|---|---|---|---|
| P-0 | SA1: SA-01, SA-02a, SA-02b, SA-02c; OP1, OP2: OP-01 | Before the set-up, read the counts. | The run record holds the baselines of §0.4. | — | L |
| Setup | SA1 (SA-06, SA-07a, SA-03a, SA-09g, grant page); Y (TA pages); OP1 (OP-02) | §0.4. | Y active; P and F submitted, paid, assigned to OP1, work started, readiness "Recorded by you"; K submitted, unpaid, help "Requested", assigned to OP2 under a Gate 1 exception for assignment (SA-01 group 11 + 1); H a draft with the passport row in conflict; SA-02b rows baseline + 1 (K); `operator-3` holds the read grant. | — | L |
| V07-A1 | Y: TA-07 and TA-09t, TA-09d, TA-09i, TA-09f of P; harness | Read. Harness: post an edit, an identity correction and an upload. | Only "Report a problem"; each section shows the assigned notice; each post refused (`awaiting_formal_return`); nothing recorded. | A01, A14 | L |
| V07-A2 | Y: TA-07 of P; harness | Open the report form; Cancel. Send empty. Send "WP09 [stamp] the travel purpose on the form is wrong". Harness: a second report (new key); a replay (same key). | C1; then the receipt "Problem reported"; the report row; the second report refused; the replay returns the same receipt; nothing extra recorded. | A02 to A04, A05 (1), (5), A11 | L |
| V07-A3 | OP1: OP-01, OP-02 of P | Read. | "Action now" with "Problem reported"; the notice with the text verbatim; readiness "On hold"; no authorization. | A53, A63 | L |
| V07-A4 | OP1: resolve page of P; harness | Cancel. Send empty. Resolve with "WP09 [stamp] purpose wording confirmed with the travel agent". Harness: replay; a new key. | C1; then "Problem report resolved"; readiness "Out of date"; the replay returns the same receipt; the new key answers "already resolved"; nothing extra recorded. | A54, A55, A60 (1), (2), A61 | L |
| V07-A5 | Y: TA-07, TA-10, TA-07x of P | Read. | No open report; the notice; the history line. | A09 | L |
| V07-A6 | Setup: OP1, OP-02 of P | Confirm readiness again (WP-07). | "Recorded by you". | A63 | L |
| V07-A7 | Y (two tabs); OP1 (two tabs); harness | Y tab 1 opens the report form. Y tab 2 reports "WP09 [stamp] the photograph is wrong". OP1 tab 1 opens the resolve form of that report; OP1 tab 2 returns P (OP-03r) choosing "This return answers the travel agent's problem report". OP1 sends tab 1. Y sends tab 1. Harness: OP1 resolves the return hold; Y reports on the returned P. | OP1 tab 1: C5 "already resolved by your return". Y tab 1: refused, returned. TA-07 "Returned to you for correction" with the note. The return-hold resolution refused (`hold_not_operator_closable`); the report on the returned P refused (`hold_not_applicable`); nothing recorded. | A05 (2), A10, A12, A59, A62 | L |
| V07-A8 | Setup: Y (TA-09d, TA-08 returned mode); OP1 (OP-02) | Y corrects and hands back. OP1 reads OP-02 and confirms readiness. | The same operator; "Out of date: confirm readiness again", then "Recorded by you" (V07: the same operator reconfirms readiness). | A63 | L |
| V07-B1 | Setup: OP1, OP-03f of F (WP-07). Observed: SA-02c, SA-01, TA-07 of F | Flag "WP09 [stamp] decision needed: confirm the declared purpose wording". | SA-02c baseline + 1 ("Your answer"); SA-01 group 5 + 1 and + 1; TA-07 of F: "TravelMudra is reviewing a question from your operator…". | A13, A66, A67 | L |
| V07-B2 | OP1: OP-02 of F; harness | Read. Harness: resolve the flag. | The waiting notice; no form; the resolution refused (`flag_response_missing`); OP-01 "Waiting". | A56, A63 | L |
| V07-B3 | SA2: SA-02c → SA-09 flag response of F | Read; Cancel. Send empty; send an answer without a reason. Answer "WP09 [stamp] keep the declared wording" with a reason. | C1 twice; then "Answer recorded"; the SA-02c row and SA-01 counts move. | A66 to A70 | L |
| V07-B4 | SA1: SA-09 flag response of F; harness | Open the page. Harness: replay (same key); a new key. | "already answered", no form; the replay returns the same receipt; the new key refused (`flag_already_responded`). | A71, A73 | L |
| V07-B5 | OP1: OP-02, OP-01 of F; Y: TA-07 of F | Read. | The answer verbatim; "Resolve the flag" (not a problem report, not "Return to TA" first); OP-01 "Action now"; readiness still "On hold"; TA text without "reported problem". | A13, A57, A63 | L |
| V07-B6 | OP1: resolve the flag of F; SA2: SA-02c, SA-01, SA-09 flag response | Resolve with a note. Read the SuperAdmin pages. | Receipt (neutral unless established); readiness "Out of date"; SA-02c and SA-01 group 5 at baseline; SA-09 "The operator resolved this flag". | A58, A66, A67, A72 (1) | L |
| V07-B7 | Setup: OP1, OP-02 of F | Confirm readiness again. | "Recorded by you". | A63 | L |
| V07-C1 | Y: TA-07, TA-07h of H (WP-03 command, observed); harness | Read TA-07 (no report control on an unassigned draft). Harness: report on H. Ask for help: "WP09 [stamp] the passport names do not match; please help". | The report refused (`hold_not_applicable`); receipt "Help requested"; "Requested: TravelMudra decides"; SA-02b + 1 (baseline + 2); SA-01 group 4 likewise. | A05 (3), A16, A25, A26 | L |
| V07-C2 | SA1: SA-02b → SA-09 help decision of H | Read; Cancel. Send empty; then with a choice and no reason. Decline with "WP09 [stamp] the travel agent can correct the names on the form". | C1 twice; "Help declined"; SA-02b − 1; group 4 − 1. | A25, A27, A29, A30 | L |
| V07-C3 | Y: TA-07, TA-07h, TA-10 of H | Read. Ask for help again. | "Declined: you can ask again"; the notice; a new request "Requested". | A16, A17, A24 | L |
| V07-C3a | SA1 (tab 1); Y | SA1 opens the SA-09 help decision of H's new request in tab 1. Y changes a declared field of H on TA-09d. SA1 sends tab 1 ("Approve"). | C5 with the changed facts; choice and reason kept; nothing recorded. | A35 | L |
| V07-C4 | SA1: SA-09 help decision of H (refreshed); harness | Approve with a reason. Harness: replay; the same key with "Decline"; a new key. Open the page of the first (declined) request. | "Help approved"; the replay returns the same receipt; the changed content refused as a used form; the new key "Already decided: Approved"; the declined request's page has no form. | A31, A34 (1), A36 | L |
| V07-C5 | Y: TA-07 of H; SA1: SA-02a, SA-01 | Read. | "Approved: TravelMudra assigns an operator"; SA-02a approved help + 1; SA-01 group 3 + 1, group 4 − 1. | A18, A26 | L |
| V07-C6 | Setup: SA1 records the Gate 1 exception for assignment of H (SA-09g) and assigns H to OP1 (SA-03a). Observed: Y (TA-07, TA-09d of H; harness edit and submission); OP1 (OP-01, OP-02 of H) | — | "Assigned for approved help" (WP06-A47); TA side "An operator is entering information with your approval", the posts refused; OP-02 the labelled task and form; SA-01 group 3 back to baseline; group 11 + 1. | A19, A26, A39, A40 | L |
| V07-C7 | OP1: OP-02 and OP-03f of H; harness; OP-01, TA-07, SA-01, SA-02 | Send the first entry (given names "HEMA DEVI", the passport ticked, an explanation). Open OP-03f; harness: flag. Read the other pages. | Refused for Gate 1 with the known gap; values kept; nothing recorded; the flag refused; today's owner recorded (Deferred until the Core batch). | A41, A42 | L |
| V07-C8 | Setup: SA1, SA-09g `gate1_first_work` of H | Record the exception with a reason. | Open until [time] IST. | — | L |
| V07-C9 | OP1: OP-02 of H | Send with no document; send with a surname change as well; send an empty explanation; then the given names with the passport and the explanation. | Two same-person refusals; C1; then "Information recorded"; the exception "used"; group 11 + 1; the passport row "Processing", then "Accepted". | A43, A44 (1) to (4) | L |
| V07-C9a | Harness as OP1 | Replay the accepted entry (same key); the same key with one field changed; Back and send the reloaded form (new key). | The same receipt; the conflict; "Nothing changed."; nothing extra recorded. | A47 | L |
| V07-C9b | OP1 (two tabs) | Tab 1 opens the form and changes a declared field; tab 2 records another declared field; tab 1 sends. | C5 with the typed values kept; the refreshed send recorded once. | A46 | L |
| V07-C10 | OP1: OP-03r of H; harness | "Return for TA review" with "WP09 [stamp] I corrected the given names from the passport; please check and submit". Harness: an entry on H. | The label and effect; the task gone; OP-01 "Returned to TA"; the entry refused (`hold_returned_to_ta`). | A44 (8), A50 | L |
| V07-C11 | Y: TA-07 of H | Read. | "Returned to you for review"; the note verbatim; "Review what the operator entered, then submit." | A20 | L |
| V07-C12 | Y: TA-08 of H; OP1: OP-01 | When the passport row reads "Accepted", review the answers; tick the confirmations; submit. | Receipt "Submitted" with the quote and estimate fixed now; "With your operator", the same operator; "Help completed"; OP-01 lists H. | A21, A23 | L |
| V07-D1 | SA1: SA-02b | Read K's row. | Operator "Assigned" with the in-place line. | A25 | L |
| V07-D2 | SA2: SA-09 help decision of K | Read. Approve with a reason. | The in-place effect and evidence; refused for Gate 1 at the first work with the two routes; nothing recorded; K's row stays. | A28, A32 | L |
| V07-D3 | Setup: SA2, SA-09g `gate1_first_work` of K | Record the exception. | Open until [time] IST. | — | L |
| V07-D4 | SA2: SA-09 help decision of K (reloaded) | Approve again. | "Help approved"; the exception "used"; group 11 + 1 (total + 4 from P-0); SA-02b and group 4 at baseline. | A32, A36 (5) | L |
| V07-D5 | OP2: OP-02 and OP-03r of K | Record an entry of a declared field (for example the travel purpose). "Return for TA review" with a note. | "Information recorded" without a new exception (the approval recorded the basis); the return as A50. | A39, A43, A50 | L |
| V07-D6 | Y: TA-07 and TA-08 of K | Read; hand the application back. | "Returned to you for review"; the returned mode with the unchanged quote; after the hand back "With your operator" (OP2); "Help completed". | A22 | L |
| V07-E1 | `syn-ta-2`; OP2; `operator-3`; SA1 | Open TA-07 of P; OP-02 and the resolve path of P; OP-02 of P with the read grant; SA-09 kinds with ids of another application. | Not-found or SH-02 as A89; read-only for `operator-3`; nothing recorded. | A60 (4), A72 (2), A86, A89 | L |
| V07-E2 | Test | Lost acknowledgements; edited receipts; the support view; LD-14 HTTP tests; A06, A07, A08, A33, A45, A49, A57 (mapping), A64, A80, A82. | As the items. | A06 to A08, A33, A45, A49, A57, A64, A77, A79, A80, A82, A83, A86 | T |
| V07-E3 | axe | Every WP-09 page visited. | No serious or critical violation at 1440 px and 390 px. | A102 to A123 | L |

Proof split: V07 (the WP-09 part) passes when V07-A1 to V07-A8, V07-B1 to V07-B7, V07-C1 to V07-C12, V07-D1 to
V07-D6 and V07-E1, V07-E3 pass on `lane-ui` at the integrated WP-09 commit and V07-E2 passes as named tests; A42 is
recorded "Deferred until the Core batch (P-12 C)". BU-21 passes to its boundary when V07-C1 to V07-C12 pass (help
on a draft through the normal decision path; no submission until the TA's own; no assignment without Gate 1); its
first part (help before an application exists) is not proven in WP-09 (§4). BU-22 passes to its boundary when
V07-A1 and V07-A7 pass; the bulk correction page is not proven in WP-09 (§4). The run record names the `lane-ui`
ref, the run tag, Y's identifier, each test, the identifiers (internal record only) and every delta.

## 4. Scenario parts outside these proofs (traceability)

| Scenario part | Where it is proven |
|---|---|
| V07: formal return and readiness reconfirmation (the return and readiness commands) | WP-07 (WP07-A39 to A41, A30); WP-09 observes them in V07-A7, V07-A8 |
| V07: the label "Return for TA review" | WP-07 (WP07-A48); WP-09 proves the journey (A50) |
| BU-21: request help before an application exists | WP-18 (intake issues). No Core command records a help request on an intake issue; the issue is SuperAdmin-owned work already (Q-10) |
| BU-21: "Request help" on the bulk issue page (BU-P06) and the review queue (BU-P10) | WP-04 and WP-18 (bulk pages); the help decision path of WP-09 applies unchanged |
| BU-22: bulk correction of an assigned, not returned application (BU-P07) | WP-05; the refusal and the report route of A14 apply |
| V06: help approval and assignment need Gate 1 | WP-06 (SA-02a, SA-03a, SA-09g, WP06-A147, A148); WP-09 adds the in-place approval and the first entry live (A32, A41) |
| P-12 C: the SuperAdmin owner and queue for a blocked first-work Gate 1 | The Core batch (S-08), then the open package adopts it (A42) |
| Operator and SuperAdmin notices of reports, answers and help approvals | WP-15 (OP-10, SA-10) |

## 5. Out of scope and boundaries

These MUST NOT appear on any WP-09 page:

- An operator information-entry control outside approved help, or an editable application field in ordinary work
  (BS B18; UX §5.3).
- "Submit for TA", or a control or text that submits, confirms authority, pays or changes the price for the travel
  agent after help (BS B17, B18; UX §5.3).
- On an assigned, not returned application: a TA edit, upload, submission or help-request control; any TA control
  other than "Report a problem" (BS B18).
- A problem report that changes application data, documents or price, or that claims to.
- A SuperAdmin control that enters information, resolves a hold, records readiness, files or submits (BS B18).
- A flag answer presented as a payment, an exception, readiness or an approval; a help approval presented as an
  assignment, a payment, a Gate 1 pass or a submission (BS B20; UX §6.3).
- A blanket sentence that approving help never needs a payment (`WP-06.md` D-07).
- A flag control while approved help is in progress (Core refuses it; the known gap shows instead, D-06).
- A resolve control for a return hold.
- An offer of "Report a problem" where Core refuses it, or its absence where Core accepts it, beyond the decisions of
  Q-03 and Q-04 (WP-03 F-W03-11).
- A receipt that names a result the operation does not establish, an accepted time, or an instruction to act from an
  older state (C-03; P-02; F-01).
- Earlier facts on a page after an optional read was refused for access (LD-14).
- A silent truncation of ticked documents or of any other form row (D-10; E-04).
- A read marker on a notice (LD-06); a count shown as "0" when it is unknown (D7).

Deferred in WP-09 (each item says where it lands; the run record lists them as "Deferred"):

- **Deferred until the Core batch** (P-12 option C as narrowed; S-08): the SuperAdmin as owner of a blocked
  first-work Gate 1 on approved help, its OP-01 view, its TA text, the SA-01 and SA-02 queue kind `first_work_gate1`,
  and the unusable exception's id and failure on SA-09g (A42).
- **Deferred until the Core batch** (P-10 e): a Gate 1 context for the in-place help approval and for the first
  entry, shown before the send (A28, A41).
- Command identity and accepted time in receipts (P-10 b, P-02): neutral receipts where §0.2 says so (A58, A77).
- Evidence references on the set-up gate exceptions (P-11, S-07): the set-up exceptions carry a reason only.
- TA-readable texts: the travel agent's own report text, the operator's resolution note, the decline reason and the
  fields the operator changed during help (Q-05): A03, A09, A16, A20 partly met.
- The operator's name for the travel agent (Q-11): "your operator".
- Hold facts on the flag queue rows (Q-06): A66 shows Core's current step where the flag is not the current step.

Not in WP-09 (later or earlier packages):

- `core.request_assistance` (TA-07h), `core.hand_back` (TA-08 returned mode): WP-03.
- `core.flag`, `core.formal_return` and the label "Return for TA review": WP-07.
- Gate 1 exceptions, assignment and payment records: WP-06.
- Withdrawal, deferral and price decisions (carried forms): WP-17.
- Operator and SuperAdmin notices: WP-15. Bulk pages: WP-04, WP-05, WP-18.

## 6. Questions for the architect (ranked)

No P0 was found. P-12 (the route to the first-work Gate 1 decision on approved help) is decided by Max and waits for
the Core batch (A42); it is not asked again.

| ID | Rank | Question | Concrete scenario | PM recommendation |
|---|---|---|---|---|
| Q-01 | P1 | Core gives an answered flag the next action `resolve_problem_report` (reason `hold_flagged_to_superadmin`). The WP-07 action-panel row for `resolve_problem_report` offers "Return to TA" as the primary action and speaks of the travel agent's report; the TA texts are keyed by next action only ("The operator deals with the reported problem"). | SA2 answers OP1's flag on F. OP1's panel says "Deal with the travel agent's problem report" and offers "Return to TA"; OP1 returns F although the TA must correct nothing, and the flag stays open. Y reads that "the reported problem" is being handled, although Y reported nothing. Likelihood: certain for every answered flag. | Map the panel and the TA texts by (reason, next action), not by next action alone: answered flag → operator "Read the SuperAdmin's answer and resolve the flag" with "Resolve the flag"; TA "Your operator continues after TravelMudra's answer." A unit test over all pairs (A57, A13). The change touches the WP-07 panel mapping; the architect decides whether WP-09 or a WP-07 fix carries it. |
| Q-02 | P1 | The carried assistance-entry handler computes identity changes as the difference from the identity read at send time, and keeps at most four ticked documents silently (`case.ts` `identityChangesOf`). | OP1 corrects the given names; the acknowledgement is lost; OP1 sends the same form again: the difference is now empty, so the same key carries different content and the page says "already used with different content" for an identical form. Or OP1 ticks five documents and Core receives four without a word. Likelihood: medium (every lost acknowledgement or replay of an identity entry). | As WP-03 C-04: send the identity values as posted (the same for the same input; Core treats unchanged values as no change), and refuse more ticks than Core's limit with a field error (WP-06 D-10). A44 (5) and A47 assume this. |
| Q-03 | P2 | Core accepts "Report a problem" while approved help is in progress; WP-03 design §3.1 shows no action in that state. | During help, Y sees OP1 typing a wrong passport number on a call and has no in-product way to tell OP1 before the return for review. Harm low: Y reviews every answer before submitting. Likelihood: low. | Offer the report in that state (Core accepts; UX §2.3 lets an assigned, not returned TA report). A07 and A64 assume this; otherwise A07 records the decision. |
| Q-04 | P2 | No Core evaluation tells the TA page where "Report a problem" is accepted. Today the page computes it and also hides it after an outcome, although Core accepts a report on a submitted, assigned application with an outcome. | After "Issued", Y finds a wrong name on the result and has no report route on TA-07, although Core would accept one. Likelihood: low. | A closed mapping of Core's facts equal to the command's guard, with a parity unit test (A06); follow Core after an outcome. A Kind 1 evaluation on `core.ta_application` only if the mapping drifts. |
| Q-05 | P2 | No TA read returns the travel agent's own report text, the operator's resolution note, the decline reason or the fields the operator changed during help. | Y reads "Problem report: None open" and does not know how it was resolved; Y submits after help without seeing which answers changed (TA-08 shows all answers). Likelihood: certain; harm low. | Show what the reads return and say what is not shown; list the gaps as deferred; a Kind 1 bundle note (P-09 style), parked unless Max wants it. |
| Q-06 | P2 | `core.admin_queue {flags}` returns list rows only. When an earlier pending rule wins (for example a flagged application that was then returned), the row cannot say whether the flag waits for an answer, and SA-01's "Waiting for your answer" does not count it. | OP1 flags F, then returns F to Y; SA-02c shows F as "Current step: travel agent corrects" and SA2 does not see that the flag still waits for an answer. Likelihood: low. | Show Core's current step on such rows (A66); the SA-09 flag-response page reads the hold and offers the answer. Kind 1 (hold facts on queue rows) only if this happens in use. |
| Q-07 | P2 | Several WP-09 results share a shape on one surface: OP1's flag and OP1's flag resolution (application and `flg_` id). | An edited receipt address names "Flag resolved" for the flag itself. Likelihood: low. | Name a result only where a read establishes it, else "Request recorded" with Current facts (A77); P-10 b serves the command identity later. |
| Q-08 | P2 | `core.decide_assistance` and `core.resolve_hold` answer a business duplicate with `stale_revision`, the same code as a stale page. | A second SuperAdmin decides an already decided request and reads "Changed since you opened this page", which hides that the request was decided. Likelihood: medium in two-SuperAdmin use. | The page re-reads after `stale_revision` and says "Already decided: [state]" or "Already resolved" when the fact shows it (A35, A36, A60); no Core change. |
| Q-09 | P2 | `core.respond_flag` needs both an answer to the operator and a reason. | A SuperAdmin types the same text twice, or the page copies one into the other and the audit reason says nothing. Likelihood: medium; harm low. | Two labelled fields with distinct hints ("Answer to the operator"; "Reason for the record"); the page copies neither (A68). |
| Q-10 | P2 | BU-21's first part (help before an application exists) has no Core command: `core.request_assistance` needs an application. | WP-18 builds BU-P06 and offers "Request help" on an intake issue that posts nowhere. Likelihood: medium at WP-18. | WP-18 shows that the intake issue is SuperAdmin-owned work and offers no separate help request; a TA help request on an issue would be Kind 2 for Max. |
| Q-11 | P2 | No TA read returns the operator's name; UI-PLAN §5.2 ("operator named") and the receipt row of Report a problem ask for it. | Y phones TravelMudra and cannot say who owns the case. Likelihood: low. | "Your operator" on TA pages; a note for the Kind 1 bundle (P-09 style), parked. |
| Q-12 | P2 | Where does the hold resolution live: in the OP-02 holds section (WP-07 design §2.5) or on a task page (register: OP-02; OP-03)? Two register notes are stale: `core.formal_return` "WP-09 adds 'Return for TA review'" (WP-07 Q-W07-09 built it) and `core.resolve_hold` "Resolves a problem-report, return or flag hold" (Core refuses a return). | The design builds the resolution twice, or offers a return resolution that Core refuses. Likelihood: low. | A task page in the CMP-25 order (scope, evidence, effect, decision, review), linked from the action panel and the holds section; the action path stays. Correct both register notes. |

## 7. Sign-off

| Field | Value |
|---|---|
| Verified on (date, IST) | |
| Installation and ref (`uat.py status lane-ui` output: commit or tag) | |
| Lane commit of the tests named for `T` items | |
| Run tag, Y's identifier and other identifiers (internal record reference) | |
| Baselines (P-0) and the deltas observed | |
| Browsers and versions | |
| Assistive technology used | |
| V07 result (steps; where shown) | |
| BU-21 result (to its boundary) | |
| BU-22 result (to its boundary) | |
| Deferred items (reference each; "Deferred until the Core batch" for A42 and the P-10 e parts) | |
| Partly met items (decision reference) | |
| Open findings (ID, rank, scenario) | |
| Signed by (role and name) | |

Result per item (Pass, Fail, Blocked, Partly met, Deferred or Not run; evidence reference; note):

| ID | Result | Evidence | Note |
|---|---|---|---|
| WP09-A01 | | | |
| WP09-A02 | | | |
| WP09-A03 | | | |
| WP09-A04 | | | |
| WP09-A05 | | | |
| WP09-A06 | | | |
| WP09-A07 | | | |
| WP09-A08 | | | |
| WP09-A09 | | | |
| WP09-A10 | | | |
| WP09-A11 | | | |
| WP09-A12 | | | |
| WP09-A13 | | | |
| WP09-A14 | | | |
| WP09-A15 | | | |
| WP09-A16 | | | |
| WP09-A17 | | | |
| WP09-A18 | | | |
| WP09-A19 | | | |
| WP09-A20 | | | |
| WP09-A21 | | | |
| WP09-A22 | | | |
| WP09-A23 | | | |
| WP09-A24 | | | |
| WP09-A25 | | | |
| WP09-A26 | | | |
| WP09-A27 | | | |
| WP09-A28 | | | |
| WP09-A29 | | | |
| WP09-A30 | | | |
| WP09-A31 | | | |
| WP09-A32 | | | |
| WP09-A33 | | | |
| WP09-A34 | | | |
| WP09-A35 | | | |
| WP09-A36 | | | |
| WP09-A37 | | | |
| WP09-A38 | | | |
| WP09-A39 | | | |
| WP09-A40 | | | |
| WP09-A41 | | | |
| WP09-A42 | | | |
| WP09-A43 | | | |
| WP09-A44 | | | |
| WP09-A45 | | | |
| WP09-A46 | | | |
| WP09-A47 | | | |
| WP09-A48 | | | |
| WP09-A49 | | | |
| WP09-A50 | | | |
| WP09-A51 | | | |
| WP09-A52 | | | |
| WP09-A53 | | | |
| WP09-A54 | | | |
| WP09-A55 | | | |
| WP09-A56 | | | |
| WP09-A57 | | | |
| WP09-A58 | | | |
| WP09-A59 | | | |
| WP09-A60 | | | |
| WP09-A61 | | | |
| WP09-A62 | | | |
| WP09-A63 | | | |
| WP09-A64 | | | |
| WP09-A65 | | | |
| WP09-A66 | | | |
| WP09-A67 | | | |
| WP09-A68 | | | |
| WP09-A69 | | | |
| WP09-A70 | | | |
| WP09-A71 | | | |
| WP09-A72 | | | |
| WP09-A73 | | | |
| WP09-A74 | | | |
| WP09-A75 | | | |
| WP09-A76 | | | |
| WP09-A77 | | | |
| WP09-A78 | | | |
| WP09-A79 | | | |
| WP09-A80 | | | |
| WP09-A81 | | | |
| WP09-A82 | | | |
| WP09-A83 | | | |
| WP09-A84 | | | |
| WP09-A85 | | | |
| WP09-A86 | | | |
| WP09-A87 | | | |
| WP09-A88 | | | |
| WP09-A89 | | | |
| WP09-A90 | | | |
| WP09-A91 | | | |
| WP09-A92 | | | |
| WP09-A93 | | | |
| WP09-A94 | | | |
| WP09-A95 | | | |
| WP09-A96 | | | |
| WP09-A97 | | | |
| WP09-A98 | | | |
| WP09-A99 | | | |
| WP09-A100 | | | |
| WP09-A101 | | | |
| WP09-A102 | | | |
| WP09-A103 | | | |
| WP09-A104 | | | |
| WP09-A105 | | | |
| WP09-A106 | | | |
| WP09-A107 | | | |
| WP09-A108 | | | |
| WP09-A109 | | | |
| WP09-A110 | | | |
| WP09-A111 | | | |
| WP09-A112 | | | |
| WP09-A113 | | | |
| WP09-A114 | | | |
| WP09-A115 | | | |
| WP09-A116 | | | |
| WP09-A117 | | | |
| WP09-A118 | | | |
| WP09-A119 | | | |
| WP09-A120 | | | |
| WP09-A121 | | | |
| WP09-A122 | | | |
| WP09-A123 | | | |
| V07 proof (WP-09 part) | | | |
| BU-21 proof (to its boundary) | | | |
| BU-22 proof (to its boundary) | | | |
