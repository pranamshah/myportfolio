import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [byStatus, byMode, total] = await Promise.all([
    prisma.shipment.groupBy({ by: ["status"], _count: true }),
    prisma.shipment.groupBy({ by: ["mode"], _count: true }),
    prisma.shipment.count(),
  ]);

  return NextResponse.json({ byStatus, byMode, total });
}
