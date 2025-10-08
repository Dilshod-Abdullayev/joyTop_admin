import { Page } from "@/types/pages";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ViewPageModalProps {
  isOpen: boolean;
  page: Page | null;
  onClose: () => void;
}

export function ViewPageModal({ isOpen, page, onClose }: ViewPageModalProps) {
  const { t } = useTranslation();

  if (!isOpen || !page) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-3">
            <CardTitle className="text-xl font-semibold">
              {page.title_ru || page.title_uz || page.title_en}
            </CardTitle>
            <Badge variant="secondary">/{page.slug}</Badge>
            <Badge variant="outline">Markdown</Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-6">
            {/* Page Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-medium text-gray-900">
                  {t("pages.updated")}
                </p>
                <p className="text-gray-600">
                  {new Date(page.updated_at).toLocaleString()}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-medium text-gray-900">{t("pages.slug")}</p>
                <p className="text-gray-600">/{page.slug}</p>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {t("pages.content")}
              </h3>
              <div className="prose max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900 prose-code:text-gray-800 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-100 prose-pre:text-gray-800">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {page.content_ru || page.content_uz || page.content_en}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
