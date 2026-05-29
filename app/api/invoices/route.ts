import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { generateId } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const where: Record<string, unknown> = {};
  if (session.user.role === "CLIENT") where.clientId = session.user.id;
  const { searchParams } = new URL(req.url);
  const shipmentParam = searchParams.get("shipment");
  if (shipmentParam) where.shipmentId = shipmentParam;

  const invoices = await prisma.invoice.findMany({
    where,
    include: {
      client: { select: { id: true, name: true, email: true, company: true } },
      shipment: { select: { id: true, shipmentId: true, description: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(invoices);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const prefix = body.invoiceType === "SERVICE" ? "SI" : "RB";
  const invoiceNo = generateId(prefix);
  const subtotal = body.lineItems.reduce((s: number, i: { amount: number }) => s + i.amount, 0);
  const cgst = body.cgst || 0;
  const sgst = body.sgst || 0;
  const igst = body.igst || 0;
  const tds = body.tds || 0;
  const totalAmount = subtotal + cgst + sgst + igst - tds;

  const invoice = await prisma.invoice.create({
    data: {
      invoiceNo,
      invoiceType: body.invoiceType,
      shipmentId: body.shipment || null,
      clientId: body.client,
      invoiceDate: new Date(body.invoiceDate),
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      lineItems: body.lineItems,
      subtotal,
      cgst,
      sgst,
      igst,
      tds,
      totalAmount,
      notes: body.notes,
    },
  });
  return NextResponse.json({ success: true, invoiceNo, id: invoice.id });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, client: _c, shipment: _s, ...update } = body;
  if (update.lineItems) {
    update.subtotal = update.lineItems.reduce((s: number, i: { amount: number }) => s + i.amount, 0);
    update.totalAmount = update.subtotal + (update.cgst || 0) + (update.sgst || 0) + (update.igst || 0) - (update.tds || 0);
  }
  if (update.invoiceDate) update.invoiceDate = new Date(update.invoiceDate);
  if (update.dueDate) update.dueDate = new Date(update.dueDate);
  if (update.paymentDate) update.paymentDate = new Date(update.paymentDate);
  await prisma.invoice.update({ where: { id }, data: update });
  return NextResponse.json({ success: true });
}
