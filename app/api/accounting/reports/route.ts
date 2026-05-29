export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import Voucher from "@/models/Voucher";
import Ledger from "@/models/Ledger";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();

  const { searchParams } = new URL(req.url);
  const report = searchParams.get("report");
  const from = searchParams.get("from") ? new Date(searchParams.get("from")!) : new Date(new Date().getFullYear(), 3, 1);
  const to = searchParams.get("to") ? new Date(searchParams.get("to")! + "T23:59:59") : new Date();

  const vouchers = await Voucher.find({ date: { $gte: from, $lte: to } });
  const ledgers = await Ledger.find();
  const ledgerMap = new Map(ledgers.map(l => [l._id.toString(), l]));

  const balances: Record<string, { dr: number; cr: number }> = {};
  for (const v of vouchers) {
    for (const e of v.entries) {
      const lid = e.ledger.toString();
      if (!balances[lid]) balances[lid] = { dr: 0, cr: 0 };
      if (e.type === "DR") balances[lid].dr += e.amount;
      else balances[lid].cr += e.amount;
    }
  }

  if (report === "daybook") {
    const dayVouchers = await Voucher.find({ date: { $gte: from, $lte: to } })
      .populate("entries.ledger", "name group type")
      .sort({ date: 1, createdAt: 1 });
    return NextResponse.json(dayVouchers);
  }

  if (report === "trial") {
    const rows = ledgers.map(l => {
      const b = balances[l._id.toString()] || { dr: 0, cr: 0 };
      const openDR = l.openingType === "DR" ? l.openingBalance : 0;
      const openCR = l.openingType === "CR" ? l.openingBalance : 0;
      const net = b.dr + openDR - (b.cr + openCR);
      return { name: l.name, group: l.group, type: l.type, dr: net > 0 ? net : 0, cr: net < 0 ? Math.abs(net) : 0 };
    }).filter(r => r.dr !== 0 || r.cr !== 0);
    return NextResponse.json(rows);
  }

  if (report === "pl") {
    const income = ledgers.filter(l => l.type === "INCOME").map(l => {
      const b = balances[l._id.toString()] || { dr: 0, cr: 0 };
      return { name: l.name, group: l.group, amount: b.cr - b.dr };
    }).filter(r => r.amount !== 0);
    const expense = ledgers.filter(l => l.type === "EXPENSE").map(l => {
      const b = balances[l._id.toString()] || { dr: 0, cr: 0 };
      return { name: l.name, group: l.group, amount: b.dr - b.cr };
    }).filter(r => r.amount !== 0);
    const totalIncome = income.reduce((s, r) => s + r.amount, 0);
    const totalExpense = expense.reduce((s, r) => s + r.amount, 0);
    return NextResponse.json({ income, expense, totalIncome, totalExpense, netProfit: totalIncome - totalExpense });
  }

  if (report === "balance") {
    const assets = ledgers.filter(l => l.type === "ASSET").map(l => {
      const b = balances[l._id.toString()] || { dr: 0, cr: 0 };
      const open = l.openingType === "DR" ? l.openingBalance : -l.openingBalance;
      return { name: l.name, group: l.group, amount: open + b.dr - b.cr };
    }).filter(r => r.amount !== 0);
    const liabilities = ledgers.filter(l => l.type === "LIABILITY" || l.type === "EQUITY").map(l => {
      const b = balances[l._id.toString()] || { dr: 0, cr: 0 };
      const open = l.openingType === "CR" ? l.openingBalance : -l.openingBalance;
      return { name: l.name, group: l.group, amount: open + b.cr - b.dr };
    }).filter(r => r.amount !== 0);
    return NextResponse.json({ assets, liabilities });
  }

  if (report === "ledger") {
    const ledgerId = searchParams.get("ledgerId");
    if (!ledgerId) return NextResponse.json({ error: "ledgerId required" }, { status: 400 });
    const ledger = ledgerMap.get(ledgerId);
    if (!ledger) return NextResponse.json({ error: "Ledger not found" }, { status: 404 });
    const entries: { date: Date; voucherNo: string; voucherType: string; narration: string; dr: number; cr: number }[] = [];
    for (const v of await Voucher.find({ date: { $gte: from, $lte: to }, "entries.ledger": ledgerId }).sort({ date: 1 })) {
      for (const e of v.entries) {
        if (e.ledger.toString() === ledgerId) {
          entries.push({ date: v.date, voucherNo: v.voucherNo, voucherType: v.voucherType, narration: v.narration, dr: e.type === "DR" ? e.amount : 0, cr: e.type === "CR" ? e.amount : 0 });
        }
      }
    }
    return NextResponse.json({ ledger, entries });
  }

  return NextResponse.json({ error: "Invalid report type" }, { status: 400 });
}
