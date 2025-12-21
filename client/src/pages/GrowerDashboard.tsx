import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Leaf,
  FileText,
  CheckCircle2,
  Circle,
  ChevronRight,
  Plus,
  Bell,
  Settings,
  Shield,
  Upload,
  History,
} from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

// Onboarding checklist items
const ONBOARDING_CHECKLIST = [
  { id: "account", label: "Create Account", completed: true },
  { id: "profile", label: "Complete Business Profile", completed: true },
  { id: "feedstock", label: "Register First Feedstock", completed: false },
  { id: "certification", label: "Upload Certifications", completed: false },
  { id: "verification", label: "Complete Verification", completed: false },
];

// Dashboard sections
const DASHBOARD_SECTIONS = [
  {
    id: "feedstocks",
    title: "My Feedstocks",
    description: "Manage your feedstock submissions and status",
    icon: Leaf,
    count: 0,
    action: "Add Feedstock",
    href: "/feedstock/create",
  },
  {
    id: "contracts",
    title: "Contracts",
    description: "Active and pending supply agreements",
    icon: FileText,
    count: 0,
    action: "View Contracts",
    href: "/supplier/agreements",
  },
  {
    id: "verification",
    title: "Verification Status",
    description: "Track your certification and compliance status",
    icon: Shield,
    count: null,
    status: "Pending",
    href: "/supplier/profile",
  },
  {
    id: "audit",
    title: "Audit Trail",
    description: "Cryptographic evidence chain for all activities",
    icon: History,
    count: 0,
    action: "View History",
    href: "/admin/audit-logs",
  },
];

export default function GrowerDashboard() {
  const completedSteps = ONBOARDING_CHECKLIST.filter(item => item.completed).length;
  const totalSteps = ONBOARDING_CHECKLIST.length;
  const progressPercent = (completedSteps / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10">
              <Leaf className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Grower Dashboard</h1>
              <p className="text-xs text-muted-foreground">Feedstock Registration & Certification</p>
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
        {/* Onboarding Checklist - Persistent until complete */}
        {progressPercent < 100 && (
          <Card className="mb-8 border-emerald-200 bg-emerald-50/50">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    Complete Your Setup
                  </CardTitle>
                  <CardDescription>
                    {completedSteps} of {totalSteps} steps complete
                  </CardDescription>
                </div>
                <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-300">
                  {Math.round(progressPercent)}% Complete
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={progressPercent} className="h-2 mb-4" />
              <div className="grid md:grid-cols-5 gap-3">
                {ONBOARDING_CHECKLIST.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      "flex items-center gap-2 p-2 rounded-lg text-sm",
                      item.completed ? "text-emerald-700" : "text-muted-foreground"
                    )}
                  >
                    {item.completed ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <Circle className="h-4 w-4" />
                    )}
                    <span className={item.completed ? "line-through" : ""}>{item.label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <Link href="/feedstock/create">
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Register First Feedstock
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dashboard Sections */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {DASHBOARD_SECTIONS.map((section) => (
            <Card key={section.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <section.icon className="h-5 w-5 text-emerald-600" />
                  </div>
                  {section.count !== null ? (
                    <Badge variant="outline">{section.count} items</Badge>
                  ) : (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                      {section.status}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-base mt-3">{section.title}</CardTitle>
                <CardDescription className="text-sm">{section.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={section.href}>
                  <Button variant="outline" className="w-full">
                    {section.action || "View Details"}
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State - Getting Started */}
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              Follow these steps to start selling your feedstock on the ABFI marketplace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  step: 1,
                  title: "Register Your Feedstock",
                  description: "Add details about your feedstock type, location, and estimated volumes",
                  icon: Leaf,
                  action: "Add Feedstock",
                  href: "/feedstock/create",
                },
                {
                  step: 2,
                  title: "Upload Certifications",
                  description: "Provide sustainability certifications and quality documentation",
                  icon: Upload,
                  action: "Upload Documents",
                  href: "/certificate/upload",
                },
                {
                  step: 3,
                  title: "Complete Verification",
                  description: "Our team will verify your information and activate your listing",
                  icon: Shield,
                  action: "Check Status",
                  href: "/supplier/profile",
                },
              ].map((item) => (
                <div key={item.step} className="text-center p-4">
                  <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <Badge variant="outline" className="mb-2">Step {item.step}</Badge>
                  <h3 className="font-medium mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                  <Link href={item.href}>
                    <Button variant="outline" size="sm">
                      {item.action}
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
