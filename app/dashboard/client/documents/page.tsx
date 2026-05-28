"use client";
import { useState, useEffect } from "react";
import { FolderOpen, Download, Upload } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Document {
  id: string;
  label: string;
  type: string;
  filePath: string;
  createdAt: string;
  shipment?: { jobNo: string };
}

export default function ClientDocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch documents for client's shipments
    fetch("/api/shipments")
      .then((r) => r.json())
      .then(async (shipments: { id: string }[]) => {
        const docs: Document[] = [];
        for (const s of shipments) {
          const res = await fetch(`/api/documents?shipmentId=${s.id}`);
          if (res.ok) {
            const d = await res.json();
            docs.push(...d);
          }
        }
        setDocuments(docs);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-primary-deep">Documents</h1>
        <p className="text-text-secondary mt-1">All your shipment documents in one place</p>
      </div>

      <div className="bg-white rounded-2xl shadow-card p-6">
        {loading ? (
          <div className="text-center py-12 text-text-secondary">Loading...</div>
        ) : documents.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-text-secondary">No documents uploaded yet.</p>
            <p className="text-text-secondary text-sm mt-1">Documents will appear here once your shipment is active.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 bg-neutral-light rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent-teal/10 rounded-lg flex items-center justify-center">
                    <FolderOpen className="w-5 h-5 text-accent-teal" />
                  </div>
                  <div>
                    <p className="font-medium text-primary-deep text-sm">{doc.label}</p>
                    <p className="text-xs text-text-secondary">{doc.type} • {formatDate(doc.createdAt)}</p>
                  </div>
                </div>
                <a
                  href={doc.filePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-accent-teal hover:underline text-sm"
                >
                  <Download className="w-4 h-4" /> Download
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
