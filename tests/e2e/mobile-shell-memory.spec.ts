import { expect, test } from "@playwright/test";

test.describe("Travel eSIM Catalog, Bottom Sheets & Locked 430px Shell", () => {
  test("supports search, region/type bottom sheet filters, and detail navigation on Mobile 375x812", async ({
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
    await expect(page.getByText("eSIM Singapore")).toBeVisible();
    await expect(page.getByText("Rp69.000")).toBeVisible();
    await expect(page.getByText("eSIM Indonesia")).toBeVisible();
    await expect(page.getByText("Rp52.000")).toBeVisible();

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(hasHorizontalOverflow).toBe(false);

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

    // Filter by Type: Topupable
    await page.getByTestId("filter-type-chip").click();
    await expect(page.getByTestId("type-filter-sheet")).toBeVisible();
    await page.getByRole("radio", { name: "Topupable" }).click();
    await page.getByRole("button", { name: "Terapkan" }).click();

    await expect(page).toHaveURL(/type=topupable/);
    await expect(page.getByText("eSIM Indonesia")).toBeVisible();
    await expect(page.getByText("eSIM Singapore")).toBeHidden();

    // Navigate to product detail stub
    await page.getByTestId("esim-card-esim-indonesia").click();
    await expect(page).toHaveURL(/\/products\/esim-indonesia/);
    await expect(
      page.getByRole("heading", { name: "eSIM Indonesia" }),
    ).toBeVisible();

    expect(consoleErrors).toEqual([]);
  });

  test("locks both shell and portal bottom sheet strictly to 430px centered column on Desktop 1440x900 with low V8 Heap", async ({
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
