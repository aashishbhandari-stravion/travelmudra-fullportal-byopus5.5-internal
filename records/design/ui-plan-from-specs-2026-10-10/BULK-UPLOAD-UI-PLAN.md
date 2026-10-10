# TravelMudra bulk upload UI plan from the UX specifications — 10 October 2026

Status: architect's plan, integrated from the UX structure draft and the behavior contract draft. Not accepted product policy. Not an assessment of any built product. Inputs: UX, BU, RM, BS only (see README.md for hashes). Writing style: ASD-STE100 at about 80%.

## How to read

Read UI-PLAN.md sections A and 1 first. This document holds everything specific to bulk intake. Commands are in UI-PLAN.md section 7.

## 1. Bulk pages

**BU-P01 Add applicants chooser** · P0
- Purpose: choose individual entry or bulk upload. Entry: TA-05, TA-03.
- Blocks: context band (or group chooser with "Create group" → TA-13 when no group is preselected) → two choices: "Individual entry", "Bulk upload" → note "Import prepares drafts. You review and submit each application separately."
- Primary: continue with the chosen method. Secondary: "View requirements".
- Data: *read:* group context; offering availability.
- States: S1, S4, S6, S7. No selectable offering: boundary notice; no intake starts.
- Mobile: choices stacked.
- Sources: BU §3.1, §3.2, §4.1; BS B07, B14.

**BU-P02 Import source setup** · P0 (BU-01)
- Purpose: connect an existing spreadsheet or folder. Entry: BU-P01.
- Blocks: title "Add applicants in bulk" → intro → context band → source choice (Google Sheet / Excel file / Document folder) → controls for the choice → optional related spreadsheet or folder → document format and size guidance → configured source limits (only when supplied) → source checklist → public-source help ("Public access does not establish applicant consent.").
- Primary: "Read source". Secondary: "Change source"; "View requirements"; optional sample.
- Data: *read:* configured source limits. *command:* upload workbook; read source.
- States: S1, S6, S7; C1–C4. Specific: transfer in progress ("Keep this page open while the workbook uploads."); transfer interrupted ("The upload was not accepted." + "Choose file again"); unreadable source with observed reason + "Check source again" / "Change source"; empty source ("No rows or documents found in [worksheet/folder]").
- Mobile: choices stacked; file input uses "Choose file".
- Sources: BU §4.2; UX §4.3; BS B14, B15, B36.

```text
Groups / [Synthetic group] / Add applicants in bulk
[Synthetic group] · [Country] · Travel 12–20 Nov · [Service context]   [View requirements]
Use your existing spreadsheet or document folder. We will identify clear matches
and ask about anything that needs your attention.
( ) Google Sheet    (•) Excel file    ( ) Document folder
Excel file   [Choose file]  applicants-nov.xlsx · uploaded · [Replace]
Worksheet    [Sheet1 ▾]   (shown only when several plausible worksheets exist)
Document folder (optional)  [public folder link            ]
Documents: PDF, JPEG or PNG, 5 MB each. Workbook limit: [configured value or "Not supplied"]
Before you read the source: public links ✓  one country per group ✓
Public access does not establish applicant consent.          [Read source]
```

**BU-P03 Source interpretation and consequential questions** · P0 (BU-01, BU-04); other questions P1
- Purpose: show what the product understood and ask only consequential questions. Entry: BU-P02 after "Read source"; BU-P04 "Review mapping".
- Blocks: source summary (worksheet or folder, row and file counts or "Counting…") → "Source understood" with "View mapping" (editable; unused columns "Not used for this import") → question cards (CMP-32) → service scope confirmation (CMP-33) → import scope review (CMP-34).
- Primary: "Start import". Blocked when an ambiguity affects the whole source; the block names the question. Secondary: "View mapping"; "Change source"; per question "Choose field" / "Do not use this column" / "Correct the source".
- Data: *read:* source interpretation. *command:* answer interpretation question; apply service choice; start import.
- States: S1, S4, S6, S7; C1–C5. Specific: worksheet or header row choice needed; separable ambiguity (clear work may proceed); whole-source ambiguity (start blocked); folder-only scope ("Application count: not yet known").
- Mobile: questions as stacked cards; mapping table scrolls inside a labelled region.
- Sources: BU §4.3, §4.4; BS B14.

**BU-P04 Progress** · P0 (BU-13, BU-14)
- Purpose: show real processing progress and let the TA leave safely. Entry: BU-P03 "Start import"; BU-P09.
- Blocks: workspace header (source label, group, attempt reference, start time) → start-acceptance banner (CMP-36 shows "accepted and processing" or "start result unknown"; workbook transfer states belong to BU-P02) → text stage → progress strip with units (CMP-35) → "View available results" → paused-scope banner when present.
- Primary: "View available results". Secondary: "Review mapping" (paused scope); "Check status" (unresolved start).
- Data: *read:* import attempt progress.
- States: S1, S5, S6, S7. Specific: source read, not started; accepted and processing ("You can leave this page and return from Group → Imports."); paused by mapping fault; start result unknown ("We are checking the original import result. Starting again could repeat work."). No "Cancel import".
- Mobile: stage and counts stacked.
- Sources: BU §5.1, §5.2; BS B14, B16, B35.

