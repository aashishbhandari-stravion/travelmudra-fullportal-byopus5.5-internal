# TravelMudra architecture brief (orchestrator decisions)

Owner: orchestrator (Claude Opus 5.5 parent session). Date: 2026-10-04.
Authority: `internal/records/BUILD_SPEC.md` (SHA-256 4a6fd90657b0723f67fb13a58aa57b3377238fd361ee8f706867bb714d58ea89). This brief records reversible engineering decisions under spec rule B47. Rule numbers (B01–B47) refer to that spec.

## 0. Repository discipline (applies to every agent)

- The project root is a public-bound repository. Tracked files, commit messages, branch names and tags MUST be public-fit.
- Tracked files and commit messages MUST NOT contain: spec rule identifiers (`B01`…`B47`), the words `BUILD_SPEC`, agent names, local absolute paths (`/home/...`), internal paths (`internal/...`), personal names or emails, secrets, or real personal data.
- Code comments explain an invariant and its reason in product terms (rule S5), never by citing a rule number.
- Rule-to-test traceability, design records, review findings and evidence live in `internal/records/` (separate private repository). Implementation code never lives there.
- All synthetic data is labelled synthetic (e.g. `@synthetic.test` emails, country "Synthetica", names prefixed `SYN`). Never use real personal data, real passport numbers or real business addresses.

## 1. Stack (fixed)

- Node.js 24.19 (pin in `package.json` `engines` and `.nvmrc`). TypeScript source executed directly by Node type stripping. Use erasable syntax only: no `enum`, no `namespace`, no parameter properties, no decorators. Imports use explicit `.ts` extensions.
- Dev dependencies only: `typescript` 5.9.3 (type check, `noEmit`) and `@types/node` 24.x, pinned with a committed `package-lock.json`. **No runtime npm dependencies.** Any further dependency needs an orchestrator decision record (rule R5).
- `tsconfig.json`: `strict`, `noEmit`, `allowImportingTsExtensions`, `verbatimModuleSyntax`, `erasableSyntaxOnly`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `module`/`moduleResolution` `nodenext`, `target` `es2024`.
- Tests: `node:test` + `node:assert/strict`. Integration tests start the real server on an ephemeral 127.0.0.1 port with a temporary data directory and real persisted SQLite files.
- One check entry point: `npm run check` = type check + lint-style static invariant tests + all tests. Also `npm test`, `npm run typecheck`.

## 2. Process topology (local test installation)

- `tm-server`: one active release process. HTTP(S) entry, all business writers, internal task runner. Default bind `127.0.0.1:4610`. HTTPS via locally generated certificate when remote testers are configured; no public tunnel; no bind to non-loopback addresses unless configured explicitly.
- `tm` CLI: migrate, synthetic seed (local-test only), backup, restore, cutover (close/drain/checkpoint/migrate/verify/open), protection mark, release manifest, capacity record, SEO crawl check, synthetic mailbox reader, test harness actions.
- Restricted file workers: separate child processes launched through one `WorkerRunner` facility with `bwrap` + `prlimit`:
  - fetch worker: network allowed; filesystem limited to one scoped output directory; SSRF-safe public retrieval (Section 9).
  - parse worker: `--unshare-all` (no network), read-only system binds, one scoped temp directory, cleared environment, `--die-with-parent`, CPU/memory/file-size limits, wall-clock timeout with kill.
  - Workers never write business state. They return bounded JSON proposals/evidence over stdout; the owning writer accepts or rejects them.
  - Initial concurrency: one fetch worker and one parse worker.
- Country-specific behaviour runs in-process as versioned adapters with scoped inputs, bounded inputs/results, time limits and proposal-only outputs. A country error is contained and attributed to that country. In-process runaway work may interrupt the shared process (accepted owner decision); do not build a sandbox, broker or per-country scheduler.

## 3. Storage

- Authoritative state: one SQLite database (`node:sqlite` `DatabaseSync`), WAL, `foreign_keys=ON`, `synchronous=FULL`, `busy_timeout`, defensive mode. Every write uses `BEGIN IMMEDIATE`. A command handler is fully synchronous inside its transaction: no `await` between first read and commit.
- Runtime connections deny DDL through `setAuthorizer`. Schema migration runs only through the `tm migrate` / cutover path with distinct migration authority.
- Private bytes: blob store on disk under the data directory, outside any served path. Blob files are named by random identifiers, never by content hash. SHA-256 digest and size are recorded as integrity evidence. Areas: `staging/`, `quarantine/`, `canonical/`. A blob becomes available only after a committed owner reference; cleanup never removes a referenced blob or a staged blob whose owner reference may still commit.
- Money: integer paise (INR minor units). Never floating point.
- Time: UTC ISO-8601 with milliseconds for recorded time; separate event time where known. Business calendar dates (travel dates, group-end) use the declared basis `Asia/Kolkata` (UTC+05:30, no DST). Clock and timer are injectable facilities.
- Identifiers: `<prefix>_<26 Crockford base32 chars>` from 128 random bits. Identifiers carry no time order. Ordering uses the fact-log sequence, never clock order.
- Secrets: separate directory (mode 0700) outside the repository and outside the data directory backup metadata: session key, OTP pepper, CSRF key, job credential key, backup encryption key, TLS key. Never logged.

