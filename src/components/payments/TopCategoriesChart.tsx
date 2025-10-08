"use client";

import { useTranslation } from "react-i18next";
import { TopCategory } from "@/types/payments";

interface TopCategoriesChartProps {
  categories: TopCategory[];
}

export function TopCategoriesChart({ categories }: TopCategoriesChartProps) {
  const { t, ready } = useTranslation();

  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto animate-pulse" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {ready ? t("payments.charts.noData") : "Ma'lumot yo'q"}
        </h3>
        <p className="text-gray-500">
          {ready
            ? t("payments.charts.noCategories")
            : "Kategoriyalar bo'yicha ma'lumot topilmadi"}
        </p>
      </div>
    );
  }

  // Sort categories by total amount
  const sortedCategories = [...categories].sort((a, b) => b.total - a.total);

  // Get the maximum amount for percentage calculation
  const maxAmount = Math.max(...sortedCategories.map((cat) => cat.total));

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600">
        {ready
          ? t("payments.charts.description")
          : "Kategoriyalar bo'yicha to'lovlar"}
      </div>

      <div className="space-y-3">
        {sortedCategories.map((category, index) => {
          const percentage = (category.total / maxAmount) * 100;

          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-900">
                  {category.category__ru}
                </span>
                <span className="text-gray-600">
                  {category.total.toLocaleString()} UZS
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <div className="text-xs text-gray-500">
                {percentage.toFixed(1)}%{" "}
                {ready ? t("payments.charts.ofTotal") : "jami"}
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-4 border-t">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">
            {ready ? t("payments.charts.totalRevenue") : "Jami daromad"}
          </span>
          <span className="font-semibold text-gray-900">
            {sortedCategories
              .reduce((sum, cat) => sum + cat.total, 0)
              .toLocaleString()}{" "}
            UZS
          </span>
        </div>
      </div>
    </div>
  );
}
