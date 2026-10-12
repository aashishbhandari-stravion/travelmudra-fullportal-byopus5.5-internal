# WP-10 acceptance checklist: Service shapes and dependency

| Field | Value |
|---|---|
| Lane | `ui-revamp-2026-10-12` |
| Work package | WP-10 Service shapes and dependency (UI-PLAN §12.2; lane PLAN §3) |
| Author | Principal Product Manager (Claude subagent), 13 October 2026 |
| Decision owner | Principal Technical Architect of the lane (LD-12) |
| Status | Aligned on 13 October 2026 with `WP-10-design.md`, `WP-10.md` §3 and amendments H-01 to H-14 (corrections below). Not run. Where the design names a path or a word differently, the design governs the name and this checklist keeps the observable result. |
| Product base | lane branch `ui-revamp-2026-10-12` at e9e96e3; internal records at a0baed1 |
| Installation | `lane-ui`: staff http://127.0.0.1:4652 (operator pages under test; SuperAdmin pages as set-up and observation); edge http://127.0.0.1:4650 (travel-agent pages under test and proof set-up) |
| Writing style | ASD-STE100 at about 75% (STY-20261003-01) |

## Corrections of 13 October 2026

The UX design (`WP-10-design.md`), the architect's decisions (`WP-10.md` §3) and the independent design review (lane
`research/reviews/WP-10-design-review.md`, R-01 to R-14, with amendments H-01 to H-14 in `WP-10.md` §4.1, which bind)
changed the rows below. The WP-07 amendments F-16 to F-21 (`WP-07.md` §4.3) and the WP-08 amendments E-13 to E-15
(`WP-08.md` §4.2) apply too. No other row changed. Section 6 is kept as asked, with the architect's answers above its
table.

| Row | Finding or decision | Change |
|---|---|---|
| §0.2 "Paths", §1.1, §1.2, §1.3, the headings of §2.3 to §2.6, A01, A05, A16 to A18, A21 to A25, A27 to A29, A31, A34, A35, A37 to A42, A45, A46, A53, A63 to A66, A68, A70, §3 | Q-W10-01 (CC-14); R-09, H-09 | One host page per command: OP-04p (build, rebuild), OP-04r (release), OP-06h (handover), OP-06e (direct external), TA-07l (link, unlink). The former hosts (TA-07, the operator case page and OP-02 External actions, OP-06, the case-work page) carry no moved form; A65 asserts it with the host-page test. |
| A80 to A98 | R-09, H-09 | axe targets moved to the five host pages (TA-07l 5, OP-04p 5, OP-04r 4, OP-06h 3, OP-06e 2). |
| A60 | R-05, H-05; WP-07 F-04 | A documents-read outage on OP-04r shows the incomplete-review notice and no release form; access refusals are tested separately. |
| §0.2 "Service shape words", A08, A09, A12, A13, A15 | R-06, H-06; design §2.11.2, §2.12 | Expectations follow the live packet read ("Not built", "Being built", "Built", "Released to the travel agent") and the qualified receipt line; "Build failed" and "Replaced" are deferred until STOP-W10-03 is served. |
| A20, A57 | R-07, H-07 | A raw envelope is re-evaluated against its own revisions (A57 (5a)); a corrected submission from a freshly loaded page carries current revisions (A57 (5b)); the packet-material guard is isolated after fresh readiness (A20 (3)). |
| Lessons, A04, §5, §3 split | R-08, H-08; WP-07 F-20, F-21; WP-08 E-13 | The provider files; TravelMudra learns of it through the provider's result (OP-05); no page names a provider-filing record. The separate capability is "Unmet: waits for Max's decision on P-15 item 2". |
| §1.4, A37, A100 (new), §3 split, §5 | R-01, H-01 (P0 for release); Q-W10-04, Q-W10-11 | The V12 dependency clause reads "Not met: waits for Max's decision on P-15 item 1". The "Not linked" lines on TA-07, TA-07l and the TA-08 review are tested as a warning, not as enforcement. |
| Lessons, A40, A41, A101 (new) | R-02, H-02; Q-W10-06 | No exact-parity claim for link and unlink: the page never hides a served action where its facts allow it; each listed discrepancy shows the form and re-renders Core's reason. Unlink has no lifecycle guard in the command, so the page adds none. |
| A07, A11 | R-03, H-03 | The build offer also requires current mandatory-document satisfaction; when the evaluation or the evidence read is unavailable, the form shows and Core decides; the test drives the actual renderer against the command's refusal. |
| Lessons, A26, A27, A34 | R-04, H-04 = LD-17 | Every field is read whole and every indexed evidence row is read; over-limit input is refused at the field with the values kept; BFF tests. |
| Lessons, A31, A32 | R-10, H-10 | OP-06e predicts neither an unmet delivery nor an open case; it shows Core's current requirement, lifecycle and owner. |
| A15, A23, §0.3, §3 | R-12, H-12 | The dependent is assigned only after its submission (Setup-2, before V12-D6); after a reassignment the new operator starts work before the build. |
| A34, §5 | R-14, H-14 | No `instant_in_future` refusal is expected; a future event date is recorded as typed. |
| A20, §5 | R-11, H-11 | A released packet whose document became unavailable before the handover: boundary notice with owner "product owner"; downloads stay denied; no substitution; recovery "Unmet: waits for Max's decision on P-15 item 3". |
| A06, A30, A62 | R-13, H-13; `WP-10.md` §3 (test names) | The sweep checks claims that a handoff authorization or its evidence proves a filing; the mode label "Filed by a declared provider" and the F-20 sentence are allowed. Test files `service-shapes-sweep.test.ts` and `packet-dependency-host-pages.test.ts`. |
| §0.2 "Delivery words", "Dependency words"; A02, A03, A10, A14, A17, A19, A33, A38, A43, A47, A48, A54, A67, A71, A75, A76 | Design §2.1, §2.9, §2.11 to §2.14, §5; WP-07 F-17, F-18; WP-08 E-15 | The design's closed words, receipt titles and refusal sentences; TA-07r preparation-only states and the direct-external row "This record names no file held by TravelMudra" (E-15); no Originals section for preparation-only; radios with no preselection. |
| A49 | Q-W10-03; WP-07 F-16 | A dependency wait sits in "Waiting", owner label "Waiting on a related application", and is not counted. |
| A52 | Q-W10-07 | SA-02e is built in WP-10 U6 only if WP-06's SA-02 is integrated; otherwise parked (P2). |
| A07 | WP-07 F-17 (row 6a); §6 Q-11 | OP-02's action panel names "Build the packet before you confirm readiness" with the route to OP-04p. |

## Lessons applied from the WP-01 to WP-09 corrections

| Lesson | Source | Where this checklist applies it |
|---|---|---|
| Identical replay, changed-content conflict, browser Back, rejected-form refresh and lost acknowledgement are five separate cases; a business duplicate with a new key and a raw stale envelope are two more | WP-01 A-02, A-03, A-06; WP-03 R-12; WP-06 D-12 | §0.2 "Replay terms"; one "Nth time" item per command (A13, A22, A29, A35, A45); the matrix A57 |
| A refused command leaves no operation record; the refusal shows only on the re-rendered form | WP-01 A-08; WP06-A104 | §0.2; A56; every refusal item says "nothing is recorded" and checks it by delta |
| A receipt names the command only when the operation's resource, returned id and summary (or a read by the returned id) establish it; otherwise a neutral "Request recorded" with facts labelled "Current"; no accepted time | WP-01 A-04, P-02; WP-06 D-02; WP-09 G-01 | §0.2 "Receipts"; A54 (per-command rule); A40 and A32 (shapes shared with another command) |
| No receipt or status read tells anyone to act; a historical receipt keeps the historical fact and shows current facts as "Current" | WP-07 F-01 (P0 class fix); WP-09 G-10 | A55 |
| Act-kind-specific words: a provider handoff establishes handoff only; the provider files, and TravelMudra learns of the filing through the provider's result; no page names a provider-filing record | WP-07 F-06, F-20; WP-10 H-08, H-13 | A04, A06; Q-02 |
| Delivery wording by channel; completion rows show only Core's flags; missing duties are qualified | WP-08 E-05, E-06 | A30, A32, A36 |
| Bans are scoped by fact and channel ("Delivered" only for a recorded direct external delivery; a download reads "Sent in full") | WP-08 E-12 | §0.2 "Delivery words"; A30 |
| Freshness: "Read at [time] IST" for an authoritative read; the lag form for a projection | LD-08 | §0.2; A49 (OP-01), A67 (history) |
| A page shows only facts that a read returns; a missing fact is "Unavailable" or the item is "partly met"; gaps are deferred, not failures | WP-02 B-06; WP-03 R-11; WP-06 D-04, D-05 | §0.2 "Facts"; §5 "Deferred"; A16, A37, A43; Q-01, Q-05 |
| A state is labelled for the action it was evaluated for | WP-06 D-05 | A07 (the readiness evaluation's blocker under Core's next action), A17 |
| A request that Core refuses is shown as Core answers it; the page does not change the input to force acceptance | WP-06 D-09 | A10, A21, A27, A38 |
| Form rows within Core's limits only; every filled row reaches Core; no handler truncates a field or drops an indexed row; over-limit input is refused at the field with the values kept | WP-06 D-10; WP-08 E-04; WP-09 G-07; WP-10 H-04 = LD-17 | A26, A27, A34 |
| A page MUST NOT block a command that Core accepts, and MUST NOT offer one that Core refuses; where the refusing fact is not on the page's read, the form shows and Core's reason is re-rendered, with no exact-parity claim | WP-07 D-W07-16; WP-03 F-W03-11; WP-09 A06; WP-10 H-02, H-03 | A11, A40, A101; Q-04, Q-06, Q-13 |
| No semantic duplicate guard is claimed where Core has none; existing records show before the form | WP-08 Q-W08-15; WP-09 G-03 | A28, A31, A34; Q-09 |
| On GET assert the blocker and the absence of the form; a command refusal of a removed form is tested with a saved envelope | WP-09 G-05 | A17, A42, A48 |
| Reassignment races are covered: the previous operator is refused by access; the new operator acts on Core's facts | WP-09 G-09 | A15, A23 |
| Proofs rerun with a run tag and a fresh synthetic travel agent; checks compare with a recorded baseline (deltas) | WP-02 B-13; WP-07 PM Q-07 | §0.4; §3 step P-0 |
| Set-up writes through existing pages are allowed and are labelled "Setup"; they are not the subject under test | WP-03; WP-06 Q-W06-10 | §0.4; §3 |
| Real refusal shapes from the code; a business refusal is asserted from the current page's facts | WP-06 D-11, D-12; WP-07 F-09 to F-12 | §0.5; every harness step sends from a freshly read page unless the step says "raw" |
| Optional reads never hide an access change | LD-14 | A60 |
| Forms of later packages stay reachable on rebuilt pages; every rendered form action is a registered route; carried test entries are removed when the owner package rebuilds them | WP-03 Q-01; WP06-A110; WP-08 design §7.2 | A65 |
| Copy states no configuration number that the page does not read | WP-01 Q-13 | A62 |
| A boundary of a decided policy never says that an owner still has to decide | LD-04, LD-05; DECISIONS §1.5 | A16 (no B46 notice on the packet release) |
| Kind 1 notes record whether criterion point 2 is demonstrated; no proposal is raised without it | WP-09 G-11 | §6 Q-05, Q-06, Q-08 |
| An outage of the evidence that a consequential review needs removes the form with an incomplete-review notice; access refusals are a separate test | WP-07 F-04; WP-10 H-05 | A60 |
| Expectations name only states that a read returns; the states of records that are not live wait for their read | WP-10 H-06 | A08, A09, A12, A15 |
| A raw refused envelope is re-evaluated against its own revisions; a corrected submission carries current revisions; a guard is isolated only after the earlier guards pass | WP-10 H-07 | A20 (3), A57 (5a), (5b) |
| UI acceptance is separate from Core enforcement: a warning is never claimed as enforcement, and an owner decision pending with Max is recorded as "Not met" or "Unmet", not as a failure | WP-10 H-01, H-08, H-11 | §1.4, A04, A20 (4), A100 |
| A page predicts no Core outcome (an unmet requirement, an open case); it shows Core's current facts | WP-10 H-10; WP-08 E-05 | A31, A32 |

## 0. Inputs and conventions

### 0.1 Inputs

| Ref | Source | Identity | Sections used |
|---|---|---|---|
| UX | `TARGET_PRODUCT_UX_SPEC.md` (2026-10-05) | SHA-256 b45186887cdc37f6… | §2.1, §2.2, §2.3, §3.1 steps 6 to 8, §3.2 (Preparation-only, Third-party filed, Dependency), §3.3, §4.2, §5.1, §5.3, §7.4, §7.5, §8.3, §12 V12 |
| BS | `BUILD_SPEC.md` (r2) | SHA-256 4a6fd90657b0723f… | B04, B12, B21, B22, B24, B30, B31, B33, B35, B46 |
| DE | `../ui-plan-from-specs-2026-10-10/DECISIONS-2026-10-10.md` | SHA-256 a2c935f72cd4f5e9… | §1.5 (OC-09 closed: Release packet and Record packet handover are available actions) |
| PL | `../ui-plan-from-specs-2026-10-10/UI-PLAN.md` | SHA-256 75256bfd7e6d929a… | §3.2 TA-07, §3.3 OP-02 OP-04 OP-05 OP-06, §4.2 (Preparation-only, Third-party filed, Dependency), §5.3 (OP-04 table), §6, §7 (rows Release packet / Record packet handover, Record provider handoff / filing evidence), §8, §10, §11, §12.2 WP-10, §13 (OC-09, B-06) |
| CC | `COMMAND-COVERAGE.md` (this folder) | SHA-256 b882aa55386a69fd… | §3 rows of the six WP-10 commands; §5.1 WP-10; §5.3 (`core.link_dependency`, `core.unlink_dependency`); §5.4 (operator case page → OP-04); §6 CC-06 |
| LP | `PLAN.md` (this folder) | internal a0baed1 | §3, §4 (LD-02, LD-03, LD-05, LD-07, LD-08, LD-11, LD-12, LD-14, LD-17), §6 (Q-L2), §7 (#4, #23), §8 (S-08), §9 |
| PR | `PROPOSALS.md` (internal a0baed1) | as committed | P-05 (widened scope "dependencies" pending Max), P-09, P-10 b, P-13, P-15 (items 1 to 3) |
| W3 | `WP-03-design.md`; `WP-03-acceptance.md` | SHA-256 d4d40cb1d18a7bc2…; 13ad0770af3f6c42… | design §1.5 (link and unlink carried to WP-10; unlink has no host), §2.7 item 11, §3.4, STOP-W03-03 (no service mode on the TA read); acceptance §1.2, A106 |
| W6 | `WP-06-design.md`; `WP-06-acceptance.md` | SHA-256 327f580c1820bf40…; 7a1d82e48fde6e93… | design §2.2.5 and acceptance §5 ("Dependency waits" view goes to WP-10); WP06-A64, A109 |
| W7 | `WP-07.md`; `WP-07-design.md`; `WP-07-acceptance.md` | SHA-256 5064e0c66680b9e8…; 4c877b4be85dc5e7…; 647c7b1d6af0887c… | §3, §4.1 F-01, F-04, F-06, §4.2 F-13, F-14, §4.3 F-16 to F-21; design §1.5 (carried packet forms), §2.4.2 (declared prerequisites row), §2.5.2 (External actions tab), §2.7, §2.8; WP07-A14, A18, A26, A37, A50, A72, A101, A117, A164, A167; Q-14 |
| W8 | `WP-08.md`; `WP-08-design.md`; `WP-08-acceptance.md` | SHA-256 076ac1b04d9119dc…; 7a74a46cc1480906…; 4d6504be7f20ebe7… | E-05, E-06, E-12, §4.2 E-13 to E-15; design §1.5, §2.1 (preparation-only state), §2.3 item 6, §2.5 (TA-07r states), §2.11 (Handover row), §2.12, §7.2; WP08-A02, A03, A35, A47, A51, A72, A115, A117, A118; §0.2 "Delivery and file words" |
| W9 | `WP-09.md`; `WP-09-acceptance.md` | SHA-256 97074922067b5db7…; 5118a3ab3e083939… | §4.1 G-01, G-03, G-05, G-07, G-09, G-10, G-11; format, §0.2, §0.5 |
| W10 | `WP-10-design.md`; `WP-10.md`; lane `research/reviews/WP-10-design-review.md` | SHA-256 2f1f8414a97b8aa6…; 8915f4fe82061cba…; 6de5da00f1bd2fc0… | design §1.3 to §1.6, §2.0 to §2.14, §3, §4, §6, §7.2, §9; record §3 (Q-W10-01 to Q-W10-11), §4.1 (H-01 to H-14); review R-01 to R-14 |
| CAT | `catalogue/synthetic/catalogue.json` | SHA-256 f309f108fa9c923a… at e9e96e3 | The synthetic offerings of §0.3 |
| Code | lane repository | e9e96e3 | `src/modules/operations/case-work/commands/work.ts` (`ops.request_packet_build`); `src/modules/delivery/packets.ts`, `tasks/build-packet.ts`, `handover-step.ts`, `release.ts`, `pages.ts`, `commands/handover.ts`; `src/modules/core/commands/acts.ts` (`core.release_packet`), `drafts.ts` (link, unlink), `controls.ts`, `derived.ts`, `writers.ts`, `staff-views.ts`; `src/core-api/bindings/core.ts`, `operations-work.ts`, `delivery.ts`; `src/contracts/core.ts`, `delivery.ts`, `operations-work.ts`, `views-cases.ts`; `src/kernel/vocabulary/decl.ts`, `service.ts`, `delivery.ts`, `subjects.ts`; `src/kernel/guard-constraints.ts`; `migrations/0300_core.sql`, `0800_delivery.sql`; `src/modules/views/case-projectors.ts`; `src/apps/shared/core/ta.ts`, `shared.ts`; `src/apps/staff/core/ops.ts`, `case.ts`; `src/apps/staff/operations/case-work.ts`; `src/apps/shared/delivery/pages.ts`; `src/web/route-inventory.ts`; the tests named per item; `test/fixtures/documents/samples.ts` |

Verified facts of the code at e9e96e3 that the items rely on (read by the author; the design review checks the rest):

- Service modes are three: `travelmudra_filed`, `preparation_only`, `third_party_filed` (`service.ts:4`). "Direct
  external" is a delivery-evidence kind, not a mode (`DELIVERY_EVIDENCE_KINDS`: `tm_held_electronic`,
  `direct_external`, `packet`, `none`). A preparation-only declaration has no external act, no physical custody, no held
  original, no artifact type, a promise `validated_packet` with `claimsGovernmentResult: false`, and a declared handover
  evidence (`ta_retrieval_of_released_packet` or `recorded_physical_handover_to_ta`). A third-party declaration has
  exactly one external act, `provider_handoff`. `prepared_and_handed_over` is an outcome of preparation-only only;
  `issued`, `refused` and `external_outcome_unresolved` are never preparation-only outcomes (`decl.ts:281-389`).
- `ops.request_packet_build` (assigned operator; route `ops.case_work.packet_build`): input `applicationId`, optional
  `supersedePacketId`; the binding adds the page's application revision when the form carries it. Order of checks:
  assigned operator (`not_found_or_forbidden`), revision (`stale_revision`), mode (`service_mode_not_applicable`), the
  controls of `start_operator_work`, editor state `assigned` (else `hold_returned_to_ta` or
  `hold_assistance_in_progress`), work started on the assignment (`operator_work_not_started`), every mandatory
  requirement satisfied (`mandatory_document_missing` with one blocker per requirement). The packet holds exactly the
  satisfied versions of the **mandatory** requirements; optional documents are not in it. A live packet (building,
  built or released) refuses a second one (`packet_exists`) unless the request supersedes the built packet; a released
  or handed-over packet is never superseded (`packet_released`, `packet_handed_over`). Result: application, `packetId`,
  `stepId`. The build is a task: `building` → `built`, or `build_failed` with `evidence_changed`, `too_large`,
  `assignment_changed` or `bytes_unavailable`. A build failure leaves no live packet, so a new build needs no
  supersede. No read returns the failure code or the packet's file list.
