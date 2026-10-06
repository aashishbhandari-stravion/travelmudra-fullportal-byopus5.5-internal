# Engineering overrides

Owner: orchestrator. Spec authority: B47 ("Record each material engineering replacement with prior choice, replacement, reason, impact and downstream consequence").
Each entry is reversible engineering decomposition unless stated. None changes a business rule.

## EO-01 — Authoritative store: SQLite → PostgreSQL 16 (2026-10-04)
- Prior choice: SQLite via `node:sqlite`, single writer, `BEGIN IMMEDIATE`, runtime DDL denial through the SQLite authorizer (brief revision 1).
- Replacement: dedicated PostgreSQL 16.15 cluster, Unix-socket only, SCRAM, `tm_owner` (DDL/migrations/backup export) and `tm_app` (runtime DML; fact log INSERT/SELECT only) roles; SERIALIZABLE command transactions with bounded whole-command retry; outbox tasks for all external effects.
- Reason: product owner directed installation of missing components and best available libraries. PostgreSQL gives true concurrent transactions (so concurrency tests prove real behaviour), database-enforced distinct migration authority and append-only history, and a direct production path.
- Impact: async command handlers; per-test-file databases cloned from a migrated template; backup via `pg_dump`/`pg_restore`.
- Downstream consequence: production host needs PostgreSQL 16 (≈1 GB `shared_buffers` budget on an 8 GB host). Restore and cutover procedures are PostgreSQL-specific.

## EO-02 — Dependencies: zero runtime npm dependencies → vetted pinned library set (2026-10-04)
- Prior choice: no runtime dependencies; hand-written HTTP router, multipart handling, XLSX reader, TOTP, CAPTCHA stub.
- Replacement: pinned MIT/Apache-2.0/ISC/MIT-0 libraries listed in brief §1.1 (Fastify and plugins, pg, zod, pino, otpauth, qrcode, altcha, nodemailer, rate-limiter-flexible, sharp, file-type, SheetJS CE 0.20.3 from the official CDN, mrz, ipaddr.js, request-filtering-agent, yazl). `npm audit --omit=dev`: 0 vulnerabilities at install (2026-10-04). 148 runtime packages including transitive.
- Reason: product owner direction; mature libraries reduce bespoke security-sensitive code (multipart parsing, spreadsheet parsing, TOTP).
- Impact: larger supply-chain surface; lockfile integrity pins every version.
- Downstream consequence: dependency updates need review and re-verification; SheetJS is installed from its CDN tarball, not the stale npm-registry package.

## EO-03 — Malware scanning: structural scanner only → ClamAV 1.5.4 plus structural checks (2026-10-04)
- Prior choice: in-house structural scanner (EICAR, PDF active content), recorded as not an antivirus engine.
- Replacement: dedicated `clamd` over a private Unix socket (INSTREAM), `freshclam` signature updates, fail closed; structural checks retained (qpdf object inspection, file-type, sharp decode).
- Reason: free open-source engine available; product owner declined paid scanners where a good free option exists.
- Impact: ≈1.0 GB resident (measured 1004 MB, 11 s start, `ConcurrentDatabaseReload no` avoids reload doubling).
- Downstream consequence: production needs signature updates (network to the ClamAV mirror) and the memory budget above.

## EO-04 — OCR: none (manual only) → local Tesseract 5.3.4 + MRZ parsing (2026-10-04)
- Prior choice: no local OCR; images routed to manual resolution.
- Replacement: Tesseract with sharp preprocessing and `pdftoppm` for scanned PDFs, `mrz` parsing with autocorrect and check digits, all inside the network-isolated parse worker. Results are proposals; low confidence or conflict still routes to manual resolution.
- Reason: product owner direction; local processing satisfies the no-hosted-OCR rule.
- Impact: CPU-bound per page; one parse worker initially.
- Downstream consequence: OCR accuracy is guidance, never an identity decision; same-name/strong-identifier conflicts stay unresolved incidents.

## EO-05 — CAPTCHA: synthetic stub → ALTCHA self-hosted proof-of-work (2026-10-04)
- Prior choice: synthetic local challenge.
- Replacement: ALTCHA (`altcha-lib` server verification, self-hosted widget), HMAC key in secrets, single-use challenges.
- Reason: real mechanism with no third-party data sharing and no provider selection.
- Impact: the TA sign-in page needs `script-src 'self'` for the widget; all other pages keep `script-src 'none'`.
- Downstream consequence: bot-resistance adequacy in production remains unproven by local tests.

