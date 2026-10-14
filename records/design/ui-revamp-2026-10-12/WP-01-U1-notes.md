# WP-01 U1 notes: design tokens and base styles

Unit U1 of WP-01 (LD-09, option C accepted in `WP-01.md` §3). Author: the U1 engineer, 12 October 2026. Input
for the architect's `DESIGN.md` update and for U2 and U3. Not committed by U1; the architect integrates.

## 1. Files changed

| File | Change |
|---|---|
| `static/css/tokens.css` | Option C palette in sRGB hex (light and dark), written as `WP-01-design.md` §3.2 states it. The four per-surface shell blocks (light and dark) are deleted. New rail, environment label, selection, disabled and text-selection tokens. Type scale, line heights, radius and motion values changed. 154 `@contrast` pairs (was 85). |
| `static/css/base.css` | h1 28 px (`--text-2xl`); headings line height 1.25 and body 1.5 through the tokens; `small` and `table` 14 px; links ink with a full-strength 1 px underline, 2 px on hover; focus ring 2 px at 2 px offset with the halo as a 2 px `box-shadow`; text selection uses the new text-selection tokens; caret ink; `accent-color` is the selection marker (teal); scrollbar uses `--control-border`. |
| `test/unit/web/contrast.test.ts` | `#rgb` and `#rrggbb` parsing (WCAG 2.2 sRGB linearization) beside OKLCH; translucent and named colours are refused. New tests: hex maths, parser cases, coverage of every rail, environment, selection, disabled, focus, shell, nav and action token, pairs name only existing tokens, one shell for every role (no `data-surface` rule; every surface resolves to identical tokens), key palette values in both themes. The per-surface loop stays and passes. |

`static/css/fonts.css` is unchanged (Atkinson Hyperlegible Next and Mono kept, deviation D-06).

## 2. Token names

### 2.1 Added (for U2 and U3)

| Token | Light | Dark | Intended use |
|---|---|---|---|
| `--rail` | #172D35 | #0A1215 | Rail background, every role |
| `--rail-border` | #172D35 | #2C3E46 | ADDED by U1. Rail edge; in dark it separates the rail from the canvas (#0E171B). Decorative, no contrast pair |
| `--rail-text` | #FFFFFF | #ECEAE4 | Rail item text |
| `--rail-muted` | #B9C6CA | #A9B6BC | Rail secondary text and item icons |
| `--rail-hover` | #1F3A44 | #142228 | ADDED by U1. Rail item hover background (text 12.02 / 13.54) |
| `--rail-current` | #24434E | #1C3038 | Current rail item background (with heavier weight and the marker) |
| `--rail-marker` | #5CC8BC | #4FBFB2 | 4 px current-item marker (light teal on ink) |
| `--rail-focus` | #F5F4F0 | #ECEAE4 | Focus ring inside the rail |
| `--env-bg` | #F3EDE6 | #33261A | Environment label strip |
| `--env-text` | = `--text` | = `--text` | Environment label text |
| `--env-border` | #8A4B08 | #E2A65C | Environment label border and icon |
| `--selection-marker` | #006B63 | #4FBFB2 | 3 px marker of a selected row, option or tab (with `--selection-bg`) |
| `--disabled-bg` | #ECEEEE | #1E2C32 | Disabled control fill |
| `--disabled-text` | #52636B | #A9B6BC | Disabled control text |
| `--disabled-border` | #6E7E85 | #7D9097 | Disabled control border, dashed |
| `--text-selection-bg` | #BFDAD8 | #244A4C | ADDED by U1. `::selection` highlight (25% teal). `--selection-bg` (10% tint) was too faint for selected text on white (1.13:1 against white) |
| `--text-selection-text` | = `--text` | = `--text` | ADDED by U1. Selected text |

`--selection-bg` and `--selection-text` existed; their values changed to #E6F0EF / ink (dark #163B3A / #ECEAE4).
`--focus-halo` existed but no CSS used it; base.css now uses it.

### 2.2 Kept names, new meaning

