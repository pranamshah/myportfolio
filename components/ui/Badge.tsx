import { STATUS_COLOR, STATUS_LABEL } from "@/lib/utils";

export function StatusBadge({ status }: { status: string }) {
  const isCustoms = status === "UNDER_CUSTOMS_EXAM" || status === "CUSTOMS_CLEARED";
  return (
    <span
      className={`status-badge ${STATUS_COLOR[status] || "border border-black/10 text-black/40"}`}
      style={isCustoms ? { backgroundColor: "#735c00" } : undefined}
    >
      {STATUS_LABEL[status] || status}
    </span>
  );
}

export function InvoiceBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    DRAFT:     "border border-black/20 text-black/50",
    SENT:      "border border-black text-black",
    PAID:      "border-0 text-black font-bold",
    OVERDUE:   "border border-red-600 text-red-600",
    CANCELLED: "border border-black/10 text-black/30",
  };
  return (
    <span
      className={`status-badge ${map[status] || "border border-black/10 text-black/40"}`}
      style={status === "PAID" ? { backgroundColor: "#735c00", color: "#000" } : undefined}
    >
      {status}
    </span>
  );
}

export function QuoteBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    PENDING:  "border border-black text-black",
    QUOTED:   "border border-black text-black",
    ACCEPTED: "border-0 text-black font-bold",
    REJECTED: "border border-red-600 text-red-600",
    EXPIRED:  "border border-black/10 text-black/30",
  };
  return (
    <span
      className={`status-badge ${map[status] || "border border-black/10 text-black/40"}`}
      style={status === "ACCEPTED" ? { backgroundColor: "#735c00", color: "#000" } : undefined}
    >
      {status}
    </span>
  );
}
