# Review findings and architect disposition — UI plan from the UX specifications — 10 October 2026

Status: the independent reviewer's report is reproduced in part B without change. Part A is the
architect's disposition of each finding, written after the report. Edits made to the plan cite the RF
number at the edit site.

## A. Architect disposition

Rule applied (PRI-20260930-01): P0 is worked now. P1 goes to Max, who parks it or has it worked; for this
plan the architect holds decision authority (Max, 10 October 2026), so a P1 that corrects the plan text
without a product-policy choice is worked, and a P1 that needs a product choice becomes an open owner
choice for Max. P2 is parked as a note and is not worked.

| ID | Pri | Disposition | Where |
|---|---|---|---|
| RF-01 | P0 | Worked. Retry eligible failures has its own operation identity linked to the original attempt; item effects are keyed on (attempt, row or file). | UI-PLAN K-BATCH, command table; BULK 4.8 |
| RF-02 | P0 | Worked. Business duplicate guard "no open authorization for the same application and action"; operation identity kept in the page address only. | UI-PLAN AD-04, command table |
| RF-03 | P0 | Worked. Create account command added (SuperAdmin; SuperAdmin creation under K-2P); on SA-06 and in WP-02. | UI-PLAN SA-06 inventory and behavior, command table, WP-02 |
| RF-04 | P1 | Worked. Submit application on a returned case confirms the correction; receipt keeps the original quote and estimate start. "Confirm correction" removed. | UI-PLAN 4.2 R3 |
| RF-05 | P1 | Worked. Retrieve result file is behind the B46 notice until a release event exists; removed from the WP-08 proof. | UI-PLAN TA-07, command table, WP-08 |
| RF-06 | P1 | To Max as OC-09. Conservative treatment in the plan: Release packet behind the B46 notice with a per-file B12 recheck; Record packet handover stays a fact record. | UI-PLAN 4.2, OP-04, command table, 13.1 |
| RF-07 | P1 | Disputed; clarified, not changed. BS B23 grants the SuperAdmin authorization of `external_outcome_unresolved` completion explicitly, with B24 prerequisites evaluated by Core. The plan now states that the command records the authorization and Core records the completion. Architect and reviewer disagree on whether this is a B46 trigger; the disagreement is recorded here. | UI-PLAN SA-04, command table |
| RF-08 | P1 | Worked. The "does not satisfy" sentence is removed. The record shows the current TA email and per-file eligibility, flags a recipient mismatch, and shows the B46 notice for any completion effect. | UI-PLAN AD-01, OP-06, command table |
| RF-09 | P1 | Worked. New rule K-BYTE: every byte release, including a same-key retry, rechecks B12; a same-key retry never releases bytes from a stored result. | UI-PLAN command rules and table |
| RF-10 | P1 | Worked. Recent operations comes from the writer's operation record, not a projection; when unavailable the page shows "Unavailable" and offers no new intent for the same purpose. | UI-PLAN AD-04, read models |
| RF-11 | P1 | Worked. AD-13 now lists the decision kinds recorded on SA-09 and the fact-recording commands recorded on their own page; SA-09 has one input set per decision kind. | UI-PLAN AD-13 |
| RF-12 | P1 | Worked. The page address holds only opaque identifiers and enumerated filter values, never search text or personal data. | UI-PLAN SH-R06 |
| RF-13 | P1 | Worked. Actor and "when available" shape of Send result and Request completion carry `OWNER CHOICE PENDING (Astra-only source)`; "no auto-completion" removed. | UI-PLAN OP-06, OP-07, command table |
| RF-14 | P1 | Worked. The SuperAdmin command records fee, TA liability and TM-paid facts only; receipt allocation and recovery are read-only with the B29 notice. | UI-PLAN SA-07, command table, A-03 |
| RF-15 | P1 | Worked. "Open association incident" defined (server on failed automatic association; operator on contradiction); "Request scoped review" removed; reviewer assignment stays on SA-02. | UI-PLAN OP-05, command table, WP-08 |
| RF-16 | P1 | Worked. "Enrol MFA factor" on the PUB-02 staff path at first sign-in; in WP-01. | UI-PLAN PUB-02, command table, WP-01 |
| RF-17 | P1 | Worked. Workbook transfer state belongs to BU-P02. Read source creates a listed attempt "Source read; not started"; mapping answers persist with it. BU-P04 shows start acceptance only. | BULK BU-P04, 4.5 |
| RF-18 | P2 | Parked. Name drift between inventory prose and the defining tables. Fix in the next edit pass. | — |
| RF-19 | P2 | Parked. BU-P07 sketch arithmetic (95 applications versus 15 + 85). Fix in the next edit pass. | — |
| RF-20 | P2 | Parked. Three D5 notices with a wrong or empty owner or route. | — |
| RF-21 | P2 | Parked. PUB-01 publication rule stated twice; section 5 rule governs. | — |
| RF-22 | P2 | Parked. Timeline order key. Intended rule: order by recorded time; event time as a label; order is not causation. | — |
| RF-23 | P2 | Parked. TA-07 (P0) shows Report a problem while its command is in WP-09 (P1); the P0 rendering is a notice with the operator's name. | — |
| RF-24 | P2 | Parked. Attempt state "Stopped: access changed". | — |
| RF-25 | P2 | Parked. Replace "Source limit: not configured" with "Limit unavailable" to respect BS B38. | — |
| RF-26 | P2 | Parked. "Partly processed" versus "Partially processed"; use "Partially processed". | — |
| RF-27 | P2 | Parked. S4 variant that names the affected country scope. | — |
| RF-28 | P2 | Parked. Named block for row-to-file associations and "Files needing attention". | — |
| RF-29 | P2 | To Max as OC-10 (TA onboarding route). AD-05 stays as the plan's treatment until decided. | UI-PLAN 13.1 |
| RF-30 | P2 | Parked. Draft IDs in sections A, 13.3 and 13.4 point to unpublished drafts; the drafts are kept outside the repository. | — |

