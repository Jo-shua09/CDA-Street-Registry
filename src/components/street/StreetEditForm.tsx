import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X, Image } from "lucide-react";
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
  image?: string;
  ownerName?: string;
  ownerContact?: string;
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
    image: street.image || null,
    ownerName: street.ownerName || "",
    ownerContact: street.ownerContact || "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(street.image || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string | number | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please select a valid image file",
          variant: "destructive",
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImagePreview(result);
        setFormData((prev) => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, image: null }));
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

      const updatedStreet: Street = {
        ...street,
        name: formData.name,
        cda: formData.cda,
        ward: formData.ward,
        lg: formData.lg,
        lcda: formData.lcda,
        description: formData.description,
        ownerName: formData.ownerName || undefined,
        ownerContact: formData.ownerContact || undefined,
        image: formData.image || undefined,
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

          <div className="flex md:flex-nowrap flex-wrap items-center gap-4 w-full">
            <div className="space-y-2 w-full">
              <Label htmlFor="ward">Ward *</Label>
              <Input id="ward" placeholder="Enter ward" value={formData.ward} onChange={(e) => handleInputChange("ward", e.target.value)} required />
            </div>

            <div className="space-y-2 w-full">
              <Label htmlFor="lg">Local Government Area *</Label>
              <Input id="lg" placeholder="Enter LGA" value={formData.lg} onChange={(e) => handleInputChange("lg", e.target.value)} required />
            </div>
          </div>

          <div className="flex md:flex-nowrap flex-wrap items-center gap-4 w-full">
            <div className="space-y-2 w-full">
              <Label htmlFor="lcda">Local Council Development Area *</Label>
              <Input id="lcda" placeholder="Enter LCDA" value={formData.lcda} onChange={(e) => handleInputChange("lcda", e.target.value)} required />
            </div>

            <div className="space-y-2 w-full">
              <Label htmlFor="cda">Community Development Association *</Label>
              <Input id="cda" placeholder="Enter CDA" value={formData.cda} onChange={(e) => handleInputChange("cda", e.target.value)} required />
            </div>
          </div>

          <div className="flex md:flex-nowrap flex-wrap items-center gap-4 w-full">
            <div className="space-y-2 w-full">
              <Label htmlFor="ownerName">Owner Name</Label>
              <Input
                id="ownerName"
                placeholder="Name of street owner/manager"
                value={formData.ownerName}
                onChange={(e) => handleInputChange("ownerName", e.target.value)}
              />
            </div>

            <div className="space-y-2 w-full">
              <Label htmlFor="ownerContact">Owner Contact</Label>
              <Input
                id="ownerContact"
                placeholder="Phone number or email"
                value={formData.ownerContact}
                onChange={(e) => handleInputChange("ownerContact", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the street"
              rows={5}
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Street Image</Label>
            <div className="space-y-3">
              {!imagePreview ? (
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Image className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <div className="space-y-2">
                    <Label htmlFor="image-upload" className="text-sm font-medium cursor-pointer text-primary hover:text-primary/80">
                      Click to upload image
                    </Label>
                    <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 5MB</p>
                  </div>
                  <Input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </div>
              ) : (
                <div className="relative">
                  <img src={imagePreview} alt="Street preview" className="w-full h-48 object-cover rounded-lg border" />
                  <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2" onClick={removeImage}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
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
