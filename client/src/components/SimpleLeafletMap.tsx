"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { cn } from "@/lib/utils";

// Fix Leaflet default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title?: string;
  color?: string;
  onClick?: () => void;
}

interface SimpleLeafletMapProps {
  className?: string;
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: MapMarker[];
  onMapReady?: (map: L.Map) => void;
}

export function SimpleLeafletMap({
  className,
  center = { lat: -25.2744, lng: 133.7751 }, // Australia center
  zoom = 4,
  markers = [],
  onMapReady,
}: SimpleLeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [isReady, setIsReady] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [center.lat, center.lng],
      zoom,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    // Add OpenStreetMap base layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Add scale control
    L.control.scale({ imperial: false, metric: true }).addTo(map);

    mapRef.current = map;
    setIsReady(true);

    if (onMapReady) {
      onMapReady(map);
    }

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Handle markers
  useEffect(() => {
    if (!mapRef.current || !isReady) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    const map = mapRef.current;

    markers.forEach((markerData) => {
      // Create custom colored icon
      const icon = L.divIcon({
        className: "custom-marker",
        html: `
          <div style="
            width: 20px;
            height: 20px;
            background-color: ${markerData.color || '#3b82f6'};
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            cursor: pointer;
          "></div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      const marker = L.marker([markerData.lat, markerData.lng], { icon });

      if (markerData.title) {
        marker.bindTooltip(markerData.title, {
          permanent: false,
          direction: "top",
          offset: [0, -10],
        });
      }

      if (markerData.onClick) {
        marker.on("click", markerData.onClick);
      }

      marker.addTo(map);
      markersRef.current.push(marker);
    });
  }, [isReady, markers]);

  // Update center and zoom
  useEffect(() => {
    if (!mapRef.current || !isReady) return;
    mapRef.current.setView([center.lat, center.lng], zoom);
  }, [center, zoom, isReady]);

  return (
    <div
      ref={mapContainerRef}
      className={cn("w-full h-full rounded-lg overflow-hidden", className)}
      style={{ minHeight: "400px" }}
    />
  );
}
