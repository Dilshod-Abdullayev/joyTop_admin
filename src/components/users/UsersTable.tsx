"use client";

import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import {
  Eye,
  Edit,
  Trash2,
  User,
  Shield,
  Crown,
  CheckCircle,
  XCircle,
  Ban,
  Phone,
  Mail,
  MessageCircle,
} from "lucide-react";
import { User as UserType } from "@/types/users";

interface UsersTableProps {
  users: UserType[];
  loading: boolean;
  error: string | null;
  onDeleteUser: (id: number) => Promise<boolean>;
  onToggleStatus: (id: number, status: string) => Promise<any>;
}

export function UsersTable({
  users,
  loading,
  error,
  onDeleteUser,
  onToggleStatus,
}: UsersTableProps) {
  const { t, ready } = useTranslation();
  const router = useRouter();

  const handleViewUser = (userId: number) => {
    router.push(`/admin/users/${userId}`);
  };

  const handleEditUser = (userId: number) => {
    router.push(`/admin/users/${userId}/edit`);
  };

  const handleDeleteUser = async (userId: number) => {
    if (
      confirm(
        ready
          ? t("users.actions.confirmDelete")
          : "Вы уверены, что хотите удалить этого пользователя?"
      )
    ) {
      await onDeleteUser(userId);
    }
  };

  const handleStatusToggle = async (userId: number, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    await onToggleStatus(userId, newStatus);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Crown className="w-4 h-4 text-red-500" />;
      case "moderator":
        return <Shield className="w-4 h-4 text-blue-500" />;
      default:
        return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "inactive":
        return <XCircle className="w-4 h-4 text-gray-500" />;
      case "banned":
        return <Ban className="w-4 h-4 text-red-500" />;
      default:
        return <XCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "banned":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200"></div>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-16 bg-gray-100 border-t border-gray-200"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center text-red-600">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center text-gray-500">
          <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium">
            {ready ? t("users.table.noUsers") : "Пользователи не найдены"}
          </p>
          <p className="text-sm">
            {ready
              ? t("users.table.noUsersDescription")
              : "Попробуйте изменить фильтры или поисковый запрос"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {ready ? t("users.table.user") : "Пользователь"}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {ready ? t("users.table.role") : "Роль"}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {ready ? t("users.table.status") : "Статус"}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {ready ? t("users.table.balance") : "Баланс"}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {ready ? t("users.table.contacts") : "Контакты"}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {ready ? t("users.table.created") : "Создан"}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {ready ? t("users.table.actions") : "Действия"}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                {/* User Info */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      {user.photo ? (
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={user.photo}
                          alt={user.name}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500">ID: {user.id}</div>
                    </div>
                  </div>
                </td>

                {/* Role */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getRoleIcon(user.role)}
                    <span className="ml-2 text-sm text-gray-900">
                      {ready ? t(`users.roles.${user.role}`) : user.role}
                    </span>
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getStatusIcon(user.status)}
                    <span
                      className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        user.status
                      )}`}
                    >
                      {ready ? t(`users.status.${user.status}`) : user.status}
                    </span>
                  </div>
                </td>

                {/* Balance */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.balance.toLocaleString()} UZS
                </td>

                {/* Contacts */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    {user.contacts.contact_phone && (
                      <Phone className="w-4 h-4 text-gray-400" />
                    )}
                    {user.contacts.telegram && (
                      <MessageCircle className="w-4 h-4 text-blue-400" />
                    )}
                    {user.contacts.whatsapp && (
                      <MessageCircle className="w-4 h-4 text-green-400" />
                    )}
                  </div>
                </td>

                {/* Created Date */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => handleViewUser(user.id)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                      title={ready ? t("users.actions.view") : "Просмотр"}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => handleStatusToggle(user.id, user.status)}
                      className={`p-1 rounded hover:bg-gray-50 ${
                        user.status === "active"
                          ? "text-orange-600 hover:text-orange-900"
                          : "text-green-600 hover:text-green-900"
                      }`}
                      title={
                        user.status === "active"
                          ? ready
                            ? t("users.actions.deactivate")
                            : "Деактивировать"
                          : ready
                          ? t("users.actions.activate")
                          : "Активировать"
                      }
                    >
                      {user.status === "active" ? (
                        <XCircle className="w-4 h-4" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                      title={ready ? t("users.actions.delete") : "Удалить"}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
