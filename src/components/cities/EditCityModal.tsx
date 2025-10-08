"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useCities } from "@/lib/hooks/useCities";
import { City, CityRequest } from "@/types/cities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, X } from "lucide-react";

interface EditCityModalProps {
  city: City;
  isOpen: boolean;
  onClose: () => void;
}

export function EditCityModal({ city, isOpen, onClose }: EditCityModalProps) {
  const { t, ready } = useTranslation();
  const { updateCity } = useCities();
  const [formData, setFormData] = useState<CityRequest>({ name: city.name });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (city) {
      setFormData({ name: city.name });
    }
  }, [city]);

  if (!isOpen || !ready) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError(t("cities.validation.nameRequired"));
      return;
    }

    if (formData.name === city.name) {
      onClose();
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await updateCity(city.id, formData);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("cities.errors.updateFailed")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof CityRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({ name: city.name });
      setError(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {t("cities.modals.edit.title")}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            disabled={isSubmitting}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("cities.fields.name")} *</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder={t("cities.placeholders.cityName")}
                disabled={isSubmitting}
                maxLength={100}
                required
              />
             
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
                disabled={isSubmitting}
                className="flex-1"
              >
                {t("common.actions.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={
                  isSubmitting ||
                  !formData.name.trim() ||
                  formData.name === city.name
                }
                className="flex-1"
              >
                {isSubmitting
                  ? t("cities.actions.updating")
                  : t("cities.actions.update")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


