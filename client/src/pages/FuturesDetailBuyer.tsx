import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { formatDate } from "@/const";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  TreeDeciduous,
  Sprout,
  Leaf,
  TrendingUp,
  DollarSign,
  Building2,
  Mail,
  Phone,
  Globe,
  Send,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useState, useMemo } from "react";
import { Link, useRoute } from "wouter";
import { toast } from "sonner";

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
  bamboo: <Sprout className="h-6 w-6" />,
  rotation_forestry: <TreeDeciduous className="h-6 w-6" />,
  eucalyptus: <TreeDeciduous className="h-6 w-6" />,
  poplar: <TreeDeciduous className="h-6 w-6" />,
  willow: <TreeDeciduous className="h-6 w-6" />,
  miscanthus: <Leaf className="h-6 w-6" />,
  switchgrass: <Leaf className="h-6 w-6" />,
  arundo_donax: <Leaf className="h-6 w-6" />,
  hemp: <Leaf className="h-6 w-6" />,
  other_perennial: <Sprout className="h-6 w-6" />,
};

const DELIVERY_FREQUENCIES = [
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "semi-annual", label: "Semi-Annual" },
  { value: "annual", label: "Annual" },
  { value: "flexible", label: "Flexible" },
];

const PAYMENT_TERMS = [
  { value: "net_30", label: "Net 30" },
  { value: "net_60", label: "Net 60" },
  { value: "net_90", label: "Net 90" },
  { value: "on_delivery", label: "On Delivery" },
  { value: "advance", label: "Advance Payment" },
  { value: "negotiable", label: "Negotiable" },
];

const EOI_STATUS_LABELS: Record<string, string> = {
  pending: "Pending Review",
  under_review: "Under Review",
  accepted: "Accepted",
  declined: "Declined",
  expired: "Expired",
  withdrawn: "Withdrawn",
};

const getEOIStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "under_review":
      return "bg-blue-100 text-blue-800";
    case "accepted":
      return "bg-green-100 text-green-800";
    case "declined":
      return "bg-red-100 text-red-800";
    case "expired":
    case "withdrawn":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getEOIStatusIcon = (status: string) => {
  switch (status) {
    case "pending":
      return <Clock className="h-5 w-5 text-yellow-600" />;
    case "under_review":
      return <AlertCircle className="h-5 w-5 text-blue-600" />;
    case "accepted":
      return <CheckCircle2 className="h-5 w-5 text-green-600" />;
    case "declined":
      return <XCircle className="h-5 w-5 text-red-600" />;
    default:
      return <Clock className="h-5 w-5 text-gray-600" />;
  }
};