Coverage after disposition: 52 scenarios, Full 44, Partly 8, Not 0. The reviewer's count was 42 / 10 / 0
before the RF-01 fix; BU-14 and V04 return to Full. V19 stays Partly as the reviewer found.

Boundary verdict after disposition: items 1, 2, 5 and 6 of the reviewer's list are corrected; item 4 is
OC-09; item 7 is OC-10; item 3 is disputed and recorded.

## B. Independent reviewer's report (unchanged)

# Independent design review: TravelMudra UI plan from the specifications, 10 October 2026

Reviewer: independent design reviewer. Not the plan author. Plan reviewed as written; no edits made.

## 1. Scope and method

Files read in full (sed/cat only):

| File | Lines | Hash check |
|---|---|---|
| UI-PLAN.md | 1469 | Not listed in a manifest; read as the review subject |
| BULK-UPLOAD-UI-PLAN.md | 466 | Same |
| COVERAGE-MATRIX.md | 120 | Same |
| ARCHITECT-BRIEF.md (plan folder) | 85 | Not listed; read for D1–D7 and page IDs |
| UX TARGET_PRODUCT_UX_SPEC.md | 562 | `b45186887cdc37f6c078adabb4e0024bc453f9653793cdfb414725d85c979ce4` matches ARCHITECT-BRIEF §1 |
| BU BULK_UPLOAD_PRODUCT_UX_SPEC.md | 452 | `c2686f12552be10f35cf1352b8de909cb8feb318a6a8d962f1229c8d6170bab5` matches |
| RM README.md | 36 | `90d48a989c3c76a6e5613667fedbbcc68932dcf7b433e5b9437e7f8052dea690` matches |
| BS BUILD_SPEC.md | 109 | `4a6fd90657b0723f67fb13a58aa57b3377238fd361ee8f706867bb714d58ea89` matches |

Files not read: README.md in the plan folder, the scratchpad drafts, `sources/`, any product code.

Passes (wall time, approximate): specifications 4 min; UI-PLAN.md 4 min; bulk plan and matrix 2 min;
cross-check of names, IDs and commands with grep 1 min; writing 10 min. Started 11:15 IST.

Method: for each D6 P0 item I answered the three tenet-2 questions (section 2a). I then checked every
command and read-model name used in sections 3–5 and 12 against the defining tables in section 6, section 7
and bulk section 3. I compared every OD/PD-dependent sentence in UX against the plan for the D1 marker.
I recounted the scenario coverage.

