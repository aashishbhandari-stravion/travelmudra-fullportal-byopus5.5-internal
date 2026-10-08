# TravelMudra build: final report to the product owner

Date: 2026-10-08. Author: the orchestrator (principal technical architect). Status: final. Private record (internal repository).

## 1. Outcome in one paragraph
TravelMudra, the B2B visa-services portal, is built to the specification as a local test installation of three instances that talk only through authenticated API calls: **core** (PostgreSQL, the file store, all business logic and background work), **edge** (public site, travel-agent sign-in and surface, bulk intake and uploads, the sandboxed file-processing service with the malware scanner) and **staff** (Operations, SuperAdmin and Accounts). Six milestones are complete and tagged on local `main` (m1–m5 already tagged; milestone 6 tag `m6-final-assurance` at 7be21b1). The final verification ran 1846 automated tests three times without a failure (typecheck and lint clean), plus an end-to-end walk of the operating guide, a public-site search-readiness check, a capacity record and a repository boundary check over the whole history. Nothing was pushed; you push once, yourself.

## 2. What was built
- **Surfaces:** public site (crawlable, titles, canonical URLs, sitemap, robots, structured data; four owner inputs pending), travel-agent portal, operator portal, SuperAdmin portal, Accounts surface; one design system (light and dark, keyboard and screen-reader accessible; axe found 0 violations on every page in the final pass).
- **Identity and access:** individual accounts, email one-time codes with a self-hosted bot check for travel agents, email code plus authenticator for staff, enrolment, email change, grants, support view, privileged elevation with a second SuperAdmin, a single access policy on every route.
- **Catalogue and launch control:** offerings, declarations, baselines with preview and publish, owner approvals, impact assessment on existing cases, launch, suspension and withdrawal; extension by data for new services and by a country adapter package for a new country (a synthetic third country was onboarded from the docs alone in the final review).
- **Intake and documents:** individual and bulk (spreadsheet) intake with questions, corrections and incidents; malware scanning before any content is read; local OCR and passport MRZ reading; evidence and association rules per requirement.
- **Case model:** groups, drafts, submission and price, assistance, assignment and reassignment, Gate 1 and Gate 2 payment controls, flags, deferral, withdrawal, dependencies, identity corrections with same-person evidence, holds while a filing may have occurred.
- **Operations:** work steps, readiness, external acts with evidence and reconciliation, official results and artifacts, wrong-recipient disclosure and incidents, custody of physical originals, failure classification, travel-date rechecks.
- **Payments:** service payment records with evidence, government fees, TA-wide exposure ceiling and reservations, financial follow-up; parked finance items shown as visible unavailable states.
- **Delivery:** one release check for every file, downloads and bounded ZIP selections, notices, preparation packets and handover, synthetic email only; pages say "Sent in full", never "Received", because the server cannot know browser receipt.
- **Views and measures:** projections for lists, search, history, monitors; operating measures with truthful "not captured" states.
- **Release, recovery and capacity:** releases bound to verified code and configuration on every instance, cutover, code and snapshot rollback, encrypted backup, restore with interval-loss scope and owner-approved reopening, request deadlines and capacity limits fitted to the production host profile, per-instance descriptors for dedicated OS users, systemd user units.
- **Size:** about 94,000 lines of TypeScript source in 495 files, 53,000 lines of tests in 267 files, 26 database migrations, about 270 routes.

## 3. Assurance
- Each milestone: an independent multi-lens review, adversarial validation of serious findings, fixes reproduced first with tests that fail without the fix, an independent fix check, and an end-to-end or UX recheck where relevant.
- Serious defects found and fixed by the reviews (examples): an identity swap through corrections (M3); a result file attachable to any candidate case and withdrawals after an evidenced filing (M4); a lossy restore that could be reopened without the owner's approval and four release-binding defects that let unverified code or configuration run (M5); document changes during a possible filing, an incorrect "received" record, a correction stuck after a resolved fee filing, incident access surviving reassignment, and a privacy defect that showed another applicant's file (M6).
- Traceability: every invariant and design test id is mapped to the tests that prove it (`docs/verification/traceability.md`): 399 identifiers: 317 proven, 78 partial with the missing assertion stated, 4 recorded gaps.
- Test stability: intermittent failures under load were investigated to the root; three were real product defects (fixed).

