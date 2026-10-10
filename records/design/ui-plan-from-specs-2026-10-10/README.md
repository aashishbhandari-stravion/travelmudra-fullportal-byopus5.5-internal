# UI plan from the UX specifications only — 10 October 2026

Status: architect's plan. Not accepted product policy. Not an assessment of the built product.

## Purpose

Max asked the Principal Technical Architect to form a small team and plan the UI that the architect
would build from the UX specifications alone. No product code and no Opus design record was an input.
The plan is the baseline for three later steps that Max proposed: an independent review by Goku, a
gap comparison against the built Opus UI, and a change-cost assessment. Those steps are not part of
this folder.

## Inputs (the only sources)

| Ref | File | SHA-256 |
|---|---|---|
| UX | `MaxHyperVisaArchitecture/specifications/product-ux/2026-10-05/TARGET_PRODUCT_UX_SPEC.md` | `b45186887cdc37f6c078adabb4e0024bc453f9653793cdfb414725d85c979ce4` |
| BU | `MaxHyperVisaArchitecture/specifications/product-ux/2026-10-05/BULK_UPLOAD_PRODUCT_UX_SPEC.md` | `c2686f12552be10f35cf1352b8de909cb8feb318a6a8d962f1229c8d6170bab5` |
| RM | `MaxHyperVisaArchitecture/specifications/product-ux/2026-10-05/README.md` (applicability note of 7 October) | `90d48a989c3c76a6e5613667fedbbcc68932dcf7b433e5b9437e7f8052dea690` |
| BS | `MaxHyperVisaArchitecture/handoffs/BUILD-SPEC-r2/content/BUILD_SPEC.md` | `4a6fd90657b0723f67fb13a58aa57b3377238fd361ee8f706867bb714d58ea89` |

Architecture repository commit at reading time: `ee0eeda1728dcf9b85667d070454902ce19159f4`. The BS hash
equals the hash that both UX documents cite as their governing contract.

Excluded by Max's decision: product code, the Opus design records under `internal/records/design/`,
and the Astra-only decision files under `specifications/product-ux/2026-10-05/sources/`.

## Team and authority

| Role | Model | Owns | Authority |
|---|---|---|---|
| Principal Technical Architect | Fable 5.1 (parent) | Scope, briefs, integration, every decision, final text | Sole owner |
| Principal UX Engineer | Claude Opus worker | Shell, navigation, page anatomy and states, components, tokens, accessibility | Proposes |
| Principal Product Engineer (frontend) | Claude Opus worker | Journeys, per-page actions and guards, read models and commands, bulk flow, acceptance mapping | Proposes |
| Independent design reviewer | Claude Opus worker, fresh context | Failure modes, coverage, STE conformance, ranked findings | Reviews; does not edit |

Workers did not see each other's drafts. The architect integrated the drafts and resolved every
conflict. Disagreements that remain are recorded in the review findings.

## Files

| File | Content |
|---|---|
| `ARCHITECT-BRIEF.md` | The brief given to every worker: input boundary, binding decisions D1–D7, shared page identifiers, style |
| `UI-PLAN.md` | Main UI plan: shell, role workspaces, page inventory, components, tokens, behavior contract, build sequence |
| `BULK-UPLOAD-UI-PLAN.md` | Bulk upload UI plan: screens, flow, correction and retry semantics, acceptance mapping |
| `COVERAGE-MATRIX.md` | Every UX and BU requirement bundle and scenario mapped to a page and a behavior, or marked open |
| `REVIEW-FINDINGS.md` | Independent reviewer's ranked findings and the architect's disposition of each |

## Writing style

ASD-STE100 style at about 80% adoption (STY-20261003-01). The documents are for the architect and for
Goku, not for end users.
