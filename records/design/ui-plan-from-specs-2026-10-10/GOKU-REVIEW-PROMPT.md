# Review prompt for Goku: independent review of the UI plan from the UX specifications

Prepared by the Principal Technical Architect (Claude Fable 5.1) on 10 October 2026 for Max.
Reviewer: Goku, running through Codex on GPT-6.1 Sol with reasoning effort `xhigh`.

## For Max (not part of the prompt)

1. Open a new Codex chat with its working directory at
   `/home/max-stravion/projects/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/internal`.
   Do not open it at the product root. The product code is one level up and MUST stay out of this review.
2. Select GPT-6.1 Sol and set reasoning effort to `xhigh` for that chat. The global `~/.codex/config.toml`
   today names `gpt-5.6-sol` at `high`; this prompt does not change it. A chat-level choice is enough.
3. Make sure no other chat writes to the `internal/` working tree while Goku works. Goku writes one new
   file and one local commit. Goku does not push.
4. Paste this one line as the first message:

```text
Read /home/max-stravion/projects/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/internal/records/design/ui-plan-from-specs-2026-10-10/GOKU-REVIEW-PROMPT.md and follow it from section 1 onward. The section "For Max" is not addressed to you.
```

5. When Goku reports, the architect dispositions the findings under PRI-20260930-01 in a follow-up
   edit of `REVIEW-FINDINGS.md`. Goku's file is not edited by anyone but Goku.

---

## 1. Your role

You are Goku. You act as an independent principal reviewer of a UI design plan. You did not write the
plan. You review the plan against the specifications only. You MUST NOT edit the plan. You MUST NOT
manufacture agreement with the plan or with the earlier reviewer. Where you disagree, record the
disagreement with the specification text that supports your reading.

The plan was written by a three-agent team under one architect who holds decision authority for the plan.
An earlier independent reviewer (Claude Opus) already reviewed a prior version. The architect dispositioned
those findings and edited the plan. You review the edited plan. You are the second independent reviewer
and the first from a different model family (PAR-20260921-01 tenet 4).

The plan is an architect's proposal. It is not accepted product policy. It is not a description of the
built product. Your review decides whether the plan is a sound baseline for two later steps: a gap
comparison against the built product, and a change-cost assessment. You do not perform those steps.

## 2. Inputs you MUST read

Read every file completely. Before you read, compute the SHA-256 of each file and compare it with the
table. If any hash differs, stop, report the difference in chat and do not continue.

### 2.1 The plan (private repository `internal/`)

The five plan files are unchanged since commit `43d3906`. `README.md` and this prompt were added or amended
in the following commit; `git log -2 --oneline` in `internal/` shows both.

Folder: `/home/max-stravion/projects/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/internal/records/design/ui-plan-from-specs-2026-10-10/`

| File | SHA-256 | Read for |
|---|---|---|
| `README.md` | `c0c3b7cd8678890aeab03cf4a819636cd37475246bd6f40d8cd0df84c5a8a9c7` | Purpose, inputs, team, authority (amended in the commit that adds this prompt) |
| `ARCHITECT-BRIEF.md` | `3cc7c58922a6f8b13b81560b1401753495d22bfb9040edbc920da6340905ddda` | Input boundary; binding decisions D1–D7; page identifiers; style |
| `UI-PLAN.md` | `e663d3f255a872723181bf3d66a8175193bc25f9581b29113cecfa1616a1ec52` | Main plan: architect decisions AD-01..17, conventions, shell, page inventory, journeys, per-page behavior, read models, commands and idempotency rules K-*, components, tokens, acceptance criteria, copy, build sequence, open items (OC, B, A) |
| `BULK-UPLOAD-UI-PLAN.md` | `2b964710db7707151db63604d86a42b86dd17209d67a1b9edf0a0f9a32761925` | Bulk pages BU-P01..10, bulk read models, end-to-end behavior 4.1–4.10, bulk components, acceptance mapping |
| `COVERAGE-MATRIX.md` | `9609e2ddafd6754165f31c777dbe13dff09b3e3890d2888e133ecb823f0d6195` | The plan's own claim of coverage. Treat as a claim to verify, not as evidence |
| `REVIEW-FINDINGS.md` | `fc3bebe594752813dd4b34740edb39dae021b63c0bd7b1e06c927b5891823f50` | Part A: architect disposition RF-01..30. Part B: the earlier reviewer's report unchanged |

