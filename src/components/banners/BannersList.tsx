import { Banner } from "@/types/banners";
import { BannerCard } from "./BannerCard";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { Image as ImageIcon } from "lucide-react";

interface BannersListProps {
  banners: Banner[];
  onEdit: (banner: Banner) => void;
  onDelete: (banner: Banner) => void;
}

export function BannersList({ banners, onEdit, onDelete }: BannersListProps) {
  const { t } = useTranslation();

  // Debug: Log banners to check for duplicate IDs
  console.log(
    "BannersList - banners:",
    banners.map((b) => ({ id: b.id, title: b.title }))
  );

  if (banners.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            {t("banners.noBanners")}
          </h3>
          <p className="text-sm text-gray-500 text-center max-w-md">
            {t("banners.noBannersDescription")}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {banners.map((banner, index) => {
        // Create a stable key using banner properties
        const stableKey = banner.id
          ? `banner-${banner.id}`
          : `banner-temp-${index}`;
        return (
          <BannerCard
            key={stableKey}
            banner={banner}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        );
      })}
    </div>
  );
}
