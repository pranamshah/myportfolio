"use client";
import { useState, useEffect } from "react";
import { Receipt, Download } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Invoice {
  id: string;
  invoiceNo: string;
  type: string;
  date: string;
  total: number;
  status: string;
  shipment: { jobNo: string };
}

export default function ClientInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/invoices").then((r) => r.json()).then(setInvoices).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-primary-deep">My Invoices</h1>
        <p className="text-text-secondary mt-1">{invoices.length} invoices</p>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-light border-b">
            <tr>
              <th className="text-left px-5 py-3 text-text-secondary font-medium">Invoice No</th>
              <th className="text-left px-5 py-3 text-text-secondary font-medium">Job No</th>
              <th className="text-left px-5 py-3 text-text-secondary font-medium">Type</th>
              <th className="text-left px-5 py-3 text-text-secondary font-medium">Date</th>
              <th className="text-right px-5 py-3 text-text-secondary font-medium">Amount</th>
              <th className="text-left px-5 py-3 text-text-secondary font-medium">Status</th>
              <th className="text-left px-5 py-3 text-text-secondary font-medium">Download</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={7} className="p-8 text-center text-text-secondary">Loading...</td></tr>
            ) : invoices.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-12 text-center">
                  <Receipt className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-text-secondary">No invoices yet</p>
                </td>
              </tr>
            ) : invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-neutral-light/50">
                <td className="px-5 py-3 font-mono font-semibold text-accent-teal">{inv.invoiceNo}</td>
                <td className="px-5 py-3 font-mono text-xs text-text-secondary">{inv.shipment.jobNo}</td>
                <td className="px-5 py-3"><span className="badge bg-blue-100 text-blue-800 text-xs">{inv.type}</span></td>
                <td className="px-5 py-3 text-text-secondary">{formatDate(inv.date)}</td>
                <td className="px-5 py-3 text-right font-bold font-mono">{formatCurrency(inv.total)}</td>
                <td className="px-5 py-3">
                  <span className={`badge text-xs ${inv.status === "PAID" ? "bg-green-100 text-green-800" : inv.status === "SENT" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}>
                    {inv.status}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <a href={`/api/invoices/${inv.id}/pdf`} className="text-accent-teal hover:underline flex items-center gap-1 text-xs">
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
