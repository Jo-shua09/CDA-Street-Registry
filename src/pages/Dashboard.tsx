import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Building, MapPin, Home, Printer, ChevronDown, LogOut, Plus } from "lucide-react";
import { StreetForm } from "@/components/street/StreetForm";
import { CdaForm } from "@/components/dashboard/CdaForm";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface WardStats {
  name: string;
  cdaCount: number;
}

interface StreetFormData {
  name: string;
  ward: string;
  cda: string;
  description: string;
  registrationDate: string;
}

interface CdaFormData {
  name: string;
  ward: string;
  lg: string;
  description: string;
  registrationDate: string;
}

// Updated mock data for streets with CDA names
const mockStreets = [
  { id: 1, name: "Ahmadu Bello Avenue", ward: "Ward C1", cdaName: "Phase 1 CDA", propertyCount: 2 },
  { id: 2, name: "Allen Avenue", ward: "Ward C2", cdaName: "Sunrise CDA", propertyCount: 2 },
  { id: 3, name: "Palm Street", ward: "Ward C3", cdaName: "Palm Grove CDA", propertyCount: 2 },
  { id: 4, name: "Royal Road", ward: "Ward C4", cdaName: "Royal Estate CDA", propertyCount: 2 },
  { id: 5, name: "Mountain View", ward: "Ward C5", cdaName: "Mountain Top CDA", propertyCount: 2 },
  { id: 6, name: "River Bank", ward: "Ward C6", cdaName: "River Side CDA", propertyCount: 2 },
];

const mockCDAs = [
  { id: 1, name: "Phase 1 CDA", ward: "Ward C1", streetCount: 2, propertyCount: 1 },
  { id: 2, name: "Sunrise CDA", ward: "Ward C2", streetCount: 3, propertyCount: 2 },
  { id: 3, name: "Palm Grove CDA", ward: "Ward C3", streetCount: 4, propertyCount: 2 },
  { id: 4, name: "Royal Estate CDA", ward: "Ward C4", streetCount: 1, propertyCount: 2 },
  { id: 5, name: "Mountain Top CDA", ward: "Ward C5", streetCount: 2, propertyCount: 2 },
  { id: 6, name: "River Side CDA", ward: "Ward C6", streetCount: 3, propertyCount: 2 },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [showStreetForm, setShowStreetForm] = useState(false);
  const [showCdaForm, setShowCdaForm] = useState(false);

  // Generate wards data dynamically from mockCDAs
  const wardsData: WardStats[] = mockCDAs.reduce((acc, cda) => {
    const existing = acc.find((w) => w.name === cda.ward);
    if (existing) {
      existing.cdaCount++;
    } else {
      acc.push({ name: cda.ward, cdaCount: 1 });
    }
    return acc;
  }, [] as WardStats[]);

  const handleLogout = () => {
    navigate("/");
  };

  const handleNavigateToWard = (wardName: string) => {
    navigate(`/cda-directory?ward=${wardName}`);
  };

  const handleRegisterStreet = () => {
    setShowStreetForm(true);
  };

  const handleRegisterCda = () => {
    setShowCdaForm(true);
  };

  const handleStreetSubmit = (streetData: StreetFormData & { registrationDate: string }) => {
    console.log("Street submitted:", streetData);
    setShowStreetForm(false);
  };

  const handleCdaSubmit = (cdaData: CdaFormData & { registrationDate: string }) => {
    console.log("CDA submitted:", cdaData);
    setShowCdaForm(false);
  };

  const printCDAs = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

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
                <th>Ward</th>
                <th>Number of Streets</th>
                <th>Total Properties</th>
              </tr>
            </thead>
            <tbody>
              ${mockCDAs
                .map(
                  (cda, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${cda.name}</td>
                  <td>${cda.ward}</td>
                  <td>${cda.streetCount}</td>
                  <td>${cda.propertyCount}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>

          <div class="footer">
            <p>Total CDAs: ${mockCDAs.length}</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

  const printStreets = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

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
              <th>Ward</th>
              <th>CDA Name</th>
              <th>Number of Properties</th>
            </tr>
          </thead>
          <tbody>
            ${mockStreets
              .map(
                (street, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${street.name}</td>
                <td>${street.ward}</td>
                <td>${street.cdaName || "Multiple CDAs"}</td>
                <td>${street.propertyCount}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>

        <div class="footer">
          <p>Total Streets: ${mockStreets.length}</p>
          <p>Total Properties: ${mockStreets.reduce((sum, street) => sum + street.propertyCount, 0)}</p>
        </div>
      </body>
    </html>
  `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-row items-center justify-between pt-6 h-16 py-4 sm:py-0">
            <div className="flex items-center space-x-1">
              <img src="./logo.png" alt="CDA Registry Logo" className="h-10 w-10 object-contain" />
              <div>
                <h1 className="text-sm sm:text-lg font-semibold text-foreground">Street Registry</h1>
                <p className="text-xs sm:block hidden sm:text-sm text-muted-foreground">Street & Property Management</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 flex-wrap">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="text-muted-foreground hover:text-foreground">
                    <Printer className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Print</span>
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
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Ward Directory</h2>
              <p className="text-muted-foreground">Manage and monitor all registered CDAs and their streets</p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="mt-4 sm:mt-0">
                  <Plus className="h-4 w-4 mr-2" />
                  Register
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleRegisterStreet}>
                  <MapPin className="h-4 w-4 mr-2" />
                  Register New Street
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleRegisterCda}>
                  <Building className="h-4 w-4 mr-2" />
                  Register New CDA
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
                    <p className="text-2xl font-bold text-foreground">{mockCDAs.length}</p>
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
                    <p className="text-2xl font-bold text-foreground">{mockStreets.reduce((sum, street) => sum + street.propertyCount, 0)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Wards Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-foreground">All Wards</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wardsData.map((ward) => (
              <Card
                key={ward.name}
                className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
                onClick={() => handleNavigateToWard(ward.name)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-foreground">{ward.name}</h4>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">CDAs</span>
                      <span className="font-semibold">{ward.cdaCount}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 ">
                    <Button variant="outline" size="sm" className="w-full">
                      View CDAs
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Street Form Modal */}
      {showStreetForm && <StreetForm onClose={() => setShowStreetForm(false)} onSubmit={handleStreetSubmit} />}

      {/* CDA Form Modal */}
      {showCdaForm && <CdaForm onClose={() => setShowCdaForm(false)} onSubmit={handleCdaSubmit} />}
    </div>
  );
};

export default Dashboard;
