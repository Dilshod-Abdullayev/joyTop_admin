"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { propertiesApi } from "@/lib/api/properties";
import {
  ArrowLeft,
  Save,
  X,
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  Home,
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  User,
  Image,
  Video,
  AlertCircle,
} from "lucide-react";

interface CreateFormData {
  title: string;
  description: string;
  category: number;
  transaction_type: string;
  price: {
    currency: string;
    amount: number;
  };
  specs: {
    furnished: boolean;
    area: number;
    age: number;
    air_conditioning: boolean;
    parking: boolean;
    built_in_kitchen: boolean;
    elevator: boolean;
    security: boolean;
    living_area: number;
    lot_area: number;
    ceiling_height: number;
    rooms: number;
    bedrooms: number;
    bathrooms: number;
    toilets: number;
    balconies: number;
    floor: number;
    total_floors: number;
    renovation: string;
    heating: string;
    hot_water: string;
    energy_efficiency: string;
    noise_level: string;
    garage: boolean;
  };
  features: number[];
  mortgage_available: boolean;
  nearby_list: string[];
  location: {
    city_id: number;
    district_id: number;
    building_number: string;
  };
  photos: string[];
  video: string;
  status: boolean;
}

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded-lg mb-6">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors rounded-t-lg"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {isOpen ? (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-500" />
          )}
        </div>
      </button>
      {isOpen && <div className="p-6">{children}</div>}
    </div>
  );
}

