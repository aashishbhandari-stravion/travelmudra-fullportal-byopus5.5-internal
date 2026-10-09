# Project instructions (local only)

This file is excluded from git (`.git/info/exclude`). It is read by every Claude session started in this
directory. `AGENTS.md` beside it holds the same text for Codex sessions. Keep the two files identical.
A third identical copy lives in `internal/agent/project-instructions/CLAUDE.md`; update it in the same task and
commit the internal repository, so a fresh checkout on another machine does not lose these rules.

## State of the project

The build run (milestones 1 to 6, 4 to 8 October 2026) is complete. Local `main` holds the product; tag
`m6-final-assurance` (7be21b1) is the accepted build, followed by a README note (7a29a3f) and the UAT script
(fede68a). Max pushed `main` and the tags. Max now tests the preview by hand and opens one task chat per
problem. The handover record of the build is
`internal/records/diary/2026-10-08-travelmudra-build-m1-to-m6-handover.md`. Read it when you need the
history of a decision.

## Focused fixes only (Max, 8 October 2026)

Every task chat after the build fixes one problem in one module. This rule keeps the cost low and keeps the
design coherent. It applies to Claude and Codex chats.

- You MUST work only on the module, page or procedure that Max names. The "Module map" below gives the
  files, the tests and the design record of each module.
- You MUST NOT scan, review, refactor or "clean up" the whole code base or a whole module. Read only the
  files on the path of the defect: the page or route, the core binding, the module's command or query, and
  their tests. Find them with `grep` on the route, the command name or the error text.
