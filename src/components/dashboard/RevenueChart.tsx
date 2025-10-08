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

interface RevenueChartProps {
  data: ChartPoint[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  const { t, ready } = useTranslation();

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {ready
            ? t("dashboard.charts.revenue30Days")
            : "Доход за последние 30 дней"}
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
    value: item.total || item.count || item.value || 0,
  }));

  const chartConfig = {
    data: {
      labels: chartData.map((item) => item.date),
      datasets: [
        {
          label: ready ? "Доход" : "Revenue",
          data: chartData.map((item) => item.value),
          backgroundColor: "rgba(59, 130, 246, 0.8)",
          borderColor: "rgb(59, 130, 246)",
          borderWidth: 2,
          borderRadius: 6,
          borderSkipped: false,
          hoverBackgroundColor: "rgba(59, 130, 246, 1)",
          hoverBorderColor: "rgb(37, 99, 235)",
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
          borderColor: "rgba(59, 130, 246, 0.5)",
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: false,
          callbacks: {
            label: function (context: any) {
              return `${context.parsed.y.toFixed(2)} UZS`;
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
            callback: function (value: any) {
              return `${value} UZS`;
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

  const totalRevenue = chartData.reduce((sum, item) => sum + item.value, 0);
  const averageRevenue = totalRevenue / chartData.length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          {ready
            ? t("dashboard.charts.revenue30Days")
            : "Доход за последние 30 дней"}
        </h3>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-sm text-gray-600">
            {ready ? t("dashboard.chartLabels.revenue") : "Revenue"}
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
            <p className="text-xl font-bold text-blue-600">
              {totalRevenue.toFixed(2)} UZS
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">
              {ready ? t("dashboard.chartSummary.average") : "Average"}
            </p>
            <p className="text-xl font-bold text-gray-900">
              {averageRevenue.toFixed(2)} UZS
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
