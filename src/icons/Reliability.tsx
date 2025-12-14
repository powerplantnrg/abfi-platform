"use client";

import { IconProps } from "./types";

/**
 * Reliability Icon - Represents supply reliability
 * Used for reliability scores, consistency metrics, uptime
 */
export function Reliability({ size = 24, className, ...props }: IconProps) {
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
      {/* Clock face representing consistency */}
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="9" fill="currentColor" opacity="0.05" />
      {/* Clock hands */}
      <path d="M12 6v6l4 2" strokeWidth="2" />
      {/* Checkmark overlay */}
      <circle cx="18" cy="6" r="4" fill="currentColor" opacity="0.15" stroke="currentColor" />
      <path d="M16.5 6l1 1 2-2" strokeWidth="2" />
      {/* Reliability pulse indicators */}
      <path d="M3 12h1" />
      <path d="M20 12h1" />
      <path d="M12 3v1" />
      <path d="M12 20v1" />
    </svg>
  );
}
