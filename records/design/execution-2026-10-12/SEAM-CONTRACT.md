# Seam contract between the UI revamp lane and the bulk redesign lane

Version 1, 12 October 2026. Owner: the orchestrator (parent chat). A lane proposes a change to this file;
the orchestrator decides and records the version; Max decides a conflict between the lanes.

## 1. Ownership

| Owner | Files | Rule |
|---|---|---|
| UI revamp lane | `src/web/`, `static/`, `src/apps/shared/pages/`, `src/apps/shared/views/`, `src/apps/staff/views/`, every page, template, form and component under `src/apps/{edge,staff,shared}/` that renders HTML; public content; `test/ui/`, `test/unit/web/`, `test/static/`, page tests of the owned pages; `docs/` pages that describe the UI | Builds every page of the product, including the bulk pages (BU-P01 to BU-P10), against the read models and commands of this contract. Does not change a Core command, a read model, a module under `src/modules/`, a worker, `src/kernel/`, `src/contracts/`, `src/core-api/`, `src/platform/` or a migration. |
| Bulk redesign lane | `src/modules/intake/`, `src/modules/documents/`, `src/workers/`, `src/apps/edge/processing.ts`, the intake and document bindings in `src/core-api/` and `src/contracts/` that the intake owns, the intake task definitions on the kernel task queue, migrations of the intake and documents modules, `test/intake/`, `test/integration/documents-*.test.ts`, `test/documents-association/` | Redesigns the bulk upload backend and its read models. Does not render HTML. A read model change follows section 3. Does not change `src/kernel/` (off limits; a kernel need is a proposal to the orchestrator). |
| Shared, orchestrator-owned | `scripts/uat/`, `package.json` dependencies, `src/apps/shared/pages/intake.ts` text catalogue of reason codes (see UAT-13), `src/apps/edge/intake/routes.ts` and `src/apps/shared/ta-intake.ts` (the route and form handlers that join the two) | Each lane proposes; the orchestrator applies on main or assigns one lane the change for one commit. For the route handlers: the UI lane owns the rendering, the bulk lane owns the command shape; a change that touches both is a proposal first. |

## 2. What the UI lane builds against (v1 = the product at 102e4c9)

| Plan read model | Today (inventory row) | Status | UI lane rule |
|---|---|---|---|
| Import attempt (RM-B1) | `intake.attempt_page {attemptId, page}`: attempt state, state code, row counts, rows (100 per page), files, questions | Exists; per-state row counts are a Kind 1 request (inventory §4 row 1) | Build BU-P04, BU-P05, BU-P08, BU-P09 on it. Show "Unavailable", never a subtraction, where a count is missing (D7). |
| Source interpretation (RM-B2) | `intake.attempt_page.questions[]` and `files[]` | Partial | Build BU-P03 on the questions; a representative-values block that the read model does not give shows "Not available" and is listed as a seam request. |
| Intake issue detail (RM-B3) | `intake.incident_page`, `intake.row_page` | Exists | Build BU-P06 on them. |
| Correction preview (RM-B4) | none; a corrected sheet is a new attempt in the chain | Missing; architect's view: View only | BU-P07 shows the chain and the `correction_match_confirm` question. No apply step. |
| Import review queue (RM-B5) | `intake.attempt_page.rows[].services[]` joined with `core.ta_applications` | Partial; Kind 1 if latency fails | Build BU-P10 on the join. Measure on the lane installation with a 500-row synthetic import; report the latency. |
| TA imports across groups (UAT-11) | none | Plan gap; Kind 1 candidate | Seam request to the bulk lane (section 3). Until served, BU-P09 stays per group. |

Commands: CMD-20 to CMD-23, CMD-26, CMD-27 exist; CMD-24 "Start import" is the answer to the last blocking
question (Partial); CMD-25 "Retry eligible failures" and CMD-28 "Apply corrections" are Missing or Kind 2 and
the UI lane MUST NOT invent them. The bot check on `intake.start_bulk` and `intake.correction_upload` is
removed by the bulk lane (Max, 12 October); until the bulk lane's commit is integrated, the UI lane keeps the
widget on those two forms and does not depend on its removal.

## 3. Change rule

1. The bulk lane changes a read model or a command additively within a version: new fields, new states,
   new reason codes. A removed or renamed field, a changed meaning, or a changed state machine is a new
   version with both versions served until the UI lane has moved.
2. Every change is recorded here by the orchestrator as a new numbered version with the commit that
   serves it. The UI lane builds against the latest integrated version only; it never builds against a
   lane commit that is not integrated.
3. A request from the UI lane to the bulk lane (a field, a count, a projection) is a proposal in the UI
   lane's `output/proposals/`, ranked P0/P1/P2 with the page that needs it. The orchestrator routes it.
4. The reason-code text catalogue: the bulk lane adds a code, the UI lane adds its text in the same
   integration window; the page shows the code itself when the text is missing (UAT-13).

## 4. Integration order

1. The UI lane integrates in work packages (UI-PLAN §12). Non-bulk packages first; WP-04 and WP-05 (bulk
   pages) last, against the latest integrated bulk version.
2. The bulk lane integrates its backend in versions; each version comes with its read model version and
   the tests that prove it on the three-instance installation.
3. Max integrates and pushes. A lane never pushes. A conflict in the shared files of section 1 is resolved
   by the orchestrator on main.

## 5. Request log (orchestrator)

| Request | From | Date | Rank, Kind | Routed to | State |
|---|---|---|---|---|---|
| P-01 "attempts of a travel agent across groups" (query, own-TA scope, paged, newest first, with group name and country; for UAT-11, BU-P09 TA-wide or a TA-01 panel). Text: UI lane `output/proposals/P-01-ta-imports-across-groups.md`; lane internal commit 37b2635 | UI lane | 12 Oct 2026 | P1, Kind 1 | Bulk lane, as a read model of capability 5 (prompt §5 item 5), under the six-point criterion | Open. Interim: BU-P09 stays per group; the UI lane does not join per group. Served when a seam version names the query. |
| P-K1 additive vocabulary, configuration and wiring outside the bulk lane's files (11 items). Text: bulk lane `output/proposals/P-K1-bulk-additive-vocabulary-and-config.md`; basis: requirements revision 2 accepted by Max on 12 Oct (lane internal commit e075e7c) | Bulk lane | 12 Oct 2026 | P1; items 1–4, 6–10 additive values and keys; item 5 is a new command (Kind 2); item 11 is text | Orchestrator decision of 12 Oct 2026: items 1–4 and 6–10 authorized as ONE separate commit in the lane branch, named for the integration, under these conditions: additive only, no existing value or default behaviour changes; every new configuration key has a documented default equal to today's behaviour; the worker contract literal `tm-worker/2` stays compatible so edge and processing deploy as a unit on the lane installation; the bot-check diagnostics event carries allowlisted fields only; `npm run check` passes on that commit (kernel, contracts and platform touched). Item 5 (`intake.rerun`, SuperAdmin) waits for the Kind 2 gate: written proposal per DECISIONS §3.2 item 1, the independent review, Max's decision, recorded in the owner decision register; the vocabulary value is added only after that decision. Item 11 routed to the UI lane (it owns the wording); the bulk lane's texts are the proposal. | Open until the commit and the Kind 2 decision are reported. |
