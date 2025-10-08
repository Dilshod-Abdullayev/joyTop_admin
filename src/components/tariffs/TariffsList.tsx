"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Edit, Trash2, Eye, Calendar, DollarSign, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tariff } from "@/types/tariffs";
import { EditTariffModal } from "./EditTariffModal";
import { DeleteTariffModal } from "./DeleteTariffModal";

interface TariffsListProps {
  tariffs: Tariff[];
  onUpdate: () => void;
}

export function TariffsList({ tariffs, onUpdate }: TariffsListProps) {
  const { t, ready } = useTranslation();
  const [editingTariff, setEditingTariff] = useState<Tariff | null>(null);
  const [deletingTariff, setDeletingTariff] = useState<Tariff | null>(null);

  const handleEditSuccess = () => {
    setEditingTariff(null);
    onUpdate();
  };

  const handleDeleteSuccess = () => {
    setDeletingTariff(null);
    onUpdate();
  };

  if (tariffs.length === 0) {
    return (
      <div className="text-center py-12">
        <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {ready ? t("tariffs.empty.title") : "Tariflar topilmadi"}
        </h3>
        <p className="text-gray-500">
          {ready
            ? t("tariffs.empty.description")
            : "Birinchi tarifni yaratish orqali boshlang"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 rounded-lg font-medium text-sm text-gray-700">
        <div className="col-span-3">
          {ready ? t("tariffs.fields.name") : "Nomi"}
        </div>
        <div className="col-span-2">
          {ready ? t("tariffs.fields.price") : "Narxi"}
        </div>
        <div className="col-span-2">
          {ready ? t("tariffs.fields.duration") : "Davomiyligi"}
        </div>
        <div className="col-span-2">
          {ready ? t("tariffs.fields.categories") : "Kategoriyalar"}
        </div>
        <div className="col-span-2">
          {ready ? t("tariffs.fields.actions") : "Amallar"}
        </div>
      </div>

      {/* Table Rows */}
      <div className="space-y-2">
        {tariffs.map((tariff) => (
          <div
            key={tariff.id}
            className="grid grid-cols-12 gap-4 px-4 py-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
          >
            {/* Name */}
            <div className="col-span-3">
              <div className="font-medium text-gray-900">{tariff.name}</div>
              <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                {tariff.description}
              </div>
            </div>

            {/* Price */}
            <div className="col-span-2">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="font-semibold text-gray-900">
                  {tariff.price.amount.toLocaleString()} {tariff.price.currency}
                </span>
              </div>
            </div>

            {/* Duration */}
            <div className="col-span-2">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-gray-900">
                  {tariff.duration_days}{" "}
                  {ready ? t("tariffs.fields.days") : "kun"}
                </span>
              </div>
            </div>

            {/* Categories */}
            <div className="col-span-2">
              <div className="flex flex-wrap gap-1">
                {tariff.categories.length > 0 ? (
                  tariff.categories.map((category, index) => (
                    <Badge
                      key={`${tariff.id}-${category.id}`}
                      variant="outline"
                      className="text-xs"
                    >
                      {category.name}
                    </Badge>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm">
                    {ready
                      ? t("tariffs.fields.noCategories")
                      : "Kategoriya yo'q"}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="col-span-2">
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingTariff(tariff)}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeletingTariff(tariff)}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingTariff && (
        <EditTariffModal
          tariff={editingTariff}
          open={!!editingTariff}
          onOpenChange={(open) => !open && setEditingTariff(null)}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Delete Modal */}
      {deletingTariff && (
        <DeleteTariffModal
          tariff={deletingTariff}
          open={!!deletingTariff}
          onOpenChange={(open) => !open && setDeletingTariff(null)}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
}
