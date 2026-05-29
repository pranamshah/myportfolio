"use client";
import { useState, useEffect, useCallback } from "react";
import { Plus, Download, Search } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { InvoiceBadge } from "@/components/ui/Badge";
import { formatDate, formatINR } from "@/lib/utils";

const STATUSES = ["DRAFT","SENT","PAID","OVERDUE","CANCELLED"];

interface Client { _id: string; name: string; company?: string; }
interface Shipment { _id: string; shipmentId: string; description: string; }
interface LineItem { description: string; hsn: string; qty: number; rate: number; amount: number; }
interface Invoice {
  _id: string; invoiceNo: string; invoiceType: string; invoiceDate: string;
  totalAmount: number; status: string; amountPaid: number;
  client: Client; shipment?: Shipment;
}

const emptyLine = (): LineItem => ({ description: "", hsn: "", qty: 1, rate: 0, amount: 0 });

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    client: "", shipment: "", invoiceType: "SERVICE", invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: "", cgst: "0", sgst: "0", igst: "0", tds: "0", status: "DRAFT", notes: "",
  });
  const [lineItems, setLineItems] = useState<LineItem[]>([emptyLine()]);

  const load = useCallback(async () => {
    const res = await fetch("/api/invoices");
    const d = await res.json();
    setInvoices(Array.isArray(d) ? d : []);
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    fetch("/api/clients").then(r => r.json()).then(d => setClients(Array.isArray(d) ? d : []));
    fetch("/api/shipments").then(r => r.json()).then(d => setShipments(Array.isArray(d) ? d : []));
  }, []);

  function updateLine(i: number, key: keyof LineItem, val: string | number) {
    setLineItems(items => {
      const next = [...items];
      const item = { ...next[i], [key]: val };
      if (key === "qty" || key === "rate") item.amount = Number(item.qty) * Number(item.rate);
      next[i] = item;
      return next;
    });
  }

  const subtotal = lineItems.reduce((s, l) => s + l.amount, 0);
  const cgst = Number(form.cgst) || 0;
  const sgst = Number(form.sgst) || 0;
  const igst = Number(form.igst) || 0;
  const tds = Number(form.tds) || 0;
  const total = subtotal + cgst + sgst + igst - tds;

  async function save() {
    setSaving(true);
    const payload = { ...form, lineItems, cgst, sgst, igst, tds };
    const url = editId ? undefined : "/api/invoices";
    if (!url) { setSaving(false); return; }
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await res.json();
    setSaving(false);
    if (data.success || data.invoiceNo) { setShowModal(false); setLineItems([emptyLine()]); setForm({ client: "", shipment: "", invoiceType: "SERVICE", invoiceDate: new Date().toISOString().split("T")[0], dueDate: "", cgst: "0", sgst: "0", igst: "0", tds: "0", status: "DRAFT", notes: "" }); load(); }
    else alert(data.error || "Error saving");
  }

  async function updateStatus(id: string, status: string) {
    await fetch("/api/invoices", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    load();
  }

  const filtered = invoices.filter(i => i.invoiceNo.toLowerCase().includes(search.toLowerCase()) || i.client?.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="section-heading">Billing</p>
          <h1 className="page-heading">Invoices</h1>
        </div>
        <button onClick={() => { setEditId(null); setShowModal(true); }} className="btn-gold flex items-center gap-2 text-sm">
          <Plus size={15} /> New Invoice
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search invoices..." className="input-luxury pl-9" />
      </div>

      <div className="card-luxury overflow-hidden">
        <table className="table-luxury">
          <thead>
            <tr>
              <th>Invoice No</th>
              <th>Client</th>
              <th>Shipment</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(inv => (
              <tr key={inv._id}>
                <td className="font-medium text-sm text-ink">{inv.invoiceNo}</td>
                <td>
                  <div className="text-sm">{inv.client?.name}</div>
                  <div className="text-xs text-ink-muted">{inv.client?.company}</div>
                </td>
                <td className="text-xs text-ink-secondary">{inv.shipment?.shipmentId || "—"}</td>
                <td><span className="text-xs bg-surface-hover px-2 py-0.5 rounded text-ink-secondary">{inv.invoiceType}</span></td>
                <td className="font-medium text-sm">{formatINR(inv.totalAmount)}</td>
                <td>
                  <select
                    value={inv.status}
                    onChange={e => updateStatus(inv._id, e.target.value)}
                    className="text-xs bg-transparent border-none outline-none cursor-pointer"
                  >
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="text-xs text-ink-muted">{formatDate(inv.invoiceDate)}</td>
                <td>
                  <a href={`/api/invoices/${inv._id}/pdf`} target="_blank" className="inline-flex items-center gap-1 text-xs text-gold hover:text-gold-light transition-colors">
                    <Download size={12} /> PDF
                  </a>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="text-center text-ink-muted py-10">No invoices found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Create Invoice" size="xl">
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label-luxury">Invoice Type *</label>
              <select value={form.invoiceType} onChange={e => setForm(f => ({ ...f, invoiceType: e.target.value }))} className="input-luxury">
                <option value="SERVICE">Service Invoice (Tax Invoice)</option>
                <option value="REIMBURSEMENT">Reimbursement Bill</option>
              </select>
            </div>
            <div>
              <label className="label-luxury">Client *</label>
              <select value={form.client} onChange={e => setForm(f => ({ ...f, client: e.target.value }))} className="input-luxury">
                <option value="">Select client...</option>
                {clients.map(c => <option key={c._id} value={c._id}>{c.name} {c.company ? `(${c.company})` : ""}</option>)}
              </select>
            </div>
            <div>
              <label className="label-luxury">Shipment (optional)</label>
              <select value={form.shipment} onChange={e => setForm(f => ({ ...f, shipment: e.target.value }))} className="input-luxury">
                <option value="">None</option>
                {shipments.filter(s => !form.client || true).map(s => <option key={s._id} value={s._id}>{s.shipmentId} — {s.description}</option>)}
              </select>
            </div>
            <div>
              <label className="label-luxury">Invoice Date *</label>
              <input type="date" value={form.invoiceDate} onChange={e => setForm(f => ({ ...f, invoiceDate: e.target.value }))} className="input-luxury" />
            </div>
            <div>
              <label className="label-luxury">Due Date</label>
              <input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} className="input-luxury" />
            </div>
            <div>
              <label className="label-luxury">Status</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="input-luxury">
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Line Items */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="label-luxury mb-0">Line Items</label>
              <button onClick={() => setLineItems(l => [...l, emptyLine()])} className="text-xs text-gold hover:text-gold-light transition-colors">+ Add Row</button>
            </div>
            <div className="border border-surface-hover rounded overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-surface-hover">
                  <tr>
                    <th className="px-3 py-2 text-left text-ink-muted">Description</th>
                    <th className="px-2 py-2 text-center text-ink-muted w-20">HSN/SAC</th>
                    <th className="px-2 py-2 text-center text-ink-muted w-16">Qty</th>
                    <th className="px-2 py-2 text-right text-ink-muted w-24">Rate (₹)</th>
                    <th className="px-2 py-2 text-right text-ink-muted w-24">Amount (₹)</th>
                    <th className="w-8" />
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map((item, i) => (
                    <tr key={i} className="border-t border-surface-hover">
                      <td className="px-2 py-1"><input value={item.description} onChange={e => updateLine(i, "description", e.target.value)} className="input-luxury text-xs py-1" placeholder="Service description" /></td>
                      <td className="px-2 py-1"><input value={item.hsn} onChange={e => updateLine(i, "hsn", e.target.value)} className="input-luxury text-xs py-1 text-center" placeholder="998599" /></td>
                      <td className="px-2 py-1"><input type="number" value={item.qty} onChange={e => updateLine(i, "qty", Number(e.target.value))} className="input-luxury text-xs py-1 text-center" min="1" /></td>
                      <td className="px-2 py-1"><input type="number" value={item.rate} onChange={e => updateLine(i, "rate", Number(e.target.value))} className="input-luxury text-xs py-1 text-right" min="0" /></td>
                      <td className="px-3 py-1 text-right text-ink font-medium">{formatINR(item.amount)}</td>
                      <td className="px-1 py-1">
                        {lineItems.length > 1 && <button onClick={() => setLineItems(l => l.filter((_, j) => j !== i))} className="text-ink-muted hover:text-danger px-1">×</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tax */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div>
              <label className="label-luxury">CGST (₹)</label>
              <input type="number" value={form.cgst} onChange={e => setForm(f => ({ ...f, cgst: e.target.value }))} className="input-luxury" min="0" />
            </div>
            <div>
              <label className="label-luxury">SGST (₹)</label>
              <input type="number" value={form.sgst} onChange={e => setForm(f => ({ ...f, sgst: e.target.value }))} className="input-luxury" min="0" />
            </div>
            <div>
              <label className="label-luxury">IGST (₹)</label>
              <input type="number" value={form.igst} onChange={e => setForm(f => ({ ...f, igst: e.target.value }))} className="input-luxury" min="0" />
            </div>
            <div>
              <label className="label-luxury">TDS Deduction (₹)</label>
              <input type="number" value={form.tds} onChange={e => setForm(f => ({ ...f, tds: e.target.value }))} className="input-luxury" min="0" />
            </div>
            <div className="flex flex-col justify-end">
              <div className="bg-surface-hover rounded px-3 py-2">
                <div className="text-xs text-ink-muted">Total Amount</div>
                <div className="text-base font-semibold text-gold">{formatINR(total)}</div>
              </div>
            </div>
          </div>

          <div>
            <label className="label-luxury">Notes</label>
            <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} className="input-luxury" rows={2} />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-surface-hover">
          <button onClick={() => setShowModal(false)} className="btn-ghost text-sm">Cancel</button>
          <button onClick={save} disabled={saving || !form.client} className="btn-gold text-sm disabled:opacity-50">
            {saving ? "Creating..." : "Create Invoice"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
