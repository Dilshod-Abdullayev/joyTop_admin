"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAllStatistics } from "@/lib/hooks/useStatistics";
import { StatisticsFilters } from "@/types/statistics";
import { statisticsApi } from "@/lib/api/statistics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BarChart3,
  DollarSign,
  Users,
  TrendingUp,
  Calendar,
  RefreshCw,
  AlertTriangle,
  Download,
} from "lucide-react";
import { GeneralStatsCard } from "@/components/statistics/GeneralStatsCard";
import { PaymentStatsCard } from "@/components/statistics/PaymentStatsCard";
import { TariffStatsCard } from "@/components/statistics/TariffStatsCard";
import { StatisticsFilters as StatisticsFiltersComponent } from "@/components/statistics/StatisticsFilters";

export default function StatisticsPage() {
  const { t, ready } = useTranslation();
  const [filters, setFilters] = useState<StatisticsFilters>({
    period: "month",
  });

  const { generalStats, paymentStats, tariffStats, loading, error, refetch } =
    useAllStatistics(filters);

  // Test endpoints on component mount
  React.useEffect(() => {
    statisticsApi.testEndpoints();
  }, []);

  const handleFiltersChange = (newFilters: StatisticsFilters) => {
    setFilters(newFilters);
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log("Export statistics data");
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {ready ? t("statistics.title") : "Статистика"}
            </h1>
            <p className="text-gray-600 mt-2">
              {ready
                ? t("statistics.subtitle")
                : "Детальная аналитика платформы"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            {ready
              ? t("statistics.errors.loadingError")
              : "Статистика недоступна"}
          </h3>
          <p className="text-yellow-600 mb-4">
            {ready
              ? t("statistics.errors.failedToLoad")
              : "API endpoints для статистики могут быть не реализованы. Проверьте консоль для подробностей."}
          </p>
          <div className="space-y-2">
            <Button onClick={refetch} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              {ready ? t("statistics.actions.retry") : "Повторить"}
            </Button>
            <Button
              onClick={() => statisticsApi.testEndpoints()}
              variant="outline"
              className="ml-2"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              {ready ? t("statistics.actions.testApi") : "Тестировать API"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {ready ? t("statistics.title") : "Статистика"}
          </h1>
          <p className="text-gray-600 mt-2">
            {ready ? t("statistics.subtitle") : "Детальная аналитика платформы"}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button onClick={refetch} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            {ready ? t("statistics.actions.refresh") : "Обновить"}
          </Button>
          <Button onClick={handleExport} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            {ready ? t("statistics.actions.export") : "Экспорт"}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <StatisticsFiltersComponent
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <GeneralStatsCard data={generalStats} />
        <PaymentStatsCard data={paymentStats} />
        <TariffStatsCard data={tariffStats} />
      </div>

      {/* Additional Statistics Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Details */}
        {paymentStats && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                {ready
                  ? t("statistics.paymentDetails.title")
                  : "Детали платежей"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">
                      {ready
                        ? t("statistics.paymentDetails.totalUsers")
                        : "Пользователей заплатили"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {ready
                        ? t("statistics.paymentDetails.totalPayments")
                        : "Всего платежей"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">
                      {paymentStats.total_users_paid}
                    </p>
                    <p className="text-sm text-gray-600">
                      {paymentStats.total_payments}
                    </p>
                  </div>
                </div>

                {/* Top Categories */}
                {paymentStats.top_categories &&
                  paymentStats.top_categories.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">
                        {ready
                          ? t("statistics.payments.topCategoriesByPayments")
                          : "Топ категории по платежам"}
                      </h4>
                      <div className="space-y-2">
                        {paymentStats.top_categories.map((category, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center p-2 bg-blue-50 rounded"
                          >
                            <span className="text-sm">
                              {category.category__ru}
                            </span>
                            <span className="font-medium">
                              ${category.total.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Top Users */}
                {paymentStats.top_users &&
                  paymentStats.top_users.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">
                        {ready
                          ? t("statistics.payments.topUsersByPayments")
                          : "Топ пользователи по платежам"}
                      </h4>
                      <div className="space-y-2">
                        {paymentStats.top_users.map((user, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center p-2 bg-green-50 rounded"
                          >
                            <div>
                              <span className="text-sm font-medium">
                                {user.user__name}
                              </span>
                              <p className="text-xs text-gray-600">
                                {user.user__phone}
                              </p>
                            </div>
                            <span className="font-medium">
                              ${user.total.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tariff Distribution */}
        {tariffStats?.subscription_distribution && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                {ready
                  ? t("statistics.tariffDistribution.title")
                  : "Распределение тарифов"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tariffStats.subscription_distribution.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <span className="font-medium">{item.tariff_name}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-12 text-right">
                        {item.count} ({item.percentage}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
