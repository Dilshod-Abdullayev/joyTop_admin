import { Page } from "@/types/pages";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import Link from "next/link";

interface PageCardProps {
  page: Page;
  onEdit: (page: Page) => void;
  onDelete: (page: Page) => void;
  onView: (page: Page) => void;
}

export function PageCard({ page, onEdit, onDelete, onView }: PageCardProps) {
  const { t, i18n } = useTranslation();

  // Get current language
  const currentLang = i18n.language || "ru";

  // Get title and content for current language
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

  // Strip markdown for preview
  const getPlainTextPreview = (markdown: string) => {
    if (!markdown) return "";
    return markdown
      .replace(/#{1,6}\s+/g, "") // Remove headers
      .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold
      .replace(/\*(.*?)\*/g, "$1") // Remove italic
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Remove links
      .replace(/`([^`]+)`/g, "$1") // Remove code
      .replace(/\n+/g, " ") // Replace newlines with spaces
      .trim();
  };

  const previewText = getPlainTextPreview(content);
  const displayText =
    previewText.length > 150
      ? previewText.substring(0, 150) + "..."
      : previewText;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
              {title}
            </CardTitle>
            <Badge variant="secondary" className="text-xs">
              /{page.slug}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView(page)}
              className="h-8 w-8 p-0"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(page)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(page)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-gray-600 leading-relaxed">{displayText}</p>
        <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
          <span>
            {t("pages.updated")}:{" "}
            {new Date(page.updated_at).toLocaleDateString()}
          </span>
          <Badge variant="outline" className="text-xs">
            Markdown
          </Badge>
        </div>
        <div className="mt-4 pt-4 border-t">
          <Link href={`/admin/pages/${page.slug}`}>
            <Button variant="outline" size="sm" className="w-full gap-2">
              <ExternalLink className="h-4 w-4" />
              {t("pages.viewFullPage")}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
