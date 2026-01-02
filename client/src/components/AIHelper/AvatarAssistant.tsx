import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2, Volume2, VolumeX, Leaf, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  videoUrl?: string;
}

// Predefined quick questions
const quickQuestions = [
  "How do I request a quote?",
  "What certifications do suppliers need?",
  "How is carbon intensity calculated?",
  "What's the minimum order volume?",
];

export function AvatarAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "G'day! I'm Sam, your ABFI bioenergy expert. Ask me anything about feedstock trading, pricing, or supplier certification!",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleAsk = async (questionText?: string) => {
    const q = questionText || question;
    if (!q.trim()) return;

    // Add user message
    const userMessage: ChatMessage = { role: "user", content: q };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setIsLoading(true);

    try {
      // Call the AI chat API
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });

      if (!res.ok) {
        throw new Error("Failed to get response");
      }

      const data = await res.json();

      // Add assistant message
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: data.answer || "I apologize, but I couldn't generate a response. Please try again.",
        videoUrl: data.videoUrl,
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // If video URL is available, show it
      if (data.videoUrl) {
        setCurrentVideoUrl(data.videoUrl);
        setShowVideo(true);
      }
    } catch {
      // Fallback response when API is not available
      const fallbackResponses: Record<string, string> = {
        quote:
          "To request a quote, navigate to the Supplier Directory, select a supplier, and click 'Request Quote'. Fill in your feedstock type, volume, and delivery details. You'll typically receive quotes within 24 hours.",
        certification:
          "ABFI suppliers must hold Sustainability Certification. Look for the gold 'Verified' badge on supplier profiles. Common certifications include ISCC EU, RED II, and FSC for forestry products.",
        carbon:
          "Carbon intensity is calculated using our emissions calculator, which factors in feedstock type, transportation distance, and processing methods. Results are reported in gCO2e/MJ for comparison with fossil fuel alternatives.",
        minimum:
          "Minimum orders vary by supplier and feedstock type. Typically, liquid biofuels start at 100 litres, while solid biomass like woodchips starts at 1 tonne. Check individual supplier profiles for specific minimums.",
        default:
          "I'd be happy to help with that question. For detailed assistance, please contact our support team or browse the platform documentation.",
      };

      // Simple keyword matching for demo
      let response = fallbackResponses.default;
      if (q.toLowerCase().includes("quote")) {
        response = fallbackResponses.quote;
      } else if (q.toLowerCase().includes("certification") || q.toLowerCase().includes("verified")) {
        response = fallbackResponses.certification;
      } else if (q.toLowerCase().includes("carbon") || q.toLowerCase().includes("emission")) {
        response = fallbackResponses.carbon;
      } else if (q.toLowerCase().includes("minimum") || q.toLowerCase().includes("order")) {
        response = fallbackResponses.minimum;
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  return (
    <>
      {/* Floating Avatar Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37] to-amber-600
                   shadow-xl hover:shadow-2xl hover:shadow-[#D4AF37]/30 transition-shadow z-40
                   border-4 border-white flex items-center justify-center"
        aria-label="Ask Sam for help"
      >
        <div className="relative">
          <Leaf className="h-7 w-7 text-white" />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"
          />
        </div>
      </motion.button>

      {/* Notification bubble */}
      {!isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2 }}
          className="fixed bottom-24 right-6 bg-white rounded-lg shadow-lg p-3 z-40 max-w-[200px]"
        >
          <div className="flex items-start gap-2">
            <MessageCircle className="h-4 w-4 text-[#D4AF37] mt-0.5 shrink-0" />
            <p className="text-sm text-gray-700">
              Need help? Ask Sam about feedstocks!
            </p>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="text-xs text-[#D4AF37] font-medium mt-2 hover:underline"
          >
            Chat now
          </button>
        </motion.div>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed bottom-24 right-6 w-[380px] max-h-[600px] bg-white rounded-2xl shadow-2xl
                       border border-gray-200 flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#D4AF37] to-amber-600 text-white p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Leaf className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Sam - ABFI Expert</h3>
                  <p className="text-xs opacity-90">AI-powered bioenergy assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Video Player (when available) */}
            <AnimatePresence>
              {showVideo && currentVideoUrl && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="relative bg-black overflow-hidden"
                >
                  <video
                    ref={videoRef}
                    src={currentVideoUrl}
                    autoPlay
                    muted={isMuted}
                    onEnded={() => setShowVideo(false)}
                    className="w-full"
                  />
                  <div className="absolute bottom-2 right-2 flex gap-2">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70"
                    >
                      {isMuted ? (
                        <VolumeX className="h-4 w-4" />
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => setShowVideo(false)}
                      className="p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Chat Messages */}
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[300px] bg-gray-50"
            >
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                      msg.role === "user"
                        ? "bg-[#D4AF37] text-black rounded-br-md"
                        : "bg-white border border-gray-200 text-gray-800 rounded-bl-md shadow-sm"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Sam is thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Quick Questions */}
            <div className="px-4 py-2 border-t border-gray-100 bg-white">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {quickQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleAsk(q)}
                    disabled={isLoading}
                    className="shrink-0 text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200
                             text-gray-700 rounded-full transition-colors disabled:opacity-50"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex gap-2">
                <Input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask Sam anything..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={() => handleAsk()}
                  disabled={isLoading || !question.trim()}
                  className="bg-[#D4AF37] text-black hover:bg-[#E5C158] px-3"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default AvatarAssistant;
