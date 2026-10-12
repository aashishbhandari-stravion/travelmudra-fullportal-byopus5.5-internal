# WP-12 acceptance checklist: Physical originals

| Field | Value |
|---|---|
| Lane | `ui-revamp-2026-10-12` |
| Work package | WP-12 Physical originals (UI-PLAN §12.2: OP-09, SA-03 reassignment preview custody detail; lane PLAN §3) |
| Author | Principal Product Manager (Claude subagent), 13 October 2026 |
| Decision owner | Principal Technical Architect of the lane (LD-12) |
| Status | Aligned on 13 October 2026 with `WP-12-design.md`, the architect's decisions (`WP-12.md` §3), amendments J-01 to J-13 (`WP-12.md` §4.1), WP-06 D-16, WP-07 F-29 to F-32 and WP-08 E-18, E-19 (corrections below). Not run. Where the design names a path or a word differently, the design governs the name and this checklist keeps the observable result. |
| Product base | lane branch `ui-revamp-2026-10-12` at e1f6ac9 (the design and the review read f78e558; the custody commands, their reads and today's custody page code are the same at both); internal records at e2e0535 |
| Installation | `lane-ui`: staff http://127.0.0.1:4652 (operator pages and the SA-03c custody detail under test; other SuperAdmin pages as set-up and observation); edge http://127.0.0.1:4650 (the travel agent's originals section under test; proof set-up) |
| Writing style | ASD-STE100 at about 75% (STY-20261003-01) |

## Corrections of 13 October 2026

The UX design (`WP-12-design.md`), the architect's decisions (`WP-12.md` §3) and the independent design review (lane
`research/reviews/WP-12-design-review.md`, R-01 to R-13, with amendments J-01 to J-13 in `WP-12.md` §4.1, which bind)
changed the rows below. WP-06 D-16 (`WP-06.md` §4.3), WP-07 F-29 to F-32 (`WP-07.md` §4.5) and WP-08 E-18, E-19
(`WP-08.md` §4.4) apply too. No other row changed. Section 6 is kept as asked, with the architect's answers above its
table. The application letters follow the design's recipe (§0.3): P, B, P2 and E1 replace the first version's R, B, M1,
M2 and E.

| Row | Finding or decision | Change |
|---|---|---|
| Status, §0.1 | Design; `WP-12.md` §3, §4.1; review R-02, R-05, R-09 | Inputs add the design, the package record, the review and the amendments. Verified facts add the replay that is authorized again under current access, the operation lookup by the caller, and group labels that are not unique. |
| §0.2 "Personas", "Custody words", "Receipts", "Refused sends", "Paths", "Pass rule", "Preconditions", "Data hygiene"; §1.1, §1.2, §1.3 | Q-W12-01, CC-16; J-02, J-08, J-09, J-11; design §1.3, §2.11 | Six pages: OP-09 and OP-09i read; OP-09n, OP-09m, OP-09t and OP-09l host one command each. The design's word tables govern. The pass rule records P-18 items 1 to 3. |
| §0.3, §0.4, §1.4, §3 and every step reference in §2 | J-13 (R-13); Q-W12-09 | One ordered recipe: the design's §6 with a fresh travel agent per run and lettered additions (P2a, P5a, P9a, P9b, S1a, V2a, V4a, X1). Post-outcome return ownership, the withdrawal, the caps and the expected-part cases are tests (V18-T1 to T4). Uncertainty beside a partial return (P8), genuine revocation (R1, R2) and the replay after a reassignment (V4a) are live. |
| A01, A02, A04, A07, A08, A13, A21, A28 | J-11 (R-11); design §2.2 to §2.7 | The receipt form is on OP-09n, not OP-09; OP-09i shows one original; number lists and the one-part rule replace part checkboxes; the design's anatomy and words. |
| A35, A54, A68 | J-11, J-02 (R-02, R-11); Q-W12-02, Q-W12-10 | Discovery is refusal-driven: the forms stay on a shared original whose applications have two operators; a refused record re-renders with status 409 only when fresh, uncaught reads prove the reader still holds the application and the original is linked; neutral words; the SA-03c conditional sentence. |
| A95 (new) | J-11 (R-11) | Genuine revocation is tested separately: every real access change reaches the shell, never the 409. |
| A94 (new), A50 (6) | J-02 (R-02) | The replay case: a movement committed, a sharing application reassigned, the identical request replayed: status 409, the neutral words and the original request reference; never "Nothing was recorded". |
| A10, A16, A23, A25, A29, A47 | J-08 (R-08) | Recorded facts only from stored summary fields; counts, part lines and item lines "Current"; "A custody incident was opened". |
| A48, §3 V18-P9b, V18-R2 | J-09 (R-09) | Another operator gets the unchecked receipt with the facts it may read now; historical preservation is tested with the original actor. |
| A16, A23, A25, A39, §3 V18-P6, P8, R2 | J-12 (R-12); `WP-08.md` E-19 | The E-19 neutral sentences replace "TravelMudra still holds …" and "No original document is held"; expected-only and uncertain-only cases by test. |
| A06, A21, A27, A31 | J-04 (R-04) | Return is offered per original; Core decides each submission; the application-level answer is never described as one original's policy. |
| A28 | J-05 (R-05) | A candidate's group membership comes from its `group_id` in its scoped case read, never from the label. |
| A09, A22, A60 | J-06 (R-06); LD-17 | A partly filled evidence row is refused at its index with its values kept; only a wholly empty row is omitted; sparse indexes; a comma inside a part name; strict number tokens. |
| A93 (new) | J-03 (R-03); Q-W12-08 | The 50-original and 50-link caps, the target's capacity and concurrent submissions by test; cap protection recorded incomplete until Core enforces or pages (STOP-W12-04, P-18 item 3). |
| A19 | J-10 (R-10) | The unsent choices beside freshly read current facts; no "you saw" row. |
| A28, A30, §5, "Pass rule" | J-01 (R-01) | Safe passport sharing reads "Unmet: waits for Max's decision on P-18 item 1"; the name marker never claims identity. |
| A02, §5 | J-07 (R-07) | The custody history reads "Partly met: waits for Max's decision on P-18 item 2". |
| A41 to A45 | F-29 to F-32, E-18; Q-W12-06 | Status-fact counts; the action-panel row by reason; the OP-07 row; a parked post-outcome return in "Delivery and closure", not counted; the post-outcome checks and the withdrawal as tests (design §6.1). |
| A33, A34, A36 | D-16 | The SA-03c custody block of design §2.8: grouped part lines, never the item-level holder; the receipt's current lines equal the preview's. |
| A55 | J-11 | Disclosed contract limits are allowed. |
| A05, A14, A15, A18, A24 | Design §6.2 (no electronic application, no expected part in the recipe) | The electronic, preparation-only and expected-part cases by test; the courier movement, the stale case and the returned-part refusal live in V18-P9a. |
| A73 to A92, A96 (new) | J-11 | axe targets on the six pages, SA-03c and TA-07 in the recipe's states; the operation status page moves to A96. |
| A03, A11, A12, A17, A20, A26, A30, A32, A37, A38, A40, A46, A52, A53, A56, A58, A59, A61, A64 to A66, A69, A72; §4 to §7 | Design §1.4, §2.0, §2.12, §2.14, §7.1 to §7.3 | Page names, word sources, test names and step references. |

## Lessons applied from the WP-01 to WP-10 corrections and the WP-12 review

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
| On GET assert the blocker and the absence of the form; a command refusal of a removed form is tested with a saved envelope | WP-09 G-05 | A05, A06, A31 |
| Reassignment races are covered: the previous operator is refused by access; the new operator acts on Core's facts | WP-09 G-09 | A34, A37, A95 |
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
| A re-render after a refusal of access never says that nothing was recorded: a replay of a committed request can be refused after access changed; the words stay neutral and keep the request reference | WP-12 J-02 | A35, A50 (6), A94 |
| A refusal-driven re-render is bounded by fresh, uncaught reads; every genuine access change still reaches the shell | WP-12 Q-W12-02, J-11 | A35, A95 |
| A receipt's recorded facts come only from stored summary fields; everything else is "Current" | WP-12 J-08 | A10, A23, A47 |
| An operation lookup answers its own actor only: another reader gets the unchecked receipt | WP-12 J-09 | A48 |
| A stale comparison shows the unsent choices beside freshly read facts; it never reconstructs what the person saw | WP-12 J-10 | A19 |
| Membership comes from ids on scoped reads, never from labels; equal names never establish identity | WP-12 J-01, J-05 | A28 |
| A rendering cap is not protection while Core accepts more; it is recorded as incomplete | WP-12 J-03 | A93 |
| Only a wholly empty row is omitted; a partly filled row is refused at its index | WP-12 J-06 | A09, A22, A60 |
| A per-object action is offered per object when one aggregate flag cannot tell; Core decides each | WP-12 J-04 | A27 |

## 0. Inputs and conventions

### 0.1 Inputs

