import { OrderDetailPage } from "@/presentation/features/checkout/OrderDetailPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/checkout/order-detail")({
  component: OrderDetailPage,
});
