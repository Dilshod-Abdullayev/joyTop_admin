"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { X, Save, Tag, DollarSign, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useCategories } from "@/lib/hooks/useCategories";
import { Category, CategoryUpdateRequest } from "@/types/categories";

interface EditCategoryModalProps {
  category: Category;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditCategoryModal({
  category,
  open,
  onOpenChange,
  onSuccess,
}: EditCategoryModalProps) {
  const { t, ready } = useTranslation();
  const { updateCategory } = useCategories();

  const [formData, setFormData] = useState({
    uz: category.uz,
    ru: category.ru,
    en: category.en,
    is_paid: category.is_paid,
    ad_price: category.ad_price,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFormData({
      uz: category.uz,
      ru: category.ru,
      en: category.en,
      is_paid: category.is_paid,
      ad_price: category.ad_price,
    });
  }, [category]);

  const handleInputChange = (
    field: keyof typeof formData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      const updateData: CategoryUpdateRequest = {
        uz: formData.uz,
        ru: formData.ru,
        en: formData.en,
        is_paid: formData.is_paid,
        ad_price: formData.ad_price,
      };

      await updateCategory(category.id, updateData);
      onSuccess();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update category"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        uz: category.uz,
        ru: category.ru,
        en: category.en,
        is_paid: category.is_paid,
        ad_price: category.ad_price,
      });
      setError(null);
      onOpenChange(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <Edit className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              {ready ? t("categories.edit.title") : "Edit Category"}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Category Names */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">
              {ready ? t("categories.edit.categoryNames") : "Category Names"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="uz-name"
                  className="text-sm font-medium text-gray-700"
                >
                  Uzbek Name
                </Label>
                <Input
                  id="uz-name"
                  value={formData.uz}
                  onChange={(e) => handleInputChange("uz", e.target.value)}
                  placeholder="Enter Uzbek name"
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="ru-name"
                  className="text-sm font-medium text-gray-700"
                >
                  Russian Name
                </Label>
                <Input
                  id="ru-name"
                  value={formData.ru}
                  onChange={(e) => handleInputChange("ru", e.target.value)}
                  placeholder="Enter Russian name"
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="en-name"
                  className="text-sm font-medium text-gray-700"
                >
                  English Name
                </Label>
                <Input
                  id="en-name"
                  value={formData.en}
                  onChange={(e) => handleInputChange("en", e.target.value)}
                  placeholder="Enter English name"
                  disabled={loading}
                  required
                />
              </div>
            </div>
          </div>

          {/* Ad Price */}
          <div className="space-y-2">
            <Label
              htmlFor="ad-price"
              className="text-sm font-medium text-gray-700"
            >
              {ready ? t("categories.fields.adPrice") : "Ad Price (UZS)"}
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="ad-price"
                type="number"
                value={formData.ad_price}
                onChange={(e) => handleInputChange("ad_price", e.target.value)}
                placeholder="0"
                disabled={loading}
                required
                min="0"
                step="0.01"
                className="pl-10"
              />
            </div>
          </div>

          {/* Paid Status */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="is-paid"
                className="text-sm font-medium text-gray-700"
              >
                {ready ? t("categories.edit.isPaid") : "Paid Category"}
              </Label>
              <Switch
                id="is-paid"
                checked={formData.is_paid}
                onCheckedChange={(checked: boolean) =>
                  handleInputChange("is_paid", checked)
                }
                disabled={loading}
              />
            </div>

            <p className="text-sm text-gray-500">
              {ready
                ? t("categories.edit.isPaidDescription")
                : "Paid categories require a subscription to view listings"}
            </p>
          </div>

          {/* Current Values Display */}
          <div className="bg-gray-50 border border-gray-200 rounded-md p-4 space-y-3">
            <h3 className="text-sm font-medium text-gray-700">
              {ready ? t("categories.edit.currentValues") : "Current Values"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Original ID:</span>
                <span className="ml-2 font-medium text-gray-900">
                  #{category.id}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Original Status:</span>
                <span
                  className={`ml-2 font-medium px-2 py-1 rounded-full text-xs ${
                    category.is_paid
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
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
        </form>

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
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="min-w-[100px]"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{ready ? t("common.updating") : "Updating..."}</span>
              </div>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {ready ? t("common.update") : "Update"}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
