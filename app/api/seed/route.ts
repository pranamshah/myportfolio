export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

const DEFAULT_LEDGERS = [
  { name: "Cash", group: "Cash in Hand", type: "ASSET", openingBalance: 0, openingType: "DR", isSystem: true },
  { name: "Bank Account (SBI)", group: "Bank Accounts", type: "ASSET", openingBalance: 0, openingType: "DR", isSystem: true },
  { name: "Sundry Debtors", group: "Sundry Debtors", type: "ASSET", openingBalance: 0, openingType: "DR", isSystem: true },
  { name: "Sundry Creditors", group: "Sundry Creditors", type: "LIABILITY", openingBalance: 0, openingType: "CR", isSystem: true },
  { name: "Capital Account", group: "Capital Account", type: "EQUITY", openingBalance: 0, openingType: "CR", isSystem: true },
  { name: "Freight Income", group: "Direct Income", type: "INCOME", openingBalance: 0, openingType: "CR", isSystem: false },
  { name: "Documentation Income", group: "Direct Income", type: "INCOME", openingBalance: 0, openingType: "CR", isSystem: false },
  { name: "Customs Duty (Reimbursement)", group: "Direct Expenses", type: "EXPENSE", openingBalance: 0, openingType: "DR", isSystem: false },
  { name: "Port Charges", group: "Direct Expenses", type: "EXPENSE", openingBalance: 0, openingType: "DR", isSystem: false },
  { name: "CHA Charges", group: "Direct Expenses", type: "EXPENSE", openingBalance: 0, openingType: "DR", isSystem: false },
  { name: "Transportation Charges", group: "Direct Expenses", type: "EXPENSE", openingBalance: 0, openingType: "DR", isSystem: false },
  { name: "Office Rent", group: "Indirect Expenses", type: "EXPENSE", openingBalance: 0, openingType: "DR", isSystem: false },
  { name: "Salary Expenses", group: "Indirect Expenses", type: "EXPENSE", openingBalance: 0, openingType: "DR", isSystem: false },
  { name: "GST Payable", group: "Duties & Taxes", type: "LIABILITY", openingBalance: 0, openingType: "CR", isSystem: true },
  { name: "TDS Payable", group: "Duties & Taxes", type: "LIABILITY", openingBalance: 0, openingType: "CR", isSystem: true },
  { name: "Input CGST", group: "Duties & Taxes", type: "ASSET", openingBalance: 0, openingType: "DR", isSystem: true },
  { name: "Input SGST", group: "Duties & Taxes", type: "ASSET", openingBalance: 0, openingType: "DR", isSystem: true },
  { name: "Input IGST", group: "Duties & Taxes", type: "ASSET", openingBalance: 0, openingType: "DR", isSystem: true },
];

export async function GET() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@navkarimpex.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@12345";
  const clientEmail = "client@navkarimpex.com";
  const clientPassword = "Client@12345";

  let adminCreated = false;
  const existingAdmin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        name: "Navkar Admin",
        email: adminEmail,
        password: await bcrypt.hash(adminPassword, 12),
        role: "ADMIN",
        isActive: true,
      },
    });
    adminCreated = true;
  }

  let clientCreated = false;
  const existingClient = await prisma.user.findUnique({ where: { email: clientEmail } });
  if (!existingClient) {
    await prisma.user.create({
      data: {
        name: "Demo Client",
        email: clientEmail,
        password: await bcrypt.hash(clientPassword, 12),
        role: "CLIENT",
        isActive: true,
      },
    });
    clientCreated = true;
  }

  let ledgersCreated = 0;
  for (const led of DEFAULT_LEDGERS) {
    const exists = await prisma.ledger.findUnique({ where: { name: led.name } });
    if (!exists) {
      await prisma.ledger.create({ data: led });
      ledgersCreated++;
    }
  }

  return NextResponse.json({ success: true, message: "Seed complete.", adminCreated, clientCreated, ledgersCreated });
}
