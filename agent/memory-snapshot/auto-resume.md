---
name: auto-resume
description: Max authorized automatically restarting the TravelMudra build after usage-limit pauses; resume procedure lives in internal/records/RUNBOOK-resume.md
metadata:
  node_type: memory
  type: feedback
  originSessionId: 2f6f1696-2924-4446-bd46-91bb768d9648
  modified: 2026-10-04T11:08:23.059Z
---

Max (2026-10-04): when the 5-hour usage limit is hit, Claude is authorized to restart as soon as tokens are replenished, without asking.

**Why:** the build is a long autonomous run; Max does not want to babysit limit pauses.

**How to apply:** keep a session heartbeat cron (session-only; recreate it in a fresh session) and follow internal/records/RUNBOOK-resume.md: resume interrupted workflows with resumeFromRunId, check worktree branches before re-running builders, continue the milestone procedure. Keep the runbook's "Current state" table current. Related: [[delegated-decisions]].
