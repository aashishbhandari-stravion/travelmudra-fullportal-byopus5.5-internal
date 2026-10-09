---
name: production-readiness
description: Max (2026-10-07): production readiness is a later phase he will lead (Cloudflare, real email server); he supplies owner inputs and resets the weekly limit at 97%
metadata:
  type: project
---

Max, 2026-10-07:
- He resets the weekly usage limit himself when it reaches 97%. Do not stop or warn repeatedly before that.
- He will supply the release owner inputs later: verified business locality, contact, privacy and terms pages, public country list.
- Production readiness is a separate later phase that he will drive. It includes Cloudflare in front of the public site and a real email server integration. The current build keeps the synthetic mail transport and local test installation only.

**Why:** the build stays a local test installation; production deployment is out of scope for this run.

**How to apply:** in the final report, list production-readiness items as a hand-off. Examples: a real mail transport behind the existing mail port; Cloudflare or a reverse proxy in front of edge, which also bounds slow requests; per-instance OS users; the public hostname and search readiness once the inputs exist. Do not build them now. Related: [[data-privacy]], [[orchestration-direction]].
