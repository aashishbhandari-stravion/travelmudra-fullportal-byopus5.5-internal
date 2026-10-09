---
name: project-setup-roles
description: "Roles, inputs and repository layout for the TravelMudra (MaxHyperVisa) full-portal implementation project"
metadata:
  node_type: memory
  type: project
  originSessionId: 2f6f1696-2924-4446-bd46-91bb768d9648
  modified: 2026-10-08T03:23:20.584Z
---

Initialized 2026-10-04. Goku (Codex) owns git setup for this project. Naruto (Claude Opus 5.5, UltraCode) leads full portal development. Max supplies the build spec derived from BRD and architecture reviews done outside this project (related dirs: ../HyperVisaBRD25AugCodex, ../MaxHyperVisaArchitecture, ../MaxHyperVisa25Sep).

**Why:** the build spec is the controlling implementation input; do not re-derive requirements from BRD/architecture dirs.

Repo layout (updated 2026-10-04 on Max's explicit instruction): project root is a public-bound repository (origin github aashishbhandari-stravion/travelmudra-fullportal-byopus5.5, branch main) with the nested boundary installed (`repo_boundary.py install . --layout nested`). Private records live in nested `internal/` (own .git, excluded). The spec moved to `internal/records/BUILD_SPEC.md` (SHA-256 4a6fd906…ea89). Design brief: `internal/records/design/00-architecture-brief.md`. This supersedes the earlier "single private repo, no internal/" note.

Update 2026-10-08 (Max): the product repo stays private permanently (company software, never published), but the two-repo separation and the boundary hooks stay. internal/ now has remote origin = private repo travelmudra-fullportal-byopus5.5-internal. The hook forbids the GitHub account name in product files, so refer to that repo by name only. Agent pushes and internal commits are refused by the permission system; hand Max the commands.

**How to apply:** commit only public-fit content to the root repo (no spec rule IDs like B01–B47, no agent names, no /home paths); internal records, traceability, overrides and evidence go to internal/. Max alone pushes. The repo-boundary hooks check the canonical path, so run `check-range` on integrated worktree commits.
