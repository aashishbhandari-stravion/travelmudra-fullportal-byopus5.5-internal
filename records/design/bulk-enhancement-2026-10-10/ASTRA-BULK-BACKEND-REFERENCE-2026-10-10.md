# Astra's bulk upload backend work as a reference for the Opus bulk enhancement design

Written 10 October 2026 by the Opus architect (Naruto). Decision owner: Max. Status: reference record. It
authorizes nothing. No Opus product file was changed. No Astra file was changed. Nothing was run.

Max's instruction of 10 October 2026, verbatim in the part that governs this record: "These are to be taken as
references for Naruto for his enhancement design but this DOES NOT mean that it has to be replicated as it is.
... This is a development prototype but i would not say this is the most optimal implementation."

Companion files in this folder:

- `astra-bulk-backend-evidence-summary-2026-10-10.md`: the fact base, 8 sections, every fact with its source.
  This record cites it as EVID §n.
- `ASTRA-PROMPT-bulk-backend-details-2026-10-10.md`: the prompt for Astra. It asks only for what the records do
  not answer.

## 1. Sources and their durability

| Source | Where | Commit | Durable? |
|---|---|---|---|
| Astra product, main | `~/projects/Critical/MaxHyperVisaFullPortalImplementationAstraGPT6` | be30e73 (7 Oct 21:06) | Yes |
| Astra private records | the nested `internal/` of that project | 730ab7c (9 Oct) | Yes. `records/portal-issues/TRACKER.md` has an uncommitted edit that adds TM-BUG-017 to 020 |
| Concurrency experiment lane | `~/workDirectory/.../lanes/bulk-concurrency-2026-10-08/repo`, branch `codex/bulk-concurrency-experiment` | 9689ce3 on be30e73 | Lane. Its records are copied into the private repository at `records/bulk-concurrency-2026-10-08/` |
| Parallel acquisition lane | `~/workDirectory/.../lanes/bulk-parallel-acquisition-2026-10-08/repo`, branch `codex/bulk-parallel-acquisition` | 455badd (9 Oct 09:12) on 9689ce3 | Lane. Its `output/` (design, verification report, portable learnings, patch, manifest) is NOT in a repository |
| Evidence archive of the 8 Oct run | `~/retained-evidence/TravelMudra/bulk-concurrency-2026-10-08` | manifest SHA-256 `b1fabf68…34cbf` | Local only; expires 8 November 2026 |
| Astra handover for Opus (answers to the prompt of this folder) | Astra private records, `records/bulk-backend-handover-for-opus-2026-10-10.md` (260 lines, author Goku) | 88f21ef (10 Oct, evening) | Yes. Read-only by this architect; its answers are mapped in §10 |

Max's note "latest changes are in a branch and not in main" is correct. Main stops at be30e73. The concurrency
instrumentation (9689ce3) and the parallel acquisition (ef79dc4, 516a3fe, 9f4aee4, 455badd) are only in the two
lanes. The branch `codex/bulk-integrated-improvements` in the main checkout equals main. Neither lane is closed.

## 2. Max's six recollections against the records

