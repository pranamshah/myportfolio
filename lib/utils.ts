import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return inputs.filter(Boolean).join(" ");
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "-";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function generateJobNo(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `JOB-${year}-${random}`;
}

export function generateInvoiceNo(type: string): string {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, "0");
  const random = Math.floor(Math.random() * 900) + 100;
  const prefix = type === "SERVICE" ? "INV" : type === "REIMBURSEMENT" ? "RMB" : "INV";
  return `${prefix}-${year}${month}-${random}`;
}

export const STATUS_LABELS: Record<string, string> = {
  BOOKING_CONFIRMED: "Booking Confirmed",
  CARGO_PICKED_UP: "Cargo Picked Up",
  AT_CFS: "At CFS",
  ON_VESSEL: "On Vessel",
  IN_TRANSIT: "In Transit",
  ARRIVED_AT_PORT: "Arrived at Port",
  UNDER_CUSTOMS_EXAMINATION: "Under Customs Examination",
  CUSTOMS_CLEARED: "Customs Cleared",
  DELIVERED: "Delivered",
  COMPLETED: "Completed",
};

export const STATUS_COLORS: Record<string, string> = {
  BOOKING_CONFIRMED: "bg-blue-100 text-blue-800",
  CARGO_PICKED_UP: "bg-yellow-100 text-yellow-800",
  AT_CFS: "bg-orange-100 text-orange-800",
  ON_VESSEL: "bg-purple-100 text-purple-800",
  IN_TRANSIT: "bg-indigo-100 text-indigo-800",
  ARRIVED_AT_PORT: "bg-teal-100 text-teal-800",
  UNDER_CUSTOMS_EXAMINATION: "bg-red-100 text-red-800",
  CUSTOMS_CLEARED: "bg-green-100 text-green-800",
  DELIVERED: "bg-emerald-100 text-emerald-800",
  COMPLETED: "bg-gray-100 text-gray-800",
};
