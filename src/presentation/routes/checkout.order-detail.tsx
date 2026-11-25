import { Button } from "@/commons/components/ui/Button";
import { formatActiveDays, formatRupiah } from "@/commons/utils/format";
import { useEsimDetailQuery } from "@/presentation/hooks/use-esim-detail.query";
import { useCheckoutSelection } from "@/presentation/stores/checkout-flow.store";
import { CaretLeft } from "@phosphor-icons/react";
import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/checkout/order-detail")({
  component: CheckoutOrderDetailStubRoute,
});

function CheckoutOrderDetailStubRoute() {
  const {
    selectedProductSlug,
    selectedDataSize,
    selectedDays,
    computedPriceIdr,
  } = useCheckoutSelection();
  const { data: product } = useEsimDetailQuery(selectedProductSlug ?? "");

  return (
    <div className="flex flex-1 flex-col bg-[#252A86]">
      <header className="flex h-14 items-center justify-between px-3 text-white">
        <div className="flex items-center gap-1.5">
          <Link
            to={product ? "/products/$slug" : "/"}
            params={product ? { slug: product.slug } : undefined}
            search={
              product ? undefined : { search: "", region: "all", type: "all" }
            }
            aria-label="Kembali"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
          >
            <CaretLeft size={20} weight="bold" aria-hidden="true" />
          </Link>
          <h1 className="text-lg font-bold tracking-tight text-white">
            Detail Pemesan
          </h1>
        </div>

        <div
          aria-label="Langkah 1 dari 2"
          className="flex items-center gap-1.5 pr-2 text-xs font-bold"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#252A86]">
            1
          </span>
          <span className="h-0.5 w-3 bg-white/45" />
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/25 text-white">
            2
          </span>
        </div>
      </header>

      <main className="flex flex-1 flex-col justify-between rounded-t-[28px] bg-white px-5 pt-6 pb-8">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Ringkasan Paket
          </h2>

          <div className="mt-3 space-y-2.5 text-sm">
            <div className="flex items-center justify-between text-slate-500">
              <span>Paket Terpilih</span>
              <span className="font-medium text-slate-900">
                {product?.name ?? selectedProductSlug ?? "Belum dipilih"}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Data Tersedia</span>
              <span className="font-medium text-slate-900">
                {selectedDataSize ?? product?.quotaLabel ?? "-"}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Masa Aktif</span>
              <span className="font-medium text-slate-900">
                {selectedDays
                  ? formatActiveDays(selectedDays)
                  : product
                    ? formatActiveDays(product.activeDays)
                    : "-"}
              </span>
            </div>
            {computedPriceIdr !== null && (
              <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 text-slate-500">
                <span>Subtotal</span>
                <span className="font-bold text-[#252A86]">
                  {formatRupiah(computedPriceIdr)}
                </span>
              </div>
            )}
          </div>

          <div className="mt-6 rounded-xl border border-[#252A86]/15 bg-[#EEF0FF] px-4 py-3 text-xs font-medium text-[#252A86]">
            Form Data Pelanggan, Metode Pembayaran (`Saldo`, `VA BCA`,
            `Mandiri`, `BRI`), dan Struk Invoice lengkap akan dibangun pada Fase
            4.
          </div>
        </div>

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