| Token | Now resolves to | Note |
|---|---|---|
| `--shell`, `--shell-border`, `--shell-text`, `--shell-text-muted` | `--surface`, `--border`, `--text`, `--text-muted` | The top bar is white for every role |
| `--shell-current`, `--shell-current-text` | `--selection-bg`, `--selection-text` | Current item in the top bar (surface switch, public nav) |
| `--shell-focus-ring` | `--focus-ring` | Top bar is light |
| `--nav-bg`, `--nav-text`, `--nav-current-bg`, `--nav-current-text`, `--nav-marker` | `--rail`, `--rail-text`, `--rail-current`, `--rail-text`, `--rail-marker` | Kept as aliases so the current `layout.css` keeps working; U2 MAY switch to the `--rail-*` names |
| `--link`, `--link-hover` | `--text` | Ink; the underline is the cue |
| `--tone-info-*`, `--tone-delivery-*`, `--tone-unavailable-*` | `--tone-neutral-*` (slate) | Unavailable keeps its own border: `--control-border` (3:1, dashed in components) |
| `--tone-warning-*` | `--tone-attention-*` | |
| `--tone-blocked-*` | `--tone-danger-*` | |
| `--tone-success-*` | bg slate tint; text and solid `--text` (ink); own border | No green |
| `--toast-bg`, `--toast-text` | `--text`, `--canvas` | Inverse of the page in both themes |
| `--money-credit` | `--tone-success-text` (ink) | Was green; the direction word is the cue |
| `--radius-l` | 0.5rem (was 0.75rem) | Panels use 8 px. `--radius-s` stays 0.25rem for small inline marks (tags, skeleton bars) |
| `--leading-tight` / `--leading-body` | 1.25 / 1.5 | `--leading-snug` stays 1.35 for compact UI rows (nav items, badges, inputs) |
| `--text-lg` / `--text-xl` | 1.25rem (20) / 1.5rem (24) | Was 18 / 22. Every component that uses them grows by 2 px |
| `--dur-fast` / `--dur-slow` | 150ms / 200ms | Was 120 / 320 |
| `--nav-width` | 14.5rem | Was 15rem; design R9 rail width 232 px |
| `--action-active`, `--quiet-hover`, `--border-subtle`, `--control-bg`, tone borders | U1 values (not in the design) | Light: #00433E, #E9EDED, #E6E3DC, #FFFFFF. Dark: #3BA89C, #1F3239, #213239, #0E171B. Tone borders are the solid mixed about 35 to 40% into white or the tint |

### 2.3 Deleted

- The per-surface blocks `:root[data-surface='ta' | 'ops' | 'admin' | 'accounts']` (light and dark). `data-surface` stays on `<html>`; no token depends on it. The contrast test now fails if a `data-surface` rule comes back.
- `--text-3xl`, `--text-4xl`: only `base.css` used `--text-3xl` (h1); nothing used `--text-4xl`. Consistent with WP-20 DV-02/DV-03 ("unused tokens are deleted").
- The OKLCH neutral ramp `--n-0` … `--n-950`: only `base.css` used one (`--n-400`, scrollbar). Grep at deletion time: no other CSS, TS or JS file referenced `--n-*`.

All `var(--…)` references in `static/`, `src/` and `scripts/` resolve to a defined token (checked after U2 and U3 had started editing).

## 3. Contrast results (light / dark), from the test's own maths

154 pairs per theme and surface; all pass. The tightest pair in light is muted text on sunken, 5.25 (min 4.5); in dark, muted text on selection, 5.87.

