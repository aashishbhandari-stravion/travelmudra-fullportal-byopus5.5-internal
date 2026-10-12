# TravelMudra UI plan from the UX specifications — 10 October 2026

Status: architect's plan, integrated from the UX structure draft and the behavior contract draft. Not accepted product policy. Not an assessment of any built product. Inputs: UX, BU, RM, BS only (see README.md for hashes). Writing style: ASD-STE100 at about 80%.

## How to read

Section A binds. Sections 1 to 3 give structure: conventions, shell and navigation, and the page inventory. Sections 4 to 7 give behavior: journeys, per-page actions, read models and commands. Sections 8 to 11 give components, design tokens, accessibility criteria and copy. Section 12 gives the build sequence and section 13 gives open owner choices, boundaries and assumptions; bulk pages are in BULK-UPLOAD-UI-PLAN.md and scenario coverage is in COVERAGE-MATRIX.md.

## A. Architect decisions on the drafts

The Principal Technical Architect made these decisions on 10 October 2026 after reading both drafts. They
bind the integrated plan. A decision that changes a specification requirement does not exist here; each
decision selects between readings or fills a gap the specifications leave to the implementer (BS B47).

| ID | Decision | Reason and source |
|---|---|---|
| AD-01 | While BS B46 is open, OP-06 and OP-07 offer no send command and no completion command. Both pages render preview, recipient, per-file eligibility, prior attempts, prerequisites and blockers from read models. The trigger region shows the policy boundary notice, owner "product owner". The BS B24 "manual operator email" is a fact-recording command, **Record a manual email (not system-verified)**, delivered in P1 (WP-19). The page shows the current TA account email and the current per-file eligibility beside the record. The receipt states that the record is not system-verified, claims no delivery, flags a recipient that differs from the current TA account email, and shows the B46 notice for any completion effect. | BS B46 forbids a provisional trigger or a partial fix. BS B24 permits an attributed manual email record. The record is a fact, not a send. |
| AD-02 | P0 is accepted with the standard case ending at the B46 boundary: send preview and completion blockers are shown, "Completed" is not reached. The plan does not ask Max to settle OC-01 to OC-03 before P0. | The page design is the same either way (Product Engineer item 1). Max already holds these items as open P1 questions from the independent review of 8 October 2026. |
| AD-03 | The P0 proof for a TM-filed case with a government fee includes a ceiling increase by two distinct SuperAdmins (K-2P) before authorization. At the default ₹0 ceiling OP-04 shows the specific PARKED notice for the "ordinary paid case at ₹0", not a blanket block. | BS B28 default ceiling is ₹0 and the ordinary paid case at ₹0 is PARKED (BS B43). A two-SuperAdmin increase is an approved product path, not a workaround. Exposure decrease stays PARKED (BS B29). |
| AD-04 | The Recent operations read model is part of the read-model contract. The page keeps only the operation identity, in the page address only, never personal data. After a reload the page reads this model to resume an unresolved command. The model comes from the writer's operation record, not from a projection; when it is unavailable the page shows "Unavailable" and offers no new intent for the same purpose. | BS B35 and BU-14 need reconciliation after a lost acknowledgement. UX §3.3 forbids identity documents in browser persistence, not an opaque operation identity. |
| AD-05 | A SuperAdmin creates and activates TA accounts on SA-06. No self-registration exists. TA eligibility and fraud policy stay PARKED and show a boundary notice on SA-06 and PUB-02. | BS B11 lists approval and activation as SuperAdmin duties. BS B08 and B44 leave eligibility unselected. Engineering default under BS B47; Max may replace it. |
| AD-06 | Ordinary group closure is a Core evaluation. TA-05 shows the closure state and each missing condition as facts. No role has a "Close group" command. | BS B25 states conditions and no actor. Only Core records lifecycle (BS B21). |
| AD-07 | The three ADDED pages are accepted: SH-02 Access and service state page, TA-13 Group setup, SA-10 Notices and account (SuperAdmin). The plan therefore has 47 pages. | Each closes a stated requirement with no other home (UX §4.2, §8.3; BU §4.1; BS B03, B06, B08, B10, B39, B40). |
| AD-08 | PUB-02 has two entry paths, "Travel agent" and "TravelMudra staff". The staff primary factor is an implementer choice; the plan states only "credential, then MFA step". | BS B08 states MFA for staff and names no first factor. |
| AD-09 | OP-02 has five tabs: Work, Application & documents, External actions, Delivery & originals, History. Authorized money facts appear as a money summary panel (CMP-16) inside Work and External actions. A Payments tab is added only when a permitted operator money action exists. | UX §5.3 says "Payments where authorized". No operator money command exists in BS B26–B29. |
| AD-10 | One display timezone, Asia/Kolkata, labelled "IST" beside every time. Timelines show event time and recorded time. A page shows "stale" only when the read model reports lag or degradation; the page never applies a client-side age threshold. Every list and workspace shows "Updated [time]" or "Freshness unavailable". | BS B02 population is resident in India. BS B33 and UX §3.3 make freshness a read-model fact. |
| AD-11 | Breakpoints 1200 px and 768 px are adopted for P0. Revisit after the C08 fixture tests. | UX §7.3 gives bands and no pixel values. |
| AD-12 | The context selector lists only contexts the individual actually holds. An accounting grant is not a context; it shows the B29 boundary notice on OP-10. The product owner's account holds the SuperAdmin context. | UX §7.1; BS B07, B29. |
| AD-13 | SA-09, the generic decision page, records decisions of the exception and approval kind: gate exceptions, Gate 2 decisions, help decisions, deferral decisions, launch, suspension, lift and withdrawal, second approvals (ceiling increase, SuperAdmin elevation), intake issue dismissal, unresolved external outcome, and existing-work treatment. SA-09 has one input set per decision kind; the Gate decision context read model extends to each kind. Fact-recording commands (Create account, Change account status, Grant or revoke read access, Reset credentials, Record service payment, Correct payment record, Record government fee fact, Publish offering values, Record structural approval) are recorded on their own page. List pages link to SA-09 for the decision kinds. | UX §6.3 requires one decision surface with scope, evidence, effect, hard stops, reason and consequence review. |
| AD-14 | Open owner choices use one list, OC-01 to OC-08 (section "Open owner choices"). The UX draft's OC numbering is replaced. Boundaries B-01 to B-10 and assumptions A-01 to A-14 are merged lists. | Two drafts, one plan. |
| AD-15 | UX §8.2 email templates are content inputs (C06), not UI pages. The operator's applicant-contact outcome has no page in this plan; it is a P2 note. | UX §5.3 says no messaging platform is needed. |
| AD-16 | Bulk and non-bulk content are split into two documents. `UI-PLAN.md` holds the shell, the role workspaces, the behavior contract and the build sequence. `BULK-UPLOAD-UI-PLAN.md` holds every BU-P page, the bulk components, the bulk read models and the end-to-end bulk behavior. Commands stay in one table in `UI-PLAN.md`. | BU §1 says builders load the bulk specification only for bulk work. |
| AD-17 | After the independent review (REVIEW-FINDINGS.md), the architect worked the three P0 findings and the P1 findings that correct the plan text (RF-01, RF-02, RF-03, RF-04, RF-05, RF-08, RF-09, RF-10, RF-11, RF-12, RF-13, RF-14, RF-15, RF-16, RF-17). Two P1 items that need a product decision became open owner choices OC-09 (RF-06) and OC-10 (RF-29). One P1 finding is disputed and left as written with a clarification (RF-07). All P2 findings are parked as notes. Edits that come from a finding cite its RF number. | PRI-20260930-01: P0 worked now; P1 to Max, parked or worked; P2 parked. The architect holds decision authority for this plan. |

## 1. Conventions

### 1.1 Command results

**Command results.** Every consequential action sends one command. The page MUST handle exactly three
results (UX §3.3, BS B35):

| Code | Result | The page MUST show |
|---|---|---|
| ACC | Accepted with receipt | Operation receipt (UX §7.4): command identity, accepted time and the resulting facts. Refresh the consuming read models. Announce the result without moving focus. |
| REJ | Rejected with reasons | Error summary linked to the affected fields or items. Preserve the entered input. Show each reason, owner and route. A stale-revision rejection shows the changed facts and **Review current information**. |
| UNR | Unresolved; reconciliation needed | "Checking the original result" with **Check status**. Check status reconciles the same operation identity. The page MUST NOT offer a new submission of the same intent. The page MUST NOT replay an external act. |

**Unavailable action (D5).** When an action is unavailable for a business reason, the page MUST show a
policy boundary notice (UX §7.4) with three parts: reason, owner and route. A disabled control is
explanatory only. The server decides. Notation in this contract: `UNAVAILABLE → reason / owner / route`.

**Operation identity.** The page creates one operation identity when the user first confirms an intent.
Every retry of that intent reuses the identity. A deliberately new intent (for example a deliberate
resend after proven failure) gets a new identity. Section 7 states the per-command rule.

### 1.2 Labels and markers

