# Brief ITEM-02-C: test I13, the not-linked blocker on `release_packet`

Role: Principal Software Engineer (tests). One bounded task. Working tree:
`/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/core-reads-2026-10-12/repo`
(branch `core-reads-2026-10-12`). You are the only writer in the product tree while you run. Do not commit. Do not push.
Do not edit anything under `internal/`.

## What is built (read `git show HEAD -- src/modules/core` and `git diff -- src/modules/core`)

- Commit HEAD: the blocker `dependency_not_linked` (control stage 10; `{dependency_prerequisite, mandatory_validation,
  dependency_not_linked, exceptionEligible: false, ref: <relationshipCode>}`) for readiness and the three authorizations,
  and pending rule 19a.
- Uncommitted (owner decision of 13 October 2026, proposal Q1 approved): `release_packet` joins `NOT_LINKED_ENFORCED`
  in `src/modules/core/derived.ts`. A declared relation that conditions `release_packet` and has no live link now
  (a) blocks every readiness confirmation, (b) blocks `release_packet` itself, and (c) keeps rule 19a while the packet
  is not released.
- `test/core/dependency-not-linked.test.ts` (I2 to I12, I14) is the model: it registers a test-only head declaration
  of TRANSIT with a second relation through `cat.draftDeclaration`, `recordApproval`, `bindDeclaration`,
  `previewDeclaration` and `publishDeclaration` (its last `describe` block). Copy that pattern.

Design source (read only these lines): `../research/inputs/proposals/K2-P15-1-dependency-not-linked.md` lines 318-330
(fixtures, `prepNeedsTourist`), line 357 (row I13) and lines 330-332 ("nothing written").

## Task

Add test I13 to `test/core/dependency-not-linked.test.ts` as a new last `describe` block (after the existing TRANSIT
block, because a published head governs every later application of its offering):

1. Fixture `prepNeedsTourist`: a test-only head declaration of the preparation-only synthetic offering ("SYN Tourist visa
   preparation"; find its offering key in `catalogue/synthetic/catalogue.json` or the kit) with one relation, for example
   `needs_tourist_evisa_prep`, `upstreamServiceCode: 'syn_tourist_evisa'`, `applicantRelation: 'same_applicant'`,
   `requiredOutcome: 'issued'`, `requiredArtifactType: 'evisa_grant'`, `conditionedActions: ['release_packet']`.
   MUST NOT change `catalogue/synthetic/catalogue.json`.
2. A group with an upstream TOURIST e-visa application and a dependent preparation application for the same applicant;
   the dependent is submitted, paid, assigned, work started, its packet built (find the kit's packet helper; grep
   `packet` in `test/core/kit.ts` and in existing release tests under `test/core/`), and NOT linked.
3. Assert: the readiness evaluation (`evaluateControls`, action `record_readiness`, as the existing tests do) and the
   `core.release_packet` command are refused with `dependency_not_linked` and `ref` of the relation; nothing written
   (no `sys_operations` row for the key, no new fact, no `core_packet_releases` row, no `ops_readiness` row); the
   pending answer is rule 19a (`assigned_operator`, `dependency_not_linked`, `return_to_ta`, `sinceSeq` 0n).
4. Recovery: formal return, link the upstream, hand back, take the upstream to `issued` with its `evisa_grant` artifact
   (find how existing dependency tests make an upstream met; grep `requiredArtifactType\|evisa_grant\|met` in
   `test/core/withdrawal-dependencies.test.ts`), record readiness on the built packet, then `core.release_packet` is
   accepted.

Run (short TMPDIR):
`export TMPDIR=/tmp/claude-1000/cr4; mkdir -p $TMPDIR; node --test --test-global-setup=test/support/global-setup.ts test/core/dependency-not-linked.test.ts`
The whole file MUST be green. Then run `test/core/withdrawal-dependencies.test.ts` once, and `npx eslint` on the file.

## Rules

- Change only `test/core/dependency-not-linked.test.ts`. Never edit product source. If a step that the design says
  passes fails, keep the test, mark it `{ todo: 'product: <one line>' }` and report it with file:line.
- Keep context small: read only the files and lines you need. If your context approaches 100k tokens, stop and return a
  partial result naming what remains.

## Return (at most about 200 words)

I13: pass or todo (with reason). Product defects found (scenario, file:line). Final pass/fail counts of the two files.
Assumptions about the design.
