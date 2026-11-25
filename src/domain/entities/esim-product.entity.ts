export type EsimRegion = "asia" | "america" | "oceania" | "europe" | "africa";

export type EsimProductType = "instant" | "topupable";

export interface EsimProduct {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly region: EsimRegion;
  readonly type: EsimProductType;
  readonly quotaLabel: string;
  readonly activeDays: number;
  readonly priceIdr: number;
  readonly description: string;
  readonly imageUrl: string;
  readonly features: readonly string[];
  readonly coverageCountries: readonly string[];
  readonly galleryUrls: readonly string[];
  readonly dataSizeOptions: readonly string[];
  readonly dayOptions: readonly number[];
}

export interface PaymentMethod {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly category: "balance" | "virtual_account" | "ewallet" | "qris";
  readonly feeIdr: number;
  readonly balanceIdr?: number;
  readonly description: string;
}

export interface ReceiptCustomerSnapshot {
  readonly fullName: string;
  readonly email: string;
  readonly whatsapp: string;
  readonly maskedEmail: string;
  readonly maskedWhatsapp: string;
}

export interface OrderReceipt {
  readonly invoiceNumber: string;
  readonly referenceNumber: string;
  readonly referenceCode: string;
  readonly product: EsimProduct;
  readonly paymentMethod: PaymentMethod;
  readonly selectedDataSize: string;
  readonly selectedDays: number;
  readonly quantity: number;
  readonly customer: ReceiptCustomerSnapshot;
  readonly packagePriceIdr: number;
  readonly feeIdr: number;
  readonly totalPaidIdr: number;
  readonly transactionDateLabel: string;
  readonly transactionTimeWibLabel: string;
  readonly activationCode: string;
  readonly purchasedAtIso: string;
}
