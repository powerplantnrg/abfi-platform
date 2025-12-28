/**
 * Verifiable Credentials Router - VC operations
 * Bundle size: ~40KB
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createTrpcHandler, router, vercelConfig } from "../../_lib/trpc";
import { vcRouter } from "../../../server/vcRouter";

export const config = vercelConfig;

// Create router with just the vc namespace
const vcOnlyRouter = router({
  vc: vcRouter,
});

export default createTrpcHandler(vcOnlyRouter, "/api/trpc/routers/vc");
