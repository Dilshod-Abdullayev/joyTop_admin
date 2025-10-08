"use client";

import { useParams } from "next/navigation";
import { usePages } from "@/lib/hooks/usePages";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ViewPagePage() {
  const params = useParams();
  const slug = params.slug as string;
  const { t, i18n } = useTranslation();

  const { data, loading, error } = usePages();

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

  const page = data.find((p) => p.slug === slug);

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

  // Get current language content
  const currentLang = i18n.language || "ru";
  const getCurrentLanguageContent = () => {
    const lang = currentLang.startsWith("uz")
      ? "uz"
      : currentLang.startsWith("en")
      ? "en"
      : "ru";
    return {
      title:
        page[`title_${lang}`] ||
        page.title_ru ||
        page.title_uz ||
        page.title_en,
      content:
        page[`content_${lang}`] ||
        page.content_ru ||
        page.content_uz ||
        page.content_en,
    };
  };

  const { title, content } = getCurrentLanguageContent();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/admin/pages">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("pages.backToPages")}
          </Button>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            <p className="text-gray-600 mt-2">
              {t("pages.slug")}:{" "}
              <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                {page.slug}
              </code>
            </p>
          </div>
          <Link href={`/admin/pages/${page.slug}/edit`}>
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              {t("pages.editPage")}
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="prose max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900 prose-code:text-gray-800 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-50 prose-pre:border prose-pre:border-gray-200">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