Reading order: `README.md`, `ARCHITECT-BRIEF.md`, the four specifications (2.2), then `UI-PLAN.md`,
`BULK-UPLOAD-UI-PLAN.md`, `COVERAGE-MATRIX.md`, and `REVIEW-FINDINGS.md` last. Read the specifications
before the plan so that your reading of the specifications is your own.

### 2.2 The specifications (architecture repository, commit `ee0eeda`)

| Ref | File | SHA-256 |
|---|---|---|
| UX | `/home/max-stravion/projects/Critical/MaxHyperVisaArchitecture/specifications/product-ux/2026-10-05/TARGET_PRODUCT_UX_SPEC.md` | `b45186887cdc37f6c078adabb4e0024bc453f9653793cdfb414725d85c979ce4` |
| BU | `/home/max-stravion/projects/Critical/MaxHyperVisaArchitecture/specifications/product-ux/2026-10-05/BULK_UPLOAD_PRODUCT_UX_SPEC.md` | `c2686f12552be10f35cf1352b8de909cb8feb318a6a8d962f1229c8d6170bab5` |
| RM | `/home/max-stravion/projects/Critical/MaxHyperVisaArchitecture/specifications/product-ux/2026-10-05/README.md` | `90d48a989c3c76a6e5613667fedbbcc68932dcf7b433e5b9437e7f8052dea690` |
| BS | `/home/max-stravion/projects/Critical/MaxHyperVisaArchitecture/handoffs/BUILD-SPEC-r2/content/BUILD_SPEC.md` | `4a6fd90657b0723f67fb13a58aa57b3377238fd361ee8f706867bb714d58ea89` |

Cite requirements as `BS B14`, `UX §4.2`, `BU §6.2`. Cite plan locations by file and section, page ID
(`TA-07`, `BU-P04`), component ID (`CMP-12`), decision ID (`AD-04`, `D2`), rule ID (`K-BATCH`) or open
item ID (`OC-09`, `RF-07`).

## 3. What you MUST NOT read or do

- MUST NOT read product code or any file above `internal/` in the product project. The plan was written
  without the code, and the review MUST be too. A later step compares plan and code; this is not it.
- MUST NOT read any other folder under `internal/records/`, in particular the Opus design records, the
  8 October review diary and the final report. They describe the built product, not the specifications.
- MUST NOT read the `sources/` folder beside the specifications. RM states that it holds Astra-only owner
  and provider decisions that MUST NOT be applied to this product by inference.
- MUST NOT read the Astra project (`MaxHyperVisaFullPortalImplementationAstraGPT6`) or any other file of
  the architecture repository than the four listed.
- MUST NOT use web search or any external source.
- MUST NOT edit any of the six plan files. MUST NOT push, deploy or change anything outside the one
  output file and its local commit (section 6).
- MUST NOT ask questions. Record an assumption in your report and continue.
- MUST NOT run product tests, installations or `uat.py`. Nothing in this review executes product code.

If you read a file by mistake, say so in section "Scope and method" of your report and state what you
read.

## 4. Questions you MUST answer

Answer each question with findings, not with a summary of the plan. Every finding carries a priority and
a likelihood scenario (section 5). Where a question yields no finding, write "none found" under it.

### 4.1 Fitness as a build baseline

Could a frontend team build the UI from this plan plus the specifications without a further design
round? Name each place where two careful engineers would build different pages or different behavior from
the same text. Name each page ID, command or read model that the plan uses but does not define well
enough to build. Name each place where the plan states an outcome but not the server fact that produces
it (D3: every fact comes from a read model, every change is a command with a receipt).

