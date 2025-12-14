"use client";

import { IconProps } from "./types";

/**
 * Sustainability Icon - Represents environmental sustainability
 * Used for sustainability scores, eco-compliance, green metrics
 */
export function Sustainability({ size = 24, className, ...props }: IconProps) {
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
      {/* Circular arrows representing recycling/sustainability cycle */}
      <path d="M12 3c4.97 0 9 4.03 9 9" />
      <path d="M21 12c0 4.97-4.03 9-9 9" />
      <path d="M12 21c-4.97 0-9-4.03-9-9" />
      <path d="M3 12c0-4.97 4.03-9 9-9" />
      {/* Arrow heads */}
      <path d="M19 6l2 6h-6" strokeWidth="1.5" />
      <path d="M5 18l-2-6h6" strokeWidth="1.5" />
      {/* Central leaf */}
      <path d="M12 8c3 0 5 2 5 5-3 0-5-2-5-5z" fill="currentColor" opacity="0.15" />
      <path d="M12 8v8" />
      <path d="M12 16c-2 0-3.5-1.5-3.5-3.5" />
    </svg>
  );
}
