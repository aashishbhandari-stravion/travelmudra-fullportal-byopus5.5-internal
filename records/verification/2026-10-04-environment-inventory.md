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
