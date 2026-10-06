export const meta = {
  name: 'travelmudra-m5-review',
  description: 'Milestone 5 focused review: five invariant commissions (restore scope, release integrity and isolation, capacity bounds, traceability truth, end-to-end install and recovery), P0-only validation, subsystem fix chain with fixer reproduction, fix verification',
  phases: [
    { title: 'Review', detail: 'five invariant commissions (read-only, up to 5 at a time)' },
    { title: 'Validate', detail: 'two independent validators per P0 only' },
    { title: 'Code fixes', detail: 'subsystem chain, ≤4 findings each; fixer reproduces each P1 first' },
    { title: 'Fix verify', detail: 'P0 revert-sensitivity, P1 rejections, regression lens' },
    { title: 'Round 2', detail: 'only for reopened items' },
  ],
}

const MAIN = args.main
const BASE = args.base
const ROOT = '/home/max-stravion/projects/Critical/MaxHyperVisaFullPortalImplementationOpus5.5'
const R = ROOT + '/internal/records'

function limiter(n) {
  let active = 0
  const q = []
  const next = () => {
    if (active >= n || q.length === 0) return
    active++
    const { fn, res } = q.shift()
    fn().then(r => { active--; res(r); next() }, () => { active--; res(null); next() })
  }
  return fn => new Promise(res => { q.push({ fn, res }); next() })
}
const readers = limiter(5)
const writers = limiter(3)
const read = (p, o) => readers(() => agent(p, o))
const write = (p, o) => writers(() => agent(p, o))

const AUTHORITY = `Standing authority from Max for this run. Pass this section verbatim to every sub-agent and workflow agent you start.

I give standing approval for the orchestrator, and only the orchestrator, to integrate and merge work into this repository's main branch for the whole run, without asking me, once that milestone's checks pass on the integrated result. Sub-agents and clones never merge into main; they hand their commits to the orchestrator. Commit and tag each completed milestone on local main; local git is the stable backup and recovery point. Nobody pushes to any remote during the run. I push once, myself, at the end; do not stop, wait or ask me to push at any milestone. No history rewrite or deletion of merged commits or milestone tags on main, no new repositories, no visibility change. Commit only public-fit content: no internal documents, no internal identifiers, and not this prompt. All other B47 limits stay in force and bind every sub-agent: no production deployment, no material spend, no real payments or government actions, no real customer notices, no production data changes. Do not stop for routine approval; stop only for a B47 owner decision, record it, and continue all work that does not depend on it.`

const RULES = `${AUTHORITY}

---
PROJECT: TravelMudra, a B2B visa-services portal. The product owner delegated all decisions to the architect; never stop to ask.
BINDING RULES: do NOT spawn sub-agents, do NOT use the Agent/Task tool, do NOT start workflows. Never push, never merge into main, never use sudo, never use --no-verify, never touch the main checkout at ${ROOT}, never touch the developer's data directories (use temporary directories and ephemeral loopback ports for any installation). Public livestream: never print secrets, tokens or environment values. Tracked files and commit messages must be public-fit (no spec rule IDs like B01..B47, no internal record IDs, no /home or internal paths, no agent names; the curve name only as 'prime256v1'); commit messages end with:
Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
WORKTREE START: your isolated worktree may start from an older commit. FIRST run \`git rev-parse HEAD\`; if it is not ${MAIN}, run \`git reset --hard ${MAIN}\` (safe: the worktree is fresh). Then \`npm ci --no-audit --no-fund\` and \`source $HOME/.local/opt/travelmudra-toolchain/env.sh\`.
STATE: main ${MAIN} = milestones 1–4 (tagged) + milestone 5: restore scope with Operations and Delivery candidate sources and the restore-boundary hook (src/modules/{operations/case-work,delivery}/restore.ts, src/domain restore wiring, src/platform/restore*.ts); release and installation (src/platform/{installation-config,instance-layout,instances,release*,capacity,supervise}.ts: per-instance descriptors under <root>/descriptors, configuration digests compared at cutover verify, tm-postgres unit, capacity record); verification (docs/verification/traceability.md + test/static/traceability.test.ts, stored public-site check report, docs/playbooks/). Three instances: core (database, blobs, domain), edge and staff (BFFs) over mutual TLS. Milestone 5 range: ${BASE}..${MAIN}. Test helpers: test/ops-tooling/kit.ts, test/system/support.
NORMATIVE: spec ${R}/BUILD_SPEC.md (ultimate authority; the rules for local test installation, bounded capacity, release and rollback, backup and restore, verification); contract ${R}/design/01-foundation-contract.md (sections 13, 16.7, 17, 18–22); record ${R}/design/15-payments-delivery-views-release.md sections 3.4–3.7 and 7.4–7.7; plan ${R}/design/17-m5-plan.md; ${R}/ENGINEERING_OVERRIDES.md. The production host is about one eighth of this machine (about 7 vCPU, 8 GB).
KNOWN AND ACCEPTED (do not re-report without a concrete harm beyond the note): the capacity record measures worker jobs locally as core's user with edge's limits; command latency covers the command envelope, not a domain handler; descriptor digests shorten home paths (describe/check must run as the same user); the default memory budget rests on estimates; the tm-postgres unit is content-tested only; the four public-site owner-input blockers (locality, contact, legal pages, country list) are expected; 16 traceability rows are partial by record; 11 declared procedure codes are never raised.`

