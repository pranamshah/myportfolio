import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Package, FolderOpen, MessageSquare, Receipt } from "lucide-react";
import { STATUS_LABELS, STATUS_COLORS, formatDate } from "@/lib/utils";

export default async function ClientDashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id: string })?.id;
  const userName = session?.user?.name?.split(" ")[0] || "there";

  const [activeShipments, completedShipments, pendingQuotes, documents, recentShipments] = await Promise.all([
    prisma.shipment.count({ where: { clientId: userId, status: { notIn: ["DELIVERED", "COMPLETED"] } } }),
    prisma.shipment.count({ where: { clientId: userId, status: { in: ["DELIVERED", "COMPLETED"] } } }),
    prisma.quote.count({ where: { clientId: userId, status: "PENDING" } }),
    prisma.document.count({ where: { shipment: { clientId: userId } } }),
    prisma.shipment.findMany({
      where: { clientId: userId },
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const kpis = [
    { label: "Active Shipments", value: activeShipments, icon: Package, color: "bg-blue-500", link: "/dashboard/client/shipments" },
    { label: "Completed", value: completedShipments, icon: Package, color: "bg-green-500", link: "/dashboard/client/shipments" },
    { label: "Pending Quotes", value: pendingQuotes, icon: MessageSquare, color: "bg-yellow-500", link: "/quote" },
    { label: "Documents", value: documents, icon: FolderOpen, color: "bg-purple-500", link: "/dashboard/client/documents" },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-primary-deep to-primary-ocean rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-heading font-bold">Welcome back, {userName}! 👋</h1>
        <p className="text-gray-300 mt-1">Track your shipments, download documents, and manage your invoices.</p>
        <div className="flex gap-3 mt-4">
          <Link href="/track" className="bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-lg text-sm font-medium">
            Track Shipment
          </Link>
          <Link href="/quote" className="bg-accent-teal hover:bg-opacity-90 transition-colors px-4 py-2 rounded-lg text-sm font-medium">
            Get Quote
          </Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Link key={kpi.label} href={kpi.link} className="bg-white rounded-2xl shadow-card p-5 hover:shadow-lg transition-shadow">
            <div className={`w-10 h-10 ${kpi.color} rounded-xl flex items-center justify-center mb-3`}>
              <kpi.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-heading font-bold text-primary-deep">{kpi.value}</p>
            <p className="text-text-secondary text-sm mt-1">{kpi.label}</p>
          </Link>
        ))}
      </div>

      {/* Recent Shipments */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-heading font-bold text-primary-deep">Recent Shipments</h2>
          <Link href="/dashboard/client/shipments" className="text-accent-teal text-sm hover:underline">View all</Link>
        </div>
        {recentShipments.length === 0 ? (
          <div className="p-10 text-center">
            <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-text-secondary">No shipments yet. Contact us to get started.</p>
            <Link href="/quote" className="btn-primary text-sm mt-4 inline-block">Get a Quote</Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-neutral-light">
              <tr>
                <th className="text-left px-5 py-3 text-text-secondary font-medium">Job No</th>
                <th className="text-left px-5 py-3 text-text-secondary font-medium">Route</th>
                <th className="text-left px-5 py-3 text-text-secondary font-medium">Status</th>
                <th className="text-left px-5 py-3 text-text-secondary font-medium">ETA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentShipments.map((s) => (
                <tr key={s.id} className="hover:bg-neutral-light/50">
                  <td className="px-5 py-3">
                    <Link href={`/dashboard/client/shipments/${s.id}`} className="font-mono text-accent-teal hover:underline font-semibold">
                      {s.jobNo}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-text-secondary">{s.portLoading || "—"} → {s.portDischarge || "—"}</td>
                  <td className="px-5 py-3">
                    <span className={`badge ${STATUS_COLORS[s.status]}`}>{STATUS_LABELS[s.status]}</span>
                  </td>
                  <td className="px-5 py-3 text-text-secondary">{formatDate(s.eta)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
