import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import Shipment from "@/models/Shipment";
import Invoice from "@/models/Invoice";
import Quote from "@/models/Quote";
import User from "@/models/User";
import { formatINR } from "@/lib/utils";
import Link from "next/link";
import { Ship, FileText, Users, MessageSquare, TrendingUp, Clock, CheckCircle, AlertCircle } from "lucide-react";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  await connectDB();

  const [totalShipments, activeShipments, totalClients, pendingQuotes, invoices] = await Promise.all([
    Shipment.countDocuments(),
    Shipment.countDocuments({ status: { $nin: ["DELIVERED", "COMPLETED"] } }),
    User.countDocuments({ role: "CLIENT" }),
    Quote.countDocuments({ status: "PENDING" }),
    Invoice.find({ status: { $in: ["SENT", "OVERDUE"] } }).select("totalAmount amountPaid status"),
  ]);

  const totalOutstanding = invoices.reduce((s, inv) => s + inv.totalAmount - inv.amountPaid, 0);
  const overdueCount = invoices.filter(i => i.status === "OVERDUE").length;

  const recentShipmentsDocs = await Shipment.find()
    .populate("client", "name company")
    .sort({ createdAt: -1 })
    .limit(6)
    .select("shipmentId description status origin destination client updatedAt")
    .lean();
  const recentShipments = recentShipmentsDocs as unknown as Array<{ _id: string; shipmentId: string; description: string; status: string; origin: string; destination: string; client: { name: string; company?: string }; updatedAt: Date }>;

  const stats = [
    { label: "Total Shipments", value: totalShipments, icon: Ship, color: "text-blue-400", bg: "bg-blue-900/20" },
    { label: "Active Shipments", value: activeShipments, icon: Clock, color: "text-yellow-400", bg: "bg-yellow-900/20" },
    { label: "Total Clients", value: totalClients, icon: Users, color: "text-purple-400", bg: "bg-purple-900/20" },
    { label: "Pending Quotes", value: pendingQuotes, icon: MessageSquare, color: "text-gold", bg: "bg-gold/10" },
    { label: "Outstanding", value: formatINR(totalOutstanding), icon: TrendingUp, color: "text-green-400", bg: "bg-green-900/20" },
    { label: "Overdue Invoices", value: overdueCount, icon: AlertCircle, color: "text-red-400", bg: "bg-red-900/20" },
  ];

  const statusColor: Record<string, string> = {
    BOOKING_CONFIRMED: "text-blue-400", CARGO_PICKED_UP: "text-yellow-400", AT_CFS: "text-orange-400",
    ON_VESSEL: "text-purple-400", IN_TRANSIT: "text-indigo-400", ARRIVED_AT_PORT: "text-teal-400",
    UNDER_CUSTOMS_EXAM: "text-red-400", CUSTOMS_CLEARED: "text-green-400", DELIVERED: "text-emerald-400", COMPLETED: "text-ink-secondary",
  };
  const statusLabel: Record<string, string> = {
    BOOKING_CONFIRMED: "Booking Confirmed", CARGO_PICKED_UP: "Picked Up", AT_CFS: "At CFS",
    ON_VESSEL: "On Vessel", IN_TRANSIT: "In Transit", ARRIVED_AT_PORT: "At Port",
    UNDER_CUSTOMS_EXAM: "Customs Exam", CUSTOMS_CLEARED: "Cleared", DELIVERED: "Delivered", COMPLETED: "Completed",
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <p className="section-heading">Admin Portal</p>
        <h1 className="page-heading">Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"}, {session?.user?.name?.split(" ")[0]}</h1>
        <p className="text-ink-secondary text-sm mt-1">{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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

      {/* Quick Actions */}
      <div>
        <p className="section-heading">Quick Actions</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard/admin/shipments?new=1" className="btn-gold text-sm">+ New Shipment</Link>
          <Link href="/dashboard/admin/invoices?new=1" className="btn-ghost text-sm">+ Create Invoice</Link>
          <Link href="/dashboard/admin/quotes" className="btn-ghost text-sm">View Quotes</Link>
          <Link href="/dashboard/admin/clients?new=1" className="btn-ghost text-sm">+ Add Client</Link>
        </div>
      </div>

      {/* Recent Shipments */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="section-heading mb-0">Recent Shipments</p>
          <Link href="/dashboard/admin/shipments" className="text-xs text-gold hover:text-gold-light transition-colors">View all →</Link>
        </div>
        <div className="card-luxury overflow-hidden">
          <table className="table-luxury">
            <thead>
              <tr>
                <th>Shipment ID</th>
                <th>Client</th>
                <th>Route</th>
                <th>Status</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {recentShipments.map((s: {
                _id: string; shipmentId: string; description: string; status: string;
                origin: string; destination: string;
                client: { name: string; company?: string };
                updatedAt: Date;
              }) => (
                <tr key={s._id.toString()}>
                  <td>
                    <Link href={`/dashboard/admin/shipments/${s._id}`} className="text-gold hover:text-gold-light transition-colors font-medium">
                      {s.shipmentId}
                    </Link>
                    <div className="text-xs text-ink-muted truncate max-w-[140px]">{s.description}</div>
                  </td>
                  <td>
                    <div className="text-ink">{s.client?.name}</div>
                    <div className="text-xs text-ink-muted">{s.client?.company}</div>
                  </td>
                  <td className="text-xs">{s.origin} → {s.destination}</td>
                  <td><span className={`text-xs font-medium ${statusColor[s.status] || "text-ink-secondary"}`}>{statusLabel[s.status] || s.status}</span></td>
                  <td className="text-xs text-ink-muted">{new Date(s.updatedAt).toLocaleDateString("en-IN")}</td>
                </tr>
              ))}
              {recentShipments.length === 0 && (
                <tr><td colSpan={5} className="text-center text-ink-muted py-8">No shipments yet. <Link href="/dashboard/admin/shipments?new=1" className="text-gold">Create one →</Link></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
