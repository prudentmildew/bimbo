# Bimbo — Feature Exploration Insights

## Source Material

The wiki at `~/Playground/llm-wiki/llm-wiki/wiki/` is a **StreamBIM knowledge base** — 47 markdown files covering the StreamBIM platform, a web-based BIM (Building Information Modeling) tool by Rendra. Content is organized into 13 categories with extensive wikilink cross-references.

## Goal

Build a **proof-of-concept** that prototypes actual StreamBIM features described in the wiki, starting with the 3D Model Viewer and leaving architectural space for all other modules.

---

## Decisions

### Scope & Features

| Decision | Choice |
|---|---|
| PoC type | Prototype of StreamBIM features (not a wiki viewer or chatbot) |
| Primary feature | **3D Model Viewer** — fully implemented |
| Viewer scope | **Core viewer**: load/render model, orbit/pan/zoom, object selection + properties, clipping planes, layer/discipline toggling, saved views |
| Secondary features | Empty module shells for: 2D Views, Checklists, Capture (Issue Tracking), Document Management, User & Access Management, Power BI / Reports, Takt Planning, Project Diary |
| Model format | **Mock/sample data** — procedural geometry as default + drag-and-drop glTF loading |
| Metadata | **Typed TypeScript interfaces** modeling IFC property structure, with inline data for procedural model and JSON sidecar for loaded glTF |

### Tech Stack

| Layer | Choice |
|---|---|
| Framework | **React** (TypeScript, strict mode) |
| 3D rendering | **React Three Fiber** (R3F) |
| Routing | **TanStack Router** (file-based routing via Vite plugin) |
| State management | **Zustand** (feature slices per module) |
| UI components | **shadcn/ui** (Tailwind CSS + Radix UI primitives) |
| Build tool | **Vite** |
| Linting/formatting | **Biome** |
| Testing | Deferred — no test framework scaffolded initially |

### Layout

**Three-column layout:**

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

- Left sidebar: module navigation (links to all 9 features), layer toggling, saved views
- Center: 3D canvas (full remaining width)
- Right panel: context-sensitive — selected object properties, checklist details, etc.
- Both side panels collapsible

### Conventions

| Item | Value |
|---|---|
| Project name | `bimbo` |
| Dev server port | Default Vite (5173) |
| Code style | Biome defaults + TypeScript strict |
| Module pattern | Zustand store slice per feature, route per feature |

---

## Wiki Feature Map

Features from the wiki, mapped to planned modules:

| # | Module | Wiki pages | Status |
|---|---|---|---|
| 1 | 3D Model Viewer | `3d-navigation.md`, `3d-clipping.md`, `layers-and-visibility.md`, `views.md`, `measurement.md`, `grid-display.md` | **Implement** |
| 2 | 2D Views | `2d-views.md` | Shell |
| 3 | Checklists | `checklists.md`, `checklist-items-and-control-methods.md`, `checklist-export-and-excel.md` | Shell |
| 4 | Capture | `capture.md`, `capture-workflows.md`, `capture-topic-management.md` | Shell |
| 5 | Document Management | `document-management.md`, `document-upload-and-labeling.md`, `document-access-control.md` | Shell |
| 6 | User & Access Mgmt | `user-management.md`, `user-roles-and-permissions.md`, `user-groups.md`, `enterprise-administration.md` | Shell |
| 7 | Power BI / Reports | `power-bi-integration.md`, `power-bi-setup.md` | Shell |
| 8 | Takt Planning | `takt-planning.md` | Shell |
| 9 | Project Diary | `project-diary.md` | Shell |
