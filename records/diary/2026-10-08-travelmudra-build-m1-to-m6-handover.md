# 2026-10-08 — TravelMudra built from the specification through six milestones (4–8 October), handed over for focused fix tasks

## Executive summary

One orchestrator chat (Claude Opus 5.5, session `2f6f1696-2924-4446-bd46-91bb768d9648`, Max's "UC" run) built
the TravelMudra B2B visa-services portal from `internal/records/BUILD_SPEC.md` (SHA-256 `4a6fd906…ea89`) between
4 and 8 October 2026 (about 99 hours wall time, 57 prompts from Max, 6 context compactions). The product is three
instances (core, edge, staff) that talk only through mutual-TLS API calls. Six milestones are tagged on `main`
(`m1-foundation` d878072, `m2-access-catalogue-documents` da113be, `m3-cases-intake-payments`,
`m4-operations-delivery-views`, `m5-release-recovery-verification`, `m6-final-assurance` 7be21b1). The final
gate ran 1846 tests three times with no failure. After the tag, two commits followed: a README note naming the
private repository (7a29a3f) and the one-command UAT script `scripts/uat/uat.py` (fede68a). Max pushed `main`
and the tags (origin/main = fede68a). A local preview runs on 127.0.0.1:4610 (edge) and :4612 (staff). Max now
tests by hand and opens one task chat per problem. On 8 October Max ruled that those chats make focused fixes in
one module only. This diary, the project `CLAUDE.md`/`AGENTS.md` and `FINAL-REPORT.md` are the handover. The
internal repository has uncommitted files (this diary and the earlier review diary); Max commits and pushes it.

## What was achieved & how to use it

**The product.** Public site, travel-agent portal (individual and bulk intake), operator, SuperAdmin and Accounts
surfaces; catalogue and launch control with country adapters; documents pipeline (ClamAV, sandboxed parse, OCR,
MRZ); case model with Gate 1 and Gate 2 payment controls; operations case work, incidents and custody; payment
records; delivery ("Sent in full", never "Received"); projections and measures; releases, cutover, rollback,
backup and restore. About 94,000 lines of TypeScript, 53,000 lines of tests, 26 migrations, about 270 routes.
Full description: `internal/records/FINAL-REPORT.md`.

**Where the knowledge is.**

| Need | Read |
|---|---|
| Rules every task chat follows (deploy script, focused fixes, module map, debugging notes) | `CLAUDE.md` = `AGENTS.md` at the product root (git-excluded, local only) |
| What was built, decisions, parked items, owner inputs | `internal/records/FINAL-REPORT.md` |
| Architecture (layers, ownership, topology) | `docs/architecture.md`; `internal/records/design/00-architecture-brief.md` |
| Kernel and instance contract (sections 16–22: extension, decisions D-01..D-10, topology, release binding, same-person evidence) | `internal/records/design/01-foundation-contract.md` |
| Module designs | `internal/records/design/11-…` to `15-…` |
| Stack and engineering overrides EO-01..EO-21 | `internal/records/ENGINEERING_OVERRIDES.md` |
| Milestone evidence and parked P2 findings | `internal/records/verification/2026-10-0*-*.md` |
| Orchestration telemetry and retro | `internal/records/reviews/2026-10-06-m3-review-telemetry-and-orchestration-policy.md`, `…-orchestration-retro-notes.md` |
| Independent review after the build (3 open P1 questions) | `internal/records/diary/2026-10-08-independent-architecture-and-ui-review.md` |
| Procedures and refusal codes | `docs/operations.md`, `docs/playbooks/` |

**The preview.** Root `~/.local/share/travelmudra-preview`, units `tm-core`, `tm-edge`, `tm-staff`, `tm-postgres`,
`tm-clamd` (linked, not enabled at boot). Accounts `syn-ta-1..3`, `syn-operator-1..3`, `syn-superadmin-1..2`
`@synthetic.test`. Codes come from `signin-codes.mjs`, which Max runs in his own terminal. From the Mac, tunnel
with identical port numbers and use Chrome or Firefox (Safari rejects `__Host-` cookies on plain http).

**The UAT script.** All local installations and deployments go through `scripts/uat/uat.py` (config file per
installation, shared port registry with a file lock, resumable `up`, `deploy`, `status`, `stop`, `start`,
`cleanup --confirm`, `adopt`, `ports`, `suggest-ports`). Full usage in `scripts/uat/README.md` and `CLAUDE.md`.

```bash
cd /home/max-stravion/projects/Critical/MaxHyperVisaFullPortalImplementationOpus5.5
python3 scripts/uat/uat.py status preview
python3 scripts/uat/uat.py deploy ~/.local/share/travelmudra-uat/configs/preview.json --ref <commit-or-tag>
python3 scripts/uat/uat.py suggest-ports
python3 scripts/uat/uat.py ports
node ~/.local/share/travelmudra-preview/signin-codes.mjs --list      # safe; never pass an email in an agent chat
journalctl --user -u tm-core -n 200 --no-pager
npm run typecheck && npx eslint <changed files>
node --test --test-concurrency=4 --test-global-setup=test/support/global-setup.ts "test/<module>/**/*.test.ts"
npm run check                                                        # full gate: only for kernel/contracts/platform/migration changes
```

## Details of what we did

1. **Start (4 Oct).** Verified the specification hash, moved it to `internal/records/BUILD_SPEC.md`, installed the
   repository boundary (forbidden words and paths in tracked files and commit messages) before the first commit.
   Max delegated every run decision ("go with your recommendations, i wont interrupt") with a standing authority:
   the orchestrator alone merges to local `main` and tags each milestone; nobody pushes; no production effects.
2. **Stack change (4 Oct, Max).** The first design used SQLite and zero dependencies. Max asked to install the
   best free components, sized for a production host of about 1/8 of the development machine (≈7 vCPU, 8 GB), and
   refused a paid scanner. Result: PostgreSQL 16, Fastify, zod, ClamAV, Tesseract, ALTCHA, age, a rootless
   toolchain (EO-01..EO-07). The SQLite design workflow was stopped and rerun.
3. **Roles and UI direction (Max).** Orchestrator = principal technical architect; implementation workers =
   Principal Software Engineer; UX agents = Principal UX Engineer. UI: clarity, trust and speed over spectacle;
   three design skills (UI UX Pro Max, Impeccable, Taste); design system first, one bounded final UX pass.
   Maintainability and extension (new countries by adapter package, new services by data) are first-class (EO-19).
4. **Topology (Max, M3).** Max asked how many servers were needed and required travel-agent and bulk upload to be
   separate from operations and the database: "single machine but 3 separate instances … api calls only, dont
   build and test them as monolith". Built as core/edge/staff with contracts, per-instance secrets, mutual TLS and
   per-service allowlists (contract §20–21), in stages A (split), B (port every route), C (delete the single
   process path, three-instance restore, systemd units).
5. **Lanes and efficiency (Max, 5–6 Oct).** Max first allowed five parallel lanes, then capped them at three after
   session limits hurt progress, and required compact handoffs (files changed, contracts changed, tests,
   unresolved findings, short rationale) so the parent reviews diffs, not narratives. A snapshot-and-continue
   procedure (`internal/records/RUNBOOK-resume.md`) recovered from every usage-limit pause.
6. **Privacy (Max, 6 Oct).** Max asked about pushing and running UC in the cloud, then decided: "my data remains
   private, no body is able to access it. Not even anthropic". Everything stayed local: no cloud sessions, no
   Artifact publishing. Max made one backup push himself (main 819139e with m1/m2 tags).
7. **Orchestration pivot after M3 (Max, 6 Oct).** Max kept the intelligence but cut redundant loops: P0 gets an
   independent reproduction; P1 is reproduced by its fixer with no extra verifier; P2 is parked; targeted tests in
   agents and the full suite only at the milestone gate; narrow review commissions; M6 deliberately heavy. Max asked
   for metrics (tokens per accepted defect, unique defects per reviewer, verifier reversal rate, fix-check
   rejection by priority, marginal yield per layer). Result recorded in the M3 telemetry review: narrow commissions
   found more defects per token (M4 8.2M processed tokens per accepted defect against 10.2M in M3); separate P1
   verifiers reversed nothing. Max allowed the orchestrator to raise the three-writer cap when no sub-agents run
   inside workers; the accepted rule became writers ≤3, read-only ≤5.
8. **Merge-rule correction (Max, 7 Oct).** The orchestrator had run the full suite at every intermediate merge into
   `main`. Max pointed out the standing authority ties checks to the milestone. Rule since then: stages integrate on
   integration branches with affected-subsystem tests; `main` receives one merge per milestone after that
   milestone's full checks. This cost hours but reduced limit hits.
9. **Milestones.** M1 kernel and platform; M2 identity, catalogue, documents; M3 cases, intake, payments plus the
   three-instance split (P0 found: an identity swap through corrections, fixed with the same-person evidence rule
   §22); M4 operations, delivery, views (EO-20: primary lists read authoritative tables); M5 release, recovery,
   verification (EO-21: release binding of running processes; four release-binding defects and an unapproved lossy
   restore reopening fixed); M6 final assurance (4 P0 and 17 P1 fixed, stability work found three real defects:
   processing-client ECONNRESET, cutover checkpoint drain, backup output; final UX pass UX-1..13 including a privacy
   defect that showed another applicant's file).
10. **Incidents.** The desktop app became unreachable twice overnight, which blocked Workflow and MCP tools; work
    continued with the Agent tool at a higher effort than Max's preference (recorded). A power outage stopped a run;
    it was recovered from WIP commits and the workflow journal; `/tmp` was wiped, so agent context moved to
    `internal/agent/context/`. One agent hung on an invisible approval prompt and was stopped.
11. **Close-out (8 Oct).** Final gate on `m6-ux-final` (three full runs), one merge into `main`, annotated tag,
    verification record, final report, worktree and branch cleanup (only `main` remains), preview installed from
    the tag with a private sign-in helper. Max pushed. Max asked how future UAT deploys can avoid spending tokens;
    the orchestrator wrote `uat.py` (fede68a), tested `up`, `deploy`, collisions, parallel installs and cleanup,
    and recorded the "use only this script" rule in the project `CLAUDE.md`/`AGENTS.md`.
12. **Handover rule (Max, 8 Oct).** Future chats work on one focused fix in one given module, never a full code
    scan or a change spanning modules, to avoid dilution of the code and extra cost. Recorded in `CLAUDE.md`
    ("Focused fixes only", "How the system works", "Module map").

**Key outcomes**

- A complete local build to the specification with recorded decisions, 1846 tests, traceability of 399 design
  identifiers (317 proven, 78 partial, 4 gaps) and a working three-instance preview.
- Owner inputs still needed before public release: business location and contact, privacy and terms pages, the
  public country list. Production readiness (real mail, Cloudflare or a proxy, per-instance OS users, sizing) is a
  later phase that Max drives.
- Open questions for Max: three P1s from the independent review (continuation COMMIT classification, capability
  version history, cross-country adapter reuse) and the parked P2 list in `FINAL-REPORT.md` section 6.

**Retro nuggets:**

- Narrow, invariant-targeted review commissions beat broad lenses per token, and a fixer's own failing-test
  reproduction makes a separate P1 verifier redundant. Cap UX fixers at five findings per screen group: carrying
  screenshots in a worker's context was the largest single cost.
- Read the standing authority literally: "checks pass on the integrated result" applies per milestone, not per
  intermediate merge. Ask once when a rule's scope multiplies test time.
- Workflow resume caches by prefix: editing or moving an early `agent()` call reruns every later one. Never launch
  a workflow or `cd` from `internal/` (it created product worktrees in the private repository); use `git -C`.
  Keep durable agent context in the repository, not `/tmp`.
- Test harness quirks: each parallel database test run needs its own short `TMPDIR` (≤40 characters or it falls
  back to `/tmp` and reaps other runs' clusters); `prlimit --as` breaks Node, so workers use systemd user scopes;
  the boundary scan flags hex like `b16` in branch names (`B[0-4][0-9]`) and `P-256` (use `prime256v1`); a UAT
  port can look busy in `TIME_WAIT`, so the port probe uses `SO_REUSEADDR`.

Not observed directly by this diary: the exact content of the session between the 6 Oct and 8 Oct compactions is
known only from the compaction summaries; milestone details beyond them are in the verification records. At the
time of writing a unit `tm-bulk-experiment-20261008-113052-…` was running beside the preview; this session did not
create it, so it probably belongs to another chat, and it was left untouched.
