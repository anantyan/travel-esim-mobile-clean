import { formatActiveDays, formatRupiah } from "@/commons/utils/format";
import { describe, expect, it } from "vitest";

describe("format utilities", () => {
  it("formats IDR amounts in compact Rupiah style", () => {
    expect(formatRupiah(69000)).toBe("Rp69.000");
    expect(formatRupiah(52000)).toBe("Rp52.000");
    expect(formatRupiah(185000)).toBe("Rp185.000");
  });

  it("formats active days duration label", () => {
    expect(formatActiveDays(7)).toBe("7 Hari");
    expect(formatActiveDays(14)).toBe("14 Hari");
  });
});
