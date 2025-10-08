import { useState } from "react";
import { Page } from "@/types/pages";
import { PageCard } from "./PageCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { useTranslation } from "react-i18next";

interface PagesListProps {
  pages: Page[];
  loading: boolean;
  onEdit: (page: Page) => void;
  onDelete: (page: Page) => void;
  onView: (page: Page) => void;
  onCreate: () => void;
  onSearch: (query: string) => void;
}

export function PagesList({
  pages,
  loading,
  onEdit,
  onDelete,
  onView,
  onCreate,
  onSearch,
}: PagesListProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-10 w-64 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-48 bg-gray-200 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (pages.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Search className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {searchQuery ? t("pages.noResults") : t("pages.noPages")}
        </h3>
        <p className="text-gray-500 mb-6">
          {searchQuery
            ? t("pages.noResultsDescription")
            : t("pages.noPagesDescription")}
        </p>
        {!searchQuery && (
          <Button onClick={onCreate} className="gap-2">
            <Plus className="w-4 h-4" />
            {t("pages.createFirst")}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Create */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder={t("pages.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={onCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          {t("pages.createNew")}
        </Button>
      </div>

      {/* Pages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pages.map((page) => (
          <PageCard
            key={page.id}
            page={page}
            onEdit={onEdit}
            onDelete={onDelete}
            onView={onView}
          />
        ))}
      </div>
    </div>
  );
}