**BU-P05 Results workspace** · P0 (BU-09)
- Purpose: exceptions first, with every supplied item accounted for. Entry: BU-P04, BU-P09, TA-05.
- Blocks: header (group, country, travel dates, attempt, last updated) → outcome headline → counts strip by unit (CMP-37) → view tabs: Needs your action, Applications, All source results, All issues, History → search and filters (reason, outcome, service, next owner) → exceptions-first table (CMP-38) → detail split (BU-P06).
- Primary: "Review applications" when nothing needs TA action; otherwise the selected issue's resolution action in the detail split. Secondary: "Correct this import" (BU-P07); "Next issue"; filters.
- Data: *read:* import results by unit; import issue list.
- States: S1–S7. Specific: processing continues (banner stays); finished with items needing attention; no applications created ("No applications were created. Review the source issues below."); nothing needs your action but other owners have work ("Nothing needs your action in this view. [Owner] is handling [scope]."); counts unavailable ("Unavailable").
- Mobile: source and applicant cards; issue opens full screen.
- Sources: BU §6.1–§6.3, §6.5, §9; BS B14, B16.

```text
Groups / [Synthetic group] / Imports / Import IMP-DEMO-07          Last updated 10:42 [tz]
[Synthetic group] · [Country] · Travel 12–20 Nov                   [View requirements]
Import finished with items needing attention
Source rows: 100 examined · 80 fully processed · 15 partly processed · 5 failed
Applications: 95 created as drafts                                  [Review applications]
Files: 212 checks finished · 6 failed · 3 excluded
Needs your action (20 rows) | Applications (95) | All source results | All issues | History
Search [row, applicant, application, filename]  Reason [All ▾]  Owner [You ▾]  1–20 of 20
─────────────────────────────────────────────────────────────────────────────────
Source / applicant        Service      Result               Next action
Row 14 · [synthetic]      [service]    Partly processed     Replace unreadable file
Row 28 · not established  Unknown      Failed               Clarify applicant and service
─────────────────────────────────────────────────────────────────────────────────
Row 14 · passport.pdf (p. 1)        | Unreadable document
[document viewer]                   | Owner: you · Needed: a readable passport copy
                                    | [Replace document]   [Next issue]
```

**BU-P06 Issue resolution detail** · P0 for BU-09 paths; P1 otherwise
- Purpose: one issue, its evidence and its next action together. Entry: BU-P05 row; "Next issue".
- Blocks: (1) group, service or application if established, source locator, issue title → (2) plain reason and affected action → (3) source value or document beside proposed or current value → (4) association evidence, contradiction, unknowns → (5) owner, evidence needed, one resolution action → (6) resolution outcome and "Next issue".
- Primary: one of "Replace document", "Choose service", "Correct source mapping", "Review proposed change", "Report a problem", "Request help". Secondary: "Next issue"; "Open full size"; "Abandon this intake issue".
- Data: *read:* intake issue detail with evidence. *command:* the issue's resolution command; request help; abandon intake issue.
- States: S1, S4, S6, S7; C1–C5. Specific: owned by someone else (read-only, owner named); no precise highlight (page locator only); document view unavailable; resolved (marked, list order kept).
- Mobile: full-screen; "Source" and "Proposal" views switch without losing input.
- Sources: BU §6.3–§6.5, §8.2; BS B13, B15, B16.

**BU-P07 Correction entry and change preview** · P0 (BU-15)
- Purpose: apply scoped corrections without replacing the group. Entry: BU-P05 "Correct this import".
- Blocks: original attempt context → entry choice: "Provide revised source" / "Open affected application or item" → read revised source → change preview (CMP-43) by category → default selection: eligible matched changes only.
- Primary: "Apply corrections to [N] applications". Secondary: expand any category; deselect items; "Change source".
- Data: *read:* correction preview. *command:* read revised source; apply corrections.
- States: S1, S4, S6, S7; C1–C5. Specific: nothing eligible to change; new applicants or services found (routed to separate intake); current application changed since preview.
- Mobile: categories as stacked expandable sections; before/after stacked per field.
- Sources: BU §7.1, §7.2; BS B16, B19.

