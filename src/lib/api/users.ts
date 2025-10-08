import { UserFilters, PaginatedUsersResponse } from "@/types/users";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://building.ardentsoft.uz";

export const usersApi = {
  async getUsers(filters: UserFilters = {}): Promise<PaginatedUsersResponse> {
    const searchParams = new URLSearchParams();

    if (filters.search) searchParams.append("search", filters.search);
    if (filters.role) searchParams.append("role", filters.role);
    if (filters.status) searchParams.append("status", filters.status);
    if (filters.language) searchParams.append("language", filters.language);
    if (filters.page) searchParams.append("page", filters.page.toString());
    if (filters.page_size)
      searchParams.append("page_size", filters.page_size.toString());

    const response = await fetch(
      `${API_BASE_URL}/api/website/v1/users/?${searchParams}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          lang: localStorage.getItem("i18nextLng") || "ru",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    const apiResponse = await response.json();
    return apiResponse.data;
  },

  async getUser(id: number): Promise<any> {
    const response = await fetch(
      `${API_BASE_URL}/api/website/v1/users/${id}/`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          lang: localStorage.getItem("i18nextLng") || "ru",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }

    const apiResponse = await response.json();
    return apiResponse.data;
  },

  async updateUser(id: number, data: any): Promise<any> {
    const response = await fetch(
      `${API_BASE_URL}/api/website/v1/users/${id}/`,
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
      throw new Error("Failed to update user");
    }

    const apiResponse = await response.json();
    return apiResponse.data;
  },

  async deleteUser(id: number): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/api/website/v1/users/${id}/`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          lang: localStorage.getItem("i18nextLng") || "ru",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete user");
    }
  },

  async toggleUserStatus(id: number, status: string): Promise<any> {
    const response = await fetch(
      `${API_BASE_URL}/api/website/v1/users/${id}/`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          lang: localStorage.getItem("i18nextLng") || "ru",
        },
        body: JSON.stringify({ status }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to toggle user status");
    }

    const apiResponse = await response.json();
    return apiResponse.data;
  },
};