## EO-06 — Backup encryption: in-process AES-GCM → age 1.1.1 (2026-10-04)
- Prior choice: node:crypto AES-256-GCM.
- Replacement: `age` with an X25519 identity in the secrets directory.
- Reason: well-reviewed streaming file-encryption format and tool.
- Downstream consequence: key custody covers the age identity file.

## EO-07 — Toolchain installation without root (2026-10-04)
- Prior choice: host packages assumed present.
- Replacement: `scripts/toolchain/install-user-toolchain.sh` downloads exact Ubuntu 24.04 packages with `apt-get download` (verified against signed indexes), extracts them into a user prefix, writes a SHA-256 manifest and `env.sh`. System-wide installation of the same packages remains an option for a host administrator.
- Reason: passwordless sudo was not active in this session (`sudo -n` required a password; `/etc/sudoers.d/` held only its README); the product owner's temporary sudo offer was therefore not used. No host configuration was changed.
- Downstream consequence: development processes use `LD_LIBRARY_PATH`/`TESSDATA_PREFIX`/`CVD_CERTS_DIR` from the prefix; packages in the prefix do not receive unattended security updates — rerun the script (optionally `--unpinned`) to refresh.

## EO-08 — Client script policy: no JavaScript → progressive enhancement with one first-party script (2026-10-04)
- Prior choice: CSP `script-src 'none'` everywhere except the CAPTCHA page.
- Replacement: CSP `script-src 'self'` (no inline, no eval) with one small first-party enhancement script; every flow still works without JavaScript.
- Reason: product owner's UI/UX direction (dynamic, responsive, meaningful micro-interactions, upload progress, live status) on top of server-rendered pages.
- Impact: a first-party script surface to review; CSP still blocks inline and third-party scripts.
- Downstream consequence: XSS defence still relies on output escaping plus a strict CSP without inline script.

## EO-09 — Design skills installed (2026-10-04)
- UI UX Pro Max (nextlevelbuilder/ui-ux-pro-max-skill@477bcb2), Impeccable (pbakaus/impeccable@6e802bd), Taste (Leonxlnx/taste-skill@ce26fc2, `design-taste-frontend`) installed at user level with PROVENANCE.md files; scripts reviewed before install (UI UX Pro Max: offline stdlib search over bundled CSV; Taste: markdown only; Impeccable: launcher that downloads a release engine binary verified only against a same-release checksum, plus a live mode that injects a script and asks for CSP relaxation).
- Pre-fetching the Impeccable engine was first denied by the session's auto-mode safety classifier; the product owner then explicitly authorized it. Engine 0.1.11 (`impeccable-linux-x64`, static-pie ELF) was fetched through the skill's launcher, which verified it against the release `.sha256`; its SHA-256 0221607e1f535af937ea267c347b1f90233b85dc2563cbd2eeefdf42e0e5c594 also matches GitHub's server-side asset digest. The release was published by github-actions[bot]; no build-provenance attestation exists for it. `context` was verified read-only; `detect` found 6/6 seeded anti-patterns in a probe page. Agents may run `context` and `detect` only; live mode, update/install/link/pin and CSP relaxation stay forbidden.

<!-- EO-10 to EO-18: drafted in the design consolidation (register 02 Part B); reviewed and accepted by the architect 2026-10-04. -->

## EO-10 — Worker resource limits: `prlimit --as/--nproc` → user cgroup scope (BND-01)
- Prior choice: brief §2 and §2.1, contract §10.3 (rev 1): `prlimit --as=768MiB --nproc=16` (parse) and `--as=256MiB --nproc=8` (fetch) around `bwrap`; toolchain resolved at `${toolchain.dir}/bin`; host `LD_LIBRARY_PATH`/`TESSDATA_PREFIX` passed into the sandbox.
- Replacement: `systemd-run --user --scope -p MemoryMax -p MemorySwapMax=0 -p TasksMax -p CPUQuota` around `prlimit --cpu --fsize --nofile -- bwrap …`; no address-space or process limit on the Node worker; `prlimit --as` (512 MiB) only on spawned native tools; explicit sandbox environment (`LD_LIBRARY_PATH=/opt/tm-toolchain/root/usr/lib/x86_64-linux-gnu`, `TESSDATA_PREFIX=…/root/usr/share/tesseract-ocr/5/tessdata`, `VIPS_CONCURRENCY=1`); `resolveTool` searches `root/usr/lib/postgresql/16/bin`, `root/usr/bin`, `root/usr/sbin`; start-up self-test with the real launch line; no silent fallback.
- Reason: verified on this host (2026-10-04): `prlimit --as=768MiB node` aborts at start (V8 code-range reservation); `prlimit --nproc` counts every thread of the uid, so `bwrap` fails with EAGAIN; the toolchain lives under `root/usr/…`; `tesseract` cannot find its libraries without the prefix path. The rev 1 line stopped every document from becoming content-safe.
- Impact: memory and task bounds are enforced by the kernel cgroup; native tools keep per-process address limits; worker health is `down` when the user systemd manager is unavailable.
- Downstream consequence: the production host needs a user systemd manager with lingering (present here) or an equivalent delegated cgroup; this is a host/owner item at production setup. Contract §10.3, record 14 §5.2, tests T-F29/T-W09.

