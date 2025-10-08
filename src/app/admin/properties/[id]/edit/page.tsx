"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Property } from "@/types/properties";
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

interface EditFormData {
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
      {isOpen && <div className="p-6 bg-white rounded-b-lg">{children}</div>}
    </div>
  );
}

export default function PropertyEditPage() {
  const { t, ready } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const propertyId = Number(params.id);

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<EditFormData | null>(null);

  useEffect(() => {
    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await propertiesApi.getProperty(propertyId);
      setProperty(data);

      // Initialize form data
      setFormData({
        title: data.title,
        description: data.description,
        category: data.category.id,
        transaction_type: data.transaction_type,
        price: {
          currency: data.price.currency,
          amount: data.price.amount,
        },
        specs: {
          furnished: data.specs.furnished || false,
          area: data.specs.area || 0,
          age: data.specs.age || 0,
          air_conditioning: data.specs.air_conditioning || false,
          parking: data.specs.parking || false,
          built_in_kitchen: data.specs.built_in_kitchen || false,
          elevator: data.specs.elevator || false,
          security: data.specs.security || false,
          living_area: data.specs.living_area || 0,
          lot_area: data.specs.lot_area || 0,
          ceiling_height: data.specs.ceiling_height || 0,
          rooms: data.specs.rooms || 0,
          bedrooms: data.specs.bedrooms || 0,
          bathrooms: data.specs.bathrooms || 0,
          toilets: data.specs.toilets || 0,
          balconies: data.specs.balconies || 0,
          floor: data.specs.floor || 0,
          total_floors: data.specs.total_floors || 0,
          renovation: data.specs.renovation || "",
          heating: data.specs.heating || "",
          hot_water: data.specs.hot_water || "",
          energy_efficiency: data.specs.energy_efficiency || "",
          noise_level: data.specs.noise_level || "",
          garage: data.specs.garage || false,
        },
        features: data.features.map((f: any) => f.id),
        mortgage_available: data.mortgage_available,
        nearby_list: data.nearby_list || [],
        location: {
          city_id: data.location.city_id,
          district_id: data.location.district_id,
          building_number: data.location.building_number || "",
        },
        photos: data.photos || [],
        video: data.video || "",
        status: data.status,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch property");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    if (!formData) return;

    if (field.includes(".")) {
      const [section, key] = field.split(".");
      setFormData({
        ...formData,
        [section]: {
          ...(formData[section as keyof EditFormData] as any),
          [key]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [field]: value,
      });
    }
  };

  const handleSpecsChange = (key: string, value: any) => {
    if (!formData) return;
    setFormData({
      ...formData,
      specs: {
        ...formData.specs,
        [key]: value,
      },
    });
  };

  const handleLocationChange = (key: string, value: any) => {
    if (!formData) return;
    setFormData({
      ...formData,
      location: {
        ...formData.location,
        [key]: value,
      },
    });
  };

  const addNearbyAmenity = () => {
    if (!formData) return;
    setFormData({
      ...formData,
      nearby_list: [...formData.nearby_list, ""],
    });
  };

  const updateNearbyAmenity = (index: number, value: string) => {
    if (!formData) return;
    const newList = [...formData.nearby_list];
    newList[index] = value;
    setFormData({
      ...formData,
      nearby_list: newList,
    });
  };

  const removeNearbyAmenity = (index: number) => {
    if (!formData) return;
    const newList = formData.nearby_list.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      nearby_list: newList,
    });
  };

  const handleSubmit = async () => {
    if (!formData) return;

    try {
      setSaving(true);
      setError(null);

      // Convert form data to the correct API format
      const submitData = {
        title: formData.title,
        description: formData.description,
        category: {
          id: formData.category,
          name: "", // API will fill this
        },
        transaction_type: formData.transaction_type,
        price: {
          currency: formData.price.currency,
          amount: formData.price.amount,
        },
        mortgage_available: formData.mortgage_available,
        status: formData.status,

        // Specs
        specs: {
          furnished: formData.specs.furnished,
          area: formData.specs.area,
          age: formData.specs.age,
          air_conditioning: formData.specs.air_conditioning,
          parking: formData.specs.parking,
          built_in_kitchen: formData.specs.built_in_kitchen,
          elevator: formData.specs.elevator,
          security: formData.specs.security,
          living_area: formData.specs.living_area,
          lot_area: formData.specs.lot_area,
          ceiling_height: formData.specs.ceiling_height,
          rooms: formData.specs.rooms,
          bedrooms: formData.specs.bedrooms,
          bathrooms: formData.specs.bathrooms,
          toilets: formData.specs.toilets,
          balconies: formData.specs.balconies,
          floor: formData.specs.floor,
          total_floors: formData.specs.total_floors,
          renovation: formData.specs.renovation,
          heating: formData.specs.heating,
          hot_water: formData.specs.hot_water,
          energy_efficiency: formData.specs.energy_efficiency,
          noise_level: formData.specs.noise_level,
          garage: formData.specs.garage,
        },

        // Features as objects with IDs
        features: formData.features.map((featureId) => ({
          id: featureId,
          name: "", // API will fill this
        })),

        // Nearby amenities
        nearby_list: formData.nearby_list.filter((amenity) => amenity.trim()),

        // Location
        location: {
          city_id: formData.location.city_id,
          city_name: "", // API will fill this
          district_id: formData.location.district_id,
          district: "", // API will fill this
          building_number: formData.location.building_number,
        },

        // Photos and video
        photos: formData.photos,
        video: formData.video || null,
      };

      // Debug logging
      console.log("Submitting data:", submitData);
      console.log("Data type:", typeof submitData);
      console.log("Is object:", submitData instanceof Object);

      await propertiesApi.updateProperty(propertyId, submitData);
      router.push(`/admin/properties/${propertyId}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update property"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    router.push(`/admin/properties/${propertyId}`);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-96 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (error || !property || !formData) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 mb-2">
            <AlertCircle className="mx-auto h-12 w-12" />
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            {ready ? t("properties.details.loadingError") : "Ошибка загрузки"}
          </h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={handleBack}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {ready ? t("properties.details.backToList") : "Назад"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBack}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {ready ? t("properties.edit.title") : "Редактировать объявление"}
            </h1>
            <p className="text-gray-600 mt-1">
              ID: {property.id} • {property.title}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="w-5 h-5 mr-2" />
            {saving
              ? ready
                ? t("properties.edit.saving")
                : "Сохранение..."
              : ready
              ? t("properties.edit.save")
              : "Сохранить"}
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="space-y-6">
        {/* Basic Information Section */}
        <CollapsibleSection
          title={ready ? t("properties.edit.basicInfo") : "Основная информация"}
          defaultOpen={true}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {ready ? t("properties.edit.title") : "Название"}
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={
                  ready
                    ? t("properties.edit.titlePlaceholder")
                    : "Введите название объявления"
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {ready ? t("properties.edit.category") : "Категория"}
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  handleInputChange("category", Number(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={1}>
                  {ready ? t("properties.edit.categories.houses") : "Дома"}
                </option>
                <option value={2}>
                  {ready ? t("properties.edit.categories.offices") : "Офисы"}
                </option>
                <option value={4}>
                  {ready
                    ? t("properties.edit.categories.land")
                    : "Земельные участки"}
                </option>
                <option value={6}>
                  {ready
                    ? t("properties.edit.categories.rentalHouses")
                    : "Дома для аренды"}
                </option>
                <option value={7}>
                  {ready
                    ? t("properties.edit.categories.rentalVillas")
                    : "Виллы для аренды"}
                </option>
                <option value={8}>
                  {ready
                    ? t("properties.edit.categories.saleApartments")
                    : "Квартиры для продажи"}
                </option>
                <option value={9}>
                  {ready
                    ? t("properties.edit.categories.commercial")
                    : "Коммерческие здания"}
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {ready ? t("properties.edit.transactionType") : "Тип сделки"}
              </label>
              <select
                value={formData.transaction_type}
                onChange={(e) =>
                  handleInputChange("transaction_type", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="sale">
                  {ready
                    ? t("properties.edit.transactionTypes.sale")
                    : "Продажа"}
                </option>
                <option value="rent">
                  {ready
                    ? t("properties.edit.transactionTypes.rent")
                    : "Аренда"}
                </option>
                <option value="exchange">
                  {ready
                    ? t("properties.edit.transactionTypes.exchange")
                    : "Обмен"}
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {ready ? t("properties.edit.price") : "Цена"}
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={formData.price.amount}
                  onChange={(e) =>
                    handleInputChange("price.amount", Number(e.target.value))
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
                <select
                  value={formData.price.currency}
                  onChange={(e) =>
                    handleInputChange("price.currency", e.target.value)
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="UZS">UZS</option>
                  <option value="RUB">RUB</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {ready ? t("properties.edit.description") : "Описание"}
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={
                ready
                  ? t("properties.edit.descriptionPlaceholder")
                  : "Подробное описание недвижимости..."
              }
            />
          </div>

          <div className="mt-6 flex items-center space-x-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.mortgage_available}
                onChange={(e) =>
                  handleInputChange("mortgage_available", e.target.checked)
                }
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                {ready
                  ? t("properties.edit.mortgageAvailable")
                  : "Ипотека доступна"}
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.status}
                onChange={(e) => handleInputChange("status", e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                {ready ? t("properties.edit.active") : "Активно"}
              </span>
            </label>
          </div>
        </CollapsibleSection>

        {/* Specifications Section */}
        <CollapsibleSection
          title={ready ? t("properties.edit.specifications") : "Характеристики"}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {ready ? t("properties.specs.area") : "Общая площадь (м²)"}
              </label>
              <input
                type="number"
                value={formData.specs.area}
                onChange={(e) =>
                  handleSpecsChange("area", Number(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {ready
                  ? t("properties.specs.livingArea")
                  : "Жилая площадь (м²)"}
              </label>
              <input
                type="number"
                value={formData.specs.living_area}
                onChange={(e) =>
                  handleSpecsChange("living_area", Number(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {ready ? t("properties.specs.lotArea") : "Площадь участка (м²)"}
              </label>
              <input
                type="number"
                value={formData.specs.lot_area}
                onChange={(e) =>
                  handleSpecsChange("lot_area", Number(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {ready ? t("properties.specs.rooms") : "Количество комнат"}
              </label>
              <input
                type="number"
                value={formData.specs.rooms}
                onChange={(e) =>
                  handleSpecsChange("rooms", Number(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {ready ? t("properties.specs.bedrooms") : "Спальни"}
              </label>
              <input
                type="number"
                value={formData.specs.bedrooms}
                onChange={(e) =>
                  handleSpecsChange("bedrooms", Number(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {ready ? t("properties.specs.bathrooms") : "Ванные"}
              </label>
              <input
                type="number"
                value={formData.specs.bathrooms}
                onChange={(e) =>
                  handleSpecsChange("bathrooms", Number(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {ready ? t("properties.specs.floor") : "Этаж"}
              </label>
              <input
                type="number"
                value={formData.specs.floor}
                onChange={(e) =>
                  handleSpecsChange("floor", Number(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {ready ? t("properties.specs.totalFloors") : "Всего этажей"}
              </label>
              <input
                type="number"
                value={formData.specs.total_floors}
                onChange={(e) =>
                  handleSpecsChange("total_floors", Number(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {ready ? t("properties.specs.age") : "Возраст (лет)"}
              </label>
              <input
                type="number"
                value={formData.specs.age}
                onChange={(e) =>
                  handleSpecsChange("age", Number(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {ready ? t("properties.specs.renovation") : "Ремонт"}
              </label>
              <select
                value={formData.specs.renovation}
                onChange={(e) =>
                  handleSpecsChange("renovation", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">
                  {ready ? t("properties.edit.notSpecified") : "Не указано"}
                </option>
                <option value="none">
                  {ready
                    ? t("properties.edit.renovationTypes.none")
                    : "Без ремонта"}
                </option>
                <option value="cosmetic">
                  {ready
                    ? t("properties.edit.renovationTypes.cosmetic")
                    : "Косметический"}
                </option>
                <option value="capital">
                  {ready
                    ? t("properties.edit.renovationTypes.capital")
                    : "Капитальный"}
                </option>
                <option value="euro">
                  {ready
                    ? t("properties.edit.renovationTypes.euro")
                    : "Евроремонт"}
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {ready ? t("properties.specs.heating") : "Отопление"}
              </label>
              <select
                value={formData.specs.heating}
                onChange={(e) => handleSpecsChange("heating", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">
                  {ready ? t("properties.edit.notSpecified") : "Не указано"}
                </option>
                <option value="none">
                  {ready ? t("properties.edit.heatingTypes.none") : "Нет"}
                </option>
                <option value="gas">
                  {ready ? t("properties.edit.heatingTypes.gas") : "Газовое"}
                </option>
                <option value="electric">
                  {ready
                    ? t("properties.edit.heatingTypes.electric")
                    : "Электрическое"}
                </option>
                <option value="central">
                  {ready
                    ? t("properties.edit.heatingTypes.central")
                    : "Центральное"}
                </option>
              </select>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.specs.furnished}
                onChange={(e) =>
                  handleSpecsChange("furnished", e.target.checked)
                }
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                {ready ? t("properties.specs.furnished") : "Меблировано"}
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.specs.air_conditioning}
                onChange={(e) =>
                  handleSpecsChange("air_conditioning", e.target.checked)
                }
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                {ready ? t("properties.specs.airConditioning") : "Кондиционер"}
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.specs.parking}
                onChange={(e) => handleSpecsChange("parking", e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                {ready ? t("properties.specs.parking") : "Парковка"}
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.specs.elevator}
                onChange={(e) =>
                  handleSpecsChange("elevator", e.target.checked)
                }
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                {ready ? t("properties.specs.elevator") : "Лифт"}
              </span>
            </label>
          </div>
        </CollapsibleSection>

        {/* Features Section */}
        <CollapsibleSection
          title={ready ? t("properties.edit.features") : "Особенности"}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              {
                id: 1,
                name: ready
                  ? t("properties.edit.featureNames.kitchen")
                  : "Кухня",
              },
              {
                id: 2,
                name: ready
                  ? t("properties.edit.featureNames.garage")
                  : "Гараж",
              },
              {
                id: 3,
                name: ready ? t("properties.edit.featureNames.garden") : "Сад",
              },
              {
                id: 4,
                name: ready
                  ? t("properties.edit.featureNames.pool")
                  : "Бассейн",
              },
              {
                id: 5,
                name: ready
                  ? t("properties.edit.featureNames.terrace")
                  : "Терраса/Балкон",
              },
              {
                id: 6,
                name: ready
                  ? t("properties.edit.featureNames.security")
                  : "Безопасность",
              },
              {
                id: 7,
                name: ready
                  ? t("properties.edit.featureNames.elevator")
                  : "Лифт",
              },
              {
                id: 8,
                name: ready
                  ? t("properties.edit.featureNames.fireplace")
                  : "Камин",
              },
              {
                id: 9,
                name: ready
                  ? t("properties.edit.featureNames.storage")
                  : "Склад",
              },
              {
                id: 10,
                name: ready
                  ? t("properties.edit.featureNames.laundry")
                  : "Прачечная",
              },
              {
                id: 11,
                name: ready
                  ? t("properties.edit.featureNames.playground")
                  : "Детская площадка",
              },
              {
                id: 12,
                name: ready
                  ? t("properties.edit.featureNames.internet")
                  : "Интернет",
              },
              {
                id: 13,
                name: ready
                  ? t("properties.edit.featureNames.solarPanels")
                  : "Солнечные панели",
              },
              {
                id: 14,
                name: ready
                  ? t("properties.edit.featureNames.disabledAccess")
                  : "Доступ для инвалидов",
              },
              {
                id: 15,
                name: ready
                  ? t("properties.edit.featureNames.petsAllowed")
                  : "Разрешены животные",
              },
            ].map((feature) => (
              <label key={feature.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.features.includes(feature.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      handleInputChange("features", [
                        ...formData.features,
                        feature.id,
                      ]);
                    } else {
                      handleInputChange(
                        "features",
                        formData.features.filter((id) => id !== feature.id)
                      );
                    }
                  }}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {feature.name}
                </span>
              </label>
            ))}
          </div>
        </CollapsibleSection>

        {/* Location Section */}
        <CollapsibleSection
          title={ready ? t("properties.edit.location") : "Расположение"}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {ready ? t("properties.edit.city") : "Город"}
              </label>
              <select
                value={formData.location.city_id}
                onChange={(e) =>
                  handleLocationChange("city_id", Number(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={7}>
                  {ready ? t("properties.edit.cities.tashkent") : "Ташкент"}
                </option>
                <option value={8}>
                  {ready ? t("properties.edit.cities.samarkand") : "Самарканд"}
                </option>
                <option value={10}>
                  {ready ? t("properties.edit.cities.khorezm") : "Хорезм"}
                </option>
                <option value={12}>
                  {ready ? t("properties.edit.cities.bukhara") : "Бухара"}
                </option>
                <option value={16}>
                  {ready ? t("properties.edit.cities.jizzakh") : "Джизак"}
                </option>
                <option value={18}>
                  {ready
                    ? t("properties.edit.cities.tashkentRegion")
                    : "Ташкентская область"}
                </option>
                <option value={19}>
                  {ready
                    ? t("properties.edit.cities.tashkentCity")
                    : "Ташкент (город)"}
                </option>
                <option value={20}>
                  {ready ? t("properties.edit.cities.namangan") : "Наманган"}
                </option>
                <option value={22}>
                  {ready ? t("properties.edit.cities.andijan") : "Андижан"}
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {ready ? t("properties.edit.district") : "Район"}
              </label>
              <input
                type="text"
                value={formData.location.district_id}
                onChange={(e) =>
                  handleLocationChange("district_id", Number(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={
                  ready ? t("properties.edit.districtPlaceholder") : "ID района"
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {ready ? t("properties.edit.buildingNumber") : "Номер дома"}
              </label>
              <input
                type="text"
                value={formData.location.building_number}
                onChange={(e) =>
                  handleLocationChange("building_number", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={
                  ready
                    ? t("properties.edit.buildingNumberPlaceholder")
                    : "Например: 123"
                }
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {ready
                ? t("properties.edit.nearbyAmenities")
                : "Рядом расположены"}
            </label>
            <div className="space-y-2">
              {formData.nearby_list.map((amenity, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={amenity}
                    onChange={(e) => updateNearbyAmenity(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={
                      ready
                        ? t("properties.edit.amenityPlaceholder")
                        : "Например: Школа, Магазин"
                    }
                  />
                  <button
                    type="button"
                    onClick={() => removeNearbyAmenity(index)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addNearbyAmenity}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                {ready ? t("properties.edit.add") : "Добавить"}
              </button>
            </div>
          </div>
        </CollapsibleSection>

        {/* Media Section */}
        <CollapsibleSection
          title={ready ? t("properties.edit.media") : "Медиа файлы"}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {ready ? t("properties.edit.photos") : "Фотографии"}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.photos.map((photo, index) => (
                <div key={index} className="relative">
                  <img
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newPhotos = formData.photos.filter(
                        (_, i) => i !== index
                      );
                      handleInputChange("photos", newPhotos);
                    }}
                    className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {ready ? t("properties.edit.video") : "Видео URL"}
            </label>
            <input
              type="url"
              value={formData.video}
              onChange={(e) => handleInputChange("video", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={
                ready
                  ? t("properties.edit.videoPlaceholder")
                  : "https://example.com/video.mp4"
              }
            />
          </div>
        </CollapsibleSection>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}
    </div>
  );
}
