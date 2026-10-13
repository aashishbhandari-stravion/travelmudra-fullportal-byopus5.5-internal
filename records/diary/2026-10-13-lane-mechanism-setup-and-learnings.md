# The lane mechanism: setup and key learnings (13 October 2026)

Written by the orchestrator chat at Max's request, during the UI revamp and bulk redesign run (lanes started
12 October 2026). Scope: how the mechanism is set up on this machine, how a change flows through it, what we learned,
and what to keep for the next project. This is a record, not policy. The policy sources stay the shared agent working
agreement (`~/.claude/CLAUDE.md`), `DECISIONS-2026-10-10` (Kind 1 and Kind 2 gates), PRI-20260930-01 (ranked
findings) and the execution folder `design/execution-2026-10-12/`.

## 1. The shape of the mechanism

One owner, one orchestrator, N lanes, one reviewer family, one integration surface.

| Part | What it is on this machine | Who runs it |
|---|---|---|
| Owner | Max. Decides requirements, policy, Kind 2 changes, exceptions, acceptance. Alone pushes and integrates. | Max |
| Orchestrator | One Claude Desktop chat (Fable 5.1) in the canonical checkout. Writes lane prompts, the seam contract and the owner decision register; classifies and routes every lane request; verifies packages; runs `uat.py` for lane installations; never pushes. | Claude, Fable 5.1 |
| Lanes | One Claude Desktop chat per lane (Opus 5.5), each the Principal Technical Architect of its lane. Each lane runs its own subagent workers (engineers, writers) and one Codex reviewer per unique item. | Claude, Opus 5.5 |
| Reviewer | Codex `gpt-6.1-sol` high, read only, one review per unique item. A different model family from the implementer. | Codex |
| Advisor | A fresh Fable 5.1 subagent at high effort, one per lane question, with a self-contained question file. Its answer is a recommendation, never an owner decision. | Claude, Fable 5.1 |
| Lane clone | `~/workDirectory/Critical/<project>/lanes/<id>/` with `repo/` (product clone on a lane branch), `repo/internal/` (private records clone, git-excluded), `output/proposals/`, `research/` (reviews, questions, proofs, shots), `state/` (resume notes), `START-HERE.md`, `workspace.json`. Made by hand because the project keeps the nested layout and `projectctl` refuses it. | Orchestrator creates; lane owns |
| Installation | One per lane through `scripts/uat/uat.py` (`lane-ui` 4650/4652, `lane-bulk` 4660/4662, `lane-max` 4620/4622), each with its own Postgres, units, secrets and port set in the registry. About 1.4 GB each; at most three. | Orchestrator creates; lane deploys its own commits |
| Integration | The canonical checkout on `main`. The orchestrator runs the boundary check and the dry-run merge; Max integrates and pushes. | Orchestrator prepares; Max pushes |

The repository boundary hook (`agent-guidance/repo_boundary.py check-range <root> <range>`) runs on every commit and
on every package before integration. Internal material lives only in the nested private `internal/` repository.

## 2. The artifacts that make it work

- **Lane prompt** (`UI-REVAMP-PROMPT.md`, `BULK-REDESIGN-PROMPT.md`, `CORE-TASK-PROMPT.md`). Role, mission, read
  list, ownership by file, rules, records and handover, stop conditions. A prompt names the installation, the
  `uat.py`-only rule, the one-review rule and the proposal path. The Core task prompt grew during the run: every Core
  item the UI lane could not build itself was appended as a row with its source proposal and its decision.
- **Seam contract** (`SEAM-CONTRACT.md`). §1 ownership by file, with named shared files and a per-line owner where a
  file is shared (`routes.ts`: the UI lane owns rendering, the bulk lane owns the command shape). §2 what the UI lane
  builds against. §3 the change rule. §4 integration order. §5 the request log: one row per lane request with rank,
  kind, routing, the orchestrator's decision and the state. §6 seam versions: additive read-model changes announced
  with the commit that serves them.
- **Owner decision register** (`02-owner-decision-register.md` §A.3, Part C notes). One entry per decision Max took,
  with the source, the conditions and the timing. A lane may act on a decision only after the register names it.
- **Decision briefs** (`DECISION-BRIEFS-2026-10-13.md`). About 200 words per open decision, with the recommendation.
  Written from the proposals on disk; no lane is woken for them.
