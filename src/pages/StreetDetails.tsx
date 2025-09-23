import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  ArrowLeft,
  MapPin,
  Home,
  Calendar,
  Edit,
  Trash2,
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Building,
  Store,
  Hotel
} from 'lucide-react';
import { PropertyForm } from '@/components/properties/PropertyForm';
import { PropertyTable } from '@/components/properties/PropertyTable';
import { PropertyDetails } from '@/components/properties/PropertyDetails';
import { StreetOverview } from '@/components/street/StreetOverview';
import { StreetEditForm } from '@/components/street/StreetEditForm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

// Mock data
const mockStreetData = {
  1: {
    id: 1,
    name: "Ahmadu Bello Avenue",
    cda: "Phase 1 CDA",
    registrationDate: "2023-03-15",
    description: "Main commercial avenue with mixed residential and commercial properties. This street serves as a major thoroughfare connecting various residential estates to the central business district.",
    properties: [
      {
        id: 1,
        number: "15A",
        type: "House",
        owner: "John Adebayo",
        contact: "+234 803 123 4567",
        description: "3-bedroom duplex with modern amenities",
        registrationDate: "2023-03-20"
      },
      {
        id: 2,
        number: "17",
        type: "Shop",
        owner: "Fatima's Electronics",
        contact: "+234 805 987 6543",
        description: "Electronics retail store with repair services",
        registrationDate: "2023-04-01"
      },
      {
        id: 3,
        number: "19B",
        type: "House",
        owner: "Dr. Sarah Okonkwo",
        contact: "+234 807 555 1234",
        description: "4-bedroom family home with garden",
        registrationDate: "2023-03-25"
      },
      {
        id: 4,
        number: "21",
        type: "Hotel",
        owner: "Grandview Hotels Ltd",
        contact: "+234 809 876 5432",
        description: "Boutique hotel with 24 rooms",
        registrationDate: "2023-05-10"
      },
      {
        id: 5,
        number: "23",
        type: "Shop",
        owner: "Mama Ngozi's Store",
        contact: "+234 806 111 2233",
        description: "General provisions and household items",
        registrationDate: "2023-04-15"
      }
    ]
  }
};

const StreetDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<any>(null);
  const [viewingProperty, setViewingProperty] = useState<any>(null);
  const [showStreetEditForm, setShowStreetEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const streetId = parseInt(id || '1');
  const street = mockStreetData[streetId as keyof typeof mockStreetData];

  if (!street) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Street not found
            </h3>
            <p className="text-muted-foreground mb-4">
              The requested street could not be found.
            </p>
            <Button onClick={() => navigate('/dashboard')}>
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
      console.log('Updating property:', propertyData);
    } else {
      console.log('Adding new property:', propertyData);
    }
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
    console.log('Deleting property:', propertyId);
    // Here you would typically make an API call to delete the property
    // For now, we'll just show a success message
  };

  const handleEditStreet = () => {
    setShowStreetEditForm(true);
  };

  const handleStreetSubmit = (streetData: any) => {
    console.log('Updating street:', streetData);
    // Here you would typically make an API call to update the street
  };

  const handleDeleteStreet = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDeleteStreet = () => {
    console.log('Deleting street:', street.id);
    // Here you would typically make an API call to delete the street
    // Then navigate back to dashboard
    setShowDeleteConfirm(false);
    navigate('/dashboard');
  };

  const filteredProperties = street.properties.filter(property =>
    property.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="h-6 border-l border-border"></div>
              <div className="flex items-center space-x-3">
                <div className="bg-primary p-2 rounded-lg">
                  <MapPin className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-foreground">
                    {street.name}
                  </h1>
                  <p className="text-sm text-muted-foreground">{street.cda}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" onClick={handleEditStreet}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Street
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                className="hidden sm:flex"
                onClick={handleDeleteStreet}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Street
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Street Overview */}
        <StreetOverview street={street} />

        {/* Properties Section */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Home className="h-5 w-5" />
                    Properties on this Street
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Manage all properties registered on {street.name}
                  </p>
                </div>
                <Button 
                  onClick={() => setShowPropertyForm(true)}
                  className="bg-primary hover:bg-primary-hover"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Register New Property
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              {/* Search and Stats */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search properties by number, type, or owner..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline">
                    {filteredProperties.length} of {street.properties.length} properties
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
      {showStreetEditForm && (
        <StreetEditForm
          street={street}
          onClose={() => setShowStreetEditForm(false)}
          onSubmit={handleStreetSubmit}
        />
      )}

      {/* Delete Street Confirmation */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Street</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{street.name}"? This action cannot be undone and will permanently remove the street and all associated properties from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteStreet}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete Street
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StreetDetails;