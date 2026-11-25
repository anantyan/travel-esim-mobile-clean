import type {
  RawEsimProductDto,
  RawPaymentMethodDto,
} from "@/data/datasources/esim-static.datasource";
import type {
  EsimProduct,
  PaymentMethod,
} from "@/domain/entities/esim-product.entity";

export function mapRawProductToEntity(dto: RawEsimProductDto): EsimProduct {
  return {
    id: dto.id,
    slug: dto.slug,
    name: dto.name,
    region: dto.region,
    type: dto.type,
    quotaLabel: dto.quota_label,
    activeDays: dto.active_days,
    priceIdr: dto.price_idr,
    description: dto.description,
    imageUrl: dto.image_url,
    features: dto.features,
    coverageCountries: dto.coverage_countries,
    galleryUrls: dto.gallery_urls,
    dataSizeOptions: dto.data_size_options,
    dayOptions: dto.day_options,
  };
}

export function mapRawPaymentMethodToEntity(
  dto: RawPaymentMethodDto,
): PaymentMethod {
  return {
    id: dto.id,
    code: dto.code,
    name: dto.name,
    category: dto.category,
    feeIdr: dto.fee_idr,
    balanceIdr: dto.balance_idr,
    description: dto.description,
  };
}
