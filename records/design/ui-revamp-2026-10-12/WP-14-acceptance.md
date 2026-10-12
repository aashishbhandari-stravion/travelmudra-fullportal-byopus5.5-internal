# WP-14 acceptance checklist: Incidents, audit and degradation

| Field | Value |
|---|---|
| Lane | `ui-revamp-2026-10-12` |
| Work package | WP-14 Incidents, audit and degradation (UI-PLAN §12.2: OP-08, SA-08, SA-01; done when V13 (disclosure part) and V23 (SA-08 part) pass; lane PLAN §3) |
| Author | Principal Product Manager (Claude subagent), 13 October 2026 |
| Decision owner | Principal Technical Architect of the lane (LD-12) |
| Status | Draft. Step 1 of lane PLAN §3, written before the design. Not run. Where the later design names a page, a path or a word differently, the design governs the name and this checklist keeps the observable result. |
| Product base | lane branch `ui-revamp-2026-10-12` at 34e875b. The incident, failure-classification, documents-queue, monitors and audit code under `src/modules`, `src/contracts`, `src/core-api` and `src/apps/staff/operations` is the same at e9e96e3, e1f6ac9 and 34e875b. Internal records at 717a11c |
| Installation | `lane-ui`: staff http://127.0.0.1:4652 (operator and SuperAdmin pages under test); edge http://127.0.0.1:4650 (travel-agent pages: set-up and observation of the disclosure consequences) |
| Writing style | ASD-STE100 at about 75% (STY-20261003-01) |

## Corrections

None yet. This is the first version. The alignment to the WP-14 design, to the architect's decisions (`WP-14.md` §3)
and to the independent review (if the architect asks for one under LD-13) will be recorded here as a table of changed
rows, as in `WP-11-acceptance.md` and `WP-12-acceptance.md`.

## Lessons applied from the WP-01 to WP-12 corrections

