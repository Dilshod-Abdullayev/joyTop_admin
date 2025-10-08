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

interface TariffDistribution {
  name: string;
  count: number;
}

interface TopCategoriesChartProps {
  data: TariffDistribution[];
}

export function TopCategoriesChart({ data }: TopCategoriesChartProps) {
  const { t, ready } = useTranslation();

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {ready ? t("dashboard.tariffs.title") : "Распределение по тарифам"}
        </h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          {ready ? t("dashboard.charts.noData") : "Нет данных для отображения"}
        </div>
      </div>
    );
  }

  // Sort by count descending and take top 5
  const sortedData = [...data].sort((a, b) => b.count - a.count).slice(0, 5);

  const chartConfig = {
    data: {
      labels: sortedData.map((item) => item.name),
      datasets: [
        {
          label: ready ? "Пользователи" : "Users",
          data: sortedData.map((item) => item.count),
          backgroundColor: [
            "rgba(59, 130, 246, 0.8)",
            "rgba(16, 185, 129, 0.8)",
            "rgba(245, 158, 11, 0.8)",
            "rgba(239, 68, 68, 0.8)",
            "rgba(147, 51, 234, 0.8)",
          ],
          borderColor: [
            "rgb(59, 130, 246)",
            "rgb(16, 185, 129)",
            "rgb(245, 158, 11)",
            "rgb(239, 68, 68)",
            "rgb(147, 51, 234)",
          ],
          borderWidth: 2,
          borderRadius: 6,
          borderSkipped: false,
          hoverBackgroundColor: [
            "rgba(59, 130, 246, 1)",
            "rgba(16, 185, 129, 1)",
            "rgba(245, 158, 11, 1)",
            "rgba(239, 68, 68, 1)",
            "rgba(147, 51, 234, 1)",
          ],
          hoverBorderColor: [
            "rgb(37, 99, 235)",
            "rgb(5, 150, 105)",
            "rgb(217, 119, 6)",
            "rgb(220, 38, 38)",
            "rgb(126, 34, 206)",
          ],
          hoverBorderWidth: 3,
        },
      ],
    },
    options: {
      indexAxis: "y" as const,
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
          borderColor: "rgba(59, 130, 246, 0.5)",
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: false,
          callbacks: {
            label: function (context: any) {
              return `${context.parsed.x} ${
                ready ? t("dashboard.chartTooltips.users") : "users"
              }`;
            },
          },
        },
      },
      scales: {
        x: {
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
        y: {
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
      },
      interaction: {
        intersect: false,
        mode: "index" as const,
      },
    },
  };

  const totalUsers = sortedData.reduce((sum, item) => sum + item.count, 0);
  const topCategory = sortedData[0];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          {ready ? t("dashboard.tariffs.title") : "Распределение по тарифам"}
        </h3>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-sm text-gray-600">
            {ready ? t("dashboard.chartLabels.tariffs") : "Tariffs"}
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
            <p className="text-xl font-bold text-blue-600">{totalUsers}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">
              {ready ? t("dashboard.additional.popularCategory") : "Popular"}
            </p>
            <p className="text-lg font-bold text-gray-900">
              {topCategory?.name || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
