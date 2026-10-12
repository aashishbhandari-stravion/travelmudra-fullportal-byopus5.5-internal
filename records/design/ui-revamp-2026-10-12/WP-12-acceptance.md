# WP-12 acceptance checklist: Physical originals

| Field | Value |
|---|---|
| Lane | `ui-revamp-2026-10-12` |
| Work package | WP-12 Physical originals (UI-PLAN §12.2: OP-09, SA-03 reassignment preview custody detail; lane PLAN §3) |
| Author | Principal Product Manager (Claude subagent), 13 October 2026 |
| Decision owner | Principal Technical Architect of the lane (LD-12) |
| Status | Draft. Step 1 of lane PLAN §3, written before the design. Not run. Where the later design names a path or a word differently, the design governs the name and this checklist keeps the observable result. |
| Product base | lane branch `ui-revamp-2026-10-12` at e1f6ac9 (the custody commands, their reads and today's custody page code are unchanged since e9e96e3); internal records at 31603d1 |
| Installation | `lane-ui`: staff http://127.0.0.1:4652 (operator pages and the SA-03c custody detail under test; other SuperAdmin pages as set-up and observation); edge http://127.0.0.1:4650 (the travel agent's originals section under test; proof set-up) |
| Writing style | ASD-STE100 at about 75% (STY-20261003-01) |

## Corrections

None yet. This is the first version. The alignment to the WP-12 design, to the architect's decisions (`WP-12.md` §3)
and to the independent review (if the architect asks for one under LD-13) will be recorded here as a table of changed
rows, as in `WP-09-acceptance.md` and `WP-10-acceptance.md`.

## Lessons applied from the WP-01 to WP-10 corrections

| Lesson | Source | Where this checklist applies it |
|---|---|---|
| Identical replay, changed-content conflict, browser Back, rejected-form refresh and lost acknowledgement are five separate cases; a business duplicate with a new key and a raw stale envelope are two more | WP-01 A-02, A-03, A-06; WP-03 R-12; WP-06 D-12 | §0.2 "Replay terms"; one "Nth time" item per command (A12, A20, A26, A32); the matrix A50 |
| A refused command leaves no operation record; the refusal shows only on the re-rendered form | WP-01 A-08; WP06-A104 | §0.2; A49; every refusal item says "nothing is recorded" and checks it by delta |
| A receipt names the command only when the operation's resource, returned id and summary (or a read by the returned id) establish it; otherwise a neutral "Request recorded" with facts labelled "Current"; no accepted time | WP-01 A-04, P-02; WP-06 D-02; WP-09 G-01 | §0.2 "Receipts"; A47 (per-command rule; movement and return share a resource and are told apart by the summary) |
| No receipt or status read tells anyone to act; a historical receipt keeps the historical fact and shows current facts as "Current" | WP-07 F-01 (P0 class fix); WP-09 G-10 | A48 |
| Freshness: "Read at [time] IST" for an authoritative read; the lag form for a projection | LD-08 | §0.2; A02, A44 |
| A page shows only facts that a read returns; a missing fact is "Unavailable" or the item is "partly met"; gaps are deferred, not failures | WP-02 B-06; WP-03 R-11; WP-06 D-04, D-05 | §0.2 "Facts"; A02 (no custody history, Q-03); A33; §5 "Deferred" |
| A known gap is shown on the page, not designed around | WP-06 D-03, D-06 | A02 (custody history line), A35 (shared original after a reassignment) |
| A state is labelled for the fact it was evaluated for | WP-06 D-05 | §0.2 "Custody words"; A02, A41, A43 (a part that is expected is "not returned", never "held") |
| A request that Core refuses is shown as Core answers it; the page does not change the input to force acceptance | WP-06 D-09 | A09, A14, A22, A30 |
| Form rows within Core's limits only; every filled row reaches Core; no handler truncates a field or drops an indexed row; over-limit input is refused at the field with the values kept | WP-06 D-10; WP-08 E-04; WP-09 G-07; WP-10 H-04 = LD-17 | A09, A22, A60 (today's custody handlers cut and drop input, §0.1) |
| A page MUST NOT block a command that Core accepts, and MUST NOT offer one that Core refuses; where the refusing fact is not on the page's read, the form shows and Core's reason is re-rendered, with no exact-parity claim | WP-07 D-W07-16; WP-03 F-W03-11; WP-10 H-02, H-03 | A06, A27, A31, A35; Q-07 |
| No semantic duplicate guard is claimed where Core has none; existing records show before the form | WP-08 Q-W08-15; WP-09 G-03 | A12, A13, A20 (a movement has no duplicate guard) |
| On GET assert the blocker and the absence of the form; a command refusal of a removed form is tested with a saved envelope | WP-09 G-05 | A05, A06, A31, A35 |
| Reassignment races are covered: the previous operator is refused by access; the new operator acts on Core's facts | WP-09 G-09 | A34, A37 |
| Reassignment preview lists are current and possibly incomplete; no "exactly these move" claim | WP-06 D-04 | A33 (custody facts labelled "Current"; the custody incident listed with the duties that move) |
| Proofs rerun with a run tag and a fresh synthetic travel agent; checks compare with a recorded baseline (deltas) | WP-02 B-13; WP-07 PM Q-07 | §0.4; §3 step P-0 |
| Set-up writes through existing pages are allowed and are labelled "Setup"; they are not the subject under test | WP-03; WP-06 Q-W06-10 | §0.4; §3 (payments, assignments, the withdrawal, the reassignment command) |
| Real refusal shapes from the code; a business refusal is asserted from the current page's facts | WP-06 D-11, D-12; WP-07 F-09 to F-12 | §0.5; every harness step sends from a freshly read page unless the step says "raw" |
| Optional reads never hide an access change; an outage of the facts a consequential record needs removes the form with a notice; access refusals are a separate test | LD-14; WP-07 F-04; WP-10 H-05 | A53 |
| Forms of other packages stay reachable on rebuilt pages; every rendered form action is a registered route; carried test entries are removed when the owner package rebuilds them; one host page per command | WP-03 Q-01; WP06-A110; CC-12 to CC-14 | A58; Q-14 |
| Copy states no configuration that the page does not read | WP-01 Q-13 | A21 (no list of accepted return evidence kinds), A55 |
| A boundary of an undecided (parked) policy names the product owner and no date; a boundary of a decided policy never says that an owner still has to decide | LD-04, LD-05; WP-08 Q-W08-03 | A06, A30 (2), A31, A35, A42 |
| Expectations name only states that a read returns | WP-10 H-06 | §0.2 "Custody words" (no "Lost" or "Damaged"); A02, A03 |
| A raw refused envelope is re-evaluated against its own revisions; a corrected submission carries current revisions; a guard is isolated only after the earlier guards pass | WP-10 H-07 | A19, A50 (5a), (5b) |
| UI acceptance is separate from Core behaviour: a parked policy is recorded "Unmet" with its owner, not as a failure | WP-10 H-01, H-08, H-11 | §0.2 "Pass rule"; A31, A35; §5 |
| A page predicts no Core outcome; it shows Core's current facts; completion rows show only Core's flags | WP-10 H-10; WP-08 E-05, E-06 | A21, A23, A25, A43 |
| Bans are scoped by fact ("Received" is a custody receipt into TravelMudra, never the travel agent's receipt of a return) | WP-08 E-12 | §0.2 "Custody words"; A55 |
| Kind 1 notes record whether criterion point 2 is demonstrated; no proposal is raised without it (a read with no point 2 needs Max's exception) | WP-09 G-11; DECISIONS §3.1 | §6 Q-03, Q-04, Q-07 to Q-09 |

## 0. Inputs and conventions

### 0.1 Inputs

| Ref | Source | Identity | Sections used |
|---|---|---|---|
| UX | `TARGET_PRODUCT_UX_SPEC.md` (2026-10-05) | SHA-256 b45186887cdc37f6… | §2.1 (Original item), §2.2 (Custody), §2.3, §3.1 step 9, §3.2 (Physical route), §3.3, §5.1, §5.2 (Originals), §5.3, §5.4, §6.1, §6.3 (Assignment), §7.4, §7.5, §8.3, §12 V18 (and V17, V19, V24 where they touch originals) |
| BS | `BUILD_SPEC.md` (r2) | SHA-256 4a6fd90657b0723f… | B19, B24, B30, B33, B35 |
| PL | `../ui-plan-from-specs-2026-10-10/UI-PLAN.md` | SHA-256 75256bfd7e6d929a… | §2.2 (Operator rail "Originals"), §3.3 OP-02 and OP-09, §3.4 SA-03, §4.2 (Physical route), §5.3 (OP-09), §6.3 and §6.4 (Originals register; Assignment candidate), §7 (Record original receipt, movement, holder uncertain, owner receipt; Reassign operator), §8 (CMP-01, CMP-03, CMP-07, CMP-08, CMP-10, CMP-13, CMP-14, CMP-17), §10, §11.1 to §11.3, §12.2 WP-12, §13.2 B-05 |
| IN | `../ui-plan-from-specs-2026-10-10/SURFACE-INVENTORY-2026-10-10.md` | SHA-256 2f9c71a527c80071… | RM-O9 (originals register per application only; Kind 1 candidate, ranked P2), CMD-51 |
| CC | `COMMAND-COVERAGE.md` (this folder) | SHA-256 16c0ca08e3fa8643… | §3 rows of the four WP-12 commands and `core.reassign`; §5.1 WP-12; §5.4 (operator case page → OP-09); §6 CC-12 to CC-14; §6.1 (`core.reassign` moved to WP-06) |
| LP | `PLAN.md` (this folder) | SHA-256 44733f6be225e793…; internal 31603d1 | §3, §4 (LD-02, LD-03, LD-04, LD-07, LD-08, LD-11, LD-12, LD-14, LD-17), §7 (#22, #23), §8 (S-08), §9 |
| PR | `PROPOSALS.md` (this folder) | SHA-256 6543659b63c71253… | P-02, P-10 (d: reassignment preview with custody holders; b: command identity) |
| W6 | `WP-06.md`; `WP-06-design.md`; `WP-06-acceptance.md` | SHA-256 a967bc071def9e25…; 327f580c1820bf40…; 7a1d82e48fde6e93… | record §3 (Q-W06-01: `core.reassign` in WP-06; WP-12 adds custody detail to the preview only), §4.1 D-02, D-04; design §2.5 (SA-03c), §2.8 (`reassigned` receipt); acceptance WP06-A51 to A62 (A52, A53, A60, A61), §0.3 (`syn_paper_return`) |
| W7 | `WP-07.md`; `WP-07-design.md` | SHA-256 5064e0c66680b9e8…; 4c877b4be85dc5e7… | record §3, §4.1 F-01, F-04, F-07, §4.3 F-16; design §1.3 (rail "Originals" hidden until OP-09), §2.1 (OP-01 view mapping), §2.3 item 5 (status fact "Originals"), §2.4.5 (action panel, "Also needed"), §2.5.3 (Delivery & originals tab carries the WP-12 forms) |
| W8 | `WP-08.md`; `WP-08-design.md` | SHA-256 076ac1b04d9119dc…; 7a74a46cc1480906… | record §3, §4.1 E-05, E-06, E-12; design OP-07 owner table (`originals` → "the originals section (OP-09)"), the TA completion sentences ("TravelMudra still holds an original document of this application" / "No original document is held") |
| W9 | `WP-09-acceptance.md` | SHA-256 921a665b20da281a… | format; §0.2; §0.5; G-03, G-05, G-07, G-09, G-10, G-11 |
| W10 | `WP-10.md`; `WP-10-acceptance.md` | SHA-256 8915f4fe82061cba…; 53f0298e60cd2203… | record §3, §4.1 H-01 to H-14; acceptance format, §0.2, §0.5, WP10-A03 (preparation-only holds no originals) |
| W3 | `WP-03-design.md` | SHA-256 d4d40cb1d18a7bc2… | carried TA-07 section "Originals" owned by WP-12 (`originalsSection`) |
| CAT | `catalogue/synthetic/catalogue.json` | SHA-256 f309f108fa9c923a… at e1f6ac9 | The physical-route offerings of §0.3 |
| Code | lane repository | e1f6ac9 | `src/modules/operations/case-work/commands/originals.ts`, `custody.ts`, `facade.ts`, `store.ts`, `evidence.ts`, `commands/common.ts`, `incidents.ts`; `src/modules/core/derived.ts` (completion E4, group end, pending 26–30), `commands/assignment.ts`, `commands/withdrawal.ts`; `src/modules/identity/policy.ts` (`operator.record_custody`, the `original` resource); `src/core-api/bindings/operations-work.ts` (`caseWorkPage`, command bindings), `bindings/core.ts` (`originalsOf`); `src/contracts/operations-work.ts`, `core.ts`; `src/kernel/vocabulary/operations.ts`, `subjects.ts`; `src/modules/operations/launch/readiness.ts`, `commands/seed.ts`; `src/cli/commands/seed-catalogue.ts`; `src/apps/staff/operations/case-work.ts`, `src/apps/shared/core/originals.ts`, `src/apps/shared/core/shared.ts`, `src/apps/staff/core/admin.ts`, `case.ts`; `src/web/route-inventory.ts`; the tests named per item |

Verified facts of the code at e1f6ac9 that the items rely on (read by the author; the design review checks the rest):

- **Offerings with originals on `lane-ui`.** `uat.py up` seeds the synthetic catalogue (`seed` default true;
  `tm seed synthetic`), and `ops.seed_launch` launches each listed offering for `all_active_tas`
  (`src/modules/operations/commands/seed.ts:74`). A synthetic offering launches although its return policy is
  unresolved (`launch/readiness.ts:90`: the refusal applies to non-synthetic offerings only). Two offerings hold
  originals (`custodyPaths.physical: true`, `originals.custody.held: true`, item types `passport` only):
  "SYN Paper visa with original return" (`syn_paper_return`, ₹5,400; return policy supported, recipient evidence
  kinds `attestation` and `document_version`, `sharedItemReturn: single_application_only`) and "SYN Business visa
  (paper)" (`syn_business_paper`, ₹5,200; return policy `{unresolved: parked_custody_route_policy}`). Every other
  synthetic offering has `physical: false`. No synthetic offering declares `all_linked_applications` or a second
  item type. The ops test kit names them `paperReturn` and `paperParked` (`test/operations/kit.ts:65-66`).
- **`ops.record_original_receipt`** (assigned operator; route `ops.custody.receipt`, POST
  `/ops/applications/:applicationId/originals`; no revision). Input: `applicationId`, `itemType`, `label` (other
  items only, 1 to 120), `description` (1 to 200), `parts` (1 to 50 labels of 1 to 120), `receivedParts` (part
  numbers), `holder {kind, ref?, location?}` (ref and location up to 200), `possessionAttested`, `evidence` (0 to 5),
  `eventAt` (optional). Order: policy and assignment (`access_denied`), `preparation_only_holds_no_originals`,
  `custody_path_not_declared`, lifecycle draft or submitted (`application_not_open`), `itemType` declared
  (`item_type_undeclared`), `possessionAttested` true (`control_blocked` / `custody_evidence_missing`: "a scan,
  parcel label or courier receipt alone is refused"), holder kind not `unknown` or `ta` (`holder_not_in_custody`),
  at least one received part within the parts (`not_a_part`), evidence and event time, then one original per item
  key and group (`conflict_duplicate` / `original_already_recorded`; a passport's key is derived from the
  applicant's identity, so one passport original per applicant and group). Parts not received start `expected`.
  Result: resource `application`, summary `{applicationId, originalId}`. Fact `ops.original_received`.
- **`ops.record_original_movement`** (route `ops.custody.movement`, POST `/ops/originals/:originalId/movements`;
  optional revision `original`). Input: `kind` (`receipt`, `partial_movement`, `holder_update`), `parts` (1 to 50),
  `toHolder`, `uncertainty` (up to 500), `possessionAttested`, `evidence` (0 to 5), `eventAt`. Every linked
  application must be assigned to the actor (policy on the `original` resource and `lockLinked`). Refusals:
  `stale_revision`; field `parts` `not_a_part`; `uncertainty` `required` (holder `unknown`); `toHolder.kind`
  `use_return` (holder `ta`); `parts` `part_returned`; for `receipt`: `parts` `part_not_expected`,
  `custody_evidence_missing` (no attestation), `toHolder.kind` `holder_not_in_custody` (unknown); for the other
  kinds: `parts` `part_not_received` (an expected part). Part states after a movement: `unknown` for holder
  unknown, `in_transit` for a partial movement to a courier, `held` otherwise. A holder `unknown` opens a
  `custody_discrepancy` incident owned by the assigned operator in the same transaction (one per movement). No
  duplicate guard. Result: resource `original`, summary `{originalId, movementId, incidentId?}`.
- **`ops.record_original_return`** (route `ops.custody.return`, POST `/ops/originals/:originalId/return`; optional
  revision `original`). Input: `parts` (1 to 50), `evidence` (1 to 5), `eventAt`. Order: assignment of every
  linked application, `stale_revision`, `returnAvailable` (`unavailable_parked` / `parked_custody_route_policy`
  unless every linked application's declaration has a supported return policy, and, with several linked
  applications, `all_linked_applications`), evidence rules, at least one evidence of a kind the policy declares
  (`control_blocked` / `custody_evidence_missing`), each part held, received or in transit (`parts`
  `part_not_held`). The recipient is always the owning travel agent account (no recipient input). Result: resource
  `original`, summary `{originalId, movementId, state}` (`state` = the original's aggregate state after the return).
- **`ops.link_original`** (route `ops.custody.link`, POST `/ops/originals/:originalId/link`; optional revision
  `original`). Input: `applicationId`. Order: policy and assignment on the target application (`access_denied`),
  the original in the same group (`access_denied` otherwise), `stale_revision`,
  `preparation_only_holds_no_originals`, `custody_path_not_declared`, already linked (`conflict_duplicate` /
  `duplicate_operation`), every linked application assigned to the actor (`unavailable_parked` /
  `parked_custody_route_policy`). No check of the target's applicant or lifecycle. No unlink command exists.
  Result: resource `original`, summary `{originalId, applicationId}`.
- **Common.** Evidence kinds are the closed set of `subjects.ts` (`evidence.N.kind` `evidence_kind_unknown`); a
  `document_version` must be a current, content-safe version of the group (`evidence_version_not_usable`); a note
  never holds an address or a link (`email_like`, `url_like`). `eventAt` is `YYYY-MM-DDTHH:MM` in IST or an ISO
  instant, never more than five minutes ahead (`instant_invalid`, `instant_in_future`; `evidence.ts:67-77`).
- **Policy.** `operator.record_custody` is `OPERATOR_ASG` (`policy.ts:222`). For an original, the assigned operator
  is the one operator assigned to every linked application; when the linked applications have different operators,
  or one has none, nobody qualifies (`policy.ts:524-534`). No travel agent, SuperAdmin or read-grant holder records
  custody.
- **Reads.** `ops.case_work` (surfaces `ops` and `admin`, `application.read`: the assigned operator, a read-grant
  holder and a SuperAdmin) returns `originals[]` (at most 50): `originalId`, `itemType`, `description`, aggregate
  `state`, original-level `holderKind` and `location` (the holder of the last movement, also when the movement moved
  one part only), `uncertainty` (the last statement; never cleared, `originals.ts:78`), `parts[]` (`partNo`, `label`,
  `state`, `holderKind`, `location`), `linkedApplicationIds` (ids only), `revision`. It returns `custody
  {heldOriginals, uncertain, returnAvailable}`: `heldOriginals` counts every part that is not returned and not
  unknown, **including expected parts that were never received** (`custody.ts:62-63`); `returnAvailable` is one
  flag per application (true only when the application has originals and every one of them is returnable). It
  returns `offers.recordOriginal` (null unless the viewer is assigned and the application open; blocked
  `preparation_only_holds_no_originals` or `custody_path_not_declared`; otherwise allowed, without a duplicate
  check) and `unavailable` with `parked_custody_route_policy` when parts are held and the return is unavailable.
  **No read returns** the movements, the evidence of a receipt, movement or return, the actor or the time of a
  custody fact, the holder reference, the declared item types (staff side), or an originals list across
  applications. `core.ops_work` rows carry `applicationId`, `applicantName`, `offeringTitle`, `groupLabel` (no group
  id), at most 500. The SuperAdmin full audit indexes `ops.original_received`, `ops.original_moved`,
  `ops.original_returned` and `ops.original_linked`.
- **Travel agent.** `core.ta_application.originals` is `{itemTypes}` or null; custody facts are not sent to the
  travel agent (`contracts/core.ts:274-279`). The TA history projection, which the operator history page reads too,
  has no custody line.
- **Completion and closure.** Prerequisite `originals` (`derived.ts:199-200`) is unmet with `original_held` while a
  part of any linked original is not returned (expected, received, held or in transit) and with
  `custody_evidence_missing` while a part is unknown; Core evaluates it whatever the outcome. After an outcome, the
  pending answer (`derived.ts:413-416`) has the assigned operator as owner (a SuperAdmin when no operator is
  assigned), reason `original_held` (return available) or `parked_custody_route_policy`, next action
  `return_original`. Group end excludes held and unknown originals (`derived.ts:257-259`). Request completion is the
  CMD-48 boundary (LD-04): nothing completes by itself when the last prerequisite is met.
- **Reassignment and withdrawal.** `core.reassign` moves open holds, the reconciliation of open acts and the
  previous operator's incidents of the application, custody incidents included (`transferApplicationDuties`), and
  changes no custody row (`assignment.ts:6-11`). An accepted withdrawal keeps originals and remaining duties
  (`withdrawal.ts:8-9`); the assignment stays, so the assigned operator can still record movements and returns.
- **Today's pages.** The four forms sit in the case-work section of the operator case page
  (`src/apps/staff/operations/case-work.ts:322-366`): a free-text item type that defaults to `passport`, the parts as
  one comma-separated field, part numbers as typed text, no evidence row on the receipt or the movement, no event
  time, no holder reference. The handlers (`case-work.ts:566-584`) cut text fields (`f(…, max)` slices), keep only
  50 part labels and cut each at 120 characters, drop part numbers that are not one or two digits (`numbers`), read
  only evidence row 0 (`evidenceRowOf`), and the movement, return and link handlers have no re-render: a refusal
  answers the error page (`routes.ts:162-170`) and a missing `returnTo` sends the operator to `/ops/work`. The page
  shows the application-level return flag and shows the original-level uncertainty statement as current. TA-07's
  section (`src/apps/shared/core/originals.ts`) shows the declared item types and a parked notice.

### 0.2 Conventions

- **Personas.** Travel agent: Y, `wp12-ta-[stamp]`, a fresh synthetic travel agent per run (created and activated on
  SA-06 at set-up); `syn-ta-2` for isolation only. Operators: `operator-1` (OP1: R, M1, M2 and E at first),
  `operator-2` (OP2: B; later R and M2 by reassignment), `operator-3` (holds a group read grant of the run's group;
  read-only checks). SuperAdmins: `superadmin-1` (SA1, set-up and the SA-03c preview under test) and
  `superadmin-2` (SA2, observation). They stand for `syn-operator-1` to `-3` and `syn-superadmin-1`, `-2`.
  Keyboard-only user. Screen-reader user. Phone user (390 px wide). No step suspends a seeded account.
- **Where.** `L`: a person or the LD-11 harness shows it on `lane-ui`. `T`: an automated test in the lane repository
  shows it at the same commit; the run record names the test. `L+T`: both are required. A test that the item says
  WP-12 adds is named in the run record with its file and title.
- **Sign-in codes (rule C).** As WP-01 §0.2. The LD-11 harness signs in. Nobody prints, logs, screenshots or stores a
  code or an authenticator key.
- **Copy.** Quoted text is draft copy (CR-09). Draft copy passes when the page states the same facts. The §11.3
  boundary form is mandatory for an unavailable action: "[Action] is unavailable until [policy or evidence] is
  [approved / recorded]. Owner: [owner or 'not yet named']." Core's reasons show in words; a code shows only as the
  UAT-13 fallback (A52).
- **Custody words** (draft; the design governs the words, the facts stay). Original states: `expected` "Expected,
  not received yet"; `held` "Held"; `in_transit` "In transit"; `partly_returned` "Partly returned"; `returned`
  "Returned to the travel agent"; `uncertain` "Whereabouts uncertain". Part states: `expected` "Expected, not
  received"; `received` "Received"; `held` "Held by [holder][, place]"; `in_transit` "In transit with [holder][,
  place]"; `returned` "Returned to the travel agent"; `unknown` "Whereabouts unknown". Holder kinds: `tm_office`
  "TravelMudra office"; `tm_person` "A TravelMudra person"; `courier` "Courier"; `authority` "The authority"; `ta`
  "The travel agent"; `unknown` "Not known". A missing place reads "Place not recorded". Counts read "[n] parts not
  returned" and "[m] parts with whereabouts unknown"; a part that is only expected is never called "held". The
  UI-PLAN glossary terms ("Held by [holder]; Holder uncertain; Partly returned; Returned to owner") map to these;
  the owner is the owning travel agent account, which Core records as the recipient of every return. "Received"
  means a receipt into TravelMudra's custody only. Never: "Lost", "Damaged", "Missing" or "Destroyed" as a state
  (loss and damage are a parked policy); "Delivered" or "Sent" for a return; "Transferred to [operator]" or
  "Moved to [operator]" for custody.
- **Dates and times.** Every time carries "IST" (AD-10, CR-06). Event time and recorded time are both shown where a
  read returns both. No custody read returns either today (Q-03), so no page shows a custody time it did not read.
- **Freshness (LD-08).** An authoritative read (`core.*`, `ops.*`) shows "Read at [time] IST". A projection
  (`views.*`, OP-01, SA-01 Monitors) shows "Up to date when read at [time] IST", "Behind by [n] s when read at
  [time] IST" or "Freshness unavailable". No page applies a client-side age threshold.
- **Facts.** A page shows only facts that a read returns (WP-02 B-06). A fact read after an operation is labelled
  "Current". A count that a read cannot give shows "Unavailable", never "0" (D7). A list that returns its row limit
  says so and claims no total. Custody facts come from `ops.case_work`; another application's facts never come
  from a read the viewer cannot make.
- **Receipts.** CMP-08 as WP06-A103: the request reference links to the operation status page; the resulting facts;
  "Recorded once. Sending the same form again does not repeat it."; no accepted time (P-02). A receipt names the
  command only when the operation's resource, the returned id and the summary establish it, or when a read by the
  returned id establishes it (A47). Otherwise it reads "Request recorded" with the current facts labelled "Current"
  (WP-06 D-02). A receipt states what was recorded and the current facts; it never repeats an instruction from the
  past (F-01 class). The polite region announces it.
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
  Two more cases belong to the replay matrix (A50), never to a term: a *business duplicate* (a new key with the
  current page's facts) and a *raw stale envelope* (a new key with an older page's revision).
- **Refused sends leave no record.** A refused command leaves no operation record: the status page of its key reads
  "Nothing is recorded for request [reference] so far", and the refusal shows only on the re-rendered form. Every
  refusal item says "nothing is recorded" and checks it by delta where a part state, a link, an incident or a count
  could change.
- **Paths (LD-03).** Existing POST paths and form actions stay: receipt `/ops/applications/:applicationId/originals`,
  movement `/ops/originals/:originalId/movements`, return `/ops/originals/:originalId/return`, link
  `/ops/originals/:originalId/link`. New GET pages get the paths that the design names. This checklist calls them
  OP-09 (the originals of one application, with the receipt form), OP-09m (record a custody change of one original),
  OP-09t (record a return to the owner) and OP-09l (link an original to another application) until the design names
  them (Q-14). SA-03c is WP-06's page `/admin/applications/:applicationId/reassign`. Pages of other packages: OP-02,
  OP-01 (WP-07); OP-07, TA-07r (WP-08); TA-07 (WP-03); incident pages (WP-14). An item names the page; the run
  record names the path used.
- **Pass rule.** WP-12 passes when every `L` item passes on `lane-ui` at the integrated ref, every `T` item has a
  named passing test at that commit, every axe item passes, and the V18 proof of §3 passes, except the explicitly
  deferred items of §5. The run record lists each deferred item as "Deferred" with its reference, not as "Fail". The
  parked shared-item and return policies (BS B30; UI-PLAN B-05) read "Unmet: parked policy, owner product owner";
  they are not WP-12 failures when the page shows the boundary. An item that the architect marks "partly met" by a
  recorded decision passes with that note. A failed item becomes a finding ranked P0, P1 or P2 with its scenario
  (PRI-20260930-01).
- **Preconditions on `lane-ui`.** WP-01, WP-02, WP-03, WP-06, WP-07 and WP-08 are integrated (TA pages create, edit
  and submit; SA-06 creates accounts; SA-07a records payments; SA-03a assigns; SA-03c reassigns; OP-02 has its tabs
  and action panel; OP-07 shows completion; TA-07 shows the completion rows). Where one is not integrated, the step
  runs on the existing page and the run record says so. The applicant-withdrawal form (WP-17) is reachable on OP-02
  or the old case page as a carried form. The harness can create, activate and sign in a new synthetic travel agent,
  and the offerings of §0.3 admit it (checked first, §0.4).
- **Data hygiene.** WP-12 MUST NOT change seeded offerings, declarations, return policies, launches, listings or
  accounts, and MUST NOT create an offering. Each run creates its own travel agent Y, group and applications, with
  descriptions, notes, references and evidence that carry the run tag. Synthetic documents only, generated in memory;
  passport numbers are new in every run; no description or note holds a passport number. A run leaves applications
  that cannot complete (B's parked return; the shared original of M1 and M2): this is expected, and later runs
  exclude them by their tag. The run record keeps identifiers (travel agent, applications, originals, movements,
  incidents, operation references) in the internal record only.

### 0.3 Synthetic data used by WP-12

| Item | Value | Use |
|---|---|---|
| Travel agent | Y, `wp12-ta-[stamp]`, a fresh synthetic travel agent per run (SA-06) | Every application of the run |
| Group | `wp12-[stamp]` in Synthetica; travel start today + 30 days, return today + 40 days | R, B, M1, M2, E |
| R | "SYN Paper visa with original return" (`syn_paper_return`), ₹5,400, TravelMudra files; physical route; item type passport; return policy supported for one application; applicant RANI | The main custody path: receipt with one part expected, the second receipt, a partial movement, whereabouts unknown, found again, withdrawal (Setup), partial return, reassignment, full return |
| B | "SYN Business visa (paper)" (`syn_business_paper`), ₹5,200; physical route; return policy parked; applicant BINA; assigned to OP2 | The parked return boundary; OP2's view of the group (no visibility of R's original) |
| M1, M2 | M1 "SYN Paper visa with original return" and M2 "SYN Business visa (paper)", the same applicant MIRA (one passport) | A passport recorded once per applicant and group; the link; the shared-item return boundary; the reassignment of M2 that splits the shared original |
| E | "SYN Tourist e-visa" (`syn_tourist_evisa`), ₹3,500; electronic only; applicant ELA | No custody path; link target refused |
| Passports | `td3Lines` of a `SyntheticPassport` with surname `SYNWPTWELVE`, document code P, issuing state and nationality IND, expiry at least six months after the return date, number "S" + seven digits new to the run; rendered with `passportTextPdf` or `passportImage` (`test/fixtures/documents/samples.ts`). Given names: R "RANI", B "BINA", M1 and M2 "MIRA" (one passport), E "ELA" | Intake |
| Photographs | `plainPng` at least 350 × 350 px | Intake |
| Payments | "Payment received" for R, B, M1, M2 and E, evidence reference `SYN-W12-[stamp]-[letter]` | Gate 1 passes on payment; no exception is used |
| Original parts | R: "Passport booklet" and "Old passport" (part 1 received at the receipt, part 2 later); B, M1: "Passport booklet" | Partial receipt, partial return |
| Holders and places | TravelMudra office, place "SYN shelf W12-[stamp]"; Courier, place "SYN courier W12-[stamp]" | Movements |
| Evidence values | External references `SYN-W12-[stamp]-[letter]-[n]` (for example a courier waybill `SYN-W12-[stamp]-R-AWB`); attestations "WP12 [stamp] handed to the travel agent's representative"; the uncertainty statement "WP12 [stamp] the courier cannot trace the parcel"; descriptions "WP12 [stamp] applicant passport" | Receipt, movement, return; no address, link or passport number in any text |
| Withdrawal (Setup) | R: the applicant's withdrawal recorded by OP1 with the note "WP12 [stamp] the applicant withdrew" and the reference `SYN-W12-[stamp]-R-WD` | An outcome (Withdrawn) so that completion applies and Core's next action is the return (UX §3.2: return duties outlive withdrawal) |

### 0.4 Run recipe (rerunnable)

- Run tag `wp12-[yyyymmddhhmm]`. First check: the harness can sign in Y, and "SYN Paper visa with original return",
  "SYN Business visa (paper)" and "SYN Tourist e-visa" admit Y (TA-03). Fallback when they do not: `syn-ta-1` with a
  run-tagged group (no other change to `syn-ta-1`), recorded in the run record.
- Baseline (step P-0, before the set-up): the OP-01 view counts of OP1 and OP2 (Action now, Waiting, Delivery and
  closure, Continuing duties); the open custody incidents listed for OP1 and OP2; SA-01 Monitors "custody
  incidents" and "parts with unknown whereabouts" where the page shows them; the TA-10 count of Y right after its
  activation. Every later count check is a delta from it.
- Setup (labelled "Setup", driven by the harness through integrated pages): SA1 creates and activates Y. Y creates
  the group and the drafts R, B, M1, M2 and E on TA-09 and submits them on TA-08. SA1 records "Payment received" for
  each (SA-07a), assigns R, M1, M2 and E to OP1 and B to OP2 (SA-03a), and grants `operator-3` read access to the
  group. Later set-up (the withdrawal of R; the reassignments of M2 and R) is in the steps of §3.
- Every harness send uses the fields of a freshly loaded page unless the step says "raw". A raw envelope is built
  from a page loaded earlier in the run and named in the run record.
- Order (§3): P-0, Setup, Part E, Part R1 (receipt and movements), Part B (parked return and visibility), Part M
  (shared original), Part R2 (withdrawal, partial return, reassignment, full return), Part X (isolation, tests, axe).
  Part B runs before R is reassigned to OP2. Data of earlier runs stays and is excluded by its tag.
- If Core records the applicant withdrawal of R as refused (its assessment, not a command refusal), the run record
  says so and V18-R9 to R11 continue without an outcome: OP-07 still shows the `originals` row, Core's next action
  is not `return_original`, and clause 1 is recorded "partly shown" for the run (A42 and A45 then run as tests).

### 0.5 Refusal shapes in the code at e1f6ac9 (category / code)

| Command | Refusals the items assert |
|---|---|
| `ops.record_original_receipt` | `not_found_or_forbidden` / `access_denied` (not the assigned operator; a reassignment after the policy check; a SuperAdmin, a read-grant holder); `control_blocked` / `preparation_only_holds_no_originals`; `control_blocked` / `custody_path_not_declared`; `control_blocked` / `application_not_open`; `validation_failed` / `input_invalid` with field `itemType` code `item_type_undeclared`; `control_blocked` / `custody_evidence_missing` (possession not attested); `validation_failed` / `input_invalid` with `holder.kind` `holder_not_in_custody`, `receivedParts` `not_a_part`, `label` `required`, `evidence.N.kind` `evidence_kind_unknown`, `evidence.N.id` `evidence_version_not_usable` or `invalid_id`, `eventAt` `instant_invalid` or `instant_in_future`; `validation_failed` on the schema (description, parts count and length, holder kind, place, evidence count, a note with an address or a link: `email_like`, `url_like`); `conflict_duplicate` / `original_already_recorded` |
| `ops.record_original_movement` | `not_found_or_forbidden` / `access_denied` (not the one operator of every linked application: another operator, a split shared original, a reassignment); `stale_revision` / `stale_revision`; `validation_failed` / `input_invalid` with `parts` `not_a_part`, `part_returned`, `part_not_expected`, `part_not_received`; `uncertainty` `required`; `toHolder.kind` `use_return` or `holder_not_in_custody`; the evidence and event-time codes above; `control_blocked` / `custody_evidence_missing` (a receipt of parts without attestation); `validation_failed` on the schema (`kind`, parts count, statement length, evidence count, notes). After acceptance with holder `unknown`: a `custody_discrepancy` incident (a fact, not a refusal) |
| `ops.record_original_return` | `not_found_or_forbidden` / `access_denied`; `stale_revision` / `stale_revision`; `unavailable_parked` / `parked_custody_route_policy` (a linked application's declaration has no supported return policy; a shared original under a single-application policy); the evidence and event-time codes above; `control_blocked` / `custody_evidence_missing` (no evidence of a kind the policy declares); `validation_failed` / `input_invalid` with `parts` `part_not_held`; `validation_failed` on the schema (no evidence, more than five, parts count) |
| `ops.link_original` | `not_found_or_forbidden` / `access_denied` (target not assigned to the actor; an original of another group or an unknown id); `stale_revision` / `stale_revision`; `control_blocked` / `preparation_only_holds_no_originals`; `control_blocked` / `custody_path_not_declared`; `conflict_duplicate` / `duplicate_operation` (already linked); `unavailable_parked` / `parked_custody_route_policy` (a linked application of another operator) |
| `core.reassign` (WP-06; reference only) | As WP-06 §0.5 and WP06-A54 to A58. WP-12 asserts only that no refusal and no acceptance of `core.reassign` changes a custody fact |

## 1. Scope

### 1.1 Pages

| Page | Host and path | Part in WP-12 |
|---|---|---|
| OP-09 Originals of an application | 4652, path named by the design (expected: a GET beside today's receipt POST `/ops/applications/:applicationId/originals`); reached from OP-02 "Delivery & originals", OP-07 and the OP-02 action panel | The items (CMP-17) with their parts, holders, places, uncertainty and links; the receipt form; the states with no custody path, a parked return, a shared original; read-only readers |
| OP-09m Record a custody change | 4652, path named by the design (POST `/ops/originals/:originalId/movements` stays) | Further receipt, partial movement, holder update, whereabouts unknown |
| OP-09t Record a return to the owner | 4652, path named by the design (POST `/ops/originals/:originalId/return` stays) | The return of chosen parts to the owning travel agent with evidence; the parked and shared boundaries |
| OP-09l Link to another application | 4652, path named by the design (POST `/ops/originals/:originalId/link` stays) | The link of an original to another application of the group |
| SA-03c Reassign (WP-06 page) | 4652 `/admin/applications/:applicationId/reassign` | Only the custody detail of "What moves and what stays" (UI-PLAN §12.2; WP-06 Q-W06-01) |
| TA-07 Application workspace, section "Original documents" (carried by WP-03; owned by WP-12) | 4650 `/ta/applications/:applicationId` | The declared originals and the parked visibility boundary; no custody detail |
| OP-02 (WP-07 page) | 4652 `/ops/applications/:applicationId` | Status fact "Originals"; the "Delivery & originals" summary and links; the action-panel row for `return_original`; "Also needed" custody incidents; no custody form |
| OP-07 (WP-08 page) | 4652 | The `originals` requirement row: Core's codes in words and the link to OP-09 |
| OP-01 (WP-07), SA case page, SA-01 Monitors, incident pages (WP-14) | 4652 | Observation only |
| Old operator case page; case-work section | 4652 | Only: the custody forms leave them; links replace them; every other carried form stays |

Read models: Operator case (`core.ops_case`, `ops.case_work`), Assigned work queue (`core.ops_work`,
`views.ops_work`), SuperAdmin case (`core.admin_case`, `ops.case_work` on the admin surface), TA application case
(`core.ta_application`), TA history (`views.ta_history`, projection), Monitors (`views`, projection), Incidents
(`ops.incidents`, `ops.incident`), Operation (`core.operation`).

### 1.2 Command coverage (CC §5.1: 4 WP-12 commands)

| # | Command | Route id (POST path) | Host page | Items |
|---|---|---|---|---|
| 1 | `ops.record_original_receipt` | `ops.custody.receipt` (`/ops/applications/:applicationId/originals`) | OP-09 (receipt form) | A08 to A12; A10 effects |
| 2 | `ops.record_original_movement` | `ops.custody.movement` (`/ops/originals/:originalId/movements`) | OP-09m (kinds `receipt`, `partial_movement`, `holder_update`; holder "Whereabouts unknown" with the statement) | A13 to A20 |
| 3 | `ops.record_original_return` | `ops.custody.return` (`/ops/originals/:originalId/return`) | OP-09t (owner receipt: a return to the owning travel agent with evidence) | A21 to A27 |
| 4 | `ops.link_original` | `ops.custody.link` (`/ops/originals/:originalId/link`) | OP-09l | A28 to A32 |
| ref | `core.reassign` (WP-06; WP06-A51 to A62) | `admin.applications.reassign` | SA-03c | WP-12 adds the custody detail only: A33 to A37 |

All of them also: A46 (shell), A47 (receipt checked against the operation), A48 (no instruction to act), A49 (no
record for a refusal; lost acknowledgement), A50 (replay matrix), A51 and A52 (refusal text), A53 (LD-14 and
outages), A54 to A59 (role controls, copy, read grant and support view, storage, host pages and carried forms,
isolation), A60 (LD-17 handlers).

UI-PLAN §12.2 names five actions for WP-12. "Record original receipt" is command 1. "Record original movement" and
"Record holder uncertain" are command 2 (holder uncertain is the holder "unknown" with its statement; CMD-51 note).
"Record owner receipt" is command 3: Core records every return to the owning travel agent account. "Reassign
operator" is `core.reassign`, built in WP-06 (CC §6.1); WP-12 adds the custody detail to its preview. Command 4,
`ops.link_original`, has no UI-PLAN action (CC §3 note, inventory §5 group A); WP-12 gives it its host.

Commands outside WP-12 that the proofs touch only as set-up or observation: `iam.create_account`,
`iam.activate_account` (WP-02); `core.create_group`, `intake.start_individual`, `core.edit_draft`, `core.submit`
(WP-03); `pay.record_service_status`, `core.assign`, `core.reassign` (WP-06); `core.record_applicant_withdrawal`
(WP-17, carried form); `iam.create_group_read_grant` (WP-15); `iam.start_support_view` (test only).

### 1.3 State coverage

S1 (loading) does not apply: every WP-12 page is server-rendered. S5 applies only to OP-01 and SA-01 Monitors
(projections), which WP-12 observes.

| Page | Page states | C1 validation | C2 rejected | C3 accepted | C4 unresolved | C5 stale |
|---|---|---|---|---|---|---|
| OP-09 | No custody path A05; empty with the receipt form A01; items A02, A04; parked return A06; shared original A31; split shared original A35; read only A07; outage A53 | A09 (1) | A09 (2), (3), A11 | A10 | A12 (5) | — (the receipt carries no revision; its duplicate check answers, A12 (3)) |
| OP-09m | Form A13 | A16 (1) | A14 (1), (3), A15, A18 | A14 (2), A15, A16 (2), A17 | A20 (5) | A19 |
| OP-09t | Form A21; parked A06; shared A31; split A35 | A22 (1) | A22 (2), (3), A24 | A23, A25 | A26 (5) | A24 (5) |
| OP-09l | Form A28; no eligible application A28 | A28 (no choice) | A30 | A29 | A32 (5) | A30 (5) |
| SA-03c custody detail | Held, partly returned, with a custody incident A33; shared A35; every state and outage A36 | — | — | after the command A34 (the receipt is WP06-A53) | — | — (WP06-A58) |
| TA-07 "Original documents" | Declared originals with the boundary; none for E A39 | — | — | — | — | — |
| OP-02 status fact, tab, action panel | A41, A42 | — | — | — | — | — |
| OP-07 `originals` row | Not met (held; uncertain), met A43 | — | — | — | — | — |

### 1.4 Specification scenarios

| Scenario | What WP-12 shows | Items |
|---|---|---|
| V18 clause 1: "Partial original return holds applicable completion" | After a withdrawal outcome, a partial return leaves OP-07 `originals` "Not met" and Core's next action "Return the originals"; the full return meets it; nothing completes by itself | A23, A25, A43, A45; §3 V18-R8, R9, R11 |
| V18 clause 2: "reassignment does not move custody" | The SA-03c preview states that originals stay with their holder and lists the custody facts as current; after the reassignment every part has the same state, holder and place; the previous operator is refused; the custody incident moves as a duty | A33, A34, A37; §3 V18-R10 |
| V18 clause 3: "undeclared shared-item policy does not grant other operators visibility" | Another operator of the group sees no fact of an original that is not linked to its own application; its link attempt is the parked boundary; a shared original's return is the parked boundary; after a reassignment splits a shared original, neither operator sees the other application and neither can record custody (boundary) | A30 (2), A31, A35, A38; §3 V18-B2, M3, M4 |
| UX §2.1: item-level holder, movement and return evidence; an assignment does not move an item | Item and part holders and states; movements and returns recorded with evidence. A custody history (movements, evidence, actor, times) is on no read: partly met (Q-03) | A02, A10, A13 to A17, A21 to A25 |
| UX §2.2: known holder and location or explicit uncertainty; partial return stays partial | Part-level holder and place; "Whereabouts unknown" with the statement; "Partly returned" | A02 to A04, A16, A17, A23 |
| UX §3.1 step 9: completion re-evaluates originals; no automatic completion | OP-07 shows Core's `originals` flag; the last return completes nothing | A25, A43 |
| UX §3.2 Physical route: item-level receipt, partial movement, holder uncertainty, actual owner receipt; return duties outlive withdrawal; shared-item policy gaps block affected steps | The four commands; the withdrawal keeps the return duty; parked boundaries on the affected steps | A08 to A32, A45 |
| UX §5.4, §6.3: a reassignment revokes the old operator at once; the preview names the retained custody holder | SA-03c custody detail; SH-02 for the previous operator | A33, A34, A37 |
| BS B30: assignment, scans, parcel labels and courier receipts do not prove possession or return; preparation-only holds no originals; same-group linkage grants no other operator's view | The attestation rule at receipt; the evidence rule at return; no custody path for preparation-only; no cross-operator view | A05, A09 (2), A22 (2), A38, A55 |
| UX §12 V24 (keyboard and phone) | The WP-12 tasks by keyboard and at 390 px | A61 to A72 |

## 2. Acceptance checklist

### 2.1 OP-09 Originals of an application: reading

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP12-A01 | Operator (OP1) | OP-02 "Delivery & originals" and OP-09 of R before any receipt (§3 V18-R1) | Open OP-02 of R, tab "Delivery & originals". Follow the link to the originals. Read OP-09 from the top. Select "Cancel" on the receipt form. | OP-02 tab: an "Originals" summary "No original is recorded for this application." with the link "Open the originals" → OP-09; no custody form on OP-02. OP-09: the OP-02 frame (identity band, status facts) and the `h1` "Originals: [applicant]"; the route line "This service works with the applicant's physical originals. TravelMudra records each original it receives, who holds each part and where, and its return to the travel agent."; the empty state "No original is recorded for this application."; the receipt form (A08). No movement, return or link control and no return boundary while no original exists (Core's `returnAvailable` is false only because no original exists). Freshness "Read at [time] IST". "Cancel" records nothing (original count delta 0). | L | UX §5.2 (Originals), §5.3; PL §3.3 OP-09; `operations-work.ts:150-151` (`recordOriginal`); `custody.ts:67` |
| WP12-A02 | Operator (OP1, later OP2); test | OP-09 of R after §3 V18-R3, R4, R5, R6, R7, R9 and R11; renderer test with fixtures | Read the item after each step. | One item row (CMP-17) per original: "[item type words]: [description]"; the item state in the words of §0.2; the item holder line derived from the parts, never from the original-level holder alone (it follows the last movement even when one part moved, Q-10): one holder → "Held by [holder], [place]"; several → "Several holders: see each part"; some parts unknown → "Whereabouts unknown: [k] of [n] parts" and the holder of the others. A parts table: number, label, state words, holder and place per part ("Place not recorded" when null; "Not known" for an unknown part; nothing for an expected part). Counts from `custody`: "[n] parts not returned" and "[m] parts with whereabouts unknown"; an expected part is never called held. Linked applications: "This application only", or "Also linked to [k] other application(s) of this group" with a link only to an application the reader can open (A35, A38). The line "The custody history of this original is not shown here. A SuperAdmin can read it in the full audit." (partly met, Q-03). No movement list, actor, time or evidence is shown that a read did not return. Per step: after R3 part 1 "Held by TravelMudra office, SYN shelf W12-[stamp]", part 2 "Expected, not received", "2 parts not returned"; after R4 both held; after R5 part 1 "In transit with Courier, SYN courier W12-[stamp]" and "Several holders"; after R6 part 1 "Whereabouts unknown", item "Whereabouts uncertain", "1 part with whereabouts unknown"; after R7 both "Held by TravelMudra office"; after R9 part 1 "Returned to the travel agent", item "Partly returned", "1 part not returned"; after R11 item "Returned to the travel agent", "0 parts not returned". | L+T | UX §2.1, §2.2; PL CMP-17, §11.2; BS B30; `facade.ts:49-61`; `custody.ts:17-27, 54-68`; `originals.ts:65-83` |
| WP12-A03 | Test | Custody word tables (test file named by the design) | Render every value of `ORIGINAL_STATES`, `ORIGINAL_PART_STATES`, `ORIGINAL_HOLDER_KINDS` and `ORIGINAL_MOVEMENT_KINDS`, an unknown value of each, and item-holder fixtures (one holder; several; one unknown part of two; all unknown; expected only; an original-level holder that differs from every part). | Every value has staff words (§0.2); an unknown value reads "Unrecognised state" with "Reference: [code]"; the item holder line follows the parts in every fixture; no word "Lost", "Damaged", "Missing" or "Destroyed"; "held" never for an expected part; "Returned" only for a returned part. | T | `kernel/vocabulary/operations.ts:67-83`; PL §11.2; WP-10 H-06 |
| WP12-A04 | Operator (OP1); test | OP-09 of R after §3 V18-R6 and V18-R7; fixtures with an `uncertainty` text and no unknown part | Read the item after each step. | After R6 the statement "WP12 [stamp] the courier cannot trace the parcel" shows beside part 1 with "Whereabouts unknown". After R7 no part is unknown: the statement is not shown as a current fact (Core keeps the last statement on the original and never clears it). If the design keeps it visible, it is labelled as an earlier statement ("Statement recorded when a part's whereabouts were unknown"), never as "Uncertain" now. Test: the fixtures give the same result. | L+T | UX §2.2 ("known holder/location or explicit uncertainty"); `originals.ts:78`; WP-06 D-05 |
| WP12-A05 | Operator (OP1); harness; test | OP-02 tab and OP-09 of E (§3 V18-E1); test for a preparation-only application | Read. Harness: post a receipt on E. Test: render OP-09 of a preparation-only application; send a saved receipt envelope; link an original to it. | E: OP-02 tab and OP-09 read "This service holds no physical originals." (`custody_path_not_declared`); no form, no link. The receipt post is refused `custody_path_not_declared` in words; nothing is recorded (original count of the group delta 0). Test, preparation-only: "A preparation-only service holds no originals: the work ends in a packet for the travel agent." (`preparation_only_holds_no_originals`), no form; the saved envelope and the link are refused with that code; nothing is recorded. | L (E) + T | BS B04, B30; WP10-A03; `originals.ts:102-104, 170-171` |
| WP12-A06 | Operator (OP2); harness; test | OP-09 and OP-09t of B after its receipt (§3 V18-B1) | Read B's item. Open the return action. Harness: post a return of part 1 with an attestation. | B's item shows with its parts; receipt, movement and link stay available. The return action is CMP-10 "Returning originals through TravelMudra is unavailable until the product owner approves a return policy for this service. Owner: product owner." with the `unavailableButton` "Record a return" (`aria-disabled="true"`, described by the notice); OP-09t, opened by its address, shows the same notice and no form. The post is refused `unavailable_parked` / `parked_custody_route_policy` and re-rendered with the same sentence; nothing is recorded (B's part states unchanged; return count delta 0). No date, no "pending" claim and no other owner. The run record reads "Unmet: parked return policy (BS B30; PL B-05), owner product owner". Test: the renderer with `returnAvailable` false and `unavailable` holding the code. | L+T | BS B30; PL §11.3, §13.2 B-05; `custody.ts:29-52`; `operations-work.ts:117-118` |
| WP12-A07 | Operator (`operator-3`); SuperAdmin (SA2) | OP-09 of R with the group read grant (§3 V18-X1); SA case page of R, B, M1 and M2 | Read. | `operator-3`: the frame and the custody facts of A02 in the same words, the banner "Read-only access: [purpose], until [date time] IST", the line "Only the assigned operator records custody. You can read this application.", no form and no link to OP-09m, OP-09t or OP-09l. SA2: the SA case page shows the same custody facts and no custody control. The posts are A56. | L | UX §2.3; BS B10; PL SH-R09; `policy.ts:222` |

### 2.2 Record an original received (`ops.record_original_receipt`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP12-A08 | Operator (OP1) | OP-09 of R, the receipt form (§3 V18-R1) | Read the form. | Section "Record an original received" with fieldsets: "Item" (how the item is chosen is the design's, Q-08; the passport is the only declared item of the synthetic offerings); "Description" (required; Core's limit 200; hint "Do not type a passport number."); "Parts" (one label per row, at least one; Core's limits 50 parts of 120 characters) with "Received now" per row (checkbox, none preselected, at least one); "Held by" (radios in a fieldset, none preselected: TravelMudra office, A TravelMudra person, Courier, The authority; no "Not known" and no "The travel agent" for a receipt); "Place" (optional; 200); evidence rows (optional, 0 to 5: kind External reference, Document reference, Attestation; reference; note, with the hint that a note holds no address or link); "When it happened" (optional; IST; not in the future); the attestation checkbox (required, never prechecked) "I hold the received parts now. A scan, a parcel label or a courier receipt alone does not show possession." Effect (visible, before the button): "TravelMudra records this original once for the applicant in this group. A part you list but do not receive now stays expected until you receive it, and keeps the application open until it is received and returned. Assigning or reassigning the application never moves an original. The travel agent does not see custody details in this release." Buttons "Record the original" and "Cancel". | L | UX §3.2 (Physical route), §7.4; BS B30; PL OP-09; `originals.ts:87-91, 107-111`; Q-01 |
| WP12-A09 | Operator (OP1); harness; test | OP-09 of R (§3 V18-R2) | (1) Send with nothing filled. (2) Fill a description, one part received, holder TravelMudra office and the evidence row External reference `SYN-W12-[stamp]-R-AWB`; leave the attestation unchecked; send. (3) Harness, each send changing one value of an otherwise valid form with the attestation set: 51 part rows; a part label of 121 characters; a description of 201 characters; a place of 201 characters; six evidence rows; a note that holds an address; an event time of tomorrow; received part 3 of 2 parts; holder "Not known"; holder "The travel agent" (raw). (4) BFF test: the same values through the handler. | (1) C1 error summary: description, parts, a received part, holder, attestation; nothing recorded. (2) Refused `control_blocked` / `custody_evidence_missing`: "Record the original only when you hold it. A scan, a parcel label or a courier receipt alone does not show possession." at the attestation; the description, parts, holder and evidence row stay filled; the attestation stays unchecked (WP-09 G-07); nothing recorded. (3) Each is refused at its field with every value and row kept (`validation_failed`; `email_like`; `instant_in_future`; `not_a_part`; `holder_not_in_custody`). (4) The handler reads every part row, every indexed evidence row and every part number; nothing is cut, sliced or dropped; input over a limit is refused at the field (LD-17). Nothing is recorded in each case (original count delta 0; no fact). | L ((1) to (3)) + T | BS B30; LD-17; `originals.ts:88-111`; `evidence.ts:67-77`; `subjects.ts:61-73` |
| WP12-A10 | Operator (OP1 for R and M1; OP2 for B) | OP-09 of R (§3 V18-R3), B (V18-B1), M1 (V18-M1); OP-02 and OP-07 of R; TA-07 and TA-10 of Y | Record the original: description "WP12 [stamp] applicant passport", parts "Passport booklet" (received now) and "Old passport" (not received), holder TravelMudra office, place "SYN shelf W12-[stamp]", evidence `SYN-W12-[stamp]-R-AWB`, the attestation. Read OP-09, OP-02, OP-07. Y reads TA-07 of R and TA-10. | C3 receipt "Original recorded" (named: application resource with an `originalId`); recorded: the item and the parts received now; Current: the item row of A02 read by the returned `originalId`; "Recorded once. Sending the same form again does not repeat it."; no accepted time. The receipt form gives way to the item with its actions (custody change, return or its boundary, link). OP-02: status fact "Originals: 2 parts not returned" (A41). OP-07: `originals` "Not met" with `original_held` in words (A43). TA-07 of R: no custody fact (A39); TA-10 delta 0. The polite region announces the receipt; focus does not move. B and M1: the same pattern with one part. | L | CMP-08; WP-06 D-02; P-02; `originals.ts:126-151`; `derived.ts:199-200` |
| WP12-A11 | Operator (OP1, OP2, `operator-3`); SuperAdmin (SA2); harness; test | Receipt action | (1) Harness, after V18-M1: a receipt of MIRA's passport on M2 from M2's freshly loaded OP-09. (2) Harness: item type `visa_sticker`. (3) Received part 3 of 2 (V18-R2). (4) Holder "Not known" or "The travel agent" (V18-R2). (5) OP2, `operator-3` and SA2 open OP-09 of R and post a receipt on R. (6) Test: a receipt on a completed application. (7) Test: a receipt by the previous operator after a reassignment. | (1) `conflict_duplicate` / `original_already_recorded`: "This original is already recorded on another application of this group. Link it to this application from there." with the M2 page re-rendered and the values kept. (2) `item_type_undeclared` at "Item": "This service does not use originals of that kind." (3) `not_a_part` at "Received now". (4) `holder_not_in_custody` at "Held by": "A receipt records an original that TravelMudra holds. Choose who at TravelMudra, the courier or the authority holds it." (5) OP2: SH-02 on OP-09 of R and the uniform not-found answer on the post; `operator-3`: the read-only page and the post refused as not found; SA2: no receipt control on any SuperAdmin page, the post refused. (6) `application_not_open`: "This application is closed. No original can be recorded for it." (7) SH-02. Nothing is recorded in each case (original count delta 0). | L ((1) to (5)) + T | `originals.ts:94-131`; `policy.ts:222`; BS B10 |
| WP12-A12 | Operator (OP1); harness | Receipt, the Nth time | Replay terms 1 to 5 on A10 (R). Term 2 changes the place. Term 3: press Back after the receipt; harness: a new-key send from the reloaded page. Term 4: the refusal of A09 (2), then the corrected send. | (1) The original receipt and `originalId`; one original; one fact `ops.original_received`. (2) Refused as a used form; nothing recorded. (3) Back reloads OP-09 with the item listed before any receipt form (Core's offer has no duplicate check, so the form MAY still show); the new-key send is refused `original_already_recorded` and records nothing. (4) Recorded once. (5) C4; no new receipt is offered there. The receipt carries no revision: its stale case is the business duplicate check. | L+T | PL §7 K-STD; BS B35; WP-01 A-02, A-08; WP-09 G-03 |

### 2.3 Record a custody change (`ops.record_original_movement`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP12-A13 | Operator (OP1) | OP-09m of R's original after the receipt (§3 V18-R4) | Open "Record a custody change" from the item. Read. Select "Cancel". | `h1` "Record a custody change: [item]". Scope "A record of where parts of this original are now. Your name, the evidence and the time are kept." Evidence: the parts table of A02 and the open custody incidents of the application with links. Fields: "What happened" (radios, none preselected): "Parts received" (`receipt`), "Parts moved" (`partial_movement`), "Holder changed, or whereabouts unknown" (`holder_update`); "Which parts" (checkboxes, none preselected; each "[n]. [label]: [state words]"); "Now held by" (radios, none preselected: TravelMudra office, A TravelMudra person, Courier, The authority, Whereabouts unknown; no "The travel agent", with the line "A hand-over to the travel agent is a return." and the link to OP-09t or its boundary); "Place" (optional); "What is uncertain" (required when "Whereabouts unknown"; Core's limit 500); the attestation for received parts (never prechecked; required for "Parts received"); evidence rows 0 to 5; "When it happened" (optional); hidden `_rev.original`. Effect (visible): "Whereabouts unknown opens a custody incident that you own. Recording the same change again records it again. Assigning or reassigning the application never moves an original." Buttons "Record the change" and "Cancel" (→ OP-09; nothing recorded). | L | UX §3.2; BS B30; PL OP-09; `originals.ts:189-254`; WP-09 G-03 |
| WP12-A14 | Operator (OP1); harness | OP-09m of R's original (§3 V18-R4) | (1) "Parts received", part 2, TravelMudra office, place; the attestation unchecked; send. (2) The same with the attestation. (3) Harness: "Parts received" for part 1 (held). | (1) Refused `custody_evidence_missing` with the possession sentence of A09 (2) at the attestation; the choices stay chosen; nothing recorded. (2) C3 "Custody change recorded" (A47); Current: part 2 "Held by TravelMudra office, SYN shelf W12-[stamp]"; "2 parts not returned"; no incident (custody incident count delta 0). (3) `part_not_expected` at "Which parts": "Part 1 is not expected: it was already received. Choose an expected part."; nothing recorded. | L | BS B30; `originals.ts:218-222` |
| WP12-A15 | Operator (OP1); harness | OP-09m of R's original (§3 V18-R5) | "Parts moved", part 1, Courier, place "SYN courier W12-[stamp]", evidence External reference `SYN-W12-[stamp]-R-1`. Read OP-09 and OP-07. Harness: "Parts moved", part 2, holder "The travel agent" (raw). | Receipt; Current: part 1 "In transit with Courier, SYN courier W12-[stamp]", part 2 "Held by TravelMudra office"; the item line "Several holders: see each part" (A02); never "Returned"; OP-07 `originals` unchanged ("Not met"). The raw send is refused `use_return` at "Now held by": "A hand-over to the travel agent is a return. Record a return instead."; nothing recorded (part 2 unchanged). | L | UX §3.2 ("partial movement"); `originals.ts:212, 223-226` |
| WP12-A16 | Operator (OP1); SuperAdmin (SA1, observation) | OP-09m and OP-09 of R; OP-02, OP-07, OP-01 of R; SA-01 Monitors (§3 V18-R6) | (1) "Holder changed, or whereabouts unknown", part 1, "Whereabouts unknown", no statement; send. (2) Add the statement "WP12 [stamp] the courier cannot trace the parcel"; send. Read the pages. | (1) C1 at "What is uncertain": "Say what is uncertain about where the part is."; the choices stay chosen; nothing recorded; no incident (custody incident count delta 0). (2) C3 receipt with Recorded "A custody incident is open: [reference]" linked to the incident page (from the summary `incidentId`) and Current part 1 "Whereabouts unknown" with the statement; item "Whereabouts uncertain". OP-02: "Also needed" lists the custody incident (owner you); status fact "1 part with whereabouts unknown". OP-07: `originals` "Not met" with `custody_evidence_missing` ("The whereabouts of an original are uncertain.") and `original_held` in words. OP-01: R's row follows WP-07's mapping (an open custody incident the reader acts on is in "Action now"; delta). SA-01 Monitors, where the page shows them: custody incidents + 1, parts with unknown whereabouts + 1, with the lag freshness. | L | UX §2.2 ("explicit uncertainty"); BS B30, B33; `originals.ts:211, 242-247`; `derived.ts:200`; `case-queries.ts:223` |
| WP12-A17 | Operator (OP1) | OP-09m and OP-09 of R (§3 V18-R7, tab 2) | "Holder changed, or whereabouts unknown", part 1, TravelMudra office, place "SYN shelf W12-[stamp]". Read OP-09, OP-07 and the incident page. | Receipt; Current: part 1 "Held by TravelMudra office, SYN shelf W12-[stamp]"; no part unknown; the statement is not current (A04). The custody incident stays open and listed with its link: recording the part as found closes no incident (its resolution is WP-14). OP-07: `originals` "Not met" with `original_held` only. SA-01 Monitors: parts with unknown whereabouts back to the baseline; custody incidents still + 1. | L | UX §2.2; `originals.ts:225`; Q-11 |
| WP12-A18 | Operator (OP1, OP2, `operator-3`); SuperAdmin (SA2); harness; test | Movement action | (1) Harness, after V18-R9: "Parts moved", part 1 (returned). (2) Test: "Parts moved" on an expected part. (3) Harness: part 3 (raw). (4) Harness, in §3 V18-R4 before part 2 is received: "Parts received" of part 2 with "Whereabouts unknown", a statement and the attestation (raw). (5) OP2 (before V18-R10), `operator-3` and SA2 post a movement on R's original. (6) Test: an original whose linked applications have different operators (A35). | (1) `part_returned`: "Part 1 was returned to the travel agent. A returned part does not move." (2) `part_not_received`: "Part [n] is expected and not received. Record it received first." (3) `not_a_part`. (4) `holder_not_in_custody`. (5) The uniform not-found answer; no fact of the original shows. (6) Refused as not found for each operator. Nothing is recorded in each case (part states unchanged; incident count delta 0). | L ((1), (3) to (5)) + T | `originals.ts:197-226` (a missing statement is refused before the part checks; a receipt of a part that is not expected is refused `part_not_expected` before the holder check); `policy.ts:524-534` |
| WP12-A19 | Operator (OP1), two tabs; harness | OP-09m of R's original (§3 V18-R7) | Tab 1: open OP-09m. Tab 2: record part 1 found (A17). Tab 1: choose "Parts moved", part 2, Courier; send. Harness: send tab 1's envelope again (raw). | Tab 1: C5 (CMP-14): the current part states beside the unsent choice, which stays chosen; "The original changed since you opened the page. Check the parts and send again."; `stale_revision`; nothing recorded. The raw resend carries the old revision and is refused `stale_revision` again (H-07 (5a)). A send from a freshly loaded tab 1 would be a new request with the current revision. | L | UX §3.3; BS B35; CMP-14; `originals.ts:205`; WP-10 H-07 |
| WP12-A20 | Operator (OP1); harness | Movement, the Nth time | Replay terms 1 to 5 on A14 (2). Term 2 changes the place. Term 3: Back after the receipt; harness: a new-key "Parts received" of part 2 from the reloaded page. Term 4: A14 (1), then A14 (2). | (1) The original receipt; one movement fact. (2) Refused as a used form; nothing recorded. (3) Back reloads OP-09m with current part states; the new-key "Parts received" of part 2 is refused `part_not_expected`; a new-key "Parts moved" would record a second movement (Core has no duplicate guard for movements; the page claims none and lists the current states before the form). (4) Recorded once. (5) C4; no new movement is offered there. | L+T | PL §7 K-STD; BS B35; WP-09 G-03 |

### 2.4 Record a return to the owner (`ops.record_original_return`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP12-A21 | Operator (OP1) | OP-09t of R's original after the withdrawal (§3 V18-R9) | Open "Record a return" from the item. Read. Select "Cancel". | `h1` "Record a return to the travel agent: [item]". Scope "A record that parts of this original went back to the travel agent who owns the application. Your name, the evidence and the time are kept." Evidence: the parts table of A02. Fields: "Which parts" (checkboxes, none preselected) offering only parts held, received or in transit; expected, unknown and returned parts listed with their state and no checkbox; the recipient as a fact, not a field: "The travel agent who owns this application ([travel agent name])"; evidence rows 1 to 5 (at least one) with "TravelMudra checks that the evidence is of a kind this service accepts for a return." (no list of kinds: no read returns them); "When it happened" (optional); hidden `_rev.original`. Effect (visible): "Returned parts are no longer held. Parts not returned keep the application open: a partial return stays partial. A part is returned once." No "Delivered", no "Sent", no claim that a courier receipt or a scan proves the return. Buttons "Record the return" and "Cancel" (→ OP-09; nothing recorded). | L | UX §2.2, §3.2 ("actual owner receipt"); BS B24, B30; PL §7 Record owner receipt; `originals.ts:258-305`; WP-01 Q-13 |
| WP12-A22 | Operator (OP1); harness; test | OP-09t of R's original (§3 V18-R9) | (1) Send with no part and no evidence. (2) Part 1 with one evidence row, External reference `SYN-W12-[stamp]-R-2`. (3) Harness, each send changing one value of an otherwise valid form: six evidence rows; a note that holds a link; an event time of tomorrow; a document reference that is not a current version of the group. (4) BFF test: the same values through the handler. | (1) C1: "Which parts", evidence. (2) Refused `control_blocked` / `custody_evidence_missing`: "This evidence does not show the return in a way this service accepts. Add other evidence of the hand-over."; the choice and the row stay; nothing recorded (B30: a courier receipt alone does not prove a return). (3) Each refused at its field with every row kept (`validation_failed`; `url_like`; `instant_in_future`; `evidence_version_not_usable`). (4) Every indexed evidence row and every chosen part reach Core; nothing is cut or dropped (LD-17). Nothing is recorded in each case (return count delta 0). | L ((1) to (3)) + T | BS B30; LD-17; `originals.ts:279-281`; `evidence.ts:53-77` |
| WP12-A23 | Operator (OP1); TA (Y) | OP-09t, OP-09, OP-07, OP-02 and OP-01 of R; TA-07 of R (§3 V18-R9) | Return part 1 with the evidence Attestation "WP12 [stamp] handed to the travel agent's representative". Read the pages. | C3 "Return recorded" (A47); Recorded "Returned: part 1. The original is now Partly returned." (summary `state` `partly_returned`); Current: part 1 "Returned to the travel agent", part 2 "Held by TravelMudra office"; "1 part not returned". OP-07: `originals` "Not met" with `original_held` in words; every other requirement as Core reports it. OP-02: Core's next action stays "Return the originals" with owner you (A42). OP-01: R's row as WP-07 maps it (delta). TA-07: the completion row "TravelMudra still holds an original document of this application" (WP-08 TA words); no custody detail. No text calls the original returned or the application completed. | L | UX §12 V18 (clause 1), §2.2 ("partial return stays partial"); BS B24; `derived.ts:199-200, 413-416`; `test/operations/originals.test.ts` "T-CO61, T-CO62: under a synthetic return policy a partial return keeps the hold and the full return clears it; …" |
| WP12-A24 | Operator (OP1, OP2, `operator-3`); SuperAdmin (SA2); harness; test | Return action | (1) Harness, after A23: a new-key return of part 1 from a freshly loaded OP-09t. (2) Test: a return of an expected part; of an unknown part. (3) OP2 (before V18-R10), `operator-3` and SA2 post a return on R's original. (4) B (A06) and the shared original (A31). (5) Test: a raw envelope with an older original revision. | (1) `part_not_held` at "Which parts": "Part 1 is not held by TravelMudra now. Its state: Returned to the travel agent."; nothing recorded. (2) `part_not_held` with the part's state in words. (3) The uniform not-found answer. (4) `unavailable_parked` / `parked_custody_route_policy` with the boundary. (5) C5 with the current part states. Nothing is recorded in each case (return count delta 0). | L ((1), (3), (4)) + T | `originals.ts:270-289`; `policy.ts:222` |
| WP12-A25 | Operator (OP2); TA (Y); SuperAdmin (SA1) | OP-09t, OP-09, OP-07, OP-02, OP-01 of R after the reassignment; TA-07 of R; SA case page of R (§3 V18-R11) | Return part 2 with an attestation. Read the pages. | C3 "Return recorded" with Recorded "The original is now Returned to the travel agent." (summary `state` `returned`); Current: both parts "Returned to the travel agent"; "0 parts not returned". OP-07: `originals` "Met"; the other requirements as Core reports them; the Request completion boundary of LD-04; the application stays open (lifecycle unchanged); no "Completed" on any page; Core's next action as Core reports it, with no invented step. TA-07: the completion row "No original document is held". The SA case page shows the same custody facts. | L+T | UX §3.1 step 9, §12 V17, V18; BS B24; LD-04; `test/core/completion-group-end.test.ts` "has no product route, task kind or Core command that checks completion, sends a document email or assigns by itself" |
| WP12-A26 | Operator (OP1); harness | Return, the Nth time | Replay terms 1 to 5 on A23. Term 2 changes the attestation text. Term 3: Back after the receipt; harness: a new-key return of part 1 from the reloaded page. Term 4: A22 (2), then A23. | (1) The original receipt; one return fact. (2) Refused as a used form; nothing recorded. (3) Back reloads OP-09t with part 1 listed as returned and not choosable; the new-key send is refused `part_not_held`. (4) Recorded once. (5) C4; no new return is offered there. | L+T | PL §7 K-STD; BS B35 |
| WP12-A27 | Test | The OP-09 and OP-09t return offer (renderer and command) | Fixtures: one original under a supported policy; one under a parked policy; two originals on one application where one is shared under a single-application policy and one is not; `returnAvailable` true and false. Render; send each rendered form (or a saved envelope where no form shows). | One original: the return form shows exactly when `returnAvailable` is true; otherwise the boundary of A06 or A31 and no form; the saved envelope is refused `parked_custody_route_policy`. Several originals: where the application flag is false and the page cannot tell which original Core refuses, the form shows on each original and Core's reason re-renders on the refused one (a listed discrepancy; no exact-parity claim, H-02). No fixture where Core accepts renders without a form. | T | `custody.ts:43-68`; `operations-work.ts:117-118`; WP-10 H-02, H-03; Q-07 |

### 2.5 Link an original to another application (`ops.link_original`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP12-A28 | Operator (OP1) | OP-09l of M1's original (§3 V18-M2) | Open "Link to another application" from the item. Read. Send with no application chosen. | `h1` "Link an original to another application: [item]". The lead names the original's own application ("Recorded on [applicant]'s application [reference]."). Scope "The original then counts for both applications. Each stays open until the original is returned. A link cannot be removed." Evidence: the applications already linked. "Application" (radios, none preselected) listing only the reader's own assigned applications of this group that are not linked yet, each "[applicant] ([service]) · Application [reference]"; no application of another operator is listed; when none is eligible: "No other application of yours in this group can be linked." and no form. Effect (visible): "The return of an original linked to several applications is available only where each application's service allows it. TravelMudra checks it at the return." Hidden `_rev.original`. Buttons "Link the original" and "Cancel". The empty send gives C1 at "Application"; nothing recorded. | L | UX §3.2; BS B30; CC §3 (`ops.link_original`); `originals.ts:156-185`; Q-05, Q-14 |
| WP12-A29 | Operator (OP1) | OP-09l, OP-09 of M1 and M2, OP-07 of M2 (§3 V18-M2) | Choose M2. Link. Read the pages. | C3 "Original linked" (named: original resource with the summary `applicationId`, no `movementId`); Recorded: "Linked to [MIRA] ([SYN Business visa (paper)]) · Application [reference]" from the reader's read of M2; Current: "Also linked to 1 other application of this group". OP-09 of M2 shows the same original with the same parts and "Also linked to 1 other application of this group" with a link to M1 (the reader can open it). OP-07 of M2: `originals` "Not met" (`original_held`). | L | BS B30; `originals.ts:179-184`; `custody.ts:54-68` |
| WP12-A30 | Operator (OP1, OP2, `operator-3`); SuperAdmin (SA2); harness; test | Link action | (1) Harness, after A29: a second link M1 → M2 with a new key. (2) OP2, harness (§3 V18-B2): link R's original to B from B's freshly loaded OP-09. (3) Harness: link M1's original to E. (4) Harness: link to an application of another group; an unknown original id. (5) Harness: a raw envelope with M1's original revision from before A29. (6) Test: a preparation-only target. (7) `operator-3` and SA2 post a link. | (1) `conflict_duplicate` / `duplicate_operation`: "This original is already linked to that application. Nothing more was recorded." (2) `unavailable_parked` / `parked_custody_route_policy`: CMP-10 on B's page "Linking an original to an application of another operator is unavailable until the product owner decides shared-item custody across operators. Owner: product owner."; the page shows no fact of R's original (no item, part, holder, place or applicant). (3) `custody_path_not_declared` at "Application". (4) The uniform not-found answer. (5) C5 with the current links. (6) `preparation_only_holds_no_originals`. (7) Refused as not found. Nothing is recorded in each case (link count delta 0). | L ((1) to (5), (7)) + T | `originals.ts:162-178`; BS B30 ("same-group item linkage grants no other operator's application view"); PL B-05 |
| WP12-A31 | Operator (OP1); harness | OP-09 and OP-09t of M1 and M2 after the link (§3 V18-M3) | Read the return action on both pages. Harness: a return of part 1 of the shared original. | On both pages the return action is CMP-10 "Returning an original linked to several applications is unavailable until the product owner decides shared-item return. Owner: product owner." with the `unavailableButton` (`aria-disabled="true"`); the custody change and link actions stay. The post is refused `unavailable_parked` / `parked_custody_route_policy` and re-rendered with the boundary; nothing recorded. The run record reads "Unmet: parked shared-item return policy (BS B30; PL B-05), owner product owner". | L | UX §3.2 ("shared-item policy gaps block affected steps"); BS B30; `custody.ts:43-52` |
| WP12-A32 | Operator (OP1); harness | Link, the Nth time | Replay terms 1 to 5 on A29. Term 3: Back after the receipt; harness: a new-key link to M2 from the reloaded page. Term 4: A28's empty send, then A29. | (1) The original receipt; one link. (2) Refused as a used form; nothing recorded. (3) Back reloads OP-09l without M2 among the choices (already linked); the new-key link is refused `duplicate_operation`. (4) Recorded once. (5) C4. A raw stale envelope → C5 (A30 (5)). | L+T | PL §7 K-STD; BS B35 |

### 2.6 SA-03c: custody detail of the reassignment preview (`core.reassign` is WP-06's)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP12-A33 | SuperAdmin (SA1) | SA-03c of R (assigned to OP1; part 1 returned, part 2 held; an open custody incident owned by OP1) (§3 V18-R10) | Read "What moves and what stays" (WP06-A52). | Under "Stays as it is", "Originals", labelled "Current": per original the item, its state words and each part's state, holder and place as A02; the uncertainty statement only where a part is unknown; the lead "Originals do not move. Custody stays with the holder recorded for each part. When an item changes hands, the operator records a custody change." Under "Moves to the new operator": the open custody incident among the incidents the current operator owns (WP06-A60 class; from `ops.case_work.incidents`), labelled current and possibly incomplete (D-04). No text names the new operator as a holder or says that custody moves; the review line keeps "originals … do not change". A failed `ops.case_work` read shows "Originals: Unavailable", never "No original is recorded for this application". A list that returns its limit (50) says so. Until P-10 d is served the custody detail comes from `ops.case_work`; when it is served, the page adopts it (S-08). | L | UX §6.3 ("Reassignment preview names old/new operator and retained custody holder"); BS B19; PL SA-03; `WP-06.md` D-04, Q-W06-01; WP-06 design §2.5; P-10 d |
| WP12-A34 | SuperAdmin (SA1); operators (OP1, OP2) | SA-03c receipt; OP-09 of R; the custody incident page (§3 V18-R10) | Setup: reassign R to OP2 with a reason (WP-06 command). Read the receipt. OP2 opens OP-09 of R. OP1 opens OP-09 of R and OP-09t of R's original. Open the custody incident. | The receipt (WP06-A53) shows Current "Originals: unchanged" from a read after the command: every part has the same state, holder and place as in the preview (delta 0); no "transferred" or "moved" custody word. OP2: OP-09 of R with the same facts and the return form for part 2. OP1: SH-02 on OP-09 of R and on its task pages; no custody fact of R shows. The custody incident's owner is OP2 (incident page, observe; WP-14). The SA case page shows the same custody facts. | L | UX §5.4 ("custody remains at its evidenced holder"), §12 V18 (clause 2); BS B19; `assignment.ts:6-11, 248`; `test/core/assignment-holds.test.ts` "reassigns: duties move, the previous operator is denied, readiness becomes the previous operator’s, acts and custody stay" |
| WP12-A35 | SuperAdmin (SA1); operators (OP1, OP2); harness | SA-03c of M2; OP-09 of M1 (OP1) and M2 (OP2) after the reassignment (§3 V18-M4) | Read the preview of M2. Setup: reassign M2 to OP2. Read OP-09 of M1 as OP1 and of M2 as OP2. Harness: a custody change of the shared original by OP1 and by OP2. OP2 opens OP-09 of M1. | Preview: the shared original with "Also linked to application [M1 reference] ([MIRA], [SYN Paper visa with original return]); operator now: [OP1]" (SuperAdmin scope; a link to its SA case page) and the boundary "After this reassignment the original is linked to applications of different operators. Recording its custody is then unavailable until the product owner decides shared-item custody across operators, or until both applications have one operator. Owner: product owner." (Q-02; the design sets the words). After: on OP-09 of M1 (OP1) and of M2 (OP2) the custody facts stay and the custody change, return and link actions give way to CMP-10 "Recording custody of this original is unavailable: it is also linked to an application that is not assigned to you. Owner: product owner." (derived from the reader's assigned work, `core.ops_work`; when that read is unavailable the forms show and Core decides). Both harness posts are refused as not found; nothing recorded. OP2: SH-02 on M1; M2's page names no applicant, reference or link of M1 for OP2 ("Also linked to 1 other application of this group, not assigned to you"). Custody facts unchanged (delta 0). The run record reads "Unmet: parked shared-item policy, owner product owner". | L | UX §12 V18 (clause 3), §5.2 ("No cross-operator shared-item visibility by inference"); BS B19, B30; `policy.ts:524-534`; Q-02 |
| WP12-A36 | Test | The SA-03c custody block renderer | Fixtures: no original; held; an expected part; in transit; unknown with a statement; a statement with no unknown part; partly returned; returned; shared with an application of the same operator and with one of another; 50 originals; `ops.case_work` unavailable; an access refusal between the case read and the custody read. | The words of A33 and A35 for each state; "Unavailable" for the outage; the access page (SH-02 or sign-in) for the refusal, without the facts read before (LD-14); no fixture shows "No original is recorded for this application" when the read failed; the 50-row fixture says that the list stops at its limit. | T | LD-14; WP-06 D-04; `contracts/operations-work.ts:190-195` |
| WP12-A37 | Operator (OP1); harness; test | Reassignment race (§3 V18-R10) | Before the reassignment of R, OP1 opens OP-09t of R's original in a tab. SA1 reassigns R to OP2. OP1 sends the open form. Test: the same for a receipt, a custody change and a link. | OP1's send is answered SH-02 (or the uniform not-found page); nothing recorded (part states unchanged). OP1's next read of OP-09 gives SH-02; no custody fact or form from the earlier read shows. | L+T | WP-09 G-09; BS B19 ("revokes old action authority"); `common.ts:46-49`; `test/operations/access.test.ts` "after a reassignment the previous operator is refused and the new operator holds the incident duties; a suspended operator is refused" |

### 2.7 Visibility, the travel agent and the SuperAdmin

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP12-A38 | Operator (OP2); harness | OP-09 of B; OP-01 of OP2; OP-09 of R (§3 V18-B2, before V18-R10) | Read OP-09 of B and OP-01. Open R's OP-09 address. Harness: a custody change and a return on R's original id; the link of A30 (2). | B's page lists only B's original. OP-01 lists no R row. R's OP-09: SH-02, the same as for an unknown address; no applicant name. The custody change and the return are answered with the uniform not-found page; the link gives the boundary of A30 (2). No response shows a fact of R's original (item, description, part, holder, place, statement, incident). Nothing is recorded. | L | UX §12 V18 (clause 3), §5.2; BS B10, B30; `policy.ts:524-534`; `originals.ts:174-178` |
| WP12-A39 | TA (Y); `syn-ta-2`; test | TA-07 of R, B, M1, M2 and E at each Part of §3; TA-07x; TA-10 | Read the section "Original documents", the completion rows and the history. `syn-ta-2` opens TA-07 of R. Run the system test. | R, B, M1, M2: the section with "Originals this service uses: Passport" and the CMP-10 boundary "Custody details of originals are not shown to travel agents in this release. Owner: product owner." (BS B30 parked cross-party visibility); E: no section. At no step does a TA page show an original id, a description, a part label, a holder, a place, an uncertainty statement, a custody incident or a movement. The completion rows show only Core's flags in WP-08's TA words (A23, A25). TA-07x has no custody line; TA-10 delta 0 for every custody step. `syn-ta-2`: the uniform not-found page. The test passes on the rebuilt section. | L+T | UX §2.3; BS B30; `contracts/core.ts:274-279`; `src/apps/shared/core/originals.ts`; `test/system/ta-documents-originals.test.ts` "shows the originals a service holds and the parked custody state, never a custody detail; a service without originals has no section" |
| WP12-A40 | SuperAdmin (SA2); test | SA case pages of R, B, M1 and M2; a fixture whose operator is suspended after the outcome | Read. Test: render the case of an application with held originals and no active operator. | SA pages show the custody facts in the words of A02 and no custody control. With no operator assigned, Core's pending owner is "SuperAdmin" with the next action "Return the originals"; the page offers the route "Assign an operator" (SA-03a or SA-03c) and no custody form (UX §2.3: an absent operator is resolved through permitted assignment; Q-12). | L+T | UX §2.3, §6.1 ("transfer duties without moving originals"); BS B24; `derived.ts:413-416`; `policy.ts:222` |

### 2.8 OP-02, OP-07 and OP-01 (pages of WP-07 and WP-08)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP12-A41 | Operator (OP1, OP2); test | OP-02 of R, B, M1, M2 and E at each Part of §3 | Read the status facts and the "Delivery & originals" tab. | Status fact "Originals" only when the application has originals or custody counts above zero: "[n] parts not returned; [m] with whereabouts unknown" (this amends WP-07 design §2.3 item 5 "[n] parts held": Core's count includes expected parts). The tab: the custody summary (items with their state words) and the link "Open the originals" → OP-09; no custody form on OP-02 (A58). E: "This service holds no physical originals." Test: the status fact for counts (0, 0), (2, 0) with one part expected, (1, 1). | L+T | UX §2.2; PL CMP-03; `WP-07-design.md` §2.3 item 5, §2.5.3; `custody.ts:54-68` |
| WP12-A42 | Operator (OP1); test | OP-02 action panel of R after the withdrawal (§3 V18-R8) and after the reassignment (OP2); fixture with `parked_custody_route_policy` | Read the action panel and "Also needed". | Core's pending answer `return_original` with `original_held`: owner "You", step "Return the originals to the travel agent", action "Open the originals" → OP-09. With `parked_custody_route_policy` (test): the CMP-10 boundary of A06 and no action. With no operator: "Waiting on SuperAdmin: assign an operator". "Also needed" lists the open custody incidents the reader owns with links (after the reassignment: OP2). The panel states no permission and predicts no completion. | L+T | UX §5.4, §7.4; PL CMP-01; `derived.ts:413-416`; `WP-07-design.md` §2.4.5 (row 10, "Also needed"); `case.ts:72` |
| WP12-A43 | Operator (OP1, OP2); test | OP-07 of R at §3 V18-R3, R6, R7, R9, R11; OP-07 of M2 after A29; fixtures | Read the `originals` row. | The row shows Core's state and codes in words: `original_held` in words that do not claim that TravelMudra holds a part that was only expected (for example "An original, or a part of it, is not returned yet."); `custody_evidence_missing` "The whereabouts of an original are uncertain."; owner from Core's pending answer when it names one (else the WP-08 owner table, qualified); "Where" → OP-09. Never "Not applicable yet" while Core reports a blocker (E-05). "Met" only when Core reports it. Test: a fixture with one expected part only, and one with an unknown part only. | L+T | UX §3.1 step 9; BS B24; `WP-08.md` E-05, E-06; `WP-08-design.md` OP-07 owner table; `derived.ts:199-200` |
| WP12-A44 | Operator (OP1, OP2); test | OP-01 of OP1 and OP2 at each Part of §3; fixture with `return_original` and `parked_custody_route_policy` | Read R's, B's, M1's and M2's rows and the view counts (deltas from P-0). | Rows follow WP-07's view mapping with Core's owner and words: an open custody incident the reader acts on, or a return the reader owns, is in "Action now"; after the reassignment the rows move from OP1 to OP2. A row whose only remaining step is a return under a parked policy is placed as the architect decides on Q-06 (the test asserts the decided view and that the page and the navigation count agree). Lag freshness. Never "Ready". | L+T | UX §5.2, §5.4; `WP-07-design.md` §2.1 (view mapping); `WP-07.md` F-07, F-16; Q-06 |
| WP12-A45 | Operator (OP1); TA (Y); test | OP-02, OP-09, OP-07 of R and TA-07 of R after the withdrawal (§3 V18-R8) | Setup: OP1 records the applicant's withdrawal of R (carried WP-17 form). Read the pages. Run the tests. | Outcome "Withdrawn". The originals, their part states and the return duty stay (OP-09 unchanged; OP-07 `originals` "Not met"; Core's next action "Return the originals"). TA-07: outcome Withdrawn and the completion row of A23. Test: another application's withdrawal leaves an original's custody (T-CO62); group end never ends an application with held or unknown originals. | L+T | UX §3.2 ("Return duties can outlive withdrawal"); BS B24, B25; `withdrawal.ts:8-9`; `derived.ts:257-259`; `test/operations/originals.test.ts` T-CO61, T-CO62; `test/core/completion-group-end.test.ts` |

### 2.9 Command results, access and shell on WP-12 pages

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP12-A46 | Operator; SuperAdmin; TA | OP-09, OP-09m, OP-09t, OP-09l; SA-03c; TA-07 | Read the shell. | Environment label; "[TEST]" title prefix; rail current item "My work" (or "Applications" with `from=applications`); breadcrumb "… › [applicant] › Originals" and "… › Originals › Record a custody change", "› Record a return", "› Link to another application"; the OP-02 frame items without tabs on the three task pages; one `h1`; a freshness line "Read at [time] IST". The rail item "Originals" follows the architect's decision on Q-04. | L | PL §2.1, §2.2; WP01-A07; `WP-07-design.md` §1.3 |
| WP12-A47 | Operator; harness | Every accepted WP-12 command; edited receipt addresses | Read each receipt. Open edited addresses: a `returned` done code with a movement key; a `linked` done code with a receipt key; a receipt done code with another application's key. | Naming rules: receipt (application resource; summary `originalId`) → "Original recorded"; link (original resource; summary `applicationId`, no `movementId`) → "Original linked"; movement (original resource; `movementId`, no `state`) → "Custody change recorded", with "A custody incident is open: [reference]" when the summary has `incidentId`; return (original resource; `movementId` and `state`) → "Return recorded". Receipt facts never come from the `done` code or the form alone: the kind of a movement is not on the summary, so the receipt shows the current part states, labelled "Current", not the chosen kind as a fact. An edited address never shows another command's title; another application's key: "Request reference [key]. The receipt cannot be checked now." No accepted time (P-02). | L+T | WP-06 D-01, D-02; WP-01 A-04; WP-09 G-01; `originals.ts:47-49, 151, 184, 253, 304` |
| WP12-A48 | Operator (OP1, OP2); test | Receipt addresses of §3 V18-R3, R6, R9 and M2, opened again after V18-R7, R10 and R11 | Open each address again. Test: after a reassignment. | Each receipt keeps what was recorded then and shows the facts that are current now, labelled "Current". The R6 receipt, opened after R7, shows Current part 1 "Held by TravelMudra office" and no "trace the original" instruction. The R9 receipt, opened by OP2 after R10, shows the current states and no "return part 2" instruction; opened by OP1 after R10 it gives SH-02. No receipt or status read tells anyone to act from an older state. | L+T | `WP-07.md` F-01 (class fix); WP-09 G-10 |
| WP12-A49 | Operator | Each command of §1.2 with a lost acknowledgement (fixture); a refused send | Inject the fault. Open the operation status page. Select "Check status" after the original resolves. Open the status page of a refused send's key. | C4 (CMP-13) "Checking the original result" and "Check status"; no new send of the same intent is offered there. "Check status" reads the same operation and shows its accepted result. A refused send leaves no operation record: "Nothing is recorded for request [reference] so far". A refusal, and any stale comparison, shows only on the re-rendered form. | T | PL §1.1 UNR; BS B35; WP-01 A-08; WP06-A104 |
| WP12-A50 | Harness | Each command of §1.2 | (1) Identical replay after acceptance. (2) Same key, changed content. (3) Business duplicate: a new key with the current page's facts. (4) Raw stale envelope: a new key with an older page's original revision. (5a) Raw resend of a refused envelope after the facts changed. (5b) Corrected submission from a freshly loaded page after the facts changed. | (1) The original result; no second original, movement, return, link or incident. (2) Refused as a conflict; nothing recorded. (3) Receipt `original_already_recorded`; link `duplicate_operation`; return `part_not_held`; a movement of kind `receipt` `part_not_expected`; a movement of another kind: a second record (no guard; claimed by no page). (4) Movement, return and link: `stale_revision`, CMP-14 with the current facts; the receipt carries no revision, so its stale case is the business check. (5a) The refused key has no record, so Core evaluates the envelope again against its own revision: where the original's revision moved (a custody change refused for a missing statement, then another change recorded), it is refused `stale_revision`; where it carries no revision (a receipt refused for a missing attestation), the business check decides it. (5b) The form of a freshly loaded page carries the current revision and is decided on the current facts (H-07). A duplicate test uses (3), never (4) or (5a). Browser Back is not a replay. | T | WP-06 D-12; PL §7 K-STD; BS B35; `WP-10.md` H-07 |
| WP12-A51 | Operator; SuperAdmin | Every refusal reachable on `lane-ui` in §2.1 to §2.8 | Read each message. | CMP-07 with the reason in words and the owner or route where one exists. Never a code alone, except the UAT-13 fallback. No "Something went wrong", "Invalid data" or "A requirement of this item is not met." | L | PL §1.1 REJ, §11.1; CR-01 |
| WP12-A52 | — | Text map of every reason code that the WP-12 pages can show | Check the map against Core's vocabulary (unit test). | Each code has text in the operator's words: `original_already_recorded`, `custody_path_not_declared`, `preparation_only_holds_no_originals`, `application_not_open`, `custody_evidence_missing`, `parked_custody_route_policy`, `original_held`, `duplicate_operation`, `stale_revision`, `conflict_operation_key`; the field codes `item_type_undeclared`, `holder_not_in_custody`, `not_a_part`, `part_not_expected`, `part_not_received`, `part_returned`, `part_not_held`, `use_return`, `required` (statement, label), `evidence_kind_unknown`, `evidence_version_not_usable`, `invalid_id`, `email_like`, `url_like`, `instant_invalid`, `instant_in_future`; the next action `return_original` with the reasons `original_held` and `parked_custody_route_policy` (per reason and next action, WP-07 F-13 class). `access_denied` renders SH-02 or the uniform not-found page, never a text. | T | CR-01; UAT-13; `src/apps/shared/core/shared.ts` |
| WP12-A53 | Operator | OP-09, OP-09m, OP-09t, OP-09l, SA-03c (HTTP tests) | (1) Let `ops.case_work` fail for availability on OP-09 and each task page. (2) Let `core.ops_work` fail on OP-09 and OP-09l. (3) Separately: revoke access, end the session, close the installation or start a support view between the page's first read and a later read; reassign between two reads of OP-09. | (1) The frame stays; the custody block reads "Unavailable"; no custody form, because a custody record needs the current parts and revision; CMP-10 "The originals cannot be read now. Try again later. Owner: TravelMudra." (F-04, H-05 class). (2) The forms that need only `ops.case_work` show and Core decides; OP-09l without its candidate list shows "The applications you can link cannot be read now." and no form. (3) The page renders the access page (SH-02, sign-in or maintenance), never the facts read earlier; after a reassignment the previous operator's next read or command gives SH-02. No page code catches every error around a read. | T | LD-14; `WP-07.md` F-04; `WP-10.md` H-05; `test/unit/bff-access-change.test.ts` (pattern) |
| WP12-A54 | TA; operator; SuperAdmin | Every WP-12 page and the SuperAdmin case pages of R, B, M1, M2 | Look for controls of the other roles. | TA pages: no custody control. SuperAdmin pages (SA-03c included): no receipt, custody change, return or link control; facts only. Operator pages: custody controls only on the reader's own assigned applications, and none on a split shared original (A35). | L | BS B18; UX §2.3; PL §11.1; `policy.ts:222` |
| WP12-A55 | TA; operator; SuperAdmin | Every WP-12 page | Read all visible text. | The custody words of §0.2; no forbidden label of PL §11.1 ("Override", "Admin override", "Approved" or "Done" as an overall status, "Ready" as a universal state, "Force complete"); no "Lost", "Damaged", "Missing" or "Destroyed"; no "Delivered" or "Sent" for a return; no claim that an assignment, a reassignment, a scan, a parcel label or a courier receipt moves, possesses or returns an original; "held" never for an expected part; no list of accepted return evidence kinds, no part or evidence limit and no other configuration value that the page does not read. Times carry IST; counts name their unit; synthetic data carries the synthetic label. | L | PL §11.1, §11.2; BS B30; CR-03, CR-06, CR-07, CR-08; WP-01 Q-13; WP-08 E-12 |
| WP12-A56 | Operator (`operator-3`); SuperAdmin in a support view of OP1 (test) | Posts as `operator-3` (§3 V18-X1); the `/ops` pages in a support view | Harness: post a receipt on R, a custody change, a return and a link on R's original as `operator-3`. Test: start a support view of OP1; open OP-09 and the task pages; post each command. | Each `operator-3` post is refused as not found; nothing recorded; the read-only page of A07 stays. Support view: the `/ops` pages answer 409 (`support_view_active`); each post is refused with the support-view refusal; nothing recorded. | L (grant) + T (support view) | UX §2.3; BS B10; PL SH-R09, SH-R10 |
| WP12-A57 | Operator | OP-09, OP-09m, OP-09t, OP-09l | Inspect `localStorage`, `sessionStorage` and IndexedDB after use. Read the response headers. | No description, part label, place, statement, evidence reference or chosen application is kept in browser storage. Signed-in pages send `no-store`. | L+T | PL §2.3 SH-R12 |
| WP12-A58 | — | The WP-12 host pages and the former hosts | Run the host-page test (named by the design). On `lane-ui` open OP-02 (every tab) of R, the old operator case page and the case-work section. Run the route test. | The actions `/ops/applications/:applicationId/originals` (POST), `/ops/originals/:originalId/movements`, `/ops/originals/:originalId/return` and `/ops/originals/:originalId/link` each appear as a form action on exactly one renderer, as the design assigns them (Q-14). OP-02, the old operator case page and the case-work section hold none of them and show links instead. Every other carried form (WP-08, WP-14, WP-17) keeps its markup, fields, action and success redirect. The carried-form test entries of earlier packages for the custody forms are removed. The new GET routes are in the inventory; every rendered form action is a registered route. The task pages carry the application context themselves (no redirect to `/ops/work` after a custody record). | L+T | LD-02, LD-03, LD-07; CC §6 CC-12 to CC-14; `case-work.ts:322-366, 566-584`; WP06-A110 |
| WP12-A59 | `syn-ta-2`; operator (OP2 before V18-R10); SuperAdmin | TA-07 of R; OP-09 and the task pages of R's original; ids of another group in the original and application paths | Open each. | `syn-ta-2`: the uniform not-found page. OP2 (not assigned to R): SH-02 on OP-09 of R and on its task pages. An original id of another group, or an unknown one: the uniform not-found page. No fact of R, B, M1, M2 or E shows to anyone outside its scope. | L | BS B10; UX §2.3 |
| WP12-A60 | Test | The four custody handlers (BFF tests) | Send forms with: 50 and 51 part rows; a 120- and a 121-character part label; descriptions, places and statements at and over Core's limits; six evidence rows; evidence rows 0, 2 and 4 filled; part choices 1, 9, 10 and 50; a part choice that is not a number. | Every field is read whole; every indexed evidence row and every chosen part reaches Core in order; nothing is sliced, truncated or dropped; input over a limit is refused at its field with the values kept; a choice that is not a part is refused at "Which parts", not dropped. The movement, return and link handlers re-render their task page with the values kept after a refusal (today they answer the error page). | T | LD-17; `WP-10.md` H-04; `case-work.ts:446-456, 566-584` |

### 2.10 Accessibility (AC-01 to AC-28 that apply)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP12-A61 | Keyboard-only operator and SuperAdmin | §3 steps V18-R3, R4, R6, R9, M2 and R10 at 1440 px; V18-R3 and R9 at 390 px | Use the keyboard only. | Every step works with Tab, Shift+Tab, Enter, Space and Escape: the receipt (part rows, checkboxes, holder radios, attestation), the custody change (kind and holder radios, part checkboxes, statement), the return (part checkboxes, evidence rows), the link (application radios), the SA-03c preview. No action needs a mouse, hover or drag-and-drop. | L | AC-01, AC-12 |
| WP12-A62 | Keyboard-only user | Every WP-12 page at 1440 and 390 px and at 400% zoom | Tab through the page. | Focus is visible (at least 3:1) and never hidden by the top bar, the rail or a bottom action area. | L | AC-02 |
| WP12-A63 | Phone user | OP-09, OP-09m, OP-09t, OP-09l, SA-03c custody block | View at 320 px, and at 1280 px with 400% zoom. | No two-dimensional page scrolling. The parts table scrolls only inside a labelled region, or becomes cards. Identity, state, holder and next action come before secondary data. On the task pages scope and effect come before the fields; the primary action is at the end of the form, never in a fixed bar. | L | AC-04, AC-21; UX §7.3 |
| WP12-A64 | Any | Every WP-12 form | Inspect each input. | Each input has a visible label; the groups "Held by", "What happened", "Now held by", "Which parts", "Received now" and "Application" sit in fieldsets with legends, and none is preselected; each part checkbox names the part number and label; the evidence row labels its kind and its reference; required fields say that they are required; optional fields say "optional". | L | AC-05, AC-15 |
| WP12-A65 | Any | Part and item states, boundaries | View in greyscale. | Each state has text. No state is shown by colour alone; an unknown part is not marked by colour only. | L | AC-06 |
| WP12-A66 | Any | Every WP-12 form | Send each form with an error. | Focus moves to the error summary; each link moves focus to its field; entered values stay; chosen kinds, holders, parts and applications stay chosen; evidence rows stay filled; the attestation stays unchecked (the operator states possession again). | L | AC-08; CMP-07; WP-09 G-07 |
| WP12-A67 | Screen-reader user | Receipts (with the incident line); the parked and shared boundaries; the "not returned" counts | Read with VoiceOver or NVDA. | Receipts are announced politely without moving focus. Boundaries and blockers are read before the controls they concern. The counts are read with their unit. | L | AC-09, AC-16 |
| WP12-A68 | Screen-reader user | Each unavailable action: the return on B (A06), the return of a shared original (A31), the custody actions of a split shared original (A35), a part that cannot be chosen (A21) | Focus the control or the notice. | The reason is exposed (`aria-describedby`, or the notice in reading order); the `unavailableButton` "Record a return" has `aria-disabled="true"`. A role-forbidden action is not shown at all. | L | AC-13; CMP-10; PL §2.3 SH-R08 |
| WP12-A69 | Phone user | Every WP-12 page at 390 px | Measure each control. | Every control is at least 24 × 24 CSS px. Primary actions ("Record the original", "Record the change", "Record the return", "Link the original") are at least 44 × 44 CSS px. Checkbox and radio labels are part of their targets. | L+T | AC-10 |
| WP12-A70 | — | Every WP-12 page | Measure contrast of text, focus, state text and notices. | Normal text at least 4.5:1. Non-text indicators and focus at least 3:1. | L+T | AC-11 |
| WP12-A71 | Any | Long texts; reduced motion | Use a 60-character surname and given names, a 200-character description, part labels of 120 characters, a 200-character place and a 500-character statement. Turn on "reduce motion". | Names, labels, places and statements wrap without hiding identity; a truncated text has a full form that keyboard and touch reach. No transition plays. | L | AC-14, AC-20 |
| WP12-A72 | Operator and SuperAdmin (observation) | OP-09 of R after V18-R9; SA-03c of R before V18-R10 | Ask OP2 (after R10) "Who holds the old passport now, and was anything returned?" and SA1 (on the preview) "Does reassigning this application move the passport?". | The run record reports the answers and the sample size; confusion of an expected part with a held one, of a partial return with a full one, or of a reassignment with a custody move is a finding. No pass target (observation only). | L | AC-24, AC-26; UX §12 (usability) |

### 2.11 axe checks (WCAG 2.2 A/AA)

Rule for every row: run axe (`@axe-core/playwright` 4.13.0, tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`,
`wcag22aa`) at 1440 × 900 and at 390 × 844. Expected: no violation of impact "serious" or "critical" at either width.
Record the counts of minor and moderate violations. The harness takes no screenshot of a page that shows a real
person's data; WP-12 uses synthetic data only. The texts that WP-12 amends on OP-02, OP-07 and OP-01 are covered by
the axe rows of their own packages; the V18 run records their counts as an observation.

| ID | Persona | Page (state) | Where | Source |
|---|---|---|---|---|
| WP12-A73 | Operator | OP-09 of R: no original, the receipt form (A01, A08) | L | UX §7.5; AC-01 to AC-28 |
| WP12-A74 | Operator | OP-09 of R: the receipt form with the error summary (A09 (1)) | L | same |
| WP12-A75 | Operator | OP-09 of R: the receipt receipt and the item with one part expected (A10) | L | same |
| WP12-A76 | Operator | OP-09m of R's original: the form (A13) | L | same |
| WP12-A77 | Operator | OP-09m with the statement error (A16 (1)) | L | same |
| WP12-A78 | Operator | OP-09 of R: whereabouts unknown, the incident line (A16 (2)) | L | same |
| WP12-A79 | Operator | OP-09m after the C5 of tab 1 (A19) | L | same |
| WP12-A80 | Operator | OP-09t of R's original: the form (A21) | L | same |
| WP12-A81 | Operator | OP-09t after the `custody_evidence_missing` refusal (A22 (2)) | L | same |
| WP12-A82 | Operator | OP-09 of R: partly returned (A23) | L | same |
| WP12-A83 | Operator | OP-09 of R: returned (A25) | L | same |
| WP12-A84 | Operator | OP-09 of B: the parked return boundary (A06) | L | same |
| WP12-A85 | Operator | OP-09 of E: no custody path (A05) | L | same |
| WP12-A86 | Operator | OP-09l of M1's original: the form (A28) | L | same |
| WP12-A87 | Operator | OP-09 of M2 as OP2: the split shared-original boundary (A35) | L | same |
| WP12-A88 | Operator (`operator-3`) | OP-09 of R: read only (A07) | L | same |
| WP12-A89 | SuperAdmin | SA-03c of R: the custody detail (A33) | L | same |
| WP12-A90 | SuperAdmin | SA-03c of M2: the shared original and its boundary (A35) | L | same |
| WP12-A91 | TA | TA-07 of R: the section "Original documents" (A39) | L | same |
| WP12-A92 | Operator | Operation status page of a WP-12 command, accepted and "Nothing is recorded" (A49) | L | same |

## 3. Proof scenario V18 (to its boundary)

V18 (UX §12): "Partial original return holds applicable completion; reassignment does not move custody; undeclared
shared-item policy does not grant other operators visibility." Authority B19, B24, B30. Also UX §2.1 (Original item),
§2.2 (Custody), §3.1 step 9, §3.2 (Physical route), §5.4 and §6.3 (reassignment preview).

One ordered recipe (§0.4) serves the proof. "Setup" steps use pages of other packages; they are not the subject under
test. "Observe" steps check items that other packages own. SA1 = `superadmin-1`, SA2 = `superadmin-2`, OP1 =
`operator-1`, OP2 = `operator-2`. Every harness send uses a freshly loaded page unless the step says "raw".

| Step | Actor, page | Action | Observable result | Items | Where |
|---|---|---|---|---|---|
| P-0 | OP1, OP2: OP-01 and their incident lists; SA1: SA-01 Monitors | Before the set-up, read the counts. | The run record holds the baselines of §0.4. | — | L |
| Setup-1 | SA1 (SA-06, grant page); Y (TA-09, TA-08) | §0.4: create and activate Y; Y creates the group and the drafts R, B, M1, M2 (MIRA, one passport) and E, and submits them; SA1 grants `operator-3` read access to the group. | Y active; five submitted applications; Y's TA-10 count read (baseline). | — | L |
| Setup-2 | SA1 (SA-07a, SA-03a) | Record "Payment received" for each; assign R, M1, M2 and E to OP1 and B to OP2. | Five paid, assigned applications. No original exists (an assignment moves nothing). | — | L |
| V18-E1 | OP1: OP-02 and OP-09 of E; harness | Read. Harness: a receipt on E. | "This service holds no physical originals."; no form; the receipt refused `custody_path_not_declared`; nothing recorded. | A05, A41 | L |
| V18-R1 | OP1: OP-02 "Delivery & originals" and OP-09 of R | Read; follow the link; read the receipt form; "Cancel". | No original; the receipt form of A08; no return boundary; nothing recorded. | A01, A08 | L |
| V18-R2 | OP1: OP-09 of R; harness | Send empty. Send with the courier waybill as evidence and the attestation unchecked. Harness: the over-limit and invalid values of A09 (3). | C1; `custody_evidence_missing` at the attestation with the values kept; each harness send refused at its field; nothing recorded, nothing truncated. | A09, A11 (3), (4) | L |
| V18-R3 | OP1: OP-09, OP-02, OP-07 of R; Y: TA-07, TA-10; harness | Record the original (A10 values: part 1 received, part 2 not). Harness: replay; a new-key send from the reloaded page. | "Original recorded"; part 1 held, part 2 expected; "2 parts not returned"; OP-07 `originals` "Not met"; TA-07 without custody detail; TA-10 + 0; the replay returns the same receipt; the new key refused `original_already_recorded`. | A02, A10, A12, A39, A41, A43 | L |
| V18-R4 | OP1: OP-09m of R's original; harness | Harness first: "Parts received" of part 2 with "Whereabouts unknown", a statement and the attestation (raw). Then "Parts received", part 2, without the attestation; then with it. Harness: "Parts received" for part 1. | The raw send refused `holder_not_in_custody`; the first form send refused `custody_evidence_missing`; then "Custody change recorded", both parts held; part 1 refused `part_not_expected`; no incident. | A13, A14, A18 (4), A20 | L |
| V18-R5 | OP1: OP-09m, OP-09, OP-07 of R; harness | "Parts moved", part 1, Courier, place, evidence `SYN-W12-[stamp]-R-1`. Harness: holder "The travel agent" (raw); part 3 (raw). | Part 1 in transit with the courier; "Several holders"; OP-07 unchanged; the raw sends refused `use_return` and `not_a_part`; nothing recorded by them. | A02, A15, A18 (3) | L |
| V18-R6 | OP1: OP-09m, OP-09, OP-02, OP-07, OP-01 of R; SA1: SA-01 Monitors (Observe) | Part 1 "Whereabouts unknown" without a statement; then with the statement. | C1 at the statement and no incident; then the receipt with the incident line; item "Whereabouts uncertain"; "Also needed" lists the incident; OP-07 `custody_evidence_missing` and `original_held`; Monitors + 1 incident, + 1 part with unknown whereabouts. | A02, A04, A16, A42, A43, A44 | L |
| V18-R7 | OP1 (two tabs): OP-09m of R's original; harness | Tab 1 opens OP-09m. Tab 2 records part 1 found at TravelMudra office. Tab 1 sends "Parts moved", part 2, Courier. Harness: tab 1's envelope again (raw). Read OP-09, OP-07, the incident page; SA-01 Monitors (Observe). | Tab 2 accepted; part 1 held; the statement not current; the incident stays open; tab 1 C5 and the raw resend `stale_revision`; nothing recorded for tab 1; Monitors parts unknown back to baseline, incidents + 1. | A02, A04, A17, A19 | L |
| V18-B1 | OP2: OP-09 and OP-09t of B; harness | Record B's original (one part, TravelMudra office, attestation). Read the return action. Harness: a return of part 1 with an attestation. | "Original recorded"; the parked return boundary with the unavailable button; the return refused `parked_custody_route_policy`; nothing recorded. | A06, A10 | L |
| V18-B2 | OP2: OP-09 of B, OP-01, R's OP-09 address; harness | Read. Open R's OP-09. Harness: a receipt on R; a custody change and a return on R's original id; a link of R's original to B. | B's page lists only B's original; SH-02 on R; the receipt, the change and the return answered not found; the link refused with the cross-operator boundary; no fact of R's original in any response; nothing recorded. | A11 (5), A18 (5), A24 (3), A30 (2), A38, A59 | L |
| V18-M1 | OP1: OP-09 of M1 and M2; harness | Record MIRA's passport on M1 (one part). Read M2's OP-09. Harness: a receipt of MIRA's passport on M2. | "Original recorded" on M1; M2 shows no original; the M2 receipt refused `original_already_recorded` with the "link it from there" words; nothing recorded on M2. | A10, A11 (1) | L |
| V18-M2 | OP1: OP-09l of M1's original; OP-09 of M1 and M2; OP-07 of M2; harness | Read the link form; send with no choice; link to M2. Harness: replay; a new-key link to M2; a link to E; a raw envelope with the revision from before the link. | C1; then "Original linked"; M2 lists the original; OP-07 of M2 "Not met"; the replay returns the same receipt; `duplicate_operation`; `custody_path_not_declared`; C5; one link. | A28, A29, A30 (1), (3), (5), A32, A43 | L |
| V18-M3 | OP1: OP-09 and OP-09t of M1 and M2; harness | Read the return action. Harness: a return of the shared original. | The shared-item return boundary on both pages; the return refused `parked_custody_route_policy`; nothing recorded. | A31 | L |
| V18-M4 | SA1: SA-03c of M2; OP1: OP-09 of M1; OP2: OP-09 of M2 and M1's address; harness | Read the preview. Setup: reassign M2 to OP2 with a reason (WP-06 command). Read the OP-09 pages. Harness: a custody change of the shared original by OP1 and by OP2. | The preview names M1 and its operator and states the split boundary; after the command both OP-09 pages show the boundary and no custody form; both posts refused as not found; OP2 gets SH-02 on M1 and sees no M1 applicant or reference; custody facts unchanged. | A33, A35, A54 | L |
| V18-R8 | Setup: OP1, OP-02 of R (carried WP-17 form); Observe: OP-02, OP-09, OP-07, OP-01 of R; Y: TA-07 of R | Record the applicant's withdrawal of R (§0.3 values). Read. | Outcome "Withdrawn"; the originals and their states unchanged; OP-07 `originals` "Not met"; Core's next action "Return the originals" (owner you); OP-01 row as WP-07 maps it; TA-07 outcome and completion row. | A42, A43, A44, A45 | L |
| V18-R9 | OP1: OP-09t, OP-09, OP-07, OP-02 of R; Y: TA-07 of R; harness | Read the return form; send with no part and no evidence; part 1 with an external reference only; then part 1 with the attestation. Harness: replay; a new-key return of part 1; six evidence rows and the other values of A22 (3); a custody change "Parts moved" of part 1. | C1; `custody_evidence_missing` with the values kept; then "Return recorded" with "Partly returned"; OP-07 still "Not met" (`original_held`); next action unchanged; TA-07 "TravelMudra still holds an original document of this application"; the replay returns the same receipt; `part_not_held`; the field errors; the custody change refused `part_returned`; one return. | A18 (1), A21, A22, A23, A24 (1), A26 | L |
| V18-R10 | SA1: SA-03c of R; OP1 (a tab with OP-09t of R open); OP2: OP-09 of R; the incident page; harness | Read the preview. Setup: reassign R to OP2 with a reason (WP-06 command). OP1 sends the open return form. Read the receipt, OP-09 as OP2 and as OP1, the incident. Harness: a custody change on R's original as OP1. | The preview's custody detail (part 1 returned, part 2 held at the office; originals stay with their holder) and the incident under the duties that move; the receipt with "Originals: unchanged"; OP1's send and post answered SH-02 or not found, nothing recorded; OP2 reads the same custody facts (delta 0) and the return form for part 2; the incident's owner is OP2. | A33, A34, A37, A48 | L |
| V18-R11 | OP2: OP-09t, OP-09, OP-07, OP-02, OP-01 of R; Y: TA-07 of R; SA1: SA case page of R | Return part 2 with an attestation. Read the pages. Open the receipt addresses of V18-R3, R6 and R9 again (OP2; and R9 as OP1). | "Return recorded" with "Returned to the travel agent"; OP-07 `originals` "Met"; the Request completion boundary; the application stays open; TA-07 "No original document is held"; the old receipts show current facts and no instruction; OP1 gets SH-02 on R9's receipt. | A02, A23, A25, A43, A48 | L |
| V18-X1 | `syn-ta-2`; OP2 (on R before V18-R10, recorded in B2); `operator-3`; SA2 | Open TA-07 of R; OP-09 of R with the read grant; the SuperAdmin case pages of R, B, M1, M2; ids of another group. Harness: the `operator-3` posts of A56; SA2's receipt, custody change, return and link posts on R; a link of M1's original to an application of another group; a custody change on an unknown original id. | Not found or SH-02; read only for `operator-3`, each post refused; no SuperAdmin custody control and each SA2 post refused; the other-group link and the unknown id answered not found; nothing recorded. | A07, A11 (5), A18 (5), A24 (3), A30 (4), (7), A40, A54, A56, A59 | L |
| V18-X2 | Test | A02 (fixtures), A03, A04 (fixtures), A05 (preparation-only), A06, A09 (BFF), A11 (6), (7), A12, A18 (2), (6), A20, A22 (BFF), A24 (2), (5), A25, A26, A27, A30 (6), A32, A36, A37, A39, A40, A41, A42 (parked), A43 (fixtures), A44, A45, A47, A48, A49, A50, A52, A53, A56 (support view), A57, A58, A60, A69, A70. | As the items. | as listed | T |
| V18-X3 | axe | The WP-12 pages in the states of A73 to A92. | No serious or critical violation at 1440 px and 390 px. | A73 to A92 | L |

Proof split: V18 passes when V18-E1, V18-R1 to R11, V18-B1, B2, V18-M1 to M4, V18-X1 and V18-X3 pass on `lane-ui` at
the integrated WP-12 commit and V18-X2 passes as named tests. Clause 1 is shown by V18-R8, R9 and R11 (with the
withdrawal outcome, the partial return leaves the only unmet requirement `originals`). Clause 2 is shown by V18-R10
and V18-M4. Clause 3 is shown by V18-B2, M3 and M4. Three parts are recorded, not failed: the parked return policy of
"SYN Business visa (paper)" (A06), the parked shared-item return (A31) and the parked cross-operator custody of a
split shared original (A35) read "Unmet: parked policy (BS B30; PL B-05), owner product owner"; the boundaries pass
as boundaries. The custody history on OP-09 is "partly met" until a read serves it (Q-03). The run record names the
`lane-ui` ref, the run tag, Y's identifier, each test, the identifiers (internal record only) and every delta.

## 4. Scenario parts outside this proof (traceability)

| Scenario part | Where it is proven |
|---|---|
| V18 clause 2 at the command level: `core.reassign` changes no custody row | Core test `test/core/assignment-holds.test.ts` "reassigns: duties move, the previous operator is denied, readiness becomes the previous operator’s, acts and custody stay"; WP-06 (WP06-A53, A61) |
| SA-03c itself: duties lists, Gate 1 and readiness lines, the reason, the receipt, its replay and stale cases | WP-06 (WP06-A51 to A62) |
| OP-07 completion page, its boundary wording and the other requirements | WP-08 (WP08-A51 to A60; E-05, E-06) |
| OP-02 tabs, status facts and action panel other than the custody rows; OP-01 view mapping | WP-07 (with the amendments that A41, A42 and Q-06 propose) |
| Custody incident pages: owner, evidence, resolution, closure | WP-14 |
| The applicant withdrawal form and its assessment | WP-17 (set-up in V18-R8) |
| V19: group end never consumes held originals | WP-17 (V19); Core test `test/core/completion-group-end.test.ts`; A45 by test |
| V12: preparation-only holds no originals | WP-10 (WP10-A03); A05 by test |
| A completed application's custody (completion clears the assignment) | Out of reach: completion requires every original returned (`derived.ts:199-200`); no proof step |
| Monitors custody counts | WP-06 (SA-01) and WP-14; observed in V18-R6 and R7 |
| Shared-item return priority, assignment suitability, recipient evidence, loss and damage, cross-party visibility | Max and the product owner: BS B30 PARKED; PL B-05 (boundaries in A06, A30 (2), A31, A35, A39) |
| A custody history read; an originals register across applications | Kind 1 notes Q-03, Q-04 (deferred) |

## 5. Out of scope and boundaries

These MUST NOT appear on any WP-12 page:

- A custody control on a travel-agent page or on a SuperAdmin page, SA-03c included (BS B18; `policy.ts:222`).
- A custody form on OP-02, the old operator case page or the case-work section after WP-12 (one host page per
  command, CC-12 to CC-14).
- A loss or damage option, or "Lost", "Damaged", "Missing" or "Destroyed" as a state (parked policy, BS B30).
- A return to anyone other than the owning travel agent, or a free recipient field.
- A claim that a scan, a parcel label, a courier receipt, an assignment or a reassignment proves possession, moves an
  original or proves a return (BS B30, B19).
- "Held" for a part that is only expected; "Returned" for a part that is not returned; the original-level holder
  shown as the holder of every part; an earlier uncertainty statement shown as a current fact.
- A claim that custody moves to the new operator, or a new operator named as a holder, on SA-03c or its receipt.
- On an operator page: a fact of an application the reader is not assigned to (applicant, reference, link, custody),
  also when an original is shared with it (BS B30; UX §5.2).
- Custody details on a travel-agent page (parked cross-party visibility).
- A receipt that names a command the operation does not establish, an accepted time, or an instruction to act from
  an older state (F-01; P-02).
- Earlier facts on a page after a read was refused for access (LD-14); a custody form while `ops.case_work` is
  unavailable.
- A truncated field, a dropped part, a dropped part number or a dropped indexed evidence row (LD-17).
- A completion control, or a claim that the application completed when the last part was returned (LD-04).
- A list of accepted return evidence kinds, or any configuration value that no read returns (WP-01 Q-13).
- A semantic duplicate guard for movements (Core has none); a count shown as "0" when it is unknown (D7).

Recorded as parked (owner product owner), not as failures (§0.2 "Pass rule"):

- The return policy of "SYN Business visa (paper)" (`parked_custody_route_policy`): A06.
- The return of a shared original under a single-application policy, and shared-item return priority: A31.
- Custody across operators of a shared original (link to another operator's application; an original whose
  applications have different operators after a reassignment): A30 (2), A35.
- Custody details for the travel agent (cross-party visibility): A39.

Deferred in WP-12 (each item says where it lands; the run record lists them as "Deferred"):

- Custody history on OP-09 (movements, evidence, actor, event and recorded times, the holder reference): A02 partly
  met; Q-03, Q-09.
- An originals register across the operator's applications and the rail item "Originals": Q-04 (inventory RM-O9,
  P2).
- A per-original return availability fact: A27 lists the discrepancy; Q-07.
- The declared item types on a staff read: Q-08.
- Command identity and accepted time in receipts (P-10 b, P-02): receipts as A47.
- The reassignment preview read with custody holders (P-10 d): A33 adopts it when served (S-08).
- A Core change for a part that will not arrive (Q-01) and for a split shared original (Q-02): Kind 2 options for
  Max; the UI shows the facts and the boundaries meanwhile.

Not in WP-12 (other packages):

- `core.reassign` and SA-03c apart from its custody detail: WP-06.
- Custody incidents' review, resolution and closure (`ops.resolve_incident`, `ops.close_incident` and the rest):
  WP-14.
- Withdrawal commands and group end: WP-17. Completion request: boundary (LD-04; WP-08 OP-07).
- Preparation-only packet work: WP-10.

## 6. Questions for the architect (ranked)

The ranks follow PRI-20260930-01: P0 blocks the main path or risks irreversible harm; P1 goes to Max (through the
architect and the orchestrator) to be parked or worked; P2 is parked as a note. No question is P0: the main path
(receipt, movement, partial and full return, completion evaluation) works on "SYN Paper visa with original return",
and no real offering with originals can launch while its return policy is unresolved (`launch/readiness.ts:90`).

| ID | Rank | Question | Concrete scenario | PM recommendation |
|---|---|---|---|---|
| Q-01 | P1 | A part that is listed at the receipt and never arrives holds completion for ever. Core counts an `expected` part as not returned (`custody.ts:62-63`; `original_held`), refuses to move or return it (`part_not_received`, `part_not_held`), refuses its receipt without attested possession, and has no command that records that a listed part will not arrive (loss and damage are parked). | OP1 records RANI's passport with the parts "Passport booklet" and "Old passport" because the travel agent said both would come. Only the booklet comes. After the outcome OP1 returns the booklet. The application never completes, and OP-07 says that an original is still held, although TravelMudra never held the old passport. Likelihood: medium on every receipt that lists a part not yet in hand; harm: an application that can never complete and a false custody statement. | Now (UI): the receipt effect warns that a listed part stays expected and keeps the application open (A08); counts and completion words say "not returned", never "held", for an expected part (A02, A41, A43). Then: a Core way to record that a listed part will not arrive (a movement kind with evidence, or a receipt correction) is a Kind 2 option for Max through the orchestrator; it touches the parked loss policy, so Max decides the direction first. |
| Q-02 | P1 | A reassignment can split a shared original between two operators. The policy gives an original's custody only to the one operator of every linked application (`policy.ts:524-534`); `core.reassign` does not check links. After the split nobody can record a movement or a return; both operators get a plain not-found answer. | M1 and M2 share MIRA's passport (both OP1). OP1 is on leave; SA1 reassigns M2 to OP2. After M2's outcome OP2 tries to return the passport: refused as not found; OP1's try is refused too. Neither page says why. Both applications stay open until a SuperAdmin assigns them to one operator again, which nobody is told. Likelihood: medium where one applicant has two services in a group and operators change; harm: a return duty with no visible route; misleading answers. | A35: SA-03c names each other linked application and its operator and states the split boundary before the confirmation; OP-09 shows the boundary in place of the forms, derived from the reader's assigned work. BS B30 lists assignment suitability and cross-party visibility as parked, so Core's behaviour fits the specification; a Core guard (refuse or warn on a split, or a shared-item custody owner) is a Kind 2 option for Max. The architect decides whether the boundary names the SuperAdmin route ("until both applications have one operator"). |
| Q-03 | P1 | No read returns the custody history: movements, their evidence, actor, event and recorded times, the return's evidence, the holder reference. UX §2.1 asks for "item-level holder, movement and return evidence"; PL OP-09 lists "movements" and "return evidence"; CMP-17 has "returned with evidence". The facts exist (`ops_original_movements`; facts `ops.original_*`) and only the SuperAdmin full audit shows them. | After the reassignment OP2 sees part 1 "Returned to the travel agent" and cannot see when, by whom or with what evidence. The travel agent says the old passport never came back. OP2 cannot answer from the product and asks a SuperAdmin to search the audit. Likelihood: medium for each returned original; harm: medium (a dispute about an identity document; no data loss). | OP-09 shows part states and the line of A02; A02 is partly met. A read of the movements of an original (kind, parts, holders, evidence, actor, event and recorded times) on `ops.case_work` or a custody-history read. Criterion point 1 holds (the facts exist). Point 2 (DECISIONS §3.1: it removes a client-side join, computation or round trips) does not hold: no read exists to compose. Like P-05 and P-13 item 1 it needs Max's exception to point 2; the PM recommends that the architect route it to Max through the orchestrator with UX §2.1 as the reason (G-11). |
| Q-04 | P2 | No originals register read across the operator's applications (inventory RM-O9, ranked P2). PL §2.2 shows the rail item "Originals" "only when the operator's scope includes a declared physical route", a fact that no read gives. | An operator holds twelve passports across nine applications. To find which are still held after their outcomes, the operator opens OP-01 "Delivery and closure" and each application. Likelihood: certain once volumes grow; harm: low now (synthetic volumes; OP-01 lists the return duty after an outcome). | OP-09 per application, reached from OP-02, OP-07 and the OP-01 row; the rail item stays hidden (a recorded deviation from PL §2.2) or lists originals from the work list's case reads only for small sets (the inventory's interim). Kind 1 note parked as the inventory ranks it. |
| Q-05 | P1 | A link cannot be removed, and Core checks neither the applicant nor the lifecycle of the target (`originals.ts:156-185`). Any application of the same group and operator with a physical route can receive a link, also another applicant's application or a withdrawn one. | OP1 means to link MIRA's passport to MIRA's second application and picks BINA's row. BINA's application now cannot complete until MIRA's passport is returned; the return of a shared original is unavailable under a single-application policy; both applications stay open with no route. Likelihood: low to medium; harm: high (a permanent hold on an unrelated application). | OP-09l lists only the reader's own assigned applications in the group with applicant and service, names the original's own applicant in the lead, and states "A link cannot be removed." before the button (A28). A Core same-applicant guard or an unlink command is a Kind 2 option for Max. |
| Q-06 | P1 | A case whose only remaining step is a return under a parked policy has Core's owner "assigned operator" (`derived.ts:415`, reason `parked_custody_route_policy`); WP-07's mapping puts an operator-owned row in "Action now" and counts it, although no action is possible. | OP2 holds five "SYN Business visa (paper)" passports after their outcomes. Five rows sit in "Action now" for weeks with nothing to do; the navigation count is inflated and real work hides among them. Likelihood: certain for every parked-route case after its outcome; harm: low to medium (attention). | A WP-07 mapping amendment of the F-07 and F-16 class: `return_original` with `parked_custody_route_policy` sits in "Waiting" with the owner label "Unavailable in this release" and is not counted; the OP-02 action panel shows the boundary (A42). The custody facts stay visible on OP-09. |
| Q-07 | P2 | Return availability is one flag per application (`custody.ts:54-68`); with two originals on one application (one shared), the page cannot tell which return Core accepts. | M2 holds its own original and a linked one; `returnAvailable` is false; the page hides the return of the original that Core would accept. Likelihood: low (one passport per applicant; needs a link). | One original: exact (A27). Several: the form shows on each and Core's reason re-renders (a listed discrepancy, H-02). Kind 1 note (a per-original flag), parked. |
| Q-08 | P2 | Staff reads carry no declared item types (only `core.ta_application.originals.itemTypes`); the receipt form cannot offer them. | A later offering declares "passport" and "old passport". The operator types "old_passport" with a typing error and is refused `item_type_undeclared`. Likelihood: low today (only `passport` is declared). | The design chooses: a fixed "Passport" item when the only known type is passport, or a free code field with Core's refusal in words. Note (item types on the staff case read): point 2 does not hold, so it would need an exception; parked (P2). |
| Q-09 | P2 | The holder reference (`holder.ref`, `toHolder.ref`, up to 200) is accepted but no read returns it. | An operator types the courier's waybill as the holder reference; no page ever shows it again. Likelihood: high if offered; harm: low. | Do not offer the field until a read returns it (no write-only data); the waybill goes in an evidence row, which Core keeps. Joins the Q-03 request. |
| Q-10 | P2 | The stored original-level holder follows the last movement even when it moved one part, and the original-level uncertainty statement is never cleared (`originals.ts:65-83`). | Part 1 goes to the courier; part 2 stays at the office. A reader that shows the original-level holder says "Courier" for the whole passport. After part 1 is found, a reader shows "Uncertain: the courier cannot trace the parcel". Likelihood: certain for any reader that uses those fields; harm: low (pages derive from parts, A02, A04). | Pages derive from the parts (A02, A04). A defect note to the orchestrator for Core (derive the original-level holder and statement from the parts, or label them as the last movement), P2. |
| Q-11 | P2 | Each "whereabouts unknown" opens a new custody incident (`dedupeKey` per movement), and recording the part as found closes none. | A part is lost and found twice: two open incidents stay with the operator. Likelihood: low; harm: low (incidents do not hold completion). | OP-09 lists the open custody incidents with links; no page says that finding the part closed an incident (A17). Resolution belongs to WP-14. |
| Q-12 | P2 | BS B24 says that the operator or a SuperAdmin records the owner receipt; Core lets only the assigned operator record custody. | The operator is suspended after the outcome. Core's pending owner becomes "SuperAdmin"; the SuperAdmin has no custody control. Likelihood: low. | No SuperAdmin custody control. SA pages show the duty and the route "Assign an operator" (UX §2.3: an absent operator is resolved through permitted assignment) (A40). Record the reading; no proposal. |
| Q-13 | P2 | The link of another operator's original answers `unavailable_parked` instead of not found, so it confirms to an operator that an original id exists in its group. | OP2 learns that an original id exists. Likelihood: very low (ids are random and appear on no OP2 page). | The page shows the boundary words and no fact of the original (A30 (2)). A note to the orchestrator, P2. |
| Q-14 | P2 | Host pages: PL names OP-09 as one register page with "Record receipt", "Record movement" and "Record return"; CC-12 to CC-14 set one host page per command; the link has no plan page. | The design puts the four forms on one page with disclosures, or builds them twice (OP-09 and OP-02 Delivery & originals). Likelihood: low. | OP-09 (one application) hosts the receipt and the items; one task page each for the custody change, the return and the link, reached from the item row; OP-02 and the old case page link to them; the POST paths stay (LD-03). The architect decides and records it in the register. |

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
| V18 result (steps; where shown) | |
| Parked policies in force at the run (return of "SYN Business visa (paper)"; shared-item return; cross-operator custody; travel-agent visibility) | |
| Deferred items (reference each) | |
| Partly met items (decision reference) | |
| Open findings (ID, rank, scenario) | |
| Signed by (role and name) | |

Result per item (Pass, Fail, Blocked, Partly met, Deferred or Not run; evidence reference; note):

| ID | Result | Evidence | Note |
|---|---|---|---|
| WP12-A01 | | | |
| WP12-A02 | | | |
| WP12-A03 | | | |
| WP12-A04 | | | |
| WP12-A05 | | | |
| WP12-A06 | | | |
| WP12-A07 | | | |
| WP12-A08 | | | |
| WP12-A09 | | | |
| WP12-A10 | | | |
| WP12-A11 | | | |
| WP12-A12 | | | |
| WP12-A13 | | | |
| WP12-A14 | | | |
| WP12-A15 | | | |
| WP12-A16 | | | |
| WP12-A17 | | | |
| WP12-A18 | | | |
| WP12-A19 | | | |
| WP12-A20 | | | |
| WP12-A21 | | | |
| WP12-A22 | | | |
| WP12-A23 | | | |
| WP12-A24 | | | |
| WP12-A25 | | | |
| WP12-A26 | | | |
| WP12-A27 | | | |
| WP12-A28 | | | |
| WP12-A29 | | | |
| WP12-A30 | | | |
| WP12-A31 | | | |
| WP12-A32 | | | |
| WP12-A33 | | | |
| WP12-A34 | | | |
| WP12-A35 | | | |
| WP12-A36 | | | |
| WP12-A37 | | | |
| WP12-A38 | | | |
| WP12-A39 | | | |
| WP12-A40 | | | |
| WP12-A41 | | | |
| WP12-A42 | | | |
| WP12-A43 | | | |
| WP12-A44 | | | |
| WP12-A45 | | | |
| WP12-A46 | | | |
| WP12-A47 | | | |
| WP12-A48 | | | |
| WP12-A49 | | | |
| WP12-A50 | | | |
| WP12-A51 | | | |
| WP12-A52 | | | |
| WP12-A53 | | | |
| WP12-A54 | | | |
| WP12-A55 | | | |
| WP12-A56 | | | |
| WP12-A57 | | | |
| WP12-A58 | | | |
| WP12-A59 | | | |
| WP12-A60 | | | |
| WP12-A61 | | | |
| WP12-A62 | | | |
| WP12-A63 | | | |
| WP12-A64 | | | |
| WP12-A65 | | | |
| WP12-A66 | | | |
| WP12-A67 | | | |
| WP12-A68 | | | |
| WP12-A69 | | | |
| WP12-A70 | | | |
| WP12-A71 | | | |
| WP12-A72 | | | |
| WP12-A73 | | | |
| WP12-A74 | | | |
| WP12-A75 | | | |
| WP12-A76 | | | |
| WP12-A77 | | | |
| WP12-A78 | | | |
| WP12-A79 | | | |
| WP12-A80 | | | |
| WP12-A81 | | | |
| WP12-A82 | | | |
| WP12-A83 | | | |
| WP12-A84 | | | |
| WP12-A85 | | | |
| WP12-A86 | | | |
| WP12-A87 | | | |
| WP12-A88 | | | |
| WP12-A89 | | | |
| WP12-A90 | | | |
| WP12-A91 | | | |
| WP12-A92 | | | |
| V18 proof (to its boundary) | | | |
