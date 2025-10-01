import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Home, Calendar, Building, Store, Hotel, Edit, Users } from "lucide-react";

interface StreetOverviewProps {
  handleEditStreet: any;
  street: {
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
    propertyCount?: {
      houses: number;
      shops: number;
      hotels: number;
      others: number;
    };
  };
}

export const StreetOverview = ({ street, handleEditStreet }: StreetOverviewProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Calculate property type statistics and total
  const totalProperties = street.propertyCount
    ? street.propertyCount.houses + street.propertyCount.shops + street.propertyCount.hotels + street.propertyCount.others
    : street.properties.length;

  const propertyStats = street.propertyCount
    ? {
        Houses: street.propertyCount.houses,
        Shops: street.propertyCount.shops,
        Hotels: street.propertyCount.hotels,
        Others: street.propertyCount.others,
      }
    : street.properties.reduce((acc, property) => {
        acc[property.type] = (acc[property.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

  const getPropertyIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "house":
        return Home;
      case "shop":
        return Store;
      case "hotel":
        return Hotel;
      default:
        return Building;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Street Information */}
      <div className="lg:col-span-2">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-primary-light p-3 rounded-xl">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-xl leading-5 sm:text-2xl font-bold text-foreground">{street.name}</h2>
              </div>

              <Button variant="outline" size="sm" onClick={handleEditStreet}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Details
              </Button>
            </div>

            <div className="my-5">
              <div className="grid grid-cols-2 max-w-fit sm:grid-cols-2 lg:grid-cols-3 items-end gap-y-1 gap-x-2 mt-1">
                <Badge variant="outline" className="text-xs text-nowrap w-fit">
                  {street.ward}
                </Badge>
                <Badge variant="outline" className="text-xs text-nowrap w-fit">
                  {street.lg}
                </Badge>
                <Badge variant="outline" className="text-xs text-nowrap w-fit">
                  {street.lcda}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1 text-xs text-nowrap w-fit">
                  <Users className="h-3 w-3" />
                  {street.cda}
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
                <p className="text-foreground leading-relaxed">{street.description}</p>
              </div>

              {(street.ownerName || street.ownerContact) && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Owner Information</h3>
                  <div className="space-y-1">
                    {street.ownerName && (
                      <p className="text-foreground">
                        <span className="font-medium">Name:</span> {street.ownerName}
                      </p>
                    )}
                    {street.ownerContact && (
                      <p className="text-foreground">
                        <span className="font-medium">Contact:</span> {street.ownerContact}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {street.image && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Street Image</h3>
                  <div className="relative">
                    <img src={street.image} alt={`${street.name} street view`} className="w-full h-48 object-cover rounded-lg border" />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Registration Date</h4>
                  <div className="flex items-center gap-2 text-foreground">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(street.registrationDate)}</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Total Properties</h4>
                  <div className="flex items-center gap-2 text-foreground">
                    <Home className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">{totalProperties}</span>
                    <span className="text-muted-foreground">registered</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Property Statistics */}
      <div className="space-y-4">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Building className="h-4 w-4" />
              Property Types
            </h3>

            {Object.keys(propertyStats).length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No properties registered yet</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(propertyStats)
                  .sort(([, a], [, b]) => b - a)
                  .map(([type, count]) => {
                    // const Icon = getPropertyIcon(type);
                    const percentage = totalProperties > 0 ? (count / totalProperties) * 100 : 0;

                    return (
                      <div key={type} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            {/* <Icon className="h-4 w-4 text-muted-foreground" /> */}
                            <span className="font-medium text-foreground capitalize">{type}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">{count}</span>
                            <Badge variant="secondary" className="text-xs">
                              {percentage.toFixed(0)}%
                            </Badge>
                          </div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
