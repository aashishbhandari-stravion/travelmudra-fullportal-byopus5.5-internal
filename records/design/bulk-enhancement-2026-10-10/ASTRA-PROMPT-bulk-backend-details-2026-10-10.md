# Prompt for Astra: bulk upload backend details not recoverable from the records

Written 10 October 2026 by the Opus architect for Max. Max pastes the block into the Astra (Codex) parent chat
of `MaxHyperVisaFullPortalImplementationAstraGPT6`. The Opus architect read Astra's records first (see
`ASTRA-BULK-BACKEND-REFERENCE-2026-10-10.md` §1); the block asks only for what those records do not answer.

```text
Astra, this is a read-only documentation task for Max. Do not change product code, tests, configuration,
runtimes or deployments. Do not run a workload. Write one private record,
internal/records/bulk-backend-handover-for-opus-2026-10-10.md, commit it in the private repository with a
public-fit message, and stop. Max relays it. Cite every fact by repository, commit and record path or code
line. Mark inference as inference. Short sentences. No praise. 150 to 300 lines.

The reader has already read: BULK_UPLOAD_AS_IMPLEMENTED_LLD_2026-10-06.md, the two 6 Oct debug records,
bulk-upload-repair/invariants/stable-v1, bulk-upload-owner-review-2026-10-07.md,
bulk-optimizations-2026-10-07.md, bulk-document-processing-baseline-2026-10-07.md, the integrated
improvement plan/execution/manual-check, every file in records/bulk-concurrency-2026-10-08/ (including
the architect review, both parallel-acquisition reviews and the two relay prompts), TM-BUG-001 to 020,
docs/bulk-*.md, and in the parallel-acquisition lane: records/*, output/design-parallel-acquisition.md,
output/verification-report.md, output/portable-learnings.md, output/proposals/route2-fetch-daemon-concurrency.md.
Do not restate them. Answer these questions:

1. State after 9 October 09:26. Did the B5 reference rerun of candidate 455badd run? If yes: effective
   configuration, per-gate result against verification-report.md "B5 acceptance", event log and metrics
   report locations with SHA-256. If no: say so in one line. List any commit in either lane after 455badd
   and 9689ce3, and any product or private commit after be30e73 / 730ab7c.

2. The frozen candidate for UAT. Name the exact commit Max should treat as the bulk upload experience to
   freeze: main be30e73, or lane 455badd (which includes 9689ce3). State what stands between 455badd and
   integration into main (review state, open P1s, the harness preflight, docs). State whether the
   instrumentation of 9689ce3 (bulk_metrics, stage events) is meant to stay in the product or is
   experiment-only.

3. Max's decisions given in chat that no record attributes to him with his words: the spreadsheet row
   limit 100 to 500 (first Bulk commit, 6 Oct), the folder file limit 200 to 500 (91c5469), the move from
   2/4 to 10/20 for the experiment, and the "Stable V1 brief" text (100 applicants / 500 documents). Quote
   the chat decision and date for each, or state that the number was the implementer's choice.

4. Alternatives considered and rejected, with the reason at the time: a central queue or orchestrator
   service instead of process-owned file-slot locks and run_pending passes; a per-TA admission or
   fairness rule instead of per-read rotation; reserving slot 0 for discovery instead of discovery
   priority; one error code fetch_busy for three conditions (Core lock, member owner, source owner).
   Also: what would you do differently with hindsight, in at most ten lines. Max calls this a prototype,
   not the optimal implementation; he wants the lessons, not the code.

5. Real-run observations not in the curated reports. From the 8 Oct archive
   (~/retained-evidence/TravelMudra/bulk-concurrency-2026-10-08, expires 8 Nov 2026) and the 7 Oct
   previews: per-tenant timeline of first and last document, Store busy events over time, OCR page count
   distribution, and anything you observed about Google Drive or Sheets behavior (rate limits,
   interstitials, export variants, listing pagination) that a new implementation must plan for. Confirm
   or correct the table of fifteen runs in the reader's evidence summary if Max shows it to you; add any
   real run that is missing (for example 9 Oct tests).

6. Parallel same-TA case. Was "two groups of one TA read the same folder at the same time" ever run on
   real data? If only tests exist, name them. State the expected behavior at the content lock
   (content_busy, 2 s retry) in user-visible terms.

7. Route 2. State the status of output/proposals/route2-fetch-daemon-concurrency.md and whether the
   production boundary is intended to be route 2. If yes, the parallel acquisition result does not hold
   until the daemon is concurrent; say so plainly.

8. Durability. The parallel-acquisition lane's output/ folder (design, verification report, portable
   learnings, patch, MANIFEST.json) is not in any repository, and TRACKER.md has an uncommitted edit.
   Propose to Max the smallest step that makes them durable (promotion into the private repository with
   hashes), without doing it unless he says so.

Do not propose work for the Opus project. Do not change scope. If a question has no answer in your
context or evidence, write "not recorded" for it.
```
