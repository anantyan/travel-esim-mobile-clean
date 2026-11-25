import type {
  EsimProduct,
  OrderReceipt,
  PaymentMethod,
} from "@/domain/entities/esim-product.entity";
import type { CustomerInfo } from "@/domain/schemas/customer-info.schema";
import {
  maskEmailAddress,
  maskWhatsappNumber,
} from "@/domain/use-cases/mask-customer-contact";

export interface CreateReceiptDetails {
  readonly selectedDataSize?: string;
  readonly selectedDays?: number;
  readonly packagePriceIdr?: number;
  readonly customer?: CustomerInfo;
}

function formatWibDateLabel(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(date);
}

function formatWibTimeLabel(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Jakarta",
  }).format(date);
  return `${parts} WIB`;
}

/**
 * Creates a deterministic digital receipt summary for a completed eSIM purchase.
 */
export class CreateOrderReceiptUseCase {
  execute(
    product: EsimProduct,
    paymentMethod: PaymentMethod,
    issuedAt: Date = new Date(),
    details: CreateReceiptDetails = {},
  ): OrderReceipt {
    const packagePriceIdr = details.packagePriceIdr ?? product.priceIdr;
    const feeIdr = paymentMethod.feeIdr;
    const totalPaidIdr = packagePriceIdr + feeIdr;

    const epochCompact = issuedAt
      .getTime()
      .toString(36)
      .toUpperCase()
      .slice(-6);
    const slugCode = product.slug
      .replace(/[^a-z0-9]/gi, "")
      .toUpperCase()
      .slice(0, 4);

    const epochDigits = String(issuedAt.getTime());
    const invoiceDigits = epochDigits.slice(-8).padStart(11, "0");
    const referenceNumber = `${epochDigits.slice(0, 6)}${epochDigits.slice(-8)}`;

    const rawCustomer = details.customer ?? {
      fullName: "Pelanggan MKP",
      email: "customer@mkpmobile.id",
      whatsapp: "081200000000",
    };

    return {
      invoiceNumber: `INV-${invoiceDigits}`,
      referenceNumber,
      referenceCode: `MKP-${slugCode}-${epochCompact}`,
      product,
      paymentMethod,
      selectedDataSize: details.selectedDataSize ?? product.quotaLabel,
      selectedDays: details.selectedDays ?? product.activeDays,
      quantity: 1,
      customer: {
        fullName: rawCustomer.fullName,
        email: rawCustomer.email,
        whatsapp: rawCustomer.whatsapp,
        maskedEmail: maskEmailAddress(rawCustomer.email),
        maskedWhatsapp: maskWhatsappNumber(rawCustomer.whatsapp),
      },
      packagePriceIdr,
      feeIdr,
      totalPaidIdr,
      transactionDateLabel: formatWibDateLabel(issuedAt),
      transactionTimeWibLabel: formatWibTimeLabel(issuedAt),
      activationCode: `LPA:1$esim.mkpmobile.id$${slugCode}-${epochCompact}`,
      purchasedAtIso: issuedAt.toISOString(),
    };
  }
}
