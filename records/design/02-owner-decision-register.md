# TravelMudra owner-decision register (design record 02)

Owner: orchestrator. Date: 2026-10-04. Status: revision 1, written during the design consolidation after the five-lens design review (ledger `internal/records/reviews/2026-10-04-design-review-ledger.md`).
Authority: `internal/records/BUILD_SPEC.md` (B01–B47). Contract `01-foundation-contract.md` revision 2 governs the design. This register governs where it differs from the owner-decision lists in records 01, 11–15.

Rules for this register:
- Part A lists genuine owner decisions (B47: an actual contradiction or unknowable requirement in business semantics, money/state correctness, security, privacy or legal duties). Each decision has a safe interim that the design implements now. No decision blocks the foundation milestone; work that does not depend on a decision continues.
- Part B lists material engineering replacements of a prior technical choice (brief revision 2 or contract revision 1). Each entry carries prior choice, replacement, reason, impact and downstream consequence, and is ready to copy into `ENGINEERING_OVERRIDES.md` (proposed numbers EO-10 onward; EO-08 and EO-09 exist).
- Part C lists review findings ranked P1 that this consolidation did not work. The product owner decides for each: park, or have it worked.
- The interim of every Part A item is visible in the product as a closed reason code or a recorded rule; none is a silent default.

## Part A — Genuine owner decisions (B47)

### A.1 New decisions raised by the design review

**OD-R2-01 — Is a "TA" for the exposure ceiling one person account or one TravelAgent business?** (money; review finding MON-07)
- Spec text: B28 "Before a TM-funded government-fee commitment, atomically compare the proposed fee plus that TA's counted reserved and TM-paid-unrecovered fees across every group/application with the TA's rupee ceiling … A breach is a non-overridable stop". Header: "TA means TravelAgent". B08 "Every account represents one person; no shared credentials or impersonation."
- Why it is an owner decision: one agency with several staff accounts gets one ceiling per person under the current design, so its business-wide TM-funded exposure can reach a multiple of the intended limit. Whether a TravelAgent is a person or a business that owns several person accounts is business semantics and money correctness; the spec states both "TA-wide" and "one person per account".
- Safe interim (implemented): contract I-09 — one `pay_ta_exposure` guard row per TA account; ceiling default ₹0; increases need a second SuperAdmin. Recommended additional interim if the owner wants it before deciding: refuse approval of a second TA account declared as belonging to an existing agency (an approval note only; no data model change).
- Work that continues: all. If the owner chooses the business model, `pay_ta_exposure` is keyed by a business id and every account of that business locks the same guard row; no other module changes.

**OD-R2-02 — Does Payment Gate 1 bind only at assignment, or again whenever operator work or approved assistance starts?** (money, gate semantics; COV-04, MON-08, BND-07)
- Spec text: B26 "Before assignment/operator work, including approved assistance, require current `payment_received` or a fresh application-specific Gate 1 exception. Assignment is not payment. … If work proceeds unpaid under an exception, or a payment entry is later corrected after operator work, retain an owned financial exception and follow-up." B18 "Payment Gate 1 must pass or be excepted before any operator work, including help."
- Why it is an owner decision: "current … before assignment/operator work" can mean "at assignment" or "at each start of operator work". The difference matters when a payment is corrected to unpaid after assignment but before any work, and when assistance is approved in place on an already-assigned returned case (record 13 CMD-A2).
- Safe interim (implemented): Gate 1 is evaluated and consumed at assignment and reassignment (contract §2.11); later operator work uses the assignment basis; a later correction to unpaid opens `worked_then_corrected_to_unpaid` with an accountable SuperAdmin (record 15 C-P1); Gate 2 is still required before every government commitment (B27). Test T-CO69 encodes this interim and changes with the decision.
- Stricter alternative ready to apply on a "re-evaluate" decision: evaluate Gate 1 at `start_operator_work`, `assistance_entry` and in-place assistance approval when the active assignment has no `_work_started` row (current `payment_received` or a fresh `assign`-scoped exception), and record the result on the work step.
- Work that continues: all.

