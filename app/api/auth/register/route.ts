export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";

export async function POST(req: Request) {
  await connectDB();

  const { name, company, email, phone, password } = await req.json();

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

  const user = new User({
    name: name.trim(),
    company: company?.trim(),
    email: email.toLowerCase().trim(),
    phone: phone?.trim(),
    password, // bcrypt pre-save hook hashes it
    role: "CLIENT",
    isActive: true,
  });

  await user.save();

  return NextResponse.json({ success: true });
}
