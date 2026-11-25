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

function renderCheckoutApp(initialUrl = "/products/esim-singapore") {
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

describe("2-Step Checkout Flow (Detail Pemesan -> Metode Pembayaran -> Invoice)", () => {
  beforeEach(() => {
    useCheckoutFlowStore.getState().resetCheckoutFlow();
  });

  it("validates customer form, calculates payment fees, renders masked invoice, and resets on Selesai", async () => {
    const user = userEvent.setup();
    renderCheckoutApp("/products/esim-singapore");

    // Start from Product Detail -> Pesan Sekarang
    await screen.findByRole("heading", { name: "eSIM Singapore" });
    await user.click(screen.getByRole("button", { name: "Pesan Sekarang" }));

    // Step 1: Detail Pemesan
    expect(
      await screen.findByRole("heading", { name: "Detail Pemesan" }),
    ).toBeInTheDocument();
    expect(screen.getByText("3 GB")).toBeInTheDocument();

    // Submit empty form to trigger Zod validation messages
    await user.click(screen.getByRole("button", { name: "Lanjutkan" }));
    expect(
      await screen.findByText("Nama pelanggan minimal 2 karakter"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Format alamat email tidak valid"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Nomor WhatsApp wajib 9–15 digit angka"),
    ).toBeInTheDocument();

    // Fill valid customer data
    await user.type(screen.getByLabelText("Nama"), "George lee");
    await user.type(
      screen.getByLabelText("Alamat Email"),
      "george.lee@gmail.com",
    );
    await user.type(screen.getByLabelText("Nomor Whatsapp"), "081234569300");
    await user.click(screen.getByRole("button", { name: "Lanjutkan" }));

    // Step 2: Metode Pembayaran (authentic vector bank logos + Nota summary)
    expect(
      await screen.findByRole("heading", { name: "Metode Pembayaran" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Rp200.000")).toBeInTheDocument();
    expect(screen.getByTestId("bank-logo-BCA_VA")).toBeInTheDocument();
    expect(screen.getByTestId("bank-logo-MANDIRI_VA")).toBeInTheDocument();
    expect(screen.getByTestId("bank-logo-BRI_VA")).toBeInTheDocument();
    expect(screen.getByTestId("payment-nota-summary")).toBeInTheDocument();

    // Switch to VA BCA (fee Rp2.500 -> Total Rp71.500)
    await user.click(screen.getByRole("radio", { name: /VA BCA/i }));
    await waitFor(() => {
      expect(screen.getByTestId("payment-total-amount")).toHaveTextContent(
        "Rp71.500",
      );
    });
    await user.click(screen.getByRole("button", { name: "Lanjutkan" }));

    // Step 3: Invoice (unified Nota paper receipt)
    expect(
      await screen.findByRole("heading", { name: "Invoice" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("receipt-nota-surface")).toBeInTheDocument();
    expect(screen.getByTestId("invoice-total-paid")).toHaveTextContent(
      "Rp71.500",
    );
    expect(screen.getByText("Berhasil")).toBeInTheDocument();
    expect(screen.getByTestId("invoice-masked-whatsapp")).toHaveTextContent(
      "********9300",
    );
    expect(screen.getByTestId("invoice-masked-email")).toHaveTextContent(
      "*******lee@gmail.com",
    );

    // Click Selesai -> resets Zustand state & returns to Catalog
    await user.click(screen.getByRole("button", { name: "Selesai" }));
    expect(
      await screen.findByRole("heading", { name: "Travel eSIM" }),
    ).toBeInTheDocument();
    expect(useCheckoutFlowStore.getState().latestReceipt).toBeNull();
    expect(useCheckoutFlowStore.getState().customerInfo).toBeNull();
  });
});
