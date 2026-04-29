import type { Request, Response, NextFunction } from "express";

type Role = "admin" | "employee";

export function requireRole(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userRole = (req.user as any)?.role as Role | undefined;

    if (!userRole || !roles.includes(userRole)) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    next();
  };
}
