import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const shipmentId = searchParams.get("shipmentId");
  if (!shipmentId) return NextResponse.json({ error: "shipmentId required" }, { status: 400 });

  const docs = await prisma.document.findMany({
    where: { shipmentId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(docs);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;

  try {
    const formData = await req.formData();
    const shipmentId = formData.get("shipmentId") as string;
    const type = formData.get("type") as string;
    const label = formData.get("label") as string;
    const file = formData.get("file") as File;

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    // Store file path (in production, use cloud storage)
    const filePath = `/uploads/${Date.now()}-${file.name}`;

    const doc = await prisma.document.create({
      data: {
        shipmentId,
        type: type as "BL",
        label,
        filePath,
        uploadedBy: userId,
      },
    });

    return NextResponse.json(doc, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
