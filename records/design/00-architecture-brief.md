# TravelMudra architecture brief (orchestrator decisions) — revision 2

Owner: orchestrator (Claude Opus 5.5 parent session). Date: 2026-10-04.
Authority: `internal/records/BUILD_SPEC.md` (SHA-256 4a6fd90657b0723f67fb13a58aa57b3377238fd361ee8f706867bb714d58ea89). This brief records reversible engineering decisions under spec rule B47. Rule numbers (B01–B47) refer to that spec.
Revision 2 replaces the zero-dependency/SQLite stack of revision 1 on the product owner's direction (2026-10-04) to install missing components and integrate the best available free/open-source libraries, sized for a production host of about 1/8 of the development machine (≈7 vCPU, ≈8 GB RAM). Replacements are recorded in `internal/records/ENGINEERING_OVERRIDES.md`.

## 0. Repository discipline (applies to every agent)

- The project root is a public-bound repository. Tracked files, commit messages, branch names and tags MUST be public-fit.
- Tracked files and commit messages MUST NOT contain: spec rule identifiers (`B01`…`B47`), the words `BUILD_SPEC`, agent names, local absolute paths (`/home/...`), internal paths (`internal/...`), personal names or emails, secrets, or real personal data.
- Code comments explain an invariant and its reason in product terms (rule S5), never by citing a rule number.
- Rule-to-test traceability, design records, review findings and evidence live in `internal/records/` (separate private repository). Implementation code never lives there.
- All synthetic data is labelled synthetic (e.g. `@synthetic.test` emails, country "Synthetica", names prefixed `SYN`, passport numbers in a reserved synthetic pattern). Never use real personal data, real passport numbers or real business addresses.
- Agents MUST NOT use `sudo` or change host configuration. Everything runs as the current user.

## 0.1 Roles and authority (product owner, 2026-10-04)

- **Principal technical architect: the orchestrator chat.** Owns every component design, interface, data model and integration; owns code accuracy and adherence to industry best practice; is the final technical authority over all agents' output. Agents propose; the architect decides, integrates and verifies. Nothing merges to `main` without the architect's review of the integrated result and a passing gate.
- **Principal UX Engineer: every UX design and UX approval agent.** Acts at principal level: owns information architecture, interaction design, accessibility, state communication and visual quality for its scope, and argues from evidence (rendered screenshots, accessibility tooling, Impeccable detect, the design skills). A UX deliverable merges only after an independent Principal UX Engineer approval (approver is never the builder). The architect remains final authority where UX and technical constraints meet.
- **Principal Software Engineer: every implementation worker writing code and tests for an assigned module.** Owns its module's correctness, tests (persisted effects and forbidden effects, not only responses), failure/retry/concurrency behaviour, maintainability and adherence to this brief and the foundation contract. Reports exact commands and actual counts; raises disagreements with the design to the architect instead of silently deviating; never merges to `main`.
- **Independent reviewers** never review their own work and rank findings P0/P1/P2 with a concrete scenario.

## 1. Stack (fixed)

- Node.js 24.19 (`.nvmrc`, `engines`). TypeScript executed directly by Node type stripping: erasable syntax only (no `enum`, `namespace`, parameter properties, decorators); imports use explicit `.ts` extensions. `tsc` 5.9.3 type-checks with `noEmit`.
- `tsconfig.json` is strict (already committed). ESLint 10 + typescript-eslint 8 (flat config) is part of `npm run check`.
- Tests: `node:test` + `node:assert/strict`; `cheerio` for HTML assertions; Playwright 1.63 (Chromium) for browser end-to-end flows and the public crawl/SEO check. Integration tests use real PostgreSQL databases, real ClamAV, real Tesseract and real sandboxed workers.
- `npm run check` = typecheck + lint + all tests. Also `npm test`, `npm run typecheck`, `npm run lint`, `npm run test:e2e`.

