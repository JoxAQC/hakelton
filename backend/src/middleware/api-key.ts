import { Request, Response, NextFunction } from "express";

export function validateApiKey(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers["x-api-key"] as string;
  const expectedKey = process.env.GATEWAY_API_KEY;

  if (!expectedKey) {
    next();
    return;
  }

  if (apiKey === expectedKey) {
    next();
    return;
  }

  const origin = req.headers.origin || req.headers.referer || "";
  const allowedOrigins = (process.env.CORS_ORIGINS || "").split(",").map(o => o.trim());
  if (allowedOrigins.some(o => origin.includes(o))) {
    next();
    return;
  }

  res.status(401).json({ status: "error", message: "Invalid or missing API key" });
}
