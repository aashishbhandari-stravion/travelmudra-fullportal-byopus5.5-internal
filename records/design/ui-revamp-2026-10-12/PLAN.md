# UI revamp lane plan (`ui-revamp-2026-10-12`)

Owner: the Principal Technical Architect of the lane (Opus 5.5 lane chat). Authority:
`../execution-2026-10-12/UI-REVAMP-PROMPT.md` (the prompt). Orchestrator: the parent chat that wrote the prompt.
Max decides, integrates and pushes. Started 12 October 2026. Writing style: ASD-STE100 at about 75%.

This file holds the team, the work packages and their order, the decisions of the lane (dated) and the plan
additions. One record per work package is `WP-nn.md` in this folder. Proposals sent outside the lane are
indexed in `PROPOSALS.md`.

## 1. Inputs read (prompt §3), 12 October 2026

| Input | Identity | Read |
|---|---|---|
| `CLAUDE.md`, `docs/agent-guide.md` (lane repository) | product base 102e4c9 | In full |
| `START-HERE.md` (lane folder) | lane folder | In full |
| `TARGET_PRODUCT_UX_SPEC.md` | SHA-256 b45186887cdc37f6… (checked) | In full |
| `BULK_UPLOAD_PRODUCT_UX_SPEC.md` | SHA-256 c2686f12552be10f… (checked) | In full |
| `BUILD_SPEC.md` (r2) | SHA-256 4a6fd90657b0723f… (checked) | In full |
| `DECISIONS-2026-10-10.md`, `UI-PLAN.md`, `BULK-UPLOAD-UI-PLAN.md`, `SURFACE-INVENTORY-2026-10-10.md` | internal 1b3b5bd | In full (UI-PLAN §1 to §13; bulk plan §1 to §6) |
| `uat/2026-10-12-uat-pass1-triage.md` §1, §3.1 | internal 1b3b5bd | In full (also §0, §4) |
| `execution-2026-10-12/SEAM-CONTRACT.md` | version 1 | In full |

Not loaded (prompt §3, load on need): the UAT findings file (read only UAT-01, UAT-02, UAT-14 entries for the plan
additions), the test plan Part D, the 8 October handover diary, `FINAL-REPORT.md` §6, the 8 October independent
review. `GOKU-REVIEW-PROMPT.md` is withdrawn and is not loaded.

## 2. Team

| Role | Runtime | Scope | Rule |
|---|---|---|---|
| Principal Technical Architect | Opus 5.5, this chat | Scope, decisions, file ownership, integration into the lane branch, commits, records, proposals | Keeps small understood work. Never reviews own code as the independent reviewer. |
| Principal Software Engineer(s) | Claude Opus subagents | One work package or one page group each, with tests | Writes only the files the architect assigns. Never commits. |
| Principal UX Engineer | Claude Opus subagent, continued across packages for continuity | Shell conformance, page anatomy and states, components, tokens, accessibility | Reviews each page group against the UX specification before and after implementation. Writes no product code. |
| Principal Product Manager | Claude subagent (Sonnet for checklists; Opus for acceptance runs) | Acceptance checklist per package in the user's words; verification on `lane-ui`; triage of Max's reports | Writes checklists and results into the package record draft; never product code. |
| Independent reviewer | Codex CLI, model gpt-6.1-sol (different model family), read-only sandbox, fresh context per review | Design review before code; code review before integration | Never the implementer. Findings ranked P0/P1/P2 with a concrete scenario (PRI-20260930-01). |

Effort: Max asked on 12 October 2026 to start with extra high effort. The start phase (WP-01 design, reviews and
implementation) runs at extra high effort. Later packages keep it unless Max says otherwise.

## 3. Work packages and order

Order of the prompt §4: WP-01, WP-20, WP-02, WP-03, WP-06, WP-07, WP-08; then WP-09 to WP-17 and WP-19; then WP-04,
WP-05, WP-18 (bulk) last; WP-21 only with the evidence that `UI-PLAN.md` §12.3 requires.

