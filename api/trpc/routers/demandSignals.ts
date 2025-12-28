/**
 * Demand Signals Router - Buyer demand signal operations
 * Bundle size: ~40KB
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createTrpcHandler, router, vercelConfig } from "../../_lib/trpc";
import { demandSignalsRouter } from "../../../server/demandSignalsRouter";

export const config = vercelConfig;

// Create router with just the demandSignals namespace
const demandSignalsOnlyRouter = router({
  demandSignals: demandSignalsRouter,
});

export default createTrpcHandler(demandSignalsOnlyRouter, "/api/trpc/routers/demandSignals");
