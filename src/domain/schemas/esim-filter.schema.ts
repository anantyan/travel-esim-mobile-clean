import { z } from "zod";

export const esimRegionFilterSchema = z.enum([
  "all",
  "asia",
  "america",
  "oceania",
  "europe",
  "africa",
]);

export const esimTypeFilterSchema = z.enum(["all", "instant", "topupable"]);

export const esimCatalogFilterSchema = z.object({
  search: z.string().trim().max(80).default(""),
  region: esimRegionFilterSchema.default("all"),
  type: esimTypeFilterSchema.default("all"),
});

export type EsimRegionFilter = z.infer<typeof esimRegionFilterSchema>;
export type EsimTypeFilter = z.infer<typeof esimTypeFilterSchema>;
export type EsimCatalogFilter = z.infer<typeof esimCatalogFilterSchema>;
export type EsimCatalogFilterInput = z.input<typeof esimCatalogFilterSchema>;