const FINDINGS = {
  type: 'object',
  properties: {
    findings: { type: 'array', maxItems: 20, items: { type: 'object', properties: {
      id: { type: 'string', maxLength: 40 }, priority: { type: 'string', enum: ['P0', 'P1', 'P2'] },
      subsystem: { type: 'string', enum: ['recovery', 'release', 'install', 'capacity', 'verification-docs', 'other'] },
      file: { type: 'string', maxLength: 200 }, line: { type: 'number' },
      issue: { type: 'string', maxLength: 700 }, scenario: { type: 'string', maxLength: 700 },
      evidence: { type: 'string', maxLength: 900 }, fix: { type: 'string', maxLength: 600 } },
      required: ['id', 'priority', 'subsystem', 'file', 'issue', 'scenario', 'evidence', 'fix'] } },
    coverage: { type: 'string', maxLength: 1500 },
  },
  required: ['findings', 'coverage'],
}
const VERDICT = {
  type: 'object',
  properties: { confirmed: { type: 'boolean' }, priority: { type: 'string', enum: ['P0', 'P1', 'P2', 'invalid'] }, reasoning: { type: 'string', maxLength: 1200 }, evidence: { type: 'string', maxLength: 1200 } },
  required: ['confirmed', 'priority', 'reasoning', 'evidence'],
}
const FIX = {
  type: 'object',
  properties: {
    branch: { type: 'string', maxLength: 200 }, commit: { type: 'string', maxLength: 64 }, worktree_path: { type: 'string', maxLength: 300 },
    dispositions: { type: 'array', maxItems: 30, items: { type: 'object', properties: {
      id: { type: 'string', maxLength: 40 }, status: { type: 'string', enum: ['fixed', 'rejected_not_reproduced', 'rejected_by_design', 'deferred'] },
      reproduced_before_fix: { type: 'boolean' }, note: { type: 'string', maxLength: 500 } }, required: ['id', 'status', 'reproduced_before_fix', 'note'] } },
    contracts_changed: { type: 'string', maxLength: 2000 }, tests: { type: 'string', maxLength: 600 },
    unresolved: { type: 'array', maxItems: 15, items: { type: 'object', properties: { priority: { type: 'string', enum: ['P0', 'P1', 'P2'] }, issue: { type: 'string', maxLength: 300 } }, required: ['priority', 'issue'] } },
  },
  required: ['branch', 'commit', 'worktree_path', 'dispositions', 'contracts_changed', 'tests', 'unresolved'],
}
const FIXCHECK = {
  type: 'object',
  properties: {
    items: { type: 'array', maxItems: 60, items: { type: 'object', properties: { id: { type: 'string', maxLength: 40 }, status: { type: 'string', enum: ['fixed', 'partially_fixed', 'not_fixed', 'regressed', 'rejection_upheld', 'rejection_overturned', 'not_sampled'] }, note: { type: 'string', maxLength: 400 } }, required: ['id', 'status', 'note'] } },
    new_issues: { type: 'array', maxItems: 10, items: { type: 'object', properties: { priority: { type: 'string', enum: ['P0', 'P1', 'P2'] }, issue: { type: 'string', maxLength: 500 }, evidence: { type: 'string', maxLength: 500 } }, required: ['priority', 'issue', 'evidence'] } },
    tests: { type: 'string', maxLength: 400 },
  },
  required: ['items', 'new_issues', 'tests'],
}

