import { PaymentMethodPage } from "@/presentation/features/checkout/PaymentMethodPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/checkout/payment")({
  component: PaymentMethodPage,
});
