import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import ShipDoc from "@/models/Document";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const { searchParams } = new URL(req.url);
  const shipmentId = searchParams.get("shipment");
  const filter: Record<string, unknown> = {};
  if (shipmentId) filter.shipment = shipmentId;
  if (session.user.role === "CLIENT") filter.isVisibleToClient = true;
  const docs = await ShipDoc.find(filter)
    .populate("uploadedBy", "name")
    .populate("shipment", "shipmentId description")
    .sort({ createdAt: -1 });
  return NextResponse.json(docs);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();

  const formData = await req.formData();
  const file = formData.get("file") as File;
  const shipment = formData.get("shipment") as string;
  const category = (formData.get("category") as string) || "OTHER";
  const description = (formData.get("description") as string) || "";
  const isVisibleToClient = formData.get("isVisibleToClient") === "true";
  const name = (formData.get("name") as string) || file.name;

  if (!file || !shipment) return NextResponse.json({ error: "File and shipment required" }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = file.name.split(".").pop();
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads", shipment);
  await mkdir(dir, { recursive: true });
  const filePath = path.join(dir, filename);
  await writeFile(filePath, buffer);

  const doc = new ShipDoc({
    shipment,
    uploadedBy: session.user.id,
    name,
    originalName: file.name,
    fileType: file.type,
    fileSize: file.size,
    filePath: `/uploads/${shipment}/${filename}`,
    category,
    description,
    isVisibleToClient,
  });
  await doc.save();
  return NextResponse.json({ success: true, id: doc._id, filePath: doc.filePath });
}
