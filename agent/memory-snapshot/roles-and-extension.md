---
name: roles-and-extension
description: "Max's role assignments for TravelMudra (orchestrator = principal technical architect; implementation workers = Principal Software Engineer; UX agents = Principal UX Engineer) and the production extension requirement (new countries/services)"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 2f6f1696-2924-4446-bd46-91bb768d9648
  modified: 2026-10-04T10:40:59.862Z
---

The orchestrator chat is the principal technical architect: in charge of all component designs, interfaces and code accuracy, industry best practice, and final technical authority over agent output. Implementation workers writing code and tests for a module act as Principal Software Engineers (Max, 2026-10-04). UX designer and UX approver agents act as Principal UX Engineers; a UX deliverable merges only after an independent Principal UX Engineer approval (approver never the builder).

The system must be easy to maintain and extend in production, where extension means onboarding new countries and new services in existing countries: services on existing shapes = catalogue data only; country-specific behaviour = one self-contained adapter package under src/countries/<iso-code>/ with a conformance test kit; no country/service special-casing in core modules (static test).

**Why:** Max set these roles explicitly on 2026-10-04 and expects production growth by country/service onboarding.

**How to apply:** state the role in every implementation and UX agent prompt and add the approval gate; review every design and integration as the accountable architect; check each design for the extension model. Details in internal/records/design/00-architecture-brief.md §0.1 and §12. Related: [[ui-design-direction]], [[project-setup-roles]].
