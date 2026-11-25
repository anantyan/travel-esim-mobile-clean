import { REGION_DISPLAY_LABELS } from "@/commons/constants/regions.constant";
import { formatRupiah } from "@/commons/utils/format";
import type { EsimProduct } from "@/domain";
import {
  CreditCard,
  GlobeHemisphereEast,
  Lightning,
} from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

export interface EsimProductCardProps {
  product: EsimProduct;
}

export function EsimProductCard({ product }: EsimProductCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <Link
      to="/products/$slug"
      params={{ slug: product.slug }}
      data-testid={`esim-card-${product.slug}`}
      className="group flex flex-col rounded-[20px] border border-slate-200/75 bg-white p-2.5 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)] transition-transform duration-150 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#252A86]"
    >
      <div className="relative aspect-[4/4.5] w-full overflow-hidden rounded-[14px] bg-slate-100">
        {imageError ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 bg-[#EEF0FF] text-[#252A86]">
            <GlobeHemisphereEast
              size={32}
              weight="duotone"
              aria-hidden="true"
            />
            <span className="text-[11px] font-semibold tracking-tight">
              {product.coverageCountries[0] ?? product.name}
            </span>
          </div>
        ) : (
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            onError={() => setImageError(true)}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        )}
      </div>

      <h2 className="mt-2.5 line-clamp-1 text-[15px] font-bold tracking-tight text-slate-900">
        {product.name}
      </h2>

      <p className="mt-0.5 text-xs text-slate-400">
        {REGION_DISPLAY_LABELS[product.region]}
      </p>

      <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-slate-800">
        {product.type === "instant" ? (
          <>
            <Lightning
              size={14}
              weight="regular"
              className="shrink-0 text-[#252A86]"
              aria-hidden="true"
            />
            <span>Instant</span>
          </>
        ) : (
          <>
            <CreditCard
              size={14}
              weight="regular"
              className="shrink-0 text-[#252A86]"
              aria-hidden="true"
            />
            <span>Topupable</span>
          </>
        )}
      </div>

      <p className="mt-2.5 font-sans text-[15px] font-extrabold tracking-tight text-[#252A86]">
        {formatRupiah(product.priceIdr)}
      </p>
    </Link>
  );
}
