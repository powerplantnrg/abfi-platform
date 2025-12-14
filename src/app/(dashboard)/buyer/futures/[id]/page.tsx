import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { EOIForm } from "./eoi-form";
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
  Sprout,
  MapPin,
  Calendar,
  TrendingUp,
  Building2,
  ArrowLeft,
  CheckCircle,
  Leaf,
  TreeDeciduous,
  Ruler,
  DollarSign,
  Zap,
  Droplets,
} from "lucide-react";
import Link from "next/link";

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

const stateLabels: Record<string, string> = {
  NSW: "New South Wales",
  VIC: "Victoria",
  QLD: "Queensland",
  SA: "South Australia",
  WA: "Western Australia",
  TAS: "Tasmania",
  NT: "Northern Territory",
  ACT: "Australian Capital Territory",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function FuturesDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get buyer
  const { data: buyer } = await supabase
    .from("buyers")
    .select("*")
    .eq("profile_id", user.id)
    .single();

  if (!buyer) {
    redirect("/buyer/settings");
  }

  // Get futures details with projections and supplier info
  const { data: futures, error } = await supabase
    .from("feedstock_futures")
    .select(`
      *,
      suppliers (
        id,
        company_name,
        trading_name,
        state,
        city,
        verification_status,
        description
      ),
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
    .eq("status", "active")
    .single();

  if (error || !futures) {
    notFound();
  }

  // Check if buyer already has an EOI
  const { data: existingEOI } = await supabase
    .from("futures_eoi")
    .select("*")
    .eq("futures_id", id)
    .eq("buyer_id", buyer.id)
    .single();

  const projections = futures.futures_yield_projections || [];
  const sortedProjections = [...projections].sort((a, b) => a.projection_year - b.projection_year);
  const availablePercent = futures.total_projected_tonnes > 0
    ? (futures.total_available_tonnes / futures.total_projected_tonnes) * 100
    : 100;
  const projectionYears = futures.projection_end_year - futures.projection_start_year + 1;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" asChild>
        <Link href="/buyer/futures">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Futures Marketplace
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
            {futures.crop_variety && (
              <Badge variant="secondary" className="text-sm">
                {futures.crop_variety}
              </Badge>
            )}
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{futures.title}</h1>
          <p className="text-muted-foreground mt-1">
            {futures.futures_id} • Listed by {futures.suppliers?.company_name}
          </p>
        </div>
        {existingEOI && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="py-3 px-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-medium text-blue-900">EOI Submitted</div>
                  <div className="text-sm text-blue-700">
                    Status: {existingEOI.status}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          {futures.description && (
            <Card>
              <CardHeader>
                <CardTitle>About This Listing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {futures.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Location & Land Details */}
          <Card>
            <CardHeader>
              <CardTitle>Location & Land</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium">Location</div>
                    <div className="text-sm text-muted-foreground">
                      {stateLabels[futures.state]}{futures.region ? `, ${futures.region}` : ""}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Ruler className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium">Land Area</div>
                    <div className="text-sm text-muted-foreground">
                      {futures.land_area_hectares?.toLocaleString()} hectares
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium">Land Status</div>
                    <div className="text-sm text-muted-foreground">
                      {landStatusLabels[futures.land_status]}
                    </div>
                  </div>
                </div>
                {futures.rotation_cycle_years && (
                  <div className="flex items-start gap-3">
                    <TreeDeciduous className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">Rotation Cycle</div>
                      <div className="text-sm text-muted-foreground">
                        {futures.rotation_cycle_years} years
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Year-by-Year Projections */}
          <Card>
            <CardHeader>
              <CardTitle>Yield Projections</CardTitle>
              <CardDescription>
                Year-by-year projected yields from {futures.projection_start_year} to {futures.projection_end_year}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Year</TableHead>
                      <TableHead className="text-right">Projected (t)</TableHead>
                      <TableHead className="text-right">Available (t)</TableHead>
                      <TableHead className="text-center">Confidence</TableHead>
                      <TableHead>Season</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedProjections.map((projection) => (
                      <TableRow key={projection.id}>
                        <TableCell>
                          <div className="font-medium">{projection.projection_year}</div>
                          {projection.projection_year < futures.first_harvest_year && (
                            <Badge variant="outline" className="text-xs mt-1">
                              <Leaf className="h-3 w-3 mr-1" />
                              Establishment
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {projection.projected_tonnes?.toLocaleString() || 0}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="font-mono text-green-600">
                            {projection.available_tonnes?.toLocaleString() || 0}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={projection.confidence_percent >= 80 ? "default" : "secondary"}
                          >
                            {projection.confidence_percent}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {projection.harvest_season}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Quality Expectations */}
          {(futures.expected_carbon_intensity || futures.expected_moisture_content || futures.expected_energy_content_mj_kg) && (
            <Card>
              <CardHeader>
                <CardTitle>Expected Quality Parameters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-3">
                  {futures.expected_carbon_intensity && (
                    <div className="flex items-start gap-3">
                      <Leaf className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <div className="font-medium">Carbon Intensity</div>
                        <div className="text-2xl font-mono">
                          {futures.expected_carbon_intensity}
                          <span className="text-sm text-muted-foreground ml-1">gCO₂e/MJ</span>
                        </div>
                      </div>
                    </div>
                  )}
                  {futures.expected_moisture_content && (
                    <div className="flex items-start gap-3">
                      <Droplets className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <div className="font-medium">Moisture Content</div>
                        <div className="text-2xl font-mono">
                          {futures.expected_moisture_content}
                          <span className="text-sm text-muted-foreground ml-1">%</span>
                        </div>
                      </div>
                    </div>
                  )}
                  {futures.expected_energy_content_mj_kg && (
                    <div className="flex items-start gap-3">
                      <Zap className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <div className="font-medium">Energy Content</div>
                        <div className="text-2xl font-mono">
                          {futures.expected_energy_content_mj_kg}
                          <span className="text-sm text-muted-foreground ml-1">MJ/kg</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {futures.quality_notes && (
                  <p className="text-sm text-muted-foreground mt-4 pt-4 border-t">
                    {futures.quality_notes}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle>Supply Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Projection Period</div>
                <div className="text-2xl font-bold">
                  {projectionYears} years
                </div>
                <div className="text-sm text-muted-foreground">
                  {futures.projection_start_year} - {futures.projection_end_year}
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="text-sm text-muted-foreground">Total Projected</div>
                <div className="text-2xl font-bold font-mono">
                  {futures.total_projected_tonnes?.toLocaleString() || 0}t
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Available</span>
                  <span className="font-medium text-green-600">
                    {futures.total_available_tonnes?.toLocaleString() || 0}t
                  </span>
                </div>
                <Progress value={availablePercent} className="h-3" />
                <div className="text-xs text-center text-muted-foreground mt-1">
                  {Math.round(availablePercent)}% available
                </div>
              </div>
              {futures.indicative_price_per_tonne && (
                <div className="border-t pt-4">
                  <div className="text-sm text-muted-foreground">Indicative Price</div>
                  <div className="text-2xl font-bold font-mono flex items-center">
                    <DollarSign className="h-5 w-5" />
                    {futures.indicative_price_per_tonne}/t
                  </div>
                  {futures.price_escalation_percent && (
                    <div className="text-sm text-muted-foreground">
                      +{futures.price_escalation_percent}% annual escalation
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Supplier Card */}
          <Card>
            <CardHeader>
              <CardTitle>Supplier</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-lg">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium">{futures.suppliers?.company_name}</div>
                  {futures.suppliers?.trading_name && (
                    <div className="text-sm text-muted-foreground">
                      t/a {futures.suppliers.trading_name}
                    </div>
                  )}
                </div>
              </div>
              {futures.suppliers?.verification_status === "verified" && (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Verified Supplier
                </Badge>
              )}
              <div className="text-sm text-muted-foreground">
                {futures.suppliers?.city}, {futures.suppliers?.state}
              </div>
            </CardContent>
          </Card>

          {/* EOI Form or Status */}
          {existingEOI ? (
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-900">Your EOI</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-blue-700">Reference</span>
                  <span className="font-mono text-blue-900">{existingEOI.eoi_reference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Status</span>
                  <Badge variant={existingEOI.status === "accepted" ? "default" : "secondary"}>
                    {existingEOI.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Volume Requested</span>
                  <span className="font-mono text-blue-900">
                    {existingEOI.total_volume_tonnes?.toLocaleString()}t
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Period</span>
                  <span className="text-blue-900">
                    {existingEOI.interest_start_year} - {existingEOI.interest_end_year}
                  </span>
                </div>
              </CardContent>
            </Card>
          ) : (
            <EOIForm
              futuresId={futures.id}
              buyerId={buyer.id}
              startYear={futures.projection_start_year}
              endYear={futures.projection_end_year}
              maxAvailableTonnes={futures.total_available_tonnes || 0}
            />
          )}
        </div>
      </div>
    </div>
  );
}
