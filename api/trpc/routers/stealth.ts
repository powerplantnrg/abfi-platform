/**
 * Stealth Router - Stealth discovery operations
 * Bundle size: ~30KB
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createTrpcHandler, router, vercelConfig } from "../../_lib/trpc";
import { stealthRouter } from "../../../server/stealthRouter";

export const config = vercelConfig;

// Create router with just the stealth namespace
const stealthOnlyRouter = router({
  stealth: stealthRouter,
});

export default createTrpcHandler(stealthOnlyRouter, "/api/trpc/routers/stealth");
