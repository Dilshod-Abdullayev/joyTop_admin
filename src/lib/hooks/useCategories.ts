import { useState, useEffect } from "react";
import { categoriesApi } from "@/lib/api/categories";
import {
  Category,
  CategoryRequest,
  CategoryUpdateRequest,
  CategoryFilters,
} from "@/types/categories";

export function useCategories(filters: CategoryFilters = {}) {
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await categoriesApi.getAll(filters);
        setData(result);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch categories"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [JSON.stringify(filters)]); // Stringify to create stable dependency

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await categoriesApi.getAll(filters);
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch categories"
      );
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (categoryData: CategoryRequest) => {
    try {
      const newCategory = await categoriesApi.createCategory(categoryData);
      setData((prev) => [...prev, newCategory]);
      return newCategory;
    } catch (err) {
      throw err;
    }
  };

  const updateCategory = async (
    id: number,
    categoryData: CategoryUpdateRequest
  ) => {
    try {
      const updatedCategory = await categoriesApi.updateCategory(
        id,
        categoryData
      );
      setData((prev) =>
        prev.map((cat) => (cat.id === id ? updatedCategory : cat))
      );
      return updatedCategory;
    } catch (err) {
      throw err;
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      await categoriesApi.deleteCategory(id);
      setData((prev) => prev.filter((cat) => cat.id !== id));
    } catch (err) {
      throw err;
    }
  };

  return {
    data,
    loading,
    error,
    refetch,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}

export function useCategory(id: number) {
  const [data, setData] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await categoriesApi.getCategory(id);
        setData(result);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch category"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await categoriesApi.getCategory(id);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch category");
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    refetch,
  };
}
