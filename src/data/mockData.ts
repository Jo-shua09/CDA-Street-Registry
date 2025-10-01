// Shared mock data for the application

export interface CdaData {
  id: number;
  name: string;
  ward: string;
  streetCount: number;
  propertyCount: number;
  registrationDate?: string;
}

export interface StreetData {
  id: number;
  name: string;
  ward: string;
  cdaName: string;
  propertyCount: number;
  registrationDate?: string;
}

// Mock data for streets with CDA names
export const mockStreets: StreetData[] = [
  // Phase 1 CDA (Ward C1) - 3 streets
  { id: 1, name: "Ahmadu Bello Avenue", ward: "Ward C1", cdaName: "Phase 1 CDA", propertyCount: 3 },
  { id: 2, name: "Independence Way", ward: "Ward C1", cdaName: "Phase 1 CDA", propertyCount: 4 },
  { id: 3, name: "Unity Street", ward: "Ward C1", cdaName: "Phase 1 CDA", propertyCount: 2 },

  // Sunrise CDA (Ward C2) - 3 streets
  { id: 4, name: "Allen Avenue", ward: "Ward C2", cdaName: "Sunrise CDA", propertyCount: 3 },
  { id: 5, name: "Morning Glory Lane", ward: "Ward C2", cdaName: "Sunrise CDA", propertyCount: 5 },
  { id: 6, name: "Sunrise Boulevard", ward: "Ward C2", cdaName: "Sunrise CDA", propertyCount: 4 },

  // Palm Grove CDA (Ward C3) - 3 streets
  { id: 7, name: "Palm Street", ward: "Ward C3", cdaName: "Palm Grove CDA", propertyCount: 3 },
  { id: 8, name: "Coconut Avenue", ward: "Ward C3", cdaName: "Palm Grove CDA", propertyCount: 4 },
  { id: 9, name: "Tropical Way", ward: "Ward C3", cdaName: "Palm Grove CDA", propertyCount: 2 },

  // Royal Estate CDA (Ward C4) - 3 streets
  { id: 10, name: "Royal Road", ward: "Ward C4", cdaName: "Royal Estate CDA", propertyCount: 3 },
  { id: 11, name: "Crown Street", ward: "Ward C4", cdaName: "Royal Estate CDA", propertyCount: 4 },
  { id: 12, name: "Majesty Avenue", ward: "Ward C4", cdaName: "Royal Estate CDA", propertyCount: 5 },

  // Mountain Top CDA (Ward C5) - 3 streets
  { id: 13, name: "Mountain View", ward: "Ward C5", cdaName: "Mountain Top CDA", propertyCount: 3 },
  { id: 14, name: "Peak Street", ward: "Ward C5", cdaName: "Mountain Top CDA", propertyCount: 4 },
  { id: 15, name: "Summit Road", ward: "Ward C5", cdaName: "Mountain Top CDA", propertyCount: 2 },

  // River Side CDA (Ward C6) - 3 streets
  { id: 16, name: "River Bank", ward: "Ward C6", cdaName: "River Side CDA", propertyCount: 3 },
  { id: 17, name: "Waterfront Drive", ward: "Ward C6", cdaName: "River Side CDA", propertyCount: 4 },
  { id: 18, name: "Delta Street", ward: "Ward C6", cdaName: "River Side CDA", propertyCount: 5 },
];

export const mockCDAs: CdaData[] = [
  { id: 1, name: "Phase 1 CDA", ward: "Ward C1", streetCount: 3, propertyCount: 9 },
  { id: 2, name: "Sunrise CDA", ward: "Ward C2", streetCount: 3, propertyCount: 12 },
  { id: 3, name: "Palm Grove CDA", ward: "Ward C3", streetCount: 3, propertyCount: 9 },
  { id: 4, name: "Royal Estate CDA", ward: "Ward C4", streetCount: 3, propertyCount: 12 },
  { id: 5, name: "Mountain Top CDA", ward: "Ward C5", streetCount: 3, propertyCount: 9 },
  { id: 6, name: "River Side CDA", ward: "Ward C6", streetCount: 3, propertyCount: 12 },
];

