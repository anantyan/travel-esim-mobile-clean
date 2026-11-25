import { Button } from "@/commons/components/ui/Button";
import { REGION_DISPLAY_LABELS } from "@/commons/constants/regions.constant";
import { formatActiveDays, formatRupiah } from "@/commons/utils/format";
import { useEsimDetailQuery } from "@/presentation/hooks/use-esim-detail.query";
import { CaretLeft } from "@phosphor-icons/react";
import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/products/$slug")({
  component: ProductDetailStubRoute,
});

function ProductDetailStubRoute() {
  const { slug } = Route.useParams();
  const { data: product, isLoading } = useEsimDetailQuery(slug);

  return (
    <div className="flex flex-1 flex-col bg-[#252A86]">
      <header className="flex items-center gap-2.5 px-4 pt-5 pb-5 text-white">
        <Link
          to="/"
          search={{ search: "", region: "all", type: "all" }}
          aria-label="Kembali ke katalog Travel eSIM"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
        >
          <CaretLeft size={20} weight="bold" aria-hidden="true" />
        </Link>
        <h1 className="text-lg font-bold tracking-tight text-white">
          Detail Produk
        </h1>
      </header>

      <main className="flex flex-1 flex-col justify-between rounded-t-[28px] bg-white px-5 pt-6 pb-8">
        {isLoading ? (
          <div className="space-y-3">
            <div className="h-44 w-full animate-pulse rounded-2xl bg-slate-100" />
            <div className="h-6 w-2/3 animate-pulse rounded bg-slate-200/80" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-slate-100" />
          </div>
        ) : product ? (
          <div>
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-48 w-full rounded-2xl object-cover"
            />
            <div className="mt-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900">
                  {product.name}
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  {REGION_DISPLAY_LABELS[product.region]} · {product.quotaLabel}{" "}
                  · {formatActiveDays(product.activeDays)}
                </p>
              </div>
              <span className="font-sans text-lg font-extrabold text-[#252A86]">
                {formatRupiah(product.priceIdr)}
              </span>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              {product.description}
            </p>

            <div className="mt-5 rounded-xl border border-[#252A86]/15 bg-[#EEF0FF] px-4 py-3 text-xs font-medium text-[#252A86]">
              Varian Ukuran Data, Jumlah Hari, &amp; Checkout 2-Step akan
              dilengkapi penuh pada Fase 3 &amp; Fase 4.
            </div>
          </div>
        ) : (
          <div className="py-12 text-center">
            <h2 className="text-base font-bold text-slate-900">
              Produk tidak ditemukan
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Paket eSIM yang dipilih tidak tersedia di katalog.
            </p>
          </div>
        )}

        <Link
          to="/"
          search={{ search: "", region: "all", type: "all" }}
          className="mt-6 block"
        >
          <Button fullWidth variant="outline">
            Kembali ke Katalog
          </Button>
        </Link>
      </main>
    </div>
  );
}
