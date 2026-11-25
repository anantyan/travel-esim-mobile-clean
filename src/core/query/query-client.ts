import { QueryClient } from "@tanstack/react-query";

/**
 * Creates a TanStack Query v5 client tuned for Ultra-Low Browser V8 Heap usage:
 * - Short garbage collection window (gcTime = 2 min) after unmount
 * - Structural sharing enabled to reuse identical JSON object references
 * - No automatic window-focus refetch bursts
 */
export function createLowRamQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 120_000,
        refetchOnWindowFocus: false,
        retry: 1,
        structuralSharing: true,
      },
    },
  });
}

export const queryClient = createLowRamQueryClient();
