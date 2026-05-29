import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const shipmentId = searchParams.get("shipment");
  const where: Record<string, unknown> = {};
  if (shipmentId) where.shipmentId = shipmentId;
  if (session.user.role === "CLIENT") where.isVisibleToClient = true;

  const docs = await prisma.document.findMany({
    where,
    include: {
      uploadedBy: { select: { id: true, name: true } },
      shipment: { select: { id: true, shipmentId: true, description: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(docs);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File;
  const shipmentId = formData.get("shipment") as string;
  const category = (formData.get("category") as string) || "OTHER";
  const description = (formData.get("description") as string) || "";
  const isVisibleToClient = formData.get("isVisibleToClient") === "true";
  const name = (formData.get("name") as string) || file.name;

  if (!file || !shipmentId) return NextResponse.json({ error: "File and shipment required" }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = file.name.split(".").pop();
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads", shipmentId);
  await mkdir(dir, { recursive: true });
  const filePath = path.join(dir, filename);
  await writeFile(filePath, buffer);

  const doc = await prisma.document.create({
    data: {
      shipmentId,
      uploadedById: session.user.id,
      name,
      originalName: file.name,
      fileType: file.type,
      fileSize: file.size,
      filePath: `/uploads/${shipmentId}/${filename}`,
      category,
      description,
      isVisibleToClient,
    },
  });
  return NextResponse.json({ success: true, id: doc.id, filePath: doc.filePath });
}
