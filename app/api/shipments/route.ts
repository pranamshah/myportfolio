export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { generateId } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const where: Record<string, unknown> = {};
  if (session.user.role === "CLIENT") where.clientId = session.user.id;
  const status = searchParams.get("status");
  if (status) where.status = status;
  const clientParam = searchParams.get("client");
  if (clientParam && session.user.role === "ADMIN") where.clientId = clientParam;

  const shipments = await prisma.shipment.findMany({
    where,
    include: { client: { select: { id: true, name: true, email: true, company: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(shipments);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const shipmentId = generateId("NI");
  const timeline = [{ status: body.status || "BOOKING_CONFIRMED", date: new Date().toISOString(), note: "Shipment created" }];

  const shipment = await prisma.shipment.create({
    data: {
      shipmentId,
      clientId: body.client,
      description: body.description,
      origin: body.origin,
      destination: body.destination,
      portOfLoading: body.portOfLoading || "",
      portOfDischarge: body.portOfDischarge || "",
      vessel: body.vessel,
      voyageNo: body.voyageNo,
      blNo: body.blNo,
      containerNo: body.containerNo,
      sealNo: body.sealNo,
      packages: body.packages,
      grossWeight: body.grossWeight,
      cbm: body.cbm,
      commodity: body.commodity,
      incoterms: body.incoterms,
      status: body.status || "BOOKING_CONFIRMED",
      etd: body.etd ? new Date(body.etd) : null,
      eta: body.eta ? new Date(body.eta) : null,
      notes: body.notes,
      timeline,
    },
  });
  return NextResponse.json({ success: true, shipmentId, id: shipment.id });
}
