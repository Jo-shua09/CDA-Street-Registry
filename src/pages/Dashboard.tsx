import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  MapPin, 
  Home, 
  Calendar,
  Users,
  Plus,
  Menu,
  LogOut
} from 'lucide-react';
import { FilterPanel } from '@/components/dashboard/FilterPanel';
import { StreetCard } from '@/components/dashboard/StreetCard';

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
      houses: 25,
      shops: 15,
      hotels: 3,
      others: 2
    },
    registrationDate: "2023-03-15",
    description: "Main commercial avenue with mixed residential and commercial properties"
  },
  {
    id: 2,
    name: "Victoria Island Close",
    cda: "Victoria CDA",
    state: "Lagos State",
    lg: "Lagos Island LGA", 
    lcda: "Victoria Island LCDA",
    propertyCount: {
      houses: 20,
      shops: 5,
      hotels: 2,
      others: 1
    },
    registrationDate: "2023-02-20",
    description: "Residential close with luxury properties"
  },
  {
    id: 3,
    name: "Opebi Road",
    cda: "Ikeja CDA",
    state: "Lagos State",
    lg: "Ikeja LGA",
    lcda: "Ikeja LCDA",
    propertyCount: {
      houses: 35,
      shops: 25,
      hotels: 4,
      others: 3
    },
    registrationDate: "2023-01-10",
    description: "Major road with commercial complexes and residential estates"
  },
  {
    id: 4,
    name: "Allen Avenue",
    cda: "Ikeja CDA",
    state: "Lagos State",
    lg: "Ikeja LGA",
    lcda: "Allen Avenue LCDA",
    propertyCount: {
      houses: 20,
      shops: 30,
      hotels: 1,
      others: 1
    },
    registrationDate: "2023-04-05",
    description: "Busy commercial street with offices and shops"
  },
  {
    id: 5,
    name: "Banana Island Circuit",
    cda: "Ikoyi CDA",
    state: "Lagos State",
    lg: "Lagos Island LGA",
    lcda: "Ikoyi/Obalende LCDA",
    propertyCount: {
      houses: 12,
      shops: 2,
      hotels: 1,
      others: 0
    },
    registrationDate: "2023-05-12",
    description: "Exclusive residential area with premium properties"
  }
];

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    cda: [],
    propertyRange: { min: 0, max: 100 },
    dateRange: { start: '', end: '' }
  });
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  const filteredStreets = mockStreets.filter(street => {
    const matchesSearch = street.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         street.cda.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCDA = selectedFilters.cda.length === 0 || 
                       selectedFilters.cda.includes(street.cda);
    
    const totalProperties = street.propertyCount.houses + street.propertyCount.shops + 
                       street.propertyCount.hotels + street.propertyCount.others;
    
    const matchesPropertyCount = totalProperties >= selectedFilters.propertyRange.min &&
                                totalProperties <= selectedFilters.propertyRange.max;
    
    return matchesSearch && matchesCDA && matchesPropertyCount;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-primary p-2 rounded-lg">
                <MapPin className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">CDA Registry</h1>
                <p className="text-sm text-muted-foreground">Street & Property Management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="hidden sm:flex"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground"
              >
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
              <h2 className="text-2xl font-bold text-foreground mb-2">Street Directory</h2>
              <p className="text-muted-foreground">
                Manage and monitor all registered streets and properties
              </p>
            </div>
            <Button className="mt-4 sm:mt-0">
              <Plus className="h-4 w-4 mr-2" />
              Register New Street
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary-light p-2 rounded-lg">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Streets</p>
                    <p className="text-2xl font-bold text-foreground">
                      {mockStreets.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-success-light p-2 rounded-lg">
                    <Home className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Properties</p>
                    <p className="text-2xl font-bold text-foreground">
                      {mockStreets.reduce((sum, street) => {
                        const total = street.propertyCount.houses + street.propertyCount.shops + 
                                     street.propertyCount.hotels + street.propertyCount.others;
                        return sum + total;
                      }, 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-warning-light p-2 rounded-lg">
                    <Users className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active CDAs</p>
                    <p className="text-2xl font-bold text-foreground">
                      {new Set(mockStreets.map(s => s.cda)).size}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search streets by name or CDA..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter Panel */}
          {showFilters && (
            <div className="lg:w-80">
              <FilterPanel 
                filters={selectedFilters}
                onFiltersChange={setSelectedFilters}
                streets={mockStreets}
              />
            </div>
          )}

          {/* Streets List */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                Showing {filteredStreets.length} of {mockStreets.length} streets
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <Menu className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>

            {filteredStreets.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No streets found
                  </h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filter criteria
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredStreets.map((street) => (
                  <StreetCard key={street.id} street={street} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;