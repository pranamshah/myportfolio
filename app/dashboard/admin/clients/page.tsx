"use client";
import { useState, useEffect, useCallback } from "react";
import { Plus, Search } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { formatDate } from "@/lib/utils";

interface Client { _id: string; name: string; email: string; company?: string; phone?: string; gst?: string; address?: string; isActive: boolean; createdAt: string; }

const emptyForm = { name: "", email: "", password: "", company: "", phone: "", gst: "", address: "", isActive: true };

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/clients");
    const d = await res.json();
    setClients(Array.isArray(d) ? d : []);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    (c.company?.toLowerCase().includes(search.toLowerCase()) ?? false)
  );

  async function save() {
    setSaving(true);
    const method = editId ? "PUT" : "POST";
    const payload = editId ? { id: editId, ...form } : form;
    const res = await fetch("/api/clients", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await res.json();
    setSaving(false);
    if (data.success || data.id) { setShowModal(false); setForm(emptyForm); setEditId(null); load(); }
    else alert(data.error || "Error saving");
  }

  function openEdit(c: Client) {
    setEditId(c._id);
    setForm({ name: c.name, email: c.email, password: "", company: c.company || "", phone: c.phone || "", gst: c.gst || "", address: c.address || "", isActive: c.isActive });
    setShowModal(true);
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="section-heading">Client Management</p>
          <h1 className="page-heading">Clients</h1>
        </div>
        <button onClick={() => { setEditId(null); setForm(emptyForm); setShowModal(true); }} className="btn-gold flex items-center gap-2 text-sm">
          <Plus size={15} /> Add Client
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clients..." className="input-luxury pl-9" />
      </div>

      <div className="card-luxury overflow-hidden">
        <table className="table-luxury">
          <thead>
            <tr>
              <th>Name</th>
              <th>Company</th>
              <th>Email</th>
              <th>Phone</th>
              <th>GSTIN</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c._id}>
                <td className="font-medium text-sm text-black">{c.name}</td>
                <td className="text-sm text-black/60">{c.company || "—"}</td>
                <td className="text-sm text-black/60">{c.email}</td>
                <td className="text-sm text-black/60">{c.phone || "—"}</td>
                <td className="text-xs text-black/40">{c.gst || "—"}</td>
                <td>
                  <span className={`status-badge ${c.isActive ? "border-0 text-black font-bold" : "border border-black/10 text-black/30"}`} style={c.isActive ? { backgroundColor: "#735c00", color: "#000" } : undefined}>
                    {c.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="text-xs text-black/40">{formatDate(c.createdAt)}</td>
                <td>
                  <button onClick={() => openEdit(c)} className="text-xs text-secondary hover:text-black transition-colors">Edit</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={8} className="text-center text-black/40 py-10">No clients found.</td></tr>}
          </tbody>
        </table>
      </div>

      <Modal open={showModal} onClose={() => { setShowModal(false); setEditId(null); }} title={editId ? "Edit Client" : "Add Client"} size="lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: "name", label: "Full Name *" },
            { key: "email", label: "Email *" },
            { key: "password", label: editId ? "Password (leave blank to keep)" : "Password *" },
            { key: "company", label: "Company Name" },
            { key: "phone", label: "Phone" },
            { key: "gst", label: "GSTIN" },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="label-luxury">{label}</label>
              <input
                type={key === "password" ? "password" : key === "email" ? "email" : "text"}
                value={(form as Record<string, string | boolean>)[key] as string}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                className="input-luxury"
              />
            </div>
          ))}
          <div className="md:col-span-2">
            <label className="label-luxury">Address</label>
            <textarea value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} className="input-luxury" rows={2} />
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="active" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="accent-gold" />
            <label htmlFor="active" className="text-sm text-black/60">Active</label>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-black/10">
          <button onClick={() => { setShowModal(false); setEditId(null); }} className="btn-ghost text-sm">Cancel</button>
          <button onClick={save} disabled={saving || !form.name || !form.email || (!editId && !form.password)} className="btn-gold text-sm disabled:opacity-50">
            {saving ? "Saving..." : editId ? "Update Client" : "Add Client"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
