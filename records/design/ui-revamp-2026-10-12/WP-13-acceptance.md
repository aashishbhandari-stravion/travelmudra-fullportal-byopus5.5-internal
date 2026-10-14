# WP-13 acceptance checklist: Offering change and suspension

| Field | Value |
|---|---|
| Lane | `ui-revamp-2026-10-12` |
| Work package | WP-13 Offering change and suspension (UI-PLAN §12.2: SA-05 full, TA-03, TA-07; done when V20 and BU-27; lane PLAN §3) |
| Author | Principal Product Manager (Claude subagent), 13 October 2026 |
| Decision owner | Principal Technical Architect of the lane (LD-12) |
| Status | Aligned on 13 October 2026 with `WP-13-design.md`, `WP-13.md` §3 and amendments L-01 to L-13 (`WP-13.md` §4.1), WP-07 F-36 as amended (`WP-07.md` §4.8) and WP-06 D-18 and D-19 as amended (`WP-06.md` §4.5). See the corrections below. Not run. Where the design names a page, a path or a word differently from an unchanged row, the design governs the name and this checklist keeps the observable result. |
| Product base | lane branch `ui-revamp-2026-10-12`: Core at e1f6ac9 (no change under `src/modules`, `src/contracts`, `src/core-api` or `src/kernel` up to 34e875b); pages read at 34e875b, after the WP-02 commit 228816a; internal records at 3b06d34 |
| Installation | `lane-ui`: staff http://127.0.0.1:4652 (SuperAdmin pages under test; operator pages as observation); edge http://127.0.0.1:4650 (TA-02, TA-03, the add-applicants step, TA-07 and TA-08 under test; proof set-up) |
| Writing style | ASD-STE100 at about 75% (STY-20261003-01) |

## Corrections of 13 October 2026

The UX design (`WP-13-design.md`), the architect's decisions (`WP-13.md` §3), the independent design review (lane
`research/reviews/WP-13-design-review.md`, R-01 to R-13, with amendments L-01 to L-13 in `WP-13.md` §4.1, which bind and
govern where they differ from the design), WP-07 F-36 as amended (`WP-07.md` §4.8) and WP-06 D-18 and D-19 as amended
(`WP-06.md` §4.5) changed the rows below. Page names and paths follow the design throughout: SA-05j kinds
`suspension_treatment` and `withdrawal_treatment` (were `treatment`); SA-05l Impact review (was SA-05m); SA-05m Impact
assessment (was SA-05n); SA-05n item decision (was SA-05p); SA-05x retirement (was SA-05r); the draft discard stays on
SA-05c (was SA-05x); TA-07t `/ta/applications/:applicationId/changed-terms`. No other row changed. Section 6 is kept as
asked; its lead names the answers.

| Row | Finding or decision | Change |
|---|---|---|
| Status, §0.1, verified facts | Design; `WP-13.md` §3, §4.1; review; F-36; D-18, D-19; `PROPOSALS.md` P-19 | Inputs add the design, the package record, the review, the amendments and P-19. Facts add: the transition target is the head at command time and an applied transition keeps its stored target (STOP-W13-05); `views.admin_applications {offeringId}` is the applications list a decision page links to |
| §0.2 "Offering-change words", "Paths", "Pass rule" | Design §1.3, §2.13; L-01 to L-03, L-08 | Words of design §2.13 and §2.11; the design's paths and host pages; the pass rule lists the Unmet obligations by P-19 item |
| §0.3, §0.4, §3 | Design §6; Q-W13-07; L-01 to L-04, L-11 | Version 2 changes the travel-date rule (an authority item), as design §6.3 V20-5; the publication records the design's continuation policy (drafts held, submitted work left for a decision); S1 waits (no Accept) and S2 declines; the narrowing of the withdrawal runs after the retirement (L-11); the binding-only proof steps are recorded "Unmet" for B06 (L-03) |
| §1.1 to §1.4 | Q-W13-01 (CC-18); design §1.3, §1.5 | The design's pages, host pages and states; recheck stays on SA-05b, discard on SA-05c, reviewer on SA-05m |
| A01 to A07, A09, A10, A13 | Design §2.1, §2.2, §2.12, §2.14; D-18, D-19; D-W13-07 | Design words and states; SA-05j `suspend` is closed for a withdrawn offering (A10 (4)); SA-01 observations without count comparison |
| A14, A21, A26, A31, A122 (new) | **L-04** | Effect and review name the control that changes and list the blockers that remain; the narrowed withdrawal never reads "did not permit"; tests with both controls and with a permitted withdrawal narrowed later |
| A16, A19, A32, A35, A78, A83, A86 | **L-12** | Unchanged treatments tested through saved or harness envelopes; no comparison of differently scoped counts; no named hold owner on OP-02; selects with a text fallback; recheck and discard stay on their hosts; acknowledgements restored as WP-02 does, the irreversibility box clear |
| A33, A36, A39, §5 | **L-07**, **L-06**, **L-09** | Decision links on every current item whatever the assessment state; tests for a valid carried item and one behind (`valid_through`); "Decide" stays on transition-treated items; a separate "Historical (filed)" group (A123, new) |
| A41 to A46, A120 (new), A121 (new) | **L-02**, **L-03**, **L-05**, **L-06** | Exact target wording ("the head read at [time]"; "the terms TravelMudra approved for this application"), never "the current terms"; the binding-reference limitation beside the evidence field and binding-only proofs "Unmet" until P-19 item 2; no transition receipt claims created, waiting or applied; no repeat approval for a transition-treated item; tests for a publication between review and send and before the travel agent's decision, "Unmet" until the Core guards (P-19 item 4) |
| A47 to A52 | **L-01** | TA-07t offers Decline and a truthful waiting state and no Accept; "Accept: Unmet, waits for Max's decision on P-19 item 1"; the live proof declines S2 and leaves S1 waiting |
| A53 to A57 | **L-11**; design §2.3, §2.5 | SA-05x lists the commands that retirement blocks; narrowing the withdrawal treatment stays available after retirement; discard on SA-05c |
| A58 to A68, A70, A71, A76, A77, A80, A87 to A98, axe | Design §2.11, §2.13, §2.16, §1.4, §5; F-36 | Design sentences and names |
| A69 | **L-08**; F-36 as amended | The list and count change is "Unmet" until Core's pending fix (P-19 item 4); the row words apply on the case page |
| A72, A73 | **L-05** | Complete distinguishing summary signatures (exact key sets) or a neutral receipt; competing-operation fixtures |
| A85 | **L-10** | The BFF refuses an incomplete evidence row and an additional indexed row at the field, values kept, for both prefixes |
| §4, §5, §6 lead, §7 | Decisions and P-19 | Traceability adds the release cut-over test; the Unmet and deferred lists by P-19 item; the answers to Q-01 to Q-19 |

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
| CC | `COMMAND-COVERAGE.md` (this folder) | SHA-256 c4c53b06f7d2fc52… | §3 rows of the 11 WP-13 commands; §5.1 WP-13; §5.3 (`cat.*` and launch sub-pages; TA-07 panels); §5.4 (`admin.catalogue.transition` under `/admin/applications`); §6 CC-06, CC-12 to CC-16 |
| LP | `PLAN.md` (this folder) | SHA-256 e894486f73af0e59…; internal 3b06d34 | §3, §4 (LD-02, LD-03, LD-04, LD-07, LD-08, LD-11, LD-12, LD-13, LD-14, LD-16, LD-17), §8 (S-08), §9 |
| PR | `PROPOSALS.md` (this folder) | SHA-256 0547640ae48459e7… | P-02, P-05 (TA-03 eligibility interim), P-06 (launch and expansion revision guard; lift uses the same readiness check), P-10 b (command identity) |
| W2 | `WP-02.md`; `WP-02-design.md`; `WP-02-acceptance.md` | SHA-256 7fe4a07271c809fb…; e8eacaabf622cb83…; bfac75d7e75d34ef… | record §3, §4.1 (B-01 to B-14), §6 (carried forms, rail label, P2 items "cleaned up with WP-13"), code review R-01 to R-03; design §1.2, §1.5, §2.1 to §2.5, §8.2; acceptance §0.2, §0.3, A24, A33, A43, A53, A54, A60 to A62, A71, A79 to A82, A103 to A109, §3 Parts C, D, G |
| W3 | `WP-03.md`; `WP-03-design.md` | SHA-256 581768d6b07dad77…; d4d40cb1d18a7bc2… | record §3, §4.1 (C-02, C-05), §6; design §3.1 (TA-07 offering rows), §3.2, §3.4, §7.5; acceptance WP03-A35, A106, A125 |
| W6–W12 | `WP-06.md` to `WP-12.md` §3 and §4 | SHA-256 adec73b3322fd726…, 2e58a2765a680113…, 7a0c15231350b09f…, 97074922067b5db7…, 75baf8518b9edaf5…, edbea91a683da1c2…, aea7f10624c10b40… | D-02, D-04 (neutral receipts; current and possibly incomplete lists); F-01, F-04, F-07, F-13, F-16, F-22, F-33; E-05, E-06; G-03, G-05, G-07, G-10, G-11; H-02, H-05, H-07; I-05, I-09, I-10; J-06, J-08 to J-10; WP-06 design §2.1 SA-01 group 8 (impact decisions) |
| F1 | Lane research `research/wp13-facts/launch-control-commands.md` | SHA-256 b9bc30e7c488026f… | The four launch commands, launch effects, reads, BFF forms and handlers |
| F2 | Lane research `research/wp13-facts/impact-transition-commands.md` | SHA-256 6a653dfda25f8f8f… | The seven catalogue and transition commands, the impact model, reads, pages and handlers |
| W13 | `WP-13-design.md`; `WP-13.md` | SHA-256 94f94b9299595a95…; 412ff9e096446a8d… | design §1 to §9 (pages, words, receipts, refusals, states, proofs, units, STOP items); record §3 (Q-W13-01 to -10), §4.1 (L-01 to L-13) |
| RV | Lane `research/reviews/WP-13-design-review.md` | SHA-256 8de54d6029cc3374… | R-01 to R-13 |
| AM | `WP-07.md` §4.8; `WP-06.md` §4.5 | SHA-256 2e58a2765a680113…; adec73b3322fd726… | F-36 as amended (L-08); D-18, D-19 as amended (L-08) |
| P19 | `PROPOSALS.md` P-19 (lane `output/proposals/P-19-wp13-offering-change.md`) | SHA-256 0547640ae48459e7… | Items 1 (Accept waits for a readable before/after), 2 (binding id as compatibility evidence), 3 (Kind 1 reads: STOP-W13-02, -06), 4 (defects: STOP-W13-03, -04, -05, the pending answer) |
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
- **Transitions.** `cat.approve_transition` opens a per-application transition to the offering's head **at command
  time** (`headOf(offering)`; no reviewed head is posted, STOP-W13-05 a). A draft, or a submitted application whose 17
  authority-bearing declaration items are unchanged and whose engineering statement does not ask for authority, moves
  at once. A submitted application with an authority-bearing change waits for the travel agent
  (`awaiting_ta_authority`); Core posts the travel agent a notice that needs acknowledgement. While it waits, `submit`,
  readiness, packet release and the authorizations are blocked `transition_pending`; the pending answer is the travel
  agent's `decide_transition` when the application is unassigned, otherwise the assigned operator's `return_to_ta`.
  `core.decide_transition` takes `apply` or `decline`; `apply` moves the application to the transition's stored
  target, which may no longer be the head, and nothing rechecks it against a newer change (STOP-W13-05 b, suspected).
  A decline leaves the item `transition`, the application `affected_pending` (blocked `catalogue_impact_unknown`),
  opens no new transition, posts no notice and is counted nowhere (STOP-W13-03). A second `cat.approve_transition`
  after a decline or an immediate apply is accepted and opens nothing (STOP-W13-04).
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
  `views.admin_applications {offeringId}` (a projection, pages of 200 with `next`, its own freshness) lists the
  applications of an offering; the decision pages link to it and claim no count.
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
- **Offering-change words** (draft; design §2.11 and §2.13 govern; the facts stay). Staff: suspension "Suspended since
  [time] IST"; existing-work treatment `continue` "Continues", `hold` "Held", `missing` "Not decided yet: held"; the
  suspend choices "Let existing work continue", "Hold existing work", "Not decided yet: hold it until I record a
  treatment"; withdrawal "Withdrawn [time] IST" with "Submitted, unfiled work after the withdrawal" and "Permitted at
  withdrawal: yes / no"; retirement "Retired". Effects "Allowed", "Held", "Refused" with Core's codes in the §2.13.5
  sentences. Impact (§2.13): treatment `pending` "Needs a decision", `continue` "Continues", `transition` "Transition
  approved", `hold` "Held"; assessment states "Rechecking", "Review required", "Reviewed" (it never means that nothing
  waits: holds and declined transitions are not counted), "Replaced"; decisions "Continue on its current terms", "Move
  to the head without a transition", "Hold", "Not affected"; every cause, change class and classification has words.
  A transition target is named exactly (L-02): before the send "the offering's head read at [time] IST" with its
  versions; for the travel agent "the terms TravelMudra approved for this application"; never "the current terms".
  Travel agent (§2.11): suspended "TravelMudra has paused new applications for this service. Applications you already
  started are kept; each one shows on its own page what it can do now."; withdrawn "TravelMudra has withdrawn this
  service for good. …"; retired "This service is not offered for new applications."; changed terms "TravelMudra changed
  the terms of [service] and approved moving this application to the changed terms." Never: "Relaunch", "Override",
  "migrated", "automatic", "closed" or "disabled" for a suspension, "paused", "temporarily" or "until … again" for a
  withdrawal, "continues as TravelMudra decided", "did not permit" for a withdrawal that permitted continuation and was
  narrowed later (L-04), "Accepted the changed terms" or "Declined" on a receipt, "applied" for a transition no read
  shows applied, "Approved" or "Done" as an overall status.
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
  command only when the operation's resource and the complete distinguishing summary signature (the exact set of
  domain keys and their formats, design §2.14) establish it (L-05; A72); a transition receipt never claims that a
  transition was created, waits or was applied. Recorded facts come only from the stored summary; everything read after is "Current" (J-08).
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
- **Paths (LD-03; design §1.3, §1.5).** Existing POST paths and form actions stay: suspend
  `/admin/catalogue/offerings/:offeringId/suspend`, treatment `…/existing-work-treatment`, lift `…/lift-suspension`,
  withdraw `…/withdraw`, recheck `…/recheck`, retire `…/retire`, discard `/admin/catalogue/declarations/:declarationId/retire-draft`,
  reviewer `/admin/catalogue/impact/:assessmentId/reviewer`, item decision
  `/admin/catalogue/impact-items/:itemId/decision`, transition `/admin/applications/:applicationId/transition`, the
  travel agent's decision `/ta/applications/:applicationId/transition-decision`. Host pages (Q-W13-01, CC-18): SA-05j
  `…/offerings/:offeringId/launch/decide/:kind` with the kinds `suspend`, `suspension_treatment`, `lift`, `withdraw`,
  `withdrawal_treatment`; SA-05x `GET …/offerings/:offeringId/retire`; SA-05b hosts the recheck; SA-05c hosts the
  discard; SA-05l `/admin/catalogue/impact`; SA-05m `/admin/catalogue/impact/:assessmentId` hosts the reviewer form;
  SA-05n `/admin/catalogue/impact/:assessmentId/items/:itemId` (item decision); SA-05t
  `/admin/catalogue/impact/:assessmentId/items/:itemId/transition`; TA-07t
  `/ta/applications/:applicationId/changed-terms`. Pages of other packages: TA-02, TA-03 (WP-02); TA-05, TA-07, TA-08,
  TA-09c (WP-03); TA-10 (WP-08); SA-01, SA-03a, SA-04a, SA-07a (WP-06, WP-11); OP-01, OP-02 (WP-07). An item names the
  page; the run record names the path used.
