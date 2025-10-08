"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  Phone,
  MessageCircle,
  Mail,
  Calendar,
  User,
  Shield,
  Globe,
  Wallet,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { usersApi } from "@/lib/api/users";
import { User as UserType } from "@/types/users";

export default function UserViewPage() {
  const { t, ready } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const userId = parseInt(params.id as string);

  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await usersApi.getUser(userId);
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch user");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    router.push(`/admin/users/${userId}/edit`);
  };

  const handleDelete = async () => {
    if (
      confirm(
        ready
          ? t("users.view.confirmDelete")
          : "Are you sure you want to delete this user?"
      )
    ) {
      try {
        await usersApi.deleteUser(userId);
        router.push("/admin/users");
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : ready
            ? t("users.view.deleteError")
            : "Failed to delete user"
        );
      }
    }
  };

  const handleBack = () => {
    router.push("/admin/users");
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-red-600">Error</h2>
          <p className="text-gray-600">{error}</p>
          <Button onClick={handleBack} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {ready ? t("users.view.back") : "Back"}
          </Button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-600">
            {ready ? t("users.table.noUsers") : "User not found"}
          </h2>
          <Button onClick={handleBack} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {ready ? t("users.view.back") : "Back"}
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "banned":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-purple-100 text-purple-800";
      case "admin":
        return "bg-blue-100 text-blue-800";
      case "user":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getLanguageLabel = (language: string) => {
    if (ready) {
      switch (language) {
        case "ru":
          return t("users.view.languages.ru");
        case "en":
          return t("users.view.languages.en");
        case "uz":
          return t("users.view.languages.uz");
        default:
          return language;
      }
    } else {
      switch (language) {
        case "ru":
          return "Russian";
        case "en":
          return "English";
        case "uz":
          return "Uzbek";
        default:
          return language;
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {ready ? t("users.view.back") : "Back"}
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {ready ? t("users.view.title") : "User Details"}
            </h1>
            <p className="text-gray-600">
              {ready
                ? t("users.view.description")
                : "View detailed information about the user"}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleDelete} variant="destructive">
            <Trash2 className="w-4 h-4 mr-2" />
            {ready ? t("users.actions.delete") : "Delete"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main User Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                {ready ? t("users.view.basicInfo") : "Basic Information"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {ready ? t("users.view.fields.name") : "Name"}
                  </label>
                  <p className="text-gray-900">
                    {user.name ||
                      (ready
                        ? t("users.view.fields.notSpecified")
                        : "Not specified")}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {ready ? t("users.view.fields.phone") : "Phone"}
                  </label>
                  <p className="text-gray-900 flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                    {user.phone}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {ready ? t("users.view.fields.role") : "Role"}
                  </label>
                  <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {ready ? t("users.view.fields.status") : "Status"}
                  </label>
                  <Badge className={getStatusColor(user.status)}>
                    {user.status}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {ready ? t("users.view.fields.language") : "Language"}
                  </label>
                  <p className="text-gray-900 flex items-center">
                    <Globe className="w-4 h-4 mr-2 text-gray-400" />
                    {getLanguageLabel(user.language)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {ready ? t("users.view.fields.balance") : "Balance"}
                  </label>
                  <p className="text-gray-900 flex items-center">
                    <Wallet className="w-4 h-4 mr-2 text-gray-400" />
                    {Number(user.balance).toLocaleString()} UZS
                  </p>
                </div>
              </div>

              {user.bio && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {ready ? t("users.view.fields.bio") : "Bio"}
                  </label>
                  <p className="text-gray-900">{user.bio}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                {ready ? t("users.view.contactInfo") : "Contact Information"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.contacts.contact_phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      {ready
                        ? t("users.view.fields.contactPhone")
                        : "Contact Phone"}
                    </label>
                    <p className="text-gray-900 flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      {user.contacts.contact_phone}
                    </p>
                  </div>
                )}
                {user.contacts.telegram && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      {ready ? t("users.view.fields.telegram") : "Telegram"}
                    </label>
                    <p className="text-gray-900 flex items-center">
                      <MessageCircle className="w-4 h-4 mr-2 text-blue-400" />
                      {user.contacts.telegram}
                    </p>
                  </div>
                )}
                {user.contacts.whatsapp && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      {ready ? t("users.view.fields.whatsapp") : "WhatsApp"}
                    </label>
                    <p className="text-gray-900 flex items-center">
                      <MessageCircle className="w-4 h-4 mr-2 text-green-400" />
                      {user.contacts.whatsapp}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                {ready ? t("users.view.accountInfo") : "Account Information"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {ready ? t("users.view.fields.createdAt") : "Created At"}
                  </label>
                  <p className="text-gray-900">
                    {new Date(user.created_at).toLocaleDateString()}{" "}
                    {new Date(user.created_at).toLocaleTimeString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {ready
                      ? t("users.view.fields.lastUpdated")
                      : "Last Updated"}
                  </label>
                  <p className="text-gray-900">
                    {new Date(user.updated_at).toLocaleDateString()}{" "}
                    {new Date(user.updated_at).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Photo */}
          <Card>
            <CardHeader>
              <CardTitle>
                {ready ? t("users.view.profilePhoto") : "Profile Photo"}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              {user.photo ? (
                <img
                  src={user.photo}
                  alt={user.name || "User"}
                  className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-gray-200"
                />
              ) : (
                <div className="w-32 h-32 rounded-full mx-auto bg-gray-200 flex items-center justify-center">
                  <User className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* User Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>
                {ready ? t("users.view.statistics") : "Statistics"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">
                  {ready ? t("users.view.fields.accountAge") : "Account Age"}
                </span>
                <span className="text-sm font-medium">
                  {Math.floor(
                    (Date.now() - new Date(user.created_at).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}{" "}
                  {ready ? "kun" : "days"}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">
                  {ready ? t("users.view.fields.balance") : "Balance"}
                </span>
                <span className="text-sm font-medium text-green-600">
                  {Number(user.balance).toLocaleString()} UZS
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
