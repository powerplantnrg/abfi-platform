/**
 * Emissions Router - Carbon emissions tracking
 * Bundle size: ~35KB
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createTrpcHandler, router, vercelConfig } from "../../_lib/trpc";
import { emissionsRouter } from "../../../server/emissionsRouter";

export const config = vercelConfig;

// Create router with just the emissions namespace
const emissionsOnlyRouter = router({
  emissions: emissionsRouter,
});

export default createTrpcHandler(emissionsOnlyRouter, "/api/trpc/routers/emissions");