| # | Max's recollection | What the records show | Source |
|---|---|---|---|
| 1 | Bulk upload at first failed to load the input artifacts | Correct. Four P0 defects on baseline ef7fede (6 Oct): browser and worker ran the same read and parser contention was written as a terminal failure; Drive discovery inventoried navigation links (200 links, 189 to support.google.com, zero files); the Sheet share URL's HTML page was fed to the CSV parser; two fetches under one read key bound different bytes (`operation_conflict`). All four fixed in 91c5469 (7 Oct 09:11) | EVID §1, §2.5; `bulk-upload-debug-2026-10-06.md`, `public-sheet-upload-debug-2026-10-06.md` |
| 2 | BUILD_SPEC said 2 readers and 4 OCR/scanner threads; Max relaxed to about 10/20 | Partly. BUILD_SPEC B38 gives one number: start with "one active fetch and one parser" and raise concurrency after measured safety. Astra's HLD (`docs/architecture.md:40`) carried that start as a finite limit, which is what Max was told stopped true parallelism. The 2/4 figures are not in BUILD_SPEC. The 2/4 figures are code defaults introduced on 7 Oct: 2 member workers per read, 4 shared processing (scan + extract) slots. Max approved 10 per read / 20 shared for the 8 Oct experiment only. On 8 Oct Max superseded the one-fetch-one-parser inheritance: every limit MUST be configuration, raisable to 20 without a code change (delta R1, R13, R14) | EVID §3; `concurrency-delta-2026-10-08.md`; BUILD_SPEC line 89 |
| 3 | Performance issues were found and fixed; Goku keeps a bug tracker | Correct. Tracker `internal/records/portal-issues/` holds TM-BUG-001 to 020; 012 to 020 are bulk. Fixed: fresh `clamscan` per document (TM-BUG-012, 1,045 of 1,138 s in the 19-minute run), Store `busy` turned into 83 "unavailable" members (be30e73), whole-record decoding inside the write transaction. Found and NOT fixed in main: the fetch-lock polling with a 5-second give-up, the two pass barriers and discovery starvation (architect review F1 to F3); fixed only in the parallel-acquisition lane | EVID §1, §7; `bulk-optimizations-2026-10-07.md`; `independent-architect-review-2026-10-08.md` §6 |
| 4 | Readers should start in parallel; the same source was read by two read workers | Correct, with a distinction. (a) The 6 Oct race was the browser "Continue" button and the background worker both executing one accepted read; the fix is one process-owned lock per read (overlap returns current progress). (b) There is no central orchestrator in Astra: a host loop calls `run_pending` and work is assigned by file locks and a fair-rotation cursor. (c) Reads do start in parallel, but every download in main goes through one global `fetch.lock`; ten "workers" were ten pollers of that lock. Max's expectation of an assigning orchestrator is what the Opus kernel task queue already is (see §5) | EVID §2.1, §2.5; architect review §3, §4 |
| 5 | Scanner initialized for every scan; Opus has a warm scanner | Correct. Astra moved to one network-isolated `clamd` per runtime with INSTREAM connections on 7 Oct (cc7b421); first run then exposed the daemon dying with the thread that spawned it (fixed with a supervisor thread). After that: exactly one initialization (11.4 s) per run; document scans median 58 ms. Opus uses `clamd` over a socket from the start (`src/platform/clamd.ts`, `src/platform/scanner.ts`) | EVID §2.2; `bulk-optimizations-2026-10-07.md` |
| 6 | Ultimate test: same public Drive folder under two groups in parallel, run twice; central orchestrator; checksum after scan for duplicates | Partly. Run on 8 Oct with two TAs (not two groups of one TA) at 10/20: both reads completed, 176 documents, 149 read, 27 needs-attention; but the second TA's first document started 441 s after submission and 454 of 644 attempts were `fetch_busy` retries. The "run twice" case was run on 7 Oct for one TA: rerun 293 s versus 467 s, 75 of 88 documents reused, parser calls 86 to 11, zero new applications. Duplicate detection: SHA-256 and length at acquisition, reuse lookup after a fresh clean scan, exact-byte comparison, scope = one TA account across its groups, never across TAs. Two groups of the same TA on the same folder in parallel: deterministic tests only, no real run | EVID §2.3, §2.4, §5 runs 12 and 14 |

Max's open item (ten simultaneous requests accepted, acknowledged, queued; UI polls): in Astra the bulk POST
already returns in milliseconds with a status page to poll; the queue is the set of persisted reads, rotated four
at a time at defaults; nothing is rejected. It was never tested with ten requests. The Core single-link intake
form is different: it fetches inside the HTTP request and, in the lane candidate, waits up to 120 s for a slot.
Recorded as TM-BUG-017 with an owner test scenario; deferred by Max on 9 Oct (EVID §4.1, §7).

