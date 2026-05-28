import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import Quote from "@/models/Quote";
import { generateId } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const filter: Record<string, unknown> = {};
  if (session.user.role === "CLIENT") filter.client = session.user.id;
  const quotes = await Quote.find(filter).populate("client", "name email company").sort({ createdAt: -1 });
  return NextResponse.json(quotes);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const body = await req.json();
  const quoteNo = generateId("QT");
  const clientId = session.user.role === "ADMIN" ? body.client : session.user.id;
  const quote = new Quote({ ...body, quoteNo, client: clientId });
  await quote.save();
  return NextResponse.json({ success: true, quoteNo, id: quote._id });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const body = await req.json();
  const { id, ...update } = body;
  await Quote.findByIdAndUpdate(id, update);
  return NextResponse.json({ success: true });
}