| Pair | Light | Dark | Min |
|---|---|---|---|
| Text on canvas / surface | 13.04 / 14.35 | 15.09 / 13.37 | 4.5 |
| Muted on canvas / surface | 5.69 / 6.26 | 8.73 / 7.74 | 4.5 |
| Action text on action | 6.40 | 8.37 | 4.5 |
| Action (button edge) on canvas | 5.81 | 8.15 | 3 |
| Danger text on danger action | 6.57 | 7.67 | 4.5 |
| Control border on surface / canvas | 4.21 / 3.83 | 4.83 / 5.45 | 3 |
| Focus ring on halo / canvas / selection | 14.35 / 13.04 / 12.35 | 15.09 / 15.09 / 10.14 | 3 |
| Selected text on selection | 12.35 | 10.14 | 4.5 |
| Selection marker on selection | 5.51 | 5.48 | 3 |
| Disabled text on disabled bg | 5.37 | 6.91 | 4.5 |
| Disabled border on surface | 4.21 | 4.83 | 3 |
| Rail text on rail / current / hover | 14.35 / 10.56 / 12.02 | 15.72 / 11.41 / 13.54 | 4.5 |
| Rail muted on rail / current | 8.20 / 6.03 | 9.10 / 6.61 | 4.5 |
| Rail marker on rail / current | 7.14 / 5.25 | 8.49 / 6.16 | 3 |
| Rail focus on rail / current | 13.04 / 9.60 | 15.72 / 11.41 | 3 |
| Environment text on strip | 12.35 | 12.18 | 4.5 |
| Environment border on strip | 5.85 | 6.87 | 3 |
| Attention / error / external / slate text on own tint | 5.85 / 5.58 / 6.08 / 6.62 | 8.21 / 7.46 / 8.48 / 8.25 | 4.5 |
| Unavailable (dashed) border on its tint | 3.63 | 4.41 | 3 |
| Selected text highlight | 9.73 | 8.09 | 4.5 |
| Toast | 13.04 | 15.09 | 4.5 |

The values match `WP-01-design.md` §3.3 and §3.4 where the design states them.

## 4. Work for other units (proposals; U1 did not edit these files)

