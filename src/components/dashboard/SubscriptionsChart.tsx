"use client";

import { useTranslation } from "react-i18next";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ChartPoint {
  date: string;
  total?: number;
  count?: number;
  value?: number;
}

interface SubscriptionsChartProps {
  data: ChartPoint[];
}

export function SubscriptionsChart({ data }: SubscriptionsChartProps) {
  const { t, ready } = useTranslation();

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {ready ? t("dashboard.charts.subscriptions") : "Подписки за месяц"}
        </h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          {ready ? t("dashboard.charts.noData") : "Нет данных для отображения"}
        </div>
      </div>
    );
  }

  // Extract values and format dates
  const chartData = data.map((item) => ({
    date: new Date(item.date).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
    }),
    value: item.count || item.total || item.value || 0,
  }));

  const chartConfig = {
    data: {
      labels: chartData.map((item) => item.date),
      datasets: [
        {
          label: ready ? "Подписки" : "Subscriptions",
          data: chartData.map((item) => item.value),
          backgroundColor: "rgba(147, 51, 234, 0.8)",
          borderColor: "rgb(147, 51, 234)",
          borderWidth: 2,
          borderRadius: 6,
          borderSkipped: false,
          hoverBackgroundColor: "rgba(147, 51, 234, 1)",
          hoverBorderColor: "rgb(126, 34, 206)",
          hoverBorderWidth: 3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          titleColor: "white",
          bodyColor: "white",
          borderColor: "rgba(147, 51, 234, 0.5)",
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: false,
          callbacks: {
            label: function (context: any) {
              return `${context.parsed.y} ${
                ready
                  ? t("dashboard.chartTooltips.subscriptions")
                  : "subscriptions"
              }`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: "#6B7280",
            font: {
              size: 12,
              weight: "normal" as const,
            },
          },
        },
        y: {
          grid: {
            color: "rgba(0, 0, 0, 0.05)",
            borderDash: [5, 5],
          },
          ticks: {
            color: "#6B7280",
            font: {
              size: 12,
              weight: "normal" as const,
            },
            stepSize: 1,
          },
          beginAtZero: true,
        },
      },
      interaction: {
        intersect: false,
        mode: "index" as const,
      },
    },
  };

  const totalSubscriptions = chartData.reduce(
    (sum, item) => sum + item.value,
    0
  );
  const averageSubscriptions = totalSubscriptions / chartData.length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          {ready ? t("dashboard.charts.subscriptions") : "Подписки за месяц"}
        </h3>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
          <span className="text-sm text-gray-600">
            {ready ? t("dashboard.chartLabels.subscriptions") : "Subscriptions"}
          </span>
        </div>
      </div>

      <div className="h-64">
        <Bar data={chartConfig.data} options={chartConfig.options} />
      </div>

      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              {ready ? t("dashboard.chartSummary.total") : "Total"}
            </p>
            <p className="text-xl font-bold text-purple-600">
              {totalSubscriptions}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">
              {ready ? t("dashboard.chartSummary.average") : "Average"}
            </p>
            <p className="text-xl font-bold text-gray-900">
              {Math.round(averageSubscriptions)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
