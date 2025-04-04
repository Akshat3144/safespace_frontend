import { Link } from "wouter";
import { Bed, Bath, Ruler, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // Changed from BadgeColored to Badge
import { Property } from "@/lib/types";
import { formatPrice, formatPricePerSqft } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "../lib/queryClient";

interface PropertyCardProps {
  property: Property;
  onAddToCompare?: (property: Property) => void;
}

const PropertyCard = ({ property, onAddToCompare }: PropertyCardProps) => {
  const { toast } = useToast();

  const getSafetyScoreBadgeClass = (score: number) => {
    if (score >= 8.5) return "bg-primary text-white";
    if (score >= 7) return "bg-green-100 text-green-800";
    if (score >= 5) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getAirQualityBadge = (quality?: string) => {
    if (!quality) return null;

    if (
      quality.toLowerCase().includes("excellent") ||
      quality.toLowerCase().includes("good")
    ) {
      return (
        <Badge variant="success" className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          {quality} {property.airQuality && `(AQI ${property.airQuality})`}
        </Badge>
      );
    }

    if (quality.toLowerCase().includes("moderate")) {
      return (
        <Badge variant="warning" className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {quality} {property.airQuality && `(AQI ${property.airQuality})`}
        </Badge>
      );
    }

    return (
      <Badge variant="danger" className="flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        {quality} {property.airQuality && `(AQI ${property.airQuality})`}
      </Badge>
    );
  };

  const getHdiBadge = (hdi?: number) => {
    if (!hdi) return null;

    if (hdi >= 0.8) {
      return (
        <Badge variant="info" className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
          {hdi.toFixed(2)} (High)
        </Badge>
      );
    }

    if (hdi >= 0.7) {
      return (
        <Badge variant="warning" className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
          {hdi.toFixed(2)} (Medium)
        </Badge>
      );
    }

    return (
      <Badge variant="danger" className="flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
          />
        </svg>
        {hdi.toFixed(2)} (Low)
      </Badge>
    );
  };

  const getEmergencyResponseBadge = (time?: number) => {
    if (!time) return null;

    if (time <= 5) {
      return (
        <Badge variant="success" className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {time} min response
        </Badge>
      );
    }

    if (time <= 8) {
      return (
        <Badge variant="warning" className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {time} min response
        </Badge>
      );
    }

    return (
      <Badge variant="danger" className="flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        {time} min response
      </Badge>
    );
  };

  const getFloodRiskBadge = (risk?: string, zone?: string) => {
    if (!risk) return null;

    if (risk.toLowerCase() === "low") {
      return (
        <Badge variant="success" className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          {risk} {zone && `(${zone})`}
        </Badge>
      );
    }

    if (risk.toLowerCase() === "medium") {
      return (
        <Badge variant="warning" className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          {risk} {zone && `(${zone})`}
        </Badge>
      );
    }

    return (
      <Badge variant="danger" className="flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        {risk} {zone && `(${zone})`}
      </Badge>
    );
  };

  const handleAddToCompare = async () => {
    if (onAddToCompare) {
      try {
        // Get current compare list
        const userId = 1; // This would come from authentication in a real app
        const currentList = await apiRequest("GET", `/api/compare/${userId}`);

        if (currentList && currentList.length >= 2) {
          toast({
            variant: "destructive",
            title: "Compare list full",
            description:
              "You can only compare 2 properties at a time. Please remove a property first.",
          });
          return;
        }

        // Add property to compare list
        await apiRequest("POST", "/api/compare", {
          userId,
          propertyId: property.id,
          addedAt: new Date().toISOString(),
        });

        onAddToCompare(property);

        toast({
          title: "Added to compare list",
          description: `${property.title} has been added to your compare list.`,
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Failed to add to compare list",
          description: "Please try again later.",
        });
      }
    }
  };

  return (
    <Card className="bg-white shadow-sm rounded-lg overflow-hidden mb-4">
      <div className="sm:flex">
        <div
          className="sm:w-1/3 h-48 sm:h-auto bg-neutral-200 relative"
          style={{
            backgroundImage: `url('${property.imageUrl}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div
            className={`absolute top-2 left-2 ${getSafetyScoreBadgeClass(
              property.safetyScore
            )} text-xs px-2 py-1 rounded`}
          >
            Safety Score: {property.safetyScore.toFixed(1)}/10
          </div>
        </div>
        <div className="sm:w-2/3 p-4">
          <div className="sm:flex sm:justify-between">
            <div>
              <h3 className="font-semibold text-neutral-900 text-lg mb-1">
                {property.title}
              </h3>
              <p className="text-neutral-700 mb-2">
                {property.address}, {property.city}, {property.state}{" "}
                {property.zipCode}
              </p>
              <div className="flex text-sm text-neutral-700 space-x-3 mb-3">
                <span className="flex items-center">
                  <Bed className="h-4 w-4 mr-1" /> {property.beds} beds
                </span>
                <span className="flex items-center">
                  <Bath className="h-4 w-4 mr-1" /> {property.baths} baths
                </span>
                <span className="flex items-center">
                  <Ruler className="h-4 w-4 mr-1" />{" "}
                  {property.sqft.toLocaleString()} sqft
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-semibold text-neutral-900 mb-1">
                {formatPrice(property.price)}
              </div>
              <div className="text-sm text-neutral-700">
                {formatPricePerSqft(property.price, property.sqft)}/sqft
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-neutral-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-green-50 rounded p-2 text-xs">
                <div className="text-neutral-700 mb-1">Air Quality</div>
                <div className="font-medium">
                  {getAirQualityBadge(property.airQualityText)}
                </div>
              </div>
              <div className="bg-blue-50 rounded p-2 text-xs">
                <div className="text-neutral-700 mb-1">HDI Score</div>
                <div className="font-medium">
                  {getHdiBadge(property.hdiScore)}
                </div>
              </div>
              <div className="bg-amber-50 rounded p-2 text-xs">
                <div className="text-neutral-700 mb-1">Emergency Services</div>
                <div className="font-medium">
                  {getEmergencyResponseBadge(property.emergencyResponseTime)}
                </div>
              </div>
              <div className="bg-red-50 rounded p-2 text-xs">
                <div className="text-neutral-700 mb-1">Flood Risk</div>
                <div className="font-medium">
                  {getFloodRiskBadge(property.floodRisk, property.floodZone)}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-between">
            <Button
              variant="ghost"
              className="inline-flex items-center text-primary hover:text-primary-dark text-sm font-medium"
              onClick={handleAddToCompare}
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Add to Compare
            </Button>
            <Link href={`/property/${property.id}`}>
              <Button className="bg-primary hover:bg-primary-dark text-white">
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PropertyCard;
