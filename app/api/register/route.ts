export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("DB connect error:", msg);
    return NextResponse.json({ error: `Database connection failed: ${msg}` }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { name, company, email, phone, password, accountType } = body;

    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json({ error: "Name, email and password are required." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 400 });
    }

    const role = accountType === "business" ? "ADMIN" : "CLIENT";

    const user = new User({
      name: name.trim(),
      company: company?.trim() || "",
      email: email.toLowerCase().trim(),
      phone: phone?.trim() || "",
      password,
      role,
      isActive: true,
    });

    await user.save();
    return NextResponse.json({ success: true, role });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Register error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