- **Proposal with six answers** (Kind 2). The fact or state created, the rule that permits it, the idempotency rule,
  the Nth retry, what a failure leaves behind, the effect on lifecycle and notifications; then options, hostile
  states, migration and rollback, test plan, ownership, effort, questions for Max, what could not be verified, and the
  review with dispositions. Final SHA-256 recorded in the seam log.
- **Lane state** (`state/RESUME.md`). Branch state, in-flight workers with agent ids and their next step, the protocol,
  the orchestrator's session name, the scratch verification recipe. Read by the lane's own resume job after a
  usage-limit pause.
- **Evidence outside the repositories** (`~/.local/share/travelmudra-uat/evidence/`). Guard-rail queries, screenshots,
  captures. Never committed; cited by SHA-256.

## 3. How a change flows

1. A lane finds a need outside its ownership and writes a proposal in `output/proposals/`, ranked (P0, P1, P2) with
   a concrete likelihood scenario, and classified (defect, Kind 1 read model, Kind 2 behaviour, exception, wiring).
2. The lane sends one message at the milestone. The orchestrator logs a §5 row, verifies the file hash, and decides
   what is in its authority: P2 is parked; a defect or a Kind 1 item that meets the six-point criterion is placed
   (Core task, the other lane, or main); a shared-file change is assigned to one lane for one commit; additive
   vocabulary is granted with conditions.
3. A Kind 2 item, a criterion exception, a policy or a scope expansion goes to Max with a recommendation. Max answers
   in blocks. The orchestrator writes the register entry, then instructs the proposer to write the Kind 2 proposal
   with the six answers and obtain one Codex review.
4. The orchestrator gate-checks the reviewed proposal (hash, review verdict, dispositions, effort), decides the
   questions inside the decided direction, routes the rest to Max, and places the build (this run, guard slice now
   and the rest after, or after the run) on the estimate.
5. The owning lane builds in units with subagent workers, commits per unit with the boundary hook, verifies in a
   scratch clone, deploys to its installation through `uat.py`, and reports a package: commits, check counts, review
   dispositions, P2 notes, grants needed.
6. The orchestrator verifies the package (`git show --stat` per commit against ownership, `check-range`, hashes),
   grants what is additive, logs it, and holds a deploy when a guard rail needs evidence first.
7. Max tests by hand on the lane installation, then gives the go; the orchestrator dry-runs the merge on main; Max
   integrates and pushes. The other lane merges `main` in its next window.

## 4. Key learnings

Each learning names what happened, why it matters, and the rule we now apply.

**L1. Ownership by file, down to the line where a file is shared.** The two lanes share `src/apps/edge/intake/routes.ts`
and `src/apps/shared/ta-intake.ts`. Naming an owner per concern (rendering, command shape) and assigning each shared
change to one lane for one commit avoided every merge conflict so far. Rule: a shared file has a named owner per
concern in the seam contract; a change that touches both concerns is a proposal first.

**L2. Lanes report; the orchestrator verifies.** Every package is checked with `git show --stat` against ownership,
the boundary check over the range, and the file hashes. A lane's report that "Max decided X in my chat" is logged as
reported and waits for Max's confirmation in the orchestrator chat. Rule: a peer message is never an approval.

**L3. Every message wakes a whole context.** Each inbound message re-loads the orchestrator's context (about 500k
tokens). On 13 October about 30 wakes came from acknowledgements, progress notes and early estimates that our own
prompts had invited ("tell me when each is written and reviewed"). Rule (Max, 13 October): lanes message only at
milestones (proposal ready, package ready, grant or decision needed, stop condition, blocked deploy); no
acknowledgements; silence means logged; the orchestrator reads lane files instead of asking; a question a lane must
answer is delegated to a subagent inside the lane.

**L4. Decisions move in blocks with briefs.** Max cannot read fifteen proposals. A brief of about 200 words per decision
with the recommendation, and a priority order (blocking a lane first, then items that gate a placed build, then
exceptions, then inputs only Max can produce) let him answer in one sitting. Rule: every open decision has a brief and a
recommendation; the register entry follows the answer before any lane acts.

