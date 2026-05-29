import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { renderToBuffer } = require("@react-pdf/renderer");
import { InvoicePDF } from "@/components/pdfs/InvoicePDF";
import React from "react";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const invoice = await prisma.invoice.findUnique({
    where: { id: params.id },
    include: {
      client: { select: { name: true, company: true, address: true, gst: true, email: true, phone: true } },
      shipment: true,
    },
  });
  if (!invoice) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (session.user.role === "CLIENT" && invoice.clientId !== session.user.id)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const shipmentData = invoice.shipment ? {
    shipmentId: invoice.shipment.shipmentId,
    description: invoice.shipment.description,
    blNo: invoice.shipment.blNo ?? undefined,
    containerNo: invoice.shipment.containerNo ?? undefined,
    portOfLoading: invoice.shipment.portOfLoading,
    portOfDischarge: invoice.shipment.portOfDischarge,
    vessel: invoice.shipment.vessel ?? undefined,
  } : undefined;

  const invData = {
    invoiceNo: invoice.invoiceNo,
    invoiceType: invoice.invoiceType as "SERVICE" | "REIMBURSEMENT",
    invoiceDate: invoice.invoiceDate.toISOString(),
    dueDate: invoice.dueDate?.toISOString(),
    client: {
      name: invoice.client.name,
      company: invoice.client.company ?? undefined,
      address: invoice.client.address ?? undefined,
      gst: invoice.client.gst ?? undefined,
      email: invoice.client.email,
      phone: invoice.client.phone ?? undefined,
    },
    shipment: shipmentData,
    lineItems: invoice.lineItems as { description: string; hsn?: string; qty: number; rate: number; amount: number }[],
    subtotal: invoice.subtotal,
    cgst: invoice.cgst ?? undefined,
    sgst: invoice.sgst ?? undefined,
    igst: invoice.igst ?? undefined,
    tds: invoice.tds ?? undefined,
    totalAmount: invoice.totalAmount,
    notes: invoice.notes ?? undefined,
  };

  const buffer = await renderToBuffer(React.createElement(InvoicePDF, { inv: invData }));
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${invoice.invoiceNo}.pdf"`,
    },
  });
}
