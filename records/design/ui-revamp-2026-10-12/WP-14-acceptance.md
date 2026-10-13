# WP-14 acceptance checklist: Incidents, audit and degradation

| Field | Value |
|---|---|
| Lane | `ui-revamp-2026-10-12` |
| Work package | WP-14 Incidents, audit and degradation (UI-PLAN §12.2: OP-08, SA-08, SA-01; done when V13 (disclosure part) and V23 (SA-08 part) pass; lane PLAN §3) |
| Author | Principal Product Manager (Claude subagent), 13 October 2026 |
| Decision owner | Principal Technical Architect of the lane (LD-12) |
| Status | Aligned on 13 October 2026 with `WP-14-design.md`, the architect's decisions (`WP-14.md` §3) and amendments K-01 to K-16 (`WP-14.md` §4.1), which bind. See the corrections below. Not run. Where the design names a page, a path or a word differently from an unchanged row, the design governs the name and this checklist keeps the observable result; where an amendment differs from the design, the amendment governs. |
| Product base | lane branch `ui-revamp-2026-10-12` at 34e875b (the design read e1f6ac9 and the review 34e875b; the incident, failure-classification, documents-queue, monitors and audit code is the same at both). Internal records at 71bc264 |
| Installation | `lane-ui`: staff http://127.0.0.1:4652 (operator and SuperAdmin pages under test); edge http://127.0.0.1:4650 (travel-agent pages: set-up and observation of the disclosure consequences) |
| Writing style | ASD-STE100 at about 75% (STY-20261003-01) |

## Corrections of 13 October 2026

The UX design (`WP-14-design.md`), the architect's decisions (`WP-14.md` §3) and the independent design review (lane
`research/reviews/WP-14-design-review.md`, R-01 to R-16, with amendments K-01 to K-16 in `WP-14.md` §4.1, which bind)
changed the rows below. The WP-06 D-17, WP-07 F-34 and F-35, WP-08 E-20 and E-21 and WP-11 I-14 amendments apply too.
Rows not listed changed only their page ids, step references and draft words to the design's. Section 6 is kept as
asked; its lead names the answers. Page ids follow the design (§1.3); the
first version's ids map as: SA-08v "Derived views" → **SA-08h** Reporting health; SA-01m Monitors → **SA-08m**;
SA-08q Document checks → **SA-08d** (with task pages SA-08c, SA-08b); SA-08m Measures → **SA-08q**; SA-08v is now
the reviewer page. The applications D, V, S of the first version are replaced by the design's A, B, C (§0.3).

