import { formatQuotaSpaced } from "@/commons/utils/format";

export interface OrderPackageSummaryProps {
  productName: string;
  dataSize: string;
  orderDateLabel: string;
  quantity?: number;
}

export function OrderPackageSummary({
  productName,
  dataSize,
  orderDateLabel,
  quantity = 1,
}: OrderPackageSummaryProps) {
  return (
    <section aria-label="Ringkasan Paket">
      <h2 className="text-base font-bold tracking-tight text-slate-900">
        Ringkasan Paket
      </h2>

      <dl className="mt-3 space-y-2.5 text-sm">
        <div className="flex items-center justify-between gap-4">
          <dt className="text-slate-500">Paket Terpilih</dt>
          <dd className="text-right font-medium text-slate-900">
            {productName}
          </dd>
        </div>

        <div className="flex items-center justify-between gap-4">
          <dt className="text-slate-500">Data Tersedia</dt>
          <dd className="text-right font-medium text-slate-900">
            {formatQuotaSpaced(dataSize)}
          </dd>
        </div>

        <div className="flex items-center justify-between gap-4">
          <dt className="text-slate-500">Tanggal Pesanan</dt>
          <dd className="text-right font-medium text-slate-900">
            {orderDateLabel}
          </dd>
        </div>

        <div className="flex items-center justify-between gap-4">
          <dt className="text-slate-500">Jumlah</dt>
          <dd className="text-right font-medium text-slate-900">{quantity}</dd>
        </div>
      </dl>
    </section>
  );
}
