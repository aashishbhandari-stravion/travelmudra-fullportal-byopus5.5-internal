---
name: uat-pass1-real-data
description: "UAT pass 1 (from 2026-10-12) puts Max's real passports into the preview installation; handling rules and automation decisions"
metadata:
  node_type: memory
  type: project
  originSessionId: 68241629-fdef-4862-899d-18966f67cd6f
  modified: 2026-10-12T06:30:42.301Z
---

UAT pass 1 started 2026-10-12. The plan is at internal/records/uat/2026-10-12-uat-pass1-test-plan.md and the findings file at internal/records/uat/2026-10-12-max-uat-findings.md. Max runs it on `preview`. Bulk intake (E2E-4) uses Max's real passports: 88 documents from 11 people in Google Drive, plus an Excel file that links to them. The three TA accounts act as three agencies: ta-1 for single applications and groups, ta-2 for Excel and Google Sheet imports, ta-3 for blank state and then the Drive folder imports.

**Why:** Max decided to test with real documents rather than synthetic samples.

**How to apply:**
- `preview` held personal data until Max had it cleaned up on 2026-10-12 (`uat.py cleanup preview`; root, units, ports and config removed). UAT pass 1 ended there; findings UAT-01..13 deferred to after the UI rewrite. A new preview needs `uat.py up` and new synthetic accounts.
- Agents MUST NOT open, read or copy the real documents or their extracted values.
- Findings refer only to "User 01" to "User 11".
- Removing the real data after UAT is Max's call (`cleanup preview` needs his explicit instruction).
- Automation decisions (plan Part E.8, final on 2026-10-12):
  - The suite is written only after the UI rewrite lands. The five Part D sequences are its reference specification until then.
  - The `e2e` installation (ports 4630 to 4633) is created when the build starts and removed when the campaign ends.
  - The suite lives in `test/e2e/` in the public repository; the code holds only synthetic fixtures.
  - The `@external` Google sources hold Max's real documents, shared by link only. Max deletes them by hand later.
  - Those links MUST NOT appear in the repository, commits, findings or chat; the suite reads them from a local untracked file. Their evidence (traces, video) stays off-repository.
  - Max watches runs through Chrome and an SSH tunnel (HTML report by default, UI mode for debugging).
- Screenshot rule (Max, 2026-10-12): this machine is Max-only, so security is relaxed here. Keep every UAT screenshot uncropped in `~/.local/share/travelmudra-uat/evidence/2026-10-12-uat-pass1/screenshots/` (outside all repos, never committed) and cite it by file name in findings. Beta and production keep the strict rules. Personal values (names, passport numbers) still stay out of findings text and commits.
- Related: [[ui-plan-from-specs]], [[uat-deploy-script]], [[data-privacy]].
