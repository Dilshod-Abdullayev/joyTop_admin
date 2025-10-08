"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { X, Trash2, AlertTriangle, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTariffs } from "@/lib/hooks/useTariffs";
import { Tariff } from "@/types/tariffs";

interface DeleteTariffModalProps {
  tariff: Tariff;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function DeleteTariffModal({
  tariff,
  open,
  onOpenChange,
  onSuccess,
}: DeleteTariffModalProps) {
  const { t, ready } = useTranslation();
  const { deleteTariff } = useTariffs({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError(null);

      await deleteTariff(tariff.id);
      onSuccess();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Tarif o'chirishda xatolik yuz berdi"
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
              {ready ? t("tariffs.delete.title") : "Tarifni o'chirish"}
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
        <div className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-red-600" />
            </div>

            <h3 className="text-lg font-medium text-gray-900 mb-2">
              "{tariff.name}"{" "}
              {ready
                ? t("tariffs.delete.confirmation")
                : "tarifini o'chirishni xohlaysizmi?"}
            </h3>

            <p className="text-gray-500 mb-6">
              {ready
                ? t("tariffs.delete.warning")
                : "Bu amalni qaytarib bo'lmaydi. Tarif abadiy o'chiriladi."}
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="text-sm text-gray-600 space-y-2">
                <div className="flex justify-between">
                  <span>{ready ? t("tariffs.fields.name") : "Nomi"}:</span>
                  <span className="font-medium text-gray-900">
                    {tariff.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{ready ? t("tariffs.fields.price") : "Narxi"}:</span>
                  <span className="font-medium text-gray-900">
                    {tariff.price.amount.toLocaleString()}{" "}
                    {tariff.price.currency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>
                    {ready ? t("tariffs.fields.duration") : "Davomiyligi"}:
                  </span>
                  <span className="font-medium text-gray-900">
                    {tariff.duration_days}{" "}
                    {ready ? t("tariffs.fields.days") : "kun"}
                  </span>
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
            {ready ? t("common.cancel") : "Bekor qilish"}
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
                <span>{ready ? t("common.deleting") : "O'chirilmoqda..."}</span>
              </div>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                {ready ? t("common.delete") : "O'chirish"}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
