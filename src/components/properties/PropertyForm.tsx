import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Store, Hotel, Building, Upload, X, FileImage, File, Check, Image, Eye, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Property {
  id?: number;
  number: string;
  type: string;
  owner: string;
  contact: string;
  description: string;
  registrationDate: string;
  hasShops?: boolean;
  shopCount?: number;
  shops?: Array<{
    number: string;
    type: string;
    description: string;
  }>;
  houseName?: string; // For shops - name of the house they're part of
}

interface PropertyFormProps {
  property?: Property;
  streetName: string;
  onSubmit: (data: Property & { files: File[]; streetName: string }) => void;
  onClose: () => void;
}

const propertyTypes = [
  { value: "House", label: "House", icon: Home },
  { value: "Shop", label: "Shop", icon: Store },
  { value: "Hotel", label: "Hotel", icon: Hotel },
  { value: "Office", label: "Office", icon: Building },
];

export const PropertyForm = ({ property, streetName, onSubmit, onClose }: PropertyFormProps) => {
  const [formData, setFormData] = useState({
    number: property?.number || "",
    type: property?.type || "",
    owner: property?.owner || "",
    contact: property?.contact || "",
    description: property?.description || "",
    hasShops: property?.hasShops || false,
    shopCount: property?.shopCount || 0,
    shops: property?.shops || [],
    houseName: property?.houseName || "", // For shops - name of the house they're part of
  });
  const [files, setFiles] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      // Reset shop count if "No" is selected for shops
      ...(field === "hasShops" && value === false && { shopCount: 0, shops: [] }),
    }));
  };

  const handleShopDetailsChange = (index: number, field: string, value: string) => {
    const updatedShops = [...formData.shops];
    if (!updatedShops[index]) {
      updatedShops[index] = { number: "", type: "", description: "" };
    }
    updatedShops[index] = { ...updatedShops[index], [field]: value };

    setFormData((prev) => ({ ...prev, shops: updatedShops }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(event.target.files || []);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.number || !formData.type || !formData.owner) {
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

      const propertyData = {
        ...formData,
        files,
        streetName,
        registrationDate: property?.registrationDate || new Date().toISOString(),
        // Ensure shops array has correct number of entries
        shops: formData.hasShops
          ? Array.from({ length: formData.shopCount }, (_, i) => formData.shops[i] || { number: "", type: "", description: "" })
          : [],
      };

      onSubmit(propertyData);

      toast({
        title: property ? "Property Updated" : "Property Registered",
        description: `Property #${formData.number} has been ${property ? "updated" : "registered"} successfully.`,
      });
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

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <FileImage className="h-4 w-4 text-primary" />;
    }
    return <File className="h-4 w-4 text-muted-foreground" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{property ? "Edit Property" : "Register New Property"}</DialogTitle>
          <DialogDescription>{property ? `Update property information for ${streetName}` : `Add a new property to ${streetName}`}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Street Context */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="outline">{streetName}</Badge>
                <span className="text-muted-foreground">→</span>
                <span className="text-foreground">{property ? `Editing #${property.number}` : "New Property"}</span>
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="number">Property Number *</Label>
              <Input
                id="number"
                placeholder="e.g., 15A, 23, Block C-7"
                value={formData.number}
                onChange={(e) => handleInputChange("number", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Property Type *</Label>
              <Input
                id="type"
                placeholder="e.g., House, Shop, Office, Hotel, Apartment"
                value={formData.type}
                onChange={(e) => handleInputChange("type", e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">Enter any property type (House, Shop, Office, etc.)</p>
            </div>
          </div>

          {/* House Name for Shops */}
          {formData.type.toLowerCase() === "shop" && (
            <div className="space-y-2">
              <Label htmlFor="houseName">House Name *</Label>
              <Input
                id="houseName"
                placeholder="Name of the house this shop belongs to"
                value={formData.houseName}
                onChange={(e) => handleInputChange("houseName", e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">This shop will be registered as part of the specified house</p>
            </div>
          )}

          {/* Shop Section - Only show for House type */}
          {formData.type.toLowerCase() === "house" && (
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Store className="h-5 w-5 text-primary" />
                  <h3 className="font-medium text-foreground">Shop Information</h3>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Does this property have shops?</Label>
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
                          <Label className="text-sm font-medium">Shop Details</Label>
                          {Array.from({ length: formData.shopCount }).map((_, index) => (
                            <Card key={index} className="p-3 bg-muted/30">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="secondary" className="text-xs">
                                  Shop {index + 1}
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
                                    value={formData.shops[index]?.number || ""}
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
                                    value={formData.shops[index]?.type || ""}
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
                                    value={formData.shops[index]?.description || ""}
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

          {/* Owner Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="owner">Owner/Tenant Name *</Label>
              <Input
                id="owner"
                placeholder="Full name or business name"
                value={formData.owner}
                onChange={(e) => handleInputChange("owner", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact">Contact Information</Label>
              <Input
                id="contact"
                placeholder="Phone number or email"
                value={formData.contact}
                onChange={(e) => handleInputChange("contact", e.target.value)}
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Property Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the property, notable features, etc."
              rows={3}
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
          </div>

          {/* Enhanced File Upload */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Property Files & Documents</Label>

            {/* Upload Area */}
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <input type="file" multiple accept="image/*,.pdf,.doc,.docx,.txt" onChange={handleFileUpload} className="hidden" id="file-upload" />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-foreground">
                  <span className="font-medium text-primary">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-muted-foreground mt-1">Images (JPG, PNG, GIF), PDFs, and documents (Max 10MB each)</p>
              </label>
            </div>

            {/* File Management Tabs */}
            {files.length > 0 && (
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all" className="text-xs">
                    All Files ({files.length})
                  </TabsTrigger>
                  <TabsTrigger value="images" className="text-xs">
                    Images ({files.filter((f) => f.type.startsWith("image/")).length})
                  </TabsTrigger>
                  <TabsTrigger value="documents" className="text-xs">
                    Documents ({files.filter((f) => !f.type.startsWith("image/")).length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-4">
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          {getFileIcon(file)}
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {file.type.startsWith("image/") && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const reader = new FileReader();
                                reader.onload = (e) => setImagePreview(e.target?.result as string);
                                reader.readAsDataURL(file);
                              }}
                              className="text-muted-foreground hover:text-primary"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="images" className="mt-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-48 overflow-y-auto">
                    {files
                      .filter((f) => f.type.startsWith("image/"))
                      .map((file, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square bg-muted rounded-lg border overflow-hidden">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                                e.currentTarget.nextElementSibling?.classList.remove("hidden");
                              }}
                            />
                            <div className="hidden absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground text-xs">
                              Preview unavailable
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeFile(files.indexOf(file))}
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="documents" className="mt-4">
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {files
                      .filter((f) => !f.type.startsWith("image/"))
                      .map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            {getFileIcon(file)}
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                              <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(files.indexOf(file))}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            )}

            {/* Image Preview Modal */}
            {imagePreview && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setImagePreview(null)}>
                <div className="max-w-2xl max-h-[90vh] p-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-w-full max-h-full object-contain rounded-lg"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (property ? "Updating..." : "Registering...") : property ? "Update Property" : "Register Property"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
