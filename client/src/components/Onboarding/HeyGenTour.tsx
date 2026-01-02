import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Pause, SkipForward, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface TourStep {
  id: string;
  videoUrl: string;
  target: string;
  title: string;
  description: string;
}

// Tour steps with HeyGen video URLs (placeholder - replace with actual HeyGen video URLs)
const tourSteps: TourStep[] = [
  {
    id: "welcome",
    videoUrl: "/videos/sam-welcome.mp4",
    target: "#dashboard",
    title: "Welcome to ABFI",
    description: "Meet Sam, your bioenergy guide",
  },
  {
    id: "prices",
    videoUrl: "/videos/sam-prices.mp4",
    target: "#price-dashboard",
    title: "Live Market Data",
    description: "Real-time feedstock pricing from 50+ suppliers",
  },
  {
    id: "suppliers",
    videoUrl: "/videos/sam-suppliers.mp4",
    target: "#marketplace",
    title: "Verified Suppliers",
    description: "Browse certified sustainability partners",
  },
  {
    id: "quote",
    videoUrl: "/videos/sam-quote.mp4",
    target: "#request-quote",
    title: "Request a Quote",
    description: "Get quotes within 24 hours",
  },
  {
    id: "carbon",
    videoUrl: "/videos/sam-carbon.mp4",
    target: "#carbon-calculator",
    title: "Carbon Calculator",
    description: "Track your ESG impact and emissions savings",
  },
];

export function HeyGenTour() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Check if user has seen the tour before
    const hasSeenTour = localStorage.getItem("abfi-tour-completed");
    if (!hasSeenTour) {
      // Delay tour start for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleVideoEnd = () => {
    if (currentStep === tourSteps.length - 1) {
      completeTour();
    } else {
      setCurrentStep((prev) => prev + 1);
      setIsPlaying(true);
      setVideoError(false);
    }
  };

  const handleVideoError = () => {
    setVideoError(true);
    // If video fails, still allow navigation
  };

  const completeTour = () => {
    localStorage.setItem("abfi-tour-completed", "true");
    setIsVisible(false);
  };

  const skipStep = () => {
    if (currentStep === tourSteps.length - 1) {
      completeTour();
    } else {
      setCurrentStep((prev) => prev + 1);
      setVideoError(false);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Highlight target element
  const getTargetRect = () => {
    if (typeof document === "undefined") return null;
    const target = document.querySelector(tourSteps[currentStep].target);
    if (!target) return null;
    return target.getBoundingClientRect();
  };

  const targetRect = isVisible ? getTargetRect() : null;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[100]"
            onClick={() => {}} // Prevent closing on backdrop click
          />

          {/* Target highlight */}
          {targetRect && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="fixed z-[101] pointer-events-none"
              style={{
                top: targetRect.top - 8,
                left: targetRect.left - 8,
                width: targetRect.width + 16,
                height: targetRect.height + 16,
              }}
            >
              <div className="w-full h-full border-4 border-[#D4AF37] rounded-xl animate-pulse" />
            </motion.div>
          )}

          {/* Video Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                       bg-white rounded-2xl shadow-2xl z-[102] w-full max-w-3xl mx-4"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <div>
                <h2 className="text-2xl font-bold text-black">
                  {tourSteps[currentStep].title}
                </h2>
                <p className="text-gray-600 mt-1">
                  {tourSteps[currentStep].description}
                </p>
              </div>
              <button
                onClick={completeTour}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
                aria-label="Close tour"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Video Container */}
            <div className="relative bg-black aspect-video">
              {videoError ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <div className="w-20 h-20 rounded-full bg-[#D4AF37]/20 flex items-center justify-center mb-4">
                    <Play className="h-10 w-10 text-[#D4AF37]" />
                  </div>
                  <p className="text-lg font-medium">Video unavailable</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Click "Next" to continue the tour
                  </p>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  src={tourSteps[currentStep].videoUrl}
                  autoPlay
                  muted={isMuted}
                  onEnded={handleVideoEnd}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onError={handleVideoError}
                  className="w-full h-full object-cover"
                />
              )}

              {/* Video Controls */}
              {!videoError && (
                <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5" />
                    )}
                  </button>
                  <button
                    onClick={toggleMute}
                    className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                  >
                    {isMuted ? (
                      <VolumeX className="h-5 w-5" />
                    ) : (
                      <Volume2 className="h-5 w-5" />
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Progress & Controls */}
            <div className="p-6">
              {/* Progress Dots */}
              <div className="flex justify-center gap-2 mb-6">
                {tourSteps.map((_, i) => (
                  <motion.button
                    key={i}
                    onClick={() => {
                      setCurrentStep(i);
                      setVideoError(false);
                    }}
                    whileHover={{ scale: 1.2 }}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      i === currentStep
                        ? "bg-[#D4AF37]"
                        : i < currentStep
                        ? "bg-[#D4AF37]/50"
                        : "bg-gray-300"
                    }`}
                    aria-label={`Go to step ${i + 1}`}
                  />
                ))}
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center">
                <button
                  onClick={completeTour}
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                >
                  Skip Tour
                </button>
                <div className="flex gap-3">
                  {currentStep > 0 && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setCurrentStep((prev) => prev - 1);
                        setVideoError(false);
                      }}
                    >
                      Previous
                    </Button>
                  )}
                  <Button
                    onClick={skipStep}
                    className="bg-[#D4AF37] text-black hover:bg-[#E5C158]"
                  >
                    {currentStep === tourSteps.length - 1 ? (
                      "Get Started"
                    ) : (
                      <>
                        Next
                        <SkipForward className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default HeyGenTour;
