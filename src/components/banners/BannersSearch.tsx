import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

interface BannersSearchProps {
  onCreateClick: () => void;
}

export function BannersSearch({ onCreateClick }: BannersSearchProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">
            {t("banners.title")}
          </CardTitle>
          <Button onClick={onCreateClick} className="gap-2">
            <Plus className="h-4 w-4" />
            {t("banners.createBanner")}
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
}
