"use client";
import { useState, useEffect, useCallback } from "react";
import { formatDate, formatINR } from "@/lib/utils";
import Modal from "@/components/ui/Modal";
import { QuoteBadge } from "@/components/ui/Badge";

interface Client { _id: string; name: string; company?: string; }
interface Quote {
  _id: string; quoteNo: string; status: string; origin: string; destination: string;
  cargoType: string; incoterms?: string; weight?: number; cbm?: number; packages?: number;
  commodity?: string; additionalServices?: string[]; remarks?: string;
  quotedAmount?: number; validUntil?: string; adminNotes?: string;
  client: Client; createdAt: string;
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [selected, setSelected] = useState<Quote | null>(null);
  const [replyForm, setReplyForm] = useState({ quotedAmount: "", validUntil: "", adminNotes: "", status: "QUOTED" });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/quotes");
    const d = await res.json();
    setQuotes(Array.isArray(d) ? d : []);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function replyQuote() {
    if (!selected) return;
    setSaving(true);
    await fetch("/api/quotes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: selected._id, ...replyForm, quotedAmount: replyForm.quotedAmount ? Number(replyForm.quotedAmount) : undefined }),
    });
    setSaving(false); setSelected(null); load();
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <p className="section-heading">Quote Management</p>
        <h1 className="page-heading">Quotes</h1>
      </div>

      <div className="card-luxury overflow-hidden">
        <table className="table-luxury">
          <thead>
            <tr>
              <th>Quote No</th>
              <th>Client</th>
              <th>Route</th>
              <th>Cargo</th>
              <th>Status</th>
              <th>Quoted Amt</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map(q => (
              <tr key={q._id}>
                <td className="font-medium text-sm text-ink">{q.quoteNo}</td>
                <td>
                  <div className="text-sm">{q.client?.name}</div>
                  <div className="text-xs text-ink-muted">{q.client?.company}</div>
                </td>
                <td className="text-xs text-ink-secondary">{q.origin} → {q.destination}</td>
                <td className="text-xs text-ink-secondary">{q.cargoType}</td>
                <td><QuoteBadge status={q.status} /></td>
                <td className="text-sm">{q.quotedAmount ? formatINR(q.quotedAmount) : "—"}</td>
                <td className="text-xs text-ink-muted">{formatDate(q.createdAt)}</td>
                <td>
                  <button onClick={() => { setSelected(q); setReplyForm({ quotedAmount: String(q.quotedAmount || ""), validUntil: q.validUntil ? q.validUntil.split("T")[0] : "", adminNotes: q.adminNotes || "", status: q.status === "PENDING" ? "QUOTED" : q.status }); }} className="text-xs text-gold hover:text-gold-light transition-colors">
                    {q.status === "PENDING" ? "Reply" : "Edit"}
                  </button>
                </td>
              </tr>
            ))}
            {quotes.length === 0 && <tr><td colSpan={8} className="text-center text-ink-muted py-10">No quotes yet.</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Reply Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={`Quote ${selected?.quoteNo}`} size="lg">
        {selected && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                ["Client", `${selected.client?.name}${selected.client?.company ? ` (${selected.client.company})` : ""}`],
                ["Route", `${selected.origin} → ${selected.destination}`],
                ["Cargo Type", selected.cargoType],
                ["Incoterms", selected.incoterms],
                ["Weight", selected.weight ? `${selected.weight} kg` : "—"],
                ["CBM", selected.cbm ? `${selected.cbm} CBM` : "—"],
                ["Packages", selected.packages?.toString() || "—"],
                ["Commodity", selected.commodity || "—"],
              ].map(([l, v]) => (
                <div key={l}>
                  <div className="text-xs text-ink-muted">{l}</div>
                  <div className="text-ink">{v || "—"}</div>
                </div>
              ))}
            </div>
            {selected.remarks && (
              <div className="bg-surface-hover rounded p-3 text-sm text-ink-secondary">
                <span className="text-xs text-ink-muted block mb-1">Client Remarks:</span>
                {selected.remarks}
              </div>
            )}
            <div className="gold-line" />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-luxury">Quoted Amount (₹)</label>
                <input type="number" value={replyForm.quotedAmount} onChange={e => setReplyForm(f => ({ ...f, quotedAmount: e.target.value }))} className="input-luxury" placeholder="Enter amount" />
              </div>
              <div>
                <label className="label-luxury">Valid Until</label>
                <input type="date" value={replyForm.validUntil} onChange={e => setReplyForm(f => ({ ...f, validUntil: e.target.value }))} className="input-luxury" />
              </div>
              <div className="col-span-2">
                <label className="label-luxury">Status</label>
                <select value={replyForm.status} onChange={e => setReplyForm(f => ({ ...f, status: e.target.value }))} className="input-luxury">
                  {["PENDING","QUOTED","ACCEPTED","REJECTED","EXPIRED"].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="label-luxury">Notes to Client</label>
                <textarea value={replyForm.adminNotes} onChange={e => setReplyForm(f => ({ ...f, adminNotes: e.target.value }))} className="input-luxury" rows={3} placeholder="Terms, conditions, remarks..." />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setSelected(null)} className="btn-ghost text-sm">Cancel</button>
              <button onClick={replyQuote} disabled={saving} className="btn-gold text-sm disabled:opacity-50">
                {saving ? "Saving..." : "Save Reply"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
