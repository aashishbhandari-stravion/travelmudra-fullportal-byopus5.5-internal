# UAT pass 1 triage: rewrite acceptance additions, post-rewrite fix items, owner decisions

Date: 12 October 2026. Author: Principal Technical Architect (Fable 5.1, parent chat). Source:
`2026-10-12-max-uat-findings.md` (commit becd276), 13 findings UAT-01 to UAT-13 from Max's UAT pass 1 on
`preview` (build `m6-final-assurance`, 7be21b1). Test plan and automation decisions:
`2026-10-12-uat-pass1-test-plan.md` (Part D sequences, Part E.8 decisions).

## 0. Status and rules

- Max's decision of 12 October 2026: fix nothing now. Every finding goes into the work after the UI
  rewrite. UAT-12 (P0) is parked by owner decision.
- This record is triage. It gives the implementer the evidence, the constraints Max set, and the
  architect's initial analysis. It does not prescribe a fix. The implementer of the holistic refactor
  (Opus 5.5) decides how each item is fixed and reports the material choices. A `MUST` in this record is
  Max's constraint or a plan rule; everything else is input.
- No product code changes and no deployment until Max authorizes the post-rewrite work.
- `preview` holds real passports. Nobody opens documents, blobs or extracted values. People are "User 01"
  to "User 11". Google Drive and Sheet links never appear in files, commits or chat. Screenshots stay
  under `~/.local/share/travelmudra-uat/evidence/2026-10-12-uat-pass1/screenshots/` (local only).
- Plan identifiers (PUB-nn, TA-nn, BU-Pnn, CMP-nn) refer to `../design/ui-plan-from-specs-2026-10-10/`
  (`UI-PLAN.md`, `BULK-UPLOAD-UI-PLAN.md`). The plan is a reference, not the target (DECISIONS
  2026-10-10); the acceptance criteria below bind the rewrite, the plan text does not.

## 1. Rewrite acceptance additions (class C: UAT-01, 02, 05, 06, 10, 11)

Each criterion is added to the acceptance list of the UI rewrite. "Plan gap" means the plan has no
page, component or state for the criterion; the rewrite plan MUST be extended before the page is built.

