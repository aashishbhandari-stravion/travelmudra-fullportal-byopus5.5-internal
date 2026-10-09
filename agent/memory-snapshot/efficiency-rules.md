---
name: efficiency-rules
description: "Max's efficiency rules for the TravelMudra build (2026-10-05) — max 3 parallel lanes, compact worker handoffs, parent reviews diffs not narratives"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 2f6f1696-2924-4446-bd46-91bb768d9648
  modified: 2026-10-05T17:41:31.367Z
---

Max (2026-10-05), because session limits were hurting progress: (1) at most 3 parallel lanes — concurrency is limited by token budget, not by how many independent lanes exist (this reverses his earlier OK for 5 lanes); (2) workers return a compact handoff — files changed, contracts changed, tests, unresolved findings, 1–2k token rationale; the parent reviews diffs/contracts, not full reasoning histories.

**Why:** repeated session/weekly usage limits; long worker reports and parent re-reads waste budget.

**How to apply:** use the length-capped HANDOFF schema in internal/records/RUNBOOK-resume.md for every workflow agent; review via git diff --stat + diffs of migrations/contracts/api.ts/vocabulary/routes + the gate; keep the heartbeat hourly. Related: [[delegated-decisions]], [[auto-resume]].