| Row | Finding or decision | Change |
|---|---|---|
| Status, §0.1 | Design; `WP-14.md` §3, §4.1; review R-01 to R-16; `PROPOSALS.md` P-20 | Inputs add the design, the record, the review and P-20. Verified facts add: each additional read a page uses (K-14); the fields each audit subject records (the resolution note is on the incident, not in its audit fact); the read caps of 20 required and missing items (K-05); an operator cannot open a disclosure kind (bearing on K-02) |
| §0.2 "Personas", "Paths", "Data hygiene"; §0.3; §0.4; §3 | K-13 (R-13); Q-W14-06; design §6 | One ordered recipe: the design's §6 with a fresh travel agent per run (created on SA-06 at set-up) and lettered additions; design step ids (V13D-n, V23S-n) in run order; every required observation mapped live or by test. Part S of the first version (a SuperAdmin-opened incident on an unassigned application, classification, a reviewer) is outside the approved writes: it runs as tests and gallery states |
| §0.2 "Paths"; §1.1; §1.2; every page name in §2 | K-13; Q-W14-01; design §1.3, §1.5; CC-17 | The design's hosts: OP-08e, OP-08n, OP-08r and SA-08e, SA-08n, SA-08r (evidence, notice, resolve); SA-08v (reviewer); SA-08f (classification); OP-08o, SA-08o (open); OP-08w and **SA-08w** (report, K-03); SA-08c, SA-08b (document checks). Close stays on OP-08i and SA-08i |
| A79 | K-13; design §1.5, §1.6, §7.2 | Forms sit on their task pages, not on the incident, list or queue pages; only close stays on the incident page |
| A42, A43, A44 | K-13; Q-W14-03; D-W14-07; design §2.10, §2.15 | SA-08o offers eight kinds (no `artifact_association`), takes the application only from the address context (no raw reference input), the country from Core's list, and states the design's effect per kind; a refusal re-renders SA-08o |
| A34, A36, A139 (new); §3 V13D-6 | Q-W14-12; D-W14-10 | The resolve form shows when only `evidence` or `correction` is missing, with evidence rows then required; the design's V13D-6 ("no form") is replaced: the form shows and a resolution without evidence is refused naming the correction |
| A08, A30, A34, A133 (new) | K-01 (R-01); P-20 item 1 | The evidence and resolve pages say what Core counts as the correction and ask for the replacement file reference; actual-correction enforcement is "Unmet: waits for P-20 item 1" |
| A21 | K-02 (R-02) | During a delivery-records outage OP-08w shows no report form; it says why and offers temporary containment through an application-scoped disclosure incident; the permanent report follows when the records read again. Core lets only a SuperAdmin open that kind, so the containment step is SA-08o (§6 Q-04 asks the architect to confirm) |
| A24, A142 (new) | K-03 (R-03); Q-W14-02; P-20 | SA-08w and its POST route are built in WP-14 and tested on admin reads, without the operator's assignment condition (the interim of the first version goes) |
| A45, A134 (new) | K-04 (R-04); Q-W14-05; P-20 item 2 | "Owner (as recorded)" and the interim line on SA-08; "an ended-assignment incident enters SuperAdmin attention" is "Unmet: waits for P-20 item 2" |
| A08, A25, A135 (new) | K-05 (R-05); P-20 item 3 | A list at its cap says so ("Not every recipient may be listed"); a test with more than 19 notice accounts; the complete list is "Unmet: waits for P-20 item 3" |
| A25, A28 | K-06 (R-06) | The deletion request is offered whenever the account received the file, the owning travel agent included; a test proves that path requests deletion |
| A81 | K-07 (R-07) | The opening receipt is neutral ("Request recorded") until S-08 |
| A68 to A73 | K-08 (R-08) | The bulk requeue stays available with qualified counts; no "none" from a capped slice; quarantine wording says that a content check of a file that already passed its safety check reads its details again |
| A63, A65 | K-09 (R-09) | Measure gaps read as "recorded measure results" with freshness unavailable and never count toward an all-clear |
| A22, A33, A55, A93 | K-10 (R-10) | Only a wholly empty evidence row is omitted; a partly filled row is refused at its index; an empty optional `originComponent` is omitted and Core enforces the scope rule |
| A05, A37 | K-11 (R-11) | Neutral words for `assigned`; a reviewer shows only from its fact; "Closed" means every duty ended (a later classification stays possible), never "its records cannot change" |
| A48, A50 | K-12 (R-12) | SA-08v states that a reviewer outside the assignment can review and reject an association but cannot confirm it until identity evidence is accessible to it |
| A04, A13, A15, A23, A29, A38, A56, A58 | K-14 (R-14) | Each additional authorized read is named; facts no read returns are qualified (completion of the application, the report's evidence, recipient and time per release); completed-case commands run as a SuperAdmin or the current reviewer; audit assertions use only the fields recorded on each subject |
| A89 | K-15 (R-15) | In an operator support view the scoped incident reads render without actions; admin pages stay unavailable |
| A01, A02, A03, A06 to A10, A16, A25, A30, A45 to A47, A62 to A64, A68, A75 to A77, A136 (new) | Design §2.1 to §2.13; Q-W14-07 to Q-W14-11; D-17, E-21, F-34, F-35, I-14 | Design anatomy, saved views, display paging of 50, words and states; the monitoring queue path answers 303 to Monitors (A136); SA-01 group 10 and 16 lines with the document-checks line; links per the amendments |
| A11, A12, A31, A40, A49, A51, A53, A54, A56 | Q-W14-06 (approved writes) | Live writes outside the approved set (evidence records, an operator's or SuperAdmin's open, a reviewer naming, a classification) become tests and gallery states; their live refusals that record nothing stay live |
| §2.16; A137 to A144 (new) | Design §6 axe list | axe rows mapped to the design's steps; eight rows added for the task pages |
| §0.2 "Pass rule"; §5 | K-01, K-04, K-05 | The three Unmet items and the design's deferrals |
| §6 lead, Q-04, Q-15 (new) | `WP-14.md` §3, §4.1 | Answers named; Q-04 rewritten for the K-02 containment route; Q-15 added (P2: the fresh travel agent and Q-W14-06) |

## Lessons applied from the WP-01 to WP-13 corrections

| Lesson | Source | Where this checklist applies it |
|---|---|---|
| Identical replay, changed-content conflict, browser Back, rejected-form refresh and lost acknowledgement are five separate cases; a business duplicate with a new key and a raw stale envelope are two more | WP-01 A-02, A-03, A-06; WP-03 R-12; WP-06 D-12 | §0.2 "Replay terms"; A84, A85 |
| A refused command leaves no operation record; the refusal shows only on the re-rendered form | WP-01 A-08; WP06-A104 | §0.2; A83; every refusal item checks "nothing is recorded" by delta |
| A receipt names the command only when the operation's resource, returned id and summary establish it; otherwise a neutral "Request recorded" with facts labelled "Current"; no accepted time; a result never comes from the address | WP-01 A-04, P-02; WP-06 D-02; WP-11 I-09; WP-14 K-07 | §0.2 "Receipts"; A74, A81 |
| No page, status read or receipt instructs anyone to perform an external act | WP-07 F-01, F-33 (P0 class fix) | A07, A10, A82 |
| Every rendered form action is a registered route; one host page per command use; carried forms leave the old pages | CC-12 to CC-17; WP06-A110; S-09 | A47, A79 |
| A page MUST NOT block a command that Core accepts, and MUST NOT offer one that Core refuses; a facts mapping that offers a form carries a parity test | WP-07 D-W07-16; WP-10 H-02, H-03; Q-W14-12 | A34, A50, A69 |
| An outage of the evidence that a consequential record needs removes the form with a notice; optional information degrades; access refusals are a separate test | WP-07 F-04; WP-10 H-05; WP-11 I-05; WP-14 K-02 | A14, A21, A65 |
| Optional reads never hide an access change | LD-14 | A03, A14, A65 |
| No handler truncates, slices or drops a field or an indexed row; only a wholly empty row is omitted; a partly filled row is refused at its index; an optional field may be absent | LD-17; WP-12 J-06; WP-14 K-10 | A22, A33, A55, A93 |
| A page shows only facts that a read returns; each additional read is named; a missing fact is qualified, "Unavailable" or "Partly met" | WP-02 B-06; WP-06 D-04; WP-14 K-14 | §0.2 "Facts"; A04, A13, A15, A23, A29, A56 |
| Audit facts show only as fields recorded on that subject, with time and source; nothing is reconstructed from clock order | WP-11 I-10; BS B33; WP-14 K-14 | A56, A58 |
| A list at its read's cap says so; no total, "none" or "all" beyond the returned slice | WP-08 E-10; WP-14 K-05, K-08 | A01, A08, A25, A45, A68, A72, A135 |
| A state is labelled for the fact it establishes, never for a fact it does not | WP-06 D-05; WP-14 K-11 | A05, A37 |
| A reviewer outside the assignment cannot see a candidate's identity facts; a page promises no decision it cannot offer | WP-08 E-01; WP-14 K-12 | A48 |
| A truthful notice states only what it records | WP-08 E-20 (AM-W14-02) | A28 |
| Freshness: "Read at [time] IST" for an authoritative read; the lag form for a projection; stored results with no freshness read "Freshness unavailable" and never support an all-clear | LD-08; WP-14 K-09 | A57, A60, A62, A63 |
| A boundary of a decided policy never says that an owner still has to decide | LD-04 | A15, A63 |
| UI acceptance is separate from Core enforcement; a decision pending with Max or the orchestrator is recorded "Unmet" or "Partly met" | WP-10 H-01, H-11; WP-11 I-01 | §0.2 "Pass rule"; A133, A134, A135 |
| Proofs follow one ordered recipe (the design's, with a fresh travel agent per run and lettered additions), with a run tag and deltas; set-up writes are labelled | WP-12 J-13; WP-02 B-13 | §0.4; §3 |
| Real refusal shapes from the code; a harness envelope that isolates a guard carries the current revision | WP-06 D-11; WP-10 H-07 | §0.5; A20, A36, A71 |
| Outages and maintenance that `lane-ui` cannot show are proven by named tests | WP-01 P-W01; P-03 parked | §3 V23S-4 to V23S-8 |
| Kind 1 notes record whether criterion point 2 is demonstrated | WP-09 G-11; WP-14 K-16 | §6 Q-05, Q-09 |

## 0. Inputs and conventions

### 0.1 Inputs

| Ref | Source | Identity | Sections used |
|---|---|---|---|
| UX | `TARGET_PRODUCT_UX_SPEC.md` (2026-10-05) | SHA-256 b45186887cdc37f6… | §2.1, §2.2, §2.3, §3.2 (Completed case with continuing duty), §3.3, §5.2, §5.3 (Artifact review), §5.4, §6.1, §6.2 (Incidents & audit), §6.3 (Support view, Recovery boundary), §7.4, §7.5, §8.2, §8.3, §12 V13, V23 |
| BS | `BUILD_SPEC.md` (r2) | SHA-256 4a6fd90657b0723f… | B12, B13, B33, B35, B37 to B40, B45; B10, B18 for boundaries |
| PL | `../ui-plan-from-specs-2026-10-10/UI-PLAN.md` | SHA-256 75256bfd7e6d929a… | §1.1 to §1.4, §2.2, §2.3 (SH-R06), §3.3 OP-08, §3.4 SA-01, SA-08, §5.3 OP-08, §5.4 SA-01, SA-08, §6.3, §6.4, §7, §8, §10, §11, §12.2 WP-14, §13.2 B-07, B-09 |
| DE | `../ui-plan-from-specs-2026-10-10/DECISIONS-2026-10-10.md` | SHA-256 a2c935f72cd4f5e9… | §3.1, §3.2 |
| SI | `../ui-plan-from-specs-2026-10-10/SURFACE-INVENTORY-2026-10-10.md` | internal 71bc264 | CMD-47, CMD-49, CMD-50, CMD-55 |
| CC | `COMMAND-COVERAGE.md` (this folder) | SHA-256 ea37211844395eca… | §3 rows of the ten WP-14 commands; §5.1; §6 CC-01, CC-13, CC-17 |
| LP | `PLAN.md` (this folder) | SHA-256 e894486f73af0e59… | §3, §4 (LD-02 to LD-04, LD-07, LD-08, LD-11, LD-12, LD-14, LD-17), §8 (S-06, S-08, S-09), §9 |
| PR | `PROPOSALS.md` | SHA-256 836728c144e90add… | P-02, P-03, P-13 item 2, P-20 items 1 to 4 and the orchestrator's disposition (internal 3cf2ad6) |
| W14 | `WP-14-design.md`; `WP-14.md`; lane `research/reviews/WP-14-design-review.md` | SHA-256 c076a493733307bf…; 332c7453a8c1187c…; 19b157c9da2fdc67… | design §0 to §9 (§1.2 Core facts, §1.3 pages, §1.5 commands, §1.6 forms that leave, §1.8 amendments, §2.0 to §2.19, §3 interims, §4 hostile states, §6 proofs, §7 units and tests, §9 STOP items and deviations); record §3 (Q-W14-01 to Q-W14-12, PM Q-03, PM Q-04), §4.1 (K-01 to K-16); review R-01 to R-16 |
| W1 | `WP-01.md`; `WP-01-acceptance.md` | SHA-256 1246143f54f52fa7…; 18659ab8bc74e51a… | §3 (P-W01), §4 A-04, A-08, A-09; WP01-A21, A78; §3 V23 parts A to C (the shell part of V23, referenced, not repeated) |
| W6 | `WP-06.md`; `WP-06-design.md`; `WP-06-acceptance.md` | SHA-256 3405adf1c9a5dc6b…; 327f580c1820bf40…; 7a1d82e48fde6e93… | D-02, D-12, D-17; design §2.1 groups 10 and 16, F-W06-09; WP06-A05 to A09 |
| W7 | `WP-07.md` | SHA-256 d2abff81759605c8… | F-01, F-04, F-33, F-34, F-35; WP07-A07 |
| W8 | `WP-08.md`; `WP-08-design.md`; `WP-08-acceptance.md` | SHA-256 7a0c15231350b09f…; 7a74a46cc1480906…; 4d6504be7f20ebe7… | §3 (Q-W08-08, PM Q-06, PM Q-11, CC-13), E-01, E-03, E-10, E-12, E-20, E-21; WP08-A17 to A30, A39, A111, A118, A154, A155; §3 V13; §4 (V13 disclosure part to WP-14) |
| W11 | `WP-11.md`; `WP-11-acceptance.md` | SHA-256 edbea91a683da1c2…; d1f43350a16d08cb… | I-05, I-09, I-10, I-14; format |
| W12 | `WP-12.md`; `WP-12-acceptance.md` | SHA-256 aea7f10624c10b40…; 9ff066eb04bed279… | J-06, J-08, J-13; format, corrections |
| Code | lane repository | 34e875b | as the first version: `src/modules/operations/case-work/commands/incidents.ts`, `incidents.ts`, `store.ts`, `evidence.ts`; `src/modules/documents/commands/requeue.ts`, `queries.ts`, `facade.ts`; `src/modules/identity/policy.ts`; `src/modules/views/case-queries.ts`, `queries.ts`; `src/kernel/command.ts` (`privilegedElevation`); `src/kernel/vocabulary/incidents.ts`, `operations.ts`; `src/contracts/operations-work.ts`, `documents.ts`, `delivery.ts`, `views.ts`, `views-cases.ts`; `src/core-api/bindings/operations-work.ts`, `documents.ts`; `src/core-api/allowlists.ts`; `src/apps/staff/operations/incidents.ts`, `labels.ts`, `case-work.ts`; `src/apps/staff/documents.ts`; `src/apps/shared/pages/documents.ts`; `src/apps/shared/evidence-form.ts`; `src/apps/staff/views/cases.ts`, `pages.ts`; `src/apps/shared/delivery/pages.ts`; `src/web/route-inventory.ts` |

Verified facts of the code at 34e875b that the items rely on (read by the author; the design §1.2 and the review agree
unless stated):

- **Kinds, states, owner.** Nine kinds; states `open`, `assigned`, `awaiting_evidence`, `resolved`, `closed`; "open" is
  the first three. `assigned` is set by a reviewer naming and also by evidence recorded on an `awaiting_evidence`
  incident (`commands/incidents.ts:213`): it does not establish a reviewer (K-11). A closed incident can still be
  classified (Core accepts `ops.classify_failure` on it). The row carries the **stored** owner; the current duty holder
  (`incidentDutyHolders`) is not on the read (STOP-W14-01, P-20 item 2). A SuperAdmin's `ops.open_incident` is owned by
  the SuperAdmin queue, also on an assigned application. Completion clears the assignment and moves no incident; the
  former operator then has no read of it.
- **Operator kinds.** An operator opens only `operational_failure`, `custody_discrepancy`, `post_filing_correction`
  (`not_operator_openable` for every other kind). No operator can open a disclosure or a byte-integrity incident, the
  two kinds that block releases (bearing on K-02; §6 Q-04).
- **Required items** (`missingEvidence`): `evidence` = a recorded reference other than a statement; `association_decision`
  = the incident's file verified or rejected (never met without a file); `correction` = an eligible replacement of the
  incident's file, **or any recorded reference other than a statement** (K-01, P-20 item 1); `notice:<account>` = a
  disclosure notice posted to that account. The read caps `requiredEvidence` and `missingEvidence` at 20 entries each
  (`zWireIncidentRow`): with 20 or more notice accounts the list is incomplete (K-05, P-20 item 3).
- **Reads the pages use** (design §1.3; K-14 names each): `ops.incident` (the row, revision, evidence rows without
  actor or time, notice ids without recipient or acknowledgement, the disclosure `affected` block with release, email
  and recipient **ids only**, candidates, `viewerIsReviewer`, offers); opt. `core.ops_case` or `core.admin_case`
  (account names; for a SuperAdmin the application's lifecycle, so its completion); opt. `ops.case_work` ("CW": the
  artifact's eligibility and every incident of the application); opt. `dlv.delivery_page` (release time, channel,
  recipient and requester per release; email time and state); `ops.admin_incidents` (the reviewer candidates);
  opt. `cat.admin_index` (countries); `doc.queue`; `views.projections`; `views.monitors`; `views.audit_search`;
  `views.audit_subject`; `views.measures`. No read returns: the report's own evidence; the recipient, variant or
  acknowledgement of a posted notice; the current classification; the completion of the application to an operator.
- **Audit fields per subject** (what SA-08s can assert; K-14): incident subject: `ops.incident_opened` (kind, owner
  kind, owner account, required items, file, artifact, country; evidence when given); `ops.incident_evidence_recorded`
  for a report (after: `reported`, recipients count, outside-records flag; reason = the report note, first 1,000
  characters; the report's evidence), for a notice (after: notice id, recipient account, variant), for evidence
  (after: count, state; reason = the note; the evidence); `ops.incident_assigned`; `ops.failure_classified`
  (before and after scope, component, country); `ops.incident_resolved` (state before and after; the resolution's
  evidence) — **the resolution note is not in this fact**, it is on the incident row; `ops.incident_closed` (state;
  reason = the closing note). Artifact subject: `ops.artifact_eligibility_changed` (before, after `blocked`, incident).
  Document version subject: `doc.version_blocked` (currency before, after `blocked`, incident).
- **Commands.** As the first version and the design §1.2: report (one per version, dedupe `disclosure:<dov>`; blocks
  the version for good and the artifact; required `correction` and one notice per recipient and the owning travel
  agent); notice (`deletion_request` only to a recorded recipient, `disclosure_information` only to the owning travel
  agent; one per account); evidence (1 to 10 rows; no business guard); resolve (counts the resolution's own evidence;
  refusal with one field error per missing item); close (only from `resolved`; no revision); open (no business guard;
  operational failure and country defect get the classification `unresolved`); reviewer (only while no active
  operator; `not_active_operator`; replaces an earlier reviewer, whose access ends); classify (shared needs a component
  and evidence naming it; local needs a country unless the subject is an application); requeue one (revision and stage;
  a parse requeue of content-safe bytes runs the extraction only, `requeue.ts:61-62`); requeue bulk (up to 1,000
  candidates read, up to the limit requeued, running checks left out; `nothing_to_requeue`). No WP-14 command has
  `privilegedElevation`, so none waits for the audit index (`kernel/command.ts:349`).
- **SuperAdmin report route.** `incident.report_disclosure` allows a SuperAdmin; the staff allowlist and the binding
  hold `ops.report_wrong_recipient`; only the operator route exists today. K-03 adds `admin.incidents.disclosure`
  (POST `/admin/applications/:applicationId/disclosure`) and SA-08w with no Core change (P-20 disposition).
- **Today's pages** (replaced by WP-14): S-09 forms on the SuperAdmin incident page posting to addresses with no route;
  `f()`, `chosen()` and the queue handlers cut fields and drop rows; one evidence row, a note-only row dropped; results
  from the address (`?done=`, `?requeued=`); the queue page predicts the bulk count from 200 rows and says "Every
  document finished its checks"; Monitors shows a success callout over unknown counts and "no product trigger in this
  build"; the projections page shows a server command; Core stores the first 1,000 characters of an incident note of
  up to 2,000 (§6 Q-07).

### 0.2 Conventions

- **Personas.** Travel agent: Y, `wp14-ta-[stamp]`, a fresh synthetic travel agent per run (created and activated by
  SA1 on SA-06 at set-up; K-13); fallback `syn-ta-1` with the run-tagged group when the harness cannot create one,
  recorded in the run record (§6 Q-15). `syn-ta-3` for isolation only. Operators: `operator-1` (OP1: the assigned
  operator of A, B and C), `operator-2` (OP2: isolation reader; test reviewer). SuperAdmins: `superadmin-1` (SA1:
  set-up and SA-08 under test), `superadmin-2` (SA2: second tab and observation). They stand for `syn-operator-1`,
  `-2` and `syn-superadmin-1`, `-2`. Keyboard-only user. Screen-reader user. Phone user (390 px wide). No step suspends
  a seeded account.
- **Where.** `L`: a person or the LD-11 harness shows it on `lane-ui`. `T`: an automated test in the lane repository
  shows it at the same commit; the run record names the test (the design's §7.1 names: `incident-words.test.ts`,
  `incident-pages.test.ts`, `incident-task-pages.test.ts`, `bff-incidents.test.ts`, `document-checks.test.ts`,
  `bff-document-checks.test.ts`, `reporting-pages.test.ts`, `incident-host-pages.test.ts`, and the system tests of
  design §7.3). `L+T`: both are required. "Gallery" is the design's gallery state.
- **Sign-in codes (rule C).** As WP-01 §0.2. The LD-11 harness signs in. Nobody prints, logs, screenshots or stores a
  code or an authenticator key.
- **Copy.** Quoted text is draft copy (CR-09); the design's §2.15 and §2.16 tables govern the words, amended by
  K-11. Draft copy passes when the page states the same facts. The §11.3 boundary form is mandatory for an unavailable
  action. Core's reasons show in words; a code shows only as the UAT-13 fallback (A86). No page shows a package id or a
  lane record id.
- **Incident words.** Kinds: the design's §2.15 list. States (K-11): `open` "Open"; `assigned` neutral words that
  claim no reviewer (draft "Open: being worked"); `awaiting_evidence` "Waiting for evidence"; `resolved` "Resolved:
  waiting to be closed"; `closed` "Closed: every duty on it ended" (never "its records cannot change"). A reviewer shows
  only from the reviewer fact ("[name] (reviewer)", "You are the named reviewer"). Owner words: design §2.15; on SA-08
  the column reads "Owner (as recorded)" (K-04 interim). Required items: design §2.15 words; the correction line also
  states what Core counts (K-01).
- **Disclosure words.** A blocked file: "Blocked after a release to a wrong recipient. It is never released again."
  (staff) and "This file is held. It is not released again." (travel agent). Never "recalled", "retrieved back",
  "unsent", "retracted" or "deleted" as a fact for a recipient's copy; a notice asks, it proves nothing. No "Recall" or
  "Block this version" control (B45; CMD-50). The compliance boundary (B-09): "Notices to the applicant, to a regulator
  or for legal purposes are not part of this release. They need separately authorized compliance work. Owner: product
  owner."
- **Degradation words (LD-08; design §2.15).** A projection: "Up to date when read at [time] IST", "Behind by [n] s
  when read at [time] IST", "Freshness unavailable"; projection states "Up to date", "Behind", "Being rebuilt", "Facts
  not projected", "Failing", "Never run"; facilities "Answering now", "Not answering", "Not known"; stored measure
  results "recorded measure results", freshness unavailable (K-09). A recovery duty reads "Owner: engineering"; no
  server command.
- **Dates and times.** Every time carries "IST". Event time and recorded time are both shown where a read returns both.
- **Freshness.** Incident reads, the documents queue, the monitors' counts (except as K-09 states), the reporting
  health read and the subject history: "Read at [time] IST". The audit search and `pendingBoundary`: the lag form.
- **Facts (K-14).** A page shows only facts that a named read returns. A fact the reads do not return is qualified
  ("Not shown on this page", "cannot be read now", or the item is "Partly met"); an audit fact shows only as a field
  recorded on that subject, with its time and source. A fact read after an operation is "Current". A count that
  cannot be read is "Unavailable", never "0". A list at its cap says so.
- **Receipts.** CMP-08 as WP06-A103, per the design §2.17 amended by K-07: named only for `reported`, `notice`,
  `classified` and `checks`; neutral "Request recorded" for `opened`, `evidence`, `resolved`, `closed`, `reviewer` and
  `requeued`. No accepted time, no actor (P-02, S-08). No result from the address. Never an instruction to act or a
  recall claim. The polite region announces it.
- **Replay terms.** As WP-11 §0.2 (identical replay; changed-content conflict; Browser Back; rejected-form refresh;
  lost acknowledgement to `/<surface>/operations/<key>`); business duplicate and raw stale envelope belong to the matrix
  (A84).
- **Refused sends leave no record.** The status page of a refused key reads "Nothing is recorded for request
  [reference] so far"; every refusal item checks by delta (incidents, evidence rows, notices, blocks, classifications,
  queue states).
- **Paths (LD-03; design §1.3).** Kept, rebuilt: OP-08 `/ops/incidents`, OP-08i `/ops/incidents/:incidentId` (hosts
  close), SA-08 `/admin/incidents`, SA-08i `/admin/incidents/:incidentId` (hosts close), SA-08h
  `/admin/system/projections`, SA-08m `/admin/monitors` (`/admin/queues/monitoring` answers 303 to `#open`), SA-08d
  `/admin/documents/queue`, SA-08a `/admin/audit`, SA-08s `/admin/audit/:subjectType/:subjectId`, SA-08q
  `/admin/measures` (phase C, separable). New GET task pages beside the kept POST paths: OP-08e, OP-08n, OP-08r
  (`/ops/incidents/:incidentId/{evidence,notices,resolve}`), SA-08e, SA-08n, SA-08r (`/admin/incidents/:incidentId/…`),
  SA-08v (`/admin/incidents/:incidentId/reviewer`), SA-08f (`/admin/failures/incident/:incidentId/classify`), OP-08w
  (`/ops/applications/:applicationId/disclosure?version=`), SA-08w (`/admin/applications/:applicationId/disclosure`,
  K-03), OP-08o (`/ops/applications/:applicationId/incidents/new` → POST `/ops/incidents`), SA-08o
  (`/admin/incidents/new?application=` → POST `/admin/incidents`), SA-08c (`/admin/documents/:versionId/requeue`),
  SA-08b (`/admin/documents/requeue`). Pages of other packages: OP-01, OP-02 (WP-07); OP-05, OP-05r, OP-06, OP-07,
  TA-07, TA-07d, TA-10, TA-10n, TA-07x (WP-08); OP-09 (WP-12); SA-01, SA-06 (WP-06, WP-02); SA-04a (WP-11).
- **Pass rule.** WP-14 passes when every `L` item passes on `lane-ui` at the integrated ref, every `T` item has a named
  passing test at that commit, every axe item passes, and the proofs of §3 pass, except the explicitly deferred items of
  §5. Recorded, not failed: A133 "Unmet: waits for P-20 item 1"; A134 "Unmet: waits for P-20 item 2"; A135 (complete
  list) "Unmet: waits for P-20 item 3"; A04, A29 and A56 "Partly met" where no read returns the fact; A64 and A127
  "Deferred" when phase C (U7) is not built. A failed item becomes a finding ranked P0, P1 or P2 with its scenario
  (PRI-20260930-01).
- **Preconditions on `lane-ui`.** WP-02, WP-03 and WP-06 to WP-08 are integrated (SA-06 creates accounts; TA pages
  submit; SA-07a records payments; SA-03a assigns; OP-02 and OP-04 record readiness and filing; OP-05 records outcomes
  and result files, OP-05r reviews an association, TA-07d downloads, TA-10n acknowledges). WP-08's synthetic
  result-document generator (WP-08 PM Q-06) is available to the harness. Where a package is not integrated, the step
  runs on the existing page and the run record says so.
- **Data hygiene (Q-W14-06; K-13).** WP-14 writes only: the fresh travel agent (created and activated), one group,
  three applications A, B, C with their payments, assignments, readiness, authorizations and filing records, three
  result files and one replacement, one download, two reports, two notices and the acknowledgement of one, two
  resolutions and two closures. It MUST NOT change seeded offerings, declarations, launches, ceilings or accounts,
  MUST NOT open, classify, name a reviewer on, resolve or close an incident other than the run's own, MUST NOT send a
  document check again unless the document's group carries the run's tag, and MUST NOT run a restore. C's association
  incident stays open at the end (its review is WP-08's); later runs exclude it by its tag. Notes, references and
  evidence carry the run tag. Identifiers stay in the internal record only.

### 0.3 Synthetic data used by WP-14 (design §6.2)

| Item | Value | Use |
|---|---|---|
| Travel agent | Y, `wp14-ta-[stamp]` (fresh per run; fallback `syn-ta-1`) | A, B, C |
| Group | `wp14-[stamp]` in Synthetica on "SYN Tourist e-visa"; travel start today + 30 days, return today + 40 days | A, B, C |
| A | Applicant "SYNDISC, ASHA"; assigned to OP1; filed; outcome "Issued" with a result PDF holding A's name and passport number (verified); downloaded by Y | The in-product disclosure: report, block, deletion request, acknowledgement, replacement, resolution, closure |
| B | Applicant "SYNOUT, DEV"; as A without a download | The disclosure outside the delivery records (`SYN-W14-[stamp]-MAIL`), the information notice in E-20 words, the SuperAdmin pages, the two-tab resolution, closure |
| C | Applicant "SYNREVIEW, RAVI"; assigned to OP1; outcome "Issued" with a nameless PDF | An association incident: OP-08i links OP-05r; SA-08i without a decision form (S-09); SA-08v blocked (`already_assigned`) |
| Passports | `td3Lines` of a `SyntheticPassport`, document code P, issuing state and nationality IND, expiry at least six months after the return date, number "S" + seven digits new to the run; `passportTextPdf` or `passportImage` | Intake |
| Photographs | `plainPng` at least 350 × 350 px | Intake |
| Payments | "Payment received", evidence `SYN-W14-[stamp]-PAY-[letter]` | Gate 1 |
| Result files | WP-08's generator: R-A and R-B (name and passport number, automatic match), R-C (nameless), R-A2 (A's replacement) | Outcome, release, replacement, association incident |
| Evidence values | `SYN-W14-[stamp]-PORTAL-[letter]`, `SYN-W14-[stamp]-MAIL`, `SYN-W14-[stamp]-REF-B`; notes "WP14 [stamp] …" | Filing evidence, the outside-records report, B's resolution |
| Fixtures (tests and gallery) | An incident of each kind and state with each owner kind; a SuperAdmin-opened operational failure on an unassigned application with a reviewer; a reviewer replaced mid-review; an application completed by the harness with an open disclosure; a disclosure with 20 and with 25 notice accounts; a recipient that is not the owning travel agent; documents-queue entries in each state and with 201 entries of which the oldest 200 are not requeueable; facilities up, down and unknown; a failed, a lagging and a never-run projector; a lost acknowledgement per command | T items and the gallery |

### 0.4 Run recipe (rerunnable)

- Run tag `wp14-[yyyymmddhhmm]`. First checks: the harness can create, activate and sign in Y (else the fallback);
  OP1, OP2, SA1 and SA2 sign in; "SYN Tourist e-visa" admits Y (TA-03); the WP-08 result generator runs.
- Baseline (step P-0, before the set-up): OP-08 counts of OP1 and OP2 ("Yours to act on", "About your applications");
  OP-01 "Continuing duties" of OP1; SA-01 group 10 ("Need a SuperAdmin", "Open in total", by kind) and group 16 lines;
  SA-08m incident counts; SA-08 "All open" count; SA-08d count and facilities; SA-08h states. Every later count check is
  a delta from it.
- Setup (labelled, design §6.2): Setup 0: SA1 creates and activates Y on SA-06. Setup 1: Y creates the group and
  submits A, B and C. Setup 2: SA1 records the payments and assigns A, B and C to OP1. Setup 3: OP1 starts work,
  confirms readiness, requests authorization and records "Filed" for each. Setup 4: OP1 records "Issued" with R-A, R-B
  and R-C; after the checks R-A and R-B are verified and C has an association incident (observe WP08-A17). Setup 5: Y
  downloads R-A on TA-07d (one release); keep that tab open for V13D-3.
- Order (§3): P-0, Setup, then the design's V13D steps in run order (V13D-1 to -8, -10, -11, -9, -12 with the lettered
  additions), V13D-13 to -16 (tests), V23S-1 to -8, then X-1 to X-5. Every harness send uses the fields of a freshly
  loaded page unless the step says "raw".

### 0.5 Refusal shapes in the code at 34e875b (category / code)

| Command | Refusals the items assert |
|---|---|
| `ops.report_wrong_recipient` | `not_found_or_forbidden` / `access_denied` (an operator not assigned; a version of another group; `syn-ta-3`); `validation_failed` / `input_invalid` on `note`, `releaseIds`, `emailSendIds` (over 50), `evidence` (over 5; `evidence.N.kind` `evidence_kind_unknown`; `evidence.N.id` `evidence_version_not_usable`, `invalid_id`); `control_blocked` / `incident_evidence_insufficient`; `conflict_duplicate` / `duplicate_operation` (with the existing incident); `conflict_operation_key` / `operation_key_reused` |
| `ops.post_disclosure_notice` | `not_found_or_forbidden` / `access_denied` (no relation; another kind); `validation_failed` / `input_invalid` field `recipientAccountId` code `not_affected`; `variant`; `stale_revision` / `stale_revision`; `control_blocked` / `incident_not_open`; `conflict_duplicate` / `duplicate_operation` |
| `ops.record_incident_evidence` | `not_found_or_forbidden` / `access_denied`; `validation_failed` / `input_invalid` on `evidence` (none, over 10, kind, reference, note), `note`; `stale_revision`; `control_blocked` / `incident_not_open` |
| `ops.resolve_incident` | `not_found_or_forbidden` / `access_denied`; `validation_failed` / `input_invalid` on `resolutionNote`, `evidence`; `stale_revision`; `control_blocked` / `incident_not_open`; `control_blocked` / `incident_evidence_insufficient` with field errors `requiredEvidence` codes `evidence`, `association_decision`, `correction`, `notice_missing` |
| `ops.close_incident` | `not_found_or_forbidden` / `access_denied`; `control_blocked` / `incident_not_open` (not resolved; already closed); `validation_failed` / `input_invalid` on `note` |
| `ops.open_incident` | `not_found_or_forbidden` / `access_denied`; `validation_failed` / `input_invalid` on `kind` (operator `not_operator_openable`), `applicationId` (`required` for an operator), `countryId` (`required` for a country rule defect), `note`, `evidence` |
| `ops.assign_incident_reviewer` | `not_found_or_forbidden` / `access_denied`; `validation_failed` / `input_invalid` on `reason` (10 to 1000), `reviewerAccountId` (`not_active_operator`); `stale_revision`; `control_blocked` / `incident_not_open`; `control_blocked` / `already_assigned` |
| `ops.classify_failure` | `not_found_or_forbidden` / `access_denied`; `validation_failed` / `input_invalid` on `scope`, `originComponent` (`required` for shared, `not_applicable` otherwise), `countryId` (`required` for local), `reason`, `evidence`; `control_blocked` / `failure_scope_evidence_missing` |
| `doc.requeue_check` | `not_found_or_forbidden` / `access_denied`; `validation_failed` / `input_invalid` on `stage`, `reason` (1 to 500); `stale_revision`; `control_blocked` / `requeue_not_applicable` |
| `doc.requeue_bulk` | `not_found_or_forbidden` / `access_denied`; `validation_failed` / `input_invalid` on `stage`, `limit`, `reason`; `control_blocked` / `nothing_to_requeue` |
| Sent by harness steps, owned elsewhere | A POST to `/admin/incidents/:id/confirm-association` or `…/reject-association`: no route, uniform 404. `dlv.retrieve_document` of a blocked version: `version_blocked`. Any `/admin` page or post in a support view: 409 `support_view_active` |

## 1. Scope

### 1.1 Pages (design §1.3)

| Page | Host and path | Part in WP-14 |
|---|---|---|
| OP-08 Incidents and follow-up | 4652 `/ops/incidents?view=&kind=&page=` (kept, rebuilt) | Saved views "Yours to act on" and "About your applications"; kind filter; display paging of 50; the resolved-incidents line |
| OP-08i Incident (operator, reviewer) | 4652 `/ops/incidents/:incidentId` (kept, rebuilt) | Now, Next step, What happened, Required to resolve, the disclosure block, the association link to OP-05r, evidence, resolution; host of **close** |
| OP-08e, OP-08n, OP-08r | 4652 `/ops/incidents/:incidentId/{evidence,notices,resolve}` (new GET beside the kept POST) | Hosts of evidence, notice and resolve (operator surface) |
| OP-08w Report a release to a wrong recipient | 4652 `/ops/applications/:applicationId/disclosure?version=` (new GET beside the kept POST) | Host of `ops.report_wrong_recipient` (operator); leaves the case page and OP-02 (F-34), linked from OP-05 (E-21) |
| OP-08o Open an incident (operator) | 4652 `/ops/applications/:applicationId/incidents/new` → POST `/ops/incidents` | Host of `ops.open_incident` (operator kinds) |
| SA-08 Incidents | 4652 `/admin/incidents?view=&kind=&page=` (kept, rebuilt) | Views "Needs a SuperAdmin" and "All open"; "Owner (as recorded)" and the interim line (K-04) |
| SA-08i Incident (SuperAdmin) | 4652 `/admin/incidents/:incidentId` (kept, rebuilt) | As OP-08i; the association section without a decision form (S-09); host of **close** |
| SA-08e, SA-08n, SA-08r | 4652 `/admin/incidents/:incidentId/{evidence,notices,resolve}` (new GET) | Hosts of evidence, notice and resolve (SuperAdmin surface) |
| SA-08v Name a reviewer | 4652 `/admin/incidents/:incidentId/reviewer` (new GET) | Host of `ops.assign_incident_reviewer`; the confirmation limitation (K-12) |
| SA-08f Classify the failure | 4652 `/admin/failures/incident/:incidentId/classify` (new GET) | Host of `ops.classify_failure` (incident subjects; operational failure, country rule defect) |
| SA-08o Open an incident (SuperAdmin) | 4652 `/admin/incidents/new?application=` → POST `/admin/incidents` | Host of `ops.open_incident` (eight kinds; application from the address context only) |
| SA-08w Report a release to a wrong recipient (SuperAdmin) | 4652 `/admin/applications/:applicationId/disclosure` (new GET and new POST `admin.incidents.disclosure`, K-03) | Host of `ops.report_wrong_recipient` (SuperAdmin), on admin reads, without the assignment condition |
| SA-08h Reporting health | 4652 `/admin/system/projections` (kept, rebuilt; rail label "Reporting health") | Derived views, reporting gaps (recorded measure results), document checks |
| SA-08m Monitors | 4652 `/admin/monitors` (kept, rebuilt; Home member "Monitors"); `/admin/queues/monitoring` → 303 `#open` | Counts with units; no success while a count is unknown; LD-04 boundary line |
| SA-08d, SA-08c, SA-08b Document checks | 4652 `/admin/documents/queue`; `/admin/documents/:versionId/requeue`; `/admin/documents/requeue` | CC-01: the queue (read) and the hosts of the two recheck commands |
| SA-08a, SA-08s Audit | 4652 `/admin/audit`; `/admin/audit/:subjectType/:subjectId` (kept, conformance) | Event and recorded times; LD-08 lag form of the index; subject history from the fact log |
| SA-08q Measures | 4652 `/admin/measures` (kept; rebuilt in phase C, U7, separable) | Units, missing values, "Not enough cases" |
| SA-01 Decision inbox | 4652 `/admin` (WP-06 page, D-17) | Groups 10 and 16 lines and links; the document-checks line |
| OP-01, OP-02, OP-05, OP-05r, OP-06, OP-07, SA-04a, TA-07, TA-07d, TA-10, TA-10n, TA-07x | Pages of WP-07, WP-08, WP-11 | Links per F-34, F-35, E-21, I-14; observation of the disclosure consequences; E-20 notice words |

Reads (K-14): `ops.incidents`, `ops.admin_incidents`, `ops.incident`; opt. `core.ops_case`, `core.admin_case`,
`ops.case_work`, `dlv.delivery_page`, `cat.admin_index`; `doc.queue`; `views.projections`, `views.monitors`,
`views.audit_search`, `views.audit_subject`, `views.measures`; `core.operation`.

### 1.2 Command coverage (CC §5.1: 10 WP-14 commands; CC-17)

| # | Command | Route id (POST path) | Host page | Items |
|---|---|---|---|---|
| 1 | `ops.report_wrong_recipient` | `ops.incidents.disclosure` (`/ops/applications/:applicationId/disclosure`); `admin.incidents.disclosure` (`/admin/applications/:applicationId/disclosure`, new, K-03) | OP-08w; SA-08w | A16 to A24, A142 |
| 2 | `ops.post_disclosure_notice` | `ops.incidents.notice`, `admin.incidents.notice` (`…/:incidentId/notices`) | OP-08n; SA-08n | A25 to A29, A135 |
| 3 | `ops.record_incident_evidence` | `ops.incidents.evidence`, `admin.incidents.evidence` | OP-08e; SA-08e | A30 to A33 |
| 4 | `ops.resolve_incident` | `ops.incidents.resolve`, `admin.incidents.resolve` | OP-08r; SA-08r | A34 to A36, A38, A133 |
| 5 | `ops.close_incident` | `ops.incidents.close`, `admin.incidents.close` | OP-08i; SA-08i | A37, A38 |
| 6 | `ops.open_incident` | `ops.incidents.open` (`/ops/incidents`); `admin.incidents.open` (`/admin/incidents`) | OP-08o (operator kinds); SA-08o (eight kinds) | A39 to A44 |
| 7 | `ops.assign_incident_reviewer` | `admin.incidents.reviewer` | SA-08v | A48 to A52 |
| 8 | `ops.classify_failure` | `admin.failures.classify` (`/admin/failures/:subjectType/:subjectId/classify`) | SA-08f (subject type `incident` only, D-W14-11) | A53 to A56 |
| 9 | `doc.requeue_check` | `admin.documents.requeue` | SA-08c | A69 to A71, A74 |
| 10 | `doc.requeue_bulk` | `admin.documents.requeue_bulk` | SA-08b | A72 to A74 |
| ref | `ops.confirm_artifact_association`, `ops.reject_artifact_association`, `dlv.retrieve_for_review` | `ops.incidents.confirm_association`, `.reject_association`, `.review_copy` | OP-05r (WP-08) | A09, A47, A77 |
| ref | `ops.record_artifact` with `incidentId` | `ops.case_work.artifact` | OP-05 (WP-08 E-03) | Set-up of V13D-7; A77 |
| ref | `dlv.acknowledge_notice` | `ta.notices.acknowledge` | TA-10n (WP-08) | Observation of V13D-4a |

All of them also: A80 to A94. UI-PLAN §12.2 "Block document version" is the report (CMD-50; no separate command);
"Assign incident owner" has no command: SA-08v names a reviewer (CMD-55; D-W14-15). Commands outside WP-14 that the
proof touches only as set-up or observation: `iam.create_account`, `iam.approve_account`, `iam.activate_account`
(WP-02); `intake.start_individual`, `core.submit` (WP-03); `pay.record_service_status`, `core.assign` (WP-06);
`ops.start_work`, `ops.record_readiness`, `core.authorize_external_act`, `ops.record_act_evidence` (WP-07);
`ops.record_official_result`, `ops.record_artifact`, `dlv.retrieve_document`, `dlv.acknowledge_notice` (WP-08).

### 1.3 State coverage

S1 (loading) does not apply: every page is server-rendered. S5 applies to SA-08a, the `pendingBoundary` line of SA-08m,
the measure results (K-09) and SA-08q.

| Page | Page states | C1 validation | C2 rejected | C3 accepted | C4 unresolved | C5 stale |
|---|---|---|---|---|---|---|
| OP-08, SA-08 | Views, S2, S3, cap, interim line A01 to A03, A45, A134 | — | — | — | — | — |
| OP-08i, SA-08i | Each kind and state A06 to A10, A13, A15, A46, A47; reviewer A11; duty ended A12; reads A14 | A37 | A37 | A37 | A83 | — (close has no revision) |
| OP-08e, SA-08e | Not open, offer null, open A30 | A32, A33 | A32 | A31 | A83 | A94 |
| OP-08n, SA-08n | Per account, posted, every notice posted, cap A25, A135 | — | A27 | A26 | A83 | A27 |
| OP-08r, SA-08r | Non-evidence item missing (no form), only evidence or correction missing (form) A34, A139 | A36 | A36 | A35 | A83 | A94 |
| OP-08w, SA-08w | Not assigned (OP-08w), CW or delivery records unavailable A21, no file, every file reported, choose file A16, A17, A24, A142 | A20, A22 | A20 | A18, A24 | A83 | — (no revision; the duplicate guard decides) |
| OP-08o, SA-08o | Not assigned, application not readable, open incidents listed A39, A42 | A41, A43 | A41, A43 | A40, A42 | A83 | — |
| SA-08v | Allowed, `already_assigned`, no operator listed, reviewers unavailable A48, A50 | A51 | A51 | A49 | A83 | A51 |
| SA-08f | Allowed, kind not offered (404), closed A53 | A55 | A55 | A54 | A83 | — |
| SA-08h, SA-08m, SA-08q, SA-08a, SA-08s | Healthy, behind, failed, unavailable A57 to A65, A136 | A57 | — | — | — | — |
| SA-08d, SA-08c, SA-08b | Entries, empty, cap, not requeueable, facilities A68, A69, A72 | A71, A73 | A71, A73 | A70, A73 | A83 | A71 |

### 1.4 Specification scenarios

| Scenario | What WP-14 shows | Items |
|---|---|---|
| V13 (disclosure part; WP-08 proves the association, withholding and replacement parts) | OP1 reports A's downloaded result as released to a wrong recipient; the file is blocked for good on every channel and never substituted; the outcome stays "Issued"; Y gets a truthful deletion request and acknowledges it; the correction is a verified replacement; the incident resolves only with the correction and the notice, then closes; a disclosure outside the delivery records (B) gets the E-20 information notice; the SuperAdmin pages show the incidents and hold no association form (S-09) | A16 to A38, A47, A78, A133 to A135, A142; §3 V13D |
| BS B13: block, preserve known retrievals and recipients, correction, truthful notices, deletion request without recall; closure needs evidence also after completion; applicant, regulator and legal notices need separate authority | Affected block; required items; notice texts; compliance boundary; completed-case closure by a SuperAdmin | A13, A15, A19, A25 to A29, A34 to A38 |
| BS B13: a SuperAdmin names a reviewer without filing authority when no operator is assigned; a SuperAdmin can block a confirmed disclosure with no assignment | SA-08v (tests and the blocked state on C); SA-08w (K-03) | A11, A12, A24, A48 to A52, A142 |
| V23 (SA-08 part; WP-01 proves the shell part) | Reporting health and Monitors never show a fabricated zero or success; incident and requeue commands continue during a projection outage; forms whose required read fails are removed; no restore, reopen, rebuild or server command; maintenance answers the status document | A21, A60, A62 to A67, A136; §3 V23S |
| BS B33 | Audit with event and recorded times, actor, subject, evidence, retrospective marks; only recorded fields; diagnostics allowlisted | A57 to A61 |
| BS B38 | Facilities and the "would wait again" warning; capped lists qualified | A68, A69, A72 |
| BS B35 | Replay per command; the matrix | A84, A85 |
| UX §3.2 Completed case with continuing duty | Incidents of a completed application stay open and closable without reopening processing | A13, A38 |
| UX §6.3 Recovery boundary; BS B39, B40 | No recovery control; "Owner: engineering" | A62, A67 |
| CC-01 | SA-08d, SA-08c, SA-08b with qualified counts | A68 to A74 |
| V24 | Keyboard and phone | A95 to A106 |

## 2. Acceptance checklist

### 2.1 OP-08 Incidents and follow-up (operator list)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP14-A01 | Operator (OP1) | OP-08 (§3 V13D-1a) | Open the rail item "Incidents and follow-up". Read the default view. | `h1` "Incidents and follow-up"; lead "Duties you own or review, and incidents about the applications assigned to you. An incident can stay open after its application completed."; "Read at [time] IST". Saved views "Yours to act on" (default) and "About your applications", each "[n] incidents" or "500 or more incidents" at the read's cap. Table: Incident (kind words linking OP-08i; second line what happened); Application (applicant and service linking OP-02 when Core named it; the reference when it did not; "None"); State (§0.2); Owner (§0.2); Still needed ("[n] items" or "Ready to resolve"); Opened (time IST). Display pages of 50 rows (`page` in the address). A's disclosure and C's association incident show in "Yours to act on" (deltas from P-0). No age, "overdue" or SLA wording. | L | Design §2.1; PL OP-08; D7 |
| WP14-A02 | Operator (OP1) | OP-08 views and filter (§3 V13D-1a) | Open "About your applications"; filter by "Result file needs review"; filter by a kind with no incident; clear; reload; press Back. | View, kind and page sit in the address as enumerated values (SH-R06); Back and reload keep them; an unknown value is ignored. S3 "No open incident of this kind." with "Clear the filter". The result count is announced; focus stays (AC-16). | L | Design §2.1; SH-R06; AC-16 |
| WP14-A03 | Operator; test | OP-08 states | Live: read the line under the table. Test: "Yours to act on" empty with rows in the other view; both empty; the list read unavailable; an access, session, maintenance or support-view refusal; 500 rows. | Line: "Resolved incidents that wait to be closed are not listed here. Each application's page lists all its incidents." S2 "Nothing is yours to act on now. [m] other incidents are about your applications." / "No open incident is about your applications." Unavailable: S7 with "Try again", never an empty list or "0". Access refusals: the shell (LD-14). Cap: "The list shows the oldest 500 open incidents. Others exist." | L (line) + T | Design §2.1; STOP-W14-03; D7; LD-14 |
| WP14-A04 | Test | OP-08 and SA-08 rows of an incident whose application is completed (fixture) | Render. | No list read returns the application's completion, so no row shows a completion flag; the row never reads as closed because its application completed. "Partly met" while no list read returns the fact (§6 Q-09). SA-08i may show it from opt. `core.admin_case` (A13). | T | PL OP-08; K-14 |
| WP14-A05 | Test (`incident-words.test.ts`) | Word maps | Render every kind, state, owner kind, required item, projection reason, facility value and component; an unknown value. | Each has the §0.2 words. `assigned` uses neutral words that claim no reviewer, also for an `assigned` incident without a reviewer (evidence on `awaiting_evidence`); a reviewer shows only from the reviewer fact. `closed` reads that every duty ended, never that the records cannot change (Core accepts a later classification). An unknown value shows "Reference code: [code]". | T | K-11 (R-11); `commands/incidents.ts:213` |

### 2.2 OP-08i and SA-08i Incident: reading

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP14-A06 | Operator (OP1) | OP-08i of A's disclosure (§3 V13D-1a) and of C's association incident (V13D-12c) | Read the page from the top. | Breadcrumb "Incidents and follow-up › [kind words]"; `h1` "[kind words]: [applicant]"; meta: reference (copyable), "Opened [time] IST by" "You", a name, or "TravelMudra (automatically)"; "Read at [time] IST". Sections in the design's order: Now (State, Owner, reviewer line only from the fact, Application, File); Next step; What happened; Required to resolve; the kind's section (A09, A15); Evidence recorded; Resolution (when resolved or closed); Close (only when offered); secondary links. Task links (OP-08e, OP-08n, OP-08r) instead of forms; only close is a form here. | L | Design §2.3 |
| WP14-A07 | Operator; test | OP-08i "Next step" (§3 V13D-1a, V13D-4, V13D-7, V13D-8) | Read at each step. Test: every row of the design's closed table. | First match of design §2.3 item 4: closed → "Closed [time] IST." (K-11 words); close offered → "Close the incident"; resolved without the offer → "Resolved [time] IST. Its owner closes it."; association decision missing → OP-05r; a notice missing → "Post the notice to [name]" → OP-08n; correction missing → "Record the correction" → OP-05 `#record-file` (WP-08 E-03) or "Record evidence" → OP-08e; evidence missing → OP-08e; nothing missing → "Resolve the incident" → OP-08r; every offer null → "Only the incident's owner or reviewer works it. You can read it." No step instructs anyone to file, pay, send or perform an external act (F-33). | L+T | Design §2.3 item 4; F-33 |
| WP14-A08 | Operator (OP1); test | OP-08i "Required to resolve" (§3 V13D-1a, V13D-4, V13D-7) | Read after the report, after the notice and after the replacement. Test: 20 and 25 notice accounts. | One row per Core code in Core's order, "Recorded" or "Not recorded yet", with the item's link for a row the reader can work; line "TravelMudra checks every item again when the incident is resolved." The correction row says what Core counts: "A replacement result file verified for this application meets it. TravelMudra also counts any reference or document recorded on this incident as the correction, so record only evidence that shows the correction." (K-01). After V13D-4 the notice row "Recorded"; after V13D-7 the correction row "Recorded". With 20 or more entries: "Not every recipient may be listed." (K-05). | L+T | K-01, K-05; `missingEvidence` |
| WP14-A09 | Operator (OP1); test | OP-08i of C (§3 V13D-12c) | Look for the decision forms. Follow "Review the association". | Section "Result file association": "Association now: [words]" from opt. CW, or "cannot be read now"; the link "Review the association" → OP-05r. No confirm, reject or review-copy form on OP-08i. | L+T | CC-13; design §2.3 item 8 |
| WP14-A10 | Test | OP-08i of every other kind (fixtures) | Render each kind. | Each shows its automatic sentence or note, its required item and its next step. Byte integrity: releases of the file (or, without a file, of the application) are paused while open. Custody: link to OP-09 of the application. Follow-up of a later official fact: owner as named by Core; no outcome change. Correction after filing: no correction form. No page offers to repeat, refile, retry or reopen work. | T | Design §2.3, §2.15 |
| WP14-A11 | Test; gallery | OP-08 and OP-08i as a named reviewer (fixture: SuperAdmin-opened incident on an unassigned application, OP2 named) | Render as OP2. | Row "You (reviewer)"; OP-08i: "You are the named reviewer"; no applicant name, application link or case facts (Core returns none to a reviewer); line "You see this incident and its result file only. You have no other action on the application."; the task links of the offers Core gives. | T + gallery | Design §2.0, §2.3 states; BS B13 |
| WP14-A12 | Test | Duty end: reviewer replaced; operator assigned; reassignment (V13D-13) | Name reviewer B while reviewer A works an incident; then assign an operator; separately reassign an application with an open incident. | A: uniform 404 on OP-08i, OP-05r and the review copy, its next command to the shell; B reads it; after the assignment the operator owns it and B's access ends; after the reassignment the previous operator gets the shell and the new one owns the incident; a SuperAdmin-owned incident keeps its owner. No earlier facts stay (LD-14). | T | Design §4.3; WP-09 G-09 |
| WP14-A13 | Test | SA-08i, SA-08r and close of a disclosure incident on an application completed by the harness (V13D-14) | As SA1: read; resolve; close. As the former operator: open OP-08i. | SA-08i shows "Processing completed" for the application only from opt. `core.admin_case` (lifecycle), and "This incident stays open until it is resolved and closed."; the former operator gets the uniform 404 (completion cleared the assignment). Resolve and close run as the SuperAdmin (or a current reviewer); the application stays completed; no processing action appears. | T | K-14 (R-14); BS B13 |
| WP14-A14 | Test | OP-08i, SA-08i and the task pages (HTTP tests) | (1) `ops.incident` unavailable. (2) The names read unavailable. (3) CW unavailable. (4) An access refusal between reads. | (1) S7 / no page (required read). (2) Accounts read "An account" by role. (3) The file line and "Association now" read "cannot be read now"; the incident's forms stay. (4) The shell, never earlier facts. | T | LD-14; design §2.0 |
| WP14-A15 | Operator (OP1) | OP-08i of A, "The disclosure" (§3 V13D-1a) | Read the section. | "File": type and version reference, and from opt. CW the Current line "Blocked after a release to a wrong recipient. It is never released again." (or "The file's state cannot be read now."). "Releases named in the report: [n]" and "Emails named in the report: [m]" with copyable references (Core returns ids only: the time, channel and recipient of each release are not shown here; K-14). "Accounts that must get a notice": one row per notice code, account name from the case's names (else role words), Why ("Received the file"; "The application's travel agent"; both), Notice ("Posted" / "Not posted yet"). "Notices posted: [k]". What happened adds: "The evidence given with the report is kept with the report. It does not count as the correction." (the report's evidence is not shown: no read returns it). The compliance boundary (§0.2). No "Recall" or "Block this version" control. | L | Design §2.3 items 5, 7; K-14; BS B13 |

### 2.3 Report a release to a wrong recipient: OP-08w and SA-08w (`ops.report_wrong_recipient`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP14-A16 | Operator (OP1) | OP-08w of A from OP-05 "Report a release to a wrong recipient" (E-21) and from OP-02 (F-34) (§3 V13D-1) | Read the page. | OP-02 frame; `h1` "Report a release to a wrong recipient: [applicant]". Scope with the file (one file: text and hidden `documentVersionId`; several: the "Choose the file" GET step, none preselected). "Evidence: the releases of this file" from opt. `dlv.delivery_page`: checkboxes "[time] IST: [how] to [name] (travel agent)" with "Requested by [name] · [reference]", none prechecked. "Evidence outside the delivery records": evidence rows (Core accepts 5), "A statement alone is not enough." "What happened" (required). Effect (design §2.4 item 6) and Review before the button "Report and block the file" (destructive); "Cancel" → OP-02. The form is on no other operator page (A79). | L | Design §2.4; E-21; F-34 |
| WP14-A17 | Operator (OP1); harness; test | OP-08w after the report; states (§3 V13D-2) | Reload OP-08w of A. Harness: identical replay; a new key with the current fields. Test: not assigned; no result file; every file reported. | A: "Already reported: [type] — Open the incident" and no form. Replay: the same 303 and receipt. New key: "This file is already reported. Nothing new was recorded." with "Open the incident" (`duplicate_operation`); one incident. States: "Only the assigned operator reports a release of this application."; "This application has no result file to report."; "Every result file of this application is already reported." | L+T | Design §2.4 states, §2.16 |
| WP14-A18 | Operator (OP1) | OP-08w of A (§3 V13D-1) | Choose Y's download of R-A; note "WP14 [stamp] released through the wrong case"; send. | 303 to OP-08i of the new incident; receipt "Release to a wrong recipient reported" (summary establishes it) with "Incident [reference]"; Current: "Result file: Blocked after a release to a wrong recipient. It is never released again." (CW); required items: the correction, the notice to Y; the compliance boundary. Never "recalled", never that Y was told. | L | Design §2.17; BS B13 |
| WP14-A19 | Y; operator (OP1); SuperAdmin (SA1) | TA-07, TA-07d (tab of Setup 5), TA-10 of A; OP-05, OP-06, OP-07 of A; SA-08m (§3 V13D-3, V13D-3a, V13D-7) | Y downloads R-A from the old tab. Read every page. After V13D-7 read TA-07 again. | TA-07 "Outcome: Issued"; R-A "This file is held. It is not released again."; no other file offered. TA-07d: refused `version_blocked`, no byte, no substitute. TA-10: no new notice yet. OP-05: R-A blocked; OP-06: "Not releasable now: blocked …"; OP-07: Core's artifact row. SA-08m "Releases to a wrong recipient" +1. Earlier retrievals stay listed. After V13D-7: TA-07 offers R-A2 only; R-A never. | L | BS B12, B13; WP-08 wording |
| WP14-A20 | Operator (OP1); harness; test | OP-08w refusals | (1) Send with nothing chosen and no evidence (§3 V13D-1). (2) Test: a statement only. (3) Test: a release id of another version. (4) As A17. (5) Harness (V13D-2a): OP2 sends the report of A; `syn-ta-3` posts it. | (1), (2), (3): "Choose at least one release or email of this file that went out, or give a reference or a document of a disclosure outside the delivery records. A statement alone is not enough. Nothing was recorded." at the releases fieldset; choices and note kept. (5): the shell; no fact of A. Nothing recorded (incidents, blocks, eligibility unchanged). | L ((1), (5)) + T | §0.5; design §2.16 |
| WP14-A21 | Test | OP-08w and SA-08w while the delivery records read is unavailable (availability failure); then readable again | Render; follow the containment route; later report the file. | No report form (K-02): "The releases of this file cannot be read now. A report records every account the file went to, and a file is reported once, so it waits until they can be read. Try again later. Owner: TravelMudra." Temporary containment is offered as a route, not a form: "To stop every release of this application now, a SuperAdmin opens a 'Released to a wrong recipient' incident about it (it blocks releases until it is resolved)." with the link to SA-08o of the application for a SuperAdmin, and the owner "TravelMudra administration" for an operator (operators cannot open that kind, §0.1; §6 Q-04). When the records read again, the permanent report is accepted (a hand-opened incident uses another key) and names the recipients. An access refusal of the read: the shell (LD-14). | T | K-02 (R-02); design §2.0 |
| WP14-A22 | Test (`bff-incidents.test.ts`) | The OP-08w and SA-08w handlers | Send 51 releases; a five-digit index; a value that is not a release reference; a note of 2001 characters; six evidence rows; a row with only a note; a wholly empty row. | Every field and indexed row is read whole: 51 → "Choose at most 50 releases and 50 emails in one report."; the five-digit index is read; the bad value → "'[value]' is not a release reference."; 2001 characters → "Up to 2000 characters."; six rows → "Give at most 5 pieces of evidence."; the note-only row refused at its index (K-10); the wholly empty row omitted. Values kept; no command sent. | T | LD-17; K-10 (R-10); design §2.19 |
| WP14-A23 | Test (V13D-16) and live (§3 V13D-10) | OP-08w of B: a disclosure outside the delivery records | Report B with the external reference `SYN-W14-[stamp]-MAIL` and no release chosen. Read OP-08i of B. | Accepted; the version blocked for good; recipients recorded: none; required: the correction and the information notice to Y. OP-08i: "Accounts that must get a notice" lists Y only ("The application's travel agent"); What happened says the report's evidence is kept with the report and does not count as the correction; the reference itself is not shown (no read returns it; K-14). | L+T | K-14; design §2.3 item 5 |
| WP14-A24 | SuperAdmin (SA1); test | SA-08w (K-03) of A and B (§3 V13D-11); tests | Live: open SA-08w of A and of B (both already reported). Test: SA-08w of an unassigned application, of an application whose operator is suspended, and of a completed application; report one file; refusals as A20, A22. | SA-08w exists with the OP-08w anatomy on admin reads (`core.admin_case`, CW on the admin surface, opt. admin delivery read) and without the assignment condition: a SuperAdmin can report a file of an unassigned or completed application. Live: "Already reported" for A and B with their incident links. Test: accepted; the file blocked for good; 303 to SA-08i; the operator's pages show the same block. The route is `admin.incidents.disclosure` on POST `/admin/applications/:applicationId/disclosure`, registered in the inventory. SA-08o's disclosure kind keeps its "blocks no file" effect line (A42). | L+T | K-03 (R-03); Q-W14-02; P-20 disposition |

### 2.4 Post a disclosure notice: OP-08n and SA-08n (`ops.post_disclosure_notice`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP14-A25 | Operator (OP1) | OP-08n of A (§3 V13D-4) and of B (V13D-10) | Read the page. | Scope "One notice to each account that must get one. A notice cannot be changed or withdrawn after it is posted." The accounts table with one form per account whose notice is not posted (hidden `recipientAccountId`, `_rev.incident`). An account that received the file: the deletion request is offered ("Ask [name] to delete it"), also when it is the application's travel agent (K-06). Both roles (Y on A): radio, none preselected, "Ask them to delete it (they received the file)" / "Inform them (they are the application's travel agent)", hint "They get one notice for this incident. Choose the request to delete it when they hold a copy." Owning travel agent only (Y on B): "Inform [name]". Under each form "What [name] will read" from the TA-10n renderer with E-20. Effect: "A request to delete it asks them to delete every copy and to acknowledge it. The notice never says that the file was recalled." The compliance boundary. With 20 or more required entries: "Not every recipient may be listed." (K-05). | L | Design §2.6; K-05, K-06 |
| WP14-A26 | Operator (OP1); Y | OP-08n of A (§3 V13D-4); TA-10 | Choose "Ask them to delete it"; read the preview; post. | 303 to OP-08i; receipt "Notice posted" with "Notice [reference]"; Current: the row "Posted"; the notice item "Recorded". TA-10 of Y +1: "Delete a file that was sent to you in error" with "Delete every copy you hold" and acknowledgement needed; the text equals the preview. Nothing says "recalled" or "deleted". | L | Design §2.17; BS B13 |
| WP14-A27 | Operator; harness; test | Notice refusals (§3 V13D-5) | Harness: send the V13D-4 form again from a page loaded before the post (stale revision); then a new key with the current revision. Test: `not_affected`; an incident not open; another kind (404). | Stale: CMP-14 with "Notices posted" (yours / current), nothing recorded. Current revision: "A notice to [name] is already posted for this incident. Nothing new was posted." (`duplicate_operation`). `not_affected`: "This account cannot get that kind of notice. Choose the other kind." at `variant`. Not open: "This incident is no longer open: it is [state words] ([time] IST). Nothing was recorded." Another kind: uniform 404. TA-10 count unchanged. | L+T | §0.5; design §2.16, §2.18 |
| WP14-A28 | Test (`incident-task-pages.test.ts`; V13D-15) | The notice renderer and the deletion path | (1) Both variants, with and without release references. (2) An account that received the file and owns the application: post the deletion request. (3) A recipient that is not the owning travel agent. | (1) The information variant says only what the notice records (E-20): no "blocked", no "asked the recipient to delete it", no "recalled"; the preview equals the posted text. (2) The deletion request is posted to that account (ack needed); the information variant is then refused for it as a duplicate, and the page says so before the choice (K-06). (3) The recipient gets only the deletion request; the owning travel agent only the information. The remaining Core gap (Core lets "Inform" consume the only notice of a recipient that owns the application) is recorded in P-20. | T | K-06 (R-06); E-20 |
| WP14-A29 | Operator (OP1); Y | OP-08i of A after Y's acknowledgement (§3 V13D-4a) | Read "Accounts that must get a notice" and "Notices posted". | "Posted" and the count. The acknowledgement is not shown to staff (no read returns the notice's recipient or acknowledgement; STOP-W14-06): "Acknowledgement: not shown on this page"; "Partly met" (§6 Q-09). Never "deleted". | L | K-14; STOP-W14-06 |
| WP14-A135 (new) | Test | OP-08n, SA-08n and OP-08i with 20 and with 25 notice accounts (fixture) | Render; post every notice the page offers; resolve. | The page says "Not every recipient may be listed." whenever the read holds its 20-entry cap, and claims no complete list. The notice forms cover the accounts the read returns. A complete list and a correct "every notice posted" state are "Unmet: waits for P-20 item 3". | T | K-05 (R-05); P-20 item 3 |