**OD-R2-03 — What evidence makes a manual `payment_received` entry, and what closes a `Payment_Missing_Override` follow-up?** (money, audit; COV-05, BND-06; extends OD-15-01)
- Spec text: B26 "SuperAdmin records manual per-application service payment status and additive corrections with actor/time/evidence." B29 "Accounts … owns bank-receipt verification/allocation … It survives service completion until collection or authorized write-off". B33 "Required evidence unavailable means no claimed accepted action." Contract §2.23: an attestation "never stands in for unavailable required evidence".
- Why it is an owner decision: the spec does not define payment evidence. Record 15 accepts an entry whose only evidence is an attestation ("TA said they paid"); such an entry passes Gate 1 and Gate 2 and closes open follow-ups as `closed_collected`, although bank verification belongs to the PARKED Accounts duty.
- Safe interim (implemented): record 15 C-P1 as written (≥ 1 evidence reference of kind `external_reference` or `attestation`); OD-15-01 interim for closure (a later `payment_received` entry closes open exceptions; the opening entry never closes its own exception). Recommended stricter interim on request: `payment_received` requires at least one `external_reference` or `document_version`; an attestation only accompanies it; a closure by a SuperAdmin entry shows as `closed_by_service_entry`, not "collected".
- Work that continues: all payment tracking, gates and exposure.

**OD-R2-04 — May every SuperAdmin download applicant documents and official results without a stated purpose?** (privacy; SEC-03)
- Spec text: B10 "Authorize every metadata read, search, source, direct link, support view, background result, command and byte release against current account state, owning TA, assignment and any exact scoped read grant. … SuperAdmin exact-result support view uses the selected user's read scope without impersonation or target actions." B13 "if none is assigned, a SuperAdmin assigns a reviewer without filing authority."
- Why it is an owner decision: the spec names no SuperAdmin byte-access basis; the design grants SuperAdmins byte retrieval (single and bulk selection) for every application. Minimizing access to personal documents is a privacy choice.
- Safe interim (implemented): contract §5.3 row `document.retrieve_bytes` with SuperAdmin `Y`; every release passes the release check and is recorded in `dlv_releases` with recipient, version and operation (B12). Minimization option ready on request: a distinct action `document.retrieve_bytes_admin` with a required reason and a closed purpose code (`evidence_correction`, `payment_evidence`, `disclosure_incident`), a fact `iam.admin_byte_access`, refusal while the audit projection is degraded, and no bulk selection for SuperAdmins.
- Work that continues: all; the staff review channel for B13 (SEC-02) is already scoped to the incident owner and reviewer.

**OD-R2-05 — May a real physical-original offering launch while original return is unavailable?** (custody, legal duty; BND-12; consequence of OD-12-02)
- Spec text: B30 "PARKED route policy includes shared-item return priority, assignment suitability, recipient evidence, loss/damage and cross-party visibility; affected steps remain unavailable until bounded/settled." B24 "A physical original holds completion until operator/SuperAdmin records owner receipt." B02 "A country/service can be offered only after its current route, eligibility, authority, pricing, evidence, operating readiness and launch requirements are met."
- Why it is an owner decision: under the OD-12-02 interim a SuperAdmin can launch a physical offering after acknowledging the unresolved return policy; operators can then receive customer passports, but no return can be recorded, so the applications can never complete and the system state becomes untrue if staff return passports outside the system.
- Safe interim (implemented): OD-12-02 interim (launch only with an item-by-item acknowledgement; return `unavailable_parked` / `parked_custody_route_policy`; the original return policy is owner-gated, contract §9.2). Safer interim ready on request: for non-synthetic offerings refuse launch (record 12 L2) while `originals.custody.held = true` and `originals.returnPolicy` is unresolved, or make receipt (record 13 CMD-OR1) unavailable for such offerings. Synthetic offering `SYN/syn_paper_return` keeps the B41 partial-return proof.
- Work that continues: all electronic routes; custody mechanics with synthetic declarations.

