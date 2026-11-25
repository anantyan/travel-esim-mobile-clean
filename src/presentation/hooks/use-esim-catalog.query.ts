import { container } from "@/core/di/container";
import type { EsimCatalogFilterInput } from "@/domain";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const esimCatalogKeys = {
  all: ["esim", "catalog"] as const,
  list: (filter: EsimCatalogFilterInput) =>
    [...esimCatalogKeys.all, filter] as const,
};

export function useEsimCatalogQuery(filter: EsimCatalogFilterInput = {}) {
  return useQuery({
    queryKey: esimCatalogKeys.list(filter),
    queryFn: ({ signal }) =>
      container.getEsimCatalogUseCase.execute(filter, signal),
    placeholderData: keepPreviousData,
  });
}
