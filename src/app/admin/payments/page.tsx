"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Calendar,
  Filter,
  TrendingUp,
  Users,
  CreditCard,
  DollarSign,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePayments } from "@/lib/hooks/usePayments";
import { PaymentFilters } from "@/types/payments";
import { PaymentsSkeleton } from "@/components/payments/PaymentsSkeleton";
import { TopCategoriesChart } from "@/components/payments/TopCategoriesChart";
import { TopUsersTable } from "@/components/payments/TopUsersTable";

export default function PaymentsPage() {
  const { t, ready } = useTranslation();
  const [filters, setFilters] = useState<PaymentFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  const { data, loading, error, refetch } = usePayments(filters);

  const handleFilterChange = (
    field: keyof PaymentFilters,
    value: string | number | undefined
  ) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value || undefined,
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const applyFilters = () => {
    refetch();
    setShowFilters(false);
  };

  if (loading) {
    return <PaymentsSkeleton />;
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-red-600 mb-4">
              <CreditCard className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {ready
                ? t("payments.errors.loadingError")
                : "Error loading payments"}
            </h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <Button onClick={refetch}>
              {ready ? t("common.retry") : "Retry"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <CreditCard className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {ready ? t("payments.empty.title") : "No payment data available"}
            </h3>
            <p className="text-gray-500">
              {ready
                ? t("payments.empty.description")
                : "Payment statistics will appear here"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {ready ? t("payments.title") : "To'lovlar"}
          </h1>
          <p className="text-gray-600">
            {ready
              ? t("payments.description")
              : "To'lov statistikasi va tahlili"}
          </p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2"
          >
            <Filter className="w-4 h-4" />
            <span>{ready ? t("payments.filters.title") : "Filtrlash"}</span>
          </Button>
          <Button onClick={refetch}>
            {ready ? t("common.refresh") : "Yangilash"}
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>{ready ? t("payments.filters.title") : "Filtrlash"}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="date_from">
                  {ready ? t("payments.filters.dateFrom") : "Sana dan"}
                </Label>
                <Input
                  id="date_from"
                  type="date"
                  value={filters.date_from || ""}
                  onChange={(e) =>
                    handleFilterChange("date_from", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="date_to">
                  {ready ? t("payments.filters.dateTo") : "Sana gacha"}
                </Label>
                <Input
                  id="date_to"
                  type="date"
                  value={filters.date_to || ""}
                  onChange={(e) =>
                    handleFilterChange("date_to", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="min_amount">
                  {ready ? t("payments.filters.minAmount") : "Minimal summa"}
                </Label>
                <Input
                  id="min_amount"
                  type="number"
                  placeholder="0"
                  value={filters.min_amount || ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "min_amount",
                      parseFloat(e.target.value) || undefined
                    )
                  }
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-4">
              <Button variant="outline" onClick={clearFilters}>
                {ready ? t("payments.filters.clear") : "Tozalash"}
              </Button>
              <Button onClick={applyFilters}>
                {ready ? t("payments.filters.apply") : "Qo'llash"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {ready
                ? t("payments.stats.totalUsersPaid")
                : "Jami to'lov qilgan foydalanuvchilar"}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.total_users_paid}</div>
            <p className="text-xs text-muted-foreground">
              {ready
                ? t("payments.stats.activeUsers")
                : "Faol foydalanuvchilar"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {ready ? t("payments.stats.totalPayments") : "Jami to'lovlar"}
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.total_payments}</div>
            <p className="text-xs text-muted-foreground">
              {ready ? t("payments.stats.transactions") : "Tranzaksiyalar"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {ready ? t("payments.stats.totalAmount") : "Jami summa"}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {parseFloat(data.total_amount).toLocaleString()} UZS
            </div>
            <p className="text-xs text-muted-foreground">
              {ready ? t("payments.stats.revenue") : "Daromad"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {ready
                ? t("payments.stats.categoriesAmount")
                : "Kategoriyalar summası"}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {parseFloat(data.total_categories_amount).toLocaleString()} UZS
            </div>
            <p className="text-xs text-muted-foreground">
              {ready
                ? t("payments.stats.categoryRevenue")
                : "Kategoriya daromadi"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Categories Chart */}
        <Card>
          <CardHeader>
            <CardTitle>
              {ready ? t("payments.charts.topCategories") : "Top kategoriyalar"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TopCategoriesChart categories={data.top_categories} />
          </CardContent>
        </Card>

        {/* Top Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              {ready ? t("payments.tables.topUsers") : "Top foydalanuvchilar"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TopUsersTable users={data.top_users} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
