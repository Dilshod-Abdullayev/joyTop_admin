"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useCities } from "@/lib/hooks/useCities";
import { CityRequest } from "@/types/cities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, X } from "lucide-react";

interface CreateCityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateCityModal({ isOpen, onClose }: CreateCityModalProps) {
  const { t, ready } = useTranslation();
  const { createCity } = useCities();
  const [formData, setFormData] = useState<CityRequest>({ name: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !ready) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError(t("cities.validation.nameRequired"));
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await createCity(formData);
      setFormData({ name: "" });
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("cities.errors.createFailed")
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
      setFormData({ name: "" });
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
            {t("cities.modals.create.title")}
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
              <p className="text-xs text-gray-500">
                {t("cities.validation.maxLength", { max: 100 })}
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
                disabled={isSubmitting}
                className="flex-1"
              >
                {t("common.actions.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !formData.name.trim()}
                className="flex-1"
              >
                {isSubmitting
                  ? t("cities.actions.creating")
                  : t("cities.actions.create")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


