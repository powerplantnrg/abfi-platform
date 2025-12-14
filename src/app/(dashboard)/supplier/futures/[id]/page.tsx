import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sprout,
  MapPin,
  Calendar,
  TrendingUp,
  Building2,
  ArrowLeft,
  CheckCircle,
  Leaf,
  Edit,
  MoreHorizontal,
  Eye,
  FileCheck,
  Clock,
  XCircle,
  Users,
  DollarSign,
  Truck,
} from "lucide-react";

export const metadata = {
  title: "Futures Details",
};

const cropTypeLabels: Record<string, string> = {
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

const landStatusLabels: Record<string, string> = {
  owned: "Owned",
  leased: "Leased",
  under_negotiation: "Under Negotiation",
  planned_acquisition: "Planned Acquisition",
};

const statusLabels: Record<string, string> = {
  draft: "Draft",
  active: "Active",
  partially_contracted: "Partially Contracted",
  fully_contracted: "Fully Contracted",
  expired: "Expired",
  cancelled: "Cancelled",
};

const eoiStatusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  under_review: { label: "Under Review", color: "bg-blue-100 text-blue-800" },
  accepted: { label: "Accepted", color: "bg-green-100 text-green-800" },
  declined: { label: "Declined", color: "bg-red-100 text-red-800" },
  expired: { label: "Expired", color: "bg-gray-100 text-gray-800" },
  withdrawn: { label: "Withdrawn", color: "bg-gray-100 text-gray-800" },
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SupplierFuturesDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get supplier
  const { data: supplier } = await supabase
    .from("suppliers")
    .select("*")
    .eq("profile_id", user.id)
    .single();

  if (!supplier) {
    redirect("/supplier/settings");
  }

  // Get futures details
  const { data: futures, error } = await supabase
    .from("feedstock_futures")
    .select(`
      *,
      futures_yield_projections (
        id,
        projection_year,
        projected_tonnes,
        contracted_tonnes,
        available_tonnes,
        confidence_percent,
        harvest_season,
        notes
      )
    `)
    .eq("id", id)
    .eq("supplier_id", supplier.id)
    .single();

  if (error || !futures) {
    notFound();
  }

  // Get EOIs for this futures
  const { data: eois } = await supabase
    .from("futures_eoi")
    .select(`
      *,
      buyers (
        id,
        company_name,
        trading_name,
        state,
        city,
        verification_status
      )
    `)
    .eq("futures_id", id)
    .order("created_at", { ascending: false });

  const projections = futures.futures_yield_projections || [];
  const sortedProjections = [...projections].sort((a, b) => a.projection_year - b.projection_year);
  const availablePercent = futures.total_projected_tonnes > 0
    ? (futures.total_available_tonnes / futures.total_projected_tonnes) * 100
    : 100;
  const projectionYears = futures.projection_end_year - futures.projection_start_year + 1;

  const pendingEOIs = eois?.filter(e => e.status === "pending").length || 0;
  const acceptedEOIs = eois?.filter(e => e.status === "accepted").length || 0;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" asChild>
        <Link href="/supplier/futures">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Futures
        </Link>
      </Button>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <Sprout className="h-6 w-6 text-green-700" />
            </div>
            <Badge variant="outline" className="text-sm">
              {cropTypeLabels[futures.crop_type]}
            </Badge>
            <Badge
              variant={futures.status === "active" ? "default" : "secondary"}
              className="text-sm"
            >
              {statusLabels[futures.status]}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{futures.title}</h1>
          <p className="text-muted-foreground mt-1">
            {futures.futures_id}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/supplier/futures/${id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          {futures.status === "draft" && (
            <Button>Publish Listing</Button>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">Total Projected</div>
            </div>
            <div className="text-2xl font-bold mt-1">
              {futures.total_projected_tonnes?.toLocaleString() || 0}t
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">Contracted</div>
            </div>
            <div className="text-2xl font-bold mt-1">
              {futures.total_contracted_tonnes?.toLocaleString() || 0}t
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-600" />
              <div className="text-sm text-muted-foreground">Available</div>
            </div>
            <div className="text-2xl font-bold mt-1 text-green-600">
              {futures.total_available_tonnes?.toLocaleString() || 0}t
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">EOIs Received</div>
            </div>
            <div className="text-2xl font-bold mt-1">
              {eois?.length || 0}
              {pendingEOIs > 0 && (
                <span className="text-sm font-normal text-yellow-600 ml-2">
                  ({pendingEOIs} pending)
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* EOIs Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Expressions of Interest
              </CardTitle>
              <CardDescription>
                {eois?.length || 0} EOI(s) received from buyers
              </CardDescription>
            </CardHeader>
            <CardContent>
              {eois && eois.length > 0 ? (
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Buyer</TableHead>
                        <TableHead>Period</TableHead>
                        <TableHead className="text-right">Volume</TableHead>
                        <TableHead className="text-right">Offered Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {eois.map((eoi) => (
                        <TableRow key={eoi.id}>
                          <TableCell>
                            <div className="font-medium">
                              {eoi.buyers?.company_name || "Unknown"}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {eoi.eoi_reference}
                            </div>
                          </TableCell>
                          <TableCell>
                            {eoi.interest_start_year} - {eoi.interest_end_year}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="font-mono">
                              {eoi.total_volume_tonnes?.toLocaleString()}t
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {eoi.annual_volume_tonnes?.toLocaleString()}t/yr
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {eoi.offered_price_per_tonne
                              ? `$${eoi.offered_price_per_tonne}`
                              : "Negotiable"}
                          </TableCell>
                          <TableCell>
                            <Badge className={eoiStatusLabels[eoi.status]?.color || ""}>
                              {eoiStatusLabels[eoi.status]?.label || eoi.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                {eoi.status === "pending" && (
                                  <>
                                    <DropdownMenuItem className="text-green-600">
                                      <CheckCircle className="mr-2 h-4 w-4" />
                                      Accept EOI
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600">
                                      <XCircle className="mr-2 h-4 w-4" />
                                      Decline EOI
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No expressions of interest yet</p>
                  <p className="text-sm">
                    Buyers will be able to submit EOIs once your listing is active
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Yield Projections */}
          <Card>
            <CardHeader>
              <CardTitle>Yield Projections</CardTitle>
              <CardDescription>
                Year-by-year breakdown from {futures.projection_start_year} to {futures.projection_end_year}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Year</TableHead>
                      <TableHead className="text-right">Projected (t)</TableHead>
                      <TableHead className="text-right">Contracted (t)</TableHead>
                      <TableHead className="text-right">Available (t)</TableHead>
                      <TableHead className="text-center">Confidence</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedProjections.map((projection) => (
                      <TableRow key={projection.id}>
                        <TableCell>
                          <div className="font-medium">{projection.projection_year}</div>
                          {projection.projection_year < futures.first_harvest_year && (
                            <Badge variant="outline" className="text-xs mt-1">
                              Establishment
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {projection.projected_tonnes?.toLocaleString() || 0}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {projection.contracted_tonnes?.toLocaleString() || 0}
                        </TableCell>
                        <TableCell className="text-right font-mono text-green-600">
                          {projection.available_tonnes?.toLocaleString() || 0}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary">
                            {projection.confidence_percent}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Listing Details */}
          <Card>
            <CardHeader>
              <CardTitle>Listing Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Crop Type</div>
                <div className="font-medium">{cropTypeLabels[futures.crop_type]}</div>
                {futures.crop_variety && (
                  <div className="text-sm text-muted-foreground">{futures.crop_variety}</div>
                )}
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <div className="font-medium">{futures.state}{futures.region ? `, ${futures.region}` : ""}</div>
                  <div className="text-sm text-muted-foreground">
                    {futures.land_area_hectares?.toLocaleString()} hectares • {landStatusLabels[futures.land_status]}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <div className="font-medium">
                    {futures.projection_start_year} - {futures.projection_end_year}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {projectionYears} year projection
                  </div>
                </div>
              </div>
              {futures.indicative_price_per_tonne && (
                <div className="flex items-start gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <div className="font-medium font-mono">
                      ${futures.indicative_price_per_tonne}/t
                    </div>
                    <div className="text-sm text-muted-foreground">
                      +{futures.price_escalation_percent}% annual escalation
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Availability */}
          <Card>
            <CardHeader>
              <CardTitle>Availability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={availablePercent} className="h-3" />
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(availablePercent)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Available</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {Math.round(100 - availablePercent)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Contracted</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          {futures.status === "active" && (
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Projections
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Clock className="mr-2 h-4 w-4" />
                  Extend Timeline
                </Button>
                <Button variant="outline" className="w-full justify-start text-destructive">
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancel Listing
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
