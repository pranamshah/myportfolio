"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Package, Search } from "lucide-react";
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
  liner?: string;
  blNo?: string;
  awbNo?: string;
}

export default function ClientShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetch("/api/shipments").then((r) => r.json()).then(setShipments).finally(() => setLoading(false));
  }, []);

  const filtered = shipments.filter((s) => {
    if (filter && s.status !== filter) return false;
    if (!search) return true;
    return s.jobNo.toLowerCase().includes(search.toLowerCase()) ||
      s.portLoading?.toLowerCase().includes(search.toLowerCase()) ||
      s.vessel?.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-primary-deep">My Shipments</h1>
        <p className="text-text-secondary mt-1">{shipments.length} total shipments</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="bg-white rounded-xl shadow-card p-3 flex items-center gap-2 flex-1 min-w-48">
          <Search className="w-4 h-4 text-text-secondary" />
          <input className="flex-1 outline-none text-sm" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="select w-auto" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All Statuses</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12 text-text-secondary">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s) => (
            <div key={s.id} className="bg-white rounded-2xl shadow-card p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <Link href={`/dashboard/client/shipments/${s.id}`} className="font-mono font-bold text-accent-teal hover:underline">
                  {s.jobNo}
                </Link>
                <span className={`badge text-xs ${STATUS_COLORS[s.status]}`}>{STATUS_LABELS[s.status]}</span>
              </div>
              <p className="text-text-secondary text-sm">{s.portLoading || "—"} → {s.portDischarge || "—"}</p>
              {s.liner && <p className="text-text-secondary text-xs mt-1">{s.liner}</p>}
              {s.vessel && <p className="text-xs text-text-secondary">Vessel: {s.vessel}</p>}
              <div className="flex items-center justify-between mt-4">
                <div className="flex gap-2">
                  <span className={`badge text-xs ${s.mode === "SEA" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"}`}>{s.mode}</span>
                  <span className="badge text-xs bg-gray-100 text-gray-600">{s.movement}</span>
                </div>
                <p className="text-xs text-text-secondary">ETA: {formatDate(s.eta)}</p>
              </div>
              <Link href={`/dashboard/client/shipments/${s.id}`} className="mt-3 block text-center btn-secondary text-xs py-2">
                View Details
              </Link>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-3 text-center py-12">
              <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-text-secondary">No shipments found</p>
              <Link href="/quote" className="btn-primary text-sm mt-3 inline-block">Request a Quote</Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
