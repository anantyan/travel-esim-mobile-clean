import type { EsimRegion, EsimRegionFilter, EsimTypeFilter } from "@/domain";

export const REGION_OPTIONS: ReadonlyArray<{
  readonly value: EsimRegionFilter;
  readonly label: string;
}> = [
  { value: "all", label: "Semua Region" },
  { value: "asia", label: "Asia" },
  { value: "america", label: "Amerika" },
  { value: "oceania", label: "Oseania" },
  { value: "europe", label: "Eropa" },
  { value: "africa", label: "Afrika" },
];

export const PRODUCT_TYPE_OPTIONS: ReadonlyArray<{
  readonly value: EsimTypeFilter;
  readonly label: string;
}> = [
  { value: "all", label: "Semua Jenis" },
  { value: "instant", label: "Instants" },
  { value: "topupable", label: "Topupable" },
];

export const REGION_DISPLAY_LABELS: Record<EsimRegion, string> = {
  asia: "Region Asia",
  america: "Region America",
  oceania: "Region Oceania",
  europe: "Region Europe",
  africa: "Region Africa",
};

export function getRegionFilterLabel(value: EsimRegionFilter): string {
  return (
    REGION_OPTIONS.find((option) => option.value === value)?.label ??
    "Semua Region"
  );
}

export function getTypeFilterLabel(value: EsimTypeFilter): string {
  return (
    PRODUCT_TYPE_OPTIONS.find((option) => option.value === value)?.label ??
    "Semua Jenis"
  );
}
