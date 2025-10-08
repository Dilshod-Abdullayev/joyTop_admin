"use client";

import { useTranslation } from "react-i18next";
import { Property } from "@/types/properties";
import { PropertyCard } from "./PropertyCard";
import { Pagination } from "@/components/ui/Pagination";

interface PropertiesListProps {
  properties: Property[];
  loading: boolean;
  error: string | null;
  pagination: {
    count: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export function PropertiesList({
  properties,
  loading,
  error,
  pagination,
  onPageChange,
  onPageSizeChange,
}: PropertiesListProps) {
  const { t, ready } = useTranslation();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse"
          >
            <div className="h-48 bg-gray-200"></div>
            <div className="p-6 space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-red-800 mb-2">
          {ready ? t("properties.error") : "Ошибка загрузки объявлений"}
        </h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
        <div className="text-gray-400 mb-4">
          <svg
            className="mx-auto h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {ready ? t("properties.noProperties") : "Объявления не найдены"}
        </h3>
        <p className="text-gray-500">
          {ready
            ? "Попробуйте изменить фильтры или создать новое объявление"
            : "Попробуйте изменить фильтры или создать новое объявление"}
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Properties Grid */}{" "}
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        totalItems={pagination.count}
        pageSize={pagination.pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        showPageSizeSelector={true}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
      {/* Pagination */}
    </div>
  );
}
