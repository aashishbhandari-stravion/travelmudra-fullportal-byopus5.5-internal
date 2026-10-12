# WP-08 acceptance checklist: Outcome, delivery and completion surfaces

| Field | Value |
|---|---|
| Lane | `ui-revamp-2026-10-12` |
| Work package | WP-08 Outcome, delivery and completion surfaces (UI-PLAN §12.1; lane PLAN §3) |
| Author | Principal Product Manager (Claude subagent), 12 October 2026 |
| Decision owner | Principal Technical Architect of the lane (LD-12) |
| Status | Draft. Step 1 of lane PLAN §3. Not run. Input to the UX design review and the independent review. No WP-08 design exists yet; rows that name a page part the design will name say so. |
| Product base | lane branch `ui-revamp-2026-10-12` at 42cb373; internal records at a67abd4 |
| Installation | `lane-ui`: staff http://127.0.0.1:4652 (operator pages under test; SuperAdmin pages as set-up and observation); edge http://127.0.0.1:4650 (travel-agent pages under test and proof set-up) |
| Writing style | ASD-STE100 at about 75% (STY-20261003-01) |

## Corrections

This is the first version. No row is corrected yet. The design review, the architect's decisions (`WP-08.md`) and
the independent review will add a corrections table here, in the form of `WP-06-acceptance.md`.

## Lessons applied from the WP-01 to WP-06 corrections

| Lesson | Source | Where this checklist applies it |
|---|---|---|
| Identical replay, changed-content conflict, browser Back, rejected-form refresh, lost acknowledgement and a new key that meets the business check are separate cases | WP-01 A-02, A-03, A-06; WP-03 R-12; WP-06 D-12 | §0.2 "Replay terms"; one "Nth time" item per command (A10, A29, A46, A67, A83, A93); A113 |
| A refused command leaves no operation record; the refusal shows only on the re-rendered form | WP-01 A-08; WP-03 A130; WP06-A104 | §0.2; A112; every refusal item says "nothing is recorded" |
| A receipt names a command only when the operation's resource, returned id and summary establish it; otherwise a neutral "Request recorded" with facts labelled "Current" | WP-06 D-02 (R-02); WP-02 B-02; WP-03 C-03 | §0.2 "Receipts"; A111. Confirm and reject of an association act on the same incident; record official result and record cancelled outcome act on the same application |
| A batch or selection receipt names per-item results only when the result binds each item to its subject | WP-06 D-01 (R-01) | A81, A82: the selection page reads per-item results from `dlv.selection` (item number, application, subject), not from the address |
| A list that a read cannot prove complete is labelled current and possibly incomplete; no claim that exactly the listed items count | WP-06 D-04 (R-04) | A51, A52 (completion prerequisites and continuing duties) |
| A state is labelled for the action it was evaluated for; the page draws no conclusion for another action | WP-06 D-05 (R-05) | A38 (per-file availability is a read-only check now, not a promise for the send or the next download) |
| A missing command field is marked "Unmet — waits for a Kind 2 decision", never designed around | WP-06 D-03 (R-03) | §5 Deferred; Q-02, Q-03 |
| A request that Core refuses is shown as Core answers it; the page does not change the input to force acceptance | WP-06 D-09 (R-09) | A03, A21, A37, A54 |
| Form rows within Core's limits only; every filled row reaches Core | WP-06 D-10 (R-10) | A02 (outcome evidence 1 to 5 rows), A07 (1 to 20) |
| A raw stale envelope and a fresh-revision business duplicate are different tests; a duplicate test uses a fresh revision | WP-06 D-12 (R-12) | A113 |
| Freshness in the lag form for projections; "Read at" for authoritative reads | LD-08 | §0.2; A101 (history is a projection) |
| A page shows only facts a read returns; a missing fact is "Unavailable" or the item is "partly met"; gaps are deferred, not failures | WP-02 B-06; WP-03 R-11; WP-06 Q-06 to Q-08 | §0.2 "Facts"; §5 "Deferred"; Q-02, Q-03 |
| Proofs rerun with unique identifiers per run; checks compare with a recorded baseline (deltas), never totals | WP-02 B-13 | §0.4; §3 step P-0 |
| Set-up writes through existing pages are allowed and are named as set-up | WP-03 corrections; WP-06 Q-W06-10 | §0.4; §3 rows marked "Set-up" |
| Optional reads never hide an access change | LD-14 | A116 |
| Forms of later packages stay reachable on rebuilt pages | WP-03 Q-01; WP06-A110 | A118 |
| Copy states no configuration number that the page does not read | WP-01 Q-13 | A80 (selection limit), A27 |
| The boundary wording of a decided policy never says that an owner still has to decide | LD-04; DECISIONS §1.3; WP06-A02 group 13 | A36, A43, A53, A115 |

## 0. Inputs and conventions

### 0.1 Inputs

| Ref | Source | Identity | Sections used |
|---|---|---|---|
| UX | `TARGET_PRODUCT_UX_SPEC.md` (2026-10-05) | SHA-256 b45186887cdc37f6… | §2.2, §2.3, §3.1 steps 7 to 9, §3.3, §4.1, §4.2 (Notices), §4.4, §5.3 (Artifact review, Send result, Uncertain email, Request completion), §7.4, §7.5, §8.2, §8.3, §10.1, §12 V13 to V17 |
| BS | `BUILD_SPEC.md` (r2) | SHA-256 4a6fd90657b0723f… | B10, B12, B13, B21, B24, B31, B33, B35, B45, B46 |
| DE | `../ui-plan-from-specs-2026-10-10/DECISIONS-2026-10-10.md` | SHA-256 a2c935f72cd4f5e9… | §1.2 (B46 closed by owner decision), §1.3 (OC-01 to OC-05, OC-09), §1.5 |
| PL | `../ui-plan-from-specs-2026-10-10/UI-PLAN.md` | SHA-256 75256bfd7e6d929a… | §1, §3.2 TA-07 TA-10, §3.3 OP-05 OP-06 OP-07, §4.1 steps 11 to 13, §5.2 TA-07 TA-10, §5.3 OP-05 to OP-07, §6 (Notices, Application case TA, Outcome and artifact, Send preview, Completion prerequisites), §7 (K-STD, K-BYTE, K-EXT; OP-05 to OP-07 and TA rows), §8 (CMP-01, -03, -08, -10, -13, -14, -18, -21, -26, -28), §10, §11, §12.1 WP-08, §13 |
| CC | `COMMAND-COVERAGE.md` (this folder) | SHA-256 bb81dd73f9501114… | §3 WP-08 rows; §4 byte releases; §5.1; §5.5; §6 CC-07, CC-10 |
| LP | `PLAN.md` (this folder) | SHA-256 e25c5917f6e9e8d3…; internal a67abd4 | §3, §4 (LD-02, LD-03, LD-04, LD-05, LD-06, LD-07, LD-08, LD-11, LD-14), §7 |
| W1 | `WP-01.md` §3, §4 | internal a67abd4 | A-01, A-02, A-04, A-08, A-09, P-02 |
| W2 | `WP-02.md` §3, §4 | internal a67abd4 | B-02, B-03, B-06, B-13 |
| W3 | `WP-03.md` §3, §4; `WP-03-design.md` §2.1, §2.7, §3.1, §3.2, §3.4 | internal a67abd4 | C-02 = LD-14, C-03, C-07; Q-W03-15 (TA history rebuilt in WP-08); carried "Result and delivery" section |
| W6 | `WP-06.md` §3, §4; `WP-06-acceptance.md` (corrections note, lessons, §0.2) | SHA-256 7a1d82e48fde6e93… | D-01 to D-13; format and conventions |
| RM | lane `research/route-map.md` | SHA-256 1e822c601f90dda5… | §2 rows C04 to C06 (ta), T19, T20, T28, T29, T56 to T58, O03, O21, O22, O28, O30, O35 to O41, O46, O48, O51, O53 to O57; D12, D13 |
| Code | lane repository | 42cb373 | `src/contracts/operations-work.ts` (`ops.record_official_result`, `ops.record_artifact`, `ops.confirm_artifact_association`, `ops.reject_artifact_association`, `ops.open_incident`, `core.record_outcome`, `ops.official_result_form`, incident rows); `src/contracts/delivery.ts` (`zWireDeliveryPage`, notices, selection); `src/contracts/core.ts` (`zCompletion`); `src/kernel/vocabulary/application.ts` (`OUTCOMES`), `delivery.ts`, `operations.ts`, `incidents.ts`; `src/apps/shared/delivery/pages.ts` (`DLV_MESSAGES`) |

Verified facts of the code at 42cb373 that the items rely on (read by the author; the design review checks the rest):

- `OUTCOMES` = `issued`, `refused`, `withdrawn`, `cancelled`, `dependency_failed`, `prepared_and_handed_over`,
  `external_outcome_unresolved`. `ops.official_result_form` returns the outcomes allowed for the application's mode,
  the artifact types and an offer evaluation.
- `ops.record_official_result`: outcome, evidence (1 to 5), event time, optional artifact (file, type); revision
  `application`. `core.record_outcome` (route `ops.case_work.cancelled`): evidence (1 to 20) and reason; it has no
  outcome field. `ops.record_artifact`: file, type, optional `replacesArtifactId`, optional `incidentId`.
- `ops.confirm_artifact_association`: incident, artifact, chosen application, and `verified` {surname, passport
  number, type}; revision `incident`. `ops.reject_artifact_association`: incident, artifact, note. `ops.open_incident`:
  kind, application, note, evidence (0 to 10); an operator opens only three kinds, on its own application (below).
- Artifact association status: `verified`, `pending_review`, `conflict`, `rejected`. Artifact eligibility:
  `eligible`, `withheld_pending_review`, `withheld_wrong`, `blocked`, `noncurrent`. Incident states: `open`,
  `assigned`, `awaiting_evidence`, `resolved`, `closed`; owner kinds `assigned_operator`, `superadmin`, `reviewer`.
- `dlv.delivery_page`: files (label, available, deny code), packet, emails (state `queued`, `denied_at_check`,
  `sending`, `accepted`, `synthetic_accepted`, `failed`, `uncertain`; versions; queued and result times; resend
  of; resend offer), notices, handovers (kind `packet`, `physical`, `manual_operator_email`, `direct_external`;
  `systemVerified`; `tmHeldResult`), retrievals (channel `web_retrieval`, `bulk_selection`, `document_email`,
  `staff_review`; result `streamed`, `stream_failed`, `unavailable`, `denied`; deny code), `applicationBlocked`,
  staff `offers` (including `recordManualEmail`), and `unavailable` boundary codes. It carries **no recipient
  address** (Q-02).
- A notice carries kind, application, parameters, `ackRequired`, posted time, `acknowledgedAt` and revision. **No
  read marker exists** (LD-06).
- A case read carries `completion`: per prerequisite (`outcome`, `no_possible_filing`, `artifact`, `originals`,
  `delivery`, `declared_completion`, `not_group_end_case`) `satisfied` and reason codes. It carries no owner and no
  evidence per prerequisite (Q-03).
- A selection carries per item: item number, application, subject kind, result (`included`, `unavailable`,
  `failed`) and reason; its outcome is `complete` or `aborted` (null while it runs).
- The current texts of three boundary codes contradict LD-04 and DECISIONS §1.3: `delivery_send_trigger_unselected`
  ("Who starts sending a result by email is not decided yet…"), `completion_check_trigger_unselected` ("Who starts
  the completion check is not decided yet…") and `uncertain_email_handling_unselected` ("…how to handle that is not
  decided yet…") in `src/apps/shared/delivery/pages.ts:124-127`. A36, A43 and A53 fail until the texts change.
- Only the synthetic mail transport is wired (`EMAIL_TRANSPORT_LABELS`); an email send is queued only by the labelled
  test harness or by a deliberate resend (`EMAIL_SEND_ORIGINS`).

Facts reported by two read-only research workers of this checklist (12 October 2026, code at 42cb373; file references
in the run record), used by the rows named:

- `ops.record_official_result` accepts only `issued` and `refused` and refuses a preparation-only service
  (`service_mode_not_applicable`); `ops.official_result_form` returns `issued` and `refused` for the other modes and no
  outcome for preparation-only. `issued` and `refused` need the mode's filing act in state `filed_evidenced` and no act
  of that kind still authorized or unknown (`filing_not_evidenced`). The evidence must include an external
  reference, a document version or the artifact (`act_evidence_insufficient`). The event time is required and may not
  be more than five minutes ahead (`instant_in_future`). A declared artifact type is required
  (`artifact_type_undeclared`). A second outcome: `outcome_already_recorded`. The result summary returns the
  application, the outcome and the artifact id. The recorded outcome's evidence is in no read that an operator can
  use (only the SuperAdmin audit) (A02 to A08, Q-14).
- `core.record_outcome` (cancelled): reason of 10 to 1000 characters; refused as parked (`cancellation_undeclared`)
  when the service declares no cancellation path, and `filing_possibly_occurred` when filing may have happened without
  business evidence; summary returns the application only (A07).
- `ops.confirm_artifact_association`: all three attestations must be true (`all_fields_required`); the chosen
  application must be the uploaded-for application or a candidate (`not_a_candidate`); refusals
  `artifact_cross_group`, `artifact_type_already_eligible`, `incident_not_open`, `stale_revision`. Effect: artifact
  `verified` and `eligible`; incident `resolved`. `ops.reject_artifact_association`: note of 1 to 2000 characters;
  effect: artifact `rejected`, `withheld_wrong`; incident `awaiting_evidence` and still open, so it still needs
  `ops.resolve_incident` (WP-14). Actor of both: the assigned operator, the current incident owner or reviewer, or a
  SuperAdmin (A19 to A23).
- `ops.open_incident`: an operator may open only `operational_failure`, `custody_discrepancy` and
  `post_filing_correction` (`not_operator_openable`); `artifact_association` incidents open automatically only. No
  business duplicate guard: each new key opens a new incident (A26, Q-13).
- `dlv.retrieve_for_review`: the incident owner or reviewer only (no SuperAdmin), while the incident is open and the
  artifact is `pending_review` or `conflict`; a same-key retry streams nothing (A27).
- `ops.incident` returns candidates as application id and group label; no read returns the extracted name and
  passport tokens, the rule's failure code or the contradiction flag (stored only in the artifact's association
  metadata) (A19, Q-14).
- The SuperAdmin incident page renders the confirm and reject forms with actions under `/admin/incidents/:id/…`, for
  which no route exists (Q-11).
- A recorded result document starts as `pending_review` / `withheld_pending_review`. Extraction and the association
  rule `assoc/1` run asynchronously after the commit (scan, parse, token extraction on the processing instance). On
  success: `verified` / `eligible`. On failure: an `artifact_association` incident opens in the same transaction,
  owner the assigned operator; status `conflict` for a contradictory identifier or several candidates, otherwise
  `pending_review` (A04, A16, A17). The rule searches the travel agent's open applications of the same offering in
  every group: passport numbers reused by earlier runs take part in later runs (§0.4).
- The travel agent can download a result as soon as the artifact is `verified` and `eligible` and the release checks
  pass; no send or release event is needed (LD-05). An open `artifact_association` incident on the version or the
  application blocks the release (`incident_block`). A same-key download replays the recorded result and streams
  nothing (`duplicate_operation`) (A65 to A67).
- `dlv.delivery_page` on the staff surface: file rows carry the label (the artifact type for a result) and the
  document version id, not a version number; `notices` are the reader's own only, so the operator does not see the
  travel agent's notices or acknowledgements; `unavailable` lists the send and completion boundary codes while the
  lifecycle is `submitted`, and the uncertain-email code on staff pages when a send is uncertain; `offers` exist on
  the operator surface only (A35, A43, Q-02).
- `dlv.record_manual_email`: recipient address (typed), document versions (1 to 10), evidence (1 to 5), event date.
  Core compares the address with the travel agent's current account email and refuses a mismatch
  (`recipient_not_owning_ta`); it stores `systemVerified: false` (A45).
