# Design System Overhaul: Remove Tailwind + Radix, Custom CSS

## Summary

Strip Tailwind CSS, all Radix UI primitives, and their supporting libraries. Replace with a single hand-written stylesheet (`src/styles.css`) using semantic class names, implementing the dark-mode-native design system described in `DESIGN.md`.

The goal is to move from a generic shadcn/ui look to an exclusive, premium feel — border-defined depth, translucent layering, typographic restraint, and emerald green as a sparse identity marker.

## Decisions

| Decision | Choice |
|----------|--------|
| CSS architecture | Single monolithic stylesheet (`src/styles.css`) |
| Component styling | Semantic class names in JSX, no utilities |
| Radix replacement | Full removal — replace all 16 primitives with native HTML + minimal custom JS |
| Primary font | Plus Jakarta Sans (self-hosted, weights 400 + 500) |
| Monospace font | Source Code Pro (self-hosted) |
| Color system | Flat hex values + rgba where translucency needed, as CSS custom properties |
| Brand color | Emerald green `#3ecf8e` / `#00c573` (per DESIGN.md, not current cyan) |
| Transition strategy | Big bang — single pass, all components at once |
| Icon library | Keep lucide-react |
| Dependencies removed | tailwindcss, @tailwindcss/vite, tailwind-merge, class-variance-authority, clsx, all @radix-ui/* |

## Stylesheet Structure (`src/styles.css`)

```
1. @font-face declarations (Plus Jakarta Sans, Source Code Pro)
2. :root custom properties (colors, spacing, radii, typography)
3. CSS reset / base element styles
4. Layout styles (app shell, sidebar, panels)
5. Component styles (buttons, cards, inputs, tabs, etc.)
6. Route/page-specific styles
7. Utility classes (minimal — e.g., .sr-only)
```

Each section clearly commented for AI agent navigation.

## Color Tokens (CSS Custom Properties)

```css
:root {
  /* Brand */
  --brand: #3ecf8e;
  --brand-link: #00c573;
  --brand-border: rgba(62, 207, 142, 0.3);

  /* Backgrounds */
  --bg-deep: #0f0f0f;
  --bg-page: #171717;

  /* Text */
  --text-primary: #fafafa;
  --text-secondary: #b4b4b4;
  --text-muted: #898989;

  /* Borders (depth hierarchy) */
  --border-subtle: #242424;
  --border-standard: #2e2e2e;
  --border-prominent: #363636;
  --border-light: #393939;

  /* Surfaces */
  --surface-glass: rgba(41, 41, 41, 0.84);

  /* BIM discipline colors */
  --color-architecture: #a78bfa;
  --color-structure: #34d399;
  --color-mep: #22d3ee;
}
```

## Typography

- **Primary**: Plus Jakarta Sans (400, 500) — self-hosted via @font-face
- **Monospace**: Source Code Pro (400) — self-hosted via @font-face
- **Hero**: 72px, weight 400, line-height 1.00 (the signature zero-leading)
- **Weight discipline**: 400 for nearly everything, 500 only for nav links and button labels
- **Card titles**: -0.16px letter-spacing
- **Code labels**: Source Code Pro, 12px, uppercase, 1.2px letter-spacing

## Radix Replacement Plan

### Trivial (plain HTML)
- `react-label` → `<label>`
- `react-separator` → `<hr>`
- `react-slot` → direct rendering

### Moderate (small JS behavior)
- `react-checkbox` → `<input type="checkbox">` with styled wrapper
- `react-switch` → `<button role="switch">` with aria-checked
- `react-toggle` / `react-toggle-group` → `<button aria-pressed>` with state
- `react-slider` → `<input type="range">` with custom styling
- `react-tabs` → `<div role="tablist">` + panel switching + keyboard nav
- `react-collapsible` → `<details>/<summary>` or toggle with height animation
- `react-scroll-area` → native scrollbar styling via CSS (`::-webkit-scrollbar`)

### Complex (custom implementations)
- `react-dialog` → native `<dialog>` element (built-in focus trapping, Escape handling, backdrop)
- `react-dropdown-menu` → `<div popover>` with click-outside + keyboard nav
- `react-select` → custom component with positioned listbox + keyboard nav

## Files Affected

Every component file in `src/components/` (31 files) will have className attributes rewritten from Tailwind utilities to semantic class names.

### Key files:
- `src/styles.css` — NEW, the single stylesheet
- `src/index.css` — DELETE (replaced by styles.css)
- `src/lib/utils.ts` — DELETE (`cn()` no longer needed)
- `src/components/ui/*` — rewrite all 16 components, removing Radix imports
- `src/components/layout/*` — rewrite class names
- `src/components/sidebar/*` — rewrite class names
- `src/components/viewer/*` — rewrite class names
- `package.json` — remove ~20 dependencies
- `vite.config.ts` — remove `@tailwindcss/vite` plugin

## Design Principles (from DESIGN.md)

- Dark-mode-native: near-black backgrounds, never pure black
- Depth via border hierarchy, not shadows
- Green used sparingly as identity marker (links, logo, accent borders)
- Pill (9999px) for primary CTAs, 6px for secondary, 8-16px for cards
- Translucent rgba borders for layered depth
- Dense hero text (line-height 1.00), generous section spacing (90-128px)
- No bold (700) — hierarchy through size, not weight