| Ref | Source | Identity | Sections used |
|---|---|---|---|
| UX | `TARGET_PRODUCT_UX_SPEC.md` (2026-10-05) | SHA-256 b45186887cdc37f6… | §2.1 (Original item), §2.2 (Custody), §2.3, §3.1 step 9, §3.2 (Physical route), §3.3, §5.1, §5.2 (Originals), §5.3, §5.4, §6.1, §6.3 (Assignment), §7.4, §7.5, §8.3, §12 V18 (and V17, V19, V24 where they touch originals) |
| BS | `BUILD_SPEC.md` (r2) | SHA-256 4a6fd90657b0723f… | B19, B24, B30, B33, B35 |
| PL | `../ui-plan-from-specs-2026-10-10/UI-PLAN.md` | SHA-256 75256bfd7e6d929a… | §2.2 (Operator rail "Originals"), §3.3 OP-02 and OP-09, §3.4 SA-03, §4.2 (Physical route), §5.3 (OP-09), §6.3 and §6.4 (Originals register; Assignment candidate), §7 (Record original receipt, movement, holder uncertain, owner receipt; Reassign operator), §8 (CMP-01, CMP-03, CMP-07, CMP-08, CMP-10, CMP-13, CMP-14, CMP-17), §10, §11.1 to §11.3, §12.2 WP-12, §13.2 B-05 |
| IN | `../ui-plan-from-specs-2026-10-10/SURFACE-INVENTORY-2026-10-10.md` | SHA-256 2f9c71a527c80071… | RM-O9 (originals register per application only; Kind 1 candidate, ranked P2), CMD-51 |
| CC | `COMMAND-COVERAGE.md` (this folder) | SHA-256 d2df85471c03d0b6… | §3 rows of the four WP-12 commands and `core.reassign`; §5.1 WP-12; §5.4 (operator case page → OP-09); §6 CC-12 to CC-14, CC-16; §6.1 (`core.reassign` moved to WP-06) |
| LP | `PLAN.md` (this folder) | SHA-256 140b1f0d3a9eca73…; internal e2e0535 | §3, §4 (LD-02, LD-03, LD-04, LD-07, LD-08, LD-11, LD-12, LD-14, LD-17), §7 (#22, #23), §8 (S-08), §9 |
| PR | `PROPOSALS.md` (this folder) | SHA-256 fcc412acba79f48e… | P-02, P-10 (d: reassignment preview with custody holders; b: command identity), P-18 items 1 to 4 (with the orchestrator's disposition of 13 October 2026) |
| W6 | `WP-06.md`; `WP-06-design.md`; `WP-06-acceptance.md` | SHA-256 2dabeab4fab80ea8…; 327f580c1820bf40…; 7a1d82e48fde6e93… | record §3 (Q-W06-01: `core.reassign` in WP-06; WP-12 adds custody detail to the preview only), §4.1 D-02, D-04, §4.3 D-16; design §2.5 (SA-03c), §2.8 (`reassigned` receipt); acceptance WP06-A51 to A62 (A52, A53, A60, A61), §0.3 (`syn_paper_return`) |
| W7 | `WP-07.md`; `WP-07-design.md` | SHA-256 9821d58d41b2cf99…; 4c877b4be85dc5e7… | record §3, §4.1 F-01, F-04, F-07, §4.3 F-16, §4.5 F-29 to F-32, §4.6 F-33; design §1.3 (rail "Originals" hidden until OP-09), §2.1 (OP-01 view mapping), §2.3 item 5 (status fact "Originals"), §2.4.5 (action panel, "Also needed"), §2.5.3 (Delivery & originals tab) |
| W8 | `WP-08.md`; `WP-08-design.md` | SHA-256 0a9bfc4420d33e33…; 7a74a46cc1480906… | record §3, §4.1 E-05, E-06, E-12, §4.4 E-18, E-19; design OP-07 owner table (`originals`), the travel-agent completion sentences |
| W9 | `WP-09-acceptance.md` | SHA-256 921a665b20da281a… | format; §0.2; §0.5; G-03, G-05, G-07, G-09, G-10, G-11 |
| W10 | `WP-10.md`; `WP-10-acceptance.md` | SHA-256 8915f4fe82061cba…; 53f0298e60cd2203… | record §3, §4.1 H-01 to H-14; acceptance format, §0.2, §0.5, WP10-A03 (preparation-only holds no originals) |
| W12 | `WP-12-design.md`; `WP-12.md`; lane `research/reviews/WP-12-design-review.md` | SHA-256 c852a9ad312b5a01…; aea7f10624c10b40…; 51f4f608bdb2b2fe… | design §0 to §9 (pages, words §2.11, receipts §2.12, stale §2.13, refusals §2.14, parsing §2.15, hostile states §4, proof §6, units §7); record §3 (Q-W12-01 to Q-W12-10), §4.1 (J-01 to J-13); review R-01 to R-13 |
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
- **Replay and lookup (review R-02, R-09).** The same `_op` with the same content resolves the earlier result under
  current read access (BS B35): the kernel authorizes the resource again, so after a reassignment that gives a shared
  original two operators, a replay of a committed movement answers `not_found_or_forbidden`. The operation lookup
  searches by the caller's actor and the key: another operator's receipt address finds no record.
- **Groups (review R-05).** `core.create_group` imposes no label uniqueness; `core.ops_work` rows carry the label only;
  a candidate's `group_id` comes from its own case read.
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
  SA-06 at set-up); `syn-ta-1` is the fallback (the design's persona, §0.4); `syn-ta-2` for isolation only.
  Operators: `operator-1` (OP1: P, B and P2 at first; P2 again after V18-V6), `operator-2` (OP2: E1; P after V18-R1;
  P2 between V18-V2 and V18-V6), `operator-3` (holds a group read grant of the run's group; read-only checks).
  SuperAdmins: `superadmin-1` (SA1, set-up and the SA-03c previews under test) and `superadmin-2` (SA2, observation).
  They stand for `syn-operator-1` to `-3` and `syn-superadmin-1`, `-2`. Keyboard-only user. Screen-reader user. Phone
  user (390 px wide). No step suspends a seeded account.
- **Where.** `L`: a person or the LD-11 harness shows it on `lane-ui`. `T`: an automated test in the lane repository
  shows it at the same commit; the run record names the test. `L+T`: both are required. A test that the item says
  WP-12 adds is named in the run record with its file and title.
- **Sign-in codes (rule C).** As WP-01 §0.2. The LD-11 harness signs in. Nobody prints, logs, screenshots or stores a
  code or an authenticator key.
- **Copy.** Quoted text is draft copy (CR-09). Draft copy passes when the page states the same facts. The §11.3
  boundary form is mandatory for an unavailable action: "[Action] is unavailable until [policy or evidence] is
  [approved / recorded]. Owner: [owner or 'not yet named']." Core's reasons show in words; a code shows only as the
  UAT-13 fallback (A52).
- **Custody words.** Design §2.11 governs: holder words, part words and part lines, the item line derived from the
  parts, and the completion detail sentences; design §2.0 maps the glossary ("Returned to owner" is written "Returned
  to the travel agent"; Core records the owning travel agent account as the recipient of every return). A count of
  parts that are not returned is never called "held". Never: "Lost", "Damaged", "Missing" or "Destroyed" as a state
  (loss and damage are a parked policy); "Delivered" or "Sent" for a return; any custody change for an assignment or a
  reassignment; the item-level holder or place as an item's holder; "Nothing was recorded" in the D-W12-09 re-render
  (J-02). Travel-agent completion words are E-19's only.
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
  past (F-01 class). The polite region announces it. Recorded facts come only from the stored summary fields
  (`originalId`, `movementId`, `incidentId` as "A custody incident was opened", `state`, `applicationId`); counts, part lines and item lines are "Current" (J-08). The operation
  lookup answers the caller only: another reader of a receipt address gets the unchecked receipt with the facts that
  reader may read now (J-09).
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
  could change. The D-W12-09 re-render (status 409) is not a refused-send statement: it never says that
  nothing was recorded (J-02).
- **Paths (LD-03; design §1.3).** Existing POST paths and form actions stay: receipt
  `/ops/applications/:applicationId/originals`, movement `/ops/originals/:originalId/movements`, return
  `/ops/originals/:originalId/return`, share `/ops/originals/:originalId/link`. Six new GET pages: OP-09
  `/ops/applications/:applicationId/originals`; OP-09i `…/originals/:originalId`; OP-09n `…/originals/new`; OP-09m
  `…/originals/:originalId/movement`; OP-09t `…/originals/:originalId/return`; OP-09l `…/originals/:originalId/share`
  (register CC-16). SA-03c is WP-06's page `/admin/applications/:applicationId/reassign`. Pages of other packages:
  OP-02, OP-01 (WP-07); OP-07, TA-07r (WP-08); TA-07 (WP-03); incident pages (WP-14). An item names the page; the run
  record names the path used.
- **Pass rule.** WP-12 passes when every `L` item passes on `lane-ui` at the integrated ref, every `T` item has a
  named passing test at that commit, every axe item passes, and the V18 proof of §3 passes, except the explicitly
  deferred items of §5. The run record lists each deferred item as "Deferred" with its reference, not as "Fail".
  Recorded, not failed: the parked return and shared-item policies (BS B30; PL B-05) read "Unmet: parked policy, owner
  product owner" when the page shows the boundary; safe passport sharing and the other custody corrections read "Unmet:
  waits for Max's decision on P-18 item 1" (J-01); the custody history reads "Partly met: waits for Max's decision on
  P-18 item 2" (J-07); the cap protection reads "Incomplete: waits for Core (STOP-W12-04, P-18 item 3)" (J-03). An item
  that the architect marks "partly met" by a recorded decision passes with that note. A failed item becomes a finding
  ranked P0, P1 or P2 with its scenario (PRI-20260930-01).
- **Preconditions on `lane-ui`.** WP-01, WP-02, WP-03, WP-06, WP-07 and WP-08 are integrated (design §1.7: TA pages
  create, edit and submit; SA-06 creates accounts; SA-07a records payments; SA-03a assigns; SA-03c reassigns; OP-02 has
  its frame, tabs and action panel; OP-07 shows completion; TA-07 shows the completion rows). Where one is not
  integrated, the step runs on the existing page and the run record says so. The harness can create, activate and sign
  in a new synthetic travel agent, and the offerings of §0.3 admit it (checked first, §0.4).
- **Data hygiene.** WP-12 MUST NOT change seeded offerings, declarations, return policies, launches, listings or
  accounts, and MUST NOT create an offering. Each run creates its own travel agent Y, group and applications, with
  descriptions, notes, references and evidence that carry the run tag. Synthetic documents only, generated in memory;
  passport numbers are new in every run; no description or note holds a passport number. A run leaves applications
  that cannot complete (B's parked return; the original shared by B and P2): this is expected, and later runs exclude
  them by their tag. The run record keeps identifiers (travel agent, applications, originals, movements, incidents,
  operation references) in the internal record only.

### 0.3 Synthetic data used by WP-12

| Item | Value | Use |
|---|---|---|
| Travel agent | Y, `wp12-ta-[stamp]`, a fresh synthetic travel agent per run (SA-06); fallback `syn-ta-1` (design §6.2) | Every application of the run |
| Group | `wp12-[stamp]` in Synthetica; travel start today + 30 days, return today + 40 days | P, B, P2, E1 |
| P | Applicant R "Synret, Asha"; "SYN Paper visa with original return" (`syn_paper_return`, ₹5,400): physical route, item type passport, return policy supported for one application (recipient evidence attestation or document version) | The main custody path: receipt, partial return, holder uncertain beside the partial return, found again, courier movement, stale case, reassignment, full return |
| B | Applicant D "Synshare, Dev"; "SYN Business visa (paper)" (`syn_business_paper`, ₹5,200): physical route, return policy parked | D's passport is recorded here; the parked return; the share to P2 |
| P2 | Applicant D "Synshare, Dev" (the same identity facts as B); "SYN Paper visa with original return" | The share target; the shared-item return boundary; the reassignment that gives the shared original two operators, and the reassignment back |
| E1 | Applicant E "Synother, Esha"; "SYN Business visa (paper)"; assigned to OP2 | OP2's view of the group; the cross-operator share refusal |
| Passports | Synthetic, unique to the run (`SyntheticPassport` rendered with `passportTextPdf` or `passportImage`, `test/fixtures/documents/samples.ts`); D's one passport for B and P2 | Intake |
| Photographs | `plainPng` at least 350 × 350 px | Intake |
| Payments | "Payment received" for P, B, P2 and E1, evidence reference `SYN-W12-[stamp]-[letter]` | Gate 1 passes on payment; no exception is used |
| P's original | Type `passport`; description "SYN booklet, blue cover"; parts "Passport booklet" and "Old passport, cancelled" on two lines; held now "1 2"; holder "A TravelMudra office", place "Synthetic office, safe A"; evidence External reference `SYN-CR-[stamp]`; today's date | V18-P2 |
| B's original | D's passport, one part "Passport booklet", held now "1", "A TravelMudra office", "Synthetic office, safe C" | V18-S1 |
| Places and holders later | Part 2 of P: "Holder uncertain" with "SYN: not in safe A on [date]"; then "Synthetic office, safe B"; "A courier", "Synthetic courier [stamp]"; part 1 of B's original: "Synthetic office, safe D" | V18-P8, P9, P9a, P9b, V2a |
| Return evidence | Attestation "My statement" `SYN-RET-[stamp]` | V18-P5, R2 |

### 0.4 Run recipe (rerunnable)

- Run tag `wp12-[yyyymmddhhmm]`. First check: the harness can sign in Y, and "SYN Paper visa with original return" and
  "SYN Business visa (paper)" admit Y (TA-03). Fallback when they do not: `syn-ta-1` with a run-tagged group (the
  design's persona; no other change to `syn-ta-1`), recorded in the run record.
- Baseline (step P-0, before the set-up): the OP-01 view counts of OP1 and OP2 (Action now, Waiting, Delivery and
  closure, Continuing duties); the open custody incidents listed for OP1 and OP2; SA-01 Monitors "custody incidents"
  and "parts with unknown whereabouts" where the page shows them; the TA-10 count of Y right after its activation.
  Every later count check is a delta from it.
- Setup (labelled "Setup", driven by the harness through integrated pages; design §6.2): SA1 creates and activates Y.
  Y creates the group and adds P, B, P2 and E1, uploads the mandatory documents (TA-09f) and submits the four (TA-08).
  SA1 records "Payment received" for each (SA-07a), assigns P, B and P2 to OP1 and E1 to OP2 (SA-03a), and grants
  `operator-3` read access to the group. The reassignments of P and P2 (WP-06 command) are set-up steps inside §3;
  their SA-03c previews are under test.
- Every harness send uses the fields of a freshly loaded page unless the step says "raw". A raw envelope is built from a
  page loaded earlier in the run and named in the run record.
- Order (§3, one recipe: the design's §6 with lettered additions): P-0, Setup, Part P (V18-P1 to P9b), Part S (S1 to
  S3), Part R (R1, R2), Part V (V1 to V6), Part X (isolation, tests, axe). The post-outcome checks run as tests
  (V18-T1): the recipe records no outcome (design §6.1). Data of earlier runs stays and is excluded by its tag.

### 0.5 Refusal shapes in the code at e1f6ac9 (category / code)

| Command | Refusals the items assert |
|---|---|
| `ops.record_original_receipt` | `not_found_or_forbidden` / `access_denied` (not the assigned operator; a reassignment after the policy check; a SuperAdmin, a read-grant holder); `control_blocked` / `preparation_only_holds_no_originals`; `control_blocked` / `custody_path_not_declared`; `control_blocked` / `application_not_open`; `validation_failed` / `input_invalid` with field `itemType` code `item_type_undeclared`; `control_blocked` / `custody_evidence_missing` (possession not attested); `validation_failed` / `input_invalid` with `holder.kind` `holder_not_in_custody`, `receivedParts` `not_a_part`, `label` `required`, `evidence.N.kind` `evidence_kind_unknown`, `evidence.N.id` `evidence_version_not_usable` or `invalid_id`, `eventAt` `instant_invalid` or `instant_in_future`; `validation_failed` on the schema (description, parts count and length, holder kind, place, evidence count, a note with an address or a link: `email_like`, `url_like`); `conflict_duplicate` / `original_already_recorded` |
| `ops.record_original_movement` | `not_found_or_forbidden` / `access_denied` (not the one operator of every linked application: another operator, a split shared original, a reassignment); `stale_revision` / `stale_revision`; `validation_failed` / `input_invalid` with `parts` `not_a_part`, `part_returned`, `part_not_expected`, `part_not_received`; `uncertainty` `required`; `toHolder.kind` `use_return` or `holder_not_in_custody`; the evidence and event-time codes above; `control_blocked` / `custody_evidence_missing` (a receipt of parts without attestation); `validation_failed` on the schema (`kind`, parts count, statement length, evidence count, notes). After acceptance with holder `unknown`: a `custody_discrepancy` incident (a fact, not a refusal) |
| `ops.record_original_return` | `not_found_or_forbidden` / `access_denied`; `stale_revision` / `stale_revision`; `unavailable_parked` / `parked_custody_route_policy` (a linked application's declaration has no supported return policy; a shared original under a single-application policy); the evidence and event-time codes above; `control_blocked` / `custody_evidence_missing` (no evidence of a kind the policy declares); `validation_failed` / `input_invalid` with `parts` `part_not_held`; `validation_failed` on the schema (no evidence, more than five, parts count) |
| `ops.link_original` | `not_found_or_forbidden` / `access_denied` (target not assigned to the actor; an original of another group or an unknown id); `stale_revision` / `stale_revision`; `control_blocked` / `preparation_only_holds_no_originals`; `control_blocked` / `custody_path_not_declared`; `conflict_duplicate` / `duplicate_operation` (already linked); `unavailable_parked` / `parked_custody_route_policy` (a linked application of another operator) |
| `core.reassign` (WP-06; reference only) | As WP-06 §0.5 and WP06-A54 to A58. WP-12 asserts only that no refusal and no acceptance of `core.reassign` changes a custody fact |

Two behaviours bound the items. (1) A replay with the same key and content is authorized again under current access
(review R-02): after a reassignment, a replay of a committed custody record can answer `not_found_or_forbidden`. (2) A
movement, return or share refused `not_found_or_forbidden` re-renders with status 409 only when fresh, uncaught reads of
`core.ops_case` and `ops.case_work` of `returnTo` answer, the reader is assigned and the original is still linked to
`returnTo` (Q-W12-02, design D-W12-09); its words are J-02's; every other refusal of access reaches the shell.

## 1. Scope

### 1.1 Pages

| Page | Host and path | Part in WP-12 |
|---|---|---|
| OP-09 Originals (of one application) | 4652 `/ops/applications/:applicationId/originals` (new GET beside the receipt POST) | Route line; "Custody now"; the items (CMP-17 rows) with links to OP-09i; the link to OP-09n; custody incidents; the states of design §2.2 |
| OP-09i Original (one item) | 4652 `/ops/applications/:applicationId/originals/:originalId` (new) | Item, item line, parts, statement, "Shared with" (visibility rule), the record-custody links or their notices, the "earlier records" sentence |
| OP-09n Record an original received | 4652 `…/originals/new` (new); form → POST `/ops/applications/:applicationId/originals` | `ops.record_original_receipt` |
| OP-09m Record a custody change | 4652 `…/originals/:originalId/movement` (new); form → POST `/ops/originals/:originalId/movements` | `ops.record_original_movement` (arrival, movement, holder change, holder uncertain) |
| OP-09t Record a return to the travel agent | 4652 `…/originals/:originalId/return` (new); form → POST `/ops/originals/:originalId/return` | `ops.record_original_return` |
| OP-09l Share an original with another application | 4652 `…/originals/:originalId/share` (new); form → POST `/ops/originals/:originalId/link` | `ops.link_original` |
| SA-03c Reassign (WP-06 page) | 4652 `/admin/applications/:applicationId/reassign` | Only the custody block of the preview and of the receipt (D-16; design §2.8) |
| TA-07 section "Original documents" (carried by WP-03; owned by WP-12) | 4650 `/ta/applications/:applicationId#originals` | Declared item types, the parked visibility boundary, the E-19 completion sentences, the `return_original` words; no custody detail |
| OP-02 (WP-07 page) | 4652 `/ops/applications/:applicationId` | Status fact (F-29); "Originals" summary and link (F-32); action-panel row (F-31); docket link to OP-09; no custody form |
| OP-07 (WP-08 page) | 4652 | The `originals` row (E-18) |
| OP-01 (WP-07 page) | 4652 | The parked post-outcome return in "Delivery and closure" (F-30) |
| Old SuperAdmin case page; SA-01 Monitors; incident pages (WP-14) | 4652 | Read-only custody summary (design §1.6); observation |
| Old operator case page | 4652 | Only: the custody forms leave it; links replace them |

Read models: Operator case (`core.ops_case`, `ops.case_work`), Assigned work queue (`core.ops_work`, `views.ops_work`),
SuperAdmin case (`core.admin_case`, `ops.case_work` on the admin surface), TA application case (`core.ta_application`),
TA history (`views.ta_history`, projection), Monitors (`views`, projection), Incidents (`ops.incidents`,
`ops.incident`), Operation (`core.operation`).

### 1.2 Command coverage (CC §5.1: 4 WP-12 commands)

| # | Command | Route id (POST path) | Host page | Items |
|---|---|---|---|---|
| 1 | `ops.record_original_receipt` | `ops.custody.receipt` (`/ops/applications/:applicationId/originals`) | OP-09n | A08 to A12; A10 effects |
| 2 | `ops.record_original_movement` | `ops.custody.movement` (`/ops/originals/:originalId/movements`) | OP-09m (arrival `receipt`, `partial_movement`, `holder_update`; "Holder uncertain" with the statement) | A13 to A20 |
| 3 | `ops.record_original_return` | `ops.custody.return` (`/ops/originals/:originalId/return`) | OP-09t (owner receipt: a return to the owning travel agent with evidence) | A21 to A27 |
| 4 | `ops.link_original` | `ops.custody.link` (`/ops/originals/:originalId/link`) | OP-09l | A28 to A32, A93 |
| ref | `core.reassign` (WP-06; WP06-A51 to A62) | `admin.applications.reassign` | SA-03c | WP-12 adds the custody block only: A33 to A37, A94, A95 |

All of them also: A46 (shell), A47 (receipt checked against the operation), A48 (no instruction to act; another
reader's receipt), A49 (no record for a refusal; lost acknowledgement), A50 (replay matrix), A51 and A52 (refusal text),
A53 (LD-14 and outages), A54 to A59 (role controls, copy, read grant and support view, storage, host pages and carried
forms, isolation), A60 (LD-17 handlers), A94 (replay after access changed), A95 (genuine revocation).

UI-PLAN §12.2 names five actions for WP-12. "Record original receipt" is command 1 on OP-09n. "Record original
movement" and "Record holder uncertain" are command 2 on OP-09m (holder uncertain is the holder `unknown` with its
statement). "Record owner receipt" is command 3 on OP-09t: Core records every return to the owning travel agent
account. "Reassign operator" is `core.reassign`, built in WP-06 (CC §6.1); WP-12 adds the custody block to its preview
and receipt. Command 4, `ops.link_original`, has no UI-PLAN action; OP-09l "Share an original with another
application" hosts it (CC-16).

Commands outside WP-12 that the proofs touch only as set-up or observation: `iam.create_account`,
`iam.activate_account` (WP-02); `core.create_group`, `intake.start_individual`, `core.edit_draft`, `core.submit`
(WP-03); `pay.record_service_status`, `core.assign`, `core.reassign` (WP-06); `iam.create_group_read_grant` (WP-15);
`core.record_applicant_withdrawal` and `iam.start_support_view` (tests only).

### 1.3 State coverage

S1 (loading) does not apply: every WP-12 page is server-rendered. S5 applies only to OP-01 and SA-01 Monitors
(projections), which WP-12 observes.

| Page | Page states | C1 validation | C2 rejected | C3 accepted | C4 unresolved | C5 stale |
|---|---|---|---|---|---|---|
| OP-09 | No physical route, preparation only A05; empty A01; items A02; return unavailable A06; outcome recorded A45 (test); read only A07; originals unavailable A53; 50 originals A93 | — | — | (receipts land on OP-09i) | — | — |
| OP-09i | Item, parts, statement A02, A04; parked return A06; shared A29, A31; two operators A35; every part returned A25; read only A07; not linked here (404) A59; unavailable A53 | — | — | A10, A16, A23, A25, A29 | — | — |
| OP-09n | Form A08; blocked A05; 50 originals A93 | A09 (1) | A09 (2), (3), A11 | A10 | A12 (5) | — (no revision; A12 (3)) |
| OP-09m | Form with the one-part rule or the number list A13 | A16 (1) | A14, A15, A18; 409 A35, A94; shell A37, A95 | A15, A16 (2), A17 | A20 (5) | A19 |
| OP-09t | Form A21; parked A06; shared A31; nothing to return, cannot be returned now A21 | A22 (1) | A22 (2), (3), A24 | A23, A25 | A26 (5) | A24 (5) |
| OP-09l | Form A28; no candidate A28; 50 links, target capacity A93 | A28 | A30 | A29 | A32 (5) | A30 (5) |
| SA-03c custody block | Held, partly returned, with a custody incident A33; shared A35; every state and outage A36 | — | — | receipt lines A34 | — | — (WP06-A58) |
| TA-07 "Original documents" | Declared originals with the boundary; E-19 sentences A39 | — | — | — | — | — |
| OP-02 status fact, tab, action panel | A41, A42 | — | — | — | — | — |
| OP-07 `originals` row | Not met (held; uncertain; expected only), met A43 | — | — | — | — | — |
| OP-01 | A44 | — | — | — | — | — |

### 1.4 Specification scenarios

| Scenario | What WP-12 shows | Items |
|---|---|---|
| V18 clause 1: "Partial original return holds applicable completion" | Before an outcome, a partial return leaves OP-07 `originals` "Not met"; with an uncertain holder beside the partial return it stays "Not met"; the full return meets it; nothing completes by itself. After an outcome, Core's `return_original` step, its owner and the OP-01 view (tests) | A16, A23, A25, A42 to A45; §3 V18-P5, P6, P8, R2, T1 |
| V18 clause 2: "reassignment does not move custody" | The SA-03c preview states that originals stay where they are and lists the part lines as current; after the reassignment every part has the same state, holder and place; the previous operator is refused; the custody incident moves as a duty | A33, A34, A37, A95; §3 V18-R1, R2 |
| V18 clause 3: "undeclared shared-item policy does not grant other operators visibility" | Another operator of the group sees no original that is not linked to its own application; the other application of a shared original shows without name, reference or link; a share across operators is the parked boundary; a shared original's return is the parked boundary; custody records of a shared original with two operators are refused with the bounded 409 | A28, A30 (2), A31, A35, A38, A94; §3 V18-S2, S3, V1 to V6 |
| UX §2.1: item-level holder, movement and return evidence; an assignment does not move an item | Item and part holders and states; records with evidence. The custody history is on no read: "Partly met: waits for Max's decision on P-18 item 2" | A02, A10, A13 to A17, A21 to A25 |
| UX §2.2: known holder and location or explicit uncertainty; partial return stays partial | Part lines; "Holder uncertain" with the statement; "Partly returned" | A02 to A04, A16, A17, A23 |
| UX §3.1 step 9: completion re-evaluates originals; no automatic completion | OP-07 shows Core's `originals` flag; the last return completes nothing | A25, A43 |
| UX §3.2 Physical route: item-level receipt, partial movement, holder uncertainty, actual owner receipt; return duties outlive withdrawal; shared-item policy gaps block affected steps | The four commands; the withdrawal by test; parked boundaries on the affected steps | A08 to A32, A45 |
| UX §5.4, §6.3: a reassignment revokes the old operator at once; the preview names the retained custody holder | SA-03c custody block; SH-02 for the previous operator | A33 to A35, A37, A95 |
| BS B30: assignment, scans, parcel labels and courier receipts do not prove possession or return; preparation-only holds no originals; same-group linkage grants no other operator's view | The statement rule at receipt and arrival; the evidence rule at return; no custody path for preparation-only; no cross-operator view | A05, A09 (2), A14, A22 (2), A28, A38, A55 |
| UX §12 V24 (keyboard and phone) | The WP-12 tasks by keyboard and at 390 px | A61 to A72 |

## 2. Acceptance checklist

### 2.1 OP-09 and OP-09i: reading

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP12-A01 | Operator (OP1) | OP-02 "Delivery & originals" and OP-09 of P before any receipt (§3 V18-P1) | Open OP-02 of P, tab "Delivery & originals". Select "Open the originals". Read OP-09. Select "Record an original received", then "Cancel" on OP-09n. | OP-02 tab: section "Originals" (F-32) with the facts of OP-09 item 3 and the link "Open the originals" → OP-09; no custody form on OP-02. OP-09 (design §2.2): the OP-02 frame; page title "Originals"; the route line "This service holds the applicant's physical originals. … Assigning or reassigning the application moves no original."; "Custody now": "Parts not returned: None", "Parts with holder uncertain: None", no "Return to the travel agent" row (no original exists; Core answers `false` before one exists), "Completion" with Core's `originals` prerequisite and the link to OP-07; "Items": "No original is recorded for this application."; the primary button link "Record an original received" → OP-09n (OP-09 holds no form); "No open custody incident for this application."; freshness "Read at [time] IST". "Cancel" on OP-09n returns to OP-09; nothing is recorded (original count delta 0). | L | UX §5.2, §5.3; PL OP-09; design §2.2, §2.9 item 2; `WP-07.md` F-32; `operations-work.ts:150-151`; `custody.ts:67` |
| WP12-A02 | Operator (OP1, later OP2); test | OP-09 and OP-09i of P after §3 V18-P2, P5, P8, P9, P9a, P9b and R2; renderer test (design U0, U1) | Read the items table of OP-09 and the item, parts, statement and "Shared with" of OP-09i after each step. | The words of design §2.11. OP-09 row: "[item words]: [description]" linked to OP-09i; the grouped part lines; "Only this application" or "With [k] other application(s) of this group"; the text marker "Holder uncertain" while a part's holder is uncertain. OP-09i: the item line derived from the parts (§2.11.3), never from the item-level holder (it follows the last movement and does not change on a return, Q-10); a parts table with "[n]. [label]", the state words and "Holder and place"; "Original reference". "Custody now" counts from `custody`: "Parts not returned: [n]" and "Parts with holder uncertain: [m]"; an expected part is never called held. OP-09i item 7: "The list of earlier receipts, changes and returns of this original cannot be shown here yet. Each record is kept with who made it, when, and its evidence." (partly met: waits for Max's decision on P-18 item 2, J-07). Per step: after P2 both parts "Held by a TravelMudra office: Synthetic office, safe A", the second part named "Old passport, cancelled" (the comma kept), item "Not returned: 2 of 2 parts"; after P5 "Partly returned: 1 of 2 parts returned"; after P8 "Holder uncertain for 1 of 2 parts; 1 returned" (Core's aggregate `uncertain` hides the partial return; the line names both); after P9 part 2 "Held by a TravelMudra office: Synthetic office, safe B"; after P9a part 2 "In transit with a courier: Synthetic courier [stamp]"; after P9b safe B again; after R2 "Returned to the travel agent: every part". | L+T | UX §2.1, §2.2; PL CMP-17, §11.2; BS B30; design §2.2, §2.3, §2.11, §4.3; `WP-12.md` J-07; `facade.ts:49-61`; `custody.ts:17-27, 54-68`; `originals.ts:65-83` |
| WP12-A03 | Test | `test/unit/web/custody-words.test.ts` (design §7.1 U0) | Render every value of `ORIGINAL_STATES`, `ORIGINAL_PART_STATES` and `ORIGINAL_HOLDER_KINDS`, an unknown value of each, every item-line combination of design §2.11.3 (every part returned; some returned; some uncertain with and without returned parts; every part expected; otherwise), an item-level holder that differs from every part, and a linked id outside the reader's list. | Every value has the words of design §2.11; an unknown value falls back with "Reference code: [code]"; the item line follows the parts in every combination; no line uses the item-level holder; a linked id outside the reader's `core.ops_work` renders without name, reference or link; every design §2.14 code has a sentence; no word "Lost", "Damaged", "Missing" or "Destroyed"; "Held" never for an expected part; "Returned" for an item only when every part is returned. | T | design §2.11, §2.14, §7.1 U0; `kernel/vocabulary/operations.ts:67-83`; WP-10 H-06 |
| WP12-A04 | Operator (OP1); test | OP-09i of P after §3 V18-P8 and V18-P9; fixtures with a statement and no uncertain part | Read item 4 of OP-09i after each step. | After P8: "What is not known: SYN: not in safe A on [date]" beside part 2 "Holder uncertain". After P9 no part's holder is uncertain: "Statement recorded when a part's holder became uncertain: SYN: not in safe A on [date]. Every part's holder is known now." The statement never reads as a current uncertainty (Core keeps the last statement and never clears it). The fixtures give the same result. | L+T | UX §2.2; design §2.3 item 4; `originals.ts:78`; WP-06 D-05 |
| WP12-A05 | Test | OP-09, OP-09n and OP-09l with fixtures: a TravelMudra-filed service without a physical route; a preparation-only service | Render the pages; send a saved receipt envelope; send a share into such an application. | No physical route: OP-09 "This service holds no physical originals." and OP-09n Core's blocker `custody_path_not_declared` as CMP-10, no form. Preparation only: "A preparation-only service holds no originals." and the blocker `preparation_only_holds_no_originals`, no form. The saved envelopes are refused with those codes in the design §2.14 sentences; a share into such an application is refused at "Application"; nothing is recorded. The recipe holds no such application (design §6.2), so this item is a test. | T | BS B04, B30; WP10-A03; design §2.1, §2.14; `originals.ts:102-104, 170-171` |
| WP12-A06 | Operator (OP1); harness; test | OP-09i, OP-09 and OP-09t of B after its receipt (§3 V18-S1) | Read OP-09i item 6 and OP-09 item 3. Open OP-09t by its address. Harness: post a return of part 1 with an attestation. | B has one original, so the application's return answer is exact for it (J-04). OP-09i: CMP-10 "Returning originals through TravelMudra is unavailable until the return policy is approved for every application that shares this original. Owner: product owner." with the `unavailableButton` "Record a return" (`aria-disabled="true"`, described by the notice); the custody change and share links stay. OP-09: "Return to the travel agent: Unavailable in this release" with the same notice. OP-09t: items 1 to 3, the same notice and the `unavailableButton` "Record the return"; no form. The post is refused `unavailable_parked` / `parked_custody_route_policy` and answered with the same notice; nothing is recorded (part states unchanged; return count delta 0). No date and no other owner. The run record reads "Unmet: parked return policy (BS B30; PL B-05), owner product owner". Test: the renderers with `returnAvailable` false and one original. | L+T | BS B30; PL §11.3, §13.2 B-05; design §2.2 item 3, §2.3 item 6, §2.6 states, §2.14; `WP-12.md` J-04; `custody.ts:29-52` |
| WP12-A07 | Operator (`operator-3`); SuperAdmin (SA2) | OP-09 and OP-09i of P with the group read grant; OP-09n and OP-09m by their addresses; the old SuperAdmin case pages of P, B and P2 (§3 V18-X1) | Read. | `operator-3`: OP-09 and OP-09i with every fact in the words of A02, the read-grant banner and the line "Only the assigned operator records custody. You can read this application.", no action link; the task pages show the frame, the facts and the same line, with no form. SA2: the old SuperAdmin case page shows the read-only custody summary of the WP-12 row renderer (design §1.6) and no custody control. The posts are A56. | L | UX §2.3; BS B10; PL SH-R09; design §1.6, §2.0; `policy.ts:222` |

### 2.2 Record an original received (`ops.record_original_receipt`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP12-A08 | Operator (OP1) | OP-09n of P (§3 V18-P2) | Open "Record an original received" from OP-09. Read the page from the top. | Design §2.4 in the CMP-25 order. `h1` "Record an original received: [applicant]". Scope with the passport sentence and the identity block "Check a passport against: Name …; Date of birth …; Passport number [full synthetic number]; Issuing country …" (the full number only on this page). "Already recorded for this application" (item lines, or "No original is recorded for this application yet.") with the one-record rule. "The item": "Item type" (text, required, no prefilled value); "Name of the item, not for a passport" (optional); "Description" (required; hint "… Do not type the passport number."); "Parts, one per line" (textarea, required; hint with the disclosed limits "Up to 50 parts of up to 120 characters each" and "A listed part keeps the application from completing until it is returned, and it cannot be removed in this release."); "Parts you hold now, by their line numbers" (text, required; "The other parts are recorded as expected."). No checkbox per part. "Who holds it now": "Holder" radios in a fieldset, none preselected (a TravelMudra office, a TravelMudra staff member, a courier, the authority; no "Holder uncertain", no travel agent); "Where, and with whom" (optional). "Evidence (optional)": rows `evidence.0` to `evidence.4` with the lead "A courier receipt or a parcel label supports the record. It does not show that you hold the item."; "Date you received it" (optional, not in the future). "Your statement" (required, never prechecked): "I hold this original now. A scan, a parcel label or a courier receipt alone is not enough." Effect and review visible before the buttons "Record the original" and "Cancel" (→ OP-09). | L | UX §3.2, §5.3, §7.4; BS B30; PL OP-09; design §2.4, D-W12-05 to D-W12-08; `WP-12.md` J-11; `originals.ts:87-111`; Q-01 |
| WP12-A09 | Operator (OP1); harness; BFF test | OP-09n of P (§3 V18-P2a) | (1) Send with nothing filled. (2) Fill the values of V18-P2 and leave the statement clear; send. (3) Harness, each send changing one value of an otherwise valid form with the statement set: 51 part lines; a line of 121 characters; a description of 201 characters; a place of 201 characters; "1, 2, 3a" as the parts held now; "3" as the part held now with two lines; six evidence rows; an evidence row with only a note; a note that holds an address; a date tomorrow; item type `visa_sticker`; holder `unknown` and `ta` (raw). (4) BFF test: the same values through the handler. | (1) C1 error summary: item type, description, parts, parts held now, holder, statement; nothing recorded. (2) Refused `control_blocked` / `custody_evidence_missing`: "Confirm that you hold it now. A scan, a parcel label or a courier receipt alone is not enough. Nothing was recorded." at the statement; every other value kept; the statement stays clear. (3) Each refused at its field with every value kept, by the BFF (design §2.15: "Up to 50 parts.", "Line [n] has more than 120 characters.", "'3a' is not a part number. …", "Up to 5 pieces of evidence.", the partly filled row at its own index) or by Core (`not_a_part`, `email_like`, `instant_in_future`, `item_type_undeclared`, `holder_not_in_custody`) in the design §2.14 sentences. (4) Every line, every token and every indexed evidence row is read; only a wholly empty evidence row is omitted; nothing is cut or dropped (LD-17, J-06). Nothing is recorded in each case (original count delta 0; no fact). | L ((1) to (3)) + T | BS B30; LD-17; design §2.14, §2.15; `WP-12.md` J-06; `originals.ts:88-111`; `evidence.ts:67-77`; `subjects.ts:61-73` |
| WP12-A10 | Operator (OP1) | OP-09n and OP-09i of P (§3 V18-P2) and of B (V18-S1); OP-02 and OP-07 of P (V18-P4); TA-07 and TA-10 of Y | Record the original with the values of §0.3. Read the receipt, OP-02 and OP-07. Y reads TA-07 of P and TA-10. | 303 to OP-09i; C3 "Original recorded as received" (named: application resource, `originalId` equal to the path original, no `movementId`). Recorded: "Original [reference]" only, from the stored summary (J-08). Current: the item line, the part lines and "Parts not returned: 2", labelled "Current"; no part list presented as what was received at that time; "Recorded once. Sending the same form again does not repeat it."; no accepted time. OP-02 status fact "2 parts not returned" (F-29). OP-07 `originals` "Not met" with "2 parts are not returned to the travel agent (held, in transit or expected)." (E-18). TA-07: no custody fact (A39); TA-10 delta 0. The polite region announces the receipt; focus does not move. B: the same with one part. | L | CMP-08; WP-06 D-02; P-02; design §2.12; `WP-12.md` J-08; `WP-07.md` F-29; `WP-08.md` E-18; `originals.ts:126-151` |
| WP12-A11 | Operator (OP1, OP2, `operator-3`); SuperAdmin (SA2); harness; test | Receipt action | (1) Harness: the content of V18-P2 with a new `_op` (V18-P3); a receipt of D's passport on P2 after B's receipt (V18-S1a). (2) Item type `visa_sticker` (V18-P2a). (3) "3" held now with two lines (V18-P2a). (4) Holder `unknown` or `ta` (V18-P2a, raw). (5) OP2 posts a receipt on B (V18-V1); `operator-3` and SA2 post a receipt on P (V18-X1). (6) Test: a receipt on a completed application. (7) Test: a receipt by the previous operator after a reassignment. (8) Test: a passport receipt for an applicant whose passport details are incomplete. | (1) `conflict_duplicate` / `original_already_recorded`: status 409, OP-09n re-rendered with the values kept and "This item is already recorded for this group, for this or another application. Nothing new was recorded. If it is linked to another application assigned to you, open that application's originals and share it with this application. Otherwise ask a SuperAdmin: sharing across operators is not available in this release."; one original. (2) At "Item type": "This service does not name that item type. …". (3) `not_a_part` at the parts held now. (4) `holder_not_in_custody` at "Holder". (5) OP2: the shell's uniform answer; `operator-3` and SA2: refused as not found; no SuperAdmin page has a receipt control. (6) `application_not_open`: "This application is closed. A new original cannot be recorded for it." (7) The shell (SH-02). (8) `applicant_key_missing` in the design sentence. Nothing is recorded in each case (original count delta 0). | L ((1) to (5)) + T | design §2.14, §4.1; `originals.ts:94-131`; `policy.ts:222`; BS B10 |
| WP12-A12 | Operator (OP1); harness | Receipt, the Nth time (§3 V18-P3) | Replay terms 1 to 5 on V18-P2. Term 2 changes the place. Term 3: press Back after the receipt; harness: a new-key send from the reloaded OP-09n. Term 4: the refusal of A09 (2), then the corrected send. | (1) The same 303 and receipt; one original; one fact `ops.original_received`. (2) Refused as a used form; nothing recorded. (3) Back reloads OP-09n with the item under "Already recorded for this application" before the fields; the new-key send is refused `original_already_recorded` (A11 (1)). (4) Recorded once. (5) C4; no new receipt is offered there. The receipt carries no revision: its stale case is the business duplicate check. | L+T | PL §7 K-STD; BS B35; design §4.1; WP-01 A-02, A-08; WP-09 G-03 |

### 2.3 Record a custody change (`ops.record_original_movement`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP12-A13 | Operator (OP1) | OP-09m of P's original (§3 V18-P8; again at V18-P9a, with no part returned among the choices) | Open "Record a custody change" from OP-09i. Read. Select "Cancel". | Design §2.5. `h1` "Record a custody change: [item words]". Scope "This original only: … The other parts keep their record." Evidence: the parts table with part numbers; the "Shared with" lines when shared. "What happened" (radios in a fieldset, none preselected): "Expected parts arrived", "Parts were sent or handed on", "Parts are now with another holder, or their holder is uncertain", each with its hint. Parts: when exactly one part is not returned (P8: part 2) the text "Part: 2. Old passport, cancelled" and a hidden `parts`; otherwise "Parts, by their numbers" (text, required) with the hint listing the parts not returned. No checkbox per part. "Who holds them now": the four holders and "Holder uncertain" (radios, none preselected); "Where, and with whom" (optional); "What is known and what is not" (needed when the holder is uncertain; Core's limit 500). "Only when parts arrive" (never prechecked) with "Leave it clear for any other change." Evidence rows and "Date it happened" (optional). Effect (visible): "… 'Holder uncertain' opens a custody incident that you own … A returned part cannot change. To hand parts back to the travel agent, record a return instead." Hidden `_rev.original` and `returnTo`. Buttons "Record the change" and "Cancel" (→ OP-09i; nothing recorded). | L | UX §3.2; BS B30; design §2.5, D-W12-05; `WP-12.md` J-11; `originals.ts:189-254`; WP-09 G-03 |
| WP12-A14 | Operator (OP1); harness; test | Arrival of expected parts | (1) Test: "Expected parts arrived" for an expected part with the statement clear. (2) Test: the same with the statement. (3) Harness in §3 V18-P9a: "Expected parts arrived" for part 2 (in transit). | (1) Refused `custody_evidence_missing` with the sentence of A09 (2) at "Only when parts arrive"; the values kept; nothing recorded. (2) Accepted: the part "Held by [holder words]: [place]"; no incident. (3) `part_not_expected` at the parts: "A chosen part is not expected: it was received already. …"; nothing recorded. The recipe holds no expected part (design §6.2), so (1) and (2) are tests. | L ((3)) + T | BS B30; design §2.14; `originals.ts:218-222` |
| WP12-A15 | Operator (OP1, tab 2); harness | OP-09m and OP-09i of P; OP-07 (§3 V18-P9a) | "Parts were sent or handed on", part 2, holder "A courier", place "Synthetic courier [stamp]". Read OP-09i and OP-07. Harness: holder `ta` (raw). | Receipt "Custody change recorded" (A47); Current: part 2 "In transit with a courier: Synthetic courier [stamp]", part 1 "Returned to the travel agent"; OP-07 `originals` "Not met" unchanged; never "Returned" for part 2. The raw send is refused `use_return` at "Holder": "To hand parts back to the travel agent, record a return." with the link to OP-09t; nothing recorded. | L | UX §3.2 ("partial movement"); design §2.14; `originals.ts:212, 223-226` |
| WP12-A16 | Operator (OP1); TA (Y); SuperAdmin (SA1, observation) | OP-09m, OP-09i, OP-09t, OP-02, OP-07 and OP-01 of P; TA-07 of P; SA-01 Monitors (§3 V18-P8) | (1) "Parts are now with another holder, or their holder is uncertain", part 2, "Holder uncertain", no statement; send. (2) Add the statement "SYN: not in safe A on [date]"; send. Read the pages. | (1) Field error at "What is known and what is not": "Say what is known and what is not. It is needed when the holder is uncertain."; values kept; nothing recorded; no incident (custody incident count delta 0). (2) Receipt "Custody change recorded" with Recorded "Change [reference]" and "A custody incident was opened" with its link (from the stored `incidentId`, J-08); Current: the item line "Holder uncertain for 1 of 2 parts; 1 returned" and the part lines. OP-09t: part 2 under "Cannot be returned now: 2. Old passport, cancelled (holder uncertain; record where it is first)". OP-02: "1 part not returned" and "1 part with holder uncertain" (F-29); the docket line "Also needed: trace the original" with its link. OP-07: "Not met" with "The holder of 1 part is uncertain. A part with an uncertain holder is never counted as returned." OP-01: P's row with the custody marker (WP-07 tier 1). TA-07: E-19 "An original document holds completion. TravelMudra does not show custody details here." and no custody detail. Monitors, where shown: custody incidents + 1, parts with unknown whereabouts + 1, lag freshness. | L | UX §2.2, §3.2; BS B30, B33; design §2.5, §2.9, §4.3 ("Holder uncertain on a partly returned item"); `WP-07.md` F-29; `WP-08.md` E-18, E-19; `WP-12.md` J-08, J-12; `originals.ts:211, 242-247`; `derived.ts:200` |
| WP12-A17 | Operator (OP1) | OP-09m and OP-09i of P; OP-07; the incident page (§3 V18-P9) | "Parts are now with another holder…", part 2, "A TravelMudra office", "Synthetic office, safe B". Read. | Receipt; Current: part 2 "Held by a TravelMudra office: Synthetic office, safe B"; the statement as an earlier statement (A04). The custody incident stays open and listed with its link: recording the part as found closes no incident (WP-14). OP-07: "Not met" with `original_held` only. Monitors: parts with unknown whereabouts back to the baseline; custody incidents still + 1. | L | UX §2.2; design §4.3 ("Found again"); `originals.ts:225`; Q-11 |
| WP12-A18 | Operator (OP1, OP2); harness; test | Custody-change action | (1) Harness in §3 V18-P9a: "Parts were sent or handed on", part 1 (returned). (2) Test: "Parts were sent or handed on" for an expected part. (3) Harness in V18-P9a: part 3 (raw). (4) Test: "Expected parts arrived" with "Holder uncertain" and a statement. (5) OP2, harness in V18-V1: a custody change on B's original with `returnTo` = E1. (6) The shared original with two operators: A35. | (1) `part_returned`: "A chosen part was returned to the travel agent. A returned part cannot change in this release." (2) `part_not_received`: "A chosen part has not arrived yet. Record its arrival first ('Expected parts arrived')." (3) `not_a_part`: "Choose parts of this original: …". (4) `holder_not_in_custody`: "Parts that arrived need a known holder." (5) The shell's uniform answer: the original is not linked to E1, so the D-W12-09 re-render does not apply; no fact of B's original shows. Nothing is recorded in each case (part states unchanged; incident count delta 0). | L ((1), (3), (5)) + T | design §2.0, §2.14; `originals.ts:197-226` (a missing statement is refused before the part checks); `policy.ts:524-534` |
| WP12-A19 | Operator (OP1), two tabs; harness | OP-09m of P's original (§3 V18-P9a) | Tab 1: open OP-09m. Tab 2: record part 2 sent to a courier (A15). Tab 1: "Parts are now with another holder…", part 2, "A TravelMudra office", "Synthetic office, safe C"; send. Harness: tab 1's envelope again (raw). | Tab 1: C5 (CMP-14; design §2.13 as amended by J-10): the unsent choices (what happened, part 2, the holder and the place typed) beside the facts read freshly now (part 2 "In transit with a courier: Synthetic courier [stamp]"); "Another custody record of this original was made since you opened the page."; no "you saw" row and no earlier state reconstructed; the typed values stay in the form; `stale_revision`; nothing recorded. The raw resend carries the old revision and is refused `stale_revision` again (H-07 (5a)). | L | UX §3.3; BS B35; CMP-14; design §2.13; `WP-12.md` J-10; `originals.ts:205`; WP-10 H-07 |
| WP12-A20 | Operator (OP1); harness | Custody change, the Nth time (§3 V18-P9b) | Replay terms 1 to 5 on V18-P9b. Term 2 changes the place. Term 3: Back after the receipt; harness: the same change with a new key from the reloaded OP-09m. Term 4: A16 (1), then A16 (2). | (1) The same receipt; one movement fact. (2) Refused as a used form; nothing recorded. (3) Back reloads OP-09m with the current part lines in Evidence; the new-key send records a second movement (Core has no duplicate guard for a holder change; the page claims none and shows the current holder before the button, STOP-W12-06). (4) Recorded once. (5) C4; no new change is offered there. | L+T | PL §7 K-STD; BS B35; design §4.1; WP-09 G-03 |

### 2.4 Record a return to the travel agent (`ops.record_original_return`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP12-A21 | Operator (OP1) | OP-09t of P's original (§3 V18-P5; again at V18-P8) | Open "Record a return to the travel agent" from OP-09i. Read. At P8 read it again. | Design §2.6. `h1` "Record a return to the travel agent: [item words]". Scope naming the travel agent of the application, recorded as the recipient. Evidence: the parts table and "Return policy: approved for this application's originals" (the application-level fact; never named as one original's policy, J-04). Parts: the one-part rule over parts held, received or in transit; otherwise "Parts, by their numbers" (text) with the hint listing them (P5: parts 1 and 2). No checkbox per part. At P8: part 2 under "Cannot be returned now: … (holder uncertain; record where it is first)" and no returnable part, so "No part is held now: …" and no form. Evidence rows (at least one) with the design's lead (examples of accepted kinds, not a list read from the policy); "Date of the return" (optional). Effect (visible): "… A part you do not choose keeps its record and still keeps the application from completing: a partial return stays partial. A returned part cannot be received or changed again in this release." Review; hidden `_rev.original`, `returnTo`; buttons "Record the return" and "Cancel" (→ OP-09i). No "Delivered" or "Sent", and no claim that a courier receipt or a scan proves the return. | L | UX §2.2, §3.2 ("actual owner receipt"); BS B24, B30; PL §7 Record owner receipt; design §2.6; `WP-12.md` J-04, J-11; `originals.ts:258-305` |
| WP12-A22 | Operator (OP1); harness; BFF test | OP-09t of P's original (§3 V18-P5a) | (1) Send with no part and no evidence. (2) Part 1 with one evidence row, External reference `SYN-W12-[stamp]-RET-X`. (3) Harness, each send changing one value of an otherwise valid form: six evidence rows; a row with a kind and a note but no reference; evidence rows at indexes 0, 2 and 4; a note that holds a link; a date tomorrow; "1 x" as the parts; a document reference that is not a current version of the group. (4) BFF test: the same values through the handler. | (1) C1: parts, evidence. (2) Refused `control_blocked` / `custody_evidence_missing`: "The evidence does not show the travel agent's receipt in a way this service's return policy accepts. Add evidence of another kind. Nothing was recorded."; the parts and the row stay (B30: a courier receipt alone does not prove a return). (3) Six rows: "Up to 5 pieces of evidence."; the partly filled row is refused at its own index with its values kept (J-06); the sparse rows all reach Core in order; the link note, the date, "x" and the document reference are refused at their fields. (4) Only a wholly empty row is omitted; nothing is cut or dropped (LD-17). Nothing is recorded in each case (return count delta 0). | L ((1) to (3)) + T | BS B30; LD-17; design §2.14, §2.15; `WP-12.md` J-06; `originals.ts:279-281`; `evidence.ts:53-77` |
| WP12-A23 | Operator (OP1); TA (Y); test | OP-09t, OP-09i, OP-09, OP-07 and OP-02 of P; TA-07 of P (§3 V18-P5, P6); TA sentence fixtures | Return part 1 with the evidence "My statement" `SYN-RET-[stamp]`. Read the pages. Run the TA sentence test. | Receipt "Return to the travel agent recorded"; Recorded: "State after the return: Partly returned …" from the stored `state` only (no part numbers or counts as recorded facts, J-08); Current: part 1 "Returned to the travel agent", part 2 "Held by a TravelMudra office: Synthetic office, safe A", item "Partly returned: 1 of 2 parts returned", "Parts not returned: 1". OP-07: `originals` "Not met: 1 part is not returned to the travel agent …"; OP-02 "1 part not returned". Without an outcome, Core's next action is not `return_original` (the post-outcome step is A42). TA-07: E-19 "An original document holds completion. TravelMudra does not show custody details here."; no custody detail; the item never reads "Returned". Test: E-19 met ("No original document holds completion") and not met for three fixtures (a part held; only expected parts; only an uncertain part); no TA sentence says that TravelMudra holds, received or returned anything. | L+T | UX §12 V18 (clause 1), §2.2; BS B24; design §2.12, §4.3 ("Partial return"); `WP-12.md` J-08, J-12; `WP-08.md` E-19; `derived.ts:199-200`; `test/operations/originals.test.ts` "T-CO61, T-CO62: under a synthetic return policy a partial return keeps the hold and the full return clears it; …" |
| WP12-A24 | Operator (OP1, OP2, `operator-3`); SuperAdmin (SA2); harness; test | Return action | (1) Harness in §3 V18-P7: part 1 again with the current revision. (2) Harness in V18-P8: part 2 while its holder is uncertain; test: an expected part. (3) OP2, harness in V18-V1: a return on B's original with `returnTo` = E1; `operator-3` and SA2 in V18-X1. (4) B (A06) and the shared original (A31). (5) Test: a raw envelope with an older original revision. | (1), (2) `part_not_held` (status 422) at the parts: "A chosen part is not held now (expected, returned, or holder uncertain). Only held or in-transit parts can be returned."; nothing changes. (3) The shell's uniform answer (the original is not linked to E1), or refused as not found. (4) `unavailable_parked` / `parked_custody_route_policy` with the notice. (5) C5 with the current facts. Nothing is recorded in each case (return count delta 0). | L ((1) to (4)) + T | design §2.14, §4.1; `originals.ts:270-289`; `policy.ts:222` |
| WP12-A25 | Operator (OP2); TA (Y); SuperAdmin (SA1); test | OP-09t, OP-09i, OP-07 and OP-02 of P after the reassignment; TA-07 of P; old SuperAdmin case page of P (§3 V18-R2) | Return part 2 with an attestation. Read the pages. | Receipt "Return to the travel agent recorded" with Recorded "State after the return: Returned to the travel agent: every part" (stored `state`); Current: both parts "Returned to the travel agent". OP-09i: "Every part was returned to the travel agent. Its records cannot change." and no custody action. OP-07: `originals` "Met" ("No original holds completion."); the other requirements as Core reports them; the Request completion boundary (LD-04); the application stays open; no "Completed" on any page. TA-07: E-19 "No original document holds completion". The SuperAdmin page shows the same lines. Test: nothing completes by itself when the last prerequisite is met. | L+T | UX §3.1 step 9, §12 V17, V18; BS B24; LD-04; design §2.3 states, §6.3 V18-R2; `WP-08.md` E-19; `WP-12.md` J-12; `test/core/completion-group-end.test.ts` "has no product route, task kind or Core command that checks completion, sends a document email or assigns by itself" |
| WP12-A26 | Operator (OP1); harness | Return, the Nth time (§3 V18-P5, P7) | Replay terms 1 to 5 on V18-P5. Term 2 changes the evidence text. Term 3: Back after the receipt; harness: a new-key return of part 1 from the reloaded OP-09t. Term 4: A22 (2), then V18-P5. | (1) The same receipt; one return fact. (2) Refused as a used form; nothing recorded. (3) Back reloads OP-09t, where part 1 is no longer among the parts that can be returned; the new-key send is refused `part_not_held` (A24 (1)). (4) Recorded once. (5) C4; no new return is offered there. | L+T | PL §7 K-STD; BS B35; design §4.1 |
| WP12-A27 | Test | OP-09i and OP-09t return offers (renderer and command) | Fixtures: one original under a supported policy; one under a parked policy; an application with two originals, one shared under a single-application policy and one single-linked under a supported policy (`custody.returnAvailable` false). Render; send each rendered form to the command. | Returns are offered per original and Core decides each submission (J-04, the interim of this item). One original: the form exactly when `returnAvailable` is true; otherwise the A06 notice and no form. Two originals with the application answer false: the return action and the OP-09t form are offered on each original; the single-linked original's return is accepted; the shared one is refused `parked_custody_route_policy` and the notice re-renders on its page. No text describes the application-level answer as one original's policy. No fixture where Core accepts renders without a form. This replaces design §2.0 and §2.6, which hid both returns. | T | `WP-12.md` J-04 (review R-04); design §4.3 ("Two originals on one application, one shared"); `custody.ts:43-68`; `operations-work.ts:117-118`; WP-10 H-02 |

### 2.5 Share an original with another application (`ops.link_original`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP12-A28 | Operator (OP1); test | OP-09l of B's original (§3 V18-S2); fixtures | Open "Share with another application of this group" from OP-09i of B. Read. Send with no choice. Test: two groups with the same label assigned to one operator; a candidate whose case read is refused; a candidate with an applicant name equal to this applicant's. | Design §2.7. `h1` "Share an original with another application: Passport". Scope "… for another application of this group that is assigned to you." and "This is the passport of Synshare, Dev." "Application" radios (none preselected): P2 "Synshare, Dev · SYN Paper visa with original return · Application [reference]" and P "Synret, Asha · SYN Paper visa with original return · Application [reference]" with the text marker "Different applicant name"; not B itself; E1 absent (OP2's). The group membership of each candidate comes from its `group_id` in its scoped case read, an uncaught read (LD-14), never from equal labels (J-05): in the test, an application of another group with the same label is not offered, and a refused candidate read reaches the shell. The marker warns and never hides; an equal name is not presented as the same applicant (J-01). Effect (visible), with "A share cannot be undone in this release. A passport belongs to one applicant: share it only with another application of the same applicant. TravelMudra does not check the applicant when you share." The empty and 500-row cap lines of design §2.7; the 50-link and target-capacity rules of A93. The empty send: C1 at "Application"; nothing recorded. Safe passport sharing is recorded "Unmet: waits for Max's decision on P-18 item 1". | L+T | UX §3.2; BS B30; design §2.7, D-W12-12; `WP-12.md` Q-W12-04, J-01, J-05 (review R-01, R-05); `originals.ts:156-185`; Q-05 |
| WP12-A29 | Operator (OP1) | OP-09l, OP-09i of B and P2; OP-09 and OP-07 of P2 (§3 V18-S3) | Choose P2. Share. Read the pages. | Receipt "Original shared with another application" (original resource; stored `applicationId`; no `movementId`); Recorded "Shared with application [P2 reference]", with the applicant name only when P2 is in the reader's `core.ops_work` now (read now, not recorded); Current: the "Shared with" lines. OP-09 of P2 lists the item ("With 1 other application of this group"); OP-09i of P2 names B (in OP1's work list) and shows the shared-original line; its return action is the A31 notice. OP-07 of P2: `originals` "Not met". | L | BS B30; design §2.7, §2.12; `WP-12.md` J-08; `originals.ts:179-184` |
| WP12-A30 | Operator (OP1, OP2, `operator-3`); SuperAdmin (SA2); harness; test | Share action | (1) Harness in §3 V18-S3: a share with P2 with a new key. (2) OP2, harness in V18-V5: share the original with E1 (`returnTo` = P2). (3) Test: a share into an application without a physical route; into a preparation-only one. (4) Test: a share with an application of another group; harness in V18-X1: a share of an unknown original id. (5) Harness in V18-S3: a raw envelope with B's original revision from before the share. (6) `operator-3` and SA2 post a share (V18-X1). | (1) `conflict_duplicate` / `duplicate_operation`: "That application already shares this original. Nothing changed." (2) `unavailable_parked` / `parked_custody_route_policy`, status 409: "Sharing this original is unavailable: an application that shares it is assigned to another operator. Sharing across operators is not available in this release. Owner: product owner."; nothing changes. (3) `custody_path_not_declared` or `preparation_only_holds_no_originals` at "Application". (4) Another group: refused `not_found_or_forbidden`; the reader still holds the `returnTo` application and the original is linked to it, so the D-W12-09 rule answers status 409 with the neutral words of A35 and nothing about the target; an unknown original id: the shell's uniform 404. (5) C5 with the current "Shared with" lines. (6) Refused as not found. Nothing is linked in each case (link count delta 0). | L ((1), (2), (4) unknown id, (5), (6)) + T | design §2.0, §2.14; `WP-12.md` J-02; `originals.ts:162-178`; BS B30; PL B-05 |
| WP12-A31 | Operator (OP1); harness | OP-09i and OP-09t of P2 and of B after the share (§3 V18-S3) | Read the return action on both pages. Harness: a return of part 1 from P2's OP-09t address. | On P2 (its only original is the shared one) the return action is the notice of A06 ("… until the return policy is approved for every application that shares this original. Owner: product owner.") with the unavailable button; on B the same. The custody change and share actions stay. The post is refused `unavailable_parked` / `parked_custody_route_policy`; nothing recorded. The run record reads "Unmet: parked shared-item return (BS B30; PL B-05), owner product owner". | L | UX §3.2 ("shared-item policy gaps block affected steps"); BS B30; design §2.3 item 6, §4.3; `custody.ts:43-52` |
| WP12-A32 | Operator (OP1); harness | Share, the Nth time (§3 V18-S3) | Replay terms 1 to 5 on V18-S3. Term 3: Back after the receipt; harness: a new-key share with P2 from the reloaded OP-09l. Term 4: A28's empty send, then V18-S3. | (1) The same receipt; one link. (2) Refused as a used form; nothing recorded. (3) Back reloads OP-09l without P2 among the candidates (already linked); the new-key share is refused `duplicate_operation`. (4) Recorded once. (5) C4. A raw stale envelope → C5 (A30 (5)). | L+T | PL §7 K-STD; BS B35; design §4.1 |
| WP12-A93 | Test | Caps and the read bound (STOP-W12-04) | Fixtures and command tests: an application with 50 originals; an original with 50 links; a share whose target application already holds 50 originals; two concurrent receipts or shares that cross either cap from pages loaded below it. | 50 originals: OP-09 and OP-09n show the CMP-10 "This application has 50 originals, the most that TravelMudra's pages can show. … Owner: TravelMudra." and no receipt form. 50 links: OP-09i and OP-09l show the CMP-10 of design §2.7 and no share form. Target capacity (J-03): OP-09l reads each candidate's original count from its scoped case read and offers no candidate that holds 50 originals. Concurrent submissions: Core accepts the 51st (Core has no cap); the test records that every affected application's read then fails and its pages say "cannot be read now". Cap protection is recorded "Incomplete: waits for Core to refuse the 51st or page the read (STOP-W12-04, P-18 item 3)", not as a pass. | T | design §2.2 item 5, §2.7, §4.5, D-W12-11; `WP-12.md` Q-W12-08, J-03 (review R-03); `contracts/operations-work.ts:190-194` |

### 2.6 SA-03c: custody detail of the reassignment preview (`core.reassign` is WP-06's)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP12-A33 | SuperAdmin (SA1) | SA-03c of P (assigned to OP1; part 1 returned, part 2 held at safe B; an open custody incident owned by OP1) (§3 V18-R1) | Read "What moves and what stays" (WP06-A52). | The custody block of design §2.8 (D-16): `h3` "Originals: they stay where they are", labelled "Current"; per original "Passport: [description]" and the grouped part lines "1 part returned to the travel agent" and "Part 2, Old passport, cancelled: held by a TravelMudra office: Synthetic office, safe B"; no "held by" for the returned part; no item-level holder; "What is not known" only while a holder is uncertain; the lines "Reassignment changes no custody record. Each part keeps its recorded holder and place. The new operator records any later receipt, change or return." The custody incident is listed with the incidents the current operator owns, under the duties that move (WP-06 D-04: current and possibly incomplete). An unavailable read: "Originals cannot be read now. A reassignment never changes a custody record." Never "custody moves" and never the new operator as a holder. When P-10 d is served the page adopts it (S-08). | L | UX §6.3; BS B19; PL SA-03; design §2.8; `WP-06.md` D-04, D-16, Q-W06-01 |
| WP12-A34 | SuperAdmin (SA1); operators (OP1, OP2) | SA-03c receipt; OP-09i of P; the incident page (§3 V18-R1, R2) | Setup: reassign P to OP2 with a reason (WP-06 command). Read the receipt. OP2 opens OP-09i of P. Open the custody incident. | The `reassigned` receipt's current facts carry the same custody lines as the preview (D-16; delta 0 in every part's state, holder and place). OP2: OP-09i of P with the same part lines and the return action for part 2. OP1: the shell for P (A95). The custody incident's owner is OP2 (observe; WP-14). The SuperAdmin page shows the same lines. No "transferred" or "moved" custody word. | L | UX §5.4 ("custody remains at its evidenced holder"), §12 V18 (clause 2); BS B19; design §6.3 V18-R1, R2; `WP-06.md` D-16; `assignment.ts:6-11, 248`; `test/core/assignment-holds.test.ts` "reassigns: duties move, the previous operator is denied, readiness becomes the previous operator’s, acts and custody stay" |
| WP12-A35 | SuperAdmin (SA1); operators (OP1, OP2); harness; test | SA-03c of P2; OP-09i of P2 (OP2) and of B (OP1); OP-09m of B (§3 V18-V2 to V18-V6) | Read the preview of P2; Setup: reassign P2 to OP2. OP2 reads OP-09i of P2 (V3). OP1 opens OP-09i of B and records a holder change of part 1 (V4). Harness: OP2 shares with E1 (V5). Setup: reassign P2 back to OP1; OP1 records the change again (V6). Run the BFF tests of the 409 rule. | Preview (design §2.8 items 2 and 4; Q-W12-10): "Shared with 1 other application of this group: Application [B reference]" linked to its SuperAdmin page (no name composed) and the conditional sentence "Custody of a shared original can be recorded only while one operator is assigned to every application that shares it. If the new operator is not the operator of each application listed above, nobody can record that original's receipt, change or return until a SuperAdmin assigns them to one operator. …"; no operator of B is named. After V2: OP2's OP-09i of P2 shows the item and parts and B only as "Another application of this group, not among your open applications" (no name, reference or link). OP1's OP-09i of B still offers "Record a custody change": discovery is refusal-driven; no page computes the split. OP1's send is refused by Core; the BFF reads `core.ops_case` and `ops.case_work` of `returnTo` again with uncaught reads; both answer, OP1 is assigned to B and the original is still linked to B, so OP-09m re-renders with status 409 (never 404), the typed values kept, and the neutral words "This request could not be completed for you now, or its earlier result cannot be shown to you. Request reference [key]." (J-02), which MAY be followed by the general rule of OP-09i item 5; never "Nothing was recorded" and never a claim about which application is assigned to whom. Custody facts unchanged (delta 0). V5: A30 (2). V6: accepted, "Custody change recorded" (the recovery route). BFF tests: the 409 answers only under that condition; every other refusal reaches the shell (A95). The run record reads "Unmet: parked shared-item policy, owner product owner". | L+T | UX §12 V18 (clause 3), §5.2; BS B19, B30; design §2.0 (D-W12-09), §2.8, §4.3, §6.3 V18-V2 to V6; `WP-12.md` Q-W12-02, Q-W12-10, J-02, J-11; `policy.ts:524-534` |
| WP12-A36 | Test | The SA-03c custody block renderer (`test/unit/web/assignment-pages.test.ts`, design §7.1 U5) | Fixtures: no original; held; an expected part; in transit; uncertain with a statement; a statement with no uncertain part; partly returned; every part returned with the item-level holder still `tm_office`; shared; 50 originals; `ops.case_work` unavailable; an access refusal between the case read and the custody read. | The words of A33 and A35 for each state; grouped part lines; no item-level holder in any fixture (a returned item never reads "held by"); the conditional sentence only for a shared original; the unavailable words for the outage; the access page for a refusal, without the facts read before (LD-14); never "No original is recorded for this application" when the read failed; the receipt's current lines equal the preview's. | T | LD-14; WP-06 D-04, D-16; design §2.8, §7.1 U5 |
| WP12-A37 | Operator (OP1); harness; test | Reassignment race (§3 V18-R1) | Before the reassignment of P, OP1 opens OP-09t of P in a tab. SA1 reassigns P to OP2. OP1 sends the open form. Test: the same for a receipt, a custody change and a share. | OP1's send is refused; the fresh reads of P now refuse OP1 (P is not assigned to OP1), so the shell answers (SH-02), never the 409 of A35; nothing recorded (part states unchanged). OP1's next read of OP-09i of P gives SH-02; no custody fact or form from the earlier read shows. | L+T | WP-09 G-09; BS B19 ("revokes old action authority"); design §4.4; `common.ts:46-49`; `test/operations/access.test.ts` "after a reassignment the previous operator is refused and the new operator holds the incident duties; a suspended operator is refused" |
| WP12-A94 | Operator (OP1); harness; test | OP-09m of B; the replay of §3 V18-V2a in V18-V4a | V2a: OP1 records a holder change of part 1 of the shared original (accepted); the harness keeps the request. V2: P2 is reassigned to OP2. V4a: the harness sends the V2a request again with the same `_op` and the same content. Test: the same for a share and a return, and a replay after the reassignment back. | The kernel authorizes the replay again under current access and refuses it; the fresh reads show that OP1 still holds B and that the original is linked to B, so OP-09m answers status 409 with the neutral words of A35 and the original request reference (the V2a key); never "Nothing was recorded" (the V2a movement is committed) and no claim about the cause. The movement count stays one for V2a (delta 0 after V4a). The test records what the operation status page of that key shows and asserts that no page says that nothing was recorded. | L+T | BS B35; design §2.0 (D-W12-09); `WP-12.md` J-02 (review R-02) |
| WP12-A95 | Operator (OP1); harness; BFF tests | The D-W12-09 rule against genuine access changes (§3 V18-R1, R2) | Live: after V18-R1, OP1 opens OP-09i of P; harness: OP1 posts a custody change on P's original with `returnTo` = P. Tests: the reader's own application reassigned; the read grant ended; the session ended; the operator suspended; the original no longer linked to `returnTo`; `returnTo` naming another application or invalid; a fresh read refused or unavailable. | Each case reaches the shell (SH-02, sign-in, maintenance or the uniform 404), never the 409 of A35, and shows no earlier fact. The 409 re-render happens only when both fresh reads answer, the reader is assigned and the original is still linked to `returnTo`. Live: OP1 gets SH-02 on P's page and on the post; nothing recorded. | L+T | LD-14; BS B10; design §2.0 (D-W12-09), §4.4; `WP-12.md` Q-W12-02, J-11 (review R-11) |

### 2.7 Visibility, the travel agent and the SuperAdmin

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP12-A38 | Operator (OP2); harness | OP-09 of E1; B's OP-09 and the E1 item address; OP-09i of P2 and B's OP-02 (§3 V18-V1, V3) | V1: read OP-09 of E1; open B's OP-09 and `/ops/applications/<E1>/originals/<B's original>`; harness: a receipt on B; a custody change and a return on B's original with `returnTo` = E1. V3: read OP-09i of P2; open B's OP-02. | E1: "No original is recorded for this application." B's OP-09 and the E1 item address: SH-02 (B is not assigned to OP2; the original is not linked to E1). Each post: the shell's uniform answer, no 409 (the original is not linked to the reader's application). V3: P2's page names B only as "Another application of this group, not among your open applications"; B's OP-02: SH-02. No response shows OP2 a fact of B's application beyond the shared original linked to P2. Nothing is recorded. | L | UX §12 V18 (clause 3), §5.2; BS B10, B30; design §2.0 ("Visibility"), §4.3; `policy.ts:524-534` |
| WP12-A39 | TA (Y); `syn-ta-2`; test | TA-07 of P, B, P2 and E1 at each Part of §3; TA-07x; TA-10 | Read the section "Original documents", the completion rows, the next-action words and the history. `syn-ta-2` opens TA-07 of P. Run the tests. | Each: the section of design §2.10 with "Originals this service uses: Passport" and the CMP-10 "Custody details of originals are not shown to travel agents in this release: … Owner: product owner." Completion rows in the E-19 words only: "An original document holds completion. TravelMudra does not show custody details here." or "No original document holds completion"; never "TravelMudra still holds …" or "No original document is held". Next-action words for `return_original` by reason (design §2.10 item 3; test). At no step does a TA page show an original id, description, part label, holder, place, statement, incident or movement; TA-07x has no custody line; TA-10 delta 0. `syn-ta-2`: the uniform not-found page. Tests: the TA sentences for held, expected-only and uncertain-only fixtures; no TA renderer shows a custody detail from a fixture with every custody fact set. | L+T | UX §2.3; BS B30; design §2.10, §7.1 U3; `WP-08.md` E-19; `WP-12.md` J-12; `contracts/core.ts:274-279`; `test/system/ta-documents-originals.test.ts` "shows the originals a service holds and the parked custody state, never a custody detail; a service without originals has no section" |
| WP12-A40 | SuperAdmin (SA2); test | Old SuperAdmin case pages of P, B and P2; a fixture whose operator is suspended after the outcome | Read. Test: render the case of an application with parts not returned and no active operator. | The read-only custody summary (design §1.6) in the words of A02 and no custody control. With no operator assigned, Core's pending owner is "SuperAdmin" with the next action `return_original`; the page offers the route to assign an operator (SA-03a or SA-03c) and no custody form (UX §2.3; Q-12). | L+T | UX §2.3, §6.1; BS B24; design §1.6; `derived.ts:413-416`; `policy.ts:222` |

### 2.8 OP-02, OP-07 and OP-01 (pages of WP-07 and WP-08)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP12-A41 | Operator (OP1, OP2); test | OP-02 of P, B and P2 at each Part of §3 | Read the status facts and the "Delivery & originals" tab. | Status fact "Originals" (F-29) when originals exist or the counts are above zero: "[n] parts not returned" and, on its own line, "[m] parts with holder uncertain" (each only above zero); "Every part returned to the travel agent" when originals exist and both counts are zero; never "held" for the count. The tab (F-32): section "Originals" with the facts of OP-09 item 3 and the link "Open the originals" → OP-09; no custody form. Test: counts (0, 0) with and without originals, (2, 0) with one part expected, (1, 1). | L+T | UX §2.2; PL CMP-03; design §2.9 items 1 and 2; `WP-07.md` F-29, F-32; `custody.ts:54-68` |
| WP12-A42 | Operator (OP1); test | OP-02 docket of P (§3 V18-P8); the OP-02 action panel with post-outcome fixtures (§3 V18-T1) | Read the docket at P8. Test: render the action panel for `return_original` with `original_held` and with `parked_custody_route_policy`, before and after a reassignment, and with no operator. | P8: "Also needed: trace the original" with its link (one incident: the incident page; several: OP-09). Test (F-31): `original_held` → owner "You" (only when Core names the reader), step "Return the original to the travel agent", action "Open the originals" → OP-09; after a reassignment the owner is the new operator; `parked_custody_route_policy` → blocker type "Unavailable in this release", CMP-10 "Returning originals through TravelMudra is unavailable until the return policy is approved. Owner: product owner.", the secondary link "Originals" → OP-09, no primary action; no operator → "Waiting on SuperAdmin". The panel predicts no completion. | L ((P8)) + T | UX §5.4, §7.4; design §1.8 AM-W12-04, §2.9 item 5, §6.1, §6.3 V18-T1; `WP-07.md` F-31; `derived.ts:413-416`; `case.ts:72` |
| WP12-A43 | Operator (OP1, OP2); test | OP-07 of P at §3 V18-P4, P6, P8, P9 and R2; OP-07 of P2 after V18-S3; fixtures | Read the `originals` row. | E-18: Core's state with the detail sentences of design §2.11.4 by code ("[n] parts are not returned to the travel agent (held, in transit or expected)."; "The holder of [m] parts is uncertain. A part with an uncertain holder is never counted as returned."; met: "No original holds completion."); owner "You" only when Core's pending answer names the reader, otherwise "The assigned operator"; the parked boundary when Core's pending answer names `parked_custody_route_policy`; "Where" → OP-09. Never "Not applicable yet" while Core reports a blocker (E-05); "Met" only when Core reports it. Test: an expected-only fixture and an uncertain-only fixture. | L+T | UX §3.1 step 9; BS B24; design §2.9 item 6, §2.11.4; `WP-08.md` E-05, E-06, E-18; `derived.ts:199-200` |
| WP12-A44 | Operator (OP1, OP2); test | OP-01 of OP1 and OP2 at each Part of §3; post-outcome fixtures (§3 V18-T1) | Read P's, B's and P2's rows and the view counts (deltas from P-0). Run the view and count test. | Rows follow WP-07's mapping with Core's owner and words; the open custody incident puts P in "Action now" at P8 (tier-1 marker); after a reassignment the row moves to the new operator. Test (F-30, Q-W12-06): a post-outcome row with `parked_custody_route_policy` sits in "Delivery and closure" with the owner label "Unavailable in this release: return of originals", no marker, not counted; a row with `original_held` stays in "Action now" and is counted; the view, the count and the page agree. Lag freshness. Never "Ready". | L+T | UX §5.2, §5.4; design §1.8 AM-W12-03, §2.9 item 4; `WP-07.md` F-07, F-16, F-30; `test/unit/nav-counts.test.ts` |
| WP12-A45 | Test | Withdrawal and group end with originals (§3 V18-T1) | Fixtures and Core tests: an application with parts not returned and the outcome `withdrawn`; another application's withdrawal; the group end. | After the withdrawal the application stays submitted and assigned; OP-09 shows "An outcome is recorded: Withdrawn. Parts that are not returned still need their return; the application completes only after that." and keeps every action Core allows (a passport that arrives after the withdrawal can still be recorded, then returned); OP-07 `originals` "Not met"; Core's next action `return_original` (A42). Another application's withdrawal leaves an original's custody (T-CO62). Group end never ends an application with parts not returned or uncertain. The recipe records no outcome (design §6.1), so this item is a test. | T | UX §3.2 ("Return duties can outlive withdrawal"); BS B24, B25; design §2.2 states, §4.3; `withdrawal.ts:8-9`; `derived.ts:257-259`; `test/operations/originals.test.ts` T-CO61, T-CO62; `test/core/completion-group-end.test.ts` |

### 2.9 Command results, access and shell on WP-12 pages

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP12-A46 | Operator; SuperAdmin; TA | OP-09, OP-09i, OP-09n, OP-09m, OP-09t, OP-09l; SA-03c; TA-07 | Read the shell. | Environment label; "[TEST]" title prefix; rail current item "My work" (or "Applications" with `from=applications`); the breadcrumbs of design §1.4 ("My work › [applicant] › Originals", "… › Originals › [item words]", "… › Record an original received", "… › Record a custody change", "› Record a return", "› Share"); the OP-02 frame items 1 to 5 and no tabs; one `h1`; "Read at [time] IST". No rail destination "Originals" (D-W12-01; STOP-W12-01, P-18 item 4). | L | PL §2.1, §2.2; WP01-A07; design §1.4 |
| WP12-A47 | Operator; harness | Every accepted WP-12 command; edited receipt addresses | Read each receipt. Open edited addresses: a `returned` done code with a movement key; a `linked` done code with a receipt key; a receipt done code with another application's key. | Titles and summary tests of design §2.12: receipt (application resource; `originalId` equal to the path original; no `movementId`) → "Original recorded as received"; movement (original resource; `movementId`; no `state`) → "Custody change recorded"; return (`movementId` and `state`) → "Return to the travel agent recorded"; share (`applicationId`; no `movementId`) → "Original shared with another application". Recorded facts only from stored summary fields (J-08): "Original [reference]"; "Change [reference]" and, with `incidentId`, "A custody incident was opened" (never "is open"); "State after the return: [words of `state`]"; "Shared with application [reference]". Counts, part lines and item lines are "Current". Receipt facts never come from the `done` code or the form. An edited address never shows another command's title; another application's key: "Request reference [key]. The receipt cannot be checked now." No accepted time (P-02). | L+T | WP-06 D-01, D-02; WP-01 A-04; WP-09 G-01; design §2.12; `WP-12.md` J-08 (review R-08); `originals.ts:47-49, 151, 184, 253, 304` |
| WP12-A48 | Operator (OP1, OP2); test | Receipt addresses of §3 V18-P2, P5 and P8, opened by OP1 at V18-P9b and by OP2 at V18-R2 | OP1 opens the three addresses again at P9b. After R2, OP2 opens the P5 address. Test: the same pairs with fixtures. | OP1 (the original actor; access still valid): each receipt keeps its recorded facts ("Original [reference]"; "State after the return: Partly returned …"; "Change [reference]" with "A custody incident was opened") and shows the current lines labelled "Current" (part 2 now at safe B); no "trace the original" or "return" instruction. OP2: the operation lookup answers the caller's own requests only, so OP2 gets the unchecked receipt "Request reference [key]. The receipt cannot be checked now." with the facts OP2 may read now (P's current custody lines) and no recorded fact of OP1's request (J-09). After R1, OP1's requests for P's pages give SH-02. No receipt or status read tells anyone to act from an older state. | L+T | `WP-07.md` F-01, F-33 (class); WP-09 G-10; `WP-12.md` J-09 (review R-09) |
| WP12-A49 | Operator | Each command of §1.2 with a lost acknowledgement (fixture); a refused send | Inject the fault. Open the operation status page. Select "Check status" after the original resolves. Open the status page of a refused send's key. | C4 (CMP-13) "Checking the original result" and "Check status"; no new send of the same intent is offered there. "Check status" reads the same operation and shows its accepted result. A refused send leaves no operation record: "Nothing is recorded for request [reference] so far". A refusal, and any stale comparison, shows only on the re-rendered form. | T | PL §1.1 UNR; BS B35; WP-01 A-08; WP06-A104 |
| WP12-A50 | Harness | Each command of §1.2 | (1) Identical replay after acceptance. (2) Same key, changed content. (3) Business duplicate: a new key with the current page's facts. (4) Raw stale envelope: a new key with an older page's original revision. (5a) Raw resend of a refused envelope after the facts changed. (5b) Corrected submission from a freshly loaded page after the facts changed. (6) Identical replay after access to a sharing application changed (A94). | (1) The original result; no second original, movement, return, link or incident. (2) Refused as a conflict; nothing recorded. (3) Receipt `original_already_recorded`; share `duplicate_operation`; return `part_not_held`; arrival `part_not_expected`; another custody change: a second record (no guard; claimed by no page). (4) Movement, return and share: `stale_revision`, CMP-14 with the current facts; the receipt carries no revision, so its stale case is the business check. (5a) The refused key has no record, so Core evaluates the envelope again against its own revision: where the original's revision moved, it is refused `stale_revision`; where it carries no revision (a receipt refused for a clear statement), the business check decides it. (5b) The form of a freshly loaded page carries the current revision and is decided on the current facts (H-07). (6) The replay is authorized again under current access; the page states no result it cannot show and never that nothing was recorded (A94). A duplicate test uses (3), never (4) or (5a). Browser Back is not a replay. | T | WP-06 D-12; PL §7 K-STD; BS B35; `WP-10.md` H-07; `WP-12.md` J-02 |
| WP12-A51 | Operator; SuperAdmin | Every refusal reachable on `lane-ui` in §2.1 to §2.8 | Read each message. | CMP-07 with the reason in words and the owner or route where one exists. Never a code alone, except the UAT-13 fallback. No "Something went wrong", "Invalid data" or "A requirement of this item is not met." | L | PL §1.1 REJ, §11.1; CR-01 |
| WP12-A52 | — | Text map of every reason code that the WP-12 pages can show (`words.ts`, design §7.1 U0) | Check the map against Core's vocabulary (unit test). | Each code of design §2.14 has its sentence: `original_already_recorded`, `custody_path_not_declared`, `preparation_only_holds_no_originals`, `application_not_open`, `custody_evidence_missing` (receipt, arrival, return), `applicant_key_missing`, `parked_custody_route_policy` (return, share), `duplicate_operation`, `stale_revision`, `conflict_operation_key`; the field codes `item_type_undeclared`, `required` (label, statement), `holder_not_in_custody`, `not_a_part`, `part_not_expected`, `part_not_received`, `part_returned`, `part_not_held`, `use_return`, `evidence_kind_unknown`, `evidence_version_not_usable`, `invalid_id`, `email_like`, `url_like`, `instant_invalid`, `instant_in_future`; the D-W12-09 re-render in the neutral words of J-02; `original_held` and `custody_evidence_missing` in the completion sentences of design §2.11.4; the next action `return_original` per reason (WP-07 F-13 class). An unknown code shows the category text and "Reference code: [code]". `access_denied` outside the D-W12-09 rule renders SH-02 or the uniform not-found page, never a text. | T | CR-01; UAT-13; design §2.11.4, §2.14; `WP-12.md` J-02 |
| WP12-A53 | Operator | OP-09, OP-09i, OP-09n, OP-09m, OP-09t, OP-09l, SA-03c (HTTP tests) | (1) Let `ops.case_work` fail for availability on each page. (2) Let `core.ops_work` fail on OP-09i and OP-09l. (3) Separately: revoke access, end the session, close the installation or start a support view between the page's first read and a later read. | (1) OP-09 keeps the frame with "Originals cannot be read now. Nothing is shown in their place." and OP-09i with "This original cannot be read now.", with no action; each task page keeps the frame with CMP-10 "This step cannot be prepared now: the originals cannot be read. Try again later. Owner: TravelMudra." and no form (F-04, H-05 class); SA-03c as A33. (2) OP-09i: "Shared with [k] other application(s). Their details cannot be read now."; OP-09l: "Your applications cannot be read now, so no application can be offered." and no form. (3) The access page (SH-02, sign-in or maintenance), never the facts read earlier. The mandatory reads of the D-W12-09 rule are never caught. No page code catches every error around a read. | T | LD-14; `WP-07.md` F-04; `WP-10.md` H-05; design §2.0; `test/unit/bff-access-change.test.ts` (pattern) |
| WP12-A54 | TA; operator; SuperAdmin | Every WP-12 page; the SuperAdmin pages of P, B and P2 | Look for controls of the other roles. | TA pages: no custody control. SuperAdmin pages (SA-03c included): no receipt, custody change, return or share control; facts only. Operator pages: custody action links only on the reader's own assigned applications, by the facts rule of design §2.0; on a shared original whose sharing applications have different operators the links stay (discovery is refusal-driven; no page computes the split, A35). A read-grant reader sees no action link. | L | BS B18; UX §2.3; PL §11.1; design §2.0; `WP-12.md` Q-W12-02, J-11; `policy.ts:222` |
| WP12-A55 | TA; operator; SuperAdmin | Every WP-12 page | Read all visible text. | The words of design §2.11 and §2.14; no forbidden label of PL §11.1 ("Override", "Admin override", "Approved" or "Done" as an overall status, "Ready" as a universal state, "Force complete"); no "Lost", "Damaged", "Missing" or "Destroyed"; no "Delivered" or "Sent" for a return; no claim that an assignment, a reassignment, a scan, a parcel label or a courier receipt moves, possesses or returns an original; "Held" never for an expected part; "Returned" for an item only when every part is returned; no item-level holder. Disclosed contract limits MAY be stated (50 parts of 120 characters; 200 and 500 characters; five evidence rows; 50 originals per application and 50 links per original as the read limit). No other configuration value, such as the list of accepted return evidence kinds, is stated as read when no read returns it. Times carry IST; counts name their unit; synthetic data carries the synthetic label. | L | PL §11.1, §11.2; BS B30; CR-03, CR-06, CR-07, CR-08; WP-01 Q-13; WP-08 E-12; design §2.0 "Copy"; `WP-12.md` J-11 |
| WP12-A56 | Operator (`operator-3`); SuperAdmin in a support view of OP1 (test) | Posts as `operator-3` (§3 V18-X1); the `/ops` pages in a support view | Harness: post a receipt on P, a custody change, a return and a share on P's original as `operator-3`. Test: start a support view of OP1; open OP-09 and the task pages; post each command. | Each `operator-3` post is refused as not found (the shell; `operator-3` is not assigned, so no 409); nothing recorded; the read-only pages of A07 stay. Support view: the `/ops` pages answer 409 (`support_view_active`); each post is refused with the support-view refusal; nothing recorded. | L (grant) + T (support view) | UX §2.3; BS B10; PL SH-R09, SH-R10; design §2.0 |
| WP12-A57 | Operator | OP-09, OP-09i, OP-09n, OP-09m, OP-09t, OP-09l | Inspect `localStorage`, `sessionStorage` and IndexedDB after use. Read the response headers. | No description, part line, typed part number, place, statement, evidence reference or chosen application is kept in browser storage. Signed-in pages send `no-store`. | L+T | PL §2.3 SH-R12 |
| WP12-A58 | — | The WP-12 host pages and the former hosts | Run `test/unit/web/originals-host-pages.test.ts` (design §7.2). On `lane-ui` open OP-02 (every tab) of P and the old operator and SuperAdmin case pages. Run the route test. | The actions POST `/ops/applications/:id/originals`, `/ops/originals/:org/movements`, `/ops/originals/:org/return` and `/ops/originals/:org/link` each appear as a form action on exactly one renderer: OP-09n, OP-09m, OP-09t and OP-09l. OP-02, OP-07, OP-09, OP-09i and both old case pages hold none of them and show links or read-only facts instead (register CC-16). Every other carried form keeps its markup, fields, action and success redirect. The carried-form test entries of WP-07 for the originals forms are removed; the system tests of design §7.3 read the new pages. Six new GET routes are in the inventory; the four POST rows keep id, path, action and command; every rendered form action is a registered route. A success answers 303 to OP-09i of the `returnTo` application. | L+T | LD-02, LD-03, LD-07; CC §6 CC-12 to CC-14, CC-16; design §1.5, §1.6, §7.2, §7.3; WP06-A110 |
| WP12-A59 | `syn-ta-2`; operator (OP2); SuperAdmin | TA-07 of P; B's OP-09, OP-09i and task pages as OP2 (§3 V18-V1); ids of another application or group in the original and application paths | Open each. | `syn-ta-2`: the uniform not-found page. OP2 (not assigned to B): SH-02 on B's pages. An original id of another application or group, or an unknown one, in an OP-09i or task path: the uniform 404 (an item is reachable only through an application it is linked to). No fact of P, B, P2 or E1 shows to anyone outside its scope. | L | BS B10; UX §2.3; design §1.3 |
| WP12-A60 | Test | The four custody handlers (`test/unit/bff-originals.test.ts`, design §7.1 U2) | Send forms with: 50 and 51 part lines; a 120- and a 121-character line; a comma inside a part name; CR LF and LF line breaks with empty lines; descriptions, places and statements at and over Core's limits; part numbers "1 2", "1, 2", "50", "51", "3a", "01"; six evidence rows; rows at indexes 0, 2 and 4; a row with only a note; a row with a kind and a note but no reference; a wholly empty row. | Every field is read whole; every part line and every token reaches the check; a comma stays inside its part name; empty lines are dropped; every indexed evidence row is read, in order, at any index; only a wholly empty row is omitted; a partly filled row is refused at its own index with its values kept (J-06); input over a limit is refused at its field with every value kept and no command sent; a token that is not a whole number from 1 to 50 is refused and named. The movement, return and share handlers re-render their task page after a refusal (today they answer the error page). | T | LD-17; `WP-10.md` H-04; design §2.15; `WP-12.md` J-06 (review R-06); `case-work.ts:446-456, 566-584` |

### 2.10 Accessibility (AC-01 to AC-28 that apply)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP12-A61 | Keyboard-only operator and SuperAdmin | §3 steps V18-P2, P5, P8, S3 and R1 at 1440 px; V18-P2 and P5 at 390 px | Use the keyboard only. | Every step works with Tab, Shift+Tab, Enter, Space and Escape: the receipt (text fields, the parts textarea, the line-number field, holder radios, evidence rows, the statement), the custody change (kind and holder radios, the number list or the one-part text, the statement), the return (number list, evidence rows), the share (application radios), the SA-03c preview. No action needs a mouse, hover or drag-and-drop. | L | AC-01, AC-12; design §4.6, §5 |
| WP12-A62 | Keyboard-only user | Every WP-12 page at 1440 and 390 px and at 400% zoom | Tab through the page. | Focus is visible (at least 3:1) and never hidden by the top bar, the rail or a bottom action area. | L | AC-02 |
| WP12-A63 | Phone user | OP-09, OP-09i, OP-09n, OP-09m, OP-09t, OP-09l, SA-03c custody block | View at 320 px, and at 1280 px with 400% zoom. | No two-dimensional page scrolling. The parts table scrolls only inside a labelled region, or becomes cards. Identity, state, holder and next action come before secondary data. On the task pages scope and effect come before the fields; the primary action is at the end of the form, never in a fixed bar. | L | AC-04, AC-21; UX §7.3 |
| WP12-A64 | Any | Every WP-12 form | Inspect each input. | Each input has a visible label; the radio groups `holder.kind`, `toHolder.kind`, `kind` and `applicationId` sit in fieldsets with legends, none preselected; the part lists are a textarea (receipt, one part per line) and text fields of numbers, each with a visible hint that states the rule and the parts it may name, and an error that names the line or the token; the one-part rule shows the part as text; the statements are checkboxes never prechecked; each evidence row labels its kind, reference and note; required fields say that they are required; optional fields say "optional". | L | AC-05, AC-15; design §5 |
| WP12-A65 | Any | Part and item states, markers, boundaries | View in greyscale. | Each state has text; the markers "Holder uncertain" and "Different applicant name" are text with an icon. No state is shown by colour alone. | L | AC-06; design §5 |
| WP12-A66 | Any | Every WP-12 form | Send each form with an error. | Focus moves to the error summary; each link moves focus to its field; entered values stay (text, part lines, typed numbers); chosen kinds, holders and applications stay chosen; evidence rows stay filled at their indexes; the statements stay clear (the operator states possession again, design §2.0). | L | AC-08; CMP-07; WP-09 G-07 |
| WP12-A67 | Screen-reader user | Receipts (with the incident line); the parked and shared boundaries; the "not returned" counts | Read with VoiceOver or NVDA. | Receipts are announced politely without moving focus. Boundaries and blockers are read before the controls they concern. The counts are read with their unit. | L | AC-09, AC-16 |
| WP12-A68 | Screen-reader user | Each unavailable action: the return on B ("Record a return" on OP-09i, "Record the return" on OP-09t, A06), the return on P2 (A31), a part under "Cannot be returned now" (A21 at V18-P8), the caps (A93); the 409 re-render of A35 | Focus the control or the notice; send the A35 form. | The reason is exposed (`aria-describedby`, or the notice in reading order); each `unavailableButton` has `aria-disabled="true"`. A role-forbidden action is not shown at all. A shared original with two operators removes no control (A35): after the send, focus moves to the error summary, which holds the neutral words. | L | AC-08, AC-13; CMP-10; PL §2.3 SH-R08; design §5 |
| WP12-A69 | Phone user | Every WP-12 page at 390 px | Measure each control. | Every control is at least 24 × 24 CSS px. Primary actions ("Record an original received", "Record the original", "Record the change", "Record the return", "Share the original") are at least 44 × 44 CSS px. Radio and checkbox labels are part of their targets. | L+T | AC-10 |
| WP12-A70 | — | Every WP-12 page | Measure contrast of text, focus, state text and notices. | Normal text at least 4.5:1. Non-text indicators and focus at least 3:1. | L+T | AC-11 |
| WP12-A71 | Any | Long texts; reduced motion | Use a 60-character surname and given names, a 200-character description, part labels of 120 characters, a 200-character place and a 500-character statement. Turn on "reduce motion". | Names, labels, places and statements wrap without hiding identity; a truncated text has a full form that keyboard and touch reach. No transition plays. | L | AC-14, AC-20 |
| WP12-A72 | Operator and SuperAdmin (observation) | OP-09i of P at §3 V18-P8 and after V18-R2; SA-03c of P before V18-R1 | Ask OP1 at P8 and OP2 after R2 "Who holds the old passport now, and was anything returned?", and SA1 on the preview "Does reassigning this application move the passport?". | The run record reports the answers and the sample size; confusion of an expected part with a held one, of a partial return with a full one, of an uncertain holder with a return, or of a reassignment with a custody move is a finding. No pass target (observation only). | L | AC-24, AC-26; UX §12 (usability) |

### 2.11 axe checks (WCAG 2.2 A/AA)

Rule for every row: run axe (`@axe-core/playwright` 4.13.0, tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`,
`wcag22aa`) at 1440 × 900 and at 390 × 844. Expected: no violation of impact "serious" or "critical" at either width.
Record the counts of minor and moderate violations. The harness takes no screenshot of a page that shows a real
person's data; WP-12 uses synthetic data only. The texts that WP-12 amends on OP-02, OP-07 and OP-01 are covered by
the axe rows of their own packages; the V18 run records their counts as an observation.

| ID | Persona | Page (state) | Where | Source |
|---|---|---|---|---|
| WP12-A73 | Operator | OP-09 of P: no original, the "Record an original received" link (V18-P1; A01) | L | UX §7.5; AC-01 to AC-28 |
| WP12-A74 | Operator | OP-09n of P: the form with the identity block (V18-P2; A08) | L | same |
| WP12-A75 | Operator | OP-09n with the error summary and the statement refusal (V18-P2a; A09) | L | same |
| WP12-A76 | Operator | OP-09i of P with the receipt (V18-P2; A10) | L | same |
| WP12-A77 | Operator | OP-09n re-rendered 409 "already recorded" (V18-P3; A11 (1)) | L | same |
| WP12-A78 | Operator | OP-09t of P: the form (V18-P5; A21) | L | same |
| WP12-A79 | Operator | OP-09t after `custody_evidence_missing` (V18-P5a; A22) | L | same |
| WP12-A80 | Operator | OP-09i of P: partly returned, with the return receipt (V18-P5; A23) | L | same |
| WP12-A81 | Operator | OP-09m of P: the form with the one-part rule (V18-P8; A13) | L | same |
| WP12-A82 | Operator | OP-09m with the statement error (V18-P8; A16 (1)) | L | same |
| WP12-A83 | Operator | OP-09i of P: holder uncertain on a partly returned item, the incident line (V18-P8; A16 (2)) | L | same |
| WP12-A84 | Operator | OP-09m after the C5 of tab 1 (V18-P9a; A19) | L | same |
| WP12-A85 | Operator | OP-09i of B: the parked return notice (V18-S1; A06) | L | same |
| WP12-A86 | Operator | OP-09l of B: candidates with the "Different applicant name" marker (V18-S2; A28) | L | same |
| WP12-A87 | Operator | OP-09i of P2: shared, the return notice (V18-S3; A29, A31) | L | same |
| WP12-A88 | SuperAdmin | SA-03c of P: the custody block (V18-R1; A33) | L | same |
| WP12-A89 | SuperAdmin | SA-03c of P2: the shared lines and the conditional sentence (V18-V2; A35) | L | same |
| WP12-A90 | Operator | OP-09m of B re-rendered 409 with the neutral words (V18-V4; A35) | L | same |
| WP12-A91 | TA | TA-07 of P: "Original documents" and the E-19 sentence (V18-P6; A39) | L | same |
| WP12-A92 | Operator (`operator-3`) | OP-09i of P: read only (V18-X1; A07) | L | same |
| WP12-A96 | TA; operator | Operation status page of a WP-12 command, accepted and "Nothing is recorded" (A49) | L | same |

## 3. Proof scenario V18 (to its boundary)

V18 (UX §12): "Partial original return holds applicable completion; reassignment does not move custody; undeclared
shared-item policy does not grant other operators visibility." Authority B19, B24, B30. Also UX §2.1 (Original item),
§2.2 (Custody), §3.1 step 9, §3.2 (Physical route), §5.4 and §6.3 (reassignment preview).

One ordered recipe (J-13): the design's §6 steps, with a fresh travel agent per run (§0.4) and lettered additions
marked "(addition)". "Setup" steps use pages of other packages; they are not the subject under test. "Observe" steps
check items that other packages own. SA1 = `superadmin-1`, SA2 = `superadmin-2`, OP1 = `operator-1`, OP2 =
`operator-2`. Every harness send uses a freshly loaded page unless the step says "raw".

| Step | Actor, page | Action | Observable result | Items | Where |
|---|---|---|---|---|---|
| P-0 | OP1, OP2: OP-01 and their incident lists; SA1: SA-01 Monitors | Before the set-up, read the counts. | The run record holds the baselines of §0.4. | — | L |
| Setup-1 | SA1 (SA-06, grant page); Y (TA-09, TA-08) | §0.4: create and activate Y; Y creates the group, adds P, B, P2 (D, one identity) and E1, uploads the mandatory documents and submits the four; SA1 grants `operator-3` read access to the group. | Y active; four submitted applications; Y's TA-10 count read (baseline). | — | L |
| Setup-2 | SA1 (SA-07a, SA-03a) | Record "Payment received" for each; assign P, B and P2 to OP1 and E1 to OP2. | Four paid, assigned applications; no original exists (an assignment moves nothing). | — | L |
| V18-P1 | OP1: OP-02 "Delivery & originals" of P → OP-09 | Read; select "Open the originals". | "Parts not returned: None"; no return row (no original exists); "No original is recorded for this application."; the link "Record an original received". | A01, A41 | L |
| V18-P2a (addition) | OP1: OP-09n of P; harness | Send empty. Send the values of §0.3 with the statement clear. Harness: the values of A09 (3). | C1; `custody_evidence_missing` at the statement with every other value kept; each harness send refused at its field; nothing recorded; nothing truncated. | A09, A11 (2) to (4) | L |
| V18-P2 | OP1: OP-09n and OP-09i of P | Read; record the original (§0.3 values, statement ticked). | The identity block before the fields (the full synthetic number only here); 303 to OP-09i; "Original recorded as received" with "Original [reference]" recorded and the current lines; both parts held at safe A; "Old passport, cancelled" kept whole. | A02, A08, A10 | L |
| V18-P3 | Harness | Resend the P2 POST (same `_op`); then post the same content with a new `_op`. | The same 303 and receipt, one item; then 409 "This item is already recorded for this group …"; still one item. | A11 (1), A12 | L |
| V18-P4 | OP1: OP-07 and OP-02 of P | Read. | `originals` "Not met: 2 parts are not returned to the travel agent …"; frame "2 parts not returned". | A10, A41, A43 | L |
| V18-P5a (addition) | OP1: OP-09t of P; harness | Send empty. Send part 1 with an External reference only. Harness: the values of A22 (3). | C1; `custody_evidence_missing` with the values kept; the field refusals, the partly filled row at its own index; nothing recorded. | A22 | L |
| V18-P5 | OP1: OP-09t of P; harness | Return part 1 only with the evidence "My statement" `SYN-RET-[stamp]`. Harness: replay (same `_op`). | The effect visible before the button; "Return to the travel agent recorded" with "State after the return: Partly returned …" recorded and the current part lines; the replay returns the same receipt. | A21, A23, A26 | L |
| V18-P6 | OP1: OP-07, OP-09, OP-02 of P; Y: TA-07 of P | Read. | Staff: "Not met: 1 part …"; item "Partly returned: 1 of 2 parts returned"; the item never reads "Returned". TA: the section with the boundary and "Owner: product owner"; E-19 "An original document holds completion. TravelMudra does not show custody details here."; no description, part label, holder or place. | A23, A39, A43 | L |
| V18-P7 | Harness | Post a return of part 1 again with the current revision. | 422 at the parts: "A chosen part is not held now …"; nothing changes. | A24 (1), A26 | L |
| V18-P8 | OP1: OP-09m, OP-09i, OP-09t, OP-02, OP-07, OP-01 of P; Y: TA-07 of P; SA1: SA-01 Monitors (Observe); harness | Send "Holder uncertain" for part 2 (one-part rule: shown as text) first without a statement (addition); then with "SYN: not in safe A on [date]". Harness: a return of part 2. | The statement field error and no incident; then "Custody change recorded" with "A custody incident was opened" (link); item "Holder uncertain for 1 of 2 parts; 1 returned"; OP-09t: part 2 under "Cannot be returned now"; OP-07 the uncertain sentence; the docket line; OP-01 the custody marker; TA E-19 not-met sentence unchanged; the harness return refused `part_not_held`; Monitors + 1 and + 1. | A04, A13, A16, A21, A24 (2), A42, A43, A44 | L |
| V18-P9 | OP1: OP-09m, OP-09i, OP-07 of P | Part 2 → "A TravelMudra office", "Synthetic office, safe B". | Part 2 "Held by a TravelMudra office: Synthetic office, safe B"; "Statement recorded when a part's holder became uncertain: … Every part's holder is known now."; the incident stays open (WP-14); OP-07 `original_held` only. | A02, A04, A17 | L |
| V18-P9a (addition) | OP1 (two tabs): OP-09m of P; harness | Tab 1 opens OP-09m. Tab 2: "Parts were sent or handed on", part 2, "A courier", "Synthetic courier [stamp]". Tab 1: "Parts are now with another holder…", part 2, office "Synthetic office, safe C"; send. Harness: tab 1's envelope again (raw); "Expected parts arrived" for part 2; "Parts were sent or handed on" for part 1; part 3 (raw); holder `ta` (raw). | Tab 2 accepted: part 2 "In transit with a courier: Synthetic courier [stamp]"; tab 1 C5 with the unsent choices beside the current facts; the raw resend `stale_revision`; `part_not_expected`; `part_returned`; `not_a_part`; `use_return`; nothing recorded by any of them. | A02, A13, A14 (3), A15, A18 (1), (3), A19 | L |
| V18-P9b (addition) | OP1: OP-09m of P; the receipt addresses of V18-P2, P5 and P8; harness | From a freshly loaded page: part 2 "Parts are now with another holder…", "A TravelMudra office", "Synthetic office, safe B". Harness: replay. Open the three receipt addresses again. | Part 2 held at safe B (the lines that V18-R1 expects); the replay returns the same receipt; the old receipts keep their recorded facts and show current lines; no instruction. | A02, A20, A48 | L |
| V18-S1 | OP1: OP-09n and OP-09i of B; harness | Record D's passport (§0.3). Read OP-09i. Harness: a return of part 1. | Receipt; OP-09i of B: the parked return notice "… Owner: product owner." and the unavailable "Record a return"; the return refused `parked_custody_route_policy`; nothing recorded. | A06, A10 | L |
| V18-S1a (addition) | Harness as OP1 | A receipt of D's passport on P2 from P2's freshly loaded OP-09n. | 409 `original_already_recorded` with the sharing hint; P2 holds no original of its own. | A11 (1) | L |
| V18-S2 | OP1: OP-09l of B | Read; send with no choice. | Candidates P2 "Synshare, Dev …" and P "Synret, Asha … · Different applicant name"; E1 absent (OP2's); the effect with the passport warning; C1 at "Application". | A28 | L |
| V18-S3 | OP1: OP-09l of B; OP-09, OP-09i and OP-07 of P2; harness | Share with P2. Harness: replay; a new-key share with P2; a raw envelope with B's original revision from before the share; a return of the shared original from P2's OP-09t address. Read. | "Original shared with another application", "Shared with application [P2 reference] (Synshare, Dev)"; OP-09 of P2 lists the item; OP-09i of P2: the return notice (shared; B's policy parked); OP-07 of P2 "Not met"; the replay the same receipt; `duplicate_operation`; C5; the return refused `parked_custody_route_policy`; one link. | A29, A30 (1), (5), A31, A32, A43 | L |
| V18-R1 | OP1 (a tab with OP-09t of P open); SA1: SA-03c of P | Read the preview. Setup: reassign P to OP2 with a reason (WP-06 command). Then OP1 sends the open return form. | The custody block "Originals: they stay where they are" (Current): "1 part returned to the travel agent"; "Part 2, Old passport, cancelled: held by a TravelMudra office: Synthetic office, safe B"; "Reassignment changes no custody record …"; no "held by" for the returned part; the custody incident with the duties that move; the receipt's current lines identical. OP1's send: the shell; nothing recorded. | A33, A34, A37 | L |
| V18-R2 | OP1: OP-09i of P; harness as OP1; OP2: OP-09i, OP-09t, OP-07 of P and OP1's V18-P5 receipt address; Y: TA-07 of P | OP1 opens P's item address; harness: OP1's custody change on P's original (`returnTo` = P). OP2 reads; returns part 2 with an attestation; opens the V18-P5 receipt address. Y reads. | OP1: SH-02 on the page and the post; nothing recorded. OP2: the same part lines as before the reassignment (delta 0); "Return to the travel agent recorded", "State after the return: Returned to the travel agent: every part"; OP-07 `originals` "Met" and the completion boundary; the application stays open. OP2 on the P5 address: the unchecked receipt with the current lines. TA: E-19 "No original document holds completion". | A25, A34, A48, A95 | L |
| V18-V1 | OP2: OP-09 of E1; harness | Read; open B's OP-09 and `/ops/applications/<E1>/originals/<B's original>`. Harness: a receipt on B; a custody change and a return on B's original with `returnTo` = E1. | E1: "No original is recorded …"; both GETs SH-02; each post the shell's answer (no 409: the original is not linked to E1); nothing recorded. | A11 (5), A18 (5), A24 (3), A38, A59 | L |
| V18-V2a (addition) | OP1: OP-09m of B; harness | Record a holder change of part 1 of the shared original: "A TravelMudra office", "Synthetic office, safe D". The harness keeps the request. | Accepted; one movement. | A94 | L |
| V18-V2 | SA1: SA-03c of P2 | Read; Setup: reassign P2 to OP2. | "Shared with 1 other application of this group: Application [B reference]" and the conditional sentence; no operator of B named. | A35 | L |
| V18-V3 | OP2: OP-09i of P2; B's OP-02 | Read; open B's OP-02. | The item and parts; B as "Another application of this group, not among your open applications" with no name, reference or link; B's OP-02: SH-02. | A35, A38 | L |
| V18-V4 | OP1: OP-09i and OP-09m of B | Read OP-09i (the custody-change link stays); record a holder change of part 1. | Status 409 re-render with the typed values and "This request could not be completed for you now, or its earlier result cannot be shown to you. Request reference [key]."; never "Nothing was recorded"; custody unchanged. | A35, A54, A68 | L |
| V18-V4a (addition) | Harness as OP1 | Send the V2a request again (same `_op`, same content). | Status 409 with the neutral words and the V2a request reference; the movement count stays one for V2a. | A50 (6), A94 | L |
| V18-V5 | Harness as OP2 | Share the original with E1 (`returnTo` = P2). | 409 CMP-10 "Sharing this original is unavailable: an application that shares it is assigned to another operator. … Owner: product owner."; nothing changes. | A30 (2) | L |
| V18-V6 | SA1: SA-03c of P2; OP1: OP-09m of B | Setup: reassign P2 back to OP1; record the holder change again. | Accepted; "Custody change recorded" (the recovery route). | A35 | L |
| V18-X1 (addition) | `syn-ta-2`; `operator-3`; SA2; harness | Open TA-07 of P; OP-09 and OP-09i of P with the read grant; the old SuperAdmin case pages of P, B and P2. Harness: the `operator-3` posts of A56; SA2's receipt, custody change, return and share posts on P; a custody change and a share on an unknown original id. | `syn-ta-2`: not found; read only for `operator-3`, each post refused; no SuperAdmin custody control and each SA2 post refused; the unknown ids the uniform 404; nothing recorded. | A07, A11 (5), A24 (3), A30 (4), (6), A40, A54, A56, A59 | L |
| V18-T1 | Test | Post-outcome fixtures: `return_original` with `original_held` and with `parked_custody_route_policy`, before and after a reassignment, with no operator; an applicant withdrawal with parts not returned; the group end. | The OP-01 view and count (F-30); the action panel (F-31); the OP-09 outcome line; the TA next-action words; return duties after a withdrawal; group end excluded. | A40, A42, A44, A45 | T |
| V18-T2 | Test | Renderer sweep over OP-09, OP-09i, the OP-02 tab, OP-07, SA-03c and TA-07 (design §6.3 V18-T2), with the expected-only and uncertain-only fixtures. | No item reads "Returned" unless every part is; uncertain never reads returned; no returned part reads "held by"; no item-level holder; no name or reference outside the reader's work list; TA pages hold no custody detail; E-19 sentences. | A02, A03, A23, A36, A39, A41, A43, A55 | T |
| V18-T3 | Test | Handlers (design V18-T3 and J-06). | Each refusal at its field with the values kept; never truncated or dropped; partly filled rows at their index. | A09, A22, A60 | T |
| V18-T4 | Test | Caps, target capacity and concurrency (J-03). | A93. | A93 | T |
| V18-X2 | Test | A03, A05, A11 (6) to (8), A12, A14 (1), (2), A18 (2), (4), A20, A24 (5), A26, A27, A30 (3), (4), A32, A35 (BFF), A36, A37, A39, A40, A41, A42, A43, A44, A45, A47, A48, A49, A50, A52, A53, A56 (support view), A57, A58, A60, A69, A70, A93, A94, A95. | As the items. | as listed | T |
| V18-X3 | axe | The pages in the states of A73 to A92 and A96 (design V18-A; OP-02 and OP-07 recorded as an observation). | No serious or critical violation at 1440 px and 390 px. | A73 to A92, A96 | L |

Proof split: V18 passes when P-0 to V18-X1 and V18-X3 pass on `lane-ui` at the integrated WP-12 commit and V18-T1 to
T4 and V18-X2 pass as named tests. Clause 1 is shown live before an outcome (V18-P5, P6, P8, R2: Core evaluates the
`originals` prerequisite whatever the outcome) and after an outcome by test (V18-T1; design §6.1). Clause 2 is shown by
V18-R1 and R2. Clause 3 is shown by V18-S2, S3 and V1 to V6. Recorded, not failed: the parked return of "SYN Business
visa (paper)" (A06), the parked shared-item return (A31) and the parked cross-operator custody (A30 (2), A35) read
"Unmet: parked policy (BS B30; PL B-05), owner product owner"; safe passport sharing reads "Unmet: waits for Max's
decision on P-18 item 1" (A28); the custody history reads "Partly met: waits for Max's decision on P-18 item 2" (A02);
the cap protection reads "Incomplete: waits for Core (STOP-W12-04, P-18 item 3)" (A93). The run record names the
`lane-ui` ref, the run tag, Y's identifier, each test, the identifiers (internal record only) and every delta.

## 4. Scenario parts outside this proof (traceability)

| Scenario part | Where it is proven |
|---|---|
| V18 clause 1 after an outcome: Core's `return_original` step, its owner, the OP-01 view, the withdrawal | Tests V18-T1 (A42, A44, A45); design §6.1 |
| V18 clause 2 at the command level: `core.reassign` changes no custody row | Core test `test/core/assignment-holds.test.ts` "reassigns: duties move, the previous operator is denied, readiness becomes the previous operator’s, acts and custody stay"; WP-06 (WP06-A53, A61) |
| SA-03c itself: duties lists, Gate 1 and readiness lines, the reason, the receipt, its replay and stale cases | WP-06 (WP06-A51 to A62); D-16 for the custody block |
| OP-07 completion page, its boundary wording and the other requirements | WP-08 (WP08-A51 to A60; E-05, E-06); E-18 for the `originals` row |
| OP-02 frame, tabs and action panel other than the custody rows; OP-01 view mapping | WP-07, with F-29 to F-32 |
| Custody incident pages: owner, evidence, resolution, closure | WP-14 |
| The applicant withdrawal form and its assessment | WP-17; A45 by test |
| V19: group end never consumes held originals | WP-17 (V19); Core test `test/core/completion-group-end.test.ts`; A45 by test |
| V12: preparation-only holds no originals | WP-10 (WP10-A03); A05 by test |
| A completed application's custody (completion clears the assignment) | Out of reach: completion requires every part returned (`derived.ts:199-200`); no proof step |
| Monitors custody counts | WP-06 (SA-01) and WP-14; observed in V18-P8, P9 |
| Custody corrections (same-applicant guard, unlink, void, a part that never arrives, re-receipt) | Max: P-18 item 1 (STOP-W12-05; J-01) |
| Custody history; originals register across applications; the 51st original or link | Max: P-18 item 2 (J-07); Core batch: P-18 items 4 and 3 (STOP-W12-01, STOP-W12-04) |
| Shared-item return priority, assignment suitability, recipient evidence, loss and damage, cross-party visibility | Product owner: BS B30 PARKED; PL B-05 (boundaries in A06, A30 (2), A31, A35, A39) |

## 5. Out of scope and boundaries

These MUST NOT appear on any WP-12 page:

- A custody control on a travel-agent page or on a SuperAdmin page, SA-03c included (BS B18; `policy.ts:222`).
- A custody form on OP-02, OP-07, OP-09, OP-09i or an old case page (one host page per command, CC-16).
- A loss or damage option, or "Lost", "Damaged", "Missing" or "Destroyed" as a state (parked policy, BS B30).
- A return to anyone other than the owning travel agent, or a free recipient field.
- A claim that a scan, a parcel label, a courier receipt, an assignment or a reassignment proves possession, moves an
  original or proves a return (BS B30, B19).
- "Held" for a part that is only expected; "Returned" for an item with a part not returned; the item-level holder or
  place shown as an item's holder; an earlier uncertainty statement shown as a current fact.
- A claim that custody moves to the new operator, or a new operator named as a holder, on SA-03c or its receipt; a
  claim on SA-03c about the operator of another application that the page did not read (Q-W12-10).
- On an operator page: a name, reference or link of an application outside the reader's own work list, also when an
  original is shared with it (BS B30; UX §5.2).
- Custody details on a travel-agent page (parked cross-party visibility); "TravelMudra still holds …" or "No original
  document is held" (E-19).
- "Nothing was recorded", or a claim about who is assigned to which application, in the D-W12-09 re-render (J-02); a
  409 re-render without the fresh-read condition (Q-W12-02).
- A share candidate admitted by an equal group label (J-05); a text that treats equal names as the same applicant
  (J-01).
- Recorded receipt facts beyond the stored summary fields, an accepted time, or an instruction to act from an older
  state (J-08; P-02; F-01, F-33).
- A "you saw" row or a reconstructed earlier state in a stale comparison (J-10).
- Earlier facts on a page after a read was refused for access (LD-14); a custody form while `ops.case_work` is
  unavailable.
- A truncated field, a dropped part line or token, or a dropped or silently omitted partly filled evidence row (LD-17,
  J-06).
- The application-level return answer described as one original's policy, or a return hidden where Core would accept
  it (J-04).
- A completion control, or a claim that the application completed when the last part was returned (LD-04).
- A list of accepted return evidence kinds, or any configuration value that no read returns, other than the disclosed
  contract limits (A55).
- A semantic duplicate guard for custody changes (Core has none); a count shown as "0" when it is unknown (D7).

Recorded, not failed (§0.2 "Pass rule"):

- Custody corrections, safe passport sharing included (a same-applicant guard against the original's recorded
  passport identity, unlink, void of a receipt on the wrong application, removal of an expected part that never
  arrives, re-receipt of a returned item): "Unmet: waits for Max's decision on P-18 item 1" (J-01; STOP-W12-05). The UI
  shows the warnings of A08 and A28 meanwhile.
- The custody history: "Partly met: waits for Max's decision on P-18 item 2" (J-07; STOP-W12-02).
- The cap protection: "Incomplete: waits for Core to refuse the 51st or page the read (STOP-W12-04, P-18 item 3)"
  (J-03).
- The parked policies, owner product owner: the return policy of "SYN Business visa (paper)" (A06); the shared-item
  return (A31); custody across operators of a shared original (A30 (2), A35); custody details for the travel agent
  (A39).

Deferred in WP-12 (each item says where it lands; the run record lists them as "Deferred"):

- The originals register across the operator's applications and the rail destination "Originals": P-18 item 4
  (STOP-W12-01; Core batch pending Max's confirmation); the rail stays hidden (A46).
- Per-original offers, sharing operators, declared item types, the accepted return evidence kinds, the holder
  reference, the original id on custody incidents (STOP-W12-03, P2): the facts mapping, the refusal-driven 409 and the
  generic hints stay (A27, A35).
- Command identity and accepted time in receipts (P-10 b, P-02): receipts as A47.
- The reassignment preview read with custody holders (P-10 d): A33 adopts it when served (S-08).
- Defect notes STOP-W12-06 (a second identical custody change; the statement kept; the item-level holder unchanged by a
  return) and STOP-W12-07 (completion codes sent to the travel agent), P2.

Not in WP-12 (other packages):

- `core.reassign` and SA-03c apart from its custody block: WP-06.
- Custody incidents' review, resolution and closure: WP-14.
- Withdrawal commands and group end: WP-17. Completion request: boundary (LD-04; WP-08 OP-07).
- Preparation-only packet work: WP-10.

## 6. Questions for the architect (ranked)

The ranks follow PRI-20260930-01: P0 blocks the main path or risks irreversible harm; P1 goes to Max (through the
architect and the orchestrator) to be parked or worked; P2 is parked as a note. No question is P0: the main path
(receipt, movement, partial and full return, completion evaluation) works on "SYN Paper visa with original return",
and no real offering with originals can launch while its return policy is unresolved (`launch/readiness.ts:90`).

The independent review ranked 13 findings P1 and none P0 (`WP-12.md` §4.1). The architect answered (`WP-12.md` §3,
§4.1): Q-01 → STOP-W12-05 (d), P-18 item 1 with Max; interim warning on OP-09n (A08). Q-02 → Q-W12-02 (the bounded
409 with J-02's neutral words) and Q-W12-10 (the SA-03c conditional sentence) (A35, A94, A95). Q-03 → J-07: P-18 item 2
as an exception to criterion point 2 (A02 partly met). Q-04 → Q-W12-03: the rail stays hidden; STOP-W12-01 is P-18
item 4 for the Core batch (A46). Q-05 → Q-W12-04 and J-01: the marker warns and never hides; the guard is P-18 item 1
(A28). Q-06 → Q-W12-06 and F-30 (A44). Q-07 → J-04: per-original offers, Core decides (A27). Q-08 → STOP-W12-03 (c),
P2: a text field with no prefilled value (A08). Q-09 → STOP-W12-03 (e), P2: no `holder.ref` field; "Where, and with
whom" carries it. Q-10 → STOP-W12-06, P2: pages derive from the parts (A02, A04). Q-11 → P2, WP-14 (A17). Q-12 → no
proposal (A40). Q-13 → P2 note; the review found that the 409 rule adds no new disclosure. Q-14 → Q-W12-01 and CC-16
(A58). The table keeps the questions as they were asked.

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
| P-18 decisions in force at the run (items 1 to 4) and the parked policies (return of "SYN Business visa (paper)"; shared-item return; cross-operator custody; travel-agent visibility) | |
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
| WP12-A93 | | | |
| WP12-A94 | | | |
| WP12-A95 | | | |
| WP12-A96 | | | |
| V18 proof (to its boundary) | | | |