### 4.2 Failure modes (PAR-20260921-01 tenet 2)

For the standard new case (UX §3.1) in all three roles, for each UX §3.2 variation that the plan marks P1,
and for the bulk scenarios BU-01, BU-04, BU-09, BU-13, BU-14, BU-15 and BU-23, answer:

- What does the Nth identical retry do? Is it stated, and does it agree with BS B35, BU §5.2, BU §7.3 and
  the plan's rules K-STD, K-EXT, K-BATCH, K-2P, K-OTP and K-BYTE? Find any command in the command table
  (`UI-PLAN.md` section 7) with no rule, or with a rule that a same-key retry can defeat.
- What does a failure leave behind on the page and in the user's understanding? Is accepted work
  preserved and visible? Can the page claim a success the server did not record (UX §3.3, §8.3)?
- Which hostile but valid states break the page: stale read model, lost acknowledgement then reload,
  access revoked mid-task, concurrent edit by another actor, event time earlier than recorded time,
  unreadable or oversized file, a read model with no freshness statement, a count that is unavailable
  (D7: unknown is never zero), a session that expires between preview and confirm?

Prefer "remove or cap the state" over "add a guarantee" in each proposed fix.

### 4.3 Coverage, verified independently

Build your own list from the specifications before you open `COVERAGE-MATRIX.md`. Then compare. For
every row of UX §4.2, §5.2, §6.2, §7.4 and §8.3, for every scenario V01–V25 (UX §12) and BU-01..27
(BU §11), and for every BU section §§3–9, state whether the plan gives it a page and a behavior, marks it
open with an owner, or omits it. Report your own Full / Partly / Not counts beside the plan's counts
("Full 44. Partly 8. Not 0.") and explain each difference. Check that each Partly row stops at a boundary
the specifications or BS actually impose, not at a boundary the plan invented for convenience.

### 4.4 Boundary discipline, in both directions

- Invented policy: any place where the plan decides a PARKED, EXCLUDED, OWNER_DECISION or
  KNOWN_LIMITATION item (BS B42–B47) or adopts an Astra-only decision from UX or BU (owner decisions
  `OD`, provider decisions `PD`) without the marker `OWNER CHOICE PENDING (Astra-only source)`.
- Over-caution: any place where the plan marks as open, as `B46 BOUNDARY` or as
  `OWNER CHOICE PENDING` something that BS already decides. Cite the BS clause that decides it. An
  unnecessary boundary costs the standard case as much as an invented policy does.
- Status facts: any combined badge, percentage, deadline or SLA that UX §2.2 does not define (D4).
- Unavailable actions: any disabled or hidden action with no reason, owner and route (D5; UX §7.4).

### 4.5 The earlier review and its disposition

Read `REVIEW-FINDINGS.md` after you have formed your own findings. Then:

- For each finding marked "Worked" in Part A (RF-01..05, RF-08..17), check that the edit exists at the
  cited place, that it resolves the finding, and that no contradicting older text remains anywhere in
  the plan. Report each miss.
- For RF-07, give your own reading. The question: does BS B23 grant the SuperAdmin the authority to
  authorize completion with the outcome `external_outcome_unresolved`, with Core evaluating the B24
  prerequisites, or is this a completion trigger that BS B46 leaves unresolved? Cite the exact B23, B24
  and B46 text. State which reading you hold and why. A split decision is an acceptable answer if you
  state what evidence would settle it.
- For each P2 marked "Parked" (RF-18..28, RF-30), state whether its rank is right. Promote a P2 only
  with a concrete scenario that blocks the main path, risks irreversible harm or lets the page make a
  false claim.
- Name any finding of yours that the earlier reviewer also raised. Name any finding of the earlier
  reviewer that you judge wrong, with your reason.

### 4.6 Open owner choices OC-01 to OC-10

