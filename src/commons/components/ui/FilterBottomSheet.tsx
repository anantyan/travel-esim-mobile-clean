import { Button } from "@/commons/components/ui/Button";
import { cn } from "@/commons/utils/cn";
import { useEffect, useState } from "react";
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

/**
 * Accessible radio-list bottom sheet locked strictly within the 430px mobile
 * shell portal so overlays never span across tablet or desktop margins.
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

  useEffect(() => {
    if (open) {
      setDraftValue(appliedValue);
    }
  }, [open, appliedValue]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

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
        type="button"
        tabIndex={-1}
        aria-label={`Tutup ${title}`}
        data-testid={`${testIdPrefix}-backdrop`}
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default border-0 bg-slate-950/45 p-0 transition-opacity duration-200"
      />

      <dialog
        open
        aria-modal="true"
        aria-label={title}
        data-testid={`${testIdPrefix}-sheet`}
        className="absolute inset-x-0 top-auto bottom-0 m-0 w-full max-w-none rounded-t-[28px] border-0 bg-white px-5 pt-3 pb-7 text-slate-900 shadow-[0_-12px_40px_rgba(15,23,42,0.16)]"
      >
        <div
          aria-hidden="true"
          className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-slate-200"
        />

        <div className="mb-2 flex items-center justify-between">
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
                  <span
                    aria-hidden="true"
                    className={cn(
                      "pointer-events-none flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors",
                      isSelected
                        ? "border-2 border-[#252A86] bg-white"
                        : "border-[1.5px] border-slate-300 bg-white",
                    )}
                  >
                    {isSelected && (
                      <span className="h-3 w-3 rounded-full bg-[#252A86]" />
                    )}
                  </span>
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
