"use client";

import { useTranslation } from "react-i18next";
import { UsersList } from "@/components/users/UsersList";
import { useUsers } from "@/lib/hooks/useUsers";

export default function UsersPage() {
  const { t, ready } = useTranslation();
  const {
    users,
    loading,
    error,
    filters,
    pagination,
    updateFilters,
    clearFilters,
    changePage,
    changePageSize,
    deleteUser,
    toggleStatus,
  } = useUsers();

  const handlePageChange = (page: number) => {
    changePage(page);
  };

  const handlePageSizeChange = (pageSize: number) => {
    changePageSize(pageSize);
  };

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {ready ? t("users.page.title") : "Управление пользователями"}
        </h1>
        <p className="text-gray-600 mt-2">
          {ready
            ? t("users.page.description")
            : "Просматривайте, редактируйте и управляйте пользователями системы"}
        </p>
      </div>

      {/* Users List Component */}
      <UsersList
        users={users}
        loading={loading}
        error={error}
        filters={filters}
        pagination={pagination}
        onFiltersChange={updateFilters}
        onClearFilters={clearFilters}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onDeleteUser={deleteUser}
        onToggleStatus={toggleStatus}
      />
    </div>
  );
}

