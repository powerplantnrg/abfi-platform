import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Factory,
  Search,
  FileText,
  Clock,
  ChevronRight,
  Bell,
  Settings,
  Filter,
  MapPin,
  Leaf,
  Shield,
  BarChart3,
} from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

// Dashboard navigation
const DASHBOARD_NAV = [
  {
    id: "registry",
    title: "Registry Explorer",
    description: "Browse verified feedstock suppliers",
    icon: Search,
    badge: "500+ suppliers",
    href: "/browse",
  },
  {
    id: "confidence",
    title: "Supply Confidence",
    description: "Request supply assessments",
    icon: Shield,
    badge: "New",
    href: "/procurement-scenarios",
  },
  {
    id: "contracts",
    title: "Active Contracts",
    description: "Manage supply agreements",
    icon: FileText,
    count: 0,
    href: "/supply-agreements",
  },
  {
    id: "policy",
    title: "Policy Timeline",
    description: "Regulatory changes & mandates",
    icon: Clock,
    badge: "Updated",
    href: "/policy-carbon",
  },
  {
    id: "prices",
    title: "Price Signals",
    description: "Feedstock market intelligence",
    icon: BarChart3,
    badge: "Live",
    href: "/feedstock-prices",
  },
];

// Sample registry preview
const REGISTRY_PREVIEW = [
  { name: "Queensland Canola Collective", type: "Canola", location: "QLD", rating: "AA+", volume: "15,000 t/yr" },
  { name: "Southern Tallow Processing", type: "Tallow", location: "VIC", rating: "A", volume: "8,500 t/yr" },
  { name: "NSW UCO Network", type: "UCO", location: "NSW", rating: "AA", volume: "12,000 t/yr" },
];

export default function DeveloperDashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10">
              <Factory className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Developer Dashboard</h1>
              <p className="text-xs text-muted-foreground">Supply Sourcing & Contracts</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Settings">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
        {/* Quick Search */}
        <Card className="mb-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Find Verified Suppliers</CardTitle>
            <CardDescription>Search the registry by feedstock type, location, or certification</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by feedstock, location, or supplier name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Link href="/browse">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Search Registry
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {DASHBOARD_NAV.map((item) => (
            <Link key={item.id} href={item.href}>
              <Card className="h-full cursor-pointer hover:shadow-md transition-all hover:border-blue-500/50">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-blue-600" />
                    </div>
                    {item.badge && (
                      <Badge variant="outline" className="text-xs">
                        {item.badge}
                      </Badge>
                    )}
                    {item.count !== undefined && (
                      <Badge variant="outline">{item.count} active</Badge>
                    )}
                  </div>
                  <CardTitle className="text-base mt-3">{item.title}</CardTitle>
                  <CardDescription className="text-xs">{item.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center text-sm text-blue-600 font-medium">
                    Open
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Registry Preview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Registry Preview</CardTitle>
                <CardDescription>Top-rated verified suppliers</CardDescription>
              </div>
              <Link href="/browse">
                <Button variant="outline" size="sm">
                  View All
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {REGISTRY_PREVIEW.map((supplier, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <Leaf className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{supplier.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="outline" className="text-xs">{supplier.type}</Badge>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {supplier.location}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={cn(
                      "mb-1",
                      supplier.rating.startsWith("AA") && "bg-emerald-100 text-emerald-800",
                      supplier.rating === "A" && "bg-blue-100 text-blue-800"
                    )}>
                      {supplier.rating}
                    </Badge>
                    <p className="text-xs text-muted-foreground">{supplier.volume}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
