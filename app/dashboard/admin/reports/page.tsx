"use client";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, CartesianGrid } from "recharts";
import { formatCurrency } from "@/lib/utils";

const COLORS = ["#0E7490", "#D97706", "#059669", "#8B5CF6", "#DC2626", "#0EA5E9", "#F59E0B"];

export default function ReportsPage() {
  const [revenue, setRevenue] = useState<{ month: string; revenue: number }[]>([]);
  const [shipStats, setShipStats] = useState<{ byStatus: { status: string; _count: number }[]; byMode: { mode: string; _count: number }[]; total: number } | null>(null);

  useEffect(() => {
    fetch("/api/reports/revenue").then((r) => r.json()).then(setRevenue);
    fetch("/api/reports/shipments").then((r) => r.json()).then(setShipStats);
  }, []);

  const modeData = shipStats?.byMode.map((m) => ({ name: m.mode, value: m._count })) || [];
  const statusData = shipStats?.byStatus.map((s) => ({ name: s.status.replace(/_/g, " "), value: s._count })) || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-heading font-bold text-primary-deep">Reports</h1>
        <p className="text-text-secondary mt-1">Business analytics and performance metrics</p>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <h2 className="font-heading font-bold text-primary-deep mb-4">Monthly Revenue (Paid Invoices)</h2>
        {revenue.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
              <Bar dataKey="revenue" fill="#0E7490" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-48 flex items-center justify-center text-text-secondary">
            No revenue data yet
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shipments by Mode */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <h2 className="font-heading font-bold text-primary-deep mb-4">Shipments by Mode</h2>
          {modeData.length > 0 ? (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width={180} height={180}>
                <PieChart>
                  <Pie data={modeData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                    {modeData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {modeData.map((m, i) => (
                  <div key={m.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-sm text-primary-deep">{m.name}: <strong>{m.value}</strong></span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-text-secondary">No data</div>
          )}
        </div>

        {/* Shipments by Status */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <h2 className="font-heading font-bold text-primary-deep mb-4">
            Shipments by Status <span className="text-text-secondary font-normal text-sm">(Total: {shipStats?.total || 0})</span>
          </h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {statusData.map((s, i) => (
              <div key={s.name} className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">{s.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${shipStats?.total ? (s.value / shipStats.total) * 100 : 0}%`,
                        background: COLORS[i % COLORS.length],
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-primary-deep w-6 text-right">{s.value}</span>
                </div>
              </div>
            ))}
            {statusData.length === 0 && <p className="text-text-secondary text-sm">No shipments yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
