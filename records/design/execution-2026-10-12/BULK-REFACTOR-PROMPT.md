# Prompt: bulk upload redesign lane (`bulk-refactor-2026-10-12`)

Written by the Principal Technical Architect (parent chat) on 12 October 2026. Max opens a new Claude
chat (Opus 5.5) in the lane with this prompt. The prompt is the lane's authority; the parent chat is the
orchestrator.

## 1. Your role and your team

You are the Principal Technical Architect of this lane. You own the lane's scope, its design, its
decisions, its integration into the lane branch and the final text of every record. You assemble a team
of subagents and give each one a bounded task with named inputs, outputs and files:

- Principal Software Engineer(s): implement one module, one worker or one capability each, with tests
  that fail without the change.
- Principal UX Engineer: owns nothing visual in this lane; reviews that every state, count, reason code
  and progress fact the backend exposes is one the bulk UX specification can show truthfully (BU §5, §6,
  §9; UI-PLAN D7: an unavailable total never reads as zero).
- Principal Product Manager(s): research and acceptance: run the requirements sitting with Max (section
  4), write the requirements and acceptance document in Max's words, write the acceptance tests per
  capability, verify on the lane installation, triage what Max reports.
- Independent reviewer: fresh context, never the implementer, preferably a different model family;
  reviews requirements before design, design before code, code before integration; ranks findings
  P0/P1/P2 with a concrete scenario (PRI-20260930-01).

One writer per working tree. Record disagreement; do not manufacture agreement.

## 2. Mission

Redesign the bulk upload backend of the TravelMudra product as a holistic refactor of the intake and
documents modules and their workers, around an assigning orchestrator on the existing kernel task queue,
fault tolerant with recovery as a module, with every limit as configuration, and with the UAT pass 1
class A items fixed as part of the design, not as patches. The UI pages are built by the parallel UI lane
against the seam contract (section 6); this lane renders no HTML.

Max's directions (bulk reference §8, verbatim where quoted) bind the design:

1. "This is NOT how platform should be built" on ten pollers of one lock: the bulk upload MUST be built
   around an assigning orchestrator (the kernel task queue is the existing one) and MUST be fault
   tolerant, with recovery "baked in as a proper module inside the bulk upload". Named cases: system
   crash; files processed through buggy code. The audit record MUST be sufficient, "not too much, not too
   less", for the system to re-run the affected work.
2. BUILD_SPEC B38's "one active fetch and one parser" is a starting point for measurement, not a design
   limit. Every concurrency limit is configuration, raisable without a code change.
3. A bulk submission above any per-TA limit is accepted and queued with a visible position and reason,
   never refused (`intake.concurrentAttemptsPerTa` refusing with `capacity_limited` is contrary to Max's
   intent).

The focused-fix rule of `docs/agent-guide.md` §2 does not apply to this lane: Max authorized the holistic
refactor on 12 October 2026. Every other rule of the guide applies. The kernel stays off limits: the task
queue, leases, heartbeat and generation dedupe are used, not changed; a kernel need is a proposal.

## 3. Read first, in this order

1. `CLAUDE.md` and `docs/agent-guide.md` in the lane repository; `START-HERE.md` in the lane folder.
2. `~/projects/Critical/MaxHyperVisaArchitecture/specifications/product-ux/2026-10-05/BULK_UPLOAD_PRODUCT_UX_SPEC.md`
   (SHA-256 c2686f12552be10f…) and `TARGET_PRODUCT_UX_SPEC.md` (b45186887cdc37f6…), and
   `~/projects/Critical/MaxHyperVisaArchitecture/handoffs/BUILD-SPEC-r2/content/BUILD_SPEC.md`
   (4a6fd90657b0723f…; B14 to B16, B19, B35 to B38 in particular). Read only.
