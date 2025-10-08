"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FeaturesList } from "@/components/features/FeaturesList";
import { FeaturesSearch } from "@/components/features/FeaturesSearch";
import { CreateFeatureModal } from "@/components/features/CreateFeatureModal";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { FeatureFilters } from "@/types/features";
import { useFeatures } from "@/lib/hooks/useFeatures";

export default function FeaturesPage() {
  const { t, ready } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const filters: FeatureFilters = {
    search: debouncedSearchQuery,
  };

  // Get existing features for duplicate checking
  const { features } = useFeatures();

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
            {t("features.page.title")}
          </h1>
          <p className="mt-2 text-gray-600">{t("features.page.description")}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t("features.actions.addFeature")}
          </button>
        </div>
      </div>

      {/* Search */}
      <FeaturesSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Features List */}
      <FeaturesList filters={filters} />

      {/* Create Feature Modal */}
      <CreateFeatureModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        existingFeatures={features}
      />
    </div>
  );
}
