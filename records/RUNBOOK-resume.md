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

## How to resume an interrupted workflow
1. Find the run id and script path (table below). Read its `journal.jsonl`: one `result` line per completed agent.
2. If the run is still active, wait. If it ended with an error/limit, re-invoke `Workflow({scriptPath, resumeFromRunId})`: completed agents replay from cache, the rest run live. Do not edit prompts of completed agents (that breaks the cache).
3. Worktree agents leave branches `worktree-<run>-<n>`; check `git worktree list` and the branch log before re-running a builder (its commits may already exist).

## Milestone procedure
1. Merge lane branches into `main` (`git merge --no-ff`), resolve conflicts as architect.
2. Run the integration gate on the merged range; fix or send back failures.
3. Independent review workflow (reviewer never the implementer); fix P0; rank the rest (P1 recorded, P2 parked).
4. Re-run the gate; commit; `git tag -a m<N>-<name>`; update this runbook; commit internal records.

## Current state (update every step)
| Item | State | Run id / branch | Script |
|---|---|---|---|
| Design (contract, modules, review, consolidation) | done; contract rev 4 (§16 extension, §17 test allocation, §18 delegated decisions) | wf_e8b5df7e-a53 | travelmudra-design-wf_6f3d22c7-6e4.js |
| Design system (build → critique → fix) | build+critique done (2 P0, 6 P1, 5 P2); fix round resumed after limit (partial fix diff saved in session scratchpad, worktree reset to 5e0d85e) | wf_a69554df-5be (task w4wo39q71), worktree-wf_a69554df-5be-1 | travelmudra-design-system-wf_a69554df-5be.js |
| M1 stage A kernel core | **merged** to main (df65e51); 114 tests verified; worktree removed | wf_22e23e8d-b08 | travelmudra-m1a-kernel-core-wf_22e23e8d-b08.js |
| M1 stage B lanes (kernel runtime, platform seams, countries+static) | resumed after usage limit (first run died after ~1 min, no partial work) | wf_91b0d5e2-e8d (task wp9tshk9f) | travelmudra-m1b-lanes-wf_91b0d5e2-e8d.js |
| Next | merge B lanes (resolve vocabulary/reason-code conflicts; wire lease_lost hook into WorkerRunner), Principal UX approval gate for design system then merge, web-shell lane (needs design-system html.ts), foundation review workflow, gate, tag `m1-foundation` | — | — |
| Heartbeat | session cron `7,37 * * * *` (job ad07c898; session-only) | — | — |
