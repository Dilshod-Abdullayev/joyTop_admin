import { useState, useEffect, useCallback } from "react";
import { City, CityRequest } from "@/types/cities";
import { citiesApi } from "@/lib/api/cities";

export function useCities() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await citiesApi.getAll();
      setCities(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch cities");
    } finally {
      setLoading(false);
    }
  }, []);

  const createCity = useCallback(async (data: CityRequest): Promise<City> => {
    try {
      setError(null);
      const newCity = await citiesApi.create(data);
      setCities((prev) => [...prev, newCity]);
      return newCity;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create city";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const updateCity = useCallback(
    async (id: number, data: CityRequest): Promise<City> => {
      try {
        setError(null);
        const updatedCity = await citiesApi.update(id, data);
        setCities((prev) =>
          prev.map((city) => (city.id === id ? updatedCity : city))
        );
        return updatedCity;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update city";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    []
  );

  const deleteCity = useCallback(async (id: number): Promise<void> => {
    try {
      setError(null);
      await citiesApi.delete(id);
      setCities((prev) => prev.filter((city) => city.id !== id));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete city";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const getCityById = useCallback(
    (id: number): City | undefined => {
      return cities.find((city) => city.id === id);
    },
    [cities]
  );

  const searchCities = useCallback(
    (searchTerm: string): City[] => {
      if (!searchTerm.trim()) return cities;
      return cities.filter((city) =>
        city.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    },
    [cities]
  );

  useEffect(() => {
    fetchCities();
  }, [fetchCities]);

  return {
    cities,
    loading,
    error,
    fetchCities,
    createCity,
    updateCity,
    deleteCity,
    getCityById,
    searchCities,
  };
}


