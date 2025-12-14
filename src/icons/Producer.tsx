"use client";

import { IconProps } from "./types";

/**
 * Producer Icon - Represents biofuel producers/buyers
 * Used for buyer profiles, production facilities, processing plants
 */
export function Producer({ size = 24, className, ...props }: IconProps) {
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
      {/* Factory building */}
      <path d="M2 21h20" />
      <path d="M4 21V10l5 3V8l5 3V6l5 3v12" />
      {/* Chimney with clean emission */}
      <rect x="16" y="3" width="3" height="6" rx="0.5" />
      <path d="M17.5 3c0-1 1-2 2-1s1 2 0 2" fill="currentColor" opacity="0.1" />
      {/* Leaf symbol (sustainable production) */}
      <circle cx="8" cy="16" r="2.5" fill="currentColor" opacity="0.15" />
      <path d="M7 17.5c1-1.5 2.5-1.5 2.5-1.5s0 1.5-1 2.5" />
      {/* Inbound arrow (receiving) */}
      <path d="M2 8l3-2v4z" fill="currentColor" opacity="0.3" />
    </svg>
  );
}
