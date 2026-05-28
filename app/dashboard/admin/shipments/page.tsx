"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Filter, Package } from "lucide-react";
import { STATUS_LABELS, STATUS_COLORS, formatDate } from "@/lib/utils";

interface Shipment {
  id: string;
  jobNo: string;
  mode: string;
  movement: string;
  status: string;
  portLoading?: string;
  portDischarge?: string;
  vessel?: string;
  eta?: string;
  client: { name: string };
  blNo?: string;
  awbNo?: string;
}

export default function ShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);
    fetch(`/api/shipments?${params}`)
      .then((r) => r.json())
      .then(setShipments)
      .finally(() => setLoading(false));
  }, [statusFilter]);

  const filtered = shipments.filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      s.jobNo.toLowerCase().includes(q) ||
      s.client.name.toLowerCase().includes(q) ||
      (s.blNo?.toLowerCase().includes(q)) ||
      (s.vessel?.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-primary-deep">Shipments</h1>
          <p className="text-text-secondary mt-1">{shipments.length} total shipments</p>
        </div>
        <Link href="/dashboard/admin/shipments/new" className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> New Shipment
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-card p-4 flex flex-wrap gap-4">
        <div className="flex items-center gap-2 flex-1 min-w-48">
          <Search className="w-4 h-4 text-text-secondary" />
          <input
            className="flex-1 outline-none text-sm text-primary-deep placeholder-text-secondary"
            placeholder="Search job no, client, BL no..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="select text-sm w-auto"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <select className="select text-sm w-auto">
          <option value="">All Modes</option>
          <option value="SEA">Sea</option>
          <option value="AIR">Air</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-light border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 text-text-secondary font-medium">Job No</th>
                <th className="text-left px-5 py-3 text-text-secondary font-medium">Client</th>
                <th className="text-left px-5 py-3 text-text-secondary font-medium">Route</th>
                <th className="text-left px-5 py-3 text-text-secondary font-medium">Mode</th>
                <th className="text-left px-5 py-3 text-text-secondary font-medium">BL/AWB</th>
                <th className="text-left px-5 py-3 text-text-secondary font-medium">Status</th>
                <th className="text-left px-5 py-3 text-text-secondary font-medium">ETA</th>
                <th className="text-left px-5 py-3 text-text-secondary font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={8} className="px-5 py-8 text-center text-text-secondary">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center">
                    <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-text-secondary">No shipments found</p>
                    <Link href="/dashboard/admin/shipments/new" className="text-accent-teal hover:underline text-sm mt-1 inline-block">
                      Create your first shipment
                    </Link>
                  </td>
                </tr>
              ) : filtered.map((s) => (
                <tr key={s.id} className="hover:bg-neutral-light/50 transition-colors">
                  <td className="px-5 py-3">
                    <Link href={`/dashboard/admin/shipments/${s.id}`} className="font-mono text-accent-teal hover:underline font-semibold">
                      {s.jobNo}
                    </Link>
                  </td>
                  <td className="px-5 py-3 font-medium text-primary-deep">{s.client.name}</td>
                  <td className="px-5 py-3 text-text-secondary">{s.portLoading || "—"} → {s.portDischarge || "—"}</td>
                  <td className="px-5 py-3">
                    <span className={`badge ${s.mode === "SEA" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"}`}>
                      {s.mode}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-text-secondary">{s.blNo || s.awbNo || "—"}</td>
                  <td className="px-5 py-3">
                    <span className={`badge ${STATUS_COLORS[s.status]}`}>
                      {STATUS_LABELS[s.status]}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-text-secondary">{formatDate(s.eta)}</td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <Link href={`/dashboard/admin/shipments/${s.id}`} className="text-accent-teal hover:underline text-xs font-medium">View</Link>
                      <Link href={`/dashboard/admin/shipments/${s.id}/edit`} className="text-text-secondary hover:text-primary-deep text-xs">Edit</Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