**OD-R2-06 — May a declared dependency link applications in different groups or countries?** (business semantics; COV-08)
- Spec text: B03 "A group belongs to one TA and one country. … Links and common context do not propagate corrections/outcomes". B22 "Only declared service relationships condition another application's action/outcome".
- Why it is an owner decision: a cross-country relationship (for example a transit visa that depends on a destination visa) is plausible business, but B03 forbids propagation through links and B22 allows only declared relationships; whether such a relationship may be declared across groups is business semantics.
- Safe interim (implemented in revision 2): upstream and dependent MUST be in the same group (contract §3.5, §9.2; record 13 CMD-D5, I-C10). External-evidence upstreams are not declarable (B44).
- Work that continues: all same-group dependencies.

**OD-R2-07 — Is offering withdrawal permanent?** (business semantics; BND-16, P2 origin)
- Spec text: B07 "An effective withdrawal stops new selection, intake and submission." The spec defines no relaunch and no permanence.
- Why it is an owner decision: with withdrawal terminal and offering identity unique (country, service code, mode), a withdrawn route can never be offered again under its identity; a new service code would split duplicate scope (B03).
- Safe interim (implemented): withdrawal is terminal (record 12 RI-12-06). Recommended presentation: the admin page states that withdrawal is irreversible in this build and the command requires an explicit acknowledgement field.
- Work that continues: all.

**OD-R2-08 — Separation of duties when one SuperAdmin creates and uses an operator account** (security, owner awareness; SEC-10, P2 origin)
- Spec text: B08 "Every account represents one person"; B11 "Creating/elevating a SuperAdmin normally requires a second distinct existing SuperAdmin"; B18 "A SuperAdmin cannot make that judgment or file."
- Why it is raised: one SuperAdmin can create, approve and activate an operator on a mailbox the SuperAdmin controls, assign cases to it and then act as that operator. The spec permits single-SuperAdmin staff creation, so this is not a violation; it is an awareness item for the owner.
- Safe interim (implemented): record 11 I-I2 (single SuperAdmin may create, approve and activate TA and operator accounts). Cheap monitors on request: a SuperAdmin monitor row "staff account created, approved, activated and assigned by the same SuperAdmin", or a second SuperAdmin for staff activation.
- Work that continues: all.

### A.2 Decisions carried forward from the design records (unchanged; still open)

