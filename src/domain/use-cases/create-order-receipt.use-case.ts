import type {
  EsimProduct,
  OrderReceipt,
  PaymentMethod,
} from "@/domain/entities/esim-product.entity";

/**
 * Creates a deterministic digital receipt summary for a completed eSIM purchase.
 */
export class CreateOrderReceiptUseCase {
  execute(
    product: EsimProduct,
    paymentMethod: PaymentMethod,
    issuedAt: Date = new Date(),
  ): OrderReceipt {
    const totalPaidIdr = product.priceIdr + paymentMethod.feeIdr;
    const epochCompact = issuedAt
      .getTime()
      .toString(36)
      .toUpperCase()
      .slice(-6);
    const slugCode = product.slug
      .replace(/[^a-z0-9]/gi, "")
      .toUpperCase()
      .slice(0, 4);

    return {
      referenceCode: `MKP-${slugCode}-${epochCompact}`,
      product,
      paymentMethod,
      totalPaidIdr,
      activationCode: `LPA:1$esim.mkpmobile.id$${slugCode}-${epochCompact}`,
      purchasedAtIso: issuedAt.toISOString(),
    };
  }
}
