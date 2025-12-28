/**
 * RSIE Router - Renewable/Sustainable Industry Energy operations
 * Bundle size: ~40KB
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createTrpcHandler, router, vercelConfig } from "../../_lib/trpc";
import { rsieRouter } from "../../../server/rsieRouter";

export const config = vercelConfig;

// Create router with just the rsie namespace
const rsieOnlyRouter = router({
  rsie: rsieRouter,
});

export default createTrpcHandler(rsieOnlyRouter, "/api/trpc/routers/rsie");
