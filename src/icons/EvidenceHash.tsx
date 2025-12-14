"use client";

import { IconProps } from "./types";

/**
 * Evidence Hash Icon - Represents blockchain/hash verification
 * Used for evidence verification, document hashing, integrity checks
 */
export function EvidenceHash({ size = 24, className, ...props }: IconProps) {
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
      {/* Hash symbol with blockchain connection */}
      <path d="M4 9h16" />
      <path d="M4 15h16" />
      <path d="M10 3v18" />
      <path d="M14 3v18" />
      {/* Verification checkmark overlay */}
      <circle cx="18" cy="18" r="4" fill="currentColor" opacity="0.15" />
      <path d="M16.5 18l1 1 2-2" strokeWidth="2" />
    </svg>
  );
}
