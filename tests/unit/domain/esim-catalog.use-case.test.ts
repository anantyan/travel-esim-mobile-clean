import { StaticEsimRepository } from "@/data";
import {
  CreateOrderReceiptUseCase,
  GetEsimCatalogUseCase,
  GetEsimDetailUseCase,
  GetPaymentMethodsUseCase,
  calculateVariantPriceIdr,
  customerInfoSchema,
  esimCatalogFilterSchema,
  maskEmailAddress,
  maskWhatsappNumber,
} from "@/domain";
import { describe, expect, it } from "vitest";

describe("Domain Use Cases (Static eSIM Repository)", () => {
  const repository = new StaticEsimRepository();
  const getCatalog = new GetEsimCatalogUseCase(repository);
  const getDetail = new GetEsimDetailUseCase(repository);
  const getPaymentMethods = new GetPaymentMethodsUseCase(repository);
  const createReceipt = new CreateOrderReceiptUseCase();

  it("returns full catalog when default filters are applied", async () => {
    const items = await getCatalog.execute();
    expect(items).toHaveLength(7);
    expect(items[0]?.name).toBe("eSIM Singapore");
    expect(items[1]?.name).toBe("eSIM Indonesia");
    expect(items[0]?.coverageCountries).toContain("Singapore");
    expect(items[0]?.dataSizeOptions).toEqual(["3GB", "5GB", "10GB", "15GB"]);
    expect(items[0]?.dayOptions).toEqual([7, 14, 24, 30]);
  });

  it("recovers cleanly when invalid region or type query params are parsed", () => {
    const parsed = esimCatalogFilterSchema.parse({
      search: "  bali ",
      region: "mars",
      type: "invalid_type",
    });
    expect(parsed).toEqual({
      search: "bali",
      region: "all",
      type: "all",
    });
  });

  it("filters by region, product type, and search keyword", async () => {
    const asiaTopup = await getCatalog.execute({
      region: "asia",
      type: "topupable",
    });
    expect(
      asiaTopup.every((p) => p.region === "asia" && p.type === "topupable"),
    ).toBe(true);
    expect(asiaTopup.some((p) => p.slug === "esim-indonesia")).toBe(true);

    const searchResult = await getCatalog.execute({ search: "singapore" });
    expect(searchResult).toHaveLength(1);
    expect(searchResult[0]?.slug).toBe("esim-singapore");
  });

  it("aborts cleanly when AbortSignal is already aborted", async () => {
    const controller = new AbortController();
    controller.abort();

    await expect(getCatalog.execute({}, controller.signal)).rejects.toThrow();
  });

  it("retrieves product detail, payment methods, and computes masked receipt", async () => {
    const product = await getDetail.execute("esim-singapore");
    expect(product).not.toBeNull();
    if (!product) return;

    const methods = await getPaymentMethods.execute();
    const saldo = methods.find((m) => m.code === "SALDO");
    expect(saldo?.balanceIdr).toBe(200000);

    const bcaVa = methods.find((m) => m.code === "BCA_VA");
    expect(bcaVa).toBeDefined();
    if (!bcaVa) return;

    const fixedDate = new Date("2026-11-25T08:03:09.000Z");
    const receipt = createReceipt.execute(product, bcaVa, fixedDate, {
      selectedDataSize: "5GB",
      selectedDays: 7,
      packagePriceIdr: 93000,
      customer: {
        fullName: "George lee",
        email: "george.lee@gmail.com",
        whatsapp: "081234569300",
      },
    });

    expect(receipt.packagePriceIdr).toBe(93000);
    expect(receipt.feeIdr).toBe(bcaVa.feeIdr);
    expect(receipt.totalPaidIdr).toBe(93000 + bcaVa.feeIdr);
    expect(receipt.invoiceNumber).toMatch(/^INV-\d{11}$/);
    expect(receipt.referenceCode).toMatch(/^MKP-ESIM-/);
    expect(receipt.transactionTimeWibLabel).toBe("15:03:09 WIB");
    expect(receipt.customer.maskedWhatsapp).toBe("********9300");
    expect(receipt.customer.maskedEmail).toBe("*******lee@gmail.com");
    expect(receipt.activationCode).toContain("LPA:1$esim.mkpmobile.id$");
    expect(receipt.purchasedAtIso).toBe(fixedDate.toISOString());
  });

  it("calculates deterministic variant pricing across data sizes and day tiers", () => {
    expect(calculateVariantPriceIdr(69000, "3GB", 7)).toBe(69000);
    expect(calculateVariantPriceIdr(69000, "10GB", 14)).toBe(164000);
    expect(calculateVariantPriceIdr(52000, "15GB", 30)).toBe(223000);
  });

  it("validates customer info schema and masks contact PII deterministically", () => {
    const valid = customerInfoSchema.parse({
      fullName: "  George lee  ",
      email: "george.lee@gmail.com",
      whatsapp: "0812-3456-9300",
    });
    expect(valid).toEqual({
      fullName: "George lee",
      email: "george.lee@gmail.com",
      whatsapp: "081234569300",
    });

    expect(maskWhatsappNumber("081234569300")).toBe("********9300");
    expect(maskEmailAddress("george.lee@gmail.com")).toBe(
      "*******lee@gmail.com",
    );
  });
});
