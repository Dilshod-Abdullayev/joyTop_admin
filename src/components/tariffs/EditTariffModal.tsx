"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  X,
  Save,
  CreditCard,
  DollarSign,
  Calendar,
  Tag,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTariffs } from "@/lib/hooks/useTariffs";
import { Tariff, TariffUpdateRequest } from "@/types/tariffs";
import { categoriesApi } from "@/lib/api/categories";
import { Category } from "@/types/categories";

interface EditTariffModalProps {
  tariff: Tariff;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditTariffModal({
  tariff,
  open,
  onOpenChange,
  onSuccess,
}: EditTariffModalProps) {
  const { t, ready } = useTranslation();
  const { updateTariff } = useTariffs({});

  const [formData, setFormData] = useState<TariffUpdateRequest>({
    name: tariff.name,
    price: tariff.price.amount.toString(),
    description: tariff.description,
    duration_days: tariff.duration_days,
    categories: tariff.categories.map((cat) => cat.id),
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFormData({
      name: tariff.name,
      price: tariff.price.amount.toString(),
      description: tariff.description,
      duration_days: tariff.duration_days,
      categories: tariff.categories.map((cat) => cat.id),
    });
  }, [tariff]);

  // Fetch categories when modal opens
  useEffect(() => {
    if (open) {
      const fetchCategories = async () => {
        try {
          const result = await categoriesApi.getAll();
          setCategories(result);
        } catch (err) {
          console.error("Failed to fetch categories:", err);
        }
      };
      fetchCategories();
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name?.trim()) {
      setError("Tarif nomi majburiy");
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError("Narx 0 dan katta bo'lishi kerak");
      return;
    }

    if (!formData.duration_days || formData.duration_days <= 0) {
      setError("Davomiyligi 0 dan katta bo'lishi kerak");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await updateTariff(tariff.id, formData);
      onSuccess();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Tarif yangilashda xatolik yuz berdi"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        name: tariff.name,
        price: tariff.price.amount.toString(),
        description: tariff.description,
        duration_days: tariff.duration_days,
        categories: tariff.categories.map((cat) => cat.id),
      });
      setError(null);
      onOpenChange(false);
    }
  };

  const handleInputChange = (
    field: keyof TariffUpdateRequest,
    value: string | number | number[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCategoryToggle = (categoryId: number) => {
    setFormData((prev) => {
      const currentCategories = prev.categories || [];
      if (currentCategories.includes(categoryId)) {
        return {
          ...prev,
          categories: currentCategories.filter((id) => id !== categoryId),
        };
      } else {
        return {
          ...prev,
          categories: [...currentCategories, categoryId],
        };
      }
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              {ready ? t("tariffs.edit.title") : "Tarifni tahrirlash"}
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

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              {ready ? t("tariffs.fields.name") : "Tarif nomi"}
            </Label>
            <Input
              id="name"
              type="text"
              placeholder={
                ready ? t("tariffs.placeholders.name") : "Masalan: Premium"
              }
              value={formData.name || ""}
              onChange={(e) => handleInputChange("name", e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label
              htmlFor="price"
              className="text-sm font-medium text-gray-700"
            >
              {ready ? t("tariffs.fields.price") : "Narxi (UZS)"}
            </Label>
            <div className="relative">
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="50000.00"
                value={formData.price || ""}
                onChange={(e) => handleInputChange("price", e.target.value)}
                disabled={loading}
                required
                className="pl-8"
              />
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500">
              {ready
                ? t("tariffs.placeholders.priceNote")
                : "Narx UZS da ko'rsatiladi"}
            </p>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label
              htmlFor="duration"
              className="text-sm font-medium text-gray-700"
            >
              {ready ? t("tariffs.fields.duration") : "Davomiyligi (kun)"}
            </Label>
            <div className="relative">
              <Input
                id="duration"
                type="number"
                min="1"
                placeholder="30"
                value={formData.duration_days || ""}
                onChange={(e) =>
                  handleInputChange(
                    "duration_days",
                    parseInt(e.target.value) || 1
                  )
                }
                disabled={loading}
                required
                className="pl-8"
              />
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-sm font-medium text-gray-700"
            >
              {ready ? t("tariffs.fields.description") : "Tavsif"}
            </Label>
            <Textarea
              id="description"
              placeholder={
                ready
                  ? t("tariffs.placeholders.description")
                  : "Tarif haqida batafsil ma'lumot..."
              }
              value={formData.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              disabled={loading}
              rows={3}
            />
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              {ready ? t("tariffs.fields.categories") : "Kategoriyalar"}
            </Label>
            <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-md p-3">
              {categories.length > 0 ? (
                <div className="space-y-2">
                  {categories.map((category) => {
                    const isSelected =
                      formData.categories?.includes(category.id) || false;
                    return (
                      <div
                        key={category.id}
                        className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors"
                        onClick={() => handleCategoryToggle(category.id)}
                      >
                        <div
                          className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                            isSelected
                              ? "bg-blue-600 border-blue-600"
                              : "border-gray-300"
                          }`}
                        >
                          {isSelected && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">
                            {category.uz} / {category.ru} / {category.en}
                          </div>
                          <div className="text-xs text-gray-500">
                            {category.is_paid ? "Pulli" : "Bepul"}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  {ready
                    ? t("tariffs.placeholders.noCategories")
                    : "Kategoriyalar topilmadi"}
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500">
              {ready
                ? t("tariffs.placeholders.categoriesSelect")
                : "Kategoriyalarni tanlang"}
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
            {ready ? t("common.cancel") : "Bekor qilish"}
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
                <span>{ready ? t("common.updating") : "Yangilanmoqda..."}</span>
              </div>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {ready ? t("common.update") : "Yangilash"}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
