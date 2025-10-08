import { useState, useEffect } from "react";
import { paymentsApi } from "@/lib/api/payments";
import { PaymentStats, PaymentFilters } from "@/types/payments";

export function usePayments(filters: PaymentFilters = {}) {
  const [data, setData] = useState<PaymentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await paymentsApi.getPaymentStats(filters);
        setData(result);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch payment data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await paymentsApi.getPaymentStats(filters);
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch payment data"
      );
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
}
