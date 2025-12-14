import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Sprout,
  MapPin,
  Calendar,
  TrendingUp,
  ArrowRight,
  Search,
  Filter,
  TreeDeciduous,
  Leaf,
  Building2,
} from "lucide-react";

export const metadata = {
  title: "Futures Marketplace - Long-term Supply",
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

const cropTypeIcons: Record<string, React.ReactNode> = {
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

export default async function BuyerFuturesPage() {
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

  // Get active futures with supplier info
  const { data: futures } = await supabase
    .from("feedstock_futures")
    .select(`
      *,
      suppliers (
        id,
        company_name,
        trading_name,
        state,
        verification_status
      ),
      futures_yield_projections (
        projection_year,
        projected_tonnes,
        contracted_tonnes
      )
    `)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  // Get buyer's existing EOIs
  const { data: myEOIs } = await supabase
    .from("futures_eoi")
    .select("futures_id, status")
    .eq("buyer_id", buyer.id);

  const eoiMap = new Map(myEOIs?.map(eoi => [eoi.futures_id, eoi.status]) || []);

  // Calculate stats
  const totalAvailableTonnes = futures?.reduce((sum, f) => sum + (f.total_available_tonnes || 0), 0) || 0;
  const uniqueSuppliers = new Set(futures?.map(f => f.supplier_id)).size;
  const uniqueStates = new Set(futures?.map(f => f.state)).size;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Futures Marketplace</h1>
        <p className="text-muted-foreground">
          Explore long-term feedstock supply opportunities from perennial crop growers
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Listings</CardTitle>
            <Sprout className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{futures?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Active futures opportunities
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Available</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAvailableTonnes.toLocaleString()}t</div>
            <p className="text-xs text-muted-foreground">
              Uncommitted supply
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suppliers</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueSuppliers}</div>
            <p className="text-xs text-muted-foreground">
              Offering futures
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Regions</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueStates}</div>
            <p className="text-xs text-muted-foreground">
              States covered
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Info Banner */}
      <Card className="bg-gradient-to-r from-blue-50 to-teal-50 border-blue-200">
        <CardContent className="py-4">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-700" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900">Secure Long-term Supply</h3>
              <p className="text-sm text-blue-700 mt-1">
                Browse projected yields from perennial crop growers and submit Expressions
                of Interest (EOI) to secure feedstock supply for up to 25 years. Build
                bankable supply chains with forward contracts.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title, supplier, or region..."
                  className="pl-10"
                />
              </div>
            </div>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Crop Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Crop Types</SelectItem>
                <SelectItem value="bamboo">Bamboo</SelectItem>
                <SelectItem value="rotation_forestry">Rotation Forestry</SelectItem>
                <SelectItem value="eucalyptus">Eucalyptus</SelectItem>
                <SelectItem value="miscanthus">Miscanthus</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                <SelectItem value="NSW">New South Wales</SelectItem>
                <SelectItem value="VIC">Victoria</SelectItem>
                <SelectItem value="QLD">Queensland</SelectItem>
                <SelectItem value="SA">South Australia</SelectItem>
                <SelectItem value="WA">Western Australia</SelectItem>
                <SelectItem value="TAS">Tasmania</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Futures Listings */}
      {futures && futures.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {futures.map((future) => {
            const availablePercent = future.total_projected_tonnes > 0
              ? (future.total_available_tonnes / future.total_projected_tonnes) * 100
              : 100;
            const hasEOI = eoiMap.has(future.id);
            const eoiStatus = eoiMap.get(future.id);
            const projectionYears = future.projection_end_year - future.projection_start_year + 1;

            return (
              <Card key={future.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="p-2 bg-green-100 rounded-lg">
                      {cropTypeIcons[future.crop_type] || <Sprout className="h-5 w-5" />}
                    </div>
                    <Badge variant="outline">
                      {cropTypeLabels[future.crop_type] || future.crop_type}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg mt-3">{future.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {future.description || `${future.land_area_hectares}ha ${cropTypeLabels[future.crop_type]} plantation`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  {/* Supplier */}
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span>{future.suppliers?.company_name || "Unknown Supplier"}</span>
                    {future.suppliers?.verification_status === "verified" && (
                      <Badge variant="secondary" className="text-xs">Verified</Badge>
                    )}
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{stateLabels[future.state] || future.state}{future.region ? `, ${future.region}` : ""}</span>
                  </div>

                  {/* Timeline */}
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {future.projection_start_year} - {future.projection_end_year}
                      <span className="text-muted-foreground"> ({projectionYears} years)</span>
                    </span>
                  </div>

                  {/* Volume Stats */}
                  <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Projected</span>
                      <span className="font-medium">{future.total_projected_tonnes?.toLocaleString() || 0}t</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Available</span>
                      <span className="font-medium text-green-600">
                        {future.total_available_tonnes?.toLocaleString() || 0}t
                      </span>
                    </div>
                    <Progress value={availablePercent} className="h-2" />
                    <div className="text-xs text-center text-muted-foreground">
                      {Math.round(availablePercent)}% available for contracting
                    </div>
                  </div>

                  {/* Price Indication */}
                  {future.indicative_price_per_tonne && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Indicative Price</span>
                      <span className="font-mono font-medium">
                        ${future.indicative_price_per_tonne}/t
                      </span>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="pt-0">
                  {hasEOI ? (
                    <div className="w-full">
                      <Badge
                        variant={eoiStatus === "accepted" ? "default" : "secondary"}
                        className="w-full justify-center py-2"
                      >
                        EOI {eoiStatus === "pending" ? "Submitted" : eoiStatus}
                      </Badge>
                    </div>
                  ) : (
                    <Button asChild className="w-full">
                      <Link href={`/buyer/futures/${future.id}`}>
                        View Details & Submit EOI
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Sprout className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium">No Futures Listings Available</h3>
            <p className="mt-1 text-sm text-muted-foreground text-center max-w-sm">
              There are currently no active futures listings from growers.
              Check back later for long-term supply opportunities.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
