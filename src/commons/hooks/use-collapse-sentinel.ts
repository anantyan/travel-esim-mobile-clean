import { useEffect, useState } from "react";

/**
 * Observes a 1px sentinel element via callback ref (safe across async loading
 * states and route transitions) without scroll-event listeners.
 */
export function useCollapseSentinel(topOffsetPx: number) {
  const [sentinelNode, setSentinelNode] = useState<HTMLDivElement | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (!sentinelNode || typeof IntersectionObserver === "undefined") {
      setIsCollapsed(false);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) {
          return;
        }
        setIsCollapsed(
          !entry.isIntersecting && entry.boundingClientRect.top <= topOffsetPx,
        );
      },
      {
        rootMargin: `-${topOffsetPx}px 0px 0px 0px`,
        threshold: 0,
      },
    );

    observer.observe(sentinelNode);
    return () => {
      observer.disconnect();
    };
  }, [sentinelNode, topOffsetPx]);

  return { sentinelRef: setSentinelNode, isCollapsed };
}
