# WP-10 acceptance checklist: Service shapes and dependency

| Field | Value |
|---|---|
| Lane | `ui-revamp-2026-10-12` |
| Work package | WP-10 Service shapes and dependency (UI-PLAN §12.2; lane PLAN §3) |
| Author | Principal Product Manager (Claude subagent), 13 October 2026 |
| Decision owner | Principal Technical Architect of the lane (LD-12) |
| Status | Draft. Step 1 of lane PLAN §3, written before the design. Not run. Where the later design names a path or a word differently, the design governs the name and this checklist keeps the observable result. |
| Product base | lane branch `ui-revamp-2026-10-12` at e9e96e3; internal records at 7e55fe4 |
| Installation | `lane-ui`: staff http://127.0.0.1:4652 (operator pages under test; SuperAdmin pages as set-up and observation); edge http://127.0.0.1:4650 (travel-agent pages under test and proof set-up) |
| Writing style | ASD-STE100 at about 75% (STY-20261003-01) |

## Corrections

None yet. This is the first version. The alignment to `WP-10-design.md`, to the architect's decisions (`WP-10.md` §3)
and to the independent review will be recorded here as a table of changed rows, as in `WP-07-acceptance.md` and
`WP-08-acceptance.md`.

## Lessons applied from the WP-01 to WP-09 corrections

| Lesson | Source | Where this checklist applies it |
|---|---|---|
| Identical replay, changed-content conflict, browser Back, rejected-form refresh and lost acknowledgement are five separate cases; a business duplicate with a new key and a raw stale envelope are two more | WP-01 A-02, A-03, A-06; WP-03 R-12; WP-06 D-12 | §0.2 "Replay terms"; one "Nth time" item per command (A13, A22, A29, A35, A45); the matrix A57 |
| A refused command leaves no operation record; the refusal shows only on the re-rendered form | WP-01 A-08; WP06-A104 | §0.2; A56; every refusal item says "nothing is recorded" and checks it by delta |
| A receipt names the command only when the operation's resource, returned id and summary (or a read by the returned id) establish it; otherwise a neutral "Request recorded" with facts labelled "Current"; no accepted time | WP-01 A-04, P-02; WP-06 D-02; WP-09 G-01 | §0.2 "Receipts"; A54 (per-command rule); A40 and A32 (shapes shared with another command) |
| No receipt or status read tells anyone to act; a historical receipt keeps the historical fact and shows current facts as "Current" | WP-07 F-01 (P0 class fix); WP-09 G-10 | A55 |
| Act-kind-specific words: a provider handoff establishes handoff only and names the separate provider-filing evidence path | WP-07 F-06 | A04, A06; Q-02 |
| Delivery wording by channel; completion rows show only Core's flags; missing duties are qualified | WP-08 E-05, E-06 | A30, A32, A36 |
| Bans are scoped by fact and channel ("Delivered" only for a recorded direct external delivery; a download reads "Sent in full") | WP-08 E-12 | §0.2 "Delivery words"; A30 |
| Freshness: "Read at [time] IST" for an authoritative read; the lag form for a projection | LD-08 | §0.2; A49 (OP-01), A67 (history) |
| A page shows only facts that a read returns; a missing fact is "Unavailable" or the item is "partly met"; gaps are deferred, not failures | WP-02 B-06; WP-03 R-11; WP-06 D-04, D-05 | §0.2 "Facts"; §5 "Deferred"; A16, A37, A43; Q-01, Q-05 |
| A state is labelled for the action it was evaluated for | WP-06 D-05 | A07 (the readiness evaluation's blocker under Core's next action), A17 |
| A request that Core refuses is shown as Core answers it; the page does not change the input to force acceptance | WP-06 D-09 | A10, A21, A27, A38 |
| Form rows within Core's limits only; every filled row reaches Core; never a silent truncation | WP-06 D-10; WP-08 E-04; WP-09 G-07 | A26 (evidence rows 1 to 5), A31, A34 |
| A page MUST NOT block a command that Core accepts, and MUST NOT offer one that Core refuses | WP-07 D-W07-16; WP-03 F-W03-11; WP-09 A06 | A11, A40, A42; Q-04, Q-06, Q-13 |
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

## 0. Inputs and conventions

### 0.1 Inputs

| Ref | Source | Identity | Sections used |
|---|---|---|---|
| UX | `TARGET_PRODUCT_UX_SPEC.md` (2026-10-05) | SHA-256 b45186887cdc37f6… | §2.1, §2.2, §2.3, §3.1 steps 6 to 8, §3.2 (Preparation-only, Third-party filed, Dependency), §3.3, §4.2, §5.1, §5.3, §7.4, §7.5, §8.3, §12 V12 |
| BS | `BUILD_SPEC.md` (r2) | SHA-256 4a6fd90657b0723f… | B04, B12, B21, B22, B24, B30, B31, B33, B35, B46 |
| DE | `../ui-plan-from-specs-2026-10-10/DECISIONS-2026-10-10.md` | SHA-256 a2c935f72cd4f5e9… | §1.5 (OC-09 closed: Release packet and Record packet handover are available actions) |
| PL | `../ui-plan-from-specs-2026-10-10/UI-PLAN.md` | SHA-256 75256bfd7e6d929a… | §3.2 TA-07, §3.3 OP-02 OP-04 OP-05 OP-06, §4.2 (Preparation-only, Third-party filed, Dependency), §5.3 (OP-04 table), §6, §7 (rows Release packet / Record packet handover, Record provider handoff / filing evidence), §8, §10, §11, §12.2 WP-10, §13 (OC-09, B-06) |
| CC | `COMMAND-COVERAGE.md` (this folder) | SHA-256 b882aa55386a69fd… | §3 rows of the six WP-10 commands; §5.1 WP-10; §5.3 (`core.link_dependency`, `core.unlink_dependency`); §5.4 (operator case page → OP-04); §6 CC-06 |
| LP | `PLAN.md` (this folder) | SHA-256 3bcad1d25e79534f…; internal 7e55fe4 | §3, §4 (LD-02, LD-03, LD-05, LD-07, LD-08, LD-11, LD-12, LD-14), §6 (Q-L2), §7 (#4, #23), §8 (S-08), §9 |
| PR | `PROPOSALS.md` | SHA-256 ac642225928c3aea… | P-05 (widened scope "dependencies" pending Max), P-09, P-10 b, P-13 |
| W3 | `WP-03-design.md`; `WP-03-acceptance.md` | SHA-256 d4d40cb1d18a7bc2…; 13ad0770af3f6c42… | design §1.5 (link and unlink carried to WP-10; unlink has no host), §2.7 item 11, §3.4, STOP-W03-03 (no service mode on the TA read); acceptance §1.2, A106 |
| W6 | `WP-06-design.md`; `WP-06-acceptance.md` | SHA-256 327f580c1820bf40…; 7a1d82e48fde6e93… | design §2.2.5 and acceptance §5 ("Dependency waits" view goes to WP-10); WP06-A64, A109 |
| W7 | `WP-07.md`; `WP-07-design.md`; `WP-07-acceptance.md` | SHA-256 64247aa81b4b98d7…; 4c877b4be85dc5e7…; 647c7b1d6af0887c… | §3, §4.1 F-01, F-06, §4.2 F-13, F-14; design §1.5 (carried packet forms), §2.4.2 (declared prerequisites row), §2.5.2 (External actions tab), §2.7, §2.8; WP07-A14, A18, A26, A37, A50, A72, A101, A117, A164, A167; Q-14 |
| W8 | `WP-08.md`; `WP-08-design.md`; `WP-08-acceptance.md` | SHA-256 605e47dcd84456d4…; 7a74a46cc1480906…; 4d6504be7f20ebe7… | E-05, E-06, E-12; design §1.5, §2.1 (preparation-only state), §2.3 item 6, §2.5 (TA-07r states), §2.11 (Handover row), §2.12, §7.2; WP08-A02, A03, A35, A47, A51, A72, A115, A117, A118; §0.2 "Delivery and file words" |
| W9 | `WP-09.md`; `WP-09-acceptance.md` | SHA-256 97074922067b5db7…; 5118a3ab3e083939… | §4.1 G-01, G-03, G-05, G-07, G-09, G-10, G-11; format, §0.2, §0.5 |
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
- **Service shape words.** Staff: the WP07-A14 band words ("TravelMudra files"; "Preparation only"; "Filed by a
  declared provider: [label]"). A provider handoff is "handoff" or "handed over", never "filed" (F-06). A packet is
  "Preparation packet". Packet states: `building` "Building", `built` "Built [time] IST", `build_failed` "Build
  failed", `released` "Released [time] IST", `superseded` "Replaced: never released". Outcome words of UI-PLAN §11.2;
  `prepared_and_handed_over` "Prepared and handed over" always with "No government result is claimed."
- **Delivery words.** WP-08 design §2.11 governs, with E-06 and E-12: a packet handover reads "Packet handover:
  system-verified, sent in full to the travel agent's download" or "Attributed record, not system-verified"; a direct
  external record reads "Delivered directly by an external party: no result held by TravelMudra"; "Delivered" appears
  only there; a download reads "Sent in full"; "Received" is never used for a delivery fact; no "through Send result"
  for a packet or a direct external delivery.
- **Dependency words.** Staff (OP-02): "[relation]: needs the outcome [outcome] [and an eligible [artifact type]
  document]" from the staff read; states "Not met: outcome awaited" (`waiting`), "Not met: result recorded, document
  missing" (`unmet_missing_evidence`), "Met" (`met`), "Cannot be met: incompatible outcome" (`failed_incompatible`).
  TA (TA-07): "Waiting for the result of [your application]", "[Your application] has its result. Its official document
  is not available yet.", "Met", "Cannot be met: [your application] ended with a result this application cannot use."
  The relation name is the declared code made readable. No sibling fact shows on a staff page beyond Core's dependency
  row.
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
- **Paths (LD-03).** Existing paths and form actions stay. New pages get the paths that the design names. Pages:
  OP-02 `/ops/applications/:applicationId` (`?tab=`; External actions and Delivery & originals tabs of WP-07); OP-04p
  the packet task (path named by the design; actions `/ops/applications/:applicationId/packet/build` and
  `…/packet/release` stay); OP-04a and OP-04b `/ops/applications/:id/acts?act=provider_handoff` and
  `…/acts/:authorizationId` (WP-07); OP-05 `/ops/applications/:id/outcome` (WP-08); OP-06
  `/ops/applications/:id/delivery` (WP-08; actions `…/handovers` and `…/direct-external` stay); OP-07
  `/ops/applications/:id/completion` (WP-08); OP-01 `/ops/work`; TA-07 `/ta/applications/:applicationId` section
  "Related applications" (actions `…/dependencies` and `…/dependencies/:dependencyId/unlink` stay); TA-07d
  `…/delivery`, TA-10 `/ta/notices`, TA-07x `…/history` (WP-08). An item names the page; the run record names the
  path used.
- **Pass rule.** WP-10 passes when every `L` item passes on `lane-ui` at the integrated ref, every `T` item has a
  named passing test at that commit, every axe item passes, and the V12 proof of §3 passes, except the explicitly
  deferred items of §5. The run record lists each deferred item as "Deferred" with its reference, not as "Fail". An
  item that the architect marks "partly met" by a recorded decision passes with that note. A failed item becomes a
  finding ranked P0, P1 or P2 with its scenario (PRI-20260930-01).
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
| Itinerary (Q, optional) | `plainPdf('SYNTHETIC TRAVEL ITINERARY WP10 [stamp]')` | Shows that an optional document is not in the packet |
| E's result file | A synthetic text PDF in the form of `resultPdf` of `test/system/case-work.test.ts`, made by the WP-08 result-document generator under `test/` (`WP-08.md` §3, PM Q-06): "REPUBLIC OF SYNTHETICA", "ELECTRONIC VISA GRANT", "SURNAME SYNWPTEN", "GIVEN NAMES DEV", "PASSPORT [D's number]". `plainPdf` of `samples.ts` writes one line only and cannot carry the name tokens and the number that the association rule needs | E's eligible `evisa_grant` artifact (meets T's prerequisite) |
| Payments | "Payment received" for Q, H, E and T, evidence reference `SYN-V10-[stamp]-[letter]` | Gate 1 and Gate 2 pass on payment; no exception is used |
| Evidence values | External references `SYN-V10-[stamp]-[letter]-[n]`; notes and reasons "WP10 [stamp] …" | Handover, direct external, act evidence, outcome evidence |

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
| OP-04p Packet (preparation-only) | 4652, path named by the design; reached from OP-02 External actions | Build the packet; build again; release the packet; the packet states; the release review with Core's blockers |
| OP-06 Delivery, section "Other delivery records" | 4652 `/ops/applications/:id/delivery` (WP-08 page) | Record a packet or physical handover; record a direct external delivery; the records listed before the forms. The manual email and the resend stay WP-08 |
| OP-02 Application workspace | 4652 `/ops/applications/:id` (WP-07 page) | External actions: the packet section replaces the carried forms; the provider-filing evidence line (Q-02). Work: the declared-prerequisite words with the exact declared evidence. Delivery & originals: "This service holds no originals" for preparation-only |
| TA-07 Application workspace, section "Related applications" | 4650 `/ta/applications/:id` | Link and remove a link (rebuilt from the carried section; the unlink control is new); dependency states; the declared-but-unlinked line; the preparation-only shape line from the packet fact |
| TA-07d, TA-10, TA-07x | 4650 (WP-08 pages) | Observation and words only: handover and direct external rows, the packet notice, history lines |
| OP-04a, OP-04b, OP-05, OP-07, OP-01 | 4652 (WP-07 and WP-08 pages) | Set-up and observation only (handoff, official result, completion flags, work views) |
| SA-02 "Dependency waits" | 4652 (PL SA-02) | Deferred (Q-08) |
| Old operator case page; case-work page; today's TA application page | 4652, 4650 | Only: the WP-10 forms leave them; links replace them; every other carried form stays |

