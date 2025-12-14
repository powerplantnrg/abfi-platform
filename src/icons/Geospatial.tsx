"use client";

import { IconProps } from "./types";

/**
 * Geospatial Icon - Represents location/catchment areas
 * Used for maps, geographic data, catchment analysis
 */
export function Geospatial({ size = 24, className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Globe outline */}
      <circle cx="12" cy="12" r="10" />
      {/* Latitude lines */}
      <ellipse cx="12" cy="12" rx="10" ry="4" />
      <path d="M2 12h20" />
      {/* Longitude line */}
      <path d="M12 2a10 10 0 0 1 0 20" />
      <path d="M12 2a10 10 0 0 0 0 20" />
      {/* Location pin */}
      <circle cx="16" cy="8" r="3" fill="currentColor" opacity="0.2" stroke="currentColor" />
      <circle cx="16" cy="8" r="1" fill="currentColor" />
      {/* Catchment radius */}
      <path d="M16 11v3" strokeDasharray="2 2" />
    </svg>
  );
}
