"use client";
import { useState, useEffect } from "react";
import { Search, Download } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Doc { _id: string; name: string; filePath: string; category: string; fileSize: number; createdAt: string; shipment: { shipmentId: string; description: string }; description?: string; }

export default function ClientDocumentsPage() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/documents").then(r => r.json()).then(d => setDocs(Array.isArray(d) ? d : []));
  }, []);

  const filtered = docs.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.shipment?.shipmentId?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <p className="section-heading">Document Center</p>
        <h1 className="page-heading">My Documents</h1>
        <p className="text-ink-secondary text-sm mt-1">Download B/L copies, invoices, packing lists, and customs documents.</p>
      </div>

      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search documents..." className="input-luxury pl-9" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(d => (
          <div key={d._id} className="card-luxury p-4 hover:border-gold/20 transition-all">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-ink truncate">{d.name}</div>
                <div className="text-xs text-ink-muted mt-0.5">{d.shipment?.shipmentId} — {d.category}</div>
              </div>
              <span className="text-xs bg-surface-hover px-2 py-0.5 rounded text-ink-secondary flex-shrink-0">{d.category}</span>
            </div>
            {d.description && <p className="text-xs text-ink-muted mb-3">{d.description}</p>}
            <div className="flex items-center justify-between text-xs text-ink-muted">
              <span>{(d.fileSize / 1024).toFixed(0)} KB · {formatDate(d.createdAt)}</span>
              <a href={d.filePath} target="_blank" className="inline-flex items-center gap-1 text-gold hover:text-gold-light transition-colors">
                <Download size={12} /> Download
              </a>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-3 card-luxury p-10 text-center text-ink-muted">No documents available yet.</div>
        )}
      </div>
    </div>
  );
}
