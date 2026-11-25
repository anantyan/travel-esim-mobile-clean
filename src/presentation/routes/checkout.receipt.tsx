import { InvoiceReceiptPage } from "@/presentation/features/checkout/InvoiceReceiptPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/checkout/receipt")({
  component: InvoiceReceiptPage,
});
