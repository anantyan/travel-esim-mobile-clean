# Travel eSIM — Mobile-First 5-Layer Clean Architecture Boilerplate

[![CI/CD & GitHub Pages](https://github.com/anantyan/travel-esim-mobile-clean/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/anantyan/travel-esim-mobile-clean/actions/workflows/ci-cd.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-252A86.svg)](./LICENSE)

An open-source, **Ultra-Low Browser RAM** mobile-first React web application template implementing **5-Layer Clean Architecture**, **Locked Mobile Viewport Framing (`430px`)** across all device breakpoints, and a **Full Testing Pyramid** with automated GitHub Pages deployment.

- **Live Demo (GitHub Pages):** https://anantyan.github.io/travel-esim-mobile-clean/
- **Architecture Docs:** [DESIGN.md](./DESIGN.md) · [IMPLEMENTATION.md](./IMPLEMENTATION.md)

---

## Key Features & Tech Stack

- **Ultra-Low Browser RAM Stack**:
  - **React 19 + Vite 6 + TypeScript (Strict)** — zero Node.js runtime server needed in production, sourcemaps disabled in prod, explicit vendor chunk splitting.
  - **TanStack Router** — 100% type-safe file-based routing with automatic route code-splitting (`autoCodeSplitting: true`) and Zod search param validation.
  - **TanStack Query v5** — aggressive garbage collection (`gcTime: 2m`), `structuralSharing: true`, `refetchOnWindowFocus: false`, and `AbortSignal` propagation.
  - **TanStack Virtual** — reusable virtualization hook keeping active DOM nodes bounded even on massive lists.
  - **Zustand v5** — atomic `useShallow` selectors and ephemeral in-memory state.
  - **Tailwind CSS v4 + Self-Hosted Variable Fonts** — `Plus Jakarta Sans` & `Geist Mono` via `@fontsource-variable/*` plus `@phosphor-icons/react`.
- **Locked Slim Mobile Shell (`max-w-[430px]`)**: Looks and behaves like a native mobile web app on smartphones (`375px`), tablets (`768px`), laptops, and ultrawide desktops (`1440px+`), including a portal lock (`#mobile-shell-portal`) for future bottom sheets.
- **Full Testing Pyramid & Tooling**:
  - **Biome** (Lint & Format) + **Husky** + **Commitlint** (Conventional Commits)
  - **Vitest** Unit Tests (`domain` & `commons`) + Integration Tests (`@testing-library/react`)
  - **Playwright** E2E + Mobile/Desktop Viewport Lock + Chromium CDP V8 JS Heap Memory Test

---

## 5-Layer Clean Architecture Structure

```text
src/
├── domain/          # Layer 1: Pure TS Entities, Zod Schemas, Repository Ports & Use Cases (Zero UI deps)
├── data/            # Layer 2: Static Datasources, DTO Mappers & Repository Implementations
├── core/            # Layer 3: App Config, Low-RAM QueryClient, TanStack Router & DI Container
├── commons/         # Layer 4: Locked MobileAppShell (430px), UI Primitives, Constants & Formatters
└── presentation/    # Layer 5: File-Based Routes, Features, Zustand 5 Stores & TanStack Query/Virtual Hooks
```

**Dependency Rule**: `presentation` & `data` depend inward on `domain` via `core/di/container.ts`. `domain/` never imports React, TanStack, Zustand, or browser APIs.

---

## Getting Started

### Use as a GitHub Template
Click **"Use this template" -> "Create a new repository"** on GitHub to bootstrap your own mobile-first React web application with Clean Architecture and CI/CD pre-configured.

### Local Development
```bash
npm install
npm run dev
```

### Quality Gates & Testing Pyramid
```bash
npm run typecheck         # TypeScript strict check
npm run check             # Biome lint & format check
npm run test:unit         # Vitest unit tests (domain & commons)
npm run test:integration  # Vitest + React Testing Library integration tests
npm run test:e2e          # Playwright E2E + 430px shell lock + CDP V8 Heap test
npm run build:pages       # Production Vite build with GitHub Pages basepath & 404.html fallback
```

---

## Phased Roadmap (MKP Mobile Travel eSIM Case Study)
- [x] **Phase 1**: 5-Layer Clean Architecture boilerplate, `430px` Mobile Shell, centered `"Hello World"` stage, Testing Pyramid & GitHub Pages CI/CD.
- [x] **Phase 2**: `Travel eSIM` catalog, live search, and `Pilih Region` / `Pilih Jenis Produk` bottom sheets with pointer drag-to-dismiss.
- [x] **Phase 3**: Collapsing scroll headers + Product detail page with touch scroll-snap gallery, `Ukuran Data`, `Pilih Jumlah Hari`, `Cakupan negara`, and `"Pesan Sekarang"`.
- [x] **Phase 4**: 2-Step Checkout (`Detail Pemesan` form + `Metode Pembayaran`) & digital `Invoice` with PII masking.
- [x] **Phase 5**: Vector Bank Logos (`BCA`, `Mandiri`, `BRI`), Nota/Struk paper ticket UI (`ReceiptSurface` + `ReceiptDivider`), A11y focus trap, concentric SVG radios, & `v1.0.0` release.
