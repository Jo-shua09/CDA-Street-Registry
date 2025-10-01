import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ExtendedCdaData } from "@/data/mockData";

interface StreetFormData {
  name: string;
  cda: string;
  ward: string;
  lg: string;
  lcda: string;
  description: string;
  ownerName: string;
  ownerContact: string;
  image?: File | string;
}

interface StreetFormProps {
  onClose: () => void;
  onSubmit: (streetData: StreetFormData & { registrationDate: string }) => void;
  cdas: ExtendedCdaData[];
}

export const StreetForm = ({ onClose, onSubmit, cdas }: StreetFormProps) => {
  const [formData, setFormData] = useState<StreetFormData>({
    name: "",
    cda: "",
    ward: "",
    lg: "",
    lcda: "",
    description: "",
    ownerName: "",
    ownerContact: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();

  // Reset CDA when ward changes
  useEffect(() => {
    setFormData((prev) => ({ ...prev, cda: "" }));
  }, [formData.ward]);

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
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
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: undefined }));
    setImagePreview(null);
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!formData.name || !formData.cda || !formData.ward || !formData.lg || !formData.lcda) {
  //     toast({
  //       title: "Missing Information",
  //       description: "Please fill in all required fields",
  //       variant: "destructive",
  //     });
  //     return;
  //   }

  //   setIsSubmitting(true);

  //   try {
  //     // Simulate API call
  //     await new Promise((resolve) => setTimeout(resolve, 1000));

  //     // FIX: Create date in local timezone to avoid timezone issues
  //     const now = new Date();
  //     const registrationDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().split("T")[0];

  //     const streetData = {
  //       id: Date.now(),
  //       ...formData,
  //       registrationDate,
  //     };

  //     onSubmit(streetData);

  //     toast({
  //       title: "Street Registered",
  //       description: `${formData.name} has been registered successfully.`,
  //     });

  //     onClose();
  //   } catch (error) {
  //     toast({
  //       title: "Error",
  //       description: "Something went wrong. Please try again.",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

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

      // DEBUG: Log the current date
      const now = new Date();
      console.log("Current date:", now);
      console.log("Current date string:", now.toString());
      console.log("Timezone offset:", now.getTimezoneOffset());

      // FIX: Create date in local timezone to avoid timezone issues
      const registrationDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().split("T")[0];

      console.log("Registration date being set:", registrationDate);

      const streetData = {
        id: Date.now(),
        ...formData,
        registrationDate,
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
              <Select value={formData.cda} onValueChange={(value) => handleInputChange("cda", value)} disabled={!formData.ward}>
                <SelectTrigger>
                  <SelectValue placeholder="Select CDA" />
                </SelectTrigger>
                <SelectContent>
                  {cdas
                    .filter((cda) => cda.ward === formData.ward)
                    .map((cda) => (
                      <SelectItem key={cda.id} value={cda.name}>
                        {cda.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full">
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
              rows={4}
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
              {isSubmitting ? "Registering..." : "Register Street"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
