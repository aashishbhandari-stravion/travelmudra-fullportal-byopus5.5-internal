# Coverage matrix — UI plan from the UX specifications — 10 October 2026

Status: architect's plan, integrated from the UX structure draft and the behavior contract draft. Not accepted product policy. Not an assessment of any built product. Inputs: UX, BU, RM, BS only (see README.md for hashes).

## 1. Specification rows to pages and components

"GAP" means the requirement has no complete home in this plan. "PENDING" means an owner choice blocks it.

| Spec row | Pages | Components | Status |
|---|---|---|---|
| UX §4.2 Home | TA-01 | CMP-01, CMP-06, CMP-21 | Covered |
| UX §4.2 Services | TA-02, TA-03 | CMP-10 | Covered; content needs C04 |
| UX §4.2 Groups | TA-04, TA-05, TA-13 (ADDED), BU-P01 | CMP-24 | Covered |
| UX §4.2 Applications | TA-06, TA-07 | CMP-03, CMP-06 | Covered |
| UX §4.2 Notices | TA-10 | CMP-21 | Covered |
| UX §4.2 Payment history | TA-11 | CMP-16 | Covered |
| UX §4.2 Account | TA-12, PUB-02 | CMP-27 | Covered |
| UX §5.2 Home / My work | OP-01 | CMP-20, CMP-06 | Covered |
| UX §5.2 Applications | OP-01 (All assigned), OP-02–OP-07 | CMP-11, CMP-15 | Covered; send and completion triggers BOUNDARY (B46) |
| UX §5.2 Incidents and follow-up | OP-08 | CMP-09 | Covered |
| UX §5.2 Originals | OP-09 | CMP-17 | Covered; parked route policy BOUNDARY |
| UX §5.2 Notices and account | OP-10 | CMP-21 | Covered; accounting grant BOUNDARY |
| UX §6.2 Home | SA-01 | CMP-06 | Covered |
| UX §6.2 Work queues | SA-02, SA-03 | CMP-26 | Covered; fallback delivery ownership PENDING |
| UX §6.2 Applications & groups | SA-04, SA-09 | CMP-25 | Covered |
| UX §6.2 Offerings & launch | SA-05, SA-09 | CMP-25 | Covered; readiness stage names PENDING |
| UX §6.2 Accounts & access | SA-06, SA-09 | CMP-22 | Covered |
| UX §6.2 Money & exposure | SA-07, SA-09 | CMP-16 | Covered; finance items BOUNDARY |
| UX §6.2 Incidents & audit | SA-08 | CMP-09 | Covered |
| UX §7.4 Action panel … Policy boundary notice (10 rows) | All workspaces | CMP-01–CMP-10 | Covered |
| UX §8.1 Public entry | PUB-01 | — | Covered; locality and country list need C02, C03 |
| UX §8.2 Communication identity and copy | — | — | GAP: email templates are not UI pages. Sender identities PENDING (PD, OD §5). Copy needs C06 |
| UX §8.3 Loading / Empty / No match | All lists | S1–S3, CMP-06 | Covered |
| UX §8.3 Country-local failure | Lists and queues | S4 | Covered as partial state |
| UX §8.3 Partial bulk / systematic mapping fault | BU-P04, BU-P05, BU-P03 | CMP-37, CMP-32 | Covered |
| UX §8.3 Stale projection / evidence unavailable | All | S5, CMP-12, C2 | Covered |
| UX §8.3 Lost acknowledgement / stale revision | All command pages | C4, C5, CMP-13, CMP-14 | Covered |
| UX §8.3 Revoked access / session | SH-02 (ADDED), PUB-02 | — | Covered |
| UX §8.3 Byte unavailable / provider failure / ambiguous | OP-06, TA-07 | CMP-18 | Covered; resend BOUNDARY |
| UX §8.3 Capacity limit | All command pages | C2 | Covered; limits need C12 |
| UX §8.3 Maintenance / restore | SH-02 (ADDED) | — | Covered |
| BU §3.1 Units | BU-P03–BU-P08 | CMP-37, CMP-39; UI-PLAN.md section 11.2 glossary | Covered |
| BU §3.2 Destinations | TA-05, BU-P09, BU-P05, BU-P10, SA-02 | — | Covered |
| BU §4.1 Start in a group | BU-P01, TA-13 (ADDED) | CMP-24 | Covered |
| BU §4.2 Source setup | BU-P02 | CMP-30, CMP-28 | Covered; limits need runtime input |
| BU §4.3 Interpretation and questions | BU-P03 | CMP-31–CMP-34 | Covered |
| BU §4.4 Folder-only and combined | BU-P03, BU-P05, BU-P06 | CMP-39, CMP-40 | Covered |
| BU §5.1 Progress | BU-P04 | CMP-35, CMP-36 | Covered |
| BU §5.2 Pauses and interruptions | BU-P04, BU-P02, BU-P08 | CMP-13, CMP-36 | Covered |
| BU §6.1 Desktop composition | BU-P05 | CMP-38 | Covered |
| BU §6.2 Counts and filters | BU-P05 | CMP-37, CMP-38, CMP-26 | Covered |
| BU §6.3 Row information and detail | BU-P05, BU-P06 | CMP-39, CMP-40, CMP-19 | Covered |
| BU §6.4 Resolution language | BU-P06 | CMP-40 | Covered |
| BU §6.5 Repeated work | BU-P05, BU-P06 | CMP-41, CMP-42 | Covered |
| BU §7.1 Correction entry | BU-P07 | CMP-30 | Covered |
| BU §7.2 Change preview | BU-P07 | CMP-43 | Covered |
| BU §7.3 Apply, conflict, retry | BU-P08 | CMP-44, CMP-47, CMP-14 | Covered |
| BU §7.4 History and abandonment | BU-P08, SA-09 | CMP-45, CMP-46 | Covered |
| BU §8.1 Review after import | BU-P10 | CMP-05 | Covered |
| BU §8.2 Help and operations | BU-P06, TA-07, SA-02, SA-09, OP-03 | CMP-25 | Covered |
| BU §9 Interaction quality | All BU pages | UI-PLAN.md sections 9, 10 | Covered |
| UX §5.3 "authorized contact outcome" | — | — | GAP (P2): no page records an operator's applicant-contact outcome; UX says no messaging platform is needed |

