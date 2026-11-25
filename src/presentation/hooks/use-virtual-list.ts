import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";

export interface UseVirtualListOptions {
  count: number;
  estimateSizePx: number;
  overscan?: number;
}

/**
 * Reusable @tanstack/react-virtual hook that keeps rendered DOM nodes bounded
 * for Ultra-Low Browser RAM consumption on long lists.
 */
export function useVirtualList<TContainer extends HTMLElement>({
  count,
  estimateSizePx,
  overscan = 5,
}: UseVirtualListOptions) {
  const scrollContainerRef = useRef<TContainer | null>(null);

  const virtualizer = useVirtualizer({
    count,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => estimateSizePx,
    overscan,
  });

  return {
    scrollContainerRef,
    virtualizer,
    virtualItems: virtualizer.getVirtualItems(),
    totalSize: virtualizer.getTotalSize(),
  };
}
