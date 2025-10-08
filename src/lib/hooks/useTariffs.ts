import { useState, useEffect } from "react";
import { tariffsApi } from "@/lib/api/tariffs";
import { Tariff, TariffFilters } from "@/types/tariffs";

export function useTariffs(filters: TariffFilters = {}) {
  const [data, setData] = useState<Tariff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await tariffsApi.getAll(filters);
        setData(result);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch tariffs"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await tariffsApi.getAll(filters);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch tariffs");
    } finally {
      setLoading(false);
    }
  };

  const createTariff = async (tariffData: any) => {
    try {
      const result = await tariffsApi.createTariff(tariffData);
      // Don't update local state here to avoid infinite loops
      // The parent component will handle refetching
      return result;
    } catch (err) {
      throw err;
    }
  };
    
  const updateTariff = async (id: number, tariffData: any) => {
    try {
      const result = await tariffsApi.updateTariff(id, tariffData);
      setData((prev) =>
        prev.map((tariff) => (tariff.id === id ? result : tariff))
      );
      return result;
    } catch (err) {
      throw err;
    }
  };

  const deleteTariff = async (id: number) => {
    try {
      await tariffsApi.deleteTariff(id);
      setData((prev) => prev.filter((tariff) => tariff.id !== id));
    } catch (err) {
      throw err;
    }
  };

  return {
    data,
    loading,
    error,
    refetch,
    createTariff,
    updateTariff,
    deleteTariff,
  };
}
