import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateJobNo } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = (session.user as { role: string }).role;
  const userId = (session.user as { id: string }).id;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const mode = searchParams.get("mode");

  const where: Record<string, unknown> = {};
  if (role === "CLIENT") where.clientId = userId;
  if (status) where.status = status;
  if (mode) where.mode = mode;

  const shipments = await prisma.shipment.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      client: { select: { name: true, email: true, company: true } },
      containers: true,
      _count: { select: { documents: true, charges: true } },
    },
  });

  return NextResponse.json(shipments);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const jobNo = generateJobNo();

    const shipment = await prisma.shipment.create({
      data: {
        jobNo,
        clientId: data.clientId,
        mode: data.mode,
        movement: data.movement,
        status: data.status || "BOOKING_CONFIRMED",
        blNo: data.blNo,
        awbNo: data.awbNo,
        beNo: data.beNo,
        mblNo: data.mblNo,
        hblNo: data.hblNo,
        vessel: data.vessel,
        voyage: data.voyage,
        liner: data.liner,
        portLoading: data.portLoading,
        portDischarge: data.portDischarge,
        finalDest: data.finalDest,
        cargoDesc: data.cargoDesc,
        hsCode: data.hsCode,
        packages: data.packages ? parseInt(data.packages) : null,
        grossWeight: data.grossWeight ? parseFloat(data.grossWeight) : null,
        cbm: data.cbm ? parseFloat(data.cbm) : null,
        assessValue: data.assessValue ? parseFloat(data.assessValue) : null,
        dutyAmount: data.dutyAmount ? parseFloat(data.dutyAmount) : null,
        chaName: data.chaName,
        examType: data.examType,
        cfsName: data.cfsName,
        eta: data.eta ? new Date(data.eta) : null,
        sailDate: data.sailDate ? new Date(data.sailDate) : null,
        arrivalDate: data.arrivalDate ? new Date(data.arrivalDate) : null,
        bookingDate: data.bookingDate ? new Date(data.bookingDate) : null,
        clearanceDate: data.clearanceDate ? new Date(data.clearanceDate) : null,
        deliveryDate: data.deliveryDate ? new Date(data.deliveryDate) : null,
        notes: data.notes,
      },
    });

    // Add initial tracking update
    await prisma.trackingUpdate.create({
      data: {
        shipmentId: shipment.id,
        status: shipment.status,
        note: "Shipment created",
      },
    });

    return NextResponse.json(shipment, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create shipment." }, { status: 500 });
  }
}
