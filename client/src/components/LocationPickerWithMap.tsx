/**
 * LocationPickerWithMap
 *
 * Enhanced location picker with interactive map for selecting and viewing locations.
 * Supports geocoding, current location, and manual coordinate entry.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { MapPin, Search, ChevronDown, Crosshair, Map } from "lucide-react";
import { cn } from "@/lib/utils";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

export interface LocationValue {
  address?: string;
  city?: string;
  state?: string;
  postcode?: string;
  latitude?: number;
  longitude?: number;
}

interface LocationPickerWithMapProps {
  value?: LocationValue;
  onChange: (location: LocationValue) => void;
  required?: boolean;
  className?: string;
  mapHeight?: string;
  showMap?: boolean;
  allowMapClick?: boolean;
}

const AUSTRALIAN_STATES = [
  { value: "NSW", label: "New South Wales" },
  { value: "VIC", label: "Victoria" },
  { value: "QLD", label: "Queensland" },
  { value: "SA", label: "South Australia" },
  { value: "WA", label: "Western Australia" },
  { value: "TAS", label: "Tasmania" },
  { value: "NT", label: "Northern Territory" },
  { value: "ACT", label: "Australian Capital Territory" },
];

// Australia bounds
const AUSTRALIA_BOUNDS: L.LatLngBoundsExpression = [
  [-44.0, 112.0], // Southwest
  [-10.0, 154.0], // Northeast
];

export function LocationPickerWithMap({
  value = {},
  onChange,
  required = false,
  className = "",
  mapHeight = "300px",
  showMap = true,
  allowMapClick = true,
}: LocationPickerWithMapProps) {
  const [address, setAddress] = useState(value.address || "");
  const [city, setCity] = useState(value.city || "");
  const [state, setState] = useState(value.state || "");
  const [postcode, setPostcode] = useState(value.postcode || "");
  const [latitude, setLatitude] = useState<number | undefined>(value.latitude);
  const [longitude, setLongitude] = useState<number | undefined>(value.longitude);
  const [isMapExpanded, setIsMapExpanded] = useState(showMap);
  const [isLocating, setIsLocating] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: latitude && longitude ? [latitude, longitude] : [-25.2744, 133.7751],
      zoom: latitude && longitude ? 10 : 4,
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
    if (allowMapClick) {
      map.on("click", (e: L.LeafletMouseEvent) => {
        setLatitude(e.latlng.lat);
        setLongitude(e.latlng.lng);
      });
    }

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [isMapExpanded]);

  // Update marker when coordinates change
  useEffect(() => {
    if (!mapRef.current) return;

    // Remove existing marker
    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }

    // Add new marker if coordinates exist
    if (latitude !== undefined && longitude !== undefined) {
      const marker = L.marker([latitude, longitude], {
        draggable: allowMapClick,
      }).addTo(mapRef.current);

      if (allowMapClick) {
        marker.on("dragend", () => {
          const pos = marker.getLatLng();
          setLatitude(pos.lat);
          setLongitude(pos.lng);
        });
      }

      markerRef.current = marker;
      mapRef.current.setView([latitude, longitude], 12);
    }
  }, [latitude, longitude, allowMapClick]);

  // Notify parent of changes
  useEffect(() => {
    onChange({
      address,
      city,
      state,
      postcode,
      latitude,
      longitude,
    });
  }, [address, city, state, postcode, latitude, longitude]);

  const handleUseCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setIsLocating(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to retrieve your location. Please enter coordinates manually.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const handleClearLocation = useCallback(() => {
    setLatitude(undefined);
    setLongitude(undefined);
    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }
  }, []);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Address Fields */}
      <div className="space-y-2">
        <Label htmlFor="address">
          Street Address {required && <span className="text-destructive">*</span>}
        </Label>
        <Input
          id="address"
          placeholder="123 Farm Road"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required={required}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">
            City/Town {required && <span className="text-destructive">*</span>}
          </Label>
          <Input
            id="city"
            placeholder="Wagga Wagga"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required={required}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="postcode">
            Postcode {required && <span className="text-destructive">*</span>}
          </Label>
          <Input
            id="postcode"
            placeholder="2650"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            maxLength={4}
            required={required}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="state">
          State {required && <span className="text-destructive">*</span>}
        </Label>
        <Select value={state} onValueChange={setState}>
          <SelectTrigger>
            <SelectValue placeholder="Select state" />
          </SelectTrigger>
          <SelectContent>
            {AUSTRALIAN_STATES.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Map Section */}
      <Collapsible open={isMapExpanded} onOpenChange={setIsMapExpanded}>
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-3">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 p-0 h-auto">
                <Map className="h-4 w-4" />
                <span className="font-medium">Map Location</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    isMapExpanded && "rotate-180"
                  )}
                />
              </Button>
            </CollapsibleTrigger>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleUseCurrentLocation}
                disabled={isLocating}
              >
                <Crosshair className={cn("h-3 w-3 mr-1", isLocating && "animate-pulse")} />
                {isLocating ? "Locating..." : "Use My Location"}
              </Button>
            </div>
          </div>

          <CollapsibleContent className="space-y-4">
            {/* Map Container */}
            <div
              ref={mapContainerRef}
              className="rounded-lg border overflow-hidden"
              style={{ height: mapHeight }}
            />

            {allowMapClick && (
              <p className="text-xs text-muted-foreground">
                Click on the map to set location, or drag the marker to adjust
              </p>
            )}

            {/* Coordinate Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude" className="text-xs">
                  Latitude
                </Label>
                <Input
                  id="latitude"
                  placeholder="-35.1082"
                  value={latitude?.toFixed(6) || ""}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val)) setLatitude(val);
                  }}
                  type="number"
                  step="any"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude" className="text-xs">
                  Longitude
                </Label>
                <Input
                  id="longitude"
                  placeholder="147.3598"
                  value={longitude?.toFixed(6) || ""}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val)) setLongitude(val);
                  }}
                  type="number"
                  step="any"
                />
              </div>
            </div>

            {latitude !== undefined && longitude !== undefined && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClearLocation}
                className="text-destructive hover:text-destructive"
              >
                Clear map location
              </Button>
            )}
          </CollapsibleContent>
        </div>
      </Collapsible>
    </div>
  );
}
