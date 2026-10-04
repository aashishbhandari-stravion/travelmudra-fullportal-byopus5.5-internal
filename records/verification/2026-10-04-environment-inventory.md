# Local environment and listener inventory (2026-10-04)

Recorded before any port or socket assignment.

## Toolchain
- Node v24.19.0 (nvm), npm 11.17.0. Type stripping runs `.ts` directly. `node:sqlite` (SQLite 3.53.3) with `setAuthorizer`, `backup()`, `VACUUM INTO`, `enableDefensive`.
- Python 3.12.3 without pip. No PostgreSQL, Docker, sqlite3 CLI, ClamAV or Tesseract.
- System binaries: `bwrap` (network namespace isolation works: parser fetch gets ENETUNREACH), `prlimit`, `systemd-run --user --scope`, `pdftotext` 24.02.0 (poppler), OpenSSL 3.0.13.
- Unprivileged `unshare -rn` is denied (AppArmor restricts unprivileged user namespaces); `bwrap` is permitted.
- Node v24 permission model does NOT restrict network; it restricts fs, child process and workers.
- npm registry reachable (typescript 5.9.3 / 7.0.2, @types/node available).
- Host: 56 CPUs, 62 GiB RAM, 833 GB free disk.

## Listeners in use (ss -ltnp)
| Address | Port | Note |
|---|---|---|
| 0.0.0.0 / [::] | 22 | ssh |
| 127.0.0.53, 127.0.0.54 | 53 | resolver |
| 127.0.0.1, [::1] | 631 | cups |
| 127.0.0.1, 100.95.27.21, tailnet v6 | 4318 | other application (ReviewWithAI) |
| 100.95.27.21, tailnet v6 | 4187 | other application |
| 100.95.27.21 | 8787 | other application (md-review-server) |
| 100.95.27.21 | 40942 | tailnet |
| tailnet v6 | 43601 | tailnet |

## Assignment
- TravelMudra local test server default: 127.0.0.1:4610 (free). Tests use ephemeral ports on 127.0.0.1.
- No bind to the tailnet address by default; any remote-tester exposure is an explicit configuration with HTTPS only. No public tunnel.

## Revision 2 (same day): installed toolchain and verification
- Passwordless sudo: not active (`sudo -n true` requires a password; `/etc/sudoers.d/` holds only README). No host configuration changed.
- User-space toolchain via `scripts/toolchain/install-user-toolchain.sh` (prefix `$HOME/.local/opt/travelmudra-toolchain`, 16 packages, SHA-256 manifest): PostgreSQL 16.15, ClamAV 1.5.4, Tesseract 5.3.4 (+eng, osd), qpdf 11.9.0, age 1.1.1. All binaries resolve their shared libraries.
- PostgreSQL probe: socket-only cluster (no TCP listener), SCRAM auth, ≈64 MB RSS idle; `tm_app`-style role denied UPDATE/DELETE on an INSERT-only table and denied DDL.
- ClamAV probe: signatures main 63 / daily 28143 / bytecode 339 (108 MB) in `$HOME/.local/share/travelmudra-dev/clamav/db`; dev clamd on a 0600 Unix socket; EICAR → `Eicar-Test-Signature FOUND`; clean → OK; start 11 s; RSS 1004 MB.
- OCR probe: sharp (libvips 8.18.7) rendered a synthetic MRZ; Tesseract read both lines with one O/0 confusion; `mrz` autocorrect fixed it (specimen country code UTO is rejected by the library, so fixtures use IND-format synthetic data).
- Playwright 1.63 Chromium 153 launches without extra system libraries.
- npm: 148 runtime packages (incl. transitive), `npm audit --omit=dev` 0 vulnerabilities; SheetJS 0.20.3 from cdn.sheetjs.com (tarball SHA-256 8dc73fc3b00203e72d176e85b50938627c7b086e607c682e8d3c22c02bb99fe8).
- A development clamd process is left running for test use (user process; stops at reboot).