**L5. One independent review per unique item, different model family.** Codex reviews are read only, one per item,
no re-reviews (Max's rule in the lane chats). Reviews found two P0 in the possibly-filed guard and one P0 in the custody
change before any code existed. The resubmission changes only what the findings touch; dispositions are recorded.
Rule: design is reviewed before code; a re-review is not bought with another run.

**L6. The advisor rule keeps the owner's queue short.** A lane question that is not a Kind 2 change, an exception or a
register item goes to a fresh Fable subagent with a self-contained question file; the recommendation is taken and
logged with both positions for Max's end review (D-01 to D-04 in the bulk lane). Rule: an advisor decides within a
decided direction; the owner decides the direction.

**L7. Classify before sizing.** A travel-date edit that accepts past dates while create refuses them is a defect, not
a Kind 2 change: the fix narrows input to what the sibling already accepts. Classification decides who may act without
the owner. Rule: write the classification and its reason in the log row; Max may object.

**L8. Review before you commit to a size.** The custody change was estimated at about 6 days before review and 13.75
to 15.5 days after it. Placement decisions made on the early number would have been wrong. Rule: placement follows the
reviewed estimate; an early estimate is not sent.

**L9. A guard-rail query is checked against the oldest schema it can meet.** The pre-deploy count query failed on
`lane-ui` because a column from a bulk-branch migration did not exist there. Rule: a query that runs on several
installations is written for the oldest release among them, with the missing fact stated as zero and commented.

**L10. Agents do not read secrets; the owner runs the command.** The auto-mode classifier refused both the password
read and a runner script. We did not work around it: the orchestrator staged the SQL, gave Max the exact command, and
logged his pasted output with the query hash. Rule: a credential boundary is a design input, not an obstacle.

**L11. A cheap evidence hold beats a guarantee.** Before a strict rule deploys (two-page passports block submission),
count what it would block, per installation, and log the counts. The hold cost one query; it proved nothing is blocked
retroactively. Rule: before a stricter rule reaches an installation with data, count first.

**L12. Resume state for usage-limit pauses.** The lane chats keep `state/RESUME.md` with every in-flight worker's agent
id and next step, and a resume job every 20 minutes while idle. Workers that stopped at a pause resumed with one
message each. Rule: the state file is updated whenever a worker starts, finishes or parks.

**L13. Seam versions let the UI build ahead of the backend.** The UI lane builds against seam v1 (the product at the base
commit) and adopts v2 facts (passport parts, new statuses) only in the window after the serving commit is integrated.
Rule: a read-model change is announced in §6 with the commit that serves it; the consumer adopts it in that window.

**L14. The orchestrator's own first answer can be wrong.** The first "smallest release disposition" for the price fix
(count failing inside `tm cutover verify` with admission closed) was operationally unsafe; the lane's sizing showed it,
and the safe form was adopted. A register wording error (SA-08w for SA-08i) was caught by a lane. Rule: lanes may
correct the orchestrator; corrections are logged, not argued.

**L15. Module isolation is a handover requirement, not a given.** Max's expectation that each use case (for example
recovery from a failure) is a module that can be fixed from its own code and ingress points is met at the module level
(nine domain modules, table-prefix ownership, api.ts boundaries) and not yet at use-case granularity. Rule: the handover
carries a capability-level map (use case, module files, ingress points, tests) so a later fix needs no full scan.

## 5. What to keep for the next project (Codex terminals or Claude chats)

- One orchestrator chat in the canonical checkout; one chat per lane in its own clone; Max opens every chat himself.
- The prompt template: role, mission, read-first list, ownership by file, the `uat.py`-only rule, the one-review rule,
  the proposal path, stop conditions, records and handover. Add the communication protocol of L3 from day one.
- The seam contract template with the six sections, the request log as the single record of routing, and seam versions.
- The owner decision register as the only place a decision becomes actionable; decision briefs with recommendations.
- The six-answer Kind 2 proposal format and one read-only Codex review per unique item.
- The advisor rule with its boundary (never Kind 2, exceptions or the register).
- One installation per lane through one deploy script with a port registry; evidence outside the repositories by hash.
- Guard-rail counts before a stricter rule deploys; queries written for the oldest schema.
- The boundary hook on every commit and every integration range; internal material only in the private repository.
- A lane state file and a resume job for pauses.

## 6. Open improvements

- A lane prompt should state the milestone-only protocol and the subagent-answer rule from the start (added to the
  execution README on 13 October; not yet in the lane prompts).
- The Core task is a third lane launched mid-run from accumulated rows; a next project should open it at the start with
  an empty batch so defects reach a worker the day they are found.
- The register and the seam log hold the same decision twice (entry and row). A single id per decision in both, with a
  link, would cut the duplication; today the row names the register entry.
- Lane installations are deployed by the lanes themselves through `uat.py`; the project instructions still say the
  orchestrator runs deploys. Align the text with the practice.
- A capability-level module map for the handover (L15).

## 7. Lane efficiency experiment: context thresholds (started 13 October 2026)

