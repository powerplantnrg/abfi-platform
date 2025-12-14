"use client";

import { cn } from "@/lib/utils";
import { getScoreTier, getCarbonRatingStyle } from "@/lib/rating/calculator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Sustainability, Quality, Reliability, CarbonIntensity } from "@/icons";

interface AbfiScoreCardProps {
  abfiScore: number;
  sustainabilityScore: number;
  carbonIntensityScore: number;
  qualityScore: number;
  reliabilityScore: number;
  carbonIntensityValue?: number;
  carbonRating?: string;
  compact?: boolean;
  className?: string;
}

export function AbfiScoreCard({
  abfiScore,
  sustainabilityScore,
  carbonIntensityScore,
  qualityScore,
  reliabilityScore,
  carbonIntensityValue,
  carbonRating,
  compact = false,
  className,
}: AbfiScoreCardProps) {
  const tier = getScoreTier(abfiScore);

  if (compact) {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl font-mono text-lg font-bold transition-transform hover:scale-105",
            tier.bgClass,
            tier.colorClass,
            tier.borderClass,
            "border"
          )}
        >
          {abfiScore}
        </div>
        <div>
          <div className="font-display font-semibold">{tier.label}</div>
          <div className="text-xs text-muted-foreground">ABFI Score</div>
        </div>
      </div>
    );
  }

  const pillars = [
    {
      name: "Sustainability",
      score: sustainabilityScore,
      weight: "30%",
      Icon: Sustainability,
      colorClass: "text-success",
      bgClass: "bg-success/10",
    },
    {
      name: "Carbon Intensity",
      score: carbonIntensityScore,
      weight: "30%",
      Icon: CarbonIntensity,
      colorClass: "text-info",
      bgClass: "bg-info/10",
      extra: carbonRating
        ? `${carbonIntensityValue} gCO₂e/MJ (${carbonRating})`
        : undefined,
    },
    {
      name: "Quality",
      score: qualityScore,
      weight: "25%",
      Icon: Quality,
      colorClass: "text-accent",
      bgClass: "bg-accent/10",
    },
    {
      name: "Reliability",
      score: reliabilityScore,
      weight: "15%",
      Icon: Reliability,
      colorClass: "text-warning",
      bgClass: "bg-warning/10",
    },
  ];

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-display">ABFI Score</CardTitle>
            <CardDescription>Composite rating from 4 pillars</CardDescription>
          </div>
          <ScoreGauge score={abfiScore} size="lg" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {pillars.map((pillar) => (
          <div key={pillar.name} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className={cn("rounded-md p-1.5", pillar.bgClass)}>
                  <pillar.Icon className={cn("h-4 w-4", pillar.colorClass)} />
                </div>
                <span className="font-medium">{pillar.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({pillar.weight})
                </span>
              </div>
              <div className="flex items-center gap-2">
                {pillar.extra && (
                  <span className="text-xs text-muted-foreground font-mono">
                    {pillar.extra}
                  </span>
                )}
                <span className="font-mono font-semibold">{pillar.score}</span>
              </div>
            </div>
            <Progress value={pillar.score} className="h-1.5" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

/**
 * Premium Score Gauge Component
 * Circular gauge with animated fill
 */
interface ScoreGaugeProps {
  score: number;
  size?: "sm" | "md" | "lg" | "xl";
  showTier?: boolean;
  className?: string;
}

export function ScoreGauge({
  score,
  size = "md",
  showTier = true,
  className,
}: ScoreGaugeProps) {
  const tier = getScoreTier(score);

  const sizeConfig = {
    sm: { outer: 48, inner: 40, stroke: 4, fontSize: "text-sm", tierSize: "text-[8px]" },
    md: { outer: 64, inner: 54, stroke: 5, fontSize: "text-lg", tierSize: "text-[10px]" },
    lg: { outer: 80, inner: 68, stroke: 6, fontSize: "text-2xl", tierSize: "text-xs" },
    xl: { outer: 120, inner: 104, stroke: 8, fontSize: "text-4xl", tierSize: "text-sm" },
  };

  const config = sizeConfig[size];
  const radius = (config.inner - config.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const offset = circumference - progress;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={config.outer}
        height={config.outer}
        viewBox={`0 0 ${config.outer} ${config.outer}`}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={config.outer / 2}
          cy={config.outer / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={config.stroke}
          className="text-muted/20"
        />
        {/* Progress circle */}
        <circle
          cx={config.outer / 2}
          cy={config.outer / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={config.stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn(tier.colorClass, "transition-all duration-1000 ease-out")}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("font-mono font-bold", config.fontSize, tier.colorClass)}>
          {score}
        </span>
        {showTier && (
          <span className={cn("font-medium text-muted-foreground", config.tierSize)}>
            {tier.tier}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * Premium ABFI Score Badge
 */
interface AbfiScoreBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "minimal" | "detailed";
  className?: string;
}

export function AbfiScoreBadge({
  score,
  size = "md",
  variant = "default",
  className,
}: AbfiScoreBadgeProps) {
  const tier = getScoreTier(score);

  const sizeClasses = {
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10 text-base",
    lg: "h-14 w-14 text-xl",
  };

  if (variant === "minimal") {
    return (
      <span className={cn("font-mono font-bold", tier.colorClass, className)}>
        {score}
      </span>
    );
  }

  if (variant === "detailed") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={cn(
                "inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 transition-all hover:shadow-md cursor-help",
                tier.bgClass,
                tier.borderClass,
                className
              )}
            >
              <span className={cn("font-mono font-bold", tier.colorClass)}>
                {score}
              </span>
              <span className={cn("text-xs font-medium", tier.colorClass)}>
                {tier.tier}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-medium">ABFI Score: {score}/100</p>
            <p className="text-xs text-muted-foreground">{tier.label}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "flex items-center justify-center rounded-xl font-mono font-bold cursor-help transition-all hover:scale-105 border",
              sizeClasses[size],
              tier.bgClass,
              tier.colorClass,
              tier.borderClass,
              className
            )}
          >
            {score}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-medium">ABFI Score: {score}/100</p>
          <p className="text-xs text-muted-foreground">{tier.label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/**
 * Premium Carbon Rating Badge
 */
interface CarbonRatingBadgeProps {
  rating: string;
  value?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
}

export function CarbonRatingBadge({
  rating,
  value,
  size = "md",
  showValue = true,
  className,
}: CarbonRatingBadgeProps) {
  const style = getCarbonRatingStyle(rating);

  const sizeClasses = {
    sm: "px-1.5 py-0.5 text-xs gap-1",
    md: "px-2 py-1 text-sm gap-1.5",
    lg: "px-3 py-1.5 text-base gap-2",
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "inline-flex items-center rounded-lg font-medium cursor-help transition-all hover:shadow-md border",
              sizeClasses[size],
              style.bgClass,
              style.colorClass,
              className
            )}
          >
            <CarbonIntensity className={cn(size === "sm" ? "h-3 w-3" : size === "lg" ? "h-5 w-5" : "h-4 w-4")} />
            <span className="font-mono font-bold">{rating}</span>
            {showValue && value !== undefined && (
              <span className="font-mono text-xs opacity-75">
                {value}
              </span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-medium">Carbon Intensity Rating: {rating}</p>
          <p className="text-xs text-muted-foreground">
            {value !== undefined ? `${value} gCO₂e/MJ` : "Value not measured"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/**
 * Score Comparison Component
 * Shows a score with trend indicator
 */
interface ScoreComparisonProps {
  current: number;
  previous?: number;
  label: string;
  className?: string;
}

export function ScoreComparison({
  current,
  previous,
  label,
  className,
}: ScoreComparisonProps) {
  const tier = getScoreTier(current);
  const diff = previous !== undefined ? current - previous : 0;
  const trend = diff > 0 ? "up" : diff < 0 ? "down" : "stable";

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <ScoreGauge score={current} size="sm" showTier={false} />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{label}</span>
          {previous !== undefined && (
            <span
              className={cn(
                "text-xs font-mono",
                trend === "up" && "text-success",
                trend === "down" && "text-destructive",
                trend === "stable" && "text-muted-foreground"
              )}
            >
              {trend === "up" && "+"}
              {diff !== 0 && diff}
              {trend === "stable" && "—"}
            </span>
          )}
        </div>
        <div className="text-xs text-muted-foreground">{tier.label}</div>
      </div>
    </div>
  );
}
