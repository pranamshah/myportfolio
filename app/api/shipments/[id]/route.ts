import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail, shipmentStatusEmail } from "@/lib/email";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = (session.user as { role: string }).role;
  const userId = (session.user as { id: string }).id;

  const shipment = await prisma.shipment.findUnique({
    where: { id: params.id },
    include: {
      client: { select: { name: true, email: true, company: true, phone: true } },
      containers: true,
      documents: true,
      charges: true,
      invoices: true,
      trackingUpdates: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!shipment) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (role === "CLIENT" && shipment.clientId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(shipment);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const prevShipment = await prisma.shipment.findUnique({ where: { id: params.id }, include: { client: true } });

    const shipment = await prisma.shipment.update({
      where: { id: params.id },
      data: {
        status: data.status,
        blNo: data.blNo,
        awbNo: data.awbNo,
        beNo: data.beNo,
        beDate: data.beDate ? new Date(data.beDate) : undefined,
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
        packages: data.packages ? parseInt(data.packages) : undefined,
        grossWeight: data.grossWeight ? parseFloat(data.grossWeight) : undefined,
        cbm: data.cbm ? parseFloat(data.cbm) : undefined,
        assessValue: data.assessValue ? parseFloat(data.assessValue) : undefined,
        dutyAmount: data.dutyAmount ? parseFloat(data.dutyAmount) : undefined,
        chaName: data.chaName,
        examType: data.examType,
        cfsName: data.cfsName,
        eta: data.eta ? new Date(data.eta) : undefined,
        sailDate: data.sailDate ? new Date(data.sailDate) : undefined,
        arrivalDate: data.arrivalDate ? new Date(data.arrivalDate) : undefined,
        clearanceDate: data.clearanceDate ? new Date(data.clearanceDate) : undefined,
        deliveryDate: data.deliveryDate ? new Date(data.deliveryDate) : undefined,
        notes: data.notes,
      },
    });

    // Add tracking update if status changed
    if (prevShipment && data.status && prevShipment.status !== data.status) {
      await prisma.trackingUpdate.create({
        data: {
          shipmentId: shipment.id,
          status: data.status,
          note: data.statusNote || `Status updated to ${data.status}`,
          notifyClient: data.notifyClient || false,
        },
      });

      if (data.notifyClient && prevShipment.client) {
        await sendEmail({
          to: prevShipment.client.email,
          subject: `Shipment Update: ${shipment.jobNo} — Navkar Exim`,
          html: shipmentStatusEmail(shipment.jobNo, data.status, prevShipment.client.name),
        }).catch(console.error);
      }
    }

    return NextResponse.json(shipment);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Update failed." }, { status: 500 });
  }
}
