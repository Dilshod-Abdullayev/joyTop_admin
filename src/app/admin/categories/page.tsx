"use client";

import { useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Search, Filter, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCategories } from "@/lib/hooks/useCategories";
import { Category } from "@/types/categories";
import { CategoriesList } from "@/components/categories/CategoriesList";
import { CategoriesSearch } from "@/components/categories/CategoriesSearch";
import { CreateCategoryModal } from "@/components/categories/CreateCategoryModal";

export default function CategoriesPage() {
  const { t, ready } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [isPaidFilter, setIsPaidFilter] = useState<boolean | undefined>(
    undefined
  );
  const [adPriceFilter, setAdPriceFilter] = useState("");
  const [minPriceFilter, setMinPriceFilter] = useState("");
  const [maxPriceFilter, setMaxPriceFilter] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Memoize filters to prevent infinite re-renders
  const filters = useMemo(
    () => ({
      search: searchTerm || undefined,
      is_paid: isPaidFilter,
      ad_price: adPriceFilter || undefined,
      min_price: minPriceFilter || undefined,
      max_price: maxPriceFilter || undefined,
      ordering: "name",
    }),
    [searchTerm, isPaidFilter, adPriceFilter, minPriceFilter, maxPriceFilter]
  );

  const { data: categories, loading, error, refetch } = useCategories(filters);

  // Memoize handlers to prevent unnecessary re-renders
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const handleFilterChange = useCallback((isPaid: boolean | undefined) => {
    setIsPaidFilter(isPaid);
  }, []);

  const handleAdPriceFilterChange = useCallback((price: string) => {
    setAdPriceFilter(price);
  }, []);

  const handleMinPriceFilterChange = useCallback((price: string) => {
    setMinPriceFilter(price);
  }, []);

  const handleMaxPriceFilterChange = useCallback((price: string) => {
    setMaxPriceFilter(price);
  }, []);

  const handleCreateSuccess = useCallback(() => {
    setShowCreateModal(false);
    refetch();
  }, [refetch]);

  const getFilterLabel = useCallback(() => {
    if (isPaidFilter === true)
      return ready ? t("categories.filters.paid") : "Paid";
    if (isPaidFilter === false)
      return ready ? t("categories.filters.free") : "Free";
    return ready ? t("categories.filters.all") : "All";
  }, [isPaidFilter, ready, t]);

  return (
    <div className="p-6 space-y-6">
      {/* Header - Always Visible */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {ready ? t("categories.title") : "Categories"}
          </h1>
          <p className="text-gray-600">
            {ready
              ? t("categories.description")
              : "Manage property categories and their settings"}
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          {ready ? t("categories.actions.create") : "Create Category"}
        </Button>
      </div>

      {/* Search and Filters - Always Visible */}
      <CategoriesSearch
        searchTerm={searchTerm}
        onSearch={handleSearch}
        isPaidFilter={isPaidFilter}
        onFilterChange={handleFilterChange}
        adPriceFilter={adPriceFilter}
        onAdPriceFilterChange={handleAdPriceFilterChange}
        minPriceFilter={minPriceFilter}
        onMinPriceFilterChange={handleMinPriceFilterChange}
        maxPriceFilter={maxPriceFilter}
        onMaxPriceFilterChange={handleMaxPriceFilterChange}
      />

      {/* Error Display - Show above content if there's an error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-red-600">Error</h2>
            <p className="text-gray-600">{error}</p>
            <Button onClick={refetch} className="mt-4">
              {ready ? t("common.retry") : "Retry"}
            </Button>
          </div>
        </div>
      )}

      {/* Stats Cards - Show loading state but keep structure */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {ready ? t("categories.stats.total") : "Total Categories"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              <div className="text-2xl font-bold">
                {categories?.length || 0}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {ready ? t("categories.stats.paid") : "Paid Categories"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              <div className="text-2xl font-bold text-blue-600">
                {categories?.filter((cat) => cat.is_paid).length || 0}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {ready ? t("categories.stats.free") : "Free Categories"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              <div className="text-2xl font-bold text-green-600">
                {categories?.filter((cat) => !cat.is_paid).length || 0}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Categories List - Show loading state or content */}
      {loading ? (
        <div className="space-y-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <CategoriesList categories={categories || []} onUpdate={refetch} />
      )}

      {/* Create Category Modal */}
      <CreateCategoryModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}
