# Project instructions: what is tracked and what is machine-local

Since 13 October 2026 (product commit a7b560c) the root `CLAUDE.md` and `AGENTS.md` are tracked in the product
repository and identical; `docs/agent-guide.md` (tracked) holds the detail. A fresh clone has them. The copy that
used to live here was removed on 14 October 2026 because it had drifted from the tracked file.

`CLAUDE.local.md` at the product root is excluded from git. It holds what is specific to one machine: installation
names and ports, synthetic accounts, the lane layout and the state of the work. `CLAUDE.local.md.template` here keeps
its structure with the machine values blank.

## Set up a new machine

From the product root (public checkout), with `internal/` cloned beside `src/`:

```bash
printf 'internal/\ndiary/\n.claude/\nCLAUDE.local.md\n' >> .git/info/exclude
cp internal/agent/project-instructions/CLAUDE.local.md.template CLAUDE.local.md
python3 ~/agent-guidance/repo_boundary.py install . --layout nested
```

Then fill `CLAUDE.local.md` for that machine (ports from `python3 scripts/uat/uat.py suggest-ports`, the UAT home,
the synthetic accounts). The last line installs the repo-boundary hooks (pre-commit, commit-msg, pre-push). It needs
the shared `~/agent-guidance` folder (`CORE.md`, `REPOSITORIES.md`, `REPOSITORY-NAVIGATION.md`, `repo_boundary.py`,
`sync.py`), which is machine-level and handed over separately with the global `CLAUDE.md` and `AGENTS.md`.

## Keep in sync

Whoever changes the root `CLAUDE.md` MUST write the same content to `AGENTS.md` in the same commit
(`cmp CLAUDE.md AGENTS.md`). Whoever changes the structure of `CLAUDE.local.md` (a new section, a new rule)
MUST update the template here and commit the internal repository. Machine values never go into the template.