// Extended CDA data for CDA Directory with additional fields
export interface ExtendedCdaData {
  id: number;
  name: string;
  ward: string;
  lg: string;
  description: string;
  registrationDate: string;
  chairman?: {
    name: string;
    contact: string;
  };
  streetCount: number;
  propertyCount: number;
}

export const extendedMockCDAs: ExtendedCdaData[] = [
  {
    id: 1,
    name: "Phase 1 CDA",
    ward: "Ward C1",
    lg: "Lagos Island LGA",
    description: "First phase CDA",
    registrationDate: "2023-01-01",
    chairman: {
      name: "John Doe",
      contact: "+234 801 234 5678",
    },
    streetCount: 3,
    propertyCount: 9,
  },
  {
    id: 2,
    name: "Sunrise CDA",
    ward: "Ward C2",
    lg: "Lagos Island LGA",
    description: "Sunrise community CDA",
    registrationDate: "2023-02-01",
    chairman: {
      name: "Sarah Johnson",
      contact: "sarah.johnson@email.com",
    },
    streetCount: 3,
    propertyCount: 12,
  },
  {
    id: 3,
    name: "Palm Grove CDA",
    ward: "Ward C3",
    lg: "Lagos Island LGA",
    description: "Palm Grove CDA",
    registrationDate: "2023-03-01",
    chairman: {
      name: "Michael Brown",
      contact: "+234 802 345 6789",
    },
    streetCount: 3,
    propertyCount: 9,
  },
  {
    id: 4,
    name: "Royal Estate CDA",
    ward: "Ward C4",
    lg: "Lagos Island LGA",
    description: "Royal Estate CDA",
    registrationDate: "2023-04-01",
    chairman: {
      name: "Emma Wilson",
      contact: "emma.wilson@email.com",
    },
    streetCount: 3,
    propertyCount: 12,
  },
  {
    id: 5,
    name: "Mountain Top CDA",
    ward: "Ward C5",
    lg: "Lagos Island LGA",
    description: "Mountain Top CDA",
    registrationDate: "2023-05-01",
    chairman: {
      name: "David Lee",
      contact: "+234 803 456 7890",
    },
    streetCount: 3,
    propertyCount: 9,
  },
  {
    id: 6,
    name: "River Side CDA",
    ward: "Ward C6",
    lg: "Lagos Island LGA",
    description: "River Side CDA",
    registrationDate: "2023-06-01",
    chairman: {
      name: "Lisa Chen",
      contact: "lisa.chen@email.com",
    },
    streetCount: 3,
    propertyCount: 12,
  },
];

// Extended Street data for CDA Directory with detailed property breakdown
export interface ExtendedStreetData {
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
  propertyCount: {
    houses: number;
    shops: number;
    hotels: number;
    others: number;
  };
}

