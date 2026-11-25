import { cn } from "@/commons/utils/cn";
import { CaretLeft, Check } from "@phosphor-icons/react";

export interface CheckoutHeaderProps {
  title: string;
  step: 1 | 2 | "done";
  onBack: () => void;
  backLabel?: string;
}

export function CheckoutHeader({
  title,
  step,
  onBack,
  backLabel = "Kembali",
}: CheckoutHeaderProps) {
  const stepOneDone = step === 2 || step === "done";
  const stepTwoDone = step === "done";
  const stepTwoActive = step === 2;

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between bg-[#252A86] px-3 text-white">
      <div className="flex min-w-0 items-center gap-1.5">
        <button
          type="button"
          aria-label={backLabel}
          onClick={onBack}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 active:scale-95"
        >
          <CaretLeft size={20} weight="bold" aria-hidden="true" />
        </button>
        <h1 className="truncate text-lg font-bold tracking-tight text-white">
          {title}
        </h1>
      </div>

      <div
        aria-label={
          step === 1
            ? "Langkah 1 dari 2"
            : step === 2
              ? "Langkah 2 dari 2"
              : "Transaksi selesai"
        }
        className="flex shrink-0 items-center pr-2 text-xs font-bold"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#252A86]">
          {stepOneDone ? (
            <Check size={13} weight="bold" aria-hidden="true" />
          ) : (
            "1"
          )}
        </span>

        <span
          aria-hidden="true"
          className={cn(
            "h-[2px] w-3.5 transition-colors",
            stepOneDone ? "bg-white" : "bg-white/40",
          )}
        />

        <span
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-full transition-colors",
            stepTwoDone || stepTwoActive
              ? "bg-white text-[#252A86]"
              : "bg-white/30 text-white",
          )}
        >
          {stepTwoDone ? (
            <Check size={13} weight="bold" aria-hidden="true" />
          ) : (
            "2"
          )}
        </span>
      </div>
    </header>
  );
}
