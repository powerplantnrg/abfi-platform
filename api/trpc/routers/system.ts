/**
 * System Router - Lightweight system operations
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { initTRPC } from "@trpc/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import superjson from "superjson";

export const config = {
  api: { bodyParser: { sizeLimit: "10mb" } },
};

// Create minimal standalone tRPC instance for this endpoint
const t = initTRPC.create({ transformer: superjson });

const systemRouter = t.router({
  system: t.router({
    health: t.procedure.query(() => ({ ok: true, timestamp: new Date().toISOString() })),
  }),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Convert to Fetch Request
    const url = new URL(req.url || "/", `https://${req.headers.host}`);
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (value) headers.set(key, Array.isArray(value) ? value.join(", ") : value);
    }

    let body: string | undefined;
    if (req.method === "POST" || req.method === "PUT") {
      body = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
    }

    const request = new Request(url, { method: req.method, headers, body });

    const response = await fetchRequestHandler({
      endpoint: "/api/trpc/routers/system",
      req: request,
      router: systemRouter,
      createContext: () => ({}),
    });

    response.headers.forEach((value, key) => res.setHeader(key, value));
    res.status(response.status);
    res.send(await response.text());
  } catch (error) {
    console.error("[System Error]", error);
    res.status(500).json({ error: String(error) });
  }
}
