import { useTranslation } from "react-i18next";
import { PaymentStats } from "@/types/statistics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, CreditCard, TrendingUp } from "lucide-react";

interface PaymentStatsCardProps {
  data: PaymentStats | null;
}

export function PaymentStatsCard({ data }: PaymentStatsCardProps) {
  const { t, ready } = useTranslation();

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            {ready ? t("statistics.payments.title") : "Статистика платежей"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-4">
            {ready ? t("statistics.payments.noData") : "Нет данных"}
          </p>
        </CardContent>
      </Card>
    );
  }

  const stats = [
    {
      label: ready
        ? t("statistics.payments.totalUsersPaid")
        : "Пользователей заплатили",
      value: data.total_users_paid,
      icon: Users,
      color: "text-blue-600",
    },
    {
      label: ready ? t("statistics.payments.totalPayments") : "Всего платежей",
      value: data.total_payments,
      icon: CreditCard,
      color: "text-green-600",
    },
    {
      label: ready ? t("statistics.payments.totalAmount") : "Общая сумма",
      value: parseFloat(data.total_amount || "0"),
      icon: DollarSign,
      color: "text-purple-600",
      isCurrency: true,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <DollarSign className="w-5 h-5 mr-2" />
          {ready ? t("statistics.payments.title") : "Статистика платежей"}
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
                  {stat.isCurrency
                    ? `$${stat.value.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    : stat.value.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
