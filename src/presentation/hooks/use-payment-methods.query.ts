import { container } from "@/core/di/container";
import { useQuery } from "@tanstack/react-query";

export const paymentMethodKeys = {
  all: ["esim", "payment-methods"] as const,
};

export function usePaymentMethodsQuery() {
  return useQuery({
    queryKey: paymentMethodKeys.all,
    queryFn: ({ signal }) => container.getPaymentMethodsUseCase.execute(signal),
  });
}
