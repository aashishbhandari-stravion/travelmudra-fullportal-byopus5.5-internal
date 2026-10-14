# Execution plan: UI revamp and bulk upload redesign, two parallel lanes (12 October 2026)

Status: plan and prompts, written by the Principal Technical Architect (Fable 5.1, parent chat) on Max's
instruction of 12 October 2026. No implementation is authorized by this folder; each lane starts when Max
opens its chat with its prompt. Max decides, integrates and pushes.

| File | Content |
|---|---|
| `UI-REVAMP-PROMPT.md` | Prompt for the UI revamp lane (`ui-revamp-2026-10-12`). Opus 5.5 is the lane's Principal Technical Architect. |
| `BULK-REFACTOR-PROMPT.md` | Prompt for the bulk upload redesign lane (`bulk-refactor-2026-10-12`). Opus 5.5 is the lane's Principal Technical Architect. |
| `SEAM-CONTRACT.md` | The seam between the lanes: ownership, the bulk read models and commands the UI lane builds against, the change rule, the integration order, the request log (§5) and seam versions (§6). |
| `CORE-TASK-PROMPT.md` | Prompt for the Core task lane (`core-reads-2026-10-12`): Core defect fixes and Kind 1 read models approved as one batch. Launch after Max confirms to the orchestrator. |
| `AFTER-LANES.md` | Tracker of the work that waits for the completion of the three lanes (opened 13 October 2026 at Max's request): the restore drill, Max's walk-throughs and UAT pass 2, the open decisions, the parked P2 findings, lane closure. |

## Lanes

| Lane | Clone | Branch | Base | Installation |
|---|---|---|---|---|
| UI revamp | `~/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/ui-revamp-2026-10-12/repo` | `ui-revamp-2026-10-12` | 102e4c9 (product), internal at the commit of this folder | `lane-ui`: edge 4650, staff 4652, core 4651, processing 4653 |
| Bulk redesign | `~/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/bulk-refactor-2026-10-12/repo` | `bulk-refactor-2026-10-12` | same | `lane-bulk`: edge 4660, staff 4662, core 4661, processing 4663 |

Both lanes were made by hand (nested layout): a clone of the product repository, `internal/` cloned inside
and excluded, boundary hooks installed with the lane path, copies of `CLAUDE.md` and `AGENTS.md`, a
`workspace.json` and a `START-HERE.md`. The orchestrator (this chat) wrote the installation configurations
and runs `uat.py up`, `deploy` and `cleanup` for the lanes.

## Inputs by weight

Always loaded by a lane (its prompt names the paths):

| Input | Why |
|---|---|
| `TARGET_PRODUCT_UX_SPEC.md`, `BULK_UPLOAD_PRODUCT_UX_SPEC.md` (architecture repository, 5 October 2026) | The target. The product is compared against these. |
| `BUILD_SPEC.md` (BS, r2) | Both UX specs cite it as the governing contract for every policy boundary (B01 to B46). |
| `ui-plan-from-specs-2026-10-10/UI-PLAN.md`, `BULK-UPLOAD-UI-PLAN.md` | Reference, not target (Max, 10 October). The acceptance list, the inventory and the triage key on its page and component identifiers. |
| `ui-plan-from-specs-2026-10-10/DECISIONS-2026-10-10.md` | Binding rules: shell stays, no page salvage, kernel off limits, Kind 1 and Kind 2 gates, UAT triage. |
| `ui-plan-from-specs-2026-10-10/SURFACE-INVENTORY-2026-10-10.md` | Which read models and commands exist, are partial or missing, and the Kind bucket of each. |
| `docs/agent-guide.md` (product repository) | Module map, test recipes, three-instance rule, `uat.py`-only rule. |
| `uat/2026-10-12-uat-pass1-triage.md` | Acceptance additions (UI lane), fix items and requirements (bulk lane). |
| `bulk-enhancement-2026-10-10/ASTRA-BULK-BACKEND-REFERENCE-2026-10-10.md` §6, §8, §9, §10 (bulk lane) | The open design questions, Max's directions, the fault tolerance thoughts, Astra's answers. |
| `SEAM-CONTRACT.md` | Both lanes. |

Loaded only when a task needs them (Max, 12 October 2026): the UAT findings file (TA role only), the test
plan Part D sequences, the Astra evidence summary and handover (bulk backend history: bugs met and solved
in the sibling implementation), the 8 October build handover diary, the P2 list in `FINAL-REPORT.md` §6,
and the three P1 questions of the independent review of 8 October. Never loaded: the withdrawn Goku review
prompt.

## Communication protocol (Max, 13 October 2026)

Lanes message the orchestrator only when required: a proposal ready for the gate, a package ready for integration, a grant or decision needed, a stop condition, a blocked deploy. One message per milestone, bundling everything it produced. No acknowledgements, no progress notes, no estimates ahead of the reviewed file. The orchestrator sends no acknowledgements (silence means logged) and writes to a lane only to deliver a decision, a grant or an assignment. Reason: every message wakes the orchestrator chat with its whole context.

Amendment (Max, 13 October 2026, afternoon): the orchestrator answers its own questions about a lane from the lane's files (read only: the lane clone, `output/`, `research/`, `state/`) and never wakes a lane for a status or a fact that is on disk. When the orchestrator must ask a lane something, the lane's main chat delegates the answer to a subagent with a self-contained question and relays the result, so the lane's own context is not spent on it. The same rule applies in the other direction: a lane asks the orchestrator only for a decision, a grant or an assignment, never for a fact that is in the seam contract, the register or the prompts.

## Lane prompt requirements (Max, 13 October 2026)

Every lane prompt MUST restate the context budget with its numbers (project `CLAUDE.md`, section "Context budget";
global `projectctl` writes the same section into every lane brief it creates): the subagent rule (one task per
subagent with a brief and a return limit; under 100k context per turn, partial return before 200k; `model` passed
explicitly on every Agent call: `haiku` mechanical, `sonnet` evidence, `opus` judgment and package review only) and
the parent rule (context checked at every boundary; above 280,000 tokens no new command or subagent, running
subagents finish, commit or `state/RESUME.md`, then wait for Max to compact). A hand-made lane also gets
`.claude/settings.local.json` with the `internal/tools/context-guard.py` hook at 280,000 and `autoCompactWindow`
383000. Reason: a rule that lived only in the loaded global defaults was not followed on 12 to 13 October 2026
(diary 2026-10-13 §7.5).

Worker tier by module (Max, 13 October 2026, OD-X22): Core, kernel and recovery work uses `opus` workers. Amended for
the Core lane only (OD-X23, Max in the lane chat, confirmed): `opus` for Kind 2 items, `sonnet` for defects and reads, one
worktree per worker (at most three), waves by code area, partial return before 275k. The UI and bulk lanes run `sonnet` workers that implement a decided design from a written brief
with the item's Codex review behind every return, and `opus` workers for a fix whose cause is unknown, a change that
touches kernel or transaction semantics across modules, and restore or recovery code. A Codex review that returns
design-level findings on a `sonnet` item is the signal to change the tier. Core lane thresholds: prepare at 380,000
(guard hook), automatic compaction at about 430,000 (`autoCompactWindow` 463000); the other lanes keep 280,000.
