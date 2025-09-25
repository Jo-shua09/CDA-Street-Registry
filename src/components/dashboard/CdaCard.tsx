import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Home, Calendar, ChevronDown, ChevronRight, Users, Building } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface Street {
  id: number;
  name: string;
  cda: string;
  state: string;
  lg: string;
  lcda: string;
  propertyCount: {
    houses: number;
    shops: number;
    hotels: number;
    others: number;
  };
  registrationDate: string;
  description: string;
}

interface CdaCardProps {
  cda: string;
  streets: Street[];
  onStreetClick: (streetId: number) => void;
}

export const CdaCard = ({ cda, streets, onStreetClick }: CdaCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAllStreets, setShowAllStreets] = useState(false);

  const totalProperties = streets.reduce((sum, street) => {
    return sum + street.propertyCount.houses + street.propertyCount.shops + street.propertyCount.hotels + street.propertyCount.others;
  }, 0);

  const totalStreets = streets.length;
  const streetsPerCDA = 15;
  const displayedStreets = showAllStreets ? streets : streets.slice(0, streetsPerCDA);
  const hasMoreStreets = streets.length > streetsPerCDA;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border border-border">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardContent className="p-6 cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary-light p-3 rounded-lg">
                  <Building className="h-6 w-6 text-primary" />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground">{cda}</h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {totalStreets} street{totalStreets !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Home className="h-4 w-4" />
                      <span>
                        {totalProperties} propert{totalProperties !== 1 ? "ies" : "y"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {totalStreets} Street{totalStreets !== 1 ? "s" : ""}
                </Badge>
                {isOpen ? <ChevronDown className="h-5 w-5 text-muted-foreground" /> : <ChevronRight className="h-5 w-5 text-muted-foreground" />}
              </div>
            </div>
          </CardContent>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0 pb-6">
            <div className="border-t border-border pt-4">
              <div className="space-y-3">
                {displayedStreets.map((street) => (
                  <div
                    key={street.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => onStreetClick(street.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-secondary p-2 rounded-md">
                        <MapPin className="h-4 w-4 text-secondary-foreground" />
                      </div>

                      <div>
                        <h4 className="font-medium text-foreground">{street.name}</h4>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <span>{street.state}</span>
                          <span>•</span>
                          <span>{street.lg}</span>
                          <span>•</span>
                          <span>{street.lcda}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right text-sm">
                        <div className="font-medium text-foreground">
                          {street.propertyCount.houses + street.propertyCount.shops + street.propertyCount.hotels + street.propertyCount.others}
                        </div>
                        <div className="text-muted-foreground">properties</div>
                      </div>

                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {hasMoreStreets && (
                  <div className="pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowAllStreets(!showAllStreets);
                      }}
                      className="w-full"
                    >
                      {showAllStreets ? (
                        <>
                          <ChevronRight className="h-4 w-4 mr-2 rotate-90" />
                          Show Less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4 mr-2" />
                          Show {totalStreets - streetsPerCDA} More Streets
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