## 2. Main specification scenarios V01–V25

Coverage: **Full** means this contract defines every behavior the scenario observes. **Partly** means a
boundary or an outside validation stops part of the observable result. **Not** means no behavior is
defined. Priority follows D6.

In the Behavior column, section numbers are prefixed "UI-PLAN" (UI-PLAN.md) or "BULK" (BULK-UPLOAD-UI-PLAN.md).

| ID | Pages | Behavior (contract section) | Observable result | Pri | Coverage |
|---|---|---|---|---|---|
| V01 | TA-02, TA-03 | Offering detail; selectable vs unavailable (UI-PLAN 5.2) | Cost, estimate, documents, mode visible; no draft from unavailable route | P0 | Full |
| V02 | BU-P03, BU-P05, TA-07 | Independent applications (BULK 4.3, UI-PLAN 4.1) | Separate quote, authority, owner, outcome | P0 | Full |
| V03 | BU-P02, BU-P05 | Preflight; partial results; pause (BULK 4.1, BULK 4.5) | No mutation from unsafe source; accepted rows kept | P0 | Full |
| V04 | BU-P05 to BU-P08 | Correction and retry (BULK 4.7, BULK 4.8) | Exact failures; matched scope only; no duplicate | P0 | Full |
| V05 | TA-08 | Submit application receipt (UI-PLAN 5.2) | Quote and estimate fixed; forecast separate | P0 | Full |
| V06 | SA-02, SA-03, SA-07, SA-09 | Gate 1 before assignment (UI-PLAN 5.4) | Unpaid case visible; assignment needs Gate 1 or exception | P0 | Full |
| V07 | TA-07, OP-02, OP-03 | Report, return, reconfirm; assistance (UI-PLAN 4.2) | Report only while assigned; return enables edit | P1 | Full |
| V08 | OP-02, SA-09 | Checklist kinds; exception scope (UI-PLAN 5.3, UI-PLAN 5.4) | Readiness, exception, missing evidence, cut-off distinct | P0 | Full |
| V09 | OP-04, SA-07 | Exposure fields; PARKED cases individually (UI-PLAN 5.3, UI-PLAN 5.4) | Counted exposure and ceiling; specific unavailability | P0 | Full |
| V10 | OP-04 | Authorization vs execution; uncertain path (UI-PLAN 5.3) | Protected uncertainty; no repeat | P0 | Full |
| V11 | OP-04 | Record evidence under current authority (UI-PLAN 5.3) | Reconciliation possible; no new filing offered | P1 | Full |
| V12 | OP-04, OP-05 | Preparation-only, third-party, dependency (UI-PLAN 4.2) | Handoff not filing; packet outcome; exact dependency evidence | P1 | Full |
| V13 | OP-05, OP-08, TA-07 | Issued with blocked artifact; scoped review; replacement (UI-PLAN 5.3) | Outcome kept; release blocked; no substitution | P0 | Full |
| V14 | OP-06 | Send preview, per-file recheck, receipt (UI-PLAN 5.3) | Exact version, current TA email, per-selection results | P0 | Partly: send start is `B46 BOUNDARY` |
| V15 | SA-02, SA-03, OP-06 | Assignment route for unassigned delivery (UI-PLAN 5.4) | Duty visible and owned by SuperAdmin queue | P1 | Partly: fallback delivery ownership is `OWNER CHOICE PENDING (Astra-only source)` |
| V16 | OP-06, TA-07 | Uncertain not success; no auto resend; resend after proven failure (UI-PLAN 5.3) | Truthful uncertain state | P1 | Partly: privileged resend under ambiguity is owner choice; ownership is `B46 BOUNDARY` |
| V17 | OP-07 | Prerequisites and blockers (UI-PLAN 5.3) | Blockers with owner; no auto-completion | P0 | Partly: request trigger is `B46 BOUNDARY` |
| V18 | OP-09, OP-07, SA-03 | Partial return; holder kept on reassignment; PARKED shared items (UI-PLAN 5.3) | Custody shown per item | P1 | Partly: completion trigger `B46 BOUNDARY`; shared-item policy PARKED |
| V19 | TA-05, TA-07, SA-07 | Group end; continuing duty (UI-PLAN 4.2) | Completed with follow-up; timer path excludes unsafe cases | P1 | Partly: "Completed with follow-up" is reachable only after the B46 completion trigger exists (RF review) |
| V20 | SA-05 | Publication vs launch; impact; treatment (UI-PLAN 5.4) | No launch from publication; explicit impact | P1 | Full |
| V21 | SA-06, SA-07, TA-12 | K-2P; unilateral suspension and lowering; no email override (UI-PLAN 5.4) | Second distinct SuperAdmin required | P1 | Full |
| V22 | SA-06, all | Support view; revocation (UI-PLAN 5.4, UI-PLAN 5) | No impersonation; revoked links deny | P1 | Full |
| V23 | All lists, SH-01 | Freshness; commands continue under authoritative checks (UI-PLAN 6, UI-PLAN 1) | No fabricated zero; maintenance closed | P0 | Full |
| V24 | TA and OP pages | Keyboard and phone behavior (UI-PLAN 1, UI-PLAN 5) | Next owner understood | P1 | Partly: needs representative-user observation outside this contract |
| V25 | PUB-01 | Static content; SEO requirements (UI-PLAN 5.1) | Only approved content crawlable | P1 | Full |

