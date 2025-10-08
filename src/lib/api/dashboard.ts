import { DashboardData } from "@/types/dashboard";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://building.ardentsoft.uz";

export const dashboardApi = {
  async getDashboardData(): Promise<DashboardData> {
    const response = await fetch(`${API_BASE_URL}/api/website/v1/dashboard/`, {
      method: "GET",
      credentials: "include",
      headers: {
        "lang": localStorage.getItem("i18nextLng") || "ru",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch dashboard data");
    }

    const apiResponse = await response.json();
    return apiResponse.data;
  },
};