const RANK = `Rank: P0 = violates the spec/contract semantics, a security or privacy defect (including a secret leaking into a manifest, report, descriptor or log), state corruption or data loss, a restore or cutover that can repeat an external effect or run unverified code/configuration, a broken instance boundary, or a flaw forcing milestone 6 rework; P1 = material robustness or correctness-at-the-edges issue worth fixing now; P2 = minor, parked. Each finding: a concrete scenario and evidence — a reproduction you ran (strongly preferred: a probe on a throwaway installation in a temporary directory or with the ops-tooling kit), probe output, or an exact code reference. Report only real findings; an empty list is valid. Work read-only: probes live in your throwaway worktree and are never committed. Keep the working set small: read the named files first, follow call paths only as far as the invariant needs.`

const COMMISSIONS = [
  { key: 'RESTORE', focus: `Attempt to reopen a restored installation that repeats an external effect, misses a candidate, or keeps an old credential alive. Files first: src/platform/restore*.ts, src/cli/commands/restore*.ts, src/domain (restoreOwnerPorts, restore boundary hooks), src/modules/operations/case-work/restore.ts, src/modules/delivery/restore.ts, src/kernel/recovery.ts, test/ops-tooling/{backup-restore,restore-interval-loss,restore-reopen}.test.ts. Try: an interval-loss restore where a candidate (current readiness, act with unknown filing, eligible artifact, built/released packet, unfinished email or byte release, open core application) is not marked; reopening without marking every candidate or without the approval reference; an email or other external effect sent again after reopen; a session, OTP, enrolment link, lease token or keyed digest of the source still usable; a restore into an existing CA or over existing instances; restored edge/staff layout incomplete (descriptors, units, secrets); xid epoch and projection state after restore.` },
  { key: 'RELEASE', focus: `Attempt to run code, schema or configuration that was not the one verified, or to make core trust what another instance controls. Files first: src/platform/{release,release-cutover,release-probe,release-rollback,installation-config,instance-layout,instances,supervise}.ts, src/cli/commands/{release,cutover,rollback,install,instances}.ts, deploy/systemd/*.in. Try: change core's or an instance's configuration after register and pass cutover verify; a stale or tampered descriptor (who can write <root>/descriptors? could edge's runtime user rewrite its own descriptor to change what core's procedures believe, and does any core procedure act on descriptor content beyond comparing digests?); a manifest or recovery-set summary carrying a secret value or private path; rollback leaving core's release.env, the active release and the database disagreeing; exit 75/78 and restart policies letting an unverified release write; the tm-postgres/tm-core ordering; admission opened before verification.` },
  { key: 'CAPACITY', focus: `Attempt to exceed a finite limit before refusal, or make the capacity record or health lie. Files first: src/platform/{capacity,config}.ts, src/cli/commands/capacity.ts, src/platform/request-limits.ts, src/apps/shared/app.ts, the stream slots in src/modules/delivery/retrieval.ts, test/ops-tooling/{limits,queue-bound,capacity}.test.ts. Try: a business write partially committed before a pool, queue, statement-timeout, predicate-lock, stream, storage or BFF request limit refuses; the memory budget on an 8 GB host with every instance and clamd at their limits; a capacity observation reported as measured when it was not (or a placeholder number); /healthz categories wrong under a degraded facility; limits in the docs table differing from config defaults.` },
  { key: 'TRACE', focus: `Attempt to find a traceability row marked proven whose named tests do not assert the property. Files first: docs/verification/traceability.md, test/static/traceability.test.ts. Sample at least 40 proven rows, weighted to T-F invariants and to money, access, disclosure and recovery rows; read each named test body and judge whether its assertions prove the row's property. For the new gap-closing tests (T-F12, T-F33, T-F36, T-F46, T-F47, T-CO28, T-CO40, T-CO41, T-CO50, T-CO51, T-15-16, T-15-80) check sensitivity by mutating the guarded code in your worktree. Also spot-check 10 rows of docs/playbooks/refusal-codes.md against the code that raises them, and the stored public-site check report against the content it names.` },
  { key: 'E2E', focus: `Walk the documented operations end to end on a throwaway installation in a temporary directory, exactly as docs/operations.md and docs/playbooks/ describe them, and report every step where the docs and the product disagree or the product fails: tm install (descriptors, units rendered including tm-postgres, permissions), tm db init/start, migrate, seed synthetic, release register, cutover (or the first-activation path), tm start all, health of each instance, a TA sign-in and one page through edge, tm backup create, tm restore into a new instances directory, start the restored installation (closed until opened), restore scope declaration and reopen with approval, tm capacity record, tm seo check. Include the per-instance-user procedure as far as one OS user can simulate it (make the private files of edge and staff unreadable to the procedure).` },
]

