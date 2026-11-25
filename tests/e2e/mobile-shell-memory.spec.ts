import { expect, test } from "@playwright/test";

test.describe("Travel eSIM Full Journey, Collapsing Headers & Locked 430px Shell", () => {
  test("completes full end-to-end journey from Catalog through Detail, Order Form, Payment, and Masked Invoice on Mobile 375x812", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });
    page.on("pageerror", (err) => {
      consoleErrors.push(err.message);
    });

    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: "Travel eSIM" }),
    ).toBeVisible();
    await expect(page.getByTestId("catalog-pinned-header")).toHaveAttribute(
      "data-collapsed",
      "false",
    );

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(hasHorizontalOverflow).toBe(false);

    // Scroll catalog list down to trigger collapsing search bar + sticky filter strip
    await page.evaluate(() => window.scrollTo(0, 320));
    await expect(page.getByTestId("catalog-pinned-header")).toHaveAttribute(
      "data-collapsed",
      "true",
    );
    await expect(page.getByTestId("collapsed-search-trigger")).toBeVisible();

    // Quick-search button expands back to top
    await page.getByTestId("collapsed-search-trigger").click();
    await page.waitForFunction(() => window.scrollY < 40);
    await expect(page.getByTestId("catalog-pinned-header")).toHaveAttribute(
      "data-collapsed",
      "false",
    );

    // Filter by Region: Amerika -> Reset
    await page.getByTestId("filter-region-chip").click();
    await expect(page.getByTestId("region-filter-sheet")).toBeVisible();
    await page.getByRole("radio", { name: "Amerika" }).click();
    await page.getByRole("button", { name: "Terapkan" }).click();
    await expect(page).toHaveURL(/region=america/);
    await expect(page.getByText("eSIM USA")).toBeVisible();

    await page.getByTestId("filter-region-chip").click();
    await page
      .getByTestId("region-filter-sheet")
      .getByRole("button", { name: "Reset", exact: true })
      .click();
    await page.getByRole("button", { name: "Terapkan" }).click();
    await expect(page.getByText("eSIM Singapore")).toBeVisible();

    // Navigate to eSIM Singapore Detail & verify collapsing hero
    await page.getByTestId("esim-card-esim-singapore").click();
    await expect(page).toHaveURL(/\/products\/esim-singapore/);
    await expect(
      page.getByRole("heading", { name: "eSIM Singapore" }),
    ).toBeVisible();

    // Select 5GB + 07 Hari -> Rp93.000 (affordable via Saldo Rp200.000!)
    await page.getByRole("button", { name: "5GB", exact: true }).click();
    await page.getByRole("button", { name: "07", exact: true }).click();
    await expect(page.getByTestId("detail-dynamic-price")).toHaveText(
      "Rp93.000",
    );

    await page.evaluate(() => window.scrollTo(0, 260));
    await expect(page.getByTestId("detail-collapsing-header")).toHaveAttribute(
      "data-collapsed",
      "true",
    );

    // Proceed to Step 1: Detail Pemesan
    await page.getByRole("button", { name: "Pesan Sekarang" }).click();
    await expect(page).toHaveURL(/\/checkout\/order-detail/);
    await expect(
      page.getByRole("heading", { name: "Detail Pemesan" }),
    ).toBeVisible();
    await expect(page.getByText("5 GB")).toBeVisible();

    await page.getByLabel("Nama").fill("George lee");
    await page.getByLabel("Alamat Email").fill("george.lee@gmail.com");
    await page.getByLabel("Nomor Whatsapp").fill("081234569300");
    await page.getByRole("button", { name: "Lanjutkan" }).click();

    // Proceed to Step 2: Metode Pembayaran (Saldo Rp93.000 + Rp500 = Rp93.500)
    await expect(page).toHaveURL(/\/checkout\/payment/);
    await expect(
      page.getByRole("heading", { name: "Metode Pembayaran", exact: true }),
    ).toBeVisible();
    await expect(page.getByTestId("payment-total-amount")).toHaveText(
      "Rp93.500",
    );
    await page.getByRole("button", { name: "Lanjutkan" }).click();

    // Verify Invoice screen + Copy + Masked PII + Selesai
    await expect(page).toHaveURL(/\/checkout\/receipt/);
    await expect(page.getByRole("heading", { name: "Invoice" })).toBeVisible();
    await expect(page.getByTestId("invoice-total-paid")).toHaveText("Rp93.500");
    await expect(page.getByText("Berhasil")).toBeVisible();
    await expect(page.getByTestId("invoice-masked-whatsapp")).toHaveText(
      "********9300",
    );
    await expect(page.getByTestId("invoice-masked-email")).toHaveText(
      "*******lee@gmail.com",
    );

    await page.getByTestId("copy-invoice-button").click();
    await expect(page.getByText("Tersalin")).toBeVisible();

    await page.getByRole("button", { name: "Selesai", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: "Travel eSIM" }),
    ).toBeVisible();

    expect(consoleErrors).toEqual([]);
  });

  test("locks shell, collapsing header, and portal bottom sheet strictly to 430px on Desktop 1440x900 with low V8 Heap across navigation", async ({
    page,
    context,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");

    const shell = page.getByTestId("mobile-app-shell");
    const shellBox = await shell.boundingBox();
    expect(shellBox).not.toBeNull();
    if (shellBox) {
      expect(shellBox.width).toBeCloseTo(430, 0);
      expect(Math.abs(shellBox.x - (1440 - 430) / 2)).toBeLessThanOrEqual(2);
    }

    await page.getByTestId("filter-region-chip").click();
    const sheet = page.getByTestId("region-filter-sheet");
    await expect(sheet).toBeVisible();

    const sheetBox = await sheet.boundingBox();
    expect(sheetBox).not.toBeNull();
    if (sheetBox) {
      expect(sheetBox.width).toBeLessThanOrEqual(430);
      expect(Math.abs(sheetBox.x - (1440 - 430) / 2)).toBeLessThanOrEqual(2);
    }

    const cdp = await context.newCDPSession(page);
    await cdp.send("HeapProfiler.enable");
    await cdp.send("HeapProfiler.collectGarbage");

    const heapBefore = await page.evaluate(
      () =>
        (performance as unknown as { memory?: { usedJSHeapSize: number } })
          .memory?.usedJSHeapSize ?? 0,
    );

    for (let i = 0; i < 4; i++) {
      await page.goto("/products/esim-singapore");
      await page.getByRole("button", { name: "Pesan Sekarang" }).click();
      await expect(
        page.getByRole("heading", { name: "Detail Pemesan" }),
      ).toBeVisible();
      await page.goto("/");
    }

    await cdp.send("HeapProfiler.collectGarbage");
    const heapAfter = await page.evaluate(
      () =>
        (performance as unknown as { memory?: { usedJSHeapSize: number } })
          .memory?.usedJSHeapSize ?? 0,
    );

    if (heapBefore > 0 && heapAfter > 0) {
      const usedHeapMb = heapAfter / (1024 * 1024);
      const deltaMb = (heapAfter - heapBefore) / (1024 * 1024);
      expect(usedHeapMb).toBeLessThan(35);
      expect(deltaMb).toBeLessThan(10);
    }
  });
});
