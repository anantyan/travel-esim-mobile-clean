# IMPLEMENTATION.md — Phased Delivery & Progress Log

> **Rule:** After completing any task, if any `TODO` was added or any behavior remains stubbed, immediately add follow-up tasks here before moving to the next phase.
> **Quality Gate per Phase:** Run `npm run typecheck`, `npm run check`, `npm run test`, and `npm run test:e2e`, update the Journal below, and verify live via Playwright MCP.

---

## Phase 1: Boilerplate, 5-Layer Clean Architecture, Centered Hello World & GitHub Pages CI/CD
- [x] Initialize `travel-esim-mobile-clean` with React 19, Vite 6, TypeScript (Strict), Tailwind CSS v4, `@fontsource-variable/plus-jakarta-sans`, `@fontsource-variable/geist-mono`, and `@phosphor-icons/react`.
- [x] Author `DESIGN.md`, `IMPLEMENTATION.md`, `README.md`, and `LICENSE` (MIT).
- [x] Scaffold 5-Layer Clean Architecture (`src/domain`, `src/data`, `src/core`, `src/commons`, `src/presentation`) enforcing strict dependency boundaries.
- [x] Implement `MobileAppShell` (`max-w-[430px] mx-auto min-h-[100dvh]`) with `#mobile-shell-portal` constraint for future bottom sheets.
- [x] Implement Ultra-Low Browser RAM configurations: `TanStack Query v5` (`gcTime: 120_000`, `structuralSharing: true`), `TanStack Router` auto code-splitting, `TanStack Virtual` hook primitive, `Zustand v5` in-memory store with `useShallow`, and Vite manual chunking (`sourcemap: false`).
- [x] Render centered `"Hello World"` initial page (`HelloWorldStage`) wired end-to-end through `Core DI -> Domain UseCase -> Data StaticRepository`.
- [x] Build Full Testing Pyramid: Vitest Unit Tests, Vitest + Testing Library Integration Tests, and Playwright E2E + Viewport Lock + Chromium CDP V8 Heap Memory Test.
- [x] Configure Biome, Husky, Commitlint, `scripts/build-pages.mjs` (`404.html` + `.nojekyll`), and `.github/workflows/ci-cd.yml`.
- [x] Run full local quality gates & Playwright live visual check (`375x812` and `1440x900`).
- [x] Commit Phase 1, publish public GitHub Template Repository (`anantyan/travel-esim-mobile-clean`), and verify live GitHub Pages deployment.

---

## Phase 2: Travel eSIM Catalog, Search & Bottom Sheet Filters (Figma Screen 1–3)
- [ ] Implement `#252A86` Deep Royal Indigo mobile top header (`Travel eSIM`) with back button and search input (`Cari Produk yang Anda Mau`).
- [ ] Implement dual filter pills (`Semua Region`, `Semua Jenis`) with portal-locked Bottom Sheets (`Pilih Region` & `Pilih Jenis Produk`) featuring radio options, `Reset`, and single-line `Terapkan` pill button.
- [ ] Sync search, region, and type filters via `@tanstack/react-router` Zod search params validation (`esimCatalogFilterSchema`).
- [ ] Render 2-column eSIM product grid (`eSIM Singapore`, `eSIM Indonesia`, `eSIM USA`, `eSIM South Korea`, etc.) displaying destination visual, package name, region, quota/type badge (`Instant` / `Topupable`), formatted Rupiah price, and `"Beli"` action.
- [ ] Add unit, integration, and Playwright E2E tests covering search, region/type bottom-sheet filtering, and mobile/desktop viewport lock.

---

## Phase 3: Product Detail Page (`/products/$slug`)
- [ ] Implement file-based route `/products/$slug` via `GetEsimDetailUseCase`.
- [ ] Display full package details: package title, hero visual, description, active duration (`Masa Aktif`), internet quota (`Kuota Internet`), product type badge, and price.
- [ ] Implement sticky bottom CTA bar (locked inside `430px` shell) with `"Konfirmasi Beli"` pill button storing selection in `useCheckoutFlowStore` (`Zustand v5`) and navigating to `/checkout/payment`.
- [ ] Add unit, integration, and E2E navigation tests for detail flow and missing-slug fallback state.

---

## Phase 4: Payment Method (`/checkout/payment`) & Order Receipt (`/checkout/receipt`)
- [ ] Implement payment method selection screen (`QRIS`, `BCA Virtual Account`, `Mandiri Virtual Account`, `GoPay`) with tactile radio rows and `"Bayar Sekarang"` CTA.
- [ ] Execute `CreateOrderReceiptUseCase` to generate deterministic order ID, timestamp, eSIM activation ICCID/QR metadata, and persist receipt in memory via `Zustand v5`.
- [ ] Implement Struk Pembelian (`/checkout/receipt`) screen with downloadable/copyable reference summary and CTA back to catalog.
- [ ] Add complete checkout flow E2E test and V8 Heap memory leak check across repeated multi-page navigation.

---

## Phase 5: Comprehensive Audit (`/fe-audit`), A11y & Final Polish
- [ ] Run full UX, accessibility (WCAG AA contrast, keyboard navigation, focus traps in bottom sheets), and Anti-Slop audit across `375x812` and `1440x900`.
- [ ] Verify Lighthouse / Vite bundle budget and CDP V8 Heap stability.
- [ ] Finalize documentation and release tag `v1.0.0`.

---

## Journal & Progress Log
### 2026-11-25 — Discovery, `/grill-me` & Phase 1 Scaffolding
- **Document Analysis**: Analyzed MKP Mobile Recruitment PDF (3 pages) and 3 Figma mobile screenshots (`Travel eSIM` catalog + `Pilih Region` + `Pilih Jenis Produk` bottom sheets). Confirmed no NDA restrictions exist in the PDF, enabling a public open-source GitHub Template Repository + live GitHub Pages deployment.
- **Architectural Decisions**:
  - Adopted **5-Layer Clean Architecture** (`domain`, `data`, `core`, `commons`, `presentation`) with strict inward dependency direction.
  - Replaced unused network clients with pure static repository adapters to preserve **Ultra-Low Browser RAM**.
  - Locked mobile viewport (`max-w-[430px] mx-auto min-h-[100dvh]`) across all screen sizes (`375px` through `1440px+`) with `#mobile-shell-portal` boundary.
  - Selected `@phosphor-icons/react`, `Plus Jakarta Sans Variable`, and `Geist Mono Variable` in alignment with `taste-skill` anti-slop standards.
- **Verification & Adjustments**:
  - Updated `playwright.config.ts` to run E2E against production `vite preview` (`4173`) so Chromium CDP V8 JS Heap measurement reflects the tree-shaken production bundle (`< 35 MB`) rather than Vite HMR dev overhead (`42.6 MB`).
  - Visually inspected `1440x900` and `375x812` screenshots (0 console errors) and tightened the Phase 1 status pill to stay single-line on `375px` screens.
