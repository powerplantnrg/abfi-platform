"use client";

import { useState, useEffect, useCallback } from "react";
import { MapPin, Layers, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface FeedstockLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  category?: string;
  abfi_score?: number;
  supplier_name?: string;
}

interface FeedstockMapProps {
  locations?: FeedstockLocation[];
  center?: { lat: number; lng: number };
  zoom?: number;
  onLocationClick?: (location: FeedstockLocation) => void;
  selectedLocationId?: string;
  className?: string;
  height?: string | number;
}

export function FeedstockMap({
  locations = [],
  center = { lat: -25.2744, lng: 133.7751 }, // Australia center
  zoom = 4,
  onLocationClick,
  selectedLocationId,
  className,
  height = 400,
}: FeedstockMapProps) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(zoom);
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);

  // Placeholder for actual map implementation
  // In production, this would integrate with Mapbox, Google Maps, or Leaflet
  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => setMapLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleZoomIn = useCallback(() => {
    setCurrentZoom((prev) => Math.min(prev + 1, 18));
  }, []);

  const handleZoomOut = useCallback(() => {
    setCurrentZoom((prev) => Math.max(prev - 1, 1));
  }, []);

  // Calculate marker positions (simplified for placeholder)
  const getMarkerStyle = (location: FeedstockLocation) => {
    // Simplified positioning - in production use proper map projection
    const x = ((location.longitude - 110) / 50) * 100;
    const y = ((location.latitude + 10) / -35) * 100;
    return {
      left: `${Math.max(5, Math.min(95, x))}%`,
      top: `${Math.max(5, Math.min(95, y))}%`,
    };
  };

  const getScoreColor = (score?: number) => {
    if (!score) return "bg-muted";
    if (score >= 80) return "bg-rating-a";
    if (score >= 60) return "bg-rating-b";
    if (score >= 40) return "bg-rating-c";
    return "bg-rating-d";
  };

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <CardContent className="p-0">
        {/* Map Container */}
        <div
          className="relative bg-gradient-to-b from-blue-50 to-blue-100 dark:from-slate-800 dark:to-slate-900"
          style={{ height }}
        >
          {/* Loading State */}
          {!mapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="text-sm text-muted-foreground">Loading map...</p>
              </div>
            </div>
          )}

          {/* Placeholder Map Background */}
          {mapLoaded && (
            <div className="absolute inset-0">
              {/* Australia outline placeholder */}
              <svg
                viewBox="0 0 100 100"
                className="absolute inset-0 w-full h-full opacity-10"
                preserveAspectRatio="xMidYMid meet"
              >
                <path
                  d="M20,30 Q30,20 50,25 T80,35 Q85,50 75,70 T50,80 Q30,75 20,60 T20,30"
                  fill="currentColor"
                  className="text-primary"
                />
              </svg>

              {/* Location Markers */}
              <TooltipProvider>
                {locations.map((location) => (
                  <Tooltip key={location.id}>
                    <TooltipTrigger asChild>
                      <button
                        className={cn(
                          "absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200",
                          "hover:scale-125 hover:z-10",
                          selectedLocationId === location.id && "scale-125 z-10"
                        )}
                        style={getMarkerStyle(location)}
                        onClick={() => onLocationClick?.(location)}
                        onMouseEnter={() => setHoveredLocation(location.id)}
                        onMouseLeave={() => setHoveredLocation(null)}
                      >
                        <div
                          className={cn(
                            "flex items-center justify-center rounded-full p-1.5 shadow-lg border-2 border-white",
                            getScoreColor(location.abfi_score),
                            selectedLocationId === location.id && "ring-2 ring-primary ring-offset-2",
                            hoveredLocation === location.id && "ring-2 ring-primary/50"
                          )}
                        >
                          <MapPin className="h-4 w-4 text-white" />
                        </div>
                        {/* Score badge */}
                        {location.abfi_score && (
                          <div className="absolute -top-1 -right-1 bg-white rounded-full px-1 text-[10px] font-bold shadow">
                            {location.abfi_score}
                          </div>
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[200px]">
                      <div className="space-y-1">
                        <p className="font-medium">{location.name}</p>
                        {location.supplier_name && (
                          <p className="text-xs text-muted-foreground">
                            {location.supplier_name}
                          </p>
                        )}
                        {location.category && (
                          <p className="text-xs text-muted-foreground capitalize">
                            {location.category}
                          </p>
                        )}
                        {location.abfi_score && (
                          <p className="text-xs">
                            ABFI Score: <span className="font-mono font-bold">{location.abfi_score}</span>
                          </p>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
          )}

          {/* Map Controls */}
          <div className="absolute right-3 top-3 flex flex-col gap-1">
            <Button
              size="icon-sm"
              variant="outline"
              className="bg-white/90 backdrop-blur-sm shadow-sm"
              onClick={handleZoomIn}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              size="icon-sm"
              variant="outline"
              className="bg-white/90 backdrop-blur-sm shadow-sm"
              onClick={handleZoomOut}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              size="icon-sm"
              variant="outline"
              className="bg-white/90 backdrop-blur-sm shadow-sm"
            >
              <Layers className="h-4 w-4" />
            </Button>
            <Button
              size="icon-sm"
              variant="outline"
              className="bg-white/90 backdrop-blur-sm shadow-sm"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Location Count */}
          <div className="absolute left-3 bottom-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-sm">
            <p className="text-xs font-medium">
              <span className="font-mono">{locations.length}</span> feedstock locations
            </p>
          </div>

          {/* Zoom Level */}
          <div className="absolute right-3 bottom-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 shadow-sm">
            <p className="text-xs font-mono text-muted-foreground">
              Zoom: {currentZoom}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Mini Map - Compact version for cards
 */
export function FeedstockMapMini({
  location,
  className,
}: {
  location: { latitude: number; longitude: number; name?: string };
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative h-24 rounded-lg overflow-hidden bg-gradient-to-b from-blue-50 to-blue-100 dark:from-slate-800 dark:to-slate-900",
        className
      )}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex items-center justify-center rounded-full bg-primary p-2 shadow-lg">
          <MapPin className="h-4 w-4 text-primary-foreground" />
        </div>
      </div>
      {location.name && (
        <div className="absolute bottom-2 left-2 right-2 text-center">
          <p className="text-xs font-medium truncate bg-white/80 rounded px-2 py-0.5">
            {location.name}
          </p>
        </div>
      )}
    </div>
  );
}
