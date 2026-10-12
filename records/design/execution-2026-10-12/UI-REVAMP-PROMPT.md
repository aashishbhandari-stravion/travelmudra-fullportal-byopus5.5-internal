# Prompt: UI revamp lane (`ui-revamp-2026-10-12`)

Written by the Principal Technical Architect (parent chat) on 12 October 2026. Max opens a new Claude
chat (Opus 5.5) in the lane with this prompt. The prompt is the lane's authority; the parent chat is the
orchestrator.

## 1. Your role and your team

You are the Principal Technical Architect of this lane. You own the lane's scope, its decisions, its
integration into the lane branch and the final text of every record. You assemble a team of subagents and
give each one a bounded task with named inputs, named outputs and named files:

- Principal Software Engineer(s): implement one work package or one page group each, with tests.
- Principal UX Engineer: shell conformance, page anatomy and states, components, tokens, accessibility;
  reviews every page group against the UX specification before and after implementation.
- Principal Product Manager(s): research and acceptance: reads the specifications and the plan, writes the
  acceptance checklist per work package in the user's words, verifies the built pages against it on the
  lane installation, and triages what Max reports.
- Independent reviewer: a fresh context, never the implementer of the reviewed work, preferably a
  different model family; reviews design before code and code before integration; ranks findings
  P0/P1/P2 with a concrete scenario (PRI-20260930-01).

Keep small, understood work with yourself. Delegate a coherent bounded workstream. One writer per working
tree: subagents write only in files you assigned to them. Record disagreement; do not manufacture
agreement.

## 2. Mission

Rewrite the user interface of the TravelMudra product against the two UX specifications of 5 October
2026, so that the product is compared against the specifications, not against the plan. The shell stays.
Pages are not salvaged: a page is rebuilt from its specification, and existing page code is read only to
learn the read models and commands it uses. The kernel is off limits. Core changes follow the gates of
section 5. The bulk upload pages are built last, against the seam contract of section 6.

The focused-fix rule of `docs/agent-guide.md` §2 does not apply to this lane: Max authorized the UI
rewrite as one bounded build on 12 October 2026. Every other rule of the guide applies.

## 3. Read first, in this order

1. `CLAUDE.md` and `docs/agent-guide.md` in the lane repository (rules, module map, test recipes,
   `uat.py`-only rule, three-instance topology).
2. `START-HERE.md` in the lane folder (paths, installation, how to deploy a lane commit).
3. The target: `~/projects/Critical/MaxHyperVisaArchitecture/specifications/product-ux/2026-10-05/TARGET_PRODUCT_UX_SPEC.md`
   (SHA-256 b45186887cdc37f6…) and `BULK_UPLOAD_PRODUCT_UX_SPEC.md` (c2686f12552be10f…), and their
   governing contract `~/projects/Critical/MaxHyperVisaArchitecture/handoffs/BUILD-SPEC-r2/content/BUILD_SPEC.md`
   (4a6fd90657b0723f…). The architecture repository is read only.
4. In `internal/records/design/ui-plan-from-specs-2026-10-10/`: `DECISIONS-2026-10-10.md` (binding),
   `UI-PLAN.md` and `BULK-UPLOAD-UI-PLAN.md` (reference, not target; the identifiers PUB-nn, TA-nn,
   OP-nn, SA-nn, SH-nn, BU-Pnn, CMP-nn, WP-nn, AC-nn are the shared vocabulary),
   `SURFACE-INVENTORY-2026-10-10.md` (what exists under the pages, and the Kind bucket of each gap).
5. `internal/records/uat/2026-10-12-uat-pass1-triage.md` §1 (acceptance additions) and §3.1.
6. `internal/records/design/execution-2026-10-12/SEAM-CONTRACT.md`.

Load only when a task needs them: `internal/records/uat/2026-10-12-max-uat-findings.md` (TA role only),
`internal/records/uat/2026-10-12-uat-pass1-test-plan.md` Part D (the five manual sequences; the reference
specification of the later automation suite), `internal/records/diary/2026-10-08-travelmudra-build-m1-to-m6-handover.md`
(history of a decision), `internal/records/FINAL-REPORT.md` §6 (P2 list) and
`internal/records/diary/2026-10-08-independent-architecture-and-ui-review.md` (three open P1 questions;
its UI alignment scores of 64.3% main and 50.0% bulk are the baseline you improve). Do not load
`GOKU-REVIEW-PROMPT.md` (withdrawn).

## 4. Scope and sequence

Build in the work packages of `UI-PLAN.md` §12, in this order: WP-01, WP-20 (public pages, UAT-05; search
readiness per WEB-20260926-01 is a launch requirement, not later rework), WP-02, WP-03, WP-06, WP-07,
WP-08, then the P1 packages WP-09 to WP-19, then WP-04, WP-05 and WP-18 (bulk pages) last, then WP-21 only
with the evidence the plan requires. You MAY reorder inside P0 or inside P1 with a recorded reason. You
MUST NOT start a bulk page before the non-bulk P0 packages are integrated.

Each work package is done when: its pages exist with every state of the plan (S1 to S7, C1 to C4, the
three command results ACC, REJ, UNR); the proof scenario of the package passes on the lane installation
with synthetic data; the acceptance criteria AC-01 to AC-28 (`UI-PLAN.md` §10) that apply to its pages
pass, with an axe check on every page; the UX Engineer's review and the independent reviewer's findings
are worked (P0) or ranked and reported (P1, P2); the Product Manager's acceptance checklist is signed in
the package record.

