"use client";

import { useTranslation } from "react-i18next";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartPoint {
  date: string;
  total?: number;
  count?: number;
  value?: number;
}

interface RevenueTrendChartProps {
  data: ChartPoint[];
}

export function RevenueTrendChart({ data }: RevenueTrendChartProps) {
  const { t, ready } = useTranslation();

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {ready
            ? t("dashboard.charts.revenueTrend")
            : t("dashboard.charts.revenueTrend")}
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

  // Calculate trend line
  const trendData = chartData.map((item, index) => {
    if (index === 0) return item.value;
    const prevValue = chartData[index - 1].value;
    const currentValue = item.value;
    return prevValue + (currentValue - prevValue) * 0.3; // Smooth trend
  });

  const chartConfig = {
    data: {
      labels: chartData.map((item) => item.date),
      datasets: [
        {
          label: ready ? "Доход" : "Revenue",
          data: chartData.map((item) => item.value),
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "rgb(59, 130, 246)",
          pointBorderColor: "white",
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
          pointHoverBackgroundColor: "rgb(59, 130, 246)",
          pointHoverBorderColor: "white",
          order: 2,
        },
        {
          label: ready ? "Тренд" : "Trend",
          data: trendData,
          borderColor: "rgba(147, 51, 234, 0.6)",
          backgroundColor: "rgba(147, 51, 234, 0.05)",
          borderWidth: 2,
          fill: false,
          tension: 0.4,
          pointBackgroundColor: "rgba(147, 51, 234, 0.6)",
          pointBorderColor: "white",
          pointBorderWidth: 1,
          pointRadius: 3,
          pointHoverRadius: 5,
          borderDash: [5, 5],
          order: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top" as const,
          labels: {
            usePointStyle: true,
            pointStyle: "circle",
            padding: 20,
            font: {
              size: 12,
              weight: "normal" as const,
            },
            color: "#6B7280",
          },
        },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          titleColor: "white",
          bodyColor: "white",
          borderColor: "rgba(59, 130, 246, 0.5)",
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: true,
          callbacks: {
            label: function (context: any) {
              if (context.datasetIndex === 0) {
                return `${
                  ready ? t("dashboard.trendChart.revenue") : "Revenue"
                }: ${context.parsed.y.toFixed(2)} UZS`;
              } else {
                return `${
                  ready ? t("dashboard.trendChart.trend") : "Trend"
                }: ${context.parsed.y.toFixed(2)} UZS`;
              }
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

  // Calculate growth rate more reasonably - compare last 7 days vs previous 7 days
  const growthRate = (() => {
    if (chartData.length < 14) return 0; // Need at least 14 days for comparison

    const last7Days = chartData.slice(-7);
    const previous7Days = chartData.slice(-14, -7);

    const last7Avg = last7Days.reduce((sum, item) => sum + item.value, 0) / 7;
    const previous7Avg =
      previous7Days.reduce((sum, item) => sum + item.value, 0) / 7;

    if (previous7Avg === 0) return 0;

    const growth = ((last7Avg - previous7Avg) / previous7Avg) * 100;

    // Cap the growth rate at reasonable limits
    return Math.max(-100, Math.min(1000, growth)).toFixed(1);
  })();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          {ready ? t("dashboard.charts.revenueTrend") : "Revenue Trend"}
        </h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">
              {ready ? t("dashboard.trendChart.revenue") : "Revenue"}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full border-2 border-dashed border-purple-300"></div>
            <span className="text-sm text-gray-600">
              {ready ? t("dashboard.trendChart.trend") : "Trend"}
            </span>
          </div>
        </div>
      </div>

      <div className="h-64">
        <Line data={chartConfig.data} options={chartConfig.options} />
      </div>

      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="grid grid-cols-3 gap-4">
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
          <div className="text-center">
            <p className="text-sm text-gray-600">
              {ready ? t("dashboard.trendChart.growth") : "Growth"}
            </p>
            <p
              className={`text-xl font-bold ${
                parseFloat(growthRate.toString()) >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {parseFloat(growthRate.toString()) >= 0 ? "+" : ""}
              {growthRate}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