### 1.1 Runtime libraries (pinned exactly in package.json/package-lock.json; all MIT/Apache-2.0/ISC/MIT-0)

| Library | Use |
|---|---|
| `pg` 8.23.1 | PostgreSQL driver |
| `fastify` 5.12.5 + `@fastify/formbody`, `@fastify/multipart`, `@fastify/cookie`, `@fastify/helmet`, `@fastify/static` | HTTP server, urlencoded and multipart parsing with limits, cookies, security headers/CSP, static assets |
| `zod` 4.6.5 | boundary parsing/validation of all external and persisted input |
| `pino` 10.4.0 | structured diagnostics with allowlisted serializers (Fastify logger) |
| `otpauth` 9.5.2, `qrcode` 1.5.4 | staff TOTP MFA and enrolment QR (server-rendered SVG) |
| `altcha-lib` 2.5.0, `altcha` 3.2.4 | self-hosted proof-of-work CAPTCHA (server-side verification; widget served from our origin; no third-party service) |
| `nodemailer` 10.0.14 | MIME message construction; only the synthetic transport is wired (no real provider selected) |
| `rate-limiter-flexible` 11.2.1 | issuance/verification/intake rate limits with PostgreSQL store (table created by migration; runtime never creates tables) |
| `sharp` 0.35.5 | image decode/validation, OCR preprocessing |
| `file-type` 22.1.1 | magic-number format detection |
| `xlsx` (SheetJS CE 0.20.3, official CDN tarball) | .xlsx/.csv reading inside the parse worker only |
| `mrz` 5.0.2 | MRZ parsing with check digits and OCR autocorrect |
| `ipaddr.js` 2.5.0, `request-filtering-agent` 3.2.1 | SSRF address classification and connect-time enforcement in the fetch worker |
| `yazl` 3.3.1 | ZIP output for bulk document selections and preparation-only packets |

Dev-only: `typescript`, `@types/*`, `eslint`, `typescript-eslint`, `@eslint/js`, `@playwright/test`, `cheerio`, `pdf-lib` (synthetic PDF fixtures only; not a runtime dependency).
Any further dependency needs an orchestrator decision (rule R5). Do not use the npm-registry `xlsx` package (stale, known CVEs).

### 1.2 System toolchain (free/open source)

Installed without root into a user-space prefix by `scripts/toolchain/install-user-toolchain.sh` (exact Ubuntu 24.04 package versions, SHA-256 manifest, generated `env.sh`); a host administrator may install the same packages system-wide instead. Code resolves binaries from `TM_TOOLCHAIN_DIR` first, then `PATH`, and passes `LD_LIBRARY_PATH`, `TESSDATA_PREFIX` and `CVD_CERTS_DIR` from configuration when it spawns them.

| Component | Version | Use |
|---|---|---|
| PostgreSQL | 16.15 | authoritative transactional state (dedicated cluster) |
| ClamAV (`clamd`, `freshclam`) | 1.5.4 | malware scanning over a private Unix socket; signature updates |
| Tesseract + eng/osd data | 5.3.4 | local OCR (no hosted OCR) |
| qpdf | 11.9.0 | PDF structural check, object inspection (active content), packet merge |
| poppler-utils | 24.02 (host) | `pdftotext`, `pdftoppm`, `pdfinfo` |
| age | 1.1.1 | backup-set encryption |
| bubblewrap, prlimit | host | worker sandbox and resource limits |

## 2. Process topology (local test installation)