```text
Imports / IMP-DEMO-07 / Correct this import
Original: 100 rows · 95 applications · source applicants-nov.xlsx (10 Oct 09:12 [tz])
Revised source: applicants-nov-v2.xlsx · 15 rows read
15 applications will change. 85 will remain unchanged. Review the changes before applying.
▸ Matched and changed (15 applications)          [selected 15 of 15]
    TM-DEMO-0042 · [service] · Passport number  [old] → [new] · evidence: passport v2
▸ Not included; left unchanged (85 applications)
▸ New applicant or service (1) — separate new intake, not part of this correction
▸ Match unresolved (0)   ▸ Changed since your review (0)   ▸ Edit unavailable (0)
This does not submit any application.     [Apply corrections to 15 applications]
```

**BU-P08 Correction result and attempt history** · P0 (BU-14, BU-15)
- Purpose: show what was accepted and keep the original history readable. Entry: BU-P07 after apply; BU-P05 "History".
- Blocks: correction receipt (CMP-44) per application → conflicts with "Review current version" → result check controls (CMP-47) → attempt history timeline (CMP-45) → view switch: "Original results" / "Current application and issue state".
- Primary: "Next issue" or "Review applications" after a settled result; "Check result" when the result is unknown. Secondary: "Retry eligible failures" (shows exact scope first); "Abandon this intake issue" (CMP-46).
- Data: *read:* correction outcome; attempt history. *command:* check original operation result; retry eligible failures; abandon intake issue.
- States: S1, S4–S7; C2–C5. No half-applied application is shown as success.
- Mobile: receipt rows as cards; history stacked.
- Sources: BU §7.3, §7.4; BS B16, B35.

**BU-P09 Imports list** · P0 (BU-13)
- Purpose: return to any attempt. Entry: TA-05 Imports tab.
- Blocks: active attempts first → finished attempts (source label, start and result times, processing status, unresolved issue count, "Open import").
- Primary: "Open import". Secondary: "Add applicants".
- Data: *read:* group imports.
- States: S1–S7.
- Mobile: cards.
- Sources: BU §3.2, §5.1.

**BU-P10 Application review from import** · P0 (BU-23)
- Purpose: review and submit each imported draft in sequence. Entry: BU-P05 "Review applications".
- Blocks: queue position ("Application 3 of 95 in this view") → queue filters (needs TA attention; ready for TA review under current controls; already submitted; awaiting someone else) → TA-08 content.
- Primary: "Submit this application". Secondary: "Back to import"; "Next application"; "Change" links; "Request help".
- Data: as TA-08, plus *read:* import review queue.
- States: as TA-08. After success: receipt and "Review next application". The queue keeps position. No "Submit all".
- Mobile: as TA-08; queue controls at top.
- Sources: BU §8.1; BS B17.

## 2. Per-page bulk actions

Section 4 defines the end-to-end bulk behavior and every count. This table lists the actions per page.

| Page | Action | Preconditions | Command | ACC | REJ / UNR | Unavailable |
|---|---|---|---|---|---|---|
| BU-P01 | Choose Individual entry or Bulk upload; choose group; Create group | Group context; selectable offering | Create group (if new) | Group preselected; to TA-09 or BU-P02 | Std | Offering boundary |
| BU-P02 | Choose source; enter URL; Choose file; Read source | Group open | Upload source workbook (Excel); Read source | Discovery and preflight result; to BU-P03 | REJ: source-specific reason beside the field; **Check source again** / **Change source**. Transfer interrupted: "Upload was not accepted" + **Choose file again** | No supported source for this scope → boundary |
| BU-P03 | Answer question; Choose worksheet/header; Choose service for scope; Do not use column; Start import | Discovery complete; whole-source ambiguity resolved before Start | Answer mapping question; Choose service for scope; Start import | Start: attempt reference; to BU-P04 | REJ: stale source; scope changed. UNR on Start: "Checking the original import result" | Whole-source ambiguity → Start shows reason and the open question |
| BU-P04 | View available results; Check status | Attempt exists | Check operation status (read) | Results banner | — | — |
| BU-P05 | Switch view; filter; select on page; Review applications; Correct this import; Next issue | Attempt exists | None (reads) | — | — | — |
| BU-P06 | Replace document; Choose service; Correct source mapping; Report a problem; Request help; Abandon this intake issue | Issue open; TA owns the next action | Upload document; Choose service for scope; Answer mapping question; Report a problem; Request help; Abandon intake issue | Issue result; **Next issue** keeps filter | Std | Issue owned by another role → owner and next step, no control |
| BU-P07 | Provide revised source; Open affected item; Apply corrections to [N] applications; Review current version | Original attempt exists; per-application edit permission | Read revised source; Apply corrections | Correction receipt per application | REJ per application: changed since review; edit unavailable. UNR: Check result | Assigned not returned → Report a problem route (BU-22) |
| BU-P08 | Check result; Retry eligible failures; open History | Operation exists | Check operation status; Retry eligible failures | Accepted effects plus eligible remaining failures | UNR: Check result again | No eligible failures → "No eligible failures to retry" |
| BU-P09 | Open import | Scope | None | — | — | — |
| BU-P10 | Submit this application; Back to import; Next application | As TA-08 | Submit application | Receipt and **Review next application** | As TA-08 | As TA-08 |

