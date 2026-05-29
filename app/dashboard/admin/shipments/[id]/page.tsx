"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload, FileText, CheckCircle, Clock } from "lucide-react";
import { StatusBadge, InvoiceBadge } from "@/components/ui/Badge";
import { formatDate, formatINR, STATUS_LABEL } from "@/lib/utils";
import Modal from "@/components/ui/Modal";

const STATUSES = ["BOOKING_CONFIRMED","CARGO_PICKED_UP","AT_CFS","ON_VESSEL","IN_TRANSIT","ARRIVED_AT_PORT","UNDER_CUSTOMS_EXAM","CUSTOMS_CLEARED","DELIVERED","COMPLETED"];
const DOC_CATS = ["BL","INVOICE","PACKING_LIST","CUSTOMS","INSURANCE","CERTIFICATE","OTHER"];

interface Shipment {
  _id: string; shipmentId: string; description: string; status: string;
  origin: string; destination: string; portOfLoading: string; portOfDischarge: string;
  vessel?: string; voyageNo?: string; blNo?: string; containerNo?: string; sealNo?: string;
  packages?: number; grossWeight?: number; cbm?: number; commodity?: string; incoterms?: string;
  etd?: string; eta?: string; notes?: string;
  client: { _id: string; name: string; company?: string; email: string; phone?: string; address?: string; gst?: string; };
  timeline: { status: string; date: string; note?: string }[];
}

interface Doc { _id: string; name: string; originalName: string; filePath: string; category: string; fileSize: number; createdAt: string; isVisibleToClient: boolean; }
interface Invoice { _id: string; invoiceNo: string; invoiceType: string; totalAmount: number; status: string; invoiceDate: string; }