- `tm-server`: one active release process. Fastify HTTP(S) entry, all business writers, internal task runner. Default bind `127.0.0.1:4610`. HTTPS with a locally generated certificate when remote testers are configured. No public tunnel. No non-loopback bind unless configured explicitly.
- PostgreSQL: a dedicated TravelMudra cluster (data directory under the installation), `listen_addresses=''` (Unix socket only, socket directory mode 0700), `jit=off`, SCRAM authentication. Roles: `tm_owner` (owns schema; runs migrations; backup export), `tm_app` (runtime DML only; no DDL; on the fact log INSERT/SELECT only). Passwords live in the secrets directory.
- ClamAV: a dedicated `clamd` (private Unix socket, mode 0600, `ConcurrentDatabaseReload no`, bounded threads/stream size) and scheduled `freshclam`. Managed by the `tm` CLI. Unavailable or timed-out scanner ⇒ fail closed (file stays quarantined, owned, retryable).
- `tm` CLI: cluster init/start/stop, migrate, synthetic seed (local-test only), backup, restore, cutover (close/drain/checkpoint/migrate/verify/open), protection mark, release manifest, capacity record, SEO crawl check, synthetic mailbox reader, scanner start/update, test-harness actions.
- Restricted file workers: child processes launched through one `WorkerRunner`: `systemd-run --user --scope` (cgroup `MemoryMax`, `TasksMax`, `CPUQuota`) around `prlimit` (CPU, file size, open files) around `bwrap`. Never `prlimit --as`/`--nproc` on a Node worker (verified to fail on this host; EO-10, contract §10.3); native tools inside the parse worker keep their own `prlimit --as`:
  - fetch worker: network allowed; filesystem limited to read-only runtime binds plus one scoped output directory; SSRF-safe public retrieval (Section 9).
  - parse worker: `--unshare-all` (no network, so no database or clamd socket either), read-only binds for Node, `node_modules` and the toolchain, one scoped temp directory, cleared environment, `--die-with-parent`, CPU/memory/file-size/process limits, wall-clock timeout with kill. Runs SheetJS, sharp, Tesseract, pdftotext/pdftoppm, qpdf, mrz.
  - Workers never write business state. They return bounded JSON proposals/evidence; the owning writer accepts or rejects them. Initial concurrency: one fetch worker and one parse worker.
- Country-specific behaviour runs in-process as versioned adapters with scoped inputs, bounded inputs/results, time limits and proposal-only outputs. A country error is contained and attributed to that country. In-process runaway work may interrupt the shared process (accepted owner decision); do not build a sandbox, broker or per-country scheduler.

### 2.1 Production sizing target (≈7 vCPU, ≈8 GB RAM)

Defaults MUST fit: PostgreSQL `shared_buffers` ≤ 1 GB; clamd ≈ 1.0 GB resident (measured: 1004 MB with full signatures, 11 s start); tm-server ≤ 512 MB heap; one parse worker ≤ 768 MiB cgroup memory; one fetch worker ≤ 256 MiB cgroup memory (EO-10). Development uses the same defaults; the capacity record measures them.

## 3. Storage and transactions

- PostgreSQL 16 is authoritative. Each consequential command runs in one `SERIALIZABLE` transaction on a dedicated pooled client. Serialization failures (`40001`) and deadlocks (`40P01`) retry the whole command a bounded number of times with the same operation identity; exhausting retries returns a retryable `conflict`. Unique and partial-unique indexes, `revision` checks and row locks (`SELECT … FOR UPDATE`) implement guards; SERIALIZABLE is defence in depth, not the only guard.
- A command handler performs no external side effect (email, worker call, file move, network) inside its transaction. External effects run as internal tasks enqueued in the same commit (outbox). Therefore a retried transaction never repeats an external effect.
- Runtime role cannot run DDL. Schema migrations are plain SQL files applied by `tm migrate` as `tm_owner`, with a checksum ledger; a changed applied migration is refused.
- The fact log is append-only by privilege (no UPDATE/DELETE grant) and by trigger.
- Private bytes: blob store on disk under the data directory, outside any served path. Files are named by random identifiers, never by content hash. SHA-256 and size are integrity evidence. Areas: `staging/`, `quarantine/`, `canonical/`. A blob becomes available only after a committed owner reference. Cleanup never removes a referenced blob or a staged blob whose owner reference may still commit (staging rows carry a lease; cleanup reconciles against committed references).
- Money: `bigint` paise. Never floating point. Time: `timestamptz` recorded time plus optional event time. Business calendar dates (travel dates, group end) use the declared basis `Asia/Kolkata`. Clock and timer are injectable.
- Identifiers: `<prefix>_<26 Crockford base32 chars>` from 128 random bits; no time order. Ordering uses the fact-log sequence, never clock order.
- Secrets: separate directory (mode 0700) outside the repository and outside the data directory: database role passwords, session key, OTP pepper, CSRF key, ALTCHA HMAC key, job credential key, backup age identity, TLS key. Never logged.
- Tests: a test-run PostgreSQL cluster starts once (temporary directory, Unix socket), migrates a template database, and each test file gets its own database cloned from the template.

