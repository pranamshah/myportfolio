export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import Invoice from "@/models/Invoice";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { renderToBuffer } = require("@react-pdf/renderer");
import { InvoicePDF } from "@/components/pdfs/InvoicePDF";
import React from "react";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();

  const invoice = await Invoice.findById(params.id).populate("client", "name company address gst email phone").populate("shipment");
  if (!invoice) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (session.user.role === "CLIENT" && invoice.client._id.toString() !== session.user.id)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  let shipmentData = undefined;
  if (invoice.shipment) {
    const s = invoice.shipment as { shipmentId?: string; description?: string; blNo?: string; containerNo?: string; portOfLoading?: string; portOfDischarge?: string; vessel?: string };
    shipmentData = { shipmentId: s.shipmentId || "", description: s.description || "", blNo: s.blNo, containerNo: s.containerNo, portOfLoading: s.portOfLoading, portOfDischarge: s.portOfDischarge, vessel: s.vessel };
  }

  const clientData = invoice.client as unknown as { name: string; company?: string; address?: string; gst?: string; email?: string; phone?: string };
  const invData = {
    invoiceNo: invoice.invoiceNo,
    invoiceType: invoice.invoiceType as "SERVICE" | "REIMBURSEMENT",
    invoiceDate: invoice.invoiceDate.toISOString(),
    dueDate: invoice.dueDate?.toISOString(),
    client: { name: clientData.name, company: clientData.company, address: clientData.address, gst: clientData.gst, email: clientData.email, phone: clientData.phone },
    shipment: shipmentData,
    lineItems: invoice.lineItems,
    subtotal: invoice.subtotal,
    cgst: invoice.cgst,
    sgst: invoice.sgst,
    igst: invoice.igst,
    tds: invoice.tds,
    totalAmount: invoice.totalAmount,
    notes: invoice.notes,
  };

  const buffer = await renderToBuffer(React.createElement(InvoicePDF, { inv: invData }));
  return new NextResponse(buffer, {
    headers: { "Content-Type": "application/pdf", "Content-Disposition": `inline; filename="${invoice.invoiceNo}.pdf"` },
  });
}
