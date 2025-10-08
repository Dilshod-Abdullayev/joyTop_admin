"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/authStore";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading, checkAuth, refreshUserData, user } =
    useAuthStore();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        await checkAuth();

        // If authenticated but no user data, try to refresh user data
        if (isAuthenticated && !user) {
          await refreshUserData();
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsChecking(false);
      }
    };

    verifyAuth();
  }, [checkAuth, refreshUserData, isAuthenticated, user]);

  useEffect(() => {
    if (!isChecking && !isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isChecking, isLoading, isAuthenticated, router]);

  // Show loading while checking authentication
  if (isChecking || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
            <span className="text-white font-bold text-2xl">J</span>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Проверка авторизации...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render children (will redirect to login)
  if (!isAuthenticated) {
    return null;
  }

  // If authenticated, render children
  return <>{children}</>;
}
