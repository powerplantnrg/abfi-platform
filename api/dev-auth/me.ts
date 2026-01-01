/**
 * Vercel Serverless Function: GET /api/dev-auth/me
 * Returns current authenticated user info
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { jwtVerify } from "jose";

const COOKIE_NAME = "abfi_session";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Parse cookies
  const cookies = req.headers.cookie?.split(";").reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split("=");
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>) || {};

  const token = cookies[COOKIE_NAME];

  if (!token) {
    return res.status(200).json({ authenticated: false, user: null });
  }

  try {
    const secret = new TextEncoder().encode(
      process.env.SESSION_SECRET || "dev-secret-key-change-in-production"
    );

    const { payload } = await jwtVerify(token, secret);

    return res.status(200).json({
      authenticated: true,
      user: {
        openId: payload.sub,
        name: payload.name,
        email: payload.email,
        role: payload.role,
      },
    });
  } catch {
    return res.status(200).json({ authenticated: false, user: null });
  }
}