- You MUST NOT change more than one module in a task. Stop and write a proposal for Max (what, why, which
  files) when the correct fix needs a change to another module, to a frozen interface (`src/contracts/`, a
  module's `api.ts` or `types.ts`), to the kernel, or to an applied migration. Max starts a separate task.
  Never edit an applied migration; a schema change is a new migration.
- You MUST NOT start multi-agent reviews, workflows or broad sub-agent searches unless Max asks for them.
- Fix the cause, not the symptom. First write a test that fails without the fix. Do not hide a wrong module
  result in a page.
- Checks: the module's own tests (see the map), `npm run typecheck`, and `npx eslint <changed files>`. Run
  the full suite (`npm run check`) only when the change touches `src/kernel/`, `src/contracts/`,
  `src/platform/` or a migration, or when Max asks.
- Commit locally with a public-fit message (the repository boundary hook checks it; never bypass it). Never
  push: Max pushes. One chat writes to this working tree at a time. A parallel fix chat works in its own
  lane clone (global rules).
- To show the fix to Max, deploy the commit to the preview with `uat.py deploy` (see below).
- When a finding is outside your task, rank it (P0, P1, P2) and report it to Max. Do not fix it.

## How the system works (read before you debug)

Full reference: `docs/architecture.md` (layers, ownership, topology) and `docs/operations.md`
(procedures). The design records are in `internal/records/design/` (private repository, local only).

- **Three instances, API only.** edge (public site, travel-agent portal, uploads, file processing; preview
  port 4610) and staff (Operations, SuperAdmin, Accounts; preview port 4612) render pages and call core over
  mutual TLS. core holds the database, the files and all business rules. edge and staff hold no business
  logic. A page defect is usually in `src/apps/{edge,staff,shared}/`. A rule or data defect is in
  `src/modules/<module>/`. The API between them is `src/contracts/` plus `src/core-api/bindings/`.
- **Commands.** Every write is a kernel command in one SERIALIZABLE transaction (operation key, actor check,
  access policy, writes, at least one fact). A refused command leaves nothing behind. Errors come from a
  closed set (`src/contracts/errors.ts`).
- **`not_found_or_forbidden`.** An object outside the actor's scope looks like a missing object. When a
  user cannot see a record that exists, check the access policy, the grant, the assignment and the account
  state before you suspect the data.
- **One writer per table.** Each module owns a table prefix (`iam_`, `cat_`, `core_`, `intake_`, `doc_`,
  `ops_`, `pay_`, `dlv_`, `view_`; kernel `sys_`). Other modules call the owner's `api.ts`. Static tests
  enforce this.
- **Tasks.** Work outside the transaction (scans, parsing, mail, file moves) is a row in `sys_tasks`. A task
  of class `non_repeatable` that fails ends as `effect_uncertain` and is never retried automatically. A
  "stuck" item can be correct behaviour.
- **Views.** Lists, search, history and measures are projections that follow the fact log. They can lag
  the authoritative tables for a moment. Primary case lists read the authoritative tables.
- **Admission and releases.** While admission is closed, edge and staff show the maintenance page. An
  instance exits with code 75 when admission changes or another release becomes active; systemd restarts
  it. Refusal codes of the `tm` procedures: `docs/playbooks/refusal-codes.md`.
- **Files.** Upload, header check, malware scan (fail closed: while the scanner is down the file waits in
  quarantine), structural check in a sandboxed worker, then extraction (OCR, MRZ). Checks that could not
  finish go to the SuperAdmin queue `/admin/documents/queue`.
- **Pages.** Server-rendered HTML that works without JavaScript; one first-party script in `static/js/`;
  CSP `script-src 'self'` (no inline script). Design system and tokens: `DESIGN.md`, `src/web/ui/`.
- **Behaviour by design, not defects:** parked owner decisions show visible "unavailable" states (finance
  actions, who starts result delivery, custody return policy for real declarations). Delivery says "Sent
  in full", never "Received", because the server cannot know browser receipt. Mail is synthetic only. Money
  is in paise (`bigint`); calendar dates use `Asia/Kolkata`.
- **Known open items** (do not fix unless Max assigns them): the P2 list in
  `internal/records/FINAL-REPORT.md` section 6, and three P1 questions from the independent review in
  `internal/records/diary/2026-10-08-independent-architecture-and-ui-review.md` (continuation COMMIT
  outcome classification in `src/kernel/command.ts`; capability version history across releases;
  cross-country adapter reuse).

### Module map

| Module | Source | Tests | Design record (`internal/records/design/`) |
|---|---|---|---|
| Kernel (commands, facts, tasks, admission, files) | `src/kernel/` | `test/kernel/` | `01-foundation-contract.md` |
| Identity and access (sign-in, codes, grants, policy) | `src/modules/identity/`, `src/apps/shared/identity-routes.ts`, `src/apps/staff/identity.ts` | `test/identity/` | `11-identity-access-web.md` |
| Catalogue, launch control, countries | `src/modules/catalogue/`, `src/countries/`, `src/apps/staff/catalogue/` | `test/integration/catalogue-*.test.ts`, `test/integration/launch-control.test.ts`, `test/countries/` | `12-catalogue-launch-public.md` |
| Core (groups, applications, gates, corrections) | `src/modules/core/`, `src/apps/{shared,staff}/core/` | `test/core/` | `13-core-operations.md` |
| Intake (individual and bulk) | `src/modules/intake/`, `src/apps/{edge,staff}/intake/`, `src/apps/shared/ta-intake.ts` | `test/intake/` | `14-intake-documents-workers.md` |
| Documents and workers | `src/modules/documents/`, `src/workers/`, `src/apps/edge/processing.ts` | `test/integration/documents-*.test.ts`, `test/documents-association/` | `14-intake-documents-workers.md` |
| Operations (case work, incidents, custody) | `src/modules/operations/`, `src/apps/staff/operations/` | `test/operations/` | `13-core-operations.md` |
| Payments | `src/modules/payments/`, `src/apps/staff/payments/`, `src/apps/shared/ta-payments.ts` | `test/payments/` | `15-payments-delivery-views-release.md` |
| Delivery (downloads, notices, packets) | `src/modules/delivery/`, `src/apps/{edge,staff,shared}/delivery/` | `test/delivery/` | `15-payments-delivery-views-release.md` |
| Views (lists, search, history, measures) | `src/modules/views/`, `src/apps/{shared,staff}/views/` | `test/views/` | `15-payments-delivery-views-release.md` |
| Web shell and design system | `src/web/`, `static/` | `test/unit/web/`, `test/ui/` | `00-architecture-brief.md` section 7, `DESIGN.md` |
| Install, release, backup, restore, `tm` CLI | `src/platform/`, `src/cli/` | `test/ops-tooling/`, `test/integration/` | `15-payments-delivery-views-release.md`, `docs/operations.md` |
| Instance wiring (service API) | `src/core-api/`, `src/contracts/`, `src/domain/` | `test/system/`, `test/unit/bff.test.ts` | `01-foundation-contract.md` section 21 |

Run one module's tests (the database tests start a throwaway PostgreSQL cluster; give each parallel run its
own short `TMPDIR`, at most 40 characters, or it falls back to `/tmp`):

