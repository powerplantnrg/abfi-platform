/**
 * Supply Chain Router - Supply chain tracking operations
 * Bundle size: ~45KB
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createTrpcHandler, router, vercelConfig } from "../../_lib/trpc";
import { supplyChainRouter } from "../../../server/supplyChainRouter";

export const config = vercelConfig;

// Create router with just the supplyChain namespace
const supplyChainOnlyRouter = router({
  supplyChain: supplyChainRouter,
});

export default createTrpcHandler(supplyChainOnlyRouter, "/api/trpc/routers/supplyChain");
