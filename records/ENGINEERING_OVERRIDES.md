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
