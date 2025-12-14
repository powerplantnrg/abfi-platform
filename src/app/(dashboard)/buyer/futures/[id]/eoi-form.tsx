"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, Send, Loader2, Info } from "lucide-react";

interface EOIFormProps {
  futuresId: string;
  buyerId: string;
  startYear: number;
  endYear: number;
  maxAvailableTonnes: number;
}

const DELIVERY_FREQUENCIES = [
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "semi-annual", label: "Semi-Annual" },
  { value: "annual", label: "Annual" },
  { value: "flexible", label: "Flexible" },
];

const PAYMENT_TERMS = [
  { value: "net_30", label: "Net 30 days" },
  { value: "net_60", label: "Net 60 days" },
  { value: "net_90", label: "Net 90 days" },
  { value: "on_delivery", label: "On Delivery" },
  { value: "advance", label: "Advance Payment" },
  { value: "negotiable", label: "Negotiable" },
];

export function EOIForm({
  futuresId,
  buyerId,
  startYear,
  endYear,
  maxAvailableTonnes,
}: EOIFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    interest_start_year: startYear.toString(),
    interest_end_year: endYear.toString(),
    annual_volume_tonnes: "",
    offered_price_per_tonne: "",
    price_terms: "",
    delivery_location: "",
    delivery_frequency: "quarterly",
    logistics_notes: "",
    payment_terms: "negotiable",
    additional_terms: "",
    agreeToTerms: false,
  });

  const interestStartYear = parseInt(formData.interest_start_year);
  const interestEndYear = parseInt(formData.interest_end_year);
  const yearsOfInterest = interestEndYear - interestStartYear + 1;
  const annualVolume = parseFloat(formData.annual_volume_tonnes) || 0;
  const totalVolume = annualVolume * yearsOfInterest;

  const handleSubmit = async () => {
    if (!formData.agreeToTerms) {
      toast.error("Please agree to the terms to submit your EOI");
      return;
    }

    if (annualVolume <= 0) {
      toast.error("Please enter a valid annual volume");
      return;
    }

    if (totalVolume > maxAvailableTonnes) {
      toast.error(`Total volume exceeds available supply (${maxAvailableTonnes.toLocaleString()}t)`);
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("futures_eoi").insert({
        futures_id: futuresId,
        buyer_id: buyerId,
        interest_start_year: interestStartYear,
        interest_end_year: interestEndYear,
        annual_volume_tonnes: annualVolume,
        total_volume_tonnes: totalVolume,
        offered_price_per_tonne: formData.offered_price_per_tonne
          ? parseFloat(formData.offered_price_per_tonne)
          : null,
        price_terms: formData.price_terms || null,
        delivery_location: formData.delivery_location || null,
        delivery_frequency: formData.delivery_frequency,
        logistics_notes: formData.logistics_notes || null,
        payment_terms: formData.payment_terms,
        additional_terms: formData.additional_terms || null,
        status: "pending",
      });

      if (error) throw error;

      toast.success("Expression of Interest submitted successfully!");
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error submitting EOI:", error);
      toast.error("Failed to submit EOI. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Card className="cursor-pointer hover:border-primary/50 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Submit EOI
            </CardTitle>
            <CardDescription>
              Express interest in securing this future supply
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              <Send className="mr-2 h-4 w-4" />
              Submit Expression of Interest
            </Button>
          </CardContent>
        </Card>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Expression of Interest</DialogTitle>
          <DialogDescription>
            Submit your interest in this futures supply. The grower will review
            your EOI and respond with their decision.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Volume & Period */}
          <div className="space-y-4">
            <h4 className="font-medium">Interest Period & Volume</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Start Year</Label>
                <Select
                  value={formData.interest_start_year}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      interest_start_year: value,
                      interest_end_year:
                        parseInt(value) > parseInt(prev.interest_end_year)
                          ? value
                          : prev.interest_end_year,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i).map(
                      (year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>End Year</Label>
                <Select
                  value={formData.interest_end_year}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, interest_end_year: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from(
                      { length: endYear - interestStartYear + 1 },
                      (_, i) => interestStartYear + i
                    ).map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="annual_volume">Annual Volume Required (tonnes) *</Label>
              <Input
                id="annual_volume"
                type="number"
                min="1"
                step="100"
                value={formData.annual_volume_tonnes}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, annual_volume_tonnes: e.target.value }))
                }
                placeholder="e.g., 5000"
              />
              {annualVolume > 0 && (
                <div className="text-sm text-muted-foreground">
                  Total: {totalVolume.toLocaleString()}t over {yearsOfInterest} years
                  {totalVolume > maxAvailableTonnes && (
                    <span className="text-destructive ml-2">
                      (Exceeds available supply of {maxAvailableTonnes.toLocaleString()}t)
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-4 border-t pt-4">
            <h4 className="font-medium">Pricing (Optional)</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="offered_price">Offered Price ($/tonne)</Label>
                <Input
                  id="offered_price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.offered_price_per_tonne}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, offered_price_per_tonne: e.target.value }))
                  }
                  placeholder="Leave blank if negotiable"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment_terms">Payment Terms</Label>
                <Select
                  value={formData.payment_terms}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, payment_terms: value }))
                  }
                >
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
              <Label htmlFor="price_terms">Price Terms / Notes</Label>
              <Input
                id="price_terms"
                value={formData.price_terms}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, price_terms: e.target.value }))
                }
                placeholder="e.g., Price to include annual CPI adjustment"
              />
            </div>
          </div>

          {/* Delivery */}
          <div className="space-y-4 border-t pt-4">
            <h4 className="font-medium">Delivery Requirements</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="delivery_location">Delivery Location</Label>
                <Input
                  id="delivery_location"
                  value={formData.delivery_location}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, delivery_location: e.target.value }))
                  }
                  placeholder="e.g., Port of Brisbane"
                />
              </div>
              <div className="space-y-2">
                <Label>Delivery Frequency</Label>
                <Select
                  value={formData.delivery_frequency}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, delivery_frequency: value }))
                  }
                >
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
              <Label htmlFor="logistics_notes">Logistics Notes</Label>
              <Textarea
                id="logistics_notes"
                value={formData.logistics_notes}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, logistics_notes: e.target.value }))
                }
                placeholder="Any specific logistics requirements..."
                rows={2}
              />
            </div>
          </div>

          {/* Additional Terms */}
          <div className="space-y-4 border-t pt-4">
            <h4 className="font-medium">Additional Information</h4>
            <div className="space-y-2">
              <Label htmlFor="additional_terms">Additional Terms or Comments</Label>
              <Textarea
                id="additional_terms"
                value={formData.additional_terms}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, additional_terms: e.target.value }))
                }
                placeholder="Any additional terms, conditions, or information for the supplier..."
                rows={3}
              />
            </div>
          </div>

          {/* Terms Agreement */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p>
                  By submitting this Expression of Interest, you are indicating your intent
                  to enter into negotiations for the supply of feedstock as specified.
                  This is not a binding contract.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, agreeToTerms: checked as boolean }))
                }
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I understand this is an Expression of Interest and agree to engage in
                good faith negotiations if accepted
              </label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              !formData.agreeToTerms ||
              annualVolume <= 0 ||
              totalVolume > maxAvailableTonnes
            }
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Submit EOI
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
