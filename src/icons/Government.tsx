"use client";

import { IconProps } from "./types";

/**
 * Government Icon - Represents regulatory bodies
 * Used for compliance, regulations, government portals
 */
export function Government({ size = 24, className, ...props }: IconProps) {
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
      {/* Capitol dome */}
      <path d="M4 21h16" />
      <path d="M6 21v-7h12v7" />
      <path d="M6 14l-2 0" />
      <path d="M20 14l-2 0" />
      {/* Columns */}
      <path d="M8 14v7" />
      <path d="M12 14v7" />
      <path d="M16 14v7" />
      {/* Dome structure */}
      <path d="M4 14c0-4.4 3.6-8 8-8s8 3.6 8 8" />
      <ellipse cx="12" cy="14" rx="8" ry="2" fill="currentColor" opacity="0.1" />
      {/* Spire */}
      <path d="M12 6V3" />
      <circle cx="12" cy="2" r="1" fill="currentColor" />
      {/* Australian element - Southern Cross hint */}
      <circle cx="10" cy="10" r="0.5" fill="currentColor" />
      <circle cx="14" cy="10" r="0.5" fill="currentColor" />
      <circle cx="12" cy="8" r="0.5" fill="currentColor" />
    </svg>
  );
}
