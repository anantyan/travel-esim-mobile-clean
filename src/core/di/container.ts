import { StaticEsimRepository } from "@/data";
import {
  CreateOrderReceiptUseCase,
  GetEsimCatalogUseCase,
  GetEsimDetailUseCase,
} from "@/domain";

const esimRepository = new StaticEsimRepository();

export const container = {
  esimRepository,
  getEsimCatalogUseCase: new GetEsimCatalogUseCase(esimRepository),
  getEsimDetailUseCase: new GetEsimDetailUseCase(esimRepository),
  createOrderReceiptUseCase: new CreateOrderReceiptUseCase(),
} as const;