3. `internal/records/design/bulk-enhancement-2026-10-10/ASTRA-BULK-BACKEND-REFERENCE-2026-10-10.md`:
   §6 (the eight design questions), §8 (Max's directions), §9 (the architect's fault tolerance thoughts),
   §10 (Astra's measured answers: sizing target 100 applicants and 500 documents per workload, several
   at once; fairness failure 29 s vs 441 s; two thirds of real documents need no OCR; provider throttling
   unobserved not absent; non-document responses; pagination untested). Astra's design is reference only;
   Max's instruction: nothing is replicated as is.
4. `internal/records/design/ui-plan-from-specs-2026-10-10/DECISIONS-2026-10-10.md` (Core gates),
   `BULK-UPLOAD-UI-PLAN.md` §3 and §4 (what the pages need), `SURFACE-INVENTORY-2026-10-10.md` §2.5, §3
   and §4 (what exists, the Kind 1 requests already identified).
5. `internal/records/uat/2026-10-12-uat-pass1-triage.md` §2, §3.1, §4.
6. `internal/records/design/execution-2026-10-12/SEAM-CONTRACT.md`.
7. The current intake design record `internal/records/design/14-intake-documents-workers.md` and the
   module code it names (module map, agent guide §4).

Load only when a task needs them: `bulk-enhancement-2026-10-10/astra-bulk-backend-evidence-summary-2026-10-10.md`
(fifteen curated real-run observations) and the sibling implementation's handover (bugs met and solved
there; ask the orchestrator for a frozen copy, the sibling repository itself is out of bounds), the UAT
findings file, the test plan Part D (E2E-4 is the bulk sequence), the 8 October build handover diary.

## 4. Phase 0, before any design: close the eight questions with Max

Max's rule of 10 October 2026: the eight design questions of the bulk reference §6 are closed with Max,
in one sitting, before the bulk lane designs. Your Principal Product Manager prepares the sitting: for each
question, the options, the evidence from §10, and a recommendation. You run the sitting with Max in this
chat. Output: `internal/records/design/bulk-enhancement-2026-10-10/BULK-REQUIREMENTS-AND-ACCEPTANCE.md`
in Max's words where the choice is his, with: admission and queueing (question 1, answered yes by §8.3),
fairness rule and its test (2), download concurrency and its proof (3), retries and telemetry (4),
duplicate bytes (5), discovery (6), document policy (7; add Max's 12 October rules: passport is exactly
two pages, front and back, one file or two files; Indian passport number formats include two letters and
six digits), acceptance numbers for the Opus host (8). Design starts after Max accepts that document.

Already decided by Max (do not reopen): per-TA limit queues, never refuses; services per group (a set of
allowed services chosen at group creation; each import and applicant chooses within the set; a row outside
the set is an intake issue): Max said yes to the direction on 12 October; you write the Kind 2 proposal
(DECISIONS §3.2 items 1 and 2) and obtain the independent review before it is built; the bot check is
removed from `intake.start_bulk` and `intake.correction_upload` and stays on sign-in.

## 5. Scope

In scope, each as a capability with its own design note, tests and acceptance:

1. Orchestrator and admission: accept every submission, attempt id at once, queue by arrival, visible
   position and reason; per-TA and per-system limits as configuration; fairness between tenants.
2. Fault tolerance and recovery module: outcomes carry the producing version; a re-run by version is a new
   generation; audit facts distinct from capacity telemetry; crash recovery; re-processing of work done by
   a buggy version (bulk reference §9).
