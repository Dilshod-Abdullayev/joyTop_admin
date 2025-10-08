import { useState } from "react";
import { FeatureRequest } from "@/types/features";
import { useFeatures } from "@/lib/hooks/useFeatures";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";

interface CreateFeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingFeatures?: Array<{ name: string }>;
}

export function CreateFeatureModal({
  isOpen,
  onClose,
  existingFeatures = [],
}: CreateFeatureModalProps) {
  const { t } = useTranslation();
  const { createFeature } = useFeatures();
  const [formData, setFormData] = useState<FeatureRequest>({
    name: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // Check for duplicate names
    const isDuplicate = existingFeatures.some(
      (feature) => feature.name.toLowerCase() === formData.name.toLowerCase()
    );

    if (isDuplicate) {
      setErrors({ submit: t("features.duplicateError") });
      setIsSubmitting(false);
      return;
    }

    try {
      await createFeature(formData);
      handleClose();
    } catch (error) {
      console.error("Error creating feature:", error);
      const errorMessage =
        error instanceof Error ? error.message : t("features.createError");

      // Handle specific error cases
      if (
        errorMessage.includes("duplicate key value violates unique constraint")
      ) {
        setErrors({ submit: t("features.duplicateError") });
      } else if (errorMessage.includes("IntegrityError")) {
        setErrors({ submit: t("features.duplicateError") });
      } else {
        setErrors({ submit: errorMessage });
      }
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
            <CardTitle>{t("features.createFeature")}</CardTitle>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">{t("features.name")} *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder={t("features.namePlaceholder")}
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
