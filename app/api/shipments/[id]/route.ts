export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const shipment = await prisma.shipment.findUnique({
    where: { id: params.id },
    include: { client: { select: { id: true, name: true, email: true, company: true, phone: true, address: true, gst: true } } },
  });
  if (!shipment) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (session.user.role === "CLIENT" && shipment.clientId !== session.user.id)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return NextResponse.json(shipment);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const existing = await prisma.shipment.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let timeline = existing.timeline as { status: string; date: string; note?: string }[];
  if (body.status && body.status !== existing.status) {
    timeline = [...timeline, { status: body.status, date: new Date().toISOString(), note: body.statusNote || "" }];
  }

  const { statusNote: _sn, client: _c, ...rest } = body;
  await prisma.shipment.update({
    where: { id: params.id },
    data: {
      ...rest,
      clientId: body.client || existing.clientId,
      etd: body.etd ? new Date(body.etd) : existing.etd,
      eta: body.eta ? new Date(body.eta) : existing.eta,
      actualDeparture: body.actualDeparture ? new Date(body.actualDeparture) : existing.actualDeparture,
      actualArrival: body.actualArrival ? new Date(body.actualArrival) : existing.actualArrival,
      timeline,
    },
  });
  return NextResponse.json({ success: true });
}
