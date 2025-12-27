import { Router } from "express";
import { invokeLLM } from "./_core/llm";
import { ENV } from "./_core/env";

export const aiChatRouter = Router();

// System prompt for Sam, the ABFI bioenergy expert
const SYSTEM_PROMPT = `You are Sam, an expert Australian bioenergy feedstock trading assistant for the ABFI Platform.
Answer questions about ethanol, biodiesel, woodchips, bagasse, wheat straw, pricing, supplier certification, carbon intensity, and the ABFI marketplace.
Keep answers under 150 words. Be friendly, professional, and accurate.
Use Australian English spelling and terminology.
If you don't know something specific, say "I'll connect you with our support team for more details."

Key facts about ABFI:
- ABFI has 50+ certified Australian suppliers across all states
- Prices update every 15 minutes from real market data
- All suppliers hold Sustainability Certification (ISCC EU, RED II, FSC, or equivalent)
- Typical quote response time: 24 hours
- Minimum orders vary: 100L for liquids, 1 tonne for solids
- Carbon calculator tracks Scope 1-3 emissions with gCO2e/MJ metrics
- Bankability ratings help lenders assess project viability
- Evidence Vault provides blockchain-verified sustainability documentation

Common user questions:
- Quote requests: Navigate to Supplier Directory, select supplier, click "Request Quote"
- Pricing: Check Price Dashboard for live ethanol, biodiesel, and woodchip prices
- Certifications: Look for gold "Verified" badge on supplier profiles
- Carbon tracking: Use Emissions Calculator for ESG reporting`;

// HeyGen API configuration
const HEYGEN_API_URL = "https://api.heygen.com/v1/video.generate";

interface AIChatRequest {
  question: string;
}

interface AIChatResponse {
  answer: string;
  videoUrl?: string;
}

aiChatRouter.post("/", async (req, res) => {
  try {
    const { question } = req.body as AIChatRequest;

    if (!question || typeof question !== "string" || question.trim().length === 0) {
      return res.status(400).json({ error: "Invalid question" });
    }

    // Get AI response using the LLM
    const llmResponse = await invokeLLM({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: question },
      ],
      maxTokens: 500,
    });

    const answer =
      typeof llmResponse.choices[0]?.message?.content === "string"
        ? llmResponse.choices[0].message.content
        : "I apologize, but I couldn't generate a response. Please try again.";

    const response: AIChatResponse = { answer };

    // If HeyGen API key is configured, generate video response
    if (ENV.heygenApiKey) {
      try {
        const heygenResponse = await fetch(HEYGEN_API_URL, {
          method: "POST",
          headers: {
            "X-Api-Key": ENV.heygenApiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            avatar_id: ENV.heygenAvatarId || "sam_australian_001",
            input_text: answer,
            aspect_ratio: "16:9",
            quality: "high",
          }),
        });

        if (heygenResponse.ok) {
          const heygenData = await heygenResponse.json();
          const videoId = heygenData.data?.video_id;

          if (videoId) {
            // Poll for video completion (simplified - use webhook in production)
            await new Promise((resolve) => setTimeout(resolve, 8000));

            const statusResponse = await fetch(
              `https://api.heygen.com/v1/video.status?video_id=${videoId}`,
              {
                headers: {
                  "X-Api-Key": ENV.heygenApiKey,
                },
              }
            );

            if (statusResponse.ok) {
              const statusData = await statusResponse.json();
              response.videoUrl = statusData.data?.video_url || "";
            }
          }
        }
      } catch (heygenError) {
        console.error("[AI Chat] HeyGen video generation failed:", heygenError);
        // Continue without video - text response is still valid
      }
    }

    return res.json(response);
  } catch (error) {
    console.error("[AI Chat] Error:", error);
    return res.status(500).json({
      error: "Failed to generate response",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Health check endpoint
aiChatRouter.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    heygenConfigured: !!ENV.heygenApiKey,
    llmConfigured: !!ENV.forgeApiKey,
  });
});
