import { PrismaClient } from "../../generated/prisma/client";

// Tell TypeScript that globalThis can hold our prisma instance.
// `var` is required here — `let`/`const` do not work in `declare global`.
declare global {
  var prisma: PrismaClient | undefined;
}

// Use the existing instance if one exists, otherwise create a new one.
export const prisma = global.prisma ?? new PrismaClient();

// In development, ts-node-dev hot-reloads modules on every file save,
// which would create a new PrismaClient on each reload and exhaust the
// MongoDB connection pool. Pinning the instance to `global` (which
// survives hot-reloads) prevents that. In production Node.js caches
// modules automatically, so this block never runs.
if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