```bash
node --test --test-concurrency=4 --test-global-setup=test/support/global-setup.ts "test/operations/**/*.test.ts"
```

For pure unit tests: `node --test "test/unit/<file>.test.ts"`. System tests start the three instances:
`npm run test:system` (slow; run only for wiring or cross-instance defects).

### Logs on the preview

- Unit status: `systemctl --user status tm-core tm-edge tm-staff tm-postgres tm-clamd`.
- Unit logs: `journalctl --user -u tm-core -n 200 --no-pager` (same for `tm-edge`, `tm-staff`). Logs carry
  allowlisted fields only (ids, categories, counts), never personal data or codes.
- `python3 scripts/uat/uat.py status preview` gives units, memory, health and the active release.

## Local deployments: use `scripts/uat/uat.py` only

Max decided on 8 October 2026: every local build, preview, UAT installation and deployment of TravelMudra
goes through one script, `scripts/uat/uat.py`. This rule applies to every task chat in this project.

- You MUST use `uat.py` to create, update, stop, start or remove a local installation.
- You MUST NOT run the deployment steps by hand (`tm install`, `tm db`, `tm migrate`, `tm release register`,
  `tm cutover run`, `tm admission open`, `tm seed`, `systemctl --user` on `tm-*` units). The script runs them
  in the order of `docs/operations.md`, sections 1 and 2.
- If a deployment needs something the script cannot do, or a step fails because of the script, fix
  `uat.py` (and `scripts/uat/README.md`), commit the fix, then run the script again. Do not work around it.
- You MUST NOT edit `registry.json` by hand.

Full reference: `scripts/uat/README.md` and `python3 scripts/uat/uat.py --help`.

### Where things are

| Item | Path |
|---|---|
| Script | `scripts/uat/uat.py` (Python 3 standard library only; run it from this repository) |
| UAT home | `~/.local/share/travelmudra-uat/` (or `$TM_UAT_HOME`) |
| Port registry | `~/.local/share/travelmudra-uat/registry.json` (file lock; the script maintains it) |
| Configurations | `~/.local/share/travelmudra-uat/configs/<name>.json` (one file per installation) |
| An installation | its `root` directory: `releases/`, `instances/`, `logs/`, `README.md`, `uat-instance.json` |
| Command logs | `<root>/logs/<command>-<timestamp>.log` |

### Installations that exist now

| Name | Browser ports (edge, staff) | Internal ports (core, processing) | Root | Notes |
|---|---|---|---|---|
| `preview` | 4610, 4612 | 4611, 4613 | `~/.local/share/travelmudra-preview` | Max's main manual-testing preview. Unit prefix `tm-`. Config: `configs/preview.json` |
| `lane-max` | 4620, 4622 | 4621, 4623 | `~/.local/share/travelmudra-uat/lane-max` | Max's lane `max-uat-2026-10-09` (clone at `~/workDirectory/Critical/MaxHyperVisaFullPortalImplementationOpus5.5/lanes/max-uat-2026-10-09/repo`, branch `max-uat-2026-10-09`). Unit prefix `tm-lane-max-`. Config: `configs/lane-max.json` |

Run `python3 scripts/uat/uat.py ports` for the current list. The registry is the truth; this table can be out
of date.

### Recipes

Run every command from this repository's root.

**Put new code on Max's preview** (data and accounts stay):

```bash
python3 scripts/uat/uat.py deploy ~/.local/share/travelmudra-uat/configs/preview.json --ref <tag-or-branch-or-commit>
```

The script clones the ref from the configured `source` into `<root>/releases/`, runs `npm ci`, registers
the release, runs the cutover (close, checkpoint, migrate, activate, verify), restarts the units and opens
admission. It takes about 1 minute. It does not touch this working tree. A ref that is already active is
reported as "nothing to do". After a successful deploy, update `"ref"` in the configuration file to the
deployed ref.

