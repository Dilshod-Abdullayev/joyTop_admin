"use client";

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useCities } from "@/lib/hooks/useCities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

export function CitiesSearch() {
  const { t, ready } = useTranslation();
  const { cities } = useCities();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCities = useMemo(() => {
    if (!searchTerm.trim()) return cities;
    return cities.filter((city) =>
      city.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [cities, searchTerm]);

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  if (!ready) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          {t("cities.search.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder={t("cities.search.placeholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {searchTerm && (
          <div className="mt-4 text-sm text-gray-600">
            {t("cities.search.results", {
              count: filteredCities.length,
              total: cities.length,
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}


