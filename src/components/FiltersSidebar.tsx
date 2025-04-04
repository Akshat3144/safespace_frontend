import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FilterParams } from "@/lib/types";
import {
  PROPERTY_TYPES,
  PRICE_RANGES,
  AQI_LEVELS,
  HDI_LEVELS,
  ACCESSIBILITY_FEATURES,
} from "@/lib/constants";

interface FiltersSidebarProps {
  onApplyFilters: (filters: FilterParams) => void;
  initialFilters?: FilterParams;
}

const FiltersSidebar = ({
  onApplyFilters,
  initialFilters = {},
}: FiltersSidebarProps) => {
  const [propertyTypes, setPropertyTypes] = useState<string[]>(
    initialFilters.propertyType
      ? [initialFilters.propertyType]
      : ["House", "Apartment"]
  );
  const [minPrice, setMinPrice] = useState<number>(
    initialFilters.minPrice || 200000
  );
  const [maxPrice, setMaxPrice] = useState<number>(
    initialFilters.maxPrice || 750000
  );
  const [disasterRisk, setDisasterRisk] = useState<number>(
    initialFilters.disasterRisk || 3
  );
  const [minAqi, setMinAqi] = useState<string>(
    initialFilters.minAqi || "moderate"
  );
  const [minHdi, setMinHdi] = useState<number>(initialFilters.minHdi || 0.7);
  const [accessibilityFeatures, setAccessibilityFeatures] = useState<string[]>(
    initialFilters.accessibilityFeatures || ["ada", "medical"]
  );

  const handlePropertyTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setPropertyTypes([...propertyTypes, type]);
    } else {
      setPropertyTypes(propertyTypes.filter((t) => t !== type));
    }
  };

  const handleAccessibilityChange = (feature: string, checked: boolean) => {
    if (checked) {
      setAccessibilityFeatures([...accessibilityFeatures, feature]);
    } else {
      setAccessibilityFeatures(
        accessibilityFeatures.filter((f) => f !== feature)
      );
    }
  };

  const handleApplyFilters = () => {
    onApplyFilters({
      propertyType: propertyTypes.length === 1 ? propertyTypes[0] : undefined,
      minPrice,
      maxPrice,
      disasterRisk,
      minAqi,
      minHdi,
      accessibilityFeatures,
    });
  };

  const handleResetFilters = () => {
    setPropertyTypes(["House", "Apartment"]);
    setMinPrice(200000);
    setMaxPrice(750000);
    setDisasterRisk(3);
    setMinAqi("moderate");
    setMinHdi(0.7);
    setAccessibilityFeatures(["ada", "medical"]);

    onApplyFilters({});
  };

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="p-4 border-b border-neutral-200">
        <h2 className="font-semibold text-neutral-900 font-sans">Filters</h2>
      </div>

      <div className="p-4 border-b border-neutral-200">
        <h3 className="text-sm font-medium text-neutral-900 mb-3">
          Property Type
        </h3>
        <div className="space-y-2">
          {PROPERTY_TYPES.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={`property-type-${type.toLowerCase()}`}
                checked={propertyTypes.includes(type)}
                onCheckedChange={(checked) =>
                  handlePropertyTypeChange(type, checked as boolean)
                }
              />
              <Label
                htmlFor={`property-type-${type.toLowerCase()}`}
                className="text-sm text-neutral-700"
              >
                {type}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 border-b border-neutral-200">
        <h3 className="text-sm font-medium text-neutral-900 mb-3">
          Price Range
        </h3>
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="block text-xs text-neutral-500">Min</Label>
              <Select
                value={minPrice.toString()}
                onValueChange={(value) => setMinPrice(parseInt(value))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select minimum price" />
                </SelectTrigger>
                <SelectContent>
                  {PRICE_RANGES.slice(0, -1).map((range) => (
                    <SelectItem
                      key={range.value}
                      value={range.value.toString()}
                    >
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="block text-xs text-neutral-500">Max</Label>
              <Select
                value={maxPrice.toString()}
                onValueChange={(value) => setMaxPrice(parseInt(value))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select maximum price" />
                </SelectTrigger>
                <SelectContent>
                  {PRICE_RANGES.slice(2).map((range) => (
                    <SelectItem
                      key={range.value}
                      value={range.value.toString()}
                    >
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-b border-neutral-200">
        <h3 className="text-sm font-medium text-neutral-900 mb-3">
          Safety & Environment
        </h3>
        <div className="space-y-3">
          <div>
            <Label className="block text-xs text-neutral-500 mb-1">
              Disaster Risk Tolerance
            </Label>
            <Slider
              defaultValue={[disasterRisk]}
              min={1}
              max={5}
              step={1}
              onValueChange={([value]) => setDisasterRisk(value)}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-neutral-500 mt-1">
              <span>Low Risk</span>
              <span>High Risk</span>
            </div>
          </div>

          <div>
            <Label className="block text-xs text-neutral-500 mb-1">
              Minimum Air Quality (AQI)
            </Label>
            <Select value={minAqi} onValueChange={setMinAqi}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select air quality" />
              </SelectTrigger>
              <SelectContent>
                {AQI_LEVELS.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="block text-xs text-neutral-500 mb-1">
              HDI Score (Min)
            </Label>
            <Select
              value={minHdi.toString()}
              onValueChange={(value) => setMinHdi(parseFloat(value))}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select HDI score" />
              </SelectTrigger>
              <SelectContent>
                {HDI_LEVELS.map((level) => (
                  <SelectItem key={level.value} value={level.value.toString()}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="p-4 border-b border-neutral-200">
        <h3 className="text-sm font-medium text-neutral-900 mb-3">
          Accessibility
        </h3>
        <div className="space-y-2">
          {ACCESSIBILITY_FEATURES.map((feature) => (
            <div key={feature.value} className="flex items-center space-x-2">
              <Checkbox
                id={`accessibility-${feature.value}`}
                checked={accessibilityFeatures.includes(feature.value)}
                onCheckedChange={(checked) =>
                  handleAccessibilityChange(feature.value, checked as boolean)
                }
              />
              <Label
                htmlFor={`accessibility-${feature.value}`}
                className="text-sm text-neutral-700"
              >
                {feature.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4">
        <Button
          onClick={handleApplyFilters}
          className="w-full bg-primary hover:bg-primary-dark text-white"
        >
          Apply Filters
        </Button>
        <Button
          onClick={handleResetFilters}
          variant="outline"
          className="w-full mt-2 bg-white text-neutral-700 hover:bg-neutral-100"
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export default FiltersSidebar;
