import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import Voucher from "@/models/Voucher";
import { generateId } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const { searchParams } = new URL(req.url);
  const filter: Record<string, unknown> = {};
  const type = searchParams.get("type");
  if (type) filter.voucherType = type;
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  if (from || to) {
    filter.date = {};
    if (from) (filter.date as Record<string, unknown>).$gte = new Date(from);
    if (to) (filter.date as Record<string, unknown>).$lte = new Date(to + "T23:59:59");
  }
  const vouchers = await Voucher.find(filter)
    .populate("entries.ledger", "name group type")
    .sort({ date: -1, createdAt: -1 });
  return NextResponse.json(vouchers);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const body = await req.json();
  const prefix = { SALES: "SV", PURCHASE: "PV", RECEIPT: "RV", PAYMENT: "PY", JOURNAL: "JV", CONTRA: "CV", CREDIT_NOTE: "CN", DEBIT_NOTE: "DN" }[body.voucherType as string] || "VR";
  const voucherNo = generateId(prefix);

  const totalDR = body.entries.filter((e: { type: string }) => e.type === "DR").reduce((s: number, e: { amount: number }) => s + e.amount, 0);
  const totalCR = body.entries.filter((e: { type: string }) => e.type === "CR").reduce((s: number, e: { amount: number }) => s + e.amount, 0);
  if (Math.abs(totalDR - totalCR) > 0.01) {
    return NextResponse.json({ error: "Debit and Credit totals must match" }, { status: 400 });
  }

  const voucher = new Voucher({ ...body, voucherNo, totalAmount: totalDR, createdBy: session.user.id });
  await voucher.save();
  return NextResponse.json({ success: true, voucherNo, id: voucher._id });
}
