/**
 * Prices Router - Price data operations
 * Bundle size: ~25KB
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createTrpcHandler, router, vercelConfig } from "../../_lib/trpc";
import { pricesRouter } from "../../../server/pricesRouter";

export const config = vercelConfig;

// Create router with just the prices namespace
const pricesOnlyRouter = router({
  prices: pricesRouter,
});

export default createTrpcHandler(pricesOnlyRouter, "/api/trpc/routers/prices");
