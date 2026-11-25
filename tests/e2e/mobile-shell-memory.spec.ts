import { expect, test } from "@playwright/test";

test.describe("Locked Mobile Shell & Ultra-Low Browser RAM Verification", () => {
  test("renders centered Hello World cleanly on Mobile 375x812 without horizontal overflow or console errors", async ({
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

    const heading = page.getByRole("heading", { name: "Hello World" });
    await expect(heading).toBeVisible();

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(hasHorizontalOverflow).toBe(false);

    const shell = page.getByTestId("mobile-app-shell");
    const shellBox = await shell.boundingBox();
    expect(shellBox).not.toBeNull();
    if (shellBox) {
      expect(shellBox.width).toBeLessThanOrEqual(375);
    }

    expect(consoleErrors).toEqual([]);
  });

  test("stays strictly locked to 430px centered mobile column on Desktop 1440x900 with low V8 JS Heap", async ({
    page,
    context,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");

    const heading = page.getByRole("heading", { name: "Hello World" });
    await expect(heading).toBeVisible();

    const shell = page.getByTestId("mobile-app-shell");
    const shellBox = await shell.boundingBox();
    expect(shellBox).not.toBeNull();
    if (shellBox) {
      expect(shellBox.width).toBeCloseTo(430, 0);
      const expectedLeft = (1440 - 430) / 2;
      expect(Math.abs(shellBox.x - expectedLeft)).toBeLessThanOrEqual(2);
    }

    const headingBox = await heading.boundingBox();
    expect(headingBox).not.toBeNull();
    if (headingBox) {
      const headingCenterX = headingBox.x + headingBox.width / 2;
      const headingCenterY = headingBox.y + headingBox.height / 2;
      expect(Math.abs(headingCenterX - 720)).toBeLessThanOrEqual(8);
      expect(headingCenterY).toBeGreaterThan(250);
      expect(headingCenterY).toBeLessThan(650);
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