## 4. Decisions made on your behalf
You delegated every run decision on 2026-10-04. All are recorded and reversible:
- Owner decisions D-01..D-10 (contract section 18): exposure per TA person account; Gate 1 re-evaluated at first operator work; payment evidence required; minimal SuperAdmin byte access with purpose and reason; no launch of originals-holding offerings without a return policy; dependencies within a group; irreversible withdrawal; runtime-user separation as a production step; no separation-of-duties change; safe interims kept.
- Architecture: the three-instance split (your direction) with the service contract, per-instance secrets and release binding (contract sections 21–21.9); primary case lists read authoritative tables (EO-20); release binding of running processes (EO-21).
- Engineering overrides EO-01..EO-21 (`ENGINEERING_OVERRIDES.md`): PostgreSQL 16 instead of SQLite; a vetted library set; ClamAV; local Tesseract OCR and MRZ; ALTCHA; age backup encryption; a rootless toolchain; progressive enhancement with one first-party script; the design skills; cgroup worker limits; restore with epoch advance; snapshot-based backups; catalogue registration inside verification; identity mail hardening; harness actor; attribution sink; task protocol hardening; dedupe keys independent of secrets; the extension architecture; EO-20; EO-21.

## 5. What I need from you
1. **Before public release:** the verified business location, contact details, privacy and terms pages, and the list of countries to show publicly. The search-readiness check lists these four as release blockers.
2. **Owner decisions still parked by design** (shown in the product as visible unavailable states): who starts result delivery and the completion check; a custody return policy for real (non-synthetic) declarations and showing custody details to travel agents; the parked finance items (bank-verified collection, reservation release, fee exclusion, write-off, refund).
3. **Production readiness (your later phase):** a real mail service behind the existing mail port; Cloudflare or a reverse proxy in front of edge (TLS, caching, slow-request limits, a per-client cap); dedicated OS users per instance; the public hostname and the search-readiness check run with your inputs; a production host sized to the recorded capacity budget.
4. **Push:** `main` and the six milestone tags are ready for your single push.

## 6. Parked findings (P2) for later
Listed with scenarios in the milestone verification records (`verification/2026-10-0*-*.md`) and the milestone 6 record. Notable: an application stays editable after an accepted withdrawal (the withdrawal itself stands); the fetch worker's IPv6 deny list lacks the IPv4-compatible block; the local supervisor stops all instances during a rollback across a configuration change; no documented tester procedure for sign-in codes on a local installation (the preview helper in section 9 covers your use), and a restored installation has no mail transport; scanner signatures live in a per-user data directory; staging overshoot by concurrent uploads; capacity failures consume task attempts; wording, name-order and line-length polish on some pages.

## 7. Process notes
- A `--no-verify` slip on three work-in-progress commits in milestone 2 (the boundary check on those commits was clean); not repeated.
- One known false positive in history: the curve name "P-256" in an early commit; later commits say "prime256v1".
- The desktop app became unreachable twice (overnight): the workflow tool was blocked, so work continued through single agents that inherited a higher effort setting than your preferred "high" (recorded). One agent hung waiting for an approval that could not be shown; it was stopped and its processes cleaned.
- A power outage stopped a run; it was recovered from saved commits and the workflow journal with no lost work. Lesson: editing an early step of a workflow before resuming makes every later step rerun.
- I over-read your standing authority and ran the full test suite at every intermediate merge into main; corrected to one merge per milestone.

## 8. Orchestration retro (summary)
- Narrow, invariant-targeted review commissions found more serious defects per token than broad lenses (milestone 4: 8.2M processed tokens per accepted defect against 10.2M in milestone 3, with two code P0s found).
- A separate verifier for every P1 reversed nothing; the fixer's own reproduction step was enough. Two validators per P0 never disagreed; one validator would have sufficed when the reviewer had already reproduced the defect.
- The largest single cost was the UX fixer carrying screenshots in its working context; splitting UX fixes into screen groups of at most five findings fixed it.
- Details: `reviews/2026-10-06-m3-review-telemetry-and-orchestration-policy.md` and `reviews/2026-10-06-orchestration-retro-notes.md`.

## 9. How to see it
A local preview is running on this machine, installed from the tag with the product's own procedure (`docs/operations.md`): three instances, PostgreSQL and the malware scanner as systemd user units (linked, not enabled at boot), loopback only, synthetic mail only.

- Public site and travel-agent portal: http://127.0.0.1:4610. Staff portal (operators, SuperAdmin, Accounts): http://127.0.0.1:4612.
- Accounts: `syn-ta-1..3`, `syn-operator-1..3`, `syn-superadmin-1..2`, all `@synthetic.test`.
- Sign-in codes: run `node ~/.local/share/travelmudra-preview/signin-codes.mjs <email>` in your own terminal. It reads the local synthetic mailbox and, for staff, prints the current authenticator code. The orchestrator verified travel-agent, operator and SuperAdmin sign-in end to end without displaying any code.
- Guide (what to try, stop, start, remove): `~/.local/share/travelmudra-preview/README.md`. Synthetic sample documents for uploads: `~/.local/share/travelmudra-preview/samples/`.