- `core.release_packet` (assigned operator; route `ops.applications.release_packet`): inputs `packetId` and the
  application, hold and material revisions of the page (`stale_revision`). The controls of `release_packet` run
  stages 3 to 7 and 10 to 12: mode, submitted, no outcome, no accepted withdrawal, no approved deferral, work started,
  not released before (`packet_released`), holds (`hold_returned_to_ta`, `hold_problem_reported`,
  `hold_flagged_to_superadmin`, `hold_assistance_in_progress`), every mandatory document per requirement (document
  codes with the requirement type as `ref`), population, travel-date rules, dependency prerequisites that condition
  `release_packet`, renewed authority, `packet_not_built`, `packet_stale` (the evidence fingerprint changed since the
  build), catalogue impact, travel-date recheck, readiness gate (`readiness_missing`, `readiness_stale`,
  `readiness_held`; `readiness_previous_operator` is exception-eligible). Then the posted packet must be the current
  built packet (`stale_revision` / `packet_stale`), and the delivery module checks the fingerprint and the material
  revision again (`control_blocked` / `packet_stale`). Result: application and `packetReleaseId`; no per-file result.
  It posts a TA notice `generic_case_update` with `{kind: packet_available}`, with no acknowledgement. Each later
  download checks every constituent again (`packet_constituent_unavailable`, `release.ts:206-216`).
- After the release Core's pending answer is owner the assigned operator, reason `packet_released`, next action
  `record_delivery`. Before readiness on a preparation-only case with work started, Core's next action is
  `record_readiness`, although readiness is refused until the packet is built (`packet_not_built`, Q-11).
- `dlv.record_handover` (assigned operator): `kind` `packet` or `physical`; `packetId` exactly for a packet;
  `documentVersionIds` 0 to 20 of the group; `recipientKind` `owning_ta_account` or `ta_representative_in_person`;
  `recipientDetail` up to 254; evidence 1 to 5 references (a note never carries an address or a link); optional
  `eventAt` with no upper bound. No revision. A packet handover needs the packet of this application, released
  (`packet_not_released`), not handed over before (`handover_exists`), a declared handover standard
  (`declaration_item_unresolved`), and, for the standard `ta_retrieval_of_released_packet`, a streamed release of that
  packet to the owning travel agent (`handover_evidence_missing`). It is system-verified only then. When the standard
  is met, no outcome exists, the case is submitted and the service is preparation-only, Core records the outcome
  `prepared_and_handed_over` in the same transaction. A physical handover has no state check and no duplicate guard.
  Result: `handoverId`, `systemVerified`, `outcomeRecorded`.
- `dlv.record_direct_external` (assigned operator): `externalReference` 1 to 200, `recipientDetail` up to 254, evidence
  1 to 5, optional `eventAt`. No revision, no mode, outcome, declaration or duplicate check. It records
  `tm_held_result: false`, `system_verified: false` and releases no byte. Result: `handoverId` only, the same shape as
  `dlv.record_manual_email`.
- Completion (`derived.ts` `completionEvidence`): the `delivery` prerequisite follows the declared delivery evidence of
  the recorded outcome: `packet` and `direct_external` each need a handover record of that kind; `tm_held_electronic`
  needs an accepted document email and a `result_available` notice; a download alone never meets it.
- `core.link_dependency` (travel agent, own application; route `ta.applications.link_dependency`): `relationshipCode`,
  `upstreamApplicationId`, the page's application revision. The travel agent must also read the upstream
  (`not_found_or_forbidden`). Refusals: self or a closed cycle (`dependency_cycle`), revision (`stale_revision`), not
  open (`application_not_open`), editor state (`awaiting_formal_return`, `hold_assistance_in_progress`), a relation
  that the governing declaration does not declare, another group or travel agent, another upstream service or another
  applicant (`dependency_undeclared`), a preparation-only upstream for a relation that needs `issued` or `refused`
  (`unavailable_parked` / `parked_preparation_dependency_evidence`), an upstream already ended with an outcome that the
  relation cannot use (`dependency_upstream_final_incompatible`), a second open link of the same relation
  (`conflict_duplicate` / `duplicate_open_scope`, unique index). Effect: a `waiting` dependency, the application and
  material revisions move (a readiness judgement on the old basis becomes out of date). Result: application and
  `dependencyId`.
- `core.unlink_dependency`: `dependencyId` of this application (`not_found_or_forbidden`), revision, editor state,
  already unlinked (`stale_revision`), and only while every act is confirmed unfiled (`filing_possibly_occurred`).
  Result: application and `dependencyId`, the same shape as a link.
- A dependency is met only when the upstream outcome equals the required outcome and, where the relation names an
  artifact type, an eligible artifact of exactly that type exists (`prerequisiteState`). Missing evidence is a wait
  (`unmet_missing_evidence`), not a failure. An incompatible final upstream outcome ends a confirmed-unfiled dependent
  as `dependency_failed`; a dependent that may have filed keeps its protection and gets an owned follow-up. Only a
  linked dependency conditions an action: a declared relation that the travel agent never links blocks nothing (Q-03).
- Reads. Staff case: `packet {packetId, state}`, `releaseOffer` (the evaluation of `release_packet` for the assigned
  operator), `dependencies {relationship_code, required_outcome, required_artifact_type, state}` with **no upstream
  id** and **no declared relation that is not linked**. `ops.case_work` offers `buildPacket` = the evaluation of
  `start_operator_work` (or `operator_work_not_started`), not the build command's own guards (Q-04).
  `dlv.delivery_page` (staff): packet with size and build time, `handovers {handoverId, kind, systemVerified,
  tmHeldResult, eventAt, recordedAt}` (at most 100), retrievals, and `offers.recordHandover` (`packet_not_released`,
  `handover_exists`, `handover_evidence_missing` or allowed); `offers.recordDirectExternal` is always allowed.
  TA case: `relations` (codes only), `dependencies {dependency_id, relationship_code, upstream_application_id,
  state}`, `siblings {id, label, outcome, linkable}` where `linkable` is true when **any** relation fits; no service
  mode, no required outcome or artifact type, no act facts (Q-01, Q-06, Q-13). `core.admin_queue` kinds are
  `assistance`, `flags`, `deferrals` only (Q-08).
- TA history (`views.ta_history`, projection): lines `handover_recorded` (kind; `system_verified` or `attributed`),
  `direct_external_recorded`, `outcome_recorded`, `notice_posted`; no line for a packet build, a packet release, a
  link or an unlink.
- Today's pages: the build form on the case-work page has no "Build again" (no supersede input); the release form on
  the old operator case page (`ops.ts:260-268`); the handover, manual-email and direct-external forms on OP-06
  (`delivery/pages.ts:492-552`) offer all eight evidence kinds and one evidence row; the link form on TA-07
  (`ta.ts:483-490`); no unlink form exists; relation names are the declared codes made readable.
- The live packet read (`readLivePacket`, `delivery/store.ts:219-224`) returns only a `building`, `built` or `released`
  packet. A packet whose build failed, or that a rebuild replaced, is on no read (H-06; STOP-W10-03).
- Today's delivery handlers (`src/apps/staff/delivery/routes.ts`) cut `recipientDetail` at 254 characters and
  `externalReference` at 200, and read only `evidence.0`. WP-10 U3 repairs both handlers (H-04 = LD-17).

### 0.2 Conventions

- **Personas.** Travel agent: Y, `wp10-ta-[stamp]`, a fresh synthetic travel agent per run (created and activated on
  SA-06 at set-up); `syn-ta-2` for isolation only. Operators: `operator-1` (OP1: Q, H, E), `operator-2` (OP2: T;
  isolation on Q), `operator-3` (holds a group read grant of the run's group; read-only checks). SuperAdmins:
  `superadmin-1` (SA1, set-up) and `superadmin-2` (SA2, observation). They stand for `syn-operator-1` to `-3` and
  `syn-superadmin-1`, `-2`. Keyboard-only user. Screen-reader user. Phone user (390 px wide). No step suspends a
  seeded account.
- **Where.** `L`: a person or the LD-11 harness shows it on `lane-ui`. `T`: an automated test in the lane repository
  shows it at the same commit; the run record names the test. `L+T`: both are required. A test that the item says
  WP-10 adds is named in the run record with its file and title.
- **Sign-in codes (rule C).** As WP-01 §0.2. The LD-11 harness signs in. Nobody prints, logs, screenshots or stores a
  code or an authenticator key.
- **Copy.** Quoted text is draft copy (CR-09). Draft copy passes when the page states the same facts. The §11.3
  boundary form is mandatory for an unavailable action: "[Action] is unavailable until [policy or evidence] is
  [approved / recorded]. Owner: [owner or 'not yet named']." Core's reasons show in words; a code shows only as the
  UAT-13 fallback (A59).
- **Service shape words.** Design §2.11.1 and §2.11.2 govern. Staff kind words "Filed by TravelMudra", "Filed by a
  declared provider", "Preparation only". A provider handoff is "handoff" or "handed over"; no text claims that a
  handoff authorization or its evidence proves a filing (F-06, H-13); after the handoff evidence the provider files and
  TravelMudra learns of it through the provider's result (F-20). Packet words come from the live read only (H-06):
  `null` "Not built", `building` "Being built", `built` "Built [time] IST, [size]" or "Built", `released` "Released to
  the travel agent"; "Build failed" and "Replaced" are on no read (deferred, STOP-W10-03). `prepared_and_handed_over`
  "Prepared and handed over" with "No government result is claimed." (staff) or "TravelMudra claims no government
  result for this application." (TA, E-15).
- **Delivery words.** WP-08 design §2.11 governs with E-06, E-12 and E-15, and the handover words of WP-10 design
  §2.11.2: a packet handover "Recorded [time] IST: system-verified. Whether the travel agent's browser kept the file
  cannot be known." or "Recorded [time] IST: attributed record, not system-verified"; a physical handover "Physical
  handover recorded [time] IST: attributed record"; a direct external record (staff) "Delivered directly by an external
  party: attributed record; no file held by TravelMudra is claimed", (TA) "Delivered directly by an external party.
  This record names no file held by TravelMudra."; "Delivered" appears only there; a download reads "Sent in full";
  "Received" is never used for a delivery fact; no "through Send result" for a packet or a direct external delivery.
- **Dependency words.** Design §2.11.3 governs. Staff requirement sentence: "[relation words]: needs the related
  application's outcome [label][, with its [type words] document verified for that application]". Staff states: "Not
  met: the related application has no outcome [label] yet"; "Not met: the related application's outcome is [label],
  but its [type words] document is not eligible yet"; "Met: the related application's outcome is [label][, and its
  [type words] document is eligible]"; "Not met: the related application ended with an outcome this one cannot use. …".
  TA states: "Waiting for the linked application's result"; "The linked application's result is recorded; its result
  document is not ready yet"; "Met"; "The linked application ended with a result this one cannot use"; a declared
  relation with no live link: "Not linked". Relation words come from the code ("Needs tourist e-visa"). No staff page
  shows a fact of the related application beyond its dependency row.
- **Dates and times.** Every time carries "IST" (AD-10, CR-06). Event time and recorded time are both shown where a
  read returns both.
- **Freshness (LD-08).** An authoritative read (`core.*`, `ops.*`, `dlv.*`, `doc.*`) shows "Read at [time] IST". A
  projection (`views.*`) shows "Up to date when read at [time] IST", "Behind by [n] s when read at [time] IST" or
  "Freshness unavailable". No page applies a client-side age threshold. No page polls the packet build; a "Check
  again" link reloads it.
- **Facts.** A page shows only facts that a read returns (WP-02 B-06). A fact read after an operation is labelled
  "Current". A count that a read cannot give shows "Unavailable", never "0" (D7). A list that returns its row limit
  says so and claims no total.
- **Receipts.** CMP-08 as WP06-A103: the request reference links to the operation status page; the resulting facts;
  "Recorded once. Sending the same form again does not repeat it."; no accepted time (P-02). A receipt names the
  command only when the operation's resource, the returned id and the summary establish it on that surface, or when a
  read by the returned id establishes it (A54). Otherwise it reads "Request recorded" with the current facts labelled
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
  Two more cases belong to the replay matrix (A57), never to a term: a *business duplicate* (a new key with the
  current page's facts) and a *raw stale envelope* (a new key with an older page's revision). For the TA's packet
  download (WP-08) the K-BYTE rule of WP-08 §0.2 applies.
- **Refused sends leave no record.** A refused command leaves no operation record: the status page of its key reads
  "Nothing is recorded for request [reference] so far", and the refusal shows only on the re-rendered form. Every
  refusal item says "nothing is recorded" and checks it by delta where a list, a count or a fact could change.
- **Paths (LD-03; design §1.3).** Existing paths and form actions stay. One host page per command (CC-14): OP-04p
  `/ops/applications/:applicationId/packet` (new GET; build and rebuild, action `…/packet/build`); OP-04r
  `/ops/applications/:applicationId/packet/release` (GET beside the POST; release); OP-06h
  `/ops/applications/:applicationId/handovers` (GET beside the POST); OP-06e `/ops/applications/:applicationId/direct-external`
  (GET beside the POST); TA-07l `/ta/applications/:applicationId/dependencies` (GET beside the POST; link, and unlink at
  `…/dependencies/:dependencyId/unlink`). Former hosts, links only: TA-07 (read-only section "Related applications"),
  OP-02 External actions (Packet panel), OP-06 ("Other delivery records" links), the old operator case page and the
  case-work page. Pages of other packages: OP-02 `?tab=`, OP-01, OP-04a, OP-04b (WP-07); OP-05, OP-06, OP-07, TA-07r,
  TA-07d, TA-10, TA-07x (WP-08); TA-08 (WP-03). SA-02e `/admin/queues/assignment?view=dependency_waits` only if built
  (Q-W10-07). An item names the page; the run record names the path used.
- **Pass rule.** WP-10 passes when every `L` item passes on `lane-ui` at the integrated ref, every `T` item has a
  named passing test at that commit, every axe item passes, and the V12 proof of §3 passes, except the explicitly
  deferred items of §5. The run record lists each deferred item as "Deferred" with its reference, not as "Fail". The
  enforcement of a declared but unlinked relation reads "Not met: waits for Max's decision on P-15 item 1", the
  provider-filing capability "Unmet: waits for Max's decision on P-15 item 2" and the recovery of a released packet
  before its handover "Unmet: waits for Max's decision on P-15 item 3"; none of them is a WP-10 failure (H-01, H-08,
  H-11). An item that the architect marks "partly met" by a recorded decision passes with that note. A failed item
  becomes a finding ranked P0, P1 or P2 with its scenario (PRI-20260930-01).
- **Preconditions on `lane-ui`.** WP-01, WP-02, WP-03, WP-06, WP-07, WP-08 and WP-09 are integrated (TA pages create,
  edit, submit and report; SA-06 creates accounts; SA-07a records payments; SA-03a assigns; OP-02 starts work and
  records readiness; OP-04a and OP-04b authorize the provider handoff and the government submission and record their
  evidence; OP-05 records the official result and its file; TA-07 downloads a released packet; TA-10 and TA-07x
  exist). Where one is not integrated, the step runs on the existing page and the run record says so. The processing
  instance of `lane-ui` runs (the packet build and the result-file association are tasks). The harness can create,
  activate and sign in a new synthetic travel agent, and the offerings of §0.3 admit it (checked first, §0.4).
- **Data hygiene.** WP-10 MUST NOT change seeded offerings, declarations, launches, listings or accounts, MUST NOT
  create an offering, and MUST NOT change any exposure ceiling. Each run creates its own travel agent Y, group and
  applications, with notes, references and evidence that carry the run tag. Synthetic documents only, generated in
  memory; passport numbers are new in every run. The run record keeps identifiers (travel agent, applications,
  packets, releases, handovers, dependencies, operation references) in the internal record only.

### 0.3 Synthetic data used by WP-10

