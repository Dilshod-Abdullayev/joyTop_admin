import { useState } from "react";
import { District } from "@/types/districts";
import { useDistricts } from "@/lib/hooks/useDistricts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { X, AlertTriangle } from "lucide-react";

interface DeleteDistrictModalProps {
  district: District | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteDistrictModal({
  isOpen,
  district,
  onClose,
}: DeleteDistrictModalProps) {
  const { t } = useTranslation();
  const { deleteDistrict } = useDistricts();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    if (!district) return;

    setIsDeleting(true);
    try {
      await deleteDistrict(district.id);
      onClose();
    } catch (error) {
      console.error("Error deleting district:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen || !district) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-red-600">
              {t("districts.deleteDistrict")}
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
                {t("districts.deleteConfirmation")}
              </p>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-sm">{district.name}</p>
                <p className="text-xs text-gray-500 mt-1">ID: {district.id}</p>
              </div>
              <p className="text-xs text-red-600 font-medium">
                {t("districts.deleteWarning")}
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
