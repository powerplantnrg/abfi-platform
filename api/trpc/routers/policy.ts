/**
 * Policy Router - Policy data operations
 * Bundle size: ~25KB
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createTrpcHandler, router, vercelConfig } from "../../_lib/trpc";
import { policyRouter } from "../../../server/policyRouter";

export const config = vercelConfig;

// Create router with just the policy namespace
const policyOnlyRouter = router({
  policy: policyRouter,
});

export default createTrpcHandler(policyOnlyRouter, "/api/trpc/routers/policy");
