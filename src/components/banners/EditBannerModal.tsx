import { useState, useEffect } from "react";
import { Banner, BannerUpdateRequest } from "@/types/banners";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { X, Upload, Image as ImageIcon } from "lucide-react";

interface EditBannerModalProps {
  isOpen: boolean;
  banner: Banner | null;
  onClose: () => void;
  onSubmit: (id: number, data: BannerUpdateRequest) => Promise<void>;
}

export function EditBannerModal({
  isOpen,
  banner,
  onClose,
  onSubmit,
}: EditBannerModalProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<BannerUpdateRequest>({
    title: "",
    image: "",
    link: "",
    end_date: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form data when banner changes
  useEffect(() => {
    if (banner) {
      setFormData({
        title: banner.title,
        image: banner.image,
        link: banner.link || "",
        end_date: banner.end_date || "",
      });
      setImagePreview(banner.image);
    }
  }, [banner]);

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
    if (!banner) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      // Only include fields that have actually changed
      const submitData: BannerUpdateRequest = {};

      // Check if title changed
      if (formData.title !== banner.title) {
        submitData.title = formData.title;
      }

      // Check if image changed (new file uploaded)
      if (imageFile) {
        submitData.image = imageFile;
      }

      // Check if link changed
      if (formData.link !== (banner.link || "")) {
        submitData.link = formData.link;
      }

      // Check if end_date changed
      if (formData.end_date !== (banner.end_date || "")) {
        submitData.end_date = formData.end_date;
      }

      // Only submit if there are actual changes
      if (Object.keys(submitData).length === 0) {
        // No changes detected, just close the modal
        handleClose();
        return;
      }

      await onSubmit(banner.id, submitData);
      handleClose();
    } catch (error) {
      console.error("Error updating banner:", error);
      setErrors({ submit: t("banners.updateError") });
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

  if (!isOpen || !banner) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t("banners.editBanner")}</CardTitle>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">{t("banners.title")}</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder={t("banners.titlePlaceholder")}
                maxLength={255}
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="image">{t("banners.image")}</Label>
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

                {!imagePreview && (
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
                {isSubmitting ? t("common.updating") : t("common.update")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
