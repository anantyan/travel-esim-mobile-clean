import { Button } from "@/commons/components/ui/Button";
import { cn } from "@/commons/utils/cn";
import { formatOrderDateDdMmYyyy } from "@/commons/utils/format";
import {
  type CustomerInfo,
  type CustomerInfoInput,
  customerInfoSchema,
} from "@/domain";
import { CheckoutHeader } from "@/presentation/features/checkout/components/CheckoutHeader";
import { OrderPackageSummary } from "@/presentation/features/checkout/components/OrderPackageSummary";
import { useEsimDetailQuery } from "@/presentation/hooks/use-esim-detail.query";
import {
  useCheckoutActions,
  useCheckoutSelection,
} from "@/presentation/stores/checkout-flow.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

export function OrderDetailPage() {
  const navigate = useNavigate();
  const {
    selectedProductSlug,
    selectedDataSize,
    orderCreatedAtIso,
    customerInfo,
  } = useCheckoutSelection();
  const { setCustomerInfo } = useCheckoutActions();

  const { data: product, isLoading } = useEsimDetailQuery(
    selectedProductSlug ?? "",
  );

  const orderDateLabel = useMemo(() => {
    const parsed = orderCreatedAtIso ? new Date(orderCreatedAtIso) : new Date();
    return formatOrderDateDdMmYyyy(parsed);
  }, [orderCreatedAtIso]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerInfoInput, unknown, CustomerInfo>({
    resolver: zodResolver(customerInfoSchema),
    defaultValues: customerInfo ?? {
      fullName: "",
      email: "",
      whatsapp: "",
    },
  });

  const handleBack = () => {
    if (selectedProductSlug) {
      void navigate({
        to: "/products/$slug",
        params: { slug: selectedProductSlug },
      });
      return;
    }
    void navigate({
      to: "/",
      search: { search: "", region: "all", type: "all" },
    });
  };

  const onSubmit = (validData: CustomerInfo) => {
    setCustomerInfo(validData);
    void navigate({ to: "/checkout/payment" });
  };

  if (!selectedProductSlug) {
    return (
      <div className="flex flex-1 flex-col bg-[#252A86]">
        <CheckoutHeader title="Detail Pemesan" step={1} onBack={handleBack} />
        <main className="flex flex-1 flex-col items-center justify-center rounded-t-[28px] bg-white px-6 text-center">
          <h2 className="text-base font-bold text-slate-900">
            Belum ada paket dipilih
          </h2>
          <p className="mt-1.5 max-w-[28ch] text-xs leading-relaxed text-slate-500">
            Pilih paket Travel eSIM terlebih dahulu sebelum mengisi data
            pemesan.
          </p>
          <Link
            to="/"
            search={{ search: "", region: "all", type: "all" }}
            className="mt-5"
          >
            <Button variant="outline">Pilih Paket eSIM</Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-[#252A86]">
      <CheckoutHeader title="Detail Pemesan" step={1} onBack={handleBack} />

      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-1 flex-col justify-between rounded-t-[28px] bg-white px-5 pt-6 pb-6"
      >
        <div>
          {isLoading ? (
            <div className="space-y-3">
              <div className="h-5 w-40 animate-pulse rounded bg-slate-200/80" />
              <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
              <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
            </div>
          ) : (
            <OrderPackageSummary
              productName={product?.name ?? selectedProductSlug}
              dataSize={selectedDataSize ?? product?.quotaLabel ?? "3GB"}
              orderDateLabel={orderDateLabel}
              quantity={1}
            />
          )}

          <section aria-label="Data Pelanggan" className="mt-6">
            <h2 className="text-base font-bold tracking-tight text-slate-900">
              Data Pelanggan
            </h2>

            <div className="mt-3.5 space-y-4">
              <div>
                <label
                  htmlFor="customer-full-name"
                  className="block text-sm font-medium text-slate-900"
                >
                  Nama
                </label>
                <input
                  id="customer-full-name"
                  type="text"
                  autoComplete="name"
                  placeholder="Masukan Nama Pelanggan"
                  aria-invalid={Boolean(errors.fullName)}
                  {...register("fullName")}
                  className={cn(
                    "mt-1.5 w-full rounded-xl border bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus-visible:outline-2 focus-visible:outline-[#252A86] sm:text-sm",
                    errors.fullName ? "border-rose-500" : "border-slate-200",
                  )}
                />
                {errors.fullName && (
                  <p
                    role="alert"
                    className="mt-1.5 text-xs font-medium text-rose-600"
                  >
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="customer-email"
                  className="block text-sm font-medium text-slate-900"
                >
                  Alamat Email
                </label>
                <input
                  id="customer-email"
                  type="email"
                  autoComplete="email"
                  placeholder="Masukan Email Pelanggan"
                  aria-invalid={Boolean(errors.email)}
                  {...register("email")}
                  className={cn(
                    "mt-1.5 w-full rounded-xl border bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus-visible:outline-2 focus-visible:outline-[#252A86] sm:text-sm",
                    errors.email ? "border-rose-500" : "border-slate-200",
                  )}
                />
                {errors.email && (
                  <p
                    role="alert"
                    className="mt-1.5 text-xs font-medium text-rose-600"
                  >
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="customer-whatsapp"
                  className="block text-sm font-medium text-slate-900"
                >
                  Nomor Whatsapp
                </label>
                <input
                  id="customer-whatsapp"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="Masukan Nomor HP Pelanggan"
                  aria-invalid={Boolean(errors.whatsapp)}
                  {...register("whatsapp")}
                  className={cn(
                    "mt-1.5 w-full rounded-xl border bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus-visible:outline-2 focus-visible:outline-[#252A86] sm:text-sm",
                    errors.whatsapp ? "border-rose-500" : "border-slate-200",
                  )}
                />
                <p className="mt-1.5 text-xs text-slate-600">
                  Jika terjadi kendala, kami akan menghubungi ke nomor ini
                </p>
                {errors.whatsapp && (
                  <p
                    role="alert"
                    className="mt-1 text-xs font-medium text-rose-600"
                  >
                    {errors.whatsapp.message}
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>

        <div className="sticky bottom-0 z-20 -mx-5 mt-8 border-t border-slate-100 bg-white/95 px-5 pt-3.5 pb-1 backdrop-blur-xs">
          <Button type="submit" fullWidth>
            Lanjutkan
          </Button>
        </div>
      </form>
    </div>
  );
}