Read models: Operator case (`core.ops_case`, `ops.case_work`, `doc.application_evidence`), Delivery page (`dlv.delivery_page`,
staff), Packet handovers (`dlv.packet_handovers`, staff lists), TA application case (`core.ta_application`), TA delivery
facts (`dlv.delivery_facts`), SuperAdmin case (`core.admin_case`), Assigned work queue (`core.ops_work`, `views.ops_work`),
TA history (`views.ta_history`, projection), Notices (`dlv.notices`), Operation (`core.operation`).

### 1.2 Command coverage (CC §5.1: 6 WP-10 commands)

| # | Command | Route id today | Page | Items |
|---|---|---|---|---|
| 1 | `ops.request_packet_build` | `ops.case_work.packet_build` | OP-04p (build, build again) | A07 to A15 |
| 2 | `core.release_packet` | `ops.applications.release_packet` | OP-04p (available action under its existing preconditions, LD-05; per-file recheck at release and at each download) | A16 to A23 |
| 3 | `dlv.record_handover` | `ops.delivery.handover` | OP-06 (packet handover fact; physical handover) | A24 to A30 |
| 4 | `dlv.record_direct_external` | `ops.delivery.direct_external` | OP-06 (direct external delivery record) | A31 to A36 |
| 5 | `core.link_dependency` | `ta.applications.link_dependency` | TA-07 Related applications; the exact declared evidence on OP-02 | A37 to A39, A42 to A46; A47 to A51 (exact declared evidence) |
| 6 | `core.unlink_dependency` | `ta.applications.unlink_dependency` | TA-07 Related applications (new control) | A40 to A42, A45 |

All of them also: A53 (shell), A54 (receipt checked against the operation), A55 (no instruction to act), A56 (no record
for a refusal; lost acknowledgement), A57 (replay matrix), A58 and A59 (refusal text), A60 (LD-14), A61 to A66 (role
controls, labels, read grant and support view, storage, carried forms, isolation), A67 (notices and history).

UI-PLAN §12.2 names four actions for WP-10. "Release packet" and "Record packet handover" are commands 2 and 3.
"Record provider handoff" is `core.authorize_external_act` with `provider_handoff` and its evidence, built in WP-07
(Q-14 there; WP07-A72, A164); WP-10 observes it in V12. "Record provider filing evidence" has no Core command (Q-02;
A04).

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
| OP-04p build | Not built A07; building and built A08; replaced A09; build failed A12; not this shape A05; reassigned A15 | — (no field) | A10 | A08, A09 | A13 (5) | A10 (10), A14 |
| OP-04p release | Review A16; unavailable A17; released A19; S4 (documents read unavailable) A60 | — | A17, A20, A21 | A19 | A22 (5) | A18, A21 (3), (4) |
| OP-06 handover | Waits for the download A24; offered A25; recorded A26; physical A28 | A26 | A27 | A26, A28 | A29 (5) | — (no revision; A29) |
| OP-06 direct external | Form with earlier records A31; recorded A32 | A32 | A34 | A32 | A35 (5) | — (no revision; A35) |
| TA-07 Related applications | None linked, declared A37; waiting, document missing, met, cannot be met A43; assigned A42; returned A42; support view A63 | A38 (1) | A38, A41 | A39, A40 | A45 (5) | A38 (11), A46 |
| OP-02 declared prerequisite | Not met, document missing, met A47; readiness blocked A48; S4 A60 | — | A48 | — | — | — |
| TA-07 and TA-07d of Q and H | Shape line, packet, outcome A02; direct external row A33 | — | — | — | — | — |

### 1.4 Specification scenarios

| Scenario | What WP-10 shows | Items |
|---|---|---|
| V12: third-party handoff is not filing | The handoff words (WP-07, observed); the provider-filing evidence path stated, not invented; no packet command for H | A04, A05, A06; §3 Part H |
| V12: preparation-only has packet outcome / no originals / no claimed government result | Build, release, the TA's download (WP-08), the packet handover that records "Prepared and handed over"; no originals; no government result claimed | A01 to A03, A07 to A30; §3 Part Q |
| V12: dependency needs exact declared evidence | Link on TA-07; the required outcome and the exact artifact type on OP-02; readiness refused for the outcome alone and accepted only with the eligible `evisa_grant` | A37 to A52; §3 Parts D1, D2 |
| UX §3.2 Dependency: "without granting sibling visibility" | No upstream fact on the dependent's staff page; another operator gets SH-02 on the upstream | A47, A50 |
| B22: packet handover does not prove a government-result prerequisite | A link from a government-result relation to a preparation-only upstream is a parked boundary | A38 (9), A51 |
| B24, B31: direct external delivery records provenance and the absence of a TravelMudra-held result | The OP-06 record and the TA row; completion counts it only where declared | A31 to A36 |
| V17 (packet part): a download alone is not the delivery evidence | The delivery prerequisite of Q is met by the packet handover record, not by the download | A36; §3 V12-Q10 |
| V15 (part): no SuperAdmin build, release, handover or delivery-record control | SuperAdmin pages hold facts only | A61 |
| V24 (keyboard and phone) | The WP-10 tasks by keyboard and at 390 px | A68 to A79 |

## 2. Acceptance checklist

