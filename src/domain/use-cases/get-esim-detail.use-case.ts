import type { EsimProduct } from "@/domain/entities/esim-product.entity";
import type { EsimRepository } from "@/domain/repositories/esim.repository";

/**
 * Retrieves a single eSIM product detail by its URL slug.
 */
export class GetEsimDetailUseCase {
  constructor(private readonly repository: EsimRepository) {}

  async execute(
    slug: string,
    signal?: AbortSignal,
  ): Promise<EsimProduct | null> {
    const normalizedSlug = slug.trim().toLowerCase();
    if (!normalizedSlug) {
      return null;
    }
    return this.repository.findBySlug(normalizedSlug, signal);
  }
}
