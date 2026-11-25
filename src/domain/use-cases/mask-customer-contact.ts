/**
 * Masks a WhatsApp/phone number leaving only the last 4 digits visible.
 * Example: "081234569300" -> "********9300"
 */
export function maskWhatsappNumber(raw: string): string {
  const compact = raw.replace(/[\s-]/g, "").trim();
  if (!compact) {
    return "********";
  }
  const visibleCount = Math.min(4, compact.length);
  const visibleTail = compact.slice(-visibleCount);
  const maskLength = Math.max(8, compact.length - visibleCount);
  return `${"*".repeat(maskLength)}${visibleTail}`;
}

/**
 * Masks an email local-part leaving at most the trailing 3 characters before @.
 * Example: "george.lee@gmail.com" -> "*******lee@gmail.com"
 */
export function maskEmailAddress(raw: string): string {
  const trimmed = raw.trim();
  const atIndex = trimmed.indexOf("@");
  if (atIndex <= 0) {
    return "*******";
  }
  const local = trimmed.slice(0, atIndex);
  const domain = trimmed.slice(atIndex);
  const visibleLen = Math.min(3, Math.max(1, local.length - 1));
  const visibleTail = local.slice(-visibleLen);
  const maskLength = Math.max(7, local.length - visibleLen);
  return `${"*".repeat(maskLength)}${visibleTail}${domain}`;
}
