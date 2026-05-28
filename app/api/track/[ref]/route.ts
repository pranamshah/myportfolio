import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: { ref: string } }) {
  const { ref } = params;

  const shipment = await prisma.shipment.findFirst({
    where: {
      OR: [
        { jobNo: { equals: ref, mode: "insensitive" } },
        { blNo: { equals: ref, mode: "insensitive" } },
        { awbNo: { equals: ref, mode: "insensitive" } },
        { beNo: { equals: ref, mode: "insensitive" } },
      ],
    },
    include: {
      client: { select: { name: true } },
      trackingUpdates: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!shipment) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(shipment);
}