const CARRIED = [
  { id: 'TRACE-15-57', subsystem: 'release', final: 'P1', issue: 'Traceability T-15-57 is partial: no test applies the secret-hygiene check to a manifest and recovery-set summary that carry per-instance digests and descriptor data.', scenario: 'A future descriptor field carrying a secret would reach the manifest unnoticed.', evidence: 'docs/verification/traceability.md row T-15-57', fix: 'Add the test; mark the row proven.' },
  { id: 'TRACE-15-60', subsystem: 'release', final: 'P1', issue: 'Traceability T-15-60 is partial: snapshot rollback does not compare launch and suspension rows across the rollback.', scenario: 'A rollback that silently keeps a newer launch state passes.', evidence: 'row T-15-60', fix: 'Assert launch and suspension rows equal the checkpoint; mark proven.' },
  { id: 'TRACE-15-68', subsystem: 'recovery', final: 'P1', issue: 'Traceability T-15-68 is partial: the protection mark after reopen is not asserted to block gate decisions.', scenario: 'A marked application could pass a gate decision after reopen.', evidence: 'row T-15-68', fix: 'Assert the gate decision refusal and its lifting; mark proven.' },
  { id: 'TRACE-15-69', subsystem: 'recovery', final: 'P1', issue: 'Traceability T-15-69 is partial: a restore interrupted while copying bytes is not asserted to spawn no worker and release no byte.', scenario: 'An interrupted restore could start work on partial bytes.', evidence: 'row T-15-69', fix: 'Assert no worker process and no byte release; mark proven.' },
  { id: 'TRACE-15-72', subsystem: 'capacity', final: 'P1', issue: 'Traceability T-15-72 is partial: statement-timeout and predicate-lock refusals and the BFF request limiter are not asserted to refuse before any business write.', scenario: 'A limit could refuse after a partial write.', evidence: 'row T-15-72', fix: 'Add the assertions; mark proven.' },
]

