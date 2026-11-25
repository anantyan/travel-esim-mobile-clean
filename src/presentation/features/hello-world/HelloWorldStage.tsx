import { useEsimCatalogQuery } from "@/presentation/hooks/use-esim-catalog.query";
import { DeviceMobile, SimCard } from "@phosphor-icons/react";

/**
 * Phase 1 centered landing stage verifying the 430px MobileAppShell,
 * Clean Architecture DI pipeline (Presentation -> Core -> Domain -> Data),
 * and self-hosted typography/icon tokens.
 */
export function HelloWorldStage() {
  const { data: catalog = [], isLoading } = useEsimCatalogQuery();

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200/90 bg-slate-50 px-3.5 py-1.5 text-xs font-semibold text-[#252A86]">
        <DeviceMobile size={16} weight="bold" aria-hidden="true" />
        <span>MKP Mobile · Clean Boilerplate</span>
      </div>

      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        Hello World
      </h1>

      <p className="mt-3 max-w-[30ch] text-sm leading-relaxed text-slate-500">
        Arsitektur Clean Architecture 5-layer siap digunakan untuk pengembangan
        Travel eSIM mobile-first.
      </p>

      <div
        data-testid="architecture-status-pill"
        className="mt-6 inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-[#252A86]/15 bg-[#EEF0FF] px-3.5 py-2 font-mono text-[11px] font-medium text-[#252A86]"
      >
        <SimCard size={15} weight="duotone" aria-hidden="true" />
        <span>
          {isLoading
            ? "Memuat modul statis..."
            : `Phase 1 Ready · ${catalog.length} produk statis`}
        </span>
      </div>
    </main>
  );
}