| Lesson | Source | Where this checklist applies it |
|---|---|---|
| Identical replay, changed-content conflict, browser Back, rejected-form refresh and lost acknowledgement are five separate cases; a business duplicate with a new key and a raw stale envelope are two more | WP-01 A-02, A-03, A-06; WP-03 R-12; WP-06 D-12 | §0.2 "Replay terms"; the "Nth time" item A85; the matrix A84 |
| A refused command leaves no operation record; the refusal shows only on the re-rendered form | WP-01 A-08; WP06-A104 | §0.2; A83; every refusal item says "nothing is recorded" and checks it by delta |
| A receipt names the command only when the operation's resource, returned id and summary establish it; otherwise a neutral "Request recorded" with facts labelled "Current"; no accepted time | WP-01 A-04, P-02; WP-06 D-02; WP-09 G-01; WP-11 I-09 | §0.2 "Receipts"; A81 (five of the ten commands are neutral) |
| A result shown from the page address is not a receipt: today's `?done=` and `?requeued=` flashes come from the address, not from the operation | WP-01 A-04 (class) | A74, A81 |
| No page, status read or receipt instructs anyone to perform an act | WP-07 F-01, F-33 (P0 class fix); WP-09 G-10; WP-11 I-02 | A07, A10, A82 |
| Every rendered form action is a registered route; one host page per command use; carried forms leave the old pages | CC-12 to CC-16; WP-03 Q-01; WP06-A110; seam item S-09 | A47 (S-09), A79 |
| A page MUST NOT block a command that Core accepts, and MUST NOT offer one that Core refuses; where the refusing fact is not on the page's read, the form shows and Core's reason is re-rendered | WP-07 D-W07-16; WP-03 F-W03-11; WP-10 H-02, H-03 | A34 (the resolution's own evidence can meet two required items), A50, A69 |
| An outage of the evidence that a consequential record needs removes the form with an incomplete-review notice; optional information may degrade; access refusals are a separate test | WP-07 F-04; WP-10 H-05; WP-11 I-05 | A14, A21, A65 |
| Optional reads never hide an access change | LD-14 | A03, A14, A65 |
| No handler truncates, slices or drops a submitted field or an indexed row; over-limit input is refused at the field with the values kept; a partly filled evidence row is refused at its index, never dropped; a body limit fits the supported form | LD-17 (WP-06 D-10, WP-08 E-04, WP-09 G-07, WP-10 H-04, WP-11 I-08, WP-12 J-06) | A22, A33, A74, A93 (today's incident and queue handlers cut fields and drop rows, §0.1) |
| A page shows only facts that a read returns; a missing fact is "Unavailable" or "Not shown on this page", or the item is "Partly met"; gaps are deferred, not failures | WP-02 B-06; WP-03 R-11; WP-06 D-04, D-05 | §0.2 "Facts"; A04, A29, A56 |
| Facts from the audit record show only as explicit recorded fields with time and source, read per subject; nothing is reconstructed from clock order | WP-11 I-10; BS B33 | A56, A58 |
| Recorded facts on a receipt use only stored summary fields; counts and states read afterwards are "Current" | WP-12 J-08 | A81 |
| Capped lists are disclosed as capped; no "all", "none" or total beyond the returned slice | WP-08 E-10; WP-06 A08 | A01, A45, A68, A72 |
| A count names its unit; a count of incidents is not a count of applications | WP-11 I-13 | A01, A45, A75 |
| A state is labelled for the fact it establishes, never for a fact it does not | WP-06 D-05; WP-12 R-10 | A05 (`assigned` is not "with a reviewer") |
| A reviewer outside the assignment cannot see a candidate's identity facts | WP-08 E-01 (R-01); P-13 item 2 | A48 |
| Expectations name only states that a read returns | WP-10 H-06 | A04, A29, A56 |
| No semantic duplicate guard is claimed where Core has none; existing records show before the form | WP-08 Q-W08-15; WP-09 G-03 | A39, A84 (open, evidence, reviewer and classification have no business guard) |
| Reassignment races are covered: the previous holder of a duty is refused by access; the new one acts on Core's facts | WP-09 G-09 | A12 |
| Freshness: "Read at [time] IST" for an authoritative read; the lag form for a projection; no as-of time or entry number computed by the page | LD-08 | §0.2; A57, A60, A62, A63 |
| A boundary of a decided policy never says that an owner still has to decide; the owner of a parked boundary is "product owner" | LD-04; WP-08 Q-W08-03 | A15, A63 |
| Bans are scoped by fact ("recall" is never claimed; "Delivered" stays allowed where it is true) | WP-08 E-12; BS B13, B45 | §0.2 "Disclosure words"; A90 |
| Proofs rerun with a run tag and the design's seeded travel agent (no account creation); checks compare with a recorded baseline (deltas) | WP-02 B-13; WP-07 PM Q-07; WP-11 Q-W11-08 | §0.4; §3 step P-0 |
| Set-up writes through existing pages are allowed and are labelled "Setup"; they are not the subject under test | WP-03; WP-06 Q-W06-10 | §0.4; §3 |
| Real refusal shapes from the code; a business refusal is asserted from the current page's facts | WP-06 D-11, D-12; WP-07 F-09 to F-12 | §0.5; every harness step sends from a freshly read page unless the step says "raw" |
| A harness envelope that isolates a guard carries the current revision and valid evidence, so that the earlier guards pass | WP-10 H-07; WP-11 I-11 | A20, A36, A71 |
| Outages and maintenance that `lane-ui` cannot show are proven by named tests | WP-01 §3 P-W01; P-03 parked | §3 Part R; A60, A65 to A67 |
| UI acceptance is separate from Core enforcement; a decision pending with Max or the orchestrator is recorded "Unmet" or "Partly met", not as a failure | WP-10 H-01, H-08, H-11; WP-11 I-01 | §0.2 "Pass rule"; §5 |
| Kind 1 notes record whether criterion point 2 is demonstrated; no proposal is raised without it | WP-09 G-11; DECISIONS §3.1 | §6 Q-09 |

## 0. Inputs and conventions

### 0.1 Inputs

| Ref | Source | Identity | Sections used |
|---|---|---|---|
| UX | `TARGET_PRODUCT_UX_SPEC.md` (2026-10-05) | SHA-256 b45186887cdc37f6… | §2.1 (Document version, Incident/follow-up), §2.2, §2.3, §3.2 (Completed case with continuing duty), §3.3, §5.2 (Incidents and follow-up), §5.3 (Artifact review), §5.4, §6.1 (Resolve incidents and degraded operations), §6.2 (Incidents & audit), §6.3 (Support view, Recovery boundary), §7.4 (Action panel, Queue/table, Operation receipt, Timeline, Policy boundary notice), §7.5, §8.2, §8.3, §12 V13, V23 |
| BS | `BUILD_SPEC.md` (r2) | SHA-256 4a6fd90657b0723f… | B12, B13, B33, B35, B37, B38, B39, B40, B45; B10, B18 for boundaries |
| PL | `../ui-plan-from-specs-2026-10-10/UI-PLAN.md` | SHA-256 75256bfd7e6d929a… | §1.1 to §1.4, §2.2, §2.3 (SH-R06), §3.3 OP-08, §3.4 SA-01, SA-08, §5.3 OP-08, §5.4 SA-01, SA-08, §6.3, §6.4 (Owned incidents, Incident and audit, Reporting health), §7 (incident rows), §8 (CMP-01, CMP-06 to CMP-10, CMP-12 to CMP-14, CMP-21), §10, §11, §12.2 WP-14, §13.2 B-07, B-09 |
| DE | `../ui-plan-from-specs-2026-10-10/DECISIONS-2026-10-10.md` | SHA-256 a2c935f72cd4f5e9… | §3.1 (Kind 1 criterion), §3.2 (Kind 2) |
| SI | `../ui-plan-from-specs-2026-10-10/SURFACE-INVENTORY-2026-10-10.md` | internal 717a11c | CMD-47, CMD-49, CMD-50 (manual block: rejected Kind 2), CMD-55 (owner change: rejected Kind 2) |
| CC | `COMMAND-COVERAGE.md` (this folder) | SHA-256 d2df85471c03d0b6… | §3 rows of the ten WP-14 commands and of `ops.confirm_artifact_association`, `ops.reject_artifact_association`, `dlv.retrieve_for_review`; §5.1; §5.2; §6 CC-01, CC-13; §6.1 |
| LP | `PLAN.md` (this folder) | SHA-256 140b1f0d3a9eca73… | §3, §4 (LD-02, LD-03, LD-04, LD-07, LD-08, LD-11, LD-12, LD-14, LD-16, LD-17), §8 (S-06, S-09), §9 |
| PR | `PROPOSALS.md` | SHA-256 fcc412acba79f48e… | P-02, P-03, P-13 (item 2 and the recorded WP-14 known defect) |
| W1 | `WP-01.md`; `WP-01-acceptance.md` | SHA-256 1246143f54f52fa7…; 18659ab8bc74e51a… | §3 (P-W01, Q-06, Q-10), §4 A-04, A-08, A-09; WP01-A21, A78; §3 V23 parts B and C (the shell part of V23, referenced, not repeated) |
| W6 | `WP-06.md`; `WP-06-design.md`; `WP-06-acceptance.md` | SHA-256 2dabeab4fab80ea8…; 327f580c1820bf40…; 7a1d82e48fde6e93… | D-02, D-12; design §1.3 (Monitors kept as the second Home tab until WP-14), §2.1 (SA-01 groups 10 and 16), F-W06-09; WP06-A06 to A09 |
| W7 | `WP-07.md` | SHA-256 9821d58d41b2cf99… | F-01, F-04, F-33; WP07-A07 (OP-01 "Continuing duties") |
| W8 | `WP-08.md`; `WP-08-design.md`; `WP-08-acceptance.md` | SHA-256 0a9bfc4420d33e33…; 7a74a46cc1480906…; 4d6504be7f20ebe7… | §3 (Q-W08-08, PM Q-06, PM Q-11, CC-13), §4.1 E-01, E-03, E-10, E-12; design wording of `blocked` and `version_blocked`; WP08-A17 to A30, A39, A111, A118, A154, A155; §3 V13 and §4 (V13 disclosure part to WP-14) |
| W11 | `WP-11.md`; `WP-11-acceptance.md` | SHA-256 084f531a30c0e999…; d1f43350a16d08cb… | I-05, I-09, I-10, I-13; format, lessons, §0.5 |
| W12 | `WP-12.md`; `WP-12-acceptance.md` | SHA-256 aea7f10624c10b40…; 9ff066eb04bed279… | J-06, J-08; format, corrections, §0.5 |
| Code | lane repository | 34e875b | `src/modules/operations/case-work/commands/incidents.ts`, `incidents.ts`, `store.ts`, `evidence.ts`, `commands/common.ts`; `src/modules/documents/commands/requeue.ts`, `queries.ts`; `src/modules/identity/policy.ts`; `src/modules/views/case-queries.ts`, `queries.ts`; `src/kernel/vocabulary/incidents.ts`, `operations.ts`; `src/contracts/operations-work.ts`, `documents.ts`, `views.ts`, `views-cases.ts`; `src/core-api/bindings/operations-work.ts`, `documents.ts`; `src/core-api/allowlists.ts`; `src/apps/staff/operations/incidents.ts`, `labels.ts`, `case-work.ts`; `src/apps/staff/documents.ts`; `src/apps/shared/pages/documents.ts` (`queuePage`); `src/apps/shared/evidence-form.ts`; `src/apps/staff/views/cases.ts` (Monitors), `pages.ts` (audit, measures, derived views); `src/apps/shared/delivery/pages.ts` (`disclosureBody`); `src/web/route-inventory.ts` |

Verified facts of the code at 34e875b that the items rely on (read by the author):

- **Incident kinds and states.** Nine kinds (`OPS_INCIDENT_KINDS`): `artifact_association`, `artifact_missing_or_wrong`,
  `wrong_recipient_disclosure`, `bytes_integrity`, `operational_failure`, `country_defect`, `custody_discrepancy`,
  `official_fact_follow_up`, `post_filing_correction`. States: `open`, `assigned`, `awaiting_evidence`, `resolved`,
  `closed`. "Open" for every rule is the first three. `assigned` is set by a reviewer naming and also by evidence
  recorded on an `awaiting_evidence` incident (`commands/incidents.ts:213`): it does not mean that a reviewer exists.
  Today's label for `assigned` is "With a reviewer" (`labels.ts:31`).
- **Owner.** An incident opens with the active assigned operator of its application as owner, else the SuperAdmin queue
  (owner "TravelMudra administration"). A SuperAdmin's `ops.open_incident` always opens with the SuperAdmin queue as
  owner, also on an assigned application (`commands/incidents.ts:321`, `incidents.ts:184-186`). The follow-up of a later
  official fact has a named owner (Core's future owner) while that account is active staff. A named reviewer owns the
  incident only while the application has no active operator (`incidentDutyHolders`). Reassignment moves the old
  operator's and the reviewer's incidents to the new operator; SuperAdmin-owned incidents stay (`transferApplicationDuties`).
  An operator reads and works every incident of its assigned application, whatever the owner (`policy.ts:227-229`,
  scope predicate `incident.read`). No command changes an owner (CMD-55 owner part: rejected Kind 2).
- **Required items** (`missingEvidence`, `incidents.ts:65-85`): `evidence` = at least one recorded reference that is not a
  statement (an attestation); `association_decision` = the incident's result file verified or rejected (an incident
  without a file never meets it); `correction` = an eligible replacement of the incident's file, **or any recorded
  reference that is not a statement**; `notice:<account>` = a disclosure notice posted to that account. Defaults: an
  association incident `association_decision`; a disclosure `correction` (plus one `notice:` per affected account);
  every other kind `evidence`.
- **Blocking.** Open disclosure and byte-integrity incidents block releases of their version, or of their application
  when they have no version (`blockingIncidents`). A resolved incident blocks nothing.
- **`ops.report_wrong_recipient`** (route `ops.incidents.disclosure`, POST `/ops/applications/:applicationId/disclosure`,
  operator surface only; policy `incident.report_disclosure` = assigned operator or SuperAdmin). Input: version,
  release ids (at most 50), email send ids (at most 50), note (1 to 2000), evidence (0 to 5). Refusals in order: access;
  version not of the application's group (`not_found_or_forbidden`); nothing named and no business evidence, a named
  record not of this version, or no named record that actually went out (`control_blocked` / `incident_evidence_insufficient`;
  an attestation alone never establishes a disclosure); the version already reported (`conflict_duplicate` /
  `duplicate_operation`, dedupe `disclosure:<version>`, with the existing incident). Effect: a disclosure incident
  naming the releases, the recipient accounts and the owning travel agent; the version blocked for good
  (`documents.blockVersion`); the artifact's eligibility `blocked`; required items `correction` and one notice per
  recipient and the owning travel agent (the same account counts once). Result `{incidentId, applicationId}`.
- **`ops.post_disclosure_notice`** (`ops.incidents.notice`, `admin.incidents.notice`; revision `incident`, optional in
  Core). Variant `deletion_request` only to a recorded recipient; `disclosure_information` only to the owning travel
  agent (`not_affected` otherwise); one notice per account (`conflict_duplicate` / `duplicate_operation`); only on an open
  disclosure incident (`incident_not_open`; another kind `not_found_or_forbidden`). The notice to the application's
  travel agent links the application. A deletion request needs the recipient's acknowledgement. Result `{incidentId,
  noticeId}`. The travel agent's texts (`disclosureBody`, `delivery/pages.ts:654-668`): deletion request "… was released
  to your account in error … Delete every copy you hold …"; information "… was released to another account in error.
  The file is blocked and is not released again. TravelMudra has asked the recipient to delete it." The second text
  is fixed: it does not depend on whether a version was blocked or a deletion request was posted (§6 Q-02).
- **`ops.record_incident_evidence`** (`ops.incidents.evidence`, `admin.incidents.evidence`): 1 to 10 rows (kind, reference
  at most 200, note at most 200), note at most 2000; `evidence_kind_unknown`, `evidence_version_not_usable`
  (a document not current, not content-safe or of another group), `invalid_id`; `incident_not_open`; `stale_revision`.
  No business duplicate guard. Result `{incidentId}`.
- **`ops.resolve_incident`** (`ops.incidents.resolve`, `admin.incidents.resolve`; policy `incident.resolve`): resolution
  note 1 to 2000; evidence 0 to 10. Core evaluates the missing items **with the resolution's own evidence**, so a
  reference sent with the resolution meets `evidence` and `correction`; a notice or the association decision cannot be
  met that way. Refusal `control_blocked` / `incident_evidence_insufficient` with one field error per missing item
  (`notice_missing` or the item code). Works after the application completed. Result `{incidentId}`. Today the page
  hides the form whenever any item is missing (`bindings/operations-work.ts`, `offers.resolve`).
- **`ops.close_incident`** (`ops.incidents.close`, `admin.incidents.close`): only a `resolved` incident
  (`incident_not_open` otherwise); no revision; optional note. Result `{incidentId}`.
- **`ops.open_incident`** (`ops.incidents.open`, `admin.incidents.open`): an operator opens only
  `operational_failure`, `custody_discrepancy`, `post_filing_correction` (field `kind`, `not_operator_openable`) on its
  assigned application (`applicationId` `required`); a SuperAdmin opens any kind, with or without an application; a
  country rule defect needs `countryId` (`required`). Note 1 to 2000; evidence 0 to 10. No business duplicate guard
  (dedupe `manual:<operation>`). An operational failure or country defect gets the classification `unresolved` at
  opening. A hand-opened disclosure incident names no version and no recipient: it blocks the application's releases
  while open and blocks nothing for good. A hand-opened association incident has no file: its required item can never
  be met. Result `{incidentId}`.
- **`ops.assign_incident_reviewer`** (`admin.incidents.reviewer`; SuperAdmin; revision `incident`): reason 10 to 1000;
  only while the application has no active operator (`control_blocked` / `already_assigned`); the reviewer is an active
  operator with a second factor (field `reviewerAccountId`, `not_active_operator`); `incident_not_open`. The reviewer
  becomes owner (`owner_kind = reviewer`) with no case action. No no-change guard. Result `{incidentId}`.
- **`ops.classify_failure`** (`admin.failures.classify`, POST `/admin/failures/:subjectType/:subjectId/classify`;
  SuperAdmin): subject types `incident`, `task`, `intake_attempt`, `application`; scope `local`, `shared`,
  `unresolved`; `shared` needs `originComponent` (`required`) and evidence other than a statement that names the
  component (`control_blocked` / `failure_scope_evidence_missing`); a component with another scope `not_applicable`;
  `local` needs `countryId` unless the subject is an application (`required`); reason 10 to 1000. A new classification
  supersedes the current one (no no-change guard). Result `{classificationId, scope}` on resource `queue incidents`.
  Today only the incident page of an operational failure or a country defect offers it. No read returns the current
  classification; the audit subject read of the incident returns the fact `ops.failure_classified`.
- **`doc.requeue_check`** (`admin.documents.requeue`, POST `/admin/documents/:versionId/requeue`; SuperAdmin; revision
  `version`, required): stage `scan` or `parse` as the version needs (`control_blocked` / `requeue_not_applicable`);
  `stale_revision`; reason 1 to 500. The file stays quarantined; the check runs again (a new task). Result
  `{versionId, revision}` on resource `document_version` (the shape of other document commands).
- **`doc.requeue_bulk`** (`admin.documents.requeue_bulk`, POST `/admin/documents/requeue`): stage `scan`, `parse` or
  `all`; limit 1 to 500; reason 1 to 500. Core reads up to 1000 candidates, oldest first, and requeues up to the limit;
  none: `control_blocked` / `nothing_to_requeue`. Result `{requeued, scan, parse}` on resource `queue tasks`.
- **Reads.** `ops.incidents` (operator: owned, reviewed or of its assigned applications) and `ops.admin_incidents` (every
  incident plus the reviewer candidates) return **open incidents only**, oldest first, at most 500. `ops.incident` returns
  one incident in any state: the row, the revision, the evidence rows (kind, reference, note; no actor, no time), the
  notice ids (no recipient, no acknowledgement), the affected block of a disclosure, the candidates of an association
  (reference and group label), `viewerIsReviewer`, `complianceNotices = compliance_notice_unselected` and the offers.
  `ops.case_work.incidents` lists every incident of one application in any state (at most 100). `doc.queue`: at most
  200 entries, oldest first (`documentsQueue` limit 200), plus the facilities (scanner, file reader: `up`, `down` or
  `unknown`; last scanner failure). `views.audit_search`: one page (at most 200) of the audit index, newest first,
  with the index's judgement (a projection); `views.audit_subject`: one subject's facts from the fact log, oldest first,
  paged; `views.projections`: each projector's judgement, state and gaps; `views.monitors`: counts with
  `incidents` nullable and `pendingBoundary` read from a projection with its as-of.
- **Today's pages.** The SuperAdmin incident page renders "Confirm the association" and "Reject the association"
  forms with actions `/admin/incidents/:incidentId/confirm-association` and `…/reject-association` for which no route
  exists (`staff/operations/incidents.ts:164-180`; seam item S-09; WP-08 PM Q-11). Handlers cut fields: `f()` slices
  every field to its maximum (`incidents.ts:244`), the release and email choices keep indexes of one to three digits,
  cut each value to 40 characters and keep the first 50 (`case-work.ts:452-453`), the queue handlers slice `stage` to 16
  and `limit` to 8 (`staff/documents.ts`). Every incident form carries one evidence row; a row with only a note is
  dropped (`evidence-form.ts`). Results show from the address (`?done=`, `?requeued=`). The report form stays when the
  delivery records cannot be read. The queue page predicts the bulk count from its 200 rows ("Run [n] checks again")
  and says "Every document finished its checks" when the list is empty. Monitors says "have no product trigger in
  this build" (`views/cases.ts:265`, F-W06-09) and shows the as-of as an entry number. Core stores the first 1000
  characters of an incident note of up to 2000 (`commands/incidents.ts:154, 218, 276, 331`; §6 Q-07).

### 0.2 Conventions

- **Personas.** Travel agent: `syn-ta-2` (TA), the owner of the run's group (no account is created); `syn-ta-3` for
  isolation only. Operators: `operator-1` (OP1: the assigned operator of D and V, and of S after its assignment),
  `operator-2` (OP2: the reviewer named for S's incident; isolation reader of D), `operator-3` (OP3: test fixtures of the
  named follow-up owner only). SuperAdmins: `superadmin-1` (SA1: set-up, SA-08 under test) and `superadmin-2` (SA2:
  second tab and observation). They stand for `syn-operator-1` to `-3` and `syn-superadmin-1`, `-2`. Keyboard-only
  user. Screen-reader user. Phone user (390 px wide). No step suspends a seeded account.
- **Where.** `L`: a person or the LD-11 harness shows it on `lane-ui`. `T`: an automated test in the lane repository
  shows it at the same commit; the run record names the test. `L+T`: both are required. A test that the item says
  WP-14 adds is named in the run record with its file and title. "Gallery" is the design's gallery state.
- **Sign-in codes (rule C).** As WP-01 §0.2. The LD-11 harness signs in. Nobody prints, logs, screenshots or stores a
  code or an authenticator key.
- **Copy.** Quoted text is draft copy (CR-09). Draft copy passes when the page states the same facts. The §11.3
  boundary form is mandatory for an unavailable action: "[Action] is unavailable until [policy or evidence] is
  [approved / recorded]. Owner: [owner or 'not yet named']." Core's reasons show in words; a code shows only as the
  UAT-13 fallback (A86). No page shows a package id or a lane record id.
- **Incident words** (draft; the design governs the words, the facts stay). Kinds (staff): `artifact_association`
  "Result file needs review"; `artifact_missing_or_wrong` "Result file missing or wrong"; `wrong_recipient_disclosure`
  "Released to a wrong recipient"; `bytes_integrity` "Stored file damaged or missing"; `operational_failure`
  "Operational failure"; `country_defect` "Country rule defect"; `custody_discrepancy` "Original's whereabouts
  uncertain"; `official_fact_follow_up` "Official fact after an unresolved outcome"; `post_filing_correction`
  "Correction after filing". States: `open` "Open"; `assigned` "Open: being worked" (never "With a reviewer": the
  reviewer shows from the reviewer fact); `awaiting_evidence` "Open: waiting for evidence"; `resolved` "Resolved:
  waiting to be closed"; `closed` "Closed". Owner: "TravelMudra administration" (SuperAdmin queue); "[name]";
  "[name] (reviewer)"; "You" when the reader is the owner Core names. Required items: `evidence` "Evidence of what was
  done (a reference, a document or a recorded fact; a statement alone does not count)"; `association_decision` "The
  result file's association is decided (confirmed or rejected)"; `correction` "The correction: a replacement result
  file verified for this application, or a recorded reference (any evidence other than a statement counts)";
  `notice:<account>` "A notice to [name]". Each item reads "recorded" or "not recorded yet" in text.
- **Disclosure words.** A file reported to a wrong recipient is "Blocked after a release to a wrong recipient. It is
  never released again." (staff) and "This file is held. It is not released again." (travel agent; WP-08 wording).
  Never "recalled", "retrieved back", "unsent", "withdrawn from the recipient" or "deleted" as a fact; the recipient's
  acknowledgement reads "acknowledged the request to delete it", never "deleted it". No "Recall" or "Block this
  version" control (B45; CMD-50 not built). Applicant, regulator and legal notices are a boundary: "Applicant,
  regulator and legal notices are unavailable until the product owner authorizes the compliance work that decides
  them. Owner: product owner." (B-09; code `compliance_notice_unselected`).
- **Degradation words (LD-08).** A projection: "Up to date when read at [time] IST", "Behind by [n] s when read at
  [time] IST", "Freshness unavailable". Projector reasons: `never_run` "Not run yet", `rebuilding` "Being rebuilt",
  `degraded` "Running; [n] records could not be projected", `failed` "Stopped", `stale` and `lag` "Behind". A facility:
  "Answering now", "Not answering", "Not known". No as-of time or entry number computed by the page; no age threshold.
- **Dates and times.** Every time carries "IST" (AD-10, CR-06). Event time and recorded time are both shown where a
  read returns both (the audit pages).
- **Freshness (LD-08).** An authoritative read (`ops.*`, `doc.*`, `views.audit_subject`, `views.projections`) shows
  "Read at [time] IST". A projection (`views.audit_search`, the `pendingBoundary` part of `views.monitors`, measure
  results) shows the lag form.
- **Facts.** A page shows only facts that a read returns (WP-02 B-06). A fact from the audit record shows only where the
  subject read returns it as an explicit recorded field, with its time and source; otherwise "Not shown on this page"
  with the audit link (WP-11 I-10). A fact read after an operation is labelled "Current". A count that a read cannot
  give shows "Unavailable", never "0" (D7). A list at its read's maximum shows "[max] or more" and claims no total.
- **Receipts.** CMP-08 as WP06-A103: the request reference links to the operation status page; the resulting facts;
  "Recorded once. Sending the same form again does not repeat it."; no accepted time (P-02). A receipt names the
  command only when the operation's resource, the returned id and the summary establish it on that surface (A81).
  Otherwise it reads "Request recorded" with the current facts labelled "Current" (WP-06 D-02). A receipt never tells
  anyone to perform an act and never claims a recall. The polite region announces it. A result never shows from the
  page address.
- **Replay terms** (used by every "Nth time" item; the five terms of the lane):
  1. *Identical replay*: the harness sends the accepted request again with the same `_op` and the same fields (raw
     envelope); a double-click on the final button is the same case. Expected: the original result, nothing new.
  2. *Changed-content conflict*: the same `_op` with one changed field. Expected: refused as a used form
     (`conflict_operation_key` / `operation_key_reused`); the page re-renders with a new form key, the typed values kept
     and "This form was already used with different content. Your values are kept: check them and send again.";
     nothing recorded.
  3. *Browser Back*: after the receipt the person presses Back. Back reloads the page (WP-01 A-02) with a fresh form
     and current facts. Back sends nothing. A send from that page is a new request; the command's own business check
     decides it.
  4. *Rejected-form refresh*: a send that Core refuses leaves no operation record; the re-rendered form carries a new
     key; the corrected send is recorded once.
  5. *Lost acknowledgement* (fixture): 303 to `/<surface>/operations/<key>` (CMP-13) "Checking the original result" and
     "Check status"; no new send of the same intent is offered there.
  Two more cases belong to the replay matrix (A84), never to a term: a *business duplicate* (a new key with the current
  page's facts) and a *raw stale envelope* (a new key with an older page's revision).
- **Refused sends leave no record.** A refused command leaves no operation record: the status page of its key reads
  "Nothing is recorded for request [reference] so far", and the refusal shows only on the re-rendered form. Every
  refusal item says "nothing is recorded" and checks it by delta where an incident, an evidence row, a notice, a
  block, a classification or a queue entry could change.
- **Paths (LD-03).** Existing paths and form actions stay: `/ops/incidents`, `/ops/incidents/:incidentId` and its POSTs
  `evidence`, `notices`, `resolve`, `close`; `/ops/incidents` (POST, open); `/ops/applications/:applicationId/disclosure`
  (POST, report); `/admin/incidents`, `/admin/incidents/:incidentId` and its POSTs `reviewer`, `evidence`, `notices`,
  `resolve`, `close`; `/admin/incidents` (POST, open); `/admin/failures/:subjectType/:subjectId/classify`;
  `/admin/audit`, `/admin/audit/:subjectType/:subjectId`, `/admin/audit/facts/:seq`; `/admin/system/projections`;
  `/admin/measures`; `/admin/monitors`; `/admin/documents/queue` and its POSTs `/admin/documents/:versionId/requeue`,
  `/admin/documents/requeue`. New GET pages get the paths the design names. This checklist calls them OP-08 (the
  operator's incident list), OP-08i (one incident, operator and reviewer), OP-08w (report a release to a wrong
  recipient), OP-08o (open an incident on an application), SA-08 (the SuperAdmin's incident list), SA-08i (one
  incident, SuperAdmin), SA-08o (open an incident), SA-08a (audit search), SA-08s (one subject's history), SA-08v
  (derived views), SA-08m (measures), SA-08q (document checks that could not finish, CC-01) and SA-01m (the Monitors
  tab of Home) until the design names them. Pages of other packages: OP-01, OP-02 (WP-07); OP-05, OP-05r, OP-06, OP-07,
  TA-07r, TA-07d, TA-10, TA-10n, TA-07x (WP-08); OP-09i (WP-12); SA-01, SA-03a, SA-03c (WP-06); SA-09m (WP-11). An item
  names the page; the run record names the path used.
- **Pass rule.** WP-14 passes when every `L` item passes on `lane-ui` at the integrated ref, every `T` item has a named
  passing test at that commit, every axe item passes, and the proofs of §3 pass, except the explicitly deferred items
  of §5. The run record lists each deferred item as "Deferred" with its reference, not as "Fail". Recorded, not
  failed: A04, A29 and A56 "Partly met" where no read returns the fact (§6 Q-09); A64 and A127 "Deferred" when the
  design keeps the Measures page (LD-02; §6 Q-11). A failed item becomes a finding ranked P0, P1 or P2 with its
  scenario (PRI-20260930-01).
- **Preconditions on `lane-ui`.** WP-01, WP-02, WP-03, WP-06, WP-07 and WP-08 are integrated (TA pages submit; SA-07a
  records payments; SA-03a assigns; OP-02 and OP-04 record readiness and filing; OP-05 records the outcome and result
  files, OP-05r decides an association, TA-07d downloads, TA-10n acknowledges). WP-08's synthetic result-document
  generator (WP-08 §3 PM Q-06) is available to the harness. Where a package is not integrated, the step runs on the
  existing page and the run record says so. The processing instance runs.
- **Data hygiene.** WP-14 writes only: one group, three applications (D, V, S), their payments, three assignments,
  readiness, authorizations and filing records of D and V, two outcomes, three result files (R-D1, R-D2, R-V1), one
  download, one disclosure report, one notice and its acknowledgement, the association decision of V, two incidents
  opened by hand (S's by SA1; an operational failure on D by OP1), one reviewer naming, the classifications of S's incident, the
  evidence, resolutions and closures of the run's incidents. It MUST NOT change seeded offerings, declarations,
  launches, ceilings or accounts, MUST NOT create an account or a read grant, MUST NOT resolve, close, classify or name
  a reviewer on an incident of another run or package, MUST NOT send a document check again on `lane-ui` (tests and
  the gallery only), and MUST NOT run a restore. Notes, references and evidence carry the run tag. At the end of the run
  every incident the run opened is closed (§3 D-13, S-6). Identifiers stay in the internal record only.

### 0.3 Synthetic data used by WP-14

| Item | Value | Use |
|---|---|---|
| Travel agent | TA = `syn-ta-2` | D, V, S |
| Group | `wp14-[stamp]` in Synthetica; travel start today + 30 days, return today + 40 days | D, V, S |
| D | "SYN Tourist e-visa"; assigned to OP1; filed; outcome "Issued" with R-D1; downloaded by TA | The disclosure path (V13): report, block, notice, acknowledgement, correction, resolution, closure; the operator-opened incident |
| V | "SYN Tourist e-visa"; assigned to OP1; filed; outcome "Issued" with R-V1 that the automatic association cannot establish | An association incident: OP-08i and SA-08i without decision forms (S-09); the reviewer form blocked (active operator); closure after the decision on OP-05r |
| S | "SYN Tourist e-visa"; submitted and paid; not assigned until step S-5, then assigned to OP1 | SA-08: an incident opened by SA1 (owner TravelMudra administration), classification, a reviewer (OP2), the stand-in duty ending at assignment |
| Passports | `td3Lines` of a `SyntheticPassport` with surname `SYNWPFOURTEEN`, document code P, issuing state and nationality IND, expiry at least six months after the return date, number "S" + seven digits new to the run; `passportTextPdf` or `passportImage` (`test/fixtures/documents/samples.ts`). Given names: D "DIVYA", V "VARUN", S "SAGAR" | Intake |
| Photographs | `plainPng` at least 350 × 350 px | Intake |
| Payments | "Payment received" for D, V and S, evidence `SYN-W14-[stamp]-PAY-[letter]` | Gate 1 passes on payment |
| Result files | WP-08's synthetic result generator: R-D1 and R-D2 with D's identity visible and extractable (automatic match); R-V1 with V's identity visible on the page but not extractable (WP-08 E-02) | Outcome, release, replacement, association incident |
| Evidence values | `SYN-W14-[stamp]-PORTAL-[letter]` (filing), `SYN-W14-[stamp]-REF-[n]` (incident evidence), `SYN-W14-[stamp]-MAIL` (outside-records fixture); notes and reasons "WP14 [stamp] …" (reviewer and classification reasons at least 10 characters) | Act evidence, incident evidence, notes |
| Country reference | Synthetica's country reference as SA-05 shows it | Classification "Local to one country" |
| Fixtures (tests only) | An incident of each kind and state, with each owner kind; a disclosure reported from outside the delivery records (`SYN-W14-[stamp]-MAIL`, no recipient account); a disclosure whose recipient is not the owning travel agent; a completed application with an open disclosure incident; a follow-up owned by OP3; documents-queue entries in each state (scan exhausted, parse failure, bytes unavailable, automatic retry) and with 201 and 600 waiting versions; facilities up, down and unknown; a failed and a lagging projector; a lost acknowledgement per command | T items and the gallery |

### 0.4 Run recipe (rerunnable)

- Run tag `wp14-[yyyymmddhhmm]`. First check: the harness can sign in TA, OP1, OP2, SA1 and SA2; "SYN Tourist e-visa"
  admits TA (TA-03); the WP-08 result generator runs.
- Baseline (step P-0, before the set-up): OP-08 counts of OP1 and OP2 (open incidents listed; "Yours to act on");
  OP-01 "Continuing duties" of OP1 and OP2; SA-01 group 10 "Incidents" and group 16 "Reporting gaps"; SA-01m incident
  counts (custody, artifact, disclosure); SA-08 list count; TA's TA-10 count; SA-08q entry count and facilities; SA-08v
  projector states. Every later count check is a delta from it.
- Setup (labelled "Setup", through integrated pages): Setup 1: TA creates the group and submits D, V and S. Setup 2:
  SA1 records the payments and assigns D and V to OP1 (S stays unassigned). Setup 3: OP1 starts work, confirms
  readiness, requests the authorization of the government submission and records "Filed" with
  `SYN-W14-[stamp]-PORTAL-D` and `-V`. Setup 4: OP1 records the outcome "Issued" with R-D1 for D and with R-V1 for V;
  after the check R-D1 reads "Verified for this application" and V has an association incident. Setup 5: TA downloads
  R-D1 on TA-07d ("Sent in full").
- Every harness send uses the fields of a freshly loaded page unless the step says "raw". A raw envelope is built from
  a page loaded earlier in the run and named in the run record.
- Order (§3): P-0, Setup, Part D (V13 disclosure), Part S (SuperAdmin incidents), Part R (V23 SA-08 part), Part X
  (isolation, tests, axe). Data of earlier runs stays and is excluded by its tag and group label.

### 0.5 Refusal shapes in the code at 34e875b (category / code)

| Command | Refusals the items assert |
|---|---|
| `ops.report_wrong_recipient` | `not_found_or_forbidden` / `access_denied` (not the assigned operator; a version of another group; `syn-ta-3`); `validation_failed` / `input_invalid` on `note` (blank, over 2000), `releaseIds` or `emailSendIds` (over 50, malformed), `evidence` (over 5; `evidence.N.kind` `evidence_kind_unknown`; `evidence.N.id` `evidence_version_not_usable`, `invalid_id`); `control_blocked` / `incident_evidence_insufficient` (nothing named and no business evidence; an attestation alone; a named record not of this version; no named record went out); `conflict_duplicate` / `duplicate_operation` (the version already reported); `conflict_operation_key` / `operation_key_reused` |
| `ops.post_disclosure_notice` | `not_found_or_forbidden` / `access_denied` (not owner, reviewer or assigned operator; not a disclosure incident); `validation_failed` / `input_invalid` field `recipientAccountId` code `not_affected`; `variant` (not in the list); `stale_revision` / `stale_revision`; `control_blocked` / `incident_not_open`; `conflict_duplicate` / `duplicate_operation` (a notice to that account exists) |
| `ops.record_incident_evidence` | `not_found_or_forbidden` / `access_denied`; `validation_failed` / `input_invalid` on `evidence` (none, over 10, kind, reference, note over 200), `note` (over 2000), `evidence.N.kind` `evidence_kind_unknown`, `evidence.N.id` `evidence_version_not_usable` or `invalid_id`; `stale_revision` / `stale_revision`; `control_blocked` / `incident_not_open` |
| `ops.resolve_incident` | `not_found_or_forbidden` / `access_denied`; `validation_failed` / `input_invalid` on `resolutionNote` (blank, over 2000), `evidence`; `stale_revision` / `stale_revision`; `control_blocked` / `incident_not_open`; `control_blocked` / `incident_evidence_insufficient` with field errors `requiredEvidence` codes `evidence`, `association_decision`, `correction`, `notice_missing` |
| `ops.close_incident` | `not_found_or_forbidden` / `access_denied`; `control_blocked` / `incident_not_open` (not resolved; already closed); `validation_failed` / `input_invalid` on `note` (over 2000) |
| `ops.open_incident` | `not_found_or_forbidden` / `access_denied` (an operator on an application it is not assigned to; an unknown application); `validation_failed` / `input_invalid` on `kind` (not a kind; operator `not_operator_openable`), `applicationId` (`required` for an operator), `countryId` (`required` for a country rule defect), `note`, `evidence` |
| `ops.assign_incident_reviewer` | `not_found_or_forbidden` / `access_denied` (not a SuperAdmin; support view); `validation_failed` / `input_invalid` on `reason` (fewer than 10 or more than 1000 characters), `reviewerAccountId` (`not_active_operator`: suspended, no second factor, not an operator); `stale_revision` / `stale_revision`; `control_blocked` / `incident_not_open`; `control_blocked` / `already_assigned` |
| `ops.classify_failure` | `not_found_or_forbidden` / `access_denied` (not a SuperAdmin; a subject id of the wrong kind; an unknown incident or application); `validation_failed` / `input_invalid` on `scope`, `originComponent` (`required` for shared, `not_applicable` otherwise), `countryId` (`required` for local), `reason`, `evidence`; `control_blocked` / `failure_scope_evidence_missing` |
| `doc.requeue_check` | `not_found_or_forbidden` / `access_denied` (not a SuperAdmin; unknown version); `validation_failed` / `input_invalid` on `stage`, `reason` (blank, over 500); `stale_revision` / `stale_revision`; `control_blocked` / `requeue_not_applicable` |
| `doc.requeue_bulk` | `not_found_or_forbidden` / `access_denied`; `validation_failed` / `input_invalid` on `stage`, `limit` (not 1 to 500), `reason`; `control_blocked` / `nothing_to_requeue` |
| Sent by harness steps, owned elsewhere | `ops.confirm_artifact_association`, `ops.reject_artifact_association` posted by a SuperAdmin: no admin route exists (the uniform not-found answer of the router); posted on the ops route by a SuperAdmin session: refused as the ops surface refuses a SuperAdmin (WP-08 A27 pattern). `dlv.retrieve_document` of a blocked version (TA-07d): `version_blocked`. Any `/admin` page or post in a support view: 409 `support_view_active` |

## 1. Scope

### 1.1 Pages

| Page | Host and path | Part in WP-14 |
|---|---|---|
| OP-08 Incidents and follow-up | 4652 `/ops/incidents` (kept, rebuilt) | The operator's open incidents: owned, reviewed, or of its assigned applications; filters; states |
| OP-08i One incident (operator, reviewer) | 4652 `/ops/incidents/:incidentId` (kept, rebuilt) | What happened, facts, required items, evidence, the disclosure block, the next step; host of evidence, notice, resolve and close (operator surface) |
| OP-08w Report a release to a wrong recipient | 4652 (design path; POST `/ops/applications/:applicationId/disclosure` kept) | Host of `ops.report_wrong_recipient`; the form leaves the operator case page (OP-02 "Delivery & originals") |
| OP-08o Open an incident on an application | 4652 (design path; POST `/ops/incidents` kept) | Host of `ops.open_incident` for the operator; the form leaves the operator case page |
| SA-08 Incidents (SuperAdmin) | 4652 `/admin/incidents` (kept, rebuilt; rail "Incidents & audit") | Every open incident with its owner; filter "Needs a SuperAdmin" (SA-01 group 10 target) |
| SA-08i One incident (SuperAdmin) | 4652 `/admin/incidents/:incidentId` (kept, rebuilt) | As OP-08i, plus the reviewer naming and the classification; no association decision form (S-09) |
| SA-08o Open an incident (SuperAdmin) | 4652 (design path; POST `/admin/incidents` kept) | Host of `ops.open_incident` for the SuperAdmin, any kind |
| SA-08a Audit search; SA-08s one subject's history; the fact page | 4652 `/admin/audit`, `/admin/audit/:subjectType/:subjectId`, `/admin/audit/facts/:seq` (kept, rebuilt) | Full audit with event and recorded time, actor, subject, evidence, retrospective marker; audit and support view distinct |
| SA-08v Derived views | 4652 `/admin/system/projections` (kept, rebuilt) | Reporting degradation: each projection's health, lag, gaps |
| SA-08m Measures | 4652 `/admin/measures` (kept; rebuilt or kept as the design decides, §6 Q-11) | Reporting gaps: measures with missing values or no data source |
| SA-08q Document checks that could not finish | 4652 `/admin/documents/queue` (kept path, rebuilt; CC-01) | Diagnostic degradation: the documents queue, the facilities, the two recheck commands |
| SA-01m Monitors (second tab of Home) | 4652 `/admin/monitors` (kept, rebuilt; WP-06 design §1.3) | Counts that may need a SuperAdmin; LD-04 and LD-08 wording (F-W06-09) |
| SA-01 Decision inbox | 4652 `/admin` (WP-06 page) | Groups 10 "Incidents" and 16 "Reporting gaps": link targets to the rebuilt SA-08 pages; counts observed |
| OP-01, OP-02, OP-05, OP-05r, OP-06, OP-07, TA-07, TA-07d, TA-10, TA-10n, TA-07x | 4652, 4650 (pages of WP-07 and WP-08) | Set-up and observation of the disclosure consequences; OP-05r stays the only host of the association decision |
| Old incident pages and the old operator case page | 4652 | Become OP-08, OP-08i, SA-08, SA-08i; the incident forms leave the operator case page (A79) |

Read models: Owned incidents (`ops.incidents`), Incident and audit (`ops.admin_incidents`, `ops.incident`,
`views.audit_search`, `views.audit_subject`), Reporting health (`views.projections`, `views.monitors`,
`views.measures`), Documents queue (`doc.queue`), Case work (`ops.case_work`, incidents of one application), Delivery
records (`dlv.delivery_page`, staff), Operation (`core.operation`).

### 1.2 Command coverage (CC §5.1: 10 WP-14 commands)

| # | Command | Route id (POST path) | Host page | Items |
|---|---|---|---|---|
| 1 | `ops.report_wrong_recipient` | `ops.incidents.disclosure` (`/ops/applications/:applicationId/disclosure`) | OP-08w (operator); no SuperAdmin route today (A24; §6 Q-01) | A16 to A24 |
| 2 | `ops.post_disclosure_notice` | `ops.incidents.notice`, `admin.incidents.notice` (`…/:incidentId/notices`) | OP-08i (operator); SA-08i (SuperAdmin) | A25 to A29 |
| 3 | `ops.record_incident_evidence` | `ops.incidents.evidence`, `admin.incidents.evidence` (`…/:incidentId/evidence`) | OP-08i; SA-08i | A30 to A33 |
| 4 | `ops.resolve_incident` | `ops.incidents.resolve`, `admin.incidents.resolve` (`…/:incidentId/resolve`) | OP-08i; SA-08i | A34 to A36, A38 |
| 5 | `ops.close_incident` | `ops.incidents.close`, `admin.incidents.close` (`…/:incidentId/close`) | OP-08i; SA-08i | A37, A38 |
| 6 | `ops.open_incident` | `ops.incidents.open` (`/ops/incidents`), `admin.incidents.open` (`/admin/incidents`) | OP-08o (operator kinds); SA-08o (every kind) | A39 to A44 |
| 7 | `ops.assign_incident_reviewer` | `admin.incidents.reviewer` (`/admin/incidents/:incidentId/reviewer`) | SA-08i | A48 to A52 |
| 8 | `ops.classify_failure` | `admin.failures.classify` (`/admin/failures/:subjectType/:subjectId/classify`) | SA-08i (operational failure, country rule defect) | A53 to A56 |
| 9 | `doc.requeue_check` | `admin.documents.requeue` (`/admin/documents/:versionId/requeue`) | SA-08q | A69 to A71, A74 |
| 10 | `doc.requeue_bulk` | `admin.documents.requeue_bulk` (`/admin/documents/requeue`) | SA-08q | A72 to A74 |
| ref | `ops.confirm_artifact_association`, `ops.reject_artifact_association` | `ops.incidents.confirm_association`, `ops.incidents.reject_association` | OP-05r (WP-08; WP08-A19 to A22, A28 to A30, A155) | WP-14 asserts only that OP-08i links to OP-05r and that SA-08i holds no decision form (S-09): A09, A47, A77 |
| ref | `dlv.retrieve_for_review` | `ops.incidents.review_copy` | OP-05r (WP-08; WP08-A27) | A09, A77 |
| ref | `ops.record_artifact` with `incidentId` | `ops.case_work.artifact` | OP-05 (WP-08; E-03, WP08-A23, A154) | Set-up of §3 D-9; A77 |
| ref | `dlv.acknowledge_notice` | `ta.notices.acknowledge` | TA-10n (WP-08) | Observation of §3 D-8 |

All of them also: A80 (shell), A81 (receipt), A82 (no instruction to act), A83 (lost acknowledgement; no record for a
refusal), A84 (replay matrix), A85 (the Nth time), A86 and A87 (refusal text), A88 to A93 (role controls, support view,
copy, storage, isolation, LD-17), A94 (two tabs).

UI-PLAN §12.2 names for WP-14 "Incident commands, Block document version, Assign incident owner". Block document
version has no Core command of its own: the version is blocked for good by `ops.report_wrong_recipient` (inventory
CMD-50; a manual block was rejected as Kind 2). Assign incident owner has no Core command: a SuperAdmin names a
reviewer while no operator is active (`ops.assign_incident_reviewer`); the owner follows the application's assignment
(CMD-55 owner part rejected as Kind 2). The register adds `ops.classify_failure` and the two recheck commands (CC-01).

Commands outside WP-14 that the proof touches only as set-up or observation: `intake.start_individual`, `core.submit`
(WP-03); `pay.record_service_status`, `core.assign` (WP-06); `ops.start_work`, `ops.record_readiness`,
`core.authorize_external_act`, `ops.record_act_evidence` (WP-07); `ops.record_official_result`, `ops.record_artifact`,
`ops.confirm_artifact_association`, `dlv.retrieve_document`, `dlv.acknowledge_notice` (WP-08).

### 1.3 State coverage

S1 (loading) does not apply: every WP-14 page is server-rendered. S5 applies to SA-08a, SA-01m (the projection part)
and SA-08m.

| Page | Page states | C1 validation | C2 rejected | C3 accepted | C4 unresolved | C5 stale |
|---|---|---|---|---|---|---|
| OP-08, SA-08 | Rows A01, A45; S2, S7, denied A03; S3 A02; capped A01, A45 | — | — | — | — | — |
| OP-08i, SA-08i | Each kind and state A06 to A10, A13, A15, A46; reviewer A11; duty ended A12; reads A14; S-09 A47 | A30, A32, A36, A51, A55 | A27, A32, A36, A37, A51, A55 | A26, A31, A35, A37, A49, A54 | A83 | A27, A94 |
| OP-08w | No reportable file, already reported A17; records unreadable A21 | A20, A22 | A20 | A18 | A83 | — (no revision; the duplicate guard decides, A85) |
| OP-08o, SA-08o | Existing open incidents listed A39, A42 | A41, A43 | A41, A43 | A40, A42 | A83 | — (no revision) |
| SA-08a, SA-08s | Rows, field errors A57; index behind A60; history A58 | A57 | — | — | — | — |
| SA-08v, SA-01m, SA-08m | Healthy, behind, failed, unavailable A62 to A65 | — | — | — | — | — |
| SA-08q | Entries, S2, capped, facilities A68 | A71, A73 | A71, A73 | A70, A73 | A83 | A71 |
| Pages of other packages | Consequences A19, A29, A75 to A78 | — | — | — | — | — |

### 1.4 Specification scenarios

| Scenario | What WP-14 shows | Items |
|---|---|---|
| V13 (disclosure part; the association and replacement parts are WP-08's): "Issued result with wrong/missing artifact keeps outcome but blocks release … Replaced/revoked artifact never silently substitutes" | OP1 reports D's downloaded result file as released to a wrong recipient; the file is blocked for good on every channel and never substituted; the outcome stays "Issued"; the travel agent gets a truthful deletion request and acknowledges it; the correction is a verified replacement; the incident resolves only with the correction and the notice, then closes; the audit keeps every step | A16 to A38, A78; §3 Part D |
| BS B13: confirmed wrong-recipient disclosure: block, preserve known retrievals and recipients, correction and truthful notices, deletion request without recall, closure needs evidence also after completion; applicant, regulator and legal notices need separate authority | Affected block; required items; notice texts; compliance boundary; closure after completion by test | A15, A19, A25 to A29, A34 to A38 |
| BS B13: a SuperAdmin names a reviewer without filing authority when no operator is assigned | SA-08i reviewer naming on S; the reviewer works the incident with no case action; the duty ends at assignment | A11, A12, A48 to A52 |
| V23 (SA-08 part; the shell part is WP-01's, WP-01 §3 V23 parts B and C): "Projection outage reports uncertainty without fabricated zero/success; authoritative commands continue only when required current evidence/controls work. Maintenance/restore remains closed" | Audit index behind; failed projector named; unreadable counts "Unavailable"; incident commands accepted during the outage with writer receipts; a form whose required evidence cannot be read is removed; no restore, reconstruction or reopen control; SA-08 in maintenance shows the WP-01 page | A21, A60, A62 to A67; §3 Part R |
| BS B33: actor, evidence, reason, subject, event and recorded time; original entries kept; retrospective marked; no inference from clock order; diagnostics allowlisted | SA-08a, SA-08s, the fact page; SA-08v and SA-08q show ids and codes only | A57 to A61, A68 |
| BS B38: at a limit, truthful unavailable or retryable status; accepted work kept | SA-08q facilities and the "will wait again" sentence; lists at their cap say so | A68, A69, A72 |
| BS B35 | Replay per command; the matrix | A84, A85 |
| UX §3.2 "Completed case with continuing duty"; UX §2.1 Incident/follow-up | Incidents of a completed application stay owned and closable without reopening processing | A13, A38 |
| UX §6.3 Recovery boundary; BS B39, B40 | No restore, lost-interval reconstruction or "Reopen system" control; protection marks resolve only on SA-09m (WP-11) | A67 |
| CC-01 | SA-08q hosts the two recheck commands with truthful counts and effects | A68 to A74 |
| V24 (keyboard and phone) | The WP-14 tasks by keyboard and at 390 px | A95 to A106 |

## 2. Acceptance checklist

### 2.1 OP-08 Incidents and follow-up (operator list)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP14-A01 | Operator (OP1) | OP-08 (§3 D-1) | Open the rail item "Incidents and follow-up". Read the list. | Breadcrumb and `h1` "Incidents and follow-up"; lead "Incidents you own or review, and incidents of the applications assigned to you."; "Read at [time] IST". Count line "[n] open incidents" (incidents, not applications); at the read's maximum "500 or more open incidents" and no total. One row per open incident, oldest first (Core's order): kind words (§0.2); application (applicant name linking the operator's application page, and the service; "No application" when it has none; the reference only for a reader who may not read the application); owner words; state words; what happened (the recorded note, or the sentence of an incident TravelMudra opened itself; a long note is shortened with its full text reachable by keyboard and touch, AC-20); what it still needs (each missing item in words, or "Ready to resolve"); opened "[time] IST". A row the reader owns or reviews reads "Yours to act on" in text. V's association incident is listed for OP1 with "Yours to act on". No age, "overdue" or SLA wording. | L | PL OP-08; UX §5.2; D7; WP-08 E-10; I-13 |
| WP14-A02 | Operator (OP1) | OP-08 filters (§3 D-1) | Filter by kind "Result file needs review"; then "Yours to act on"; then a kind with no incident; clear. Reload; press Back. | Filters are partitions of Core's list by Core fields (kind; owner or reviewer equals the reader); the filter sits in the address as enumerated values only (SH-R06); Back and reload keep it. The no-match view: S3 "No open incident matches this view." with "Clear the filter". The result count is announced and focus stays (AC-16). No filter offers "Resolved" or "Closed" (the read returns open incidents only, A03). | L | PL OP-08 (filters), §1.3 S3; SH-R06; AC-16 |
| WP14-A03 | Operator; test | OP-08 in each state | Test: a reader with no open incident; the list read unavailable (availability failure); an access, session, maintenance or support-view refusal of the list read. Live: read the line under the list. | S2: "No open incident needs you now." (never "All done" or "No incidents"). Read unavailable: S7 with the reason category and "Try again"; never an empty list or "0". Access refusals: the shell (SH-02, sign-in or maintenance), never earlier rows (LD-14). The list states: "Resolved incidents that wait to be closed are not listed here. Open them from the application's incidents or from your receipt." (Core lists open incidents only; §6 Q-05.) | L (line) + T | PL §1.3; D7; LD-14; §0.1 Reads |
| WP14-A04 | Test | OP-08 and SA-08 rows of an incident whose application is completed (fixture) | Render. | The row says "Processing completed" for the application only where a read returns that fact; no incident read returns it today, so the row shows the incident without it, and the item is "Partly met" (§6 Q-09). The row never shows the incident as closed because the application completed. | T | PL OP-08 ("linked completed case flag"), §6.3 Owned incidents; UX §3.2 |
| WP14-A05 | Test | Word maps of OP-08, OP-08i, SA-08, SA-08i | Render every kind, every state and every owner kind; an unknown kind or state from the read. | Every kind, state, owner kind and required item has the §0.2 words. State `assigned` reads "Open: being worked" and never "With a reviewer"; a reviewer shows only from the reviewer fact, also for an `assigned` incident without a reviewer (evidence on an `awaiting_evidence` incident). An unknown code shows the UAT-13 fallback with the code, never a blank. | T | WP-06 D-05; `labels.ts:31`; `commands/incidents.ts:213` |

### 2.2 OP-08i One incident: reading (operator and reviewer)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP14-A06 | Operator (OP1) | OP-08i of V (§3 D-1) and of D's disclosure (§3 D-6) | Read the page from the top. | Breadcrumb "Incidents and follow-up › [kind words]"; `h1` "[kind words]: [applicant]" (or the kind words alone without an application); "Read at [time] IST". Sections in order: "What happened" (the note or the automatic sentence; "Opened by [name]" or "Opened by TravelMudra (automatically)", opened time IST); "Incident" facts as separate rows (state, owner, reviewer when one is named, application link, result file type and version where the incident names one, reference); "Next step" (A07); "Required to resolve" (A08); "Evidence recorded" (kind words, reference, note, in recorded order; no edit or delete control); the kind's block (A09, A15); then the forms the reader may use. No combined badge. | L | UX §2.2, §7.4 (Action panel); PL OP-08 (detail) |
| WP14-A07 | Operator; test | OP-08i "Next step" for each kind and state | Read D's incident at §3 D-6, D-8, D-9, D-10 and D-11; test every kind. | The action panel names the owner and one exact next step derived from Core's missing items, in order: the association decision → "Decide the association on the association review" with the link to OP-05r; a notice → "Post the notice to [name]"; the correction → "Record the correction: a replacement result file for this application, or a reference showing that none is owed"; evidence → "Record evidence of what was done"; none missing → "Ready to resolve"; resolved → "Close the incident"; closed → "No action: closed [time] IST". "You" only when the reader is the owner Core names; another owner: "Waiting on [owner]". No step instructs anyone to file, pay, send or perform an external act (F-33); a follow-up of a later official fact never says "file again". | L+T | UX §7.4 Action panel; WP-07 F-13, F-33; CMP-01 |
| WP14-A08 | Operator (OP1) | OP-08i of D, "Required to resolve" (§3 D-6, D-9) | Read the list before the notice, after the notice and after the replacement. | One line per required item with "recorded" or "not recorded yet" in text (§0.2 words). The correction line says, before any form, that a replacement verified for this application meets it and that any recorded reference other than a statement meets it too (Core's rule; §6 Q-03). After D-7 "A notice to [TA]: recorded"; after D-9 "The correction: recorded". No line claims more than Core's missing list. | L | BS B13; `missingEvidence` |
| WP14-A09 | Operator (OP1); test | OP-08i of V, an association incident (§3 D-1) | Look for the decision forms and the review copy. Test: OP-08i of an association incident for the owner, a reviewer and a SuperAdmin-owned one. | No "Confirm the association" or "Reject the association" form and no review-copy form on OP-08i: OP-05r (WP-08) is their one host page; OP-08i shows the candidates (reference and group label only) and the link "Review the association" → OP-05r. After the decision (§3 D-13) the line reads "The result file's association is decided" and the incident is resolved or open as Core reports. | L+T | CC-13; WP-08 Q-W08-08; WP08-A19 to A22; one host page per command |
| WP14-A10 | Test | OP-08i of each other kind (fixtures) | Render: `artifact_missing_or_wrong`, `bytes_integrity`, `operational_failure`, `country_defect`, `custody_discrepancy`, `official_fact_follow_up` owned by OP3, `post_filing_correction`. | Each shows its automatic sentence or note, its required item and its next step. Byte integrity: "Releases of this file are paused while this incident is open." Custody: a link to the original's page (OP-09i, WP-12). Follow-up: owner OP3 named, readable and workable by OP3 although OP3 is not the application's operator; text "An official fact arrived after the outcome was recorded as unresolved. The outcome does not change." (WP-11 E-17). Correction after filing: no correction form; text names the held correction as superseded. No page offers to repeat, refile, retry or reopen work; no "not filed", "failed" or "expired" for an act. | T | UX §2.1, §3.2; WP-11 §4; WP-12 design §6 |
| WP14-A11 | Operator (OP2, reviewer) | OP-08 and OP-08i of S's incident after §3 S-3 | Read the row and the page. | Row owner "You (reviewer)", "Yours to act on". OP-08i: owner "[OP2] (reviewer)"; the application is shown by reference only where OP2 may not read it, never with the applicant's other facts; no link to a case action; no filing, readiness, outcome, send or completion control anywhere; the forms of A30 and A34 show. A sentence: "You review this incident while the application has no active operator. You have no case action." | L | BS B13 ("reviewer without filing authority"); UX §2.3 |
| WP14-A12 | Operators (OP2, OP1); test | OP-08 and OP-08i after §3 S-5 (S assigned to OP1) | OP2 reloads OP-08i of S and OP-08. OP1 reads OP-08. Test: the same after a reassignment of D from OP1 to OP2 with an open incident. | OP2: SH-02 "Your access changed" on the incident; the row is gone from OP-08 (delta −1). OP1: the row with owner "You" (the duty moved, Core's transfer). Test: after the reassignment the previous operator gets SH-02 and the new one owns the incident; a SuperAdmin-owned incident keeps its owner. Nothing earlier shows after an access change (LD-14). | L+T | WP-09 G-09; `transferApplicationDuties`; `incidentDutyHolders` |
| WP14-A13 | Test | OP-08i of an incident of a completed application (fixture) | Render; record evidence; resolve; close. | The page says "Processing completed for this application. This incident stays open until it is resolved and closed." Every incident command is accepted (Core allows it after completion); no processing action is offered; the application stays completed. | T | BS B13 ("even after service completion"); UX §3.2 |
| WP14-A14 | Test | OP-08i and SA-08i reads (HTTP tests) | (1) `ops.incident` unavailable. (2) The case read for names unavailable. (3) The delivery records read unavailable on OP-08i of a disclosure. (4) Separately: an access, session, maintenance or support-view refusal between the first read and an optional read. | (1) S7, no form (the incident read is the evidence of every incident form). (2) Names read "Unavailable" in that block only; forms stay. (3) The release list reads "The releases of this file cannot be read now."; the incident forms stay (their evidence is the incident read). (4) The shell, never facts read earlier. No page code catches every error around a read. | T | LD-14; WP-11 I-05; WP-07 F-04 |
| WP14-A15 | Operator (OP1) | OP-08i of D, the disclosure block (§3 D-6) | Read it. | "The file": type and version, "Blocked after a release to a wrong recipient. It is never released again."; "Releases and emails named in the report" (time IST, how, recipient words, reference); "Recipients recorded: [names] (travel agent)"; "Owning travel agent: [name]"; "Notices posted: [n]"; "Outcome: Issued (unchanged)". The compliance boundary (§0.2) as a CMP-10 notice with owner "product owner", no form. No "Recall" or "Block this version" control. | L | BS B13; PL §13.2 B-09; UX §5.2 |

### 2.3 Report a release to a wrong recipient (`ops.report_wrong_recipient`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP14-A16 | Operator (OP1) | OP-08w of D (§3 D-3), reached from OP-02 "Delivery & originals", from OP-05 and from OP-08 | Open the page. Read it. | `h1` "Report a release to a wrong recipient: [applicant]"; "Read at [time] IST". One block per file of D that is not yet reported: type, version, eligibility words. "Releases and emails of this file" as a `fieldset` of checkboxes, none prechecked: time IST, how (download, selection, email), to whom (role words), requested by, reference. An evidence row for a disclosure outside the delivery records (optional). "What happened" (required). Visible effect before the button: "The file is blocked for good: it is never released again on any channel. The releases you choose and their recipients are recorded. The incident needs a correction and a notice to each affected travel agent before it can be resolved. Nothing is recalled: recipients are asked to delete the file." Button "Report and block the file" (destructive variant). The report form is on no other page (A79). | L | UX §5.3; BS B13; CC (OP-08; OP-02) |
| WP14-A17 | Operator (OP1); harness; test | OP-08w after the report; an application with no result file (fixture) | Reload OP-08w of D after §3 D-3. Harness (§3 D-5): a second report of R-D1 with a new key and the current page's fields. Test: no file. | R-D1 shows no form: "Reported on [time] IST" with a link to its incident. The harness send is refused `conflict_duplicate` / `duplicate_operation`; the re-rendered page names the existing incident: "This file was already reported." Nothing is recorded (incident count delta 0). No file: "No result file of this application can be reported." and no form. | L+T | `disclosure:<version>` dedupe |
| WP14-A18 | Operator (OP1) | OP-08w of D (§3 D-3) | Choose TA's download release of R-D1. Write "WP14 [stamp] the file held another traveller's page". Send. | C3 receipt (A81) with Current: "R-D1: Blocked after a release to a wrong recipient. It is never released again."; the incident reference linking OP-08i; required items "The correction: not recorded yet", "A notice to [TA]: not recorded yet"; "Outcome: Issued (unchanged)". The receipt never says "recalled" and never says that the travel agent was told. OP-08 +1 incident (OP1, "Yours to act on"). | L | BS B13; UX §8.3 (byte blocked) |
| WP14-A19 | TA; operator (OP1); SuperAdmin (SA1) | TA-07, TA-07d (tab opened before §3 D-3), TA-10 of D; OP-05, OP-06, OP-07 of D; SA-01m (§3 D-4) | TA downloads R-D1 from the old tab. Read every page. | TA-07: "Outcome: Issued"; R-D1 "This file is held. It is not released again."; no download of R-D1 and no other file offered in its place. TA-07d old tab: refused `version_blocked` with that sentence; no byte; no substitute. TA-10: no new notice yet (delta 0). OP-05: R-D1 "Blocked after a release to a wrong recipient"; OP-06: "Not releasable now: blocked …"; OP-07: Core's artifact row as Core returns it. SA-01m: "Wrong-recipient disclosures open" +1. Every earlier retrieval of R-D1 stays listed with its time and version. | L | BS B12, B13; UX §8.3; WP-08 wording |
| WP14-A20 | Operator (OP1); harness; test | OP-08w refusals | (1) Send with nothing chosen and no evidence (§3 D-3). (2) Test: a statement as the only evidence. (3) Harness: a release id of another version with the current page's fields. (4) As A17. (5) Harness: OP2 sends the report on D; `syn-ta-3` posts it. (6) Test: a version of another group. | (1), (2): "Choose at least one release or email of this file that went out, or record evidence of a disclosure outside the delivery records. A statement alone does not establish a disclosure." (`incident_evidence_insufficient`), choices and note kept. (3): the same reason; nothing blocked. (5), (6): not found; no fact of D. Each time nothing is recorded: no incident, no block, eligibility unchanged. | L ((1), (5)) + T | §0.5 |
| WP14-A21 | Test | OP-08w while the delivery records read is unavailable (availability failure) | Render; send a saved envelope with outside-records evidence. | The incomplete-review notice: "The releases of this file cannot be read now. A report needs them so that every recipient is recorded: a file is reported once. Try again later. Owner: TravelMudra." and no form (I-05 class: the release records are the evidence the report records; §6 Q-04 records the trade-off). An access refusal of that read: the shell (LD-14). The saved envelope is decided by Core as Core answers it. | T | WP-11 I-05; LD-14; `disclosure:<version>` dedupe |
| WP14-A22 | Test | The OP-08w handler | Send 51 chosen releases; a release field with a four-digit index; a release value of 41 characters; a note of 2001 characters; six evidence rows; a row with only a note. | Every field and every indexed row reaches Core whole: 51 releases refused at the field ("Choose at most 50 …" in Core's words) with the choices kept; the four-digit index is read; the long value reaches Core and is refused at its field; the 2001-character note refused at its field, kept; six rows refused at the field; the note-only row refused at its index, never dropped. No `.slice` (today `case-work.ts:452-453`, `incidents.ts:244`). | T | LD-17; WP-12 J-06 |
| WP14-A23 | Test | A disclosure outside the delivery records (fixture: OP1 sent the file by its own email to a wrong address) | Report with the external reference `SYN-W14-[stamp]-MAIL` and no release chosen. Read OP-08i. | Accepted; the version is blocked for good; recipients recorded: none; required: the correction and a notice to the owning travel agent. OP-08i says "No recipient account is recorded: a request to delete cannot be posted in TravelMudra. Record how the recipient was asked as evidence." The report's evidence is listed apart from the incident's evidence and does not meet the correction. | T | BS B13; `commands/incidents.ts:113-142` |
| WP14-A24 | SuperAdmin (SA1); test | SA-08, SA-08i, SA-08o (§3 S-1) | Look for a way to report a release to a wrong recipient. Test: SA-08o with kind "Released to a wrong recipient" on an application. | No SuperAdmin page offers the report (no admin route; §6 Q-01). SA-08o states the effect of a hand-opened disclosure before its button: "This records a disclosure incident without a file or recipients. It does not block a file for good: releases of the application pause only while the incident is open. To block a released file for good, the application's operator reports it; when no operator is active, assign one first." The test confirms that Core's result matches the sentence (no version block; release paused while open; released again after closure). | L+T | `ops.open_incident` (§0.1); CC row 1; §6 Q-01 |

### 2.4 Post a disclosure notice (`ops.post_disclosure_notice`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP14-A25 | Operator (OP1) | OP-08i of D, "Post a notice to an affected travel agent" (§3 D-7) | Read the form. Choose each option in turn. | Shown only on an open disclosure incident for a reader who may work it. "Travel agent" (select, required, none preselected) lists only Core's affected accounts with role words: "[name] (received the file)", "[name] (owns the application)", "[name] (received the file; owns the application)"; an account already noticed shows "notice posted [n]" and stays selectable (Core decides, A27). "Notice" (radio): "Ask them to delete the file" (`deletion_request`), "Inform the owning travel agent" (`disclosure_information`). The visible review quotes, word for word, the text the chosen travel agent will read on TA-10n for that variant. "It never says that the file was recalled." Button "Post the notice". | L | BS B13 ("truthful notices"); UX §8.2 |
| WP14-A26 | Operator (OP1) | OP-08i of D (§3 D-7, tab 2) | Choose TA, "Ask them to delete the file"; send. | C3 receipt "Notice posted" (the summary returns the notice) with Current: "A notice to [TA]: recorded"; "Notices posted: 1". TA-10 of TA +1 (A78). Nothing on any page says that the file was deleted or recalled. | L | BS B13 |
| WP14-A27 | Operator (OP1, tab 1); harness; test | OP-08i of D (§3 D-7) | Tab 1 (opened before tab 2's send) sends the same notice. Harness: a new-key notice to TA with the current revision. Test: an account not affected; "Inform" to a recipient who does not own the application; a resolved incident; a non-disclosure incident. | Tab 1: C5 CMP-14 "Changed since your review." with the current required items and notices beside the unsent choice (`stale_revision`); nothing recorded. Harness: "A notice to this travel agent is already posted." (`conflict_duplicate` / `duplicate_operation`); nothing recorded. Test: at the travel-agent field "This account was not affected by this disclosure." (`not_affected`); `incident_not_open` "This incident is not open."; not found for another kind. TA-10 count unchanged each time. | L ((1), (2)) + T | §0.5; CMP-14 |
| WP14-A28 | Test | The notice texts, staff review and travel-agent page (`disclosureBody`) | For each variant and each incident shape (reported with recipients; reported outside the records; hand-opened; recipient equals owner), compare the review text of A25 with the TA-10n text, and each sentence with Core's facts. | The review text equals the posted text. Each sentence of either variant is true for the incident's facts, or the item records the false sentence as a finding: today the information text says "The file is blocked and is not released again" and "TravelMudra has asked the recipient to delete it" whatever the facts (§6 Q-02). The deletion request never claims that the owning travel agent was informed. | T | BS B13; WP-08 E-05 class; §6 Q-02 |
| WP14-A29 | Operator (OP1); TA | OP-08i of D after TA's acknowledgement (§3 D-8) | Read the notices line. | The page shows "Notices posted: 1" and the required item. It shows the acknowledgement only where a read returns it to staff ("The travel agent acknowledged the request to delete it on [time] IST"); no staff read returns it today, so it reads "Acknowledgement: not shown on this page" and the item is "Partly met" (§6 Q-09). Never "deleted". | L | BS B13; LD-06 |

### 2.5 Record incident evidence (`ops.record_incident_evidence`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP14-A30 | Operator (OP2, reviewer) | OP-08i of S, "Record evidence" (§3 S-4) | Read the form. | Evidence rows (one shown, "Add another row" up to Core's limit of 10; without JavaScript the design's fixed rows), each: "Evidence" (External reference, Document of the case, Recorded fact, My statement), "Reference or statement", "Note on the evidence" (optional); "Note" (optional). Hint: "A statement alone does not count as evidence of what was done." Effect: "Recorded on this incident. It cannot be edited or removed." On a disclosure: "Any reference other than a statement also counts as the correction." | L | UX §6.1; BS B33 |
| WP14-A31 | Operator (OP2) | OP-08i of S (§3 S-4) | Record "My statement" "WP14 [stamp] checked the portal log". Then record an external reference `SYN-W14-[stamp]-REF-1`. | Both accepted: neutral receipts "Request recorded" (A81) with Current lines. After the statement the required item stays "Evidence of what was done: not recorded yet"; after the reference it reads "recorded" and the next step "Ready to resolve". The evidence list shows both rows in recorded order. | L | `missingEvidence` (`evidence`) |
| WP14-A32 | Operator; harness; test | OP-08i refusals | (1) Send with no row (§3 S-4). (2) Test: kind blank with a reference; a document of another group; a malformed artifact reference. (3) Test: a closed incident; a stale revision. (4) Harness: OP2 after §3 S-5. | (1) C1 at the evidence row "Record at least one piece of evidence."; values kept. (2) At `evidence.0.kind` "Choose the kind of evidence." (`evidence_kind_unknown`); at `evidence.0.id` "This document cannot be used as evidence here." (`evidence_version_not_usable`), `invalid_id`. (3) "This incident is not open."; CMP-14. (4) SH-02. Nothing recorded (evidence rows delta 0). | L ((1), (4)) + T | §0.5 |
| WP14-A33 | Test | The evidence handlers (all WP-14 forms with evidence rows) | Send 11 rows; a row with only a note; a reference of 201 characters; a note of 2001 characters; rows with gaps in their indexes. | 11 rows refused at the field with all values kept; the note-only row refused at its index; over-limit values refused at their fields, never cut; every filled row reaches Core in index order. No `evidenceRowOf` row dropped, no `.slice`. | T | LD-17; WP-12 J-06; `evidence-form.ts` |

### 2.6 Resolve and close (`ops.resolve_incident`, `ops.close_incident`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP14-A34 | Operator; test | OP-08i and SA-08i, the resolve form, for each combination of missing items | Read D's page at §3 D-6 (notice and correction missing) and at D-9 (none missing); read OP1's operational failure at §3 S-6 (evidence missing). Test every combination. | The form shows when nothing is missing, and also when only "evidence" or "the correction" is missing, because Core counts the resolution's own evidence for them: then the form carries an evidence row with the hint "Add the evidence that resolves it: it counts for [the missing items]." When a notice or the association decision is missing, the form is replaced by the missing items and their next steps (Core would refuse). Effect: "Resolving records how it was resolved. Releases that this incident paused may continue. The incident is then closed." The page never blocks a resolution that Core accepts (H-02). | L+T | WP-10 H-02; `missingEvidence(tx, i, evidence)` |
| WP14-A35 | Operator (OP1) | OP-08i of D (§3 D-10) | Write "WP14 [stamp] replacement verified; deletion requested"; resolve. | Neutral receipt "Request recorded" with Current "Resolved: waiting to be closed" and the close form. TA-07 of D offers R-D2 only; R-D1 stays held (A19 words). D's incident leaves OP-08 (open list, delta −1) and stays reachable from its address and from D's incidents. SA-01m disclosure count back to the P-0 value. | L | BS B13 |
| WP14-A36 | Operator; harness; test | Resolve refusals | (1) Harness at §3 D-6: resolve with a note and the current revision. (2) Test: a blank note. (3) Harness after §3 D-10: a new-key resolve. (4) Test: a stale revision. | (1) Refused `incident_evidence_insufficient`; the re-rendered page lists each missing item in words ("A notice to [TA] is not posted yet."; "The correction is not recorded yet.") with the note kept. (2) C1 at the note. (3) "This incident is not open." (`incident_not_open`). (4) CMP-14. Nothing recorded (state unchanged). | L ((1), (3)) + T | §0.5 |
| WP14-A37 | Operator (OP1); test | OP-08i of D and of V, close (§3 D-11, D-13) | Close D's incident with no note. Harness: a new-key close. Test: close an open incident (saved envelope). Read the closed page. | The close form shows only on a resolved incident: "Closing ends the duty. Nothing about the application changes."; optional note; button "Close the incident". Neutral receipt; Current "Closed [time] IST". Closed page: every fact, item, evidence row and note stays; no form. The new-key close and the close of an open incident: "This incident is not open for closing: it must be resolved first." or "… is already closed." (`incident_not_open`); nothing recorded. V's incident, resolved by the association decision (§3 D-13), closes the same way. | L+T | BS B13; `ops.close_incident` |
| WP14-A38 | Test | Resolve and close on a completed application (fixture) | As A13. | Accepted; the application stays completed; OP-07 and TA-07 completion facts unchanged; no processing action appears. | T | BS B13 |

### 2.7 Open an incident (`ops.open_incident`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP14-A39 | Operator (OP1) | OP-08o of D (§3 S-6), reached from OP-02 and OP-08 | Read the page. | `h1` "Open an incident: [applicant]". "Open incidents of this application" listed first (kind, state, opened time IST, link), because Core has no duplicate guard. "Kind" (radio or select, required, none preselected) offers only "Operational failure", "Original's whereabouts uncertain", "Correction after filing", each with a one-line meaning. "What happened" (required). Evidence rows (optional, A30 rules). Effect: "You own it while you are this application's operator. It needs evidence of what was done before it can be resolved. It opens nothing at the authority and changes no fact of the application." No kind about result files (WP-08 CC-13: Core opens those itself). | L | CC-13; `OPERATOR_OPENABLE_INCIDENT_KINDS`; PL OP-08 |
| WP14-A40 | Operator (OP1) | OP-08o of D (§3 S-6) | Choose "Operational failure"; write "WP14 [stamp] the portal printed a blank receipt"; send. | Neutral receipt "Request recorded" with Current: the incident (link), owner "You", state "Open", "Evidence of what was done: not recorded yet". OP-08 +1. The classification "Not known yet" that Core records at opening shows only as A56 allows. | L | `ops.open_incident` |
| WP14-A41 | Operator; harness; test | OP-08o refusals | (1) Send without a kind or a note (§3 S-6). (2) Harness: kind `artifact_association` on D (WP08-A26 owns the same check from OP-05); kind `country_defect`. (3) Test: OP1 on an application it is not assigned to; OP2 on D. | (1) C1 at each field; values kept. (2) At the kind "An operator can open only an operational failure, an original's whereabouts or a correction after filing." (`not_operator_openable`). (3) Not found; no fact of the application. Nothing recorded (incident count delta 0). | L ((1), (2)) + T | §0.5 |
| WP14-A42 | SuperAdmin (SA1) | SA-08o (§3 S-1) | Read the page. Choose each kind and read its effect line. Open "Operational failure" on S (§3 S-1). | `h1` "Open an incident". "Kind": the nine kinds with their meaning. "Application reference" (optional, monospace, with its format named); "Country reference" (shown as required for "Country rule defect"); "What happened" (required); evidence rows (optional). Effect: "TravelMudra administration owns it, also on an assigned application; that application's operator can read and work it too. The owner does not change when the application is assigned." Per kind: the disclosure sentence of A24; for "Result file needs review": "Without a result file this incident cannot be resolved: its required decision needs a file. Result files open their review themselves."; for "Official fact after an unresolved outcome": "The follow-up of a later official fact is opened by recording the fact; open it here only for a fact recorded outside TravelMudra." The effect lines state Core's behaviour (A44); they block nothing. The open on S: neutral receipt "Request recorded" with Current: the incident (link), owner "TravelMudra administration", "Needs a SuperAdmin", "Evidence of what was done: not recorded yet". | L | `ops.open_incident` (§0.1); §6 Q-06, Q-08 |
| WP14-A43 | SuperAdmin; harness; test | SA-08o refusals | (1) Send with a kind and a blank note (§3 S-1). (2) Test: "Country rule defect" without a country; an unknown application reference; a kind outside the list (raw). | (1) C1 at "What happened"; kind and other values kept. (2) "Enter the country reference for a country rule defect." (`countryId` `required`); not found for the unknown application; at the kind, the choice refused. Nothing recorded. | L (1) + T | §0.5 |
| WP14-A44 | Test | SA-08o effects against Core | Open by hand each of: a disclosure on an application; a result-file review on an application; an operational failure without an application; a country rule defect. Read the incidents. | The disclosure: owner TravelMudra administration, no version, no recipient, releases of the application refused while open, released again after resolution (A24 sentence true). The result-file review: required item never met; resolve refused while it lasts (the A42 sentence true; §6 Q-08). Operational failure and country defect: classification "Not known yet" recorded. Each matches the effect line shown before the button. | T | WP-10 H-10 (no prediction beyond Core's facts) |

### 2.8 SA-08 Incidents (SuperAdmin), the decision forms (S-09) and the reviewer (`ops.assign_incident_reviewer`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP14-A45 | SuperAdmin (SA1) | SA-08 (§3 D-2, S-1) | Open the rail "Incidents & audit". Read the list. Apply the filter "Needs a SuperAdmin". | Rail current item "Incidents & audit"; its members: Incidents, Audit, Measures, Derived views, Document checks that could not finish. `h1` "Incidents"; lead "Every open incident and its owner. Incidents without an active operator belong to TravelMudra administration."; "Read at [time] IST"; count "[n] open incidents" or "500 or more open incidents". Rows as A01, with the owner words; a row owned by TravelMudra administration reads "Needs a SuperAdmin" in text. "Open an incident" links SA-08o. The filter "Needs a SuperAdmin" equals the SA-01 group 10 rule (`readerActsOn`) and is the target of that group's link. States as A02, A03 (S2 "No open incident now."). | L | PL SA-08; WP-06 design §2.1 group 10 |
| WP14-A46 | SuperAdmin (SA1) | SA-08i of S (§3 S-2) and of D's disclosure (observation) | Read the page. | The frame of A06 with the SuperAdmin breadcrumb "Incidents & audit › Incidents › [kind words]". The application links SA-04a (WP-11). The forms the SuperAdmin may use: evidence, notice (disclosure), resolve, close (as on OP-08i), "Name a reviewer" (A48), "Classify the failure" (operational failure, country rule defect, A53). No operator act control (A88). | L | PL SA-08 ("as OP-08 with assignment") |
| WP14-A47 | SuperAdmin (SA1); test | SA-08i of V, an association incident (§3 D-2); host-page test | Read the page and its HTML. Test: render SA-08i for every kind and state, and every WP-14 page; compare each form action with the route inventory. | Seam item S-09: SA-08i has no "Confirm the association" or "Reject the association" form, and no form that posts to an address without a route (today `/admin/incidents/:incidentId/confirm-association` and `…/reject-association`). The page says: "The application's operator, or a reviewer named while no operator is active, decides the association on the association review." The test asserts that every rendered form action on every WP-14 page is a registered route of that surface and method (`src/web/route-inventory.ts`), and that `…/confirm-association` and `…/reject-association` render only on OP-05r. A hand-made POST to the two admin addresses answers the uniform not-found page; nothing is recorded. | L+T | S-09 (PLAN §8); WP-08 PM Q-11; P-13 (WP-14 known defect); CC-12 to CC-16 |
| WP14-A48 | SuperAdmin (SA1) | SA-08i of S, "Name a reviewer" (§3 S-3) | Read the form. Test: the same form on an association incident. | Shown only while Core allows it. "Reviewer" (select, required, none preselected): Core's list of active operators with a second factor. "Reason" (textarea, at least 10 and at most 1,000 characters, hint "Why this person reviews it. Recorded with the naming."). Effect: "The reviewer owns this incident while the application has no active operator: they read it, record evidence, post notices and resolve it. They get no case action and no filing authority. When an operator is assigned, the incident moves to that operator and the reviewer's duty ends." On an association incident also: "A reviewer outside the assignment cannot see the candidates' identity facts: they can reject the association or ask; they cannot confirm it." (WP-08 E-01; P-13 item 2.) | L (S) + T | BS B13; WP-08 E-01, WP08-A28, WP08-A155 |
| WP14-A49 | SuperAdmin (SA1); operator (OP2) | SA-08i of S (§3 S-3); OP-08 of OP2 | Choose OP2; reason "WP14 [stamp] no operator is assigned yet"; send. | Neutral receipt "Request recorded" with Current: owner "[OP2] (reviewer)", state as Core reports it. SA-01 group 10 −1 from S-1 (no longer "Needs a SuperAdmin"). OP2's OP-08 +1 with "You (reviewer)" (A11). | L | `ops.assign_incident_reviewer` |
| WP14-A50 | SuperAdmin (SA1) | SA-08i of V (§3 D-2) | Read where the reviewer form would be. | No form; the boundary: "A reviewer can be named only while the application has no active operator. Its operator, [OP1], owns this incident. To change who owns it, reassign the application." with a link to SA-03c (Core's `already_assigned`). | L | `offers.assignReviewer`; PL §1.1 D5 |
| WP14-A51 | SuperAdmin; harness; test | Reviewer refusals | (1) Reason "Short" (§3 S-3). (2) Test: a suspended operator, an operator without a second factor, a SuperAdmin account as reviewer (raw). (3) Test: an operator assigned to the application between the read and the send. (4) Test: a closed incident; a stale revision. (5) Harness: OP1 posts the form. | (1) C1 "Enter at least 10 characters."; reviewer stays chosen. (2) At the reviewer field "This person cannot review now: not an active operator with a second factor." (`not_active_operator`). (3) "An operator is now assigned to this application, so the operator owns this incident." (`already_assigned`), reason kept. (4) `incident_not_open`; CMP-14. (5) Not found. Nothing recorded (owner unchanged). | L ((1), (5)) + T | §0.5 |
| WP14-A52 | SuperAdmin (SA1) | SA-08 and SA-08i | Look for an owner control. | No "Assign incident owner", "Take ownership" or "Reassign incident" control (no Core command; CMD-55 owner part rejected). Text where owner change is asked: "The owner of an incident follows the application's assignment. Reassign the application to move its incidents." | L | SI CMD-55; UX §6.1 |

### 2.9 Classify a failure (`ops.classify_failure`)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP14-A53 | SuperAdmin (SA1) | SA-08i of S's operational failure, "Classify the failure" (§3 S-2) | Read the form. | Shown on an operational failure or a country rule defect. "Scope" (radio, required): "Local to one country", "Shared component", "Not known yet", each with its meaning. "Shared component it started in" (shown for shared; the closed list in words). "Country reference" (for local). Evidence rows. "Reason" (10 to 1,000). Hint: "A shared host or a shared interruption alone does not make a failure shared. A shared scope needs evidence, other than a statement, that names the component." Effect: "This classification replaces the current one. The earlier one stays in the audit history." | L | `ops.classify_failure`; BS B36 |
| WP14-A54 | SuperAdmin (SA1) | SA-08i of S (§3 S-2) | Choose "Local to one country", Synthetica's reference, reason "WP14 [stamp] only Synthetica cases are affected"; send. | C3 "Classification recorded: Local to one country" (the summary names the scope) with the incident's current facts. SA-08s of the incident lists the fact with before "Not known yet" and after "Local to one country", the SuperAdmin and the time. | L | `writeClassification` |
| WP14-A55 | SuperAdmin; test | Classification refusals (§3 S-2) | (1) "Shared component", component "Database", evidence "My statement" only, reason valid. (2) "Shared component" without a component. (3) "Local to one country" without a country. (4) Test: a component with "Not known yet"; a reason of 9 characters; a subject id of the wrong kind (raw). | (1) "A shared scope needs evidence, other than a statement, that names the component." (`failure_scope_evidence_missing`). (2) At the component field "Choose the shared component." (`required`). (3) At the country field (`required`). (4) `not_applicable` at the component; C1 at the reason; not found. Values kept each time; nothing recorded (classification unchanged). | L ((1) to (3)) + T | §0.5 |
| WP14-A56 | SuperAdmin; test | SA-08i "Current classification" | Read after §3 S-1 and S-2. Test: the subject read unavailable. | No incident read returns the classification. The page shows it only from the audit subject read of the incident as an explicit recorded field with its time and SuperAdmin ("Local to one country, recorded [time] IST by [name]"); otherwise "Not shown on this page" with the link to the audit history. "Partly met" while no Core read returns it (§6 Q-09). Classification of tasks, intake attempts and applications is not offered on any page (§6 Q-10). | L+T | WP-11 I-10; BS B33 |

### 2.10 SA-08a, SA-08s Audit

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP14-A57 | SuperAdmin (SA1) | SA-08a (§3 D-12, R-2) | Open "Audit". Filter by application D. Then enter "someone@synthetic.test" as the actor. Clear. | `h1` "Audit"; the freshness of the audit index in the lag form. Filters: kind of change, area, subject type and reference, kind of actor, actor reference, travel agent reference, application reference, from and to dates (IST days), "Only retrospective records". Each value that Core cannot use is refused at its field with Core's message and nothing is searched; the values stay. Rows, newest first: recorded time and event time (labelled, IST; "Not recorded" when none), kind of change in words, subject (linking SA-08s), actor (name and role, or "TravelMudra (automatically)"), application, "[n] evidence items", "Retrospective" marker. "Older entries" pages with no total. The address holds only references, enumerated values and dates (SH-R06); the email value is refused and the page states nothing about whether such an account exists. | L | PL SA-08; BS B33; SH-R06; CR-04 |
| WP14-A58 | SuperAdmin (SA1) | SA-08s of D's disclosure incident (§3 D-12) | Read the history. | Read from the fact log: "Read at [time] IST". Facts oldest first, paged ("Newer entries"): opened, the report's evidence (with the recipients count), the notice, the resolution, the closure; each with kind of change, recorded time and event time, actor and role, command, before and after values in words, reason, evidence. The artifact's eligibility change shows on the artifact's own history (linked). Nothing is merged, reordered by clock or reconstructed. | L | BS B33; UX §7.4 Timeline; WP-11 I-10 |
| WP14-A59 | SuperAdmin (SA1) | The fact page of one entry (§3 D-12) | Open one fact. | Every recorded field: type, times, actor, command, scope, before, after, reason, evidence, retrospective and its reconstruction note ("No reconstruction note was recorded" when none). No document content, file name or extracted personal value beyond what the fact records. | L | BS B33 |
| WP14-A60 | Test | SA-08a while the audit index is behind or failed; SA-08s at the same time | Fixture: the audit projector lagging; failed; never run. Search; open a subject. | SA-08a: S5 "Behind by [n] s when read at [time] IST" or "Freshness unavailable", and "Entries recorded after the index's position may be missing from this search."; an empty result reads "No entry matches in the part of the record searched so far.", never "No entries" as a fact. SA-08s is unaffected: complete from the fact log, "Read at". No page computes an as-of time. | T | BS B33; UX §8.3 (stale projection); LD-08 |
| WP14-A61 | Test | SA-08a, SA-08s, SA-08v, SA-08q output | Render with fixtures holding a file name, a URL, an extracted name and a credential-like value in a note. | Diagnostics show allowlisted identifiers and error categories only: SA-08v and SA-08q never show source URLs, document content, file names, credentials or extracted personal data. Audit entries show a reason or note only where the fact records it. | T | BS B33 (diagnostics) |

### 2.11 Reporting and diagnostic degradation (SA-08v, SA-08m, SA-01m; V23 SA-08 part)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP14-A62 | SuperAdmin (SA1) | SA-08v Derived views (§3 R-1) | Read the page. | `h1` "Derived views"; "Read at [time] IST". One row per projection: name in words, state words (§0.2), "Behind by [n] s" or "Up to date", recorded gaps "[n] records could not be projected", last run IST, last error category. An unhealthy projection: "Lists and counts that read [name] may be behind or incomplete. Actions still check the records." The gap list: projection, entry, kind of change, error category, recorded time IST. No rebuild, replay, restore or "Reopen" control. | L | PL §6.4 Reporting health; BS B33, B40 |
| WP14-A63 | SuperAdmin (SA1); test | SA-01m Monitors tab of Home (§3 D-14, R-1) | Read. Test: monitors with `incidents`, `travelDateRisk` and `uncertainEmails` null; the applications projection behind. | Tab of Home ("Decisions waiting" and "Monitors"). Each count names its unit; a null count reads "Unavailable", never "0". The page says "Nothing monitored needs attention" only when every count is known and zero; with any count unavailable it says "[k] counts cannot be read now." The send and completion boundary uses WP-06 group 13's LD-04 wording (no "no product trigger in this build"; F-W06-09) and the lag form of its projection (no entry number). Incident counts link SA-08 with its filter. | L+T | WP-06 F-W06-09; LD-04; LD-08; D7 |
| WP14-A64 | SuperAdmin (SA1) | SA-08m Measures (§3 R-1) | Read. | Each measure with its definition (what it counts, out of what, events, cohort, time zone, missing-value treatment); results with "[n] cases, [m] without a value"; a measure with no data source "No data source yet" with Core's "arrives with" text, never 0; freshness in the lag form of its source. "Deferred" when the design keeps the existing page (§6 Q-11). | L | PL SA-08; BS B32, B33 |
| WP14-A65 | Test | SA-08v, SA-01m, SA-08a, SA-01 (WP-06 groups), OP-08 and SA-08 during a projection outage (system test pattern "core restarted with its audit projector failing", WP-01 §3 V23 B1) | Fail one projector; then `views.projections` itself (availability failure); then `views.monitors`. | SA-08v names the failed projection with its reason; when its own read fails: S7, no "all current". SA-01m and SA-01 group 16 name the projection (WP06-A06 governs the group mechanics). Counts that cannot be read: "Unavailable". OP-08 and SA-08 lists (authoritative) are unaffected and say "Read at". No page shows a zero, a success or "all current" it did not read. | T | V23; BS B33; D7 |
| WP14-A66 | Test | Incident commands during the projection outage of A65 | Record evidence, post a notice, resolve and close; open an incident; name a reviewer; classify. | Each command is accepted (authoritative controls and evidence work); each receipt states only the writer's result and Current facts read from Core; none claims that a list or count is updated. A form whose required evidence read fails is removed (A14 (1), A21); an optional read degrades only its block. | T | V23 ("authoritative commands continue only when required current evidence/controls work"); BS B33 |
| WP14-A67 | SuperAdmin; test | Every SA-08 page, SA-01m, SA-08q; maintenance (test) | Look for recovery controls. Test: admission closed (WP-01 V23 part C pattern); a restored installation. | No restore, lost-interval reconstruction, replay, resend, "Reopen system" or "Force" control on any WP-14 page. With admission closed every SA-08 and OP-08 address answers the WP-01 maintenance page (WP01-A78; the shell part is WP-01's and is not repeated here); after a restore the installation stays closed. Protection marks are resolved only on SA-09m (WP-11); SA-01m shows their count only. | L+T | BS B39, B40; UX §6.3 Recovery boundary, §8.3 |

### 2.12 SA-08q Document checks that could not finish (`doc.requeue_check`, `doc.requeue_bulk`; CC-01)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP14-A68 | SuperAdmin (SA1); test | SA-08q (§3 R-3); fixtures | Open it from the rail. Test: 0, 3 and 201 waiting versions; facilities up, down, unknown. | Path `/admin/documents/queue` kept; rail "Incidents & audit"; `h1` "Document checks that could not finish"; "Read at [time] IST". Facilities: "Malware scanner", "File reader": "Answering now", "Not answering", "Not known"; "Scanner last unavailable: [time] IST" or "Never recorded". Rows, oldest first: document purpose and reference; travel agent and group; waiting for ("Malware scan", "Content check", "Owner action on the missing file", "Automatic retry") with the failure reason in words; received time IST; no file name ("File names are not shown here: they can contain personal data."). At 200 rows: "Showing the oldest 200 documents. More may wait." with no total. S2: "No document check waits for a SuperAdmin now." (never "Every document finished its checks"). Files stay in quarantine: the page says so. | L+T | CC-01; BS B12, B33, B38; D7; WP-08 E-10 |
| WP14-A69 | Test; gallery | SA-08q "Run the check again" for one document | Render with the facilities up and with the scanner down. | Per waiting row that Core marks as needing a check: the stage it needs (hidden; the page shows it in words), the version's revision, "Reason" (required, at most 500), button "Run the check again". Effect: "The document goes through the same check again. Nothing passes without it; its file stays in quarantine until the check passes." Scanner down or unknown: "The malware scanner does not answer now: the check will wait again." The form stays; Core decides. Rows that need no SuperAdmin action show "No action needed now" and no form. | T + gallery | `requeueStage`; BS B38; WP-10 H-02 |
| WP14-A70 | Test | One recheck accepted | Send with a reason. | Neutral receipt "Request recorded" (the result has the shape of other document commands) with Current: the row "Waiting for: Malware scan, sent again" or the row gone; never "passed", "cleared" or "safe". Nothing shows from the address. | T | WP-06 D-02; A81 |
| WP14-A71 | Test | One recheck refused | (1) A stale revision. (2) The check already sent again or finished (fresh revision). (3) A blank reason; a reason of 501 characters. (4) As an operator. | (1) CMP-14 at the row: "This document changed since you read the list." with its current state; reason kept. (2) "This document no longer needs a new check." (`requeue_not_applicable`). (3) At the reason, values kept, never cut. (4) Not found. Nothing recorded (no new check task, row state unchanged). | T | §0.5 |
| WP14-A72 | Test; gallery | SA-08q "Run every waiting check again" | Render with 3 and with 201 waiting versions. | Choices "All waiting checks", "Malware scans only", "Content checks only"; "Reason" (required, at most 500). Effect: "Every waiting document of this kind goes through its check again, oldest first, up to the limit TravelMudra applies, including documents beyond the list shown." The button names a count only when the list is not at its cap ("Run 3 checks again"); at the cap it reads "Run the waiting checks again" (no predicted count; Core may send up to 500 of up to 1000). Facility down: the A69 sentence. | T + gallery | `requeueBulkCommand`; WP-10 H-10 |
| WP14-A73 | Test | Bulk recheck accepted and refused | Send with 3 waiting; send again (new key); send with a blank reason. | Accepted: "Checks sent again: 3 (2 malware scans, 1 content check)" from Core's result. Again: "No document needs a new check now. Nothing was recorded." (`nothing_to_requeue`). Blank reason: C1, choice kept. | T | §0.5 |
| WP14-A74 | Test | SA-08q handlers and address | Send `stage` of 17 characters and `limit` of 9 characters (raw); open `/admin/documents/queue?requeued=999`. | Every field reaches Core whole and is refused at its field (no `.slice(0, 16)` or `.slice(0, 8)`). The edited address shows no "999 checks were sent again" or any result: results come from the operation only. | T | LD-17; WP-01 A-04 class |

### 2.13 SA-01 and the pages of other packages

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP14-A75 | SuperAdmin (SA1) | SA-01 groups 10 and 16 (§3 S-1, S-3, D-14) | Read the groups and follow their links. | Group 10 "Incidents": "[n] incidents need a SuperAdmin" (incidents, not applications); +1 after S-1, −1 after S-3 (deltas from P-0); its link opens SA-08 with the filter "Needs a SuperAdmin". Group 16 "Reporting gaps": links open SA-08v and SA-08m. Unavailable and capped behaviour as WP06-A06, A08 (not repeated). | L | WP-06 design §2.1 (later packages change only their group's link target) |
| WP14-A76 | Operators (OP1, OP2) | OP-01 "Continuing duties" (WP07-A07); the rail count | Read after §3 D-3, S-3 and D-14. | Each owned or reviewed incident links OP-08i (the rebuilt page). The rail count of "Incidents and follow-up" follows WP01-A21 (an unreadable count reads "Unavailable"). Deltas match OP-08. | L | WP07-A07; WP01-A21 |
| WP14-A77 | Operator (OP1); test | OP-05r and OP-05 (WP-08) from OP-08i (§3 D-9, D-13) | Follow "Review the association" from V's OP-08i. From D's OP-08i follow "Record the replacement" for the correction. | OP-05r opens V's review; the decision and the review copy happen only there (WP08-A19 to A22, A27). D's link opens the incident-scoped replacement form of WP-08 (E-03, WP08-A154) with the incident chosen; after the check, D's OP-08i reads "The correction: recorded". No WP-14 page hosts `ops.record_artifact`. | L+T | CC-13; WP-08 E-03 |
| WP14-A78 | TA (`syn-ta-2`) | TA-07, TA-07d, TA-10, TA-10n, TA-07x of D (§3 D-4, D-8, D-10) | Read each page at each step; acknowledge the notice. | TA-10 +1 at D-7: "Delete a file that was sent to you in error", acknowledgement needed; TA-10n body per A28; "I deleted it: acknowledge" works (WP-08). No page shows the incident, its owner, its notes, another account or a candidate. TA-07 never offers R-D1 again; R-D2 appears only after its verification, with its version; no file is ever substituted. TA-07x shows the notice line in the lag form. No "recalled". | L | BS B10, B12, B13; WP-08 |
| WP14-A79 | Operator; SuperAdmin; test (`test/unit/web/incident-host-pages.test.ts` or the design's name) | The old operator case page, OP-02, OP-05, OP-08, OP-08i, OP-08w, OP-08o, SA-08, SA-08i, SA-08o, SA-08q | Run the test. Open OP-02 of D. | Each WP-14 command has exactly one host page per surface (§1.2): the report only on OP-08w; the operator's open only on OP-08o; evidence, notice, resolve and close only on OP-08i and SA-08i; reviewer and classification only on SA-08i; the SuperAdmin's open only on SA-08o; the rechecks only on SA-08q. OP-02 and the old operator case page keep the facts and link to OP-08w, OP-08o and OP-08i (their incident forms are gone). The carried-form test of WP08-A118 drops the WP-14 rows. Every rendered form action is a registered route (A47). | L+T | CC-12 to CC-16; LD-02; LD-07 |

### 2.14 Command results, access and shell on WP-14 pages

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP14-A80 | Operator; SuperAdmin | Every WP-14 page | Read the shell. | Environment label; "[TEST]" title prefix; rail current item "Incidents and follow-up" (OP-08 pages), "Incidents & audit" (SA-08 pages), "Home" (SA-01m); breadcrumbs; one `h1`; "Read at [time] IST" or the lag form (§0.2). | L | PL §2.1, §2.2; LD-08 |
| WP14-A81 | Operator; SuperAdmin; harness | Every accepted WP-14 command; edited receipt addresses | Read each receipt. Open edited addresses: an evidence key with the open receipt's address; a resolve key with the close receipt's address; another application's key; a refused key. | Named only where the operation establishes the command: report (incident with its application: "Release to a wrong recipient reported"), notice (with its notice: "Notice posted"), classification ("Classification recorded: [scope]"), bulk recheck ("Checks sent again: [n] …"). Neutral "Request recorded" with Current facts: evidence, resolve, close, open, reviewer, one recheck (their results carry only the incident or the version). An edited address never shows another command's title; another application's key: "Request reference [key]. The receipt cannot be checked now."; a refused key: "Nothing is recorded for request [reference] so far". No accepted time, no actor (P-02, S-08 pending). No result shows from the page address (`?done=`, `?requeued=` gone). | L+T | WP-06 D-01, D-02; WP-01 A-04, A-08; WP-12 J-08 |
| WP14-A82 | Operator; SuperAdmin; test | Receipt addresses of §3 D-3, D-7 and D-10 opened again after D-11 | Open each address again. | Each receipt keeps what was recorded and shows current facts labelled "Current" ("Current: Closed"). No receipt or status read tells anyone to act, to perform an act, or that a file was recalled or deleted. | L+T | WP-07 F-01, F-33; WP-09 G-10 |
| WP14-A83 | Test (fault injection per command) | Each command with a lost acknowledgement; a refused send | Inject the fault. Open the operation page. "Check status". | 303 to `/<surface>/operations/<key>`: "Checking the original result" and "Check status"; no new send of the same intent offered there; "Check status" shows the accepted result or "Nothing is recorded …". For the report, the page never offers a second report while the first is unresolved. | T | PL §1.1 UNR; BS B35 |
| WP14-A84 | Harness; test | Each command | (1) Identical replay. (2) Same key, changed content. (3) Business duplicate. (4) Raw stale envelope. (5a) Raw resend of a refused envelope after the facts changed. (5b) Corrected submission from a freshly loaded page. | (1) The original result; nothing new. (2) `conflict_operation_key`. (3) Report: `duplicate_operation`; notice to the same account: `duplicate_operation`; evidence: a second row is recorded (no guard; separate fixture, never counted as a refusal); resolve, close: `incident_not_open`; open: a second incident is recorded (no guard); reviewer: a second naming fact (no guard); classification: a new current classification (no guard); one recheck: `requeue_not_applicable` or `stale_revision`; bulk: `nothing_to_requeue` or only the documents that need it again. (4) Notice, evidence, resolve, reviewer, one recheck: `stale_revision` with CMP-14; report, close, open, classification, bulk: no revision, the business check decides. (5a) Core evaluates the envelope again on its own facts. (5b) Accepted once. A duplicate test uses (3), never (4) or (5a). | T | WP-06 D-12; WP-10 H-07; WP-09 G-03; BS B35 |
| WP14-A85 | Operator (OP1); SuperAdmin (SA1); harness | The Nth time on the live steps | Replay terms 1 to 5 on the report (§3 D-5), the notice (D-7), the resolution (D-10), the SuperAdmin's open (S-1) and the reviewer (S-3). Term 2 changes the note or the reason. Term 3: Back after each receipt, then send again. Term 4: after each C1 of the live steps. | (1) Same 303 and receipt; one incident, one notice, one resolution. (2) Refused as a used form; values kept. (3) Back reloads with current facts: the report page shows R-D1 as reported, no form; the notice form lists TA as "notice posted"; a resolved incident shows the close form, no resolve form; SA-08o lists the open incidents of S before its button (a new send would record a second incident: no guard, A84 (3)). (4) Recorded once. (5) As A83. | L+T | BS B35; PL §7 K-STD |
| WP14-A86 | — | Text map of every reason code WP-14 pages can show | Unit test against Core's vocabulary. | Each code has text in the role's words: `incident_evidence_insufficient`, `duplicate_operation`, `not_affected`, `incident_not_open`, `evidence_kind_unknown`, `evidence_version_not_usable`, `invalid_id`, `not_operator_openable`, `required`, `already_assigned`, `not_active_operator`, `failure_scope_evidence_missing`, `not_applicable`, `requeue_not_applicable`, `nothing_to_requeue`, `notice_missing`, `association_decision`, `correction`, `evidence`, `version_blocked`, `compliance_notice_unselected`, `stale_revision`, `conflict_operation_key`. `access_denied` renders SH-02 or the uniform not-found page. A missing text shows the code (UAT-13). | T | CR-01; `src/apps/shared/core/shared.ts` |
| WP14-A87 | Operator; SuperAdmin | Every refusal reachable on `lane-ui` | Read each message. | CMP-07 with the reason in words, at the field when Core names one, with the owner or route where one exists. No code alone (except UAT-13), no "Something went wrong", "Invalid data" or "Error". | L | PL §1.1 REJ, §11.1; CR-01 |
| WP14-A88 | TA; operators; SuperAdmin | Every WP-14 page; the TA pages of D | Look for controls of other roles. | TA pages: no incident page, form or text. Operator pages: no reviewer naming, classification, SuperAdmin open of other kinds, recheck or audit. Reviewer: no case action. SuperAdmin pages: no operator act control (authorize, act evidence, readiness, official result, association decision, replacement file). | L | BS B13, B18, B34; UX §2.3 |
| WP14-A89 | SuperAdmin; operator (tests) | Support view; read grant | Test: in a support view of OP1, open OP-08 and OP-08i and post each operator command; open every `/admin` WP-14 page. Test: an operator with a group read grant of D's group opens OP-08i of D. | Support view of OP1: OP-08 and OP-08i render read-only with the support-view banner and no form; each post refused (support view); nothing recorded. Every `/admin` page answers 409 `support_view_active`. Read grant: no incident is listed or readable through the grant (the incident policy has no grant relation); nothing recorded. Audit and support view stay distinct. | T | BS B10; UX §6.3 Support view; PL SA-08 |
| WP14-A90 | Operator; SuperAdmin; TA | Every WP-14 page and the TA pages of D | Read all visible text. | No forbidden label of §11.1 ("Override", "Force complete", "Reopen system", "Approved" or "Done" as an overall status, "Ready" as a universal state); no "Recall", "recalled", "retrieved back", "unsent" or "deleted" as a fact; no "Owner not yet decided" (LD-04); no package or lane record id; every time with IST; every count with its unit; synthetic data labelled "Synthetic"; no configuration number that the page does not read (no queue limit, retry count or size). | L | PL §11.1; §0.2; WP-01 Q-13 |
| WP14-A91 | Operator; SuperAdmin | OP-08i, OP-08w, SA-08i, SA-08o, SA-08q | Inspect browser storage after use. Read the headers. | No note, reason, reference, recipient or evidence value is kept in browser storage. Signed-in pages send `no-store`. | L+T | PL §2.3 SH-R12 |
| WP14-A92 | `syn-ta-3`; operators; harness | Foreign reads and posts (§3 X-1) | OP2 opens OP-08i of D's disclosure and OP-08w of D; OP1 opens SA-08; `syn-ta-3` opens TA-07 of D; harness posts a notice naming D's incident with V's incident id in the address. | Operators: the uniform not-found page or SH-02 (WP-01 rule by surface), never a fact of D. `syn-ta-3`: the uniform not-found page. The mismatched post: refused for access; nothing recorded. | L | BS B10; UX §2.3 |
| WP14-A93 | Test | Every WP-14 handler (routes unit test, LD-17) | Send each field one character over Core's limit, each indexed list one row over, partly filled rows, and the largest valid form (10 evidence rows of 200-character references and notes, a 2000-character note). | Over-limit input is refused at the field with the values kept; no handler slices, trims to a length or drops a row (today `f()` in `staff/operations/incidents.ts:244`, `chosen` in `case-work.ts:452-453`, the queue handlers); the largest valid form fits the body limit and reaches Core (a real HTTP test). | T | LD-17; WP-11 I-08 |
| WP14-A94 | Operator (OP1), two tabs; test | OP-08i of D (§3 D-7); SA-08i (test) | As A27 (1). Test: two SuperAdmins name different reviewers on S's incident from two tabs; one resolves while the other records evidence. | The second send of a revision-guarded command shows CMP-14 "Changed since your review." with the current facts beside the unsent values; nothing from the stale tab is recorded. | L+T | CMP-14; BS B19, B35 |

### 2.15 Accessibility (AC-01 to AC-28 that apply)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP14-A95 | Keyboard-only operator and SuperAdmin | §3 D-3, D-7, D-10, D-11, S-1 to S-3 at 1440 px; D-3 and S-3 at 390 px | Use the keyboard only. | Every step works with Tab, Shift+Tab, Enter, Space and Escape: filters, the release checkboxes, the notice choice, evidence rows ("Add another row" included), resolve and close, the reviewer select, the classification radios, the audit filters and paging. No action needs a mouse, hover or drag-and-drop. | L | AC-01, AC-12 |
| WP14-A96 | Keyboard-only user | Every WP-14 page at 1440 and 390 px and at 400% zoom | Tab through the page. | Focus is visible (at least 3:1) and never hidden by the top bar, the rail or a bottom action area. | L | AC-02 |
| WP14-A97 | Phone user | OP-08, OP-08i, OP-08w, SA-08, SA-08i, SA-08a, SA-08q | View at 320 px, and at 1280 px with 400% zoom. | One column; no two-dimensional page scrolling; incident rows, releases, evidence rows and queue rows become labelled cards; the audit table scrolls only inside a labelled region (PL SA-08 Mobile); identity, state, owner and next step come before secondary facts (AC-21); the effect text comes before the button; the primary action at the end of the form, never in a fixed bar. | L | AC-04, AC-21; PL OP-08, SA-08 (Mobile) |
| WP14-A98 | Any | Every WP-14 form | Inspect each input. | Visible labels; the release checkboxes in a `fieldset` with the legend "Releases and emails of this file", none prechecked; the notice choice and the classification scope as radio groups with legends; selects with hints by `aria-describedby`, no option preselected; evidence rows labelled with their row number; required and optional fields say so. | L | AC-05, AC-15 |
| WP14-A99 | Any | Incident states, required items, facility states, projection states | View in greyscale. | Each state has text; "Yours to act on" and "Needs a SuperAdmin" are text; the destructive button keeps its text label; no state by colour alone. | L | AC-06 |
| WP14-A100 | Any | Every WP-14 form | Send each form with an error. | Focus moves to the error summary; each link moves to its field (an evidence row error to that row); values stay; checked releases stay checked as posted (G-07). | L | AC-08; WP-09 G-07 |
| WP14-A101 | Screen-reader user | Receipts; the disclosure block; the boundaries | Read with VoiceOver or NVDA. | Receipts are announced politely without moving focus; the disclosure block and the compliance boundary are plain text in the page flow (no live region); the unsent values of CMP-14 are not a live region. | L | AC-09, AC-16 |
| WP14-A102 | Screen-reader user | Each unavailable action (A34 replaced form, A50, A69 facility warning, A24 boundary) | Focus the notice or the related control. | The reason is exposed (`aria-describedby`, or the notice in reading order); a shown unavailable button has `aria-disabled="true"` and its reason; a role-forbidden action is not shown. | L | AC-13; CMP-10 |
| WP14-A103 | Phone user | Every WP-14 page at 390 px | Measure each control. | Every control at least 24 × 24 CSS px; primary actions ("Report and block the file", "Post the notice", "Record the evidence", "Resolve", "Close the incident", "Open the incident", "Name the reviewer", "Record the classification", "Run the check again") at least 44 × 44 CSS px. | L+T | AC-10 |
| WP14-A104 | — | Every WP-14 page | Measure contrast. | Normal text at least 4.5:1; non-text indicators and focus at least 3:1. | L+T | AC-11 |
| WP14-A105 | Any | Long notes and names; reduced motion | Use a 2000-character note, a 400-character name, references of Core's maximum length. Turn on "reduce motion". | Text wraps anywhere; a shortened note in a row has its full text reachable by keyboard and touch (AC-20); the `h1` wraps; no transition plays. | L | AC-14, AC-20 |
| WP14-A106 | Operator and SuperAdmin (observation) | OP-08i of D after §3 D-10; SA-08i of S after S-3 | Ask OP1 "Was the file recalled?", "Can the travel agent still download R-D1?", "Is the incident finished now?"; ask SA1 "Who owns S's incident now, and what happens when S is assigned?". | The run record reports the answers and the sample size; "yes, recalled", "yes, R-D1 can be downloaded", "finished" before closure, or a wrong owner is a finding. No pass target. | L | AC-24, AC-26; UX §12 |

### 2.16 axe checks (WCAG 2.2 A/AA)

Rule for every row: run axe (`@axe-core/playwright` 4.13.0, tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`,
`wcag22aa`) at 1440 × 900 and at 390 × 844. Expected: no violation of impact "serious" or "critical" at either width.
Record the counts of minor and moderate violations. Synthetic data only. "Gallery" rows run on the design's gallery
state. A64's page row is "Deferred" when the design keeps the Measures page.

