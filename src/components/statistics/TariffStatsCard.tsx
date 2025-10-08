import { useTranslation } from "react-i18next";
import { TariffStats } from "@/types/statistics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, Clock, TrendingUp } from "lucide-react";

interface TariffStatsCardProps {
  data: TariffStats | null;
}

export function TariffStatsCard({ data }: TariffStatsCardProps) {
  const { t, ready } = useTranslation();

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            {ready ? t("statistics.tariffs.title") : "Статистика тарифов"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-4">
            {ready ? t("statistics.tariffs.noData") : "Нет данных"}
          </p>
        </CardContent>
      </Card>
    );
  }

  const stats = [
    {
      label: ready
        ? t("statistics.tariffs.totalSubscriptions")
        : "Всего подписок",
      value: data.total_subscriptions || 0,
      icon: Users,
      color: "text-blue-600",
    },
    {
      label: ready
        ? t("statistics.tariffs.activeSubscriptions")
        : "Активных подписок",
      value: data.active_subscriptions || 0,
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      label: ready
        ? t("statistics.tariffs.expiringSubscriptions")
        : "Истекающих подписок",
      value: data.expiring_subscriptions || 0,
      icon: Clock,
      color: "text-orange-600",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart3 className="w-5 h-5 mr-2" />
          {ready ? t("statistics.tariffs.title") : "Статистика тарифов"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <IconComponent className={`w-5 h-5 ${stat.color}`} />
                  <span className="text-sm font-medium text-gray-700">
                    {stat.label}
                  </span>
                </div>
                <span className="text-lg font-bold text-gray-900">
                  {stat.value.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
