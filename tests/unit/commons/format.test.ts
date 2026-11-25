import {
  getRegionFilterLabel,
  getTypeFilterLabel,
} from "@/commons/constants/regions.constant";
import {
  formatActiveDays,
  formatOrderDateDdMmYyyy,
  formatQuotaSpaced,
  formatRupiah,
  formatRupiahWithCents,
} from "@/commons/utils/format";
import { describe, expect, it } from "vitest";

describe("format and constant utilities", () => {
  it("formats IDR amounts in compact and decimal Rupiah styles", () => {
    expect(formatRupiah(69000)).toBe("Rp69.000");
    expect(formatRupiah(52000)).toBe("Rp52.000");
    expect(formatRupiahWithCents(32000)).toBe("Rp32.000,00");
    expect(formatRupiahWithCents(500)).toBe("Rp500,00");
  });

  it("formats active days, quota spacing, and order dates", () => {
    expect(formatActiveDays(7)).toBe("7 Hari");
    expect(formatQuotaSpaced("3GB")).toBe("3 GB");
    expect(formatQuotaSpaced("10GB")).toBe("10 GB");
    expect(formatOrderDateDdMmYyyy(new Date("2026-11-25T10:00:00"))).toBe(
      "25-11-2026",
    );
  });

  it("resolves human-readable labels for region and type filters", () => {
    expect(getRegionFilterLabel("all")).toBe("Semua Region");
    expect(getRegionFilterLabel("america")).toBe("Amerika");
    expect(getTypeFilterLabel("all")).toBe("Semua Jenis");
    expect(getTypeFilterLabel("instant")).toBe("Instants");
    expect(getTypeFilterLabel("topupable")).toBe("Topupable");
  });
});
