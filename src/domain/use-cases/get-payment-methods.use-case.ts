import type { PaymentMethod } from "@/domain/entities/esim-product.entity";
import type { EsimRepository } from "@/domain/repositories/esim.repository";

/**
 * Retrieves available payment methods from the repository port.
 */
export class GetPaymentMethodsUseCase {
  constructor(private readonly repository: EsimRepository) {}

  async execute(signal?: AbortSignal): Promise<readonly PaymentMethod[]> {
    return this.repository.listPaymentMethods(signal);
  }
}
