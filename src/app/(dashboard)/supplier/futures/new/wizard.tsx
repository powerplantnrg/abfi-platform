"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
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
  ArrowLeft,
  ArrowRight,
  Check,
  Sprout,
  MapPin,
  Calendar,
  TrendingUp,
  Save,
  Loader2,
  Info,
  Leaf,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FuturesWizardProps {
  supplierId: string;
}

interface YearProjection {
  year: number;
  projected_tonnes: number;
  confidence_percent: number;
  harvest_season: string;
  notes: string;
}

const CROP_TYPES = [
  { value: "bamboo", label: "Bamboo", description: "Fast-growing, annual harvests after 3-5 years" },
  { value: "rotation_forestry", label: "Rotation Forestry", description: "Managed timber with 7-25 year cycles" },
  { value: "eucalyptus", label: "Eucalyptus", description: "Short rotation coppice, 3-7 year cycles" },
  { value: "poplar", label: "Poplar", description: "Short rotation coppice, 3-5 year cycles" },
  { value: "willow", label: "Willow", description: "Short rotation coppice, 2-4 year cycles" },
  { value: "miscanthus", label: "Miscanthus", description: "Perennial grass, annual harvests after establishment" },
  { value: "switchgrass", label: "Switchgrass", description: "Perennial grass, annual harvests" },
  { value: "arundo_donax", label: "Arundo Donax (Giant Reed)", description: "High-yield perennial, annual harvests" },
  { value: "hemp", label: "Industrial Hemp", description: "Annual crop, can be perennial planting system" },
  { value: "other_perennial", label: "Other Perennial", description: "Other long-cycle feedstock" },
];

const AUSTRALIAN_STATES = [
  { value: "NSW", label: "New South Wales" },
  { value: "VIC", label: "Victoria" },
  { value: "QLD", label: "Queensland" },
  { value: "SA", label: "South Australia" },
  { value: "WA", label: "Western Australia" },
  { value: "TAS", label: "Tasmania" },
  { value: "NT", label: "Northern Territory" },
  { value: "ACT", label: "Australian Capital Territory" },
];

const LAND_STATUS = [
  { value: "owned", label: "Owned" },
  { value: "leased", label: "Leased" },
  { value: "under_negotiation", label: "Under Negotiation" },
  { value: "planned_acquisition", label: "Planned Acquisition" },
];

const HARVEST_SEASONS = [
  { value: "Q1", label: "Q1 (Jan-Mar)" },
  { value: "Q2", label: "Q2 (Apr-Jun)" },
  { value: "Q3", label: "Q3 (Jul-Sep)" },
  { value: "Q4", label: "Q4 (Oct-Dec)" },
  { value: "H1", label: "H1 (Jan-Jun)" },
  { value: "H2", label: "H2 (Jul-Dec)" },
  { value: "annual", label: "Annual" },
];

const STEPS = [
  { id: 1, title: "Crop Details", icon: Sprout },
  { id: 2, title: "Location", icon: MapPin },
  { id: 3, title: "Timeline", icon: Calendar },
  { id: 4, title: "Yield Projections", icon: TrendingUp },
  { id: 5, title: "Review & Publish", icon: Check },
];