export const extendedMockStreets: ExtendedStreetData[] = [
  // Phase 1 CDA (Ward C1) - 3 streets
  {
    id: 1,
    name: "Ahmadu Bello Avenue",
    cda: "Phase 1 CDA",
    ward: "Ward C1",
    lg: "Lagos Island LGA",
    lcda: "Victoria Island LCDA",
    propertyCount: { houses: 2, shops: 1, hotels: 1, others: 0 },
    registrationDate: "2023-03-15",
    description: "Main commercial avenue with mixed residential and commercial properties",
    properties: [{ type: "house" }, { type: "house" }, { type: "hotel" }, { type: "shop" }],
  },
  {
    id: 2,
    name: "Independence Way",
    cda: "Phase 1 CDA",
    ward: "Ward C1",
    lg: "Lagos Island LGA",
    lcda: "Victoria Island LCDA",
    propertyCount: { houses: 3, shops: 1, hotels: 0, others: 0 },
    registrationDate: "2023-03-20",
    description: "Residential street with some commercial properties",
    properties: [{ type: "house" }, { type: "house" }, { type: "house" }, { type: "shop" }],
  },
  {
    id: 3,
    name: "Unity Street",
    cda: "Phase 1 CDA",
    ward: "Ward C1",
    lg: "Lagos Island LGA",
    lcda: "Victoria Island LCDA",
    propertyCount: { houses: 2, shops: 0, hotels: 0, others: 0 },
    registrationDate: "2023-03-25",
    description: "Quiet residential street",
    properties: [{ type: "house" }, { type: "house" }],
  },

  // Sunrise CDA (Ward C2) - 3 streets
  {
    id: 4,
    name: "Allen Avenue",
    cda: "Sunrise CDA",
    ward: "Ward C2",
    lg: "Lagos Island LGA",
    lcda: "Victoria Island LCDA",
    propertyCount: { houses: 2, shops: 1, hotels: 0, others: 0 },
    registrationDate: "2023-04-15",
    description: "Residential and commercial street in Sunrise CDA",
    properties: [{ type: "house" }, { type: "house" }, { type: "shop" }],
  },
  {
    id: 5,
    name: "Morning Glory Lane",
    cda: "Sunrise CDA",
    ward: "Ward C2",
    lg: "Lagos Island LGA",
    lcda: "Victoria Island LCDA",
    propertyCount: { houses: 3, shops: 1, hotels: 1, others: 0 },
    registrationDate: "2023-04-20",
    description: "Mixed use street with residential, commercial and hospitality properties",
    properties: [{ type: "house" }, { type: "house" }, { type: "house" }, { type: "shop" }, { type: "hotel" }],
  },
  {
    id: 6,
    name: "Sunrise Boulevard",
    cda: "Sunrise CDA",
    ward: "Ward C2",
    lg: "Lagos Island LGA",
    lcda: "Victoria Island LCDA",
    propertyCount: { houses: 3, shops: 1, hotels: 0, others: 0 },
    registrationDate: "2023-04-25",
    description: "Main boulevard with diverse property types",
    properties: [{ type: "house" }, { type: "house" }, { type: "house" }, { type: "shop" }],
  },

  // Palm Grove CDA (Ward C3) - 3 streets
  {
    id: 7,
    name: "Palm Street",
    cda: "Palm Grove CDA",
    ward: "Ward C3",
    lg: "Lagos Island LGA",
    lcda: "Victoria Island LCDA",
    propertyCount: { houses: 2, shops: 1, hotels: 0, others: 0 },
    registrationDate: "2023-05-15",
    description: "Mixed use street with palm trees lining the avenue",
    properties: [{ type: "house" }, { type: "house" }, { type: "shop" }],
  },
  {
    id: 8,
    name: "Coconut Avenue",
    cda: "Palm Grove CDA",
    ward: "Ward C3",
    lg: "Lagos Island LGA",
    lcda: "Victoria Island LCDA",
    propertyCount: { houses: 3, shops: 1, hotels: 0, others: 0 },
    registrationDate: "2023-05-20",
    description: "Residential street with some commercial properties",
    properties: [{ type: "house" }, { type: "house" }, { type: "house" }, { type: "shop" }],
  },
  {
    id: 9,
    name: "Tropical Way",
    cda: "Palm Grove CDA",
    ward: "Ward C3",
    lg: "Lagos Island LGA",
    lcda: "Victoria Island LCDA",
    propertyCount: { houses: 2, shops: 0, hotels: 0, others: 0 },
    registrationDate: "2023-05-25",
    description: "Quiet residential street in tropical setting",
    properties: [{ type: "house" }, { type: "house" }],
  },

  // Royal Estate CDA (Ward C4) - 3 streets
  {
    id: 10,
    name: "Royal Road",
    cda: "Royal Estate CDA",
    ward: "Ward C4",
    lg: "Lagos Island LGA",
    lcda: "Victoria Island LCDA",
    propertyCount: { houses: 2, shops: 1, hotels: 0, others: 0 },
    registrationDate: "2023-06-15",
    description: "Exclusive residential street in Royal Estate",
    properties: [{ type: "house" }, { type: "house" }, { type: "shop" }],
  },
  {
    id: 11,
    name: "Crown Street",
    cda: "Royal Estate CDA",
    ward: "Ward C4",
    lg: "Lagos Island LGA",
    lcda: "Victoria Island LCDA",
    propertyCount: { houses: 3, shops: 1, hotels: 0, others: 0 },
    registrationDate: "2023-06-20",
    description: "Upscale residential street with premium properties",
    properties: [{ type: "house" }, { type: "house" }, { type: "house" }, { type: "shop" }],
  },
  {
    id: 12,
    name: "Majesty Avenue",
    cda: "Royal Estate CDA",
    ward: "Ward C4",
    lg: "Lagos Island LGA",
    lcda: "Victoria Island LCDA",
    propertyCount: { houses: 3, shops: 1, hotels: 1, others: 0 },
    registrationDate: "2023-06-25",
    description: "Grand avenue with luxury residential and hospitality properties",
    properties: [{ type: "house" }, { type: "house" }, { type: "house" }, { type: "shop" }, { type: "hotel" }],
  },

  // Mountain Top CDA (Ward C5) - 3 streets
  {
    id: 13,
    name: "Mountain View",
    cda: "Mountain Top CDA",
    ward: "Ward C5",
    lg: "Lagos Island LGA",
    lcda: "Victoria Island LCDA",
    propertyCount: { houses: 2, shops: 1, hotels: 0, others: 0 },
    registrationDate: "2023-07-15",
    description: "Scenic street with mountain views",
    properties: [{ type: "house" }, { type: "house" }, { type: "shop" }],
  },
  {
    id: 14,
    name: "Peak Street",
    cda: "Mountain Top CDA",
    ward: "Ward C5",
    lg: "Lagos Island LGA",
    lcda: "Victoria Island LCDA",
    propertyCount: { houses: 3, shops: 1, hotels: 0, others: 0 },
    registrationDate: "2023-07-20",
    description: "Elevated street with panoramic views",
    properties: [{ type: "house" }, { type: "house" }, { type: "house" }, { type: "shop" }],
  },
  {
    id: 15,
    name: "Summit Road",
    cda: "Mountain Top CDA",
    ward: "Ward C5",
    lg: "Lagos Island LGA",
    lcda: "Victoria Island LCDA",
    propertyCount: { houses: 2, shops: 0, hotels: 0, others: 0 },
    registrationDate: "2023-07-25",
    description: "Highest point street with residential properties",
    properties: [{ type: "house" }, { type: "house" }],
  },

  // River Side CDA (Ward C6) - 3 streets
  {
    id: 16,
    name: "River Bank",
    cda: "River Side CDA",
    ward: "Ward C6",
    lg: "Lagos Island LGA",
    lcda: "Victoria Island LCDA",
    propertyCount: { houses: 2, shops: 1, hotels: 0, others: 0 },
    registrationDate: "2023-08-15",
    description: "Riverside street with waterfront properties",
    properties: [{ type: "house" }, { type: "house" }, { type: "shop" }],
  },
  {
    id: 17,
    name: "Waterfront Drive",
    cda: "River Side CDA",
    ward: "Ward C6",
    lg: "Lagos Island LGA",
    lcda: "Victoria Island LCDA",
    propertyCount: { houses: 3, shops: 1, hotels: 0, others: 0 },
    registrationDate: "2023-08-20",
    description: "Scenic waterfront drive with mixed properties",
    properties: [{ type: "house" }, { type: "house" }, { type: "house" }, { type: "shop" }],
  },
  {
    id: 18,
    name: "Delta Street",
    cda: "River Side CDA",
    ward: "Ward C6",
    lg: "Lagos Island LGA",
    lcda: "Victoria Island LCDA",
    propertyCount: { houses: 3, shops: 1, hotels: 1, others: 0 },
    registrationDate: "2023-08-25",
    description: "River delta street with diverse property portfolio",
    properties: [{ type: "house" }, { type: "house" }, { type: "house" }, { type: "shop" }, { type: "hotel" }],
  },
];
