# Project instructions (copy of the git-excluded root files)

`CLAUDE.md` here is a byte-identical copy of the product root's `CLAUDE.md` and `AGENTS.md`. Those two root
files are excluded from the product repository (`.git/info/exclude`) because they hold internal rules, paths
and the module map. This copy keeps them in the internal repository so a fresh checkout on another machine
does not have to rebuild them.

## Restore on a new machine

From the product root (public checkout), with `internal/` cloned beside `src/`:

```bash
cp internal/agent/project-instructions/CLAUDE.md CLAUDE.md
cp internal/agent/project-instructions/CLAUDE.md AGENTS.md
printf 'internal/\nCLAUDE.md\nAGENTS.md\ndiary/\n.claude/\n' >> .git/info/exclude
python3 ~/agent-guidance/repo_boundary.py install . --layout nested
```

The last line installs the repo-boundary hooks (pre-commit, commit-msg, pre-push). It needs the shared
`~/agent-guidance` tooling, which is machine-level and not part of this project.

## Keep in sync

Whoever changes the root `CLAUDE.md` MUST copy it to `AGENTS.md` and to this directory in the same task,
then commit the internal repository. Check: `cmp CLAUDE.md internal/agent/project-instructions/CLAUDE.md`.
