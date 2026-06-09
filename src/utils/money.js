export function formatCurrency(value) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0
  }).format(value);
}

export function parseMoney(value) {
  if (typeof value === "number") return value;
  const normalized = String(value).toLowerCase().replace(",", ".");
  const number = Number(normalized.replace(/[^0-9.]/g, ""));
  if (normalized.includes("m")) return Math.round(number * 1000000);
  return Number(String(value).replace(/\D/g, "")) || 0;
}
