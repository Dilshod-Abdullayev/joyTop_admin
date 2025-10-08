"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/hooks/useLanguage";
import { useAuthStore } from "@/lib/stores/authStore";
import { GlobalSearch } from "./GlobalSearch";
import {
  Search,
  Bell,
  ChevronDown,
  LogOut,
  Phone,
  MessageCircle,
} from "lucide-react";

export function Header() {
  const { t, ready } = useTranslation();
  const { currentLanguage, toggleLanguage, registerLanguageChangeCallback } =
    useLanguage();
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Register callback to refresh data when language changes
  useEffect(() => {
    const cleanup = registerLanguageChangeCallback(() => {
      // Force a page refresh to get new language data
      window.location.reload();
    });

    return cleanup;
  }, [registerLanguageChangeCallback]);

  // Keyboard shortcut for global search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowGlobalSearch(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="h-16 border-b bg-white px-6 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center space-x-4">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">J</span>
        </div>
        <span className="text-xl font-bold text-gray-900">Joytop</span>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-2xl mx-8">
        <button
          onClick={() => setShowGlobalSearch(true)}
          className="w-full relative text-left"
        >
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <div className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white hover:border-gray-400 transition-colors cursor-pointer">
            <span className="text-gray-500">
              {ready ? t("common.search") : "Поиск"}
            </span>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <kbd className="px-2 py-1 text-xs font-mono text-gray-400 bg-gray-100 rounded border">
                {navigator.platform.includes("Mac") ? "⌘" : "Ctrl"}K
              </kbd>
            </div>
          </div>
        </button>
      </div>

      {/* Right Side */}
      <div className="flex items-center space-x-4">
       
        <button
          onClick={toggleLanguage}
          className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          {currentLanguage === "ru" ? "RU" : "UZ"}
        </button>
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-medium text-sm">
                {user?.name?.[0] || "A"}
              </span>
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-900">
                {user?.name || "Admin User"}
              </p>
              <p className="text-xs text-gray-500">
                {user?.phone || "admin@joytop.uz"}
              </p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium text-lg">
                      {user?.name?.[0] || "A"}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {user?.name || "Admin User"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user?.role === "admin"
                        ? ready
                          ? t("auth.admin")
                          : "Администратор"
                        : ready
                        ? t("auth.user")
                        : "Пользователь"}
                    </p>
                  </div>
                </div>
                {user?.balance !== undefined && (
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      {ready ? t("auth.balance") : "Баланс"}
                    </p>
                    <p className="text-sm font-semibold text-green-600">
                      {user.balance.toLocaleString()} UZS
                    </p>
                  </div>
                )}
              </div>
              {user?.contacts && (
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-xs text-gray-500 mb-2">
                    {ready ? t("auth.contacts") : "Контакты"}
                  </p>
                  {user.contacts.contact_phone && (
                    <div className="flex items-center text-xs text-gray-600 mb-1">
                      <Phone className="w-3 h-3 mr-2" />
                      {user.contacts.contact_phone}
                    </div>
                  )}
                  {user.contacts.telegram && (
                    <div className="flex items-center text-xs text-gray-600 mb-1">
                      <MessageCircle className="w-3 h-3 mr-2" />
                      {user.contacts.telegram}
                    </div>
                  )}
                  {user.contacts.whatsapp && (
                    <div className="flex items-center text-xs text-gray-600 mb-1">
                      <MessageCircle className="w-3 h-3 mr-2" />
                      {user.contacts.whatsapp}
                    </div>
                  )}
                </div>
              )}
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                {ready ? t("auth.logout") : "Выйти"}
              </button>
            </div>
          )}
        </div>
        {showProfileMenu && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowProfileMenu(false)}
          />
        )}
      </div>

      {/* Global Search Modal */}
      <GlobalSearch
        isOpen={showGlobalSearch}
        onClose={() => setShowGlobalSearch(false)}
      />
    </header>
  );
}
