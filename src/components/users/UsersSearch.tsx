"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Search, Filter, X, Plus } from "lucide-react";
import { UserFilters } from "@/types/users";

interface UsersSearchProps {
  filters: UserFilters;
  onFiltersChange: (filters: Partial<UserFilters>) => void;
  onClearFilters: () => void;
}

export function UsersSearch({
  filters,
  onFiltersChange,
  onClearFilters,
}: UsersSearchProps) {
  const { t, ready } = useTranslation();
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (value: string) => {
    onFiltersChange({ search: value });
  };

  const handleFilterChange = (key: keyof UserFilters, value: string) => {
    onFiltersChange({ [key]: value });
  };

  const hasActiveFilters = filters.role || filters.status || filters.language;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      {/* Search Bar */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={
              ready ? t("users.search.placeholder") : "Поиск пользователей..."
            }
            value={filters.search || ""}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
}
