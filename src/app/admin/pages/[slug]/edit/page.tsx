"use client";

import { useParams } from "next/navigation";
import { usePages } from "@/lib/hooks/usePages";
import { EditPageModal } from "@/components/pages/EditPageModal";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export default function EditPagePage() {
  const params = useParams();
  const slug = params.slug as string;
  const { t, i18n } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(true);

  const { data, loading, error, updatePage } = usePages();

  const page = data.find((p) => p.slug === slug);

  // Get current language content for display
  const currentLang = i18n.language || "ru";
  const getCurrentLanguageContent = () => {
    const lang = currentLang.startsWith("uz")
      ? "uz"
      : currentLang.startsWith("en")
      ? "en"
      : "ru";
    return {
      title:
        page?.[`title_${lang}`] ||
        page?.title_ru ||
        page?.title_uz ||
        page?.title_en ||
        "",
    };
  };

  const { title } = getCurrentLanguageContent();

  const handleEdit = async (id: number, pageData: any) => {
    try {
      await updatePage(id, pageData);
      // Redirect back to the view page after successful edit
      window.location.href = `/admin/pages/${slug}`;
    } catch (error) {
      console.error("Failed to update page:", error);
    }
  };

  const handleClose = () => {
    // Redirect back to the view page when modal is closed
    window.location.href = `/admin/pages/${slug}`;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            {t("pages.error")}
          </h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href="/admin/pages">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("pages.backToPages")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {t("pages.notFound")}
          </h1>
          <p className="text-gray-600 mb-4">
            {t("pages.pageNotFound", { slug })}
          </p>
          <Link href="/admin/pages">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("pages.backToPages")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href={`/admin/pages/${slug}`}>
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("pages.backToPages")}
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          {t("pages.editPage")}: {title}
        </h1>
      </div>

      <EditPageModal
        isOpen={isModalOpen}
        page={page}
        onClose={handleClose}
        onSubmit={handleEdit}
      />
    </div>
  );
}
