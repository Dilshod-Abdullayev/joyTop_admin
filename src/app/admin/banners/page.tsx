"use client";

import { useState } from "react";
import { useBanners } from "@/lib/hooks/useBanners";
import { Banner, BannerRequest, BannerUpdateRequest } from "@/types/banners";
import {
  BannersList,
  BannersSearch,
  CreateBannerModal,
  EditBannerModal,
  DeleteBannerModal,
} from "@/components/banners";
import { useTranslation } from "react-i18next";

export default function BannersPage() {
  const { t } = useTranslation();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);

  const { banners, loading, error, createBanner, patchBanner, deleteBanner } =
    useBanners();

  const handleCreateBanner = async (data: BannerRequest) => {
    await createBanner(data);
  };

  const handleEditBanner = async (id: number, data: BannerUpdateRequest) => {
    await patchBanner(id, data);
  };

  const handleDeleteBanner = async (banner: Banner) => {
    await deleteBanner(banner.id);
  };

  const openEditModal = (banner: Banner) => {
    setSelectedBanner(banner);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (banner: Banner) => {
    setSelectedBanner(banner);
    setIsDeleteModalOpen(true);
  };

  const closeModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedBanner(null);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-32 bg-gray-200 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-64 bg-gray-200 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-600 mb-2">
            {t("common.error")}
          </h3>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BannersSearch onCreateClick={() => setIsCreateModalOpen(true)} />

      <BannersList
        banners={banners}
        onEdit={openEditModal}
        onDelete={openDeleteModal}
      />

      {/* Modals */}
      <CreateBannerModal
        isOpen={isCreateModalOpen}
        onClose={closeModals}
        onSubmit={handleCreateBanner}
      />

      <EditBannerModal
        isOpen={isEditModalOpen}
        banner={selectedBanner}
        onClose={closeModals}
        onSubmit={handleEditBanner}
      />

      <DeleteBannerModal
        isOpen={isDeleteModalOpen}
        banner={selectedBanner}
        onClose={closeModals}
        onConfirm={handleDeleteBanner}
      />
    </div>
  );
}