**Status facts (D4).** Every application header shows common progress, outcome (or "Outcome not
recorded") and next owner/action. Lifecycle, filing/external act, readiness/control, payment, custody and
delivery appear as separate labelled rows (UX §2.2). No combined badge. No percentage. No invented
deadline or SLA (BS B17, B21).

**Unknown is not zero (D7).** Loading, empty, no matches, partial, stale, denied, unavailable and
missing are separate page states. An unavailable count shows "Unavailable". A count still being
discovered shows "Counting…". Neither shows zero (UX §8.3, BU §6.2).

**Boundary labels.** `OWNER CHOICE PENDING (Astra-only source)` marks an item that depends on OD or PD
(D1). `B46 BOUNDARY` marks the unresolved send and completion trigger (D2). `PARKED`, `EXCLUDED`,
`OWNER_DECISION` and `KNOWN_LIMITATION` keep their BS meaning (BS B42–B47).

Conventions used in this document:

- `P0` / `P1` / `P2` follow brief D6. Each page carries its priority.
- `ADDED` marks a page, component, token or rule that the specifications do not state. Each ADDED item names
  the requirement that needs it.
- `OWNER CHOICE PENDING (Astra-only source)` marks an item that depends on OD or PD (brief D1).
- `BOUNDARY` marks a BS B42–B47 item. The UI shows it with a policy boundary notice (CMP-10). The UI does not
  resolve it.
- *read:* names a read model in words. *command:* names a command in words. Every command returns a receipt,
  a rejection with reasons, or an unresolved result (UX §3.3). The server decides every permission (D5).

### 1.3 Page states

Each page uses this template: purpose and entry; content blocks in reading order; one primary action and the
secondary actions; data (*read* / *command*); page states; mobile; sources.

Standard page states. "S1–S7" in a page entry means all seven apply with these rules. A page states any
exception.

| ID | State | Required behavior |
|---|---|---|
| S1 | Loading | Layout-preserving skeleton. No zero, no empty message, no disabled-looking final state (UX §8.3). |
| S2 | Empty | Nothing exists in scope. Explain why and offer the relevant first task (UX §8.3). |
| S3 | No match | Filters exclude every item. Offer "Clear filters". State if items exist in other views (BU §6.2). |
| S4 | Partial | Some facts are unavailable. Show available facts. Show each missing fact as "Unavailable", never zero (D7). |
| S5 | Stale | The read model reports lag or degradation. Show "As of [time]" or "Freshness unavailable". Actions stay offered; the server decides (UX §3.3; BS B33). |
| S6 | Denied | SH-02 denied content. No object facts (SH-R02). |
| S7 | Error | Observed reason category, "Try again", entered input kept. No "Something went wrong" (BU §10.1). |

### 1.4 Command states

Command states. "C1–C5" in a page entry means the page holds a consequential command.

| ID | State | Required behavior |
|---|---|---|
| C1 | Validation failed | Error summary (CMP-07) focused, inline errors, input kept (UX §7.4). |
| C2 | Rejected | Actionable reasons from the server, each with owner or route (UX §3.3). |
| C3 | Accepted | Operation receipt (CMP-08) with command identity, time and resulting facts. |
| C4 | Unresolved | "Checking the original result." Offer "Check status". No new command, no external repeat (UX §3.3; BS B35). |
| C5 | Stale revision | "Changed since your review." Stale revision comparison (CMP-14). No overwrite (UX §3.3; BS B19). |

## 2. Shell and navigation

### 2.1 SH-01 app shell (P0)

| Region | Content | Rules |
|---|---|---|
| Navigation rail | Destinations of the active context (section 2.2) | Deep ink surface with light text. 224–240 px at wide width. Collapses at intermediate width. Opens as a full-height menu on phones. MUST show only destinations that the active context can use (UX §7.1). MUST mark the current location with text weight and the teal indicator, not color alone. |
| Top bar | Scoped search, Notices, Help, individual account menu, context selector, environment label | Search MUST state its scope ("Search your applications"). Search MUST return only items in current scope and MUST NOT leak counts of out-of-scope items (BS B10). Help opens a side panel. Help MUST NOT promise support hours until C13 exists (UX §9). |
| Environment label | Text: "Test environment. Synthetic data only." | MUST show on every page, public pages included, whenever the installation is synthetic or test (UX §7.1, BS B37). MUST NOT be dismissible. ADDED: the browser page title starts with "[TEST]" in a test installation, so screen-reader and tab users also get the label (BS B37). |
| Context selector | The contexts that the individual actually holds | Shows only when the individual holds more than one context (ADDED, UX §7.1). Switching changes the rail and the home page. Switching MUST NOT change permissions and MUST NOT impersonate (UX §7.1). The SA support view is not a context (section 2.3 SH-R09). |
| Breadcrumb and freshness line | Location path; "Updated [time]" or "Freshness unavailable" | Every list and workspace page MUST show freshness of its derived data (UX §3.3, §8.3). |
| Main region | Page content | One `main` landmark. One `h1` per page. |
| Announcement region | Polite announcements | Announces command results and import milestones without moving focus (UX §7.5, BU §5.1). |
| Public header | Text wordmark, "Sign in" | PUB pages only. No rail, no private search (UX §7.1, §8.1). Text-only wordmark until C01 exists. |

### 2.2 Navigation per role

| Role | Rail destination | Page IDs | Who sees it |
|---|---|---|---|
| Public | (public header) | PUB-01, PUB-02 | Anyone |
| TA | Home | TA-01 | Every active TA |
| TA | Services | TA-02, TA-03 | Every active TA |
| TA | Groups | TA-04, TA-05, TA-13, BU-P01–BU-P10 | Every active TA; own groups only |
| TA | Applications | TA-06, TA-07, TA-08, TA-09 | Every active TA; own applications only |
| TA | Notices | TA-10 | Every active TA |
| TA | Payment history | TA-11 | Every active TA; per-application facts only |
| TA | Account (top bar menu) | TA-12 | Every active TA |
| Operator | My work | OP-01 | Every active operator |
| Operator | Applications | OP-01 view "All assigned"; OP-02–OP-07 | Assigned applications; read-grant groups in a labelled read-only section (UX §5.2) |
| Operator | Incidents and follow-up | OP-08 | Every active operator; owned and assigned-scope incidents |
| Operator | Originals | OP-09 | Only when the operator's scope includes a declared physical route (UX §5.2, BS B30) |
| Operator | Notices and account | OP-10 | Every active operator |
| SuperAdmin | Home | SA-01 | Every active SA |
| SuperAdmin | Work queues | SA-02, SA-03 | Every active SA |
| SuperAdmin | Applications & groups | SA-04 (and SA-09 from context) | Every active SA |
| SuperAdmin | Offerings & launch | SA-05 | Every active SA |
| SuperAdmin | Accounts & access | SA-06 | Every active SA |
| SuperAdmin | Money & exposure | SA-07 | Every active SA |
| SuperAdmin | Incidents & audit | SA-08 | Every active SA |
| SuperAdmin | Notices and account (top bar menu) | SA-10 (ADDED) | Every active SA |
| All signed-in | (no rail entry) | SH-02 (ADDED) | Shown when access or service state prevents a page |

The rail MUST NOT include a destination for a PARKED capability. Example: no Accounts dashboard (BS B29, B43).

### 2.3 Scope, deep links, denied and revoked access

- SH-R01. Every page load, deep link, search result, background result and download MUST be authorized against
  current account state, owning TA, assignment and exact read grant (BS B10). The UI MUST NOT cache a prior
  decision as authority.
- SH-R02. A deep link to an object out of scope MUST show SH-02 "denied" without the object's name, ID echo,
  group, country or existence (BS B08, B10).
- SH-R03. A signed-out deep link MUST go to PUB-02. After sign-in the UI MUST return to the link only if it is
  still in scope. Otherwise the UI MUST show SH-02 "denied" (UX §8.3).
- SH-R04. When access is revoked, suspended or reassigned, the next read or command MUST remove restricted
  content from the page. The UI MUST then show SH-02 with the reason category "Your access changed" (UX §3.3,
  §8.3; BS B10).
- SH-R05. Background results (import progress, receipts, notices) MUST stop updating for a user who lost scope.
  Old operation-result links MUST deny (BS B10).
- SH-R06. Filter, sort, page, selected tab and selected item MUST be part of the page address. Back and
  breadcrumb MUST restore them (UX §4.2; BU §3.2, §6.2). The address MUST hold only opaque identifiers and
  enumerated filter values. It MUST NOT hold search text or personal data (BS B33; RF-12).
- SH-R07. Groups and Applications are two views of the same applications. Opening an application from either
  view MUST return to the originating view (UX §4.2).
- SH-R08. A business-unavailable action MUST show a policy boundary notice or an explanation with reason, owner
  and route (D5, UX §7.4). The action MUST NOT be hidden when the user would expect it in that place. A
  role-forbidden action (an action the role never has) MUST NOT appear as an unlockable control (UX §7.4).
- SH-R09. The SA support view (SA-06) MUST show the banner "Read-only view for [individual]" on every page in
  that mode, MUST show no target-user actions and MUST offer "Exit support view" (UX §6.3; BS B10).
- SH-R10. A read grant MUST show "Read-only access: [purpose], until [end]" and MUST NOT add actions (UX §2.3).
- SH-R11. After a session revocation (for example a TA email change) the UI MUST go to PUB-02 with the message
  for that cause (BS B09).
- SH-R12. Identity documents and extracted personal data MUST NOT be kept in browser storage beyond the
  authenticated page. Unsent safe form input MAY be kept in memory for the page (UX §3.3).

### 2.4 Shell pages

**SH-02 Access and service state page** · P0 · ADDED
- Required by: UX §8.3 (revoked access and session; maintenance and restore rows), BS B10, B39, B40. No listed page holds these full-page states.
- Variants: denied ("You do not have access to this page." + link to own home); access changed (SH-R04); signed out; not found (same text as denied for out-of-scope objects); maintenance ("TravelMudra is closed for maintenance." No case data, no restore control).
- Primary: "Go to your home" or "Sign in". States: the variants. Mobile: single column.

## 3. Page inventory (non-bulk)

### 3.1 Public

**PUB-01 Public entry page** · P0
- Purpose: explain the B2B service and supported population, list static supported countries, direct TAs to sign in. Who: anyone and crawlers. Entry: site root at `b2b.travelmudra.co`, search results.
- Blocks: public header → value statement → what the service does → who it serves (Indian ordinary-passport holders resident in India; tourism and business) and excluded visa types → static country and scope information → process explanation → sign-in entry → verified business and contact details → footer.
- Primary: "Sign in". Secondary: section anchors; contact details.
- Data: static approved content only. No live catalogue prices, no case search, no launch internals (BS B01).
- States: static page; S1–S7 do not apply. "Country list not approved": omit the list block; do not show candidate countries (UX §8.1; BS B02). "Verified locality missing": omit structured data and the address block until C02 exists. Account request route: BOUNDARY (BS B08, B44); show contact details only.
- Mobile: single column; header holds wordmark and "Sign in".
- Sources: BS B01, B02; UX §8.1. Search readiness: crawlable rendered HTML, unique title and description, canonical HTTPS URL, sitemap, robots rules, structured data with verified locality, crawl check in the verification record.

**PUB-02 Sign-in** · P0
- Purpose: authenticate one individual. Who: TA (email and OTP), operator and SA (MFA). Entry: PUB-01, signed-out deep link, session revocation.
- Blocks: "Sign in" heading → path choice "Travel agent" / "TravelMudra staff" (ADDED, see AD-08) → TA path: email field → server CAPTCHA region when required → "Send code" → code field → "Sign in". Staff path: primary factor → MFA step.
- Primary: "Send code" then "Sign in". Secondary: "Request a new code" after expiry; "Lost access to your email?" → policy boundary notice (BS B09, B44).
- Data: *command:* request sign-in code; verify code; verify staff factors.
- States: code requested ("If this account can sign in, we will send a code."); code expired ("This code has expired. Request a new code."); attempts exhausted (no account disclosure); CAPTCHA or provider unavailable (truthful unavailable, no bypass); session revoked; signed out after email change ("Sign in with your new email address."); maintenance → SH-02. S1–S6 do not apply.
- Mobile: single column; code field accepts paste and one-time-code autofill.
- Sources: BS B08, B09; UX §7.5, §8.2. CAPTCHA provider: OWNER CHOICE PENDING (Astra-only source).

### 3.2 Travel Agent

**TA-01 Home** · P0
- Purpose: show what needs this TA's action now. Entry: sign-in, rail.
- Blocks: context line → "Needs your action" list (application, action, reason, recorded date) → upcoming travel-risk notices → recent result and closure notices → "Browse services" shortcut.
- Primary: open the first "Needs your action" item. Secondary: open any item; "Browse services".
- Data: *read:* TA action list; TA travel-risk notices; TA recent notices.
- States: S1–S7. S2 teaches the sequence: choose a service, create a group, add applicants. S2 MUST NOT invent a country or counts.
- Mobile: action items as cards: identity, then action.
- Sources: UX §4.2, §7.3; BS B01, B17, B21.

**TA-02 Services list** · P0
- Purpose: discover country and service offerings. Entry: rail, TA-01.
- Blocks: country filter → offering rows (country, service, service mode, availability fact: "Available for new applications" / "Information only" / "Not available", reason).
- Primary: open a service. Secondary: filter by country.
- Data: *read:* TA offering catalogue view.
- States: S1–S7. "No service selectable": "No service is currently available for new applications in this scope." No wait-list promise.
- Mobile: rows become cards.
- Sources: UX §3.1, §4.1, §4.2, §4.4; BS B01, B05, B07.

**TA-03 Service detail** · P0
- Purpose: decide whether TravelMudra can handle this request. Entry: TA-02, TA-01 shortcut.
- Blocks: identity (country, service, mode, who files) → availability fact → eligibility → inclusions and exclusions → cost → processing estimate (guidance, not SLA) → document checklist (PDF/JPEG/PNG, 5 MB each, narrower if declared) → process overview.
- Primary: "Start an application" (choose or create group, then BU-P01). Secondary: "Add applicants in bulk"; "View requirements".
- Data: *read:* offering detail for TA.
- States: S1, S4, S6, S7. Not selectable: policy boundary notice with reason (suspended, withdrawn, not launched, declaration incomplete). Undeclared content: "Not declared"; the offering then MUST NOT be selectable (BS B05).
- Mobile: sections stacked; primary action at the end of the identity block.
- Sources: UX §3.1, §4.1; BS B01, B04, B05, B07, B15.

**TA-04 Groups list** · P0
- Purpose: see groups and their next actions. Entry: rail.
- Blocks: filters (country, open/closed) → group rows (name, country, travel dates, application counts by common progress with unit "applications", unresolved intake issue count, next action).
- Primary: "Create group" (TA-13). Secondary: open group.
- Data: *read:* TA group list.
- States: S1–S7. Unknown counts show "Unavailable".
- Mobile: group cards.
- Sources: UX §4.2; BS B03, B25.

**TA-05 Group detail** · P0
- Purpose: coordinate the independent applications and intake work of one group. Entry: TA-04, breadcrumbs, BU pages.
- Blocks: context band (CMP-24) → group closure fact (open; closed; ended-with-group count) → tabs: Applications (rows as TA-06), Imports (BU-P09), Intake issues (unresolved issues, including rows with no application).
- Primary: "Add applicants" (BU-P01). Secondary: "Edit travel dates" (TA-13); open application, import or issue.
- Data: *read:* group detail; group applications; group imports; group intake issues.
- States: S1–S7. Closed group: read-only with history. No "Submit all" exists (UX §4.2).
- Mobile: tabs become a labelled select.
- Sources: UX §4.2; BU §3.2; BS B03, B06, B16, B25.

**TA-06 Applications list** · P0
- Purpose: find any own application across groups. Entry: rail.
- Blocks: search → filters (needs action, country, service, common progress) → rows (applicant, application ID, group, country and service, common progress, outcome, next owner and action, travel date).
- Primary: open application. Secondary: filters; sort.
- Data: *read:* TA application list.
- States: S1–S7.
- Mobile: cards: applicant and ID → next action → progress and outcome.
- Sources: UX §4.2; BS B21.

**TA-07 Application workspace** · P0 (variations P1)
- Purpose: show what is known, what is needed, who acts next. Entry: TA-01, TA-05, TA-06, TA-10, BU-P10.
- Blocks: identity band (CMP-11) → status facts group (CMP-03) → action panel (CMP-01) → application facts and documents (CMP-02 rows) → timing (quote, original estimate, current forecast, each separate) → payment facts summary → result and delivery → originals (physical route only) → scoped history (CMP-09).
- Primary: the action panel's one action. Examples: "Continue draft" (TA-09); "Review and submit" (TA-08); "Review return request"; "Decide on the price change"; "Download result"; "Report a problem" (assigned, not returned). Secondary: "Request help"; "Request withdrawal" (when the server reports it eligible); "View group".
- Data: *read:* TA application workspace. *command:* report a problem; request help; respond to price-authority request; acknowledge timing decision; request withdrawal; retrieve result file.
- States: S1–S7; C1–C5. Specific: assigned and not returned (read-only; "This application is with your operator. Report the problem so it can be returned for correction."); formally returned (what changed and what evidence remains); price increase decision (prior price, proposed price, reason, choice); travel-risk notice (acknowledge only when a decision is required); issued with artifact missing; email uncertain ("The email result is not confirmed. TravelMudra is checking the send attempt."); filing outcome being checked (no "not filed" label); dependency wait (no sibling facts); preparation-only packet handed over; offering withdrawn or suspended with treatment per action; completed with continuing duty ("Processing completed. Financial follow-up remains open.").
- Mobile: identity → action panel and blockers → status facts → sections → history.
- Sources: UX §2.2, §2.3, §3.2, §4.3, §4.4, §7.3; BS B12, B17–B24, B31.

```text
Applications / TM-DEMO-0042                                     Updated 10:42 [tz]
[Synthetic applicant] · Group [Synthetic group] · [Country] · [Service] · TravelMudra files
Progress: With TravelMudra   Outcome: Outcome not recorded   Next: Assigned operator
────────────────────────────────────────────────────────────────────────────────
Next action                                    | Timing
This application is with your operator.        | Quote: ₹[amount], fixed at submission
Report the problem so it can be returned.       | Original estimate: [date range]
Owner: [operator name]                          | Current forecast: [date] (separate)
[Report a problem]                              | Payment
                                                | Service payment: Not recorded
Application and documents                       | Result and delivery
Passport · version 2 · Accepted evidence        | No result recorded
Photo · version 1 · Unreadable                  | Originals: not part of this service
────────────────────────────────────────────────────────────────────────────────
History · actor · event time · recorded time
```

**TA-08 Review and submit (check answers)** · P0
- Purpose: authorize one application at the right price. Entry: TA-07, TA-09.
- Blocks: applicant and service identity → governing offer summary → evidence per declared control (accepted, missing, conflict) → quoted price → original estimate that submission starts → unpaid facts → authority and consent confirmation (never prechecked; wording C05).
- Primary: "Submit this application". Secondary: "Change" links per section (values kept); "Request help" (separate, never a submission).
- Data: *read:* application review summary. *command:* submit application with authority confirmation; request help.
- States: S1, S4, S6, S7; C1–C5. Offering became unavailable: boundary notice, no submission. Receipt: application, submission time, quote, original estimate, next owner ("Application submitted. Operator assignment is pending.").
- Mobile: sections stacked; confirmation and primary action at the end, not in a fixed bar.
- Sources: UX §3.1, §4.3, §7.5; BS B17, B20.

**TA-09 Individual intake (task list)** · P0
- Purpose: prepare one applicant's draft. Entry: BU-P01 "Individual entry", TA-07 "Continue draft".
- Blocks: context band → task list (CMP-04): group and service, applicant facts, required documents, evidence results, review → current section form.
- Primary: "Save and continue" for the current section. Secondary: "Save and exit"; "View requirements"; "Request help".
- Data: *read:* draft application; offering requirements. *command:* save draft section; upload document; change identity field with same-person evidence.
- States: S1, S4, S6, S7; C1–C5. Specific: offering not selectable (no draft created, BS B07); upload not accepted; document processing; identity field change needs evidence (BS B19). Save reports the accepted scope only.
- Mobile: task list first; each section is a full-screen page.
- Sources: UX §4.3, §7.4, §7.5; BS B14, B15, B19.

**TA-10 Notices** · P0
- Purpose: list in-product notices, return requests and decisions. Entry: rail, top bar.
- Blocks: filters (needs decision, unread) → notice rows (CMP-21).
- Primary: open the underlying work. Secondary: "Acknowledge" only when a TA decision requires it; mark read.
- Data: *read:* TA notices. *command:* acknowledge decision notice.
- States: S1–S7. Read status and acknowledgement are separate facts.
- Mobile: notice cards.
- Sources: UX §4.2; BS B17, B31.

**TA-11 Payment history** · P1
- Purpose: inspect money facts per application. Entry: rail.
- Blocks: filters (group, application) → rows (application, quote, service payment fact, government fee and recovery facts where authorized) → correction history with original entries.
- Primary: open application money detail. Secondary: filters.
- Data: *read:* TA payment facts.
- States: S1–S7. No "Pay now", refund, write-off or credit control (BS B26, B42, B43).
- Mobile: per-application cards.
- Sources: UX §4.2; BS B26, B27, B29.

**TA-12 Account and two-proof email change** · P1
- Purpose: show identity and change the delivery and sign-in email. Entry: top bar account menu.
- Blocks: name and current email → session information where supported → "Change email" → step 1 code at current address → step 2 code at new address → result.
- Primary: "Change email". Secondary: "Sign out"; "Lost access to your current email?" → boundary notice (BS B09, B44).
- Data: *read:* TA account. *command:* start email change; verify current-address code; verify new-address code.
- States: S1, S6, S7; C1–C4. Pending: "Your sign-in and document email remain [current address] until both addresses are verified." Success: sessions revoked → PUB-02.
- Mobile: steps as full-screen pages.
- Sources: UX §4.2, §4.4; BS B09.

**TA-13 Group setup (create group; edit travel dates)** · P0 · ADDED
- Required by: UX §4.2 Groups ("Create group", "review permitted travel-date edit and its affected-work recheck"), BU §4.1 (create-group shortcut returns to source setup), BS B03, B06. No listed page holds these forms.
- Blocks: create mode: country → group name → travel dates → review. Edit mode: current dates → new dates → affected unfiled applications preview → review.
- Primary: "Create group" / "Save travel dates". Secondary: "Cancel" returns to the origin.
- Data: *command:* create group; change group travel dates. *read:* travel-date impact preview.
- States: C1–C5. Country change: explain that a new group is needed (BS B03). Filed facts stay historical.
- Mobile: full-screen task page.
- Sources: as above.

Bulk upload pages BU-P01 to BU-P10 are specified in BULK-UPLOAD-UI-PLAN.md.

### 3.3 Operator

**OP-01 My work queue with saved views** · P0
- Purpose: choose the next accountable task. Entry: sign-in, rail.
- Blocks: title and freshness → saved view tabs (CMP-20): Action now, Waiting, Returned to TA, Delivery and closure, Continuing duties, All assigned → filters → rows: application, service, current task, blocker, owner, recorded review point → pagination. Read-grant groups appear in a separate labelled read-only section.
- Primary: open the first row in "Action now". Secondary: change view; filter; search.
- Data: *read:* operator assigned-work queue.
- States: S1–S7. Alert order: blocked or protected action first; recorded travel risk and overdue review second; ordinary task third. No red badge on ordinary waits.
- Mobile: rows as identity and next-action cards.
- Sources: UX §5.2, §5.4, §7.3; BS B10, B21, B33.

```text
My work                                               Updated 10:41 [tz]
Action now (7) | Waiting (12) | Returned to TA (3) | Delivery and closure (2) | Continuing duties (1)
Filter: [Country ▾] [Service ▾] [Blocker ▾]                          1–7 of 7
──────────────────────────────────────────────────────────────────────────────
Application        Service        Current task               Blocker             Review point
TM-DEMO-0042  ⚠   [service]      Execution uncertain         Reconcile first     —
TM-DEMO-0051       [service]      Review returned documents   Readiness unconfirmed  14 Oct
TM-DEMO-0063       [service]      Record outcome              —                   —
──────────────────────────────────────────────────────────────────────────────
Waiting rows say who acts: "TA must act", "SuperAdmin decision needed",
"External evidence awaited", "No current action; next review [date]".
```

**OP-02 Application workspace** · P0
- Purpose: one case, its evidence and its safe next action. Entry: OP-01, OP-08, notices.
- Blocks: identity band (applicant, masked identity cue, application ID, country, service, mode, TA, assigned operator) → status facts group → tabs: Work (current task, readiness checklist CMP-15, action panel), Application & documents (evidence rows; approved assistance editable scope), External actions (OP-04), Delivery & originals (OP-05, OP-06, OP-07, custody summary), History (CMP-09). Authorized money facts appear as a money summary panel (CMP-16) inside Work and External actions (AD-09).
- Primary: the action panel's one action (examples: "Confirm readiness", "Return to TA", "Request authorization for [external action]", "Record outcome", "Review result send"). Secondary: "Flag to SuperAdmin"; open a tab; "Return for TA review" (approved assistance only).
- Data: *read:* operator application workspace. *command:* confirm readiness; save assistance entry; return for TA review.
- States: S1–S7; C1–C5. Specific: TA reported a problem (filing and packet release blocked until readiness is reconfirmed); approved assistance (editable scope labelled); action allowed by exception (scope stated, not "Payment received"); readiness reconfirmation required after reassignment; execution uncertain (repeat, payment and ordinary withdrawal removed); dependency wait; offering hold. A tab MUST NOT hide an unresolved primary blocker.
- Mobile: identity → action panel and blockers → tab select → content.
- Sources: UX §2.2, §2.3, §5.3, §7.3; BS B18–B23.

```text
My work / TM-DEMO-0051                                            Updated 10:42 [tz]
[Synthetic applicant] · Passport ••••42 · [Country] · [Service] · TravelMudra files
TA: [synthetic agency] · Operator: you
Progress: With TravelMudra   Outcome: Outcome not recorded   Next: you — confirm readiness
Work | Application & documents | External actions | Delivery & originals | History
────────────────────────────────────────────────────────────────────────────────
Readiness checklist                           | Next action
Mandatory validation  ✓ evidence accepted      | Owner: you
Payment Gate 1        Action allowed by        | Returned documents were corrected.
                      exception (assignment)   | Reconfirm readiness before filing.
Dependency            ⧗ upstream outcome       | [Confirm readiness]
                      awaited · owner: you     |
Cut-off               Before [recorded date]   | Other duties: 1 incident
────────────────────────────────────────────────────────────────────────────────
History · actor · event time · recorded time · evidence
```

**OP-03 Return to TA / flag to SuperAdmin** · P0 (return); P1 (flag, assistance return)
- Purpose: route a correction or decision to its owner. Entry: OP-02.
- Blocks: mode choice → Return: fields and documents affected, rationale, what the TA must supply → Flag: decision needed, evidence, affected action → effect statement ("Filing authorization and packet release stay blocked until you reconfirm readiness.") → review and confirm.
- Primary: "Return to TA" / "Flag to SuperAdmin". Secondary: "Cancel".
- Data: *command:* return application to TA; flag application to SuperAdmin.
- States: C1–C5. Approved assistance return uses "Return for TA review", never "Submit for TA".
- Mobile: full-screen task page.
- Sources: UX §2.3, §3.2, §5.3; BS B18.

**OP-04 External action authorization, execution evidence and reconciliation** · P0
- Purpose: perform the declared external act once. Entry: OP-02 External actions tab.
- Blocks: review: application, service, mode and declared actor, governing facts, TA authority, Gate 2 and exposure check (TM-funded fee only), external action, reconciliation owner → after acceptance: authorized manual step → "Record external action evidence" → "Execution is uncertain" path → reconciliation panel (attempts, evidence, owner, next step).
- Primary: before authorization "Request authorization for [action]"; after it "Record external action evidence". Secondary: "Execution is uncertain"; "Record handoff" (third-party mode); "Record packet handover" (preparation-only).
- Data: *read:* external action status. *command:* request action authorization; record execution evidence; record uncertain execution; record positive non-execution evidence.
- States: S1, S4, S6, S7; C1–C5. Specific: Gate 2 required (route to SA-09); exposure ceiling breach (non-overridable stop, no exception offered); one of the three B28 parked cases (boundary notice); authorization accepted, not executed; execution uncertain ("Filing outcome is unknown. Do not repeat the external action. [Owner] is reconciling the evidence."); reconciled.
- Mobile: review as stacked sections; consequence review full screen.
- Sources: UX §3.1 step 6, §5.3; BS B04, B23, B27, B28, B43, B45.

**OP-05 Outcome and artifact association** · P0
- Purpose: record the outcome and associate the exact artifact. Entry: OP-02 Delivery & originals.
- Blocks: outcome record (allowed values only) → artifact review: claimed type and version, extracted name and passport evidence, exact application candidate, contradictions → association decision.
- Primary: "Record outcome" / "Confirm association". Secondary: "Open association incident" (the server opens it when automatic association fails; the operator may open it on a contradiction; a SuperAdmin assigns the reviewer on SA-02).
- Data: *read:* artifact candidates and evidence. *command:* record outcome; confirm association; open association incident.
- States: S1, S4, S6, S7; C1–C5. Specific: missing or multiple candidates (incident, no "accept best match"); replaced version (eligibility lost); issued without correct artifact (outcome kept, delivery blocked, owner named).
- Mobile: evidence then decision, stacked.
- Sources: UX §5.3; BS B12, B13, B21.

**OP-06 Send result (preview, per-file recheck, receipt)** · P0 surfaces; trigger BOUNDARY
- Purpose: show exactly what would be sent, to whom, and what happened. Entry: OP-02 Delivery & originals; OP-01 Delivery view.
- Blocks: application identity → recipient: current TA account email (read-only text) → files: type, version, availability, per-file eligibility → notice requirement → prior attempts (CMP-18) → send trigger region → receipt (included, unavailable, failed, channel results) → uncertain-email panel (attempt time, safe correlation, evidence, investigation owner).
- Primary: none until the trigger is decided. The trigger region shows CMP-10: "Starting a result send is unavailable until the product owner decides the event that starts it (B46). Owner: product owner." Secondary (P1, WP-19): "Record a manual email (not system-verified)" per AD-01.
- Data: *read:* delivery preview; delivery attempts and evidence. *command:* none for send while B46 is open.
- States: S1–S7. Specific: file unavailable, replaced or blocked (exact reason, no substitution); recipient changed since preview (preview refreshes); proven failure; uncertain delivery ("Email delivery is uncertain. No automatic resend will occur."). Resend after uncertainty: BOUNDARY (BS B46); OD §4 privileged resend is OWNER CHOICE PENDING (Astra-only source).
- Mobile: files as cards; receipt stacked.
- Sources: UX §5.3, §7.4; BS B12, B24, B31, B45, B46.

**OP-07 Request completion** · P0 surfaces; trigger BOUNDARY
- Purpose: show completion prerequisites and their evidence. Entry: OP-02; OP-01 Delivery and closure view.
- Blocks: prerequisite list (outcome; document email and web notice evidence for a TravelMudra-held result; originals owner receipt; artifact blocks; failed validation) each with evidence, owner, action → continuing duties shown as not blocking (financial follow-up, open operational incident) → trigger region → Core result (completed, or blockers).
- Primary: none until decided. The trigger region shows CMP-10: "The trigger and owner of the completion check are not decided (B46). Owner: product owner." An explicit operator "Request completion" command is OWNER CHOICE PENDING (Astra-only source, OD §3).
- Data: *read:* completion prerequisites; lifecycle and completion facts.
- States: S1–S7. Specific: completed ("Processing completed." plus continuing duties); blocked with named prerequisites. No force-complete control. No auto-complete claim.
- Mobile: prerequisites as a stacked list.
- Sources: UX §3.1 step 9, §5.3; BS B21, B24, B25, B29, B46.

**OP-08 Incidents and follow-up** · P1
- Purpose: work owned operational duties. Entry: rail; OP-02.
- Blocks: filters (type, linked application, open) → incident rows (type, scope, owner, next action, linked completed case flag) → detail: evidence, affected versions and recipients, notices evidence, correction evidence, closure conditions.
- Primary: open incident; in detail, the incident's next action. Secondary: assign reviewer (where permitted); record notice evidence.
- Data: *read:* operator incidents. *command:* record incident evidence; record correction or notice evidence; close incident.
- States: S1–S7; C1–C5. Closure needs correction and notice evidence (BS B13). No recall claim.
- Mobile: cards; detail full screen.
- Sources: UX §5.2; BS B13, B23, B25.

**OP-09 Originals register** · P1
- Purpose: record item-level custody. Entry: rail (physical route only); OP-02.
- Blocks: item rows (CMP-17) → item detail: positive association, holder and location or "Holder uncertain", movements, linked applications, return evidence.
- Primary: "Record receipt" / "Record movement" / "Record return" for the selected item. Secondary: filters.
- Data: *read:* scoped originals. *command:* record item receipt; record movement; record return to owner.
- States: S1–S7; C1–C5. Parked route policy steps (shared-item return priority, recipient evidence, loss and damage): boundary notice (BS B30, B44). Partial return stays partial.
- Mobile: item cards.
- Sources: UX §2.2, §5.2; BS B19, B30.

**OP-10 Notices and account (MFA)** · P1
- Purpose: work notices, identity, MFA. Entry: rail.
- Blocks: notices list → account: name, role, MFA status → accounting grant section when held.
- Primary: open notice. Secondary: MFA management where supported; "Sign out".
- Data: *read:* operator notices; account.
- States: S1–S7. Accounting grant: boundary notice "Accounting actions are not yet defined (B29, B43). Owner: product owner."
- Mobile: stacked.
- Sources: UX §5.2; BS B08, B29.

### 3.4 SuperAdmin

**SA-01 Decision inbox** · P0
- Purpose: show which decision or assignment unblocks work. Entry: sign-in, rail.
- Blocks: freshness → decision groups with scoped counts and units: unassigned and ownerless work; help requests; launch and impact decisions; permitted exceptions requested; pending second-SA approvals; significant incidents; unresolved delivery; travel risk; reporting gaps.
- Primary: open the first decision in the top group. Secondary: open any group.
- Data: *read:* SA decision inbox.
- States: S1–S7. Counts unavailable: "Unavailable".
- Mobile: groups as stacked lists.
- Sources: UX §6.2; BS B18, B21, B32, B33.

**SA-02 Work queues** · P0
- Purpose: own every queue. Entry: rail; SA-01.
- Blocks: views: Submitted unassigned (Gate 1 fact per row), Help requests, Assignment and reassignment, Dependency waits, Delivery and closure ownership, Deferred review, Intake issues (BU §3.2) → batch selection bar (CMP-26) → rows.
- Primary: "Assign selected" (SA-03). Secondary: "Approve or decline help" (SA-09); open application; dismiss intake issue with reason (SA-09).
- Data: *read:* SA work queues.
- States: S1–S7. Delivery and closure ownership view: fallback delivery ownership is OWNER CHOICE PENDING (Astra-only source).
- Mobile: rows as cards; batch selection per page only.
- Sources: UX §6.2, §6.3; BU §3.2, §8.2; BS B16, B18, B19, B22.

**SA-03 Assignment and reassignment decision** · P0
- Purpose: assign explicit applications to one accountable operator. Entry: SA-02.
- Blocks: selected applications → per-application Gate 1 eligibility and unresolved duties → operator choice or "Use round robin" → reason (where required) → reassignment preview: old and new operator, custody holder unchanged, duties transferred, readiness reconfirmation required → consequence review → per-application receipt.
- Primary: "Assign [N] applications" / "Reassign". Secondary: remove an application from the selection.
- Data: *read:* assignment eligibility. *command:* assign applications; reassign application.
- States: C1–C5. Ineligible items listed with reason (Gate 1 not passed). Assignment is not payment and moves no original.
- Mobile: full-screen task page.
- Sources: UX §6.3; BS B18, B19, B26.

**SA-04 Applications & groups oversight** · P1 (P0 for read access)
- Purpose: authorized oversight, history and bounded decisions. Entry: rail; SA-01.
- Blocks: search and filters → application or group detail in the OP-02 layout without operator actions → full history → decision entry points.
- Primary: open application. Secondary: "Correct from evidence" (exceptional); "Approve deferral"; "Record withdrawal request"; "Authorize unresolved external outcome" — each via SA-09.
- Data: *read:* SA application oversight. *command:* via SA-09.
- States: S1–S7. Filing and readiness controls show "The assigned operator makes this judgment" (BS B18).
- Mobile: as OP-02.
- Sources: UX §6.2; BS B18, B21, B23, B24, B25.

**SA-05 Offerings & launch** · P0 (launch and suspend); P1 (impact, structural transition)
- Purpose: make offerings safe to admit. Entry: rail.
- Blocks: offering list → detail with four panels: definition and binding; effective business values; readiness evidence (including B32 measures, support hours, escalation, capacity, fallback); launch and admission (scope, suspension) → publication impact preview (old and new values, price and timing, affected unfiled applications, unknown applicability) → existing-work treatment.
- Primary: depends on panel: "Publish values", "Launch", "Suspend", "Lift suspension" (each via SA-09). Secondary: view impact; record existing-work treatment.
- Data: *read:* offering administration view; impact preview. *command:* publish business values; launch scope; suspend; lift; record existing-work treatment.
- States: S1–S7; C1–C5. Readiness stage names: OWNER CHOICE PENDING (Astra-only source, OD §6). Missing B32 launch facts block launch with reasons.
- Mobile: panels stacked; impact list scrolls in a labelled region.
- Sources: UX §6.1, §6.3; BS B05–B07, B32.

**SA-06 Accounts & access** · P0 (approve, activate, suspend); P1 (others)
- Purpose: keep identity and access trustworthy. Entry: rail.
- Blocks: account list → account detail: individual, role, status, grants, request actor, pending second approval → actions → read grants (purpose, duration) → support view entry.
- Primary: the account's next lifecycle action, or "Create account" from the list. Secondary: "Grant read access"; "Start support view"; "Reset credentials"; "Approve elevation (second SuperAdmin)".
- Data: *read:* account administration. *command:* approve, activate, suspend, restore account; grant or revoke read access; reset credentials; request or approve elevation.
- States: S1–S7; C1–C5. Operator suspension lists unresolved duties needing audited reassignment. Boundaries: TA eligibility and fraud policy, first-admin and all-admin-loss recovery, lost mailbox (BS B44). No email overwrite.
- Mobile: stacked.
- Sources: UX §6.1, §6.3; BS B08–B11.

**SA-07 Money & exposure** · P0 (Gate 1 entry, Gate 2 decision); P1 (other)
- Purpose: record money facts without inventing finance policy. Entry: rail; SA-02 Gate 1 links.
- Blocks: per-application money facts (CMP-16) → manual service-payment entry and correction → Gate 2 requests → TA exposure (ceiling, counted reserved, TM-paid unrecovered) → ceiling change → `Payment_Missing_Override` follow-up list → B28 parked cases.
- Primary: "Record payment" for the selected application. Secondary: "Decide Gate 2" (SA-09); "Lower ceiling"; "Request ceiling increase" (second SA).
- Data: *read:* money facts; TA exposure. *command:* record payment entry; correct payment entry; lower ceiling; request and approve ceiling increase.
- States: S1–S7; C1–C5. Boundaries: Accounts dashboard and actions, refund, write-off, formula (BS B29, B43). B28 parked cases: specific notice, not a blanket block.
- Mobile: per-application cards; exposure summary first.
- Sources: UX §6.2, §6.3; BS B26–B29, B43.

**SA-08 Incidents & audit** · P1
- Purpose: resolve incidents and read the full audit. Entry: rail.
- Blocks: incidents (as OP-08 with assignment) → audit search (event time and recorded time, actor, subject, evidence) → reporting and diagnostic degradation.
- Primary: open incident. Secondary: assign incident owner.
- Data: *read:* SA incidents; full audit. *command:* assign incident owner; record decision.
- States: S1–S7. Audit and support view stay distinct. No restore or "Reopen system" control (BS B40).
- Mobile: stacked; audit table scrolls in a labelled region.
- Sources: UX §6.2, §6.3; BS B13, B33, B39, B40.

**SA-09 Gate exception decision (generic decision page)** · P0
- Purpose: record one bounded, reasoned decision. Entry: SA-01, SA-02, SA-04, SA-05, SA-06, SA-07.
- Blocks: exact scope (application, named gate, specific action) → supporting evidence → effect: what the decision changes, what stays unchanged → hard stops that no decision can pass → reason and approval fields → consequence review → receipt.
- Primary: the decision verb ("Record Gate 1 exception for assignment"). Secondary: "Cancel"; open evidence.
- Data: *read:* decision context for the scope. *command:* the decision.
- Decision kinds: Gate 1 exception; Gate 2 decision; approve or decline help; approve deferral; launch, suspend, lift; ceiling increase second approval; SA elevation second approval; dismiss intake issue; authorize `external_outcome_unresolved` completion; existing-work treatment. Fallback delivery ownership: OWNER CHOICE PENDING (Astra-only source).
- States: S1, S4, S6, S7; C1–C5. Non-overridable controls (mandatory validation, fixed cut-off, exposure ceiling) show "No exception exists for this control" and no form.
- Mobile: full-screen; scope and effect before fields.
- Sources: UX §6.3, §7.3; BS B07, B11, B18, B20, B23, B26–B28.

```text
Work queues / TM-DEMO-0071 / Gate 1 exception
Scope   Application TM-DEMO-0071 · Gate: Payment Gate 1 · Action: assignment and operator work
Evidence  Service payment: Not received (recorded 9 Oct, [SA name]) · Help request approved
This decision allows:   assignment and operator work on this application only
This decision does not: record payment · confirm TA authority · assert readiness · pass Gate 2
Hard stops still apply: mandatory validation · cut-offs · exposure ceiling
Reason (required)  [                                                         ]
A financial follow-up will stay open until payment or authorized write-off.
[Review decision]  →  consequence review  →  [Record Gate 1 exception]
```

**SA-10 Notices and account (SuperAdmin)** · P1 · ADDED
- Required by: BS B08 (SA uses MFA), UX §7.1 (top bar holds the individual account). UX §6.2 lists no SA account page.
- Blocks: notices → name, role, MFA status → "Sign out".
- Primary: open notice. Data: *read:* SA notices; account. States: S1–S7. Mobile: stacked. Sources: as above.

## 4. Journeys

### 4.1 Standard new case (UX §3.1)

Preconditions S0 (not part of the case): a SuperAdmin has launched the offering for the exact scope
(SA-05, Launch offering command, BS B07). A SuperAdmin has activated the TA account (SA-06, BS B11).

| # | Actor | Page | Command | Result | What the other roles see next |
|---|---|---|---|---|---|
| 1 | TA | PUB-02 | Request sign-in code; Verify sign-in code | ACC: session opens in TA context; TA-01 shows. REJ: neutral copy that does not disclose account existence; expired or used code; attempt limit. UNR: not applicable; the TA requests a new code under current controls (BS B08). | Nothing. |
| 2 | TA | TA-02, TA-03 | None (read) | Selectable offering shows **Start an application**. Information-only or unavailable offering shows a boundary notice (BS B07). | Nothing. |
| 3 | TA | TA-04 or TA-05 | Create group | ACC: receipt with group ID, country and travel dates; TA-05 opens. REJ: field errors. UNR: Check status; no second group. | SA-04 lists the group. |
| 4 | TA | TA-09 | Create draft application; Upload document; Save draft section | ACC: draft ID, accepted scope and per-document evidence result. REJ: per-field or per-file reason; input kept. UNR: Check status; duplicate scope (applicant + group + service) prevents a second draft (BS B03, B35). | SA-04 may read the draft. Operator sees nothing. |
| 5 | TA | TA-08 | Submit application | ACC: receipt with application ID, submission time, fixed quote, original estimate and next owner "SuperAdmin: assignment pending" (UX §4.3, BS B17). REJ: each unmet declared control; stale revision. UNR: "Checking the submission"; no second Submit. | SA-02 Submitted unassigned row; SA-01 count. TA-07 progress "With TravelMudra". |
| 6 | SuperAdmin | SA-07 | Record service payment | ACC: payment fact `payment_received` with actor, time and evidence; Gate 1 met (BS B26). REJ: missing evidence; stale. UNR: Check status. | SA-03 shows the application as Gate 1 eligible. TA-11 and TA-07 show the payment fact. |
| 7 | SuperAdmin | SA-03 | Assign operator | ACC: per-application result list with the named operator (BS B19). REJ per application: Gate 1 not met; already assigned; stale. UNR: Check status per application. | OP-01 Action now lists the case. TA-07 becomes read-only with **Report a problem** and names the assigned operator. |
| 8 | Operator | OP-02 | Confirm readiness | ACC: readiness judgment recorded against the current revision (BS B18). REJ: each unmet mandatory validation, open report, open return or flag; stale. | TA-07 next owner: assigned operator. |
| 9 | Operator | OP-04 | Authorize external action | ACC: authorization receipt with action, scope, governing evidence, reconciliation owner and, for TM-funded fees, the reservation (BS B23, B28). REJ: Gate 2 decision needed (route SA-09); exposure ceiling breach (non-overridable, owner SuperAdmin); PARKED reservation case. UNR: "Authorization result unknown. Do not perform the external act." | SA-07 shows the reserved exposure. TA sees no change. |
| 10 | Operator | OP-04 | Record external action evidence, or Mark execution uncertain | ACC: filing fact with evidence; progress "External wait". Uncertain: protected facts; reconciliation owner named (BS B23). | TA-07 "External wait". SA-01 lists uncertain executions. |
| 11 | Operator | OP-05 | Record outcome; Associate result artifact | ACC: Core records the outcome. Association succeeds, or an association incident opens with an owner (BS B13). REJ: missing evidence. | TA-07 outcome "Issued". If the artifact is blocked: "The result document is not available yet" (UX §4.4). |
| 12 | Operator | OP-06 | Send result (`B46 BOUNDARY`) | Preview, recipient and per-file eligibility show. Start of send shows `UNAVAILABLE → event that starts delivery send is not selected (BS B46) / product owner / none in product`. When available: ACC receipt per selection (included, unavailable, failed) with actual channel results (BS B12, B31). | TA-10 web notice and TA-07 retrieval of the eligible version, after a send exists. |
| 13 | Operator | OP-07 | Request completion (`B46 BOUNDARY`) | Prerequisites with evidence and owner show. The request shows the B46 boundary notice. When available: ACC returns the Core completion event, or REJ returns specific blockers with owner and action (BS B24). | TA-07 "Completed" or the remaining obligations. |

The original estimate starts at step 5. The page shows it separately from any later forecast and
independently of payment (BS B17).

### 4.2 Variations (UX §3.2): only the differences

**Approved assistance (BS B18, B26)**

| # | Actor | Page | Command | Difference |
|---|---|---|---|---|
| A1 | TA | TA-07 or TA-08 | Request help | Separate from Submit. Receipt names "SuperAdmin decision pending". |
| A2 | SuperAdmin | SA-02, SA-03 | Decide help request | Approve or decline with reason. Queue visibility may precede payment. |
| A3 | SuperAdmin | SA-07 or SA-09, then SA-03 | Record service payment or Record gate exception; Assign operator | Gate 1 or its application-specific exception MUST exist before assignment. |
| A4 | Operator | OP-02 | Save assistance entry | Editable scope is labelled "Approved assistance". Only that scope is editable. |
| A5 | Operator | OP-02 | Return for TA review | Ends assistance. Label is not "Submit for TA". |
| A6 | TA | TA-08 | Submit application | Standard step 5. Help never fabricates confirmation or submission. |

**TA reports a problem while assigned (BS B18)**

| # | Actor | Page | Command | Difference |
|---|---|---|---|---|
| R1 | TA | TA-07 | Report a problem | Changes no application data. OP-02 shows the report. Filing authorization and packet release show a boundary until resolved. |
| R2 | Operator | OP-03 | Return to TA | Names fields/documents and rationale. Assignment stays with the same operator. |
| R3 | TA | TA-09, TA-08 | Save draft section; Submit application (returned case) | Editable within the returned scope. Identity-field change needs same-person evidence (BS B19). For a returned case, Submit application confirms the correction: the receipt keeps the original quote and the original estimate start and adds the confirmation time (BS B17, B18; RF-04). |
| R4 | Operator | OP-02 | Confirm readiness | Reconfirmation is mandatory before step 9. |

**Preparation-only (BS B04, B22)**

| # | Difference |
|---|---|
| Steps 9–10 | Replaced by **Release packet** (OP-04) after readiness, then **Record packet handover**. No Gate 2, no government fee, no filing fact. Release packet is a delivery start: it stays behind the B46 notice until Max decides OC-09, and each release rechecks B12 per file (RF-06). Record packet handover is a fact record and stays available. |
| Step 11 | Outcome `prepared_and_handed_over`. No government result is claimed. Post-handover cut-off and dependent-result evidence are `PARKED` (BS B44); show as boundary. |
| Originals | None. OP-09 is not shown for this case. |

**Third-party filed (BS B04)**

| # | Difference |
|---|---|
| Step 9 | Operator records **Record provider handoff** (OP-04). Handoff is not filing. The declared provider is named. |
| Step 10 | **Record provider filing evidence** records the provider's act. Follow-up, delivery and closure stay with the operator. |
| Boundary | An unapproved provider or data-sharing route is `PARKED`/`EXCLUDED` (BS B42, B44); the offering is not selectable. |

**Physical route (BS B30, B24)**

| # | Difference |
|---|---|
| After step 7 | OP-09 **Record original receipt** per item. Assignment does not move an item. |
| Any step | **Record original movement** records partial movement and holder uncertainty. |
| Step 13 | A held original blocks completion until **Record owner receipt** (BS B24). Shared-item return priority, suitability, recipient evidence, loss and cross-party visibility are `PARKED`; affected steps show a boundary. |

**Dependency (BS B22)**

| # | Difference |
|---|---|
| Step 8 | Readiness checklist shows the upstream requirement and the exact required artifact. Sibling content stays hidden. |
| Wait owner | Unassigned wait: SuperAdmin. Assigned wait: the operator. |
| Incompatible upstream outcome | Core records `dependency_failed` only for a confirmed-unfiled dependent. A filed or filing-unknown dependent keeps protection. |

**Withdrawn or suspended offering (BS B07)**

| # | Difference |
|---|---|
| Steps 2–5 | New selection, intake (including drafts) and submission show `UNAVAILABLE → offering suspended/withdrawn / SuperAdmin / SA-05 status`. |
| Existing cases | Each affected action shows the recorded treatment. Missing treatment holds unfiled preparation, packet release and filing. Reconciliation, original return, incidents and valid delivery stay available under normal checks. |

**Unknown external execution (BS B23)**

| # | Difference |
|---|---|
| Step 10 | **Mark execution uncertain** protects attempted facts as if filed. Repeat filing, fee payment and ordinary withdrawal show a boundary. |
| Reconciliation | **Record reconciliation evidence** records positive filing or positive non-execution. Non-execution returns the case through readiness before a new authorization. |
| Exhausted | SuperAdmin **Record unresolved external outcome** (SA-04) completes administratively as `external_outcome_unresolved` with attempts, reason, TA notice and future owner. It never grants safe refiling. B24 prerequisites still apply. |
| Corrections | Proposed corrections stay in a separate panel outside protected facts. Elapsed time never displays "not filed". |

**Group end (BS B25)**

| # | Difference |
|---|---|
| Ordinary closure | TA-05 shows each missing condition: applications not completed; intake incidents not disposed. |
| Date-triggered end | After the travel return date, only eligible unpaid, never-worked applications end with the group. Unknown filing, held original, pending delivery or outstanding money exclude this path. The page shows "Ended with group", never success. |

**Completed case with continuing duty (BS B25, B29)**

| # | Difference |
|---|---|
| After step 13 | TA-07 and OP-02 show "Processing completed" and the still-owned follow-up (financial, disclosure or operational) with owner. No government work restarts. The duty is not called settled. |

## 5. Per-page behavior (non-bulk)

Each page table lists actions. "Std" in a result column means the section 1 pattern with no extra
behavior. Preconditions cite the UX §2.3 permission table and the BS gates. A precondition that is not met
produces the "Unavailable" column. Every page MUST apply current access on every read, direct link and
background result (BS B10). After revocation the page MUST remove restricted content and show an access
explanation without data (UX §8.3).

### 5.1 Shared and public pages

**SH-01 App shell** (UX §7.1, §7.3). Rail with only the role's destinations. Top bar: scoped search,
notices, help, individual account. Environment label MUST show on every synthetic or test environment.
The context selector lists only the person's actual authorized contexts and changes no permission.

| Action | Actor | Preconditions | Command | ACC | REJ / UNR | Unavailable |
|---|---|---|---|---|---|---|
| Switch context | Any multi-context person | Context is currently granted | None (navigation) | Rail and home of that context | Denied → access explanation | Context absent from list |
| Scoped search | Any | Current scope | None (read: Scoped search read model) | Results within scope only | Stale → as-of time | Not applicable |
| Sign out | Any | Session exists | Sign out | Public entry; session revoked | UNR: show signed-out state locally; Check status on next load | — |

Shell states: maintenance or restore shows a closed-service message with no case data and no restore or
reopen control (BS B39, B40). Capacity limit shows a truthful retryable state without an invented wait
(BS B38).

**PUB-01 Public entry** (UX §8.1, BS B01). Static content only: value statement, service, static
supported countries, process, sign-in entry, verified business details. No live prices, no case search.
The page MUST be server-rendered or pre-rendered HTML with a unique title and description, canonical
HTTPS URL, sitemap, robots rules and structured data with verified locality. A crawl/SEO check MUST be
recorded before public release. A country MUST NOT appear as offered because it is a planning candidate.
Business name, locality and countries come from input C02; until supplied the page MUST NOT publish.
Action: **Sign in** (navigation to PUB-02).

**PUB-02 Sign-in** (BS B08, UX §7.5, §8.2)

| Action | Actor | Preconditions | Command | ACC | REJ / UNR | Unavailable |
|---|---|---|---|---|---|---|
| Request code | TA | Server-side CAPTCHA passed | Request sign-in code | "If this account can sign in, we will send a code." Same copy for unknown accounts | REJ: rate limit with truthful retry state; CAPTCHA failure. UNR: same neutral copy; the TA may request again under limits | CAPTCHA or email provider unavailable → `UNAVAILABLE → sign-in codes cannot be sent now / TravelMudra operations / try later`. No CAPTCHA bypass |
| Enter code | TA | Code issued for this attempt | Verify sign-in code | Session; TA-01 | REJ: "This code has expired. Request a new code."; used code; attempts exhausted. Input field permits paste and autofill | — |
| Sign in with MFA | Operator, SuperAdmin | Active staff account with MFA | Staff sign-in | Session; OP-01 or SA-01 | REJ: neutral failure; no account disclosure | Suspended account → neutral failure; no reason that leaks state |
| Enrol MFA factor (first staff sign-in) | Operator, SuperAdmin | Active staff account without an enrolled factor; credential verified | Enrol MFA factor | Factor enrolled; session continues to the MFA step | REJ: enrolment failed; retry under limits | Account suspended → neutral failure |

### 5.2 Travel Agent pages

**TA-01 Home** (UX §4.2, §7.3). Read model: TA attention read model. Order: "Needs your action" list,
then travel-risk notices, then recent result and closure notices. Each item links to its application or
task. Empty state teaches the sequence: choose service, create group, add applications. It MUST NOT show
an invented country or a live count. Actions are navigation only.

**TA-02 Services list / TA-03 Service detail** (UX §4.2, BS B01, B05, B07). Read model: Offering
catalogue read model. Detail shows declared mode, eligibility, inclusions, cost, estimate, documents,
process. Undeclared content shows "Not declared". Information-only availability is distinct from
selectable availability.

| Action | Actor | Preconditions | Command | ACC | REJ / UNR | Unavailable |
|---|---|---|---|---|---|---|
| Start an application | TA | Offering launched for scope, supported binding, not suspended, not withdrawn (BS B07) | None (navigation to BU-P01 with group choice) | — | — | `UNAVAILABLE → "No service is currently available for new applications in this scope." / SuperAdmin / none`. No wait-list promise |
| View requirements | TA | Offering visible | None | Declared requirements | — | — |

**TA-04 Groups list / TA-05 Group detail** (UX §4.2, BU §3.2, BS B03, B06, B25). Read models: Group list
read model; Group detail read model; Import attempt read model (list). Group detail has three areas:
Applications, Imports, Intake issues. Counts by common progress name their unit. A failed row without an
application stays reachable through Intake issues.

| Action | Actor | Preconditions | Command | ACC | REJ / UNR | Unavailable |
|---|---|---|---|---|---|---|
| Create group (form on TA-13, AD-07) | TA | Signed in; country chosen | Create group | Group ID, country, travel dates; open TA-05 | Std | — |
| Add applicants | TA | Group open; at least one selectable offering for the country | None (to BU-P01) | — | — | Offering boundary notice as TA-03 |
| Edit travel dates | TA | Own group; group not closed | Edit group travel dates | Receipt lists affected unfiled applications rechecked and any timing notice; filed facts unchanged (BS B06) | REJ: stale. UNR: Check status | Group closed → `UNAVAILABLE → group closed / — / view history` |
| Open import / issue / application | TA | Scope | None | — | — | — |

Group closure state shows as a fact with each missing condition (section 4.2 Group end).

**TA-06 Applications list** (UX §4.2). Read model: Application list read model. Columns: applicant,
application ID, group, country/service, common progress, outcome, next action/owner, travel date. Filters:
needs action, country, service, progress. The page MUST preserve filter and return position when the TA
opens and leaves an application. No group-level "Submit all".

**TA-07 Application workspace (TA)** (UX §2.2, §4.3, §4.4, BS B17–B19, B24, B31). Read model:
Application case read model (TA scope). Header per section 1. Panels: next action, evidence rows,
quote/estimate/forecast, payment facts, delivery facts, notices for this application.

| Action | Actor | Preconditions | Command | ACC | REJ / UNR | Unavailable |
|---|---|---|---|---|---|---|
| Continue draft | TA | Own draft, or formally returned case | None (to TA-09) | — | — | Assigned and not returned → `UNAVAILABLE → "This application is with your operator. Report the problem so it can be returned for correction." / assigned operator / Report a problem` |
| Review and submit | TA | Draft or returned case; offering admits submission | None (to TA-08) | — | — | Offering suspended/withdrawn → boundary (BS B07) |
| Request help | TA | Own draft; no open help request | Request help | Receipt: help request ID; "SuperAdmin decision pending" | Std | Open request exists → show its status |
| Report a problem | TA | Assigned and not formally returned | Report a problem | Receipt; operator named; application data unchanged (BS B18) | Std | Not assigned → hidden; editing is available instead |
| Decide price increase | TA | Unpaid case; price-increase request open | Decide price increase (accept or decline) | Accept: new quote recorded. Decline: communicated price honored (BS B17) | Stale request → current facts | Paid amount adjustment or refund → `UNAVAILABLE → refund/adjustment policy not selected (BS B29, B43) / product owner / none` |
| Acknowledge timing notice | TA | Notice requires a TA decision | Acknowledge notice | Acknowledgement recorded; read state is separate | Std | No decision required → no control |
| Withdraw application | TA | Eligible per offering cut-off; own draft, unassigned submitted, or formally returned; filing not possibly occurred (BS B24, B18, B23) | Request withdrawal | Receipt: withdrawal accepted or assessed; history kept | REJ: cut-off passed; filing uncertain | Assigned not returned → Report a problem route. Filing possible → `UNAVAILABLE → filing may have occurred / assigned operator / reconciliation` |
| Download result | TA | Current account; exact eligible version released to this TA by a release event (BS B12) | Retrieve result file | File delivered; retrieval recorded (BS B31). Each retrieval, including a retry, rechecks B12 eligibility | REJ: version unavailable, replaced or blocked; no substitute | No release event exists while BS B46 is open: `UNAVAILABLE → the release event is not selected (BS B46) / product owner / none in product`. Artifact blocked: "The result document is not available yet. TravelMudra is resolving [safe reason]." |

Delivery rows MUST show email send, web notice, retrieval and acknowledgement as separate facts. An
uncertain email shows "The email result is not confirmed. TravelMudra is checking the send attempt." and
no resend request control (UX §4.4, BS B31).

**TA-08 Review and submit (check answers)** (UX §4.3, BS B17). Read model: Application case read model
(TA scope). Shows applicant and service identity, governing offering summary, accepted and missing
evidence, quoted price, original estimate presentation, unpaid facts and the actual authority
confirmation text (input C05). Each section has an edit link that keeps entered values.

| Action | Actor | Preconditions | Command | ACC | REJ / UNR | Unavailable |
|---|---|---|---|---|---|---|
| Submit this application | TA | Own draft or returned case; current revision; offering admits submission; confirmation checkbox set by the TA (never prechecked); declared controls met | Submit application | Receipt: application, submission time, quote, original estimate, next owner. Returned case: next owner the assigned operator | REJ: each unmet declared control with link to its section; stale revision → changed facts. UNR: "Checking the submission"; Submit hidden until reconciled | Offering boundary; assigned not returned → TA-07 notice |
| Request help | TA | As TA-07 | Request help | As TA-07 | Std | As TA-07 |

The page MUST NOT add a universal "all documents complete" gate (UX §4.3, BU-10).

**TA-09 Individual intake (task list)** (UX §4.3, BS B14, B15, B19). Read model: Draft intake read model.
Sections: group and service context, applicant facts, required documents, evidence results, review. Each
section shows its actual state. No percentage.

| Action | Actor | Preconditions | Command | ACC | REJ / UNR | Unavailable |
|---|---|---|---|---|---|---|
| Create draft | TA | Group open; offering selectable; no duplicate applicant + group + service | Create draft application | Draft ID; task list | REJ: duplicate scope → link to existing permitted application | Offering boundary |
| Save section | TA | Editable (own draft or returned scope); current revision | Save draft section | Accepted scope listed | REJ: field errors; stale → compare | Assigned not returned → TA-07 notice |
| Change identity field | TA | As Save; same-person evidence attached (BS B19) | Save draft section | As Save | REJ: evidence required | — |
| Upload document | TA | Editable; PDF/JPEG/PNG ≤ 5 MB or narrower offering rule (BS B15) | Upload document | Version recorded; evidence row shows processing then its verdict | REJ: format or size with allowed replacement | — |
| Replace document | TA | Editable | Upload document (replacement) | New version; old version loses eligibility visibly | Std | — |

Attempted input MUST survive validation errors. Identity documents MUST NOT go into browser persistence
(UX §3.3).

**TA-10 Notices** (UX §4.2). Read model: Notices read model. Read state is separate from decision
acknowledgement. Actions: **Mark as read** (Mark notice read command, Std), **Acknowledge** (Acknowledge
notice command, only when a decision is required), **Open underlying work** (navigation).

**TA-11 Payment history** (UX §4.2, BS B26–B29). Read model: TA payment history read model. Per
application: service quote, service payment fact, government fee and recovery facts where authorized,
corrections with the original entry. Read-only. The page MUST NOT show Pay now, refund claim, write-off or
credit controls. It MUST NOT expose an Accounts dashboard or internal grants.

**TA-12 Account and two-proof email change** (BS B09, UX §4.4)

| Action | Actor | Preconditions | Command | ACC | REJ / UNR | Unavailable |
|---|---|---|---|---|---|---|
| Start email change | TA (signed in) | No open change | Start email change | Code sent to current address | Std | — |
| Prove current address | TA | Change open | Verify current-address code | Code sent to proposed address | REJ: expired/used | — |
| Prove new address | TA | Current proof passed | Verify new-address code | Address switched for sign-in and documents; all sessions revoked; sign-in again | REJ: expired/used | — |
| Pending state | — | Change open | — | "Your sign-in and document email remain [current address] until both addresses are verified." | — | Lost old mailbox → `UNAVAILABLE → recovery rule not approved (BS B09, B44) / product owner / none` |

Bulk upload pages BU-P01 to BU-P10 are specified in BULK-UPLOAD-UI-PLAN.md.

### 5.3 Operator pages

**OP-01 My work queue** (UX §5.2, §5.4, §7.3). Read model: Assigned work queue read model. Saved views:
Action now, Waiting, Returned to TA, Delivery and closure, Continuing duties. Views are filters, not
states. Row: application, service, current task, blocker, owner, actual review point. Title shows
freshness. Alert order: blocked or protected action, then recorded travel risk and overdue review, then
ordinary next task. Labels distinguish "You must act", "TA must act", "SuperAdmin decision needed",
"External evidence awaited", "No current action; next review [recorded point]". No red badge on every
waiting case. Actions are navigation and scoped pagination.

**OP-02 Application workspace (Operator)** (UX §5.3, BS B18–B22). Read models: Operator case read model;
Readiness checklist read model. Tabs: Work, Application & documents, External actions, Delivery &
originals, History. Authorized money facts appear as a money summary panel (CMP-16) inside Work and External actions (AD-09). A tab MUST NOT hide an unresolved primary blocker. Full
identifiers show only in an authorized task context. Readiness checklist rows: evidence status, owner,
resolution link. A gate exception row reads "Action allowed by exception" with exact scope. No universal
green "Ready" indicator.

| Action | Actor | Preconditions | Command | ACC | REJ / UNR | Unavailable |
|---|---|---|---|---|---|---|
| Confirm readiness | Assigned operator | Gate 1 met or excepted; mandatory validations pass; no open report, return or flag; current revision | Confirm readiness | Readiness recorded against revision | REJ: each unmet item | Report open → `UNAVAILABLE → TA reported a problem / you / Return to TA or resolve` |
| Save assistance entry | Assigned operator | Approved assistance; field inside approved scope | Save assistance entry | Accepted scope | Std | Ordinary work → no editable fields; "Return to TA for correction" |
| Return for TA review | Assigned operator | Approved assistance in progress | Return for TA review | TA owns review and submission | Std | — |
| Request deferral | Assigned operator | Case in a wait | Request deferral | Pending SuperAdmin approval; review point proposed | Std | — |
| Record applicant withdrawal request | Assigned operator | Evidenced applicant request (BS B24) | Request withdrawal | As TA-07 | As TA-07 | Filing possible → boundary |
| Return to TA / Flag to SuperAdmin | Assigned operator | — | (OP-03) | — | — | — |

**OP-03 Return to TA / flag to SuperAdmin** (BS B18)

| Action | Actor | Preconditions | Command | ACC | REJ / UNR | Unavailable |
|---|---|---|---|---|---|---|
| Return to TA | Assigned operator | Assigned; filing not possibly occurred | Return to TA | Case formally returned; TA-01 item; assignment retained | REJ: stale | Filing uncertain → B23 boundary |
| Flag to SuperAdmin | Assigned operator | Named permitted decision | Flag to SuperAdmin | SA-01 item; filing and packet release blocked | Std | — |

Inputs: affected fields and documents, rationale. Filing authorization and packet release stay blocked
until readiness is reconfirmed.

**OP-04 External action** (UX §5.3, BS B20, B23, B27, B28). Read model: External action read model. Review
screen: application, service, governing facts, authority, payment and fee controls, external action,
reconciliation owner. Label requests authorization; it MUST NOT say "File visa".

| Action | Actor | Preconditions | Command | ACC | REJ / UNR | Unavailable |
|---|---|---|---|---|---|---|
| Request authorization | Assigned operator | Current readiness; Gate 1; Gate 2 met or decided for TM-filed with unpaid service (BS B27); exposure within ceiling (BS B28); no open report/flag; offering treatment allows filing | Authorize external action | Authorization receipt; then the manual step shows | REJ: Gate 2 needed → SA-09; ceiling breach (no override) → SA-07; stale | PARKED reservation case → `UNAVAILABLE → reservation rule not decided (BS B28, B43) / product owner / none` |
| Record external action evidence | Assigned operator, current authority | Authorization exists or an attempt exists to reconcile (V11) | Record external action evidence | Filing fact; progress External wait | Std | — |
| Mark execution uncertain | Assigned operator | Attempted act with unknown result | Mark execution uncertain | Protected state; reconciliation owner; repeat/payment/withdrawal removed | Std | — |
| Record reconciliation evidence | Reconciliation owner | Uncertain state | Record reconciliation evidence | Filed, or positive non-execution returning to readiness | Std | — |
| Release packet / Record packet handover | Assigned operator | Preparation-only; current readiness; per-file B12 recheck at release | Release packet; Record packet handover | Packet released with per-file results; outcome path | Std | Release packet: `UNAVAILABLE → packet release as a delivery start is not decided (BS B46; OC-09) / product owner / none in product`. Post-handover policy → PARKED boundary |
| Record provider handoff / filing evidence | Assigned operator | Third-party mode; declared provider | Record provider handoff; Record provider filing evidence | Facts recorded separately | Std | Undeclared provider → boundary |

UNR on Authorize MUST show "Authorization result unknown. Do not perform the external act." Unknown
execution MUST show "Filing outcome is unknown. Do not repeat the external action. [Owner] is reconciling
the evidence." (UX §8.2).

**OP-05 Outcome and artifact association** (UX §5.3, BS B13, B21). Read model: Outcome and artifact read
model.

| Action | Actor | Preconditions | Command | ACC | REJ / UNR | Unavailable |
|---|---|---|---|---|---|---|
| Record outcome | Assigned operator | Evidence of official outcome | Record outcome | Core outcome recorded | REJ: outcome not allowed for mode | — |
| Upload result artifact | Assigned operator | Outcome evidence | Upload document (artifact) | Version; association check runs | Std | — |
| Confirm association | Scoped reviewer | Single eligible candidate with evidence; no contradiction | Confirm artifact association | Delivery eligibility evaluated | REJ: contradiction | Missing/multiple candidates → incident (OP-08). No "accept best match" |

Issued without a correct artifact stays issued; delivery shows blocked with owner.

**OP-06 Send result** (UX §5.3, BS B12, B24, B31; D2). Read model: Send preview read model. Shows the
application, the current TA account email (information, not an input), each file with type, version,
availability and per-file eligibility, notice requirement and prior attempts.

| Action | Actor | Preconditions | Command | ACC | REJ / UNR | Unavailable |
|---|---|---|---|---|---|---|
| Send result | Actor `OWNER CHOICE PENDING (Astra-only source)`; the plan shows the assigned operator as the example actor | `B46 BOUNDARY` | Send result | When available (shape `OWNER CHOICE PENDING (Astra-only source)`): receipt per selection (included, unavailable, failed) and channel result. Acceptance is not email success | REJ per file at recheck; UNR: no auto resend; refresh never sends | Always now: `UNAVAILABLE → the event that starts a result send is not selected (BS B46) / product owner / none in product` |
| Record delivery evidence | Assigned operator | Prior attempt with uncertain result | Record delivery evidence (proven success or proven failure) | Delivery fact updated | Std | Investigation ownership → `B46 BOUNDARY` notice |
| Deliberate resend | Assigned operator | Proven failure (BS B31) | Send result (new operation identity) | New attributed send with full rechecks | As Send | Continuing ambiguity → `OWNER CHOICE PENDING (Astra-only source)` notice (OD §4) |
| Take delivery ownership (unassigned case) | SuperAdmin | — | — | — | — | `OWNER CHOICE PENDING (Astra-only source)`; route: SA-03 assign an operator |
| Record a manual email (not system-verified) | Assigned operator | Operator sent an email outside the product | Record manual email | Attributed record, not system-verified; claims no delivery; recipient compared with the current TA account email and a mismatch flagged; B46 notice for any completion effect (BS B24; AD-01; RF-08) | Std | — |

**OP-07 Request completion** (UX §5.3, BS B24; D2). Read model: Completion prerequisites read model.
Shows each applicable prerequisite: outcome, delivery and web notice evidence, originals returned,
artifact block, mandatory validation. Financial follow-up and a generic open incident are shown as
non-blocking duties.

| Action | Actor | Preconditions | Command | ACC | REJ / UNR | Unavailable |
|---|---|---|---|---|---|---|
| Request completion | Actor `OWNER CHOICE PENDING (Astra-only source)`; the plan shows the assigned operator as the example actor | `B46 BOUNDARY` | Request completion | When available (shape `OWNER CHOICE PENDING (Astra-only source)`, including whether the check is explicit or automatic): Core completion event | REJ: specific blockers with owner and action | Always now: `UNAVAILABLE → trigger and owner of the completion check are not selected (BS B46) / product owner / none in product` |

**OP-08 Incidents and follow-up** (UX §5.2, BS B13, B23, B25). Read model: Owned incidents read model.
Includes incidents linked to completed cases.

| Action | Actor | Preconditions | Command | ACC | REJ / UNR | Unavailable |
|---|---|---|---|---|---|---|
| Record incident evidence | Incident owner | Owned incident | Record incident evidence | Evidence appended | Std | — |
| Block disclosed version | Incident owner | Confirmed wrong-recipient disclosure | Block document version | Version noncurrent; known retrievals kept | Std | No "recall" control (BS B45) |
| Record correction and notice | Incident owner | — | Record incident correction and notice | Notice facts recorded | Std | Applicant/regulator notice → `UNAVAILABLE → separately authorized compliance work (BS B13) / product owner / none` |
| Close incident | Incident owner | Correction and notice evidence present | Close incident | Closed with evidence | REJ: missing evidence | — |

**OP-09 Originals register** (BS B30). Read model: Originals register read model (assigned scope only).
Actions: **Record original receipt**, **Record original movement** (partial allowed), **Record holder
uncertain**, **Record owner receipt**. Each is a command with Std results. Shared-item return priority,
suitability, recipient evidence, loss/damage and cross-party visibility show `PARKED` boundaries.
Reassignment never moves an item; the holder stays at its evidenced value.

**OP-10 Notices and account (MFA)** (UX §5.2, BS B08, B11). Read model: Notices read model; Account read
model. Actions: Mark notice read; Sign out. Credential recovery is a SuperAdmin reset; nobody sees a
secret. An accounting grant MUST NOT turn this page into an Accounts product (BS B29 PARKED).

### 5.4 SuperAdmin pages

**SA-01 Decision inbox** (UX §6.2). Read model: Decision inbox read model. Sections: unassigned and
ownerless work, help requests, launch and impact decisions, permitted exceptions, uncertain executions,
significant incidents, unresolved delivery, travel risk, reporting gaps, `Payment_Missing_Override`
follow-ups. Each count is scoped and shows freshness. Actions are navigation.

**SA-02 Work queues** (UX §6.2, BU §3.2, BS B18, B22). Read model: SuperAdmin work queue read model.
Queues: submitted unassigned, help requests, assignment/reassignment, dependency waits, delivery and
closure ownership, deferred review, intake issues.

| Action | Actor | Preconditions | Command | ACC | REJ / UNR | Unavailable |
|---|---|---|---|---|---|---|
| Decide help request | SuperAdmin | Open help request | Decide help request | Approved or declined with reason; TA notice | Std | — |
| Dismiss intake issue | SuperAdmin | Open intake issue | Dismiss intake issue | Dismissed with reason; no application cancelled (BS B16) | Std | — |
| Approve deferral | SuperAdmin | Operator request with justification | Decide deferral | Deferred with review point; TA notice | Std | — |
| Assign association reviewer | SuperAdmin | Association incident; no operator assigned (BS B13) | Assign reviewer | Reviewer named; no filing authority | Std | — |

Each decision is recorded on SA-09 (AD-13); this page lists and links.

**SA-03 Assignment and reassignment decision** (UX §6.3, BS B18, B19, B26)

| Action | Actor | Preconditions | Command | ACC | REJ / UNR | Unavailable |
|---|---|---|---|---|---|---|
| Assign operator | SuperAdmin | Explicit selection; each application Gate 1 met or excepted; operator active | Assign operator (single, selection, or SuperAdmin-initiated round robin) | Per-application result list | REJ per application; UNR per application | Gate 1 not met → `UNAVAILABLE → service payment not recorded / SuperAdmin / SA-07 or SA-09` |
| Reassign operator | SuperAdmin | Assigned case; reason | Reassign operator | Preview then receipt: old/new operator, retained custody holder, transferred duties, readiness reconfirmation flag | Std | — |

No group assignment and no autonomous assignment (BS B19, B42).

**SA-04 Applications & groups oversight** (UX §6.2, BS B18, B23, B24). Read model: Oversight read model.

| Action | Actor | Preconditions | Command | ACC | REJ / UNR | Unavailable |
|---|---|---|---|---|---|---|
| Exceptional correction | SuperAdmin | Evidence, identity, reason | Record exceptional correction | Correction with before/after | REJ: missing evidence; validation fails | No readiness judgment and no filing control (BS B18) |
| Record operational withdrawal request | SuperAdmin | Evidenced operational request | Request withdrawal | As TA-07 | As TA-07 | Filing possible → boundary |
| Record unresolved external outcome | SuperAdmin | Reconciliation exhausted; attempts recorded | Record unresolved external outcome | The SuperAdmin authorization, attempts, reason, TA notice and future owner are recorded. Core evaluates the B24 prerequisites and records the `external_outcome_unresolved` completion. BS B23 grants this path explicitly; it is not a B46 trigger (architect disposition of RF-07) | REJ: prerequisites missing | — |
| Generic cancellation | — | — | — | — | — | `UNAVAILABLE → erroneous-case cancellation policy is PARKED (BS B44) / product owner / none` |

Each decision is recorded on SA-09 (AD-13); this page lists and links.

**SA-05 Offerings & launch** (UX §6.3, BS B05–B07, B32). Read model: Offering administration read model.
Four panels: definition and binding, effective business values, readiness evidence, launch and admission.

| Action | Actor | Preconditions | Command | ACC | REJ / UNR | Unavailable |
|---|---|---|---|---|---|---|
| Publish business values | SuperAdmin | Impact preview viewed; reason | Publish offering values | Receipt with before/after, effective condition, affected scope | REJ: stale; unsupported value | Shared control change → boundary (BS B05) |
| Record structural approval | SuperAdmin | Product owner's outside-product approval evidence | Record structural approval | Recorded for exact version and scope | Std | — |
| Record existing-work treatment | SuperAdmin | Impact list | Record existing-work treatment (continuation, per-application transition, or hold) | Per-application receipt | Std | Identity switch → "fresh intake required" |
| Launch / expand | SuperAdmin | Supported binding; B32 measures and support items set | Launch offering | Scope admitted | REJ: each missing readiness item | Missing measures → list |
| Suspend / lift / withdraw | SuperAdmin | Reason, evidence | Suspend offering; Lift suspension; Withdraw offering | Admission changed; existing-work treatment prompt | Std | — |

Each decision is recorded on SA-09 (AD-13); this page lists and links.

Readiness stage labels Defined → Active are `OWNER CHOICE PENDING (Astra-only source)` (OD §6).

**SA-06 Accounts & access** (UX §6.3, BS B08–B11). Read model: Accounts and grants read model; Support
view read model.

| Action | Actor | Preconditions | Command | ACC | REJ / UNR | Unavailable |
|---|---|---|---|---|---|---|
| Create account | SuperAdmin | Role, individual identity, contact, reason; a SuperAdmin account needs a second distinct SuperAdmin (K-2P) | Create account | Account created, inactive until activation; receipt names the individual and role | Std | TA eligibility/fraud policy → `PARKED` boundary (BS B08, B44); no first-admin bypass (BS B11, B44) |
| Approve / activate / suspend / restore account | SuperAdmin | Reason | Change account status | Receipt names the individual and consequences | Std | TA eligibility/fraud policy → `PARKED` boundary (BS B08, B44) |
| Suspend operator | SuperAdmin | Unresolved duties listed | Change account status | Access revoked; duties shown for reassignment via SA-03 | Std | — |
| Request / approve SuperAdmin elevation | Two distinct SuperAdmins | Second approver differs | Request elevation; Approve elevation | Elevation active after second approval | REJ: same approver; audit unavailable (non-emergency) | First-admin or all-admin-loss → `PARKED` boundary |
| Reset credentials | SuperAdmin | Reason | Reset credentials | Reset issued; no secret shown | Std | TA email overwrite → not offered (BS B09) |
| Grant / revoke read access | SuperAdmin | Exact group scope, purpose, duration | Grant read access; Revoke read access | Grant listed; revoke takes effect on old links | Std | — |
| Open support view | SuperAdmin | Selected individual | None (read: Support view read model) | Banner "Read-only view for [individual]" and exit; no target actions | Denied → access explanation | — |

Each decision is recorded on SA-09 (AD-13); this page lists and links.

**SA-07 Money & exposure** (UX §6.3, BS B26–B29, B43). Read model: Money and exposure read model.

| Action | Actor | Preconditions | Command | ACC | REJ / UNR | Unavailable |
|---|---|---|---|---|---|---|
| Record service payment (Gate 1) | SuperAdmin | Source evidence | Record service payment | Payment fact; original entries kept | Std | — |
| Correct payment record | SuperAdmin | Original entry | Correct payment record | Additive correction; financial follow-up opens if work proceeded (BS B26) | Std | — |
| Open Gate 2 decision | SuperAdmin | TM-filed; unpaid service at fee/submission point | None (to SA-09) | — | — | — |
| Record government fee and TM-paid facts | SuperAdmin | Evidence | Record government fee fact | Fee, TA liability and TM-paid amount recorded; TA receipt, allocation and outstanding recovery shown read-only from Accounts facts | Std | Receipt allocation and recovery entry → `UNAVAILABLE → Accounts mutation path is PARKED (BS B29, B43) / product owner / none`. Fee formula → `PARKED` (BS B29, B43) |
| Lower ceiling | SuperAdmin | Reason | Change exposure ceiling | New ceiling; incurred exposure unchanged | Std | — |
| Increase ceiling | Two distinct SuperAdmins | Second approver differs | Request ceiling increase; Approve ceiling increase | New ceiling after second approval | REJ: same approver | — |
| Exposure decrease | — | — | — | — | — | `UNAVAILABLE → Accounts verification actions are PARKED (BS B29) / product owner / none` |

Each decision is recorded on SA-09 (AD-13); this page lists and links.

The `Payment_Missing_Override` list shows each open financial follow-up across applications with owner.
The three B28 PARKED reservation cases show individually. Refund, write-off, assistance charge and
other-mode fee controls MUST NOT appear.

**SA-08 Incidents & audit** (UX §6.2, BS B33, B39, B40). Read models: Incident and audit read model;
Reporting health read model. Audit rows show actor, event time and recorded time, evidence, original plus
correction. Audit and support scopes stay distinct. Actions: assign incident owner (Assign incident
owner command), record incident evidence (as OP-08). No restore, reconstruction or reopen control.
After safe reopening, SuperAdmin re-enters evidenced facts only through the existing commands.

**SA-09 Gate exception decision** (UX §6.3, BS B20, B26, B27)

| Action | Actor | Preconditions | Command | ACC | REJ / UNR | Unavailable |
|---|---|---|---|---|---|---|
| Record gate exception | SuperAdmin | One application, one named gate (Gate 1, Gate 2, readiness gate after reassignment), one action, reason, evidence | Record gate exception | Receipt states what permission changes and which facts stay unchanged (payment still outstanding) | REJ: stale; gate not exceptable | Mandatory validation, fixed cut-off, exposure ceiling → `UNAVAILABLE → not overridable (BS B20, B28) / evidence owner / correct evidence` |

A Gate 1 exception MUST NOT satisfy Gate 2. The page MUST NOT offer one "Admin override" for all
blockers.

## 6. Read models

Rules for every read model (UX §3.3, §8.3, BS B10, B33, B35):

- Every read model MUST carry an as-of time. If the source cannot give one, the page shows "Freshness
  unavailable".
- A stale read model is disclosed, not blocked. A command stays available when its authoritative checks
  work. The command re-checks current facts at acceptance (BS B33).
- A read model never grants permission. Allowed actions, blocker class, reason and owner come from the
  read model as facts (input C10). The page MUST NOT compute permission from other fields.
- Each status dimension is a separate field: common progress, lifecycle, outcome, filing/external act,
  readiness/control items, payment, custody, delivery, next owner/action. No combined field.
- A missing value is "Not recorded", "Not declared", "Unavailable" or "Unknown" as the source states. It
  is never zero, refusal or "not filed".

### 6.1 Shared

| Read model | Fields the pages need | Scope rule | Freshness display | Pages |
|---|---|---|---|---|
| Session context read model | Individual, role contexts, environment label, MFA state | Own account | Current at load | SH-01, all |
| Scoped search read model | Matching objects with type and identity | Current scope of the role | As-of time | SH-01 |
| Recent operations read model | Operation identity, command, submitted time, state (accepted, rejected, unresolved), receipt link. Source: the writer's operation record, not a projection | Own operations, current access | Current at load; UNR until the writer reconciles; "Unavailable" blocks a new intent for the same purpose | All pages that send commands (lost acknowledgement after refresh) |
| Notices read model | Notice, application link, read state, acknowledgement required, acknowledgement state | Own account scope | As-of time | SH-01, TA-01, TA-10, OP-10 |

### 6.2 Travel Agent (scope: own TA only)

| Read model | Fields the pages need | Scope rule | Freshness display | Pages |
|---|---|---|---|---|
| TA attention read model | Item, application, reason, owner, action link, recorded travel risk, review point | Own TA | As-of time; stale banner | TA-01 |
| Offering catalogue read model | Country, service, mode, eligibility, inclusions, cost, estimate basis, documents and formats, process, availability (selectable, information-only, unavailable with reason) | Offerings visible to TAs | As-of time; selectability re-checked at command | TA-02, TA-03, BU-P01, BU-P02 |
| Group list read model | Group, country, travel dates, application counts by common progress (unit: applications), unresolved intake issue count (unit: issues), next action | Own TA | As-of time | TA-04 |
| Group detail read model | Group facts, applications (row as TA-06), imports, intake issues, closure conditions | Own TA | As-of time | TA-05, BU-P01 |
| Application list read model | Applicant, application ID, group, country/service, common progress, outcome, next action and owner, travel date | Own TA | As-of time | TA-06 |
| Application case read model (TA scope) | Identity header; separate status facts; evidence rows (missing, processing, accepted, conflict, unsafe, unreadable, unavailable, replaced; version; association); quote, original estimate, current forecast; payment facts; delivery facts; allowed actions with reasons; assigned operator; revision | Own TA; scoped case history only | As-of time; revision for stale checks | TA-07, TA-08, BU-P10 |
| Draft intake read model | Task list sections and states, applicant facts, document versions, evidence verdicts, revision | Own TA; editable scope flag | Current at load; revision | TA-09 |
| TA payment history read model | Per application: quote, service payment fact, government fee and recovery facts where authorized, corrections with originals | Own TA | As-of time | TA-11 |
| Account read model | Current email, pending change state, sessions | Own account | Current at load | TA-12 |

Bulk read models (Import attempt, Source interpretation, Intake issue detail, Correction preview, Import review queue) are in BULK-UPLOAD-UI-PLAN.md section 3.

### 6.3 Operator (scope: assigned applications; exact read grants add read only)

| Read model | Fields the pages need | Scope rule | Freshness display | Pages |
|---|---|---|---|---|
| Assigned work queue read model | Application, service, current task, blocker, owner label, actual review point, travel risk, saved-view membership | Assigned to this operator | Title shows as-of time; "Freshness unavailable" if unknown | OP-01 |
| Operator case read model | Header (applicant, masked identity cue, application ID, country/service/mode, TA, operator, progress, outcome, next action); tab facts; report/return/flag state; assistance scope; revision | Assigned; read grant marks "Read-only grant" and returns no actions | As-of time; revision | OP-02, OP-03 |
| Readiness checklist read model | Mandatory validations, declared prerequisites, gates (with exception scope), cut-offs, unresolved decisions; each with evidence status, owner, resolution link | Assigned | Current at load | OP-02, OP-04 |
| External action read model | Authorization state, governing facts, Gate 2 state, exposure: proposed fee, reserved, TM-paid-unrecovered, ceiling, PARKED case flags; execution evidence; uncertainty and reconciliation owner | Assigned | Current at load | OP-04 |
| Outcome and artifact read model | Outcome, artifact versions, extracted name and passport evidence, candidates, contradictions, association state, delivery eligibility | Assigned; scoped reviewer | Current at load | OP-05 |
| Send preview read model | Current TA account email, files with type, version, availability, eligibility and reason, notice requirement, prior attempts with channel results | Assigned | Current at load; per-file recheck at command | OP-06 |
| Completion prerequisites read model | Each applicable prerequisite with evidence and owner; non-blocking duties listed apart | Assigned | Current at load | OP-07 |
| Owned incidents read model | Incident, type, linked application (including completed), evidence, correction and notice state, owner, next action | Owned or assigned | As-of time | OP-08 |
| Originals register read model | Item, linked applications in scope, holder/location or uncertainty, movements, return evidence, PARKED flags | Assigned scope only | As-of time | OP-09 |

### 6.4 SuperAdmin (scope: SuperAdmin; support view uses the selected person's scope)

| Read model | Fields the pages need | Scope rule | Freshness display | Pages |
|---|---|---|---|---|
| Decision inbox read model | Section counts with unit, oldest item age, link | SuperAdmin | As-of time per section; "Unavailable" per section | SA-01 |
| SuperAdmin work queue read model | Queue items with application, reason, age, Gate 1 state, payment fact, help state, incident flags | SuperAdmin | As-of time | SA-02 |
| Assignment candidate read model | Selected applications with Gate 1 eligibility and unresolved duties; operators with status; reassignment preview (old/new, custody holder, duties) | SuperAdmin | Current at load; re-checked at command | SA-03 |
| Oversight read model | Groups, applications, full case histories, correction candidates | SuperAdmin | As-of time | SA-04 |
| Offering administration read model | Definition, binding, effective values, readiness evidence, launch scope, suspension, withdrawal, impact preview (affected unfiled applications, unknown applicability) | SuperAdmin | Current at load | SA-05 |
| Accounts and grants read model | Individuals, role, status, grants (scope, purpose, expiry), pending second approvals, unresolved duties per operator | SuperAdmin | Current at load | SA-06 |
| Support view read model | The selected individual's current read scope, rendered read-only | Selected individual's scope at this moment | As that person's read models | SA-06 |
| Money and exposure read model | Service payment entries and corrections, fee/liability/TM-paid/receipt/recovery per application, per-TA exposure and ceiling, pending increase, `Payment_Missing_Override` list, B28 PARKED cases | SuperAdmin | As-of time | SA-07 |
| Incident and audit read model | Incidents, full audit with event and recorded time, evidence, corrections | SuperAdmin only | As-of time; reconstruction marked | SA-08 |
| Reporting health read model | Projection lag, degraded reports, coverage gaps | SuperAdmin | Current | SA-01, SA-08 |
| Gate decision context read model | Application, named gate, action, evidence, facts that stay unchanged, non-overridable flags | SuperAdmin | Current at load | SA-09 |

## 7. Commands

Idempotency rules (BS B35, BU §7.3). Each command row names one rule:

- **K-STD.** Same operation identity and same content returns the original accepted result under current
  read access. Same identity and different content is rejected as a conflict. A lost acknowledgement is
  UNR until the writer reconciles. A new identity does not evade the business duplicate check.
- **K-EXT.** As K-STD. The Nth retry never repeats an external act, fee payment or send. A deliberate new
  act needs a new identity and is allowed only when the source rule permits it.
- **K-BATCH.** As K-STD per item. The Nth identical retry returns accepted effects and the current state of
  eligible failures. It creates no duplicate application and applies no old proposal over newer facts.
  Retry eligible failures is a new operation with its own identity, linked to the original attempt. Each
  item effect is keyed on (attempt, source row or file), so a retry of the retry returns its own result and
  creates no duplicate (RF-01).
- **K-BYTE.** As K-STD, for byte release. Every release, including a same-key retry, rechecks B12
  eligibility at that moment. A same-key retry MUST NOT release bytes from a stored result (RF-09).
- **K-2P.** Request and approval are separate operations. The approver MUST differ from the requester.
- **K-OTP.** Each code request issues a new code under rate limits. Each code is single use.

Every command guard includes current actor, current scope and current access (BS B10, B20). The table
lists the additional guards.

| Command | Actor | Inputs | Additional guards | Key | Receipt contents | Pages |
|---|---|---|---|---|---|---|
| Request sign-in code | TA | Email, CAPTCHA proof | Server CAPTCHA; rate limit | K-OTP | Neutral confirmation only | PUB-02 |
| Verify sign-in code | TA | Email, code | Expiry, single use, attempt limit | K-OTP | Session | PUB-02 |
| Staff sign-in | Operator, SuperAdmin | Credentials, MFA | Active account | K-OTP | Session | PUB-02 |
| Enrol MFA factor | Operator, SuperAdmin | Factor enrolment proof | Active account; credential verified; no enrolled factor | K-STD | Factor enrolled | PUB-02 |
| Sign out | Any | — | — | K-STD | Revocation | SH-01 |
| Create group | TA | Country, travel dates, name | — | K-STD | Group ID, country, dates | TA-04, BU-P01 (form on TA-13, AD-07) |
| Edit group travel dates | TA | New dates, revision | Group open; revision | K-STD | Rechecked applications, notices | TA-05 |
| Create draft application | TA | Group, service, applicant facts | Offering admits intake; duplicate scope | K-STD | Draft ID | TA-09 |
| Save draft section | TA | Section values, revision, same-person evidence when identity fields change | Editable scope; revision; B19 evidence | K-STD | Accepted scope | TA-09 |
| Upload document | TA, Operator (artifact) | File, type claim, application | Format, size, malware check before reading (BS B15) | K-STD | Version, processing state | TA-09, BU-P06, OP-05 |
| Submit application | TA | Application, revision, confirmation | Editable; offering admits; declared controls; confirmation present | K-STD | Application, time, quote, original estimate, next owner | TA-08, BU-P10 |
| Request help | TA | Application or intake issue, description | No open request | K-STD | Help request, status | TA-07, TA-08, BU-P06 |
| Report a problem | TA | Application or issue, description | Assigned not returned (application) | K-STD | Report ID, operator named | TA-07, BU-P06 |
| Decide price increase | TA | Request, choice | Unpaid; request open | K-STD | Price fact | TA-07 |
| Acknowledge notice | TA | Notice | Decision required | K-STD | Acknowledgement | TA-07, TA-10 |
| Mark notice read | Any | Notice | — | K-STD | Read state | TA-10, OP-10 |
| Request withdrawal | TA, Operator, SuperAdmin | Application, evidence of request | Cut-off; editor rules; filing not possible (BS B23, B24) | K-STD | Accepted withdrawal or assessment | TA-07, OP-02, SA-04 |
| Retrieve result file | TA (`B46 BOUNDARY` until a release event exists) | Application, file | B12 release checks at every retrieval; a release event exists | K-BYTE | Retrieval record | TA-07 |
| Start email change; Verify current-address code; Verify new-address code | TA | Proposed address; codes | Signed-in owner; both proofs bound to the change | K-OTP | Change state; switch and revocation | TA-12 |
| Upload source workbook | TA | Excel file | Configured source limit (not 5 MB) | K-STD | Transfer accepted | BU-P02 |
| Read source | TA | Group, source type, URL or workbook, optional folder | Public retrieval bounds (BS B36); offering admits | K-STD | Discovery and preflight result | BU-P02 |
| Answer mapping question | TA | Question, choice | Source snapshot current | K-STD | Updated interpretation | BU-P03, BU-P06 |
| Choose service for scope | TA | Scope, services | Services selectable; explicit values not overwritten | K-STD | Scope, services, exclusions, count where known | BU-P03, BU-P06 |
| Start import | TA | Attempt, interpretation version | No whole-source block; offering admits | K-BATCH | Attempt reference, scope, unresolved items | BU-P03 |
| Retry eligible failures | TA | Original attempt; new retry operation identity | Shown eligible scope; per-item key (attempt, row or file) | K-BATCH | Accepted effects, remaining failures, retry operation identity | BU-P08 |
| Abandon intake issue | TA | Issue, reason | Owned by TA | K-STD | Issue stopped; surviving applications listed | BU-P06 |
| Read revised source | TA | Original attempt, revised source | Linked to original | K-STD | Correction preview reference | BU-P07 |
| Apply corrections | TA | Preview, selected applications, revisions | Per-application revision and edit permission; same-person evidence | K-BATCH | Per application: applied, conflict, edit unavailable | BU-P07 |
| Check operation status | Any | Operation identity | Current read access | — (read) | Original state | All with UNR |
| Confirm readiness | Operator | Application, revision | Assigned; Gate 1; validations; no open report | K-STD | Readiness record | OP-02 |
| Save assistance entry | Operator | Fields in scope, revision | Approved assistance | K-STD | Accepted scope | OP-02 |
| Return for TA review | Operator | Application | Assistance active | K-STD | Return record | OP-02 |
| Return to TA | Operator | Fields, documents, rationale | Assigned; filing not possible | K-STD | Return record | OP-03 |
| Flag to SuperAdmin | Operator | Named decision, reason | Assigned | K-STD | Flag record | OP-03 |
| Request deferral | Operator | Justification, review point | Assigned | K-STD | Pending approval | OP-02 |
| Authorize external action | Operator | Action, governing facts, fee (if TM-funded) | Readiness; Gate 1; Gate 2 (BS B27); ceiling and reservation in the same commit (BS B28); offering treatment; business duplicate guard: no open authorization for the same application and action (RF-02) | K-EXT | Authorization, scope, reconciliation owner, reservation | OP-04 |
| Record external action evidence | Operator | Evidence, times | Current authority over the case | K-EXT | Filing fact | OP-04 |
| Mark execution uncertain | Operator | Attempt facts | Assigned | K-STD | Protected state, owner | OP-04 |
| Record reconciliation evidence | Reconciliation owner | Evidence | Uncertain state | K-STD | Filed or positive non-execution | OP-04 |
| Release packet (`B46 BOUNDARY`; OC-09); Record packet handover | Operator | Packet version | Preparation-only; readiness; per-file B12 recheck at release | K-BYTE (release); K-STD (handover) | Release per-file results; handover fact | OP-04 |
| Record provider handoff; Record provider filing evidence | Operator | Provider, evidence | Third-party mode | K-STD | Facts | OP-04 |
| Record outcome | Operator | Outcome, evidence | Outcome allowed for mode | K-STD | Core outcome | OP-05 |
| Confirm artifact association | Scoped reviewer | Version, application, evidence | B13 automatic criteria or scoped review | K-STD | Association, eligibility | OP-05 |
| Send result | `B46 BOUNDARY`; actor `OWNER CHOICE PENDING (Astra-only source)` | Application, selected files | Per-file B12 recheck at send; current TA email | K-EXT | Per selection: included, unavailable, failed; channel results | OP-06 |
| Record delivery evidence | Operator | Attempt, evidence | Uncertain attempt | K-STD | Delivery fact | OP-06 |
| Record manual email | Operator | Attempt facts, time, recipient as stated | Assigned; no release of bytes by the product; recipient compared with the current TA account email | K-STD | Attributed record, not system-verified; recipient mismatch flagged; B46 notice for completion effect | OP-06 |
| Open association incident | Server on failed automatic association; assigned operator on a contradiction | Artifact version, candidates, contradiction | Association not confirmed | K-STD | Incident with default owner (BS B13) | OP-05 |
| Request completion | `B46 BOUNDARY`; actor and trigger shape `OWNER CHOICE PENDING (Astra-only source)` | Application | Core prerequisites | K-STD | Completion event or blockers | OP-07 |
| Record incident evidence; Record incident correction and notice; Close incident | Incident owner | Evidence | Ownership; closure evidence | K-STD | Incident state | OP-08, SA-08 |
| Block document version | Incident owner | Version, reason | Confirmed disclosure | K-STD | Blocked version, retained retrievals | OP-08 |
| Record original receipt; Record original movement; Record holder uncertain; Record owner receipt | Operator | Item, evidence | Physical route; PARKED steps unavailable | K-STD | Custody fact | OP-09 |
| Decide help request | SuperAdmin | Request, decision, reason | Open | K-STD | Decision, TA notice | SA-02 |
| Dismiss intake issue | SuperAdmin | Issue, reason | Open | K-STD | Dismissal | SA-02 |
| Decide deferral | SuperAdmin | Request, decision | Open | K-STD | Deferral with review point | SA-02 |
| Assign reviewer; Assign incident owner | SuperAdmin | Incident, person | No filing authority conferred | K-STD | Owner | SA-02, SA-08 |
| Assign operator | SuperAdmin | Applications, operator or round robin | Gate 1 met or excepted per application | K-BATCH | Per-application result | SA-03 |
| Reassign operator | SuperAdmin | Application, new operator, reason | Assigned | K-STD | Old/new, duties, holder, reconfirmation flag | SA-03 |
| Record exceptional correction | SuperAdmin | Field, evidence, reason | Validations; not protected facts | K-STD | Before/after | SA-04 |
| Record unresolved external outcome | SuperAdmin | Attempts, reason, future owner | Reconciliation exhausted; B24 prerequisites evaluated by Core | K-STD | Authorization recorded; Core completion as `external_outcome_unresolved` when prerequisites are met (BS B23) | SA-04 |
| Publish offering values | SuperAdmin | Values, reason, effective condition | Supported values only | K-STD | Before/after, affected scope | SA-05 |
| Record structural approval | SuperAdmin | Version, scope, evidence | — | K-STD | Approval record | SA-05 |
| Record existing-work treatment | SuperAdmin | Application(s), treatment | Compatibility evidence for transition | K-BATCH | Per application | SA-05 |
| Launch offering; Suspend offering; Lift suspension; Withdraw offering | SuperAdmin | Scope, reason, evidence | Readiness (B32) for launch; lift restores approved scope only | K-STD | Admission state | SA-05 |
| Create account | SuperAdmin | Role, individual identity, contact, reason | SuperAdmin account: K-2P | K-STD / K-2P | Account created, inactive | SA-06 |
| Change account status | SuperAdmin | Individual, status, reason | Operator duties listed | K-STD | Status, consequences | SA-06 |
| Request elevation; Approve elevation | SuperAdmin | Individual | Distinct approver; audit available (non-emergency) | K-2P | Elevation | SA-06 |
| Reset credentials | SuperAdmin | Individual, reason | — | K-STD | Reset issued | SA-06 |
| Grant read access; Revoke read access | SuperAdmin | Person, exact group, purpose, duration | — | K-STD | Grant | SA-06 |
| Record service payment; Correct payment record | SuperAdmin | Application, status, evidence | Additive only | K-STD | Payment fact | SA-07 |
| Record government fee fact | SuperAdmin | Application, fee, TA liability, TM-paid amount, evidence | Separate from service charge; no receipt allocation or recovery entry (BS B29 PARKED) | K-STD | Fee, liability and TM-paid facts | SA-07 |
| Change exposure ceiling (lower); Request ceiling increase; Approve ceiling increase | SuperAdmin | TA, value, reason | Increase: K-2P | K-STD / K-2P | Old/new, identities, effective time | SA-07 |
| Record gate exception | SuperAdmin | Application, gate, action, reason, evidence | Gate exceptable; fresh | K-STD | Permission changed; unchanged facts | SA-09 |

## 8. Component library

Every component MUST render loading, unavailable and denied content without zero or invented values (D7).
"Data" names facts in words. The read model supplies every fact. A component MUST NOT derive a business fact.

### 8.1 Shared components (UX §7.4 first)

| ID | Component | Required states | Data it needs | Accessibility |
|---|---|---|---|---|
| CMP-01 | Action panel | Your action; another owner acts; external wait; no current action with review point; blocked (evidence can fix / decision can resolve / another person owns / policy unavailable); unavailable facts | Owner (person or role), exact next step, blocker type and evidence, the one available action, recorded review point or deadline if one exists | Region heading "Next action". Blocker type in text, not color. The action has a descriptive verb. |
| CMP-02 | Evidence row | Missing; processing; accepted evidence; conflict; unsafe or quarantined; unreadable; unavailable; replaced | Document type, exact version, current association, verdict, reason, owner | Row label includes type and state. Icons have text equivalents. |
| CMP-03 | Outcome/progress summary (status facts group) | Each fact independently: known, not recorded, unavailable, uncertain | Common progress, lifecycle, outcome, filing fact, readiness, payment, custody, delivery, next owner and action (UX §2.2) | A definition list with one label per fact. No combined badge, no percentage (D4). |
| CMP-04 | Task list | Not started; in progress; needs evidence; cannot start yet (reason); completed by facts | Sections and their fact-derived states | List of links; state text after each link (UX §7.5). |
| CMP-05 | Review and confirm | Draft review; confirmation required; submitting; stale revision | Scope, values, effects, evidence, current revision | "Change" links name their section. Confirmation checkbox never prechecked. |
| CMP-06 | Queue/table | S1–S7; selection; per-item bulk results | Stable row identity, unit labels, scope, sort, page range | Table headers; labelled selection controls; result count announced on filter change. |
| CMP-07 | Error summary | Hidden; shown with links | Field errors with messages | Receives focus after failed submission; each link moves to the field. No account-existence leak. |
| CMP-08 | Operation receipt | Accepted; partially accepted per item; rejected; unresolved | Command identity, time, actor, resulting facts per item | Announced politely; focus does not move unexpectedly. |
| CMP-09 | Timeline | Loading; empty; partial; corrections shown additively | Actor, source evidence, event time, recorded time, original and correction entries | Ordered list; both times labelled in text. |
| CMP-10 | Policy boundary notice | Policy pending; evidence pending; owner unknown | Specific policy or evidence, owner if known, route | Associated with the affected control by description. Wording in section 11.3. |
| CMP-11 | Identity band (ADDED name, UX §5.3, §7.3) | Full; masked; unavailable | Applicant, masked identity cue, application ID, group, country, service, mode, TA, operator | `h1` holds applicant and application ID. Masked value has a text label. |
| CMP-12 | Freshness indicator (UX §3.3, §8.3) | Current; as of [time]; freshness unavailable | As-of time, degradation flag from the read model | Text, not icon only. |
| CMP-13 | Unresolved command banner (UX §3.3; BU §5.2) | Checking; resolved accepted; resolved rejected | Original operation identity and current result | Live region polite; "Check status" button. |
| CMP-14 | Stale revision comparison (UX §3.3; BU §7.3) | Shown; reviewed | Current values, user's unsent proposal, who changed what and when | Side-by-side on wide, stacked on phone; field labels repeated. |
| CMP-15 | Readiness checklist (UX §5.3) | Per row: met; unmet; allowed by exception (scope); unknown applicability; non-overridable stop | Validations, prerequisites, gates, cut-offs, unresolved decisions; evidence, owner, resolution link | List grouped by control kind with headings. No universal "Ready". |
| CMP-16 | Money facts panel (UX §6.3) | Each fact: recorded; corrected (original kept); not recorded; unavailable | Quote, service payment, government fee, TA liability, TM-paid, allocated receipts, outstanding recovery, exposure | Tabular numerals; currency in text. |
| CMP-17 | Custody item row (UX §2.2; BS B30) | Holder known; holder uncertain; in movement; partly returned; returned with evidence | Item, association, holder and location, movements, return evidence | State in text. |
| CMP-18 | Delivery attempt row (UX §5.3; BS B12, B31) | Included; unavailable; failed; uncertain; proven success; proven failure | File, version, recipient, channel, time, evidence | Per-file state in text. |
| CMP-19 | Document viewer (BU §6.3) | Loading; available; unavailable; no highlight; full size | Permitted file view, page, source locator, extracted text (separate) | Page navigation and zoom by keyboard. Extracted text available as text. |
| CMP-20 | Saved view tabs (UX §5.2) | Selected; count; count unavailable | View name, item count with unit | Tabs are filters; implemented as links or tabs with labels. |
| CMP-21 | Notice item (UX §4.2) | Unread; read; decision required; acknowledged | Type, application, time, read fact, acknowledgement fact | Read and acknowledged stated separately. |
| CMP-22 | Support-view banner (UX §6.3) | Active | Target individual, scope | Persistent; first in reading order after skip link. |
| CMP-23 | Environment label (UX §7.1) | Test; absent in production | Installation type | Text in top bar and page title prefix. |
| CMP-24 | Context band (BU §4.1) | Full; offering unavailable | Group, country, travel dates, service context | "View requirements" is a button that opens a panel. |
| CMP-25 | Decision form (UX §6.3) | Draft; second approver required; awaiting second approver | Scope, effect, reason, approver identities | Required fields labelled; consequence review before submit. |
| CMP-26 | Batch selection bar (UX §3.3; BU §6.2) | None; selected on this page; full scope confirmed | Selected count, unit, exclusions | "Selected on this page" stated; no silent hidden selection. |
| CMP-27 | OTP code field (UX §7.5) | Empty; filled; expired; locked | Code length | Paste and autofill allowed; one field, not split boxes (ADDED). |
| CMP-28 | File input (BU §9) | Empty; transferring; accepted; not accepted; replaced | File name, size, format, limit | "Choose file" button; drag-and-drop optional only. |

Bulk components CMP-30 to CMP-47 are in BULK-UPLOAD-UI-PLAN.md section 5.

## 9. Design tokens, type, spacing, density, motion, breakpoints

UX §7.2 tokens are proposed, not adopted branding. Rows marked ADDED are beyond the specification.

| Token group | Values |
|---|---|
| Typeface | System sans. Source Sans 3 is a P2 option after licence (C16). One family. Tabular numerals for money and count columns. |
| Type scale | Body and input 16 px; supporting and table 14 px; metadata 12–13 px, used sparingly; headings 20 / 24 / 28 px. Rem units. ADDED: line height 1.5 for body, 1.25 for headings. |
| Surfaces | Paper `#F5F4F0`; white `#FFFFFF`; ink `#172D35`; muted text `#52636B`; rail = ink with light text. |
| Primary action | Teal `#006B63` for primary action, current location and selection only. |
| Semantic | Attention `#8A4B08`; blocking or error `#B42318`; external wait `#5F48A8`; neutral slate. Always with a label and an icon. |
| Positive outcome | ADDED: no separate success hue in P0. "Issued" uses ink text and an icon. Rationale: processing completion is not visa success (UX §7.2). |
| Tints | ADDED: status tint = semantic color at about 10% on white; text stays in the full semantic color or ink; each pair MUST meet 4.5:1. |
| Focus | ADDED: 2 px ink outline with 2 px white offset on light surfaces; 2 px paper outline on the rail. MUST meet 3:1 non-text contrast and MUST NOT be hidden by sticky regions (UX §7.5). |
| Spacing | 4 / 8 px rhythm. ADDED scale: 4, 8, 12, 16, 24, 32, 48. Major sections 24–32 px. Panel padding 16–24 px. |
| Shape | Radius 8 px; thin borders; restrained shadow on overlays only. |
| Density | Queue rows 52–64 px. Compact density is P2 and needs evidence. No decorative metric-card grids. |
| Action hierarchy | One dominant action per task; secondary actions quiet but visible; consequential actions use descriptive verbs and a consequence review. |
| Motion | 150–200 ms functional transitions. Reduced motion: no transition. Rows never animate into a new order during user action (BU §9). |
| Contrast | UX §10.3 records the text pairs at 5.69:1 or higher on white and paper. Focus, tint, selected, disabled and loading pairs MUST be checked. |

Responsive layout (UX §7.3; BU §9). The pixel breakpoints are ADDED.

| Band | Width (ADDED) | Layout |
|---|---|---|
| Wide | ≥ 1200 px | Rail 224–240 px; work column; context column 280–320 px only when the work column keeps ≥ 600 px. Bulk results: full-width table with resizable detail split. |
| Intermediate | 768–1199 px | Rail collapses to a menu button. Action panel moves above details. Bulk detail replaces the list with "Back to results". |
| Phone | < 768 px | 16 px side gutter. Order: identity → next action and blockers → details → history. Cards for rows. Full-screen task pages. Wide tables scroll inside a labelled region. A bottom action area MAY exist only if it never covers focus, errors or evidence. |

## 10. Accessibility and usability acceptance criteria

Each statement is a test. Target: WCAG 2.2 AA (UX §7.5). No conformance is claimed.

- AC-01. Every task on every page MUST be completable by keyboard alone (UX §7.5; BU §9).
- AC-02. Focus MUST be visible and MUST NOT be hidden by sticky bars or panels (UX §7.5, §7.3).
- AC-03. Every page MUST have landmarks, one `h1` and a logical heading order (UX §7.5).
- AC-04. At 400% zoom and 320 CSS px width, content and actions MUST NOT require two-dimensional page scrolling, except wide tables inside a labelled scroll region (UX §7.3, §7.5).
- AC-05. Every input MUST have a visible label (UX §7.5).
- AC-06. A status MUST NOT be conveyed by color alone. Each status MUST have text (UX §7.2; BU §9).
- AC-07. The OTP field MUST accept paste and one-time-code autofill (UX §7.5).
- AC-08. After a failed submission, focus MUST move to the error summary; each summary link MUST move to its field; entered values MUST remain (UX §7.4; BU §9).
- AC-09. Command results MUST be announced without moving focus (UX §7.5).
- AC-10. Touch targets SHOULD be at least 44 × 44 px and MUST meet WCAG 2.2 target size (UX §7.5).
- AC-11. Normal text MUST meet 4.5:1; non-text indicators and focus MUST meet 3:1 (UX §7.5).
- AC-12. An action MUST NOT exist only on hover or only through drag-and-drop (UX §7.3; BU §9).
- AC-13. A disabled or unavailable control MUST expose its reason to screen readers (UX §7.4).
- AC-14. Reduced-motion preference MUST remove transitions (UX §7.2).
- AC-15. Tables MUST have header cells; selection controls MUST be labelled with the row reference (BU §9).
- AC-16. Filter and page changes MUST announce the result count and MUST NOT move focus (BU §9).
- AC-17. Import milestones MUST be announced; progress ticks MUST NOT be announced (BU §5.1, §9).
- AC-18. Import completion MUST NOT move focus, change selection, scroll or clear unsent input (BU §5.1).
- AC-19. "Next issue" MUST be keyboard reachable and MUST keep the originating filter (BU §6.3, §6.5).
- AC-20. Long names, multilingual filenames, missing names, long service labels and a 200-file folder MUST render without hiding identity. Truncated text MUST have a keyboard- and touch-accessible full form (BU §9).
- AC-21. At narrow width and zoom, identity, reason, owner and next action MUST appear before secondary metadata (BU §9).
- AC-22. Loading, empty, no match, partial, unavailable and finished-with-issues MUST be separate, testable states. A skeleton MUST NOT read as an empty table. An unavailable total MUST NOT read as zero (BU §9; D7).
- AC-23. BU-25: a keyboard-only user on a narrow screen at zoom MUST read source, resolve an issue, move by "Next issue" and keep focus and position; absent preview highlights MUST show a page locator instead.
- AC-24. A first-time TA MUST identify the next owner and action of an application from TA-07 without help (UX §12 V24). Measure task success; report sample size.
- AC-25. A TA MUST explain the counts on BU-P05 by unit (BU §11 validation). Measure task success; report sample size.
- AC-26. Users MUST distinguish outcome from completion and authorization from execution (UX §12). Measure confusion; report sample size.
- AC-27. Mobile switching between "Source" and "Proposal" views MUST keep unsent input (BU §9).
- AC-28. The environment label MUST be present on every page in a test installation and MUST be read by screen readers (UX §7.1).

## 11. Copy rules and label glossary

### 11.1 Copy rules

- CR-01. Name the specific application, file or action. No "Invalid data", "Something went wrong", "100% verified", "All done" (BU §10.1).
- CR-02. State what is known, who acts and what happens next (UX §8.2).
- CR-03. Do not promise approval, timing or an SLA. An estimate is "estimate" (BS B17; UX §8.1).
- CR-04. Do not disclose account existence (BS B08).
- CR-05. Use readable role names. Do not show logical writer names (Core, TA Delivery) in buttons (UX §5.3).
- CR-06. Time: show event time and recorded time where both exist. Show the timezone with every time (ADDED; Asia/Kolkata, labelled IST (AD-10)).
- CR-07. Counts always name the unit (BU §6.2).
- CR-08. Synthetic data is labelled synthetic in test installations (BS B37).
- CR-09. All copy is draft until C05, C06 and BU §10.2 copy approval.

Forbidden labels: "Approved" or "Done" as an overall status; "Ready" as a universal state; "Override" or "Admin override"; "File visa"; "Submit for TA"; "Submit all"; "Accept anyway"; "Ignore all warnings"; "Merge people"; "Mark verified"; "AI verified"; "Import again"; "Cancel import"; "Force complete"; "Reopen system"; "Pay now".

### 11.2 Glossary

| Concept | Label | Notes and source |
|---|---|---|
| Common progress | Draft; TA action needed; With TravelMudra; External wait; Delivery/closure pending; Completed | UX §2.2; BS B21 |
| Lifecycle | "Lifecycle" row; "Completed" means normal processing ended | Never "success" (BS B21) |
| Outcome | Issued; Refused; Withdrawn; Cancelled; Dependency failed; Prepared and handed over; External outcome unresolved; absent = "Outcome not recorded" | UX §2.2 |
| Filing / external act | Authorized; Evidence of action recorded; Execution uncertain; Reconciled | Handoff, courier or payment is not filing (UX §2.2) |
| Readiness / control | Met; Not met; Allowed by exception ([scope]); Applicability unknown; No exception exists | UX §2.2, §5.3 |
| Payment | Service payment; Government fee; Recovery outstanding; Exposure; Financial follow-up | Separate rows (UX §2.2) |
| Custody | Held by [holder]; Holder uncertain; Partly returned; Returned to owner | UX §2.2 |
| Delivery | Sent; Web notice; Retrieved; Acknowledged; Delivery uncertain; Failed | Separate facts (BS B31) |
| Next action | Next: [person or role] — [action]; Review point [date] | No invented deadline |
| Group | Group | One TA, one country |
| Source row | Row [n] in [worksheet] | BU §3.1 |
| Source file | [path] / [filename] (version [n]) | BU §3.1 |
| Applicant candidate | Applicant not yet established / candidate | Not an application |
| Application | Application [ID] | One applicant, one group, one service |
| Intake attempt | "Import [reference]" in titles; "intake attempt" in history | BU §3.1 |
| Intake issue | Issue | Has reason, scope, owner, next action |
| Entry label | "Bulk upload" | TA entry choice (BU §3.1) |
| Operation label | "Import" | The operation and its workspace (BU §3.1) |
| Row outcome | Fully processed; Partly processed; Failed | Checks ran; not correctness (BS B16) |
| File outcome | Checks finished; Partly checked; Failed; Excluded | BU §6.2 |
| Application effect | Created; Updated; Unchanged; Not accepted | BU §6.2 |

### 11.3 Policy boundary notice wording

Template: "[Action] is unavailable until [specific policy or evidence] is [approved / recorded]. Owner: [owner or
'not yet named']. [Route link]." Examples:

