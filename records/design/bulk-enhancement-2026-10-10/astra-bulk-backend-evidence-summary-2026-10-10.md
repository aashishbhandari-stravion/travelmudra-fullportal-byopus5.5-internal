<!-- Origin: evidence extraction by a Claude Sonnet subagent of the Opus architect session on 10 October 2026,
read-only, over the Astra project records named in the source key. Reviewed by the architect against the
records read directly (owner review, optimizations, concurrency experiment report, architect review,
parallel-acquisition review, TM-BUG-017 to 020). Paths under ~/workDirectory are working-tree lane locations,
not durable citations; the durable copies are in the Astra private repository
MaxHyperVisaFullPortalImplementationAstraGPT6/internal at commit 730ab7c (records/bulk-concurrency-2026-10-08/)
and the Astra product repository at be30e73 (main), 9689ce3 and 455badd (lane branches, not integrated). -->

# Astra bulk upload backend: evidence summary

Subject: TravelMudra "Astra" implementation, bulk intake backend. Read-only extraction from records. Written 10 October 2026 (IST).
Status of evidence: records only. Nothing was run. Inference is marked "(inference)".

## Source key and path roots

| Short | Meaning |
| --- | --- |
| R | `/home/max-stravion/projects/Critical/MaxHyperVisaFullPortalImplementationAstraGPT6` (main, HEAD be30e73; records under `internal/records/`) |
| LC | `/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationAstraGPT6/lanes/bulk-concurrency-2026-10-08` (branch `codex/bulk-concurrency-experiment`, HEAD 9689ce3) |
| LP | `.../lanes/bulk-parallel-acquisition-2026-10-08` (branch `codex/bulk-parallel-acquisition`, HEAD 455badd) |
| LB | `.../lanes/b-bulk-intake` (branch `codex/bulk-intake`, final 9e3fc0d, 6 Oct) |
| LLD | `internal/records/BULK_UPLOAD_AS_IMPLEMENTED_LLD_2026-10-06.md` |
| DBG / SHEET | `bulk-upload-debug-2026-10-06.md` / `public-sheet-upload-debug-2026-10-06.md` |
| INV / REP | `bulk-upload-invariants-2026-10-06.md` / `bulk-upload-repair-2026-10-06.md` |
| V1 / OWN | `bulk-stable-v1-2026-10-06.md` / `bulk-upload-owner-review-2026-10-07.md` |
| OPT | `bulk-optimizations-2026-10-07.md` |
| PLAN / EXEC / MAN | `bulk-integrated-improvement-plan / -execution / -manual-check-2026-10-07.md` |
| BASE | `bulk-document-processing-baseline-2026-10-07.md` |
| CONC-* | LC `records/{report,plan,changes,issues,benefits,optimizations,review,preservation}.md`; `latency-throughput-analysis.md` is only in `LC/private-records/records/bulk-concurrency-2026-10-08/` and R `internal/records/bulk-concurrency-2026-10-08/` |
| ARCH | `LP/records/independent-architect-review-2026-10-08.md` (copy in R `internal/records/bulk-concurrency-2026-10-08/`) |
| REV1 | `LP/records/independent-review-parallel-acquisition-candidate-2026-10-08.md` |
| DREV | R `internal/records/bulk-concurrency-2026-10-08/independent-delta-review-parallel-acquisition-455badd-2026-10-09.md` |
| RELAY2 | R `internal/records/bulk-concurrency-2026-10-08/relay-prompt-2-review-outcome-and-b5-2026-10-09.md` |
| PROMPT / CDELTA | `LP/records/lane-prompt.md` (R1 to R14) / `LP/records/concurrency-delta-2026-10-08.md` |
| DES / VER / RES | `LP/output/design-parallel-acquisition.md` / `verification-report.md` / `delta-review-resolutions.md` |
| LBH | `LB/output/handoff/bi01-20261006/HANDOFF.md` |
| TRK | `internal/records/portal-issues/TRACKER.md` and `TM-BUG-nnn.md` |
| DOC-I / DOC-P / DOC-D | `docs/bulk-intake.md` / `docs/bulk-processing.md` / `docs/bulk-diagnostics.md` |
| CODE | R `travelmudra/*.py` at HEAD be30e73 (main) |

Branch state (git, read-only): R `main` HEAD = be30e73 and contains 91c5469, cc7b421, d8b3412, b7e35fd, be30e73. LC adds one commit (9689ce3) not in main. LP adds four commits (ef79dc4, 516a3fe, 9f4aee4, 455badd) on top of 9689ce3, not in main. Docs `docs/bulk-*.md` in LC equal main. Docs in LP differ only in `docs/bulk-processing.md` (fetch slots, waits, 400 budget, metrics; verified by diff).

Naming note: the bulk code in main is `travelmudra/bulk_*.py`. There is no "BUILD_SPEC" number for most bulk limits. `BUILD_SPEC.md` B38 is the only capacity rule (see section 3).

## 1. Timeline (dates 2026, IST unless stated)

