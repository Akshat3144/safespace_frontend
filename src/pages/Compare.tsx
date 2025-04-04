import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowLeft, X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // Updated import
import { Property } from "@/lib/types";
import { formatPrice } from "@/lib/constants";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const Compare = () => {
  const { toast } = useToast();
  // In a real app, this would use the authenticated user's ID
  const userId = 1;

  // Query for properties in the compare list
  const {
    data: compareProperties,
    isLoading,
    isError,
  } = useQuery<Property[]>({
    queryKey: [`/api/compare/${userId}`],
    queryFn: () => apiRequest("GET", `/api/compare/${userId}`),
  });

  // Format the comparison data
  const formatPropertyValue = (property: Property, key: keyof Property) => {
    const value = property[key];

    if (key === "price") {
      return formatPrice(value as number);
    }

    if (key === "safetyScore") {
      return `${(value as number).toFixed(1)}/10`;
    }

    if (key === "hdiScore" && value) {
      return (value as number).toFixed(2);
    }

    if (key === "emergencyResponseTime" && value) {
      return `${value} min`;
    }

    return value || "N/A";
  };

  // Remove a property from the compare list
  const handleRemoveProperty = async (propertyId: number) => {
    try {
      // Get the compare list items
      const response = await fetch(`/api/compare/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch compare list");
      }

      const compareList = await response.json();
      const compareItem = compareList.find(
        (item: any) => item.propertyId === propertyId
      );

      // If item not found, show toast and return early
      if (!compareItem) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Property not found in comparison list.",
        });
        return;
      }

      // Make the DELETE request
      const deleteResponse = await fetch(`/api/compare/${compareItem.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!deleteResponse.ok) {
        throw new Error("Failed to delete item");
      }

      toast({
        title: "Property removed",
        description: "The property has been removed from your comparison list.",
      });

      // Invalidate the query to refresh the data
      queryClient.invalidateQueries({ queryKey: [`/api/compare/${userId}`] });
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not remove the property from your comparison list.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/">
            <Button
              variant="ghost"
              className="flex items-center text-neutral-700 hover:text-neutral-900"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
        <h1 className="text-3xl font-bold mb-6">Compare Properties</h1>
        <div className="text-center py-10">
          <div className="animate-pulse bg-gray-200 h-12 w-40 rounded mb-4 mx-auto"></div>
          <div className="animate-pulse bg-gray-200 h-[400px] rounded mb-6"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/">
            <Button
              variant="ghost"
              className="flex items-center text-neutral-700 hover:text-neutral-900"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
        <h1 className="text-3xl font-bold mb-6">Compare Properties</h1>
        <Card>
          <CardContent className="p-10 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              Error Loading Comparison
            </h2>
            <p className="text-neutral-600 mb-6">
              There was an error loading your property comparison. Please try
              again later.
            </p>
            <Button
              onClick={() =>
                queryClient.invalidateQueries({
                  queryKey: [`/api/compare/${userId}`],
                })
              }
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link href="/">
          <Button
            variant="ghost"
            className="flex items-center text-neutral-700 hover:text-neutral-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Compare Properties</h1>

      {!compareProperties || compareProperties.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center">
            <h2 className="text-xl font-semibold mb-2">
              Select Properties to Compare
            </h2>
            <p className="text-neutral-600 mb-6">
              Please select 2 properties to compare their features.
            </p>
            <Link href="/">
              <Button>Browse Properties</Button>
            </Link>
          </CardContent>
        </Card>
      ) : compareProperties.length === 1 ? (
        <Card>
          <CardContent className="p-10 text-center">
            <h2 className="text-xl font-semibold mb-2">
              Select One More Property
            </h2>
            <p className="text-neutral-600 mb-6">
              Please select one more property to start comparison.
            </p>
            <Link href="/">
              <Button>Browse Properties</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th
                  key="criteria"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4"
                >
                  Comparison Criteria
                </th>
                {compareProperties.map((property, index) => (
                  <th
                    key={`header-${property.id}-${index}`}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex justify-between items-center">
                      <span>{property.title}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-red-500"
                        onClick={() => handleRemoveProperty(property.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {/* Basic Information */}
              <tr className="bg-blue-50">
                <td
                  colSpan={compareProperties.length + 1}
                  className="px-6 py-3 text-left text-sm font-medium text-gray-900"
                >
                  Basic Information
                </td>
              </tr>
              {/* Image row */}
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  Image
                </td>
                {compareProperties.map((property, index) => (
                  <td
                    key={`img-${property.id}-${index}`}
                    className="px-6 py-4 text-sm text-gray-500"
                  >
                    <div
                      className="h-32 w-full bg-cover bg-center rounded"
                      style={{ backgroundImage: `url('${property.imageUrl}')` }}
                    ></div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  Address
                </td>
                {compareProperties.map((property, index) => (
                  <td
                    key={`address-${property.id}-${index}`}
                    className="px-6 py-4 text-sm text-gray-500"
                  >
                    {property.address}, {property.city}, {property.state}{" "}
                    {property.zipCode}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  Price
                </td>
                {compareProperties.map((property, index) => (
                  <td
                    key={`price-${property.id}-${index}`}
                    className="px-6 py-4 text-sm text-gray-500 font-semibold"
                  >
                    {formatPrice(property.price)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  Property Type
                </td>
                {compareProperties.map((property, index) => (
                  <td
                    key={`type-${property.id}-${index}`}
                    className="px-6 py-4 text-sm text-gray-500"
                  >
                    {property.propertyType}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  Beds
                </td>
                {compareProperties.map((property, index) => (
                  <td
                    key={`beds-${property.id}-${index}`}
                    className="px-6 py-4 text-sm text-gray-500"
                  >
                    {property.beds}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  Baths
                </td>
                {compareProperties.map((property, index) => (
                  <td
                    key={`baths-${property.id}-${index}`}
                    className="px-6 py-4 text-sm text-gray-500"
                  >
                    {property.baths}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  Square Feet
                </td>
                {compareProperties.map((property, index) => (
                  <td
                    key={`sqft-${property.id}-${index}`}
                    className="px-6 py-4 text-sm text-gray-500"
                  >
                    {property.sqft.toLocaleString()}
                  </td>
                ))}
              </tr>

              {/* Safety Information */}
              <tr className="bg-blue-50">
                <td
                  colSpan={compareProperties.length + 1}
                  className="px-6 py-3 text-left text-sm font-medium text-gray-900"
                >
                  Safety & Environmental Information
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  Safety Score
                </td>
                {compareProperties.map((property, index) => (
                  <td
                    key={`safety-${property.id}-${index}`}
                    className="px-6 py-4 text-sm"
                  >
                    <Badge
                      variant={
                        property.safetyScore >= 8.5
                          ? "success"
                          : property.safetyScore >= 7
                          ? "info"
                          : property.safetyScore >= 5
                          ? "warning"
                          : "danger"
                      }
                    >
                      {property.safetyScore.toFixed(1)}/10
                    </Badge>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  Air Quality
                </td>
                {compareProperties.map((property, index) => (
                  <td
                    key={`air-${property.id}-${index}`}
                    className="px-6 py-4 text-sm"
                  >
                    {property.airQualityText ? (
                      <Badge
                        variant={
                          property.airQualityText
                            .toLowerCase()
                            .includes("excellent") ||
                          property.airQualityText.toLowerCase().includes("good")
                            ? "success"
                            : property.airQualityText
                                .toLowerCase()
                                .includes("moderate")
                            ? "warning"
                            : "danger"
                        }
                      >
                        {property.airQualityText}{" "}
                        {property.airQuality && `(AQI ${property.airQuality})`}
                      </Badge>
                    ) : (
                      "N/A"
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  HDI Score
                </td>
                {compareProperties.map((property, index) => (
                  <td
                    key={`hdi-${property.id}-${index}`}
                    className="px-6 py-4 text-sm"
                  >
                    {property.hdiScore ? (
                      <Badge
                        variant={
                          property.hdiScore >= 0.8
                            ? "info"
                            : property.hdiScore >= 0.7
                            ? "warning"
                            : "danger"
                        }
                      >
                        {property.hdiScore.toFixed(2)}
                      </Badge>
                    ) : (
                      "N/A"
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  Emergency Response
                </td>
                {compareProperties.map((property, index) => (
                  <td
                    key={`emergency-${property.id}-${index}`}
                    className="px-6 py-4 text-sm"
                  >
                    {property.emergencyResponseTime ? (
                      <Badge
                        variant={
                          property.emergencyResponseTime <= 5
                            ? "success"
                            : property.emergencyResponseTime <= 8
                            ? "warning"
                            : "danger"
                        }
                      >
                        {property.emergencyResponseTime} min
                      </Badge>
                    ) : (
                      "N/A"
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  Flood Risk
                </td>
                {compareProperties.map((property, index) => (
                  <td
                    key={`flood-${property.id}-${index}`}
                    className="px-6 py-4 text-sm"
                  >
                    {property.floodRisk ? (
                      <Badge
                        variant={
                          property.floodRisk.toLowerCase() === "low"
                            ? "success"
                            : property.floodRisk.toLowerCase() === "medium"
                            ? "warning"
                            : "danger"
                        }
                      >
                        {property.floodRisk}{" "}
                        {property.floodZone && `(${property.floodZone})`}
                      </Badge>
                    ) : (
                      "N/A"
                    )}
                  </td>
                ))}
              </tr>

              {/* Actions */}
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  Actions
                </td>
                {compareProperties.map((property, index) => (
                  <td
                    key={`actions-${property.id}-${index}`}
                    className="px-6 py-4 text-sm"
                  >
                    <Link href={`/property/${property.id}`}>
                      <Button>View Details</Button>
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Compare;
