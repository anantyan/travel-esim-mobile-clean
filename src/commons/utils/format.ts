export function formatRupiah(amount: number): string {
  const formatted = new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 0,
  }).format(amount);
  return `Rp${formatted}`;
}

export function formatActiveDays(days: number): string {
  return `${days} Hari`;
}