| ID (record) | Decision | Spec text (exact) | Safe interim implemented | Work that continues |
|---|---|---|---|---|
| OD-01 (01) | Meaning of `payment_received` before price fixation (assistance on drafts) | B26 "Before assignment/operator work, including approved assistance, require current `payment_received` or a fresh application-specific Gate 1 exception." B29 "… assistance charging … remain unselected." | `payment_received` is the SuperAdmin's attestation with evidence; no amount computed for drafts; otherwise a Gate 1 exception with a financial exception | all |
| OD-02 (01) | Does an attributed manual operator email satisfy the email part of completion? | B24 "A manual operator email requires attributed record and is not claimed system-verified." B46 "uncertain-email handling/ownership are deliberately unresolved until the product owner's UAT decision" | only system-recorded `accepted`/`synthetic_accepted` sends count; fold into the B46 UAT decision | all delivery evidence |
| OD-03 (01) | Dimension of launch "scope" | B07 "approves and records offering launch/scope expansion … Lifting restores only previously approved scope." | scope = offering × TA audience | all |
| OD-04 (01) | Staff TOTP enrolments across a restore | B40 "new secrets and unusable old sessions/OTP/job credentials"; B44 all-admin-loss recovery PARKED | TOTP seeds re-wrapped from the custodied old wrap key; sessions, OTPs, enrolment and lease tokens unusable | all; see Part C REC-19 for key custody |
| OD-I1 (11) | Suspension of the last active SuperAdmin | B11 "emergency suspension may be unilateral"; "No initial-admin or total-admin-loss bypass is inferred." | allowed with explicit acknowledgement; `parked_first_admin` shown | all |
| OD-I2 (11) | Restoration of a suspended SuperAdmin | B11 "Creating/elevating a SuperAdmin normally requires a second distinct existing SuperAdmin" | two distinct active SuperAdmins (`restore_superadmin`) | all |
| OD-12-01 (12) | Does a routine baseline price increase reach submitted unpaid applications? | B17 "Formal TA submission fixes that application's one-time quoted price … increase requires renewed TA authority, and a declined mistaken-price increase honors the communicated price." | only a `mistaken_price` publication proposes an increase; reductions apply automatically to unpaid applications | all |
| OD-12-02 (12) | May an offering launch while an action-scoped item is unresolved by a deliberate boundary? | B02 "A country/service can be offered only after … launch requirements are met." B44 parks preparation-only cut-off; B30 parks return policy | launch only with item-by-item acknowledgement; affected actions visibly unavailable; see OD-R2-05 for the physical-original consequence | all |
| OD-12-03 (12) | Public legal and contact content | B01 "static TravelMudra details"; B13 "Applicant, regulator and legal notice requirements need separately authorized compliance work; do not invent or send them." | no privacy/terms/contact pages; SEO check reports release blockers | public site |
| OD-C1 (13) | What is "clear same-person evidence" for identity corrections? | B19 "Draft TA correction of legal name, date of birth, nationality, passport number or issuing country needs clear same-person evidence." | record 13 CMD-D3 step 5 rule; attestation never suffices | all other corrections |
| OD-C2 (13) | May owner receipt of a returned original be recorded while the recipient-evidence policy is PARKED? | B24 "A physical original holds completion until operator/SuperAdmin records owner receipt." B30 "affected steps remain unavailable until bounded/settled." | return only under an owner-approved `originals.returnPolicy` (revision 2: owner-gated key); none exists for real routes | receipt, movements, electronic routes |
| OD-C3 (13) | Outcome of a declined price increase caused by a material scope change | B17 "a declined mistaken-price increase honors the communicated price … Changed service/material scope needs fresh intake or renewed authority as applicable." | authorization and packet release blocked `renewed_authority_declined` | all other price paths |
| OD-C4 (13) | Is a repeat government submission or fee payment in one application ever permitted? | B19 "externally permitted remedy or owned incident is separate." B23 "No blind repeat payment/filing." | repeat act `parked_repeat_external_act`; owned incident | all first-attempt work |
| OD-I1 (14) | Retention of intake source files, unassociated versions and row data | B15 "Unrelated files are excluded with minimal reason and safe temporary disposal." B42 EXCLUDES "automatic application/artifact deletion or six-month expiry". | retained, never released, listed as retained | all |
| OD-I2 (14) | Which public folder providers count as "a public folder" | B14 "a public folder with/without consolidated Sheet/Excel" | Google Drive public folders only; others `folder_provider_unsupported` | all |
| OD-15-01 (15) | What closes a `Payment_Missing_Override` follow-up | B29 "until collection or authorized write-off" | merged into OD-R2-03 | all |
| OD-15-02 (15) | Is the `result_available` web notice part of the B46 delivery-send event? | B24 "document-carrying email to the owning TA plus web notification evidence hold completion"; B46 "Do not supply provisional triggers" | harness-only posting; fold into the B46 UAT decision | all |
| OD-15-03 (15) | OS-level runtime identity separation | B37 "keep data, secrets and runtime identities separate from other applications" | separate cluster, roles, sockets, directories, secrets and ports under the current uid; OS-level separation not achieved | all |

The B46 items (delivery-send trigger, completion-check trigger and owner, uncertain-email handling) are already reserved to the product owner's UAT decision by the spec; the design shows them as `unresolved_known_limitation` and provides harness-only commands.

## Part B — Material engineering choices (input for `ENGINEERING_OVERRIDES.md`)

None of these changes a business rule. Each replaces a prior technical choice of brief revision 2 or contract revision 1.

