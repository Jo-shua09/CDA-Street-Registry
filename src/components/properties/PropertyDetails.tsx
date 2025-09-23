import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Home,
  Store,
  Hotel,
  Building,
  Phone,
  Calendar,
  FileText,
  Edit,
  Trash2
} from 'lucide-react';

interface Property {
  id: number;
  number: string;
  type: string;
  owner: string;
  contact: string;
  description: string;
  registrationDate: string;
}

interface PropertyDetailsProps {
  property: Property;
  streetName: string;
  onClose: () => void;
  onEdit: (property: Property) => void;
  onDelete: (propertyId: number) => void;
}

export const PropertyDetails = ({ property, streetName, onClose, onEdit, onDelete }: PropertyDetailsProps) => {
  const getPropertyIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'house':
        return <Home className="h-6 w-6 text-primary" />;
      case 'shop':
        return <Store className="h-6 w-6 text-success" />;
      case 'hotel':
        return <Hotel className="h-6 w-6 text-warning" />;
      default:
        return <Building className="h-6 w-6 text-muted-foreground" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-3">
            {getPropertyIcon(property.type)}
            Property #{property.number}
          </DialogTitle>
          <DialogDescription>
            Detailed information for property on {streetName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
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

          {/* Property Description */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-medium text-foreground">Property Description</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {property.description || 'No description available for this property.'}
              </p>
            </CardContent>
          </Card>

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
        </div>
      </DialogContent>
    </Dialog>
  );
};