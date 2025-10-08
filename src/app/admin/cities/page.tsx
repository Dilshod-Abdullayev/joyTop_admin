"use client";

import { useTranslation } from "react-i18next";
import { CitiesList } from "@/components/cities/CitiesList";
import { CitiesSearch } from "@/components/cities/CitiesSearch";
import { CreateCityModal } from "@/components/cities/CreateCityModal";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import i18n from "@/lib/i18n";

export default function CitiesPage() {
  const { t, ready } = useTranslation();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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
            {t("cities.page.title")}
          </h1>
          <p className="mt-2 text-gray-600">{t("cities.page.description")}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t("cities.actions.addCity")}
          </button>
        </div>
      </div>


      {/* Cities List */}
      <CitiesList />

      {/* Create City Modal */}
      <CreateCityModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
