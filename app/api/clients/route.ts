import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clients = await prisma.user.findMany({
    where: { role: "CLIENT" },
    select: { id: true, name: true, email: true, company: true, phone: true, gst: true, address: true, isActive: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(clients);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const existing = await prisma.user.findUnique({ where: { email: body.email } });
  if (existing) return NextResponse.json({ error: "Email already exists" }, { status: 400 });

  const hashed = await bcrypt.hash(body.password || "Client@12345", 12);
  const user = await prisma.user.create({
    data: { ...body, password: hashed, role: "CLIENT" },
  });
  return NextResponse.json({ success: true, id: user.id });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, password, ...rest } = body;
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const data: Record<string, unknown> = { ...rest };
  if (password) data.password = await bcrypt.hash(password, 12);

  await prisma.user.update({ where: { id }, data });
  return NextResponse.json({ success: true });
}
