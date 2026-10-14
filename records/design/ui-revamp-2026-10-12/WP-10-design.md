# WP-10 design review: service shapes and dependency

Lane `ui-revamp-2026-10-12`. Author: Principal UX Engineer (Claude Opus subagent). Date: 13 October 2026.
Status: design before code, for the architect's decision (LD-12) and the independent design review (LD-13: WP-10
holds commands that release bytes to the travel agent, record an outcome through a handover, record delivery facts and
change which application another one waits on, so a Codex design review applies).
Product base: lane repository at e9e96e3 (WP-01 shell and result components, WP-20 public site, WP-02 U0 decision and
panel components, WP-02 U1 Services, WP-03 U6 seal). WP-03, WP-06, WP-07, WP-08 and WP-09 are designed and not yet
built; this design depends on their units named in §1.7 and amends three of them (§1.8). This document writes no
product code. Paths in `file:line` form are relative to the lane repository at e9e96e3 unless they start with `REC/`
(`internal/records/`) or `RM` (lane `research/route-map.md`). Code is read as committed (`git show HEAD:<path>`).

Writing style: ASD-STE100 at about 75%. `MUST`, `MUST NOT`, `SHOULD` and `MAY` have their normative meaning.
"Current" means the code at e9e96e3. "Target" means the specification or the plan. "Core decides" means the page
shows Core's answer and computes no permission or business fact (D4, D5).

## 0. Summary for the architect

- **Scope.** Six register commands (COMMAND-COVERAGE §3, §5.1): `ops.request_packet_build`, `core.release_packet`
  (LD-05: an available action under its existing preconditions), `dlv.record_handover`, `dlv.record_direct_external`,
  `core.link_dependency`, `core.unlink_dependency`. The service shapes of V12 across the operator and travel-agent
  pages: filed by TravelMudra, filed by a declared provider (a handoff is not a filing), preparation only (packet
  outcome, no originals, no claimed government result), and direct external delivery (a declared delivery-evidence
  kind, not a service mode). The dependency panel on TA-07 (CC-06) and every operator place that shows a dependency.
- **Page model.** One host page per command (CC-12, CC-13): TA-07l Related applications `/ta/applications/:id/dependencies`
  (link and unlink), OP-04p Packet `/ops/applications/:id/packet` (build and rebuild), OP-04r Release the packet
  `/ops/applications/:id/packet/release` (release), OP-06h Record a handover `/ops/applications/:id/handovers`,
  OP-06e Record a direct external delivery `/ops/applications/:id/direct-external`. Four are GET pages on the POST path
  of their one form (WP-06/07/09 pattern); OP-04p is a new GET path. No form action changes. One new hidden field:
  `supersedePacketId` on the build form (an existing contract input, D-W10-02). The forms leave TA-07, the operator
  case page (OP-02 External actions after WP-07) and OP-06.
- **Rules the pages state (Core facts, not page rules).** A packet holds the accepted version of each mandatory
  document at its build; Core refuses its release when any of them changed since (`packet_stale`), and checks every
  document again at each download. A packet is released once per application; no new packet is built after the
  release. The packet handover records the outcome Prepared and handed over; no government result is claimed. A
  provider handoff records the handoff only; the provider files. A direct external delivery is an attributed record
  that claims no TravelMudra-held result. A declared dependency waits for the related application's exact declared
  outcome and, where declared, its exact result-document type, verified for that application.
- **Findings worked (§9.1).** No rebuild is ever offered, so a packet that went stale after a document change has no
  route (F-W10-01, P1); "Build the packet" shows while a packet is building or released (F-W10-02); the release is a
  one-line disclosure with no review (F-W10-09); the unlink command has no page (F-W10-06); a duplicate link says that
  an application already exists (F-W10-05); the travel agent reads that the packet handover records "the result"
  (F-W10-03); "The filing is evidenced" follows a provider handoff (F-W10-04); dependency waits sit in "Action now"
  although the operator cannot act (F-W10-11).
- **Amendments to designed packages (§1.8).** Nine text and mapping amendments to WP-07 (OP-01 view rule, OP-02
  action panel and checklist rows, provider-handoff after-evidence text), WP-08 (OP-05, OP-07 and TA-07r words by
  shape) and WP-03 (TA-07 section and status row). None changes a WP-07, WP-08 or WP-03 command or field.
- **STOP items (§9.4).** No P0. STOP-W10-01 (Kind 2, P1): a declared relation with no link conditions nothing in
  Core, so a dependent can be filed without its upstream; with a Kind 1 interim that needs Max's exception to
  criterion point 2. STOP-W10-02 (Kind 2, P1): no Core fact records the provider's filing apart from the handoff and
  the provider's result (UI-PLAN WP-10 "Record provider filing evidence"). Five Kind 1 or boundary notes at P2.
- **Top questions (§9.2).** Q-W10-01 the five host pages; Q-W10-02 the rebuild field; Q-W10-03 dependency waits move
  to "Waiting"; Q-W10-04 and Q-W10-05 route the two Kind 2 items to Max; Q-W10-06 link and unlink offered by Core's
  guard facts with a parity test.
- **Proof (§6).** V12 on `lane-ui` with seeded synthetic offerings of three shapes ("SYN Tourist visa preparation",
  "SYN Tourist visa via provider", "SYN Transit e-visa (needs tourist e-visa)" with "SYN Tourist e-visa"). No seeded
  offering declares direct external delivery: the proof records one as an attributed record and shows its truthful
  effect; "it satisfies the delivery requirement" is proven by test.

## 1. Scope, sources, pages, shell, commands

### 1.1 Sources read

| Source | Parts |
|---|---|
| UX spec `TARGET_PRODUCT_UX_SPEC.md` (SHA-256 b45186887cdc37f6…) | §2.1, §2.2, §2.3, §3.1 steps 6–8, §3.2 (preparation-only, third-party filed, dependency, physical route), §3.3, §4.1, §4.2, §4.4, §5.1, §5.3 (manual filing, artifact review, send result), §7.4, §8.3, §10.1, §12 V12 |
| `BUILD_SPEC.md` r2 | B04, B12, B21, B22, B24, B30, B31, B33, B35, B44, B46 |
| `UI-PLAN.md` | §1, §3.2 TA-07, §3.3 OP-02, OP-04, OP-05, OP-06, §4.2 (preparation-only, third-party filed, dependency), §5.3, §6.3, §7 (rows Release packet, Record provider handoff), §8, §10, §11, §12.2 WP-10, §13 (OC-09, B-06) |
| `DECISIONS-2026-10-10.md` | §1.5 (OC-09 closed), §3 (Kind 1 criterion, Kind 2 gate) |
| Lane records | `PLAN.md` §4 (LD-04, LD-05, LD-07, LD-13, LD-14), §7, §8, §9; `COMMAND-COVERAGE.md` §3, §5, §6 (CC-06, CC-12, CC-13), §6.1; `WP-03.md`, `WP-03-design.md` §1.5, §2.7, §3.1–§3.4; `WP-06-design.md` §2.2.5; `WP-07.md` §3, §4.1 (F-01 to F-12), §4.2 (F-13 to F-15); `WP-07-design.md` §1.2–§1.6, §2.0, §2.3–§2.5, §2.7, §2.8, §2.11–§2.13; `WP-07-acceptance.md` A50, A72, A164, Q-14; `WP-08.md` §3, §4 (E-01 to E-12); `WP-08-design.md` §1.4, §1.5, §2.0–§2.5, §2.10, §2.11, §7; `WP-08-acceptance.md` A47, A72, A117, A118; `WP-09.md` §3; `WP-09-design.md` §1.4, §2.0, §2.5; `PROPOSALS.md`; `DESIGN.md` |
| Route map (RM) | §1, §2 rows T46, T47, T56, T57, O03, O25, O26, O27, O29, O53, O54; §3.2 |
| Code (pages, routes) | `src/apps/shared/core/ta.ts:373, 604-627, 640-664`, `src/apps/edge/core/routes.ts:20-30, 146-160`, `src/apps/staff/operations/case-work.ts:134-137, 564-565`, `src/apps/staff/core/ops.ts:256-268, 462-466`, `src/apps/staff/core/case.ts:117-140, 349-362`, `src/apps/staff/delivery/routes.ts:46-60, 102-140`, `src/apps/shared/delivery/pages.ts:95-175, 486-550`, `src/apps/shared/core/shared.ts:41-53, 113-114, 152-155`, `src/web/ui/presentation.ts:120-130, 246-300` |
| Code (contracts, bindings) | `src/contracts/core.ts:89-90, 107, 167, 222-283, 286-345`; `src/contracts/operations-work.ts:57-58, 195-200`; `src/contracts/delivery.ts:67-80, 105-127, 140-161`; `src/core-api/bindings/core.ts:150-165, 210-230, 284-286, 446-494`; `src/core-api/bindings/operations-work.ts:144-147, 291`; `src/core-api/bindings/delivery.ts:159-175` |
| Code (Core behaviour only) | `src/modules/core/commands/drafts.ts:40-45, 209-306`; `src/modules/core/commands/acts.ts:219-262`; `src/modules/core/controls.ts:453-460, 581-605, 701-703`; `src/modules/core/derived.ts:27-75, 116-140, 175-225, 365-395`; `src/modules/core/writers.ts:180-230`; `src/modules/core/store.ts:339-370, 449-451`; `src/modules/delivery/packets.ts` (all); `src/modules/delivery/tasks/build-packet.ts:1-76`; `src/modules/delivery/commands/handover.ts` (all); `src/modules/delivery/handover-step.ts` (all); `src/modules/delivery/pages.ts:60-200`; `src/modules/delivery/release.ts:14-32, 200-218`; `src/modules/delivery/store.ts:219-224`; `src/modules/operations/case-work/commands/work.ts:160-207`; `src/modules/catalogue/items.ts:140-180`; `src/kernel/vocabulary/{decl,delivery,core,application,operations}.ts`; `src/kernel/guard-constraints.ts:81, 91, 105, 120`; `migrations/0300_core.sql:465-486`, `migrations/0800_delivery.sql:57-58, 272`; `catalogue/synthetic/catalogue.json` |
| Tests that pin the pages | §7.3 |

### 1.2 The service shapes as Core holds them (facts)

| Shape | Core fact | External act | Outcome and its evidence | Delivery evidence | Originals | Gate 2 | Synthetic offering (seed) |
|---|---|---|---|---|---|---|---|
| Filed by TravelMudra | `serviceMode = travelmudra_filed` | `government_submission`, `government_fee_payment` as declared; the assigned operator acts by hand | `issued`, `refused` (artifact or reference), `withdrawn`, `external_outcome_unresolved` | `tm_held_electronic` | per declaration | applies to unpaid work | "SYN Tourist e-visa", "SYN e-visa, fee paid with submission", "SYN Business visa (paper)", "SYN Paper visa with original return", "SYX Tourist e-visa" |
| Filed by a declared provider | `serviceMode = third_party_filed`; declaration item `provider` must be supported for `authorize_provider_handoff` (`items.ts:147, 176`) | `provider_handoff` only. Its evidence `filed_evidenced` records the handoff; Core uses it for the withdrawal cut-off and the external wait (`derived.ts:380-383`) | `issued`, `refused` with the declared `provider_result` artifact | `tm_held_electronic` (seed) | none (seed) | not applicable | "SYN Tourist visa via provider" (route `synthetic:provider-1`, owner-approved synthetic); "SYN Provider visa (route not approved)" (provider item parked) |
| Preparation only | `serviceMode = preparation_only` | none. Packet build (task), readiness on the built packet, release once, handover | `prepared_and_handed_over`, recorded by the packet handover in the same transaction (`handover.ts:115-118`); `withdrawn` | `packet` | none: Core refuses originals (`preparation_only_holds_no_originals`) | not applicable | "SYN Tourist visa preparation" (handover evidence `ta_retrieval_of_released_packet`) |
| Direct external delivery | `deliveryEvidence[outcome] = direct_external` (any mode); completion's `delivery` requirement then wants a handover of kind `direct_external` (`derived.ts:217-221`) | — | — | A `dlv.record_direct_external` record: `tm_held_result = false`, not system-verified | — | — | none in the seed |
| Dependency | `dependencies.relations[]`: relationship code, upstream service code, `same_applicant`, required outcome, required artifact type or none, conditioned actions | conditions the declared actions; `record_readiness` waits when an authorize action or the packet release is conditioned (`controls.ts:586-591`) | met only when the upstream outcome equals the required outcome and, when a type is declared, an eligible artifact of that type exists (`derived.ts:121-135`) | — | — | — | "SYN Transit e-visa (needs tourist e-visa)": relation `needs_tourist_evisa` → `syn_tourist_evisa`, same applicant, `issued`, `evisa_grant`, conditions `authorize_government_submission` |

Two Core facts shape the design and are not obvious from the plan:

- A declared relation conditions nothing until the travel agent links an application: controls and the pending answer
  read linked rows only (`controls.ts:586`, `derived.ts:366`, `store.ts:449-451`). STOP-W10-01.
- A packet release happens once per application (`core_packet_releases_application_key` → `packet_released`,
  `guard-constraints.ts:105`), and a released packet blocks every new build (`dlv_packets_live_uq` includes
  `released`, `migrations/0800_delivery.sql:57`). STOP-W10-04.

### 1.3 Page list

"Kept" = existing path (LD-03). "New" = new GET route and inventory entry; route ids of new routes are proposals.
"opt." = read through `optionalView` (LD-14).

