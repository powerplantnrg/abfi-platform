"use client";

import { IconProps } from "./types";

/**
 * Supplier Icon - Represents feedstock suppliers
 * Used for supplier profiles, supplier dashboards, source identification
 */
export function Supplier({ size = 24, className, ...props }: IconProps) {
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
      {/* Warehouse/facility */}
      <path d="M3 21V8l9-5 9 5v13" />
      <path d="M3 21h18" />
      {/* Building details */}
      <rect x="7" y="12" width="4" height="9" rx="0.5" />
      <rect x="13" y="12" width="4" height="5" rx="0.5" />
      {/* Outbound arrow (supplying) */}
      <path d="M17 6l3 2-3 2" strokeWidth="2" />
      <path d="M14 8h6" strokeWidth="2" />
      {/* Verification badge */}
      <circle cx="5" cy="6" r="2" fill="currentColor" opacity="0.15" />
    </svg>
  );
}
