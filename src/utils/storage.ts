import { ExtendedCdaData, ExtendedStreetData } from "@/data/types";

const STORAGE_KEYS = {
  CDAS: "cda_registry_cdas",
  STREETS: "cda_registry_streets",
  PROPERTIES: "cda_registry_properties",
} as const;

// CDA Storage Functions
export const getStoredCDAs = (): ExtendedCdaData[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CDAS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading CDAs from localStorage:", error);
    return [];
  }
};
// replace with the PROPERTIES you want to delete
const key = STORAGE_KEYS.PROPERTIES;

if (localStorage.getItem(key)) {
  localStorage.removeItem(key);
  console.log(`${key} deleted successfully`);
} else {
  console.log(`${key} not found in localStorage`);
}

export const saveCDA = (cda: ExtendedCdaData): void => {
  try {
    const cdas = getStoredCDAs();
    const existingIndex = cdas.findIndex((c) => c.id === cda.id);

    if (existingIndex >= 0) {
      cdas[existingIndex] = cda;
    } else {
      cdas.push(cda);
    }

    localStorage.setItem(STORAGE_KEYS.CDAS, JSON.stringify(cdas));
  } catch (error) {
    console.error("Error saving CDA to localStorage:", error);
  }
};

export const deleteCDA = (cdaId: number): void => {
  try {
    const cdas = getStoredCDAs();
    const cdaToDelete = cdas.find((c) => c.id === cdaId);
    const filteredCdas = cdas.filter((c) => c.id !== cdaId);
    localStorage.setItem(STORAGE_KEYS.CDAS, JSON.stringify(filteredCdas));

    if (cdaToDelete) {
      // Delete associated streets
      const streets = getStoredStreets();
      const streetsToDelete = streets.filter((s) => s.cda === cdaToDelete.name);
      const streetIdsToDelete = streetsToDelete.map((s) => s.id);
      const filteredStreets = streets.filter((s) => s.cda !== cdaToDelete.name);
      localStorage.setItem(STORAGE_KEYS.STREETS, JSON.stringify(filteredStreets));

      // Delete associated properties
      const properties = getStoredProperties();
      const filteredProperties = properties.filter((p) => !streetIdsToDelete.includes(p.streetId));
      localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(filteredProperties));
    }
  } catch (error) {
    console.error("Error deleting CDA from localStorage:", error);
  }
};

// Street Storage Functions
export const getStoredStreets = (): ExtendedStreetData[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.STREETS);
    if (!stored) return [];
    const streets = JSON.parse(stored);
    // Fix any corrupted or invalid registrationDate values
    return streets.map((street: ExtendedStreetData) => {
      if (!street.registrationDate || isNaN(Date.parse(street.registrationDate))) {
        const today = new Date();
        street.registrationDate =
          today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, "0") + "-" + String(today.getDate()).padStart(2, "0");
      }
      return street;
    });
  } catch (error) {
    console.error("Error loading streets from localStorage:", error);
    return [];
  }
};

export const saveStreet = (street: ExtendedStreetData): void => {
  try {
    const streets = getStoredStreets();
    const existingIndex = streets.findIndex((s) => s.id === street.id);

    if (existingIndex >= 0) {
      streets[existingIndex] = street;
    } else {
      streets.push(street);
    }

    localStorage.setItem(STORAGE_KEYS.STREETS, JSON.stringify(streets));
  } catch (error) {
    console.error("Error saving street to localStorage:", error);
  }
};

export const deleteStreet = (streetId: number): void => {
  try {
    const streets = getStoredStreets();
    const filteredStreets = streets.filter((s) => s.id !== streetId);
    localStorage.setItem(STORAGE_KEYS.STREETS, JSON.stringify(filteredStreets));

    // Also delete associated properties
    const properties = getStoredProperties();
    const filteredProperties = properties.filter((p) => p.streetId !== streetId);
    localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(filteredProperties));
  } catch (error) {
    console.error("Error deleting street from localStorage:", error);
  }
};

