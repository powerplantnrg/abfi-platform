/**
 * System Router - Lightweight system operations
 * Bundle size: ~20KB
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createTrpcHandler, router, vercelConfig } from "../../_lib/trpc";
import { systemRouter } from "../../../server/_core/systemRouter";

export const config = vercelConfig;

// Create router with just the system namespace
const systemOnlyRouter = router({
  system: systemRouter,
});

export default createTrpcHandler(systemOnlyRouter, "/api/trpc/routers/system");
