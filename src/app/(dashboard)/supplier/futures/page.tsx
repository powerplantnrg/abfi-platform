import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Sprout,
  CheckCircle,
  Clock,
  AlertCircle,
  FileCheck,
  TrendingUp,
  Calendar,
  Users,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

export const metadata = {
  title: "Futures - Long-term Supply Projections",
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

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          <CheckCircle className="mr-1 h-3 w-3" />
          Active
        </Badge>
      );
    case "partially_contracted":
      return (
        <Badge className="bg-blue-100 text-blue-800">
          <FileCheck className="mr-1 h-3 w-3" />
          Partially Contracted
        </Badge>
      );
    case "fully_contracted":
      return (
        <Badge className="bg-purple-100 text-purple-800">
          <CheckCircle className="mr-1 h-3 w-3" />
          Fully Contracted
        </Badge>
      );
    case "draft":
      return (
        <Badge variant="outline">
          <Edit className="mr-1 h-3 w-3" />
          Draft
        </Badge>
      );
    case "expired":
      return (
        <Badge variant="secondary">
          <Clock className="mr-1 h-3 w-3" />
          Expired
        </Badge>
      );
    case "cancelled":
      return (
        <Badge variant="destructive">
          <AlertCircle className="mr-1 h-3 w-3" />
          Cancelled
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default async function SupplierFuturesPage() {
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

  // Get futures with EOI counts
  const { data: futures } = await supabase
    .from("feedstock_futures")
    .select(`
      *,
      futures_eoi(count),
      futures_yield_projections(projection_year, projected_tonnes, contracted_tonnes)
    `)
    .eq("supplier_id", supplier.id)
    .order("created_at", { ascending: false });

  // Calculate stats
  const activeFutures = futures?.filter(f => f.status === "active").length || 0;
  const totalProjectedTonnes = futures?.reduce((sum, f) => sum + (f.total_projected_tonnes || 0), 0) || 0;
  const totalContractedTonnes = futures?.reduce((sum, f) => sum + (f.total_contracted_tonnes || 0), 0) || 0;
  const pendingEOIs = futures?.reduce((sum, f) => {
    const eoiCount = Array.isArray(f.futures_eoi) ? f.futures_eoi.length : 0;
    return sum + eoiCount;
  }, 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Futures</h1>
          <p className="text-muted-foreground">
            Advertise long-term supply projections for perennial crops and seek buyer interest
          </p>
        </div>
        <Button asChild>
          <Link href="/supplier/futures/new">
            <Plus className="mr-2 h-4 w-4" />
            New Futures Listing
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
            <Sprout className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeFutures}</div>
            <p className="text-xs text-muted-foreground">
              Perennial crop projections
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projected</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProjectedTonnes.toLocaleString()}t</div>
            <p className="text-xs text-muted-foreground">
              Over all projection periods
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contracted</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalContractedTonnes.toLocaleString()}t</div>
            <p className="text-xs text-muted-foreground">
              {totalProjectedTonnes > 0
                ? `${Math.round((totalContractedTonnes / totalProjectedTonnes) * 100)}% of projected`
                : "No projections yet"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending EOIs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingEOIs}</div>
            <p className="text-xs text-muted-foreground">
              Expressions of interest
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Info Banner */}
      <Card className="bg-gradient-to-r from-green-50 to-teal-50 border-green-200">
        <CardContent className="py-4">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Sprout className="h-6 w-6 text-green-700" />
            </div>
            <div>
              <h3 className="font-semibold text-green-900">Long-term Supply Planning</h3>
              <p className="text-sm text-green-700 mt-1">
                Create projections for perennial crops like bamboo, rotation forestry, and other
                long-cycle feedstocks. Buyers can express interest in securing future supply
                for up to 25 years, helping you plan cultivation with confidence.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Futures List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Futures Listings</CardTitle>
          <CardDescription>
            {futures?.length || 0} projection(s) created
          </CardDescription>
        </CardHeader>
        <CardContent>
          {futures && futures.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Listing</TableHead>
                  <TableHead>Crop Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead className="text-right">Projected (t)</TableHead>
                  <TableHead>Availability</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {futures.map((future) => {
                  const availablePercent = future.total_projected_tonnes > 0
                    ? ((future.total_projected_tonnes - future.total_contracted_tonnes) / future.total_projected_tonnes) * 100
                    : 100;
                  const eoiCount = Array.isArray(future.futures_eoi) ? future.futures_eoi.length : 0;

                  return (
                    <TableRow key={future.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{future.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {future.futures_id}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {cropTypeLabels[future.crop_type] || future.crop_type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {future.state}, {future.region || ""}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          {future.projection_start_year} - {future.projection_end_year}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {future.total_projected_tonnes?.toLocaleString() || 0}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Progress value={availablePercent} className="h-2" />
                          <div className="text-xs text-muted-foreground">
                            {Math.round(availablePercent)}% available
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {getStatusBadge(future.status)}
                          {eoiCount > 0 && (
                            <span className="text-xs text-blue-600">
                              {eoiCount} EOI{eoiCount > 1 ? "s" : ""}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/supplier/futures/${future.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/supplier/futures/${future.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            {future.status === "draft" && (
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <Sprout className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">No futures listings yet</h3>
              <p className="mt-1 text-sm text-muted-foreground text-center max-w-sm">
                Create your first long-term supply projection. Advertise projected yields
                for perennial crops and attract buyer interest for forward contracts.
              </p>
              <Button asChild className="mt-6">
                <Link href="/supplier/futures/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Futures Listing
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