- "Starting a result send is unavailable until the product owner decides the event that starts it. Owner: product owner." (BS B46)
- "Accounting actions are not yet defined. Owner: product owner." (BS B29, B43)
- "Recovery without access to your current email is not available. Owner: product owner." (BS B09, B44)
- "This reservation case is not yet decided, so the fee commitment is unavailable. Owner: product owner." (BS B28)

## 12. Build sequence

Each package is done when its proof scenario passes with synthetic data and the three command results
(ACC, REJ, UNR) are shown on every page in the package.

### 12.1 P0 (D6)

| WP | Pages | Commands | Read models | Done when |
|---|---|---|---|---|
| WP-01 Shell and command patterns | SH-01, PUB-02, OP-10 (sign-in and MFA only) | Request sign-in code, Verify sign-in code, Staff sign-in, Enrol MFA factor, Sign out, Check operation status | Session context, Recent operations, Notices | V23 |
| WP-02 Offering admission minimum | SA-05 (publish, launch), SA-06 (create and account status), TA-02, TA-03 | Publish offering values, Record structural approval, Launch offering, Create account, Change account status | Offering catalogue, Offering administration, Accounts and grants | V01 |
| WP-03 Groups, individual intake, submit | TA-01, TA-04, TA-05, TA-06, TA-07 (submit path, help request), TA-08, TA-09 | Create group, Create draft application, Save draft section, Upload document, Submit application, Request help | TA attention, Group list, Group detail, Application list, Application case (TA), Draft intake | V05, V02 |
| WP-04 Bulk import core | BU-P01, BU-P02, BU-P03, BU-P04, BU-P05, BU-P06 (read and Replace document), BU-P09, BU-P10 | Upload source workbook, Read source, Answer mapping question, Choose service for scope, Start import, Submit application | Import attempt, Source interpretation, Intake issue detail, Import review queue | BU-01, BU-04, BU-09, BU-13, BU-23 |
| WP-05 Bulk retry and correction | BU-P07, BU-P08 | Read revised source, Apply corrections, Retry eligible failures | Correction preview, Recent operations | BU-14, BU-15, V04 |
| WP-06 Gate 1 and assignment | SA-01, SA-02 (submitted unassigned), SA-03 (assign), SA-07 (service payment), SA-09 (Gate 1) | Record service payment, Record gate exception, Assign operator | Decision inbox, SuperAdmin work queue, Assignment candidate, Money and exposure, Gate decision context | V06 |
| WP-07 Operator readiness and external action | OP-01, OP-02, OP-03 (return), OP-04 (authorize, evidence, mark uncertain), SA-07 (Gate 2 route, ceiling), SA-09 (Gate 2) | Confirm readiness, Return to TA, Authorize external action, Record external action evidence, Mark execution uncertain, Change exposure ceiling, Request/Approve ceiling increase | Assigned work queue, Operator case, Readiness checklist, External action | V08, V09, V10 |
| WP-08 Outcome, delivery and completion surfaces | OP-05, OP-06, OP-07, TA-07 (outcome, delivery rows, retrieval), TA-10 | Record outcome, Upload document (artifact), Confirm artifact association, Open association incident, Mark notice read; Send result, Request completion and Retrieve result file defined behind `B46 BOUNDARY` | Outcome and artifact, Send preview, Completion prerequisites, Notices | V13; V14 and V17 to their boundary |

