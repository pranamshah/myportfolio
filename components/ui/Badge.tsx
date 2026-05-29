import { STATUS_COLOR, STATUS_LABEL } from "@/lib/utils";

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`status-badge ${STATUS_COLOR[status] || "bg-surface-card text-ink-secondary border-surface-hover"}`}>
      {STATUS_LABEL[status] || status}
    </span>
  );
}

export function InvoiceBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    DRAFT: "bg-surface-hover text-ink-secondary border-surface-hover",
    SENT: "bg-blue-900/40 text-blue-300 border-blue-700",
    PAID: "bg-green-900/40 text-green-300 border-green-700",
    OVERDUE: "bg-red-900/40 text-red-300 border-red-700",
    CANCELLED: "bg-surface-card text-ink-muted border-surface-hover",
  };
  return <span className={`status-badge ${map[status] || ""}`}>{status}</span>;
}

export function QuoteBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    PENDING: "bg-yellow-900/40 text-yellow-300 border-yellow-700",
    QUOTED: "bg-blue-900/40 text-blue-300 border-blue-700",
    ACCEPTED: "bg-green-900/40 text-green-300 border-green-700",
    REJECTED: "bg-red-900/40 text-red-300 border-red-700",
    EXPIRED: "bg-surface-card text-ink-muted border-surface-hover",
  };
  return <span className={`status-badge ${map[status] || ""}`}>{status}</span>;
}
