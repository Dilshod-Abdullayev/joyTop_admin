"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Property } from "@/types/properties";
import { propertiesApi } from "@/lib/api/properties";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Eye,
  Heart,
  Share2,
  MapPin,
  Home,
  DollarSign,
  Calendar,
  User,
  Building2,
  Car,
  Shield,
  Wifi,
  Phone,
  Mail,
  Globe,
} from "lucide-react";
import i18n from "@/lib/i18n";

export default function PropertyDetailsPage() {
  const { t, ready } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const propertyId = Number(params.id);

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId, i18n.language]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await propertiesApi.getProperty(propertyId);
      setProperty(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch property");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/admin/properties");
  };

  const handleEdit = () => {
    if (property) {
      router.push(`/admin/properties/${property.id}/edit`);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this property?")) {
      try {
        await propertiesApi.deleteProperty(propertyId);
        router.push("/admin/properties");
      } catch (err) {
        console.error("Failed to delete property:", err);
      }
    }
  };

  const formatPrice = (amount: number, currency: string) => {
    if (currency === "UZS") {
      return `${(amount / 1000000).toFixed(1)}M UZS`;
    }
    return `${currency} ${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getTransactionTypeLabel = (type: string) => {
    switch (type.toLowerCase()) {
      case "sale":
        return ready ? t("properties.transactionTypes.sale") : "Продажа";
      case "rent":
      case "ijaraga berish":
        return ready ? t("properties.transactionTypes.rent") : "Аренда";
      case "exchange":
        return ready ? t("properties.transactionTypes.exchange") : "Обмен";
      case "sotish":
        return ready ? t("properties.transactionTypes.sale") : "Продажа";
      default:
        return type;
    }
  };

  const getStatusLabel = (status: boolean) => {
    return status
      ? ready
        ? t("properties.status.active")
        : "Активно"
      : ready
      ? t("properties.status.inactive")
      : "Неактивно";
  };

  const getStatusColor = (status: boolean) => {
    return status
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-gray-100 text-gray-800 border-gray-200";
  };

  const handleToggleStatus = async () => {
    if (!property) return;
    try {
      setLoading(true);
      await propertiesApi.updateProperty(property.id, {
        status: !(property.status ?? true),
      });
      setProperty({ ...property, status: !(property.status ?? true) });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : ready
          ? t("properties.details.statusUpdateError")
          : "Ошибка обновления статуса"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-96 bg-gray-200 rounded-xl"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 mb-2">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
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
            {ready ? t("properties.details.backToList") : "Назад к списку"}
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
              {property.title}
            </h1>
            <p className="text-gray-600 mt-1">
              ID: {property.id} •{" "}
              {getTransactionTypeLabel(property.transaction_type)}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
              property.status ?? true
            )}`}
          >
            {getStatusLabel(property.status ?? true)}
          </span>
          <button
            onClick={handleToggleStatus}
            className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-lg transition-colors ${
              property.status ?? true
                ? "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                : "border-green-300 text-green-700 bg-white hover:bg-green-50"
            }`}
            aria-label={
              property.status ?? true
                ? ready
                  ? t("properties.actions.deactivate")
                  : "Деактивировать"
                : ready
                ? t("properties.actions.activate")
                : "Активировать"
            }
            disabled={loading}
          >
            <Shield className="w-4 h-4 mr-2" />
            {property.status ?? true
              ? ready
                ? t("properties.actions.deactivate")
                : "Деактивировать"
              : ready
              ? t("properties.actions.activate")
              : "Активировать"}
          </button>
          <button
            onClick={handleDelete}
            className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-lg text-red-700 bg-white hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {ready ? t("properties.actions.delete") : "Удалить"}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Photo Gallery */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="relative h-96 bg-gray-100">
              {property.photos && property.photos.length > 0 ? (
                <>
                  <img
                    src={property.photos[currentPhotoIndex]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Photo Navigation */}
                  {property.photos.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {property.photos.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentPhotoIndex(index)}
                          className={`w-3 h-3 rounded-full ${
                            index === currentPhotoIndex
                              ? "bg-white"
                              : "bg-white/50"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Home className="w-24 h-24" />
                </div>
              )}
            </div>

            {/* Photo Thumbnails */}
            {property.photos && property.photos.length > 1 && (
              <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-2 overflow-x-auto">
                  {property.photos.map((photo, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPhotoIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        index === currentPhotoIndex
                          ? "border-blue-500"
                          : "border-gray-200"
                      }`}
                    >
                      <img
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {ready ? t("properties.details.description") : "Описание"}
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {property.description}
            </p>
          </div>

          {/* Specifications */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {ready
                ? t("properties.details.specifications")
                : "Характеристики"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {property.specs?.area && (
                <div className="flex items-center space-x-3">
                  <Building2 className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">
                    <span className="font-medium">
                      {ready ? t("properties.specs.area") : "Площадь"}:
                    </span>{" "}
                    {property.specs?.area}{" "}
                    {ready ? t("properties.specs.squareMeters") : "м²"}
                  </span>
                </div>
              )}
              {property.specs?.living_area && (
                <div className="flex items-center space-x-3">
                  <Home className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">
                    <span className="font-medium">
                      {ready
                        ? t("properties.specs.livingArea")
                        : "Жилая площадь"}
                      :
                    </span>{" "}
                    {property.specs?.living_area}{" "}
                    {ready ? t("properties.specs.squareMeters") : "м²"}
                  </span>
                </div>
              )}
              {property.specs?.lot_area && (
                <div className="flex items-center space-x-3">
                  <Building2 className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">
                    <span className="font-medium">
                      {ready
                        ? t("properties.specs.lotArea")
                        : "Площадь участка"}
                      :
                    </span>{" "}
                    {property.specs?.lot_area}{" "}
                    {ready ? t("properties.specs.squareMeters") : "м²"}
                  </span>
                </div>
              )}
              {property.specs?.rooms && (
                <div className="flex items-center space-x-3">
                  <Home className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">
                    <span className="font-medium">
                      {ready ? t("properties.specs.rooms") : "Комнаты"}:
                    </span>{" "}
                    {property.specs?.rooms}
                  </span>
                </div>
              )}
              {property.specs?.bedrooms && (
                <div className="flex items-center space-x-3">
                  <Home className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">
                    <span className="font-medium">
                      {ready ? t("properties.specs.bedrooms") : "Спальни"}:
                    </span>{" "}
                    {property.specs?.bedrooms}
                  </span>
                </div>
              )}
              {property.specs?.bathrooms && (
                <div className="flex items-center space-x-3">
                  <Home className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">
                    <span className="font-medium">
                      {ready ? t("properties.specs.bathrooms") : "Ванные"}:
                    </span>{" "}
                    {property.specs?.bathrooms}
                  </span>
                </div>
              )}
              {property.specs?.toilets && (
                <div className="flex items-center space-x-3">
                  <Home className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">
                    <span className="font-medium">
                      {ready ? t("properties.specs.toilets") : "Туалеты"}:
                    </span>{" "}
                    {property.specs?.toilets}
                  </span>
                </div>
              )}
              {property.specs?.balconies && (
                <div className="flex items-center space-x-3">
                  <Home className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">
                    <span className="font-medium">
                      {ready ? t("properties.specs.balconies") : "Балконы"}:
                    </span>{" "}
                    {property.specs?.balconies}
                  </span>
                </div>
              )}
              {property.specs?.floor && (
                <div className="flex items-center space-x-3">
                  <Building2 className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">
                    <span className="font-medium">
                      {ready ? t("properties.specs.floor") : "Этаж"}:
                    </span>{" "}
                    {property.specs?.floor}
                    {property.specs?.total_floors &&
                      ` ${ready ? t("properties.specs.totalFloors") : "из"} ${
                        property.specs?.total_floors
                      }`}
                  </span>
                </div>
              )}
              {property.specs?.age && (
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">
                    <span className="font-medium">
                      {ready ? t("properties.specs.age") : "Возраст"}:
                    </span>{" "}
                    {property.specs?.age}{" "}
                    {ready ? t("properties.specs.years") : "лет"}
                  </span>
                </div>
              )}
              {property.specs?.ceiling_height && (
                <div className="flex items-center space-x-3">
                  <Building2 className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">
                    <span className="font-medium">
                      {ready
                        ? t("properties.specs.ceilingHeight")
                        : "Высота потолков"}
                      :
                    </span>{" "}
                    {property.specs?.ceiling_height}{" "}
                    {ready ? t("properties.specs.meters") : "м"}
                  </span>
                </div>
              )}
            </div>

            {/* Additional Specifications */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                {ready
                  ? t("properties.details.additionalSpecs")
                  : "Дополнительные характеристики"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.specs?.furnished !== undefined && (
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 text-gray-400">🏠</div>
                    <span className="text-gray-700">
                      <span className="font-medium">
                        {ready
                          ? t("properties.specs.furnished")
                          : "Меблировано"}
                        :
                      </span>{" "}
                      {property.specs?.furnished
                        ? ready
                          ? t("properties.specs.yes")
                          : "Да"
                        : ready
                        ? t("properties.specs.no")
                        : "Нет"}
                    </span>
                  </div>
                )}
                {property.specs?.air_conditioning !== undefined && (
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 text-gray-400">❄️</div>
                    <span className="text-gray-700">
                      <span className="font-medium">
                        {ready
                          ? t("properties.specs.airConditioning")
                          : "Кондиционер"}
                        :
                      </span>{" "}
                      {property.specs?.air_conditioning
                        ? ready
                          ? t("properties.specs.yes")
                          : "Да"
                        : ready
                        ? t("properties.specs.no")
                        : "Нет"}
                    </span>
                  </div>
                )}
                {property.specs?.parking !== undefined && (
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 text-gray-400">🚗</div>
                    <span className="text-gray-700">
                      <span className="font-medium">
                        {ready ? t("properties.specs.parking") : "Парковка"}:
                      </span>{" "}
                      {property.specs?.parking
                        ? ready
                          ? t("properties.specs.yes")
                          : "Да"
                        : ready
                        ? t("properties.specs.no")
                        : "Нет"}
                    </span>
                  </div>
                )}
                {property.specs?.built_in_kitchen !== undefined && (
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 text-gray-400">🍳</div>
                    <span className="text-gray-700">
                      <span className="font-medium">
                        {ready
                          ? t("properties.specs.builtInKitchen")
                          : "Встроенная кухня"}
                        :
                      </span>{" "}
                      {property.specs?.built_in_kitchen
                        ? ready
                          ? t("properties.specs.yes")
                          : "Да"
                        : ready
                        ? t("properties.specs.no")
                        : "Нет"}
                    </span>
                  </div>
                )}
                {property.specs?.elevator !== undefined && (
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 text-gray-400">🛗</div>
                    <span className="text-gray-700">
                      <span className="font-medium">
                        {ready ? t("properties.specs.elevator") : "Лифт"}:
                      </span>{" "}
                      {property.specs?.elevator
                        ? ready
                          ? t("properties.specs.yes")
                          : "Да"
                        : ready
                        ? t("properties.specs.no")
                        : "Нет"}
                    </span>
                  </div>
                )}
                {property.specs?.security !== undefined && (
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 text-gray-400">🔒</div>
                    <span className="text-gray-700">
                      <span className="font-medium">
                        {ready ? t("properties.specs.security") : "Охрана"}:
                      </span>{" "}
                      {property.specs?.security
                        ? ready
                          ? t("properties.specs.yes")
                          : "Да"
                        : ready
                        ? t("properties.specs.no")
                        : "Нет"}
                    </span>
                  </div>
                )}
                {property.specs?.garage !== undefined && (
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 text-gray-400">🏚️</div>
                    <span className="text-gray-700">
                      <span className="font-medium">
                        {ready ? t("properties.specs.garage") : "Гараж"}:
                      </span>{" "}
                      {property.specs?.garage
                        ? ready
                          ? t("properties.specs.yes")
                          : "Да"
                        : ready
                        ? t("properties.specs.no")
                        : "Нет"}
                    </span>
                  </div>
                )}
              </div>

              {/* Text-based specifications */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.specs?.renovation && (
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 text-gray-400">🔨</div>
                    <span className="text-gray-700">
                      <span className="font-medium">
                        {ready ? t("properties.specs.renovation") : "Ремонт"}:
                      </span>{" "}
                      {property.specs?.renovation}
                    </span>
                  </div>
                )}
                {property.specs?.heating && (
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 text-gray-400">🔥</div>
                    <span className="text-gray-700">
                      <span className="font-medium">
                        {ready ? t("properties.specs.heating") : "Отопление"}:
                      </span>{" "}
                      {property.specs?.heating}
                    </span>
                  </div>
                )}
                {property.specs?.hot_water && (
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 text-gray-400">💧</div>
                    <span className="text-gray-700">
                      <span className="font-medium">
                        {ready
                          ? t("properties.specs.hotWater")
                          : "Горячая вода"}
                        :
                      </span>{" "}
                      {property.specs?.hot_water}
                    </span>
                  </div>
                )}
                {property.specs?.energy_efficiency && (
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 text-gray-400">⚡</div>
                    <span className="text-gray-700">
                      <span className="font-medium">
                        {ready
                          ? t("properties.specs.energyEfficiency")
                          : "Энергоэффективность"}
                        :
                      </span>{" "}
                      {property.specs?.energy_efficiency}
                    </span>
                  </div>
                )}
                {property.specs?.noise_level && (
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 text-gray-400">🔊</div>
                    <span className="text-gray-700">
                      <span className="font-medium">
                        {ready
                          ? t("properties.specs.noiseLevel")
                          : "Уровень шума"}
                        :
                      </span>{" "}
                      {property.specs?.noise_level}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Features */}
          {property.features && property.features.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {ready ? t("properties.details.features") : "Особенности"}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {property.features.map((feature) => (
                  <div
                    key={feature.id}
                    className="flex items-center space-x-2 text-gray-700"
                  >
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>{feature.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nearby Amenities */}
          {property.nearby_list && property.nearby_list.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {ready
                  ? t("properties.details.nearbyAmenities")
                  : "Рядом расположены"}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {property.nearby_list.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 text-gray-700"
                  >
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Price Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {ready ? t("properties.details.price") : "Цена"}
            </h3>
            <div className="text-3xl font-bold text-green-600 mb-2">
              {formatPrice(property.price.amount, property.price.currency)}
            </div>
            <div className="text-sm text-gray-500">
              {getTransactionTypeLabel(property.transaction_type)}
            </div>
            {property.mortgage_available && (
              <div className="mt-3 text-sm text-blue-600">
                ✓{" "}
                {ready
                  ? t("properties.details.mortgageAvailable")
                  : "Ипотека доступна"}
              </div>
            )}
          </div>

          {/* Owner Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {ready ? t("properties.details.owner") : "Владелец"}
            </h3>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">
                  {property.user_data?.name}
                </div>
                <div className="text-sm text-gray-500">
                  ID: {property.user_data?.id}
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {ready ? t("properties.details.location") : "Расположение"}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">{property.location.city}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Building2 className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">
                  {property.location.district}
                </span>
              </div>
              {property.location.building_number && (
                <div className="flex items-center space-x-3">
                  <Home className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">
                    Дом {property.location.building_number}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {ready ? t("properties.details.statistics") : "Статистика"}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">
                    {ready ? t("properties.metrics.views") : "Просмотры"}
                  </span>
                </div>
                <span className="font-medium">{property.view_count ?? 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">
                    {ready ? t("properties.metrics.favorites") : "В избранном"}
                  </span>
                </div>
                <span className="font-medium">
                  {property.favorite_count ?? 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Share2 className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">
                    {ready ? t("properties.metrics.shares") : "Поделились"}
                  </span>
                </div>
                <span className="font-medium">{property.share_count ?? 0}</span>
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {ready ? t("properties.details.propertyDetails") : "Детали"}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">
                  {ready ? t("properties.filters.category") : "Категория"}
                </span>
                <span className="font-medium">{property.category.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">
                  {ready ? t("properties.filters.city") : "Город"}
                </span>
                <span className="font-medium">{property.types.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">
                  {ready ? t("properties.details.description") : "Описание"}
                </span>
                <span className="font-medium">
                  {formatDate(property.created_at)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
