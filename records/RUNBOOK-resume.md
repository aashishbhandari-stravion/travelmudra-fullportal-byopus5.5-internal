# Resume runbook (orchestrator)

Owner: orchestrator. Purpose: let this session, or a fresh one, continue the TravelMudra build after a usage-limit pause, crash or restart without losing or duplicating work. Update the "Current state" section at every milestone and every workflow launch.

## Standing authority (summary; full text in the original task prompt held by the product owner)
- Orchestrator alone integrates into local `main`, commits and tags each completed milestone once its checks pass. Nobody pushes. No history rewrite, no deletion of merged commits or milestone tags, no new repositories, no visibility change.
- Commit only public-fit content. No production deployment, spend, real payments, government actions, customer notices or production data changes.
- The product owner delegated all decisions during this run (2026-10-04) and authorized automatic restart after usage-limit pauses. Decide, record (contract §18 / ENGINEERING_OVERRIDES), continue.
- The session is livestreamed: never print secrets.

## Key paths
- Product repo: project root (public-bound; boundary hooks installed). Internal records: `internal/` (own git repo).
- Spec: `internal/records/BUILD_SPEC.md` (SHA-256 4a6fd906…ea89). Brief: `internal/records/design/00-architecture-brief.md`. Contract (normative): `internal/records/design/01-foundation-contract.md` (rev 4: §16 extension, §17 test allocation, §18 delegated decisions). Module designs: `internal/records/design/11-…15-*.md`. Register: `02-owner-decision-register.md`. Overrides: `internal/records/ENGINEERING_OVERRIDES.md`.
- Integration gate: `internal/agent/integration-gate.sh <base> [<tip>]` (boundary check-range + identifier scan + `npm run check`).
- Toolchain: `$HOME/.local/opt/travelmudra-toolchain/env.sh`. Dev clamd: `$HOME/.local/share/travelmudra-dev/clamav/clamd.conf` (socket `run/clamd.sock`; start: `clamd --config-file=<conf>` with env sourced).
- Workflow scripts and journals: `~/.claude/projects/<project>/<session>/workflows/scripts/` and `.../subagents/workflows/<run id>/journal.jsonl`.

## Launch rule (lesson 2026-10-04)
Always launch Workflow/Agent calls with the shell's working directory at the PRODUCT root. Worktree isolation uses the current repository; a launch from `internal/` created product worktrees inside the internal repo (cleaned up: branch moved to the product repo as `review-fixes`, internal objects purged).

## How to resume an interrupted workflow
1. Find the run id and script path (table below). Read its `journal.jsonl`: one `result` line per completed agent.
2. If the run is still active, wait. If it ended with an error/limit, re-invoke `Workflow({scriptPath, resumeFromRunId})`: completed agents replay from cache, the rest run live. Do not edit prompts of completed agents (that breaks the cache).
3. Worktree agents leave branches `worktree-<run>-<n>`; check `git worktree list` and the branch log before re-running a builder (its commits may already exist).

## Efficiency rules (product owner, 2026-10-05; binding)
1. At most THREE parallel lanes (agents doing heavy work) at any time; concurrency is set by token budget, not by how many independent lanes exist.
2. Workers return a COMPACT handoff only (schema below, length-capped). The orchestrator reviews diffs, contracts, migrations and interfaces plus the gate result — never full worker reasoning histories.
3. Worker agents MUST NOT spawn sub-agents (no Agent/Task tool, no nested workflows); every prompt says so. Lesson 2026-10-06: an integration agent spawned 4 sub-agents (6 concurrent total) and the session limit hit within an hour.
4. Heartbeat cron hourly at :23 (job 6cb35e17; session-only). Workflow completion notifications are the primary wake signal.

