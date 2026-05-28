import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import Shipment from "@/models/Shipment";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const shipment = await Shipment.findById(params.id).populate("client", "name email company phone address gst");
  if (!shipment) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (session.user.role === "CLIENT" && shipment.client._id.toString() !== session.user.id)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return NextResponse.json(shipment);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const body = await req.json();
  const shipment = await Shipment.findById(params.id);
  if (!shipment) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const prevStatus = shipment.status;
  Object.assign(shipment, body);

  if (body.status && body.status !== prevStatus) {
    shipment.timeline.push({ status: body.status, date: new Date(), note: body.statusNote || "" });
  }
  await shipment.save();
  return NextResponse.json({ success: true });
}
