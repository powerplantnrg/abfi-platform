/**
 * Producer Property Map - Nextgen Design
 *
 * Features:
 * - Interactive map for property location
 * - Address search functionality
 * - Click-to-select coordinates
 * - Agricultural zone identification
 * - Typography components for consistent styling
 */

import { useState, useEffect, useRef } from "react";
import { H1, H2, H3, H4, Body, MetricValue, DataLabel } from "@/components/Typography";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Progress } from "@/components/ui/progress";
import { Leaf, ArrowLeft, ArrowRight, MapPin, Crosshair } from "lucide-react";
import { Link } from "wouter";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Australia bounds
const AUSTRALIA_BOUNDS: L.LatLngBoundsExpression = [
  [-44.0, 112.0], // Southwest
  [-10.0, 154.0], // Northeast
];

export default function ProducerPropertyMap() {
  const [, setLocation] = useLocation();
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLocating, setIsLocating] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [-25.2744, 133.7751], // Center of Australia
      zoom: 4,
      zoomControl: true,
      scrollWheelZoom: true,
      maxBounds: AUSTRALIA_BOUNDS,
      minZoom: 3,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    L.control.scale({ imperial: false, metric: true }).addTo(map);

    // Add click handler
    map.on("click", (e: L.LeafletMouseEvent) => {
      setSelectedLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update marker when location changes
  useEffect(() => {
    if (!mapRef.current) return;

    // Remove existing marker
    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }

    // Add new marker if location exists
    if (selectedLocation) {
      const marker = L.marker([selectedLocation.lat, selectedLocation.lng], {
        draggable: true,
      }).addTo(mapRef.current);

      marker.on("dragend", () => {
        const pos = marker.getLatLng();
        setSelectedLocation({ lat: pos.lat, lng: pos.lng });
      });

      markerRef.current = marker;
      mapRef.current.setView([selectedLocation.lat, selectedLocation.lng], 12);
    }
  }, [selectedLocation]);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setSelectedLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLocating(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to retrieve your location. Please click on the map to select your property.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleContinue = () => {
    if (selectedLocation) {
      localStorage.setItem(
        "producerRegistration",
        JSON.stringify({
          step: 2,
          data: { location: selectedLocation },
        })
      );
      setLocation("/producer-registration/property-details");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between">
          <Link href="/">
            <a className="flex items-center gap-2 text-[#0F3A5C] hover:opacity-80">
              <Leaf className="h-6 w-6" />
              <span className="text-xl font-semibold">ABFI</span>
            </a>
          </Link>
          <div className="text-sm text-gray-600">
            Step 2 of 7: Property Location
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="container mx-auto py-4">
          <Progress value={28} className="h-2" />
          <p className="mt-2 text-sm text-gray-600">
            28% Complete • Estimated 10 minutes remaining
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-12">
        <div className="mx-auto max-w-6xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-[#0F3A5C]">
                Locate Your Property
              </CardTitle>
              <CardDescription>
                Click on the map or search for your property address. We'll use
                this to identify your agricultural zone and climate region.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Search Bar */}
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by address, lot/plan number, or coordinates..."
                    className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-[#F4C430] focus:outline-none focus:ring-2 focus:ring-[#F4C430]/20"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Map Controls */}
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600">
                    Click on the map to mark your property location, or drag the marker to adjust
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleUseCurrentLocation}
                    disabled={isLocating}
                    className="gap-2"
                  >
                    <Crosshair className={`h-4 w-4 ${isLocating ? "animate-pulse" : ""}`} />
                    {isLocating ? "Locating..." : "Use My Location"}
                  </Button>
                </div>

                {/* Interactive Map */}
                <div
                  ref={mapContainerRef}
                  className="h-[500px] rounded-lg border overflow-hidden"
                />

                {/* Selected Location Display */}
                {selectedLocation && (
                  <div className="mt-3 rounded-lg bg-green-50 border border-green-200 p-4">
                    <p className="text-sm font-medium text-green-700">
                      ✓ Location selected: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                    </p>
                  </div>
                )}

                {/* Agricultural Zones Legend */}
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-green-500"></div>
                      <span className="font-medium text-green-900">
                        Sugarcane Belt
                      </span>
                    </div>
                    <p className="text-sm text-green-700">
                      QLD coastal regions
                    </p>
                  </div>

                  <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-yellow-500"></div>
                      <span className="font-medium text-yellow-900">
                        Grain Belt
                      </span>
                    </div>
                    <p className="text-sm text-yellow-700">NSW, VIC, SA, WA</p>
                  </div>

                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                      <span className="font-medium text-blue-900">
                        Forestry Zones
                      </span>
                    </div>
                    <p className="text-sm text-blue-700">TAS, VIC, NSW</p>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-6">
                  <Link href="/producer-registration/account-setup">
                    <Button type="button" variant="ghost" className="gap-2">
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </Button>
                  </Link>

                  <Button
                    onClick={handleContinue}
                    className="gap-2 bg-[#F4C430] text-[#0F3A5C] hover:bg-[#F4C430]/90"
                    disabled={!selectedLocation}
                  >
                    Continue to Property Details
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