| ID | Persona | Page (state) | Where | Source |
|---|---|---|---|---|
| WP14-A107 | Operator | OP-08 with rows (D-1) | L | UX §7.5; AC-01 to AC-28 |
| WP14-A108 | Operator | OP-08 with a filter that matches nothing (D-1) | L | same |
| WP14-A109 | Operator | OP-08i of V, association incident (D-1) | L | same |
| WP14-A110 | Operator | OP-08w of D (D-3) | L | same |
| WP14-A111 | Operator | OP-08w with the error summary (D-3) | L | same |
| WP14-A112 | Operator | OP-08w receipt (D-3) | L | same |
| WP14-A113 | Operator | OP-08i of D with missing items and the notice form (D-6) | L | same |
| WP14-A114 | Operator | OP-08i of D after the refused resolution (D-6) | L | same |
| WP14-A115 | Operator | OP-08i of D resolved, with the close form (D-10) | L | same |
| WP14-A116 | Operator | OP-08i of D closed (D-11) | L | same |
| WP14-A117 | Operator (reviewer) | OP-08 and OP-08i of S as OP2 (S-4) | L | same |
| WP14-A118 | SuperAdmin | SA-08 with the filter "Needs a SuperAdmin" (S-1) | L | same |
| WP14-A119 | SuperAdmin | SA-08o with the error summary (S-1) | L | same |
| WP14-A120 | SuperAdmin | SA-08i of S with the classification and reviewer forms (S-2) | L | same |
| WP14-A121 | SuperAdmin | SA-08i of S with the reviewer reason error (S-3) | L | same |
| WP14-A122 | SuperAdmin | SA-08i of V: no decision form, reviewer boundary (D-2) | L | same |
| WP14-A123 | SuperAdmin | SA-08a filtered on D, and with a field error (D-12, R-2) | L | same |
| WP14-A124 | SuperAdmin | SA-08s of D's incident (D-12) | L | same |
| WP14-A125 | SuperAdmin | SA-08v (R-1) | L | same |
| WP14-A126 | SuperAdmin | SA-01m (R-1) | L | same |
| WP14-A127 | SuperAdmin | SA-08m (R-1) | L | same |
| WP14-A128 | SuperAdmin | SA-08q as `lane-ui` shows it (R-3) | L | same |
| WP14-A129 | SuperAdmin | SA-08q with entries at the cap, a facility down, a recheck receipt and a bulk field error | L (gallery) | same |
| WP14-A130 | SuperAdmin | SA-08a with the index behind; SA-08v with a failed projector | L (gallery) | same |
| WP14-A131 | Operator; SuperAdmin | Operation status page of a WP-14 command: accepted, and "Nothing is recorded" (A81) | L | same |
| WP14-A132 | TA | TA-10n with the deletion request, before and after the acknowledgement (D-8) | L | same |