| WP | Pages (UI-PLAN §12) | Lane additions | Status |
|---|---|---|---|
| WP-01 | SH-01, SH-02, PUB-02, OP-10 (sign-in and MFA only) | PUB-02-S8, S9, S10 (UI-PLAN §14.1); command-result patterns used by every later package | Design |
| WP-20 | PUB-01 and the other public pages | UAT-05; WEB-20260926-01 search readiness | Not started |
| WP-02 | SA-05 (publish, launch), SA-06 (create, status), TA-02, TA-03 | | Not started |
| WP-03 | TA-01, TA-04, TA-05, TA-06, TA-07 (submit path, help), TA-08, TA-09, TA-13 | TA-09-R1, TA-09-R2 (UI-PLAN §14.2) | Not started |
| WP-06 | SA-01, SA-02, SA-03, SA-07 (service payment), SA-09 (Gate 1) | | Not started |
| WP-07 | OP-01, OP-02, OP-03, OP-04, SA-07 (Gate 2, ceiling), SA-09 (Gate 2) | | Not started |
| WP-08 | OP-05, OP-06, OP-07, TA-07 (outcome, delivery, retrieval), TA-10 | | Not started |
| WP-09 to WP-17, WP-19 | UI-PLAN §12.2 | | Not started |
| WP-04, WP-05, WP-18 | BU-P01 to BU-P10, SA-02 intake | UAT-06, UAT-10, UAT-11, UAT-14 (BULK §7) | Not started; MUST NOT start before the non-bulk P0 packages are integrated |
| WP-21 | Optional presentation | | Only with evidence |

Recorded reorder (prompt §4 permits it inside P0 with a reason): the WP-20 design phase MAY run while WP-01 is
implemented. Reason: Max allowed UAT-05 to run in parallel (triage §1), and the public pages share no page file
with WP-01. WP-20 implementation waits for the WP-01 token decision (LD-09), because both packages touch the
shared style sheets.

Each package follows the same steps:

1. Product Manager: acceptance checklist in the user's words (spec, plan, UAT additions, AC-01 to AC-28 that apply).
2. UX Engineer: design review before code (page anatomy and states against the specification; the Nth identical
   submission; what a failure leaves on the page; hostile but valid states).
3. Independent reviewer: review of the design before code. P0 findings are worked before code.
4. Software Engineer(s): implementation with tests, in assigned files only.
5. UX Engineer: review after implementation. Independent reviewer: code review before integration.
6. Architect: integration commit in the lane branch; deploy to `lane-ui` through `uat.py deploy`.
7. Product Manager: proof scenario and acceptance checklist on `lane-ui`, with an axe check on every page.
8. Architect: `WP-nn.md` record; report to the orchestrator (commits, proof result, ranked open findings,
   proposals).

## 4. Lane decisions