- **Pass rule.** WP-13 passes when every `L` item passes on `lane-ui` at the integrated ref, every `T` item has a
  named passing test at that commit, every axe item passes, and the proofs of §3 pass, except the explicitly deferred
  items of §5. The run record lists each deferred item as "Deferred" with its reference, not as "Fail". Recorded as
  "Unmet" with their owner, never passed by pinning a defect: Accept on TA-07t (A47, A48: "Unmet, waits for Max's
  decision on P-19 item 1"); the exact transition target (A120, A121: "Unmet, waits for the Core guards of P-19 item
  4"); every binding-only transition proof as B06 acceptance (A41 to A43, §3 C5, C6: "Unmet, waits for Max's decision
  on P-19 item 2"); the decline dead end and the empty repeat approval (A45, A49: P-19 item 4); OP-01's list and count
  move of held cases (A69: P-19 item 4, L-08). "Partly met" until a read serves the facts: A06 (STOP-W13-07, -02), A20
  (one treatment per cause; no per-application treatment), A64 (STOP-W13-06, P-19 item 3). An item that the architect
  marks "partly met" by a recorded decision passes with that note. A failed item becomes a finding ranked P0, P1 or P2
  with its scenario (PRI-20260930-01). V20 and BU-27 acceptance stays qualified while these Unmet items stand.
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
| Travel agent | Y, `wp13-ta-[stamp]`, a fresh synthetic travel agent per run (SA-06; Q-W13-07) | The launch audience of O; every application of the run |
| Offering O | Synthetica (SYN), service code `wp13_[stamp]`, title "WP-13 proof [stamp]", mode "TravelMudra files"; declaration version 1 copied from the head body of "SYN Tourist e-visa" (WP-02 §3 D3); structural owner approval with synthetic evidence; binding from the active release; values ₹3,300, 5 to 12 calendar days; launch plan complete; launch for named Y only | The run's offering. Seeded offerings stay untouched |
| Declaration version 2 | Version 1 with `eligibility.travelDateRules.minDaysBeforeTravelStartToSubmit` changed from 3 to 5 (design §6.3 V20-5: an authority item; the group at + 30 days stays valid); structural owner approval; binding; values for version 2; published with the continuation "Existing drafts: Hold for review" and "Submitted, unfiled work: Move to the new head" (for a structure this leaves each submitted application waiting for a decision, F-W13-10) | The structural update of a launched, unsuspended offering (V20 clauses 2 and 3); a submitted application needs renewed travel-agent authority |
| Declaration version 3 | A draft copy of version 2, never approved | The draft discard on SA-05c |
| Group | `wp13-[stamp]` in Synthetica; travel start today + 30 days, return today + 40 days | Every application of the run |
| D1, D2 | Drafts for O on version 1 (applicants DEV, DIA); held by the publication's policy (owner SA1, the publisher) | D1: a transition that applies at once; D2: continues on its current terms; D2 later meets the withdrawal |
| S1, S2 | Submitted for O on version 1, unpaid, unassigned (applicants SAM, SUR); "Need a decision" after the publication | S1: a transition that waits for the travel agent (no Accept, L-01); S2: a transition the travel agent declines (STOP-W13-03) |
| P | Submitted for O on version 1, "Payment received" (`SYN-W13-[stamp]-P`), assigned to OP1 (applicant PIA) | Held, then continued impact item; operator work under suspension, treatment and withdrawal |
| D3 | A draft for O created after version 2 is published (applicant DIN) | New cases use the new head; submission under a suspension with "continue" |
| E | A draft for "SYN Tourist e-visa" in the same group (applicant ELA) | Unaffected control: no item, no hold |
| Passports | `td3Lines` of a `SyntheticPassport` with surname `SYNWPTHIRTEEN`, document code P, issuing state and nationality IND, expiry at least six months after the return date, number "S" + seven digits new to the run; `passportTextPdf` or `passportImage` (`test/fixtures/documents/samples.ts`) | Intake |
| Photographs | `plainPng` at least 350 × 350 px | Intake |
| Evidence and reasons | External references `SYN-W13-[stamp]-[step]`; attestations "WP13 [stamp] …"; for a transition, a release manifest typed by SA1 that names the target binding reference shown on SA-05t (no value is prefilled; a binding-only proof, L-03); reasons "WP13 [stamp] …" of at least 10 characters | Every decision |
| Fixtures (tests only) | A suspended or withdrawn offering with each treatment and both; a withdrawal permitted then narrowed; an assessment superseded by a later head with a carried hold; an item whose `valid_through` is behind; a `filed_historical` item; a declined transition; an application with an act `authorized`, `filing_unknown` or `reconciliation_exhausted`; an assigned application with an awaiting transition; an application with an outcome; a newer head published between SA-05t's load and its send, and before the travel agent's decision; competing operations for the receipt signatures (a publication, an owner approval, a declaration preview, a repeat transition approval); a never-launched retired offering; a group whose country has no selectable offering | T items |

### 0.4 Run recipe (rerunnable)

- Run tag `wp13-[yyyymmddhhmm]`. First check: the harness can sign in SA1, SA2, OP1, OP2 and `syn-ta-2`, and can
  create and sign in Y; "SYN Tourist e-visa" admits Y after activation (TA-03).
- Baseline (step P-0, before the set-up): SA-05a rows; SA-01 group 8 and the group "Suspended offerings"; OP-01 view
  counts of OP1; TA-10 count of Y right after activation; TA-02 of `syn-ta-2`. Every later count check is a delta from
  its own baseline; counts of different scopes are never compared with each other (L-12).
- Setup (labelled "Setup", through integrated pages): SA1 creates and activates Y (SA-06). SA1 creates O and admits it
  (WP-02 §3 D2 to D7, D9 and D10 with the values of §0.3; launch for named Y). Y creates the group and D1, D2, S1, S2
  and P on TA-09c, submits S1, S2 and P on TA-08, and creates E. SA1 records the payment of P (SA-07a) and assigns P to
  OP1 (SA-03a). Later set-up (declaration version 2, its values and publication; OP1's work on P; version 3) is in the
  steps of §3.
- Every harness send uses the fields of a freshly loaded page unless the step says "raw". A raw envelope is built from
  a page loaded earlier in the run and named in the run record.
- Order (§3): P-0, Setup, Part A (publication does not launch), Part B (structural update of a launched offering),
  Part C (impact decisions and transitions), Part D (the travel agent's changed terms), Part E (suspension and
  treatment, BU-27), Part F (retirement blocked, lift), Part G (withdrawal), Part H (discard, retirement, then the
  withdrawal's narrowing after the retirement, L-11), Part X (isolation, tests, axe). Parts G and H cannot be undone
  and run last. Data of earlier runs stays and is excluded by its code and tag.
- If the recheck task has not classified the items when Part B reads them, the step waits for the assessment state to
  leave "Rechecking" (re-reading SA-05m; no fixed delay) and the run record says how long it took.
- If the lift of Part F is refused because the launch plan is not complete for version 2's head, SA-05j `lift` shows
  the unavailable state of A22, SA1 records a new plan version (Setup, SA-05i) and the lift runs again.

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
| SA-05h Offering: Readiness and launch (WP-02 page) | 4652 `/admin/catalogue/offerings/:offeringId/launch` | New section "Suspension, withdrawal and existing work"; next action and readiness note; the four receipt codes; the carried forms leave |
| SA-05j Launch decision, kinds `suspend`, `suspension_treatment`, `lift`, `withdraw`, `withdrawal_treatment` (WP-02 page) | 4652 `/admin/catalogue/offerings/:offeringId/launch/decide/:kind` | One decision page per kind (CMP-25) |
| SA-05x Retire the offering | 4652 `GET /admin/catalogue/offerings/:offeringId/retire` (new) | `cat.retire_offering` |
| SA-05b Offering: Definition and values (WP-02 page) | 4652 `/admin/catalogue/offerings/:offeringId` | "Impact on existing work" with the recheck form (host); "Retire this offering" as a summary and a link |
| SA-05c Declaration version (WP-02 page) | 4652 `/admin/catalogue/declarations/:declarationId` | "Discard this draft" (host, rebuilt) |
| SA-05l Impact review | 4652 `/admin/catalogue/impact` (kept, rebuilt; rail member) | Assessments rechecking or waiting for review |
| SA-05m Impact assessment | 4652 `/admin/catalogue/impact/:assessmentId` (kept, rebuilt) | The assessment, its item groups, the reviewer form (host), links to SA-05n and SA-05t |
| SA-05n Decide the impact on one application | 4652 `/admin/catalogue/impact/:assessmentId/items/:itemId` (new) | `cat.decide_impact_items` for one item |
| SA-05t Approve a transition | 4652 `/admin/catalogue/impact/:assessmentId/items/:itemId/transition` (new) | `cat.approve_transition` for one application |
| SA-05a, SA-05e, SA-05g (WP-02 pages) | 4652 | The "Existing work" link and words; SA-05e's two sentences; SA-05g's crumb |
| TA-02, TA-03 (WP-02 pages) | 4650 `/ta/catalogue`, `/ta/catalogue/:offeringId` | The suspended, withdrawn and retired sentences |
| TA-09c, TA-05 "Add applicants" (WP-03 pages); bulk entry (existing page until the bulk packages) | 4650 | BU-27: a service that cannot be chosen, its reason and owner; earlier accepted work kept |
| TA-07 (WP-03 page) and TA-07t Changed service terms | 4650 `/ta/applications/:applicationId`; `/ta/applications/:applicationId/changed-terms` (new) | TA-07: the step link, the "Service terms" row and the policy notices; TA-07t: `core.decide_transition` |
| TA-08 Check and submit (WP-03 page) | 4650 | The submit notices under a suspension, a withdrawal, a waiting transition or an undecided change |
| TA-10 Notices (WP-08 page) | 4650 | Observation: the transition notice and its link (AM-W13-04) |
| OP-02, OP-01 (WP-07 pages) | 4652 | F-36 rows on the case page (owner SuperAdmin, sentences, no form); the list and count change Unmet (L-08) |
| SA-01 (WP-06 page) | 4652 `/admin` | Observation: group 8 (D-18) and "Suspended offerings" (D-19) |

Read models: Offering administration (`cat.admin_index`, `cat.admin_offering`, `cat.admin_declaration`,
`cat.admin_impact_index`, `cat.admin_assessment`, `ops.launch_overview`, `ops.launch_offering`), accounts
(`iam.admin_accounts`, optional, for the SuperAdmin selects), applications list (`views.admin_applications`, link
only), Offering catalogue (`cat.selectable_offerings`, `cat.offering_display`), TA application case
(`core.ta_application`), Operator case (`core.ops_case`), SuperAdmin case (`core.admin_case`), Notices, Operation
(`core.operation`).

### 1.2 Command coverage (CC §5.1: 11 WP-13 commands)

UI-PLAN §12.2 names four commands for WP-13. "Record existing-work treatment" is `ops.record_existing_work_treatment`;
"Suspend offering", "Lift suspension" and "Withdraw offering" are the three `ops.*` commands. The other seven complete
the change of an offering that SA-05 (full) and TA-07 carry (CC §5.3; CC-06): the impact review
(`cat.assign_impact_reviewer`, `cat.decide_impact_items`, `cat.request_impact_recheck`), the per-application transition
(`cat.approve_transition`) and its travel-agent decision (`core.decide_transition`), and the ends of a lifecycle
(`cat.retire_offering`, `cat.retire_declaration_draft`). Host pages as Q-W13-01 (CC-18).

| # | Command | Route id (POST path) | Host page | Items |
|---|---|---|---|---|
| 1 | `ops.suspend_offering` | `admin.launch.suspend` (`…/offerings/:offeringId/suspend`) | SA-05j kind `suspend` | A07 to A13 |
| 2 | `ops.record_existing_work_treatment` | `admin.launch.treatment` (`…/existing-work-treatment`) | SA-05j kinds `suspension_treatment` and `withdrawal_treatment` | A14 to A20, A122 |
| 3 | `ops.lift_suspension` | `admin.launch.lift` (`…/lift-suspension`) | SA-05j kind `lift` | A21 to A25 |
| 4 | `ops.withdraw_offering` | `admin.launch.withdraw` (`…/withdraw`) | SA-05j kind `withdraw` | A26 to A31, A122 |
| 5 | `cat.assign_impact_reviewer` | `admin.catalogue.impact_reviewer` (`/admin/catalogue/impact/:assessmentId/reviewer`) | SA-05m | A34 |
| 6 | `cat.decide_impact_items` | `admin.catalogue.impact_decision` (`/admin/catalogue/impact-items/:itemId/decision`) | SA-05n | A35 to A37, A39, A123 |
| 7 | `cat.request_impact_recheck` | `admin.catalogue.recheck` (`…/offerings/:offeringId/recheck`) | SA-05b | A38 |
| 8 | `cat.approve_transition` | `admin.catalogue.transition` (`/admin/applications/:applicationId/transition`) | SA-05t | A41 to A46, A120 |
| 9 | `core.decide_transition` | `ta.applications.transition_decision` (`/ta/applications/:applicationId/transition-decision`) | TA-07t | A47 to A52, A121 |
| 10 | `cat.retire_offering` | `admin.catalogue.retire` (`…/offerings/:offeringId/retire`) | SA-05x | A53 to A55, A57 |
| 11 | `cat.retire_declaration_draft` | `admin.catalogue.declaration_retire` (`/admin/catalogue/declarations/:declarationId/retire-draft`) | SA-05c | A56 |

All of them also: A71 (shell), A72 (receipt checked against the operation), A73 (no instruction from history), A74
(no record for a refusal; lost acknowledgement), A75 (replay matrix), A76 and A77 (refusal text), A78 (LD-14 and
outages), A79 to A84 (role controls, copy, support view, storage, host pages and carried forms, isolation), A85 (LD-17
and the evidence rows), A86 (values kept and refusals never lost).

Commands outside WP-13 that the proofs touch only as set-up or observation: `iam.create_account`,
`iam.activate_account`, `cat.create_offering`, `cat.draft_declaration`, `cat.record_owner_approval`,
`cat.bind_declaration`, `cat.edit_baseline`, `cat.preview_declaration`, `cat.publish_declaration`,
`ops.record_launch_plan`, `ops.approve_launch`, `ops.expand_launch_scope` (WP-02); `core.create_group`,
`intake.start_individual`, `core.edit_draft`, `core.submit` (WP-03); `pay.record_service_status`, `core.assign` (WP-06);
`ops.start_work`, `ops.record_readiness` (WP-07); `dlv.acknowledge_notice` (WP-08, observation only);
`iam.start_support_view` (test only).

### 1.3 State coverage

S1 (loading) does not apply: every WP-13 page is server-rendered. S5 applies only to SA-01, OP-01 and the linked
applications list (projections), which WP-13 observes. A "closed state" is the page with no form and the reason
(design §2.2 to §2.10 states).

| Page | Page states | C1 validation | C2 rejected | C3 accepted | C4 unresolved | C5 stale |
|---|---|---|---|---|---|---|
| SA-05h, SA-05a, SA-05g, SA-05b | Launched; suspended with each treatment; lifted; withdrawn with each treatment; both; retired A01 to A05; facts not returned A06; outage A78 | — | — | receipts A09, A15, A23, A28, A38, A54 | — | — |
| SA-05j `suspend` | Form A07; not launched, already suspended, withdrawn (closed) A10 | A08 | A10 | A09 | A11 (5) | A10 (3) |
| SA-05j `suspension_treatment` | Not decided (radio) A14; one change (hidden value) A16; not suspended (closed) A18; treatment row unreadable A78 | A16 (4) | A16 | A15, A16 | A19 (5) | A16 (3), A19 |
| SA-05j `lift` | Form A21; a launch requirement not met (unavailable) A22; not suspended (closed) A24 | A24 | A22, A24 | A23 | A25 (5) | A24 (3) |
| SA-05j `withdraw` | Form A26; already withdrawn or not launched (closed) A29 | A27 | A27, A29 | A28 | A30 (5) | A29 (3) |
| SA-05j `withdrawal_treatment` | Form A17; already held or not withdrawn (closed) A17 | — | A17 | A17 | A19 (test) | A16 (class) |
| SA-05x | Unavailable while launched A53; form A54; retired (closed) A55; launch summary unreadable A78 | A54 | A53, A55 | A54 | A55 (5) | A55 |
| SA-05c discard | Form A56; not a draft (refusal first in `main`) A56 | A56 | A56 | A56 | A56 (5) | A56 |
| SA-05l | Listed assessments; recheck failed; empty A32 | — | — | — | — | — |
| SA-05m | Rechecking; review required; reviewed; replaced; groups incl. "Historical (filed)" A33, A123 | A34 | A34 | A34 | A34 (6) | A34 |
| SA-05n | Options by item facts A35; not current, closed application, `filed_historical` (closed) A36, A123; transition-treated A45 | A36 | A36, A39 | A35, A45 | A37 (5) | A36 |
| SA-05t | Form A41; not offered (closed) A41, A45; head unreadable A78 | A44 | A44, A120 | A42, A43 | A46 (5) | A44 |
| TA-07t, TA-07 panel | Waiting with Decline (no Accept) A47, A48; with the operator A50; support view A81; nothing waits A52 | A49 | A51 | A49 | A52 (5) | A51 |
| TA-02, TA-03, TA-09c, TA-05, bulk entry | Suspended; withdrawn; retired; no service selectable A58 to A62 | — | A60, A62 | — | — | — |
| TA-07, TA-08 | Draft or submitted under each treatment; an undecided, held or declined change A63 to A65 | — | A63 | — | — | — |
| OP-02, OP-01 | Held actions; impact blockers; a transition waiting for a return A67 to A69 | — | A67 | — | — | — |

### 1.4 Specification scenarios

| Scenario | What WP-13 shows | Items |
|---|---|---|
| V20 clause 1: "Publication/released binding does not launch a new route" | O after binding and publication is "Not launched", invisible to Y and refused for new work; a suspension or withdrawal of a not-launched O is refused; a never-launched offering can only be retired | A10 (1), A29 (2), A57; §3 Part A (WP02-A38, A54 observed; the release cut-over test) |
| V20 clause 2: "Existing-case impact is explicit" | The publication of version 2 opens an assessment; every open application of O on version 1 is an item with its classification, treatment and owner; an undecided or held item blocks submission and readiness with its reason and owner; each decision (continue, hold, transition) and the travel agent's decision are explicit; the transition target is named exactly; a suspension or withdrawal shows its effect per action | A02, A33, A35, A40 to A49, A63 to A68, A120, A121; §3 Parts B to D |
| V20 clause 3: "Supported structural update to launched unsuspended offering needs no invented second launch approval for new cases" | After version 2 is published the launch state, audience and decision are unchanged; the readiness note and SA-05e say so; SA-05j `launch` offers no form; Y's next draft (D3) is created on version 2 | A05, A40; §3 Part B |
| UX §3.2 Withdrawn/suspended offering | New work refused; drafts submit only under "continue" during a suspension and never after a withdrawal; the effects table and each case page name the treatment per action; "not decided" holds operator work; overlapping controls named; duties continue (test) | A02, A09, A15, A28, A58 to A70, A122 |
| UX §6.3 Launch/suspension/lift: exact scope, reason, evidence; a lift restores only approved scope | Decision pages with scope, evidence, reason and effect; the lift names the audience it restores; expansion refused while suspended | A07, A21, A23 (WP02-A80) |
| UX §6.3 Publication and impact: supported continuation, evidenced per-application transition with renewed TA authority where required, or an owned hold | SA-05n choices; SA-05t evidence (binding-only proofs Unmet for B06 until P-19 item 2); TA-07t Decline and the waiting state (Accept Unmet until P-19 item 1); hold owner named | A35, A41 to A52, A80 |
| BS B07: one attributed SuperAdmin; payment cannot force a withdrawn service; the more restrictive treatment wins | One SuperAdmin decides each kind; no payment input; combined effects list both codes | A02, A12, A28, A122 |
| BU-27 | TA-03, TA-09c and the bulk entry choose no default and name the reason and owner; earlier drafts and submissions stay with their own state; a draft whose terms changed shows its blocker and owner; the owner after a decline is Unmet (P-19 item 4) | A40, A49, A58 to A66; §3 Parts B, D, E, G |
| UX §12 V24 (keyboard and phone) | The WP-13 decision pages and TA-07t by keyboard and at 390 px | A87 to A98 |

## 2. Acceptance checklist

WP-02 items stay WP-02's and are not repeated: the offering list (WP02-A33), the four panels (WP02-A43), the
publication decision and impact preview (WP02-A53, A60 to A62), the launch decision anatomy (WP02-A71 to A78), the
expansion (WP02-A79, A80), the effects table before WP-13 (WP02-A81) and the values publication without a second launch
approval (WP02-A82). WP-13 items extend them where the WP-13 states change what those pages show.

### 2.1 SA-05 offering administration: reading

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP13-A01 | SuperAdmin (SA1) | SA-05h of O, section "Suspension, withdrawal and existing work" (`#existing-work`), in each state of §3 (launched; suspended with the treatment not decided, "continue", "hold"; lifted; withdrawn with continuation permitted, then narrowed; suspended and withdrawn by fixture) | Read the status facts, the lead, "Existing-work treatments", "Suspensions", "Decisions" and the applications link. | Status facts (CMP-03) on separate rows in the words of design §2.1 item 4 and §2.13.3: "Suspension" ("Not suspended" / "Suspended since [time] IST"), "Reason for the suspension", "Existing work during the suspension" ("Continues", "Held", "Not decided yet: held"; no treatment row → "Not recorded: existing work is held"), "Withdrawal" ("Not withdrawn" / "Withdrawn [time] IST"), "Submitted, unfiled work after the withdrawal" (current withdrawal treatment, with "Permitted at withdrawal: yes / no"). The lead says that launch control never stops outcome recording, delivery, completion or reassignment, and that act evidence, reconciliation, the return of originals and incidents keep their own checks. "Existing-work treatments" lists each treatment the read returns (for: the suspension of [date] / the withdrawal; treatment; "In force" / "Replaced or ended"). "Decisions" holds only the links whose SA-05j kind has a form in the current state (§2.2); no form of the four launch commands stays on SA-05h; the carried forms, their `?done=` flashes and their test entries are gone (A83). The link "Applications of this offering" (`/admin/applications?offering=…`) says the list can lag and shows its own freshness. Suspended and withdrawn at once: both facts and both treatments. Freshness "Read at [time] IST". | L (+T for the fixture) | UX §6.3 ("Display current launch scope and suspension independently"); PL SA-05; design §2.1; `contracts/catalogue.ts:287-311` |
| WP13-A02 | SuperAdmin; test | SA-05h "What launch control allows now" (WP02-A81 table) and the Evidence block of every SA-05j kind, in the states of A01; fixtures for every row of F1's matrix (suspended + withdrawn included) | Read the table in each state. Test: render each fixture. | Each row shows Core's effect and every contributing code, in Core's order, with the design §2.13.5 sentences: suspended → create a draft "Refused"; treatment not decided → submit and the operator rows "Held: No existing-work treatment is recorded for the suspension, so existing work is held."; "hold" → "Held: Existing work is held by the suspension's treatment."; "continue" → submit and the operator rows "Allowed"; withdrawn → submit "Refused" (`offering_withdrawn`), the operator rows "Allowed" (continuation) or "Held" (`withdrawal_continuation_not_permitted`, A31 words); both → every code listed. "Record the outcome" stays "Allowed" in every state. The generic recovery text never shows for `existing_work_hold`, `existing_work_treatment_missing` or `withdrawal_continuation_not_permitted` (F-W13-01). The table is labelled as Core's answer for a travel agent in the approved audience and an application admitted under the current launch; no row states a permission for a named application; the page computes no effect. | L+T | UX §3.2, §6.3; BS B07; `effect.ts`; design §2.1 item 5, §2.13.5; `test/unit/catalogue.test.ts` "existing work follows the treatment; the most restrictive control wins and every contributor is listed" |
| WP13-A03 | SuperAdmin | SA-05a, SA-05g and the SA-05b summary card of O; SA-01 (observation) at each part of §3 | Read O's row and card; read SA-01. | Launch, suspension, withdrawal and retirement are separate facts. SA-05a's "Existing work" cell reads "[n] open: unknown, pending or held" (Core's `openItems`) and links to SA-05b `#assessments` (D-W13-14). SA-05g's crumb reads "Offerings". A suspended offering never reads "Not launched"; a withdrawn one never reads "Suspended" or "Paused"; a retired one reads "Retired". SA-05g and SA-01 read no treatment and claim none. Observation of WP-06's groups (not compared with any other count, L-12): group 8 counts offerings from `openItems` with the line "A transition that the travel agent declined is not counted yet." (D-18); the group "Suspended offerings" lists O while suspended with "check treatment" and never says "held" or "continues" (D-19 as amended by L-08). | L | PL SA-05; UX §6.3; design §2.12 item 1; `WP-06.md` §4.5 D-18, D-19 |
| WP13-A04 | SuperAdmin (SA1) | SA-05b of O, sections "Impact on existing work" and "Retire this offering", after §3 Part B | Read both. | "Impact on existing work" (`#assessments`) lists every assessment of O (number linked to SA-05m, cause and state in the words of design §2.13), the line "Held applications and transitions the travel agent declined stay with the assessment that decided them. Open each assessment to see them.", the link "Impact review" and the rebuilt recheck form (A38; SA-05b is its one host). "Retire this offering" is a summary and a link to SA-05x ("Ends new selection for good. Open work keeps its terms."), or, while launched and not withdrawn, the CMP-10 "Retiring is unavailable until the offering is withdrawn. Owner: SuperAdmin." with the link "Readiness and launch"; no retire form on SA-05b. | L | Design §2.4; CC-12 to CC-16 (one host page per command) |
| WP13-A05 | SuperAdmin (SA1); test | SA-05h next action (CMP-01) and the readiness note; SA-05j kind `launch`; SA-05e (observation) in each state of §3; renderer test with fixtures | Read. | First match (design §2.1 item 2): withdrawn with treatment "continue" → owner SuperAdmin, "The offering is withdrawn for good. Submitted, unfiled work continues as the withdrawal permits.", secondary "Hold the remaining work"; withdrawn otherwise → owner "No one", "Nothing. The offering is withdrawn for good; there is no relaunch. Submitted, unfiled work is held."; suspended with the treatment not decided → owner SuperAdmin, blocker type "decision", "Existing work of this offering is held until you record how it continues during the suspension." → "Record the existing-work treatment", secondary "Lift the suspension"; suspended otherwise → "New work is suspended. Existing work [continues / is held] (the treatment you recorded). Lifting restores exactly the approved scope." After a structural publication of a launched, unsuspended offering (§3 Part B): the readiness note "A launch decision stays in force when the definition or the business values change: new cases of the audience use the new head at once, with no new launch decision. …" shows, no step asks for a launch, SA-05j kind `launch` has no form, and SA-05e's Effect says "If the offering is launched, new cases of its audience use this version at once. No new launch decision is needed." The panel never says that an action is allowed. | L+T | UX §6.3, §12 V20 (clause 3); BS B06 (last sentence), B07; design §2.1 items 2, 3, §2.12 item 2; F-W13-14 |
| WP13-A06 | SuperAdmin; test | SA-05h, SA-05j receipts, SA-05x, SA-05m, SA-05n | Look for who suspended, lifted, withdrew, recorded a treatment, retired or decided an item, and when and why. | The pages show only what the reads return (suspension time and reason; treatment values; withdrawal time and permission; item applicability, classification, treatment and hold owner). Facts no read returns (actor, evidence and reason of a lift, withdrawal, treatment or retirement; when a suspension was lifted; the item's decider, time, reason and evidence) are not shown and not invented; where `views.audit_subject` returns one as an explicit recorded field it may show with source and time (WP-11 I-10). Nothing is reconstructed from clock order. Partly met until STOP-W13-07 and STOP-W13-02 are served (Q-09). | L+T | BS B33; WP-02 B-06; WP-11 I-10; design §2.1 item 4.1, §9.4 STOP-W13-02, -07 |

### 2.2 Suspend an offering (`ops.suspend_offering`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP13-A07 | SuperAdmin (SA1) | SA-05j kind `suspend` of O, launched for Y (§3 E1) | Open "Suspend this offering" from SA-05h. Read the page from the top. Select "Cancel". | CMP-25 frame (WP02-A71). `h1` "Suspend: [offering]". Scope: offering, who files, "Launched", current audience ("1 named travel agent: [Y]"), the launch decision in force. Evidence: Core's effects table (A02) and the link "Applications of this offering" with "Inspect them before you decide." Effect (design §2.2.1): "New selection, intake and draft creation stop at once for every travel agent of the audience." and, per choice, "Let it continue: drafts can still be submitted, and preparation, readiness, packet release and filing go on under their own checks." / "Hold it: submission of drafts, help requests, assignment, preparation, readiness, packet release and filing are held." / "Not decided yet: the same actions are held until a treatment is recorded."; unchanged: the audience and the launch decision, outcome recording, delivery, completion, reassignment, act evidence, reconciliation, originals, incidents, payment facts. No sentence says that submission always stops (F-W13-02). Hard stops: no widening while suspended; a lift needs the launch requirements again. Fields: radios "Let existing work continue", "Hold existing work", "Not decided yet: hold it until I record a treatment" (none preselected); one evidence row (required; A85); reason (10 to 1000 characters). Review before the button "Suspend offering"; "Cancel" returns to SA-05h and records nothing (controls revision delta 0). | L | UX §6.3 (Launch/suspension/lift); BS B07; design §2.2.1; F1 headline 6 |
| WP13-A08 | SuperAdmin (SA1); harness; test | SA-05j kind `suspend` (§3 E1) | (1) Send with nothing chosen or filled. (2) Choose "Not decided yet", fill the reason, leave the evidence empty; send. (3) Harness, each changing one value of an otherwise valid form: a reason of 1001 characters; an evidence note holding an address; an evidence reference of 201 characters; `existingWorkTreatment=missing`. (4) BFF test: the same values through the handler. | (1) C1 error summary (CMP-07): "Choose how existing work continues during the suspension.", "Add the evidence for this decision.", the reason. (2) The evidence error; the choice and the reason stay. (3) Each refused at its field (`too_big`, `email_like`, `invalid_value`) with every typed value and the choice kept; no field is cut. (4) The handler sends every field whole; a value over Core's limit is refused at its field, never shortened (LD-17). Nothing is recorded in each case (controls revision delta 0; effects unchanged). | L ((1) to (3)) + T | CMP-07; LD-17; WP-02 R-02, R-03; design §2.16, §2.17 |
| WP13-A09 | SuperAdmin (SA1); TA (Y, `syn-ta-2`) | SA-05j `suspend`, SA-05h, TA-02 and TA-03 of Y, `syn-ta-2`'s TA-02 (§3 E1, E2) | Suspend with "Not decided yet", evidence `SYN-W13-[stamp]-S1`, a reason. Read the receipt and SA-05h. Y reads TA-02 and TA-03 of O. `syn-ta-2` reads TA-02. | C3 receipt on SA-05h "Offering suspended" (signature of A72); Recorded "Existing work: Not decided yet: held" from the summary; Current: the suspension state, the current treatment and the "create a draft" effect; "Recorded once. Sending the same form again does not repeat it."; no accepted time. SA-05h next action "Record the existing-work treatment" (A05). Y: TA-02 lists O "Not available for new applications" and TA-03 shows A58's text; `syn-ta-2`: O is absent (TA-02 delta 0). The audience is unchanged. | L | BS B07; UX §3.2; WP02-A24; design §2.14 |
| WP13-A10 | SuperAdmin (SA1, SA2); harness; test | Suspension refusals and closed states | (1) Harness, in §3 Part A before the launch: a suspension of O with a fresh controls revision; then read SA-05j `suspend`. (2) Harness, after A09: a second suspension with a fresh revision. (3) SA2 opens SA-05j `suspend` before A09; SA1 suspends; SA2 sends. (4) Read SA-05j `suspend` after the withdrawal (§3 G2). Test: a hand-made suspension of a withdrawn offering. | (1) Refused `offering_not_launched`; the page is the closed state "Suspending needs a launched offering. This offering is not launched." with the link "Retire this offering"; nothing recorded. (2) `suspension_active`: the closed state "This offering is already suspended. Nothing changed." with links to the treatment and the lift kinds. (3) C5 (CMP-14, design §2.15): Launch, Suspension, Withdrawal, Existing work current beside SA2's unsent choice, evidence and reason, which stay; `stale_revision`; nothing recorded. (4) The closed state "This offering is withdrawn. A withdrawal already stops new work for good; narrow existing work with the withdrawal's treatment." with the link to `withdrawal_treatment` when it applies (D-W13-07); no form. Test: Core accepts the hand-made suspension (no guard, STOP-W13-08); SA-05h then shows both controls and Core's combined effect (A122). Controls revision delta 0 for every refusal. | L ((1) to (4)) + T | BS B07; design §2.2.1 states, §2.16; F1 §1 |
| WP13-A11 | SuperAdmin (SA1); harness | Suspension, the Nth time | Replay terms 1 to 5 on A09. Term 2 changes the reason. Term 3: Back after the receipt; harness: a new-key send from the page loaded before A09 with a fresh revision. Term 4: A08 (2), then A09. | (1) The same 303 and receipt; one suspension (`launch-control.test.ts` "suspension: Nth retry replays without a second suspension"). (2) Refused as a used form; nothing recorded. (3) Back reloads SA-05j `suspend` in the closed state; the new-key send is refused `suspension_active`. (4) Recorded once. (5) C4; no new suspension is offered there. | L+T | PL §7 K-STD; BS B35; design §4.1 |
| WP13-A12 | SuperAdmin; test | Suspension while the audit projection is behind (fixture); dual control | Suspend. | Accepted: one SuperAdmin suspends in an emergency while the audit record is behind (`privilegedElevation: false`); no WP-13 launch-control page shows a second-SuperAdmin step or an audit-state blocker. | T | BS B07, B33 ("emergency containment remains available"); UX §12 V21; `launch.ts:296` |
| WP13-A13 | SuperAdmin; test | SA-05j `suspend` with "Let existing work continue" | Render the Effect and the review; send. | The review repeats the chosen treatment in words before the button ("existing work follows the treatment you chose: drafts can still be submitted …"); the receipt's Recorded line reads "Existing work: Continues". No text on any WP-13 page says that a suspension stops submission whatever the treatment. | T | UX §3.2 ("as applicable"); design §2.2.1; `test/core/launch.test.ts:70` |

### 2.3 Record how existing work continues (`ops.record_existing_work_treatment`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP13-A14 | SuperAdmin (SA1) | SA-05j kind `suspension_treatment` of O with the suspension of A09 (§3 E4); fixture: the same with O also withdrawn | Open "Record the existing-work treatment" from SA-05h's action panel. Read. Select "Cancel". Test: render the fixture. | `h1` names the decision and the offering. Scope: "Suspended since [time] IST", the reason, "Existing work now: Not decided yet: held". Evidence: Core's current effects table (A02). Effect names the control that changes (L-04): "This changes only the suspension's treatment." with the per-choice sentences of A07 that differ from now; unchanged "New work stays suspended. The audience does not change." Current not decided: radios "Let existing work continue" / "Hold existing work" (none preselected; "Not decided yet" is not offered: Core cannot record it). Hidden `causeRef` and `expectedTreatmentId` from the read. Optional evidence row; reason "Reason for the change". Fixture (withdrawn too): the Effect and the review list the blockers that remain: "The withdrawal still refuses the submission of drafts" and, when the withdrawal's treatment is "hold", "The withdrawal still holds submitted, unfiled work whatever you choose here." No text says that existing work continues while another control holds it. "Cancel" records nothing. | L (+T fixture) | UX §6.3; BS B07 ("Where withdrawal and suspension conflict, enforce the more restrictive"); design §2.2.2; L-04 |
| WP13-A15 | SuperAdmin (SA1); operator (OP1); TA (Y) | SA-05j `suspension_treatment`, SA-05h; OP-02 of P; TA-07 and TA-08 of D3 (§3 E4, E5) | Choose "Let existing work continue"; give a reason; record. Read SA-05h. OP1 reads OP-02 of P. Y reads TA-07 and TA-08 of D3 and submits D3. | C3 receipt on SA-05h "Existing-work treatment recorded" (signature of A72): Recorded "Treatment: Continues" and "For: the suspension of [date]" from the row selected by the returned `treatmentId`; Current "In force". The effects table: create "Refused"; submit and the operator rows "Allowed". OP-02 of P: the held step of A67 gives way to the ordinary step. D3: TA-08 offers the submission; the submission is accepted during the suspension. New work stays refused (A60). | L | BS B07; UX §3.2; `test/core/launch.test.ts:70` "a continuing treatment lets existing work go on" |
| WP13-A16 | SuperAdmin (SA1, SA2); harness; test | SA-05j `suspension_treatment` (§3 E6) | (1) Read the page while the treatment is "Continues"; record "Hold existing work". Read SA-05h. (2) Harness: an envelope with the current `expectedTreatmentId` and `treatment=hold` (raw; no page offers the unchanged value). (3) SA2 opens the page before (1); SA1 records (1); SA2 sends its saved form. (4) Test: the not-decided state sent with no choice. | (1) The page offers only the change (hidden `treatment = hold`, button "Hold existing work"; D-W13-08). Receipt "Existing-work treatment recorded", "Treatment: Held"; Current effects: submit and the operator rows "Held" (`existing_work_hold`). (2) `treatment_unchanged`: "Existing work already follows that treatment. Nothing changed." at form level; nothing recorded. (3) C5: "Existing work: your choice / current treatment"; `stale_revision` (the token moved); the reason stays; nothing recorded. (4) C1 at the choice. Nothing is recorded by a refusal (treatment rows delta 0; controls revision delta 0). | L ((1) to (3)) + T | F1 §2; design §2.2.2, §2.15, §2.16; L-12 |
| WP13-A17 | SuperAdmin (SA1); harness; test | SA-05j kind `withdrawal_treatment` (§3 H3: after the withdrawal that permitted continuation, and after the retirement) | (1) Open "Hold the remaining work". Read. (2) Record it with a reason. (3) Open the page again. Harness: "continue" with the current `expectedTreatmentId` (raw). | (1) Scope "Withdrawn [time] IST"; "Submitted, unfiled work now: continues (permitted)". Effect names the control (L-04): "Submitted, unfiled work of this offering is held from now: preparation, readiness, packet release and filing."; hard stop "This cannot be widened back to continue."; hidden `treatment = hold`; button "Hold the remaining work". After the retirement the page states that narrowing stays possible and restores no availability (L-11). (2) Receipt "Existing-work treatment recorded", "Treatment: Held", "For: the withdrawal"; Current: the operator rows "Held" with A31's words. (3) The closed state "Submitted, unfiled work is already held. A withdrawal's treatment cannot widen."; the harness send is refused `withdrawal_treatment_widening_unavailable` ("A withdrawal's treatment can change only from continue to hold. Existing work is already held. Nothing changed."); nothing recorded. | L | BS B07; design §2.2.5; `test/integration/launch-control.test.ts` "with permission: unfiled work continues; the treatment can be narrowed but never widened"; L-04, L-11 |
| WP13-A18 | SuperAdmin; test | SA-05j `suspension_treatment` after the lift; a saved envelope | Open the page after A23. Send the envelope saved in A16 (1). | The closed state "This offering is not suspended. A treatment applies only during a suspension." The saved envelope is refused `stale_revision` (the lift ends the suspension's current treatment) and shown as CMP-14 with the current facts; never "Nothing to do". Nothing recorded. | T | F1 §2; design §2.2.2 states |
| WP13-A19 | SuperAdmin (SA1); harness | Treatment, the Nth time | Replay terms 1 to 5 on A15. Term 2 changes the reason. Term 3: Back after the receipt; the reloaded page offers only the other value; harness: the saved A15 envelope with a new `_op` (raw). Term 4: A16 (4), then a valid send. | (1) The same receipt; one treatment row. (2) Refused as a used form. (3) Back reloads the page with "Hold existing work" as its only change; the saved envelope is refused `stale_revision` (the token moved) and shown as CMP-14 (design §4.1). (4) Recorded once. (5) C4. | L+T | PL §7 K-STD; BS B35; L-12 |
| WP13-A20 | SuperAdmin | SA-05h, SA-05j `suspend`, `suspension_treatment`, `withdraw`, `withdrawal_treatment` | Look for a per-application treatment, a list of affected applications or a count. | One treatment per cause, applied to every existing-work action of the offering (Core's model; the register row reads K-STD, L-13). No control records a treatment for one application or a class. No page claims a count of affected applications; each page links "Applications of this offering" (`views.admin_applications`, a projection that shows its own freshness) with "Inspect them before you decide." Partly met against PL §7 "K-BATCH, per application" (D-W13-12; Q-07, Q-08). | L | PL §7; UX §6.3; design §2.0 "Existing-case impact is explicit", §4.5; L-13 |

### 2.4 Lift a suspension (`ops.lift_suspension`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP13-A21 | SuperAdmin (SA1) | SA-05j kind `lift` of O (§3 F1); fixture: the same with O also withdrawn | Open "Lift the suspension". Read. Select "Cancel". Test: render the fixture. | `h1` names the decision and the offering. Scope: the suspension (since, reason); "Restores: the launch decision approved by [name], audience [audience]" (never wider); the head declaration, business values, binding and launch plan version with its completeness for the head, as SA-05j `launch` shows them (WP-02 B-01; Core checks no reviewed head on a lift, P-06 class, no page-side check). Evidence: the five readiness labels and "Actions that stay unavailable for live cases". Effect names the control that changes (L-04): "New work opens again for exactly the restored audience." "The suspension's existing-work treatment ends; existing work follows its normal checks." Unchanged: "The audience cannot widen here." Fixture (withdrawn): "existing work follows its normal checks and the withdrawal's treatment" and "The withdrawal stays: new work stays refused for good."; no text says that new work opens. Fields: hidden `suspensionId` and `planId`; one acknowledgement checkbox per unavailable action (none ticked on load); one evidence row (required); reason. Button "Lift suspension". | L (+T fixture) | UX §6.3 ("A lift restores only approved scope"); BS B07; design §2.2.3; L-04 |
| WP13-A22 | SuperAdmin; test | SA-05j `lift` when a launch requirement of the current head is not met (fixtures: plan incomplete or not current for a new head; a launch-required item unsupported; a binding not supported) | Render. Send a saved envelope. | The unavailable state: "Lifting the suspension is unavailable until every launch requirement above is met. Owner: SuperAdmin." (or the provider-route and original-return boundaries of `launch`), with "Open the launch plan" and "Open definition and values"; no form (F-W13-16). The saved envelope is refused with Core's code in words ("Lifting" for "Launching"; `launch_plan_not_current`: "The launch plan changed after you opened this page. Review the current plan and send again."); nothing recorded. A treatment that is not decided does not block the lift. | T (L in §3 F1 if it occurs) | BS B07, B32; WP-09 G-05; design §2.2.3 states, §2.16 |
| WP13-A23 | SuperAdmin (SA1); TA (Y, `syn-ta-2`) | SA-05j `lift`, SA-05h; TA-02 and TA-03 (§3 F2) | Lift with every acknowledgement, evidence `SYN-W13-[stamp]-L`, a reason. Read. Y reads TA-02 and TA-03 of O; `syn-ta-2` reads TA-02. | C3 receipt on SA-05h "Suspension lifted"; Recorded "Restored: the launch decision approved by [name], 1 named travel agent" (decision selected by the returned `restoredLaunchId`); Current: suspension none and the "create a draft" effect "Allowed". Y: O "Available for new applications". `syn-ta-2`: O still absent (delta 0). SA-05j `suspension_treatment` shows its closed state (A18). | L | BS B07; `test/integration/launch-control.test.ts` "lifting restores exactly the approved audience, never wider" |
| WP13-A24 | SuperAdmin (SA1, SA2); harness | Lift refusals (§3 F1, F2) | (1) Tick one of two acknowledgements; send. (2) Harness after A23: a second lift with a fresh revision. (3) SA2 sends from a page opened before A23. | (1) `launch_acknowledgement_mismatch`: each unacknowledged action named at its checkbox; the ticked acknowledgement stays ticked and the evidence and reason stay (the WP-02 `launch` rule, L-12); nothing recorded. (2) `suspension_not_active`: the closed state "This offering is not suspended."; nothing recorded. (3) C5 with Launch, Suspension, Withdrawal, Existing work and Launch plan current; `stale_revision`; nothing recorded. Controls revision delta 0 in each case. | L | F1 §3; design §2.2.3, §2.15 |
| WP13-A25 | SuperAdmin (SA1); harness | Lift, the Nth time | Replay terms 1 to 5 on A23. Term 3: Back; the page is closed. | (1) The same receipt; one lift. (2) Refused as a used form. (3) The closed state. (4) A24 (1), then A23: recorded once. (5) C4. | L+T | PL §7 K-STD; BS B35 |

### 2.5 Withdraw an offering (`ops.withdraw_offering`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP13-A26 | SuperAdmin (SA1) | SA-05j kind `withdraw` of O (§3 G1); fixture: the same while a suspension holds existing work | Open "Withdraw this offering". Read. Select "Cancel". Test: render the fixture. | `h1` names the decision and the offering. Scope: offering, launch, audience, suspension and its treatment when active. Effect (design §2.2.4): "New selection, intake, draft creation and the submission of drafts stop for good." "Submitted, unfiled work continues only if you permit it with feasibility evidence; otherwise it is held." Group "It ends": "There is no relaunch: the offering cannot be launched again." Unchanged: outcome recording, delivery, completion, reassignment, act evidence, reconciliation, originals, incidents; "Payment status never forces a withdrawn service."; "The catalogue entry stays until you retire it." Fixture (L-04): "While the suspension holds existing work, it stays held whatever you choose here: the most restrictive treatment applies to each action." Hard stops: "A withdrawal cannot be undone." "A withdrawal's treatment can later change only from continue to hold." Fields: radios "Yes, it may continue" (hint "Needs feasibility evidence.") / "No, it is held" (none preselected); feasibility evidence row; evidence row (required); the checkbox "I understand that this withdrawal cannot be undone." (never prechecked); reason. Review, then the destructive button "Withdraw offering". "Cancel" records nothing. | L (+T fixture) | UX §3.2, §6.3; BS B07; design §2.2.4; L-04 |
| WP13-A27 | SuperAdmin (SA1); harness | SA-05j `withdraw` (§3 G1) | (1) Send with nothing chosen. (2) Choose "Yes, it may continue", fill the evidence and the reason, leave the feasibility evidence empty, tick the checkbox; send. (3) Fill the feasibility evidence, leave the checkbox clear; send. | (1) C1: "Choose whether submitted, unfiled work may continue.", the evidence, the reason, "Confirm that you understand the withdrawal cannot be undone." (2) `withdrawal_permission_required` at the feasibility row: "Permitting continuation needs feasibility evidence."; the choice, evidence and reason stay; the checkbox is clear again. (3) `withdrawal_irreversible_unacknowledged` at the checkbox (left clear); the other values stay. Nothing recorded (controls revision delta 0; O still selectable for Y). | L | F1 §4; design §2.16; WP-09 G-07 |
| WP13-A28 | SuperAdmin (SA1); TA (Y); operator (OP1) | SA-05j `withdraw`, SA-05h, SA-05j `launch` and `expand`; TA-02, TA-03, TA-07 and TA-08 of D2; OP-02 of P (§3 G1) | Withdraw with "Yes, it may continue", feasibility evidence `SYN-W13-[stamp]-F`, evidence `SYN-W13-[stamp]-W`, the acknowledgement, a reason. Read the pages. | C3 receipt on SA-05h "Offering withdrawn"; Recorded "Submitted, unfiled work: continues (permitted)"; Current: withdrawal time and treatment. The effects table: create and submit "Refused" (`offering_withdrawn`); operator rows "Allowed"; record the outcome "Allowed". SA-05h next action "The offering is withdrawn for good. …" with "Hold the remaining work" (A05). SA-05j `launch` and `expand`: no form (Core: `launch_already_current`, `offering_withdrawn`). Y: TA-03 the withdrawn text (A59); D2's TA-08 boundary (A63). OP-02 of P: ordinary work continues. | L | BS B07; UX §3.2; design §2.14; `test/integration/launch-control.test.ts` "with permission: unfiled work continues; …" |
| WP13-A29 | SuperAdmin (SA1, SA2); harness; test | Withdrawal refusals and closed states | (1) Harness after A28: a second withdrawal with a fresh revision. (2) Harness in §3 Part A, before the launch: a withdrawal of O with the acknowledgement and evidence; then read SA-05j `withdraw`. (3) SA2 sends from a page opened before A28. (4) Read SA-05j `withdraw` after A28. | (1) `conflict_duplicate` / `offering_already_withdrawn`: the closed state "This offering is already withdrawn. Nothing changed."; nothing recorded. (2) `offering_not_launched`; the closed state "A withdrawal applies to a launched offering. To end an offering that was never launched, retire it." with the link to SA-05x; nothing recorded. (3) C5; `stale_revision`; values kept, the checkbox clear; nothing recorded. (4) The closed state "This offering is already withdrawn ([time] IST)." with the link to `withdrawal_treatment` while it applies. | L+T | F1 §4; design §2.2.4 states, §2.16 |
| WP13-A30 | SuperAdmin (SA1); harness | Withdrawal, the Nth time | Replay terms 1 to 5 on A28. Term 2 changes the reason. Term 3: Back; the page is closed. | (1) The same receipt; one withdrawal. (2) Refused as a used form. (3) The closed state. (4) A27 (2), then A28: recorded once. (5) C4. | L+T | PL §7 K-STD; BS B35; F1 §4 |
| WP13-A31 | Operator (OP1); TA (Y); test | OP-02 of P and TA-07 of P after the narrowing of A17 (§3 H3); fixture: a withdrawal that never permitted continuation | Read. Test: render both cases. | OP-02 of P: the readiness, filing and packet steps show the staff sentence for `withdrawal_continuation_not_permitted` with owner SuperAdmin and no form (A67). The sentence is true for both cases (L-04): it says that the withdrawal's treatment holds unfiled work ("Unfiled work of this service is held under its withdrawal."), never "did not permit" for a withdrawal that permitted continuation and was narrowed later. Steps Core does not stop keep their forms. TA-07 of P: the same fact in travel-agent words with owner TravelMudra, and the withdrawal request where Core offers it. Test: the not-permitted fixture holds submitted unfiled work, refuses drafts, never takes payment as an input (`launch-control.test.ts` "without permission: submitted unfiled work is held, drafts cannot be submitted, and payment is never an input"). | L+T | BS B07; UX §3.2; design §2.11 item 2, §2.13.5; L-04 |
| WP13-A122 | SuperAdmin; operator; TA; test | Overlapping controls (L-04): a suspension and a withdrawal together; a withdrawal that permitted continuation, narrowed later | Fixtures: suspended "continue" + withdrawn "hold"; suspended "hold" + withdrawn "continue"; suspended not decided + withdrawn "continue"; withdrawn "continue" then narrowed to "hold". Render SA-05h, SA-05j `suspension_treatment`, `lift`, `withdraw`, `withdrawal_treatment`, OP-02 and TA-07 of a submitted and a draft application. Live part: §3 G1 and H3. | Each page shows Core's current per-action effects with every contributing code (A02). Each decision page's Effect and review name the control that changes and list the blockers that remain: a suspension "continue" does not release a withdrawal hold ("The withdrawal still holds submitted, unfiled work."); a lift does not reopen a withdrawn offering ("The withdrawal stays: new work stays refused for good."); a withdrawal during a holding suspension keeps existing work held whatever the permission. The narrowed withdrawal reads "Permitted at withdrawal: yes" and "held (narrowed after the withdrawal)", and no page says the withdrawal "did not permit" continuation. OP-02 and TA-07 list both codes in Core's order. | L+T | BS B07 ("Where withdrawal and suspension conflict, enforce the more restrictive"); design §2.1, §2.2; L-04; `test/integration/launch-control.test.ts` "suspension continue + withdrawal not permitted holds, listing the withdrawal; suspension hold + withdrawal permitted holds" |

### 2.6 Impact review: assessments, reviewer, item decisions, recheck

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP13-A32 | SuperAdmin (SA1) | SA-05l Impact review (rail member "Impact review" of "Offerings & launch") before and after §3 Part B; with no listed assessment (fixture); with a failed recheck (fixture) | Read. | `h1` "Impact review"; the lead says that unknown or pending impact blocks filing readiness until it is decided. One row per assessment the read returns (states `rechecking` and `review_required` only): offering (link SA-05b), "No. [n]" (link SA-05m), cause and state in the words of design §2.13, "[n] open: unknown, pending or held" (Core's `open_items`), accountable SuperAdmin or "SuperAdmin queue". A failed recheck shows its callout with the link to SA-05b `#assessments`. Under the table always: "Held applications and declined transitions of assessments that are no longer rechecking or waiting for review are not listed here. Each offering's page lists all its assessments." Empty: "No assessment is rechecking or waiting for review." plus that line. The page claims no total, and its count is not compared with SA-01's or SA-05a's, which have other scopes (L-12). | L+T | UX §6.2, §6.3 (Publication and impact); design §2.6; `contracts/catalogue.ts:256-262` |
| WP13-A33 | SuperAdmin (SA1); test | SA-05m of O's version-2 assessment at §3 B4, C1, C9 and after D3; fixtures: superseded with a current carried hold; reviewed with a declined transition; `filed_historical`; 5000 items | Read the page from the top. | Header: "Impact assessment no. [n]: [offering]"; status facts State, Cause, Change, Engineering statement ("Not applicable", "Supplied", "Missing"), Accountable SuperAdmin. "What changed": before and after declaration (link SA-05c), business values (link SA-05d) and binding; "Continuation chosen at publication" in words; the statement changes when supplied. "Accountable SuperAdmin" hosts the reviewer form (A34). "Applications": mutually exclusive groups with their counts and unit, empty groups not shown: "Need a decision" (current, unknown or pending, not `filed_historical`); "Held" (owner column); "Transition approved" with the line "Whether the travel agent accepted, declined or still has to decide is not shown here yet. After a decline the application waits for your new decision: open it and decide again."; "Continue"; "Not affected"; "Historical (filed)" (A123); "Earlier items" (closed disclosure, read only). Columns: application reference (link SA-04a), lifecycle, classification, treatment with owner. Actions on every current item, on any assessment state (Q-W13-04, L-07): "Decide" → SA-05n (also on "Transition approved" rows, L-06) and "Approve a transition" → SA-05t only where A41 offers it (never on a "Transition approved" row). No form on this page except the reviewer's. Superseded: "A newer assessment covers this offering. Items of this assessment that are still current can still be decided here." Rechecking: "The recheck is still running. The list changes when it finishes." The 5000-row fixture: "The list shows at most 5000 applications and may be incomplete." | L+T | BS B06 ("Unresolved impact prevents affected filing readiness"); UX §6.3; design §2.7, D-W13-15; L-06, L-07, L-09 |
| WP13-A34 | SuperAdmin (SA1, SA2); harness; test | SA-05m reviewer form (§3 C2) | (1) Read the form. (2) Choose SA2, give a reason; send. (3) Harness: `superAdminId` of OP1. (4) SA2 sends from a tab opened before (2). (5) Test: a superseded assessment; the accounts read unavailable or at its 200-row cap. (6) Replay terms 1 to 5 on (2). | (1) A select of active SuperAdmins by name (D-W13-05), hint "Holds that later rechecks place are owned by this SuperAdmin while they are active. Holds already recorded keep their owner.", reason. (2) C3 receipt "Accountable SuperAdmin assigned" (signature of A72); Current: SA2. (3) Refused at the field: "Choose an active SuperAdmin with a second factor set up."; values kept; nothing recorded. (4) C5 ("Accountable SuperAdmin: your choice / current; State"); `stale_revision`; nothing recorded. (5) Superseded: no form, and a saved envelope gives "A newer assessment replaced this one. Assign the reviewer on the newer assessment. Nothing changed."; accounts unavailable or capped: the text field with "Account reference of an active SuperAdmin. The account list is unavailable now." (A78). (6) (1) the same receipt; (2) used form; (3) Back: the same reviewer again with a fresh revision is accepted again (no duplicate guard; the current reviewer shows before the form); (4) recorded once; (5) C4. | L ((1) to (4)) + T | `impact.ts:163-187`; F2 §1; design §2.7 item 4, §2.16 |
| WP13-A35 | SuperAdmin (SA1); operator (OP1) | SA-05n for D2 (held by the publication's policy) and for P (§3 C3, C4, C8) | Open "Decide" for D2. Read. Decide "Continue on its current terms" with a reason. Open "Decide" for P; decide "Hold" with owner SA2. Later (C8) decide P "Continue on its current terms". Read SA-05m and OP-02 of P. | `h1` "Decide the impact: application [reference]". Scope: application (link SA-04a), lifecycle, assessment and cause, classification, current treatment with owner, item reference; "Open the application to see the applicant." Choices (radios, none preselected), only those design §2.8 offers by the item facts, each with its effect sentence: "Continue on its current terms", "Move to the head without a transition", "Hold" (owner: a select of active SuperAdmins, text fallback), "Not affected" (only for Core's three unknown classifications, evidence needed). Hard stops: no move for possibly filed work; a transition is the separate page SA-05t ("Approve a transition instead"). Receipt "Impact decision recorded", Recorded "Applications decided: 1"; Current: this item's treatment and owner; "Next application that needs a decision" and "Back to the assessment" links. OP-02 of P after "Hold": the readiness row "Not met: A SuperAdmin holds this application after a catalogue change. Owner: SuperAdmin." (the operator's read names no hold owner, L-12). After "Continue": the row is met. | L | UX §6.3 ("supported continuation … or an owned hold"); BS B06; design §2.8; `impact.ts:85-160` |
| WP13-A36 | SuperAdmin (SA1, SA2); harness; test | Item decision refusals | (1) "Hold" with no owner. (2) Harness: "Not affected" for an item Core did not classify unknown. (3) Harness: "Move to the head without a transition" for S2 (structure changed, no statement). (4) SA2 decides from a tab opened before SA1's decision of the same item. (5) Test: an item whose `valid_through` is behind the latest assessment (carried, then overtaken; L-07); an application closed; an item whose transition awaits the travel agent; `continue_on_head` with an act `authorized`, `filing_unknown` or `reconciliation_exhausted`. | (1) At the owner: "Choose the SuperAdmin who owns the hold." (2) `impact_decision_not_allowed` at the decision with design §2.16's sentence. (3) `continuation_unsupported`: "Moving without a transition needs a business-values difference or a change engineering classified as compatible. Approve a transition instead, or choose another decision." (4) C5 ("Treatment: your choice / current; Owner; whether the item is still current"); `stale_revision`. (5) `impact_item_not_current` → the closed state "This item is no longer current: a later recheck or decision replaced it." with the link to SA-05b `#assessments`; `application_not_open` closed state; `transition_pending` "A transition of this application waits for the travel agent. Decide again after the travel agent answers. Nothing changed."; `filing_possibly_occurred`. The typed values and the choice stay after each form-level refusal. Nothing is recorded (item revision delta 0; the governing terms unchanged). | L ((1) to (4)) + T | F2 §2; design §2.8 states, §2.16; `test/integration/catalogue-impact.test.ts` "work that may have been filed never moves to another tuple: …"; "a stale item revision refuses the whole batch" |
| WP13-A37 | SuperAdmin (SA1); harness | Item decision, the Nth time | Replay terms 1 to 5 on the D2 decision. Term 3: Back; harness: the same decision with a new key from the reloaded page. | (1) The same receipt; one decision fact. (2) Used form; nothing recorded. (3) Back reloads SA-05n with the current treatment; the new-key send is accepted again (Core has no duplicate guard for a re-decision; the page shows the current decision before the choices and claims no duplicate protection). (4) A36 (1), then the corrected send: recorded once. (5) C4. | L+T | PL §7 K-STD; BS B35; WP-09 G-03; design §4.1 |
| WP13-A38 | SuperAdmin (SA1, SA2); test | The recheck form on SA-05b "Impact on existing work" (its one host; §3 C9) | Read the form. Request a recheck with a reason. Read SA-05m until it leaves "Rechecking". SA2 requests one from a page opened before. Test: an offering whose latest assessment is superseded or absent; a rerun of the task. | Lead "A recheck classifies open applications again against the head. Decisions already recorded stay. …"; while rechecking "A recheck is running. A further request starts it again." C3 receipt on SA-05b `#assessments` "Recheck requested", Recorded "Generation [n] of assessment no. [m]" (selected by the returned `assessmentId`); Current: that assessment's state. Every decided item keeps its decision. SA2's request is accepted too (the command takes no revision; a new generation; no item duplicated). Test: no form and "There is no open assessment to recheck." when the latest assessment is superseded or absent; a saved envelope is refused `nothing_to_recheck` with design §2.16's sentence; a rerun creates no second item, reduction or notice (`test/integration/catalogue-impact.test.ts` "a requested recheck creates no second item, reduction or notice"). The typed reason stays after a refusal. | L+T | BS B06; design §2.4 item 1; F2 §4; L-12 |
| WP13-A39 | SuperAdmin; test | Carried items (L-07): a held item decided on assessment 1 and carried forward after assessment 2 superseded it; the same after assessment 2 is "Reviewed"; an item whose `valid_through` is behind the latest assessment | Open SA-05a, SA-05b and SA-05m of assessment 1. Decide the carried hold "Continue on its current terms". Send a decision for the item that is behind. | SA-05a's cell links to SA-05b, which lists assessment 1. SA-05m of assessment 1 shows the carried hold under "Held" with "Decide" (SA-05n) whatever the state of assessments 1 and 2. The decision of the valid carried item is accepted (receipt; the hold leaves the counts). The item that is behind is refused `impact_item_not_current` and SA-05n shows the closed state with the route to SA-05b; nothing recorded. No page claims that a superseded or reviewed assessment holds nothing to decide. | T | Design §2.7 item 5, §1.2 (Impact items), D-W13-15; `impact-recheck.ts:73-84`; L-07 |
| WP13-A40 | Operator (OP1); TA (Y); test | TA-07 and TA-08 of D1, D2; OP-02 of P; TA-07 of D3 and E (§3 B5) | Read the blockers right after version 2 is published, before any SuperAdmin decision. | D1 and D2 (held by the publication's policy): TA notice "Submitting this application is unavailable until TravelMudra releases the hold it placed after a change of this service. Owner: TravelMudra. Your draft is kept." (`catalogue_impact_hold`). P (pending): the OP-02 readiness row "Not met: A catalogue change may affect this application and is not decided yet. Owner: SuperAdmin." (`catalogue_impact_unknown`). The blocker never reads as a refusal of the application. D3 (created on version 2) and E show no such blocker. Editing stays offered where Core's `correct` allows it. No page invents an owner or a date. | L+T | BU-27 ("current eligibility changes"); BS B06; design §2.11 item 2, §2.13.5; `controls.ts` stage 11 |
| WP13-A123 | SuperAdmin; test | SA-05m and SA-05n with items classified `filed_historical` (fixture: an evidenced-filed, still-open application reached by a recheck) | Render SA-05m, SA-05n of such an item, SA-05a and SA-05l. | SA-05m shows them in a separate group "Historical (filed)" (L-09), never under "Need a decision"; the groups are mutually exclusive; the group has no "Decide" or "Approve a transition" action and SA-05n of such an item is the closed state "Filed work keeps its terms: its facts are historical." (D-W13-10). Actionable group counts exclude them. Where an aggregate count of Core includes them (`open_items`, `openItems` count `pending` items), the page discloses it beside the count: "This count can include applications whose filing is evidenced; they need no decision." until Core corrects the count (P-19 note). | T | Design §2.7, §2.8 states; `impact-recheck.ts`; L-09 |

### 2.7 Approve a transition (`cat.approve_transition`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP13-A41 | SuperAdmin (SA1) | SA-05t for D1 (draft, held) and S1 (submitted, pending) (§3 C5, C6) | Open "Approve a transition" from the item row. Read. Select "Cancel". | `h1` "Approve a transition: application [reference]". Scope: application, lifecycle, assessment, classification, current treatment; the target in exact words (L-02): "Target if you approve now: the offering's head read at [time] IST: declaration version [n], business values version [n], binding [reference]", with "Core moves the application to the head the offering has when you approve. If the head changes before you send, the application moves to the newer head." (STOP-W13-05 a). No sentence says "the current terms". Evidence: "What changed"; the engineering statement lines. The evidence field (one row; kinds release manifest, external reference, document version; no value prefilled) states beside it (L-03): "A release manifest that names the target binding shows that the release supports the target terms. It does not show that this application's documents and facts are compatible with them." Effect: a draft moves at once; a submitted application moves at once when nothing that needs the travel agent's authority differs, otherwise it waits for the travel agent's decision on "Changed service terms" and its submission, readiness, packet release and filing wait too; the quoted price does not change; "If the travel agent declines: the application keeps its terms and waits for your new decision. Approving again for the same item does not reopen it." Hard stops: no transition for possibly filed work; one transition waits at a time; the evidence rule. Button "Approve the transition". Closed or unavailable (no form) for: not current; unaffected; closed application; `held_while_filing_possible`; treatment `transition` (A45); head unreadable (CMP-10, A78); no head. A binding-only proof (the head binding as the only evidence, no offering-specific statement) is accepted by Core but does not count as B06 acceptance until Max decides P-19 item 2: the run record reads "Unmet: waits for Max's decision on P-19 item 2" for every binding-only approval (Q-14). | L | UX §6.3; BS B06; design §2.9; `impact.ts:212-261`; L-02, L-03 |
| WP13-A42 | SuperAdmin (SA1); TA (Y) | SA-05t, SA-05n receipt; TA-07 and TA-08 of D1 (§3 C5) | Approve D1 with a release manifest that names the target binding reference shown on the page, and a reason. Read. Y reads D1. | C3 receipt on SA-05n "Transition approved" (signature of A72): Recorded "Travel agent's renewed authority required: No" and "Transition [reference]"; Current: this item's treatment "Transition approved". The receipt claims no "created", "opened", "applied" or "waits" (L-05): Core establishes none of them on a read. D1 on TA-07 and TA-08 no longer shows the hold blocker of A40. No notice to Y (TA-10 delta 0). The run record notes the binding-only evidence (A41, Q-14). | L | F2 domain model (a draft transitions at once); design §2.14; L-03, L-05 |
| WP13-A43 | SuperAdmin (SA1); TA (Y) | SA-05t; TA-07 and TA-10 of Y for S1 and S2 (§3 C6) | Approve S1, then S2 (binding-only evidence, as A42). Read. Y reads TA-10 and TA-07 of S1. | Receipts "Transition approved" with Recorded "Travel agent's renewed authority required: Yes"; Current: "Transition approved"; no "waiting" or "applied" claim. TA-10: + 2 notices that need acknowledgement, each linking to TA-07t (AM-W13-04). TA-07 of S1: the step "Decide on the changed terms" and the status row "Service terms: A change waits for your decision" (A47). SA-05m: S1 and S2 under "Transition approved"; no "Approve a transition" on those rows (A45). | L | `catalogue-writers.ts:118-155`; BS B06; design §2.11 item 1 |
| WP13-A44 | SuperAdmin (SA1, SA2); harness; test | Transition refusals | (1) Send with no evidence. (2) Harness: an external reference "SYN-W13-[stamp]-X" as the only evidence. (3) Harness: a second approval of S1 while it awaits (fresh revision). (4) SA2 approves from a tab opened before SA1 decided the item. (5) Test: an unaffected item; a closed application; no head, an unsupported head declaration or binding; an item that is not current; an act `authorized`, `filing_unknown` or `reconciliation_exhausted`; an item of another application in the path (refused by the binding before the policy). | (1) "Add engineering compatibility evidence." at the evidence. (2) `transition_evidence_missing` at `evidence.id`: "The evidence does not establish compatibility. Give a release manifest that names the target binding [reference], or a release under which it is supported. Nothing changed."; the values stay. (3) `conflict_duplicate` / `transition_pending`: the closed state "A transition of this application already waits for the travel agent. Nothing changed." (4) C5 ("Treatment: your choice / current; Owner; whether the item is still current"); `stale_revision`. (5) The closed states and sentences of design §2.16; the uniform not-found answer for another application's item. Nothing is recorded in each case (no transition; item revision delta 0; TA-10 delta 0). | L ((1) to (4)) + T | F2 §3; design §2.9 states, §2.16; `test/integration/catalogue-impact.test.ts` "without engineering compatibility evidence a transition is refused"; "a release manifest that names neither the target binding nor a registered release supporting it is refused; the running release is accepted" |
| WP13-A45 | SuperAdmin (SA1); harness; test | SA-05m, SA-05t and SA-05n after D1 moved at once and after Y declined S2 (§3 D3) | Read the rows of D1 and S2. Open SA-05t of each by its address. Harness: a second approval of S2 with a fresh revision (raw). Open "Decide" (SA-05n) for S2. | SA-05t offers no approval for an item whose treatment is `transition` (L-06): the closed state "A transition was already approved for this application. If the travel agent declined, decide again on the impact page." with the link to SA-05n. The raw send is accepted by Core and opens no transition (STOP-W13-04); its receipt is rendered from the summary only and does not differ from a first approval (Core returns the same signature), so no transition receipt ever claims a new, waiting or applied transition (L-05). SA-05n of S2 stays reachable: the decision choices of A35 with the line "If a transition of this application still waits for the travel agent, Core refuses a new decision until the travel agent answers." (STOP-W13-02); deciding "Continue on its current terms" or "Hold" for the declined S2 is accepted. The run record reads "Unmet: waits for P-19 item 4" for the accepted empty approval. | L+T | F2 §3 "Business duplicate"; design §2.7 item 5.3, §2.8 states; L-05, L-06; Q-02, Q-03 |
| WP13-A46 | SuperAdmin (SA1); harness | Transition, the Nth time | Replay terms 1 to 5 on A42. Term 3: Back; SA-05t shows the closed state of A45. | (1) The same receipt; one transition. (2) Used form; nothing recorded. (3) The closed state. (4) A44 (1), then A42: recorded once. (5) C4. | L+T | PL §7 K-STD; BS B35 |
| WP13-A120 | SuperAdmin (SA1); test | SA-05t opened, then a new head published before the send (L-02) | Open SA-05t of an item (the head read at time t). Publish a new declaration version (fixture). Send the form opened at t. | Required: the application moves only to the head the SuperAdmin reviewed, or the send is refused with the changed head shown (CMP-14). Today Core takes the head at command time and no reviewed head is posted (STOP-W13-05 a): the test pins Core's behaviour, SA-05t's scope line states it before the send ("If the head changes before you send, the application moves to the newer head."), and the receipt claims no target. The obligation reads "Unmet: waits for the Core guard (P-19 item 4)"; the item is not passed by pinning the defect. | T | BS B06, B35; design §2.9, §9.4 STOP-W13-05; L-02 |
| WP13-A121 | TA; SuperAdmin; test | A transition approved, then a newer head published before the travel agent's decision (L-02) | Approve a transition for a submitted application (fixture). Publish a newer declaration version. Read TA-07t. Test: apply the transition by a raw envelope. | TA-07t names the target only as "the terms TravelMudra approved for this application" and states that they can differ from what the Services page shows now; it never says "current terms". Required: an application moved to a superseded target is rechecked against the newer change, so unknown applicability blocks its filing readiness (B06). Today Core applies the stored older target and no recheck classifies it (STOP-W13-05 b, suspected; failing test first): the obligation reads "Unmet: waits for the Core recheck (P-19 item 4)". | T | BS B06; design §2.10 item 4, §9.4 STOP-W13-05; L-02 |

### 2.8 The travel agent's changed terms (`core.decide_transition`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP13-A47 | TA (Y) | TA-07 and TA-07t of S1 (submitted, unassigned, transition waiting) (§3 D1) | Read TA-07's action panel and status row. Open "Decide on the changed terms". Read. Select "Cancel". | TA-07: owner "You", "Decide on the changed terms" → TA-07t; status row "Service terms: A change waits for your decision". TA-07t (`/ta/applications/:applicationId/changed-terms`): `h1` "Changed service terms: [applicant]"; lead "TravelMudra changed the terms of [service] and approved moving this application to the changed terms. The change is one that needs your renewed authority." Exact target wording (L-02): "the terms TravelMudra approved for this application", never "the current terms" or the Services page as the target. "What changes": the page cannot list the changes yet. "What stays the same": the price quoted at submission, the original estimated window, nothing recorded is removed. Your decision (L-01): **Decline** is offered (hint: "The application keeps its current terms for now. TravelMudra then decides how it continues: on its current terms where they are still supported, or it is held until TravelMudra decides."); **no Accept** is offered: a truthful waiting state says that accepting is unavailable until TravelMudra can show exactly what changes, names the owner TravelMudra, gives no date, and states that while the change waits this application's submission, readiness, filing and packet release wait too. No choice is preselected; button "Record my decision"; "Cancel" records nothing. "Accept: Unmet, waits for Max's decision on P-19 item 1" (a served action is withheld only by Max's decision; WP-13 is not built before his answer). | L | UX §4.1, §6.3 ("renewed TA authority where required"); BS B06, B17; design §2.10 as amended by L-01; L-02; Q-04 |
| WP13-A48 | TA (Y); harness; test | Accept on TA-07t | Read TA-07t of S1 (§3 D1). Test: a raw `apply` envelope for an awaiting transition (fixture). | No Accept control, no hidden `apply` value and no page text that invites acceptance. The run record lists "Accept: Unmet, waits for Max's decision on P-19 item 1". Test: Core still accepts a raw `apply` (the command is served); the test pins it, and no WP-13 page claims that accepting is impossible. When P-19 item 1 is served and Max decides, Accept returns with the before and after values per authority item and the exact approved target version, and this item is rewritten. | L+T | L-01; design §3 (STOP-W13-01 switch) |
| WP13-A49 | TA (Y); SuperAdmin (SA1) | TA-07t, TA-07, TA-08 of S2; SA-05l, SA-05m, SA-01 (§3 D2, D3) | Send with no choice. Choose "Decline"; send. Read the TA pages. SA1 reads SA-05l, SA-05m and SA-01. | No choice: C1 at the decision. Decline: C3 receipt "Decision on the changed terms recorded" (neutral; the summary does not name the choice, Q-W13-08); Current "No change of service terms waits for your decision now."; no accepted time. TA-07 of S2: the "Service terms" row is gone; the page shows Core's pending answer and owner, and where a travel-agent evaluation carries `catalogue_impact_unknown` the notice "[Action] is unavailable until TravelMudra reviews how a change of this service affects this application. Owner: TravelMudra. Your application is kept."; no text says that the terms changed or that the application moves on. SA side: SA-05m shows S2 under "Transition approved" with the decline line (A33); Core gives no queue item, count or notice for the decline (STOP-W13-03): the run record reads "Unmet: waits for P-19 item 4" for BU-27's "next owner" on S2, and the travel-agent page passes on its own words (owner TravelMudra, no date). | L | BU-27; F2 §7; design §2.10, §2.14; Q-02 |
| WP13-A50 | TA (Y); operator (OP1); harness; test | TA-07t and TA-07 of an assigned application with a waiting transition (fixture, or P if the run approves one); OP-02 | Read TA-07t. Harness: send a decision. Read OP-02. | TA-07t state "With the operator": items 2–5 and "This application is with your operator. They return it to you so you can decide." with no form (Core: `awaiting_formal_return`). The harness send is refused with that sentence and "Nothing changed."; nothing recorded. OP-02 (WP-07 F-36 / AM-W13-03): owner "You", step "Return the application to the travel agent so they can decide on the changed terms", action the WP-07 return form; the readiness row for `transition_pending`. After the formal return TA-07t is open again (Core lets a returned application decide). | L (harness) + T | `derived.ts:309-315`; `admin.ts:101-123`; design §2.10 states; `WP-07.md` §4.8 F-36 |
| WP13-A51 | TA (Y, `syn-ta-2`); harness; test | Decision refusals | (1) Harness after A49: a decline with a new key from TA-07t loaded before A49 (raw). (2) `syn-ta-2` opens TA-07t of S1 by its address and posts. (3) Test: an act `authorized` or `filing_unknown`; a transition id of another application; a closed application; a page out of date (`transitionId` invalid). | (1) CMP-14 "The application changed, or this change of terms was decided, after you opened the page." with the current state; `stale_revision`; nothing recorded. (2) The uniform not-found page; nothing recorded. (3) `filing_possibly_occurred` "TravelMudra cannot change this application's terms now: a filing may already have happened. Nothing changed. TravelMudra resolves this first."; the uniform not-found answer; the closed-application sentence; "This page is out of date. Open it again." Nothing is recorded in each case (the transition still waits where it waited; TA-10 delta 0). | L ((1), (2)) + T | F2 §7; design §2.10 states, §2.16 |
| WP13-A52 | TA (Y); harness; test | Decision, the Nth time; the handler | Replay terms 1 to 5 on A49's decline. Term 3: Back; TA-07t shows "No change of service terms waits for your decision." BFF test: a `transitionId` of 41 characters and a `decision` of 21 characters. | (1) The same 303 and receipt. (2) Used form. (3) The "Nothing waits" state. (4) A49's empty send, then the decline: recorded once. (5) C4; no new decision offered. BFF test: the handler (`transition-routes.ts`) sends both fields whole (no `slice`); Core refuses them at the field and TA-07t re-renders with the choice kept (LD-17, F-W13-06). | L+T | PL §7 K-STD; BS B35; LD-17; design §2.17 |

### 2.9 Retire an offering and discard a declaration draft

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP13-A53 | SuperAdmin (SA1); harness | SA-05x of O while launched (§3 F0) | Open "Retire this offering" from SA-05b. Harness: a retirement with the current revision. | The unavailable state: `boundaryNotice` "Retiring is unavailable until the offering is withdrawn. Owner: SuperAdmin." with `unavailableButton` "Retire offering" (`aria-disabled`) and the link "Withdraw this offering" (SA-05j `withdraw`); a suspension does not change this. The harness send is refused `retire_requires_not_launched`: "A launched offering is withdrawn before it is retired. Nothing changed."; nothing recorded (offering revision delta 0). | L | BS B07; `identity.ts:131-143`; design §2.3 states |
| WP13-A54 | SuperAdmin (SA1); TA (Y); harness | SA-05x, SA-05b, SA-05a, SA-05h of O after the withdrawal; TA-02 and TA-03 of Y (§3 H2) | Read SA-05x. Retire with a reason. Read. Harness: a declaration draft, a business-values draft and a launch plan for O. Y reads TA-02 and TA-03. | SA-05x: Scope (offering, country, who files, service code, availability, launch "Withdrawn"); Evidence (the applications link; "Impact on existing work"); Effect: "Travel agents can no longer select this offering." and the commands that retirement blocks, listed by Core's answers (L-11): new declaration drafts, declaration previews and publications, business-values drafts, edits, previews and publications, and launch plans are refused `offering_retired`; launch, expansion and lift are refused because a retired offering is not published. Unchanged: open work keeps its governing declaration, business values and binding; no application changes; narrowing the withdrawal's treatment, impact decisions, transitions and the recheck stay available and restore no availability. Review; destructive button "Retire offering". C3 receipt on SA-05b "Offering retired"; Current: availability "Retired". The harness sends are refused `offering_retired`; nothing recorded. Y: O stays listed on TA-02 as not available with the withdrawn sentence and "This service is not offered for new applications."; TA-03 still renders; no travel-agent page says "Retired". | L | F2 §6; BS B07 ("truthful information display may continue"); design §2.3, §2.11 item 3; L-11 |
| WP13-A55 | SuperAdmin (SA1, SA2); harness | Retirement refusals and the Nth time | (1) SA2 sends from SA-05x opened before A54. (2) Harness: a second retirement with a fresh revision. (3) Replay terms 1 to 5 on A54. | (1) C5 ("Catalogue availability; Launch") or, once retired, the closed state with the refusal sentence first and the typed reason in the unsent block; nothing recorded. (2) `offering_retired`: the closed state "This offering is already retired. Nothing changed."; the refusal is never lost because a section hides (F-W13-08). (3) (1) the same receipt; (2) used form; (3) Back: the closed state; (4) recorded once; (5) C4. | L+T | WP-02 R-03 class; F2 "Lost refusals"; design §2.16, §4.2 |
| WP13-A56 | SuperAdmin (SA1, SA2); harness | SA-05c of declaration version 3 (draft), section "Discard this draft" (its one host) (§3 H1) | Open "Discard this draft". Read. Discard with a reason. SA2 sends from a page opened before. Harness: the same discard with a new key. Replay terms 1 to 5. | The `confirmDisclosure` with the effect (the draft can no longer be approved, bound or published; a new draft can be registered) and the reason; `_rev.declaration`. C3 receipt "Declaration draft discarded" (signature of A72); Current: status "Discarded". SA2 and the new-key send: `declaration_not_draft` "This version is no longer a draft: it was discarded, approved or published meanwhile. Nothing changed." first in `main` (the section is gone), with the typed reason kept read only; nothing recorded. Replay: (1) the same receipt; (2) used form; (3) no form; (4) once; (5) C4. A published or supported version offers no discard. | L+T | `declarations.ts:215-235`; F2 §5; design §2.5, §2.16 |
| WP13-A57 | SuperAdmin; TA; test | An offering that was never launched (fixture) | Read SA-05j `suspend` and `withdraw`. Retire it. Read TA-02. | Both kinds show their "not launched" closed states with the link "Retire this offering". Retirement is accepted; the effect text of A54 without the withdrawal lines; the offering stays invisible to travel agents. | T | V20 clause 1; F2 §6; design §2.2.1, §2.2.4 states |

### 2.10 Travel-agent pages and BU-27

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP13-A58 | TA (Y) | TA-02 and TA-03 of O while suspended (§3 E2), with each treatment | Read. | TA-02: O "Not available for new applications". TA-03: "TravelMudra has paused new applications for this service. Applications you already started are kept; each one shows on its own page what it can do now." and "Owner: TravelMudra" (design §2.11 item 3). The read returns only `offering_suspended`, not the treatment, so no sentence says that existing work continues (F-W13-04). No "Start an application", no "Add applicants in bulk", no other offering suggested, no wait-list promise, no date. Cost, estimate, documents and process still show. | L | UX §3.2, §4.4; BS B07; WP02-A24 (text amended by WP-13); design §2.11 item 3 |
| WP13-A59 | TA (Y); test | TA-02, TA-03, TA-07 and TA-08 of O after the withdrawal and after the retirement (§3 G1, H2); every TA text keyed by `offering_withdrawn` and `catalogue_not_published` | Read. Test: the text map. | TA-02 and TA-03: "TravelMudra has withdrawn this service for good. New applications cannot start, and drafts cannot be submitted. Applications you already started are kept." TA-08 and TA-07 notices: "[Action] is unavailable: TravelMudra withdrew this service, and a withdrawal cannot be undone. Owner: TravelMudra." Never "paused", "temporarily", "until TravelMudra offers this service again" or other wording that implies a return (F-W13-03). After the retirement: the withdrawn sentence and "This service is not offered for new applications."; never "Retired" and never "at the moment". | L+T | BS B07; design §2.11 items 2, 3; `launch.ts:438` |
| WP13-A60 | TA (Y); harness | TA-09c (add applicants) and TA-05 "Add applicants" of the run group while O is suspended (§3 E2) | Read the service choice. Harness: an individual-applicant send naming O (raw, from a page loaded before the suspension). Read TA-05 and TA-06. | O is not offered for a new applicant and the page states why (A58 words, owner TravelMudra); no other service is preselected or substituted; the other Synthetica services stay choosable. The raw send records no draft for O: Core refuses O with `offering_suspended` (F1 "Intake starts"), and the page shows "[O]: TravelMudra has paused new applications for this service. Nothing was created for this service." with the other values kept (WP-03 design §7.5). TA-05 and TA-06 list D1, D2, D3, S1, S2, P and E with their own states (application count delta 0). | L | BU-27; UX §3.1 step 1, §4.4; BS B07; `intake-writers.ts:77-81` |
| WP13-A61 | TA; test | TA-05 "Add applicants" and TA-09c for a group whose country has no selectable offering (fixture) | Render. | "No service is currently available for new applications in this scope." with each listed service's reason and "Owner: TravelMudra"; no start control; no wait-list promise; the group's applications stay listed with "kept". (WP03-A35 covers the TA-05 entry; this item covers the suspension and withdrawal codes.) | T | UX §4.4; BU-27; WP03-A35 |
| WP13-A62 | TA (Y); test | The bulk entry for the run group while O is suspended or withdrawn (existing page until the bulk packages) | Start a bulk import naming O (test). | Refused; Core answers `offering_not_launched` for a suspended offering (F1). Where the existing page shows it, the words are "This service is not open for new applications now" and never "not launched"; earlier imports, drafts and applications stay. The rebuilt bulk pages (BU-P02, BU-P06, BU-P07) carry the BU-27 additions of AM-W13-05 (PLAN §8 S-13) and are "Deferred" here (§5). | T | BU-27; design §1.8 AM-W13-05; `start-bulk.ts:78-83` |
| WP13-A63 | TA (Y); test | TA-07 and TA-08 of a draft for O: D3 under the suspension with the treatment not decided, "continue" and "hold" (§3 E3, E5, E6); D2 after the withdrawal (§3 G1) | Read the action panel and TA-08. Send TA-08 where it is offered. | Not decided: "[Action] is unavailable until TravelMudra records how existing work of this service continues during its suspension. Owner: TravelMudra. Your draft is kept." (`existing_work_treatment_missing`); TA-08 shows it in place of the submit control; editing stays offered where Core's `correct` allows it. "Continue": "Check and submit"; the submission is accepted (A15). "Hold": "[Action] is unavailable while TravelMudra holds existing work of this service during its suspension. Owner: TravelMudra. Your draft is kept." (`existing_work_hold`). Withdrawn: A59's TA-08 sentence and "Your draft is kept." A raw TA-08 envelope from before the change is refused with the same reason; nothing submitted. (This amends WP03-A125, which assumed every suspension refuses submission.) | L (+T for "hold" if the run skips it) | UX §3.2 ("as applicable"); BS B07; design §2.11 item 2; WP03-A125 |
| WP13-A64 | TA (Y); test | TA-07 of S1, S2 and P (submitted) under the suspension with the treatment not decided, under "hold" and after the narrowed withdrawal | Read the action panel and status facts. | Core's pending answer has no launch rule, so TA-07 shows the hold only where a travel-agent evaluation carries a launch code (the `assistance` evaluation has the launch stage; `correct` has none), in the design §2.11 sentences with "Owner: TravelMudra" and "Your application is kept."; for the narrowed withdrawal the sentence says that the withdrawal's treatment holds unfiled work, never "did not permit" (L-04), and adds "You can request the withdrawal of this application." where Core offers it. Where no evaluation carries the code (an application that already has an outcome, or none evaluated) the page shows Core's pending answer and invents no hold. The statement for submitted work is "Partly met until STOP-W13-06 (P-19 item 3)": a held submitted case can still read "With TravelMudra". | L+T | UX §2.2, §3.2; F1 "Pending and next action"; design §2.11 item 2, §9.4 STOP-W13-06; L-04 |
| WP13-A65 | TA (Y) | TA-07, TA-09t, TA-08 of D1, D2, S1, S2, P after version 2 is published and after each decision (§3 B5, C3 to D3) | Read. | Before a decision: A40. After "Continue on its current terms": the change blocker is gone; the application keeps its version-1 rules (the version-1 submission window). After D1's transition: D1 follows version 2's rules; nothing the travel agent entered is lost. After "Hold": A40's hold notice. After a decline: A49. Earlier accepted work (documents, answers, the quote) stays on every application (BU-27 "preserving earlier accepted work"). | L | BU-27; BS B06 ("Unaffected work continues"); UX §3.3 |
| WP13-A66 | TA (Y) | TA-06, TA-01, TA-10 of Y at each part of §3 | Read the lists and notices. | Rows show Core's progress and pending owner; a held application is not shown as progressing beyond what Core reports and no hold is invented on a list row. TA-10 shows only the notices Core posts: + 1 per transition that needs authority (S1, S2), each linking to TA-07t (AM-W13-04); no notice for a suspension, a treatment, a lift, a withdrawal, a decline or a retirement (Core posts none) and no page claims that one was sent. | L | UX §4.2; F1 "Effects"; `catalogue-writers.ts:145-150`; design §1.8 AM-W13-04 |

### 2.11 Operator pages

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP13-A67 | Operator (OP1); harness | OP-02 of P under the suspension with the treatment not decided (§3 E3), under "hold" (E6) and after the narrowed withdrawal (H3) | Read the action panel and the readiness checklist. Harness: "Start work" (or "Record readiness") from a page loaded before the suspension (raw). | The "Offering hold" rows of WP-07 F-36 (AM-W13-03): owner "SuperAdmin"; the staff sentences of design §2.13.5 ("No existing-work treatment is recorded for the suspension, so existing work is held."; "Existing work is held by the suspension's treatment."; the withdrawal sentence of A31); no form for a held step. On the case page the action panel names the held step and the owner SuperAdmin even though Core's pending answer still names the operator (Q-01). Steps Core does not stop (outcome, delivery, reconciliation, originals, incidents, withdrawal request) keep their forms. The raw send is refused with the code in words; nothing recorded. | L | UX §3.2; BS B07; WP-09 G-05; `WP-07.md` §4.8 F-36; design §1.8 AM-W13-03 |
| WP13-A68 | Operator (OP1); test | OP-02 of P and fixtures: impact not known, held, transition waiting (unassigned and assigned), declined | Read the readiness checklist and the action panel. | Rows by Core's codes with design §2.13.5's sentences and owner SuperAdmin: `catalogue_impact_unknown` "A catalogue change may affect this application and is not decided yet."; `catalogue_impact_hold` "A SuperAdmin holds this application after a catalogue change." (no named hold owner: the operator's read has none); `transition_pending`, with, for an assigned application, the return step of A50. No operator page offers an impact decision or a transition. | L+T | `WP-07.md` §4.8 F-36; WP-07 F-13; design §2.13.5 |
| WP13-A69 | Operator (OP1); test | OP-01 of OP1 at each part of §3; fixtures | Read P's row and the view counts (deltas from P-0). | F-36's move of a held case to "Waiting" (owner SuperAdmin) and its removal from the navigation count apply only when Core's pending answer reports the launch hold: the list read carries no action evaluations. Until P-19 item 4 is served the run record reads "Unmet: waits for the Core pending fix (P-19 item 4)" for the list and the count (L-08); the row words of A67 still apply on the case page, and the test asserts that the view, the count and the case page use one mapping and that no list row invents a hold. | T | `WP-07.md` §4.8 F-36 as amended; WP-07 F-07, F-16, F-30; L-08; Q-06 |
| WP13-A70 | Test | Duties under a suspension (each treatment) and a withdrawal (each treatment) | Run Core and page tests. | Recording an outcome, completion, result delivery (send and download), act evidence and reconciliation of an uncertain filing, original custody and return and incident work are not stopped by launch control, and their pages show no launch hold. Tests: `test/core/launch.test.ts` "holds submission, assignment and filing under a holding suspension; duties continue"; WP11-A25 (reconciliation under a suspension); a WP-13 test for an original return and a result download under a withdrawal with "hold". | T | UX §3.2; BS B07; design §4.3 |

### 2.12 Command results, access and shell on WP-13 pages

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP13-A71 | SuperAdmin; TA | Every WP-13 page | Read the shell. | Environment label; "[TEST]" title prefix; the rail "Offerings & launch" with the members Offerings (renamed from "Catalogue"), Impact review, Launch, Public site (D-W13-13); SA-05a's header link "Impact review" is gone; crumbs of design §1.4 ("Offerings › [offering] › Readiness and launch" for SA-05j; "Offerings › [offering] › Retire"; "Impact review › Assessment no. [n]: [offering] › Application [reference] › Transition"; TA-07t "… › [applicant] › Changed service terms"); one `h1`; "Read at [time] IST". SA-05g's crumb reads "Offerings". | L | PL §2.1, §2.2; design §1.4; WP-02 §6 |
| WP13-A72 | SuperAdmin; TA; harness; test | Every accepted WP-13 command; edited receipt addresses; competing-operation fixtures (L-05) | Read each receipt. Open edited addresses: a `lifted` code with a suspension key; a `retired` code with an offering-creation key; a `reviewer` code with a publication operation's key (a summary that holds `assessmentId` and no `generation`); a `retired_draft` code with an owner-approval or a declaration-preview key (a summary that holds `declarationId` and no `versionNo`); a `transition` code with a repeat approval's key; another offering's key; SA2 opens SA1's addresses. | A named receipt needs the expected resource and the complete distinguishing summary signature of design §2.14 (the exact set of domain keys and their formats, not only the presence of one key); anything else is the neutral "Request recorded" with Current facts: `suspended` (exactly `suspensionId`, `treatment`) "Offering suspended"; `treatment` (exactly `treatmentId`) "Existing-work treatment recorded"; `lifted` (exactly `suspensionId`, `restoredLaunchId`) "Suspension lifted"; `withdrawn` (exactly `withdrawalId`, `treatment`) "Offering withdrawn"; `retired` (exactly `offeringId` = the path id, numeric `revision`) "Offering retired"; `recheck` (exactly `assessmentId`, numeric `generation`) "Recheck requested"; `retired_draft` (exactly `declarationId` = the path id) "Declaration draft discarded"; `reviewer` (exactly `assessmentId` = the path id) "Accountable SuperAdmin assigned"; `decided` (exactly integer `decided`) "Impact decision recorded"; staff `transition` (exactly `transitionId`, boolean `taAuthorityRequired`) "Transition approved" with no claim that a transition was created, waits or was applied; TA `transition` (exactly `applicationId` = the path id, `transitionId`) "Decision on the changed terms recorded" with no choice named. Each competing fixture renders neutral. Recorded facts come only from the summary or a record selected by a returned id; everything else is "Current". An edited address never shows another command's title. SA2 gets the unchecked receipt with the current facts (J-09). No accepted time (P-02). | L+T | WP-02 B-02; WP-06 D-02; WP-12 J-08, J-09; design §2.0, §2.14; L-05 |
| WP13-A73 | SuperAdmin; TA; test | Receipt addresses of the suspension (A09), the treatment (A15) and the transition of S1 (A43), opened again after the lift, the withdrawal and the travel agent's decline | Open each address again. | Each keeps what was recorded then and shows the current facts labelled "Current": the suspension receipt after the lift reads Current "Suspension: none" and gives no "record a treatment" step; the treatment receipt reads "Replaced or ended"; the S1 transition receipt never shows "waits for the travel agent" or "applied" (no read gives the transition state, L-05). No receipt or status read tells anyone to act from an older state (F-33). | L+T | WP-07 F-01, F-33; WP-09 G-10; design §2.14; L-05 |
| WP13-A74 | SuperAdmin; TA | Each command of §1.2 with a lost acknowledgement (fixture); a refused send | Inject the fault. Open the operation status page. "Check status" after the original resolves. Open the status page of a refused send's key. | C4 (CMP-13) "Checking the original result" and "Check status" (`/admin/operations/<key>`, `/ta/operations/<key>`); no new send of the same intent is offered there. "Check status" shows the accepted result with the naming of A72. A refused send leaves no operation record: "Nothing is recorded for request [reference] so far"; the refusal shows only on the re-rendered page. | T | PL §1.1 UNR; BS B35; WP-01 A-08; WP06-A104 |
| WP13-A75 | Harness | Each command of §1.2 | (1) Identical replay. (2) Same key, changed content. (3) Business duplicate: a new key with the current page's facts (or, where no page offers it, a raw envelope with current revisions). (4) Raw stale envelope: a new key with an older revision. (5a) Raw resend of a refused envelope after the facts changed. (5b) Corrected submission from a freshly loaded page. | (1) The original result; nothing new. (2) `conflict_operation_key`; nothing recorded. (3) Suspend `suspension_active`; lift `suspension_not_active`; withdraw `offering_already_withdrawn`; suspension treatment `treatment_unchanged`; withdrawal treatment `withdrawal_treatment_widening_unavailable`; retire `offering_retired`; discard `declaration_not_draft`; transition `transition_pending` while waiting, otherwise accepted with no new transition (Q-03); TA decision `stale_revision`; reviewer, item decision and recheck: accepted again (no duplicate guard; claimed by no page). (4) `stale_revision` and CMP-14 for every command with a revision or token (controls, treatment id, assessment, item, offering, declaration, application); the recheck takes none, so its stale case is a new generation. (5a) The refused key has no record; Core evaluates the envelope again against its own revision (H-07). (5b) The current revision decides. A duplicate test uses (3), never (4) or (5a). Browser Back is not a replay. | T | WP-06 D-12; PL §7 K-STD; BS B35; WP-10 H-07; design §4.1 |
| WP13-A76 | SuperAdmin; TA | Every refusal reachable on `lane-ui` in §2.1 to §2.11 | Read each message. | The sentence of design §2.16 in CMP-07, at the place it names (field, form level, closed state), with the owner or route where one exists; "Nothing changed" only after a proven refusal (WP-02 B-03); the reference code as secondary text for staff. Never a code alone (except UAT-13), "Something went wrong", "Invalid data" or "A requirement of this item is not met". | L | PL §1.1 REJ, §11.1; CR-01; design §2.16 |
| WP13-A77 | — | Text map of every reason, classification and state the WP-13 pages can show (unit test, design §7.1 U0) | Check the map against Core's vocabulary. | Staff words for every `IMPACT_CAUSES`, `IMPACT_CHANGE_CLASSES`, `IMPACT_CLASSIFICATIONS`, `IMPACT_TREATMENTS`, `ASSESSMENT_STATES`, `EXISTING_WORK_TREATMENTS` value (design §2.13; "Reviewed" never claims that nothing waits, F-W13-09); the staff sentences of §2.13.5 under Core's keys (the wrong keys `existing_work_held` and `treatment_missing` are gone, F-W13-01; the stray TA key `existing_work_held` is gone); the TA sentences of §2.11 for `offering_suspended`, `existing_work_treatment_missing`, `existing_work_hold`, `offering_withdrawn`, `withdrawal_continuation_not_permitted` (true for a permitted withdrawal narrowed later, L-04), `catalogue_impact_unknown`, `catalogue_impact_hold`, `transition_pending`, `catalogue_not_published`; every refusal of design §2.16; the next actions `decide_transition` and `return_to_ta` with the reason `transition_pending` (per reason and next action, F-13 class). An unknown value reads "Unrecognised classification ([code])" or the category text with "Reference code: [code]". No sentence says "until … offers this service again". `access_denied` renders SH-02 or the uniform not-found page, never a text. | T | CR-01; UAT-13; design §2.11, §2.13, §2.16; L-04 |
| WP13-A78 | SuperAdmin; TA | SA-05h, SA-05j kinds, SA-05x, SA-05m, SA-05n, SA-05t, TA-07t (HTTP tests) | (1) Let a page's mandatory read fail for availability (`ops.launch_offering`; `cat.admin_assessment`; `core.ta_application`). (2) Let a required decision read fail: the head read of SA-05t; the launch summary of SA-05x; the current treatment row of `suspension_treatment`. (3) Let an optional read fail or reach its cap: the SuperAdmin accounts read (reviewer and hold-owner choices); the head read of SA-05j `lift`. (4) Separately: revoke access, end the session, close the installation or start a support view between two reads. | (1) The frame stays; the block reads "Unavailable"; no decision form; CMP-10 with the owner TravelMudra (F-04, H-05, I-05 class). (2) No form and the CMP-10 of design §2.0 / §2.2.2 / §2.3 ("Approving a transition cannot be prepared now: the offering's head cannot be read. …"; "Whether this offering is launched cannot be read now, so it cannot be retired here. …"; "The current treatment cannot be read, so it cannot be changed here now. Existing work is held meanwhile. …"). (3) The selects degrade to a text field with "Account reference of an active SuperAdmin. The account list is unavailable now." and the form stays (L-12); the lift head versions read "Unavailable" and the form stays. (4) The access page (SH-02, sign-in or maintenance), never the facts read earlier (LD-14). No page code catches every error around a read. | T | LD-14; WP-07 F-04; WP-11 I-05; design §2.0; L-12 |
| WP13-A79 | Operator; TA; SuperAdmin | The WP-13 staff addresses as an operator and as a travel agent; TA-07t as a SuperAdmin | Open each. Post each staff command as OP1 (harness). | Operators get SH-02 on every SA-05 page (no offering, assessment or application fact) and each post is refused as not found; the travel agent's session does not open staff pages; a SuperAdmin outside a support view has no TA-07t; a support view is read only (A81). Nothing recorded. | L | BS B10; PL §2.3; policy `launch.*`, `catalogue.*` (SA); `application.decide_transition` (TA own) |
| WP13-A80 | SuperAdmin; TA | Every WP-13 page | Read all visible text. | The words of §0.2 and design §2.0 "Copy"; no forbidden label of PL §11.1; none of "Relaunch", "Override", "Reviewed" or "Nothing to review" as a claim that no work waits, "continues as TravelMudra decided", "until TravelMudra offers this service again", "Accepted the changed terms" or "Declined" on a receipt, "applied" for a transition the read does not show applied, "the current terms" as a transition target (L-02), "Restore offering", "Migrate", "Apply to all", "Change service" or "Change country" (a service or country switch needs fresh intake, UX §6.3); no SLA, date or wait-list promise; no configuration value the page does not read; times carry IST; counts name their unit; synthetic data carries the synthetic label. | L | PL §11.1; UX §6.3; design §2.0; CR-02, CR-03, CR-06 to CR-08; WP-01 Q-13; L-02 |
| WP13-A81 | SuperAdmin in a support view of Y (test) | TA-02, TA-03, TA-07, TA-07t in a support view | Render. Post a decision. | The same facts, read only; TA-07t shows items 2–5 and "Read-only view: the travel agent decides here." with no form; the `/admin` pages answer 409 `support_view_active`; the post is refused; nothing recorded. | T | BS B10; PL SH-R09; design §2.10 states |
| WP13-A82 | SuperAdmin; TA | Every WP-13 form page | Inspect browser storage after use. Read the response headers. | No reason, evidence reference, note, treatment or decision is kept in `localStorage`, `sessionStorage` or IndexedDB. Signed-in pages send `no-store`. | L+T | PL §2.3 SH-R12 |
| WP13-A83 | — | Host pages, carried forms and routes | Run `test/unit/web/offering-change-host-pages.test.ts` (design §7.2). On `lane-ui` open SA-05h, SA-05b, SA-05c, SA-05m and TA-07 of S1. Run the route tests. | Each POST action appears as a form action on exactly one renderer (L-12): suspend, lift and withdraw only on their SA-05j kinds; the treatment action only on `suspension_treatment` and `withdrawal_treatment` (one each); retire only on SA-05x; recheck only on SA-05b; discard only on SA-05c; reviewer only on SA-05m; the item decision only on SA-05n; the transition only on SA-05t; the travel-agent decision only on TA-07t. SA-05h holds no WP-13 form; SA-05m holds only the reviewer form; TA-07 links to TA-07t and keeps the WP-17 held-correction form. The seven WP-13 entries of `carried-forms-admin.test.ts` and the transition entries of `carried-forms-ta.test.ts` and `application-workspace.test.ts` are removed; the WP-15 entries stay. The four new GET routes (SA-05x, SA-05n, SA-05t, TA-07t) are in the route inventory; `LAUNCH_DECISION_PAGE_KINDS` holds the seven kinds and an unknown kind is the uniform 404 (`bff-catalogue.test.ts`). Accepted commands answer with a receipt location (`&op=`), no plain `?done=` flash. The pins of design §7.3 change as listed. | L+T | LD-02, LD-03, LD-07; CC-12 to CC-16; design §1.5, §1.6, §7.2, §7.3; L-12 |
| WP13-A84 | `syn-ta-2`; SuperAdmin; operator | TA-03 and TA-07t of O's applications as `syn-ta-2`; ids of another offering, assessment or item in the paths; an item id of another application in the transition post | Open each; post. | `syn-ta-2`: the uniform not-found page for TA-03 of O and TA-07t of S1. SA-05n and SA-05t answer the uniform 404 when the item is not in that assessment. The transition post with another application's item: not found (the binding refuses before the policy); nothing recorded. No fact of O's applications shows to anyone outside its scope. | L | BS B10; UX §2.3; design §1.3; F2 §3 binding |
| WP13-A85 | Test | The 11 handlers and the catalogue-admin binding (BFF tests, L-10) | Send forms with: a reason of 10, 1000 and 1001 characters; evidence references of 200 and 201 characters; an evidence row with a note and no kind or reference; an additional indexed row (`evidence.1.*`); the same two cases for the `feasibility` prefix of the withdrawal; a feasibility row and an evidence row; acknowledgement checkboxes for every unavailable action; an unknown field. | Every field reaches Core whole; nothing is sliced. The BFF refuses, before the command and at the field with every value kept: an incomplete evidence row (a note, or a kind, or a reference alone: "Give the kind and the reference of this evidence, or clear the row."), and an additional indexed row that the binding cannot carry ("Only one evidence row can be recorded here."), for both the `evidence` and the `feasibility` prefixes; no evidence is ever dropped silently. Over-limit input is refused at its field by Core with the values kept. Each WP-13 form offers exactly one row per prefix (D-W13-11); the one-row binding is a Core API note (P-19). | T | LD-17; WP-12 J-06; design §2.17; L-10 |
| WP13-A86 | SuperAdmin; TA | Every WP-13 form after a refusal, including one after which the form no longer applies (retired; not a draft; already suspended; decided) | Cause each refusal. | The refusal and the submitted values render independently of the current eligibility (WP-02 R-03 class): the form re-renders at the POST address with CMP-07 focused and every typed value and choice kept; where the form no longer applies, the closed state shows the refusal sentence first and the typed reason read only in the unsent block (design §4.2); no refusal is lost because its section hides (F-W13-08). Hidden decision values (`existingWorkTreatment`, `treatment`, `decision`, `causeRef`, `expectedTreatmentId`, `suspensionId`, `transitionId`) come from the posted form, never from a fresh read (WP-02 R-01 class). The withdrawal's irreversibility checkbox is left clear after any refusal; the lift's acknowledgements stay ticked where the item and code are unchanged, as the WP-02 `launch` decision does (one policy, L-12). | L+T | WP-02 R-01, R-03; UX §3.3; WP-09 G-07; design §2.0, §4.2; L-12 |

### 2.13 Accessibility (AC-01 to AC-28 that apply)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP13-A87 | Keyboard-only SuperAdmin and travel agent | §3 steps E1, E4, F2, G1, C2, C3, C5 and D2 at 1440 px; E1 and D2 at 390 px | Use the keyboard only. | Every step works with Tab, Shift+Tab, Enter, Space and Escape: the radios, the acknowledgement checkboxes, the evidence row, the reviewer and hold-owner selects (and their text fallback), the review and the final buttons; the discard `confirmDisclosure` on SA-05c opens and closes by keyboard. No action needs a mouse, hover or drag-and-drop. | L | AC-01, AC-12 |
| WP13-A88 | Keyboard-only user | Every WP-13 page at 1440 and 390 px and at 400% zoom | Tab through the page. | Focus is visible (at least 3:1) and never hidden by the top bar, the rail or a bottom action area. | L | AC-02 |
| WP13-A89 | Phone user | SA-05h, SA-05j kinds, SA-05m, SA-05n, SA-05t, TA-03, TA-07t | View at 320 px, and at 1280 px with 400% zoom. | No two-dimensional page scrolling. The effects table and the items table scroll only inside a labelled region, or become cards. Scope and effect come before the fields; the primary action is at the end of the form, never in a fixed bar. | L | AC-04, AC-21; UX §7.3 |
| WP13-A90 | Any | Every WP-13 form | Inspect each input. | Each input has a visible label; the radio groups sit in fieldsets with the legends of the design ("Existing work during the suspension", "May submitted, unfiled work continue?", "Decision", "Your decision") and none is preselected; the selects "Accountable SuperAdmin" and "Owner of the hold (for Hold)" have labels and the text fallback has its hint; the evidence row labels its kind, reference and note; required and optional fields say so; the irreversibility checkbox has a visible label and is described by the "It ends" effect group; the reason hint says "At least 10 characters. It is kept in the audit record." | L | AC-05, AC-15; design §5 |
| WP13-A91 | Any | Effects, treatments, item states, boundaries | View in greyscale. | Each effect and state has text; nothing is shown by colour alone ("Held" and "Refused" are words, not only colours). | L | AC-06 |
| WP13-A92 | Any | Every WP-13 form | Send each form with an error. | Focus moves to the error summary; each link moves focus to its field; values and choices stay (A86); the irreversibility checkbox is clear; the lift acknowledgements follow A86's policy. | L | AC-08; CMP-07 |
| WP13-A93 | Screen-reader user | Receipts; the withdrawal's "It ends" group; the boundaries of A22, A47 (the waiting state), A53, A58, A63, A67 | Read with VoiceOver or NVDA. | Receipts are announced politely without moving focus. The irreversibility statement, TA-07t's waiting state and the boundaries are read before the controls they concern. | L | AC-09, AC-16 |
| WP13-A94 | Screen-reader user | Each unavailable action (lift blocked, retirement blocked, a held step on OP-02, the TA-08 submit under a hold, Accept on TA-07t) | Focus the control or the notice. | The reason is exposed (`aria-describedby`, or the notice in reading order); an `unavailableButton` has `aria-disabled="true"`; a role-forbidden action is not shown at all. | L | AC-13; CMP-10; PL SH-R08; design §5 |
| WP13-A95 | Phone user | Every WP-13 page at 390 px | Measure each control. | Every control is at least 24 × 24 CSS px; the final buttons are at least 44 × 44 CSS px; radio and checkbox labels are part of their targets. | L+T | AC-10 |
| WP13-A96 | — | Every WP-13 page | Measure contrast of text, focus, effect words and notices. | Normal text at least 4.5:1; non-text indicators and focus at least 3:1. | L+T | AC-11 |
| WP13-A97 | Any | Long texts; reduced motion | Use an offering title of 120 characters, a reason of 1000 characters, an evidence note of 200 characters and a 60-character applicant name. Turn on "reduce motion". | Titles, reasons and names wrap without hiding identity; a truncated text has a full form that keyboard and touch reach. No transition plays. | L | AC-14, AC-20 |
| WP13-A98 | SuperAdmin and travel agent (observation) | SA-05j `suspend` before E1; TA-07t of S1 before D2 | Ask SA1 "If you suspend with 'Not decided yet', can the travel agent still submit a draft, and can the operator keep working?" and Y "What happens if you decline, and what if you do nothing?". | The run record reports the answers and the sample size; confusing a suspension with a withdrawal, "Not decided yet" with "Let existing work continue", or a decline with a withdrawal of the application is a finding. No pass target (observation only). | L | AC-24, AC-26; UX §12 (usability) |

### 2.14 axe checks (WCAG 2.2 A/AA)

Rule for every row: run axe (`@axe-core/playwright` 4.13.0, tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`,
`wcag22aa`) at 1440 × 900 and at 390 × 844. Expected: no violation of impact "serious" or "critical" at either width.
Record the counts of minor and moderate violations. WP-13 uses synthetic data only. The WP-13 states of pages that other
packages own (TA-07, TA-08, OP-02) are covered here because WP-13 changes them; their base states stay with their own
packages.

| ID | Persona | Page (state) | Where | Source |
|---|---|---|---|---|
| WP13-A99 | SuperAdmin | SA-05h of O: suspended, treatment not decided (A01, A02) | L | UX §7.5; AC-01 to AC-28 |
| WP13-A100 | SuperAdmin | SA-05h of O: withdrawn, narrowed to hold (A01) | L | same |
| WP13-A101 | SuperAdmin | SA-05j `suspend`: the form (A07) | L | same |
| WP13-A102 | SuperAdmin | SA-05j `suspend` with the error summary (A08 (1)) | L | same |
| WP13-A103 | SuperAdmin | SA-05j `suspension_treatment` and `withdrawal_treatment`: the forms (A14, A17) | L | same |
| WP13-A104 | SuperAdmin | SA-05j `lift`: the form with the acknowledgements (A21) | L | same |
| WP13-A105 | SuperAdmin | SA-05j `withdraw`: the form (A26) | L | same |
| WP13-A106 | SuperAdmin | SA-05j `withdraw` after the `withdrawal_permission_required` refusal (A27 (2)) | L | same |
| WP13-A107 | SuperAdmin | SA-05l with O's assessment (A32) | L | same |
| WP13-A108 | SuperAdmin | SA-05m "Review required" with the item groups and the reviewer form (A33, A34) | L | same |
| WP13-A109 | SuperAdmin | SA-05n: the decision choices offered by the item facts (A35) | L | same |
| WP13-A110 | SuperAdmin | SA-05t: the form with the evidence limitation line (A41) | L | same |
| WP13-A111 | SuperAdmin | SA-05x blocked while launched (A53) | L | same |
| WP13-A112 | SuperAdmin | SA-05c: the "Discard this draft" disclosure open (A56) | L | same |
| WP13-A113 | TA | TA-03 of O suspended (A58) | L | same |
| WP13-A114 | TA | TA-09c with O unavailable (A60) | L | same |
| WP13-A115 | TA | TA-08 of D3 with the treatment not decided (A63) | L | same |
| WP13-A116 | TA | TA-07 of S1: the changed-terms action panel (A47) | L | same |
| WP13-A117 | TA | TA-07t: the Decline form and the waiting state (A47) | L | same |
| WP13-A118 | Operator | OP-02 of P with the held step (A67) | L | same |
| WP13-A119 | SuperAdmin; TA | Operation status page of a WP-13 command, accepted and "Nothing is recorded" (A74) | L | same |

## 3. Proof scenarios V20 and BU-27

V20 (UX §12): "Publication/released binding does not launch a new route. Existing-case impact is explicit. Supported
structural update to launched unsuspended offering needs no invented second launch approval for new cases." Authority
B05 to B07. BU-27 (bulk spec §11): "No offered service available or current eligibility changes: no invented
offering/default; affected action explains its constraint and next owner while preserving earlier accepted work." Also
UX §3.2 "Withdrawn/suspended offering" and §6.3.

One ordered recipe (§0.4; design §6 with the architect's decisions Q-W13-07 and L-01 to L-11) serves both proofs.
"Setup" steps use pages of other packages; they are not the subject under test. "Observe" steps check items that other
packages own. Every harness send uses a freshly loaded page unless the step says "raw". Parts G and H cannot be undone
and apply to O only.

| Step | Actor, page | Action | Observable result | Items | Where |
|---|---|---|---|---|---|
| P-0 | SA1: SA-05a, SA-01; OP1: OP-01; `syn-ta-2`: TA-02 | Read the counts. | The run record holds the baselines of §0.4. | — | L |
| Setup-1 | SA1 (SA-06) | Create and activate Y; read Y's TA-10 count. | Y active. | — | L |
| Setup-2 | SA1 (SA-05a to SA-05e, WP-02 §3 D2 to D7) | Create O; register declaration version 1 from the head body of "SYN Tourist e-visa"; record the structural approval; ask the active release for a binding; save values (₹3,300); preview; publish. | O published with a binding. | — | L |
| A1 | SA1: SA-05h, SA-05j `suspend` and `withdraw`; Y: TA-02; harness | Read. Harness: a suspension of O; a withdrawal of O (acknowledged, with evidence); an individual intake of Y naming O. | O "Not launched" (observe WP02-A54); the two kinds show their "not launched" closed states; the harness sends refused `offering_not_launched`, nothing recorded; Y's TA-02 delta 0; the intake records no draft. V20 clause 1 (with the release cut-over test of §4). | A10 (1), A29 (2) | L |
| Setup-3 | SA1 (SA-05i, SA-05j kind `launch`) | Record a complete plan; launch O for named Y with every acknowledgement. | O launched for Y. | — | L |
| Setup-4 | Y (TA-09c, TA-08); SA1 (SA-07a, SA-03a) | Create the group; create D1, D2 on O and E on "SYN Tourist e-visa"; create and submit S1, S2 and P on O. Record P's payment; assign P to OP1. | Five applications of O on version 1; E. | — | L |
| B1 | SA1 (SA-05b, SA-05c, SA-05d; Setup) | Register declaration version 2 (travel-date rule 3 → 5 days), record its structural approval, ask for its binding, save values for version 2. | Version 2 supported and bound; O's launch unchanged. | — | L |
| B2 | SA1 (SA-05e; Observe) | Preview version 2 with its values; read the impact and the two sentences of design §2.12 item 2; publish with "Existing drafts: Hold for review" and "Submitted, unfiled work: Move to the new head", evidence and a reason. | The preview lists the open applications by class (observe WP02-A60); the Effect says that new cases of the audience use this version at once with no new launch decision; the receipt names the new head. | A05 | L |
| B3 | SA1: SA-05h, SA-05j kind `launch`, SA-05b; Y: TA-02, TA-03 | Read. | Launch state, audience and decision unchanged; the readiness note; the effects table all Allowed; SA-05j `launch` no form; Y sees O "Available for new applications". V20 clause 3. | A01, A02, A05 | L |
| B4 | SA1: SA-05l, SA-05m, SA-05b, SA-05a; SA-01 (Observe) | Read until the state leaves "Rechecking". | O's assessment listed; groups "Held" D1, D2 (owner SA1) and "Need a decision" S1, S2, P ("On an earlier structure"); E has none; SA-05a "[n] open" links to SA-05b; SA-01 group 8 counts O (delta from its baseline only). V20 clause 2. | A03, A32, A33 | L |
| B5 | Y: TA-07, TA-08 of D1, D2; TA-09c; OP1: OP-02 of P | Read. Y creates D3 on O (complete documents). | D1 and D2: the hold notice with owner TravelMudra, drafts kept; P: the readiness row "A catalogue change may affect this application …", owner SuperAdmin; D3 is created on version 2 with no blocker and no launch step. BU-27 (eligibility change) and V20 clause 3. | A40, A65 | L |
| C1 | SA1: SA-05m | Read the items after D3's creation. | D3 has no item (it is on the head); nothing else changed. | A33 | L |
| C2 | SA1, SA2: SA-05m; harness | Assign SA2 as reviewer (the A34 sequence: OP1's id by harness; SA2's stale tab). | Receipt; refusals as A34; nothing recorded by them. | A34 | L |
| C3 | SA1: SA-05n of D2; harness | Decide "Continue on its current terms". Harness: "Move to the head without a transition" for S2. | Receipt; D2's hold notice gone; the harness send refused `continuation_unsupported`. | A35, A36 (3), A65 | L |
| C4 | SA1: SA-05n of P; OP1: OP-02 of P | Send "Hold" with no owner; then with owner SA2. Read OP-02. | C1 at the owner; then the receipt; OP-02 readiness row "A SuperAdmin holds this application after a catalogue change.", owner SuperAdmin. | A35, A36 (1), A68 | L |
| C5 | SA1: SA-05t of D1; harness; Y: TA-07 of D1 | Read the target line and the evidence limitation. Harness: an external reference as the only evidence. Then approve with a release manifest that names the target binding shown on the page. | `transition_evidence_missing`, nothing recorded; then "Transition approved", authority not required, no "applied" claim; D1's hold notice gone; TA-10 delta 0. The run record: binding-only proof, "Unmet for B06: waits for Max's decision on P-19 item 2". | A41, A42, A44 (2) | L |
| C6 | SA1: SA-05t of S1, S2; harness; Y: TA-10 | Approve S1 and S2 (binding-only, as C5). Harness: a second approval of S1. | Receipts with authority required; TA-10 + 2 with links to TA-07t; the second approval refused `transition_pending`; the binding-only note as C5. | A43, A44 (3) | L |
| C7 | SA1: SA-05m | Read the rows of D1, S1, S2. | "Transition approved" rows with "Decide" and without "Approve a transition"; the decline line. | A33, A45 | L |
| C8 | SA1: SA-05n of P; OP1: OP-02 of P; harness | Decide P "Continue on its current terms". Harness: the D2 decision again with a new key. | Receipt; P's row met; the new-key send accepted again with no page claiming duplicate protection. | A35, A37 | L |
| C9 | SA1, SA2: SA-05b recheck; SA-05m | Request a recheck on SA-05b; SA2 requests one from an older page; read SA-05m until it settles. | Two generations; every decision kept; receipts on SA-05b. | A38 | L |
| D1 | Y: TA-07, TA-07t of S1 | Read; "Cancel". | TA-07's step and "Service terms" row; TA-07t with Decline, the waiting state and no Accept; exact target words; nothing recorded. S1 keeps waiting for the rest of the run ("Accept: Unmet, waits for Max's decision on P-19 item 1"). | A47, A48 | L |
| D2 | Y: TA-07t of S2; harness | Send with no choice; then "Decline". Harness: the replay; a new-key decline from the page loaded before (raw). | C1; the neutral receipt "Decision on the changed terms recorded"; "No change of service terms waits for your decision now."; the replay returns the same receipt; the raw send refused `stale_revision` (CMP-14). | A49, A51 (1), A52 | L |
| D3 | SA1: SA-05m, SA-05t, SA-05n of S2; SA-05l, SA-01; harness | Read. Open SA-05t of S2 by its address. Harness: a second approval of S2 (raw). Open SA-05n of S2 and decide "Hold" (owner SA2). | SA-05t closed with the route to SA-05n; the raw approval accepted by Core with no transition and a receipt that claims none (Unmet: P-19 item 4); no queue item or count for the decline (Unmet: P-19 item 4); the re-decision accepted. | A45, A49 | L |
| D4 | `syn-ta-2` | Open TA-07t of S1; post. | The uniform not-found page; nothing recorded. | A51 (2), A84 | L |
| E1 | SA1, SA2: SA-05j kind `suspend`; harness | The A07 and A08 sequence; suspend with "Not decided yet"; harness: a second suspension; SA2 sends from an older page. | Receipt "Offering suspended"; refusals as A10; nothing recorded by them. SA-01 "Suspended offerings" lists O with "check treatment" (observe D-19). | A03, A07, A08, A09, A10 (2), (3), A11 | L |
| E2 | Y: TA-02, TA-03, TA-09c, TA-05, TA-06; `syn-ta-2`: TA-02; harness | Read. Harness: an intake row for O (raw, page loaded before E1). | O not offered for new applicants, with its reason and owner; no default; the row refused, nothing created; every earlier application listed with its own state (count delta 0); O absent for `syn-ta-2`. BU-27 (no offered service). | A09, A58, A60 | L |
| E3 | Y: TA-07, TA-08 of D3, TA-07 of P; OP1: OP-02 of P; harness | Read. Harness: "Start work" on P (raw). | D3's submission held with owner TravelMudra; P's TA-07 as A64; OP-02 the F-36 row with owner SuperAdmin, no form; the raw send refused `existing_work_treatment_missing`. | A63, A64, A67 | L |
| E4 | SA1: SA-05h, SA-05j kind `suspension_treatment` | Read the action panel; open the page; record "Let existing work continue". | The A05 step; the A14 page; the A15 receipt. | A05, A14, A15 | L |
| E5 | Y: TA-08 of D3; OP1: OP-02 of P (Setup) | Y submits D3. OP1 starts work on P. | D3 submitted during the suspension; P's work started. | A15, A63 | L |
| E6 | SA1, SA2: SA-05j `suspension_treatment`; harness; OP1: OP-02 of P; Y: TA-07 of P | Record "Hold existing work" (the only change offered). Harness: an unchanged envelope (raw). SA2 sends its saved form. Read. | Receipt; `treatment_unchanged`; C5; P's readiness step held (`existing_work_hold`); TA-07 as A64. | A16, A64, A67 | L |
| F0 | SA1: SA-05x of O; harness | Read. Harness: a retirement. | The unavailable state with the link to `withdraw`; refused `retire_requires_not_launched`; nothing recorded. | A53 | L |
| F1 | SA1: SA-05j kind `lift` | Read; tick one acknowledgement of two; send. | The A21 page; `launch_acknowledgement_mismatch` with the ticked box kept; nothing recorded. If the plan is not complete for version 2, the A22 unavailable state shows; SA1 records a new plan version (Setup, §0.4). | A21, A22, A24 (1) | L |
| F2 | SA1, SA2: SA-05j `lift`, `suspension_treatment`; Y: TA-03; `syn-ta-2`: TA-02; harness | Lift. Harness: a second lift. SA2 sends from an older page. Read. | "Suspension lifted"; O available for Y only; `suspension_not_active`; C5; the treatment kind closed. | A18, A23, A24 (2), (3), A25 | L |
| F3 | SA1, SA2: receipt addresses of E1, E4, C6 | Open them again; SA2 opens SA1's. | Historical facts kept; Current facts; no instruction; no transition state claimed; SA2 the unchecked receipt. | A72, A73 | L |
| G1 | SA1: SA-05j kind `withdraw`, SA-05h, SA-05j `launch` and `expand`; Y: TA-03, TA-08 of D2; OP1: OP-02 of P | The A27 sequence; withdraw with "Yes, it may continue" and feasibility evidence. Read. | Refusals as A27; "Offering withdrawn"; no launch or expansion form; TA-03 withdrawn words; D2 cannot be submitted, draft kept; P's work continues. BU-27 (withdrawn service). | A26, A27, A28, A59, A63 | L |
| G2 | SA1, SA2: SA-05j `withdraw`, `suspend`; harness | A second withdrawal; SA2's older page; the replay; read `suspend`. | `offering_already_withdrawn` (closed); C5; the same receipt; `suspend` closed with the route to `withdrawal_treatment`. | A10 (4), A29 (1), (3), A30 | L |
| H1 | SA1, SA2: SA-05c (version 3); harness | Setup: register version 3 as a draft. Discard it; SA2's older page; a new-key send. | "Declaration draft discarded"; `declaration_not_draft` shown first in `main`. | A56 | L |
| H2 | SA1, SA2: SA-05x, SA-05a, SA-05b, SA-05h; Y: TA-02, TA-03; harness | Read SA-05x (the list of blocked commands). Retire O. Harness: a declaration draft, a values draft and a launch plan for O; a second retirement. SA2's older page. | "Offering retired"; the harness sends refused `offering_retired`; the second retirement shown as the closed state; Y sees O withdrawn and "not offered", never "Retired". | A54, A55, A59 | L |
| H3 | SA1: SA-05j kind `withdrawal_treatment`; OP1: OP-02 of P; Y: TA-07 of P; harness | After the retirement: record "Hold the remaining work". Reopen. Harness: "continue" (raw). | Narrowing accepted after the retirement (L-11), no availability restored; P held with the sentence true for a narrowed withdrawal; closed "already held"; widening refused. | A17, A31, A64, A67, A122 | L |
| X1 | OP1, OP2; `syn-ta-2`; SA1 | The A79 and A84 reads and posts; the edited receipt addresses of A72. | SH-02 or not found; nothing recorded; no wrong receipt title. | A72, A79, A84 | L |
| X2 | Test | A02, A05, A06, A08 (4), A10 (test), A11 to A13, A14 (fixture), A16 (4), A18, A19, A21 (fixture), A22, A25, A26 (fixture), A29, A30, A31, A33 (fixtures), A34 (5), A36 (5), A37, A38, A39, A40, A44 (5), A45, A46, A48, A50, A51 (3), A52, A55, A56, A57, A59, A61, A62, A63 (hold), A64, A68 to A70, A72 to A75, A77, A78, A81 to A83, A85, A86, A95, A96, A120 to A123; the Core tests of §4 | As the items. | as listed | T |
| X3 | axe | The WP-13 pages in the states of A99 to A119. | No serious or critical violation at 1440 px and 390 px. | A99 to A119 | L |

Proof split: V20 passes when A1, B2 to B5, C1 to C9 and D1 to D3 pass on `lane-ui` at the integrated WP-13 commit and
the V20 tests of X2 pass. Clause 1 is shown by Setup-2 with A1 and the release cut-over test. Clause 2 is shown by B2,
B4, B5 and C1 to D3. Clause 3 is shown by B2, B3 and B5. BU-27 passes for the non-bulk pages when B5, E2, G1 and D2 pass:
no default is invented, the affected action names its constraint and owner, earlier work stays. Recorded "Unmet", not
passed by pinning a defect: Accept (D1; P-19 item 1); the binding-only proofs of C5 and C6 as B06 acceptance (P-19 item
2); the decline's owner and the empty repeat approval (D3; P-19 item 4); the exact target (A120, A121; P-19 item 4);
OP-01's list and count (A69; P-19 item 4). V20 and BU-27 are therefore recorded "Passed with recorded gaps" until P-19
is answered and served. The suspension, treatment, lift, withdrawal and retirement steps (E to H) are part of the
package pass (§0.2). The run record names the `lane-ui` ref, the run tag, Y's identifier, O's service code, each
test, the identifiers (internal record only) and every delta.

## 4. Scenario parts outside this proof (traceability)

| Scenario part | Where it is proven |
|---|---|
| A released binding and a head change at deployment launch nothing and migrate no application (V20 clause 1) | Core test `test/integration/catalogue-release.test.ts` "registers during the cutover: a head binding change at deployment, not a launch, and no application migrated" (design §6.3 V20-2) |
| Publication of values on a launched offering needs no second launch approval | WP-02 (WP02-A82, §3 D14); WP-13 adds the structural case (B2, B3) |
| Publication and binding are not launch | WP-02 (WP02-A38, A54, §3 D7); observed in A1 |
| Impact preview before publication (classes, counts, the affected list) | WP-02 (WP02-A53, A60 to A62); observed in B2 |
| Launch decision anatomy, named audience, concurrent launch | WP-02 (WP02-A71 to A78) |
| Expansion refused while suspended; lift restores only the approved audience | WP-02 (WP02-A80) and the Core test "lifting restores exactly the approved audience, never wider"; A23 |
| One SuperAdmin suspends an account in an emergency (V21) | WP-02 (WP02-A94, A102); the offering case is A12 |
| Reconciliation after a rule change (an offering suspended while filing is unknown) | WP-11 (WP11-A25, design T6) |
| The travel agent's own withdrawal request; group end | WP-17 |
| A mistaken-price correction published with values (price increase proposals) | WP-17 |
| An assessment opened by a release registration (cause `release`, `support_withdrawn`) | No UI command (engineering registers releases); A33 fixtures render it; Core tests `test/integration/catalogue-impact.test.ts` |
| Gate exceptions do not override launch control | WP-06 (no exception kind exists for launch admission; `exceptionEligible: false`) |
| Delivery, custody and incident work under a suspension or withdrawal | A70 by test; their pages belong to WP-08, WP-12, WP-14 |
| TA-08's submit boundary (base states) | WP-03 (WP03-A125, amended by A63) |
| SA-01 groups (D-18, D-19) | WP-06 build; observed in A03 and §3 B4, E1 |
| OP-02 "Offering hold" rows and OP-01 views (F-36) | WP-07 build; A67, A68 on the case page; A69 (list and count Unmet, L-08) |
| TA-10 transition notice link (AM-W13-04, E-22) | WP-08 build; observed in A43, A66 |
| The bulk pages BU-P02, BU-P06, BU-P07 under an offering boundary | The bulk packages WP-04, WP-05, WP-18 (AM-W13-05, PLAN §8 S-13); A62 covers today's entry by test |

## 5. Out of scope and boundaries

These MUST NOT appear on any WP-13 page:

- A control that relaunches, un-withdraws or un-retires an offering, or restores a discarded draft (no such command;
  BS B07).
- A control that changes the country or the service of an existing application, or moves several applications to new
  terms at once (UX §6.3; transitions are per application; no batch impact decision, D-W13-12).
- A suspension, lift or withdrawal that also changes the audience; an expansion offered while suspended or withdrawn;
  a suspension offered for a withdrawn offering (D-W13-07).
- One control that publishes and launches, or a "second launch approval" asked after a structural update of a launched,
  unsuspended offering (V20).
- A per-application or per-class treatment control; a count of affected applications that no read returns.
- A claim that a suspension always stops submission; "continues as TravelMudra decided"; "paused", "temporarily" or
  "until … again" for a withdrawal; "did not permit" for a withdrawal narrowed later; "Retired" on a travel-agent page;
  a retirement page that claims every catalogue or launch command is refused (L-11).
- "The current terms" as a transition target, or any transition text that implies the reviewed head is the committed
  head (L-02).
- A transition approval offered for an unaffected item, a closed or possibly filed application, a transition-treated
  item or a `filed_historical` item; an impact decision or a transition on an operator or travel-agent page; a decision
  form for a `filed_historical` item (L-06, L-09).
- Accept on TA-07t before Max's decision on P-19 item 1 and before the before/after read is served (L-01); a
  preselected travel-agent decision; a TA-07t form while the application is assigned.
- A binding reference presented as a compatibility statement (L-03).
- A decision form while its required read is unavailable; earlier facts after an access refusal (LD-14).
- A receipt that names an answer, a command, a created, waiting or applied transition, or a result that the
  operation's complete summary signature does not establish; an accepted time; an instruction to act from an older
  state (F-01, F-33; P-02; L-05).
- A truncated field, a dropped evidence row, a silently ignored indexed row or a note-only evidence row sent to Core
  (LD-17; L-10).
- A refusal hidden with its section; a hidden decision value rebuilt from a fresh read.
- "Override", "Relaunch", "Approved" or "Done" as an overall status, "Ready" as a universal state, a wait-list promise,
  an SLA or a date that no read returns.

Recorded as "Unmet" with an owner, not as WP-13 failures (§0.2 "Pass rule"):

- Accept on TA-07t (A47, A48): waits for Max's decision on P-19 item 1 (and STOP-W13-01).
- Binding-only transition proofs as B06 acceptance (A41 to A43; §3 C5, C6): waits for Max's decision on P-19 item 2.
- The exact transition target (A120, A121): waits for the Core guard and recheck of P-19 item 4 (STOP-W13-05).
- The decline dead end and the empty repeat approval (A45, A49): P-19 item 4 (STOP-W13-03, -04).
- OP-01's list and count move of held cases (A69): P-19 item 4 (the pending answer; L-08).

Partly met, deferred or parked:

- A06 (actor, evidence and reason of launch-control decisions, treatments, retirements and item decisions): STOP-W13-07
  (P2), STOP-W13-02 (P-19 item 3).
- A20 (one treatment per cause; no per-application treatment; no count of affected applications): D-W13-12, Q-07, Q-08.
- A33 (applicant and travel-agent names on the items): STOP-W13-02 (P-19 item 3).
- A64 (launch effect per existing action on the TA case): STOP-W13-06 (P-19 item 3).
- A123 (the aggregate counts include `filed_historical` items): a Core count correction (P-19 note); disclosed meanwhile.
- The bulk pages' offering boundary: Deferred to the bulk packages (AM-W13-05, S-13); A62 covers today's entry.
- Command identity and accepted time in receipts (P-02, P-10 b, S-08); the TA decision receipt stays neutral (Q-W13-08).
- One evidence row per form (D-W13-11; the binding note in P-19).

Not in WP-13 (other packages):

- The admission path (country, offering, declaration, approval, binding, values, preview, publication, plan, launch,
  expansion): WP-02.
- The travel agent's application withdrawal request, deferral, price-increase decisions, group end: WP-17.
- Reconciliation pages: WP-07, WP-11. Custody pages: WP-12. Incidents: WP-14. Delivery and notices: WP-08.
- The SA-01 groups (D-18, D-19), OP-02 and OP-01 rows (F-36), the TA-10 link (E-22): their packages build them; WP-13
  observes them.

## 6. Questions for the architect (ranked)

The ranks follow PRI-20260930-01: P0 blocks the main path or risks irreversible harm; P1 goes to Max (through the
architect and the orchestrator) to be parked or worked; P2 is parked as a note. No question was P0. The table keeps the
questions as first written (page names updated to the design); the answers of 13 October 2026 (`WP-13.md` §3, §4.1;
`PROPOSALS.md` P-19) are:

- Q-01 (pending answer ignores launch holds): a defect in P-19 item 4 (failing test first); interim A64, A67; OP-01's
  list and count wait for it (L-08, A69).
- Q-02 (declined transition has no owner): STOP-W13-03, a defect in P-19 item 4; A45 and A49 record it "Unmet".
- Q-03 (empty repeat approval): STOP-W13-04, a defect in P-19 item 4 (refuse); no page offers a repeat (L-06).
- Q-04 (what changed for the travel agent): STOP-W13-01 to Max as a criterion exception in P-19 item 1, with the
  interim Decline and a truthful waiting state and no Accept (L-01); A47, A48.
- Q-05 (TA-03 suspended text): worked in the design (F-W13-04, §2.11 item 3); A58.
- Q-06 (held cases in "Action now"): WP-07 F-36 as amended: "Waiting" with owner SuperAdmin once Core reports the
  hold; Unmet until P-19 item 4 (L-08); A69.
- Q-07 (one treatment per cause): accepted deviation D-W13-12; the register row reads K-STD (L-13); A20.
- Q-08 (affected applications): the decision pages link `views.admin_applications {offeringId}`; no count is claimed;
  a count stays a later Kind 1 request (STOP-W13-02 family); A20.
- Q-09 (launch history facts): STOP-W13-07, P2, parked; A06.
- Q-10 (names on the items): STOP-W13-02, Kind 1 in P-19 item 3 (P1); A33.
- Q-11 (carried items): decision links on every current item whatever the assessment state (Q-W13-04, L-07); the
  aggregate-count limitation for `filed_historical` disclosed (L-09); A39, A123.
- Q-12 (`start_bulk` code): the bulk packages word it (AM-W13-05, S-13); A62.
- Q-13 (one evidence row): D-W13-11; the BFF refuses extra and incomplete rows (L-10); binding note in P-19; A85.
- Q-14 (binding id as compatibility evidence): P-19 item 2 to Max (the orchestrator recommends an offering-specific
  statement for structural changes and the head binding id for non-structural ones); the page states the limitation
  (L-03); binding-only proofs "Unmet" for B06 until he decides; A41.
- Q-15 (host pages): decided as the design (Q-W13-01, CC-18): SA-05j kinds, SA-05x, SA-05n, SA-05t, TA-07t; recheck on
  SA-05b, discard on SA-05c, reviewer on SA-05m; A83.
- Q-16 (proof writes): approved (Q-W13-07).
- Q-17 (neutral TA receipt): accepted (Q-W13-08); joins S-08.
- Q-18, Q-19: STOP-W13-08 (P2 notes); the suspend kind is closed for a withdrawn offering (D-W13-07).

| ID | Rank | Question | Concrete scenario | PM recommendation |
|---|---|---|---|---|
| Q-01 | P1 | Core's pending answer has no launch rule. A case held by a suspension or a withdrawal keeps its ordinary pending answer (owner the assigned operator, next action for example `record_readiness`); the next-action code `record_existing_work_treatment` exists in the vocabulary and is never produced (`derived.ts`; F1 headline 2). | SA1 suspends a busy offering with "Decide later" at 18:00. Thirty assigned applications keep "Next: you, confirm readiness" on OP-01 "Action now"; each operator tries, is refused, and nobody tells SA1 that thirty cases wait on one treatment. Likelihood: certain whenever the treatment is not recorded; harm: medium (stalled work, misleading owner; no data loss). | Interim in the UI: A64 and A67 derive the held step and owner SuperAdmin from the evaluation codes (the TA side from the `assistance` evaluation), and A69 follows Q-06. Then: a Core defect fix to the orchestrator (Core batch): pending rule "held by launch control" with owner SuperAdmin and next action `record_existing_work_treatment` when the treatment is missing, and owner SuperAdmin with the hold reason when it is "hold". It makes A64, A67 and A69 exact. |
| Q-02 | P1 | A travel agent's decline has no owner. After `decline` the item stays `transition`, the application is `affected_pending` (submit, readiness, filing and packet release blocked), no notice is posted, no new transition opens, the assessment can read "Reviewed" with no open item, and the impact index omits it (F2 §7, "Reads"). | Y declines the new terms on S2 because the customer will not supply an itinerary. S2 shows "waits for TravelMudra's decision" for weeks; SA-05l, SA-01 and the SuperAdmin queues show nothing; the operator later assigned to S2 cannot confirm readiness and does not know why. Likelihood: medium for every structural change with renewed authority; harm: medium to high (an application stuck with no owner, against UX §6.1 "Keep each obligation owned"). | Recorded "Unmet" (A49). A Core fix to the orchestrator for Max: a decline reopens the item as "Decision needed" (assessment `review_required`, counted in `open_items`) with the accountable reviewer as owner, and posts that SuperAdmin a notice. Until then SA-05m states the rule for every "Moving" item (A45) and the travel agent's page names TravelMudra as owner. |
| Q-03 | P1 | A second `cat.approve_transition` after a decline or an immediate apply is accepted, opens no transition and returns the earlier transition id; after a decline the application stays blocked (F2 §3 "Business duplicate"). | SA1 sees S2 still blocked, opens the transition page by its address and approves again. The receipt says "accepted"; nothing reaches Y; S2 stays blocked. Likelihood: low to medium (the page offers no second approval, A45); harm: medium (a false acceptance). | Core defect fix to the orchestrator: refuse a second approval of an item that already has a transition (`transition_already_decided`, with the current state). Until then no page offers it and the receipt of such a send is neutral (A45, A72). |
| Q-04 | P1 | The travel agent cannot see what changed. `core.ta_application.transition` is `{transition_id}` only; no read gives the travel agent the before and after terms, yet Core asks for renewed authority because authority-bearing terms (documents, eligibility, controls, price, outcomes) changed. | Y is asked to "move to the current terms" of S1. TA-03 shows today's terms, which may already differ from the approved target; Y accepts without knowing that an extra document is now required, and the customer is surprised later. Likelihood: certain for every authority transition; harm: medium (authority given without the facts; B17). | A47 partly met with the honest interim text and the TA-03 link. A Kind 1 projection: the authority-bearing items that differ, in the travel agent's words, on the TA read while a transition waits. Criterion point 1 holds (Core computes the difference at approval). Point 2 (it removes a client-side join, computation or round trips) does not hold: no read exists to compose, so like P-05 and P-18 item 2 it needs Max's exception; route it with P-05 (the same TA display family). |
| Q-05 | P2 | TA-03's suspended text "Work you already started continues as TravelMudra decided." (WP-02 page) claims a decision that may not exist: with "Decide later" or "Hold" the work is held. | Y tells a customer that their submitted application continues while the operator's work is held. Likelihood: high during any suspension; harm: low to medium. | A58 changes the sentence (draft copy). The architect records it as an amendment of WP02-A24's copy owned by WP-13. |
| Q-06 | P1 | OP-01 places a held case by Core's pending owner, which is the operator (Q-01), so the row counts in "Action now" although the operator cannot act (F-07 class). | OP1 has twelve applications of a suspended offering in "Action now"; the count hides the two cases OP1 can work. Likelihood: certain during a suspension without treatment; harm: low to medium (attention). | A WP-07 mapping amendment (F-07, F-16, F-30 class): a row whose pending step's evaluation carries a launch hold or an impact block sits in "Waiting", owner label "Waiting on SuperAdmin: change of this service", not counted. If the list read carries no evaluation, the amendment waits for Q-01's Core fix and A69 records the gap. |
| Q-07 | P2 | Core records one treatment per suspension or withdrawal, applied to every existing-work action of the offering; PL §7 calls the command K-BATCH "per application" and UX §6.3 says "explicit per applicable action". | A SuperAdmin wants paid applications to continue and unpaid ones to hold; the page offers only one choice for all. Likelihood: low; harm: low. | Accept as a recorded deviation: BS B07 is met by one recorded treatment, and the effects table shows the effect per action (A02, A20). No proposal. |
| Q-08 | P1 | No read lists or counts the applications that a suspension or withdrawal holds, before or after the decision (UX §6.1 "affected-case impact"; §6.3 "suspension/withdrawal treatment"). | SA1 suspends with "Decide later" during an incident, unaware that forty submitted cases, three with a travel date next week, stop at readiness. Likelihood: medium; harm: medium (travel-date risk, no notice). | A Kind 1 projection on `ops.launch_offering`: open applications of the offering by lifecycle and by the effect the current treatment gives them (counts, and the first rows with their references). The architect first checks whether a SuperAdmin application list can filter by offering: if it can, point 2 holds (it removes N per-application evaluations); otherwise it needs Max's exception. A20 stays partly met until served. |
| Q-09 | P2 | The launch read does not return who suspended, lifted, withdrew or recorded a treatment, nor the lift, withdrawal and treatment evidence and reasons; the catalogue reads do not return who retired an offering or decided an item, or why (F1, F2). The audit holds them (B33). | SA2 asks why O was withdrawn and by whom; SA-05h cannot say. Likelihood: medium; harm: low (the audit answers). | WP-11 I-10 interim (A06). Kind 1 note, parked (P2); criterion point 2 not demonstrated for a single page. |
| Q-10 | P2 | `cat.admin_assessment` items carry application ids only, no applicant or travel-agent names. | SA1 holds the wrong one of thirty references. Likelihood: medium at volume; harm: low (a re-decision undoes it). | A33 links each reference to the case page. Kind 1 note (names on the item rows): point 2 holds (it removes one case read per row); parked as P2 until volumes grow. |
| Q-11 | P2 | A decided item carried forward stays on its superseded assessment; the impact index omits that assessment, but SA-05a's open-items count includes a carried hold (F2 "Other findings"). | A held application from an older change is counted on SA-05a and cannot be found from SA-05l. Likelihood: low; harm: low. | A39's interim. Core note to the orchestrator (count and index should agree), parked. |
| Q-12 | P2 | `intake.start_bulk` answers `offering_not_launched` for a suspended offering (F1). | A travel agent reads "not launched" for a service it used yesterday. Likelihood: medium in bulk; harm: low. | A62 shows the catalogue reason. Note to the orchestrator for the bulk lane (intake owner), parked. |
| Q-13 | P2 | The catalogue-admin binding reads one evidence row per list; Core accepts up to 20. | A suspension during an incident has an incident reference and an attestation; the page takes one. Likelihood: medium; harm: low. | One row per list now (A85, no silent drop). A binding change (indexed rows, as the operations bindings read) to the orchestrator, parked. |
| Q-14 | P1 | Evidence for a transition: Core accepts the head binding id (or a release supporting it) as "engineering compatibility evidence" when the release supplied no statement for the offering. B06 asks for "engineering compatibility evidence" for a per-application structural transition. The binding proves that the release supports the new structure for new cases; it states nothing about moving an existing case. Two readings. | SA1 moves forty submitted applications to version 2 citing the binding; their earlier documents do not meet a check that version 2 changed; the operators find out at readiness. Likelihood: low today (synthetic; one release); harm: medium. | The page labels the evidence truthfully ("The release's binding for the current terms. The release recorded no statement about existing applications.") and never calls it a compatibility statement (A41). Max decides through the orchestrator whether a transition without a release statement is allowed (a specification reading; prompt stop condition), or whether Core should require a statement. |
| Q-15 | P2 | Host pages and paths: SA-05j gains kinds `suspend`, `suspension_treatment`, `lift`, `withdraw`, `withdrawal_treatment`; one decision page per item (SA-05n) or a batch page (Core takes up to 200 items, the binding one); the recheck on SA-05m or SA-05b; SA-05t; SA-05x; SA-05c; TA-07t. | The design puts the recheck on two pages, or keeps the transition form on the assessment list. Likelihood: low. | One host page per command (CC-12 to CC-16): the kinds on SA-05j; SA-05n per item (the binding sends one item); recheck on SA-05m; SA-05t, SA-05x, SA-05c and TA-07t as new GET pages beside the kept POST paths. The architect records it in the register. |
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
| Unmet items in force at the run (P-19 items 1, 2 and 4: Accept; binding-only proofs; the exact target; the decline and the repeat approval; OP-01's list and count) | |
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
| WP13-A120 | | | |
| WP13-A121 | | | |
| WP13-A122 | | | |
| WP13-A123 | | | |
| V20 proof | | | |
| BU-27 proof | | | |