Compact handoff schema (use in every Workflow agent call):
```js
const HANDOFF = { type: 'object', properties: {
  branch: { type: 'string', maxLength: 200 }, commit: { type: 'string', maxLength: 64 },
  files_changed: { type: 'string', maxLength: 2500 },        // grouped paths, not contents
  contracts_changed: { type: 'string', maxLength: 2500 },    // interfaces, api.ts, migrations, vocabulary, config keys, routes
  tests: { type: 'string', maxLength: 600 },                 // command + actual counts
  unresolved: { type: 'array', maxItems: 15, items: { type: 'object', properties: { priority: { type: 'string', enum: ['P0','P1','P2'] }, issue: { type: 'string', maxLength: 300 } }, required: ['priority','issue'] } },
  rationale: { type: 'string', maxLength: 7000 },            // ≈1–2k tokens: key decisions, deviations, risks
}, required: ['branch','commit','files_changed','contracts_changed','tests','unresolved','rationale'] }
```
Review procedure: `git diff --stat main..<branch>`; read diffs of migrations/, src/contracts/, src/modules/*/api.ts, src/kernel/vocabulary/, src/web/route-inventory.ts, compose/register files; boundary check-range; run the gate.

## Recovering builder lanes stopped by a usage limit (preferred over a plain resume)
A plain `resumeFromRunId` re-runs an interrupted worktree agent from scratch in a NEW worktree and loses its partial work. Instead: (1) inspect each lane worktree (commits + uncommitted + untracked line counts); (2) snapshot partial work as one work-in-progress commit on the lane branch (hooks stay enabled — never `--no-verify`; run `repo_boundary.py check-range` on the branch); (3) launch a continuation workflow whose agents run `git merge --ff-only <lane branch>` in a fresh worktree, audit the inherited code, finish the scope, and may restructure their own branch history before hand-back. Example: `travelmudra-m2-lanes-continue.js`.
Note (2026-10-05): the M2 snapshot commits 751dd60, 96b302a, ab72093 were made with `--no-verify` by mistake; the boundary range check on those exact commits was clean immediately afterwards. Not to be repeated.

## Milestone procedure
1. Merge lane branches into `main` (`git merge --no-ff`), resolve conflicts as architect.
2. Run the integration gate on the merged range; fix or send back failures.
3. Independent review workflow (reviewer never the implementer); fix P0; rank the rest (P1 recorded, P2 parked).
4. Re-run the gate; commit; `git tag -a m<N>-<name>`; update this runbook; commit internal records.

## Current state (update every step)
| Item | State | Run id / branch | Script |
|---|---|---|---|
| Design (contract, modules, review, consolidation) | done; contract rev 4 (§16 extension, §17 test allocation, §18 delegated decisions) | wf_e8b5df7e-a53 | travelmudra-design-wf_6f3d22c7-6e4.js |
| Design system | **merged** to main (f5fd6e5) after independent Principal UX approval (1 P0 + 4 P1 fixed and re-checked); main verified 492/492; worktree removed | wf_b84d73e7-352 | — |
| M1 stage A kernel core | **merged** to main (df65e51); 114 tests verified; worktree removed | wf_22e23e8d-b08 | travelmudra-m1a-kernel-core-wf_22e23e8d-b08.js |
| M1 stage B lanes (kernel runtime, platform seams, countries+static) | **merged** to main (24f93fa, 620054f, 2d03767) + integration fixes b81fca0; integrated gate: typecheck/lint OK, 323/323 tests, 0 skipped; worktrees removed | wf_91b0d5e2-e8d | travelmudra-m1b-lanes-wf_91b0d5e2-e8d.js |
| **Milestone 1** | **tagged `m1-foundation` (d878072)**; 599/599 verified; record verification/2026-10-04-m1-foundation.md | — | — |
| **Milestone 2** | **tagged `m2-access-catalogue-documents` (da113be)**; 981/981 verified; record verification/2026-10-05-m2-*.md | — | — |
| Milestone 3 lanes | ALL DONE: core worktree-wf_d3faa9df-f1f-1 d322341 (1062), intake -f1f-2 baeac9e (1070), payments -f1f-3 f42e024 (1069), ops-tooling -f1f-4 4ac88f5 (1046; footprint verified safe — classifier timed out on it; systemd 'travelmudra-lab-*' units belong to the separate AstraGPT6 project, left untouched), views worktree-wf_5ba30037-8eb-5 a2734f6 (1020). 4 orphaned /tmp/tm-test-* envs stopped and removed. | wf_d3faa9df-f1f | — |
| M3 integration | continuation agent running in m3-integration worktree (no sub-agents; compact handoff) from WIP 3b4462b | Agent (background) | — |
| Service split phase 1 | continuation workflow running (infra ff-only to d36f5d5 → port M1–M2 pages → boundary review → fix; sequential, no sub-agents) | wf_b74a5c37-afd (task wzdxx5bzp) | travelmudra-service-split-phase1-continue.js |
| Next | integrate M3 lanes (branch m3-integration; cross-module FK migration) and service-split phase 1; phase 2: port M3 pages to edge/staff over the API, delete the single-process server, all system/E2E tests on 3 instances; then M3 review (code + UX) → tag | — | — |
| Heartbeat | session cron hourly `23 * * * *` (job 6cb35e17; session-only) | — | — |
