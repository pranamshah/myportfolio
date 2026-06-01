"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus, Search, Filter } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { StatusBadge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

const STATUSES = ["BOOKING_CONFIRMED","CARGO_PICKED_UP","AT_CFS","ON_VESSEL","IN_TRANSIT","ARRIVED_AT_PORT","UNDER_CUSTOMS_EXAM","CUSTOMS_CLEARED","DELIVERED","COMPLETED"];
const INCOTERMS = ["EXW","FCA","CPT","CIP","DAP","DPU","DDP","FAS","FOB","CFR","CIF"];

interface Client { _id: string; name: string; company?: string; }
interface Shipment { _id: string; shipmentId: string; description: string; status: string; origin: string; destination: string; client: Client; etd?: string; eta?: string; updatedAt: string; }

const emptyForm = { client: "", description: "", origin: "", destination: "", portOfLoading: "", portOfDischarge: "", vessel: "", voyageNo: "", blNo: "", containerNo: "", sealNo: "", packages: "", grossWeight: "", cbm: "", commodity: "", incoterms: "FOB", status: "BOOKING_CONFIRMED", etd: "", eta: "", notes: "" };

export default function ShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const url = statusFilter ? `/api/shipments?status=${statusFilter}` : "/api/shipments";
    const res = await fetch(url);
    const data = await res.json();
    setShipments(Array.isArray(data) ? data : []);
  }, [statusFilter]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    fetch("/api/clients").then(r => r.json()).then(d => setClients(Array.isArray(d) ? d : []));
  }, []);

  const filtered = shipments.filter(s =>
    s.shipmentId.toLowerCase().includes(search.toLowerCase()) ||
    s.description.toLowerCase().includes(search.toLowerCase()) ||
    s.client?.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.origin.toLowerCase().includes(search.toLowerCase()) ||
    s.destination.toLowerCase().includes(search.toLowerCase())
  );

  async function save() {
    setSaving(true);
    const payload = { ...form, packages: form.packages ? Number(form.packages) : undefined, grossWeight: form.grossWeight ? Number(form.grossWeight) : undefined, cbm: form.cbm ? Number(form.cbm) : undefined };
    const url = editId ? `/api/shipments/${editId}` : "/api/shipments";
    const method = editId ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await res.json();
    setSaving(false);
    if (data.success || data.shipmentId) { setShowModal(false); setForm(emptyForm); setEditId(null); load(); }
    else alert(data.error || "Error saving");
  }

  function openEdit(s: Shipment) {
    setEditId(s._id);
    setForm({ ...emptyForm, client: s.client?._id || "", description: s.description, origin: s.origin, destination: s.destination, status: s.status, etd: s.etd ? s.etd.split("T")[0] : "", eta: s.eta ? s.eta.split("T")[0] : "" });
    setShowModal(true);
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="section-heading">Shipment Management</p>
          <h1 className="page-heading">Shipments</h1>
        </div>
        <button onClick={() => { setEditId(null); setForm(emptyForm); setShowModal(true); }} className="btn-gold flex items-center gap-2 text-sm">
          <Plus size={15} /> New Shipment
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search shipments..." className="input-luxury pl-9" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input-luxury w-auto min-w-[160px]">
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card-luxury overflow-hidden">
        <table className="table-luxury">
          <thead>
            <tr>
              <th>ID</th>
              <th>Client</th>
              <th>Description</th>
              <th>Route</th>
              <th>Status</th>
              <th>ETD / ETA</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s._id}>
                <td>
                  <Link href={`/dashboard/admin/shipments/${s._id}`} className="text-secondary hover:text-black transition-colors font-medium text-sm">
                    {s.shipmentId}
                  </Link>
                </td>
                <td>
                  <div className="text-sm text-black">{s.client?.name}</div>
                  <div className="text-xs text-black/40">{s.client?.company}</div>
                </td>
                <td className="max-w-[160px]"><div className="truncate text-sm">{s.description}</div></td>
                <td className="text-xs text-black/60">{s.origin}<br />→ {s.destination}</td>
                <td><StatusBadge status={s.status} /></td>
                <td className="text-xs text-black/40">
                  {s.etd ? <div>ETD: {formatDate(s.etd)}</div> : null}
                  {s.eta ? <div>ETA: {formatDate(s.eta)}</div> : null}
                </td>
                <td>
                  <div className="flex gap-2">
                    <Link href={`/dashboard/admin/shipments/${s._id}`} className="text-xs text-secondary hover:text-black transition-colors">View</Link>
                    <button onClick={() => openEdit(s)} className="text-xs text-black/60 hover:text-black transition-colors">Edit</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="text-center text-black/40 py-10">No shipments found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Modal open={showModal} onClose={() => { setShowModal(false); setEditId(null); }} title={editId ? "Edit Shipment" : "New Shipment"} size="xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="label-luxury">Client *</label>
            <select value={form.client} onChange={e => setForm(f => ({ ...f, client: e.target.value }))} className="input-luxury">
              <option value="">Select client...</option>
              {clients.map(c => <option key={c._id} value={c._id}>{c.name} {c.company ? `(${c.company})` : ""}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="label-luxury">Description *</label>
            <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="input-luxury" placeholder="Shipment description" />
          </div>
          {[
            { key: "origin", label: "Origin" }, { key: "destination", label: "Destination" },
            { key: "portOfLoading", label: "Port of Loading" }, { key: "portOfDischarge", label: "Port of Discharge" },
            { key: "vessel", label: "Vessel Name" }, { key: "voyageNo", label: "Voyage No." },
            { key: "blNo", label: "B/L No." }, { key: "containerNo", label: "Container No." },
            { key: "sealNo", label: "Seal No." }, { key: "commodity", label: "Commodity" },
            { key: "packages", label: "No. of Packages" }, { key: "grossWeight", label: "Gross Weight (kg)" },
            { key: "cbm", label: "Volume (CBM)" },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="label-luxury">{label}</label>
              <input value={(form as Record<string, string>)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} className="input-luxury" />
            </div>
          ))}
          <div>
            <label className="label-luxury">Incoterms</label>
            <select value={form.incoterms} onChange={e => setForm(f => ({ ...f, incoterms: e.target.value }))} className="input-luxury">
              {INCOTERMS.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div>
            <label className="label-luxury">Status</label>
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="input-luxury">
              {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
            </select>
          </div>
          <div>
            <label className="label-luxury">ETD</label>
            <input type="date" value={form.etd} onChange={e => setForm(f => ({ ...f, etd: e.target.value }))} className="input-luxury" />
          </div>
          <div>
            <label className="label-luxury">ETA</label>
            <input type="date" value={form.eta} onChange={e => setForm(f => ({ ...f, eta: e.target.value }))} className="input-luxury" />
          </div>
          <div className="md:col-span-2">
            <label className="label-luxury">Notes</label>
            <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} className="input-luxury" rows={2} />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-black/10">
          <button onClick={() => { setShowModal(false); setEditId(null); }} className="btn-ghost text-sm">Cancel</button>
          <button onClick={save} disabled={saving || !form.client || !form.description || !form.origin || !form.destination} className="btn-gold text-sm disabled:opacity-50">
            {saving ? "Saving..." : editId ? "Update" : "Create Shipment"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
