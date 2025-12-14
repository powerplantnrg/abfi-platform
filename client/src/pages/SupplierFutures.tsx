import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { Sprout, Plus, Edit, Eye, TreeDeciduous, Leaf, Calendar, MapPin, TrendingUp, FileText, Users } from "lucide-react";
import { Link } from "wouter";
import { formatDate } from "@/const";

const CROP_TYPE_LABELS: Record<string, string> = {
  bamboo: "Bamboo",
  rotation_forestry: "Rotation Forestry",
  eucalyptus: "Eucalyptus",
  poplar: "Poplar",
  willow: "Willow",
  miscanthus: "Miscanthus",
  switchgrass: "Switchgrass",
  arundo_donax: "Arundo Donax",
  hemp: "Industrial Hemp",
  other_perennial: "Other Perennial",
};

const CROP_TYPE_ICONS: Record<string, React.ReactNode> = {
  bamboo: <Sprout className="h-5 w-5" />,
  rotation_forestry: <TreeDeciduous className="h-5 w-5" />,
  eucalyptus: <TreeDeciduous className="h-5 w-5" />,
  poplar: <TreeDeciduous className="h-5 w-5" />,
  willow: <TreeDeciduous className="h-5 w-5" />,
  miscanthus: <Leaf className="h-5 w-5" />,
  switchgrass: <Leaf className="h-5 w-5" />,
  arundo_donax: <Leaf className="h-5 w-5" />,
  hemp: <Leaf className="h-5 w-5" />,
  other_perennial: <Sprout className="h-5 w-5" />,
};

export default function SupplierFutures() {
  const { user, loading: authLoading } = useAuth();

  const { data: futures, isLoading } = trpc.futures.list.useQuery(
    undefined,
    { enabled: !!user }
  );

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Skeleton className="h-8 w-64 mx-auto mb-4" />
          <Skeleton className="h-4 w-48 mx-auto" />
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "draft": return "bg-gray-100 text-gray-800";
      case "partially_contracted": return "bg-blue-100 text-blue-800";
      case "fully_contracted": return "bg-purple-100 text-purple-800";
      case "expired": return "bg-orange-100 text-orange-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatStatusLabel = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Calculate stats
  const stats = {
    active: futures?.filter(f => f.status === 'active').length || 0,
    totalProjected: futures?.reduce((sum, f) => sum + (parseFloat(f.totalProjectedTonnes || '0') || 0), 0) || 0,
    totalContracted: futures?.reduce((sum, f) => sum + (parseFloat(f.totalContractedTonnes || '0') || 0), 0) || 0,
    pendingEOIs: futures?.reduce((sum, f) => sum + (f.eoiCounts?.pending || 0), 0) || 0,
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Futures Listings</h1>
            <p className="text-muted-foreground">
              Manage your long-term perennial crop projections and EOIs
            </p>
          </div>
          <Link href="/supplier/futures/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Futures Listing
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
              <Sprout className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.active}</div>
              <p className="text-xs text-muted-foreground">Published futures</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projected</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProjected.toLocaleString()}t</div>
              <p className="text-xs text-muted-foreground">Across all futures</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contracted</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalContracted.toLocaleString()}t</div>
              <p className="text-xs text-muted-foreground">Committed volume</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending EOIs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingEOIs}</div>
              <p className="text-xs text-muted-foreground">Awaiting response</p>
            </CardContent>
          </Card>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : futures && futures.length > 0 ? (
          <div className="space-y-4">
            {futures.map((f: any) => {
              const availablePercent = parseFloat(f.totalProjectedTonnes || '0') > 0
                ? (parseFloat(f.totalAvailableTonnes || '0') / parseFloat(f.totalProjectedTonnes || '0')) * 100
                : 100;
              const projectionYears = f.projectionEndYear - f.projectionStartYear + 1;

              return (
                <Card key={f.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          <div className="p-2 bg-green-100 rounded-lg">
                            {CROP_TYPE_ICONS[f.cropType] || <Sprout className="h-5 w-5" />}
                          </div>
                          {f.futuresId}
                        </CardTitle>
                        <CardDescription className="mt-2">
                          {f.title || `${f.landAreaHectares}ha ${CROP_TYPE_LABELS[f.cropType]} plantation`}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getStatusColor(f.status)}>
                          {formatStatusLabel(f.status)}
                        </Badge>
                        <Badge variant="outline">
                          {CROP_TYPE_LABELS[f.cropType] || f.cropType}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{f.state}{f.region ? `, ${f.region}` : ''}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{f.projectionStartYear} - {f.projectionEndYear} ({projectionYears} years)</span>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Land Area</div>
                        <div className="font-medium">{parseFloat(f.landAreaHectares).toLocaleString()} ha</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Indicative Price</div>
                        <div className="font-medium">
                          {f.indicativePricePerTonne ? `$${parseFloat(f.indicativePricePerTonne).toFixed(2)}/t` : 'Negotiable'}
                        </div>
                      </div>
                    </div>

                    {/* Volume Stats */}
                    <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Projected</span>
                        <span className="font-medium">{parseFloat(f.totalProjectedTonnes || '0').toLocaleString()}t</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Contracted</span>
                        <span className="font-medium text-blue-600">
                          {parseFloat(f.totalContractedTonnes || '0').toLocaleString()}t
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Available</span>
                        <span className="font-medium text-green-600">
                          {parseFloat(f.totalAvailableTonnes || '0').toLocaleString()}t
                        </span>
                      </div>
                      <Progress value={availablePercent} className="h-2" />
                      <div className="text-xs text-center text-muted-foreground">
                        {Math.round(availablePercent)}% available for contracting
                      </div>
                    </div>

                    {/* EOI Stats */}
                    {f.eoiCounts && f.eoiCounts.total > 0 && (
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span><strong>{f.eoiCounts.total}</strong> EOIs received</span>
                        </div>
                        {f.eoiCounts.pending > 0 && (
                          <Badge variant="secondary">{f.eoiCounts.pending} pending</Badge>
                        )}
                        {f.eoiCounts.accepted > 0 && (
                          <Badge className="bg-green-100 text-green-800">{f.eoiCounts.accepted} accepted</Badge>
                        )}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      <Link href={`/supplier/futures/${f.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                      {f.status === 'draft' && (
                        <Link href={`/supplier/futures/create?edit=${f.id}`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        </Link>
                      )}
                      {f.eoiCounts?.pending > 0 && (
                        <Link href={`/supplier/futures/${f.id}?tab=eois`}>
                          <Button size="sm">
                            <Users className="h-4 w-4 mr-2" />
                            Review EOIs
                          </Button>
                        </Link>
                      )}
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Created {formatDate(f.createdAt)}
                      {f.publishedAt && ` • Published ${formatDate(f.publishedAt)}`}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Sprout className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No futures listings yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first futures listing to advertise long-term perennial crop supply
              </p>
              <Link href="/supplier/futures/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Futures Listing
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
