/**
 * Evidence Vault Router - Blockchain evidence operations
 * Bundle size: ~60KB
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createTrpcHandler, router, vercelConfig } from "../../_lib/trpc";
import { evidenceVaultRouter } from "../../../server/evidenceVaultRouter";

export const config = vercelConfig;

// Create router with just the evidenceVault namespace
const evidenceVaultOnlyRouter = router({
  evidenceVault: evidenceVaultRouter,
});

export default createTrpcHandler(evidenceVaultOnlyRouter, "/api/trpc/routers/evidenceVault");
