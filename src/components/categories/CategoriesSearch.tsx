"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Search, X, DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

interface CategoriesSearchProps {
  searchTerm: string;
  onSearch: (term: string) => void;
  isPaidFilter: boolean | undefined;
  onFilterChange: (isPaid: boolean | undefined) => void;
  adPriceFilter: string;
  onAdPriceFilterChange: (price: string) => void;
  minPriceFilter: string;
  onMinPriceFilterChange: (price: string) => void;
  maxPriceFilter: string;
  onMaxPriceFilterChange: (price: string) => void;
}

export function CategoriesSearch({
  searchTerm,
  onSearch,
  isPaidFilter,
  onFilterChange,
  adPriceFilter,
  onAdPriceFilterChange,
  minPriceFilter,
  onMinPriceFilterChange,
  maxPriceFilter,
  onMaxPriceFilterChange,
}: CategoriesSearchProps) {
  const { t, ready } = useTranslation();
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
  };

  const handleSearch = () => {
    onSearch(localSearchTerm);
  };

  const handleClearSearch = () => {
    setLocalSearchTerm("");
    onSearch("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearFilters = () => {
    onFilterChange(undefined);
    onAdPriceFilterChange("");
    onMinPriceFilterChange("");
    onMaxPriceFilterChange("");
    setLocalSearchTerm("");
    onSearch("");
  };

  const hasActiveFilters =
    searchTerm ||
    isPaidFilter !== undefined ||
    adPriceFilter ||
    minPriceFilter ||
    maxPriceFilter;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder={
              ready
                ? t("categories.search.placeholder")
                : "Search categories..."
            }
            value={localSearchTerm}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
            className="pl-10"
          />
          {localSearchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
        <Button onClick={handleSearch}>
          {ready ? t("common.search") : "Search"}
        </Button>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        {/* Status Filter */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">
            {ready ? t("categories.filters.status") : "Status"}:
          </span>
          <Button
            variant={isPaidFilter === undefined ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange(undefined)}
          >
            {ready ? t("categories.filters.all") : "All"}
          </Button>
          <Button
            variant={isPaidFilter === true ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange(true)}
          >
            {ready ? t("categories.filters.paid") : "Paid"}
          </Button>
          <Button
            variant={isPaidFilter === false ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange(false)}
          >
            {ready ? t("categories.filters.free") : "Free"}
          </Button>
        </div>

        {/* Price Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className="text-sm text-gray-600">
              {ready ? t("categories.filters.exactPrice") : "Exact Price"}
            </Label>
            <div className="relative mt-1">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="number"
                placeholder="0"
                value={adPriceFilter}
                onChange={(e) => onAdPriceFilterChange(e.target.value)}
                className="pl-10"
                min="0"
                step="1000"
              />
            </div>
          </div>

          <div>
            <Label className="text-sm text-gray-600">
              {ready ? t("categories.filters.minPrice") : "Min Price"}
            </Label>
            <div className="relative mt-1">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="number"
                placeholder="0"
                value={minPriceFilter}
                onChange={(e) => onMinPriceFilterChange(e.target.value)}
                className="pl-10"
                min="0"
                step="1000"
              />
            </div>
          </div>

          <div>
            <Label className="text-sm text-gray-600">
              {ready ? t("categories.filters.maxPrice") : "Max Price"}
            </Label>
            <div className="relative mt-1">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="number"
                placeholder="0"
                value={maxPriceFilter}
                onChange={(e) => onMaxPriceFilterChange(e.target.value)}
                className="pl-10"
                min="0"
                step="1000"
              />
            </div>
          </div>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {searchTerm && (
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800"
                >
                  {ready ? t("categories.filters.search") : "Search"}: "
                  {searchTerm}"
                </Badge>
              )}
              {isPaidFilter !== undefined && (
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  {ready ? t("categories.filters.status") : "Status"}:{" "}
                  {isPaidFilter
                    ? ready
                      ? t("categories.filters.paid")
                      : "Paid"
                    : ready
                    ? t("categories.filters.free")
                    : "Free"}
                </Badge>
              )}
              {adPriceFilter && (
                <Badge
                  variant="secondary"
                  className="bg-purple-100 text-purple-800"
                >
                  {ready ? t("categories.filters.exactPrice") : "Price"}:{" "}
                  {parseInt(adPriceFilter).toLocaleString()} UZS
                </Badge>
              )}
              {(minPriceFilter || maxPriceFilter) && (
                <Badge
                  variant="secondary"
                  className="bg-orange-100 text-orange-800"
                >
                  {ready ? t("categories.filters.priceRange") : "Range"}:{" "}
                  {minPriceFilter
                    ? `${parseInt(minPriceFilter).toLocaleString()}`
                    : "0"}{" "}
                  -{" "}
                  {maxPriceFilter
                    ? `${parseInt(maxPriceFilter).toLocaleString()}`
                    : "∞"}{" "}
                  UZS
                </Badge>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              {ready ? t("categories.filters.clear") : "Clear All"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
