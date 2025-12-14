"use client";

import { IconProps } from "./types";

/**
 * ABFI Score Icon - Represents the ABFI rating system
 * Used for overall scores, rating displays, score badges
 */
export function AbfiScore({ size = 24, className, ...props }: IconProps) {
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
      {/* Shield representing trust/verification */}
      <path d="M12 2l8 4v6c0 5.5-3.5 10-8 11-4.5-1-8-5.5-8-11V6l8-4z" />
      {/* Inner shield highlight */}
      <path d="M12 5l5 2.5v4c0 3.5-2.2 6.3-5 7-2.8-.7-5-3.5-5-7v-4L12 5z" fill="currentColor" opacity="0.1" />
      {/* Star rating */}
      <path d="M12 8l1.5 3 3.5.5-2.5 2.5.5 3.5L12 16l-3 1.5.5-3.5L7 11.5l3.5-.5L12 8z" fill="currentColor" opacity="0.2" />
      <path d="M12 8l1.5 3 3.5.5-2.5 2.5.5 3.5L12 16l-3 1.5.5-3.5L7 11.5l3.5-.5L12 8z" />
    </svg>
  );
}
