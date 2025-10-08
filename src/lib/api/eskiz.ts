import { EskizBalanceResponse } from "@/types/eskiz";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://building.ardentsoft.uz";

export const eskizApi = {
  async getBalance(): Promise<EskizBalanceResponse> {
    const response = await fetch(
      `${API_BASE_URL}/api/website/v1/wallet/eskiz-balance/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          lang: localStorage.getItem("i18nextLng") || "ru",
        },
        credentials: "include", // Important for cookies
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || "Failed to fetch Eskiz balance";
      throw new Error(errorMessage);
    }

    return response.json();
  },
};
