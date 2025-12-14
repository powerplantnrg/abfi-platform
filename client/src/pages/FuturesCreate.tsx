import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { AUSTRALIAN_STATES } from "@/const";
import { trpc } from "@/lib/trpc";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Leaf,
  MapPin,
  Calendar,
  TrendingUp,
  DollarSign,
  FileText,
  TreeDeciduous,
  Sprout,
  Plus,
  Trash2,
  Save,
  Send,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Step = 1 | 2 | 3 | 4 | 5 | 6;

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

const LAND_STATUS_OPTIONS = [
  { value: "owned", label: "Owned" },
  { value: "leased", label: "Leased" },
  { value: "under_negotiation", label: "Under Negotiation" },
  { value: "planned_acquisition", label: "Planned Acquisition" },
];

const HARVEST_SEASON_OPTIONS = [
  { value: "summer", label: "Summer (Dec-Feb)" },
  { value: "autumn", label: "Autumn (Mar-May)" },
  { value: "winter", label: "Winter (Jun-Aug)" },
  { value: "spring", label: "Spring (Sep-Nov)" },
  { value: "year_round", label: "Year-round" },
];

interface YieldProjection {
  projectionYear: number;
  projectedTonnes: string;
  confidencePercent: string;
  harvestSeason: string;
  notes: string;
}

