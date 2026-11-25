const SKELETON_ITEMS = ["sk-1", "sk-2", "sk-3", "sk-4"] as const;

export function EsimCatalogSkeleton() {
  return (
    <div
      aria-label="Memuat daftar produk Travel eSIM"
      className="grid grid-cols-2 gap-3.5"
    >
      {SKELETON_ITEMS.map((item) => (
        <div
          key={item}
          className="flex flex-col rounded-[20px] border border-slate-200/75 bg-white p-2.5"
        >
          <div className="aspect-[4/4.5] w-full animate-pulse rounded-[14px] bg-slate-200/70" />
          <div className="mt-3 h-4 w-3/4 animate-pulse rounded bg-slate-200/80" />
          <div className="mt-1.5 h-3 w-1/2 animate-pulse rounded bg-slate-100" />
          <div className="mt-2.5 h-3 w-2/5 animate-pulse rounded bg-slate-100" />
          <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-slate-200/80" />
        </div>
      ))}
    </div>
  );
}
