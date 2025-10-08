import { LoginRequest, LoginResponse } from "@/types/auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://building.ardentsoft.uz";

export const authApi = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/api/website/v1/auth/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "lang": localStorage.getItem("i18nextLng") || "ru",
      },
      body: JSON.stringify(credentials),
      credentials: "include", // Important for cookies
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Login failed");
    }
    return response.json();
  },

  async logout(): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/api/website/v1/auth/logout/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "lang": localStorage.getItem("i18nextLng") || "ru",
        },
        credentials: "include", // Include cookies for logout
      }
    );
    if (!response.ok) {
      throw new Error("Logout failed");
    }
  },

  async checkAuthStatus(): Promise<boolean> {
    try {
      // Try to access a protected endpoint to check if user is authenticated
      // We'll use the dashboard endpoint since it requires authentication
      const response = await fetch(
        `${API_BASE_URL}/api/website/v1/dashboard/`,
        {
          method: "GET",
          credentials: "include", // Include cookies
          headers: {
            "lang": localStorage.getItem("i18nextLng") || "ru",
          },
        }
      );
      return response.ok;
    } catch (error) {
      return false;
    }
  },

  async getCurrentUser(userId: number): Promise<any> {
    try {
      // Get user details by ID since /users/me/ only supports PATCH
      const response = await fetch(
        `${API_BASE_URL}/api/website/v1/users/${userId}/`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "lang": localStorage.getItem("i18nextLng") || "ru",
          },
        }
      );
      if (response.ok) {
        return response.json();
      }
      return null;
    } catch (error) {
      return null;
    }
  },
};
