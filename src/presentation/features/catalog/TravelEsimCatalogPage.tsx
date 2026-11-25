import { Button } from "@/commons/components/ui/Button";
import { FilterBottomSheet } from "@/commons/components/ui/FilterBottomSheet";
import {
  PRODUCT_TYPE_OPTIONS,
  REGION_OPTIONS,
  getRegionFilterLabel,
  getTypeFilterLabel,
} from "@/commons/constants/regions.constant";
import { cn } from "@/commons/utils/cn";
import type { EsimCatalogFilter } from "@/domain";
import { EsimCatalogSkeleton } from "@/presentation/features/catalog/components/EsimCatalogSkeleton";
import { EsimProductCard } from "@/presentation/features/catalog/components/EsimProductCard";
import { useEsimCatalogQuery } from "@/presentation/hooks/use-esim-catalog.query";
import {
  CaretDown,
  CaretLeft,
  MagnifyingGlass,
  X,
} from "@phosphor-icons/react";
import { useDeferredValue, useEffect, useState } from "react";

export interface TravelEsimCatalogPageProps {
  filter: EsimCatalogFilter;
  onFilterChange: (patch: Partial<EsimCatalogFilter>) => void;
  onResetAll: () => void;
}

export function TravelEsimCatalogPage({
  filter,
  onFilterChange,
  onResetAll,
}: TravelEsimCatalogPageProps) {
  const [searchInput, setSearchInput] = useState(filter.search);
  const [activeSheet, setActiveSheet] = useState<"region" | "type" | null>(
    null,
  );

  // Sync only when external filter.search is cleared/changed externally (e.g. Reset All)
  useEffect(() => {
    setSearchInput((current) =>
      current === filter.search ? current : filter.search,
    );
  }, [filter.search]);

  const deferredSearch = useDeferredValue(searchInput);

  const { data: products = [], isLoading } = useEsimCatalogQuery({
    search: deferredSearch,
    region: filter.region,
    type: filter.type,
  });

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    onFilterChange({ search: value });
  };

  const handleClearSearch = () => {
    setSearchInput("");
    onFilterChange({ search: "" });
  };

  return (
    <div className="flex flex-1 flex-col bg-[#252A86]">
      <header className="px-4 pt-5 pb-5 text-white">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            aria-label="Kembali atau reset filter"
            onClick={onResetAll}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 active:scale-95"
          >
            <CaretLeft size={20} weight="bold" aria-hidden="true" />
          </button>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Travel eSIM
          </h1>
        </div>

        <div className="relative mt-4 flex items-center">
          <input
            type="text"
            inputMode="search"
            enterKeyHint="search"
            value={searchInput}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder="Cari Produk yang Anda Mau"
            aria-label="Cari Produk yang Anda Mau"
            className="w-full rounded-xl bg-[#161A5E] py-3 pr-11 pl-4 text-sm text-white placeholder:text-indigo-200/70 focus-visible:outline-2 focus-visible:outline-white/60"
          />
          {searchInput.length > 0 ? (
            <button
              type="button"
              aria-label="Hapus pencarian"
              onClick={handleClearSearch}
              className="absolute right-2.5 inline-flex h-7 w-7 items-center justify-center rounded-full text-indigo-100 transition-colors hover:bg-white/15"
            >
              <X size={16} weight="bold" aria-hidden="true" />
            </button>
          ) : (
            <MagnifyingGlass
              size={20}
              weight="bold"
              aria-hidden="true"
              className="pointer-events-none absolute right-3.5 text-white"
            />
          )}
        </div>

        <div className="mt-3.5 flex items-center gap-2.5">
          <button
            type="button"
            data-testid="filter-region-chip"
            aria-haspopup="dialog"
            aria-expanded={activeSheet === "region"}
            onClick={() => setActiveSheet("region")}
            className={cn(
              "inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-xs font-semibold text-white transition-all active:scale-[0.98]",
              filter.region !== "all"
                ? "border-white bg-white/18"
                : "border-white/75 bg-transparent hover:bg-white/10",
            )}
          >
            <span>{getRegionFilterLabel(filter.region)}</span>
            <CaretDown size={13} weight="bold" aria-hidden="true" />
          </button>

          <button
            type="button"
            data-testid="filter-type-chip"
            aria-haspopup="dialog"
            aria-expanded={activeSheet === "type"}
            onClick={() => setActiveSheet("type")}
            className={cn(
              "inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-xs font-semibold text-white transition-all active:scale-[0.98]",
              filter.type !== "all"
                ? "border-white bg-white/18"
                : "border-white/75 bg-transparent hover:bg-white/10",
            )}
          >
            <span>{getTypeFilterLabel(filter.type)}</span>
            <CaretDown size={13} weight="bold" aria-hidden="true" />
          </button>
        </div>
      </header>

      <main className="flex flex-1 flex-col rounded-t-[28px] bg-[#F8F9FC] px-4 pt-5 pb-10">
        {isLoading ? (
          <EsimCatalogSkeleton />
        ) : products.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#EEF0FF] text-[#252A86]">
              <MagnifyingGlass size={24} weight="duotone" aria-hidden="true" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Produk tidak ditemukan
            </h2>
            <p className="mt-1.5 max-w-[28ch] text-xs leading-relaxed text-slate-500">
              Coba ubah kata kunci pencarian atau reset filter region dan jenis
              produk.
            </p>
            <Button
              variant="outline"
              className="mt-5 px-5 py-2.5 text-xs"
              onClick={onResetAll}
            >
              Reset Filter
            </Button>
          </div>
        ) : (
          <section
            aria-label="Daftar Produk Travel eSIM"
            className="grid grid-cols-2 gap-3.5"
          >
            {products.map((product) => (
              <EsimProductCard key={product.id} product={product} />
            ))}
          </section>
        )}
      </main>

      <FilterBottomSheet
        open={activeSheet === "region"}
        title="Pilih Region"
        options={REGION_OPTIONS}
        appliedValue={filter.region}
        defaultValue="all"
        onApply={(region) => onFilterChange({ region })}
        onClose={() => setActiveSheet(null)}
        testIdPrefix="region-filter"
      />

      <FilterBottomSheet
        open={activeSheet === "type"}
        title="Pilih Jenis Produk"
        options={PRODUCT_TYPE_OPTIONS}
        appliedValue={filter.type}
        defaultValue="all"
        onApply={(type) => onFilterChange({ type })}
        onClose={() => setActiveSheet(null)}
        testIdPrefix="type-filter"
      />
    </div>
  );
}
