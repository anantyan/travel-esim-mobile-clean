import { cn } from "@/commons/utils/cn";
import type { PropsWithChildren } from "react";

export interface MobileAppShellProps extends PropsWithChildren {
  className?: string;
}

/**
 * Locks the entire application inside a slim 430px mobile phone column
 * across mobile, tablet, laptop, and desktop viewports, including a dedicated
 * portal container so overlays and bottom sheets never bleed onto desktop margins.
 */
export function MobileAppShell({ children, className }: MobileAppShellProps) {
  return (
    <div className="min-h-[100dvh] w-full bg-[#EEF0F5] flex flex-col items-center justify-start">
      <div
        data-testid="mobile-app-shell"
        className={cn(
          "relative flex min-h-[100dvh] w-full max-w-[430px] flex-col overflow-x-clip bg-white",
          "sm:border-x sm:border-slate-200/80 sm:shadow-[0_20px_50px_-15px_rgba(15,23,42,0.08)]",
          className,
        )}
      >
        {children}
        <div
          id="mobile-shell-portal"
          className="pointer-events-none fixed inset-y-0 left-1/2 z-50 w-full max-w-[430px] -translate-x-1/2"
        />
      </div>
    </div>
  );
}
