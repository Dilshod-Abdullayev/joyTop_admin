import { useState, useEffect } from "react";
import { bannersApi } from "@/lib/api/banners";
import {
  Banner,
  BannerRequest,
  BannerUpdateRequest,
  BannerFilters,
} from "@/types/banners";

export function useBanners(filters: BannerFilters = {}) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bannersApi.getAll(filters);
      setBanners(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, [filters.search, filters.page, filters.page_size, filters.ordering]);

  const createBanner = async (data: BannerRequest): Promise<Banner> => {
    try {
      const newBanner = await bannersApi.createBanner(data);
      setBanners((prev) => [newBanner, ...prev]);
      return newBanner;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create banner");
      throw err;
    }
  };

  const updateBanner = async (
    id: number,
    data: BannerRequest
  ): Promise<Banner> => {
    try {
      const updatedBanner = await bannersApi.updateBanner(id, data);
      setBanners((prev) =>
        prev.map((banner) => (banner.id === id ? updatedBanner : banner))
      );
      return updatedBanner;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update banner");
      throw err;
    }
  };

  const patchBanner = async (
    id: number,
    data: BannerUpdateRequest
  ): Promise<Banner> => {
    try {
      const updatedBanner = await bannersApi.patchBanner(id, data);
      console.log("patchBanner - updatedBanner:", updatedBanner);

      setBanners((prev) => {
        const newBanners = prev.map((banner) =>
          banner.id === id ? updatedBanner : banner
        );
        console.log(
          "patchBanner - newBanners:",
          newBanners.map((b) => ({ id: b.id, title: b.title }))
        );

        // Check for duplicate IDs
        const ids = newBanners.map((b) => b.id);
        const uniqueIds = new Set(ids);
        if (ids.length !== uniqueIds.size) {
          console.warn("Duplicate banner IDs detected:", ids);
        }

        return newBanners;
      });

      return updatedBanner;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update banner");
      throw err;
    }
  };

  const deleteBanner = async (id: number): Promise<void> => {
    try {
      await bannersApi.deleteBanner(id);
      setBanners((prev) => prev.filter((banner) => banner.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete banner");
      throw err;
    }
  };

  const refreshBanners = () => {
    fetchBanners();
  };

  return {
    banners,
    loading,
    error,
    createBanner,
    updateBanner,
    patchBanner,
    deleteBanner,
    refreshBanners,
  };
}

export function useBanner(id: number) {
  const [banner, setBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await bannersApi.getBanner(id);
        setBanner(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch banner");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBanner();
    }
  }, [id]);

  return { banner, loading, error };
}
