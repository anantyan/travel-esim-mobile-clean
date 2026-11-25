import type { OrderReceipt } from "@/domain";
import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";

export interface SelectedVariantPayload {
  slug: string;
  dataSize: string;
  days: number;
  priceIdr: number;
}

interface CheckoutFlowState {
  selectedProductSlug: string | null;
  selectedDataSize: string | null;
  selectedDays: number | null;
  computedPriceIdr: number | null;
  selectedPaymentMethodId: string | null;
  latestReceipt: OrderReceipt | null;
  setSelectedProductSlug: (slug: string | null) => void;
  setSelectedVariant: (payload: SelectedVariantPayload) => void;
  setSelectedPaymentMethodId: (id: string | null) => void;
  setLatestReceipt: (receipt: OrderReceipt | null) => void;
  resetCheckoutFlow: () => void;
}

/**
 * Ephemeral in-memory Zustand v5 store for the eSIM checkout journey.
 * Never persisted to localStorage to keep memory and storage footprint minimal.
 */
export const useCheckoutFlowStore = create<CheckoutFlowState>()((set) => ({
  selectedProductSlug: null,
  selectedDataSize: null,
  selectedDays: null,
  computedPriceIdr: null,
  selectedPaymentMethodId: null,
  latestReceipt: null,
  setSelectedProductSlug: (selectedProductSlug) => set({ selectedProductSlug }),
  setSelectedVariant: ({ slug, dataSize, days, priceIdr }) =>
    set({
      selectedProductSlug: slug,
      selectedDataSize: dataSize,
      selectedDays: days,
      computedPriceIdr: priceIdr,
    }),
  setSelectedPaymentMethodId: (selectedPaymentMethodId) =>
    set({ selectedPaymentMethodId }),
  setLatestReceipt: (latestReceipt) => set({ latestReceipt }),
  resetCheckoutFlow: () =>
    set({
      selectedProductSlug: null,
      selectedDataSize: null,
      selectedDays: null,
      computedPriceIdr: null,
      selectedPaymentMethodId: null,
      latestReceipt: null,
    }),
}));

export const useCheckoutSelection = () =>
  useCheckoutFlowStore(
    useShallow((state) => ({
      selectedProductSlug: state.selectedProductSlug,
      selectedDataSize: state.selectedDataSize,
      selectedDays: state.selectedDays,
      computedPriceIdr: state.computedPriceIdr,
      selectedPaymentMethodId: state.selectedPaymentMethodId,
      latestReceipt: state.latestReceipt,
    })),
  );

export const useCheckoutActions = () =>
  useCheckoutFlowStore(
    useShallow((state) => ({
      setSelectedProductSlug: state.setSelectedProductSlug,
      setSelectedVariant: state.setSelectedVariant,
      setSelectedPaymentMethodId: state.setSelectedPaymentMethodId,
      setLatestReceipt: state.setLatestReceipt,
      resetCheckoutFlow: state.resetCheckoutFlow,
    })),
  );
