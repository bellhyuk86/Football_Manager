import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "tactify-fc-secret-key";

export interface AuthPayload {
  userId: string;
  teamId: string | null;
  role: "manager" | "coach" | "player";
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "인증이 필요합니다." });
    return;
  }

  try {
    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, JWT_SECRET) as AuthPayload;
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ error: "유효하지 않은 토큰입니다." });
  }
}

export function authorize(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: "인증이 필요합니다." });
      return;
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: "권한이 없습니다." });
      return;
    }
    next();
  };
}

export function generateToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function generateResetToken(userId: string): string {
  return jwt.sign({ userId, type: "reset" }, JWT_SECRET, { expiresIn: "1h" });
}

export function verifyResetToken(token: string): { userId: string } | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string; type: string };
    if (payload.type !== "reset") return null;
    return { userId: payload.userId };
  } catch {
    return null;
  }
}