## 3. What Astra decided and changed, in order

Dates are 2026, IST. Full table in EVID §1.

1. 6 Oct: diagnosis of the four P0 defects on real Google inputs; as-implemented LLD written.
2. 7 Oct 09:11, 91c5469: one owner per read (process flock), durable retained bytes with hash before parse,
   provider-aware Sheet (validated export; HTML rejected) and Drive (encoded entry inventory, no navigation),
   folder limit 200 to 500 files, 128 listings, depth 3, processing slots 2 to 4, diagnostics command.
3. 7 Oct 10:05, cc7b421: warm ClamAV daemon; single-worksheet CSV export selected by `gid`.
4. 7 Oct, Max approved TM-BUG-014/015/016 as one plan with eight binding amendments: reuse is an optimization
   only; deterministic candidate choice; kill switch checked on every decision; same-TA scope and origin privacy;
   frozen inventories for baselines; failed byte comparison forbids reuse; versioned extraction profiles;
   recipient-owned materialized results.
5. 7 Oct 19:56 and 21:06, b7e35fd and be30e73: extraction reuse by content, accepted runs under the group with a
   30-second status poll, rerun delta rules; Store `busy` kept retryable. Main stops here.
6. 8 Oct, lane 9689ce3: configurable 10/20 and correlated stage metrics; the two-TA experiment; the architect
   review that named the root cause (polling give-up, pass barriers, discovery starvation). Max accepted the root
   cause and decided: parallel downloaders wanted; about 1,400 avoidable history rows per 176 documents not
   acceptable; one-fetch-one-parser superseded; verification on Max's own machine.
7. 8 to 9 Oct, lane 455badd: bounded crash-safe acquisition slots (`TM_BULK_FETCH_SLOTS` default 4, range 1 to
   20), bounded waits instead of give-up, slot 0 reserved for discovery, streaming refill with a shared fair
   budget, no business history for capacity waits, 429/503 backoff, metrics with member utilization; Core fetch
   and parser workers 1 to 20 (default 1). Two independent reviews: no P0; three P1 decided by Max on 9 Oct
   (round cap 400; utilization over member slots; Core web-path wait deferred as TM-BUG-017). Synthetic suite 770
   passed. The reference rerun (B5) was never executed; every acceptance gate is marked UNVERIFIED.
8. 9 Oct: TM-BUG-019 (classify against the offering's declared document set) and TM-BUG-020 (MRZ-first OCR,
   reject above 10 pages, no identity extraction above 2 pages) recorded as Max's decisions, deferred.

## 4. Real test observations that belong in the enhancement plan

All runs are isolated local previews with synthetic accounts and Max's two real public sources: one Drive folder
(11 subfolders, 88 files) and one Sheet (3 applicant rows, 9 document links). Exact numbers in EVID §5.

