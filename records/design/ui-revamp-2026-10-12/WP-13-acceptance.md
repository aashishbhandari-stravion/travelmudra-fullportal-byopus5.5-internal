# WP-13 acceptance checklist: Offering change and suspension

| Field | Value |
|---|---|
| Lane | `ui-revamp-2026-10-12` |
| Work package | WP-13 Offering change and suspension (UI-PLAN §12.2: SA-05 full, TA-03, TA-07; done when V20 and BU-27; lane PLAN §3) |
| Author | Principal Product Manager (Claude subagent), 13 October 2026 |
| Decision owner | Principal Technical Architect of the lane (LD-12) |
| Status | Draft. Step 1 of lane PLAN §3, written before the design. Not run. Where the later design names a page, a path or a word differently, the design governs the name and this checklist keeps the observable result. |
| Product base | lane branch `ui-revamp-2026-10-12`: Core at e1f6ac9 (no change under `src/modules`, `src/contracts`, `src/core-api` or `src/kernel` up to 34e875b); pages read at 34e875b, after the WP-02 commit 228816a; internal records at 0897632 |
| Installation | `lane-ui`: staff http://127.0.0.1:4652 (SuperAdmin pages under test; operator pages as observation); edge http://127.0.0.1:4650 (TA-02, TA-03, the add-applicants step, TA-07 and TA-08 under test; proof set-up) |
| Writing style | ASD-STE100 at about 75% (STY-20261003-01) |

## Corrections

None yet. This is the first version. The alignment to the WP-13 design, to the architect's decisions (`WP-13.md` §3)
and to the independent review (LD-13: WP-13 changes admission, existing-work and travel-agent authority state, so the
design and this set get one Codex review before code) will be recorded here as a table of changed rows, as in
`WP-11-acceptance.md` and `WP-12-acceptance.md`.

## Lessons applied from the WP-01 to WP-12 corrections

