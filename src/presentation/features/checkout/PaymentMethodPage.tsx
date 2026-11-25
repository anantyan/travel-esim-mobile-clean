import { Button } from "@/commons/components/ui/Button";
import { cn } from "@/commons/utils/cn";
import {
  formatOrderDateDdMmYyyy,
  formatRupiah,
  formatRupiahWithCents,
} from "@/commons/utils/format";
import { container } from "@/core/di/container";
import type { PaymentMethod } from "@/domain";
import { CheckoutHeader } from "@/presentation/features/checkout/components/CheckoutHeader";
import { OrderPackageSummary } from "@/presentation/features/checkout/components/OrderPackageSummary";
import { useEsimDetailQuery } from "@/presentation/hooks/use-esim-detail.query";
import { usePaymentMethodsQuery } from "@/presentation/hooks/use-payment-methods.query";
import {
  useCheckoutActions,
  useCheckoutSelection,
} from "@/presentation/stores/checkout-flow.store";
import { Wallet } from "@phosphor-icons/react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo } from "react";

function PaymentMethodLogo({ method }: { method: PaymentMethod }) {
  if (method.category === "balance") {
    return (
      <span className="flex h-7 w-9 shrink-0 items-center justify-center rounded-md text-slate-900">
        <Wallet size={22} weight="fill" aria-hidden="true" />
      </span>
    );
  }

  if (method.code === "BCA_VA") {
    return (
      <span className="flex h-7 w-9 shrink-0 items-center justify-center rounded-md bg-[#EBF3FE] font-sans text-[10px] font-black tracking-tight text-[#005BAA]">
        BCA
      </span>
    );
  }

  if (method.code === "MANDIRI_VA") {
    return (
      <span className="flex h-7 w-9 shrink-0 items-center justify-center rounded-md bg-[#EEF4FA] font-sans text-[9px] font-black tracking-tight text-[#003D79]">
        MDR
      </span>
    );
  }

  return (
    <span className="flex h-7 w-9 shrink-0 items-center justify-center rounded-md bg-[#EAF2FB] font-sans text-[10px] font-black tracking-tight text-[#00529C]">
      BRI
    </span>
  );
}