## 3. Proof scenarios V13 (disclosure part) and V23 (SA-08 part)

V13 (UX §12): "Issued result with wrong/missing artifact keeps outcome but blocks release; ambiguous association goes
to scoped review. Replaced/revoked artifact never silently substitutes." Authority B12, B13. WP-08 proves the
association, withholding and replacement parts (WP-08 §3 V13); WP-14 proves the disclosure part that WP-08 §4 hands
over: "confirmed wrong-recipient disclosure, version block, truthful notices, incident closure".

V23 (UX §12): "Projection outage reports uncertainty without fabricated zero/success; authoritative commands continue
only when required current evidence/controls work. Maintenance/restore remains closed." Authority B33, B38 to B40.
WP-01 proves the shell part (WP-01 §3 V23 parts A to C: rail counts, freshness wording, maintenance page, restore);
WP-14 proves the SA-08 part: the audit index, the derived views, the monitors, the incident commands during an outage
and the absence of recovery controls. As WP-01 decided (P-W01), an outage and maintenance are proven by named tests;
`lane-ui` shows the healthy baseline.

One ordered recipe. "Setup" steps use pages of earlier packages; they are not the subject under test. "Observe" steps
check items other packages own.

| Step | Actor, page | Action | Observable result | Items | Where |
|---|---|---|---|---|---|
| P-0 | OP1, OP2: OP-08, OP-01; SA1: SA-01, SA-01m, SA-08, SA-08q, SA-08v; TA: TA-10 | Read the counts and states. | The run record holds the baselines of §0.4. | — | L |
| Setup 1 | TA (TA-09, TA-08) | Create group `wp14-[stamp]` and submit D, V and S on "SYN Tourist e-visa". | Three submitted applications. | — | L |
| Setup 2 | SA1 (SA-07a, SA-03a) | Record "Payment received" for D, V and S; assign D and V to OP1. | D and V assigned; S paid and unassigned. | — | L |
| Setup 3 | OP1 (OP-02, OP-04a, OP-04b) | Start work, confirm readiness, request authorization and record "Filed" for D and V. | D and V filed with evidence. | — | L |
| Setup 4 | OP1 (OP-05) | Record "Issued" with R-D1 for D and with R-V1 for V; reload after the checks. | R-D1 "Verified for this application"; V "Waiting for review" with an association incident owned by OP1 (observe WP08-A17). | — | L |
| Setup 5 | TA (TA-07d) | Download R-D1. | "Sent in full on [time] IST"; one release record. Keep this tab open for D-4. | — | L |
| **Part D** | | **V13 disclosure** | | | |
| D-1 | OP1: OP-08; OP-08i of V | Read; apply the filters of A02. | V's incident "Yours to act on"; no decision form on OP-08i; "Review the association" → OP-05r. | A01, A02, A06, A07, A09, A107 to A109 | L |
| D-2 | SA1: SA-08; SA-08i of V | Read; inspect the forms. | No confirm or reject form; every form action registered; the reviewer boundary naming OP1. | A45, A46, A47, A50, A122 | L |
| D-3 | OP1: OP-08w of D | Read. Send with nothing chosen. Then choose TA's download of R-D1, note "WP14 [stamp] the file held another traveller's page", send. | The effect text before the button; the refusal with values kept, nothing recorded; then the receipt: R-D1 blocked for good, outcome Issued, required items listed. | A16, A18, A20 (1), A110 to A112 | L |
| D-4 | TA: TA-07, TA-07d (tab of Setup 5), TA-10 of D; OP1: OP-05, OP-06, OP-07 of D; SA1: SA-01m | TA downloads R-D1 from the old tab. Read. | Refused `version_blocked`, no byte, no substitute; R-D1 held on TA-07; TA-10 delta 0; staff pages show the block; disclosures +1. | A19, A78 | L |
| D-5 | Harness; OP2 | Second report of R-D1 with a new key; OP2 sends the report of D; identical replay of D-3. | `duplicate_operation` naming the incident; OP2 not found; the replay gives the same receipt; one incident. | A17, A20 (4), (5), A85 | L |
| D-6 | OP1: OP-08i of D; harness | Read. Harness: resolve with a note and the current revision. | Next step "Post the notice to [TA]"; required items not recorded; the disclosure block and the compliance boundary; no resolve form (a notice is missing); the harness resolve refused with each missing item; nothing recorded. | A06, A07, A08, A15, A34, A36 (1), A113, A114 | L |
| D-7 | OP1 (tabs 1 and 2): OP-08i of D; harness | Open the notice form in both tabs. Tab 2: choose TA, "Ask them to delete the file", read the quoted text, send. Tab 1: send the same. Harness: a new-key notice to TA. | Tab 2 receipt "Notice posted"; TA-10 +1. Tab 1: CMP-14, nothing recorded. Harness: `duplicate_operation`, nothing recorded. | A25, A26, A27, A94 | L |
| D-8 | TA: TA-10, TA-10n; OP1: OP-08i of D | TA reads and acknowledges the notice. OP1 reads. | TA-10n text as quoted on OP-08i; acknowledgement recorded (observe WP-08); OP-08i shows no "deleted" claim and the acknowledgement as A29 allows. | A28 (observe), A29, A78, A132 | L |
| D-9 | OP1 (Setup, WP-08 E-03): OP-05 replacement under the incident; OP-08i; TA-07 of D | Record R-D2 as the replacement of R-D1 for the incident; reload after the check; read. | R-D2 "Verified for this application"; "The correction: recorded"; next step "Ready to resolve"; TA-07 offers R-D2 only; R-D1 never. | A08, A19, A77 | L |
| D-10 | OP1: OP-08i of D; harness | Resolve with the note "WP14 [stamp] replacement verified; deletion requested". Harness: identical replay; a new-key resolve. Press Back. | Neutral receipt, Current "Resolved: waiting to be closed"; replay same receipt; new key `incident_not_open`; Back shows the close form and no resolve form; OP-08 delta −1; SA-01m disclosures at the P-0 value. | A35, A36 (3), A85, A115 | L |
| D-11 | OP1: OP-08i of D; harness | Close. Harness: a new-key close. Read the closed page and OP-08. | Neutral receipt, Current "Closed [time] IST"; second close refused; every record kept; no form. | A37, A116 | L |
| D-12 | SA1: SA-08s of D's incident; SA-08a filtered on D; one fact page | Read. | Facts oldest first with both times, actors, reasons, evidence; the search rows with the index freshness; the fact page complete. | A57, A58, A59, A123, A124 | L |
| D-13 | OP1 (Setup, WP-08): OP-05r of V; OP-08i of V | Confirm V's association with the three true attestations (WP-08 E-02). Read OP-08i of V; close it. | V's incident resolved by the decision; then closed (neutral receipt). | A37, A77 | L |
| D-14 | SA1: SA-01, SA-01m; OP1: OP-01 | Read. | Group 10, the incident counts and "Continuing duties" back at the P-0 values (D's and V's incidents closed). | A63, A75, A76 | L |
| **Part S** | | **SuperAdmin incidents** | | | |
| S-1 | SA1: SA-08o; SA-08; SA-01 | Choose "Operational failure", application S, a blank note; send. Then the note "WP14 [stamp] the intake worker stopped for S"; send. Press Back; read the open incidents listed. | C1 at the note; then a neutral receipt; owner TravelMudra administration; SA-08 "Needs a SuperAdmin" +1; SA-01 group 10 +1. Back lists S's open incident before the button; nothing more is sent. | A42, A43 (1), A45, A75, A85, A118, A119 | L |
| S-2 | SA1: SA-08i of S | Read. Classify: (1) shared, "Database", statement only; (2) shared, no component; (3) local, no country; (4) local, Synthetica's reference, valid reason. | Refusals (1) to (3) at their places, values kept, nothing recorded; (4) "Classification recorded: Local to one country"; the current classification as A56 allows. | A46, A53 to A56, A120 | L |
| S-3 | SA1: SA-08i of S; harness | Name OP2 with the reason "Short"; then with "WP14 [stamp] no operator is assigned yet". Harness: OP1 posts the form. | C1, reviewer kept; then neutral receipt, owner "[OP2] (reviewer)"; SA-01 group 10 −1; OP1's post not found. | A48, A49, A51 (1), (5), A85, A121 | L |
| S-4 | OP2: OP-08; OP-08i of S | Read. Send the evidence form with no row; record a statement; record `SYN-W14-[stamp]-REF-1`. | "You (reviewer)"; no case action; C1; the statement leaves the item "not recorded yet"; the reference records it; next step "Ready to resolve". | A11, A30, A31, A32 (1), A117 | L |
| S-5 | SA1 (Setup, SA-03a); OP2; OP1 | Assign S to OP1. OP2 reloads OP-08i of S and OP-08; OP1 reads OP-08. | OP2: SH-02, row gone; OP1: the incident with owner "You". | A12 | L |
| S-6 | OP1: OP-08o of D; OP-08i; harness | Read OP-08o; send without kind and note; open "Operational failure" on D with "WP14 [stamp] the portal printed a blank receipt". Harness: kind `artifact_association` on D. Resolve D's new incident with `SYN-W14-[stamp]-REF-2` in the resolution form; resolve S's incident; close both. | C1; the receipt; harness `not_operator_openable`; the resolve form shown with the evidence row while only "evidence" is missing, accepted; both resolved and closed. Every incident the run opened is closed. | A34, A37, A39, A40, A41 | L |
| **Part R** | | **V23, SA-08 part** | | | |
| R-1 | SA1: SA-08v; SA-01m; SA-08m | Read. | Healthy baseline in the §0.2 words; no recovery control; unit names; no "no product trigger". | A62, A63, A64, A67, A125 to A127 | L |
| R-2 | SA1: SA-08a | Search with no filter; then the email value of A57; clear. | The lag line; the field refusal; nothing searched for the bad value; no account disclosure. | A57, A123 | L |
| R-3 | SA1: SA-08q | Read. | Facilities; rows or S2; no file name; the cap line when at 200. No recheck is sent on `lane-ui` (§0.2 "Data hygiene"). | A68, A128 | L |
| R-4 | Test | The projection outage bundle: audit projector lagging and failed; `views.projections` and `views.monitors` unavailable; the incident commands during the outage; a required read failing on OP-08i, OP-08w and SA-08q. | As the items: no fabricated zero, success or "all current"; commands accepted with writer receipts; forms removed where their required evidence cannot be read. | A14, A21, A60, A61, A65, A66 | T |
| R-5 | Test | Admission closed on SA-08 and OP-08 addresses; a restored installation (WP-01 V23 part C pattern; P-03 parked). | The WP-01 maintenance page; no recovery control; the restored installation stays closed. | A67 | T |
| R-6 | Test; gallery | The document checks commands and states. | As the items. | A69 to A74, A129 | T + gallery |
| **Part X** | | | | | |
| X-1 | `syn-ta-3`; OP1, OP2; harness | The isolation reads and posts of A88 and A92. | Not found or SH-02; nothing recorded. | A88, A92 | L |
| X-2 | Test | The test parts of the items: A03 to A05, A07, A09, A10, A12 to A14, A17, A20 to A24, A27, A28, A32, A33, A34, A36 to A38, A41, A43, A44, A47, A48, A51, A55, A56, A60, A61, A63, A65 to A74, A77, A79, A81 to A86, A89, A91, A93, A94, A103, A104. | As the items. | as listed | T |
| X-3 | axe | Every WP-14 page and state visited in Parts D, S and R, and TA-10n. | No serious or critical violation at 1440 px and 390 px. | A107 to A128, A131, A132 | L |
| X-4 | axe (gallery) | A129, A130. | As X-3. | A129, A130 | L |
| X-5 | Keyboard-only, screen-reader and phone users; SA1; OP1 | During D-3, D-7, D-10, D-11, S-1 to S-3 and R-1: the accessibility checks, the shell, the copy and refusal text, and the owner-control check. | As the items. | A52, A80, A87, A90, A95 to A106 | L |

