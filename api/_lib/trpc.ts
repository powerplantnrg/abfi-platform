/**
 * Shared tRPC Configuration for Vercel Serverless Functions
 * Provides router, procedures, and handler factory
 */
import { initTRPC, TRPCError } from "@trpc/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import superjson from "superjson";
import { createContext, type TrpcContext } from "./context";
import { setCorsHeaders, setSecurityHeaders, logRequest, handleError } from "./middleware";
import { NOT_ADMIN_ERR_MSG, UNAUTHED_ERR_MSG } from "@shared/const";

// =============================================================================
// tRPC Initialization
// =============================================================================

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

// =============================================================================
// Protected Procedures
// =============================================================================

const requireUser = t.middleware(async opts => {
  const { ctx, next } = opts;

  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

export const protectedProcedure = t.procedure.use(requireUser);

export const adminProcedure = t.procedure.use(
  t.middleware(async opts => {
    const { ctx, next } = opts;

    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }

    return next({
      ctx: {
        ...ctx,
        user: ctx.user,
      },
    });
  })
);

// =============================================================================
// Handler Factory
// =============================================================================

/**
 * Create a Vercel handler for a tRPC router
 * @param routerInstance - The tRPC router to handle
 * @param endpoint - The API endpoint path (e.g., "/api/trpc/futures")
 */
export function createTrpcHandler<TRouter extends ReturnType<typeof router>>(
  routerInstance: TRouter,
  endpoint: string
) {
  return async function handler(req: VercelRequest, res: VercelResponse) {
    const startTime = Date.now();

    try {
      // Set security headers
      setSecurityHeaders(res);

      // Handle CORS
      if (setCorsHeaders(req, res)) {
        return; // Preflight handled
      }

      // Convert Vercel request to standard Request
      const url = new URL(req.url || "/", `https://${req.headers.host}`);

      const headers = new Headers();
      for (const [key, value] of Object.entries(req.headers)) {
        if (value) {
          headers.set(key, Array.isArray(value) ? value.join(", ") : value);
        }
      }

      // Read body for POST/PUT requests
      let body: string | undefined;
      if (req.method === "POST" || req.method === "PUT") {
        body = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
      }

      const request = new Request(url, {
        method: req.method,
        headers,
        body,
      });

      // Handle tRPC request
      const response = await fetchRequestHandler({
        endpoint,
        req: request,
        router: routerInstance,
        createContext: () => createContext(request),
      });

      // Copy response headers
      response.headers.forEach((value, key) => {
        res.setHeader(key, value);
      });

      // Send response
      res.status(response.status);
      const text = await response.text();
      res.send(text);
    } catch (error) {
      handleError(res, error);
    } finally {
      logRequest(req, startTime);
    }
  };
}

// =============================================================================
// Vercel Config Export
// =============================================================================

export const vercelConfig = {
  api: {
    bodyParser: {
      sizeLimit: "10mb", // Smaller than monolith - individual functions need less
    },
  },
};
