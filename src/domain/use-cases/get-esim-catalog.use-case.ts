import type { EsimProduct } from "@/domain/entities/esim-product.entity";
import type { EsimRepository } from "@/domain/repositories/esim.repository";
import {
  type EsimCatalogFilterInput,
  esimCatalogFilterSchema,
} from "@/domain/schemas/esim-filter.schema";

/**
 * Pure domain use case that validates catalog filter parameters via Zod
 * and delegates retrieval to the abstract EsimRepository port.
 */
export class GetEsimCatalogUseCase {
  constructor(private readonly repository: EsimRepository) {}

  async execute(
    rawFilter: EsimCatalogFilterInput = {},
    signal?: AbortSignal,
  ): Promise<readonly EsimProduct[]> {
    const validatedFilter = esimCatalogFilterSchema.parse(rawFilter);
    return this.repository.findAll(validatedFilter, signal);
  }
}