- `dlv.manual_resend`: reason (at least ten characters); refused for an uncertain send
  (`uncertain_email_handling_unselected`), for a send that is not `failed` (`resend_source_not_failed`), for a stale
  revision, when no real mail transport is selected (`real_mail_transport_unselected`) and when a resend exists
  (`resend_exists`) (A44).
- Completion: for a TravelMudra-held electronic result, the `delivery` prerequisite is met only by an accepted
  (or synthetic accepted) document email together with a `result_available` notice; a manual email record never meets
  it. On this installation the notice is posted only by the test harness, so completion is not reachable through the
  product's pages (A56, A57).
- `dlv.retrieve_selection`: items are authorized one by one first; one unauthorized item refuses the whole request and
  records nothing; then each item is checked just before its bytes (A79 to A84).
- `views.ta_history`: a projection with `asOf {healthy, lagMs}`; recorded time only (no event time); no actor; at
  most 1000 entries; acknowledgements and manual email records are not history lines (A101 to A104).
- Today's other boundary texts that contradict LD-04: the operator and SuperAdmin case page callout "Completion
  check: trigger and owner unselected" with "Who starts the completion check is a recorded, not-yet-decided step.";
  the TA-07 closing callout "Some closing steps have no owner yet" with "Who sends your result to you is not decided in
  this release…"; the docket owner label "Owner not yet decided" for the pending reasons
  `delivery_send_trigger_unselected` and `completion_check_trigger_unselected` (A53, A152).

### 0.2 Conventions

- **Personas.** Operator: `operator-1` (assigned operator of every proof application; stands for
  `syn-operator-1`), `operator-2` (not assigned; isolation and, by fixture, a named reviewer). SuperAdmin:
  `superadmin-1`, `superadmin-2` (set-up: payment and assignment; observation: no completion or send control). TA:
  `syn-ta-1` (owner of the proof applications), `syn-ta-2` (isolation only). Keyboard-only user. Screen-reader user.
  Phone user (390 px wide). No step suspends a seeded account; an inactive account is a test fixture.
- **Where.** `L`: a person or the LD-11 harness shows it on `lane-ui`. `T`: an automated test in the lane repository
  shows it at the same commit; the run record names the test. `L+T`: both are required.
- **Sign-in codes (rule C).** As WP-01 §0.2. The LD-11 harness signs in. Nobody prints, logs, screenshots or stores a
  code or an authenticator key.
- **Copy.** Quoted text is draft copy (CR-09). Draft copy passes when the page states the same facts. The boundary
  sentence form of §11.3 applies to an unavailable action, with one rule from LD-04: for the result send, the
  completion request and the handling of an uncertain email, the owner decisions exist (DECISIONS §1.3, OD §§2 to 4).
  The page shows the boundary as Core reports it (the code in `unavailable`, or Core's refusal) and says that the
  step is not available in this release. It MUST NOT say, or imply, that the product owner or anyone still has to
  decide, choose or select the trigger, the event, the actor or the handling. Forbidden in these notices: "not
  decided", "not selected", "who starts", "the product owner decides", "B46". The exact wording is set at the WP-08
  design review (LD-04); A36, A43 and A53 check the facts and the forbidden phrases.
- **Outcome words** (glossary §11.2): "Issued", "Refused", "Withdrawn", "Cancelled", "Dependency failed", "Prepared
  and handed over", "External outcome unresolved"; no outcome: "Outcome not recorded". "Completed" is a lifecycle
  fact ("Processing completed"), never an outcome and never success.
- **Delivery words** (BS B31; glossary "Delivery"). Each is its own fact with its own time: *Email*: "Queued",
  "Sending", "Sent: the mail provider accepted it" (`accepted`), "Sent to the test mailbox" (`synthetic_accepted`),
  "Not sent: a file did not pass its check" (`denied_at_check`), "Failed" (`failed`), "Uncertain: not confirmed"
  (`uncertain`). *Web notice*: "Posted [time] IST". *Retrieved*: "Sent in full to your download" (`streamed`),
  "Interrupted" (`stream_failed`), "Not available" (`unavailable`), "Refused" (`denied`). *Acknowledged*:
  "Acknowledged [time] IST". No page says "Received", "Delivered", "Opened" or "Read" for any of them: a provider's
  acceptance and a streamed download do not prove that a person received the file.
- **Association words.** Status: "Matched and verified" (`verified`), "Waiting for review" (`pending_review`),
  "Conflict found" (`conflict`), "Rejected" (`rejected`). Release eligibility: "Can be released" (`eligible`), "Held
  for review" (`withheld_pending_review`), "Held: wrong document" (`withheld_wrong`), "Blocked by an incident"
  (`blocked`), "Replaced: no longer released" (`noncurrent`).
- **Notice words (LD-06).** A notice that asks for an acknowledgement reads "Needs your acknowledgement" until it is
  acknowledged, then "Acknowledged [time] IST". A notice that asks for none shows neither. No "Unread", "New", "Read",
  "Mark as read" or bold-unread styling anywhere.
- **Dates and times.** Every time carries "IST" (AD-10, CR-06). Event time and recorded time are both shown where a
  read returns both.
- **Freshness (LD-08).** An authoritative read (`core.*`, `ops.*`, `dlv.*`) shows "Read at [time] IST". A projection
  (`views.*`) shows "Up to date when read at [time] IST", "Behind by [n] s when read at [time] IST" or "Freshness
  unavailable". No page applies a client-side age threshold.
- **Facts.** A page shows only facts that its read returns (WP-02 B-06). A fact read after an operation is labelled
  "Current" (B-02, C-03). An unknown count or state shows "Unavailable", never "0", "None" or "Met" (D7). A list that
  returns its row limit says so and claims no total.
- **Receipts.** CMP-08 as WP06-A103: the request reference links to the operation status page; the resulting facts;
  "Recorded once. Sending the same form again does not repeat it."; no accepted time (P-02). The receipt names the
  command only when the operation's resource, the returned id and the summary establish it; otherwise it reads
  "Request recorded" and shows the current state labelled "Current" (WP-06 D-02). The polite region announces it.
- **Replay terms** (used by every "Nth time" item):
  1. *Double send*: a double-click on the final button.
  2. *Identical replay*: the harness sends the accepted request again with the same `_op` and the same fields (raw
     envelope; for a multipart form, the same staged file). Expected: the original result, nothing new recorded.
  3. *Changed-content conflict*: the same `_op` with one changed field. Expected: refused as a used form; the page
     re-renders with a new form key, the typed values kept and "This form was already used with different content.
     Your values are kept: check them and send again."; nothing recorded.
  4. *Browser Back*: after the receipt the person presses Back. Back reloads the page (WP-01 A-02) with a fresh form
     and current facts. A send from that page is a new request; the command's own business check decides it.
  5. *Rejected-form refresh*: a send that Core refuses leaves no operation record; the re-rendered form carries a new
     key; the corrected send is recorded once.
  6. *Lost acknowledgement* (fixture): C4 (CMP-13) "Checking the original result" and "Check status"; no new send of
     the same intent is offered there.
  For a byte release (download, selection, review copy) the K-BYTE rule replaces terms 2 and 3: a same-key retry
  MUST NOT stream bytes from a stored result; it shows the earlier result and offers a new download, which is a new
  check (PL §7 K-BYTE).
- **Paths (LD-03).** Existing paths and form actions stay. New pages get the paths that the design names. Pages:
  OP-05 outcome and result documents (new path; actions `/ops/applications/:id/official-result`,
  `/ops/applications/:id/outcome`, `/ops/applications/:id/artifacts` stay); OP-05 association review (the incident
  page `/ops/incidents/:incidentId` for the kind `artifact_association`, rebuilt; actions `…/confirm-association`,
  `…/reject-association`, `…/artifacts/:artifactId/review-copy` and `POST /ops/incidents` stay); OP-06 Send result
  (`/ops/applications/:id/delivery`, existing; actions `…/document-email` (boundary, no form), `…/manual-emails`,
  `/ops/email-sends/:id/resend` stay); OP-07 Request completion (new path or OP-06 section, as the design names; the
  route `admin.delivery.completion_check` stays registered with no form, CC-07); TA-07 section "Result and delivery"
  (`/ta/applications/:id`) and the TA delivery detail `/ta/applications/:id/delivery` (existing); download actions
  `…/documents/:versionId/retrieve`, `…/packets/:packetId/retrieve`, `POST /ta/selections` stay; "Download of
  several files" `/ta/selections/:selectionId` (existing); TA-10 `/ta/notices`, `/ta/notices/:noticeId`, action
  `…/acknowledge`; TA history `/ta/applications/:id/history` (existing). An item names the page; the run record names
  the path used.
- **Pass rule.** WP-08 passes when every `L` item passes on `lane-ui` at the integrated ref, every `T` item has a
  named passing test at that commit, every axe item passes, and the proofs V13, V14 and V17 (to their boundary, §3)
  pass, except the explicitly deferred items of §5. The run record lists each deferred item as "Deferred" with its
  reference, not as "Fail". An item that the architect marks "partly met" by a recorded decision passes with that
  note. A failed item becomes a finding ranked P0, P1 or P2 with its scenario (PRI-20260930-01).
- **Preconditions on `lane-ui`.** WP-01, WP-02, WP-03 and WP-06 are integrated (TA pages create, edit and submit; SA
  pages record the payment and assign). The operator's work steps up to the external act evidence run through the
  existing operator pages or the WP-07 pages, whichever are integrated (set-up, §0.4). The harness holds the
  synthetic sample documents of WP-03 §0.4 and generates synthetic result documents in memory (Q-06).
- **Data hygiene.** WP-08 MUST NOT change seeded offerings, launches, listings or accounts. It creates its own group
  and applications per run (§0.4). Payment references, reasons, notes and evidence values carry the run stamp. It uses
  no real passport, no real result document and no real person's data. The run record keeps identifiers
  (applications, artifacts, incidents, retrievals, selections, notices, operation references) in the internal record
  only.

### 0.3 Synthetic data used by WP-08

| Item | Value | Use |
|---|---|---|
| Offering | "SYN Tourist e-visa" (`SYN/syn_tourist_evisa/travelmudra_filed`), ₹3,500; delivery evidence for "issued": TravelMudra-held electronic; artifact type `evisa_grant`. Gate 2 passes once the service payment is received; the government submission carries no fee, so the default ₹0 ceiling does not block it (Q-05) | Applications A to D |
| Applicant documents | Synthetic passports and photographs generated in memory from `test/fixtures/documents/samples.ts` (WP-03 Q-09), with passport numbers new to this run (one letter and seven digits), MRZ document code P, expiry at least 180 days after the return date | Intake and submission (set-up) |
| Result documents | Synthetic text PDFs generated in memory in the form of `resultPdf` of `test/system/case-work.test.ts` (Q-06): R-A ("REPUBLIC OF SYNTHETICA", "ELECTRONIC VISA GRANT", A's surname and given names, A's passport number; matches automatically); R-A2 (A's facts, second file; replacement); R-B1 (the same lines without B's names, with B's passport number: the rule cannot verify it, so it waits for review); R-C1 (as R-B1 for C: waits for review, then rejected); R-C2 (C's full facts; replacement of R-C1) | Association and release |
| Evidence values | External reference `SYN-V08-[stamp]-[letter]-[n]`; notes "WP08 [stamp] synthetic" | Outcome evidence, notes, reasons |
| Operators | `operator-1` assigned; `operator-2` isolation | OP-05 to OP-07 |

### 0.4 Run recipe (rerunnable)

- Set-up 1, TA pages (WP-03), harness as `syn-ta-1`: create the group `wp08-[yyyymmddhhmm]` in Synthetica, travel
  start today + 30 days, return today + 40 days; add applicants A, B, C and D (synthetic passports and photographs);
  save the details; submit A to D on TA-08.
- Set-up 2, SA pages (WP-06), `superadmin-1`: record "Payment received" for A to D (reference
  `SYN-V08-[stamp]-[letter]-PAY`); assign A to D to `operator-1`.
- Set-up 3, operator pages (existing or WP-07), `operator-1`, for A to D: start work; record readiness; authorize
  the external act `government_submission` with the irreversible-act confirmation and no fee; record its evidence as
  filed with the external reference `SYN-V08-[stamp]-[letter]-ACT`. This is the path of the system test
  `test/system/case-work.test.ts` ("the main path through staff and edge"). These writes are set-up, not the subject
  under test.
- Passport numbers MUST be new in every run: the association rule searches every open application of `syn-ta-1` for
  the same offering, and earlier runs' applications stay open. A reused number makes the rule answer "contradictory
  identifier" and turns the A16 check into a review.
- Under test: OP-05 for A (issued with R-A, automatic association), B (issued with R-B1, review copy, confirm), C
  (issued with no result document; then R-C1, review, reject; then R-C2 as replacement; the incident is resolved
  through the carried WP-14 form as set-up), D (refused, no result document); TA-07, TA-10, the selection page and
  history for A to D; OP-06 and OP-07 for A and D; R-A2 replaces R-A after the first download (V14).
- The stamp makes every run unique. Checks compare with the baseline of step P-0 (deltas). Data of earlier runs stays
  and is excluded by its stamp.

## 1. Scope

### 1.1 Pages

| Page | Host and path | Part in WP-08 |
|---|---|---|
| OP-05 Outcome and result documents | 4652, new path (design) | Record the official outcome (allowed values only); record a cancelled outcome; record a result document; the result documents with association status and release eligibility |
| OP-05 Association review | 4652 `/ops/incidents/:incidentId` for kind `artifact_association` (rebuilt) | Review copy; candidates; contradictions; confirm or reject the association; replacement document; open an association incident. Other incident kinds stay on the existing page until WP-14 (Q-11) |
| OP-06 Send result | 4652 `/ops/applications/:id/delivery` (rebuilt) | Recipient, files with type, version, availability and per-file eligibility, notice requirement, prior attempts, the send boundary as Core reports it, "Record a manual email (not system-verified)", deliberate resend after a proven failure (Q-01). Packet, handover and direct-external forms stay carried (WP-10) |
| OP-07 Request completion | 4652, new path or OP-06 section (design) | Core's completion prerequisites; continuing duties as not blocking; the completion boundary as Core reports it; no SuperAdmin completion control |
| TA-07 Result and delivery | 4650 `/ta/applications/:id` section; `/ta/applications/:id/delivery` | Outcome row; result files and downloads; delivery facts as separate rows; the action panel's download and notice steps |
| Download of several files | 4650 `/ta/selections/:selectionId`; action `POST /ta/selections` | Selection of files on TA-07; per-file results; no substitution |
| TA-10 Notices | 4650 `/ta/notices`, `/ta/notices/:noticeId` | List and detail; acknowledgement only when a decision requires it; no read marker |
| TA history | 4650 `/ta/applications/:id/history` | Rebuilt (Q-W03-15): scoped case history (CMP-09) |

Read models: Outcome and artifact (`ops.official_result_form`, `ops.case_work`, `core.ops_case`, `ops.incident`,
`ops.incidents`), Send preview (`dlv.delivery_page` on the staff surface; recipient: Q-02), Completion prerequisites
(`completion` of the case read; continuing duties: Q-03), Application case TA (`core.ta_application`,
`dlv.delivery_facts`, `dlv.delivery_page` on the TA surface), Selection (`dlv.selection`), Notices (`dlv.notices`,
`dlv.notice`), TA history (`views.ta_history`, projection).

### 1.2 Command coverage (CC §5.1: 8 WP-08 commands; byte releases of CC §4; two moved commands, Q-01, Q-07)

| # | Command or byte release | Route id today | Page | Items |
|---|---|---|---|---|
| 1 | `ops.record_official_result` | `ops.case_work.official_result` | OP-05 | A01 to A06, A08 to A12 |
| 2 | `core.record_outcome` (cancelled) | `ops.case_work.cancelled` | OP-05 | A07, A10 |
| 3 | `ops.record_artifact` | `ops.case_work.artifact` | OP-05 | A15, A22, A23, A29, A31 |
| 4 | `ops.confirm_artifact_association` | `ops.incidents.confirm_association` | OP-05 review | A19 to A21, A29, A30 |
| 5 | `ops.reject_artifact_association` | `ops.incidents.reject_association` | OP-05 review | A22, A29, A30 |
| 6 | `ops.open_incident` (operator route; operator-openable kinds only; association incidents open automatically, Q-13) | `ops.incidents.open` | OP-05 | A17, A26, A29 |
| 7 | `dlv.queue_document_email` (deliberate boundary) | `ops.delivery.document_email` | OP-06 | A36, A37 |
| 8 | `core.check_completion` (deliberate boundary) | `admin.delivery.completion_check` | OP-07 | A53, A54, A55 |
| + | `dlv.record_manual_email` (CC row WP-19; brief puts it on OP-06, Q-01) | `ops.delivery.manual_email` | OP-06 | A45, A46 |
| + | `dlv.manual_resend` (CC row WP-19; brief, Q-01) | `ops.delivery.resend` | OP-06 | A44, A46 |
| + | `dlv.acknowledge_notice`, TA route (CC row WP-17; TA-10 is built in WP-08, Q-07) | `ta.notices.acknowledge` | TA-10 | A90 to A93 |
| B1 | `dlv.retrieve_document` (TA routes) | `ta.delivery.retrieve`, `ta.delivery.packet_retrieve` | TA-07 | A65 to A67, A72 |
| B2 | `dlv.retrieve_selection` (TA route) | `ta.selections.create` | TA-07, selection page | A79 to A85 |
| B3 | `dlv.retrieve_for_review` | `ops.incidents.review_copy` | OP-05 review | A27 |

The `admin.incidents.open` route of `ops.open_incident` stays on its page (WP-14). All commands also: A111 (receipt
checked against the operation), A112 (no record for a refusal; lost acknowledgement), A113 (replay matrix), A114 and
A115 (refusal text). Every page that reads an optional block: A116 (LD-14).

Commands outside WP-08 that the proofs touch only as set-up: `intake.start_individual`, `core.edit_draft`,
`core.submit` (WP-03); `pay.record_service_status`, `core.assign` (WP-06); `ops.start_work`, `ops.record_readiness`,
`core.authorize_external_act`, `ops.record_act_evidence` (WP-07 or existing pages). Packet release and handover
(WP-10), disclosure and incident closure (WP-14) appear only as carried forms (A118).

### 1.3 State coverage

S1 (loading) does not apply: every WP-08 page is server-rendered. S5 applies only to the TA history page (projection).

| Page | Page states | C1 validation | C2 rejected | C3 accepted | C4 unresolved | C5 stale |
|---|---|---|---|---|---|---|
| OP-05 outcome | S4 A13; S6 A11; S7 A14 | A08 | A03, A06, A07 | A04, A05, A07, A13 | A10 (6) | A09 |
| OP-05 documents and review | No document A05; review A19; replaced A23 | A21, A31 | A21, A26, A31 | A15, A16, A20, A22, A23, A26 | A29 (6) | A30 |
| OP-06 | Boundary A36; file unavailable A39, A40; S4 A35 (recipient); S6 A50; S7 A49 | A45 | A37, A44, A46 | A44, A45 | A46 (6) | A41 |
| OP-07 | Prerequisites A51; completed A58; S4 A62; S6 A50 | — | A54 | — | — | — |
| TA-07 result and delivery | Issued without document A68; under review A69; uncertain A70; completed with duty A71; S4 A116; S6 A75 | — | A66, A67 | A65 | A67 | A66 (2) |
| Selection page | Running, complete, aborted A81, A85; S6 A86 | A80 | A80, A84 | A81, A82 | A83 | — |
| TA-10 | S2 A95; S3 A95; S6 A97; row limit A96 | — | A92 | A91 | A93 (6) | A92 (3) |
| TA history | S2, S5, S7 A104; S6 A105 | — | — | — | — | — |

### 1.4 Specification scenarios

| Scenario | What WP-08 shows | Items |
|---|---|---|
| V13: issued with a wrong or missing result document keeps the outcome but blocks release | C issued without a document; B with a contradictory document; outcome stays "Issued"; release held with an owner | A05, A17, A22, A68, A69, §3 V13 |
| V13: an ambiguous association goes to a scoped review | Association incident with the assigned operator as owner; review copy; confirm or reject; no best-match shortcut | A17 to A22, A25, A26 |
| V13: a replaced or revoked document never substitutes silently | Replacement marks the earlier version "Replaced: no longer released"; a download of it is refused | A23, A24, A40, A66 |
| V14: the operator explicitly sends the exact eligible version to the current TA email | To the boundary: recipient, files, versions and per-file eligibility; the send is a Core boundary today | A35 to A42, §3 V14 |
| V14: a change before the per-file check invalidates stale assumptions; unavailable selections are reported one by one | Recheck at each download and selection; per-file results; no substitution | A38, A41, A66, A82 |
| V15: unassigned delivery is owned through SuperAdmin assignment; no SuperAdmin send, filing or completion privilege | Route to SA-03; no SuperAdmin send or completion control | A48, A55 |
| V16: ambiguous email is not success; no automatic resend; deliberate resend only after proven failure | Uncertain state in words; resend offered only from a failed send | A42 to A44, A70 (investigation: WP-19) |
| V17: Request completion returns Core's result or blockers; download alone is not enough; the last prerequisite never auto-completes | To the boundary: Core's prerequisites; download leaves the delivery prerequisite unmet; no auto-completion | A51 to A60, §3 V17 |

## 2. Acceptance checklist

### 2.1 OP-05 Record the outcome

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP08-A01 | Operator (`operator-1`) | Operator case page of A → OP-05 | Open A after set-up 3. Follow the next action "Record the outcome". Read the page. | OP-05 opens for A. One `h1` names the task and the applicant. The identity band shows applicant, application reference, service and mode, travel agent, operator. Status facts as separate labelled rows: Progress, Lifecycle, Outcome ("Outcome not recorded"), Filing or external act, Delivery. Sections in order: "Outcome", "Result documents", "Association reviews" (when one exists). Freshness "Read at [time] IST". | L | PL §3.3 OP-05, §5.3; UX §2.2, §5.3 |
| WP08-A02 | Operator (`operator-1`) | OP-05 of A, outcome form | Read the outcome form. | The outcome choice lists, in words, only the outcomes that `ops.official_result_form` returns for A's mode ("Issued", "Refused"); no free-text outcome and no other value; the page does not hard-code the options. Fields with visible labels: outcome; event date and time (IST); evidence rows from 1 to 5 (kind, value, note), with the rule that one row is an external reference, a document or the result file; optional result document (file, and its type from the read's types). The review text before the button says that Core records the outcome once, that recording sends nothing, that "Issued" does not release the result, and that a result is released only after its document is matched to this application. Button "Record outcome". For a preparation-only application the read returns no outcome: the page shows no outcome form and says that the packet handover records the outcome (WP-10). | L | `ops.official_result_form`; `ops.record_official_result`; PL §5.3 OP-05; BS B21; UX §5.3 |
| WP08-A03 | Harness as `operator-1`; test | OP-05 form action | (1) Send the outcome `withdrawn` and an unknown value for A. (2) Send "Issued" with only an attestation as evidence. (3) Test: send "Issued" for an application whose government submission is still authorized and not evidenced. (4) Test: send it for a preparation-only application. | Each is refused as Core answers it, in words: (1) the outcome is not one of the allowed values; (2) "Evidence of the result is needed: an external reference, a document or the result file." (`act_evidence_insufficient`); (3) "The outcome can be recorded only after the filing is evidenced." (`filing_not_evidenced`), with the route to the external action; (4) not applicable to this service. The typed values stay; nothing is recorded; the status page of the key reads "Nothing is recorded for request [reference] so far". | L ((1), (2)) + T | `ops.record_official_result` guards; PL §5.3 OP-05 (REJ: outcome not allowed for mode); WP01 A-08 |
| WP08-A04 | Operator (`operator-1`) | OP-05 of A | Outcome "Issued", event time now, evidence "External reference" `SYN-V08-[stamp]-A-1`, result document R-A (type "e-visa grant"). Send. Reload after the document check finishes. | C3: the receipt follows A111 (the summary returns the outcome and the artifact id, so it may read "Outcome recorded: Issued"). Current facts: Outcome "Issued"; R-A with its type, "Being checked" (`pending_review` while the check runs) and "Held for review" until the check ends; the receipt does not say that the result is matched, released or sent. After the check (reload): A16. TA-07 of A shows Outcome "Issued" (Current). | L | PL §4.1 step 11; BS B21, B13; WP-06 D-02 |
| WP08-A05 | Operator (`operator-1`) | OP-05 of C | Record "Issued" with evidence and no result document. | Accepted. Current: Outcome "Issued"; Result documents "None recorded"; Delivery "Held: no result document"; the next action names the owner (the assigned operator) and the step "Record the result document". The outcome is not shown as refused, pending or "Approved". TA-07 of C: "Outcome: Issued. The result document is not available yet. TravelMudra is resolving [safe reason]." | L | UX §3.1 step 7, §4.4; BS B13 ("`issued` with missing/wrong artifact retains outcome"); V13 |
| WP08-A06 | Harness as `operator-1` | OP-05 of A after A04 | With a fresh page (current revision), send a second outcome ("Refused"). | Refused by Core's business check (outcome already recorded), in words; Outcome stays "Issued"; nothing is recorded. The rebuilt page shows no outcome form once an outcome exists (the read's offer decides). | L+T | `outcome_already_recorded` (WP06-A107 list); BS B21, B35 |
| WP08-A07 | Operator (`operator-1`); test | OP-05 of an application where Core offers "Record a cancellation" (fixture; on `lane-ui` only when the offering declares a cancellation path) | Read the cancelled-outcome action. Send it with evidence and a reason. Test: send it where the service declares no cancellation path, and where filing may have happened without business evidence. | The action is separate from "Record outcome" and is shown only when Core's evaluation offers it. Where the service declares no cancellation path, the page shows the boundary notice in words (`cancellation_undeclared`, parked: "Cancelling is not available for this service. Owner: product owner."), not a control. Fields: evidence rows from 1 to 20, reason (required; Core's minimum in words). Review text: "Cancelled" is an outcome; it does not complete the application and does not undo filing facts. Accepted: Outcome "Cancelled" (Current; the summary returns the application only, so the receipt follows A111). Filing possibly occurred: refused in words (`filing_possibly_occurred`); nothing recorded. | T (L when available) | `core.record_outcome`; BS B21 ("do not invent cancellation eligibility"), B23; UX §10.1 |
| WP08-A08 | Operator (`operator-1`) | OP-05 of B | Send with no evidence row; then with an event time more than five minutes ahead (harness if the field prevents it); then with an evidence kind outside the list (harness). | C1 for each: the error summary (CMP-07) names the field; the inline error states the rule in words ("Add evidence of the result.", "The date of the result cannot be in the future.", "This kind of evidence is not accepted."); never a raw field code; the typed values stay; nothing is recorded. The corrected send is recorded once. | L | AC-08; `zEvidenceList(1, 5)`; `instant_in_future`, `evidence_kind_unknown` |
| WP08-A09 | Operator (`operator-1`), two tabs | OP-05 of B | Tab 1: open OP-05 of B and choose "Issued". Tab 2: record B's outcome (A16 path). Send tab 1. | Tab 1: C5 "Changed since your review" (CMP-14): the current outcome beside the unsent choice and "Review current information". Nothing is recorded from tab 1. | L | CMP-14; revision `application`; BS B35 |
| WP08-A10 | Operator; harness | OP-05, the Nth time | Replay terms 1 to 6 on the A04 outcome (same staged file for term 2). For term 4, send the form that the reloaded page shows, if any. For term 5, use A08 and then a valid send. Same terms on A07 (test). | (1), (2): one outcome and one result document; the same receipt. (3): refused as a used form; values kept; nothing recorded. (4): the reloaded page shows the recorded outcome and no outcome form; a hand-made send is refused as A06. (5): one outcome. (6): C4; no new send is offered there. | L+T | PL §7 K-STD; BS B35; W1 A-02, A-08 |
| WP08-A11 | `operator-2`; `syn-ta-1` on 4652; SuperAdmin in a support view (test) | OP-05 address and form actions of A | Open the page. Harness: send an outcome with each session. | `operator-2`: SH-02, the same answer as for an address that does not exist; the send is refused; nothing recorded. A TA account cannot sign in on 4652. Support view: no form; a post is refused with the support-view refusal. | L (operator-2) + T | BS B10; PL §2.3 SH-R02, SH-R09 |
| WP08-A12 | Operator | OP-05, operator case page, OP-01 | Read every outcome text. | Outcome words of §0.2 only. No "Approved", "Success", "Done" or "Completed" as an outcome. "Outcome not recorded" when absent. Outcome and lifecycle are separate rows. | L | UX §2.2; PL §11.1, §11.2; AC-26 |
| WP08-A13 | Operator (`operator-1`) | OP-05 of D | Record "Refused" with evidence, no result document. Read the page and OP-07 of D. | Accepted; Outcome "Refused" (Current). Result documents "None recorded"; the page does not ask for a result document unless Core's evaluation asks for one. OP-07 of D shows Core's prerequisites for D (A59). When a block of the page cannot be read (fixture), it shows "Unavailable" and the other blocks render (S4). | L (+T for S4) | BS B21, B24; D7 |
| WP08-A14 | Phone user, operator | OP-05 at 390 px | Open the page. Send the outcome with an error. | Identity, status facts and the next action first; then the form; evidence rows stacked with labels; the final button at the end of the form, not in a fixed bar. The error summary is visible when focused. When the outcome read fails (fixture): S7 with "Try again", never an empty form. No horizontal page scroll. | L (+T for S7) | PL OP-05 (Mobile); AC-02, AC-04 |