export function FuturesWizard({ supplierId }: FuturesWizardProps) {
  const router = useRouter();
  const supabase = createClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    // Crop Details
    crop_type: "",
    crop_variety: "",
    title: "",
    description: "",
    // Location
    state: "",
    region: "",
    land_area_hectares: "",
    land_status: "owned",
    // Timeline
    projection_start_year: new Date().getFullYear() + 1,
    projection_end_year: new Date().getFullYear() + 10,
    planting_date: "",
    first_harvest_year: new Date().getFullYear() + 3,
    rotation_cycle_years: "",
    // Pricing
    indicative_price_per_tonne: "",
    price_escalation_percent: "2.5",
    price_notes: "",
    // Quality
    expected_carbon_intensity: "",
    expected_moisture_content: "",
    expected_energy_content_mj_kg: "",
    quality_notes: "",
    // Certifications
    planned_certifications: [] as string[],
    sustainability_commitments: "",
  });

  // Year projections
  const [yearProjections, setYearProjections] = useState<YearProjection[]>([]);

  const currentYear = new Date().getFullYear();
  const maxProjectionYears = 25;

  // Generate year projections when timeline changes
  const generateYearProjections = () => {
    const startYear = formData.projection_start_year;
    const endYear = formData.projection_end_year;
    const firstHarvest = formData.first_harvest_year;

    const projections: YearProjection[] = [];
    for (let year = startYear; year <= endYear; year++) {
      const existingProjection = yearProjections.find(p => p.year === year);
      projections.push(
        existingProjection || {
          year,
          projected_tonnes: year < firstHarvest ? 0 : 0,
          confidence_percent: year < firstHarvest ? 100 : 80,
          harvest_season: "annual",
          notes: year < firstHarvest ? "Establishment period" : "",
        }
      );
    }
    setYearProjections(projections);
  };

  const updateProjection = (year: number, field: keyof YearProjection, value: string | number) => {
    setYearProjections(prev =>
      prev.map(p =>
        p.year === year ? { ...p, [field]: value } : p
      )
    );
  };

  const handleNext = () => {
    if (currentStep === 3) {
      generateYearProjections();
    }
    setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (asDraft: boolean = false) => {
    setIsSubmitting(true);

    try {
      // Create the futures listing
      const { data: futures, error: futuresError } = await supabase
        .from("feedstock_futures")
        .insert({
          supplier_id: supplierId,
          crop_type: formData.crop_type,
          crop_variety: formData.crop_variety || null,
          feedstock_category: "lignocellulosic",
          title: formData.title,
          description: formData.description || null,
          state: formData.state,
          region: formData.region || null,
          land_area_hectares: parseFloat(formData.land_area_hectares) || 0,
          land_status: formData.land_status,
          projection_start_year: formData.projection_start_year,
          projection_end_year: formData.projection_end_year,
          planting_date: formData.planting_date || null,
          first_harvest_year: formData.first_harvest_year,
          rotation_cycle_years: formData.rotation_cycle_years ? parseInt(formData.rotation_cycle_years) : null,
          indicative_price_per_tonne: formData.indicative_price_per_tonne ? parseFloat(formData.indicative_price_per_tonne) : null,
          price_escalation_percent: parseFloat(formData.price_escalation_percent) || 2.5,
          price_notes: formData.price_notes || null,
          expected_carbon_intensity: formData.expected_carbon_intensity ? parseFloat(formData.expected_carbon_intensity) : null,
          expected_moisture_content: formData.expected_moisture_content ? parseFloat(formData.expected_moisture_content) : null,
          expected_energy_content_mj_kg: formData.expected_energy_content_mj_kg ? parseFloat(formData.expected_energy_content_mj_kg) : null,
          quality_notes: formData.quality_notes || null,
          planned_certifications: formData.planned_certifications.length > 0 ? formData.planned_certifications : null,
          sustainability_commitments: formData.sustainability_commitments || null,
          status: asDraft ? "draft" : "active",
          published_at: asDraft ? null : new Date().toISOString(),
        })
        .select()
        .single();

      if (futuresError) throw futuresError;

      // Insert year projections
      const projectionsToInsert = yearProjections
        .filter(p => p.projected_tonnes > 0 || p.year < formData.first_harvest_year)
        .map(p => ({
          futures_id: futures.id,
          projection_year: p.year,
          projected_tonnes: p.projected_tonnes,
          confidence_percent: p.confidence_percent,
          harvest_season: p.harvest_season,
          notes: p.notes || null,
        }));

      if (projectionsToInsert.length > 0) {
        const { error: projectionsError } = await supabase
          .from("futures_yield_projections")
          .insert(projectionsToInsert);

        if (projectionsError) throw projectionsError;
      }

      toast.success(
        asDraft
          ? "Futures listing saved as draft"
          : "Futures listing published successfully!"
      );
      router.push("/supplier/futures");
      router.refresh();
    } catch (error) {
      console.error("Error creating futures:", error);
      toast.error("Failed to create futures listing. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalProjectedTonnes = yearProjections.reduce((sum, p) => sum + p.projected_tonnes, 0);
  const projectionYears = formData.projection_end_year - formData.projection_start_year + 1;

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors",
                currentStep >= step.id
                  ? "bg-primary border-primary text-primary-foreground"
                  : "border-muted-foreground/30 text-muted-foreground"
              )}
            >
              {currentStep > step.id ? (
                <Check className="h-5 w-5" />
              ) : (
                <step.icon className="h-5 w-5" />
              )}
            </div>
            <span
              className={cn(
                "ml-2 text-sm font-medium hidden md:block",
                currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {step.title}
            </span>
            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  "w-12 md:w-24 h-0.5 mx-2 md:mx-4",
                  currentStep > step.id ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{STEPS[currentStep - 1].title}</CardTitle>
          <CardDescription>
            {currentStep === 1 && "Select the type of perennial crop and provide basic details"}
            {currentStep === 2 && "Specify the location and land details for cultivation"}
            {currentStep === 3 && "Define the projection timeline and harvest schedule"}
            {currentStep === 4 && "Enter year-by-year yield projections"}
            {currentStep === 5 && "Review your listing and publish or save as draft"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Step 1: Crop Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <Label>Crop Type *</Label>
                <div className="grid gap-3 md:grid-cols-2">
                  {CROP_TYPES.map(crop => (
                    <div
                      key={crop.value}
                      className={cn(
                        "border rounded-lg p-4 cursor-pointer transition-all hover:border-primary/50",
                        formData.crop_type === crop.value && "border-primary bg-primary/5"
                      )}
                      onClick={() => setFormData(prev => ({ ...prev, crop_type: crop.value }))}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "w-4 h-4 mt-0.5 rounded-full border-2",
                          formData.crop_type === crop.value
                            ? "border-primary bg-primary"
                            : "border-muted-foreground/30"
                        )} />
                        <div>
                          <div className="font-medium">{crop.label}</div>
                          <div className="text-sm text-muted-foreground">{crop.description}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="crop_variety">Variety/Cultivar (Optional)</Label>
                  <Input
                    id="crop_variety"
                    value={formData.crop_variety}
                    onChange={e => setFormData(prev => ({ ...prev, crop_variety: e.target.value }))}
                    placeholder="e.g., Moso Bamboo, E. globulus"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Listing Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., 500ha Bamboo Plantation - Hunter Valley"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your project, cultivation plans, and expected output..."
                  rows={4}
                />
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Select
                    value={formData.state}
                    onValueChange={value => setFormData(prev => ({ ...prev, state: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {AUSTRALIAN_STATES.map(state => (
                        <SelectItem key={state.value} value={state.value}>
                          {state.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Region</Label>
                  <Input
                    id="region"
                    value={formData.region}
                    onChange={e => setFormData(prev => ({ ...prev, region: e.target.value }))}
                    placeholder="e.g., Hunter Valley, Gippsland"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="land_area_hectares">Land Area (hectares) *</Label>
                  <Input
                    id="land_area_hectares"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.land_area_hectares}
                    onChange={e => setFormData(prev => ({ ...prev, land_area_hectares: e.target.value }))}
                    placeholder="e.g., 500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="land_status">Land Status *</Label>
                  <Select
                    value={formData.land_status}
                    onValueChange={value => setFormData(prev => ({ ...prev, land_status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {LAND_STATUS.map(status => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium text-foreground">Land Status Guide</p>
                    <ul className="mt-2 space-y-1">
                      <li><strong>Owned:</strong> You own the land outright</li>
                      <li><strong>Leased:</strong> Long-term lease agreement in place</li>
                      <li><strong>Under Negotiation:</strong> Actively negotiating lease/purchase</li>
                      <li><strong>Planned Acquisition:</strong> Future acquisition planned</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Timeline */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Projection Start Year *</Label>
                  <Select
                    value={formData.projection_start_year.toString()}
                    onValueChange={value => setFormData(prev => ({
                      ...prev,
                      projection_start_year: parseInt(value),
                      first_harvest_year: Math.max(prev.first_harvest_year, parseInt(value))
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 10 }, (_, i) => currentYear + i).map(year => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Projection End Year *</Label>
                  <Select
                    value={formData.projection_end_year.toString()}
                    onValueChange={value => setFormData(prev => ({
                      ...prev,
                      projection_end_year: parseInt(value)
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from(
                        { length: maxProjectionYears },
                        (_, i) => formData.projection_start_year + i + 1
                      ).map(year => (
                        <SelectItem key={year} value={year.toString()}>
                          {year} ({year - formData.projection_start_year} years)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="planting_date">Planting Date (Optional)</Label>
                  <Input
                    id="planting_date"
                    type="date"
                    value={formData.planting_date}
                    onChange={e => setFormData(prev => ({ ...prev, planting_date: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>First Harvest Year *</Label>
                  <Select
                    value={formData.first_harvest_year.toString()}
                    onValueChange={value => setFormData(prev => ({
                      ...prev,
                      first_harvest_year: parseInt(value)
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from(
                        { length: formData.projection_end_year - formData.projection_start_year + 1 },
                        (_, i) => formData.projection_start_year + i
                      ).map(year => (
                        <SelectItem key={year} value={year.toString()}>
                          {year} (Year {year - formData.projection_start_year + 1})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="rotation_cycle_years">Rotation Cycle (years)</Label>
                  <Input
                    id="rotation_cycle_years"
                    type="number"
                    min="1"
                    max="25"
                    value={formData.rotation_cycle_years}
                    onChange={e => setFormData(prev => ({ ...prev, rotation_cycle_years: e.target.value }))}
                    placeholder="e.g., 7 for rotation forestry"
                  />
                  <p className="text-sm text-muted-foreground">
                    For rotation forestry or coppicing cycles
                  </p>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-900">Projection Summary</p>
                    <p className="text-sm text-green-700 mt-1">
                      {projectionYears} year projection from {formData.projection_start_year} to {formData.projection_end_year}.
                      First harvest expected in {formData.first_harvest_year}.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Yield Projections */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900">Enter Projected Yields</p>
                    <p className="text-sm text-blue-700 mt-1">
                      Provide your best estimate for annual yield. Buyers will see these
                      projections when expressing interest. Adjust confidence levels based
                      on certainty.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Year</TableHead>
                      <TableHead>Projected Yield (tonnes)</TableHead>
                      <TableHead className="w-[150px]">Confidence</TableHead>
                      <TableHead className="w-[150px]">Harvest Season</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {yearProjections.map(projection => (
                      <TableRow key={projection.year}>
                        <TableCell>
                          <div className="font-medium">{projection.year}</div>
                          {projection.year < formData.first_harvest_year && (
                            <Badge variant="outline" className="text-xs mt-1">
                              <Leaf className="h-3 w-3 mr-1" />
                              Establishment
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            step="100"
                            value={projection.projected_tonnes || ""}
                            onChange={e => updateProjection(
                              projection.year,
                              "projected_tonnes",
                              parseFloat(e.target.value) || 0
                            )}
                            placeholder={projection.year < formData.first_harvest_year ? "0" : "Enter yield"}
                            disabled={projection.year < formData.first_harvest_year}
                            className="w-32"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Slider
                              value={[projection.confidence_percent]}
                              onValueChange={([value]) => updateProjection(
                                projection.year,
                                "confidence_percent",
                                value
                              )}
                              min={0}
                              max={100}
                              step={5}
                              className="w-20"
                              disabled={projection.year < formData.first_harvest_year}
                            />
                            <span className="text-sm text-muted-foreground w-12">
                              {projection.confidence_percent}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={projection.harvest_season}
                            onValueChange={value => updateProjection(
                              projection.year,
                              "harvest_season",
                              value
                            )}
                            disabled={projection.year < formData.first_harvest_year}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {HARVEST_SEASONS.map(season => (
                                <SelectItem key={season.value} value={season.value}>
                                  {season.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            value={projection.notes}
                            onChange={e => updateProjection(
                              projection.year,
                              "notes",
                              e.target.value
                            )}
                            placeholder="Optional notes"
                            className="w-full"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground">Total Projected Volume</div>
                    <div className="text-3xl font-bold">{totalProjectedTonnes.toLocaleString()} t</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Over {projectionYears} years
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground">Average Annual Yield</div>
                    <div className="text-3xl font-bold">
                      {Math.round(totalProjectedTonnes / (formData.projection_end_year - formData.first_harvest_year + 1)).toLocaleString()} t
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      After establishment period
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Crop Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type</span>
                      <Badge variant="outline">
                        {CROP_TYPES.find(c => c.value === formData.crop_type)?.label}
                      </Badge>
                    </div>
                    {formData.crop_variety && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Variety</span>
                        <span>{formData.crop_variety}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Title</span>
                      <span className="text-right">{formData.title}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Location</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">State</span>
                      <span>{AUSTRALIAN_STATES.find(s => s.value === formData.state)?.label}</span>
                    </div>
                    {formData.region && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Region</span>
                        <span>{formData.region}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Land Area</span>
                      <span>{formData.land_area_hectares} ha</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Land Status</span>
                      <Badge variant="outline">
                        {LAND_STATUS.find(s => s.value === formData.land_status)?.label}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Timeline</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Projection Period</span>
                      <span>{formData.projection_start_year} - {formData.projection_end_year}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration</span>
                      <span>{projectionYears} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">First Harvest</span>
                      <span>{formData.first_harvest_year}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Projected Yields</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Volume</span>
                      <span className="font-bold">{totalProjectedTonnes.toLocaleString()} t</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Years with Harvest</span>
                      <span>{yearProjections.filter(p => p.projected_tonnes > 0).length}</span>
                    </div>
                    <Progress
                      value={100}
                      className="h-2 mt-2"
                    />
                    <div className="text-xs text-muted-foreground text-center">
                      100% available for EOI
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-900">Ready to Publish?</p>
                    <p className="text-sm text-amber-700 mt-1">
                      Once published, buyers will be able to see your futures listing and submit
                      Expressions of Interest (EOI). You can also save as draft and publish later.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="flex items-center gap-2">
          {currentStep === STEPS.length ? (
            <>
              <Button
                variant="outline"
                onClick={() => handleSubmit(true)}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save as Draft
              </Button>
              <Button
                onClick={() => handleSubmit(false)}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Check className="mr-2 h-4 w-4" />
                )}
                Publish Listing
              </Button>
            </>
          ) : (
            <Button
              onClick={handleNext}
              disabled={
                (currentStep === 1 && (!formData.crop_type || !formData.title)) ||
                (currentStep === 2 && (!formData.state || !formData.land_area_hectares))
              }
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