P0 end state: the standard case reaches step 13 with send and completion shown as `B46 BOUNDARY`. The
case cannot reach "Completed" until the product owner resolves B46 (section 13).

### 12.2 P1

| WP | Pages | Commands | Read models | Done when |
|---|---|---|---|---|
| WP-09 Assistance and report a problem | TA-07, OP-02, OP-03, SA-02 | Decide help request, Save assistance entry, Return for TA review, Report a problem, Flag to SuperAdmin | Operator case, SuperAdmin work queue | V07, BU-21, BU-22 |
| WP-10 Service shapes and dependency | OP-04, OP-05, OP-02 | Release packet, Record packet handover, Record provider handoff, Record provider filing evidence | External action, Readiness checklist | V12 |
| WP-11 Reconciliation and unresolved outcome | OP-04, SA-04, SA-01 | Record reconciliation evidence, Record unresolved external outcome | External action, Oversight | V11 |
| WP-12 Physical originals | OP-09, SA-03 (reassignment preview) | Record original receipt, Record original movement, Record holder uncertain, Record owner receipt, Reassign operator | Originals register, Assignment candidate | V18 (to boundary) |
| WP-13 Offering change and suspension | SA-05 (full), TA-03, TA-07 | Record existing-work treatment, Suspend offering, Lift suspension, Withdraw offering | Offering administration | V20, BU-27 |
| WP-14 Incidents, audit and degradation | OP-08, SA-08, SA-01 | Incident commands, Block document version, Assign incident owner | Owned incidents, Incident and audit, Reporting health | V13 (disclosure), V23 |
| WP-15 Accounts, access and email change | SA-06 (full), TA-12, OP-10 | Request/Approve elevation, Reset credentials, Grant/Revoke read access, email change commands | Accounts and grants, Support view, Account | V21, V22 |
| WP-16 Money follow-up and history | TA-11, SA-07 (full) | Correct payment record, Record government fee fact | TA payment history, Money and exposure | V09, V19 |
| WP-17 Group end, withdrawal, deferral, timing | TA-05, TA-07, OP-02, SA-02, SA-04 | Edit group travel dates, Request withdrawal, Request deferral, Decide deferral, Decide price increase, Acknowledge notice | Group detail, Application case | V19 |
| WP-18 Remaining bulk | BU-P03, BU-P05 to BU-P08, SA-02 | Abandon intake issue, Dismiss intake issue | All bulk read models | BU-02, -03, -05 to -08, -10 to -12, -16 to -20, -24 to -26 |
| WP-19 Delivery uncertainty | OP-06, TA-07, SA-02 | Record delivery evidence; deliberate resend after proven failure; Record manual email | Send preview | V15, V16 (to boundary) |
| WP-20 Public entry | PUB-01 | None | None (static, input C02) | V25 and recorded crawl/SEO check |

