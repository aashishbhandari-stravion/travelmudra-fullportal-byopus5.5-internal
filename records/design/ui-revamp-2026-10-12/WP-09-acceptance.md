# WP-09 acceptance checklist: Assistance and report a problem

| Field | Value |
|---|---|
| Lane | `ui-revamp-2026-10-12` |
| Work package | WP-09 Assistance and report a problem (UI-PLAN §12.2; lane PLAN §3) |
| Author | Principal Product Manager (Claude subagent), 13 October 2026 |
| Decision owner | Principal Technical Architect of the lane (LD-12) |
| Status | Aligned on 13 October 2026 to `WP-09-design.md`, the architect's decisions (`WP-09.md` §3, Q-W09-01 to Q-W09-12), amendments G-01 to G-11 (`WP-09.md` §4.1) and WP-07 amendments F-13 to F-15 (`WP-07.md` §4.2): see the corrections below. Not run. Where the design names a path or a word differently from an unchanged row, the design governs the name and this checklist keeps the observable result. |
| Product base | lane branch `ui-revamp-2026-10-12` at e9e96e3; internal records at 7e55fe4 |
| Installation | `lane-ui`: edge http://127.0.0.1:4650 (travel-agent pages under test); staff http://127.0.0.1:4652 (operator and SuperAdmin pages under test, set-up through WP-06 and WP-07 pages) |
| Writing style | ASD-STE100 at about 75% (STY-20261003-01) |

## Corrections of 13 October 2026

The UX design (`WP-09-design.md`), the architect's decisions (`WP-09.md` §3) and the independent design review (lane
`research/reviews/WP-09-design-review.md`, R-01 to R-11, with amendments G-01 to G-11 in `WP-09.md` §4.1, which bind)
changed the rows below. WP-07 amendments F-13 to F-15 (`WP-07.md` §4.2) bind the WP-07 pages that WP-09 observes. No
other row changed. Section 6 is kept as asked; its lead names the answers. Application K of the first version is now
R, the design's name (§0.4).

| Row | Finding or decision | Change |
|---|---|---|
| Status, §0.1, verified facts | Design; `WP-09.md` §3, §4.1; review R-02, R-05 | Inputs add the design, the package record, the review and WP-07 §4.2. Facts add Core's first-work evaluation (`ops.case_work.offers.startWork`) and the refusal of an entry after exhausted reconciliation. |
| §0.2 Personas, help and hold words, Receipts, Paths; §0.3; §0.4 | Q-W09-01, Q-W09-03, Q-W09-09; design §1.2, §2.2 item 4, §2.11, §6.2; G-09 | Design page ids and paths: TA-07p, OP-02a, OP-02r, SA-09h (kinds `assistance_approve`, `assistance_decline`) and SA-09f (`flag_response`) on the application route without a subject. Design label table ("Approved: an operator is entering information", "Declined", "Ended"). Recipe P, F, H, H2, R as design §6.2; F is reassigned from OP1 to OP2 before the response; H's entry is the travel purpose; a fresh travel agent Y stays the lane convention, with the design's `syn-ta-1` as the fallback. |
| A01, A02, A03, A05, A11, A12, A14, A15 | Q-W09-01; design §2.1, §2.2, §2.10, §2.11 | TA-07p is a full task page; the receipt title "Problem report sent to your operator"; the C2 sentences and the unsent text block; TA-09 and TA-07h notices link to TA-07p. |
| A06, A07 | Q-W09-02 (PM Q-03, Q-04 decided) | The report is offered by Core's guard facts, also after an outcome and during approved assistance (aside link). |
| A08 | Q-W09-10; design §2.2 item 6 | "Ask your operator for a return" links to TA-07p `?purpose=withdraw` with the prefilled text. |
| A13, A16 to A24 | Design §2.2, §3.1, §6.3 | TA status rows (help label table; the flag line); "Ended"; WP-03 receipts "Application submitted" and "Handed back to your operator"; the decline is on H2; the notices and history lines of the new recipe. |
| A25 to A29, A34, A90, A93 | G-04 (R-04); Q-W09-03 | Two kind pages with a fixed hidden `decision`, header links "Decline instead" / "Approve instead", reason validation; no radios and no "Choose approve or decline". Obsolete and foreign request ids are tested through POST envelopes (stale refusal, unsent reason kept), not through a historical GET. |
| A28 | G-08 (R-08) | The effect row for an application with an operator is written in full. |
| A30 to A32, A35, A36, A38 | Design §2.7, §2.11, §3.2, §4.3, §6.3 V07-20 to V07-22 | Receipts "Help request approved" / "Help request declined"; the payment line of the approval receipt; the decline and the two-SuperAdmin race on H2 (live); the travel agent's change during a decision becomes a test. |
| A39 to A41, A47 (4), §3 V07-C8, §5 | G-05 (R-05); Q-W09-07 | On GET: the Gate 1 blocker, no entry or upload form, "Return for TA review" kept. The command refusal is a test with a saved envelope. An unavailable evaluation keeps the form and Core decides. |
| A40, A44 (5), A95 | G-07 (R-07) | Evidence starts unchecked, is restored from the posted values after a refusal, and an over-limit selection stays visible with its field error. Confirmations stay unchecked after a refusal. |
| A42 | Design §3.3 | The adoption words for P-12 C and P-10 e. |
| A43, A44, A46 | Design §2.3, §2.10, §2.11, §2.12 | Refusal sentences, receipt current facts and C5 rows of the design; the live entry is the travel purpose; an accepted identity correction is proven by test. |
| A45 | G-02 (R-02) | Two states: execution authorized or unknown (the entry can be held); reconciliation exhausted (refused `filing_possibly_occurred`, no form). |
| A48 | Q-W09-05; PLAN §8 S-10 | The operator's upload lives on OP-02a; a refused upload re-renders OP-02a with the reason at the row. |
| A50 | G-06 (R-06); WP-07 F-14, F-15 | Split by lifecycle: a draft is reviewed and submitted; a submitted application is handed back, with the quote and the original window unchanged, the same operator and readiness confirmed again. One receipt title. |
| A53 to A63, A65 | F-13; design §2.4, §2.5 | OP-02r per hold; action-panel rows 3a and 3b; Holds links; readiness in WP-07 words; unsent text block. |
| A55, A58, A77 | G-01 (R-01) | The `resolved` receipt is neutral; a test opens the flag's operation key at the resolve receipt address after resolution. |
| A66 to A72, A75 | Design §2.8, §2.9; G-09; G-10 | SA-09f words; "Respond" / "Open"; the raiser and the current operator named separately; the receipt's current line from the hold's state. |
| A78 | G-10 (R-10); F-01 | The `responded` receipt revisited after resolution (live) and after a newer flag opens (test). |
| A80 | G-03 (R-03) | "Nothing changed" only for an applied entry; a repeated proposal while the first is held records another held correction. |
| A83, A85, A86, A88, A89, A97, A98, A102 to A123 | Design §2.0, §5, §7.2 | Page names; the read-grant line; the host-page test; foreign ids through POST envelopes; primary action labels; axe rows renamed. |
| A124 to A131 (new) | G-06, G-09, Q-W09-01, S-W09-01, design §2.5, §2.6 item 3 | Return for review with no entry; a stale help approval across a reassignment; a flag response after OP1 → OP2; TA-07p states on GET; the bulk origin; OP-02 frame line and Holds links; OP-03r preselection; axe of the decline kind and the TA-07p "Returned to you" state. |
| §1.1 to §1.4, §3, §4, §5, §6 lead, §7 | Design §6; `WP-09.md` §3 (Q-W09-08, STOP items, PM Q-05, PM Q-12), G-11 | One ordered recipe in the design's order with lettered additions; BU-21 recorded as partly met (first half the bulk boundary); deferred items and the answers to §6. |

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
| LP | `PLAN.md` (this folder) | SHA-256 5458225f2b55d7ad…; internal a659b1a | §3, §4 (LD-02, LD-03, LD-07, LD-08, LD-11, LD-12, LD-14), §7 (#23, #25), §8 (S-07, S-08, S-10), §9 |
| PR | `PROPOSALS.md`; lane `output/proposals/P-12-assistance-first-work-exception-route.md`; `P-10-wp06-core-requests.md` | SHA-256 ac642225928c3aea…; f71b5888b314d185…; 79f82537bc71f4b2… | P-10 (b, e, f); P-12 (Max: option C narrowed, §11.1 to §11.6) |
| W3 | `WP-03.md`; `WP-03-design.md` | SHA-256 e2d4422bfef6dd24…; d4d40cb1d18a7bc2… | §3 Q-W03-06; §4.1 C-04, C-13, C-14; design §2.7, §2.9 (TA-07h), §3.1 to §3.4, F-W03-11 |
| W6 | `WP-06.md`; `WP-06-design.md`; `WP-06-acceptance.md` | SHA-256 a967bc071def9e25…; 327f580c1820bf40…; 7a1d82e48fde6e93… | §3 PM Q-05; §4.1 D-02, D-06, D-07, D-10, D-12; design §2.1, §2.2.2, §2.2.3, §2.7.1 to §2.7.5; WP06-A18, A47, A89, A147, A148 |
| W7 | `WP-07.md`; `WP-07-design.md`; `WP-07-acceptance.md` | SHA-256 64247aa81b4b98d7…; 4c877b4be85dc5e7…; 647c7b1d6af0887c… | §3 Q-W07-03, Q-W07-09; §4.1 F-01, F-05; §4.2 F-13, F-14, F-15; design §2.4 (action panel), §2.5.1, §2.6; WP07-A03, A31, A37, A44, A48 |
| W8 | `WP-08-acceptance.md` | SHA-256 4d6504be7f20ebe7… | Format, corrections, lessons, §0.2; A89 to A91 (TA-10), A101 (history) |
| DE | `WP-09-design.md` (this folder) | SHA-256 5b23fd28b925395f… | §0 to §9 (pages, states, copy tables, receipts, stale rows, interim and adoption, hostile states, proofs, deviations, STOP items) |
| W9 | `WP-09.md` (this folder); lane `research/reviews/WP-09-design-review.md` | SHA-256 97074922067b5db7…; 6a2e1c234921e857… | §3 Q-W09-01 to Q-W09-12; §4.1 G-01 to G-11; review R-01 to R-11 |
| Code | lane repository | e9e96e3 | `src/modules/core/commands/holds.ts`, `assignment.ts`, `drafts.ts`, `submission.ts`, `common.ts`, `gates.ts`; `src/modules/core/corrections.ts`, `controls.ts`, `derived.ts`, `staff-views.ts`, `lists.ts`, `store.ts`; `src/modules/identity/policy.ts`; `src/contracts/core.ts`, `operations-work.ts`; `src/core-api/bindings/core.ts`; `src/modules/views/case-projectors.ts`; `src/apps/shared/core/ta.ts`, `shared.ts`; `src/web/ui/presentation.ts`; `src/apps/staff/core/ops.ts`, `admin.ts`, `case.ts`; `src/apps/staff/intake/routes.ts`; `src/web/route-inventory.ts`; the tests named per item; `test/fixtures/documents/samples.ts` |

Verified facts of the code at e9e96e3 that the items rely on (read by the author; the design review checked them):

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
  while an act is authorized or its execution is unknown; with reconciliation exhausted Core refuses it
  (`filing_possibly_occurred`, `corrections.ts` `correctionStage`). A held entry leaves the snapshot unchanged, so the
  same proposal sent again with a new key records another held correction. Result: the application, `correctionId`
  and `stage` (`applied` or `held`).
- Core's first-work evaluation `ops.case_work.offers.startWork` (null once work started) checks the same gate action
  (`start_operator_work`) and the recorded assignment basis that the first assistance entry checks (review R-05;
  `controls.ts:668-675`).
- `core.resolve_hold` (assigned operator only): `holdId` (`prb_`, `ret_` or `flg_`), `resolutionNote` 1 to 2000.
  A hold of another application: `not_found_or_forbidden`. A hold that is not open: `stale_revision`. A return:
  `hold_not_operator_closable` (the travel agent closes a return by the hand back or by submitting a returned
  draft). A flag without an answer: `flag_response_missing`. It moves the hold revision and, for a problem report,
  notifies the travel agent. Result: the application and `holdId`.
- `core.respond_flag` (SuperAdmin): `holdId` (`flg_`), `responseNote` 1 to 2000, `reason` 10 to 1000. A hold of
  another application: `not_found_or_forbidden`. An answered or closed flag: `flag_already_responded`. The hold
  stays open; the answer moves the application revision but not the hold revision. It checks no assignment; the
  notice goes to the operator assigned now. Result: the application and `holdId`.
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
  `fulfilled` and keeps the operator; a returned submitted application goes back by `core.hand_back`.
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
  forms on the old SuperAdmin case page; a refused operator upload shows the shell error page.

### 0.2 Conventions

- **Personas.** Travel agent: Y, `wp09-ta-[stamp]`, a fresh synthetic travel agent per run (created and activated on
  SA-06 at set-up); `syn-ta-2` for isolation only. Operators: `operator-1` (OP1: P, H; F until its reassignment),
  `operator-2` (OP2: R; F after its reassignment; isolation on P), `operator-3` (holds a group read grant of the run's
  group; read-only checks). SuperAdmins: `superadmin-1` (SA1) and `superadmin-2` (SA2). They stand for
  `syn-operator-1` to `-3` and `syn-superadmin-1`, `-2`. Keyboard-only user. Screen-reader user. Phone user (390 px
  wide). No step suspends a seeded account.
- **Where.** `L`: a person or the LD-11 harness shows it on `lane-ui`. `T`: an automated test in the lane repository
  shows it at the same commit; the run record names the test. `L+T`: both are required. A test that the item says
  WP-09 adds is named in the run record with its file and title. A "saved envelope" is a POST body that the harness
  or a test keeps from an earlier page and sends later; it tests a command refusal that the current page no longer
  offers.
- **Sign-in codes (rule C).** As WP-01 §0.2. The LD-11 harness signs in. Nobody prints, logs, screenshots or stores a
  code or an authenticator key.
- **Copy.** Quoted text is draft copy (CR-09). Draft copy passes when the page states the same facts; the design's
  closed tables (§2.10, §2.11) are the wording source. The §11.3 boundary form is mandatory for an unavailable action:
  "[Action] is unavailable until [policy or evidence] is [approved / recorded]. Owner: [owner or 'not yet named']."
  Core's reasons show in words; a code shows only as the UAT-13 fallback (A82). Staff pages say "approved
  assistance"; TA pages say "help".
- **Help and hold words.** TA status row "Help request" (design §2.2 item 4): "Not requested", "Requested:
  TravelMudra decides", "Approved: TravelMudra assigns an operator" (no operator), "Approved: an operator is entering
  information" (help in progress), "Approved" (other), "Declined", "Ended" (Core's `fulfilled`). TA status row
  "Problem report and return": "Problem report: open since [time] IST", "Returned to you since [time] IST", "Your
  operator asked TravelMudra for a decision" (flag), or "None". Staff hold words: "Waiting for a SuperAdmin's
  response", "Answered [time] IST", "Resolved". An exception row reads "Action allowed by exception: Gate 1, for the
  first operator work, once" and then "used", never "Payment received". "Help approved" is a state of the help request,
  never of the application.
- **Dates and times.** Every time carries "IST" (AD-10, CR-06).
- **Freshness (LD-08).** An authoritative read (`core.*`, `ops.*`, `pay.*`) shows "Read at [time] IST". A projection
  (`views.*`) shows "Up to date when read at [time] IST", "Behind by [n] s when read at [time] IST" or "Freshness
  unavailable". No page applies a client-side age threshold.
- **Facts.** A page shows only facts that a read returns (WP-02 B-02, B-06). A fact read after an operation is labelled
  "Current". A count that a read cannot give shows "Unavailable", never "0" (D7). A list that returns its row limit
  says so and claims no total.
- **Receipts.** CMP-08 as WP06-A103: the request reference links to the operation status page; the resulting facts;
  "Recorded once. Sending the same form again does not repeat it."; no accepted time (P-02). A receipt names the
  command only when the operation's resource, the returned id and the summary establish it on that surface (design
  §2.11, as amended by G-01 and G-10; A77). Otherwise it reads "Request recorded" with the current facts labelled
  "Current" (WP-06 D-02). A receipt states what was recorded and Core's current next step; it never repeats an
  instruction from the past (F-01 class). The polite region announces it.