| Date | Decision or change | Source |
| --- | --- | --- |
| 5 Oct | Lane B (`b-bulk-intake`) created for Bulk Intake bounded context, branch `codex/bulk-intake`, base 0b2c982. | `LB/workspace.json` (created 2026-10-05T17:26Z) |
| 5-6 Oct | Lane B decisions: per-candidate/service Draft units; durable read intents; scanner policy reused; Route 2 fails closed (`bulk_processor_protocol`). | `LB/output/workstreams/B-bulk-intake/DECISIONS.md` D06, D07, D09 |
| 6 Oct 00:39 to 10:25 | Lane B commits cdc03e8, d8bdfd3, c5fd2ef, fe7ffc9, 9e3fc0d (24 additive files). Lane B tests: 102 passed; synthetic 200-file journey (199 accepted, 1 unavailable). No live Google test. | `git log`; LBH "Final test and synthetic journey evidence", "Deferred validation" |
| 6 Oct 11:32 to 12:05 | Bulk composed into Group workspace (f4ced8a, 81bd8e3); baseline ef7fede. | `git log` |
| 6 Oct (evening) | Four P0 bugs diagnosed on baseline ef7fede, port 4546: (1) parser contention becomes terminal read failure, (2) Drive navigation counted as files, (3) Sheet edit-page HTML fed to CSV parser, (4) same read key bound to different bytes (operation_conflict). | DBG; SHEET; LLD section 11 |
| 6 Oct | As-implemented LLD written for baseline ef7fede. | LLD header |
| 6 Oct | Repair candidate: per-read process flock owner, durable retained fetch, provider-aware Sheet/Drive, diagnostics script `bin/bulk-diagnostics`. 139 passed. Real Sheet and Drive runs in isolated preview 4556. | REP "Verification", "Real-input outcomes" |
| 6-7 Oct | Stable V1 brief (Max): oracle, OCR, 4 global/2 per-read slots, 500-file inventory, retention, lossless audit compression. Max declared the third Sheet row a recovery-positive case and required explicit name confirmation (no automatic alias match). | V1 "Progress and owner oracle update" |
| 7 Oct 09:11 | 91c5469: repair of source ownership, durable snapshots, recovery. MAX_FILES 200 to 500; processing slots 2-4. | `git log`; `git show ef7fede/91c5469` (code) |
| 7 Oct 10:05 | cc7b421: warm ClamAV daemon reuse; single-worksheet public Sheet CSV acquisition. Max authorized scanner reuse and scoped Sheet acquisition. | OPT "Explicit authority", "Mainline disposition" |
| 7 Oct | Max: "Merge these changes to Mainline and update bug status." TM-BUG-012 closed; TM-BUG-013 worksheet scope accepted. | TRK Bulk optimization audit; TM-BUG-012 |
| 7 Oct | Max requested TM-BUG-014 (hash dedup), 015 (group progress, 30 s refresh), 016 (rerun/delta rules). Then approved one coordinated plan with 8 binding amendments (kill switch, per-TA scope, origin privacy). | PLAN section 2; TM-BUG-014..016 |
| 7 Oct 19:56 | b7e35fd: extraction reuse, accepted runs under group, rerun reconciliation. | `git log`; EXEC |
| 7 Oct 21:06 | be30e73: Store `busy` stays retryable (P1 found live: 83 members marked unavailable). 359 tests passed. | EXEC "Normal Drive result and capacity-path finding", "Final repair gate" |
| 7 Oct | Baseline document: 12-step document path; defaults 2 workers per read, 4 shared slots, 1 download at a time; ten-worker proposal assessed. | BASE |
| 8 Oct 05:28Z | Lane LC created from be30e73. Max approved: 10 workers per read, 20 shared slots, two TAs submit same 88-file Drive folder together. | `LC/workspace.json`; CONC-plan "Authority and scope" |
| 8 Oct ~11:30 | Experiment run `20261008-113052-7225b38a`; candidate 9689ce3. Both reads ready; P1 acceptance gap (no 90% throughput proof). | CONC-report; CONC-review |
| 8 Oct 13:07 | Latency analysis: per-user latency worse, aggregate rate about unchanged. | `latency-throughput-analysis.md` |
| 8 Oct 14:00 | Independent architect review (Claude): root cause = fetch-lock polling with 5 s give-up (F1), two pass barriers (F2), discovery starvation (F3). Max accepted root cause. | ARCH sections 2, 6, 11 |
| 8 Oct | Max decisions: parallel downloaders wanted; retry-history rows not acceptable; run verification on Max's machine; inherited "one fetch worker, one parser" superseded, configurable to 20 (R14). | `goku-lane-prompt...md` (copy in LP/records) "Decisions by Max"; CDELTA |
| 8 Oct 17:14 to 17:58 | Lane LP created from 9689ce3; commits ef79dc4, 516a3fe, 9f4aee4. | `LP/workspace.json`; `git log` |
| 8 Oct | Independent review of 9f4aee4: no P0; P1-1 (Core `/intake` waits up to 120 s), P1-2 (100-item round barrier), P1-3 (70% utilization gate unreachable with reserved slot 0). 766 passed, 6 skipped. Max also raised the ten-TA burst (TM-BUG-017) and the 100-subfolder case (TM-BUG-018). | REV1; TM-BUG-017; TM-BUG-018 |
| 9 Oct 08:38 | Max decisions in RELAY2: round cap to 1-400; member-slot utilization gate; Core web-path wait deferred (TM-BUG-017). | RELAY2 items 1-3 |
| 9 Oct 09:12 | LP commit 455badd (400 budget, member utilization, attempt clamp min(100, remaining)). Full suite 732 passed + 38 follow-up. Lane stopped at step b. | VER; RES |
| 9 Oct | TM-BUG-019 (declared document set) and TM-BUG-020 (MRZ-first OCR, 10-page rejection, 2-page identity limit) recorded, deferred until after the parallel-acquisition test. | TM-BUG-019, TM-BUG-020; TRK audit |
| 9 Oct 18:18 | Delta review of 455badd: no P0, no P1; 770 passed, 6 skipped. "Ready for Max's B5 decision." | DREV "Verdict" |
| 9 Oct 09:26 to 10 Oct | No later file in LP or LC. B5 reference rerun not recorded (see section 8). | file mtimes; VER "B5 acceptance - not executed" |

## 2. Architecture as implemented

Two states exist. "Main" is be30e73. "LP" is the unintegrated parallel-acquisition candidate 455badd.

### 2.1 Orchestration and work assignment

| Topic | Fact | Source |
| --- | --- | --- |
| Central orchestrator? | No coordinator service. A host worker loop calls `bulk_worker.run_pending(limit=10)` repeatedly; sleeps 2 s only when idle. Browser "Continue" calls the same `continue_read`. | CODE `cli.py:129-146`; LLD section 6.2; BASE "How N documents execute today" |
| Read selection | `run_pending` selects current-epoch reads in `pending`/`reading`/`partial`; `fair_batch` rotates a cursor and picks at most `min(limit, TM_BULK_PROCESSING_SLOTS)` = 4 reads per pass. Work budget split `limit // len(batch)` plus remainder. Related (child) reads are excluded from the top list. | CODE `bulk_worker.py:12-50`; REV1 finding table; TM-BUG-017 |
| Readers | One owner per read: non-blocking flock `read-locks/<read>` encloses acquisition, parse, snapshot attach, file continuation. Overlapping callers receive current progress. No pool of "readers" for folder discovery: one sequential loop, one fetch per listing. | INV "Invariants" row 1; CODE `bulk_read.py:288-292`; TM-BUG-018 "Current behaviour" |
| Member workers | `_continue_owned` submits up to `limit` members to a thread pool of `per_read` threads (default 2). Pool joined before the read reconciles (barrier 2). `run_pending` joins the read pool (barrier 1). | CODE `bulk_read.py:443`; ARCH section 4 |
| Document owner | Per document: flock `read-locks/file-<sha256(source_id:file_key)>`. Snapshot-level and member-level locks also cover separate link-read IDs and the direct file route. | CODE `bulk_evidence.py:518-525`; INV row 1; REV1 |
| Where a document lives | A member thread normally stays in `extract_file` from admission to saved result (download, scan, extract or reuse, commit). Processing slot released before final result transaction. | BASE "How N documents execute today" items 4-7 |
| Removed in LP | Fixed batches and joins replaced by streaming (`FIRST_COMPLETED` refill) and a thread-safe shared budget reserving at least `per_read` tokens per selected read; discovery and `retry` outcomes consume no member budget. | DES "Streaming and shared budget" |

