import { Button } from "@/commons/components/ui/Button";
import { REGION_DISPLAY_LABELS } from "@/commons/constants/regions.constant";
import { useCollapseSentinel } from "@/commons/hooks/use-collapse-sentinel";
import { cn } from "@/commons/utils/cn";
import { formatRupiah } from "@/commons/utils/format";
import { calculateVariantPriceIdr } from "@/domain";
import { useEsimDetailQuery } from "@/presentation/hooks/use-esim-detail.query";
import { useCheckoutActions } from "@/presentation/stores/checkout-flow.store";
import {
  CaretLeft,
  CreditCard,
  GlobeHemisphereEast,
  Lightning,
} from "@phosphor-icons/react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export interface ProductDetailPageProps {
  slug: string;
}

export function ProductDetailPage({ slug }: ProductDetailPageProps) {
  const { data: product, isLoading } = useEsimDetailQuery(slug);
  const { setSelectedVariant } = useCheckoutActions();
  const navigate = useNavigate();
  const { sentinelRef, isCollapsed } = useCollapseSentinel(56);

  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [selectedDataSize, setSelectedDataSize] = useState("3GB");
  const [selectedDays, setSelectedDays] = useState(7);
  const [failedSlides, setFailedSlides] = useState<Record<number, boolean>>({});
  const carouselRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!product) {
      return;
    }
    setActiveSlideIndex(0);
    setFailedSlides({});
    setSelectedDataSize(product.dataSizeOptions[0] ?? "3GB");
    setSelectedDays(product.dayOptions[0] ?? 7);
    carouselRef.current?.scrollTo({
      left: 0,
      behavior: "instant" as ScrollBehavior,
    });
  }, [product]);

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col bg-white">
        <div className="h-[280px] w-full animate-pulse bg-slate-200" />
        <div className="relative z-10 -mt-7 flex-1 rounded-t-[28px] bg-white px-5 pt-6">
          <div className="h-7 w-1/2 animate-pulse rounded bg-slate-200/80" />
          <div className="mt-2 h-4 w-1/3 animate-pulse rounded bg-slate-100" />
          <div className="mt-6 h-20 w-full animate-pulse rounded-2xl bg-slate-100" />
          <div className="mt-6 h-12 w-full animate-pulse rounded-xl bg-slate-100" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-1 flex-col bg-[#252A86]">
        <header className="flex h-14 items-center gap-2 px-3 text-white">
          <Link
            to="/"
            search={{ search: "", region: "all", type: "all" }}
            aria-label="Kembali ke katalog Travel eSIM"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
          >
            <CaretLeft size={20} weight="bold" aria-hidden="true" />
          </Link>
          <h1 className="text-lg font-bold tracking-tight text-white">
            Detail Produk
          </h1>
        </header>
        <main className="flex flex-1 flex-col items-center justify-center rounded-t-[28px] bg-white px-6 text-center">
          <h2 className="text-base font-bold text-slate-900">
            Produk tidak ditemukan
          </h2>
          <p className="mt-1.5 max-w-[28ch] text-xs leading-relaxed text-slate-500">
            Paket eSIM yang Anda pilih tidak tersedia atau telah dihapus.
          </p>
          <Link
            to="/"
            search={{ search: "", region: "all", type: "all" }}
            className="mt-5"
          >
            <Button variant="outline">Kembali ke Katalog</Button>
          </Link>
        </main>
      </div>
    );
  }

  const gallery =
    product.galleryUrls.length > 0 ? product.galleryUrls : [product.imageUrl];
  const currentPriceIdr = calculateVariantPriceIdr(
    product.priceIdr,
    selectedDataSize,
    selectedDays,
  );

  const handleSelectSlide = (idx: number) => {
    setActiveSlideIndex(idx);
    const el = carouselRef.current;
    if (el && el.clientWidth > 0) {
      el.scrollTo({
        left: idx * el.clientWidth,
        behavior: "smooth",
      });
    }
  };

  const handleOrderNow = () => {
    setSelectedVariant({
      slug: product.slug,
      dataSize: selectedDataSize,
      days: selectedDays,
      priceIdr: currentPriceIdr,
    });
    void navigate({ to: "/checkout/order-detail" });
  };

  return (
    <div className="relative flex flex-1 flex-col bg-white">
      <header
        data-testid="detail-collapsing-header"
        data-collapsed={isCollapsed ? "true" : "false"}
        className={cn(
          "fixed top-0 left-1/2 z-30 flex h-14 w-full max-w-[430px] -translate-x-1/2 items-center justify-between px-3 transition-colors duration-200",
          isCollapsed
            ? "bg-[#252A86] text-white shadow-[0_6px_20px_-6px_rgba(15,23,42,0.3)]"
            : "bg-gradient-to-b from-slate-950/45 to-transparent text-white",
        )}
      >
        <div className="flex min-w-0 items-center gap-1.5">
          <Link
            to="/"
            search={{ search: "", region: "all", type: "all" }}
            aria-label="Kembali ke katalog Travel eSIM"
            className={cn(
              "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white transition-all active:scale-95",
              isCollapsed
                ? "hover:bg-white/10"
                : "bg-slate-950/25 backdrop-blur-xs hover:bg-slate-950/40",
            )}
          >
            <CaretLeft size={20} weight="bold" aria-hidden="true" />
          </Link>
          <span
            className={cn(
              "truncate text-base font-bold tracking-tight text-white transition-all duration-200",
              isCollapsed
                ? "translate-y-0 opacity-100"
                : "pointer-events-none translate-y-1 opacity-0",
            )}
          >
            {product.name}
          </span>
        </div>

        <span
          className={cn(
            "shrink-0 rounded-full bg-white/15 px-3 py-1 font-mono text-xs font-bold text-white transition-all duration-200",
            isCollapsed
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-1 opacity-0",
          )}
        >
          {formatRupiah(currentPriceIdr)}
        </span>
      </header>

      <div className="sticky top-0 z-0 h-[280px] w-full overflow-hidden bg-slate-900">
        <div
          ref={carouselRef}
          data-testid="detail-photo-carousel"
          onScroll={(event) => {
            const el = event.currentTarget;
            if (el.clientWidth <= 0) {
              return;
            }
            const nextIdx = Math.round(el.scrollLeft / el.clientWidth);
            if (
              nextIdx !== activeSlideIndex &&
              nextIdx >= 0 &&
              nextIdx < gallery.length
            ) {
              setActiveSlideIndex(nextIdx);
            }
          }}
          className="flex h-full w-full touch-pan-x snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {gallery.map((url, idx) => (
            <div
              key={url}
              className="h-full w-full shrink-0 snap-center snap-always"
            >
              {failedSlides[idx] ? (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[#252A86] text-white">
                  <GlobeHemisphereEast
                    size={44}
                    weight="duotone"
                    aria-hidden="true"
                  />
                  <span className="text-sm font-semibold">{product.name}</span>
                </div>
              ) : (
                <img
                  src={url}
                  alt={`${product.name} - Foto ${idx + 1}`}
                  draggable={false}
                  onError={() =>
                    setFailedSlides((prev) => ({
                      ...prev,
                      [idx]: true,
                    }))
                  }
                  className="h-full w-full select-none object-cover"
                />
              )}
            </div>
          ))}
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/35 to-transparent"
        />

        {gallery.length > 1 && (
          <div
            aria-label="Galeri foto produk"
            className="absolute inset-x-0 bottom-9 z-10 flex items-center justify-center gap-0.5"
          >
            {gallery.map((url, idx) => {
              const isActive = idx === activeSlideIndex;
              return (
                <button
                  key={url}
                  type="button"
                  aria-label={`Foto ${idx + 1} dari ${gallery.length}`}
                  aria-pressed={isActive}
                  onClick={() => handleSelectSlide(idx)}
                  className="p-1"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "block h-1.5 rounded-full transition-all duration-200",
                      isActive
                        ? "w-6 bg-white"
                        : "w-1.5 bg-white/55 hover:bg-white/80",
                    )}
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div
        ref={sentinelRef}
        aria-hidden="true"
        className="pointer-events-none absolute top-[130px] left-0 h-px w-full"
      />

      <main className="relative z-10 -mt-7 flex flex-1 flex-col rounded-t-[28px] bg-white px-5 pt-6 pb-8 shadow-[0_-10px_30px_rgba(15,23,42,0.12)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              {product.name}
            </h1>
            <p className="mt-0.5 text-sm text-slate-400">
              {REGION_DISPLAY_LABELS[product.region]}
            </p>
          </div>
          <span
            data-testid="detail-dynamic-price"
            className="shrink-0 font-sans text-xl font-extrabold tracking-tight text-[#252A86]"
          >
            {formatRupiah(currentPriceIdr)}
          </span>
        </div>

        <div className="mt-2.5 flex items-center gap-1.5 text-xs font-medium text-slate-800">
          {product.type === "instant" ? (
            <>
              <Lightning
                size={15}
                weight="regular"
                className="text-[#252A86]"
                aria-hidden="true"
              />
              <span>Instant</span>
            </>
          ) : (
            <>
              <CreditCard
                size={15}
                weight="regular"
                className="text-[#252A86]"
                aria-hidden="true"
              />
              <span>Topupable</span>
            </>
          )}
        </div>

        <section
          aria-label="Cakupan negara"
          className="mt-5 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4"
        >
          <h2 className="text-sm font-bold text-slate-900">Cakupan negara</h2>
          <p className="mt-1 text-sm text-slate-700">
            {product.coverageCountries.join(", ")}
          </p>
        </section>

        <section aria-label="Ukuran Data" className="mt-6">
          <h2 className="text-sm font-bold text-slate-900">Ukuran Data</h2>
          <div className="mt-3 flex flex-wrap gap-2.5">
            {product.dataSizeOptions.map((size) => {
              const isSelected = selectedDataSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedDataSize(size)}
                  className={cn(
                    "min-h-[42px] rounded-xl px-4 text-sm font-bold transition-all active:scale-[0.97]",
                    isSelected
                      ? "bg-[#252A86] text-white shadow-sm"
                      : "bg-[#EEF0FF] text-[#252A86] hover:bg-[#E0E4FF]",
                  )}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </section>

        <section aria-label="Pilih Jumlah Hari" className="mt-6">
          <h2 className="text-sm font-bold text-slate-900">
            Pilih Jumlah Hari
          </h2>
          <div className="mt-3 flex flex-wrap gap-2.5">
            {product.dayOptions.map((days) => {
              const isSelected = selectedDays === days;
              const formattedDays = String(days).padStart(2, "0");
              return (
                <button
                  key={days}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedDays(days)}
                  className={cn(
                    "min-h-[42px] min-w-[52px] rounded-xl px-4 text-sm font-bold transition-all active:scale-[0.97]",
                    isSelected
                      ? "bg-[#252A86] text-white shadow-sm"
                      : "bg-[#EEF0FF] text-[#252A86] hover:bg-[#E0E4FF]",
                  )}
                >
                  {formattedDays}
                </button>
              );
            })}
          </div>
        </section>

        <section aria-label="Deskripsi" className="mt-6">
          <h2 className="text-sm font-bold text-slate-900">Deskripsi</h2>
          <ul className="mt-2.5 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-700">
            {product.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </section>
      </main>

      <div className="sticky bottom-0 z-20 border-t border-slate-100 bg-white/95 px-5 py-3.5 backdrop-blur-xs">
        <Button fullWidth onClick={handleOrderNow}>
          Pesan Sekarang
        </Button>
      </div>
    </div>
  );
}
