"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useProperties } from "@/lib/hooks/useProperties";
import { PropertiesSearch } from "@/components/properties/PropertiesSearch";
import { PropertiesList } from "@/components/properties/PropertiesList";

export default function PropertiesPage() {
  const { t, ready } = useTranslation();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const {
    properties,
    loading,
    error,
    pagination,
    updateFilters,
    clearFilters,
    changePage,
    changePageSize,
    refresh,
    deleteProperty,
    toggleStatus,
  } = useProperties();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        updateFilters({ search: searchQuery.trim() });
      } else {
        updateFilters({ search: undefined });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, updateFilters]);

  const handleAddProperty = () => {
    router.push("/admin/properties/new");
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handlePageChange = (page: number) => {
    changePage(page);
  };

  const handlePageSizeChange = (pageSize: number) => {
    changePageSize(pageSize);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {ready ? t("properties.title") : "Управление недвижимостью"}
        </h1>
        <p className="text-gray-600 mt-2">
          {ready
            ? t("properties.subtitle")
            : "Управление объявлениями недвижимости"}
        </p>
      </div>

      <PropertiesSearch
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onAddProperty={handleAddProperty}
      />

      <PropertiesList
        properties={properties}
        loading={loading}
        error={error}
        pagination={pagination}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}