### 2.2 Source reading, acquisition, scanning, extraction

| Stage | Behaviour | Source |
| --- | --- | --- |
| Source types | Uploaded XLSX, public Google Sheet (CSV; one worksheet, `gid` selects tab, none = first tab), public Drive folder (optionally with a related Sheet/XLSX). Sheet hyperlink/rich-text/smart-chip links are NOT supported (only URL text in cells). | LLD section 1; OPT "Design and issue trail"; TM-BUG-013 "Final result" |
| Accept | `prepare_read` persists intent plus operation receipt in one transaction; no network. | LLD section 6.1 |
| Sheet fetch | Validated Google export; HTML/login response rejected before CSV parse (fixes BUG 3). Retained bytes with SHA-256 and size are durable before parse. | INV rows 12, 17; OPT |
| Folder discovery | Restricted parser reads the encoded Drive entry inventory (not anchor links). Crawl is sequential: one `retained_fetch` per listing, then restricted parse of each listing under a processing slot. Limits 128 listings, depth 3, 500 files. | INV row 18; TM-BUG-018 |
| Document download | `sources.fetch_public` runs one `bwrap` child under a single non-blocking `fetch.lock` (one download at a time per runtime). Main: waiters poll every 100 ms, give up after 5 s with `fetch_busy`. | CODE `bulk_fetch.py:104-117`; ARCH F1; BASE |
| Scanner (current) | One ClamAV daemon (`clamd`) per runtime and signature generation, network-isolated, started by a dedicated supervisor thread, one fresh Unix INSTREAM connection per document, 4 scanner threads, 4-request queue; lifetime lock allows one engine. Warm. | OPT "Design", "Real-data-discovered scanner lifetime defect"; BASE "Scanner invariant"; DOC-P "Scanner reuse" |
| Scanner (before 7 Oct) | A fresh `clamscan` process per document. Startup 1,045 cumulative worker-seconds over 86 documents (about 12.1 s each). | OWN "Why the 88-file run took about 19 minutes" |
| Scanner startup count | 1 initialization in each later run: 11.4 s (8 Oct, 220 scans); about 13.411 s (7 Oct Drive first run); 0 in the rerun. | CONC-report "Major stage timings"; BASE "Scanner invariant" |
| Extraction | Restricted offline child (bwrap, no network) after a clean scan. PDF: native text first; image-only pages rasterised (`pdftoppm`) then Tesseract; images OCR over 4 orientations, each with a full-page and an MRZ-strip pass. | DOC-P; BASE step table; TM-BUG-020 "Current behaviour" |
| OCR/extraction threads | No dedicated OCR thread pool. Parallelism = parser children under processing slots (main 4 global, 2 per read; LC 20 global, 10 per read). | CODE `bulk_capacity.py:12-21`; CONC-plan |
| Result | Clean scan, readable text and applicant association are separate facts. Drafts are created by Core, never submitted. Document failures leave the Draft intact. | LLD section 1, section 9 |

### 2.3 Hashing and duplicate detection

| Question | Answer in records | Source |
| --- | --- | --- |
| What is hashed, when | Full SHA-256 and byte length of the retained bytes at acquisition, before scanning (integrity). The scanner verdict is bound to the retained expected digest; scan and parser read the same sealed descriptor. | PLAN section 4 "Scan and collision boundary"; OPT "Design"; TM-BUG-014 "Current evidence" |
| Dedup after scan | After a clean scan of the incoming bytes, lookup by (TA account, SHA-256, length, extraction-profile ID) in a SQLite expression index `bulk_content_v1`; at most 32 candidates (`BUCKET_LIMIT`); exact-byte comparison against each candidate; equal digest and length but unequal bytes = `content_conflict` (fresh extraction). Disagreeing candidates = `reuse_inconsistency` (fresh extraction). | DOC-P "Compatible extraction reuse"; CODE `bulk_content.py:22-28` |
| Scope | Per TA account, across that TA's groups. Not per group. Not global. Another TA never reuses. | PLAN section 2 "Reuse scope"; CONC-report ("Reuse cannot cross TA accounts") |
| What reuse skips | Extraction (OCR/parser). It still does download, fresh malware scan, exact-byte check, commit. | BASE "Executive assessment" |
| Eligibility | Only committed, complete, readable proposals. Failed, partial, time-limited results are never reused. Profile covers worker code, libraries, OCR binary, options, limits. | PLAN section 4; DOC-P |
| Switch | File `<runtime>/bulk-reuse.disabled` disables reuse at once; no restart. | MAN "Extraction reuse rollback"; DOC-P "Disable and re-enable" |
| Inventory-level dedup | Repeated locators/Drive file IDs inside one inventory are deduplicated. Sheet row references are kept as aliases (`occurrences`). | TM-BUG-014 "Current evidence"; INV row 18; PLAN count table |
| Applicant-level duplicate guard | Core rejects an open duplicate by group + service + passport. This is separate from byte dedup and is not an identity merge key. | PLAN section 1 table "Application correctness"; BUILD_SPEC B03 |
| Not hashed | Names, URLs, extracted text. | TM-BUG-014 proposal 2 |

### 2.4 Reruns and parallel reads of the same source

| Case | Behaviour | Source |
| --- | --- | --- |
| Same operation key, same command | Returns the original snapshot; no refetch; zero new attempts/Drafts. | LLD section 10; PLAN section 5 table |
| Same key, different content | `operation_conflict` guard kept deliberately. | SHEET "P0: Repeated fetches"; INV row 3 |
| New unchanged submission | New read, new frozen inventory, scan again, reuse eligible extractions, pinned comparison against a prior same-group ready read; Drafts reconciled, not duplicated. Real result: Drive rerun 75 reused, parser calls 86 to 11, 0 new applications. | MAN "Verified results"; EXEC "Final real Drive journey" |
| Added or smaller folder | Delta (unchanged/added/changed/absent/unresolved); absent files never delete applications or documents. Truncated or partial inventories give no "absent" conclusions. | DOC-I "Accepted runs, comparison and reconciliation" |
| Two groups, same folder, same TA, parallel | Separate reads and snapshots (folder root ID hashes group, URL, generation, root bytes), so member locks differ. Equal bytes serialize through the content lock keyed (account, SHA-256, size, profile): one effective producer; others get `content_busy` and retry after 2 s (waiting, not failure). No real-run record. Covered by deterministic tests only. | LLD section 4 "Important identities"; DOC-P "Lock order..."; PLAN section 8 matrix |
| Two groups, same folder, two TAs, parallel | Real run 8 Oct: independent reads, zero reuse, 176 downloads and 176 document decisions. Shared global download lock caused group 2 to start document work 441.166 s after submission. | CONC-report "Results", "Why twenty configured workers..." |
| Same-TA Sheet after Drive | First Sheet read reused 8 of 9 documents from the same TA's Drive group. | EXEC "Final Sheet journey and completion" |

