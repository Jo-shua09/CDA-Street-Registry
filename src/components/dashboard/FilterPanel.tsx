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
    ward?: string; // Add ward to filters to filter CDAs by ward
  };
  onFiltersChange: (filters: any) => void;
  streets: Array<{
    cda: string;
    ward: string; // Add ward to street type for filtering
    propertyCount: {
      houses: number;
      shops: number;
      hotels: number;
      others: number;
    };
    registrationDate: string;
  }>;
}

export const FilterPanel = ({ filters, onFiltersChange, streets }: FilterPanelProps) => {
  const [tempPropertyRange, setTempPropertyRange] = useState([filters.propertyRange.min, filters.propertyRange.max]);

  // Get unique CDAs from streets
  const uniqueCDAs = Array.from(new Set(streets.map((street) => street.cda))).sort();

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

  const clearAllFilters = () => {
    const resetFilters = {
      cda: [],
      propertyRange: { min: 0, max: 100 },
      dateRange: { start: "", end: "" },
    };
    setTempPropertyRange([0, 100]);
    onFiltersChange(resetFilters);
  };

  const activeFiltersCount =
    filters.cda.length +
    (filters.dateRange.start || filters.dateRange.end ? 1 : 0) +
    (filters.propertyRange.min !== 0 || filters.propertyRange.max !== 100 ? 1 : 0);

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            Filter Streets
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

        {/* Property Count Range */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Number of Properties</Label>
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
                <Badge variant="secondary" className="text-xs">
                  Properties: {filters.propertyRange.min}-{filters.propertyRange.max}
                </Badge>
              )}
              {(filters.dateRange.start || filters.dateRange.end) && (
                <Badge variant="secondary" className="text-xs">
                  Date Range
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
