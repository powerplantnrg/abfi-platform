import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground border-border",
        success:
          "border-transparent bg-success/15 text-success",
        warning:
          "border-transparent bg-warning/15 text-warning",
        info:
          "border-transparent bg-info/15 text-info",
        // Rating variants for ABFI scores
        "rating-a-plus":
          "border-transparent bg-rating-a-plus/15 text-rating-a-plus font-semibold",
        "rating-a":
          "border-transparent bg-rating-a/15 text-rating-a font-semibold",
        "rating-b-plus":
          "border-transparent bg-rating-b-plus/15 text-rating-b-plus font-semibold",
        "rating-b":
          "border-transparent bg-rating-b/15 text-rating-b font-semibold",
        "rating-c-plus":
          "border-transparent bg-rating-c-plus/15 text-rating-c-plus font-semibold",
        "rating-c":
          "border-transparent bg-rating-c/15 text-rating-c font-semibold",
        "rating-d":
          "border-transparent bg-rating-d/15 text-rating-d font-semibold",
        "rating-f":
          "border-transparent bg-rating-f/15 text-rating-f font-semibold",
        // Status variants
        draft:
          "border-transparent bg-muted text-muted-foreground",
        pending:
          "border-transparent bg-warning/15 text-warning",
        verified:
          "border-transparent bg-success/15 text-success",
        rejected:
          "border-transparent bg-destructive/15 text-destructive",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0 text-[10px]",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";

    return (
      <Comp
        ref={ref}
        data-slot="badge"
        className={cn(badgeVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

/**
 * Status Badge - Specialized for status displays
 */
const StatusBadge = React.forwardRef<
  HTMLDivElement,
  Omit<BadgeProps, "variant"> & {
    status: "draft" | "pending" | "submitted" | "under_review" | "verified" | "approved" | "rejected" | "expired";
  }
>(({ status, ...props }, ref) => {
  const statusVariants: Record<string, VariantProps<typeof badgeVariants>["variant"]> = {
    draft: "draft",
    pending: "pending",
    submitted: "pending",
    under_review: "info",
    verified: "verified",
    approved: "verified",
    rejected: "rejected",
    expired: "destructive",
  };

  const statusLabels: Record<string, string> = {
    draft: "Draft",
    pending: "Pending",
    submitted: "Submitted",
    under_review: "Under Review",
    verified: "Verified",
    approved: "Approved",
    rejected: "Rejected",
    expired: "Expired",
  };

  return (
    <Badge ref={ref} variant={statusVariants[status]} {...props}>
      {statusLabels[status]}
    </Badge>
  );
});
StatusBadge.displayName = "StatusBadge";

/**
 * Rating Badge - Specialized for ABFI score ratings
 */
const RatingBadge = React.forwardRef<
  HTMLDivElement,
  Omit<BadgeProps, "variant"> & {
    rating: string;
  }
>(({ rating, ...props }, ref) => {
  const ratingVariants: Record<string, VariantProps<typeof badgeVariants>["variant"]> = {
    "A+": "rating-a-plus",
    "A": "rating-a",
    "B+": "rating-b-plus",
    "B": "rating-b",
    "C+": "rating-c-plus",
    "C": "rating-c",
    "D": "rating-d",
    "F": "rating-f",
  };

  return (
    <Badge
      ref={ref}
      variant={ratingVariants[rating] || "outline"}
      className="font-mono"
      {...props}
    >
      {rating}
    </Badge>
  );
});
RatingBadge.displayName = "RatingBadge";

export { Badge, StatusBadge, RatingBadge, badgeVariants };