Assumptions:
- AS-1. "Operation reference" and "operation identity" in the plan mean the same thing unless the plan
  says otherwise.
- AS-2. A read model is a derived view that can lag (BS B33), unless the plan says it is writer data.
- AS-3. The P0 proof runs on a local installation where a synthetic identity seed is allowed (BS B37).

## 2. Findings

Ranked P0 first. "Likelihood" is a concrete scenario.

| ID | Pri | Likelihood | Location | Finding | Source | Proposed fix |
|---|---|---|---|---|---|---|
| RF-01 | P0 | A TA presses **Retry eligible failures** after BU-14. The command reuses the original operation identity, so K-STD returns the stored result with the same failures. The page shows a retry that did nothing, or a lost acknowledgement on the retry itself cannot be told apart from the original. | BULK §4.8 item 3; UI-PLAN §7 row "Retry eligible failures"; K-BATCH | The plan does not say whether Retry eligible failures has its own operation identity. With the original identity, K-STD makes the retry a read. K-BATCH says the Nth retry "returns" eligible failures, not that it processes them. | BS B16, B35; BU §7.3; BU-14 | Give Retry eligible failures its own operation identity that links to the original attempt; key per-item effects on (attempt, row or file) so an Nth retry of the retry returns its own result and creates no duplicate. |
| RF-02 | P0 | An operator authorizes a TM-funded filing. The acknowledgement is lost; the operator reloads. The identity was "in memory" (AD-04), or Recent operations lags. The page offers **Request authorization** again; a new identity creates a second authorization and a second exposure reservation. No product path releases it (unused-reservation release is PARKED). | UI-PLAN AD-04; §6.1 Recent operations; §7 "Authorize external action" guards | Authorize external action has no business duplicate guard, and the operation identity can be lost on reload. A duplicate reservation is irreversible inside the product. | BS B28, B35, B43 | Add the guard "no open authorization for the same application and action"; keep the operation identity in the page address only, not "memory or address". |
| RF-03 | P0 | Max opens a fresh installation without a seed. No page can create a TA, operator or SuperAdmin account. AD-05 and A-01 say a SuperAdmin "creates" TA accounts on SA-06, but SA-06 and section 7 hold only "Change account status". Journey precondition S0 cannot be met. | UI-PLAN AD-05, A-01, §3.4 SA-06, §5.4 SA-06, §7, WP-02 | A capability that the plan asserts has no command and no page action. | BS B08, B11 | Add a "Create account" command (actor SuperAdmin, role, individual, reason; SuperAdmin creation under K-2P) to SA-06 and WP-02. |
| RF-04 | P1 | Operator returns a case. TA corrects and uses **Submit this application** (TA-08 "own draft or returned case"). The receipt shows a new "submission time" and "original estimate". If the catalogue price changed since, the TA reads a new quote. R3 names a command "Confirm correction" that section 7 does not define. | UI-PLAN §4.2 R3; §5.2 TA-08; §7 "Submit application" | The plan does not say that confirmation after a formal return keeps the one-time quote and the original estimate start. | BS B17, B18 | Define "Confirm correction after return" as a separate command whose receipt keeps the original quote and estimate start, or state this rule on Submit application for a returned case. |
| RF-05 | P1 | A builder must prove "Retrieve result file" in P0 (WP-08). Send is B46 BOUNDARY, so no release exists. The builder makes the file retrievable when association is confirmed. That is a delivery trigger that B46 forbids. | UI-PLAN §5.2 TA-07 "Download result" ("released to this TA"); §4.1 step 12; WP-08 | "Released" has no defined event. Step 12 says retrieval follows a send; the TA-07 table and WP-08 do not. | BS B12, B24, B46; D2 | State on TA-07 that retrieval is unavailable with the B46 notice until a release event exists; move Retrieve result file out of the WP-08 proof. |
| RF-06 | P1 | Preparation-only: the operator presses **Release packet**. Packet bytes go to the TA with no B46 notice and no stated B12 per-file recheck. The same plan forbids a result send for every other mode. | UI-PLAN §4.2 Preparation-only; §5.3 OP-04; §7 "Release packet" | Packet release is a delivery start. The plan treats it as an ordinary command. | BS B04, B12, B24, B31, B46; D2 | Put Release packet behind the same B46 decision as Send result, or record Max's decision that packet handover is outside B46; add the B12 per-file recheck guard. |
| RF-07 | P1 | A SuperAdmin records `external_outcome_unresolved` on SA-04. The receipt says "Completion". The operator's completion path for every other case is B46-unavailable, and OC-05 says the plan adds no SuperAdmin completion control. | UI-PLAN §4.2 Unknown execution "Exhausted"; §5.4 SA-04; §7; OC-05 | The plan gives SuperAdmin a completion trigger while it says no completion trigger exists. | BS B23, B24, B46; UX §2.3 | State that the command records the outcome and its owner only, and that completion stays behind the B46 notice; or route the choice to Max as an open item. |
| RF-08 | P1 | An operator emails a result file by hand to an address from an old email thread, then records it. The record accepts "recipient as stated" and checks nothing. The receipt also says the email "does not satisfy" the B24 requirement, which BS does not say. | UI-PLAN AD-01; §5.3 OP-06 "Record a manual email"; §7 "Record manual email" | The plan invents a completion rule for a B46 item and allows a recorded recipient other than the current TA account email. | BS B12, B24, B31, B46 | Remove the "does not satisfy" sentence and show the B46 notice instead; show current TA email and current per-file eligibility beside the record, and flag a mismatch in the receipt. |
| RF-09 | P1 | A disclosure incident blocks a version after a first download. The TA's browser retries the download with the same operation identity. K-STD returns "the original accepted result under current read access" and does not recheck incident block or replacement. | UI-PLAN §7 "Retrieve result file" (K-STD), "Release packet" (K-EXT) | Byte-release commands do not state that each retry rechecks B12 eligibility. | BS B10, B12, B13 | State: a retry of a byte-release command MUST recheck B12 eligibility; a same-key retry MUST NOT release bytes from the stored result. |
| RF-10 | P1 | A SuperAdmin records a government fee fact; the acknowledgement is lost; Recent operations lags after reload; the SuperAdmin records it again. TA liability doubles. The same applies to Create group and Record service payment. | UI-PLAN §6 rules; §6.1 Recent operations; AD-04 | Recent operations is listed as a read model, and read models may lag. Commands with no business duplicate key then depend on it. | BS B33, B35 | State that Recent operations comes from the writer's operation record, not a projection; when it is unavailable, the page shows "Unavailable" and offers no new intent. |
| RF-11 | P1 | A builder reads AD-13 ("SA-07 … do not hold decision forms") and puts Record payment on SA-09. Another builder follows SA-07 "Primary: Record payment". SA-09 has one command row (Record gate exception) and a read model with application and gate fields only, so launch or elevation decisions have no defined inputs. | UI-PLAN AD-13; §3.4 SA-05–SA-09; §5.4 SA-09; §6.4 Gate decision context | The generic decision page contract fits gate exceptions only. The list pages and AD-13 disagree on where forms live. | UX §6.3; BS B07, B11, B20 | List which commands are recorded on SA-09 and which on their own page; give SA-09 one input set per decision kind. |
| RF-12 | P1 | A TA searches by applicant name on TA-06. The builder puts the query in the page address with the filters (SH-R06). Names and passport numbers enter browser history, shared links and server access logs. | UI-PLAN §2.3 SH-R06, SH-R12 | SH-R06 puts filters and selected item in the address and does not exclude free text or personal data. | BS B33; UX §3.3 | Add: the page address MUST NOT hold search text or personal data; only opaque IDs and enumerated filter values. |
| RF-13 | P1 | OP-06 and OP-07 rows say "When available: … Assigned operator … no auto-completion". A builder implements the OD §2/§3 shape (explicit operator send, explicit request, no automatic check) as the default. | UI-PLAN §5.3 OP-06, OP-07; §7 actor column; COVERAGE V17 | Conditional text adopts Astra-only semantics without the D1 marker. B46 leaves the trigger and owner open, including an automatic check. | BS B46; D1, D2 | Mark actor and "no auto-completion" text `OWNER CHOICE PENDING (Astra-only source)`, or remove it. |
| RF-14 | P1 | A SuperAdmin records "recovery facts" on SA-07 (A-03). B29 gives bank-receipt allocation and recovery to Accounts and parks the mutation path. | UI-PLAN A-03; §5.4 SA-07 "Record government fee and recovery facts"; §7 | The plan selects a Payment Records mutation path that BS parks. | BS B29, B43 | Limit the SuperAdmin command to fee and TM-paid facts; show TA receipt and recovery as read-only with the B29 notice. |
| RF-15 | P1 | Association review finds an artifact with two candidates. OP-05 names commands "Open association incident" and "Request scoped review"; section 7 defines neither. V13 (P0) depends on this path. | UI-PLAN §3.3 OP-05; §5.3 OP-05; §7 | Two OP-05 commands are dangling. | BS B13 | Add both to section 7, or state that the server opens the incident when association fails. |
| RF-16 | P1 | A new operator or SuperAdmin signs in for the first time. No page enrolls MFA. PE item 4 raised it; AD-05 answered only the TA half. | UI-PLAN §13.4 PE item 4; AD-05; OP-10; SA-10 (P1) | Staff MFA enrollment has no home. P0 needs staff sign-in. | BS B08, B11 | Add an MFA enrollment step to PUB-02 staff path or SH-02, in WP-01. |
| RF-17 | P1 | A TA leaves BU-P03 after Read source and before Start. On return, Imports shows nothing and the mapping answers are gone. BU-P04 shows a "transfer" banner although the workbook moved on BU-P02. | BULK §1 BU-P02, BU-P04; §4.5 item 4; CMP-36 | The plan conflates workbook transfer with start acceptance and does not say when an attempt exists. | BU §5.1, §3.2; BU-13 | State that the transfer state belongs to BU-P02 and whether Read source creates a listed attempt. |
| RF-18 | P2 | A builder searches section 6 for "TA travel-risk notices", "delivery attempts and evidence", "lifecycle and completion facts", "account administration", "answer interpretation question", "apply service choice", "check original operation result", "record decision" (SA-08), "Associate result artifact". None exist under those names. | UI-PLAN §3, §4.1; BULK §1 | Names drift between inventory and defining tables. | — | Use the section 6, section 7 and bulk section 3 names everywhere. |
| RF-19 | P2 | BU-P07 sketch: "100 rows · 95 applications" then "15 will change; 85 unchanged". 15 + 85 = 100, not 95. A fixture copied from the sketch fails the plan's own count rule. | BULK §1 BU-P07 sketch | Synthetic example breaks the counting contract. | BU §6.2, §7.2 | Use 100 applications in the BU-15 sketch, or 80 unchanged. |
| RF-20 | P2 | SA-09 shows the exposure ceiling stop with route "correct evidence"; the real route is a two-SuperAdmin increase. TA-05 "group closed" has owner "—". PUB-02 names "TravelMudra operations", which is not a role. | UI-PLAN §5.4 SA-09; §5.2 TA-05; §5.1 PUB-02 | Some D5 notices have a wrong or empty owner or route. | D5; UX §7.4 | Correct each owner and route. |
| RF-21 | P2 | PUB-01 §3.1 omits blocks when C02 is missing; §5.1 says the page MUST NOT publish until C02 exists. | UI-PLAN §3.1, §5.1 PUB-01 | Two release rules for one page. | BS B01 | Keep §5.1; make §3.1 states apply to previews only. |
| RF-22 | P2 | An operator records filing evidence with an event time before the authorization time (clock skew). CMP-09 orders entries without a stated key. Users read the order as cause. | UI-PLAN CMP-09 | Timeline order key is not stated. | BS B33 | Order by recorded time; show event time as a label; state "order is not causation". |
| RF-23 | P2 | TA-07 is P0 and shows **Report a problem** as primary when assigned; the command is in WP-09 (P1). The P0 page renders a dead control. | UI-PLAN §4.1 step 7; §3.2 TA-07; WP-03, WP-09 | P0 page uses a P1 command. | D6 | Define the P0 rendering (notice with operator name) or move Report a problem to P0. |
| RF-24 | P2 | A TA is suspended during an import. B10 applies suspension to jobs. On restoration the page has no defined state for work stopped by an access change. | UI-PLAN SH-R05; BULK §4.5 | Access change mid-import has display only, no resumed-state rule. | BS B10, B11 | Add an attempt state "Stopped: access changed" from the read model. |
| RF-25 | P2 | BU-P02 shows "Source limit: not configured". B38 requires finite limits before local admission, so this text claims a state that an admitted installation cannot have. | BULK §4.1 item 4; §13.4 disposition | Fallback copy conflicts with B38. | BS B38; BU §4.2 | Show the limit or "Limit unavailable"; never "not configured". |
| RF-26 | P2 | "Partly processed" (glossary, sketch, CMP-39) and "Partially processed" (count table) name one row outcome. | UI-PLAN §11.2; BULK §4.2 | Two labels for one fact. | BU §6.2 | Use "Partially processed". |
| RF-27 | P2 | A country adapter fails. S4 shows "Unavailable" facts but does not name the affected country scope. | COVERAGE §1 "Country-local failure"; UI-PLAN S4 | UX asks to identify affected work. | UX §8.3; BS B36 | Add an S4 variant naming the affected scope. |
| RF-28 | P2 | Combined source: BU §4.4 asks to show row-to-file associations and "Files needing attention". The plan has no named view or block for either. | BULK §4.6 | Partial home. | BU §4.4 | Add a block to BU-P06 and a filter to BU-P05. |
| RF-29 | P2 | AD-05 decides "no self-registration" as an engineering default. TA onboarding is adjacent to the PARKED eligibility policy. | UI-PLAN AD-05, A-01 | A product choice recorded as an engineering default. | BS B08, B44, B47 | Move to section 13.1 as an open owner choice. |
| RF-30 | P2 | Sections A, 13.3 and 13.4 cite "PE item n", "AR-0n" and "UX draft assumption An". The reader cannot resolve them. | UI-PLAN §A, §13.3, §13.4 | Provenance points to unpublished drafts. | — | Drop the draft IDs or quote the item. |

