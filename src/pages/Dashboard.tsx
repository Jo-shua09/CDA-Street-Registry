import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Building, MapPin, Home, Printer, ChevronDown, LogOut, Plus } from "lucide-react";
import { StreetForm } from "@/components/street/StreetForm";
import { CdaForm } from "@/components/dashboard/CdaForm";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { mockStreets, mockCDAs } from "@/data/mockData";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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

const Dashboard = () => {
  const navigate = useNavigate();
  const [showStreetForm, setShowStreetForm] = useState(false);
  const [showCdaForm, setShowCdaForm] = useState(false);

  const logoUrl = "./logo.png";

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

  const generateCDAReportHTML = () => {
    return `
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
            .header img { height: 80px; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
            .summary { margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="${logoUrl}" alt="Logo" style="height: 80px; display: block; margin: 0 auto 10px;" />
            <h1>Igbogbo/Baiyeku LCDA - CDA Report</h1>
            <p style="color: #666;">Generated on: ${new Date().toLocaleDateString()}</p>
          </div>

          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>CDA Name</th>
                <th>Ward</th>
                <th>Local Government</th>
                <th>Number of Streets</th>
                <th>Number of Properties</th>
                <th>Registration Date</th>
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
                  <td>${cda.lg || "Igbogbo/Baiyeku LCDA"}</td>
                  <td>${cda.streetCount}</td>
                  <td>${cda.propertyCount}</td>
                  <td>${cda.registrationDate || "N/A"}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>

          <div class="summary">
            <h3>Summary</h3>
            <p><strong>Total CDAs:</strong> ${mockCDAs.length}</p>
            <p><strong>Total Streets:</strong> ${mockCDAs.reduce((sum, cda) => sum + cda.streetCount, 0)}</p>
            <p><strong>Total Properties:</strong> ${mockCDAs.reduce((sum, cda) => sum + cda.propertyCount, 0)}</p>
          </div>

          <div class="footer">
            <p>Igbogbo/Baiyeku LCDA CDA Registry System</p>
            <p>Page 1 of 1</p>
          </div>
        </body>
      </html>
    `;
  };

  const generateStreetsReportHTML = () => {
    return `
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
            .header img { height: 80px; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
            .summary { margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="${logoUrl}" alt="Logo" style="height: 80px; display: block; margin: 0 auto 10px;" />
            <h1>Igbogbo/Baiyeku LCDA - Registered Streets Report</h1>
            <p style="color: #666;">Generated on: ${new Date().toLocaleDateString()}</p>
          </div>

          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Street Name</th>
                <th>Ward</th>
                <th>CDA Name</th>
                <th>Number of Properties</th>
                <th>Registration Date</th>
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
                  <td>${street.registrationDate || "N/A"}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>

          <div class="summary">
            <h3>Summary</h3>
            <p><strong>Total Streets:</strong> ${mockStreets.length}</p>
            <p><strong>Total Properties:</strong> ${mockStreets.reduce((sum, street) => sum + street.propertyCount, 0)}</p>
          </div>

          <div class="footer">
            <p>Igbogbo/Baiyeku LCDA Street Registry System</p>
            <p>Page 1 of 1</p>
          </div>
        </body>
      </html>
    `;
  };

  const printCDAs = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const html = generateCDAReportHTML();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

  const printStreets = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const html = generateStreetsReportHTML();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

  const downloadCDAs = async () => {
    try {
      // Create a temporary div to render the HTML
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = generateCDAReportHTML();
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      tempDiv.style.width = "210mm"; // A4 width
      document.body.appendChild(tempDiv);

      // Convert to canvas then to PDF
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        logging: false,
        width: tempDiv.scrollWidth,
        height: tempDiv.scrollHeight,
      });

      // Remove temporary div
      document.body.removeChild(tempDiv);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // Add text watermark with 70% opacity centered
      pdf.setFontSize(50);
      pdf.setTextColor(200, 200, 200, 0.7);
      pdf.text("Igbogbo/Baiyeku LCDA", 105, 148, { align: "center" });
      pdf.setTextColor(0, 0, 0, 1);

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();

        // Add text watermark on each page
        pdf.setFontSize(50);
        pdf.setTextColor(200, 200, 200, 0.7);
        pdf.text("Igbogbo/Baiyeku LCDA", 105, 148, { align: "center" });
        pdf.setTextColor(0, 0, 0, 1);

        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`cda-report-${new Date().toISOString().split("T")[0]}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      // Fallback to basic PDF if html2canvas fails
      generateBasicCDAPDF();
    }
  };

  const downloadStreets = async () => {
    try {
      // Create a temporary div to render the HTML
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = generateStreetsReportHTML();
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      tempDiv.style.width = "210mm"; // A4 width
      document.body.appendChild(tempDiv);

      // Convert to canvas then to PDF
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        logging: false,
        width: tempDiv.scrollWidth,
        height: tempDiv.scrollHeight,
      });

      // Remove temporary div
      document.body.removeChild(tempDiv);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`streets-report-${new Date().toISOString().split("T")[0]}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      // Fallback to basic PDF if html2canvas fails
      generateBasicStreetsPDF();
    }
  };

  // Fallback PDF generation functions
  const generateBasicCDAPDF = () => {
    const pdf = new jsPDF();

    // Title
    pdf.setFontSize(16);
    pdf.text("IGBOGBO/BAIYEKU LCDA - CDA REPORT", 20, 20);

    // Date
    pdf.setFontSize(10);
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);

    // Table headers
    pdf.setFontSize(12);
    const headers = ["#", "CDA Name", "Ward", "Streets", "Properties", "Reg Date"];
    let yPosition = 50;

    // Add headers
    headers.forEach((header, index) => {
      pdf.text(header, 20 + index * 32, yPosition);
    });

    yPosition += 10;

    // Add data rows
    pdf.setFontSize(10);
    mockCDAs.forEach((cda, index) => {
      if (yPosition > 270) {
        pdf.addPage();
        yPosition = 20;
      }

      const row = [
        (index + 1).toString(),
        cda.name.substring(0, 15),
        cda.ward.substring(0, 10),
        cda.streetCount.toString(),
        cda.propertyCount.toString(),
        (cda.registrationDate || "N/A").substring(0, 8),
      ];

      row.forEach((cell, cellIndex) => {
        pdf.text(cell, 20 + cellIndex * 32, yPosition);
      });

      yPosition += 8;
    });

    // Summary
    yPosition += 10;
    pdf.setFontSize(12);
    pdf.text("SUMMARY", 20, yPosition);
    yPosition += 8;
    pdf.setFontSize(10);
    pdf.text(`Total CDAs: ${mockCDAs.length}`, 20, yPosition);
    yPosition += 6;
    pdf.text(`Total Streets: ${mockCDAs.reduce((sum, cda) => sum + cda.streetCount, 0)}`, 20, yPosition);
    yPosition += 6;
    pdf.text(`Total Properties: ${mockCDAs.reduce((sum, cda) => sum + cda.propertyCount, 0)}`, 20, yPosition);

    pdf.save(`cda-report-${new Date().toISOString().split("T")[0]}.pdf`);
  };

  const generateBasicStreetsPDF = () => {
    const pdf = new jsPDF();

    // Title
    pdf.setFontSize(16);
    pdf.text("IGBOGBO/BAIYEKU LCDA - STREETS REPORT", 20, 20);

    // Date
    pdf.setFontSize(10);
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);

    // Table headers
    pdf.setFontSize(12);
    const headers = ["#", "Street Name", "Ward", "CDA", "Properties", "Reg Date"];
    let yPosition = 50;

    // Add headers
    headers.forEach((header, index) => {
      pdf.text(header, 20 + index * 30, yPosition);
    });

    yPosition += 10;

    // Add data rows
    pdf.setFontSize(10);
    mockStreets.forEach((street, index) => {
      if (yPosition > 270) {
        pdf.addPage();
        yPosition = 20;
      }

      const row = [
        (index + 1).toString(),
        street.name.substring(0, 15),
        street.ward.substring(0, 10),
        (street.cdaName || "Multiple").substring(0, 12),
        street.propertyCount.toString(),
        (street.registrationDate || "N/A").substring(0, 8),
      ];

      row.forEach((cell, cellIndex) => {
        pdf.text(cell, 20 + cellIndex * 30, yPosition);
      });

      yPosition += 8;
    });

    // Summary
    yPosition += 10;
    pdf.setFontSize(12);
    pdf.text("SUMMARY", 20, yPosition);
    yPosition += 8;
    pdf.setFontSize(10);
    pdf.text(`Total Streets: ${mockStreets.length}`, 20, yPosition);
    yPosition += 6;
    pdf.text(`Total Properties: ${mockStreets.reduce((sum, street) => sum + street.propertyCount, 0)}`, 20, yPosition);

    pdf.save(`streets-report-${new Date().toISOString().split("T")[0]}.pdf`);
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
                    <span className="hidden sm:inline">Print/Export</span>
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={printCDAs}>
                    <Building className="h-4 w-4 mr-2" />
                    Print CDAs
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={downloadCDAs}>
                    <Building className="h-4 w-4 mr-2" />
                    Download CDAs as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={printStreets}>
                    <MapPin className="h-4 w-4 mr-2" />
                    Print Registered Streets
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={downloadStreets}>
                    <MapPin className="h-4 w-4 mr-2" />
                    Download Streets as PDF
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

      {/* Rest of the component remains the same */}
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
                    <p className="text-2xl font-bold text-foreground">{mockCDAs.reduce((sum, cda) => sum + cda.streetCount, 0)}</p>
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
                    <p className="text-2xl font-bold text-foreground">{mockCDAs.reduce((sum, cda) => sum + cda.propertyCount, 0)}</p>
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
            {wardsData.map((ward) => {
              // Calculate aggregated stats for this ward
              const wardCDAs = mockCDAs.filter((cda) => cda.ward === ward.name);
              const totalStreets = wardCDAs.reduce((sum, cda) => sum + cda.streetCount, 0);
              const totalProperties = wardCDAs.reduce((sum, cda) => sum + cda.propertyCount, 0);

              return (
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
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Total Streets</span>
                        <span className="font-semibold">{totalStreets}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Total Properties</span>
                        <span className="font-semibold">{totalProperties}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 ">
                      <Button variant="outline" size="sm" className="w-full">
                        View CDAs
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
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