## 3. Bulk read models

The rules of UI-PLAN.md section 6 apply.

| Read model | Fields the pages need | Scope rule | Freshness display | Pages |
|---|---|---|---|---|
| Import attempt read model | Section 4.2 counts, stage, attempt reference, source label, group, started time, transfer state, operation states, history links | Own TA; own group | As-of time; "Counting…" and "Unavailable" | BU-P04, BU-P05, BU-P08, BU-P09, TA-05 |
| Source interpretation read model | Worksheet/folder, discovered counts, interpreted fields, representative values, questions with scope, blocking flag | Own TA; this attempt | Current at load | BU-P03 |
| Intake issue detail read model | Group, service/application if any, source locator, reason, affected action, source value, extracted value, current value, evidence, contradiction, unknowns, owner, next action | Own TA; owned or visible issues | As-of time | BU-P05, BU-P06 |
| Correction preview read model | Section 4.7 categories with lists, per-application before/after, revisions | Own TA; this attempt | Current at preview; revision per application | BU-P07 |
| Import review queue read model | Independent drafts with filter facts: needs TA attention, ready for TA review under current controls, submitted, awaiting another owner | Own TA; this attempt | As-of time | BU-P10, BU-P05 |

## 4. Bulk behavior end to end

Units follow BU §3.1: group, source row, source file, applicant candidate, application, intake attempt,
intake issue. Entry label is "Bulk upload". The operation is "Import". Detailed history says "intake
attempt". The pages MUST show "Import prepares drafts. You review and submit each application
separately." before Start (BU §3.1, §10.1).

### 4.1 Source setup and preflight (BU-P01, BU-P02; BU §4.1–4.2; BS B14, B15, B36)

1. Entry from TA-05 preselects the group. Entry from elsewhere asks for an existing group first. **Create
   group** uses the ordinary group fields and returns to setup. A country change needs a new group.
2. The context band shows group, country, travel dates, service context and **View requirements**.
3. BU-P02 offers three choices: Google Sheet (public URL, worksheet choice, optional public folder URL);
   Excel file (Choose file button and drop zone, replace control, worksheet choice, optional folder URL);
   Document folder (public folder URL, optional Sheet or Excel). Adding a spreadsheet to a folder reveals
   the same controls. ZIP upload, local folder upload and applicant upload links MUST NOT appear (BS B42).
4. The page shows "PDF/JPEG/PNG, 5 MB per document" beside the controls. Source and batch limits show
   only from configuration (input C12). Without configuration the page shows "Source limit: not
   configured". The 5 MB limit MUST NOT apply to a workbook.
5. The public-source help text states: "Public access does not establish applicant consent." (UX §4.3).
6. **Read source** sends Read source. The page labels this step "Reading source structure". It MUST NOT
   claim that applications exist.
7. Preflight separates batch prerequisite errors from applicant and file errors. A blocked source shows
   the observed reason beside the field with **Check source again** and **Change source**. A blocked
   source MUST NOT show drafts or an empty results screen. An empty source shows "No rows/documents
   found" and names the worksheet or folder.
8. Excel transfer: while bytes move, the page shows "Keep this page open while the workbook uploads". An
   interrupted transfer shows "Upload was not accepted" and **Choose file again**. The page MUST NOT
   claim resumable transfer.

### 4.2 Count definitions (BU §6.2; BS B16)

Every number on BU-P03 to BU-P10, TA-05 and SA-02 MUST name its unit and its total or known extent. The
page MUST NOT add counts of different units. An unknown count shows "Counting…" (still discovering) or
"Unavailable" (degraded). Neither shows zero.

| Count label (unit) | Exact meaning |
|---|---|
| Rows examined (source rows) | Applicant rows read from the selected worksheet. Excludes headings, blank rows and notes. |
| Excluded source material (source rows) | Headings, repeated headings, blank rows and note rows. Reported outside the row denominator. |
| Fully processed (source rows) | Planned processing and checks finished for the row. It does not certify facts, readiness or submission. |
| Partially processed (source rows) | Some independent results accepted; some row work unresolved. |
| Failed (source rows) | No usable draft effect accepted for the row. The row keeps its issue and reason. |
| Pending / Processing / Paused (source rows) | Rows without a final result. Paused means stopped by a systematic mapping fault. Shown separately until settled. After settlement, Fully + Partially + Failed = Rows examined. |
| Files discovered (source files) | Files found in the source. Each file is classified once. |
| Checks finished (source files) | Applicable file checks finished. It does not certify association or eligibility. |
| Partly checked (source files) | Some results exist; processing unresolved. |
| Failed (source files) | No usable processing result. |
| Excluded (source files) | Deliberately omitted as unrelated or out of scope, with a minimal reason (BS B15). Not an applicant failure. |
| Pending / Processing / Paused (source files) | Files without a final classification. |
| Applicant candidates (candidates) | Provisional groupings from evidence. Used for folder-only imports instead of rows. Not applications. |
| Applications created (applications) | Drafts created by this operation. One row can yield several. |
| Applications updated / unchanged / not accepted (applications) | Correction outcomes per explicitly identified target. Each target counts once. |
| Needs your action (affected rows, files or applications; label names which) | Items whose next action owner is this TA. Reason filters overlap; they are not totals. |
| Issues (issues) | Open intake issues. One item can have several issues. |
| Selected on this page (items) | Only visible checked items. Selection never extends to hidden rows. |
| Will change / will remain unchanged / not included, left unchanged (applications) | Correction preview categories (section 4.7). Where rows map to several applications, the row count shows beside the application count. |

