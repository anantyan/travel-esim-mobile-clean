import { cn } from "@/commons/utils/cn";

export interface RadioIndicatorProps {
  checked: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * Vector SVG radio indicator sharing the exact (12, 12) center origin for both
 * outer ring and inner dot so they remain subpixel-concentric on any mobile DPR.
 */
export function RadioIndicator({
  checked,
  disabled = false,
  className,
}: RadioIndicatorProps) {
  const isActive = checked && !disabled;

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      className={cn("pointer-events-none h-6 w-6 shrink-0", className)}
    >
      <circle
        cx="12"
        cy="12"
        r="9.5"
        fill="#FFFFFF"
        stroke={isActive ? "#252A86" : "#CBD5E1"}
        strokeWidth={isActive ? 2 : 1.6}
      />
      <circle
        cx="12"
        cy="12"
        r="5"
        fill="#252A86"
        className={cn(
          "origin-center transition-transform duration-150 ease-out",
          isActive ? "scale-100" : "scale-0",
        )}
      />
    </svg>
  );
}
