import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Cda {
  id: number;
  name: string;
  ward: string;
  lg: string;
  description: string;
  registrationDate: string;
}

interface CdaEditFormProps {
  cda: Cda;
  onClose: () => void;
  onSubmit: (cdaData: Cda) => void;
}

export const CdaEditForm = ({ cda, onClose, onSubmit }: CdaEditFormProps) => {
  const [formData, setFormData] = useState({
    name: cda.name,
    ward: cda.ward,
    lg: cda.lg,
    description: cda.description,
  });

  // Fix validation to check ward instead of state
  const isValid = formData.name && formData.ward && formData.lg;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.ward || !formData.lg) {
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

      const updatedCda = {
        ...cda,
        name: formData.name,
        ward: formData.ward,
        lg: formData.lg,
        description: formData.description,
      };

      onSubmit(updatedCda);

      toast({
        title: "CDA Updated",
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Edit CDA Details</DialogTitle>
          <DialogDescription>Update the information for {cda.name}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">CDA Name *</Label>
            <Input
              id="name"
              placeholder="Enter CDA name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
            />
          </div>

          <div className="flex items-center gap-4 w-full">
            <div className="space-y-2 w-full">
              <Label htmlFor="ward">Ward *</Label>
              <Input id="ward" placeholder="Enter ward" value={formData.ward} onChange={(e) => handleInputChange("ward", e.target.value)} required />
            </div>

            <div className="space-y-2 w-full">
              <Label htmlFor="lg">Local Government Area *</Label>
              <Input id="lg" placeholder="Enter LGA" value={formData.lg} onChange={(e) => handleInputChange("lg", e.target.value)} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the CDA"
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
              {isSubmitting ? "Updating..." : "Update CDA"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
