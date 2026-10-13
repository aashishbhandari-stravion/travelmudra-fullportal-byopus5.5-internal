#!/usr/bin/env python3
"""Claude Code PreToolUse hook: refuse a subagent launch when the main chat's context is above a limit.

Input (stdin, JSON from Claude Code): session_id, transcript_path, tool_name, tool_input, ...
Output: nothing when the launch is allowed; a deny decision with the instruction when it is not.
Limit: CONTEXT_GUARD_LIMIT tokens (default 220000). The context of a turn is the sum of input, cache read and
cache creation tokens of the last assistant message in the transcript. A transcript that cannot be read allows the
launch (the guard never blocks on its own failure) and says so on stderr.
Lane efficiency experiment, 13 October 2026 (internal diary 2026-10-13, section 7).
"""
import json
import os
import sys

LIMIT = int(os.environ.get("CONTEXT_GUARD_LIMIT", "220000"))
GUARDED_TOOLS = {"Agent", "Task", "Workflow"}


def last_context(path):
    last = None
    with open(path, "r", encoding="utf-8", errors="replace") as fh:
        for line in fh:
            if '"usage"' not in line:
                continue
            try:
                d = json.loads(line)
            except ValueError:
                continue
            if d.get("type") != "assistant":
                continue
            u = (d.get("message") or {}).get("usage") or {}
            ctx = (u.get("input_tokens") or 0) + (u.get("cache_read_input_tokens") or 0) + (u.get("cache_creation_input_tokens") or 0)
            if ctx:
                last = ctx
    return last


def main():
    try:
        data = json.load(sys.stdin)
    except ValueError:
        return 0
    if data.get("tool_name") not in GUARDED_TOOLS:
        return 0
    path = data.get("transcript_path")
    if not path or not os.path.exists(path):
        print("context-guard: no transcript; launch allowed", file=sys.stderr)
        return 0
    try:
        ctx = last_context(path)
    except OSError as exc:
        print(f"context-guard: cannot read transcript ({exc}); launch allowed", file=sys.stderr)
        return 0
    if ctx is None or ctx <= LIMIT:
        return 0
    reason = (
        f"context-guard: main-chat context is {ctx:,} tokens, above the {LIMIT:,} limit (rule 1, Max, 13 Oct 2026). "
        "Subagent launches are refused until you compact. Do now: let running subagents finish and collect their returns; "
        "commit the current unit if it is coherent, otherwise leave the edits on disk and write state/RESUME.md "
        "(files touched, intent, next step, pending decision); then run /compact; after it, read state/RESUME.md and "
        "re-read only the files it names."
    )
    print(json.dumps({
        "hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "permissionDecision": "deny",
            "permissionDecisionReason": reason,
        }
    }))
    return 0


if __name__ == "__main__":
    sys.exit(main())
