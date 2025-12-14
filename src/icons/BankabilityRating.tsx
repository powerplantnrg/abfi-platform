"use client";

import { IconProps } from "./types";

/**
 * Bankability Rating Icon - Represents financial viability scoring
 * Used for bankability assessments, lender dashboards, risk metrics
 */
export function BankabilityRating({ size = 24, className, ...props }: IconProps) {
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
      {/* Bank building with columns */}
      <path d="M3 21h18" />
      <path d="M5 21V11" />
      <path d="M9 21V11" />
      <path d="M15 21V11" />
      <path d="M19 21V11" />
      {/* Roof/pediment */}
      <path d="M3 11l9-7 9 7" />
      {/* Rating star */}
      <circle cx="17" cy="6" r="4" fill="currentColor" opacity="0.15" />
      <path d="M17 4v4M15 6h4" strokeWidth="2" />
      {/* Trend line */}
      <path d="M6 17l2-2 2 1 3-3" strokeWidth="1.5" />
    </svg>
  );
}
