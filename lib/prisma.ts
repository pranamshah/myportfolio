import { PrismaClient } from "@prisma/client";

declare global {
  var _prismaClient: PrismaClient | undefined;
}

function getInstance(): PrismaClient {
  if (!global._prismaClient) {
    global._prismaClient = new PrismaClient();
  }
  return global._prismaClient;
}

// Proxy so PrismaClient is only instantiated on first actual DB call, not at import time
const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop: string | symbol) {
    return getInstance()[prop as keyof PrismaClient];
  },
});

export default prisma;
