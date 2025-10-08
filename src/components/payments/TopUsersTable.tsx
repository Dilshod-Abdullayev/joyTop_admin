"use client";

import { useTranslation } from "react-i18next";
import { TopUser } from "@/types/payments";
import { Badge } from "@/components/ui/badge";
import { User, Phone, DollarSign } from "lucide-react";

interface TopUsersTableProps {
  users: TopUser[];
}

export function TopUsersTable({ users }: TopUsersTableProps) {
  const { t, ready } = useTranslation();

  if (!users || users.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <User className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {ready ? t("payments.tables.noData") : "Ma'lumot yo'q"}
        </h3>
        <p className="text-gray-500">
          {ready
            ? t("payments.tables.noUsers")
            : "Foydalanuvchilar bo'yicha ma'lumot topilmadi"}
        </p>
      </div>
    );
  }

  // Sort users by total amount
  const sortedUsers = [...users].sort((a, b) => b.total - a.total);

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600">
        {ready
          ? t("payments.tables.description")
          : "Eng ko'p to'lov qilgan foydalanuvchilar"}
      </div>

      <div className="space-y-3">
        {sortedUsers.map((user, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full">
                <span className="text-sm font-semibold">{index + 1}</span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="font-medium text-gray-900">
                    {user.user__name || ready
                      ? t("payments.tables.anonymous")
                      : "Anonim"}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Phone className="w-3 h-3 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {user.user__phone}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800"
              >
                {user.total.toLocaleString()} UZS
              </Badge>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">
            {ready ? t("payments.tables.totalUsers") : "Jami foydalanuvchilar"}
          </span>
          <span className="font-semibold text-gray-900">
            {sortedUsers.length}
          </span>
        </div>

        <div className="flex justify-between items-center text-sm mt-2">
          <span className="text-gray-600">
            {ready ? t("payments.tables.totalAmount") : "Jami summa"}
          </span>
          <span className="font-semibold text-gray-900">
            {sortedUsers
              .reduce((sum, user) => sum + user.total, 0)
              .toLocaleString()}{" "}
            UZS
          </span>
        </div>
      </div>
    </div>
  );
}