### 2.2 OP-05 Result documents and association

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP08-A15 | Operator (`operator-1`) | OP-05 of C after A05 | Select "Record a result document". Choose R-C1 and its type. Send. | The page offers a first result document for an application with an outcome and no document (today only the outcome form carries a first file: the design adds the form or explains the route). The file input (CMP-28) has a visible label and a "Choose file" button; the type choice lists the read's types. C3: the receipt follows A111 (summary: application and artifact id). Current: R-C1 with type, "Being checked". The receipt does not say that the result is matched, released, sent or available to the travel agent. | L | `ops.record_artifact`; PL §5.3 OP-05 (Upload result artifact); BS B12 |
| WP08-A16 | Operator (`operator-1`) | OP-05 of A after A04, once the document check finished | Read R-A's row. | Association "Matched and verified" (rule match; no person reviewed it); release eligibility "Can be released". No reviewer step is offered. No new OCR or AI result is shown as the basis. While the check runs, the row reads "Being checked" and the page names no result of the match. | L | BS B13 (automatic association; "final delivery uses stored verified association metadata"); rule `assoc/1` |
| WP08-A17 | Operator (`operator-1`) | OP-05 of B after recording "Issued" with R-B1 (no names on the file), once the check finished | Read the page and TA-07 of B. | Association "Waiting for review" (`pending_review`; "Conflict found" when Core reports `conflict`, A25); eligibility "Held for review"; an association incident is open, owned by the assigned operator, with the link "Review the association" and Core's note (the file could not be matched automatically, so a person decides). The outcome stays "Issued". Delivery "Held: the result document is under review". TA-07 of B shows the not-available copy (A69). | L | BS B13 (missing or conflicting candidates need a scoped review and an owned incident); UX §5.3 (Artifact review); V13 |
| WP08-A18 | Operator | OP-05, association review, OP-02 | Look for a shortcut. | No "Accept best match", "Accept anyway", "Use this document", "Mark verified" or "AI verified" control or text anywhere. Confirmation needs the review copy and the three attestations (A19). | L | UX §5.3 ("Never add an 'accept best match' shortcut"); PL §11.1 |
| WP08-A19 | Operator (`operator-1`) | Association review of B's incident | Read the page. Select "Open a review copy". | `h1` names the review and the applicant. Evidence: the document's type, the file and when it was recorded; the candidate applications as the read returns them (application reference and group label; no other applicant's facts); the required and missing evidence. The extracted name and passport facts and the contradiction found are shown when a read returns them; no read returns them today, so the page says "The facts read from the file are not shown on this page yet. Compare them on the review copy." and the item is partly met (Q-14). "Open a review copy" streams the copy and records a staff review retrieval (A27). Confirm form: "The application the file belongs to" (only listed candidates; none preselected); three checkboxes, never prechecked: "I compared the surname on the review copy", "I compared the passport number on the review copy", "I compared the document type on the review copy". Reject form: note (required). Visible review text before each button states the effect: confirm makes the file releasable for that application; reject holds it as the wrong document and keeps the incident open. | L | `ops.confirm_artifact_association` (`verified` surname, passportNumber, type); `ops.incident`; `dlv.retrieve_for_review`; UX §5.3 ("extracted name and passport evidence… contradictions"); BS B13 |
| WP08-A20 | Operator (`operator-1`) | Association review of B | Open the review copy. Choose B. Tick the three attestations. Confirm. | C3: the receipt follows A111 (confirm and reject both act on the incident; the confirm summary returns the chosen application). Current: R-B1 "Matched and verified (by [operator])", "Can be released"; the incident "Resolved". TA-07 of B shows the download (Current). | L | `ops.confirm_artifact_association`; BS B13; WP-06 D-02 |
| WP08-A21 | Operator; harness | Association review of B (before A20) | Confirm with one attestation unticked. Harness: confirm with a chosen application that is not a candidate; confirm after A20 again (fresh page). Test: the chosen application already has an eligible document of the type; the chosen application is in another group. | Unticked: C1 "Confirm that you compared the surname, the passport number and the type." (`all_fields_required`). Not a candidate: field error in words (`not_a_candidate`). After A20: "This review is closed." (`incident_not_open`) or the stale comparison. Test cases: `artifact_type_already_eligible`, `artifact_cross_group` in words. Each time the typed values stay, nothing is recorded and the association stays as before. | L+T | `ops.confirm_artifact_association` guards; AC-08 |
| WP08-A22 | Operator (`operator-1`) | Association review of C after A15 (R-C1 waits for review) | Open the review copy. Write a note. Reject the association. | C3 per A111. Current: R-C1 "Rejected", eligibility "Held: wrong document"; the incident stays open, "Waiting for evidence", with its owner; the outcome stays "Issued"; Delivery stays held; the next action reads "Record the correct result document" with the owner. No R-C1 byte is releasable to the travel agent. | L | `ops.reject_artifact_association`; BS B13; UX §5.3 |
| WP08-A23 | Operator (`operator-1`); set-up through the carried incident form | OP-05 or the review of C after A22 | Record R-C2 as the replacement of R-C1 for the incident. Read the page after the check. Set-up: resolve the incident through the carried WP-14 form with a note and evidence. Read TA-07 of C before and after the resolution. | Accepted. R-C1 reads "Replaced: no longer released"; R-C2 runs its own check ("Being checked", then "Matched and verified" when the rule matches). While the association incident of C is open, C's release stays blocked and the page says why ("An open incident on this application stops every release while TravelMudra handles it."). After the resolution, TA-07 of C offers R-C2. No page offers R-C1 for release at any time; no silent substitution. | L | `ops.record_artifact` (`replacesArtifactId`, `incidentId`); `incident_block`; BS B12, B13 ("replacement invalidates earlier eligibility") |
| WP08-A24 | Operator (`operator-1`); `syn-ta-1` | OP-05 of A, TA-07 of A (§3 V14-4) | After the TA downloaded R-A (A65), record R-A2 as the replacement of R-A. Read OP-05 and TA-07. | R-A "Replaced: no longer released"; R-A2 has its own association status; TA-07 offers only the version that is now releasable and names its version number. The earlier retrieval of R-A stays listed with its version (history kept). | L | BS B12, B13; UX §8.3 (byte replaced: no silent substitution) |
| WP08-A25 | Test | Association with two candidate applications in scope with the same surname and passport facts (fixture) | Record the document. | Core opens an association incident; the review lists both candidates; nothing is matched automatically; no candidate is preselected. | T | BS B13 ("multiple candidates need a scoped secondary review") |
| WP08-A26 | Operator (`operator-1`); harness | OP-05 of A; association reviews | Look for a way to start an association review by hand. Harness: as `operator-1`, open an incident of kind `artifact_association` on A; open an incident of an operator kind on an application of `operator-2`. | OP-05 offers no control that opens an association incident: Core opens it when the automatic match fails (Q-13). If the design places "Report a problem with this application" (`ops.open_incident`) on OP-05, it lists only the kinds an operator may open, in words ("Operational failure", "Custody discrepancy", "Correction after filing"), and its receipt follows A111. The hand-made association kind is refused in words (`not_operator_openable`); the other application answers SH-02; nothing is recorded. | L+T | `ops.open_incident` (`OPERATOR_OPENABLE_INCIDENT_KINDS`); CC row (`ops.open_incident` → OP-05); PL §5.3 OP-05; Q-13 |
| WP08-A27 | Operator (`operator-1`); `operator-2`; SuperAdmin; harness | Review copy of B's incident (before A20) | Open the review copy twice with new forms. Harness: replay the first with the same `_op`. `operator-2` and `superadmin-1` post the review copy. After A20, open it again. | Each new review copy rechecks and records a retrieval with channel "staff review". The same-key replay streams nothing (K-BYTE) and shows the earlier result. `operator-2`: SH-02; `superadmin-1`: refused (the review copy is for the incident owner or reviewer); no byte. After A20 (status verified, incident resolved): refused in words; no byte. The page states no limit number. | L+T | `dlv.retrieve_for_review`; PL §7 K-BYTE; BS B10, B12 |
| WP08-A28 | Test | Association review by a reviewer whom a SuperAdmin named (fixture; reviewer assignment is WP-14) | Render the review as the reviewer. | The reviewer sees the review copy, the candidates and the decision forms; no filing, readiness, outcome or send control; the candidate applications show only the facts the read returns for a reviewer. | T | BS B13 ("a SuperAdmin assigns a reviewer without filing authority"); `OPS_INCIDENT_OWNER_KINDS` |
| WP08-A29 | Operator; harness | OP-05 documents and review, the Nth time | Replay terms 1 to 6 on A15 (record document, same staged file for term 2), A20 (confirm) and A22 (reject). For term 4 on A20, confirm again from the reloaded page. Test: replay terms on `ops.open_incident` (A26). | (1), (2): one record each; the same receipt. (3): refused as a used form; nothing recorded. (4): the reloaded review shows the current state and no decision form; a hand-made second confirm or reject is refused by Core's check (`incident_not_open` or `stale_revision`); nothing recorded. (6): C4; no new send offered. `ops.open_incident` has no business duplicate guard: a new key opens a second incident, so the form after Back MUST show the incident already opened before its button (the page adds no guard of its own). | L+T | PL §7 K-STD; BS B35 |
| WP08-A30 | Operator (`operator-1`), two tabs | Association review of B | Tab 1: open the review and tick the attestations. Tab 2: reject. Send tab 1. | Tab 1: C5 with the current association beside the unsent decision; nothing recorded from tab 1. | L+T | revision `incident`; CMP-14 |
| WP08-A31 | Operator; test | OP-05 file input | Send a file of a format Core does not accept; a file above the size limit (fixture); a file that fails the safety check (fixture). | Each: a field error in words naming the file; nothing recorded; the page states no size number that it does not read. | L (format) + T | BS B12, B15; PL CMP-28; WP-01 Q-13 |
| WP08-A32 | Operator (`operator-1`) | OP-05 and review, all text | Read association and eligibility words. | The words of §0.2 only, each with text (no colour-only state). An unknown status shows "Unavailable". | L+T | AC-06; D7 |
| WP08-A33 | Phone user, operator | Association review at 390 px | Open the review. Confirm with an error. | Evidence (document, extracted facts, candidates, contradictions) first, then the decision; the review copy link reachable; checkboxes at least 24 × 24 px; no horizontal page scroll. | L | PL OP-05 (Mobile: evidence then decision); AC-04, AC-10 |
| WP08-A34 | `syn-ta-1`; `syn-ta-2` | TA pages of B during the review | Read TA-07 and TA-10. | The TA sees no candidate, no other applicant, no extracted facts of the document and no incident text; only the not-available copy with a safe reason. | L | BS B10, B13; UX §4.4 |

### 2.3 OP-06 Send result

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP08-A35 | Operator (`operator-1`) | OP-06 of A after A16 | Open "Send result" from OP-02 or OP-05. Read the page. | Full-page review. `h1` "Send result: [applicant]". Identity band. "Recipient: the travel agent's account email" as text, not an input; the address itself only when a read returns it (no operator read does today: the row reads "The travel agent's current account email (the address is not shown on this page yet)" and the item is partly met, Q-02). Files table (header cells): file (type), version (as the read identifies it; no version number is returned today, Q-02), "Available now" ("Yes" or "No: [reason in words]") per file from the read. "Notice to the travel agent": the web notice requirement as Core states it, or "Not shown by this read" (the operator's delivery read returns only the operator's own notices, Q-02). "Earlier sends and downloads" (CMP-18) with every email send and retrieval the read returns. Freshness "Read at [time] IST". | L | UX §5.3 (Send result); PL §3.3 OP-06, §5.3, §6.3 (Send preview); BS B12, B31 |
| WP08-A36 | Operator (`operator-1`); test | OP-06 of A, send region; the operator case page and OP-01 next-owner labels of A | Read the send region and A's next-owner label. Inspect the page source. | The send region shows the boundary as Core reports it (`delivery_send_trigger_unselected` in the read's `unavailable`), in the LD-04 form: the result send is the assigned operator's explicit step; it is not available in this release; results are not emailed automatically. Draft: "Send result is not available in this release. Sending the result is the assigned operator's step; TravelMudra does not email results automatically." No usable send control (a visible disabled control, if any, names the reason with `aria-describedby`). The next-owner label for the pending reason `delivery_send_trigger_unselected` names the assigned operator and the step with "not available in this release", never "Owner not yet decided". No text contains "not decided", "not-yet-decided", "not selected", "unselected", "no owner yet", "who starts", "product owner", "decides" or "B46". A test greps the rendered OP-06, OP-02 and OP-01 for these phrases. Today's texts (`DLV_MESSAGES`, presentation owner label) fail. | L+T | LD-04; DECISIONS §1.2, §1.3 (OC-01); CC §5.5; UX §10.1 |
| WP08-A37 | Harness as `operator-1` | OP-06 action `/ops/applications/:id/document-email` | Post the boundary route by hand. | Core's boundary refusal shows on the re-rendered page in the A36 words; nothing is queued; no email send appears; the status page of the key reads "Nothing is recorded for request [reference] so far". No form on any page posts this route. | L+T | CC §5.5 (`ops.delivery.document_email`); BS B35; W1 A-08 |
| WP08-A38 | Operator | OP-06 of A | Read the text near the files. | The availability column is labelled as the check made when the page was read: "TravelMudra checks each file again at the moment it is sent or downloaded. A file can stop being available after this page was read." No text says that a listed file will be sent or that the travel agent has it. | L | BS B12 (check at each send; accepted interval, no send lock); UX §5.3; WP-06 D-05 lesson |
| WP08-A39 | Operator; test | OP-06 of B while its incident is open; OP-06 with `applicationBlocked` (fixture) | Read the files. | B's file: "No: an open incident about this file stops its release while it is handled." (or Core's reason text). Application blocked: one line "An open incident on this application stops every release while TravelMudra handles it." with the owner. No other file is offered in place of the blocked one. | L (B) + T | `incident_block`, `incident_block_application`; BS B12, B13 |
| WP08-A40 | Operator (`operator-1`) | OP-06 of A after A24 | Read the files. | R-A: "No: replaced by version [n]" or Core's reason; R-A2 shows its own availability. R-A is never offered as the file to send. | L | BS B12, B13; `version_not_eligible`, `artifact_not_eligible` |
| WP08-A41 | Test | OP-06 when the TA's account email changed or the account became inactive after an earlier read (fixtures) | Render the page again. | The recipient row shows the current address from the read at this load (or "Unavailable", Q-02); the page keeps no address from an earlier load. An inactive recipient account shows the reason in words. A stale page that posts is refused by Core (no form posts the send today). | T | UX §12 V14; BS B09, B31 ("owning TA's current account email") |
| WP08-A42 | Operator; test | OP-06 "Earlier sends and downloads", with email sends in every state (fixtures; on `lane-ui` only a harness-queued synthetic send) | Read each row. | Each send: files (versions), state in the words of §0.2, queued time and result time in IST. `synthetic_accepted` reads "Sent to the test mailbox" and never implies a real mailbox. `denied_at_check` names the file and its reason. No "Received", "Delivered" or "Opened". Retrievals: channel, version, time, result in words; staff identities as the read returns them. | T (L when the harness can queue a send on `lane-ui`) | `EMAIL_SEND_STATES`; `RELEASE_RESULTS`; BS B31; UX §3.3 ("acceptance of a send command is not proof of email success") |
| WP08-A43 | Operator; test | OP-06 with an uncertain send (fixture) | Read the row and the boundary. | "Email delivery is uncertain. No automatic resend will occur." with the attempt time and the evidence the read returns. No resend control for the uncertain send. The boundary `uncertain_email_handling_unselected` shows as Core reports it in the LD-04 form (investigation is not available in this release); it MUST NOT say that the handling is not decided (OD §4 decided it, DECISIONS §1.3 OC-03). Today's text (`pages.ts:124`) fails. | T | UX §5.3 (Uncertain email), §8.2, §8.3; BS B31; DECISIONS §1.3; Q-04 |
| WP08-A44 | Operator (`operator-1`); harness; test | OP-06 with a failed send (fixture; on `lane-ui` only when the orchestrator provides a labelled harness send that fails) | Read the failed row. Select "Resend", give a reason, confirm. Then try again. Harness: post a resend of an accepted send and of an uncertain send; post one with a reason shorter than Core accepts. | "Resend" shows only on a failed send where Core's `resendOffer` allows it. Its review text: a new, attributed send; every file is checked again; the recipient is the travel agent's current account email. Reason field (required). Accepted: a new send row "Resend of [earlier send]" (Current). A second resend of the same failed send: "This failed send was already resent once." Accepted send: "Only a send that failed can be resent." Uncertain send: refused as Core answers (the LD-04 wording of A43). Short reason: "Give a reason of at least ten characters." When no real mail provider is selected for the installation, Core's refusal shows in words. Nothing is recorded for a refusal. | T (L when available) | `dlv.manual_resend`; `resend_source_not_failed`, `resend_exists`, `real_mail_transport_unselected`; UX §5.3; BS B31; OD §4; Q-01 |
| WP08-A45 | Operator (`operator-1`) | OP-06 of A, "Record a manual email (not system-verified)" | Read the form. Fill it: the recipient address as sent, the date, the files (R-A), evidence `SYN-V08-[stamp]-A-MAIL`. Send. Then send it again with another recipient address (harness or a typed address). | Fields with labels: recipient address, date of the email (IST), files (1 to 10, from the application's documents), evidence (1 to 5). The label and the review text say that the record is the operator's statement; that TravelMudra did not send or check the email; that it is not system-verified; that it does not count as TravelMudra's delivery and does not meet the delivery prerequisite of completion; and that an email to any other address is a wrong-recipient incident, not this record. Accepted: the handovers list shows "Manual email recorded by [operator]. Not verified by TravelMudra." with event and recorded times in IST; it never appears as an email send or as "Sent". Another address: refused on the field, "This is not the travel agent's current account email." (`recipient_not_owning_ta`); nothing recorded. | L | `dlv.record_manual_email`; `HANDOVER_KINDS` (`manual_operator_email`, `systemVerified`); BS B24 ("not claimed system-verified"); PL §5.3 OP-06; Q-01 |
| WP08-A46 | Operator; harness | OP-06 manual email and resend, the Nth time | Replay terms 1 to 6 on A45 (and on A44 by test). Send A45 with a required field empty first (term 5). | (1), (2): one record; the same receipt. (3): refused as a used form; nothing recorded. (4): Back reloads OP-06; a new send of the same statement is a new record only if Core allows it (Core's duplicate rule decides; the page adds none). (5): C1 in words; the corrected send is recorded once. (6): C4; no new send offered. | L+T | PL §7 K-STD, K-EXT; BS B35 |
| WP08-A47 | Operator | OP-06 carried forms | For an application where Core offers them: build or release a packet, record a handover, record a direct external delivery. | Each carried form keeps its markup, fields, action and redirect and works as before (WP-10 rebuilds them). | L+T | LD-02; A118 |
| WP08-A48 | SuperAdmin (`superadmin-1`) | Admin case page and the admin delivery view of A; an application with an outcome and no operator (fixture) | Look for send and delivery-ownership controls. | No "Send result", "Resend", "Take delivery ownership" or "Record a manual email" control for a SuperAdmin (the read's `offers` are null for a SuperAdmin). For the application without an operator, the page names the route "Assign an operator" (SA-03) as the way the delivery duty gets an owner. | L (A) + T | UX §2.3 (Send result row), §3.1 step 8, §12 V15; DECISIONS §1.3 OC-04; Q-09 |
| WP08-A49 | Phone user, operator | OP-06 at 390 px | Open the page. | Recipient first, then files as cards (file, type, version, available now), then the boundary, then earlier sends as cards. When the delivery read fails (fixture): S7 with "Try again", never an empty files list. No horizontal page scroll. | L (+T for S7) | PL OP-06 (Mobile) |
| WP08-A50 | `operator-2`; `syn-ta-1` | OP-06 and OP-07 addresses of A | Open the addresses. | `operator-2`: SH-02 identical to not found; no file names, recipient or attempts. The TA's own delivery page shows only the TA's own retrievals and no staff identities (A74). | L | BS B10; `dlv.delivery_page` ("retrievals are the viewer's own on the travel agent's page") |

### 2.4 OP-07 Request completion

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP08-A51 | Operator (`operator-1`) | OP-07 of A after A65 | Open "Request completion". Read the page. | `h1` "Request completion: [applicant]". Lifecycle and Outcome as separate rows. "What Core checks before completion": one row per prerequisite that the case read returns, in Core's order, each "Met" or "Not met" with Core's reasons in words, and the evidence and owner where a read returns them (else "Owner: not shown by this read", Q-03). The list is labelled "As Core evaluated it when this page was read. Core checks again when completion is requested." No row is computed by the page. | L | `zCompletion`; UX §5.3 (Request completion); PL §3.3 OP-07, §5.3; WP-06 D-04 lesson |
| WP08-A52 | Operator; test | OP-07 of A; fixture with an open financial follow-up and an open operational incident | Read the sections. | A separate section "Continuing duties (they do not stop completion)" lists the open financial follow-up and the open operational incident, each with its owner, from the reads that return them, labelled as current and possibly incomplete; or "Unavailable" (Q-03). An artifact block and a failed mandatory validation show as prerequisites, never as continuing duties. | L+T | UX §3.2 (completed case with continuing duty), §5.3; BS B24 ("an open operational incident alone does not hold completion, but an artifact block/failed validation still applies") |
| WP08-A53 | Operator (`operator-1`); test | OP-07 of A, request region; the operator and SuperAdmin case page callout | Read the region and the case page. Inspect the page source. | The boundary as Core reports it (`completion_check_trigger_unselected`), in the LD-04 form. Draft: "Request completion is not available in this release. Requesting completion is the assigned operator's step; TravelMudra never completes an application automatically." No usable control. The case page callout (today "Completion check: trigger and owner unselected") follows the same form. No text contains "not decided", "not-yet-decided", "not selected", "unselected", "who starts", "product owner", "decides" or "B46". A test greps the rendered OP-07 and case pages. Today's texts fail. | L+T | LD-04; DECISIONS §1.3 (OC-02, OC-05); CC CC-07 |
| WP08-A54 | Harness as `superadmin-1`; test | Route `admin.delivery.completion_check` | Post the route by hand. Search every rendered staff page for a form that posts it. | Core's boundary refusal; nothing is recorded; the lifecycle does not change. No page renders a form that posts the route (unit test over the route inventory and the page markup). | T (L for the hand-made post) | CC §5.5, CC-07; OD §3 |
| WP08-A55 | SuperAdmin (`superadmin-1`) | SA-01, SA-02, SA-04 (admin case page), the admin delivery view, OP-07 address | Look for completion controls. | No "Request completion", "Run the completion check", "Complete", "Force complete" or "Close the application" control on any SuperAdmin page. The admin delivery view, if it stays, shows the completion state read only. A SuperAdmin opening the OP-07 address gets SH-02 or a read-only view, never a control. | L | UX §2.3 (Request completion row), §10.1; DECISIONS §1.3 OC-05; BS B24 |
| WP08-A56 | Operator (`operator-1`); `syn-ta-1` | OP-07 of A before and after the TA's download and after A45 (§3 V17) | Read the delivery prerequisite before A65, after it, and after the manual email record. | Each time the delivery prerequisite stays "Not met" with Core's reason; the page says "A download by the travel agent or a manual email record does not meet this: a TravelMudra-held electronic result needs the document email to the travel agent and the web notice." No change of lifecycle. | L | UX §12 V17; BS B24 ("a TA download does not"; manual email "not claimed system-verified") |
| WP08-A57 | Test | OP-07 when every prerequisite is met and no completion was requested (fixture) | Render the page. | Every row "Met"; the lifecycle stays as Core reports it (not completed); the page says that completion needs the explicit request, which is not available in this release; no "Completed" claim and no automatic completion text. | T | UX §3.1 step 9, §12 V17 ("last prerequisite never auto-completes"); OD §3 |
| WP08-A58 | Test | OP-07 and TA-07 of a completed application with a continuing duty (fixture) | Render both. | "Processing completed." as the lifecycle fact; the outcome on its own row; continuing duties listed with owners; no "success" wording; no completion control. TA-07: "Processing completed. Financial follow-up remains open." | T | UX §3.2, §8.2; BS B21, B24 |
| WP08-A59 | Operator (`operator-1`) | OP-07 of D (refused, no document) | Read the prerequisites. | Core's rows for D, as returned; the artifact and delivery rows read as Core evaluates them for a refused outcome; the page adds no prerequisite of its own. | L | `zCompletion`; BS B24 |
| WP08-A60 | Test | OP-07 of an application whose filing may have occurred (`no_possible_filing` not met; fixture) | Render the page. | "Filing may have happened: the evidence is being reconciled" with the owner the read gives; never "not filed"; no completion claim. | T | BS B23; UX §3.2 (Unknown external execution) |
| WP08-A61 | Phone user, operator | OP-07 at 390 px | Open the page. | Prerequisites as a stacked list (text state per row), then continuing duties, then the boundary. No horizontal page scroll. | L | PL OP-07 (Mobile) |
| WP08-A62 | Test | OP-07 when the case read or a continuing-duty read is unavailable (fixtures) | Render the page. | The unreadable block shows "Unavailable"; no row shows "Met" or "None" for an unreadable value; the page renders; an access refusal goes to the shell (A116). | T | D7; LD-14 |

### 2.5 TA-07 Outcome, delivery rows and result download

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP08-A63 | TA (`syn-ta-1`) | TA-07 of A after A16 | Read the status facts. | Separate rows: Progress, Lifecycle, Outcome ("Issued"), Delivery. "Completed" appears only as a lifecycle fact. No combined badge, no "Approved" or "Done". | L | UX §2.2; PL §1.2 D4; BS B21 |
| WP08-A64 | TA (`syn-ta-1`) | TA-07 of A, section "Result and delivery" | Read the section. | Result files: each with type and version and either "Download" (available now, per the read) or the reason in words. Delivery facts as separate labelled rows, each with its time in IST and only when the read returns it: Email (words of §0.2), Web notice ("Posted [time] IST"), Your downloads ("Sent in full to your download", "Interrupted", "Refused: [reason]"), Acknowledged. No "Received", "Delivered" or "Opened". | L | UX §2.2 (Delivery), §4.1; PL §5.2 TA-07; BS B31 |
| WP08-A65 | TA (`syn-ta-1`) | TA-07 of A | Select "Download your result" (or the file's download control). | The file R-A streams in full. The download is available as an ordinary action under its preconditions; no B46 notice or "release event" boundary is shown (LD-05). Current: a retrieval row "Sent in full to your download", version 1, [time] IST. | L | LD-05; DECISIONS §1.5; PL §5.2 TA-07 (Download result); BS B12, B31 |
| WP08-A66 | TA (`syn-ta-1`); operator; test | TA-07 of A, the download control of an earlier page load | (1) Load TA-07 and keep it. (2) The operator replaces R-A with R-A2 (A24). (3) From the kept page, download R-A. (4) Test: an incident blocks the file between page load and download; the TA account is inactive at the check. | (3): refused with the reason in words (the version is no longer released); no byte; no other file is streamed in its place; the refusal is recorded as a refused retrieval and shows in "Your downloads". (4): refused with "An open incident about this file stops its release while it is handled." and with the account reason; no byte. Each download checks eligibility again at that moment. | L ((1) to (3)) + T ((4)) | BS B12 ("a block/revocation/replacement effective at that check denies bytes"); PL §7 K-BYTE; UX §8.3 |
| WP08-A67 | TA (`syn-ta-1`); harness | TA-07 of A, the Nth download | Download, then: (a) double-click "Download"; (b) the harness replays the accepted download with the same `_op`; (c) lost acknowledgement of a download (fixture). | (a), (b): no second stream from a stored result: the page shows "This download form was already used. Its result is listed under the downloads below. Start a new download to check the file again." A new download is a new check and a new retrieval record. (c): C4 with "Check status"; no automatic new download. | L+T | `duplicate_operation`; PL §7 K-BYTE (RF-09) |
| WP08-A68 | TA (`syn-ta-1`) | TA-07 of C (issued, no document) | Read the page. | "Outcome: Issued. The result document is not available yet. TravelMudra is resolving [safe reason]." No download control. No "Refused", "Rejected" or "Failed" wording for the outcome. The action panel names TravelMudra as the owner. | L | UX §4.4; PL §3.2 TA-07 (issued with artifact missing); V13 |
| WP08-A69 | TA (`syn-ta-1`) | TA-07 of B while its association is under review (A17) | Read the page. | As A68 with the safe reason "the result document is being checked"; no candidate, no incident text, no other application. After A20: the download shows (Current on reload). | L | UX §4.4; BS B10, B13 |
| WP08-A70 | Test | TA-07 with an uncertain email send (fixture; the TA read gives the fact only if it carries it, CC: WP-19) | Render the page. | "The email result is not confirmed. TravelMudra is checking the send attempt." No resend request control; no invitation to ask again. When the TA read carries no email fact, the row is absent and the item is deferred to WP-19. | T | UX §4.4; BS B31; WP-03 design §3.4 (delivery uncertainty: WP-19) |
| WP08-A71 | Test | TA-07 of a completed application with an open financial follow-up (fixture) | Render the page. | "Processing completed. Financial follow-up remains open." Outcome on its own row. | T | UX §3.2, §8.2 |
| WP08-A72 | Test (L when a preparation-only case exists on `lane-ui`) | TA-07 of a preparation-only application with a released packet (fixture) | Download the packet. Replay with the same key. | "Download your packet" under its preconditions; the stream is a recorded retrieval; a same-key replay streams nothing stored (A67). Packet release and handover forms stay with WP-10. | T | LD-05; `ta.delivery.packet_retrieve`; DECISIONS §1.5 (OC-09) |
| WP08-A73 | TA (`syn-ta-1`) | TA-07 action panel of A, B and C; TA-01 "Needs your action" | Read the next action. | The action panel follows the WP-03 mapping: a notice that needs acknowledgement first ("Open the notice"), then a download ("Download your result"). C and B under review: owner TravelMudra, no action. TA-01 lists A with "Download your result" while a download is available (`dlv.delivery_facts`). | L | WP-03 design §3.2; PL CMP-01 |
| WP08-A74 | TA (`syn-ta-1`) | `/ta/applications/:id/delivery` of A | Open the delivery detail from TA-07. | The page follows A64 to A67 (or redirects to the TA-07 section, as the design names). It lists only the TA's own downloads; no staff names, account ids or other recipients. Breadcrumb and Back return to TA-07. | L | `dlv.delivery_page` (TA surface); LD-03 |
| WP08-A75 | TA (`syn-ta-2`) | TA-07, delivery detail, download actions, selection page of A | Open the addresses. Harness: post a download of R-A with `syn-ta-2`'s session. | SH-02 identical to not found for each; no file name, version or outcome; no byte; nothing about A is recorded under `syn-ta-2`. | L | BS B10, B12; PL §2.3 SH-R02 |
| WP08-A76 | Test | TA download when the session is revoked or the account suspended between the page read and the download (HTTP test) | Post the download. | No byte; the sign-in or access page; the old page content is not kept (WP-01 A-01, A-02). | T | BS B10 ("revocation… take effect on old links"); LD-14 |
| WP08-A77 | Screen-reader user, TA | TA-07 result files | Read the download controls. | Each control has a unique accessible name: "Download [type], version [n], [applicant]". A refused file's reason is in reading order next to it. | L | AC-13, AC-15 |
| WP08-A78 | Phone user, TA | TA-07 of A at 390 px | Read the section. Download. | Result files and delivery facts stacked as labelled rows; the download control at least 44 × 44 px; no horizontal page scroll. | L | AC-04, AC-10; PL TA-07 (Mobile) |
| WP08-A152 | TA (`syn-ta-1`); test | TA-07 of A after the outcome: closing section, next-owner label; TA-06 and TA-01 rows of A | Read the closing section and the next owner. Inspect the page source. | The closing section lists Core's completion requirements for the TA as facts and says, in the LD-04 form, that sending the result by email and requesting completion are TravelMudra's operator's steps that are not available in this release, and that the result can be downloaded now (when it can). Today's callout "Some closing steps have no owner yet" and the text "Who sends your result to you is not decided in this release… Who starts the completion check is not decided either." fail. No TA page contains "not decided", "no owner yet", "Owner not yet decided", "who starts", "product owner" or "B46"; a test greps TA-07, TA-06 and TA-01. | L+T | LD-04; DECISIONS §1.3; UX §4.4 |

### 2.6 Download of several files

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP08-A79 | TA (`syn-ta-1`) | TA-07 of A after V14-4 (R-A2 matched) and the TA delivery detail | Select files with their checkboxes. Read the selection line. Select "Download selected files". | The selection shows when two or more files can be downloaded (today's rule; the design may keep it). Each checkbox is labelled with the file, version and applicant. The line reads "Selected: [n] files". No control selects files that are not shown. The download opens "Download of several files" for exactly the selected files. | L | CC CC-10; PL CMP-26; UX §3.3 (bulk selection shows exactly what was selected) |
| WP08-A80 | TA; harness | TA-07 selection | Send with no file selected. Harness: send more items than Core accepts. | No file: C1 "Choose at least one file." Too many: "Too many files were selected at once. Select fewer files." (no limit number unless a read gives it). Nothing is streamed or recorded. | L+T | `selection_too_large`; `zWireSelectionItems` (1 to 500); WP-01 Q-13 |
| WP08-A81 | TA (`syn-ta-1`) | `/ta/selections/:selectionId` | Read the page after A79. | `h1` "Download of several files". Created time (IST); number of items; state: "Running" (no outcome yet), "Finished" (`complete`) or "Stopped before the end" (`aborted`). One row per item, from the read (item number, application, file), with the result: "Included", "Not available: [reason]", "Failed: [reason]", or "Waiting" while it runs. No "Received". Freshness "Read at [time] IST". | L | `dlv.selection`; `SELECTION_ITEM_RESULTS`, `SELECTION_OUTCOMES`; BS B12 ("per-selection included/unavailable/failed") |
| WP08-A82 | TA (`syn-ta-1`) | Selection of R-A (replaced, A24) and R-A2 | Select a file whose version became unavailable after the page load and one that is available. Download. | The available file is "Included"; the other is "Not available: [reason]" on its own row. No file is substituted. The archive holds only included files. | L | BS B12; UX §12 V14 ("unavailable selections remain individually reported") |
| WP08-A83 | TA; harness | Selection, the Nth time | Double-click; harness replays the accepted selection with the same `_op`; lost acknowledgement (fixture). | No second stream from a stored result; the original selection page; a new selection is a new check. C4 on a lost acknowledgement. | L+T | PL §7 K-BYTE; `duplicate_operation` |
| WP08-A84 | Harness as `syn-ta-1` | `POST /ta/selections` | Include, with two own files, one item of `syn-ta-2`'s application. | The whole request is refused as not found, without any fact of the other application; nothing is streamed and nothing is recorded (Core authorizes every item before the check). | L+T | BS B10, B12; `dlv.retrieve_selection` (per-item authorization first) |
| WP08-A85 | Test | Selection page of an aborted stream (fixture) | Render the page. | "Stopped before the end"; the items after the stop read "The download stopped before this file."; the included items before it stay "Included". | T | `selection_aborted`, `stream_failed` |
| WP08-A86 | TA (`syn-ta-2`) | `/ta/selections/:selectionId` of `syn-ta-1` | Open the address. | SH-02 identical to not found. | L | BS B10 |
| WP08-A87 | Phone user, TA | Selection page at 390 px | Open the page. | Items as cards with the result first after the file name; no horizontal page scroll. | L | AC-04, AC-21 |
| WP08-A88 | Screen-reader user, TA | Selection checkboxes and page | Change the selection; open the page. | A selection change announces "Selected: [n] files" without moving focus. The results table has header cells. | L | AC-09, AC-15, AC-16 |

### 2.7 TA-10 Notices

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP08-A89 | TA (`syn-ta-1`) | TA-10 `/ta/notices` (rail "Notices") | Read the page. Set the filter "Needs your acknowledgement", reload, press Back, clear it. Put an unknown filter value into the address. | `h1` "Notices". Rows newest first: kind in words, application (link, from the notice's application), posted time (IST), and "Needs your acknowledgement" or "Acknowledged [time] IST" only for a notice that asks for an acknowledgement. No "Unread", "New", "Read", "Mark as read" or bold-unread styling. The filter is an enumerated address value applied to the rows the read returns (at most 200; the page says so when the list is full, A96): reload keeps it, Back restores the previous view, a change announces the result count (AC-16); an unknown value is ignored. Freshness "Read at [time] IST". | L | LD-06; UX §4.2 (Notices); PL CMP-21; `dlv.notices` |
| WP08-A90 | TA (`syn-ta-1`) | Notice detail of a notice that asks for an acknowledgement (fixture or one posted on `lane-ui`) | Open the notice. | The text by kind, the application link, the posted time, and "Acknowledge" with a review sentence that says what acknowledging records (that the TA has seen the decision; it accepts or declines nothing unless the notice says so). A notice that asks for no acknowledgement has no button. | L (+T for kinds not on `lane-ui`) | UX §4.2 ("acknowledge only when a TA decision requires it"); PL §5.2 TA-10 |
| WP08-A91 | TA (`syn-ta-1`) | Notice detail | Select "Acknowledge". | C3: the receipt follows A111. "Acknowledged [time] IST" (Current) on the notice, on TA-10 and on TA-07. The TA-07 action panel no longer leads with "Open the notice" for it. | L | `dlv.acknowledge_notice`; BS B31 (acknowledgement is its own fact) |
| WP08-A92 | Harness as `syn-ta-1`; TA, two tabs | Acknowledge action | (1) Post an acknowledgement of a notice that asks for none. (2) Acknowledge in tab 2, then in tab 1. (3) Post with an older revision. | (1) "This notice does not ask for an acknowledgement." (2) "This notice was already acknowledged." with the current state. (3) C5 or Core's stale refusal in words. Nothing is recorded for any of them. | L+T | `ack_not_required`, `already_acknowledged`, `stale_revision` |
| WP08-A93 | TA; harness | Acknowledge, the Nth time | Replay terms 1 to 6 on A91. | (1), (2): one acknowledgement; the same receipt. (3): refused as a used form. (4): the reloaded notice shows "Acknowledged" and no button. (6): C4. | L+T | PL §7 K-STD; BS B35 |
| WP08-A94 | TA (`syn-ta-1`) | TA-10 after the result of A became available (when Core posts a `result_available` notice) | Open the notice. | The notice links to the result section of TA-07; it does not say that an email arrived or that the TA received the file. When Core posts no such notice on `lane-ui`, the item is shown by test. | L (or T) | `NOTICE_KINDS`; BS B31 ("sending, notification, retrieval and TA acknowledgement are different facts") |
| WP08-A95 | TA; test | TA-10 with no notice; with a filter that matches none | Render the page. | S2 "No notices yet." S3 "No notice matches this filter." with "Clear the filter". Neither shows "0" for an unreadable list. | L (or T) | PL §1.3 S2, S3 |
| WP08-A96 | Test | TA-10 when the read returns its row limit, and when it fails | Render the page. | Row limit: "This list shows the [n] most recent notices." with no total. Read failure: S7 with "Try again", never S2. | T | D7; PL §1.3 S7 |
| WP08-A97 | TA (`syn-ta-2`); test | Notice address of `syn-ta-1`; TA-10 with access revoked between reads | Open the address. | SH-02 identical to not found. HTTP test: the access page, not the earlier list (LD-14). | L+T | BS B10; LD-14 |
| WP08-A98 | Phone user, TA | TA-10 at 390 px | Read the list. Acknowledge. | Notice cards: kind, application, time and acknowledgement fact first; button at least 44 × 44 px; no horizontal page scroll. | L | PL TA-10 (Mobile) |
| WP08-A99 | TA (`syn-ta-1`) | TA-01 blocks "Travel-date notices" and "Recent results and closures" | Read the blocks. | The same acknowledgement words as TA-10; no read marker; links to TA-10 and to the application. | L | WP-03 design §2.1; LD-06 |
| WP08-A100 | Test | Notice text map | Check the map against `NOTICE_KINDS`. | Each of the 11 kinds has TA text; an unknown kind shows its code with a plain sentence (UAT-13 pattern). | T | CR-01; `NOTICE_KINDS` |

### 2.8 TA history page

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP08-A101 | TA (`syn-ta-1`) | `/ta/applications/:id/history` of A (aside "History" on TA-07) | Read the page. | Rebuilt page (Q-W03-15). Breadcrumb to the application. `h1` "History: [applicant]". An ordered list (CMP-09), newest first: each entry in words with its recorded time labelled "Recorded [time] IST". The read returns no event time and no actor: the page shows neither and claims neither (deferred, Q-10). Corrections show as added entries, never as edits. Freshness in the lag form (`views.ta_history` is a projection); an unhealthy projection reads "This history may be incomplete" with the lag form. | L | PL CMP-09; UX §2.3 (History), §7.4 (Timeline); LD-08 |
| WP08-A102 | TA (`syn-ta-1`); test | History of A and B | Read the entries. | Only the entries the TA read returns: no internal note, no incident detail, no candidate of an association review, no SuperAdmin audit entry. | L+T | BS B10 ("full audit history is SuperAdmin-only") |
| WP08-A103 | TA (`syn-ta-1`) | History of A after §3 | Read the delivery entries. | The outcome and each download show as separate entries as the read returns them (a download: "Sent in full to your download. Whether your browser got the whole file cannot be known." or "Interrupted"). No entry says "Received" or "Delivered". Acknowledgements and manual email records are not history entries today; the page does not invent them. | L | BS B31; `views.ta_history` |
| WP08-A104 | Test | History empty; at its row limit (1000 entries); projection lag unavailable; read failure | Render the page. | Empty: "No history entries yet." Row limit: "This history shows the first 1000 entries." with no total. Lag unavailable: "Freshness unavailable". Failure: S7 with "Try again". | T | D7; LD-08; PL §1.3 |
| WP08-A105 | TA (`syn-ta-2`) | History address of A | Open it. | SH-02 identical to not found. | L | BS B10 |
| WP08-A106 | Phone user, TA | History at 390 px; long names (fixture) | Read the page. | One column; times wrap; long actor and applicant names wrap without hiding identity; no horizontal page scroll. | L | AC-04, AC-20 |
| WP08-A107 | TA (`syn-ta-1`) | TA-07 → History → back | Use the breadcrumb, then open History again and press Back. | Both return to TA-07 at the same address. | L | PL §2.3 SH-R07; W1 A-02 |

### 2.9 Command results, access and shell on WP-08 pages

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP08-A108 | Operator; TA | Every WP-08 page | Read the shell. | Environment label; "[TEST]" title prefix; rail current item ("My work" or "Applications" for OP pages, "Notices" for TA-10, "Applications" for TA-07, the selection page and history); breadcrumb; one `h1`; freshness where the page shows read facts. | L | PL §2.1, §2.2; WP01-A07 |
| WP08-A109 | Operator; TA | Operator case page OP-02 tab "Delivery & originals"; TA-07 | Follow the links to OP-05, OP-06, OP-07, TA-10, history, selection. | Each link opens its page; each page links back; Back returns to the same address. | L | PL §3.3 OP-02, §3.2 TA-07 |
| WP08-A110 | — | Page code | Inspect the WP-08 pages. | No page computes a permission, an eligibility, a prerequisite state or an association state; each comes from a read or from Core's refusal. | T (review) | PL §6; BS B33, B35 |
| WP08-A111 | Operator; TA; harness | Every accepted WP-08 command; edited receipt addresses | Read each receipt. Open edited receipt addresses (a confirm operation with a `done` of reject; an official-result operation with a `done` of cancelled; the key of another application's operation). | A receipt names the command only when the operation's resource, the returned id and the summary establish it; otherwise "Request recorded" with the request reference and the current state labelled "Current" (WP-06 D-02). This governs every receipt title quoted in this checklist (A04, A15, A20, A22, A26, A44, A45, A91). An edited address never shows the wrong command's title; another application's key: "Request reference [key]. The receipt cannot be checked now." No accepted time (P-02). | L+T | WP-06 D-02; W1 A-04; W2 B-02; W3 C-03 |
| WP08-A112 | Operator; TA | Each command of §1.2 with a lost acknowledgement (fixture); a refused send | Inject the fault. Open the operation status page. Select "Check status" after the original resolves. Open the status page of a refused send's key. | C4 (CMP-13): "Checking the original result" and "Check status"; no new send of the same intent there. A refused send leaves no operation record: "Nothing is recorded for request [reference] so far". A refusal shows only on the re-rendered form. | T | PL §1.1 UNR; BS B35; W1 A-08 |
| WP08-A113 | Harness | Each command of §1.2 (rows 1 to 6 and the moved commands) | (1) Identical replay after acceptance. (2) Same key, different content. (3) Business duplicate: a new key and the current revision for an intent Core already holds. (4) Raw stale envelope: a new key with an older revision. (5) Raw resend of a refused envelope after the facts changed. | (1) The original result. (2) Refused as a conflict; nothing recorded. (3) The command's own check answers: second outcome refused; second confirm or reject of a decided association refused; acknowledgement "already acknowledged"; resend "already resent once". (4) Stale refusal: CMP-14 with current facts; not the business check. (5) Core evaluates again (the refused key has no record). A duplicate test uses (3), never (4) or (5). Browser Back is not a replay. | T | WP-06 D-12; PL §7 K-STD; BS B35 |
| WP08-A114 | Operator; TA | Every refusal reachable on `lane-ui` in A01 to A107 | Read each message. | CMP-07 with the reason in words and the owner or route where one exists. Never a code alone; where a text is missing, the code with a plain sentence (UAT-13). No "Something went wrong" or "Invalid data". | L | PL §1.1 REJ, §11.1; CR-01 |
| WP08-A115 | — | Text map of every reason code that WP-08 pages can show | Check the map. | Each code has text in the role's words or falls back to the code: the OP-05 codes of the commands in §1.2 (named at the design review), `outcome_already_recorded`, and the delivery codes `bytes_unavailable`, `version_not_processed`, `version_not_eligible`, `association_not_positive`, `artifact_not_eligible`, `packet_not_released`, `packet_superseded`, `packet_constituent_unavailable`, `incident_block`, `incident_block_application`, `capacity_streams`, `duplicate_operation`, `selection_too_large`, `selection_aborted`, `stream_failed`, `recipient_inactive_selection`, `ack_not_required`, `already_acknowledged`, `stale_revision`, `resend_source_not_failed`, `resend_exists`, `real_mail_transport_unselected`, `operation_key_reused`, `recipient_not_owning_ta`, `version_replaced`, `version_blocked`, `review_channel_not_applicable`, `recipient_access_revoked`, `protection_mark_active`; the OP-05 codes `service_mode_not_applicable`, `act_evidence_insufficient`, `filing_not_evidenced`, `application_not_submitted`, `cancellation_undeclared`, `filing_possibly_occurred`, `incident_not_open`, `artifact_cross_group`, `artifact_type_already_eligible`; and the field codes that have no text today: `evidence_kind_unknown`, `evidence_version_not_usable`, `instant_invalid`, `instant_in_future`, `artifact_type_undeclared`, `not_a_candidate`, `all_fields_required`, `not_operator_openable`, `required`. A failed review copy shows its reason in words, not the generic error page. The texts of `delivery_send_trigger_unselected`, `completion_check_trigger_unselected` and `uncertain_email_handling_unselected` meet LD-04 (A36, A43, A53). | T | CR-01; `DLV_MESSAGES`; LD-04 |
| WP08-A116 | Operator; TA | OP-05, OP-06, OP-07, TA-07, TA-10, selection page, history (HTTP tests with access revoked between the first read and an optional read) | Let an optional read answer an access, authentication, maintenance or support-view refusal. | The access page (SH-02, sign-in or maintenance), never the facts read earlier. Only an availability failure degrades a block to "Unavailable" (for example "Delivery: unavailable now" on TA-07). No page code catches every error around a read. | T | LD-14 (C-02); PL §2.3 SH-R04 |
| WP08-A117 | Operator; TA | Every WP-08 page | Read all visible text. | No forbidden label of §11.1 ("Approved" or "Done" as an overall status, "Ready", "Override", "Force complete", "Accept anyway", "Mark verified", "AI verified"). No "Accept best match", "Received", "Delivered", "Unread", "Mark as read". Times carry IST. Counts name their unit. Synthetic offerings carry the synthetic label. | L | PL §11.1; CR-03, CR-06, CR-07, CR-08 |
| WP08-A118 | Operator; TA | Rebuilt pages and the old pages they replace | For each carried form, open an application where Core offers it: packet build and release, handover, direct external (WP-10); disclosure report, incident evidence, resolve, close, reviewer assignment (WP-14); timing-notice acknowledgement on TA-07 and price decisions (WP-17). Check that the WP-08 forms left the old operator case page. | Each carried form keeps its markup, fields, action and success redirect and works as before. The old operator case page links to OP-05, OP-06 and OP-07 instead of hosting their forms. A unit test lists the carried forms by action path. | L+T | LD-02; LD-07; WP-03 Q-01; WP06-A110 |
| WP08-A119 | Operator; TA | OP-05, OP-06, TA-07, selection page | Inspect `localStorage`, `sessionStorage` and IndexedDB after use. Read the response headers of pages and downloads. | No applicant data, document facts or file bytes are kept in browser storage. Signed-in pages and every download send `no-store`. | L+T | PL §2.3 SH-R12; UX §3.3 |
| WP08-A120 | SuperAdmin in a support view of `syn-ta-1` (test) | TA-07, TA-10, selection page, history | Render the pages. Post a download and an acknowledgement. | Read-only pages with the support-view banner; no download or acknowledge control; each post is refused with the support-view refusal; no byte. | T | BS B10 ("support view… without impersonation or target actions"); PL CMP-22 |
| WP08-A121 | Operator; TA | Back after an access change (WP-01 A-02) | Sign out after using OP-06 or TA-07; press Back. | The sign-in page, never the private page from the back/forward cache. | T | WP-01 A-02 |

### 2.10 Accessibility (AC-01 to AC-28 that apply)

| ID | Persona | Page | Steps | Expected result | Where | Source |
|---|---|---|---|---|---|---|
| WP08-A122 | Keyboard-only operator and TA | §3 steps at 1440 px; V13-3 and V14-2 at 390 px | Use the keyboard only. | Every step works with Tab, Shift+Tab, Enter, Space and Escape: choose the outcome, add evidence rows, choose a file, download a review copy, tick attestations, confirm or reject, record a manual email, download, select files, acknowledge. No action needs a mouse, hover or drag-and-drop. | L | AC-01, AC-12 |
| WP08-A123 | Keyboard-only user | Every WP-08 page at 1440 and 390 px and at 400% zoom | Tab through the page. | Focus is visible (at least 3:1) and never hidden by the top bar, the rail or a selection line. | L | AC-02 |
| WP08-A124 | Phone user | Every WP-08 page | View at 320 px, and at 1280 px with 400% zoom. | No two-dimensional page scrolling. Wide tables scroll only inside a labelled region, or become cards. Identity, state, owner and next action come before secondary data. | L | AC-04, AC-21 |
| WP08-A125 | Any | Every WP-08 form | Inspect each input. | Each input has a visible label; evidence rows are labelled with the row number; attestation checkboxes name the compared fact; file selection checkboxes name file, version and applicant; required fields say so. | L | AC-05, AC-15 |
| WP08-A126 | Any | Outcome, association, eligibility, email, retrieval, selection and notice states | View in greyscale. | Each state has text. No state by colour alone. | L | AC-06 |
| WP08-A127 | Any | Every WP-08 form | Send each form with an error. | Focus moves to the error summary; each link moves to its field; entered values stay (a chosen file is named again if the browser cannot keep it). | L | AC-08; CMP-07 |
| WP08-A128 | Screen-reader user | Receipts, selection line, filter changes, download results | Read with VoiceOver or NVDA. | Receipts are announced politely without moving focus; a filter change announces "[n] notices shown"; a selection change announces "Selected: [n] files". | L | AC-09, AC-16 |
| WP08-A129 | Screen-reader user | Each unavailable action: send (A36), completion (A53), resend on a non-failed send, download of an unavailable file | Focus the control or the notice. | The reason is exposed (`aria-describedby`, or the notice in reading order). A role-forbidden action is not shown at all. | L | AC-13; CMP-10; PL §2.3 SH-R08 |
| WP08-A130 | Phone user | Every WP-08 page at 390 px | Measure each control. | Every control at least 24 × 24 CSS px; primary actions ("Record outcome", "Record a result document", "Confirm the association", "Reject the association", "Record a manual email", "Download your result", "Download selected files", "Acknowledge") at least 44 × 44 CSS px. | L+T | AC-10 |
| WP08-A131 | — | Every WP-08 page | Measure contrast of text, focus, status text and notices. | Normal text at least 4.5:1; non-text indicators and focus at least 3:1. | L+T | AC-11 |
| WP08-A132 | Any | Long names; reduced motion | Use an applicant with 60-character surname and given names, a 120-character file label and a long operator name (fixture or run data). Turn on "reduce motion". | Names wrap without hiding identity; truncated text has a full form that keyboard and touch reach; no transition plays. | L | AC-14, AC-20 |
| WP08-A133 | Screen-reader user | OP-05 documents, OP-06 files and attempts, OP-07 prerequisites, selection results, TA-10, history | Inspect tables and lists. | Header cells exist; a scrolling table is a labelled region; the history is an ordered list with labelled times. | L | AC-03, AC-15; AC-04 |
| WP08-A134 | TA (usability, not a pass condition) | TA-07 of A, B, C and D | Ask a first-time TA what the outcome is, whether processing is complete, and who acts next. | Record the answers and the sample size; confusion of outcome with completion is a finding. | L (observation) | AC-24, AC-26 |

### 2.11 axe checks (WCAG 2.2 A/AA)

Rule for every row: run axe (`@axe-core/playwright` 4.13.0, tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`,
`wcag22aa`) at 1440 × 900 and at 390 × 844. Expected: no violation of impact "serious" or "critical" at either width.
Record the counts of minor and moderate violations. The harness takes no screenshot of a page that shows a real
person's data; WP-08 uses synthetic data only.

| ID | Persona | Page (state) | Where | Source |
|---|---|---|---|---|
| WP08-A135 | Operator | OP-05 outcome form with evidence rows (A02) | L | UX §7.5; AC-01 to AC-28 |
| WP08-A136 | Operator | OP-05 form with the error summary (A08) | L | same |
| WP08-A137 | Operator | OP-05 after "Issued" without a document (A05) | L | same |
| WP08-A138 | Operator | OP-05 association review with the review copy link and both forms (A19) | L | same |
| WP08-A139 | Operator | OP-05 stale comparison (A09) | L | same |
| WP08-A140 | Operator | OP-06 with files, the send boundary and earlier sends (A35, A36) | L | same |
| WP08-A141 | Operator | OP-06 manual email form and its receipt (A45) | L | same |
| WP08-A142 | Operator | OP-06 with an uncertain and a failed send (A43, A44) | T (fixture page) | same |
| WP08-A143 | Operator | OP-07 with prerequisites, continuing duties and the boundary (A51 to A53) | L | same |
| WP08-A144 | TA | TA-07 result and delivery with a download available (A64) | L | same |
| WP08-A145 | TA | TA-07 issued without a document (A68) | L | same |
| WP08-A146 | TA | TA-07 with a refused download (A66) | L | same |
| WP08-A147 | TA | Download of several files, finished with one unavailable item (A82) | L | same |
| WP08-A148 | TA | TA-10 list with acknowledgement facts and the filter (A89) | L | same |
| WP08-A149 | TA | Notice detail with "Acknowledge" (A90) | L (or T) | same |
| WP08-A150 | TA | TA history (A101) | L | same |
| WP08-A151 | Operator; TA | Operation status page of a WP-08 command, accepted and "Nothing is recorded" (A112) | L | same |

## 3. Proof scenarios V13, V14 and V17 (to their boundary)

V13 (UX §12): "Issued result with wrong/missing artifact keeps outcome but blocks release; ambiguous association goes
to scoped review. Replaced/revoked artifact never silently substitutes." Authority B12, B13. V14: "Operator explicitly
sends exact eligible version to current TA email; email change/reassignment/block before per-file check invalidates
stale assumptions. Unavailable selections remain individually reported." Authority B09 to B12, B31; OD §2. V17:
"Operator Request completion returns actual Core result/blockers. Download alone is insufficient for required
electronic result delivery; last prerequisite never auto-completes." Authority B24; OD §3. The send (V14) and the
completion request (V17) are Core boundaries today (LD-04): each proof runs to its boundary and proves the boundary as
Core reports it. One recipe (§0.4). Set-up writes are labelled.

| Step | Actor, page | Action | Observable result | Items | Where |
|---|---|---|---|---|---|
| P-0 | `operator-1`, OP-01; `syn-ta-1`, TA-10; `superadmin-1`, incidents list | Before the set-up, read the counts. | The run record holds: `operator-1`'s incidents count, `syn-ta-1`'s notices that need acknowledgement, and the TA-06 "needs action" count. | — | L |
| Set-up | Harness (TA pages), `superadmin-1` (SA pages), `operator-1` (operator pages) | §0.4 set-up 1 to 3. | A to D submitted, paid, assigned to `operator-1`, external act evidence recorded. | — | L |
| V13-1 | `operator-1`, OP-05 of C | Record "Issued" with evidence, no document. | Outcome "Issued"; delivery held; owner and next step named. | A05 | L |
| V13-2 | `syn-ta-1`, TA-07 of C | Read. | "Outcome: Issued. The result document is not available yet…"; no download. | A68, A152 | L |
| V13-3 | `operator-1`, OP-05 of B | Record "Issued" with R-B1 (no names on the file). Reload after the check. | "Being checked", then "Waiting for review"; "Held for review"; association incident open, owner `operator-1`; incidents count = baseline + 1. Outcome "Issued". | A17, A18 | L |
| V13-4 | `syn-ta-1`, TA-07 of B | Read. | Not-available copy; no candidate or incident text. | A34, A69 | L |
| V13-5 | `operator-1`, association review of B | Read; open the review copy; choose B; tick the three attestations; confirm. | Staff review retrieval recorded; R-B1 "Matched and verified (by operator-1)", "Can be released"; the incident "Resolved"; TA-07 of B offers the download. | A19, A20, A27 | L |
| V13-6 | `operator-1`, OP-05 of C | Record R-C1 (no names). Reload after the check. Open its review; open the review copy; reject with a note. | R-C1 "Waiting for review", then "Rejected", "Held: wrong document"; the incident open, "Waiting for evidence"; outcome "Issued". | A15, A22 | L |
| V13-7 | `operator-1`, OP-05 of C; set-up: carried WP-14 incident form | Record R-C2 as the replacement of R-C1 for the incident. Reload after the check. Read TA-07 of C. Set-up: resolve the incident with a note and evidence. Read TA-07 of C again. | R-C1 "Replaced: no longer released"; R-C2 "Matched and verified"; release held while the incident is open, with the reason; after the resolution TA-07 of C offers R-C2 only. | A23 | L |
| V13-8 | Harness | Replays and refusals of A21, A26, A29, A30 on B and C. | As the items; nothing extra recorded. | A21, A26, A29, A30 | L+T |
| V13-9 | Test | Two candidates (A25); reviewer scope (A28); first document form (A15 where the design adds it). | As the items. | A25, A28 | T |
| V14-1 | `operator-1`, OP-05 of A | Record "Issued" with R-A. | "Matched and verified", "Can be released". | A04, A16 | L |
| V14-2 | `operator-1`, OP-06 of A | Read; post the send route by hand. | Recipient (or "Unavailable", Q-02); R-A version 1 "Available now: Yes"; the A38 sentence; the send boundary in the LD-04 form; the hand-made post refused, nothing queued. | A35 to A38 | L |
| V14-3 | `syn-ta-1`, TA-07 of A | Download R-A; replay the download. | Streamed in full; one retrieval recorded; the replay streams nothing stored. | A64, A65, A67 | L |
| V14-4 | `operator-1`, OP-05 of A; `syn-ta-1` | Replace R-A with R-A2. From the TA page loaded before the replacement, download R-A. | R-A "Replaced: no longer released"; the TA download refused, no substitute; the refusal in "Your downloads". | A24, A40, A66 | L |
| V14-5 | `syn-ta-1`, TA-07 of A (page loaded before V14-4) | Select R-A (stale) and R-A2 (after its association); download selected files. | Selection page: R-A "Not available: [reason]"; R-A2 "Included"; the archive holds only included files. | A79, A81, A82 | L |
| V14-6 | `syn-ta-2` | Open A's TA-07, delivery, selection page; post a download. | SH-02 each; no byte. | A75, A86 | L |
| V14-7 | Test | Email change, inactive recipient, incident block, revoked session before the check. | Each check refuses or shows the current recipient; no byte; no stale address. | A41, A66 (4), A76 | T |
| V14-8 | `operator-1`, OP-06 of A | Record a manual email (not system-verified). | "Manual email recorded… Not verified by TravelMudra."; not shown as an email send. | A45 | L |
| V17-1 | `operator-1`, OP-07 of A (before V14-3) | Read. | Core's prerequisites with Met/Not met; delivery "Not met"; the completion boundary in the LD-04 form. | A51, A53 | L |
| V17-2 | `operator-1`, OP-07 of A (after V14-3 and V14-8) | Read again. | Delivery prerequisite still "Not met"; "A download by the travel agent or a manual email record does not meet this…"; lifecycle unchanged. | A56 | L |
| V17-3 | `operator-1`, OP-07 of D | Read after recording "Refused". | Core's rows for D; no page-made prerequisite. | A13, A59 | L |
| V17-4 | Harness as `superadmin-1`; SuperAdmin pages | Post the completion route by hand; look for completion controls. | Boundary refusal, nothing recorded; no SuperAdmin completion control. | A54, A55 | L+T |
| V17-5 | Test | All prerequisites met without a request; completed with continuing duty; filing possibly occurred. | No auto-completion; "Processing completed." with duties; no "not filed". | A57, A58, A60 | T |
| P-9 | `syn-ta-1`, TA-10 and history of A | Read; acknowledge a notice that asks for it (when one exists on `lane-ui`). | Acknowledgement facts without a read marker; history with separate delivery entries in the lag form. | A89 to A91, A101, A103 | L |
| P-10 | axe | Every WP-08 page visited. | No serious or critical violation at 1440 px and 390 px. | A135 to A151 | L |

Proof split: V13 passes when V13-1 to V13-8 pass on `lane-ui` at the integrated WP-08 commit and V13-9 passes as named
tests. V14 passes (to its boundary) when V14-1 to V14-6 and V14-8 pass on `lane-ui` and V14-7 passes as named tests.
V17 passes (to its boundary) when V17-1 to V17-4 pass on `lane-ui` and V17-5 passes as named tests. P-0, P-9 and P-10
belong to all three. The run record names the `lane-ui` ref, the stamp, each test, the identifiers (internal record
only) and every delta. The send itself (V14 "operator explicitly sends") and the completion request itself (V17
"returns actual Core result") are not proven in WP-08: they wait for the Core commands (LD-04), and the run record
lists them as "Deferred: Core boundary (LD-04)", not as "Fail".

## 4. Scenario parts outside these proofs (traceability)

| Scenario part | Where it is proven |
|---|---|
| V14, V17: the explicit send and the explicit completion request with their receipts | Not buildable in this lane: Core boundaries (LD-04; CMD-44, CMD-48 are Kind 2 changes in their own lane). WP-08 proves the boundary. |
| V13: confirmed wrong-recipient disclosure, version block, truthful notices, incident closure | WP-14 (OP-08, SA-08); WP-08 keeps the forms carried (A118) |
| V15: explicit bounded delivery ownership by a SuperAdmin for an unassigned duty | No command exists; WP-08 shows the SA-03 route (A48); Q-09 |
| V16: uncertain email investigation, attributed SuperAdmin authorization before a resend under continuing ambiguity | WP-19; WP-08 shows the uncertain state and the failed-send resend (A43, A44) |
| V18: partial original return holds completion | WP-12 (OP-09); OP-07 shows the `originals` prerequisite as Core returns it |
| V12: preparation-only packet release and handover | WP-10; the TA packet download is A72 |

## 5. Out of scope and boundaries

These MUST NOT appear on any WP-08 page:

- An outcome value that the read does not list for the mode; a free-text outcome; "Approved", "Success" or
  "Completed" as an outcome (BS B21).
- An "accept best match", "accept anyway", "mark verified" or "AI verified" shortcut; an association confirmed without
  the review copy and the attestations; a new OCR or AI guess shown as the basis of release (BS B13; UX §5.3).
- A release, send or download of a replaced, rejected, withheld or blocked version; a substitute file in place of an
  unavailable one (BS B12, B13).
- A send control, a "Resend" on an uncertain send, an automatic resend, or a "recall" control (BS B31, B45).
- Boundary text that says an owner still has to decide, choose or select the send trigger, the completion trigger or
  the uncertain-email handling; "B46" in user-facing text (LD-04; DECISIONS §1.3).
- A SuperAdmin send, delivery-ownership, completion, force-complete or filing control (UX §2.3; OD §3).
- "Received", "Delivered", "Opened" or "Read" for an email send, a web notice or a download; a manual email shown as a
  system-verified send (BS B24, B31).
- A notice read marker or "Mark as read" (LD-06).
- A completion prerequisite, eligibility or association state computed by the page instead of read from Core (PL §6).
- A count shown as "0" when it is unknown, a list that hides its row limit, an age or deadline that no read returns
  (D7; CR-03).
- Earlier facts on a page after an optional read was refused for access (LD-14).
- A receipt that names a result the operation does not return, or an accepted time (C-03; P-02; WP-06 D-02).
- A size, selection or retry limit stated by the page itself (WP-01 Q-13).

Deferred in WP-08 (each item says where it lands; the run record lists them as "Deferred"):

- The explicit result send and its per-selection receipt (UX §5.3; V14): Core boundary (LD-04).
- The explicit completion request and Core's completion event or blockers as a command result (V17): Core boundary
  (LD-04).
- The recipient address, a version number per file and the travel agent's notice facts on OP-06, until a read returns
  them (Q-02): A35, A41 partly met. (The manual-email recipient check is served: Core refuses a mismatch, A45.)
- The extracted name and passport facts, the rule's failure reason and the contradiction on the association review,
  and the recorded outcome's evidence on OP-05, until a read returns them (Q-14): A19 partly met.
- Event time and actor on the TA history page (Q-10): A101 partly met.
- Owner and evidence per completion prerequisite and the continuing-duties list from one read (Q-03): A51, A52 partly
  met.
- Uncertain-email investigation and the SuperAdmin authorization of a resend under continuing ambiguity (WP-19; OD §4).
- Delivery uncertainty on TA-07, while the TA read carries no email fact (WP-03 design §3.4): A70.
- The accepted time in receipts (P-02).
- Association reviews of other incident kinds and reviewer assignment (WP-14).

Not in WP-08 (later packages):

- OP-08 incidents and follow-up, SA-08, disclosure handling (WP-14).
- Packet build, release and handover, provider handoff, direct external delivery (WP-10).
- Originals register and owner receipt (WP-12).
- Timing-notice acknowledgement on TA-07 and price decisions (WP-17); TA-11 payment history (WP-16).
- OP-10 operator notices and SA-10 SuperAdmin notices (WP-15, CC-03).

## 6. Questions for the architect (ranked)

| ID | Rank | Question | Concrete scenario | PM recommendation |
|---|---|---|---|---|
| Q-01 | P1 | Are "Record a manual email (not system-verified)" (`dlv.record_manual_email`) and the deliberate resend after a proven failure (`dlv.manual_resend`) in WP-08? CC §3 and UI-PLAN §12.2 put both in WP-19; the brief puts both on OP-06. Both forms exist today on the operator delivery page. | WP-08 rebuilds OP-06 without them: the operator who emailed a result by hand cannot record it on the rebuilt page, or the old forms stay beside the new page with other words and other result rules. Likelihood: high once OP-06 is rebuilt. | Build both on OP-06 in WP-08 (one page, one receipt rule, same files table); move the two CC rows to WP-08. WP-19 keeps the uncertain-email investigation, the SuperAdmin authorization under continuing ambiguity and its SA-02 view. A44 to A46 assume this. |
| Q-02 | P1 | The operator's delivery read (`dlv.delivery_page`, staff surface) returns no recipient address, no version number per file (only the label and the document version id) and only the operator's own notices, so not the travel agent's web notice or acknowledgement. No other operator read returns the travel agent's current email (`iam.admin_account` is SuperAdmin-only). UX §5.3 and PL OP-06 require the current TA account email as text, files with version, and the notice requirement. | The travel agent changed the account email yesterday. The operator opens OP-06 to check where the result would go and sees no address; the operator records a manual email to the old address, Core refuses it, and the operator cannot see why the address is wrong. Likelihood: medium after any email change. | Kind 1 request (P-10 style): in the staff delivery read, the current recipient address and its account state, a version number per file, and the travel agent's notice and acknowledgement facts for this application. Until served: A35 and A41 are partly met, with the wording of A35; no page-side lookup through another read. |
| Q-03 | P1 | The case read's `completion` gives prerequisite, satisfied and reason codes only: no owner, no evidence. No read lists the continuing duties (financial follow-up, open incidents) of one application together. UX §5.3 and PL OP-07 require evidence and owner per prerequisite and the duties apart. | OP-07 shows "Delivery: Not met" without saying who acts; the operator assumes the travel agent must download, which does not meet the prerequisite (V17), and the case waits with no owner. Likelihood: high for every issued case. | Kind 1 request (P-10 style): owner kind, next action and evidence reference per prerequisite; continuing duties of the application. Until served: Core's reason codes in words, "Owner: not shown by this read", and the continuing duties from the reads that already return them, labelled current and possibly incomplete. A51 and A52 partly met. |
| Q-04 | P1 | Wording of the three boundaries. The current texts of `delivery_send_trigger_unselected`, `completion_check_trigger_unselected` and `uncertain_email_handling_unselected` say "not decided yet". LD-04 forbids this for the send and the completion; OD §4 decided the uncertain-email handling too (DECISIONS §1.3 OC-03). Does the LD-04 rule cover the third code? | Max reads "who starts sending a result by email is not decided yet" on OP-06 and reopens a decision he made on 10 October 2026; or a tester reports the policy as missing. Likelihood: certain while the texts stay. | Yes, all three. Draft texts: "Send result is not available in this release. Sending the result is the assigned operator's step; TravelMudra does not email results automatically." / "Request completion is not available in this release. Requesting completion is the assigned operator's step; TravelMudra never completes an application automatically." / "Investigating an uncertain email is not available in this release. TravelMudra never resends it automatically." The design review sets the final words. |
| Q-06 | P1 | Synthetic result documents. `test/fixtures/documents/samples.ts` has no result-document generator. The system test builds text PDFs (`resultPdf`) that the processing instance reads; association depends on the extracted surname and given names and a passport number of one letter and seven digits, and it searches every open application of the travel agent for the offering in every group. | The harness reuses passport numbers of an earlier run; R-A matches two open applications and the rule answers "contradictory identifier"; A16 fails on `lane-ui` although the page is right. Or the harness has no generator and V13 and V14 cannot run. Likelihood: high on the second run without the rule. | Add an in-memory generator under `test/` in the form of `resultPdf` (synthetic lines only, no real document) and make the recipe generate passport numbers new to each run (§0.4). The design names the helper; no change to Core. |
| Q-13 | P1 | UI-PLAN OP-05 says the operator may open an association incident on a contradiction. Core lets an operator open only `operational_failure`, `custody_discrepancy` and `post_filing_correction`; `artifact_association` incidents open only when the automatic match fails. CC homes `ops.open_incident` on OP-05 "(association incident)". | The operator sees that a verified result file carries a wrong given name (the rule matched surname tokens only); OP-05 offers no way to hold it; the travel agent downloads the wrong document. Likelihood: low, harm high. | OP-05 offers no association-incident control (A26). The route for a wrong verified file is "Record a replacement" (the assigned operator may replace an eligible file; the old file stops being released at once, A23, A24); state this on OP-05. Ask the architect whether `ops.open_incident` belongs on OP-05 at all (operator kinds) or on OP-08 (WP-14); move the CC row if not. A Core change to let an operator open an association incident is Kind 2 and goes to Max only if the replacement route is found insufficient. |
| Q-14 | P1 | No read returns the extracted surname, given names and passport number of a result file, the rule's failure reason or the contradiction, nor the evidence of a recorded outcome (only the SuperAdmin audit has it). UX §5.3 requires "extracted name and passport evidence… contradictions" on the artifact review. | The reviewer confirms R-B1 after a quick look at the review copy without seeing that the rule failed on the names; a file of a namesake becomes releasable. Likelihood: low, harm high. | Kind 1 request (P-10 style): the association facts of an artifact (rule result, failure code, extracted tokens limited to the compared fields) in `ops.incident` for its owner or reviewer, and the outcome's evidence in the operator case read. Until served: A19 shows the sentence of A19 and is partly met; the three attestations against the review copy stay mandatory. |
| Q-05 | P2 (answered by the research; confirm) | Proof path to "Issued". | — | Use "SYN Tourist e-visa": Gate 2 passes once the service payment is received, and the government submission carries no fee, so the default ₹0 ceiling does not block the authorization. The path is the one of `test/system/case-work.test.ts` (start work, readiness, authorize `government_submission`, record it as filed, record the official result). Avoid "SYN e-visa, fee paid with submission" (the submission carries the fee and stops at the ₹0 ceiling). The architect confirms in the design. |
| Q-07 | P2 | TA-10 is built in WP-08 (lane PLAN §3), but CC puts `dlv.acknowledge_notice` in WP-17. | TA-10 is rebuilt without its only command; a TA cannot acknowledge a decision notice on the new page until WP-17. Likelihood: high. | The TA route of `dlv.acknowledge_notice` is built with TA-10 in WP-08; the CC row notes it; the operator and SuperAdmin routes stay with OP-10 and SA-10 (WP-15). |
| Q-08 | P2 | The "Download of several files" page has no plan page (CC §4, CC-10 homes the selection on TA-07). Is `/ta/selections/:selectionId` rebuilt as the result page of a TA-07 selection? | The selection result keeps the old layout, or loses its address and the per-file results after a reload. Likelihood: medium. | Keep the path (LD-03); rebuild it as the result page of the TA-07 selection (A81); the operator selection page stays with OP-02. |
| Q-09 | P2 | OD §2 lets a SuperAdmin take bounded delivery ownership of an unassigned delivery duty (DECISIONS §1.3 OC-04), but no command records it. | An application whose operator was suspended after the outcome waits for delivery; the SuperAdmin finds no way to own the delivery except assignment. Likelihood: low. | WP-08 shows the SA-03 route (assign an operator) only. The missing command is a Kind 2 item for Max; no page control until it exists. |
| Q-10 | P2 | `views.ta_history` returns the recorded time only (no event time) and no actor; acknowledgements and manual email records are not history entries. UX §7.4 (Timeline) asks for actor, event time and recorded time. | A TA explains to a customer when the result was issued and quotes the recorded time of the outcome as the issue date. Likelihood: medium. | Show the recorded time labelled "Recorded"; claim no event time or actor; list the gap in the WP-08 record as a Kind 1 item (P2, parked, P-09 style). |
| Q-11 | P2 | Which page hosts the association review? It is today the generic incident page, which WP-14 rebuilds for all kinds. Also: the SuperAdmin incident page renders the confirm and reject forms with actions under `/admin/incidents/:id/…`, for which no route exists (a SuperAdmin may confirm by policy, but the form posts nowhere). | WP-08 rebuilds only part of the incident page while WP-14 edits the same file; or a SuperAdmin presses "Confirm" on an association and gets a not-found page. Likelihood: medium. | WP-08 rebuilds the incident page for the kind `artifact_association` as the OP-05 review on the operator surface; other kinds keep the existing renderer until WP-14. On the SuperAdmin page WP-08 removes the two forms that post to a missing route (or the architect adds the routes in WP-14); a test checks that every rendered form action is a registered route. |
| Q-12 | P2 | `synthetic_accepted` on a test installation: should the page say "Sent to the test mailbox"? | A tester reads "Sent" on `lane-ui` and believes a real email left the installation. Likelihood: low. | Yes: the synthetic wording of §0.2 on a test installation; production never shows it. |

## 7. Sign-off

| Field | Value |
|---|---|
| Verified on (date, IST) | |
| Installation and ref (`uat.py status lane-ui` output: commit or tag) | |
| Lane commit of the tests named for `T` items | |
| Run tag and identifiers (internal record reference) | |
| Baseline values of step P-0 and the deltas observed | |
| Browsers and versions | |
| Assistive technology used | |
| V13 result (steps; where shown) | |
| V14 result to its boundary (steps; where shown) | |
| V17 result to its boundary (steps; where shown) | |
| Deferred items (reference each) | |
| Open findings (ID, rank, scenario) | |
| Signed by (role and name) | |

Result per item (Pass, Fail, Blocked, Partly met, Deferred or Not run; evidence reference; note):

| ID | Result | Evidence | Note |
|---|---|---|---|
| WP08-A01 | | | |
| WP08-A02 | | | |
| WP08-A03 | | | |
| WP08-A04 | | | |
| WP08-A05 | | | |
| WP08-A06 | | | |
| WP08-A07 | | | |
| WP08-A08 | | | |
| WP08-A09 | | | |
| WP08-A10 | | | |
| WP08-A11 | | | |
| WP08-A12 | | | |
| WP08-A13 | | | |
| WP08-A14 | | | |
| WP08-A15 | | | |
| WP08-A16 | | | |
| WP08-A17 | | | |
| WP08-A18 | | | |
| WP08-A19 | | | |
| WP08-A20 | | | |
| WP08-A21 | | | |
| WP08-A22 | | | |
| WP08-A23 | | | |
| WP08-A24 | | | |
| WP08-A25 | | | |
| WP08-A26 | | | |
| WP08-A27 | | | |
| WP08-A28 | | | |
| WP08-A29 | | | |
| WP08-A30 | | | |
| WP08-A31 | | | |
| WP08-A32 | | | |
| WP08-A33 | | | |
| WP08-A34 | | | |
| WP08-A35 | | | |
| WP08-A36 | | | |
| WP08-A37 | | | |
| WP08-A38 | | | |
| WP08-A39 | | | |
| WP08-A40 | | | |
| WP08-A41 | | | |
| WP08-A42 | | | |
| WP08-A43 | | | |
| WP08-A44 | | | |
| WP08-A45 | | | |
| WP08-A46 | | | |
| WP08-A47 | | | |
| WP08-A48 | | | |
| WP08-A49 | | | |
| WP08-A50 | | | |
| WP08-A51 | | | |
| WP08-A52 | | | |
| WP08-A53 | | | |
| WP08-A54 | | | |
| WP08-A55 | | | |
| WP08-A56 | | | |
| WP08-A57 | | | |
| WP08-A58 | | | |
| WP08-A59 | | | |
| WP08-A60 | | | |
| WP08-A61 | | | |
| WP08-A62 | | | |
| WP08-A63 | | | |
| WP08-A64 | | | |
| WP08-A65 | | | |
| WP08-A66 | | | |
| WP08-A67 | | | |
| WP08-A68 | | | |
| WP08-A69 | | | |
| WP08-A70 | | | |
| WP08-A71 | | | |
| WP08-A72 | | | |
| WP08-A73 | | | |
| WP08-A74 | | | |
| WP08-A75 | | | |
| WP08-A76 | | | |
| WP08-A77 | | | |
| WP08-A78 | | | |
| WP08-A79 | | | |
| WP08-A80 | | | |
| WP08-A81 | | | |
| WP08-A82 | | | |
| WP08-A83 | | | |
| WP08-A84 | | | |
| WP08-A85 | | | |
| WP08-A86 | | | |
| WP08-A87 | | | |
| WP08-A88 | | | |
| WP08-A89 | | | |
| WP08-A90 | | | |
| WP08-A91 | | | |
| WP08-A92 | | | |
| WP08-A93 | | | |
| WP08-A94 | | | |
| WP08-A95 | | | |
| WP08-A96 | | | |
| WP08-A97 | | | |
| WP08-A98 | | | |
| WP08-A99 | | | |
| WP08-A100 | | | |
| WP08-A101 | | | |
| WP08-A102 | | | |
| WP08-A103 | | | |
| WP08-A104 | | | |
| WP08-A105 | | | |
| WP08-A106 | | | |
| WP08-A107 | | | |
| WP08-A108 | | | |
| WP08-A109 | | | |
| WP08-A110 | | | |
| WP08-A111 | | | |
| WP08-A112 | | | |
| WP08-A113 | | | |
| WP08-A114 | | | |
| WP08-A115 | | | |
| WP08-A116 | | | |
| WP08-A117 | | | |
| WP08-A118 | | | |
| WP08-A119 | | | |
| WP08-A120 | | | |
| WP08-A121 | | | |
| WP08-A122 | | | |
| WP08-A123 | | | |
| WP08-A124 | | | |
| WP08-A125 | | | |
| WP08-A126 | | | |
| WP08-A127 | | | |
| WP08-A128 | | | |
| WP08-A129 | | | |
| WP08-A130 | | | |
| WP08-A131 | | | |
| WP08-A132 | | | |
| WP08-A133 | | | |
| WP08-A134 | | | |
| WP08-A135 | | | |
| WP08-A136 | | | |
| WP08-A137 | | | |
| WP08-A138 | | | |
| WP08-A139 | | | |
| WP08-A140 | | | |
| WP08-A141 | | | |
| WP08-A142 | | | |
| WP08-A143 | | | |
| WP08-A144 | | | |
| WP08-A145 | | | |
| WP08-A146 | | | |
| WP08-A147 | | | |
| WP08-A148 | | | |
| WP08-A149 | | | |
| WP08-A150 | | | |
| WP08-A151 | | | |
| WP08-A152 | | | |
| V13 proof | | | |
| V14 proof (to its boundary) | | | |
| V17 proof (to its boundary) | | | |
