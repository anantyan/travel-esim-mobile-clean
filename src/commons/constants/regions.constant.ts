import type { EsimRegionFilter, EsimTypeFilter } from "@/domain";

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