### 2.1 Service shapes (V12)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP10-A01 | Operator (OP1) | OP-02 External actions of Q, H and E (§3 V12-Q1, V12-H1) | Read the tab of each. | The band and the mode sentence are WP07-A14 and WP07-A50 (not tested again here). Q: in place of the carried packet forms, one section "Preparation packet" with the packet state from Core ("Not built", "Building", "Built [time] IST", "Build failed", "Released [time] IST") and one link to OP-04p ("Open the packet"); no external act, no Gate 2, no fee line. H and E: no packet section and no packet link. H: the WP-07 handoff section and the line of A04. Freshness "Read at [time] IST". | L | UX §3.2, §5.3; BS B04; PL §3.3 OP-02; WP-07 design §2.5.2; `staff-views.ts` (`packet` for preparation-only only) |
| WP10-A02 | TA (Y); test | TA-07, TA-07d, TA-10 and TA-07x of Q at each step of §3 Part Q | Read all text. | No text says that TravelMudra files Q, that a government act happened, or that a government result is awaited or claimed. Before the release, TA-07 shows no shape line (the TA read returns no service mode: P-09). After the release (a packet download exists; Core builds packets only for preparation-only services): "TravelMudra prepared this packet for you. TravelMudra does not file this application with the government and claims no government result." The download itself is WP08-A72. After the handover: Outcome "Prepared and handed over" and "No government result is claimed."; Lifecycle as Core reports it. Never "Issued", "Filed", "Delivered" or "Received" for Q. A unit test shows that the shape line keys on the packet fact and on the outcome only. | L+T | UX §2.2, §3.2 (Preparation-only); BS B04, B21; WP-08 design §2.5; `work.ts` (`service_mode_not_applicable`); STOP-W03-03 |
| WP10-A03 | Operator (OP1); TA (Y); harness | OP-02 Delivery & originals of Q; TA-07 of Q (§3 V12-Q10) | Read. Harness: post an original receipt on Q. | OP-02: "This service holds no originals." (Core's offer `preparation_only_holds_no_originals`); no original receipt, movement or return control; no custody summary rows. TA-07: no originals section (the TA read returns `originals` null). The hand-made post is refused (`preparation_only_holds_no_originals`) in words; nothing is recorded (original count delta 0). OP-09 itself is WP-12. | L | UX §3.2; BS B04, B30; `originals.ts:102`; `operations-work.ts` binding (`recordOriginal`) |
| WP10-A04 | Operator (OP1); TA (Y) | OP-04b, OP-02 External actions and TA-07 of H after the handoff evidence (§3 V12-H3) | Read. Look for a way to record the provider's filing evidence. | The handoff texts are WP07-A72 and A164 ("Handed over: evidence recorded"; never "Filed"). WP-10 adds the path for the provider's filing evidence as decided at Q-02. Until that decision the page shows the §11.3 boundary: "Recording the provider's filing evidence is unavailable until the product owner approves a record for it. Owner: product owner." and the place where the provider's result is evidenced: "When the provider's result arrives, record it as the official result with its reference" → OP-05 (WP-08). No control records a provider filing as a second handoff evidence, as act evidence or as a note. WP07-A72's sentence "its filing evidence is recorded separately" names this path, not a page that does not exist. The run record names the decision of Q-02. | L | UX §3.2 (Third-party filed: "Handoff, provider filing evidence, later follow-up, delivery and closure remain separate"); BS B04; PL §4.2 Third-party step 10, §5.3 OP-04 row; `WP-07.md` F-06; `writers.ts:359-366`; Q-02 |
| WP10-A05 | Operator (OP1); harness | OP-02 of H and E (§3 V12-H1) | Harness: post a packet build on H and on E; post a release on H. | No packet section on either. Build: refused (`service_mode_not_applicable`): "This step does not apply to this kind of service." Release: refused (`control_blocked`, with `service_mode_not_applicable` among Core's blockers, in words); nothing is recorded (packet and release counts delta 0). | L | BS B04; `work.ts` (mode check); `controls.ts:453-454` |
| WP10-A06 | Test | Shape words renderer | Render OP-02, OP-04p, OP-06, TA-07 and TA-07d for each service mode and each outcome that the mode allows. | `prepared_and_handed_over` words appear only for preparation-only; packet words only where a packet exists; for a third-party service every act, evidence and delivery text uses handoff words and never claims a filing (shares the F-06 assertions of WP07-A164); no page claims a government result for preparation-only. | T | `WP-07.md` F-06; BS B04; `decl.ts` `outcomeApplicable` |

### 2.2 OP-04p Build the packet (`ops.request_packet_build`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP10-A07 | Operator (OP1) | OP-04p of Q after the start of work, before any build (§3 V12-Q1) | Read the page from the top. | Order: scope, evidence, effect, action. Scope: application reference, applicant, service, "Preparation only: the work ends in a packet that the travel agent receives." Evidence: "Packet: Not built"; the mandatory documents of this application as read now (CMP-02 rows: passport, photograph, each with its verdict); the optional itinerary listed as "Not in the packet: optional document". Effect of "Build the packet": "TravelMudra builds one packet from the accepted version of each mandatory document of this application. Building takes a short time; this page shows when it is built. Building sends nothing to the travel agent." Action "Build the packet". Release part: "Release the packet is unavailable until the packet is built." (Core's `packet_not_built`, from the release evaluation). Action panel: Core's next action ("Confirm readiness") with the readiness evaluation's blocker "The packet is not built." and the route "Build the packet" (Q-11). Freshness "Read at [time] IST". | L | UX §3.2, §5.3; PL §5.3 OP-04 row; `work.ts` (mandatory only); `controls.ts:597-605`; `derived.ts:398-401` |
| WP10-A08 | Operator (OP1) | OP-04p of Q (§3 V12-Q2) | Select "Cancel". Then build. Reload until the state changes. | "Cancel" returns to OP-02; nothing is recorded. After the send: C3 receipt "Packet build requested" (named: on the operator surface only this command returns a packet id with a step id). Current: "Packet: Building". No text says "Packet built". The receipt has no accepted time. A "Check again" link reloads; the page later shows "Built [time] IST" and the packet size, or "Build failed" (A12). The polite region announces the receipt; focus does not move. | L | CMP-08; WP-06 D-02; P-02; `work.ts` (`packetId`, `stepId`); `tasks/build-packet.ts` |
| WP10-A09 | Operator (OP1), two tabs | OP-04p of Q with a built packet (§3 V12-Q3) | Read "Build again". Tab 1: open it. Tab 2: build again. After tab 2's packet is built, send tab 1. | "Build again" is a secondary action with the effect: "Building again replaces this packet. A replaced packet is never released. If you confirmed readiness on this packet, confirm it again before the release." Tab 2: receipt "Packet build requested"; the earlier packet reads "Replaced: never released"; the new one "Building", then "Built". Tab 1: refused with the current state in words ("A packet is already built or being built for this application.", `packet_exists`; tab 1 named the replaced packet); the page re-reads and shows the new packet; nothing is recorded (packet count delta 0 for tab 1). | L | `packets.ts` (`requestPacketBuild` supersede rules); `derived.ts` `readinessBasis` (`packet`) |
| WP10-A10 | Operator (OP1, OP2, `operator-3`), SuperAdmin; harness; test | OP-04p and the build action | (1) Harness: build on Q before OP1 starts work (§3 V12-Q0). (2) Harness: a new-key build while a packet is building or built, without a supersede. (3) Harness: build after the release, once with the released packet as the supersede and once without (§3 V12-Q6). (4) Test: supersede a handed-over packet. (5) Test: a supersede id while no packet is live (after a build failure). (6) Test: Q returned to the travel agent, and help in progress. (7) Test: a mandatory document missing or blocked. (8) OP2, `operator-3` and SA2 open OP-04p of Q and post a build. (9) Test: a version of another group in the request (unit). (10) Harness: a raw envelope with an older application revision. | (1) "Operator work has not started." (`operator_work_not_started`). (2) "A packet already exists for this application." (`packet_exists`). (3) With the supersede: "The packet was already released." (`packet_released`); without it: `packet_exists` in words. (4) `packet_handed_over` / `packet_released` in words. (5) C5 from the re-read (`stale_revision`). (6) `hold_returned_to_ta`: "The application is with the travel agent."; `hold_assistance_in_progress` in words. (7) `mandatory_document_missing` naming each requirement ("Passport: missing"). (8) OP2: SH-02; `operator-3`: the read-only page with no build control and the post refused as not found; SA2: no build control on any SuperAdmin page and the post refused. (9) `input_invalid`. (10) C5 with the changed facts. Nothing is recorded in each case (packet count and step count delta 0). | L ((1), (2), (3), (8), (10)) + T | `work.ts`; `packets.ts`; `policy.ts` (`operator.build_packet`: assigned operator) |
| WP10-A11 | Test | The offer of "Build the packet" and "Build again" | Unit test over fixtures: packet state none, building, built, build failed, replaced, released, handed over; work started or not; editor state; mandatory documents satisfied or not; mode. Run the page's mapping and `ops.request_packet_build` for each. | The page offers "Build the packet" (no live packet) or "Build again" (built, not released) exactly where Core accepts; where Core refuses, the state's own text and no control. The mapping is a closed table of Core facts (the packet state of the staff read, `doc.application_evidence` and the offer); it does not rely on today's offer alone, which evaluates `start_operator_work` only (Q-04). Core decides at send. | T | WP-03 design F-W03-11; WP09-A06 class; `operations-work.ts:146-147`; Q-04 |
| WP10-A12 | Test; operator | OP-04p of a packet whose build failed (fixtures: `evidence_changed`, `too_large`, `assignment_changed`) | Read. Build the packet. | "Build failed. The reason is not shown on this page." (no read returns the code, Q-05); no text claims that a packet exists or can be released; release unavailable with `packet_not_built`; "Build the packet" offered again with no supersede; the new build is accepted. | T | `tasks/build-packet.ts` (`fail`); `packets.ts` (live packet states); Q-05 |
| WP10-A13 | Operator (OP1); harness | Build, the Nth time | Replay terms 1 to 5 on A08. Term 2 adds a supersede id. Term 3: press Back after the receipt; harness: a new-key send from the reloaded page. Term 4: the refusal of A10 (1), then the build after the start of work. | (1) The original receipt and packet id; one packet; one work step. (2) Refused as a used form; nothing recorded. (3) Back reloads OP-04p with "Building" or "Built" and "Build again" only when built; the new-key send without a supersede is refused `packet_exists` and records nothing. (4) Recorded once. (5) C4; no new build is offered there. | L+T | PL §7 K-STD; BS B35; W1 A-02, A-08 |
| WP10-A14 | Operator (OP1), two tabs | OP-04p of Q before the first build (fixture or a later run) | Tab 1 and tab 2 open the page. Tab 2 builds. Tab 1 builds. | Tab 1 is refused `packet_exists` with the current state ("A packet is being built for this application.") from the re-read; one packet exists; nothing more is recorded. | L | UX §3.3; BS B19, B35 |
| WP10-A15 | Test | Reassignment while a packet builds | Request a build; reassign Q from OP1 to OP2 before the task runs. OP1 opens OP-04p and posts a build. OP2 opens OP-04p. | The task ends the packet `build_failed` with `assignment_changed` (no blob referenced). OP1: SH-02 on the page and on the post. OP2: "Build failed" and "Build the packet"; OP2's build is accepted. | T | `test/delivery/packets-handover.test.ts` "T-15-47 … cancels the build as revoked; the packet fails with assignment_changed and no blob is referenced to it"; WP-09 G-09 |

### 2.3 OP-04p Release the packet (`core.release_packet`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP10-A16 | Operator (OP1) | OP-04p release review of Q (built; readiness recorded by OP1; §3 V12-Q5) | Read. Select "Cancel". | Scope: application, service, "Preparation only". Evidence: "Packet: Built [time] IST", size; "Readiness: Recorded by you [time] IST" (Core's validity); open holds; declared prerequisites (none for Q); "Documents of this application now" (CMP-02 rows) with "The packet was built from the accepted version of each mandatory document. When you release it, TravelMudra checks again that these documents did not change since the build." No list that claims to be the packet's contents (Q-05). Effect: "Releasing lets the travel agent download the packet from their application page and tells them in a notice. TravelMudra does not file this application and claims no government result. A packet is released once. Each download is checked again, file by file." No "send", no email, no Gate 2, no fee, no exposure line. No B46 or "not decided" boundary (LD-05; DECISIONS §1.5). Button "Release the packet"; "Cancel" returns and records nothing. | L | UX §3.1 step 6, §3.2; BS B04, B12; PL §5.3 OP-04 row; LD-05; `acts.ts` (`releasePacket`, notice `packet_available`) |
| WP10-A17 | Operator (OP1); test | OP-04p release part in each blocked state | Read the page in each state (L: not built §3 V12-Q1; problem report open §3 V12-Q5; test: the rest). Harness (test): a saved release envelope for each state. | "Release the packet" is offered only when Core's `releaseOffer` allows it. Otherwise the page shows no release form and each blocker in words with its owner and route (CMP-10, CMP-15): `packet_not_built` → "Build the packet"; building → "Check again"; build failed → A12; `packet_stale` → "The packet no longer matches the current documents. Build it again."; `readiness_missing` and `readiness_stale` → "Confirm readiness"; `readiness_held` and the holds (`hold_problem_reported`, `hold_flagged_to_superadmin`, `hold_returned_to_ta`, `hold_assistance_in_progress`) → the hold and its owner; `readiness_previous_operator` → the SA-09 readiness exception for the packet release (WP07-A167) as a link; `deferral_active`; `travel_date_recheck_pending`; document codes per requirement; dependency codes of a relation that conditions `release_packet` (fixture); `renewed_authority_pending` or `_declined`; `transition_pending`; `protection_mark_active`; `packet_released`; `outcome_already_recorded`; `withdrawal_accepted`. The saved envelope of each state is refused with that blocker; nothing is recorded. | L+T | UX §2.2 (blocked action types), §7.4 (action panel); BS B20; `controls.ts`; WP-09 G-05 |
| WP10-A18 | Operator (OP1), two tabs; TA (Y) | OP-04p release review of Q (§3 V12-Q5) | Tab 1: open the release review. Y reports a problem on Q (TA-07, WP-09). Send tab 1. Reload. | Tab 1: C5 (CMP-14) "Changed since you opened this page" with the changed fact (problem report open since [time] IST); the report moved the hold revision (`stale_revision`); nothing is recorded. The reloaded page offers no release and shows "On hold: problem report" with the route to resolve it (WP-09). Setup after the step: OP1 resolves the report and confirms readiness again. | L | UX §3.3; BS B18, B19; `acts.ts` (`expectedHoldRevision`); PL §4.2 R1 |
| WP10-A19 | Operator (OP1); TA (Y) | OP-04p of Q (§3 V12-Q6) | Release the packet. Read OP-04p, OP-02, OP-01 and Y's TA-10. | C3 receipt "Packet released" (named: only this command returns a packet release id). Current: "Packet: Released [time] IST"; "Next: the travel agent downloads the packet. You record the handover after their download." (Core's next action `record_delivery` and the handover step `ta_download`). No "Delivered", "Sent", "Handed over" or "Completed". No readiness prompt after the release (Core's answer is `packet_released`, not readiness). OP-01: Q moves by the WP-07 mapping to the travel agent's step (delta). TA-10: one notice "Your preparation packet is ready to download.", linked to Q, with no acknowledgement and no read marker (delta + 1). | L | LD-05, LD-06; `acts.ts` (notice `generic_case_update` `{kind: packet_available}`); `derived.ts:405`; `handover-step.ts`; WP-07 design §2.1 |
| WP10-A20 | Test; operator | Per-file recheck at the release and at each download | (1) Change the evidence after the build; release. (2) Block a mandatory document version between the build and the release; release. (3) Move the material revision after the build (a link after a return); release. (4) After the release, block a constituent; the travel agent downloads; read OP-06 and OP-04p. (5) Read the receipt of A19. | (1) Refused `packet_stale`; nothing recorded; the packet stays "Built" and the page offers "Build again". (2) Refused with the document's code and its requirement named, never only "the packet". (3) Refused `packet_stale`. (4) The download is refused `packet_constituent_unavailable` (TA side WP08-A72); OP-06's packet file row reads unavailable (WP08-A35); no operator page says the packet was delivered. (5) The receipt lists no per-file result: Core's release returns the release id only; per-file checks run at every download (K-BYTE; Q-05). | L ((5)) + T | UX §3.1 step 8, §8.3 (byte unavailable); BS B12; `controls.ts:597-605`; `packets.ts` `markPacketReleased`; `release.ts:206-216`; `test/delivery/packets-handover.test.ts` "T-15-42 a preparation-only packet …" |
| WP10-A21 | Operator; SuperAdmin; harness; test | Release action | (1) Harness, before the release: a release that names Q's replaced packet (§3 V12-Q6); test: a release that names a packet of another application. (2) Harness: a second release with a new key after A19. (3) Harness: a raw stale envelope (older revisions). (4) Two tabs: tab 1 opens the review; tab 2 builds again and confirms readiness again; send tab 1. (5) OP2, `operator-3`, SA2: post a release on Q. | (1) C5 "The packet changed since you opened this page." (`stale_revision` / `packet_stale`); nothing recorded in either application. (2) "The packet was already released." (`packet_released`). (3) C5 with the changed facts. (4) C5 "The packet changed since you opened this page." (`stale_revision` / `packet_stale`); the new packet shows; nothing recorded. (5) OP2: SH-02; `operator-3`: read-only, refused as not found; SA2: no control on any SuperAdmin page, refused. Release count delta 0 in each case. | L ((1) replaced packet, (2), (5)) + T ((1) other application, (3), (4)) | `acts.ts` (`packet?.packetId !== input.packetId` → `packet_stale`); `policy.ts` (`operator.release_packet`) |
| WP10-A22 | Operator (OP1); harness | Release, the Nth time | Replay terms 1 to 5 on A19. Term 3: Back after the receipt; harness: a new-key send from the reloaded page. Term 4: the refusal of A18, then the release after the set-up. | (1) The original receipt; one release; one TA notice. (2) Refused as a used form; nothing recorded. (3) Back reloads OP-04p with "Released" and no form; the new-key send is refused `packet_released`. (4) Recorded once. (5) C4; no new release is offered there. | L+T | PL §7 K-STD; BS B35 |
| WP10-A23 | Test | Reassignment around the release (WP-09 G-09 class) | (1) OP1 confirms readiness on a built packet; Q is reassigned to OP2 with an unchanged basis; OP2 opens OP-04p. (2) After the release, Q is reassigned to OP2; OP1 posts the handover; OP2 records it. | (1) No release form; "Readiness: Recorded by the previous operator"; the route to the SA-09 readiness exception for the packet release (WP07-A167); a saved release envelope is refused `readiness_previous_operator`. (2) OP1: SH-02, nothing recorded; OP2's handover is accepted. | T | BS B19; `controls.ts` (`readinessGate`); WP07-A167 |

### 2.4 OP-06 Record a handover (`dlv.record_handover`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP10-A24 | Operator (OP1); harness | OP-06 of Q after the release, before the travel agent's download (§3 V12-Q7) | Read the section "Other delivery records". Harness: post a packet handover. | First a notice: "The packet's handover waits for the travel agent to download it. This service records the handover once the released packet was sent in full to the travel agent's own download." Owner: the travel agent (download); you follow up. The handover form does not offer the packet. The hand-made post is refused (`handover_evidence_missing`) in words; nothing is recorded (handover count delta 0). OP-01: Q in the travel agent's step (WP-07 mapping). | L | BS B31; `handover-step.ts`; `delivery/pages.ts:192-197`; `test/unit/web/packet-handover.test.ts` "states that the handover waits for the travel agent's download, and does not offer the packet yet" |
| WP10-A25 | Operator (OP1) | OP-06 of Q after Y's download (§3 V12-Q9) | Read the handover form. | The records already made for Q are listed before the forms (kind, verification, event and recorded time). Form "Record a handover": "What was handed over": "The released preparation packet (sent in full to the travel agent's download at [time] IST)" from the retrieval; "Physical documents (no originals)" as the other choice. "Handed to": "The travel agent (their account)" / "The travel agent's representative in person" (name, optional, Core's limit). Evidence rows within Core's limit of 1 to 5, each with a kind chosen from the kinds that fit a delivery (external reference, attestation, document of this application) and a reference; the hint says the note holds no email address or link. "Date of the handover" (optional; "the date it happened"). Effect before the button: "Recording the packet handover also records the outcome Prepared and handed over when no outcome is recorded yet. No government result is claimed. A packet is handed over once." Button "Record the handover". | L | UX §3.2; BS B04, B21, B31; `handover.ts` (`zRecordHandover`, outcome rule); `subjects.ts` (note rules); WP-06 D-10 |
| WP10-A26 | Operator (OP1); harness | OP-06 of Q (§3 V12-Q9) | Send with no evidence. Send a note that holds an address. Harness: send six evidence rows. Then send a valid handover of the packet to the travel agent. | C1 error summary for the missing evidence; a field error for the note (`email_like`); a field error that states Core's limit for the six rows, the rows kept and never truncated; nothing recorded. Then C3 receipt "Packet handover recorded" (named: only this command returns `systemVerified` and `outcomeRecorded`, and a read by the handover id shows the kind `packet`). Current: "Packet handover: system-verified, sent in full to the travel agent's download"; "Outcome: Prepared and handed over (recorded with the handover). No government result is claimed." (shown only when the summary says `outcomeRecorded` and the case read shows the outcome); Next as Core reports it (the completion request boundary, WP-08 OP-07). OP-01: Q moves (delta). | L | WP-06 D-02; `handover.ts` (`result`); WP-08 design §2.11; E-05 |
| WP10-A27 | Operator; SuperAdmin; harness; test | Handover action | (1) Harness: a packet handover that names the built packet before the release (§3 V12-Q5). (2) Harness: a second packet handover with a new key after A26. (3) Harness: a packet id of another application. (4) OP2, `operator-3`, SA2: post a handover on Q. (5) Test: a declaration with no handover standard. (6) Test: a physical handover that names a document version of another group. (7) Harness: a name over 254 characters; an event time that is not a time. | (1) "The preparation packet is not released yet." (`packet_not_released`). (2) "This packet was already handed over." (`handover_exists`). (3) The uniform not-found page. (4) OP2: SH-02; `operator-3`: no form, refused as not found; SA2: the SuperAdmin delivery view shows the records and no form; the post is refused. (5) `declaration_item_unresolved` in words. (6) A field error on the documents (`not_in_group`). (7) Field errors; values kept. Nothing is recorded in each case (handover count delta 0; no outcome). | L ((1) to (4), (7)) + T | `handover.ts`; `policy.ts` (`operator.record_handover`); `contracts/delivery.ts` (staff `offers` null for a SuperAdmin) |
| WP10-A28 | Operator (OP1); test | OP-06 of E after its result file is eligible (§3 V12-D11) | Record a physical handover: "Physical documents (no originals)", to the travel agent's representative in person, with an evidence reference. Read OP-06, OP-02 Delivery & originals and OP-07 of E. | Effect before the button: "An attributed record, not system-verified. It moves no original and records no outcome." Receipt "Physical handover recorded" (named only because a read by the handover id shows the kind `physical`; otherwise "Request recorded"). Current: "Attributed record, not system-verified". E's outcome stays "Issued"; no custody fact changes; OP-07 shows Core's delivery prerequisite unchanged (a TravelMudra-held result still needs the document email: WP-08 wording). The records list shows it before the form. Test: a second physical handover with a new key is a second record (Core has no duplicate guard; no guard is claimed on the page; Q-09). | L+T | BS B24, B30, B31; `handover.ts` (physical: no state check); `test/delivery/packets-handover.test.ts` "T-15-45 a physical handover record: never system-verified, and no original changes custody"; WP-09 G-03 |
| WP10-A29 | Operator (OP1); harness | Handover, the Nth time | Replay terms 1 to 5 on A26. Term 2 changes the recipient. Term 3: Back after the receipt; harness: a new-key packet handover. Term 4: the refusal of A26, then the valid send. | (1) The original receipt; one handover; one outcome fact. (2) Refused as a used form; nothing recorded. (3) Back reloads OP-06 with the record listed and no packet choice in the form; the new-key send is refused `handover_exists`. (4) Recorded once. (5) C4; no new handover is offered there. The command carries no revision: no stale case; the business check answers. | L+T | PL §7 K-STD; BS B35 |
| WP10-A30 | TA; operator; test | Every handover, delivery and completion text for Q, H and E on OP-06, OP-02, OP-07, TA-07, TA-07d and TA-07x | Read. Run the sweep test. | WP-08 delivery words (§0.2): "Delivered" only for a direct external record; a download "Sent in full"; "Received" never; a packet handover "Packet handover"; a physical record "Attributed record, not system-verified"; no "through Send result" for a packet or a direct external delivery (E-06); completion rows show only Core's flags and codes (E-05). The sweep test covers the WP-10 texts with the WP-08 sweep (WP08-A51, A117). | L+T | `WP-08.md` E-05, E-06, E-12; UI-PLAN §11.2 (Delivery) |

