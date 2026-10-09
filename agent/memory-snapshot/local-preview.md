---
name: local-preview
description: "TravelMudra local preview at ~/.local/share/travelmudra-preview (systemd user units, loopback 4610/4612, synthetic accounts); sign-in helper prints codes — never run it here without --check/--list"
metadata:
  node_type: memory
  type: reference
  originSessionId: 2f6f1696-2924-4446-bd46-91bb768d9648
  modified: 2026-10-08T01:45:55.900Z
---

Set up 2026-10-08 from tag m6-final-assurance (7be21b1) with the product's own install procedure.
- Root: `~/.local/share/travelmudra-preview/` — `releases/m6-final-assurance/` (clean clone + npm ci; never edit: a changed dir is refused at start), `instances/` (TM_INSTANCES_DIR), `ca/`, `samples/` (synthetic passport JPEGs/PDFs), `README.md` (Max's guide), `signin-codes.mjs`.
- Units tm-postgres, tm-core, tm-clamd, tm-edge, tm-staff: linked with `systemctl --user link`, NOT enabled (no start at boot).
- Edge (public + TA) http://127.0.0.1:4610; staff http://127.0.0.1:4612. Accounts syn-ta-1..3, syn-operator-1..3, syn-superadmin-1..2 @synthetic.test.
- `signin-codes.mjs <email>` prints the newest synthetic mail and the staff TOTP code: for Max's own terminal only. In an agent session use only `--list` or `--check <email>` (public-stream rule, [[data-privacy]]).
- Registered with scripts/uat/uat.py as `preview` (config ~/.local/share/travelmudra-uat/configs/preview.json); deploy new code with `uat.py deploy <config> --ref <tag>` ([[uat-deploy-script]]).
- WIP archive: `~/.local/share/travelmudra-archive/m6-stability-wip-21b2233.bundle` (superseded work; sha256 in the M6 verification record).
