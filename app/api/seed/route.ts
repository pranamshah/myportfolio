export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";
import Ledger from "@/models/Ledger";

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
  await connectDB();

  const adminEmail = process.env.ADMIN_EMAIL || "admin@navkarimpex.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@12345";
  const clientEmail = "client@navkarimpex.com";
  const clientPassword = "Client@12345";

  let adminCreated = false;
  const existingAdmin = await User.findOne({ role: "ADMIN" });
  if (!existingAdmin) {
    await new User({ name: "Navkar Admin", email: adminEmail, password: adminPassword, role: "ADMIN", isActive: true }).save();
    adminCreated = true;
  }

  let clientCreated = false;
  const existingClient = await User.findOne({ email: clientEmail });
  if (!existingClient) {
    await new User({ name: "Demo Client", email: clientEmail, password: clientPassword, role: "CLIENT", isActive: true }).save();
    clientCreated = true;
  }

  let ledgersCreated = 0;
  for (const led of DEFAULT_LEDGERS) {
    const exists = await Ledger.findOne({ name: led.name });
    if (!exists) { await Ledger.create(led); ledgersCreated++; }
  }

  return NextResponse.json({ success: true, message: "Seed complete.", adminCreated, clientCreated, ledgersCreated });
}