### 4.3 Interpretation and consequential questions (BU-P03; BU §4.3–4.4; BS B14)

1. The page shows the source summary: worksheet or folder, discovered counts, interpreted fields and
   open questions.
2. A clear mapping shows **Source understood** with **View mapping**. Mapping MUST stay inspectable and
   editable before Start. The TA MUST NOT be required to approve each column or row (BU-01).
3. Unused columns show "Not used for this import".
4. Each ambiguous decision shows source heading, representative values, proposed meaning, affected scope
   and the question. Actions: **Choose field**, **Do not use this column**, **Correct the source**.
5. Worksheet or header choice appears only when discovery cannot find a clear table. The page shows the
   rows around the proposed header. Worksheets MUST NOT combine silently.
6. One row with several services shows each service and the resulting application count (BU-04). An
   ambiguous or unavailable service label raises a question. No similar service is substituted.
7. Missing service information: the page asks for the services for the exact candidate scope. Rows with
   explicit services keep them. Before applying, the page confirms affected rows or candidates, services,
   exclusions and the application count where known. Folder-only scope shows "Application count not yet
   known".
8. A consistent multirow-per-applicant pattern is accepted. A mixed pattern raises a question and is
   never guessed.
9. Identity, document association and applicant-specific confirmation are not bulk choices.
10. A separable ambiguity lets clear work proceed and keeps the subset as issues. A whole-source
    ambiguity keeps **Start import** unavailable with the reason and the open question.

### 4.4 Start (BU-P03)

The scope review shows group, source, known scope and unresolved items that will become issues, plus:
"This creates drafts where the applicant and service are clear. It does not submit applications."
**Start import** sends Start import with a new operation identity. ACC opens BU-P04 with the attempt
reference. UNR shows "We are checking the original import result. Starting again could repeat work." and
**Check status**. No second Start appears while UNR.

### 4.5 Progress and leaving the page (BU-P04; BU §5; BU-13)

1. The page shows source label, group, attempt reference, started time and one presentation stage:
   Reading source, Processing documents, Preparing drafts, Results available. Stages are not states.
2. Counts show with units (section 4.2). A progress bar is determinate only with a known stable
   denominator. No time estimate. No percentage. No "all safe" badge.
3. **View available results** appears when results exist. The processing banner stays visible.
4. Workbook transfer belongs to BU-P02 (CMP-36 there): "Keep this page open while the workbook uploads."
   Read source creates a listed attempt in state "Source read; not started"; BU-P09 and TA-05 list it and
   the mapping answers persist with it (RF-17). After Start import is accepted (ACC), BU-P04 shows "You can
   leave this page and return from Group → Imports." The page MUST NOT say this before ACC.
5. Leaving after ACC does not cancel work. No **Cancel import** control exists.
6. Return later: BU-P09 and TA-05 list the attempt; **Open import** restores the saved view where
   available.
7. Completion: a non-interruptive **Results available** banner. Focus, selection, scroll position and
   unsent input stay unchanged. Focus moves to results only when the TA opens them.
8. Systematic mapping fault: a banner names the interpretation and scope. **Review mapping** opens the
   question. Affected rows show Paused. Accepted results stay. Unaffected work continues.
9. Source changed after start: the attempt keeps its snapshot. Changed material uses a linked
   correction (section 4.7). No live synchronization.

### 4.6 Results and issue resolution (BU-P05, BU-P06; BU §6; BU-09)

1. Summary line: rows examined with Fully, Partially and Failed counts; separately, applications created;
   separately, file classification. Folder-only shows files examined, candidates and drafts.
2. Views: **Needs your action** (default when TA items exist), **Applications** (default otherwise, with
   **Review applications**), **All source results**, **All issues** (other owners with owner and next
   step), **History**.
3. An empty personal view shows "Nothing needs your action in this view. [Owner] is handling [scope]." if
   other work exists (BU-24). It MUST NOT say the import is issue-free.
