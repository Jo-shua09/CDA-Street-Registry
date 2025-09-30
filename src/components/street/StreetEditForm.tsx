import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Street {
  id: number;
  name: string;
  cda: string;
  ward: string;
  lg: string;
  lcda: string;
  registrationDate: string;
  description: string;
  properties: Array<{ type: string }>;
  propertyCount: {
    houses: number;
    shops: number;
    hotels: number;
    others: number;
  };
}

interface StreetEditFormProps {
  street: Street;
  onClose: () => void;
  onSubmit: (streetData: Street) => void;
}

export const StreetEditForm = ({ street, onClose, onSubmit }: StreetEditFormProps) => {
  const [formData, setFormData] = useState({
    name: street.name,
    cda: street.cda,
    ward: street.ward,
    lg: street.lg,
    lcda: street.lcda,
    description: street.description,
    houses: street.propertyCount.houses,
    shops: street.propertyCount.shops,
    hotels: street.propertyCount.hotels,
    others: street.propertyCount.others,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const totalProperties = formData.houses + formData.shops + formData.hotels + formData.others;

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

      // Create properties array based on updated counts
      const properties: Array<{ type: string }> = [];
      for (let i = 0; i < formData.houses; i++) properties.push({ type: "house" });
      for (let i = 0; i < formData.shops; i++) properties.push({ type: "shop" });
      for (let i = 0; i < formData.hotels; i++) properties.push({ type: "hotel" });
      for (let i = 0; i < formData.others; i++) properties.push({ type: "other" });

      const updatedStreet: Street = {
        ...street,
        name: formData.name,
        cda: formData.cda,
        ward: formData.ward,
        lg: formData.lg,
        lcda: formData.lcda,
        description: formData.description,
        propertyCount: {
          houses: formData.houses,
          shops: formData.shops,
          hotels: formData.hotels,
          others: formData.others,
        },
        properties,
      };

      onSubmit(updatedStreet);

      toast({
        title: "Street Updated",
        description: `${formData.name} has been updated successfully.`,
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
          <DialogTitle className="text-xl">Edit Street Details</DialogTitle>
          <DialogDescription>Update the information for {street.name}</DialogDescription>
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
              <Input id="ward" placeholder="Enter ward" value={formData.ward} onChange={(e) => handleInputChange("ward", e.target.value)} required />
            </div>

            <div className="space-y-2 w-full">
              <Label htmlFor="lg">Local Government Area *</Label>
              <Input id="lg" placeholder="Enter LGA" value={formData.lg} onChange={(e) => handleInputChange("lg", e.target.value)} required />
            </div>
          </div>

          <div className="flex items-center gap-4 w-full">
            <div className="space-y-2 w-full">
              <Label htmlFor="lcda">Local Council Development Area *</Label>
              <Input id="lcda" placeholder="Enter LCDA" value={formData.lcda} onChange={(e) => handleInputChange("lcda", e.target.value)} required />
            </div>

            <div className="space-y-2 w-full">
              <Label htmlFor="cda">Community Development Association *</Label>
              <Input id="cda" placeholder="Enter CDA" value={formData.cda} onChange={(e) => handleInputChange("cda", e.target.value)} required />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-base font-medium">Property Count</Label>
            <div className="grid grid-cols-4 gap-4">
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
                <Label htmlFor="shops">Shops</Label>
                <Input
                  id="shops"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.shops}
                  onChange={(e) => handleInputChange("shops", parseInt(e.target.value) || 0)}
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
              {isSubmitting ? "Updating..." : "Update Street"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