### 2a. Tenet-2 answers for D6 P0 items

| P0 item | Nth retry: stated, consistent with B35 and BU §7.3? | What a failure leaves behind | Hostile valid states that break the page |
|---|---|---|---|
| Standard case, TA (steps 1–5, 11–13) | Yes for submit (UNR hides Submit). OTP retry issues a new code (acceptable). Returned-case confirmation unclear (RF-04). | Draft and accepted scope kept; input kept. | Lost ack after reload (RF-10); result retrieval with no release event (RF-05); search text in address (RF-12). |
| Standard case, SuperAdmin (steps 6–7, S0) | Yes per item for Assign (K-BATCH). Record payment relies on Recent operations (RF-10). | Per-application results; ineligible items listed. | No account creation (RF-03); decision form location unclear (RF-11). Concurrent assignment: guarded ("already assigned"). |
| Standard case, Operator (steps 8–13) | Authorize: same key safe; new key after reload not guarded (RF-02). Send and completion: B46, none. | UNR copy "Do not perform the external act" is correct. Duplicate reservation stays (RF-02). | Reassignment after authorization: page keeps the manual step until next read (accepted B45 residual; note only). Clock skew in timeline (RF-22). |
| BU-01, BU-04 | Not applicable beyond Start (K-BATCH). | Mapping answers before Start may be lost (RF-17). | Read model with no freshness: handled ("Freshness unavailable"). |
| BU-09 | Not applicable. | All 100 rows listed; failed rows keep reason. | Count unavailable: handled ("Unavailable", "Counting…"). |
| BU-13 | Start UNR handled. | Transfer interrupted copy correct; attempt existence before Start undefined (RF-17). | Access change mid-import (RF-24). |
| BU-14 | Not consistent: Retry eligible failures identity (RF-01). Check result: correct. | Accepted effects kept. | Lost ack on the retry itself (RF-01). |
| BU-15 | Apply corrections K-BATCH per application; conflict per application. | No half-applied application; others kept. | Concurrent edit: handled (CMP-14). Sketch arithmetic (RF-19). |
| BU-23 | As TA-08. | Queue position kept. | Offering suspended between review and submit: handled (boundary). |

