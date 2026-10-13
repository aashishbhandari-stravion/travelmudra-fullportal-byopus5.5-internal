# Brief W1 (wave 1): identity defects ITEM-06 and ITEM-13

Role: Principal Software Engineer (implementation and tests). Two bounded items, one commit each.

## Where you work

- Your worktree: `WT=/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/core-reads-2026-10-12/wt/w1-identity`
  (branch `wave1-identity`, at `5f5e26b`, `node_modules` installed). You are its only writer. Commit there. Never push.
- Start EVERY Bash command with `cd $WT &&` (write the path out; the shell may reset its directory between calls). Use
  absolute paths under `$WT` for every Read, Edit and Write. Never touch the lane clone at
  `/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/core-reads-2026-10-12/repo`
  or another worktree. First command: `cd $WT && git branch --show-current && git log --oneline -1` (expect
  `wave1-identity` and `5f5e26b`; otherwise stop and report).
- Tests: `export TMPDIR=/tmp/claude-1000/w1; mkdir -p $TMPDIR`, then
  `node --test --test-global-setup=test/support/global-setup.ts <files> 2>&1 | grep -E "^ℹ (tests|pass|fail)|✖|AssertionError|expected|actual" | head -40`.
  ALWAYS filter test output like this. Do not run `npm run check` (the architect runs it once per package).
- Checks per item: `npx tsc -p tsconfig.json --noEmit`; `npx eslint <changed files>`; the targeted tests.
- Read with `grep -n` and `sed -n 'a,bp'`. Never read a large file in full. The survey below is verified; do not repeat it.

## Rules

- Failing test first. Run it before the change and save the filtered output to
  `/home/max-stravion/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/core-reads-2026-10-12/research/evidence/ITEM-nn-fails-first.txt`
  (first line: `# <test names> before the change, <date>`).
- Edit ONLY the files named for the item. If another file must change, stop that item and report it.
- Public-fit: no internal identifier (`OD-…`, `K2-…`, `P-nn`, `ITEM-…`, `WP-…`, `R-nn`, "seam") in code, comments, test
  names or commit messages. Write "owner decision of 13 October 2026" if a comment needs a source.
- Commit message: imperative subject under 72 characters; a body that says the defect, the change and the tests; last
  line `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`. The repository-boundary hook runs on commit; never
  bypass it (`--no-verify` is forbidden).
- Match the surrounding code style and comment density.

## ITEM-06: the replay of a sign-in code request normalizes the address as the first call does

Survey: `src/core-api/server.ts:419-422` runs `binding.controls` (where the address is normalized,
`src/core-api/bindings/identity.ts:82,90`) only when the operation is `not_recorded`. On a replay, `toInput`
(`bindings/identity.ts:101` for `iam.request_ta_otp`, `:106` for `iam.request_staff_otp`) passes the raw
`email: i.email.slice(0, 320)`; `runCommand` (`src/kernel/command.ts:251-252`) then parses it against `zNormalizedEmail`
(`src/modules/identity/commands/shared.ts:32`) and a mixed-case address is refused `validation_failed/input_invalid`.
The content hash (`commands/sign-in.ts:140,154`) uses only the email, so a normalized replay equals the recorded content.

Change (`src/core-api/bindings/identity.ts` only): in both `toInput`, keep the `.slice(0, 320)` first, then normalize with
the existing `normalizeEmail` in a non-throwing way (`try { normalizeEmail(sliced).normalized } catch { sliced }`). It MUST
NOT throw: the rate limiter and the bot pre-check run before the controls (file header order), and the controls keep
refusing an invalid address with `email_invalid` as today.

Test (`test/system/three-instances.test.ts`, the `describe('a lost acknowledgement')` block, about line 250; it builds the
envelope with `operationKey()`, solves the bot challenge and calls `apiCall(sys.coreUrl, …)`): a request with
`Syn-Operator-1@synthetic.test` sent twice with the same key → the second is `accepted` and `replayed: true` (today
`rejected validation_failed/input_invalid`); the lower-case address with the same key → accepted, replayed; another
address with the same key → `conflict_operation_key`. Keep the existing cases unchanged.

## ITEM-13: the support view of an operator with an accounting grant includes the accounts surface, read-only

Survey: `src/modules/identity/sessions.ts:140` sets `viewedSurfaces` to `['ta']` or `['ops']` and never consults the
viewed account's accounting grant (the own-session path at about `:88` uses `hasAccountingGrant` with `surfacesOf`).
`src/modules/identity/policy.ts:240` `'accounts.surface_read': { superadmin: 'any', accounting: true }` has no `sv: true`,
so `decideFull` (about `:623`) refuses every support-view actor.

Change:
- `sessions.ts`: for an active operator, `surfacesOf('operator', await hasAccountingGrant(tx, viewed.account_id))`
  (gives `['ops', 'accounts']` with a current grant). A TA stays `['ta']`; others `[]`. Keep the `status === 'active'`
  and clock-health gates. The grant is read for the VIEWED account, on every resolution (no caching). Update the file
  header sentence that says a support view is "on the viewed account's surface" so it states the accounts surface rule.
- `policy.ts:240`: add `sv: true` to `accounts.surface_read` only.
- Downloads stay excluded with no new code: `document.retrieve_bytes`, `selection.retrieve` and the `*_admin` actions
  have no `sv`; the boundary rules refuse a support view (`policy.ts:561`); a support view runs no command.

Tests (`test/identity/policy.test.ts`, `describe('support view')` about line 304; helpers `decide`, `kit.sessionFor`;
`svOp` viewing `fx.op1` about line 331): grant `op1` the accounting grant explicitly in the test (do not rely on the
earlier test at about line 209). Assert: `decide(svOp, 'accounts.surface_read', { type: 'accounts_surface' })` is allowed
(today refused); the resolved session's `surfaces` is `['ops', 'accounts']` (today `['ops']`); `document.retrieve_bytes`
and `accounts.receipt_verify` stay refused; an operator without a grant stays `['ops']` and is refused; a grant revoked
during the view drops `accounts`; a suspended operator gives `[]`.

Not yours (report only): `docs/operations.md:1126` and the internal design record describe the support view as the viewed
account's surface; the architect handles that text.

## Return (at most about 300 words)

Commits (id, subject); the tests that failed first (names, evidence file); check results (pass/fail counts, tsc, eslint);
every deviation and why; open points. Context: under 100k per turn. If your context passes about 250k, commit what is
green, and return before 275k with what remains.
