"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Home,
  Users,
  Building2,
  MapPin,
  BarChart3,
  CreditCard,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  Package,
  Image,
  TrendingUp,
  Wallet,
  FileText,
} from "lucide-react";

interface SidebarItem {
  label: string;
  icon: React.ReactNode;
  href: string;
}

export function Sidebar() {
  const { t, ready } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const sidebarItems: SidebarItem[] = [
    {
      label: ready ? t("common.dashboard") : "Панель управления",
      icon: <LayoutDashboard className="w-5 h-5" />,
      href: "/admin",
    },
    {
      label: ready ? t("common.properties") : "Недвижимость",
      icon: <Home className="w-5 h-5" />,
      href: "/admin/properties",
    },
    {
      label: ready ? t("common.users") : "Пользователи",
      icon: <Users className="w-5 h-5" />,
      href: "/admin/users",
    },
    {
      label: ready ? t("common.categories") : "Категории",
      icon: <Building2 className="w-5 h-5" />,
      href: "/admin/categories",
    },
    {
      label: ready ? t("common.cities") : "Города",
      icon: <MapPin className="w-5 h-5" />,
      href: "/admin/cities",
    },
    {
      label: ready ? t("common.districts") : "Районы",
      icon: <MapPin className="w-5 h-5" />,
      href: "/admin/districts",
    },
    {
      label: ready ? t("common.features") : "Особенности",
      icon: <Settings className="w-5 h-5" />,
      href: "/admin/features",
    },
    {
      label: ready ? t("common.payments") : "Платежи",
      icon: <CreditCard className="w-5 h-5" />,
      href: "/admin/payments",
    },
    {
      label: ready ? t("common.tariffs") : "Тарифы",
      icon: <Package className="w-5 h-5" />,
      href: "/admin/tariffs",
    },
    {
      label: ready ? t("common.banners") : "Баннеры",
      icon: <Image className="w-5 h-5" />,
      href: "/admin/banners",
    },
    {
      label: ready ? t("common.pages") : "Страницы",
      icon: <FileText className="w-5 h-5" />,
      href: "/admin/pages",
    },
    {
      label: ready ? t("eskiz.title") : "Eskiz баланс",
      icon: <Wallet className="w-5 h-5" />,
      href: "/admin/eskiz",
    },
    {
      label: ready ? t("statistics.title") : "Статистика",
      icon: <TrendingUp className="w-5 h-5" />,
      href: "/admin/statistics",
    },
    {
      label: ready ? t("common.settings") : "Настройки",
      icon: <Settings className="w-5 h-5" />,
      href: "/admin/settings",
    },
  ];

  return (
    <aside
      className={`bg-white border-r transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Toggle Button */}
        <div className="flex justify-end p-4 border-b">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1">
          <nav className="p-4">
            <ul className="space-y-2">
              {sidebarItems.map((item, index) => {
                const isActive = pathname === item.href;
                return (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className={`flex items-center px-3 pr-7 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive
                          ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700 b"
                          : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      <span className="w-5 h-5 ">{item.icon}</span>
                      {!isCollapsed && (
                        <span className="ml-3 font-medium">{item.label}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </aside>
  );
}
