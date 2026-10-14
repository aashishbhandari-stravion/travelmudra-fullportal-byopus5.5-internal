#!/usr/bin/env python3
"""Context tokens per hour for the lane chats, main chat and subagents apart (lane efficiency experiment, diary 2026-10-13 §7).

Usage: python3 -I internal/tools/lane-burn.py [SINCE] [LANE...]
SINCE: an ISO hour prefix in UTC, default today; LANE: lane directory substrings, default the three lanes of 12 October.
Reads ~/.claude/projects/*lanes-<lane>*/**/*.jsonl; sums input, cache read and cache creation tokens of each assistant
message. No model calls, nothing written.
"""
import collections
import datetime
import glob
import json
import os
import sys

root = os.path.expanduser("~/.claude/projects")
since = sys.argv[1] if len(sys.argv) > 1 else datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT00")
lanes = sys.argv[2:] or ["core-reads", "ui-revamp", "bulk-refactor"]
for lane in lanes:
    dirs = glob.glob(f"{root}/*lanes-{lane}*")
    if not dirs:
        print(f"== {lane}: no session directory")
        continue
    hours = collections.defaultdict(lambda: dict(main_turns=0, main_ctx=0, sub_turns=0, sub_ctx=0, peak=0, models=collections.Counter()))
    for path in glob.glob(dirs[0] + "/**/*.jsonl", recursive=True):
        issub = "subagents" in path
        with open(path, encoding="utf-8", errors="replace") as fh:
            for line in fh:
                if '"usage"' not in line:
                    continue
                try:
                    x = json.loads(line)
                except ValueError:
                    continue
                m = x.get("message") or {}
                u = m.get("usage") if isinstance(m, dict) else None
                if x.get("type") != "assistant" or not u:
                    continue
                ts = x.get("timestamp", "")[:13]
                if ts < since:
                    continue
                c = (u.get("input_tokens") or 0) + (u.get("cache_read_input_tokens") or 0) + (u.get("cache_creation_input_tokens") or 0)
                h = hours[ts]
                if issub:
                    h["sub_turns"] += 1; h["sub_ctx"] += c; h["models"][m.get("model", "?")] += 1
                else:
                    h["main_turns"] += 1; h["main_ctx"] += c; h["peak"] = max(h["peak"], c)
    print(f"== {lane}")
    for ts in sorted(hours):
        h = hours[ts]
        print(f"{ts}Z main turns={h['main_turns']:4d} ctx={h['main_ctx']/1e6:7.1f}M peak={h['peak']/1e3:4.0f}k | "
              f"subagent turns={h['sub_turns']:4d} ctx={h['sub_ctx']/1e6:7.1f}M {dict(h['models'])}")