## 4. Module ownership (sole writers)

Each module owns a table prefix. Only code under that module's directory may write its tables. Other modules read through the owner's exported query functions. A static test enforces both rules by scanning SQL text.

| Module | Dir | Table prefix | Owns |
|---|---|---|---|
| Kernel | `src/kernel` | `sys_` | operation records (idempotency), fact log (history/audit), internal tasks, installation state (admission, writer epoch, release), schema migrations |
| Identity & Access | `src/modules/identity` | `iam_` | accounts, roles, grants (read grants, accounting grant), sessions, OTP attempts, TOTP, email changes, rate-limit buckets, access policy |
| Catalogue | `src/modules/catalogue` | `cat_` | countries, offerings, structural declarations, business baselines, behaviour bindings, publications, impact assessments |
| Core | `src/modules/core` | `core_` | groups, applications, applicant snapshot, submission/price, assignment, control acceptance, gate exceptions, action authorization, lifecycle/outcome/completion, dependencies, deferral |
| Intake | `src/modules/intake` | `intake_` | intake attempts, row results, mapping questions, intake incidents |
| Document Processing | `src/modules/documents` | `doc_` | document versions, safety verdicts, extraction verdicts, classification/association verdicts |
| Operations | `src/modules/operations` | `ops_` | local case work, readiness judgements, problem reports handling, launch control, incidents (association, disclosure, operational), physical custody, artifact eligibility, external-act records, failure classification |
| Payment Records | `src/modules/payments` | `pay_` | service payment entries, government fees, Gate 2 decisions, TA ceilings, exposure reservations, financial exceptions/follow-up |
| TA Delivery | `src/modules/delivery` | `dlv_` | byte releases, document email sends, web notices, retrievals, packet/physical handover records |
| Derived Views | `src/modules/views` | `view_` | projections only (lists, progress, queues, audit search, measures) |

Cross-owner atomicity: a command handler owned by one module may call another owner's writer function with the same transaction handle (example: Core action authorization calls Payment Records exposure reservation). Both commit together or neither commits.

## 5. Kernel contracts (foundation)

- **Command runner.** `runCommand(def, ctx, input)` performs, in one `BEGIN IMMEDIATE` transaction: admission and writer-epoch check; operation-key lookup; current actor/account re-check; authorization through the access policy; validation; guards; owner writes; fact-log append; internal-task enqueue; operation record. Then commit. Any thrown error rolls back and returns an explicit typed failure (never acknowledges an uncommitted mutation).
- **Operation identity.** Every consequential command carries an operation key (client-generated, embedded in each rendered form) plus a canonical content hash of the normalized input. Same key + same content returns the recorded result, re-authorized under current read access. Same key + different content returns a conflict. A new key cannot bypass business duplicate guards. Lost acknowledgement: client retries the same key; result lookup is authorized under current access.
- **Optimistic revisions.** Every mutable aggregate row has `revision`. Commands that change it carry the expected revision; a stale revision is a conflict. No latest-write-wins.
- **Fact log.** Append-only (`UPDATE`/`DELETE` blocked by triggers). Each consequential fact records: sequence, recorded time, optional event time, actor (account id + role, or system task, or attributed engineering actor), command name, operation id, subject type/id, fact type, before/after JSON, reason, evidence references, owner module, retrospective flag. Absent facts stay absent.
- **Internal tasks.** Durable task rows written in the same transaction as their cause. At-least-once execution, leases with hashed lease tokens, bounded retries, visible failure state, original identity preserved. Each run re-checks current permission and state. Tasks never perform a government action or a payment.
- **Errors.** Closed set of error categories (e.g. `not_found_or_forbidden`, `conflict`, `stale_revision`, `validation_failed`, `gate_blocked`, `unavailable_parked`, `unavailable_admission`, `rate_limited`, `capacity_limited`, `maintenance`, `internal`). Authorization failures on objects return `not_found_or_forbidden` to avoid existence disclosure.
- **Diagnostics.** Allowlisted structured fields only (ids, categories, durations, counts). Never source URLs, document content, credentials, OTPs, emails or extracted personal data.
- **Closed sets.** All states, outcomes, progress meanings, roles, actions, gates, fact types and error categories are closed `as const` sets with runtime validation at boundaries.
- **Admission/maintenance.** Installation state row: `admission` (`open`/`closed`), `writer_epoch`, active release id, closure reason. Maintenance survives restart. A process whose epoch is stale refuses all writes and exits.
- **Fault injection.** Named fault points available only when the process runs with test environment; production/local-test configuration refuses to enable them.

