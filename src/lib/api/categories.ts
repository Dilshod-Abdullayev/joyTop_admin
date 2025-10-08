import {
  Category,
  CategoryRequest,
  CategoryUpdateRequest,
  CategoryFilters,
} from "@/types/categories";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://building.ardentsoft.uz";

export const categoriesApi = {
  // Get all categories with optional filters
  getAll: async (filters: CategoryFilters = {}): Promise<Category[]> => {
    const searchParams = new URLSearchParams();

    if (filters.search) searchParams.append("search", filters.search);
    if (filters.is_paid !== undefined)
      searchParams.append("is_paid", filters.is_paid.toString());
    if (filters.ad_price) searchParams.append("ad_price", filters.ad_price);
    if (filters.min_price) searchParams.append("min_price", filters.min_price);
    if (filters.max_price) searchParams.append("max_price", filters.max_price);
    if (filters.ordering) searchParams.append("ordering", filters.ordering);
    if (filters.page) searchParams.append("page", filters.page.toString());
    if (filters.page_size)
      searchParams.append("page_size", filters.page_size.toString());

    const response = await fetch(
      `${API_BASE}/api/website/v1/category/?${searchParams}`,
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
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

  // Get category by ID
  getCategory: async (id: number): Promise<Category> => {
    const response = await fetch(`${API_BASE}/api/website/v1/category/${id}/`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch category: ${response.statusText}`);
    }

    return response.json();
  },

  // Create new category
  createCategory: async (data: CategoryRequest): Promise<Category> => {
    console.log("Creating category with data:", data);
    console.log("API endpoint:", `${API_BASE}/api/website/v1/category/`);

    const response = await fetch(`${API_BASE}/api/website/v1/category/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Category creation failed:", response.status, errorText);
      throw new Error(`Failed to create category: ${response.statusText}`);
    }

    return response.json();
  },

  // Update category
  updateCategory: async (
    id: number,
    data: CategoryUpdateRequest
  ): Promise<Category> => {
    const response = await fetch(`${API_BASE}/api/website/v1/category/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update category: ${response.statusText}`);
    }

    return response.json();
  },

  // Partial update category
  patchCategory: async (
    id: number,
    data: Partial<CategoryUpdateRequest>
  ): Promise<Category> => {
    const response = await fetch(`${API_BASE}/api/website/v1/category/${id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update category: ${response.statusText}`);
    }

    return response.json();
  },

  // Delete category
  deleteCategory: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE}/api/website/v1/category/${id}/`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete category: ${response.statusText}`);
    }
  },

  // Get categories with count
  getCategoriesWithCount: async (): Promise<Category[]> => {
    const response = await fetch(
      `${API_BASE}/api/website/v1/category/with-count/`,
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch categories with count: ${response.statusText}`
      );
    }

    return response.json();
  },
};
