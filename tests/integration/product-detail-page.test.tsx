import { createLowRamQueryClient } from "@/core/query/query-client";
import { routeTree } from "@/core/router/routeTree.gen";
import { useCheckoutFlowStore } from "@/presentation/stores/checkout-flow.store";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  RouterProvider,
  createMemoryHistory,
  createRouter,
} from "@tanstack/react-router";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

function renderDetailRoute(initialUrl = "/products/esim-singapore") {
  const queryClient = createLowRamQueryClient();
  const memoryHistory = createMemoryHistory({
    initialEntries: [initialUrl],
  });
  const testRouter = createRouter({
    routeTree,
    history: memoryHistory,
  });

  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={testRouter} />
    </QueryClientProvider>,
  );

  return { testRouter };
}

describe("ProductDetailPage & Variant Selection Integration", () => {
  beforeEach(() => {
    useCheckoutFlowStore.getState().resetCheckoutFlow();
  });

  it("renders Cakupan negara, Ukuran Data, Jumlah Hari, Deskripsi, and updates dynamic price", async () => {
    const user = userEvent.setup();
    renderDetailRoute("/products/esim-singapore");

    expect(
      await screen.findByRole("heading", { name: "eSIM Singapore" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("detail-photo-carousel")).toBeInTheDocument();
    expect(screen.getByAltText("eSIM Singapore - Foto 1")).toBeInTheDocument();
    expect(screen.getByAltText("eSIM Singapore - Foto 2")).toBeInTheDocument();
    expect(screen.getByAltText("eSIM Singapore - Foto 3")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Foto 2 dari 3" }));
    expect(
      screen.getByRole("button", { name: "Foto 2 dari 3" }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Singapore")).toBeInTheDocument();
    expect(screen.getByTestId("detail-dynamic-price")).toHaveTextContent(
      "Rp69.000",
    );

    await user.click(screen.getByRole("button", { name: "10GB" }));
    await user.click(screen.getByRole("button", { name: "14" }));

    expect(screen.getByTestId("detail-dynamic-price")).toHaveTextContent(
      "Rp164.000",
    );

    await user.click(screen.getByRole("button", { name: "Pesan Sekarang" }));

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Detail Pemesan" }),
      ).toBeInTheDocument();
    });

    const storeState = useCheckoutFlowStore.getState();
    expect(storeState.selectedProductSlug).toBe("esim-singapore");
    expect(storeState.selectedDataSize).toBe("10GB");
    expect(storeState.selectedDays).toBe(14);
    expect(storeState.computedPriceIdr).toBe(164000);
  });
});