## 3. Coverage verdict

Requirement rows with no complete home:

| Row or scenario | Status in plan | Reviewer status |
|---|---|---|
| UX §8.2 communication identity and copy | GAP (open, AD-15) | Agree; open with owner C06 |
| UX §5.3 authorized contact outcome | GAP P2 (AD-15) | Agree |
| UX §8.3 country-local failure | Covered | Partly (RF-27) |
| BU §4.4 row-to-file associations, Files needing attention | Covered | Partly (RF-28) |
| Account creation and staff MFA enrollment (BS B08, B11) | Not listed | No home (RF-03, RF-16) |
| BS B24 manual operator email | Covered (AD-01) | Home exists; rule invented (RF-08) |

All other rows of UX §4.2, §5.2, §6.2, §7.4, §8.3 and BU §§3–9 have a page and a behavior.

Scenario counts:

| Set | Plan: Full / Partly / Not | Reviewer: Full / Partly / Not | Difference |
|---|---|---|---|
| UX §12 V01–V25 | 19 / 6 / 0 | 17 / 8 / 0 | V04 Partly (RF-01 retry semantics); V19 Partly (completion is behind B46, so "Completed with follow-up" is not reachable except through RF-07) |
| BU §11 BU-01–BU-27 | 26 / 1 / 0 | 25 / 2 / 0 | BU-14 Partly (RF-01) |
| Total | 45 / 7 / 0 | 42 / 10 / 0 | 3 scenarios |

