import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clients = await prisma.user.findMany({
    where: { role: "CLIENT" },
    select: { id: true, name: true, email: true, phone: true, company: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(clients);
}
