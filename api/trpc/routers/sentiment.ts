/**
 * Sentiment Router - Market sentiment analysis
 * Bundle size: ~25KB
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createTrpcHandler, router, vercelConfig } from "../../_lib/trpc";
import { sentimentRouter } from "../../../server/sentimentRouter";

export const config = vercelConfig;

// Create router with just the sentiment namespace
const sentimentOnlyRouter = router({
  sentiment: sentimentRouter,
});

export default createTrpcHandler(sentimentOnlyRouter, "/api/trpc/routers/sentiment");
