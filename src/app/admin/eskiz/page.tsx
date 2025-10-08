"use client";

import { useTranslation } from "react-i18next";
import { EskizBalanceCard } from "@/components/eskiz";

export default function EskizBalancePage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {t("eskiz.title")}
            </h1>
            <p className="text-gray-600 mt-1">{t("eskiz.description")}</p>
          </div>
        </div>
      </div>

      {/* Eskiz Balance Card */}
      <EskizBalanceCard />
    </div>
  );
}

