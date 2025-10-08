"use client";

import { useState } from "react";
import { Page } from "@/types/pages";
import { usePages } from "@/lib/hooks/usePages";
import { useDebounce } from "@/lib/hooks/useDebounce";
import {
  PagesList,
  CreatePageModal,
  EditPageModal,
  DeletePageModal,
  ViewPageModal,
} from "@/components/pages";
import { useTranslation } from "react-i18next";

export default function AdminPagesPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);

  const { data, loading, error, createPage, updatePage, deletePage } = usePages(
    {
      search: debouncedSearch,
    }
  );

  const handleCreate = async (pageData: any) => {
    try {
      await createPage(pageData);
      setCreateModalOpen(false);
    } catch (error) {
      console.error("Failed to create page:", error);
    }
  };

  const handleEdit = async (id: number, pageData: any) => {
    try {
      await updatePage(id, pageData);
      setEditModalOpen(false);
      setSelectedPage(null);
    } catch (error) {
      console.error("Failed to update page:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePage(id);
      setDeleteModalOpen(false);
      setSelectedPage(null);
    } catch (error) {
      console.error("Failed to delete page:", error);
    }
  };

  const openEditModal = (page: Page) => {
    setSelectedPage(page);
    setEditModalOpen(true);
  };

  const openDeleteModal = (page: Page) => {
    setSelectedPage(page);
    setDeleteModalOpen(true);
  };

  const openViewModal = (page: Page) => {
    setSelectedPage(page);
    setViewModalOpen(true);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-red-600 mb-2">
            {t("common.error")}
          </h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t("pages.title")}
          </h1>
          <p className="text-gray-600 mt-1">{t("pages.description")}</p>
        </div>
      </div>

      {/* Pages List */}
      <PagesList
        pages={data}
        loading={loading}
        onEdit={openEditModal}
        onDelete={openDeleteModal}
        onView={openViewModal}
        onCreate={() => setCreateModalOpen(true)}
        onSearch={setSearchQuery}
      />

      {/* Modals */}
      <CreatePageModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreate}
      />

      <EditPageModal
        isOpen={editModalOpen}
        page={selectedPage}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedPage(null);
        }}
        onSubmit={handleEdit}
      />

      <DeletePageModal
        isOpen={deleteModalOpen}
        page={selectedPage}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedPage(null);
        }}
        onConfirm={handleDelete}
      />

      <ViewPageModal
        isOpen={viewModalOpen}
        page={selectedPage}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedPage(null);
        }}
      />
    </div>
  );
}