| Finding | Page or component | Acceptance criterion (added) | Plan status |
|---|---|---|---|
| UAT-01 Back from code page gives "form already used" | PUB-02 Sign-in (email step); CMP-07 error summary | After the browser Back button returns to the email step, the TA can correct the address and send a new code without a manual reload. If the server refuses a reused operation key (`conflict_operation_key`), the error text MUST offer a fresh form in one action ("Start again" link or an automatic fresh form). The refusal itself is correct and stays. | **Plan gap.** PUB-02 states do not cover a stale form restored from the browser cache. Add the state "form already used" with its recovery. |
| UAT-02 Code page has no "use a different address" option | PUB-02 Sign-in (code step); CMP-27 OTP code field | The code step names the address the code went to (masked if the plan's disclosure rules require it). The code step offers "Use a different address", distinct from "Request a new code". | **Plan gap.** PUB-02 lists "Request a new code" only. Add the address line and the change-address action. Keep the no-account-disclosure rule: the line names the address the user typed, not an account fact. |
| UAT-05 Public pages need more useful content and a better layout | PUB-01 Public entry page (and the other public pages) | PUB-01 shows the planned blocks: value statement, what the service does, who it serves and excluded visa types, static country and scope information, process explanation, sign-in entry, verified business and contact details. Search readiness per WEB-20260926-01: unique title and description per page, canonical URL, sitemap and robots, structured data with verified locality, crawl check in the verification record. Content is approved static content only (BS B01, B02); no candidate countries. | Covered by PUB-01. Content (C02 locality, C03 country list) is an owner input; the page omits a block whose input is missing. Max: this item MAY run in parallel with other work. |
| UAT-06 Bulk import form shows every field for every source type | BU-P02 Import source setup; CMP-30 Source setup form | Only the inputs of the chosen source type show. Each required input is marked required; no input of the chosen type is marked "(optional)" when the server requires it. The Services block shows only where the type needs it (folder without a sheet needs at least one service). An input that does not belong to the chosen type (for example a file with a folder choice) is refused with a field error, not ignored silently. The refusal is an edge form rule; the Core is not involved. | Covered by CMP-30 (per-choice states, errors beside the field). The silent-ignore refusal is an addition to BU-P02's C1–C4 states. |
| UAT-10 Bulk import progress does not refresh and has no progress bar | BU-P04 Import progress; CMP-35 Progress strip; CMP-12 Freshness indicator | While an attempt is in a running stage, the page refreshes itself at a configured interval (Max's expectation: about every minute; the interval is configuration, not a constant). The page shows a "Refresh" control and an "updated at" time (the plan's "Last updated" line). The page shows progress by stage (Reading source, Processing documents, Preparing drafts, Results available) with counts by unit. A determinate bar appears only with a stable denominator (plan 4.5 rule 2); otherwise the stage strip shows activity without a percentage. On completion the "Results available" banner appears without moving focus (plan 4.5 rule 7). | **Plan gap.** Plan 4.5 has the stage strip and the refresh line but no self-refresh. Add the self-refresh rule with its interval as configuration and the rule that a refresh never discards unsent input or focus. The implementer decides the mechanism (timed reload, fetch of the read model, or stream); the three-instance topology (edge reads Core by API only) applies. |
| UAT-11 No overview of a TA's imports across groups | BU-P09 Imports list (today: TA-05 tab, per group); TA-01 Home | A TA has one place that lists every running and finished import across groups, with state, group and progress, and opens each attempt (BU-P04). Candidate placements: a rail destination "Imports" (BU-P09 as a TA-wide page with a group filter) or a TA-01 Home panel "Imports in progress". | **Plan gap.** BU-P09 is scoped to one group (assumption A-11). A TA-wide list needs a read model "TA imports across groups". If the Core has no such projection, it is a Kind 1 change (new projection of existing facts; DECISIONS 2026-10-10 §Core gates) and goes through that gate; the surface inventory is the first check. |

Derived from UAT-08 (class A, see §2), one acceptance addition for PUB-02: when a sign-in form's bot-check
challenge has expired (challenge lifetime `captcha.ttlMs`, 5 minutes), the message MUST say that the page
needs a reload and MUST NOT read as a generic failure. Today's text "The verification did not pass. Try
again." does not say why. Plan gap: PUB-02 has "CAPTCHA or provider unavailable" but no "challenge
expired" state.

## 2. Post-rewrite fix items (class A: UAT-12, UAT-13, UAT-08)

These survive the UI rewrite. They are fixed after the rewrite lands, by the implementer of the holistic
refactor, who chooses the design. Each item gives the evidence, Max's constraints, the class of failure to
fix (not the reported case only), and the test that proves it. Ownership: all three items sit in the bulk
intake module and its workers, so they belong with the bulk refactor, not in a separate task chat, unless
Max rules otherwise (§3, Q-5).

### UAT-12 Every Google Drive folder import fails (P0, parked by owner decision)

Evidence (verified on `preview`, 12 October 2026, by code and log reading; no document was opened):

- The URL builder `src/modules/intake/domain/url.ts` turns a folder link into the embedded folder view
  (`embeddedfolderview?id=...`, kind `html_listing`). The fetch succeeds; the folder is public; the stored
  listing is about 9 KB and holds 88 `flip-entry` elements.
- The parser `src/workers/listing.ts` reads only the full Drive page format (the
  `window['_DRIVE_ivd']` literal). The embedded view does not contain it, so the parser refuses with
  `listing_unreadable` (edge log: `parse.read_folder_listing refused`).
- The tests use fake workers (`test/intake/fake-workers.ts`) and a fixture of the full-page format, so the
  mismatch was never exercised. Both folder source types (public folder; public folder with sheet) are
  blocked. The attempt ends in "Not started" with "The source could not be used".

Class of failure: two modules hold the same format assumption independently, and no test runs the real
parser on the real page that the real URL builder requests.

Max's constraints (MUST):

- The URL builder and the parser MUST use one format. Which format is the implementer's choice, stated
  with its reason (candidates: keep the embedded view and parse its entries; or request the full page and
  keep the current parser). The reason SHOULD cover entry count per page and pagination, which fields each
  format exposes (id, name, type, size), page size in bytes, and stability of the format.
- The test fixture MUST be captured from a real public folder page that holds only synthetic content. No
  fixture from Max's real folders (the E-3 folders hold real documents and MUST NOT be used). A synthetic
  public folder is needed; see §3, Q-6.

Test that proves the fix: an integration test through the real `listing` worker (not the fake worker) on
the captured fixture, asserting the entry count, the id and name of a known entry, and the `truncated`
behaviour at the configured entry limit. A second test binds the URL builder's output kind to the parser,
so a future change to one side fails the test. Acceptance on an installation: E2E-4 B steps 4.13 to 4.18
with a synthetic folder.

### UAT-13 Failed import says "See the reference code" but shows none (P1)

Evidence: `src/apps/shared/pages/intake.ts` maps known reason codes to text and returns "See the reference
code." for a code without text; the attempt page renders the text only. `listing_unreadable` has no text,
so the TA sees the fallback sentence and no code.

Class of failure: a fallback that refers to information the page does not show. Any reason code without a
text entry produces this.

Input for the implementer: the page MUST show the reference code itself whenever the text is a fallback,
and SHOULD show it beside the text in every case, so support can triage. Worker reason codes used by the
intake (`listing_unreadable` and its siblings in `src/kernel/vocabulary/reasons.ts`) SHOULD get plain
text. BU-P04 is rewritten by the UI lane; the text catalogue and the fallback rule live in the shared edge
pages. The two lanes MUST agree who owns this (seam contract).

Test that proves the fix: a page test with an unknown reason code asserts that the code appears in the
page; a test for `listing_unreadable` asserts its plain text.

### UAT-08 Bulk import refused: "The verification did not pass" (P1; owner decision recorded, §4)

Evidence: the bulk import form carries a bot-check challenge (`src/platform/captcha.ts`, purpose
`bulk_intake`) that is created on page load, lives `captcha.ttlMs` (5 minutes) and is bound to the
session. A form submitted later than that, or after a new sign-in, fails with `bot_check_failed` and the
text "The verification did not pass. Try again." The edge and core logs hold no line for the refusal. Max
confirmed the cause: the retry within 5 minutes passed.

Max's decision (§4): no bot check on the bulk import form; the TA is already signed in. The bot check stays,
with its 5-minute challenge, on the sign-in pages.

Input for the implementer: remove the challenge from the bulk import form and its route
(`src/apps/edge/intake/routes.ts`); keep purpose `ta_otp`. The purpose `correction_upload` (the
correction form, also a signed-in TA form of the same design) is not covered by the decision; see §3,
Q-4. A refused bot check SHOULD leave a log line with the refusal reason (expired, binding mismatch,
invalid), so support can triage.

Test that proves the fix: a bulk import form submitted more than `captcha.ttlMs` after page load is
accepted; a sign-in form in the same condition is refused with the "challenge expired" text (§1, PUB-02
addition). Acceptance on an installation: E2E-4 4.13 with a form left open for more than 5 minutes.

## 3. Open owner decisions for Max

| ID | Finding | Question | Options | Architect's initial view |
|---|---|---|---|---|
| Q-1 | UAT-03 Synthetic mailbox sign-in is slow for human testers (P1, class D) | How do human testers sign in on test installations? | (a) Real email delivery on test installations (needs a mail provider and a mailbox per synthetic account). (b) A fixed test sign-in code, enabled only by installation configuration and refused in production (CMP-23 environment label present). (c) Keep the mailbox helper `signin-codes.mjs`. | (b) for manual testing, with the configuration flag refused on a production installation type and shown in the environment label. (c) stays for agents. The E2E suite reads the mailbox itself (Part E.4) and does not need (b). This is a product behaviour: owner decision. |
| Q-2 | UAT-04 TA cannot start a single application outside a group (P2, class B) | Is a single application outside a group needed? | (a) Not needed; the group of one is the path. (b) A "New application" entry that asks country and travel dates and creates a group of one behind the scenes (view change only). (c) A domain change: applications without a group. | Max's ruling: P2, decide later. (b) if needed; (c) is a Kind 2 change and is not recommended. |
| Q-3 | UAT-07 Services are chosen per import, not fixed at group creation (P1, class B) | Where are services chosen: at group creation, or per import and per applicant? | (a) Keep today's rule: each import and each single applicant names its services; a sheet may name services per row. (b) Max's expectation: services fixed at group creation; a different service for the same people goes into a new group. (c) A set of allowed services per group, chosen at group creation (TA-13); each import and applicant chooses within that set; a row outside the set is an intake issue. | (c), as recommended in chat on 12 October 2026. It gives Max the group-level control without losing per-row services (BU-04: one row, several services). It changes the group model and the intake rules: Kind 2 (one-way door). A written proposal, independent review and Max's decision are required before any build. |
| Q-4 | UAT-08 (decision recorded in §4) | Does the decision also remove the bot check from the correction upload form (purpose `correction_upload`), which is a signed-in TA form of the same design? | (a) Yes, same reason. (b) No, keep it there. | (a). The reason given for the bulk form (the TA is already signed in) applies equally. |
| Q-5 | UAT-12, UAT-13, UAT-08 ownership | Are the three class A items worked inside the bulk refactor lane, or in a separate post-rewrite task chat? | (a) Inside the bulk refactor (the code is the intake module and its workers). (b) Separate task chat after the rewrite. | (a). One writer per tree; the same files are refactored. |
| Q-6 | UAT-12 fixture | Who creates the synthetic public Google Drive folder (and, for E2E, the synthetic sheet) for the parser fixture and the `@external` tests? The folder holds only synthetic documents; its link stays in the local untracked file of E-3. | (a) Max creates it beside the E-3 sources. (b) The implementer asks Max for it when the fix starts. | (a), now, so the fixture exists before the bulk lane starts. |
| Q-7 | UAT-09 Single applicant form refuses the passport number (P1, class D) | Does the Indian passport on User nn show one letter and 7 digits (today's rule in `fields.ts`), or 2 letters and 6 digits (the value entered)? | Max checks the document. | If the document shows 2 letters and 6 digits, the rule is wrong: class A, P0 for Indian passports, and the fix goes to the bulk refactor with a test on the documented format. In both cases the message MUST state the expected format: class C, TA-09 acceptance addition. |

### 3.1 Max's answers (12 October 2026, late)

| ID | Decision |
|---|---|
| Q-1 | Test emails (the synthetic mailbox and helper) are fine for now. UAT-03 is P2. Out of both prompts. |
| Q-2 | P2. Out of both prompts. |
| Q-3 | **Yes**: a set of allowed services per group, chosen at group creation; each import and applicant chooses within the set. This is Max's decision on the direction of a Kind 2 change. The bulk refactor lane writes the Kind 2 proposal (DECISIONS 2026-10-10 §3.2 items 1 and 2) and obtains the independent review before the change is built; Max's yes here settles the direction, the proposal settles the shape. |
| Q-4 | Yes: the bot check is removed from the correction upload form as well (purpose `correction_upload`). Sign-in pages keep it. |
| Q-5 | Yes: UAT-08, UAT-09, UAT-12 and UAT-13 are worked inside the bulk refactor lane. |
| Q-6 | Max provided a public Drive folder and a public Sheet (12 October 2026). The links are in the local untracked file `~/.local/share/travelmudra-uat/external-sources.local.json` (mode 600, outside every repository). Max maintains the data security of these sources himself; the system does not. Constraint that stays: a fixture captured from the folder listing is committed to the public repository, so the implementer MUST check the captured file names for personal data and replace any such name in the fixture before committing (structure preserved). |
| Q-7 | Max: two letters and six digits is a valid Indian passport number format, taken from a production passport. The rule in `fields.ts` (one letter and seven digits for IND) is wrong. **UAT-09 is class A, P0**, worked in the bulk refactor lane. The implementer MUST validate against the documented Indian passport number formats (both shapes at least), with a test per accepted shape, and the message MUST state the expected format. |

New finding from the same answers: **UAT-14** (passport is exactly two pages, front and back; one file with
both pages or two files, one per page; the current implementation is confusing and misleading). Recorded in
the findings file. Requirement for the bulk refactor lane (document policy and completeness per applicant)
and an acceptance addition for TA-09, BU-P02 and BU-P06 (the form states the rule and the two accepted
shapes).

## 4. Recorded owner decision (UAT-08)

Max, 12 October 2026: remove the bot check from the bulk import form; keep it, with its 5-minute
challenge, on the sign-in pages. Implement after the rewrite (§2). Q-4 asks whether the correction upload
form follows.

## 5. Coverage left by pass 1

Executed: E2E-1 (in part; 1.9 to 1.14 partly), E2E-2 up to 2.3, E2E-4 B up to 4.13. Not executed: E2E-2
after 2.3, E2E-3, E2E-4 A and C, E2E-5. Pass 1 covered the TA role only (application creation took most of
the time). The operator and SuperAdmin pages have no manual findings; the five Part D sequences stay the
reference specification for the UI-based automation suite, which is written after the rewrite (E-5).

## 6. Summary

| Bucket | Items |
|---|---|
| Rewrite acceptance additions (class C) | UAT-01, 02, 05, 06, 10, 11, plus the PUB-02 "challenge expired" text derived from UAT-08. Plan gaps: UAT-01, 02, 10, 11 and the derived PUB-02 state. |
| Post-rewrite fix items (class A) | UAT-12 (P0, parked), UAT-09 (P0, after Q-7), UAT-13 (P1), UAT-08 (P1, decision recorded). Owner: the bulk refactor lane (Q-5, decided). |
| Owner decisions | Q-1 to Q-7 answered by Max (§3.1). Requirements that follow: UAT-07 services per group (Kind 2 proposal in the bulk lane), UAT-14 passport pages. |