| Observation | Numbers | Consequence for the plan |
|---|---|---|
| Scanner start dominates when cold per document | 1,045 of 1,138 s worker time (7 Oct, 86 documents) | Opus already warm; keep "one initialization per process" as an acceptance check |
| Warm scanner, one read, 88 files | 447 to 467 s first read; rerun with reuse 293 s | A single read of 88 files takes 7 to 8 minutes with one download at a time. Download median 2.4 s |
| OCR is the CPU cost | 65 of 176 documents needed OCR, 12 to 16 s per page; about 9.9 CPU-s per document; peak 8 cores on an unconstrained host | Size processing workers by OCR pages, not by file count. Production target 2 CPU / 4 GB untested |
| Two tenants at once, one downloader | TA 2 first document at 441 s; 454 of 644 attempts were lock timeouts; aggregate rate unchanged against one tenant (11.7 versus 11.3 files/min) | Fairness across tenants is a design requirement, not a tuning knob. Capacity waits MUST NOT write business history |
| Needs-attention set is stable | 13 of 88: 4 OCR timeouts, 3 rasterisation timeouts, 2 page-text limits, 2 format, 1 unsupported, 1 no text | Expect about 15% review outcomes on real folders; the plan needs a review path, not a lower failure rate |
| Provider variation | Drive returned a 2,514-byte "virus scan warning" HTML page for a 168 KB PDF; retained bytes are immutable, so only a new submission recovers | Decide whether a provider interstitial is a retryable fetch outcome or a terminal one |
| Store contention | 237 sources and 732 stages (about 88.6 MB JSON) made the write transaction decode whole records; 83 members marked unavailable | Keep per-document rows small; never decode a folder snapshot inside a write transaction |
| Nested folders | 11 listings in 8 s (about 0.7 s each), sequential; 100 subfolders estimated at 2 to 5 minutes before the first document | Discovery MUST be concurrent and MUST report "N of M folders" progress (TM-BUG-018) |
| Reuse works | Sheet after Drive of the same TA: 8 of 9 documents reused; Drive rerun 75 of 88 reused | Same-TA, same-bytes extraction reuse is worth having; the policy amendments in §3 item 4 are the guard rails |

## 5. Relation to the Opus product (read-only survey of 10 October, commit 102e4c9)

| Topic | Opus today | Astra lesson that applies | Astra mechanism that does NOT transfer |
|---|---|---|---|
| Orchestration | Kernel durable task queue with leases, dedupe keys carrying the attempt generation, rows run side by side (`src/modules/intake/enqueue.ts`, `src/kernel/tasks.ts`) | Metrics per stage with attempt identity; terminal event after commit; no give-up-and-requeue; no fixed waves | File-slot locks, `run_pending` passes, fair-rotation cursor: Opus has the queue Astra lacked |
| Download concurrency | `tasks.concurrency.fetch` default 1, `parse` 1, `scan` 2, `other` 4 (`src/platform/config.ts:95`); configuration, no upper bound in the schema | The same single-fetch inheritance that Max superseded in Astra on 8 Oct. Test that the runner honors 20 per kind and that one slot serializes (portable checklist) | None needed; it is already configuration. Whether the runner honors it at 20 was not verified here |
| Per-TA admission | `intake.concurrentAttemptsPerTa` default 2; a third concurrent start is refused with `capacity_limited` (`src/modules/intake/commands/common.ts:71`) | Max's requirement is accept-and-queue, not refuse. Astra accepts every read and rotates | Astra has no per-TA cap at all; Opus keeps one, but as a queue position |
| Scanner | `clamd` over a socket, warm (`src/platform/clamd.ts`) | Acceptance check: one initialization per process; scan median tens of milliseconds | Supervisor-thread daemon |
| Duplicates | Locator-level: one fetch per link per attempt, one root per source per group; document versions carry SHA-256; applicant-level `possible_duplicate` incidents | Byte-content extraction reuse after a fresh scan, same-TA scope, kill switch, versioned extraction profile, exact-byte comparison | SQLite expression index and `bulk_content.py`; Opus would do this in PostgreSQL under the documents module if Max wants it. Not found in the survey: any cross-run extraction reuse in Opus; verify before designing |
| Status for polling | `intake.attempt_page` and attempt counts (rowsTotal/Terminal/Accepted/Incident); counts per state are a P1 Kind 1 candidate (SURFACE-INVENTORY §4 item 1) | Count equations (`identified = completed + remaining`), 30-second poll while visible, wait reason shown ("waiting for download capacity", "queued behind N reads") | Astra's read projection shape |
| Limits | maxRows 1000, maxFilesPerAttempt 500, maxAggregateBytes 512 MiB, document 5 MiB, spreadsheet 10 MiB | Astra ended at 500 files, 500 rows, 100 MiB per workload, 512 MiB per installation; no record of Max choosing these numbers | |
| Discovery | Folder listing tasks per subfolder (`intake.parse_sheet:…:<subfolder listing>`), already separate tasks | Progress "N of M folders"; discovery must not be starved by document work | |

