"use client";
import { useState, useEffect, useCallback } from "react";
import { Plus, BookOpen, TrendingUp, Scale, Calendar, ChevronRight } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { formatDate, formatINR } from "@/lib/utils";

type Tab = "vouchers" | "ledgers" | "daybook" | "trial" | "pl" | "balance";
const VOUCHER_TYPES = ["SALES","PURCHASE","RECEIPT","PAYMENT","JOURNAL","CONTRA","CREDIT_NOTE","DEBIT_NOTE"];
const LEDGER_TYPES = ["ASSET","LIABILITY","INCOME","EXPENSE","EQUITY"];
const LEDGER_GROUPS: Record<string, string[]> = {
  ASSET: ["Current Assets","Fixed Assets","Bank Accounts","Cash in Hand","Loans & Advances","Sundry Debtors"],
  LIABILITY: ["Current Liabilities","Loans (Liability)","Sundry Creditors","Duties & Taxes"],
  INCOME: ["Direct Income","Indirect Income","Sales Accounts"],
  EXPENSE: ["Direct Expenses","Indirect Expenses","Purchase Accounts"],
  EQUITY: ["Capital Account","Reserves & Surplus"],
};

interface Ledger { _id: string; name: string; group: string; type: string; openingBalance: number; openingType: string; }
interface VEntry { ledgerId: string; ledgerName: string; type: "DR" | "CR"; amount: number; narration: string; }
interface Voucher { _id: string; voucherNo: string; voucherType: string; date: string; narration: string; totalAmount: number; entries: { ledgerName: string; type: string; amount: number }[]; }

const emptyEntry = (): VEntry => ({ ledgerId: "", ledgerName: "", type: "DR", amount: 0, narration: "" });