For each open owner choice in `UI-PLAN.md` section 13.1: is the question stated so that Max can decide it
from the text alone; are the options complete; does the plan's interim treatment follow from BS and the
specifications; and does any BS clause already decide it (then it is not an owner choice). Pay
particular attention to OC-09 (packet release under B46) and OC-10 (TA onboarding), which the architect
raised after the earlier review.

### 4.7 Internal consistency

Every page ID, component ID, read model name, command name, rule ID and marker used in one place MUST be
defined in the place that owns it. Names MUST be used consistently (one concept, one name). Report each
dangling or drifting name. Check that the bulk count definitions (BULK 4.2) agree with BU §6.2 and that
every count shown on a bulk page is one of the defined counts.

### 4.8 Writing style

The plan targets ASD-STE100 at about 80% (STY-20261003-01). Report a style deviation only when it creates
an ambiguity that could change implementation or acceptance.

## 5. Finding format and ranking (PRI-20260930-01)

Rank every finding before you write the fix. Use these levels:

- **P0**: blocks the standard new case or a D6 bulk scenario, risks irreversible harm, or lets the page
  make a false claim to the user. P0 is worked now by the architect.
- **P1**: a real gap that Max decides to work or to park. A P1 that only corrects plan text goes to the
  architect; a P1 that needs a product choice becomes an owner choice.
- **P2**: a note. Parked, not worked.

Each finding has these columns: `ID` (GR-01, GR-02, ...), `Priority`, `Likelihood` (one or two sentences:
who does what, what the page then shows or does wrongly), `Location` (file and section, or page,
component, command or rule ID), `Finding` (one or two sentences), `Source` (BS Bxx, UX §, BU §),
`Proposed fix` (one sentence; prefer removing or capping a state over adding a guarantee), `Overlap`
(RF-xx if the earlier reviewer raised it, else "new").

Rank P0 first. Do not pad. A review with few findings that are all real is better than a long one.

## 6. Output

Write one file:

`/home/max-stravion/projects/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/internal/records/design/ui-plan-from-specs-2026-10-10/GOKU-REVIEW-2026-10-10.md`

Sections, in this order:

1. **Scope and method.** Files read with the hashes you computed. Reading order. Approximate time per
   pass. Anything you read by mistake. Assumptions you recorded.
2. **Verdict.** Three to six sentences. Is the plan a sound baseline for the gap comparison and the
   change-cost steps: yes, yes with the P0s worked, or no. State what must change for a yes.
3. **Findings table** (section 5 format), P0 first.
4. **Coverage verdict.** Your own Full / Partly / Not counts for V01–V25 and BU-01..27 beside the plan's
   counts, and a table of each row or scenario with no home or with a disputed status.
5. **Boundary verdict.** Each invented policy and each over-cautious boundary, or "none found" for each
   direction.
6. **Disposition check.** One row per RF-01..17 "Worked" finding: present at cited place yes/no, resolved
   yes/no, leftover text yes/no with location. Your reading of RF-07. Any P2 you promote and why.
7. **Owner choices.** One row per OC-01..10: decidable from text yes/no, options complete yes/no, already
   decided by BS yes/no with clause, your note.
8. **Consistency verdict.** Dangling or drifting names, or "none found".
9. **Not checked.** What you did not check and why.

Style: ASD-STE100 at about 80%. Short sentences. Active voice. No praise. No summary of the plan. Target
200 to 400 lines. Tables where rows are parallel.

Then commit the one file locally in the `internal/` repository with this message and no other change:

```text
Record Goku's independent review of the UI plan built from the UX specifications
```

Do not push. Do not amend any earlier commit. Report in chat: the commit hash, the SHA-256 of your file,
the counts of P0 / P1 / P2, the one-paragraph verdict, and the P0 findings in full.

## 7. What happens next

The architect dispositions your findings under PRI-20260930-01 and records each disposition in
`REVIEW-FINDINGS.md`. P0 findings are worked in the plan. P1 findings that need a product choice go to
Max as owner choices. Disagreements between you, the earlier reviewer and the architect are recorded, not
resolved by majority. Your file is never edited by anyone but you.
