import { useState, useEffect, useCallback } from "react";
import { DashboardData } from "@/types/dashboard";
import { dashboardApi } from "@/lib/api/dashboard";

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const dashboardData = await dashboardApi.getDashboardData();
      setData(dashboardData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch dashboard data"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    data,
    loading,
    error,
    refresh: fetchDashboardData,
  };
}