- **Unsent text block.** When a refusal shows that the form no longer applies, the page shows the state that applies
  and the reader's typed text read-only under "Your unsent [report / response / note]" with "This text was not sent.
  Copy it if you still need it." (design §1.6; WP-03 C-14).
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
- **Paths (LD-03; design §1.2).** Existing paths and form actions stay. TA-07 `/ta/applications/:applicationId`;
  TA-07p `/ta/applications/:applicationId/report-problem` (new GET beside the POST; query `from`, `r` or `attempt`,
  `purpose=withdraw`); TA-07h `…/request-assistance`, TA-08 `…/submit`, TA-09t `…/prepare` and its sections (WP-03);
  TA-07x `…/history`; TA-10 `/ta/notices` (WP-08). OP-01 `/ops/work`; OP-02 `/ops/applications/:applicationId`
  (`?tab=`); OP-02a `/ops/applications/:applicationId/assistance-entry` (new GET beside the POST; also hosts the
  operator's upload, action `/ops/applications/:applicationId/documents`); OP-02r
  `/ops/applications/:applicationId/holds/:holdId/resolve` (new GET beside the POST); OP-03r `…/return` (accepts
  `?resolve=<prb id>`) and OP-03f `…/flag` (WP-07). SA-01 `/admin`; SA-02a `/admin/queues/assignment`, SA-02b
  `/admin/queues/assistance`, SA-02c `/admin/queues/flags`; SA-09h `/admin/applications/:applicationId/decide/:kind`
  with `kind` `assistance_approve` or `assistance_decline` (POST `…/assistance-decision` stays); SA-09f
  `/admin/applications/:applicationId/decide/flag_response` (POST `…/flags/:holdId/respond` stays); SA-09g
  `…/decide/gate1_assignment` and `…/decide/gate1_first_work`, SA-03a `…/assign`, SA-03c `…/reassign`, SA-07a
  `…/payments` (WP-06); SA-06b `/admin/accounts/new` (WP-02). An item names the page; the run record names the path
  used.
- **Pass rule.** WP-09 passes when every `L` item passes on `lane-ui` at the integrated ref, every `T` item has a
  named passing test at that commit, every axe item passes, and the proofs of §3 pass to their boundary, except the
  explicitly deferred items of §5. The run record lists each deferred item as "Deferred" with its reference (for the
  P-12 and P-10 e items: "Deferred until the Core batch"), not as "Fail". An item that the architect marks "partly
  met" by a recorded decision passes with that note. A failed item becomes a finding ranked P0, P1 or P2 with its
  scenario (PRI-20260930-01).
- **Preconditions on `lane-ui`.** WP-01, WP-02, WP-03, WP-06, WP-07 (with F-13 to F-15) and WP-08 are integrated (TA
  pages create, edit, submit, ask for help and hand back; SA-06 creates accounts; SA-07a records payments; SA-03a and
  SA-03c assign and reassign; SA-09g records Gate 1 exceptions; OP-02 starts work and records readiness; OP-03r
  returns, including "Return for TA review"; OP-03f flags; TA-10 and the TA history are rebuilt). The harness can
  create, activate and sign in a new synthetic travel agent, and "SYN Tourist e-visa" admits it (checked first,
  §0.4).
- **Data hygiene.** WP-09 MUST NOT change seeded offerings, launches, listings or accounts and MUST NOT change any
  exposure ceiling. Each run creates its own travel agent Y, group and applications, with notes, reasons and
  references that carry the run tag; the writes are those of design §6.2 and §6.3 (Q-W09-09). Synthetic documents
  only, generated in memory from `test/fixtures/documents/samples.ts`; passport numbers are new in every run. The run
  record keeps identifiers (travel agent, applications, holds, help requests, corrections, exceptions, operation
  references) in the internal record only.

### 0.3 Synthetic data used by WP-09

| Item | Value | Use |
|---|---|---|
| Travel agent | Y, `wp09-ta-[stamp]`, a fresh synthetic travel agent per run (SA-06), synthetic email address; fallback `syn-ta-1` (design §6.2) | Every application of the run |
| Group | `wp09-[stamp]` in Synthetica; travel start today + 30 days, return today + 40 days | P, F, H, H2, R |
| Offering | "SYN Tourist e-visa" (`syn_tourist_evisa`), ₹3,500, TravelMudra files | P, F, H, H2, R |
| Passports | `td3Lines` of a `SyntheticPassport` with surname `SYNWPNINE`, document code P, issuing state and nationality IND, expiry at least six months after the return date, number "S" + seven digits new to the run; rendered with `passportImage` (JPEG) or `passportTextPdf`. Given names: P "PREM", F "FARAH", H "HEMA", H2 "HARI", R "RANI" | Intake of P, F, H, H2, R |
| Photographs | `plainPng` at least 350 × 350 px; `GIF` (a refused format) for the refused upload of A48 | Intake; A48 |
| H's missing detail | H's draft leaves the travel purpose empty; the help note reads "WP09 [stamp] please complete the travel purpose with us" | The approved-help entry |
| Payments | "Payment received" for P and F, evidence reference `SYN-WP09-[stamp]-[letter]`; H, H2 and R stay unpaid | Gate 1 paths |
| Notes and reasons | "WP09 [stamp] …", at least the length Core requires | Every note, response and reason field |

### 0.4 Run recipe (rerunnable)

- Run tag `wp09-[yyyymmddhhmm]`. First check: the harness can sign in Y, and "SYN Tourist e-visa" admits Y. Fallback
  when it does not: `syn-ta-1` with a run-tagged group (the design's §6.2 persona), recorded in the run record.
- Baseline (step P-0, before the set-up): SA-01 groups 3, 4, 5 (both lines) and 11; SA-02a approved-help rows;
  SA-02b and SA-02c row counts; the OP-01 view counts of OP1 and OP2. Every later count check is a delta from it.
- Setup (labelled "Setup", driven by the harness through integrated pages; design §6.2): SA1 creates and activates Y.
  Y creates the group and the drafts P, F, H, H2 and R on TA-09c and submits P, F and R on TA-08. SA1 records "Payment
  received" for P and F (SA-07a) and assigns P and F to OP1 (SA-03a). OP1 starts work and confirms readiness on P and
  F (OP-02, WP-07). Y asks for help on R and on H2 (TA-07h); SA1 records the Gate 1 exception for assignment of R
  (SA-09g) and assigns R to OP2 while R's help request is still open. SA1 grants `operator-3` read access to the group
  (existing grant page).
- Gate exceptions expire after Core's lifetime (the page never states it): the run reaches V07-D4 within it, or
  records the exceptions again as set-up.
- Order (§3): P-0, Setup, Part A (P), Part B (F), Part C (H, H2), Part D (R), Part E (isolation, tests, axe). Data of
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
| TA-07p Report a problem | 4650 `/ta/applications/:applicationId/report-problem` (new GET beside the POST) | The whole page: states, form, origin, `purpose=withdraw` |
| TA-07 Application workspace | 4650 `/ta/applications/:applicationId` | The report entry points (action panel, aside, withdraw link), the status rows "Help request" and "Problem report and return", the receipt `problem` |
| TA-08, TA-09 sections, TA-07h, TA-10, TA-07x | 4650 (WP-03, WP-08 pages) | Observation and set-up only: the submission or hand back after help, the assigned-case notices that link to TA-07p (BU-22), the help request (BU-21), notices and history lines |
| SA-02b Help requests, SA-01 groups 3 and 4 | 4652 `/admin/queues/assistance`, `/admin` | The lead for both cases, the Operator column, the known-gap note, the actions "Approve…" and "Decline…" |
| SA-09h Help request decision | 4652 `/admin/applications/:applicationId/decide/assistance_approve` and `…/assistance_decline` | Approve or decline the latest request, without and with an operator |
| OP-02a Approved assistance | 4652 `/ops/applications/:applicationId/assistance-entry` (new GET beside the POST) | The labelled task, the Gate 1 section, the entry form, the operator's upload, the "Finish" link |
| OP-02r Resolve a hold | 4652 `/ops/applications/:applicationId/holds/:holdId/resolve` (new GET beside the POST) | One page per open problem report or answered flag |
| OP-02 Application workspace | 4652 `/ops/applications/:applicationId` (WP-07 page) | The approved-assistance frame line, action-panel rows 3a, 3b and the assistance row, the Holds links, the Application & documents line |
| OP-03r Return (WP-07 page) | 4652 `/ops/applications/:applicationId/return` | The assistance effect by lifecycle, the evidence, `?resolve=` preselection, one receipt title |
| SA-02c Flags from operators, SA-01 group 5 | 4652 `/admin/queues/flags`, `/admin` | Row and item actions "Respond" / "Open" |
| SA-09f Respond to a flag | 4652 `/admin/applications/:applicationId/decide/flag_response` | Respond to the open flag |
| Old SuperAdmin case page; old operator case page; today's TA application page | 4652, 4650 | Only: the WP-09 forms leave them; links replace them; every other carried form stays |

Read models: TA application case (`core.ta_application`), Operator case (`core.ops_case`, `ops.case_work` with
`offers.startWork`, `doc.application_evidence`), SuperAdmin case and decision context (`core.admin_case`,
`ops.case_work` and `pay.application_payments` optional), SuperAdmin work queues (`core.admin_queue {assistance |
flags}`, `core.assignment_queue`), Assigned work queue (`core.ops_work`), TA history (`views.ta_history`,
projection), Notices (`dlv.notices`).

### 1.2 Command coverage (CC §5.1: 5 WP-09 commands)

| # | Command | Route id today | Page | Items |
|---|---|---|---|---|
| 1 | `core.decide_assistance` | `admin.applications.assistance_decision` | SA-09h `assistance_approve`, `assistance_decline`; SA-02b and SA-01 list them | A25 to A38, A125 |
| 2 | `core.record_assistance_entry` | `ops.applications.assistance_entry` | OP-02a (identity changes need same-person evidence) | A39 to A52, A124 |
| 3 | `core.report_problem` | `ta.applications.report_problem` | TA-07p (assigned or in approved assistance, not formally returned; creates a hold) | A01 to A15, A127, A128 |
| 4 | `core.resolve_hold` | `ops.applications.resolve_hold` | OP-02r (problem report or answered flag; a return is refused) | A53 to A65, A129, A130 |
| 5 | `core.respond_flag` | `admin.applications.respond_flag` | SA-09f `flag_response`; SA-01; SA-02c | A66 to A75, A126 |

All of them also: A76 (shell), A77 (receipt checked against the operation), A78 (no instruction to act), A79 (no
record for a refusal; lost acknowledgement), A80 (replay matrix), A81 and A82 (refusal text), A83 (LD-14), A84 to
A89 (role controls, labels, read grant and support view, storage, carried forms, isolation).

Commands outside WP-09 that the proofs touch only as set-up or observation: `intake.start_individual`,
`core.edit_draft`, `core.correct_identity`, `core.submit`, `core.request_assistance` (TA-07h) and `core.hand_back`
(TA-08 returned mode) of WP-03; `pay.record_service_status`, `core.assign`, `core.reassign`,
`core.grant_gate_exception` for Gate 1 of WP-06; `ops.start_work`, `ops.record_readiness`, `core.flag` and
`core.formal_return` (including "Return for TA review", WP07-A48, F-14, F-15) of WP-07; `doc.upload_for_application`
(ops route, register WP-03, hosted on OP-02a); `iam.create_account`, `iam.activate_account` of WP-02;
`iam.create_group_read_grant`.

### 1.3 State coverage

S1 (loading) does not apply: every WP-09 page is server-rendered. S5 applies only to the TA history (projection).

| Page | Page states | C1 validation | C2 rejected | C3 accepted | C4 unresolved | C5 stale |
|---|---|---|---|---|---|---|
| TA-07p | Closed, not with an operator, returned to you, report already open A127; assistance in progress A07; assigned A02; origin A128; support view A86 | A05 (5) | A05 (1) to (4), (6) | A03 | A11 (5) | A12 (current state and unsent text; no revision) |
| TA-07 status rows | Help states A16 to A22; holds A04, A09, A10, A13 | — | A19 | — (WP-03) | — | — |
| SA-02b, SA-01 groups 3, 4 | Rows A25; empty (S2) A25; cap A25; S4 count A26 | — | — | — | — | — |
| SA-09h | Draft A27, A28; closed application, no request, decided A34; S4 optional reads A28 | A29 | A32, A34 | A30, A31, A32 | A36 (5) | A35, A125 |
| OP-02a | Task A39; Gate 1 blocks A41; Gate 1 unavailable A41; deferred owner A42; held and exhausted A45; returned for review, no approved assistance A44 (8); read grant A86 | A44 (3), (4) | A44 | A43 | A47 (5) | A46 |
| OP-02 and OP-02r | Report open A53; flag waiting A56; flag answered A57; return A59; resolved A60; readiness A63; frame and Holds A129 | A60 (1) | A56, A59, A60 | A55, A58 | A61 (5) | A60 (2), A62 |
| SA-02c, SA-01 group 5 | Rows A66; S2 A66; current step not the flag A66 | — | — | — | — | — |
| SA-09f | Draft A68; answered, no open flag A71, A72; raiser replaced A126 | A69 | A71, A72 | A70 | A73 (5) | — (no revision; A73) |

### 1.4 Specification scenarios

| Scenario | What WP-09 shows | Items |
|---|---|---|
| V07: assigned TA can report only | TA-07 offers only "Report a problem"; TA-09 sections refuse; the report changes no data | A01, A03, A04, A14; §3 Part A |
| V07: formal return enables permitted correction; same operator reconfirms readiness | The return answers the report; the TA corrects and hands back; the same operator confirms readiness again (WP-07 pages, observed) | A10, A62, A63, A130; §3 V07-A7, V07-A8 |
| V07: approved assistance ends in TA review/submission | Help decision, bounded operator entry, "Return for TA review", the TA's own submission (draft) or hand back (submitted) | A21, A22, A27 to A32, A39 to A50, A124; §3 Parts C, D |
| BU-21: help on a draft uses the existing help decision path; no invented submission, assignment or payment bypass | TA-07h → SA-02b → SA-09h → SA-03a with Gate 1 → OP-02a → TA-08 | §3 Part C (to its boundary; first half partly met, Q-W09-08) |
| BU-22: correcting an assigned, not returned case | Report path names the operator's role and the formal return; TA-09 sections refuse; the bulk origin returns to the import | A01, A05, A14, A128; §3 V07-A1 (to its boundary) |
| V06 (help requires Gate 1 before operator work) | In-place approval and the first entry run Gate 1 for the first operator work | A28, A32, A41, A43, A49 |
| V15 (no SuperAdmin readiness, filing or entry control) | SuperAdmin pages hold decisions and responses only | A37, A74, A84 |
| V24 (keyboard and phone) | The WP-09 tasks by keyboard and at 390 px | A15, A52, A65, A90 to A101 |

## 2. Acceptance checklist

### 2.1 TA-07 and TA-07p Report a problem (`core.report_problem`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP09-A01 | TA (Y) | TA-07 of P after its assignment (§3 V07-A1) | Read the page. Look for "Change the application", upload, "Check and submit" and "Ask TravelMudra for help". | Status row Editing "With your operator". Action panel: owner "Your assigned operator"; step "This application is with your operator. Report the problem so it can be returned for correction."; blocker type "Another person owns this step"; one action "Report a problem" → TA-07p. No change link, no upload, no TA-08 link; TA-07h, if opened, shows the same sentence with a link to TA-07p and no form. No report form inside TA-07. Freshness "Read at [time] IST". | L | UX §2.3, §4.3, §4.4; BS B18; PL §3.2 TA-07; WP-03 design §3.1; design §2.2 items 1, 7; `controls.ts` `editorStage` (`awaiting_formal_return`) |
| WP09-A02 | TA (Y) | TA-07p of P | Select "Report a problem" on TA-07. Read the page. Select "Cancel". | A full-screen task page. Breadcrumb by origin, then "› [applicant] › Report a problem"; `h1` "Report a problem: [SURNAME], [Given names]"; "Application [reference]"; freshness. Ownership line: "Your assigned operator owns this application now. Only your operator can return it to you for correction (a formal return). Until then you cannot change it." Before the field: "A report tells your operator what is wrong. It changes no application data. Your operator deals with it: they may return the application to you for correction, or close the report. Filing and the packet release wait until your operator has dealt with it and checked the application again." Field "What is the problem?" (required; Core's length limit). Visible review "When you send it: your operator is notified; the application data stays as it is; the application page shows the report as open." Buttons "Send the report" and "Cancel" (→ TA-07 with the origin kept; nothing is recorded). | L | UX §3.2, §4.3; BS B18; PL §4.2 R1; design §2.1; `WP-09.md` Q-W09-01; `holds.ts` `reportProblem` (`zNote(2000)`) |
| WP09-A03 | TA (Y) | TA-07p of P (§3 V07-A2) | Type the problem. Send. | 303 to TA-07 with the C3 receipt "Problem report sent to your operator" (named: on the TA surface only this command returns a hold id with the problem-report prefix). Request reference linked to the operation status page; "Recorded once. Sending the same form again does not repeat it."; no accepted time. Recorded: "Your report changes no application data." Current: "Problem report: open since [time] IST"; Editing. The receipt shows no report text as if read back from Core (the TA read returns none, Q-05). The polite region announces it; focus does not move. | L | CMP-08; WP-06 D-02; P-02; design §2.11 `problem`; `holds.ts` (`holdId` `prb_…`); `core.ta_application` `openHolds` |
| WP09-A04 | TA (Y); test | TA-07 of P after A03 | Read the page. Compare with the reading before the report (run record). | Status row "Problem report: open since [time] IST". Stage, Editing, the applicant's facts, the document rows, the quoted price and the original estimated window are unchanged (delta none). No second report control. Action panel: owner "Your assigned operator", "Your operator deals with your report and may return the application to you."; no action. | L+T | BS B18 ("The product report changes no application data"); `test/core/assignment-holds.test.ts` "records a problem report against any revision; it changes no application data and blocks filing" |
| WP09-A05 | TA (Y); harness; test | TA-07p POSTs | (1) Harness: a second report on P from a TA-07p loaded before the first was sent (new key). (2) Harness: a report on P while it is returned (§3 V07-A7), from a TA-07p loaded before the return. (3) Harness: a report on H while it is a draft with no operator. (4) Test: a report on a completed application. (5) Send an empty field. (6) `syn-ta-2` posts a report on P. | (1) "Your earlier report is still open with your operator. Nothing was sent." (`conflict_duplicate` / `problem_report_open`), then the "Report already open" state and the unsent text block. (2) "The application changed before your report was sent. Nothing was sent." (`hold_not_applicable`), then the "Returned to you" state and the unsent text block. (3) The same sentence (`hold_not_applicable`), then "This application is not with an operator. You can change it yourself." with the change route that Core's evaluation offers. (4) "This application is closed. Nothing was sent." (`application_not_open`). (5) C1 "Describe the problem." (6) The uniform not-found page. Nothing is recorded in each case: each key's status page reads "Nothing is recorded for request [reference] so far"; TA-07's report row and the OP-01 counts are unchanged (delta). | L ((1), (2), (3), (5), (6)) + T ((4)) | design §2.1 (states), §2.10; `holds.ts` `reportProblem`; WP-01 A-08 |
| WP09-A06 | Test | The TA offer of "Report a problem" (TA-07 action panel and aside, TA-07p form) | Unit test over Core's facts: each combination of lifecycle, editor state, open return, open problem report and outcome; for each fixture, run the page's mapping and `core.report_problem`. | The page offers the report exactly where Core accepts it: lifecycle draft or submitted; editor state `assigned` or `assistance_in_progress`; no open return; no open problem report; also after an outcome while the application is still submitted (the page rule "outcome recorded" is removed, Q-W09-02). Where Core refuses, the page shows the state's own text and no control. The mapping is a closed table of Core facts; Core decides at send. | T | `WP-09.md` Q-W09-02; design F-W09-01, D-W09-08; WP-03 design F-W03-11; PL §6; `holds.ts` (guard of `reportProblem`) |
| WP09-A07 | TA (Y); operator; test | TA-07 and TA-07p of H while approved help is in progress (§3 V07-C7); test fixture | Read TA-07 and TA-07p (no send in the run). Test: send a report; the operator reads OP-02a; returns for review choosing "This return answers the travel agent's problem report". | TA-07: no primary action (the operator owns the step); the aside offers "Report a problem" → TA-07p. TA-07p's ownership line: "An operator is entering information with your approval. When they finish, they return the application to you for your review."; the form shows. Test: the report is accepted as A03; OP-02 shows it; it does not stop the operator's entry (A64); the return for review answers it; then it reads resolved. | L (offer) + T (send) | `WP-09.md` Q-W09-02; design §2.1 (state "Assistance in progress"), §2.2 item 2; UX §2.3; BS B18; `holds.ts:68` |
| WP09-A08 | TA (Y); test | TA-07 "Withdraw" section of P while assigned (carried WP-17 section); TA-07p `?purpose=withdraw` | Select "Ask your operator for a return". Read TA-07p. Test: send. | The withdraw section links to TA-07p `?purpose=withdraw`; the carried disclosure that posted the report has left TA-07. TA-07p shows first "To withdraw an application that is with your operator, ask for a return first. Once it is returned to you, you can withdraw it on the application page."; the field holds "Please return this application to me: the applicant wants to withdraw it.", which the TA may change. The send uses the same command: the receipt and the states of A03 and A04. The withdrawal itself stays with WP-17. | L (page) + T (send) | `WP-09.md` Q-W09-10; design §2.1 items 3, 4, §2.2 item 6; BS B18 ("separate withdrawal … wait for formal return"); LD-02 |
| WP09-A09 | TA (Y) | TA-07, TA-10 and TA-07x of P after OP1 resolved the report (§3 V07-A5) | Read TA-07. Open TA-10 and the notice. Open the history. | TA-07: "Problem report: None open"; the action panel is the assigned state of A01 again. TA-10: a notice that your operator resolved the problem report, linked to P, with no acknowledgement and no read marker. History: a line "Problem resolved" with "Recorded [time] IST" and the lag freshness. The operator's resolution note is not shown: no TA read returns it (partly met, Q-05). | L | LD-06; LD-08; `holds.ts` `resolveHold` (TA notice); `case-projectors.ts` (`problem_resolved`); Q-05 |
| WP09-A10 | TA (Y) | TA-07 of P after OP1 returned it answering the second report (§3 V07-A7) | Read the page. | Editing "Returned to you for correction"; the operator's note verbatim first; "Problem report: None open" (the return resolved it); action "Correct the application" → TA-09t, then TA-08 returned mode "Hand the application back" (WP-03). The same operator stays your operator. | L | UX §12 V07; BS B18; PL §4.2 R2, R3; `holds.ts` `formalReturn` (`resolveProblemHoldId`) |
| WP09-A11 | TA (Y); harness | TA-07p report, the Nth time | Replay terms 1 to 5 (§0.2) on A03. Term 2 changes the text. Term 3: press Back after the receipt; harness: a new-key send. Term 4: the empty send of A05 (5), then corrected. | (1) One report; the same 303 and receipt; one TA-07 row, one OP-02 notice, one operator notice. (2) "This form was already used with different text. Your text is kept: check it and send again."; nothing recorded. (3) Back reloads TA-07p in the "Report already open" state with no form; the new-key send is refused as A05 (1) and leaves no record. (4) Recorded once. (5) C4 at `/ta/operations/<key>`; "Open the result" → TA-07; no new report is offered there. The report carries no revision: no stale case exists; the business check answers. | L+T | PL §7 K-STD; BS B35; W1 A-02, A-08; design §2.10, §4.1; `holds.ts` ("valid against any revision") |
| WP09-A12 | TA (Y), two tabs; operator (OP1) | TA-07p of P (§3 V07-A7) | Tab 1: open TA-07p and type. Meanwhile the second report (tab 2) is sent and OP1 returns P answering it. Send tab 1. | "The application changed before your report was sent. Nothing was sent." (`hold_not_applicable`); then the "Returned to you" state with the operator's note and the correction links; the typed text in the unsent text block. Nothing is recorded. | L | UX §3.3; BS B19; design §2.1 (C2), §4.3 ("A returned case reported") |
| WP09-A13 | TA (Y); test | TA-07 of F while OP1's flag waits and after SA2's response (§3 V07-B1, V07-B6) | Read the action panel and the status rows. | Status row "Problem report and return": "Your operator asked TravelMudra for a decision" while the flag is open. Action panel while the flag waits: "TravelMudra is reviewing a question from your operator. Nothing is needed from you." After the response: a text that says the operator continues and nothing is needed from the TA. Never "the reported problem" or "your report": the TA reported nothing (F-13: the TA text names a problem report only for a problem-report hold). Neither the flag's note nor the response is shown (the TA read returns neither). No flag line in the history. | L+T | `WP-07.md` F-13; design §2.2 item 4; `derived.ts` rules 9, 10; `presentation.ts:278-285` |
| WP09-A14 | TA (Y); harness | TA-09t and the sections TA-09d, TA-09i, TA-09f of P while assigned and not returned (BU-22; §3 V07-A1) | Open each. Harness: post an edit, an identity correction and an upload. | Each page shows CMP-10 "This application is with your operator. Report the problem so it can be returned for correction." with a link to TA-07p, and no form. Each hand-made post is refused with the same sentence (`awaiting_formal_return`); nothing is recorded. The report path names your assigned operator as owner and the formal return as the way back. | L | BU §8.2, §9 BU-22; BS B18; design §2.2 item 7; `drafts.ts` `taEditorPermits`; `controls.ts` `editorStage`; WP03-A177 |
| WP09-A15 | Phone user, TA | TA-07 and TA-07p of P at 390 px | Open TA-07p from TA-07. Send it empty, then with text. | TA-07: identity band → action panel ("Report a problem") → status rows → sections. TA-07p: full-screen task page; the ownership lines before the field; the error summary visible when focused; the button at the end, not in a fixed bar. No horizontal page scroll. | L | UX §7.3 (Mobile); PL TA-07 (Mobile); design §2.0, §2.1; AC-04, AC-21 |
| WP09-A127 (new, §2.1) | TA (Y) | TA-07p by GET in each state (§3 V07-A2, V07-A7, V07-C1; test fixtures) | Open TA-07p of: P with its report open; P while returned; H while a draft with no operator; R after its hand back (assigned) and a completed application (test). | First match: "Closed" (lifecycle not draft or submitted): "This application is closed. A problem report is not available." and "Open the application", no form. "Not with an operator" (`unassigned`): "This application is not with an operator. You can change it yourself." with "Change the application" (TA-09t) when `correct.allowed`, else the `correct` blocker sentences; no form. "Returned to you": "Your operator returned the application to you. You do not need to report a problem." with the operator's note ("No note was given." when none) and "Returned [time] IST"; draft: "Check every answer, then submit it yourself." with "Check and submit"; submitted: "Correct what your operator asks, then hand the application back." with "Correct the application" and "Hand it back"; no form. "Report already open": "Your problem report is with your operator since [time] IST. A second report is not accepted while this one is open. …" no form. "Assigned" (R after the hand back): the form. | L+T (closed) | design §2.1 (states); `WP-09.md` Q-W09-01 |
| WP09-A128 (new, §2.1) | Test | TA-07p opened from a bulk page (`?from=import&attempt=<ina_…>`); unknown query values | Render TA-07p; send; cancel. | Breadcrumb "Groups › [group] › Import › [applicant] › Report a problem"; "Cancel" returns to `/ta/intake/<attemptId>`; the receipt location keeps the origin; the origin fields are BFF-only and never reach Core; an unknown `from` or `purpose` value is ignored. No bulk page posts the report itself. | T | design §1.2, §1.7 S-W09-01, D-W09-07; `WP-09.md` Q-W09-08, Q-W09-11; BU-22 |

### 2.2 TA-07 and TA-08: help states and the end of approved help

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP09-A16 | TA (Y) | TA-07 of H through §3 Part C, of H2 at V07-C5 and of R through Part D | Read the status row "Help request" and the action panel at each step. | One labelled row from Core's facts (`assist.state`, `editor_state`) with the words of §0.2 (design §2.2 item 4); an unknown state shows "Unrecognised state" and "Reference: [code]". No decline reason, approver or decision time (the TA read returns none; Q-05). "Help approved" never appears as the application's status, and no row says "Submitted" before the TA's own submission. | L | UX §3.2 (Approved assistance); BU §8.2 ("Show approved, declined or awaiting decision truthfully"); design §2.2 item 4, F-W09-07; `ASSISTANCE_STATES` |
| WP09-A17 | TA (Y) | TA-07, TA-07h and TA-10 of H2 after the decline (§3 V07-C5) | Read TA-07. Open TA-07h. Open TA-10. | TA-07: "Help request: Declined"; the draft is unchanged (delta none); "Ask TravelMudra for help" is offered again (Core's `assistance` evaluation allows it). TA-07h offers the form (no new request is sent in the run). TA-10: a notice of the decision, with no acknowledgement and no read marker. | L | BS B17, B18; `assignment.ts` `decideAssistance` (notice `assistance_decision`); LD-06 |
| WP09-A18 | TA (Y) | TA-07 of H after the approval, before an assignment (§3 V07-C6) | Read the page. | "Help request: Approved: TravelMudra assigns an operator". The action panel reads Core's answer (owner TravelMudra, `assistance_approved`, `assign_operator`): nothing is needed from the TA now. H stays a draft; no submission; no price change. Editing as Core reports it ("You can change it": Core lets the TA change an unassigned draft until help starts); "Check and submit" stays offered when Core's evaluation allows it. | L | BS B17, B18; `derived.ts` rule 12; `controls.ts` (`taSide` blocks only `assigned`, `assistance_in_progress`) |
| WP09-A19 | TA (Y); harness | TA-07 and TA-09d of H while approved help is in progress (§3 V07-C7) | Read TA-07. Open TA-09d. Harness: post an edit and a submission. | TA-07: Editing "An operator is entering information with your approval"; Help request "Approved: an operator is entering information"; owner your operator; blocker type "Another person owns this step"; no primary action; the aside "Report a problem" (A07); no change link, no TA-08 link, no TA-07h form. TA-09d: "An operator is entering information with your approval. You can change the application again when they return it to you." and no form. Both posts are refused with that sentence (`hold_assistance_in_progress`); nothing is recorded. | L | UX §3.2; BS B18; WP-03 design §3.1; design §2.2 items 2, 4; `drafts.ts` `taEditorPermits`; `controls.ts` `editorStage` |
| WP09-A20 | TA (Y) | TA-07 of H after OP1's "Return for TA review" (§3 V07-C12) | Read the page. | Editing "Returned to you for review" (not "for correction"); Help request "Ended"; the operator's note verbatim first; action panel: owner You, "Review what the operator entered, then submit." → TA-08; the text "An operator entered information with your approval. Check every answer before you submit." No text says that the operator submitted, confirmed or authorized anything for the TA; no "Submit for TA". The fields that the operator changed are not marked: no TA read returns them (partly met, Q-05); TA-08 shows every current answer. | L | UX §3.2, §4.3, §5.3; PL §4.2 A5, A6; WP-03 design §3.1; design §3.1; Q-05 |
| WP09-A21 | TA (Y); operator (OP1) | TA-08 of H, then TA-07 and OP1's OP-01 (§3 V07-C13) | Review the answers (the travel purpose that the operator entered). Tick the confirmations. Submit. | TA-08: "An operator entered information with your approval. Check every answer."; the operator's entry shows as a current answer; no confirmation is ticked by the page. C3 receipt "Application submitted" (WP-03), Next "your assigned operator": the quoted price fixed now (help changed no price), the original estimated window starting now. TA-07: Stage "Submitted"; Editing "With your operator"; the same operator who helped; Help request "Ended". OP1's OP-01 lists H as Core places it (start of work). The history shows "Submitted" once, after "Returned to you". | L | UX §3.2, §12 V07; BS B17, B18 ("followed by formal return for TA review/submission"); design §3.1, §6.3 V07-18; `submission.ts` (returned draft: return closed, editor `assigned`, help `fulfilled`); `test/core/assignment-holds.test.ts` "runs request, decline, approve, … formal return and the travel agent's own submission" |
| WP09-A22 | TA (Y); operator (OP2) | TA-07 and TA-08 returned mode of R after OP2's "Return for TA review" (§3 V07-D5, V07-D6) | Read TA-07. Hand the application back on TA-08. Read OP-02 of R as OP2. | TA-07: "Returned to you for review" with the note; Help request "Ended"; action → TA-08 returned mode (WP-03): "Quoted at submission: [₹] (unchanged)", "Original estimated window: … (unchanged)", "Hand the application back". Receipt "Handed back to your operator" (WP-03). After the hand back: Editing "With your operator"; the operator is OP2, unchanged. OP-02 of R: Core's next step for OP2 (start work, then readiness); no authorization before readiness. | L | BS B18; WP-03 Q-W03-06; `WP-07.md` F-14; design §3.1; `holds.ts` `formalReturn` (help `fulfilled`), `handBack` |
| WP09-A23 | TA (Y) | TA-07x of H, H2, R and P after §3 | Read each history. | Lines in order, each with "Recorded [time] IST": H "Help requested", "Help approved", "Assigned to an operator", "Returned to you", "Submitted"; H2 "Help requested", "Help declined"; R "Help requested", "Assigned to an operator", "Help approved", "Returned to you", "Handed back"; P "Problem reported", "Problem resolved", "Problem reported", "Returned to you", "Problem resolved", "Handed back". No flag line, no operator entry details. Freshness in the lag form. | L | LD-08; WP-08 Q-10; `case-projectors.ts` (`PLAIN_CORE_LINES`) |
| WP09-A24 | TA (Y) | TA-10 after §3 | Read the list. Open one notice. | One notice per help decision (H, H2, R), per return (P, H, R) and per resolved problem report (P), each linked to its application; none needs acknowledgement; no "Unread", "New" or "Mark as read". Counts are the deltas from Y's P-0 reading. | L | LD-06; WP08-A89 to A91; `assignment.ts`, `holds.ts` (notices) |

### 2.3 SA-02b and the SA-09h help decision (`core.decide_assistance`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP09-A25 | SuperAdmin (SA1) | SA-02b after §3 V07-C1 | Read the page. | `h1` "Help requests". Lead (D-07): "Travel agents ask TravelMudra to enter information with them. On an application with no operator, approving assigns nothing and does not pass Gate 1: assignment and the operator's first work still need the service payment recorded, or a Gate 1 exception. On an application that already has an operator, approving starts the operator's entry at once, and Gate 1 for the first work is checked at the approval." Under the lead, the known-gap note (design §3.2). Rows of `core.admin_queue {assistance}`: Application; Status; Service payment (Gate 1); "Operator" ("Assigned" / "Not assigned", from `assigned_operator_id`); actions "Approve…" (SA-09h `assistance_approve`) and "Decline…" (SA-09h `assistance_decline`), not the old case page. Freshness "Read at [time] IST". A cap line only when the read returns its row limit. S2: "No help request waits for a decision." Rows = baseline + 3 after V07-C1 (R, H2, H). | L | UX §6.2; PL §3.4 SA-02; design §2.9, §3.2; `WP-06.md` D-06, D-07; `lists.ts` (`queueOf`) |
| WP09-A26 | SuperAdmin (SA1) | SA-01 groups 3 and 4 during §3 Parts C and D | Read after V07-C1, V07-C3, V07-C5, V07-C7 and V07-D3. | Group 4 "Help requests to decide" equals the SA-02b rows (after C1 baseline + 3; after C3 + 2; after C5 + 1; after D3 baseline); its item lines carry the links "Approve" and "Decline" (SA-09h). Group 3 "Approved help waiting for an operator" equals SA-02a's approved-help rows (after C3 + 1; after C7 baseline); its item lines open SA-03a. No two counts are added. | L | WP06-A02, A03; WP-06 design §2.1; design §2.9 |
| WP09-A27 | SuperAdmin (SA1) | SA-09h `assistance_approve` for H (no operator; §3 V07-C3) | Read the page. Select "Decline instead"; read; select "Approve instead". Select "Cancel". | CMP-25 order. `h1` "Approve a help request: [applicant]"; the header link "Decline instead" (on the decline page: "Approve instead"). Scope: "Application [reference] · [service] · Travel agent [name]. Help request [reference]: the travel agent asks TravelMudra to enter information with them. This decision answers this one request." Evidence: "What the travel agent asked for:" the note verbatim (or "No note was given."); Stage; Editing; Operator "No operator assigned"; Service payment (Gate 1) with the latest entry when the optional read answers; the Gate 1 exceptions table; open holds. Effect (no operator): changes "The help request becomes approved. The travel agent is notified." "The application waits in Assignment as approved help for an operator." and what happens at the assignment; unchanged "It does not assign an operator." "It does not pass Gate 1: …" "It does not submit the application, confirm the travel agent's authority, record a payment, pass Gate 2, record readiness, or change the price or the original estimate." and, for a draft, "The application stays a draft until the travel agent submits it."; then the known-gap line. No hard-stops section. Your decision: "Reason for approving" (required) and the hidden fields `assistanceId`, `decision` = `approve`, `_rev.application`; no radio and no visible choice. Visible review. Buttons "Approve help request" and "Cancel" (→ SA-02b; nothing is recorded). The decline page has the decline effect ("The help request becomes declined. The travel agent is notified of the decision." / "The application, its editing state and its operator stay as they are." "Declining does not prevent a later request."), "Reason for declining", hidden `decision` = `decline`, "Decline help request". Freshness "Read at [time] IST". | L | UX §6.3, §7.3; PL §3.4 SA-09; design §2.7; `WP-09.md` Q-W09-03, G-04; D-W09-03, D-W09-04; `WP-06.md` D-06, D-07 |
| WP09-A28 | SuperAdmin (SA2); test | SA-09h `assistance_approve` for R (operator OP2, work not started, unpaid; §3 V07-D1) | Read the page. | As A27, with Operator "[OP2]", "Work on this assignment: Not started" (`ops.case_work`; "Unavailable" when that optional read fails for availability), the Gate 1 exceptions table (no first-work exception), Service payment "Not recorded". The effect row for an application with an operator is written in full and inherits no sentence of the row without an operator (G-08): "Approved assistance starts on the current assignment now: the editing state becomes 'Operator assistance in progress' and [OP2] is notified; the travel agent cannot change the application until the operator returns it for their review." "Core checks Gate 1 for the operator's first work on this assignment at this approval, unless it was already decided for this assignment. It passes on a service payment recorded as received. Otherwise it uses a fresh Gate 1 exception for first operator work once; while the payment is not recorded, that opens a payment-missing follow-up owned by the SuperAdmin who granted the exception." With an open return (test fixture): "The open return to the travel agent closes: the operator enters the information instead." Unchanged: no submission, no confirmation of authority, no payment record, no Gate 2, no readiness, no price or estimate change; "Filing authorization and packet release stay unavailable while assistance is in progress." No sentence says that the approval does not pass Gate 1 or that the travel agent can still change the application. The review reads "When you approve: if Gate 1 for the first work passes, assistance starts now for [OP2]; otherwise nothing is recorded and this page shows the routes." The page predicts no Gate 1 answer before the send (Core's answer for this action is Deferred until the Core batch, P-10 e). | L (R) + T (return) | `WP-09.md` G-08 (review R-08); design §2.7 item 4, item 7; `WP-06.md` D-05, D-07; `assignment.ts` `decideAssistance` (`inPlace`, `requireGate1AtWork`, return resolution `assistance_approved`); P-10 e |
| WP09-A29 | SuperAdmin (SA1) | SA-09h `assistance_approve` for H (§3 V07-C3) | Send with an empty reason. Then with a reason that is too short. | C1 at the field: "Enter a reason of at least 10 characters."; the error summary focused; the typed reason kept; the hidden `decision` unchanged; nothing recorded. The same on the decline page. | L | AC-08; CMP-07; design §2.7 (C1), §2.10; `zReason` |
| WP09-A30 | SuperAdmin (SA2) | SA-09h `assistance_decline` for H2 (§3 V07-C5) | Give the reason. Send. | C3 receipt "Help request declined" (named: the returned request id equals the case's latest request and its state is declined; otherwise "Request recorded"); Current: Editing; Operator. SA-02b H2 row gone (delta − 1); SA-01 group 4 − 1. TA side: A17. | L | WP-06 D-02; design §2.11 `decided`; `assignment.ts` (`assistanceId` in the summary); `core.admin_case` `assistance` (latest request) |
| WP09-A31 | SuperAdmin (SA1) | SA-09h `assistance_approve` for H (§3 V07-C3) | Give the reason. Send. | C3 receipt "Help request approved" (read by id: approved); Current: Editing; Operator "No operator assigned"; and, because the payment is not recorded: "Service payment: not recorded. The operator's first work will need the payment or a Gate 1 exception for first operator work." The page then shows the Decided state with "It waits for an operator." and the link "Assign an operator" (SA-03a). The receipt states what was recorded and the current facts labelled "Current"; a later replay shows the facts of that time (A78). SA-02a lists H as approved help (delta + 1); SA-01 group 3 + 1, group 4 − 1. | L | BS B18; design §2.7 (Decided), §2.11, §3.2; `WP-07.md` F-01; `derived.ts` rule 12 |
| WP09-A32 | SuperAdmin (SA2) | SA-09h `assistance_approve` for R (§3 V07-D1, V07-D3) | Give the reason. Send. Then (set-up V07-D2) record the Gate 1 exception for the first operator work on SA-09g. Open SA-09h `assistance_approve` again; send. | First send: form-level "Approval needs Gate 1 for the operator's first work on this assignment: the service payment is not recorded as received and no fresh Gate 1 exception for first operator work exists. Nothing was recorded." with the routes "Record a Gate 1 exception for first operator work" (SA-09g `gate1_first_work`), "Record the payment" (SA-07a) and "Decline instead"; the reason kept; the request stays "Requested" (SA-02b row stays). Second send (new key, reloaded page): C3 receipt "Help request approved"; Current: Editing "Operator assistance in progress"; Operator OP2; Gate 1 for the first work "Action allowed by exception: Gate 1, for the first operator work, once: used", never "Payment received"; the payment-missing follow-up that the used exception opened (SA-07a for R; SA-01 group 11 + 1, owner SA2; group 11 reads a projection, so the delta is read when its freshness line reads up to date). | L | `WP-06.md` D-07 (review R-07); WP06-A147 (T there; L here); design §2.7 (C2), §4.3; `assignment.ts` (`requireGate1AtWork`, `consumeException`, `openFinancialException`); `WP-07.md` F-05 |
| WP09-A33 | Test | SA-09h `assistance_approve` on a formally returned application (fixture: submitted, returned to the TA, help requested by the TA, work started on the assignment) | Approve. Read TA-07 and OP-02. | Accepted (Gate 1 for the first work rests on the recorded basis). The return closes (Core's resolution `assistance_approved`): TA-07 Editing changes from "Returned to you for correction" to "An operator is entering information with your approval"; OP-02 shows the approved-assistance task. The decision page stated this before the button (A28). | T | `assignment.ts` `decideAssistance`; BS B18 |
| WP09-A34 | SuperAdmin; harness; test | SA-09h by GET and by POST envelopes | (1) Open SA-09h for H after its approval and for H2 after its decline (GET). (2) Open SA-09h for an application with no help request (P). (3) Harness: send a saved envelope of H2's decline page (H2's request id, old revision) after the decline. (4) Harness: send a POST to H's route with the request id of H2 (foreign id) and the current revision. (5) Test: the application is completed while a request is open. | (1) The Decided state: "This help request was approved." with "Approved assistance is in progress." or "It waits for an operator." (link "Assign an operator"); "This help request was declined."; "This help has ended." for `fulfilled`; no form. (2) "No help request exists for this application." No form. (3), (4) Refused `stale_revision`: CMP-14 rows "Help request: you saw Requested / current [state]", Operator, Editing, Stage; the unsent reason kept; the form returns only when the latest request is still `requested`; nothing recorded. (5) "Help decisions apply only to open applications." with "Open the application"; a POST is refused (`application_not_open`) with the closed state and the unsent text block; nothing recorded. | L ((1) to (4)) + T ((5)) | `WP-09.md` G-04 (review R-04); design §2.7 (states), §2.12; `assignment.ts` (`stale_revision` for a request that is not the open one; `application_not_open`) |
| WP09-A35 | SuperAdmin (SA1, SA2); TA (Y); test | SA-09h of H2 (§3 V07-C5) | SA1 opens `assistance_approve` of H2; SA2 opens `assistance_decline` of H2. SA2 declines (A30). SA1 sends. Test: the travel agent changes the draft while a decision page is open; the decision is sent. | SA1: C5 (CMP-14) "Help request: you saw Requested / current Declined" with Operator, Editing and Stage; "No second decision was recorded."; the reason kept; no form (the request is no longer `requested`). Test: C5 with the changed revision; the reason kept; the form returns with the current facts; nothing recorded. | L+T | UX §3.3; BS B19, B35; design §2.7 (C5), §4.1, §6.3 V07-22; `requireRevision`; `assignment.ts` (`state = 'requested'` guard) |
| WP09-A36 | SuperAdmin; harness | SA-09h, the Nth time | Replay terms 1 to 5 on A31. Term 2 changes the hidden `decision` from `approve` to `decline` with the same key. Term 3: Back after the receipt; harness: a new-key send with the current revision. Term 4: A29, then corrected. | (1) One decision; the same receipt; one notice to the TA. (2) Refused as a used form; the request stays approved; nothing recorded. (3) Back reloads SA-09h in the Decided state with no form; the new-key send is refused: Core answers `stale_revision` for a decided request (no separate duplicate code), and the page shows CMP-14 "you saw Requested / current Approved" and "No second decision was recorded." (Q-08). (4) Recorded once. (5) C4; no new decision is offered there. A raw stale envelope (new key, older revision) → C5 with the changed facts. The refused in-place approval of A32 resent after the exception is accepted once. | L+T | PL §7 K-STD; BS B35; W1 A-02, A-08; WP-06 D-12; design §4.1; `assignment.ts` |
| WP09-A37 | SuperAdmin | SA-09h, SA-02b, the SuperAdmin case page | Look for controls. | No assistance-entry form, no "Submit for TA", no "Confirm readiness", no "Return for TA review" on any SuperAdmin page. SA-09 receipts never say "submitted", "ready" or "approved" about the application; "Help approved" names the help request only. | L | BS B18 ("A SuperAdmin cannot make that judgment or file"); UX §2.3; PL §11.1 |
| WP09-A38 | SuperAdmin; test | Old SuperAdmin case page of H while its request is open; SA-02b; SA-01 | Open the pages. | The carried help-decision form has left the old case page; the section "Assistance request" shows the state and the travel agent's note and the links "Approve help request" and "Decline help request" (SA-09h). SA-02b actions and SA-01 group 4 items open SA-09h. A unit test lists the forms that left and the carried forms that stay (for example the WP-17 deferral decision). | L+T | LD-02; LD-07; CC-04; CC-12; WP06-A110; design §1.5, §2.9; `admin.ts` (section `assistance`) |
| WP09-A125 (new, §2.3) | Test | SA-09h `assistance_approve` open while the application is reassigned | Open the approve page of an application with an operator and an open request. Another SuperAdmin reassigns it. Send. Then approve from the refreshed page. | The send is refused `stale_revision`: CMP-14 "Operator: you saw [old operator] / current [new operator]"; the reason kept; nothing recorded. The refreshed page's effect names the new assignment. A first-work exception granted for the old assignment has lapsed, so the next approval is refused for Gate 1 with the routes of A32 unless the payment is recorded or a new first-work exception exists. | T | `WP-09.md` G-09 (review R-09); design §4.3 ("Help decided while the case was reassigned"); `assignment.ts` (`requireRevision`; exception freshness by active assignment) |

### 2.4 OP-02a approved assistance (`core.record_assistance_entry`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP09-A39 | Operator (OP1) | OP-02 and OP-02a of H after its assignment for help and the first-work exception (§3 V07-C10) | Open OP-02. Select "Enter information". Read OP-02a from the top. | OP-02: the frame line "Approved assistance in progress. You may enter information with the travel agent's approval, then return it for their review." with "Enter information" (A129); action-panel row "Approved assistance: enter the information, then return it for the travel agent's review", action "Enter information" → OP-02a, secondary "Return for TA review" → OP-03r. OP-02a: the OP-02 frame without tabs; page title "Approved assistance"; the label band "Approved assistance. You enter information with the travel agent's approval. You never confirm or submit for them. When you finish, return the application for their review."; "What the travel agent asked for:" the note verbatim and "Help request [reference]"; "Gate 1 for your first work on this assignment"; "What you can change" and "What you cannot change here" (the service, the group and its travel dates, the price and the original estimate, the travel agent's confirmations, the submission); the form; "Documents"; "Finish" with "Return for TA review" (never "Submit for TA"). OP-01: H in "Action now" (delta + 1). | L | UX §5.3 (Assistance); PL §3.3 OP-02, §4.2 A4, A5; BS B18; design §2.3, §2.5 items 1, 2; D-W09-09; `derived.ts` rule 13 |
| WP09-A40 | Operator (OP1) | OP-02a form of H | Read every input. | Fieldset "Application details": one input per declared field of the governing declaration, labelled, prefilled ("(optional)" when not required; a select for declared options); "Country of residence (three-letter code)"; "Passport type". Fieldset "Identity details": surname, given names, date of birth, passport number, issuing country, nationality, prefilled; hint "Change a detail only when an identity document of this application shows the new value." Fieldset "Identity evidence": one checkbox per identity document of this application, named by type, unchecked on a fresh form (G-07). "Where the information came from" (required). Visible review "When you record this: the application information changes now, or is held if a filing may have happened; an identity change needs the chosen document to show the new values; the travel agent sees the information when you return the application for their review." Button "Record the information". | L | BS B19; design §2.3 item 6; `WP-09.md` G-07; `drafts.ts` (`zEntry`); `core.ops_case` (`formFields`, `identityEvidence`) |
| WP09-A41 | Operator (OP1); harness; test | OP-02, OP-02a and OP-03f of H before the first-work exception (unpaid; §3 V07-C8); test fixtures | Read OP-02 and OP-02a (GET). Open OP-03f; harness: post a flag. Test: send a saved entry envelope of H while Gate 1 blocks; render OP-02a with `ops.case_work` unavailable. | OP-02a by GET: the Gate 1 section and, in place of the entry form and every upload form, CMP-10 "Entering information is unavailable until Gate 1 passes for your first work on this assignment: the service payment is not recorded as received and no fresh Gate 1 exception for first operator work exists. Owner: SuperAdmin." and the known-gap line "A flag is not available while approved assistance is in progress, and no SuperAdmin queue lists this application yet. Ask a SuperAdmin to record the service payment or a Gate 1 exception for first operator work."; no entry form, no upload form; "Finish" with "Return for TA review" kept (Core accepts a return). OP-02: the assistance row with blocker type "A decision can resolve it", owner of the blocker SuperAdmin, no flag route, the known-gap line. OP-03f: the same line and no form; the hand-made flag is refused (`hold_not_applicable`) and records nothing. Test: the saved envelope is refused `gate1_payment_not_received` with the CMP-10 sentence and the known-gap line; the typed values and the posted evidence ticks are restored; nothing recorded. Test: with `ops.case_work` unavailable the section reads "Unavailable. TravelMudra checks Gate 1 when you record the entry." and the form shows; Core decides at send. | L (GET) + T (envelope, unavailable) | `WP-09.md` G-05 (review R-05), Q-W09-07; design §2.3 (state "Gate 1 blocks the first work"), §2.5 item 2, §3.2; `WP-06.md` D-06; WP06-A148; `controls.ts:668-675`; `holds.ts` `flag` (`editor_state = assigned` only) |
| WP09-A42 | Operator (OP1); SuperAdmin; TA; test | OP-01, OP-02, TA-07, SA-01, SA-02 and SA-09g of H while Gate 1 for its first work blocks (§3 V07-C8) | Read the pages. | Today (recorded, not a fail): Core's answer names the assigned operator (`hold_assistance_in_progress`, `start_operator_work`) and no SuperAdmin queue lists H. **Deferred until the Core batch** (P-12 option C as narrowed, with P-10 e; design §3.3): Core substitutes owner SuperAdmin, reason `gate1_payment_not_received`, next action `grant_or_refuse_gate_exception` and the operator as follow-up; then OP-02's panel reads "Waiting on SuperAdmin: a Gate 1 decision for your first work" with "A SuperAdmin sees this application in 'First work waiting for Gate 1'."; TA-07 reads "TravelMudra decides how the operator's work can start. Nothing is needed from you now."; SA-02 gains the view "First work waiting for Gate 1" (`/admin/queues/first-work`) with "Read at [asOf] IST" and, when truncated, "This list may be incomplete: more applications may wait."; SA-01 gains the group after group 3; SA-09g and SA-09h name an unusable first-work exception ("expired / stale / its grantor is not active: revoke it, then record a new one"); the known-gap lines are removed. | T (when served); Deferred | PROPOSALS P-12 (Max: option C narrowed); P-12 §11.1 to §11.4; design §3.3; PLAN §7 #25, §8 S-08 |
| WP09-A43 | Operator (OP1); test | OP-02a of H after the first-work exception (§3 V07-C10) | Enter the travel purpose; give "Where the information came from"; send. Test: an identity correction on an application whose passport shows the corrected given names, with that passport ticked. | 303 to OP-02a with the C3 receipt "Information recorded" (named: on the operator surface only this command returns a correction id with a stage; stage `applied`). Current: "Information version [n]"; Editing; "Gate 1 for the first work: Action allowed by exception: Gate 1, for the first operator work, once: used", never "Payment received". The Gate 1 section then reads "Not checked again: work on this assignment has started" or "No blocker now…" as Core's evaluation answers. Stage stays "Draft". Test: the identity correction is accepted with the same receipt, and the passport row shows Core's state truthfully ("Processing" until Documents decides again, then "Accepted"). | L + T (identity) | design §2.3, §2.11 `entry`; `drafts.ts` (`correctionId`, `stage`); `corrections.ts` (`reevaluateForApplication`); `test/system/case-rules.test.ts` "lets the assigned operator correct identity details in an assistance entry, only with the application's passport showing them"; `WP-07.md` F-05 |
| WP09-A44 | Operator; harness; test | OP-02a of H (§3 V07-C10, V07-C11); OP-02a of P | (1) Change the given names with no document ticked. (2) Change the surname with the passport ticked (the passport does not show the new surname). (3) Harness: a new-key send of the current values after A43 (no change). (4) Send an empty explanation. (5) Test: tick more identity documents than Core's limit (fixture with five identity documents). (6) Harness: a declared field value outside its options. (7) Test: a nationality outside the served population. (8) Open OP-02a of P (ordinary work) and of H after the return for review (GET); test: send saved envelopes to both. (9) OP2 posts an entry on H. | (1), (2) At the evidence fieldset: "The chosen documents do not show the new identity details with at least two unchanged details of this applicant. Choose the document that shows them, or leave the identity details unchanged." (`identity_same_person_evidence_insufficient`); in (2) the ticked passport stays ticked (restored from the posted values, G-07). (3) "Nothing changed: every value you sent is the one on record. Nothing was recorded." (`correction_no_change`). (4) C1 on the explanation. (5) A field error on the evidence fieldset that states Core's limit; every ticked document stays visible and ticked; nothing is truncated (Q-W09-04). (6) A field error on that field (`not_an_option`). (7) `population_out_of_scope` in words. (8) GET of P: "No approved assistance is in progress. Ordinary work does not change application information: return the application to the travel agent for corrections." with "Return to TA", no form; GET of H: "You returned the application for the travel agent's review. Approved assistance has ended." with "Open the application", no form; the envelopes: "Approved assistance is no longer in progress: [current editing state]. Nothing was recorded." with the unsent values (`assistance_not_approved`, `hold_returned_to_ta`). (9) The access page (SH-02). The typed values stay in each re-rendered form; nothing is recorded. | L ((1) to (4), (6), (8) GET, (9)) + T ((5), (7), (8) envelopes) | design §2.3 (states), §2.10; `WP-09.md` Q-W09-04, G-07; `drafts.ts`; `corrections.ts`; `controls.ts` `editorStage`; `model.ts` `validateFormFields`; WP-06 D-10; WP-08 E-04 |
| WP09-A45 | Test | OP-02a of a submitted application with approved help in progress and an external act (fixtures) | (1) The act is `authorized` or `filing_unknown`: read OP-02a; record an entry; send the same proposal again with a new key. (2) The act is `reconciliation_exhausted`: read OP-02a; send a saved entry envelope. | (1) A warning above the form: "A filing may have happened. An entry is held, not applied, until the act is reconciled; protected facts do not change." The form stays. The receipt from stage `held`: "Information held: a filing may have happened" with "It applies only after evidence that the act was not filed. The current information is unchanged." The second send records another held correction (A80 (3)); OP-02a lists the held entries that its reads return before the form. (2) No form. The reason in words with its owner: an entry is refused while the filing outcome stays unresolved after reconciliation was exhausted (`filing_possibly_occurred`); the envelope is refused with that sentence and "Nothing was recorded."; nothing recorded. Each state has its own copy test. | T | `WP-09.md` G-02, G-03 (review R-02, R-03); design §2.3 (state "Possibly filed"); BS B23; `corrections.ts` (`correctionStage`, `applyCorrection`); `store.ts:359-364` |
| WP09-A46 | Operator (OP1), two tabs | OP-02a of H (§3 V07-C10b) | Tab 1: open the form and change a declared field. Tab 2: record another entry. Send tab 1. | C5 CMP-14 rows: each field whose posted value differs from the current snapshot ("your value / current value") and Editing (current); the typed values stay in the fields while the entry state applies; nothing overwritten; the send from the refreshed form is recorded once. | L | UX §3.3; BS B19 ("No latest-write-wins"); design §2.3 (C5), §2.12; `requireRevision` |
| WP09-A47 | Operator (OP1); harness; test | OP-02a entry, the Nth time | Replay terms 1 to 5 on A43. Term 2 changes one field. Term 3: Back after the receipt; send the reloaded form unchanged. Term 4: A44 (4), then corrected; test: a saved envelope refused for Gate 1, then the same envelope's values sent after the exception. | (1) The original 303 and receipt; one correction; one snapshot. The identity values reach Core as posted, the same for the same input, never as a difference from the identity read at send time; so a replay after acceptance is the same content (D-W09-05; WP-03 C-04 class). (2) Refused as a used form; values kept; nothing recorded. (3) The reloaded form shows the current values; its send is refused "Nothing changed: …" (`correction_no_change`, the business answer for an applied entry) and records nothing. (4) Recorded once; in the test the refused envelope records nothing and the later send is recorded once. (5) C4; no new entry is offered there. | L+T | PL §7 K-STD; BS B35; WP-03 C-04; `WP-09.md` Q-W09-04, G-05; design §4.1, F-W09-02 |
| WP09-A48 | Operator (OP1); test | OP-02a of H, section "Documents" (the operator's upload, S-10) | Upload a GIF for a photograph requirement. Then (optional in the run) upload a synthetic photograph. After the return for review, look again. | The upload forms are on OP-02a, one per requirement row, with the requirement's own formats and size and "Each file is checked for safety before anything reads it."; OP-02's Application & documents tab has no upload form (link "Add or replace documents" → OP-02a `#documents`). The GIF is refused and OP-02a re-renders with the reason at the row (not the shell error page) and "Choose the file again."; nothing recorded. An accepted file: 303 to OP-02a with the receipt "File received". After the return for review: no upload form; a hand-made upload is refused. With the documents read unavailable: "Documents cannot be read now." and no upload form. | L (refusal; acceptance optional) + T | `WP-09.md` Q-W09-05; PLAN §8 S-10; design §1.4 row 6, §2.3 item 7, F-W09-08; `src/apps/staff/intake/routes.ts`; `test/system/core-pages.test.ts` "lets the assigned operator add a document during approved assistance…" |
| WP09-A49 | Test | OP-02a entry after a reassignment | Reassign an unpaid help application whose first entry used a first-work exception. The previous operator sends an entry; the new operator opens OP-02a and sends an entry. | Previous operator: the access page (SH-02). New operator: the Gate 1 block of A41 for the new assignment (the earlier basis does not carry over), and a saved envelope is refused `gate1_payment_not_received`. | T | BS B19, B26; `test/core/assignment-holds.test.ts` "consumes a start exception once at the first assistance entry … a new assignment needs Gate 1 again"; P-12 §2 |
| WP09-A50 | Operator (OP1, OP2); TA (Y); test | OP-03r of H (draft) and of R (submitted) in approved help (WP-07 page; §3 V07-C11, V07-D5); TA pages after them | Open "Return for TA review" from OP-02a "Finish". Read the effect. Send with a note. Follow the travel agent's step (§3). Test: a submitted application whose readiness was recorded before the help. | Both: label and `h1` "Return for the travel agent's review: [applicant]", never "Submit for TA"; evidence "What the travel agent asked for: [note]", "Information version [n]" and "See the entries in the history"; "This ends the approved assistance, whether or not you entered information. You stay the assigned operator." Receipt "Returned to the travel agent" (one title, F-15) with Current "Help request: Ended"; OP-02a then shows the "Returned for review" state; OP-01 moves the application to "Returned to TA" (delta). Draft (H): effect "The travel agent reviews what you entered and submits it themselves. Help never confirms or submits for them."; the TA submits on TA-08 (A21). Submitted (R): effect "The travel agent reviews what you entered and hands the application back to you. The quote and the original estimated window stay as submitted. You confirm readiness again before any filing authorization or packet release."; the TA hands back with the quote and the original window unchanged and the same operator (A22). Test: after the hand back, readiness reads out of date and must be confirmed again before any authorization or packet release. | L + T (readiness) | UX §5.3; PL §4.2 A5; BS B18; `WP-07.md` F-14, F-15; `WP-09.md` G-06 (review R-06); design §2.6, §3.1; WP07-A48; `holds.ts` `formalReturn`, `handBack` |
| WP09-A51 | Operator (OP1) | OP-02 of P (ordinary assigned work) | Look for editable application fields in every tab. | No editable application field anywhere; the route for a change is "Return to TA". | L | UX §5.3 ("Ordinary work shows no editable application fields"); BS B18; WP07-A32 |
| WP09-A52 | Phone user, operator | OP-02a at 390 px | Send the form with an error; correct; send. | Full-screen task page: the label band, the request note and the Gate 1 section before the form; each input labelled; the error summary visible when focused; "Finish" last; the button at the end, not in a fixed bar. No horizontal page scroll. | L | UX §7.3; design §2.3 (Mobile); AC-04, AC-21 |
| WP09-A124 (new, §2.4) | Operator (OP2); TA (Y) | OP-02a and OP-03r of R after the approval (§3 V07-D4, V07-D5) | Read OP-02a. Without any entry, select "Return for TA review" and send. | OP-02a: the Gate 1 section reads Core's answer for the recorded basis ("No blocker now…" or "Not checked again…"); the form shows. The return without an entry is accepted: the receipt and states of A50; the help request reads "Ended"; TA-07 of R "Returned to you for review" (A22). Nothing claims that information was entered. | L | `WP-09.md` G-06; design §2.3 item 8, §2.6 item 1 ("whether or not you entered information"); `holds.ts` `formalReturn` |

### 2.5 OP-02 and OP-02r: problem report and flag resolution (`core.resolve_hold`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP09-A53 | Operator (OP1) | OP-01 and OP-02 of P after Y's report (§3 V07-A3) | Read OP-01. Open P. | OP-01: P in "Action now" marked "Problem reported" (deltas by the WP07-A03 mapping). OP-02: the protected-state banner names the problem report; readiness in WP-07 words for a held judgement (for example "Not met: a hold is open"); no authorization request offered. Action panel row 3a: "Deal with the travel agent's problem report", primary "Return to TA" (OP-03r), secondary "Resolve without a return" (OP-02r of the open report). Holds section: the report row with "Resolve the problem report" (OP-02r) and "Return to TA (closes the report)" (OP-03r `?resolve=<prb id>`). | L | UX §3.2; BS B18; PL §4.2 R1; `WP-07.md` F-13; design §2.5 items 2, 3, §6.3 V07-6; WP07-A31; `derived.ts` (rule 11, `readinessView` `held`) |
| WP09-A54 | Operator (OP1) | OP-02r of P's report | Open "Resolve without a return". Read. Select "Cancel". | Page title "Resolve a problem report"; the OP-02 frame without tabs. Scope "Problem report from the travel agent, opened [time] IST by [name]." Evidence "What the travel agent reported: [note]"; readiness; other open holds. Effect: "Resolving closes the travel agent's report. The travel agent is notified that it is resolved. The application data stays as it is. Readiness must be confirmed again before filing authorization or packet release." and "If the travel agent must change something, return the application instead: the return can close the report." (link "Return to TA" → OP-03r `?resolve=<prb id>`). Field "How it was resolved" (required). Visible review. Buttons "Resolve the problem report" and "Cancel" (→ OP-02 Work `#holds`; nothing is recorded). | L | UX §5.3; BS B18; design §2.4; `holds.ts` `resolveHold`; `derived.ts` (`holdRevision` in the readiness basis) |
| WP09-A55 | Operator (OP1) | OP-02r of P's report (§3 V07-A4) | Write how it was resolved. Send. | 303 to OP-02r with the C3 receipt "Request recorded" (neutral: a resolution and the operation that opened the hold return the same shape, so the receipt does not name the command, G-01) and Current: "Problem report: resolved"; "Readiness: [WP-07 words for 'confirm it again']". The page then shows the Resolved state ("This report is resolved." with "Back to the application"). OP-01: P leaves the problem severity (delta). TA side: A09. | L | `WP-09.md` G-01 (review R-01); WP-06 D-02; design §2.4 (C3), §2.11 `resolved` as amended; `holds.ts`; `derived.ts` `readinessView` (`stale_basis`) |
| WP09-A56 | Operator (OP1); harness | OP-02 and OP-02r of F while the flag waits (§3 V07-B2) | Read OP-02 and open the flag's OP-02r by address. Harness: post a resolution of the flag. | OP-02 Holds: the flag row with the note and "Waiting for a SuperAdmin's response"; no resolve link. OP-02r: "A SuperAdmin has not answered this flag yet. You resolve it after the answer." No form. The hand-made post: refused (`flag_response_missing`) with that state and the unsent text block; nothing recorded. OP-01: F in "Waiting", "SuperAdmin decision needed" (delta). | L | BS B18; design §2.4 (state "Flag not answered"), §2.5 item 3; `holds.ts` `resolveHold`; `derived.ts` rule 9; WP07-A03 |
| WP09-A57 | Operator (OP2); test | OP-02 of F after SA2's response, with F reassigned to OP2 (§3 V07-B6) | Read the Holds section and the action panel. Run the unit test of the panel mapping. | Holds: the flag row with the question, the response and "Answered [time] IST", and "Resolve the flag" (OP-02r). Action panel row 3b: owner You; "Read the SuperAdmin's response and resolve the flag"; blocker type "Filing authorization and packet release wait until you resolve it and confirm readiness again"; action "Resolve the flag". It never says "the travel agent's problem report" and never offers "Return to TA" as the primary action (Core's answer: reason `hold_flagged_to_superadmin`, next action `resolve_problem_report`). OP-01 of OP2 lists F in "Action now" (delta). The unit test maps each reason code that Core returns with `resolve_problem_report` to its row (3a, 3b), for the panel and the navigation count. | L+T | `WP-07.md` F-13; design §2.5 item 2, F-W09-09; `derived.ts` rule 10 |
| WP09-A58 | Operator (OP2); harness | OP-02r of F's flag (§3 V07-B7) | Read. Write how it was resolved. Send. | Page title "Resolve a flag". Scope "Flag to a SuperAdmin, opened [time] IST by [OP1 name]." Evidence: "The question: [note]"; "Response: [response]"; "Answered [time] IST"; readiness; other holds. Effect: "Resolving closes the flag. The SuperAdmin's response stays on record. A response records no decision: check the decisions on record (gate exceptions, payment) before you act. Readiness must be confirmed again before filing authorization or packet release." Field "How it was resolved"; button "Resolve the flag". C3 receipt "Request recorded" (neutral, G-01; a flag and its resolution return the same shape) with Current: "Flag: resolved"; readiness to confirm again. SA-02c: F's row gone; SA-01 group 5 back to baseline. | L | `WP-09.md` G-01; design §2.4; WP-06 D-02; `holds.ts` (`flag` and `resolveHold` both return `holdId` `flg_…`) |
| WP09-A59 | Operator (OP1); harness | OP-02 and OP-02r of P's return while returned (§3 V07-A7) | Read the Holds row of the return. Open the return's OP-02r by address. Harness: post a resolution of the return hold. | Holds row: "The travel agent hands it back or submits it."; no resolve link. OP-02r: "A return is closed by the travel agent when they hand the application back or submit it. You do not resolve it." No form. The hand-made post: refused (`hold_not_operator_closable`) with that sentence and the unsent text block; nothing recorded. | L | design §2.4 (state "A return"), §2.5 item 3; `holds.ts` `resolveHold`; `test/core/assignment-holds.test.ts` "returns formally, keeps the operator, …" |
| WP09-A60 | Operator; SuperAdmin; harness; test | OP-02r | (1) Send an empty note. (2) Harness: resolve P's resolved report again from an OP-02r loaded before the resolution (new key). (3) Test: a hold id of another application in the path. (4) OP2, `operator-3` (read grant) and SA1 post a resolution on P; OP1 posts a resolution on F after its reassignment. | (1) C1 "Describe how it was resolved." (2) "This report was resolved since you opened the page. Nothing was recorded." (Core answers `stale_revision` for a hold that is not open; Q-08), then the Resolved state and the unsent text block. (3) The uniform not-found page. (4) The access page for each. Nothing is recorded in each case. | L ((1), (2), (4)) + T ((3)) | design §2.4 (C1, C2), §2.10; `holds.ts` `resolveHold`; `policy.ts` (`operator.resolve_hold`: assigned operator); `test/core/assignment-holds.test.ts` "flags to the SuperAdmin: the response never closes the hold; only the operator resolves it after a response" |
| WP09-A61 | Operator (OP1); harness | OP-02r, the Nth time | Replay terms 1 to 5 on A55. Term 2 changes the note. Term 3: Back; a new-key send. Term 4: A60 (1), then corrected. | (1) The same receipt; one resolution; one TA notice. (2) Refused as a used form; nothing recorded. (3) Back reloads OP-02r in the Resolved state with no form; the new-key send answers as A60 (2). (4) Recorded once. (5) C4; "Open the result" → OP-02. The hold's own state is the guard; the command carries no revision. | L+T | PL §7 K-STD; BS B35; design §4.1 |
| WP09-A62 | Operator (OP1), two tabs | OP-02r of P's second report (§3 V07-A7) | Tab 1: open OP-02r. Tab 2: return P from OP-03r `?resolve=<prb id>`. Send tab 1. | "This report was resolved since you opened the page. Nothing was recorded." then the Resolved state and the note in the unsent text block. | L | UX §3.3; design §2.4 (C2), §4.3 ("A hold resolved twice"); `holds.ts` |
| WP09-A63 | Operator (OP1, OP2) | OP-02 readiness row of P and F through §3 | Read the row at each step. | Core's validity in WP-07 words: recorded by you before; held while a hold is open (for example "Not met: a hold is open"); still held after the SuperAdmin's response (a response does not change the readiness basis); out of date after a resolution or a hand back ("Not met: something changed since it was recorded; confirm it again"); "Met: recorded by you" after the reconfirmation (set-up). For F after its reassignment: the previous operator's judgement (WP-07 words) until OP2 confirms readiness. | L | BS B18, B19; design §6.3 V07-6, V07-9; `derived.ts` (`readinessView`, `readinessBasis`); `holds.ts` (`respondFlag` moves the revision only) |
| WP09-A64 | Test | OP-02 and OP-02a of an application with approved help in progress and an open problem report (fixture) | Read. Record an entry. Return for review answering the report. | The report shows in the Holds section and on OP-02a; the entry is accepted (a report does not stop entry); the return answers it; the report then reads resolved. | T | `WP-09.md` Q-W09-02; `holds.ts`; `controls.ts` `editorStage` |
| WP09-A65 | Phone user, operator | OP-02r at 390 px | Send empty; then with a note. | Full-screen task page: scope and effect before the field; error summary visible; the button at the end. No horizontal page scroll. | L | design §2.0 (Mobile); AC-04, AC-21 |
| WP09-A129 (new, §2.5) | Operator (OP1, `operator-3`) | OP-02 of H, P and F (Work, Application & documents) | Read the frame line, the Holds section and the Application & documents tab. Look for forms. | H (help in progress): the frame line of A39 on every tab; Application & documents: "Approved assistance: you may change the application details, identity details with evidence, and documents." with "Enter information"; evidence rows read only. P and F: Holds rows as A53, A56, A57, A59. OP-02 holds no form with action `…/assistance-entry`, `…/holds/<id>/resolve` or `/ops/applications/<id>/documents`. `operator-3`: no link to a form. | L | design §2.5 items 1, 3, 4, §7.2; D-W09-02 |
| WP09-A130 (new, §2.5) | Operator (OP1) | OP-03r of P from the report's Holds row (`?resolve=<prb id>`; §3 V07-A7); test | Open OP-03r from the row. Test: open it with a `resolve` value that is not an open report of P, or malformed. | "Resolve the problem report with this return" is preselected with that report; the return closes it. Test: any other value preselects nothing and is ignored. | L+T | design §2.6 item 3, D-W09-11 |

### 2.6 SA-02c, SA-01 group 5 and SA-09f (`core.respond_flag`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP09-A66 | SuperAdmin (SA2) | SA-02c after V07-B1, V07-B4 and V07-B7 | Read the page. Select the action on F. | `h1` "Flags from operators"; lead as WP-06 design §2.2.3. Rows of `core.admin_queue {flags}`: Application; "Waiting for": "Your response" where Core's next action is `respond_to_flag`, "The operator, after your response" where Core's answer is the answered flag; otherwise "Flag open. Current step: [Core's answer in words]" with no claim about the response (Q-06). Row action "Respond" → SA-09f when Core's next action is `respond_to_flag`; otherwise "Open" → SA-09f (it shows its state). Freshness "Read at". A cap line only at Core's limit. S2: "No flag is open." Rows: after B1 baseline + 1; after B7 baseline. | L | WP-06 design §2.2.3; design §2.9; `lists.ts` (`flags`: open holds); `derived.ts` rules 9, 10; Q-06 |
| WP09-A67 | SuperAdmin (SA2) | SA-01 group 5 during §3 Part B | Read after B1, B4 and B7. | "[n] flags open" and "Waiting for your response: [r] flags" (rows with next action `respond_to_flag`): after B1 + 1 and + 1; after B4 + 1 and baseline; after B7 baseline and baseline. Item lines: "Respond" (SA-09f) for an item waiting for a response; "Open" otherwise. | L | WP06-A02; WP-06 design §2.1 group 5; design §2.9 |
| WP09-A68 | SuperAdmin (SA2) | SA-09f `flag_response` of F (§3 V07-B4) | Read the page. Select "Cancel". | `h1` "Respond to a flag: [applicant]"; freshness. Scope: "Flag raised by [OP1 name] at [time] IST on application [reference] · [service]. Your response is a note to the assigned operator." Evidence: "The question: [note]"; Operator now "[OP2 name]"; and, because the raiser is no longer assigned, "The operator who raised this flag is no longer assigned. [OP2 name] receives your response and resolves the flag. Check that the question still applies." (A126); service payment; gate exceptions (Gate, For, State, Expires); readiness; external acts; open holds; deferral. Effect: changes "Your response is recorded on the flag, and the assigned operator is notified."; unchanged "The flag stays open: only the assigned operator resolves it." "A response records no decision: it grants no exception, records no payment, changes no readiness and files nothing."; "Decisions you may record, each on its own page": links (not forms) to the Gate 1 exceptions (SA-09g), the Gate 2 decision, a readiness exception (when readiness reads "recorded by the previous operator"), the payment (SA-07a) and "Reassign" (SA-03c). Your decision: "Response to the operator" (required) and "Reason for this response" (required): two labelled fields; the page copies neither into the other (Q-09). Visible review "When you send it: the operator is notified; the flag stays open until the operator resolves it; filing authorization and packet release wait until then and until the operator confirms readiness again." Buttons "Send the response" and "Cancel" (→ SA-02c; nothing recorded). | L | UX §6.3; PL §3.4 SA-09; CC-04; design §2.8; `WP-09.md` G-09; `holds.ts` `respondFlag` |
| WP09-A69 | SuperAdmin (SA2) | SA-09f of F | Send with both fields empty; then with a response and a short reason. | C1: "Enter your response." / "Enter a reason of at least 10 characters."; links to the fields; values kept; nothing recorded. | L | AC-08; design §2.8 (C1); `zNote`, `zReason` |
| WP09-A70 | SuperAdmin (SA2) | SA-09f of F (§3 V07-B4) | Write the response and the reason. Send. | 303 to SA-09f with the C3 receipt "Response sent to the operator" (named: on the SuperAdmin surface only this command returns a flag hold id, and the hold has a response). Recorded: the response and "Answered [time] IST". Current, from the returned hold's current state (G-10): "Flag: open: the operator resolves it"; "Operator now: [OP2 name]". The page then shows the Answered state. SA-02c row "The operator, after your response"; SA-01 group 5 "Waiting for your response" − 1. No text says approved, granted, paid or ready. Operator side: A57. | L | `WP-09.md` G-10; WP-06 D-02; design §2.8, §2.11 `responded` as amended; `holds.ts` `respondFlag` (notice to the operator assigned now) |
| WP09-A71 | SuperAdmin (SA1); harness | SA-09f of F after the response (§3 V07-B5) | Open the page. Harness: send a response from an SA-09f loaded before the response (new key). | "This flag was answered at [time] IST: [response]. The operator resolves it." No form. The hand-made send: "Another SuperAdmin answered this flag first, at [time] IST: [response]. Your response was not sent." (`flag_already_responded`), then the Answered state and the unsent text block; nothing recorded. | L | design §2.8 (Answered, C2); `holds.ts` `respondFlag` |
| WP09-A72 | SuperAdmin; harness; test | SA-09f | (1) Open SA-09f of F after OP2 resolved the flag. (2) Harness: POST `/admin/applications/<F>/flags/<flag id of another application>/respond`. (3) Test: two SuperAdmins respond at once. | (1) "No flag is open on this application." No form. (2) The shell's access page (`not_found_or_forbidden`, LD-14); nothing recorded. (3) One response recorded; the other `flag_already_responded` as A71. | L ((1), (2)) + T | design §2.8 (states, C2); `holds.ts` (`access_denied`; guard `responded_at IS NULL`) |
| WP09-A73 | SuperAdmin; harness | SA-09f, the Nth time | Replay terms 1 to 5 on A70. | (1) The same receipt; one answer; one operator notice. (2) Refused as a used form; the answer unchanged. (3) Back reloads "already answered" (A71); a new key: `flag_already_responded`. (4) A69, then corrected: once. (5) C4. The command carries no revision: no stale case; the business check answers. | L+T | PL §7 K-STD; BS B35 |
| WP09-A74 | SuperAdmin | SA-09 flag response page and receipt | Read all text. | The answer is not a decision: no "Approved", "Exception granted", "Payment recorded", "Ready" or "Override". A SuperAdmin who grants Gate 1 or Gate 2 uses those decision pages (links). | L | UX §6.3 ("Never use one 'Admin override'"); BS B20 |
| WP09-A75 | SuperAdmin; test | Old SuperAdmin case page of F while the flag waits; SA-02c; SA-01 | Open the pages. | The carried response form has left the old case page; its Holds table is read only with "Respond" (SA-09f) on an unanswered open flag; SA-02c and SA-01 open SA-09f. A unit test lists it. | L+T | LD-02; CC-04; CC-12; design §1.5, §2.9; `admin.ts` `respondForm` |
| WP09-A126 (new, §2.6) | SuperAdmin (SA1, SA2); operators (OP1, OP2) | F flagged by OP1, reassigned to OP2 before the response (§3 V07-B3 to V07-B7) | SA1 reassigns F to OP2 (set-up). OP1 reloads OP-02 of F. SA2 responds (A68, A70). OP2 reads its notices and OP-02 of F; OP2 resolves (A58). OP1 posts a resolution (harness). | OP1's reload: SH-02. SA-09f names the raiser (OP1) and the operator now (OP2) separately, with the "no longer assigned" line. The response notice goes to OP2 (OP2's notices list shows it; OP1's does not). OP2 sees the question and the response and resolves on OP-02r. OP1's resolution post: the access page; nothing recorded. | L | `WP-09.md` G-09 (review R-09); design §2.8 item 3, §4.3 ("Flag answered after the operator was replaced"), §6.3 V07-23, V07-24; `holds.ts` `respondFlag` (no assignment guard; notice to the assigned operator) |

### 2.7 Command results, access and shell on WP-09 pages

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP09-A76 | TA; operator; SuperAdmin | Every WP-09 page | Read the shell. | Environment label; "[TEST]" title prefix; rail and breadcrumb of design §1.3: TA-07p "Applications" with the origin breadcrumb then "› [applicant] › Report a problem"; OP-02a and OP-02r "My work" (or "Applications" with `from=applications`), "My work › [applicant] › Approved assistance" / "› Resolve a problem report" / "› Resolve a flag"; SA-09h "Work queues › Help requests › [applicant]"; SA-09f "Work queues › Flags from operators › [applicant]"; one `h1`; a freshness line where the page shows read facts. | L | PL §2.1, §2.2; WP01-A07; design §1.3 |
| WP09-A77 | TA; operator; SuperAdmin; harness; test | Every accepted WP-09 command; edited receipt addresses | Read each receipt. Open edited addresses: on OP-02r of F, the `resolved` done code with the operation key of OP1's flag, after F's flag was resolved; on SA-09h, the `decided` done code with the key of a flag response; on TA-07, the `problem` done code with a help-request key; the key of another application's operation. | Naming rules (design §2.11 as amended): TA report (`prb_` hold id) → "Problem report sent to your operator". SuperAdmin decision (request id equal to the case's latest request; state approved or fulfilled, or declined) → "Help request approved" / "Help request declined", else "Request recorded". SuperAdmin response (`flg_` hold id with a response) → "Response sent to the operator". Operator entry (correction id with a stage) → "Information recorded" / "Information held: a filing may have happened". Operator upload → "File received". Operator resolution → always "Request recorded" with the current hold facts (G-01). The flag's operation key at the resolve receipt address after the resolution reads "Request recorded" with "Flag: resolved" and never attributes the resolution or "Your note is recorded" to the flag operation (G-01 test). An edited address never shows another command's title; another application's key: "Request reference [key]. The receipt cannot be checked now." No accepted time (P-02). | L+T | `WP-09.md` G-01 (review R-01); WP-06 D-01, D-02; W1 A-04; W3 C-03; design §2.11; Q-07 |
| WP09-A78 | TA; SuperAdmin; operator; test | Receipt addresses of A03, A31, A43 and A70, opened again after later steps (§3 V07-A5, V07-B8, V07-C13); test | Open each address again. Test: open A70's address after a newer flag opened on the same application. | Each receipt shows what was recorded and the facts that are current now, labelled "Current" (no open report; Submitted; returned for review). A31's receipt no longer shows "Assign an operator" once H is assigned. A70's receipt keeps the historical response and derives the flag line from the returned hold's current state: after OP2's resolution "Flag: resolved" (live); with a newer flag open, the line still describes the returned hold (resolved), never the newer flag as if it were the answered one (test). No receipt or status read tells anyone to act from an older state. | L+T | `WP-09.md` G-10 (review R-10); `WP-07.md` F-01 (class fix); design §2.11 |
| WP09-A79 | TA; operator; SuperAdmin | Each command of §1.2 with a lost acknowledgement (fixture); a refused send | Inject the fault. Open the operation status page. Select "Check status" after the original resolves. Open the status page of a refused send's key. | C4 (CMP-13) "Checking the original result" and "Check status"; no new send of the same intent is offered there. "Check status" reads the same operation and shows its accepted result. A refused send leaves no operation record: "Nothing is recorded for request [reference] so far". A refusal, and any stale comparison, shows only on the re-rendered form. | T | PL §1.1 UNR; BS B35; W1 A-08; WP06-A104 |
| WP09-A80 | Harness; test | Each command of §1.2 | (1) Identical replay after acceptance. (2) Same key, changed content. (3) Business duplicate: a new key with the current page's facts for an intent Core already holds. (4) Raw stale envelope: a new key with an older page's revision. (5) Raw resend of a refused envelope after the facts changed. | (1) The original result; no second hold, decision, correction, response or notice. (2) Refused as a conflict; nothing recorded. (3) The command's own check answers: report `problem_report_open`; decision `stale_revision`, shown as CMP-14 "you saw Requested / current [state]"; entry: `correction_no_change` for an applied entry, and another held correction while the first entry is held (no semantic duplicate guard is claimed, G-03); resolution `stale_revision`, shown as "resolved since you opened the page"; response `flag_already_responded`. (4) Decision and entry: `stale_revision`, CMP-14 with the current facts; report, resolution and response carry no revision, so their stale case is the business check. (5) The refused key has no record, so Core evaluates again: a report refused on a returned case is accepted after the hand back; the in-place approval and the first entry are accepted after the first-work exception; a flag resolution is accepted after the response. A duplicate test uses (3), never (4) or (5). Browser Back is not a replay. | T | `WP-09.md` G-03 (review R-03); WP-06 D-12; PL §7 K-STD; BS B35; `corrections.ts:120-149` |
| WP09-A81 | TA; operator; SuperAdmin | Every refusal reachable on `lane-ui` in §2.1 to §2.6 | Read each message. | CMP-07 with the reason in words and the owner or route where one exists. Never a code alone, except the UAT-13 fallback. No "Something went wrong", "Invalid data" or "A requirement of this item is not met." | L | PL §1.1 REJ, §11.1; CR-01 |
| WP09-A82 | — | Text map of every reason code that the WP-09 pages can show | Check the map against Core's vocabulary and the design's closed tables (unit test). | Each code has text in the role's words (TA "you", staff wording), as design §2.10: `problem_report_open`, `hold_not_applicable`, `application_not_open`, `awaiting_formal_return`, `hold_assistance_in_progress`, `assistance_not_approved`, `assistance_request_open`, `hold_returned_to_ta`, `gate1_payment_not_received`, `gate_exception_consumed`, `outcome_already_recorded`, `assignment_changed`, `identity_same_person_evidence_insufficient`, `correction_no_change`, `population_out_of_scope`, `correction_historical_after_filing`, `filing_possibly_occurred`, `hold_not_operator_closable`, `flag_response_missing`, `flag_already_responded`, `stale_revision`, `conflict_operation_key`, the offering codes of stages 4 to 6, and the field codes `not_declared`, `not_an_option`, `too_long`, `date_invalid`, `country_code_invalid`. An unknown code shows the category text and "Reference code: [code]" (staff) or "Reference: [code]" (TA). The pending reasons `assistance_requested`, `assistance_approved`, `hold_assistance_in_progress`, `hold_problem_reported`, `hold_flagged_to_superadmin` read per (reason, next action), not per next action alone (A13, A57). `access_denied` renders SH-02, never a text. | T | CR-01; SC §3.4 (UAT-13); design §2.0, §2.10; `src/apps/shared/core/shared.ts`; `presentation.ts` |
| WP09-A83 | TA; operator; SuperAdmin | TA-07, TA-07p, OP-02, OP-02a, OP-02r, SA-02b, SA-02c, SA-09h and SA-09f (HTTP tests with access revoked between the page's first read and an optional read; a reassignment between two reads of OP-02a) | Let an optional read answer an access, authentication, maintenance or support-view refusal. | The page renders the access page (SH-02, sign-in or maintenance), never the facts read earlier. Only an availability failure degrades a block to "Unavailable" (for example "Work on this assignment: Unavailable" on SA-09h, the Gate 1 section and "Documents cannot be read now." on OP-02a). No page code catches every error around a read. After a reassignment, the previous operator's next read or command gives SH-02, also on OP-02a and OP-02r. | T | LD-14; PL §2.3 SH-R04; BS B10; design §2.0, §4.3 ("Access revoked mid-page") |
| WP09-A84 | TA; operator; SuperAdmin | Every WP-09 page | Look for controls of the other roles. | TA pages: no resolve, response or help-decision control. Operator pages: no help decision, no flag answer, no Gate 1 decision, no "Submit for TA". SuperAdmin pages: no assistance entry, no hold resolution, no report, no readiness, no filing. | L | BS B18; UX §2.3, §12 V15; PL §11.1 |
| WP09-A85 | TA; operator; SuperAdmin | Every WP-09 page | Read all visible text. | No forbidden label of §11.1 ("Submit for TA", "Override", "Admin override", "Approved" or "Done" as an overall status, "Ready" as a universal state, "Force complete", "Pay now"); no "Unread" or "Mark as read". "Help approved" names only a help request; a help approval is never called a payment, an assignment or a gate exception; a flag response is never called a decision. Staff pages say "approved assistance"; TA pages say "help". Times carry IST; counts name their unit; synthetic data carries the synthetic label. No page states a configuration number it does not read (exception lifetime, row limits). | L | PL §11.1; CR-03, CR-06, CR-07, CR-08; WP-01 Q-13; WP-08 E-12; design §2.0 (Copy) |
| WP09-A86 | Operator (`operator-3`); SuperAdmin in a support view of Y (test) | OP-02, OP-02a and OP-02r of P and H with the group read grant; TA-07 of P in the support view | Read the pages. Harness: post a resolution and an entry as `operator-3`; test: post a report and a help request in the support view; open TA-07p at the staff host. | Read grant: the banner "Read-only access: [purpose], until [date time] IST"; OP-02a and OP-02r show the OP-02 frame and "Only the assigned operator takes this step. You can read this application." with no form and no Finish button; each post refused as not found. Support view: "Read-only view for [individual]"; no report link, no form; each post refused with the support-view refusal; TA-07p is not registered at staff (not found). Nothing is recorded. | L (grant) + T (support view) | UX §2.3 ("A read grant cannot add case actions"); BS B10; PL SH-R09, SH-R10; design §2.0 (Read grants and support view) |
| WP09-A87 | TA; operator; SuperAdmin | TA-07p, OP-02a, OP-02r, SA-09h, SA-09f | Inspect `localStorage`, `sessionStorage` and IndexedDB after use. Read the response headers. | No report text, help note, response, identity value or document id is kept in browser storage. Signed-in pages send `no-store`. | L+T | PL §2.3 SH-R12 |
| WP09-A88 | — | Rebuilt pages and the old pages they replace | Open each page where Core offers a carried form of another package (for example the WP-17 deferral decision, withdrawal and price forms; the WP-10 and WP-12 forms on the operator case page). Run the host-page test and the route test. | Each carried form keeps its markup, fields, action and success redirect and works as before. Host-page test (design §7.2): TA-07 holds no form with action `…/report-problem`; OP-02 holds no form with action `…/assistance-entry`, `…/holds/<id>/resolve` or `/ops/applications/<id>/documents`; the old SuperAdmin case page holds no form with action `…/assistance-decision` or `…/flags/<id>/respond`; each page holds the replacing links of design §1.5. Every rendered form action is a registered route. | L+T | LD-02; LD-07; WP-03 Q-01; WP06-A110; WP-08 Q-11; design §1.5, §7.2 |
| WP09-A89 | `syn-ta-2`; operator (OP2); harness | TA-07 and TA-07p of P; OP-02, OP-02a and OP-02r of P; POST envelopes to SA-09h and SA-09f routes with ids of another application | Open each; send the envelopes. | `syn-ta-2`: the uniform not-found page. OP2 (not assigned to P): SH-02 on OP-02, OP-02r and OP-02a. A malformed or foreign id in a GET path: the uniform 404. Foreign ids in the POST envelopes: the refusals of A34 (4) and A72 (2). No fact of P shows. | L | BS B10; UX §2.3; design §1.2 (zod path parameters) |

### 2.8 Accessibility (AC-01 to AC-28 that apply)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP09-A90 | Keyboard-only TA, operator and SuperAdmin | §3 steps V07-A2, A4, B4, B7, C3, C10, C13, D3 at 1440 px; V07-A2 and V07-C10 at 390 px | Use the keyboard only. | Every step works with Tab, Shift+Tab, Enter, Space and Escape: report, approve or decline (each its own page and button), tick identity documents, record the entry, resolve, respond, return for review, submit after help. No action needs a mouse, hover or drag-and-drop. | L | AC-01, AC-12 |
| WP09-A91 | Keyboard-only user | Every WP-09 page at 1440 and 390 px and at 400% zoom | Tab through the page. | Focus is visible (at least 3:1) and never hidden by the top bar, the rail or a bottom action area. | L | AC-02 |
| WP09-A92 | Phone user | TA-07p, OP-02, OP-02a, OP-02r, SA-02b, SA-02c, SA-09h, SA-09f | View at 320 px, and at 1280 px with 400% zoom. | No two-dimensional page scrolling. Queue tables and the identity-evidence list scroll only inside a labelled region, or become cards. Identity, state, owner and next action come before secondary data. | L | AC-04, AC-21 |
| WP09-A93 | Any | Every WP-09 form | Inspect each input. | Each input has a visible label; no two fields on a page share a label ("What is the problem?", "How it was resolved", "Response to the operator", "Reason for this response", "Reason for approving", "Reason for declining", "Where the information came from"); the help decision has no visible choice control (the decision is the page's kind); each identity-document checkbox names the document type; required fields say so. | L | AC-05, AC-15; design §5 |
| WP09-A94 | Any | Help-request states, hold states, readiness rows, queue "Waiting for" cells | View in greyscale. | Each state has text. No state is shown by colour alone. | L | AC-06 |
| WP09-A95 | Any | Every WP-09 form | Send each form with an error. | Focus moves to the error summary; each link moves focus to its field; entered values stay. Identity-evidence checkboxes start unchecked on a fresh form and, after a refusal, show the reader's own selections restored from the posted values (an over-limit selection stays visible with its field error). Confirmations and attestations of other pages (TA-08) stay unchecked after a refusal: an evidence selection is not a confirmation. | L | AC-08; CMP-07; UX §3.3; `WP-09.md` G-07 (review R-07) |
| WP09-A96 | Screen-reader user | Receipts; the approved-assistance label band and frame line; the known-gap line | Read with VoiceOver or NVDA. | Receipts are announced politely without moving focus. The label band, the frame line and the known-gap line are text in the page flow (not live regions), read before the form. | L | AC-09, AC-16; design §5 |
| WP09-A97 | Screen-reader user | Each unavailable action: the report on a returned case (A127), the entry under Gate 1 (A41), the flag during help (A41), the resolution before the response (A56), a decided request (A34), an answered flag (A71) | Focus the control or the notice. | The reason is exposed (`aria-disabled="true"` with `aria-describedby`, or the notice in reading order). A role-forbidden action is not shown at all. | L | AC-13; CMP-10; PL §2.3 SH-R08; design §5 |
| WP09-A98 | Phone user | Every WP-09 page at 390 px | Measure each control. | Every control is at least 24 × 24 CSS px. Primary actions ("Report a problem", "Send the report", "Approve help request", "Decline help request", "Enter information", "Record the information", "Upload", "Return for TA review", "Resolve the problem report", "Resolve the flag", "Send the response") are at least 44 × 44 CSS px. Checkbox labels are part of their targets. | L+T | AC-10 |
| WP09-A99 | — | Every WP-09 page | Measure contrast of text, focus, state text and notices. | Normal text at least 4.5:1. Non-text indicators and focus at least 3:1. | L+T | AC-11 |
| WP09-A100 | Any | Long names and long texts; reduced motion | Use a 60-character surname and given names, a report, a help note and a response of Core's maximum length (fixture or run data), and a long operator name. Turn on "reduce motion". | Names and texts wrap without hiding identity; quoted notes sit in `<blockquote>`; a truncated text has a full form that keyboard and touch reach. No transition plays. | L | AC-14, AC-20; design §4.4 |
| WP09-A101 | TA and operator (observation) | TA-07 of H after the return for review; OP-02 of F after the response | Ask the TA "Who submits this application now?" and the operator "What did the SuperAdmin's response change?". | The run record reports the answers and the sample size; confusion of help with submission, or of a response with a decision, is a finding. No pass target (observation only). | L | AC-24, AC-26; UX §12 (usability) |

### 2.9 axe checks (WCAG 2.2 A/AA)

Rule for every row: run axe (`@axe-core/playwright` 4.13.0, tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`,
`wcag22aa`) at 1440 × 900 and at 390 × 844. Expected: no violation of impact "serious" or "critical" at either width.
Record the counts of minor and moderate violations. The harness takes no screenshot of a page that shows a real
person's data; WP-09 uses synthetic data only.

| ID | Persona | Page (state) | Where | Source |
|---|---|---|---|---|
| WP09-A102 | TA | TA-07 of P, assigned, with "Report a problem" (A01) | L | UX §7.5; AC-01 to AC-28 |
| WP09-A103 | TA | TA-07p with the error summary (A05 (5)) | L | same |
| WP09-A104 | TA | TA-07 with the receipt and the open report (A03, A04) | L | same |
| WP09-A105 | TA | TA-09d of P with the assigned notice (A14) | L | same |
| WP09-A106 | TA | TA-07 of H2: help requested, then declined (A16, A17) | L | same |
| WP09-A107 | TA | TA-07 of H: approved help in progress (A19) | L | same |
| WP09-A108 | TA | TA-07 of H: returned for review (A20) | L | same |
| WP09-A109 | SuperAdmin | SA-02b with rows (A25) | L | same |
| WP09-A110 | SuperAdmin | SA-09h `assistance_approve`, no operator, with the review (A27) | L | same |
| WP09-A111 | SuperAdmin | SA-09h with the error summary (A29) | L | same |
| WP09-A112 | SuperAdmin | SA-09h `assistance_approve` with an operator and the Gate 1 refusal (A32) | L | same |
| WP09-A113 | SuperAdmin | SA-09h Decided state and CMP-14 (A34, A35) | L | same |
| WP09-A114 | Operator | OP-02a with the form and documents (A39, A40) | L | same |
| WP09-A115 | Operator | OP-02a with the Gate 1 block and the known gap (A41) | L | same |
| WP09-A116 | Operator | OP-02a with the error summary and restored evidence (A44) | L | same |
| WP09-A117 | Operator | OP-02 with the problem report (A53) | L | same |
| WP09-A118 | Operator | OP-02r of a report with the error summary (A54, A60 (1)) | L | same |
| WP09-A119 | Operator | OP-02r of a flag, not answered and answered (A56, A58) | L | same |
| WP09-A120 | SuperAdmin | SA-02c with rows (A66) | L | same |
| WP09-A121 | SuperAdmin | SA-09f with the review and the "no longer assigned" line (A68) | L | same |
| WP09-A122 | SuperAdmin | SA-09f Answered state (A71) | L | same |
| WP09-A123 | TA; operator; SuperAdmin | Operation status page of a WP-09 command, accepted and "Nothing is recorded" (A79) | L | same |
| WP09-A131 (new, §2.9) | TA; SuperAdmin | TA-07p "Returned to you" state with the unsent text block (A12, A127); SA-09h `assistance_decline` with the review (A27) | L | same |

## 3. Proof scenarios V07, BU-21 and BU-22 (to their boundary)

V07 (UX §12): "Assigned TA can report only; formal return enables permitted correction; same operator reconfirms
readiness. Approved assistance ends in TA review/submission." Authority B18 to B20. BU-21 (bulk spec): "Request help
before an application exists, then on a draft: first remains owned intake work; second uses the existing help
decision path; no invented submission or assignment/payment bypass." BU-22: "TA tries to correct an assigned,
not-returned case: report-a-problem path identifies operator and formal return; bulk correction does not circumvent
edit ownership." Authority BU §8.2; B16 to B18.

One ordered recipe (§0.4; design §6.2 and §6.3) serves the three proofs. The design's step numbers are named where a
step matches; steps with a letter are this checklist's additions on the same run. "Setup" steps use pages of earlier
packages; they are not the subject under test. SA1 = `superadmin-1`, SA2 = `superadmin-2`, OP1 = `operator-1`, OP2 =
`operator-2`.

| Step | Actor, page | Action | Observable result | Items | Where |
|---|---|---|---|---|---|
| P-0 | SA1: SA-01, SA-02a, SA-02b, SA-02c; OP1, OP2: OP-01 | Before the set-up, read the counts. | The run record holds the baselines of §0.4. | — | L |
| Setup | SA1 (SA-06, SA-07a, SA-03a, SA-09g, grant page); Y (TA pages); OP1 (OP-02) | §0.4 (design §6.2). | Y active; P and F submitted, paid, assigned to OP1, work started, readiness recorded; R submitted, unpaid, help "Requested", assigned to OP2 under a Gate 1 exception for assignment (SA-01 group 11 + 1); H and H2 drafts; H2's help "Requested"; SA-02b rows baseline + 2 (R, H2); `operator-3` holds the read grant. | — | L |
| V07-A1 | Y: TA-07 and TA-09t, TA-09d, TA-09i, TA-09f of P; harness (design V07-1 to V07-3) | Read. Harness: post an edit, an identity correction and an upload. | Only "Report a problem" (→ TA-07p); each section shows the assigned notice with the link to TA-07p; each post refused (`awaiting_formal_return`); nothing recorded. | A01, A14 | L |
| V07-A2 | Y: TA-07p of P; harness (design V07-4, V07-5) | Read; Cancel. Open again; send empty. Send "WP09 [stamp] the travel purpose on the form is wrong". Harness: replay (same key); a send from a TA-07p loaded before the report (new key). | C1; then the receipt "Problem report sent to your operator" on TA-07; the report row; the replay returns the same receipt; the new key "Your earlier report is still open…" with the unsent text; nothing extra recorded. | A02 to A04, A05 (1), (5), A11, A127 (report open) | L |
| V07-A3 | OP1: OP-01, OP-02 of P (design V07-6) | Read. | "Action now" with "Problem reported"; the banner; readiness held; row 3a; the Holds links; no authorization. | A53, A63 | L |
| V07-A4 | OP1: OP-02r of P's report; harness | Cancel. Send empty. Resolve with "WP09 [stamp] purpose wording confirmed with the travel agent". Harness: replay; a send from an OP-02r loaded before the resolution (new key). | C1; then "Request recorded" with Current "Problem report: resolved" and readiness to confirm again; the replay returns the same receipt; the new key "This report was resolved since you opened the page…" with the unsent note; nothing extra recorded. | A54, A55, A60 (1), (2), A61 | L |
| V07-A5 | Y: TA-07, TA-10, TA-07x of P | Read. Open the A03 receipt address again. | No open report; the notice; the history line; the receipt's Current line "None open". | A09, A78 | L |
| V07-A6 | Setup: OP1, OP-02 of P | Confirm readiness again (WP-07). | "Met: recorded by you". | A63 | L |
| V07-A7 | Y (two tabs); OP1 (two tabs); harness (design V07-7) | Y tab 1 opens TA-07p. Y tab 2 reports "WP09 [stamp] the photograph is wrong". OP1 tab 1 opens OP-02r of that report; OP1 tab 2 opens OP-03r from the report's Holds row (`?resolve=`) and returns P with "Upload a new photo". OP1 sends tab 1. Y sends tab 1. Y opens TA-07p by GET. Harness: OP1 resolves the return hold; Y reports from a page loaded before the return. | The report preselected on OP-03r; receipt "Returned to the travel agent"; OP1 tab 1: "resolved since you opened the page" with the unsent note; Y tab 1: "The application changed before your report was sent…" with the Returned state and the unsent text; TA-07p GET: the "Returned to you" state (submitted links); the return-hold resolution refused (`hold_not_operator_closable`); the report refused (`hold_not_applicable`); nothing recorded. | A05 (2), A10, A12, A59, A62, A127, A130 | L |
| V07-A8 | Setup: Y (TA-09f, TA-08 returned mode); OP1 (OP-02) (design V07-8, V07-9) | Y replaces the photograph and hands back. OP1 reads OP-02 and confirms readiness. | "Handed back to your operator", quote and original estimate unchanged; Operator "You" (same operator); readiness "Not met: something changed since it was recorded; confirm it again", then "Met: recorded by you" (V07: the same operator reconfirms readiness). | A63 | L |
| V07-B1 | Setup: OP1, OP-03f of F (WP-07). Observed: SA-02c, SA-01, TA-07 of F | Flag "WP09 [stamp] decision needed: confirm the declared purpose wording". | SA-02c baseline + 1 ("Your response", action "Respond"); SA-01 group 5 + 1 and + 1; TA-07 of F: "Your operator asked TravelMudra for a decision" and "TravelMudra is reviewing a question from your operator…". | A13, A66, A67 | L |
| V07-B2 | OP1: OP-02 and OP-02r of F; harness | Read. Harness: resolve the flag. | "Waiting for a SuperAdmin's response"; OP-02r "has not answered this flag yet", no form; the post refused (`flag_response_missing`); OP-01 "Waiting". | A56, A63 | L |
| V07-B3 | Setup: SA1, SA-03c of F (WP-06). Observed: OP1 (design V07-23) | Reassign F to OP2 with a reason. OP1 reloads OP-02 of F. | OP1: SH-02. | A126 | L |
| V07-B4 | SA2: SA-02c → SA-09f of F | Read; Cancel. Send empty; send with a short reason. Respond "WP09 [stamp] keep the declared wording" with a reason. | The raiser (OP1) and the operator now (OP2) named separately with the "no longer assigned" line; C1 twice; then "Response sent to the operator" with Current "Flag: open: the operator resolves it" and Operator now OP2; SA-02c "The operator, after your response"; SA-01 counts move. | A66 to A70, A126 | L |
| V07-B5 | SA1: SA-09f of F; harness | Open the page. Harness: replay (same key); a send from an SA-09f loaded before the response (new key). | Answered state, no form; the replay returns the same receipt; the new key "Another SuperAdmin answered this flag first…" with the unsent text; nothing recorded. | A71, A73 | L |
| V07-B6 | OP2: notices, OP-02, OP-01 of F; Y: TA-07 of F (design V07-24) | Read. | OP2's notice of the response (OP1 has none); the Holds row with question and response; row 3b "Read the SuperAdmin's response and resolve the flag"; OP-01 "Action now"; readiness held; TA text without "problem report". | A13, A57, A63, A126 | L |
| V07-B7 | OP2: OP-02r of F (two tabs); harness (design V07-25) | Tab 1 and tab 2 open OP-02r. Tab 2 resolves with a note. Tab 1 sends. Harness: OP1 posts a resolution. | Tab 2: "Request recorded" with Current "Flag: resolved"; tab 1: "This flag was resolved since you opened the page…" with the unsent note; OP1: the access page; SA-02c and SA-01 group 5 at baseline. | A58, A60 (4), A62, A126 | L |
| V07-B8 | SA2: SA-09f of F; the A70 receipt address | Open both. | SA-09f "No flag is open on this application."; the receipt keeps the response and reads "Flag: resolved". | A72 (1), A78 | L |
| V07-B9 | Setup: OP2, OP-02 of F | Start work and confirm readiness (WP-07). | Readiness recorded by OP2. | A63 | L |
| V07-C1 | Y: TA-07, TA-07p, TA-07h of H (WP-03 command, observed); harness | Read TA-07 (no report entry: unassigned draft). Open TA-07p by GET. Harness: report on H. Ask for help: "WP09 [stamp] please complete the travel purpose with us". | TA-07p "Not with an operator", no form; the report refused (`hold_not_applicable`); receipt "Help requested"; "Requested: TravelMudra decides"; SA-02b baseline + 3; SA-01 group 4 likewise. | A05 (3), A16, A25, A26, A127 | L |
| V07-C2 | SA1: SA-02b (design V07-10) | Read. | H "Not assigned", R "Assigned", H2 "Not assigned"; "Approve…" and "Decline…" per row; the lead for both cases; the known-gap note. | A25 | L |
| V07-C3 | SA1: SA-09h `assistance_approve` of H (design V07-11) | Read; select "Decline instead", then "Approve instead"; Cancel. Send an empty reason; a short reason. Approve with "WP09 [stamp] the travel agent needs the form completed with us". | Scope, evidence, effect before the reason; C1 twice; "Help request approved" with the payment line; the Decided state; SA-02a approved help + 1; group 3 + 1, group 4 − 1. | A27, A29, A31 | L |
| V07-C4 | Harness as SA1 | Replay the approval (same key); the same key with `decision` = `decline`; a new key with the current revision; a POST to H's route with H2's request id. | The same receipt; the conflict; CMP-14 "you saw Requested / current Approved" with the unsent reason; the foreign id refused stale with the reason kept; nothing extra recorded. | A34 (4), A36 | L |
| V07-C5 | SA1 (approve page of H2), SA2 (decline page of H2); Y: TA-07, TA-07h, TA-10 of H2 (design V07-22, order reversed) | Both open their page. SA2 declines with a reason. SA1 sends the approval. Harness: send a saved envelope of H2's decline page again with a new key. Y reads. | SA2: "Help request declined"; SA1: CMP-14 "you saw Requested / current Declined", "No second decision was recorded."; the saved envelope refused stale with the reason kept; Y: "Declined", the notice, TA-07h offered; SA-02b and group 4 − 1. | A17, A30, A34 (1), (3), A35 | L |
| V07-C6 | Y: TA-07 of H; SA1: SA-02a, SA-01 | Read. | "Approved: TravelMudra assigns an operator"; SA-02a approved help + 1. | A18, A26 | L |
| V07-C7 | Setup: SA1 records the Gate 1 exception for assignment of H (SA-09g) and assigns H to OP1 (SA-03a) (design V07-12). Observed: Y (TA-07, TA-07p, TA-09d of H; harness edit and submission) | — | "Assigned for approved help" (WP06-A47); TA side "An operator is entering information with your approval", Help "Approved: an operator is entering information", the aside "Report a problem" and TA-07p with the form (no send); the posts refused; SA-01 group 3 back to baseline; group 11 + 1. | A07, A19, A26 | L |
| V07-C8 | OP1: OP-02, OP-02a and OP-03f of H; harness; OP-01, TA-07, SA-01, SA-02 (design V07-13) | Read OP-02 and OP-02a. Open OP-03f; harness: flag. Read the other pages. | The frame line; the assistance row with the Gate 1 blocker and the known-gap line; OP-02a: CMP-10 in place of the entry and upload forms, "Return for TA review" kept; OP-03f gap, the flag refused; today's owner recorded (Deferred until the Core batch). | A41, A42 | L |
| V07-C9 | Setup: SA1, SA-09g `gate1_first_work` of H (design V07-14) | Record the exception with a reason. | Open until [time] IST. | — | L |
| V07-C10 | OP1: OP-02a of H (design V07-15) | Read. Send an empty explanation. Change the given names with no document. Change the surname with the passport ticked. Then enter the travel purpose and "Where the information came from". Upload a GIF for the photograph row. | The label band, the request note, the Gate 1 section and "What you can change" before the form; C1; two same-person refusals with the values and the ticked passport restored; then "Information recorded" with the exception "used"; group 11 + 1; the GIF refused at its row on OP-02a. | A39, A40, A43, A44 (1), (2), (4), A48 | L |
| V07-C10a | Harness as OP1 (design V07-16) | Replay the accepted entry (same key); the same key with one field changed; Back and send the reloaded form (new key). Open OP-02a of P by GET. | The same receipt; the conflict; "Nothing changed: every value you sent is the one on record."; P: "No approved assistance is in progress…", no form; nothing extra recorded. | A44 (3), (8), A47 | L |
| V07-C10b | OP1 (two tabs) | Tab 1 opens OP-02a and changes the passport type; tab 2 records country of residence; tab 1 sends. | C5 rows with the typed values kept; the refreshed send recorded once. | A46 | L |
| V07-C11 | OP1: OP-02a "Finish" → OP-03r of H (design V07-17) | "Return for TA review" with "WP09 [stamp] please check the travel purpose". Open OP-02a again. | The draft effect; "Returned to the travel agent" with Current "Help request: Ended"; OP-02a "Returned for review" state, no form; OP-01 "Returned to TA". | A44 (8), A50 | L |
| V07-C12 | Y: TA-07 of H | Read. | "Returned to you for review"; Help "Ended"; the note verbatim; "Review what the operator entered, then submit." | A20 | L |
| V07-C13 | Y: TA-08 of H; OP1: OP-01 (design V07-18) | Review the answers; tick the confirmations; submit. Open the A31 and A43 receipt addresses again. | "Application submitted", Next "your assigned operator"; "With your operator", the same operator; "Help request: Ended"; OP-01 lists H; the old receipts show Current facts only. | A21, A23, A78 | L |
| V07-D1 | SA2: SA-02b → SA-09h `assistance_approve` of R (design V07-20) | Read. Send with a reason. | R "Assigned"; the in-place effect row in full; the Gate 1 refusal with the routes; the reason kept; nothing recorded; R's row stays. | A25, A28, A32 | L |
| V07-D2 | Setup: SA2, SA-09g `gate1_first_work` of R (design V07-21) | Record the exception. | Open until [time] IST. | — | L |
| V07-D3 | SA2: SA-09h `assistance_approve` of R (reloaded) | Approve again. | "Help request approved"; Editing "Operator assistance in progress", Operator OP2; the exception "used"; the follow-up on SA-07a; group 11 + 1 (total + 4 from P-0); SA-02b and group 4 at baseline. | A32, A36 (5) | L |
| V07-D4 | OP2: OP-02 and OP-02a of R | Read. | The frame line; the Gate 1 section from Core's answer for the recorded basis; the form shows. | A39, A124 | L |
| V07-D5 | OP2: OP-02a "Finish" → OP-03r of R | Without any entry, "Return for TA review" with "WP09 [stamp] please check and hand it back". | The submitted effect (hand back, quote and window unchanged, readiness again); "Returned to the travel agent", Current "Help request: Ended". | A50, A124 | L |
| V07-D6 | Y: TA-07 and TA-08 of R; OP2: OP-02 of R | Read; hand the application back. OP2 reads OP-02. | "Returned to you for review"; Help "Ended"; the returned mode with the unchanged quote and window; "Handed back to your operator"; "With your operator" (OP2); OP-02: start work, then readiness. | A22 | L |
| V07-E1 | `syn-ta-2`; OP2; `operator-3`; harness | Open TA-07 and TA-07p of P; OP-02, OP-02a and OP-02r of P; OP-02a and OP-02r of P and H with the read grant; the foreign-id POST envelopes. | Not-found or SH-02 as A89; the read-only line for `operator-3`; nothing recorded. | A60 (4), A72 (2), A86, A89 | L |
| V07-E2 | Test (design V07-3, V07-19, V07-26; BU22-2) | Lost acknowledgements; edited receipts with the G-01 substitution; the support view; LD-14 HTTP tests; A06, A07 (send), A08 (send), A33, A41 (envelope, unavailable), A43 (identity), A45, A47 (4), A49, A50 (readiness), A57 (mapping), A64, A78 (newer flag), A80, A82, A125, A128, A130 (ignored values). | As the items. | A06 to A08, A33, A41, A43, A45, A47, A49, A50, A57, A64, A77 to A80, A82, A83, A86, A125, A128, A130 | T |
| V07-E3 | axe (design V07-27) | Every WP-09 page visited. | No serious or critical violation at 1440 px and 390 px. | A102 to A123, A131 | L |

Proof split: V07 passes when V07-A1 to V07-A8, V07-B1 to V07-B9, V07-C1 to V07-C13, V07-D1 to V07-D6, V07-E1 and
V07-E3 pass on `lane-ui` at the integrated WP-09 commit and V07-E2 passes as named tests; A42 is recorded "Deferred
until the Core batch (P-12 C)". BU-21 is partly met (Q-W09-08): its draft half passes when V07-C1 to V07-C13 pass (help
on a draft through the normal decision path; no submission until the TA's own; no assignment without Gate 1); its
first half (help before an application exists) is the bulk boundary (§4). BU-22 passes to its boundary when V07-A1,
V07-A7 and A128 pass; the bulk correction page is the bulk boundary (§4). The run record names the `lane-ui` ref, the
run tag, Y's identifier, each test, the identifiers (internal record only) and every delta.

## 4. Scenario parts outside these proofs (traceability)

| Scenario part | Where it is proven |
|---|---|
| V07: formal return and readiness reconfirmation (the return and readiness commands) | WP-07 (WP07-A39 to A41, A30); WP-09 observes them in V07-A7, V07-A8, V07-D5 |
| V07: the label "Return for TA review" and the lifecycle effect text | WP-07 (WP07-A48; F-14, F-15 at the WP-07 build's alignment); WP-09 proves the journey (A50, A124) |
| BU-21: request help before an application exists | Bulk boundary (S-W09-02, Q-W09-08): no Core command records a help request on an intake issue; an open intake issue already lists in the SuperAdmin import issues (WP-18). A new command would be Kind 2 for Max (default no) |
| BU-21: "Request help" on the bulk issue page (BU-P06) and the review queue (BU-P10) | WP-04 and WP-18 (bulk pages); the help decision path of WP-09 applies unchanged |
| BU-22: BU-P07 "edit unavailable" and its "Report a problem" link | WP-05 and WP-18: the bulk page links to TA-07p with `from=import` and never posts the report (S-W09-01); A128 proves TA-07p's side |
| V06: help approval and assignment need Gate 1 | WP-06 (SA-02a, SA-03a, SA-09g, WP06-A147, A148); WP-09 adds the in-place approval and the first entry live (A32, A41) |
| P-12 C: the SuperAdmin owner and queue for a blocked first-work Gate 1 | The Core batch (S-08), then the open package adopts it (A42; design §3.3) |
| Operator and SuperAdmin notices of reports, responses and help approvals | WP-15 (OP-10, SA-10); WP-09 reads the existing operator notices list only to check the recipient (A126) |

## 5. Out of scope and boundaries

These MUST NOT appear on any WP-09 page:

- An operator information-entry control outside approved help, or an editable application field in ordinary work
  (BS B18; UX §5.3).
- "Submit for TA", or a control or text that submits, confirms authority, pays or changes the price for the travel
  agent after help (BS B17, B18; UX §5.3); an effect text that tells a submitted application to "submit" (F-14).
- On an assigned, not returned application: a TA edit, upload, submission or help-request control; any TA control
  other than "Report a problem" (BS B18).
- A problem report that changes application data, documents or price, or that claims to.
- A SuperAdmin control that enters information, resolves a hold, records readiness, files or submits (BS B18).
- A flag response presented as a payment, an exception, readiness, an approval or a decision; a help approval
  presented as an assignment, a payment, a Gate 1 pass or a submission (BS B20; UX §6.3).
- A blanket sentence that approving help never needs a payment (`WP-06.md` D-07); an assigned-approval effect that
  inherits a sentence of the unassigned row (G-08).
- A flag control while approved help is in progress (Core refuses it; the known gap shows instead, D-06).
- An entry or upload form on OP-02a while Core's first-work evaluation reports a Gate 1 blocker, and a removed form
  while that evaluation is absent or unavailable (G-05, Q-W09-07).
- A resolve control for a return hold.
- An offer of "Report a problem" where Core refuses it, or its absence where Core accepts it (Q-W09-02).
- A visible approve-or-decline choice on the help decision (G-04).
- A receipt that names a result the operation does not establish (the `resolved` receipt is neutral, G-01), an
  accepted time, a current flag line that ignores the hold's state (G-10), or an instruction to act from an older
  state (C-03; P-02; F-01).
- Earlier facts on a page after an optional read was refused for access (LD-14).
- A silent truncation of ticked documents or of any other form row; a cleared evidence selection after a refusal
  (D-10; E-04; G-07).
- A read marker on a notice (LD-06); a count shown as "0" when it is unknown (D7).

Deferred in WP-09 (each item says where it lands; the run record lists them as "Deferred"):

- **Deferred until the Core batch** (P-12 option C as narrowed; S-08; design §3.3): the SuperAdmin as owner of a
  blocked first-work Gate 1 on approved help, its OP-01 view, its TA text, the SA-01 group and SA-02 view "First work
  waiting for Gate 1", and the unusable exception's id and failure on SA-09g and SA-09h (A42).
- **Deferred until the Core batch** (P-10 e): Core's Gate 1 answer for the in-place help approval shown before the send
  (A28). OP-02a's Gate 1 block is not deferred: it reads Core's `start_operator_work` evaluation (A41, Q-W09-07).
- Command identity and accepted time in receipts (P-10 b, P-02): neutral receipts where §0.2 says so (A55, A58, A77).
- Evidence references on the set-up gate exceptions (P-11, S-07): the set-up exceptions carry a reason only.
- TA-readable texts: the travel agent's own report text, the operator's resolution note, the decline reason and the
  fields the operator changed during help (PM Q-05; STOP-W09-03, -04 parked P2, criterion point 2 not demonstrated,
  G-11): A03, A09, A16, A20 partly met.
- The operator's name for the travel agent (STOP-W09-02 parked P2, G-11): "your assigned operator".
- Core's own evaluation of the report on the TA case read (STOP-W09-01 parked P2): the page maps Core's guard facts
  (A06).
- Hold facts on the flag queue rows (Q-06): A66 shows Core's current step where the flag is not the current step.
- BU-21 first half (help before an application exists): the bulk boundary (Q-W09-08, S-W09-02).

Not in WP-09 (later or earlier packages):

- `core.request_assistance` (TA-07h), `core.hand_back` (TA-08 returned mode): WP-03.
- `core.flag`, `core.formal_return`, the label "Return for TA review" and the lifecycle effect text: WP-07 (F-14,
  F-15).
- Gate 1 exceptions, assignment, reassignment and payment records: WP-06.
- Withdrawal, deferral and price decisions (carried forms): WP-17.
- Operator and SuperAdmin notices: WP-15. Bulk pages: WP-04, WP-05, WP-18.

## 6. Questions for the architect (ranked)

Kept as asked. `WP-09.md` §3 and §4.1 and `WP-07.md` §4.2 answer: Q-01 (F-13: rows 3a and 3b and the TA text by
reason code, amended into WP-07); Q-02 (Q-W09-04: identity from the posted values, evidence over the limit refused
with the values kept); Q-03 and Q-04 (Q-W09-02: report offered by Core's guard facts, also during approved assistance
and after an outcome; STOP-W09-01 parked); Q-05 (parked P2 with STOP-W09-03 and -04; G-11 records criterion point 2
as not demonstrated); Q-07 (G-01: the `resolved` receipt is neutral; design §2.11); Q-08 (design §2.4, §2.7 and §2.12:
the page re-reads and shows the decided or resolved state; no Core change); Q-09 (design §2.8: two labelled fields,
"Response to the operator" and "Reason for this response"); Q-10 (Q-W09-08: partly met with the boundary; seam note
S-W09-02); Q-11 (STOP-W09-02 parked P2); Q-12 (OP-02r is a task page per hold; the register notes are corrected,
`WP-09.md` §3 PM Q-12). Q-06 stays open (P2).

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
| BU-21 result (draft half; first half partly met at the bulk boundary) | |
| BU-22 result (to its boundary) | |
| Deferred items (reference each; "Deferred until the Core batch" for A42 and the P-10 e part of A28) | |
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
| WP09-A124 | | | |
| WP09-A125 | | | |
| WP09-A126 | | | |
| WP09-A127 | | | |
| WP09-A128 | | | |
| WP09-A129 | | | |
| WP09-A130 | | | |
| WP09-A131 | | | |
| V07 proof | | | |
| BU-21 proof (draft half; first half at the bulk boundary) | | | |
| BU-22 proof (to its boundary) | | | |