phase('Review')
const validate = (f, key) => Promise.all([
  'REFUTE: show it is wrong, unreachable, overstated or already handled elsewhere (read the whole path).',
  'REPRODUCE: write and run a minimal probe or test that demonstrates the failure on main; if it does not fail, the finding is refuted.',
].map((lens, i) => read(`${RULES}

ROLE: Independent P0 validator (you wrote neither the code nor the finding). Default to confirmed=false if you cannot substantiate it. If real, give the correct priority (P0/P1/P2 as defined).
YOUR LENS: ${lens}

Finding (${key}):
${JSON.stringify(f, null, 1)}`, { label: `validate:${f.id}#${i + 1}`, phase: 'Validate', isolation: 'worktree', schema: VERDICT, effort: 'high' })))
  .then(vs => {
    const ok = vs.filter(Boolean)
    const conf = ok.filter(v => v.confirmed && v.priority !== 'invalid')
    const order = { P0: 0, P1: 1, P2: 2 }
    const final = conf.length ? conf.map(v => v.priority).sort((a, b) => order[a] - order[b])[0] : 'invalid'
    return { ...f, lens: key, final, validated: true, verdicts: ok.map(v => ({ confirmed: v.confirmed, priority: v.priority, reasoning: v.reasoning.slice(0, 400) })) }
  })

const reviewed = await pipeline(
  COMMISSIONS,
  c => read(`${RULES}

ROLE: Independent milestone-5 reviewer on one commission (${c.key}). You did not write this code. ${RANK}
COMMISSION: ${c.focus}
Use id prefix ${c.key}-.`, { label: `review:${c.key}`, phase: 'Review', isolation: 'worktree', schema: FINDINGS, effort: 'high' }),
  (rev, c) => {
    if (!rev) { log(`review ${c.key} returned nothing`); return [] }
    const p0 = rev.findings.filter(f => f.priority === 'P0')
    const rest = rev.findings.filter(f => f.priority !== 'P0').map(f => ({ ...f, lens: c.key, final: f.priority, validated: false, verdicts: [] }))
    log(`${c.key}: ${rev.findings.length} findings (${p0.length} P0 to validate)`)
    return Promise.all(p0.map(f => validate(f, c.key))).then(vs => [...vs, ...rest])
  },
)
const all = reviewed.filter(Boolean).flat()
const accepted = [...all.filter(f => f.final === 'P0' || f.final === 'P1'), ...CARRIED]
log(`Findings ${all.length}; accepted P0 ${accepted.filter(f => f.final === 'P0').length}, P1 ${accepted.filter(f => f.final === 'P1').length} (incl. ${CARRIED.length} carried)`)

const bySub = {}
for (const f of accepted.sort((a, b) => (a.final === 'P0' ? 0 : 1) - (b.final === 'P0' ? 0 : 1))) (bySub[f.subsystem] = bySub[f.subsystem] || []).push(f)
const chunks = []
for (const sub of Object.keys(bySub)) for (let i = 0; i < bySub[sub].length; i += 4) chunks.push({ sub, items: bySub[sub].slice(i, i + 4) })
log(`Fix chain: ${accepted.length} items in ${chunks.length} chunk(s)`)
const slim = f => ({ id: f.id, priority: f.final, subsystem: f.subsystem, file: f.file, line: f.line, issue: f.issue, scenario: f.scenario, evidence: f.evidence, fix: f.fix, validator_notes: (f.verdicts || []).map(v => v.reasoning) })

phase('Code fixes')
let tip = null
const fixResults = []
for (let i = 0; i < chunks.length; i++) {
  const ch = chunks[i]
  const r = await write(`${RULES}

ROLE: **Principal Software Engineer** fixing milestone-5 review findings in subsystem "${ch.sub}" (chunk ${i + 1} of ${chunks.length}). ${tip ? `After the worktree start step, run \`git merge --ff-only ${tip}\` (the previous chunk's branch; if that ref is not a branch name, use its commit) and build on it.` : ''} Your handoff's branch MUST be a real branch name (create one with \`git switch -c m5-fix-${i + 1}\` if your worktree is detached).
RULES FOR THIS CHUNK: for every P1, REPRODUCE it first (a failing test or probe); if it does not reproduce, mark it rejected_not_reproduced with evidence and do not change code for it; if intended by the spec or a recorded decision, mark it rejected_by_design with the reference. Items whose id starts with TRACE- are test gaps: add the missing assertions to the named tests (prove them sensitive) and update the row in docs/verification/traceability.md to proven, keeping test/static/traceability.test.ts green. Fix every P0 at the class level. Every fix gets a test that fails without it (prove it). Keep docs/operations.md, docs/playbooks/ and the traceability document true to what you change. TESTING: targeted and affected-subsystem tests (test/ops-tooling, test/static and the files you touched); the full \`npm run check\` once only if you change migrations, kernel, composition or contracts. Commit coherent commits.

Findings:
${JSON.stringify(ch.items.map(slim), null, 1)}`, { label: `pse:fix-${ch.sub}-${i + 1}`, phase: 'Code fixes', isolation: 'worktree', schema: FIX, effort: 'high' })
  if (r) { fixResults.push(r); tip = r.branch } else log(`fix chunk ${i + 1} failed; its items stay open`)
}

