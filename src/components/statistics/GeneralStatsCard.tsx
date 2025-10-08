import { useTranslation } from "react-i18next";
import { GeneralStats } from "@/types/statistics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Home,
  Eye,
  Heart,
  MessageCircle,
  TrendingUp,
} from "lucide-react";

interface GeneralStatsCardProps {
  data: GeneralStats | null;
}

export function GeneralStatsCard({ data }: GeneralStatsCardProps) {
  const { t, ready } = useTranslation();

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            {ready ? t("statistics.general.title") : "Общая статистика"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-4">
            {ready ? t("statistics.general.noData") : "Нет данных"}
          </p>
        </CardContent>
      </Card>
    );
  }

  const stats = [
    {
      label: ready ? t("statistics.general.totalUsers") : "Всего пользователей",
      value: data.total_users || 0,
      icon: Users,
      color: "text-blue-600",
    },
    {
      label: ready ? t("statistics.general.totalListings") : "Всего объявлений",
      value: data.total_listings || 0,
      icon: Home,
      color: "text-green-600",
    },
    {
      label: ready ? t("statistics.general.totalViews") : "Всего просмотров",
      value: data.total_views || 0,
      icon: Eye,
      color: "text-purple-600",
    },
    {
      label: ready ? t("statistics.general.totalFavorites") : "Всего избранных",
      value: data.total_favorites || 0,
      icon: Heart,
      color: "text-red-600",
    },
    {
      label: ready ? t("statistics.general.totalChats") : "Всего чатов",
      value: data.total_chats || 0,
      icon: MessageCircle,
      color: "text-orange-600",
    },
    {
      label: ready
        ? t("statistics.general.activeListings")
        : "Активных объявлений",
      value: data.active_listings || 0,
      icon: TrendingUp,
      color: "text-indigo-600",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          {ready ? t("statistics.general.title") : "Общая статистика"}
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
