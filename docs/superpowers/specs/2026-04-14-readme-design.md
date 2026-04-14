# README.md Design Spec

## Goal

Create a canonical README.md in the project root that serves two audiences: stakeholders/visitors who want to understand what the project is, and developers who need to get it running.

## Approach: Two-tier structure

A narrative top half for anyone landing on the repo, separated by a horizontal rule from a compact developer section.

## Structure

### 1. Title + Tagline

```
# bimbo

A proof-of-concept BIM viewer prototyping features from [StreamBIM](https://streambim.com) by [Rendra](https://rendra.io).
```

### 2. What & Why

A 2-3 sentence paragraph covering:

- **What it does** — browser-based 3D viewer for building models with object selection, layer management, clipping planes, and properties inspection
- **Why it exists** — prototype sandbox for exploring StreamBIM features in a modern React + Three.js stack
- **Current state** — the 3D Viewer module is fully functional with procedural sample data and drag-and-drop glTF loading; eight additional modules (2D views, checklists, capture, documents, user management, reports, takt planning, project diary) are scaffolded as navigation shells

### 3. Horizontal rule

`---`

### 4. Development

Compact section:

- **Prerequisites**: Node.js 20+
- **Getting started**: `pnpm install` then `pnpm dev` opens at `localhost:5173`
- **Scripts table** (minimal):

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm test` | Run tests |
| `pnpm lint` | Lint & format check |

### 5. Tech highlights

Short paragraph naming core technologies without version numbers: React, Three.js (via React Three Fiber), TanStack Router, Zustand, Tailwind CSS with shadcn/ui, Vite, TypeScript, Biome, Vitest.

## What to omit

- No screenshots or placeholder images (can add later)
- No license section (no LICENSE file exists)
- No contributing guide
- No badges
- No deep architectural docs (that's what `exploration-insight.md` is for)
- No version numbers in tech list

## File

- **Path**: `README.md` (project root)
- **Tone**: Clear, concise, professional but not corporate
