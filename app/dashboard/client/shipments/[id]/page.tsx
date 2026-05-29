"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { StatusBadge } from "@/components/ui/Badge";
import { formatDate, formatINR, STATUS_LABEL } from "@/lib/utils";

interface Shipment {
  _id: string; shipmentId: string; description: string; status: string;
  origin: string; destination: string; portOfLoading: string; portOfDischarge: string;
  vessel?: string; voyageNo?: string; blNo?: string; containerNo?: string;
  packages?: number; grossWeight?: number; cbm?: number; commodity?: string; incoterms?: string;
  etd?: string; eta?: string; notes?: string;
  timeline: { status: string; date: string; note?: string }[];
}
interface Doc { _id: string; name: string; filePath: string; category: string; fileSize: number; createdAt: string; }
interface Invoice { _id: string; invoiceNo: string; invoiceType: string; totalAmount: number; status: string; invoiceDate: string; }

export default function ClientShipmentDetail() {
  const { id } = useParams();
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [docs, setDocs] = useState<Doc[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const load = useCallback(async () => {
    const [s, d, i] = await Promise.all([
      fetch(`/api/shipments/${id}`).then(r => r.json()),
      fetch(`/api/documents?shipment=${id}`).then(r => r.json()),
      fetch(`/api/invoices?shipment=${id}`).then(r => r.json()),
    ]);
    setShipment(s); setDocs(Array.isArray(d) ? d : []); setInvoices(Array.isArray(i) ? i : []);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  if (!shipment) return <div className="p-8 text-ink-muted">Loading...</div>;

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <Link href="/dashboard/client/shipments" className="inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-gold transition-colors mb-3">
          <ArrowLeft size={12} /> Back to Shipments
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="page-heading">{shipment.shipmentId}</h1>
          <StatusBadge status={shipment.status} />
        </div>
        <p className="text-ink-secondary text-sm mt-1">{shipment.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {/* Route card */}
          <div className="card-luxury p-5">
            <p className="section-heading">Route</p>
            <div className="flex items-center gap-3">
              <div className="text-center"><div className="text-gold font-medium text-sm">{shipment.portOfLoading || shipment.origin}</div><div className="text-xs text-ink-muted">Port of Loading</div></div>
              <div className="flex-1 h-px bg-gradient-to-r from-gold/40 via-gold/20 to-gold/40" />
              <div className="text-center"><div className="text-gold font-medium text-sm">{shipment.portOfDischarge || shipment.destination}</div><div className="text-xs text-ink-muted">Port of Discharge</div></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-5">
              {[
                ["Vessel", shipment.vessel], ["Voyage No.", shipment.voyageNo],
                ["B/L No.", shipment.blNo], ["Container", shipment.containerNo],
                ["ETD", formatDate(shipment.etd)], ["ETA", formatDate(shipment.eta)],
                ["Incoterms", shipment.incoterms], ["Commodity", shipment.commodity],
                ["Packages", shipment.packages?.toString()], ["Gross Weight", shipment.grossWeight ? `${shipment.grossWeight} kg` : undefined],
              ].filter(([, v]) => v && v !== "—").map(([l, v]) => (
                <div key={l as string}>
                  <div className="text-xs text-ink-muted">{l}</div>
                  <div className="text-sm text-ink font-medium mt-0.5">{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Documents */}
          {docs.length > 0 && (
            <div className="card-luxury overflow-hidden">
              <div className="px-5 py-4 border-b border-surface-hover">
                <p className="section-heading mb-0">Documents ({docs.length})</p>
              </div>
              <table className="table-luxury">
                <thead><tr><th>Document</th><th>Category</th><th>Size</th><th>Date</th><th></th></tr></thead>
                <tbody>
                  {docs.map(d => (
                    <tr key={d._id}>
                      <td className="text-sm text-ink">{d.name}</td>
                      <td><span className="text-xs bg-surface-hover px-2 py-0.5 rounded text-ink-secondary">{d.category}</span></td>
                      <td className="text-xs text-ink-muted">{(d.fileSize / 1024).toFixed(0)} KB</td>
                      <td className="text-xs text-ink-muted">{formatDate(d.createdAt)}</td>
                      <td>
                        <a href={d.filePath} target="_blank" className="inline-flex items-center gap-1 text-xs text-gold hover:text-gold-light">
                          <Download size={12} /> Download
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Invoices */}
          {invoices.length > 0 && (
            <div className="card-luxury overflow-hidden">
              <div className="px-5 py-4 border-b border-surface-hover">
                <p className="section-heading mb-0">Invoices ({invoices.length})</p>
              </div>
              <table className="table-luxury">
                <thead><tr><th>Invoice No</th><th>Type</th><th>Amount</th><th>Status</th><th>Date</th><th></th></tr></thead>
                <tbody>
                  {invoices.map(inv => (
                    <tr key={inv._id}>
                      <td className="font-medium text-sm">{inv.invoiceNo}</td>
                      <td className="text-xs text-ink-secondary">{inv.invoiceType}</td>
                      <td className="font-medium text-sm">{formatINR(inv.totalAmount)}</td>
                      <td className="text-xs text-ink-secondary">{inv.status}</td>
                      <td className="text-xs text-ink-muted">{formatDate(inv.invoiceDate)}</td>
                      <td>
                        <a href={`/api/invoices/${inv._id}/pdf`} target="_blank" className="inline-flex items-center gap-1 text-xs text-gold hover:text-gold-light">
                          <Download size={12} /> PDF
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Timeline */}
        <div className="card-luxury p-5">
          <p className="section-heading">Shipment Timeline</p>
          <div className="relative">
            <div className="absolute left-2.5 top-0 bottom-0 w-px bg-surface-hover" />
            <div className="space-y-5">
              {[...shipment.timeline].reverse().map((t, i) => (
                <div key={i} className="flex gap-4 relative">
                  <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 z-10 ${i === 0 ? "border-gold bg-gold/20" : "border-surface-hover bg-surface-primary"}`} />
                  <div>
                    <div className={`text-sm font-medium ${i === 0 ? "text-gold" : "text-ink-secondary"}`}>{STATUS_LABEL[t.status] || t.status}</div>
                    {t.note && <div className="text-xs text-ink-muted mt-0.5">{t.note}</div>}
                    <div className="text-xs text-ink-muted mt-0.5">{formatDate(t.date)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
