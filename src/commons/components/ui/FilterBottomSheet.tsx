import { Button } from "@/commons/components/ui/Button";
import { RadioIndicator } from "@/commons/components/ui/RadioIndicator";
import { cn } from "@/commons/utils/cn";
import { type PointerEvent, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export interface FilterSheetOption<T extends string> {
  readonly value: T;
  readonly label: string;
}

export interface FilterBottomSheetProps<T extends string> {
  open: boolean;
  title: string;
  options: ReadonlyArray<FilterSheetOption<T>>;
  appliedValue: T;
  defaultValue: T;
  onApply: (nextValue: T) => void;
  onClose: () => void;
  testIdPrefix: string;
}

interface DragState {
  tracking: boolean;
  dragging: boolean;
  pointerId: number;
  startY: number;
  startTime: number;
  deltaY: number;
}

/**
 * Accessible radio-list bottom sheet locked strictly within the 430px mobile
 * shell portal, supporting 60fps pointer drag-to-dismiss anywhere on the sheet.
 */
export function FilterBottomSheet<T extends string>({
  open,
  title,
  options,
  appliedValue,
  defaultValue,
  onApply,
  onClose,
  testIdPrefix,
}: FilterBottomSheetProps<T>) {
  const [draftValue, setDraftValue] = useState<T>(appliedValue);
  const sheetRef = useRef<HTMLDialogElement | null>(null);
  const backdropRef = useRef<HTMLButtonElement | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const dragStateRef = useRef<DragState>({
    tracking: false,
    dragging: false,
    pointerId: -1,
    startY: 0,
    startTime: 0,
    deltaY: 0,
  });

  useEffect(() => {
    if (open) {
      setDraftValue(appliedValue);
      if (sheetRef.current) {
        sheetRef.current.style.transition = "";
        sheetRef.current.style.transform = "";
        sheetRef.current.style.animation = "";
      }
      if (backdropRef.current) {
        backdropRef.current.style.opacity = "";
      }
    }
  }, [open, appliedValue]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    const checkedRadio = sheetRef.current?.querySelector<HTMLElement>(
      'input[type="radio"]:checked',
    );
    checkedRadio?.focus({ preventScroll: true });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key === "Tab" && sheetRef.current) {
        const focusables = Array.from(
          sheetRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]):not([tabindex="-1"]), input:not([disabled])',
          ),
        );
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (!first || !last) {
          return;
        }
        const active = document.activeElement;
        if (event.shiftKey) {
          if (active === first || !sheetRef.current.contains(active)) {
            event.preventDefault();
            last.focus();
          }
        } else if (active === last || !sheetRef.current.contains(active)) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const handlePointerDown = (event: PointerEvent<HTMLDialogElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }
    dragStateRef.current = {
      tracking: true,
      dragging: false,
      pointerId: event.pointerId,
      startY: event.clientY,
      startTime: performance.now(),
      deltaY: 0,
    };
  };

  const handlePointerMove = (event: PointerEvent<HTMLDialogElement>) => {
    const drag = dragStateRef.current;
    if (!drag.tracking || drag.pointerId !== event.pointerId) {
      return;
    }

    const rawDelta = event.clientY - drag.startY;
    if (!drag.dragging) {
      if (Math.abs(rawDelta) < 6) {
        return;
      }
      drag.dragging = true;
      event.currentTarget.setPointerCapture?.(event.pointerId);
      if (sheetRef.current) {
        sheetRef.current.style.animation = "none";
        sheetRef.current.style.transition = "none";
      }
    }

    drag.deltaY = rawDelta;
    const offsetY = rawDelta < 0 ? rawDelta * 0.15 : rawDelta;

    if (sheetRef.current) {
      sheetRef.current.style.transform = `translate3d(0, ${offsetY}px, 0)`;
    }
    if (backdropRef.current) {
      const nextOpacity = Math.max(0.15, 1 - Math.max(0, rawDelta) / 300);
      backdropRef.current.style.opacity = String(nextOpacity);
    }
  };

  const handlePointerEnd = (event: PointerEvent<HTMLDialogElement>) => {
    const drag = dragStateRef.current;
    if (!drag.tracking || drag.pointerId !== event.pointerId) {
      return;
    }
    const wasDragging = drag.dragging;
    const rawDelta = drag.deltaY;
    const elapsed = Math.max(1, performance.now() - drag.startTime);

    drag.tracking = false;
    drag.dragging = false;

    if (!wasDragging) {
      return;
    }

    event.currentTarget.releasePointerCapture?.(event.pointerId);

    const velocity = rawDelta / elapsed;
    const shouldDismiss = rawDelta > 85 || (rawDelta > 30 && velocity > 0.55);

    if (shouldDismiss) {
      const prefersReducedMotion =
        typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReducedMotion || !sheetRef.current) {
        onClose();
        return;
      }

      sheetRef.current.style.transition =
        "transform 180ms cubic-bezier(0.32, 0.72, 0, 1)";
      sheetRef.current.style.transform = "translate3d(0, 105%, 0)";
      if (backdropRef.current) {
        backdropRef.current.style.opacity = "0";
      }
      closeTimerRef.current = window.setTimeout(() => {
        closeTimerRef.current = null;
        onClose();
      }, 160);
      return;
    }

    if (sheetRef.current) {
      sheetRef.current.style.transition =
        "transform 220ms cubic-bezier(0.32, 0.72, 0, 1)";
      sheetRef.current.style.transform = "translate3d(0, 0, 0)";
    }
    if (backdropRef.current) {
      backdropRef.current.style.opacity = "";
    }
  };

  const portalRoot = document.getElementById("mobile-shell-portal");
  const isInsideShellPortal = portalRoot !== null;
  const targetContainer = portalRoot ?? document.body;

  const content = (
    <div
      className={cn(
        isInsideShellPortal
          ? "pointer-events-auto relative h-full w-full"
          : "fixed inset-y-0 left-1/2 z-50 w-full max-w-[430px] -translate-x-1/2",
      )}
    >
      <button
        ref={backdropRef}
        type="button"
        tabIndex={-1}
        aria-label={`Tutup ${title}`}
        data-testid={`${testIdPrefix}-backdrop`}
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default border-0 bg-slate-950/45 p-0 transition-opacity duration-200"
      />

      <dialog
        ref={sheetRef}
        open
        aria-modal="true"
        aria-label={title}
        data-testid={`${testIdPrefix}-sheet`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        className="animate-sheet-up absolute inset-x-0 top-auto bottom-0 m-0 w-full max-w-none touch-none select-none rounded-t-[28px] border-0 bg-white px-5 pt-0 pb-7 text-slate-900 shadow-[0_-12px_40px_rgba(15,23,42,0.16)]"
      >
        <div
          data-testid={`${testIdPrefix}-drag-handle`}
          className="cursor-grab pt-3 pb-2 active:cursor-grabbing"
        >
          <div
            aria-hidden="true"
            className="mx-auto mb-3.5 h-1.5 w-14 rounded-full bg-slate-200"
          />

          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold tracking-tight text-slate-900">
              {title}
            </h2>
            <button
              type="button"
              onClick={() => setDraftValue(defaultValue)}
              className="rounded-md px-1.5 py-1 text-sm font-semibold text-[#252A86] transition-opacity hover:opacity-80 active:scale-95"
            >
              Reset
            </button>
          </div>
        </div>

        <fieldset className="m-0 border-0 p-0">
          <legend className="sr-only">{title}</legend>
          <div className="divide-y divide-slate-100">
            {options.map((option) => {
              const isSelected = draftValue === option.value;
              return (
                <label
                  key={option.value}
                  className="relative flex w-full cursor-pointer items-center justify-between py-3.5 text-left text-[15px] font-medium text-slate-900 transition-colors hover:text-[#252A86] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#252A86]"
                >
                  <span>{option.label}</span>
                  <input
                    type="radio"
                    name={`${testIdPrefix}-option`}
                    value={option.value}
                    checked={isSelected}
                    onChange={() => setDraftValue(option.value)}
                    className="absolute inset-0 m-0 h-full w-full cursor-pointer opacity-0"
                  />
                  <RadioIndicator checked={isSelected} />
                </label>
              );
            })}
          </div>
        </fieldset>

        <Button
          fullWidth
          className="mt-4 py-3.5 text-sm font-semibold"
          onClick={() => {
            onApply(draftValue);
            onClose();
          }}
        >
          Terapkan
        </Button>
      </dialog>
    </div>
  );

  return createPortal(content, targetContainer);
}
