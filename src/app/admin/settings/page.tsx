"use client";

import { useTranslation } from "react-i18next";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/lib/stores/authStore";

export default function SettingsPage() {
  const { t, ready } = useTranslation();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Password change form
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Profile update form
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    language: user?.language || "uz",
    contactPhone: user?.contacts?.contact_phone || "",
    telegram: user?.contacts?.telegram || "",
    whatsapp: user?.contacts?.whatsapp || "",
  });

  if (!ready) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: "error", text: t("settings.password.mismatch") });
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setMessage({ type: "error", text: t("settings.password.tooShort") });
      return;
    }

    setIsLoading(true);
    try {
      // Use the correct API endpoint from the Building API documentation
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL +
          "/api/website/v1/users/change_password/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            old_password: passwordForm.oldPassword,
            new_password: passwordForm.newPassword,
          }),
          credentials: "include",
        }
      );

      if (response.ok) {
        setMessage({ type: "success", text: t("settings.password.success") });
        setPasswordForm({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        const errorData = await response.json();
        setMessage({
          type: "error",
          text: errorData.message || t("settings.password.error"),
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: t("settings.password.error") });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      // For profile updates, we'll use the website API since that's what handles user profile data
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/api/website/v1/users/me/",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: profileForm.name,
            bio: profileForm.bio,
            language: profileForm.language,
            contacts: {
              contact_phone: profileForm.contactPhone,
              telegram: profileForm.telegram,
              whatsapp: profileForm.whatsapp,
            },
          }),
          credentials: "include",
        }
      );

      if (response.ok) {
        setMessage({ type: "success", text: t("settings.profile.success") });
      } else {
        const errorData = await response.json();
        setMessage({
          type: "error",
          text: errorData.message || t("settings.profile.error"),
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: t("settings.profile.error") });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {t("settings.page.title")}
        </h1>
        <p className="mt-2 text-gray-600">{t("settings.page.description")}</p>
      </div>

      {/* Message Display */}
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
       
      
        {/* Password Change */}
        <Card>
          <CardHeader>
            <CardTitle>{t("settings.password.title")}</CardTitle>
            <CardDescription>
              {t("settings.password.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <Label htmlFor="oldPassword">
                  {t("settings.password.oldPassword")}
                </Label>
                <Input
                  id="oldPassword"
                  type="password"
                  value={passwordForm.oldPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      oldPassword: e.target.value,
                    }))
                  }
                  placeholder={t("settings.password.oldPasswordPlaceholder")}
                  required
                />
              </div>

              <div>
                <Label htmlFor="newPassword">
                  {t("settings.password.newPassword")}
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                  placeholder={t("settings.password.newPasswordPlaceholder")}
                  required
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">
                  {t("settings.password.confirmPassword")}
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  placeholder={t(
                    "settings.password.confirmPasswordPlaceholder"
                  )}
                  required
                />
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading
                  ? t("settings.password.changing")
                  : t("settings.password.change")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
