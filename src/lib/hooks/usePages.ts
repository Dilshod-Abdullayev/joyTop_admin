import { useState, useEffect } from "react";
import { pagesApi } from "@/lib/api/pages";
import {
  Page,
  PageFilters,
  CreatePageRequest,
  UpdatePageRequest,
} from "@/types/pages";

export function usePages(filters: PageFilters = {}) {
  const [data, setData] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await pagesApi.getAll(filters);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch pages");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters.search, filters.page, filters.page_size]);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await pagesApi.getAll(filters);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch pages");
    } finally {
      setLoading(false);
    }
  };

  const createPage = async (pageData: CreatePageRequest) => {
    try {
      const result = await pagesApi.createPage(pageData);
      // Refetch to get updated list
      await refetch();
      return result;
    } catch (err) {
      throw err;
    }
  };

  const updatePage = async (id: number, pageData: UpdatePageRequest) => {
    try {
      const result = await pagesApi.updatePage(id, pageData);
      setData((prev) => prev.map((page) => (page.id === id ? result : page)));
      return result;
    } catch (err) {
      throw err;
    }
  };

  const patchPage = async (
    id: number,
    pageData: Partial<UpdatePageRequest>
  ) => {
    try {
      const result = await pagesApi.patchPage(id, pageData);
      setData((prev) => prev.map((page) => (page.id === id ? result : page)));
      return result;
    } catch (err) {
      throw err;
    }
  };

  const deletePage = async (id: number) => {
    try {
      await pagesApi.deletePage(id);
      setData((prev) => prev.filter((page) => page.id !== id));
    } catch (err) {
      throw err;
    }
  };

  const getPageBySlug = async (slug: string) => {
    try {
      return await pagesApi.getBySlug(slug);
    } catch (err) {
      throw err;
    }
  };

  return {
    data,
    loading,
    error,
    refetch,
    createPage,
    updatePage,
    patchPage,
    deletePage,
    getPageBySlug,
  };
}