### 12.3 P2

| WP | Pages | Commands | Read models | Done when |
|---|---|---|---|---|
| WP-21 Optional presentation | OP-01, SA-02, BU-P05, PUB-01, SH-01 | None | None | Compact density only with V24 evidence; brand font only with input C16; illustration only with input C15 |

## 13. Open owner choices, boundaries and assumptions

### 13.1 Open owner choices

| ID | Item | Source | Treatment in this contract |
|---|---|---|---|
| OC-01 | Event that starts a result send | BS B46; UX §3.1 step 8, §5.3 (OD §2) | `B46 BOUNDARY`, owner product owner. OP-06 preview, per-file recheck and receipt are built. Explicit operator send is `OWNER CHOICE PENDING (Astra-only source)`. |
| OC-02 | Trigger and owner of the Core completion check, including unassigned cases | BS B24, B46; UX §3.1 step 9, §5.3 (OD §3) | `B46 BOUNDARY`. OP-07 shows prerequisites and blockers. Explicit operator Request completion is `OWNER CHOICE PENDING (Astra-only source)`. |
| OC-03 | Uncertain-email handling and ownership; privileged authorization before resend under continuing ambiguity | BS B31, B46; UX §5.3 (OD §§4–5) | B31 rules apply (uncertain is not success; no automatic resend; deliberate resend rechecks). Ownership is `B46 BOUNDARY`. Privileged authorization is `OWNER CHOICE PENDING (Astra-only source)`. |
| OC-04 | SuperAdmin fallback delivery ownership for an unassigned delivery duty | UX §2.3, §3.1 step 8, §10.1 (OD §2) | `OWNER CHOICE PENDING (Astra-only source)`. Route now: SA-03 assign an operator (BS B18, B19). |
| OC-05 | No SuperAdmin completion request and no force-complete | UX §2.3, §5.3 (OD §3) | `OWNER CHOICE PENDING (Astra-only source)`. The contract adds no SuperAdmin completion control. |
| OC-06 | Named communication identities, provider directions (authentication and application senders, CAPTCHA and mail providers) | UX §8.2 (PD; OD §5) | `OWNER CHOICE PENDING (Astra-only source)`. Copy uses role words ("TravelMudra"); no sender address appears in the UI. |
| OC-07 | Offering readiness stage labels (Defined to Active) | UX §6.3 (OD §6) | `OWNER CHOICE PENDING (Astra-only source)`. SA-05 shows B07/B32 evidence items without a stage machine. |
| OC-08 | First real country/service and accountable owner | UX §9 C03, BS B02 | Input. All fixtures stay synthetic. |
| OC-09 | Whether preparation-only packet release to the TA is a delivery start under BS B46, or a handover outside it | BS B04, B24, B31, B46; RF-06 | Conservative treatment: Release packet stays behind the B46 notice with a per-file B12 recheck. Record packet handover stays available as a fact record. Max decides. |
| OC-10 | TA onboarding: SuperAdmin-created accounts only, or a request route for a TA | BS B08, B11, B44; RF-29 | Plan treatment: SuperAdmin creates and activates accounts (Create account). No self-registration page exists until Max decides. |

