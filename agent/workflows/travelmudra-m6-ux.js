export const meta = {
  name: 'travelmudra-m6-ux',
  description: 'Milestone 6: round-2 fixes (delivery truth wording, travel-date recheck retry, evidence-note guard), then the bounded final UI/UX pass (approver, screen-group fixers, integrator, independent recheck)',
  phases: [
        { title: 'UX review', detail: 'Principal UX approver across every surface' },
    { title: 'UX fixes', detail: 'screen-group fixers, at most 5 findings each' },
    { title: 'Integrate' },
    { title: 'UX recheck' },
  ],
}
const CTX = '/home/max-stravion/projects/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/internal/agent/context/m6-context.md'
const SKILLS = '/home/max-stravion/.claude/skills'
const R = '/home/max-stravion/projects/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/internal/records'
const AUTHORITY = `Standing authority from Max for this run. Pass this section verbatim to every sub-agent and workflow agent you start.

I give standing approval for the orchestrator, and only the orchestrator, to integrate and merge work into this repository's main branch for the whole run, without asking me, once that milestone's checks pass on the integrated result. Sub-agents and clones never merge into main; they hand their commits to the orchestrator. Commit and tag each completed milestone on local main; local git is the stable backup and recovery point. Nobody pushes to any remote during the run. I push once, myself, at the end; do not stop, wait or ask me to push at any milestone. No history rewrite or deletion of merged commits or milestone tags on main, no new repositories, no visibility change. Commit only public-fit content: no internal documents, no internal identifiers, and not this prompt. All other B47 limits stay in force and bind every sub-agent: no production deployment, no material spend, no real payments or government actions, no real customer notices, no production data changes. Do not stop for routine approval; stop only for a B47 owner decision, record it, and continue all work that does not depend on it.`
const PRE = (base) => `${AUTHORITY}

---
FIRST read ${CTX} fully and follow it. Your base is ${base}: run \`git reset --hard ${base}\` (safe: the worktree is fresh), then \`npm ci --no-audit --no-fund\` and \`source $HOME/.local/opt/travelmudra-toolchain/env.sh\`.`
const FIX = {
  type: 'object',
  properties: {
    branch: { type: 'string', maxLength: 200 }, commit: { type: 'string', maxLength: 64 },
    dispositions: { type: 'array', maxItems: 30, items: { type: 'object', properties: { id: { type: 'string', maxLength: 80 }, status: { type: 'string', enum: ['fixed', 'rejected_not_reproduced', 'rejected_by_design', 'deferred'] }, reproduced_before_fix: { type: 'boolean' }, note: { type: 'string', maxLength: 500 } }, required: ['id', 'status', 'reproduced_before_fix', 'note'] } },
    contracts_changed: { type: 'string', maxLength: 2000 }, tests: { type: 'string', maxLength: 600 },
    unresolved: { type: 'array', maxItems: 15, items: { type: 'object', properties: { priority: { type: 'string', enum: ['P0', 'P1', 'P2'] }, issue: { type: 'string', maxLength: 300 } }, required: ['priority', 'issue'] } },
  },
  required: ['branch', 'commit', 'dispositions', 'contracts_changed', 'tests', 'unresolved'],
}
const UX = {
  type: 'object',
  properties: {
    verdict: { type: 'string', enum: ['approved', 'approved_with_conditions', 'changes_required'] },
    findings: { type: 'array', maxItems: 40, items: { type: 'object', properties: {
      id: { type: 'string', maxLength: 40 }, priority: { type: 'string', enum: ['P0', 'P1', 'P2'] },
      group: { type: 'string', enum: ['public-signin-account', 'ta', 'ops', 'admin-accounts', 'design-system'] },
      screen: { type: 'string', maxLength: 200 }, issue: { type: 'string', maxLength: 600 }, evidence: { type: 'string', maxLength: 600 }, fix: { type: 'string', maxLength: 500 } },
      required: ['id', 'priority', 'group', 'screen', 'issue', 'evidence', 'fix'] } },
    evidence_summary: { type: 'string', maxLength: 2000 }, rationale: { type: 'string', maxLength: 2500 },
  },
  required: ['verdict', 'findings', 'evidence_summary', 'rationale'],
}
const INTEG = {
  type: 'object',
  properties: { branch: { type: 'string', maxLength: 200 }, commit: { type: 'string', maxLength: 64 }, conflicts: { type: 'string', maxLength: 2000 }, tests: { type: 'string', maxLength: 600 } },
  required: ['branch', 'commit', 'conflicts', 'tests'],
}
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
const writers = limiter(3)
const DESIGN = `Design references: DESIGN.md, PRODUCT.md, brief section 7.1 (clarity + trust + workflow speed; where am I / what is happening / what needs my attention / what happens next; money, status, custody, disclosure and delivery truthfulness; consistency with the approved design system; no generic AI-SaaS look). Judgment aids: ${SKILLS}/impeccable/SKILL.md + reference/*.md (you MAY run \`${SKILLS}/impeccable/scripts/impeccable detect\` on loopback URLs; NEVER live mode, update, install, link or pin; never relax CSP), ${SKILLS}/ui-ux-pro-max/SKILL.md, ${SKILLS}/design-taste-frontend/SKILL.md. WCAG 2.2 AA.`

const r2 = { branch: 'm6-round2' }

