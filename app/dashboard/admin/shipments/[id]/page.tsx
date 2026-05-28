"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package, CheckCircle, Circle, Edit, Save, Plus, Loader2 } from "lucide-react";
import { STATUS_LABELS, STATUS_COLORS, formatDate, formatCurrency } from "@/lib/utils";

const ALL_STATUSES = [
  "BOOKING_CONFIRMED", "CARGO_PICKED_UP", "AT_CFS", "ON_VESSEL",
  "IN_TRANSIT", "ARRIVED_AT_PORT", "UNDER_CUSTOMS_EXAMINATION",
  "CUSTOMS_CLEARED", "DELIVERED", "COMPLETED",
];

interface Shipment {
  id: string;
  jobNo: string;
  mode: string;
  movement: string;
  status: string;
  liner?: string;
  vessel?: string;
  voyage?: string;
  blNo?: string;
  awbNo?: string;
  beNo?: string;
  mblNo?: string;
  hblNo?: string;
  portLoading?: string;
  portDischarge?: string;
  finalDest?: string;
  cargoDesc?: string;
  hsCode?: string;
  packages?: number;
  grossWeight?: number;
  cbm?: number;
  chaName?: string;
  examType?: string;
  cfsName?: string;
  eta?: string;
  sailDate?: string;
  arrivalDate?: string;
  clearanceDate?: string;
  deliveryDate?: string;
  notes?: string;
  client: { name: string; email: string; company?: string; phone?: string };
  containers: { id: string; containerNo: string; sealNo?: string; size?: string; type?: string }[];
  documents: { id: string; label: string; type: string; filePath: string; createdAt: string }[];
  charges: { id: string; name: string; category: string; totalAmt: number; vendorName?: string }[];
  invoices: { id: string; invoiceNo: string; type: string; total: number; status: string }[];
  trackingUpdates: { id: string; status: string; note?: string; createdAt: string }[];
}