### 2.5 Race conditions found and how fixed

| ID | Race or defect | Fix | Source |
| --- | --- | --- | --- |
| BUG 1 (P0) | Browser Continue and worker both run the read; `parser_busy` written as terminal `failed`; first reader then rejected with `read_state`. | Per-read flock owner; overlap returns progress; contention retryable. Test: 40 simultaneous continuations. | DBG; INV row 1, 4 |
| BUG 4 (P0) | Both readers refetch a mutable URL under `<read>:snapshot:<generation>`; fingerprint mismatch gives `operation_conflict`. | Retained-fetch stage: one GET per accepted read; bytes durable first; guard kept. | SHEET; INV row 2, 3 |
| Reviewer P0s (6 Oct) | Snapshot crash windows; identity conflicts; failed-fetch 10 MB reservation leak; stale fetch-failure cleanup. | Targeted fixes plus regressions; shared snapshot/member lock (P1). | INV "Independent review" |
| Scanner lifetime (P1) | Daemon spawned by short-lived thread was killed by Linux parent-death signal; repeated cold starts. | Dedicated supervisor thread holds the daemon. | OPT "Real-data-discovered scanner lifetime defect" |
| Store `busy` (P1) | Under 237 sources, 732 stages, about 88.6 MB source JSON, capacity check decoded whole records inside the write transaction; 83 members saved as unavailable. | Compact projection; `busy` stays pending; 2 s advisory backoff. | PLAN section 10; EXEC "Frozen Bulk contention repair" |
| Processing-adapter attestation (P1) | Replaced `run_child` alias gave same profile; wrong reuse. | Reject unknown bindings; disable reuse for replacements. | EXEC "Processing adapter attestation finding" |
| Invalid-link inventory (P1) | `source_link_invalid` ignored by completeness predicates; false absence conclusions. | Include link issues in reliability checks. | EXEC "Independent frozen-candidate finding" |
| Lock polling starvation (P1, unfixed in main) | 10 member pollers vs 1 discovery poller; 5 s give-up; 454 of 644 attempts `fetch_busy`; group 2 lost 25 consecutive passes. | Fixed only in LP (slots, blocking wait, slot 0 for discovery, streaming). Not integrated. | ARCH F1-F3; DES |
| Budget starvation (P0, LP design) | At 20/10 the 20-item budget was filled by two first waves; no refill. | Budget = min(400, max(10, 2 x global x per_read)). | DES "Scope and verification" |
| Attempt API clamp (P0, LP) | 400 budget passed to the 1-100 attempt API gave `invalid_limit`. | `min(100, remaining)` in `bulk_worker`. | RES "P0 found while applying..." |

## 3. Configuration and limits

Columns: BUILD_SPEC or first-config value | later value and who set it | current default in main (be30e73) | LP candidate 455badd.
"Max relaxed" is stated only where a record names a Max decision. Otherwise the origin is "code history" or "record does not name a decision".

| Limit | BUILD_SPEC / initial config | Relaxed to (decider) | Main default now | LP candidate |
| --- | --- | --- | --- | --- |
| Fetch workers (downloads at once) | "One active fetch and one parser" first (BUILD_SPEC B38, `internal/records/dib1/inputs/BUILD_SPEC.md` line 89; R `BUILD_SPEC.md` line 89). `docs/architecture.md:40` "one fetch worker". | Max 8 Oct: superseded; configurable up to 20 (CDELTA R1, R13, R14). | 1 (single `fetch.lock`). | `TM_BULK_FETCH_SLOTS` default 4, range 1-20; `TM_FETCH_WORKERS` default 1, 1-20 (Core). |
| Parsers (Core source parser) | One offline parser (same sources). | Same Max delta. | 1 (`parser.lock`). | `TM_PARSER_WORKERS` default 1, 1-20. |
| Bulk processing slots (scan+extract) | Not in BUILD_SPEC. | 2-4 range in code (91c5469). Max approved 20 for the 8 Oct experiment only. | `TM_BULK_PROCESSING_SLOTS` default 4, range 2-4. | default 4, range 1-20. LC range 2-20. |
| Per-read member workers | Not in BUILD_SPEC. | Max approved 10 for experiment only. | `TM_BULK_PER_READ_SLOTS` default 2, must be < global. | default 2, range 1-20, clamped to global-1. LC range 1-10. |
| Readers (concurrent reads) | No BUILD_SPEC value. | None recorded. | `min(limit, global slots)` = 4 reads per pass; one owner per read. | LP: budget-driven; 20 at 20/10 (DREV P2-D1). |
| Work budget per pass (round) | No BUILD_SPEC value. | Max 9 Oct: cap raised to 400 (RELAY2 item 1; RES P1-2). | `run_pending(limit=10)` called by `cli.py:135`; range 1-100. | `scheduler_limit()` = 10 at defaults, else `min(400, max(10, 2 x global x per_read))`; 400 at 20/10. LC: `max(10, global)` = 20. |
| Attempt continuation | n/a | n/a | 1-100 units. | Unchanged 1-100; worker passes `min(100, remaining)`. |
| Fetch wait | n/a | n/a | Poll 100 ms, give up after 5 s (`bulk_fetch.py:104-117`). | `TM_BULK_FETCH_WAIT` default 120 s, range 10-600; 50 ms scan fallback. |
| Processing wait | n/a | n/a | None: `parser_busy` immediately. | `TM_BULK_PROCESSING_WAIT` default 60 s, range 5-300. |
| Retries | "Nth identical retry resolves ... without duplicate" (B16). | n/a | No count cap on `fetch_busy`/`parser_busy`/`busy` retries per pass; Store retry advisory backoff 2 s; content wait `retry-not-before` 2 s; unit retry explicit. | HTTP 429/503: up to 4 child attempts, backoff 2, 4, 8 s (cap 30 s); exhaustion stays retryable. |
| Folder files | n/a (not a BUILD_SPEC number) | 200 at ef7fede (6 Oct) to 500 at 91c5469 (7 Oct); tied to Max's Stable V1 "100 applicants/500 documents" evaluation (V1 item 6, "Final verification"). | `MAX_FILES` 500, `MAX_LINKED_FILES` 500. | same |
| Folder listings / depth | n/a | 128 listings added 7 Oct; depth 3 unchanged. | `MAX_FOLDERS` 128, `MAX_FOLDER_DEPTH` 3. (LLD says 200 and depth 3 for the 6 Oct baseline.) | same |
| Spreadsheet rows | Initial config: 100 rows (`docs/architecture.md:40`, `local-capacity.md:12`). | Bulk parser allows 500 data rows from first Bulk commit (6 Oct, `git show ef7fede`); no record names a Max decision for it. | CSV up to 500+30 rows; XLSX up to 530 rows, 64 columns; cell 500 chars. | same |
| Source/spreadsheet bytes | 10 MiB (architecture.md:40). | none | 10 MiB per source/download/export. | same |
| Applicant document bytes | 5 MB each (BUILD_SPEC B15, line 39). | none | 5 MiB. | same |
| Workload bytes | 100 MiB aggregate intake (architecture.md:40). | none | 100 MiB document bytes per workload. | same |
| Retained evidence | 512 MiB temporary (architecture.md:40). | none | 512 MiB per installation; also tabular-source check 512 MiB and >1 GiB free disk. | same |
| Scanner | 45 s scan (local-capacity.md:12). | Daemon: startup 45 s, request 45 s, server scan 30 s, 2 GiB address space, 4 threads, 4-request queue. | same | same |
| Parser/extraction | 30 s parse deadline; 512 MB parser address space (local-capacity.md:12). | Bulk child 30 s, 768 MiB, 25 CPU-s; extraction budget 24 s; PDF 30 pages; image 20 million pixels; 8,000 chars/page; preview 50,000 chars. | same | same |
| OCR per call | n/a | n/a | full-page <=6 s, MRZ strip <=3 s, date pass <=4 s, raster <=5 s. | same |
| Fetch child | 45 s fetch (local-capacity.md:12); 10-s socket timeout. | none | 45 s child, 10 MiB response. | same |
| Retention | n/a | n/a | 30-day quiet cohort expiry; hourly check. | same |
| Pending document stages | 100 queued jobs (architecture.md:40). | n/a | Not stated for Bulk. | n/a |
| Open owner-decision on limits | n/a | Max has not accepted the capacity envelope (4/2 slots, 500 files, 100 MiB, 512 MiB) or five simultaneous 500-document workloads. | Open P1. | n/a |