## 4. Module ownership (sole writers)

Each module owns a table prefix. Only code under that module's directory writes its tables. Other modules read through the owner's exported query functions. A static test enforces both rules by scanning SQL text; the runtime role's grants also follow ownership where practical.

| Module | Dir | Table prefix | Owns |
|---|---|---|---|
| Kernel | `src/kernel` | `sys_` | operation records (idempotency), fact log, internal tasks, installation state (admission, writer epoch, release), migration ledger |
| Identity & Access | `src/modules/identity` | `iam_` | accounts, roles, grants (read grants, accounting grant), sessions, OTP attempts, TOTP, email changes, rate-limit store, access policy |
| Catalogue | `src/modules/catalogue` | `cat_` | countries, offerings, structural declarations, business baselines, behaviour bindings, publications, impact assessments |
| Core | `src/modules/core` | `core_` | groups, applications, applicant snapshot, submission/price, assignment, control acceptance, gate exceptions, action authorization, lifecycle/outcome/completion, dependencies, deferral |
| Intake | `src/modules/intake` | `intake_` | intake attempts, row results, mapping questions, intake incidents |
| Document Processing | `src/modules/documents` | `doc_` | document versions, safety verdicts, extraction verdicts, classification/association verdicts |
| Operations | `src/modules/operations` | `ops_` | local case work, readiness judgements, problem-report handling, launch control, incidents (association, disclosure, operational), physical custody, artifact eligibility, external-act records, failure classification |
| Payment Records | `src/modules/payments` | `pay_` | service payment entries, government fees, Gate 2 decisions, TA ceilings, exposure reservations, financial exceptions/follow-up |
| TA Delivery | `src/modules/delivery` | `dlv_` | byte releases, document email sends, web notices, retrievals, packet/physical handover records |
| Derived Views | `src/modules/views` | `view_` | projections only (lists, progress, queues, audit search, measures) |

Platform facilities (`src/platform`): configuration, secrets loader, database pool/transactions/migrations runner, blob store, WorkerRunner, scanner client, mail transport, CAPTCHA, clock/timer, diagnostics. Web shell: `src/web`. Workers: `src/workers`. CLI: `src/cli`. Server entry: `src/server`.

Cross-owner atomicity: a command handler owned by one module may call another owner's writer function with the same transaction handle (example: Core action authorization calls Payment Records exposure reservation). Both commit together or neither commits.

## 5. Kernel contracts (foundation)

