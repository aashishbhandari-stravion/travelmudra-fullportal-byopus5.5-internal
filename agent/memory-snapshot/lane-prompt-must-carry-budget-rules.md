---
name: lane-prompt-must-carry-budget-rules
description: "Lane prompts must restate the worker-model and context-cap rules with numbers and \"pass model explicitly\"; global CLAUDE.md defaults alone were not followed (13 Oct 2026, ~10B tokens in a day)"
metadata:
  node_type: memory
  type: feedback
  originSessionId: d496a8a1-91b1-4335-956e-fb0f4ca7be71
  modified: 2026-10-13T08:04:14.413Z
---

Every lane prompt MUST carry, with numbers: one task per subagent with a brief and a return limit; under 100k context per subagent turn, partial return before 200k; "pass `model` explicitly on every Agent call: haiku mechanical, sonnet evidence, opus judgment and package review only"; the main-chat compaction threshold (220k) and the compaction procedure (finish running subagents, commit or leave edits + state/RESUME.md, compact, re-read only named files). Worker tier by module (Max, 13 Oct 2026, OD-X22): Core, kernel and restore/recovery work uses Opus workers under the same caps; elsewhere Sonnet workers implement a decided design from a brief with a Codex review per item, Opus for unknown-cause fixes, cross-module kernel/transaction changes and recovery code. Core lane thresholds 380k prepare / ~430k auto (autoCompactWindow 463000); other lanes 280k. Core lane exception OD-X23 (Max, 13 Oct 2026): Opus for Kind 2 items, Sonnet for defects and reads, worktrees per worker (max 3), partial return before 275k; the standing rule for future lanes is unchanged.

**Why:** On 12 to 13 Oct 2026 the UI and bulk lanes (Opus 5.5) ran 141 subagents, all on Opus because the Agent tool inherits the parent model when `model` is omitted, at 300k to 400k context each: about 10 billion context tokens in a day, 69 percent of the weekly 20x limit. The worker defaults were in the global working agreement every lane loads, but the lane prompts named only the lane model. Max: "I have kept this rule in the global claude.md, why was this NOT shared with the agents in the first place?"

**How to apply:** A rule in the global agreement is a default; the prompt is where it becomes an instruction. Measure subagent cost from `~/.claude/projects/**/subagents/*.jsonl` usage fields before the account card does. Record in diary 2026-10-13 §7 (lane efficiency experiment). See [[efficiency-rules]] and [[lane-convention-nested]].
