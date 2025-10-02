import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, MapPin, Home, X, Building, ChevronLeft, ChevronRight, ArrowLeft, Plus, ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FilterPanel } from "@/components/dashboard/FilterPanel";
import { CdaCard } from "@/components/dashboard/CdaCard";
import { CdaEditForm } from "@/components/dashboard/CdaEditForm";
import { StreetEditForm } from "@/components/street/StreetEditForm";
import { StreetForm } from "@/components/street/StreetForm";
import { CdaForm } from "@/components/dashboard/CdaForm";
import { ExtendedCdaData, ExtendedStreetData } from "@/data/types";
import { getStoredCDAs, getStoredStreets, getStoredProperties, saveCDA, saveStreet, deleteCDA, deleteStreet } from "@/utils/storage";

interface Street {
  id: number;
  name: string;
  cda: string;
  ward: string;
  lg: string;
  lcda: string;
  registrationDate: string;
  description: string;
  properties: Array<{ type: string }>;
  propertyCount?: {
    houses: number;
    shops: number;
    hotels: number;
    others: number;
  };
}

const CDADirectory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    cda: [] as string[],
    propertyRange: { min: 0, max: 100 },
    dateRange: { start: "", end: "" },
    propertyTypes: [] as string[],
    streetSearch: "",
    streetPropertyRange: { min: 0, max: 100 },
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedWard, setSelectedWard] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingCdaId, setDeletingCdaId] = useState<number | null>(null);
  const [deletingStreetId, setDeletingStreetId] = useState<number | null>(null);
  const [deletingType, setDeletingType] = useState<"cda" | "street" | null>(null);
  const [showCdaEditForm, setShowCdaEditForm] = useState(false);
  const [showStreetEditForm, setShowStreetEditForm] = useState(false);
  const [showStreetForm, setShowStreetForm] = useState(false);
  const [showCdaForm, setShowCdaForm] = useState(false);
  const [editingCda, setEditingCda] = useState<ExtendedCdaData | null>(null);
  const [editingStreet, setEditingStreet] = useState<ExtendedStreetData | null>(null);
  const [cdas, setCdas] = useState<ExtendedCdaData[]>([]);
  const [streets, setStreets] = useState<ExtendedStreetData[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [searchMode, setSearchMode] = useState<"cda" | "property">("cda");

  // Property types for search
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
    "Mansion / Villa",
    "Manufactured / Mobile Home",
    "Cottage",
    "Restaurant / Café",
    "Shopping Mall / Plaza",
    "Medical Office / Clinic",
    "Factory / Manufacturing Plant",
    "Distribution Center",
    "Flex Space",
    "School / University",
    "Hospital / Nursing Home",
    "Church / Place of Worship",
    "Government Building",
    "Theater / Cinema",
    "Gas Station",
    "Other",
  ];

  // Safe function to get property count with defaults
  const getPropertyCount = (street: ExtendedStreetData) => {
    if (!street.propertyCount) {
      return { houses: 0, shops: 0, hotels: 0, others: 0 };
    }
    return {
      houses: street.propertyCount.houses || 0,
      shops: street.propertyCount.shops || 0,
      hotels: street.propertyCount.hotels || 0,
      others: street.propertyCount.others || 0,
    };
  };

  // Group streets by ward, then by CDA
  const groupedData = streets.reduce((acc, street) => {
    if (!acc[street.ward]) {
      acc[street.ward] = {};
    }
    if (!acc[street.ward][street.cda]) {
      acc[street.ward][street.cda] = [];
    }
    acc[street.ward][street.cda].push(street);
    return acc;
  }, {} as Record<string, Record<string, ExtendedStreetData[]>>);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const CDAS_PER_PAGE = 30;

  // Initialize from URL parameters
  useEffect(() => {
    const wardFromUrl = searchParams.get("ward");
    if (wardFromUrl) {
      setSelectedWard(wardFromUrl);
    }
    setCurrentPage(1);
  }, [searchParams]);

  // Load data from storage
  useEffect(() => {
    const loadedCdas = getStoredCDAs();
    const loadedStreets = getStoredStreets();
    const loadedProperties = getStoredProperties();
    setCdas(loadedCdas);
    setStreets(loadedStreets);
    setProperties(loadedProperties);
  }, [refreshTrigger]);

  // Reset filters when ward changes
  useEffect(() => {
    setSelectedFilters({
      cda: [],
      propertyRange: { min: 0, max: 100 },
      dateRange: { start: "", end: "" },
      propertyTypes: [],
      streetSearch: "",
      streetPropertyRange: { min: 0, max: 100 },
    });
    setCurrentPage(1);
  }, [selectedWard]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilters, selectedWard, searchTerm, searchMode]);

  // Get unique wards sorted
  const wards = Array.from(new Set(cdas.map((cda) => cda.ward))).sort();

  // Filter properties by type for property search
  const getPropertiesByType = (propertyType: string) => {
    return properties.filter((property) => property.type.toLowerCase().includes(propertyType.toLowerCase()));
  };

  // Get CDAs and streets that have properties of specific type
  const getCDAsWithPropertyType = (propertyType: string) => {
    const propertiesOfType = getPropertiesByType(propertyType);

    // Get unique street IDs that have these properties
    const streetIdsWithPropertyType = [...new Set(propertiesOfType.map((p) => p.streetId))];

    // Get streets that have these properties
    const streetsWithPropertyType = streets.filter((street) => streetIdsWithPropertyType.includes(street.id));

    // Group by CDA
    const cdasWithPropertyType = cdas.filter((cda) => streetsWithPropertyType.some((street) => street.cda === cda.name));

    return {
      properties: propertiesOfType,
      streets: streetsWithPropertyType,
      cdas: cdasWithPropertyType,
    };
  };

  // Filter CDAs based on search, filters, and selected ward
  const filteredCdas = cdas.filter((cda) => {
    if (selectedWard && cda.ward !== selectedWard) {
      return false;
    }

    const streetsInCda = groupedData[cda.ward]?.[cda.name] || [];

    // Filter streets by all criteria
    const filteredStreets = streetsInCda.filter((street) => {
      // Date range filter
      const streetDate = new Date(street.registrationDate);
      const startDate = selectedFilters.dateRange.start ? new Date(selectedFilters.dateRange.start) : null;
      const endDate = selectedFilters.dateRange.end ? new Date(selectedFilters.dateRange.end) : null;
      if (startDate && streetDate < startDate) return false;
      if (endDate && streetDate > endDate) return false;

      // Street search filter
      if (selectedFilters.streetSearch && !street.name.toLowerCase().includes(selectedFilters.streetSearch.toLowerCase())) {
        return false;
      }

      // Property types filter - check if street has any of the selected property types
      if (selectedFilters.propertyTypes.length > 0) {
        const propertyCount = getPropertyCount(street);

        // Check if street has any of the selected property types
        const hasSelectedType = selectedFilters.propertyTypes.some((selectedType) => {
          // Convert property type to the corresponding property count field
          const typeMapping: { [key: string]: keyof typeof propertyCount } = {
            House: "houses",
            Shop: "shops",
            Hotel: "hotels",
            Other: "others",
          };

          const countField = typeMapping[selectedType];
          if (countField) {
            return propertyCount[countField] > 0;
          }

          // For other property types, check if they exist in the street's properties array
          return street.properties?.some((prop) => prop.type.toLowerCase().includes(selectedType.toLowerCase()));
        });

        if (!hasSelectedType) return false;
      }

      // Street property range filter
      const totalStreetProperties =
        getPropertyCount(street).houses + getPropertyCount(street).shops + getPropertyCount(street).hotels + getPropertyCount(street).others;
      if (totalStreetProperties < selectedFilters.streetPropertyRange.min || totalStreetProperties > selectedFilters.streetPropertyRange.max) {
        return false;
      }

      return true;
    });

    // If no streets after filters and not viewing a specific ward, exclude this CDA
    if (!selectedWard && filteredStreets.length === 0) {
      return false;
    }

    const matchesSearch =
      cda.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cda.ward.toLowerCase().includes(searchTerm.toLowerCase()) ||
      filteredStreets.some((street) => street.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCDA = selectedFilters.cda.length === 0 || selectedFilters.cda.includes(cda.name);

    // CDA property range filter (total properties in CDA)
    const totalProperties = filteredStreets.reduce((sum, street) => {
      const propertyCount = getPropertyCount(street);
      return sum + propertyCount.houses + propertyCount.shops + propertyCount.hotels + propertyCount.others;
    }, 0);

    const matchesPropertyCount = totalProperties >= selectedFilters.propertyRange.min && totalProperties <= selectedFilters.propertyRange.max;

    return matchesSearch && matchesCDA && matchesPropertyCount;
  });

  // Property type search results
  const propertyTypeSearchResults =
    searchMode === "property" && searchTerm.trim() ? getCDAsWithPropertyType(searchTerm.trim()) : { properties: [], streets: [], cdas: [] };

  // Determine what to display based on search mode
  const displayCDAs = searchMode === "property" && searchTerm.trim() ? propertyTypeSearchResults.cdas : filteredCdas;

  // Pagination
  const totalPages = Math.ceil(displayCDAs.length / CDAS_PER_PAGE);
  const startIndex = (currentPage - 1) * CDAS_PER_PAGE;
  const paginatedCDAs = displayCDAs.slice(startIndex, startIndex + CDAS_PER_PAGE);

  // Calculate total properties for stats cards
  const calculateTotalProperties = (streetsList: ExtendedStreetData[]) => {
    return streetsList.reduce((sum, street) => {
      const propertyCount = getPropertyCount(street);
      return sum + propertyCount.houses + propertyCount.shops + propertyCount.hotels + propertyCount.others;
    }, 0);
  };

  // Calculate property type stats for search
  const getPropertyTypeStats = () => {
    if (searchMode !== "property" || !searchTerm.trim()) {
      return { total: 0, cdaCount: 0, streetCount: 0 };
    }

    return {
      total: propertyTypeSearchResults.properties.length,
      cdaCount: propertyTypeSearchResults.cdas.length,
      streetCount: propertyTypeSearchResults.streets.length,
    };
  };

  const propertyTypeStats = getPropertyTypeStats();

  // Property management functions
  const cleanupOrphanedProperties = () => {
    const storedProperties = getStoredProperties();
    const storedStreets = getStoredStreets();

    const validStreetIds = new Set(storedStreets.map((street) => street.id));
    const validProperties = storedProperties.filter((property) => validStreetIds.has(property.streetId));

    localStorage.setItem("properties", JSON.stringify(validProperties));
    setProperties(validProperties);
    setRefreshTrigger((prev) => prev + 1);
    alert(`Cleaned up ${storedProperties.length - validProperties.length} orphaned properties`);
  };

  const deleteProperty = (propertyId: number) => {
    const storedProperties = getStoredProperties();
    const updatedProperties = storedProperties.filter((property) => property.id !== propertyId);
    localStorage.setItem("properties", JSON.stringify(updatedProperties));
    setProperties(updatedProperties);
    setRefreshTrigger((prev) => prev + 1);
  };

  const viewAllProperties = () => {
    const storedProperties = getStoredProperties();
    console.log("All properties in localStorage:", storedProperties);
    alert(`Total properties: ${storedProperties.length}\nCheck console for details.`);
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  const handleRegisterStreet = () => {
    setShowStreetForm(true);
  };

  const handleRegisterCda = () => {
    setShowCdaForm(true);
  };

  const handleStreetFormSubmit = (streetData: any) => {
    const extendedStreetData: ExtendedStreetData = {
      id: streetData.id || Date.now(),
      name: streetData.name,
      cda: streetData.cda,
      ward: streetData.ward,
      lg: streetData.lg || "",
      lcda: streetData.lcda || "",
      registrationDate: streetData.registrationDate,
      description: streetData.description || "",
      properties: streetData.properties || [],
      propertyCount: streetData.propertyCount || { houses: 0, shops: 0, hotels: 0, others: 0 },
    };
    saveStreet(extendedStreetData);
    setRefreshTrigger((prev) => prev + 1);
    setShowStreetForm(false);
  };

  const handleCdaFormSubmit = (cdaData: any) => {
    const extendedCdaData: ExtendedCdaData = {
      id: cdaData.id || Date.now(),
      name: cdaData.name,
      ward: cdaData.ward,
      lg: cdaData.lg,
      description: cdaData.description || "",
      chairman: cdaData.chairman || { name: "", contact: "" },
      registrationDate: cdaData.registrationDate,
      streetCount: 0,
      propertyCount: 0,
    };
    saveCDA(extendedCdaData);
    setRefreshTrigger((prev) => prev + 1);
    setShowCdaForm(false);
  };

  const handleStreetClick = (streetId: number) => {
    navigate(`/street/${streetId}`);
  };

  const handleEditCda = (cda: ExtendedCdaData) => {
    setEditingCda(cda);
    setShowCdaEditForm(true);
  };

  const handleCdaEditSubmit = (updatedCda: ExtendedCdaData) => {
    saveCDA(updatedCda);
    setRefreshTrigger((prev) => prev + 1);
    setShowCdaEditForm(false);
    setEditingCda(null);
  };

  const handleDeleteCda = (cdaId: number) => {
    setDeletingType("cda");
    setDeletingCdaId(cdaId);
    setShowDeleteConfirm(true);
  };

  const handleEditStreet = (street: ExtendedStreetData) => {
    setEditingStreet(street);
    setShowStreetEditForm(true);
  };

  const handleStreetEditSubmit = (updatedStreet: ExtendedStreetData) => {
    const streetWithDefaults = {
      ...updatedStreet,
      propertyCount: updatedStreet.propertyCount || { houses: 0, shops: 0, hotels: 0, others: 0 },
    };
    saveStreet(streetWithDefaults);
    setRefreshTrigger((prev) => prev + 1);
    setShowStreetEditForm(false);
    setEditingStreet(null);
  };

  const handleDeleteStreet = (streetId: number) => {
    setDeletingType("street");
    setDeletingStreetId(streetId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (deletingType === "cda" && deletingCdaId !== null) {
      deleteCDA(deletingCdaId);
    } else if (deletingType === "street" && deletingStreetId !== null) {
      deleteStreet(deletingStreetId);
    }
    setRefreshTrigger((prev) => prev + 1);
    setShowDeleteConfirm(false);
    setDeletingCdaId(null);
    setDeletingStreetId(null);
    setDeletingType(null);
  };

  const clearWardFilter = () => {
    setSelectedWard(null);
    setCurrentPage(1);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);

    if (value.trim() && propertyTypes.some((type) => type.toLowerCase().includes(value.toLowerCase().trim()))) {
      setSearchMode("property");
    } else {
      setSearchMode("cda");
    }

    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchMode("cda");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-row items-center justify-between h-16 py-4 sm:py-0">
            <div className="flex items-center space-x-2">
              <img src="./logo.png" alt="CDA Registry Logo" className="h-10 w-10 object-contain" />
              <div>
                <h1 className="text-sm sm:text-lg font-semibold text-foreground">CDA Directory</h1>
                <p className="text-xs sm:text-sm sm:block hidden text-muted-foreground">Street & Property Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="default" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Register
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleRegisterCda}>
                    <Building className="h-4 w-4 mr-2" />
                    Register CDA
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleRegisterStreet}>
                    <MapPin className="h-4 w-4 mr-2" />
                    Register Street
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-2">
        <div className="my-4">
          <Button variant="ghost" size="sm" onClick={handleBackToDashboard} className="bg-secondary">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        {/* Ward Filter Banner */}
        {/* {selectedWard && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Building className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-700">
                  Showing CDAs for: <strong>{selectedWard}</strong>
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={clearWardFilter}>
                <X className="h-4 w-4 mr-1" />
                Clear Filter
              </Button>
            </div>
          </div>
        )} */}

        {/* Search and Stats */}
        <div className="mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground">CDA Directory</h2>
            <p className="text-muted-foreground">
              {selectedWard ? `Managing CDAs in ${selectedWard}` : "Manage and monitor all registered CDAs and their streets"}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary-light p-3 rounded-lg">
                    <Building className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{searchMode === "property" && searchTerm.trim() ? "Matching CDAs" : "Total CDAs"}</p>
                    <p className="text-2xl font-bold text-foreground">
                      {searchMode === "property" && searchTerm.trim() ? propertyTypeStats.cdaCount : displayCDAs.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-success-light p-3 rounded-lg">
                    <MapPin className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {searchMode === "property" && searchTerm.trim() ? "Matching Streets" : "Total Streets"}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {searchMode === "property" && searchTerm.trim()
                        ? propertyTypeStats.streetCount
                        : selectedWard
                        ? displayCDAs.reduce((sum, cda) => {
                            const streets = groupedData[cda.ward]?.[cda.name] || [];
                            return sum + streets.length;
                          }, 0)
                        : streets.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-warning-light p-3 rounded-lg">
                    <Home className="h-6 w-6 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {searchMode === "property" && searchTerm.trim() ? `Total ${searchTerm}` : "Total Properties"}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {searchMode === "property" && searchTerm.trim()
                        ? propertyTypeStats.total
                        : selectedWard
                        ? displayCDAs.reduce((sum, cda) => {
                            const streets = groupedData[cda.ward]?.[cda.name] || [];
                            return sum + calculateTotalProperties(streets);
                          }, 0)
                        : calculateTotalProperties(streets)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search Bar */}
          <div className="flex items-center w-full space-x-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search CDAs, streets, or property (House, Office etc.)"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 h-12 w-full text-lg placeholder:text-xs sm:placeholder:text-sm"
              />
              {searchTerm && (
                <Button variant="ghost" size="sm" onClick={clearSearch} className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0">
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Filter button */}
            <Button variant="outline" size="lg" onClick={() => setShowFilters(!showFilters)} className="hidden lg:flex">
              {!showFilters ? (
                <>
                  <Filter className="h-4 w-4" />
                  Filters
                </>
              ) : (
                <>
                  <X className="h-4 w-4" />
                  Close
                </>
              )}
            </Button>
          </div>

          {/* Search Mode Indicator */}
          {searchMode === "property" && searchTerm.trim() && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Home className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-700">
                    Showing properties of type: <strong>{searchTerm}</strong>
                    <span className="ml-2 text-blue-600">
                      ({propertyTypeStats.total} properties across {propertyTypeStats.streetCount} streets in {propertyTypeStats.cdaCount} CDAs)
                    </span>
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={clearSearch}>
                  <X className="h-4 w-4 mr-1" />
                  Clear Search
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter Panel - FIXED: This was the main issue */}
          {showFilters && (
            <div className="lg:w-80">
              <FilterPanel
                filters={{ ...selectedFilters, ward: selectedWard || undefined }}
                onFiltersChange={(newFilters) => {
                  console.log("Filters updated:", newFilters);
                  setSelectedFilters(newFilters);
                  setCurrentPage(1);
                }}
                streets={selectedWard ? streets.filter((street) => street.ward === selectedWard) : streets}
              />
            </div>
          )}

          {/* CDA List */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                {searchMode === "property" && searchTerm.trim() ? (
                  <>
                    Showing {paginatedCDAs.length} of {displayCDAs.length} CDAs with {searchTerm} properties
                    {selectedWard && ` in ${selectedWard}`}
                  </>
                ) : (
                  <>
                    <div className="flex gap-x-1">
                      Showing {paginatedCDAs.length} of {displayCDAs.length} CDAs
                      {selectedWard && ` in ${selectedWard}`}
                      <span className="hidden sm:block">{` (Page ${currentPage} of ${totalPages})`}</span>
                    </div>
                    <div className="block sm:hidden">{` (Page ${currentPage} of ${totalPages})`}</div>
                  </>
                )}
              </p>
              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
                {!showFilters ? (
                  <>
                    <Filter className="h-4 w-4" />
                    Filters
                  </>
                ) : (
                  <>
                    <X className="h-4 w-4" />
                    Close
                  </>
                )}
              </Button>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mb-4">
                <Button variant="outline" size="sm" onClick={prevPage} disabled={currentPage === 1}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <Button variant="outline" size="sm" onClick={nextPage} disabled={currentPage === totalPages}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}

            {paginatedCDAs.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    {searchMode === "property" && searchTerm.trim() ? `No CDAs found with ${searchTerm} properties` : "No CDAs found"}
                  </h3>
                  <p className="text-muted-foreground">
                    {searchMode === "property" && searchTerm.trim()
                      ? "Try searching for a different property type"
                      : "Try adjusting your search or filter criteria"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-8">
                {Array.from(new Set(displayCDAs.map((cda) => cda.ward)))
                  .sort()
                  .map((ward) => {
                    const cdaInWard = paginatedCDAs.filter((cda) => cda.ward === ward);
                    return (
                      <div key={ward} className="space-y-4">
                        <h3 className="text-xl font-semibold text-foreground border-b pb-2">{ward}</h3>
                        <div className="space-y-4">
                          {cdaInWard.map((cda) => (
                            <CdaCard
                              key={cda.id}
                              cda={cda}
                              streets={
                                searchMode === "property" && searchTerm.trim()
                                  ? propertyTypeSearchResults.streets.filter((street) => street.cda === cda.name)
                                  : groupedData[cda.ward]?.[cda.name] || []
                              }
                              onStreetClick={handleStreetClick}
                              onEdit={handleEditCda}
                              onDelete={handleDeleteCda}
                              onEditStreet={handleEditStreet}
                              onDeleteStreet={handleDeleteStreet}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}

            {/* Pagination Controls Bottom */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <Button variant="outline" size="sm" onClick={prevPage} disabled={currentPage === 1}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <Button variant="outline" size="sm" onClick={nextPage} disabled={currentPage === totalPages}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="text-muted-foreground mb-6">Are you sure you want to delete this {deletingType}? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeletingCdaId(null);
                  setDeletingStreetId(null);
                  setDeletingType(null);
                }}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* CDA Edit Form Modal */}
      {showCdaEditForm && editingCda && (
        <CdaEditForm
          cda={editingCda}
          onClose={() => {
            setShowCdaEditForm(false);
            setEditingCda(null);
          }}
          onSubmit={handleCdaEditSubmit}
        />
      )}

      {/* Street Edit Form Modal */}
      {showStreetEditForm && editingStreet && (
        <StreetEditForm
          street={editingStreet}
          onClose={() => {
            setShowStreetEditForm(false);
            setEditingStreet(null);
          }}
          onSubmit={handleStreetEditSubmit}
        />
      )}

      {/* CDA Form Modal */}
      {showCdaForm && <CdaForm onClose={() => setShowCdaForm(false)} onSubmit={handleCdaFormSubmit} />}

      {/* Street Form Modal */}
      {showStreetForm && <StreetForm onClose={() => setShowStreetForm(false)} onSubmit={handleStreetFormSubmit} cdas={cdas} />}
    </div>
  );
};

export default CDADirectory;