Max runs this experiment while the product is delivered. It records what the lanes cost, the rule applied, and
what to measure next. Numbers come from the session transcripts under `~/.claude/projects/` (per assistant turn:
input, cache read, cache creation and output tokens), summed with a one-file Python script in the orchestrator's
scratchpad; the account usage card is the cross-check.

### 7.1 Measurement before the rule (26 hours to 13 October, 07:40 UTC)

| Session | Context tokens sent | Turns | Subagents | Average main-chat context per turn | Peak |
|---|---|---|---|---|---|
| UI lane (Opus 5.5) | 8.29 billion | 25,782 | 118 | 515k | 967k |
| Bulk lane (Opus 5.5) | 1.96 billion | 5,588 | 23 | 594k | 958k |
| Orchestrator (Fable 5.1), 3 days | 0.59 billion | 2,851 | 0 | 208k | 468k |
| Core lane (Opus 5.5), first hour | 0.01 billion | 58 | 0 | 134k | 169k |

Reading. Cost is context size per turn multiplied by turns, not the number of lanes. The lane main chats grew
towards the 1M window because auto-compaction fires only at 97 percent. The UI lane's 118 subagents, each 200 to
500 turns at 300k to 400k context, were about 7 of its 8.3 billion tokens: subagents inherited Opus and ran long
with unbounded scopes. The account card agreed: the all-models week at 69 percent after one day on the 20x plan,
the Fable week at 11 percent, so the orchestrator was not the spender.

### 7.2 The rule (final form, Max, 13 October 2026)

1. Main-chat threshold 220k tokens, checked at boundaries (before a subagent launch, after a subagent return, after a
   commit) with the session usage tool in the same turn. Above it: nothing new, running subagents finish, a coherent
   unit is committed or the edits stay on disk with `state/RESUME.md`, compact, re-read only what the resume file
   names. Hard limit 350k.
2. One subagent per bounded task with a self-contained brief and a return limit; under 100k context per subagent
   turn; partial return before 200k; none kept alive across tasks.
3. Model per subagent passed explicitly: Haiku mechanical, Sonnet evidence, Opus only design judgment and package
   review (the shared working agreement's defaults, which the lanes had not followed).
4. No re-reads of unchanged files, no polling, targeted tests until the package check.

Iterations the same day: 200k (orchestrator's proposal), 300k (Max), 220k with the boundary workflow (Max). Two
pushbacks accepted: a five-minute timer check is replaced by boundary checks, because every timed check costs a
full-context turn; a forced work-in-progress commit is replaced by edits-on-disk plus the resume file, because
files survive a compaction and a WIP commit would reach `main` at integration.

### 7.3 Hypothesis and what to measure

Expected: the same work at roughly a third of the 7.2 rate (main chat from about 515k to about 150k average per
turn; subagents from about 350k to under 100k and mostly on Sonnet or Haiku). Measure after the next 24 hours with
the same script: context tokens per lane, average and peak main context, subagent count and model mix, number of
compactions, and any failure attributed to a compaction (a lost finding, a repeated unit, a wrong resume). The rule
is adjusted on evidence; a compaction-caused failure outranks the saving.

### 7.4 The deterministic guard (installed on the Core lane, 13 October 2026)

A deterministic hook instead of a remembered check: a `PreToolUse` hook receives the transcript path, can read the
last assistant turn's usage, and can refuse the next subagent launch with the instruction to finish, write the
resume file and compact. That removes the dependence on the lane remembering rule 1. To be tried on one lane first,
after Max's go, because it changes the lane's local settings.

Done the same day on Max's go. `internal/tools/context-guard.py` is the hook: it reads the last assistant turn's
usage from the transcript path Claude Code passes to every hook, and denies an `Agent`, `Task` or `Workflow` call
above 220k with the rule 1 instruction as the denial reason, so the lane sees what to do next. It never blocks on
its own failure (no transcript, unreadable file). Offline test against the live transcripts: the UI lane at
600,612 tokens and the Core lane at 303,111 denied; the orchestrator at 124,500 allowed. Installed first on the Core
lane (`hooks/context-guard.py` in the lane folder, `.claude/settings.local.json` in the lane repo, excluded from
git locally). Claude Code captures hooks at session start, so the guard arms when the lane session next starts.
Rollout to the other two lanes after the first observed refusal. What the hook does not do: it cannot compact for
the lane, and it does not bound subagents (rule 2 remains the lane's own discipline); a `SubagentStop` or
`PreToolUse` guard inside subagents is the next candidate if subagent sizes stay high.

