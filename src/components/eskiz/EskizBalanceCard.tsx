import { useTranslation } from "react-i18next";
import { useEskizBalance } from "@/lib/hooks/useEskiz";
import { StatCard } from "@/components/dashboard/StatCard";
import {
  RefreshCw,
  Wallet,
  Building2,
  Mail,
  Shield,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function EskizBalanceCard() {
  const { t } = useTranslation();
  const { balance, loading, error, refreshBalance } = useEskizBalance();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <Shield className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {t("eskiz.error")}
          </h3>
          <p className="text-gray-600 mb-4">
            {error === "Failed to fetch Eskiz balance"
              ? t("eskiz.error")
              : error}
          </p>
          <Button onClick={refreshBalance} variant="outline">
            {t("eskiz.retry")}
          </Button>
        </div>
      </Card>
    );
  }

  if (!balance) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <Wallet className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {t("eskiz.noData")}
          </h3>
          <p className="text-gray-600">{t("eskiz.description")}</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Balance Card */}
      <StatCard
        title={t("eskiz.balance")}
        value={`${balance.balance.toLocaleString(
          localStorage.getItem("i18nextLng") || "ru"
        )} UZS`}
        icon={Wallet}
        className="col-span-full"
      />

      {/* Account Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {t("eskiz.accountInfo")}
            </h3>
            <Button onClick={refreshBalance} size="sm" variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              {t("eskiz.refresh")}
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <Building2 className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {t("eskiz.companyName")}
                </p>
                <p className="text-sm text-gray-600">{balance.name}</p>
              </div>
            </div>

            <div className="flex items-center">
              <Mail className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {t("eskiz.email")}
                </p>
                <p className="text-sm text-gray-600">{balance.email}</p>
              </div>
            </div>

            <div className="flex items-center">
              <Shield className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {t("eskiz.status")}
                </p>
                <p className="text-sm text-gray-600">
                  {t(`eskiz.statuses.${balance.status}`)}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {t("eskiz.isVip")}
                </p>
                <p className="text-sm text-gray-600">
                  {t(`eskiz.vipStatus.${balance.is_vip}`)}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <Shield className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {t("common.role")}
                </p>
                <p className="text-sm text-gray-600">
                  {t(`eskiz.roles.${balance.role}`)}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t("common.details")}
          </h3>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-900">
                {t("eskiz.createdAt")}
              </p>
              <p className="text-sm text-gray-600">
                {new Date(balance.created_at).toLocaleDateString(
                  localStorage.getItem("i18nextLng") || "ru"
                )}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-900">
                {t("eskiz.updatedAt")}
              </p>
              <p className="text-sm text-gray-600">
                {new Date(balance.updated_at).toLocaleDateString(
                  localStorage.getItem("i18nextLng") || "ru"
                )}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-900">
                {t("common.id")}
              </p>
              <p className="text-sm text-gray-600">{balance.id}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
