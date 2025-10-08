"use client";

import { useTranslation } from "react-i18next";
import { Search, Plus } from "lucide-react";

interface PropertiesSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddProperty: () => void;
}

export function PropertiesSearch({
  searchQuery,
  onSearchChange,
  onAddProperty,
}: PropertiesSearchProps) {
  const { t, ready } = useTranslation();

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      {/* Search Input */}
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={
              ready
                ? t("properties.searchPlaceholder")
                : "Поиск по названию или описанию..."
            }
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
      </div>
    </div>
  );
}