4. **All source results** accounts for accepted, partial, failed, excluded, unresolved and not-yet-processed
   scope. For BU-09 (100 rows: 80/15/5) every one of the 100 rows is listed with its result.
5. Filters: reason, processing outcome, service, next owner. Search: row, applicant, application,
   filename. Source references stay visible.
6. Order: scope-wide interpretation problems, then identity and document conflicts, then routine missing
   information. Source order within a reason group.
7. Page size 50 (options 25, 50, 100). Pagination, sorting and live count changes MUST NOT lose the
   place or reorder rows under the pointer. A resolved item stays in place and shows resolved.
8. A source row expands into its service applications. Each application shows its own intake result,
   current status and next action. No combined readiness.
9. BU-P06 shows: group, service/application if established, source locator, issue title; reason and
   affected action; source value or document beside the proposed or current value; association
   evidence, contradiction and unknowns; owner, required evidence, one primary action; outcome and
   **Next issue** with the original filter.
10. Document view: resizable, page navigation, zoom, source location. Extracted text shows apart from the
    original. Without a precise highlight the page shows the page or file locator only.
11. Resolution actions are only: **Replace document**, **Choose service**, **Correct source mapping**,
    **Review proposed change**, **Report a problem**, **Request help**, **Abandon this intake issue**.
    The pages MUST NOT offer Accept anyway, Ignore all warnings, Merge people or Mark verified.
12. Issue language follows BU §6.4: positive association, insufficient evidence ("We cannot yet establish
    which applicant this belongs to."), conflict, unreadable, missing mandatory, optional conflict,
    same-name or identifier disagreement, suspected duplicate, unrelated file, supporting document for
    another person, unsupported or oversized.
13. Grouped issues show reason, count (unit: issues) and examples. A shared correction applies once only
    when its meaning is shared (for example one service column). Identity matches are never bulk
    accepted.

### 4.7 Correction entry, change preview, apply and conflict (BU-P07; BU §7.1–7.3; BS B16, B19; BU-15 to BU-19)

1. **Correct this import** opens from the original attempt with its context. Options: **Provide revised
   source** and **Open affected application/item**. Successful documents need no re-upload.
2. A revised Sheet or folder is read explicitly (Read revised source). A revised Excel is chosen again.
   Row number or filename alone never proves identity.
3. The preview classifies scope into six categories:

| Category | The page shows | Effect |
|---|---|---|
| Matched and changed | Application and service, before/after fields and document versions, evidence, permission | Selected by default; eligible changes only |
| Matched and unchanged | Count (applications) and expandable list | No change |
| Omitted from revised source | Count and list, labelled "Not included; left unchanged" | No deletion, cancellation or change |
| New applicant or service | Source item and why it is new | Routed to separate new intake (BU-16) |
| Match unresolved or duplicate | Evidence and the ambiguity | Owned issue; no update |
| Current application changed or edit unavailable | Newer facts or role boundary and next owner | No overwrite; review or Report a problem (BU-22) |

4. The preview names the exact service application for each change. A sibling application of the same
   person stays unchanged unless independently selected (BU-19).
5. Copy for BU-15: "15 applications will change; 85 will remain unchanged." The final action label is
   **Apply corrections to 15 applications**.
6. Apply is all-or-nothing per application. The receipt lists each application as applied, conflict, or
   edit unavailable (BU-18). Failure of one application MUST NOT undo another accepted application.
7. Conflict (BU-17): "This application changed after your review." The page shows current values beside
   the unsent proposal. **Review current version** returns to comparison. No overwrite option exists.
8. Identity-sensitive fields need same-person evidence (BS B19). The import supplies no override.

### 4.8 Nth identical retry and lost acknowledgement (BU-P04, BU-P08; BU §5.2, §7.3; BS B16, B35; BU-14)

1. Lost acknowledgement on Start import or Apply corrections: the page shows "Checking the original
   import result" with **Check status**. It keeps the operation identity (Recent operations read model
   after a refresh).
2. **Check result** reconciles the same operation. It shows the accepted effects.
3. **Retry eligible failures** is a different action. The page first shows the exact eligible scope.
   The command has its own operation identity, linked to the original attempt. Each item effect is keyed
   on (attempt, source row or file). A retry of the retry returns its own result and creates no duplicate
   (K-BATCH; RF-01).
4. The Nth identical retry returns accepted effects plus eligible remaining failures. It creates no new
   application and applies no old proposal over newer facts.
5. Changed source content is not a retry. Changed existing scope goes to a correction. New people or
   services go to new intake.
6. The page MUST NOT offer "Import again" while the original result is unresolved.

### 4.9 Attempt history and abandonment (BU-P08; BU §7.4; BU-20, BU-26)

1. History lists the original import, then each linked correction with actor, time, source label,
   outcome and affected scope.
