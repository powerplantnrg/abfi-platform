import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { formatDate } from "@/const";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  TreeDeciduous,
  Sprout,
  Leaf,
  TrendingUp,
  DollarSign,
  Edit,
  Trash2,
  Send,
  Eye,
  EyeOff,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  Phone,
  Mail,
} from "lucide-react";
import { useState } from "react";
import { Link, useRoute, useLocation, useSearch } from "wouter";
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

const LAND_STATUS_LABELS: Record<string, string> = {
  owned: "Owned",
  leased: "Leased",
  under_negotiation: "Under Negotiation",
  planned_acquisition: "Planned Acquisition",
};

const EOI_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  under_review: "Under Review",
  accepted: "Accepted",
  declined: "Declined",
  expired: "Expired",
  withdrawn: "Withdrawn",
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "draft":
      return "bg-gray-100 text-gray-800";
    case "partially_contracted":
      return "bg-blue-100 text-blue-800";
    case "fully_contracted":
      return "bg-purple-100 text-purple-800";
    case "expired":
      return "bg-orange-100 text-orange-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
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
      return "bg-gray-100 text-gray-800";
    case "withdrawn":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const formatStatusLabel = (status: string) => {
  return status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

export default function FuturesDetailSupplier() {
  const { user, loading: authLoading } = useAuth();
  const [, params] = useRoute("/supplier/futures/:id");
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const initialTab = searchParams.get("tab") || "details";

  const futuresId = parseInt(params?.id || "0");

  const [respondDialogOpen, setRespondDialogOpen] = useState(false);
  const [selectedEOI, setSelectedEOI] = useState<any>(null);
  const [responseText, setResponseText] = useState("");
  const [respondAction, setRespondAction] = useState<"accepted" | "declined" | "under_review">("under_review");

  const utils = trpc.useUtils();

  const { data, isLoading, error } = trpc.futures.getById.useQuery(
    { id: futuresId },
    { enabled: !!user && futuresId > 0 }
  );

  const { data: eois, isLoading: loadingEOIs } = trpc.futures.getEOIsForFutures.useQuery(
    { futuresId },
    { enabled: !!user && futuresId > 0 && data?.isOwner }
  );

  const publishMutation = trpc.futures.publish.useMutation({
    onSuccess: () => {
      toast.success("Futures listing published!");
      utils.futures.getById.invalidate({ id: futuresId });
    },
    onError: (error) => toast.error(error.message),
  });

  const unpublishMutation = trpc.futures.unpublish.useMutation({
    onSuccess: () => {
      toast.success("Futures listing unpublished");
      utils.futures.getById.invalidate({ id: futuresId });
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteMutation = trpc.futures.delete.useMutation({
    onSuccess: () => {
      toast.success("Futures listing deleted");
      setLocation("/supplier/futures");
    },
    onError: (error) => toast.error(error.message),
  });

  const respondMutation = trpc.futures.respondToEOI.useMutation({
    onSuccess: () => {
      toast.success("Response sent to buyer");
      setRespondDialogOpen(false);
      setSelectedEOI(null);
      setResponseText("");
      utils.futures.getEOIsForFutures.invalidate({ futuresId });
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="py-8 text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Futures Not Found</h3>
            <p className="text-muted-foreground mb-4">
              {error?.message || "The futures listing you're looking for doesn't exist."}
            </p>
            <Link href="/supplier/futures">
              <Button variant="outline">Back to Futures</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { futures, projections, isOwner } = data;

  if (!isOwner) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="py-8 text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
            <p className="text-muted-foreground mb-4">You don't have permission to view this futures listing.</p>
            <Link href="/supplier/futures">
              <Button variant="outline">Back to Futures</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalProjected = parseFloat(futures.totalProjectedTonnes || "0");
  const totalContracted = parseFloat(futures.totalContractedTonnes || "0");
  const totalAvailable = parseFloat(futures.totalAvailableTonnes || "0");
  const availablePercent = totalProjected > 0 ? (totalAvailable / totalProjected) * 100 : 100;

  const openRespondDialog = (eoi: any, action: "accepted" | "declined" | "under_review") => {
    setSelectedEOI(eoi);
    setRespondAction(action);
    setResponseText("");
    setRespondDialogOpen(true);
  };

  const handleRespond = () => {
    if (!selectedEOI) return;
    respondMutation.mutate({
      eoiId: selectedEOI.id,
      status: respondAction,
      response: responseText || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-6">
          <Link href="/supplier/futures">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Futures
            </Button>
          </Link>

          <div className="flex justify-between items-start">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-100 rounded-xl">
                {CROP_TYPE_ICONS[futures.cropType] || <Sprout className="h-6 w-6" />}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold">{futures.futuresId}</h1>
                  <Badge className={getStatusColor(futures.status)}>{formatStatusLabel(futures.status)}</Badge>
                </div>
                <p className="text-muted-foreground">{futures.title}</p>
              </div>
            </div>

            <div className="flex gap-2">
              {futures.status === "draft" && (
                <>
                  <Link href={`/supplier/futures/create?edit=${futures.id}`}>
                    <Button variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    onClick={() => publishMutation.mutate({ id: futures.id })}
                    disabled={publishMutation.isPending}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Publish
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Futures Listing?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete this futures listing.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteMutation.mutate({ id: futures.id })}
                          className="bg-destructive text-destructive-foreground"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
              {futures.status === "active" && (
                <Button variant="outline" onClick={() => unpublishMutation.mutate({ id: futures.id })}>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Unpublish
                </Button>
              )}
            </div>
          </div>
        </div>

        <Tabs defaultValue={initialTab}>
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="projections">Projections ({projections?.length || 0})</TabsTrigger>
            <TabsTrigger value="eois">
              EOIs
              {eois && eois.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {eois.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-6 mt-6">
            {/* Volume Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Volume Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <p className="text-sm text-muted-foreground">Total Projected</p>
                    <p className="text-2xl font-bold">{totalProjected.toLocaleString()}t</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <p className="text-sm text-blue-600">Contracted</p>
                    <p className="text-2xl font-bold text-blue-700">{totalContracted.toLocaleString()}t</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <p className="text-sm text-green-600">Available</p>
                    <p className="text-2xl font-bold text-green-700">{totalAvailable.toLocaleString()}t</p>
                  </div>
                </div>
                <div>
                  <Progress value={availablePercent} className="h-3" />
                  <p className="text-sm text-muted-foreground text-center mt-2">
                    {Math.round(availablePercent)}% available for contracting
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Details Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Crop & Location */}
              <Card>
                <CardHeader>
                  <CardTitle>Crop & Location</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      {CROP_TYPE_ICONS[futures.cropType] || <Sprout className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="font-medium">{CROP_TYPE_LABELS[futures.cropType]}</p>
                      {futures.cropVariety && (
                        <p className="text-sm text-muted-foreground">{futures.cropVariety}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {futures.state}
                      {futures.region && `, ${futures.region}`}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                    <div>
                      <p className="text-sm text-muted-foreground">Land Area</p>
                      <p className="font-medium">{parseFloat(futures.landAreaHectares).toLocaleString()} ha</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Land Status</p>
                      <p className="font-medium">{LAND_STATUS_LABELS[futures.landStatus || "owned"]}</p>
                    </div>
                  </div>

                  {futures.description && (
                    <div className="pt-2 border-t">
                      <p className="text-sm text-muted-foreground mb-1">Description</p>
                      <p className="text-sm">{futures.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Timeline & Pricing */}
              <Card>
                <CardHeader>
                  <CardTitle>Timeline & Pricing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {futures.projectionStartYear} - {futures.projectionEndYear} (
                      {futures.projectionEndYear - futures.projectionStartYear + 1} years)
                    </span>
                  </div>

                  {futures.firstHarvestYear && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">First Harvest: </span>
                      <span className="font-medium">{futures.firstHarvestYear}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Pricing</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Indicative Price</p>
                        <p className="font-medium">
                          {futures.indicativePricePerTonne
                            ? `$${parseFloat(futures.indicativePricePerTonne).toFixed(2)}/t`
                            : "Negotiable"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Annual Escalation</p>
                        <p className="font-medium">{futures.priceEscalationPercent || "2.5"}%</p>
                      </div>
                    </div>
                    {futures.pricingNotes && (
                      <p className="text-sm text-muted-foreground mt-2">{futures.pricingNotes}</p>
                    )}
                  </div>

                  {/* Quality Parameters */}
                  {(futures.expectedCarbonIntensity ||
                    futures.expectedMoistureContent ||
                    futures.expectedEnergyContent) && (
                    <div className="pt-2 border-t">
                      <p className="text-sm font-medium mb-2">Expected Quality</p>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        {futures.expectedCarbonIntensity && (
                          <div>
                            <p className="text-muted-foreground">Carbon</p>
                            <p className="font-medium">{futures.expectedCarbonIntensity} kg CO₂e/t</p>
                          </div>
                        )}
                        {futures.expectedMoistureContent && (
                          <div>
                            <p className="text-muted-foreground">Moisture</p>
                            <p className="font-medium">{futures.expectedMoistureContent}%</p>
                          </div>
                        )}
                        {futures.expectedEnergyContent && (
                          <div>
                            <p className="text-muted-foreground">Energy</p>
                            <p className="font-medium">{futures.expectedEnergyContent} GJ/t</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Timestamps */}
            <div className="text-sm text-muted-foreground">
              Created {formatDate(futures.createdAt)}
              {futures.publishedAt && ` • Published ${formatDate(futures.publishedAt)}`}
            </div>
          </TabsContent>

          {/* Projections Tab */}
          <TabsContent value="projections" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Yield Projections</CardTitle>
                  {futures.status === "draft" && (
                    <Link href={`/supplier/futures/create?edit=${futures.id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Projections
                      </Button>
                    </Link>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {projections && projections.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-3 font-medium">Year</th>
                          <th className="text-right py-2 px-3 font-medium">Projected (t)</th>
                          <th className="text-right py-2 px-3 font-medium">Contracted (t)</th>
                          <th className="text-center py-2 px-3 font-medium">Confidence</th>
                          <th className="text-left py-2 px-3 font-medium">Season</th>
                          <th className="text-left py-2 px-3 font-medium">Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projections.map((p: any, index: number) => (
                          <tr key={p.projectionYear} className={index % 2 === 0 ? "bg-muted/30" : ""}>
                            <td className="py-2 px-3 font-medium">{p.projectionYear}</td>
                            <td className="py-2 px-3 text-right font-mono">
                              {parseFloat(p.projectedTonnes).toLocaleString()}
                            </td>
                            <td className="py-2 px-3 text-right font-mono text-blue-600">
                              {parseFloat(p.contractedTonnes || "0").toLocaleString()}
                            </td>
                            <td className="py-2 px-3 text-center">
                              <Badge variant="outline">{p.confidencePercent || 80}%</Badge>
                            </td>
                            <td className="py-2 px-3 capitalize">{p.harvestSeason || "-"}</td>
                            <td className="py-2 px-3 text-sm text-muted-foreground">{p.notes || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="border-t-2">
                        <tr className="font-semibold">
                          <td className="py-2 px-3">Total</td>
                          <td className="py-2 px-3 text-right font-mono">{totalProjected.toLocaleString()}</td>
                          <td className="py-2 px-3 text-right font-mono text-blue-600">
                            {totalContracted.toLocaleString()}
                          </td>
                          <td colSpan={3}></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No yield projections added yet</p>
                    {futures.status === "draft" && (
                      <Link href={`/supplier/futures/create?edit=${futures.id}`}>
                        <Button className="mt-4">Add Projections</Button>
                      </Link>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* EOIs Tab */}
          <TabsContent value="eois" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Expressions of Interest
                </CardTitle>
                <CardDescription>Review and respond to buyer interest in your futures listing</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingEOIs ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-24 w-full" />
                    ))}
                  </div>
                ) : eois && eois.length > 0 ? (
                  <div className="space-y-4">
                    {eois.map((eoi: any) => (
                      <div
                        key={eoi.id}
                        className="border rounded-lg p-4 hover:border-primary/50 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold">{eoi.eoiReference}</span>
                              <Badge className={getEOIStatusColor(eoi.status)}>
                                {EOI_STATUS_LABELS[eoi.status]}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Submitted {formatDate(eoi.createdAt)}
                            </p>
                          </div>

                          {["pending", "under_review"].includes(eoi.status) && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openRespondDialog(eoi, "under_review")}
                              >
                                <Clock className="h-4 w-4 mr-1" />
                                Review
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-green-600 border-green-600 hover:bg-green-50"
                                onClick={() => openRespondDialog(eoi, "accepted")}
                              >
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 border-red-600 hover:bg-red-50"
                                onClick={() => openRespondDialog(eoi, "declined")}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Decline
                              </Button>
                            </div>
                          )}
                        </div>

                        {/* Buyer Info */}
                        {eoi.buyer && (
                          <div className="bg-muted/50 rounded-lg p-3 mb-3">
                            <div className="flex items-center gap-2 mb-2">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{eoi.buyer.companyName}</span>
                            </div>
                            <div className="flex gap-4 text-sm text-muted-foreground">
                              {eoi.buyer.contactEmail && (
                                <div className="flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  {eoi.buyer.contactEmail}
                                </div>
                              )}
                              {eoi.buyer.contactPhone && (
                                <div className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {eoi.buyer.contactPhone}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* EOI Details */}
                        <div className="grid md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Period</p>
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

                        {(eoi.deliveryLocation || eoi.additionalTerms) && (
                          <div className="mt-3 pt-3 border-t text-sm">
                            {eoi.deliveryLocation && (
                              <p>
                                <span className="text-muted-foreground">Delivery: </span>
                                {eoi.deliveryLocation}
                              </p>
                            )}
                            {eoi.additionalTerms && (
                              <p className="mt-1">
                                <span className="text-muted-foreground">Notes: </span>
                                {eoi.additionalTerms}
                              </p>
                            )}
                          </div>
                        )}

                        {eoi.supplierResponse && (
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-sm text-muted-foreground mb-1">Your Response:</p>
                            <p className="text-sm">{eoi.supplierResponse}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No expressions of interest yet</p>
                    {futures.status === "draft" && (
                      <p className="text-sm mt-2">Publish your listing to start receiving EOIs</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Respond Dialog */}
      <Dialog open={respondDialogOpen} onOpenChange={setRespondDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {respondAction === "accepted" && "Accept EOI"}
              {respondAction === "declined" && "Decline EOI"}
              {respondAction === "under_review" && "Mark as Under Review"}
            </DialogTitle>
            <DialogDescription>
              {selectedEOI && (
                <>
                  {respondAction === "accepted" &&
                    `You are accepting the EOI from ${selectedEOI.buyer?.companyName} for ${parseFloat(selectedEOI.totalVolumeTonnes).toLocaleString()}t.`}
                  {respondAction === "declined" &&
                    `You are declining the EOI from ${selectedEOI.buyer?.companyName}.`}
                  {respondAction === "under_review" &&
                    `Mark this EOI as under review to indicate you are evaluating it.`}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Response Message (optional)</label>
              <Textarea
                placeholder={
                  respondAction === "accepted"
                    ? "Thank you for your interest. We would like to proceed with contract negotiations..."
                    : respondAction === "declined"
                    ? "Thank you for your interest. Unfortunately..."
                    : "We are currently reviewing your EOI and will respond shortly..."
                }
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRespondDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleRespond}
              disabled={respondMutation.isPending}
              className={
                respondAction === "accepted"
                  ? "bg-green-600 hover:bg-green-700"
                  : respondAction === "declined"
                  ? "bg-red-600 hover:bg-red-700"
                  : ""
              }
            >
              {respondMutation.isPending ? "Sending..." : "Send Response"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