Proof split. V13 (disclosure part) passes when P-0, Setup and D-1 to D-14 pass on `lane-ui` at the integrated WP-14
commit and the disclosure tests of X-2 (A13, A20 to A24, A27, A28, A36 to A38, A84) pass. V23 (SA-08 part) passes when
R-1 to R-3 pass on `lane-ui` and R-4 to R-6 pass as named tests. Part X belongs to both proofs (X-1, X-3 and X-5 on
`lane-ui`; X-2 and X-4 as named tests and gallery states). Part S is part of the package's acceptance, not of a
named V scenario (BS B13 reviewer). Recorded, not failed: A04, A29 and A56 "Partly met" (§6 Q-09); A64 and A127
"Deferred" when the design keeps the Measures page (§6 Q-11); A28 records the false-sentence finding of §6 Q-02 until
the architect decides it. The run record names the `lane-ui` ref, the run tag, the group, each test, the identifiers
(internal record only) and every delta. If WP-08 or its result generator is not on `lane-ui`, Part D runs as a system
test with the same steps and the run record says so (§6 Q-14).

## 4. Scenario parts outside these proofs (traceability)

| Scenario part | Where it is proven |
|---|---|
| V13: issued without a correct file keeps the outcome and withholds release; ambiguous association to a scoped review; confirm, reject, review copy; replacement never substitutes | WP-08 (WP08-A15 to A30, A154, A155; WP-08 §3 V13-1 to V13-10) |
| V13: the incident-scoped replacement form, also after completion | WP-08 (E-03, WP08-A154); used as set-up in D-9 |
| V23: rail counts "Unavailable", freshness wording, maintenance page, restore stays closed, privileged elevation waits for the audit record | WP-01 (§3 V23 parts A to C; WP01-A21, A78); WP-15 for elevation |
| SA-01 group mechanics (unavailable, capped, freshness) | WP-06 (WP06-A05 to A09) |
| OP-01 "Continuing duties" | WP-07 (WP07-A07) |
| Follow-up incident of a later official fact and the post-filing correction incident: how they open | WP-11 (V11-18), Core; WP-14 shows and works them (A10) |
| Custody discrepancy incident: how it opens; the original's page | WP-12; WP-14 shows and works it (A10) |
| Protection-mark resolution | WP-11 (SA-09m) |
| The travel agent's notice page and acknowledgement | WP-08 (TA-10n); WP-14 checks the disclosure texts (A28) |
| Intake incidents (dismissal) | WP-18 (`intake.dispose_incident`) |
| Applicant, regulator and legal notices after a disclosure | Separately authorized compliance work (BS B13; PL B-09): a boundary only (A15) |

