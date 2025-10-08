"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Plus,
  Filter,
  Search,
  CreditCard,
  Users,
  DollarSign,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTariffs } from "@/lib/hooks/useTariffs";
import { TariffFilters } from "@/types/tariffs";
import { TariffsSkeleton } from "@/components/tariffs/TariffsSkeleton";
import { TariffsList } from "@/components/tariffs/TariffsList";
import { CreateTariffModal } from "@/components/tariffs/CreateTariffModal";

export default function TariffsPage() {
  const { t, ready } = useTranslation();
  const [filters, setFilters] = useState<TariffFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data, loading, error, refetch } = useTariffs(filters);

  const handleFilterChange = (
    field: keyof TariffFilters,
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

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    refetch();
  };

  if (loading) {
    return <TariffsSkeleton />;
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
                ? t("tariffs.errors.loadingError")
                : "Error loading tariffs"}
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {ready ? t("tariffs.title") : "Tariflar"}
          </h1>
          <p className="text-gray-600">
            {ready
              ? t("tariffs.description")
              : "Tariflar va obunalarni boshqarish"}
          </p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2"
          >
            <Filter className="w-4 h-4" />
            <span>{ready ? t("tariffs.filters.title") : "Filtrlash"}</span>
          </Button>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            {ready ? t("tariffs.actions.create") : "Tarif yaratish"}
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>{ready ? t("tariffs.filters.title") : "Filtrlash"}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  {ready ? t("tariffs.filters.search") : "Qidirish"}
                </label>
                <Input
                  placeholder={
                    ready
                      ? t("tariffs.filters.searchPlaceholder")
                      : "Tarif nomi..."
                  }
                  value={filters.search || ""}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  {ready ? t("tariffs.filters.minPrice") : "Minimal narx"}
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={filters.min_price || ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "min_price",
                      parseFloat(e.target.value) || undefined
                    )
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  {ready ? t("tariffs.filters.maxPrice") : "Maksimal narx"}
                </label>
                <Input
                  type="number"
                  placeholder="1000000"
                  value={filters.max_price || ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "max_price",
                      parseFloat(e.target.value) || undefined
                    )
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  {ready ? t("tariffs.filters.duration") : "Davomiyligi (kun)"}
                </label>
                <Input
                  type="number"
                  placeholder="30"
                  value={filters.min_duration || ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "min_duration",
                      parseInt(e.target.value) || undefined
                    )
                  }
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-4">
              <Button variant="outline" onClick={clearFilters}>
                {ready ? t("tariffs.filters.clear") : "Tozalash"}
              </Button>
              <Button onClick={applyFilters}>
                {ready ? t("tariffs.filters.apply") : "Qo'llash"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {ready ? t("tariffs.stats.total") : "Jami tariflar"}
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.length}</div>
            <p className="text-xs text-muted-foreground">
              {ready ? t("tariffs.stats.activeTariffs") : "Faol tariflar"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {ready ? t("tariffs.stats.totalUsers") : "Jami foydalanuvchilar"}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.reduce((sum, tariff) => sum + 0, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {ready
                ? t("tariffs.stats.subscribedUsers")
                : "Obuna foydalanuvchilar"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {ready ? t("tariffs.stats.totalRevenue") : "Jami daromad"}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data
                .reduce((sum, tariff) => sum + tariff.price.amount, 0)
                .toLocaleString()}{" "}
              UZS
            </div>
            <p className="text-xs text-muted-foreground">
              {ready ? t("tariffs.stats.monthlyRevenue") : "Oylik daromad"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tariffs List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {ready ? t("tariffs.list.title") : "Tariflar ro'yxati"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TariffsList tariffs={data} onUpdate={refetch} />
        </CardContent>
      </Card>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateTariffModal
          open={showCreateModal}
          onOpenChange={setShowCreateModal}
          onSuccess={handleCreateSuccess}
        />
      )}
    </div>
  );
}
