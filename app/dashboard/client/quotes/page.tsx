"use client";
import { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { QuoteBadge } from "@/components/ui/Badge";
import { formatDate, formatINR } from "@/lib/utils";

const CARGO_TYPES = ["FCL (Full Container Load)","LCL (Less than Container Load)","Air Freight","Break Bulk","RORO","Hazardous","Oversized/Project Cargo"];
const SERVICES = ["Custom Clearance","Door Pickup","Door Delivery","Insurance","Palletization","Fumigation","Documentation"];

interface Quote {
  _id: string; quoteNo: string; status: string; origin: string; destination: string;
  cargoType: string; commodity?: string; weight?: number; cbm?: number;
  quotedAmount?: number; validUntil?: string; adminNotes?: string;
  remarks?: string; createdAt: string;
}

const emptyForm = { origin: "", destination: "", cargoType: CARGO_TYPES[0], incoterms: "FOB", weight: "", cbm: "", packages: "", commodity: "", remarks: "", additionalServices: [] as string[] };

export default function ClientQuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/quotes");
    const d = await res.json();
    setQuotes(Array.isArray(d) ? d : []);
  }, []);

  useEffect(() => { load(); }, [load]);

  function toggleService(svc: string) {
    setForm(f => ({
      ...f,
      additionalServices: f.additionalServices.includes(svc)
        ? f.additionalServices.filter(s => s !== svc)
        : [...f.additionalServices, svc],
    }));
  }

  async function submit() {
    setSaving(true);
    const res = await fetch("/api/quotes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, weight: form.weight ? Number(form.weight) : undefined, cbm: form.cbm ? Number(form.cbm) : undefined, packages: form.packages ? Number(form.packages) : undefined }) });
    const data = await res.json();
    setSaving(false);
    if (data.success || data.quoteNo) { setShowModal(false); setForm(emptyForm); load(); }
    else alert(data.error || "Error submitting");
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="section-heading">Freight Quotes</p>
          <h1 className="page-heading">Request a Quote</h1>
          <p className="text-ink-secondary text-sm mt-1">Submit your freight requirements and we'll get back to you within 24 hours.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-gold flex items-center gap-2 text-sm">
          <Plus size={15} /> New Quote Request
        </button>
      </div>

      <div className="space-y-3">
        {quotes.map(q => (
          <div key={q._id} className="card-luxury p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-medium text-ink">{q.quoteNo}</span>
                  <QuoteBadge status={q.status} />
                </div>
                <div className="text-sm text-ink-secondary mb-1">{q.origin} → {q.destination}</div>
                <div className="text-xs text-ink-muted">{q.cargoType}{q.commodity ? ` · ${q.commodity}` : ""}{q.weight ? ` · ${q.weight} kg` : ""}{q.cbm ? ` · ${q.cbm} CBM` : ""}</div>
                {q.remarks && <div className="text-xs text-ink-muted mt-2 italic">"{q.remarks}"</div>}
              </div>
              <div className="text-right text-sm flex-shrink-0">
                {q.quotedAmount ? (
                  <div>
                    <div className="text-gold font-semibold text-base">{formatINR(q.quotedAmount)}</div>
                    {q.validUntil && <div className="text-xs text-ink-muted">Valid till {formatDate(q.validUntil)}</div>}
                  </div>
                ) : (
                  <div className="text-xs text-ink-muted">Awaiting quote</div>
                )}
                <div className="text-xs text-ink-muted mt-1">{formatDate(q.createdAt)}</div>
              </div>
            </div>
            {q.adminNotes && (
              <div className="mt-3 pt-3 border-t border-surface-hover">
                <div className="text-xs text-ink-muted mb-1">Notes from Navkar Impex:</div>
                <p className="text-sm text-ink-secondary">{q.adminNotes}</p>
              </div>
            )}
          </div>
        ))}
        {quotes.length === 0 && (
          <div className="card-luxury p-10 text-center">
            <p className="text-ink-secondary mb-4">No quote requests yet.</p>
            <button onClick={() => setShowModal(true)} className="btn-gold text-sm">Request Your First Quote</button>
          </div>
        )}
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="New Freight Quote Request" size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-luxury">Origin (City/Country) *</label>
              <input value={form.origin} onChange={e => setForm(f => ({ ...f, origin: e.target.value }))} className="input-luxury" placeholder="e.g. Shanghai, China" />
            </div>
            <div>
              <label className="label-luxury">Destination *</label>
              <input value={form.destination} onChange={e => setForm(f => ({ ...f, destination: e.target.value }))} className="input-luxury" placeholder="e.g. Chennai, India" />
            </div>
            <div>
              <label className="label-luxury">Cargo Type *</label>
              <select value={form.cargoType} onChange={e => setForm(f => ({ ...f, cargoType: e.target.value }))} className="input-luxury">
                {CARGO_TYPES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label-luxury">Incoterms</label>
              <select value={form.incoterms} onChange={e => setForm(f => ({ ...f, incoterms: e.target.value }))} className="input-luxury">
                {["EXW","FCA","CPT","CIP","DAP","DPU","DDP","FAS","FOB","CFR","CIF"].map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className="label-luxury">Commodity</label>
              <input value={form.commodity} onChange={e => setForm(f => ({ ...f, commodity: e.target.value }))} className="input-luxury" placeholder="e.g. Auto Parts" />
            </div>
            <div>
              <label className="label-luxury">No. of Packages</label>
              <input type="number" value={form.packages} onChange={e => setForm(f => ({ ...f, packages: e.target.value }))} className="input-luxury" min="1" />
            </div>
            <div>
              <label className="label-luxury">Gross Weight (kg)</label>
              <input type="number" value={form.weight} onChange={e => setForm(f => ({ ...f, weight: e.target.value }))} className="input-luxury" min="0" />
            </div>
            <div>
              <label className="label-luxury">Volume (CBM)</label>
              <input type="number" value={form.cbm} onChange={e => setForm(f => ({ ...f, cbm: e.target.value }))} className="input-luxury" min="0" step="0.01" />
            </div>
          </div>

          <div>
            <label className="label-luxury">Additional Services</label>
            <div className="flex flex-wrap gap-2">
              {SERVICES.map(s => (
                <button key={s} type="button" onClick={() => toggleService(s)}
                  className={`text-xs px-3 py-1.5 rounded border transition-all ${form.additionalServices.includes(s) ? "bg-gold/10 border-gold/50 text-gold" : "border-surface-hover text-ink-muted hover:border-gold/30"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label-luxury">Remarks / Special Requirements</label>
            <textarea value={form.remarks} onChange={e => setForm(f => ({ ...f, remarks: e.target.value }))} className="input-luxury" rows={3} placeholder="Any special handling, delivery requirements, etc." />
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-surface-hover">
            <button onClick={() => setShowModal(false)} className="btn-ghost text-sm">Cancel</button>
            <button onClick={submit} disabled={saving || !form.origin || !form.destination} className="btn-gold text-sm disabled:opacity-50">
              {saving ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
