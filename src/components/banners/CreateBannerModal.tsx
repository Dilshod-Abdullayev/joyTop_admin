import { useState } from "react";
import { Banner, BannerRequest } from "@/types/banners";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { X, Upload, Image as ImageIcon } from "lucide-react";

interface CreateBannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BannerRequest) => Promise<void>;
}

export function CreateBannerModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateBannerModalProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<BannerRequest>({
    title: "",
    image: "",
    link: "",
    end_date: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const submitData: BannerRequest = {
        ...formData,
        image: imageFile || formData.image,
      };

      await onSubmit(submitData);
      handleClose();
    } catch (error) {
      console.error("Error creating banner:", error);
      setErrors({ submit: t("banners.createError") });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      image: "",
      link: "",
      end_date: "",
    });
    setImageFile(null);
    setImagePreview("");
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t("banners.createBanner")}</CardTitle>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">{t("banners.title")} *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder={t("banners.titlePlaceholder")}
                required
                maxLength={255}
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="image">{t("banners.image")} *</Label>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("image")?.click()}
                    className="gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    {t("banners.uploadImage")}
                  </Button>
                </div>

                {imagePreview && (
                  <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-lg bg-gray-100">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                {!imagePreview && !imageFile && (
                  <div className="flex aspect-video w-full max-w-md items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                    <div className="text-center">
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">
                        {t("banners.noImageSelected")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Link */}
            <div className="space-y-2">
              <Label htmlFor="link">{t("banners.link")}</Label>
              <Input
                id="link"
                type="url"
                value={formData.link}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, link: e.target.value }))
                }
                placeholder={t("banners.linkPlaceholder")}
                maxLength={200}
              />
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label htmlFor="end_date">{t("banners.endDate")}</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, end_date: e.target.value }))
                }
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
