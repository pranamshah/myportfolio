import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateInvoiceNo } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = (session.user as { role: string }).role;
  const userId = (session.user as { id: string }).id;

  const { searchParams } = new URL(req.url);
  const shipmentId = searchParams.get("shipmentId");

  const where: Record<string, unknown> = {};
  if (role === "CLIENT") where.clientId = userId;
  if (shipmentId) where.shipmentId = shipmentId;

  const invoices = await prisma.invoice.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      client: { select: { name: true, email: true, company: true } },
      shipment: { select: { jobNo: true, portLoading: true, portDischarge: true } },
    },
  });

  return NextResponse.json(invoices);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const invoiceNo = generateInvoiceNo(data.type);

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNo,
        shipmentId: data.shipmentId,
        clientId: data.clientId,
        type: data.type,
        date: data.date ? new Date(data.date) : new Date(),
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        items: data.items,
        subtotal: parseFloat(data.subtotal),
        cgst: parseFloat(data.cgst || 0),
        sgst: parseFloat(data.sgst || 0),
        igst: parseFloat(data.igst || 0),
        total: parseFloat(data.total),
        status: data.status || "DRAFT",
        notes: data.notes,
      },
    });

    return NextResponse.json(invoice, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create invoice." }, { status: 500 });
  }
}
