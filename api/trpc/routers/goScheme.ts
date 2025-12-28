/**
 * GO Scheme Router - Guarantee of Origin operations
 * Bundle size: ~35KB
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createTrpcHandler, router, vercelConfig } from "../../_lib/trpc";
import { goSchemeRouter } from "../../../server/goSchemeRouter";

export const config = vercelConfig;

// Create router with just the goScheme namespace
const goSchemeOnlyRouter = router({
  goScheme: goSchemeRouter,
});

export default createTrpcHandler(goSchemeOnlyRouter, "/api/trpc/routers/goScheme");
