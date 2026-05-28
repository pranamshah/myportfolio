export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 2 }).format(n);
}

export function formatDate(d?: Date | string | null) {
  if (!d) return "—";
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(d));
}

export function formatDateInput(d?: Date | string | null) {
  if (!d) return "";
  return new Date(d).toISOString().split("T")[0];
}

const ONES = ["","ONE","TWO","THREE","FOUR","FIVE","SIX","SEVEN","EIGHT","NINE","TEN","ELEVEN","TWELVE","THIRTEEN","FOURTEEN","FIFTEEN","SIXTEEN","SEVENTEEN","EIGHTEEN","NINETEEN"];
const TENS = ["","","TWENTY","THIRTY","FORTY","FIFTY","SIXTY","SEVENTY","EIGHTY","NINETY"];

function twoDigits(n: number): string {
  if (n < 20) return ONES[n];
  return TENS[Math.floor(n / 10)] + (n % 10 ? " " + ONES[n % 10] : "");
}
function threeDigits(n: number): string {
  if (n >= 100) return ONES[Math.floor(n / 100)] + " HUNDRED" + (n % 100 ? " AND " + twoDigits(n % 100) : "");
  return twoDigits(n);
}
export function numberToWords(amount: number): string {
  const n = Math.round(amount);
  if (n === 0) return "ZERO RUPEES ONLY";
  const cr = Math.floor(n / 10000000);
  const lk = Math.floor((n % 10000000) / 100000);
  const th = Math.floor((n % 100000) / 1000);
  const rest = n % 1000;
  let r = "";
  if (cr) r += threeDigits(cr) + " CRORE ";
  if (lk) r += twoDigits(lk) + " LAKH ";
  if (th) r += threeDigits(th) + " THOUSAND ";
  if (rest) r += threeDigits(rest);
  return "RUPEES " + r.trim() + " ONLY";
}

export function generateId(prefix: string) {
  const yr = new Date().getFullYear();
  const rnd = Math.floor(Math.random() * 9000) + 1000;
  return `${prefix}-${yr}-${rnd}`;
}

export const STATUS_LABEL: Record<string, string> = {
  BOOKING_CONFIRMED: "Booking Confirmed",
  CARGO_PICKED_UP: "Cargo Picked Up",
  AT_CFS: "At CFS / Port",
  ON_VESSEL: "On Vessel",
  IN_TRANSIT: "In Transit",
  ARRIVED_AT_PORT: "Arrived at Port",
  UNDER_CUSTOMS_EXAM: "Under Customs Exam",
  CUSTOMS_CLEARED: "Customs Cleared",
  DELIVERED: "Delivered",
  COMPLETED: "Completed",
};

export const STATUS_COLOR: Record<string, string> = {
  BOOKING_CONFIRMED: "bg-blue-900/40 text-blue-300 border-blue-700",
  CARGO_PICKED_UP: "bg-yellow-900/40 text-yellow-300 border-yellow-700",
  AT_CFS: "bg-orange-900/40 text-orange-300 border-orange-700",
  ON_VESSEL: "bg-purple-900/40 text-purple-300 border-purple-700",
  IN_TRANSIT: "bg-indigo-900/40 text-indigo-300 border-indigo-700",
  ARRIVED_AT_PORT: "bg-teal-900/40 text-teal-300 border-teal-700",
  UNDER_CUSTOMS_EXAM: "bg-red-900/40 text-red-300 border-red-700",
  CUSTOMS_CLEARED: "bg-green-900/40 text-green-300 border-green-700",
  DELIVERED: "bg-emerald-900/40 text-emerald-300 border-emerald-700",
  COMPLETED: "bg-surface-card text-ink-secondary border-surface-hover",
};
