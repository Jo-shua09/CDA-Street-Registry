import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, MapPin, Home, X, Users, Plus, Menu, LogOut, Building, Printer, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { FilterPanel } from "@/components/dashboard/FilterPanel";
import { CdaCard } from "@/components/dashboard/CdaCard";
import { StreetForm } from "@/components/street/StreetForm";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
// import logo from "/logo.png";

interface StreetFormData {
  name: string;
  cda: string;
  state: string;
  lg: string;
  lcda: string;
  description: string;
  houses: number;
  shops: number;
  hotels: number;
  others: number;
  registrationDate: string;
}

// Mock data
const mockStreets = [
  {
    id: 1,
    name: "Ahmadu Bello Avenue",
    cda: "Phase 1 CDA",
    state: "Lagos State",
    lg: "Lagos Island LGA",
    lcda: "Victoria Island LCDA",
    propertyCount: {
      houses: 1,
      shops: 1,
      hotels: 1,
      others: 1,
    },
    registrationDate: "2023-03-15",
    description: "Main commercial avenue with mixed residential and commercial properties",
  },
  {
    id: 2,
    name: "Marina Street",
    cda: "Phase 1 CDA",
    state: "Lagos State",
    lg: "Lagos Island LGA",
    lcda: "Victoria Island LCDA",
    propertyCount: {
      houses: 2,
      shops: 0,
      hotels: 1,
      others: 0,
    },
    registrationDate: "2023-03-16",
    description: "Residential street with some commercial properties",
  },
  {
    id: 3,
    name: "Adeola Odeku Street",
    cda: "Phase 2 CDA",
    state: "Lagos State",
    lg: "Lagos Island LGA",
    lcda: "Victoria Island LCDA",
    propertyCount: {
      houses: 1,
      shops: 3,
      hotels: 0,
      others: 1,
    },
    registrationDate: "2023-03-17",
    description: "Commercial street with offices and shops",
  },
];

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showStreetForm, setShowStreetForm] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    cda: [],
    propertyRange: { min: 0, max: 100 },
    dateRange: { start: "", end: "" },
  });
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const itemsPerPage = 12; // Max 12 CDAs per page

  const handleLogout = () => {
    navigate("/");
  };

  const handleRegisterStreet = () => {
    setShowStreetForm(true);
  };

  const handleStreetSubmit = (streetData: StreetFormData & { registrationDate: string }) => {
    // Add the new street to mock data
    const newStreet = {
      id: mockStreets.length + 1,
      name: streetData.name,
      cda: streetData.cda,
      state: streetData.state,
      lg: streetData.lg,
      lcda: streetData.lcda,
      propertyCount: {
        houses: streetData.houses,
        shops: streetData.shops,
        hotels: streetData.hotels,
        others: streetData.others,
      },
      registrationDate: streetData.registrationDate,
      description: streetData.description,
    };

    // Update mock data (in a real app, this would be an API call)
    mockStreets.push(newStreet);
  };

  const handleStreetClick = (streetId: number) => {
    // For now, just navigate to street details
    navigate(`/street/${streetId}`);
  };

  // Print functions
  const printCDAs = () => {
    // Create a new window for printing
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const cdaData = Object.keys(groupedStreets).map((cda, index) => {
      const streets = groupedStreets[cda];
      const totalProperties = streets.reduce((sum, street) => {
        return sum + street.propertyCount.houses + street.propertyCount.shops + street.propertyCount.hotels + street.propertyCount.others;
      }, 0);

      return {
        number: index + 1,
        name: cda,
        streetsCount: streets.length,
        propertiesCount: totalProperties,
      };
    });

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>CDA Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { text-align: center; color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .header { text-align: center; margin-bottom: 30px; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Community Development Associations Report</h1>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
          </div>

          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>CDA Name</th>
                <th>Number of Streets</th>
                <th>Total Properties</th>
              </tr>
            </thead>
            <tbody>
              ${cdaData
                .map(
                  (cda) => `
                <tr>
                  <td>${cda.number}</td>
                  <td>${cda.name}</td>
                  <td>${cda.streetsCount}</td>
                  <td>${cda.propertiesCount}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>

          <div class="footer">
            <p>Total CDAs: ${Object.keys(groupedStreets).length}</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

  const printStreets = () => {
    // Create a new window for printing
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const streetData = mockStreets.map((street, index) => {
      const totalProperties = street.propertyCount.houses + street.propertyCount.shops + street.propertyCount.hotels + street.propertyCount.others;
      const registrationDate = new Date(street.registrationDate).toLocaleDateString();

      return {
        number: index + 1,
        name: street.name,
        cda: street.cda,
        properties: totalProperties,
        registrationDate: registrationDate,
      };
    });

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Registered Streets Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { text-align: center; color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .header { text-align: center; margin-bottom: 30px; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Registered Streets Report</h1>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
          </div>

          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Street Name</th>
                <th>CDA</th>
                <th>Properties</th>
                <th>Registration Date</th>
              </tr>
            </thead>
            <tbody>
              ${streetData
                .map(
                  (street) => `
                <tr>
                  <td>${street.number}</td>
                  <td>${street.name}</td>
                  <td>${street.cda}</td>
                  <td>${street.properties}</td>
                  <td>${street.registrationDate}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>

          <div class="footer">
            <p>Total Streets: ${mockStreets.length}</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

  // Group streets by CDA
  const groupedStreets = mockStreets.reduce((acc, street) => {
    if (!acc[street.cda]) {
      acc[street.cda] = [];
    }
    acc[street.cda].push(street);
    return acc;
  }, {} as Record<string, typeof mockStreets>);

  const filteredCdas = Object.keys(groupedStreets).filter((cda) => {
    const streets = groupedStreets[cda];
    const matchesSearch =
      cda.toLowerCase().includes(searchTerm.toLowerCase()) || streets.some((street) => street.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCDA = selectedFilters.cda.length === 0 || selectedFilters.cda.includes(cda);

    const totalProperties = streets.reduce((sum, street) => {
      return sum + street.propertyCount.houses + street.propertyCount.shops + street.propertyCount.hotels + street.propertyCount.others;
    }, 0);

    const matchesPropertyCount = totalProperties >= selectedFilters.propertyRange.min && totalProperties <= selectedFilters.propertyRange.max;

    return matchesSearch && matchesCDA && matchesPropertyCount;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredCdas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCdas = filteredCdas.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <img src="./logo.png" alt="CDA Registry Logo" className="h-10 w-10 object-contain" />
              <div>
                <h1 className="text-lg font-semibold text-foreground">Street Registry</h1>
                <p className="text-sm text-muted-foreground">Street & Property Management</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="text-muted-foreground hover:text-foreground">
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={printCDAs}>
                    <Building className="h-4 w-4 mr-2" />
                    Print CDAs
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={printStreets}>
                    <MapPin className="h-4 w-4 mr-2" />
                    Print Registered Streets
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-foreground">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search and Stats */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">CDA Directory</h2>
              <p className="text-muted-foreground">Manage and monitor all registered CDAs and their streets</p>
            </div>

            <Button className="mt-4 sm:mt-0" onClick={handleRegisterStreet}>
              <Plus className="h-4 w-4 mr-2" />
              Register New Street
            </Button>
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
                    <p className="text-2xl font-bold text-foreground">{Object.keys(groupedStreets).length}</p>
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
                    <p className="text-2xl font-bold text-foreground">{mockStreets.length}</p>
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
                      {mockStreets.reduce((sum, street) => {
                        const total =
                          street.propertyCount.houses + street.propertyCount.shops + street.propertyCount.hotels + street.propertyCount.others;
                        return sum + total;
                      }, 0)}
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
                className="pl-10 h-12 w-full text-lg"
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
              <FilterPanel filters={selectedFilters} onFiltersChange={setSelectedFilters} streets={mockStreets} />
            </div>
          )}

          {/* CDA List */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                Showing {filteredCdas.length} of {Object.keys(groupedStreets).length} CDAs
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

            {filteredCdas.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No CDAs found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="space-y-4">
                  {paginatedCdas.map((cda) => (
                    <CdaCard key={cda} cda={cda} streets={groupedStreets[cda]} onStreetClick={handleStreetClick} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => handlePageChange(currentPage - 1)}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <PaginationItem key={page}>
                            <PaginationLink onClick={() => handlePageChange(page)} isActive={currentPage === page} className="cursor-pointer">
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ))}

                        <PaginationItem>
                          <PaginationNext
                            onClick={() => handlePageChange(currentPage + 1)}
                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Street Form Modal */}
      {showStreetForm && <StreetForm onClose={() => setShowStreetForm(false)} onSubmit={handleStreetSubmit} />}
    </div>
  );
};

export default Dashboard;
