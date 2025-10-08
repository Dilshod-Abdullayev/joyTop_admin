import { Page } from "@/types/pages";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface DeletePageModalProps {
  isOpen: boolean;
  page: Page | null;
  onClose: () => void;
  onConfirm: (id: number) => Promise<void>;
  isDeleting?: boolean;
}

export function DeletePageModal({
  isOpen,
  page,
  onClose,
  onConfirm,
  isDeleting = false,
}: DeletePageModalProps) {
  const { t } = useTranslation();

  const handleConfirm = async () => {
    if (!page) return;

    try {
      await onConfirm(page.id);
      onClose();
    } catch (error) {
      console.error("Error deleting page:", error);
    }
  };

  if (!isOpen || !page) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-semibold text-red-600">
            {t("pages.deletePage")}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
            disabled={isDeleting}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <p className="text-gray-900 font-medium">
                {t("pages.deleteConfirm")}
              </p>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-gray-900">
                  {page.title_ru || page.title_uz || page.title_en}
                </p>
                <p className="text-sm text-gray-600">/{page.slug}</p>
              </div>
              <p className="text-sm text-red-600">{t("pages.deleteWarning")}</p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isDeleting}
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? t("common.deleting") : t("common.delete")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
