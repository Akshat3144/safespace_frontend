"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Info } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import FiltersSidebar from "@/components/FiltersSidebar";
import PropertyCard from "@/components/PropertyCard";
import PropertyMap from "@/components/PropertyMap";
import HDIChart from "@/components/HDIChart";
import EmergencyServicesTable from "@/components/EmergencyServicesTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Property,
  Neighborhood,
  FilterParams,
  MapLocation,
  RiskLevel,
} from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterParams>({});
  const [sortBy, setSortBy] = useState("safety");
  const { toast } = useToast();

  // Fetch properties
  const { data: properties, isLoading: isLoadingProperties } = useQuery<
    Property[]
  >({
    queryKey: ["/api/properties"],
    queryFn: async () => {
      const response = await fetch("/api/properties");
      if (!response.ok) {
        throw new Error("Failed to fetch properties");
      }
      return response.json();
    },
  });

  // Fetch neighborhoods
  const { data: neighborhoods, isLoading: isLoadingNeighborhoods } = useQuery<
    Neighborhood[]
  >({
    queryKey: ["/api/neighborhoods"],
    queryFn: async () => {
      const response = await fetch("/api/neighborhoods");
      if (!response.ok) {
        throw new Error("Failed to fetch neighborhoods");
      }
      return response.json();
    },
  });

  // Create map locations from properties
  const mapLocations: MapLocation[] = [];
  if (properties) {
    properties.forEach((property) => {
      let riskLevel = RiskLevel.Medium;

      if (property.safetyScore >= 8.5) {
        riskLevel = RiskLevel.Low;
      } else if (property.safetyScore < 7) {
        riskLevel = RiskLevel.High;
      }

      mapLocations.push({
        name: property.title,
        position: [property.latitude, property.longitude],
        riskLevel,
        property,
      });
    });
  }

  // Apply filters and sorting to properties
  const filteredProperties = properties
    ? [...properties].filter((property) => {
        if (
          searchQuery &&
          !property.address.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !property.city.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !property.title.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          return false;
        }

        if (
          filters.propertyType &&
          property.propertyType !== filters.propertyType
        ) {
          return false;
        }

        if (filters.minPrice && property.price < filters.minPrice) {
          return false;
        }

        if (filters.maxPrice && property.price > filters.maxPrice) {
          return false;
        }

        if (
          filters.minHdi &&
          (!property.hdiScore || property.hdiScore < filters.minHdi)
        ) {
          return false;
        }

        return true;
      })
    : [];

  // Sort properties
  const sortedProperties = filteredProperties.sort((a, b) => {
    switch (sortBy) {
      case "price_low":
        return a.price - b.price;
      case "price_high":
        return b.price - a.price;
      case "safety":
        return b.safetyScore - a.safetyScore;
      case "hdi":
        return (b.hdiScore || 0) - (a.hdiScore || 0);
      default:
        return 0;
    }
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleApplyFilters = (newFilters: FilterParams) => {
    setFilters(newFilters);
  };

  const handleAddToCompare = (property: Property) => {
    toast({
      title: "Added to Compare",
      description: `${property.title} has been added to your comparison list.`,
    });
  };

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mt-2 mb-8 bg-white rounded-lg overflow-hidden shadow-sm">
        <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-8">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold font-sans mb-4">
              Find your safe space with confidence
            </h1>
            <p className="text-white/90 mb-6">
              Discover properties with complete transparency on environmental
              metrics, safety scores, and accessibility information.
            </p>

            <SearchBar onSearch={handleSearch} />

            <div className="flex items-center mt-4 text-sm">
              <Info className="h-4 w-4 mr-1" />
              <span className="text-white/80">
                Our AI analyzes 25+ safety and environmental factors for each
                property
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6">
        <div className="lg:w-1/4">
          <FiltersSidebar
            onApplyFilters={handleApplyFilters}
            initialFilters={filters}
          />
        </div>

        <div className="lg:w-3/4">
          <PropertyMap
            locations={mapLocations}
            areaName="Northeast Portland"
            areaInfo={{
              aqi: { value: 68, text: "Moderate" },
              floodRisk: "Low",
              earthquakeRisk: "Medium",
            }}
          />

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg text-neutral-900 font-sans">
                {isLoadingProperties
                  ? "Loading properties..."
                  : `${sortedProperties.length} Properties Found`}
              </h2>
              <div className="flex items-center">
                <span className="text-sm text-neutral-700 mr-2">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">Recommended</SelectItem>
                    <SelectItem value="price_low">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price_high">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="safety">Safety Score</SelectItem>
                    <SelectItem value="hdi">HDI Score</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isLoadingProperties ? (
              <div className="text-center py-10">Loading properties...</div>
            ) : sortedProperties.length > 0 ? (
              sortedProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onAddToCompare={handleAddToCompare}
                />
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-neutral-700">
                  No properties found matching your criteria.
                </p>
                <p className="text-neutral-500 mt-2">
                  Try adjusting your filters or search query.
                </p>
              </div>
            )}
          </div>

          {neighborhoods && neighborhoods.length > 0 && (
            <HDIChart neighborhoods={neighborhoods} />
          )}

          {neighborhoods && neighborhoods.length > 0 && (
            <EmergencyServicesTable neighborhoods={neighborhoods} />
          )}
        </div>
      </div>
    </div>
  );
};
export default Home;
