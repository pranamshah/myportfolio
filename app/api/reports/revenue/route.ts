import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const invoices = await prisma.invoice.findMany({
    where: { status: "PAID" },
    select: { total: true, date: true },
    orderBy: { date: "asc" },
  });

  const monthMap = new Map<string, number>();
  invoices.forEach(({ total, date }) => {
    const key = new Date(date).toLocaleDateString("en-IN", { month: "short", year: "numeric" });
    monthMap.set(key, (monthMap.get(key) || 0) + total);
  });

  const data = Array.from(monthMap.entries()).map(([month, revenue]) => ({ month, revenue }));
  return NextResponse.json(data);
}
