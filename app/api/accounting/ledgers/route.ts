export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import Ledger from "@/models/Ledger";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const ledgers = await Ledger.find().sort({ group: 1, name: 1 });
  return NextResponse.json(ledgers);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const body = await req.json();
  const ledger = new Ledger(body);
  await ledger.save();
  return NextResponse.json({ success: true, id: ledger._id });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const body = await req.json();
  const { id, ...update } = body;
  const ledger = await Ledger.findById(id);
  if (!ledger) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (ledger.isSystem) return NextResponse.json({ error: "Cannot edit system ledger" }, { status: 400 });
  await Ledger.findByIdAndUpdate(id, update);
  return NextResponse.json({ success: true });
}
