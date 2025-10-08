import { useState, useEffect } from "react";
import { eskizApi } from "@/lib/api/eskiz";
import { EskizBalance, EskizBalanceResponse } from "@/types/eskiz";

export function useEskizBalance() {
  const [balance, setBalance] = useState<EskizBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = async () => {
    try {
      setLoading(true);
      setError(null);
      const response: EskizBalanceResponse = await eskizApi.getBalance();
      setBalance(response.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch Eskiz balance"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  const refreshBalance = () => {
    fetchBalance();
  };

  return {
    balance,
    loading,
    error,
    refreshBalance,
  };
}
