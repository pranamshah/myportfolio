import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@navkarexim.com";
  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existing) {
    const hashed = await bcrypt.hash("Admin@12345", 12);
    await prisma.user.create({
      data: {
        name: "Navkar Exim Admin",
        email: adminEmail,
        password: hashed,
        role: Role.ADMIN,
        phone: "+91 9876543210",
        company: "Navkar Exim",
      },
    });
    console.log(`Admin user created: ${adminEmail}`);
  } else {
    console.log(`Admin user already exists: ${adminEmail}`);
  }

  // Seed some partners
  const partners = [
    { name: "Hapag-Lloyd India Pvt Ltd", type: "SHIPPING_LINE" as const, contact: "Chennai", email: "india@hapag-lloyd.com" },
    { name: "CMA CGM Agencies India", type: "SHIPPING_LINE" as const, contact: "Chennai", email: "india@cma-cgm.com" },
    { name: "Apollo World Connect Ltd", type: "CFS" as const, contact: "Chennai", address: "Chennai Port" },
    { name: "Sanco Trans Limited", type: "CFS" as const, contact: "Chennai", address: "Chennai ICD" },
    { name: "Sakthi Trans", type: "TRANSPORTER" as const, contact: "Chennai" },
  ];

  for (const partner of partners) {
    await prisma.partner.upsert({
      where: { id: partner.name },
      update: {},
      create: partner,
    }).catch(() => prisma.partner.create({ data: partner }));
  }

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
