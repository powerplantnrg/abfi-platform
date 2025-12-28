/**
 * Shared tRPC Context for Vercel Serverless Functions
 * Lightweight context creation that doesn't import heavy dependencies
 */
import type { User } from "../../drizzle/schema";
import { sdk } from "../../server/_core/sdk";

export type TrpcContext = {
  req: Request;
  user: User | null;
};

/**
 * Create context for tRPC procedures from a fetch Request
 */
export async function createContext(req: Request): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    // Extract cookie header for authentication
    const cookieHeader = req.headers.get("cookie") || "";

    // Create minimal request object for SDK
    user = await sdk.authenticateRequest({
      headers: { cookie: cookieHeader },
      get: (key: string) => (key === "cookie" ? cookieHeader : undefined),
    });
  } catch {
    // Authentication is optional for public procedures
    user = null;
  }

  return { req, user };
}