## EO-11 — Restore: plain `pg_restore` → `pg_restore` + transaction-id epoch advance + projection rebuild (REC-03)
- Prior choice: record 15 §3.5.2 (rev 1): `pg_restore` into a new cluster, then reopen.
- Replacement: after `pg_restore`, stop the cluster and run `pg_resetwal -e <epoch>` so every new `xid8` exceeds the largest restored `sys_facts.tx_id`; restart; rebuild every projection before reopening. Snapshot rollback also rebuilds projections.
- Reason: projection tailing uses the `xid8` watermark (contract C-04); a fresh cluster restarts its counter, so restored facts are hidden and new facts fall below the restored cursor.
- Impact: restore needs the PostgreSQL server binaries of the prefix and a stopped cluster for one step; restore takes longer by one rebuild.
- Downstream consequence: restore procedures stay PostgreSQL-specific (as EO-01 says); test T-F41/T-15-78 MUST run on the installed PostgreSQL 16.15.

## EO-12 — Backup and checkpoint capture: file-then-encrypt → drain + exported snapshot + streaming encryption (REC-01, REC-02, SEC-05)
- Prior choice: record 15 §3.4.2 step 3 and §3.5.1 (rev 1): plaintext `pg_dump` to file, blob copies to files, `age` per file afterwards; inventory read from the live database after the dump; blobs only in areas `canonical`/`quarantine`; no checkpoint retention.
- Replacement: drain before capture; one exported snapshot shared by `pg_dump --snapshot` and the blob inventory; inventory by owner reference in any area (including staged blobs with a pending move); every artifact streamed through `age` (no plaintext at rest); checkpoints encrypted and disposed by `tm cutover cleanup` after a later complete backup; size estimate before capture.
- Reason: B40 requires a consistent export plus every referenced blob, and encrypted recovery sets.
- Impact: longer backup window (drain); `age` in every pipe; free-space check uses an estimate.
- Downstream consequence: restore and rollback always need the custody identity (see Part C REC-19).

## EO-13 — Catalogue release registration: after opening → inside the closed cutover verify step (COV-13 item 9)
- Prior choice: record 12 E1 (rev 1): `tm cutover open` runs `cat.register_release_catalogue` as the first command after admission opens; contract §4.2 refused every command while closed.
- Replacement: `CommandDef.maintenanceAllowed` for the engineering actor; `assertMaintenanceWriter` accepts admission `closed` with `closure_kind ∈ {initial, cutover}`; E1/E2 run during cutover step 6.
- Reason: B39 "verifies … binding … compatibility while closed, then deliberately opens"; removes the window in which a new release serves cases without its catalogue registration and impact assessments.
- Impact: one narrowly scoped exception to "no command while closed".
- Downstream consequence: cutover verify fails closed if registration fails; opening stays a separate deliberate step.

## EO-14 — Identity mail and codes: shared `mail.deliver`, 32-byte OTP token, enrolment token in URL → `iam.send_mail`, 8-digit OTP, enrolment code in a form (record 11 CCR-01, CCR-02, CCR-04)
- Prior choice: contract rev 1 §1.1, §2.21, §12.1.
- Replacement: Identity-owned task `iam.send_mail` (code encrypted on the `iam_` row until sent, then wiped); OTP = 8 decimal digits with bounded attempts; enrolment code typed into `POST /staff/enrol`.
- Reason: sole writers (only Identity writes `iam_` rows; no secret in task payloads); a typed code is usable by a person (B08 bounded attempts); no bearer token in a URL (contract §5.5).
- Impact: one more task kind; per-challenge guess probability 5 × 10⁻⁸.
- Downstream consequence: none outside Identity.

