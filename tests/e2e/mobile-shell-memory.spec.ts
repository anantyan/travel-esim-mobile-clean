import { expect, test } from "@playwright/test";

test.describe("Travel eSIM Collapsing Headers, Bottom Sheets & Locked 430px Shell", () => {
  test("supports catalog scroll collapse, bottom sheets, detail hero collapse, and variant checkout on Mobile 375x812", async ({
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

    const headerBox = await page
      .getByTestId("catalog-pinned-header")
      .boundingBox();
    expect(headerBox).not.toBeNull();
    if (headerBox) {
      expect(headerBox.y).toBeLessThanOrEqual(1);
    }

    // Quick-search button smoothly expands back to top
    await page.getByTestId("collapsed-search-trigger").click();
    await page.waitForFunction(() => window.scrollY < 40);
    await expect(page.getByTestId("catalog-pinned-header")).toHaveAttribute(
      "data-collapsed",
      "false",
    );

    // Filter by Region: Amerika
    await page.getByTestId("filter-region-chip").click();
    await expect(page.getByTestId("region-filter-sheet")).toBeVisible();
    await page.getByRole("radio", { name: "Amerika" }).click();
    await page.getByRole("button", { name: "Terapkan" }).click();

    await expect(page).toHaveURL(/region=america/);
    await expect(page.getByText("eSIM USA")).toBeVisible();
    await expect(page.getByText("eSIM Singapore")).toBeHidden();

    // Reset Region filter
    await page.getByTestId("filter-region-chip").click();
    await page
      .getByTestId("region-filter-sheet")
      .getByRole("button", { name: "Reset", exact: true })
      .click();
    await page.getByRole("button", { name: "Terapkan" }).click();
    await expect(page.getByText("eSIM Singapore")).toBeVisible();

    // Navigate to eSIM Singapore product detail
    await page.getByTestId("esim-card-esim-singapore").click();
    await expect(page).toHaveURL(/\/products\/esim-singapore/);
    await expect(
      page.getByRole("heading", { name: "eSIM Singapore" }),
    ).toBeVisible();
    await expect(page.getByTestId("detail-collapsing-header")).toHaveAttribute(
      "data-collapsed",
      "false",
    );

    // Select 10GB + 14 Hari and verify dynamic price
    await page.getByRole("button", { name: "10GB" }).click();
    await page.getByRole("button", { name: "14" }).click();
    await expect(page.getByTestId("detail-dynamic-price")).toHaveText(
      "Rp164.000",
    );

    // Scroll detail page to collapse hero into solid #252A86 app bar
    await page.evaluate(() => window.scrollTo(0, 260));
    await expect(page.getByTestId("detail-collapsing-header")).toHaveAttribute(
      "data-collapsed",
      "true",
    );

    // Proceed via Pesan Sekarang CTA to Phase 4 stub
    await page.getByRole("button", { name: "Pesan Sekarang" }).click();
    await expect(page).toHaveURL(/\/checkout\/order-detail/);
    await expect(
      page.getByRole("heading", { name: "Detail Pemesan" }),
    ).toBeVisible();
    await expect(page.getByText("10GB")).toBeVisible();

    expect(consoleErrors).toEqual([]);
  });

  test("locks shell, collapsing header, and portal bottom sheet strictly to 430px centered column on Desktop 1440x900 with low V8 Heap", async ({
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

    // Open Pilih Region bottom sheet on desktop and ensure it stays inside the 430px shell
    await page.getByTestId("filter-region-chip").click();
    const sheet = page.getByTestId("region-filter-sheet");
    await expect(sheet).toBeVisible();

    const sheetBox = await sheet.boundingBox();
    expect(sheetBox).not.toBeNull();
    if (sheetBox) {
      expect(sheetBox.width).toBeLessThanOrEqual(430);
      expect(Math.abs(sheetBox.x - (1440 - 430) / 2)).toBeLessThanOrEqual(2);
    }

    // Verify fixed detail collapsing header stays locked to 430px on desktop
    await page.goto("/products/esim-singapore");
    const detailHeaderBox = await page
      .getByTestId("detail-collapsing-header")
      .boundingBox();
    expect(detailHeaderBox).not.toBeNull();
    if (detailHeaderBox) {
      expect(detailHeaderBox.width).toBeCloseTo(430, 0);
      expect(
        Math.abs(detailHeaderBox.x - (1440 - 430) / 2),
      ).toBeLessThanOrEqual(2);
    }

    const cdp = await context.newCDPSession(page);
    await cdp.send("HeapProfiler.enable");
    await cdp.send("HeapProfiler.collectGarbage");

    const usedHeapBytes = await page.evaluate(
      () =>
        (performance as unknown as { memory?: { usedJSHeapSize: number } })
          .memory?.usedJSHeapSize ?? 0,
    );

    if (usedHeapBytes > 0) {
      const usedHeapMb = usedHeapBytes / (1024 * 1024);
      expect(usedHeapMb).toBeLessThan(35);
    }
  });
});
