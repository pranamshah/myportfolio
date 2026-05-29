export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, company, email, phone, password, accountType } = await req.json();

    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json({ error: "Name, email and password are required." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 12);
    const role = accountType === "business" ? "ADMIN" : "CLIENT";

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        company: company?.trim() || "",
        email: email.toLowerCase().trim(),
        phone: phone?.trim() || "",
        password: hashed,
        role,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, role, id: user.id });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Register error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
