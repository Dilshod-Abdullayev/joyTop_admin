"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  Building2,
  User,
  MapPin,
  Tag,
  CreditCard,
} from "lucide-react";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { searchApi, SearchResult } from "@/lib/api/search";

// Icon mapping for search results
const iconMap = {
  Building2,
  User,
  MapPin,
  Tag,
  CreditCard,
};

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const { t, ready } = useTranslation();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle search query changes
  useEffect(() => {
    if (debouncedQuery.trim().length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const performSearch = async () => {
      setIsLoading(true);
      try {
        // Use the real Building API for search
        const searchResults = await searchApi.globalSearch({
          query: debouncedQuery,
          limit: 20,
        });

        setResults(searchResults);
        setShowResults(true);
      } catch (error) {
        console.error("Search failed:", error);
        // Show user-friendly error message
        setResults([]);
        // You could set an error state here to show a message to the user
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [debouncedQuery]);

  const handleResultClick = (result: SearchResult) => {
    router.push(result.url);
    onClose();
    setQuery("");
    setResults([]);
    setShowResults(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  const getTypeLabel = (type: SearchResult["type"]) => {
    switch (type) {
      case "property":
        return ready ? t("search.types.property") : "Недвижимость";
      case "user":
        return ready ? t("search.types.user") : "Пользователь";
      case "category":
        return ready ? t("search.types.category") : "Категория";
      case "city":
        return ready ? t("search.types.city") : "Город";
      case "tariff":
        return ready ? t("search.types.tariff") : "Тариф";
      default:
        return "";
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Search Modal */}
      <div className="fixed top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl z-50">
        <div className="mx-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              ref={inputRef}
              type="text"
              placeholder={
                ready
                  ? t("search.placeholder")
                  : "Поиск по недвижимости, пользователям, категориям..."
              }
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full pl-12 pr-12 py-4 border-0 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg bg-white"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery("");
                  setResults([]);
                  setShowResults(false);
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Search Results */}
          {showResults && (
            <div className="mt-2 bg-white rounded-xl shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="p-6 text-center text-gray-500">
                  {ready ? t("search.searching") : "Поиск..."}
                </div>
              ) : results.length > 0 ? (
                <div className="py-2">
                  {results.map((result) => (
                    <button
                      key={`${result.type}-${result.id}`}
                      onClick={() => handleResultClick(result)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3"
                    >
                      <div className="flex-shrink-0">
                        {(() => {
                          const IconComponent =
                            iconMap[result.icon as keyof typeof iconMap];
                          return IconComponent ? (
                            <IconComponent className="w-5 h-5 text-gray-400" />
                          ) : null;
                        })()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {result.title}
                          </p>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {getTypeLabel(result.type)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          {result.subtitle}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : query.trim().length >= 2 ? (
                <div className="p-6 text-center text-gray-500">
                  {ready ? t("search.noResults") : "Ничего не найдено"}
                </div>
              ) : null}
            </div>
          )}

          {/* Search Tips */}
          {!showResults && query.trim().length < 2 && (
            <div className="mt-2 bg-white rounded-xl shadow-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-600 mb-3">
                {ready ? t("search.tips.title") : "Поиск по:"}
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4" />
                  <span>
                    {ready ? t("search.tips.properties") : "Недвижимость"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>{ready ? t("search.tips.users") : "Пользователи"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>{ready ? t("search.tips.cities") : "Города"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Tag className="w-4 h-4" />
                  <span>
                    {ready ? t("search.tips.categories") : "Категории"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
