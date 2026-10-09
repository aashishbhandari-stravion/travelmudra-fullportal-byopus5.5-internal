---
name: data-privacy
description: "Max requires his TravelMudra data to stay private — nobody, including Anthropic research/training, may access it (2026-10-06)"
metadata:
  node_type: memory
  type: user
  originSessionId: 2f6f1696-2924-4446-bd46-91bb768d9648
  modified: 2026-10-06T04:53:40.750Z
---

Max (2026-10-06), when asking about pushing to GitHub and running the build in Claude cloud sessions: "I need to ensure that my data remains private, no body is able to access it. Not even anthropic for their research".

**Why:** proprietary product and business spec; he weighs privacy above speed.

**How to apply:** do not move work to cloud sessions or push anything without his explicit decision after he has seen the privacy trade-offs; any remote must be private (the product repo's GitHub visibility is unverified — gh is not authenticated); the internal records repo has no remote and must never go to the product remote. Be candid that local Claude Code still sends prompts and read file contents to Anthropic for inference; training/retention depends on his plan and settings, which he must check. Related: [[project-setup-roles]], [[production-topology]].
