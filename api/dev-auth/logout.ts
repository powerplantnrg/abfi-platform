/**
 * Vercel Serverless Function: POST /api/dev-auth/logout
 * Logs out the current user
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";

const COOKIE_NAME = "abfi_session";

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Clear the session cookie
  res.setHeader("Set-Cookie", [
    `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
  ]);

  return res.status(200).json({ success: true, message: "Logged out" });
}