### 2.5 OP-06 Record a direct external delivery (`dlv.record_direct_external`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP10-A31 | Operator (OP1) | OP-06 of H after its official result (§3 V12-H5) | Read the form "Record a delivery made directly by an external party". Select "Cancel". | The records already made for H are listed before the forms. Purpose: "Use this when an external party, such as the provider or the authority, delivered the result directly. TravelMudra holds no result file from this delivery, and no file is released." Fields: "External reference" (required; Core's limit), "Delivered to" (optional; Core's limit), evidence rows (1 to 5), "Date of the delivery" (optional; "the date it happened"). Button "Record the delivery". "Cancel" records nothing. | L | UX §2.2 (Delivery); BS B24, B31; `handover.ts` (`zRecordDirectExternal`) |
| WP10-A32 | Operator (OP1) | OP-06 of H (§3 V12-H5) | Send with no reference. Send a note that holds a link. Then record the delivery. Read OP-06 and OP-07 of H. | C1 for the reference; a field error for the note (`url_like`); values kept; nothing recorded. Then C3: "Direct external delivery recorded" only when a read by the returned handover id shows the kind `direct_external` (the result has the same shape as a manual email record); otherwise "Request recorded" with Current facts. Current: "Delivered directly by an external party: no result held by TravelMudra". No file released (release count delta 0). OP-07: Core's delivery prerequisite for H as Core reports it (H declares TravelMudra-held delivery: still not met); no text says that the delivery duty is met (E-05, E-06). | L | WP-06 D-02; `handover.ts` (`result` with `handoverId` only); `contracts/delivery.ts` (`handovers[].kind`); `derived.ts` `completionEvidence` |
| WP10-A33 | TA (Y) | TA-07, TA-07d and TA-07x of H after A32 (§3 V12-H6) | Read. | A delivery row "Delivered directly to you or your applicant by an external party. TravelMudra holds no result file from this delivery." with its event time where recorded and "Recorded [time] IST"; no download offered for it; no claim that TravelMudra filed H. History line "Delivery outside TravelMudra recorded (an attributed record, not system-verified)" with the lag freshness. | L | BS B31; WP-08 design §2.5, §2.11; `case-projectors.ts` (`direct_external_recorded`) |
| WP10-A34 | Operator; SuperAdmin; harness; test | Direct external action | (1) Harness: a reference over 200 characters; a "Delivered to" over 254; no evidence; six evidence rows. (2) OP2, `operator-3`, SA2: post a record on H. (3) Test: a record on an application whose declaration names TravelMudra-held delivery, and a second record with a new key. | (1) Field errors that state Core's limits; values kept; never truncated; nothing recorded. (2) OP2: SH-02; `operator-3`: no form, refused as not found; SA2: no form; refused. (3) Both accepted by Core (no mode, outcome, declaration or duplicate check); the page shows each record and claims no guard (Q-09). | L ((1), (2)) + T | `handover.ts`; `policy.ts` (`operator.record_direct_external`); `test/delivery/packets-handover.test.ts` "T-15-44 a direct external delivery: no TravelMudra-held result, no release row, no bytes" |
| WP10-A35 | Operator (OP1); harness | Direct external, the Nth time | Replay terms 1 to 5 on A32. Term 3: Back after the receipt. Term 4: A32's refusal, then the valid send. | (1) The original receipt; one record. (2) Refused as a used form; nothing recorded. (3) Back reloads OP-06 with the record listed and an empty form; a new send would be a second record (Core has no duplicate check; the listed record is the warning; Q-09). (4) Recorded once. (5) C4. No stale case exists (no revision). | L+T | PL §7 K-STD; BS B35; WP-09 G-03 |
| WP10-A36 | Test; operator | Completion evidence per declared delivery kind (OP-07, WP-08 wording) | (1) Test: a declaration with `direct_external` delivery for `issued`; record the outcome; then a direct external record. (2) Test and L (Q, §3 V12-Q10): read Q's completion prerequisites after the download and after the handover. | (1) The delivery prerequisite is unmet before the record and met after it; a manual email or a download never meets it. (2) Q: after the download alone, the delivery prerequisite is not met; after the packet handover, Core reports it met; OP-07 shows Core's flags only. | L ((2)) + T | BS B24; UX §12 V17; `derived.ts` `completionEvidence`; `test/delivery/packets-handover.test.ts` "T-15-46 delivery evidence per shape … a download alone is never a send or a handover" |

