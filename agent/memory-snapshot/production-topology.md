---
name: production-topology
description: "Max's production topology requirement for TravelMudra (2026-10-05): TA + bulk upload separate from Ops/SuperAdmin app and central DB; chosen 3-server design"
metadata:
  node_type: memory
  type: project
  originSessionId: 2f6f1696-2924-4446-bd46-91bb768d9648
  modified: 2026-10-05T14:43:04.674Z
---

Max required (2026-10-05) that, at minimum, the TA surface and bulk upload run separately from the Ops + SuperAdmin web app and from a central database, and asked for the optimal design. Chosen: three servers — A edge/intake (public site, TA, sign-in, intake, sandboxed file workers + clamd; internet-facing), B staff (Ops/SuperAdmin/Accounts + case background jobs; private network/VPN only), C data (PostgreSQL + S3-compatible object storage; private only). Per-server least-privilege DB roles; same release on all servers; a 4th processing server is a config change.

Update 2026-10-05 (later the same day): Max directed "3 separate instances on a single machine for testing; talk over API calls only; don't build and test as a monolith". Contract §21 supersedes the shared-DB layout: only the core instance holds PostgreSQL/blobs/domain code; edge (public+TA+sign-in+bulk upload + processing service) and staff (Ops/SuperAdmin/Accounts) are BFFs calling core over mutual-TLS JSON APIs with per-service allowlists; system/E2E tests run three processes.

**Why:** untrusted files never touch staff/DB hosts; staff surface not internet-exposed; Core rules shared by all front ends.

**How to apply:** contract §21 (internal/records/design/01-foundation-contract.md) is the record (§20 server roles still apply). Built as a service-split milestone: phase 1 in parallel with milestone 3, phase 2 ports milestone 3 pages and deletes the single-process server. All product system/E2E tests run three instances on one machine; never test the product as a monolith. Related: [[roles-and-extension]], [[delegated-decisions]].