- **Command runner.** `runCommand(def, ctx, input)` performs, in one SERIALIZABLE transaction: admission and writer-epoch check; operation-key lookup; current actor/account re-check; authorization through the access policy; validation; guards; owner writes; fact-log append; internal-task enqueue; operation record. Then commit. Any error rolls back and returns an explicit typed failure (never acknowledges an uncommitted mutation). Bounded whole-command retry on 40001/40P01.
- **Operation identity.** Every consequential command carries an operation key (generated into each rendered form) plus a canonical content hash of the normalized input. Same key + same content returns the recorded result, re-authorized under current read access. Same key + different content returns a conflict. A new key cannot bypass business duplicate guards. Lost acknowledgement: the client retries the same key; the result lookup is authorized under current access.
- **Optimistic revisions.** Every mutable aggregate row has `revision`. Commands that change it carry the expected revision; stale ⇒ conflict. No latest-write-wins.
- **Fact log.** Append-only. Each consequential fact records: sequence, recorded time, optional event time, actor (account id + role, or system task, or attributed engineering actor), command name, operation id, subject type/id, fact type, before/after JSON, reason, evidence references, owner module, retrospective flag. Absent facts stay absent.
- **Internal tasks.** Durable rows written in the same transaction as their cause. At-least-once, leases with hashed lease tokens, bounded retries, visible failure state, original identity preserved. Each run re-checks current permission and state. Tasks never perform a government action or a payment.
- **Errors.** Closed set of categories (e.g. `not_found_or_forbidden`, `conflict`, `stale_revision`, `validation_failed`, `gate_blocked`, `unavailable_parked`, `unavailable_admission`, `rate_limited`, `capacity_limited`, `maintenance`, `internal`). Object authorization failures return `not_found_or_forbidden`.
- **Diagnostics.** pino with allowlisted fields only (ids, categories, durations, counts). Never source URLs, document content, credentials, OTPs, emails or extracted personal data. Request logging must not log raw URLs with query strings or bodies.
- **Closed sets.** All states, outcomes, progress meanings, roles, actions, gates, fact types, error categories: `as const` arrays + zod schemas at boundaries.
- **Admission/maintenance.** Installation state row: `admission` (`open`/`closed`), `writer_epoch`, active release id, closure reason. Maintenance survives restart. A process whose epoch is stale refuses all writes and exits.
- **Fault injection.** Named fault points available only in the test environment; local-test and production configurations refuse to enable them.

## 6. Access policy (one implementation)

`authorize(tx, actor, action, resource)` is the single policy entry. Every route, command, search, direct link, support view, task result, operation-result lookup and byte release calls it with current state (account status, owning TA, assignment, grants). Objects outside scope are indistinguishable from not found. Derived views never grant permission; list/search queries are scoped by the same policy predicate.

## 7. Web surfaces and design system

- Server-rendered HTML with an auto-escaping tagged-template helper (no template engine, no SPA framework). Every flow MUST work without JavaScript (progressive enhancement). One small first-party enhancement script (no framework, no inline script, no `eval`) MAY add: upload progress, inline validation using the constraint API, polling of long-running status regions, `<dialog>` confirmations, copy actions. CSP: `script-src 'self'` (no `'unsafe-inline'`, no `'unsafe-eval'`); `style-src 'self'`; fonts and images self-hosted. The self-hosted ALTCHA widget is the only third-party script and is served from our origin.
- Surfaces: public (`/`, countries, about, search over static content, `robots.txt`, `sitemap.xml`), TA (`/ta/...`), operator (`/ops/...`), SuperAdmin (`/admin/...`), Accounts (`/accounts/...`, parked actions shown unavailable).
- Every state-changing request: POST, session, CSRF synchronizer token, Origin/Referer check against configured origins, operation key. No generic table-mutation route.
- Security headers via helmet: CSP, `frame-ancestors 'none'`, `Referrer-Policy: no-referrer`, `X-Content-Type-Options`, HSTS on HTTPS; `Cache-Control: no-store` on authenticated and byte responses. Authenticated pages carry `noindex`; robots disallows private surfaces.
- Public site content is static, versioned content in the repository. Business locality is an unverified placeholder until verified evidence is supplied; the SEO check reports it as a release blocker. Do not invent business facts.

### 7.1 UI/UX direction (product owner, 2026-10-04)

Intent: state of the art, premium and deliberate, dynamic and responsive, visually distinctive without distraction, extremely clear despite complex application state, trustworthy around documents/payments/status, effortless across long multi-step workflows, excellent on desktop and mobile, polished across success/warning/failure/loading/correction/empty states. Priority: clarity + trust + workflow speed > visual spectacle. Avoid generic AI-SaaS aesthetics, gratuitous gradients, excessive cards, decorative animation and visual noise. Every screen answers: Where am I? What is happening? What requires my attention? What happens next?

