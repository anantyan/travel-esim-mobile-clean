import { createLowRamQueryClient } from "@/core/query/query-client";
import { routeTree } from "@/core/router/routeTree.gen";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  RouterProvider,
  createMemoryHistory,
  createRouter,
} from "@tanstack/react-router";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

function renderCatalogRoute(initialUrl = "/") {
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

describe("Travel eSIM Catalog & Bottom Sheet Integration", () => {
  it("renders Travel eSIM header, search bar, filter chips, and destination cards inside locked 430px shell", async () => {
    renderCatalogRoute("/");

    expect(
      await screen.findByRole("heading", { name: "Travel eSIM" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("mobile-app-shell")).toHaveClass("max-w-[430px]");

    expect(await screen.findByText("eSIM Singapore")).toBeInTheDocument();
    expect(screen.getByText("eSIM Indonesia")).toBeInTheDocument();
    expect(screen.getByText("eSIM USA")).toBeInTheDocument();
    expect(screen.getByText("eSIM South Korea")).toBeInTheDocument();
    expect(screen.getByText("Rp69.000")).toBeInTheDocument();
    expect(screen.getByText("Rp52.000")).toBeInTheDocument();
  });

  it("filters catalog via Pilih Region bottom sheet, supports Reset, and filters via Pilih Jenis Produk", async () => {
    const user = userEvent.setup();
    renderCatalogRoute("/");

    await screen.findByText("eSIM Singapore");

    // 1. Open Pilih Region bottom sheet -> select Amerika -> Terapkan
    await user.click(screen.getByTestId("filter-region-chip"));
    expect(
      screen.getByRole("dialog", { name: "Pilih Region" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("radio", { name: "Amerika" }));
    await user.click(screen.getByRole("button", { name: "Terapkan" }));

    await waitFor(() => {
      expect(screen.getByText("eSIM USA")).toBeInTheDocument();
      expect(screen.queryByText("eSIM Singapore")).not.toBeInTheDocument();
    });

    // 2. Open Pilih Region again -> click Reset -> Terapkan
    await user.click(screen.getByTestId("filter-region-chip"));
    await user.click(screen.getByRole("button", { name: "Reset" }));
    await user.click(screen.getByRole("button", { name: "Terapkan" }));

    await waitFor(() => {
      expect(screen.getByText("eSIM Singapore")).toBeInTheDocument();
    });

    // 3. Open Pilih Jenis Produk -> select Topupable -> Terapkan
    await user.click(screen.getByTestId("filter-type-chip"));
    expect(
      screen.getByRole("dialog", { name: "Pilih Jenis Produk" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("radio", { name: "Topupable" }));
    await user.click(screen.getByRole("button", { name: "Terapkan" }));

    await waitFor(() => {
      expect(screen.getByText("eSIM Indonesia")).toBeInTheDocument();
      expect(screen.queryByText("eSIM Singapore")).not.toBeInTheDocument();
    });
  });

  it("shows empty state and resets all filters when search yields zero matches", async () => {
    const user = userEvent.setup();
    renderCatalogRoute("/");

    const searchInput = await screen.findByPlaceholderText(
      "Cari Produk yang Anda Mau",
    );
    await user.type(searchInput, "Atlantis");

    expect(
      await screen.findByText("Produk tidak ditemukan"),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Reset Filter" }));

    await waitFor(() => {
      expect(screen.getByText("eSIM Singapore")).toBeInTheDocument();
    });
  });
});
