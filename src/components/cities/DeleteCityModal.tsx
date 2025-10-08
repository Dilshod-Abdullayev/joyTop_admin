"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useCities } from "@/lib/hooks/useCities";
import { City } from "@/types/cities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, X, AlertTriangle } from "lucide-react";

interface DeleteCityModalProps {
  city: City;
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteCityModal({
  city,
  isOpen,
  onClose,
}: DeleteCityModalProps) {
  const { t, ready } = useTranslation();
  const { deleteCity } = useCities();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !ready) return null;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError(null);
      await deleteCity(city.id);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("cities.errors.deleteFailed")
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      setError(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            {t("cities.modals.delete.title")}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            disabled={isDeleting}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
              <MapPin className="h-5 w-5 text-red-600" />
              <div>
                <p className="font-medium text-gray-900">{city.name}</p>
                <p className="text-sm text-gray-600">ID: #{city.id}</p> 
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-700 mb-2">
                {t("cities.modals.delete.confirmation", { name: city.name })}
              </p>
              <p className="text-sm text-gray-500">
                {t("cities.modals.delete.warning")}
              </p>
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isDeleting}
                className="flex-1"
              >
                {t("common.actions.cancel")}
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1"
              >
                {isDeleting
                  ? t("cities.actions.deleting")
                  : t("cities.actions.delete")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