### Proposed EO-10 — Worker resource limits: `prlimit --as/--nproc` → user cgroup scope (BND-01)
- Prior choice: brief §2 and §2.1, contract §10.3 (rev 1): `prlimit --as=768MiB --nproc=16` (parse) and `--as=256MiB --nproc=8` (fetch) around `bwrap`; toolchain resolved at `${toolchain.dir}/bin`; host `LD_LIBRARY_PATH`/`TESSDATA_PREFIX` passed into the sandbox.
- Replacement: `systemd-run --user --scope -p MemoryMax -p MemorySwapMax=0 -p TasksMax -p CPUQuota` around `prlimit --cpu --fsize --nofile -- bwrap …`; no address-space or process limit on the Node worker; `prlimit --as` (512 MiB) only on spawned native tools; explicit sandbox environment (`LD_LIBRARY_PATH=/opt/tm-toolchain/root/usr/lib/x86_64-linux-gnu`, `TESSDATA_PREFIX=…/root/usr/share/tesseract-ocr/5/tessdata`, `VIPS_CONCURRENCY=1`); `resolveTool` searches `root/usr/lib/postgresql/16/bin`, `root/usr/bin`, `root/usr/sbin`; start-up self-test with the real launch line; no silent fallback.
- Reason: verified on this host (2026-10-04): `prlimit --as=768MiB node` aborts at start (V8 code-range reservation); `prlimit --nproc` counts every thread of the uid, so `bwrap` fails with EAGAIN; the toolchain lives under `root/usr/…`; `tesseract` cannot find its libraries without the prefix path. The rev 1 line stopped every document from becoming content-safe.
- Impact: memory and task bounds are enforced by the kernel cgroup; native tools keep per-process address limits; worker health is `down` when the user systemd manager is unavailable.
- Downstream consequence: the production host needs a user systemd manager with lingering (present here) or an equivalent delegated cgroup; this is a host/owner item at production setup. Contract §10.3, record 14 §5.2, tests T-F29/T-W09.

### Proposed EO-11 — Restore: plain `pg_restore` → `pg_restore` + transaction-id epoch advance + projection rebuild (REC-03)
- Prior choice: record 15 §3.5.2 (rev 1): `pg_restore` into a new cluster, then reopen.
- Replacement: after `pg_restore`, stop the cluster and run `pg_resetwal -e <epoch>` so every new `xid8` exceeds the largest restored `sys_facts.tx_id`; restart; rebuild every projection before reopening. Snapshot rollback also rebuilds projections.
- Reason: projection tailing uses the `xid8` watermark (contract C-04); a fresh cluster restarts its counter, so restored facts are hidden and new facts fall below the restored cursor.
- Impact: restore needs the PostgreSQL server binaries of the prefix and a stopped cluster for one step; restore takes longer by one rebuild.
- Downstream consequence: restore procedures stay PostgreSQL-specific (as EO-01 says); test T-F41/T-15-78 MUST run on the installed PostgreSQL 16.15.

### Proposed EO-12 — Backup and checkpoint capture: file-then-encrypt → drain + exported snapshot + streaming encryption (REC-01, REC-02, SEC-05)
- Prior choice: record 15 §3.4.2 step 3 and §3.5.1 (rev 1): plaintext `pg_dump` to file, blob copies to files, `age` per file afterwards; inventory read from the live database after the dump; blobs only in areas `canonical`/`quarantine`; no checkpoint retention.
- Replacement: drain before capture; one exported snapshot shared by `pg_dump --snapshot` and the blob inventory; inventory by owner reference in any area (including staged blobs with a pending move); every artifact streamed through `age` (no plaintext at rest); checkpoints encrypted and disposed by `tm cutover cleanup` after a later complete backup; size estimate before capture.
- Reason: B40 requires a consistent export plus every referenced blob, and encrypted recovery sets.
- Impact: longer backup window (drain); `age` in every pipe; free-space check uses an estimate.
- Downstream consequence: restore and rollback always need the custody identity (see Part C REC-19).

### Proposed EO-13 — Catalogue release registration: after opening → inside the closed cutover verify step (COV-13 item 9)
- Prior choice: record 12 E1 (rev 1): `tm cutover open` runs `cat.register_release_catalogue` as the first command after admission opens; contract §4.2 refused every command while closed.
- Replacement: `CommandDef.maintenanceAllowed` for the engineering actor; `assertMaintenanceWriter` accepts admission `closed` with `closure_kind ∈ {initial, cutover}`; E1/E2 run during cutover step 6.
- Reason: B39 "verifies … binding … compatibility while closed, then deliberately opens"; removes the window in which a new release serves cases without its catalogue registration and impact assessments.
- Impact: one narrowly scoped exception to "no command while closed".
- Downstream consequence: cutover verify fails closed if registration fails; opening stays a separate deliberate step.

