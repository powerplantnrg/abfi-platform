/**
 * System Router - Lightweight system operations
 */
import { z } from "zod";
import { router, publicProcedure } from "../../../server/_core/trpc";
import { createServerRouterHandler, vercelConfig } from "../../_lib/middleware";

export const config = vercelConfig;

// Define system procedures using server's tRPC instance
const systemRouter = router({
  health: publicProcedure
    .input(z.object({ timestamp: z.number().min(0).optional() }).optional())
    .query(() => ({ ok: true })),

  getStats: publicProcedure.query(async () => {
    const db = await import("../../../server/db");
    const suppliers = await db.getAllSuppliers();
    const buyers = await db.getAllBuyers();
    return {
      supplierCount: suppliers.length,
      buyerCount: buyers.length,
      timestamp: new Date().toISOString(),
    };
  }),
});

const systemOnlyRouter = router({ system: systemRouter });

export default createServerRouterHandler(systemOnlyRouter, "/api/trpc/routers/system");
