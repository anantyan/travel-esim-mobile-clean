import { ProductDetailPage } from "@/presentation/features/detail/ProductDetailPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/products/$slug")({
  component: ProductDetailRoute,
});

function ProductDetailRoute() {
  const { slug } = Route.useParams();
  return <ProductDetailPage slug={slug} />;
}
