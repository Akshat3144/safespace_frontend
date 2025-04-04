export interface Property {
  id: number;
  title: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  propertyType: string;
  imageUrl?: string;
  safetyScore: number;
  latitude: number;
  longitude: number;
  airQuality?: number;
  airQualityText?: string;
  hdiScore?: number;
  emergencyResponseTime?: number;
  floodRisk?: string;
  floodZone?: string;
  createdAt: string;
}

export interface Neighborhood {
  id: number;
  name: string;
  city: string;
  state: string;
  hdiScore: number;
  policeResponse: number;
  fireResponse: number;
  medicalResponse: number;
  hospitalDistance: number;
  shelterDistance: number;
  safetyLevel: string;
  latitude: number;
  longitude: number;
  aqi?: number;
  aqiText?: string;
  floodRisk?: string;
  earthquakeRisk?: string;
}

export interface CompareListItem {
  id: number;
  userId: number;
  propertyId: number;
  addedAt: string;
}

export interface FilterParams {
  city?: string;
  state?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  minHdi?: number;
  disasterRisk?: number;
  minAqi?: string;
  accessibilityFeatures?: string[];
}

export enum RiskLevel {
  Low = "low",
  Medium = "medium",
  High = "high",
}

export interface MapLocation {
  name: string;
  position: [number, number];
  riskLevel: RiskLevel;
  property?: Property;
  neighborhood?: Neighborhood;
}

export interface SearchResult {
  properties: Property[];
  totalCount: number;
}
