"use client";

import { useTranslation } from "react-i18next";
import { useDashboard } from "@/lib/hooks/useDashboard";
import { StatCard } from "@/components/dashboard/StatCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { UsersChart } from "@/components/dashboard/UsersChart";
import { SubscriptionsChart } from "@/components/dashboard/SubscriptionsChart";
import { TopCategoriesChart } from "@/components/dashboard/TopCategoriesChart";
import { RevenueTrendChart } from "@/components/dashboard/RevenueTrendChart";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import {
  Users,
  Home,
  Eye,
  Heart,
  MessageCircle,
  DollarSign,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  Star,
  UserCheck,
  Building2,
} from "lucide-react";

// 🧪 MOCK DATA FOR TESTING - DELETE THIS SECTION AFTER TESTING
const MOCK_DASHBOARD_DATA = {
  user_count: 156,
  new_users_month: 23,
  listing_count: 1247,
  active_listing_count: 1189,
  promoted_listing_count: 89,
  views_count: 45678,
  favorites_count: 2341,
  chats_count: 892,
  avg_listing_price: 18750000.5,
  total_subscriptions: 89,
  new_subscriptions_month: 12,
  expiring_subscriptions_3days: 3,
  tariff_distribution: [
    { name: "Podpiska", count: 45 },
    { name: "Pro", count: 28 },
    { name: "Premium", count: 16 },
  ],
  total_revenue: 2847.5,
  monthly_revenue: 456.75,
  failed_payments: 2,
  revenue_chart: [
    { date: "2025-08-01", total: 45.0 },
    { date: "2025-08-02", total: 32.0 },
    { date: "2025-08-03", total: 67.0 },
    { date: "2025-08-04", total: 23.0 },
    { date: "2025-08-05", total: 89.0 },
    { date: "2025-08-06", total: 56.0 },
    { date: "2025-08-07", total: 78.0 },
    { date: "2025-08-08", total: 34.0 },
    { date: "2025-08-09", total: 92.0 },
    { date: "2025-08-10", total: 67.0 },
    { date: "2025-08-11", total: 45.0 },
    { date: "2025-08-12", total: 78.0 },
    { date: "2025-08-13", total: 56.0 },
    { date: "2025-08-14", total: 89.0 },
    { date: "2025-08-15", total: 123.0 },
    { date: "2025-08-16", total: 67.0 },
    { date: "2025-08-17", total: 45.0 },
    { date: "2025-08-18", total: 78.0 },
    { date: "2025-08-19", total: 92.0 },
    { date: "2025-08-20", total: 156.0 },
    { date: "2025-08-21", total: 89.0 },
    { date: "2025-08-22", total: 67.0 },
    { date: "2025-08-23", total: 45.0 },
    { date: "2025-08-24", total: 78.0 },
    { date: "2025-08-25", total: 92.0 },
    { date: "2025-08-26", total: 134.0 },
    { date: "2025-08-27", total: 67.0 },
    { date: "2025-08-28", total: 89.0 },
    { date: "2025-08-29", total: 45.0 },
    { date: "2025-08-30", total: 78.0 },
  ],
  users_chart: [
    { date: "2025-08-01", count: 2 },
    { date: "2025-08-02", count: 1 },
    { date: "2025-08-03", count: 3 },
    { date: "2025-08-04", count: 0 },
    { date: "2025-08-05", count: 2 },
    { date: "2025-08-06", count: 1 },
    { date: "2025-08-07", count: 4 },
    { date: "2025-08-08", count: 2 },
    { date: "2025-08-09", count: 1 },
    { date: "2025-08-10", count: 3 },
    { date: "2025-08-11", count: 0 },
    { date: "2025-08-12", count: 2 },
    { date: "2025-08-13", count: 1 },
    { date: "2025-08-14", count: 3 },
    { date: "2025-08-15", count: 2 },
    { date: "2025-08-16", count: 1 },
    { date: "2025-08-17", count: 4 },
    { date: "2025-08-18", count: 2 },
    { date: "2025-08-19", count: 1 },
    { date: "2025-08-20", count: 3 },
    { date: "2025-08-21", count: 2 },
    { date: "2025-08-22", count: 1 },
    { date: "2025-08-23", count: 0 },
    { date: "2025-08-24", count: 2 },
    { date: "2025-08-25", count: 3 },
    { date: "2025-08-26", count: 1 },
    { date: "2025-08-27", count: 2 },
    { date: "2025-08-28", count: 1 },
    { date: "2025-08-29", count: 3 },
    { date: "2025-08-30", count: 2 },
  ],
  subscriptions_chart: [
    { date: "2025-08-01", count: 1 },
    { date: "2025-08-02", count: 0 },
    { date: "2025-08-03", count: 2 },
    { date: "2025-08-04", count: 1 },
    { date: "2025-08-05", count: 3 },
    { date: "2025-08-06", count: 0 },
    { date: "2025-08-07", count: 2 },
    { date: "2025-08-08", count: 1 },
    { date: "2025-08-09", count: 4 },
    { date: "2025-08-10", count: 2 },
    { date: "2025-08-11", count: 1 },
    { date: "2025-08-12", count: 3 },
    { date: "2025-08-13", count: 0 },
    { date: "2025-08-14", count: 2 },
    { date: "2025-08-15", count: 1 },
    { date: "2025-08-16", count: 3 },
    { date: "2025-08-17", count: 2 },
    { date: "2025-08-18", count: 1 },
    { date: "2025-08-19", count: 4 },
    { date: "2025-08-20", count: 2 },
    { date: "2025-08-21", count: 1 },
    { date: "2025-08-22", count: 3 },
    { date: "2025-08-23", count: 0 },
    { date: "2025-08-24", count: 2 },
    { date: "2025-08-25", count: 1 },
    { date: "2025-08-26", count: 3 },
    { date: "2025-08-27", count: 2 },
    { date: "2025-08-28", count: 1 },
    { date: "2025-08-29", count: 4 },
    { date: "2025-08-30", count: 2 },
  ],
  most_popular_category: "Дома",
  most_active_user: "RFAL",
  top_viewed_listing: "Luxury Villa in Tashkent",
  monthly_new_listings: 156,
};
// 🧪 END MOCK DATA - DELETE ABOVE SECTION AFTER TESTING

