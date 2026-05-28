"use client";
import { useState, useEffect } from "react";
import { Plus, Handshake, Search } from "lucide-react";

interface Partner {
  id: string;
  name: string;
  type: string;
  contact?: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
}

const TYPE_COLORS: Record<string, string> = {
  CHA: "bg-blue-100 text-blue-800",
  CFS: "bg-teal-100 text-teal-800",
  SHIPPING_LINE: "bg-purple-100 text-purple-800",
  TRANSPORTER: "bg-orange-100 text-orange-800",
  OTHER: "bg-gray-100 text-gray-800",
};

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", type: "CHA", contact: "", email: "", phone: "", address: "", notes: "" });
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/partners").then((r) => r.json()).then(setPartners).finally(() => setLoading(false));
  }, []);

  async function addPartner(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/partners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const p = await res.json();
      setPartners((prev) => [p, ...prev]);
      setShowForm(false);
      setForm({ name: "", type: "CHA", contact: "", email: "", phone: "", address: "", notes: "" });
    }
  }

  const filtered = partners.filter((p) =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.type.includes(search.toUpperCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-primary-deep">Partners</h1>
          <p className="text-text-secondary mt-1">CHAs, CFS, Shipping Lines & Transporters</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Add Partner
        </button>
      </div>

      {showForm && (
        <form onSubmit={addPartner} className="bg-white rounded-2xl shadow-card p-6">
          <h3 className="font-heading font-bold text-primary-deep mb-4">New Partner</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Name *</label>
              <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="label">Type *</label>
              <select className="select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="CHA">CHA</option>
                <option value="CFS">CFS</option>
                <option value="SHIPPING_LINE">Shipping Line</option>
                <option value="TRANSPORTER">Transporter</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label className="label">Contact Person</label>
              <input className="input" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="label">Phone</label>
              <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className="label">Address / Location</label>
              <input className="input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Notes</label>
              <textarea className="input resize-none" rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button type="submit" className="btn-primary text-sm">Add Partner</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary text-sm">Cancel</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl shadow-card p-4 flex items-center gap-3">
        <Search className="w-4 h-4 text-text-secondary" />
        <input className="flex-1 outline-none text-sm" placeholder="Search partners..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="text-center py-12 text-text-secondary">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl shadow-card p-5">
              <div className="flex items-start justify-between mb-3">
                <p className="font-heading font-bold text-primary-deep">{p.name}</p>
                <span className={`badge text-xs ${TYPE_COLORS[p.type] || "bg-gray-100 text-gray-800"}`}>
                  {p.type.replace("_", " ")}
                </span>
              </div>
              <div className="space-y-1 text-sm text-text-secondary">
                {p.contact && <p>Contact: {p.contact}</p>}
                {p.email && <a href={`mailto:${p.email}`} className="block hover:text-accent-teal">{p.email}</a>}
                {p.phone && <p>{p.phone}</p>}
                {p.address && <p>{p.address}</p>}
              </div>
              {p.notes && <p className="text-xs text-text-secondary mt-2 italic">{p.notes}</p>}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-3 text-center py-12">
              <Handshake className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-text-secondary">No partners found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
