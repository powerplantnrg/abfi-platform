"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  variant?: "default" | "success" | "warning" | "destructive" | "accent";
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  animated?: boolean;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(
  (
    {
      className,
      value,
      variant = "default",
      size = "md",
      showValue = false,
      animated = false,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: "h-1",
      md: "h-2",
      lg: "h-3",
    };

    const variantClasses = {
      default: "bg-primary",
      success: "bg-success",
      warning: "bg-warning",
      destructive: "bg-destructive",
      accent: "bg-accent",
    };

    const variantBgClasses = {
      default: "bg-primary/20",
      success: "bg-success/20",
      warning: "bg-warning/20",
      destructive: "bg-destructive/20",
      accent: "bg-accent/20",
    };

    return (
      <div className="relative">
        <ProgressPrimitive.Root
          ref={ref}
          data-slot="progress"
          className={cn(
            "relative w-full overflow-hidden rounded-full",
            sizeClasses[size],
            variantBgClasses[variant],
            className
          )}
          {...props}
        >
          <ProgressPrimitive.Indicator
            data-slot="progress-indicator"
            className={cn(
              "h-full w-full flex-1 rounded-full transition-all duration-500 ease-out",
              variantClasses[variant],
              animated && "animate-pulse"
            )}
            style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
          />
        </ProgressPrimitive.Root>
        {showValue && (
          <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full pl-2 text-xs font-mono text-muted-foreground">
            {value}%
          </span>
        )}
      </div>
    );
  }
);
Progress.displayName = ProgressPrimitive.Root.displayName;

/**
 * Segmented Progress - for multi-step processes
 */
interface SegmentedProgressProps {
  steps: number;
  currentStep: number;
  className?: string;
}

const SegmentedProgress = React.forwardRef<
  HTMLDivElement,
  SegmentedProgressProps
>(({ steps, currentStep, className }, ref) => (
  <div ref={ref} className={cn("flex gap-1", className)}>
    {Array.from({ length: steps }).map((_, index) => (
      <div
        key={index}
        className={cn(
          "h-1.5 flex-1 rounded-full transition-all duration-300",
          index < currentStep
            ? "bg-primary"
            : index === currentStep
              ? "bg-primary/50"
              : "bg-muted"
        )}
      />
    ))}
  </div>
));
SegmentedProgress.displayName = "SegmentedProgress";

/**
 * Circular Progress - for loading states
 */
interface CircularProgressProps {
  value?: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showValue?: boolean;
}

const CircularProgress = React.forwardRef<SVGSVGElement, CircularProgressProps>(
  ({ value = 0, size = 40, strokeWidth = 4, className, showValue = false }, ref) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg
          ref={ref}
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className={cn("transform -rotate-90", className)}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-muted/20"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="text-primary transition-all duration-500 ease-out"
          />
        </svg>
        {showValue && (
          <span className="absolute text-xs font-mono font-medium">
            {value}%
          </span>
        )}
      </div>
    );
  }
);
CircularProgress.displayName = "CircularProgress";

export { Progress, SegmentedProgress, CircularProgress };