Governance that still applies: the kernel is off limits for the UI rewrite (DECISIONS §3); a bulk backend
enhancement that touches the kernel task runner is a separate decision for Max. Intake is an edge module, not
Core, so the Kind 1 / Kind 2 gates of DECISIONS §3 do not apply by their letter; the same discipline (written
proposal, Nth retry, what a failure leaves behind, independent review, Max decides) applies by the global tenets.
No implementation is authorized (DECISIONS §2).

## 6. Design questions the enhancement plan must answer (not decided here)

Prerequisite set by Max on 10 October 2026: before the bulk upload lane starts, Max and the Opus architect
discuss and close these questions together, in one sitting, so that the lane receives a crisp requirement and
acceptance set. The architect MUST raise this prerequisite when the lane is planned; Max does not expect to
override it. The outcome is a bulk requirements and acceptance document in this folder, in Max's words where
the choice is his.

1. Admission: ten submissions in five seconds. Accept all, acknowledge with an attempt id, queue by arrival,
   show queue position and reason. Does the per-TA cap of 2 become a queue instead of a refusal? Max's stated
   intent says yes.
2. Fairness: a second tenant's discovery MUST not wait for a first tenant's documents. Define the rule (per-TA
   share of fetch slots, discovery priority) and the test (two tenants, same folder, first document of tenant 2
   within N seconds).
3. Download concurrency: raise `tasks.concurrency.fetch` by configuration; prove one-slot serialization and
   20-slot admission at the control site; keep the fetch worker's sandbox and byte limits.
4. Retries: a capacity wait is telemetry, never a row in the attempt's history. Bound provider 429/503 retries.
5. Duplicate bytes: decide whether Opus adds same-TA extraction reuse after scan (Astra's eight amendments are
   the guard rails) or stays with locator-level and applicant-level duplicate handling.
6. Discovery: concurrent subfolder listings with "N of M" progress; keep the frozen inventory before rows start.
7. Document policy already decided by Max for Astra on 9 Oct and to be confirmed for Opus: reject above 10
   pages; no identity extraction above 2 pages; MRZ-first orientation; classify against the offering's declared
   document set and report completeness per applicant.
8. Acceptance numbers: Astra's unexecuted B5 gates are a usable template: both reads of 2 × 88 files terminal in
   at most 450 s; first inventory within 30 s per read; member-slot utilization at least 70%; no interval over
   10 s with all slots free while members are pending; zero terminal 429/503; per-document outcomes equal to the
   archived baseline except provider interstitials. Max sets the numbers for Opus and the host they run on.

## 7. Open in Astra that Max may want closed before taking the numbers

Status on 10 October 2026, evening: Astra's handover (88f21ef, §10) confirms every item below. None is closed.

- The B5 reference rerun of 455badd never ran; the parallel-acquisition design is proved by synthetic tests only.
- No matched 2/4 control run; no run on the 2 CPU / 4 GB production shape; no real run of two groups of one TA.
- Five simultaneous 500-document workloads: unresolved P1 acceptance since 7 Oct.
- The 8 Oct evidence archive expires 8 November 2026 and the lane `output/` folder is not in any repository.

## 8. Max's directions of 10 October 2026 after reading this record

Recorded in Max's words where quoted. They are direction for the enhancement design, not design.

1. On the finding that Astra had no orchestrator and that ten workers were ten pollers of one lock: "This is
   bad, this is NOT how platform should be built." The Opus bulk upload MUST be built around an assigning
   orchestrator (the kernel task queue is the existing one) and MUST be fault tolerant, with recovery from
   disaster events "baked in as a proper module inside the bulk upload". Named cases: system crash; files
   processed through buggy code. The audit record MUST be sufficient, "not too much, not too less", for the
   system to re-run the affected work effectively. Max leaves the design to the Opus architect.
