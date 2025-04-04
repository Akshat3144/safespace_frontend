import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import {
  ArrowLeft,
  Bed,
  Bath,
  Ruler,
  PlusCircle,
  Shield,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // Updated import
import { Property, Neighborhood, MapLocation, RiskLevel } from "@/lib/types";
import PropertyMap from "@/components/PropertyMap";
import { formatPrice, formatPricePerSqft } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

const PropertyDetail = () => {
  const [, params] = useRoute("/property/:id");
  const propertyId = params?.id ? parseInt(params.id) : 0;
  const { toast } = useToast();

  const { data: property, isLoading } = useQuery<Property>({
    queryKey: [`/api/properties/${propertyId}`],
    queryFn: () => apiRequest("GET", `/api/properties/${propertyId}`),
    enabled: !!propertyId,
  });

  const { data: neighborhoods, isLoading: isLoadingNeighborhoods } = useQuery<
    Neighborhood[]
  >({
    queryKey: ["/api/neighborhoods"],
    queryFn: () => apiRequest("GET", "/api/neighborhoods"),
  });

  // Find the neighborhood for this property
  const propertyNeighborhood = neighborhoods?.find(
    (n) =>
      property &&
      n.city === property.city &&
      // Check if property is in this neighborhood (simple check based on proximity)
      Math.sqrt(
        Math.pow(n.latitude - property.latitude, 2) +
          Math.pow(n.longitude - property.longitude, 2)
      ) < 0.02 // Approximately 2 km
  );

  const handleAddToCompare = async () => {
    if (property) {
      try {
        // In a real app, this would use the actual user ID
        const userId = 1;

        await apiRequest("POST", "/api/compare", {
          userId,
          propertyId: property.id,
          addedAt: new Date().toISOString(),
        });

        toast({
          title: "Added to Compare",
          description: `${property.title} has been added to your comparison list.`,
        });

        // Invalidate the compare list cache
        queryClient.invalidateQueries({ queryKey: [`/api/compare/${userId}`] });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description:
            "Could not add property to comparison list. Please try again.",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-pulse bg-gray-200 h-8 w-40 rounded mb-4 mx-auto"></div>
          <div className="animate-pulse bg-gray-200 h-80 rounded mb-6"></div>
          <div className="animate-pulse bg-gray-200 h-12 rounded-md mb-4"></div>
          <div className="animate-pulse bg-gray-200 h-80 rounded"></div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
          <p className="mb-6">
            The property you are looking for does not exist or has been removed.
          </p>
          <Link href="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Prepare map location
  const mapLocations: MapLocation[] = [
    {
      name: property.title,
      position: [property.latitude, property.longitude],
      riskLevel:
        property.safetyScore >= 8.5
          ? RiskLevel.Low
          : property.safetyScore >= 7
          ? RiskLevel.Medium
          : RiskLevel.High,
      property,
    },
  ];

  // Add nearby properties if we have neighborhood data
  if (propertyNeighborhood) {
    mapLocations.push({
      name: propertyNeighborhood.name,
      position: [propertyNeighborhood.latitude, propertyNeighborhood.longitude],
      riskLevel:
        propertyNeighborhood.safetyLevel === "high"
          ? RiskLevel.Low
          : propertyNeighborhood.safetyLevel === "medium"
          ? RiskLevel.Medium
          : RiskLevel.High,
      neighborhood: propertyNeighborhood,
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <div className="mb-6">
        <Link href="/">
          <Button
            variant="ghost"
            className="flex items-center text-neutral-700 hover:text-neutral-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Listings
          </Button>
        </Link>
      </div>

      {/* Property Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">
              {property.title}
            </h1>
            <p className="text-xl text-neutral-700 mt-1">
              {property.address}, {property.city}, {property.state}{" "}
              {property.zipCode}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-neutral-900">
              {formatPrice(property.price)}
            </div>
            <div className="text-neutral-700">
              {formatPricePerSqft(property.price, property.sqft)}/sqft
            </div>
          </div>
        </div>
      </div>

      {/* Property Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Main Image */}
        <div className="lg:col-span-2">
          <div
            className="h-96 bg-neutral-200 rounded-lg bg-cover bg-center"
            style={{ backgroundImage: `url('${property.imageUrl}')` }}
          ></div>
        </div>

        {/* Key Details */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-neutral-100 rounded-lg">
                  <div className="flex justify-center mb-1">
                    <Bed className="h-5 w-5 text-neutral-700" />
                  </div>
                  <div className="text-lg font-semibold">{property.beds}</div>
                  <div className="text-sm text-neutral-600">Beds</div>
                </div>
                <div className="p-3 bg-neutral-100 rounded-lg">
                  <div className="flex justify-center mb-1">
                    <Bath className="h-5 w-5 text-neutral-700" />
                  </div>
                  <div className="text-lg font-semibold">{property.baths}</div>
                  <div className="text-sm text-neutral-600">Baths</div>
                </div>
                <div className="p-3 bg-neutral-100 rounded-lg">
                  <div className="flex justify-center mb-1">
                    <Ruler className="h-5 w-5 text-neutral-700" />
                  </div>
                  <div className="text-lg font-semibold">
                    {property.sqft.toLocaleString()}
                  </div>
                  <div className="text-sm text-neutral-600">Sq Ft</div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <Shield className="h-5 w-5 text-primary mr-2" />
                  <div className="text-lg font-semibold">
                    Safety Score: {property.safetyScore.toFixed(1)}/10
                  </div>
                </div>
                <div className="text-sm text-neutral-700">
                  This property is in a{" "}
                  {property.safetyScore >= 8.5
                    ? "very safe"
                    : property.safetyScore >= 7
                    ? "safe"
                    : "moderate safety"}{" "}
                  area with {propertyNeighborhood?.policeResponse ?? "quick"}{" "}
                  minute police response time.
                </div>
              </div>

              <div className="border-t pt-4">
                <Button className="w-full mb-3" onClick={handleAddToCompare}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add to Compare
                </Button>
                <Button variant="outline" className="w-full">
                  Schedule Tour
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Safety & Environment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <Card className="bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-600 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
              </svg>
              <h3 className="font-semibold text-lg">Air Quality</h3>
            </div>
            <p className="text-green-800 text-2xl font-bold">
              {property.airQualityText}
            </p>
            <p className="text-neutral-600 mt-1">AQI: {property.airQuality}</p>
            <p className="text-sm mt-2">
              This area has{" "}
              {property.airQuality && property.airQuality <= 50
                ? "excellent"
                : property.airQuality && property.airQuality <= 100
                ? "good"
                : "moderate"}{" "}
              air quality conditions.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-600 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <h3 className="font-semibold text-lg">HDI Score</h3>
            </div>
            <p className="text-blue-800 text-2xl font-bold">
              {property.hdiScore?.toFixed(2) ||
                propertyNeighborhood?.hdiScore.toFixed(2) ||
                "N/A"}
            </p>
            <p className="text-neutral-600 mt-1">
              {property.hdiScore && property.hdiScore >= 0.8
                ? "Very High"
                : property.hdiScore && property.hdiScore >= 0.7
                ? "High"
                : property.hdiScore && property.hdiScore >= 0.6
                ? "Medium"
                : "N/A"}
            </p>
            <p className="text-sm mt-2">
              HDI measures overall achievement in health, education, and
              standard of living.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-amber-50">
          <CardContent className="p-6">
            <div className="flex items-center mb-2">
              <Clock className="h-5 w-5 text-amber-600 mr-2" />
              <h3 className="font-semibold text-lg">Emergency Response</h3>
            </div>
            <p className="text-amber-800 text-2xl font-bold">
              {property.emergencyResponseTime ||
                propertyNeighborhood?.medicalResponse ||
                "N/A"}{" "}
              min
            </p>
            <p className="text-neutral-600 mt-1">Average response time</p>
            <p className="text-sm mt-2">
              Emergency services are{" "}
              {property.emergencyResponseTime &&
              property.emergencyResponseTime <= 5
                ? "very quickly accessible"
                : property.emergencyResponseTime &&
                  property.emergencyResponseTime <= 8
                ? "accessible"
                : "accessible with some delay"}{" "}
              from this property.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center mb-2">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
              <h3 className="font-semibold text-lg">Flood Risk</h3>
            </div>
            <p className="text-red-800 text-2xl font-bold">
              {property.floodRisk || "Low"}
            </p>
            <p className="text-neutral-600 mt-1">
              {property.floodZone || "Zone X"}
            </p>
            <p className="text-sm mt-2">
              This property is in a{" "}
              {property.floodRisk?.toLowerCase() === "low"
                ? "low risk"
                : property.floodRisk?.toLowerCase() === "medium"
                ? "moderate risk"
                : "higher risk"}{" "}
              flood zone.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Map Section */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Location & Neighborhood</h2>
        <PropertyMap
          locations={mapLocations}
          areaName={propertyNeighborhood?.name}
          areaInfo={
            propertyNeighborhood
              ? {
                  aqi: propertyNeighborhood.aqi
                    ? {
                        value: propertyNeighborhood.aqi,
                        text: propertyNeighborhood.aqiText || "Moderate",
                      }
                    : undefined,
                  floodRisk: propertyNeighborhood.floodRisk,
                  earthquakeRisk: propertyNeighborhood.earthquakeRisk,
                }
              : undefined
          }
        />
      </div>

      {/* Neighborhood Information */}
      {propertyNeighborhood && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4">
            Neighborhood: {propertyNeighborhood.name}
          </h2>

          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Safety Profile</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-neutral-600">Safety Level:</span>
                      <Badge
                        variant={
                          propertyNeighborhood.safetyLevel === "high"
                            ? "success"
                            : propertyNeighborhood.safetyLevel === "medium"
                            ? "warning"
                            : "danger"
                        }
                        className="ml-2"
                      >
                        {propertyNeighborhood.safetyLevel
                          .charAt(0)
                          .toUpperCase() +
                          propertyNeighborhood.safetyLevel.slice(1)}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-neutral-600">Police Response:</span>
                      <span className="font-semibold ml-2">
                        {propertyNeighborhood.policeResponse} min
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-600">Fire Response:</span>
                      <span className="font-semibold ml-2">
                        {propertyNeighborhood.fireResponse} min
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-600">
                        Medical Response:
                      </span>
                      <span className="font-semibold ml-2">
                        {propertyNeighborhood.medicalResponse} min
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">
                    Services & Accessibility
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-neutral-600">
                        Nearest Hospital:
                      </span>
                      <span className="font-semibold ml-2">
                        {propertyNeighborhood.hospitalDistance.toFixed(1)} miles
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-600">
                        Emergency Shelter:
                      </span>
                      <span className="font-semibold ml-2">
                        {propertyNeighborhood.shelterDistance.toFixed(1)} miles
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-600">HDI Score:</span>
                      <span className="font-semibold ml-2">
                        {propertyNeighborhood.hdiScore.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">
                    Environmental Factors
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-neutral-600">Air Quality:</span>
                      <span className="font-semibold ml-2">
                        {propertyNeighborhood.aqiText} (AQI:{" "}
                        {propertyNeighborhood.aqi})
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-600">Flood Risk:</span>
                      <span className="font-semibold ml-2">
                        {propertyNeighborhood.floodRisk}
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-600">Earthquake Risk:</span>
                      <span className="font-semibold ml-2">
                        {propertyNeighborhood.earthquakeRisk}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PropertyDetail;
