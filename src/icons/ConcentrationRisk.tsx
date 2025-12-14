"use client";

import { IconProps } from "./types";

/**
 * Concentration Risk Icon - Represents HHI/market concentration
 * Used for HHI calculations, supplier diversity, risk assessments
 */
export function ConcentrationRisk({ size = 24, className, ...props }: IconProps) {
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
      {/* Pie chart representing market share */}
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v9l6.36 3.64" />
      {/* Segments showing concentration */}
      <path d="M12 12l-6.36 3.64" />
      <path d="M12 12l-2.83-8.49" fill="currentColor" opacity="0.1" />
      {/* Warning indicator */}
      <circle cx="19" cy="5" r="3" fill="currentColor" opacity="0.2" />
      <path d="M19 4v2M19 7.5v.5" strokeWidth="2" />
    </svg>
  );
}
