import { cn } from "@/commons/utils/cn";
import type { PropsWithChildren } from "react";

export interface ReceiptSurfaceProps extends PropsWithChildren {
  className?: string;
  testId?: string;
}

const NOTA_TEETH_COUNT = 20;
const NOTA_TEETH_WIDTH = 360;
const TOOTH_STEP = NOTA_TEETH_WIDTH / NOTA_TEETH_COUNT;

const SERRATED_FILL_PATH = [
  "M0,0",
  ...Array.from({ length: NOTA_TEETH_COUNT }, (_, idx) => {
    const midX = idx * TOOTH_STEP + TOOTH_STEP / 2;
    const endX = (idx + 1) * TOOTH_STEP;
    return `L${midX},10 L${endX},0`;
  }),
  "Z",
].join(" ");

const SERRATED_STROKE_PATH = [
  "M0,0",
  ...Array.from({ length: NOTA_TEETH_COUNT }, (_, idx) => {
    const midX = idx * TOOTH_STEP + TOOTH_STEP / 2;
    const endX = (idx + 1) * TOOTH_STEP;
    return `L${midX},10 L${endX},0`;
  }),
].join(" ");

/**
 * Physical paper receipt ("nota") surface with top rounded border and
 * serrated tear-off teeth along the bottom edge.
 */
export function ReceiptSurface({
  children,
  className,
  testId = "receipt-nota-surface",
}: ReceiptSurfaceProps) {
  return (
    <div
      data-testid={testId}
      className="relative drop-shadow-[0_12px_26px_rgba(15,23,42,0.06)]"
    >
      <div
        className={cn(
          "relative rounded-t-2xl border-x border-t border-slate-200/85 bg-[#F8F9FC] px-5 pt-6 pb-5",
          className,
        )}
      >
        {children}
      </div>

      <svg
        aria-hidden="true"
        focusable="false"
        viewBox={`0 0 ${NOTA_TEETH_WIDTH} 12`}
        preserveAspectRatio="none"
        className="block h-3 w-full"
      >
        <path d={SERRATED_FILL_PATH} fill="#F8F9FC" />
        <path
          d={SERRATED_STROKE_PATH}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth="1.2"
        />
      </svg>
    </div>
  );
}

/**
 * Perforated ticket tear line with semicircular side punch-out notches
 * aligned flush inside ReceiptSurface without horizontal overflow.
 */
export function ReceiptDivider({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("-mx-5 my-4 flex items-center", className)}
    >
      <span className="h-4 w-2.5 shrink-0 rounded-r-full border-y border-r border-slate-200/85 bg-white" />
      <span className="mx-1.5 flex-1 border-t border-dashed border-slate-300/90" />
      <span className="h-4 w-2.5 shrink-0 rounded-l-full border-y border-l border-slate-200/85 bg-white" />
    </div>
  );
}
