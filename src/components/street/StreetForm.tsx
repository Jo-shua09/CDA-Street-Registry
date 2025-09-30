import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Store } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HouseDetail {
  number: string;
  type: string;
  description: string;
  hasShops: boolean;
  shops: ShopDetail[];
}

interface ShopDetail {
  number: string;
  type: string;
  description: string;
}

interface StreetFormData {
  name: string;
  cda: string;
  ward: string;
  lg: string;
  lcda: string;
  description: string;
  houses: number;
  hotels: number;
  others: number;
  hasShops: boolean;
  shopCount: number;
  shopDetails: ShopDetail[];
}

interface StreetFormProps {
  onClose: () => void;
  onSubmit: (streetData: StreetFormData & { registrationDate: string }) => void;
}

export const StreetForm = ({ onClose, onSubmit }: StreetFormProps) => {
  const [formData, setFormData] = useState<StreetFormData>({
    name: "",
    cda: "",
    ward: "",
    lg: "",
    lcda: "",
    description: "",
    houses: 0,
    hotels: 0,
    others: 0,
    hasShops: false,
    shopCount: 0,
    shopDetails: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const totalProperties = formData.houses + formData.hotels + formData.others;

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleShopDetailsChange = (index: number, field: string, value: string) => {
    setFormData((prev) => {
      const newShopDetails = [...prev.shopDetails];
      if (!newShopDetails[index]) {
        newShopDetails[index] = { number: "", type: "", description: "" };
      }
      newShopDetails[index] = { ...newShopDetails[index], [field]: value };
      return { ...prev, shopDetails: newShopDetails };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.cda || !formData.ward || !formData.lg || !formData.lcda) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const streetData = {
        ...formData,
        registrationDate: new Date().toISOString().split("T")[0],
      };

      onSubmit(streetData);

      toast({
        title: "Street Registered",
        description: `${formData.name} has been registered successfully.`,
      });

      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl overflow-y-scroll h-full">
        <DialogHeader>
          <DialogTitle className="text-xl">Register New Street</DialogTitle>
          <DialogDescription>Add a new street to the registry</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Street Name *</Label>
            <Input
              id="name"
              placeholder="Enter street name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
            />
          </div>

          <div className="flex items-center w-full gap-4">
            <div className="space-y-2 w-full">
              <Label htmlFor="ward">Ward *</Label>
              <Select value={formData.ward} onValueChange={(value) => handleInputChange("ward", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select ward" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ward C1">Ward C1</SelectItem>
                  <SelectItem value="Ward C2">Ward C2</SelectItem>
                  <SelectItem value="Ward C3">Ward C3</SelectItem>
                  <SelectItem value="Ward C4">Ward C4</SelectItem>
                  <SelectItem value="Ward C5">Ward C5</SelectItem>
                  <SelectItem value="Ward C6">Ward C6</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 w-full">
              <Label className="leading-tight" htmlFor="lg">
                Local Government Area *
              </Label>
              <Input id="lg" placeholder="Enter LGA" value={formData.lg} onChange={(e) => handleInputChange("lg", e.target.value)} required />
            </div>
          </div>

          <div className="flex items-center gap-4 w-full">
            <div className="space-y-2 w-full">
              <Label className="leading-tight" htmlFor="lcda">
                Local Council Development Area *
              </Label>
              <Input id="lcda" placeholder="Enter LCDA" value={formData.lcda} onChange={(e) => handleInputChange("lcda", e.target.value)} required />
            </div>

            <div className="space-y-2 w-full">
              <Label className="leading-tight" htmlFor="cda">
                Community Development Association *
              </Label>
              <Input id="cda" placeholder="Enter CDA" value={formData.cda} onChange={(e) => handleInputChange("cda", e.target.value)} required />
            </div>
          </div>

          {/* Shop Section - Only show if houses > 0 */}
          {formData.houses > 0 && (
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Store className="h-5 w-5 text-primary" />
                  <h3 className="font-medium text-foreground">House Shops</h3>
                  <Badge variant="outline" className="text-xs">
                    Part of House Registration
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Does this house have any shops?</Label>
                    <RadioGroup
                      value={formData.hasShops ? "yes" : "no"}
                      onValueChange={(value) => handleInputChange("hasShops", value === "yes")}
                      className="flex space-x-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="shops-yes" />
                        <Label htmlFor="shops-yes" className="text-sm font-normal">
                          Yes
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="shops-no" />
                        <Label htmlFor="shops-no" className="text-sm font-normal">
                          No
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {formData.hasShops && (
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="shopCount" className="text-sm">
                          Number of Shops *
                        </Label>
                        <Input
                          id="shopCount"
                          type="number"
                          min="1"
                          max="20"
                          placeholder="Enter number of shops"
                          value={formData.shopCount}
                          onChange={(e) => handleInputChange("shopCount", parseInt(e.target.value) || 0)}
                          required
                        />
                      </div>

                      {/* Shop Details */}
                      {formData.shopCount > 0 && (
                        <div className="space-y-3">
                          <div className="text-sm text-muted-foreground mb-2">These shops will be registered as part of the house property.</div>
                          <Label className="text-sm font-medium">Shop Details</Label>
                          {Array.from({ length: formData.shopCount }).map((_, index) => (
                            <Card key={index} className="p-3 bg-muted/30">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="secondary" className="text-xs">
                                  House Shop {index + 1}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  Part of House
                                </Badge>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                <div>
                                  <Label htmlFor={`shop-number-${index}`} className="text-xs">
                                    Shop Number
                                  </Label>
                                  <Input
                                    id={`shop-number-${index}`}
                                    placeholder="e.g., S1, Shop A"
                                    value={formData.shopDetails[index]?.number || ""}
                                    onChange={(e) => handleShopDetailsChange(index, "number", e.target.value)}
                                    className="h-8 text-sm"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor={`shop-type-${index}`} className="text-xs">
                                    Shop Type
                                  </Label>
                                  <Input
                                    id={`shop-type-${index}`}
                                    placeholder="e.g., Retail, Food, Service"
                                    value={formData.shopDetails[index]?.type || ""}
                                    onChange={(e) => handleShopDetailsChange(index, "type", e.target.value)}
                                    className="h-8 text-sm"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor={`shop-desc-${index}`} className="text-xs">
                                    Description
                                  </Label>
                                  <Input
                                    id={`shop-desc-${index}`}
                                    placeholder="Brief description"
                                    value={formData.shopDetails[index]?.description || ""}
                                    onChange={(e) => handleShopDetailsChange(index, "description", e.target.value)}
                                    className="h-8 text-sm"
                                  />
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            <Label className="text-base font-medium">Property Count</Label>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="houses">Houses</Label>
                <Input
                  id="houses"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.houses}
                  onChange={(e) => handleInputChange("houses", parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hotels">Hotels</Label>
                <Input
                  id="hotels"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.hotels}
                  onChange={(e) => handleInputChange("hotels", parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="others">Others</Label>
                <Input
                  id="others"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.others}
                  onChange={(e) => handleInputChange("others", parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
            <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
              Total Properties: <span className="font-semibold text-foreground">{totalProperties}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the street"
              rows={4}
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Registering..." : "Register Street"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
