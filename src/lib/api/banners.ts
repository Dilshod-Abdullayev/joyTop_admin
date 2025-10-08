import {
  Banner,
  BannerRequest,
  BannerUpdateRequest,
  BannerFilters,
  PaginatedBannersResponse,
} from "@/types/banners";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://building.ardentsoft.uz";

export const bannersApi = {
  // Get all banners with optional filters
  getAll: async (filters: BannerFilters = {}): Promise<Banner[]> => {
    const searchParams = new URLSearchParams();

    if (filters.search) searchParams.append("search", filters.search);
    if (filters.page) searchParams.append("page", filters.page.toString());
    if (filters.page_size)
      searchParams.append("page_size", filters.page_size.toString());
    if (filters.ordering) searchParams.append("ordering", filters.ordering);

    const response = await fetch(
      `${API_BASE_URL}/api/website/v1/banners/?${searchParams}`,
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
        errorData.message || `HTTP ${response.status}: Failed to fetch banners`
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

  // Get banner by ID
  getBanner: async (id: number): Promise<Banner> => {
    const response = await fetch(
      `${API_BASE_URL}/api/website/v1/banners/${id}/`,
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
        errorData.message || `HTTP ${response.status}: Failed to fetch banner`
      );
    }

    const responseData = await response.json();
    console.log("getBanner API response:", responseData);

    // Extract banner data from the wrapped response
    if (responseData && responseData.status === true && responseData.data) {
      return responseData.data;
    } else if (responseData && responseData.id) {
      // Fallback: if response is already the banner object
      return responseData;
    } else {
      console.error("Unexpected API response structure:", responseData);
      throw new Error("Invalid response format from server");
    }
  },

  // Create new banner
  createBanner: async (data: BannerRequest): Promise<Banner> => {
    console.log("Creating banner with data:", data);

    // Handle file upload with FormData
    const formData = new FormData();
    formData.append("title", data.title);

    if (data.image instanceof File) {
      formData.append("image", data.image);
    } else if (typeof data.image === "string") {
      formData.append("image", data.image);
    }

    if (data.link) {
      formData.append("link", data.link);
    }

    if (data.end_date) {
      formData.append("end_date", data.end_date);
    }

    const response = await fetch(`${API_BASE_URL}/api/website/v1/banners/`, {
      method: "POST",
      credentials: "include",
      headers: {
        lang: localStorage.getItem("i18nextLng") || "ru",
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Banner creation failed:", response.status, errorText);
      throw new Error(`Failed to create banner: ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log("createBanner API response:", responseData);

    // Extract banner data from the wrapped response
    if (responseData && responseData.status === true && responseData.data) {
      return responseData.data;
    } else if (responseData && responseData.id) {
      // Fallback: if response is already the banner object
      return responseData;
    } else {
      console.error("Unexpected API response structure:", responseData);
      throw new Error("Invalid response format from server");
    }
  },

  // Update banner (PUT)
  updateBanner: async (id: number, data: BannerRequest): Promise<Banner> => {
    // Handle file upload with FormData
    const formData = new FormData();
    formData.append("title", data.title);

    if (data.image instanceof File) {
      formData.append("image", data.image);
    } else if (typeof data.image === "string") {
      formData.append("image", data.image);
    }

    if (data.link) {
      formData.append("link", data.link);
    }

    if (data.end_date) {
      formData.append("end_date", data.end_date);
    }

    const response = await fetch(
      `${API_BASE_URL}/api/website/v1/banners/${id}/`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          lang: localStorage.getItem("i18nextLng") || "ru",
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP ${response.status}: Failed to update banner`
      );
    }

    const responseData = await response.json();
    console.log("updateBanner API response:", responseData);

    // Extract banner data from the wrapped response
    if (responseData && responseData.status === true && responseData.data) {
      return responseData.data;
    } else if (responseData && responseData.id) {
      // Fallback: if response is already the banner object
      return responseData;
    } else {
      console.error("Unexpected API response structure:", responseData);
      throw new Error("Invalid response format from server");
    }
  },

  // Partial update banner (PATCH)
  patchBanner: async (
    id: number,
    data: BannerUpdateRequest
  ): Promise<Banner> => {
    // Handle file upload with FormData
    const formData = new FormData();

    // Only append fields that are actually provided
    if (data.title !== undefined) {
      formData.append("title", data.title);
    }

    if (data.image !== undefined) {
      if (data.image instanceof File) {
        formData.append("image", data.image);
      } else if (typeof data.image === "string") {
        formData.append("image", data.image);
      }
    }

    if (data.link !== undefined) {
      formData.append("link", data.link || "");
    }

    if (data.end_date !== undefined) {
      formData.append("end_date", data.end_date || "");
    }

    const response = await fetch(
      `${API_BASE_URL}/api/website/v1/banners/${id}/`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          lang: localStorage.getItem("i18nextLng") || "ru",
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP ${response.status}: Failed to update banner`
      );
    }

    const responseData = await response.json();
    console.log("patchBanner API response:", responseData);

    // Extract banner data from the wrapped response
    if (responseData && responseData.status === true && responseData.data) {
      return responseData.data;
    } else if (responseData && responseData.id) {
      // Fallback: if response is already the banner object
      return responseData;
    } else {
      console.error("Unexpected API response structure:", responseData);
      throw new Error("Invalid response format from server");
    }
  },

  // Delete banner
  deleteBanner: async (id: number): Promise<void> => {
    const response = await fetch(
      `${API_BASE_URL}/api/website/v1/banners/${id}/`,
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
        errorData.message || `HTTP ${response.status}: Failed to delete banner`
      );
    }
  },
};
