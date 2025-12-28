/**
 * Monitoring Jobs Router - Background job operations
 * Bundle size: ~30KB
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createTrpcHandler, router, vercelConfig } from "../../_lib/trpc";
import { monitoringJobsRouter } from "../../../server/monitoringJobsRouter";

export const config = vercelConfig;

// Create router with just the monitoringJobs namespace
const monitoringJobsOnlyRouter = router({
  monitoringJobs: monitoringJobsRouter,
});

export default createTrpcHandler(monitoringJobsOnlyRouter, "/api/trpc/routers/monitoringJobs");
