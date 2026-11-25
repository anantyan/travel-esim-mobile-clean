import { StaticEsimRepository } from "@/data";
import {
  CreateOrderReceiptUseCase,
  GetEsimCatalogUseCase,
  GetEsimDetailUseCase,
} from "@/domain";
import { describe, expect, it } from "vitest";

describe("Domain Use Cases (Static eSIM Repository)", () => {
  const repository = new StaticEsimRepository();
  const getCatalog = new GetEsimCatalogUseCase(repository);
  const getDetail = new GetEsimDetailUseCase(repository);
  const createReceipt = new CreateOrderReceiptUseCase();

  it("returns full catalog when default filters are applied", async () => {
    const items = await getCatalog.execute();
    expect(items.length).toBeGreaterThanOrEqual(4);
    expect(items.some((item) => item.name === "eSIM Singapore")).toBe(true);
    expect(items.some((item) => item.name === "eSIM Indonesia")).toBe(true);
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
});
