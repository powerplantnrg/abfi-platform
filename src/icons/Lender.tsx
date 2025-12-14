"use client";

import { IconProps } from "./types";

/**
 * Lender Icon - Represents financial institutions
 * Used for lender dashboards, financing, bankability assessments
 */
export function Lender({ size = 24, className, ...props }: IconProps) {
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
      {/* Briefcase representing business/finance */}
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      {/* Dollar/currency symbol */}
      <circle cx="12" cy="13" r="3" fill="currentColor" opacity="0.15" />
      <path d="M12 11v4" strokeWidth="2" />
      <path d="M10.5 12.5c0-.5.5-1 1.5-1s1.5.5 1.5 1-.5 1-1.5 1-1.5.5-1.5 1 .5 1 1.5 1" />
      {/* Growth indicator */}
      <path d="M17 10l2-2m0 0v2m0-2h-2" strokeWidth="1.5" />
    </svg>
  );
}