The plan's own Partly rows (V14–V18, V24, BU-25) are correctly Partly. Their reasons are accurate.

## 4. Boundary verdict

Places where policy is invented or an Astra-only decision is adopted without the marker:

1. AD-01, OP-06 "Record a manual email": the statement that the record "does not satisfy the
   document-carrying-email requirement" decides a B24/B46 completion question (RF-08).
2. OP-06 and OP-07 "when available" text and the section 7 actor column: operator as send and completion
   actor and "no auto-completion" adopt OD §2/§3 without `OWNER CHOICE PENDING (Astra-only source)` (RF-13).
3. SA-04 "Record unresolved external outcome" receipt "Completion": a completion trigger while B46 is open
   (RF-07).
4. OP-04 "Release packet": a delivery start outside the B46 boundary (RF-06).
5. TA-07 "Download result" with an undefined release event: invites an invented B46 trigger (RF-05).
6. A-03, SA-07 "recovery facts": selects a B29 PARKED Payment Records mutation path (RF-14).
7. AD-05 "no self-registration": product onboarding choice next to B44 recorded as an engineering
   default (RF-29, P2).

No other OD or PD item is adopted without the marker. OC-01 to OC-07 carry it correctly.

## 5. Consistency verdict

Dangling or mismatched names:

- Commands used but not defined in section 7: "Open association incident", "Request scoped review"
  (OP-05, RF-15); "Confirm correction" (§4.2 R3, RF-04); "record decision" (SA-08 inventory); "Create
  account" implied by AD-05 (RF-03).
