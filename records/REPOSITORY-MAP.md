# Repository map

| Repository | Path | Holds | Remote | Who pushes |
|---|---|---|---|---|
| Product (public-bound) | project root | TravelMudra source, tests, build configuration, public docs | `origin` (private GitHub repository; visibility owned by the product owner) | Product owner only |
| Internal records | `internal/` (nested, own `.git`, excluded from the product repository) | Build specification, design records, traceability, verification evidence, engineering overrides, reviews, agent context, a template of the machine-local instructions and the Claude memory snapshot | `origin` (private GitHub repository, since 8 October 2026) | Product owner only |

Boundary: installed 2026-10-04 with `repo_boundary.py install . --layout nested` (hooks: pre-commit, commit-msg, pre-push). Extra project rules in `agent/repo-boundary.json`.
Agents never push. Milestones are committed and tagged on the product repository's local `main`.

## Local-only items and how to restore them (9 October 2026, revised 14 October 2026)

A fresh clone of both repositories on another machine misses these items. None of them needs to be rebuilt
with an LLM; each has a copy or a procedure.

| Item | Where it lives on the build machine | Copy or procedure |
|---|---|---|
| Project instructions `CLAUDE.md` = `AGENTS.md` and `docs/agent-guide.md` (rules, module map, search method, test recipes) | product root, tracked since 13 October 2026 (a7b560c) | arrive with the clone; nothing to restore |
| Machine-local instructions `CLAUDE.local.md` (installations, ports, synthetic accounts, lane layout, state of the work) | product root, git-excluded | `internal/agent/project-instructions/CLAUDE.local.md.template` (structure kept, machine values blank); write a new file per machine |
| Repo-boundary hooks | `.git/hooks/` of the product checkout; call `~/agent-guidance/repo_boundary.py` | reinstall with the command above; `~/agent-guidance` is machine-level and outside this project |
| Claude project memory (owner decisions and preferences) | `~/.claude/projects/<project>/memory/` | `internal/agent/memory-snapshot/` (refreshed 14 October 2026; refresh it whenever a memory changes) |
| Milestone 6 agent run logs (raw) | `internal/agent/logs/` (gitignored, about 1 MB) | not kept; the verification records under `records/verification/` carry the conclusions |
| UAT installations, port registry and configurations | `~/.local/share/travelmudra-uat/`, `~/.local/share/travelmudra-preview/` | runtime state; recreate with `scripts/uat/uat.py up` (public `scripts/uat/README.md`) |
| System toolchain | `~/.local/opt/travelmudra-toolchain/` | `scripts/toolchain/install-user-toolchain.sh` (public) |
| Shared agent working agreement | `~/.claude/CLAUDE.md`, `~/codex/AGENTS.md`, `~/agent-guidance/` | owner's machine-level setup, not part of this project |
