import "dotenv/config";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import { prisma } from "./lib/prisma";

const app = express();
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";

app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json());

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

async function main() {
  await prisma.$connect();
  console.log("Connected to MongoDB via Prisma");
  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
}

main().catch((err) => {
  console.error("Startup failed:", err);
  process.exit(1);
});
