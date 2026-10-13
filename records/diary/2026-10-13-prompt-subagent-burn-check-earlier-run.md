# Prompt: did the earlier run burn context the same way? (for the performance evaluation project)

Written 13 October 2026 by the orchestrator for Max to run in a chat of
`~/projects/maxEfficiencyKnowledgeBase/MaxHyperVisaFullPortalImplementationOpus5.5-performance` (or the performance
project of the run he names). Fill the two placeholders before use. Read-only; no model calls in the script.

---

You are the performance evaluator for an earlier agent run. Question to answer with evidence: did that run show the
same context burn pattern that was measured on 13 October 2026 in the TravelMudra lanes, namely (a) subagents
running on the parent model (Opus or Fable) because the Agent tool inherits the parent model when `model` is
omitted, (b) subagents carrying 200k to 400k context tokens per turn, and (c) a main chat running above 300k
context for long stretches? On 13 October 2026 one lane ran 141 subagents, all Opus, at 300k to 400k context each,
about 8.3 billion context tokens in a day; two lanes together about 10 billion, 69 percent of a weekly 20x limit.

Run to assess: RUN = <name of the run, as Max calls it>. Window: FROM = <YYYY-MM-DD>, TO = <YYYY-MM-DD> (UTC dates).

Rules: read only. Touch nothing in the assessed project. Do not start subagents for this; one script does the work.
Keep your own context under 100k; write results to files, not into the chat. Run Python with `python3 -I`.

Steps:

1. Find the session directories: `ls -d ~/.claude/projects/*/` and, for Codex, `~/.codex/sessions/`. Pick the
   directories whose transcript files (`*.jsonl`, including `*/subagents/*.jsonl`) were modified inside the window
   and whose path names the run's project. List them in the report with file counts. If none match, say so and
   stop: "unknown" is the answer, not zero.
2. Run this script on the chosen directories (save it as `tools/subagent-burn.py` in the performance project):

```python
#!/usr/bin/env python3
"""Per session: main chat and subagent context tokens, turns, peak, model mix. Usage: subagent-burn.py FROM TO DIR..."""
import collections, glob, json, os, sys
since, until, dirs = sys.argv[1], sys.argv[2], sys.argv[3:]
rows = collections.defaultdict(lambda: dict(main_turns=0, main_ctx=0, main_peak=0, subs=set(), sub_turns=0, sub_ctx=0,
                                            sub_over_200k=0, models=collections.Counter(), parent_model=collections.Counter()))
for d in dirs:
    for path in glob.glob(d.rstrip('/') + '/**/*.jsonl', recursive=True):
        parts = path[len(d.rstrip('/')) + 1:].split('/')
        issub = 'subagents' in parts
        session = parts[0][:8]
        r = rows[(os.path.basename(d.rstrip('/'))[-40:], session)]
        with open(path, encoding='utf-8', errors='replace') as fh:
            for line in fh:
                if '"usage"' not in line:
                    continue
                try:
                    x = json.loads(line)
                except ValueError:
                    continue
                m = x.get('message') or {}
                u = m.get('usage') if isinstance(m, dict) else None
                if x.get('type') != 'assistant' or not u:
                    continue
                day = x.get('timestamp', '')[:10]
                if day < since or day > until:
                    continue
                c = (u.get('input_tokens') or 0) + (u.get('cache_read_input_tokens') or 0) + (u.get('cache_creation_input_tokens') or 0)
                if issub:
                    r['subs'].add(path); r['sub_turns'] += 1; r['sub_ctx'] += c; r['models'][m.get('model', '?')] += 1
                    if c > 200_000:
                        r['sub_over_200k'] += 1
                else:
                    r['main_turns'] += 1; r['main_ctx'] += c; r['main_peak'] = max(r['main_peak'], c)
                    r['parent_model'][m.get('model', '?')] += 1
print('project | session | main turns | main ctx | main avg | main peak | parent model | subagents | sub turns | sub ctx | sub avg | sub turns >200k | sub models')
for (proj, sess), r in sorted(rows.items(), key=lambda kv: -(kv[1]['main_ctx'] + kv[1]['sub_ctx'])):
    if r['main_turns'] + r['sub_turns'] < 20:
        continue
    print(f"{proj} | {sess} | {r['main_turns']} | {r['main_ctx']/1e9:.2f}B | {r['main_ctx']/max(1,r['main_turns'])/1e3:.0f}k | "
          f"{r['main_peak']/1e3:.0f}k | {dict(r['parent_model'])} | {len(r['subs'])} | {r['sub_turns']} | {r['sub_ctx']/1e9:.2f}B | "
          f"{r['sub_ctx']/max(1,r['sub_turns'])/1e3:.0f}k | {r['sub_over_200k']} | {dict(r['models'])}")
```

3. Write `telemetry/<FROM>_<RUN>_subagent-burn.md` with: the table from step 2; the totals for the run (context
   tokens, subagent share in percent, subagent count, share of subagent turns on the parent model, share of
   subagent turns above 200k, main chat peak); and one verdict per pattern (a), (b), (c): present, absent or
   unknown, each with the numbers that support it. Compare with the 13 October 2026 reference figures above in
   one short paragraph. Name what the script cannot see (Codex sessions if any, sessions whose transcripts were
   deleted, work done outside this machine).
4. Report to Max in under 200 words: the three verdicts and the file path. No recommendation unless the evidence
   shows a pattern; then one sentence on the fix already in force (lane briefs and prompts carry the subagent rule
   with numbers, `model` passed explicitly, a hook refuses subagent calls above 280k).
