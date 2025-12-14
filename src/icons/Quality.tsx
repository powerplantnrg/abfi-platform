"use client";

import { IconProps } from "./types";

/**
 * Quality Icon - Represents quality assurance/testing
 * Used for quality scores, lab testing, specifications
 */
export function Quality({ size = 24, className, ...props }: IconProps) {
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
      {/* Lab flask/beaker */}
      <path d="M9 3h6" />
      <path d="M10 3v5l-4 8c-.5 1 .2 2 1.5 2h9c1.3 0 2-1 1.5-2l-4-8V3" />
      {/* Liquid level */}
      <path d="M7.5 14h9" />
      <path d="M6.5 16c0 0 2-1 5.5-1s5.5 1 5.5 1" fill="currentColor" opacity="0.15" />
      {/* Quality badge */}
      <circle cx="18" cy="6" r="3" fill="currentColor" opacity="0.2" stroke="currentColor" />
      <path d="M17 6l1 1 2-2" strokeWidth="1.5" />
      {/* Bubbles */}
      <circle cx="10" cy="12" r="0.5" fill="currentColor" />
      <circle cx="13" cy="11" r="0.5" fill="currentColor" />
      <circle cx="11" cy="13.5" r="0.5" fill="currentColor" />
    </svg>
  );
}
