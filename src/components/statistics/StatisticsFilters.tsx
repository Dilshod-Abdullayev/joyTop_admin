import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StatisticsFilters as StatisticsFiltersType } from "@/types/statistics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Filter } from "lucide-react";

interface StatisticsFiltersProps {
  filters: StatisticsFiltersType;
  onFiltersChange: (filters: StatisticsFiltersType) => void;
}

export function StatisticsFilters({
  filters,
  onFiltersChange,
}: StatisticsFiltersProps) {
  const { t, ready } = useTranslation();
  const [localFilters, setLocalFilters] =
    useState<StatisticsFiltersType>(filters);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFiltersChange(localFilters);
  };

  const handleReset = () => {
    const resetFilters: StatisticsFiltersType = {
      period: "month",
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  const handlePeriodChange = (period: StatisticsFiltersType["period"]) => {
    const newFilters = { ...localFilters, period };
    setLocalFilters(newFilters);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Filter className="w-5 h-5 mr-2" />
          {ready ? t("statistics.filters.title") : "Фильтры"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Period Selection */}
            <div className="space-y-2">
              <Label htmlFor="period">
                {ready ? t("statistics.filters.period") : "Период"}
              </Label>
              <div className="flex space-x-2">
                {(["day", "week", "month", "year"] as const).map((period) => (
                  <Button
                    key={period}
                    type="button"
                    variant={
                      localFilters.period === period ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => handlePeriodChange(period)}
                  >
                    {ready ? t(`statistics.filters.periods.${period}`) : period}
                  </Button>
                ))}
              </div>
            </div>

            {/* Date From */}
            <div className="space-y-2">
              <Label htmlFor="date_from">
                {ready ? t("statistics.filters.dateFrom") : "Дата от"}
              </Label>
              <Input
                id="date_from"
                type="date"
                value={localFilters.date_from || ""}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    date_from: e.target.value,
                  })
                }
              />
            </div>

            {/* Date To */}
            <div className="space-y-2">
              <Label htmlFor="date_to">
                {ready ? t("statistics.filters.dateTo") : "Дата до"}
              </Label>
              <Input
                id="date_to"
                type="date"
                value={localFilters.date_to || ""}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, date_to: e.target.value })
                }
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Button type="submit">
              {ready ? t("statistics.filters.apply") : "Применить"}
            </Button>
            <Button type="button" variant="outline" onClick={handleReset}>
              {ready ? t("statistics.filters.reset") : "Сбросить"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