- Name drift between inventory and definitions: see RF-18.
- AD-13 versus SA-05, SA-06, SA-07 primary actions: contradictory placement of decision forms (RF-11).
- PUB-01 publication rule differs between §3.1 and §5.1 (RF-21).
- OP-08 lists "assign reviewer" for the operator; section 7 gives that command to SuperAdmin only.
- Page count 47, OC-01–OC-08, B-01–B-10, A-01–A-14, CMP-01–CMP-28 and CMP-30–CMP-47 resolve. Page IDs
  match ARCHITECT-BRIEF §3 plus the three ADDED pages.

D4 (status facts separate): no combined badge, percentage or invented deadline found.
D5 (reason, owner, route): three defects (RF-20).
D7 (unknown is not zero): no violation found. Counts, freshness and money facts state "Unavailable",
"Counting…", "Not recorded" or "Freshness unavailable".

## 6. What I did not check and why

- Rendered layout, contrast of tints and focus, and real accessibility: no rendered interface exists.
- Whether the read models can be built from the BS writers (B34): the plan names models in words only (D3).
- The plan folder README.md hashes: README.md is outside my permitted input list. I verified the four
  specification hashes directly instead.
- OD and PD content: outside my permitted inputs. I judged D1 only from UX text that cites OD or PD.
- Copy quality against C05/C06: those inputs do not exist yet.
- STE conformance in full: I flagged style only where ambiguity can change implementation (RF-04, RF-05,
  RF-11, RF-12, RF-17). No other style finding.
