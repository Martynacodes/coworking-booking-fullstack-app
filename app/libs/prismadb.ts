import { PrismaClient } from "@prisma/client";

// Create a global variable to share the PrismaClient instance across your app
declare global {
  var prisma: PrismaClient | undefined;
}
// Create a constant to check whether PrismaClient is already initialized
const client = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalThis.prisma = client;

export default client;
