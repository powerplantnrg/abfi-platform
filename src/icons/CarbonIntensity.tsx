"use client";

import { IconProps } from "./types";

/**
 * Carbon Intensity Icon - Represents CO2 emissions measurement
 * Used for CI reports, emissions tracking, scope calculations
 */
export function CarbonIntensity({ size = 24, className, ...props }: IconProps) {
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
      {/* Leaf representing sustainability */}
      <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.39.94 4.56 2.47 6.17" />
      <path d="M12 3v9" />
      <path d="M12 12c2.21 0 4-1.79 4-4" />
      {/* CO2 measurement bar */}
      <rect x="16" y="8" width="5" height="12" rx="1" fill="currentColor" opacity="0.1" />
      <path d="M18.5 8v12" />
      {/* Emission level indicators */}
      <path d="M17 11h3" />
      <path d="M17 14h3" />
      <path d="M17 17h3" />
      {/* Arrow showing reduction */}
      <path d="M6 18l2-3 2 1.5 3-4" strokeWidth="2" />
      <path d="M11 12.5l2 0 0 2" strokeWidth="2" />
    </svg>
  );
}
