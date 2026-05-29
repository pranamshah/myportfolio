export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const ledgers = await prisma.ledger.findMany({ orderBy: [{ group: "asc" }, { name: "asc" }] });
  return NextResponse.json(ledgers);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const ledger = await prisma.ledger.create({ data: body });
  return NextResponse.json({ success: true, id: ledger.id });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, ...update } = body;
  const ledger = await prisma.ledger.findUnique({ where: { id } });
  if (!ledger) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (ledger.isSystem) return NextResponse.json({ error: "Cannot edit system ledger" }, { status: 400 });
  await prisma.ledger.update({ where: { id }, data: update });
  return NextResponse.json({ success: true });
}
