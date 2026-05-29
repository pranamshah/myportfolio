export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { generateId } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const where: Record<string, unknown> = {};
  const type = searchParams.get("type");
  if (type) where.voucherType = type;
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  if (from || to) {
    where.date = {};
    if (from) (where.date as Record<string, unknown>).gte = new Date(from);
    if (to) (where.date as Record<string, unknown>).lte = new Date(to + "T23:59:59");
  }

  const vouchers = await prisma.voucher.findMany({
    where,
    include: { entries: { include: { ledger: { select: { id: true, name: true, group: true, type: true } } } } },
    orderBy: [{ date: "desc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(vouchers);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const prefix = ({ SALES: "SV", PURCHASE: "PV", RECEIPT: "RV", PAYMENT: "PY", JOURNAL: "JV", CONTRA: "CV", CREDIT_NOTE: "CN", DEBIT_NOTE: "DN" } as Record<string, string>)[body.voucherType] || "VR";
  const voucherNo = generateId(prefix);

  const totalDR = body.entries.filter((e: { type: string }) => e.type === "DR").reduce((s: number, e: { amount: number }) => s + e.amount, 0);
  const totalCR = body.entries.filter((e: { type: string }) => e.type === "CR").reduce((s: number, e: { amount: number }) => s + e.amount, 0);
  if (Math.abs(totalDR - totalCR) > 0.01) {
    return NextResponse.json({ error: "Debit and Credit totals must match" }, { status: 400 });
  }

  const voucher = await prisma.voucher.create({
    data: {
      voucherNo,
      voucherType: body.voucherType,
      date: new Date(body.date),
      narration: body.narration,
      totalAmount: totalDR,
      reference: body.reference,
      attachments: body.attachments || [],
      createdById: session.user.id,
      entries: {
        create: body.entries.map((e: { ledger: string; ledgerName: string; type: string; amount: number; narration?: string }) => ({
          ledgerId: e.ledger,
          ledgerName: e.ledgerName,
          type: e.type,
          amount: e.amount,
          narration: e.narration,
        })),
      },
    },
  });
  return NextResponse.json({ success: true, voucherNo, id: voucher.id });
}