### 2.5 Record evidence: OP-08e and SA-08e (`ops.record_incident_evidence`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP14-A30 | Operator (OP1) | OP-08e of A (§3 V13D-6, read only) | Read the page. | `h1` "Record evidence: [kind words]"; Scope "It is added to the incident and cannot be removed."; "Required to resolve" and "Evidence recorded" before the fields; evidence rows (at least one; kinds External reference, Document of this group, Recorded fact, My statement); "Note (optional)". Effect: "A reference or a document counts toward 'Evidence of what was done' and toward 'The correction'. Your statement alone counts toward neither. TravelMudra counts any reference or document recorded here as the correction: record only evidence that shows it." (K-01). Nothing is sent on `lane-ui` (A's correction must be the replacement). | L | Design §2.5; K-01 |
| WP14-A31 | Test; gallery | OP-08e and SA-08e accepted (V13D-16) | Record a statement; then an external reference. | Neutral receipt "Request recorded" each time; Current: the evidence count and the required items; after the statement the `evidence` item stays "Not recorded yet"; after the reference it is "Recorded". | T + gallery | Design §2.17 |
| WP14-A32 | Operator; test | Evidence refusals | (1) Live (V13D-6): send OP-08e of A with no row. (2) Test: kind blank with a reference; a document of another group; a malformed artifact reference; a closed incident; a stale revision; an operator without a relation. | (1) C1 "Record at least one piece of evidence."; nothing sent. (2) The WP-07 row sentences at the row; "This incident is no longer open …"; CMP-14; the shell. Values kept; nothing recorded. | L (1) + T | §0.5; design §2.16 |
| WP14-A33 | Test (`bff-incidents.test.ts`) | Every evidence-row handler | 11 rows; a row with only a note; a row with kind and no reference; a wholly empty row; gaps in the indexes; a reference of 201 characters. | 11 rows refused ("Give at most 10 pieces of evidence."), values kept; a partly filled row refused at its index (K-10); a wholly empty row omitted; every filled row reaches Core in index order; over-limit values refused at their field, never cut. | T | LD-17; K-10 |

