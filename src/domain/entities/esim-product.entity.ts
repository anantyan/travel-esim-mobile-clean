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
}

export interface PaymentMethod {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly category: "ewallet" | "virtual_account" | "qris";
  readonly feeIdr: number;
  readonly description: string;
}

export interface OrderReceipt {
  readonly referenceCode: string;
  readonly product: EsimProduct;
  readonly paymentMethod: PaymentMethod;
  readonly totalPaidIdr: number;
  readonly activationCode: string;
  readonly purchasedAtIso: string;
}
