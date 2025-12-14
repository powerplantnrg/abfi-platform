"use client";

import { IconProps } from "./types";

/**
 * Demand Signal Icon - Represents RFQ/purchase orders
 * Used for buyer RFQs, demand forecasting, order management
 */
export function DemandSignal({ size = 24, className, ...props }: IconProps) {
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
      {/* Signal waves radiating */}
      <path d="M2 12h2" />
      <path d="M6 8v8" />
      <path d="M10 5v14" />
      <path d="M14 8v8" />
      <path d="M18 10v4" />
      {/* Arrow indicating demand direction */}
      <path d="M16 4l4 4-4 4" strokeWidth="2" />
      <path d="M20 8h-6" strokeWidth="2" />
      {/* Base platform */}
      <path d="M2 20h20" />
      {/* Highlight pulse */}
      <circle cx="10" cy="12" r="2" fill="currentColor" opacity="0.2" />
    </svg>
  );
}