2. Two views: **Original results** and **Current application/issue state**. A later resolution
   references the original issue. The original record never changes.
3. **Abandon this intake issue** asks for scope and reason and states: "This stops work on this intake
   issue. It does not cancel or delete any existing application." The receipt lists surviving
   applications and duties.
4. SuperAdmin dismissal is a separate reasoned action on SA-02. Neither action deletes in bulk.

### 4.10 Handoff to application review and submit (BU-P10; BU §8; BS B17, B18; BU-21 to BU-23)

1. **Review applications** opens the Import review queue with filters: needs TA attention, ready for TA
   review under current controls, already submitted, awaiting someone else. Fully processed MUST NOT
   mean review-ready.
2. Each application shows the TA-08 content and correction links to the exact section.
3. **Submit this application** behaves as TA-08. ACC shows the receipt and **Review next application**.
   The queue position persists. **Back to import** returns to the last filter.
4. No **Submit all**, no group consent and no automatic submission after import.
5. **Request help** before an application exists keeps the issue in the SuperAdmin intake-issues queue
   (SA-02). On a draft it uses the normal help decision path. Status shows approved, declined or awaiting
   decision. No response time is promised.
6. A duplicate issue never merges or moves an application across groups or services.

## 5. Bulk components (BU §§4–9)

The rules of UI-PLAN.md section 8 apply.

| ID | Component | Required states | Data it needs | Accessibility |
|---|---|---|---|---|
| CMP-30 | Source setup form | Choice empty; Sheet; Excel; Folder; with related source; field error | Source type, URL or file, worksheet list, configured limits | Radio group with legend; errors beside the field. |
| CMP-31 | Interpretation summary | Counting; understood; questions pending; whole-source blocked | Worksheet or folder, counts or "Counting…", interpreted fields, unused columns | "View mapping" is a disclosure; mapping table has headers. |
| CMP-32 | Consequential question card | Open; answered; affects subset; affects whole source | Source heading, representative values, proposed meaning, affected scope, question, permitted answers | Fieldset with the question as legend. |
| CMP-33 | Service scope confirmation | Explicit services present; default for subset; folder-only count unknown | Affected rows or candidates, services, excluded items, resulting application count or "not yet known" | Count and unit in text. |
| CMP-34 | Import scope review | Ready to start; blocked with reason | Group, source, known scope, unresolved items | Statement "This creates drafts… It does not submit applications." precedes the button. |
| CMP-35 | Progress strip with units | Reading source; processing documents; preparing drafts; results available; paused | Stage, counts by unit, stable denominator if known | Determinate bar only with a stable denominator; milestones announced, not ticks. |
| CMP-36 | Transfer-state banner | Transfer in progress; not accepted; accepted and processing | Transfer and acceptance facts | Polite announcement on change. |
| CMP-37 | Counts strip | Settled; processing; unavailable | Row outcomes, file outcomes, application effects; each with unit | Each count a labelled text item; no cross-unit sums. |
| CMP-38 | Exceptions-first results table | Needs your action; Applications; All source results; All issues; empty personal view with others' work | Rows with locator, applicant, service, result, next action, owner | Stable order while resolving; page size 25/50/100, default 50. |
| CMP-39 | Source row / file evidence row | Fully processed; partly processed; failed; excluded; pending; paused; expanded to applications | Source locator, resulting applications, per-service outcome, file version | Expand control labelled with row reference. |
| CMP-40 | Issue detail panel | Open; owned by other; resolved; evidence unavailable | Six blocks of BU §6.3 | Logical order evidence → form → action. |
| CMP-41 | Reason group | Collapsed; expanded | Reason, count with unit, examples | Heading per group. |
| CMP-42 | Next issue control | Available; none left in view; work elsewhere | Next item in current filter | Keyboard reachable; focus moves to the next issue heading only on activation. |
| CMP-43 | Change preview | Categories of BU §7.2; nothing eligible | Per category items, before/after, evidence, permission | Each category a heading with count and unit. |
| CMP-44 | Correction receipt | Applied; conflict; not accepted; unresolved | Per application result, source reference | Announced; table of results. |
| CMP-45 | Attempt history timeline | Original; corrections; current state view | Actor, time, source label, outcome, affected scope | Ordered list; view switch labelled. |
| CMP-46 | Abandon intake issue dialog | Scope and reason entry; confirm | Issue scope, surviving applications and duties | Text "This stops work on this intake issue. It does not cancel or delete any existing application." |
| CMP-47 | Result check controls | "Check result"; "Retry eligible failures" with exact scope | Original operation result, eligible failure scope | Two distinct buttons with distinct help text. |

## 6. Bulk acceptance mapping

Coverage: **Full** means this contract defines every behavior the scenario observes. **Partly** means a
boundary or an outside validation stops part of the observable result. **Not** means no behavior is
defined. Priority follows D6.

