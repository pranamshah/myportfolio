import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Package, Users, MessageSquare, TrendingUp, Plus, AlertCircle } from "lucide-react";
import { STATUS_LABELS, STATUS_COLORS, formatCurrency, formatDate } from "@/lib/utils";

export default async function AdminOverviewPage() {
  const session = await getServerSession(authOptions);
  const userName = session?.user?.name?.split(" ")[0] || "Admin";

  const [
    activeShipments,
    newQuotesToday,
    totalClients,
    recentShipments,
    pendingClearance,
    recentQuotes,
  ] = await Promise.all([
    prisma.shipment.count({ where: { status: { notIn: ["DELIVERED", "COMPLETED"] } } }),
    prisma.quote.count({
      where: {
        createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        status: "PENDING",
      },
    }),
    prisma.user.count({ where: { role: "CLIENT" } }),
    prisma.shipment.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { client: { select: { name: true } } },
    }),
    prisma.shipment.count({ where: { status: "UNDER_CUSTOMS_EXAMINATION" } }),
    prisma.quote.findMany({ take: 5, orderBy: { createdAt: "desc" }, where: { status: "PENDING" } }),
  ]);

  const kpis = [
    { label: "Active Shipments", value: activeShipments, icon: Package, color: "bg-blue-500", link: "/dashboard/admin/shipments" },
    { label: "Pending Clearance", value: pendingClearance, icon: AlertCircle, color: "bg-orange-500", link: "/dashboard/admin/shipments?status=UNDER_CUSTOMS_EXAMINATION" },
    { label: "New Quotes Today", value: newQuotesToday, icon: MessageSquare, color: "bg-accent-teal", link: "/dashboard/admin/quotes" },
    { label: "Total Clients", value: totalClients, icon: Users, color: "bg-purple-500", link: "/dashboard/admin/clients" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-primary-deep">
            Good morning, {userName} 👋
          </h1>
          <p className="text-text-secondary mt-1">Here&apos;s what&apos;s happening with Navkar Exim today.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/admin/shipments/new" className="btn-primary flex items-center gap-2 text-sm py-2">
            <Plus className="w-4 h-4" /> New Shipment
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Link key={kpi.label} href={kpi.link} className="bg-white rounded-2xl shadow-card p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${kpi.color} rounded-xl flex items-center justify-center`}>
                <kpi.icon className="w-5 h-5 text-white" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-3xl font-heading font-bold text-primary-deep">{kpi.value}</p>
            <p className="text-text-secondary text-sm mt-1">{kpi.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Shipments */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-heading font-bold text-primary-deep">Recent Shipments</h2>
            <Link href="/dashboard/admin/shipments" className="text-accent-teal text-sm hover:underline">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-light">
                <tr>
                  <th className="text-left px-5 py-3 text-text-secondary font-medium">Job No</th>
                  <th className="text-left px-5 py-3 text-text-secondary font-medium">Client</th>
                  <th className="text-left px-5 py-3 text-text-secondary font-medium">Route</th>
                  <th className="text-left px-5 py-3 text-text-secondary font-medium">Status</th>
                  <th className="text-left px-5 py-3 text-text-secondary font-medium">ETA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentShipments.map((s) => (
                  <tr key={s.id} className="hover:bg-neutral-light/50 transition-colors">
                    <td className="px-5 py-3">
                      <Link href={`/dashboard/admin/shipments/${s.id}`} className="font-mono text-accent-teal hover:underline font-medium">
                        {s.jobNo}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-primary-deep">{s.client.name}</td>
                    <td className="px-5 py-3 text-text-secondary">{s.portLoading || "—"} → {s.portDischarge || "—"}</td>
                    <td className="px-5 py-3">
                      <span className={`badge ${STATUS_COLORS[s.status]}`}>
                        {STATUS_LABELS[s.status]}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-text-secondary">{formatDate(s.eta)}</td>
                  </tr>
                ))}
                {recentShipments.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-text-secondary">
                      No shipments yet. <Link href="/dashboard/admin/shipments/new" className="text-accent-teal hover:underline">Create one</Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Quotes */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-heading font-bold text-primary-deep">Pending Quotes</h2>
            <Link href="/dashboard/admin/quotes" className="text-accent-teal text-sm hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentQuotes.map((q) => (
              <div key={q.id} className="p-4 hover:bg-neutral-light/50 transition-colors">
                <p className="font-medium text-primary-deep text-sm">{q.name}</p>
                <p className="text-text-secondary text-xs">{q.origin} → {q.destination}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="badge bg-yellow-100 text-yellow-800">{q.mode}</span>
                  <span className="text-xs text-text-secondary">{formatDate(q.createdAt)}</span>
                </div>
              </div>
            ))}
            {recentQuotes.length === 0 && (
              <div className="p-8 text-center text-text-secondary text-sm">No pending quotes</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
