export const dynamic = "force-dynamic";

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

  const quotes = await prisma.quote.findMany({
    where,
    include: { client: { select: { id: true, name: true, email: true, company: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(quotes);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const quoteNo = generateId("QT");
  const clientId = session.user.role === "ADMIN" ? body.client : session.user.id;

  const quote = await prisma.quote.create({
    data: {
      quoteNo,
      clientId,
      origin: body.origin,
      destination: body.destination,
      cargoType: body.cargoType,
      incoterms: body.incoterms,
      weight: body.weight,
      cbm: body.cbm,
      packages: body.packages,
      commodity: body.commodity,
      additionalServices: body.additionalServices || [],
      remarks: body.remarks,
      quotedAmount: body.quotedAmount,
      validUntil: body.validUntil ? new Date(body.validUntil) : null,
      status: body.status || "PENDING",
      adminNotes: body.adminNotes,
    },
  });
  return NextResponse.json({ success: true, quoteNo, id: quote.id });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, client: _c, ...update } = body;
  if (update.validUntil) update.validUntil = new Date(update.validUntil);
  await prisma.quote.update({ where: { id }, data: update });
  return NextResponse.json({ success: true });
}