phase('UX review')
const ux = await agent(`${PRE(r2.branch)}

ROLE: independent **Principal UX Engineer approver** for the bounded final UI/UX pass of the whole product (you built none of it). Read-only: screenshots and outputs in a temporary directory outside the repository; never commit. Cover EVERY surface on the three instances with realistic synthetic states (use test/system/support helpers or a throwaway installation): the public site; TA sign-in and account; the TA surface (home, catalogue, groups, applications and case page, bulk intake and its pages, documents, payments, delivery, notices, search, history); the operator surface (home, assigned work, case page with work steps, readiness, acts, results, artifacts, custody, incidents, delivery, the new country/service discovery, notices); the SuperAdmin surface (applications, queues, assignment, payments and finance, catalogue and launch control, incidents, intake oversight, documents queue, monitors, measures, audit, accounts, grants, elevations, public site admin); the Accounts surface. Include the parked UX items of earlier milestones (${R}/verification/2026-10-06-m3-*.md and 2026-10-07-m4-*.md: R-02..R-06, N-1..N-6, P2-1..P2-4) and judge them again. Take Playwright screenshots at 1440px and 390px (dark where relevant) and LOOK at a representative set (keep them on disk; inspect selectively); run axe on every page and Impeccable detect on a representative set; walk the keyboard order of the main forms; check navigation reachability of every page and the no-JS baseline. ${DESIGN}
Focus on cross-screen consistency, hierarchy, state communication, workflow friction, form ergonomics, generic-looking UI, responsiveness and accessibility. Rank: P0 = accessibility failure, misleading money/status/custody/disclosure/delivery communication, a dead-end workflow or unreachable page; P1 = material improvement before handover; P2 = polish (parked). The pass is bounded: report material issues, not taste. Assign each finding to a screen group.`, { label: 'ux-approver', phase: 'UX review', isolation: 'worktree', schema: UX, effort: 'high' })
if (!ux) return { error: 'ux approver failed', r2 }

phase('UX fixes')
const required = ux.findings.filter(f => f.priority !== 'P2')
const byGroup = {}
for (const f of required) (byGroup[f.group] = byGroup[f.group] || []).push(f)
const chunks = []
for (const g of Object.keys(byGroup)) for (let i = 0; i < byGroup[g].length; i += 5) chunks.push({ g, items: byGroup[g].slice(i, i + 5), n: chunks.length + 1 })
log(`UX verdict ${ux.verdict}; ${required.length} P0/P1 in ${chunks.length} chunk(s)`)
const fixes = await Promise.all(chunks.map(c => writers(() => agent(`${PRE(r2.branch)}

ROLE: **Principal UX Engineer (implementer)**, screen group "${c.g}" (chunk ${c.n}). After the worktree start step run \`git switch -c m6-ux-${c.n}\`. Apply every P0 and P1 below (you may reject a P1 only with a stated design reason). Other implementers work in parallel on other screen groups: touch only the renderers of your group; a change to a shared design-system component (src/web/ui, CSS, gallery) is allowed only when your finding requires it, done properly (component + CSS + gallery entry + test) and kept backward compatible. Keep screenshots on disk and inspect them selectively (1440px and 390px). axe and Impeccable detect on the affected loopback URLs. ${DESIGN} Do not change domain behaviour. TESTING: the UI unit tests, the gallery tests and the system tests of the screens you touched. Commit on your branch. In dispositions use fixed / rejected_by_design / deferred.

Findings:
${JSON.stringify(c.items, null, 1)}`, { label: `ux-fixer:${c.g}:${c.n}`, phase: 'UX fixes', isolation: 'worktree', schema: FIX, effort: 'high' }))))

phase('Integrate')
const done = fixes.filter(Boolean)
const integ = done.length === 0 ? null : await agent(`${PRE(r2.branch)}

ROLE: **Integrator**. After the worktree start step run \`git switch -c m6-ux-int\`, then \`git merge --no-ff\` each of: ${done.map(f => f.branch).join(', ')}, with public-fit merge messages. Resolve conflicts by preserving both sides' intent (shared design-system components: keep both changes coherent; never drop a fix). Then run typecheck, lint, test/static, test/unit (including the web components), the gallery tests and the system tests of the touched screens. Fix only what the merge broke, in a separate commit.`, { label: 'integrate-ux', phase: 'Integrate', isolation: 'worktree', schema: INTEG, effort: 'high' })
const tip = integ ? integ.branch : r2.branch

phase('UX recheck')
const recheck = done.length === 0 ? null : await agent(`${PRE(tip)}

ROLE: independent **Principal UX Engineer approver** (not an implementer). Re-check ONLY these findings with fresh evidence on the three instances (screenshots you look at, axe, Impeccable detect, keyboard), then give the final verdict for the product's UI. Never commit. ${DESIGN}

Findings:
${JSON.stringify(required, null, 1).slice(0, 20000)}

Implementer dispositions:
${JSON.stringify(done.flatMap(f => f.dispositions), null, 1).slice(0, 12000)}`, { label: 'ux-recheck', phase: 'UX recheck', isolation: 'worktree', schema: UX, effort: 'high' })

return { r2, ux: { verdict: ux.verdict, findings: ux.findings, evidence_summary: ux.evidence_summary }, fixes: done.map(f => ({ branch: f.branch, commit: f.commit, dispositions: f.dispositions, tests: f.tests, unresolved: f.unresolved })), integ, tip, recheck }
