import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import Shipment from "@/models/Shipment";
import { generateId } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const { searchParams } = new URL(req.url);
  const filter: Record<string, unknown> = {};
  if (session.user.role === "CLIENT") filter.client = session.user.id;
  const status = searchParams.get("status");
  if (status) filter.status = status;
  const client = searchParams.get("client");
  if (client && session.user.role === "ADMIN") filter.client = client;
  const shipments = await Shipment.find(filter).populate("client", "name email company").sort({ createdAt: -1 });
  return NextResponse.json(shipments);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const body = await req.json();
  const shipmentId = generateId("NI");
  const shipment = new Shipment({
    ...body,
    shipmentId,
    timeline: [{ status: body.status || "BOOKING_CONFIRMED", date: new Date(), note: "Shipment created" }],
  });
  await shipment.save();
  return NextResponse.json({ success: true, shipmentId, id: shipment._id });
}
