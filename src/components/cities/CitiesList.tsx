"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useCities } from "@/lib/hooks/useCities";
import { City } from "@/types/cities";
import { EditCityModal } from "@/components/cities/EditCityModal";
import { DeleteCityModal } from "@/components/cities/DeleteCityModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, MapPin } from "lucide-react";

export function CitiesList() {
  const { t, ready } = useTranslation();
  const { cities, loading, error } = useCities();
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [deletingCity, setDeletingCity] = useState<City | null>(null);

  if (!ready) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-lg">Loading...</div>
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

  if (cities.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-gray-500">
            <MapPin className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {t("cities.table.noCities")}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {t("cities.table.noCitiesDescription")}
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
            {t("cities.table.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    {t("cities.table.id")}
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    {t("cities.table.name")}
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">
                    {t("cities.table.actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {cities.map((city) => (
                  <tr key={city.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <Badge variant="secondary">#{city.id}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {city.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingCity(city)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="ml-2">
                            {t("common.actions.edit")}
                          </span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeletingCity(city)}
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

      {/* Edit City Modal */}
      {editingCity && (
        <EditCityModal
          city={editingCity}
          isOpen={!!editingCity}
          onClose={() => setEditingCity(null)}
        />
      )}

      {/* Delete City Modal */}
      {deletingCity && (
        <DeleteCityModal
          city={deletingCity}
          isOpen={!!deletingCity}
          onClose={() => setDeletingCity(null)}
        />
      )}
    </>
  );
}