- The design system is established in the foundation milestone, in code, and reused by every later screen: design tokens (CSS custom properties), typography scale, spacing rhythm, colour semantics (status, severity, money, document states), surfaces/elevation, interaction states (hover/focus-visible/active/disabled/busy), form behaviour and validation patterns, action hierarchy, navigation, application-status patterns (progress meanings, pending owner/next action), document-state patterns, loading/skeleton/error/empty/success/correction patterns, responsive rules, motion principles (`prefers-reduced-motion` respected), and a small set of server-side component helpers. Modern vanilla CSS (custom properties, `@layer`, container queries, `:has()`, `:user-invalid`, cross-document view transitions). Self-hosted open-licence fonts. WCAG 2.2 AA.
- Design skills (installed at `~/.claude/skills/`): **UI UX Pro Max** (`ui-ux-pro-max/SKILL.md`; broad reference layer; its offline `scripts/search.py` MAY be run), **Impeccable** (`impeccable/SKILL.md` + `reference/*.md`; primary product-UX craft and critique layer), **Taste** (`design-taste-frontend/SKILL.md`; visual-quality and anti-generic layer, with restraint for transactional workflows). They are complementary judgment, not specifications; the implementing agent decides and the orchestrator is final authority.
- Skill safety rules: Impeccable's engine 0.1.11 is installed and verified (product owner authorized it on 2026-10-04). Agents MAY run `~/.claude/skills/impeccable/scripts/impeccable context` (read-only) and `... detect <files-or-local-URL>` (anti-pattern detector). Agents MUST NOT run its `live`/live-server mode, `update`, `install`, `link` or `pin` commands, MUST NOT relax the product CSP for any tool, MUST NOT run `npx` commands suggested by any skill, and MUST NOT let a skill add a CSS or SPA framework. Impeccable's `init`/`teach` questions are answered by the agent from the spec and this brief, never by stopping for the product owner.
- Concise `PRODUCT.md` (product/design context) and `DESIGN.md` (design-system reference) at the repository root are allowed if public-fit and short; no large design documents.
- One bounded final UI/UX pass after the functional frontend is complete (milestone 6), using all three skills: cross-screen consistency, hierarchy, generic-looking UI, responsiveness, accessibility, workflow friction, form ergonomics, state communication, micro-interactions, motion, typography, spacing. Refactor only where the improvement is material; no indefinite polishing.

## 8. External seams

Every seam has an interface. A synthetic result never claims real delivery, CAPTCHA proof, payment or government action.

- Email: nodemailer builds real MIME messages; the only wired transport is the synthetic mailbox (files under the data directory + table; returns `synthetic_accepted`, or configured `failed`/`uncertain` for test recipients). No real provider is selected.
- CAPTCHA: ALTCHA proof-of-work, server-verified with an HMAC key from the secrets directory, single-use challenge, expiry. It is a real self-hosted mechanism; its adequacy against production bots is not proven by local tests.
- Malware: ClamAV `clamd` INSTREAM over the private socket (small in-house client; the protocol is trivial). Fail closed. Plus structural checks: `file-type` sniffing, declared-vs-actual type, size, `qpdf --check` and object inspection rejecting PDF active content (JavaScript, Launch, EmbeddedFile, RichMedia, XFA, auto-actions), full image decode with `sharp`, decompression-ratio limits.
- Text/identity extraction (parse worker only): `pdftotext` for text PDFs; `pdftoppm` → Tesseract for scanned PDFs; sharp preprocessing → Tesseract for JPEG/PNG; MRZ via `mrz` with autocorrect and check digits. Results are proposals with confidence; low confidence or conflict ⇒ manual resolution. Hosted OCR/LLM is excluded.
- Spreadsheets: SheetJS inside the parse worker with entry-count, cell-count and size limits.

## 9. Content safety (fetch and parse)

