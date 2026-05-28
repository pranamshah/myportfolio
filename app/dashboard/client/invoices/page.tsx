"use client";
import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import { InvoiceBadge } from "@/components/ui/Badge";
import { formatDate, formatINR } from "@/lib/utils";

interface Invoice {
  _id: string; invoiceNo: string; invoiceType: string; invoiceDate: string;
  totalAmount: number; amountPaid: number; status: string;
  shipment?: { shipmentId: string };
}

export default function ClientInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    fetch("/api/invoices").then(r => r.json()).then(d => setInvoices(Array.isArray(d) ? d : []));
  }, []);

  const totalOutstanding = invoices.reduce((s, i) => s + i.totalAmount - i.amountPaid, 0);
  const totalPaid = invoices.reduce((s, i) => s + i.amountPaid, 0);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <p className="section-heading">Billing</p>
        <h1 className="page-heading">My Invoices</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="card-luxury p-4">
          <div className="text-xs text-ink-muted mb-1">Total Invoiced</div>
          <div className="text-lg font-semibold text-ink">{formatINR(invoices.reduce((s, i) => s + i.totalAmount, 0))}</div>
        </div>
        <div className="card-luxury p-4">
          <div className="text-xs text-ink-muted mb-1">Amount Paid</div>
          <div className="text-lg font-semibold text-green-400">{formatINR(totalPaid)}</div>
        </div>
        <div className="card-luxury p-4">
          <div className="text-xs text-ink-muted mb-1">Outstanding</div>
          <div className="text-lg font-semibold text-gold">{formatINR(totalOutstanding)}</div>
        </div>
      </div>

      <div className="card-luxury overflow-hidden">
        <table className="table-luxury">
          <thead>
            <tr>
              <th>Invoice No</th>
              <th>Shipment</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Paid</th>
              <th>Outstanding</th>
              <th>Status</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(inv => (
              <tr key={inv._id}>
                <td className="font-medium text-sm text-ink">{inv.invoiceNo}</td>
                <td className="text-xs text-ink-secondary">{inv.shipment?.shipmentId || "—"}</td>
                <td><span className="text-xs bg-surface-hover px-2 py-0.5 rounded text-ink-secondary">{inv.invoiceType}</span></td>
                <td className="font-medium text-sm">{formatINR(inv.totalAmount)}</td>
                <td className="text-sm text-green-400">{formatINR(inv.amountPaid)}</td>
                <td className="text-sm text-gold">{formatINR(inv.totalAmount - inv.amountPaid)}</td>
                <td><InvoiceBadge status={inv.status} /></td>
                <td className="text-xs text-ink-muted">{formatDate(inv.invoiceDate)}</td>
                <td>
                  <a href={`/api/invoices/${inv._id}/pdf`} target="_blank" className="inline-flex items-center gap-1 text-xs text-gold hover:text-gold-light">
                    <Download size={12} /> PDF
                  </a>
                </td>
              </tr>
            ))}
            {invoices.length === 0 && <tr><td colSpan={9} className="text-center text-ink-muted py-10">No invoices yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
