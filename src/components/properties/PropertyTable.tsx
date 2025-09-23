import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import {
  Home,
  Store,
  Hotel,
  Building,
  Edit,
  Trash2,
  MoreHorizontal,
  Eye,
  Phone,
  Calendar
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

interface PropertyTableProps {
  properties: Property[];
  onEdit: (property: Property) => void;
  onDelete: (propertyId: number) => void;
}

export const PropertyTable = ({ properties, onEdit, onDelete }: PropertyTableProps) => {
  const [deleteProperty, setDeleteProperty] = useState<Property | null>(null);

  const getPropertyIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'house':
        return <Home className="h-4 w-4 text-primary" />;
      case 'shop':
        return <Store className="h-4 w-4 text-success" />;
      case 'hotel':
        return <Hotel className="h-4 w-4 text-warning" />;
      default:
        return <Building className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTypeVariant = (type: string) => {
    switch (type.toLowerCase()) {
      case 'house':
        return 'default';
      case 'shop':
        return 'secondary';
      case 'hotel':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleDelete = () => {
    if (deleteProperty) {
      onDelete(deleteProperty.id);
      setDeleteProperty(null);
    }
  };

  if (properties.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
        <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">
          No properties found
        </h3>
        <p className="text-muted-foreground mb-4">
          No properties match your search criteria. Try adjusting your search terms.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-semibold">Property</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold">Owner/Tenant</TableHead>
              <TableHead className="font-semibold hidden sm:table-cell">Contact</TableHead>
              <TableHead className="font-semibold hidden md:table-cell">Registered</TableHead>
              <TableHead className="font-semibold w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties.map((property) => (
              <TableRow key={property.id} className="hover:bg-muted/50 transition-colors">
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary-light p-2 rounded-lg">
                      {getPropertyIcon(property.type)}
                    </div>
                    <div>
                      <div className="font-medium text-foreground">
                        #{property.number}
                      </div>
                      <div className="text-sm text-muted-foreground line-clamp-1">
                        {property.description}
                      </div>
                    </div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <Badge 
                    variant={getTypeVariant(property.type) as any}
                    className="capitalize"
                  >
                    {property.type}
                  </Badge>
                </TableCell>
                
                <TableCell>
                  <div className="font-medium text-foreground">
                    {property.owner}
                  </div>
                </TableCell>
                
                <TableCell className="hidden sm:table-cell">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    <span className="text-sm">{property.contact}</span>
                  </div>
                </TableCell>
                
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span className="text-sm">{formatDate(property.registrationDate)}</span>
                  </div>
                </TableCell>
                
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => console.log('View property', property.id)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(property)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Property
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={() => setDeleteProperty(property)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Property
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteProperty} onOpenChange={() => setDeleteProperty(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Property</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete property #{deleteProperty?.number}? 
              This action cannot be undone and will permanently remove all property data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete Property
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};