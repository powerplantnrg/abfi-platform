/**
 * Shared Middleware for Vercel Serverless Functions
 * Provides CORS, authentication, logging, and security headers
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";

// =============================================================================
// CORS Configuration
// =============================================================================

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:3002",
  "http://localhost:5173",
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "",
  process.env.PRODUCTION_URL || "",
].filter(Boolean);

export function setCorsHeaders(req: VercelRequest, res: VercelResponse): boolean {
  const origin = req.headers.origin || "";

  // Check if origin is allowed
  const isAllowed = ALLOWED_ORIGINS.some(allowed =>
    origin === allowed || origin.endsWith(".vercel.app")
  );

  if (isAllowed) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Cookie");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "86400");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return true; // Request handled
  }

  return false; // Continue processing
}

// =============================================================================
// Security Headers (Essential Eight compliance)
// =============================================================================

export function setSecurityHeaders(res: VercelResponse): void {
  // Prevent clickjacking
  res.setHeader("X-Frame-Options", "DENY");

  // Prevent MIME type sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");

  // XSS protection
  res.setHeader("X-XSS-Protection", "1; mode=block");

  // Referrer policy
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  // HSTS (only in production)
  if (process.env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
}

// =============================================================================
// Request Logging
// =============================================================================

export function logRequest(req: VercelRequest, startTime: number): void {
  const duration = Date.now() - startTime;
  const path = req.url || "/";
  const method = req.method || "GET";

  console.log(`[${method}] ${path} - ${duration}ms`);
}

// =============================================================================
// Error Handling
// =============================================================================

export function handleError(res: VercelResponse, error: unknown): void {
  console.error("[API Error]", error);

  if (error instanceof Error) {
    res.status(500).json({
      error: "Internal Server Error",
      message: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  } else {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// =============================================================================
// Middleware Wrapper
// =============================================================================

type Handler = (req: VercelRequest, res: VercelResponse) => Promise<void> | void;

export function withMiddleware(handler: Handler): Handler {
  return async (req: VercelRequest, res: VercelResponse) => {
    const startTime = Date.now();

    try {
      // Set security headers
      setSecurityHeaders(res);

      // Handle CORS (returns true if preflight handled)
      if (setCorsHeaders(req, res)) {
        return;
      }

      // Execute handler
      await handler(req, res);
    } catch (error) {
      handleError(res, error);
    } finally {
      logRequest(req, startTime);
    }
  };
}
