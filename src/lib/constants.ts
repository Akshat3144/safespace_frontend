export const PROPERTY_TYPES = ["House", "Apartment", "Land"];

export const PRICE_RANGES = [
  { label: "$50k", value: 50000 },
  { label: "$100k", value: 100000 },
  { label: "$200k", value: 200000 },
  { label: "$300k", value: 300000 },
  { label: "$500k", value: 500000 },
  { label: "$750k", value: 750000 },
  { label: "$1M", value: 1000000 },
  { label: "$2M+", value: 2000000 },
];

export const AQI_LEVELS = [
  { label: "Any", value: "any" },
  { label: "Good (0-50)", value: "good" },
  { label: "Moderate (51-100)", value: "moderate" },
  { label: "Poor (101-150)", value: "poor" },
];

export const HDI_LEVELS = [
  { label: "Any", value: 0 },
  { label: "0.6+", value: 0.6 },
  { label: "0.7+", value: 0.7 },
  { label: "0.8+", value: 0.8 },
  { label: "0.9+", value: 0.9 },
];

export const ACCESSIBILITY_FEATURES = [
  { label: "ADA Compliant", value: "ada" },
  { label: "Senior Friendly", value: "senior" },
  { label: "Near Medical Facilities", value: "medical" },
];

export const RISK_LEVELS = {
  low: { color: "bg-green-100 text-green-800" },
  medium: { color: "bg-yellow-100 text-yellow-800" },
  high: { color: "bg-red-100 text-red-800" },
};

export const DEFAULT_CENTER: [number, number] = [45.523, -122.675]; // Portland, OR

export const DEFAULT_ZOOM = 12;

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatPricePerSqft = (price: number, sqft: number): string => {
  const pricePerSqft = Math.round(price / sqft);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(pricePerSqft);
};
