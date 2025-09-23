import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Home, 
  Calendar, 
  Edit, 
  MoreHorizontal,
  Eye
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface StreetCardProps {
  street: {
    id: number;
    name: string;
    cda: string;
    propertyCount: number;
    registrationDate: string;
    description: string;
  };
}

export const StreetCard = ({ street }: StreetCardProps) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleViewStreet = () => {
    navigate(`/street/${street.id}`);
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group border border-border">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Main Content */}
          <div className="flex-1 min-w-0" onClick={handleViewStreet}>
            <div className="flex items-start gap-3 mb-3">
              <div className="bg-primary-light p-2 rounded-lg mt-1">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {street.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {street.cda}
                  </Badge>
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {street.description}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Home className="h-4 w-4" />
                <span className="font-medium text-foreground">{street.propertyCount}</span>
                <span>properties</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Registered {formatDate(street.registrationDate)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewStreet}
              className="hidden sm:flex"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>

            <Button
              size="sm"
              onClick={handleViewStreet}
              className="sm:hidden w-full"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleViewStreet}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Street
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive focus:text-destructive">
                  <MapPin className="h-4 w-4 mr-2" />
                  Delete Street
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};