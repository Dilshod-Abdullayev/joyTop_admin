import { useState, useEffect, useCallback } from "react";
import {
  Property,
  PropertyFilters,
  PaginatedPropertiesResponse,
} from "@/types/properties";
import { propertiesApi } from "@/lib/api/properties";
import i18n from "@/lib/i18n";

export function useProperties(initialFilters: PropertyFilters = {}) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PropertyFilters>(initialFilters);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null as string | null,
    previous: null as string | null,
    currentPage: 1,
    pageSize: 20,
    totalPages: 0,
  });

  // Fetch properties with current filters
  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response: PaginatedPropertiesResponse =
        await propertiesApi.getProperties({
          ...filters,
          page: pagination.currentPage,
          page_size: pagination.pageSize,
        });

      setProperties(response.results);
      setPagination((prev) => ({
        ...prev,
        count: response.count,
        next: response.next,
        previous: response.previous,
        totalPages: Math.ceil(response.count / pagination.pageSize),
      }));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch properties"
      );
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.currentPage, pagination.pageSize]);

  // Update filters and reset to first page
  const updateFilters = useCallback((newFilters: Partial<PropertyFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({});
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, []);

  // Change page
  const changePage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  }, []);

  // Change page size
  const changePageSize = useCallback((pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      pageSize,
      currentPage: 1,
      totalPages: Math.ceil(prev.count / pageSize),
    }));
  }, []);

  // Refresh properties
  const refresh = useCallback(() => {
    fetchProperties();
  }, [fetchProperties]);

  // Delete property
  const deleteProperty = useCallback(async (id: number) => {
    try {
      await propertiesApi.deleteProperty(id);
      setProperties((prev) => prev.filter((prop) => prop.id !== id));
      return true;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete property"
      );
      return false;
    }
  }, []);

  // Toggle property status
  const toggleStatus = useCallback(async (id: number, status: boolean) => {
    try {
      const updatedProperty = await propertiesApi.togglePropertyStatus(
        id,
        status
      );
      setProperties((prev) =>
        prev.map((prop) => (prop.id === id ? { ...prop, status } : prop))
      );
      return updatedProperty;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to toggle property status"
      );
      return null;
    }
  }, []);

  // Fetch properties when filters, page, or page size changes
  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return {
    properties,
    loading,
    error,
    filters,
    pagination,
    updateFilters,
    clearFilters,
    changePage,
    changePageSize,
    refresh,
    deleteProperty,
    toggleStatus,
  };
}
