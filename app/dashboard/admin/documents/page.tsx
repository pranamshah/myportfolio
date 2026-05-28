"use client";
import { useState, useEffect } from "react";
import { FolderOpen, Search } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Document {
  id: string;
  label: string;
  type: string;
  filePath: string;
  createdAt: string;
}

export default function AdminDocumentsPage() {
  const [shipments, setShipments] = useState<{ id: string; jobNo: string; documents: Document[] }[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/shipments")
      .then((r) => r.json())
      .then(async (subs: { id: string; jobNo: string }[]) => {
        const enriched = await Promise.all(
          subs.map(async (s) => {
            const res = await fetch(`/api/documents?shipmentId=${s.id}`);
            const docs = res.ok ? await res.json() : [];
            return { ...s, documents: docs };
          })
        );
        setShipments(enriched.filter((s) => s.documents.length > 0));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-primary-deep">Document Management</h1>
        <p className="text-text-secondary mt-1">All shipment documents</p>
      </div>

      <div className="bg-white rounded-2xl shadow-card p-4 flex items-center gap-3">
        <Search className="w-4 h-4 text-text-secondary" />
        <input className="flex-1 outline-none text-sm" placeholder="Search documents..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="text-center py-12 text-text-secondary">Loading...</div>
      ) : shipments.length === 0 ? (
        <div className="text-center py-12">
          <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-text-secondary">No documents uploaded yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {shipments.map((s) => (
            <div key={s.id} className="bg-white rounded-2xl shadow-card p-5">
              <h3 className="font-mono font-bold text-accent-teal mb-3">{s.jobNo}</h3>
              <div className="space-y-2">
                {s.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-neutral-light rounded-lg">
                    <div>
                      <p className="font-medium text-sm text-primary-deep">{doc.label}</p>
                      <p className="text-xs text-text-secondary">{doc.type} • {formatDate(doc.createdAt)}</p>
                    </div>
                    <a href={doc.filePath} className="text-accent-teal text-sm hover:underline" target="_blank">Download</a>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
