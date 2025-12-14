"use client";

import { IconProps } from "./types";

/**
 * Traceability Icon - Represents supply chain traceability
 * Used for chain of custody, origin tracking, audit trails
 */
export function Traceability({ size = 24, className, ...props }: IconProps) {
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
      {/* Chain links representing supply chain */}
      <rect x="2" y="4" width="6" height="6" rx="1" fill="currentColor" opacity="0.1" />
      <rect x="2" y="4" width="6" height="6" rx="1" />
      <rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor" opacity="0.15" />
      <rect x="9" y="9" width="6" height="6" rx="1" />
      <rect x="16" y="14" width="6" height="6" rx="1" fill="currentColor" opacity="0.2" />
      <rect x="16" y="14" width="6" height="6" rx="1" />
      {/* Connecting arrows */}
      <path d="M8 7h1" strokeWidth="2" />
      <path d="M15 12h1" strokeWidth="2" />
      {/* Verification checkmarks */}
      <path d="M4 6.5l1 1 2-2" strokeWidth="1.5" />
      <path d="M11 11.5l1 1 2-2" strokeWidth="1.5" />
      <path d="M18 16.5l1 1 2-2" strokeWidth="1.5" />
    </svg>
  );
}