export default function FuturesCreate() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const editId = searchParams.get("edit");

  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1: Crop Details
  const [cropType, setCropType] = useState("");
  const [cropVariety, setCropVariety] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Step 2: Location
  const [state, setState] = useState("");
  const [region, setRegion] = useState("");
  const [landAreaHectares, setLandAreaHectares] = useState("");
  const [landStatus, setLandStatus] = useState("owned");

  // Step 3: Timeline
  const [projectionStartYear, setProjectionStartYear] = useState(new Date().getFullYear().toString());
  const [projectionEndYear, setProjectionEndYear] = useState((new Date().getFullYear() + 10).toString());
  const [plantingDate, setPlantingDate] = useState("");
  const [firstHarvestYear, setFirstHarvestYear] = useState("");

  // Step 4: Yield Projections
  const [projections, setProjections] = useState<YieldProjection[]>([]);

  // Step 5: Pricing & Quality
  const [indicativePricePerTonne, setIndicativePricePerTonne] = useState("");
  const [priceEscalationPercent, setPriceEscalationPercent] = useState("2.5");
  const [pricingNotes, setPricingNotes] = useState("");
  const [expectedCarbonIntensity, setExpectedCarbonIntensity] = useState("");
  const [expectedMoistureContent, setExpectedMoistureContent] = useState("");
  const [expectedEnergyContent, setExpectedEnergyContent] = useState("");

  // Fetch existing futures if editing
  const { data: existingFutures, isLoading: loadingExisting } = trpc.futures.getById.useQuery(
    { id: parseInt(editId || "0") },
    { enabled: !!editId }
  );

  // Load existing data when editing
  useEffect(() => {
    if (existingFutures) {
      setCropType(existingFutures.cropType);
      setCropVariety(existingFutures.cropVariety || "");
      setTitle(existingFutures.title);
      setDescription(existingFutures.description || "");
      setState(existingFutures.state);
      setRegion(existingFutures.region || "");
      setLandAreaHectares(existingFutures.landAreaHectares);
      setLandStatus(existingFutures.landStatus || "owned");
      setProjectionStartYear(existingFutures.projectionStartYear.toString());
      setProjectionEndYear(existingFutures.projectionEndYear.toString());
      setFirstHarvestYear(existingFutures.firstHarvestYear?.toString() || "");
      setIndicativePricePerTonne(existingFutures.indicativePricePerTonne || "");
      setPriceEscalationPercent(existingFutures.priceEscalationPercent || "2.5");
      setPricingNotes(existingFutures.pricingNotes || "");
      setExpectedCarbonIntensity(existingFutures.expectedCarbonIntensity || "");
      setExpectedMoistureContent(existingFutures.expectedMoistureContent || "");
      setExpectedEnergyContent(existingFutures.expectedEnergyContent || "");

      if (existingFutures.projections) {
        setProjections(
          existingFutures.projections.map((p: any) => ({
            projectionYear: p.projectionYear,
            projectedTonnes: p.projectedTonnes || "",
            confidencePercent: p.confidencePercent?.toString() || "80",
            harvestSeason: p.harvestSeason || "",
            notes: p.notes || "",
          }))
        );
      }
    }
  }, [existingFutures]);

  // Generate projections based on timeline
  const generateProjections = () => {
    const startYear = parseInt(projectionStartYear);
    const endYear = parseInt(projectionEndYear);
    if (isNaN(startYear) || isNaN(endYear) || endYear < startYear) return;

    const newProjections: YieldProjection[] = [];
    for (let year = startYear; year <= endYear; year++) {
      const existing = projections.find((p) => p.projectionYear === year);
      newProjections.push(
        existing || {
          projectionYear: year,
          projectedTonnes: "",
          confidencePercent: "80",
          harvestSeason: "",
          notes: "",
        }
      );
    }
    setProjections(newProjections);
  };

  // Calculate totals
  const totalProjectedTonnes = useMemo(() => {
    return projections.reduce((sum, p) => sum + (parseFloat(p.projectedTonnes) || 0), 0);
  }, [projections]);

  const createMutation = trpc.futures.create.useMutation({
    onSuccess: (data) => {
      toast.success("Futures listing created successfully!");
      setLocation(`/supplier/futures/${data.id}`);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create futures listing");
      setIsSubmitting(false);
    },
  });

  const updateMutation = trpc.futures.update.useMutation({
    onSuccess: () => {
      toast.success("Futures listing updated successfully!");
      setLocation(`/supplier/futures/${editId}`);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update futures listing");
      setIsSubmitting(false);
    },
  });

  const saveProjectionsMutation = trpc.futures.saveProjections.useMutation();

  const handleSubmit = async (publishNow: boolean) => {
    setIsSubmitting(true);

    const formData = {
      cropType: cropType as any,
      cropVariety: cropVariety || undefined,
      title,
      description: description || undefined,
      state: state as any,
      region: region || undefined,
      landAreaHectares: parseFloat(landAreaHectares),
      landStatus: landStatus as any,
      projectionStartYear: parseInt(projectionStartYear),
      projectionEndYear: parseInt(projectionEndYear),
      firstHarvestYear: firstHarvestYear ? parseInt(firstHarvestYear) : undefined,
      indicativePricePerTonne: indicativePricePerTonne ? parseFloat(indicativePricePerTonne) : undefined,
      priceEscalationPercent: priceEscalationPercent ? parseFloat(priceEscalationPercent) : undefined,
      pricingNotes: pricingNotes || undefined,
      expectedCarbonIntensity: expectedCarbonIntensity ? parseFloat(expectedCarbonIntensity) : undefined,
      expectedMoistureContent: expectedMoistureContent ? parseFloat(expectedMoistureContent) : undefined,
      expectedEnergyContent: expectedEnergyContent ? parseFloat(expectedEnergyContent) : undefined,
      status: publishNow ? ("active" as const) : ("draft" as const),
      projections: projections
        .filter((p) => p.projectedTonnes)
        .map((p) => ({
          projectionYear: p.projectionYear,
          projectedTonnes: parseFloat(p.projectedTonnes),
          confidencePercent: p.confidencePercent ? parseInt(p.confidencePercent) : undefined,
          harvestSeason: p.harvestSeason || undefined,
          notes: p.notes || undefined,
        })),
    };

    if (editId) {
      await updateMutation.mutateAsync({
        id: parseInt(editId),
        title: formData.title,
        description: formData.description,
        region: formData.region,
        landAreaHectares: formData.landAreaHectares,
        landStatus: formData.landStatus,
        indicativePricePerTonne: formData.indicativePricePerTonne,
        priceEscalationPercent: formData.priceEscalationPercent,
        pricingNotes: formData.pricingNotes,
        expectedCarbonIntensity: formData.expectedCarbonIntensity,
        expectedMoistureContent: formData.expectedMoistureContent,
        expectedEnergyContent: formData.expectedEnergyContent,
      });
      // Save projections separately for updates
      await saveProjectionsMutation.mutateAsync({
        futuresId: parseInt(editId),
        projections: formData.projections,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const updateProjection = (index: number, field: keyof YieldProjection, value: string) => {
    const updated = [...projections];
    updated[index] = { ...updated[index], [field]: value };
    setProjections(updated);
  };

  // Validation
  const canProceedStep1 = cropType && title;
  const canProceedStep2 = state && landAreaHectares;
  const canProceedStep3 = projectionStartYear && projectionEndYear;
  const canProceedStep4 = projections.some((p) => parseFloat(p.projectedTonnes) > 0);
  const canProceedStep5 = true; // All optional

  const stepIcons = [Leaf, MapPin, Calendar, TrendingUp, DollarSign, FileText];
  const stepLabels = ["Crop Details", "Location", "Timeline", "Projections", "Pricing", "Review"];

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

  if (editId && loadingExisting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Skeleton className="h-8 w-64 mx-auto mb-4" />
          <Skeleton className="h-4 w-48 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Leaf className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xl font-bold text-foreground">ABFI</span>
            </div>
          </Link>
          <Link href="/supplier/futures">
            <Button variant="ghost" leftIcon={<ArrowLeft className="h-4 w-4" />}>
              Back to Futures
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <Badge variant="outline" className="mb-4">
            <TreeDeciduous className="h-3.5 w-3.5 mr-1.5" />
            {editId ? "Edit Futures Listing" : "New Futures Listing"}
          </Badge>
          <h1 className="heading-1 text-foreground mb-2">
            {editId ? "Edit Futures Listing" : "Create Futures Listing"}
          </h1>
          <p className="text-muted-foreground body-lg max-w-xl mx-auto">
            Project your long-term perennial crop yields and connect with buyers seeking future supply
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4, 5, 6].map((step) => {
              const StepIcon = stepIcons[step - 1];
              return (
                <div key={step} className="flex items-center flex-1">
                  <button
                    onClick={() => step < currentStep && setCurrentStep(step as Step)}
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-xl border-2 transition-all",
                      currentStep >= step
                        ? "bg-primary border-primary text-primary-foreground shadow-md"
                        : "bg-card border-border text-muted-foreground",
                      step < currentStep && "cursor-pointer hover:opacity-80"
                    )}
                    disabled={step >= currentStep}
                  >
                    {currentStep > step ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <StepIcon className="h-4 w-4" />
                    )}
                  </button>
                  {step < 6 && (
                    <div
                      className={cn(
                        "flex-1 h-1 mx-2 rounded-full transition-colors",
                        currentStep > step ? "bg-primary" : "bg-border"
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-3 px-1">
            {stepLabels.map((label, i) => (
              <span
                key={label}
                className={cn(
                  "text-xs font-medium transition-colors text-center w-14",
                  currentStep >= i + 1 ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Step 1: Crop Details */}
        {currentStep === 1 && (
          <Card variant="elevated">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Leaf className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Crop Details</CardTitle>
                  <CardDescription>Select the perennial crop type and provide details</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="cropType">Crop Type *</Label>
                <Select value={cropType} onValueChange={setCropType}>
                  <SelectTrigger id="cropType">
                    <SelectValue placeholder="Select crop type" />
                  </SelectTrigger>
                  <SelectContent>
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
                <Label htmlFor="cropVariety">Variety / Cultivar</Label>
                <Input
                  id="cropVariety"
                  placeholder="e.g., Moso, Madake, Clone 433"
                  value={cropVariety}
                  onChange={(e) => setCropVariety(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Listing Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., 500ha Eucalyptus Plantation - QLD"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your plantation, growing conditions, sustainability practices..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  onClick={() => setCurrentStep(2)}
                  disabled={!canProceedStep1}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Next Step
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Location */}
        {currentStep === 2 && (
          <Card variant="elevated">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Location & Land</CardTitle>
                  <CardDescription>Where is your plantation located?</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Select value={state} onValueChange={setState}>
                    <SelectTrigger id="state">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {AUSTRALIAN_STATES.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="region">Region</Label>
                  <Input
                    id="region"
                    placeholder="e.g., Darling Downs, Murray-Darling"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="landAreaHectares">Land Area (hectares) *</Label>
                  <Input
                    id="landAreaHectares"
                    type="number"
                    placeholder="e.g., 500"
                    value={landAreaHectares}
                    onChange={(e) => setLandAreaHectares(e.target.value)}
                    className="font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="landStatus">Land Status</Label>
                  <Select value={landStatus} onValueChange={setLandStatus}>
                    <SelectTrigger id="landStatus">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {LAND_STATUS_OPTIONS.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-between gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setCurrentStep(1)} leftIcon={<ArrowLeft className="h-4 w-4" />}>
                  Previous
                </Button>
                <Button
                  onClick={() => setCurrentStep(3)}
                  disabled={!canProceedStep2}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Next Step
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Timeline */}
        {currentStep === 3 && (
          <Card variant="elevated">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Projection Timeline</CardTitle>
                  <CardDescription>Define the timeframe for your yield projections</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="projectionStartYear">Start Year *</Label>
                  <Select value={projectionStartYear} onValueChange={setProjectionStartYear}>
                    <SelectTrigger id="projectionStartYear">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectionEndYear">End Year *</Label>
                  <Select value={projectionEndYear} onValueChange={setProjectionEndYear}>
                    <SelectTrigger id="projectionEndYear">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 30 }, (_, i) => parseInt(projectionStartYear || "2025") + i).map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="plantingDate">Planting Date</Label>
                  <Input
                    id="plantingDate"
                    type="date"
                    value={plantingDate}
                    onChange={(e) => setPlantingDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="firstHarvestYear">First Harvest Year</Label>
                  <Select value={firstHarvestYear} onValueChange={setFirstHarvestYear}>
                    <SelectTrigger id="firstHarvestYear">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 30 }, (_, i) => parseInt(projectionStartYear || "2025") + i).map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  Projection period: <strong>{parseInt(projectionEndYear) - parseInt(projectionStartYear) + 1} years</strong>
                  {" "}({projectionStartYear} - {projectionEndYear})
                </p>
              </div>

              <div className="flex justify-between gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setCurrentStep(2)} leftIcon={<ArrowLeft className="h-4 w-4" />}>
                  Previous
                </Button>
                <Button
                  onClick={() => {
                    generateProjections();
                    setCurrentStep(4);
                  }}
                  disabled={!canProceedStep3}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Next Step
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Yield Projections */}
        {currentStep === 4 && (
          <Card variant="elevated">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Yield Projections</CardTitle>
                  <CardDescription>Enter projected yields for each year</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="bg-muted/50 rounded-lg p-4 flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Total Projected Volume</p>
                  <p className="text-2xl font-bold">{totalProjectedTonnes.toLocaleString()} tonnes</p>
                </div>
                <Button variant="outline" size="sm" onClick={generateProjections}>
                  <Plus className="h-4 w-4 mr-2" />
                  Regenerate Years
                </Button>
              </div>

              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {projections.map((projection, index) => (
                  <div key={projection.projectionYear} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{projection.projectionYear}</h4>
                      <Badge variant="outline">Year {index + 1}</Badge>
                    </div>
                    <div className="grid md:grid-cols-4 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Projected Tonnes *</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={projection.projectedTonnes}
                          onChange={(e) => updateProjection(index, "projectedTonnes", e.target.value)}
                          className="font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Confidence %</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          placeholder="80"
                          value={projection.confidencePercent}
                          onChange={(e) => updateProjection(index, "confidencePercent", e.target.value)}
                          className="font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Harvest Season</Label>
                        <Select
                          value={projection.harvestSeason}
                          onValueChange={(v) => updateProjection(index, "harvestSeason", v)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {HARVEST_SEASON_OPTIONS.map((season) => (
                              <SelectItem key={season.value} value={season.value}>
                                {season.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Notes</Label>
                        <Input
                          placeholder="Optional notes"
                          value={projection.notes}
                          onChange={(e) => updateProjection(index, "notes", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setCurrentStep(3)} leftIcon={<ArrowLeft className="h-4 w-4" />}>
                  Previous
                </Button>
                <Button
                  onClick={() => setCurrentStep(5)}
                  disabled={!canProceedStep4}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Next Step
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Pricing & Quality */}
        {currentStep === 5 && (
          <Card variant="elevated">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Pricing & Quality Expectations</CardTitle>
                  <CardDescription>Set indicative pricing and quality parameters</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="indicativePricePerTonne">Indicative Price ($/tonne)</Label>
                  <Input
                    id="indicativePricePerTonne"
                    type="number"
                    placeholder="e.g., 120"
                    value={indicativePricePerTonne}
                    onChange={(e) => setIndicativePricePerTonne(e.target.value)}
                    className="font-mono"
                  />
                  <p className="text-xs text-muted-foreground">Leave blank for "negotiable"</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priceEscalationPercent">Annual Price Escalation (%)</Label>
                  <Input
                    id="priceEscalationPercent"
                    type="number"
                    step="0.1"
                    placeholder="2.5"
                    value={priceEscalationPercent}
                    onChange={(e) => setPriceEscalationPercent(e.target.value)}
                    className="font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pricingNotes">Pricing Notes</Label>
                <Textarea
                  id="pricingNotes"
                  placeholder="Any special pricing considerations, volume discounts, etc."
                  value={pricingNotes}
                  onChange={(e) => setPricingNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-4">Expected Quality Parameters</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expectedCarbonIntensity">Carbon Intensity (kg CO₂e/t)</Label>
                    <Input
                      id="expectedCarbonIntensity"
                      type="number"
                      placeholder="e.g., 15"
                      value={expectedCarbonIntensity}
                      onChange={(e) => setExpectedCarbonIntensity(e.target.value)}
                      className="font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expectedMoistureContent">Moisture Content (%)</Label>
                    <Input
                      id="expectedMoistureContent"
                      type="number"
                      placeholder="e.g., 12"
                      value={expectedMoistureContent}
                      onChange={(e) => setExpectedMoistureContent(e.target.value)}
                      className="font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expectedEnergyContent">Energy Content (GJ/t)</Label>
                    <Input
                      id="expectedEnergyContent"
                      type="number"
                      placeholder="e.g., 18"
                      value={expectedEnergyContent}
                      onChange={(e) => setExpectedEnergyContent(e.target.value)}
                      className="font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setCurrentStep(4)} leftIcon={<ArrowLeft className="h-4 w-4" />}>
                  Previous
                </Button>
                <Button onClick={() => setCurrentStep(6)} rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Review
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 6: Review & Submit */}
        {currentStep === 6 && (
          <Card variant="elevated">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Review & Submit</CardTitle>
                  <CardDescription>Review your futures listing before submitting</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Summary Cards */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold text-sm text-muted-foreground">CROP</h4>
                  <p className="font-medium">
                    {CROP_TYPE_OPTIONS.find((c) => c.value === cropType)?.label}
                    {cropVariety && ` - ${cropVariety}`}
                  </p>
                  <p className="text-sm text-muted-foreground">{title}</p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold text-sm text-muted-foreground">LOCATION</h4>
                  <p className="font-medium">
                    {AUSTRALIAN_STATES.find((s) => s.value === state)?.label}
                    {region && `, ${region}`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {parseFloat(landAreaHectares).toLocaleString()} ha ({LAND_STATUS_OPTIONS.find((l) => l.value === landStatus)?.label})
                  </p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold text-sm text-muted-foreground">TIMELINE</h4>
                  <p className="font-medium">
                    {projectionStartYear} - {projectionEndYear}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {parseInt(projectionEndYear) - parseInt(projectionStartYear) + 1} years
                    {firstHarvestYear && `, first harvest ${firstHarvestYear}`}
                  </p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold text-sm text-muted-foreground">VOLUME</h4>
                  <p className="font-medium">{totalProjectedTonnes.toLocaleString()} tonnes total</p>
                  <p className="text-sm text-muted-foreground">
                    ~{Math.round(totalProjectedTonnes / (parseInt(projectionEndYear) - parseInt(projectionStartYear) + 1)).toLocaleString()}{" "}
                    tonnes/year average
                  </p>
                </div>
              </div>

              {/* Pricing Summary */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Pricing</h4>
                <p>
                  {indicativePricePerTonne
                    ? `$${parseFloat(indicativePricePerTonne).toFixed(2)}/tonne`
                    : "Negotiable"}
                  {priceEscalationPercent && ` (+${priceEscalationPercent}% p.a.)`}
                </p>
                {pricingNotes && <p className="text-sm text-muted-foreground mt-1">{pricingNotes}</p>}
              </div>

              {/* Quality Summary */}
              {(expectedCarbonIntensity || expectedMoistureContent || expectedEnergyContent) && (
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Expected Quality</h4>
                  <div className="flex gap-6 text-sm">
                    {expectedCarbonIntensity && (
                      <div>
                        <span className="text-muted-foreground">Carbon: </span>
                        <span className="font-medium">{expectedCarbonIntensity} kg CO₂e/t</span>
                      </div>
                    )}
                    {expectedMoistureContent && (
                      <div>
                        <span className="text-muted-foreground">Moisture: </span>
                        <span className="font-medium">{expectedMoistureContent}%</span>
                      </div>
                    )}
                    {expectedEnergyContent && (
                      <div>
                        <span className="text-muted-foreground">Energy: </span>
                        <span className="font-medium">{expectedEnergyContent} GJ/t</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setCurrentStep(5)} leftIcon={<ArrowLeft className="h-4 w-4" />}>
                  Previous
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleSubmit(false)}
                    disabled={isSubmitting}
                    leftIcon={<Save className="h-4 w-4" />}
                  >
                    {isSubmitting ? "Saving..." : "Save as Draft"}
                  </Button>
                  <Button
                    onClick={() => handleSubmit(true)}
                    disabled={isSubmitting}
                    leftIcon={<Send className="h-4 w-4" />}
                  >
                    {isSubmitting ? "Publishing..." : "Publish Now"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