### 2.6 Resolve (OP-08r, SA-08r) and close (OP-08i, SA-08i)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP14-A34 | Operator (OP1); test | OP-08r of A before the correction (§3 V13D-6), after it (V13D-8); OP-08r of B (V13D-9); parity test | Read at each step. Test: every combination of missing items against `missingEvidence` with the resolution's evidence. | A missing notice or association decision: no form; "Cannot be resolved yet:" with one line and link per item. Only `evidence` and/or `correction` missing (Q-W14-12): the form shows with "Add a reference or a document that shows [what was done / the correction] below. It is recorded with the resolution."; evidence rows then required; the correction line of A08 (what Core counts) above the rows, and "If a replacement result file is owed, record it on the outcome page first." (K-01). Nothing missing: the form with optional rows. Effect by kind (design §2.7 item 6): disclosure "+ The file stays blocked for good." The parity test shows the form exactly when Core would accept a resolution with evidence. | L+T | Q-W14-12; D-W14-10; K-01 |
| WP14-A35 | Operator (OP1) | OP-08r of A (§3 V13D-8) | Note "WP14 [stamp] replacement verified; deletion requested"; resolve. | 303 to OP-08i; neutral receipt "Request recorded"; Current "Resolved: waiting to be closed", the resolution with its note and time (from the incident row), the close form. TA-07 offers R-A2 only; R-A stays held. A leaves OP-08 (open list, delta −1). SA-08m "Releases to a wrong recipient" back to its P-0 value (B is not reported yet). | L | Design §2.7, §2.17 |
| WP14-A36 | Operator; harness; test | Resolve refusals | (1) V13D-6: harness resolve of A with a note, the current revision and no evidence. (2) Test: a blank note. (3) V13D-8: harness new-key resolve after the resolution. (4) V13D-9: tab 2. | (1) "The incident cannot be resolved yet. Still needed: The correction …" with its link (`incident_evidence_insufficient`); note kept; nothing recorded. (2) C1. (3) "This incident is no longer open: it is Resolved: waiting to be closed ([time] IST). Nothing was recorded." (4) CMP-14 (A94). | L ((1), (3), (4)) + T | §0.5; design §2.16 |
| WP14-A37 | Operator (OP1); harness | Close on OP-08i of A (§3 V13D-8) and of B (V13D-9a) | Read the close section; close A with a note and B without one. Harness: a new-key close of A. | Shown only on a resolved incident with the offer: Effect "Closing ends every duty on this incident: its owner and any reviewer no longer hold it. A closed incident cannot be reopened."; "Closing note (optional)"; button "Close the incident". Neutral receipt; Current "Closed [time] IST" with the K-11 words; every fact, item, evidence row and the resolution stay; no task link. New key: "This incident is not resolved, or it is already closed. Nothing changed." | L | Design §2.3 item 12, §2.16; K-11 |
| WP14-A38 | Test | Resolve and close after the application completed (V13D-14) | As SA1 and as a currently named reviewer: resolve and close. As the former operator: post the close. | Accepted for the SuperAdmin and for the current reviewer; the former operator's post → the shell (no relation after completion). The application stays completed; OP-07 and TA-07 completion facts unchanged. | T | K-14 (R-14); BS B13 |
| WP14-A133 (new) | Test; operator (observation) | B's resolution (§3 V13D-9) and fixtures | Resolve a disclosure whose only correction evidence is a reference unrelated to a replacement (B: `SYN-W14-[stamp]-REF-B`; fixture: the recipient's deletion-confirmation reference). | Core accepts the resolution: the page told the person what Core counts (A08, A30, A34). Enforcement of an actual correction (a replacement, or an evidenced decision that none is owed) is recorded "Unmet: waits for P-20 item 1", not as a WP-14 failure. | T (L observation) | K-01 (R-01); P-20 item 1 |