In the Behavior column, plain section numbers are sections of this document. "UI-PLAN n" is section n of UI-PLAN.md.

### 6.1 Bulk scenarios (BU §11)

| ID | Pages | Behavior (contract section) | Observable result | Pri | Coverage |
|---|---|---|---|---|---|
| BU-01 | BU-P02, BU-P03 | Clear mapping, Source understood, View mapping (4.3) | Start without renaming columns or approving rows; mapping inspectable | P0 | Full |
| BU-02 | BU-P03 | Decision list with examples and scope; separable work proceeds (4.3) | No silent choice between two passport columns | P1 | Full |
| BU-03 | BU-P03 | Worksheet/header choice; notes excluded; no silent combine (4.3, 4.2) | Intended table clear before import | P1 | Full |
| BU-04 | BU-P03, BU-P05, BU-P10 | One row, several services; separate applications (4.3, 4.6) | Two applications with own quote, consent, submission | P0 | Full |
| BU-05 | BU-P03 | Consistent multirow accepted; mixed pattern asked (4.3) | No guessed pattern | P1 | Full |
| BU-06 | BU-P02, BU-P05, BU-P06 | Folder-only candidates; Files needing attention (4.1, 4.6) | Drafts for clear candidates; unresolved files discoverable | P1 | Full |
| BU-07 | BU-P05, BU-P06 | Paths as locators only (4.6) | No naming scheme imposed; no identity from folder name | P1 | Full |
| BU-08 | BU-P06 | Conflict vs insufficient evidence; same-name rule (4.6) | No name-only match; no duplicate from repeated reference | P1 | Full |
| BU-09 | BU-P05 | Row partition and units (4.2, 4.6) | 80/15/5 with units; all 100 accounted; failed not shown as draft | P0 | Full |
| BU-10 | BU-P06, BU-P10 | Missing mandatory and optional conflict both visible (4.6); no universal gate (TA-08) | Both visible; no substitution | P1 | Full |
| BU-11 | BU-P02, BU-P06 | Per-file reasons; workbook limit from configuration (4.1) | Each file own reason; no 5 MB workbook limit | P1 | Full |
| BU-12 | BU-P04, BU-P05 | Systematic fault banner; Paused scope (4.5) | Accepted results stay; affected scope paused | P1 | Full |
| BU-13 | BU-P04, BU-P09 | Transfer vs accepted start copy (4.5) | Correct message per case; attempt reachable from Imports | P0 | Full |
| BU-14 | BU-P04, BU-P08 | Check result vs Retry eligible failures; K-BATCH (4.8, UI-PLAN 7) | No duplicate; accepted effects shown | P0 | Full |
| BU-15 | BU-P07, BU-P08 | Preview categories; 15 change, 85 unchanged (4.7) | Exact changes; history readable | P0 | Full |
| BU-16 | BU-P07 | New applicant/service category (4.7) | Routed to separate intake | P1 | Full |
| BU-17 | BU-P07 | Changed since your review (4.7) | Comparison; no overwrite; other receipts kept | P1 | Full |
| BU-18 | BU-P07, BU-P08 | All-or-nothing per application (4.7) | No half-applied correction | P1 | Full |
| BU-19 | BU-P07 | Exact service application targeted (4.7) | Sibling unchanged | P1 | Full |
| BU-20 | BU-P06, SA-02 | Abandon and dismiss (4.9, SA-02) | No application cancelled | P1 | Full |
| BU-21 | BU-P06, TA-07, SA-02 | Help before and after application exists (4.10) | Owned intake work; normal help path | P1 | Full |
| BU-22 | BU-P07, TA-07 | Edit unavailable category; Report a problem (4.7) | Operator and formal return identified | P1 | Full |
| BU-23 | BU-P10 | Per-application submit; queue persists (4.10) | Receipt; next application; no automation | P0 | Full |
| BU-24 | BU-P05 | Empty personal view copy (4.6) | Other owner's work disclosed; truthful counts | P1 | Full |
| BU-25 | BU-P05, BU-P06 | Keyboard, focus, stable order, locator fallback (4.6, 4.5) | Core tasks usable | P1 | Partly: visual layout and rendered accessibility evaluation sit outside this contract |
| BU-26 | BU-P08 | Original vs current views (4.9) | History original; correction linked | P1 | Full |
| BU-27 | BU-P01, BU-P02, TA-03 | Offering boundary notice (UI-PLAN 5.2, 4.1) | Constraint and owner shown; accepted work kept | P1 | Full |

### 6.2 UX acceptance criteria that cite BU

- AC-15
- AC-16
- AC-17
- AC-18
- AC-19
- AC-20
- AC-21
- AC-22
- AC-23
- AC-25
- AC-27

The text of each criterion is in UI-PLAN.md section 10.