## 6. Access policy (one implementation)

`authorize(tx, actor, action, resource)` is the single policy entry. Every route, command, search, direct link, support view, task result, operation-result lookup and byte release calls it with current state (account status, owning TA, assignment, grants). Results for objects outside scope are indistinguishable from not found. Derived views never grant permission; each row is re-authorized or the projection query is scoped by the same policy predicate.

## 7. Web surfaces

- Server-rendered HTML only. Auto-escaping template helper. No client JavaScript required; CSP `script-src 'none'` unless a later decision changes it.
- Surfaces: public (`/`, countries, about, search over static content, `robots.txt`, `sitemap.xml`), TA (`/ta/...`), operator (`/ops/...`), SuperAdmin (`/admin/...`), Accounts (`/accounts/...`, parked actions shown unavailable).
- Every state-changing request: POST, session, CSRF synchronizer token, Origin/Referer check against configured origins, operation key. No generic table-mutation route.
- Security headers: CSP, `frame-ancestors 'none'`, `Referrer-Policy: no-referrer`, `X-Content-Type-Options`, HSTS on HTTPS, `Cache-Control: no-store` on authenticated and byte responses. Authenticated pages carry `noindex`; robots disallows private surfaces.
- Public site content is static, versioned content in the repository. Business locality is an unverified placeholder until verified evidence is supplied; the SEO check reports it as a release blocker. Do not invent business facts.

## 8. External seams (synthetic in local test)

All seams have an interface and a clearly labelled synthetic local implementation. A synthetic result never claims real delivery, CAPTCHA, payment or government action.

- Email transport: synthetic mailbox writes messages to the data directory and a table; returns `synthetic_accepted`, or configured `failed`/`uncertain` results for test recipients.
- CAPTCHA: server-side challenge issue/verify; synthetic local challenge.
- Malware scanning: `MalwareScanner` interface; fail closed when no scanner is configured. Local implementation: structural scanner (EICAR signature, PDF active content such as JavaScript/Launch/EmbeddedFile/OpenAction, polyglot and trailing-data checks). It is not a full antivirus engine; this is a recorded limitation.
- Text extraction: `pdftotext` inside the parse worker for PDFs; images have no local OCR and route to manual resolution. Hosted OCR/LLM is excluded.

## 9. Content safety (fetch and parse)

- Fetch: allow only `https:` (and `http:` only if a later decision allows; default https only) public hosts. Resolve DNS, reject every non-public address (loopback, private, link-local, CGNAT, unique-local, multicast, metadata ranges, IPv4-mapped forms), connect to the vetted address with SNI/Host of the original name, follow redirects manually with the same check per hop and a bounded hop count, never forward credentials/cookies, cap bytes/time. Google Sheet and public folder sources use their public export/listing forms through the same fetch path.
- Quarantine all fetched/uploaded bytes. Check declared/actual format, size (applicant documents: PDF/JPEG/PNG, ≤ 5 MB each unless an offering narrows), and malware before any content read. Then parse/extract in the parse worker.
- Excel (.xlsx) reading: a bounded in-house ZIP + SpreadsheetML reader that runs only inside the parse worker, with entry count, uncompressed size and ratio limits.

## 10. Deliberate boundaries (keep visible)

Implement each parked, excluded, known-limitation and owner-decision item as a visible `unavailable` state with its reason, never as an inferred default. Examples: TA-exposure reservation release, the fee-exclusion record, the ordinary paid case at the default ₹0 ceiling; Accounts dashboard actions and Payment Records mutation path for Accounts; write-off; refunds; first-admin and all-admin-loss recovery; lost-mailbox recovery; delivery send trigger and completion-check trigger/owner (the system provides the evidence and the pending boundary only; tests and a labelled local test harness invoke checks directly).

## 11. Milestones (local main, one tag each)

1. Foundation: scaffold, kernel, platform facilities, schema framework, access-policy skeleton, invariant tests, independent foundation review.
2. Identity & Access and web shell; Catalogue, launch control and public site; Document Processing and workers.
3. Core case model; Intake; Payment Records.
4. Operations; TA Delivery; Derived Views and measures.
5. Release/cutover, backup/restore, capacity, local install; full verification suite; crawl/SEO check.
6. Independent multi-lens review, fixes, final verification and report.
