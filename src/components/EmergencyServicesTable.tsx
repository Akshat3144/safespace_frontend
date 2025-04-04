import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Badge } from "./ui/badge"; // Changed from BadgeColored to Badge
import { Neighborhood } from "../lib/types";

interface EmergencyServicesTableProps {
  neighborhoods: Neighborhood[];
}

const EmergencyServicesTable = ({
  neighborhoods,
}: EmergencyServicesTableProps) => {
  // Sort neighborhoods by safety level
  const sortedNeighborhoods = [...neighborhoods].sort((a, b) => {
    const safetyOrder = { high: 0, medium: 1, low: 2 };
    return (
      safetyOrder[a.safetyLevel as keyof typeof safetyOrder] -
      safetyOrder[b.safetyLevel as keyof typeof safetyOrder]
    );
  });

  // Helper function to determine badge variant
  // Updated to return variant names from badge.tsx: "default", "secondary", "destructive"
  const getBadgeVariant = (
    value: number,
    thresholds: { good: number; moderate: number }
  ) => {
    if (value <= thresholds.good) return "default";
    if (value <= thresholds.moderate) return "secondary";
    return "destructive";
  };

  return (
    <Card className="bg-white shadow-sm rounded-lg overflow-hidden">
      <CardHeader className="p-4 border-b border-neutral-200">
        <CardTitle className="font-semibold text-neutral-900 font-sans">
          Emergency Services Accessibility
        </CardTitle>
        <CardDescription className="text-sm text-neutral-700 mt-1">
          Response times and proximity to emergency services by neighborhood.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-100">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider"
                >
                  Neighborhood
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider"
                >
                  Police Response
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider"
                >
                  Fire Response
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider"
                >
                  Medical Response
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider"
                >
                  Hospitals
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider"
                >
                  Shelters
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {sortedNeighborhoods.map((neighborhood) => (
                <tr key={neighborhood.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                    {neighborhood.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                    <Badge
                      variant={getBadgeVariant(neighborhood.policeResponse, {
                        good: 4,
                        moderate: 7,
                      })}
                    >
                      {neighborhood.policeResponse} min
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                    <Badge
                      variant={getBadgeVariant(neighborhood.fireResponse, {
                        good: 5,
                        moderate: 8,
                      })}
                    >
                      {neighborhood.fireResponse} min
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                    <Badge
                      variant={getBadgeVariant(neighborhood.medicalResponse, {
                        good: 6,
                        moderate: 9,
                      })}
                    >
                      {neighborhood.medicalResponse} min
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                    <Badge
                      variant={getBadgeVariant(neighborhood.hospitalDistance, {
                        good: 2,
                        moderate: 4,
                      })}
                    >
                      {neighborhood.hospitalDistance.toFixed(1)} miles
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                    <Badge
                      variant={getBadgeVariant(neighborhood.shelterDistance, {
                        good: 3,
                        moderate: 5,
                      })}
                    >
                      {neighborhood.shelterDistance.toFixed(1)} miles
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmergencyServicesTable;