## EO-15 — Harness actor kind (record 13 CCR-07; 11 CCR-13; 15 CCR-15-14)
- Prior choice: contract rev 1 §2.24 / §7.11: harness commands and the synthetic seed run as the `engineering` actor with a `harness:` label, although the engineering actor may not write business facts.
- Replacement: actor kind `harness`, registered only in `test`/`local_test`, refused in production configuration; facts carry `actor_kind = 'harness'` and `command_name` prefixed `harness.`.
- Reason: one auditable model; keeps "engineering never writes business facts" true.
- Impact: one more value in a closed set and a CHECK.
- Downstream consequence: production databases contain no `harness` facts (startup refuses synthetic data in production).

## EO-16 — Kernel attribution sink for country defects (REC-07)
- Prior choice: record 14 §3.4.6 (rev 1): the validity evaluator wrote the `country_defect` incident inline.
- Replacement: evaluation records an in-memory attribution; the kernel flushes it after the transaction (commit or rollback, read or write) by enqueuing `ops.attribute_country_defect`.
- Reason: B36 attribution must survive refused commands; read transactions MUST NOT write.
- Impact: one task kind and one flush step in the runner.
- Downstream consequence: none outside the kernel and Operations.

## EO-17 — Task protocol hardening: lease-expiry bound, `defer`, blob owner hooks (REC-04, REC-17, record 14 CCR-03/CCR-04)
- Prior choice: contract rev 1 §4.6: Recover set `failed_retryable` with no attempt check; no `defer` result; no owner hook for a terminal blob move.
- Replacement: attempt bound at Lease and Recover with backoff and `lease_expired_exhausted`; `defer` without attempt use only while the awaited event can still happen; `onMoved`/`onIntegrityFailed`/`onMoveFailedTerminal` hooks.
- Reason: B35 bounded retry and failure visibility; B12 missing bytes keep an owner.
- Impact: poison tasks stop after `max_attempts`.
- Downstream consequence: a crash-looping task becomes visible to its failure owner instead of looping.

## EO-18 — Durable dedupe keys never derive from rotating secrets (REC-20, SEC-09)
- Prior choice: record 13 §2.2 (rev 1): `ops_originals.item_key = passport:<applicant key HMAC>` with an unnamed key.
- Replacement: the plain applicant key in the owner table; rule in contract §1.1 for every durable uniqueness key.
- Reason: B40 restores install new secrets; a secret-derived key breaks the B30 once-only guard.
- Impact: one PD column in an owner table (never in diagnostics).
- Downstream consequence: none.

## EO-19 — Country/service extension architecture (2026-10-04)
- Prior choice: country-specific behaviour referenced only as `country_adapter_check` and 200 ms containment rules in records 12 and 14; no adapter interface, registry, package layout or conformance kit.
- Replacement: contract §16: versioned pure adapter contract `tm-country-adapter/1`, one registry, `invokeAdapter` containment, conformance kit run for every registered adapter, two synthetic reference adapters, static no-special-casing test, onboarding playbooks.
- Reason: product owner requirement (brief §12) that onboarding new countries and services is easy in production.
- Impact: one new source area `src/countries/`; five foundation tests (T-F50–T-F54).
- Downstream consequence: every country-specific rule ships as an adapter capability through a release; services on existing shapes need no code.

## EO-20 — Primary case lists read the authoritative tables (2026-10-06)
- Prior choice: record 15 §4.3 lists T18, O02, D02 and D10 among the pages that read the case projections (`view_applications`, `view_assignment_queue`).
- Replacement: those four lists keep reading Core's and Payment Records' authoritative tables through their own queries, scoped by the access policy on `core_applications`. The projections serve search, history, the SuperAdmin applications list with filters (D11), the monitors and the measures.
- Reason: a primary work list must never lag behind the work it lists. The projections are rebuild-safe and exactly-once but asynchronous; an operator or SuperAdmin acting from a lagging list could miss or double-handle work. Search and history tolerate a short, signalled lag.
- Impact: none on schema or contracts; the projection queries `views.ta_applications` and `views.ops_work` stay bound and tested for a later switch.
- Downstream consequence: if list filters by progress or group are required on T18/O02/D02/D10, add them to the authoritative queries or switch with a visible "not current" signal.