export default function CreatePropertyPage() {
  const { t, ready } = useTranslation();
  const router = useRouter();

  const [formData, setFormData] = useState<CreateFormData>({
    title: "",
    description: "",
    category: 0,
    transaction_type: "sale",
    price: {
      currency: "UZS",
      amount: 0,
    },
    specs: {
      furnished: false,
      area: 0,
      age: 0,
      air_conditioning: false,
      parking: false,
      built_in_kitchen: false,
      elevator: false,
      security: false,
      living_area: 0,
      lot_area: 0,
      ceiling_height: 0,
      rooms: 0,
      bedrooms: 0,
      bathrooms: 0,
      toilets: 0,
      balconies: 0,
      floor: 0,
      total_floors: 0,
      renovation: "",
      heating: "",
      hot_water: "",
      energy_efficiency: "",
      noise_level: "",
      garage: false,
    },
    features: [],
    mortgage_available: false,
    nearby_list: [],
    location: {
      city_id: 0,
      district_id: 0,
      building_number: "",
    },
    photos: [],
    video: "",
    status: true,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handlePriceChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      price: {
        ...formData.price,
        [field]: value,
      },
    });
  };

  const handleSpecsChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      specs: {
        ...formData.specs,
        [field]: value,
      },
    });
  };

  const handleLocationChange = (key: string, value: any) => {
    setFormData({
      ...formData,
      location: {
        ...formData.location,
        [key]: value,
      },
    });
  };

  const addNearbyAmenity = () => {
    setFormData({
      ...formData,
      nearby_list: [...formData.nearby_list, ""],
    });
  };

  const updateNearbyAmenity = (index: number, value: string) => {
    const newList = [...formData.nearby_list];
    newList[index] = value;
    setFormData({
      ...formData,
      nearby_list: newList,
    });
  };

  const removeNearbyAmenity = (index: number) => {
    const newList = formData.nearby_list.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      nearby_list: newList,
    });
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      setError(null);

      // Convert form data to the correct API format
      const submitData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        transaction_type: formData.transaction_type,
        price: {
          currency: formData.price.currency,
          amount: formData.price.amount,
        },
        mortgage_available: formData.mortgage_available,
        status: formData.status,
        specs: formData.specs,
        features: formData.features,
        nearby_list: formData.nearby_list,
        location: formData.location,
        photos: formData.photos,
        video: formData.video,
      };

      const createdProperty = await propertiesApi.createProperty(submitData);

      // Redirect to the created property's detail page
      router.push(`/admin/properties/${createdProperty.id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create property"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    router.push("/admin/properties");
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {ready ? t("properties.create.title") : "Создать объявление"}
            </h1>
            <p className="text-gray-600">
              {ready
                ? t("properties.create.description")
                : "Добавить новое объявление недвижимости"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleBack}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            {ready ? t("common.cancel") : "Отмена"}
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || !formData.title || !formData.description}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>{ready ? t("common.saving") : "Сохранение..."}</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{ready ? t("common.save") : "Сохранить"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Form Sections */}
      <div className="space-y-6">
        {/* Basic Information */}
        <CollapsibleSection title="Основная информация" defaultOpen={true}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {ready ? t("properties.form.title") : "Название"}
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={
                  ready
                    ? t("properties.form.titlePlaceholder")
                    : "Введите название объявления"
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {ready ? t("properties.form.transactionType") : "Тип сделки"}
              </label>
              <select
                value={formData.transaction_type}
                onChange={(e) =>
                  handleInputChange("transaction_type", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="sale">
                  {ready ? t("properties.transactionTypes.sale") : "Продажа"}
                </option>
                <option value="rent">
                  {ready ? t("properties.transactionTypes.rent") : "Аренда"}
                </option>
                <option value="exchange">
                  {ready ? t("properties.transactionTypes.exchange") : "Обмен"}
                </option>
              </select>
            </div>
          </div>
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {ready ? t("properties.form.description") : "Описание"}
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={
                ready
                  ? t("properties.form.descriptionPlaceholder")
                  : "Опишите недвижимость"
              }
            />
          </div>
        </CollapsibleSection>

        {/* Price Information */}
        <CollapsibleSection title="Цена" defaultOpen={true}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {ready ? t("properties.form.price") : "Цена"}
              </label>
              <input
                type="number"
                value={formData.price.amount}
                onChange={(e) =>
                  handlePriceChange("amount", parseFloat(e.target.value) || 0)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {ready ? t("properties.form.currency") : "Валюта"}
              </label>
              <select
                value={formData.price.currency}
                onChange={(e) => handlePriceChange("currency", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="UZS">UZS</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>
        </CollapsibleSection>

        {/* Location */}
        <CollapsibleSection title="Расположение">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {ready ? t("properties.form.city") : "Город"}
              </label>
              <input
                type="number"
                value={formData.location.city_id}
                onChange={(e) =>
                  handleLocationChange("city_id", parseInt(e.target.value) || 0)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ID города"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {ready ? t("properties.form.district") : "Район"}
              </label>
              <input
                type="number"
                value={formData.location.district_id}
                onChange={(e) =>
                  handleLocationChange(
                    "district_id",
                    parseInt(e.target.value) || 0
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ID района"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {ready ? t("properties.form.buildingNumber") : "Номер дома"}
              </label>
              <input
                type="text"
                value={formData.location.building_number}
                onChange={(e) =>
                  handleLocationChange("building_number", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Номер дома"
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* Specifications */}
        <CollapsibleSection title="Характеристики">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {ready ? t("properties.form.area") : "Площадь"}
              </label>
              <input
                type="number"
                value={formData.specs.area}
                onChange={(e) =>
                  handleSpecsChange("area", parseFloat(e.target.value) || 0)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {ready ? t("properties.form.rooms") : "Комнаты"}
              </label>
              <input
                type="number"
                value={formData.specs.rooms}
                onChange={(e) =>
                  handleSpecsChange("rooms", parseInt(e.target.value) || 0)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {ready ? t("properties.form.bedrooms") : "Спальни"}
              </label>
              <input
                type="number"
                value={formData.specs.bedrooms}
                onChange={(e) =>
                  handleSpecsChange("bedrooms", parseInt(e.target.value) || 0)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* Status */}
        <CollapsibleSection title="Статус">
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.status}
                onChange={(e) => handleInputChange("status", e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">
                {ready ? t("properties.form.active") : "Активное объявление"}
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.mortgage_available}
                onChange={(e) =>
                  handleInputChange("mortgage_available", e.target.checked)
                }
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">
                {ready
                  ? t("properties.form.mortgageAvailable")
                  : "Ипотека доступна"}
              </span>
            </label>
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
}
