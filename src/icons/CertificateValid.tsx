"use client";

import { IconProps } from "./types";

/**
 * Certificate Valid Icon - Represents verified certificates
 * Used for RTFO, RED II, CFP compliance certificates
 */
export function CertificateValid({ size = 24, className, ...props }: IconProps) {
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
      {/* Certificate document */}
      <rect x="3" y="2" width="14" height="18" rx="2" />
      <path d="M7 7h6" />
      <path d="M7 11h4" />
      {/* Seal/badge with checkmark */}
      <circle cx="17" cy="17" r="5" fill="currentColor" opacity="0.1" stroke="currentColor" />
      <path d="M15 17l1.5 1.5L19 16" strokeWidth="2" />
      {/* Ribbon */}
      <path d="M14 22l3-3 3 3" strokeWidth="1.5" />
    </svg>
  );
}
