import { MobileAppShell } from "@/commons/components/shell/MobileAppShell";
import { createLowRamQueryClient } from "@/core/query/query-client";
import { HelloWorldStage } from "@/presentation/features/hello-world/HelloWorldStage";
import { useCheckoutFlowStore } from "@/presentation/stores/checkout-flow.store";
import { QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

describe("HelloWorldStage + MobileAppShell Integration", () => {
  beforeEach(() => {
    useCheckoutFlowStore.getState().resetCheckoutFlow();
  });

  it("renders centered Hello World inside locked 430px MobileAppShell and loads static catalog count", async () => {
    const testQueryClient = createLowRamQueryClient();

    render(
      <QueryClientProvider client={testQueryClient}>
        <MobileAppShell>
          <HelloWorldStage />
        </MobileAppShell>
      </QueryClientProvider>,
    );

    const shell = screen.getByTestId("mobile-app-shell");
    expect(shell).toHaveClass("max-w-[430px]");

    const heading = screen.getByRole("heading", { name: "Hello World" });
    expect(heading).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("architecture-status-pill")).toHaveTextContent(
        "Phase 1 Ready · 7 produk statis",
      );
    });
  });

  it("manages ephemeral checkout flow state in memory via Zustand 5", () => {
    const store = useCheckoutFlowStore.getState();
    store.setSelectedProductSlug("esim-singapore");
    store.setSelectedPaymentMethodId("pm-qris");

    expect(useCheckoutFlowStore.getState().selectedProductSlug).toBe(
      "esim-singapore",
    );
    expect(useCheckoutFlowStore.getState().selectedPaymentMethodId).toBe(
      "pm-qris",
    );

    store.resetCheckoutFlow();
    expect(useCheckoutFlowStore.getState().selectedProductSlug).toBeNull();
    expect(useCheckoutFlowStore.getState().selectedPaymentMethodId).toBeNull();
  });
});