| ID | Page | Path | Status | Reads |
|---|---|---|---|---|
| TA-07l | Related applications | `/ta/applications/:applicationId/dependencies` (GET beside the POST T46) | **New** (`ta.applications.dependencies`, action `application.link_dependency`, edge only; support view: not registered) | `core.ta_application` |
| TA-07 | Application (WP-03 page) | `/ta/applications/:applicationId` | WP-03 page; WP-10 rebuilds the carried "Related applications" section read only and adds one status row (§2.7) | as WP-03 |
| OP-04p | Packet | `/ops/applications/:applicationId/packet` | **New** (`ops.applications.packet`, action `application.read`) | `core.ops_case`; opt. `ops.case_work` (build offer, work started); opt. `doc.application_evidence`; opt. `dlv.delivery_page` (packet build time and size, handovers); opt. `dlv.packet_handovers` |
| OP-04r | Release the packet | `/ops/applications/:applicationId/packet/release` (GET beside the POST O26) | **New** (`ops.applications.release_form`, action `operator.release_packet`) | `core.ops_case`; opt. `doc.application_evidence`; opt. `dlv.delivery_page` |
| OP-06h | Record a handover | `/ops/applications/:applicationId/handovers` (GET beside the POST O27) | **New** (`ops.delivery.handover_form`, action `operator.record_handover`) | `core.ops_case`; `dlv.delivery_page`; opt. `dlv.packet_handovers` |
| OP-06e | Record a direct external delivery | `/ops/applications/:applicationId/direct-external` (GET beside the POST O29) | **New** (`ops.delivery.direct_external_form`, action `operator.record_direct_external`) | `core.ops_case`; opt. `dlv.delivery_page` (earlier records) |
| OP-02 | Application workspace (WP-07 page) | `/ops/applications/:applicationId?tab=` | WP-07 page; WP-10 changes action-panel rows, checklist rows, one status fact, the External actions packet panel and the Application tab "Related applications" (§2.8) | as WP-07 |
| OP-01 | My work (WP-07 page) | `/ops/work` | WP-07 page; dependency waits move to "Waiting" (§2.8, amendment AM-W10-01) | as WP-07 |
| OP-04a, OP-04b, OP-05, OP-06, OP-07 | WP-07 and WP-08 pages | as designed | Text amendments by shape (§2.9); OP-06 loses the carried WP-10 forms and links to OP-06h and OP-06e | as designed |
| TA-07r | TA-07 "Result and delivery" (WP-08 section) | `/ta/applications/:id#result` | Text amendments for preparation only and direct external delivery (§2.9) | as WP-08 |
| SA-02e | Work queues › Dependency waits (view of WP-06's SA-02a) | `/admin/queues/assignment?view=dependency_waits` | Optional, P2 (Q-W10-07): a view value on a kept page | `core.assignment_queue` (as SA-02a) |

Each new GET route validates its parameters with zod (`zWireId('app')`); a parse failure is the uniform 404. `resolve`
returns `{ type: 'application', id }`, as the POST routes on the same paths do. Query values are enumerated (SH-R06):
`from` ∈ {`applications`} on the operator pages; TA-07l takes the origin parameters TA-07 accepts (WP-03 §2.7 item 1,
WP-09 S-W09-01); SA-02a `view` ∈ {…, `dependency_waits`}. An unknown value is ignored.

### 1.4 Shell placement (WP-01 §2.2)

| Page | Rail destination (`current`) | Breadcrumb |
|---|---|---|
| TA-07l | Applications `/ta/applications` (as TA-07) | By origin, as TA-07, then "› [applicant] › Related applications" |
| OP-04p, OP-04r | `/ops/work`, or `/ops/applications` with `from=applications` (WP-07 §1.3) | "My work › [applicant] › Packet" / "… › Packet › Release" |
| OP-06h, OP-06e | `/ops/work` (as OP-06, WP-08 §1.3) | "My work › [applicant] › Result delivery › Record a handover" / "› Record a direct external delivery" |
| SA-02e | Work queues › Assignment `/admin/queues/assignment` | "Work queues › Assignment › Dependency waits" |

No rail change in WP-10. OP-04p and OP-04r carry the OP-02 frame items 1–5 (WP-07 §2.3) and no tabs, as OP-04a and
OP-04b do. OP-06h and OP-06e are full-screen task pages with the frame items 1–5 and no local strip. No nav count
changes, except that dependency waits leave the operator's count with the view rule of AM-W10-01.

### 1.5 The WP-10 commands and their pages

Field names are the current ones. `_csrf` and `_op` are on every form. "Rev" is the `_rev.<aggregate>` hidden field.

| # | Command | Route id (POST path) | Host page | Fields | Rev | Handler change |
|---|---|---|---|---|---|---|
| 1 | `ops.request_packet_build` | `ops.case_work.packet_build` (`/ops/applications/:id/packet/build`) | **OP-04p** (moved from the case page, `case-work.ts:134-137`) | `supersedePacketId` (hidden, **new on the form**, only on the rebuild form, D-W10-02) | `application` (optional at Core) | Input adds `supersedePacketId` when present (`zWireId('pkt')`, else left out); success `receiptLocation('/ops/applications/<id>/packet', 'packet', key)`; refusal re-renders OP-04p |
| 2 | `core.release_packet` | `ops.applications.release_packet` (`/ops/applications/:id/packet/release`) | **OP-04r** (moved from the case page, `ops.ts:260-268`) | `packetId` (hidden, from `core.ops_case.packet`) | `application`, `hold`, `material` | Success `receiptLocation('/ops/applications/<id>/packet/release', 'released', key)`; refusal re-renders OP-04r |
| 3 | `dlv.record_handover` | `ops.delivery.handover` (`/ops/applications/:id/handovers`) | **OP-06h** (moved from OP-06, `pages.ts:506-524`) | `kind` (radio: `packet:<pkt>` or `physical`, D-W10-07), `recipientKind` (radio), `recipientDetail`, `evidence.0.kind`, `evidence.0.id`, `eventDate` | — | Success `receiptLocation('/ops/applications/<id>/handovers', 'handover', key)`; refusal re-renders OP-06h with every typed value |
| 4 | `dlv.record_direct_external` | `ops.delivery.direct_external` (`/ops/applications/:id/direct-external`) | **OP-06e** (moved from OP-06, `pages.ts:538-549`) | `externalReference`, `recipientDetail`, `evidence.0.kind`, `evidence.0.id`, `eventDate` | — | Success `receiptLocation('/ops/applications/<id>/direct-external', 'direct_external', key)`; refusal re-renders OP-06e with every typed value |
| 5 | `core.link_dependency` | `ta.applications.link_dependency` (`/ta/applications/:id/dependencies`) | **TA-07l** (moved from the TA-07 disclosure, `ta.ts:617-627`) | `relationshipCode` (radio; hidden when one relation is declared, D-W10-08), `upstreamApplicationId` (radio) | `application` | Success `receiptLocation('/ta/applications/<id>/dependencies', 'linked', key)` with the origin kept; refusal re-renders TA-07l with both choices kept |
| 6 | `core.unlink_dependency` | `ta.applications.unlink_dependency` (`/ta/applications/:id/dependencies/:dependencyId/unlink`) | **TA-07l** (no host today, F-W10-06) | — | `application` | Success `receiptLocation('/ta/applications/<id>/dependencies', 'unlinked', key)`; refusal re-renders TA-07l |

Each command has exactly one host page, so a refusal always re-renders the page it came from. The two dependency
commands share one host. UI-PLAN §12.2 also names "Record provider handoff" and "Record provider filing evidence" for
WP-10: the first is WP-07's `core.authorize_external_act` and `ops.record_act_evidence` for the act kind
`provider_handoff` on OP-04a and OP-04b (one command, one page; WP-07 Q-14); the second has no Core command
(STOP-W10-02). WP-10 adds the provider wording only (§2.9).

### 1.6 Forms that leave pages, and carried forms

| Form | Leaves | Link that replaces it |
|---|---|---|
| Build the packet (`case-work.ts:134-137`) | Operator case page; after WP-07 the OP-02 External actions tab (WP-07 §1.5 carried it there) | External actions "Packet" panel: "Open the packet page" → OP-04p; action panel rows (§2.8) |
| Release the packet (`ops.ts:263-268`) | Same | "Release the packet to the travel agent" → OP-04r (from OP-04p and the action panel) |
| Record a handover (`pages.ts:506-524`) | OP-06 "Other delivery records" (WP-08 §1.5 carried it there) | "Record a handover" → OP-06h; OP-04p "Record the packet handover" → OP-06h |
| Record a direct external delivery (`pages.ts:538-549`) | OP-06 "Other delivery records" | "Record a delivery made directly by an external party" → OP-06e |
| Link a related application (`ta.ts:617-627`) | TA-07 "Related applications" (WP-03 carried it) | "Link or unlink a related application" → TA-07l |

Carried on WP-10 pages: none. The handover precondition callout of today (`pages.ts:502-505`) moves to OP-06h with the
handover form. OP-06 keeps the list of earlier records (WP-08 `attemptRows`).

### 1.7 Shared components and dependencies

Reused, no new variant: WP-01 CMP-07 (`errorSummary`), CMP-08 (`operationReceipt`, `receiptLocation`, `readReceipt`,
`receiptDocumentTitle`), CMP-10 (`boundaryNotice`, `unavailableButton`), CMP-12 (`freshness`), CMP-13 (operation
status page), CMP-14 (`staleComparison`). WP-02 U0: CMP-25 `decisionPage` (task-page order), CMP-01 `actionPanel`,
`statusFacts`. WP-03 U0: CMP-02 `evidenceRows`, CMP-11 `identityBand`. WP-07 U0: the OP-02 frame
(`src/apps/staff/work/frame.ts`), the operator reading (`src/apps/staff/work/reading.ts`), CMP-15 readiness rows.
WP-08 U0: CMP-18 `fileRows`, `attemptRows`, `deliveryFacts` (`src/web/ui/delivery.ts`). WP-09 U2: the unsent text
block. Existing: `choiceGroup`, `textField`, `selectField`, `confirmDisclosure`, `summaryList`, `dataTable`,
`identifier`, `timeAt`.

No new component. One new word module (U0, §7.1): `src/apps/shared/core/shapes.ts` holds the closed word tables of
§2.11 and the WP-10 refusal table of §2.14, for both audiences.

Dependency: WP-10 builds after WP-03 U0 and U3, WP-07 U0, U2 and U4, WP-08 U0, U2 and U3, and WP-09 U4 are
integrated (package order of PLAN §3: WP-10 follows WP-09). WP-10 MUST NOT build a second frame, task frame, band or
file row.

### 1.8 Amendments to designed packages

Found while designing WP-10. Each binds the build of the named package if it is not built yet; otherwise WP-10 U4 or
U5 applies it (§7.1). The architect records them in the package records, as WP-09 did with F-13 to F-15.

| ID | Package, place | Rank | Amendment |
|---|---|---|---|
| AM-W10-01 | WP-07 §2.1 OP-01 view membership; `workItemNeedsAttention` | P1 | A row whose `pending.nextActionCode` is `await_dependency` or `supply_dependency_evidence` belongs to "Waiting", whatever the owner kind. Owner label "Waiting on a related application". The navigation count uses the same mapping (WP-07 F-07 class). |
| AM-W10-02 | WP-07 §2.4.5 action panel | P1 | Rows of §2.8 item 2: build first (`packet_not_built`, `packet_stale` on the readiness offer), release (row 8 target OP-04r), packet handover (by the handover step), dependency waits. |
| AM-W10-03 | WP-07 §2.4.2 checklist "Declared prerequisites"; §2.5.1 Application tab | P1 | Row words of §2.11.3 (exact required outcome and result-document type, owner from Core's pending answer); the "Related applications" table names the type, not "its official document". |
| AM-W10-04 | WP-07 §2.3 frame item 5 | P2 | Status fact "Packet" for a preparation-only service (§2.8 item 1). |
| AM-W10-05 | WP-07 acceptance A72 and the OP-04b after-evidence text for `provider_handoff` | P1 | Replace "its filing evidence is recorded separately" by the §2.11.1 text: the provider files; TravelMudra learns of it through the provider's result, recorded on Outcome and result file. No page names a provider-filing record that does not exist (STOP-W10-02). |
| AM-W10-06 | WP-07 reading; `CORE_MESSAGES` (`shared.ts:41, 46`) | P1 | Staff sentence by shape for `awaiting_external_result` and `filing_possibly_occurred` when the only possibly-filed or filed act is a `provider_handoff`; travel-agent sentences neutral (§2.11.1). |
| AM-W10-07 | WP-08 §2.1 OP-05 | P1 | Third-party line under "Record the official outcome"; `filing_not_evidenced` sentence by shape (§2.9). |
| AM-W10-08 | WP-08 §2.4 OP-07 owner table; §2.11 travel-agent prerequisite sentences | P2 | `delivery` row "Where" by channel: packet → OP-06h, direct external → OP-06e; `no_possible_filing` words by shape. |
| AM-W10-09 | WP-08 §2.5 TA-07r states | P1 | Preparation-only states before and after the handover (§2.9); the direct-external row text no longer claims that TravelMudra holds no result file (E-05 class). |
| AM-W10-10 | WP-03 §2.7 item 11, §3.4 | P1 | "Related applications" becomes the read-only section of §2.7 with a link to TA-07l; status row "Needs [relation]". |

## 2. Page specifications

### 2.0 Rules common to every WP-10 page

- **Freshness (LD-08).** Every WP-10 read is authoritative. Pages show CMP-12 "Read at [time] IST". OP-04p shows no
  age of a building packet and applies no threshold.
- **Page states.** S1: pages are rendered complete by the server; no skeleton exists. S6 and S7: SH-02 pages of WP-01
  (uniform 404 without object facts; Core unreachable: neutral "TravelMudra is unavailable now"; "Nothing was sent, so
  nothing changed" only after a proven refusal). Each page below lists its own states.
- **Optional reads (LD-14).** Only through `optionalView`. An availability failure renders "Unavailable" in place of
  each fact the read supplies. Every other refusal reaches the shell, so a reassignment, a revoked grant or a
  suspension removes the page on the next read (B10, SH-R04). No page code catches every error. OP-04r applies the
  WP-07 F-04 rule: when the documents read is unavailable, the release form is removed with a notice; the facts stay.
- **Command results.** ACC: 303 to the host page with `?done=<code>&op=<key>`; CMP-08 first in `main`; its title first
  in the document title. A receipt names a result only when `core.operation` returns the expected resource id and the
  command-specific summary fields (§2.12); records are selected by the ids it returns; every later read is labelled
  "Current". Otherwise the receipt is neutral: "Request recorded" (WP-06 D-02; P-10 b pending, S-08). REJ: the host page
  re-rendered at the POST address with `restorePath` = the GET page, the category's status, CMP-07 focused, every
  typed value kept; sentences from §2.14; an unknown code shows the category text plus "Reference code: [code]" (staff)
  or "Reference: [code]" (travel agent). When the refusal shows that the form no longer applies, the page shows the
  new state and the WP-09 unsent text block for typed text. C5: CMP-14 (§2.13). UNR: 303 to
  `/<ta|ops>/operations/<key>`; "Open the result" goes to TA-07 or OP-02 (`resultHrefOf`, unchanged); no page offers a
  new submission of the same intent while it is unresolved.
- **K rules.** All six commands: K-STD. The release is a Core command, not a byte release; the travel agent's packet
  download is the byte release (K-BYTE, WP-08 §3) (D-W10-05). A form carries one `_op` from page load; a browser
  resend reuses it; a re-render after a refusal issues a new `_op`.
- **Core decides.** A form shows only where Core offers the action: `ops.case_work.offers.buildPacket` (build and
  rebuild), `core.ops_case.releaseOffer` (release), `dlv.delivery_page.offers.recordHandover` (packet handover),
  `offers` not null (physical handover; Core evaluates no offer for it), `offers.recordDirectExternal` (direct external). The delivery read's `offers` are the same for every operator reader (`modules/delivery/pages.ts:190-198`), so the delivery task pages also require `core.ops_case.viewerAssigned` (WP-07 §2.0); Core refuses any other actor (`OPERATOR_ASG`).
  The choice between the build and the rebuild form reads the packet state, a Core fact (§2.2). Link and unlink have no
  Core evaluation on the travel agent's read: the page offers them by Core's guard facts with a parity test (Q-W10-06,
  D-W10-09); Core decides at the command.
- **Copy.** UI-PLAN §11. Every time carries "IST". Synthetic data shows "Synthetic" (CR-08). Forbidden on WP-10
  pages: "File visa", "Override", "Ready" or "Approved" as an overall status, "Received" or "Delivered" for a download
  or a packet handover, "result" for a packet or its handover except in negation ("claims no government result"),
  "filed", "filing" or "reached the authority" for a provider handoff, "not decided" for the packet release (LD-05),
  "Something went wrong". "Delivered directly by an external party" is allowed for a recorded direct external delivery
  (WP-08 E-12). All copy is draft (CR-09).
- **Read grants and support view.** A read-grant reader sees OP-04p, OP-04r, OP-06h and OP-06e with the frame, the
  facts and the line "Only the assigned operator takes this step. You can read this application." and no form (WP-07
  §2.0). The `/ops` pages are not reachable in a support view (409 `support_view_active`). TA-07l is not registered at
  staff; TA-07's section renders read only in a support view.
- **Mobile (< 768 px).** One column. OP-04r, OP-06h, OP-06e and TA-07l are full-screen task pages: scope and effect
  before the fields; the primary action at the end of the form, never in a fixed bar (UX §7.3). OP-04p puts the packet
  state, then the next action, then the documents.

### 2.1 Service shapes across pages (the V12 words)

The table states what each page shows per shape. Words in quotes are the closed texts of §2.11. A cell "—" means the
page shows nothing for that shape.

| Page, part | Filed by TravelMudra | Filed by a declared provider | Preparation only | Direct external delivery (an outcome's declared delivery) |
|---|---|---|---|---|
| OP-02 band meta "Kind" (WP-07) | "Filed by TravelMudra" | "Filed by a declared provider" | "Preparation only" | — |
| OP-02 External actions context line | WP-07 line | "You hand the application to the declared provider. The provider files with the authority. A handoff is not a filing." | "No external act: the work ends in a packet for the travel agent, who files. TravelMudra performs no government act, holds no originals and claims no government result." + Packet panel (§2.8 item 5) | — |
| OP-02 status fact | External acts | External acts with handoff words ("Handed to the provider (evidence recorded)") | "Packet: [state]" (AM-W10-04); no External acts row ("None for this service") | — |
| OP-04a/b (WP-07) | WP-07 | Handoff words (WP-07 F-06) and AM-W10-05 | "This service has no external act." (WP-07 state) | — |
| OP-04p, OP-04r | "This service does not end in a packet." No form | same | §2.2, §2.3 | — |
| OP-05 (WP-08) | WP-08 | AM-W10-07: "The declared provider files with the authority. Record the outcome and the provider's result file when it arrives. The handoff record is not evidence of the outcome." | WP-08: no outcome form; "This service ends with a packet handover. Its outcome is recorded with the handover." | — |
| OP-06h | Physical handover only | Physical handover only | Packet handover when Core offers it; physical | — |
| OP-06e | Offered (Core offers it on every application); effect text of §2.5 | same | same | Counts toward "Delivery of the result" when the service declares it for the recorded outcome (Core's requirement row shows it) |
| OP-07 `delivery` row (WP-08) | "through Send result" (E-06) | same | "the packet handover" → OP-06h | "the recorded direct external delivery" → OP-06e |
| OP-09 originals (WP-12) | per declaration | per declaration | not shown (Core refuses originals) | — |
| TA-07 Next sentence after the external step | "TravelMudra's external step is done. The result is awaited from the authority or the provider." (neutral, STOP-W10-07) | same | — | — |
| TA-07r (WP-08) | WP-08 | WP-08 (provider's result is an official result) | AM-W10-09: packet row; "Outcome: Prepared and handed over. TravelMudra claims no government result for this application." | AM-W10-09: "Delivered directly by an external party. This record names no file held by TravelMudra." |
| TA-07 Originals (WP-12) | per declaration | per declaration | absent (`originals = null`) | — |

### 2.2 OP-04p Packet `/ops/applications/:applicationId/packet`

Purpose: build the packet from the accepted documents, see its state and reach the release and the handover (UX §3.2
"Preparation-only: Work ends in a validated packet through the TA"; BS B04, B22, B30; UI-PLAN §4.2).

Anatomy (reading order):

1. OP-02 frame items 1–5 (WP-07 §2.3); page title "Packet". Receipt (`packet`, §2.12).
2. Mode line (info tone, text): "Preparation only. TravelMudra prepares a validated packet for the travel agent, who
   files with the authority. TravelMudra performs no government act, holds no originals and claims no government
   result."
3. `h2` "Packet now" (`statusFacts`, each its own row):
   - State: §2.11.2 packet words from `core.ops_case.packet` (`null` → "Not built"); "Built [time] IST, [size]" when
     `dlv.delivery_page.packet.builtAt` and `sizeBytes` are read; else "Built".
   - Packet reference: `identifier` of `packetId` (copy), when a packet exists.
   - Release: "Not released" / "Released to the travel agent" (state `released`).
   - Handover: §2.11.2 handover words from `dlv.packet_handovers` (step) and `dlv.delivery_page.handovers` (a
     `packet` record): "Not applicable before the release"; "Waiting for the travel agent's download"; "Can be
     recorded now"; "Recorded [time] IST: system-verified" / "Recorded [time] IST: attributed record"; "Unavailable".
   - Outcome: the outcome row of the frame (no second row).
4. Next action line (CMP-01 compact, from Core facts in this order):
   - `releaseOffer.allowed` and state `built` → "Release the packet to the travel agent" (button link to OP-04r).
   - state `released` and handover step `record_handover` → "Record the packet handover" (link to OP-06h).
   - state `released` and step `ta_download` → "Waiting on the travel agent: download the packet." No action.
   - state `built` and `releaseOffer` blocked → "Releasing is unavailable now:" then the blocker sentences (§2.14) with
     owner and route; `packet_stale` routes to item 6 ("Build the packet again").
   - Otherwise: nothing.
5. `h2` "What the packet holds" (`id="documents"`): lead "A packet holds the accepted version of each mandatory
   document as it was when the packet was built. TravelMudra never swaps a file inside a built packet. If one of them
   changes, TravelMudra refuses the release and you build the packet again." Then CMP-02 rows (staff words) of the
   mandatory requirements from `doc.application_evidence`, captioned "Mandatory documents now". The packet's own
   version list is not in the read (STOP-W10-03); the page MUST NOT label the current rows as the packet's contents.
   Unavailable → "Documents cannot be read now."
6. `h2` "Build the packet" (`id="build"`), only when `ops.case_work.offers.buildPacket ≠ null` (assigned operator,
   submitted open preparation-only application). Form choice by packet state:
   - `packet = null`: build form. Text: "TravelMudra builds the packet in the background from the accepted version of
     each mandatory document. Every mandatory document must be accepted first." Hidden `_rev.application`. Button
     "Build the packet".
   - `packet.state = built`: rebuild form (`id="rebuild"`). Text: "Build the packet again from the current accepted
     documents. The packet [reference] is then replaced and never released. Confirm readiness again after the new
     build." Hidden `supersedePacketId` = `packet.packetId`, `_rev.application`. Button "Build the packet again"
     (secondary unless `releaseOffer` carries `packet_stale`, then primary).
   - `packet.state = building`: no form. "The packet is being built. This page does not update by itself: check
     again." Link "Check again" (GET of this page).
   - `packet.state = released`: no form. "The packet is released. A new packet cannot be built after the release."
     (STOP-W10-04 boundary when a document of the released packet became unavailable, §4.3.)
   - `offers.buildPacket.allowed = false`: CMP-10 with the blocker sentences and routes (`operator_work_not_started` →
     "Start work first" → OP-02 Work; `gate1_*` → WP-07 §2.6.3 route; holds → OP-02 Work › Holds). No form.
   - `ops.case_work` unavailable: the form shows with the line "The build check cannot be read now. TravelMudra checks
     everything when you build." (Core decides; a build is replaceable, unlike the release.)
7. `h2` "After the packet": "Readiness: confirm readiness on OP-02 Work once the packet is built. A new build makes an
   earlier readiness judgement out of date." Links "Readiness" (OP-02 `?tab=work#readiness`), "Result delivery"
   (OP-06), "Request completion" (OP-07).

States (first match):

| State | Condition (Core facts) | Copy and controls |
|---|---|---|
| Not this shape | `offering.serviceMode ≠ preparation_only` | Frame; "This service does not end in a packet. [Kind words]." Link "External actions" (OP-02 `?tab=acts`). No form |
| Not the assigned operator | `viewerAssigned = false` | Frame, items 2, 3, 5; the §2.0 line; no form, no action links |
| Closed | `lifecycle ∉ {draft, submitted}` | Items 2, 3; "This application is closed." No form |
| Draft | `lifecycle = draft` | "The packet is built after the travel agent submits the application." No form |
| Build receipt, packet gone | done `packet` and `core.ops_case.packet = null` | Receipt current line: "The packet [summary reference] is not being built and is not built now: the build did not finish. Build again." (§2.12) |
| C3 `packet` | — | Receipt (§2.12) |
| C2 | — | §2.14; build refusal re-renders this page with the current state |
| C5 | `_rev.application` | CMP-14 (§2.13) |

### 2.3 OP-04r Release the packet `/ops/applications/:applicationId/packet/release`

Purpose: release the built packet to the travel agent once, after a review (UX §5.3 review-and-confirm; UI-PLAN §7
"Release packet … per-file B12 recheck at release"; LD-05). CMP-25 task order: Scope → Evidence → Effect → Your
decision → Review → buttons.

1. OP-02 frame items 1–5; `h1` "Release the packet: [applicant]".
2. `h2` "Scope": Application [reference] · Service · Kind "Preparation only" · Travel agent · Operator: you. "Release:
   packet [reference], built [time] IST, to the travel agent of this application. A packet is released once."
3. `h2` "Evidence":
   - "Mandatory documents now" (CMP-02 rows, as OP-04p item 5) with the line "The packet holds the versions accepted
     when it was built. TravelMudra compares them with these at the release."
   - Readiness: "Recorded by [name] at [time] IST" with its state (`VALIDITY_LABELS` staff words); "Recorded by the
     previous operator" adds "A SuperAdmin may grant a readiness exception for the packet release." (link text only;
     WP-07 SA-09 kind `readiness_packet_release` is the SuperAdmin's page).
   - Holds: "None open" or each open hold by name.
   - Declared prerequisites: the dependency rows of §2.11.3 when `case.dependencies` is not empty.
4. `h2` "Effect" (visible, not in `<details>`):
   - "When you release: TravelMudra checks again, at that moment, the readiness judgement, open holds, declared
     prerequisites and every document of the packet against the current accepted documents. If any document changed
     since the build, nothing is released."
   - "The travel agent is notified that the packet is available and downloads it from the application. Each download
     checks every document of the packet again; a document that is no longer releasable stops the download, and
     nothing is sent in its place."
   - "After the release, the application's documents and details are historical: they do not change. A new packet
     cannot be built for this application."
   - "Releasing records no filing and no government result. The outcome Prepared and handed over is recorded with the
     packet handover."
5. `h2` "Your decision": hidden `packetId` (= `core.ops_case.packet.packetId`), `_rev.application`, `_rev.hold`,
   `_rev.material`. No typed field and no confirmation checkbox (D-W10-11).
6. Review (visible): "When you release it: the travel agent can download packet [reference] at once; your name and the
   time are recorded with the readiness judgement it rests on."
7. Buttons "Release the packet to the travel agent" (primary); "Cancel" → OP-04p.

States (first match):

| State | Condition (Core facts) | Copy and controls |
|---|---|---|
| Not this shape | `serviceMode ≠ preparation_only` | "This service does not end in a packet." No form |
| Not the assigned operator | `viewerAssigned = false` | Frame and items 2–3; the §2.0 line; no form |
| Released | `packet.state = released` | "Packet [reference] was released to the travel agent." Handover line (§2.11.2) and link to OP-06h when Core offers it. No form |
| No packet | `packet = null` or `building` | "Build the packet first." / "The packet is being built. Release it when it is built." Link OP-04p. No form |
| Blocked | `releaseOffer.allowed = false` | CMP-10 per blocker in WP-07 checklist order, each with reason, owner and route (§2.14): `packet_stale` → "A document changed after the packet was built. Owner: you. Build the packet again (Packet page), then confirm readiness again."; readiness codes → OP-02 Work; holds → OP-02r or OP-03r; `dependency_*` → "Waiting on a related application" (no route; §2.11.3); offering-item codes → "Owner: TravelMudra". `unavailableButton` "Release the packet to the travel agent" described by the notices (AC-13). No form |
| Documents unavailable | `doc.application_evidence` availability failure | Items 1–3 with "Documents cannot be read now."; CMP-10 "The release review is incomplete: the documents cannot be read now. Try again later. Owner: TravelMudra." No form (WP-07 F-04) |
| Allowed | `releaseOffer.allowed = true`, `packet.state = built` | Items 4–7 |
| C3 `released` | — | Receipt (§2.12); then the Released state |
| C2 | — | §2.14 |
| C5 | `_rev.*` or `stale_revision`/`packet_stale` | CMP-14 (§2.13) |

### 2.4 OP-06h Record a handover `/ops/applications/:applicationId/handovers`

Purpose: record what TravelMudra handed to the travel agent outside a system send, and for preparation-only work the
packet handover that records the outcome (UX §3.2; BS B04, B24, B31).

1. OP-02 frame items 1–5; `h1` "Record a handover: [applicant]".
2. `h2` "Scope": "A record of a handover to the travel agent. It releases no file. Your name, the evidence and the time
   are kept."
3. `h2` "Evidence": Packet (state §2.11.2; reference); "Sent in full to the travel agent's own download: Yes, [time]
   IST / Not yet / Unavailable" (from `dlv.packet_handovers.sentInFull`, or the newest streamed packet retrieval of
   `dlv.delivery_page.retrievals` whose `recipientAccountId` is the travel agent); earlier handover records
   (`attemptRows` of the `packet` and `physical` handovers, WP-08 CMP-18).
4. Precondition notice (only when `offers.recordHandover` is blocked with `handover_evidence_missing`): CMP-10
   "Recording the packet handover is unavailable until the packet is sent in full to the travel agent's own download.
   Owner: the travel agent. They download it from the application." Today's callout text (`pages.ts:502-505`) is
   replaced; the meaning is unchanged.
5. `h2` "What was handed over" (`kind`, radio group, none preselected, D-W10-07):
   - "The released preparation packet [reference]" (`packet:<pktId>`), only when `offers.recordHandover.allowed`.
   - "Physical documents, not originals" (`physical`), whenever `offers ≠ null` and the viewer is assigned.
6. "Handed to" (`recipientKind`, radio, none preselected): "The travel agent, on their account"
   (`owning_ta_account`); "The travel agent's representative, in person" (`ta_representative_in_person`). "Name of the
   person, for a handover in person" (`recipientDetail`, optional, maxlength 254).
7. Evidence (`evidence.0.kind`: External reference, Document reference, Attestation; `evidence.0.id`, hint "A
   reference you can find again, such as a receipt number."); "Date of the handover" (`eventDate`, optional).
8. `h2` "Effect" (visible):
   - Packet: "A packet handover is system-verified only when the packet was sent in full to the travel agent's own
     download. When no outcome is recorded yet, TravelMudra records the outcome Prepared and handed over in the same
     step. No government result is claimed. A packet is handed over once."
   - Physical: "An attributed record, not system-verified. It does not count as the delivery this service requires;
     the delivery requirement shows on Request completion as TravelMudra evaluates it."
9. Buttons "Record the handover" (primary); "Cancel" → OP-06.

States (first match):

| State | Condition | Copy and controls |
|---|---|---|
| Not the assigned operator | `viewerAssigned = false` (the delivery read's `offers` do not depend on the viewer) | Facts; the §2.0 line; no form |
| Packet handed over | a `packet` handover record exists (`offers.recordHandover` blocked `handover_exists`) | "The packet handover was recorded [time] IST ([system-verified / attributed record])." The physical option stays |
| Packet waits for the download | `handover_evidence_missing` | Item 4; the physical option stays |
| No released packet | blocked `packet_not_released` | No packet option; for a preparation-only service the line "Release the packet first." with link OP-04r |
| C3 `handover` | — | Receipt (§2.12) |
| C2 | — | §2.14; typed values kept; `handover_exists` shows the recorded state and the unsent values |

### 2.5 OP-06e Record a direct external delivery `/ops/applications/:applicationId/direct-external`

Purpose: record that the authority or the provider delivered directly to the travel agent or the applicant, outside
TravelMudra (BS B24 "Direct external delivery records known provenance/recipient/version and truthful absence of a
TravelMudra-held result"; B31).

1. OP-02 frame items 1–5; `h1` "Record a delivery made directly by an external party: [applicant]".
2. `h2` "Scope": "A record that an external party, for example the authority or the declared provider, delivered the
   result directly. TravelMudra releases no file with this record and claims no file it holds."
3. `h2` "Evidence": Outcome (frame row); the `delivery` requirement as Core evaluates it now (`core.ops_case.completion`
   row `delivery`: "Met" or "Not met" with its code sentences, WP-08 §2.10 and §2.11); earlier direct external records
   (`dlv.delivery_page.handovers` of kind `direct_external`, "Recorded [time] IST") with the line "A second record is a
   second fact; it does not replace the first." when one exists.
4. Fields: "External reference" (`externalReference`, required, maxlength 200, hint "The external party's reference
   for the delivery, for example a dispatch number."); "Delivered to" (`recipientDetail`, optional, maxlength 254);
   Evidence (`evidence.0.kind`, `evidence.0.id`); "Date of the delivery" (`eventDate`, optional, not in the future).
5. `h2` "Effect" (visible):
   - "An attributed record, not system-verified. It counts as the delivery of the result only when this service
     declares delivery directly by an external party for the recorded outcome. Request completion then shows the
     requirement met."
   - "Record only a delivery you have evidence of. If you do not know whether the external party delivered, do not
     record it. The requirement then stays not met, and the application stays open with you as its owner."
6. Buttons "Record the direct delivery" (primary); "Cancel" → OP-06.

States: not the assigned operator (no form); `offers.recordDirectExternal` blocked (CMP-10 with Core's sentence; no
form); C3 `direct_external` (receipt §2.12); C2 (§2.14, typed values kept). No outcome recorded yet: the form stays
(Core accepts the record at any stage) and the Evidence section reads "Outcome: Outcome not recorded".

### 2.6 TA-07l Related applications `/ta/applications/:applicationId/dependencies`

Purpose: tell TravelMudra which application of the same applicant in this group this one depends on, and see what it
waits for (UX §3.2 Dependency; BS B22; CC-06).

1. Breadcrumb by origin; freshness. Receipt (`linked`, `unlinked`).
2. `h1` "Related applications: [applicant]"; meta: Application [reference], Service, Group.
3. Lead: "Some services need another application of the same applicant in this group to reach its result first.
   Linking tells TravelMudra which application that is. TravelMudra checks the link against what the service
   declares."
4. `h2` "What this service needs": one line per `relations[]` entry, "[relation words]" (§2.11.3; the relation label
   falls back to the code in words while STOP-W10-05 is open), followed by "Linked: [application]" or "Not linked".
   When `relations` is empty: "This service does not depend on another application." and no form.
5. `h2` "Linked now" (`dataTable`): one row per `dependencies[]` entry. Columns: Relation; Application (the sibling's
   label from `siblings` with a link to its TA-07; "An application of this group" when the sibling is not in the
   read); Its outcome ("Outcome not recorded" or the outcome label); State (§2.11.3 travel-agent words); Action
   ("Unlink", item 7). Empty: "No application is linked."
6. `h2` "Link an application" (`id="link"`), when the link is offered (guard facts below) and a declared relation has
   no live link:
   - Relation: when exactly one relation has no live link, its words as text and a hidden `relationshipCode`
     (D-W10-08); when several, a radio group (`relationshipCode`), none preselected, with the line "TravelMudra checks
     that the application you choose fits the relation you choose."
   - "Application in this group" (`upstreamApplicationId`, radio, none preselected): one option per sibling with
     `linkable = true`, labelled "[Surname, Given names] ([service]) · Application [reference] · [outcome or 'Outcome
     not recorded']". Siblings that are not linkable are not listed. Empty: "No application in this group can be
     linked now. An application of the same applicant for the needed service appears here once it exists. An
     application that ended with a result this service cannot use is never offered." Link "Add an application to this
     group" (TA-09c, WP-03).
   - Effect (visible): "When you link: until the linked application reaches the result this service needs, with its
     result document where the service asks for one, the steps that depend on it wait. If that application ends with
     a result this service cannot use, and no filing of this application may have happened, TravelMudra ends this
     application as Dependency failed. Any change of a link makes the operator confirm readiness again."
   - Hidden `_rev.application`. Button "Link the application".
7. Unlink, per row when unlink is offered: `confirmDisclosure` "Unlink [application]?" body "This application then no
   longer waits for it. If the service needs a related application, link the right one. The operator confirms
   readiness again." Hidden `_rev.application`; action `/ta/applications/:id/dependencies/:dependencyId/unlink`.
   Confirm label "Unlink".
8. Secondary links: "Back to the application" (TA-07, origin kept).

Guard facts (the page's mapping of Core's guards, pinned by a parity test, D-W10-09):

| Offer | Shown when (facts of `core.ta_application`) | Core guard it mirrors |
|---|---|---|
| Link | `lifecycle ∈ {draft, submitted}` and `editor_state ∈ {unassigned, returned_to_ta}` and `relations` not empty | `drafts.ts:224-229` (open, `taEditorPermits`), declared relation |
| Unlink | the same, and no act of this application may have been filed (the TA read carries no acts: the page cannot see it; Core refuses `filing_possibly_occurred`) | `drafts.ts:263-272` |

States (first match):

| State | Condition | Copy and controls |
|---|---|---|
| Closed | `lifecycle ∉ {draft, submitted}` | Items 4–5; "This application is closed. Its links do not change." No form |
| With the operator | `editor_state = assigned` | Items 4–5; "This application is with your operator. Links change only while you can change the application. Report the problem so it can be returned for correction." Link "Report a problem" (TA-07p, WP-09). No form |
| Approved help in progress | `editor_state = assistance_in_progress` | "An operator is entering information with your approval. You can change links when they return the application to you." No form |
| Open | guard facts hold | Items 4–8 |
| C3 `linked`, `unlinked` | — | Receipt (§2.12) |
| C2 | — | §2.14; both radio choices kept |
| C5 | `_rev.application` | CMP-14 (§2.13): Related applications (current rows), Editing (current) |

### 2.7 TA-07 changes (WP-03 page, WP-10 section) — AM-W10-10

1. **Section "Related applications"** (`id="related"`, replaces the carried section of `ta.ts:604-627`), shown when
   `relations` or `dependencies` is not empty: the lines of TA-07l item 4 and the table of item 5 without the Action
   column; link "Link or unlink a related application" → TA-07l, shown when the guard facts of §2.6 hold. No form.
2. **Status row** (WP-03 §2.7 item 4), one per declared relation: label "Needs [relation words]", value the
   travel-agent state words of §2.11.3 or "Not linked".
3. **Dependency failed.** When `outcome = dependency_failed`: the section adds "[Linked application] ended with a result
   this service cannot use. TravelMudra recorded the outcome Dependency failed for this application." (from the
   failed row and the outcome; no further sibling fact).
4. **Receipts.** The codes `linked` and `unlinked` leave TA-07's `doneFlash` list; they live on TA-07l.
5. **Next sentence.** The TA sentence of `awaiting_external_result` is the neutral sentence of §2.11.1 (AM-W10-06).

### 2.8 OP-02 and OP-01 changes (WP-07 pages) — AM-W10-01 to AM-W10-04

1. **Frame status fact "Packet"** (preparation only): §2.11.2 words from `core.ops_case.packet`; "Handed over: outcome
   recorded" when `outcome = prepared_and_handed_over`. The "External acts" row reads "None for this service".
2. **Action panel (WP-07 §2.4.5), closed rows added in `reading.ts`:**

   | # | Condition (Core facts) | Owner | Step | Blocker type | Action |
   |---|---|---|---|---|---|
   | 6a | `nextActionCode ∈ {record_readiness, reconfirm_readiness}` and `offers.recordReadiness` has `packet_not_built` | You | "Build the packet before you confirm readiness" | "You deal with it" | "Open the packet page" → OP-04p |
   | 6b | the same with `packet_stale` | You | "Build the packet again: a document changed after the build" | "You deal with it" | "Open the packet page" → OP-04p `#rebuild` |
   | 8 | `nextActionCode = release_packet` | You | "Release the packet to the travel agent" | — | "Release the packet" → OP-04r |
   | 8a | `reasonCode = packet_released`, `nextActionCode = record_delivery`, handover step `record_handover` | You | "Record the packet handover" | — | "Record the handover" → OP-06h |
   | 8b | the same, step `ta_download` | Travel agent | "Waiting on the travel agent: download the packet" | "Another person owns this step" | none |
   | 10a | `nextActionCode ∈ {await_dependency, supply_dependency_evidence}` | Core's owner (You, SuperAdmin, or "External evidence awaited; follow-up: you") | "Waiting for a related application: [§2.11.3 state words]" | "Another application's result is needed" | none; secondary "Related applications" → `?tab=application#related` |

   Row 8b exists today through the staff reading (`case.ts:117-140`); WP-10 keeps its words.
3. **Checklist "Declared prerequisites" (WP-07 §2.4.2)**, one row per `case.dependencies` entry: label "[relation
   words]: needs [requirement sentence]" (§2.11.3); status words of §2.11.3; owner from Core's pending answer when its
   reason is a dependency code, else "The related application's work"; route none ("The related application is not
   shown on this page."). When an act's evaluation or `releaseOffer` carries a `dependency_*` blocker, the row adds
   "Blocks: [act or 'the packet release']".
4. **OP-01 view rule (AM-W10-01).** A dependency wait is in "Waiting" (§1.8). Owner label "Waiting on a related
   application". Test: the view count and the navigation count agree.
5. **External actions tab, Packet panel** (preparation only; replaces the carried WP-10 forms): `h3` "Packet";
   state and handover words (§2.11.2); the next action of OP-04p item 4 as a link; "Open the packet page" → OP-04p.
   Third-party: after the handoff evidence, the line "The provider's result is recorded on Outcome and result file when
   it arrives." with the link OP-05.
6. **Application & documents tab, "Related applications"** (`id="related"`): table Relation; Needs (requirement
   sentence, §2.11.3); State (staff words). Line "The related application itself is not shown here." When
   `dependencies` is empty, the section is absent (the staff read carries no declared relations, STOP-W10-01).

### 2.9 Amendments on WP-07 and WP-08 pages (text only)

| Page | Part | Amendment |
|---|---|---|
| OP-04b (WP-07) `provider_handoff` | After-evidence banner (AM-W10-05) | "Handed to the provider: evidence recorded [time] IST. The provider files with the authority. TravelMudra learns of the provider's filing through its result: record the result on Outcome and result file when it arrives." |
| OP-05 (WP-08) | Third-party line under "Record the official outcome" (AM-W10-07) | "The declared provider files with the authority. Record the outcome and the provider's result file when it arrives. The handoff record is not evidence of the outcome." |
| OP-05 (WP-08) | `filing_not_evidenced` sentence when `serviceMode = third_party_filed` | "The handoff to the provider is not evidenced yet. Record the handoff evidence first (External actions)." |
| OP-06 (WP-08) | Section "Other delivery records" | Links "Record a handover" (OP-06h), "Record a delivery made directly by an external party" (OP-06e) for the assigned operator; the records stay in "Earlier sends and records" |
| OP-07 (WP-08) | `delivery` row "Where" (AM-W10-08) | By the channel Core's codes and the shape show: packet → OP-06h; direct external → OP-06e; document email → OP-06 |
| OP-07, TA-07r (WP-08) | `no_possible_filing` words, third-party | Staff: "No handoff to the provider is in doubt" / "A handoff to the provider may have happened"; TA neutral: "No external step is in doubt" / "TravelMudra is confirming whether its external step went through" |
| TA-07r (WP-08) | Preparation only (AM-W10-09) | Before the release: "Your preparation packet is not released yet." After the release: "Your preparation packet is ready. Download it and file the application yourself with the authority." After a download sent in full (`packetSentInFull`): "Your preparation packet was sent to you in full on [time] IST. TravelMudra records the handover." After the handover: "Outcome: Prepared and handed over. TravelMudra claims no government result for this application." It replaces `ta.ts:656` "… and with it the result" (F-W10-03) |
| TA-07r (WP-08) | Direct external delivery row (AM-W10-09) | "Delivered directly by an external party. This record names no file held by TravelMudra." (replaces "TravelMudra holds no result file for this application", which a released result file can contradict) |

### 2.10 SA-02e Dependency waits (view of SA-02a) — optional, P2

A view value `dependency_waits` on WP-06's SA-02a assignment queue: the rows of `core.assignment_queue` whose
`pending.reasonCode ∈ {dependency_outcome_unmet, dependency_evidence_missing}` (Core names the SuperAdmin owner of an
unassigned wait, `derived.ts:377`; BS B22). Lead "Submitted applications without an operator that wait for a
related application. You own the wait until an operator is assigned." Columns as SA-02a; the Waiting-for column shows
the §2.11.3 TA-neutral state sentence. The 200-row cap line of SA-02a applies ("in the first 200 unassigned
applications"). No new route, no new read.

### 2.11 Closed word tables

#### 2.11.1 Shape sentences

| Code or place | Staff (by shape) | Travel agent (neutral, STOP-W10-07) |
|---|---|---|
| Kind words (`MODE_LABELS`) | "Filed by TravelMudra"; "Filed by a declared provider"; "Preparation only"; `unknown` → "Kind unavailable" | — |
| `awaiting_external_result` | TravelMudra-filed: "The filing is evidenced. The result is awaited from the authority." Third-party: "The handoff to the provider is evidenced. The provider files with the authority; its result is awaited." | "TravelMudra's external step is done. The result is awaited from the authority or the provider." |
| `filing_possibly_occurred` when the only possibly-filed act is `provider_handoff` | "The handoff to the provider may have happened. It is treated as done until reconciled. Do not hand over again." | "TravelMudra is confirming whether its external step went through." |
| OP-04b provider after evidence | §2.9 row 1 | — |
| Preparation-only line | "Preparation only. TravelMudra prepares a validated packet for the travel agent, who files with the authority. TravelMudra performs no government act, holds no originals and claims no government result." | "TravelMudra prepares a packet for you. You file the application yourself with the authority. TravelMudra claims no government result." |

#### 2.11.2 Packet and handover words

| Value | Staff | Travel agent |
|---|---|---|
| packet `null` | "Not built" | (no row) |
| `building` | "Being built" | (no row) |
| `built` | "Built [time] IST, [size]" or "Built" | (no row) |
| `released` | "Released to the travel agent" | "Ready to download" (WP-08 file row) |
| `superseded`, `build_failed` (not on the live read) | "Replaced" / "Build failed" if a later read returns them | — |
| Handover step `ta_download` | "Waiting for the travel agent's download" | "Download your packet" (WP-03 action panel item 3) |
| Handover step `record_handover`, `sentInFull` | "Can be recorded now: sent in full to the travel agent's own download" | "Sent to you in full on [time] IST" |
| Handover record `packet`, `systemVerified` | "Recorded [time] IST: system-verified. Whether the travel agent's browser kept the file cannot be known." | "Handed over [time] IST" |
| Handover record `packet`, not verified | "Recorded [time] IST: attributed record, not system-verified" | "Handed over [time] IST" |
| Handover record `physical` | "Physical handover recorded [time] IST: attributed record" | "Physical handover recorded [time] IST" |
| Handover record `direct_external` | "Delivered directly by an external party: attributed record; no file held by TravelMudra is claimed" | §2.9 last row |

#### 2.11.3 Dependency words

Requirement sentence (staff only; the TA read lacks the facts, STOP-W10-05): "the related application's outcome
[outcome label][, with its [type words] document verified for that application]". Type words: the artifact type in
words (WP-08 file-name rule). Relation words: the relationship code in words (`needs_tourist_evisa` → "Needs tourist
e-visa": a closed label map by code with a code-in-words fallback; catalogue copy is not in the reads).

| State | Staff (checklist and tables) | Travel agent |
|---|---|---|
| `waiting` | "Not met: the related application has no outcome [label] yet" | "Waiting for the linked application's result" |
| `unmet_missing_evidence` | "Not met: the related application's outcome is [label], but its [type words] document is not eligible yet" | "The linked application's result is recorded; its result document is not ready yet" |
| `met` | "Met: the related application's outcome is [label][, and its [type words] document is eligible]" | "Met" |
| `failed_incompatible` | "Not met: the related application ended with an outcome this one cannot use. TravelMudra ends this application as Dependency failed only if no filing of it may have happened." | "The linked application ended with a result this one cannot use" |
| other | "Unrecognised state" + "Reference code: [code]" | "Unrecognised state" + "Reference: [code]" |
| Declared, not linked (TA only) | — | "Not linked" |

### 2.12 Receipt facts per command (CMP-08)

| Done code | Host | Expected resource | Summary test | Establishes by | Title | Recorded facts | Current facts |
|---|---|---|---|---|---|---|---|
| `packet` | OP-04p | `application`, path id | `packetId` and `stepId` are strings | only the build returns both keys | "Packet build requested" | Packet [reference] (summary); "TravelMudra builds it in the background from the accepted version of each mandatory document." | Packet state now; when the live packet differs from the summary reference: "The packet [summary reference] is not being built and is not built now: the build did not finish or was replaced." |
| `released` | OP-04r | `application`, path id | `packetReleaseId` is a string with prefix `prl_` | unique key | "Packet released to the travel agent" | Release [reference]; "The travel agent is notified and can download it. Each download checks every document of the packet again." | Packet state; handover step |
| `handover` | OP-06h | `application`, path id | `handoverId` string, `systemVerified` and `outcomeRecorded` booleans | keys unique to `dlv.record_handover`; the `handovers` row by id gives the kind | "Packet handover recorded" / "Physical handover recorded" (row kind); "Handover recorded" when the row is not read | "System-verified: the packet was sent in full to the travel agent's own download." or "Attributed record, not system-verified."; when `outcomeRecorded`: "Outcome recorded: Prepared and handed over. No government result is claimed." | Outcome; requirement `delivery` as Core reports it |
| `direct_external` | OP-06e | `application`, path id | `handoverId` string and no `systemVerified` key | the `handovers` row with that id has kind `direct_external` (else neutral) | "Direct external delivery recorded" | "Attributed record, not system-verified. It claims no file held by TravelMudra and releases nothing." Recorded [time] IST (row `recordedAt`) | Requirement `delivery` as Core reports it |
| `linked` | TA-07l | `application`, path id | `dependencyId` string | the `dependencies` row with that id in the current read | "Related application linked" | Relation; Application (row's upstream → sibling label) | State of the link |
| `unlinked` | TA-07l | `application`, path id | `dependencyId` string | link and unlink return the same shape; an absent row proves nothing | neutral "Request recorded" (switch at P-10 b: "Related application unlinked") | — | Linked applications now |

No receipt shows an accepted time or a command name (P-02, P-10 b pending). A receipt whose check fails reads
unchecked (WP-01 A-04). The receipt facts never come from the address `done` code alone.

### 2.13 Stale revision (CMP-14) per form

| Form | Guard | Rows (your unsent value / current value) |
|---|---|---|
| Build, rebuild | `_rev.application`; Core `stale_revision` when the superseded packet changed | Packet (you saw [state, reference] / current); Editing (current) |
| Release | `_rev.application`, `_rev.hold`, `_rev.material`; Core `stale_revision`/`packet_stale` when `packetId` is not the current built packet (`acts.ts:236`) | Packet (you saw [reference] built / current [reference, state]); Holds (current); Readiness (current); "The documents or the declared prerequisites changed since you opened the page." |
| Handover, direct external | none (Core takes no revision) | Not CMP-14; Core's codes (§2.14) with the re-read state |
| Link, unlink | `_rev.application` | Related applications (current rows); Editing (current); the radio choices kept when the form still applies |

"Who changed it and when" rows are absent (no read carries them), never "unknown".

### 2.14 Refusal sentences (closed table)

Existing `CORE_MESSAGES` and `DLV_MESSAGES` stay unless listed. Category plus code selects the sentence. The table
lives in `shapes.ts` (U0).

| Form | Category / code | Sentence (staff unless marked TA) | Where |
|---|---|---|---|
| build | `conflict_duplicate` / `packet_exists` | "A packet is already being built or is built for this application. Nothing new was built." + current state | form-level |
| build | `conflict_duplicate` / `packet_released`; `control_blocked` / `packet_released` | "The packet was released. A new packet cannot be built after the release." | form-level |
| build | `conflict_duplicate` / `packet_handed_over` | "The packet was handed over. A new packet cannot be built." | form-level |
| build | `control_blocked` / `mandatory_document_missing` | "Every mandatory document must be accepted before the packet is built." + the CMP-02 rows that are not satisfied | form-level |
| build | `control_blocked` / `operator_work_not_started` | "Start work first." | form-level |
| build | `control_blocked` / `service_mode_not_applicable` | "This service does not end in a packet." | form-level |
| build | `control_blocked` / `hold_returned_to_ta`, `hold_assistance_in_progress` | "The application is with the travel agent." / "Approved help is in progress." | form-level |
| build | `validation_failed` / `no_documents`, `input_invalid` | "The packet cannot be built from the current documents." + "Reference code: [code]" | form-level |
| release | `control_blocked` / `packet_stale`; `stale_revision` / `packet_stale` | "A document changed after the packet was built. Nothing was released. Build the packet again, then confirm readiness again." | form-level |
| release | `control_blocked` / `packet_not_ready`, `packet_not_built` | "The packet is not built. Nothing was released." | form-level |
| release | `control_blocked` / `packet_released` | "The packet was already released. Nothing more was released." | form-level |
| release | `control_blocked` / `dependency_outcome_unmet`, `dependency_evidence_missing` | "A related application has not reached the result this one needs. Nothing was released." | form-level |
| release | `control_blocked` / readiness, hold, deferral, offering codes | WP-07 §2.13 sentences | form-level |
| handover | `control_blocked` / `packet_not_released` | "The packet is not released. Release it first." | `kind` |
| handover | `conflict_duplicate` / `handover_exists` | "The packet handover was already recorded. Nothing more was recorded." + the record | form-level |
| handover | `control_blocked` / `handover_evidence_missing` | §2.4 item 4 sentence | `kind` |
| handover | `control_blocked` / `declaration_item_unresolved` | "This service does not state how a packet handover is evidenced. Owner: TravelMudra." | form-level |
| handover, direct external | `validation_failed` / evidence codes (`evidence_kind_unknown`, `evidence_version_not_usable`, missing row) | "Give one piece of evidence: a reference, a document reference or your statement." | evidence |
| handover, direct external | `validation_failed` / `instant_in_future`, `instant_invalid` | "Enter a date that is not in the future." | `eventDate` |
| direct external | `validation_failed` / `externalReference` required | "Enter the external party's reference." | `externalReference` |
| link (TA) | `control_blocked` / `dependency_undeclared` | "That application does not fit what this service needs. It must be the same applicant's application for the needed service, in this group." | `upstreamApplicationId` |
| link (TA) | `control_blocked` / `dependency_cycle` | "That link would make the two applications wait for each other." | form-level |
| link (TA) | `control_blocked` / `dependency_upstream_final_incompatible` | current sentence (`shared.ts:155`) | `upstreamApplicationId` |
| link (TA) | `unavailable_parked` / `parked_preparation_dependency_evidence` | CMP-10: "Linking a preparation-only application cannot meet this need: a packet handover is not a government result. Owner: TravelMudra." | form-level |
| link (TA) | `conflict_duplicate` / `duplicate_open_scope` | "This application is already linked for that need. Unlink it first to link another application." (F-W10-05) | form-level |
| link, unlink (TA) | `control_blocked` / `awaiting_formal_return`, `hold_assistance_in_progress`, `application_not_open` | the TA-07l state sentences (§2.6) | form-level |
| unlink (TA) | `control_blocked` / `filing_possibly_occurred` | "Unlinking is unavailable: a filing of this application may have happened or has happened. Owner: your operator." | form-level |
| every form | `conflict_operation_key` | "This form was already used with different content. Your values are kept: check them and send again." | form-level |
| every form | `not_found_or_forbidden` | shell SH-02 (LD-14) | — |

## 3. Interim and switch for the pending Core facts

| Fact | Interim (now) | Switch |
|---|---|---|
| Command identity in receipts (P-10 b, S-08) | §2.12: established by summary keys and the selected record; `unlinked` neutral | `commandName` and `acceptedAt` from `core.operation`; `unlinked` gets its title; every receipt adds "Accepted at [time] IST" |
| Declared relations on the staff read (STOP-W10-01, Kind 1 part) | OP-02 shows linked rows only; no "Not linked" line for the operator | The checklist adds one row per declared relation with no live link: "Not met: no related application is linked. Owner: the travel agent. Route: Return to TA (OP-03r)". If Max chooses the Kind 2 blocker instead, Core's blocker `dependency_not_linked` drives the same row |
| Provider filing evidence (STOP-W10-02) | AM-W10-05 text: the provider's filing is known through its result | A record command and an OP-04b mode "Record the provider's filing", with its own words; the shape table gains the fact |
| Packet manifest and last build attempt (STOP-W10-03) | "Mandatory documents now" (current rows, labelled as current); build-receipt line for a build that did not finish | OP-04p "What the packet holds" lists the packet's own requirement types and version references; "Build failed: [reason]" |
| TA dependency facts and offers (STOP-W10-05) | Relation words from the code; guard facts mapping with a parity test | Requirement sentence on TA pages; Core's `linkOffer` and per-row `unlinkOffer` replace the mapping |
| Service mode on the TA read (STOP-W10-07) | Neutral TA sentences (§2.11.1) | Mode-specific TA sentences |

## 4. Hostile-state analysis (prompt rule 8)

"Today" states whether the code at e9e96e3 already behaves as required. "Residue" is what a failure leaves.

### 4.1 The Nth identical submission and its variants

| Form | Variant | Required behaviour | Residue | Today |
|---|---|---|---|---|
| Build | Same `_op` (double click, browser resend) | Replay; the same 303 and receipt; one packet | None | Yes (receipt new) |
| Build | New `_op` after acceptance (second tab) | `packet_exists` → "already being built or built" with the current state | None | Partly (generic text; the form shows anyway, F-W10-02) |
| Rebuild | Two tabs, both supersede packet A | The first supersedes A and starts B; the second meets live B ≠ A → `packet_exists`; the page shows B | One new packet | No (no rebuild form, F-W10-01) |
| Release | Same `_op` | Replay; same receipt; one release record | None | Yes |
| Release | New `_op` after acceptance | `_rev.application` moved → CMP-14 with "Released"; after a reload no form; a hand-made post → `packet_released` | None (one release per application, `guard-constraints.ts:105`) | Partly |
| Release | Lost acknowledgement | Operation page (CMP-13); no release form while unresolved; a second release cannot commit (unique release) | None | Yes (WP-01) |
| Handover (packet) | Same `_op` | Replay | None | Yes |
| Handover (packet) | New `_op` (second tab) | `handover_exists` → recorded state and the unsent values | None | Partly |
| Handover (physical) | New `_op`, same content | A second attributed record: Core has no business key for it (P2 note, STOP-W10-08) | Two records, each with its time | Yes (same) |
| Direct external | New `_op`, same content | A second attributed record (P2 note); OP-06e names the earlier record before the button | Two records | Yes (same) |
| Link | Same `_op` | Replay | None | Yes |
| Link | New `_op`, page loaded before the first link | `_rev.application` moved → CMP-14 with the current links | None | Partly (generic text) |
| Link | New `_op` after a reload, same relation | The page offers no link form for a relation with a live link; a hand-made post → `duplicate_open_scope` → link sentence (F-W10-05) | None (unique index `migrations/0300_core.sql:485`) | No (misleading sentence) |
| Unlink | New `_op` after the first unlink | `stale_revision` (revision moved, or the row is `unlinked`, `drafts.ts:271`) → CMP-14 | None | No page today |

### 4.2 What a failure leaves on the page

| Failure | Page after it | Kept | Lost (stated) |
|---|---|---|---|
| Refused form (C1, C2, C5) | Same page at the POST address, CMP-07 focused, `restorePath` = the GET page | Every typed value and radio choice | — |
| A form that no longer applies (handover exists; link with the operator) | The new state; the WP-09 unsent text block with the typed values | The typed text, read only | The form |
| Packet build fails in the background | OP-04p: "Not built" (the failed packet is not on the live read); after a build receipt, the receipt line of §2.12 | — | The failure code (STOP-W10-03) |
| Release refused for `packet_stale` | OP-04r with the notice; OP-04p offers the rebuild as the primary action | — | Nothing was released |
| Core unreachable before a command | SH-02 neutral page | — | The form; the reader opens the page again |
| Answer lost | Operation page (CMP-13) | — | No new submission is offered |
| Optional read failed | "Unavailable" for its facts; OP-04r removes the release form when the documents read fails | Everything else | — |

### 4.3 The named hostile states

| Situation | Required behaviour | Today |
|---|---|---|
| A document of a built packet is replaced (formal return, TA replaces it, hands back) before the release | `releaseOffer` carries `packet_stale` (`controls.ts:601-603`): OP-04r shows the notice and no form; OP-04p offers "Build the packet again" as the primary action; the rebuild supersedes the built packet; readiness becomes out of date (the basis includes the packet, `derived.ts:72`) and is confirmed again; then the release | No: the release shows a refusal, and no rebuild exists (F-W10-01) |
| A document is replaced or blocked between OP-04r load and submit | Core refuses (`packet_stale`, control or stale category, or `_rev.material`); nothing is released; CMP-14 or the notice | Partly (generic text) |
| A document of a released packet is blocked (disclosure) or its bytes fail | The travel agent's download is refused `packet_constituent_unavailable` (`release.ts:212-216`); TA-07r: "This packet is held. It is not sent while TravelMudra handles a problem with one of its documents. Nothing is sent in its place."; OP-04p: "Released. A document of the packet is no longer releasable, so it cannot be downloaded." and the boundary "A new packet cannot be built after the release in this release of TravelMudra. Owner: product owner." (STOP-W10-04) | Partly (DLV sentence; no boundary) |
| Packet handover recorded twice | Packet: one record (`dlv_handovers_packet_uq`, `handover_exists`); physical: a second record (P2) | Yes / P2 |
| Packet handover before the travel agent's download (declared TA retrieval) | Packet option absent; CMP-10 with owner the travel agent; a hand-made post → `handover_evidence_missing` | Yes (copy new) |
| Dependency linked to the wrong application: a sibling of another applicant | Not offered (`linkable = false`); a hand-made post → `dependency_undeclared` → TA-07l sentence; nothing linked | Partly (sentence) |
| Dependency linked to the wrong application: a relation and a sibling that do not match | One relation: no choice exists. Several: Core refuses `dependency_undeclared`; the radios stay chosen | Partly |
| Dependency linked to an application outside the scope: another group of the same TA | `dependency_undeclared` (`drafts.ts:232`) | Yes |
| Dependency linked to another TA's application (hand-made post) | `not_found_or_forbidden` at the authorize step → shell 404 (LD-14) | Yes |
| Link while the upstream ends incompatibly in the same moment | Core locks both rows: either the link is refused (`dependency_upstream_final_incompatible`), or the link commits first and the dependent ends as Dependency failed when confirmed unfiled; TA-07 states it (§2.7 item 3) | Partly (copy new) |
| Unlink while the dependent progressed: an operator was assigned after TA-07l loaded | `_rev.application` moved → CMP-14 shows "With your operator"; or `awaiting_formal_return`; nothing unlinked | No page today |
| Unlink after a filing may have happened (returned case) | Core refuses `filing_possibly_occurred` (`drafts.ts:272`); the sentence names the operator | No page today |
| Declared relation never linked | Core conditions nothing (STOP-W10-01). TA-07 and TA-07l show "Not linked"; the operator sees nothing until the Kind 1 or Kind 2 fix | No |
| Upstream outcome corrected after the dependent became Met | Core reconsiders (`writers.ts:200-201`); a met dependency that turns incompatible on a possibly-filed dependent keeps its protection and opens a follow-up incident for its owner; the checklist row shows the new state; OP-01 Continuing duties shows the incident (WP-07) | Partly |
| Access revoked mid-page (operator reassigned, TA suspended) | The next read or command: SH-02 "Your access changed" or sign-in; no earlier facts remain (LD-14); a refused release or handover records nothing | Yes |
| Uncertain direct external delivery | OP-06e states "Record only a delivery you have evidence of"; no "uncertain" record exists in Core; the requirement stays not met and the case stays open with its owner; the page offers no record "just in case" | Partly (copy new) |
| Direct external delivery recorded before any outcome | Core accepts it (no lifecycle guard, `handover.ts:190-215`); OP-06e shows "Outcome not recorded" in the evidence; the requirement is evaluated only once an outcome exists (P2 note) | Yes |
| Packet stays "Being built" (processing instance stopped) | OP-04p shows "Being built" and "Check again"; no age, no threshold; no second build is offered (Core refuses it) | Partly |

### 4.4 Access and accounts changing mid-task

| Situation | Required behaviour | Today |
|---|---|---|
| Operator reassigned between OP-04r load and submit | Command refused for access → shell "Your access changed"; nothing released | Yes (LD-14) |
| Operator reassigned while a packet is building | The build task fails `assignment_changed` (`build-packet.ts` header); the new operator sees "Not built" and builds again | Yes (copy new) |
| Read grant ends while OP-04p is open | Next read: SH-02 | Yes |
| TA account suspended | Next TA request: sign-in; the operator's release check refuses `recipient_inactive` at the download | Yes |
| A receipt address opened by another reader | `core.operation` answers "no record yet": unchecked receipt, no facts | Yes |

### 4.5 Counts, caps and long lists

| Situation | Required behaviour |
|---|---|
| A packet of 50 documents (the build maximum, `packets.ts:53`) | OP-04p and OP-04r list the mandatory rows in the page (cards on phones); no nested scroll |
| 200 siblings in a group (`siblings` max 200) | TA-07l lists the linkable ones as radios in one fieldset; long labels wrap |
| 50 relations or dependencies (read maximum) | Plain lists; no "show more" |
| 100 handover records (delivery read) | OP-06h and OP-06e list them in the earlier-records table |
| SA-02e at the 200-row cap | The cap line of SA-02a, qualified "in the first 200 unassigned applications" |

### 4.6 Device and environment

JavaScript off: every page works (plain forms, `<details>` only for the unlink confirmation with a visible fallback).
320 px and 400 % zoom: one column, no two-dimensional scroll (AC-04). Keyboard: radios, confirm disclosures and
links in reading order; the error summary takes focus after a refusal (AC-08).

## 5. Accessibility notes specific to WP-10

- One `h1` per page; frame and task parts are `h2` (AC-03).
- Radio groups (`kind`, `recipientKind`, `relationshipCode`, `upstreamApplicationId`) are `fieldset` with a `legend`;
  none is preselected; after a refusal the chosen value is kept and announced in the error summary context (AC-15).
- The unlink confirmation names the application in its accessible name ("Unlink [application]").
- Status facts, packet words and dependency states are text, never colour only (AC-06).
- Every unavailable control (`unavailableButton` "Release the packet to the travel agent") has `aria-disabled="true"`
  and `aria-describedby` to its CMP-10 (AC-13).
- Receipts are announced politely without moving focus (AC-09).

## 6. Proof V12 on `lane-ui`

V12 (UX §12): "Third-party handoff is not filing; preparation-only has packet outcome/no originals/no claimed
government result; dependency needs exact declared evidence" (B04, B22, B30).

### 6.1 What `lane-ui` holds (facts and inference)

- Installation `lane-ui` (edge http://127.0.0.1:4650, staff http://127.0.0.1:4652; config
  `~/.local/share/travelmudra-uat/configs/lane-ui.json`, source = this lane's clone, ref `ui-revamp-2026-10-12`). At
  the WP-10 proof it holds the integrated WP-02, WP-03, WP-06, WP-07, WP-08 and WP-09 pages (package order; inference).
- Synthetic seed (fact, `catalogue/synthetic/catalogue.json`, `launch` lists all nine offering keys):
  - Preparation only: "SYN Tourist visa preparation" (`syn_tourist_prep`): delivery evidence `packet`, handover
    evidence `ta_retrieval_of_released_packet`, outcomes `prepared_and_handed_over` and `withdrawn`, no originals,
    Gate 2 not applicable, no external act; mandatory documents passport and photograph.
  - Filed by a declared provider: "SYN Tourist visa via provider" (`syn_tourist_provider`, route `synthetic:provider-1`,
    owner-approved synthetic): act `provider_handoff`, result type `provider_result`, delivery `tm_held_electronic`.
    "SYN Provider visa (route not approved)": the provider item is parked; inference: launch readiness fails on it, so
    it is not selectable. The PM checks SA-05 first; it is not used by the proof.
  - Dependency: "SYN Transit e-visa (needs tourist e-visa)" (`syn_transit_dependent`) with upstream "SYN Tourist
    e-visa" (`syn_tourist_evisa`, TravelMudra-filed, result type `evisa_grant`, the submission carries no fee).
  - Direct external delivery: **no seeded offering declares it.** The proof records one on the provider application as
    an attributed record (Core offers it on every application) and shows its truthful effect; the "satisfies the
    delivery requirement" part runs as a test with a fixture declaration. Adding a seeded offering is a seed change
    outside the lane (Q-W10-10).
- Accounts: syn-ta-1, syn-operator-1 and -2, syn-superadmin-1 (CLAUDE.md). Inference: the four offerings are launched
  for syn-ta-1 (WP-07 §6.1 inference; checked first on TA-03).
- Result PDFs are generated in memory by the WP-08 test fixture generator (WP-08 PM Q-06); never written to disk.
- Sign-in through the LD-11 harness; codes never printed. Screenshots allowed. axe at 1440 px and 390 px.
- No government fee is authorized in this proof, so syn-ta-1's default ₹0 ceiling (WP-07 PM Q-07) is untouched.

### 6.2 Setup (synthetic writes, labelled as setup; Q-W10-09)

Run tag `wp10-[yyyymmddhhmm]`. As syn-ta-1: create group `wp10-[stamp]` in Synthetica (travel +30/+40 days). Add, with
unique synthetic passports: Q on "SYN Tourist visa preparation"; H on "SYN Tourist visa via provider"; for one
applicant D (same identity facts twice): T on "SYN Tourist e-visa" and X on "SYN Transit e-visa (needs tourist
e-visa)"; for another applicant E: Y on "SYN Tourist e-visa". Upload the documents (TA-09f). Submit Q, H, T and Y.
As syn-superadmin-1 (SA1): record "Payment received" for Q, H, T, X (SA-07a); assign Q, H, T to syn-operator-1 (OP1)
and X to syn-operator-2 (OP2) (SA-03a). Seeded data is not changed.

### 6.3 Steps and observable results

"L" = observed on `lane-ui`; "T" = test.

| Step | Actor, page | Action | Observable result | Where |
|---|---|---|---|---|
| V12-P1 | OP1, OP-02 of Q | Start work; read | Kind "Preparation only"; External acts "None for this service"; status fact "Packet: Not built"; action panel "Build the packet before you confirm readiness" → OP-04p; no Gate 2 row; no government fee row; no Originals section | L |
| V12-P2 | OP1, OP-04p of Q | Read; "Build the packet" | Mode line (no government act, no originals, no government result); receipt "Packet build requested"; state "Being built"; "Check again" until "Built [time] IST, [size]" | L |
| V12-P3 | OP1, OP-04p (second tab loaded before P2) | "Build the packet" | Refused `packet_exists`: "A packet is already being built or is built … Nothing new was built."; one packet | L |
| V12-P4 | OP1, OP-02 Work of Q | Confirm readiness | Receipt "Readiness recorded"; action panel "Release the packet to the travel agent" → OP-04r | L |
| V12-P5 | OP1, OP-03r; syn-ta-1, TA-09f; syn-ta-1, TA-08 | Return to TA; replace the photograph; hand back | OP-04r of Q: CMP-10 "A document changed after the packet was built … Build the packet again"; no release form; OP-04p: "Build the packet again" primary | L |
| V12-P6 | OP1, OP-04p, OP-02 Work | Build again; wait "Built"; confirm readiness again | Receipt names the new packet; the old one is never offered for release; readiness "Recorded by you" | L |
| V12-P7 | OP1, OP-04r of Q | Read; release | Scope, evidence (mandatory documents now, readiness, holds), effect (recheck, notice, historical facts, no new packet, no government result) before the button; receipt "Packet released to the travel agent"; no "not decided" text anywhere | L |
| V12-P8 | Harness | Resend the release POST (same `_op`) | Same 303 and receipt; one release | L |
| V12-P9 | OP1, OP-06h of Q | Read | No packet option; CMP-10 "… until the packet is sent in full to the travel agent's own download. Owner: the travel agent." | L |
| V12-P10 | syn-ta-1, TA-07 of Q | Read; download the packet | "Your preparation packet is ready. Download it and file the application yourself with the authority."; download streams; then "sent to you in full on [time] IST. TravelMudra records the handover."; no "result" claim | L |
| V12-P11 | OP1, OP-06h of Q | Record the packet handover (external reference `SYN-HND-[stamp]`) | Receipt "Packet handover recorded", "System-verified …", "Outcome recorded: Prepared and handed over. No government result is claimed."; a second post with a new `_op` → "already recorded" | L |
| V12-P12 | syn-ta-1, TA-07 of Q; OP1, OP-05 of Q | Read | TA: "Outcome: Prepared and handed over. TravelMudra claims no government result for this application."; no Originals section; OP-05: no outcome form, the packet-handover line | L |
| V12-P13 | Test | Release refused when a document changes between load and submit; a released packet with a blocked document | Nothing released; download refused `packet_constituent_unavailable`; the boundary of §4.3 | T |
| V12-H1 | OP1, OP-02 and OP-04a/b of H (WP-07) | Start work; readiness; request authorization for the provider handoff; record "Handed over" | Kind "Filed by a declared provider"; context line "A handoff is not a filing"; after the evidence: "Handed to the provider: evidence recorded … TravelMudra learns of the provider's filing through its result …" (AM-W10-05) | L |
| V12-H2 | OP1, OP-02 and OP-01 of H; syn-ta-1, TA-07 of H | Read | Staff: "The handoff to the provider is evidenced. The provider files with the authority; its result is awaited."; TA: "TravelMudra's external step is done. The result is awaited from the authority or the provider."; nowhere "The filing is evidenced", "Filed" or "reached the authority" for H | L |
| V12-H3 | OP1, OP-05 of H | Record "Issued" with a `provider_result` PDF holding H's name and passport number | Third-party line (AM-W10-07); receipt "Outcome recorded"; association verified | L |
| V12-H4 | Test | Renderer sweep over every WP-07, WP-08 and WP-10 renderer with a provider fixture (authorized, uncertain, evidenced) | No filing claim for the handoff; the handoff words; A164 strengthened | T |
| V12-D1 | syn-ta-1, TA-07 of X (draft) | Read | Status row "Needs tourist e-visa: Not linked"; section "Related applications" with the link to TA-07l | L |
| V12-D2 | syn-ta-1, TA-07l of X | Read | One relation as text; radio options: T only (Y is another applicant, not offered); effect text visible | L |
| V12-D3 | Harness | Post the link with Y | 409; "That application does not fit what this service needs …"; nothing linked | L |
| V12-D4 | syn-ta-1, TA-07l of X | Link T | Receipt "Related application linked"; row "Waiting for the linked application's result"; no link form for that relation now | L |
| V12-D5 | Harness | Post the same link again with a fresh revision | 409; "This application is already linked for that need …"; one link | L |
| V12-D6 | syn-ta-1, TA-08 of X; SA1; OP2, OP-02 of X | Submit X; record payment; assign OP2; start work; read | Checklist "Declared prerequisites": "Needs tourist e-visa: needs the related application's outcome Issued, with its Evisa grant document verified for that application" — "Not met: the related application has no outcome Issued yet"; readiness form absent with the dependency blocker; OP-01 of OP2: X in "Waiting", owner "Waiting on a related application", not in the nav count | L |
| V12-D7 | syn-ta-1, TA-07l of X | Read; harness posts an unlink | No unlink control; "This application is with your operator …"; the post → 409 `awaiting_formal_return` sentence; link kept | L |
| V12-D8 | OP1 (T), OP-02 → OP-04a/b → OP-05 | T: start work, readiness, authorize the government submission, record filed evidence, record "Issued" with an external reference and no file | OP2, OP-02 of X: "Not met: the related application's outcome is Issued, but its Evisa grant document is not eligible yet" | L |
| V12-D9 | OP1, OP-05 of T | Record the result file (`evisa_grant` PDF with D's name and passport) | Association verified; OP2, OP-02 of X: "Met: … Issued, and its Evisa grant document is eligible"; readiness offered | L |
| V12-D10 | Test | Unlink after a filed submission (returned case); preparation-only upstream with a required issued outcome; incompatible upstream after a filed dependent | `filing_possibly_occurred`; `parked_preparation_dependency_evidence` CMP-10; protection kept, follow-up incident | T |
| V12-X1 | OP1, OP-06e of H | Read; record a direct external delivery (`SYN-DIRECT-[stamp]`) | Scope and effect ("counts only when the service declares it …", "Record only a delivery you have evidence of") before the button; receipt "Direct external delivery recorded … claims no file held by TravelMudra"; current requirement `delivery` still "Not met" (H declares `tm_held_electronic`) | L |
| V12-X2 | syn-ta-1, TA-07 of H | Read | Handover row "Delivered directly by an external party. This record names no file held by TravelMudra."; the released result file row unchanged | L |
| V12-X3 | Test | Fixture declaration with `deliveryEvidence.issued = direct_external`; record; read OP-07 | Requirement `delivery` "Met" from Core | T |
| V12-A | axe | TA-07l, OP-04p, OP-04r, OP-06h, OP-06e, TA-07 of Q and X | No violation at 1440 px and 390 px | L |

Proof split. V12 passes when every L step passes on `lane-ui` and every T step passes as a test. Two clauses are
recorded as partly met until Max decides: "provider filing evidence is separate" (STOP-W10-02: no separate fact
exists; the pages state how the provider's filing becomes known) and the operator's view of a declared but unlinked
relation (STOP-W10-01).

## 7. Implementation breakdown

### 7.1 Work units (disjoint files)

Phase A: U0. Phase B: U1 to U6 in parallel. Phase C: U7. The architect registers gallery modules in
`scripts/dev/gallery-pages.ts`, applies the one-value copy changes in `src/web/ui/presentation.ts` (WP-01 file: kind
words, the TA next-action sentence for `await_external_result` if present) and edits `DESIGN.md` once at the end.

| Unit | Files (change or add) | Tests (add or update) | Gallery |
|---|---|---|---|
| **U0 Shape words** | New `src/apps/shared/core/shapes.ts` (§2.11 tables, §2.14 table, `requirementSentence`, `isDependencyWait`, relation-word map) | New `test/unit/web/service-shapes.test.ts` (every `DEPENDENCY_STATES` and `PACKET_STATES` value has words in both audiences; unknown values fall back with the code; no provider string contains "filed", "filing" or "authority result" except negations; no packet string claims a result except "claims no government result"; every WP-10 refusal code has a sentence) | — |
| **U1 TA dependency pages** | New `src/apps/shared/pages/related-applications.ts` (TA-07l and the TA-07 section); new `src/apps/edge/core/dependency-routes.ts` (GET `ta.applications.dependencies`; POST `ta.applications.link_dependency`, `ta.applications.unlink_dependency` moved from `src/apps/edge/core/routes.ts`, with `receiptLocation`, origin and re-render of TA-07l); `src/apps/shared/core/ta.ts` (the carried section replaced by the section call; status rows; `linked`/`unlinked` removed from `doneFlash`; the neutral `awaiting_external_result` TA sentence call) | New `test/unit/web/related-applications.test.ts` (one relation as text with a hidden field; several as radios; only linkable siblings; states in order; unlink confirm per row; guard-facts parity test against the guard of `drafts.ts`; receipts); BFF tests: refused link keeps both choices; same `_op` resend answers the same 303; `duplicate_open_scope` link sentence | `scripts/dev/gallery/related-applications.ts` |
| **U2 Packet pages** | New `src/apps/staff/work/packet.ts` (OP-04p, OP-04r); new `src/apps/staff/work/packet-routes.ts` (GET `ops.applications.packet`, `ops.applications.release_form`; POST `ops.case_work.packet_build` moved from `case-work.ts` with `supersedePacketId`; POST `ops.applications.release_packet` moved from `ops.ts`; receipts; re-render) | New `test/unit/web/packet-pages.test.ts` (build vs rebuild by state; no form while building or released; review sections in order; no checkbox; `packet_stale` routes to the rebuild; documents outage removes the release form; read-grant reader without forms; receipts and the "build did not finish" line); BFF tests: rebuild posts `supersedePacketId`; refused release re-renders OP-04r; `stale_revision`/`packet_stale` → CMP-14 | `scripts/dev/gallery/packet.ts` |
| **U3 Delivery record pages** | New `src/apps/staff/delivery/records.ts` (OP-06h, OP-06e); `src/apps/staff/delivery/routes.ts` (GET `ops.delivery.handover_form`, `ops.delivery.direct_external_form`; the two POST handlers answer `receiptLocation` and re-render their task page); `src/apps/staff/delivery/send-page.ts` (OP-06 "Other delivery records" → links); `src/apps/shared/delivery/pages.ts` (remove `opsForms` if WP-08 left it) | New `test/unit/web/delivery-records.test.ts` (packet option only when offered; precondition notice; effects per kind; radios none preselected; earlier records; uncertain sentence; receipts by row kind); update `test/unit/web/packet-handover.test.ts` (OP-06h renderer); BFF: refused handover keeps values; `handover_exists` shows the state and the unsent values | `scripts/dev/gallery/delivery-records.ts` |
| **U4 Operator reading and WP-07/08 staff amendments** | `src/apps/staff/work/reading.ts` (rows 6a, 6b, 8, 8a, 8b, 10a; checklist dependency rows; OP-01 view rule and attention rule, AM-W10-01; staff sentences by shape); `src/apps/staff/work/workspace.ts` (Packet panel; Application tab "Related applications"; provider line); `src/apps/staff/work/frame.ts` (status fact "Packet"); `src/apps/staff/work/acts-pages.ts` (AM-W10-05 text); `src/apps/staff/outcome/pages.ts` (AM-W10-07); `src/apps/staff/delivery/completion-page.ts` (AM-W10-08) | Update `test/unit/web/operator-reading.test.ts` (new rows; dependency waits in Waiting and out of the count), `operator-workspace.test.ts`, `external-action.test.ts` (A164 with the new text), `outcome-pages.test.ts`, `completion-page.test.ts`; `test/unit/nav-counts.test.ts` (dependency wait not counted) | extend `scripts/dev/gallery/workspace.ts` |
| **U5 TA delivery amendments** | `src/apps/shared/delivery/ta-pages.ts` (TA-07r preparation-only states; direct-external row text); `src/apps/shared/core/shared.ts` (`CORE_MESSAGES` `awaiting_external_result` and `filing_possibly_occurred`: neutral sentences; the staff surface reads the shape sentences from `shapes.ts`) | Update `test/unit/web/ta-delivery.test.ts`; new `test/unit/web/v12-shapes.test.ts` (the sweep of V12-H4 over TA and staff renderers with fixtures per shape: no filing claim for a handoff; no government-result claim and no Originals section for preparation only; the dependency requirement names outcome and type) | — |
| **U6 SA-02e (optional, Q-W10-07)** | `src/apps/staff/queues/pages.ts`, `src/apps/staff/queues/routes.ts` (view value `dependency_waits`) | Update `test/unit/web/work-queues.test.ts` (rows by reason code; unknown view ignored; cap line) | extend `scripts/dev/gallery/work-queues.ts` |
| **U7 Wiring and system tests** | `src/apps/edge/instance.ts`, `src/apps/staff/instance.ts` (new route modules); `src/web/route-inventory.ts` (five new GET entries); removal of the moved POSTs and forms from `src/apps/edge/core/routes.ts`, `src/apps/staff/core/ops.ts`, `src/apps/staff/operations/case-work.ts` | `test/unit/bff.test.ts`, `test/unit/web/routes.test.ts` (inventory counts and ids); carried-form tests of WP-03, WP-07 and WP-08 drop their WP-10 entries; new `test/unit/web/wp10-host-pages.test.ts` (§7.2); the system tests of §7.3 | — |

U1 owns `ta.ts` and `edge/core/routes.ts`'s moved routes leave in U7; U5 owns `shared.ts` and `ta-pages.ts`; U3 owns
`staff/delivery/routes.ts` and `send-page.ts`; U4 owns the WP-07 work files and two WP-08 page files. No two units
edit one file.

### 7.2 Host-page test

`test/unit/web/wp10-host-pages.test.ts` renders TA-07 (draft with a relation; submitted unassigned; assigned), TA-07l,
OP-02 (every tab, preparation-only and provider fixtures), OP-04p, OP-04r, OP-06, OP-06h, OP-06e and the old operator
case page, and asserts: the action paths `/ta/applications/:id/dependencies`, `/dependencies/:dep/unlink`,
`/packet/build`, `/packet/release`, `/handovers` and `/direct-external` each appear as a form action on exactly one
renderer (TA-07l, TA-07l, OP-04p, OP-04r, OP-06h, OP-06e); TA-07, OP-02, OP-06 and the old case page hold none of
them.

### 7.3 Existing tests that pin current behaviour and MUST change

| Test | Pin | Change |
|---|---|---|
| `test/system/case-work.test.ts:455-575` (preparation-only packet path) | Build and release forms read from the case page (`${ops}/packet/build`, `/packet/release`); handover from `${ops}/delivery` (`#record`, `option[value^="packet:"]`); TA `#closure` text | GET OP-04p for the build, OP-04r for the release, OP-06h for the handover (the radio `kind` values unchanged); `#record` assertions move to OP-06h; TA text from TA-07r (AM-W10-09); locations allow `&op=` |
| `test/system/delivery.test.ts:205-230` | Direct external posted from OP-06; `location === ${opsPath}?done=direct_external`; "Record a delivery" on OP-06 | GET OP-06e; location `/ops/applications/<id>/direct-external?done=direct_external&op=<key>`; OP-06 shows the links; the record text stays on OP-06 |
| `test/system/case-rules.test.ts:91-112` | `select[name="upstreamApplicationId"] option` on TA-07; refusal re-render on TA-07 | Radio inputs on TA-07l; refusal re-render on TA-07l (409, sentence of §2.14) |
| `test/unit/web/packet-handover.test.ts` | Handover form on `deliveryPageHtml` | OP-06h renderer; the docket and reading assertions stay |
| `test/unit/web/routes.test.ts` | Inventory counts; `:207` handover row | Five GET rows; the POST rows unchanged |
| WP-03, WP-07, WP-08 carried-form tests | Entries for the link form, packet forms, handover and direct-external forms | Removed |

Stay valid: Core-level tests (`test/delivery/packets-handover.test.ts`, `test/core/withdrawal-dependencies.test.ts`,
`test/core/filing-uncertainty-holds.test.ts`, `test/operations/work-acts.test.ts`, `test/views/case-measures.test.ts`).

## 8. Register updates (`COMMAND-COVERAGE.md`)

Proposed edits for the architect (this design does not edit the register):

| Command | Row now | Proposed row |
|---|---|---|
| `ops.request_packet_build` | OP-04, WP-10 | OP-04p `/ops/applications/:id/packet` (build and rebuild with `supersedePacketId`); WP-10 |
| `core.release_packet` | OP-04, WP-10 | OP-04r `/ops/applications/:id/packet/release`; WP-10; K-STD (the download is K-BYTE) |
| `dlv.record_handover` | OP-04 (packet handover); OP-06, WP-10 | OP-06h `/ops/applications/:id/handovers` (packet and physical); WP-10 |
| `dlv.record_direct_external` | OP-04 (provider handoff); OP-06, WP-10 | OP-06e `/ops/applications/:id/direct-external`; WP-10. Note: "a delivery evidence kind of an outcome, not a provider handoff" |
| `core.link_dependency`, `core.unlink_dependency` | TA-07; TA-09, WP-10 | TA-07l `/ta/applications/:id/dependencies`; WP-10; TA-07 and TA-09 link to it |

Proposed §6 disposition CC-14: "The WP-10 commands leave the operator case page, OP-06 and TA-07; each has one host
page (TA-07l hosts link and unlink). UI-PLAN's 'Record provider handoff' is WP-07's act command for
`provider_handoff`; 'Record provider filing evidence' has no Core command (STOP-W10-02)." §5.1 counts unchanged
(WP-10: 6).

## 9. Findings, open questions, deviations and STOP items

Ranks follow PRI-20260930-01. P0 blocks the main path or risks irreversible harm; P1 goes to the architect under
LD-12, then to Max's end review; P2 is parked.

### 9.1 Findings worked in this design

| ID | Rank | Finding (current code) | Scenario | Design |
|---|---|---|---|---|
| F-W10-01 | P1 | The build form posts no `supersedePacketId` (`case-work.ts:134-137`; route input `{ applicationId }` only, `:564-565`), so a rebuild is never possible | A document is replaced during a return; the release is refused `packet_stale`; a new build is refused `packet_exists`; the case has no route and stays open | Rebuild form with the hidden field (D-W10-02) |
| F-W10-02 | P1 | The build offer evaluates `start_operator_work` only (`bindings/operations-work.ts:146-147`); the form shows while a packet is building, built or released | The operator clicks "Build the packet" on a released packet and reads a duplicate refusal | Build or rebuild form by packet state; none while building or released |
| F-W10-03 | P1 | TA text "the operator records its handover, and with it the result" (`ta.ts:656`) | A travel agent tells the customer that TravelMudra will record a government result; preparation-only claims none (V12) | AM-W10-09 words |
| F-W10-04 | P1 | `awaiting_external_result` reads "The filing is evidenced" (`shared.ts:46`) after a provider handoff is evidenced | An operator reads a handoff as a government filing and stops following the provider (V12) | AM-W10-06 shape sentences; neutral TA sentence |
| F-W10-05 | P1 | A duplicate link answers "An open application already exists for this applicant and service in the group." (`shared.ts:152`) | The travel agent believes a duplicate application was created and withdraws a valid one | Link-specific sentence (§2.14) |
| F-W10-06 | P1 | `core.unlink_dependency` has no form on any page (WP-03 §1.5) | A wrong link cannot be removed in the product; LD-07 requires a page for a served command | TA-07l |
| F-W10-07 | P2 | Relation and sibling are two independent selects; `linkable` is per sibling, not per relation (`bindings/core.ts:150-165`) | With several relations the TA picks a pair that does not match and reads "The service declares no such relation to that application" | One relation as text; several as radios with a line; clearer sentence; STOP-W10-05 |
| F-W10-08 | P2 | The link form is shown by a page rule (`editorPermits`, `ta.ts:373, 617`) | The rule drifts from Core's guard and offers a form Core refuses | Guard-facts mapping with a parity test (D-W10-09) |
| F-W10-09 | P1 | The release is a `confirmDisclosure` with "The owning travel agent can retrieve the released packet. A release happens once." (`ops.ts:263-268`) | The operator releases without seeing that facts become historical and no new packet can follow | OP-04r review |
| F-W10-10 | P2 | A failed build is invisible: the reads return only live packets (`delivery/store.ts:219-224`) | The build fails on unreadable bytes; the page shows "Not built"; the operator builds again and again | Receipt line (§2.12); STOP-W10-03 |
| F-W10-11 | P1 | A dependency wait is "Action now" and counted (owner `assigned_operator`) | With 30 transit applications waiting for tourist visas, the operator's Action now holds 30 rows with nothing to do | AM-W10-01 |
| F-W10-12 | P2 | The operator's dependency table says "Outcome issued with its official document" without the type (`case.ts:357`) | The operator cannot tell which document the dependency needs | Requirement sentence with the type (§2.11.3) |
| F-W10-13 | P1 | The handover form states no effect: a packet handover records the outcome; a physical handover satisfies no delivery requirement (`pages.ts:506-524`) | The operator records a physical handover believing the result is delivered; the case stays open without a reason shown | OP-06h effect text |
| F-W10-14 | P2 | The direct-external form does not say when it counts, and invites no evidence discipline (`pages.ts:538-549`) | The operator records a delivery they only expect, to close the case | OP-06e effect and the "only with evidence" line |
| F-W10-15 | P2 | WP-08 TA-07r direct-external text "TravelMudra holds no result file for this application" | A provider result file is released and a direct delivery is recorded; the TA reads two contradicting lines | AM-W10-09 |
| F-W10-16 | P1 | WP-07 A72 text names "its filing evidence is recorded separately"; no such record exists | The operator searches for a form that does not exist, or treats the handoff evidence as the filing | AM-W10-05; STOP-W10-02 |
| F-W10-17 | P2 | WP-08 OP-05 `filing_not_evidenced` sentence speaks of a filing for a third-party case | The operator reconciles a "filing" that is a handoff | AM-W10-07 |

### 9.2 Open questions for the architect

| ID | Rank | Question | Concrete scenario | Recommendation |
|---|---|---|---|---|
| Q-W10-01 | P1 | Host pages TA-07l, OP-04p, OP-04r, OP-06h, OP-06e; forms leave TA-07, OP-02 and OP-06 (CC-14) | Two forms for one command carry different wording; the refusal re-renders a page without the reader's form | Yes |
| Q-W10-02 | P1 | Add the hidden `supersedePacketId` to the build form (D-W10-02) | Without it F-W10-01 leaves a stale packet with no route | Yes; it is an existing contract input |
| Q-W10-03 | P1 | Dependency waits to "Waiting" and out of the nav count (AM-W10-01) | F-W10-11 | Yes; the WP-07 F-07 rule, extended |
| Q-W10-04 | P1 | STOP-W10-01: route the declared-but-unlinked relation to Max (Kind 2 blocker) and the Kind 1 read (needs an exception to criterion point 2) | A transit e-visa is filed without the tourist e-visa because the TA never linked it; the government fee is spent | Send both to Max through the orchestrator; recommend the Kind 2 blocker on the conditioned actions (it fixes the class); the Kind 1 read only if Max declines it |
| Q-W10-05 | P1 | STOP-W10-02: provider filing evidence | A provider never files; between the handoff and the result no fact shows it; the case sits in "External wait" with no record of the provider's filing | Max decides: A a Kind 2 record (recommended later, with the first real provider route), B a declared local work step (catalogue input, no evidence references), C accept that the result is the evidence. Interim: C's wording now |
| Q-W10-06 | P1 | Link and unlink offered by Core's guard facts with a parity test until STOP-W10-05 (D-W10-09) | Without an offer read the page either shows a form Core refuses, or hides a served action | Yes (WP-09 Q-W09-02 pattern) |
| Q-W10-07 | P2 | Build SA-02e in WP-10 (U6) or leave dependency waits to the assignment queue's pending sentence | An unassigned transit application waits for its upstream; the SuperAdmin owns the wait (B22) and sees it only as an assignment row | Build U6 if WP-06 U2 is integrated; else park |
| Q-W10-08 | P2 | No confirmation checkbox on the release (D-W10-11) | — | Accept: the visible review satisfies UX §7.4; no new field |
| Q-W10-09 | P2 | Proof writes on `lane-ui`: one group, five applications, one packet build and rebuild, one release, one download, one handover, one direct external record, two result files, harness posts | A rerun meets earlier rows; the run tag identifies them | Approve; synthetic only |
| Q-W10-10 | P2 | A seeded offering that declares direct external delivery (seed outside the lane) | V12-X3 runs as a test only | Proposal to the orchestrator only if Max wants it observed on `lane-ui` |
| Q-W10-11 | P2 | TA-08 (WP-03) lists "Related applications: Not linked" in the submission review | The TA submits a transit application without the link | Add one review line in WP-03's TA-08 build (a fact of the read) |

### 9.3 Deviation register

| ID | Deviation | Protocol effect |
|---|---|---|
| D-W10-01 | New GET pages TA-07l, OP-04r, OP-06h, OP-06e on their POST paths; new GET OP-04p `/packet` | New routes and inventory entries; actions and fields unchanged |
| D-W10-02 | The rebuild form carries hidden `supersedePacketId`; the handler passes it to `ops.request_packet_build` | One new form field (existing contract input) |
| D-W10-03 | Success locations move to the host pages with `&op=` | Locations change; system tests change their GET source |
| D-W10-04 | Forms leave TA-07, the operator case page (OP-02 External actions) and OP-06 | Host pages change |
| D-W10-05 | Release labelled K-STD (UI-PLAN §7: K-BYTE) | None |
| D-W10-06 | UI-PLAN WP-10 "Record provider handoff" is WP-07's act command; "Record provider filing evidence" has no command | Register note |
| D-W10-07 | Handover `kind` and `recipientKind` become radio groups, none preselected | Names and values unchanged |
| D-W10-08 | With one open relation, `relationshipCode` is a hidden field with the relation shown as text; the sibling choice is a radio group | Names and values unchanged |
| D-W10-09 | Link and unlink offered by Core's guard facts with a parity test | None (Core decides at the command) |
| D-W10-10 | SA-02a gains the view value `dependency_waits` (if U6 is built) | Enumerated query value |
| D-W10-11 | No confirmation checkbox on the release | None |

### 9.4 STOP items

| ID | Kind (DECISIONS §3) | What | Why the UI needs it | Criterion check | Without it |
|---|---|---|---|---|---|
| STOP-W10-01 | Kind 2 (P1), with a Kind 1 part | A declared relation with no live link conditions nothing: controls and the pending answer read linked rows only (`controls.ts:586`, `derived.ts:366`). Kind 2: a blocker `dependency_not_linked` on the conditioned actions while a declared relation has no live link. Kind 1 part: the declared relations (code, required outcome, required artifact type, linked or not) on `core.ops_case` | B22 "require the declared upstream outcome and exact verified artifact"; UX §3.2 Dependency; V12 "dependency needs exact declared evidence" | Kind 1 part: 1 facts exist (declaration, links); 2 not met (it adds a missing fact; no join is removed) → Max's exception, as P-05; 3, 4 hold. Kind 2: the §3.2 gate (fact: none new; Nth retry: unchanged; effect: readiness and authorization wait) | TA pages show "Not linked"; the operator sees nothing. **P1** |
| STOP-W10-02 | Kind 2 (P1) | A record of the declared provider's filing with the authority (evidence references, event time), separate from the handoff evidence and the provider's result | UI-PLAN §12.2 WP-10 "Record provider filing evidence"; UX §3.2 Third-party filed ("handoff, provider filing evidence … remain separate"); BS B04 | New fact → Kind 2 gate | AM-W10-05 wording; V12 clause partly met. **P1** |
| STOP-W10-03 | Kind 1 (P2) | On the staff case or delivery read: the packet's `built_from` (requirement types, version references), the last build attempt (state, failure code, requested at), and the constituent that failed a download | OP-04p "What the packet holds"; B35 failure visibility | 1 facts stored (`dlv_packets`); 2 removes the page's inference "the build did not finish"; 3, 4 hold | Current mandatory rows labelled as current; the receipt line. P2 |
| STOP-W10-04 | Boundary (Kind 2, P2) | Rebuild and second release after a released packet's document became unavailable (one release per application; a released packet blocks every build) | B12 "no substitution" holds, but the case has no route to a usable packet | New behaviour; close to BS B44 "preparation-only post-handover" parked policy | Boundary notice with owner "product owner" (§4.3). P2 |
| STOP-W10-05 | Kind 1 (P2) | On `core.ta_application`: required outcome and artifact type per relation and dependency; the relation's upstream service title; `linkOffer` and per-dependency `unlinkOffer` evaluations; per sibling the relation codes it can be linked under; the applications that depend on this one | TA-07l requirement words; Core's answer instead of the guard-facts mapping; a warning before a withdrawal that ends a dependent | 1 facts exist; 2 removes a page-side permission mapping (D5); 3, 4 hold | Guard facts with a parity test; relation words from the code. P2 |
| STOP-W10-06 | Kind 1 (P2) | The declared delivery-evidence kind of the recorded outcome on `core.ops_case`; handover details (external reference, recipient detail, recorded by, evidence) on `dlv.delivery_page.handovers` | OP-06e and OP-06h state whether a record counts; records name their evidence | 1 facts exist; 2 removes a refusal-driven discovery; 3, 4 hold | Effect text names the condition; Core's requirement row shows the result. P2 |
| STOP-W10-07 | Kind 1 (P2) | `serviceMode` on `core.ta_application` | Shape-specific TA sentences (§2.11.1) | 1 fact exists; 2 removes a guess between modes; 3, 4 hold | Neutral TA sentences. P2 |
| STOP-W10-08 | Defect note (P2) | `dlv.record_direct_external` and the physical handover have no business duplicate guard and no lifecycle guard (`handover.ts:190-215`) | BS B35 "A new key cannot evade business duplicate checks" | — (defect, not a projection) | Two attributed records with their times; the page names an earlier record before the button. P2, with WP-08 Q-W08-15 |

No STOP item blocks the WP-10 main path. No P0 item is open in this design. Kind 2 requested: STOP-W10-01 and
STOP-W10-02 go to Max through the orchestrator; STOP-W10-04 is a boundary note.