### 2.6 TA-07 Related applications (`core.link_dependency`, `core.unlink_dependency`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP10-A37 | TA (Y) | TA-07 of T as a draft (§3 V12-D1) | Read the section "Related applications". | Heading "Related applications". The declared relation by name ("Needs tourist e-visa"). While none is linked: "This service depends on another of your applications for the same person: Needs tourist e-visa. No related application is linked. Link it so that TravelMudra waits for its result." (from `relations` non-empty and `dependencies` empty; Q-03). What the relation requires (outcome and document) is not shown: the TA read does not return it (partly met until Q-01). Form "Link a related application": "Relation" (preselected when the declaration names one); "Application" offers only Core's linkable applications of the group (E, labelled with applicant and service); U (another applicant) and H (another service) are not offered. Effect: "Linking makes this application wait for the related application's result before the steps the service names. It changes no information in either application." Button "Link". Freshness "Read at [time] IST". | L | UX §3.2 (Dependency); BS B22; PL §4.2 Dependency; `bindings/core.ts` `siblingsOf`; `ta.ts:472-492`; Q-01, Q-03 |
| WP10-A38 | TA (Y); harness; test | TA-07 link (§3 V12-D2, V12-D3) | (1) Send with no choice. (2) Harness: T → U. (3) Harness: T → H. (4) Harness: T → T. (5) Harness: an undeclared relation code. (6) Harness, after A39: a second link of the same relation with a new key. (7) Harness: T → an application of `syn-ta-2`. (8) Test: an upstream already ended with an outcome the relation cannot use. (9) Test: a preparation-only upstream for a relation that needs `issued`. (10) Test: a link that would close a chain cycle. (11) Two tabs (A46). | (1) C1 on the fields; nothing recorded. (2), (3), (5) "The service declares no such relation to that application." (`dependency_undeclared`). (4) "That link would make the applications depend on each other." (`dependency_cycle`). (6) "This relation is already linked." (`duplicate_open_scope`). (7) The uniform not-found page. (8) "That application has already ended with a result this service cannot use, so it cannot be linked." (`dependency_upstream_final_incompatible`); such an application is not offered. (9) The §11.3 boundary: "Linking to a preparation-only application is unavailable for a relation that needs a government result, because a packet handover is not a government result. Owner: product owner." (`unavailable_parked`). (10) `dependency_cycle` in words. Nothing is recorded in each case (dependency rows delta 0). | L ((1) to (7)) + T | `drafts.ts` `linkDependency`; `guard-constraints.ts` (`core_dependencies_relationship_uq`); BS B22; `test/core/withdrawal-dependencies.test.ts` "links only a declared relation to an application of the same group and applicant", "refuses a link to an upstream that already ended with an outcome the relation cannot use; the dependent stays open"; `test/system/case-rules.test.ts` "offers no related application that already ended incompatibly, and refuses a link to it in words; the dependent stays open" |
| WP10-A39 | TA (Y) | TA-07 of T (§3 V12-D3, V12-D5) | Link T to E. Read. | C3 receipt "Related application linked" (named only when the case read lists the returned dependency id as linked; Q-07). Current: one row "Needs tourist e-visa · [D] (SYN Tourist e-visa) · Waiting for the result of your application". No link form for a relation that is already linked (Core refuses a second, A38 (6)). The receipt says nothing about E's data. | L | WP-06 D-02; `drafts.ts` (result `dependencyId`); BS B22 |
| WP10-A40 | TA (Y) | TA-07 of T (§3 V12-D4) | Select "Remove the link" on the row. Read the confirmation. Confirm. | The control is offered per row where Core's editor rule allows it (draft, unassigned submitted, returned). Confirmation: "Remove the link to [E]? This application stops waiting for it. It changes no information in either application." After the send: a neutral receipt "Request recorded" (a link and an unlink return the same result shape; Q-07) with Current "No related application linked" and the declared-relation line of A37. | L | `drafts.ts` `unlinkDependency`; WP-03 design §1.5 (no unlink host today) |
| WP10-A41 | TA (Y); harness; test | Remove a link | (1) Harness: a dependency id of another application. (2) Harness: a new-key unlink after A40. (3) Harness: an unlink while T is assigned (§3 V12-D6). (4) Test: an unlink while an act of T may be filed. (5) Harness: a raw envelope with an older revision. | (1) The uniform not-found page. (2) "This link was already removed." from the re-read (Core answers `stale_revision`). (3) "This application is with your operator. Report the problem so it can be returned for correction." (`awaiting_formal_return`). (4) "A filing may have happened for this application, so the link stays." (`filing_possibly_occurred`). (5) C5 with the changed facts. Nothing is recorded in each case. | L ((1) to (3), (5)) + T | `drafts.ts`; `test/core/withdrawal-dependencies.test.ts` "unlinks only while the dependent is confirmed unfiled" (WP-10 adds the `filing_possibly_occurred` case, which that test does not exercise) |
| WP10-A42 | TA (Y); harness; test | TA-07 of T after its assignment (§3 V12-D6); TA-07 of a returned dependent (test) | Read. Harness: post a link and an unlink. Test: on a returned case, link, hand back, read OP-02. | Assigned: the rows and states stay; no link and no remove control; the line "Your operator holds this application. Report a problem if a link is wrong." with the route to "Report a problem" (WP-09). Both posts refused (`awaiting_formal_return`); nothing recorded. Returned (test): the controls are back; a link moves the material revision; after the hand back OP-02 reads readiness "Out of date: confirm readiness again". | L+T | BS B18, B19; `drafts.ts` `taEditorPermits`; `derived.ts` `readinessBasis` (`materialRevision`, `dependencies`) |
| WP10-A43 | TA (Y); test | TA-07 of T through §3 Part D2 | Read the row at each step. | One row per linked relation with Core's state in the TA words of §0.2: "Waiting for the result of your application [E]" (`waiting`); "[E] has its result. Its official document is not available yet." (`unmet_missing_evidence`); "Met" (`met`); test: "Cannot be met: [E] ended with a result this application cannot use." (`failed_incompatible`). Only the TA's own application label and outcome show (the TA owns both). Never "Ready". | L+T | UX §3.2 (Dependency: "Missing evidence means a wait"); BS B22; `core.ta_application` (`dependencies`, `siblings`) |
| WP10-A44 | Test | Incompatible upstream outcome | Record an incompatible final outcome on the upstream of a confirmed-unfiled dependent, and of a dependent whose act may be filed. | The confirmed-unfiled dependent ends `dependency_failed` with the WP-08 words ("Recorded by TravelMudra because the related application ended with an outcome this one cannot use."); the filed dependent keeps its protection and gets an owned follow-up, not `dependency_failed`; no sibling outcome changes. | T | BS B22; WP-08 design §2.1; `writers.ts` `evaluateDependents`; `test/core/withdrawal-dependencies.test.ts` "fails a confirmed-unfiled dependent on an incompatible final outcome, keeps a filed dependent protected, and never touches a sibling" |
| WP10-A45 | TA (Y); harness | Link and unlink, the Nth time | Replay terms 1 to 5 on A39 and on A40. Term 3: Back after each receipt; harness: a new-key send from the reloaded page. Term 4: A38 (1), then the valid link. | (1) The original receipt; one dependency (one unlink). (2) Refused as a used form; nothing recorded. (3) Link: the reloaded page shows the row and no link form; the new-key link is refused `duplicate_open_scope`. Unlink: the reloaded page shows no row; the new-key unlink is refused and reads "This link was already removed.". (4) Recorded once. (5) C4. A raw stale envelope → C5. | L+T | PL §7 K-STD; BS B35 |
| WP10-A46 | TA (Y), two tabs | TA-07 of T (§3 V12-D3) | Tab 1: open the link form and choose E. Tab 2: link E. Send tab 1. | C5 "Changed since you opened this page" (the link moved the revision) with the linked row beside the unsent choice, which stays; nothing recorded. | L | UX §3.3; BS B19 |

### 2.7 OP-02 declared prerequisite and the exact declared evidence (dependent T)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP10-A47 | Operator (OP2) | OP-02 Work of T after the start of work (§3 V12-D7) | Read the readiness checklist and the Application & documents tab. | The "Declared prerequisites" row (WP07-A18 builds it) reads: "Needs tourist e-visa: the related application needs the outcome Issued and an eligible e-visa grant document." (required outcome and required artifact type from the staff read); state "Not met: outcome awaited"; owner as Core's answer names it (you, or an external party with your follow-up once the related application's filing is evidenced); what it blocks: readiness and the government submission (Core's blockers). No name, passport, document, outcome or link of the related application shows (the staff read has no upstream id). | L | UX §3.2 (Dependency: "exact required artifact without granting sibling visibility"); BS B22; PL §4.2 Dependency step 8; `bindings/core.ts` (staff `dependencies`); WP-07 design §2.4.2 |
| WP10-A48 | Operator (OP2); harness | OP-02 of T (§3 V12-D7, V12-D9, V12-D11) | Look for "Confirm readiness". Harness: post a readiness while E has no outcome; again after E is "Issued" without a file. After E's file is eligible, confirm readiness (set-up). | While unmet: no readiness form; the blocker in words. The posts are refused: "A related application has not reached the result this one depends on." (`dependency_outcome_unmet`); then "The related application's result is recorded, but its official document is not yet eligible." (`dependency_evidence_missing`); nothing recorded. After the eligible `evisa_grant`: the row reads "Met"; readiness is accepted (WP-07 set-up); OP-04a offers "Request authorization for the government submission" (observed, not sent). The outcome alone never meets the prerequisite. | L | BS B22; `controls.ts:584-590`; `derived.ts` `prerequisiteState` |
| WP10-A49 | Operator (OP2) | OP-01 of T through §3 Part D2 | Read T's row at each step. | Core's answer in words: waiting for the related application's result (`dependency_outcome_unmet`, `await_dependency`), or its document (`dependency_evidence_missing`, `supply_dependency_evidence`); owner the assigned operator, or an external party with the operator's follow-up; the saved view follows the WP-07 mapping; never "Ready". Lag freshness. | L | `derived.ts` rule 20; WP-07 design §2.1 |
| WP10-A50 | Operator (OP2) | OP-02 of E (harness GET by OP2); OP-02 of T | Open E's page as OP2. Look for a link from T to E. | E: SH-02 (OP2 is not assigned to E). T: no link, id or fact of E. | L | UX §3.2 ("without granting sibling visibility"); BS B10, B22 |
| WP10-A51 | Test | The exact declared evidence rule and its words | (1) Upstream outcome `issued` with no artifact; with an artifact of another type; with a withheld or pending-review artifact; with an eligible `evisa_grant`. (2) A preparation-only upstream with `prepared_and_handed_over` for a relation that needs `issued`. (3) Render the OP-02 row for each state. | (1) Only the eligible artifact of the exact type meets it; the others leave `unmet_missing_evidence`. (2) Never met; the link is a parked boundary (A38 (9)). (3) The row words of §0.2 for each state, with the required outcome and artifact type. | T | BS B22; `test/core/withdrawal-dependencies.test.ts` "is unmet until the upstream's required outcome has an eligible artifact; missing evidence is not terminal" |
| WP10-A52 | SuperAdmin (SA2) | SA-02 "Dependency waits"; the SuperAdmin case page of T | Open the SA-02 views. Open T's case page. | SA-02 "Dependency waits": **Deferred** (no read lists dependency waits; Q-08); no view claims a count. T's case page shows the dependency rows read only (relation, needs, state) and no link, unlink or readiness control. | L (case page); Deferred | PL §3.4 SA-02; WP-06 design §2.2.5; `contracts/core.ts:405` (`core.admin_queue` kinds); Q-08 |

