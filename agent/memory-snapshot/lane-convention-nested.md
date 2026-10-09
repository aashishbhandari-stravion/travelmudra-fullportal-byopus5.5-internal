---
name: lane-convention-nested
description: "How lanes are made for this nested-layout project (projectctl refuses it); Max's lane max-uat-2026-10-09 and its lane-max installation"
metadata:
  node_type: memory
  type: project
  originSessionId: 360b1428-8693-4bab-8b98-3d6f23941feb
  modified: 2026-10-09T04:37:11.375Z
---

This project keeps the nested layout (public root + `internal/` inside), so `projectctl lane create` does
not apply ("not managed"). Lanes are made by hand, the same way the sister project
MaxHyperVisaFullPortalImplementationAstraGPT6 did: `~/workDirectory/Critical/<project>/lanes/<id>/`
with `repo/` (git clone of the canonical root, origin = canonical path, own branch), `repo/internal/`
(clone of the private repo, excluded), `research/`, `state/`, `output/proposals/`, `workspace.json`
(kind `legacy-layout-isolated-clone`) and `START-HERE.md`. Run
`repo_boundary.py install <repo>` and copy CLAUDE.md/AGENTS.md into the clone (both are git-excluded).

Created 9 October 2026: lane `max-uat-2026-10-09` (branch of the same name, base fede68a) with UAT
installation `lane-max` on ports 4620/4622 (core 4621, processing 4623). Max owns it for manual UAT and
focused fix chats. Max alone pushes; lanes never push.

**Why:** the global rules require parallel write work in external lanes, but projectctl needs the
sibling layout and the project has not migrated.
**How to apply:** make further lanes the same way; record each in the installations table of the
project CLAUDE.md/AGENTS.md. See [[uat-deploy-script]] and [[local-preview]].