export function PaymentMethodPage() {
  const navigate = useNavigate();
  const {
    selectedProductSlug,
    selectedDataSize,
    selectedDays,
    computedPriceIdr,
    orderCreatedAtIso,
    customerInfo,
    selectedPaymentMethodId,
  } = useCheckoutSelection();
  const { setSelectedPaymentMethodId, setLatestReceipt } = useCheckoutActions();

  const { data: product } = useEsimDetailQuery(selectedProductSlug ?? "");
  const { data: methods = [] } = usePaymentMethodsQuery();

  const packagePriceIdr = computedPriceIdr ?? product?.priceIdr ?? 0;

  const isMethodDisabled = useCallback(
    (method: PaymentMethod): boolean => {
      if (method.category !== "balance" || method.balanceIdr === undefined) {
        return false;
      }
      return packagePriceIdr + method.feeIdr > method.balanceIdr;
    },
    [packagePriceIdr],
  );

  useEffect(() => {
    if (methods.length === 0) {
      return;
    }
    const currentSelected = methods.find(
      (m) => m.id === selectedPaymentMethodId,
    );
    if (currentSelected && !isMethodDisabled(currentSelected)) {
      return;
    }
    const firstAffordable = methods.find((m) => !isMethodDisabled(m));
    if (firstAffordable) {
      setSelectedPaymentMethodId(firstAffordable.id);
    }
  }, [
    methods,
    selectedPaymentMethodId,
    isMethodDisabled,
    setSelectedPaymentMethodId,
  ]);

  const activeMethod = useMemo(
    () =>
      methods.find((m) => m.id === selectedPaymentMethodId) ??
      methods.find((m) => !isMethodDisabled(m)) ??
      null,
    [methods, selectedPaymentMethodId, isMethodDisabled],
  );

  const orderDateLabel = useMemo(() => {
    const parsed = orderCreatedAtIso ? new Date(orderCreatedAtIso) : new Date();
    return formatOrderDateDdMmYyyy(parsed);
  }, [orderCreatedAtIso]);

  const handleBack = () => {
    void navigate({ to: "/checkout/order-detail" });
  };

  if (!selectedProductSlug || !customerInfo) {
    return (
      <div className="flex flex-1 flex-col bg-[#252A86]">
        <CheckoutHeader
          title="Metode Pembayaran"
          step={2}
          onBack={handleBack}
        />
        <main className="flex flex-1 flex-col items-center justify-center rounded-t-[28px] bg-white px-6 text-center">
          <h2 className="text-base font-bold text-slate-900">
            Data pemesan belum lengkap
          </h2>
          <p className="mt-1.5 max-w-[28ch] text-xs leading-relaxed text-slate-500">
            Lengkapi data pelanggan terlebih dahulu sebelum memilih metode
            pembayaran.
          </p>
          <Link
            to={selectedProductSlug ? "/checkout/order-detail" : "/"}
            search={
              selectedProductSlug
                ? undefined
                : { search: "", region: "all", type: "all" }
            }
            className="mt-5"
          >
            <Button variant="outline">
              {selectedProductSlug ? "Isi Data Pemesan" : "Kembali ke Katalog"}
            </Button>
          </Link>
        </main>
      </div>
    );
  }

  const feeIdr = activeMethod?.feeIdr ?? 0;
  const totalIdr = packagePriceIdr + feeIdr;

  const handleConfirmPayment = () => {
    if (!product || !activeMethod) {
      return;
    }
    const receipt = container.createOrderReceiptUseCase.execute(
      product,
      activeMethod,
      new Date(),
      {
        selectedDataSize: selectedDataSize ?? product.quotaLabel,
        selectedDays: selectedDays ?? product.activeDays,
        packagePriceIdr,
        customer: customerInfo,
      },
    );
    setLatestReceipt(receipt);
    void navigate({ to: "/checkout/receipt" });
  };

  return (
    <div className="flex flex-1 flex-col bg-[#252A86]">
      <CheckoutHeader title="Metode Pembayaran" step={2} onBack={handleBack} />

      <main className="flex flex-1 flex-col justify-between rounded-t-[28px] bg-white px-5 pt-6 pb-6">
        <div>
          <OrderPackageSummary
            productName={product?.name ?? selectedProductSlug}
            dataSize={selectedDataSize ?? product?.quotaLabel ?? "3GB"}
            orderDateLabel={orderDateLabel}
            quantity={1}
          />

          <div
            aria-hidden="true"
            className="my-5 border-t border-dashed border-slate-200"
          />

          <section aria-label="Pilih Metode Pembayaran">
            <h2 className="text-base font-bold tracking-tight text-slate-900">
              Pilih Metode Pembayaran
            </h2>

            <fieldset className="m-0 mt-3.5 border-0 p-0">
              <legend className="sr-only">Pilih Metode Pembayaran</legend>
              <div className="space-y-3">
                {methods.map((method) => {
                  const disabled = isMethodDisabled(method);
                  const isSelected = activeMethod?.id === method.id;

                  return (
                    <label
                      key={method.id}
                      data-testid={`payment-option-${method.code}`}
                      className={cn(
                        "relative flex items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 transition-all",
                        disabled
                          ? "cursor-not-allowed border-slate-200/70 bg-slate-50 opacity-60"
                          : "cursor-pointer",
                        isSelected && !disabled
                          ? "border-[#252A86] bg-[#EEF0FF]/35 shadow-xs"
                          : !disabled &&
                              "border-slate-200/90 bg-white hover:border-slate-300",
                        "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#252A86]",
                      )}
                    >
                      <input
                        type="radio"
                        name="payment-method"
                        value={method.id}
                        disabled={disabled}
                        checked={isSelected}
                        onChange={() => setSelectedPaymentMethodId(method.id)}
                        className="absolute inset-0 m-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
                      />

                      <div className="flex min-w-0 items-center gap-3">
                        <PaymentMethodLogo method={method} />
                        <div className="min-w-0">
                          <span className="block text-sm font-bold text-slate-900">
                            {method.name}
                          </span>
                          {disabled && (
                            <span className="block text-[11px] font-medium text-rose-600">
                              Saldo tidak mencukupi
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-3">
                        {method.balanceIdr !== undefined && (
                          <span className="text-xs font-medium text-slate-500">
                            {formatRupiah(method.balanceIdr)}
                          </span>
                        )}
                        <span
                          aria-hidden="true"
                          className={cn(
                            "pointer-events-none flex h-6 w-6 items-center justify-center rounded-full transition-colors",
                            isSelected && !disabled
                              ? "border-2 border-[#252A86] bg-white"
                              : "border-[1.5px] border-slate-300 bg-white",
                          )}
                        >
                          {isSelected && !disabled && (
                            <span className="h-3 w-3 rounded-full bg-[#252A86]" />
                          )}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          </section>
        </div>

        <div className="mt-8">
          <dl className="space-y-2.5 text-sm">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-slate-500">Harga</dt>
              <dd className="font-semibold text-slate-900">
                {formatRupiahWithCents(packagePriceIdr)}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-slate-500">Biaya Layanan</dt>
              <dd className="font-semibold text-slate-900">
                {formatRupiah(feeIdr)}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-3">
              <dt className="text-sm font-bold text-slate-900">Total</dt>
              <dd
                data-testid="payment-total-amount"
                className="text-lg font-extrabold tracking-tight text-[#252A86]"
              >
                {formatRupiah(totalIdr)}
              </dd>
            </div>
          </dl>

          <div className="sticky bottom-0 z-20 -mx-5 mt-4 border-t border-slate-100 bg-white/95 px-5 pt-3.5 pb-1 backdrop-blur-xs">
            <Button
              fullWidth
              disabled={!product || !activeMethod}
              onClick={handleConfirmPayment}
            >
              Lanjutkan
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
