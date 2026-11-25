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
- [x] Implement `#252A86` Deep Royal Indigo mobile top header (`Travel eSIM`) with back/reset button and search input (`Cari Produk yang Anda Mau`).
- [x] Implement dual filter pills (`Semua Region`, `Semua Jenis`) with portal-locked Bottom Sheets (`Pilih Region` & `Pilih Jenis Produk`) featuring radio options, `Reset`, and single-line `Terapkan` pill button.
- [x] Sync search, region, and type filters via `@tanstack/react-router` Zod search params validation (`esimCatalogFilterSchema`).
- [x] Render 2-column eSIM product grid (`eSIM Singapore`, `eSIM Indonesia`, `eSIM USA`, `eSIM South Korea`, etc.) displaying destination visual, package name, region, type badge (`Instant` / `Topupable`), formatted Rupiah price, and navigation to `/products/$slug`.
- [x] Add unit, integration, and Playwright E2E tests covering search, region/type bottom-sheet filtering, and mobile/desktop `430px` portal viewport lock.

---

## Phase 3: Product Detail Page (`/products/$slug` — Figma Screen 4)
- [ ] Implement full `/products/$slug` page via `GetEsimDetailUseCase` with full-bleed hero image carousel & indicator dots.
- [ ] Display dynamic price, `Cakupan negara` card, interactive `Ukuran Data` (`3GB`, `5GB`, `10GB`, `15GB`) and `Pilih Jumlah Hari` (`07`, `14`, `24`, `30`) selector pills, plus 5-bullet `Deskripsi`.
- [ ] Implement sticky bottom CTA (`Pesan Sekarang`) storing variant & product selection in `useCheckoutFlowStore` (`Zustand v5`) and navigating to `/checkout/order-detail`.
- [ ] Add unit, integration, and E2E tests for variant pricing selection and missing-slug fallback.

---

## Phase 4: 2-Step Checkout (`Detail Pemesanan` -> `Metode Pembayaran` -> `Invoice`, Figma Screen 5–7)
- [ ] Implement Step 1 (`/checkout/order-detail`) with `1 — 2` header stepper, `Ringkasan Paket`, and `Data Pelanggan` form (`Nama`, `Alamat Email`, `Nomor Whatsapp`) validated via `React Hook Form` + `Zod`.
- [ ] Implement Step 2 (`/checkout/payment`) with `✓ — 2` header stepper, `Saldo (Rp200.000)`, `VA BCA`, `VA Mandiri`, `VA BRI`, fee calculation, and `Lanjutkan` CTA.
- [ ] Execute `CreateOrderReceiptUseCase` and render `/checkout/receipt` (`Invoice`) with `✓ — ✓` stepper, Copy Invoice button, masked WhatsApp & Email privacy display, and `Selesai` CTA.
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

### 2026-11-25 — Phase 2: Travel eSIM Catalog, Search & Bottom Sheets
- **Figma Alignment**: Integrated all 7 Figma UI screens into our domain/data specifications (`coverageCountries`, `dataSizeOptions`, `dayOptions`, `Saldo / VA BCA / Mandiri / BRI`).
- **Catalog & Portal Sheets**: Built `#252A86` `Travel eSIM` header, live search input, `FilterBottomSheet` (`Pilih Region` & `Pilih Jenis Produk`) strictly constrained inside `#mobile-shell-portal` (`430px`), 2-column destination grid, Zod-validated TanStack Router search params, and `/products/$slug` navigation stub.
