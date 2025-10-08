import { Banner } from "@/types/banners";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  ExternalLink,
  Edit,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { memo } from "react";

interface BannerCardProps {
  banner: Banner;
  onEdit: (banner: Banner) => void;
  onDelete: (banner: Banner) => void;
}

export const BannerCard = memo(function BannerCard({
  banner,
  onEdit,
  onDelete,
}: BannerCardProps) {
  const { t } = useTranslation();

  const isExpired = banner.end_date && new Date(banner.end_date) < new Date();
  const isExpiringSoon =
    banner.end_date &&
    new Date(banner.end_date) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold line-clamp-2">
            {banner.title}
          </CardTitle>
          <div className="flex items-center gap-2">
            {isExpired && (
              <Badge variant="destructive" className="text-xs">
                {t("banners.expired")}
              </Badge>
            )}
            {isExpiringSoon && !isExpired && (
              <Badge variant="secondary" className="text-xs">
                {t("banners.expiringSoon")}
              </Badge>
            )}
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(banner)}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(banner)}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Banner Image */}
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
          {banner.image ? (
            <img
              src={banner.image}
              alt={banner.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <ImageIcon className="h-12 w-12 text-gray-400" />
            </div>
          )}
        </div>

        {/* Banner Details */}
        <div className="space-y-2">
          {banner.link && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ExternalLink className="h-4 w-4" />
              <a
                href={banner.link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 hover:underline"
              >
                {banner.link}
              </a>
            </div>
          )}

          {banner.end_date && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>
                {t("banners.expiresOn")}:{" "}
                {format(new Date(banner.end_date), "PPP")}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});