// Property Storage Functions
export interface StoredProperty {
  id: number;
  streetId: number;
  number: string;
  type: string;
  owner: string;
  contact: string;
  description: string;
  registrationDate: string;
  hasShops?: boolean;
  shopCount?: number;
  shops?: Array<{
    number: string;
    type: string;
    description: string;
  }>;
  houseNumber?: string;
  images?: Array<{ id: string; fileData: string; fileName: string; preview: string }>;
  documents?: Array<{ id: string; name: string; fileData: string; fileName: string; fileType: string }>;
}

export const getStoredProperties = (streetId?: number): StoredProperty[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PROPERTIES);
    const properties: StoredProperty[] = stored ? JSON.parse(stored) : [];
    return streetId ? properties.filter((p) => p.streetId === streetId) : properties;
  } catch (error) {
    console.error("Error loading properties from localStorage:", error);
    return [];
  }
};

export const saveProperty = (property: StoredProperty): void => {
  try {
    const properties = getStoredProperties();
    const existingIndex = properties.findIndex((p) => p.id === property.id);

    if (existingIndex >= 0) {
      properties[existingIndex] = property;
    } else {
      properties.push(property);
    }

    localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(properties));
  } catch (error) {
    console.error("Error saving property to localStorage:", error);
  }
};

export const deleteProperty = (propertyId: number): void => {
  try {
    const properties = getStoredProperties();
    const filteredProperties = properties.filter((p) => p.id !== propertyId);
    localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(filteredProperties));
  } catch (error) {
    console.error("Error deleting property from localStorage:", error);
  }
};

// File conversion utilities
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const base64ToFile = (base64: string, fileName: string, mimeType: string): File => {
  const arr = base64.split(",");
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], fileName, { type: mimeType });
};

// Convert property data for storage (File objects to base64)
export const convertPropertyForStorage = async (property: any): Promise<StoredProperty> => {
  const convertedImages = property.images
    ? await Promise.all(
        property.images.map(async (img: any) => ({
          id: img.id,
          fileData: await fileToBase64(img.file),
          fileName: img.file.name,
          preview: img.preview,
        }))
      )
    : [];

  const convertedDocuments = property.documents
    ? await Promise.all(
        property.documents.map(async (doc: any) => ({
          id: doc.id,
          name: doc.name,
          fileData: await fileToBase64(doc.file),
          fileName: doc.file.name,
          fileType: doc.file.type,
        }))
      )
    : [];

  return {
    ...property,
    images: convertedImages,
    documents: convertedDocuments,
  };
};

// Convert property data for display (base64 to File objects)
export const convertPropertyForDisplay = (property: StoredProperty): any => {
  try {
    const convertedImages = property.images
      ? property.images
          .map((img) => {
            try {
              return {
                id: img.id,
                file: base64ToFile(img.fileData, img.fileName, img.fileData.split(";")[0].split(":")[1]),
                preview: img.preview,
              };
            } catch (error) {
              console.error("Error converting image:", error);
              return null;
            }
          })
          .filter(Boolean)
      : [];

    const convertedDocuments = property.documents
      ? property.documents
          .map((doc) => {
            try {
              return {
                id: doc.id,
                name: doc.name,
                file: base64ToFile(doc.fileData, doc.fileName, doc.fileType),
              };
            } catch (error) {
              console.error("Error converting document:", error);
              return null;
            }
          })
          .filter(Boolean)
      : [];

    return {
      ...property,
      images: convertedImages,
      documents: convertedDocuments,
    };
  } catch (error) {
    console.error("Error converting property for display:", error);
    return null;
  }
};

// Utility functions
export const clearAllData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.CDAS);
    localStorage.removeItem(STORAGE_KEYS.STREETS);
    localStorage.removeItem(STORAGE_KEYS.PROPERTIES);
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
};