## 3. Bulk scenarios BU-01..BU-27

See BULK-UPLOAD-UI-PLAN.md section 6.

Totals: 52 scenarios. Full 44. Partly 8 (BU-25, V14, V15, V16, V17, V18, V19, V24). Not 0. The independent review moved V19 to Partly; its RF-01 finding on BU-14 and V04 was fixed in the plan, so both stay Full.

## 4. Open items

| Item | Source row | Why it is open | Governing reference |
|---|---|---|---|
| UX §6.2 Work queues | UX draft 7 | PENDING: fallback delivery ownership | OC-04 |
| UX §6.2 Offerings & launch | UX draft 7 | PENDING: readiness stage names | OC-07 |
| UX §8.2 Communication identity and copy | UX draft 7 | GAP: email templates are not UI pages; sender identities PENDING | OC-06; AD-15 |
| UX §5.3 "authorized contact outcome" | UX draft 7 | GAP (P2): no page records an operator's applicant-contact outcome | AD-15 |
| BU-25 | Bulk scenario | Partly: visual layout and rendered accessibility evaluation sit outside the contract | AC-23; AD-11 |
| V14 | Main scenario | Partly: send start is `B46 BOUNDARY` | OC-01; AD-01; AD-02 |
| V15 | Main scenario | Partly: fallback delivery ownership is `OWNER CHOICE PENDING (Astra-only source)` | OC-04 |
| V16 | Main scenario | Partly: privileged resend under ambiguity is owner choice; ownership is `B46 BOUNDARY` | OC-03; AD-01 |
| V17 | Main scenario | Partly: request trigger is `B46 BOUNDARY` | OC-02; OC-05; AD-01; AD-02 |
| V18 | Main scenario | Partly: completion trigger `B46 BOUNDARY`; shared-item policy PARKED | OC-02; B-05; AD-02 |
| V19 | Main scenario | Partly: completion behind `B46 BOUNDARY` | OC-02; AD-02 |
| V24 | Main scenario | Partly: needs representative-user observation outside the contract | AC-24; AD-11 |
