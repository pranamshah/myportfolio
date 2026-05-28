import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const shipmentId = searchParams.get("shipmentId");
  if (!shipmentId) return NextResponse.json({ error: "shipmentId required" }, { status: 400 });

  const charges = await prisma.charge.findMany({
    where: { shipmentId },
    orderBy: { category: "asc" },
  });

  return NextResponse.json(charges);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const taxableAmt = parseFloat(data.rate) * parseFloat(data.units || 1);
    const cgst = taxableAmt * (parseFloat(data.cgstRate || 0) / 100);
    const sgst = taxableAmt * (parseFloat(data.sgstRate || 0) / 100);
    const igst = taxableAmt * (parseFloat(data.igstRate || 0) / 100);
    const totalAmt = taxableAmt + cgst + sgst + igst;

    const charge = await prisma.charge.create({
      data: {
        shipmentId: data.shipmentId,
        category: data.category,
        name: data.name,
        sacCode: data.sacCode,
        units: parseFloat(data.units || 1),
        rate: parseFloat(data.rate),
        taxableAmt,
        cgstRate: parseFloat(data.cgstRate || 0),
        sgstRate: parseFloat(data.sgstRate || 0),
        igstRate: parseFloat(data.igstRate || 0),
        totalAmt,
        paidBy: data.paidBy,
        vendorName: data.vendorName,
        refInvoiceNo: data.refInvoiceNo,
      },
    });

    return NextResponse.json(charge, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to add charge." }, { status: 500 });
  }
}