- Fetch: `https:` only, public hosts only. Resolve DNS, reject every non-public address (loopback, private, link-local, CGNAT, unique-local, multicast, metadata, IPv4-mapped forms), enforce the same rule at connect time (request-filtering-agent), SNI/Host of the original name, manual redirects with the same checks per hop and a bounded hop count, never forward credentials/cookies, cap bytes and time. Google Sheet and public folder sources use their public export/listing forms through the same fetch path.
- Quarantine all fetched/uploaded bytes. Check format (applicant documents: PDF/JPEG/PNG, ≤ 5 MB each unless an offering narrows), size and malware before any content read. Then parse/extract in the parse worker.

## 10. Deliberate boundaries (keep visible)

Implement each parked, excluded, known-limitation and owner-decision item as a visible `unavailable` state with its reason, never as an inferred default. Examples: TA-exposure reservation release, the fee-exclusion record, the ordinary paid case at the default ₹0 ceiling; Accounts dashboard actions and Payment Records mutation path for Accounts; write-off; refunds; first-admin and all-admin-loss recovery; lost-mailbox recovery; delivery send trigger and completion-check trigger/owner (the system provides the evidence and the pending boundary only; tests and a labelled local test harness invoke checks directly); real email/SMS provider; production topology.

## 11. Milestones (local main, one tag each)

1. Foundation: kernel, platform facilities (database, blob store, workers, scanner, mail, CAPTCHA), web shell and design system, schema framework, access-policy skeleton, invariant tests, independent foundation review.
2. Identity & Access; Catalogue, launch control and public site; Document Processing and workers.
3. Core case model; Intake; Payment Records.
4. Operations; TA Delivery; Derived Views and measures.
5. Release/cutover, backup/restore, capacity, local install; full verification suite; crawl/SEO check.
6. Independent multi-lens review, fixes, the bounded final UI/UX pass, final verification and report.

## 12. Production maintainability and extension model (product owner, 2026-10-04)

The system MUST stay easy to maintain and extend in production. "Extension" means onboarding new countries and new services in existing countries. Design and code for it from the foundation.

- **Service in an existing country, using existing service shapes, document types and validators:** catalogue data only (structural declaration + business baseline + behaviour binding already supplied by a release + scoped launch approval). No code change, no deployment.
- **New country, or a service needing country-specific behaviour** (field mapping, document validity checks, official-artifact recognition, cut-off evidence rules): one self-contained country adapter package `src/countries/<iso-code>/` implementing a versioned adapter interface, registered in one registry, declaring the declaration-schema versions it supports. Adapters receive scoped inputs and return proposals/evidence only; they never write state, import module internals or reach the network. A reusable **adapter conformance test kit** MUST pass for every adapter. A synthetic reference adapter (country "Synthetica") demonstrates the pattern.
- **New document type or validator:** added to the shared document-type/validator registry once, reused by every offering; offerings select and may narrow, never fork, shared validators.
- **New actor/authority shape or change to the shared business contract:** not an extension; it needs a product owner decision.
- **No country or service special-casing in core modules.** A static test rejects country codes, country names and offering identifiers in `src/kernel`, `src/platform`, `src/modules/*` and `src/web` outside data fixtures. Behaviour varies only through declarations, bindings, registries and adapters.
- **Maintainability practices:** one responsibility per module with explicit public interfaces (`index.ts` exports only); sole-writer table ownership; closed sets with runtime validation; forward-only, checksummed SQL migrations with expand/contract for breaking changes; typed configuration validated at startup (12-factor style, secrets separate); structured allowlisted logs and separated health checks; dependency pinning with lockfile, `npm audit` and a CycloneDX SBOM (`npm sbom`) in each release manifest; lint + typecheck + tests as one gate; security controls mapped to OWASP ASVS level 2 where applicable; concise public docs: `docs/architecture.md`, `docs/operations.md`, `docs/extending/new-country.md`, `docs/extending/new-service.md`.
