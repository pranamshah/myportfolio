import { PrismaClient } from "@prisma/client";

declare global {
  var _prismaClient: PrismaClient | undefined;
}

const prisma = global._prismaClient ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") global._prismaClient = prisma;

export default prisma;
