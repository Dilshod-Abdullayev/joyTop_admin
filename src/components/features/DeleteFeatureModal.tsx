import { useState } from "react";
import { Feature } from "@/types/features";
import { useFeatures } from "@/lib/hooks/useFeatures";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { X, AlertTriangle } from "lucide-react";

interface DeleteFeatureModalProps {
  feature: Feature | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteFeatureModal({
  isOpen,
  feature,
  onClose,
}: DeleteFeatureModalProps) {
  const { t } = useTranslation();
  const { deleteFeature } = useFeatures();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    if (!feature) return;

    setIsDeleting(true);
    try {
      await deleteFeature(feature.id);
      onClose();
    } catch (error) {
      console.error("Error deleting feature:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen || !feature) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-red-600">
              {t("features.deleteFeature")}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                {t("features.deleteConfirmation")}
              </p>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-sm">{feature.name}</p>
                <p className="text-xs text-gray-500 mt-1">ID: {feature.id}</p>
              </div>
              <p className="text-xs text-red-600 font-medium">
                {t("features.deleteWarning")}
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose} disabled={isDeleting}>
              {t("common.cancel")}
            </Button>
            <Button
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
