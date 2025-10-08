"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { X, Save, Tag, DollarSign, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useCategories } from "@/lib/hooks/useCategories";
import { CategoryRequest } from "@/types/categories";

interface CreateCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateCategoryModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateCategoryModalProps) {
  const { t, ready } = useTranslation();
  const { createCategory } = useCategories();

  const [formData, setFormData] = useState<CategoryRequest>({
    uz: "",
    ru: "",
    en: "",
    is_paid: false,
    ad_price: "0.00",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields - ensure no empty strings
    if (!formData.uz.trim() || !formData.ru.trim() || !formData.en.trim()) {
      setError("All language names are required and cannot be empty");
      return;
    }

    // Ensure minimum length for names
    if (
      formData.uz.trim().length < 2 ||
      formData.ru.trim().length < 2 ||
      formData.en.trim().length < 2
    ) {
      setError("Category names must be at least 2 characters long");
      return;
    }

    if (!formData.ad_price || parseFloat(formData.ad_price) < 0) {
      setError("Ad price must be a valid positive number");
      return;
    }

    try {
      setError(null);

      // Clean the data before sending - remove any whitespace and ensure no empty values
      const cleanData = {
        uz: formData.uz.trim(),
        ru: formData.ru.trim(),
        en: formData.en.trim(),
        is_paid: formData.is_paid,
        ad_price: formData.ad_price,
      };

      // Double-check that no fields are empty after trimming
      if (!cleanData.uz || !cleanData.ru || !cleanData.en) {
        setError("Category names cannot be empty after trimming whitespace");
        return;
      }

      console.log("Sending category data:", cleanData);
      await createCategory(cleanData);
      onSuccess();
      handleClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create category"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        uz: "",
        ru: "",
        en: "",
        is_paid: false,
        ad_price: "0.00",
      });
      setError(null);
      onOpenChange(false);
    }
  };

  const handleInputChange = (
    field: keyof CategoryRequest,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <Tag className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              {ready ? t("categories.create.title") : "Create Category"}
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

          {/* Multilingual Names */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Languages className="w-4 h-4 text-gray-500" />
              <Label className="text-sm font-medium text-gray-700">
                Category Names
              </Label>
            </div>

            {/* Uzbek Name */}
            <div className="space-y-2">
              <Label htmlFor="uz" className="text-sm font-medium text-gray-700">
                Uzbek (O'zbekcha)
              </Label>
              <Input
                id="uz"
                type="text"
                placeholder="Kategoriya nomi"
                value={formData.uz}
                onChange={(e) => handleInputChange("uz", e.target.value)}
                disabled={loading}
                required
              />
            </div>

            {/* Russian Name */}
            <div className="space-y-2">
              <Label htmlFor="ru" className="text-sm font-medium text-gray-700">
                Russian (Русский)
              </Label>
              <Input
                id="ru"
                type="text"
                placeholder="Название категории"
                value={formData.ru}
                onChange={(e) => handleInputChange("ru", e.target.value)}
                disabled={loading}
                required
              />
            </div>

            {/* English Name */}
            <div className="space-y-2">
              <Label htmlFor="en" className="text-sm font-medium text-gray-700">
                English
              </Label>
              <Input
                id="en"
                type="text"
                placeholder="Category name"
                value={formData.en}
                onChange={(e) => handleInputChange("en", e.target.value)}
                disabled={loading}
                required
              />
            </div>
          </div>

          {/* Ad Price */}
          <div className="space-y-2">
            <Label
              htmlFor="ad_price"
              className="text-sm font-medium text-gray-700"
            >
              Ad Price (UZS)
            </Label>
            <div className="relative">
              <Input
                id="ad_price"
                type="text"
                placeholder="0.00"
                value={formData.ad_price}
                onChange={(e) => handleInputChange("ad_price", e.target.value)}
                disabled={loading}
                required
                className="pl-8"
              />
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500">
              Enter the price for placing ads in this category
            </p>
          </div>

          {/* Paid Status */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="is-paid"
                className="text-sm font-medium text-gray-700"
              >
                Paid Category
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
              Paid categories require a subscription to view listings
            </p>
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
                <span>{ready ? t("common.creating") : "Creating..."}</span>
              </div>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {ready ? t("common.create") : "Create"}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