| Item | Value | Use |
|---|---|---|
| Travel agent | Y, `wp10-ta-[stamp]`, a fresh synthetic travel agent per run (SA-06); ceiling stays at the default ₹0 | Every application of the run |
| Group | `wp10-[stamp]` in Synthetica; travel start today + 30 days, return today + 40 days | Q, H, E, T, U |
| Q | "SYN Tourist visa preparation" (`syn_tourist_prep`), ₹1,800, preparation only. Mandatory: passport, photograph; optional: travel itinerary. Declared handover evidence: the travel agent's retrieval of the released packet; delivery evidence of `prepared_and_handed_over`: `packet` | The packet path; no originals; no government result |
| H | "SYN Tourist visa via provider" (`syn_tourist_provider`), ₹4,100, filed by a declared provider (approved synthetic route `synthetic:provider-1`); delivery evidence of `issued`: TravelMudra-held electronic (artifact `provider_result`) | Handoff is not filing; the provider-filing evidence path; a direct external delivery record |
| E | "SYN Tourist e-visa" (`syn_tourist_evisa`), ₹3,500, TravelMudra files; artifact `evisa_grant`; applicant D | The upstream of T; a physical handover record |
| T | "SYN Transit e-visa (needs tourist e-visa)" (`syn_transit_dependent`), ₹3,000, TravelMudra files; relation `needs_tourist_evisa`: upstream service `syn_tourist_evisa`, same applicant, required outcome `issued`, required artifact `evisa_grant`, conditions `authorize_government_submission` (and so readiness); applicant D, the same passport as E | The dependency panel and the exact declared evidence |
| U | "SYN Tourist e-visa", another applicant; stays a draft | Link refusal (another applicant) |
| Passports | `td3Lines` of a `SyntheticPassport` with surname `SYNWPTEN`, document code P, issuing state and nationality IND, expiry at least six months after the return date, number "S" + seven digits new to the run; rendered with `passportTextPdf` or `passportImage` (`test/fixtures/documents/samples.ts`). Given names: Q "QADIR", H "HARI", D "DEV" (E and T share one passport), U "UMA" | Intake |
| Photographs | `plainPng` at least 350 × 350 px | Intake |
| Itinerary (Q, optional) | `plainPdf('SYNTHETIC TRAVEL ITINERARY WP10 [stamp]')` | An optional document: OP-04p and OP-04r list the mandatory documents only (design §2.2 item 5) |
| E's result file | A synthetic text PDF in the form of `resultPdf` of `test/system/case-work.test.ts`, made by the WP-08 result-document generator under `test/` (`WP-08.md` §3, PM Q-06): "REPUBLIC OF SYNTHETICA", "ELECTRONIC VISA GRANT", "SURNAME SYNWPTEN", "GIVEN NAMES DEV", "PASSPORT [D's number]". `plainPdf` of `samples.ts` writes one line only and cannot carry the name tokens and the number that the association rule needs | E's eligible `evisa_grant` artifact (meets T's prerequisite) |
| Payments | "Payment received" for Q, H, E and T, evidence reference `SYN-V10-[stamp]-[letter]` | Gate 1 and Gate 2 pass on payment; no exception is used |
| Evidence values | External references `SYN-V10-[stamp]-[letter]-[n]`; notes and reasons "WP10 [stamp] …" | Handover, direct external, act evidence, outcome evidence |
| Names in design §6 | Design → this checklist: syn-ta-1 → Y (a fresh travel agent per run); Q → Q; H → H; T (tourist e-visa of applicant D) → E; X (transit e-visa of D) → T; Y (another applicant's tourist e-visa) → U. As design §6.2 and H-12, the dependent is assigned only after its submission | Reading the design's proof beside this recipe |

### 0.4 Run recipe (rerunnable)

- Run tag `wp10-[yyyymmddhhmm]`. First check: the harness can sign in Y, and the four offerings of §0.3 admit Y
  (TA-03). Fallback when they do not: `syn-ta-1` with a run-tagged group (no other change to `syn-ta-1`), recorded in
  the run record.
- Baseline (step P-0, before the set-up): the OP-01 view counts of OP1 and OP2 (Action now, Waiting, Delivery and
  closure); SA-01 groups that list assignment and delivery work; the TA-10 count of Y right after its activation.
  Every later count check is a delta from it.
- Setup (labelled "Setup", driven by the harness through integrated pages): SA1 creates and activates Y. Y creates the
  group and the drafts Q (with the optional itinerary), H, E, T and U on TA-09. SA1 grants `operator-3` read access to
  the group. The rest of the set-up is in the steps of §3 where it is needed.
- The packet build and the result-file association run as tasks: a step that waits for "Built" or for "Verified for
  this application" reloads the page (at most 60 s) and records the waiting time; it never sends again.
- Order (§3): P-0, Setup, Part D1 (link on drafts), Part Q (preparation-only), Part H (provider), Part D2 (exact
  declared evidence), Part X (isolation, tests, axe). Data of earlier runs stays and is excluded by its tag.

### 0.5 Refusal shapes in the code at e9e96e3 (category / code)

| Command | Refusals the items assert |
|---|---|
| `ops.request_packet_build` | `not_found_or_forbidden` / `access_denied` (not the assigned operator; a reassignment after the policy check); `stale_revision` / `stale_revision` (the page's application revision; a supersede of a packet that is not live); `control_blocked` / `service_mode_not_applicable`; `control_blocked` with the `start_operator_work` blockers (`application_not_open`, `outcome_already_recorded`, `assignment_changed`, `protection_mark_active`, launch and declaration codes, `hold_returned_to_ta`); `control_blocked` / `hold_returned_to_ta` or `hold_assistance_in_progress` (editor state); `control_blocked` / `operator_work_not_started`; `control_blocked` / `mandatory_document_missing` with one blocker per requirement; `conflict_duplicate` / `packet_exists`, `packet_released`, `packet_handed_over`; `validation_failed` / `input_invalid`. After acceptance the task may end `build_failed` (`evidence_changed`, `too_large`, `assignment_changed`, `bytes_unavailable`): a state, not a refusal |
| `core.release_packet` | `not_found_or_forbidden` / `access_denied`; `stale_revision` / `stale_revision` (application, hold or material revision); `control_blocked` with every blocker of the `release_packet` evaluation (first code first; list in §0.1); `unavailable_parked` when every blocker is parked; `stale_revision` / `packet_stale` (the posted packet is not the current built packet); `control_blocked` / `readiness_missing`; `control_blocked` / `packet_not_ready` or `packet_stale` (the second check in the delivery module); `control_blocked` / `packet_released` (unique guard of a race) |
| `dlv.record_handover` | `not_found_or_forbidden` / `access_denied` (not the assigned operator; a packet of another application); `validation_failed` on `kind`, `recipientKind`, `recipientDetail`, `evidence` (0 or more than 5; a note with an address or a link: `email_like`, `url_like`), `eventAt`, a packet kind without `packetId`; `validation_failed` / `input_invalid` with field `documentVersionIds` code `not_in_group`; `control_blocked` / `packet_not_released`; `conflict_duplicate` / `handover_exists`; `control_blocked` / `declaration_item_unresolved`; `control_blocked` / `handover_evidence_missing` |
| `dlv.record_direct_external` | `not_found_or_forbidden` / `access_denied`; `validation_failed` on `externalReference` (1 to 200), `recipientDetail` (up to 254), `evidence` (1 to 5; note rules), `eventAt`. No business refusal exists |
| `core.link_dependency` | `not_found_or_forbidden` / `access_denied` (either application not readable by the travel agent); `control_blocked` / `dependency_cycle`; `stale_revision` / `stale_revision`; `control_blocked` / `application_not_open`; `control_blocked` / `awaiting_formal_return` or `hold_assistance_in_progress`; `control_blocked` / `dependency_undeclared`; `unavailable_parked` / `parked_preparation_dependency_evidence`; `control_blocked` / `dependency_upstream_final_incompatible`; `conflict_duplicate` / `duplicate_open_scope`; `validation_failed` on `relationshipCode` |
| `core.unlink_dependency` | `not_found_or_forbidden` / `access_denied`; `stale_revision` / `stale_revision` (the page's revision; already unlinked; a race); `control_blocked` / `awaiting_formal_return` or `hold_assistance_in_progress`; `control_blocked` / `filing_possibly_occurred` |

## 1. Scope

### 1.1 Pages

| Page | Host and path | Part in WP-10 |
|---|---|---|
| OP-04p Packet | 4652 `/ops/applications/:id/packet` (new GET) | Packet now, the next action, the mandatory documents now, build and rebuild (`supersedePacketId`) |
| OP-04r Release the packet | 4652 `/ops/applications/:id/packet/release` (GET beside the POST) | The release review (scope, evidence, effect, review); the states with no release form; the release |
| OP-06h Record a handover | 4652 `/ops/applications/:id/handovers` (GET beside the POST) | Packet handover and physical handover with their effects; the precondition notice; earlier records |
| OP-06e Record a direct external delivery | 4652 `/ops/applications/:id/direct-external` (GET beside the POST) | The direct external record with Core's current requirement, lifecycle and owner; earlier records |
| TA-07l Related applications | 4650 `/ta/applications/:id/dependencies` (GET beside the POST) | What the service needs; linked now; link (one relation as text, several as radios); unlink per row |
| TA-07 (WP-03 page) | 4650 `/ta/applications/:id` | Read-only section "Related applications" with the link to TA-07l; status row "Needs [relation]" (AM-W10-10); no form |
| OP-02 and OP-01 (WP-07 pages) | 4652 | Packet panel and status fact; action-panel rows 6a to 10a; checklist and Application-tab dependency words; dependency waits in "Waiting" (F-16 to F-19); no form of a WP-10 command |
| OP-04b, OP-05, OP-06, OP-07, TA-07r, TA-08 | 4652, 4650 (WP-07, WP-08, WP-03 pages) | Text amendments by shape (F-20, F-21, E-13 to E-15); OP-06 links to OP-06h and OP-06e; the TA-08 "Related applications: Not linked" line (Q-W10-11); set-up and observation otherwise |
| SA-02e Dependency waits | 4652 `/admin/queues/assignment?view=dependency_waits` | Only if WP-06's SA-02 is integrated at WP-10 U6 (Q-W10-07); otherwise deferred |
| Old operator case page; case-work page | 4652 | Only: the WP-10 forms leave them; links replace them; every other carried form stays |

Read models: Operator case (`core.ops_case`, `ops.case_work`, `doc.application_evidence`), Delivery page (`dlv.delivery_page`,
staff), Packet handovers (`dlv.packet_handovers`), TA application case (`core.ta_application`), TA delivery facts
(`dlv.delivery_facts`), SuperAdmin case (`core.admin_case`), Assignment queue (`core.assignment_queue`, SA-02e only),
Assigned work queue (`core.ops_work`, `views.ops_work`), TA history (`views.ta_history`, projection), Notices
(`dlv.notices`), Operation (`core.operation`).

### 1.2 Command coverage (CC §5.1: 6 WP-10 commands; hosts of CC-14)

| # | Command | Route id (POST path) | Host page | Items |
|---|---|---|---|---|
| 1 | `ops.request_packet_build` | `ops.case_work.packet_build` (`…/packet/build`) | OP-04p (build; rebuild with `supersedePacketId`) | A07 to A15 |
| 2 | `core.release_packet` | `ops.applications.release_packet` (`…/packet/release`) | OP-04r (an available action under its existing preconditions, LD-05; per-document recheck at the release and at each download) | A16 to A23 |
| 3 | `dlv.record_handover` | `ops.delivery.handover` (`…/handovers`) | OP-06h (packet handover fact; physical handover) | A24 to A30 |
| 4 | `dlv.record_direct_external` | `ops.delivery.direct_external` (`…/direct-external`) | OP-06e (direct external delivery record) | A31 to A36 |
| 5 | `core.link_dependency` | `ta.applications.link_dependency` (`/ta/applications/:id/dependencies`) | TA-07l; the exact declared evidence on OP-02 | A37 to A39, A42 to A46, A100, A101; A47 to A51 |
| 6 | `core.unlink_dependency` | `ta.applications.unlink_dependency` (`…/dependencies/:dependencyId/unlink`) | TA-07l (the first host of this command) | A40 to A42, A45, A101 |

All of them also: A53 (shell), A54 (receipt checked against the operation), A55 (no instruction to act), A56 (no record
for a refusal; lost acknowledgement), A57 (replay matrix), A58 and A59 (refusal text), A60 (LD-14), A61 to A66 (role
controls, labels, read grant and support view, storage, host pages and carried forms, isolation), A67 (notices and
history).

UI-PLAN §12.2 names four actions for WP-10. "Release packet" and "Record packet handover" are commands 2 and 3.
"Record provider handoff" is `core.authorize_external_act` with `provider_handoff` and its evidence, built in WP-07
(WP-07 Q-14; WP07-A72, A164); WP-10 observes it in V12. "Record provider filing evidence" has no Core command: it is
"Unmet: waits for Max's decision on P-15 item 2" (A04).

Commands outside WP-10 that the proofs touch only as set-up or observation: `intake.start_individual`,
`core.edit_draft`, `core.submit`, `core.report_problem`, `core.resolve_hold` (WP-03, WP-09); `pay.record_service_status`,
`core.assign` (WP-06); `ops.start_work`, `ops.record_readiness`, `core.authorize_external_act`, `ops.record_act_evidence`
(WP-07); `ops.record_official_result`, `ops.record_artifact`, the TA's `dlv.retrieve_document` of the packet (WP-08);
`iam.create_account`, `iam.activate_account` (WP-02); `iam.create_group_read_grant`.

### 1.3 State coverage

S1 (loading) does not apply: every WP-10 page is server-rendered. S5 applies only to the TA history and OP-01
(projections).

| Page | Page states | C1 validation | C2 rejected | C3 accepted | C4 unresolved | C5 stale |
|---|---|---|---|---|---|---|
| OP-04p | Not this shape A05; read grant A63; not built A07; being built and built A08; rebuild A09; released A19; build did not finish A12; build check unavailable A11, A60; boundary after the release A20 (4) | — (no field) | A10 | A08, A09 | A13 (5) | A10 (10) |
| OP-04r | Not this shape A05; no packet, being built, blocked A17; documents unavailable A60; allowed A16; released A19 | — | A17, A20, A21 | A19 | A22 (5) | A18, A21 (1), (3), (4) |
| OP-06h | Packet waits for the download A24; offered A25; handed over A27 (2); no released packet A27 (1); physical A28 | A26 | A27 | A26, A28 | A29 (5) | — (no revision; A29) |
| OP-06e | Form with Core's current facts and earlier records A31; recorded A32 | A32 | A34 | A32 | A35 (5) | — (no revision; A35) |
| TA-07l | Open: one relation as text, several as radios A37, A101; with the operator A42; help in progress A42; closed with unlink offered A101; states A43 | A38 (1) | A38, A41 | A39, A40 | A45 (5) | A41 (2), (5), A46 |
| TA-07 section, TA-08 line | Not linked A37, A100; linked states A43; dependency failed A44 | — | — | — | — | — |
| OP-02 declared prerequisite | Not met, document missing, met A47, A48; S4 A60 | — | A48 | — | — | — |
| TA-07r of Q and H | Preparation-only states A02; direct external row A33 | — | — | — | — | — |

### 1.4 Specification scenarios

| Scenario | What WP-10 shows | Items |
|---|---|---|
| V12: third-party handoff is not filing | The handoff words (WP-07, observed); the provider files and TravelMudra learns of it through the provider's result (F-20); no packet command for H. The separate provider-filing capability: "Unmet: waits for Max's decision on P-15 item 2" (H-08) | A04, A05, A06; §3 Part H |
| V12: preparation-only has packet outcome / no originals / no claimed government result | Build, rebuild, release, the TA's download (WP-08), the packet handover that records "Prepared and handed over"; no originals; no government result claimed | A01 to A03, A07 to A30; §3 Part Q |
| V12: dependency needs exact declared evidence | UI: link on TA-07l; the required outcome and the exact document type on OP-02; readiness refused for the outcome alone and accepted only with the eligible `evisa_grant`. Enforcement of a declared relation that is not linked: "Not met: waits for Max's decision on P-15 item 1" (H-01); the "Not linked" lines are warnings | A37 to A52, A100, A101; §3 Parts D1, D2 |
| UX §3.2 Dependency: "without granting sibling visibility" | No upstream fact on the dependent's staff page; another operator gets SH-02 on the upstream | A47, A50 |
| B22: packet handover does not prove a government-result prerequisite | A link from a government-result relation to a preparation-only upstream is a parked boundary | A38 (9), A51 |
| B24, B31: direct external delivery records provenance and the absence of a TravelMudra-held result | The OP-06e record and the TA row; completion counts it only where declared | A31 to A36 |
| V17 (packet part): a download alone is not the delivery evidence | The delivery requirement of Q is met by the packet handover record, not by the download | A36; §3 V12-Q10 |
| V15 (part): no SuperAdmin build, release, handover or delivery-record control | SuperAdmin pages hold facts only | A61 |
| V24 (keyboard and phone) | The WP-10 tasks by keyboard and at 390 px | A68 to A79 |

## 2. Acceptance checklist

### 2.1 Service shapes (V12)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP10-A01 | Operator (OP1) | OP-02 of Q, H and E (§3 V12-Q1, V12-H1) | Read the band, the status facts and the External actions tab of each. | The band kind words and the mode sentences are WP07-A14 and A50 with the words of design §2.1. Q: status fact "Packet: Not built" (WP-07 F-19); "External acts: None for this service"; External actions context line "No external act: the work ends in a packet for the travel agent, who files. TravelMudra performs no government act, holds no originals and claims no government result."; the Packet panel (packet state, handover words, the next action of OP-04p as a link, "Open the packet page" → OP-04p) in place of the carried packet forms; no form on OP-02. No Gate 2 row, no government fee row. H and E: no Packet panel. H: the WP-07 handoff section and, after the handoff evidence, the line of A04. Freshness "Read at [time] IST". | L | UX §3.2, §5.3; BS B04; design §2.1, §2.8 items 1 and 5; `WP-07.md` F-19 |
| WP10-A02 | TA (Y); test | TA-07 and its "Result and delivery" section (TA-07r) of Q at each step of §3 Part Q; TA-07d, TA-10 and TA-07x of Q | Read all text. | The TA-07r states of WP-08 E-15 (design §2.9): after the release "Your preparation packet is ready. Download it and file the application yourself with the authority."; after a download sent in full "Your preparation packet was sent to you in full on [time] IST. TravelMudra records the handover."; after the handover "Outcome: Prepared and handed over. TravelMudra claims no government result for this application." Before the release a shape line shows only where the TA's facts establish it (the TA read has no service mode, STOP-W10-07). No text says that TravelMudra files Q, that a government act happened, or that a government result is awaited or claimed; no "and with it the result" (F-W10-03). Never "Issued", "Filed", "Delivered" or "Received" for Q. No Originals section. The download itself is WP08-A72. A renderer test covers the four states. | L+T | UX §2.2, §3.2 (Preparation-only); BS B04, B21; design §2.9, §2.11.1; `WP-08.md` E-15 |
| WP10-A03 | Operator (OP1); TA (Y); harness | OP-02 of Q (all tabs); TA-07 of Q (§3 V12-Q10) | Read. Harness: post an original receipt on Q. | OP-02: no Originals section and no original receipt, movement or return control; the External actions line says that TravelMudra holds no originals. TA-07: no Originals section (the TA read returns `originals` null). The hand-made post is refused (`preparation_only_holds_no_originals`) in words; nothing is recorded (original count delta 0). OP-09 itself is WP-12. | L | UX §3.2; BS B04, B30; design §2.1 (OP-09 and TA-07 rows); `originals.ts:102` |
| WP10-A04 | Operator (OP1); TA (Y); test | OP-04b (WP-07), OP-02 External actions and OP-05 (WP-08) of H after the handoff evidence; TA-07 of H (§3 V12-H3) | Read. Look for any text about the provider's filing. Run the sweep test (A06). | OP-04b after-evidence banner (WP-07 F-20; design §2.9 row 1): "Handed to the provider: evidence recorded [time] IST. The provider files with the authority. TravelMudra learns of the provider's filing through its result: record the result on Outcome and result file when it arrives." OP-02 External actions: "The provider's result is recorded on Outcome and result file when it arrives." with the link to OP-05. OP-05 (WP-08 E-13): "The declared provider files with the authority. Record the outcome and the provider's result file when it arrives. The handoff record is not evidence of the outcome." Staff `awaiting_external_result` for H (WP-07 F-21): "The handoff to the provider is evidenced. The provider files with the authority; its result is awaited." TA-07: "TravelMudra's external step is done. The result is awaited from the authority or the provider." No page names a provider-filing record, form or route, and no control records a provider filing as handoff evidence, act evidence or a note. The separate provider-filing capability (UI-PLAN "Record provider filing evidence") is recorded "Unmet: waits for Max's decision on P-15 item 2", not as a failure of this item. | L+T | UX §3.2 (Third-party filed); BS B04; `WP-10.md` §3 Q-W10-05, H-08; `WP-07.md` F-20, F-21; `WP-08.md` E-13; P-15 item 2 |
| WP10-A05 | Operator (OP1); harness | OP-04p and OP-04r of H and E (§3 V12-H1) | Open both pages for H and for E. Harness: post a packet build on H and on E; post a release on H. | Each page: the frame and "This service does not end in a packet." with the kind words and a link to External actions; no form. The build posts are refused (`service_mode_not_applicable`): "This service does not end in a packet."; the release post is refused (`control_blocked`, with `service_mode_not_applicable` among Core's blockers, in words); nothing is recorded (packet and release counts delta 0). | L | BS B04; design §2.2 and §2.3 state "Not this shape"; `work.ts`; `controls.ts:453-454` |
| WP10-A06 | Test | Shape words sweep (`test/unit/web/service-shapes-sweep.test.ts`) and word tables (`test/unit/web/service-shapes.test.ts`) | Render OP-02, OP-04p, OP-04r, OP-06h, OP-06e, OP-04b, OP-05, OP-07, TA-07, TA-07l and TA-07r for each service mode and each outcome that the mode allows, with provider fixtures (authorized, uncertain, evidenced). | `prepared_and_handed_over` words appear only for preparation-only; packet words only where a packet exists; no packet text claims a result except "claims no government result"; no text claims that a handoff authorization or its evidence proves a filing, while the mode label "Filed by a declared provider" and the F-20 sentence are allowed (H-13); every `PACKET_STATES` and `DEPENDENCY_STATES` value has words for both audiences, with the code fallback; every WP-10 refusal code has a sentence. | T | `WP-07.md` F-06, F-20; `WP-10.md` H-13 and §3 (test names); design §7.1 U0, U5 |

### 2.2 OP-04p Build the packet (`ops.request_packet_build`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP10-A07 | Operator (OP1) | OP-02 and OP-04p of Q after the start of work, before any build (§3 V12-Q1) | Read OP-02's action panel. Open OP-04p and read it from the top. | OP-02 action panel row 6a (WP-07 F-17): owner you, "Build the packet before you confirm readiness", "Open the packet page" → OP-04p. OP-04p (design §2.2): the OP-02 frame and the title "Packet"; the mode line "Preparation only. TravelMudra prepares a validated packet for the travel agent, who files with the authority. TravelMudra performs no government act, holds no originals and claims no government result."; "Packet now": State "Not built", Release "Not released", Handover "Not applicable before the release"; "What the packet holds" with its lead and the mandatory documents captioned "Mandatory documents now" (passport, photograph; the optional itinerary is not listed), never labelled as the packet's contents; "Build the packet" with "TravelMudra builds the packet in the background from the accepted version of each mandatory document. Every mandatory document must be accepted first." and the button "Build the packet" (the offer, the packet state and the current mandatory documents allow it, H-03); "After the packet" with the links to readiness, result delivery and completion. No release form on OP-04p. Freshness "Read at [time] IST". | L | UX §3.2, §5.3; design §2.2, §2.8 item 2; `WP-07.md` F-17; `WP-10.md` H-03; `work.ts` (mandatory only) |
| WP10-A08 | Operator (OP1) | OP-04p of Q (§3 V12-Q2) | Select "Cancel" or leave the page. Then build. Use "Check again" until the state changes. Open the receipt address again after the change. | Leaving records nothing. After the send: C3 receipt "Packet build requested" (named: only the build returns `packetId` and `stepId`); recorded facts: packet [reference] and "TravelMudra builds it in the background from the accepted version of each mandatory document."; Current: "Being built"; no text says that the packet is built; no accepted time. The page states "The packet is being built. This page does not update by itself: check again." and shows no form while the packet is being built. Later the live read shows "Built [time] IST, [size]". If the build does not finish, the live read shows "Not built" and the receipt address shows the qualified line "The packet [reference] is not being built and is not built now: the build did not finish or was replaced." (design §2.12); no "Build failed" state is expected (H-06). The polite region announces the receipt; focus does not move. | L | CMP-08; WP-06 D-02; P-02; design §2.2 item 6, §2.12; `WP-10.md` H-06 |
| WP10-A09 | Operator (OP1), two tabs | OP-04p of Q with a built packet (§3 V12-Q3) | Read the rebuild form. Tab 1: open OP-04p. Tab 2: "Build the packet again". After tab 2's new packet is built, send tab 1. | The rebuild form (`id="rebuild"`): "Build the packet again from the current accepted documents. The packet [reference] is then replaced and never released. Confirm readiness again after the new build."; hidden `supersedePacketId` = the built packet's id and `_rev.application`; button "Build the packet again" (secondary; primary when Core reports `packet_stale`). Tab 2: receipt "Packet build requested" naming the new packet; the live read shows the new packet ("Being built", then "Built"). The replaced packet is on no read: the page shows no "Replaced" row (deferred, STOP-W10-03), and its earlier build receipt shows the qualified line of A08. Tab 1: refused `packet_exists`: "A packet is already being built or is built for this application. Nothing new was built." with the current state; nothing is recorded for tab 1. | L | design §2.2 item 6, §2.12, §2.14, §4.1; `WP-10.md` §3 Q-W10-02, H-06; `packets.ts` |
| WP10-A10 | Operator (OP1, OP2, `operator-3`), SuperAdmin; harness; test | OP-04p and the build action | (1) Harness: build on Q before OP1 starts work (§3 V12-Q0). (2) Harness: a new-key build while a packet is being built or built, without a supersede. (3) Harness: build after the release, once with the released packet as the supersede and once without (§3 V12-Q6). (4) Test: supersede a handed-over packet. (5) Test: a supersede id while no packet is live (after a build that did not finish). (6) Test: Q returned to the travel agent, and help in progress. (7) Test: a mandatory document missing or blocked. (8) OP2, `operator-3` and SA2 open OP-04p of Q and post a build. (9) Test: a version of another group in the request (unit). (10) Harness: a raw envelope with an older application revision. | (1) "Start work first." (`operator_work_not_started`). (2) "A packet is already being built or is built for this application. Nothing new was built." (`packet_exists`) with the current state. (3) With the supersede: "The packet was released. A new packet cannot be built after the release." (`packet_released`); without it: the `packet_exists` sentence. (4) "The packet was handed over. A new packet cannot be built." (`packet_handed_over`), or the `packet_released` sentence. (5) C5 (CMP-14, `stale_revision`). (6) "The application is with the travel agent." / "Approved help is in progress." (7) "Every mandatory document must be accepted before the packet is built." with the requirement rows that are not satisfied. (8) OP2: SH-02; `operator-3`: the frame and facts with "Only the assigned operator takes this step. You can read this application." and no form, the post refused as not found; SA2: no build control on any SuperAdmin page, the post refused. (9) "The packet cannot be built from the current documents." with the reference code. (10) C5 with the changed facts. Nothing is recorded in each case (packet count and step count delta 0). | L ((1), (2), (3), (8), (10)) + T | design §2.0, §2.14; `work.ts`; `packets.ts`; `policy.ts` (`operator.build_packet`) |
| WP10-A11 | Test | The actual OP-04p build-section renderer and `ops.request_packet_build` | Fixtures: packet none, being built, built, released, handed over; work started or not; editor state; every mandatory document satisfied, or one missing or blocked; mode; `ops.case_work` available or unavailable; `doc.application_evidence` available or unavailable. Render OP-04p, then send its form (or a saved envelope where no form shows) to the command for each fixture. | Where Core accepts, the renderer shows the build form (no packet) or the rebuild form (built). Where the offer, the packet state or the current mandatory-document satisfaction shows a refusing fact, the renderer shows the state text or CMP-10 and no form, and the command refuses with that code. Where `ops.case_work` or the evidence read is unavailable, the form shows with "The build check cannot be read now. TravelMudra checks everything when you build." and the command decides (H-03). No fixture where Core accepts renders without a form. | T | `WP-10.md` H-03; design §2.2 item 6; `operations-work.ts:146-147`; Q-04 |
| WP10-A12 | Test; operator | OP-04p after a build that did not finish (fixtures: `evidence_changed`, `too_large`, `assignment_changed`) | Read OP-04p and the build receipt address. Build again. | OP-04p shows "Not built" (the failed packet is not on the live read), the build form again (no supersede needed) and no release route; no text claims that a packet exists. The receipt address shows the qualified line of A08. The new build is accepted. "Build failed: [reason]" is **Deferred** until STOP-W10-03 serves the last build attempt (Q-05; H-06). | T | design §2.12, §3, §4.2; `tasks/build-packet.ts` (`fail`); `WP-10.md` H-06 |
| WP10-A13 | Operator (OP1); harness | Build, the Nth time | Replay terms 1 to 5 on A08. Term 2 adds a supersede id. Term 3: press Back after the receipt; harness: a new-key send from the reloaded page. Term 4: the refusal of A10 (1), then the build after the start of work. | (1) The original receipt and packet id; one packet; one work step. (2) Refused as a used form; nothing recorded. (3) Back reloads OP-04p with "Being built" (no form) or "Built" (the rebuild form); the new-key send without a supersede is refused `packet_exists` and records nothing. (4) Recorded once. (5) C4; no new build is offered there. | L+T | PL §7 K-STD; BS B35; W1 A-02, A-08 |
| WP10-A14 | Operator (OP1), two tabs | OP-04p of a preparation-only application before its first build (fixture or a later run) | Tab 1 and tab 2 open the page. Tab 2 builds. Tab 1 builds. | Tab 1 is refused `packet_exists` with "A packet is already being built or is built for this application. Nothing new was built." and the current state from the re-read; one packet exists; nothing more is recorded. | L | UX §3.3; BS B19, B35; design §4.1 |
| WP10-A15 | Test | Reassignment while a packet is being built | Request a build; reassign Q from OP1 to OP2 before the task runs. OP1 opens OP-04p and posts a build. OP2 opens OP-04p, starts work on the new assignment (OP-02), then builds. | The task ends the build with `assignment_changed` (no blob referenced). OP1: SH-02 on the page and on the post. OP2 before the start of work: no build form, "Start work first." with the route to OP-02 Work. After the start of work: OP-04p shows "Not built" (the failed build is not on the live read) and the build form; OP2's build is accepted. | T | `test/delivery/packets-handover.test.ts` "T-15-47 the build task after the operator was reassigned"; `WP-10.md` H-06, H-12; WP-09 G-09 |

### 2.3 OP-04r Release the packet (`core.release_packet`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP10-A16 | Operator (OP1) | OP-04r of Q (built; readiness recorded by OP1; §3 V12-Q5) | Open "Release the packet to the travel agent" from OP-04p. Read. Select "Cancel". | CMP-25 order (design §2.3): `h1` "Release the packet: [applicant]". Scope: application, service, kind "Preparation only", travel agent, "Operator: you"; "Release: packet [reference], built [time] IST, to the travel agent of this application. A packet is released once." Evidence: "Mandatory documents now" with "The packet holds the versions accepted when it was built. TravelMudra compares them with these at the release."; readiness "Recorded by [name] at [time] IST" with its state; holds "None open"; declared prerequisites only when the case has dependencies. Effect (visible): the four statements of design §2.3 item 4 (the recheck at the release; the notice and the check of every document at each download, with nothing sent in its place; the documents and details become historical and no new packet can be built; no filing and no government result, the outcome is recorded with the packet handover). Hidden `packetId` and the three revisions; no typed field and no confirmation checkbox (D-W10-11). The review line; buttons "Release the packet to the travel agent" and "Cancel" (→ OP-04p, nothing recorded). No B46 or "not decided" text (LD-05). | L | UX §3.1 step 6, §3.2, §7.4; BS B04, B12; design §2.3; LD-05; `acts.ts` (`releasePacket`) |
| WP10-A17 | Operator (OP1); test | OP-04r and OP-04p in each state where no release is possible | Read (L: no packet §3 V12-Q1; problem report open §3 V12-Q5; test: the rest). Test: a saved release envelope for each state. | OP-04r shows the release form only when `releaseOffer` allows it and the packet is built. No packet: "Build the packet first." with a link to OP-04p; being built: "The packet is being built. Release it when it is built."; blocked: CMP-10 per blocker in the WP-07 checklist order, each with reason, owner and route, and the `unavailableButton` "Release the packet to the travel agent" described by the notices: `packet_stale` "A document changed after the packet was built. Owner: you. Build the packet again (Packet page), then confirm readiness again."; readiness codes → OP-02 Work; `readiness_previous_operator` adds "A SuperAdmin may grant a readiness exception for the packet release." (WP07-A167); holds → OP-02r or OP-03r; `dependency_*` → "Waiting on a related application" (no route); offering-item codes → "Owner: TravelMudra"; `deferral_active`, `travel_date_recheck_pending`, document codes per requirement, `renewed_authority_*`, `transition_pending`, `protection_mark_active`, `outcome_already_recorded`, `withdrawal_accepted` and `packet_released` in words. OP-04p's next-action line shows "Releasing is unavailable now:" with the same sentences. Each saved envelope is refused with that blocker; nothing is recorded. | L+T | UX §2.2, §7.4; BS B20; design §2.2 item 4, §2.3 states, §2.14; WP-09 G-05 |
| WP10-A18 | Operator (OP1), two tabs; TA (Y) | OP-04r of Q (§3 V12-Q5) | Tab 1: open OP-04r. Y reports a problem on Q (WP-09). Send tab 1. Reload. | Tab 1: C5 (CMP-14) with the rows of design §2.13 (Packet; Holds current: problem report open since [time] IST; Readiness current); the report moved the hold revision (`stale_revision`); nothing is recorded. The reloaded OP-04r shows no form and the blocked state with "On hold: problem report" and its route (WP-09). Setup after the step: OP1 resolves the report and confirms readiness again. | L | UX §3.3; BS B18, B19; design §2.13; `acts.ts` (`expectedHoldRevision`); PL §4.2 R1 |
| WP10-A19 | Operator (OP1); TA (Y) | OP-04r of Q (§3 V12-Q6) | Release the packet from the freshly loaded page. Read OP-04r, OP-04p, OP-02, OP-01 and Y's TA-10. | C3 receipt "Packet released to the travel agent" (named: only the release returns a `prl_` id); recorded: release [reference] and "The travel agent is notified and can download it. Each download checks every document of the packet again."; Current: the packet state and the handover step ("Waiting for the travel agent's download"). OP-04r then shows the Released state and no form. OP-04p's next action: "Waiting on the travel agent: download the packet." No "Delivered", "Sent", "Handed over" or "Completed". No readiness prompt after the release (Core's answer `packet_released`, `record_delivery`; OP-02 row 8b). OP-01: Q moves by the WP-07 mapping to the travel agent's step (delta). TA-10: one notice for the released packet, linked to Q, with no acknowledgement and no read marker (delta + 1). | L | LD-05, LD-06; design §2.2 item 4, §2.3, §2.8 item 2, §2.12; `acts.ts` (notice `packet_available`); `derived.ts:405` |
| WP10-A20 | Test; operator | Per-document recheck at the release and at each download | (1) Change the evidence after the build; release from a freshly loaded OP-04r. (2) Block a mandatory document version between the build and the release; release from a freshly loaded page. (3) Isolate the packet-material guard: after the build, move the material revision without a document change (fixture); confirm readiness again on the new basis (fresh readiness); release from a freshly loaded page with current revisions. (4) After the release and before the handover, block a constituent; the travel agent downloads; read OP-04p, OP-04r and TA-07r. (5) Read the receipt of A19. | (1) Refused `packet_stale` by the release evaluation; nothing released; OP-04p offers "Build the packet again" as the primary action. (2) Refused with the document's code and its requirement named, never only "the packet". (3) Refused `control_blocked` / `packet_stale` by the second check of the delivery module, not by a revision or readiness guard; nothing released; then the rebuild, fresh readiness and the release are accepted (H-07). (4) The download is refused `packet_constituent_unavailable` and nothing is sent in its place (TA side WP08-A72; TA-07r "This packet is held. It is not sent while TravelMudra handles a problem with one of its documents. Nothing is sent in its place."); OP-04p: "Released. A document of the packet is no longer releasable, so it cannot be downloaded." with the boundary "A new packet cannot be built after the release in this release of TravelMudra. Owner: product owner."; no rebuild form, no second release, no substitution; recovery reads "Unmet: waits for Max's decision on P-15 item 3" (H-11). (5) The receipt lists no per-document result: Core's release returns the release id only; the per-document checks run at every download (K-BYTE; Q-05). | L ((5)) + T | UX §3.1 step 8, §8.3; BS B12; design §4.3; `controls.ts:597-605`; `packets.ts` `markPacketReleased`; `release.ts:206-216`; `WP-10.md` H-07, H-11; `test/delivery/packets-handover.test.ts` "T-15-42 a preparation-only packet …" |
| WP10-A21 | Operator; SuperAdmin; harness; test | Release action | (1) Harness, before the release: a release that names Q's replaced packet (§3 V12-Q6); test: a release that names a packet of another application. (2) Harness: a second release with a new key after A19. (3) Harness: a raw stale envelope (older revisions). (4) Two tabs: tab 1 opens OP-04r; tab 2 builds again and confirms readiness again; send tab 1. (5) OP2, `operator-3`, SA2 open OP-04r and post a release on Q. | (1) C5 (CMP-14) with the current packet and "The documents or the declared prerequisites changed since you opened the page." (`stale_revision` / `packet_stale`); nothing recorded in either application. (2) "The packet was already released. Nothing more was released." (`packet_released`). (3) C5 with the changed facts. (4) C5 with the new packet; nothing recorded. (5) OP2: SH-02; `operator-3`: the facts with the read-only line and no form, the post refused as not found; SA2: no release control on any SuperAdmin page, the post refused. Release count delta 0 in each case. | L ((1) replaced packet, (2), (5)) + T ((1) other application, (3), (4)) | design §2.13, §2.14; `acts.ts` (`packet?.packetId !== input.packetId` → `packet_stale`); `policy.ts` (`operator.release_packet`) |
| WP10-A22 | Operator (OP1); harness | Release, the Nth time | Replay terms 1 to 5 on A19. Term 3: Back after the receipt; harness: a new-key send from the reloaded page. Term 4: the refusal of A18, then the release from a freshly loaded page after the set-up. | (1) The original receipt; one release; one TA notice. (2) Refused as a used form; nothing recorded. (3) Back reloads OP-04r with the Released state and no form; the new-key send is refused `packet_released`. (4) Recorded once. (5) C4; no new release is offered there. | L+T | PL §7 K-STD; BS B35; design §4.1 |
| WP10-A23 | Test | Reassignment around the release (WP-09 G-09 class) | (1) OP1 confirms readiness on a built packet; Q is reassigned to OP2 with an unchanged basis; OP2 starts work on the new assignment, then opens OP-04r. (2) After the release, Q is reassigned to OP2; OP1 posts the handover; OP2 opens OP-06h and records it. | (1) No release form; "Readiness: Recorded by the previous operator" with "A SuperAdmin may grant a readiness exception for the packet release." (WP07-A167); a saved release envelope is refused `readiness_previous_operator`. Before OP2 starts work, the first blocker is `operator_work_not_started` (H-12). (2) OP1: SH-02, nothing recorded; OP2's handover is accepted. | T | BS B19; `controls.ts` (`readinessGate`, stage order); WP07-A167; `WP-10.md` H-12 |

### 2.4 OP-06h Record a handover (`dlv.record_handover`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP10-A24 | Operator (OP1); harness | OP-06h of Q after the release, before the travel agent's download (§3 V12-Q7) | Open OP-06h from OP-06 or from OP-04p. Read. Harness: post a packet handover. | Scope "A record of a handover to the travel agent. It releases no file. Your name, the evidence and the time are kept."; Evidence: packet state and reference; "Sent in full to the travel agent's own download: Not yet"; earlier records. CMP-10: "Recording the packet handover is unavailable until the packet is sent in full to the travel agent's own download. Owner: the travel agent. They download it from the application." The packet option is absent; the physical option stays. The hand-made post is refused (`handover_evidence_missing`) with that sentence at "What was handed over"; nothing is recorded (handover count delta 0). OP-01: Q at the travel agent's step (WP-07 mapping). | L | BS B31; design §2.4 items 2 to 5 and states; `handover-step.ts`; `test/unit/web/packet-handover.test.ts` (updated to the OP-06h renderer) |
| WP10-A25 | Operator (OP1) | OP-06h of Q after Y's download (§3 V12-Q9) | Read the form. | Evidence: "Sent in full to the travel agent's own download: Yes, [time] IST"; earlier handover records. "What was handed over" (radios in a fieldset, none preselected): "The released preparation packet [reference]" (only while Core offers it) and "Physical documents, not originals". "Handed to" (radios, none preselected): "The travel agent, on their account" / "The travel agent's representative, in person"; "Name of the person, for a handover in person" (optional; Core's limit 254). One evidence row: kind (External reference, Document reference, Attestation) and reference with the hint "A reference you can find again, such as a receipt number."; "Date of the handover" (optional). Effect (visible), packet: "A packet handover is system-verified only when the packet was sent in full to the travel agent's own download. When no outcome is recorded yet, TravelMudra records the outcome Prepared and handed over in the same step. No government result is claimed. A packet is handed over once."; physical: "An attributed record, not system-verified. It does not count as the delivery this service requires; the delivery requirement shows on Request completion as TravelMudra evaluates it." Buttons "Record the handover" and "Cancel" (→ OP-06). | L | UX §3.2; BS B04, B21, B31; design §2.4; `handover.ts` |
| WP10-A26 | Operator (OP1); harness; test | OP-06h of Q (§3 V12-Q9) | Send with no choice and no evidence. Send a note that holds an address. Harness: six indexed evidence rows; a name of 255 characters. Then record the packet handover to the travel agent on their account. | C1 for the choices and "Give one piece of evidence: a reference, a document reference or your statement."; a field error for the note (`email_like`); the BFF reads every indexed row and refuses the six rows at the evidence field, and refuses the 255-character name at its field; every value and choice is kept; nothing is truncated or left out; nothing recorded (BFF tests, LD-17). Then C3 "Packet handover recorded" (the summary keys are unique to the handover; the `handovers` row by id gives the kind). Recorded: "System-verified: the packet was sent in full to the travel agent's own download."; "Outcome recorded: Prepared and handed over. No government result is claimed." only when `outcomeRecorded` is true. Current: the outcome and the `delivery` requirement as Core reports it. OP-01: Q moves (delta). | L+T | WP-06 D-02; design §2.4, §2.12, §2.14; `WP-10.md` H-04 = LD-17; `handover.ts` |
| WP10-A27 | Operator; SuperAdmin; harness; test | Handover action | (1) Harness: a packet handover that names the built packet before the release (§3 V12-Q5). (2) Harness: a second packet handover with a new key after A26. (3) Harness: a packet id of another application. (4) OP2, `operator-3` and SA2 open OP-06h and post a handover on Q. (5) Test: a declaration with no handover standard. (6) Test: a physical handover that names a document version of another group. (7) Harness and BFF test: a recipient detail over 254 characters; an event date that is not a date; an invalid indexed evidence row after a valid first row. | (1) "The packet is not released. Release it first." (`packet_not_released`) at "What was handed over". (2) "The packet handover was already recorded. Nothing more was recorded." with the record; the page shows the recorded state and the unsent values. (3) The uniform not-found page. (4) OP2: SH-02; `operator-3`: the facts with the read-only line and no form, the post refused as not found; SA2: no form on any SuperAdmin page, the post refused. (5) "This service does not state how a packet handover is evidenced. Owner: TravelMudra." (6) A field error on the documents (`not_in_group`). (7) Refused at the field with every value kept; never truncated and never sent with a row left out (LD-17). Nothing is recorded in each case (handover count delta 0; no outcome). | L ((1) to (4), (7)) + T | design §2.4 states, §2.14; `handover.ts`; `policy.ts` (`operator.record_handover`); `WP-10.md` H-04 |
| WP10-A28 | Operator (OP1); test | OP-06h of E after its result file is eligible (§3 V12-D11) | Record a physical handover: "Physical documents, not originals", to the travel agent's representative in person, with an evidence reference. Read OP-06h, OP-02 and OP-07 of E. | The physical effect of A25 before the button. Receipt "Physical handover recorded" (the `handovers` row by id has the kind `physical`; "Handover recorded" when the row is not read). Current: "Physical handover recorded [time] IST: attributed record". E's outcome stays "Issued"; no custody fact changes; OP-07 shows Core's delivery requirement unchanged (WP-08 wording). The earlier-records list shows it. Test: a second physical handover with a new key is a second record (Core has no duplicate guard, STOP-W10-08; no guard is claimed on the page; Q-09). | L+T | BS B24, B30, B31; design §2.4, §2.11.2, §2.12; `handover.ts` (physical: no state check); `test/delivery/packets-handover.test.ts` "T-15-45 a physical handover record: never system-verified, and no original changes custody"; WP-09 G-03 |
| WP10-A29 | Operator (OP1); harness | Handover, the Nth time | Replay terms 1 to 5 on A26. Term 2 changes the recipient. Term 3: Back after the receipt; harness: a new-key packet handover. Term 4: the refusal of A26, then the valid send. | (1) The original receipt; one handover; one outcome fact. (2) Refused as a used form; nothing recorded. (3) Back reloads OP-06h with the record listed and no packet option; the new-key send is refused `handover_exists`. (4) Recorded once. (5) C4; no new handover is offered there. The command carries no revision: no stale case; the business check answers. | L+T | PL §7 K-STD; BS B35; design §4.1 |
| WP10-A30 | TA; operator; test | Every handover, delivery and completion text for Q, H and E on OP-06h, OP-06e, OP-06, OP-02, OP-07, TA-07, TA-07d and TA-07x | Read. Run the sweep test. | The delivery words of §0.2: "Delivered" only for a direct external record; a download "Sent in full"; "Received" never; a packet handover "Packet handover"; a physical record "attributed record"; the TA direct-external row of E-15; no "through Send result" for a packet or a direct external delivery (E-06); completion rows show only Core's flags and codes (E-05); the OP-07 `delivery` row routes by channel (packet → OP-06h, direct external → OP-06e; WP-08 E-14). The sweep (A06) covers the WP-10 texts with the WP-08 sweep (WP08-A51, A117) and allows the mode label "Filed by a declared provider" (H-13). | L+T | `WP-08.md` E-05, E-06, E-12, E-14, E-15; `WP-10.md` H-13; design §2.11.2 |

### 2.5 OP-06e Record a direct external delivery (`dlv.record_direct_external`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP10-A31 | Operator (OP1) | OP-06e of H after its official result (§3 V12-H5) | Open OP-06e from OP-06. Read. Select "Cancel". | `h1` "Record a delivery made directly by an external party: [applicant]". Scope: "A record that an external party, for example the authority or the declared provider, delivered the result directly. TravelMudra releases no file with this record and claims no file it holds." Evidence: the outcome; the `delivery` requirement as Core evaluates it now ("Met" or "Not met" with Core's code sentences), the lifecycle and the owner as Core reports them; earlier direct external records with "A second record is a second fact; it does not replace the first." when one exists. Fields: "External reference" (required; Core's limit 200), "Delivered to" (optional; 254), one evidence row, "Date of the delivery" (optional). Effect: "An attributed record, not system-verified. It counts as the delivery of the result only when this service declares delivery directly by an external party for the recorded outcome. Request completion then shows the requirement met." and "Record only a delivery you have evidence of. If you do not know whether the external party delivered, do not record it." No sentence predicts that the requirement stays not met or that the application stays open (H-10). Buttons "Record the direct delivery" and "Cancel" (→ OP-06, nothing recorded). | L | UX §2.2; BS B24, B31; design §2.5; `WP-10.md` H-10 |
| WP10-A32 | Operator (OP1); test | OP-06e and OP-07 of H (§3 V12-H5) | Send with no reference. Send a note that holds a link. Record the delivery. Read OP-06e and OP-07. Test: OP-06e on a fixture where an earlier direct external record already meets the requirement, and on a completed application. | C1 "Enter the external party's reference."; a field error for the note (`url_like`); values kept; nothing recorded. Then C3 "Direct external delivery recorded" only when the `handovers` row with the returned id has the kind `direct_external` (the result shape equals a manual email record's), else "Request recorded". Recorded: "Attributed record, not system-verified. It claims no file held by TravelMudra and releases nothing." with "Recorded [time] IST". Current: the `delivery` requirement as Core reports it now (for H, which declares TravelMudra-held delivery, Core reports it not met; the page states Core's fact and neither explains nor predicts it). No file released (release count delta 0). Test: with the earlier record the page shows "Met"; on the completed application it shows the lifecycle "Completed"; neither shows a "stays not met" or "stays open" sentence (H-10). | L+T | WP-06 D-02; design §2.5, §2.12; `WP-10.md` H-10; `derived.ts` `completionEvidence` |
| WP10-A33 | TA (Y) | TA-07r, TA-07d and TA-07x of H after A32 (§3 V12-H6) | Read. | The TA-07r row of WP-08 E-15: "Delivered directly by an external party. This record names no file held by TravelMudra." with its event time where recorded and "Recorded [time] IST"; no download offered for it; the official result row unchanged; no claim that TravelMudra filed H. History line "Delivery outside TravelMudra recorded (an attributed record, not system-verified)" with the lag freshness. | L | BS B31; design §2.9, §2.11.2; `WP-08.md` E-15; `case-projectors.ts` (`direct_external_recorded`) |
| WP10-A34 | Operator; SuperAdmin; harness; test | Direct external action | (1) Harness and BFF test: a reference of 201 characters; a "Delivered to" of 255; no evidence; six indexed evidence rows. (2) OP2, `operator-3` and SA2 open OP-06e and post a record on H. (3) Test: a record on an application whose declaration names TravelMudra-held delivery; a second record with a new key; a record with an event date in the future. | (1) Each refused at its field with every value kept; never truncated and never sent with a row left out; nothing recorded (LD-17). (2) OP2: SH-02; `operator-3`: the facts with the read-only line and no form, the post refused as not found; SA2: no form, the post refused. (3) Each accepted by Core (no mode, outcome, declaration, duplicate or date-range check): the page lists each record and claims no guard (Q-09); no `instant_in_future` refusal is expected and the future date is recorded as typed (H-14). | L ((1), (2)) + T | design §2.5; `handover.ts`; `WP-10.md` H-04, H-14; `test/delivery/packets-handover.test.ts` "T-15-44 a direct external delivery: no TravelMudra-held result, no release row, no bytes" |
| WP10-A35 | Operator (OP1); harness | Direct external, the Nth time | Replay terms 1 to 5 on A32. Term 3: Back after the receipt. Term 4: A32's refusal, then the valid send. | (1) The original receipt; one record. (2) Refused as a used form; nothing recorded. (3) Back reloads OP-06e with the record listed and an empty form; a new send would be a second record (Core has no duplicate check; the listed record is the warning; Q-09). (4) Recorded once. (5) C4. No stale case exists (no revision). | L+T | PL §7 K-STD; BS B35; WP-09 G-03; design §4.1 |
| WP10-A36 | Test; operator | Completion evidence per declared delivery kind (OP-07, WP-08 wording) | (1) Test: a declaration with `direct_external` delivery for `issued`; record the outcome; then a direct external record. (2) Test and L (Q, §3 V12-Q10): read Q's completion prerequisites after the download and after the handover. | (1) The delivery prerequisite is unmet before the record and met after it; a manual email or a download never meets it. (2) Q: after the download alone, the delivery prerequisite is not met; after the packet handover, Core reports it met; OP-07 shows Core's flags only. | L ((2)) + T | BS B24; UX §12 V17; `derived.ts` `completionEvidence`; `test/delivery/packets-handover.test.ts` "T-15-46 delivery evidence per shape … a download alone is never a send or a handover" |

### 2.6 TA-07l Related applications (`core.link_dependency`, `core.unlink_dependency`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP10-A37 | TA (Y) | TA-07 and TA-07l of T as a draft (§3 V12-D1) | Read TA-07's status rows and its section "Related applications". Open "Link or unlink a related application" (TA-07l). Read. | TA-07: status row "Needs tourist e-visa: Not linked"; the read-only section with "What this service needs" and the link to TA-07l; no form on TA-07. TA-07l (design §2.6): `h1` "Related applications: [applicant]"; the lead; "What this service needs" with the relation words and "Not linked"; "Linked now" empty ("No application is linked."); "Link an application": one relation without a live link is shown as text with a hidden `relationshipCode` (several: radios, none preselected, with "TravelMudra checks that the application you choose fits the relation you choose."); "Application in this group" radios (none preselected) listing only Core's linkable applications (E), each "[Surname, Given names] ([service]) · Application [reference] · [outcome or 'Outcome not recorded']"; U and H are not listed; the effect of design §2.6 item 6 is visible; hidden `_rev.application`; button "Link the application". The requirement (outcome and document) is not shown to the travel agent: partly met until STOP-W10-05 and the P-05 extension (Q-01). "Not linked" is a warning, not enforcement (A100). | L | UX §3.2 (Dependency); BS B22; design §2.6, §2.7; `bindings/core.ts` `siblingsOf`; Q-01 |
| WP10-A38 | TA (Y); harness; test | TA-07l link (§3 V12-D2, V12-D3) | (1) Send with no application chosen. (2) Harness: T → U. (3) Harness: T → H. (4) Harness: T → T. (5) Harness: an undeclared relation code. (6) Harness, after A39: a second link of the same relation with a new key and a fresh revision. (7) Harness: T → an application of `syn-ta-2`. (8) Test: an upstream already ended with an outcome the relation cannot use. (9) Test: a preparation-only upstream for a relation that needs `issued`. (10) Test: a link that would close a chain cycle. (11) Two tabs (A46). | (1) C1 at "Application in this group"; nothing recorded. (2), (3), (5) "That application does not fit what this service needs. It must be the same applicant's application for the needed service, in this group." at the application field (`dependency_undeclared`); the choices kept. (4), (10) "That link would make the two applications wait for each other." (`dependency_cycle`). (6) "This application is already linked for that need. Unlink it first to link another application." (`duplicate_open_scope`). (7) The uniform not-found page. (8) The current sentence of `dependency_upstream_final_incompatible`; such an application is not offered. (9) CMP-10 "Linking a preparation-only application cannot meet this need: a packet handover is not a government result. Owner: TravelMudra." (`unavailable_parked`). Each refusal re-renders TA-07l; nothing is recorded (dependency rows delta 0). | L ((1) to (7)) + T | design §2.6, §2.14; `drafts.ts` `linkDependency`; `guard-constraints.ts` (`core_dependencies_relationship_uq`); BS B22; `test/core/withdrawal-dependencies.test.ts` "links only a declared relation to an application of the same group and applicant", "refuses a link to an upstream that already ended with an outcome the relation cannot use; the dependent stays open"; `test/system/case-rules.test.ts` "offers no related application that already ended incompatibly, and refuses a link to it in words; the dependent stays open" (moved to TA-07l) |
| WP10-A39 | TA (Y) | TA-07l and TA-07 of T (§3 V12-D3, V12-D5) | Link T to E. Read TA-07l and TA-07. | C3 receipt "Related application linked" (named only when the `dependencies` row with the returned id is in the current read; Q-07); recorded: the relation and the application. Current: the row "Needs tourist e-visa · [D] (SYN Tourist e-visa) · Outcome not recorded · Waiting for the linked application's result" with "Unlink"; no link form for that relation now. TA-07: status row "Needs tourist e-visa: Waiting for the linked application's result". The receipt says nothing about E beyond the travel agent's own label. | L | WP-06 D-02; design §2.6, §2.7, §2.12 |
| WP10-A40 | TA (Y) | TA-07l of T (§3 V12-D4) | Select "Unlink" on the row. Read the confirmation. Confirm. | Unlink is offered per row by the guard facts of H-02: the editor rule only, with no lifecycle guard (the command has none). Confirmation "Unlink [application]?" with "This application then no longer waits for it. If the service needs a related application, link the right one. The operator confirms readiness again."; confirm label "Unlink"; the accessible name names the application. After the send: neutral receipt "Request recorded" (a link and an unlink return the same shape; Q-07) with Current "Linked now: No application is linked." and "What this service needs: Needs tourist e-visa — Not linked". | L | design §2.6 item 7, §2.12, §5; `WP-10.md` H-02; `drafts.ts` `unlinkDependency` |
| WP10-A41 | TA (Y); harness; test | Unlink action | (1) Harness: a dependency id of another application. (2) Harness: a new-key unlink after A40 from the page loaded before it. (3) Harness: an unlink while T is assigned (§3 V12-D6). (4) Test: an unlink on a returned case where a filing may have happened (an H-02 discrepancy: the form shows). (5) Harness: a raw envelope with an older revision. | (1) The uniform not-found page. (2) C5 (CMP-14) with the current rows (Core `stale_revision`). (3) "This application is with your operator. Links change only while you can change the application. Report the problem so it can be returned for correction." (`awaiting_formal_return`). (4) The unlink control shows; Core refuses "Unlinking is unavailable: a filing of this application may have happened or has happened. Owner: your operator." (`filing_possibly_occurred`), re-rendered on TA-07l. (5) C5 with the changed facts. Nothing is recorded in each case. | L ((1) to (3), (5)) + T | design §2.6, §2.13, §2.14, §4.3; `drafts.ts`; `WP-10.md` H-02; `test/core/withdrawal-dependencies.test.ts` "unlinks only while the dependent is confirmed unfiled" (WP-10 adds the `filing_possibly_occurred` case) |
| WP10-A42 | TA (Y); harness; test | TA-07 and TA-07l of T after its assignment (§3 V12-D6); TA-07l of a returned dependent and with help in progress (test) | Read. Harness: post a link and an unlink. Test: on a returned case, link, hand back, read OP-02. | Assigned: TA-07 keeps the read-only rows and offers no link to change them; TA-07l shows "What this service needs" and "Linked now", the line "This application is with your operator. Links change only while you can change the application. Report the problem so it can be returned for correction." with the link "Report a problem" (WP-09), and no form. Both posts refused (`awaiting_formal_return`); nothing recorded. Help in progress: "An operator is entering information with your approval. You can change links when they return the application to you." and no form. Returned (test): the forms are back; a link moves the material revision; after the hand back OP-02 reads readiness "Out of date: confirm readiness again". | L+T | BS B18, B19; design §2.6 states; `drafts.ts` `taEditorPermits`; `derived.ts` `readinessBasis` |
| WP10-A43 | TA (Y); test | TA-07 status row and TA-07l of T through §3 Part D2 | Read at each step. | One row per linked relation with Core's state in the TA words of design §2.11.3: `waiting` "Waiting for the linked application's result"; `unmet_missing_evidence` "The linked application's result is recorded; its result document is not ready yet"; `met` "Met"; test: `failed_incompatible` "The linked application ended with a result this one cannot use", and an unknown state "Unrecognised state" with "Reference: [code]". The "Its outcome" column shows E's outcome label as the TA read gives it. Never "Ready". | L+T | design §2.6, §2.7, §2.11.3; BS B22 |
| WP10-A44 | Test | Incompatible upstream outcome | Record an incompatible final outcome on the upstream of a confirmed-unfiled dependent, and of a dependent whose act may be filed. | The confirmed-unfiled dependent ends `dependency_failed` with the WP-08 words ("Recorded by TravelMudra because the related application ended with an outcome this one cannot use."); the filed dependent keeps its protection and gets an owned follow-up, not `dependency_failed`; no sibling outcome changes. | T | BS B22; WP-08 design §2.1; `writers.ts` `evaluateDependents`; `test/core/withdrawal-dependencies.test.ts` "fails a confirmed-unfiled dependent on an incompatible final outcome, keeps a filed dependent protected, and never touches a sibling" |
| WP10-A45 | TA (Y); harness | Link and unlink, the Nth time | Replay terms 1 to 5 on A39 and on A40. Term 3: Back after each receipt; harness: a new-key send from the reloaded page. Term 4: A38 (1), then the valid link. | (1) The original receipt; one dependency (one unlink). (2) Refused as a used form; nothing recorded. (3) Link: the reloaded TA-07l shows the row and no link form for that relation; the new-key link is refused `duplicate_open_scope`. Unlink: the reloaded page shows no row to unlink; a new-key unlink from the earlier page gives C5. (4) Recorded once. (5) C4. A raw stale envelope → C5. | L+T | PL §7 K-STD; BS B35; design §4.1 |
| WP10-A46 | TA (Y), two tabs | TA-07l of T (§3 V12-D3) | Tab 1: open TA-07l and choose E. Tab 2: link E. Send tab 1. | C5 (CMP-14): Related applications (current rows) and Editing (current) beside the unsent choice, which stays chosen; nothing recorded. | L | UX §3.3; BS B19; design §2.13 |
| WP10-A100 | TA (Y); operator (OP2); test | TA-07 status row, TA-07l and the TA-08 review of T while no related application is linked (§3 V12-D4) | Read TA-07 and TA-07l. Open TA-08 of T and read the review. Do not submit. Test: submit a fixture dependent with no link; OP2 reads OP-02. | TA-07 "Needs tourist e-visa: Not linked"; TA-07l "Not linked"; TA-08 review "Related applications: Not linked" (WP-03 TA-08 build, Q-W10-11). Each is a warning: the TA-08 submit action stays offered where Core's evaluation allows it, and Core accepts the submission (test); no page blocks or delays a submission for a missing link. OP-02 shows no prerequisite row for the unlinked relation (the staff read carries none). Enforcement is recorded "Not met: waits for Max's decision on P-15 item 1" (H-01; P0 for release), not as a failure of this item. | L+T | UX §3.2; BS B22; `WP-10.md` §3 Q-W10-04, Q-W10-11, H-01; design §2.6, §2.7, §3; P-15 item 1 |
| WP10-A101 | Test | The TA-07l guard-facts mapping (`test/unit/web/related-applications.test.ts`) | For each fixture of Core's link and unlink guards (lifecycle, editor state, relations, linkable siblings, acts of the application, a chain cycle, a preparation-only upstream for a government-result relation, several relations with a mismatched pair), render the actual TA-07l renderer and send its form to the command. | No fixture where Core accepts renders without the form: the page never hides a served action where its facts allow it. The listed discrepancies, where the refusing fact is not on the TA read, show the form and re-render Core's reason on TA-07l: unlink after a possible filing (`filing_possibly_occurred`); a chain cycle (`dependency_cycle`); a preparation-only upstream (`parked_preparation_dependency_evidence`); a relation and an application that do not match (`dependency_undeclared`). Unlink is offered without a lifecycle guard (the command has none). The test names each discrepancy; no exact-parity claim is made (H-02). | T | `WP-10.md` §3 Q-W10-06, H-02; design §2.6 (guard facts); `drafts.ts:209-306` |

### 2.7 OP-02 declared prerequisite and the exact declared evidence (dependent T)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP10-A47 | Operator (OP2) | OP-02 of T after the start of work (§3 V12-D7) | Read the readiness checklist and the Application & documents tab. | Checklist "Declared prerequisites" (WP-07 F-18; design §2.8 item 3): "Needs tourist e-visa: needs the related application's outcome Issued, with its Evisa grant document verified for that application"; status "Not met: the related application has no outcome Issued yet"; owner from Core's pending answer; "Blocks: [act]" where Core's evaluation carries the dependency blocker; route none ("The related application is not shown on this page."). Application tab "Related applications": Relation; Needs (the same requirement sentence); State; the line "The related application itself is not shown here." No name, passport, document, outcome or link of E (the staff read has no upstream id). | L | UX §3.2; BS B22; design §2.8 items 3 and 6, §2.11.3; `WP-07.md` F-18 |
| WP10-A48 | Operator (OP2); harness | OP-02 of T (§3 V12-D7, V12-D9, V12-D11) | Look for "Confirm readiness". Harness: post a readiness while E has no outcome; again after E is "Issued" without a file. After E's file is eligible, confirm readiness (set-up). | While unmet: no readiness form; the dependency blocker in words. The posts are refused: "A related application has not reached the result this one depends on." (`dependency_outcome_unmet`); then "The related application's result is recorded, but its official document is not yet eligible." (`dependency_evidence_missing`); nothing recorded. The checklist row then reads "Not met: the related application's outcome is Issued, but its Evisa grant document is not eligible yet". After the eligible `evisa_grant`: "Met: the related application's outcome is Issued, and its Evisa grant document is eligible"; readiness is accepted (WP-07 set-up); OP-04a offers "Request authorization for the government submission" (observed, not sent). The outcome alone never meets the prerequisite. | L | BS B22; design §2.11.3, §6.3 V12-D8, V12-D9; `controls.ts:584-590`; `derived.ts` `prerequisiteState` |
| WP10-A49 | Operator (OP2); test | OP-01 of T through §3 Part D2 | Read T's row and the navigation count at each step. Run the view and count test. | T sits in "Waiting" whatever the owner kind, with the owner label "Waiting on a related application" and Core's state words; it is not in "Action now" and not in the navigation count; the view count and the navigation count agree (WP-07 F-16). Never "Ready". Lag freshness. | L+T | `WP-07.md` F-16; `WP-10.md` §3 Q-W10-03; design §2.8 item 4; `derived.ts` rule 20; `test/unit/nav-counts.test.ts` |
| WP10-A50 | Operator (OP2) | OP-02 of E (harness GET by OP2); OP-02 of T | Open E's page as OP2. Look for a link from T to E. | E: SH-02 (OP2 is not assigned to E). T: no link, id or fact of E. | L | UX §3.2 ("without granting sibling visibility"); BS B10, B22 |
| WP10-A51 | Test | The exact declared evidence rule and its words | (1) Upstream outcome `issued` with no artifact; with an artifact of another type; with a withheld or pending-review artifact; with an eligible `evisa_grant`. (2) A preparation-only upstream with `prepared_and_handed_over` for a relation that needs `issued`. (3) Render the OP-02 row for each state. | (1) Only the eligible artifact of the exact type meets it; the others leave `unmet_missing_evidence`. (2) Never met; the link is a parked boundary (A38 (9)). (3) The row words of §0.2 for each state, with the required outcome and artifact type. | T | BS B22; `test/core/withdrawal-dependencies.test.ts` "is unmet until the upstream's required outcome has an eligible artifact; missing evidence is not terminal" |
| WP10-A52 | SuperAdmin (SA2); test | SA-02e `/admin/queues/assignment?view=dependency_waits` (only if built); the SuperAdmin case page of T | Open the view. Open T's case page. | When WP-06's SA-02 is integrated and WP-10 U6 builds SA-02e (Q-W10-07): the rows of `core.assignment_queue` whose pending reason is `dependency_outcome_unmet` or `dependency_evidence_missing`, the lead of design §2.10, the cap line "in the first 200 unassigned applications", an unknown view value ignored (test). Otherwise **Deferred** (parked P2); no view claims a count. T's case page shows the dependency rows read only and no link, unlink or readiness control. | L (case page; the view if built) + T | PL §3.4 SA-02; design §2.10; `WP-10.md` §3 Q-W10-07; Q-08 |

### 2.8 Command results, access and shell on WP-10 pages

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP10-A53 | TA; operator; SuperAdmin | Every WP-10 page | Read the shell. | Environment label; "[TEST]" title prefix; rail current item and breadcrumb of design §1.4: TA-07l "Applications" with "… › [applicant] › Related applications"; OP-04p and OP-04r "My work" (or "Applications" with `from=applications`) with "… › Packet" and "… › Packet › Release"; OP-06h and OP-06e "My work" with "… › Result delivery › Record a handover" or "› Record a direct external delivery"; the OP-02 frame items without tabs on the four operator task pages; one `h1`; a freshness line "Read at [time] IST". | L | PL §2.1, §2.2; WP01-A07; design §1.4, §2.0 |
| WP10-A54 | TA; operator; harness | Every accepted WP-10 command; edited receipt addresses | Read each receipt. Open edited addresses: on OP-06e, a `direct_external` done code with the key of a manual email record; on OP-04r, a `released` done code with a build key; on TA-07l, a `linked` done code with an unlink key; the key of another application's operation. | Naming rules (design §2.12): build (`packetId` and `stepId`) → "Packet build requested"; release (`prl_` id) → "Packet released to the travel agent"; handover (`handoverId`, `systemVerified`, `outcomeRecorded`; kind from the `handovers` row by id) → "Packet handover recorded" / "Physical handover recorded", "Handover recorded" when the row is not read; direct external (`handoverId`, no `systemVerified`) → "Direct external delivery recorded" only when the row by id has the kind `direct_external`, else "Request recorded"; link (`dependencyId` with the row in the current read) → "Related application linked", else "Request recorded"; unlink → "Request recorded" (switch at P-10 b). Receipt facts never come from the `done` code alone. An edited address never shows another command's title; another application's key: "Request reference [key]. The receipt cannot be checked now." No accepted time (P-02). | L+T | WP-06 D-01, D-02; W1 A-04; WP-09 G-01; design §2.12; Q-07 |
| WP10-A55 | Operator; TA; test | Receipt addresses of A08, A19, A26, A32 and A39, opened again after later steps (§3 V12-Q10, V12-D12); test after a reassignment | Open each address again. | Each receipt keeps what was recorded then (for example "Packet released [time] IST") and shows the facts that are current now, labelled "Current" (handover recorded; outcome; link met). No receipt or status read tells anyone to act from an older state: no "Build the packet", "Release the packet" or "Record the handover" once Core's facts no longer offer it; none after a reassignment to the previous operator. | L+T | `WP-07.md` F-01 (class fix); WP-09 G-10 |
| WP10-A56 | Operator; TA | Each command of §1.2 with a lost acknowledgement (fixture); a refused send | Inject the fault. Open the operation status page. Select "Check status" after the original resolves. Open the status page of a refused send's key. | C4 (CMP-13) "Checking the original result" and "Check status"; no new send of the same intent is offered there. "Check status" reads the same operation and shows its accepted result. A refused send leaves no operation record: "Nothing is recorded for request [reference] so far". A refusal, and any stale comparison, shows only on the re-rendered form. | T | PL §1.1 UNR; BS B35; W1 A-08; WP06-A104 |
| WP10-A57 | Harness | Each command of §1.2 | (1) Identical replay after acceptance. (2) Same key, changed content. (3) Business duplicate: a new key with the current page's facts. (4) Raw stale envelope: a new key with an older page's revision. (5a) Raw resend of a refused envelope after the facts changed. (5b) Corrected submission from a freshly loaded page after the facts changed. | (1) The original result; no second packet, release, handover, record, link or notice. (2) Refused as a conflict; nothing recorded. (3) Build `packet_exists` (or `packet_released` with the supersede); release `packet_released`; packet handover `handover_exists`; physical handover and direct external: a second record (no guard; Q-09); link `duplicate_open_scope`; unlink: no row on a reloaded page, CMP-14 from the earlier page. (4) Build, release, link and unlink: `stale_revision`, CMP-14 with the current facts; handover and direct external carry no revision, so their stale case is the business check. (5a) The refused key has no record, so Core evaluates the envelope again against its own revisions: where a revision it carries moved (a release envelope refused for a problem report carries the old hold revision, and the resolution moved it), it is refused `stale_revision` and nothing is recorded; where it carries no revision or none moved, the business check decides (a packet handover refused before the download is accepted after it; a build refused before the start of work is accepted after it when the application revision did not move). (5b) The form of a freshly loaded page carries current revisions: the release after the resolution and the new readiness is accepted once (H-07). A duplicate test uses (3), never (4) or (5a). Browser Back is not a replay. | T | WP-06 D-12; PL §7 K-STD; BS B35; `WP-10.md` H-07 |
| WP10-A58 | TA; operator | Every refusal reachable on `lane-ui` in §2.1 to §2.7 | Read each message. | CMP-07 with the reason in words and the owner or route where one exists. Never a code alone, except the UAT-13 fallback. No "Something went wrong", "Invalid data" or "A requirement of this item is not met." | L | PL §1.1 REJ, §11.1; CR-01 |
| WP10-A59 | — | Text map of every reason code that the WP-10 pages can show | Check the map against Core's vocabulary (unit test). | Each code has text in the role's words: `service_mode_not_applicable`, `operator_work_not_started`, `mandatory_document_missing` and the other document codes, `packet_exists`, `packet_released`, `packet_handed_over`, `packet_not_built`, `packet_stale`, `packet_not_ready`, `packet_not_released`, `packet_constituent_unavailable`, `handover_exists`, `handover_evidence_missing`, `declaration_item_unresolved`, `not_in_group`, `email_like`, `url_like`, `readiness_missing`, `readiness_stale`, `readiness_held`, `readiness_previous_operator`, `hold_returned_to_ta`, `hold_problem_reported`, `hold_flagged_to_superadmin`, `hold_assistance_in_progress`, `deferral_active`, `travel_date_recheck_pending`, `renewed_authority_pending`, `renewed_authority_declined`, `transition_pending`, `protection_mark_active`, `outcome_already_recorded`, `withdrawal_accepted`, `preparation_only_holds_no_originals`, `dependency_undeclared`, `dependency_cycle`, `dependency_upstream_final_incompatible`, `parked_preparation_dependency_evidence`, `duplicate_open_scope`, `dependency_outcome_unmet`, `dependency_evidence_missing`, `awaiting_formal_return`, `application_not_open`, `filing_possibly_occurred`, `stale_revision`, `conflict_operation_key`. The pending reasons `packet_released`, `dependency_outcome_unmet` and `dependency_evidence_missing` read per (reason, next action) (WP-07 F-13 class). `access_denied` renders SH-02 or the uniform not-found page, never a text. | T | CR-01; SC §3.4 (UAT-13); `src/apps/shared/core/shared.ts`; `src/apps/shared/delivery/pages.ts` (`DLV_MESSAGES`) |
| WP10-A60 | Operator; TA | OP-04r, OP-04p, OP-06h, OP-06e, TA-07l and TA-07 (HTTP tests) | (1) Let `doc.application_evidence` fail for availability on OP-04r. (2) Let `ops.case_work`, `doc.application_evidence`, `dlv.delivery_page` or `dlv.packet_handovers` fail for availability on OP-04p, OP-06h and OP-06e. (3) Separately: revoke access, end the session, close the installation or start a support view between the page's first read and an optional read; reassign between two reads of OP-04p. | (1) OP-04r keeps the frame, Scope and Evidence with "Documents cannot be read now." and shows CMP-10 "The release review is incomplete: the documents cannot be read now. Try again later. Owner: TravelMudra."; no release form (WP-07 F-04; H-05). (2) Each block reads "Unavailable" in place of its facts; OP-04p keeps the build form with "The build check cannot be read now. TravelMudra checks everything when you build." when `ops.case_work` or the evidence read fails (H-03). (3) The page renders the access page (SH-02, sign-in or maintenance), never the facts read earlier; after a reassignment the previous operator's next read or command gives SH-02. No page code catches every error around a read. | T | LD-14; `WP-07.md` F-04; `WP-10.md` H-03, H-05; design §2.0, §2.3 states; `test/unit/web/packet-handover.test.ts` "a refusal of access is never read as "none": it reaches the page" |
| WP10-A61 | TA; operator; SuperAdmin | Every WP-10 page and the SuperAdmin case and delivery pages of Q, H, E and T | Look for controls of the other roles. | TA pages: no build, release, handover or delivery-record control. Operator pages: no link or unlink control. SuperAdmin pages: no build, release, handover, direct external, link or unlink control (WP07-A117 and WP06-A109 for the release); facts only. | L | BS B18; UX §2.3, §12 V15; PL §11.1 |
| WP10-A62 | TA; operator; SuperAdmin | Every WP-10 page | Read all visible text. | No forbidden label of §11.1 ("File visa", "Submit for TA", "Override", "Admin override", "Approved" or "Done" as an overall status, "Ready" as a universal state, "Force complete"); no "Unread" or "Mark as read"; no "Something went wrong". No claim that a handoff authorization or its evidence proves a filing (the mode label "Filed by a declared provider" is allowed, H-13); "result" for a packet or its handover only in negation; no "not decided" for the packet release; "Delivered" only per §0.2. Times carry IST; counts name their unit; synthetic data carries the synthetic label. No page states a configuration number that it does not read (packet size limit, retry counts, row limits). | L | PL §11.1, §11.2; CR-03, CR-06, CR-07, CR-08; WP-01 Q-13; design §2.0 "Copy" |
| WP10-A63 | Operator (`operator-3`); SuperAdmin in a support view of Y (test) | OP-04p, OP-04r, OP-06h and OP-06e of Q with the group read grant; TA-07 of T in the support view; TA-07l at staff | Read the pages. Harness: post a build, a release, a handover and a direct external record as `operator-3`. Test: in the support view open TA-07 and the `/ops` pages, and post a link and an unlink. | Read grant: the frame and facts, the banner "Read-only access: [purpose], until [date time] IST", the line "Only the assigned operator takes this step. You can read this application." and no form or action link; each post refused as not found. Support view: TA-07's section renders read only; TA-07l is not registered at staff; the `/ops` pages answer 409 (`support_view_active`); each post is refused with the support-view refusal. Nothing is recorded. | L (grant) + T (support view) | UX §2.3; BS B10; PL SH-R09, SH-R10; design §2.0 |
| WP10-A64 | TA; operator | TA-07l, OP-04p, OP-04r, OP-06h, OP-06e | Inspect `localStorage`, `sessionStorage` and IndexedDB after use. Read the response headers. | No evidence reference, recipient detail, external reference, packet id or dependency choice is kept in browser storage. Signed-in pages send `no-store`. | L+T | PL §2.3 SH-R12 |
| WP10-A65 | — | The five host pages and the former hosts | Run `test/unit/web/packet-dependency-host-pages.test.ts`. On `lane-ui` open TA-07 (draft with a relation; submitted unassigned; assigned), OP-02 (every tab; Q and H), OP-06, the old operator case page and the case-work page. Run the route test. | The action paths `/ta/applications/:id/dependencies`, `…/dependencies/:dep/unlink`, `/packet/build`, `/packet/release`, `/handovers` and `/direct-external` each appear as a form action on exactly one renderer: TA-07l, TA-07l, OP-04p, OP-04r, OP-06h and OP-06e. TA-07, OP-02, OP-06, the old operator case page and the case-work page hold none of them and show links instead (TA-07 "Link or unlink a related application"; OP-02 "Open the packet page"; OP-06 "Record a handover" and "Record a delivery made directly by an external party"). The `linked` and `unlinked` receipts live on TA-07l, not in TA-07's flash. Every other carried form (WP-12, WP-14, WP-17) keeps its markup, fields, action and success redirect. The carried-form test entries of WP-03, WP-07 and WP-08 for the moved forms are removed. Five new GET routes are in the inventory; every rendered form action is a registered route. | L+T | `WP-10.md` §3 Q-W10-01 (CC-14), H-09; design §1.3, §1.6, §7.2; LD-02; LD-07 |
| WP10-A66 | `syn-ta-2`; operator (OP2); SuperAdmin | TA-07 and TA-07l of T and Q; OP-04p, OP-04r, OP-06h and OP-06e of Q; ids of another application in the packet, handover and dependency paths | Open each. | `syn-ta-2`: the uniform not-found page. OP2 (not assigned to Q): SH-02 on OP-04p, OP-04r, OP-06h and OP-06e. A foreign packet, handover or dependency id: the uniform not-found page. No fact of Q, H, E or T shows. | L | BS B10; UX §2.3 |
| WP10-A67 | TA (Y) | TA-10 and TA-07x of Q, H, E and T after §3 | Read the lists and the history. | TA-10: one notice for Q's released packet, linked to Q, with no acknowledgement and no read marker (count delta from P-0); its text says that the packet is ready to download and claims no result. History, each line with "Recorded [time] IST" and the lag freshness: Q "Handover recorded" (packet, system-verified words) and "Outcome recorded: Prepared and handed over"; H "Delivery outside TravelMudra recorded (an attributed record, not system-verified)"; E "Handover recorded" (physical, attributed). No line for a packet build, a packet release, a link or an unlink (the projection has none), and the page does not invent one. | L | LD-06, LD-08; WP08-A89 to A91; `case-projectors.ts` (`historyLine`) |

### 2.9 Accessibility (AC-01 to AC-28 that apply)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP10-A68 | Keyboard-only TA and operator | §3 steps V12-D3, V12-D4, V12-Q2, V12-Q3, V12-Q6, V12-Q9, V12-H5 at 1440 px; V12-D3 and V12-Q9 at 390 px | Use the keyboard only. | Every step works with Tab, Shift+Tab, Enter, Space and Escape: link (radios), unlink (confirmation), build, build again, release, record a handover (radios, evidence), record a direct delivery. No action needs a mouse, hover or drag-and-drop. | L | AC-01, AC-12 |
| WP10-A69 | Keyboard-only user | Every WP-10 page at 1440 and 390 px and at 400% zoom | Tab through the page. | Focus is visible (at least 3:1) and never hidden by the top bar, the rail or a bottom action area. | L | AC-02 |
| WP10-A70 | Phone user | TA-07l, OP-04p, OP-04r, OP-06h, OP-06e and the OP-02 readiness checklist | View at 320 px, and at 1280 px with 400% zoom. | No two-dimensional page scrolling. The documents list, the earlier-records list and the dependency rows scroll only inside a labelled region, or become cards. Identity, state, owner and next action come before secondary data. On the four task pages scope and effect come before the fields; the primary action is at the end of the form, never in a fixed bar. | L | AC-04, AC-21; UX §7.3; design §2.0 "Mobile" |
| WP10-A71 | Any | Every WP-10 form | Inspect each input. | Each input has a visible label; the radio groups (`kind`, `recipientKind`, `relationshipCode`, `upstreamApplicationId`) sit in fieldsets with legends and none is preselected; the evidence row labels its kind and its reference; required fields say that they are required; optional fields say "optional". | L | AC-05, AC-15; design §5 |
| WP10-A72 | Any | Packet states, release blockers, dependency states, delivery rows | View in greyscale. | Each state has text. No state is shown by colour alone. | L | AC-06 |
| WP10-A73 | Any | Every WP-10 form | Send each form with an error. | Focus moves to the error summary; each link moves focus to its field; entered values stay; chosen relation, application, kind and recipient stay chosen; evidence rows stay filled. | L | AC-08; CMP-07; WP-09 G-07 |
| WP10-A74 | Screen-reader user | Receipts; the "waits for the download" notice; the release blockers; the declared-but-unlinked line | Read with VoiceOver or NVDA. | Receipts are announced politely without moving focus. Notices and blockers are read before the form they concern. | L | AC-09, AC-16 |
| WP10-A75 | Screen-reader user | Each unavailable action: release before the build (A17), release with a problem report (A18), packet handover before the download (A24), link while assigned (A42), readiness on T while unmet (A48) | Focus the control or the notice. | The reason is exposed (`aria-describedby`, or the notice in reading order); the `unavailableButton` "Release the packet to the travel agent" has `aria-disabled="true"`. A role-forbidden action is not shown at all. | L | AC-13; CMP-10; PL §2.3 SH-R08; design §5 |
| WP10-A76 | Phone user | Every WP-10 page at 390 px | Measure each control. | Every control is at least 24 × 24 CSS px. Primary actions ("Link the application", "Unlink", "Build the packet", "Build the packet again", "Release the packet to the travel agent", "Record the handover", "Record the direct delivery") are at least 44 × 44 CSS px. Radio labels are part of their targets. | L+T | AC-10 |
| WP10-A77 | — | Every WP-10 page | Measure contrast of text, focus, state text and notices. | Normal text at least 4.5:1. Non-text indicators and focus at least 3:1. | L+T | AC-11 |
| WP10-A78 | Any | Long names and texts; reduced motion | Use a 60-character surname and given names, an external reference and evidence references of Core's maximum length, and a long relation name. Turn on "reduce motion". | Names and references wrap without hiding identity; a truncated text has a full form that keyboard and touch reach. No transition plays. | L | AC-14, AC-20 |
| WP10-A79 | TA and operator (observation) | TA-07 of Q after the handover; OP-02 of H after the handoff; OP-02 of T while unmet | Ask the TA "Who files Q with the government?", the operator "Has H been filed?" and "What does T still need?". | The run record reports the answers and the sample size; confusion of a packet with a government result, of a handoff with a filing, or of an outcome with the exact document is a finding. No pass target (observation only). | L | AC-24, AC-26; UX §12 (usability) |

### 2.10 axe checks (WCAG 2.2 A/AA)

Rule for every row: run axe (`@axe-core/playwright` 4.13.0, tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`,
`wcag22aa`) at 1440 × 900 and at 390 × 844. Expected: no violation of impact "serious" or "critical" at either width.
Record the counts of minor and moderate violations. The harness takes no screenshot of a page that shows a real
person's data; WP-10 uses synthetic data only. The rows target the five WP-10 host pages (H-09). The texts that WP-10
amends on TA-07, OP-02, TA-07r and TA-08 are covered by the axe rows of their own packages; the V12 run records their
counts as an observation.

| ID | Persona | Page (state) | Where | Source |
|---|---|---|---|---|
| WP10-A80 | TA | TA-07l of T: open, one relation as text, "Not linked", the application radios (A37) | L | UX §7.5; AC-01 to AC-28 |
| WP10-A81 | TA | TA-07l with the error summary (A38 (1)) | L | same |
| WP10-A82 | TA | TA-07l with the link receipt and "Waiting" (A39) | L | same |
| WP10-A83 | TA | TA-07l with the unlink confirmation open (A40) | L | same |
| WP10-A84 | TA | TA-07l with the operator: no form (A42) | L | same |
| WP10-A85 | Operator | OP-04p of Q: not built, with the build form (A07) | L | same |
| WP10-A86 | Operator | OP-04p with the build receipt and "Being built" (A08) | L | same |
| WP10-A87 | Operator | OP-04p built: the rebuild form and the release link (A09) | L | same |
| WP10-A88 | Operator | OP-04p after the refused build (`packet_exists`, A09 tab 1) | L | same |
| WP10-A89 | Operator | OP-04p released: the handover line (A19) | L | same |
| WP10-A90 | Operator | OP-04r allowed: the full review (A16) | L | same |
| WP10-A91 | Operator | OP-04r after the C5 of a problem report, then blocked with the unavailable button (A17, A18) | L | same |
| WP10-A92 | Operator | OP-04r with the incomplete-review notice (documents read unavailable; A60) | L (gallery state) | same |
| WP10-A93 | Operator | OP-04r with the release receipt, then the Released state (A19) | L | same |
| WP10-A94 | Operator | OP-06h of Q: the packet handover waits for the download (A24) | L | same |
| WP10-A95 | Operator | OP-06h with the error summary (A26) | L | same |
| WP10-A96 | Operator | OP-06h with the handover receipt and the outcome (A26) | L | same |
| WP10-A97 | Operator | OP-06e of H with the error summary and the Evidence section (A31, A32) | L | same |
| WP10-A98 | Operator | OP-06e with the direct external receipt (A32) | L | same |
| WP10-A99 | TA; operator | Operation status page of a WP-10 command, accepted and "Nothing is recorded" (A56) | L | same |

## 3. Proof scenario V12 (to its boundary)

V12 (UX §12): "Third-party handoff is not filing; preparation-only has packet outcome/no originals/no claimed
government result; dependency needs exact declared evidence." Authority B04, B22, B30. Also UX §3.2 (Preparation-only,
Third-party filed, Dependency) and UX §3.1 steps 6 to 8.

One ordered recipe (§0.4) serves the proof. "Setup" steps use pages of earlier packages; they are not the subject
under test. "Observe" steps check items that other packages own. SA1 = `superadmin-1`, SA2 = `superadmin-2`, OP1 =
`operator-1`, OP2 = `operator-2`. The letters map to design §6 by §0.3.

| Step | Actor, page | Action | Observable result | Items | Where |
|---|---|---|---|---|---|
| P-0 | OP1, OP2: OP-01; SA1: SA-01 | Before the set-up, read the counts. | The run record holds the baselines of §0.4. | — | L |
| Setup-1 | SA1 (SA-06, grant page); Y (TA-09) | §0.4: create and activate Y; Y creates the group and the drafts Q (passport, photograph, itinerary), H, E and T (applicant D, one passport) and U; SA1 grants `operator-3` read access to the group. | Y active; five drafts; TA-10 count of Y read (baseline). | — | L |
| V12-D1 | Y: TA-07 and TA-07l of T | Read TA-07. Open TA-07l. | TA-07 "Needs tourist e-visa: Not linked", the read-only section with the link to TA-07l and no form; TA-07l with one relation as text and E as the only option. | A37, A65 | L |
| V12-D2 | Y: TA-07l of T; harness | Send with no application chosen. Harness: T → U, T → H, T → T, an undeclared code, T → an application of `syn-ta-2`. | C1; the refusals in words, re-rendered on TA-07l; nothing recorded. | A38 (1) to (5), (7) | L |
| V12-D3 | Y (two tabs): TA-07l of T; harness | Tab 1 opens TA-07l and chooses E. Tab 2 links T to E. Tab 1 sends. Harness: replay (same key); a second link with a new key and a fresh revision. | Tab 2: "Related application linked", "Waiting for the linked application's result"; tab 1: C5; the replay returns the same receipt; the new key refused `duplicate_open_scope`; one dependency. | A38 (6), A39, A45, A46 | L |
| V12-D4 | Y: TA-07l, TA-07 and TA-08 of T; harness | Unlink. Harness: replay; a new-key unlink from the earlier page; a dependency id of another application. Read TA-07. Open TA-08 of T and read the review; do not submit. | Neutral receipt with Current "No application is linked."; the replay returns the same receipt; the new key C5; the foreign id not found; TA-07 and TA-07l "Not linked"; TA-08 "Related applications: Not linked" with the submit action still offered. | A40, A41 (1), (2), A45, A100 | L |
| V12-D5 | Y: TA-07l of T | Link T to E again. | A new dependency, "Waiting for the linked application's result". | A39 | L |
| Setup-2 | Y (TA-08); SA1 (SA-07a, SA-03a) | Y submits Q, H, E and T. Then SA1 records "Payment received" for each and assigns Q, H and E to OP1 and T to OP2 (each after its submission, H-12). | Four submitted, paid, assigned applications; U stays a draft. | — | L |
| V12-D6 | Y: TA-07 and TA-07l of T; harness | Read. Harness: a link and an unlink. | TA-07l with the operator: "This application is with your operator. …" and no form; both posts refused `awaiting_formal_return`; nothing recorded. | A41 (3), A42 | L |
| V12-Q0 | Harness as OP1 | Before OP1 starts work on Q: post a packet build. Then (Setup) OP1 starts work on Q, H and E; OP2 starts work on T (WP-07). | Refused `operator_work_not_started` ("Start work first."); nothing recorded; work started. | A10 (1), A13 (4) | L |
| V12-Q1 | OP1: OP-02, OP-04p and OP-04r of Q | Read. | OP-02: status fact "Packet: Not built", action-panel row 6a; OP-04p: "Not built" and the build form; OP-04r: "Build the packet first." and no form. | A01, A07, A17 | L |
| V12-Q2 | OP1: OP-04p of Q; harness | Leave the page once. Build. Harness: replay; a new-key build. "Check again" until "Built". | "Packet build requested", "Being built"; the replay returns the same receipt; the new key refused `packet_exists`; then "Built [time] IST, [size]". | A08, A10 (2), A13 | L |
| V12-Q3 | OP1 (two tabs): OP-04p of Q | Tab 1 opens OP-04p. Tab 2 builds again. After "Built", tab 1 sends the rebuild. | A new packet built; the replaced packet on no read; tab 1 refused `packet_exists`; nothing extra recorded. | A09 | L |
| V12-Q4 | Setup: OP1, OP-02 of Q | Confirm readiness (WP-07). | "Recorded by you". | — | L |
| V12-Q5 | OP1 (tab 1): OP-04r of Q; Y: TA-07 of Q; harness | Read OP-04r; Cancel. Harness: a packet handover that names the built packet. Open OP-04r in tab 1. Y reports a problem (WP-09). OP1 sends tab 1. Reload. Setup: OP1 resolves the report and confirms readiness again (WP-09, WP-07). | The review of A16; the handover refused `packet_not_released`; C5 with the open report; OP-04r blocked "On hold: problem report"; nothing recorded; after the set-up the review is available again. | A16, A17, A18, A27 (1) | L |
| V12-Q6 | OP1: OP-04r and OP-04p of Q; Y: TA-10; harness | Harness, before the release: a release that names the replaced packet of V12-Q3; a raw resend of the tab-1 envelope of V12-Q5. Release from the freshly loaded OP-04r. Harness: replay; a new-key release; new-key builds with and without the supersede. | The replaced packet: C5 (`packet_stale`); the raw resend: `stale_revision` (C5); nothing recorded; then "Packet released to the travel agent"; OP-04p "Waiting on the travel agent: download the packet."; TA-10 + 1; the replay returns the same receipt; the new-key release refused `packet_released`; the builds refused `packet_released` (with the supersede) and `packet_exists` (without); one release. | A10 (3), A19, A21 (1), (2), A22, A57 (5a), (5b) | L |
| V12-Q7 | OP1: OP-06h and OP-01 of Q; harness | Open OP-06h. Read. Harness: a packet handover. | The precondition notice with owner the travel agent; no packet option; the handover refused `handover_evidence_missing`; OP-01 at the travel agent's step. | A24 | L |
| V12-Q8 | Y: TA-07 of Q (WP-08 download, Observe) | Read. Download the packet (WP08-A72). | The TA-07r states of A02 before and after the download. | A02 | L |
| V12-Q9 | OP1: OP-06h of Q; harness | Read the form. Send with no choice and no evidence; with an address in the note; harness: six indexed rows and a 255-character name. Record the packet handover. Harness: replay; a new-key handover. | C1 and field errors with values kept and nothing truncated; then "Packet handover recorded" with the outcome line; the replay returns the same receipt; the new key refused `handover_exists`. | A25, A26, A27 (2), A29 | L |
| V12-Q10 | Y: TA-07, TA-07x, TA-10 of Q; OP1: OP-02, OP-07 and OP-05 of Q; harness | Read. Harness: an original receipt on Q; an official result "issued" on Q (Observe WP08-A03 (4)). Open the receipt addresses of V12-Q2, V12-Q6 and V12-Q9 again. | Outcome and the no-government-result line; history lines; no Originals section; the original receipt refused; the official result refused (`service_mode_not_applicable`); completion: delivery met by the packet handover (Core's flag); the old receipts show current facts and no instruction. | A02, A03, A36 (2), A55, A67 | L |
| V12-H1 | OP1: OP-02, OP-04p and OP-04r of H; OP-04p of E; harness | Read. Harness: a packet build and a release on H; a packet build on E. | No Packet panel; OP-04p and OP-04r "This service does not end in a packet." with no form; each post refused `service_mode_not_applicable`; nothing recorded. | A01, A05 | L |
| V12-H2 | Setup: OP1, OP-02 and OP-04a/b of H (WP-07) | Confirm readiness. Request authorization for the provider handoff. Record the handoff evidence "Handed over" with `SYN-V10-[stamp]-H-1`. | Observe WP07-A72 and A164: handoff words only; no Gate 2, fee or exposure line. | — | L |
| V12-H3 | OP1: OP-04b, OP-02 and OP-05 of H; Y: TA-07 of H | Read. | The F-20 banner and the OP-02 line with the link to OP-05; the E-13 line on OP-05; the F-21 staff sentence; the neutral TA sentence; no page names a provider-filing record. | A04 | L |
| V12-H4 | Setup: OP1, OP-05 of H (WP-08) | Record the official result "Issued" with the external reference `SYN-V10-[stamp]-H-RES` and no file. | "Issued"; the release of a result waits for its file (WP-08). | — | L |
| V12-H5 | OP1: OP-06e and OP-07 of H; harness | Open OP-06e from OP-06. Read; Cancel. Send with no reference; with a link in the note. Record the delivery "The provider sent the e-visa to the traveller directly" with the reference `SYN-V10-[stamp]-H-DX`. Harness: replay; a 201-character reference; six indexed rows. | C1 and field errors with values kept; then the receipt (named only by the row kind); Current: Core's `delivery` requirement as reported (not met for H), with no prediction; no file released. | A31, A32, A34 (1), A35 | L |
| V12-H6 | Y: TA-07, TA-07d, TA-07x of H | Read. | The E-15 direct-external row; the history line; no filing claim. | A33, A67 | L |
| V12-D7 | OP2: OP-02 and OP-01 of T; harness | Read. Harness: a readiness on T. OP2 opens E's OP-02. | The prerequisite row with the exact declared evidence and "Not met: the related application has no outcome Issued yet"; T in "Waiting" and not counted; readiness refused `dependency_outcome_unmet`; E: SH-02. | A47, A48, A49, A50 | L |
| V12-D8 | Setup: OP1 on E (WP-07, WP-08) | Confirm readiness; request authorization for the government submission; record the evidence "Filed" with `SYN-V10-[stamp]-E-ACT`; record the official result "Issued" with `SYN-V10-[stamp]-E-RES` and no file. | E "Issued"; no eligible artifact yet. | — | L |
| V12-D9 | OP2: OP-02 and OP-01 of T; Y: TA-07 and TA-07l of T; harness | Read. Harness: a readiness on T. | "Not met: the related application's outcome is Issued, but its Evisa grant document is not eligible yet"; readiness refused `dependency_evidence_missing`; TA "The linked application's result is recorded; its result document is not ready yet"; nothing recorded. | A43, A48, A49 | L |
| V12-D10 | Setup: OP1, OP-05 of E (WP-08) | Record E's result file (§0.3) as `evisa_grant`. Reload until it reads "Verified for this application" and "Eligible for release". | E's artifact eligible. | — | L |
| V12-D11 | OP2: OP-02 and OP-04a of T; Y: TA-07l of T; OP1: OP-06h of E | Read T. Setup: OP2 confirms readiness on T (WP-07); observe that OP-04a offers the government submission (not sent). OP1 records a physical handover on E. | T "Met: … and its Evisa grant document is eligible"; readiness accepted; the authorization offered; TA "Met"; "Physical handover recorded", attributed; E's outcome and custody unchanged. | A28, A43, A48 | L |
| V12-D12 | Y: TA-07x of T and E; Y: receipt address of V12-D5; OP1: receipt address of V12-H5 | Read. Open the two receipts again. | No dependency line in the history; E's handover line; the link receipt with Current "Met" and no instruction; the direct external receipt with its record and Current facts, no instruction. | A55, A67 | L |
| V12-X1 | `syn-ta-2`; OP2; `operator-3`; SA2 | Open TA-07 and TA-07l of Q and T; OP-04p, OP-04r, OP-06h and OP-06e of Q; the same pages with the read grant; the SuperAdmin case and delivery pages of Q, H, E and T; foreign ids. Harness: the isolation posts of §2. | Not-found or SH-02; read-only for `operator-3`; no SuperAdmin control; nothing recorded. | A10 (8), A21 (5), A27 (4), A34 (2), A52, A61, A63, A66 | L |
| V12-X2 | Test | A06, A11, A12, A14 (fixture run), A15, A20, A23, A28 (duplicate), A32 (fixtures), A34 (3), A36 (1), A38 (8) to (10), A41 (4), A42 (returned), A44, A49 (count), A51, A52 (if built), A54, A56, A57, A59, A60, A63 (support view), A64, A65, A100 (submission), A101. | As the items. | as listed | T |
| V12-X3 | axe | The five host pages in the states of A80 to A98, and the operation status page (A99). | No serious or critical violation at 1440 px and 390 px. | A80 to A99 | L |

Proof split: V12 passes when V12-D1 to V12-D12, V12-Q0 to V12-Q10, V12-H1 to V12-H6, V12-X1 and V12-X3 pass on
`lane-ui` at the integrated WP-10 commit and V12-X2 passes as named tests. Three parts are recorded, not failed: the
enforcement of a declared relation that is not linked reads "Not met: waits for Max's decision on P-15 item 1" (H-01;
P0 for release, not for UAT; the "Not linked" warnings pass as warnings); the separate provider-filing capability reads
"Unmet: waits for Max's decision on P-15 item 2" (H-08; the F-20 wording passes); the recovery of a released packet
before its handover reads "Unmet: waits for Max's decision on P-15 item 3" (H-11). A37 and A43 are "partly met" for the
TA requirement text until STOP-W10-05 and the P-05 extension. A12's failure reason and the "Replaced" fact are
"Deferred" until STOP-W10-03. A52 is "Deferred" unless SA-02e is built. The run record names the `lane-ui` ref, the run
tag, Y's identifier, each test, the identifiers (internal record only) and every delta.

## 4. Scenario parts outside this proof (traceability)

| Scenario part | Where it is proven |
|---|---|
| V12: the handoff authorization, evidence words and "no government filing claim for a handoff" | WP-07 (WP07-A72 with F-20, A164; F-06); WP-10 observes them in V12-H2, V12-H3 |
| V12: the mode words in the OP-02 band and the External actions mode sentences | WP-07 (WP07-A14, A50) |
| V12: Gate 2 does not apply to preparation-only and provider services | WP-07 (WP07-A101); WP-06 (WP06-A64) |
| V12: no official-result form for preparation-only; a forced send refused | WP-08 (WP08-A02, A03 (4)); observed in V12-Q10 |
| Enforcement of a declared relation that is not linked | Max: P-15 item 1 (H-01; P0 for release) |
| A record of the provider's filing, separate from the handoff and the result | Max: P-15 item 2 (H-08) |
| Recovery of a released packet whose document became unavailable before the handover | Max: P-15 item 3 (H-11) |
| The travel agent's packet download and its replay (K-BYTE) | WP-08 (WP08-A72); set-up in V12-Q8 |
| TA-07r preparation-only states and the direct-external row | WP-08 E-15 (the WP-08 build, or WP-10 U5); observed in V12-Q8, V12-Q10, V12-H6 |
| OP-02 rows 6a to 10a, checklist words, the Packet status fact, OP-01 "Waiting" for dependency waits | WP-07 F-16 to F-19 (built by WP-10 U4); observed in A01, A07, A47, A49 |
| OP-06 file rows (the released packet; availability) | WP-08 (WP08-A35) |
| OP-07 completion request, its boundary wording and the `delivery` row by channel | WP-08 (WP08-A51 to A60; E-14); WP-10 checks only the delivery requirement facts (A36) |
| The readiness basis and the SA-09 readiness exception for the packet release | WP-07 (WP07-A26, A167) |
| No SuperAdmin release control | WP-07 (WP07-A117); WP-06 (WP06-A109) |
| The TA-08 "Related applications: Not linked" line | WP-03 TA-08 build (Q-W10-11); tested as a warning in A100 |
| Originals register and custody of physical routes | WP-12 |
| Incidents (association, post-handover follow-up, dependency follow-up after a filed dependent) | WP-14 |
| SA-02e "Dependency waits"; delivery and closure ownership | WP-10 U6 only if WP-06's SA-02 is integrated (A52), otherwise deferred; WP-19 for delivery ownership (V15) |
| Preparation-only post-handover policy and dependent-result evidence (BS B44 parked) | Boundary shown in A38 (9); policy is Max's |
| The TA notice list and notice page rendering | WP-08 (TA-10); WP-10 checks the packet notice in A19, A67 |

## 5. Out of scope and boundaries

These MUST NOT appear on any WP-10 page:

- A text that says TravelMudra files a preparation-only application, or that claims a government result, a filing or
  an awaited authority result for it (BS B04; UX §3.2).
- A text, label, banner or receipt that claims that a handoff authorization or its evidence proves a filing; a page
  that names a provider-filing record, form or route that does not exist (F-06, F-20, H-13).
- An original-custody control or an Originals section on a preparation-only application (BS B04, B30).
- A packet build or release form on a TravelMudra-filed or provider-filed application.
- A form of a WP-10 command on TA-07, OP-02, OP-06, the old operator case page or the case-work page (H-09).
- A build or rebuild form where the offer, the packet state or the current mandatory documents show a refusing fact,
  or its absence where Core accepts, outside the outage rule of A11 (H-03).
- A release form during a documents-read outage (H-05); a B46 or "not decided" boundary on the packet release (LD-05).
- A rebuild, a second release or a substituted file after the release (H-11).
- A release receipt that lists per-document results that Core did not return; a page that lists the current documents
  as the packet's contents (STOP-W10-03).
- "Delivered", "Received" or "through Send result" outside the WP-08 rules (E-06, E-12, E-15); a direct external record
  or a physical handover presented as meeting a delivery requirement that Core reports as unmet (E-05); an OP-06e
  sentence that predicts an unmet delivery or an open case (H-10).
- A semantic duplicate guard that Core does not have (WP-09 G-03); an `instant_in_future` refusal of an event date
  (H-14).
- On a staff page of a dependent: any fact of the upstream application beyond Core's dependency row (UX §3.2).
- A link or unlink control hidden where the page's facts allow it (H-02); a link form for a relation that is already
  linked.
- A "Not linked" warning presented as enforcement, or a page that blocks a submission that Core accepts (H-01).
- A receipt that names a result the operation does not establish, an accepted time, or an instruction to act from an
  older state (C-03; P-02; F-01).
- Earlier facts on a page after an optional read was refused for access (LD-14).
- A truncated field or a dropped indexed row (LD-17; D-10; E-04).
- A read marker on a notice (LD-06); a count shown as "0" when it is unknown (D7).
- A SuperAdmin build, release, handover, delivery-record, link or unlink control (BS B18; UX §2.3).

Recorded as pending Max, not as failures (§0.2 "Pass rule"):

- Enforcement of a declared relation that is not linked: "Not met: waits for Max's decision on P-15 item 1" (H-01; P0
  for release). The declared relations on the staff read are the Kind 1 part of the same item.
- The provider-filing record: "Unmet: waits for Max's decision on P-15 item 2" (H-08).
- Recovery of a released packet before its handover: "Unmet: waits for Max's decision on P-15 item 3" (H-11).

Deferred in WP-10 (each item says where it lands; the run record lists them as "Deferred"):

- SA-02e "Dependency waits" unless WP-06's SA-02 is integrated at WP-10 U6 (Q-W10-07): A52.
- The TA-side requirement of a declared relation (required outcome, exact document type, conditioned actions) and
  Core-owned link and unlink offers (STOP-W10-05; the P-05 extension): A37 and A43 partly met; A101 lists the
  discrepancies.
- The packet's file list, the last build attempt with its failure reason, and the "Replaced" fact (STOP-W10-03): A08,
  A09, A12.
- Command identity and accepted time in receipts (P-10 b, P-02): neutral receipts where §0.2 says so (A40, A54).
- The declared delivery-evidence kind and handover details on the staff reads (STOP-W10-06).
- A business duplicate guard on direct external and physical handover records (STOP-W10-08, a defect note, P2).
- An event-date range check (H-14, parked with P-15).

Not in WP-10 (later or earlier packages):

- `core.authorize_external_act` and `ops.record_act_evidence` for the provider handoff: WP-07.
- `ops.record_official_result`, `ops.record_artifact`, the TA download, `dlv.record_manual_email`,
  `dlv.manual_resend`, OP-07: WP-08.
- `core.report_problem`, `core.resolve_hold`: WP-09.
- Originals commands: WP-12. Incidents: WP-14. Delivery ownership views (V15, V16): WP-19.
- Bulk pages: WP-04, WP-05, WP-18.

## 6. Questions for the architect (ranked)

The independent review ranked Q-03 (its R-01) P0 for release; it is with Max as P-15 item 1 (H-01). The architect
answered (`WP-10.md` §3, §4.1): Q-01 → STOP-W10-05 and the P-05 extension with Max (A37, A43 partly met); Q-02 → P-15
item 2 with Max, interim F-20 wording (A04); Q-03 → P-15 item 1 with Max, interim warnings (A100); Q-04 → H-03 (A11);
Q-05 → STOP-W10-03, P2 parked, and H-06 (A08, A12); Q-06 → H-02 and STOP-W10-05 (A101); Q-07 → design §2.12 (A54);
Q-08 → Q-W10-07 (A52); Q-09 → STOP-W10-08, a defect note (P2) with WP-08 Q-W08-15; Q-10 → Q-W10-10, not requested
(A36 by test); Q-11 → WP-07 F-17 row 6a (A07); Q-12 → H-14, parked; Q-13 → an H-02 listed discrepancy (A41 (4), A101);
Q-14 → Q-W10-01 and CC-14 (A65). The released-packet dead end before the handover (review R-11) is P-15 item 3 (H-11;
A20 (4)). The table keeps the questions as they were asked.

| ID | Rank | Question | Concrete scenario | PM recommendation |
|---|---|---|---|---|
| Q-01 | P1 | The TA case read returns only the relation code, the linked rows and their state. It does not return what the relation requires (required outcome, exact artifact type, conditioned actions, upstream service). V12 and UX §3.2 ask to "show upstream requirement and exact required artifact". Declared dependencies shown to travel agents are in the P-05 widened scope that waits for Max (PLAN §6 Q-L2). | Y links T to E. E becomes "Issued" without a file. Y reads "Issued" on E and "Its official document is not available yet" on T, but nothing tells Y that T needs the e-visa grant document itself, or that it blocks the government submission. Y phones TravelMudra. Likelihood: certain for every dependent; harm medium (confusion and calls, no wrong action). | Build A37 and A43 with Core's states and the honest gap ("partly met"). Route the TA requirement text through the P-05 extension that Max already holds (dependencies are named in its widened set); no new proposal. |
| Q-02 | P1 | UI-PLAN §12.2 and the OP-04 row name "Record provider filing evidence", and WP07-A72 says "its filing evidence is recorded separately". No Core command records the provider's filing as a fact separate from the handoff; the act state `filed_evidenced` of `provider_handoff` is the handoff, and the official result (OP-05) records the provider's result with its reference. | OP1 records H's handoff. The page says the filing evidence is recorded separately. OP1 looks for the place, finds none, and records the provider's filing reference as a second piece of handoff evidence or in a note. The audit then shows a provider filing as handoff evidence, and B04 ("handoff is not filing") fails in the record. Likelihood: certain for every provider case that has a filing reference before its result. | A04: show the §11.3 boundary "Recording the provider's filing evidence is unavailable until the product owner approves a record for it. Owner: product owner." and route the provider's result to OP-05 (official result with its reference). Correct WP07-A72's sentence to name this path at the WP-07 build's alignment. A separate fact (a provider-filing record) is a Kind 2 change for Max through the orchestrator; the lane does not raise it unless the architect judges the boundary insufficient. |
| Q-03 | P1 | Core conditions an action only on a **linked** dependency. A declared relation that the travel agent never links blocks nothing, and the staff case read returns no declared relation that is not linked. | Y submits T without linking E. OP2 sees no prerequisite row on T, confirms readiness and requests authorization for T's government submission; T is filed before E is issued. B22's intent ("only declared service relationships condition another application's action") fails silently, and the filing cannot be undone. Likelihood: medium (one forgotten link); harm high (an irreversible filing). | A37 shows the declared-but-unlinked line on TA-07 now (the TA read has `relations`). For the operator, a Kind 1 read of declared-but-unlinked relations on the staff case (criterion point 2 to be shown: the facts exist in the governing declaration), or a Core rule that a declared relation must be linked before submission or readiness (Kind 2, Max). The architect decides which to route; the TA-08 submit page (WP-03) can repeat the line (a WP-03 page change). |
| Q-04 | P2 | The build offer of `ops.case_work` evaluates `start_operator_work` only; it omits the build command's own guards (editor state `assigned`, mandatory documents, a live, released or handed-over packet). | Q has a built packet. Today's page still offers "Build the packet"; OP1 sends and reads "A packet already exists". Likelihood: high on every built packet; harm low (refused, nothing recorded). | A closed page mapping of Core's facts (packet state of the staff read, `doc.application_evidence`, the offer) with a parity unit test (A11); a Kind 1 build evaluation only if the mapping drifts. |
| Q-05 | P2 | No read returns the packet's file list (`built_from`), the build failure reason, or per-file results of a release. UI-PLAN's OP-04 row expects "Packet released with per-file results". | OP1 sees "Build failed" with no reason and rebuilds three times into `too_large`. Or OP1 cannot say which document version the travel agent received. Likelihood: low; harm low. | Neutral words (A12, A16, A20 (5)); per-file checks shown where Core runs them (the release blockers by requirement; each download). A Kind 1 note (packet manifest and failure code for staff), parked; criterion point 2 not demonstrated (WP-09 G-11). |
| Q-06 | P2 | The TA read's `siblings.linkable` is true when any relation fits; with two relations the page can offer a (relation, application) pair that Core refuses `dependency_undeclared`. No synthetic offering declares two relations. | A later offering declares "needs tourist e-visa" and "needs insurance". Y chooses the insurance relation with the e-visa application and is refused. Likelihood: low today. | Offer the relation first; list the applications per relation only when the declaration has one relation; with several, show Core's refusal in words. A Kind 1 note (linkable ids per relation), parked. |
| Q-07 | P2 | A link and an unlink return the same result shape (application and dependency id) on the TA surface; a direct external record and a manual email record share a shape on OP-06. | An edited receipt address names "Link removed" for a link. Likelihood: low. | Name a result only where a read establishes it (A54): link by the listed id; direct external by the handover kind; unlink neutral. P-10 b serves the command identity later. |
| Q-08 | P2 | SA-02 "Dependency waits" (moved to WP-10 by WP-06) has no read: `core.admin_queue` serves `assistance`, `flags`, `deferrals`; `views.admin_applications` has no pending-reason filter. | A SuperAdmin wants all applications waiting on a related application. An assigned wait belongs to the operator (OP-01 shows it) and an unassigned submitted dependent is in the assignment queue, so the gap is a convenience. Likelihood: low. | Defer the view (A52); a Kind 1 note (a pending-reason filter or a queue kind), parked. |
| Q-09 | P2 | `dlv.record_direct_external` and a physical `dlv.record_handover` have no duplicate guard and no mode, outcome or declaration check. | OP1 records the same courier delivery from two tabs: two immutable records. Or OP1 records a direct external delivery on a TravelMudra-held service and believes the delivery duty is met. Likelihood: medium; harm low (completion still reads Core's flags). | List the existing records before the forms (A25, A31); state what the record does not satisfy only from Core's completion flags (A32); claim no guard (WP-09 G-03). A Core guard is a behaviour proposal (P2 note, not raised). |
| Q-10 | P2 | No synthetic offering declares `direct_external` delivery, two relations, or a relation on a preparation-only upstream. The live proof cannot show completion counting a direct external record or the parked preparation dependency. | — (proof coverage) | Prove them by tests with fixture declarations (A36 (1), A38 (9), A51 (2)); no catalogue writes on `lane-ui` (§0.2 data hygiene). A new synthetic offering only with the architect's approval, because a launch is a global write. |
| Q-11 | P2 | On a preparation-only case with work started and no packet, Core's next action is `record_readiness`, but readiness is refused `packet_not_built`. | OP1 opens Q, reads "Confirm readiness", sends and is refused. Likelihood: certain once per preparation-only case; harm low. | Show Core's next action with the readiness evaluation's blocker and the route "Build the packet" (A07); no invented next step; no Core change. |
| Q-12 | P2 | The handover and direct-external commands accept an event time in the future (no upper bound, unlike the five-minute rule of `ops.record_official_result`). | OP1 types 2027 for the handover date; the immutable record shows a future delivery. Likelihood: low. | The page sends Core's answer and labels the field "the date it happened"; a defect note for the Core batch (P2, parked). |
| Q-13 | P2 | The TA read has no act facts, so the page cannot predict `filing_possibly_occurred` on an unlink. | A returned dependent whose act is unknown: Y removes the link and is refused. Likelihood: very low. | Offer the control by Core's editor rule and show the refusal in words (A41 (4)). |
| Q-14 | P2 | Hosts and register notes disagree: WP-07 design §1.5 carries the packet forms on OP-02 External actions; WP-08 design §1.5 says "old case page (or OP-04)"; the register row of `dlv.record_direct_external` names "OP-04 (provider handoff)"; UI-PLAN §12.2 lists "Record provider handoff" (built in WP-07) and pages OP-05. | The design builds the packet forms twice, or leaves a carried copy on the old page. Likelihood: low. | One host: OP-04p reached from OP-02 External actions for build and release; OP-06 for handover and direct external (A01, A65). Correct the register notes and record that the provider handoff stays WP-07. |

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
| V12 result (steps; where shown) | |
| P-15 decisions in force at the run (items 1 to 3) | |
| Deferred items (reference each) | |
| Partly met items (decision reference) | |
| Open findings (ID, rank, scenario) | |
| Signed by (role and name) | |

Result per item (Pass, Fail, Blocked, Partly met, Deferred or Not run; evidence reference; note):

| ID | Result | Evidence | Note |
|---|---|---|---|
| WP10-A01 | | | |
| WP10-A02 | | | |
| WP10-A03 | | | |
| WP10-A04 | | | |
| WP10-A05 | | | |
| WP10-A06 | | | |
| WP10-A07 | | | |
| WP10-A08 | | | |
| WP10-A09 | | | |
| WP10-A10 | | | |
| WP10-A11 | | | |
| WP10-A12 | | | |
| WP10-A13 | | | |
| WP10-A14 | | | |
| WP10-A15 | | | |
| WP10-A16 | | | |
| WP10-A17 | | | |
| WP10-A18 | | | |
| WP10-A19 | | | |
| WP10-A20 | | | |
| WP10-A21 | | | |
| WP10-A22 | | | |
| WP10-A23 | | | |
| WP10-A24 | | | |
| WP10-A25 | | | |
| WP10-A26 | | | |
| WP10-A27 | | | |
| WP10-A28 | | | |
| WP10-A29 | | | |
| WP10-A30 | | | |
| WP10-A31 | | | |
| WP10-A32 | | | |
| WP10-A33 | | | |
| WP10-A34 | | | |
| WP10-A35 | | | |
| WP10-A36 | | | |
| WP10-A37 | | | |
| WP10-A38 | | | |
| WP10-A39 | | | |
| WP10-A40 | | | |
| WP10-A41 | | | |
| WP10-A42 | | | |
| WP10-A43 | | | |
| WP10-A44 | | | |
| WP10-A45 | | | |
| WP10-A46 | | | |
| WP10-A47 | | | |
| WP10-A48 | | | |
| WP10-A49 | | | |
| WP10-A50 | | | |
| WP10-A51 | | | |
| WP10-A52 | | | |
| WP10-A53 | | | |
| WP10-A54 | | | |
| WP10-A55 | | | |
| WP10-A56 | | | |
| WP10-A57 | | | |
| WP10-A58 | | | |
| WP10-A59 | | | |
| WP10-A60 | | | |
| WP10-A61 | | | |
| WP10-A62 | | | |
| WP10-A63 | | | |
| WP10-A64 | | | |
| WP10-A65 | | | |
| WP10-A66 | | | |
| WP10-A67 | | | |
| WP10-A68 | | | |
| WP10-A69 | | | |
| WP10-A70 | | | |
| WP10-A71 | | | |
| WP10-A72 | | | |
| WP10-A73 | | | |
| WP10-A74 | | | |
| WP10-A75 | | | |
| WP10-A76 | | | |
| WP10-A77 | | | |
| WP10-A78 | | | |
| WP10-A79 | | | |
| WP10-A80 | | | |
| WP10-A81 | | | |
| WP10-A82 | | | |
| WP10-A83 | | | |
| WP10-A84 | | | |
| WP10-A85 | | | |
| WP10-A86 | | | |
| WP10-A87 | | | |
| WP10-A88 | | | |
| WP10-A89 | | | |
| WP10-A90 | | | |
| WP10-A91 | | | |
| WP10-A92 | | | |
| WP10-A93 | | | |
| WP10-A94 | | | |
| WP10-A95 | | | |
| WP10-A96 | | | |
| WP10-A97 | | | |
| WP10-A98 | | | |
| WP10-A99 | | | |
| WP10-A100 | | | |
| WP10-A101 | | | |
| V12 proof (to its boundary) | | | |
