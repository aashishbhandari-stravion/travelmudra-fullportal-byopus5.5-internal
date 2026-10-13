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
