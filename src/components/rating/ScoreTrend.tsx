"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import { Loader2, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { getScoreTier } from "@/lib/rating/calculator";

interface RatingHistoryEntry {
  id: string;
  entity_type: string;
  entity_id: string;
  abfi_score: number | null;
  ci_rating: string | null;
  ci_value: number | null;
  sustainability_score: number | null;
  supply_reliability_score: number | null;
  quality_score: number | null;
  traceability_score: number | null;
  trigger_type: string | null;
  calculation_date: string;
}

interface ScoreTrendProps {
  entityType: "feedstock" | "supplier" | "ci_report";
  entityId: string;
  showComponents?: boolean;
  height?: number;
  className?: string;
}

// Premium chart colors using design tokens
const CHART_COLORS = {
  primary: "hsl(var(--primary))",
  sustainability: "hsl(var(--success))",
  reliability: "hsl(var(--info))",
  quality: "hsl(var(--accent))",
  traceability: "hsl(var(--warning))",
  grid: "hsl(var(--border))",
  text: "hsl(var(--muted-foreground))",
};

export function ScoreTrend({
  entityType,
  entityId,
  showComponents = false,
  height = 300,
  className,
}: ScoreTrendProps) {
  const [history, setHistory] = useState<RatingHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const response = await fetch(
          `/api/rating-history?entity_type=${entityType}&entity_id=${entityId}`
        );
        if (!response.ok) throw new Error("Failed to fetch history");
        const data = await response.json();
        setHistory(data.history || []);
      } catch (err) {
        setError("Failed to load rating history");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, [entityType, entityId]);

  if (loading) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <CardContent className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading history...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || history.length === 0) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader>
          <CardTitle className="text-lg font-display">Score History</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <TrendingUp className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">
            {error || "No historical data available yet"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Score history will appear here as ratings are recorded
          </p>
        </CardContent>
      </Card>
    );
  }

  // Format data for chart
  const chartData = history
    .slice()
    .reverse()
    .map((entry) => ({
      date: format(new Date(entry.calculation_date), "dd MMM"),
      fullDate: format(new Date(entry.calculation_date), "dd MMM yyyy"),
      abfiScore: entry.abfi_score,
      ciValue: entry.ci_value,
      sustainability: entry.sustainability_score,
      reliability: entry.supply_reliability_score,
      quality: entry.quality_score,
      traceability: entry.traceability_score,
    }));

  // Calculate trend
  const latestScore = history[0]?.abfi_score;
  const previousScore = history.length > 1 ? history[1]?.abfi_score : null;
  const scoreDiff =
    latestScore && previousScore ? latestScore - previousScore : 0;

  const tier = latestScore ? getScoreTier(latestScore) : null;

  const getTrendIcon = () => {
    if (scoreDiff > 0) return <TrendingUp className="h-4 w-4" />;
    if (scoreDiff < 0) return <TrendingDown className="h-4 w-4" />;
    return <Minus className="h-4 w-4" />;
  };

  const getTrendText = () => {
    if (scoreDiff > 0) return `+${scoreDiff.toFixed(1)} from last`;
    if (scoreDiff < 0) return `${scoreDiff.toFixed(1)} from last`;
    return "No change";
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-display">Score History</CardTitle>
            <CardDescription>
              ABFI score over time ({history.length} data points)
            </CardDescription>
          </div>
          <div
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium",
              scoreDiff > 0 && "bg-success/10 text-success",
              scoreDiff < 0 && "bg-destructive/10 text-destructive",
              scoreDiff === 0 && "bg-muted text-muted-foreground"
            )}
          >
            {getTrendIcon()}
            <span className="font-mono">{getTrendText()}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div style={{ width: "100%", height }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorAbfi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={CHART_COLORS.grid}
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: CHART_COLORS.text }}
                tickLine={false}
                axisLine={{ stroke: CHART_COLORS.grid }}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: CHART_COLORS.text }}
                tickLine={false}
                axisLine={false}
                width={35}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const data = payload[0].payload;
                  const scoreTier = data.abfiScore ? getScoreTier(data.abfiScore) : null;
                  return (
                    <div className="rounded-xl border bg-card p-3 shadow-lg">
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <span className="font-medium">{data.fullDate}</span>
                        {scoreTier && (
                          <span className={cn("text-xs font-medium px-2 py-0.5 rounded", scoreTier.bgClass, scoreTier.colorClass)}>
                            {scoreTier.tier}
                          </span>
                        )}
                      </div>
                      {payload.map((entry) => (
                        <div
                          key={entry.dataKey}
                          className="flex items-center gap-2 text-sm"
                        >
                          <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: entry.color }}
                          />
                          <span className="text-muted-foreground">
                            {entry.name}:
                          </span>
                          <span className="font-mono font-medium">
                            {typeof entry.value === "number"
                              ? entry.value.toFixed(1)
                              : "-"}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                }}
              />
              <Legend
                wrapperStyle={{ paddingTop: 16 }}
                formatter={(value) => (
                  <span className="text-xs text-muted-foreground">{value}</span>
                )}
              />
              <Area
                type="monotone"
                dataKey="abfiScore"
                name="ABFI Score"
                stroke={CHART_COLORS.primary}
                strokeWidth={2}
                fill="url(#colorAbfi)"
                dot={{ r: 4, fill: CHART_COLORS.primary, strokeWidth: 0 }}
                activeDot={{ r: 6, strokeWidth: 2, stroke: "white" }}
              />
              {showComponents && (
                <>
                  <Line
                    type="monotone"
                    dataKey="sustainability"
                    name="Sustainability"
                    stroke={CHART_COLORS.sustainability}
                    strokeWidth={1.5}
                    dot={{ r: 2 }}
                    strokeDasharray="4 4"
                  />
                  <Line
                    type="monotone"
                    dataKey="reliability"
                    name="Reliability"
                    stroke={CHART_COLORS.reliability}
                    strokeWidth={1.5}
                    dot={{ r: 2 }}
                    strokeDasharray="4 4"
                  />
                  <Line
                    type="monotone"
                    dataKey="quality"
                    name="Quality"
                    stroke={CHART_COLORS.quality}
                    strokeWidth={1.5}
                    dot={{ r: 2 }}
                    strokeDasharray="4 4"
                  />
                  <Line
                    type="monotone"
                    dataKey="traceability"
                    name="Traceability"
                    stroke={CHART_COLORS.traceability}
                    strokeWidth={1.5}
                    dot={{ r: 2 }}
                    strokeDasharray="4 4"
                  />
                </>
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Compact version for dashboards - Mini sparkline
 */
export function ScoreTrendMini({
  entityType,
  entityId,
  className,
}: {
  entityType: "feedstock" | "supplier" | "ci_report";
  entityId: string;
  className?: string;
}) {
  const [history, setHistory] = useState<RatingHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const response = await fetch(
          `/api/rating-history?entity_type=${entityType}&entity_id=${entityId}&limit=10`
        );
        if (response.ok) {
          const data = await response.json();
          setHistory(data.history || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, [entityType, entityId]);

  if (loading || history.length < 2) {
    return null;
  }

  const chartData = history
    .slice()
    .reverse()
    .map((entry) => ({
      score: entry.abfi_score || 0,
    }));

  const latestScore = history[0]?.abfi_score || 0;
  const previousScore = history[1]?.abfi_score || 0;
  const trending =
    latestScore > previousScore
      ? "up"
      : latestScore < previousScore
        ? "down"
        : "flat";

  const trendColor =
    trending === "up"
      ? "hsl(var(--success))"
      : trending === "down"
        ? "hsl(var(--destructive))"
        : "hsl(var(--muted-foreground))";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="h-8 w-24">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <Line
              type="monotone"
              dataKey="score"
              stroke={trendColor}
              strokeWidth={1.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div
        className={cn(
          "flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium",
          trending === "up" && "bg-success/10 text-success",
          trending === "down" && "bg-destructive/10 text-destructive",
          trending === "flat" && "bg-muted text-muted-foreground"
        )}
      >
        {trending === "up" && <TrendingUp className="h-3 w-3" />}
        {trending === "down" && <TrendingDown className="h-3 w-3" />}
        {trending === "flat" && <Minus className="h-3 w-3" />}
      </div>
    </div>
  );
}

/**
 * Score History Timeline - vertical list of score changes
 */
export function ScoreHistoryTimeline({
  entityType,
  entityId,
  limit = 5,
  className,
}: {
  entityType: "feedstock" | "supplier" | "ci_report";
  entityId: string;
  limit?: number;
  className?: string;
}) {
  const [history, setHistory] = useState<RatingHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const response = await fetch(
          `/api/rating-history?entity_type=${entityType}&entity_id=${entityId}&limit=${limit}`
        );
        if (response.ok) {
          const data = await response.json();
          setHistory(data.history || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, [entityType, entityId, limit]);

  if (loading) {
    return (
      <div className={cn("flex justify-center py-8", className)}>
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <p className={cn("text-center text-sm text-muted-foreground py-4", className)}>
        No score history available
      </p>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {history.map((entry, index) => {
        const tier = entry.abfi_score ? getScoreTier(entry.abfi_score) : null;
        const prevEntry = history[index + 1];
        const diff = entry.abfi_score && prevEntry?.abfi_score
          ? entry.abfi_score - prevEntry.abfi_score
          : null;

        return (
          <div
            key={entry.id}
            className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
          >
            {tier && (
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg font-mono font-bold text-sm",
                  tier.bgClass,
                  tier.colorClass
                )}
              >
                {entry.abfi_score}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">
                  {format(new Date(entry.calculation_date), "dd MMM yyyy")}
                </span>
                {diff !== null && diff !== 0 && (
                  <span
                    className={cn(
                      "text-xs font-mono",
                      diff > 0 ? "text-success" : "text-destructive"
                    )}
                  >
                    {diff > 0 ? "+" : ""}
                    {diff}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {entry.trigger_type || "Automatic calculation"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
