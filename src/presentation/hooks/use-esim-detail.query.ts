import { container } from "@/core/di/container";
import { useQuery } from "@tanstack/react-query";

export const esimDetailKeys = {
  all: ["esim", "detail"] as const,
  bySlug: (slug: string) => [...esimDetailKeys.all, slug] as const,
};

export function useEsimDetailQuery(slug: string) {
  return useQuery({
    queryKey: esimDetailKeys.bySlug(slug),
    queryFn: ({ signal }) =>
      container.getEsimDetailUseCase.execute(slug, signal),
    enabled: slug.trim().length > 0,
  });
}
