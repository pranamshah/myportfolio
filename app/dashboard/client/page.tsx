import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import Shipment from "@/models/Shipment";
import Invoice from "@/models/Invoice";
import Quote from "@/models/Quote";
import { formatINR, formatDate } from "@/lib/utils";
import Link from "next/link";
import { Ship, FileText, MessageSquare, TrendingUp } from "lucide-react";
import { StatusBadge } from "@/components/ui/Badge";

export default async function ClientDashboard() {
  const session = await getServerSession(authOptions);
  await connectDB();
  const clientId = session!.user.id;

  const [activeShipments, pendingQuotes, invoices, recentShipmentsDocs] = await Promise.all([
    Shipment.countDocuments({ client: clientId, status: { $nin: ["DELIVERED", "COMPLETED"] } }),
    Quote.countDocuments({ client: clientId, status: "PENDING" }),
    Invoice.find({ client: clientId }).select("totalAmount amountPaid status"),
    Shipment.find({ client: clientId }).sort({ updatedAt: -1 }).limit(5).select("shipmentId description status origin destination eta updatedAt").lean(),
  ]);
  type RecentShip = { _id: string; shipmentId: string; description: string; status: string; origin: string; destination: string; eta?: Date; updatedAt: Date };
  const recentShipments = recentShipmentsDocs as unknown as RecentShip[];

  const totalBilled = invoices.reduce((s, i) => s + i.totalAmount, 0);
  const totalPaid = invoices.reduce((s, i) => s + i.amountPaid, 0);
  const outstanding = totalBilled - totalPaid;

  const stats = [
    { label: "Active Shipments", value: activeShipments, icon: Ship, color: "text-blue-400", bg: "bg-blue-900/20" },
    { label: "Pending Quotes", value: pendingQuotes, icon: MessageSquare, color: "text-yellow-400", bg: "bg-yellow-900/20" },
    { label: "Total Invoiced", value: formatINR(totalBilled), icon: FileText, color: "text-purple-400", bg: "bg-purple-900/20" },
    { label: "Outstanding", value: formatINR(outstanding), icon: TrendingUp, color: "text-gold", bg: "bg-gold/10" },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div>
        <p className="section-heading">Client Portal</p>
        <h1 className="page-heading">Welcome, {session?.user?.name?.split(" ")[0]}</h1>
        <p className="text-ink-secondary text-sm mt-1">Track your shipments, view invoices and download documents.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card-luxury p-4">
            <div className={`w-8 h-8 rounded ${bg} flex items-center justify-center mb-3`}>
              <Icon size={16} className={color} />
            </div>
            <div className="text-xl font-semibold text-ink">{value}</div>
            <div className="text-xs text-ink-muted mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <p className="section-heading">Quick Actions</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard/client/quotes" className="btn-gold text-sm">Request a Quote</Link>
          <Link href="/dashboard/client/shipments" className="btn-ghost text-sm">Track Shipments</Link>
          <Link href="/dashboard/client/invoices" className="btn-ghost text-sm">View Invoices</Link>
          <Link href="/dashboard/client/documents" className="btn-ghost text-sm">My Documents</Link>
        </div>
      </div>

      {/* Recent shipments */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="section-heading mb-0">Recent Shipments</p>
          <Link href="/dashboard/client/shipments" className="text-xs text-gold hover:text-gold-light">View all →</Link>
        </div>
        <div className="card-luxury overflow-hidden">
          <table className="table-luxury">
            <thead>
              <tr><th>Shipment ID</th><th>Description</th><th>Route</th><th>Status</th><th>ETA</th></tr>
            </thead>
            <tbody>
              {recentShipments.map((s) => (
                <tr key={s._id.toString()}>
                  <td>
                    <Link href={`/dashboard/client/shipments/${s._id}`} className="text-gold hover:text-gold-light font-medium text-sm">{s.shipmentId}</Link>
                  </td>
                  <td className="text-sm text-ink-secondary">{s.description}</td>
                  <td className="text-xs text-ink-muted">{s.origin} → {s.destination}</td>
                  <td><StatusBadge status={s.status} /></td>
                  <td className="text-xs text-ink-muted">{s.eta ? formatDate(s.eta) : "—"}</td>
                </tr>
              ))}
              {recentShipments.length === 0 && (
                <tr><td colSpan={5} className="text-center text-ink-muted py-8">No shipments yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
