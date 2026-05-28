"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Receipt, Download } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Invoice {
  id: string;
  invoiceNo: string;
  type: string;
  date: string;
  total: number;
  status: string;
  client: { name: string; company?: string };
  shipment: { jobNo: string };
}

export default function BillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    fetch("/api/invoices").then((r) => r.json()).then(setInvoices).finally(() => setLoading(false));
  }, []);

  const filtered = filter === "ALL" ? invoices : invoices.filter((inv) => inv.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-primary-deep">Billing & Invoices</h1>
          <p className="text-text-secondary mt-1">{invoices.length} total invoices</p>
        </div>
        <Link href="/dashboard/admin/billing/new" className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> New Invoice
        </Link>
      </div>

      <div className="flex gap-2 flex-wrap">
        {["ALL", "DRAFT", "SENT", "PAID"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === s ? "bg-accent-teal text-white" : "bg-white text-text-secondary hover:bg-neutral-light"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-light border-b border-gray-100">
            <tr>
              <th className="text-left px-5 py-3 text-text-secondary font-medium">Invoice No</th>
              <th className="text-left px-5 py-3 text-text-secondary font-medium">Client</th>
              <th className="text-left px-5 py-3 text-text-secondary font-medium">Job No</th>
              <th className="text-left px-5 py-3 text-text-secondary font-medium">Type</th>
              <th className="text-left px-5 py-3 text-text-secondary font-medium">Date</th>
              <th className="text-right px-5 py-3 text-text-secondary font-medium">Amount</th>
              <th className="text-left px-5 py-3 text-text-secondary font-medium">Status</th>
              <th className="text-left px-5 py-3 text-text-secondary font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={8} className="px-5 py-8 text-center text-text-secondary">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-5 py-12 text-center">
                  <Receipt className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-text-secondary">No invoices yet</p>
                </td>
              </tr>
            ) : filtered.map((inv) => (
              <tr key={inv.id} className="hover:bg-neutral-light/50 transition-colors">
                <td className="px-5 py-3 font-mono font-semibold text-accent-teal">{inv.invoiceNo}</td>
                <td className="px-5 py-3">
                  <p className="font-medium text-primary-deep">{inv.client.name}</p>
                  {inv.client.company && <p className="text-xs text-text-secondary">{inv.client.company}</p>}
                </td>
                <td className="px-5 py-3 font-mono text-xs text-text-secondary">{inv.shipment.jobNo}</td>
                <td className="px-5 py-3">
                  <span className="badge bg-blue-100 text-blue-800 text-xs">{inv.type}</span>
                </td>
                <td className="px-5 py-3 text-text-secondary">{formatDate(inv.date)}</td>
                <td className="px-5 py-3 text-right font-mono font-bold text-primary-deep">{formatCurrency(inv.total)}</td>
                <td className="px-5 py-3">
                  <span className={`badge text-xs ${
                    inv.status === "PAID" ? "bg-green-100 text-green-800" :
                    inv.status === "SENT" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                  }`}>{inv.status}</span>
                </td>
                <td className="px-5 py-3">
                  <a href={`/api/invoices/${inv.id}/pdf`} className="text-accent-teal hover:underline text-xs flex items-center gap-1">
                    <Download className="w-3 h-3" /> PDF
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
