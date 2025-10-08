"use client";

import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  showPageSizeSelector?: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  showPageSizeSelector = false,
}: PaginationProps) {
  const { t, ready } = useTranslation();

  const startItem = Math.max(1, (currentPage - 1) * pageSize + 1);
  const endItem = Math.min(currentPage * pageSize, totalItems || 0);

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  // Safety checks for invalid values
  if (!totalItems || isNaN(totalItems) || totalItems <= 0) {
    return null;
  }

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex mb-6 items-center justify-between px-4 py-3 bg-white rounded border-gray-200 sm:px-6">
      {/* Items info */}
      <div className="flex items-center text-sm text-gray-700">
        <span>
          {ready ? t("properties.pagination.showing") : "Показано"} {startItem}{" "}
          - {endItem} {ready ? t("properties.pagination.of") : "из"}{" "}
          {totalItems || 0}{" "}
          {ready ? t("properties.pagination.results") : "результатов"}
        </span>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center space-x-2">
        {/* Page size selector */}
        {showPageSizeSelector && onPageSizeChange && (
          <div className="flex items-center space-x-2 mr-4">
            <span className="text-sm text-gray-700">
              {ready ? t("properties.pagination.show") : "Показать"}:
            </span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        )}

        {/* Previous button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="sr-only">
            {ready ? t("properties.pagination.previous") : "Предыдущая"}
          </span>
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Page numbers */}
        <div className="flex items-center space-x-1">
          {getVisiblePages().map((page, index) => (
            <div key={index}>
              {page === "..." ? (
                <span className="px-3 py-2 text-sm text-gray-500">...</span>
              ) : (
                <button
                  onClick={() => handlePageChange(page as number)}
                  className={`relative inline-flex items-center px-3 py-2 text-sm font-medium ${
                    page === currentPage
                      ? "z-10 bg-blue-600 border-blue-600 text-white"
                      : "bg-white text-gray-500 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="sr-only">
            {ready ? t("properties.pagination.next") : "Следующая"}
          </span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