export default function DashboardPage() {
  const { t, ready } = useTranslation();
  const { data, loading, error } = useDashboard();

  // 🧪 USE MOCK DATA FOR TESTING - CHANGE THIS LINE TO: const dashboardData = data;
  const dashboardData = data;
  // 🧪 END MOCK DATA USAGE

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error || !dashboardData) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            {ready ? t("dashboard.errors.loadingError") : "Ошибка загрузки"}
          </h3>
          <p className="text-red-600">
            {ready
              ? t("dashboard.errors.failedToLoad")
              : "Не удалось загрузить данные дашборда"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {ready ? t("dashboard.title") : "Панель управления"}
        </h1>
        <p className="text-gray-600 mt-2">
          {ready
            ? t("dashboard.subtitle")
            : "Обзор статистики и аналитики платформы"}
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={
            ready ? t("dashboard.stats.totalUsers") : "Всего пользователей"
          }
          value={dashboardData.user_count.toLocaleString()}
          icon={Users}
          change={`+${dashboardData.new_users_month} ${
            ready
              ? t("dashboard.changes.perMonth")
              : t("dashboard.changes.perMonth")
          }`}
          changeType="positive"
        />
        <StatCard
          title={
            ready ? t("dashboard.stats.totalListings") : "Всего объявлений"
          }
          value={dashboardData.listing_count.toLocaleString()}
          icon={Home}
          change={`${dashboardData.active_listing_count} ${
            ready
              ? t("dashboard.changes.active")
              : t("dashboard.changes.active")
          }`}
          changeType="neutral"
        />
        <StatCard
          title={ready ? t("dashboard.stats.views") : "Просмотры"}
          value={dashboardData.views_count.toLocaleString()}
          icon={Eye}
          change={`${dashboardData.favorites_count} ${
            ready
              ? t("dashboard.changes.favorites")
              : t("dashboard.changes.favorites")
          }`}
          changeType="neutral"
        />
        <StatCard
          title={ready ? t("dashboard.stats.chats") : "Чаты"}
          value={dashboardData.chats_count.toLocaleString()}
          icon={MessageCircle}
          change={`${dashboardData.promoted_listing_count} ${
            ready
              ? t("dashboard.changes.promoted")
              : t("dashboard.changes.promoted")
          }`}
          changeType="neutral"
        />
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={ready ? t("dashboard.stats.avgPrice") : "Средняя цена"}
          value={`${(dashboardData.avg_listing_price / 1000000).toFixed(1)}${
            ready ? t("dashboard.units.million") : "M"
          } UZS`}
          icon={DollarSign}
          change={`${dashboardData.monthly_new_listings} ${
            ready
              ? t("dashboard.changes.newListings")
              : t("dashboard.changes.newListings")
          }`}
          changeType="neutral"
        />
        <StatCard
          title={ready ? t("dashboard.stats.subscriptions") : "Подписки"}
          value={dashboardData.total_subscriptions}
          icon={CreditCard}
          change={`+${dashboardData.new_subscriptions_month} ${
            ready
              ? t("dashboard.changes.perMonth")
              : t("dashboard.changes.perMonth")
          }`}
          changeType="positive"
        />
        <StatCard
          title={ready ? t("dashboard.stats.totalRevenue") : "Общий доход"}
          value={`${dashboardData.total_revenue.toLocaleString()} UZS`}
          icon={TrendingUp}
          change={`${dashboardData.monthly_revenue.toLocaleString()} UZS ${
            ready
              ? t("dashboard.changes.perMonth")
              : t("dashboard.changes.perMonth")
          }`}
          changeType="positive"
        />
        <StatCard
          title={
            ready ? t("dashboard.stats.failedPayments") : "Неудачные платежи"
          }
          value={dashboardData.failed_payments}
          icon={AlertTriangle}
          change={`${dashboardData.expiring_subscriptions_3days} ${
            ready
              ? t("dashboard.changes.expiring3Days")
              : t("dashboard.changes.expiring3Days")
          }`}
          changeType={
            dashboardData.failed_payments > 0 ? "negative" : "neutral"
          }
        />
      </div>

      {/* Daily Data Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RevenueChart data={dashboardData.revenue_chart} />
        <UsersChart data={dashboardData.users_chart} />
        <SubscriptionsChart data={dashboardData.subscriptions_chart} />
      </div>

      {/* Trend Analysis Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueTrendChart data={dashboardData.revenue_chart} />
        <TopCategoriesChart data={dashboardData.tariff_distribution} />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Popular Category */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Star className="w-5 h-5 text-yellow-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">
              {ready
                ? t("dashboard.additional.popularCategory")
                : t("dashboard.additional.popularCategory")}
            </h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {dashboardData.most_popular_category ||
              (ready
                ? t("dashboard.additional.noData")
                : t("dashboard.additional.noData"))}
          </p>
        </div>

        {/* Most Active User */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <UserCheck className="w-5 h-5 text-green-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">
              {ready
                ? t("dashboard.additional.activeUser")
                : t("dashboard.additional.activeUser")}
            </h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {dashboardData.most_active_user ||
              (ready
                ? t("dashboard.additional.noData")
                : t("dashboard.additional.noData"))}
          </p>
        </div>

        {/* Top Viewed Listing */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Building2 className="w-5 h-5 text-blue-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">
              {ready
                ? t("dashboard.additional.popularListing")
                : t("dashboard.additional.popularListing")}
            </h3>
          </div>
          <p className="text-lg font-medium text-gray-900">
            {dashboardData.top_viewed_listing ||
              (ready
                ? t("dashboard.additional.noData")
                : t("dashboard.additional.noData"))}
          </p>
        </div>
      </div>
    </div>
  );
}