**Create a new installation** (for example a preview of a lane's clone, beside the main preview):

1. Get a free block of ports. The script checks the registry and the machine's listening sockets:

   ```bash
   python3 scripts/uat/uat.py suggest-ports
   ```

2. Write `~/.local/share/travelmudra-uat/configs/<name>.json`. Paste the printed `ports` value:

   ```json
   {
     "name": "lane-a",
     "source": "/home/max-stravion/workDirectory/Critical/<project>/lanes/<lane>",
     "ref": "<branch-or-commit>",
     "ports": {
       "external": { "edge": 4620, "staff": 4622 },
       "internal": { "core": 4621, "processing": 4623 }
     }
   }
   ```

   Optional keys: `root` (default `~/.local/share/travelmudra-uat/<name>`), `seed` (default `true`),
   `actor` (default `uat`), `unit_prefix` (default `tm-<name>-`), `scanner_update` (`if-missing` default,
   `always`, `never`). `name`: lowercase letters, digits and `-`, at most 24 characters. The ref MUST be
   committed in `source`: the script builds from git, not from uncommitted files.

3. Validate (changes nothing), then create:

   ```bash
   python3 scripts/uat/uat.py check ~/.local/share/travelmudra-uat/configs/<name>.json
   ```

   ```bash
   python3 scripts/uat/uat.py up ~/.local/share/travelmudra-uat/configs/<name>.json
   ```

   `up` reserves the ports first, then builds, installs, starts, opens and seeds. It takes 2 to 6 minutes.
   If it fails, read the printed log tail, fix the cause, and run the same `up` again: it continues from
   the failed step.

4. Give Max the URLs from `<root>/README.md`: edge `http://127.0.0.1:<edge>`, staff
   `http://127.0.0.1:<staff>/staff/sign-in`. The synthetic accounts are `syn-ta-1@synthetic.test`,
   `syn-operator-1@synthetic.test` and `syn-superadmin-1@synthetic.test` (also -2, -3).

**Inspect, pause, resume:**

```bash
python3 scripts/uat/uat.py status <name>
```

```bash
python3 scripts/uat/uat.py stop <name>
```

```bash
python3 scripts/uat/uat.py start <name>
```

`stop` frees the memory (about 1.4 GB per installation, 1 GB of it clamd). The data stays.

**Remove an installation** (only after Max approved the preview or said it is no longer needed):

```bash
python3 scripts/uat/uat.py cleanup <name> --confirm <name>
```

It stops and unlinks the units, deletes the root directory and frees the ports in the registry. It is not
reversible. You MUST NOT clean up `preview` unless Max asks for that by name. Delete the configuration file
after the cleanup.

### Rules for parallel work

- Each installation has its own name, root, four ports and unit prefix. Never reuse the ports of another
  installation, also not of a stopped one. `up` refuses a collision; do not override it.
- Up to 3 lanes may each have one installation. The orchestrator chat writes the configuration and runs
  `up`, `deploy` and `cleanup` for lanes, with `source` set to the lane's clone.
- When the orchestrator writes a lane prompt, it MUST include: "Local deployments go only through
  `scripts/uat/uat.py` (see `scripts/uat/README.md`). Do not run the tm deployment steps by hand. Propose
  any change to `uat.py` to the orchestrator."
- Changes to `uat.py` are made on main by the orchestrator. A lane proposes them.

### Testing from Max's Mac

Max reaches an installation through an SSH tunnel that keeps the same port numbers on both sides. Each page
checks its own address, so the ports MUST match. Example for the preview:

```bash
ssh -N -L 4610:127.0.0.1:4610 -L 4612:127.0.0.1:4612 <this machine>
```

For another installation, use its edge and staff ports. Max uses Chrome or Firefox: Safari refuses the
`__Host-` secure session cookies on plain `http://127.0.0.1`.

### Safety

- Sign-in codes: `node <root>/signin-codes.mjs --list` and `--check` are safe. You MUST NOT run it with an
  email address: that mode prints codes. Max runs it in his own terminal.
- Never print files from `instances/*/secrets/`, `.env` files or keys. The script prints no secrets.
- The script listens on 127.0.0.1 only. Do not expose an installation on another interface.

### Known limits

- `deploy` keeps earlier release directories (about 200 MB each) for a rollback. It does not prune them.
- The ClamAV signatures are shared by all installations and downloaded only when missing (`scanner_update`).