### Proposed EO-14 — Identity mail and codes: shared `mail.deliver`, 32-byte OTP token, enrolment token in URL → `iam.send_mail`, 8-digit OTP, enrolment code in a form (record 11 CCR-01, CCR-02, CCR-04)
- Prior choice: contract rev 1 §1.1, §2.21, §12.1.
- Replacement: Identity-owned task `iam.send_mail` (code encrypted on the `iam_` row until sent, then wiped); OTP = 8 decimal digits with bounded attempts; enrolment code typed into `POST /staff/enrol`.
- Reason: sole writers (only Identity writes `iam_` rows; no secret in task payloads); a typed code is usable by a person (B08 bounded attempts); no bearer token in a URL (contract §5.5).
- Impact: one more task kind; per-challenge guess probability 5 × 10⁻⁸.
- Downstream consequence: none outside Identity.

### Proposed EO-15 — Harness actor kind (record 13 CCR-07; 11 CCR-13; 15 CCR-15-14)
- Prior choice: contract rev 1 §2.24 / §7.11: harness commands and the synthetic seed run as the `engineering` actor with a `harness:` label, although the engineering actor may not write business facts.
- Replacement: actor kind `harness`, registered only in `test`/`local_test`, refused in production configuration; facts carry `actor_kind = 'harness'` and `command_name` prefixed `harness.`.
- Reason: one auditable model; keeps "engineering never writes business facts" true.
- Impact: one more value in a closed set and a CHECK.
- Downstream consequence: production databases contain no `harness` facts (startup refuses synthetic data in production).

### Proposed EO-16 — Kernel attribution sink for country defects (REC-07)
- Prior choice: record 14 §3.4.6 (rev 1): the validity evaluator wrote the `country_defect` incident inline.
- Replacement: evaluation records an in-memory attribution; the kernel flushes it after the transaction (commit or rollback, read or write) by enqueuing `ops.attribute_country_defect`.
- Reason: B36 attribution must survive refused commands; read transactions MUST NOT write.
- Impact: one task kind and one flush step in the runner.
- Downstream consequence: none outside the kernel and Operations.

### Proposed EO-17 — Task protocol hardening: lease-expiry bound, `defer`, blob owner hooks (REC-04, REC-17, record 14 CCR-03/CCR-04)
- Prior choice: contract rev 1 §4.6: Recover set `failed_retryable` with no attempt check; no `defer` result; no owner hook for a terminal blob move.
- Replacement: attempt bound at Lease and Recover with backoff and `lease_expired_exhausted`; `defer` without attempt use only while the awaited event can still happen; `onMoved`/`onIntegrityFailed`/`onMoveFailedTerminal` hooks.
- Reason: B35 bounded retry and failure visibility; B12 missing bytes keep an owner.
- Impact: poison tasks stop after `max_attempts`.
- Downstream consequence: a crash-looping task becomes visible to its failure owner instead of looping.

### Proposed EO-18 — Durable dedupe keys never derive from rotating secrets (REC-20, SEC-09)
- Prior choice: record 13 §2.2 (rev 1): `ops_originals.item_key = passport:<applicant key HMAC>` with an unnamed key.
- Replacement: the plain applicant key in the owner table; rule in contract §1.1 for every durable uniqueness key.
- Reason: B40 restores install new secrets; a secret-derived key breaks the B30 once-only guard.
- Impact: one PD column in an owner table (never in diagnostics).
- Downstream consequence: none.

Not an override (recorded for completeness): record 11 CCR-14 proposed to replace `otpauth` with a hand-written TOTP; it was rejected, so brief §1.1 and EO-02 stand (contract C-10).

## Part C — Recorded P1 items for the owner (not worked in this consolidation)

Each item needs the owner's choice: park it, or have it worked. Likelihood and scenario are from the review ledger.

