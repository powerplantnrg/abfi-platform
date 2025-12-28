/**
 * Futures Router - Futures marketplace operations
 * Bundle size: ~50KB
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createTrpcHandler, router, vercelConfig } from "../../_lib/trpc";
import { futuresRouter } from "../../../server/futuresRouter";

export const config = vercelConfig;

// Create router with just the futures namespace
const futuresOnlyRouter = router({
  futures: futuresRouter,
});

export default createTrpcHandler(futuresOnlyRouter, "/api/trpc/routers/futures");
