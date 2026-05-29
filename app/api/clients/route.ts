export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const clients = await User.find({ role: "CLIENT" }).select("-password").sort({ createdAt: -1 });
  return NextResponse.json(clients);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const body = await req.json();
  const existing = await User.findOne({ email: body.email });
  if (existing) return NextResponse.json({ error: "Email already exists" }, { status: 400 });
  const user = new User({ ...body, role: "CLIENT" });
  await user.save();
  return NextResponse.json({ success: true, id: user._id });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const body = await req.json();
  const { id, ...update } = body;
  if (update.password === "") delete update.password;
  const user = await User.findById(id);
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  Object.assign(user, update);
  await user.save();
  return NextResponse.json({ success: true });
}
