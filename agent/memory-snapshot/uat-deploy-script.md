---
name: uat-deploy-script
description: "Every local UAT/preview deploy goes through scripts/uat/uat.py (config-driven, port registry, cleanup); enhance the script, never run the steps by hand"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 2f6f1696-2924-4446-bd46-91bb768d9648
  modified: 2026-10-08T08:16:20.868Z
---

Max (2026-10-08): local UAT builds and deployments must be mechanical. Use one Python script, `scripts/uat/uat.py`, and enhance it every time something new is needed. Do not spend tokens running the tm steps by hand.

- It is driven by configuration: name, root (the build path), source, ref, and ports.external (edge, staff) and ports.internal (core, processing).
- Keep configs in `~/.local/share/travelmudra-uat/configs/<name>.json`.
- The shared port registry is `~/.local/share/travelmudra-uat/registry.json`, behind a flock. `suggest-ports` and `check` find free ports and collisions.
- Commands: up, deploy, status, stop, start, `cleanup <name> --confirm <name>` (run only after Max approves the preview), adopt, ports.
- The existing preview is adopted as `preview`: prefix tm-, ports 4610–4613 ([[local-preview]]).

**Why:** Max runs parallel developments (up to 3 lanes). The orchestrator chat should only write a small config, and the script must avoid port collisions and free resources on approval.

The full usage rules for task chats are in the project's local `CLAUDE.md` and `AGENTS.md` (identical, git-excluded). Change both together.

**How to apply:** for a new lane preview, run `suggest-ports`, write the config, then `up`. For new code, run `deploy --ref`. When Max approves, run `cleanup`. If a step fails or is missing, fix uat.py (commit it), then rerun.
