"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DistrictsList } from "@/components/districts/DistrictsList";
import { DistrictsSearch } from "@/components/districts/DistrictsSearch";
import { CreateDistrictModal } from "@/components/districts/CreateDistrictModal";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { DistrictFilters } from "@/types/districts";

export default function DistrictsPage() {
  const { t, ready } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const filters: DistrictFilters = {
    search: debouncedSearchQuery,
  };

  const handlePageChange = (page: number) => {
    // Page change is handled by the hook
  };

  const handlePageSizeChange = (pageSize: number) => {
    // Page size change is handled by the hook
  };

  if (!ready) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t("districts.page.title")}
          </h1>
          <p className="mt-2 text-gray-600">
            {t("districts.page.description")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t("districts.actions.addDistrict")}
          </button>
        </div>
      </div>

      {/* Search */}
      <DistrictsSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Districts List */}
      <DistrictsList
        filters={filters}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      {/* Create District Modal */}
      <CreateDistrictModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
