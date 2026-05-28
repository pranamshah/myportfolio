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

  // Safety check — only seed if no admin exists
  const existing = await User.findOne({ role: "ADMIN" });
  if (existing) {
    return NextResponse.json({ message: "Already seeded. Admin exists.", email: existing.email });
  }

  const adminEmail = process.env.ADMIN_EMAIL || "admin@navkarimpex.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@12345";

  const admin = new User({ name: "Navkar Admin", email: adminEmail, password: adminPassword, role: "ADMIN", isActive: true });
  await admin.save();

  let ledgersCreated = 0;
  for (const led of DEFAULT_LEDGERS) {
    const exists = await Ledger.findOne({ name: led.name });
    if (!exists) { await Ledger.create(led); ledgersCreated++; }
  }

  return NextResponse.json({
    success: true,
    message: "Database seeded successfully!",
    admin: adminEmail,
    password: adminPassword,
    ledgersCreated,
  });
}
