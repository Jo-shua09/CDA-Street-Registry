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
import { getStoredCDAs, getStoredStreets, saveCDA, saveStreet, deleteCDA, deleteStreet } from "@/utils/storage";

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
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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
  }, [searchParams, selectedFilters, searchTerm]);

  // Load data from storage
  useEffect(() => {
    const loadedCdas = getStoredCDAs();
    const loadedStreets = getStoredStreets();
    setCdas(loadedCdas);
    setStreets(loadedStreets);
  }, [refreshTrigger]);

  // Reset filters when ward changes
  useEffect(() => {
    setSelectedFilters({
      cda: [],
      propertyRange: { min: 0, max: 100 },
      dateRange: { start: "", end: "" },
    });
    setCurrentPage(1);
  }, [selectedWard]);

  // Get unique wards sorted
  const wards = Array.from(new Set(cdas.map((cda) => cda.ward))).sort();

  // Filter CDAs based on search, filters, and selected ward
  const filteredCdas = cdas.filter((cda) => {
    if (selectedWard && cda.ward !== selectedWard) {
      return false; // Only show CDAs of the selected ward
    }

    const streetsInCda = groupedData[cda.ward]?.[cda.name] || [];

    // Filter streets by registration date range
    const filteredStreetsByDate = streetsInCda.filter((street) => {
      const streetDate = new Date(street.registrationDate);
      const startDate = selectedFilters.dateRange.start ? new Date(selectedFilters.dateRange.start) : null;
      const endDate = selectedFilters.dateRange.end ? new Date(selectedFilters.dateRange.end) : null;

      if (startDate && streetDate < startDate) return false;
      if (endDate && streetDate > endDate) return false;
      return true;
    });

    // If no streets after date filter and not viewing a specific ward, exclude this CDA
    if (!selectedWard && filteredStreetsByDate.length === 0) {
      return false;
    }

    const matchesSearch =
      cda.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cda.ward.toLowerCase().includes(searchTerm.toLowerCase()) ||
      filteredStreetsByDate.some((street) => street.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCDA = selectedFilters.cda.length === 0 || selectedFilters.cda.includes(cda.name);

    // FIXED: Use safe property count function
    const totalProperties = filteredStreetsByDate.reduce((sum, street) => {
      const propertyCount = getPropertyCount(street);
      return sum + propertyCount.houses + propertyCount.shops + propertyCount.hotels + propertyCount.others;
    }, 0);

    const matchesPropertyCount = totalProperties >= selectedFilters.propertyRange.min && totalProperties <= selectedFilters.propertyRange.max;

    return matchesSearch && matchesCDA && matchesPropertyCount;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCdas.length / CDAS_PER_PAGE);
  const startIndex = (currentPage - 1) * CDAS_PER_PAGE;
  const paginatedCDAs = filteredCdas.slice(startIndex, startIndex + CDAS_PER_PAGE);

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  const handleRegisterStreet = () => {
    setShowStreetForm(true);
  };

  const handleRegisterCda = () => {
    setShowCdaForm(true);
  };

  const handleStreetFormSubmit = (streetData: ExtendedStreetData) => {
    // Ensure the street has proper propertyCount structure
    const streetWithDefaults = {
      ...streetData,
      propertyCount: streetData.propertyCount || { houses: 0, shops: 0, hotels: 0, others: 0 },
    };
    saveStreet(streetWithDefaults);
    setRefreshTrigger((prev) => prev + 1);
    setShowStreetForm(false);
  };

  const handleCdaFormSubmit = (cdaData: ExtendedCdaData) => {
    saveCDA(cdaData);
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
    // Ensure the street has proper propertyCount structure
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

  // Calculate total properties for stats cards - FIXED
  const calculateTotalProperties = (streetsList: ExtendedStreetData[]) => {
    return streetsList.reduce((sum, street) => {
      const propertyCount = getPropertyCount(street);
      return sum + propertyCount.houses + propertyCount.shops + propertyCount.hotels + propertyCount.others;
    }, 0);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-row items-center justify-between pt-6 h-16 py-4 sm:py-0">
            <div className="flex items-center space-x-2 mb-4 sm:mb-0">
              <img src="./logo.png" alt="CDA Registry Logo" className="h-10 w-10 object-contain" />
              <div>
                <h1 className="text-sm sm:text-lg font-semibold text-foreground">CDA Directory</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">Street & Property Management</p>
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
          <Button variant="ghost" size="sm" onClick={handleBackToDashboard} className="mr-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        {/* Ward Filter Banner */}
        {selectedWard && (
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
        )}

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
                    <p className="text-sm text-muted-foreground">Total CDAs</p>
                    <p className="text-2xl font-bold text-foreground">{filteredCdas.length}</p>
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
                    <p className="text-sm text-muted-foreground">Total Streets</p>
                    <p className="text-2xl font-bold text-foreground">
                      {selectedWard
                        ? filteredCdas.reduce((sum, cda) => {
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
                    <p className="text-sm text-muted-foreground">Total Properties</p>
                    <p className="text-2xl font-bold text-foreground">
                      {selectedWard
                        ? filteredCdas.reduce((sum, cda) => {
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
                placeholder="Search CDAs or streets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 w-full text-lg placeholder:text-sm"
              />
            </div>

            {/* Filter button */}
            <Button variant="outline" size="lg" onClick={() => setShowFilters(!showFilters)} className="hidden sm:flex">
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
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter Panel */}
          {showFilters && (
            <div className="lg:w-80">
              <FilterPanel
                filters={{ ...selectedFilters, ward: selectedWard || undefined }}
                onFiltersChange={setSelectedFilters}
                streets={selectedWard ? streets.filter((street) => street.ward === selectedWard) : streets}
              />
            </div>
          )}

          {/* CDA List */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                Showing {paginatedCDAs.length} of {filteredCdas.length} CDAs
                {selectedWard && ` in ${selectedWard}`}
                {` (Page ${currentPage} of ${totalPages})`}
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
                  <h3 className="text-lg font-medium text-foreground mb-2">No CDAs found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-8">
                {Array.from(new Set(filteredCdas.map((cda) => cda.ward)))
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
                              streets={groupedData[cda.ward]?.[cda.name] || []}
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