### 2.7 Open an incident: OP-08o and SA-08o (`ops.open_incident`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP14-A39 | Operator (OP1) | OP-08o of A (§3 V13D-12b) | Read the page. | OP-02 frame; `h1` "Open an incident: [applicant]"; Scope; "Open incidents of this application" first (from opt. CW, open states: kind, opened time, link; "None." or "cannot be read now") with "Opening the same incident again creates a second one."; "Kind" (radio, none preselected): Operational failure, Original's whereabouts uncertain (with the link to record a custody change instead), Correction after filing, each with the design's hint; "What happened" (required); evidence rows; Effect "TravelMudra opens the incident. You own it while you are this application's operator. It needs evidence of what was done before it can be resolved. It changes nothing on the application." No kind about result files or disclosures. | L | Design §2.10; CC-13 |
| WP14-A40 | Test; gallery | OP-08o accepted (V13D-16) | Open an operational failure. | 303 to OP-08i; neutral receipt "Request recorded" (K-07); Current: owner "You", "Evidence of what was done: Not recorded yet"; the classification "Not known yet" Core records shows only as A56 allows. | T + gallery | K-07 (R-07); design §2.17 |
| WP14-A41 | Operator (OP1); harness; test | OP-08o refusals (§3 V13D-12b) | (1) Send without a kind and a note. (2) Harness: kind `artifact_association` on A. (3) Test: OP1 on an application it is not assigned to; OP2 on A. | (1) C1 at each field; nothing sent. (2) Re-rendered OP-08o with "Operators open only an operational failure, an original's whereabouts uncertain or a correction after filing." at the kind (`not_operator_openable`), values kept (not the shell). (3) "Only the assigned operator …" state on GET; the post → the shell. Nothing recorded (incident count delta 0). | L ((1), (2)) + T | §0.5; design §2.16 |
| WP14-A42 | SuperAdmin (SA1); test | SA-08o without an application and with `?application=` C (§3 V13D-12a) | Read both. Choose each kind and read its hint. Test: an accepted open on an application. | `h1` "Open an incident". Without an application: "This incident is about no application. To open an incident about one application, start from that application's page." (no application input of any kind). With C: "About: [applicant] · [service] · Application [reference]" (opt. `core.admin_case`), C's open incidents listed first, hidden `applicationId` from the address only. "Kind": the eight kinds of design §2.15 without "Result file needs review" (Q-W14-03), each with its effect hint (disclosure: "It blocks no file and names no recipient. To block a released result file, the application's operator reports the release from the file. …"; byte integrity with an application: "While it is open, no file of this application is released …"). "Country, for a country rule defect": a select from Core's countries (opt. `cat.admin_index`; text fallback with the `cty_…` hint when unavailable). Effect "TravelMudra administration owns the incident: any SuperAdmin works it. The application's operator can read and work it too." Test: accepted → 303 to SA-08i; neutral receipt (K-07). | L+T | Q-W14-03; D-W14-07; design §2.10, §2.15 |
| WP14-A43 | SuperAdmin (SA1); test | SA-08o refusals | (1) Live (V13D-12a): choose "Operational failure" with a blank note. (2) Test: "Country rule defect" without a country; a forged `applicationId`; a kind outside the list (raw). | (1) C1 "Say what happened."; the kind stays chosen; nothing sent. (2) "Choose the country." at the country (`required`); a forged application → the shell; the raw kind refused at the field. SA-08o re-renders with values kept (no shell for a field refusal). Nothing recorded. | L (1) + T | §0.5; design §2.16, §2.19 |
| WP14-A44 | Test | SA-08o effects against Core | Open by hand: a disclosure on an application; a byte-integrity incident with and without an application; an operational failure; a country rule defect. Post `artifact_association` raw. | Each result matches its hint: the disclosure blocks the application's releases while open, no file for good, no recipient; byte integrity with an application blocks its releases, without one blocks nothing; operational failure and country defect get "Not known yet". The raw `artifact_association` post is accepted by Core and opens an incident that can never be resolved (STOP-W14-04 note; the page does not offer it). | T | WP-10 H-10; STOP-W14-04 |