Candidate pending in LP, not in main: Max's CDELTA also fixes that every limit is "configuration, raisable to 20 with no code change" (R1, R13, R14).

Pending decisions about the proposed production target: Max supplied 2 CPUs, 4 threads, 4 GB RAM (CONC-plan "Authority and scope"); no run on that shape.

## 4. Admission and queueing

### 4.1 What happens when N requests arrive at once (main, be30e73)

| Step | Fact | Source |
| --- | --- | --- |
| Acceptance | Each POST to `/bulk/<group>/sources` returns in milliseconds: intent saved, redirect to status page. No request is rejected for capacity. | TM-BUG-017 "Current behaviour" item 1; LLD section 6.1 |
| Queue | There is no queue structure. The queue is the set of persisted reads in `pending`/`reading`/`partial`, picked by `fair_batch`. Rotation is by read, not by TA. | CODE `bulk_worker.py`, `bulk_capacity.py:fair_batch`; (inference: not per-TA fair) |
| Admission control | Byte reservations at member admission: 10 MiB fetch + member copy; 100 MiB per workload; 512 MiB per installation. At a limit the member waits/retries (`storage_limit`, held). No count cap on reads. | EXEC "Frozen Bulk contention repair"; DOC-P |
| Fair budgets | Per read: 2 member threads, 2 of 4 processing slots. Pass budget 10 split across selected reads. Per-TA fairness: none recorded. | DOC-P; CODE `bulk_worker.py` |
| Observed unfairness | Two submissions at once (8 Oct, 10/20 config): group 2 document work began after 441.166 s while group 1 was 85.2% done. Mechanism: discovery thread polled with 1 vs 9-10 member pollers, lost 25 consecutive passes. | CONC-report; ARCH section 5, F3; `latency-throughput-analysis.md` timeline |
| Ten reads at default | Worker selects at most four reads per round; others wait for rotation; at 20/10 all ten are selected. Nothing rejected. This is described, not run. | TM-BUG-017 paragraph "Serialization that does exist" |
| Core `/intake` link form (not Bulk) | Fetches inside the HTTP request. At 9f4aee4 it waits up to `TM_BULK_FETCH_WAIT` (120 s) per Core slot; 8 HTTP threads. Burst can stall the portal. Not fixed; deferred by Max as TM-BUG-017. | TM-BUG-017 item 2; REV1 P1-1; RELAY2 item 3 |
| Capacity wait visible? | In main, a wait reason (`content_busy`, capacity) maps to labels "Waiting for a compatible reading" / "Waiting for processing capacity". In LP, capacity waits write no entity history, so the status page shows "reading" without a reason. | CODE `bulk_runs.py` (`project_read`); REV1 P2-2; TM-BUG-017 "Gap in the Bulk path" |

### 4.2 Status exposure

| Interface | Content | Source |
| --- | --- | --- |
| `GET /bulk/<group>/reads/<read>` (`?format=json`) | `contract_version 2`; `state`, `label`, `active`, `last_progress`, `refreshed_at`; `file_counts` {identified, newly_read, reused, needs_attention, remaining, completed, read_successfully, warnings, occurrences, unique_contents, verified_content_classes, unresolved_equivalence}; `final_total` and `known_extent` (null until discovery done); `discovered_so_far`; `discovery_complete`; `comparison_read`; `delta`; `attempts`; `error`; `operation_id`. | CODE `bulk_runs.py:project_read`; DOC-I |
| `GET /groups/<group>/imports/reads` | Compact paginated list (limit 1-50, default 20) of top-level reads: id, state, label, active, counts, final_total, open URL. Owning TA only; denied in support view. | CODE `bulk_runs.py:group_summary`; DOC-I |
| Per-attempt | `GET /bulk/<group>/imports/<attempt>` (JSON optional). | LLD section 5 |
| Polling | Group page and active pages refresh every 30 s while visible and active; pause when hidden; stop on terminal; show stale/unavailable on failure. Earlier (6 Oct) reading page 5 s, attempt page 3 s. GETs never write or start work. | DOC-I; LLD section 5; PLAN section 6 |
| Count equations | `identified = completed + remaining`; `completed = newly_read + reused + needs_attention`. | DOC-I; PLAN section 6 table |
| Metrics report | `python -m travelmudra.bulk_metrics` (LC/LP): per-document CSV/JSON/MD, discovery latency, fetch queue, retries, acquisition utilization, `member_utilization` (LP). Not an endpoint. | CONC-changes; DES "Metrics" |
| Diagnostics | `bin/bulk-diagnostics OPERATION_ID --runtime ...` read-only timeline. | DOC-D |

