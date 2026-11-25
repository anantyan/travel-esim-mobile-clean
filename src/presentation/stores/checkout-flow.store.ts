import type { OrderReceipt } from "@/domain";
import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";

interface CheckoutFlowState {
  selectedProductSlug: string | null;
  selectedPaymentMethodId: string | null;
  latestReceipt: OrderReceipt | null;
  setSelectedProductSlug: (slug: string | null) => void;
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
  selectedPaymentMethodId: null,
  latestReceipt: null,
  setSelectedProductSlug: (selectedProductSlug) => set({ selectedProductSlug }),
  setSelectedPaymentMethodId: (selectedPaymentMethodId) =>
    set({ selectedPaymentMethodId }),
  setLatestReceipt: (latestReceipt) => set({ latestReceipt }),
  resetCheckoutFlow: () =>
    set({
      selectedProductSlug: null,
      selectedPaymentMethodId: null,
      latestReceipt: null,
    }),
}));

export const useCheckoutSelection = () =>
  useCheckoutFlowStore(
    useShallow((state) => ({
      selectedProductSlug: state.selectedProductSlug,
      selectedPaymentMethodId: state.selectedPaymentMethodId,
      latestReceipt: state.latestReceipt,
    })),
  );

export const useCheckoutActions = () =>
  useCheckoutFlowStore(
    useShallow((state) => ({
      setSelectedProductSlug: state.setSelectedProductSlug,
      setSelectedPaymentMethodId: state.setSelectedPaymentMethodId,
      setLatestReceipt: state.setLatestReceipt,
      resetCheckoutFlow: state.resetCheckoutFlow,
    })),
  );
