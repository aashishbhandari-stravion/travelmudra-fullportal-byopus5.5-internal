# Architect brief: TravelMudra UI plan from the UX specifications only

Owner: Principal Technical Architect (parent session). Date: 10 October 2026.
Purpose: plan the UI that the architect would build from the two UX specifications and the governing
BUILD_SPEC, with no knowledge of any existing implementation.

## 1. Input boundary (MUST)

You MUST read only these four files. You MUST NOT read product code, any other repository, the
`sources/` folder beside the specifications, or any Opus design record.

| Ref | File | SHA-256 |
|---|---|---|
| UX | /home/max-stravion/projects/Critical/MaxHyperVisaArchitecture/specifications/product-ux/2026-10-05/TARGET_PRODUCT_UX_SPEC.md | b45186887cdc37f6c078adabb4e0024bc453f9653793cdfb414725d85c979ce4 |
| BU | /home/max-stravion/projects/Critical/MaxHyperVisaArchitecture/specifications/product-ux/2026-10-05/BULK_UPLOAD_PRODUCT_UX_SPEC.md | c2686f12552be10f35cf1352b8de909cb8feb318a6a8d962f1229c8d6170bab5 |
| RM | /home/max-stravion/projects/Critical/MaxHyperVisaArchitecture/specifications/product-ux/2026-10-05/README.md | 90d48a989c3c76a6e5613667fedbbcc68932dcf7b433e5b9437e7f8052dea690 |
| BS | /home/max-stravion/projects/Critical/MaxHyperVisaArchitecture/handoffs/BUILD-SPEC-r2/content/BUILD_SPEC.md | 4a6fd90657b0723f67fb13a58aa57b3377238fd361ee8f706867bb714d58ea89 |

Cite requirements as `BS B14`, `UX §4.2`, `BU §6.2`. Do not cite anything else.

## 2. Architect decisions that bind this plan

- **D1 Applicability.** RM says the UX documents are an Astra baseline. Where UX or BU depends on the
  Astra-only owner decisions (`OD §§2–4`, provider decisions `PD`), the plan MUST mark the item
  `OWNER CHOICE PENDING (Astra-only source)`. Examples: SuperAdmin fallback delivery ownership, no
  SuperAdmin completion request, named communication identities.
- **D2 B46 stays open.** For this plan, BS B46 is a KNOWN_LIMITATION: the event that starts a result
  send, the trigger and owner of the completion check, and uncertain-email handling are unresolved.
  Design the surfaces (send preview, per-file recheck, receipt, completion-request blockers) but show
  the trigger as a policy boundary notice (UX §7.4), owner "product owner". Do not invent a trigger.
- **D3 Topology-neutral.** The UI holds no business truth. Every fact comes from a read model and
  every change is a command with a receipt (UX §3.3). Name read models and commands in words. Do not
  name endpoints, frameworks, libraries, tables or code.
- **D4 Status is several facts.** Follow UX §2.2 exactly. No combined badge, no percentage, no
  invented SLA or deadline.
- **D5 Unavailable is explained.** A business-unavailable action shows reason, owner and route
  (UX §7.4 policy boundary notice). Disabled is explanatory only; the server decides.
- **D6 Priority.** P0 = the standard new case (UX §3.1) end to end for all three roles, plus bulk
  scenarios BU-01, BU-04, BU-09, BU-13, BU-14, BU-15, BU-23. P1 = the variations in UX §3.2 and the
  remaining BU scenarios. P2 = optional density, brand font, illustration.
- **D7 Unknown is not zero.** Stale, partial, denied and missing states are first-class page states.

## 3. Shared page identifiers (use these exactly)

Public: PUB-01 public entry page (UX §8.1); PUB-02 sign-in (TA email+OTP; staff MFA) (BS B08).

Travel Agent: TA-01 Home; TA-02 Services list; TA-03 Service detail; TA-04 Groups list; TA-05 Group
detail (applications, imports, intake issues); TA-06 Applications list; TA-07 Application workspace;
TA-08 Review and submit (check answers); TA-09 Individual intake (task list); TA-10 Notices;
TA-11 Payment history; TA-12 Account and two-proof email change. (UX §4)

Bulk upload (TA): BU-P01 Add applicants chooser; BU-P02 Import source setup; BU-P03 Source
interpretation and consequential questions; BU-P04 Progress; BU-P05 Results workspace (exceptions
first, All results); BU-P06 Issue resolution detail; BU-P07 Correction entry and change preview;
BU-P08 Correction result and attempt history; BU-P09 Imports list; BU-P10 Application review from
import (Back to import, Next application). (BU §§3–8)

Operator: OP-01 My work queue with saved views; OP-02 Application workspace (tabs: Work, Application &
documents, External actions, Delivery & originals, History); OP-03 Return to TA / flag to SuperAdmin;
OP-04 External action authorization, execution evidence and reconciliation; OP-05 Outcome and artifact
association; OP-06 Send result (preview, per-file recheck, receipt); OP-07 Request completion;
OP-08 Incidents and follow-up; OP-09 Originals register; OP-10 Notices and account (MFA). (UX §5)

SuperAdmin: SA-01 Decision inbox; SA-02 Work queues; SA-03 Assignment and reassignment decision;
SA-04 Applications & groups oversight; SA-05 Offerings & launch; SA-06 Accounts & access (incl.
support view, read grants, second-SA approval); SA-07 Money & exposure (Gate 1 entry, Gate 2 decision,
exposure ceiling, Payment_Missing_Override); SA-08 Incidents & audit; SA-09 Gate exception decision
(generic decision page). (UX §6)

Shared shell: SH-01 app shell (rail, top bar, environment label, context selector) (UX §7.1, §7.3).

Add a page only if a spec requirement has no home. Mark any added page `ADDED` with the requirement.

## 4. Writing style (MUST)

ASD-STE100 style at about 80%. Short sentences. Active voice. One requirement per sentence. Use
MUST / MUST NOT / SHOULD / MAY. Consistent terms: use the UX §2.1 object names and the BU §3.1 unit
names. No decorative language. Tables for inventories. Keep rationale only where it changes the build.
Write the whole document in Markdown.

## 5. What you MUST NOT do

Do not evaluate or guess at any existing portal. Do not invent policy for PARKED, EXCLUDED, OWNER_DECISION
or KNOWN_LIMITATION items (BS B42–B47); surface them as boundaries. Do not write code. Do not read
files outside section 1. Do not ask the user questions; record an assumption instead and continue.