| # | Unit | File | Change | Rank and scenario |
|---|---|---|---|---|
| N-1 | U2 | `static/css/layout.css` | Inside the rail, re-point the focus tokens for the subtree: `.<rail> { --focus-ring: var(--rail-focus); --focus-halo: var(--rail); }`. Without it, the ink ring is invisible on the ink rail; only the white 2 px halo shows. | P1: a keyboard user tabs through the rail and sees a thin white band instead of the specified paper ring. |
| N-2 | U2 | `layout.css` | Rail item hover uses `--surface-hover` today; with the ink rail that puts white text on a light fill. Use `--rail-hover`. The current item uses `border-color: var(--border)` and `--shadow-raised`; replace with the 4 px `--rail-marker` and the heavier weight. Rail icons use `--text-muted` (low on ink); use `--rail-muted`. | P1 (hover text unreadable on hover); the others P2 (cosmetic until U2's rewrite). |
| N-3 | U2 | `layout.css` | `.shell-main:focus { outline: none; }` removes the ring of `main`, but the base halo (`box-shadow`) still draws a 2 px band after the skip link. Add `box-shadow: none` there. | P2: a faint white band around `main` after the skip link (invisible in dark). |
| N-4 | U2 | `layout.css` | Use `--env-bg`, `--env-text`, `--env-border` for the environment label (today `.env-banner` uses the warning tone, which now has the same values). Use `--rail-border` for the rail edge in dark. | P2. |
| N-5 | U2 | `base.css` (owned by U1) | `base.css` gives `view-transition-name` to `.shell-bar` and `.shell-nav`. If U2 renames these classes, tell the architect; U1 or the architect updates base.css. | P2: the shell cross-fades with the page between documents. |
| N-6 | U3 | `static/css/components.css` | `.input:focus-visible` and `.file-field__drop:has(…:focus-visible)` draw a 3 px ring (input offset 1 px). The design wants 2 px at 2 px offset everywhere. | P2: the rings are thicker than specified; contrast is met. |
| N-7 | U3 | `components.css` | `.data-table` sets `font-size: 0.9375rem` (15 px); the scale says tables are 14 px (`--text-sm`). | P2. |
| N-8 | U3 | `components.css` | `.stepper__link` sets `text-decoration: none`. Links are now ink, so a stepper link is told apart from text only by its position. Keep the underline (or give it another non-colour cue). | P1: WCAG 1.4.1 risk; a reader cannot see that the step name is a link. axe did not flag it in the gallery. |
| N-9 | U3 | `components.css` | `.button` sets `box-shadow: var(--shadow-raised)` in the components layer, which wins over the base halo. The ring still sits 2 px off the button on the page background, so contrast holds on light surfaces. For a button on a coloured region, set `box-shadow: 0 0 0 2px var(--focus-halo), var(--shadow-raised)` on `.button:focus-visible`. | P2. |
| N-10 | U3 | `components.css` | Use `--selection-bg` with a 3 px `--selection-marker` for selected rows and tabs, and `--disabled-*` (dashed border) for disabled controls, when those components are rebuilt. | P2. |

## 5. Text for DESIGN.md (architect)

- **Principles, "Restrained colour"**: replace "and the current surface" with "and the current location". Teal is only for the primary action, the current location and selection. Links are ink and always underlined.
- **Principles, "Paper and ink"**: paper #F5F4F0, white surfaces, ink #172D35; one deep ink rail for every role.
- **Principles, "Calm motion"**: 150–200 ms (was 120–320 ms).
- **Tokens table**:
  - Text: `--link` and `--link-hover` are ink; add `--text-selection-bg`, `--text-selection-text`.
  - Actions: add `--action-active`, `--selection-bg`, `--selection-text`, `--selection-marker` (selection), `--disabled-bg`, `--disabled-text`, `--disabled-border`.
  - Focus: "`--focus-ring` (2 px outline, 2 px offset, `--focus-halo` fills the offset); `--rail-focus` inside the rail".
  - Shell: "`--shell-*` is the white top bar; `--rail`, `--rail-border`, `--rail-text`, `--rail-muted`, `--rail-hover`, `--rail-current`, `--rail-marker`, `--rail-focus` (one ink rail for every role; `--nav-*` alias the rail); `--env-bg`, `--env-text`, `--env-border` (environment label)". Delete "one shell colour per surface …".
  - Tones: add "four hues: attention (also warning), danger (also blocked), external, slate neutral (also info, delivery, unavailable); success is ink with its icon".
  - Type: "`--text-xs` … `--text-2xl` (13, 14, 16, 20, 24, 28 px; h1 28, h2 24, h3 20)"; line height 1.5 body, 1.25 headings.
  - Shape: "`--radius-m` and `--radius-l` 8 px for controls and panels; `--radius-s` 4 px for small inline marks".
  - Motion: `--dur-fast` 150 ms, `--dur-base` and `--dur-slow` 200 ms.
- **Contrast sentence**: "A unit test resolves every declared foreground/background pair (hex or OKLCH) in both themes and fails below 4.5:1 for text or 3:1 for UI. The same test fails if any surface changes a token."
- **Tone meanings table**: info, delivery and unavailable read as slate; warning as attention; blocked as danger (red); success as ink. The meanings column is unchanged.

## 6. Checks run (12 October 2026, U1)

- `node --test test/unit/web/contrast.test.ts`: 27 tests, 27 pass.
- Mutation check (scratch copy, not committed): the light rail marker set to #006B63 fails 5 pairs per surface (2.24 < 3 on the rail); a restored `data-surface` block fails the one-shell test.
- `npm run typecheck`: pass. `npx eslint test/unit/web/contrast.test.ts`: pass.
- `npm run test:ui` before U2 and U3 changed any file: 282 tests, 282 pass (gallery: axe, overflow and CSP at 1440 and 390 px, light and dark; 320 and 360 px overflow).
- Gallery screenshots (scratch, not kept) at 1440 px light and dark: white top bar, ink rail, teal primary button, ink underlined links, slate success badge.
- Second run of `npm run test:ui` after U2 and U3 had started editing: 234 tests, 199 pass, 5 fail, 30 cancelled. Every failure is in the gallery: `scripts/dev/gallery-pages.ts:84` (`countedNav`) reads `SurfaceConfig.nav`, which U2's in-progress `src/web/ui/shell.ts` no longer has, so the gallery does not render. `npm run typecheck` at that time: 29 errors, all in `scripts/dev/gallery-pages.ts`, `test/unit/web/signed-in.test.ts` and `test/unit/web/components.test.ts` (U2 files). The contrast test still passes (27 of 27). The gallery axe run MUST be repeated after U2 and U3 are integrated.
