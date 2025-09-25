import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Home, Store, Hotel, Building, Phone, Calendar, FileText, Edit, Trash2, StoreIcon, Image, File, Download, Eye, X } from "lucide-react";
import { useState } from "react";

interface Property {
  id: number;
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
}

interface PropertyDetailsProps {
  property: Property;
  streetName: string;
  onClose: () => void;
  onEdit: (property: Property) => void;
  onDelete: (propertyId: number) => void;
}

export const PropertyDetails = ({ property, streetName, onClose, onEdit, onDelete }: PropertyDetailsProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

  const getPropertyIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "house":
        return <Home className="h-6 w-6 text-primary" />;
      case "shop":
        return <Store className="h-6 w-6 text-success" />;
      case "hotel":
        return <Hotel className="h-6 w-6 text-warning" />;
      default:
        return <Building className="h-6 w-6 text-muted-foreground" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Mock data for demonstration - in real app, this would come from props or API
  const propertyImages = [
    { id: 1, url: "/placeholder-image-1.jpg", name: "Front View", type: "image" },
    { id: 2, url: "/placeholder-image-2.jpg", name: "Interior", type: "image" },
    { id: 3, url: "/placeholder-image-3.jpg", name: "Back View", type: "image" },
  ];

  const propertyDocuments = [
    { id: 1, url: "/deed-document.pdf", name: "Property Deed", type: "pdf", size: "2.5 MB" },
    { id: 2, url: "/survey-plan.pdf", name: "Survey Plan", type: "pdf", size: "1.8 MB" },
    { id: 3, url: "/tax-document.pdf", name: "Tax Clearance", type: "pdf", size: "850 KB" },
  ];

  const handleDownload = (fileUrl: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImageView = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleDocumentView = (documentUrl: string) => {
    setSelectedDocument(documentUrl);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-3">
            {getPropertyIcon(property.type)}
            Property #{property.number}
            {property.hasShops && (
              <Badge variant="secondary" className="ml-2">
                <StoreIcon className="h-3 w-3 mr-1" />
                {property.shopCount} Shop{property.shopCount !== 1 ? "s" : ""}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>Detailed information for property on {streetName}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="images">Images ({propertyImages.length})</TabsTrigger>
            <TabsTrigger value="documents">Documents ({propertyDocuments.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Property Overview */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Property Number</h3>
                      <p className="text-lg font-semibold text-foreground">#{property.number}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Property Type</h3>
                      <Badge variant="outline" className="capitalize text-sm">
                        {property.type}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Street Location</h3>
                      <p className="text-foreground">{streetName}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Owner/Tenant</h3>
                      <p className="text-foreground font-medium">{property.owner}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Contact Information</h3>
                      <div className="flex items-center gap-2 text-foreground">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{property.contact}</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Registration Date</h3>
                      <div className="flex items-center gap-2 text-foreground">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{formatDate(property.registrationDate)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shop Information */}
            {property.hasShops && property.shops && property.shops.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Store className="h-5 w-5 text-primary" />
                    <h3 className="font-medium text-foreground">Shop Information</h3>
                    <Badge variant="secondary" className="ml-2">
                      {property.shopCount} Shop{property.shopCount !== 1 ? "s" : ""}
                    </Badge>
                  </div>
                  <div className="grid gap-3">
                    {property.shops.map((shop, index) => (
                      <Card key={index} className="p-3 bg-muted/30">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            Shop {index + 1}
                          </Badge>
                          {shop.number && <span className="text-sm font-medium">#{shop.number}</span>}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          {shop.type && (
                            <div>
                              <span className="text-muted-foreground">Type: </span>
                              <span>{shop.type}</span>
                            </div>
                          )}
                          {shop.description && (
                            <div>
                              <span className="text-muted-foreground">Description: </span>
                              <span>{shop.description}</span>
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Property Description */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-medium text-foreground">Property Description</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">{property.description || "No description available for this property."}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="images" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Image className="h-5 w-5 text-primary" />
                  <h3 className="font-medium text-foreground">Property Images</h3>
                  <Badge variant="secondary">{propertyImages.length} images</Badge>
                </div>

                {propertyImages.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Image className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No images uploaded for this property</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {propertyImages.map((image) => (
                      <Card key={image.id} className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleImageView(image.url)}>
                        <div className="aspect-square bg-muted relative">
                          <img
                            src={image.url}
                            alt={image.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.svg";
                            }}
                          />
                          <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
                            <Eye className="h-6 w-6 text-white opacity-0 hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="text-sm font-medium text-foreground">{image.name}</p>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <File className="h-5 w-5 text-primary" />
                  <h3 className="font-medium text-foreground">Property Documents</h3>
                  <Badge variant="secondary">{propertyDocuments.length} documents</Badge>
                </div>

                {propertyDocuments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <File className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No documents uploaded for this property</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {propertyDocuments.map((doc) => (
                      <Card key={doc.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-muted rounded-lg">
                              <File className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{doc.name}</p>
                              <p className="text-sm text-muted-foreground">{doc.size}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleDocumentView(doc.url)}>
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDownload(doc.url, doc.name)}>
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Image Viewer Modal */}
        {selectedImage && (
          <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Property Image</DialogTitle>
              </DialogHeader>
              <div className="relative">
                <img
                  src={selectedImage}
                  alt="Property"
                  className="w-full h-auto max-h-96 object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => setSelectedImage(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Document Viewer Modal */}
        {selectedDocument && (
          <Dialog open={!!selectedDocument} onOpenChange={() => setSelectedDocument(null)}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Document Viewer</DialogTitle>
              </DialogHeader>
              <div className="relative h-96">
                <iframe
                  src={selectedDocument}
                  className="w-full h-full border rounded"
                  title="Document Viewer"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => setSelectedDocument(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              onEdit(property);
              onClose();
            }}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Property
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onDelete(property.id);
              onClose();
            }}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Property
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
