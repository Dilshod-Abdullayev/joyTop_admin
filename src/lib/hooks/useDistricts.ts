import { useState, useEffect, useCallback } from "react";
import { districtsApi } from "@/lib/api/districts";
import {
  District,
  DistrictRequest,
  DistrictUpdateRequest,
  DistrictFilters,
  PaginatedDistrictsResponse,
} from "@/types/districts";

export function useDistricts(filters: DistrictFilters = {}) {
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null as string | null,
    previous: null as string | null,
    currentPage: filters.page || 1,
    pageSize: filters.page_size || 20,
    totalPages: 0,
  });

  const fetchDistricts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response: PaginatedDistrictsResponse = await districtsApi.getAll({
        ...filters,
        page: pagination.currentPage,
        page_size: pagination.pageSize,
      });

      setDistricts(response.results);
      setPagination((prev) => ({
        ...prev,
        count: response.count,
        next: response.next ?? null,
        previous: response.previous ?? null,
        totalPages: Math.ceil(response.count / pagination.pageSize),
      }));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch districts"
      );
      setDistricts([]);
    } finally {
      setLoading(false);
    }
  }, [
    filters.search,
    filters.ordering,
    pagination.currentPage,
    pagination.pageSize,
  ]);

  useEffect(() => {
    fetchDistricts();
  }, [fetchDistricts]);

  const createDistrict = async (data: DistrictRequest): Promise<District> => {
    try {
      const newDistrict = await districtsApi.createDistrict(data);
      setDistricts((prev) => [newDistrict, ...prev]);
      return newDistrict;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create district"
      );
      throw err;
    }
  };

  const updateDistrict = async (
    id: number,
    data: DistrictRequest
  ): Promise<District> => {
    try {
      const updatedDistrict = await districtsApi.updateDistrict(id, data);
      setDistricts((prev) =>
        prev.map((district) =>
          district.id === id ? updatedDistrict : district
        )
      );
      return updatedDistrict;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update district"
      );
      throw err;
    }
  };

  const patchDistrict = async (
    id: number,
    data: DistrictUpdateRequest
  ): Promise<District> => {
    try {
      const updatedDistrict = await districtsApi.patchDistrict(id, data);
      setDistricts((prev) =>
        prev.map((district) =>
          district.id === id ? updatedDistrict : district
        )
      );
      return updatedDistrict;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update district"
      );
      throw err;
    }
  };

  const deleteDistrict = async (id: number): Promise<void> => {
    try {
      await districtsApi.deleteDistrict(id);
      setDistricts((prev) => prev.filter((district) => district.id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete district"
      );
      throw err;
    }
  };

  const refreshDistricts = () => {
    fetchDistricts();
  };

  const changePage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  }, []);

  const changePageSize = useCallback((pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      pageSize,
      currentPage: 1,
      totalPages: Math.ceil(prev.count / pageSize),
    }));
  }, []);

  return {
    districts,
    loading,
    error,
    pagination,
    createDistrict,
    updateDistrict,
    patchDistrict,
    deleteDistrict,
    refreshDistricts,
    changePage,
    changePageSize,
  };
}

export function useDistrict(id: number) {
  const [district, setDistrict] = useState<District | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDistrict = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await districtsApi.getDistrict(id);
        setDistrict(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch district"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDistrict();
    }
  }, [id]);

  return { district, loading, error };
}
