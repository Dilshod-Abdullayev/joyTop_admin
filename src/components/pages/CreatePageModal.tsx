import { useState } from "react";
import { CreatePageRequest } from "@/types/pages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import MDEditor from "@uiw/react-md-editor";

interface CreatePageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePageRequest) => Promise<void>;
}

export function CreatePageModal({
  isOpen,
  onClose,
  onSubmit,
}: CreatePageModalProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<CreatePageRequest>({
    slug: "",
    title_uz: "",
    title_ru: "",
    title_en: "",
    content_uz: "",
    content_ru: "",
    content_en: "",
  });
  const [errors, setErrors] = useState<Partial<CreatePageRequest>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    const newErrors: Partial<CreatePageRequest> = {};
    if (!formData.slug.trim()) newErrors.slug = t("pages.errors.slugRequired");
    if (!formData.title_ru.trim())
      newErrors.title_ru = t("pages.errors.titleRequired");
    if (!formData.content_ru.trim())
      newErrors.content_ru = t("pages.errors.contentRequired");

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      handleClose();
    } catch (error) {
      console.error("Error creating page:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      slug: "",
      title_uz: "",
      title_ru: "",
      title_en: "",
      content_uz: "",
      content_ru: "",
      content_en: "",
    });
    setErrors({});
    onClose();
  };

  const updateField = (field: keyof CreatePageRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-semibold">
            {t("pages.createNew")}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">{t("pages.slug")}</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => updateField("slug", e.target.value)}
                placeholder="privacy-policy"
                className={errors.slug ? "border-red-500" : ""}
              />
              {errors.slug && (
                <p className="text-sm text-red-600">{errors.slug}</p>
              )}
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">{t("pages.pageTitle")}</Label>
              <Input
                id="title"
                value={formData.title_ru}
                onChange={(e) => updateField("title_ru", e.target.value)}
                placeholder={t("pages.titlePlaceholder.ru")}
                className={errors.title_ru ? "border-red-500" : ""}
              />
              {errors.title_ru && (
                <p className="text-sm text-red-600">{errors.title_ru}</p>
              )}
            </div>

            {/* Languages */}
            {(["uz", "ru", "en"] as const).map((lang) => (
              <div key={lang} className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {t(`languages.${lang}`)}
                </h3>

                <div className="space-y-2">
                  <Label htmlFor={`title_${lang}`}>
                    {t("pages.pageTitle")} ({t(`languages.${lang}`)})
                  </Label>
                  <Input
                    id={`title_${lang}`}
                    value={formData[`title_${lang}`]}
                    onChange={(e) =>
                      updateField(`title_${lang}`, e.target.value)
                    }
                    placeholder={t(`pages.titlePlaceholder.${lang}`)}
                    className={errors[`title_${lang}`] ? "border-red-500" : ""}
                  />
                  {errors[`title_${lang}`] && (
                    <p className="text-sm text-red-600">
                      {errors[`title_${lang}`]}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`content_${lang}`}>
                    {t("pages.content")}
                  </Label>
                  <div
                    className={
                      errors[`content_${lang}`]
                        ? "border border-red-500 rounded-md"
                        : ""
                    }
                  >
                    <MDEditor
                      value={formData[`content_${lang}`]}
                      onChange={(value) =>
                        updateField(`content_${lang}`, value || "")
                      }
                      height={300}
                      data-color-mode="light"
                    />
                  </div>
                  {errors[`content_${lang}`] && (
                    <p className="text-sm text-red-600">
                      {errors[`content_${lang}`]}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
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