export default function ShipmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [statusUpdate, setStatusUpdate] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [notifyClient, setNotifyClient] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/shipments/${id}`)
      .then((r) => r.json())
      .then((data) => { setShipment(data); setStatusUpdate(data.status); })
      .finally(() => setLoading(false));
  }, [id]);

  async function updateStatus() {
    if (!shipment || !statusUpdate) return;
    setUpdatingStatus(true);
    const res = await fetch(`/api/shipments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: statusUpdate, statusNote, notifyClient }),
    });
    if (res.ok) {
      const updated = await res.json();
      setShipment((prev) => prev ? { ...prev, status: updated.status } : prev);
      setStatusNote("");
    }
    setUpdatingStatus(false);
  }

  if (loading) return <div className="flex items-center justify-center h-96"><Loader2 className="w-8 h-8 animate-spin text-accent-teal" /></div>;
  if (!shipment) return <div className="p-8 text-center text-text-secondary">Shipment not found.</div>;

  const totalCharges = shipment.charges.reduce((s, c) => s + c.totalAmt, 0);
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "documents", label: `Documents (${shipment.documents.length})` },
    { id: "charges", label: `Charges (${shipment.charges.length})` },
    { id: "timeline", label: "Timeline" },
    { id: "invoices", label: `Invoices (${shipment.invoices.length})` },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/admin/shipments" className="text-text-secondary hover:text-primary-deep">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-heading font-bold text-primary-deep font-mono">{shipment.jobNo}</h1>
              <span className={`badge ${STATUS_COLORS[shipment.status]}`}>{STATUS_LABELS[shipment.status]}</span>
            </div>
            <p className="text-text-secondary mt-1">{shipment.client.name} • {shipment.portLoading} → {shipment.portDischarge}</p>
          </div>
        </div>
        <Link href={`/dashboard/admin/shipments/${id}/edit`} className="btn-secondary flex items-center gap-2 text-sm">
          <Edit className="w-4 h-4" /> Edit
        </Link>
      </div>

      {/* Status Update */}
      <div className="bg-white rounded-2xl shadow-card p-5">
        <h3 className="font-heading font-bold text-primary-deep mb-3">Update Status</h3>
        <div className="flex flex-wrap gap-3">
          <select className="select flex-1 min-w-48" value={statusUpdate} onChange={(e) => setStatusUpdate(e.target.value)}>
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
          <input
            className="input flex-1 min-w-48"
            placeholder="Optional note..."
            value={statusNote}
            onChange={(e) => setStatusNote(e.target.value)}
          />
          <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
            <input type="checkbox" checked={notifyClient} onChange={(e) => setNotifyClient(e.target.checked)} className="rounded" />
            Notify client
          </label>
          <button
            onClick={updateStatus}
            disabled={updatingStatus || statusUpdate === shipment.status}
            className="btn-primary flex items-center gap-2 text-sm py-2"
          >
            {updatingStatus && <Loader2 className="w-4 h-4 animate-spin" />}
            <Save className="w-4 h-4" /> Update
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-0 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-accent-teal text-accent-teal"
                  : "border-transparent text-text-secondary hover:text-primary-deep"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-card p-5">
              <h3 className="font-heading font-bold text-primary-deep mb-4">Shipment Details</h3>
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                {[
                  ["Mode", shipment.mode],
                  ["Movement", shipment.movement],
                  ["Liner", shipment.liner],
                  ["Vessel", shipment.vessel],
                  ["Voyage", shipment.voyage],
                  [shipment.mode === "SEA" ? "BL No" : "AWB No", shipment.blNo || shipment.awbNo],
                  ["MBL No", shipment.mblNo],
                  ["BE No", shipment.beNo],
                  ["HS Code", shipment.hsCode],
                  ["Cargo Desc", shipment.cargoDesc],
                  ["Packages", shipment.packages],
                  ["Gross Weight", shipment.grossWeight ? `${shipment.grossWeight} KG` : null],
                  ["CBM", shipment.cbm],
                  ["CHA", shipment.chaName],
                  ["Exam Type", shipment.examType],
                  ["CFS", shipment.cfsName],
                ].map(([label, val]) => val ? (
                  <div key={String(label)}>
                    <p className="text-text-secondary">{label}</p>
                    <p className="font-medium text-primary-deep font-mono">{String(val)}</p>
                  </div>
                ) : null)}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-card p-5">
              <h3 className="font-heading font-bold text-primary-deep mb-4">Key Dates</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                {[
                  ["ETA", shipment.eta],
                  ["Sail Date", shipment.sailDate],
                  ["Arrival", shipment.arrivalDate],
                  ["Clearance", shipment.clearanceDate],
                  ["Delivery", shipment.deliveryDate],
                ].map(([label, date]) => (
                  <div key={String(label)}>
                    <p className="text-text-secondary text-xs">{label}</p>
                    <p className="font-medium text-primary-deep">{formatDate(date as string)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-card p-5">
              <h3 className="font-heading font-bold text-primary-deep mb-3">Client</h3>
              <p className="font-semibold text-primary-deep">{shipment.client.name}</p>
              {shipment.client.company && <p className="text-text-secondary text-sm">{shipment.client.company}</p>}
              <p className="text-accent-teal text-sm mt-1">{shipment.client.email}</p>
              {shipment.client.phone && <p className="text-text-secondary text-sm">{shipment.client.phone}</p>}
            </div>

            <div className="bg-white rounded-2xl shadow-card p-5">
              <h3 className="font-heading font-bold text-primary-deep mb-3">Charges Summary</h3>
              <p className="text-2xl font-bold text-accent-teal">{formatCurrency(totalCharges)}</p>
              <p className="text-text-secondary text-xs mt-1">{shipment.charges.length} line items</p>
              <Link href="#" onClick={() => setActiveTab("charges")} className="text-accent-teal text-sm hover:underline mt-2 inline-block">
                View charges →
              </Link>
            </div>

            {shipment.notes && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                <h3 className="font-heading font-bold text-amber-800 mb-2 text-sm">Internal Notes</h3>
                <p className="text-amber-700 text-sm">{shipment.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "timeline" && (
        <div className="bg-white rounded-2xl shadow-card p-6 max-w-2xl">
          <h3 className="font-heading font-bold text-primary-deep mb-6">Tracking Timeline</h3>
          <div className="space-y-4">
            {ALL_STATUSES.map((s, i) => {
              const statusIdx = ALL_STATUSES.indexOf(shipment.status);
              const done = i <= statusIdx;
              const active = i === statusIdx;
              const update = shipment.trackingUpdates.find((u) => u.status === s);
              return (
                <div key={s} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    {done ? (
                      <CheckCircle className={`w-6 h-6 ${active ? "text-accent-teal" : "text-green-500"}`} />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-200" />
                    )}
                    {i < ALL_STATUSES.length - 1 && (
                      <div className={`w-0.5 h-8 mt-1 ${i < statusIdx ? "bg-green-300" : "bg-gray-100"}`} />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className={`font-medium text-sm ${done ? "text-primary-deep" : "text-gray-300"}`}>
                      {STATUS_LABELS[s]}
                    </p>
                    {update && (
                      <p className="text-text-secondary text-xs">
                        {formatDate(update.createdAt)} {update.note && `— ${update.note}`}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "documents" && (
        <div className="bg-white rounded-2xl shadow-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-bold text-primary-deep">Documents</h3>
            <Link href={`/dashboard/admin/documents?shipment=${id}`} className="btn-primary text-sm flex items-center gap-2 py-2">
              <Plus className="w-4 h-4" /> Upload
            </Link>
          </div>
          {shipment.documents.length === 0 ? (
            <p className="text-text-secondary text-sm">No documents uploaded yet.</p>
          ) : (
            <div className="space-y-2">
              {shipment.documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-neutral-light rounded-lg">
                  <div>
                    <p className="font-medium text-sm text-primary-deep">{doc.label}</p>
                    <p className="text-xs text-text-secondary">{doc.type} • {formatDate(doc.createdAt)}</p>
                  </div>
                  <a href={doc.filePath} className="text-accent-teal text-sm hover:underline" target="_blank">Download</a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "charges" && (
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-heading font-bold text-primary-deep">Charges</h3>
            <Link href={`/dashboard/admin/billing?shipment=${id}`} className="btn-primary text-sm flex items-center gap-2 py-2">
              <Plus className="w-4 h-4" /> Add Charge
            </Link>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-neutral-light">
              <tr>
                <th className="text-left px-5 py-3 text-text-secondary font-medium">Charge Name</th>
                <th className="text-left px-5 py-3 text-text-secondary font-medium">Category</th>
                <th className="text-left px-5 py-3 text-text-secondary font-medium">Vendor</th>
                <th className="text-right px-5 py-3 text-text-secondary font-medium">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {shipment.charges.map((c) => (
                <tr key={c.id}>
                  <td className="px-5 py-3 font-medium text-primary-deep">{c.name}</td>
                  <td className="px-5 py-3 text-text-secondary">{c.category.replace(/_/g, " ")}</td>
                  <td className="px-5 py-3 text-text-secondary">{c.vendorName || "—"}</td>
                  <td className="px-5 py-3 text-right font-mono font-medium">{formatCurrency(c.totalAmt)}</td>
                </tr>
              ))}
              {shipment.charges.length > 0 && (
                <tr className="bg-neutral-light">
                  <td colSpan={3} className="px-5 py-3 font-bold text-primary-deep text-right">Total</td>
                  <td className="px-5 py-3 text-right font-mono font-bold text-accent-teal">{formatCurrency(totalCharges)}</td>
                </tr>
              )}
            </tbody>
          </table>
          {shipment.charges.length === 0 && (
            <p className="p-8 text-center text-text-secondary">No charges added yet.</p>
          )}
        </div>
      )}

      {activeTab === "invoices" && (
        <div className="bg-white rounded-2xl shadow-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-bold text-primary-deep">Invoices</h3>
            <Link href={`/dashboard/admin/billing/new?shipment=${id}`} className="btn-primary text-sm flex items-center gap-2 py-2">
              <Plus className="w-4 h-4" /> Generate Invoice
            </Link>
          </div>
          {shipment.invoices.length === 0 ? (
            <p className="text-text-secondary text-sm">No invoices generated yet.</p>
          ) : (
            <div className="space-y-2">
              {shipment.invoices.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between p-3 bg-neutral-light rounded-lg">
                  <div>
                    <p className="font-mono font-semibold text-primary-deep">{inv.invoiceNo}</p>
                    <p className="text-xs text-text-secondary">{inv.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-accent-teal">{formatCurrency(inv.total)}</p>
                    <span className={`badge text-xs ${inv.status === "PAID" ? "bg-green-100 text-green-800" : inv.status === "SENT" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}>
                      {inv.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
