export function formatRupiah(amount: number): string {
  const formatted = new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 0,
  }).format(amount);
  return `Rp${formatted}`;
}

export function formatRupiahWithCents(amount: number): string {
  const formatted = new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `Rp${formatted}`;
}

export function formatActiveDays(days: number): string {
  return `${days} Hari`;
}

export function formatQuotaSpaced(dataSize: string): string {
  return dataSize.replace(/(\d+)\s*([a-zA-Z]+)/, "$1 $2").trim();
}

export function formatOrderDateDdMmYyyy(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}
