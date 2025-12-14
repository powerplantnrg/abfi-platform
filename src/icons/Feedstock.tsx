"use client";

import { IconProps } from "./types";

/**
 * Feedstock Icon - Represents biomass/feedstock materials
 * Used for feedstock listings, categories, source materials
 */
export function Feedstock({ size = 24, className, ...props }: IconProps) {
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
      {/* Grain/wheat stalk */}
      <path d="M12 21V11" />
      <path d="M12 11c-2 0-4-2-4-5 2 0 4 2 4 5z" fill="currentColor" opacity="0.15" />
      <path d="M12 11c2 0 4-2 4-5-2 0-4 2-4 5z" fill="currentColor" opacity="0.15" />
      <path d="M12 7c-1.5 0-3-1.5-3-3.5 1.5 0 3 1.5 3 3.5z" />
      <path d="M12 7c1.5 0 3-1.5 3-3.5-1.5 0-3 1.5-3 3.5z" />
      {/* Side stalks */}
      <path d="M8 21c0-3 1.5-5 4-5" />
      <path d="M16 21c0-3-1.5-5-4-5" />
      {/* Ground line */}
      <path d="M6 21h12" strokeWidth="2" />
      {/* Small leaves */}
      <path d="M9 15c-1 0-2-1-2-2.5 1 0 2 1 2 2.5z" fill="currentColor" opacity="0.1" />
      <path d="M15 15c1 0 2-1 2-2.5-1 0-2 1-2 2.5z" fill="currentColor" opacity="0.1" />
    </svg>
  );
}
