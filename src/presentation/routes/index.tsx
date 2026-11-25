import { type EsimCatalogFilter, esimCatalogFilterSchema } from "@/domain";
import { TravelEsimCatalogPage } from "@/presentation/features/catalog/TravelEsimCatalogPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): EsimCatalogFilter =>
    esimCatalogFilterSchema.parse(search),
  component: CatalogRoutePage,
});

function CatalogRoutePage() {
  const filter = Route.useSearch();
  const navigate = Route.useNavigate();

  const handleFilterChange = (patch: Partial<EsimCatalogFilter>) => {
    void navigate({
      to: "/",
      search: (prev) => ({
        ...prev,
        ...patch,
      }),
      replace: true,
    });
  };

  const handleResetAll = () => {
    void navigate({
      to: "/",
      search: {
        search: "",
        region: "all",
        type: "all",
      },
      replace: true,
    });
  };

  return (
    <TravelEsimCatalogPage
      filter={filter}
      onFilterChange={handleFilterChange}
      onResetAll={handleResetAll}
    />
  );
}
