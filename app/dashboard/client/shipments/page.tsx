"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { StatusBadge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

interface Shipment { _id: string; shipmentId: string; description: string; status: string; origin: string; destination: string; etd?: string; eta?: string; blNo?: string; containerNo?: string; vessel?: string; updatedAt: string; }

export default function ClientShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/shipments").then(r => r.json()).then(d => setShipments(Array.isArray(d) ? d : []));
  }, []);

  const filtered = shipments.filter(s =>
    s.shipmentId.toLowerCase().includes(search.toLowerCase()) ||
    s.description.toLowerCase().includes(search.toLowerCase()) ||
    (s.blNo?.toLowerCase().includes(search.toLowerCase()) ?? false)
  );

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <p className="section-heading">My Shipments</p>
        <h1 className="page-heading">Shipment Tracking</h1>
      </div>

      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by ID, description or BL..." className="input-luxury pl-9" />
      </div>

      <div className="space-y-3">
        {filtered.map(s => (
          <Link key={s._id} href={`/dashboard/client/shipments/${s._id}`} className="card-luxury p-5 block hover:border-gold/30 transition-all duration-200 group">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-gold font-medium group-hover:text-gold-light transition-colors">{s.shipmentId}</span>
                  <StatusBadge status={s.status} />
                </div>
                <p className="text-ink text-sm mb-3">{s.description}</p>
                <div className="flex flex-wrap gap-4 text-xs text-ink-muted">
                  {s.blNo && <span>B/L: <span className="text-ink-secondary">{s.blNo}</span></span>}
                  {s.containerNo && <span>Container: <span className="text-ink-secondary">{s.containerNo}</span></span>}
                  {s.vessel && <span>Vessel: <span className="text-ink-secondary">{s.vessel}</span></span>}
                </div>
              </div>
              <div className="text-right flex-shrink-0 text-sm">
                <div className="text-ink font-medium">{s.origin}</div>
                <div className="text-ink-muted text-xs my-1">↓</div>
                <div className="text-ink font-medium">{s.destination}</div>
                <div className="mt-2 text-xs text-ink-muted">
                  {s.eta ? `ETA: ${formatDate(s.eta)}` : `Updated: ${formatDate(s.updatedAt)}`}
                </div>
              </div>
            </div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <div className="card-luxury p-10 text-center text-ink-muted">No shipments found.</div>
        )}
      </div>
    </div>
  );
}