The UX draft numbered these differently; that numbering is withdrawn (AD-14).

### 13.2 Boundaries

| ID | Item | Source | Treatment in this contract |
|---|---|---|---|
| B-01 | TA account eligibility, fraud, first-admin and all-admin-loss recovery | BS B08, B11, B44 | `PARKED`/unselected. Boundary notice on SA-06 and PUB-02. |
| B-02 | Lost old mailbox recovery | BS B09, B44 | `PARKED`. Boundary on TA-12. |
| B-03 | Three B28 reservation cases (excluded fee record, ordinary paid case at ₹0, unused reservation release) | BS B28, B43 | `PARKED`. Individual boundary on OP-04 and SA-07. |
| B-04 | Accounts dashboard, actions, mutation grant; write-off; refunds; assistance charges; fee formula; other-mode fees | BS B29, B43 | `PARKED`. No control. Exposure decrease shows a boundary. |
| B-05 | Shared-original policies | BS B30, B44 | `PARKED`. Boundary on affected OP-09 steps. |
| B-06 | Preparation-only post-handover, cut-off and dependent-result evidence; generic cancellation; country-specific unknown-filing recovery; unapproved provider route | BS B44 | `PARKED`. Boundaries on OP-04 and SA-04. |
| B-07 | Accepted intervals: per-file send interval, post-authorization filing residual, no recall | BS B12, B23, B45 | `OWNER_DECISION`. No lock, no streaming recheck, no recall control. |
| B-08 | Excluded scope (applicant portal, autonomous assignment, gateway, private sources, other-tool imports and more) | BS B42 | `EXCLUDED`. No page or control. |
| B-09 | Applicant, regulator and legal notices after disclosure | BS B13 | Separately authorized compliance work. Boundary on OP-08. |
| B-10 | Estimates are not an SLA | BS B17 | No deadline is displayed unless recorded. |

