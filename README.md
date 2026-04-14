# bimbo

A proof-of-concept BIM viewer prototyping features from [StreamBIM](https://streambim.com) by [Rendra](https://rendra.io).

Bimbo is a browser-based 3D viewer for building information models. It supports object selection, layer and discipline management, clipping planes, and properties inspection — built on a modern React and Three.js stack as a sandbox for exploring StreamBIM features. The 3D Viewer module is fully functional with procedural sample data and drag-and-drop glTF loading. Eight additional modules (2D views, checklists, capture, documents, user management, reports, takt planning, and project diary) are scaffolded as navigation shells.

---

## Development

**Prerequisites:** Node.js 20+

```sh
pnpm install
pnpm dev        # → localhost:5173
```

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm test` | Run tests |
| `pnpm lint` | Lint and format check |

## Tech

React, Three.js (via React Three Fiber), TanStack Router, Zustand, Tailwind CSS with shadcn/ui, Vite, TypeScript, Biome, Vitest.

## Layout

```
+------------------+-------------------------+------------------+
|   Left Sidebar   |      3D Canvas          |   Right Panel    |
|                  |                         |                  |
| - Module nav     |   (React Three Fiber)   | - Object props   |
| - Layer controls |                         | - Context info   |
| - View manager   |                         |                  |
| - Feature shells |                         |                  |
+------------------+-------------------------+------------------+
```

- **Left sidebar:** module navigation, layer toggling, saved views
- **Center:** 3D canvas (full remaining width)
- **Right panel:** context-sensitive — selected object properties, checklist details, etc.
- Both side panels are collapsible

## Modules

| # | Module | Wiki Source | Status |
|---|--------|------------|--------|
| 1 | 3D Model Viewer | `3d-navigation`, `3d-clipping`, `layers-and-visibility`, `views`, `measurement`, `grid-display` | **Implemented** |
| 2 | 2D Views | `2d-views` | Shell |
| 3 | Checklists | `checklists`, `checklist-items-and-control-methods`, `checklist-export-and-excel` | Shell |
| 4 | Capture | `capture`, `capture-workflows`, `capture-topic-management` | Shell |
| 5 | Document Management | `document-management`, `document-upload-and-labeling`, `document-access-control` | Shell |
| 6 | User & Access Mgmt | `user-management`, `user-roles-and-permissions`, `user-groups`, `enterprise-administration` | Shell |
| 7 | Power BI / Reports | `power-bi-integration`, `power-bi-setup` | Shell |
| 8 | Takt Planning | `takt-planning` | Shell |
| 9 | Project Diary | `project-diary` | Shell |

## Conventions

| Item | Value |
|------|-------|
| Project name | `bimbo` |
| Dev server port | Default Vite (5173) |
| Code style | Biome defaults + TypeScript strict |
| Module pattern | Zustand store slice per feature, route per feature |
