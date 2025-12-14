import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AUSTRALIAN_STATES } from "@/const";
import { trpc } from "@/lib/trpc";
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  TrendingUp,
  DollarSign,
  TreeDeciduous,
  Sprout,
  Leaf,
  Eye,
  ChevronRight,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

const CROP_TYPE_OPTIONS = [
  { value: "bamboo", label: "Bamboo", icon: Sprout },
  { value: "rotation_forestry", label: "Rotation Forestry", icon: TreeDeciduous },
  { value: "eucalyptus", label: "Eucalyptus", icon: TreeDeciduous },
  { value: "poplar", label: "Poplar", icon: TreeDeciduous },
  { value: "willow", label: "Willow", icon: TreeDeciduous },
  { value: "miscanthus", label: "Miscanthus", icon: Leaf },
  { value: "switchgrass", label: "Switchgrass", icon: Leaf },
  { value: "arundo_donax", label: "Arundo Donax", icon: Leaf },
  { value: "hemp", label: "Industrial Hemp", icon: Leaf },
  { value: "other_perennial", label: "Other Perennial", icon: Sprout },
];

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

export default function FuturesMarketplace() {
  const [stateFilter, setStateFilter] = useState<string>("");
  const [cropTypeFilter, setCropTypeFilter] = useState<string>("");
  const [minVolumeFilter, setMinVolumeFilter] = useState<string>("");

  const { data: futures, isLoading, refetch } = trpc.futures.search.useQuery({
    state: stateFilter ? [stateFilter as any] : undefined,
    cropType: cropTypeFilter ? [cropTypeFilter as any] : undefined,
    minVolume: minVolumeFilter ? parseInt(minVolumeFilter) : undefined,
    limit: 50,
  });

  const clearFilters = () => {
    setStateFilter("");
    setCropTypeFilter("");
    setMinVolumeFilter("");
  };

  const hasFilters = stateFilter || cropTypeFilter || minVolumeFilter;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-900 to-green-700 text-white py-12">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">Futures Marketplace</h1>
            <p className="text-xl text-green-100 mb-6">
              Secure long-term supply of sustainable perennial biomass. Browse available futures
              listings and express your interest in multi-year contracts.
            </p>
            <div className="flex gap-4">
              <Badge variant="outline" className="border-green-400 text-green-100 py-1 px-3">
                <TreeDeciduous className="h-4 w-4 mr-1" />
                Perennial Crops
              </Badge>
              <Badge variant="outline" className="border-green-400 text-green-100 py-1 px-3">
                <Calendar className="h-4 w-4 mr-1" />
                Up to 25 Year Contracts
              </Badge>
              <Badge variant="outline" className="border-green-400 text-green-100 py-1 px-3">
                <TrendingUp className="h-4 w-4 mr-1" />
                Verified Suppliers
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Filters */}
        <Card className="mb-8">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filter Listings
              </CardTitle>
              {hasFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-1" />
                  Clear Filters
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>State</Label>
                <Select value={stateFilter} onValueChange={setStateFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All states" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All States</SelectItem>
                    {AUSTRALIAN_STATES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Crop Type</Label>
                <Select value={cropTypeFilter} onValueChange={setCropTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All crop types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Crop Types</SelectItem>
                    {CROP_TYPE_OPTIONS.map((crop) => (
                      <SelectItem key={crop.value} value={crop.value}>
                        <div className="flex items-center gap-2">
                          <crop.icon className="h-4 w-4" />
                          {crop.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Minimum Volume (tonnes)</Label>
                <Input
                  type="number"
                  placeholder="e.g., 1000"
                  value={minVolumeFilter}
                  onChange={(e) => setMinVolumeFilter(e.target.value)}
                  className="font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <Button onClick={() => refetch()} className="w-full">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-24 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : futures && futures.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                <strong>{futures.length}</strong> futures listing{futures.length !== 1 ? "s" : ""} found
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {futures.map((f: any) => {
                const totalProjected = parseFloat(f.totalProjectedTonnes || "0");
                const totalAvailable = parseFloat(f.totalAvailableTonnes || "0");
                const projectionYears = f.projectionEndYear - f.projectionStartYear + 1;

                return (
                  <Card key={f.id} className="hover:shadow-lg transition-shadow group">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                            {CROP_TYPE_ICONS[f.cropType] || <Sprout className="h-5 w-5" />}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{f.futuresId}</CardTitle>
                            <Badge variant="outline" className="text-xs">
                              {CROP_TYPE_LABELS[f.cropType]}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <CardDescription className="mt-2 line-clamp-2">{f.title}</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {f.state}
                            {f.region && `, ${f.region}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {f.projectionStartYear}-{f.projectionEndYear}
                          </span>
                        </div>
                      </div>

                      <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Available Volume</span>
                          <span className="font-semibold text-green-600">
                            {totalAvailable.toLocaleString()}t
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Total Projected</span>
                          <span className="font-medium">{totalProjected.toLocaleString()}t</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Contract Period</span>
                          <span className="font-medium">{projectionYears} years</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {f.indicativePricePerTonne
                              ? `$${parseFloat(f.indicativePricePerTonne).toFixed(0)}/t`
                              : "Negotiable"}
                          </span>
                        </div>
                        <Link href={`/futures/${f.id}`}>
                          <Button size="sm" variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground">
                            View Details
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Futures Listings Found</h3>
              <p className="text-muted-foreground mb-4">
                {hasFilters
                  ? "No listings match your current filters. Try adjusting your search criteria."
                  : "There are currently no active futures listings available."}
              </p>
              {hasFilters && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
