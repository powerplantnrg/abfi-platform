/**
 * Vercel Serverless Function: GET /api/dev-auth/users
 * Lists available dev users for development/preview deployments
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";

// Demo users for development
const DEV_USERS = [
  { id: 1, name: "Alice Developer", email: "alice@dev.local", role: "admin" },
  { id: 2, name: "Bob Producer", email: "bob@dev.local", role: "producer" },
  { id: 3, name: "Carol Buyer", email: "carol@dev.local", role: "buyer" },
  { id: 4, name: "Dan Analyst", email: "dan@dev.local", role: "analyst" },
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Check if dev auth is enabled (via env var or preview deployment)
  const isPreview = process.env.VERCEL_ENV === "preview";
  const devAuthEnabled = process.env.ENABLE_DEV_AUTH === "true";

  if (!isPreview && !devAuthEnabled) {
    return res.status(403).json({
      error: "Dev auth not available in production",
      hint: "Set ENABLE_DEV_AUTH=true or use a preview deployment"
    });
  }

  return res.status(200).json({
    message: "Development authentication - select a user to login",
    users: DEV_USERS,
  });
}
