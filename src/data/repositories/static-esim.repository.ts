import {
  STATIC_ESIM_PRODUCTS,
  STATIC_PAYMENT_METHODS,
} from "@/data/datasources/esim-static.datasource";
import {
  mapRawPaymentMethodToEntity,
  mapRawProductToEntity,
} from "@/data/mappers/esim.mapper";
import type {
  EsimProduct,
  PaymentMethod,
} from "@/domain/entities/esim-product.entity";
import type { EsimRepository } from "@/domain/repositories/esim.repository";
import type { EsimCatalogFilter } from "@/domain/schemas/esim-filter.schema";

/**
 * In-memory static repository satisfying the EsimRepository contract
 * with zero HTTP client overhead for Ultra-Low Browser RAM operation.
 */
export class StaticEsimRepository implements EsimRepository {
  private readonly products: readonly EsimProduct[] = STATIC_ESIM_PRODUCTS.map(
    mapRawProductToEntity,
  );
  private readonly paymentMethods: readonly PaymentMethod[] =
    STATIC_PAYMENT_METHODS.map(mapRawPaymentMethodToEntity);

  async findAll(
    filter: EsimCatalogFilter,
    signal?: AbortSignal,
  ): Promise<readonly EsimProduct[]> {
    signal?.throwIfAborted();

    const normalizedSearch = filter.search.trim().toLowerCase();

    return this.products.filter((item) => {
      if (filter.region !== "all" && item.region !== filter.region) {
        return false;
      }
      if (filter.type !== "all" && item.type !== filter.type) {
        return false;
      }
      if (normalizedSearch.length > 0) {
        const matchesName = item.name.toLowerCase().includes(normalizedSearch);
        const matchesRegion = item.region
          .toLowerCase()
          .includes(normalizedSearch);
        const matchesQuota = item.quotaLabel
          .toLowerCase()
          .includes(normalizedSearch);
        return matchesName || matchesRegion || matchesQuota;
      }
      return true;
    });
  }

  async findBySlug(
    slug: string,
    signal?: AbortSignal,
  ): Promise<EsimProduct | null> {
    signal?.throwIfAborted();
    return this.products.find((item) => item.slug === slug) ?? null;
  }

  async listPaymentMethods(
    signal?: AbortSignal,
  ): Promise<readonly PaymentMethod[]> {
    signal?.throwIfAborted();
    return this.paymentMethods;
  }
}
