import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Calendar, X, RotateCcw } from "lucide-react";

interface FilterPanelProps {
  filters: {
    cda: string[];
    propertyRange: { min: number; max: number };
    dateRange: { start: string; end: string };
    propertyTypes: string[];
    streetSearch: string;
    streetPropertyRange: { min: number; max: number };
    ward?: string;
  };
  onFiltersChange: (filters: any) => void;
  streets: Array<{
    id: number;
    name: string;
    cda: string;
    ward: string;
    propertyCount: {
      houses: number;
      shops: number;
      hotels: number;
      others: number;
    };
    registrationDate: string;
    properties: Array<{ type: string }>;
  }>;
}

export const FilterPanel = ({ filters, onFiltersChange, streets }: FilterPanelProps) => {
  const [tempPropertyRange, setTempPropertyRange] = useState([filters.propertyRange.min, filters.propertyRange.max]);
  const [tempStreetPropertyRange, setTempStreetPropertyRange] = useState([filters.streetPropertyRange.min, filters.streetPropertyRange.max]);

  // Get unique CDAs from streets
  const uniqueCDAs = Array.from(new Set(streets.map((street) => street.cda))).sort();

  // Property types options - using the actual property types from your form
  const propertyTypeOptions = [
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

  const handleCDAChange = (cda: string, checked: boolean) => {
    const newCDAs = checked ? [...filters.cda, cda] : filters.cda.filter((c) => c !== cda);

    onFiltersChange({
      ...filters,
      cda: newCDAs,
    });
  };

  const handlePropertyRangeChange = (values: number[]) => {
    setTempPropertyRange(values);
    onFiltersChange({
      ...filters,
      propertyRange: { min: values[0], max: values[1] },
    });
  };

  const handleDateRangeChange = (field: "start" | "end", value: string) => {
    onFiltersChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [field]: value,
      },
    });
  };

  const handlePropertyTypeChange = (type: string, checked: boolean) => {
    const newTypes = checked ? [...filters.propertyTypes, type] : filters.propertyTypes.filter((t) => t !== type);
    onFiltersChange({
      ...filters,
      propertyTypes: newTypes,
    });
  };

  const handleStreetSearchChange = (value: string) => {
    onFiltersChange({
      ...filters,
      streetSearch: value,
    });
  };

  const handleStreetPropertyRangeChange = (values: number[]) => {
    setTempStreetPropertyRange(values);
    onFiltersChange({
      ...filters,
      streetPropertyRange: { min: values[0], max: values[1] },
    });
  };

  const clearAllFilters = () => {
    const resetFilters = {
      cda: [],
      propertyRange: { min: 0, max: 100 },
      dateRange: { start: "", end: "" },
      propertyTypes: [],
      streetSearch: "",
      streetPropertyRange: { min: 0, max: 100 },
    };
    setTempPropertyRange([0, 100]);
    setTempStreetPropertyRange([0, 100]);
    onFiltersChange(resetFilters);
  };

  const activeFiltersCount =
    filters.cda.length +
    (filters.dateRange.start || filters.dateRange.end ? 1 : 0) +
    (filters.propertyRange.min !== 0 || filters.propertyRange.max !== 100 ? 1 : 0) +
    filters.propertyTypes.length +
    (filters.streetSearch ? 1 : 0) +
    (filters.streetPropertyRange.min !== 0 || filters.streetPropertyRange.max !== 100 ? 1 : 0);

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            Filter CDAs & Streets
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-muted-foreground hover:text-foreground">
              <RotateCcw className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* CDA Filter */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Community Development Association</Label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {uniqueCDAs.map((cda) => (
              <div key={cda} className="flex items-center space-x-2">
                <Checkbox id={`cda-${cda}`} checked={filters.cda.includes(cda)} onCheckedChange={(checked) => handleCDAChange(cda, !!checked)} />
                <Label htmlFor={`cda-${cda}`} className="text-sm text-foreground cursor-pointer flex-1">
                  {cda}
                </Label>
                <Badge variant="outline" className="text-xs">
                  {streets.filter((s) => s.cda === cda).length}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Property Count Range (Total properties per CDA) */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Total Properties per CDA</Label>
          <div className="px-2">
            <Slider value={tempPropertyRange} onValueChange={handlePropertyRangeChange} max={100} min={0} step={5} className="w-full" />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>Min: {tempPropertyRange[0]}</span>
              <span>Max: {tempPropertyRange[1]}</span>
            </div>
          </div>
        </div>

        {/* Date Range Filter */}
        <div>
          <Label className="text-sm font-medium mb-3 block flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Registration Date
          </Label>
          <div className="space-y-3">
            <div>
              <Label htmlFor="start-date" className="text-xs text-muted-foreground">
                From
              </Label>
              <Input
                id="start-date"
                type="date"
                value={filters.dateRange.start}
                onChange={(e) => handleDateRangeChange("start", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="end-date" className="text-xs text-muted-foreground">
                To
              </Label>
              <Input
                id="end-date"
                type="date"
                value={filters.dateRange.end}
                onChange={(e) => handleDateRangeChange("end", e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Property Types Filter */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Property Types</Label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {propertyTypeOptions.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`property-type-${type}`}
                  checked={filters.propertyTypes.includes(type)}
                  onCheckedChange={(checked) => handlePropertyTypeChange(type, !!checked)}
                />
                <Label htmlFor={`property-type-${type}`} className="text-sm text-foreground cursor-pointer">
                  {type}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Street Search */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Search Streets</Label>
          <Input
            placeholder="Search by street name..."
            value={filters.streetSearch}
            onChange={(e) => handleStreetSearchChange(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Street Property Count Range */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Properties per Street</Label>
          <div className="px-2">
            <Slider value={tempStreetPropertyRange} onValueChange={handleStreetPropertyRangeChange} max={100} min={0} step={5} className="w-full" />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>Min: {tempStreetPropertyRange[0]}</span>
              <span>Max: {tempStreetPropertyRange[1]}</span>
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div>
            <Label className="text-sm font-medium mb-2 block">Active Filters</Label>
            <div className="flex flex-wrap gap-1">
              {filters.cda.map((cda) => (
                <Badge key={cda} variant="secondary" className="text-xs flex items-center gap-1">
                  {cda}
                  <button onClick={() => handleCDAChange(cda, false)} className="hover:text-foreground">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {(filters.propertyRange.min !== 0 || filters.propertyRange.max !== 100) && (
                <Badge variant="secondary" className="text-xs flex items-center gap-1">
                  CDA Props: {filters.propertyRange.min}-{filters.propertyRange.max}
                  <button onClick={() => handlePropertyRangeChange([0, 100])} className="hover:text-foreground">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {(filters.dateRange.start || filters.dateRange.end) && (
                <Badge variant="secondary" className="text-xs flex items-center gap-1">
                  Date Range
                  <button onClick={() => handleDateRangeChange("start", "")} className="hover:text-foreground">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {filters.propertyTypes.map((type) => (
                <Badge key={type} variant="secondary" className="text-xs flex items-center gap-1">
                  {type}
                  <button onClick={() => handlePropertyTypeChange(type, false)} className="hover:text-foreground">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {filters.streetSearch && (
                <Badge variant="secondary" className="text-xs flex items-center gap-1">
                  Search: {filters.streetSearch}
                  <button onClick={() => handleStreetSearchChange("")} className="hover:text-foreground">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {(filters.streetPropertyRange.min !== 0 || filters.streetPropertyRange.max !== 100) && (
                <Badge variant="secondary" className="text-xs flex items-center gap-1">
                  Street Props: {filters.streetPropertyRange.min}-{filters.streetPropertyRange.max}
                  <button onClick={() => handleStreetPropertyRangeChange([0, 100])} className="hover:text-foreground">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
