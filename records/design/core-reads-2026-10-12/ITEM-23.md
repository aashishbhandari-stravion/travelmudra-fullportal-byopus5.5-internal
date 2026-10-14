# ITEM-23 P-17 (3): `core.apply_held_correction` on the staff allowlist

Wiring. Wave 3. Closed as handed over to the UI lane; nothing built in this lane.

## Finding

The command exists (`src/modules/core/commands/drafts.ts` about `:155-190`; it authorizes by role and requires the
correction kind to match the role), with its contract (`src/contracts/core.ts:92`) and binding
(`src/core-api/bindings/core.ts:477`). Core's pending answer names the SuperAdmin or the assigned operator for a
released held correction (`derived.ts`, rule 8). The allowlist has the command for the edge service only
(`src/core-api/allowlists.ts:43`).

The staff allowlist line alone fails `test/unit/bff.test.ts:309-315`: every allowlisted command that has an inventory
route needs a route served by that BFF, and route T48 (`src/web/route-inventory.ts:132`) is served by edge only. A staff
inventory row without a handler fails `:268-273` instead. A green check per commit therefore needs the UI lane's staff
route and handler in the same commit.

## Decision

Orchestrator (13 Oct 2026, under the overnight delegation; PLAN D-16 D-b): option (1). The UI lane adds the allowlist
line in `src/core-api/allowlists.ts` in the same commit as its staff route and handler; the orchestrator grants that
line to the UI lane when it resumes. No test exemption and no route-inventory grant for the Core lane.

Source: wave 3 survey D (lane `research/briefs/WAVE3-survey-D-result.md`). No commit, no Codex review (nothing built).
