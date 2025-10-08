"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Edit, Trash2, Eye, DollarSign, Tag, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Category } from "@/types/categories";
import { EditCategoryModal } from "./EditCategoryModal";
import { DeleteCategoryModal } from "./DeleteCategoryModal";

interface CategoriesListProps {
  categories: Category[];
  onUpdate: () => void;
}

export function CategoriesList({ categories, onUpdate }: CategoriesListProps) {
  const { t, ready, i18n } = useTranslation();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null
  );

  // Filter out categories with empty names (like ID 18 in the API response)
  const validCategories = categories.filter(
    (category) => category.uz.trim() && category.ru.trim() && category.en.trim()
  );

  const handleEditSuccess = () => {
    setEditingCategory(null);
    onUpdate();
  };

  const handleDeleteSuccess = () => {
    setDeletingCategory(null);
    onUpdate();
  };

  if (validCategories.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {ready ? t("categories.empty.title") : "No categories found"}
          </h3>
          <p className="text-gray-500">
            {ready
              ? t("categories.empty.description")
              : "Get started by creating your first category"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {validCategories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onEdit={() => setEditingCategory(category)}
            onDelete={() => setDeletingCategory(category)}
          />
        ))}
      </div>

      {/* Edit Modal */}
      {editingCategory && (
        <EditCategoryModal
          category={editingCategory}
          open={!!editingCategory}
          onOpenChange={(open) => !open && setEditingCategory(null)}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Delete Modal */}
      {deletingCategory && (
        <DeleteCategoryModal
          category={deletingCategory}
          open={!!deletingCategory}
          onOpenChange={(open) => !open && setDeletingCategory(null)}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
}

interface CategoryCardProps {
  category: Category;
  onEdit: () => void;
  onDelete: () => void;
}

function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
  const { t, ready, i18n } = useTranslation();

  // Get the category name in the current language
  const getCategoryName = () => {
    const currentLang = i18n.language;
    switch (currentLang) {
      case "uz":
        return category.uz;
      case "ru":
        return category.ru;
      case "en":
      default:
        return category.en;
    }
  };

  // Get the category name in all languages for display
  const getAllNames = () => {
    return [
      { lang: "UZ", name: category.uz },
      { lang: "RU", name: category.ru },
      { lang: "EN", name: category.en },
    ];
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900">
              {getCategoryName()}
            </CardTitle>

            {/* Language indicators */}
            <div className="flex items-center space-x-2 mt-2">
              <Languages className="w-3 h-3 text-gray-400" />
              <div className="flex space-x-1">
                {getAllNames().map(({ lang, name }) => (
                  <Badge
                    key={lang}
                    variant="outline"
                    className="text-xs px-1 py-0 h-5"
                  >
                    {lang}:{" "}
                    {name.length > 8 ? `${name.substring(0, 8)}...` : name}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <Badge
                variant={category.is_paid ? "default" : "secondary"}
                className={
                  category.is_paid
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
                }
              >
                {category.is_paid ? (
                  <>
                    <DollarSign className="w-3 h-3 mr-1" />
                    {ready ? t("categories.paid") : "Paid"}
                  </>
                ) : (
                  <>
                    <Eye className="w-3 h-3 mr-1" />
                    {ready ? t("categories.free") : "Free"}
                  </>
                )}
              </Badge>
            </div>
          </div>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="h-8 w-8 p-0"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {ready ? t("categories.fields.adPrice") : "Ad Price"}
            </span>
            <span className="text-sm font-medium">
              {parseFloat(category.ad_price).toLocaleString()} UZS
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {ready ? t("categories.fields.status") : "Status"}
            </span>
            <Badge
              variant={category.is_paid ? "default" : "secondary"}
              className={
                category.is_paid
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }
            >
              {category.is_paid
                ? ready
                  ? t("categories.status.paid")
                  : "Paid View"
                : ready
                ? t("categories.status.free")
                : "Free View"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
