"use client";

import { useTranslation } from "react-i18next";
import { UsersSearch } from "./UsersSearch";
import { UsersTable } from "./UsersTable";
import { Pagination } from "@/components/ui/Pagination";
import { UserFilters } from "@/types/users";

interface UsersListProps {
  users: any[];
  loading: boolean;
  error: string | null;
  filters: UserFilters;
  pagination: {
    count: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
  };
  onFiltersChange: (filters: Partial<UserFilters>) => void;
  onClearFilters: () => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onDeleteUser: (id: number) => Promise<boolean>;
  onToggleStatus: (id: number, status: string) => Promise<any>;
}

export function UsersList({
  users,
  loading,
  error,
  filters,
  pagination,
  onFiltersChange,
  onClearFilters,
  onPageChange,
  onPageSizeChange,
  onDeleteUser,
  onToggleStatus,
}: UsersListProps) {
  const { t, ready } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <UsersSearch
        filters={filters}
        onFiltersChange={onFiltersChange}
        onClearFilters={onClearFilters}
      />

      {/* Users Table */}
      <UsersTable
        users={users}
        loading={loading}
        error={error}
        onDeleteUser={onDeleteUser}
        onToggleStatus={onToggleStatus}
      />

      {/* Pagination */}
      {!loading && !error && users.length > 0 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.count}
          pageSize={pagination.pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          showPageSizeSelector={true}
        />
      )}
    </div>
  );
}

