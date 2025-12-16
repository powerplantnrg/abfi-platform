/**
 * RSIE Admin Dashboard - Risk & Supply Intelligence Engine monitoring
 * Admin-only page for managing data sources, viewing risk events, and monitoring ingestion.
 */
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import {
  Database,
  AlertTriangle,
  Cloud,
  Newspaper,
  Activity,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  Flame,
  Droplets,
  Wind,
  Thermometer,
  Bug,
  Truck,
  FileText,
  MessageSquare,
  TrendingUp,
  Shield,
  Zap,
  BarChart3,
} from "lucide-react";
import { Redirect } from "wouter";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

// Risk event type icons
const RISK_TYPE_ICONS: Record<string, React.ReactNode> = {
  bushfire: <Flame className="h-4 w-4 text-orange-500" />,
  flood: <Droplets className="h-4 w-4 text-blue-500" />,
  drought: <Thermometer className="h-4 w-4 text-amber-600" />,
  cyclone: <Wind className="h-4 w-4 text-purple-500" />,
  storm: <Cloud className="h-4 w-4 text-gray-500" />,
  heatwave: <Thermometer className="h-4 w-4 text-red-500" />,
  frost: <Thermometer className="h-4 w-4 text-cyan-500" />,
  pest: <Bug className="h-4 w-4 text-green-600" />,
  disease: <Bug className="h-4 w-4 text-red-600" />,
  policy: <FileText className="h-4 w-4 text-indigo-500" />,
  industrial_action: <Truck className="h-4 w-4 text-gray-600" />,
  logistics_disruption: <Truck className="h-4 w-4 text-yellow-600" />,
};

const SEVERITY_COLORS: Record<string, string> = {
  critical: "bg-red-500",
  high: "bg-orange-500",
  medium: "bg-yellow-500",
  low: "bg-green-500",
};

const STATUS_COLORS: Record<string, string> = {
  active: "bg-red-500",
  watch: "bg-yellow-500",
  resolved: "bg-green-500",
  succeeded: "bg-green-500",
  started: "bg-blue-500",
  partial: "bg-yellow-500",
  failed: "bg-red-500",
};

