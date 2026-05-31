"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const SAMPLE_INVOICES = [
  {
    id: "inv1", invoiceNo: "INV-2026-001", type: "Service Invoice",
    job: "JOB-2025-001", date: "14 OCT 2025", amount: 18880, status: "PENDING",
  },
  {
    id: "inv2", invoiceNo: "REIMB-2025-001", type: "Reimbursement",
    job: "JOB-2025-001", date: "10 OCT 2025", amount: 179549, status: "PAID",
  },
  {
    id: "inv3", invoiceNo: "INV-2025-FRT", type: "Freight Invoice",
    job: "JOB-2025-001", date: "05 SEP 2025", amount: 4131994, status: "PAID",
  },
  {
    id: "inv4", invoiceNo: "INV-2025-002", type: "Customs Clearance",
    job: "JOB-2025-002", date: "15 OCT 2025", amount: 22500, status: "PENDING",
  },
];

const INV_001_BREAKDOWN = [
  { desc: "Freight Charges (LCL – Sea)", amount: 12450 },
  { desc: "Customs Documentation Fee",  amount: 2500 },
  { desc: "Terminal Handling (THC)",     amount: 1800 },
  { desc: "Integrated GST (18%)",        amount: 2130 },
];

interface ApiInvoice {
  _id: string; invoiceNo: string; invoiceType: string; invoiceDate: string;
  totalAmount: number; amountPaid: number; status: string;
  shipment?: { shipmentId?: string };
}