phase('Fix verify')
const codeTip = tip
const fixCheck = codeTip === null ? null : await read(`${RULES}

ROLE: Independent fix verifier (you wrote none of these fixes). After the worktree start step, run \`git merge --ff-only ${codeTip}\`. Read \`git diff ${MAIN}..HEAD\`. (1) Every P0: re-run its scenario and revert the fix locally to confirm its test fails (restore afterwards). (2) Every P1 the fixer REJECTED: judge the rejection by reproducing the scenario yourself. (3) Sample at least half of the fixed P1s and every TRACE- item (check the row is now truthfully proven). (4) Regression lens: what did these fixes break? Run test/ops-tooling, test/static and the system tests of touched flows (not the whole suite). Never commit.

Findings:
${JSON.stringify(accepted.map(f => ({ id: f.id, priority: f.final, subsystem: f.subsystem, issue: f.issue, scenario: f.scenario })), null, 1)}

Fixer dispositions:
${JSON.stringify(fixResults.flatMap(r => r.dispositions), null, 1).slice(0, 14000)}`, { label: 'fix-verifier', phase: 'Fix verify', isolation: 'worktree', schema: FIXCHECK, effort: 'high' })

const p0Ids = new Set(accepted.filter(f => f.final === 'P0').map(f => f.id))
const reopened = fixCheck ? fixCheck.items.filter(x => (p0Ids.has(x.id) && ['partially_fixed', 'not_fixed', 'regressed'].includes(x.status)) || (!p0Ids.has(x.id) && ['not_fixed', 'regressed', 'rejection_overturned'].includes(x.status))) : []
const newP0 = fixCheck ? fixCheck.new_issues.filter(x => x.priority === 'P0') : []
log(`Fix verification: reopened ${reopened.length}, new P0 ${newP0.length}`)

phase('Round 2')
let round2 = null
if ((reopened.length > 0 || newP0.length > 0) && codeTip) {
  round2 = await write(`${RULES}

ROLE: **Principal Software Engineer**, round 2. After the worktree start step, run \`git merge --ff-only ${codeTip}\`. Your handoff's branch MUST be a real branch name. Resolve these items the independent fix verifier reopened (class-level for P0), each with a test proven sensitive. TESTING: targeted; full \`npm run check\` once only if you change migrations, kernel, composition or contracts. Commit on your branch.

Reopened: ${JSON.stringify(reopened)}
New P0: ${JSON.stringify(newP0)}
Original findings: ${JSON.stringify(accepted.filter(f => reopened.some(x => x.id === f.id)).map(slim))}`, { label: 'pse:round-2', phase: 'Round 2', isolation: 'worktree', schema: FIX, effort: 'high' })
}

return {
  finalTip: round2 ? round2.branch : codeTip,
  findings: all.map(f => ({ id: f.id, lens: f.lens, subsystem: f.subsystem, raised: f.priority, final: f.final, validated: f.validated, file: f.file, issue: (f.issue || '').slice(0, 220) })),
  fixResults: fixResults.map(r => ({ branch: r.branch, commit: r.commit, dispositions: r.dispositions, contracts_changed: r.contracts_changed, tests: r.tests, unresolved: r.unresolved })),
  fixCheck,
  round2: round2 ? { branch: round2.branch, commit: round2.commit, dispositions: round2.dispositions, tests: round2.tests, unresolved: round2.unresolved } : null,
}