| ID | Date | Decision | Reason |
|---|---|---|---|
| LD-01 | 12 Oct 2026 | "The shell stays" (prompt §2) means: the shell architecture stays (the `appShell` and `signedInPage` wrappers, route registration, the security headers and CSP, the one first-party script, the CSS layer order). WP-01 conforms the shell to SH-01 (top bar, environment label and title prefix, context selector, breadcrumb and freshness line, announcement region, role navigation of UI-PLAN §2.2). Pages are rebuilt from the specification. | The prompt names the UX Engineer's duty "shell conformance". A rewrite of the shell is not authorized; a non-conforming shell would fail every page's comparison with the specification. |
| LD-02 | 12 Oct 2026 | Transition: new components are added beside the old ones. Old pages keep working until their package rebuilds them. At handover no old page remains: each route is rebuilt, or retired with Max's decision. Components with no consumer are deleted in the package that removes the last consumer. | The lane installation stays usable between packages, so Max can test each integrated package by hand. |
| LD-03 | 12 Oct 2026 | Addresses: an existing URL path stays when a rebuilt page serves the same purpose. A new page gets a new path. Rail labels follow UI-PLAN §2.2. | Bookmarks, the later automation suite and the route inventory test keep working; the specification names destinations, not paths. |
| LD-04 | 12 Oct 2026 | Send result (CMD-44) and Request completion (CMD-48) are boundaries in Core at 102e4c9. OP-06 and OP-07 show the boundary as Core reports it. The wording MUST NOT say that the product owner still has to choose the trigger (OD §2 and §3 decided it; DECISIONS §1.3). The exact wording is set at the WP-08 design review. | Inventory CMD-44 and CMD-48: building the commands is a Kind 2 change in its own lane, outside this lane. |
| LD-05 | 12 Oct 2026 | Release packet (CMD-40) and result download (CMD-18) are built as available actions under their existing preconditions. | DECISIONS §1.5 (OC-09 closed); the `B46 BOUNDARY` markers on these rows in UI-PLAN are wrong. |
| LD-06 | 12 Oct 2026 | Mark notice read (CMD-16) is not built. TA-10 and OP-10 show "Needs your acknowledgement" or "Acknowledged" from the notice facts. No page claims a read marker. | Inventory §4: a read marker is a Kind 2 change that the architect rejected ("the UI is easier this way"). |
| LD-07 | 12 Oct 2026 | Every served Core command gets a page in the rewrite, or goes to Max as a hide decision. The register is `COMMAND-COVERAGE.md` in this folder, kept per package. | Inventory §5: 53 served commands have no plan row; hiding a served command is a product decision. |
| LD-08 | 12 Oct 2026 | Freshness: an authoritative read shows "Read at [time] IST" (the instance stamps the read time). A projection shows its own as-of and health ("As of [time] IST" or "Freshness unavailable"; "Behind by [n] s" when the projection reports lag). No client-side age threshold. | Inventory §2.6; AD-10. |
| LD-09 | 12 Oct 2026 | Open until the WP-01 design review: design tokens and type. Architect's default: adopt the UX §7.2 values (paper, ink, muted text, teal for primary action, current location and selection; attention, error and external-wait colours), a deep-ink rail for every role, and a system sans family. The decision is recorded here after the review. | Material: it changes the look of every page. The product is compared against the specification (prompt §2); UX §7.2 calls its tokens "proposed", so the review weighs both. |
| LD-10 | 12 Oct 2026 | Independent reviewer: Codex CLI, model gpt-6.1-sol at high reasoning effort (Max, 12 October 2026), read-only sandbox, a fresh session per review. | Different model family (prompt §1, PAR-20260921-01 tenet 4). |
| LD-11 | 12 Oct 2026 | Agents sign in on `lane-ui` for proof scenarios through a lane-local Playwright harness. The harness imports the exported functions of the installation's `signin-codes.mjs` (synthetic mailbox, synthetic authenticator keys) and types the code into the browser. It MUST NOT print, log, screenshot or store a code or an authenticator key. Synthetic accounts only. Max approved this on 12 October 2026 (Q-L1, answered in the lane chat). The harness moves under `test/uat/` of the lane repository with the WP-01 commit (orchestrator's condition of 12 October 2026: it reads the synthetic mailbox the way test plan Part E.4 describes, never prints or logs a code, and lives under `test/`). | Prompt §5.5 restricts the helper's command line to `--list` and `--check`. A proof needs signed-in sessions. The UAT test plan (Part E.4) already plans an automation suite that reads the mailbox itself. |
| LD-13 | 12 Oct 2026 | Codex review budget (Max, 12 October 2026): one review per unique artifact, no back-and-forth in any turn, used with judgement; not every artifact needs one. Lane rule: per work package at most two Codex reviews — the design and acceptance set before code (P0 packages and packages with commands that change money, access, filing or delivery state), and the code diff before integration. Low-risk packages (read-only pages, copy, presentation) get the code review only. A fix of a Codex finding is not sent back to Codex; the architect or a Claude reviewer who did not implement the fix checks it against the finding's scenario, and the record says so. | Max's instruction; keeps the independent family check where risk is highest. |
| LD-12 | 12 Oct 2026 | Max's authorization in the lane chat, 12 October 2026: "complete the implementations and go ahead with your recommendations"; report at the end every decision that came up, what the architect decided and why. Effect: the architect decides open design questions (for example LD-09) on the recommendation of the review, records each one here, and continues without waiting. The stop conditions of the prompt §8 still apply (a Kind 2 command, a kernel change, a file of another owner, a specification conflict that two readings resolve differently, real data, a `uat.py` failure). The end summary for Max is section 7. | Max's instruction. |