## 5. Out of scope and boundaries

These MUST NOT appear on any WP-14 page:

- A confirm or reject association form on SA-08i, or any form whose action has no registered route (S-09).
- A "Recall", "Retract", "Unsend" or "Block this version" control, or text that claims a recall or a deletion (BS B13,
  B45; CMD-50 not built).
- An "Assign incident owner", "Take ownership" or "Reassign incident" control (CMD-55 owner part not built).
- A restore, lost-interval reconstruction, replay, resend, "Reopen system", "Force" or "Override" control (BS B39, B40).
- A zero, an empty state, "all current" or "nothing needs attention" in place of a count or list that cannot be read
  (D7; V23).
- An instruction to perform an external act, on any page, status read or receipt (F-33).
- A result shown from the page address; an accepted time; a receipt that names a command the operation does not
  establish (D-02; P-02).
- Earlier facts after an access change (LD-14); a truncated field or a dropped row (LD-17).
- A fact reconstructed from clock order, or an audit fact shown without its recorded field, time and source (I-10).
- File names, document content, source URLs, credentials or extracted personal data in diagnostics (BS B33).
- An age, SLA or "overdue" that no read returns; a package id or a lane record id in user copy.
- An incident page, incident text or other account's facts on a travel-agent page (BS B10).

Recorded as pending, not as failures (§0.2 "Pass rule"):

