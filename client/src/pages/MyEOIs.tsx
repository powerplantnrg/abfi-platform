import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { trpc } from "@/lib/trpc";
import { formatDate } from "@/const";
import {
  FileText,
  Calendar,
  MapPin,
  TrendingUp,
  DollarSign,
  TreeDeciduous,
  Sprout,
  Leaf,
  Eye,
  X,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Building2,
} from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

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

const EOI_STATUS_LABELS: Record<string, string> = {
  pending: "Pending Review",
  under_review: "Under Review",
  accepted: "Accepted",
  declined: "Declined",
  expired: "Expired",
  withdrawn: "Withdrawn",
};

const getEOIStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "under_review":
      return "bg-blue-100 text-blue-800";
    case "accepted":
      return "bg-green-100 text-green-800";
    case "declined":
      return "bg-red-100 text-red-800";
    case "expired":
    case "withdrawn":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getEOIStatusIcon = (status: string) => {
  switch (status) {
    case "pending":
      return <Clock className="h-5 w-5 text-yellow-600" />;
    case "under_review":
      return <AlertCircle className="h-5 w-5 text-blue-600" />;
    case "accepted":
      return <CheckCircle2 className="h-5 w-5 text-green-600" />;
    case "declined":
      return <XCircle className="h-5 w-5 text-red-600" />;
    case "withdrawn":
      return <X className="h-5 w-5 text-gray-600" />;
    default:
      return <Clock className="h-5 w-5 text-gray-600" />;
  }
};

export default function MyEOIs() {
  const { user, loading: authLoading } = useAuth();
  const utils = trpc.useUtils();

  const { data: eois, isLoading } = trpc.futures.myEOIs.useQuery(
    undefined,
    { enabled: !!user }
  );

  const withdrawMutation = trpc.futures.withdrawEOI.useMutation({
    onSuccess: () => {
      toast.success("EOI withdrawn successfully");
      utils.futures.myEOIs.invalidate();
    },
    onError: (error) => toast.error(error.message),
  });

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

  // Group EOIs by status
  const pendingEOIs = eois?.filter((e: any) => ["pending", "under_review"].includes(e.status)) || [];
  const activeEOIs = eois?.filter((e: any) => e.status === "accepted") || [];
  const closedEOIs = eois?.filter((e: any) => ["declined", "expired", "withdrawn"].includes(e.status)) || [];

  // Stats
  const stats = {
    total: eois?.length || 0,
    pending: pendingEOIs.length,
    accepted: activeEOIs.length,
    totalVolume: eois?.reduce((sum: number, e: any) => sum + parseFloat(e.totalVolumeTonnes || "0"), 0) || 0,
    acceptedVolume: activeEOIs.reduce((sum: number, e: any) => sum + parseFloat(e.totalVolumeTonnes || "0"), 0),
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Expressions of Interest</h1>
          <p className="text-muted-foreground">
            Track and manage your EOIs submitted to futures listings
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total EOIs</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Submitted</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">Awaiting response</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accepted</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.accepted}</div>
              <p className="text-xs text-muted-foreground">Ready for contract</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accepted Volume</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.acceptedVolume.toLocaleString()}t</div>
              <p className="text-xs text-muted-foreground">Total committed</p>
            </CardContent>
          </Card>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
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
        ) : eois && eois.length > 0 ? (
          <div className="space-y-8">
            {/* Pending EOIs */}
            {pendingEOIs.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  Pending ({pendingEOIs.length})
                </h2>
                <div className="space-y-4">
                  {pendingEOIs.map((eoi: any) => (
                    <EOICard key={eoi.id} eoi={eoi} onWithdraw={(id) => withdrawMutation.mutate({ eoiId: id })} />
                  ))}
                </div>
              </div>
            )}

            {/* Accepted EOIs */}
            {activeEOIs.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  Accepted ({activeEOIs.length})
                </h2>
                <div className="space-y-4">
                  {activeEOIs.map((eoi: any) => (
                    <EOICard key={eoi.id} eoi={eoi} />
                  ))}
                </div>
              </div>
            )}

            {/* Closed EOIs */}
            {closedEOIs.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-muted-foreground">
                  <XCircle className="h-5 w-5" />
                  Closed ({closedEOIs.length})
                </h2>
                <div className="space-y-4">
                  {closedEOIs.map((eoi: any) => (
                    <EOICard key={eoi.id} eoi={eoi} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No EOIs Yet</h3>
              <p className="text-muted-foreground mb-4">
                You haven't submitted any expressions of interest yet. Browse the marketplace to find futures listings.
              </p>
              <Link href="/futures">
                <Button>Browse Futures Marketplace</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function EOICard({ eoi, onWithdraw }: { eoi: any; onWithdraw?: (id: number) => void }) {
  const f = eoi.futures;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          {/* EOI Info */}
          <div className="flex-1">
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                {f ? CROP_TYPE_ICONS[f.cropType] || <Sprout className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">{eoi.eoiReference}</span>
                  <Badge className={getEOIStatusColor(eoi.status)}>{EOI_STATUS_LABELS[eoi.status]}</Badge>
                </div>
                {f && (
                  <p className="text-muted-foreground text-sm">
                    {f.futuresId} - {f.title}
                  </p>
                )}
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid md:grid-cols-4 gap-4 text-sm mb-3">
              <div>
                <p className="text-muted-foreground">Interest Period</p>
                <p className="font-medium">
                  {eoi.interestStartYear} - {eoi.interestEndYear}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Annual Volume</p>
                <p className="font-medium">{parseFloat(eoi.annualVolumeTonnes).toLocaleString()}t</p>
              </div>
              <div>
                <p className="text-muted-foreground">Total Volume</p>
                <p className="font-medium">{parseFloat(eoi.totalVolumeTonnes).toLocaleString()}t</p>
              </div>
              <div>
                <p className="text-muted-foreground">Offered Price</p>
                <p className="font-medium">
                  {eoi.offeredPricePerTonne
                    ? `$${parseFloat(eoi.offeredPricePerTonne).toFixed(2)}/t`
                    : "Negotiable"}
                </p>
              </div>
            </div>

            {/* Futures Details */}
            {f && (
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {f.state}
                  {f.region && `, ${f.region}`}
                </div>
                <div className="flex items-center gap-1">
                  <Building2 className="h-4 w-4" />
                  {CROP_TYPE_LABELS[f.cropType]}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {f.projectionStartYear} - {f.projectionEndYear}
                </div>
              </div>
            )}

            {/* Supplier Response */}
            {eoi.supplierResponse && (
              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium mb-1">Supplier Response:</p>
                <p className="text-sm text-muted-foreground">{eoi.supplierResponse}</p>
                {eoi.respondedAt && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Responded {formatDate(eoi.respondedAt)}
                  </p>
                )}
              </div>
            )}

            <div className="mt-3 text-xs text-muted-foreground">
              Submitted {formatDate(eoi.createdAt)}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {f && (
              <Link href={`/futures/${f.id}`}>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Listing
                </Button>
              </Link>
            )}
            {["pending", "under_review"].includes(eoi.status) && onWithdraw && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                    <X className="h-4 w-4 mr-2" />
                    Withdraw
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Withdraw EOI?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to withdraw this expression of interest? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onWithdraw(eoi.id)}
                      className="bg-destructive text-destructive-foreground"
                    >
                      Withdraw
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