function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  loading,
}: {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  trend?: { value: number; label: string };
  loading?: boolean;
}) {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-8 w-16 mb-1" />
          <Skeleton className="h-3 w-32" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            {title}
          </span>
          <div className="p-2 bg-primary/10 rounded-lg">{icon}</div>
        </div>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp
              className={cn(
                "h-3 w-3",
                trend.value >= 0 ? "text-green-500" : "text-red-500"
              )}
            />
            <span
              className={cn(
                "text-xs",
                trend.value >= 0 ? "text-green-500" : "text-red-500"
              )}
            >
              {trend.value >= 0 ? "+" : ""}
              {trend.value}% {trend.label}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function AdminRSIE() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  // Data Sources
  const {
    data: dataSources,
    isLoading: loadingDataSources,
    refetch: refetchDataSources,
  } = trpc.rsie.dataSources.list.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });

  // Risk Events
  const {
    data: riskEventsData,
    isLoading: loadingRiskEvents,
    refetch: refetchRiskEvents,
  } = trpc.rsie.riskEvents.list.useQuery(
    { limit: 10 },
    { enabled: isAuthenticated && user?.role === "admin" }
  );

  // Ingestion Runs
  const {
    data: ingestionRuns,
    isLoading: loadingIngestionRuns,
    refetch: refetchIngestionRuns,
  } = trpc.rsie.ingestion.listRuns.useQuery(
    { limit: 10 },
    { enabled: isAuthenticated && user?.role === "admin" }
  );

  // Intelligence Items
  const {
    data: intelligenceData,
    isLoading: loadingIntelligence,
  } = trpc.rsie.intelligence.list.useQuery(
    { limit: 5 },
    { enabled: isAuthenticated && user?.role === "admin" }
  );

  // Feedback Stats
  const {
    data: feedbackStats,
    isLoading: loadingFeedback,
  } = trpc.rsie.feedback.stats.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });

  // Mutations
  const toggleDataSourceMutation = trpc.rsie.dataSources.toggleEnabled.useMutation({
    onSuccess: () => {
      toast.success("Data source updated");
      refetchDataSources();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update data source");
    },
  });

  const recalculateExposuresMutation = trpc.rsie.exposure.recalculate.useMutation({
    onSuccess: (result) => {
      toast.success(
        `Recalculated ${result.processed} exposures for ${result.eventCount} events`
      );
    },
    onError: (error) => {
      toast.error(error.message || "Failed to recalculate exposures");
    },
  });

  const resolveRiskEventMutation = trpc.rsie.riskEvents.resolve.useMutation({
    onSuccess: () => {
      toast.success("Risk event resolved");
      refetchRiskEvents();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to resolve risk event");
    },
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <Skeleton className="h-10 w-64 mb-2" />
        <Skeleton className="h-5 w-96 mb-8" />
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return <Redirect to="/dashboard" />;
  }

  // Calculate stats
  const enabledSourcesCount = dataSources?.filter((s) => s.isEnabled).length ?? 0;
  const totalSourcesCount = dataSources?.length ?? 0;
  const activeRiskCount =
    riskEventsData?.events.filter((e) => e.eventStatus === "active").length ?? 0;
  const watchRiskCount =
    riskEventsData?.events.filter((e) => e.eventStatus === "watch").length ?? 0;
  const recentSuccessfulRuns =
    ingestionRuns?.filter((r) => r.status === "succeeded").length ?? 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">RSIE Admin</h1>
              <p className="text-xs text-muted-foreground">
                Risk & Supply Intelligence Engine
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                refetchDataSources();
                refetchRiskEvents();
                refetchIngestionRuns();
              }}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
            <Button
              size="sm"
              onClick={() => recalculateExposuresMutation.mutate()}
              disabled={recalculateExposuresMutation.isPending}
            >
              <Zap className="h-4 w-4 mr-1" />
              {recalculateExposuresMutation.isPending
                ? "Calculating..."
                : "Recalc Exposures"}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Data Sources"
            value={`${enabledSourcesCount}/${totalSourcesCount}`}
            description="Enabled sources"
            icon={<Database className="h-4 w-4 text-primary" />}
            loading={loadingDataSources}
          />
          <StatsCard
            title="Active Risks"
            value={activeRiskCount}
            description={`${watchRiskCount} on watch`}
            icon={<AlertTriangle className="h-4 w-4 text-orange-500" />}
            loading={loadingRiskEvents}
          />
          <StatsCard
            title="Ingestion Runs"
            value={recentSuccessfulRuns}
            description="Successful (last 10)"
            icon={<Activity className="h-4 w-4 text-green-500" />}
            loading={loadingIngestionRuns}
          />
          <StatsCard
            title="Feedback Score"
            value={feedbackStats?.avgNps?.toFixed(1) ?? "-"}
            description={`${feedbackStats?.count ?? 0} responses`}
            icon={<MessageSquare className="h-4 w-4 text-blue-500" />}
            loading={loadingFeedback}
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="data-sources" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="data-sources">Data Sources</TabsTrigger>
            <TabsTrigger value="risk-events">Risk Events</TabsTrigger>
            <TabsTrigger value="ingestion">Ingestion</TabsTrigger>
            <TabsTrigger value="intelligence">Intelligence</TabsTrigger>
          </TabsList>

          {/* Data Sources Tab */}
          <TabsContent value="data-sources">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Data Sources
                </CardTitle>
                <CardDescription>
                  Manage external data sources for the intelligence engine
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingDataSources ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : dataSources && dataSources.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Source</TableHead>
                        <TableHead>Key</TableHead>
                        <TableHead>License</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dataSources.map((source) => (
                        <TableRow key={source.id}>
                          <TableCell>
                            <div className="font-medium">{source.name}</div>
                            {source.attributionText && (
                              <div className="text-xs text-muted-foreground truncate max-w-xs">
                                {source.attributionText}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <code className="text-xs bg-muted px-2 py-1 rounded">
                              {source.sourceKey}
                            </code>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {source.licenseClass.replace("_", " ")}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={source.isEnabled ? "default" : "secondary"}
                            >
                              {source.isEnabled ? "Enabled" : "Disabled"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Switch
                              checked={source.isEnabled ?? false}
                              onCheckedChange={(checked) =>
                                toggleDataSourceMutation.mutate({
                                  id: source.id,
                                  isEnabled: checked,
                                })
                              }
                              disabled={toggleDataSourceMutation.isPending}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Database className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>No data sources configured</p>
                    <p className="text-sm">
                      Data sources will appear here once added via the API
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Risk Events Tab */}
          <TabsContent value="risk-events">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Active Risk Events
                </CardTitle>
                <CardDescription>
                  Monitor and manage supply chain risk events
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingRiskEvents ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                ) : riskEventsData?.events && riskEventsData.events.length > 0 ? (
                  <div className="space-y-4">
                    {riskEventsData.events.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-start justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-start gap-4">
                          <div className="p-2 bg-muted rounded-lg">
                            {RISK_TYPE_ICONS[event.eventType] || (
                              <AlertTriangle className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium capitalize">
                                {event.eventType.replace("_", " ")}
                              </span>
                              <Badge
                                className={cn(
                                  "text-xs text-white",
                                  SEVERITY_COLORS[event.severity]
                                )}
                              >
                                {event.severity}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-xs",
                                  event.eventStatus === "active" &&
                                    "border-red-500 text-red-500",
                                  event.eventStatus === "watch" &&
                                    "border-yellow-500 text-yellow-500",
                                  event.eventStatus === "resolved" &&
                                    "border-green-500 text-green-500"
                                )}
                              >
                                {event.eventStatus}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              <span>Score: {event.scoreTotal}</span>
                              <span className="mx-2">•</span>
                              <span>
                                Confidence:{" "}
                                {(Number(event.confidence) * 100).toFixed(0)}%
                              </span>
                              <span className="mx-2">•</span>
                              <span>
                                Started{" "}
                                {formatDistanceToNow(new Date(event.startDate), {
                                  addSuffix: true,
                                })}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              ID: {event.eventFingerprint.slice(0, 16)}...
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {event.eventStatus !== "resolved" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                resolveRiskEventMutation.mutate({ id: event.id })
                              }
                              disabled={resolveRiskEventMutation.isPending}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Resolve
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    <div className="text-center text-sm text-muted-foreground pt-4">
                      Showing {riskEventsData.events.length} of{" "}
                      {riskEventsData.total} events
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-20 text-green-500" />
                    <p>No active risk events</p>
                    <p className="text-sm">
                      Risk events will appear here when detected
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Ingestion Tab */}
          <TabsContent value="ingestion">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Ingestion Runs
                </CardTitle>
                <CardDescription>
                  Monitor data pipeline execution and status
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingIngestionRuns ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : ingestionRuns && ingestionRuns.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Run ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Records</TableHead>
                        <TableHead>Started</TableHead>
                        <TableHead>Duration</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ingestionRuns.map((run) => (
                        <TableRow key={run.id}>
                          <TableCell>
                            <code className="text-xs">#{run.id}</code>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {run.runType}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {run.status === "succeeded" && (
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                              )}
                              {run.status === "failed" && (
                                <XCircle className="h-4 w-4 text-red-500" />
                              )}
                              {run.status === "started" && (
                                <Clock className="h-4 w-4 text-blue-500 animate-pulse" />
                              )}
                              {run.status === "partial" && (
                                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                              )}
                              <span className="capitalize">{run.status}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-green-600">
                              {run.recordsIn ?? 0} in
                            </span>
                            <span className="mx-1">/</span>
                            <span className="text-blue-600">
                              {run.recordsOut ?? 0} out
                            </span>
                          </TableCell>
                          <TableCell>
                            {formatDistanceToNow(new Date(run.startedAt), {
                              addSuffix: true,
                            })}
                          </TableCell>
                          <TableCell>
                            {run.finishedAt
                              ? `${Math.round(
                                  (new Date(run.finishedAt).getTime() -
                                    new Date(run.startedAt).getTime()) /
                                    1000
                                )}s`
                              : "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Activity className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>No ingestion runs yet</p>
                    <p className="text-sm">
                      Runs will appear here when data pipelines execute
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Intelligence Tab */}
          <TabsContent value="intelligence">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Newspaper className="h-5 w-5" />
                  Intelligence Feed
                </CardTitle>
                <CardDescription>
                  News, policy updates, and market intelligence
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingIntelligence ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                ) : intelligenceData?.items && intelligenceData.items.length > 0 ? (
                  <div className="space-y-4">
                    {intelligenceData.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start gap-4 p-4 border rounded-lg"
                      >
                        <div className="p-2 bg-muted rounded-lg">
                          {item.itemType === "news" && (
                            <Newspaper className="h-4 w-4" />
                          )}
                          {item.itemType === "policy" && (
                            <FileText className="h-4 w-4" />
                          )}
                          {item.itemType === "market_note" && (
                            <BarChart3 className="h-4 w-4" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium truncate">
                              {item.title}
                            </span>
                            <Badge variant="outline" className="capitalize text-xs">
                              {item.itemType.replace("_", " ")}
                            </Badge>
                          </div>
                          {item.summary && (
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {item.summary}
                            </p>
                          )}
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                            {item.publisher && <span>{item.publisher}</span>}
                            {item.publishedAt && (
                              <span>
                                {formatDistanceToNow(new Date(item.publishedAt), {
                                  addSuffix: true,
                                })}
                              </span>
                            )}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <a
                            href={item.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View
                          </a>
                        </Button>
                      </div>
                    ))}
                    <div className="text-center text-sm text-muted-foreground pt-4">
                      Showing {intelligenceData.items.length} of{" "}
                      {intelligenceData.total} items
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Newspaper className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>No intelligence items yet</p>
                    <p className="text-sm">
                      News and policy updates will appear here
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
