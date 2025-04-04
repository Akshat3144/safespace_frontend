import { useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Neighborhood } from "@/lib/types";

interface HDIChartProps {
  neighborhoods: Neighborhood[];
}

const HDIChart = ({ neighborhoods }: HDIChartProps) => {
  const chartsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    // Animate the charts when they appear
    const timeout = setTimeout(() => {
      chartsRef.current.forEach((chart, index) => {
        if (chart) {
          const bar = chart.querySelector(".chart-bar");
          if (bar instanceof HTMLElement) {
            bar.style.width = "0";
            setTimeout(() => {
              if (neighborhoods[index]) {
                bar.style.width = `${neighborhoods[index].hdiScore * 100}%`;
              }
            }, 50 * index);
          }
        }
      });
    }, 300);

    return () => clearTimeout(timeout);
  }, [neighborhoods]);

  // Sort neighborhoods by HDI score in descending order
  const sortedNeighborhoods = [...neighborhoods].sort(
    (a, b) => b.hdiScore - a.hdiScore
  );

  const getHDIColor = (score: number) => {
    if (score >= 0.8) return "bg-primary";
    if (score >= 0.7) return "bg-warning";
    return "bg-danger";
  };

  return (
    <Card className="bg-white shadow-sm rounded-lg overflow-hidden mb-6">
      <CardHeader className="p-4 border-b border-neutral-200">
        <CardTitle className="font-semibold text-neutral-900 font-sans">
          Human Development Index (HDI) by Area
        </CardTitle>
        <CardDescription className="text-sm text-neutral-700 mt-1">
          HDI measures overall achievement in key dimensions of human
          development: health, education, and standard of living.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          {sortedNeighborhoods.map((neighborhood, index) => (
            <div
              key={neighborhood.id}
              className="flex items-center"
              ref={(el) => {
                if (el) chartsRef.current[index] = el;
              }}
            >
              <div className="w-1/4 sm:w-1/5 text-sm font-medium text-neutral-700">
                {neighborhood.name}
              </div>
              <div className="w-3/4 sm:w-4/5 flex items-center">
                <div className="w-full bg-neutral-200 rounded-full h-4 mr-2">
                  <div
                    className={`${getHDIColor(
                      neighborhood.hdiScore
                    )} rounded-full h-4 chart-bar transition-all duration-500 ease-in-out`}
                    style={{ width: `${neighborhood.hdiScore * 100}%` }}
                  ></div>
                </div>
                <div className="text-sm font-medium text-neutral-700 whitespace-nowrap">
                  {neighborhood.hdiScore.toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-sm text-neutral-500">
          <div className="flex items-center text-xs space-x-4 flex-wrap">
            <div className="flex items-center my-1">
              <span className="inline-block w-3 h-3 rounded-full bg-primary mr-1"></span>
              <span>High (0.8+)</span>
            </div>
            <div className="flex items-center my-1">
              <span className="inline-block w-3 h-3 rounded-full bg-warning mr-1"></span>
              <span>Medium (0.7-0.79)</span>
            </div>
            <div className="flex items-center my-1">
              <span className="inline-block w-3 h-3 rounded-full bg-danger mr-1"></span>
              <span>Low (&lt; 0.7)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HDIChart;