export default function FuturesDetailBuyer() {
  const { user, loading: authLoading } = useAuth();
  const [, params] = useRoute("/futures/:id");
  const futuresId = parseInt(params?.id || "0");

  const [eoiDialogOpen, setEoiDialogOpen] = useState(false);

  // EOI form state
  const [interestStartYear, setInterestStartYear] = useState<string>("");
  const [interestEndYear, setInterestEndYear] = useState<string>("");
  const [annualVolumeTonnes, setAnnualVolumeTonnes] = useState<string>("");
  const [offeredPricePerTonne, setOfferedPricePerTonne] = useState<string>("");
  const [priceTerms, setPriceTerms] = useState<string>("");
  const [deliveryLocation, setDeliveryLocation] = useState<string>("");
  const [deliveryFrequency, setDeliveryFrequency] = useState<string>("quarterly");
  const [logisticsNotes, setLogisticsNotes] = useState<string>("");
  const [paymentTerms, setPaymentTerms] = useState<string>("negotiable");
  const [additionalTerms, setAdditionalTerms] = useState<string>("");

  const utils = trpc.useUtils();

  const { data, isLoading, error } = trpc.futures.getPublic.useQuery(
    { id: futuresId },
    { enabled: futuresId > 0 }
  );

  const submitEOIMutation = trpc.futures.submitEOI.useMutation({
    onSuccess: (result) => {
      toast.success(`EOI submitted successfully! Reference: ${result.eoiReference}`);
      setEoiDialogOpen(false);
      utils.futures.getPublic.invalidate({ id: futuresId });
    },
    onError: (error) => toast.error(error.message),
  });

  const withdrawEOIMutation = trpc.futures.withdrawEOI.useMutation({
    onSuccess: () => {
      toast.success("EOI withdrawn");
      utils.futures.getPublic.invalidate({ id: futuresId });
    },
    onError: (error) => toast.error(error.message),
  });

  // Calculate total volume for EOI
  const totalEOIVolume = useMemo(() => {
    const startYear = parseInt(interestStartYear);
    const endYear = parseInt(interestEndYear);
    const annualVolume = parseFloat(annualVolumeTonnes);
    if (isNaN(startYear) || isNaN(endYear) || isNaN(annualVolume)) return 0;
    return annualVolume * (endYear - startYear + 1);
  }, [interestStartYear, interestEndYear, annualVolumeTonnes]);

  const handleSubmitEOI = () => {
    submitEOIMutation.mutate({
      futuresId,
      interestStartYear: parseInt(interestStartYear),
      interestEndYear: parseInt(interestEndYear),
      annualVolumeTonnes: parseFloat(annualVolumeTonnes),
      offeredPricePerTonne: offeredPricePerTonne ? parseFloat(offeredPricePerTonne) : undefined,
      priceTerms: priceTerms || undefined,
      deliveryLocation: deliveryLocation || undefined,
      deliveryFrequency: deliveryFrequency as any,
      logisticsNotes: logisticsNotes || undefined,
      paymentTerms: paymentTerms as any,
      additionalTerms: additionalTerms || undefined,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="py-8 text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Futures Not Found</h3>
            <p className="text-muted-foreground mb-4">
              {error?.message || "This futures listing is not available."}
            </p>
            <Link href="/futures">
              <Button variant="outline">Back to Marketplace</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { futures, projections, supplier, existingEOI } = data;

  const totalProjected = parseFloat(futures.totalProjectedTonnes || "0");
  const totalAvailable = parseFloat(futures.totalAvailableTonnes || "0");
  const availablePercent = totalProjected > 0 ? (totalAvailable / totalProjected) * 100 : 100;

  // Generate year options for EOI form
  const yearOptions = [];
  for (let year = futures.projectionStartYear; year <= futures.projectionEndYear; year++) {
    yearOptions.push(year);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-6">
          <Link href="/futures">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Marketplace
            </Button>
          </Link>

          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div className="flex items-start gap-4">
              <div className="p-4 bg-green-100 rounded-xl">
                {CROP_TYPE_ICONS[futures.cropType] || <Sprout className="h-6 w-6" />}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold">{futures.futuresId}</h1>
                  <Badge variant="outline">{CROP_TYPE_LABELS[futures.cropType]}</Badge>
                </div>
                <p className="text-muted-foreground text-lg">{futures.title}</p>
              </div>
            </div>

            {/* EOI Status / Submit Button */}
            <div>
              {existingEOI ? (
                <Card className="bg-muted/50">
                  <CardContent className="py-4">
                    <div className="flex items-center gap-3">
                      {getEOIStatusIcon(existingEOI.status)}
                      <div>
                        <p className="font-medium">Your EOI: {existingEOI.eoiReference}</p>
                        <Badge className={getEOIStatusColor(existingEOI.status)}>
                          {EOI_STATUS_LABELS[existingEOI.status]}
                        </Badge>
                      </div>
                    </div>
                    {existingEOI.supplierResponse && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm text-muted-foreground">Supplier Response:</p>
                        <p className="text-sm">{existingEOI.supplierResponse}</p>
                      </div>
                    )}
                    {["pending", "under_review"].includes(existingEOI.status) && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        onClick={() => withdrawEOIMutation.mutate({ eoiId: existingEOI.id })}
                        disabled={withdrawEOIMutation.isPending}
                      >
                        Withdraw EOI
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : user ? (
                <Dialog open={eoiDialogOpen} onOpenChange={setEoiDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="lg">
                      <Send className="h-4 w-4 mr-2" />
                      Submit Expression of Interest
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Submit Expression of Interest</DialogTitle>
                      <DialogDescription>
                        Express your interest in this futures listing. The supplier will review your request.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                      {/* Interest Period */}
                      <div className="space-y-4">
                        <h4 className="font-semibold">Interest Period</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Start Year *</Label>
                            <Select value={interestStartYear} onValueChange={setInterestStartYear}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select year" />
                              </SelectTrigger>
                              <SelectContent>
                                {yearOptions.map((year) => (
                                  <SelectItem key={year} value={year.toString()}>
                                    {year}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>End Year *</Label>
                            <Select value={interestEndYear} onValueChange={setInterestEndYear}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select year" />
                              </SelectTrigger>
                              <SelectContent>
                                {yearOptions
                                  .filter((y) => y >= parseInt(interestStartYear || "0"))
                                  .map((year) => (
                                    <SelectItem key={year} value={year.toString()}>
                                      {year}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      {/* Volume */}
                      <div className="space-y-4">
                        <h4 className="font-semibold">Volume Requirements</h4>
                        <div className="space-y-2">
                          <Label>Annual Volume (tonnes) *</Label>
                          <Input
                            type="number"
                            placeholder="e.g., 5000"
                            value={annualVolumeTonnes}
                            onChange={(e) => setAnnualVolumeTonnes(e.target.value)}
                            className="font-mono"
                          />
                        </div>
                        {totalEOIVolume > 0 && (
                          <div className="bg-muted/50 rounded-lg p-3">
                            <p className="text-sm">
                              <strong>Total volume requested:</strong> {totalEOIVolume.toLocaleString()} tonnes
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Available: {totalAvailable.toLocaleString()} tonnes
                            </p>
                            {totalEOIVolume > totalAvailable && (
                              <p className="text-sm text-red-600 mt-1">
                                Warning: Requested volume exceeds available supply
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Pricing */}
                      <div className="space-y-4">
                        <h4 className="font-semibold">Pricing</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Offered Price ($/tonne)</Label>
                            <Input
                              type="number"
                              placeholder="Leave blank for negotiable"
                              value={offeredPricePerTonne}
                              onChange={(e) => setOfferedPricePerTonne(e.target.value)}
                              className="font-mono"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Payment Terms</Label>
                            <Select value={paymentTerms} onValueChange={setPaymentTerms}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {PAYMENT_TERMS.map((term) => (
                                  <SelectItem key={term.value} value={term.value}>
                                    {term.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Price Terms / Notes</Label>
                          <Input
                            placeholder="Any specific pricing conditions..."
                            value={priceTerms}
                            onChange={(e) => setPriceTerms(e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Delivery */}
                      <div className="space-y-4">
                        <h4 className="font-semibold">Delivery</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Delivery Location</Label>
                            <Input
                              placeholder="e.g., Brisbane Port"
                              value={deliveryLocation}
                              onChange={(e) => setDeliveryLocation(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Delivery Frequency</Label>
                            <Select value={deliveryFrequency} onValueChange={setDeliveryFrequency}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {DELIVERY_FREQUENCIES.map((freq) => (
                                  <SelectItem key={freq.value} value={freq.value}>
                                    {freq.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Logistics Notes</Label>
                          <Textarea
                            placeholder="Any specific logistics requirements..."
                            value={logisticsNotes}
                            onChange={(e) => setLogisticsNotes(e.target.value)}
                            rows={2}
                          />
                        </div>
                      </div>

                      {/* Additional Terms */}
                      <div className="space-y-2">
                        <Label>Additional Terms / Comments</Label>
                        <Textarea
                          placeholder="Any other terms or information you'd like to include..."
                          value={additionalTerms}
                          onChange={(e) => setAdditionalTerms(e.target.value)}
                          rows={3}
                        />
                      </div>
                    </div>

                    <DialogFooter>
                      <Button variant="outline" onClick={() => setEoiDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSubmitEOI}
                        disabled={
                          !interestStartYear ||
                          !interestEndYear ||
                          !annualVolumeTonnes ||
                          submitEOIMutation.isPending
                        }
                      >
                        {submitEOIMutation.isPending ? "Submitting..." : "Submit EOI"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              ) : (
                <Link href="/login">
                  <Button size="lg">
                    Sign In to Submit EOI
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Volume Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Volume Availability
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Total Projected</p>
                    <p className="text-2xl font-bold">{totalProjected.toLocaleString()}t</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Already Contracted</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {parseFloat(futures.totalContractedTonnes || "0").toLocaleString()}t
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-green-600">Available</p>
                    <p className="text-2xl font-bold text-green-700">{totalAvailable.toLocaleString()}t</p>
                  </div>
                </div>
                <div>
                  <Progress value={availablePercent} className="h-3" />
                  <p className="text-sm text-muted-foreground text-center mt-2">
                    {Math.round(availablePercent)}% still available
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Details */}
            <Card>
              <CardHeader>
                <CardTitle>Listing Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Location & Land */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Location
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">State</p>
                      <p className="font-medium">{futures.state}</p>
                    </div>
                    {futures.region && (
                      <div>
                        <p className="text-muted-foreground">Region</p>
                        <p className="font-medium">{futures.region}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-muted-foreground">Land Area</p>
                      <p className="font-medium">{parseFloat(futures.landAreaHectares).toLocaleString()} ha</p>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="border-t pt-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Timeline
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Projection Period</p>
                      <p className="font-medium">
                        {futures.projectionStartYear} - {futures.projectionEndYear} (
                        {futures.projectionEndYear - futures.projectionStartYear + 1} years)
                      </p>
                    </div>
                    {futures.firstHarvestYear && (
                      <div>
                        <p className="text-muted-foreground">First Harvest</p>
                        <p className="font-medium">{futures.firstHarvestYear}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pricing */}
                <div className="border-t pt-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Pricing
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Indicative Price</p>
                      <p className="font-medium text-lg">
                        {futures.indicativePricePerTonne
                          ? `$${parseFloat(futures.indicativePricePerTonne).toFixed(2)}/t`
                          : "Negotiable"}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Annual Escalation</p>
                      <p className="font-medium">{futures.priceEscalationPercent || "2.5"}%</p>
                    </div>
                  </div>
                  {futures.pricingNotes && (
                    <p className="text-sm text-muted-foreground mt-3">{futures.pricingNotes}</p>
                  )}
                </div>

                {/* Quality */}
                {(futures.expectedCarbonIntensity ||
                  futures.expectedMoistureContent ||
                  futures.expectedEnergyContent) && (
                  <div className="border-t pt-6">
                    <h4 className="font-semibold mb-3">Expected Quality Parameters</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      {futures.expectedCarbonIntensity && (
                        <div>
                          <p className="text-muted-foreground">Carbon Intensity</p>
                          <p className="font-medium">{futures.expectedCarbonIntensity} kg CO₂e/t</p>
                        </div>
                      )}
                      {futures.expectedMoistureContent && (
                        <div>
                          <p className="text-muted-foreground">Moisture Content</p>
                          <p className="font-medium">{futures.expectedMoistureContent}%</p>
                        </div>
                      )}
                      {futures.expectedEnergyContent && (
                        <div>
                          <p className="text-muted-foreground">Energy Content</p>
                          <p className="font-medium">{futures.expectedEnergyContent} GJ/t</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Description */}
                {futures.description && (
                  <div className="border-t pt-6">
                    <h4 className="font-semibold mb-3">Description</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{futures.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Projections Table */}
            {projections && projections.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Yield Projections</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-3 font-medium">Year</th>
                          <th className="text-right py-2 px-3 font-medium">Projected (t)</th>
                          <th className="text-center py-2 px-3 font-medium">Confidence</th>
                          <th className="text-left py-2 px-3 font-medium">Season</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projections.map((p: any, index: number) => (
                          <tr key={p.projectionYear} className={index % 2 === 0 ? "bg-muted/30" : ""}>
                            <td className="py-2 px-3 font-medium">{p.projectionYear}</td>
                            <td className="py-2 px-3 text-right font-mono">
                              {parseFloat(p.projectedTonnes).toLocaleString()}
                            </td>
                            <td className="py-2 px-3 text-center">
                              <Badge variant="outline">{p.confidencePercent || 80}%</Badge>
                            </td>
                            <td className="py-2 px-3 capitalize">{p.harvestSeason || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Supplier Info */}
            {supplier && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Supplier
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-semibold text-lg">{supplier.companyName}</p>
                    {supplier.state && (
                      <p className="text-sm text-muted-foreground">
                        {supplier.city && `${supplier.city}, `}
                        {supplier.state}
                      </p>
                    )}
                  </div>

                  {supplier.description && (
                    <p className="text-sm text-muted-foreground">{supplier.description}</p>
                  )}

                  <div className="space-y-2 pt-2 border-t">
                    {supplier.contactEmail && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={`mailto:${supplier.contactEmail}`}
                          className="text-primary hover:underline"
                        >
                          {supplier.contactEmail}
                        </a>
                      </div>
                    )}
                    {supplier.contactPhone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={`tel:${supplier.contactPhone}`}
                          className="text-primary hover:underline"
                        >
                          {supplier.contactPhone}
                        </a>
                      </div>
                    )}
                    {supplier.website && (
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={supplier.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {supplier.website.replace(/^https?:\/\//, "")}
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Crop Type</span>
                  <span className="font-medium">{CROP_TYPE_LABELS[futures.cropType]}</span>
                </div>
                {futures.cropVariety && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Variety</span>
                    <span className="font-medium">{futures.cropVariety}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contract Length</span>
                  <span className="font-medium">
                    {futures.projectionEndYear - futures.projectionStartYear + 1} years
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg. Annual Volume</span>
                  <span className="font-medium">
                    {Math.round(
                      totalProjected / (futures.projectionEndYear - futures.projectionStartYear + 1)
                    ).toLocaleString()}
                    t
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Published</span>
                  <span className="font-medium">
                    {futures.publishedAt ? formatDate(futures.publishedAt) : "N/A"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