2. On concurrency limits: BUILD_SPEC B38's "one active fetch and one parser" and any HLD sentence derived from
   it are a starting point for measurement, not a design limit. Opus MUST NOT limit itself by them. Every
   concurrency limit is configuration, raisable without a code change; sizing follows measurement on the target
   host. (Consistent with Max's 8 October delta for Astra, R1, R13, R14.)
3. On the two Opus facts of §5 (confirmed by Max on 10 October 2026, later the same day): the Opus default
   `tasks.concurrency.fetch = 1` is the B38 starting value and falls under direction 2; it is not a design limit.
   The per-TA cap `intake.concurrentAttemptsPerTa = 2` that refuses a third concurrent start with
   `capacity_limited` is contrary to Max's intent. Direction: a bulk submission above any per-TA limit is
   accepted and queued with a visible position and reason, never refused (§6 question 1 is answered: yes). The
   value of the limit stays configuration. No code change is authorized by this direction (DECISIONS §2).

## 9. Architect's thoughts on fault tolerance and recovery, for the Opus design (10 October 2026)

Recorded at Max's request as input for the Opus architect. These are thoughts, not design and not decisions.
The Opus architect owns the design and MAY depart from any point here with a recorded reason.

1. Three failure classes, three kinds of record. The bulk upload MUST recover from (a) a process or host crash
   at any step, (b) a code version that produced wrong outcomes, and (c) a bad input. Each class needs a
   different record, and that is how "not too much, not too less" is decided: record what a re-run of that
   class needs, and nothing that only a human narrative would want.
2. Class (a), crash. The kernel already holds what this class needs: durable tasks, leases with heartbeat,
   dedupe keys carrying the attempt generation, recovery of expired leases, idempotent replay through the
   command outcome envelope (`src/kernel/tasks.ts`, `src/modules/intake/enqueue.ts`). The design SHOULD add
   nothing new here except a restart test at every step boundary (crash after fetch and before record; crash
   inside process_rows) and a fencing rule: a worker that lost its lease MUST NOT write over the result of the
   worker that recovered the task. Astra reached the same fencing by epoch tokens on members; Opus has the
   lease generation for it.
3. Class (b), buggy code. This is the one addition. Every per-row and per-document outcome MUST carry the
   identity of the processing version that produced it (a build or commit identifier and, where relevant, the
   extraction or classification profile version). The retained input bytes (source files with SHA-256, the
   parsed sheet) MUST stay available for the retention period. Then one command, "re-run every outcome produced
   by version X for attempt or TA Y", can rebuild the affected rows from retained bytes without a new download
   and without asking the TA for anything. The re-run is a new attempt generation, so the dedupe keys and the
   history stay intact; the earlier outcomes are superseded, not deleted. Astra approximated this with its
   extraction profile in the reuse key; Opus SHOULD make the version an explicit field of the outcome.
4. Class (c), bad input. Already covered by the facts the product records: per-row outcomes, incidents,
   `possible_duplicate`, needs-attention states. No new record. The re-run of a corrected input is a new
   attempt by the TA.
5. Audit versus telemetry. Audit holds business facts: who submitted, which bytes with which hash, which
   version processed them, which outcome, which re-run superseded which. Telemetry holds capacity events:
   waits, retries for 429/503, queue positions, slot utilization. Audit rows are never created by a capacity
   wait (Astra's 454 `fetch_busy` rows of 8 October are the counter-example). This split is what keeps the
   audit "not too much".
6. Recovery as a module. The recovery module owns: the restart recovery of class (a) as a start-up and
   periodic step; the "re-run by version" command of class (b); a dry-run that lists what a re-run would touch
   before it runs; and a report that proves a re-run finished (counts equal, as in Astra's `identified =
   completed + remaining`). It MUST be testable by killing a process at each step and by replaying a retained
   attempt under a deliberately changed version. Whether the module touches the kernel task runner is a
   separate decision for Max (DECISIONS §3); the thoughts above do not need a kernel change on their face,
   because the kernel already offers the primitives in point 2.
7. What Astra did right and what transfers. Immutable retained bytes with hash; a frozen inventory before
   rows start; a terminal event only after commit; count equations checked at the end of every run; a kill
   switch for a new mechanism. These are disciplines, not code, and they transfer.

## 10. Astra's answers of 10 October 2026, mapped to the eight questions (handover 88f21ef)

Source: Astra private repository, commit 88f21efd60902735a1fe5216b7961ddb9d756fa2,
`records/bulk-backend-handover-for-opus-2026-10-10.md`. Read-only by this architect; nothing in the Astra
repositories was changed. Astra marks its own inferences as inference; this section keeps that marking. Every
observation below is an input to the §6 discussion, not a decision.

| Prompt question | Astra's answer | Effect on the Opus design |
|---|---|---|
| 1. State after 9 Oct 09:26 | B5 rerun of 455badd did not run. No commit after 9689ce3, 455badd, be30e73 or 730ab7c other than the handover itself. Lane A `state/` empty, no run metadata. | §7 bullet 1 confirmed. The parallel-acquisition numbers stay unproven; the Opus acceptance template (§6 question 8) is a template, not a measured reference. |
| 2. Frozen candidate | Inference: freeze main be30e73 for UAT of the integrated bulk experience; 455badd is a separate candidate with both reviews complete, no B5 measurement, harness never run, integration not done. Instrumentation (`bulk_metrics`, stage events) is intended to stay with an integrated candidate; no Max decision recorded. | Astra-side decision for Max. For Opus: stage events and per-run metrics as product capability, not harness-only, is a direction worth carrying (§9 point 5, audit facts vs capacity telemetry). |
| 3. Max's words behind the numbers | Spreadsheet rows 500: implementer's choice, no Max decision recorded. Folder files 500: Max's target, 6 Oct 22:28, Stable V1 brief: "up to 100 applicants and 500 linked/supporting documents in one Bulk workload, with several independent Bulk workloads potentially active at once"; brief also says "Do not implement '10 threads per group' as a product contract." Experiment 10/20: Max approved 8 Oct 10:52 as system-level configuration, "we stop when we have achieved 90% optimal base". | The sizing target is Max's and transfers to Opus as the workload definition for §6 question 8: 100 applicants, 500 documents, several workloads at once. The Opus limits `maxRows 1000` and `maxFilesPerAttempt 500` already cover it (§5). Concurrency numbers are configuration, never a per-group promise (§8 direction 2). |
| 4. Alternatives and lessons | Orchestrator vs file locks: no comparison recorded. Per-TA fairness: not considered; the cursor rotates reads, so a TA with many reads gets more turns. Slot 0 for discovery: selected on reviewer advice, consequence for member capacity recorded. One `fetch_busy` for three conditions: reason not recorded; candidate separates `document_busy`. Eight hindsight lessons (inference). | §8 direction 1 (orchestrator) stands with no Astra counter-evidence. Lessons map: 1 tenant fairness defined separately from read fairness → §6 question 2; 2 discovery priority and utilization denominator defined together → questions 2 and 6; 3 check downstream numeric APIs when widening a budget → question 3; 4 measure time to first document, not only completion → question 8 metric; 5 validate the deployment boundary before carrying throughput evidence → Opus acceptance MUST run on the three-instance topology, never a monolith; 6 separate capacity, ownership and provider outcomes in history and telemetry → §9 point 5; 7 bind byte comparisons to exact bytes → question 5; 8 preserve frozen packets in a repository → Opus lane closure rule. |
| 5. Real-run observations | Both reads accepted together at about 11:31:01. TA 1: first document queued +29 s, last terminal +652 s. TA 2: first document queued +441 s, last terminal +903 s. Store busy: 8 unique retry attempts in two bursts (+470 s, +537 s; +509 s, +526 s). OCR pages per document (88 each): TA 1 58/28/2 for 0/1/2 pages, TA 2 57/29/2; native text extraction seen through page 19. 7 Oct inventory from raw logs: 17 accepted reads (`ta-one`), 16,856 storage-limit retry events in one log and 1,125 in another, all repeated events. Provider: no 429/503 seen in any real run; one Drive URL returned a 2,514-byte virus-scan warning HTML page where the other tenant got the 168,341-byte PDF; Sheets CSV export scoped by `gid`, XLSX path exists but untested; 24 discovery acquisitions for 11 nested listings, pagination not demonstrated. 9 Oct: no real-data run. | TA 2 waited 441 s for its first document while admitted at the same moment: this is the fairness failure that §6 question 2 names, now with a measured number. OCR: about two thirds of real documents need no OCR, almost none need more than two pages; this supports the 2-page identity limit (question 7). Provider rate limits are unobserved, not absent: question 4 keeps the bound. Non-document responses to a document URL MUST be a planned outcome class, with no interstitial bypass. Large-folder pagination is unproven in Astra; Opus must test it. Repeated retry events counted in the thousands are telemetry, not history (§8 direction 3, §9 point 5). |
| 6. Two groups of one TA, same folder | Never run on real data. Synthetic tests only (seven contenders, one TA, one group). Content key = account, byte SHA-256, size, extraction profile; group is not in the key. User-visible: both reads stay eligible; the duplicate waits with "A compatible reading is in progress. This read will retry." (`content_busy`, 2 s retry cadence). | Input to §6 question 5. If Opus adds reuse, the key excludes group by Astra's precedent and the waiting read shows a reason. The same-TA parallel case is an Opus acceptance test to write, since no real reference exists. |
| 7. Route 2 | Route 2 (separate processing trust boundary) is Astra's recorded production target. The fetch daemon serves one connection at a time. The parallel-acquisition result does not hold for Route 2 until the daemon is concurrent; B5 has not established a Route 1 result either. | Opus already runs processing as its own instance (§5). Lesson 5 applies directly: acceptance numbers are valid only on the deployment shape they were measured on. |
| 8. Durability | Proposal for Max, not performed: promote the lane `output/` (design, verification report, portable learnings, Route 2 proposal, manifest, patch with SHA-256) into one private record directory keyed by 455badd; reconcile the stale "delta review pending" wording in a separate receipt; commit the tracker edit only with Max's authorization; keep the probe log out. | Astra-side decision for Max. Opus note: evidence archive expires 8 November 2026 and this record's §4 numbers cite it; the hashes in the handover make the archive checkable until then. |

Correction to this folder's evidence summary: its §5 table has fifteen rows of curated observations. Astra's
handover counts 17 accepted reads on 7 October plus 2 on 8 October from the raw event logs. The two counts
measure different things (observations vs accepted reads) and do not contradict; the summary is not amended.

Acknowledged by Max on 10 October 2026, late evening, as inputs to the §6 discussion: the sizing target is his
(100 applicants, 500 documents per workload, several at once); the measured fairness failure (first document
after 29 s vs 441 s); real documents are light (about two thirds need no OCR); provider behavior to plan for
(throttling unobserved not absent, non-document responses, pagination untested); nothing proved on real data for
the parallel designs; the eight lessons map onto §6, §8 and §9 and none contradicts the orchestrator direction.

What the handover does not change: the eight questions of §6 stay open and stay Max's; §8 directions stand;
no implementation is authorized (DECISIONS §2). Items for Max in the Astra chat, not for this project: the
frozen-candidate choice (question 2), the durability promotion (question 8), and the archive expiry.
