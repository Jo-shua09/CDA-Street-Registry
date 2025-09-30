import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface CdaFormData {
  name: string;
  ward: string;
  lg: string;
  description: string;
}

interface CdaFormProps {
  onClose: () => void;
  onSubmit: (cdaData: CdaFormData & { registrationDate: string }) => void;
}

export const CdaForm = ({ onClose, onSubmit }: CdaFormProps) => {
  const [formData, setFormData] = useState<CdaFormData>({
    name: "",
    ward: "",
    lg: "",
    description: "",
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

      const cdaData = {
        ...formData,
        registrationDate: new Date().toISOString().split("T")[0],
      };

      onSubmit(cdaData);

      toast({
        title: "CDA Registered",
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Register New CDA</DialogTitle>
          <DialogDescription>Add a new Community Development Association</DialogDescription>
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
              {isSubmitting ? "Registering..." : "Register CDA"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