### 13.3 Assumptions

| ID | Assumption | Reason |
|---|---|---|
| A-01 | A SuperAdmin creates and activates TA accounts on SA-06. No self-registration. | BS B11 lists approval and activation; B08 leaves eligibility unselected. |
| A-02 | Ordinary group closure is a Core evaluation shown as a fact on TA-05. No TA "Close group" command. | BS B25 states conditions, not an actor. |
| A-03 | Government fee, TA liability and TM-paid facts are entered on SA-07. Receipt allocation and recovery stay read-only (BS B29 PARKED; RF-14). | UX §6.3 manual money record. |
| A-04 | A Gate 2 decision uses SA-09, reached from SA-07 or from an OP-04 rejection. | Brief §3 names Gate 2 in SA-07; UX §6.3 requires one generic exception surface. |
| A-05 | The page keeps the operation identity (no personal data) for the browser tab and reads the Recent operations read model after a refresh. | BS B35 and BU-14 need reconciliation after reload. UX §3.3 forbids only identity documents in browser persistence. |
| A-06 | Notice read state is a recorded fact (Mark notice read command). | UX §4.2 keeps read state separate from acknowledgement. |
| A-07 | Record outcome is an operator command whose writer is Core. | BS B21, B34. |
| A-08 | Desktop is the main dense-work context. TA work MUST also work on phones. Plain English is the initial language. | UX §11. |
| A-09 | Operator Applications destination reuses OP-01 with an "All assigned" view. No browse-all list exists (UX §5.2). | UX draft assumption A3 |
| A-10 | SA application detail reuses the OP-02 layout without operator actions (UX §6.2). | UX draft assumption A4 |
| A-11 | BU-P09 is the Imports tab of TA-05 and also opens as a full page. | UX draft assumption A5 |
| A-12 | The proposed bulk page size (50; options 25/50/100) applies to bulk tables. Other queues use the same default until evidence says otherwise. | UX draft assumption A6 |
| A-13 | "Confirm readiness" is an operator command on OP-02 Work tab (BS B18). The specifications name the judgment, not a page. | UX draft assumption A7 |
| A-14 | Payments for operators appear as a money summary inside the Work and External actions tabs where authorized (UX §5.3), because the brief's OP-02 tab list omits a Payments tab. Settled by AD-09. | UX draft assumption A8 |

