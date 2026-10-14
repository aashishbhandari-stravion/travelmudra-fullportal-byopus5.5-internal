---
name: lane-burn-measurement
description: How to measure the lanes' context burn per hour and the standing instruction to show Max the reading from time to time (lane efficiency experiment, 13 Oct 2026)
metadata:
  type: project
---

Run `python3 -I internal/tools/lane-burn.py 2026-10-13T07` from the project root (context tokens per UTC hour, main chat and subagents apart, per lane). Max (13 Oct 2026): "nudge max also time to time": include the current reading in the reply to Max at every lane milestone (package, pause, resume, grant) and whenever he asks about tokens. Reference reading, 13 Oct 2026 08:00 UTC: Core lane about 25M per hour, subagents all Sonnet; UI lane before the rule up to 750M per hour, all Opus.

**Why:** the lane efficiency experiment (diary 2026-10-13 §7) measures whether the 280k rule, the guard hook and explicit subagent models keep the burn down; Max wants to see the trend without asking.

**How to apply:** no polling and no scheduled job; measure when a lane message or Max's question wakes this chat. Record notable readings in diary §7.8 (or the next numbered item). See [[lane-prompt-must-carry-budget-rules]] and [[efficiency-rules]].