### 2.8 Command results, access and shell on WP-10 pages

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP10-A53 | TA; operator; SuperAdmin | Every WP-10 page | Read the shell. | Environment label; "[TEST]" title prefix; rail current item: "Applications" on TA pages; "My work" (or "Applications" when opened from there) on OP-02, OP-04p and OP-06; breadcrumb; one `h1`; a freshness line where the page shows read facts. | L | PL §2.1, §2.2; WP01-A07 |
| WP10-A54 | TA; operator; harness | Every accepted WP-10 command; edited receipt addresses | Read each receipt. Open edited addresses: on OP-06, a direct external `done` code with the key of a manual email record; on OP-04p, a release `done` code with a build key; on TA-07, a link `done` code with an unlink key; the key of another application's operation. | Naming rules (surface by surface): build (packet id with a step id) → "Packet build requested"; release (packet release id) → "Packet released"; handover (`systemVerified`, `outcomeRecorded`; kind by a read of the handover id) → "Packet handover recorded" / "Physical handover recorded", else "Request recorded"; direct external (handover id only, the shape of a manual email record) → "Direct external delivery recorded" only when a read by the id shows `direct_external`, else "Request recorded"; link (dependency id; listed as linked by the read) → "Related application linked", else "Request recorded"; unlink → "Request recorded" with Current facts (Q-07). An edited address never shows another command's title; another application's key: "Request reference [key]. The receipt cannot be checked now." No accepted time (P-02). | L+T | WP-06 D-01, D-02; W1 A-04; WP-09 G-01; Q-07 |
| WP10-A55 | Operator; TA; test | Receipt addresses of A08, A19, A26, A32 and A39, opened again after later steps (§3 V12-Q10, V12-D12); test after a reassignment | Open each address again. | Each receipt keeps what was recorded then (for example "Packet released [time] IST") and shows the facts that are current now, labelled "Current" (handover recorded; outcome; link met). No receipt or status read tells anyone to act from an older state: no "Build the packet", "Release the packet" or "Record the handover" once Core's facts no longer offer it; none after a reassignment to the previous operator. | L+T | `WP-07.md` F-01 (class fix); WP-09 G-10 |
| WP10-A56 | Operator; TA | Each command of §1.2 with a lost acknowledgement (fixture); a refused send | Inject the fault. Open the operation status page. Select "Check status" after the original resolves. Open the status page of a refused send's key. | C4 (CMP-13) "Checking the original result" and "Check status"; no new send of the same intent is offered there. "Check status" reads the same operation and shows its accepted result. A refused send leaves no operation record: "Nothing is recorded for request [reference] so far". A refusal, and any stale comparison, shows only on the re-rendered form. | T | PL §1.1 UNR; BS B35; W1 A-08; WP06-A104 |
| WP10-A57 | Harness | Each command of §1.2 | (1) Identical replay after acceptance. (2) Same key, changed content. (3) Business duplicate: a new key with the current page's facts. (4) Raw stale envelope: a new key with an older page's revision. (5) Raw resend of a refused envelope after the facts changed. | (1) The original result; no second packet, release, handover, record, link or notice. (2) Refused as a conflict; nothing recorded. (3) Build `packet_exists` (or `packet_released`); release `packet_released`; packet handover `handover_exists`; physical handover and direct external: a second record (no guard; Q-09); link `duplicate_open_scope`; unlink `stale_revision`, shown as "already removed". (4) Build, release, link and unlink: `stale_revision`, CMP-14 with the current facts; handover and direct external carry no revision, so their stale case is the business check. (5) The refused key has no record, so Core evaluates again: a build refused before the start of work is accepted after it; a packet handover refused before the download is accepted after it; a release refused for a problem report is accepted after the resolution and the new readiness. A duplicate test uses (3), never (4) or (5). Browser Back is not a replay. | T | WP-06 D-12; PL §7 K-STD; BS B35 |
| WP10-A58 | TA; operator | Every refusal reachable on `lane-ui` in §2.1 to §2.7 | Read each message. | CMP-07 with the reason in words and the owner or route where one exists. Never a code alone, except the UAT-13 fallback. No "Something went wrong", "Invalid data" or "A requirement of this item is not met." | L | PL §1.1 REJ, §11.1; CR-01 |
| WP10-A59 | — | Text map of every reason code that the WP-10 pages can show | Check the map against Core's vocabulary (unit test). | Each code has text in the role's words: `service_mode_not_applicable`, `operator_work_not_started`, `mandatory_document_missing` and the other document codes, `packet_exists`, `packet_released`, `packet_handed_over`, `packet_not_built`, `packet_stale`, `packet_not_ready`, `packet_not_released`, `packet_constituent_unavailable`, `handover_exists`, `handover_evidence_missing`, `declaration_item_unresolved`, `not_in_group`, `email_like`, `url_like`, `readiness_missing`, `readiness_stale`, `readiness_held`, `readiness_previous_operator`, `hold_returned_to_ta`, `hold_problem_reported`, `hold_flagged_to_superadmin`, `hold_assistance_in_progress`, `deferral_active`, `travel_date_recheck_pending`, `renewed_authority_pending`, `renewed_authority_declined`, `transition_pending`, `protection_mark_active`, `outcome_already_recorded`, `withdrawal_accepted`, `preparation_only_holds_no_originals`, `dependency_undeclared`, `dependency_cycle`, `dependency_upstream_final_incompatible`, `parked_preparation_dependency_evidence`, `duplicate_open_scope`, `dependency_outcome_unmet`, `dependency_evidence_missing`, `awaiting_formal_return`, `application_not_open`, `filing_possibly_occurred`, `stale_revision`, `conflict_operation_key`. The pending reasons `packet_released`, `dependency_outcome_unmet` and `dependency_evidence_missing` read per (reason, next action) (WP-07 F-13 class). `access_denied` renders SH-02 or the uniform not-found page, never a text. | T | CR-01; SC §3.4 (UAT-13); `src/apps/shared/core/shared.ts`; `src/apps/shared/delivery/pages.ts` (`DLV_MESSAGES`) |
| WP10-A60 | TA; operator | TA-07, OP-02, OP-04p and OP-06 (HTTP tests with access revoked between the page's first read and an optional read: `doc.application_evidence`, `dlv.delivery_page`, `dlv.packet_handovers`, `dlv.delivery_facts`; a reassignment between two reads of OP-04p) | Let an optional read answer an access, authentication, maintenance or support-view refusal. | The page renders the access page (SH-02, sign-in or maintenance), never the facts read earlier. Only an availability failure degrades a block to "Unavailable" (for example "Documents of this application now: Unavailable" on A16; the release form then stays and Core decides at send). No page code catches every error around a read. After a reassignment, the previous operator's next read or command gives SH-02. | T | LD-14; PL §2.3 SH-R04; BS B10; `test/unit/web/packet-handover.test.ts` "a refusal of access is never read as "none": it reaches the page" |
| WP10-A61 | TA; operator; SuperAdmin | Every WP-10 page and the SuperAdmin case and delivery pages of Q, H, E and T | Look for controls of the other roles. | TA pages: no build, release, handover or delivery-record control. Operator pages: no link or unlink control. SuperAdmin pages: no build, release, handover, direct external, link or unlink control (WP07-A117 and WP06-A109 for the release); facts only. | L | BS B18; UX §2.3, §12 V15; PL §11.1 |
| WP10-A62 | TA; operator; SuperAdmin | Every WP-10 page | Read all visible text. | No forbidden label of §11.1 ("File visa", "Submit for TA", "Override", "Admin override", "Approved" or "Done" as an overall status, "Ready" as a universal state, "Force complete"); no "Unread" or "Mark as read". No "Filed" for a provider handoff; no government result for preparation-only; "Delivered" only per §0.2. Times carry IST; counts name their unit; synthetic data carries the synthetic label. No page states a configuration number that it does not read (packet size limit, retry counts, row limits). | L | PL §11.1, §11.2; CR-03, CR-06, CR-07, CR-08; WP-01 Q-13 |
| WP10-A63 | Operator (`operator-3`); SuperAdmin in a support view of Y (test) | OP-02, OP-04p and OP-06 of Q with the group read grant; TA-07 of T in the support view | Read the pages. Harness: post a build, a release, a handover and a direct external record as `operator-3`; post a link and an unlink in the support view (test). | Read grant: the banner "Read-only access: [purpose], until [date time] IST"; no task, form or action; each post refused as not found. Support view: "Read-only view for [individual]"; the rows and states show; no link or remove control; each post refused with the support-view refusal. Nothing is recorded. | L (grant) + T (support view) | UX §2.3 ("A read grant cannot add case actions"); BS B10; PL SH-R09, SH-R10; `bindings/core.ts` `taCase` (support view evaluates no action) |
| WP10-A64 | TA; operator | TA-07, OP-04p, OP-06 | Inspect `localStorage`, `sessionStorage` and IndexedDB after use. Read the response headers. | No evidence reference, recipient detail, external reference, packet id or dependency choice is kept in browser storage. Signed-in pages send `no-store`. | L+T | PL §2.3 SH-R12 |
| WP10-A65 | — | Rebuilt pages and the old pages they replace | Open the old operator case page, the case-work page, OP-02 External actions and OP-06 of Q, and today's TA application page of T. Run the route test. | The build and release forms left the old operator case page and the case-work page; the WP-07 "carried WP-10 packet forms" on OP-02 External actions are replaced by the packet section of A01; the carried handover and direct-external forms on OP-06 are the rebuilt WP-10 forms; the carried "Related applications" section on TA-07 is the rebuilt section with the remove control. Links replace removed forms. Every other carried form (for example WP-12 originals, WP-14 incidents, WP-17 forms) keeps its markup, fields, action and success redirect and works as before. The WP-08 carried-form test entries for `/ops/applications/:id/handovers` and `/direct-external` are replaced by WP-10 tests (WP-08 design §7.2). A unit test lists the carried forms by action path; every rendered form action is a registered route. | L+T | LD-02; LD-07; CC-06; WP-03 Q-01; WP06-A110; WP08-A118; WP07-A37 |
| WP10-A66 | `syn-ta-2`; operator (OP2); SuperAdmin | TA-07 of T and Q; OP-04p and OP-06 of Q; ids of another application in the packet, handover and dependency paths | Open each. | `syn-ta-2`: the uniform not-found page. OP2 (not assigned to Q): SH-02 on OP-04p and OP-06. A foreign packet, handover or dependency id: the uniform not-found page. No fact of Q, H, E or T shows. | L | BS B10; UX §2.3 |
| WP10-A67 | TA (Y) | TA-10 and TA-07x of Q, H, E and T after §3 | Read the lists and the history. | TA-10: one notice for Q's release ("Your preparation packet is ready to download."), linked to Q, with no acknowledgement and no read marker (count delta from P-0). History, each line with "Recorded [time] IST" and the lag freshness: Q "Handover recorded" (packet, system-verified words) and "Outcome recorded: Prepared and handed over"; H "Delivery outside TravelMudra recorded (an attributed record, not system-verified)"; E "Handover recorded" (physical, attributed). No line for a packet build, a packet release, a link or an unlink (the projection has none), and the page does not invent one. | L | LD-06, LD-08; WP08-A89 to A91; `case-projectors.ts` (`historyLine`) |

### 2.9 Accessibility (AC-01 to AC-28 that apply)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP10-A68 | Keyboard-only TA and operator | §3 steps V12-D3, V12-D4, V12-Q2, V12-Q6, V12-Q9, V12-H5 at 1440 px; V12-D3 and V12-Q9 at 390 px | Use the keyboard only. | Every step works with Tab, Shift+Tab, Enter, Space and Escape: link, remove a link (confirmation), build, build again, release, record a handover (choices, evidence rows), record a direct external delivery. No action needs a mouse, hover or drag-and-drop. | L | AC-01, AC-12 |
| WP10-A69 | Keyboard-only user | Every WP-10 page at 1440 and 390 px and at 400% zoom | Tab through the page. | Focus is visible (at least 3:1) and never hidden by the top bar, the rail or a bottom action area. | L | AC-02 |
| WP10-A70 | Phone user | TA-07 Related applications, OP-04p, OP-06, OP-02 readiness checklist | View at 320 px, and at 1280 px with 400% zoom. | No two-dimensional page scrolling. The documents list, the records list and the dependency rows scroll only inside a labelled region, or become cards. Identity, state, owner and next action come before secondary data. Forms are full width; buttons are at the end, not in a fixed bar. | L | AC-04, AC-21; UX §7.3 |
| WP10-A71 | Any | Every WP-10 form | Inspect each input. | Each input has a visible label; the handover choices and the recipient choices sit in fieldsets with legends; each evidence row labels its kind and reference with its row number; required fields say that they are required; optional fields say "optional". | L | AC-05, AC-15 |
| WP10-A72 | Any | Packet states, release blockers, dependency states, delivery rows | View in greyscale. | Each state has text. No state is shown by colour alone. | L | AC-06 |
| WP10-A73 | Any | Every WP-10 form | Send each form with an error. | Focus moves to the error summary; each link moves focus to its field; entered values stay; chosen relation, application, kind and recipient stay chosen; evidence rows stay filled. | L | AC-08; CMP-07; WP-09 G-07 |
| WP10-A74 | Screen-reader user | Receipts; the "waits for the download" notice; the release blockers; the declared-but-unlinked line | Read with VoiceOver or NVDA. | Receipts are announced politely without moving focus. Notices and blockers are read before the form they concern. | L | AC-09, AC-16 |
| WP10-A75 | Screen-reader user | Each unavailable action: release before the build (A07), release with a problem report (A18), packet handover before the download (A24), link while assigned (A42), readiness on T while unmet (A48) | Focus the control or the notice. | The reason is exposed (`aria-describedby`, or the notice in reading order). A role-forbidden action is not shown at all. | L | AC-13; CMP-10; PL §2.3 SH-R08 |
| WP10-A76 | Phone user | Every WP-10 page at 390 px | Measure each control. | Every control is at least 24 × 24 CSS px. Primary actions ("Link", "Remove the link", "Build the packet", "Release the packet", "Record the handover", "Record the delivery") are at least 44 × 44 CSS px. Radio and checkbox labels are part of their targets. | L+T | AC-10 |
| WP10-A77 | — | Every WP-10 page | Measure contrast of text, focus, state text and notices. | Normal text at least 4.5:1. Non-text indicators and focus at least 3:1. | L+T | AC-11 |
| WP10-A78 | Any | Long names and texts; reduced motion | Use a 60-character surname and given names, an external reference and evidence references of Core's maximum length, and a long relation name. Turn on "reduce motion". | Names and references wrap without hiding identity; a truncated text has a full form that keyboard and touch reach. No transition plays. | L | AC-14, AC-20 |
| WP10-A79 | TA and operator (observation) | TA-07 of Q after the handover; OP-02 of H after the handoff; OP-02 of T while unmet | Ask the TA "Who files Q with the government?", the operator "Has H been filed?" and "What does T still need?". | The run record reports the answers and the sample size; confusion of a packet with a government result, of a handoff with a filing, or of an outcome with the exact document is a finding. No pass target (observation only). | L | AC-24, AC-26; UX §12 (usability) |

### 2.10 axe checks (WCAG 2.2 A/AA)

Rule for every row: run axe (`@axe-core/playwright` 4.13.0, tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`,
`wcag22aa`) at 1440 × 900 and at 390 × 844. Expected: no violation of impact "serious" or "critical" at either width.
Record the counts of minor and moderate violations. The harness takes no screenshot of a page that shows a real
person's data; WP-10 uses synthetic data only.

| ID | Persona | Page (state) | Where | Source |
|---|---|---|---|---|
| WP10-A80 | TA | TA-07 of T, draft: Related applications with the declared-but-unlinked line and the link form (A37) | L | UX §7.5; AC-01 to AC-28 |
| WP10-A81 | TA | TA-07 link form with the error summary (A38 (1)) | L | same |
| WP10-A82 | TA | TA-07 of T with the link receipt and "Waiting" (A39) | L | same |
| WP10-A83 | TA | TA-07 of T with the remove-link confirmation open (A40) | L | same |
| WP10-A84 | TA | TA-07 of T assigned: rows, no controls (A42) | L | same |
| WP10-A85 | TA | TA-07 of Q after the release: shape line and the download (A02) | L | same |
| WP10-A86 | TA | TA-07 of Q after the handover: outcome "Prepared and handed over" (A02) | L | same |
| WP10-A87 | TA | TA-07d of H with the direct external row (A33) | L | same |
| WP10-A88 | Operator | OP-04p of Q before the build (A07) | L | same |
| WP10-A89 | Operator | OP-04p with the build receipt and "Building" (A08) | L | same |
| WP10-A90 | Operator | OP-04p release review (A16) | L | same |
| WP10-A91 | Operator | OP-04p after the C5 of a problem report, release unavailable (A17, A18) | L | same |
| WP10-A92 | Operator | OP-04p with the release receipt (A19) | L | same |
| WP10-A93 | Operator | OP-06 of Q: the handover waits for the download (A24) | L | same |
| WP10-A94 | Operator | OP-06 handover form with the error summary (A26) | L | same |
| WP10-A95 | Operator | OP-06 of Q with the handover receipt and the outcome (A26) | L | same |
| WP10-A96 | Operator | OP-06 of H: direct external form with the error summary, then the receipt (A32) | L | same |
| WP10-A97 | Operator | OP-02 of T: readiness checklist with the prerequisite row "Not met" (A47, A48) | L | same |
| WP10-A98 | Operator | OP-04b of H after the handoff evidence with the provider-filing evidence line (A04) | L | same |
| WP10-A99 | TA; operator | Operation status page of a WP-10 command, accepted and "Nothing is recorded" (A56) | L | same |

## 3. Proof scenario V12 (to its boundary)

V12 (UX §12): "Third-party handoff is not filing; preparation-only has packet outcome/no originals/no claimed
government result; dependency needs exact declared evidence." Authority B04, B22, B30. Also UX §3.2 (Preparation-only,
Third-party filed, Dependency) and UX §3.1 steps 6 to 8.

One ordered recipe (§0.4) serves the proof. "Setup" steps use pages of earlier packages; they are not the subject
under test. "Observe" steps check items that other packages own. SA1 = `superadmin-1`, SA2 = `superadmin-2`, OP1 =
`operator-1`, OP2 = `operator-2`.

| Step | Actor, page | Action | Observable result | Items | Where |
|---|---|---|---|---|---|
| P-0 | OP1, OP2: OP-01; SA1: SA-01 | Before the set-up, read the counts. | The run record holds the baselines of §0.4. | — | L |
| Setup-1 | SA1 (SA-06, grant page); Y (TA-09) | §0.4: create and activate Y; Y creates the group and the drafts Q (passport, photograph, itinerary), H, E and T (applicant D, one passport) and U; SA1 grants `operator-3` read access to the group. | Y active; five drafts; TA-10 count of Y read (baseline). | — | L |
| V12-D1 | Y: TA-07 of T | Read the Related applications section. | The relation by name; the declared-but-unlinked line; only E offered. | A37 | L |
| V12-D2 | Y: TA-07 of T; harness | Send the link form with no choice. Harness: T → U, T → H, T → T, an undeclared code, T → an application of `syn-ta-2`. | C1; the refusals in words; nothing recorded. | A38 (1) to (5), (7) | L |
| V12-D3 | Y (two tabs): TA-07 of T; harness | Tab 1 opens the link form and chooses E. Tab 2 links T to E. Tab 1 sends. Harness: replay (same key); a second link with a new key. | Tab 2: "Related application linked", "Waiting"; tab 1: C5; the replay returns the same receipt; the new key refused `duplicate_open_scope`; one dependency. | A38 (6), A39, A45, A46 | L |
| V12-D4 | Y: TA-07 of T; harness | Remove the link. Harness: replay; a new-key unlink; a dependency id of another application. | Neutral receipt with Current "No related application linked"; the replay returns the same receipt; the new key "This link was already removed."; the foreign id not found. | A40, A41 (1), (2), A45 | L |
| V12-D5 | Y: TA-07 of T | Link T to E again. | A new dependency "Waiting". | A39 | L |
| Setup-2 | Y (TA-08); SA1 (SA-07a, SA-03a) | Y submits Q, H, E and T. SA1 records "Payment received" for each and assigns Q, H and E to OP1 and T to OP2. | Four submitted, paid, assigned applications; U stays a draft. | — | L |
| V12-D6 | Y: TA-07 of T; harness | Read. Harness: a link and an unlink. | No controls; the "Report a problem" line; both refused `awaiting_formal_return`; nothing recorded. | A41 (3), A42 | L |
| V12-Q0 | Harness as OP1 | Before OP1 starts work on Q: post a packet build. Then (Setup) OP1 starts work on Q, H and E; OP2 starts work on T (WP-07). | Refused `operator_work_not_started`; nothing recorded; work started. | A10 (1), A13 (4) | L |
| V12-Q1 | OP1: OP-02 and OP-04p of Q | Read. | The packet section "Not built"; build offered; release unavailable (`packet_not_built`); Core's next action with the readiness blocker. | A01, A07, A17 | L |
| V12-Q2 | OP1: OP-04p of Q; harness | Cancel. Build. Harness: replay; a new-key build. Reload until "Built". | "Packet build requested", "Building"; the replay returns the same receipt; the new key refused `packet_exists`; then "Built [time] IST". | A08, A10 (2), A13 | L |
| V12-Q3 | OP1 (two tabs): OP-04p of Q | Tab 1 opens "Build again". Tab 2 builds again. After "Built", tab 1 sends. | The first packet "Replaced: never released"; a new packet built; tab 1 refused `packet_exists`; nothing extra recorded. | A09 | L |
| V12-Q4 | Setup: OP1, OP-02 of Q | Confirm readiness (WP-07). | "Recorded by you". | — | L |
| V12-Q5 | OP1 (tab 1): OP-04p release review; Y: TA-07 of Q; harness | Read; Cancel. Harness: a packet handover that names the built packet. Open the review in tab 1. Y reports a problem (WP-09). OP1 sends tab 1. Reload. Setup: OP1 resolves the report and confirms readiness again (WP-09, WP-07). | The review of A16; the handover refused `packet_not_released`; C5 with the open report; release unavailable "On hold: problem report"; nothing recorded; after the set-up the review is available again. | A16, A17, A18, A27 (1) | L |
| V12-Q6 | OP1: OP-04p of Q; Y: TA-10; harness | Harness, before the release: a release that names the replaced packet of V12-Q3. Release the packet. Harness: replay; a new-key release; a new-key build. | The replaced packet refused as changed (C5, `packet_stale`), nothing recorded; then "Packet released"; the next step from Core; TA-10 + 1; the replay returns the same receipt; the new-key release refused `packet_released`; the new-key builds refused `packet_released` (with the supersede) and `packet_exists` (without); one release. | A10 (3), A19, A21 (1), (2), A22 | L |
| V12-Q7 | OP1: OP-06 and OP-01 of Q; harness | Read. Harness: a packet handover. | The "waits for the download" notice; the packet not offered; the handover refused `handover_evidence_missing`; OP-01 at the travel agent's step. | A24 | L |
| V12-Q8 | Y: TA-07 of Q (WP-08 download, Observe) | Read. Download the packet (WP08-A72). | The shape line of A02; "Sent in full to your download [time] IST" after the download. | A02 | L |
| V12-Q9 | OP1: OP-06 of Q; harness | Read the form. Send with no evidence; with an address in the note; harness: six rows. Record the packet handover. Harness: replay; a new-key handover. | C1 and field errors with values kept; then "Packet handover recorded" and "Outcome: Prepared and handed over … No government result is claimed."; the replay returns the same receipt; the new key refused `handover_exists`. | A25, A26, A27 (2), A29 | L |
| V12-Q10 | Y: TA-07, TA-07x, TA-10 of Q; OP1: OP-02 Delivery & originals, OP-07 and OP-05 of Q; harness | Read. Harness: an original receipt on Q; an official result "issued" on Q (Observe WP08-A03 (4)). Open the receipt addresses of V12-Q2, V12-Q6 and V12-Q9 again. | Outcome and the no-government-result line; history lines; "This service holds no originals"; the original receipt refused (`preparation_only_holds_no_originals`); the official result refused (`service_mode_not_applicable`); completion: delivery met by the packet handover (Core's flag); old receipts show current facts and no instruction. | A02, A03, A36 (2), A55, A67 | L |
| V12-H1 | OP1: OP-02 of H; harness | Read. Harness: a packet build and a release on H; a packet build on E. | No packet section; each refused `service_mode_not_applicable`; nothing recorded. | A01, A05 | L |
| V12-H2 | Setup: OP1, OP-02 and OP-04a/b of H (WP-07) | Confirm readiness. Request authorization for the provider handoff. Record the handoff evidence "Handed over" with `SYN-V10-[stamp]-H-1`. | Observe WP07-A72 and A164: handoff words only; no Gate 2, fee or exposure line. | — | L |
| V12-H3 | OP1: OP-04b and OP-02 of H; Y: TA-07 of H | Read. | The provider-filing evidence line as decided at Q-02 (default: the §11.3 boundary and the route to OP-05); no "Filed" on any page (WP07-A164). | A04 | L |
| V12-H4 | Setup: OP1, OP-05 of H (WP-08) | Record the official result "Issued" with the external reference `SYN-V10-[stamp]-H-RES` and no file. | "Issued"; release of a result held for the missing file (WP-08). | — | L |
| V12-H5 | OP1: OP-06 and OP-07 of H; harness | Read the direct external form; Cancel. Send with no reference; with a link in the note. Record the delivery "The provider sent the e-visa to the traveller directly" with reference `SYN-V10-[stamp]-H-DX`. Harness: replay; over-long values. | C1 and field errors; then the receipt (named only by the read); the delivery row; no file released; OP-07 shows the delivery prerequisite still not met for H. | A31, A32, A34 (1), A35 | L |
| V12-H6 | Y: TA-07, TA-07d, TA-07x of H | Read. | The direct external row in the TA's words; the history line; no filing claim. | A33, A67 | L |
| V12-D7 | OP2: OP-02 Work and OP-01 of T; harness | Read. Harness: a readiness on T. OP2 opens E's OP-02. | The prerequisite row with the exact declared evidence; "Not met: outcome awaited"; readiness refused `dependency_outcome_unmet`; E: SH-02. | A47, A48, A49, A50 | L |
| V12-D8 | Setup: OP1 on E (WP-07, WP-08) | Confirm readiness; request authorization for the government submission; record the evidence "Filed" with `SYN-V10-[stamp]-E-ACT`; record the official result "Issued" with `SYN-V10-[stamp]-E-RES` and no file. | E "Issued"; no eligible artifact yet. | — | L |
| V12-D9 | OP2: OP-02 and OP-01 of T; Y: TA-07 of T; harness | Read. Harness: a readiness on T. | "Not met: result recorded, document missing"; readiness refused `dependency_evidence_missing`; TA "[E] has its result. Its official document is not available yet."; nothing recorded. | A43, A48, A49 | L |
| V12-D10 | Setup: OP1, OP-05 of E (WP-08) | Record E's result file (§0.3) as `evisa_grant`. Reload until it reads "Verified for this application" and "Eligible for release". | E's artifact eligible. | — | L |
| V12-D11 | OP2: OP-02 and OP-04a of T; Y: TA-07 of T; OP1: OP-06 of E | Read T. Setup: OP2 confirms readiness on T (WP-07); observe that OP-04a offers the government submission (not sent). OP1 records a physical handover on E. | T "Met"; readiness accepted; the authorization offered; TA "Met"; "Physical handover recorded", attributed; E's outcome and custody unchanged. | A28, A43, A48 | L |
| V12-D12 | Y: TA-07x of T and E; Y: receipt address of V12-D5; OP1: receipt address of V12-H5 | Read. Open the two receipts again. | No dependency line in the history; E's handover line; the link receipt with Current "Met" and no instruction; the direct external receipt with its record and Current facts, no instruction. | A55, A67 | L |
| V12-X1 | `syn-ta-2`; OP2; `operator-3`; SA2 | Open TA-07 of Q and T; OP-04p and OP-06 of Q; the same pages with the read grant; the SuperAdmin case and delivery pages of Q, H, E and T; foreign ids. Harness: posts of §2 isolation items. | Not-found or SH-02; read-only for `operator-3`; no SuperAdmin control; nothing recorded. | A10 (8), A21 (5), A27 (4), A34 (2), A52, A61, A63, A66 | L |
| V12-X2 | Test | A06, A11, A12, A14 (fixture run), A15, A20, A23, A28 (duplicate), A34 (3), A36 (1), A38 (8) to (10), A41 (4), A42 (returned), A44, A51, A54, A56, A57, A59, A60, A63 (support view), A64, A65. | As the items. | as listed | T |
| V12-X3 | axe | Every WP-10 page visited. | No serious or critical violation at 1440 px and 390 px. | A80 to A99 | L |

Proof split: V12 passes when V12-D1 to V12-D12, V12-Q0 to V12-Q10, V12-H1 to V12-H6, V12-X1 and V12-X3 pass on
`lane-ui` at the integrated WP-10 commit and V12-X2 passes as named tests. A04 passes with the decision of Q-02 named in
the run record; A37 and A43 are "partly met" for the requirement text until Q-01 is served; A52 (SA-02 "Dependency
waits") is recorded "Deferred". The run record names the `lane-ui` ref, the run tag, Y's identifier, each test, the
identifiers (internal record only) and every delta.

## 4. Scenario parts outside this proof (traceability)

| Scenario part | Where it is proven |
|---|---|
| V12: the handoff authorization, evidence words and "no government filing claim for a handoff" | WP-07 (WP07-A72, A164; F-06); WP-10 observes them in V12-H2, V12-H3 |
| V12: the mode words in the OP-02 band and the External actions mode sentences | WP-07 (WP07-A14, A50) |
| V12: Gate 2 does not apply to preparation-only and provider services | WP-07 (WP07-A101); WP-06 (WP06-A64) |
| V12: no official-result form for preparation-only; a forced send refused | WP-08 (WP08-A02, A03 (4)); observed in V12-Q10 |
| The travel agent's packet download and its replay (K-BYTE) | WP-08 (WP08-A72); set-up in V12-Q8 |
| OP-06 file rows (the released packet; availability) | WP-08 (WP08-A35) |
| OP-07 completion request and its boundary wording | WP-08 (WP08-A51 to A60); WP-10 checks only the delivery prerequisite facts (A36) |
| The readiness checklist row for declared prerequisites (existence) and the readiness basis | WP-07 (WP07-A18, A26); WP-10 checks the exact evidence words (A47) |
| The SA-09 readiness exception for the packet release | WP-07 (WP07-A167) |
| No SuperAdmin release control | WP-07 (WP07-A117); WP-06 (WP06-A109) |
| Originals register and custody of physical routes | WP-12 |
| Incidents (association, post-handover follow-up, dependency follow-up after a filed dependent) | WP-14 |
| SA-02 "Dependency waits"; delivery and closure ownership | Deferred (Q-08); WP-19 for delivery ownership (V15) |
| Preparation-only post-handover policy and dependent-result evidence (BS B44 parked) | Boundary shown in A38 (9); policy is Max's |
| The TA notice list and notice page rendering | WP-08 (TA-10); WP-10 checks the text of the packet notice (A67) |

## 5. Out of scope and boundaries

These MUST NOT appear on any WP-10 page:

- A text that says TravelMudra files a preparation-only application, or that claims a government result, a filing or
  an awaited authority result for it (BS B04; UX §3.2).
- A text, label, banner or receipt that calls a provider handoff a filing, or that records the provider's filing as a
  second handoff evidence (F-06; BS B04).
- An original-custody control on a preparation-only application (BS B04, B30).
- A packet build or release control on a TravelMudra-filed or provider-filed application.
- A "Build the packet" or "Build again" offer where Core refuses it, or its absence where Core accepts it, beyond the
  decision of Q-04.
- A B46 or "not decided" boundary on the packet release (LD-05; DECISIONS §1.5).
- A release receipt that lists per-file results that Core did not return; a page that lists the packet's contents as
  read facts (Q-05).
- "Delivered", "Received" or "through Send result" outside the WP-08 rules (E-06, E-12); a direct external record or a
  physical handover presented as meeting a delivery duty that Core reports as unmet (E-05).
- A semantic duplicate guard that Core does not have (WP-09 G-03).
- On a staff page of a dependent: any fact of the upstream application beyond Core's dependency row (UX §3.2).
- A link or unlink control where Core's editor rule refuses it; a link form for a relation that is already linked.
- A receipt that names a result the operation does not establish, an accepted time, or an instruction to act from an
  older state (C-03; P-02; F-01).
- Earlier facts on a page after an optional read was refused for access (LD-14).
- A silent truncation of evidence rows or any other form row (D-10; E-04).
- A read marker on a notice (LD-06); a count shown as "0" when it is unknown (D7).
- A SuperAdmin build, release, handover, delivery-record, link or unlink control (BS B18; UX §2.3).

Deferred in WP-10 (each item says where it lands; the run record lists them as "Deferred"):

- SA-02 "Dependency waits" (Q-08): no read lists dependency waits.
- The TA-side requirement of a declared relation (required outcome, exact artifact, conditioned actions): A37 and A43
  partly met until Q-01 is served (P-05 widened scope, Max).
- The provider-filing evidence record: A04 shows the decision of Q-02; a separate fact is a Kind 2 change for Max.
- The packet's file list and the build failure reason (Q-05): neutral words until a read serves them.
- Command identity and accepted time in receipts (P-10 b, P-02): neutral receipts where §0.2 says so (A40, A54).
- The operator's view of a declared relation that the travel agent did not link (Q-03).

Not in WP-10 (later or earlier packages):

- `core.authorize_external_act` and `ops.record_act_evidence` for the provider handoff: WP-07.
- `ops.record_official_result`, `ops.record_artifact`, the TA download, `dlv.record_manual_email`,
  `dlv.manual_resend`, OP-07: WP-08.
- `core.report_problem`, `core.resolve_hold`: WP-09.
- Originals commands: WP-12. Incidents: WP-14. Delivery ownership views (V15, V16): WP-19.
- Bulk pages: WP-04, WP-05, WP-18.

## 6. Questions for the architect (ranked)

No P0 was found.

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
| Decision of Q-02 used for A04 | |
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
| V12 proof (to its boundary) | | | |
