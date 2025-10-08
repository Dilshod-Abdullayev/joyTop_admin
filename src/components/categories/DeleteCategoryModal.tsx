"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { X, Trash2, AlertTriangle, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/lib/hooks/useCategories";
import { useLanguage } from "@/lib/hooks/useLanguage";
import { Category } from "@/types/categories";

interface DeleteCategoryModalProps {
  category: Category;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function DeleteCategoryModal({
  category,
  open,
  onOpenChange,
  onSuccess,
}: DeleteCategoryModalProps) {
  const { t, ready } = useTranslation();
  const { deleteCategory } = useCategories();
  const { currentLanguage } = useLanguage();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError(null);

      await deleteCategory(category.id);
      onSuccess();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete category"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError(null);
      onOpenChange(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              {ready ? t("categories.delete.title") : "Delete Category"}
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            disabled={loading}
            className="h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex items-start space-x-3">
            <Tag className="w-5 h-5 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-3">
                {ready
                  ? t("categories.delete.description")
                  : "Are you sure you want to delete this category? This action cannot be undone."}
              </p>

              <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      {ready ? t("categories.fields.name") : "Name"}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {
                        category[
                          currentLanguage as keyof Pick<Category, "uz" | "ru">
                        ]
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      {ready ? t("categories.fields.status") : "Status"}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {category.is_paid
                        ? ready
                          ? t("categories.paid")
                          : "Paid"
                        : ready
                        ? t("categories.free")
                        : "Free"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-yellow-700">
                    <p className="font-medium">
                      {ready ? t("categories.delete.warning") : "Warning"}
                    </p>
                    <p>
                      {ready
                        ? t("categories.delete.warningText")
                        : "Deleting this category may affect existing listings and user access."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            {ready ? t("common.cancel") : "Cancel"}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
            className="min-w-[100px]"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{ready ? t("common.deleting") : "Deleting..."}</span>
              </div>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                {ready ? t("common.delete") : "Delete"}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
