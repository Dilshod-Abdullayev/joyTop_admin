import { useState, useEffect } from "react";
import { statisticsApi } from "@/lib/api/statistics";
import {
  GeneralStats,
  PaymentStats,
  TariffStats,
  StatisticsFilters,
} from "@/types/statistics";

// Hook for general statistics
export function useGeneralStats(filters: StatisticsFilters = {}) {
  const [data, setData] = useState<GeneralStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await statisticsApi.getGeneralStats(filters);
        setData(result);
      } catch (err) {
        console.error("Error fetching general stats:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch general statistics"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters.date_from, filters.date_to, filters.period]);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await statisticsApi.getGeneralStats(filters);
      setData(result);
    } catch (err) {
      console.error("Error refetching general stats:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch general statistics"
      );
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
}

// Hook for payment statistics
export function usePaymentStats(filters: StatisticsFilters = {}) {
  const [data, setData] = useState<PaymentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await statisticsApi.getPaymentStats(filters);
        setData(result);
      } catch (err) {
        console.error("Error fetching payment stats:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch payment statistics"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters.date_from, filters.date_to, filters.period]);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await statisticsApi.getPaymentStats(filters);
      setData(result);
    } catch (err) {
      console.error("Error refetching payment stats:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch payment statistics"
      );
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
}

// Hook for tariff statistics
export function useTariffStats(filters: StatisticsFilters = {}) {
  const [data, setData] = useState<TariffStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await statisticsApi.getTariffStats(filters);
        setData(result);
      } catch (err) {
        console.error("Error fetching tariff stats:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch tariff statistics"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters.date_from, filters.date_to, filters.period]);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await statisticsApi.getTariffStats(filters);
      setData(result);
    } catch (err) {
      console.error("Error refetching tariff stats:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch tariff statistics"
      );
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
}

// Combined hook for all statistics
export function useAllStatistics(filters: StatisticsFilters = {}) {
  const generalStats = useGeneralStats(filters);
  const paymentStats = usePaymentStats(filters);
  const tariffStats = useTariffStats(filters);

  const loading =
    generalStats.loading || paymentStats.loading || tariffStats.loading;
  const error = generalStats.error || paymentStats.error || tariffStats.error;

  const refetch = async () => {
    await Promise.all([
      generalStats.refetch(),
      paymentStats.refetch(),
      tariffStats.refetch(),
    ]);
  };

  return {
    generalStats: generalStats.data,
    paymentStats: paymentStats.data,
    tariffStats: tariffStats.data,
    loading,
    error,
    refetch,
  };
}
