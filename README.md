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
