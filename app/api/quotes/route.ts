import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail, quoteReceivedEmail } from "@/lib/email";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const quotes = await prisma.quote.findMany({
    orderBy: { createdAt: "desc" },
    include: { client: { select: { name: true, email: true } } },
  });

  return NextResponse.json(quotes);
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const session = await getServerSession(authOptions);
    const clientId = session ? (session.user as { id: string }).id : null;

    const quote = await prisma.quote.create({
      data: {
        clientId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        mode: data.mode,
        movement: data.movement,
        origin: data.origin,
        destination: data.destination,
        cargoType: data.cargoType,
        weight: data.weight ? parseFloat(data.weight) : null,
        cbm: data.cbm ? parseFloat(data.cbm) : null,
        packages: data.packages ? parseInt(data.packages) : null,
        notes: data.notes || data.message,
      },
    });

    // Send confirmation email
    await sendEmail({
      to: data.email,
      subject: "Quote Request Received — Navkar Exim",
      html: quoteReceivedEmail(data.name, data.origin, data.destination),
    }).catch(console.error);

    return NextResponse.json(quote, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to submit quote." }, { status: 500 });
  }
}
