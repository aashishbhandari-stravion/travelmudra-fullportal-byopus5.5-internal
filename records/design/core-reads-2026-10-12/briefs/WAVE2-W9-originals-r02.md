# Brief W9 (wave 2): review follow-up of the originals register read (tests only)

Role: Principal Software Engineer (tests). One commit, tests only.

## Where you work

- Your worktree: `WT=/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/core-reads-2026-10-12/wt/w9-originals`
  (branch `wave2-originals-r02`, at `96bcf5d`, `node_modules` installed). You are its only writer. Commit there. Never push.
- Start EVERY Bash command with `cd $WT &&` (write the path out). Use absolute paths under `$WT` for every Read, Edit
  and Write. Never touch the lane clone (`.../lanes/core-reads-2026-10-12/repo`) or another worktree. First command:
  `cd $WT && git branch --show-current && git log --oneline -1` (expect `wave2-originals-r02` and `96bcf5d`; otherwise stop).
- Tests: `export TMPDIR=/tmp/claude-1000/w9; mkdir -p $TMPDIR`, then
  `node --test --test-global-setup=test/support/global-setup.ts <files> 2>&1 | grep -E "^ℹ (tests|pass|fail)|✖|AssertionError|expected|actual" | head -40`.
  ALWAYS filter test output. Do not run `npm run check`.
- Checks: `npx tsc -p tsconfig.json --noEmit`; `npx eslint test/operations/originals-register.test.ts`; the test file.
- Read with `grep -n` and `sed -n 'a,bp'`. Never read a large file in full.

## Rules

- File you MAY edit: `test/operations/originals-register.test.ts` ONLY. No product code. If a product change seems
  needed, stop and report it with the failing assertion.
- Public-fit content and commit message: no internal identifiers (no "ITEM-", "R-0", "P-nn", "OD-", "K2-", "WP-",
  "seam"). Never bypass hooks (`--no-verify` is forbidden).
- Commit body ends with, before the Co-Authored-By line: `Ownership grant (orchestrator, 13 Oct 2026):
  test/operations/originals-register.test.ts (review follow-up of the originals register read).`
  Then `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.

## What the review found (verbatim, ranked P1; the owner decided: fix now, tests only)

"Tests invoke the binding directly and give both shared applications to the same operator. Likelihood: high that
deleting the staff allowlist entry or removing the linked-application scope would escape these tests. Reassigning one
shared application is a valid scenario requiring partial link visibility. Smallest fix: add that scenario with distinct
applicant names, and exercise the query through the Core API for staff, edge, operator and TA support views, and
suspended/deactivated actors."

## Change (tests only, in the one file)

1. Partial link visibility. One original shared between two applications with distinct applicant names. Reassign one
   of the two applications to a second operator (use the existing reassignment helper or command the kit offers; find
   it with `grep -rn "reassign" test/support test/operations | head`). Assert: operator A sees the original with only
   A's applicant in the linked applications; operator B sees the same original with only B's applicant; the SuperAdmin
   sees both.
2. The per-service rule. `src/core-api/allowlists.ts` exports `ALLOWLISTS`, `allows(service, kind, name)`,
   `needsSupportView(service, name)` and `sessionUsableThrough(service, actor)` (see `test/unit/bff.test.ts:31` for use).
   Assert: `allows('staff', 'query', 'ops.originals')` is true and `allows('edge', 'query', 'ops.originals')` is false;
   state `needsSupportView` for staff as the module decides it. Through the binding: a travel agent actor is refused
   (`access_denied`, as the existing refusal tests do), and a suspended or deactivated operator is refused if the kit
   offers a helper to suspend or deactivate an account (if not, say so in the return; do not build one).
3. Mutation check, then revert: (a) remove `'ops.originals'` from the staff allowlist; (b) remove the linked-application
   scope in the read (the policy filter on linked applications in `src/modules/operations/...` store for the register).
   Each MUST make at least one new assertion fail. Record the failing output of each in
   `/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/core-reads-2026-10-12/research/evidence/ITEM-24-R02-mutations.txt`,
   then restore the product files exactly (`git checkout -- <file>`; `git status` must show only the test file).

## Return (at most about 200 words)

Commit (id, subject); what each new assertion covers; the mutation results; check results; anything you could not
cover and why. Context: stop and return before 275k with what is green.
