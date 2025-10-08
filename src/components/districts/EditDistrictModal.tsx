import { useState, useEffect } from "react";
import { District, DistrictUpdateRequest } from "@/types/districts";
import { useDistricts } from "@/lib/hooks/useDistricts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";

interface EditDistrictModalProps {
  district: District | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EditDistrictModal({
  isOpen,
  district,
  onClose,
}: EditDistrictModalProps) {
  const { t } = useTranslation();
  const { patchDistrict } = useDistricts();
  const [formData, setFormData] = useState<DistrictUpdateRequest>({
    name: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form data when district changes
  useEffect(() => {
    if (district) {
      setFormData({
        name: district.name,
      });
    }
  }, [district]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!district) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      // Only include fields that have actually changed
      const submitData: DistrictUpdateRequest = {};

      // Check if name changed
      if (formData.name !== district.name) {
        submitData.name = formData.name;
      }

      // Only submit if there are actual changes
      if (Object.keys(submitData).length === 0) {
        // No changes detected, just close the modal
        handleClose();
        return;
      }

      await patchDistrict(district.id, submitData);
      handleClose();
    } catch (error) {
      console.error("Error updating district:", error);
      setErrors({ submit: t("districts.updateError") });
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

  if (!isOpen || !district) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t("districts.editDistrict")}</CardTitle>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">{t("districts.name")}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder={t("districts.namePlaceholder")}
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
                {isSubmitting ? t("common.updating") : t("common.update")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
