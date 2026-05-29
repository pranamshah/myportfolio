const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: ".env" });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/navkar_impex";

const UserSchema = new mongoose.Schema({ name: String, email: String, password: String, role: String, isActive: Boolean }, { timestamps: true });
UserSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
const User = mongoose.models.User || mongoose.model("User", UserSchema);

const LedgerSchema = new mongoose.Schema({ name: String, group: String, type: String, openingBalance: Number, openingType: String, description: String, isSystem: Boolean }, { timestamps: true });
const Ledger = mongoose.models.Ledger || mongoose.model("Ledger", LedgerSchema);

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

async function seed() {
  await mongoose.connect(MONGODB_URI, { bufferCommands: false });
  console.log("Connected to MongoDB");

  // Admin user
  const adminEmail = process.env.ADMIN_EMAIL || "admin@navkarimpex.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@12345";

  const existing = await User.findOne({ email: adminEmail });
  if (!existing) {
    const admin = new User({ name: "Navkar Admin", email: adminEmail, password: adminPassword, role: "ADMIN", isActive: true });
    await admin.save();
    console.log("✓ Admin user created:", adminEmail);
  } else {
    console.log("✓ Admin user already exists");
  }

  // Default ledgers
  for (const led of DEFAULT_LEDGERS) {
    const exists = await Ledger.findOne({ name: led.name });
    if (!exists) {
      await Ledger.create(led);
      console.log(`✓ Ledger created: ${led.name}`);
    }
  }

  console.log("\n✅ Seed complete!");
  console.log(`\nAdmin login:\n  Email: ${adminEmail}\n  Password: ${adminPassword}`);
  await mongoose.disconnect();
}

seed().catch(err => { console.error("Seed error:", err); process.exit(1); });
