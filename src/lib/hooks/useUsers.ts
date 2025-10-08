import { useState, useEffect, useCallback } from "react";
import { User, UserFilters, PaginatedUsersResponse } from "@/types/users";
import { usersApi } from "@/lib/api/users";

export function useUsers(initialFilters: UserFilters = {}) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<UserFilters>(initialFilters);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null as string | null,
    previous: null as string | null,
    currentPage: 1,
    pageSize: 20,
    totalPages: 1,
  });

  // Fetch users with current filters
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response: any = await usersApi.getUsers({
        ...filters,
        page: pagination.currentPage,
        page_size: pagination.pageSize,
      });
      console.log(response);

      // Handle both paginated and non-paginated responses
      if (response && response.results && Array.isArray(response.results)) {
        // Paginated response
        setUsers(response.results);
        setPagination((prev) => ({
          ...prev,
          count: response.count || 0,
          next: response.next,
          previous: response.previous,
          totalPages: Math.ceil((response.count || 0) / pagination.pageSize),
        }));
      } else if (Array.isArray(response)) {
        // Non-paginated response (fallback)
        setUsers(response);
        setPagination((prev) => ({
          ...prev,
          count: response.length,
          next: null,
          previous: null,
          totalPages: 1,
        }));
      } else {
        // Invalid response
        setUsers([]);
        setPagination((prev) => ({
          ...prev,
          count: 0,
          next: null,
          previous: null,
          totalPages: 0,
        }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.currentPage, pagination.pageSize]);

  // Update filters and reset to first page
  const updateFilters = useCallback((newFilters: Partial<UserFilters>) => {
    setFilters((prev: UserFilters) => ({ ...prev, ...newFilters }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({});
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, []);

  // Change page
  const changePage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  }, []);

  // Change page size
  const changePageSize = useCallback((pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      pageSize,
      currentPage: 1,
      totalPages: Math.ceil(prev.count / pageSize),
    }));
  }, []);

  // Refresh users
  const refresh = useCallback(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Delete user
  const deleteUser = useCallback(async (id: number) => {
    try {
      await usersApi.deleteUser(id);
      setUsers((prev) => prev.filter((user) => user.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user");
      return false;
    }
  }, []);

  // Toggle user status
  const toggleStatus = useCallback(async (id: number, status: string) => {
    try {
      const updatedUser = await usersApi.toggleUserStatus(id, status);
      setUsers((prev) =>
        prev.map((user) =>
          user.id === id ? { ...user, status: status as any } : user
        )
      );
      return updatedUser;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to toggle user status"
      );
      return null;
    }
  }, []);

  // Fetch users when filters, page, or page size changes
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    filters,
    pagination,
    updateFilters,
    clearFilters,
    changePage,
    changePageSize,
    refresh,
    deleteUser,
    toggleStatus,
  };
}
