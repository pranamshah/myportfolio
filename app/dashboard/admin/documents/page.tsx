"use client";
import { useState, useEffect, useCallback } from "react";
import { Search, Download, CheckCircle, XCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Doc { _id: string; name: string; originalName: string; filePath: string; category: string; fileSize: number; fileType: string; isVisibleToClient: boolean; createdAt: string; shipment: { shipmentId: string; description: string }; uploadedBy: { name: string }; description?: string; }

const CATS = ["","BL","INVOICE","PACKING_LIST","CUSTOMS","INSURANCE","CERTIFICATE","OTHER"];

export default function DocumentsPage() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/documents");
    const d = await res.json();
    setDocs(Array.isArray(d) ? d : []);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = docs.filter(d =>
    (!catFilter || d.category === catFilter) &&
    (d.name.toLowerCase().includes(search.toLowerCase()) ||
     d.shipment?.shipmentId?.toLowerCase().includes(search.toLowerCase()) ||
     d.shipment?.description?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <p className="section-heading">Document Archive</p>
        <h1 className="page-heading">All Documents</h1>
        <p className="text-black/40 text-sm mt-1">Documents are never deleted. Upload from individual shipment pages.</p>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search documents..." className="input-luxury pl-9" />
        </div>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="input-luxury w-auto min-w-[160px]">
          {CATS.map(c => <option key={c} value={c}>{c || "All Categories"}</option>)}
        </select>
      </div>

      <div className="card-luxury overflow-hidden">
        <table className="table-luxury">
          <thead>
            <tr>
              <th>Document</th>
              <th>Shipment</th>
              <th>Category</th>
              <th>Size</th>
              <th>Client Visible</th>
              <th>Uploaded By</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(d => (
              <tr key={d._id}>
                <td>
                  <div className="text-sm text-black font-medium">{d.name}</div>
                  <div className="text-xs text-black/40">{d.originalName}</div>
                  {d.description && <div className="text-xs text-black/40">{d.description}</div>}
                </td>
                <td>
                  <div className="text-sm text-black">{d.shipment?.shipmentId}</div>
                  <div className="text-xs text-black/40 truncate max-w-[140px]">{d.shipment?.description}</div>
                </td>
                <td><span className="text-xs bg-black/5 px-2 py-0.5 rounded text-black/60">{d.category}</span></td>
                <td className="text-xs text-black/40">{(d.fileSize / 1024).toFixed(0)} KB</td>
                <td>
                  {d.isVisibleToClient
                    ? <CheckCircle size={14} className="text-green-400" />
                    : <XCircle size={14} className="text-black/40" />}
                </td>
                <td className="text-xs text-black/60">{d.uploadedBy?.name}</td>
                <td className="text-xs text-black/40">{formatDate(d.createdAt)}</td>
                <td>
                  <a href={d.filePath} target="_blank" className="inline-flex items-center gap-1 text-xs text-secondary hover:text-black transition-colors">
                    <Download size={12} /> Download
                  </a>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={8} className="text-center text-black/40 py-10">No documents found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