## 5. Plan additions (prompt §4)

Added to the plan text in this internal clone on 12 October 2026, commit 5ab4626:

- `UI-PLAN.md` §14: PUB-02-S8 form already used (UAT-01), PUB-02-S9 code step names the address with "Use a
  different address" (UAT-02), PUB-02-S10 bot-check challenge expired (UAT-08 derived), TA-09-R1 passport two
  pages (UAT-14), TA-09-R2 passport number format message (UAT-09), and the binding of each addition to its package.
- `BULK-UPLOAD-UI-PLAN.md` §7: BU-P04 self-refresh (UAT-10), BU-P02 inputs per source type and BU-P02/BU-P06 passport
  rule (UAT-06, UAT-14), TA-wide imports list (UAT-11, seam request first).

## 6. Open items for Max

| ID | Item | Rank | Status |
|---|---|---|---|
| Q-L1 | LD-11 sign-in harness for agent proofs on `lane-ui` | P1 | Answered 12 October 2026: yes, harness allowed |

## 7. Decisions for Max's end review

Every decision that came up during the lane, with what the architect decided and why. Max reads this at the end
(LD-12). Each row points to its full record.

| # | Date | Question | Decision | Why | Record |
|---|---|---|---|---|---|
| 1 | 12 Oct 2026 | What does "the shell stays" mean? | Keep the shell architecture; conform it to SH-01; rebuild pages. | The prompt asks for shell conformance, not a new shell. | LD-01 |
| 2 | 12 Oct 2026 | Keep URLs and form fields? | Yes: paths, form actions and the hidden-field protocol stay. | Bookmarks, 17 system tests and the later E2E suite depend on them. | LD-03 |
| 3 | 12 Oct 2026 | Send result and Request completion | Stay unavailable (Core boundaries); the notice no longer says the trigger is undecided. | Building them is a Kind 2 change in its own lane. | LD-04 |
| 4 | 12 Oct 2026 | Release packet and download | Built as normal actions. | DECISIONS §1.5 closed OC-09. | LD-05 |
| 5 | 12 Oct 2026 | Mark notice read | Not built; notices show acknowledgement facts only. | A read marker is a Kind 2 change rejected by the architect of 10 October. | LD-06 |
| 6 | 12 Oct 2026 | How agents sign in for proofs | Lane harness reading the synthetic mailbox; Max approved. | Proofs need sessions; codes never leave the harness process. | LD-11 |
| 7 | 12 Oct 2026 | UAT-11 imports across groups | Seam request P-01 to the bulk lane; per group until served. | No read model exists; the orchestrator ruled out a per-group join. | P-01 |
| 8 | 12 Oct 2026 | Codex review budget | At most two Codex reviews per package (design before code where risk is high; code before integration); fixes checked by the architect, not sent back. | Max's limit of one review per unique artifact, no back-and-forth. | LD-13 |
| 9 | 12 Oct 2026 | Served commands with no page in the plan | Each got a page: document re-checks on SA-08; "Close the group" on TA-05 (Core decides); four more SA-09 decision kinds; parked money actions shown as notices, not controls. | Hiding a served command is a product decision; the spec does not forbid any of them. | COMMAND-COVERAGE §6 |

## 8. Seam items assigned to the lane

| ID | Date | Item | Source | When | Package |
|---|---|---|---|---|---|
| S-01 | 12 Oct 2026 | Texts of the bulk lane's new reason codes in the catalogue `src/apps/shared/pages/intake.ts` (provider_busy, provider_page_not_document, too_many_pages, passport_back_missing, passport_over_supplied, system_busy, listing_unreadable, passport_number_invalid; rerun_difference waits for its Kind 2 decision), wording by the UI lane under UI-PLAN §11; UAT-13 fallback: a page shows the code itself when its text is missing | Orchestrator, SEAM-CONTRACT §5 (internal 2b74a21); bulk lane proposal P-K1 item 11 | Codes land with the bulk lane's vocabulary commit; texts are added in the same integration window, against main, never against a lane commit. The fallback rule and the listing_unreadable and passport_number_invalid texts MAY go in with WP-04. | WP-04 |
