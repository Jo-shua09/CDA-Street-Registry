import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, MapPin, Home, Calendar, Edit, Trash2, Plus, Search, MoreHorizontal, Eye, Building, Store, Hotel, Image } from "lucide-react";
import { PropertyForm } from "@/components/properties/PropertyForm";
import { PropertyTable } from "@/components/properties/PropertyTable";
import { PropertyDetails } from "@/components/properties/PropertyDetails";
import { StreetOverview } from "@/components/street/StreetOverview";
import { StreetEditForm } from "@/components/street/StreetEditForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  getStoredStreets,
  getStoredProperties,
  saveStreet,
  saveProperty,
  deleteProperty,
  deleteStreet,
  convertPropertyForDisplay,
} from "@/utils/storage";
import { ExtendedStreetData } from "@/data/types"; // Change this import

const StreetDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<any>(null);
  const [viewingProperty, setViewingProperty] = useState<any>(null);
  const [showStreetEditForm, setShowStreetEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [street, setStreet] = useState<ExtendedStreetData | null>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const streetId = parseInt(id || "0");

  // Load street and properties data from storage
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedStreets = getStoredStreets();
        const foundStreet = storedStreets.find((s) => s.id === streetId);
        if (foundStreet) {
          setStreet(foundStreet);
          const storedProperties = getStoredProperties(streetId);
          // Convert stored properties to display format (base64 to File objects)
          const displayProperties = storedProperties.map((prop) => convertPropertyForDisplay(prop)).filter(Boolean);
          setProperties(displayProperties);
        }
      } catch (error) {
        console.error("Error loading street and properties data:", error);
      }
    };

    loadData();
  }, [streetId, refreshTrigger]);

  // Update street property count when properties change
  useEffect(() => {
    if (street && properties.length >= 0) {
      const count = calculatePropertyCount();
      const updatedStreet = { ...street, propertyCount: count };
      saveStreet(updatedStreet);
      setStreet(updatedStreet);
    }
  }, [properties, street?.id]);

  // Property type categories for counting
  const houseTypes = ["House", "Single-Family Home", "Multi-Family Home", "Townhouse", "Mansion / Villa", "Manufactured / Mobile Home", "Cottage"];
  const shopTypes = ["Shop", "Restaurant / Café", "Shopping Mall / Plaza", "Gas Station"];
  const hotelTypes = ["Hotel"];

  // Calculate dynamic property counts including aggregated shops
  const calculatePropertyCount = () => {
    let houses = 0;
    let shops = 0;
    let hotels = 0;
    let others = 0;

    properties.forEach((property) => {
      const propertyType = property.type;
      if (houseTypes.includes(propertyType)) {
        houses += 1;
        if (property.hasShops) {
          shops += property.shopCount || 0;
        }
      } else if (shopTypes.includes(propertyType)) {
        shops += 1;
      } else if (hotelTypes.includes(propertyType)) {
        hotels += 1;
      } else {
        others += 1;
      }
    });

    return { houses, shops, hotels, others };
  };

  const dynamicPropertyCount = calculatePropertyCount();

  if (!street) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Street not found</h3>
            <p className="text-muted-foreground mb-4">The requested street could not be found.</p>
            <Button onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handlePropertySubmit = (propertyData: any) => {
    if (editingProperty) {
      // Update existing property
      const updatedProperty = { ...propertyData, id: editingProperty.id };
      saveProperty(updatedProperty);
    } else {
      // Add new property
      const newProperty = { ...propertyData, id: Date.now(), streetId };
      saveProperty(newProperty);
    }
    setRefreshTrigger((prev) => prev + 1);
    setShowPropertyForm(false);
    setEditingProperty(null);
  };

  const handleEditProperty = (property: any) => {
    setEditingProperty(property);
    setShowPropertyForm(true);
  };

  const handleViewProperty = (property: any) => {
    setViewingProperty(property);
  };

  const handleDeleteProperty = (propertyId: number) => {
    deleteProperty(propertyId);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleEditStreet = () => {
    setShowStreetEditForm(true);
  };

  const handleStreetSubmit = (streetData: any) => {
    const updatedStreet = { ...street, ...streetData };
    saveStreet(updatedStreet);
    setRefreshTrigger((prev) => prev + 1);
    setShowStreetEditForm(false);
  };

  const handleDeleteStreet = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDeleteStreet = () => {
    deleteStreet(street.id);
    setShowDeleteConfirm(false);
    navigate("/dashboard");
  };

  // Property types list for search filtering and categorization
  const propertyTypes = [
    "House",
    "Shop",
    "Office",
    "Hotel",
    "Apartment",
    "Warehouse",
    "Commercial Building",
    "Residential Building",
    "Single-Family Home",
    "Multi-Family Home",
    "Condominium (Condo)",
    "Townhouse",
    "Mansion",
    "Villa",
    "Mobile Home",
    "Cottage",
    "Restaurant",
    "Shopping Mall",
    "Plaza",
    "Medical Office",
    "Clinic",
    "Factory",
    "Manufacturing Plant",
    "Distribution Center",
    "Flex Space",
    "Schools",
    "University",
    "Hospital",
    "Nursing Home",
    "Church",
    "mosque",
    "Place of Worship",
    "Government Building",
    "Theater",
    "Cinema",
    "Gym/Fitness Center",
    "Salon",
    "Barbershop",
    "Gas Station",
    "Other",
  ];

  // Enhanced search with property types and shop aggregation
  const getFilteredProperties = () => {
    if (!searchTerm.trim()) {
      return properties;
    }

    const searchLower = searchTerm.toLowerCase().trim();

    // Check if search term matches any property type (case-insensitive)
    const matchedType = propertyTypes.find((type) => type.toLowerCase() === searchLower);

    if (matchedType === "Shop") {
      // Aggregate shops from houses
      let totalShops = 0;
      properties.forEach((property) => {
        if (property.type.toLowerCase() === "house" && property.hasShops) {
          totalShops += property.shopCount || 0;
        }
      });
      // Return a single aggregated shop property object with total count
      return [
        {
          id: -1,
          number: "Multiple",
          type: "Shop",
          owner: `${totalShops} shops across houses`,
          contact: "",
          description: `Total of ${totalShops} shops registered in houses`,
          registrationDate: "",
        },
      ];
    }

    // Otherwise, filter properties by number, type, owner, or matching property type
    return properties.filter((property) => {
      const numberMatch = property.number.toLowerCase().includes(searchLower);
      const typeMatch = property.type.toLowerCase().includes(searchLower);
      const ownerMatch = property.owner.toLowerCase().includes(searchLower);
      const typeExactMatch = matchedType ? property.type.toLowerCase() === matchedType.toLowerCase() : false;

      return numberMatch || typeMatch || ownerMatch || typeExactMatch;
    });
  };

  const filteredProperties = getFilteredProperties();

  const propertiesPerPage = 30;

  // Calculate paginated properties
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = filteredProperties.slice(indexOfFirstProperty, indexOfLastProperty);

  // Calculate total pages
  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center sm:space-x-3 space-x-1">
                <div className="bg-primary p-2 sm:p-3 rounded-lg">
                  <MapPin className="sm:h-6 h-5 w-5 sm:w-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-sm sm:text-lg font-semibold text-foreground">{street.name}</h1>
                  <p className="text-xs sm:text-sm text-muted-foreground">{street.cda}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" onClick={handleEditStreet}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="destructive" size="sm" className="flex" onClick={handleDeleteStreet}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="w-fit mb-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="text-muted-foreground bg-secondary hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-8">
            {/* Street Overview */}
            <StreetOverview street={street} handleEditStreet={handleEditStreet} />

            {/* Properties Section */}
            <div>
              <Card>
                <CardHeader className="sm:p-6 p-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Home className="h-5 w-5" />
                        Properties on this Street
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Manage all properties registered on <span className="font-bold">{street.name}</span>
                      </p>
                    </div>
                    <Button onClick={() => setShowPropertyForm(true)} className="bg-primary hover:bg-primary-hover">
                      <Plus className="h-5 w-5 mr-2" />
                      Register New Property
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="sm:p-6 p-3">
                  {/* Search and Stats */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search properties by number, type, or owner..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 placeholder:text-sm sm:placeholder:text-lg"
                      />
                    </div>
                    <div className="flex gap-2 text-sm  text-muted-foreground">
                      <Badge variant="outline">
                        {filteredProperties.length} of {properties.length + dynamicPropertyCount.shops} properties
                      </Badge>
                    </div>
                  </div>

                  {/* Properties Table */}
                  <PropertyTable
                    properties={filteredProperties}
                    onEdit={handleEditProperty}
                    onDelete={handleDeleteProperty}
                    onView={handleViewProperty}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="images" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Image className="h-5 w-5" />
                  Street Images
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  View and manage images for <span className="font-bold">{street.name}</span>
                </p>
              </CardHeader>
              <CardContent>
                {street.image ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <img src={street.image} alt={`${street.name} street view`} className="w-full h-96 object-cover rounded-lg border" />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Image className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No Image Available</h3>
                    <p className="text-muted-foreground mb-4">No street image has been uploaded for {street.name} yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Property Form Modal */}
      {showPropertyForm && (
        <PropertyForm
          property={editingProperty}
          streetName={street.name}
          onSubmit={handlePropertySubmit}
          onClose={() => {
            setShowPropertyForm(false);
            setEditingProperty(null);
          }}
        />
      )}

      {/* Property Details Modal */}
      {viewingProperty && (
        <PropertyDetails
          property={viewingProperty}
          streetName={street.name}
          onClose={() => setViewingProperty(null)}
          onEdit={handleEditProperty}
          onDelete={handleDeleteProperty}
        />
      )}

      {/* Street Edit Form Modal */}
      {showStreetEditForm && <StreetEditForm street={street} onClose={() => setShowStreetEditForm(false)} onSubmit={handleStreetSubmit} />}

      {/* Delete Street Confirmation */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Street</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{street.name}"? This action cannot be undone and will permanently remove the street and all associated
              properties from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteStreet} className="bg-destructive hover:bg-destructive/90">
              Delete Street
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StreetDetails;
