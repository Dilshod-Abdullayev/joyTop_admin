"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDistricts } from "@/lib/hooks/useDistricts";
import { District } from "@/types/districts";
import { EditDistrictModal } from "./EditDistrictModal";
import { DeleteDistrictModal } from "./DeleteDistrictModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { DistrictFilters } from "@/types/districts";
import { Pagination } from "@/components/ui/Pagination";

interface DistrictsListProps {
  filters?: DistrictFilters;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export function DistrictsList({
  filters = {},
  onPageChange,
  onPageSizeChange,
}: DistrictsListProps) {
  const { t, ready } = useTranslation();
  const { districts, loading, error, pagination, changePage, changePageSize } =
    useDistricts(filters);
  const [editingDistrict, setEditingDistrict] = useState<District | null>(null);
  const [deletingDistrict, setDeletingDistrict] = useState<District | null>(
    null
  );

  const handlePageChange = (page: number) => {
    changePage(page);
    onPageChange?.(page);
  };

  const handlePageSizeChange = (pageSize: number) => {
    changePageSize(pageSize);
    onPageSizeChange?.(pageSize);
  };

  if (!ready) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-lg">{t("common.loading")}</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-16 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-600">
            <p className="text-lg font-medium">
              {t("common.errors.loadingError")}
            </p>
            <p className="text-sm mt-2">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (districts.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-gray-500">
            <MapPin className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {t("districts.table.noDistricts")}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {t("districts.table.noDistrictsDescription")}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {t("districts.table.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    {t("districts.table.id")}
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    {t("districts.table.name")}
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">
                    {t("districts.table.actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {districts.map((district) => (
                  <tr key={district.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <Badge variant="secondary">#{district.id}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {district.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingDistrict(district)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="ml-2">
                            {t("common.actions.edit")}
                          </span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeletingDistrict(district)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="ml-2">
                            {t("common.actions.delete")}
                          </span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.count}
            pageSize={pagination.pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            showPageSizeSelector={true}
          />
        </div>
      )}

      {/* Edit District Modal */}
      {editingDistrict && (
        <EditDistrictModal
          district={editingDistrict}
          isOpen={!!editingDistrict}
          onClose={() => setEditingDistrict(null)}
        />
      )}

      {/* Delete District Modal */}
      {deletingDistrict && (
        <DeleteDistrictModal
          district={deletingDistrict}
          isOpen={!!deletingDistrict}
          onClose={() => setDeletingDistrict(null)}
        />
      )}
    </>
  );
}
