import { StaticEsimRepository } from "@/data";
import {
  CreateOrderReceiptUseCase,
  GetEsimCatalogUseCase,
  GetEsimDetailUseCase,
  GetPaymentMethodsUseCase,
} from "@/domain";

const esimRepository = new StaticEsimRepository();

export const container = {
  esimRepository,
  getEsimCatalogUseCase: new GetEsimCatalogUseCase(esimRepository),
  getEsimDetailUseCase: new GetEsimDetailUseCase(esimRepository),
  getPaymentMethodsUseCase: new GetPaymentMethodsUseCase(esimRepository),
  createOrderReceiptUseCase: new CreateOrderReceiptUseCase(),
} as const;
