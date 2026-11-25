const DATA_SIZE_MULTIPLIER: Record<string, number> = {
  "3GB": 1,
  "5GB": 1.35,
  "10GB": 1.9,
  "15GB": 2.45,
};

const DAY_MULTIPLIER: Record<number, number> = {
  7: 1,
  14: 1.25,
  24: 1.5,
  30: 1.75,
};

/**
 * Computes deterministic variant pricing from the package baseline (3GB / 7 Hari)
 * rounded cleanly to the nearest Rp1.000.
 */
export function calculateVariantPriceIdr(
  basePriceIdr: number,
  dataSize: string,
  activeDays: number,
): number {
  const dataFactor = DATA_SIZE_MULTIPLIER[dataSize] ?? 1;
  const dayFactor = DAY_MULTIPLIER[activeDays] ?? 1;
  const rawPrice = basePriceIdr * dataFactor * dayFactor;
  return Math.round(rawPrice / 1000) * 1000;
}
