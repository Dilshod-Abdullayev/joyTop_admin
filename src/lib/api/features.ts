import { Feature, FeatureFilters } from "@/types/features";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://building.ardentsoft.uz";

export const featuresApi = {
  // Get all features with optional filters
  getAll: async (filters: FeatureFilters = {}): Promise<Feature[]> => {
    const searchParams = new URLSearchParams();

    if (filters.search) searchParams.append("search", filters.search);
    if (filters.page) searchParams.append("page", filters.page.toString());
    if (filters.page_size)
      searchParams.append("page_size", filters.page_size.toString());
    if (filters.ordering) searchParams.append("ordering", filters.ordering);

    const response = await fetch(
      `${API_BASE_URL}/api/website/v1/features/?${searchParams}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          lang: localStorage.getItem("i18nextLng") || "ru",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP ${response.status}: Failed to fetch features`
      );
    }

    const data = await response.json();

    // Handle the specific response structure from the backend
    if (data && data.status === true && Array.isArray(data.data)) {
      return data.data;
    } else if (Array.isArray(data)) {
      return data;
    } else if (data && Array.isArray(data.results)) {
      return data.results;
    } else {
      console.warn("Unexpected API response structure:", data);
      return [];
    }
  },

  // Get feature by ID
  getFeature: async (id: number): Promise<Feature> => {
    const response = await fetch(
      `${API_BASE_URL}/api/website/v1/features/${id}/`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          lang: localStorage.getItem("i18nextLng") || "ru",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP ${response.status}: Failed to fetch feature`
      );
    }

    const responseData = await response.json();
    console.log("getFeature API response:", responseData);

    // Extract feature data from the wrapped response
    if (responseData && responseData.status === true && responseData.data) {
      return responseData.data;
    } else if (responseData && responseData.id) {
      // Fallback: if response is already the feature object
      return responseData;
    } else {
      console.error("Unexpected API response structure:", responseData);
      throw new Error("Invalid response format from server");
    }
  },

  // Create new feature
  createFeature: async (data: any): Promise<Feature> => {
    console.log("Creating feature with data:", data);

    const response = await fetch(`${API_BASE_URL}/api/website/v1/features/`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        lang: localStorage.getItem("i18nextLng") || "ru",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Feature creation failed:", response.status, errorData);

      // Handle specific error cases
      if (response.status === 400 && errorData.detail) {
        throw new Error(errorData.detail);
      } else if (errorData.message) {
        throw new Error(errorData.message);
      } else {
        throw new Error(`HTTP ${response.status}: Failed to create feature`);
      }
    }

    const responseData = await response.json();
    console.log("createFeature API response:", responseData);

    // Extract feature data from the wrapped response
    if (responseData && responseData.status === true && responseData.data) {
      return responseData.data;
    } else if (responseData && responseData.id) {
      return responseData;
    } else {
      console.error("Unexpected API response structure:", responseData);
      throw new Error("Invalid response format from server");
    }
  },

  // Update feature
  updateFeature: async (id: number, data: any): Promise<Feature> => {
    const response = await fetch(
      `${API_BASE_URL}/api/website/v1/features/${id}/`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          lang: localStorage.getItem("i18nextLng") || "ru",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP ${response.status}: Failed to update feature`
      );
    }

    const responseData = await response.json();
    console.log("updateFeature API response:", responseData);

    // Extract feature data from the wrapped response
    if (responseData && responseData.status === true && responseData.data) {
      return responseData.data;
    } else if (responseData && responseData.id) {
      return responseData;
    } else {
      console.error("Unexpected API response structure:", responseData);
      throw new Error("Invalid response format from server");
    }
  },

  // Partial update feature
  patchFeature: async (id: number, data: any): Promise<Feature> => {
    const response = await fetch(
      `${API_BASE_URL}/api/website/v1/features/${id}/`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          lang: localStorage.getItem("i18nextLng") || "ru",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP ${response.status}: Failed to update feature`
      );
    }

    const responseData = await response.json();
    console.log("patchFeature API response:", responseData);

    // Extract feature data from the wrapped response
    if (responseData && responseData.status === true && responseData.data) {
      return responseData.data;
    } else if (responseData && responseData.id) {
      return responseData;
    } else {
      console.error("Unexpected API response structure:", responseData);
      throw new Error("Invalid response format from server");
    }
  },

  // Delete feature
  deleteFeature: async (id: number): Promise<void> => {
    const response = await fetch(
      `${API_BASE_URL}/api/website/v1/features/${id}/`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          lang: localStorage.getItem("i18nextLng") || "ru",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP ${response.status}: Failed to delete feature`
      );
    }
  },
};
