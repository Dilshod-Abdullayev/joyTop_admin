import { useState, useEffect } from "react";
import { featuresApi } from "@/lib/api/features";
import {
  Feature,
  FeatureRequest,
  FeatureUpdateRequest,
  FeatureFilters,
} from "@/types/features";

export function useFeatures(filters: FeatureFilters = {}) {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeatures = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await featuresApi.getAll(filters);
      setFeatures(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch features");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatures();
  }, [filters.search, filters.page, filters.page_size, filters.ordering]);

  const createFeature = async (data: FeatureRequest): Promise<Feature> => {
    try {
      const newFeature = await featuresApi.createFeature(data);
      setFeatures((prev) => [newFeature, ...prev]);
      return newFeature;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create feature");
      throw err;
    }
  };

  const updateFeature = async (
    id: number,
    data: FeatureRequest
  ): Promise<Feature> => {
    try {
      const updatedFeature = await featuresApi.updateFeature(id, data);
      setFeatures((prev) =>
        prev.map((feature) => (feature.id === id ? updatedFeature : feature))
      );
      return updatedFeature;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update feature");
      throw err;
    }
  };

  const patchFeature = async (
    id: number,
    data: FeatureUpdateRequest
  ): Promise<Feature> => {
    try {
      const updatedFeature = await featuresApi.patchFeature(id, data);
      setFeatures((prev) =>
        prev.map((feature) => (feature.id === id ? updatedFeature : feature))
      );
      return updatedFeature;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update feature");
      throw err;
    }
  };

  const deleteFeature = async (id: number): Promise<void> => {
    try {
      await featuresApi.deleteFeature(id);
      setFeatures((prev) => prev.filter((feature) => feature.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete feature");
      throw err;
    }
  };

  const refreshFeatures = () => {
    fetchFeatures();
  };

  return {
    features,
    loading,
    error,
    createFeature,
    updateFeature,
    patchFeature,
    deleteFeature,
    refreshFeatures,
  };
}

export function useFeature(id: number) {
  const [feature, setFeature] = useState<Feature | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeature = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await featuresApi.getFeature(id);
        setFeature(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch feature"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFeature();
    }
  }, [id]);

  return { feature, loading, error };
}