function formatINR(n: number) {
  return "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function ClientInvoicesPage() {
  const [showModal, setShowModal] = useState(false);
  const [payingInvoice, setPayingInvoice] = useState("INV-2026-001");
  const [dbInvoices, setDbInvoices] = useState<ApiInvoice[]>([]);

  useEffect(() => {
    fetch("/api/invoices").then(r => r.json()).then(d => setDbInvoices(Array.isArray(d) ? d : []));
  }, []);

  const combined = [
    ...SAMPLE_INVOICES,
    ...dbInvoices.map(i => ({
      id: i._id, invoiceNo: i.invoiceNo, type: i.invoiceType,
      job: i.shipment?.shipmentId ?? "—",
      date: new Date(i.invoiceDate).toLocaleDateString("en-IN"),
      amount: i.totalAmount, status: i.status.toUpperCase(),
    })),
  ];

  const totalInvoiced = combined.reduce((s, i) => s + i.amount, 0);
  const totalPaid = combined.filter(i => i.status === "PAID").reduce((s, i) => s + i.amount, 0);
  const totalOutstanding = combined.filter(i => i.status === "PENDING").reduce((s, i) => s + i.amount, 0);

  function openModal(invoiceNo: string) {
    setPayingInvoice(invoiceNo);
    setShowModal(true);
  }

  return (
    <div className="flex flex-col min-h-screen">

      {/* Header */}
      <header className="pt-16 px-10 mb-16">
        <h1 className="font-display text-on-surface" style={{ fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 600, letterSpacing: "-0.02em" }}>
          Invoices &amp; Payments
        </h1>
        <p className="font-sans text-on-surface-variant max-w-2xl mt-3 text-base leading-relaxed">
          Manage your freight financials. Review detailed breakdowns, track payment history, and settle outstanding balances via secure bank transfer.
        </p>
      </header>

      <div className="px-10 pb-32">

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {/* Total Invoiced */}
          <div className="bg-white p-8 border border-outline-variant/30 flex flex-col gap-4">
            <span className="font-mono text-[10px] tracking-widest text-on-surface-variant uppercase">Total Invoiced</span>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-[36px]" style={{ fontWeight: 600 }}>₹</span>
              <span className="font-display text-[44px]" style={{ fontWeight: 600 }}>
                {totalInvoiced.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="mt-auto pt-4 border-t border-outline-variant/10">
              <span className="font-mono text-[11px] tracking-widest" style={{ color: "#735c00" }}>FY 2025–26</span>
            </div>
          </div>

          {/* Total Paid */}
          <div className="bg-white p-8 border border-outline-variant/30 flex flex-col gap-4">
            <span className="font-mono text-[10px] tracking-widest text-on-surface-variant uppercase">Total Paid</span>
            <div className="flex items-baseline gap-1 text-primary">
              <span className="font-display text-[36px]" style={{ fontWeight: 600 }}>₹</span>
              <span className="font-display text-[44px]" style={{ fontWeight: 600 }}>
                {totalPaid.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="mt-auto pt-4 border-t border-outline-variant/10 flex items-center gap-2">
              <span className="material-symbols-outlined text-green-600 text-[16px]">check_circle</span>
              <span className="font-mono text-[10px] tracking-widest text-on-surface-variant">Last paid: Oct 2025</span>
            </div>
          </div>

          {/* Outstanding */}
          <div className="p-8 border flex flex-col gap-4 relative overflow-hidden"
            style={{ backgroundColor: "#fed65b", borderColor: "rgba(115,92,0,0.2)" }}>
            <div className="absolute -right-4 -bottom-4 opacity-[0.05] pointer-events-none">
              <span className="material-symbols-outlined text-[120px]">account_balance_wallet</span>
            </div>
            <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "#574500" }}>Outstanding</span>
            <div className="flex items-baseline gap-1" style={{ color: "#574500" }}>
              <span className="font-display text-[36px]" style={{ fontWeight: 600 }}>₹</span>
              <span className="font-display text-[44px]" style={{ fontWeight: 600 }}>
                {totalOutstanding.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="mt-auto pt-4 border-t border-on-secondary-container/10">
              <button className="font-mono text-[11px] tracking-widest flex items-center gap-2 hover:underline" style={{ color: "#574500" }}>
                VIEW DETAILS <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <section>
          <div className="flex justify-between items-end mb-8">
            <h2 className="font-sans font-bold text-3xl">Recent Transactions</h2>
            <div className="flex gap-4">
              <button className="font-mono text-[11px] tracking-widest flex items-center gap-2 border border-outline-variant px-6 py-2 hover:bg-surface-container transition-colors">
                <span className="material-symbols-outlined text-[18px]">filter_list</span> FILTER
              </button>
              <button className="font-mono text-[11px] tracking-widest flex items-center gap-2 border border-outline-variant px-6 py-2 hover:bg-surface-container transition-colors">
                <span className="material-symbols-outlined text-[18px]">download</span> EXPORT CSV
              </button>
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse min-w-[800px]">
              <thead>
                <tr className="text-left border-b-2 border-primary">
                  {["INVOICE NO", "TYPE", "JOB NO", "DATE", "AMOUNT", "STATUS", "ACTION"].map((h, i) => (
                    <th key={h} className={`py-6 px-4 font-mono text-[10px] tracking-widest ${i === 6 ? "text-right" : ""}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {combined.map(inv => (
                  <tr key={inv.id} className="group hover:bg-surface-container-low transition-colors border-b border-outline-variant/30">
                    <td className="py-8 px-4 font-mono text-[11px] font-bold">{inv.invoiceNo}</td>
                    <td className="py-8 px-4 font-sans text-sm text-on-surface-variant">{inv.type}</td>
                    <td className="py-8 px-4 font-mono text-[11px]">{inv.job}</td>
                    <td className="py-8 px-4 font-sans text-sm text-on-surface-variant">{inv.date}</td>
                    <td className="py-8 px-4 font-sans font-bold">{formatINR(inv.amount)}</td>
                    <td className="py-8 px-4">
                      {inv.status === "PAID" ? (
                        <span className="px-3 py-1 font-mono text-[10px] tracking-widest font-bold"
                          style={{ backgroundColor: "#e2e2e2", color: "#45464d" }}>PAID</span>
                      ) : (
                        <span className="px-3 py-1 font-mono text-[10px] tracking-widest font-bold"
                          style={{ backgroundColor: "#fed65b", color: "#574500" }}>PENDING</span>
                      )}
                    </td>
                    <td className="py-8 px-4 text-right">
                      <div className="flex justify-end gap-4">
                        <button className="font-mono text-[10px] tracking-widest text-primary hover:underline underline-offset-4">
                          VIEW PDF
                        </button>
                        {inv.status === "PENDING" ? (
                          <button
                            onClick={() => openModal(inv.invoiceNo)}
                            className="bg-primary text-white px-6 py-2 font-mono text-[10px] tracking-widest hover:opacity-90 transition-opacity">
                            PAY NOW
                          </button>
                        ) : (
                          <button className="font-mono text-[10px] tracking-widest text-on-surface-variant cursor-not-allowed">
                            RECEIPT
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Detailed Breakdown */}
        <section className="mt-24 p-12 relative overflow-hidden" style={{ backgroundColor: "#f3f3f4" }}>
          <div className="absolute top-0 right-0 p-8 opacity-[0.05] pointer-events-none select-none">
            <span className="font-display leading-none" style={{ fontSize: "120px", fontWeight: 700 }}>BREAKDOWN</span>
          </div>
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h3 className="font-sans font-bold text-2xl mb-8">Invoice Detail — INV-2026-001</h3>
              <div className="space-y-4">
                <div className="flex justify-between border-b border-outline-variant/30 pb-4">
                  <span className="font-mono text-[10px] tracking-widest text-on-surface-variant">DESCRIPTION</span>
                  <span className="font-mono text-[10px] tracking-widest text-on-surface-variant">TOTAL</span>
                </div>
                {INV_001_BREAKDOWN.map(row => (
                  <div key={row.desc} className="flex justify-between font-sans text-sm py-1">
                    <span>{row.desc}</span>
                    <span>{formatINR(row.amount)}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-8 border-t-2 border-primary mt-4">
                  <span className="font-sans font-bold">NET PAYABLE AMOUNT</span>
                  <span className="font-display text-[22px]" style={{ fontWeight: 600 }}>
                    {formatINR(INV_001_BREAKDOWN.reduce((s, r) => s + r.amount, 0))}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center gap-6">
              <div className="p-8 border border-outline bg-white flex items-center gap-6">
                <div className="p-4" style={{ backgroundColor: "#eeeeee" }}>
                  <span className="material-symbols-outlined text-[32px]">description</span>
                </div>
                <div>
                  <p className="font-mono text-[10px] tracking-widest mb-1">DOWNLOAD ATTACHMENT</p>
                  <p className="font-sans font-bold">Original_Invoice_INV-2026-001.pdf</p>
                </div>
                <button className="ml-auto hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-primary text-[24px]">download</span>
                </button>
              </div>
              <p className="font-sans text-sm text-on-surface-variant italic">
                Note: Payments made via NEFT/RTGS may take up to 24 hours to reflect in the dashboard.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-outline-variant px-10 py-10 mt-auto" style={{ backgroundColor: "#f9f9f9" }}>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-display text-on-surface opacity-5 select-none uppercase text-4xl font-bold">NAVKAR IMPEX</p>
          <p className="font-mono text-[10px] tracking-widest text-on-surface-variant">
            © {new Date().getFullYear()} NAVKAR IMPEX. LOGISTICS REDEFINED.
          </p>
          <div className="flex gap-8">
            {[["PRIVACY", "/privacy"], ["TERMS", "/terms"], ["NETWORK", "/network"]].map(([l, h]) => (
              <Link key={l} href={h} className="font-mono text-[10px] tracking-widest text-on-surface-variant hover:text-secondary transition-colors">{l}</Link>
            ))}
          </div>
        </div>
      </footer>

      {/* Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
            onClick={() => setShowModal(false)} />
          <div className="relative bg-white w-full max-w-2xl p-12 border border-outline mx-4">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-8 right-8 material-symbols-outlined hover:rotate-90 transition-transform">
              close
            </button>
            <h2 className="font-display text-[36px] mb-8" style={{ fontWeight: 600 }}>Bank Transfer Details</h2>
            <p className="font-sans text-sm text-on-surface-variant mb-10 leading-relaxed">
              Please initiate a transfer using the following bank details. Mention{" "}
              <strong className="text-primary">{payingInvoice}</strong> in the transaction remarks for faster processing.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {[
                { label: "Beneficiary Name", value: "NAVKAR IMPEX PVT LTD" },
                { label: "Bank Name",         value: "HDFC BANK LTD" },
                { label: "Account Number",    value: "50200048291033" },
                { label: "IFSC Code",         value: "HDFC0000012" },
              ].map(row => (
                <div key={row.label} className="border-b border-outline-variant/30 pb-4">
                  <span className="font-mono text-[10px] tracking-widest text-on-surface-variant uppercase block mb-1">{row.label}</span>
                  <span className="font-sans font-bold text-lg">{row.value}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border border-primary py-4 font-mono text-[11px] tracking-widest hover:bg-surface-container transition-colors">
                CANCEL
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  alert("Payment notification sent. Our billing team will verify within 24 hours.");
                }}
                className="flex-1 bg-primary text-white py-4 font-mono text-[11px] tracking-widest hover:opacity-90">
                I HAVE PAID
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