| Lesson | Source | Where this checklist applies it |
|---|---|---|
| Identical replay, changed-content conflict, browser Back, rejected-form refresh and lost acknowledgement are five separate cases; a business duplicate with a new key and a raw stale envelope are two more | WP-01 A-02, A-03, A-06; WP-03 R-12; WP-06 D-12 | §0.2 "Replay terms"; one "Nth time" item per command (A11, A19, A25, A30, A34 (6), A37, A46, A52, A55, A56); the matrix A75 |
| A refused command leaves no operation record; the refusal shows only on the re-rendered form | WP-01 A-08; WP06-A104 | §0.2; A74; every refusal item says "nothing is recorded" and checks it by delta |
| A receipt names the command only when the operation's resource, returned id and summary (or a read by the returned id) establish it; otherwise a neutral "Request recorded" with facts labelled "Current"; no accepted time | WP-01 A-04, P-02; WP-02 B-02; WP-06 D-02; WP-09 G-01; WP-11 I-09 | §0.2 "Receipts"; A72 (per-command naming table) |
| Recorded facts in a receipt come only from stored summary fields; counts and states read after the operation are "Current" | WP-12 J-08 | §0.2 "Receipts"; A72, A73 |
| No page, status read or receipt instructs anyone to perform an act; a historical receipt keeps the historical fact and shows current facts as "Current" | WP-07 F-01, F-33 (P0 class fix); WP-09 G-10; WP-11 I-02 | A73 (a suspension, treatment or transition receipt opened after the lift, the withdrawal or the travel agent's answer) |
| Another person's receipt opens as the unchecked receipt with current authorized facts | WP-12 J-09 | A72 (SA2 opens SA1's receipt addresses) |
| Freshness: "Read at [time] IST" for an authoritative read; the lag form for a projection | LD-08 | §0.2; A01, A32 |
| A page shows only facts that a read returns; a missing fact is "Unavailable" or the item is "partly met"; gaps are deferred, not failures | WP-02 B-06; WP-03 R-11; WP-06 D-04, D-05 | §0.2 "Facts"; §5 "Deferred" |
| A known gap is shown on the page, not designed around | WP-06 D-03, D-06 | A20 (no per-application treatment and no list of affected applications), A47 (no read of what changed for the travel agent), A45 (no read of a transition's state) |
| A state is labelled for the fact and the action it was evaluated for | WP-06 D-05 | §0.2 "Offering-change words"; A02 (effects for a travel agent in the approved audience), A58, A64 |
| Expectations name only states that a read returns | WP-10 H-06 | §0.2 "Offering-change words" (no "paused" for a hold that Core does not report; no "migrated") |
| A request that Core refuses is shown as Core answers it; the page does not change the input to force acceptance | WP-06 D-09 | A36, A44, A51, A60 |
| No BFF handler truncates, slices or drops a submitted field or an indexed row; over-limit input is refused at the field with the values kept; a partly filled indexed row is refused at its index | LD-17 (WP-06 D-10, WP-08 E-04, WP-09 G-07, WP-10 H-04); WP-12 J-06 | A08, A52, A85 |
| The refusal summary and the submitted values render independently of the current eligibility; where the form no longer applies an "unsent" block keeps them; no refusal rebuilds a hidden decision value from a fresh read | WP-02 code review R-01, R-03 | A86 (today's lost `offering_retired` and `declaration_not_draft` refusals) |
| A page MUST NOT block a command that Core accepts, and MUST NOT offer one that Core refuses; where the refusing fact is not on the page's read, the form shows and Core's reason is re-rendered, with no exact-parity claim | WP-07 D-W07-16; WP-03 F-W03-11; WP-10 H-02, H-03; WP-12 J-04 | A33, A41, A63, A67 |
| No semantic duplicate guard is claimed where Core has none; existing records show before the form | WP-08 Q-W08-15; WP-09 G-03 | A34, A37, A38 (reviewer, item decision and recheck have no duplicate guard) |
| On GET assert the blocker and the absence of the form; a command refusal of a removed form is tested with a saved envelope | WP-09 G-05 | A22, A41, A53, A67 |
| A harness envelope that isolates a guard carries current revisions and valid evidence, so that the earlier guards pass; a raw refused envelope is re-evaluated against its own revisions | WP-10 H-07; WP-11 I-11 | A75 (5a), (5b) |
| Evidence selections and typed values are restored after a refusal; confirmations and acknowledgements stay unchecked | WP-09 G-07; WP-03 rule | A27, A86 |
| An outage of the evidence that a consequential decision needs removes the form with an incomplete-review notice; optional guard information may degrade; access refusals are a separate test | WP-07 F-04; WP-10 H-05; WP-11 I-05; LD-14 | A78 |
| Proofs rerun with a run tag and a fresh synthetic travel agent and offering; checks compare with a recorded baseline (deltas) | WP-02 B-13; WP-07 PM Q-07; WP-12 J-13 | §0.4; §3 step P-0 |
| Set-up writes through existing pages are allowed and are labelled "Setup"; they are not the subject under test | WP-03; WP-06 Q-W06-10 | §0.4; §3 |
| Real refusal shapes from the code; a business refusal is asserted from the current page's facts | WP-06 D-11, D-12; WP-07 F-09 to F-12 | §0.5; every harness step sends from a freshly read page unless the step says "raw" |
| One host page per command use; forms of later packages stay reachable; every rendered form action is a registered route; carried test entries are removed when the owner package rebuilds them | CC-12 to CC-16; WP-02 design §8.2; WP06-A110 | A83 |
| Copy states no configuration value that the page does not read, and no package or record id | WP-01 Q-13; WP-07 F-22 | A80; §0.2 "Copy" |
| A boundary of an undecided (parked) policy names the product owner and no date; a boundary of a decided policy never says that an owner still has to decide | LD-04, LD-05; WP-08 Q-W08-03 | A22, A53, A58 |
| UI acceptance is separate from Core behaviour: a Core gap is recorded "Unmet" with its owner, not as a WP-13 failure | WP-10 H-01, H-08; WP-12 J-01 | §0.2 "Pass rule"; §6 |
| A page predicts no Core outcome; it shows Core's current facts and effects | WP-10 H-10; WP-08 E-05, E-06 | A02, A41, A47 |
| Pending reasons read per (reason, next action); one mapping drives the view, the count and the page | WP-07 F-07, F-13, F-16, F-30 | A50, A69, A77 |
| Kind 1 notes record whether criterion point 2 is demonstrated; no proposal is raised without it | WP-09 G-11; DECISIONS §3.1 | §6 |

## 0. Inputs and conventions

### 0.1 Inputs

| Ref | Source | Identity | Sections used |
|---|---|---|---|
| UX | `TARGET_PRODUCT_UX_SPEC.md` (2026-10-05) | SHA-256 b45186887cdc37f6… | §2.1 (Offering), §2.2 (Readiness/control, Next action), §2.3, §3.1 step 1, §3.2 (Withdrawn/suspended offering), §3.3, §4.1, §4.4 ("No offering selectable"), §6.1, §6.2 (Offerings & launch), §6.3 (Offering management; Publication and impact; Launch/suspension/lift), §7.4, §7.5, §8.3, §12 V20 (and V21, V24 where they touch this package) |
| BU | `BULK_UPLOAD_PRODUCT_UX_SPEC.md` (2026-10-05) | SHA-256 c2686f12552be10f… | §11 BU-27 |
| BS | `BUILD_SPEC.md` (r2) | SHA-256 4a6fd90657b0723f… | B05, B06, B07, B32, B33, B35 |
| PL | `../ui-plan-from-specs-2026-10-10/UI-PLAN.md` | SHA-256 75256bfd7e6d929a… | §3.2 TA-03, TA-07; §3.4 SA-05; §4.2 (Withdrawn or suspended offering); §5.2 (TA-02/TA-03, TA-07, TA-08), §5.4 (SA-05); §6.2, §6.4 (Offering administration read model); §7 (Record existing-work treatment; Launch, Suspend, Lift, Withdraw; K-STD, K-BATCH); §8 (CMP-01, CMP-03, CMP-07, CMP-08, CMP-10, CMP-13, CMP-14, CMP-15, CMP-25); §10; §11.1 to §11.3; §12.2 WP-13 |
| BP | `../ui-plan-from-specs-2026-10-10/BULK-UPLOAD-UI-PLAN.md` | SHA-256 6c574a4eaf9e39c7… | BU-P01, BU-P02 rows; BU-27 coverage row (BU-P01, BU-P02, TA-03) |
| CC | `COMMAND-COVERAGE.md` (this folder) | SHA-256 d2df85471c03d0b6… | §3 rows of the 11 WP-13 commands; §5.1 WP-13; §5.3 (`cat.*` and launch sub-pages; TA-07 panels); §5.4 (`admin.catalogue.transition` under `/admin/applications`); §6 CC-06, CC-12 to CC-16 |
| LP | `PLAN.md` (this folder) | SHA-256 745506b34b244191…; internal 0897632 | §3, §4 (LD-02, LD-03, LD-04, LD-07, LD-08, LD-11, LD-12, LD-13, LD-14, LD-16, LD-17), §8 (S-08), §9 |
| PR | `PROPOSALS.md` (this folder) | SHA-256 fcc412acba79f48e… | P-02, P-05 (TA-03 eligibility interim), P-06 (launch and expansion revision guard; lift uses the same readiness check), P-10 b (command identity) |
| W2 | `WP-02.md`; `WP-02-design.md`; `WP-02-acceptance.md` | SHA-256 7fe4a07271c809fb…; e8eacaabf622cb83…; bfac75d7e75d34ef… | record §3, §4.1 (B-01 to B-14), §6 (carried forms, rail label, P2 items "cleaned up with WP-13"), code review R-01 to R-03; design §1.2, §1.5, §2.1 to §2.5, §8.2; acceptance §0.2, §0.3, A24, A33, A43, A53, A54, A60 to A62, A71, A79 to A82, A103 to A109, §3 Parts C, D, G |
| W3 | `WP-03.md`; `WP-03-design.md` | SHA-256 581768d6b07dad77…; d4d40cb1d18a7bc2… | record §3, §4.1 (C-02, C-05), §6; design §3.1 (TA-07 offering rows), §3.2, §3.4, §7.5; acceptance WP03-A35, A106, A125 |
| W6–W12 | `WP-06.md` to `WP-12.md` §3 and §4 | SHA-256 2dabeab4fab80ea8…, 9821d58d41b2cf99…, 0a9bfc4420d33e33…, 97074922067b5db7…, 75baf8518b9edaf5…, 084f531a30c0e999…, aea7f10624c10b40… | D-02, D-04 (neutral receipts; current and possibly incomplete lists); F-01, F-04, F-07, F-13, F-16, F-22, F-33; E-05, E-06; G-03, G-05, G-07, G-10, G-11; H-02, H-05, H-07; I-05, I-09, I-10; J-06, J-08 to J-10; WP-06 design §2.1 SA-01 group 8 (impact decisions) |
| F1 | Lane research `research/wp13-facts/launch-control-commands.md` | SHA-256 b9bc30e7c488026f… | The four launch commands, launch effects, reads, BFF forms and handlers |
| F2 | Lane research `research/wp13-facts/impact-transition-commands.md` | SHA-256 6a653dfda25f8f8f… | The seven catalogue and transition commands, the impact model, reads, pages and handlers |
| CAT | `catalogue/synthetic/catalogue.json` | SHA-256 f309f108fa9c923a… | The head body of "SYN Tourist e-visa" that the run offering copies (WP-02 §3 D3) |
| Code | lane repository | e1f6ac9 (Core); 34e875b (pages, after the WP-02 commit 228816a) | `src/modules/operations/commands/launch.ts`, `src/modules/operations/launch/{effect,decision,readiness,read-model}.ts`; `src/modules/catalogue/commands/{impact,identity,declarations}.ts`, `src/modules/catalogue/{impact,domain,display}.ts`, `src/modules/catalogue/tasks/impact-recheck.ts`; `src/modules/core/commands/admin.ts` (`core.decide_transition`), `src/modules/core/catalogue-writers.ts`, `src/modules/core/derived.ts` (pending rule 7), `src/modules/core/controls.ts` (stages 4, 5, 11); `src/kernel/vocabulary/{catalogue,launch}.ts`; `src/contracts/catalogue.ts`, `src/contracts/core.ts:88,272`; `src/core-api/bindings/catalogue-admin.ts` (`evidenceOf`, `effectsOf`, the command bindings), `src/core-api/bindings/core.ts`; `src/modules/identity/policy.ts`; `src/apps/staff/catalogue/{launch,launch-decision,impact,admin,routes,shared}.ts`; `src/apps/shared/core/ta.ts:298-306, 637-650`; `src/apps/shared/pages/{services,review-submit,intake}.ts`; `src/apps/edge/core/routes.ts:94-100`; `src/web/route-inventory.ts`; the tests named per item |

Verified facts of the code that the items rely on (Core at e1f6ac9, identical at 34e875b; pages at 34e875b; F1 and F2
give the line references; the author re-read the command handlers, the effect logic and the transition writers):

- **Launch effect** (`effect.ts`). New work (`select_offering`, `start_intake`, `create_draft`) is refused with
  `offering_suspended` or `offering_withdrawn` (also `offering_not_launched`, `offering_out_of_launch_scope`,
  `catalogue_not_published`). Existing work (`submit`, `request_assistance`, `assign`, `start_operator_work`,
  `assistance_entry`, `record_readiness`, the three authorizations, `release_packet`) follows **one treatment per
  cause**: suspension `continue` → allowed, `hold` → held `existing_work_hold`, not recorded (`missing`) → held
  `existing_work_treatment_missing`; withdrawal: `submit` and the draft actions → refused `offering_withdrawn`,
  otherwise treatment `hold` → held `withdrawal_continuation_not_permitted`. The most restrictive effect wins and every
  contributing code is listed. `record_outcome`, `release_bytes`, `send_document_email`, `complete` and `reassign` are
  never stopped; reconciliation, custody, incidents and `request_withdrawal` are not launch-controlled. Payment is never
  an input. There are no existing-work classes: a treatment applies to every existing-work action of the offering; the
  lifecycle (draft or submitted) decides how it lands. A held command answers `control_blocked` with the first code.
- **Suspension with "continue" lets a draft be submitted** (`test/core/launch.test.ts:70`). Today's suspend form says
  "New selection, intake and submission stop at once" (`launch.ts:667`): wrong for `continue` (A07, A13).
- **Pending answers carry no launch rule** (`derived.ts`): a held case keeps its ordinary pending answer (for example
  owner the assigned operator, next action `record_readiness`); the hold shows only as an evaluation blocker
  (`core.ops_case` act, release and assign offers; `core.ta_application` `submit` and `assistance`; `correct` has no
  launch stage). The next-action code `record_existing_work_treatment` exists only in the vocabulary (Q-01).
- **Impact assessments** are opened by a head change only: `cat.publish_baseline` (cause `baseline_publication`),
  `cat.publish_declaration` (`declaration_change`, class `structural`) and a release registration (`release`).
  Suspension and withdrawal open none. A new head supersedes the older open assessment. The recheck task classifies
  every open application on another tuple: by the publication's continuation policy when the publication recorded one,
  otherwise `pending` (`left_behind_structural`, `left_behind_baseline_only`) or `unknown`. A draft created behind
  the head gets an `unknown` item. Unknown, pending or declined impact blocks `submit`, `record_readiness`, the
  authorizations and packet release with `catalogue_impact_unknown`; a hold blocks them with `catalogue_impact_hold`
  (control stage 11). States: `rechecking`, `review_required`, `reviewed`, `superseded`.
- **Transitions.** `cat.approve_transition` opens a per-application transition to the head. A draft, or a submitted
  application whose 17 authority-bearing declaration items are unchanged and whose engineering statement does not ask
  for authority, moves at once. A submitted application with an authority-bearing change waits for the travel agent
  (`awaiting_ta_authority`); Core posts the travel agent a notice that needs acknowledgement. While it waits, `submit`,
  readiness, packet release and the authorizations are blocked `transition_pending`; the pending answer is the travel
  agent's `decide_transition` when the application is unassigned, otherwise the assigned operator's `return_to_ta`.
  `core.decide_transition` takes `apply` or `decline`. A decline leaves the item `transition`, the application
  `affected_pending` (blocked `catalogue_impact_unknown`), opens no new transition, posts no notice and changes the
  assessment to no open item (Q-02). A second `cat.approve_transition` after a decline or an immediate apply is
  accepted and opens nothing (Q-03).
- **Evidence through the catalogue-admin binding.** `evidenceOf` builds at most one evidence item per list
  (`evidence.kind`, `evidence.id`, `evidence.note`; for withdrawal also `feasibility.*`). Core accepts 0 to 20. A
  transition's compatibility evidence passes only when the assessment's engineering statement names the offering as
  `requires_transition` or `compatible_continuation`, or a `release_manifest` entry names the head binding id (or a
  recorded release that supports it). The assessment read returns the head binding id (`after_binding_id`).
- **Reads.** `ops.launch_offering`: `controls` (launch, suspension, withdrawal states; revision), `effects` (seven rows
  for a travel agent in the approved audience: create a draft; submit a draft; start operator work; record readiness;
  authorize the government submission; release the packet; record the outcome), `suspensions` (id, state, time,
  reason), `treatments` and the current `suspensionTreatment` / `withdrawalTreatment` (id, cause, value, current),
  `withdrawal` (id, effective time, continuation permitted), `decisions`, `plan`, `acknowledgements`. Not returned: who
  suspended, lifted, withdrew or recorded a treatment, the evidence and reasons of lift, withdrawal and treatment, and
  any count or list of the applications a suspension or withdrawal affects. `cat.admin_impact_index`: open assessments
  only (`rechecking`, `review_required`) with `open_items`. `cat.admin_assessment`: the assessment (before and after
  declaration, values and binding ids; continuation policy; statement state; reviewer; state; revision), the statement
  changes, every item (`application_id`, current or not, applicability, classification, treatment, hold owner,
  revision) and each application's lifecycle. Not returned: applicant or travel-agent names, the item's decider,
  time, reason, evidence and transition id, any transition state, the retirement actor and reason.
  `core.ta_application.transition` is `{transition_id}` while a transition awaits, otherwise null; no read says what
  changed. `core.ops_case` and `core.admin_case` have no impact or transition field (blocker codes only).
- **TA visibility.** `cat.selectable_offerings` lists an offering to a travel agent while it is launched and the
  travel agent is in the audience; a suspension or withdrawal keeps it listed with `selectable:false` and the codes.
  A withdrawn then retired offering stays listed (codes `offering_withdrawn`, `catalogue_not_published`); a
  never-launched retired offering is invisible. `intake.start_bulk` answers `offering_not_launched` when the named
  offering is not startable, even when it is suspended (F1).
- **Today's pages (34e875b).** SA-05h carries the suspend, treatment, lift, "hold remaining" and withdraw forms
  (`launch.ts:646-720`); SA-05b carries recheck and retire; SA-05c carries "Discard this draft"; the old assessment
  page hosts reviewer, item decision and transition forms; TA-07 "Waiting for your decision" offers only "Accept the
  changed terms" (`ta.ts:645-650`). Staff refusals re-render without the typed values; an `offering_retired` or
  `declaration_not_draft` refusal is lost because its section hides (F2). The edge handler slices `transitionId` to 40
  and `decision` to 20 characters (`routes.ts:98`). TA texts: suspended "Work you already started continues as
  TravelMudra decided." (`services.ts:57`, Q-05); withdrawn "unavailable until TravelMudra offers this service again"
  (`review-submit.ts:105`; withdrawal is irreversible).

### 0.2 Conventions

- **Personas.** Travel agent: Y, `wp13-ta-[stamp]`, a fresh synthetic travel agent per run (created and activated on
  SA-06 at set-up); `syn-ta-2` for isolation and the out-of-audience view. SuperAdmins: `superadmin-1` (SA1, the
  decisions) and `superadmin-2` (SA2, the second tab, the accountable reviewer and the hold owner). Operators:
  `operator-1` (OP1, assigned P) and `operator-2` (OP2, isolation). They stand for `syn-superadmin-1`, `-2` and
  `syn-operator-1`, `-2`. Keyboard-only user. Screen-reader user. Phone user (390 px wide). No step suspends a seeded
  account or changes a seeded offering.
- **Where.** `L`: a person or the LD-11 harness shows it on `lane-ui`. `T`: an automated test in the lane repository
  shows it at the same commit; the run record names the test. `L+T`: both are required. A test that the item says
  WP-13 adds is named in the run record with its file and title. "Gallery" is the design's gallery state.
- **Sign-in codes (rule C).** As WP-01 §0.2. The LD-11 harness signs in. Nobody prints, logs, screenshots or stores a
  code or an authenticator key.
- **Copy.** Quoted text is draft copy (CR-09). Draft copy passes when the page states the same facts. The §11.3
  boundary form is mandatory for an unavailable action: "[Action] is unavailable until [policy or evidence] is
  [approved / recorded]. Owner: [owner or 'not yet named']." Core's reasons show in words; a code shows only as the
  UAT-13 fallback (A77). No page shows a package or record id (F-22).
- **Offering-change words** (draft; the design governs the words, the facts stay). Staff: suspension "Suspended: new
  applications paused"; treatment `continue` "Existing work continues", `hold` "Existing work is held", not recorded
  "Not recorded: existing work that needs a decision is held until a SuperAdmin records how it continues"; withdrawal
  "Withdrawn (cannot be undone)" with "Unfiled work may continue" or "Unfiled work is held"; retirement "Retired".
  Effects "Allowed", "Held", "Refused" with the reasons (WP02-A81 wording). Impact: applicability `unknown` "Not known
  yet", `affected` "Affected", `unaffected` "Not affected"; treatment `pending` "Decision needed", `continue` with kind
  `continue_current` "Continues on its own terms" or `continue_on_head` "Continues on the current published terms"
  (the kind is known only from a receipt or a reading of the governing terms; the item read returns no kind),
  `transition` "Moving to the current terms", `hold` "Held: owner [name]"; assessment states `rechecking` "Being
  rechecked", `review_required` "Decision needed", `reviewed` "Reviewed", `superseded` "Replaced by a later change".
  Every classification code has a sentence (A77). Travel agent: suspended "TravelMudra has paused new applications for
  this service."; withdrawn "TravelMudra has withdrawn this service. No new applications can start."; changed terms
  "The service changed after you submitted this application." Never: "migrated", "upgraded", "automatic", "closed" or
  "disabled" for a suspension, "paused" or "until … again" for a withdrawal, "Approved" or "Done" as an overall status,
  "Override", "Relaunch".
- **Dates and times.** Every time carries "IST" (AD-10, CR-06).
- **Freshness (LD-08).** An authoritative read (`cat.*`, `ops.*`, `core.*`) shows "Read at [time] IST". A projection
  (SA-01 groups from `views.*`, OP-01, TA-06 lists) shows the lag form. No client-side age threshold.
- **Facts.** A page shows only facts that a read returns (WP-02 B-06). A fact read after an operation is labelled
  "Current". A count that a read cannot give shows "Unavailable", never "0" (D7). A list that returns its row limit
  says so and claims no total. A fact that only the audit record holds shows only where `views.audit_subject` returns
  it as an explicit recorded field, with its time and source; otherwise "Not shown on this page" with the audit link
  (WP-11 I-10).
- **Receipts.** CMP-08 as WP06-A103: the request reference links to the operation status page; the resulting facts;
  "Recorded once. Sending the same form again does not repeat it."; no accepted time (P-02). A receipt names the
  command only when the operation's resource, the returned id and the summary establish it, or a read by the returned
  id establishes it (A72). Recorded facts come only from the stored summary; everything read after is "Current" (J-08).
  Another person who opens the receipt address gets the unchecked receipt with current authorized facts (J-09). A
  receipt never tells anyone to act (F-33). The polite region announces it.
- **Replay terms** (used by every "Nth time" item; the five terms of the lane):
  1. *Identical replay*: the harness sends the accepted request again with the same `_op` and the same fields (raw
     envelope); a double-click on the final button is the same case. Expected: the original result, nothing new.
  2. *Changed-content conflict*: the same `_op` with one changed field. Expected: refused as a used form
     (`conflict_operation_key` / `operation_key_reused`); the page re-renders with a new form key, the typed values
     kept and "This form was already used with different content. Your values are kept: check them and send again.";
     nothing recorded.
  3. *Browser Back*: after the receipt the person presses Back. Back reloads the page (WP-01 A-02) with a fresh form
     and current facts. Back sends nothing.
  4. *Rejected-form refresh*: a send that Core refuses leaves no operation record; the re-rendered form carries a new
     key; the corrected send is recorded once.
  5. *Lost acknowledgement* (fixture): C4 (CMP-13) "Checking the original result" and "Check status"; no new send of
     the same intent is offered there.
  Two more cases belong to the replay matrix (A75), never to a term: a *business duplicate* (a new key with the
  current page's facts) and a *raw stale envelope* (a new key with an older page's revision).
- **Refused sends leave no record.** A refused command leaves no operation record: the status page of its key reads
  "Nothing is recorded for request [reference] so far", and the refusal shows only on the re-rendered form. Every
  refusal item says "nothing is recorded" and checks it by delta (controls revision, effects, treatment rows, item
  revisions, transition presence, notices, counts).
- **Paths (LD-03; WP-02 design §1.2, §2.5).** Existing POST paths and form actions stay: suspend
  `/admin/catalogue/offerings/:offeringId/suspend`, treatment `…/existing-work-treatment`, lift `…/lift-suspension`,
  withdraw `…/withdraw`, recheck `…/recheck`, retire `…/retire`, discard `/admin/catalogue/declarations/:declarationId/retire-draft`,
  reviewer `/admin/catalogue/impact/:assessmentId/reviewer`, item decision
  `/admin/catalogue/impact-items/:itemId/decision`, transition `/admin/applications/:applicationId/transition`, the
  travel agent's decision `/ta/applications/:applicationId/transition-decision`. Kept GET pages: SA-05a to SA-05k of
  WP-02, SA-05m impact review `/admin/catalogue/impact`, SA-05n assessment `/admin/catalogue/impact/:assessmentId`.
  New GET pages get the paths that the design names. This checklist calls them: SA-05j kinds `suspend`, `treatment`,
  `lift`, `withdraw` (WP-02 design §2.5: WP-13 extends the launch decision page); SA-05p the item decision page;
  SA-05t the transition approval page; SA-05r the retirement decision page; SA-05x the draft discard confirmation;
  TA-07t the travel agent's changed-terms page (Q-15). Pages of other packages: TA-02, TA-03 (WP-02); TA-05, TA-07,
  TA-08, TA-09c (WP-03); TA-10 (WP-08); SA-01, SA-03a, SA-07a (WP-06); OP-01, OP-02 (WP-07). An item names the page;
  the run record names the path used.
- **Pass rule.** WP-13 passes when every `L` item passes on `lane-ui` at the integrated ref, every `T` item has a
  named passing test at that commit, every axe item passes, and the proofs of §3 pass, except the explicitly deferred
  items of §5. The run record lists each deferred item as "Deferred" with its reference, not as "Fail". Recorded, not
  failed: A47 (what changed for the travel agent) and A06 (who suspended, lifted, withdrew or retired) "Partly met"
  until a read serves the facts (Q-04, Q-09); A49 and A45 "Unmet: waits for the Core fix of Q-02 and Q-03" (the decline
  dead end and the empty second approval) with the boundary shown; A20 "Partly met" (one treatment per cause, no
  per-application treatment, Q-07). An item that the architect marks "partly met" by a recorded decision passes with
  that note. A failed item becomes a finding ranked P0, P1 or P2 with its scenario (PRI-20260930-01).
- **Preconditions on `lane-ui`.** WP-01, WP-02, WP-03, WP-06, WP-07 and WP-08 are integrated (SA-05 pages; SA-06
  accounts; TA pages create, edit and submit; SA-07a payments; SA-03a assignment; OP-02 action panel and evaluations;
  TA-10 notices). Where one is not integrated, the step runs on the existing page and the run record says so. The
  processing instance runs (the impact recheck is a background task). The harness can create, activate and sign in a
  new synthetic travel agent.
- **Data hygiene.** WP-13 MUST NOT suspend, withdraw, retire, republish or relaunch a seeded offering, and MUST NOT
  change a seeded declaration, value set, launch, plan or account. Each run creates its own offering O (service code
  `wp13_[stamp]`, launched for Y only, so no other travel agent sees it), its own travel agent Y and Y's group and
  applications. A withdrawal and a retirement cannot be undone: they apply to O only, at the end of the run. O and its
  applications stay on `lane-ui` (no delete command exists) and later runs exclude them by the code and the tag.
  Synthetic documents only, generated in memory; passport numbers are new in every run. Identifiers (offering,
  declarations, assessment, items, transitions, suspension, withdrawal, operation references) stay in the internal
  run record only.

### 0.3 Synthetic data used by WP-13

| Item | Value | Use |
|---|---|---|
| Travel agent | Y, `wp13-ta-[stamp]`, a fresh synthetic travel agent per run (SA-06) | The launch audience of O; every application of the run |
| Offering O | Synthetica (SYN), service code `wp13_[stamp]`, title "WP-13 proof [stamp]", mode "TravelMudra files"; declaration version 1 copied from the head body of "SYN Tourist e-visa" (WP-02 §3 D3); structural owner approval with synthetic evidence; binding from the active release; values ₹3,300, 5 to 12 calendar days; launch plan complete; launch for named Y only | The run's offering. Seeded offerings stay untouched |
| Declaration version 2 | Version 1 plus one optional document requirement "Travel itinerary" (PDF, 5 MB), as `syn_tourist_prep` declares it; structural owner approval; binding; values version for version 2 with the itinerary label | The structural update of a launched, unsuspended offering (V20 clauses 2 and 3). `documents.requirements` is an authority-bearing item, so a submitted application needs renewed travel-agent authority |
| Declaration version 3 | A draft copy of version 2, never approved | The draft discard (`cat.retire_declaration_draft`) |
| Group | `wp13-[stamp]` in Synthetica; travel start today + 30 days, return today + 40 days | Every application of the run |
| D1, D2 | Drafts for O on version 1 (applicants DEV, DIA) | D1: transition that applies at once; D2: continues on its own terms; D2 later meets the withdrawal |
| S1, S2 | Submitted for O on version 1, unpaid, unassigned (applicants SAM, SUR) | S1: transition, the travel agent accepts; S2: transition, the travel agent declines (Q-02) |
| P | Submitted for O on version 1, "Payment received" (`SYN-W13-[stamp]-P`), assigned to OP1 (applicant PIA) | Held, then continued impact item; operator work under suspension, treatment and withdrawal |
| D3 | A draft for O created after version 2 is published (applicant DIN) | New cases use the new head; submission under a suspension with "continue"; refused after withdrawal |
| E | A draft for "SYN Tourist e-visa" in the same group (applicant ELA) | Unaffected control: no item, no hold |
| Passports | `td3Lines` of a `SyntheticPassport` with surname `SYNWPTHIRTEEN`, document code P, issuing state and nationality IND, expiry at least six months after the return date, number "S" + seven digits new to the run; `passportTextPdf` or `passportImage` (`test/fixtures/documents/samples.ts`) | Intake |
| Photographs | `plainPng` at least 350 × 350 px | Intake |
| Evidence and reasons | External references `SYN-W13-[stamp]-[step]`; attestations "WP13 [stamp] …"; release manifest = the head binding id offered by SA-05t from the assessment read; reasons "WP13 [stamp] …" of at least 10 characters | Every decision |
| Fixtures (tests only) | A suspended or withdrawn offering with each treatment and both; an assessment superseded by a later head; an item on a superseded assessment carried forward; an application with an act `authorized`, `filing_unknown` or `reconciliation_exhausted`; an assigned application with an awaiting transition; an application with an outcome; a never-launched retired offering; a group whose country has no selectable offering | T items |

### 0.4 Run recipe (rerunnable)

- Run tag `wp13-[yyyymmddhhmm]`. First check: the harness can sign in SA1, SA2, OP1, OP2 and `syn-ta-2`, and can
  create and sign in Y; "SYN Tourist e-visa" admits Y after activation (TA-03).
- Baseline (step P-0, before the set-up): SA-05a rows and the count of offerings with open impact items; SA-01 group 8
  ("impact assessments with items to decide"); OP-01 view counts of OP1; TA-10 count of Y right after activation;
  TA-02 of `syn-ta-2`. Every later count check is a delta from it.
- Setup (labelled "Setup", through integrated pages): SA1 creates and activates Y (SA-06). SA1 creates O and admits it
  (WP-02 §3 D2 to D7, D9 and D10 with the values of §0.3; launch for named Y). Y creates the group and D1, D2, S1, S2
  and P on TA-09c, submits S1, S2 and P on TA-08, and creates E. SA1 records the payment of P (SA-07a) and assigns P to
  OP1 (SA-03a). Later set-up (declaration version 2, its values and publication; OP1's work on P) is in the steps of §3.
- Every harness send uses the fields of a freshly loaded page unless the step says "raw". A raw envelope is built from
  a page loaded earlier in the run and named in the run record.
- Order (§3): P-0, Setup, Part A (publication does not launch), Part B (structural update of a launched offering),
  Part C (impact decisions and transitions), Part D (the travel agent's changed terms), Part E (suspension and
  treatment, BU-27), Part F (lift), Part G (withdrawal), Part H (retirement and discard), Part X (isolation, tests,
  axe). Parts G and H cannot be undone and run last. Data of earlier runs stays and is excluded by its code and tag.
- If the recheck task has not classified the items when Part C starts, the step waits for the assessment state to
  leave "Being rechecked" (re-reading SA-05n; no fixed delay) and the run record says how long it took.
- If the lift of Part F is refused because the launch plan is not complete for version 2's head (`launch_plan_incomplete`
  or `launch_plan_not_current`), the refusal is recorded as the expected answer of A22, SA1 records a new plan version
  (Setup, SA-05i) and the lift is sent again.

### 0.5 Refusal shapes in the code at e1f6ac9 (category / code)

Every command below also answers `validation_failed` / `input_invalid` on its schema (a reason shorter than 10 or
longer than 1000 characters after trim on `_reason`; an evidence id or note out of bounds; a note with an address or a
link, `email_like` / `url_like`; an id of the wrong kind, `custom`; an enum value, `invalid_value`; a missing revision,
`invalid_type`), `not_found_or_forbidden` / `access_denied` for a caller without the policy action (an operator or a
travel agent on the staff commands; a SuperAdmin on `core.decide_transition`) or an unknown subject, and
`conflict_operation_key` / `operation_key_reused` for a reused key with other content. A support view never runs a
command (`access_denied`); its pages answer 409 `support_view_active`.

| Command | Refusals the items assert (in Core's order) |
|---|---|
| `ops.suspend_offering` | `stale_revision` / `stale_revision` (controls revision); `control_blocked` / `offering_not_launched`; `control_blocked` / `suspension_active`. No check of withdrawal or retirement: a withdrawn offering can be suspended |
| `ops.record_existing_work_treatment` | `not_found_or_forbidden` / `access_denied` (unknown treatment id, or `causeRef` that is not the cause of that treatment); `stale_revision` / `stale_revision` (the treatment is no longer the current one of its cause; this is also the answer after a lift); `control_blocked` / `suspension_not_active`; `control_blocked` / `withdrawal_treatment_widening_unavailable` (a withdrawal cause and anything other than continue → hold); `control_blocked` / `treatment_unchanged` (suspension only); field `treatment` `invalid_value` (`missing` cannot be chosen) |
| `ops.lift_suspension` | `not_found_or_forbidden` / `access_denied` (unknown suspension); `stale_revision` / `stale_revision`; `control_blocked` / `suspension_not_active`; the launch-readiness refusals of the current head in this order: `unavailable_excluded` / `synthetic_not_permitted`, `control_blocked` / `catalogue_not_published` (also retired), `control_blocked` / `provider_route_unapproved` or `launch_item_not_supported` (with blockers) or the governing code, `unavailable_parked` / `parked_custody_route_policy`, `control_blocked` / `launch_acknowledgement_mismatch`, `launch_plan_not_current`, `launch_plan_incomplete`. No check of the treatment or of a withdrawal |
| `ops.withdraw_offering` | `validation_failed` / `withdrawal_irreversible_unacknowledged`, field `acknowledgeIrreversible` code `required` (after the policy, before the revision); `stale_revision` / `stale_revision`; `conflict_duplicate` / `offering_already_withdrawn`; `control_blocked` / `offering_not_launched`; `control_blocked` / `withdrawal_permission_required` (continuation permitted without feasibility evidence); field `permitsUnfiledContinuation` `invalid_type` when no choice is sent. No check of a suspension |
| `cat.assign_impact_reviewer` | `not_found_or_forbidden` / `access_denied` (unknown assessment); `control_blocked` / `impact_item_not_current` (assessment superseded); `stale_revision` / `stale_revision`; `validation_failed` / `input_invalid`, field `superAdminId` code `not_active_superadmin` (not a SuperAdmin, not active, or no second factor) |
| `cat.decide_impact_items` | `validation_failed` / `input_invalid` (an item twice, no field); `not_found_or_forbidden` / `access_denied`; field `holdOwnerId` `required` or `not_active_superadmin`; field `evidence` `required` (`unaffected` without evidence); per item, all or nothing: `control_blocked` / `impact_item_not_current`; `stale_revision` / `stale_revision`; `control_blocked` / `application_not_open`; `control_blocked` / `transition_pending`; `control_blocked` / `impact_decision_not_allowed` (`unaffected` on an item that is not an unknown recheck gap); `control_blocked` / `continuation_unsupported`; `control_blocked` / `filing_possibly_occurred` (`continue_on_head`). A re-decision with a fresh revision is accepted again (no duplicate guard) |
| `cat.approve_transition` | `not_found_or_forbidden` / `access_denied` (item missing or of another application, before the policy); `control_blocked` / `impact_item_not_current`; `stale_revision` / `stale_revision`; `control_blocked` / `impact_decision_not_allowed` (unaffected item); `control_blocked` / `application_not_open`; `control_blocked` / `catalogue_not_published`; `control_blocked` / `declaration_unsupported`; `control_blocked` / `binding_incompatible`; `control_blocked` / `transition_evidence_missing`; `control_blocked` / `filing_possibly_occurred`; `conflict_duplicate` / `transition_pending`; field `compatibilityEvidence` `too_small` (no evidence). Accepted with no new transition after a decline or an immediate apply (Q-03) |
| `cat.request_impact_recheck` | `not_found_or_forbidden` / `access_denied`; `validation_failed` / `nothing_to_recheck` (no assessment, or the latest is superseded); `stale_revision` / `stale_revision` (concurrent update only; the command carries no expected revision) |
| `cat.retire_declaration_draft` | `not_found_or_forbidden` / `access_denied`; `control_blocked` / `declaration_not_draft` (checked before the revision, so every resend answers it); `stale_revision` / `stale_revision` |
| `cat.retire_offering` | `not_found_or_forbidden` / `access_denied`; `stale_revision` / `stale_revision`; `control_blocked` / `offering_retired`; `control_blocked` / `retire_requires_not_launched` (launched and not withdrawn, suspended or not). No check of open work |
| `core.decide_transition` | `not_found_or_forbidden` / `access_denied` (another travel agent; a transition of another application); `stale_revision` / `stale_revision` (application revision; the transition no longer awaits; for `apply`, the governing terms changed since the approval); `control_blocked` / `awaiting_formal_return` (assigned, or approved help in progress); `control_blocked` / `filing_possibly_occurred` (an act `authorized` or `filing_unknown`; not `reconciliation_exhausted`); for `apply` only `control_blocked` / `application_not_open`, `control_blocked` / `outcome_already_recorded`; field `decision` `invalid_value`, field `transitionId` `custom` |
| Asserted as effects (owned elsewhere) | New work: `offering_suspended`, `offering_withdrawn` (`create_draft` per row at intake acceptance; `intake.start_bulk` answers `offering_not_launched`); `core.submit`: `existing_work_hold`, `existing_work_treatment_missing`, `offering_withdrawn`, `transition_pending`, `catalogue_impact_unknown`, `catalogue_impact_hold`; operator work (`ops.start_work`, `ops.record_work_step`, `ops.request_packet_build`, `ops.record_readiness`), `core.authorize_external_act` and `core.release_packet`: the same launch and impact codes and `withdrawal_continuation_not_permitted`; `ops.approve_launch` on a launched offering: `conflict_duplicate` / `launch_already_current`; `ops.expand_launch_scope`: `suspension_active`, `offering_withdrawn`; catalogue and launch edits of a retired offering: `offering_retired` |

## 1. Scope

### 1.1 Pages

| Page | Host and path | Part in WP-13 |
|---|---|---|
| SA-05h Offering: Readiness and launch (WP-02 page) | 4652 `/admin/catalogue/offerings/:offeringId/launch` | Rebuilt panel 4 sections "Suspension" and "Withdrawal" (facts and links; the carried forms leave); next action for the WP-13 states; the effects table in every launch-control state |
| SA-05j Launch decision, kinds `suspend`, `treatment`, `lift`, `withdraw` (new kinds on the WP-02 page) | 4652 `/admin/catalogue/offerings/:offeringId/launch/decide/:kind` (WP-02 design §1.2) | One decision page per command (CMP-25) |
| SA-05a Offerings, SA-05g Launch overview, SA-05b Offering: Definition and values (WP-02 pages) | 4652 `/admin/catalogue`, `/admin/launch`, `/admin/catalogue/offerings/:offeringId` | Suspension, treatment, withdrawal and retirement as separate facts; SA-05b "Impact on existing work" and "Retire this offering" as facts with links (the carried recheck and retire forms leave) |
| SA-05m Impact review | 4652 `/admin/catalogue/impact` (kept, rebuilt; destination tab "Impact review", D-W02-11) | Open assessments with open items |
| SA-05n Impact assessment | 4652 `/admin/catalogue/impact/:assessmentId` (kept, rebuilt) | The assessment, its items, the reviewer form (`cat.assign_impact_reviewer`), the recheck host (`cat.request_impact_recheck`), links to SA-05p and SA-05t |
| SA-05p Decide an impact item | New GET (design names it); POST `/admin/catalogue/impact-items/:itemId/decision` stays | `cat.decide_impact_items` for one item |
| SA-05t Approve a transition | New GET (design names it); POST `/admin/applications/:applicationId/transition` stays | `cat.approve_transition` for one application |
| SA-05r Retire an offering | New GET (design names it); POST `…/offerings/:offeringId/retire` stays | `cat.retire_offering` |
| SA-05c Declaration version (WP-02 page) and SA-05x Discard a draft | 4652 `/admin/catalogue/declarations/:declarationId`; confirmation page named by the design | `cat.retire_declaration_draft` |
| TA-02, TA-03 (WP-02 pages) | 4650 `/ta/catalogue`, `/ta/catalogue/:offeringId` | The suspended, withdrawn and retired states and their words |
| TA-09c add applicants, TA-05 "Add applicants" (WP-03 pages); bulk entry (existing page until WP-04) | 4650 | BU-27: an offering that cannot be chosen, its reason and owner; earlier accepted work kept |
| TA-07 Application workspace (WP-03 page) and TA-07t Changed terms | 4650 `/ta/applications/:applicationId`; TA-07t named by the design (POST `…/transition-decision` stays) | The action panel and blockers for launch holds and impact; `core.decide_transition` |
| TA-08 Check and submit (WP-03 page) | 4650 | The submit boundary under a suspension, a withdrawal, an awaiting transition or unknown impact |
| TA-10 Notices (WP-08 page) | 4650 | Observation: the transition notice |
| OP-02 (WP-07 page), OP-01 (WP-07 page) | 4652 | The held actions and impact blockers in the action panel and readiness checklist (words, owner, no form for a held action); observation of the views |
| SA-01 (WP-06 page) | 4652 `/admin` | Observation: group 8 (impact decisions) |

Read models: Offering administration (`cat.admin_index`, `cat.admin_offering`, `cat.admin_declaration`,
`cat.admin_impact_index`, `cat.admin_assessment`, `ops.launch_overview`, `ops.launch_offering`), Offering catalogue
(`cat.selectable_offerings`, `cat.offering_display`), TA application case (`core.ta_application`), Operator case
(`core.ops_case`), SuperAdmin case (`core.admin_case`), Notices, Operation (`core.operation`).

### 1.2 Command coverage (CC §5.1: 11 WP-13 commands)

UI-PLAN §12.2 names four commands for WP-13. "Record existing-work treatment" is `ops.record_existing_work_treatment`;
"Suspend offering", "Lift suspension" and "Withdraw offering" are the three `ops.*` commands. The other seven complete
the change of an offering that SA-05 (full) and TA-07 must carry (CC §5.3; CC-06): the impact review
(`cat.assign_impact_reviewer`, `cat.decide_impact_items`, `cat.request_impact_recheck`), the per-application transition
(`cat.approve_transition`) and its travel-agent decision (`core.decide_transition`), and the ends of a lifecycle
(`cat.retire_offering`, `cat.retire_declaration_draft`). WP-02 carried their forms unchanged (WP-02 design §1.5); WP-13
gives each one host page and removes the carried entries.

| # | Command | Route id (POST path) | Host page | Items |
|---|---|---|---|---|
| 1 | `ops.suspend_offering` | `admin.launch.suspend` (`…/offerings/:offeringId/suspend`) | SA-05j kind `suspend` | A07 to A13 |
| 2 | `ops.record_existing_work_treatment` | `admin.launch.treatment` (`…/existing-work-treatment`) | SA-05j kind `treatment` (cause: the current suspension, or the withdrawal) | A14 to A20 |
| 3 | `ops.lift_suspension` | `admin.launch.lift` (`…/lift-suspension`) | SA-05j kind `lift` | A21 to A25 |
| 4 | `ops.withdraw_offering` | `admin.launch.withdraw` (`…/withdraw`) | SA-05j kind `withdraw` | A26 to A31 |
| 5 | `cat.assign_impact_reviewer` | `admin.catalogue.impact_reviewer` (`/admin/catalogue/impact/:assessmentId/reviewer`) | SA-05n | A34 |
| 6 | `cat.decide_impact_items` | `admin.catalogue.impact_decision` (`/admin/catalogue/impact-items/:itemId/decision`) | SA-05p | A35 to A37 |
| 7 | `cat.request_impact_recheck` | `admin.catalogue.recheck` (`…/offerings/:offeringId/recheck`) | SA-05n (the design MAY keep SA-05b; one host, Q-15) | A38 |
| 8 | `cat.approve_transition` | `admin.catalogue.transition` (`/admin/applications/:applicationId/transition`) | SA-05t | A41 to A46 |
| 9 | `core.decide_transition` | `ta.applications.transition_decision` (`/ta/applications/:applicationId/transition-decision`) | TA-07t | A47 to A52 |
| 10 | `cat.retire_offering` | `admin.catalogue.retire` (`…/offerings/:offeringId/retire`) | SA-05r | A53 to A55, A57 |
| 11 | `cat.retire_declaration_draft` | `admin.catalogue.declaration_retire` (`/admin/catalogue/declarations/:declarationId/retire-draft`) | SA-05x (from SA-05c) | A56 |

All of them also: A71 (shell), A72 (receipt checked against the operation), A73 (no instruction from history), A74
(no record for a refusal; lost acknowledgement), A75 (replay matrix), A76 and A77 (refusal text), A78 (LD-14 and
outages), A79 to A84 (role controls, copy, support view, storage, host pages and carried forms, isolation), A85 (LD-17
handlers and the binding's evidence limit), A86 (values kept and refusals never lost).

Commands outside WP-13 that the proofs touch only as set-up or observation: `iam.create_account`,
`iam.activate_account`, `cat.create_offering`, `cat.draft_declaration`, `cat.record_owner_approval`,
`cat.bind_declaration`, `cat.edit_baseline`, `cat.preview_declaration`, `cat.publish_declaration`,
`ops.record_launch_plan`, `ops.approve_launch`, `ops.expand_launch_scope` (WP-02); `core.create_group`,
`intake.start_individual`, `core.edit_draft`, `core.submit` (WP-03); `pay.record_service_status`, `core.assign` (WP-06);
`ops.start_work`, `ops.record_readiness` (WP-07); `dlv.acknowledge_notice` (WP-08, observation only);
`iam.start_support_view` (test only).

### 1.3 State coverage

S1 (loading) does not apply: every WP-13 page is server-rendered. S5 applies only to SA-01 and OP-01 (projections),
which WP-13 observes.

| Page | Page states | C1 validation | C2 rejected | C3 accepted | C4 unresolved | C5 stale |
|---|---|---|---|---|---|---|
| SA-05h, SA-05a, SA-05g, SA-05b | Launched; suspended with each treatment; lifted; withdrawn with each treatment; suspended and withdrawn; retired A01 to A05; facts not returned A06; outage A78 | — | — | receipts A09, A15, A23, A28 | — | — |
| SA-05j `suspend` | Form A07; not launched or already suspended (no form) A10 | A08 | A10 | A09 | A11 (5) | A10 (3) |
| SA-05j `treatment` | Suspension cause A14; withdrawal cause A17; no current cause (no form) A18 | A16 | A16, A17 | A15, A16, A17 | A19 (5) | A16 (3), A18 |
| SA-05j `lift` | Form A21; head not launchable (no form) A22 | A24 | A22, A24 | A23 | A25 (5) | A24 (3) |
| SA-05j `withdraw` | Form A26; already withdrawn or not launched (no form) A29 | A27 | A27, A29 | A28 | A30 (5) | A29 (3) |
| SA-05m | Open assessments; empty A32 | — | — | — | — | — |
| SA-05n | Rechecking; decision needed; reviewed; superseded (read only); recheck failed A33 | A34 | A34, A38 | A34, A38 | A34, A38 (fixtures) | A34 |
| SA-05p | Choices by availability A35 | A36 | A36 | A35 | A37 (5) | A36 |
| SA-05t | Form A41; not offered (unaffected, possibly filed, awaiting, already transitioned) A41, A45 | A44 | A44 | A42, A43 | A46 (5) | A44 |
| SA-05r, SA-05x | Blocked while launched A53; form A54, A56; retired or not a draft (no form) A55, A56 | A54 | A55, A56 | A54, A56 | A55 (fixture) | A55 |
| TA-07t, TA-07 panel | Awaiting, unassigned or returned A47; assigned A50; possibly filed (no form) A51 | A48 | A51 | A48, A49 | A52 (5) | A51 |
| TA-02, TA-03, TA-09c, TA-05, bulk entry | Suspended; withdrawn; retired; no offering selectable A58 to A62 | — | A60, A62 | — | — | — |
| TA-07, TA-08 | Draft or submitted under each treatment; unknown or held impact A63 to A66 | — | A63 | — | — | — |
| OP-02, OP-01 | Held actions; impact blockers; transition waiting for a return A67 to A69 | — | A67 | — | — | — |

### 1.4 Specification scenarios

| Scenario | What WP-13 shows | Items |
|---|---|---|
| V20 clause 1: "Publication/released binding does not launch a new route" | O after binding and publication is "Not launched", invisible to Y and refused for new work; a suspension or withdrawal of a not-launched O is refused; retirement is the only end of a never-launched offering | A10 (1), A29 (2), A57; §3 Part A (WP02-A38, A54 observed) |
| V20 clause 2: "Existing-case impact is explicit" | The publication of version 2 opens an assessment; every open application of O on version 1 is an item with its classification, treatment and owner; an undecided item blocks submission and readiness with its reason and owner; each decision (continue, hold, transition) and the travel agent's renewed authority are explicit; a suspension or withdrawal shows its effect per action | A02, A33, A35, A40 to A49, A63 to A68; §3 Parts B to D |
| V20 clause 3: "Supported structural update to launched unsuspended offering needs no invented second launch approval for new cases" | After version 2 is published the launch state, audience and decision are unchanged; SA-05j kind `launch` offers no form; Y's next draft (D3) is created on version 2 without any launch step | A05, A40; §3 Part B (extends WP02-A82 from values to structure) |
| UX §3.2 Withdrawn/suspended offering: stop new selection, intake and submission as applicable; explicit treatment of each existing action; missing treatment holds affected unfiled preparation, release and filing; reconciliation, original return, incidents and valid delivery continue | New work refused; drafts submit only under "continue" during a suspension and never after a withdrawal; the effects table and each case page name the treatment per action; "not recorded" holds operator work; duties continue (test) | A02, A09, A15, A28, A58 to A70 |
| UX §6.3 Launch/suspension/lift: exact scope, reason, evidence; a lift restores only approved scope | Decision pages with scope, evidence, reason and effect; the lift names the audience it restores; expansion refused while suspended | A07, A21, A23 (WP02-A80) |
| UX §6.3 Publication and impact: supported continuation, evidenced per-application transition with renewed TA authority where required, or an owned hold; identity switch needs fresh intake | SA-05p choices; SA-05t evidence and the authority answer; TA-07t; hold owner named; no control that changes country or service of an application | A35, A41 to A52, A80 |
| BS B07: one attributed SuperAdmin; payment cannot force a withdrawn service; the more restrictive treatment wins | One SuperAdmin decides each kind; no payment input; the combined effect lists both codes | A02, A12, A28 |
| BU-27: no offered service available or current eligibility changes → no invented offering or default; the affected action explains its constraint and next owner while earlier accepted work is kept | TA-03, TA-09c and the bulk entry show the reason and owner and choose no default; earlier drafts and submissions stay with their own state; a draft whose terms changed shows the blocker and its owner | A58 to A66; §3 Part E |
| UX §12 V24 (keyboard and phone) | The WP-13 decision pages and TA-07t by keyboard and at 390 px | A87 to A98 |

## 2. Acceptance checklist

WP-02 items stay WP-02's and are not repeated: the offering list (WP02-A33), the four panels (WP02-A43), the
publication decision and impact preview (WP02-A53, A60 to A62), the launch decision anatomy (WP02-A71 to A78), the
expansion (WP02-A79, A80), the effects table before WP-13 (WP02-A81) and the values publication without a second launch
approval (WP02-A82). WP-13 items extend them where the WP-13 states change what those pages show.

### 2.1 SA-05 offering administration: reading

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP13-A01 | SuperAdmin (SA1) | SA-05h of O, panel 4 "Launch and admission", in each state of §3 (launched; suspended with the treatment not recorded, "continue", "hold"; lifted; withdrawn with continuation, narrowed to hold) | Read the status facts and the sections "Suspension" and "Withdrawal". | Status facts (CMP-03) show Launch, Current audience, Suspension, Existing-work treatment and Withdrawal as separate rows in the words of §0.2: for example "Suspended: new applications paused", "Not recorded: existing work that needs a decision is held until a SuperAdmin records how it continues", "Withdrawn (cannot be undone): unfiled work is held". "Suspension" lists each suspension the read returns (state, time IST, reason) and, for the current one, the current treatment and the earlier treatments of that cause (value, current or replaced). "Withdrawal" shows the effective time and whether unfiled work may continue. No form of the four launch commands is on SA-05h: each state offers a link to its decision page (A07, A14, A21, A26) only where §1.3 says the page has a form; the carried forms, their `?done=` flashes and their test entries are gone (A83). Freshness "Read at [time] IST". | L | UX §6.3 (Offering management: "Display current launch scope and suspension independently"); PL SA-05; `contracts/catalogue.ts:287-311`; WP-02 design §2.3 panel 4 |
| WP13-A02 | SuperAdmin; test | SA-05h "What launch control allows now" (WP02-A81 table) in the states of A01 and with fixtures for every row of F1's matrix (suspended + withdrawn included) | Read the table in each state. Test: render each fixture. | Each row shows Core's effect and every contributing code in words, in Core's order: suspended → "Create a draft: Refused: new applications are paused"; "continue" → "Submit a draft: Allowed" and the operator rows Allowed; "hold" → "Held: existing work is held by the suspension"; not recorded → "Held: no treatment is recorded for existing work"; withdrawn → "Submit a draft: Refused: the service is withdrawn" and the operator rows Allowed (continuation) or "Held: the withdrawal does not let unfiled work continue"; both → every code listed. "Record the outcome" stays Allowed in every state. The lead states that the table is for a travel agent in the approved audience and an application admitted under the current launch, that "Allowed" means launch control does not stop the action, and that reconciliation, original custody and return, incidents and result delivery are not stopped by launch control. No row states a permission for a named application. | L+T | UX §3.2, §6.3 ("Existing-work treatment is explicit per applicable action"); BS B07; `effect.ts`; `test/unit/catalogue.test.ts` "existing work follows the treatment; the most restrictive control wins and every contributor is listed" |
| WP13-A03 | SuperAdmin | SA-05a, SA-05g and the SA-05b summary card, at each part of §3 | Read O's row and card. | Launch state, suspension, existing-work treatment (where the read returns it), withdrawal, retirement and open impact items are separate facts. SA-05a's "open items" for O equals Core's `openItems` (unknown, pending and held items) and links to SA-05m. A suspended offering never reads "Not launched"; a withdrawn one never reads "Suspended" or "Paused"; a retired one reads "Retired". SA-05g, which reads no treatment, does not claim one ("Existing-work treatment: on the offering's launch page"). No page reads "Active" as an overall status. | L | PL SA-05; UX §6.3; `catalogue-admin.ts:85-90, 499-505`; WP02-A33 |
| WP13-A04 | SuperAdmin | SA-05b of O, sections "Impact on existing work" and "Retire this offering", after §3 Part B | Read both. | "Impact on existing work" lists the assessments the read returns (number linked to SA-05n, cause and state in words), newest first, and the link "Open the impact review". The recheck is reached from the assessment (A38); no recheck form stays on SA-05b unless the design makes SA-05b its one host (Q-15). "Retire this offering" is a fact and a link to SA-05r ("Retiring ends this offering's catalogue life. It is possible only when the offering was never launched or is withdrawn."); no retire form on SA-05b. | L | WP-02 design §2.1 items 9 and 11, §1.5; CC-12 to CC-16 (one host page per command) |
| WP13-A05 | SuperAdmin (SA1); test | SA-05h and SA-05b action panels (CMP-01) in each state of §3; renderer test with fixtures | Read the next action. | The first applicable step, in this order, as a fact with a link: suspended and the treatment not recorded → "Existing work of this service is held: no treatment is recorded." → "Record how existing work continues" (SA-05j `treatment`), owner SuperAdmin; an assessment with decision-needed items → "Existing work needs an impact decision." → SA-05n; suspended with a treatment → "New applications are paused." with "Lift the suspension" (SA-05j `lift`) as secondary; withdrawn → "Withdrawn. No launch action applies." and, while the withdrawal lets unfiled work continue, the secondary "Hold remaining unfiled work"; retired → "Retired." and no action. After a structural publication of a launched, unsuspended offering (§3 Part B) the panel asks for no launch step: SA-05j kind `launch` has no form and states "This offering is launched for [audience]. New cases use the current published terms; no second launch approval is needed." The panel never says that an action is allowed. | L+T | UX §6.3, §12 V20 (clause 3); BS B06 (last sentence), B07; WP02-A82 |
| WP13-A06 | SuperAdmin; test | SA-05h, SA-05j receipts, SA-05r, SA-05n | Look for who suspended, lifted, withdrew, recorded a treatment, retired or decided an item, and when and why. | The page shows the facts the reads return (suspension time and reason; treatment values; withdrawal time and continuation; item applicability, classification, treatment and hold owner). Facts no read returns (the actor, evidence and reason of a lift, withdrawal, treatment or retirement; the item's decider, time, reason and evidence) show "Not shown on this page" with the link "Full audit history" to the audit search filtered on the offering, or are shown from `views.audit_subject` only as explicit recorded fields with source and time (WP-11 I-10). Nothing is reconstructed from clock order. Partly met until a read serves them (Q-09). | L+T | BS B33; WP-02 B-06; WP-11 I-10; F1 "Staff reads"; F2 "Facts no read returns" |

### 2.2 Suspend an offering (`ops.suspend_offering`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP13-A07 | SuperAdmin (SA1) | SA-05j kind `suspend` of O, launched for Y (§3 E1) | Open "Suspend new applications" from SA-05h. Read the page from the top. Select "Cancel". | CMP-25 anatomy (WP02-A71 frame). `h1` "Suspend new applications: [offering]". Scope: the offering, the current audience ("1 named travel agent: [Y]") and the launch decision it keeps. Evidence: the current effects table (A02) and "Open impact items: [n]". Effect, visible before the fields: "New selection, new intake and new drafts stop at once for every travel agent in the audience. Applications already started follow the treatment you choose: Continue: drafts can still be submitted and work goes on; Hold: submission and TravelMudra's work on them are held; Decide later: the same as Hold until a SuperAdmin records a treatment. Recording an outcome, delivering a result, reconciling a filing, returning originals and incidents are not stopped. Lifting the suspension later restores exactly this audience." No sentence says that submission always stops (today's `launch.ts:667` copy). Fields: "Existing work during the suspension" (radios `continue`, `hold`, `not_recorded`, none preselected), one evidence row (kind, reference, note; at least one required; the binding reads one row, A85), reason (10 to 1000 characters). Consequence review before the button "Suspend new applications"; "Cancel" returns to SA-05h and records nothing (controls revision delta 0). | L | UX §6.3 (Launch/suspension/lift: "exact scope, reason, evidence"); BS B07; PL SA-05; F1 headline 6; `launch.ts:290-330` |
| WP13-A08 | SuperAdmin (SA1); harness; test | SA-05j kind `suspend` (§3 E1) | (1) Send with nothing chosen or filled. (2) Choose "Decide later", fill the reason, leave the evidence empty; send. (3) Harness, each changing one value of an otherwise valid form: a reason of 1001 characters; an evidence note holding an address; an evidence reference of 201 characters; `existingWorkTreatment=missing`. (4) BFF test: the same values through the handler. | (1) C1 error summary (CMP-07): treatment, evidence, reason. (2) C1 at the evidence row; the chosen treatment and the reason stay. (3) Each refused at its field (`too_small` / `too_big`, `email_like`, `invalid_value`) with every typed value and the choice kept; no field is cut. (4) The handler sends every field whole; a value over Core's limit is refused at its field, never shortened (LD-17). Nothing is recorded in each case (controls revision delta 0; effects unchanged). | L ((1) to (3)) + T | CMP-07; LD-17; WP-02 R-02, R-03; `subjects.ts:72-91` |
| WP13-A09 | SuperAdmin (SA1); TA (Y, `syn-ta-2`); harness | SA-05j `suspend`, SA-05h, TA-02 and TA-03 of Y, `syn-ta-2`'s TA-02 (§3 E1, E2) | Suspend with "Decide later", evidence `SYN-W13-[stamp]-S1`, a reason. Read the receipt and SA-05h. Y reads TA-02 and TA-03 of O. `syn-ta-2` reads TA-02. | C3 receipt "Suspension recorded" (named: offering resource, summary `suspensionId` and `treatment`); Recorded: "Existing work: Not recorded (held)" from the summary; Current: the status facts and the effects table of A02 (create Refused, submit and operator rows Held `existing_work_treatment_missing`, record the outcome Allowed); "Recorded once. Sending the same form again does not repeat it."; no accepted time. Y: TA-02 lists O as "Not available for new applications" and TA-03 shows the reason of A58; `syn-ta-2`: O is absent (TA-02 delta 0). The audience is unchanged. | L | BS B07; UX §3.2; WP02-A24; `launch.ts:328` |
| WP13-A10 | SuperAdmin (SA1, SA2); harness; test | Suspension refusals | (1) Harness, in §3 Part A before the launch: a suspension of O with a fresh controls revision. (2) Harness, after A09: a second suspension of O with a fresh revision from a freshly loaded SA-05h. (3) SA2 opens SA-05j `suspend` before A09; SA1 suspends; SA2 sends. (4) Read SA-05j `suspend` while O is suspended and after the withdrawal. | (1) `offering_not_launched`: "This offering is not launched, so there are no new applications to pause."; nothing recorded. (2) `suspension_active`: "This offering is already suspended." with the link to the current suspension; nothing recorded. (3) C5 (CMP-14): the current suspension facts beside SA2's unsent choice, evidence and reason, which stay; `stale_revision`; nothing recorded. (4) While suspended: no form, the fact "Already suspended since [time] IST" and links to the treatment and the lift. After the withdrawal: the form shows (Core accepts a suspension of a withdrawn offering) with the Effect line "The offering is withdrawn: new work is already refused; a suspension adds its treatment to existing work and the more restrictive effect applies." (test). Nothing is recorded by any refusal (controls revision delta 0). | L ((1) to (3)) + T ((4) withdrawn) | BS B07 ("Where withdrawal and suspension conflict, enforce the more restrictive"); F1 §1 |
| WP13-A11 | SuperAdmin (SA1); harness | Suspension, the Nth time | Replay terms 1 to 5 on A09. Term 2 changes the reason. Term 3: Back after the receipt; harness: a new-key send from the reloaded page. Term 4: A08 (2), then A09. | (1) The original receipt; one suspension (test `launch-control.test.ts` "suspension: Nth retry replays without a second suspension"). (2) Refused as a used form; nothing recorded. (3) Back reloads SA-05j with no form (already suspended); the new-key send is refused `suspension_active`. (4) Recorded once. (5) C4; no new suspension is offered there. | L+T | PL §7 K-STD; BS B35 |
| WP13-A12 | SuperAdmin; test | Suspension while the audit projection is behind (fixture); dual control | Suspend. | Accepted: one SuperAdmin suspends in an emergency while the audit record is behind (`privilegedElevation: false`); the page shows no "second SuperAdmin" step and no audit-state blocker for any of the four launch commands. | T | BS B07, B33 ("emergency containment remains available"); UX §12 V21; `launch.ts:296` |
| WP13-A13 | SuperAdmin; test | Suspend form with the treatment "Continue" | Render the Effect and the review. | The review repeats the chosen treatment and its effect in words before the button ("Drafts of this service can still be submitted. TravelMudra's work on existing applications goes on."). The receipt's recorded line reads "Existing work: Continues". No text on any WP-13 page says that a suspension stops submission whatever the treatment. | T | UX §3.2 ("Stop new selection/intake/submission as applicable"); `test/core/launch.test.ts:70` |

### 2.3 Record how existing work continues (`ops.record_existing_work_treatment`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP13-A14 | SuperAdmin (SA1) | SA-05j kind `treatment` of O with the suspension of A09 (§3 E4) | Open "Record how existing work continues" from SA-05h's action panel. Read. Select "Cancel". | `h1` "Existing work during the suspension: [offering]". Scope: the cause ("Suspension since [time] IST") and the current treatment ("Not recorded"). Evidence: the effects table of A02 for existing work. Effect per choice, visible: "Continue: drafts can be submitted; TravelMudra's preparation, readiness, filing authorization and packet release go on." / "Hold: submission and that work are held; recording outcomes, delivery, reconciliation, originals and incidents go on." The line "This treatment applies to every existing application of this service. A treatment for one application alone is not available." (A20). Fields: radios "Continue" and "Hold" (none preselected; "Decide later" is not offered: Core cannot record it again); one optional evidence row; reason. Hidden `causeRef` and `expectedTreatmentId` from the read. "Cancel" records nothing. | L | UX §6.3 ("Existing-work treatment is explicit per applicable action"); BS B07; PL §7 (Record existing-work treatment); `launch.ts:332-379` |
| WP13-A15 | SuperAdmin (SA1); operator (OP1); TA (Y) | SA-05j `treatment`, SA-05h; OP-02 of P; TA-07 and TA-08 of D3 (§3 E4, E5) | Record "Continue" with a reason. Read SA-05h. OP1 reads OP-02 of P. Y reads TA-07 and TA-08 of D3 and submits D3. | C3 receipt "Existing-work treatment recorded" (named: offering resource, summary `treatmentId`; the value read by that id from the treatments list): Recorded "Existing work: Continues"; Current: the effects table (create Refused; submit and operator rows Allowed). OP-02 of P: the held step of A67 gives way to the ordinary step. D3: TA-08 offers the submission; the submission is accepted during the suspension (TA-07 progress "With TravelMudra"). New work stays refused (A60). | L | BS B07; UX §3.2; `test/core/launch.test.ts:70` "a continuing treatment lets existing work go on" |
| WP13-A16 | SuperAdmin (SA1, SA2); harness | SA-05j `treatment` (§3 E6) | (1) Record "Hold" (continue → hold). Read SA-05h. (2) From a freshly loaded page choose "Hold" again and send. (3) SA2 opens the page before (1); SA1 records (1); SA2 sends "Continue" (raw stale `expectedTreatmentId`). (4) Send with no choice. | (1) Receipt; Current effects: submit and operator rows "Held: existing work is held by the suspension" (`existing_work_hold`). (2) The form does not preselect the current value; the send is refused `treatment_unchanged`: "Existing work already follows Hold."; nothing recorded. (3) C5: the current treatment beside SA2's unsent choice and reason; `stale_revision`; nothing recorded. (4) C1 at the choice. Nothing is recorded by a refusal (treatment rows delta 0; controls revision delta 0). | L | F1 §2; CMP-14 |
| WP13-A17 | SuperAdmin (SA1); harness; test | SA-05j `treatment` with the withdrawal as cause (§3 G2, G3) | (1) After a withdrawal that lets unfiled work continue, open "Hold remaining unfiled work". (2) Record "Hold". (3) Open the page again. Harness: "Continue" with the current `expectedTreatmentId` (raw). | (1) Scope "Withdrawal since [time] IST; unfiled work may continue". Only "Hold" is offered, with "A withdrawal's treatment can be narrowed to Hold. It can never be widened again." (2) Receipt; Current: the operator rows "Held: the withdrawal does not let unfiled work continue". (3) No form; the fact "Unfiled work is held. This cannot be widened."; the harness send is refused `withdrawal_treatment_widening_unavailable`: "A withdrawal's treatment cannot be widened."; nothing recorded. | L | BS B07 ("Already-submitted unfiled work continues only if feasible and the withdrawal expressly permits it"); `test/integration/launch-control.test.ts` "with permission: unfiled work continues; the treatment can be narrowed but never widened" |
| WP13-A18 | SuperAdmin; test | SA-05j `treatment` after the lift; a saved envelope | Open the page after A23. Send the envelope saved in A16. | No form: "No suspension is active, so no treatment can be recorded for it." The saved envelope is refused `stale_revision` (the lift ends the suspension's current treatment), shown as "The treatment changed or the suspension ended since this page was loaded." with the current facts; never "Nothing to do". Nothing recorded. | T | F1 §2 (step 5 unreachable after a lift) |
| WP13-A19 | SuperAdmin (SA1); harness | Treatment, the Nth time | Replay terms 1 to 5 on A15. Term 2 changes the reason. Term 3: Back; harness: a new-key "Continue" from the reloaded page. | (1) The original receipt; one treatment row. (2) Refused as a used form. (3) Back reloads with no preselection; the new-key send is refused `treatment_unchanged`. (4) Recorded once. (5) C4. | L+T | PL §7 K-STD; BS B35 |
| WP13-A20 | SuperAdmin | SA-05j `suspend`, `treatment`, `withdraw`; SA-05h | Look for a per-application treatment, a list of affected applications or a count. | No control records a treatment for one application or a class (Core has one treatment per cause). No page lists or counts the applications a suspension or withdrawal holds: no read returns them; the page says "The applications this affects are not listed here. Each application shows its held steps." Partly met against PL §7 "K-BATCH, per application" (Q-07, Q-08). | L | PL §7; UX §6.3; F1 headline 1; Q-07, Q-08 |

### 2.4 Lift a suspension (`ops.lift_suspension`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP13-A21 | SuperAdmin (SA1) | SA-05j kind `lift` of O (§3 F1) | Open "Lift the suspension". Read. Select "Cancel". | `h1` "Lift the suspension: [offering]". Scope: the suspension (time, reason) and the audience it restores, by name and count, from the launch decision recorded at the suspension ("1 named travel agent: [Y]"; never wider). Evidence: the current launch requirements of the head, as SA-05h panel 3 shows them, with "The structure may have changed during the suspension: the current published terms are checked again." Effect: "New applications open again for this audience only. The treatment recorded for the suspension ends. Expanding the audience is a separate decision." Fields: the hidden current plan, one acknowledgement checkbox per action that stays unavailable for live cases (as WP02-A71, none prechecked), one evidence row (required), reason. As WP-02 B-01, the page shows the exact head version and plan version under review and posts every revision the form carries; Core checks no reviewed head on a lift (P-06 class, no page-side check). Consequence review; button "Lift the suspension". | L | UX §6.3 ("A lift restores only approved scope"); BS B07; `launch.ts:381-428` |
| WP13-A22 | SuperAdmin; test | SA-05j `lift` when the current head is not launchable (fixtures: plan incomplete or not current for a new head; a launch-required item unsupported; a binding not supported) | Render. Send a saved envelope. | No form; the blocker in the §11.3 form with its owner and link (plan → SA-05i; values or declaration → SA-05b): "Lifting is unavailable until the launch plan is complete for the current published terms. Owner: SuperAdmin." The saved envelope is refused with Core's code (`launch_plan_incomplete`, `launch_plan_not_current`, `launch_item_not_supported`, the governing code) in words; nothing recorded. A treatment that is not recorded does not block the lift (Core does not check it). | T (L in §3 F1 if it occurs) | BS B07, B32; G-05; `readiness.ts:181-207` |
| WP13-A23 | SuperAdmin (SA1); TA (Y, `syn-ta-2`) | SA-05j `lift`, SA-05h; TA-02 and TA-03 (§3 F2) | Lift with every acknowledgement, evidence `SYN-W13-[stamp]-L`, a reason. Read. Y reads TA-02 and TA-03 of O; `syn-ta-2` reads TA-02. | C3 receipt "Suspension lifted" (named: summary `suspensionId` and `restoredLaunchId`); Recorded "Restored the launch decision of [time]: 1 named travel agent"; Current: launch state Launched, suspension none, the effects table all Allowed. Y: O "Available for new applications". `syn-ta-2`: O still absent (delta 0). SA-05j `treatment` has no form (A18). | L | BS B07 ("Lifting restores only previously approved scope"); `test/integration/launch-control.test.ts` "lifting restores exactly the approved audience, never wider" |
| WP13-A24 | SuperAdmin (SA1, SA2); harness | Lift refusals (§3 F1, F2) | (1) Send without the acknowledgements. (2) Harness after A23: a second lift with a fresh revision. (3) SA2 sends from a page opened before A23. | (1) `launch_acknowledgement_mismatch`: each unacknowledged action named at its checkbox; the evidence and reason stay; the checkboxes stay unchecked; nothing recorded. (2) `suspension_not_active`: "No suspension is active."; nothing recorded. (3) C5 with the current state; `stale_revision`; nothing recorded. Controls revision delta 0 in each case. | L | F1 §3 |
| WP13-A25 | SuperAdmin (SA1); harness | Lift, the Nth time | Replay terms 1 to 5 on A23. Term 3: Back; the page has no form. | (1) The original receipt; one lift. (2) Refused as a used form. (3) No form ("No suspension is active"). (4) A24 (1), then A23: recorded once. (5) C4. | L+T | PL §7 K-STD; BS B35 |

### 2.5 Withdraw an offering (`ops.withdraw_offering`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP13-A26 | SuperAdmin (SA1) | SA-05j kind `withdraw` of O (§3 G1) | Open "Withdraw this offering". Read. Select "Cancel". | `h1` "Withdraw this offering: [offering]". Lead (CMP-10 style, before the fields): "Withdrawing cannot be undone. No relaunch exists." Scope: the offering, the audience, the current suspension and treatment if any. Effect, visible: "New selection, intake and drafts stop for every travel agent. Drafts can never be submitted. Submitted applications that are not filed: they continue only if you permit it here with evidence that continuing is feasible; otherwise they are held. Filed work, outcomes, result delivery, reconciliation, originals and incidents go on. A payment never makes a withdrawn service available. Retiring the offering becomes possible after the withdrawal." Fields: "Unfiled submitted work" (radios "Let it continue" / "Hold it", none preselected); "Evidence that continuing is feasible" (one row; required only for "Let it continue"); one evidence row for the withdrawal (required); reason; the checkbox "I understand that withdrawing cannot be undone." (never prechecked). Consequence review; destructive button "Withdraw the offering". "Cancel" records nothing. | L | UX §3.2, §6.3; BS B07; `launch.ts:430-476` (comment "Terminal: no relaunch exists in this build") |
| WP13-A27 | SuperAdmin (SA1); harness | SA-05j `withdraw` (§3 G1) | (1) Send with nothing chosen. (2) Choose "Let it continue", fill the withdrawal evidence and the reason, leave the feasibility evidence empty, tick the checkbox; send. (3) Fill the feasibility evidence, leave the checkbox unticked; send. | (1) C1: continuation choice, evidence, reason, acknowledgement. (2) `withdrawal_permission_required` at the feasibility row: "Letting unfiled work continue needs evidence that it is feasible."; the choice, evidence and reason stay; the checkbox is unticked again. (3) `withdrawal_irreversible_unacknowledged` at the checkbox: "Confirm that withdrawing cannot be undone."; the other values stay. Nothing recorded (controls revision delta 0; O still selectable for Y). | L | F1 §4; WP-09 G-07 (confirmations stay unchecked) |
| WP13-A28 | SuperAdmin (SA1); TA (Y); operator (OP1) | SA-05j `withdraw`, SA-05h, SA-05j `launch` and `expand`; TA-02, TA-03, TA-07 and TA-08 of D2; OP-02 of P (§3 G1) | Withdraw with "Let it continue", feasibility evidence `SYN-W13-[stamp]-F`, evidence `SYN-W13-[stamp]-W`, the acknowledgement, a reason. Read the pages. | C3 receipt "Withdrawal recorded" (named: summary `withdrawalId` and `treatment`); Recorded "Unfiled work: may continue"; Current: Withdrawal "Withdrawn (cannot be undone)", the effects table (create and submit Refused `offering_withdrawn`; operator rows Allowed; record the outcome Allowed). SA-05j `launch` and `expand`: no form, "This offering is withdrawn. Withdrawing cannot be undone." (Core: `launch_already_current`, `offering_withdrawn`). Y: TA-03 the withdrawn reason (A59); D2's TA-08 boundary of A63. OP-02 of P: ordinary work continues. | L | BS B07; UX §3.2; `test/integration/launch-control.test.ts` "with permission: unfiled work continues; …" |
| WP13-A29 | SuperAdmin (SA1, SA2); harness; test | Withdrawal refusals | (1) Harness after A28: a second withdrawal with a fresh revision. (2) Harness in §3 Part A, before the launch: a withdrawal of O with the acknowledgement and evidence. (3) SA2 sends from a page opened before A28. (4) Read SA-05j `withdraw` after A28. | (1) `conflict_duplicate` / `offering_already_withdrawn`: "This offering is already withdrawn." with a link to SA-05h; nothing recorded. (2) `offering_not_launched`: "A withdrawal applies to a launched offering. An offering that was never launched can be retired." with a link to SA-05r; nothing recorded. (3) C5; `stale_revision`; nothing recorded. (4) No form; the withdrawal facts. | L+T | F1 §4 |
| WP13-A30 | SuperAdmin (SA1); harness | Withdrawal, the Nth time | Replay terms 1 to 5 on A28. Term 2 changes the reason. Term 3: Back; no form. | (1) The original receipt; one withdrawal. (2) Refused as a used form. (3) No form. (4) A27 (2), then A28: recorded once. (5) C4. | L+T | PL §7 K-STD; BS B35; F1 §4 |
| WP13-A31 | Operator (OP1); TA (Y); test | OP-02 of P and TA-07 of P after the narrowing of A17 (§3 G3); fixture: a withdrawal without continuation | Read. Test: withdraw without continuation; read D and submitted fixtures. | OP-02 of P: the readiness, filing and packet steps show "Held: the withdrawal of this service does not let unfiled work continue. Owner: SuperAdmin." and no form for a held step (A67); recording an outcome stays offered where Core offers it. TA-07 of P: the hold sentence of A64. Test: submitted unfiled work held, drafts refused, payment never an input (`launch-control.test.ts` "without permission: submitted unfiled work is held, drafts cannot be submitted, and payment is never an input"). | L+T | BS B07; UX §3.2 |

### 2.6 Impact review: assessments, reviewer, item decisions, recheck

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP13-A32 | SuperAdmin (SA1) | SA-05m Impact review (destination tab "Impact review") before and after §3 Part B; with no open assessment (fixture) | Read. | One row per open assessment the read returns (states `rechecking` and `review_required`): offering title (link to SA-05b), assessment number (link to SA-05n), cause in words ("Business values published", "Structure published", "Release registered"), state, "[n] items need a decision" (Core's `open_items`: not known, decision needed or held), accountable reviewer or "No reviewer assigned", "The last recheck failed" when Core says so. The lead says that reviewed and replaced assessments are reached from their offering (SA-05b). Empty: "No change of an offering needs a decision now." SA-01 group 8 (WP-06) and this list agree for O (delta +1 after Part B, back to the baseline after Part C). | L+T | UX §6.2 ("launch/impact decisions"), §6.3 (Publication and impact); `contracts/catalogue.ts:256-262`; WP-06 design §2.1 group 8 |
| WP13-A33 | SuperAdmin (SA1); test | SA-05n of O's version-2 assessment at §3 B4, C1, C9; fixtures: superseded; recheck failed; 5000 items | Read the page from the top. | Header: offering, "Assessment [no.]: Structure published" with the before and after versions the read returns (declaration and values version numbers through the offering read, never raw ids), the continuation policy recorded with the publication ("None recorded: each application needs a decision" or its values), the engineering statement state ("Not applicable: the product owner approved this structure", "Supplied", "Missing") and, when supplied, each statement change with its compatibility and business impact. State in words; "Being rechecked" with "Decisions show when the recheck finishes" and no decision links while rechecking. Items table (CMP-06), one row per current item: application reference (link to the SuperAdmin case page), lifecycle ("Draft", "Submitted"), applicability, classification in words (A77), treatment, hold owner by name; not-current items in a separate disclosure "Earlier rows of this assessment". The table states that applicant and travel-agent names are on the case pages (no read returns them here, Q-10). Actions per row by Core's facts: "Decide" (SA-05p) for an item that is not a current transition; "Approve a transition" (SA-05t) unless the item is `unaffected`, the application is not open or the item's treatment is `transition` (A45). Superseded: read only with "Replaced by assessment [no.]". Recheck failed: "The last recheck failed. The items it could not classify stay Not known yet." with the recheck action. The 5000-row fixture says that the list stops at its limit. | L+T | BS B06 ("Unresolved impact prevents affected filing readiness"); UX §6.3; `contracts/catalogue.ts:263-280`; F2 "Reads" |
| WP13-A34 | SuperAdmin (SA1, SA2); harness; test | SA-05n reviewer form (§3 C2) | (1) Read the form. (2) Choose SA2, give a reason; send. (3) Harness: `superAdminId` of OP1; of a SuperAdmin without a second factor (fixture). (4) SA2 sends from a tab opened before (2). (5) Test: a superseded assessment. (6) Replay terms 1 to 5 on (2). | (1) "Accountable reviewer" (radios or a select of active SuperAdmins with a second factor from the accounts read; none preselected), reason; Effect "The reviewer is named on this assessment. Holds that a later recheck records are owned by this reviewer while active. Items already held keep their owner." (2) C3 receipt "Accountable reviewer assigned" (named: offering resource, summary `assessmentId` only); Current: reviewer SA2. (3) Refused at the field `not_active_superadmin`: "Choose an active SuperAdmin with a second factor."; nothing recorded. (4) C5 with the current reviewer; `stale_revision`; nothing recorded. (5) No form; a saved envelope refused `impact_item_not_current`: "This assessment was replaced by a later change." (6) (1) original receipt; (2) used form; (3) Back: the same reviewer again with a fresh revision is accepted again (Core has no duplicate guard; the page shows the current reviewer before the form); (4) recorded once; (5) C4. | L ((1) to (4)) + T | `impact.ts:163-187`; F2 §1 |
| WP13-A35 | SuperAdmin (SA1) | SA-05p for the items of D2 and P (§3 C3, C4, C8) | Open "Decide" for D2. Read. Decide "Continue on its own terms" with a reason. Open "Decide" for P; decide "Hold" with owner SA2. Later (C8) decide P "Continue on its own terms". Read SA-05n, OP-02 of P, TA-07 of D2. | `h1` "Decide the effect of a change: Application [reference]". Scope: the application (reference, lifecycle), the change (assessment, before and after versions) and the item's classification. Choices (radios, none preselected), each with its effect and shown only where Core's facts allow it, otherwise listed with the reason it is unavailable: "Not affected" (only for an item Not known yet because the recheck could not decide; evidence required); "Continues on its own terms" (the application keeps the terms it was submitted or drafted under; available while those terms are still supported); "Continues on the current published terms" (only when the change is business values only or the engineering statement says the change is compatible; never when a filing may have happened); "Hold" (owner: one active SuperAdmin with a second factor, chosen; "The application's submission, readiness, filing and packet release stay blocked until someone decides again"). "Move to the current terms" is a link to SA-05t, not a choice here. One evidence row (required for "Not affected"); reason. C3 receipt "Impact decision recorded" (named: summary `decided` = 1); Current: the item row. D2: TA-07 submit no longer blocked by the change (other blockers as Core reports). P after "Hold": OP-02 readiness row "Not met: held after a change of this service. Owner: [SA2]." After "Continue": the row is met. | L | UX §6.3 ("supported continuation … or an owned hold"); BS B06; `impact.ts:85-160`; F2 §2 |
| WP13-A36 | SuperAdmin (SA1, SA2); harness; test | Item decision refusals | (1) "Hold" with no owner. (2) "Not affected" with no evidence (harness: the choice is not offered for this item). (3) Harness: "Continues on the current published terms" for S2 (a structural change, no statement). (4) SA2 decides from a tab opened before SA1's decision of the same item. (5) Test: an item of a superseded assessment; an application with an outcome or completed; an item whose transition awaits the travel agent; `continue_on_head` with an act `authorized`, `filing_unknown` or `reconciliation_exhausted`; `unaffected` on an affected item. | (1) C1 at the owner: "Choose who owns the hold." (2) Refused at the evidence: "A decision that the change does not affect this application needs evidence."; with the item not unknown: `impact_decision_not_allowed`. (3) `continuation_unsupported`: "This application cannot continue on the current published terms without a transition: the change is to the structure." (4) C5: the current item state beside SA2's unsent choice and reason; `stale_revision`. (5) `impact_item_not_current` "This change was replaced by a later one. Decide on the current assessment."; `application_not_open`; `transition_pending` "The travel agent has not answered the changed terms yet."; `filing_possibly_occurred` "A filing may have happened. Work that may have been filed never moves to other terms."; `impact_decision_not_allowed`. The values and the choice stay after each refusal. Nothing is recorded (item revision delta 0; the governing terms unchanged). | L ((1) to (4)) + T | F2 §2; `test/integration/catalogue-impact.test.ts` "work that may have been filed never moves to another tuple: continue on head and transition are refused, hold and continue current are allowed"; "a stale item revision refuses the whole batch" |
| WP13-A37 | SuperAdmin (SA1); harness | Item decision, the Nth time | Replay terms 1 to 5 on the D2 decision. Term 3: Back; harness: the same decision with a new key from the reloaded page. | (1) The original receipt; one decision fact. (2) Used form; nothing recorded. (3) Back reloads SA-05p with the current item ("Continues on its own terms", decided); the new-key send is accepted again (Core has no duplicate guard; a re-decision is a new fact). The page shows the current decision before the choices and claims no duplicate protection. (4) A36 (1), then the corrected send: recorded once. (5) C4. | L+T | PL §7 K-STD; BS B35; WP-09 G-03 |
| WP13-A38 | SuperAdmin (SA1, SA2); harness; test | The recheck on SA-05n (§3 C9) | Read "Recheck the open applications". Request it with a reason. Read the state until it leaves "Being rechecked". SA2 requests one from a page opened before. Test: an offering with no assessment, or whose latest assessment is superseded; a rerun of the task. | Effect, visible: "TravelMudra classifies every open application of this offering again. Decisions already recorded stay. Items it cannot decide stay Not known yet and block submission and readiness." C3 receipt "Recheck requested" (named: summary `assessmentId` and `generation`); Current: state "Being rechecked", then the state the read returns. Every decided item keeps its decision (item rows unchanged except the undecided ones). SA2's request is accepted too (the command carries no revision; a second generation, no item duplicated); the page shows the current state and generation before the button. Test: `nothing_to_recheck` → no recheck action on the page and the saved envelope refused "There is no open change to recheck."; a rerun creates no second item, reduction or notice (`test/integration/catalogue-impact.test.ts` "a requested recheck creates no second item, reduction or notice"). | L+T | BS B06; F2 §4 |
| WP13-A39 | SuperAdmin; test | An item decided on an assessment that a later head change superseded and that the recheck carried forward (fixture) | Open SA-05a, SA-05m, SA-05b and the superseded assessment. | SA-05a's open-items count includes the carried hold; SA-05b lists the superseded assessment and SA-05n of it lists the item read only, with "Replaced by assessment [no.]: decide this application there" when the current assessment holds an item for it, or the boundary "This held application is on a replaced assessment. Deciding it is unavailable until a recheck classifies it again. Owner: SuperAdmin." with the recheck action. No count claims items that no page can reach (Q-11). | T | F2 "Other findings"; `impact-recheck.ts:73-84` |
| WP13-A40 | Operator (OP1); TA (Y); test | OP-02 of P; TA-07, TA-09t and TA-08 of D1, D2, S1, S2 and D3 (§3 B5) | Read the blockers right after version 2 is published, before any decision. | Each application on version 1 shows the change as a blocker of the actions Core blocks (submit; readiness; filing authorization; packet release), never as a refusal of the application: TA "Submitting waits until TravelMudra decides how a change to this service applies to this application. Owner: TravelMudra. Your draft is kept." (`catalogue_impact_unknown`); staff "Not met: the effect of a change to this service is not decided. Owner: SuperAdmin." D3 (created on version 2) and E show no such blocker. TA-09t of D1 and D2 still offers editing where Core's `correct` allows it. No page invents an owner or a date. | L+T | BU-27 ("current eligibility changes"); BS B06; `controls.ts` stage 11 |

### 2.7 Approve a transition (`cat.approve_transition`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP13-A41 | SuperAdmin (SA1) | SA-05t for D1 (draft) and S1 (submitted) (§3 C5, C6) | Open "Approve a transition" from the item row. Read. Select "Cancel". | `h1` "Move an application to the current terms: Application [reference]". Scope: one application only ("A transition is decided per application, never for several at once."), its lifecycle, the versions before and after from the assessment read. Evidence: the engineering statement's change for this offering when supplied; otherwise "Engineering compatibility evidence: the binding of the current published terms under the active release ([version label])", offered as the evidence choice from the read (`after_binding_id`), with the alternative of another release-manifest reference; the page explains that a typed external reference does not count. Effect: "A draft moves at once. A submitted application whose authority-bearing terms change (documents, eligibility, controls, price, outcomes) waits for the travel agent's renewed authority; until the travel agent answers, its submission, readiness, filing and packet release are blocked. An application assigned to an operator is returned to the travel agent by its operator first. The country, the service and the quote do not change." (Core decides whether authority is needed; the page states the rule, not the result.) Fields: the evidence row, reason. "Cancel" records nothing. Not offered (no link on SA-05n, no form here) for an unaffected item, a closed application, an awaiting transition or an item already moved (A45); for a possibly filed application the page shows "A filing may have happened. Work that may have been filed never moves to other terms." and no form. | L | UX §6.3 ("evidenced compatible per-application structural transition with renewed TA authority where required"); BS B06; `impact.ts:212-261`; F2 §3 |
| WP13-A42 | SuperAdmin (SA1); TA (Y) | SA-05t, SA-05n; TA-07 and TA-09t of D1 (§3 C5) | Approve D1 with the offered binding evidence and a reason. Read. Y reads D1. | C3 receipt "Transition approved" (named: application resource, summary `transitionId` and `taAuthorityRequired`); Recorded "Renewed travel agent authority needed: No. The application moved to the current terms."; Current: the item "Moving to the current terms" and the application's governing version (from the SuperAdmin case read, if it returns it; otherwise "Current terms: not shown on this page"). D1 on TA-09t shows the documents of version 2 (the optional "Travel itinerary"); its submit blocker of A40 is gone. No notice to Y (TA-10 delta 0). | L | F2 domain model (drafts transition at once) |
| WP13-A43 | SuperAdmin (SA1); TA (Y) | SA-05t; TA-07 and TA-10 of Y for S1 and S2 (§3 C6, C7) | Approve S1, then S2. Read. Y reads TA-10 and TA-07 of S1. | Receipts "Transition approved" with Recorded "Renewed travel agent authority needed: Yes. The application keeps its current terms until the travel agent answers."; Current: "Waiting for the travel agent's renewed authority". TA-10: + 2 notices that need acknowledgement (one per application). TA-07 of S1: the action panel of A47. SA-05n: S1 and S2 items "Moving to the current terms"; their rows offer no second approval (A45). | L | `catalogue-writers.ts:118-155`; BS B06 |
| WP13-A44 | SuperAdmin (SA1, SA2); harness; test | Transition refusals | (1) Send with no evidence. (2) Harness: an external reference "SYN-W13-[stamp]-X" as the only evidence. (3) Harness: a second approval of S1 while it awaits (fresh revision). (4) SA2 approves from a tab opened before SA1 decided the item. (5) Test: an unaffected item; a closed application; no head, an unsupported head declaration or binding; a superseded item; an act `authorized`, `filing_unknown` or `reconciliation_exhausted`; an item of another application in the path (binding refusal before the policy). | (1) C1 at the evidence. (2) `transition_evidence_missing`: "This needs engineering compatibility evidence: the binding of the current terms under the active release, or the release's manifest." with the evidence choice kept; nothing recorded. (3) `conflict_duplicate` / `transition_pending`: "This application already waits for the travel agent's answer."; nothing recorded. (4) C5; `stale_revision`. (5) `impact_decision_not_allowed`; `application_not_open`; `catalogue_not_published`, `declaration_unsupported`, `binding_incompatible`; `impact_item_not_current`; `filing_possibly_occurred`; the uniform not-found answer. Nothing is recorded in each case (no transition opened; item revision delta 0; TA-10 delta 0). | L ((1) to (4)) + T | F2 §3; `test/integration/catalogue-impact.test.ts` "without engineering compatibility evidence a transition is refused"; "a release manifest that names neither the target binding nor a registered release supporting it is refused; the running release is accepted" |
| WP13-A45 | SuperAdmin; harness; test | SA-05n and SA-05t after D1 moved (immediate) and after Y declined S2 (§3 D3) | Read the rows of D1 and S2. Open SA-05t of each by its address. Harness: a second approval of S2 with a fresh revision (raw). | No row and no page offers a second approval for an item whose treatment is "Moving to the current terms" (the page cannot tell a declined transition from an applied one: no read returns the transition state). SA-05t shows "A transition was already approved for this application. Its result is on the application." and no form. The raw send is accepted by Core and opens no new transition (Q-03); the run record reads "Unmet: waits for the Core fix of Q-03" and the receipt shows only Current facts, never "Transition approved" for that send (the summary returns the earlier transition id; A72). S2's item reads as Core reports it, and SA-05n states for every "Moving" item "If the travel agent declined, the application stays blocked until a SuperAdmin decides again (Hold or Continue on its own terms)." | L+T | F2 §3 "Business duplicate"; Q-02, Q-03 |
| WP13-A46 | SuperAdmin (SA1); harness | Transition, the Nth time | Replay terms 1 to 5 on A42. Term 3: Back; the page has no form (A45). | (1) The original receipt; one transition. (2) Used form; nothing recorded. (3) No form. (4) A44 (1), then A42: recorded once. (5) C4. | L+T | PL §7 K-STD; BS B35 |

### 2.8 The travel agent's changed terms (`core.decide_transition`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP13-A47 | TA (Y) | TA-07 and TA-07t of S1 (submitted, unassigned, transition awaiting) (§3 D1) | Read TA-07's action panel. Open "Decide on the changed terms". Read. Select "Cancel". | TA-07 action panel: owner "You"; "TravelMudra changed this service after you submitted. Decide whether this application moves to the current terms."; action "Decide on the changed terms" → TA-07t. TA-07t `h1` "Changed terms: [applicant] · Application [reference]". What changed: the read returns no difference (`transition` is an id only), so the page says "The service's requirements changed after you submitted this application." and links to the current service details (TA-03) labelled "The current published details of the service. The terms this application would move to were approved by TravelMudra; if the service changed again since, TravelMudra decides again." (partly met, Q-04). The quote as a current fact: "Your quote: [₹], fixed at submission." (from the case read; the page predicts no price change). Choices (radios, none preselected), each with its effect: "Move to the current terms: the application then follows the current requirements and shows anything that is missing." / "Keep the current terms: the application does not move. Its submission, readiness and filing stay blocked until TravelMudra decides again; TravelMudra may hold it or let it continue on its current terms." Button "Send my answer"; "Cancel" records nothing. No "withdraw" choice here (withdrawal is its own request, WP-17). The notice of A43 links to TA-07t. | L | UX §6.3 ("renewed TA authority where required"); BS B06, B17; `contracts/core.ts:272`; F2 §7; Q-04 |
| WP13-A48 | TA (Y); SuperAdmin (SA1) | TA-07t, TA-07, TA-08 of S1; SA-05n (§3 D2) | Choose "Move to the current terms"; send. Read. | C3 receipt "Your answer on the changed terms is recorded." (the command is established by the summary `transitionId`; the summary does not say which answer, so the receipt names no answer); Current: "Changed terms: none waiting"; the next step and owner from Core's pending answer; the blockers of TA-08 as Core reports them (none from the change). No accepted time. The polite region announces it. SA-05n: S1's item as Core reports it. | L | F2 §7; A72; P-10 b |
| WP13-A49 | TA (Y); SuperAdmin (SA1, SA2) | TA-07t, TA-07, TA-08 of S2; SA-05m, SA-05n, SA-01 (§3 D3) | Choose "Keep the current terms"; send. Read the TA pages. SA1 reads SA-05m, SA-05n and SA-01. | The neutral receipt of A48; Current: TA-07 action panel owner "TravelMudra", "Submitting and TravelMudra's work wait for TravelMudra's decision on the change." (`catalogue_impact_unknown`). SA side: SA-05n shows the S2 item under the A45 sentence. Core gives no SuperAdmin queue item and no notice for the decline, and the assessment may read "Reviewed" with no open item (Q-02). The run record reads "Unmet: waits for the Core fix of Q-02 (owner product owner via Max)" for the "next owner" clause of BU-27 on S2; the travel-agent page passes when it names TravelMudra as owner and invents no date. | L | BU-27; F2 §7 (decline effects); Q-02 |
| WP13-A50 | TA (Y); operator (OP1); harness; test | TA-07 of an assigned application with an awaiting transition (fixture, or P if the run approves a transition for it); OP-02 | Read TA-07. Harness: send a decision. Read OP-02. | TA-07: no TA-07t link; "TravelMudra changed this service. Your operator returns the application to you so that you can decide. Owner: [operator]." (pending `transition_pending` / `return_to_ta`, owner the assigned operator). The harness send is refused `awaiting_formal_return`: "This application is with your operator. They return it to you first."; nothing recorded. OP-02 action panel (WP-07 mapping per reason and next action, F-13 class): owner "You", "Return the application to the travel agent: the travel agent must answer changed terms of the service." with the action to the formal return page (OP-03r); the readiness checklist row "Not met: the travel agent's renewed authority for changed terms. Owner: travel agent, after your return." After the formal return TA-07 offers TA-07t (Core lets a returned application decide). | L (harness) + T | `derived.ts:309-315`; `admin.ts:101-123`; UX §2.3 |
| WP13-A51 | TA (Y, `syn-ta-2`); harness; test | Decision refusals | (1) Harness after A48: the same answer with a new key from a TA-07t loaded before A48 (raw). (2) `syn-ta-2` opens TA-07t of S1 by its address and posts. (3) Test: an act `authorized` or `filing_unknown`; an outcome recorded (apply); the governing terms changed since the approval (apply); a transition id of another application; a closed application. (4) Send with no choice. | (1) `stale_revision`: "Your answer was already recorded, or the application changed. Here is its current state." with the current facts; nothing recorded. (2) The uniform not-found page; nothing recorded. (3) `filing_possibly_occurred` (no TA-07t form while Core reports it, the reason shown); `outcome_already_recorded`; `stale_revision`; the uniform not-found answer; `application_not_open`. (4) C1 at the choice. Nothing is recorded in each case (transition still awaiting where it was; TA-10 delta 0). | L ((1), (2), (4)) + T | F2 §7 |
| WP13-A52 | TA (Y); harness; test | Decision, the Nth time; the handler | Replay terms 1 to 5 on A48. Term 3: Back; TA-07t has no form. BFF test: a `transitionId` of 41 characters and a `decision` of 21 characters. | (1) The original receipt. (2) Used form. (3) No form ("No changed terms wait for your answer."). (4) A51 (4), then A48: recorded once. (5) C4; no new answer offered. BFF test: the handler sends both fields whole (no `slice`); Core refuses them at the field (`custom`, `invalid_value`) and TA-07t re-renders with the choice kept (LD-17). | L+T | PL §7 K-STD; BS B35; LD-17; `src/apps/edge/core/routes.ts:98` |

### 2.9 Retire an offering and discard a declaration draft

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP13-A53 | SuperAdmin (SA1); harness | SA-05r of O while launched (§3 H1) | Open "Retire this offering" from SA-05b. Harness: a retirement with the current revision. | No form; CMP-10 "Retiring is unavailable while the offering is launched. Withdraw it first. Owner: SuperAdmin." with the link to SA-05j `withdraw`; a suspension does not change this. The harness send is refused `retire_requires_not_launched` in the same words; nothing recorded (offering revision delta 0). | L | BS B07 (retirement never bypasses launch control); `identity.ts:131-143` |
| WP13-A54 | SuperAdmin (SA1); TA (Y); harness | SA-05r, SA-05a, SA-05b, SA-05h of O after the withdrawal; TA-02 and TA-03 of Y (§3 H3) | Read SA-05r. Retire with a reason. Read. Harness: a declaration draft for O; a launch plan for O. Y reads TA-02 and TA-03. | SA-05r: Scope (offering, withdrawn since [time] IST); Effect "The offering's catalogue life ends: no declaration, values, plan or launch can be recorded for it again. No command restores a retired offering. Applications already started keep their own terms and follow the withdrawal's treatment."; reason; button "Retire the offering". C3 receipt "Offering retired" (named: summary `offeringId` and `revision`); Current: "Retired". SA-05b and SA-05h show "Retired" and no catalogue or launch action. The harness sends are refused `offering_retired` "This offering is retired."; nothing recorded. Y: O stays listed on TA-02 as "Not available for new applications" with the withdrawn reason (Core keeps a launched-then-withdrawn offering visible; it never says "Retired" to the travel agent) and TA-03 still renders its details. | L | F2 §6 "TA visibility"; BS B07 ("truthful information display may continue") |
| WP13-A55 | SuperAdmin (SA1, SA2); harness | Retirement refusals and the Nth time | (1) SA2 sends from SA-05r opened before A54. (2) Harness: a second retirement with a fresh revision. (3) Replay terms 1 to 5 on A54. | (1) C5 (or, after the retirement, the refusal shown in the unsent block): `stale_revision` with the current state; the reason stays. (2) `offering_retired`: "This offering is already retired." shown on the page; the refusal is never lost because the section hides (today's defect, F2). (3) (1) original receipt; (2) used form; (3) Back: no form; (4) recorded once; (5) C4. Nothing recorded by a refusal. | L+T | WP-02 R-03 class; F2 "Lost refusals" |
| WP13-A56 | SuperAdmin (SA1, SA2); harness | SA-05c of declaration version 3 (draft) and SA-05x (§3 H2) | Open "Discard this draft". Read. Discard with a reason. SA2 sends from a page opened before. Harness: the same discard with a new key. Replay terms 1 to 5. | SA-05x: Scope (offering, version 3, "Draft"); Effect "The draft is set aside. It can no longer be approved, bound or published. Published versions are not affected. No command restores it."; reason; button "Discard the draft". C3 receipt "Draft discarded" (named: summary `declarationId` alone; the version read by that id shows "Discarded"); Current: SA-05c "Discarded"; SA-05b's versions table shows it. SA2 and the new-key send: `declaration_not_draft` "This version is no longer a draft." shown on the page (not lost); nothing recorded. Replay: (1) original receipt; (2) used form; (3) no form; (4) once; (5) C4. A published or supported version offers no discard. | L+T | `declarations.ts:215-235`; F2 §5 |
| WP13-A57 | SuperAdmin; TA; test | An offering that was never launched (fixture) | Retire it. Read TA-02. | Accepted; the effect text of A54 without the withdrawal sentence; the offering stays invisible to travel agents. SA-05j `suspend` and `withdraw` of a never-launched offering offer no form ("This offering is not launched."). | T | V20 clause 1; F2 §6 |

### 2.10 Travel-agent pages and BU-27

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP13-A58 | TA (Y) | TA-02 and TA-03 of O while suspended (§3 E2), with each treatment | Read. | TA-02: O "Not available for new applications". TA-03: CMP-10 "Starting new applications for this service is unavailable until TravelMudra resumes them. Owner: TravelMudra." No sentence about existing work that the read cannot support: the read returns only `offering_suspended`, not the treatment, so the page never says "Work you already started continues as TravelMudra decided" (today's `services.ts:57`); it says "Applications you already started show their own next step." with a link to TA-06. No "Start an application", no "Add applicants in bulk", no wait-list promise, no date. Cost, estimate, documents and process still show (BS B07 "truthful information display may continue"). | L | UX §3.2, §4.4 ("No offering selectable … do not create a wait-list promise"); BS B07; WP02-A24 (amended here); Q-05 |
| WP13-A59 | TA (Y); test | TA-02, TA-03, TA-07 and TA-08 of O after the withdrawal and after the retirement (§3 G1, H3); every TA text keyed by `offering_withdrawn` | Read. Test: the text map. | "TravelMudra has withdrawn this service. No new applications can start." Never "paused", "temporarily", "until TravelMudra offers this service again" (today's `review-submit.ts:105`) or any other wording that implies a return: no relaunch exists. After the retirement the travel agent sees the withdrawn reason first (Core also reports `catalogue_not_published`; the page never shows "no published details" for a withdrawn service). | L+T | BS B07; `launch.ts:438` ("no relaunch exists in this build") |
| WP13-A60 | TA (Y); harness | TA-09c (add applicants) and TA-05 "Add applicants" of the run group while O is suspended (§3 E2) | Read the service choice. Harness: an individual-applicant send naming O (raw, from a page loaded before the suspension). Read TA-05 and TA-06. | O is listed as unavailable with the reason of A58 and cannot be chosen; no other service is preselected or substituted (no invented default); the other Synthetica services stay choosable. The raw send records no draft for O: Core refuses O with `offering_suspended` (at the start or at the row's acceptance, F1 "Intake starts"), and TA-09c or the intake page shows "[O]: TravelMudra has paused new applications for this service. Nothing was created for this service." with the other values kept (WP-03 design §7.5). TA-05 and TA-06 still list D1, D2, D3, S1, S2, P and E with their own states (application count delta 0). | L | BU-27; UX §3.1 step 1, §4.4; BS B07 ("refuse TA selection and all new intake, including drafts"); `intake-writers.ts:77-81` |
| WP13-A61 | TA; test | TA-05 "Add applicants" and TA-09c for a group whose country has no selectable offering (fixture) | Render. | "No service is currently available for new applications in this scope." with the reason of each listed service and the owner "TravelMudra"; no start control; no wait-list promise; the group's existing applications stay listed. (WP03-A35 covers the TA-05 entry; this item covers the suspension and withdrawal codes.) | T | UX §4.4; BU-27; WP03-A35 |
| WP13-A62 | TA (Y); test | The bulk entry for the run group while O is suspended or withdrawn (existing page until WP-04) | Start a bulk import naming O (test, or harness on the existing page). | Refused; Core answers `offering_not_launched` for a suspended offering (F1). The page states the offering's actual reason from the catalogue read ("paused" or "withdrawn"), not "not launched", or the neutral "This service is not available for new applications now." with the owner; earlier imports, drafts and applications stay. BU-P01 and BU-P02 (WP-04) are "Deferred" for their own rebuild (§5); the wording mismatch is Q-12. | T | BU-27; BP BU-P01; `start-bulk.ts:78-83` |
| WP13-A63 | TA (Y); test | TA-07 and TA-08 of a draft for O: D3 under the suspension with the treatment not recorded, "continue" and "hold" (§3 E3, E5, E6); D2 after the withdrawal (§3 G1) | Read the action panel and TA-08. Send TA-08 where it is offered. | Not recorded: action panel owner "TravelMudra"; "Submitting waits until TravelMudra records how existing work of this service continues. Owner: TravelMudra. Your draft is kept." (`existing_work_treatment_missing`); TA-08 shows the same CMP-10 and no submit control; editing stays offered where Core's `correct` allows it. "Continue": "Check and submit"; the submission is accepted (A15). "Hold": as not recorded with "TravelMudra holds work on this service." (`existing_work_hold`). Withdrawn: "Submitting is unavailable: TravelMudra has withdrawn this service. Your draft is kept; it cannot be submitted." (A59 wording rule). A raw TA-08 envelope from before the change is refused with the same reason; nothing submitted. (This amends WP03-A125, which assumed every suspension refuses submission.) | L (+T for "hold" if the run skips it) | UX §3.2 ("as applicable"); BS B07; F1 "`core.submit`"; WP03-A125 |
| WP13-A64 | TA (Y); test | TA-07 of S1, S2 and P (submitted) under the suspension with the treatment not recorded, under "hold" and after the narrowed withdrawal | Read the action panel and status facts. | Core's pending answer has no launch rule, so the page reads the hold from the `assistance` evaluation's launch codes (the only TA evaluation with the launch stage; `correct` has none): "TravelMudra's work on this application is held until TravelMudra records how existing work of this service continues. Owner: TravelMudra." (not recorded or hold) or "…held: TravelMudra has withdrawn this service and does not continue unfiled work. Owner: TravelMudra." The page never shows "With your operator" as the only next step while such a code is present, and never claims that work continues. Test: fixtures for each code; an application with an outcome (no hold shown: outcome recording is never stopped). (Q-01: a Core pending rule would make this exact.) | L+T | UX §2.2 ("A blocked action must say whether … another person owns it, or the policy is unavailable"), §3.2; F1 "Pending and next action"; WP-03 design §3.1 row "Offering withdrawn or suspended" |
| WP13-A65 | TA (Y) | TA-07, TA-09t, TA-08 of D1, D2, S1, S2, P after version 2 is published and after each decision (§3 B5, C3 to C8) | Read. | Before a decision: A40. After "Continues on its own terms": the change blocker is gone; the application keeps its version-1 documents. After the transition of a draft (D1): the version-2 documents show; nothing the travel agent entered is lost. After "Hold": "Submitting waits: TravelMudra holds this application after a change to the service. Owner: TravelMudra." (`catalogue_impact_hold`). Earlier accepted work (documents, answers, the quote) stays on every application (BU-27 "preserving earlier accepted work"). | L | BU-27; BS B06 ("Unaffected work continues"); UX §3.3 |
| WP13-A66 | TA (Y) | TA-06, TA-01, TA-10 of Y at each part of §3 | Read the lists and notices. | Rows show Core's progress and pending owner; a held application is not shown as "Ready" or as progressing (the row's next step follows A64's rule where the list read carries the codes, otherwise the row's own pending owner with no invented hold). TA-10 shows only the notices Core posts: + 1 per transition that needs authority (S1, S2); no notice for a suspension, a treatment, a lift, a withdrawal, a decline or a retirement (Core posts none) and no page claims that one was sent. | L | UX §4.2; F1 "Effects" (no notice from launch facts); `catalogue-writers.ts:145-150` |

### 2.11 Operator pages

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP13-A67 | Operator (OP1); harness | OP-02 of P under the suspension with the treatment not recorded (§3 E3), under "hold" (E6) and after the narrowed withdrawal (G3) | Read the action panel and the readiness checklist. Harness: "Start work" (or "Record readiness") from a page loaded before the suspension (raw). | The step whose evaluation carries a launch hold shows CMP-10 in place of its form: "Starting work on this application is held until a SuperAdmin records how existing work of this service continues. Owner: SuperAdmin." (`existing_work_treatment_missing`), "…held by the suspension of this service" (`existing_work_hold`), "…held: the withdrawal of this service does not let unfiled work continue" (`withdrawal_continuation_not_permitted`). The action panel names the held step and the owner SuperAdmin, even though Core's pending answer still names the operator (Q-01); it never tells the operator to do the held step. Steps Core does not stop (outcome, delivery, reconciliation, originals, incidents, withdrawal request) keep their forms. The raw send is refused with the code in words; nothing recorded. | L | UX §3.2 ("Missing treatment holds affected unfiled preparation/release/filing"); BS B07; WP-09 G-05; F1 "How Core applies it" |
| WP13-A68 | Operator (OP1); test | OP-02 of P and fixtures: impact not known, held, transition waiting (unassigned and assigned), declined | Read the readiness checklist and the action panel. | Rows by Core's codes in words with owner and route: `catalogue_impact_unknown` "Not met: the effect of a change to this service is not decided. Owner: SuperAdmin."; `catalogue_impact_hold` "Not met: held after a change to this service. Owner: SuperAdmin." (the operator's read names no hold owner); `transition_pending` "Not met: the travel agent has not answered changed terms of the service." with, for an assigned application, the return step of A50. No operator page offers an impact decision or a transition (SuperAdmin only). | L+T | WP-07 design §2.3 "Holds and open decisions"; WP-07 F-13 (per reason and next action) |
| WP13-A69 | Operator (OP1); test | OP-01 of OP1 at each part of §3; fixtures | Read P's row and the view counts (deltas from P-0). | A row whose pending step is held by launch control or by an undecided change is placed as the architect decides on Q-06 (the test asserts the decided view and that the page and the navigation count agree; F-07 class). It never counts as an operator's "Action now" item that the operator cannot perform. | T | WP-07 F-07, F-16, F-30; Q-06 |
| WP13-A70 | Test | Duties under a suspension (each treatment) and a withdrawal (each treatment) | Run Core and page tests. | Recording an outcome, completion, result delivery (send and download), reconciliation of an uncertain filing, original custody and return and incident work are not stopped by launch control, and their pages show no launch hold. Tests: `test/core/launch.test.ts` "holds submission, assignment and filing under a holding suspension; duties continue"; WP11-A25 (reconciliation under a suspension); a WP-13 test for an original return and a result download under a withdrawal with "hold". | T | UX §3.2 ("reconciliation, original return, incidents and valid delivery remain governed by their normal checks"); BS B07 |

### 2.12 Command results, access and shell on WP-13 pages

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP13-A71 | SuperAdmin; TA | Every WP-13 page | Read the shell. | Environment label; "[TEST]" title prefix; rail "Offerings & launch" (the rail label "Catalogue" leaves, WP-02 §6) with the destination tabs Offerings, Launch, Impact review, Public site; crumbs inside one offering ("Offerings / [offering] / Readiness and launch / Suspend new applications"), assessment pages under "Impact review / Assessment [no.]"; TA-07t under "Applications / [applicant] / Changed terms"; one `h1`; "Read at [time] IST". The WP-02 P2 items of `WP-02.md` §6 for this page family (the overview crumb "Offerings & launch" versus "Offerings"; the operation status page labels) are cleaned up or recorded as parked by the design. | L | PL §2.1, §2.2; WP-02 design §1.3, D-W02-11; WP-02 §6 |
| WP13-A72 | SuperAdmin; TA; harness | Every accepted WP-13 command; edited receipt addresses | Read each receipt. Open edited addresses: a `lifted` code with a suspension key; a `retired` code with an offering-creation key; a `decided` code with a reviewer key; another offering's key; SA2 opens SA1's receipt addresses. | Naming by resource and summary keys (all others neutral "Request recorded" with Current facts): suspend (offering; `suspensionId`, `treatment`) "Suspension recorded"; treatment (offering; `treatmentId` only) "Existing-work treatment recorded"; lift (offering; `suspensionId`, `restoredLaunchId`) "Suspension lifted"; withdraw (offering; `withdrawalId`, `treatment`) "Withdrawal recorded"; reviewer (offering; `assessmentId` only) "Accountable reviewer assigned"; item decision (offering; `decided`) "Impact decision recorded"; recheck (offering; `assessmentId`, `generation`) "Recheck requested"; transition (application; `transitionId`, `taAuthorityRequired`) "Transition approved" (except A45's empty send, whose returned `transitionId` was already recorded: neutral); TA decision (application; `transitionId`, no answer) "Your answer on the changed terms is recorded" with no answer named; retire (offering; `offeringId`, `revision`) "Offering retired"; discard (offering; `declarationId` only, the version read as discarded) "Draft discarded". Recorded facts come only from those summary fields; everything else is "Current". An edited address never shows another command's title. SA2 gets the unchecked receipt with the current facts (J-09). No accepted time (P-02). | L+T | WP-02 B-02; WP-06 D-02; WP-12 J-08, J-09; F1, F2 results |
| WP13-A73 | SuperAdmin; TA; test | Receipt addresses of the suspension (A09), the treatment (A15) and the transition of S1 (A43), opened again after the lift, the withdrawal and the travel agent's answer | Open each address again. | Each keeps what was recorded then and shows the current facts labelled "Current": the suspension receipt after the lift reads Current "Suspension: none (lifted)" and gives no "record a treatment" step; the S1 transition receipt after A48 shows no "waiting for the travel agent" as current. No receipt or status read tells anyone to act from an older state (F-33). | L+T | WP-07 F-01, F-33; WP-09 G-10 |
| WP13-A74 | SuperAdmin; TA | Each command of §1.2 with a lost acknowledgement (fixture); a refused send | Inject the fault. Open the operation status page. "Check status" after the original resolves. Open the status page of a refused send's key. | C4 (CMP-13) "Checking the original result" and "Check status"; no new send of the same intent is offered there. "Check status" shows the accepted result with the naming of A72. A refused send leaves no operation record: "Nothing is recorded for request [reference] so far"; the refusal shows only on the re-rendered page. | T | PL §1.1 UNR; BS B35; WP-01 A-08; WP06-A104 |
| WP13-A75 | Harness | Each command of §1.2 | (1) Identical replay. (2) Same key, changed content. (3) Business duplicate: a new key with the current page's facts. (4) Raw stale envelope: a new key with an older revision. (5a) Raw resend of a refused envelope after the facts changed. (5b) Corrected submission from a freshly loaded page. | (1) The original result; nothing new. (2) `conflict_operation_key`; nothing recorded. (3) Suspend `suspension_active`; lift `suspension_not_active`; withdraw `offering_already_withdrawn`; treatment `treatment_unchanged` (suspension) or `withdrawal_treatment_widening_unavailable` (withdrawal); retire `offering_retired`; discard `declaration_not_draft`; transition `transition_pending` while awaiting, otherwise accepted with no new transition (Q-03); TA decision `stale_revision`; reviewer, item decision and recheck: accepted again (no duplicate guard; claimed by no page). (4) `stale_revision` and CMP-14 for every command with a revision (controls, treatment id, assessment, item, offering, declaration, application); the recheck carries none, so its stale case is a second generation. (5a) The refused key has no record; Core evaluates the envelope again against its own revision (H-07). (5b) The current revision decides. A duplicate test uses (3), never (4) or (5a). Browser Back is not a replay. | T | WP-06 D-12; PL §7 K-STD; BS B35; WP-10 H-07 |
| WP13-A76 | SuperAdmin; TA | Every refusal reachable on `lane-ui` in §2.1 to §2.11 | Read each message. | CMP-07 with the reason in words, the owner or route where one exists, the reference code as secondary text for staff. Never a code alone (except UAT-13), "Something went wrong", "Invalid data" or "A requirement of this item is not met". | L | PL §1.1 REJ, §11.1; CR-01 |
| WP13-A77 | — | Text map of every reason and classification code the WP-13 pages can show (unit test) | Check the map against Core's vocabulary. | Staff and TA text for: `offering_suspended`, `offering_withdrawn`, `offering_not_launched`, `offering_out_of_launch_scope`, `catalogue_not_published`, `existing_work_hold`, `existing_work_treatment_missing`, `withdrawal_continuation_not_permitted` (today staff `REASON_MESSAGES` holds the non-Core keys `existing_work_held` and `treatment_missing` instead, F1 headline 6), `suspension_active`, `suspension_not_active`, `treatment_unchanged`, `withdrawal_treatment_widening_unavailable`, `withdrawal_irreversible_unacknowledged`, `withdrawal_permission_required`, `offering_already_withdrawn`, `launch_already_current`, `launch_acknowledgement_mismatch`, `launch_plan_not_current`, `launch_plan_incomplete`, `impact_item_not_current`, `impact_decision_not_allowed`, `continuation_unsupported`, `transition_pending`, `transition_evidence_missing`, `filing_possibly_occurred`, `application_not_open`, `declaration_unsupported`, `binding_incompatible`, `nothing_to_recheck`, `declaration_not_draft`, `offering_retired`, `retire_requires_not_launched`, `awaiting_formal_return`, `outcome_already_recorded`, `catalogue_impact_unknown`, `catalogue_impact_hold`, `not_active_superadmin`, `stale_revision`, `conflict_operation_key`; every `IMPACT_CLASSIFICATIONS`, `IMPACT_CAUSES`, `IMPACT_CHANGE_CLASSES`, `ASSESSMENT_STATES`, `IMPACT_TREATMENTS`, `EXISTING_WORK_TREATMENTS` value; the next actions `decide_transition` and `return_to_ta` with the reason `transition_pending` (per reason and next action, F-13 class). An unknown value reads "Unrecognised state" with "Reference: [code]". `access_denied` renders SH-02 or the uniform not-found page, never a text. The withdrawn texts pass A59's ban. | T | CR-01; UAT-13; `src/apps/staff/catalogue/shared.ts`; `src/apps/shared/pages/{services,review-submit,intake}.ts` |
| WP13-A78 | SuperAdmin; TA | SA-05h, SA-05j kinds, SA-05n, SA-05p, SA-05t, SA-05r, TA-07t (HTTP tests) | (1) Let the page's mandatory read fail for availability (`ops.launch_offering`; `cat.admin_assessment`; `core.ta_application`). (2) Let an optional read fail (the accounts read for the reviewer and hold-owner choices; the offering read for version numbers). (3) Separately: revoke access, end the session, close the installation or start a support view between the page's first read and a later read. | (1) The frame stays; the block reads "Unavailable"; no decision form, because each decision needs its current facts and revision; CMP-10 "The offering's current state cannot be read now. Try again later. Owner: TravelMudra." (F-04, H-05, I-05 class). (2) The reviewer and hold-owner choices read "The list of SuperAdmins cannot be read now." and the form that needs them is removed; version numbers fall back to "Version: not shown on this page". (3) The access page (SH-02, sign-in or maintenance), never the facts read earlier (LD-14). No page code catches every error around a read. | T | LD-14; WP-07 F-04; WP-11 I-05 |
| WP13-A79 | Operator; TA; SuperAdmin | The WP-13 staff addresses as an operator and as a travel agent; TA-07t as a SuperAdmin | Open each. Post each staff command as OP1 (harness). | Operators get SH-02 on every SA-05 page (no offering, assessment or application fact) and each post is refused as not found; the travel agent's session does not open staff pages; a SuperAdmin has no TA-07t control (a support view is read only, A81). Nothing recorded. | L | BS B10; PL §2.3; policy `launch.*`, `catalogue.*` (SA); `application.decide_transition` (TA own) |
| WP13-A80 | SuperAdmin; TA | Every WP-13 page | Read all visible text. | The words of §0.2; no forbidden label of PL §11.1 ("Override", "Admin override", "Approved" or "Done" as an overall status, "Ready" as a universal state, "Force complete", "Reopen system"); no "Relaunch", "Restore offering", "Migrate", "Auto-transition", "Apply to all", "Change service" or "Change country" control (a service or country switch needs fresh intake, UX §6.3); no SLA, date or wait-list promise; no list of accepted evidence kinds or limits that the page does not read; times carry IST; counts name their unit; synthetic data carries the synthetic label. | L | PL §11.1; UX §6.3; CR-02, CR-03, CR-06, CR-07, CR-08; WP-01 Q-13 |
| WP13-A81 | SuperAdmin in a support view of Y (test) | TA-02, TA-03, TA-07, TA-07t in a support view | Render. Post a decision. | The same facts, read only; no TA-07t form or link; the `/admin` pages answer 409 `support_view_active`; the post is refused; nothing recorded. | T | BS B10; PL SH-R09 |
| WP13-A82 | SuperAdmin; TA | Every WP-13 form page | Inspect browser storage after use. Read the response headers. | No reason, evidence reference, note, treatment or answer is kept in `localStorage`, `sessionStorage` or IndexedDB. Signed-in pages send `no-store`. | L+T | PL §2.3 SH-R12 |
| WP13-A83 | — | Host pages, carried forms and routes | Run the host-page test (named by the design). On `lane-ui` open SA-05h, SA-05b, SA-05c, the old assessment page and TA-07 of S1. Run the route test. | Each of the 11 POST actions of §1.2 appears as a form action on exactly one renderer, as the design assigns it (Q-15). SA-05h, SA-05b and SA-05c hold none of the WP-13 forms and show links; TA-07 links to TA-07t and holds no decision form. The WP-13 entries of `test/unit/web/carried-forms-admin.test.ts` (recheck, retire, retire-draft, suspend, treatment, lift, withdraw) and of `test/unit/web/carried-forms-ta.test.ts` (transition decision) are removed; the WP-15 entries stay. Every other carried form keeps its markup, fields, action and redirect. The new GET routes are in the route inventory; every rendered form action is a registered route; LAUNCH_DECISION_PAGE_KINDS gains the four kinds and an unknown kind is the uniform 404. The accepted commands answer with a receipt location (`receiptLocation`), no longer a plain `?done=` flash. | L+T | LD-02, LD-03, LD-07; CC-12 to CC-16; WP-02 design §1.5, §8.2; WP06-A110 |
| WP13-A84 | `syn-ta-2`; SuperAdmin; operator | TA-03 and TA-07t of O's applications as `syn-ta-2`; ids of another offering or assessment in the paths; an item id of another application in the transition path | Open each; post. | `syn-ta-2`: the uniform not-found page for TA-03 of O and TA-07t of S1. A SuperAdmin path with an unknown id: the uniform not-found page. The transition post with another application's item: not found (the binding refuses before the policy); nothing recorded. No fact of O's applications shows to anyone outside its scope. | L | BS B10; UX §2.3; F2 §3 binding |
| WP13-A85 | Test | The 11 handlers and the catalogue-admin binding (BFF tests) | Send forms with: a reason of 10 and 1000 characters and of 1001; evidence references of 200 and 201 characters; two evidence rows; a feasibility row and an evidence row; acknowledgement checkboxes for every unavailable action; an unknown field. | Every field reaches Core whole; nothing is sliced or dropped; over-limit input is refused at its field with the values kept. Because the binding reads one evidence row per list (`evidenceOf`), each WP-13 form offers exactly one row per list; a second row is never offered and, if posted by hand, is refused at its field by the BFF, never dropped (LD-17). A change of the binding to read indexed rows is a proposal to the orchestrator (Q-13). | T | LD-17; WP-12 J-06; F1, F2 "evidenceOf" |
| WP13-A86 | SuperAdmin; TA | Every WP-13 form after a refusal, including a refusal after which the form no longer applies (retired; not a draft; already suspended; answered) | Cause each refusal. | The refusal summary and the submitted values render independently of the current eligibility (WP-02 R-03 class): the form re-renders with every typed value, choice and evidence row kept, or, where the form no longer applies, an "unsent" block shows the typed values and the refusal; no refusal is lost because its section hides (today's `offering_retired` and `declaration_not_draft` cases, F2). No refusal rebuilds a hidden decision value from a fresh read (WP-02 R-01 class): the hidden `existingWorkTreatment`, `treatment`, `decision`, `causeRef`, `expectedTreatmentId`, `suspensionId` and `transitionId` come from the posted form. Confirmations and acknowledgements stay unchecked. | L+T | WP-02 R-01, R-03; UX §3.3; WP-09 G-07 |

### 2.13 Accessibility (AC-01 to AC-28 that apply)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP13-A87 | Keyboard-only SuperAdmin and travel agent | §3 steps E1, E4, F2, G1, C2, C3, C6 and D2 at 1440 px; E1 and D2 at 390 px | Use the keyboard only. | Every step works with Tab, Shift+Tab, Enter, Space and Escape: the radios, the acknowledgement checkboxes, the evidence row, the reviewer and hold-owner choices, the consequence review and the final buttons. No action needs a mouse, hover or drag-and-drop. | L | AC-01, AC-12 |
| WP13-A88 | Keyboard-only user | Every WP-13 page at 1440 and 390 px and at 400% zoom | Tab through the page. | Focus is visible (at least 3:1) and never hidden by the top bar, the rail or a bottom action area. | L | AC-02 |
| WP13-A89 | Phone user | SA-05h, SA-05j kinds, SA-05n, SA-05p, SA-05t, TA-03, TA-07t | View at 320 px, and at 1280 px with 400% zoom. | No two-dimensional page scrolling. The effects table and the items table scroll only inside a labelled region, or become cards. Scope and effect come before the fields; the primary action is at the end of the form, never in a fixed bar. | L | AC-04, AC-21; UX §7.3 |
| WP13-A90 | Any | Every WP-13 form | Inspect each input. | Each input has a visible label; the choice groups ("Existing work during the suspension", "Unfiled submitted work", "Accountable reviewer", "Decision", "Hold owner", "Your answer") sit in fieldsets with legends and none is preselected; the evidence row labels its kind, reference and note; required and optional fields say so; the reason hint says "At least 10 characters. It is kept in the audit record." | L | AC-05, AC-15 |
| WP13-A91 | Any | Effects, treatments, item states, boundaries | View in greyscale. | Each effect and state has text; nothing is shown by colour alone ("Held" and "Refused" are words, not only colours). | L | AC-06 |
| WP13-A92 | Any | Every WP-13 form | Send each form with an error. | Focus moves to the error summary; each link moves focus to its field; values and choices stay (A86); acknowledgements stay unchecked. | L | AC-08; CMP-07 |
| WP13-A93 | Screen-reader user | Receipts; the withdrawal lead; the boundaries of A22, A53, A58, A63, A67 | Read with VoiceOver or NVDA. | Receipts are announced politely without moving focus. The irreversibility statement and the boundaries are read before the controls they concern. | L | AC-09, AC-16 |
| WP13-A94 | Screen-reader user | Each unavailable action (lift blocked, retirement blocked, a held step on OP-02, the TA-08 submit under a hold) | Focus the control or the notice. | The reason is exposed (`aria-describedby`, or the notice in reading order); an `unavailableButton` has `aria-disabled="true"`; a role-forbidden action is not shown at all. | L | AC-13; CMP-10; PL SH-R08 |
| WP13-A95 | Phone user | Every WP-13 page at 390 px | Measure each control. | Every control is at least 24 × 24 CSS px; the final buttons are at least 44 × 44 CSS px; radio and checkbox labels are part of their targets. | L+T | AC-10 |
| WP13-A96 | — | Every WP-13 page | Measure contrast of text, focus, effect words and notices. | Normal text at least 4.5:1; non-text indicators and focus at least 3:1. | L+T | AC-11 |
| WP13-A97 | Any | Long texts; reduced motion | Use an offering title of 120 characters, a reason of 1000 characters, an evidence note of 200 characters and a 60-character applicant name. Turn on "reduce motion". | Titles, reasons and names wrap without hiding identity; a truncated text has a full form that keyboard and touch reach. No transition plays. | L | AC-14, AC-20 |
| WP13-A98 | SuperAdmin and travel agent (observation) | SA-05j `suspend` before E1; TA-07t of S1 before D2 | Ask SA1 "If you suspend with 'Decide later', can the travel agent still submit a draft, and can the operator keep working?" and Y "What happens if you keep the current terms?". | The run record reports the answers and the sample size; confusing a suspension with a withdrawal, "Decide later" with "Continue", or "Keep the current terms" with a withdrawal of the application is a finding. No pass target (observation only). | L | AC-24, AC-26; UX §12 (usability) |

### 2.14 axe checks (WCAG 2.2 A/AA)

Rule for every row: run axe (`@axe-core/playwright` 4.13.0, tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`,
`wcag22aa`) at 1440 × 900 and at 390 × 844. Expected: no violation of impact "serious" or "critical" at either width.
Record the counts of minor and moderate violations. WP-13 uses synthetic data only. The WP-13 states of pages that other
packages own (TA-07, TA-08, OP-02) are covered here because WP-13 changes them; their base states stay with their own
packages.

| ID | Persona | Page (state) | Where | Source |
|---|---|---|---|---|
| WP13-A99 | SuperAdmin | SA-05h of O: suspended, treatment not recorded (A01, A02) | L | UX §7.5; AC-01 to AC-28 |
| WP13-A100 | SuperAdmin | SA-05h of O: withdrawn, narrowed to hold (A01) | L | same |
| WP13-A101 | SuperAdmin | SA-05j `suspend`: the form (A07) | L | same |
| WP13-A102 | SuperAdmin | SA-05j `suspend` with the error summary (A08 (1)) | L | same |
| WP13-A103 | SuperAdmin | SA-05j `treatment`: the form (A14) | L | same |
| WP13-A104 | SuperAdmin | SA-05j `lift`: the form with the acknowledgements (A21) | L | same |
| WP13-A105 | SuperAdmin | SA-05j `withdraw`: the form (A26) | L | same |
| WP13-A106 | SuperAdmin | SA-05j `withdraw` after the `withdrawal_permission_required` refusal (A27 (2)) | L | same |
| WP13-A107 | SuperAdmin | SA-05m with O's assessment (A32) | L | same |
| WP13-A108 | SuperAdmin | SA-05n "Decision needed" with the items and the reviewer form (A33, A34) | L | same |
| WP13-A109 | SuperAdmin | SA-05p: the choices with unavailable reasons (A35) | L | same |
| WP13-A110 | SuperAdmin | SA-05t: the form (A41) | L | same |
| WP13-A111 | SuperAdmin | SA-05r blocked while launched (A53) | L | same |
| WP13-A112 | SuperAdmin | SA-05x: the form (A56) | L | same |
| WP13-A113 | TA | TA-03 of O suspended (A58) | L | same |
| WP13-A114 | TA | TA-09c with O unavailable (A60) | L | same |
| WP13-A115 | TA | TA-08 of D3 with the treatment not recorded (A63) | L | same |
| WP13-A116 | TA | TA-07 of S1: the changed-terms action panel (A47) | L | same |
| WP13-A117 | TA | TA-07t: the form (A47) | L | same |
| WP13-A118 | Operator | OP-02 of P with the held step (A67) | L | same |
| WP13-A119 | SuperAdmin; TA | Operation status page of a WP-13 command, accepted and "Nothing is recorded" (A74) | L | same |

## 3. Proof scenarios V20 and BU-27

V20 (UX §12): "Publication/released binding does not launch a new route. Existing-case impact is explicit. Supported
structural update to launched unsuspended offering needs no invented second launch approval for new cases." Authority
B05 to B07. BU-27 (bulk spec §11): "No offered service available or current eligibility changes: no invented
offering/default; affected action explains its constraint and next owner while preserving earlier accepted work." Also
UX §3.2 "Withdrawn/suspended offering" and §6.3.

One ordered recipe (§0.4) serves both proofs. "Setup" steps use pages of other packages; they are not the subject under
test. "Observe" steps check items that other packages own. Every harness send uses a freshly loaded page unless the
step says "raw". Parts G and H cannot be undone and apply to O only.

| Step | Actor, page | Action | Observable result | Items | Where |
|---|---|---|---|---|---|
| P-0 | SA1: SA-05a, SA-01; OP1: OP-01; `syn-ta-2`: TA-02 | Read the counts. | The run record holds the baselines of §0.4. | — | L |
| Setup-1 | SA1 (SA-06) | Create and activate Y; read Y's TA-10 count. | Y active. | — | L |
| Setup-2 | SA1 (SA-05a to SA-05e, WP-02 §3 D2 to D7) | Create O; register declaration version 1 from the head body of "SYN Tourist e-visa"; record the structural approval; ask the active release for a binding; save values (₹3,300); preview; publish. | O published with a binding. | — | L |
| A1 | SA1: SA-05h, SA-05a; Y: TA-02; harness | Read. Harness: a suspension of O; a withdrawal of O (acknowledged, with evidence); an individual intake of Y naming O. | O "Not launched" (observe WP02-A54); the suspension and the withdrawal refused `offering_not_launched`, nothing recorded; Y's TA-02 delta 0; the intake records no draft. V20 clause 1. | A10 (1), A29 (2) | L |
| Setup-3 | SA1 (SA-05i, SA-05j kind `launch`) | Record a complete plan; launch O for named Y with every acknowledgement. | O launched for Y. | — | L |
| Setup-4 | Y (TA-09c, TA-08); SA1 (SA-07a, SA-03a) | Create the group; create D1, D2 on O and E on "SYN Tourist e-visa"; create and submit S1, S2 and P on O. Record P's payment; assign P to OP1. | Five applications of O on version 1; E. | — | L |
| B1 | SA1 (SA-05b, SA-05c, SA-05d; Setup) | Register declaration version 2 (the itinerary), record its structural approval, ask for its binding, save values for version 2. | Version 2 supported and bound; no change to O's launch. | — | L |
| B2 | SA1 (SA-05e; Observe) | Preview version 2 with its values; read the impact; publish with evidence and a reason, choosing no continuation policy where the page offers that choice. | The preview lists the open applications by class (observe WP02-A60: 2 drafts, 2 submitted unpaid, 1 submitted paid); the receipt names the new head. | — | L |
| B3 | SA1: SA-05h, SA-05j kind `launch`, SA-05b; Y: TA-02, TA-03 | Read. | Launch state, audience and decision unchanged; the effects table all Allowed; SA-05j `launch` no form with the sentence of A05; Y's TA-03 shows the optional "Travel itinerary". V20 clause 3. | A01, A02, A05 | L |
| B4 | SA1: SA-05m, SA-05n, SA-01 | Read until the state leaves "Being rechecked". | O's assessment listed (SA-01 group 8 + 1); five items (D1, D2, S1, S2, P), "Decision needed", classification in words; E has none. V20 clause 2. | A32, A33 | L |
| B5 | Y: TA-07, TA-08 of D1, D2; TA-09c; OP1: OP-02 of P | Read. Y creates D3 on O (complete documents). | D1 and D2: the change blocker with owner TravelMudra, drafts kept; P: readiness row "Not met: the effect of a change …, Owner: SuperAdmin"; D3 is created on version 2 with no blocker and no launch step. BU-27 (eligibility change). | A40, A65 | L |
| C1 | SA1: SA-05n | Read the items again after D3's creation. | D3 has no item (it is on the head); no other change. | A33 | L |
| C2 | SA1, SA2: SA-05n; harness | Assign SA2 as reviewer (the A34 sequence: OP1's id by harness; SA2's stale tab). | Receipt; refusals as A34; nothing recorded by them. | A34 | L |
| C3 | SA1: SA-05p of D2; harness | Decide "Continues on its own terms". Harness: "Continues on the current published terms" for S2. | Receipt; D2's blocker gone; the harness send refused `continuation_unsupported`. | A35, A36 (3), A65 | L |
| C4 | SA1: SA-05p of P; OP1: OP-02 of P | Send "Hold" with no owner; then with owner SA2. Read OP-02. | C1; then the receipt; OP-02 readiness row "held after a change … Owner: SuperAdmin". | A35, A36 (1), A68 | L |
| C5 | SA1: SA-05t of D1; harness; Y: TA-09t of D1 | Harness: an external reference as the only evidence. Then approve with the offered binding evidence. | `transition_evidence_missing`, nothing recorded; then "Transition approved", authority not needed; D1 shows version 2's documents; TA-10 delta 0. | A41, A42, A44 (2) | L |
| C6 | SA1: SA-05t of S1, S2; harness; Y: TA-10 | Approve S1 and S2. Harness: a second approval of S1. | Receipts with authority needed; TA-10 + 2; the second approval refused `transition_pending`. | A43, A44 (3) | L |
| C7 | SA1: SA-05n | Read the rows of D1, S1, S2. | No second approval offered. | A45 | L |
| C8 | SA1: SA-05p of P; OP1: OP-02 of P | Decide P "Continues on its own terms". Harness: the D2 decision again with a new key. | Receipt; P's row met; the new-key send accepted again with no page claiming duplicate protection. | A35, A37 | L |
| C9 | SA1, SA2: SA-05n | Request a recheck; SA2 requests one from an older page; read until it settles. | Two generations; every decision kept; receipts. | A38 | L |
| D1 | Y: TA-07, TA-07t of S1 | Read; "Cancel". | The changed-terms panel and page of A47; nothing recorded. | A47 | L |
| D2 | Y: TA-07t of S1; harness | Send with no choice; then "Move to the current terms". Harness: the replay; a new-key send from the page loaded in D1 (raw). | C1; the neutral receipt; Current facts; the replay returns the same receipt; the raw send refused `stale_revision`. | A48, A51 (1), (4), A52 | L |
| D3 | Y: TA-07t, TA-07, TA-08 of S2; SA1: SA-05m, SA-05n, SA-01; harness | "Keep the current terms". Read. Harness: a second approval of S2 (raw). | The neutral receipt; S2 waits with owner TravelMudra; no SuperAdmin queue item (Q-02, recorded "Unmet"); the raw approval accepted with no transition (Q-03, recorded "Unmet"); no page offered it. | A45, A49 | L |
| D4 | `syn-ta-2` | Open TA-07t of S1; post. | The uniform not-found page; nothing recorded. | A51 (2), A84 | L |
| E1 | SA1, SA2: SA-05j kind `suspend`; harness | The A07 and A08 sequence; suspend with "Decide later"; harness: a second suspension; SA2 sends from an older page. | Receipt; refusals as A10; nothing recorded by them. | A07, A08, A09, A10 (2), (3), A11 | L |
| E2 | Y: TA-02, TA-03, TA-09c, TA-05, TA-06; `syn-ta-2`: TA-02; harness | Read. Harness: an intake row for O (raw, page loaded before E1). | O not available with its reason; no default; the row refused, nothing created; the applications of Setup-4 and D3 listed with their own states (count delta 0); O absent for `syn-ta-2`. BU-27 (no offered service). | A09, A58, A60 | L |
| E3 | Y: TA-07, TA-08 of D3, TA-07 of P; OP1: OP-02 of P; harness | Read. Harness: "Start work" on P (raw). | D3's submission held with owner TravelMudra; P's TA-07 hold sentence; OP-02 the held step with owner SuperAdmin, no form; the raw send refused `existing_work_treatment_missing`. | A63, A64, A67 | L |
| E4 | SA1: SA-05h, SA-05j kind `treatment` | Read the action panel; open the treatment page; record "Continue". | The A05 step; the A14 page; the A15 receipt. | A05, A14, A15 | L |
| E5 | Y: TA-08 of D3; OP1: OP-02 of P (Setup) | Y submits D3. OP1 starts work on P. | D3 submitted during the suspension; P's work started. | A15, A63 | L |
| E6 | SA1, SA2: SA-05j `treatment`; OP1: OP-02 of P; Y: TA-07 of P | Record "Hold"; send "Hold" again; SA2 sends from an older page. Read. | Receipt; `treatment_unchanged`; C5; P's readiness step held `existing_work_hold`; TA-07 hold sentence. | A16, A64, A67 | L |
| F0 | SA1: SA-05r of O; harness | Read. Harness: a retirement. | Boundary "Withdraw it first"; refused `retire_requires_not_launched`; nothing recorded. | A53 | L |
| F1 | SA1: SA-05j kind `lift` | Read; send without the acknowledgements. | The A21 page; `launch_acknowledgement_mismatch`; nothing recorded. If the plan is not complete for version 2, the A22 boundary shows; SA1 records a new plan version (Setup, §0.4). | A21, A22, A24 (1) | L |
| F2 | SA1, SA2: SA-05j `lift`, SA-05j `treatment`; Y: TA-03; `syn-ta-2`: TA-02; harness | Lift. Harness: a second lift. SA2 sends from an older page. Read. | "Suspension lifted"; O available for Y only; `suspension_not_active`; C5; the treatment page has no form. | A18, A23, A24 (2), (3), A25 | L |
| F3 | SA1, SA2: receipt addresses of E1, E4, C6 | Open them again; SA2 opens SA1's. | Historical facts kept; Current facts; no instruction; SA2 the unchecked receipt. | A72, A73 | L |
| G1 | SA1: SA-05j kind `withdraw`, SA-05h, SA-05j `launch` and `expand`; Y: TA-03, TA-08 of D2; OP1: OP-02 of P | The A27 sequence; withdraw with "Let it continue" and feasibility evidence. Read. | Refusals as A27; the "Withdrawal recorded" receipt; no launch or expansion form; TA-03 withdrawn words; D2 cannot be submitted, draft kept; P's work continues. BU-27 (withdrawn service). | A26, A27, A28, A59, A63 | L |
| G2 | SA1, SA2; harness | A second withdrawal; SA2's older page; the replay. | `offering_already_withdrawn`; C5; the same receipt. | A29 (1), (3), A30 | L |
| G3 | SA1: SA-05j `treatment` (withdrawal); OP1: OP-02 of P; Y: TA-07 of P; harness | Record "Hold". Reopen. Harness: "Continue". | Receipt; P held `withdrawal_continuation_not_permitted`; no form; widening refused. | A17, A31, A64, A67 | L |
| H1 | SA1: SA-05c, SA-05x (version 3); SA2; harness | Setup: register version 3 as a draft. Discard it; SA2's older page; a new-key send. | "Draft discarded"; `declaration_not_draft` shown on the page. | A56 | L |
| H2 | SA1, SA2: SA-05r, SA-05a, SA-05b, SA-05h; Y: TA-02, TA-03; harness | Retire O. Harness: a declaration draft and a plan for O; a second retirement. SA2's older page. | "Offering retired"; `offering_retired` shown on the page; Y still sees O as withdrawn, never "Retired". | A54, A55, A59 | L |
| X1 | OP1, OP2; `syn-ta-2`; SA1 | The A79 and A84 reads and posts; edited receipt addresses of A72. | SH-02 or not found; nothing recorded; no wrong receipt title. | A72, A79, A84 | L |
| X2 | Test | A02, A05, A06, A08 (4), A10 (4), A11 to A13, A16 to A20 (tests), A22, A25, A29 (4), A30, A31, A33 (fixtures), A34 (5), A36 (5), A37, A38, A39, A40, A44 (5), A45, A46, A50, A51 (3), A52, A55, A56, A57, A59, A61, A62, A63 (hold), A64, A68 to A70, A72 to A75, A77, A78, A81 to A83, A85, A86, A95, A96 | As the items. | as listed | T |
| X3 | axe | The WP-13 pages in the states of A99 to A119. | No serious or critical violation at 1440 px and 390 px. | A99 to A119 | L |

Proof split: V20 passes when A1, B2 to B5, C1 to C9 and D1 to D3 pass on `lane-ui` at the integrated WP-13 commit
and the V20 tests of X2 pass. Clause 1 is shown by Setup-2 with A1 (publication and a released binding leave O not
launched and refused). Clause 2 is shown by B2, B4, B5 and C1 to D3 (every open application is an explicit item with
its blocker and owner; each decision and the travel agent's answer are explicit). Clause 3 is shown by B3 and B5 (no
second launch approval; the next draft uses version 2). BU-27 passes when B5, E2, G1 and D3 pass: no default is
invented, the affected action names its constraint and owner, earlier work stays; D3's "next owner" after a decline is
recorded "Unmet: waits for the Core fix of Q-02" with the travel-agent page passing on its own words. The suspension,
treatment, lift, withdrawal and retirement steps (E to H) are part of the package pass (§0.2). Recorded, not failed:
A45, A49 (Q-02, Q-03); A47 and A06 "Partly met" (Q-04, Q-09); A20 "Partly met" (Q-07, Q-08). The run record names the
`lane-ui` ref, the run tag, Y's identifier, O's service code, each test, the identifiers (internal record only) and
every delta.

## 4. Scenario parts outside this proof (traceability)

| Scenario part | Where it is proven |
|---|---|
| Publication of values on a launched offering needs no second launch approval | WP-02 (WP02-A82, §3 D14); WP-13 adds the structural case (B3) |
| Publication and binding are not launch | WP-02 (WP02-A38, A54, §3 D7); observed in A1 |
| Impact preview before publication (classes, counts, the affected list) | WP-02 (WP02-A53, A60 to A62); observed in B2 |
| Launch decision anatomy, named audience, concurrent launch | WP-02 (WP02-A71 to A78) |
| Expansion refused while suspended; lift restores only the approved audience | WP-02 (WP02-A80) and the Core test "lifting restores exactly the approved audience, never wider"; A23 |
| One SuperAdmin suspends an account in an emergency (V21) | WP-02 (WP02-A94, A102); the offering case is A12 |
| Reconciliation after a rule change (an offering suspended while filing is unknown) | WP-11 (WP11-A25, design T6) |
| The travel agent's own withdrawal request; group end | WP-17 |
| A mistaken-price correction published with values (price increase proposals) | WP-17 (`core.propose_price_increase` and the TA decision) |
| An assessment opened by a release registration (cause `release`, `support_withdrawn`) | No UI command (engineering registers releases); A33 fixtures render it; Core tests `test/integration/catalogue-impact.test.ts` |
| Gate exceptions do not override launch control | WP-06 (no exception kind exists for launch admission; `exceptionEligible: false`) |
| Delivery, custody and incident work under a suspension or withdrawal | A70 by test; their pages belong to WP-08, WP-12, WP-14 |
| TA-08's submit boundary (base states) | WP-03 (WP03-A125, amended by A63) |
| The bulk pages BU-P01 and BU-P02 under an offering boundary | WP-04 (Deferred, §5); A62 covers the existing bulk entry by test |

## 5. Out of scope and boundaries

These MUST NOT appear on any WP-13 page:

- A control that relaunches, un-withdraws or un-retires an offering, or restores a discarded draft (no such command;
  BS B07).
- A control that changes the country or the service of an existing application, or moves several applications to new
  terms at once (UX §6.3: identity switch needs fresh intake; transitions are per application).
- A suspension, lift or withdrawal that also changes the audience; an expansion offered while suspended or withdrawn.
- One control that publishes and launches, or a "second launch approval" asked after a structural update of a launched,
  unsuspended offering (V20).
- A per-application or per-class treatment control that Core does not serve; a list or count of affected applications
  that no read returns.
- A claim that a suspension always stops submission; a claim that existing work "continues as decided" when the read
  does not say so; "paused" or "until … again" for a withdrawal; "Retired" on a travel-agent page.
- A transition approval offered for an unaffected item, a closed or possibly filed application, an awaiting transition
  or an item already moved; an impact decision or a transition on an operator or travel-agent page.
- A travel-agent answer on changed terms that is preselected, or a TA-07t form while the application is assigned.
- A decision form while its mandatory read is unavailable; earlier facts after an access refusal (LD-14).
- A receipt that names an answer, a command or a result that the operation does not establish; an accepted time; an
  instruction to act from an older state (F-01, F-33; P-02).
- A truncated field, a dropped evidence row or a silently ignored indexed row (LD-17).
- "Override", "Approved" or "Done" as an overall status, "Ready" as a universal state, a wait-list promise, an SLA or a
  date that no read returns.

Recorded as unmet with an owner, not as failures (§0.2 "Pass rule"):

- The owner and queue of an application after a travel agent declines changed terms: Q-02 (Core; to Max through the
  orchestrator).
- The accepted empty second transition approval: Q-03 (Core defect; the page offers none).

Partly met, deferred or parked:

- What changed, for the travel agent (A47): Q-04.
- The actor, evidence and reason of launch-control decisions, treatments, retirements and item decisions (A06): Q-09.
- One treatment per cause; no per-application treatment; no list of affected applications (A20): Q-07, Q-08.
- Applicant and travel-agent names on the assessment items (A33): Q-10.
- Carried items on superseded assessments (A39): Q-11.
- The pending answer of a held case (A64, A67, A69 interim): Q-01.
- BU-P01 and BU-P02 offering boundary: Deferred to WP-04 (the pages are rebuilt there; A62 covers today's entry).
- Command identity and accepted time in receipts (P-02, P-10 b): receipts as A72.

Not in WP-13 (other packages):

- The admission path (country, offering, declaration, approval, binding, values, preview, publication, plan, launch,
  expansion): WP-02.
- The travel agent's application withdrawal request, deferral, price-increase decisions, group end: WP-17.
- Reconciliation pages: WP-07, WP-11. Custody pages: WP-12. Incidents: WP-14. Delivery: WP-08.
- The SA-01 inbox groups themselves: WP-06 (WP-13 observes group 8).

## 6. Questions for the architect (ranked)

The ranks follow PRI-20260930-01: P0 blocks the main path or risks irreversible harm; P1 goes to Max (through the
architect and the orchestrator) to be parked or worked; P2 is parked as a note. No question is P0: the main path
(suspend, record a treatment, lift, withdraw, decide items, approve a transition, the travel agent's acceptance, retire)
works on `lane-ui` with synthetic data, and each dead end below stops work on one application without losing or
corrupting a fact.

| ID | Rank | Question | Concrete scenario | PM recommendation |
|---|---|---|---|---|
| Q-01 | P1 | Core's pending answer has no launch rule. A case held by a suspension or a withdrawal keeps its ordinary pending answer (owner the assigned operator, next action for example `record_readiness`); the next-action code `record_existing_work_treatment` exists in the vocabulary and is never produced (`derived.ts`; F1 headline 2). | SA1 suspends a busy offering with "Decide later" at 18:00. Thirty assigned applications keep "Next: you, confirm readiness" on OP-01 "Action now"; each operator tries, is refused, and nobody tells SA1 that thirty cases wait on one treatment. Likelihood: certain whenever the treatment is not recorded; harm: medium (stalled work, misleading owner; no data loss). | Interim in the UI: A64 and A67 derive the held step and owner SuperAdmin from the evaluation codes (the TA side from the `assistance` evaluation), and A69 follows Q-06. Then: a Core defect fix to the orchestrator (Core batch): pending rule "held by launch control" with owner SuperAdmin and next action `record_existing_work_treatment` when the treatment is missing, and owner SuperAdmin with the hold reason when it is "hold". It makes A64, A67 and A69 exact. |
| Q-02 | P1 | A travel agent's decline has no owner. After `decline` the item stays `transition`, the application is `affected_pending` (submit, readiness, filing and packet release blocked), no notice is posted, no new transition opens, the assessment can read "Reviewed" with no open item, and the impact index omits it (F2 §7, "Reads"). | Y declines the new terms on S2 because the customer will not supply an itinerary. S2 shows "waits for TravelMudra's decision" for weeks; SA-05m, SA-01 and the SuperAdmin queues show nothing; the operator later assigned to S2 cannot confirm readiness and does not know why. Likelihood: medium for every structural change with renewed authority; harm: medium to high (an application stuck with no owner, against UX §6.1 "Keep each obligation owned"). | Recorded "Unmet" (A49). A Core fix to the orchestrator for Max: a decline reopens the item as "Decision needed" (assessment `review_required`, counted in `open_items`) with the accountable reviewer as owner, and posts that SuperAdmin a notice. Until then SA-05n states the rule for every "Moving" item (A45) and the travel agent's page names TravelMudra as owner. |
| Q-03 | P1 | A second `cat.approve_transition` after a decline or an immediate apply is accepted, opens no transition and returns the earlier transition id; after a decline the application stays blocked (F2 §3 "Business duplicate"). | SA1 sees S2 still blocked, opens the transition page by its address and approves again. The receipt says "accepted"; nothing reaches Y; S2 stays blocked. Likelihood: low to medium (the page offers no second approval, A45); harm: medium (a false acceptance). | Core defect fix to the orchestrator: refuse a second approval of an item that already has a transition (`transition_already_decided`, with the current state). Until then no page offers it and the receipt of such a send is neutral (A45, A72). |
| Q-04 | P1 | The travel agent cannot see what changed. `core.ta_application.transition` is `{transition_id}` only; no read gives the travel agent the before and after terms, yet Core asks for renewed authority because authority-bearing terms (documents, eligibility, controls, price, outcomes) changed. | Y is asked to "move to the current terms" of S1. TA-03 shows today's terms, which may already differ from the approved target; Y accepts without knowing that an extra document is now required, and the customer is surprised later. Likelihood: certain for every authority transition; harm: medium (authority given without the facts; B17). | A47 partly met with the honest interim text and the TA-03 link. A Kind 1 projection: the authority-bearing items that differ, in the travel agent's words, on the TA read while a transition waits. Criterion point 1 holds (Core computes the difference at approval). Point 2 (it removes a client-side join, computation or round trips) does not hold: no read exists to compose, so like P-05 and P-18 item 2 it needs Max's exception; route it with P-05 (the same TA display family). |
| Q-05 | P2 | TA-03's suspended text "Work you already started continues as TravelMudra decided." (WP-02 page) claims a decision that may not exist: with "Decide later" or "Hold" the work is held. | Y tells a customer that their submitted application continues while the operator's work is held. Likelihood: high during any suspension; harm: low to medium. | A58 changes the sentence (draft copy). The architect records it as an amendment of WP02-A24's copy owned by WP-13. |
| Q-06 | P1 | OP-01 places a held case by Core's pending owner, which is the operator (Q-01), so the row counts in "Action now" although the operator cannot act (F-07 class). | OP1 has twelve applications of a suspended offering in "Action now"; the count hides the two cases OP1 can work. Likelihood: certain during a suspension without treatment; harm: low to medium (attention). | A WP-07 mapping amendment (F-07, F-16, F-30 class): a row whose pending step's evaluation carries a launch hold or an impact block sits in "Waiting", owner label "Waiting on SuperAdmin: change of this service", not counted. If the list read carries no evaluation, the amendment waits for Q-01's Core fix and A69 records the gap. |
| Q-07 | P2 | Core records one treatment per suspension or withdrawal, applied to every existing-work action of the offering; PL §7 calls the command K-BATCH "per application" and UX §6.3 says "explicit per applicable action". | A SuperAdmin wants paid applications to continue and unpaid ones to hold; the page offers only one choice for all. Likelihood: low; harm: low. | Accept as a recorded deviation: BS B07 is met by one recorded treatment, and the effects table shows the effect per action (A02, A20). No proposal. |
| Q-08 | P1 | No read lists or counts the applications that a suspension or withdrawal holds, before or after the decision (UX §6.1 "affected-case impact"; §6.3 "suspension/withdrawal treatment"). | SA1 suspends with "Decide later" during an incident, unaware that forty submitted cases, three with a travel date next week, stop at readiness. Likelihood: medium; harm: medium (travel-date risk, no notice). | A Kind 1 projection on `ops.launch_offering`: open applications of the offering by lifecycle and by the effect the current treatment gives them (counts, and the first rows with their references). The architect first checks whether a SuperAdmin application list can filter by offering: if it can, point 2 holds (it removes N per-application evaluations); otherwise it needs Max's exception. A20 stays partly met until served. |
| Q-09 | P2 | The launch read does not return who suspended, lifted, withdrew or recorded a treatment, nor the lift, withdrawal and treatment evidence and reasons; the catalogue reads do not return who retired an offering or decided an item, or why (F1, F2). The audit holds them (B33). | SA2 asks why O was withdrawn and by whom; SA-05h cannot say. Likelihood: medium; harm: low (the audit answers). | WP-11 I-10 interim (A06). Kind 1 note, parked (P2); criterion point 2 not demonstrated for a single page. |
| Q-10 | P2 | `cat.admin_assessment` items carry application ids only, no applicant or travel-agent names. | SA1 holds the wrong one of thirty references. Likelihood: medium at volume; harm: low (a re-decision undoes it). | A33 links each reference to the case page. Kind 1 note (names on the item rows): point 2 holds (it removes one case read per row); parked as P2 until volumes grow. |
| Q-11 | P2 | A decided item carried forward stays on its superseded assessment; the impact index omits that assessment, but SA-05a's open-items count includes a carried hold (F2 "Other findings"). | A held application from an older change is counted on SA-05a and cannot be found from SA-05m. Likelihood: low; harm: low. | A39's interim. Core note to the orchestrator (count and index should agree), parked. |
| Q-12 | P2 | `intake.start_bulk` answers `offering_not_launched` for a suspended offering (F1). | A travel agent reads "not launched" for a service it used yesterday. Likelihood: medium in bulk; harm: low. | A62 shows the catalogue reason. Note to the orchestrator for the bulk lane (intake owner), parked. |
| Q-13 | P2 | The catalogue-admin binding reads one evidence row per list; Core accepts up to 20. | A suspension during an incident has an incident reference and an attestation; the page takes one. Likelihood: medium; harm: low. | One row per list now (A85, no silent drop). A binding change (indexed rows, as the operations bindings read) to the orchestrator, parked. |
| Q-14 | P1 | Evidence for a transition: Core accepts the head binding id (or a release supporting it) as "engineering compatibility evidence" when the release supplied no statement for the offering. B06 asks for "engineering compatibility evidence" for a per-application structural transition. The binding proves that the release supports the new structure for new cases; it states nothing about moving an existing case. Two readings. | SA1 moves forty submitted applications to version 2 citing the binding; their earlier documents do not meet a check that version 2 changed; the operators find out at readiness. Likelihood: low today (synthetic; one release); harm: medium. | The page labels the evidence truthfully ("The release's binding for the current terms. The release recorded no statement about existing applications.") and never calls it a compatibility statement (A41). Max decides through the orchestrator whether a transition without a release statement is allowed (a specification reading; prompt stop condition), or whether Core should require a statement. |
| Q-15 | P2 | Host pages and paths: SA-05j gains kinds `suspend`, `treatment`, `lift`, `withdraw`; one decision page per item (SA-05p) or a batch page (Core takes up to 200 items, the binding one); the recheck on SA-05n or SA-05b; SA-05t; SA-05r; SA-05x; TA-07t. | The design puts the recheck on two pages, or keeps the transition form on the assessment list. Likelihood: low. | One host page per command (CC-12 to CC-16): the kinds on SA-05j; SA-05p per item (the binding sends one item); recheck on SA-05n; SA-05t, SA-05r, SA-05x and TA-07t as new GET pages beside the kept POST paths. The architect records it in the register. |
| Q-16 | P2 | Proof writes on `lane-ui`: a new synthetic offering per run (published twice, launched for a new travel agent only, suspended, lifted, withdrawn and retired), a new travel agent, six applications, a payment, an assignment, impact decisions and transitions. The withdrawal and the retirement cannot be undone. | Max opens SA-05a and finds "WP-13 proof [stamp]" offerings, withdrawn and retired. Likelihood: certain; harm: none to data (synthetic, tagged, invisible to other travel agents). | Approve as WP-02 Q-W02-04 and WP-12 Q-W12-09 did; seeded offerings stay untouched. |
| Q-17 | P2 | `core.decide_transition` returns the same summary for `apply` and `decline`, so no receipt can say which answer was recorded. | Y reopens the receipt and cannot see whether it accepted. Likelihood: low; harm: low (Current facts show the state). | Join P-10 b (command identity) with a request that the summary carry the decision; receipts as A48. |
| Q-18 | P2 | Two guards differ on a possibly filed application: the catalogue side treats `reconciliation_exhausted` as possibly filed; `core.decide_transition` refuses only `authorized` and `filing_unknown`. | A travel agent accepts changed terms on an application whose filing could not be established. Likelihood: very low (a transition approval is refused first); harm: medium. | Core note to the orchestrator, parked; A51 asserts Core's actual guard. |
| Q-19 | P2 | Core accepts a suspension of a withdrawn offering, a lift that ignores a withdrawal and a withdrawal during a suspension. The effect is still the most restrictive. | SA1 suspends an already withdrawn offering by mistake and reads "Suspended" beside "Withdrawn". Likelihood: low; harm: none to work. | The page states the combined effect (A10 (4)); no proposal. |

## 7. Sign-off

| Field | Value |
|---|---|
| Verified on (date, IST) | |
| Installation and ref (`uat.py status lane-ui` output: commit or tag) | |
| Lane commit of the tests named for `T` items | |
| Run tag, O's service code, Y's identifier and other identifiers (internal record reference) | |
| Baselines (P-0) and the deltas observed | |
| Browsers and versions | |
| Assistive technology used | |
| V20 result (steps; where shown) | |
| BU-27 result (steps; where shown) | |
| Core gaps in force at the run (Q-01 to Q-04, Q-08, Q-14) | |
| Deferred items (reference each) | |
| Partly met items (decision reference) | |
| Open findings (ID, rank, scenario) | |
| Signed by (role and name) | |

Result per item (Pass, Fail, Blocked, Partly met, Unmet, Deferred or Not run; evidence reference; note):

| ID | Result | Evidence | Note |
|---|---|---|---|
| WP13-A01 | | | |
| WP13-A02 | | | |
| WP13-A03 | | | |
| WP13-A04 | | | |
| WP13-A05 | | | |
| WP13-A06 | | | |
| WP13-A07 | | | |
| WP13-A08 | | | |
| WP13-A09 | | | |
| WP13-A10 | | | |
| WP13-A11 | | | |
| WP13-A12 | | | |
| WP13-A13 | | | |
| WP13-A14 | | | |
| WP13-A15 | | | |
| WP13-A16 | | | |
| WP13-A17 | | | |
| WP13-A18 | | | |
| WP13-A19 | | | |
| WP13-A20 | | | |
| WP13-A21 | | | |
| WP13-A22 | | | |
| WP13-A23 | | | |
| WP13-A24 | | | |
| WP13-A25 | | | |
| WP13-A26 | | | |
| WP13-A27 | | | |
| WP13-A28 | | | |
| WP13-A29 | | | |
| WP13-A30 | | | |
| WP13-A31 | | | |
| WP13-A32 | | | |
| WP13-A33 | | | |
| WP13-A34 | | | |
| WP13-A35 | | | |
| WP13-A36 | | | |
| WP13-A37 | | | |
| WP13-A38 | | | |
| WP13-A39 | | | |
| WP13-A40 | | | |
| WP13-A41 | | | |
| WP13-A42 | | | |
| WP13-A43 | | | |
| WP13-A44 | | | |
| WP13-A45 | | | |
| WP13-A46 | | | |
| WP13-A47 | | | |
| WP13-A48 | | | |
| WP13-A49 | | | |
| WP13-A50 | | | |
| WP13-A51 | | | |
| WP13-A52 | | | |
| WP13-A53 | | | |
| WP13-A54 | | | |
| WP13-A55 | | | |
| WP13-A56 | | | |
| WP13-A57 | | | |
| WP13-A58 | | | |
| WP13-A59 | | | |
| WP13-A60 | | | |
| WP13-A61 | | | |
| WP13-A62 | | | |
| WP13-A63 | | | |
| WP13-A64 | | | |
| WP13-A65 | | | |
| WP13-A66 | | | |
| WP13-A67 | | | |
| WP13-A68 | | | |
| WP13-A69 | | | |
| WP13-A70 | | | |
| WP13-A71 | | | |
| WP13-A72 | | | |
| WP13-A73 | | | |
| WP13-A74 | | | |
| WP13-A75 | | | |
| WP13-A76 | | | |
| WP13-A77 | | | |
| WP13-A78 | | | |
| WP13-A79 | | | |
| WP13-A80 | | | |
| WP13-A81 | | | |
| WP13-A82 | | | |
| WP13-A83 | | | |
| WP13-A84 | | | |
| WP13-A85 | | | |
| WP13-A86 | | | |
| WP13-A87 | | | |
| WP13-A88 | | | |
| WP13-A89 | | | |
| WP13-A90 | | | |
| WP13-A91 | | | |
| WP13-A92 | | | |
| WP13-A93 | | | |
| WP13-A94 | | | |
| WP13-A95 | | | |
| WP13-A96 | | | |
| WP13-A97 | | | |
| WP13-A98 | | | |
| WP13-A99 | | | |
| WP13-A100 | | | |
| WP13-A101 | | | |
| WP13-A102 | | | |
| WP13-A103 | | | |
| WP13-A104 | | | |
| WP13-A105 | | | |
| WP13-A106 | | | |
| WP13-A107 | | | |
| WP13-A108 | | | |
| WP13-A109 | | | |
| WP13-A110 | | | |
| WP13-A111 | | | |
| WP13-A112 | | | |
| WP13-A113 | | | |
| WP13-A114 | | | |
| WP13-A115 | | | |
| WP13-A116 | | | |
| WP13-A117 | | | |
| WP13-A118 | | | |
| WP13-A119 | | | |
| V20 proof | | | |
| BU-27 proof | | | |