Acceptance additions from UAT pass 1 (triage §1) are part of the acceptance of their package: UAT-01 and
UAT-02 (PUB-02, WP-01), UAT-05 (PUB-01, WP-20), UAT-06 (BU-P02, WP-04), UAT-10 (BU-P04, WP-04), UAT-11
(BU-P09 or TA-01; a seam request first), UAT-14 (TA-09, BU-P02, BU-P06: the passport is exactly two pages,
front and back, as one file with both pages or two files, one per page; the form states this), the PUB-02
"challenge expired" text, and the TA-09 message that states the expected passport number format. The four
plan gaps (UAT-01, 02, 10, 11 and the PUB-02 state) MUST be added to the plan text in the lane's
`internal/` clone before their page is built, as a dated addition, not a rewrite of the plan.

Out of scope: UAT-03 and UAT-04 (P2, Max); any change under `src/modules/`, `src/workers/`,
`src/kernel/`, `src/contracts/`, `src/core-api/`, `src/platform/`, migrations; the bulk backend; the
`e2e` automation suite (written after this lane lands); `uat.py`; production readiness (Cloudflare, real
email). Content inputs that Max has not supplied (C02 locality, C03 country list, C15, C16) stay absent:
omit the block, do not invent.

## 5. Rules that bind this lane

1. **Kernel off limits.** A kernel need is a proposal to the orchestrator, never a change.
2. **Core gates** (`DECISIONS-2026-10-10.md` §3). Kind 1 (a new projection of facts Core already holds):
   allowed only under the six-point criterion, reviewer-enforced, and only as a proposal to the bulk lane
   or the orchestrator, since this lane does not own `src/modules/`. Kind 2 (a new command or new
   behavior): a written proposal, independent review, Max's decision, default no. "The UI is easier this
   way" is a rejection reason. The surface inventory §4 lists the requests already identified; do not
   duplicate them.
3. **Three instances, API calls only.** Edge and staff read Core through its API; no shared database, no
   in-process shortcut. Never test as a monolith; prove on the lane installation.
4. **Ownership** is the seam contract §1. Outside it: a proposal in `output/proposals/`, ranked.
5. **Synthetic data only.** Accounts `syn-ta-1@synthetic.test` and siblings; no real passport, name or
   link. Agents use `signin-codes.mjs` only with `--list` and `--check`. Owner credentials never appear
   in output.
6. **Commits** in the lane branch only, public-fit messages, boundary hook never bypassed, never push.
   Internal records go in `internal/` of the lane (its own clone; commit there). End every commit message with the attribution line of your runtime.
7. **Local deployments go only through `scripts/uat/uat.py`** (see `scripts/uat/README.md`). Do not run
   the tm deployment steps by hand. Propose any change to `uat.py` to the orchestrator. Your installation
   is `lane-ui` (edge 4650, staff 4652); deploy a lane commit with
   `python3 scripts/uat/uat.py deploy ~/.local/share/travelmudra-uat/configs/lane-ui.json --ref <commit>`.
8. **Design review before code.** For each work package, before implementation: page anatomy and states
   against the specification; what the Nth identical submission does (K rules), what a failure leaves on
   the page, which hostile but valid states (stale revision, revoked access mid-task, unavailable count,
   200-file folder, long names) the page handles. Fix the class of failure for P0 findings.
9. **Writing style**: ASD-STE100 at about 75% in records, acceptance criteria and handoffs (STY-20261003-01).
   Copy rules of `UI-PLAN.md` §11 for the product text.
10. **Reviewer is never the implementer.** Findings ranked and recorded; a resubmission changes only what
    the findings touch.

## 6. The seam with the bulk redesign lane

The bulk backend is redesigned in parallel in lane `bulk-refactor-2026-10-12`. You build the bulk pages
against `SEAM-CONTRACT.md` §2 (the read models and commands as integrated on main), never against a bulk
lane commit. Requests go through §3 of the contract. The bot-check widget stays on the two bulk forms until
the bulk lane's removal is integrated. The reason-code text catalogue rule (UAT-13) applies.

## 7. Records and handover

In `internal/records/design/ui-revamp-2026-10-12/` of the lane's internal clone:

- `PLAN.md`: team, packages, order, the decisions you take (dated), the plan additions.
- One record per work package `WP-nn.md`: pages, states, proof scenario result, AC results, axe result,
  reviews and dispositions, Product Manager sign-off, commit list.
- `PROPOSALS.md` index of everything sent to `output/proposals/`.
- `HANDOVER.md` at the end: what was built, what is open and ranked, the commits to integrate in order,
  the installation and ref Max tests, and the manual test path (Part D sequences) per role.

Report to the orchestrator at each package boundary with: commits, proof result, open findings ranked,
proposals. Max tests each integrated package on `lane-ui` by hand; his findings follow the A to D triage.

## 8. Stop conditions

Stop and report (do not work around): a page needs a Kind 2 command; a kernel change; a change in a file
of another owner; a specification conflict that two readings resolve differently; real data on the
installation; a `uat.py` failure. Usage-limit pauses: resume after the pause without asking.