## 5. Test observations: real Google Drive and Sheet runs

Two real inputs are used repeatedly: one public Drive folder (11 subfolders, 88 files) and one public Google Sheet (3 applicant rows, 13 blank rows, 9 document links). Accounts are synthetic. All runs are isolated local previews. None is production.

| # | Date / runtime | Source | Numbers (exact) | Learned | Source file |
| --- | --- | --- | --- | --- | --- |
| 1 | 6 Oct 20:05-20:11, port 4546, baseline ef7fede | Drive folder (Group 1, Group 2) | Reads: 20:05:51 reading, `parser_busy` failure 20:06:00, parsed snapshot 20:07:07; 20:07:07 reading, failure 20:08:03, snapshot 20:08:23; Group 2 failure 20:10:27, snapshot 20:11:36. Root HTML 395691 bytes; 6 anchor links, 0 file links, 34 `data-id`; completed snapshots: 200 links incl. 189 `support.google.com`, `file_count_limit`. | BUG 1 and BUG 2 reproduced; 0 applications. | DBG |
| 2 | 6 Oct 20:17:05-20:17:20, port 4546 | Public Sheet `/edit?usp=sharing` | Read accepted 20:17:05; staged 250597 bytes 20:17:07; `operation_conflict` 20:17:12; `source_limit` 20:17:20. HTML parsed as 24 pseudo-rows, max 10219 columns (limit 64). | BUG 3 and BUG 4. | SHEET |
| 3 | 6 Oct, preview 4556, repair candidate | Sheet | 3 applicant rows; 13 blank skipped; 9 references; 8 readable, 1 unavailable; 4 issues; 1 held unit; 0 Drafts. Video 3 min 30 s. | Positive Draft path unproved (all 3 rows held or incomplete). | REP "Real-input outcomes"; INV "Real-input gate" |
| 4 | 6 Oct, preview 4556 | Drive | 11 subfolders, 88 files; 67 readable, 21 unavailable (18 no-readable-text, 2 unsupported format, 1 extraction); 2 Drafts, 2 passport promotions; 86 issues; video 31 min 3 s. | Inventory fixed (88 vs 200 nav links). | REP; INV |
| 5 | 6-7 Oct, nine-document benchmark | Sheet documents | Before: 121034 ms total (scanner init 103150.8 ms; mean 11461.2 ms; scan+shutdown 8705.2 ms; parser 8411.8 ms). After (overlapped with a Drive run): 197016 ms (scanner 107701; scan 8471; native PDF 1903; raster 1827; OCR 73659; parser start 397; interp 29). | Scanner init dominated; OCR recovers identity but one tax PDF `ocr_timeout`. | V1 "Verified increment" |
| 6 | 7 Oct, preview 4557 (Stable V1) | Sheet | 3 Drafts after 2 name confirmations; 8 documents promoted; 1 tax-PDF readability failure; third row swapped roles recovered. | Positive Sheet path proved. | V1; OWN |
| 7 | 7 Oct, preview 4557 | Drive | 88 files, 75 clean/readable, 13 review; 5 candidates: 3 new Drafts, 2 duplicate creations refused; 70 readable supporting files unassigned. Duration 1,138.0 s (19 min); worker-seconds over 86 docs: scanner startup 1,045; scan 88; OCR 361; native PDF 14; raster 25. At most 2 processors per read. | Fresh `clamscan` per file dominated. Review outcomes: 4 OCR timeouts, 3 raster timeouts, 2 page-text limits, 2 unsupported formats, 1 encrypted/out-of-range, 1 no readable text. | V1; OWN; TM-BUG-012 |
| 8 | 7 Oct, preview 4558 (after scanner reuse) | Sheet | 83.15 s: 9 documents, 8 readable/promoted, 3 Drafts after 2 confirmations, 1 `ocr_timeout`. | Warm scanner works. | OPT "Verification and real-data evidence" |
| 9 | 7 Oct, preview 4558 | Drive | Original read preserved at 39 completed files, resumed to 88 files, 76 readable, 5 new Drafts. 920.82 s mixed run (pre-repair; not a benchmark). | Daemon killed by thread exit; repaired. | OPT "Real-data-discovered scanner lifetime defect" |
| 10 | 7 Oct, preview 4558, post-repair | Drive fresh read | 447.51 s (7 min 28 s) vs 1,138 s earlier (about 61% lower, observational). 88 identities; 86 comparable hashes matched; 76 readable; 5 candidates; exactly 1 scanner init. Cumulative: scan 22.29 s; OCR 371.79 s; raster 24.79 s. 12 review outcomes (3 OCR timeout, 3 raster timeout, 2 page-text, 2 format, 1 unsupported, 1 no text). | Not a 5-workload proof. Older 4557 preview had one active read, so uncontrolled. | OPT "Final verification" |
| 11 | 7 Oct, port 4560 (traced diagnostic) | Sheet then Drive | Sheet first read: 9 references, 5 safe, 4 `ocr_timeout` (tracing overhead; passport JPEG succeeded in 13.59 s untraced; tax PDF 24.71 s untraced timeout). Normal Sheet: 9 refs, 8 readable, 3 Drafts, 8 attachments, 1 failure. Drive first: 88 refs, 14 newly read, 61 reused, 13 attention, 5 Drafts. Drive pinned rerun: 83 members unavailable with Store `busy`, 5 discovered, `storage_limit`; retained evidence 526,794,526 bytes. | P1 `busy` under accumulated evidence. | EXEC sections "Initial observed...", "Normal Sheet...", "Normal Drive..." |
| 12 | 7 Oct 21:06-21:18 (Drive); preview 4561 (be30e73) | Drive | First: submission to ready 467 s (7m47s); 88 docs, 75 newly read, 0 reused, 13 attention; 86 scans, 86 parser calls; total scans 98, parser 98. Rerun: 293 s (4m53s); 75 reused; parser calls 11 (total 23). Acquisitions 100 per run (88 docs + 12 listings); document acquisition service 207.841 s then 198.618 s (mean 2.257 s on rerun). First-to-last acquisition initiation 409.738 s / 267.860 s. Scanner: 1 init 13.411 s then 0; scan sums 24.732 s / 3.946 s; max single scan 1.656 s / 0.270 s. Rerun reconstruction: 225.8 s with 2 active docs, 24.9 s with 1, 21.5 s with none. | Reuse removes OCR, not download/scan. Both workers can sit in OCR, leaving downloads idle. | BASE "Recorded real-source baseline"; EXEC "Final real Drive journey" |
| 13 | 7 Oct, 4561 | Sheet | First: 36 s, 8 reused (from same TA's Drive group), 1 attention, 3 Drafts after 2 confirmations, 8 attachments; rerun 33 s, 8 reused, 0 new effects. Each read: 9 scans, 1 parser call. | Same-TA cross-group reuse works. | BASE table; EXEC "Final Sheet journey" |
| 14 | 8 Oct ~11:30, port 4562, run `20261008-113052-7225b38a`, config 10 per read / 20 slots | Drive, two TAs at once | Start skew 2.435 ms. TA1: 652.215 s to ready, 74 newly read, 14 attention, first doc work at 29.433 s, 326 attempts (238 retries). TA2: 902.959 s, 75 newly read, 13 attention, first doc work at 441.166 s, 318 attempts (230 retries). Totals: 176 documents, 149 success, 27 attention, 644 attempts, 468 retries (454 `fetch_busy`, 8 Store `busy`, 6 `parser_busy` at 100 MiB reservation). 200 acquisitions = 459.057 s service. Peaks: 20 document intervals, 5 processing-slot holders, 3 OCR pages, 40 threads. Scanner init 11.367 s once across 220 scans. Medians: acquisition 2,389 ms; scan 58 ms; OCR page 12,227 ms. CPU 1,740.916 s (avg 1.930 cores; peak 8.025 over 1.004 s); memory peak 2.273 GiB kernel / 1.850 GiB PSS; host 56 CPUs, about 63 GiB. Extra TA1 attention file = 2,514-byte Drive "virus scan warning" HTML instead of 168,341-byte PDF. | 10/20 gave no speedup: aggregate 11.69 vs 11.31 files/min; per-user latency 39.7% and 93.4% above old single-read 467 s. Downloader idle 47%; 63% of member thread time polling. | CONC-report; `latency-throughput-analysis.md`; ARCH sections 2, 5 |
| 15 | 8 Oct | Drive (side measure) | Median download 2.4 s; 11 further listings fetched in 8 s (about 0.7 s each); group 1 discovery complete at 29.4 s incl. 11.4 s scanner init. 65 of 176 documents needed OCR at 12-16 s per page; about 9.9 CPU-s per document. | Basis for TM-BUG-018 estimate (2-5 min for 101 listings). | TM-BUG-018; TM-BUG-020 |

Throughput facts (quote): historical 88 files in 467 s = 11.31 files/min; experiment 176 in 902.959 s = 11.69 files/min (`latency-throughput-analysis.md`). Serial acquisition service 459.057 s is a lower bound of about 51% of batch wall time, not an efficiency (CONC-report). ARCH computes a feed-the-downloader floor of about 485 s and 54% attainment, and says the 90% condition would need about 540 s. That is reviewer analysis, not a measured result.

Synthetic (not Google): Lane B 200-file journey (199 accepted, 1 unavailable); persistence benchmark 100 applicants / 500 documents: 231.8 s and 2,283,200,512 DB bytes plain, 239.0 s and 345,714,688 bytes compressed, 4719 history rows, no duplicates (V1; DOC-P "Audit storage"). A five-read deterministic check reached 4 simultaneous processors, never more than 2 per read, 10 files across 5 reads (V1). LP candidate: two 88-member synthetic reads complete in one `run_pending` call (count 176, remaining 224) (DREV item 1).

## 6. Open items

| Item | Rank and status | Source |
| --- | --- | --- |
| Five simultaneous 100-applicant/500-document workloads | P1; unverified; Max has not accepted or rejected the bounded V1 envelope. | OWN "Owner decisions before integration"; OPT "Mainline disposition" |
| Database/audit growth for long workloads | Part of the P1 capacity decision; 346 MB figure is for tiny synthetic proposals. | V1 "Remaining ranked decisions" |
| TM-BUG-013 Sheets API links (hyperlink formula, rich text, smart chip) | Open, unimplemented, needs credentials. | TM-BUG-013 |
| TM-BUG-014, 015, 016 | Implemented and verified at be30e73; awaiting Max acceptance (not closed). | TRK index |
| TM-BUG-017 ten-TA burst; Core `/intake` blocks up to 120 s | P1; deferred by Max; no implementation authority. | TM-BUG-017; RELAY2 |
| TM-BUG-018 sequential nested-folder discovery (100 subfolders about 2-5 min) | P1; proposal only. | TM-BUG-018 |
| TM-BUG-019 declared document set; TM-BUG-020 MRZ-first OCR, 10-page reject, 2-page identity limit | P1; deferred until after the parallel-acquisition test. | TM-BUG-019, 020 |
| Concurrency experiment (LC) | P1: 90% throughput acceptance not established; smaller production host untested; not merged. | CONC-review "Acceptance finding" |
| Parallel acquisition (LP, 455badd) | Synthetic verification only. All B5 gates "UNVERIFIED". Not integrated. Lane step b reached. | VER "B5 acceptance - not executed"; DREV |
| Per-document OCR/format outcomes | 13 attention files in Drive (4 OCR timeouts, 3 raster timeouts, 2 page-text limits, 2 format, 1 unsupported, 1 no text); not proven invalid. | OPT; EXEC |
| Google "virus scan warning" interstitial | P2 parked; retained bytes are immutable so only a new submission recovers it. | ARCH F7; CONC-issues EXP-I14 |
| Reviewer P2 notes (LP) | P2-1 raw sqlite error without Store; P2-3 silent per-read clamp; P2-4 reservations up to about 2 GiB at 10 reads x 10 members vs 512 MiB guard; P2-5 no cross-round cap on 429/503 retries; P2-D1 20 reads selected at 20/10; P2-D2 one-slot member utilization understated. | REV1; DREV |
| Admission/commit rewrite whole folder snapshot | P2 (ARCH F6); R10 SHOULD item. | ARCH F6 |
| Route 2 | Bulk raises `bulk_processor_protocol`; fetch daemon serves one request at a time; proposal only. | LLD section 7.1; `LP/output/proposals/route2-fetch-daemon-concurrency.md` |
| Other parked P2/P1 (6 Oct) | Diagnostics may contain typed PII (P1 parked); summary-event detail may omit code (P2); extraction coverage limited, 70 supporting files unassigned (P1 review). | INV "Open acceptance notes"; V1 |
| Evidence retention | Archive `/home/max-stravion/retained-evidence/TravelMudra/bulk-concurrency-2026-10-08` expires 8 Nov 2026, local only. Architect review depends on its `bulk-events.jsonl`. | CONC-preservation; ARCH section 11 |
| Lane state | LC and LP remain `active` in `workspace.json`; LC hosts preview on 4562. Not closed. | `workspace.json`; CONC-preservation "Runtime and disposition" |
| TRACKER index | Working copy of `internal/records/portal-issues/TRACKER.md` has an uncommitted edit adding TM-BUG-017 to 020 (git status). | `git -C internal status` |

## 7. Bug tracker extract (`internal/records/portal-issues/`)

20 TM-BUG ids. Dates are "reported" dates in each file. Bulk-related = affects bulk upload backend or its status UI.

| ID | Title | Date | Status (TRACKER) | Bulk? | Root cause (one line, from records) |
| --- | --- | --- | --- | --- | --- |
| 001 | Repeated Create group action after creation | 2026-10-05 | P2, parked | no | Owner report of a duplicate button; no root cause recorded. |
| 002 | Country-first creation and country-scoped service choices | 2026-10-05 | P1, product proposal; build held | no | Product flow requirement; group lacks country-first creation. |
| 003 | Bulk intake action is difficult to recognize | 2026-10-05 | P1, product proposal; build held | yes (UI) | Link does not look clickable; discoverability, not backend. |
| 004 | Group metadata presentation and edit policy | 2026-10-05 | P1, build held | no | Layout/edit policy mismatch. Max later: metadata read-only after creation. |
| 005 | Group detail needs an action-led workspace | 2026-10-05 | P1, build held | no (mentions Bulk upload button) | Product design request. |
| 006 | Quoted price needs an explanation | 2026-10-05 | P2, parked | no | Requested tooltip. |
| 007 | Application progress vocabulary is unclear | 2026-10-05 | P1, build held | no | "With TravelMudra" status semantics unclear. |
| 008 | Overview duplicates Applications and lacks a clear purpose | 2026-10-05 | P1, build held | no | Information architecture. |
| 009 | Overview banner is generic and unhelpful | 2026-10-05 | P2, parked | no | Static text with no runtime data. |
| 010 | Overview landing page lacks greeting, account context and alerts | 2026-10-05 | P1, build held | no | Landing-page redesign. |
| 011 | Country and services catalogue will not scale | 2026-10-05 | P1, build held | no | Catalogue page design for 5 countries x 3 services. |
| 012 | Repeated scanner initialization delays Bulk processing | 2026-10-07 | P1, closed (cc7b421) | yes | Fresh `clamscan` per file (about 12.1 s startup each); then daemon killed by parent-death signal when its spawning thread exited. |
| 013 | Scope Sheet acquisition and preserve explicit document links | 2026-10-07 | P1, worksheet scope accepted; API link enhancement open | yes | Share URL without `gid` exported the whole workbook; hidden link targets not preserved by CSV/values XLSX. |
| 014 | Detect identical document bytes across uploads and reuse eligible results | 2026-10-07 | P1, implemented and verified (be30e73); awaiting Max acceptance | yes | Member ownership and prior results tied to source/member identity; no cross-run content lookup. |
| 015 | Show accepted Bulk runs and live file progress under the group | 2026-10-07 | P1, implemented and verified; awaiting Max acceptance | yes | Group page listed attempts, not accepted reads; no compact 30-s summary. |
| 016 | Define and prove folder rerun, delta and idempotency rules | 2026-10-07 | P1, implemented and verified; awaiting Max acceptance | yes | No content-based delta workflow across independently accepted runs; revision compare ignored document-only changes. |
| 017 | Burst of concurrent source submissions must be acknowledged, queued and explained | 2026-10-08 | P1, reported; owner test defined; no implementation authority | yes | Bulk path already acknowledges and polls; Core `/intake` fetches in the HTTP request and (at 9f4aee4) waits up to 120 s. |
| 018 | Nested-folder discovery is sequential; one folder per applicant delays first document | 2026-10-08 | P1, reported; proposal only | yes | `discover_snapshot` crawls listings one at a time on the single reserved discovery slot. |
| 019 | Use offering's declared document set for classification and completeness | 2026-10-09 | P1, reported; deferred | yes | Bulk classifies from content only and never reads `structure.documents`. |
| 020 | MRZ-first orientation, 10-page rejection, 2-page limit for identity checks | 2026-10-09 | P1, reported; owner decisions recorded; deferred | yes | OCR runs 4 orientations x (full-page + MRZ) per page; 30-page cap. |

Four reported bulk P0 defects (not given TM-BUG ids) are in DBG, SHEET and LLD section 11; all four accepted and integrated in 91c5469 (OPT "Mainline disposition"). Lane-level finding ids (EXP-I01..I15, B-U01..B-I01) are in CONC-issues and LBH.

## 8. What I could not find

1. No record of a 10-parallel-request (ten TAs or ten reads) test. TM-BUG-017 defines the scenario and expected results, but no run is recorded. The only real concurrent run is two TAs (8 Oct).
2. No record of the B5 reference rerun (parallel acquisition, 4 fetch slots, 20/10) at any commit. VER marks every B5 gate UNVERIFIED. No file in LP or LC is newer than 9 Oct.
3. No matched 2/4 control run for the 8 Oct experiment. Causal speedup of 10/20 is stated as not established.
4. No run on the stated production shape (2 CPUs, 4 threads, 4 GB). Constrained-host run only proposed.
5. No real run of two groups of the same TA reading the same folder at the same time. Only deterministic tests and the sequential Sheet-after-Drive reuse.
6. No measurement of the 100-subfolder case (TM-BUG-018); the 2-5 minute figure is an estimate from 0.7-2.4 s per listing.
7. No live Google test in Lane B (5-6 Oct); its handoff lists live Google/Drive access as deferred.
8. No record that Max himself chose the 100 to 500 row limit or 200 to 500 file limit as a stated decision. The 500-file limit is linked to the Stable V1 brief (100 applicants / 500 documents) in V1, which says "Max's attached Stable V1 brief". The brief text itself is not in the records read.
9. No BUILD_SPEC numeric value for readers, scanner threads, OCR threads, round budgets, retries or timeouts. B38 only says to start with one active fetch and one parser and to raise concurrency after measured safety.
10. No per-TA fairness or per-request fair-budget mechanism beyond per-read slot caps and read rotation. No record of a per-TA cap or admission limit on number of reads.
11. No record that per-document status is exposed by a separate polling endpoint; per-file state is inside the read projection `files` list.
12. Records of timings disagree on small points, flagged where seen: Drive readable count 67 (6 Oct early), 75 (V1, OWN, final), 76 (OPT); Drive "first read" 467 s (BASE) vs 447.51 s (OPT, preview 4558) vs 1,138 s (earlier); Drive review count 13 vs 12; folder inventory limit 200 (LLD, INV) vs 500/128 (DOC-P).
13. TM-BUG-001 to 011 root-cause lines are product/UX reports; I did not open every body beyond the first lines.
14. The 8 Oct `bulk-events.jsonl` archive and journey files under `LC/output` were not opened. Numbers come from the curated reports. The `/home/max-stravion/retained-evidence` archive was not read.
