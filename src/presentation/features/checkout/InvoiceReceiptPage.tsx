import { Button } from "@/commons/components/ui/Button";
import {
  formatQuotaSpaced,
  formatRupiah,
  formatRupiahWithCents,
} from "@/commons/utils/format";
import { CheckoutHeader } from "@/presentation/features/checkout/components/CheckoutHeader";
import {
  useCheckoutActions,
  useCheckoutSelection,
} from "@/presentation/stores/checkout-flow.store";
import { Check, Copy, SealCheck } from "@phosphor-icons/react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export function InvoiceReceiptPage() {
  const navigate = useNavigate();
  const { latestReceipt } = useCheckoutSelection();
  const { resetCheckoutFlow } = useCheckoutActions();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return undefined;
    }
    const timer = window.setTimeout(() => {
      setCopied(false);
    }, 2000);
    return () => {
      window.clearTimeout(timer);
    };
  }, [copied]);

  const handleFinish = () => {
    resetCheckoutFlow();
    void navigate({
      to: "/",
      search: { search: "", region: "all", type: "all" },
    });
  };

  if (!latestReceipt) {
    return (
      <div className="flex flex-1 flex-col bg-[#252A86]">
        <CheckoutHeader title="Invoice" step="done" onBack={handleFinish} />
        <main className="flex flex-1 flex-col items-center justify-center rounded-t-[28px] bg-white px-6 text-center">
          <h2 className="text-base font-bold text-slate-900">
            Invoice tidak ditemukan
          </h2>
          <p className="mt-1.5 max-w-[28ch] text-xs leading-relaxed text-slate-500">
            Silakan lakukan pemesanan paket Travel eSIM terlebih dahulu.
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

  const handleCopyInvoice = async () => {
    try {
      await navigator.clipboard?.writeText(latestReceipt.invoiceNumber);
    } catch {
      // Clipboard API may be unavailable in restricted headless contexts
    }
    setCopied(true);
  };

  return (
    <div className="flex flex-1 flex-col bg-[#252A86]">
      <CheckoutHeader
        title="Invoice"
        step="done"
        onBack={handleFinish}
        backLabel="Selesai dan kembali ke katalog"
      />

      <main className="flex flex-1 flex-col justify-between rounded-t-[28px] bg-white px-5 pt-7 pb-6">
        <div className="space-y-4">
          <div className="rounded-2xl bg-[#F8F9FC] px-4 pt-6 pb-5 text-center">
            <SealCheck
              size={68}
              weight="fill"
              className="mx-auto text-[#22C55E]"
              aria-hidden="true"
            />

            <p
              data-testid="invoice-total-paid"
              className="mt-3 text-2xl font-extrabold tracking-tight text-[#252A86]"
            >
              {formatRupiah(latestReceipt.totalPaidIdr)}
            </p>

            <div className="mt-1.5 inline-flex items-center gap-2 text-xs font-medium text-slate-500">
              <span data-testid="invoice-number">
                No. {latestReceipt.invoiceNumber}
              </span>
              <button
                type="button"
                data-testid="copy-invoice-button"
                aria-label="Salin nomor invoice"
                onClick={handleCopyInvoice}
                className="inline-flex h-7 items-center gap-1 rounded-md px-1.5 text-[#252A86] transition-colors hover:bg-[#EEF0FF] active:scale-95"
              >
                {copied ? (
                  <>
                    <Check size={14} weight="bold" aria-hidden="true" />
                    <span className="text-[11px] font-semibold">Tersalin</span>
                  </>
                ) : (
                  <Copy size={15} weight="duotone" aria-hidden="true" />
                )}
              </button>
            </div>

            <dl className="mt-5 space-y-3 border-t border-slate-200/70 pt-4 text-left text-xs">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-slate-500">Status</dt>
                <dd>
                  <span className="inline-flex rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
                    Berhasil
                  </span>
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-slate-500">No. Ref</dt>
                <dd className="font-mono font-medium text-slate-900">
                  {latestReceipt.referenceNumber}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-slate-500">Tgl Transaksi</dt>
                <dd className="font-medium text-slate-900">
                  {latestReceipt.transactionDateLabel}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-slate-500">Waktu Transaksi</dt>
                <dd className="font-mono font-medium text-slate-900">
                  {latestReceipt.transactionTimeWibLabel}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-slate-500">Metode pembayaran</dt>
                <dd className="font-medium text-slate-900">
                  {latestReceipt.paymentMethod.name}
                </dd>
              </div>
            </dl>
          </div>

          <section
            aria-label="Detail Transaksi"
            className="rounded-2xl bg-[#F8F9FC] px-4 py-4"
          >
            <h2 className="text-sm font-bold text-slate-900">
              Detail Transaksi
            </h2>

            <dl className="mt-3 space-y-2.5 text-xs">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-slate-500">Produk</dt>
                <dd className="font-medium text-slate-900">
                  {latestReceipt.product.name}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-slate-500">Data Tersedia</dt>
                <dd className="font-medium text-slate-900">
                  {formatQuotaSpaced(latestReceipt.selectedDataSize)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-slate-500">Jumlah</dt>
                <dd className="font-medium text-slate-900">
                  {latestReceipt.quantity}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-slate-500">Nama Pelanggan</dt>
                <dd className="font-medium text-slate-900">
                  {latestReceipt.customer.fullName}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-slate-500">Nomor Whatsapp</dt>
                <dd
                  data-testid="invoice-masked-whatsapp"
                  className="font-mono font-medium text-slate-900"
                >
                  {latestReceipt.customer.maskedWhatsapp}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-slate-500">Email</dt>
                <dd
                  data-testid="invoice-masked-email"
                  className="font-medium text-slate-900"
                >
                  {latestReceipt.customer.maskedEmail}
                </dd>
              </div>
            </dl>

            <p className="mt-4 text-center text-[11px] leading-relaxed text-slate-500">
              Kami akan segera mengirimkan kode QR eSIM ke email Anda. Cek inbox
              (atau folder spam) ya!
            </p>
          </section>

          <section
            aria-label="Detail Pembayaran"
            className="rounded-2xl bg-[#F8F9FC] px-4 py-4"
          >
            <h2 className="text-sm font-bold text-slate-900">
              Detail Pembayaran
            </h2>

            <dl className="mt-3 space-y-2.5 text-xs">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-slate-500">Harga</dt>
                <dd className="font-medium text-slate-900">
                  {formatRupiahWithCents(latestReceipt.packagePriceIdr)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-slate-500">Biaya Transaksi</dt>
                <dd className="font-medium text-slate-900">
                  {formatRupiahWithCents(latestReceipt.feeIdr)}
                </dd>
              </div>
            </dl>
          </section>
        </div>

        <div className="sticky bottom-0 z-20 -mx-5 mt-6 border-t border-slate-100 bg-white/95 px-5 pt-3.5 pb-1 backdrop-blur-xs">
          <Button fullWidth onClick={handleFinish}>
            Selesai
          </Button>
        </div>
      </main>
    </div>
  );
}