### 13.4 Items decided

| Source | ID | Item | Draft recommendation | Decision |
|---|---|---|---|---|
| Behavior draft 8.3 | PE item 1 | B46 makes the P0 journey stop before "Completed". | P0 can reach the send preview and completion blockers only. Decide whether to ask Max to resolve OC-01 to OC-03 before P0 acceptance, or to accept a P0 end state at the boundary. The page design does not change either way. | AD-01; AD-02 |
| Behavior draft 8.3 | PE item 2 | ₹0 default ceiling and the PARKED "ordinary paid case at ₹0" (BS B28) block the TM-filed fee path. | A TM-filed case with a government fee cannot be authorized unless two SuperAdmins raise the ceiling, and no product path decreases exposure (Accounts PARKED, BS B29). Decide the P0 demonstration route (raised ceiling, or a mode without TM-funded fees) and surface the limitation to Max. | AD-03 |
| Behavior draft 8.3 | PE item 3 | Lost-acknowledgement recovery after a page reload. | BS B35 and BU-14 need a server-side record of each user's pending operations (assumption A-05). Decide that the read-model contract includes it. | AD-04 |
| Behavior draft 8.3 | PE item 4 | TA account creation and staff MFA enrollment path. | BS B08 leaves eligibility unselected. Assumption A-01 is an engineering default; confirm it, or route it to Max as a product choice. | AD-05 |
| Behavior draft 8.3 | PE item 5 | Ordinary group closure actor and trigger (BS B25). | Assumption A-02 makes it a Core evaluation. Confirm, because TA-05 and the group-end variation depend on it. | AD-06 |
| UX draft 8.3 | AR-01 | While B46 is open, do OP-06 and OP-07 offer any command? Includes BS B24 "manual operator email" record | Render preview, eligibility, attempts and prerequisites from read models. Offer no send or completion command. Offer the manual email record only if the architect confirms that B24 permits it without a B46 trigger | AD-01 |
| UX draft 8.3 | AR-02 | Accept the ADDED pages SH-02, TA-13, SA-10 | Accept all three. Each closes a stated requirement with no other home | AD-07 |
| UX draft 8.3 | AR-03 | Staff sign-in: separate staff path and primary factor. BS B08 states MFA only | Two entry links on PUB-02. Primary factor is the architect's engineering choice | AD-08 |
| UX draft 8.3 | AR-04 | OP-02 Payments tab (UX §5.3 "where authorized") is absent from the brief's tab list | Use the summary in Work and External actions for P0; add a tab only if a permitted operator money action exists | AD-09 |
| UX draft 8.3 | AR-05 | Display timezone and time format | One named display timezone with a visible label on every time; event and recorded time both shown in timelines | AD-10 |
| UX draft 8.3 | AR-06 | Stale rule | No client-side age threshold. "Stale" only when the read model reports lag or degradation. Always show "Updated [time]" | AD-10 |
| UX draft 8.3 | AR-07 | Pixel breakpoints (ADDED, UI-PLAN.md section 9) | Adopt 1200 / 768 for P0; revisit after C08 fixture tests | AD-11 |
| UX draft 8.3 | AR-08 | Context selector scope (operator with accounting grant; product owner account with SA permissions) | Show only real contexts; accounting context shows the boundary notice only | AD-12 |
| UX draft 7 | Gap: UX §8.2 | Communication identity and copy: email templates are not UI pages. Sender identities PENDING (PD, OD §5). Copy needs C06. | GAP | AD-15 |
| UX draft 7 | Gap: UX §5.3 | "Authorized contact outcome": no page records an operator's applicant-contact outcome; UX says no messaging platform is needed. | GAP (P2) | AD-15 |

Further items: confirm Gate 2 on SA-09 (A-04); confirm that "Record external action evidence" under
current authority after reassignment (V11) is the same command as the ordinary record; supply configured
source and batch limits (input C12) before BU-11 can show real values.

Architect disposition of the further items: A-04 is confirmed (AD-13). V11 uses the same command, Record
external action evidence, under current authority; no separate command exists. C12 is an input request to
Max; until supplied, BU-P02 shows "Source limit: not configured".

## 14. Dated addition, 12 October 2026 (UI revamp lane)

Added by the Principal Technical Architect of lane `ui-revamp-2026-10-12` (Opus 5.5) under
`execution-2026-10-12/UI-REVAMP-PROMPT.md` §4. Source: `../../uat/2026-10-12-uat-pass1-triage.md` §1 and §3.1.
This section adds states and rules. It does not rewrite sections 1 to 13. Where it differs from them, it
governs for the named page.

### 14.1 PUB-02 Sign-in: three added states (UAT-01, UAT-02, UAT-08)

| ID | State | Required behavior |
|---|---|---|
| PUB-02-S8 | Form already used (UAT-01) | The browser Back button returns the TA to the email step. The TA MUST be able to correct the address and send a new code without a manual reload. When the server refuses a reused operation key (`conflict_operation_key`), the refusal stays. The error text MUST offer a fresh form in one action ("Start again"), or the page MUST render a fresh form by itself. The error MUST NOT read as a fault of the address. |
| PUB-02-S9 | Code step names the address (UAT-02) | The code step MUST name the address that the TA typed, in the no-disclosure form: "If [address] can sign in, we sent a code to it." The line repeats the TA's own input. It MUST NOT state an account fact. The code step MUST offer "Use a different address" and, separately, "Request a new code". "Use a different address" returns to the email step with a fresh form. |
| PUB-02-S10 | Bot-check challenge expired (UAT-08, derived) | When the challenge of the sign-in form has expired (`captcha.ttlMs`, 5 minutes), the message MUST say that the check on this page has expired and that a reload gives a new check. The message MUST offer the reload in one action. It MUST NOT read as a generic failure ("The verification did not pass. Try again." is not acceptable alone). |

These states join the PUB-02 list of section 3.1. S1 to S6 still do not apply to PUB-02.

### 14.2 TA-09 Individual intake: two added rules (UAT-14, UAT-09)

- TA-09-R1 (UAT-14). The passport requirement MUST state the rule: a passport is exactly two pages, the front
  page and the back page. The TA MAY provide one file that holds both pages, or two files, one for each page.
  The form states both accepted shapes beside the passport input. The same rule text appears on BU-P02 and
  BU-P06 (see `BULK-UPLOAD-UI-PLAN.md` §7.2). Completeness checks belong to the bulk lane (document policy);
  the page shows what the read model reports.
- TA-09-R2 (UAT-09). A refused passport number MUST show the expected format in the message. The format comes
  from the validation rule that the Core applies. The page MUST NOT state a format of its own.

### 14.3 Acceptance additions bound to work packages

| Finding | Page | Work package |
|---|---|---|
| UAT-01, UAT-02, PUB-02-S10 | PUB-02 | WP-01 |
| UAT-05 | PUB-01 and the other public pages | WP-20 |
| UAT-14 (TA-09-R1), UAT-09 message (TA-09-R2) | TA-09 | WP-03 |
| UAT-06, UAT-10, UAT-14 (BU-P02, BU-P06) | BU-P02, BU-P04, BU-P06 | WP-04 |
| UAT-11 | BU-P09 or TA-01 | WP-04, after a seam request (`SEAM-CONTRACT.md` §3) |
