import type {
  EsimProduct,
  PaymentMethod,
} from "@/domain/entities/esim-product.entity";
import type { EsimCatalogFilter } from "@/domain/schemas/esim-filter.schema";

export interface EsimRepository {
  findAll(
    filter: EsimCatalogFilter,
    signal?: AbortSignal,
  ): Promise<readonly EsimProduct[]>;
  findBySlug(slug: string, signal?: AbortSignal): Promise<EsimProduct | null>;
  listPaymentMethods(signal?: AbortSignal): Promise<readonly PaymentMethod[]>;
}