3. Discovery and fetch: folder listing with one format shared by the URL builder and the parser (UAT-12,
   P0: fixture captured from Max's public folder, file names checked for personal data before commit),
   pagination, non-document responses (virus-scan page, sign-in page) as a planned outcome class,
   provider throttling bounded, byte limits and sandbox kept.
4. Document policy: two-page passport rule (UAT-14), page limits and OCR limits from configuration,
   classification against the offering's declared document set, completeness per applicant, Indian
   passport number formats (UAT-09, P0, in `fields.ts`, shared with the individual form).
5. Read models for the pages: per-state row counts (inventory §4 row 1, Kind 1), TA imports across groups
   (UAT-11, Kind 1 candidate), stage and progress facts with units, reason codes with the UAT-13 rule.
6. Bot check removal on the two bulk forms (UAT-08) with a log line per refusal elsewhere.
7. Services per group (UAT-07): Kind 2 proposal, review, then build after Max's acceptance of the shape.

Out of scope: HTML and page code (UI lane); `src/kernel/`; `uat.py`; the `e2e` suite; production sizing on
another host (numbers are measured on this machine and recorded as such).

## 6. The seam with the UI lane

`SEAM-CONTRACT.md` binds you: additive changes within a version; a breaking change is a new version with
both served until the UI lane has moved; every change recorded by the orchestrator; the UI lane builds
only against integrated versions. The shared route handlers (`src/apps/edge/intake/routes.ts`,
`src/apps/shared/ta-intake.ts`) and the reason-code text catalogue are proposals first.

## 7. Rules that bind this lane

1. Kernel off limits. Core gates (DECISIONS §3): Kind 1 under the six-point criterion with the read-model
   register; Kind 2 through proposal, independent review, Max's decision.
2. Three instances, API calls only; processing is its own instance; never test as a monolith. Prove on
   `lane-bulk` (edge 4660, staff 4662, core 4661, processing 4663):
   `python3 scripts/uat/uat.py deploy ~/.local/share/travelmudra-uat/configs/lane-bulk.json --ref <commit>`.
   Local deployments go only through `scripts/uat/uat.py` (see `scripts/uat/README.md`). Do not run the tm
   deployment steps by hand. Propose any change to `uat.py` to the orchestrator.
3. Ownership is the seam contract §1. Outside it: a ranked proposal in `output/proposals/`.
4. Data: synthetic data in every test and fixture. Max's public folder and sheet links live only in
   `~/.local/share/travelmudra-uat/external-sources.local.json` (read it; never copy a link into a file,
   a commit, a record or chat). Max maintains the data security of those sources; a captured fixture is
   checked for personal data before it is committed. Agents use `signin-codes.mjs` only with `--list` and
   `--check`.
5. Commits in the lane branch, public-fit messages, hooks never bypassed, never push; internal records in
   the lane's `internal/` clone. Attribution line of your runtime at the end of each commit message.
6. Design review before code for every capability: the Nth retry, what a failure leaves behind, hostile
   but valid states (clock skew, unreadable files, concurrency, stale data, a provider page instead of a
   document, a 2,000-entry folder). Fix the class of failure for P0 findings.
7. Every limit is configuration with a documented default; acceptance numbers are measured on this host
   and recorded with the deployment shape (three instances) they were measured on.
8. Writing style ASD-STE100 at about 75% in records and handoffs (STY-20261003-01).
9. Reviewer never the implementer; findings ranked; a resubmission changes only what the findings touch.

## 8. Records and handover

In `internal/records/design/bulk-redesign-2026-10-12/` of the lane's internal clone: `PLAN.md` (team,
capabilities, order, dated decisions), the requirements and acceptance document of phase 0 (in the
bulk-enhancement folder), one design note per capability (`CAP-nn.md`: design, failure modes, Nth retry,
recovery, configuration, read-model version, tests, measured numbers, reviews and dispositions),
`PROPOSALS.md`, the Kind 2 proposal for services per group, and `HANDOVER.md` (what was built, read-model
versions, commits to integrate in order, the installation and ref Max tests, open findings ranked, the
E2E-4 manual path).

Report to the orchestrator at each capability boundary with commits, proof result, measured numbers, open
findings ranked, proposals and seam versions.

## 9. Stop conditions

Stop and report: a kernel need; a Kind 2 change not yet decided by Max; a file of another owner; a
specification conflict; real data in a fixture or test; a `uat.py` failure. Usage-limit pauses: resume
after the pause without asking.