export default function AccountingPage() {
  const [tab, setTab] = useState<Tab>("vouchers");
  const [ledgers, setLedgers] = useState<Ledger[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [report, setReport] = useState<any>(null);
  const [dateRange, setDateRange] = useState({ from: new Date(new Date().getFullYear(), 3, 1).toISOString().split("T")[0], to: new Date().toISOString().split("T")[0] });
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [showLedgerModal, setShowLedgerModal] = useState(false);
  const [selectedLedger, setSelectedLedger] = useState("");
  const [saving, setSaving] = useState(false);

  const [vForm, setVForm] = useState({ voucherType: "JOURNAL", date: new Date().toISOString().split("T")[0], narration: "", reference: "" });
  const [entries, setEntries] = useState<VEntry[]>([emptyEntry(), emptyEntry()]);
  const [lForm, setLForm] = useState({ name: "", group: "Current Assets", type: "ASSET", openingBalance: "0", openingType: "DR", description: "" });

  const loadLedgers = useCallback(async () => {
    const res = await fetch("/api/accounting/ledgers");
    const d = await res.json();
    setLedgers(Array.isArray(d) ? d : []);
  }, []);

  const loadVouchers = useCallback(async () => {
    const res = await fetch(`/api/accounting/vouchers?from=${dateRange.from}&to=${dateRange.to}`);
    const d = await res.json();
    setVouchers(Array.isArray(d) ? d : []);
  }, [dateRange]);

  const loadReport = useCallback(async (type: string) => {
    const params = new URLSearchParams({ report: type, from: dateRange.from, to: dateRange.to });
    if (type === "ledger" && selectedLedger) params.set("ledgerId", selectedLedger);
    const res = await fetch(`/api/accounting/reports?${params}`);
    setReport(await res.json());
  }, [dateRange, selectedLedger]);

  useEffect(() => { loadLedgers(); }, [loadLedgers]);
  useEffect(() => {
    if (tab === "vouchers" || tab === "daybook") loadVouchers();
    else if (tab === "trial") loadReport("trial");
    else if (tab === "pl") loadReport("pl");
    else if (tab === "balance") loadReport("balance");
  }, [tab, loadVouchers, loadReport]);

  function updateEntry(i: number, key: keyof VEntry, val: string | number) {
    setEntries(es => {
      const next = [...es];
      next[i] = { ...next[i], [key]: val };
      if (key === "ledgerId") {
        const led = ledgers.find(l => l._id === val);
        if (led) next[i].ledgerName = led.name;
      }
      return next;
    });
  }

  const totalDR = entries.filter(e => e.type === "DR").reduce((s, e) => s + Number(e.amount), 0);
  const totalCR = entries.filter(e => e.type === "CR").reduce((s, e) => s + Number(e.amount), 0);
  const balanced = Math.abs(totalDR - totalCR) < 0.01;

  async function saveVoucher() {
    setSaving(true);
    const payload = {
      ...vForm,
      entries: entries.filter(e => e.ledgerId && e.amount > 0).map(e => ({ ledger: e.ledgerId, ledgerName: e.ledgerName, type: e.type, amount: Number(e.amount), narration: e.narration })),
    };
    const res = await fetch("/api/accounting/vouchers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await res.json();
    setSaving(false);
    if (data.success || data.voucherNo) { setShowVoucherModal(false); setEntries([emptyEntry(), emptyEntry()]); setVForm({ voucherType: "JOURNAL", date: new Date().toISOString().split("T")[0], narration: "", reference: "" }); loadVouchers(); }
    else alert(data.error || "Error saving voucher");
  }

  async function saveLedger() {
    setSaving(true);
    const res = await fetch("/api/accounting/ledgers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...lForm, openingBalance: Number(lForm.openingBalance) }) });
    const data = await res.json();
    setSaving(false);
    if (data.success || data.id) { setShowLedgerModal(false); setLForm({ name: "", group: "Current Assets", type: "ASSET", openingBalance: "0", openingType: "DR", description: "" }); loadLedgers(); }
    else alert(data.error || "Error saving ledger");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tabs: { id: Tab; label: string; icon: React.ComponentType<any> }[] = [
    { id: "vouchers", label: "Vouchers", icon: BookOpen },
    { id: "ledgers", label: "Ledgers", icon: Scale },
    { id: "daybook", label: "Day Book", icon: Calendar },
    { id: "trial", label: "Trial Balance", icon: Scale },
    { id: "pl", label: "P&L", icon: TrendingUp },
    { id: "balance", label: "Balance Sheet", icon: Scale },
  ];

  type PLReport = { income: { name: string; group: string; amount: number }[]; expense: { name: string; group: string; amount: number }[]; totalIncome: number; totalExpense: number; netProfit: number };
  type TrialRow = { name: string; group: string; type: string; dr: number; cr: number };
  type BalanceReport = { assets: { name: string; group: string; amount: number }[]; liabilities: { name: string; group: string; amount: number }[] };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="section-heading">Tally-style Accounting</p>
          <h1 className="page-heading">Accounting</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowLedgerModal(true)} className="btn-ghost flex items-center gap-2 text-sm"><Plus size={14} /> Ledger</button>
          <button onClick={() => setShowVoucherModal(true)} className="btn-gold flex items-center gap-2 text-sm"><Plus size={14} /> Voucher</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-black/10 pb-0 overflow-x-auto">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)} className={`flex items-center gap-2 px-4 py-2.5 text-sm whitespace-nowrap border-b-2 transition-all ${tab === id ? "border-gold text-gold" : "border-transparent text-black/40 hover:text-black"}`}>
            <Icon size={13} />{label}
          </button>
        ))}
      </div>

      {/* Date Range */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-black/60">
          <span>From</span>
          <input type="date" value={dateRange.from} onChange={e => setDateRange(d => ({ ...d, from: e.target.value }))} className="input-luxury py-1.5 w-36" />
          <span>To</span>
          <input type="date" value={dateRange.to} onChange={e => setDateRange(d => ({ ...d, to: e.target.value }))} className="input-luxury py-1.5 w-36" />
          <button onClick={() => { if (tab === "daybook" || tab === "vouchers") loadVouchers(); else loadReport(tab); }} className="btn-ghost text-xs py-1.5 px-3">Apply</button>
        </div>
      </div>

      {/* Vouchers / Day Book */}
      {(tab === "vouchers" || tab === "daybook") && (
        <div className="card-luxury overflow-hidden">
          <table className="table-luxury">
            <thead>
              <tr>
                <th>Voucher No</th>
                <th>Type</th>
                <th>Date</th>
                <th>Narration</th>
                <th>Debit Ledger(s)</th>
                <th>Credit Ledger(s)</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {vouchers.map(v => {
                const drs = v.entries.filter(e => e.type === "DR");
                const crs = v.entries.filter(e => e.type === "CR");
                return (
                  <tr key={v._id}>
                    <td className="font-medium text-sm text-black">{v.voucherNo}</td>
                    <td><span className="text-xs bg-black/5 px-2 py-0.5 rounded text-black/60">{v.voucherType}</span></td>
                    <td className="text-xs text-black/40">{formatDate(v.date)}</td>
                    <td className="text-xs text-black/60 max-w-[160px]"><div className="truncate">{v.narration}</div></td>
                    <td className="text-xs text-black/60">{drs.map(e => e.ledgerName).join(", ")}</td>
                    <td className="text-xs text-black/60">{crs.map(e => e.ledgerName).join(", ")}</td>
                    <td className="font-medium text-sm">{formatINR(v.totalAmount)}</td>
                  </tr>
                );
              })}
              {vouchers.length === 0 && <tr><td colSpan={7} className="text-center text-black/40 py-10">No vouchers in this period.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {/* Ledgers */}
      {tab === "ledgers" && (
        <div className="card-luxury overflow-hidden">
          <table className="table-luxury">
            <thead><tr><th>Ledger Name</th><th>Group</th><th>Type</th><th>Opening Balance</th><th>Action</th></tr></thead>
            <tbody>
              {ledgers.map(l => (
                <tr key={l._id}>
                  <td className="font-medium text-sm text-black">{l.name}</td>
                  <td className="text-xs text-black/60">{l.group}</td>
                  <td><span className="text-xs bg-black/5 px-2 py-0.5 rounded text-black/60">{l.type}</span></td>
                  <td className="text-sm">{formatINR(l.openingBalance)} <span className="text-xs text-black/40">{l.openingType}</span></td>
                  <td>
                    <button onClick={() => { setSelectedLedger(l._id); setTab("trial"); loadReport("ledger"); }} className="text-xs text-secondary hover:text-black transition-colors flex items-center gap-1">
                      Ledger <ChevronRight size={10} />
                    </button>
                  </td>
                </tr>
              ))}
              {ledgers.length === 0 && <tr><td colSpan={5} className="text-center text-black/40 py-10">No ledgers. Add one to start.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {/* Trial Balance */}
      {tab === "trial" && Array.isArray(report) && (
        <div className="card-luxury overflow-hidden">
          <div className="px-5 py-3 border-b border-black/10 flex items-center justify-between">
            <h3 className="text-sm font-medium text-black">Trial Balance</h3>
            <span className="text-xs text-black/40">{formatDate(dateRange.from)} to {formatDate(dateRange.to)}</span>
          </div>
          <table className="table-luxury">
            <thead><tr><th>Ledger</th><th>Group</th><th>Type</th><th className="text-right">Debit (₹)</th><th className="text-right">Credit (₹)</th></tr></thead>
            <tbody>
              {(report as TrialRow[]).map((r, i) => (
                <tr key={i}>
                  <td className="text-sm text-black">{r.name}</td>
                  <td className="text-xs text-black/60">{r.group}</td>
                  <td className="text-xs text-black/60">{r.type}</td>
                  <td className="text-right text-sm">{r.dr > 0 ? formatINR(r.dr) : "—"}</td>
                  <td className="text-right text-sm">{r.cr > 0 ? formatINR(r.cr) : "—"}</td>
                </tr>
              ))}
              <tr className="bg-black/5">
                <td colSpan={3} className="font-semibold text-sm text-black">Total</td>
                <td className="text-right font-semibold text-sm">{formatINR((report as TrialRow[]).reduce((s, r) => s + r.dr, 0))}</td>
                <td className="text-right font-semibold text-sm">{formatINR((report as TrialRow[]).reduce((s, r) => s + r.cr, 0))}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* P&L */}
      {tab === "pl" && report && !Array.isArray(report) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card-luxury overflow-hidden">
            <div className="px-5 py-3 border-b border-black/10 bg-green-900/20">
              <h3 className="text-sm font-medium text-green-400">Income</h3>
            </div>
            <table className="table-luxury">
              <thead><tr><th>Account</th><th>Group</th><th className="text-right">Amount (₹)</th></tr></thead>
              <tbody>
                {(report as PLReport).income.map((r, i) => <tr key={i}><td className="text-sm text-black">{r.name}</td><td className="text-xs text-black/60">{r.group}</td><td className="text-right text-sm">{formatINR(r.amount)}</td></tr>)}
                <tr className="bg-black/5"><td colSpan={2} className="font-semibold text-sm text-black">Total Income</td><td className="text-right font-semibold text-sm text-green-400">{formatINR((report as PLReport).totalIncome)}</td></tr>
              </tbody>
            </table>
          </div>
          <div className="card-luxury overflow-hidden">
            <div className="px-5 py-3 border-b border-black/10 bg-red-900/20">
              <h3 className="text-sm font-medium text-red-400">Expenses</h3>
            </div>
            <table className="table-luxury">
              <thead><tr><th>Account</th><th>Group</th><th className="text-right">Amount (₹)</th></tr></thead>
              <tbody>
                {(report as PLReport).expense.map((r, i) => <tr key={i}><td className="text-sm text-black">{r.name}</td><td className="text-xs text-black/60">{r.group}</td><td className="text-right text-sm">{formatINR(r.amount)}</td></tr>)}
                <tr className="bg-black/5"><td colSpan={2} className="font-semibold text-sm text-black">Total Expenses</td><td className="text-right font-semibold text-sm text-red-400">{formatINR((report as PLReport).totalExpense)}</td></tr>
              </tbody>
            </table>
          </div>
          <div className="md:col-span-2 card-luxury p-5 flex items-center justify-between">
            <span className="font-display text-lg font-light text-black">Net {(report as PLReport).netProfit >= 0 ? "Profit" : "Loss"}</span>
            <span className={`text-xl font-semibold ${(report as PLReport).netProfit >= 0 ? "text-green-400" : "text-red-400"}`}>{formatINR(Math.abs((report as PLReport).netProfit))}</span>
          </div>
        </div>
      )}

      {/* Balance Sheet */}
      {tab === "balance" && report && !Array.isArray(report) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card-luxury overflow-hidden">
            <div className="px-5 py-3 border-b border-black/10"><h3 className="text-sm font-medium text-black">Assets</h3></div>
            <table className="table-luxury">
              <thead><tr><th>Account</th><th>Group</th><th className="text-right">Amount (₹)</th></tr></thead>
              <tbody>
                {(report as BalanceReport).assets.map((r, i) => <tr key={i}><td className="text-sm text-black">{r.name}</td><td className="text-xs text-black/60">{r.group}</td><td className="text-right text-sm">{formatINR(r.amount)}</td></tr>)}
                <tr className="bg-black/5"><td colSpan={2} className="font-semibold text-sm text-black">Total Assets</td><td className="text-right font-semibold text-sm">{formatINR((report as BalanceReport).assets.reduce((s, r) => s + r.amount, 0))}</td></tr>
              </tbody>
            </table>
          </div>
          <div className="card-luxury overflow-hidden">
            <div className="px-5 py-3 border-b border-black/10"><h3 className="text-sm font-medium text-black">Liabilities & Equity</h3></div>
            <table className="table-luxury">
              <thead><tr><th>Account</th><th>Group</th><th className="text-right">Amount (₹)</th></tr></thead>
              <tbody>
                {(report as BalanceReport).liabilities.map((r, i) => <tr key={i}><td className="text-sm text-black">{r.name}</td><td className="text-xs text-black/60">{r.group}</td><td className="text-right text-sm">{formatINR(r.amount)}</td></tr>)}
                <tr className="bg-black/5"><td colSpan={2} className="font-semibold text-sm text-black">Total</td><td className="text-right font-semibold text-sm">{formatINR((report as BalanceReport).liabilities.reduce((s, r) => s + r.amount, 0))}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Voucher Modal */}
      <Modal open={showVoucherModal} onClose={() => setShowVoucherModal(false)} title="New Voucher" size="xl">
        <div className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="label-luxury">Type *</label>
              <select value={vForm.voucherType} onChange={e => setVForm(f => ({ ...f, voucherType: e.target.value }))} className="input-luxury">
                {VOUCHER_TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
              </select>
            </div>
            <div>
              <label className="label-luxury">Date *</label>
              <input type="date" value={vForm.date} onChange={e => setVForm(f => ({ ...f, date: e.target.value }))} className="input-luxury" />
            </div>
            <div className="col-span-2">
              <label className="label-luxury">Narration *</label>
              <input value={vForm.narration} onChange={e => setVForm(f => ({ ...f, narration: e.target.value }))} className="input-luxury" placeholder="Transaction narration" />
            </div>
            <div className="col-span-2">
              <label className="label-luxury">Reference / Cheque No.</label>
              <input value={vForm.reference} onChange={e => setVForm(f => ({ ...f, reference: e.target.value }))} className="input-luxury" />
            </div>
          </div>

          {/* Entries */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="label-luxury mb-0">Ledger Entries</label>
              <button onClick={() => setEntries(e => [...e, emptyEntry()])} className="text-xs text-secondary hover:text-black">+ Add Entry</button>
            </div>
            <div className="border border-black/10 rounded overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-black/5">
                  <tr>
                    <th className="px-3 py-2 text-left text-black/40">Ledger</th>
                    <th className="px-2 py-2 text-center text-black/40 w-20">DR/CR</th>
                    <th className="px-2 py-2 text-right text-black/40 w-28">Amount (₹)</th>
                    <th className="px-2 py-2 text-left text-black/40">Narration</th>
                    <th className="w-8" />
                  </tr>
                </thead>
                <tbody>
                  {entries.map((e, i) => (
                    <tr key={i} className="border-t border-black/10">
                      <td className="px-2 py-1">
                        <select value={e.ledgerId} onChange={ev => updateEntry(i, "ledgerId", ev.target.value)} className="input-luxury text-xs py-1">
                          <option value="">Select ledger...</option>
                          {ledgers.map(l => <option key={l._id} value={l._id}>{l.name} ({l.group})</option>)}
                        </select>
                      </td>
                      <td className="px-2 py-1">
                        <select value={e.type} onChange={ev => updateEntry(i, "type", ev.target.value)} className="input-luxury text-xs py-1 text-center">
                          <option value="DR">DR</option>
                          <option value="CR">CR</option>
                        </select>
                      </td>
                      <td className="px-2 py-1">
                        <input type="number" value={e.amount} onChange={ev => updateEntry(i, "amount", Number(ev.target.value))} className="input-luxury text-xs py-1 text-right" min="0" />
                      </td>
                      <td className="px-2 py-1">
                        <input value={e.narration} onChange={ev => updateEntry(i, "narration", ev.target.value)} className="input-luxury text-xs py-1" placeholder="Optional" />
                      </td>
                      <td className="px-1 py-1">
                        {entries.length > 2 && <button onClick={() => setEntries(es => es.filter((_, j) => j !== i))} className="text-black/40 hover:text-danger px-1">×</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={`flex justify-between text-xs mt-2 px-1 ${balanced ? "text-green-400" : "text-red-400"}`}>
              <span>DR Total: {formatINR(totalDR)}</span>
              <span>CR Total: {formatINR(totalCR)}</span>
              <span>{balanced ? "✓ Balanced" : `⚠ Difference: ${formatINR(Math.abs(totalDR - totalCR))}`}</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-black/10">
            <button onClick={() => setShowVoucherModal(false)} className="btn-ghost text-sm">Cancel</button>
            <button onClick={saveVoucher} disabled={saving || !balanced || !vForm.narration} className="btn-gold text-sm disabled:opacity-50">
              {saving ? "Saving..." : "Post Voucher"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Ledger Modal */}
      <Modal open={showLedgerModal} onClose={() => setShowLedgerModal(false)} title="Create Ledger" size="md">
        <div className="space-y-4">
          <div>
            <label className="label-luxury">Ledger Name *</label>
            <input value={lForm.name} onChange={e => setLForm(f => ({ ...f, name: e.target.value }))} className="input-luxury" placeholder="e.g. Navkar Impex Bank A/C" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-luxury">Type *</label>
              <select value={lForm.type} onChange={e => setLForm(f => ({ ...f, type: e.target.value, group: LEDGER_GROUPS[e.target.value][0] }))} className="input-luxury">
                {LEDGER_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="label-luxury">Group *</label>
              <select value={lForm.group} onChange={e => setLForm(f => ({ ...f, group: e.target.value }))} className="input-luxury">
                {(LEDGER_GROUPS[lForm.type] || []).map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-luxury">Opening Balance (₹)</label>
              <input type="number" value={lForm.openingBalance} onChange={e => setLForm(f => ({ ...f, openingBalance: e.target.value }))} className="input-luxury" min="0" />
            </div>
            <div>
              <label className="label-luxury">DR / CR</label>
              <select value={lForm.openingType} onChange={e => setLForm(f => ({ ...f, openingType: e.target.value }))} className="input-luxury">
                <option value="DR">Debit (DR)</option>
                <option value="CR">Credit (CR)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label-luxury">Description</label>
            <input value={lForm.description} onChange={e => setLForm(f => ({ ...f, description: e.target.value }))} className="input-luxury" placeholder="Optional description" />
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-black/10">
            <button onClick={() => setShowLedgerModal(false)} className="btn-ghost text-sm">Cancel</button>
            <button onClick={saveLedger} disabled={saving || !lForm.name} className="btn-gold text-sm disabled:opacity-50">
              {saving ? "Saving..." : "Create Ledger"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