### 2.8 SA-08 and SA-08i (SuperAdmin), S-09, and SA-08v (`ops.assign_incident_reviewer`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP14-A45 | SuperAdmin (SA1) | SA-08 (§3 V13D-11) | Open "Incidents & audit"; read "Needs a SuperAdmin" and "All open". | Rail members Incidents, Audit, Reporting health, Document checks, Measures (AM-W14-07). `h1` "Incidents"; lead "Every open incident, with its recorded owner. An incident can stay open after its application completed."; primary link "Open an incident" → SA-08o; views "Needs a SuperAdmin" (default) and "All open" with counts or "500 or more"; column "Owner (as recorded)"; the interim line above the table: "An incident keeps the owner recorded when it was opened or last moved. If its application's assignment has ended, no operator holds it now: a SuperAdmin can work it."; the resolved-incidents line; application cells link SA-04a. B's and C's incidents in "All open" with owner OP1; none in "Needs a SuperAdmin" (delta 0). | L | Design §2.2; K-04 interim |
| WP14-A46 | SuperAdmin (SA1) | SA-08i of B and its task pages SA-08e, SA-08n, SA-08r (§3 V13D-11) | Read; open each task link. | The frame of A06 with "Incidents & audit › Incidents › [kind words]"; links to SA-08e, SA-08n, SA-08r (the SuperAdmin works any incident); SA-08r shows the form with required evidence rows (only the correction missing, A34); SA-08n shows Y "Posted" and no form; "History of this incident" → SA-08s. Nothing is sent. | L | Design §2.3; A34 |
| WP14-A47 | SuperAdmin (SA1); test (`incident-host-pages.test.ts`) | SA-08i of C (§3 V13D-12) | Read; collect every form action on the page; harness: POST to `/admin/incidents/<C>/confirm-association`. Test: render every WP-14 page and every SA-08i kind with every offer allowed. | Seam item S-09: the "Result file association" section shows the facts and "The application's operator, or a reviewer you name, decides the association on the association review. A SuperAdmin names a reviewer only while the application has no active operator."; **no form**; nothing posts to `…/confirm-association` or `…/reject-association`. Every rendered form action is a registered POST route of the staff instance (method and pattern). The hand-made POST answers the uniform 404 and records nothing. | L+T | S-09 (PLAN §8); design §2.3 item 8, §7.2 |
| WP14-A48 | SuperAdmin (SA1); test | SA-08v (K-12) | Live: open SA-08v of C (§3 V13D-12). Test: SA-08v of an incident with no active operator; of an association incident; with a current reviewer. | Scope (K-12): "A reviewer is an active operator who works this incident while its application has no active operator. A reviewer reads it and, for a result file, takes a review copy. A reviewer outside the assignment cannot see the candidates' identity facts: they can reject the association or ask; they cannot confirm it until that evidence is available to them. A reviewer gets no other action on the application and no filing authority." Evidence: owner (as recorded), reviewer now, the application's operator line (opt. `core.admin_case`). "Reviewer" (radio of Core's list, none preselected; "(reviewer now)" marked); "Reason" (10 to 1,000). Effect: the incident moves to an operator when one is assigned; "+ [name] loses access … at once" with a current reviewer. | L (C) + T | K-12 (R-12); design §2.8; WP-08 E-01 |
| WP14-A49 | Test; gallery | SA-08v accepted (V13D-16) | Name OP2 on a SuperAdmin-owned incident of an unassigned application. | Neutral receipt "Request recorded"; Current owner "[OP2] (reviewer)"; SA-01 group 10 "Need a SuperAdmin" −1; OP2's OP-08 +1 ("You (reviewer)"). | T + gallery | Design §2.17 |
| WP14-A50 | SuperAdmin (SA1) | SA-08v of C (§3 V13D-12) | Read. | No form: "A reviewer is named only while the application has no active operator. Its operator owns this incident." (Core's `already_assigned`), with the route to reassign the application (SA-03c). | L | Design §2.8 states |
| WP14-A51 | Test | SA-08v refusals | A reason of 9 characters; a suspended operator; an operator assigned between the read and the send; a stale revision; a closed incident; an operator posting the form. | "Give a reason of at least 10 characters."; "That operator is not active or does not use an authenticator now. Choose another." at the reviewer; "The application now has an active operator, who owns this incident. A reviewer is no longer named. Nothing changed."; CMP-14; "This incident is no longer open …"; the shell. Values kept; nothing recorded. | T | §0.5; design §2.16 |
| WP14-A52 | SuperAdmin (SA1) | SA-08 and SA-08i | Look for an owner control. | No "Assign incident owner", "Take ownership" or "Reassign incident" control (CMD-55 not built); reviewer naming is the only assignment (D-W14-15). | L | SI CMD-55 |
| WP14-A134 (new) | Test | SA-08, SA-01 group 10 and the rail count after an application's assignment ended with an open disclosure (harness completion; V13D-14) | Read. | Interim (now): the incident is in "All open" with "Owner (as recorded)" naming the former operator and the interim line; the former operator cannot read it. Required behaviour "an ended-assignment incident enters SuperAdmin attention" ("Needs a SuperAdmin", SA-01 group 10, rail count) is "Unmet: waits for P-20 item 2" (Core serves the current duty holder); then the test asserts it. | T | K-04 (R-04); STOP-W14-01; P-20 item 2 |

### 2.9 SA-08f Classify the failure (`ops.classify_failure`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP14-A53 | Test; gallery | SA-08f of an operational failure | Render; render for another kind. | `h1` "Classify the failure: [kind words]"; Scope; the incident's evidence and the link "Earlier classifications" (SA-08s); "Scope" (radio, none preselected); "Country, only for a local failure" (Core's countries); "Shared component, only for a shared failure" (radio of eight, design words); evidence rows with the naming rule; "Reason" (10 to 1,000); Effect "It changes no application."; no revision. Another kind: uniform 404 (D-W14-11). A closed incident: "This incident is closed. Its classification does not change." with no form (Core would accept; the page does not offer it, D-W14-11). | T + gallery | Design §2.9 |
| WP14-A54 | Test | SA-08f accepted | Local with a country; unresolved with no component. | 303 to SA-08i; receipt "Classification recorded" with "Scope: [scope words]"; SA-08s of the incident lists `ops.failure_classified` with before and after. | T | Design §2.17 |
| WP14-A55 | Test (`bff-incidents.test.ts`) | SA-08f refusals and parsing | Shared with a statement only; shared without a component; a component with "Not known yet"; local without a country; a reason of 9 characters; an empty component with "Not known yet". | `failure_scope_evidence_missing` → "For a shared failure, give a reference or a document whose reference or note names the component." at the evidence; "Choose the shared component." / "Leave the shared component empty unless the failure is shared."; "Choose the country."; the reason sentence. The empty optional component is omitted and the classification is accepted (K-10). SA-08f re-renders with values kept (not the shell). | T | K-10 (R-10); design §2.16 |
| WP14-A56 | Test | SA-08i "Failure classification" | Render after a classification. | No incident read returns the classification (STOP-W14-05): SA-08i links "Earlier classifications are in this incident's history." (SA-08s) and states no current scope; "Partly met" (§6 Q-09). | T | K-14; STOP-W14-05 |

### 2.10 SA-08a and SA-08s Audit (conformance, design §2.14)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP14-A57 | SuperAdmin (SA1) | SA-08a (§3 V23S-2a) | Search with no filter; filter on application A; enter "someone@synthetic.test" as the actor; clear. | Freshness of the index in the lag form; meta "Searchable up to entry [n]". Each unusable value refused at its field with Core's message, nothing searched, values kept; the email reveals nothing about an account. Rows: recorded time and, when present, "Happened [time] IST"; kind of change; subject (link SA-08s); actor; "Retrospective" mark. Paging with no total. The address holds only references, enumerated values and dates (SH-R06). | L | Design §2.14; BS B33; SH-R06 |
| WP14-A58 | SuperAdmin (SA1) | SA-08s of A's disclosure incident, of R-A's artifact and of R-A's document version (§3 V23S-2a) | Read the histories. | Read from the fact log ("Read at"). Incident: `ops.incident_opened` (kind, owner, required items, file); `ops.incident_evidence_recorded` for the report (reported, recipients count, outside-records flag; the report note as reason) and for the notice (notice, recipient, variant); `ops.incident_resolved` (state change; no note: the resolution note is on the incident, A35); `ops.incident_closed` (state change; the closing note as reason). Artifact: `ops.artifact_eligibility_changed` to blocked. Version: `doc.version_blocked`. Each with recorded time, actor and role. The page asserts no field a subject does not record. | L | K-14 (R-14); §0.1 "Audit fields" |
| WP14-A59 | SuperAdmin (SA1) | One fact page (§3 V23S-2a) | Open the report fact. | Every recorded field (type, times, actor, command, scope, before, after, reason, evidence, retrospective note or "No reconstruction note was recorded"); no document content or file name. | L | BS B33 |
| WP14-A60 | Test (V23S-4) | SA-08a while the audit index is behind, failing or never run; SA-08s then | Render. | SA-08a: "Behind by [n] s when read at …" or "Freshness unavailable"; the no-match state adds "Entries recorded after entry [n] are not searchable yet." and never "Nothing recorded yet"; the index notice links SA-08h. SA-08s is unaffected ("Read at"). | T | Design §2.14; LD-08 |
| WP14-A61 | Test | SA-08a, SA-08s, SA-08h, SA-08d output | Fixtures with a file name, a URL, an extracted name and a credential-like note. | Diagnostics show allowlisted ids and error categories only; no file name, URL, document content, credential or extracted personal data. | T | BS B33 |

### 2.11 SA-08h Reporting health, SA-08m Monitors, SA-08q Measures (V23 SA-08 part)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP14-A62 | SuperAdmin (SA1) | SA-08h (§3 V23S-1) | Read. | `h1` "Reporting health" with the design's lead (privileged changes wait for the audit index; commands that read the records continue); "Read at". Derived views: summary "[u] of [t] derived views are not up to date: [names]" or, only when every judgement is healthy, "Every derived view was up to date when read at [time] IST."; table (view, state words, freshness lag form, "Current to", "Entries projected" or "Not recorded" — never 0 without a state row, "Not projected [n] facts", last run). Per view not up to date: its consequence, "Last problem: [words]", "Owner: engineering"; no server command. Reporting gaps (A63 rule). Document checks: "[k]" or "200 or more", facilities. No control on the page. | L | Design §2.11; F-W14-08, F-W14-09 |
| WP14-A63 | SuperAdmin (SA1); test | SA-08m (§3 V23S-2); SA-08h reporting gaps | Read. Test: null counts; measure results recomputation failed. | "Open now" with every count above 0; "Unavailable: [labels]" when any count is null; "Nothing monitored is open now." only when every count is known and zero. Per area: units, "None" for a known zero, "Unavailable" for null. The measure lines read "Measures with cases missing a value (recorded measure results): [n]" and "… with no data source yet (recorded measure results): [n]" with "Freshness unavailable", and never count toward "Nothing monitored is open now" or any all-clear (K-09). The boundary line (LD-04): "Sending the result and requesting completion are the assigned operator's explicit steps. They are not available in this release. …" with the `pendingBoundary` lag line; owner "product owner"; never "no product trigger". | L+T | K-09 (R-09); F-W06-09; F-W14-06; LD-04 |
| WP14-A64 | SuperAdmin (SA1) | SA-08q Measures (§3 V23S-2a) | Read. | Units on every count; "Not enough cases" below the minimum sample; missing values never 0; "Computed at [time] IST from entries up to [n]". "Deferred" when phase C (U7) is not built. | L | Design §2.14; Q-W14-08 |
| WP14-A65 | Test (V23S-4, V23S-5) | SA-08h, SA-08m, SA-08a, SA-01 during a projection outage; `views.projections`, `views.monitors`, `doc.queue` unavailable | Fail the audit projector (pattern "core restarted with its audit projector failing"); then make each read unavailable. | SA-08h names the audit index "Failing"/"Behind" with the privileged-change sentence and "Owner: engineering"; SA-08a "Freshness unavailable"; SA-08m and SA-01 name the view not current. Each unavailable read: its block "cannot be read now. Nothing is shown in its place."; never "Every derived view was up to date", "0", "None" or an all-clear; the recorded measure results never support one (K-09). An access refusal of any of them: the shell. | T | V23; K-09; design §6.4 |
| WP14-A66 | Test (V23S-4) | Commands during the outage of A65 | Record evidence, resolve, close, post a notice, run one check again; a privileged elevation. | The WP-14 commands are accepted (none has `privilegedElevation`) with receipts from the writer only; the elevation is refused (WP-01 B7). A task page whose required read fails shows "This step cannot be prepared now: [what] cannot be read. Try again later. Owner: TravelMudra." and no form. | T | V23; `kernel/command.ts:349`; design §2.0 |
| WP14-A67 | SuperAdmin; test (V23S-7, V23S-8) | Every SA-08 page; maintenance | Look for recovery controls. Test: admission closed during a requeue POST; reopen; a renderer sweep. | No "Restore", "Reopen", "Rebuild", server command, "0" for a null count, or success words with a null count. Closed admission: the status document (503), nothing recorded; after reopening the document still waits and nothing is requeued by itself; a lost answer resolves once through the operation page. The shell part is WP-01's (WP01-A78). | L+T | BS B39, B40; UX §6.3 |
| WP14-A136 (new) | SuperAdmin (SA1) | `/admin/queues/monitoring` (§3 V23S-2) | Open the old address. | 303 to `/admin/monitors#open` (Q-W14-07); the path stays registered (LD-03). | L | Q-W14-07; D-W14-12 |

### 2.12 SA-08d, SA-08c, SA-08b Document checks (`doc.requeue_check`, `doc.requeue_bulk`; CC-01)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP14-A68 | SuperAdmin (SA1); test | SA-08d (§3 V23S-3); fixtures | Read. Test: 0 entries; 3; 201 with the oldest 200 not requeueable. | Rail member "Document checks"; `h1` "Document checks that could not finish"; lead with the K-08 quarantine wording: "Documents whose malware scan or content check ended without a result. A file whose malware scan did not finish stays in quarantine; nothing passes without a check. A content check of a file that already passed its safety check reads its details again." Facilities in words. Count "[n] documents wait", or "200 or more documents wait; the oldest 200 are shown". Rows: purpose and reference; travel agent and group; waiting for; problem; received; action ("Run the check again" → SA-08c, or "None needed now"); no file name. The link "Run the waiting checks again" → SA-08b shows when any shown entry is requeueable **or the list is at its cap** (K-08). Empty: "No document waits for a check now." only below the cap. | L+T | K-08 (R-08); design §2.13 |
| WP14-A69 | Test; gallery | SA-08c | Render for a scan and for a parse entry; scanner down; file reader unknown. | Scope with purpose, travel agent, group, received; Evidence (waiting for, problem, facilities); the warning "The [malware scanner / file reader] does not answer now. The check would wait again." when its facility does not answer; "Reason" (1 to 500); Effect by stage (scan: quarantine until it passes; parse: "If the file already passed its safety check, only the reading of its details runs again."); hidden `stage` and `_rev.version`; the form stays (Core decides). | T + gallery | Design §2.13; K-08 |
| WP14-A70 | Test | SA-08c accepted | Send with a reason. | Neutral receipt on SA-08c; Current "Waiting for: [words]" or "Not waiting for a check now"; never "passed" or "safe". | T | Design §2.17 |
| WP14-A71 | Test | SA-08c refused | Stale revision; already requeued (fresh revision); blank reason; 501 characters; not in the queue; operator. | CMP-14 (Waiting for: you saw / now), reason kept; "This document does not need this check now: [words]. Nothing was sent again."; "Give a reason (up to 500 characters)." with the value kept; "This document does not wait for a check now." with no form; the shell. Nothing recorded. | T | §0.5; design §2.16, §2.18 |
| WP14-A72 | Test; gallery | SA-08b | Render with 3 waiting and with the 201-entry fixture. | Scope "Malware scans waiting: [s]; content checks waiting: [p]" with "or more" at the cap, and "TravelMudra takes the oldest waiting checks first, up to its limit for one request. Run it again for the rest."; facilities; "Checks" (radio, none preselected); reason; Effect "Each chosen document goes through the same check again. … A document whose check is already running is left out." with the K-08 quarantine wording. At the cap with no shown entry requeueable, the form stays with "None of the oldest 200 shown can be sent again; more documents may wait." (no "none" claimed). | T + gallery | K-08 (R-08); design §2.13 |
| WP14-A73 | Test | SA-08b accepted and refused | Send with 3 waiting; again (new key); with the 201-entry fixture where entry 201 needs a scan; a blank reason. | "Checks sent again" with "[n] documents: [s] malware scans, [p] content checks" from Core's summary (whole numbers, `scan + parse = requeued`); again: "No document waits for that check now. Nothing was sent again." at `stage`; the 201 fixture: accepted, entry 201 sent again; blank reason: C1, choice kept. | T | K-08; design §2.16, §2.17 |
| WP14-A74 | Test (`bff-document-checks.test.ts`) | SA-08c, SA-08b handlers and SA-08d address | Send `stage` of 17 and `limit` of 9 characters (raw); open `/admin/documents/queue?requeued=999`. | Sent whole and refused at the field (no `.slice`); the address shows no result (receipts come from the operation only). | T | LD-17; F-W14-07 |

### 2.13 SA-01 and pages of other packages

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP14-A75 | SuperAdmin (SA1) | SA-01 groups 10 and 16 (D-17) (§3 V23S-2) | Read; follow the links. | Group 10: "Need a SuperAdmin: [n] incidents" → `/admin/incidents?view=superadmin`; "Open in total: [m] incidents"; from `views.monitors.incidents` (null → "Unavailable"): "Releases to a wrong recipient: [d] open", "Result files under review or missing: [a] open", "Custody incidents: [c] open; original parts with holder uncertain: [p]". Group 16: link → SA-08h; "Document checks that could not finish: [k] documents" ("200 or more"; "Unavailable"), link SA-08d. Deltas from P-0 match the run (C +1 at Setup 4; A and B while open). | L | D-17; Q-W14-09 |
| WP14-A76 | Operator (OP1) | OP-01 "Continuing duties" (F-35); the rail count | Read after V13D-1 and V13D-9a. | Rows link OP-08i with WP-14 state and owner words; the rail count follows WP01-A21; deltas match OP-08. | L | F-35; WP01-A21 |
| WP14-A77 | Operator (OP1); test | OP-05 (E-21), OP-05r, OP-02 (F-34), SA-04a (I-14) | Follow "Report a release to a wrong recipient" on OP-05 (→ OP-08w with `version`); "Open the incident" (→ OP-08i); "Review the association" from C's OP-08i (→ OP-05r); OP-08i's "Record the correction" (→ OP-05 `#record-file`, WP-08 E-03). Test: SA-04a "Open an incident about this application" (→ SA-08o with `application`). | Each link opens its target; the association decision and the review copy happen only on OP-05r; the replacement only on OP-05. | L+T | E-21, F-34, I-14; WP-08 E-03 |
| WP14-A78 | Y | TA-07, TA-07d, TA-10, TA-10n, TA-07x of A and B (§3 V13D-3, V13D-4a, V13D-10a) | Read at each step; acknowledge A's notice. | A: the deletion request (A26), acknowledgement works (WP-08). B: TA-10n in E-20 words ("… was released to an account that was not entitled to it. TravelMudra is handling the correction. …"), no "blocked", no "asked the recipient to delete it". No page shows the incident, its owner, notes, another account or a candidate. TA-07 never offers a blocked file and never substitutes one. | L | BS B10, B12, B13; E-20 |
| WP14-A79 | Test (`incident-host-pages.test.ts`); operator; SuperAdmin | Every WP-14 page, OP-02 (every tab), OP-05, OP-05r, SA-04a, SA-08d, SA-08h, SA-08m | Run the test. Open OP-02 of A and SA-08d on `lane-ui`. | Each WP-14 POST path appears as a form action on exactly its host page of §1.2: evidence, notice and resolve only on OP-08e/SA-08e, OP-08n/SA-08n, OP-08r/SA-08r; report only on OP-08w and SA-08w; open only on OP-08o and SA-08o; reviewer only on SA-08v; classification only on SA-08f; the rechecks only on SA-08c and SA-08b; close only on OP-08i and SA-08i. The incident pages, the lists and SA-08d hold no other form; OP-02 and the case page hold links to OP-08w and OP-08o (F-34). The WP-07 and WP-08 carried-form tests drop their WP-14 rows. | L+T | K-13 (R-13); CC-17; design §1.5, §1.6, §7.2 |

### 2.14 Command results, access and shell on WP-14 pages

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP14-A80 | Operator; SuperAdmin | Every WP-14 page | Read the shell. | Environment label; "[TEST]"; rail current item (design §1.4: "Incidents and follow-up"; "My work" for OP-08w and OP-08o; "Incidents & audit" members; "Home" › "Monitors" for SA-08m); breadcrumbs of design §1.4; one `h1`; freshness per §0.2. | L | Design §1.4 |
| WP14-A81 | Operator; SuperAdmin; harness; test | Every accepted command; edited receipt addresses | Read each receipt. Test: an evidence key at `done=opened`; a resolve key at `done=closed`; another application's key; a refused key. | Named: `reported` "Release to a wrong recipient reported", `notice` "Notice posted", `classified` "Classification recorded", `checks` "Checks sent again". Neutral "Request recorded": `opened` (K-07), `evidence`, `resolved`, `closed`, `reviewer`, `requeued`. An edited address never shows another command's title (the `done=opened` case reads neutral); another application's key: "Request reference [key]. The receipt cannot be checked now."; a refused key: "Nothing is recorded for request [reference] so far". No accepted time, no actor. Nothing from the address. | L+T | K-07 (R-07); design §2.17; WP-01 A-04 |
| WP14-A82 | Operator; test | Receipt addresses of V13D-1, V13D-4 and V13D-8 opened after V13D-8 | Open each. | Each keeps what was recorded; later facts are "Current" ("Current: Closed"). No receipt tells anyone to act or claims a recall or a deletion. | L+T | WP-07 F-01, F-33 |
| WP14-A83 | Test | Lost acknowledgement per command; a refused send | Inject the fault. | 303 to `/<surface>/operations/<key>`; "Checking the original result", "Check status"; no new send of the same intent; `resultHrefOf` gives the incident page or the queue; a refused key "Nothing is recorded …". | T | Design §2.0; BS B35 |
| WP14-A84 | Test | Replay matrix per command | (1) Identical replay. (2) Changed content. (3) Business duplicate. (4) Raw stale envelope. (5a) Raw resend after facts changed. (5b) Corrected submission. | (1) Original result. (2) `conflict_operation_key`. (3) Report, notice: `duplicate_operation`; evidence: a second row recorded (no guard, STOP-W14-07); resolve, close: `incident_not_open`; open: a second incident (no guard); reviewer: one more naming fact; classification: an equal one supersedes; one recheck: `requeue_not_applicable` or `stale_revision`; bulk: `nothing_to_requeue` or only those that need it. (4) Notice, evidence, resolve, reviewer, one recheck: CMP-14; report, close, open, classify, bulk: the business check decides. (5a) Core decides on its facts. (5b) Accepted once. | T | Design §4.1; BS B35 |
| WP14-A85 | Operator (OP1); harness | The Nth time on the live steps | Replay terms 1 to 5 on the report (V13D-2), the notice (V13D-4, V13D-5), the resolution and the close (V13D-8). Term 3: Back after each receipt. | (1) Same 303 and receipt. (2) Refused as a used form, values kept. (3) Back reloads: OP-08w lists A's file as already reported (no form); OP-08n shows Y "Posted" (no form); OP-08r of a resolved incident shows "This incident is already resolved …" (no form); OP-08i of a closed incident shows no close form. (4) Recorded once. (5) As A83. | L+T | BS B35 |
| WP14-A86 | Test (`incident-words.test.ts`) | Text map of every reason code WP-14 pages can show | Unit test against Core's vocabulary. | Every code of design §2.16 and §0.5 has its sentence (`incident_evidence_insufficient`, `duplicate_operation`, `not_affected`, `incident_not_open`, the evidence-row codes, `not_operator_openable`, `required`, `not_applicable`, `already_assigned`, `not_active_operator`, `failure_scope_evidence_missing`, `requeue_not_applicable`, `nothing_to_requeue`, `notice_missing`, `version_blocked`, `compliance_notice_unselected`, `stale_revision`, `conflict_operation_key`); an unknown code shows the category text and "Reference code: [code]". | T | Design §2.16 |
| WP14-A87 | Operator; SuperAdmin | Every refusal reachable on `lane-ui` | Read each message. | CMP-07 at the field when Core names one; the owner or route where one exists; no code alone, "Something went wrong" or "Invalid data". A field refusal of open, classify or a recheck re-renders the task page with values kept, never the shell (F-W14-05). | L | Design §2.0, §2.16 |
| WP14-A88 | Y; operators; SuperAdmin | Every WP-14 page; Y's pages | Look for controls of other roles. | Y: no incident page, form or text. Operator pages: no reviewer naming, classification, SuperAdmin kinds, recheck or audit. Reviewer: no case action. SuperAdmin pages: no operator act control and no association decision. | L | BS B13, B18 |
| WP14-A89 | Test | Support views; read grant (K-15) | In an operator support view of OP1: open OP-08 and OP-08i and post each operator command. Open every `/admin` WP-14 page in a support view. An operator with a group read grant of the run's group. | Operator support view: OP-08 and OP-08i render OP1's scoped incident reads read-only with the support-view banner and no form or task link; each post is refused; nothing recorded. `/admin` pages: 409 `support_view_active`. Read grant: no incident read. Audit and support view stay distinct. | T | K-15 (R-15); UX §6.3 |
| WP14-A90 | Operator; SuperAdmin; Y | Every WP-14 page and Y's pages | Read all visible text. | Design §2.0 "Copy": no "recall", "recalled", "unsent", "retracted", "deleted" for a recipient's copy, "Override", "Reopen", "Restore", "Rebuild", "Something went wrong", "All current" or "Nothing needs attention" while a value is unknown, "0" for an unknown count; no "Owner not yet decided"; IST on every time; units; "Synthetic"; no package or lane record id; no configuration number the page does not read. | L | Design §2.0; PL §11.1 |
| WP14-A91 | Operator; SuperAdmin | Task pages | Inspect browser storage; read headers. | No note, reason, reference, recipient or evidence value in browser storage; `no-store`. | L+T | SH-R12 |
| WP14-A92 | `syn-ta-3`; OP2; harness | Foreign reads and posts (§3 X-1) | OP2 opens OP-08i of A and OP-08w of A; `syn-ta-3` opens TA-07 of A; harness posts a notice on A's incident path with B's incident id in the body. | Uniform 404 or SH-02; no fact of A; the mismatched post refused for access; nothing recorded. | L | BS B10 |
| WP14-A93 | Test (`bff-incidents.test.ts`, `bff-document-checks.test.ts`) | Every WP-14 handler | Each field one over Core's limit; each list one row over; partly filled rows; an empty optional component; the largest valid form. | Design §2.19 with K-10: refused at the field with values kept; no slice; only wholly empty rows omitted; an empty optional `originComponent` omitted; the largest valid form fits the body limit and reaches Core (a real HTTP test). | T | LD-17; K-10 |
| WP14-A94 | Operator (OP1), two tabs; test | OP-08r of B (§3 V13D-9); OP-08n (V13D-5); tests per design §2.18 | Tab 1 resolves B; tab 2 sends its resolution. | Tab 2: CMP-14 with the rows of design §2.18 (state, owner, reviewer, still needed, notices posted), the typed note and evidence kept as unsent values; no second resolution. "Who changed it and when" rows are absent. | L+T | Design §2.18; BS B19 |

### 2.15 Accessibility (AC-01 to AC-28 that apply)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP14-A95 | Keyboard-only operator and SuperAdmin | V13D-1, V13D-4, V13D-8, V13D-11, V13D-12a at 1440 px; V13D-1 and V13D-4 at 390 px | Use the keyboard only. | Views, filters, paging, release checkboxes, the variant radios, evidence rows, resolve, close, the SA-08o kinds, SA-08a filters: Tab, Shift+Tab, Enter, Space, Escape only. | L | AC-01, AC-12 |
| WP14-A96 | Keyboard-only user | Every WP-14 page at 1440 and 390 px and 400% zoom | Tab through. | Focus visible (3:1), never hidden by bars. | L | AC-02 |
| WP14-A97 | Phone user | OP-08, OP-08i, OP-08w, OP-08n, SA-08, SA-08i, SA-08a, SA-08d | 320 px; 1280 px at 400%. | One column; tables stack to labelled rows; the audit table only in a labelled scroll region; scope and effect before the fields; the primary action at the end, never in a fixed bar. | L | AC-04, AC-21; design §2.0 |
| WP14-A98 | Any | Every WP-14 form | Inspect. | Radio groups (`kind`, `scope`, `originComponent`, `reviewerAccountId`, `variant`, `stage`, `version`) as `fieldset` with `legend`, none preselected; the release checkboxes in a fieldset; labels and hints; required and optional stated. | L | AC-05, AC-15; design §5 |
| WP14-A99 | Any | States, items, facilities, projections | Greyscale. | Text for every state; no colour-only state. | L | AC-06 |
| WP14-A100 | Any | Every WP-14 form | Send with an error. | Focus to the error summary; links to fields and rows; values and choices kept. | L | AC-08 |
| WP14-A101 | Screen-reader user | Receipts; previews; boundaries | Read with a screen reader. | Receipts polite without moving focus; the notice preview a `section` with a heading, not a live region; boundaries in the page flow. | L | AC-09; design §5 |
| WP14-A102 | Screen-reader user | Each unavailable action (A34 list, A50, A69 warning, A21 notice) | Focus. | The reason exposed (`aria-describedby` or reading order); role-forbidden actions not shown. | L | AC-13 |
| WP14-A103 | Phone user | Every WP-14 page at 390 px | Measure. | Controls at least 24 × 24 px; primary actions at least 44 × 44 px; each OP-08n button names its account (WCAG 2.4.6). | L+T | AC-10; design §5 |
| WP14-A104 | — | Every WP-14 page | Contrast. | Text 4.5:1; non-text and focus 3:1. | L+T | AC-11 |
| WP14-A105 | Any | Long notes, names; reduced motion | A 2000-character note; a 400-character name. | Wraps; shortened table text has a full form reachable by keyboard and touch; no transition with reduced motion. | L | AC-14, AC-20 |
| WP14-A106 | Operator and SuperAdmin (observation) | OP-08i of A after V13D-8; SA-08 after V13D-11 | Ask OP1 "Was the file recalled?", "Can the travel agent still download R-A?", "Is the incident finished now?"; ask SA1 "Who owns B's incident, and who can block a released file when no operator is assigned?". | The run record reports answers and sample size; a wrong answer is a finding. No pass target. | L | AC-24, AC-26 |

### 2.16 axe checks (WCAG 2.2 A/AA)

Rule for every row: run axe (`@axe-core/playwright` 4.13.0, tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`,
`wcag22aa`) at 1440 × 900 and at 390 × 844. Expected: no violation of impact "serious" or "critical" at either width.
Record the counts of minor and moderate violations. Synthetic data only. "Gallery" rows run on the design's gallery
state. A127 is "Deferred" when phase C (U7) is not built.

| ID | Persona | Page (state) | Where | Source |
|---|---|---|---|---|
| WP14-A107 | Operator | OP-08 "Yours to act on" with rows (V13D-1a) | L | UX §7.5; AC-01 to AC-28 |
| WP14-A108 | Operator | OP-08 with a kind filter that matches nothing (V13D-1a) | L | same |
| WP14-A109 | Operator | OP-08i of C, association section (V13D-12c) | L | same |
| WP14-A110 | Operator | OP-08w of A (V13D-1) | L | same |
| WP14-A111 | Operator | OP-08w with the error summary (V13D-1) | L | same |
| WP14-A112 | Operator | OP-08i of A with the report receipt (V13D-1) | L | same |
| WP14-A113 | Operator | OP-08i of A open, notice and correction missing (V13D-1a) | L | same |
| WP14-A114 | Operator | OP-08r of A after the refused resolution (V13D-6) | L | same |
| WP14-A115 | Operator | OP-08i of A resolved, with the close form (V13D-8) | L | same |
| WP14-A116 | Operator | OP-08i of A closed (V13D-8) | L | same |
| WP14-A117 | Operator (reviewer) | OP-08 and OP-08i as a named reviewer | L (gallery) | same |
| WP14-A118 | SuperAdmin | SA-08 "All open" with the interim line (V13D-11) | L | same |
| WP14-A119 | SuperAdmin | SA-08o with the error summary (V13D-12a) | L | same |
| WP14-A120 | SuperAdmin | SA-08i of B (V13D-11) | L | same |
| WP14-A121 | SuperAdmin | SA-08v of C, `already_assigned` state (V13D-12) | L | same |
| WP14-A122 | SuperAdmin | SA-08i of C: association section, no form (V13D-12) | L | same |
| WP14-A123 | SuperAdmin | SA-08a filtered on A and with a field error (V23S-2a) | L | same |
| WP14-A124 | SuperAdmin | SA-08s of A's incident (V23S-2a) | L | same |
| WP14-A125 | SuperAdmin | SA-08h (V23S-1) | L | same |
| WP14-A126 | SuperAdmin | SA-08m (V23S-2) | L | same |
| WP14-A127 | SuperAdmin | SA-08q (V23S-2a) | L | same |
| WP14-A128 | SuperAdmin | SA-08d as `lane-ui` shows it (V23S-3) | L | same |
| WP14-A129 | SuperAdmin | SA-08d at the cap with a facility down; SA-08c and SA-08b with receipts and field errors | L (gallery) | same |
| WP14-A130 | SuperAdmin | SA-08a with the index behind; SA-08h with a failed projector | L (gallery) | same |
| WP14-A131 | Operator; SuperAdmin | Operation status page of a WP-14 command: accepted and "Nothing is recorded" | L | same |
| WP14-A132 | Y | TA-10n with A's deletion request before and after the acknowledgement (V13D-4a) | L | same |
| WP14-A137 (new) | Operator | OP-08e of A with the C1 error (V13D-6) | L | same |
| WP14-A138 (new) | Operator | OP-08n of A (both variants) and of B (Inform) (V13D-4, V13D-10) | L | same |
| WP14-A139 (new) | Operator | OP-08r of A with the form and required evidence rows (V13D-6); OP-08r of B with CMP-14 (V13D-9) | L | same |
| WP14-A140 (new) | Operator | OP-08o of A with the C1 error (V13D-12b) | L | same |
| WP14-A141 (new) | SuperAdmin | SA-08o without an application and with `?application=` C (V13D-12a) | L | same |
| WP14-A142 (new) | SuperAdmin | SA-08w of A and B, "Already reported" (V13D-11) | L | same |
| WP14-A143 (new) | SuperAdmin | SA-08v (allowed) and SA-08f with errors | L (gallery) | same |
| WP14-A144 (new) | SuperAdmin | SA-08e, SA-08n, SA-08r of B (V13D-11) | L | same |

## 3. Proof scenarios V13 (disclosure part) and V23 (SA-08 part)

V13 (UX §12): "Issued result with wrong/missing artifact keeps outcome but blocks release; ambiguous association goes
to scoped review. Replaced/revoked artifact never silently substitutes." Authority B12, B13. WP-08 proves the
outcome, association and replacement parts; WP-14 proves the disclosure, notice and closure parts and S-09.

V23 (UX §12): "Projection outage reports uncertainty without fabricated zero/success; authoritative commands continue
only when required current evidence/controls work. Maintenance/restore remains closed." Authority B33, B38 to B40.
WP-01 proves the shell part (WP-01 §3 V23 parts A to C); WP-14 proves the SuperAdmin reporting and degradation views.
`lane-ui` cannot close admission or fail a projector (P-03 parked): those steps are tests, as WP-01 decided.

One ordered recipe (K-13): the design's §6 with a fresh travel agent per run. Rows are in run order; the design's step
ids are kept, so V13D-10 and V13D-11 run before V13D-9 (V13D-9 needs B's incident). Lettered steps (V13D-1a, …) add
observations this checklist needs, on the same data and within the approved writes. "Setup" steps use pages of earlier
packages; "Observe" steps check items other packages own.

| Step | Actor, page | Action | Observable result | Items | Where |
|---|---|---|---|---|---|
| P-0 | OP1, OP2: OP-08, OP-01; SA1: SA-01, SA-08m, SA-08, SA-08d, SA-08h | Read the counts and states. | The run record holds the baselines of §0.4. | — | L |
| Setup 0 | SA1 (SA-06) | Create and activate Y `wp14-ta-[stamp]` (or record the fallback). | Y signs in through the harness. | — | L |
| Setup 1 | Y (TA-09, TA-08) | Create group `wp14-[stamp]`; submit A, B and C on "SYN Tourist e-visa". | Three submitted applications. | — | L |
| Setup 2 | SA1 (SA-07a, SA-03a) | Record "Payment received"; assign A, B, C to OP1. | Assigned. | — | L |
| Setup 3 | OP1 (OP-02, OP-04) | Start work, readiness, authorization, "Filed" with `SYN-W14-[stamp]-PORTAL-[letter]`. | Filed. | — | L |
| Setup 4 | OP1 (OP-05) | Record "Issued" with R-A, R-B, R-C; reload after the checks. | R-A and R-B verified; C "Waiting for review" with an association incident (observe WP08-A17); SA-01 "Open in total" +1. | A75 | L |
| Setup 5 | Y (TA-07d) | Download R-A; keep the tab open. | "Sent in full on [time] IST"; one release. | — | L |
| V13D-1 | OP1: OP-05 of A → OP-08w | Read. Send with nothing chosen. Choose Y's download; note "WP14 [stamp] released through the wrong case"; report. | Effect and review before the button; the C2 sentence at the fieldset, nothing recorded; then 303 to OP-08i with "Release to a wrong recipient reported", Current blocked file, required items, the B-09 boundary. | A16, A18, A20 (1), A110 to A112 | L |
| V13D-1a | OP1: OP-08; OP-08i of A | Read both views and the filters. Read the incident page. | A's and C's incidents "Yours to act on"; the disclosure section with ids only, the accounts table, the report-evidence sentence; Required to resolve with the K-01 correction line; Next step "Post the notice to [Y]". | A01, A02, A06, A07, A08, A15, A76, A107, A108, A113 | L |
| V13D-2 | Harness | Resend V13D-1 (same `_op`); post again with a new `_op`; press Back on OP-08w. | Same 303 and receipt; then "This file is already reported. Nothing new was recorded." with the incident link; one incident; Back shows "Already reported", no form. | A17, A85 | L |
| V13D-2a | OP2; `syn-ta-3`; harness | OP2 opens OP-08w of A and posts the report; `syn-ta-3` posts it. | Shell; no fact of A; nothing recorded. | A20 (5), A92 | L |
| V13D-3 | Y: TA-07, TA-07d (tab of Setup 5), TA-10 | Read; post the old download form. | Outcome "Issued"; R-A held; `version_blocked`; no substitute; TA-10 delta 0. | A19, A78 | L |
| V13D-3a | OP1: OP-05, OP-06, OP-07 of A; SA1: SA-08m | Read. | Blocked file words; Core's artifact row; disclosures +1. | A19 | L |
| V13D-4 | OP1: OP-08n of A | Read (Y has both roles: two choices, none preselected); choose "Ask them to delete it"; read the preview; post. | Receipt "Notice posted"; Y "Posted"; TA-10 of Y +1 with the text of the preview. | A25, A26, A138 | L |
| V13D-4a | Y: TA-10, TA-10n; OP1: OP-08i of A | Read; acknowledge ("I deleted it: acknowledge"). OP1 reads. | Acknowledgement recorded (observe WP-08); OP-08i: "Posted", acknowledgement not shown, no "deleted". | A29, A78, A132 | L |
| V13D-5 | Harness | Post the V13D-4 form again from a page loaded before V13D-4; then with the current revision and a new `_op`. | CMP-14 with "Notices posted"; then "A notice to [Y] is already posted …"; one notice in TA-10. | A27, A85 | L |
| V13D-6 | OP1: OP-08e of A (read; send with no row); OP-08r of A; harness | Read OP-08e and send it empty. Read OP-08r (only the correction missing). Harness: resolve with a note, the current revision and no evidence. | OP-08e: the K-01 effect text; C1, nothing sent. OP-08r: the form with required evidence rows, the K-01 correction text and "If a replacement result file is owed, record it on the outcome page first."; the harness resolve refused: "Still needed: The correction …"; nothing recorded. | A30, A32 (1), A34, A36 (1), A114, A137, A139 | L |
| V13D-7 | OP1 (Setup, WP-08 E-03): OP-08i → "Record the correction" → OP-05 of A; OP-08i; Y: TA-07 | Record R-A2 as the replacement of R-A for the incident; reload after the check; read. | R-A2 verified; "The correction: Recorded"; Next step "Resolve the incident"; TA-07 offers R-A2 only, R-A never. | A07, A08, A19, A77 | L |
| V13D-8 | OP1: OP-08r, then OP-08i of A; harness | Resolve with "WP14 [stamp] replacement verified; deletion requested"; harness: replay, then a new-key resolve; press Back. Close with "WP14 [stamp] closed"; harness: a new-key close. | Neutral receipts; "Resolved: waiting to be closed" with the note; the new-key resolve "This incident is no longer open …"; Back shows no resolve form; the close effect text; "Closed" (K-11 words); the new-key close "… already closed. Nothing changed."; A leaves OP-08; OP-02's incidents table shows "Closed". | A35, A36 (3), A37, A85, A115, A116 | L |
| V13D-10 | OP1: OP-08w of B; OP-08n of B | Report B with no release and the external reference `SYN-W14-[stamp]-MAIL` ("WP14 [stamp] the operator's own email went to a wrong address"); post the notice (one fixed choice "Inform [Y]"). | Required: the correction and Y's notice; the report's evidence not shown; the information notice posted. | A23, A25, A26, A138 | L |
| V13D-10a | Y: TA-10, TA-10n of B | Read. | E-20 words; no "blocked", no "asked the recipient to delete it", no "recalled". | A28 (observe), A78 | L |
| V13D-11 | SA1: SA-08; SA-08i of B; SA-08e, SA-08n, SA-08r of B (read); SA-08w of A and B | Read; nothing is sent. | "All open" with B and C, "Owner (as recorded)", the interim line; SA-08i links the task pages; SA-08r shows the form (only the correction missing); SA-08n shows Y "Posted"; SA-08w "Already reported" for both. | A24, A45, A46, A118, A120, A142, A144 | L |
| V13D-9 | OP1, two tabs of OP-08r of B | Tab 1: note "WP14 [stamp] resolved" with the reference `SYN-W14-[stamp]-REF-B` in the required row; resolve. Tab 2: send. | Tab 1 accepted (Core counts the reference as the correction: A133, "Unmet: waits for P-20 item 1"); tab 2: CMP-14 with the current state; one resolution. | A34, A36 (4), A94, A133, A139 | L |
| V13D-9a | OP1: OP-08i of B | Close without a note. | Neutral receipt; "Closed"; OP-01 "Continuing duties" and OP-08 back to their P-0 values plus C. | A37, A76 | L |
| V13D-12 | SA1: SA-08i of C; SA-08v of C; harness | Read; collect every form action; post to `/admin/incidents/<C>/confirm-association`. | S-09: the association section with the sentence and no form; every form action registered; SA-08v of C: the K-12 scope and the `already_assigned` state with no form; the hand-made post 404, nothing recorded. | A47, A48, A50, A121, A122 | L |
| V13D-12a | SA1: SA-08o; SA-08o `?application=<C>` | Read both; choose each kind; send "Operational failure" with a blank note. | Eight kinds with effect hints; no application input; C's open incidents listed; C1 "Say what happened.", nothing sent. | A42, A43 (1), A119, A141 | L |
| V13D-12b | OP1: OP-08o of A; harness | Read; send without a kind and a note; harness: kind `artifact_association`. | The three operator kinds; C1; the `not_operator_openable` sentence on the re-rendered page; nothing recorded. | A39, A41 (1), (2), A140 | L |
| V13D-12c | OP1: OP-08i of C | Read; follow "Review the association". | No decision form; OP-05r opens (observe WP-08). | A06, A09, A77, A109 | L |
| V13D-13 | Test | Reviewer B named while reviewer A works an incident with no active operator; then an operator assigned. | As A12. | A11, A12 | T |
| V13D-14 | Test | Assignment ended (harness completion) with an open disclosure. | The former operator: 404; SA-08i completion from `core.admin_case`; SA-08 "as recorded" with the interim line; resolve and close by the SuperAdmin and by a current reviewer; the attention assertion Unmet (P-20 item 2). | A04, A13, A38, A134 | T |
| V13D-15 | Test | E-20 renderer: both variants, with and without release references; the K-06 deletion path. | As A28. | A28 | T |
| V13D-16 | Test | SuperAdmin open, reviewer naming, classification, evidence records, SA-08w reports, notice caps, parsing. | As the items. | A22, A24, A31, A33, A40, A42 to A44, A49, A51, A53 to A56, A135 | T |
| V23S-1 | SA1: SA-08h | Read. | Each derived view with words and the lag form; "Read at"; reporting gaps as recorded measure results; document checks; no server command or recovery control. | A62, A63, A125 | L |
| V23S-2 | SA1: SA-08m; SA-01; `/admin/queues/monitoring` | Read; open the old monitoring address. | Units; "None" for a known zero; no success line unless every count is known; measure lines with freshness unavailable and outside any all-clear; LD-04 boundary with the lag line; SA-01 groups 10 and 16 with the document-checks line; the 303 to `#open`. | A63, A75, A126, A136 | L |
| V23S-2a | SA1: SA-08a; SA-08s of A's incident, R-A's artifact and R-A's version; one fact page; SA-08q | Search; filter on A; the email value; read the histories and the fact; read measures. | As A57 to A59, A64. | A57, A58, A59, A64, A123, A124, A127 | L |
| V23S-3 | SA1: SA-08d; SA-08c of a waiting document if one exists | Read. Run one check again only for a document whose group carries the run's tag (otherwise V23S-6 covers it). | Facilities in words; count or "200 or more"; no file name; the bulk link per K-08. | A68, A128 | L |
| V23S-4 | Test (pattern "core restarted with its audit projector failing", `ported-pages.test.ts`) | Read SA-08h, SA-08a, SA-08m, SA-01; record evidence, resolve, close, post a notice, run one check again; request a privileged elevation. | As A60, A65, A66. | A60, A65, A66 | T |
| V23S-5 | Test | `views.projections`, `views.monitors`, `doc.queue` answer `unavailable_dependency`; then an access refusal. | Each block "cannot be read now"; no all-clear, "0" or "None"; the shell for the access refusal. | A14, A21, A65 | T |
| V23S-6 | Test; gallery | Document checks: facilities unknown and down; entries at the cap; one and bulk rechecks accepted and refused. | As A68 to A74. | A68 to A74, A129 | T + gallery |
| V23S-7 | Test | Admission closed during a recheck POST; reopen. | As A67. | A67 | T |
| V23S-8 | Test | Renderer sweep over every SA-08 page. | As A67 and A90. | A67, A90, A130 | T |
| X-1 | `syn-ta-3`; OP2; harness | The isolation reads and posts of A88 and A92. | Not found or SH-02; nothing recorded. | A88, A92 | L |
| X-2 | Test | The test parts of the items not named above: A03, A05, A07 to A10, A17, A20, A27, A32, A34, A36, A41, A47, A48, A61, A63, A67, A77, A79, A81 to A84, A86, A89, A91, A93, A94, A103, A104. | As the items. | as listed | T |
| X-3 | axe | Every page and state visited above, and TA-10n. | No serious or critical violation at 1440 px and 390 px. | A107 to A116, A118 to A128, A131, A132, A137 to A142, A144 | L |
| X-4 | axe (gallery) | A117, A129, A130, A143. | As X-3. | A117, A129, A130, A143 | L |
| X-5 | Keyboard-only, screen-reader and phone users; SA1; OP1 | During V13D-1, -4, -8, -11, -12a and V23S-1: the accessibility checks, the shell, the copy and refusal text, the owner-control check, the observation questions. | As the items. | A52, A80, A87, A90, A95 to A106 | L |

Proof split. V13 (disclosure part) passes when P-0, Setup and V13D-1 to V13D-12c pass on `lane-ui` at the integrated
WP-14 commit and V13D-13 to V13D-16 pass as named tests. V23 (SA-08 part) passes when V23S-1 to V23S-3 pass on
`lane-ui` and V23S-4 to V23S-8 pass as named tests (P-03 parked). Part X belongs to both. Recorded, not failed: A133
"Unmet: waits for P-20 item 1"; A134 "Unmet: waits for P-20 item 2"; A135 (complete list) "Unmet: waits for P-20 item
3"; A04, A29, A56 "Partly met"; A64 and A127 "Deferred" when phase C is not built. Boundaries stated, not crossed:
applicant, regulator and legal notices (B-09); completion (LD-04). The run record names the `lane-ui` ref, the run tag,
the travel agent used, the group, each test, the identifiers (internal record only) and every delta.

## 4. Scenario parts outside these proofs (traceability)

| Scenario part | Where it is proven |
|---|---|
| V13: issued without a correct file keeps the outcome and withholds release; association review; replacement never substitutes | WP-08 (WP08-A15 to A30, A154, A155; WP-08 §3 V13) |
| V13: the incident-scoped replacement form, also after completion | WP-08 (E-03, WP08-A154); set-up of V13D-7 |
| V23: rail counts, freshness wording, maintenance page, restore stays closed, privileged elevation waits | WP-01 (§3 V23 parts A to C; WP01-A21, A78) |
| SA-01 group mechanics | WP-06 (WP06-A05 to A09); D-17 lines here (A75) |
| OP-01 "Continuing duties" | WP-07 (WP07-A07); F-35 links here (A76) |
| How follow-up, post-filing-correction and custody incidents open | WP-11, WP-12 and Core; WP-14 shows and works them (A10) |
| Protection-mark resolution | WP-11 (SA-09m) |
| TA-10n page and acknowledgement | WP-08; E-20 words checked here (A28, A78) |
| Intake incidents | WP-18 |
| Applicant, regulator and legal notices | Separately authorized compliance work (B-09): boundary only (A15) |

## 5. Out of scope and boundaries

These MUST NOT appear on any WP-14 page:

- A confirm or reject association form on SA-08i, or any form whose action has no registered route (S-09).
- A form outside its host page of §1.2 (K-13), apart from close on the incident pages.
- A "Recall", "Retract", "Unsend" or "Block this version" control, or text that claims a recall or a deletion (B13, B45).
- An "Assign incident owner", "Take ownership" or "Reassign incident" control (CMD-55).
- `artifact_association` on SA-08o; an application reference typed by hand on SA-08o (Q-W14-03; D-W14-07).
- A restore, reconstruction, replay, rebuild, "Reopen" or "Force" control, or a server command (B39, B40).
- A zero, an empty state, "all current" or an all-clear in place of a count or list that cannot be read, or one that
  rests on recorded measure results (D7; K-09; V23).
- A "none" or a total inferred from a capped list (K-05, K-08).
- An instruction to perform an external act (F-33); a result shown from the page address; an accepted time; a named
  receipt the operation does not establish (K-07).
- Earlier facts after an access change (LD-14); a truncated field or a dropped row (LD-17; K-10).
- An audit fact not recorded on that subject, or a fact reconstructed from clock order (K-14; I-10).
- File names, document content, URLs, credentials or extracted personal data in diagnostics (B33).
- An incident page, incident text or another account's facts on a travel-agent page (B10).

Recorded as pending, not as failures (§0.2 "Pass rule"):

- Actual-correction enforcement: "Unmet: waits for P-20 item 1" (A133).
- An ended-assignment incident in SuperAdmin attention: "Unmet: waits for P-20 item 2" (A134).
- The complete required-item and notice lists beyond 20 entries: "Unmet: waits for P-20 item 3" (A135).
- The completion flag in lists, the staff view of a notice's acknowledgement, the current classification: "Partly met"
  (A04, A29, A56; STOP-W14-03, -05, -06, criterion point 2 unproven, K-16).

Deferred in WP-14 (the run record lists each as "Deferred"):

- SA-08q when phase C (U7) is not built (A64, A127).
- Live outages, maintenance, the document-checks commands, SuperAdmin open, reviewer naming, classification and evidence
  records: tests and the gallery (A11, A31, A40, A49, A53 to A56, A60, A65 to A74; approved writes Q-W14-06; P-03).
- Non-result documents in OP-08w (Q-W14-10, later).

Not in WP-14: the association decision, the review copy and the replacement file (WP-08); intake incidents (WP-18);
privileged elevation and read grants (WP-15); protection marks (WP-11); classification of tasks, intake attempts and
applications (no page; D-W14-11).

## 6. Questions for the architect (ranked)

Kept as asked, with each answered row reduced to its answer; Q-04 is rewritten and Q-15 is new. `WP-14.md` §3 and §4.1 answer: Q-01 → Q-W14-02 and K-03 (SA-08w built in WP-14, no Core change; A24);
Q-02 → Q-W14-04, E-20 (A28, A78); Q-03 → K-01, P-20 item 1 with Max ("Unmet", A133); Q-04 → K-02 (rewritten below:
the containment route); Q-05 → STOP-W14-03 (P2, criterion point 2 unproven, K-16); Q-06 → SA-08o effect text and the
K-04 interim (A42, A134); Q-07 open (P2, Core note); Q-08 → Q-W14-03, STOP-W14-04 (A42, A44); Q-09 → STOP-W14-05, -06
(P2, K-16); Q-10 → D-W14-11; Q-11 → Q-W14-08 (Measures in U7) and Q-W14-07 (the monitoring path 303); Q-12 → K-12
(A48); Q-13 → Q-W14-09, D-17 (A75); Q-14 → design §1.7 order (WP-14 after WP-08). Q-15 is new (P2).

| ID | Rank | Question | Concrete scenario | PM recommendation |
|---|---|---|---|---|
| Q-01 | P1 | A SuperAdmin had no route to report a release to a wrong recipient. | Answered: SA-08w (K-03). | — |
| Q-02 | P1 | The travel agent's information notice claimed a block and a deletion request it does not record. | Answered: E-20. | — |
| Q-03 | P1 | Any recorded reference counts as the correction. | Answered: K-01; P-20 item 1 with Max. | — |
| Q-04 | P1 | K-02 names an application-scoped disclosure incident through OP-08o as the temporary containment while the delivery records cannot be read. Core refuses that kind from an operator (`not_operator_openable`; operators open only operational failure, custody discrepancy and correction after filing), and neither operator kind blocks a release. | The delivery read fails; OP1 knows A's file went to a wrong account; OP-08w shows no form and points to OP-08o; OP-08o offers no kind that blocks releases; the file keeps being released until a SuperAdmin acts. Likelihood: low (an outage at the moment of a disclosure); harm: high (further disclosure). | Read K-02's containment as the SuperAdmin's SA-08o disclosure kind on the application (A21 writes it so, with the owner "TravelMudra administration" on the operator's page); the architect confirms or amends K-02. A new operator kind would be a Core change (Kind 2), not recommended. |
| Q-05 | P2 | Resolved incidents are in no list. | A resolved incident is never closed. | STOP-W14-03 parked (criterion point 2 unproven). |
| Q-06 | P2 | SuperAdmin-opened incidents are owned by TravelMudra administration on assigned applications. | Answered by the effect text; no owner command. | — |
| Q-07 | P2 | Core keeps the first 1,000 characters of an incident note accepted up to 2,000 (`commands/incidents.ts:154, 218, 276, 331`). | OP1 writes 1,500 characters; the audit keeps 1,000 without a message. Likelihood: low; harm: medium (B33). | Core defect note to the orchestrator; pages cut nothing (LD-17). |
| Q-08 | P2 | A hand-opened association incident can never be resolved. | Answered: not offered (Q-W14-03); STOP-W14-04 failing test first (P-20 disposition). | — |
| Q-09 | P2 | Facts no read returns to staff: completion in lists, notice recipient and acknowledgement, current classification. | Answered: interims; criterion point 2 unproven (K-16). | — |
| Q-10 | P2 | Classification of tasks, intake attempts and applications has no page. | Answered: D-W14-11. | — |
| Q-11 | P2 | Scope of Measures and the monitoring queue. | Answered: Q-W14-07, Q-W14-08. | — |
| Q-12 | P2 | A reviewer outside the assignment cannot confirm an association. | Answered: K-12 states it. | — |
| Q-13 | P2 | SA-01 had no document-checks count. | Answered: D-17. | — |
| Q-14 | P2 | The live V13 proof needs WP-08 and its result generator. | Answered: WP-14 builds after WP-08. | — |
| Q-15 | P2 | The fresh travel agent per run (K-13) adds an account creation that the approved writes Q-W14-06 (design §6.2, `syn-ta-1`) do not list. | A rerun on a crowded `lane-ui` creates one more synthetic travel agent per run. Likelihood: certain per run; harm: low (synthetic, tagged). | Use the fresh travel agent as K-13 says, with the `syn-ta-1` fallback recorded; the architect confirms the write under Q-W14-06. |

## 7. Sign-off

| Field | Value |
|---|---|
| Verified on (date, IST) | |
| Installation and ref (`uat.py status lane-ui` output: commit or tag) | |
| Lane commit of the tests named for `T` items | |
| Run tag, travel agent used, group label and identifiers (internal record reference) | |
| Baselines (P-0) and the deltas observed | |
| Browsers and versions | |
| Assistive technology used | |
| V13 disclosure part result (steps; where shown) | |
| V23 SA-08 part result (steps; tests) | |
| Phase C (U7, Measures) built (yes / no) | |
| P-20 items in force at the run (1 to 3) | |
| Deferred items (reference each) | |
| Partly met and Unmet items (decision reference) | |
| Open findings (ID, rank, scenario) | |
| Signed by (role and name) | |

Result per item (Pass, Fail, Blocked, Partly met, Unmet, Deferred or Not run; evidence reference; note):

| ID | Result | Evidence | Note |
|---|---|---|---|
| WP14-A01 | | | |
| WP14-A02 | | | |
| WP14-A03 | | | |
| WP14-A04 | | | |
| WP14-A05 | | | |
| WP14-A06 | | | |
| WP14-A07 | | | |
| WP14-A08 | | | |
| WP14-A09 | | | |
| WP14-A10 | | | |
| WP14-A11 | | | |
| WP14-A12 | | | |
| WP14-A13 | | | |
| WP14-A14 | | | |
| WP14-A15 | | | |
| WP14-A16 | | | |
| WP14-A17 | | | |
| WP14-A18 | | | |
| WP14-A19 | | | |
| WP14-A20 | | | |
| WP14-A21 | | | |
| WP14-A22 | | | |
| WP14-A23 | | | |
| WP14-A24 | | | |
| WP14-A25 | | | |
| WP14-A26 | | | |
| WP14-A27 | | | |
| WP14-A28 | | | |
| WP14-A29 | | | |
| WP14-A30 | | | |
| WP14-A31 | | | |
| WP14-A32 | | | |
| WP14-A33 | | | |
| WP14-A34 | | | |
| WP14-A35 | | | |
| WP14-A36 | | | |
| WP14-A37 | | | |
| WP14-A38 | | | |
| WP14-A39 | | | |
| WP14-A40 | | | |
| WP14-A41 | | | |
| WP14-A42 | | | |
| WP14-A43 | | | |
| WP14-A44 | | | |
| WP14-A45 | | | |
| WP14-A46 | | | |
| WP14-A47 | | | |
| WP14-A48 | | | |
| WP14-A49 | | | |
| WP14-A50 | | | |
| WP14-A51 | | | |
| WP14-A52 | | | |
| WP14-A53 | | | |
| WP14-A54 | | | |
| WP14-A55 | | | |
| WP14-A56 | | | |
| WP14-A57 | | | |
| WP14-A58 | | | |
| WP14-A59 | | | |
| WP14-A60 | | | |
| WP14-A61 | | | |
| WP14-A62 | | | |
| WP14-A63 | | | |
| WP14-A64 | | | |
| WP14-A65 | | | |
| WP14-A66 | | | |
| WP14-A67 | | | |
| WP14-A68 | | | |
| WP14-A69 | | | |
| WP14-A70 | | | |
| WP14-A71 | | | |
| WP14-A72 | | | |
| WP14-A73 | | | |
| WP14-A74 | | | |
| WP14-A75 | | | |
| WP14-A76 | | | |
| WP14-A77 | | | |
| WP14-A78 | | | |
| WP14-A79 | | | |
| WP14-A80 | | | |
| WP14-A81 | | | |
| WP14-A82 | | | |
| WP14-A83 | | | |
| WP14-A84 | | | |
| WP14-A85 | | | |
| WP14-A86 | | | |
| WP14-A87 | | | |
| WP14-A88 | | | |
| WP14-A89 | | | |
| WP14-A90 | | | |
| WP14-A91 | | | |
| WP14-A92 | | | |
| WP14-A93 | | | |
| WP14-A94 | | | |
| WP14-A95 | | | |
| WP14-A96 | | | |
| WP14-A97 | | | |
| WP14-A98 | | | |
| WP14-A99 | | | |
| WP14-A100 | | | |
| WP14-A101 | | | |
| WP14-A102 | | | |
| WP14-A103 | | | |
| WP14-A104 | | | |
| WP14-A105 | | | |
| WP14-A106 | | | |
| WP14-A107 | | | |
| WP14-A108 | | | |
| WP14-A109 | | | |
| WP14-A110 | | | |
| WP14-A111 | | | |
| WP14-A112 | | | |
| WP14-A113 | | | |
| WP14-A114 | | | |
| WP14-A115 | | | |
| WP14-A116 | | | |
| WP14-A117 | | | |
| WP14-A118 | | | |
| WP14-A119 | | | |
| WP14-A120 | | | |
| WP14-A121 | | | |
| WP14-A122 | | | |
| WP14-A123 | | | |
| WP14-A124 | | | |
| WP14-A125 | | | |
| WP14-A126 | | | |
| WP14-A127 | | | |
| WP14-A128 | | | |
| WP14-A129 | | | |
| WP14-A130 | | | |
| WP14-A131 | | | |
| WP14-A132 | | | |
| WP14-A133 | | | |
| WP14-A134 | | | |
| WP14-A135 | | | |
| WP14-A136 | | | |
| WP14-A137 | | | |
| WP14-A138 | | | |
| WP14-A139 | | | |
| WP14-A140 | | | |
| WP14-A141 | | | |
| WP14-A142 | | | |
| WP14-A143 | | | |
| WP14-A144 | | | |
| V13 proof (disclosure part) | | | |
| V23 proof (SA-08 part) | | | |
