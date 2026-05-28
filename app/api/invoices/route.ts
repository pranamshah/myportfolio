import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import Invoice from "@/models/Invoice";
import { generateId } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const filter: Record<string, unknown> = {};
  if (session.user.role === "CLIENT") filter.client = session.user.id;
  const { searchParams } = new URL(req.url);
  const shipmentId = searchParams.get("shipment");
  if (shipmentId) filter.shipment = shipmentId;
  const invoices = await Invoice.find(filter)
    .populate("client", "name email company")
    .populate("shipment", "shipmentId description")
    .sort({ createdAt: -1 });
  return NextResponse.json(invoices);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const body = await req.json();
  const prefix = body.invoiceType === "SERVICE" ? "SI" : "RB";
  const invoiceNo = generateId(prefix);

  const subtotal = body.lineItems.reduce((s: number, i: { amount: number }) => s + i.amount, 0);
  const cgst = body.cgst || 0;
  const sgst = body.sgst || 0;
  const igst = body.igst || 0;
  const tds = body.tds || 0;
  const totalAmount = subtotal + cgst + sgst + igst - tds;

  const invoice = new Invoice({ ...body, invoiceNo, subtotal, cgst, sgst, igst, tds, totalAmount });
  await invoice.save();
  return NextResponse.json({ success: true, invoiceNo, id: invoice._id });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const body = await req.json();
  const { id, ...update } = body;
  if (update.lineItems) {
    update.subtotal = update.lineItems.reduce((s: number, i: { amount: number }) => s + i.amount, 0);
    update.totalAmount = update.subtotal + (update.cgst || 0) + (update.sgst || 0) + (update.igst || 0) - (update.tds || 0);
  }
  await Invoice.findByIdAndUpdate(id, update);
  return NextResponse.json({ success: true });
}