- The completed flag of an incident's application, the staff view of a notice's acknowledgement, the current failure
  classification: "Partly met" until a read returns them (A04, A29, A56; §6 Q-09).
- The disclosure information text: A28 records the finding until the architect decides §6 Q-02.

Deferred in WP-14 (the run record lists each as "Deferred"):

- SA-08m when the design keeps the existing Measures page (A64, A127; §6 Q-11).
- Live outages, maintenance and the document checks commands: tests and the gallery only (A60, A65 to A67, A69 to A74;
  P-03 parked).
- Disclosures outside the delivery records, notices to a recipient who is not the owning travel agent, incidents of a
  completed application: tests only (A13, A23, A28, A38).

Not in WP-14: the association decision, the review copy and the replacement file (WP-08); intake incidents (WP-18);
privileged elevation and read grants (WP-15); the protection-mark resolution (WP-11); classification of tasks, intake
attempts and applications (no page; §6 Q-10); the task failure queue `/admin/queues/tasks` and the monitoring queue
`/admin/queues/monitoring` unless the design adds them (§6 Q-11).

## 6. Questions for the architect (ranked)

| ID | Rank | Question | Concrete scenario | PM recommendation |
|---|---|---|---|---|
| Q-01 | P1 | A SuperAdmin cannot report a release to a wrong recipient: `ops.report_wrong_recipient` has an operator route only, although Core allows a SuperAdmin (`incident.report_disclosure`) and the staff allowlist holds the command. A hand-opened disclosure incident blocks no file for good and records no recipient. | D's operator is suspended. The travel agent tells TravelMudra that its download held another traveller's visa page. SA1 opens "Released to a wrong recipient" on SA-08o. Releases of D pause while the incident is open; after it closes, the same file is released again to the travel agent. Likelihood: low; harm: high (a repeated disclosure of personal data). Workaround: assign an operator first, who then reports. | Add an admin route and a SuperAdmin host page for the existing command (route registration in `src/apps`; no Core change); until then SA-08o states the effect (A24, A42). Architect decides; to Max if a criterion question arises. |
| Q-02 | P1 | The travel agent's "information" notice text is fixed: "The file is blocked and is not released again. TravelMudra has asked the recipient to delete it." It is false after a hand-opened disclosure (no block), after a disclosure outside the delivery records (no recipient account was asked), and before any deletion request. Where the recipient is the owning travel agent, "released to another account" is false too. | SA1 opens a disclosure incident by hand on D and posts "Inform the owning travel agent". The travel agent reads that the file is blocked and that the recipient was asked; neither happened; it tells the traveller the matter is contained. Likelihood: low to medium; harm: medium (BS B13 "truthful notices"). | Amend WP-08's TA-10n disclosure words (an E-amendment) to state only what the notice parameters establish; the staff form quotes the exact text (A25); the hard fix (parameters that carry the block and the deletion request) is a Core note to the orchestrator. |
| Q-03 | P1 | Core counts any recorded reference other than a statement as the disclosure's correction ("evidence that no replacement is owed"). | OP1 records the travel agent's deletion confirmation `SYN-…` as evidence on D's disclosure. The correction line turns "recorded"; OP1 resolves and closes. The travel agent still has no correct result file; only OP-07's artifact row shows it. Likelihood: medium; harm: medium (an incident closed without its correction, BS B13). | Disclose the rule on the page (A08, A30) now; a Core note to the orchestrator for an explicit "no replacement is owed" choice on the evidence (Kind 2 if it adds an input). |
| Q-04 | P1 | Reporting a disclosure while the delivery records cannot be read: the report then names no recipient, and Core accepts only one report per file, so the recipients can never be added. Removing the form (I-05, A21) delays the block for good. | The delivery read fails for an hour. OP1 reports D's file with an outside-records reference to block it at once. Later the records are readable, but a second report is refused as a duplicate; no deletion request can ever go to the recorded recipient. Likelihood: low; harm: medium to high. | Keep the I-05 class: no form while the records cannot be read, with the owner and "Try again later" (A21). Containment in the meantime: none in the product (a hand-opened incident pauses releases of the application, A24). The architect decides between this and allowing the outside-records report with a warning. |
| Q-05 | P2 | Resolved incidents leave every incident list (Core lists open incidents only), so an incident resolved but not closed is found only from its address, the application's incidents or the audit. | OP1 resolves D's incident; the browser closes before "Close the incident"; no list shows it; it stays "Resolved" and is never closed. Likelihood: medium; harm: low (a resolved incident blocks nothing). | The receipt and the page offer "Close" at once (A35); the list states the limit (A03); a Kind 1 note for resolved incidents in the lists (criterion point 2 to be shown). |
| Q-06 | P2 | An incident a SuperAdmin opens is owned by TravelMudra administration also on an assigned application, while that operator can work it; SA-01 counts it as needing a SuperAdmin. | SA1 opens a custody incident on D for OP1; OP1 sees owner "TravelMudra administration" and no "Yours to act on"; SA1 waits for OP1; nobody acts. Likelihood: medium; harm: low. | State the owner rule on SA-08o (A42); no owner command exists (CMD-55 rejected); note to the orchestrator only if UAT shows orphaned incidents. |
| Q-07 | P2 | Core keeps only the first 1,000 characters of an incident note that the contract accepts up to 2,000 (`commands/incidents.ts:154, 218, 276, 331`). | OP1 writes a 1,500-character account of a disclosure; the audit and OP-08i show the first 1,000; the rest is lost with no message. Likelihood: low; harm: medium (BS B33 original entries). | Core defect note to the orchestrator; the pages truncate nothing themselves (LD-17) and state no number. |
| Q-08 | P2 | A SuperAdmin can hand-open a "Result file needs review" incident; without a file its required decision can never be met, so it can never be resolved. | SA1 opens one on V by mistake; it stays open forever and counts on SA-01 group 10. Likelihood: low; harm: low. | Effect sentence on SA-08o (A42); Core note: refuse result-file kinds without a file for SuperAdmins too. |
| Q-09 | P2 | No read returns to staff: the completed flag of an incident's application, which notice went to whom and its acknowledgement, the current failure classification, the actor and time of each evidence row. | OP1 cannot see on OP-08i whether the travel agent acknowledged the deletion request; SA1 cannot see the current classification without the audit. Likelihood: certain; harm: low. | Interim per I-10 (audit subject read, recorded fields only) and "Partly met" (A04, A29, A56); Kind 1 notes, criterion point 2 to be demonstrated per fact before any proposal. |
| Q-10 | P2 | `ops.classify_failure` also takes tasks, intake attempts and applications as subjects; no page offers them. | A worker task fails for every country; SA1 cannot record that it was a shared database failure on the task itself, only on an incident. Likelihood: low. | Offer incidents only in WP-14; record the deviation; Max decides a hide only if asked. |
| Q-11 | P2 | Scope: is SA-08m (Measures, a member of the "Incidents & audit" rail) rebuilt in WP-14, and do the task failure queue and the monitoring queue belong to SA-08? | WP-14 rebuilds Incidents, Audit and Derived views; Max opens Measures from the same rail and finds the old page layout. Likelihood: certain if not decided; harm: low. | Rebuild SA-08m in WP-14 (four rail members, one package); keep the two queues as kept pages (LD-02) linked from SA-08v. |
| Q-12 | P2 | A reviewer named while no operator is active cannot see the candidates' identity facts, so it can reject an association but not confirm it (WP-08 E-01; P-13 item 2 with Max). | V's operator is suspended; SA1 names OP2; OP2 can only reject; the correct file stays withheld until an operator is assigned. Likelihood: low; harm: medium (delay). | SA-08i states the consequence before the naming (A48); the route is assigning an operator; no new request (P-13 item 2 covers it). |
| Q-13 | P2 | SA-01 has no count of document checks that could not finish (CC-01). | The scanner was down overnight; 40 documents wait; nothing on Home says so; SA1 finds them only through the rail. Likelihood: medium; harm: low. | A line in group 16 "Reporting gaps" from the `doc.queue` read ("[n] document checks wait", capped), as a WP-06 group change the architect allows. |
| Q-14 | P2 | The live V13 disclosure proof needs WP-08 on `lane-ui` with its synthetic result generator (verified R-D1, R-D2; an unextractable R-V1). | WP-14 is built before WP-08 is integrated; Part D cannot start. Likelihood: depends on order; harm: low. | Order WP-14 after WP-08; otherwise Part D runs as a system test (§3 proof split). |

## 7. Sign-off

| Field | Value |
|---|---|
| Verified on (date, IST) | |
| Installation and ref (`uat.py status lane-ui` output: commit or tag) | |
| Lane commit of the tests named for `T` items | |
| Run tag, group label and identifiers (internal record reference) | |
| Baselines (P-0) and the deltas observed | |
| Browsers and versions | |
| Assistive technology used | |
| V13 disclosure part result (steps; where shown) | |
| V23 SA-08 part result (steps; tests) | |
| Part S result | |
| SA-08m rebuilt (yes / no) | |
| Decisions in force at the run (§6 Q-01 to Q-04) | |
| Deferred items (reference each) | |
| Partly met items (decision reference) | |
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
| V13 proof (disclosure part) | | | |
| V23 proof (SA-08 part) | | | |
| Part S | | | |