export default function ShipmentDetail() {
  const { id } = useParams();
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [docs, setDocs] = useState<Doc[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [uploadModal, setUploadModal] = useState(false);
  const [statusModal, setStatusModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [uploadForm, setUploadForm] = useState({ category: "OTHER", description: "", isVisibleToClient: true, name: "" });
  const [file, setFile] = useState<File | null>(null);

  const load = useCallback(async () => {
    const [shipRes, docRes, invRes] = await Promise.all([
      fetch(`/api/shipments/${id}`),
      fetch(`/api/documents?shipment=${id}`),
      fetch(`/api/invoices?shipment=${id}`),
    ]);
    const [s, d, inv] = await Promise.all([shipRes.json(), docRes.json(), invRes.json()]);
    setShipment(s); setDocs(Array.isArray(d) ? d : []); setInvoices(Array.isArray(inv) ? inv : []);
    setNewStatus(s.status);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  async function updateStatus() {
    await fetch(`/api/shipments/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: newStatus, statusNote }) });
    setStatusModal(false); setStatusNote(""); load();
  }

  async function uploadDoc() {
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("shipment", id as string);
    fd.append("category", uploadForm.category);
    fd.append("description", uploadForm.description);
    fd.append("isVisibleToClient", String(uploadForm.isVisibleToClient));
    fd.append("name", uploadForm.name || file.name);
    await fetch("/api/documents", { method: "POST", body: fd });
    setUploading(false); setUploadModal(false); setFile(null);
    setUploadForm({ category: "OTHER", description: "", isVisibleToClient: true, name: "" });
    load();
  }

  if (!shipment) return <div className="p-8 text-ink-muted">Loading...</div>;

  const fields = [
    { label: "Shipment ID", value: shipment.shipmentId },
    { label: "B/L Number", value: shipment.blNo },
    { label: "Container No.", value: shipment.containerNo },
    { label: "Seal No.", value: shipment.sealNo },
    { label: "Vessel", value: shipment.vessel },
    { label: "Voyage No.", value: shipment.voyageNo },
    { label: "Port of Loading", value: shipment.portOfLoading },
    { label: "Port of Discharge", value: shipment.portOfDischarge },
    { label: "Incoterms", value: shipment.incoterms },
    { label: "Commodity", value: shipment.commodity },
    { label: "Packages", value: shipment.packages },
    { label: "Gross Weight", value: shipment.grossWeight ? `${shipment.grossWeight} kg` : undefined },
    { label: "Volume", value: shipment.cbm ? `${shipment.cbm} CBM` : undefined },
    { label: "ETD", value: formatDate(shipment.etd) },
    { label: "ETA", value: formatDate(shipment.eta) },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link href="/dashboard/admin/shipments" className="inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-gold transition-colors mb-3">
            <ArrowLeft size={12} /> Back to Shipments
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="page-heading">{shipment.shipmentId}</h1>
            <StatusBadge status={shipment.status} />
          </div>
          <p className="text-ink-secondary text-sm mt-1">{shipment.description}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setStatusModal(true)} className="btn-ghost text-sm">Update Status</button>
          <button onClick={() => setUploadModal(true)} className="btn-gold flex items-center gap-2 text-sm">
            <Upload size={14} /> Upload Doc
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-5">
          {/* Details */}
          <div className="card-luxury p-5">
            <p className="section-heading">Shipment Details</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3">
              {fields.filter(f => f.value).map(f => (
                <div key={f.label}>
                  <div className="text-xs text-ink-muted">{f.label}</div>
                  <div className="text-sm text-ink font-medium mt-0.5">{String(f.value)}</div>
                </div>
              ))}
            </div>
            {shipment.notes && (
              <div className="mt-4 pt-4 border-t border-surface-hover">
                <div className="text-xs text-ink-muted mb-1">Notes</div>
                <p className="text-sm text-ink-secondary">{shipment.notes}</p>
              </div>
            )}
          </div>

          {/* Route */}
          <div className="card-luxury p-5">
            <p className="section-heading">Route</p>
            <div className="flex items-center gap-3 text-sm">
              <div className="text-center"><div className="text-gold font-medium">{shipment.origin}</div><div className="text-xs text-ink-muted">Origin</div></div>
              <div className="flex-1 h-px bg-gradient-to-r from-gold/40 via-gold/20 to-gold/40" />
              <div className="text-center"><div className="text-gold font-medium">{shipment.destination}</div><div className="text-xs text-ink-muted">Destination</div></div>
            </div>
          </div>

          {/* Documents */}
          <div className="card-luxury overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-surface-hover">
              <p className="section-heading mb-0">Documents ({docs.length})</p>
              <button onClick={() => setUploadModal(true)} className="text-xs text-gold hover:text-gold-light transition-colors flex items-center gap-1">
                <Upload size={12} /> Upload
              </button>
            </div>
            {docs.length === 0 ? (
              <div className="p-8 text-center text-ink-muted text-sm">No documents uploaded yet.</div>
            ) : (
              <table className="table-luxury">
                <thead><tr><th>Name</th><th>Category</th><th>Size</th><th>Date</th><th>Visible</th><th></th></tr></thead>
                <tbody>
                  {docs.map(d => (
                    <tr key={d._id}>
                      <td className="text-sm text-ink">{d.name}</td>
                      <td><span className="text-xs bg-surface-hover px-2 py-0.5 rounded text-ink-secondary">{d.category}</span></td>
                      <td className="text-xs text-ink-muted">{(d.fileSize / 1024).toFixed(0)} KB</td>
                      <td className="text-xs text-ink-muted">{formatDate(d.createdAt)}</td>
                      <td>{d.isVisibleToClient ? <CheckCircle size={14} className="text-green-400" /> : <Clock size={14} className="text-ink-muted" />}</td>
                      <td><a href={d.filePath} target="_blank" className="text-xs text-gold hover:text-gold-light">Download</a></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Invoices */}
          <div className="card-luxury overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-surface-hover">
              <p className="section-heading mb-0">Invoices ({invoices.length})</p>
              <Link href={`/dashboard/admin/invoices?new=1&shipment=${id}`} className="text-xs text-gold hover:text-gold-light transition-colors">+ Create Invoice</Link>
            </div>
            {invoices.length === 0 ? (
              <div className="p-6 text-center text-ink-muted text-sm">No invoices for this shipment.</div>
            ) : (
              <table className="table-luxury">
                <thead><tr><th>Invoice No</th><th>Type</th><th>Amount</th><th>Status</th><th>Date</th><th></th></tr></thead>
                <tbody>
                  {invoices.map(inv => (
                    <tr key={inv._id}>
                      <td className="font-medium text-sm">{inv.invoiceNo}</td>
                      <td className="text-xs text-ink-secondary">{inv.invoiceType}</td>
                      <td className="font-medium text-sm">{formatINR(inv.totalAmount)}</td>
                      <td><InvoiceBadge status={inv.status} /></td>
                      <td className="text-xs text-ink-muted">{formatDate(inv.invoiceDate)}</td>
                      <td><Link href={`/dashboard/admin/invoices/${inv._id}`} className="text-xs text-gold hover:text-gold-light">View</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">
          {/* Client */}
          <div className="card-luxury p-5">
            <p className="section-heading">Client</p>
            <div className="space-y-2 text-sm">
              <div className="text-ink font-medium">{shipment.client?.name}</div>
              {shipment.client?.company && <div className="text-ink-secondary">{shipment.client.company}</div>}
              {shipment.client?.email && <div className="text-ink-muted">{shipment.client.email}</div>}
              {shipment.client?.phone && <div className="text-ink-muted">{shipment.client.phone}</div>}
              {shipment.client?.gst && <div className="text-xs text-ink-muted">GST: {shipment.client.gst}</div>}
              {shipment.client?.address && <div className="text-xs text-ink-muted mt-2">{shipment.client.address}</div>}
            </div>
          </div>

          {/* Timeline */}
          <div className="card-luxury p-5">
            <p className="section-heading">Timeline</p>
            <div className="space-y-3">
              {[...shipment.timeline].reverse().map((t, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-gold mt-1.5 flex-shrink-0" />
                  <div>
                    <div className="text-ink font-medium text-xs">{STATUS_LABEL[t.status] || t.status}</div>
                    {t.note && <div className="text-ink-muted text-xs">{t.note}</div>}
                    <div className="text-ink-muted text-xs">{formatDate(t.date)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Status Modal */}
      <Modal open={statusModal} onClose={() => setStatusModal(false)} title="Update Status" size="sm">
        <div className="space-y-4">
          <div>
            <label className="label-luxury">New Status</label>
            <select value={newStatus} onChange={e => setNewStatus(e.target.value)} className="input-luxury">
              {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
            </select>
          </div>
          <div>
            <label className="label-luxury">Note (optional)</label>
            <input value={statusNote} onChange={e => setStatusNote(e.target.value)} className="input-luxury" placeholder="Add a note..." />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setStatusModal(false)} className="btn-ghost text-sm">Cancel</button>
            <button onClick={updateStatus} className="btn-gold text-sm">Update</button>
          </div>
        </div>
      </Modal>

      {/* Upload Modal */}
      <Modal open={uploadModal} onClose={() => setUploadModal(false)} title="Upload Document" size="sm">
        <div className="space-y-4">
          <div>
            <label className="label-luxury">Document Name</label>
            <input value={uploadForm.name} onChange={e => setUploadForm(f => ({ ...f, name: e.target.value }))} className="input-luxury" placeholder="Leave blank to use filename" />
          </div>
          <div>
            <label className="label-luxury">Category</label>
            <select value={uploadForm.category} onChange={e => setUploadForm(f => ({ ...f, category: e.target.value }))} className="input-luxury">
              {DOC_CATS.map(c => <option key={c} value={c}>{c.replace(/_/g, " ")}</option>)}
            </select>
          </div>
          <div>
            <label className="label-luxury">Description</label>
            <input value={uploadForm.description} onChange={e => setUploadForm(f => ({ ...f, description: e.target.value }))} className="input-luxury" placeholder="Optional" />
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="vis" checked={uploadForm.isVisibleToClient} onChange={e => setUploadForm(f => ({ ...f, isVisibleToClient: e.target.checked }))} className="accent-gold" />
            <label htmlFor="vis" className="text-sm text-ink-secondary">Visible to client</label>
          </div>
          <div>
            <label className="label-luxury">File *</label>
            <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} className="input-luxury text-sm" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setUploadModal(false)} className="btn-ghost text-sm">Cancel</button>
            <button onClick={uploadDoc} disabled={!file || uploading} className="btn-gold text-sm disabled:opacity-50 flex items-center gap-2">
              {uploading ? <><span className="w-3 h-3 border-2 border-surface-deep/30 border-t-surface-deep rounded-full animate-spin" />Uploading...</> : <><FileText size={14} />Upload</>}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
