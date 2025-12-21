import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Eye,
  TrendingUp,
  BarChart3,
  FileText,
  Bell,
  Settings,
  ChevronRight,
  Zap,
  Target,
  AlertTriangle,
  Lock,
} from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

// Dashboard navigation items
const DASHBOARD_NAV = [
  {
    id: "stealth",
    label: "Stealth Discovery",
    icon: Eye,
    description: "Surface unannounced projects",
    badge: "67 signals",
    href: "/stealth-discovery",
  },
  {
    id: "sentiment",
    label: "Lending Sentiment",
    icon: TrendingUp,
    description: "AI-powered sentiment analysis",
    badge: "+8 index",
    href: "/lending-sentiment",
  },
  {
    id: "prices",
    label: "Feedstock Prices",
    icon: BarChart3,
    description: "Real-time price intelligence",
    badge: "Live",
    href: "/feedstock-prices",
  },
  {
    id: "policy",
    label: "Policy & Carbon",
    icon: FileText,
    description: "Regulatory timeline & carbon tracking",
    badge: "Updated",
    href: "/policy-carbon",
  },
];

// Quick stats
const QUICK_STATS = [
  { label: "Entities Tracked", value: "247", change: "+12", trend: "up" },
  { label: "High Score Alerts", value: "42", change: "+5", trend: "up" },
  { label: "Active Signals", value: "67", change: "+23", trend: "up" },
  { label: "Sentiment Index", value: "+32", change: "+8", trend: "up" },
];

export default function FinanceDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Finance Dashboard</h1>
              <p className="text-xs text-muted-foreground">Risk & Intelligence Suite</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
              <Lock className="h-3 w-3 mr-1" />
              Free Access
            </Badge>
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Settings">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {QUICK_STATS.map((stat, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      stat.trend === "up" && "bg-emerald-50 text-emerald-700 border-emerald-200",
                      stat.trend === "down" && "bg-red-50 text-red-700 border-red-200"
                    )}
                  >
                    {stat.change}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Navigation Cards */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Intelligence Tools</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {DASHBOARD_NAV.map((item) => (
              <Link key={item.id} href={item.href}>
                <Card className="h-full cursor-pointer hover:shadow-md transition-all hover:border-primary/50">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {item.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-base mt-3">{item.label}</CardTitle>
                    <CardDescription className="text-xs">{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center text-sm text-primary font-medium">
                      Open Tool
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Tabbed Content Area */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="api">API Access</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Recent Signals */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-amber-500" />
                    Recent Signals
                  </CardTitle>
                  <CardDescription>Latest intelligence from Stealth Discovery</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { title: "Advanced HVO Patent Filed", type: "Patent", entity: "Southern Oil Refining", score: 87.5 },
                      { title: "SAF Refinery Development Approved", type: "Permit", entity: "Jet Zero Australia", score: 82.3 },
                      { title: "ARENA Grant - $15M Biofuel Demo", type: "Grant", entity: "BioEnergy Holdings", score: 78.9 },
                    ].map((signal, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Target className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{signal.title}</p>
                            <p className="text-xs text-muted-foreground">{signal.entity}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">{signal.type}</Badge>
                          <p className="text-xs text-muted-foreground mt-1">Score: {signal.score}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link href="/stealth-discovery">
                    <Button variant="outline" className="w-full mt-4">
                      View All Signals
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/stealth-discovery">
                    <Button variant="outline" className="w-full justify-start">
                      <Eye className="h-4 w-4 mr-2" />
                      Browse Stealth Entities
                    </Button>
                  </Link>
                  <Link href="/lending-sentiment">
                    <Button variant="outline" className="w-full justify-start">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Check Sentiment Index
                    </Button>
                  </Link>
                  <Link href="/feedstock-prices">
                    <Button variant="outline" className="w-full justify-start">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Price Charts
                    </Button>
                  </Link>
                  <Link href="/stress-testing">
                    <Button variant="outline" className="w-full justify-start">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Run Stress Test
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="alerts">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Alerts</CardTitle>
                <CardDescription>Configure alerts for entity score changes, new signals, and sentiment shifts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No alerts configured yet</p>
                  <Button variant="outline" className="mt-4">
                    Configure Alerts
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio">
            <Card>
              <CardHeader>
                <CardTitle>Tracked Portfolio</CardTitle>
                <CardDescription>Entities you're monitoring for investment decisions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No entities in portfolio yet</p>
                  <Link href="/stealth-discovery">
                    <Button variant="outline" className="mt-4">
                      Discover Entities
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api">
            <Card>
              <CardHeader>
                <CardTitle>Risk Scoring API</CardTitle>
                <CardDescription>Programmatic access to risk scores and intelligence data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-900 rounded-lg p-4 text-white font-mono text-sm mb-4">
                  <p className="text-slate-400">// Example API Response</p>
                  <pre className="mt-2">{`{
  "entity_id": "ENT-2024-0042",
  "current_score": 87.5,
  "signal_count": 12,
  "risk_level": "low",
  "confidence": 0.95
}`}</pre>
                </div>
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  Coming Q2 2025
                </Badge>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