| ID | Issue | Likelihood | Concrete scenario (short) | Recommended handling |
|---|---|---|---|---|
| COV-14 / BND-11 (rest) | Route path names differ between records 11–15 (for example `/return` vs `/formal-return`, `/payments` vs `/payments/entries`) | high | the generated access matrix (T-I39) fails on renamed routes or duplicate handlers register | work in milestone 2: record 11 §4.4 stays the path authority (contract §12.1 rule); align module routes before lane work |
| COV-15 | No reconstruction input for facts re-entered after an interval-loss restore | low | a re-entered `payment_received` is stored as contemporaneous | work later: optional `reconstruction { note, evidence }` on SuperAdmin re-entry commands, allowed only after a reopened interval-loss restore |
| MON-10 | Same person with a mistyped or renewed passport number gets a second open application | medium | two filings and two TM-funded fees for one person | owner choice of the matching rule (name + date of birth candidate check opening an owned incident; never a merge, B15) |
| MON-11 | Final price depends on commit order of a baseline reduction and a TA's increase decision | low | 110 vs 120 depending on order | work later: stale an open increase when a newer baseline price exists |
| SEC-04 | Staff OTP contact limiter can be exhausted by an attacker, locking out SuperAdmins | medium | 20 rotating addresses keep the real SuperAdmin `rate_limited` | work before remote testers: attacker-bound limiter key plus a larger per-contact ceiling, or ALTCHA on the staff page |
| REC-08 | Every closure aborts in-flight effects, creating avoidable `uncertain` emails | medium | daily backup closes during a send | work later: two-phase closure with bounded effect drain |
| REC-09 | `closeAdmission` can wait without bound under sustained share locks | medium | emergency close delayed under load | confirm with a PostgreSQL probe; then a separate admission-gate row or advisory lock |
| REC-10 | Clock guard compares two readings of the same host clock | low | forward jump ends applications with the group early | work later: monotonic floor from heartbeats and facts; NTP sync status as health input |
| REC-11 | Kernel heartbeats, leases and LISTEN share the 12-client pool | medium | pool saturation expires leases while workers run | work in milestone 1: small separate kernel pool; kill the child on `lease_lost` |
| REC-12 | Large SERIALIZABLE batches promote predicate locks | medium | impact recheck aborts repeatedly in business hours | probe on PostgreSQL 16.15; smaller batches; raise lock settings (53200 is already mapped) |
| REC-14 | Scanner or worker outage consumes per-item attempts | medium | clamd OOM-killed at night; hundreds of versions need manual requeue | work later: defer while facility health is `down`; supervised clamd; bulk requeue |
| REC-15 | No process supervision for `tm-server` and clamd | high | installation stays down after a backup closure | host/owner item: `systemd --user` units with restart limits (lingering is enabled here) |
| REC-16 | A poison fact halts a projector permanently | medium | a release forgets a history mapping; audit projection blocks privileged elevation | work later: per-fact gap recording, `degraded` state |
| REC-18 (rest) | Backups and checkpoints on the data filesystem; first set has no size history | medium | first backup fills the disk; PostgreSQL stops | free-space reserve protecting `storage.minFreeBytes`; retention count; separate filesystem when available (encryption part fixed) |
| REC-19 | Restore depends on the age identity and the old TOTP wrap key held only on the same host | low | disk loss destroys both; restore impossible, all staff MFA lost | owner production choice: off-host key custody set with fingerprint in the backup prerequisites; a restore drill from custody only |

Owner decisions that originate from P1 findings are in Part A: COV-04, MON-08, BND-07 (OD-R2-02); COV-05, BND-06 (OD-R2-03); COV-08 (OD-R2-06); MON-07 (OD-R2-01); SEC-03 (OD-R2-04); BND-12 (OD-R2-05).

P2 findings parked as notes (not worked; revisit when evidence or scale changes): COV-16, COV-17, COV-18, MON-12, MON-13, SEC-07, SEC-08, SEC-10 (also OD-R2-08), SEC-11, SEC-12, SEC-13 (operator metadata predicate), SEC-14, REC-21, REC-23, REC-24, REC-25, REC-26, REC-27, BND-16 (also OD-R2-07), BND-17, BND-19.
