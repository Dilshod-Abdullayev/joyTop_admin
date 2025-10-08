import { useState } from "react";
import { DistrictRequest } from "@/types/districts";
import { useDistricts } from "@/lib/hooks/useDistricts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";

interface CreateDistrictModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateDistrictModal({
  isOpen,
  onClose,
}: CreateDistrictModalProps) {
  const { t } = useTranslation();
  const { createDistrict } = useDistricts();
  const [formData, setFormData] = useState<DistrictRequest>({
    name: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      await createDistrict(formData);
      handleClose();
    } catch (error) {
      console.error("Error creating district:", error);
      setErrors({ submit: t("districts.createError") });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t("districts.createDistrict")}</CardTitle>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">{t("districts.name")} *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder={t("districts.namePlaceholder")}
                required
                maxLength={100}
              />
            </div>

            {/* Error Message */}
            {errors.submit && (
              <div className="text-sm text-red-600">{errors.submit}</div>
            )}

            {/* Submit Buttons */}
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={handleClose}>
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t("common.creating") : t("common.create")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
