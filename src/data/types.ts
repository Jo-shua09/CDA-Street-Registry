// types.ts
export interface ExtendedCdaData {
  id: number;
  name: string;
  ward: string;
  lg: string;
  registrationDate: string;
  description: string;
  chairman?: {
    name: string;
    contact: string;
  };
  streetCount: number;
  propertyCount: number;
}

export interface ExtendedStreetData {
  id: number;
  name: string;
  cda: string;
  ward: string;
  lg: string;
  lcda: string;
  registrationDate: string;
  description: string;
  ownerName?: string;
  ownerContact?: string;
  image?: string;
  propertyCount: {
    houses: number;
    shops: number;
    hotels: number;
    others: number;
  };
  properties: Array<{ type: string }>;
}
