import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState, LoginRequest, User } from "@/types/auth";
import { authApi } from "@/lib/api/auth";

interface AuthActions {
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  clearError: () => void;
  checkAuth: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      accessToken: null, // Keep for compatibility but won't be used
      refreshToken: null, // Keep for compatibility but won't be used
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials: LoginRequest) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authApi.login(credentials);

          if (response.status && response.data.user) {
            // Set user data from the response
            const user: User = {
              id: response.data.user.id,
              name: response.data.user.name,
              phone: response.data.user.phone,
              photo: response.data.user.photo,
              bio: response.data.user.bio,
              role: response.data.user.role,
              status: response.data.user.status,
              language: response.data.user.language,
              contacts: response.data.user.contacts,
              balance: response.data.user.balance,
              created_at: response.data.user.created_at,
              updated_at: response.data.user.updated_at,
            };

            set({
              user,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            throw new Error(response.message || "Login failed");
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Login failed",
            isLoading: false,
          });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });

        try {
          await authApi.logout();
        } catch (error) {
          // Continue with logout even if API call fails
          console.error("Logout API error:", error);
        }

        // Clear all auth data
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      setUser: (user: User) => {
        set({ user });
      },

      clearError: () => {
        set({ error: null });
      },

      checkAuth: async () => {
        try {
          // Check if user is authenticated by trying to access a protected endpoint
          const isAuthenticated = await authApi.checkAuthStatus();

          if (isAuthenticated) {
            // If authenticated but no user data, we need to handle this case
            const currentUser = get().user;
            if (currentUser) {
              set({ isAuthenticated: true });
            } else {
              // If no user data but authenticated, we might need to fetch user info
              // For now, we'll set as not authenticated since we need user data
              set({ isAuthenticated: false });
            }
          } else {
            set({ isAuthenticated: false });
          }
        } catch (error) {
          // If check fails, assume not authenticated
          set({ isAuthenticated: false });
        }
      },

      // New method to refresh user data
      refreshUserData: async () => {
        const currentUser = get().user;
        if (currentUser?.id) {
          try {
            const userData = await authApi.getCurrentUser(currentUser.id);
            if (userData) {
              set({ user: userData });
            }
          } catch (error) {
            console.error("Failed to refresh user data:", error);
          }
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        // Don't persist tokens since we're using cookies
      }),
    }
  )
);
