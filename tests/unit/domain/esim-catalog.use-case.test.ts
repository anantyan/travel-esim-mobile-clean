import { StaticEsimRepository } from "@/data";
import {
  CreateOrderReceiptUseCase,
  GetEsimCatalogUseCase,
  GetEsimDetailUseCase,
  calculateVariantPriceIdr,
  esimCatalogFilterSchema,
} from "@/domain";
import { describe, expect, it } from "vitest";

describe("Domain Use Cases (Static eSIM Repository)", () => {
  const repository = new StaticEsimRepository();
  const getCatalog = new GetEsimCatalogUseCase(repository);
  const getDetail = new GetEsimDetailUseCase(repository);
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

  it("retrieves product detail by slug and computes deterministic receipt", async () => {
    const product = await getDetail.execute("esim-singapore");
    expect(product).not.toBeNull();
    if (!product) return;

    const methods = await repository.listPaymentMethods();
    const saldo = methods.find((m) => m.code === "SALDO");
    expect(saldo?.balanceIdr).toBe(200000);

    const bcaVa = methods.find((m) => m.code === "BCA_VA");
    expect(bcaVa).toBeDefined();
    if (!bcaVa) return;

    const fixedDate = new Date("2026-11-25T08:00:00.000Z");
    const receipt = createReceipt.execute(product, bcaVa, fixedDate);

    expect(receipt.totalPaidIdr).toBe(product.priceIdr + bcaVa.feeIdr);
    expect(receipt.referenceCode).toMatch(/^MKP-ESIM-/);
    expect(receipt.activationCode).toContain("LPA:1$esim.mkpmobile.id$");
    expect(receipt.purchasedAtIso).toBe(fixedDate.toISOString());
  });

  it("calculates deterministic variant pricing across data sizes and day tiers", () => {
    expect(calculateVariantPriceIdr(69000, "3GB", 7)).toBe(69000);
    expect(calculateVariantPriceIdr(69000, "10GB", 14)).toBe(164000);
    expect(calculateVariantPriceIdr(52000, "15GB", 30)).toBe(223000);
  });
});
